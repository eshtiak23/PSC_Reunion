// ============================================================
// SCRIPT.JS - Reunion 2026
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initNavbar();
    initCountdown();
    initBackToTop();
    initPage();
});

// ========== LOADING SCREEN ==========
function initLoadingScreen() {
    var loader = document.getElementById('loading-screen');
    if (!loader) return;
    setTimeout(function() {
        loader.style.opacity = '0';
        setTimeout(function() { loader.style.display = 'none'; }, 500);
    }, 1000);
}

// ========== NAVBAR ==========
function initNavbar() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('nav-menu');
    var overlay = document.getElementById('nav-overlay');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        });
    }
    if (overlay) {
        overlay.addEventListener('click', function() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Scroll effect
    window.addEventListener('scroll', function() {
        var nav = document.querySelector('.navbar');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Active link
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========== COUNTDOWN ==========
function initCountdown() {
    var target = new Date(CONFIG.EVENT.DATE).getTime();

    function update() {
        var now = new Date().getTime();
        var diff = target - now;

        if (diff <= 0) {
            var els = document.querySelectorAll('.countdown-number');
            els.forEach(function(el) { el.textContent = '00'; });
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

        var d = document.getElementById('cd-days');
        var h = document.getElementById('cd-hours');
        var m = document.getElementById('cd-minutes');
        var s = document.getElementById('cd-seconds');

        if (d) d.textContent = String(days).padStart(2, '0');
        if (h) h.textContent = String(hours).padStart(2, '0');
        if (m) m.textContent = String(minutes).padStart(2, '0');
        if (s) s.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

// ========== BACK TO TOP ==========
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== RENDER PAYMENTS TABLE ==========
function renderPayments(data) {
    var tbody = document.querySelector('#payments-table tbody');
    if (!tbody || !data || !data.length) return;

    var total = 0;
    var html = '';

    data.forEach(function(row, i) {
        var name = row.Name || row[0] || '';
        var dateTime = row['Date & Time'] || row[1] || '';
        var amount = parseFloat(row.Amount || row[2]) || 0;
        var method = row.Method || row[3] || '';

        total += amount;

        var methodClass = 'method-default';
        if (method.toLowerCase().includes('bkash')) methodClass = 'method-bkash';
        else if (method.toLowerCase().includes('nagad')) methodClass = 'method-nagad';
        else if (method.toLowerCase().includes('rocket')) methodClass = 'method-rocket';

        html += '<tr>';
        html += '<td>' + (i + 1) + '</td>';
        html += '<td><strong>' + name + '</strong></td>';
        html += '<td>' + dateTime + '</td>';
        html += '<td><strong>৳' + amount.toLocaleString() + '</strong></td>';
        html += '<td><span class="method-badge ' + methodClass + '">' + method + '</span></td>';
        html += '</tr>';
    });

    tbody.innerHTML = html;

    // Update stats
    var totalEl = document.getElementById('total-collected');
    var countEl = document.getElementById('total-count');
    if (totalEl) totalEl.textContent = '৳' + total.toLocaleString();
    if (countEl) countEl.textContent = data.length;
}

// ========== RENDER HOME PAYMENTS ==========
function renderHomePayments(data) {
    var container = document.getElementById('home-payments');
    if (!container || !data || !data.length) return;

    var lastFive = data.slice(-5).reverse();
    var total = 0;
    data.forEach(function(row) {
        total += parseFloat(row.Amount || row[2]) || 0;
    });

    var html = '';
    lastFive.forEach(function(row) {
        var name = row.Name || row[0] || '';
        var amount = parseFloat(row.Amount || row[2]) || 0;
        var method = row.Method || row[3] || '';

        var methodClass = 'method-default';
        if (method.toLowerCase().includes('bkash')) methodClass = 'method-bkash';
        else if (method.toLowerCase().includes('nagad')) methodClass = 'method-nagad';
        else if (method.toLowerCase().includes('rocket')) methodClass = 'method-rocket';

        html += '<div class="payment-mini-card">';
        html += '<div class="payment-mini-left">';
        html += '<div class="payment-mini-avatar">' + name.charAt(0) + '</div>';
        html += '<div><strong>' + name + '</strong></div>';
        html += '</div>';
        html += '<div class="payment-mini-right">';
        html += '<span class="method-badge ' + methodClass + '">' + method + '</span>';
        html += '<span class="payment-mini-amount">৳' + amount.toLocaleString() + '</span>';
        html += '</div>';
        html += '</div>';
    });

    container.innerHTML = html;

    var totalEl = document.getElementById('home-total-collected');
    if (totalEl) totalEl.textContent = '৳' + total.toLocaleString();
}

// ========== PAGE INIT ==========
function initPage() {
    var page = document.body.dataset.page;

    if (page === 'payments' || page === 'home') {
        if (typeof SheetAPI !== 'undefined') {
            SheetAPI.getPayments().then(function(data) {
                if (page === 'payments') renderPayments(data);
                if (page === 'home') renderHomePayments(data);
            });
        }
    }

    // Animate stats on home
    if (page === 'home') {
        document.querySelectorAll('.stat-number[data-target]').forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var current = 0;
            var increment = target / 40;
            var timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 40);
        });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.dataset.filter;
            document.querySelectorAll('#payments-table tbody tr').forEach(function(row) {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    row.style.display = '';
                }
            });
        });
    });

    // Search
    var searchInput = document.getElementById('payment-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            var query = e.target.value.toLowerCase();
            document.querySelectorAll('#payments-table tbody tr').forEach(function(row) {
                row.style.display = row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }
}
