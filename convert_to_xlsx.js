const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

/**
 * Convert CSV file to XLSX (Excel) format
 * @param {string} csvFilePath - Path to the CSV file
 * @param {string} xlsxFilePath - Optional output path (defaults to same name with .xlsx extension)
 * @returns {string} Path to the created XLSX file
 */
function convertCsvToXlsx(csvFilePath, xlsxFilePath = null) {
    try {
        // Check if CSV file exists
        if (!fs.existsSync(csvFilePath)) {
            throw new Error(`CSV file not found: ${csvFilePath}`);
        }

        // If no output path specified, use same name with .xlsx extension
        if (!xlsxFilePath) {
            const dir = path.dirname(csvFilePath);
            const basename = path.basename(csvFilePath, '.csv');
            xlsxFilePath = path.join(dir, `${basename}.xlsx`);
        }

        console.log(`Converting CSV to XLSX:`);
        console.log(`  Input:  ${csvFilePath}`);
        console.log(`  Output: ${xlsxFilePath}`);

        // Read the CSV file
        const workbook = XLSX.readFile(csvFilePath);
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Create a new workbook
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, sheetName);

        // Write XLSX file
        XLSX.writeFile(newWorkbook, xlsxFilePath);

        // Get file sizes
        const csvSize = fs.statSync(csvFilePath).size;
        const xlsxSize = fs.statSync(xlsxFilePath).size;

        console.log(`✓ Conversion successful!`);
        console.log(`  CSV size:  ${(csvSize / 1024).toFixed(2)} KB`);
        console.log(`  XLSX size: ${(xlsxSize / 1024).toFixed(2)} KB`);

        return xlsxFilePath;
    } catch (error) {
        console.error('❌ Error converting CSV to XLSX:', error.message);
        throw error;
    }
}

/**
 * Convert all CSV files in a directory to XLSX
 * @param {string} directory - Directory path
 * @param {boolean} deleteOriginal - Whether to delete the original CSV files
 * @returns {Array} Array of converted file paths
 */
function convertAllCsvToXlsx(directory, deleteOriginal = false) {
    try {
        console.log(`\nConverting all CSV files in: ${directory}\n`);

        if (!fs.existsSync(directory)) {
            throw new Error(`Directory not found: ${directory}`);
        }

        const files = fs.readdirSync(directory);
        const csvFiles = files.filter(f => f.toLowerCase().endsWith('.csv'));

        if (csvFiles.length === 0) {
            console.log('No CSV files found in directory.');
            return [];
        }

        console.log(`Found ${csvFiles.length} CSV file(s):\n`);

        const convertedFiles = [];

        for (const csvFile of csvFiles) {
            const csvPath = path.join(directory, csvFile);
            
            try {
                const xlsxPath = convertCsvToXlsx(csvPath);
                convertedFiles.push(xlsxPath);

                if (deleteOriginal) {
                    fs.unlinkSync(csvPath);
                    console.log(`  ✓ Deleted original CSV: ${csvFile}`);
                }

                console.log('');
            } catch (error) {
                console.error(`  ✗ Failed to convert ${csvFile}:`, error.message);
            }
        }

        console.log(`\n✓ Converted ${convertedFiles.length} of ${csvFiles.length} files`);

        return convertedFiles;
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

/**
 * Convert the latest CSV file in a directory to XLSX
 * @param {string} directory - Directory path
 * @param {boolean} deleteOriginal - Whether to delete the original CSV file
 * @returns {string|null} Path to converted file or null if no CSV found
 */
function convertLatestCsvToXlsx(directory, deleteOriginal = false) {
    try {
        if (!fs.existsSync(directory)) {
            throw new Error(`Directory not found: ${directory}`);
        }

        const files = fs.readdirSync(directory);
        const csvFiles = files
            .filter(f => f.toLowerCase().endsWith('.csv'))
            .map(f => ({
                name: f,
                path: path.join(directory, f),
                time: fs.statSync(path.join(directory, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        if (csvFiles.length === 0) {
            console.log('No CSV files found.');
            return null;
        }

        const latestCsv = csvFiles[0];
        console.log(`\nConverting latest CSV file: ${latestCsv.name}\n`);

        const xlsxPath = convertCsvToXlsx(latestCsv.path);

        if (deleteOriginal) {
            fs.unlinkSync(latestCsv.path);
            console.log(`\n✓ Deleted original CSV: ${latestCsv.name}`);
        }

        return xlsxPath;
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

// Command-line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Default: convert all CSV files in download directory
        const bgDir = config.downloadDir;
        convertAllCsvToXlsx(bgDir, false);
    } else if (args[0] === '--latest') {
        // Convert only the latest CSV file
        const bgDir = config.downloadDir;
        convertLatestCsvToXlsx(bgDir, false);
    } else if (args[0] === '--all') {
        // Convert all CSV files
        const bgDir = args[1] || config.downloadDir;
        const deleteOriginal = args.includes('--delete');
        convertAllCsvToXlsx(bgDir, deleteOriginal);
    } else if (args[0] === '--delete-csv') {
        // Convert all and delete originals
        const bgDir = args[1] || config.downloadDir;
        convertAllCsvToXlsx(bgDir, true);
    } else if (args[0] === '--merge-rugby') {
        // Merge rugbyLeague and rugbyUnion files
        const bgDir = args[1] || config.downloadDir;
        const dateStr = args[2] || null;
        mergeRugbyFiles(bgDir, dateStr);
    } else if (fs.existsSync(args[0])) {
        // Convert specific file
        const deleteOriginal = args.includes('--delete');
        const xlsxPath = convertCsvToXlsx(args[0]);
        
        if (deleteOriginal) {
            fs.unlinkSync(args[0]);
            console.log(`\n✓ Deleted original CSV`);
        }
    }
}

/**
 * Merge rugbyLeague and rugbyUnion XLSX files into one XLSX file
 * @param {string} directory - Directory path (defaults to config.downloadDir)
 * @param {string} dateStr - Date string in DD-MM-YYYY format (optional, defaults to today)
 * @returns {string} Path to the merged XLSX file
 */
function mergeRugbyFiles(directory = null, dateStr = null) {
    try {
        const targetDir = directory || config.downloadDir;
        
        // Get date string if not provided
        if (!dateStr) {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            dateStr = `${day}-${month}-${year}`;
        }
        
        // File paths based on sports-config.js
        // rugbyLeague uses fileCode: 'rugby', rugbyUnion uses fileCode: 'ru'
        const rugbyLeaguePath = path.join(targetDir, `BG-${dateStr}rl.xlsx`);
        const rugbyUnionPath = path.join(targetDir, `BG-${dateStr}ru.xlsx`);
        
        console.log(`\nMerging Rugby files:`);
        console.log(`  Rugby League: ${path.basename(rugbyLeaguePath)}`);
        console.log(`  Rugby Union:  ${path.basename(rugbyUnionPath)}`);
        
        // Check if files exist
        if (!fs.existsSync(rugbyLeaguePath)) {
            throw new Error(`Rugby League file not found: ${rugbyLeaguePath}`);
        }
        
        if (!fs.existsSync(rugbyUnionPath)) {
            throw new Error(`Rugby Union file not found: ${rugbyUnionPath}`);
        }
        
        // Read both XLSX files
        const leagueWorkbook = XLSX.readFile(rugbyLeaguePath);
        const unionWorkbook = XLSX.readFile(rugbyUnionPath);
        
        // Get the first sheet from each workbook
        const leagueSheetName = leagueWorkbook.SheetNames[0];
        const unionSheetName = unionWorkbook.SheetNames[0];
        const leagueSheet = leagueWorkbook.Sheets[leagueSheetName];
        const unionSheet = unionWorkbook.Sheets[unionSheetName];
        
        // Convert sheets to JSON arrays
        const leagueData = XLSX.utils.sheet_to_json(leagueSheet, { header: 1, defval: '' });
        const unionData = XLSX.utils.sheet_to_json(unionSheet, { header: 1, defval: '' });
        
        console.log(`  Rugby League rows: ${leagueData.length}`);
        console.log(`  Rugby Union rows:  ${unionData.length}`);
        
        // Combine data: header from league, then all league data, then union data (skip header)
        const mergedData = [];
        
        // Add header from league file
        if (leagueData.length > 0) {
            mergedData.push(leagueData[0]);
        }
        
        // Add all data rows from league (skip header)
        for (let i = 1; i < leagueData.length; i++) {
            mergedData.push(leagueData[i]);
        }
        
        // Add all data rows from union (skip header)
        for (let i = 1; i < unionData.length; i++) {
            mergedData.push(unionData[i]);
        }
        
        console.log(`  Merged rows: ${mergedData.length}`);
        
        // Create new workbook with merged data
        const mergedWorkbook = XLSX.utils.book_new();
        const mergedSheet = XLSX.utils.aoa_to_sheet(mergedData);
        XLSX.utils.book_append_sheet(mergedWorkbook, mergedSheet, 'Rugby');
        
        // Output file path
        const mergedFilePath = path.join(targetDir, `BG-${dateStr}rugby.xlsx`);
        
        // Write merged XLSX file
        XLSX.writeFile(mergedWorkbook, mergedFilePath);
        
        // Get file size
        const mergedSize = fs.statSync(mergedFilePath).size;
        
        console.log(`✓ Merge successful!`);
        console.log(`  Output: ${path.basename(mergedFilePath)}`);
        console.log(`  Size: ${(mergedSize / 1024).toFixed(2)} KB`);
        
        // Delete original files after successful merge
        try {
            fs.unlinkSync(rugbyLeaguePath);
            console.log(`  ✓ Deleted: ${path.basename(rugbyLeaguePath)}`);
        } catch (deleteError) {
            console.log(`  ⚠ Could not delete Rugby League file: ${deleteError.message}`);
        }
        
        try {
            fs.unlinkSync(rugbyUnionPath);
            console.log(`  ✓ Deleted: ${path.basename(rugbyUnionPath)}`);
        } catch (deleteError) {
            console.log(`  ⚠ Could not delete Rugby Union file: ${deleteError.message}`);
        }
        
        return mergedFilePath;
    } catch (error) {
        console.error('❌ Error merging Rugby files:', error.message);
        throw error;
    }
}

module.exports = {
    convertCsvToXlsx,
    convertAllCsvToXlsx,
    convertLatestCsvToXlsx,
    mergeRugbyFiles
};

