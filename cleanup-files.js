const fs = require('fs');
const path = require('path');
const config = require('./config.js');

/**
 * Delete all XLSX and CSV files in a directory
 * @param {string} directory - Directory to clean (default: C:\BG)
 * @param {boolean} dryRun - If true, only show what would be deleted without actually deleting
 * @returns {Object} Result with deleted files count and list
 */
function deleteAllXlsxAndCsv(directory = null, dryRun = false) {
    if (!directory) directory = config.downloadDir;
    try {
        if (!fs.existsSync(directory)) {
            console.log(`❌ Directory not found: ${directory}`);
            return { success: false, error: 'Directory not found', deleted: [] };
        }

        const files = fs.readdirSync(directory);
        const xlsxFiles = files.filter(f => f.toLowerCase().endsWith('.xlsx'));
        const csvFiles = files.filter(f => f.toLowerCase().endsWith('.csv'));
        const allFiles = [...xlsxFiles, ...csvFiles];

        if (allFiles.length === 0) {
            console.log(`ℹ No XLSX or CSV files found in: ${directory}`);
            return { success: true, deleted: [], count: 0 };
        }

        console.log(`\n📁 Found ${allFiles.length} file(s) in ${directory}:`);
        console.log(`  XLSX files: ${xlsxFiles.length}`);
        console.log(`  CSV files: ${csvFiles.length}`);
        console.log('');

        if (dryRun) {
            console.log('🔍 DRY RUN - Files that would be deleted:');
            allFiles.forEach((file, idx) => {
                const filePath = path.join(directory, file);
                const stats = fs.statSync(filePath);
                const size = (stats.size / 1024).toFixed(2);
                console.log(`  ${idx + 1}. ${file} (${size} KB)`);
            });
            console.log('\nℹ No files were actually deleted (dry run mode)');
            return { success: true, deleted: allFiles, count: allFiles.length, dryRun: true };
        }

        const deletedFiles = [];
        const failedFiles = [];

        allFiles.forEach(file => {
            const filePath = path.join(directory, file);
            try {
                fs.unlinkSync(filePath);
                deletedFiles.push(file);
                console.log(`  ✓ Deleted: ${file}`);
            } catch (error) {
                failedFiles.push({ file, error: error.message });
                console.error(`  ✗ Failed to delete ${file}: ${error.message}`);
            }
        });

        console.log(`\n✅ Cleanup complete!`);
        console.log(`  Deleted: ${deletedFiles.length} file(s)`);
        if (failedFiles.length > 0) {
            console.log(`  Failed: ${failedFiles.length} file(s)`);
        }

        return {
            success: true,
            deleted: deletedFiles,
            failed: failedFiles,
            count: deletedFiles.length
        };

    } catch (error) {
        console.error(`❌ Error during cleanup:`, error.message);
        return { success: false, error: error.message, deleted: [] };
    }
}


function deleteXlsxAndCsvBySport(sportCode = null) {
    if (!sportCode) return;
    const directory = config.downloadDir;
    const files = fs.readdirSync(directory);
    const xlsxFiles = files.filter(f => f.toLowerCase().endsWith('.xlsx'));
    const csvFiles = files.filter(f => f.toLowerCase().endsWith('.csv'));
    const allFiles = [...xlsxFiles, ...csvFiles];
    const sportFiles = allFiles.filter(f => f.toLowerCase().includes(sportCode.toLowerCase() + "."));
    sportFiles.forEach(file => {
        const filePath = path.join(directory, file);
        fs.unlinkSync(filePath);
        console.log(`  ✓ Deleted: ${file}`);
    });
    console.log(`\n✅ Cleanup complete!`);
    console.log(`  Deleted: ${sportFiles.length} file(s)`);
    return {
        success: true,
        deleted: sportFiles,
        count: sportFiles.length
    };
}

module.exports = {
    deleteAllXlsxAndCsv,
    deleteXlsxAndCsvBySport
};

