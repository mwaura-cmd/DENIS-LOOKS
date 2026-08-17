/**
 * Aura Nails Hub - Visual Effects & Interactions Engine
 * Provides Custom Glowing Aura Cursor, 3D Card Physics & Tilt,
 * Dynamic Parallax Scroll Engine, and Reveal Animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    init3DTiltEffects();
    initParallaxEngine();
    initScrollReveal();
    initInteractiveSpotlights();
});

/* ==========================================================================
   1. CUSTOM GLOWING AURA CURSOR
   ========================================================================== */
function initCustomCursor() {
    // Only enable on desktop with fine pointers
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursorDot = document.createElement('div');
    cursorDot.className = 'aura-cursor-dot';

    const cursorAura = document.createElement('div');
    cursorAura.className = 'aura-cursor-glow';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorAura);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Smooth animation loop for aura trailing effect
    function renderCursor() {
        auraX += (mouseX - auraX) * 0.15;
        auraY += (mouseY - auraY) * 0.15;

        cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive element hover states
    const interactiveSelectors = 'a, button, input, select, textarea, .gallery-card, .tilt-card, .btn, .tag-pill, .filter-btn, .action-btn';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursorDot.classList.add('cursor-hover');
            cursorAura.classList.add('aura-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            cursorDot.classList.remove('cursor-hover');
            cursorAura.classList.remove('aura-hover');
        }
    });

    document.addEventListener('mousedown', () => {
        cursorDot.classList.add('cursor-click');
        cursorAura.classList.add('aura-click');
    });

    document.addEventListener('mouseup', () => {
        cursorDot.classList.remove('cursor-click');
        cursorAura.classList.remove('aura-click');
    });
}

/* ==========================================================================
   2. 3D TILT & SPECULAR HIGHLIGHT EFFECTS
   ========================================================================== */
function init3DTiltEffects() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    function applyTilt(el) {
        if (el._tiltInitialized) return;
        el._tiltInitialized = true;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg rotation
            const rotateY = ((x - centerX) / centerX) * 9;

            el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update specular lighting flare position
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // Attach to existing & dynamically created tilt cards
    document.querySelectorAll('.tilt-card, .gallery-card, .inspo-card, .standard-card, .rate-card').forEach(applyTilt);

    // Observer for dynamically added cards (like newly uploaded sets)
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches && (node.matches('.tilt-card') || node.matches('.gallery-card'))) {
                        applyTilt(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.tilt-card, .gallery-card').forEach(applyTilt);
                    }
                }
            });
        });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

/* ==========================================================================
   3. DYNAMIC PARALLAX ENGINE
   ========================================================================== */
function initParallaxEngine() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax on decorative aura glowing orbs
                const auraOrbs = document.querySelectorAll('[data-parallax-speed]');
                auraOrbs.forEach((orb) => {
                    const speed = parseFloat(orb.dataset.parallaxSpeed) || 0.2;
                    const yPos = -(scrolled * speed);
                    orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });

                // Parallax on floating hero badges
                const floatingBadges = document.querySelectorAll('.hero-floating-badge');
                floatingBadges.forEach((badge, index) => {
                    const factor = (index + 1) * 0.08;
                    badge.style.transform = `translate3d(0, ${scrolled * factor}px, 0)`;
                });

                // Parallax on hero showcase mockup
                const heroVisual = document.querySelector('.hero-visual-card');
                if (heroVisual) {
                    heroVisual.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
                }

                // Sticky navbar backdrop blur transition
                const header = document.querySelector('.site-header');
                if (header) {
                    if (scrolled > 50) {
                        header.classList.add('header-scrolled');
                    } else {
                        header.classList.remove('header-scrolled');
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ==========================================================================
   4. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   5. INTERACTIVE SPOTLIGHT ON CONTAINERS
   ========================================================================== */
function initInteractiveSpotlights() {
    const spotlightContainers = document.querySelectorAll('.spotlight-surface');
    
    spotlightContainers.forEach((container) => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            container.style.setProperty('--spotlight-x', `${x}px`);
            container.style.setProperty('--spotlight-y', `${y}px`);
        });
    });
}

window.effectsEngine = {
    refreshTilt: init3DTiltEffects
};
