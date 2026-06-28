// ============================================================
// CONFIG.JS - Reunion Management System Configuration
// ============================================================
// Change these values to connect to your Google Sheets
// ============================================================

const CONFIG = {
    // Google Sheets Spreadsheet ID (from the URL)
    // Example: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',

    // Google Apps Script Web App URL (Deploy → New Deployment → Web App)
    // This is the URL you get after deploying your Apps Script
    APPS_SCRIPT_URL: 'YOUR_APPS_SCRIPT_URL_HERE',

    // Google Forms URL for food voting
    GOOGLE_FORM_URL: 'YOUR_GOOGLE_FORM_URL_HERE',

    // Sheet Names (must match your Google Sheets tab names)
    SHEETS: {
        MEMBERS: 'Members',
        PAYMENTS: 'Payments',
        BUDGET: 'Budget',
        ANNOUNCEMENTS: 'Announcements',
        GALLERY: 'Gallery',
        FOOD_VOTES: 'FoodVotes',
        HALL_OF_FAME: 'HallOfFame',
        CONTACT: 'Contact'
    },

    // Reunion Event Details
    EVENT: {
        NAME: 'Reunion 2026',
        DATE: '2026-10-15T10:00:00',
        VENUE: 'Our Village',
        TAGLINE: 'One Bond One Memory',
        DESCRIPTION: 'Same people, same vibes, new memories!'
    },

    // Admin Password (change this!)
    ADMIN_PASSWORD: 'reunion2026',

    // Total Budget Amount
    TOTAL_BUDGET: 25000,

    // Currency
    CURRENCY: '৳',

    // Social Links
    SOCIAL: {
        FACEBOOK: 'https://facebook.com/your-group',
        WHATSAPP: 'https://wa.me/8801XXXXXXXXX',
        MESSENGER: 'https://m.me/your-profile',
        PHONE: '+8801XXXXXXXXX'
    },

    // Organizer Info
    ORGANIZER: {
        NAME: 'Istiak Ahmed',
        PHONE: '+8801XXXXXXXXX',
        EMAIL: 'organizer@email.com'
    }
};

// Freeze config to prevent accidental modification
Object.freeze(CONFIG);
