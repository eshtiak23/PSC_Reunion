// ============================================================
// SCRIPT.JS - Reunion 2026
// ============================================================

var paymentData = [];

function throttle(fn, wait) {
    var lastTime = 0;
    return function() {
        var now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, arguments);
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen();
    initNavbar();
    initCountdown();
    initBackToTop();
    initMusicPlayer();
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

    window.addEventListener('scroll', throttle(function() {
        var nav = document.querySelector('.navbar');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    }, 100));

    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ========== COUNTDOWN ==========
function initCountdown() {
    var d = document.getElementById('cd-days');
    var h = document.getElementById('cd-hours');
    var m = document.getElementById('cd-minutes');
    var s = document.getElementById('cd-seconds');
    if (!d && !h && !m && !s) return;

    var target = new Date(CONFIG.EVENT.DATE).getTime();

    function update() {
        var now = new Date().getTime();
        var diff = target - now;

        if (diff <= 0) {
            [d, h, m, s].forEach(function(el) { if (el) el.textContent = '00'; });
            return;
        }

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);

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

    window.addEventListener('scroll', throttle(function() {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, 100));

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== PAYMENT TABS ==========
function initPaymentTabs() {
    var tabs = document.querySelectorAll('.payment-tab');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            document.querySelectorAll('.payment-tab-content').forEach(function(c) {
                c.classList.remove('active');
            });

            var targetId = 'tab-' + tab.dataset.tab;
            var target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });
}

// ========== COPY PHONE ==========
function initCopyPhone() {
    var copyBtn = document.getElementById('copy-phone');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', function() {
        var phoneText = document.getElementById('phone-text');
        if (!phoneText) return;

        var phone = phoneText.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phone).then(function() {
                showCopyFeedback(copyBtn);
            }).catch(function() {
                fallbackCopy(phone, copyBtn);
            });
        } else {
            fallbackCopy(phone, copyBtn);
        }
    });
}

function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(btn);
    } catch (e) {
        console.error('Copy failed');
    }
    document.body.removeChild(textarea);
}

function showCopyFeedback(btn) {
    var original = btn.textContent;
    btn.textContent = '✅';
    btn.classList.add('copied');
    setTimeout(function() {
        btn.textContent = original;
        btn.classList.remove('copied');
    }, 2000);
}

// ========== FETCH PAYMENTS ==========
function fetchPayments() {
    return fetch('payments.json')
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load');
            return response.json();
        })
        .catch(function(error) {
            console.error('Error loading payments:', error);
            return [];
        });
}

// ========== RENDER HOME STATS ==========
function renderHomeStats(data) {
    var total = 0;
    var count = 0;
    if (data && data.length) {
        data.forEach(function(row) {
            total += parseFloat(row.amount) || 0;
            count++;
        });
    }

    var totalEl = document.getElementById('home-total-collected');
    var countEl = document.getElementById('home-total-paid');
    if (totalEl) totalEl.textContent = '৳' + total.toLocaleString();
    if (countEl) countEl.textContent = count;
}

// ========== RENDER HOME PAYMENTS ==========
function renderHomePayments(data) {
    var container = document.getElementById('home-payments');
    if (!container || !data || !data.length) {
        if (container) container.innerHTML = '<p class="loading-text">No payments yet</p>';
        return;
    }

    var lastFive = data.slice(-5).reverse();
    var total = 0;
    data.forEach(function(row) {
        total += parseFloat(row.amount) || 0;
    });

    var html = '';
    lastFive.forEach(function(row) {
        var name = row.name || '';
        var amount = parseFloat(row.amount) || 0;
        var method = row.method || '';

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

// ========== RENDER PAYMENTS LIST ==========
function renderPaymentsList(data, monthFilter) {
    var list = document.getElementById('payment-list');
    if (!list) return;

    var filtered = data;
    if (monthFilter && monthFilter !== 'all') {
        filtered = data.filter(function(row) {
            return row.month === monthFilter;
        });
    }

    if (!filtered.length) {
        list.innerHTML = '<p class="loading-text">No payments found</p>';
        return;
    }

    var total = 0;
    var html = '';
    filtered.forEach(function(row) {
        var name = row.name || '';
        var amount = parseFloat(row.amount) || 0;
        var method = row.method || '';
        var date = row.date || '';

        total += amount;

        var methodClass = 'method-default';
        if (method.toLowerCase().includes('bkash')) methodClass = 'method-bkash';
        else if (method.toLowerCase().includes('nagad')) methodClass = 'method-nagad';
        else if (method.toLowerCase().includes('rocket')) methodClass = 'method-rocket';

        html += '<div class="payment-history-card">';
        html += '<div class="payment-history-left">';
        html += '<div class="payment-history-avatar">' + name.charAt(0) + '</div>';
        html += '<div class="payment-history-info">';
        html += '<h4>' + name + '</h4>';
        html += '<p>' + date + '</p>';
        html += '</div>';
        html += '</div>';
        html += '<div class="payment-history-right">';
        html += '<span class="method-badge ' + methodClass + '">' + method + '</span>';
        html += '<span class="payment-history-amount">৳' + amount.toLocaleString() + '</span>';
        html += '</div>';
        html += '</div>';
    });

    list.innerHTML = html;

    var totalEl = document.getElementById('total-collected');
    var countEl = document.getElementById('total-count');
    if (totalEl) totalEl.textContent = '৳' + total.toLocaleString();
    if (countEl) countEl.textContent = filtered.length;
}

// ========== HALL OF FAME ==========
function renderHallOfFame(data) {
    if (!data || !data.length) return;

    var fameSection = document.getElementById('hall-of-fame');
    if (!fameSection) return;
    fameSection.style.display = 'block';

    var sorted = data.slice().sort(function(a, b) {
        return new Date(a.date) - new Date(b.date);
    });
    var first = sorted[0];

    var paidMap = {};
    data.forEach(function(row) {
        var name = row.name;
        var amount = parseFloat(row.amount) || 0;
        paidMap[name] = (paidMap[name] || 0) + amount;
    });

    var topName = '';
    var topAmount = 0;
    for (var name in paidMap) {
        if (paidMap[name] > topAmount) {
            topAmount = paidMap[name];
            topName = name;
        }
    }

    var firstName = document.getElementById('first-payer-name');
    var firstDate = document.getElementById('first-payer-date');
    var topNameEl = document.getElementById('top-payer-name');
    var topAmountEl = document.getElementById('top-payer-amount');

    if (firstName) firstName.textContent = first.name;
    if (firstDate) firstDate.textContent = first.date;
    if (topNameEl) topNameEl.textContent = topName;
    if (topAmountEl) topAmountEl.textContent = '৳' + topAmount.toLocaleString();
}

// ========== MONTH FILTER ==========
function initMonthFilter() {
    var filters = document.querySelectorAll('.month-filter');
    filters.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filters.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderPaymentsList(paymentData, btn.dataset.month);
        });
    });
}

// ========== MUSIC PLAYER ==========
function initMusicPlayer() {
    var prompt = document.getElementById('musicPrompt');
    var widget = document.getElementById('musicWidget');
    var playBtn = document.getElementById('musicPlayBtn');
    var skipBtn = document.getElementById('musicSkipBtn');
    var toggleBtn = document.getElementById('musicToggle');
    var audio = document.getElementById('bgMusic');

    if (!prompt || !audio) return;

    var isMobile = window.innerWidth <= 768;
    var state = sessionStorage.getItem('musicChoice');

    if (state === 'playing') {
        prompt.style.display = 'none';
        widget.style.display = 'block';
        audio.play().then(function() {
            toggleBtn.classList.add('playing');
            toggleBtn.textContent = '⏸';
        }).catch(function() {});
    } else if (state === 'skipped') {
        prompt.style.display = 'none';
        widget.style.display = 'block';
    } else {
        if (isMobile) {
            prompt.style.display = 'flex';
            widget.style.display = 'none';
        } else {
            prompt.style.display = 'none';
            widget.style.display = 'block';
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            audio.play().then(function() {
                sessionStorage.setItem('musicChoice', 'playing');
                prompt.style.opacity = '0';
                prompt.style.transition = 'opacity 0.4s';
                setTimeout(function() {
                    prompt.style.display = 'none';
                    widget.style.display = 'block';
                    toggleBtn.classList.add('playing');
                    toggleBtn.textContent = '⏸';
                }, 400);
            }).catch(function() {
                sessionStorage.setItem('musicChoice', 'playing');
                prompt.style.display = 'none';
                widget.style.display = 'block';
            });
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            sessionStorage.setItem('musicChoice', 'skipped');
            prompt.style.opacity = '0';
            prompt.style.transition = 'opacity 0.4s';
            setTimeout(function() {
                prompt.style.display = 'none';
                widget.style.display = 'block';
            }, 400);
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (audio.paused) {
                audio.play().then(function() {
                    toggleBtn.classList.add('playing');
                    toggleBtn.textContent = '⏸';
                    sessionStorage.setItem('musicChoice', 'playing');
                }).catch(function() {});
            } else {
                audio.pause();
                toggleBtn.classList.remove('playing');
                toggleBtn.textContent = '🎵';
                sessionStorage.setItem('musicChoice', 'skipped');
            }
        });
    }
}

// ========== PAGE INIT ==========
function initPage() {
    var page = document.body.dataset.page;

    if (page === 'home') {
        var memberCountEl = document.getElementById('home-total-members');
        if (memberCountEl) {
            memberCountEl.textContent = CONFIG.TOTAL_MEMBERS;
        }

        fetchPayments().then(function(data) {
            renderHomeStats(data);
        });
    }

    if (page === 'payments') {
        initPaymentTabs();
        initCopyPhone();
        fetchPayments().then(function(data) {
            paymentData = data;
            renderPaymentsList(data, 'all');
            renderHallOfFame(data);
            initMonthFilter();
        });
    }
}
