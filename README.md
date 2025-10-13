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

## Setup

1. Install Node.js (if not already installed)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browser:
   ```bash
   npm run install-browser
   ```

## Usage

### Basic Script
Run the basic automation script:
```bash
npm start
```

Or directly with Node.js:
```bash
node betgenius_automation.js
```

### Advanced Script
Run the advanced automation script with better debugging and error handling:
```bash
npm run advanced
```

Or directly with Node.js:
```bash
node betgenius_advanced.js
```

The advanced script provides:
- Better error handling and debugging
- Multiple selector strategies for finding elements
- Screenshots at each step for troubleshooting
- More detailed logging
- Fallback strategies for clicking elements

### Final Script (Recommended)
Run the final optimized automation script:
```bash
npm run final
```

Or directly with Node.js:
```bash
node betgenius_final.js
```

The final script provides:
- Streamlined automation process
- Automatic file naming with timestamps
- Optimized for daily use
- Clean output and logging

## Configuration

The script uses the following credentials:
- Username: `livesupport@enpine.com`
- Password: `!QAZ2wsx`

## Downloads

Downloaded files will be saved to the `downloads` folder in the project directory.

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
