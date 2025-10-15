# Sports Configuration Guide

## Overview

This automation script supports downloading data for 11 different sports from Betgenius. Each sport has its own configuration for:
- Website section name
- CSV sport value
- File naming code
- Download date range logic
- Special processing rules

## Supported Sports

### 1. Soccer (Football) ⚽
- **Website Section**: `Football`
- **CSV Value**: `Soccer`
- **File Code**: `sc`
- **Date Range**: Day-based logic (3-5 days depending on weekday)
- **Example File**: `BG-14-10-2025sc.csv`
- **Special Processing**: None

### 2. Futsal (室內足球) 🥅
- **Website Section**: `Futsal`
- **CSV Value**: `Soccer`
- **File Code**: `fs`
- **Date Range**: Day-based logic (same as Soccer, 3-5 days depending on weekday)
- **Example File**: `BG-14-10-2025fs.csv`
- **Special Processing**: 
  - ✅ Automatically adds " Futsal" to Competition column (A欄) if not present
  - ✅ Checks if competition name already ends with "Futsal" to avoid duplication
  - ✅ Works with both quoted and unquoted values
  - Example: `"Brazil Serie A"` → `"Brazil Serie A Futsal"`
  - Example: `"Spain Primera Division Futsal"` → unchanged (already has Futsal)

### 3. American Football 🏈
- **Website Section**: `American Football`
- **CSV Value**: `Football`
- **File Code**: `af`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025af.csv`

### 4. Aussie Rules 🏉
- **Website Section**: `Aussie Rules`
- **CSV Value**: `Other Sports`
- **File Code**: `ar`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025ar.csv`

### 5. Baseball ⚾
- **Website Section**: `Baseball`
- **CSV Value**: `Baseball`
- **File Code**: `bb`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025bb.csv`

### 6. Basketball 🏀
- **Website Section**: `Basketball`
- **CSV Value**: `Basketball`
- **File Code**: `bk`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025bk.csv`

### 7. Cricket 🏏
- **Website Section**: `Cricket`
- **CSV Value**: `Cricket`
- **File Code**: `ck`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025ck.csv`

### 8. Hockey (Field Hockey) 🏑
- **Website Section**: `Hockey`
- **CSV Value**: `Field Hockey`
- **File Code**: `hk`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025hk.csv`

### 9. Rugby League 🏉
- **Website Section**: `Rugby League`
- **CSV Value**: `Rugby`
- **File Code**: `rl`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025rl.csv`

### 10. Rugby Union 🏉
- **Website Section**: `Rugby Union`
- **CSV Value**: `Rugby`
- **File Code**: `ru`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025ru.csv`

### 11. Water Polo 🤽
- **Website Section**: `Water Polo`
- **CSV Value**: `Water Polo`
- **File Code**: `wp`
- **Date Range**: 1 week (7 days)
- **Example File**: `BG-14-10-2025wp.csv`

## Date Range Logic

### Soccer & Futsal (Day-based)
Soccer and Futsal use special logic based on the current day of the week:
- **Monday**: Download Monday to Friday (5 days)
- **Tuesday**: Download Tuesday to Saturday (5 days)
- **Wednesday**: Download Wednesday to Sunday (5 days)
- **Thursday**: Download Thursday to Saturday (3 days)
- **Friday**: Download Friday to Monday (4 days)
- **Saturday**: Download Saturday to Wednesday (5 days)
- **Sunday**: Download Sunday to Thursday (4 days)

### All Other Sports
All other sports download **1 week (7 days)** of data from today.

## CSV Processing

After downloading, each CSV file is automatically processed to add a "Sports" column (B欄) in the second position with the appropriate sport value.

**Example (Basketball):**

**Before:**
```csv
Competition,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
NBA,12345,Lakers v Celtics,2025-10-15 10:00,ESPN,Booked,False
```

**After:**
```csv
Competition,Sports,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
NBA,Basketball,12345,Lakers v Celtics,2025-10-15 10:00,ESPN,Booked,False
```

**Example (Futsal with special processing):**

**Before:**
```csv
"Competition",EventId,Event,Start (UTC+8),Feed,Booking Status,OST
"Brazil Serie A",12345,Team A v Team B,2025-10-15 10:00,ESPN,Booked,False
"Spain Primera Division Futsal",67890,Team C v Team D,2025-10-15 14:00,FOX,Unbooked,
```

**After:**
```csv
"Competition",Sports,EventId,Event,Start (UTC+8),Feed,Booking Status,OST
"Brazil Serie A Futsal",Soccer,12345,Team A v Team B,2025-10-15 10:00,ESPN,Booked,False
"Spain Primera Division Futsal",Soccer,67890,Team C v Team D,2025-10-15 14:00,FOX,Unbooked,
```
Note: "Brazil Serie A" got " Futsal" added, but "Spain Primera Division Futsal" was unchanged.

## Running Tests

### Individual Sport Test
You can run a specific sport test using Playwright UI:
```bash
npx playwright test --ui
```
Then select the specific sport test you want to run.

### All Sports
Run all 9 sports at once:
```bash
npm run test:all
```

### Soccer Only
Run only the Soccer test (original):
```bash
npm test
```

## Customization

To add a new sport or modify existing configuration, edit `sports-config.js`:

```javascript
newSport: {
    name: 'New Sport Name',
    sectionName: 'Section Name on Website',
    csvValue: 'Value for CSV Sports Column',
    fileCode: 'xx', // 2-letter code for filename
    useDynamicRange: false // true for Soccer-like logic, false for 1 week
}
```

Then add a test in `tests/betgenius_all_sports.spec.js`:

```javascript
test('Download New Sport data', async ({ page }) => {
    await testSport(page, 'newSport');
});
```

