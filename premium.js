/* ==========================================================================
   AURA NAILS HUB — PREMIUM UPGRADE MODULE
   Stats Counter, Scroll Reveal, Skeletons, Social Proof, Dark Mode
   ========================================================================== */

/* ── 1. ANIMATED STATS COUNTER ─────────────────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();
    const startVal = 0;
    el.classList.add('counting');

    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.floor(startVal + eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else {
            el.textContent = target.toLocaleString() + suffix;
            el.classList.remove('counting');
            el.classList.add('counted');
        }
    }
    requestAnimationFrame(step);
}

function initStatsCounter() {
    const stats = [
        { selector: '.stat-number', text: '500+', target: 500, suffix: '+' },
        { selector: null, text: '3+ Wks', target: null, suffix: null },
        { selector: null, text: '100%', target: 100, suffix: '%' },
    ];

    const statEls = document.querySelectorAll('.stat-number');
    if (!statEls.length) return;

    const parseStat = (el) => {
        const raw = el.textContent.trim();
        const match = raw.match(/^(\d+)/);
        if (!match) return null;
        const num = parseInt(match[1]);
        const suffix = raw.replace(match[1], '');
        return { el, target: num, suffix };
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statEls.forEach(el => {
                    const parsed = parseStat(el);
                    if (parsed && !el.classList.contains('counted')) {
                        animateCounter(parsed.el, parsed.target, parsed.suffix);
                    }
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
}


/* ── 2. SCROLL REVEAL ANIMATIONS ───────────────────────────────────────── */
function initScrollReveal() {
    const revealEls = document.querySelectorAll(
        '.section-header, .service-list-item, .gallery-card, .calculator-card, .review-card, .stat-item, .footer-brand-col, .footer-links-col'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger effect — each element delays slightly
                const delay = (Array.from(revealEls).indexOf(entry.target) % 6) * 80;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}


/* ── 3. SKELETON LOADING FOR GALLERY ───────────────────────────────────── */
function showGallerySkeletons(container, count = 6) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'gallery-card skeleton-card';
        skeleton.innerHTML = `
            <div class="skeleton-img shimmer"></div>
            <div class="skeleton-body">
                <div class="skeleton-line shimmer" style="width:70%;height:14px;"></div>
                <div class="skeleton-line shimmer" style="width:45%;height:11px;margin-top:8px;"></div>
                <div class="skeleton-line shimmer" style="width:55%;height:11px;margin-top:6px;"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

// Patch into the existing gallery render — expose globally
window.premiumShowSkeletons = showGallerySkeletons;


/* ── 4. NAIL OF THE WEEK — localStorage powered ─────────────────────── */
function initNailOfTheWeek() {
    // Load saved NOTW from localStorage and update static HTML
    const saved = JSON.parse(localStorage.getItem('aura-notw') || 'null');
    if (saved && saved.title) {
        const titleEl = document.getElementById('notw-title');
        const catEl = document.getElementById('notw-cat');
        if (titleEl) titleEl.textContent = saved.title;
        if (catEl) catEl.textContent = saved.category || '';
    }

    // Wire the "View Look" link to open the specific set lightbox
    const viewLink = document.querySelector('.notw-cta');
    if (viewLink) {
        viewLink.addEventListener('click', (e) => {
            const setId = saved?.setId || viewLink.dataset.setId;
            if (setId && window.openLightbox) {
                e.preventDefault();
                // Scroll to portfolio first so lightbox has context, then open
                const portfolio = document.getElementById('services-portfolio');
                if (portfolio) portfolio.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => window.openLightbox(setId), 400);
            }
            // else: default href="#services-portfolio" scroll behaviour kicks in
        });
    }

    // Wire the admin "Update Weekly Feature" button
    const saveBtn = document.getElementById('notw-save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const customTitle = document.getElementById('notw-custom-title')?.value.trim();
            const customCat = document.getElementById('notw-custom-cat')?.value.trim();

            // If checkbox is checked, use the form's set title/category
            const useUploadForm = document.getElementById('notw-checkbox')?.checked;
            const title = useUploadForm
                ? (document.getElementById('set-title')?.value.trim() || customTitle)
                : customTitle;
            const category = useUploadForm
                ? (document.getElementById('set-category')?.value || customCat)
                : customCat;

            if (!title) {
                if (window.showToast) window.showToast('Enter a title for the weekly feature first.');
                return;
            }

            // Save to localStorage
            const data = { title, category, updatedAt: new Date().toISOString() };
            localStorage.setItem('aura-notw', JSON.stringify(data));

            // Update the live strip immediately
            const titleEl = document.getElementById('notw-title');
            const catEl = document.getElementById('notw-cat');
            if (titleEl) titleEl.textContent = title;
            if (catEl) catEl.textContent = category;

            if (window.showToast) window.showToast('Weekly feature updated successfully!');

            // Clear fields
            const t = document.getElementById('notw-custom-title');
            const c = document.getElementById('notw-custom-cat');
            const cb = document.getElementById('notw-checkbox');
            if (t) t.value = '';
            if (c) c.value = '';
            if (cb) cb.checked = false;
        });
    }
}


/* ── 5. AVAILABILITY BADGE IN HEADER ───────────────────────────────────── */
function initAvailabilityBadge() {
    if (document.getElementById('avail-badge')) return;

    const bookBtn = document.querySelector('.btn-book-nav');
    if (!bookBtn) return;

    // Determine availability based on day/time (EAT = UTC+3)
    const now = new Date();
    const hour = now.getUTCHours() + 3;
    const day = now.getDay(); // 0=Sun, 6=Sat
    const isAvailable = day >= 1 && day <= 6 && hour >= 9 && hour < 20;

    const badge = document.createElement('span');
    badge.id = 'avail-badge';
    badge.className = `avail-badge ${isAvailable ? 'avail-open' : 'avail-busy'}`;
    badge.textContent = isAvailable ? 'Available Today' : 'By Appointment';

    bookBtn.parentElement.insertBefore(badge, bookBtn);
}


/* ── 6. BUTTON SHIMMER RIPPLE ───────────────────────────────────────────── */
function initButtonRipple() {
    document.querySelectorAll('.btn-primary, .btn-book-nav').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}


/* ── 7. TESTIMONIALS AUTO-CAROUSEL ─────────────────────────────────────── */
function initTestimonialsCarousel() {
    const track = document.querySelector('.reviews-track, .reviews-grid');
    if (!track) return;

    // Clone cards for infinite scroll effect
    const cards = Array.from(track.children);
    if (cards.length < 3) return;

    track.style.display = 'flex';
    track.style.gap = '20px';
    track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.cursor = 'grab';

    let current = 0;
    let autoTimer;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Wrap in a viewport div if not already
    let viewport = track.parentElement;
    if (!viewport.classList.contains('reviews-carousel-viewport')) {
        viewport.style.overflow = 'hidden';
        viewport.style.position = 'relative';
    }

    const cardWidth = () => cards[0].offsetWidth + 20;

    function goTo(idx) {
        current = (idx + cards.length) % cards.length;
        track.style.transform = `translateX(-${current * cardWidth()}px)`;
    }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 3500);
    }

    // Add prev/next dots nav
    const dots = document.createElement('div');
    dots.className = 'carousel-dots';
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => { goTo(i); startAuto(); });
        dots.appendChild(dot);
    });

    track.parentElement.insertAdjacentElement('afterend', dots);

    // Update dots on transition end
    track.addEventListener('transitionend', () => {
        dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    });

    startAuto();

    // Pause on hover
    viewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
    viewport.addEventListener('mouseleave', startAuto);
}


/* ── 8. SOCIAL PROOF "LAST BOOKED" TOAST ───────────────────────────── */
const SOCIAL_PROOF_DATA = [
    { name: 'Faith W.', look: 'Chrome Ombre Coffin', time: '4 hrs ago' },
    { name: 'Stacy M.', look: 'Gumgel Tips + 3D Art', time: '5 hrs ago' },
    { name: 'Brenda K.', look: 'Almond French Tips', time: '6 hrs ago' },
    { name: 'Cynthia A.', look: 'Glitter Gel Pedi', time: '4 hrs ago' },
    { name: 'Sharon T.', look: 'Russian Manicure', time: '7 hrs ago' },
    { name: 'Liz N.', look: '3D Floral Stiletto', time: '5 hrs ago' },
    { name: 'Grace O.', look: 'Mirror Chrome Set', time: '8 hrs ago' },
    { name: 'Joy K.', look: 'Pastel Gel Polish', time: '4 hrs ago' },
];

function showSocialProofToast() {
    const data = SOCIAL_PROOF_DATA[Math.floor(Math.random() * SOCIAL_PROOF_DATA.length)];

    let container = document.getElementById('social-proof-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'social-proof-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
        <div class="sp-icon"><i class="fa-solid fa-certificate"></i></div>
        <div class="sp-body">
            <div class="sp-name">${data.name} just booked</div>
            <div class="sp-look">${data.look}</div>
            <div class="sp-time">${data.time}</div>
        </div>
        <button class="sp-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    // Auto-dismiss after 5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-120%)';
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}

function initSocialProof() {
    let idx = 0;
    // Show first toast 3 seconds after page load
    setTimeout(() => {
        showSocialProofToastByIdx(idx++);
        // Then every 3 minutes cycle through the list
        setInterval(() => {
            showSocialProofToastByIdx(idx % SOCIAL_PROOF_DATA.length);
            idx++;
        }, 3 * 60 * 1000);
    }, 3000);
}

function showSocialProofToastByIdx(i) {
    const data = SOCIAL_PROOF_DATA[i % SOCIAL_PROOF_DATA.length];

    let container = document.getElementById('social-proof-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'social-proof-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
        <div class="sp-icon"><i class="fa-solid fa-certificate"></i></div>
        <div class="sp-body">
            <div class="sp-name">${data.name} just booked</div>
            <div class="sp-look">${data.look}</div>
            <div class="sp-time">${data.time}</div>
        </div>
        <button class="sp-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-120%)';
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}


/* ── 9. DARK MODE TOGGLE ────────────────────────────────────────────────── */
function initDarkMode() {
    if (document.getElementById('dark-mode-toggle')) return;

    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';

    const navActions = document.querySelector('.nav-actions');
    if (navActions) navActions.insertBefore(toggle, navActions.firstChild);

    // Restore saved preference
    const saved = localStorage.getItem('aura-theme');
    if (saved === 'dark') enableDark(toggle, false);

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark-mode');
        if (isDark) {
            disableDark(toggle);
        } else {
            enableDark(toggle, true);
        }
    });
}

function enableDark(btn, save) {
    document.documentElement.classList.add('dark-mode');
    btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    if (save) localStorage.setItem('aura-theme', 'dark');
}

function disableDark(btn) {
    document.documentElement.classList.remove('dark-mode');
    btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('aura-theme', 'light');
}


/* ── INIT ALL PREMIUM FEATURES ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initStatsCounter();
    initScrollReveal();
    initNailOfTheWeek();
    initAvailabilityBadge();
    initButtonRipple();
    initTestimonialsCarousel();
    initSocialProof();
    initDarkMode();
});
