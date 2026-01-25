// ==UserScript==
// @name         Reveal Password On Focus (Robust)
// @namespace    https://greasyfork.org/en/scripts/563194-reveal-password-on-hover
// @version      2
// @description  Reveals password on focus using type change or CSS fallback
// @author       webberLV
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563194/Reveal%20Password%20On%20Focus%20%28Robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563194/Reveal%20Password%20On%20Focus%20%28Robust%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STYLE = `
        input[type="password"].__revealed {
            -webkit-text-security: none !important;
            text-security: none !important;
        }
    `;

    function injectStyle(root) {
        if (root.__styled) return;
        root.__styled = true;
        const style = document.createElement('style');
        style.textContent = STYLE;
        (root.head || root).appendChild(style);
    }

    function reveal(field) {
        try {
            field.type = 'text';
            return true;
        } catch (e) {
            field.classList.add('__revealed');
            return false;
        }
    }

    function hide(field, wasTypeChanged) {
        if (wasTypeChanged) {
            try {
                field.type = 'password';
            } catch (e) {}
        } else {
            field.classList.remove('__revealed');
        }
    }

    function apply(field) {
        if (field.dataset.revealed) return;
        field.dataset.revealed = 'true';
        let wasTypeChanged = false;
        field.addEventListener('focus', () => {
            wasTypeChanged = reveal(field);
        });
        field.addEventListener('blur', () => {
            hide(field, wasTypeChanged);
        });
    }

    function scan(root = document) {
        injectStyle(root);
        root.querySelectorAll('input[type="password"]').forEach(apply);
    }

    function watch(root) {
        scan(root);
        new MutationObserver(() => scan(root)).observe(root, { childList: true, subtree: true });
    }

    watch(document);

    // Handle iframes
    function hookIframes() {
        document.querySelectorAll('iframe').forEach(f => {
            try {
                const d = f.contentDocument;
                if (d) watch(d);
            } catch {}
        });
    }

    hookIframes();
    new MutationObserver(hookIframes).observe(document.documentElement, { childList: true, subtree: true });
})();