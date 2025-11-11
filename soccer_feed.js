const XLSX = require("xlsx");
const fs = require("fs");

function processSoccerFeed(xlsxFilePath) {
  try {
    console.log(`Processing soccer feed file: ${xlsxFilePath}`);

    // Get the skipping date range
    const { startOffset, endOffset } = dateRangeForSkippingFeeds();
    console.log(
      `Skipping date range: ${startOffset.toISOString()} to ${endOffset.toISOString()}`
    );

    // Read the XLSX file
    const workbook = XLSX.readFile(xlsxFilePath);

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON array for processing
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });

    console.log(`Loaded ${data.length} rows from XLSX file`);

    // Filter out rows that should be skipped
    const filteredData = [];

    // Keep header row (first row)
    if (data.length > 0) {
      filteredData.push(data[0]);
    }

    // Process each data row starting from row 2 (index 1)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const timeValue = row[4]; // Column E (index 4) - Time
      const feedValue = row[5]; // Column F (index 5) - Feed

      // Check if this row should be skipped
      let shouldSkip = shouldSkipRow(
        timeValue,
        feedValue,
        startOffset,
        endOffset
      );

      // Keep the row if it shouldn't be skipped
      if (!shouldSkip) {
        filteredData.push(row);
      }
    }

    // Create new workbook with filtered data
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet(filteredData);

    // Set auto width for all columns and format date cells
    const range = XLSX.utils.decode_range(newWorksheet["!ref"]);
    const cols = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      cols.push({ wch: 20 }); // Auto width
    }
    newWorksheet["!cols"] = cols;

    // Format date cells in column E
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }); // Column E (index 4)
      if (newWorksheet[cellAddress]) {
        newWorksheet[cellAddress].z = "m/d/yyyy h:mm";
      }
    }

    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

    // Write the filtered XLSX file (overwrite original)
    XLSX.writeFile(newWorkbook, xlsxFilePath);

    console.log(`✓ Soccer feed processing completed successfully`);
    console.log(`  File: ${xlsxFilePath}`);
    console.log(`  Total rows: ${data.length}`);
    console.log(`  Processed rows: ${filteredData.length}`);

    return xlsxFilePath;
  } catch (error) {
    console.error("❌ Error processing soccer feed:", error.message);
    throw error;
  }
}

function shouldSkipRow(timeValue, feedValue, startOffset, endOffset) {
  let shouldSkip = false;
  const rowTime = parseRowTime(timeValue);

  if (rowTime < startOffset) {
    return true;
  }

  const isFeedEmpty =
    feedValue === "" || feedValue === null || feedValue === undefined;
  if (!isFeedEmpty) {
    return false;
  }

  const isInRange = rowTime >= startOffset && rowTime <= endOffset;
  if (isInRange && isFeedEmpty) {
    shouldSkip = true;
  }

  return shouldSkip;
}


function parseRowTime(timeValue) {
  let rowTime;
  if (timeValue instanceof Date) {
    rowTime = timeValue;
  } else if (typeof timeValue === "string") {
    // Try to parse as date string
    rowTime = new Date(timeValue);
    if (isNaN(rowTime.getTime())) {
      // If parsing fails, try Excel date format
      const excelDate = parseFloat(timeValue);
      if (!isNaN(excelDate)) {
        const dateObj = XLSX.SSF.parse_date_code(excelDate);
        rowTime = new Date(
          dateObj.y,
          dateObj.m - 1,
          dateObj.d,
          dateObj.H,
          dateObj.M,
          dateObj.S
        );
      }
    }
  } else if (typeof timeValue === "number") {
    // Excel date serial number
    const dateObj = XLSX.SSF.parse_date_code(timeValue);
    rowTime = new Date(
      dateObj.y,
      dateObj.m - 1,
      dateObj.d,
      dateObj.H,
      dateObj.M,
      dateObj.S
    );
  }

  return rowTime;
}

function getTodayNoon() {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return today;
}

function dateRangeForSkippingFeeds() {
  const dayOfWeek = new Date().getDay();
  let startOffset, endOffset;

  startOffset = getTodayNoon();
  endOffset = new Date(startOffset);
  const addingDays = dayOfWeek === 1 || dayOfWeek === 6 ? 5 : 4;
  endOffset.setDate(startOffset.getDate() + addingDays);
  endOffset.setMinutes(endOffset.getMinutes() - 1);

  return { startOffset, endOffset };
}

if (require.main === module) {
  const xlsxFilePath = "C:\\BG\\BG-11-11-2025sco.xlsx";
  processSoccerFeed(xlsxFilePath);
}

module.exports = { processSoccerFeed };
