const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Betgenius Automation', () => {
  test('Login and download soccer data', async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes
    
    try {
        console.log('Navigating to Betgenius login page...');
        await page.goto('https://dataservices.betgenius.com/DataServices.WebClient/Login.aspx');
        
        // Wait for the page to load
        await page.waitForLoadState('networkidle');
        
        // Verify browser timezone
        const timezone = await page.evaluate(() => {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        });
        console.log(`Browser timezone: ${timezone}`);
        
        console.log('Filling login credentials...');
        // Fill username
        await page.fill('input[name="ctl00$MainContent$txtUsername"], input[type="text"]', 'livesupport@enpine.com');
        
        // Fill password (decoded from base64)
        const passwordBase64 = 'IVFBWjJ3c3g=';
        const password = Buffer.from(passwordBase64, 'base64').toString('utf-8');
        await page.fill('input[name="ctl00$MainContent$txtPassword"], input[type="password"]', password);
        
        // Click login button
        console.log('Clicking login button...');
        await page.click('input[type="submit"], input[value*="Login"], button[type="submit"]');
        
        // Wait for navigation after login
        await page.waitForLoadState('networkidle');
        
        console.log('Login successful, looking for Soccer section...');
        
        // Look for Soccer/Football/Futsal section
        // Use exact match to avoid matching "American Football"
        let soccerElement = null;
        
        // Try to find Football link with exact text match
        const allLinks = await page.locator('a').all();
        for (const link of allLinks) {
            const text = await link.textContent();
            if (text && text.trim() === 'Football') {
                soccerElement = link;
                console.log('Found Football section with exact match');
                break;
            }
        }
        
        // If not found, try other exact matches
        if (!soccerElement) {
            const soccerTexts = ['Soccer', 'Futsal'];
            for (const searchText of soccerTexts) {
                const allElements = await page.locator('a').all();
                for (const element of allElements) {
                    const text = await element.textContent();
                    if (text && text.trim() === searchText) {
                        soccerElement = element;
                        console.log(`Found ${searchText} section with exact match`);
                    break;
                    }
                }
                if (soccerElement) break;
            }
        }
        
        if (soccerElement) {
            console.log('Found Soccer section, clicking...');
            try {
                await soccerElement.click();
                await page.waitForLoadState('networkidle');
                console.log('Successfully navigated to Soccer section');
            } catch (clickError) {
                console.log('Failed to click Soccer section, trying alternative approach...');
                await soccerElement.click({ force: true });
                await page.waitForLoadState('networkidle');
            }
        } else {
            console.log('❌ Soccer/Football section not found with exact match');
            await page.screenshot({ path: 'soccer_not_found.png' });
            throw new Error('Cannot find Football section, please check if the website structure has changed');
        }
        
        // Get current day and determine download range
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        console.log(`Today is day ${dayOfWeek} of the week`);
        
        // Determine download range based on day
        let downloadDays = [];
        switch (dayOfWeek) {
            case 1: // Monday - download to Friday (5 days)
                downloadDays = [1, 2, 3, 4, 5];
                break;
            case 2: // Tuesday - download to Saturday (5 days)
                downloadDays = [2, 3, 4, 5, 6];
                break;
            case 3: // Wednesday - download to Sunday (5 days)
                downloadDays = [3, 4, 5, 6, 0];
                break;
            case 4: // Thursday - download to Saturday (3 days)
                downloadDays = [4, 5, 6];
                break;
            case 5: // Friday - download to Monday (4 days)
                downloadDays = [5, 6, 0, 1];
                break;
            case 6: // Saturday - download to Wednesday (5 days)
                downloadDays = [6, 0, 1, 2, 3];
                break;
            case 0: // Sunday - download to Thursday (4 days)
                downloadDays = [0, 1, 2, 3];
                break;
        }
        
        console.log(`Download days: ${downloadDays.join(', ')}`);
        
        // Click filter toggle to open date filter
        console.log('Opening date filter...');
        await page.waitForTimeout(2000);
        try {
            const filterToggle = await page.locator('.filter-toggle-arrow-container').first();
            await filterToggle.waitFor({ state: 'visible', timeout: 5000 });
            await filterToggle.click();
            console.log('Date filter opened successfully');
            await page.waitForTimeout(1500);
        } catch (filterError) {
            console.log('Filter toggle not found or not clickable:', filterError.message);
            await page.screenshot({ path: 'filter_toggle_not_found.png' });
        }
        
        // Adjust date filter timeline based on download requirements
        console.log('Adjusting date filter timeline...');
        try {
            // Wait for timeline filter to be visible
            const timelineFilter = await page.locator('.filter-section.timeline-status-filter').first();
            await timelineFilter.waitFor({ state: 'visible', timeout: 5000 });
            console.log('Timeline filter found');
            
            // Map day names for the timeline
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            // Start day is always "Today", only end day changes based on current day
            const startDay = 'Today';
            let endDay, description;
            switch (dayOfWeek) {
                case 1: // Monday
                    endDay = 'Fri';
                    description = 'Today (Monday) to Friday (5 days)';
                    break;
                case 2: // Tuesday
                    endDay = 'Sat';
                    description = 'Today (Tuesday) to Saturday (5 days)';
                    break;
                case 3: // Wednesday
                    endDay = 'Sun';
                    description = 'Today (Wednesday) to Sunday (5 days)';
                    break;
                case 4: // Thursday
                    endDay = 'Sat';
                    description = 'Today (Thursday) to Saturday (3 days)';
                    break;
                case 5: // Friday
                    endDay = 'Mon';
                    description = 'Today (Friday) to Monday (4 days)';
                    break;
                case 6: // Saturday
                    endDay = 'Wed';
                    description = 'Today (Saturday) to Wednesday (5 days)';
                    break;
                case 0: // Sunday
                    endDay = 'Thu';
                    description = 'Today (Sunday) to Thursday (4 days)';
                    break;
                }
            
            console.log(`Setting timeline range: ${description}`);
            
            // Try to find and manipulate the slider handles
            const sliderHandles = await timelineFilter.locator('.ui-slider-handle').all();
            if (sliderHandles.length >= 2) {
                console.log(`Found ${sliderHandles.length} slider handles`);
                
                // Adjust left handle to the start of "Today"
                console.log('Adjusting left handle to Today start position...');
                try {
                    const todayLabel = await timelineFilter.locator('text=Today').first();
                    const todayBox = await todayLabel.boundingBox();
                    
                    if (todayBox) {
                        const leftHandle = sliderHandles[0];
                        const handleBox = await leftHandle.boundingBox();
                        
                        if (handleBox) {
                            const todayStartX = todayBox.x;
                            const handleY = handleBox.y + (handleBox.height / 2);
                            
                            await leftHandle.hover();
                            await page.mouse.down();
                            await page.mouse.move(todayStartX, handleY, { steps: 10 });
                            await page.mouse.up();
                            console.log('Left handle set to Today start');
                        }
                    }
                } catch (dragError) {
                    console.log('Could not adjust left handle:', dragError.message);
                }
                
                await page.waitForTimeout(500);
                
                // Adjust right handle to the end of target day
                try {
                    const todayBox = await timelineFilter.locator('text=Today').first().boundingBox();
                    
                    // Find all instances of the target day text within the timeline
                    const targetDayElements = await timelineFilter.locator(`text=${endDay}`).all();
                    let targetLabel = null;
                    
                    // Find the one that's to the right of Today (future date)
                    for (const element of targetDayElements) {
                        const elementBox = await element.boundingBox();
                        if (elementBox && todayBox && elementBox.x > todayBox.x) {
                            targetLabel = element;
                            break;
                        }
                    }
                    
                    if (targetLabel) {
                        const targetBox = await targetLabel.boundingBox();
                        const rightHandle = sliderHandles[1];
                        const handleBox = await rightHandle.boundingBox();
                        
                        if (targetBox && handleBox) {
                            const targetEndX = targetBox.x + targetBox.width;
                            const handleY = handleBox.y + (handleBox.height / 2);
                            
                            await rightHandle.hover();
                            await page.mouse.down();
                            await page.mouse.move(targetEndX, handleY, { steps: 10 });
                            await page.mouse.up();
                        }
                    }
                } catch (dragError) {
                    console.log('Could not adjust right handle:', dragError.message);
                }
                
                await page.waitForTimeout(500);
                console.log(`Timeline adjusted to: ${description}`);
            } else {
                console.log('Slider handles not found, timeline may not be adjustable');
            }
        } catch (timelineError) {
            console.log('Could not adjust timeline filter:', timelineError.message);
        }
        
        // Prepare download path and filename
        const targetDir = 'C:\\BG';
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`Created directory: ${targetDir}`);
        }
        
        // Format date as DD-MM-YYYY
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const dateStr = `${day}-${month}-${year}`;
        const targetFileName = `BG-${dateStr}sc.csv`;
        const targetPath = path.join(targetDir, targetFileName);
        
        console.log(`Target file: ${targetPath}`);
        
        // Delete existing file if it exists (force overwrite)
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
            console.log(`Deleted existing file: ${targetPath}`);
        }
        
        // Click CSV export button and handle download
        console.log('Looking for CSV export button...');
        try {
            const csvExportButton = await page.locator('.csv-export-button').first();
            await csvExportButton.waitFor({ state: 'visible', timeout: 10000 });
            console.log('CSV export button found, clicking...');
            
            // Start waiting for download before clicking
            const downloadPromise = page.waitForEvent('download');
            await csvExportButton.click();
            console.log('Download initiated...');
            
            // Wait for the download to complete
            const download = await downloadPromise;
            console.log('Download started, saving file...');
            
            // Save the downloaded file to the target path
            await download.saveAs(targetPath);
            console.log(`File saved successfully to: ${targetPath}`);
            
        } catch (exportError) {
            console.log('CSV export or download failed:', exportError.message);
            await page.screenshot({ path: 'csv_export_error.png' });
            throw new Error('Cannot download CSV file');
        }
        
        console.log('Automation completed successfully!');
        
        // Verify we are on the correct page
        await expect(page).toHaveURL(/betgenius/);
        
    } catch (error) {
        console.error('Error during automation:', error);
        await page.screenshot({ path: 'error_screenshot.png' });
        throw error; // Re-throw error to fail the test
    }
  });
});
