# Betgenius Automation Script

This script automates the login and data download process from Betgenius Data Services.

## Features

- Automated login with provided credentials
- Navigation to Soccer(Football/Futsal) section
- Day-based download logic:
  - Monday: Download to Friday (5 days)
  - Tuesday: Download to Saturday (5 days)
  - Wednesday: Download to Sunday (5 days)
  - Thursday: Download to Saturday (3 days)
  - Friday: Download to Monday (4 days)
  - Saturday: Download to Wednesday (5 days)
  - Sunday: Download to Thursday (4 days)
- **Automatic CSV processing**: Adds a 'Sports' column (B欄) with 'Soccer' value after download (using Node.js)

## Setup

1. Install Node.js (if not already installed)
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browser:
   ```bash
   npm run install-browser
   ```

## Usage

### Playwright Test (Recommended)
Run the Playwright test with automatic CSV processing:
```bash
npm test
```

Or with UI mode for debugging:
```bash
npm run test:ui
```

Or with visible browser:
```bash
npm run test:headed
```

The Playwright test will:
1. Login to Betgenius
2. Navigate to Soccer section
3. Set date range based on current day
4. Download CSV file to `C:\BG\BG-{date}sc.csv`
5. **Automatically process the CSV to add 'Sports' column (B欄) with 'Soccer' value**

**Note:** Test reports, screenshots, and videos are disabled to keep the workspace clean.

### Manual CSV Processing
If you want to manually process a CSV file:
```bash
npm run process-csv
```
or
```bash
node process_csv.js
```

This will find and process the latest CSV file in `C:\BG\` directory.

## Configuration

The script uses the following credentials:
- Username: `livesupport@enpine.com`
- Password: `!QAZ2wsx`

## Downloads

Downloaded files will be saved to `C:\BG\` directory with the naming format: `BG-{DD-MM-YYYY}sc.csv`

The CSV file will be automatically processed to add:
- Column B (Sports): Contains 'Soccer' value for all rows

## Troubleshooting

If the script encounters issues:
1. Check the generated screenshot files (`error_screenshot.png`, `soccer_not_found.png`, `download_not_found.png`)
2. Ensure you have a stable internet connection
3. Verify that the Betgenius website is accessible
4. Check if the website structure has changed (selectors may need updating)

## Notes

- The script runs in non-headless mode by default (you can see the browser)
- Set `headless: true` in the script to run without showing the browser
- The script includes error handling and debugging screenshots
