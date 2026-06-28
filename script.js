// ============================================================
// SCRIPT.JS - Reunion Management System
// All interactive functionality
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    Navigation.init();
    Countdown.init();
    ScrollAnimations.init();
    BackToTop.init();
    DarkMode.init();
    ToastManager.init();
    initLazyLoading();
});

// ========== LOADING SCREEN ==========
const LoadingScreen = {
    init() {
        const loader = document.getElementById('loading-screen');
        if (!loader) return;
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 800);
        });
    }
};

// ========== NAVIGATION ==========
const Navigation = {
    init() {
        const navbar = document.querySelector('.navbar');
        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');
        const overlay = document.querySelector('.mobile-nav-overlay');

        if (toggle && links) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                links.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
                document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
            });

            if (overlay) {
                overlay.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    links.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            links.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    links.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        window.addEventListener('scroll', () => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
            this.setActiveLink();
        });
    },

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPage);
        });
    }
};

// ========== COUNTDOWN TIMER ==========
const Countdown = {
    init() {
        const eventDate = new Date(CONFIG.EVENT.DATE).getTime();
        const countdownEl = document.getElementById('countdown');
        if (!countdownEl) return;

        const update = () => {
            const now = new Date().getTime();
            const diff = eventDate - now;

            if (diff <= 0) {
                countdownEl.innerHTML = '<div class="countdown-message">The reunion has started!</div>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const items = countdownEl.querySelectorAll('.countdown-value');
            if (items.length >= 4) {
                items[0].textContent = String(days).padStart(2, '0');
                items[1].textContent = String(hours).padStart(2, '0');
                items[2].textContent = String(minutes).padStart(2, '0');
                items[3].textContent = String(seconds).padStart(2, '0');
            }
        };

        update();
        setInterval(update, 1000);
    }
};

// ========== SCROLL ANIMATIONS ==========
const ScrollAnimations = {
    init() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    }
};

// ========== BACK TO TOP ==========
const BackToTop = {
    init() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ========== DARK MODE (already dark, toggle for light) ==========
const DarkMode = {
    init() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (!toggle) return;

        const isDark = localStorage.getItem('darkMode') !== 'false';
        if (!isDark) document.body.classList.add('light-mode');

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('light-mode') ? 'false' : 'true');
        });
    }
};

// ========== TOAST NOTIFICATIONS ==========
const ToastManager = {
    container: null,

    init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info') {
        const icons = {
            success: '&#10004;',
            error: '&#10006;',
            info: '&#8505;',
            warning: '&#9888;'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <span class="toast-close" onclick="this.parentElement.remove()">&#10005;</span>
        `;

        this.container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
};

// ========== CONFETTI ==========
const Confetti = {
    show() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#8b5cf6', '#ec4899', '#f97316', '#3b82f6', '#22c55e', '#eab308'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.width = Math.random() * 8 + 5 + 'px';
            confetti.style.height = Math.random() * 8 + 5 + 'px';
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    }
};

// ========== LAZY LOADING ==========
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imgObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imgObserver.observe(img));
}

// ========== COUNTER ANIMATION ==========
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    const update = () => {
        start += increment;
        if (start >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : Math.floor(target);
            return;
        }
        element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// ========== PROGRESS BAR ANIMATION ==========
function animateProgressBars() {
    document.querySelectorAll('.stat-progress-bar, .progress-fill, .vote-bar-fill').forEach(bar => {
        const target = bar.dataset.progress || bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = target;
        }, 500);
    });
}

// Observe progress bars
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgressBars();
            progressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar, .stat-progress').forEach(el => {
    progressObserver.observe(el);
});

// ========== STAT COUNTER ANIMATION ==========
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-value[data-count]').forEach(el => {
                animateCounter(el, parseInt(el.dataset.count));
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-grid, .budget-grid').forEach(el => {
    statObserver.observe(el);
});

// ========== LIGHTBOX ==========
const Lightbox = {
    images: [],
    currentIndex: 0,

    init() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.images = Array.from(galleryItems).map(i => i.querySelector('img')?.src || '');
                this.currentIndex = index;
                this.open();
            });
        });
    },

    open() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (!lightbox || !lightboxImg) return;

        lightboxImg.src = this.images[this.currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.open();
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.open();
    }
};

// ========== SEARCH & FILTER ==========
function initSearch(inputId, gridId) {
    const input = document.getElementById(inputId);
    const grid = document.getElementById(gridId);
    if (!input || !grid) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        grid.querySelectorAll('.member-card, .food-card, .announcement-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// ========== TABLE SEARCH ==========
function initTableSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    if (!input || !table) return;

    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// ========== TABLE SORT ==========
function sortTable(tableId, columnIndex, type = 'string') {
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();

        if (type === 'number') {
            return parseFloat(aVal.replace(/[^0-9.]/g, '')) - parseFloat(bVal.replace(/[^0-9.]/g, ''));
        }
        return aVal.localeCompare(bVal);
    });

    rows.forEach(row => tbody.appendChild(row));
}

// ========== ADMIN PANEL ==========
const Admin = {
    isLoggedIn: false,

    login() {
        const password = document.getElementById('admin-password')?.value;
        if (password === CONFIG.ADMIN_PASSWORD) {
            this.isLoggedIn = true;
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-dashboard').classList.add('active');
            ToastManager.show('Welcome, Admin!', 'success');
        } else {
            ToastManager.show('Incorrect password!', 'error');
        }
    },

    logout() {
        this.isLoggedIn = false;
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-dashboard').classList.remove('active');
        ToastManager.show('Logged out successfully', 'info');
    },

    switchTab(tabName) {
        document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(panel => panel.classList.remove('active'));

        event.target.classList.add('active');
        const panel = document.getElementById(`admin-${tabName}`);
        if (panel) panel.classList.add('active');
    }
};

// ========== FOOD VOTING ==========
const FoodVoting = {
    userVote: localStorage.getItem('foodVote') || null,

    async vote(food) {
        if (this.userVote) {
            ToastManager.show('You have already voted!', 'warning');
            return;
        }

        this.userVote = food;
        localStorage.setItem('foodVote', food);

        if (typeof SheetAPI !== 'undefined') {
            await SheetAPI.submitVote(food);
        }

        ToastManager.show(`Voted for ${food}!`, 'success');
        this.updateUI();
    },

    updateUI() {
        document.querySelectorAll('.vote-btn').forEach(btn => {
            if (this.userVote) {
                btn.disabled = true;
                btn.textContent = btn.dataset.food === this.userVote ? 'Voted' : 'Vote';
                btn.style.opacity = btn.dataset.food === this.userVote ? '1' : '0.5';
            }
        });
    }
};

// ========== ANNOUNCEMENTS PAGE ==========
function renderAnnouncements(data) {
    const grid = document.getElementById('announcements-grid');
    if (!grid || !data) return;

    grid.innerHTML = data.map(a => `
        <div class="announcement-card animate-on-scroll">
            <div class="announcement-header">
                <div>
                    <div class="announcement-title">${a.title}</div>
                    <span class="announcement-tag">${a.tag || 'Update'}</span>
                </div>
                <div class="announcement-date">${a.date}</div>
            </div>
            <div class="announcement-body">${a.body}</div>
        </div>
    `).join('');
}

// ========== MEMBERS PAGE ==========
function renderMembers(members) {
    const grid = document.getElementById('members-grid');
    if (!grid || !members) return;

    grid.innerHTML = members.map(m => `
        <div class="member-card animate-on-scroll">
            <div class="member-avatar">
                ${m.photo ? `<img src="${m.photo}" alt="${m.name}" data-src="${m.photo}">` : m.name.charAt(0)}
            </div>
            <div class="member-name">${m.name}</div>
            <div class="member-phone">${m.phone}</div>
            <span class="badge ${m.status === 'Paid' ? 'badge-paid' : m.status === 'Partial' ? 'badge-partial' : 'badge-due'}">${m.status}</span>
            <div class="member-payment">
                <span class="paid">Paid: ${CONFIG.CURRENCY}${m.paid || 0}</span>
                <span class="due">Due: ${CONFIG.CURRENCY}${m.due || 0}</span>
            </div>
        </div>
    `).join('');
}

// ========== PAYMENTS TABLE ==========
function renderPayments(payments) {
    const tbody = document.querySelector('#payments-table tbody');
    if (!tbody || !payments) return;

    tbody.innerHTML = payments.map((p, i) => `
        <tr>
            <td>${String(i + 1).padStart(2, '0')}</td>
            <td>${p.name}</td>
            <td>${p.phone}</td>
            <td>${CONFIG.CURRENCY}${p.paid || 0}</td>
            <td>${CONFIG.CURRENCY}${p.due || 0}</td>
            <td>${p.date || '---'}</td>
            <td><span class="badge ${p.status === 'Paid' ? 'badge-paid' : 'badge-due'}">${p.status}</span></td>
        </tr>
    `).join('');
}

// ========== INIT PAGES ==========
function initPage() {
    const page = document.body.dataset.page;

    switch (page) {
        case 'home':
            Lightbox.init();
            animateProgressBars();
            break;
        case 'members':
            initSearch('member-search', 'members-grid');
            if (typeof SheetAPI !== 'undefined') {
                SheetAPI.getMembers().then(data => {
                    if (data.members) renderMembers(data.members);
                });
            }
            break;
        case 'payments':
            initTableSearch('payment-search', 'payments-table');
            if (typeof SheetAPI !== 'undefined') {
                SheetAPI.getPayments().then(data => {
                    if (data.payments) renderPayments(data.payments);
                });
            }
            break;
        case 'gallery':
            Lightbox.init();
            break;
        case 'food':
            FoodVoting.updateUI();
            break;
        case 'admin':
            break;
    }
}

// Run page init after DOM is ready
document.addEventListener('DOMContentLoaded', initPage);
