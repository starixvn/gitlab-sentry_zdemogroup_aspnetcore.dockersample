const XLSX = require("xlsx");
const fs = require("fs");
const config = require("./config.js");
const path = require("path");

function formatXlsxDateCells(worksheet) {
  // Format all cells in column E with custom date format: m/d/yyyy h:mm
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }); // Column E (index 4)
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].z = "m/d/yyyy h:mm";
    }
  }
}

function setXlsxColumnWidths(worksheet) {
  if (!worksheet["!cols"]) {
    worksheet["!cols"] = [];
  }
  worksheet["!cols"][0] = { wch: 30 }; // Column A (index 0)
  worksheet["!cols"][1] = { wch: 10 }; // Column B (index 1)
  worksheet["!cols"][2] = { wch: 10 }; // Column C (index 2)
  worksheet["!cols"][3] = { wch: 30 }; // Column D (index 3)
  worksheet["!cols"][4] = { wch: 15 }; // Column E (index 4)
  worksheet["!cols"][5] = { wch: 15 }; // Column F (index 5)
  worksheet["!cols"][6] = { wch: 15 }; // Column G (index 6)
}

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

function filterDataByDate(data, targetDate) {
  const timeFrom = new Date(targetDate);
  timeFrom.setHours(12, 0, 0, 0);
  const timeTo = new Date(timeFrom);
  timeTo.setDate(timeFrom.getDate() + 1);
  timeTo.setMinutes(timeTo.getMinutes() - 1);

  return data.filter((row) => {
    const timeValue = parseRowTime(row[4]); // Column E (index 4) - Time
    return timeValue >= timeFrom && timeValue <= timeTo;
  });
}

function splitFileByDate(xlsxFilePath) {  
  const backupFilePath = xlsxFilePath + ".bak.xlsx";
  fs.renameSync(xlsxFilePath, backupFilePath);

  // Read the XLSX file
  const workbook = XLSX.readFile(backupFilePath);

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON array for processing
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });
  
  // Get today
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const filteredData = filterDataByDate(data, targetDate);
    const filepath = getFilePathForDate(targetDate);
    const newWorkbook = XLSX.utils.book_new();
    filteredData.unshift(data[0]); // add header row back
    const newWorksheet = XLSX.utils.aoa_to_sheet(filteredData);

    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

    setXlsxColumnWidths(newWorksheet);
    formatXlsxDateCells(newWorksheet);
    
    // Write the filtered XLSX file (overwrite original)
    XLSX.writeFile(newWorkbook, filepath);

    console.log(`✓ Splited soccer Soccer for ${targetDate.toDateString()}`);
    console.log(`  File: ${filepath}`);
    console.log(`  Total rows: ${data.length}`);    
  }

  fs.unlinkSync(backupFilePath);
  console.log(`✓ Deleted backup file: ${backupFilePath}`);
}

function getFilePathForDate(targetDate) {
  const targetDir = config.downloadDir;
  const day = String(targetDate.getDate()).padStart(2, "0");
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const year = targetDate.getFullYear();
  const dateStr = `${day}-${month}-${year}`;
  return path.join(targetDir, `BG-${dateStr}sc.xlsx`);
}

function correctOtherSportsFiles(fileCodes) {
  // get all files in the download directory
  const files = fs.readdirSync(config.downloadDir);
  const fileSuffixes = fileCodes.map(code => `${code}.xlsx`);
  files.forEach((filepath) => {
    const matched = fileSuffixes.some(suffix => filepath.endsWith(suffix));
    if (matched) {
      const fullPath = path.join(config.downloadDir, filepath);
      correctOtherSportsFile(fullPath);
    }
  });
}

function correctOtherSportsFile(xlsxFilePath) {
  // read the XLSX file
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const beginOfWeek1 = new Date(today);
  beginOfWeek1.setDate(today.getDate() - today.getDay());
  beginOfWeek1.setHours(12, 0, 0, 0);

  const endOfWeek1 = new Date(beginOfWeek1);
  endOfWeek1.setDate(beginOfWeek1.getDate() + 7);
  endOfWeek1.setHours(11, 59, 59, 999);

  const beginOfWeek2 = new Date(beginOfWeek1);
  beginOfWeek2.setDate(beginOfWeek1.getDate() + 7);
  
  const endOfWeek2 = new Date(endOfWeek1);
  endOfWeek2.setDate(endOfWeek1.getDate() + 7);
  
  console.log(`Begin of Week 1: ${beginOfWeek1}`);
  console.log(`End of Week 1: ${endOfWeek1}`);
  console.log(`Begin of Week 2: ${beginOfWeek2}`);
  console.log(`End of Week 2: ${endOfWeek2}`);
  
   // Convert sheet to JSON array for processing
  const data = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  const correctedDataWeek1 = data.filter((row, index) => {
    if (index === 0) return true; // keep header row
    const timeValue = parseRowTime(row[4]); // Column E (index 4) - Time
    return timeValue >= today && timeValue <= endOfWeek1;
  });

  const correctDataWeek2 = data.filter((row, index) => {
    if (index === 0) return true; // keep header row
    const timeValue = parseRowTime(row[4]); // Column E (index 4) - Time
    return timeValue >= beginOfWeek2 && timeValue <= endOfWeek2;  
  });

  const regex = /\d{2}-\d{2}-\d{4}/;
  const dateStringWeek1 = `${beginOfWeek1.getDate().toString().padStart(2, '0')}-${(beginOfWeek1.getMonth() + 1).toString().padStart(2, '0')}-${beginOfWeek1.getFullYear()}`;
  const newFilePathWeek1 = xlsxFilePath.replace(regex, dateStringWeek1);

  const dateStringWeek2 = `${beginOfWeek2.getDate().toString().padStart(2, '0')}-${(beginOfWeek2.getMonth() + 1).toString().padStart(2, '0')}-${beginOfWeek2.getFullYear()}`;
  const newFilePathWeek2 = xlsxFilePath.replace(regex, dateStringWeek2);

  fs.unlinkSync(xlsxFilePath);

  // write back corrected data for week 1
  const newWorkbook1 = XLSX.utils.book_new();
  const newWorksheet1 = XLSX.utils.aoa_to_sheet(correctedDataWeek1);  
  XLSX.utils.book_append_sheet(newWorkbook1, newWorksheet1, sheetName);
  
  setXlsxColumnWidths(newWorksheet1);
  formatXlsxDateCells(newWorksheet1);  
  XLSX.writeFile(newWorkbook1, newFilePathWeek1);

  // write back corrected data for week 2
  const newWorkbook2 = XLSX.utils.book_new();
  const newWorksheet2 = XLSX.utils.aoa_to_sheet(correctDataWeek2);  
  XLSX.utils.book_append_sheet(newWorkbook2, newWorksheet2, sheetName);
  setXlsxColumnWidths(newWorksheet2);
  formatXlsxDateCells(newWorksheet2);
  XLSX.writeFile(newWorkbook2, newFilePathWeek2);
  
  console.log(`✓ Deleted original file: ${xlsxFilePath}`);
  console.log(`✓ Corrected other sports file: ${newFilePathWeek1} and ${newFilePathWeek2}`);
}

if (require.main === module) {
  const xlsxFilePath = "C:\\BG\\BG-11-11-2025sco.xlsx";
  processSoccerFeed(xlsxFilePath);
}

module.exports = { processSoccerFeed, splitFileByDate, correctOtherSportsFile, correctOtherSportsFiles };
