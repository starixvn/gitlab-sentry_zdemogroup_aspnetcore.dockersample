# Quick Start Guide

## 🚀 Quick Commands

### Download Soccer Only
```bash
npm test
```
Downloads Soccer data with day-based logic (3-5 days).
File: `C:\BG\BG-{date}sc.csv`

### Download All 11 Sports
```bash
npm run test:all
```
Downloads data for all sports (each test runs independently).
Files:
- `C:\BG\BG-{date}sc.csv` (Soccer)
- `C:\BG\BG-{date}fs.csv` (Futsal with auto "Futsal" suffix)
- `C:\BG\BG-{date}af.csv` (American Football)
- `C:\BG\BG-{date}ar.csv` (Aussie Rules)
- `C:\BG\BG-{date}bb.csv` (Baseball)
- `C:\BG\BG-{date}bk.csv` (Basketball)
- `C:\BG\BG-{date}ck.csv` (Cricket)
- `C:\BG\BG-{date}hk.csv` (Hockey)
- `C:\BG\BG-{date}rl.csv` (Rugby League)
- `C:\BG\BG-{date}ru.csv` (Rugby Union)
- `C:\BG\BG-{date}wp.csv` (Water Polo)

### UI Mode (Interactive)
```bash
npx playwright test --ui
```
Opens Playwright UI where you can:
- Select which sport(s) to run
- Watch tests execute
- Debug issues

### Manual CSV Processing
```bash
npm run process-csv
```
Manually process CSV files in `C:\BG\` directory.

## 📊 What Each Sport Downloads

| Sport | Days | CSV Value | File Code | Special Processing |
|-------|------|-----------|-----------|-------------------|
| Soccer | 3-5 days* | Soccer | sc | None |
| Futsal | 3-5 days* | Soccer | fs | ✅ Auto add "Futsal" to Competition |
| American Football | 7 days | Football | af | None |
| Aussie Rules | 7 days | Other Sports | ar | None |
| Baseball | 7 days | Baseball | bb | None |
| Basketball | 7 days | Basketball | bk | None |
| Cricket | 7 days | Cricket | ck | None |
| Hockey | 7 days | Field Hockey | hk | None |
| Rugby League | 7 days | Rugby | rl | None |
| Rugby Union | 7 days | Rugby | ru | None |
| Water Polo | 7 days | Water Polo | wp | None |

*Soccer & Futsal use day-based logic based on current weekday

## 📁 Output Files

All files are saved to `C:\BG\` with format: `BG-{DD-MM-YYYY}{code}.csv`

Example for October 14, 2025:
- `BG-14-10-2025sc.csv` (Soccer)
- `BG-14-10-2025fs.csv` (Futsal)
- `BG-14-10-2025af.csv` (American Football)
- etc.

Each CSV automatically has a "Sports" column (B欄) with the correct sport value.

## ⚙️ CSV Format

**Before Processing:**
```csv
Competition,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
NBA,12345,Lakers v Celtics,2025-10-15 10:00,ESPN,Booked,False
```

**After Processing:**
```csv
Competition,Sports,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
NBA,Basketball,12345,Lakers v Celtics,2025-10-15 10:00,ESPN,Booked,False
```

**Futsal Example (with A欄 special processing):**

**Before:**
```csv
"Competition",EventId,Event,Start (UTC+8),Feed,Booking Status,OST
"Brazil Serie A",12345,Team A v Team B,2025-10-15 10:00,ESPN,Booked,False
```

**After:**
```csv
"Competition",Sports,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
"Brazil Serie A Futsal",Soccer,12345,Team A v Team B,2025-10-15 10:00,ESPN,Booked,False
```
Note: " Futsal" was automatically added to Competition name

## 🔧 Troubleshooting

### Test Fails
1. Check screenshot files: `{sport}_error_screenshot.png`
2. Verify internet connection
3. Check if website structure changed

### Python Error
No Python needed! This version uses pure Node.js.

### Wrong Sport Value in CSV
Check `sports-config.js` for correct CSV value mapping.

## 📚 More Information

- Full README: `README.md`
- Sport Configuration Details: `SPORTS_GUIDE.md`
- Configuration File: `sports-config.js`

