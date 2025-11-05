/**
 * Sports configuration for Betgenius automation
 */
const sportsConfig = {
    soccer: {
        name: 'Soccer',
        sectionName: 'Football', // Name on the website (primary)
        alternativeName: 'Soccer', // Fallback name
        csvValue: 'Soccer',
        fileCode: 'sc',
        useDynamicRange: true // Soccer uses day-based logic
    },
    americanFootball: {
        name: 'American Football',
        sectionName: 'American Football',
        csvValue: 'Football',
        fileCode: 'football',
        useDynamicRange: false // 1 week
    },
    aussieRules: {
        name: 'Aussie Rules',
        sectionName: 'Aussie Rules',
        csvValue: 'Other Sports',
        fileCode: 'os',
        useDynamicRange: false // 1 week
    },
    baseball: {
        name: 'Baseball',
        sectionName: 'Baseball',
        csvValue: 'Baseball',
        fileCode: 'baseball',
        useDynamicRange: false // 1 week
    },
    basketball: {
        name: 'Basketball',
        sectionName: 'Basketball',
        csvValue: 'Basketball',
        fileCode: 'bk',
        useDynamicRange: false // 1 week
    },
    cricket: {
        name: 'Cricket',
        sectionName: 'Cricket',
        csvValue: 'Cricket',
        fileCode: 'cricket',
        useDynamicRange: false // 1 week
    },
    hockey: {
        name: 'Hockey',
        sectionName: 'Hockey',
        csvValue: 'Field Hockey',
        fileCode: 'fieldHockey',
        useDynamicRange: false // 1 week
    },
    rugbyLeague: {
        name: 'Rugby League',
        sectionName: 'Rugby League',
        csvValue: 'Rugby',
        fileCode: 'rl',
        useDynamicRange: false // 1 week
    },
    rugbyUnion: {
        name: 'Rugby Union',
        sectionName: 'Rugby Union',
        csvValue: 'Rugby',
        fileCode: 'ru',
        useDynamicRange: false // 1 week
    },
    waterPolo: {
        name: 'Water Polo',
        sectionName: 'Water Polo',
        csvValue: 'Water Polo',
        fileCode: 'waterPolo',
        useDynamicRange: false // 1 week
    },
    futsal: {
        name: 'Futsal',
        sectionName: 'Futsal',
        csvValue: 'Soccer',
        fileCode: 'fs',
        useDynamicRange: true, // Same as Soccer
        requiresFutsalSuffix: true // Special: Add "Futsal" to Competition if missing
    }
};

module.exports = sportsConfig;

