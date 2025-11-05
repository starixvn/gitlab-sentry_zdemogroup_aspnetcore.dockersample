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
    } else if (fs.existsSync(args[0])) {
        // Convert specific file
        const deleteOriginal = args.includes('--delete');
        const xlsxPath = convertCsvToXlsx(args[0]);
        
        if (deleteOriginal) {
            fs.unlinkSync(args[0]);
            console.log(`\n✓ Deleted original CSV`);
        }
    } else {
        console.log(`
Usage:
  node convert_to_xlsx.js                    - Convert all CSV files in C:\\BG
  node convert_to_xlsx.js --latest           - Convert only the latest CSV file
  node convert_to_xlsx.js --all [directory]  - Convert all CSV files in directory
  node convert_to_xlsx.js --delete-csv       - Convert all and delete CSV files
  node convert_to_xlsx.js <file.csv>         - Convert specific file
  node convert_to_xlsx.js <file.csv> --delete - Convert and delete original

Examples:
  node convert_to_xlsx.js
  node convert_to_xlsx.js --latest
  node convert_to_xlsx.js C:\\BG\\BG-04-11-2024sc.csv
  node convert_to_xlsx.js --delete-csv
        `);
    }
}

module.exports = {
    convertCsvToXlsx,
    convertAllCsvToXlsx,
    convertLatestCsvToXlsx
};

