# Betgenius Automation Script

This script automates the login and data download process from Betgenius Data Services for multiple sports.

## Features

- Automated login with provided credentials
- **Support for 11 different sports**:
  - Soccer (Football)
  - Futsal (室內足球)
  - American Football
  - Aussie Rules
  - Baseball
  - Basketball
  - Cricket
  - Hockey (Field Hockey)
  - Rugby League
  - Rugby Union
  - Water Polo
- **Smart download logic**:
  - Soccer & Futsal: Day-based download (3-5 days based on current weekday)
  - Other sports: 1 week (7 days) from today
- **Special Futsal handling**: Automatically adds "Futsal" suffix to Competition column if missing
- **Automatic CSV processing**: Adds a 'Sports' column (B欄) with correct sport value (using Node.js)
- **Independent tests**: Each sport has its own test and downloads to a separate file

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

### Soccer Only (Original Test)
Run only the Soccer test:
```bash
npm test
```

### All Sports (Recommended)
Run tests for all 9 sports:
```bash
npm run test:all
```

### UI Mode for Debugging
```bash
npm run test:ui
```

### Run with Visible Browser
```bash
npm run test:headed
```

### What the Tests Do

**Soccer test** (`npm test`):
1. Login to Betgenius
2. Navigate to Soccer section
3. Set date range based on current day (3-5 days)
4. Download CSV file to `C:\BG\BG-{date}sc.csv`
5. Automatically process CSV to add 'Sports' column with 'Soccer' value

**All Sports test** (`npm run test:all`):
- Runs 11 independent tests (one per sport)
- Each sport downloads 1 week of data (except Soccer & Futsal which use day-based logic)
- Each sport saves to a separate file with sport-specific code:
  - Soccer: `BG-{date}sc.csv`
  - Futsal: `BG-{date}fs.csv` (with auto "Futsal" suffix in Competition column)
  - American Football: `BG-{date}af.csv`
  - Aussie Rules: `BG-{date}ar.csv`
  - Baseball: `BG-{date}bb.csv`
  - Basketball: `BG-{date}bk.csv`
  - Cricket: `BG-{date}ck.csv`
  - Hockey: `BG-{date}hk.csv`
  - Rugby League: `BG-{date}rl.csv`
  - Rugby Union: `BG-{date}ru.csv`
  - Water Polo: `BG-{date}wp.csv`
- Each CSV is automatically processed with the correct sport value

**Note:** 
- Test reports, screenshots, and videos are disabled to keep the workspace clean.
- If a sport has no events in the selected date range, the test will complete successfully without downloading (shows "No events found" message).

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

Downloaded files will be saved to `C:\BG\` directory with the naming format: `BG-{DD-MM-YYYY}{sport-code}.csv`

### Sport Codes
- `sc` - Soccer
- `fs` - Futsal
- `af` - American Football
- `ar` - Aussie Rules
- `bb` - Baseball
- `bk` - Basketball
- `ck` - Cricket
- `hk` - Hockey
- `rl` - Rugby League
- `ru` - Rugby Union
- `wp` - Water Polo

### CSV Sport Values
Each CSV file will be automatically processed to add a 'Sports' column (B欄) with the correct value:
- Soccer → `Soccer`
- Futsal → `Soccer` (with "Futsal" added to Competition column)
- American Football → `Football`
- Aussie Rules → `Other Sports`
- Baseball → `Baseball`
- Basketball → `Basketball`
- Cricket → `Cricket`
- Hockey → `Field Hockey`
- Rugby League → `Rugby`
- Rugby Union → `Rugby`
- Water Polo → `Water Polo`

### Special Futsal Processing
For Futsal downloads, the script automatically checks the Competition column (A欄):
- If the competition name doesn't end with "Futsal", it adds " Futsal" to the end
- If it already has "Futsal", it won't duplicate
- Example: `"Brazil Serie A"` becomes `"Brazil Serie A Futsal"`

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
