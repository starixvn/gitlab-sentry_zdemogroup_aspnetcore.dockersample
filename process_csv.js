const fs = require('fs');
const path = require('path');

/**
 * Process CSV file and add a 'Sports' column with 'Soccer' value
 * This method preserves the original format by directly manipulating text
 * @param {string} filePath - Path to the CSV file to process
 * @returns {Promise<void>}
 */
async function processCsvFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    // Read the entire file as text
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    
    if (lines.length === 0) {
        throw new Error('CSV file is empty');
    }
    
    // Get the header line
    const headerLine = lines[0];
    console.log(`✓ Original header: ${headerLine.trim()}`);
    
    // Check if 'Sports' column already exists
    if (headerLine.includes('Sports')) {
        console.log(`ℹ Column 'Sports' already exists, skipping processing`);
        return;
    }
    
    // Process the file line by line
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip empty lines at the end
        if (i > 0 && line.trim() === '') {
            processedLines.push(line);
            continue;
        }
        
        // Find the position of the first comma
        const firstCommaIndex = line.indexOf(',');
        
        if (firstCommaIndex === -1) {
            // No comma found, just add the line as is
            processedLines.push(line);
            continue;
        }
        
        // Insert 'Sports' or 'Soccer' after the first column
        const firstColumn = line.substring(0, firstCommaIndex);
        const restOfLine = line.substring(firstCommaIndex);
        
        if (i === 0) {
            // Header line: insert 'Sports' column name
            processedLines.push(`${firstColumn},Sports${restOfLine}`);
        } else {
            // Data line: insert 'Soccer' value
            processedLines.push(`${firstColumn},Soccer${restOfLine}`);
        }
    }
    
    console.log(`✓ Loaded ${lines.length - 1} data rows`);
    console.log(`✓ Added column 'Sports' (B欄) with value 'Soccer'`);
    console.log(`✓ New header: ${processedLines[0].trim()}`);
    
    // Write back to file with original encoding
    fs.writeFileSync(filePath, processedLines.join('\n'), 'utf-8');
    console.log(`✓ File saved successfully: ${filePath}`);
    
    // Show preview of first few rows
    if (processedLines.length > 1) {
        console.log('\nFirst 3 rows preview:');
        for (let i = 0; i < Math.min(4, processedLines.length); i++) {
            if (processedLines[i].trim()) {
                console.log(`Row ${i}: ${processedLines[i]}`);
            }
        }
    }
}

/**
 * Find and process the latest CSV file in the target directory
 */
async function processLatestCsv() {
    const targetDir = 'C:\\BG';
    
    // Get today's date in DD-MM-YYYY format
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    
    // Target file name
    const targetFile = path.join(targetDir, `BG-${dateStr}sc.csv`);
    
    // Check if file exists
    if (!fs.existsSync(targetFile)) {
        console.log(`❌ File not found: ${targetFile}`);
        console.log(`Looking for CSV files in ${targetDir}...`);
        
        // Try to find any CSV file in the directory
        if (fs.existsSync(targetDir)) {
            const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.csv'));
            if (files.length > 0) {
                console.log(`Found ${files.length} CSV file(s):`);
                files.forEach(f => console.log(`  - ${f}`));
                const csvFile = path.join(targetDir, files[0]);
                console.log(`Using: ${csvFile}`);
                await processCsvFile(csvFile);
            } else {
                console.log('No CSV files found in the directory.');
            }
        } else {
            console.log(`Directory not found: ${targetDir}`);
        }
    } else {
        await processCsvFile(targetFile);
    }
}

// If run directly from command line
if (require.main === module) {
    processLatestCsv()
        .then(() => {
            console.log('\n✓ CSV processing completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Error processing CSV:', error.message);
            process.exit(1);
        });
}

module.exports = { processCsvFile, processLatestCsv };
