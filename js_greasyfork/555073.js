// ==UserScript==
// @name         Torn: More Legible Player Names - Inter fork with lowercase support
// @namespace    http://tampermonkey.net/
// @version      4.2.0
// @description  Replaces Torn's pixel honor bar names with a larger, more legible font, while maintaining color outlines for staff roles and those that opt to display blue name.
// @author       GingerBeardMan + swervelord
// @match        https://www.torn.com/*
// @grant        none
// @license	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/555073/Torn%3A%20More%20Legible%20Player%20Names%20-%20Inter%20fork%20with%20lowercase%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/555073/Torn%3A%20More%20Legible%20Player%20Names%20-%20Inter%20fork%20with%20lowercase%20support.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load Inter font with weight 900
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Inject styling
    const style = document.createElement('style');
    style.textContent = `
        .custom-honor-text {
            font-family: 'Inter', sans-serif !important;
            font-weight: 900 !important;
            font-size: 12px !important;
            color: white !important;
            letter-spacing: 0.5px !important;
            pointer-events: none !important;

            position: absolute !important;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100% !important;
            height: auto;

            display: flex !important;
            align-items: center;
            justify-content: center;

            text-align: center !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 10 !important;
        }

        .honor-text-svg {
            display: none !important;
        }

        .outline-black {
            text-shadow:
                -1px -1px 0 #000,
                 1px -1px 0 #000,
                -1px  1px 0 #000,
                 1px  1px 0 #000 !important;
        }

        .outline-blue {
            text-shadow:
                -1px -1px 0 #310AF5,
                 1px -1px 0 #310AF5,
                -1px  1px 0 #310AF5,
                 1px  1px 0 #310AF5 !important;
        }

        .outline-red {
            text-shadow:
                -1px -1px 0 #ff4d4d,
                 1px -1px 0 #ff4d4d,
                -1px  1px 0 #ff4d4d,
                 1px  1px 0 #ff4d4d !important;
        }

        .outline-green {
            text-shadow:
                -1px -1px 0 #3B9932,
                 1px -1px 0 #3B9932,
                -1px  1px 0 #3B9932,
                 1px  1px 0 #3B9932 !important;
        }

        .outline-orange {
            text-shadow:
                -1px -1px 0 #ff9c40,
                 1px -1px 0 #ff9c40,
                -1px  1px 0 #ff9c40,
                 1px  1px 0 #ff9c40 !important;
        }

        .outline-purple {
            text-shadow:
                -1px -1px 0 #c080ff,
                 1px -1px 0 #c080ff,
                -1px  1px 0 #c080ff,
                 1px  1px 0 #c080ff !important;
        }
    `;
    document.head.appendChild(style);

    // Determine the outline style based on role
    function getOutlineClass(wrap) {
        if (wrap.classList.contains('admin')) return 'outline-red';
        if (wrap.classList.contains('officer')) return 'outline-green';
        if (wrap.classList.contains('moderator')) return 'outline-orange';
        if (wrap.classList.contains('helper')) return 'outline-purple';
        if (wrap.classList.contains('blue')) return 'outline-blue';
        return 'outline-black';
    }

    // Replace honor bar name with custom text
    function replaceHonorText() {
        document.querySelectorAll('.honor-text-wrap').forEach(wrap => {
            const sprite = wrap.querySelector('.honor-text-svg');
            const existing = wrap.querySelector('.custom-honor-text');

            if (sprite) sprite.style.display = 'none';
            if (existing) return;

            const text = wrap.getAttribute('data-title') || wrap.getAttribute('aria-label') || wrap.innerText || '';
            const cleaned = text.trim();
            if (!cleaned) return;

            const div = document.createElement('div');
            div.className = `custom-honor-text ${getOutlineClass(wrap)}`;
            div.textContent = cleaned;
            wrap.appendChild(div);
        });
    }

    // Run initially
    replaceHonorText();

    // Watch for dynamic changes
    const observer = new MutationObserver(replaceHonorText);
    observer.observe(document.body, { childList: true, subtree: true });
})();