// ============================================================
// GOOGLE-SHEET.JS - Google Sheets API Integration
// ============================================================

const SheetAPI = {
    // Generic fetch from Google Apps Script
    async fetch(action, sheet = '', data = null) {
        try {
            const body = {
                action: action,
                spreadsheetId: CONFIG.SPREADSHEET_ID,
                sheet: sheet
            };
            if (data) body.data = data;

            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            // With no-cors we can't read the response, so return success
            return { success: true };
        } catch (error) {
            console.error('Sheet API Error:', error);
            return { success: false, error: error.message };
        }
    },

    // GET data via GET request (for reading)
    async get(action, sheet) {
        try {
            const url = `${CONFIG.APPS_SCRIPT_URL}?action=${action}&sheet=${sheet}&spreadsheetId=${CONFIG.SPREADSHEET_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Sheet GET Error:', error);
            return { success: false, error: error.message };
        }
    },

    // ========== MEMBERS ==========
    async getMembers() {
        return this.get('read', CONFIG.SHEETS.MEMBERS);
    },

    async addMember(member) {
        return this.fetch('add', CONFIG.SHEETS.MEMBERS, member);
    },

    async updateMember(id, member) {
        return this.fetch('update', CONFIG.SHEETS.MEMBERS, { id, ...member });
    },

    async deleteMember(id) {
        return this.fetch('delete', CONFIG.SHEETS.MEMBERS, { id });
    },

    // ========== PAYMENTS ==========
    async getPayments() {
        return this.get('read', CONFIG.SHEETS.PAYMENTS);
    },

    async updatePayment(id, payment) {
        return this.fetch('update', CONFIG.SHEETS.PAYMENTS, { id, ...payment });
    },

    // ========== BUDGET ==========
    async getBudget() {
        return this.get('read', CONFIG.SHEETS.BUDGET);
    },

    async addExpense(expense) {
        return this.fetch('add', CONFIG.SHEETS.BUDGET, expense);
    },

    async updateExpense(id, expense) {
        return this.fetch('update', CONFIG.SHEETS.BUDGET, { id, ...expense });
    },

    // ========== ANNOUNCEMENTS ==========
    async getAnnouncements() {
        return this.get('read', CONFIG.SHEETS.ANNOUNCEMENTS);
    },

    async addAnnouncement(announcement) {
        return this.fetch('add', CONFIG.SHEETS.ANNOUNCEMENTS, announcement);
    },

    // ========== GALLERY ==========
    async getGallery() {
        return this.get('read', CONFIG.SHEETS.GALLERY);
    },

    async addImage(image) {
        return this.fetch('add', CONFIG.SHEETS.GALLERY, image);
    },

    async deleteImage(id) {
        return this.fetch('delete', CONFIG.SHEETS.GALLERY, { id });
    },

    // ========== FOOD VOTES ==========
    async getFoodVotes() {
        return this.get('read', CONFIG.SHEETS.FOOD_VOTES);
    },

    async submitVote(food) {
        return this.fetch('add', CONFIG.SHEETS.FOOD_VOTES, { food });
    },

    // ========== HALL OF FAME ==========
    async getHallOfFame() {
        return this.get('read', CONFIG.SHEETS.HALL_OF_FAME);
    },

    // ========== CONTACT ==========
    async getContact() {
        return this.get('read', CONFIG.SHEETS.CONTACT);
    }
};

Object.freeze(SheetAPI);
