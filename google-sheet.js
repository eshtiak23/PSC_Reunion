// ============================================================
// GOOGLE-SHEET.JS - Payments Only
// ============================================================

const SheetAPI = {
    async getPayments() {
        try {
            const url = `${CONFIG.APPS_SCRIPT_URL}?sheet=${CONFIG.SHEETS.PAYMENTS}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Sheet API Error:', error);
            return [];
        }
    },

    async addPayment(payment) {
        try {
            await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payment)
            });
            return { success: true };
        } catch (error) {
            console.error('Sheet API Error:', error);
            return { success: false, error: error.message };
        }
    }
};
