// ==UserScript==
// @name         Unvale Full Neon Green + Complete Theme + QOTD Fix
// @namespace    unvale.io
// @version      2025-09-04
// @description  New Unvale Theme
// @author       You
// @match        https://unvale.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unvale.io
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548383/Unvale%20Full%20Neon%20Green%20%2B%20Complete%20Theme%20%2B%20QOTD%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/548383/Unvale%20Full%20Neon%20Green%20%2B%20Complete%20Theme%20%2B%20QOTD%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** 1️⃣ Apply global styles ***/
    function applyGlobalStyles() {
        const globals = [document.documentElement, document.body,
            ...document.querySelectorAll('.page-profile, .bg-linear-to-t, .dark\\:bg-linear-to-t, .bg-brandingBlue-900, .bg-brandingBlue-925, .bg-brandingBlue-950, .dark\\:bg-brandingBlue-900, .dark\\:bg-brandingBlue-925, .dark\\:bg-brandingBlue-950')];
        globals.forEach(el => {
            el.style.background = '#1A1A1A';
            el.style.backgroundImage = 'none';
            el.style.color = '#E0E0E0';
        });

        // Panels/cards/boxes
        document.querySelectorAll('.panel, .card, .box, .shadow-xl, .rounded-xl').forEach(el => {
            el.style.background = '#242424';
            el.style.border = '1px solid #333333';
            el.style.color = '#E0E0E0';
            el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.5)';
        });

        // Navbar/footer
        document.querySelectorAll('#header-nav, .header-nav, nav, footer').forEach(el => {
            el.style.background = '#282828';
            el.style.borderBottom = '1px solid #333333';
            el.style.color = '#E0E0E0';
        });

        // Inputs
        document.querySelectorAll('input, textarea, select').forEach(el => {
            el.style.background = '#2A2A2A';
            el.style.color = '#E0E0E0';
            el.style.border = '1px solid #444';
            el.style.borderRadius = '8px';
        });

        // Links
        document.querySelectorAll('a, .link').forEach(el => {
            el.style.color = '#39FF14';
            el.addEventListener('mouseenter', () => el.style.color = '#00FF00');
            el.addEventListener('mouseleave', () => el.style.color = '#39FF14');
        });

        // Headings
        document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => el.style.color = '#F5F5F5');

        // Accent text
        document.querySelectorAll('strong, .highlight, .font-bold, .text-brandingPurple-500, .dark\\:text-brandingPurple-400, .hover\\:text-brandingPurple-400').forEach(el => {
            el.style.color = '#39FF14';
        });

        // Override Tailwind text-white in buttons
        document.querySelectorAll('button *, .btn *, .nav-button *').forEach(el => el.style.color = '#121212');
    }

    /*** 2️⃣ Buttons Neon Green + Glow ***/
    function forceNeonGreen(el) {
        if (!el) return;
        function styleElement(elem) {
            elem.style.background = '#39FF14';
            elem.style.backgroundImage = 'none';
            elem.style.border = '1px solid #00FF00';
            elem.style.borderRadius = '9999px';
            elem.style.color = '#121212';
            elem.style.fontWeight = '600';
            elem.style.textAlign = 'center';
            elem.style.boxShadow = '0 0 8px #39FF14';
            Array.from(elem.children).forEach(child => styleElement(child));
        }
        styleElement(el);
    }

    function fixButtons() {
        const buttons = document.querySelectorAll(
            'a.button.button-purple, button[data-testid="explore-button"], button[title="Mark all as read"], button, .btn, .nav-button, .switch-toggle'
        );
        buttons.forEach(btn => forceNeonGreen(btn));

        document.querySelectorAll('nav a.button, nav .button, nav .nav-button').forEach(btn => {
            btn.style.color = '#121212';
            btn.style.fontWeight = '600';
            btn.style.textShadow = '0 0 4px #39FF14';
            btn.addEventListener('mouseenter', () => btn.style.textShadow = '0 0 8px #39FF14');
            btn.addEventListener('mouseleave', () => btn.style.textShadow = '0 0 4px #39FF14');
        });
    }

    /*** 3️⃣ Style QOTD Box + Text ***/
    function styleQOTDBox() {
        const div = document.querySelector('div.absolute.inset-0.z-0.opacity-30');
        if (!div) {
            return;
        }
        div.style.backgroundImage = 'none';
        div.style.backgroundColor = '#39FF14';
        div.style.backgroundPosition = 'center top';
        div.style.backgroundSize = 'cover';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.opacity = '0.25';
        div.style.boxShadow = '0 0 30px 10px #39FF14';
        div.style.borderRadius = '12px';
        div.style.transition = 'box-shadow 1s ease-in-out';

        const parentBox = div.closest('.qotd-box') || div.parentElement;
        if (parentBox) {
            parentBox.style.color = '#121212'; // dark text
            parentBox.style.fontWeight = '600';
            parentBox.style.textShadow = 'none';
        }
    }

    function pulseGlow() {
        const div = document.querySelector('div.absolute.inset-0.z-0.opacity-30');
        if (!div) return;
        let growing = true;
        setInterval(() => {
            const current = parseFloat(div.style.opacity) || 0.25;
            if (growing) {
                div.style.opacity = Math.min(current + 0.005, 0.35);
                if (current >= 0.35) growing = false;
            } else {
                div.style.opacity = Math.max(current - 0.005, 0.25);
                if (current <= 0.25) growing = true;
            }
        }, 50);
    }

    /*** 4️⃣ Fix QOTD Gradient Text ***/
    function fixQOTDText() {
        document.querySelectorAll('span.animate-[gradientText_20s_ease_infinite].bg-clip-text.text-transparent').forEach(span => {
            span.style.backgroundImage = 'none';
            span.style.color = '#121212'; // black/dark text
            span.style.backgroundClip = 'unset';
            span.style.webkitBackgroundClip = 'unset';
        });
    }

    /*** 5️⃣ Style icons and badges ***/
    function styleIconsAndText() {
        document.querySelectorAll('svg, .icon, .fa, .material-icons, i').forEach(icon => {
            icon.style.fill = '#39FF14';
            icon.style.color = '#39FF14';
        });

        document.querySelectorAll('.badge, .notification-count, .icon-badge').forEach(b => {
            b.style.background = '#39FF14';
            b.style.color = '#121212';
            b.style.borderRadius = '9999px';
            b.style.fontWeight = '600';
            b.style.border = '1px solid #00FF00';
            b.style.boxShadow = '0 0 8px #39FF14';
        });
    }

    /*** 6️⃣ Initial run ***/
    setTimeout(() => {
        applyGlobalStyles();
        fixButtons();
        styleQOTDBox();
        pulseGlow();
        fixQOTDText();
        styleIconsAndText();
    }, 500);

    /*** 7️⃣ Watch for dynamic changes ***/
    const observer = new MutationObserver(() => setTimeout(() => {
        applyGlobalStyles();
        fixButtons();
        styleQOTDBox();
        fixQOTDText();
        styleIconsAndText();
    }, 100));
    observer.observe(document.body, { childList: true, subtree: true });

})();