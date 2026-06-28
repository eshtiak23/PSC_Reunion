# Reunion 2026 - Management Website

A premium glassmorphism dark-theme reunion management website built with vanilla HTML5, CSS3, and JavaScript.

## Features

- **Home** - Hero section, countdown timer, stats, payment status, food poll, schedule, hall of fame
- **Members** - Searchable member directory with payment status
- **Payments** - Dashboard with search, filter, sort, progress tracking
- **Budget** - Budget overview with Chart.js pie/bar charts
- **Food Voting** - Interactive voting for reunion menu
- **Schedule** - Beautiful timeline of event day
- **Hall of Fame** - Animated award cards
- **Gallery** - Responsive image grid with lightbox
- **Announcements** - Organizer updates and notes
- **Contact** - Contact info, form, and Google Maps
- **Admin** - Password-protected panel to manage all data

## Tech Stack

- HTML5
- CSS3 (Glassmorphism, Animations, Responsive)
- Vanilla JavaScript
- Chart.js (for budget charts)
- Google Sheets API (via Apps Script)

## Setup

1. Clone the repository
2. Edit `config.js` with your Google Sheets ID and Apps Script URL
3. Deploy Google Apps Script as Web App
4. Open `index.html` in a browser or deploy to GitHub Pages

## Google Sheets Integration

Edit `config.js`:

```javascript
const CONFIG = {
    SPREADSHEET_ID: 'your-spreadsheet-id',
    APPS_SCRIPT_URL: 'your-apps-script-url',
    // ...
};
```

## Deployment

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/reunion-2026.git
git push -u origin main
```

Then enable GitHub Pages from the `main` branch.

## License

MIT
