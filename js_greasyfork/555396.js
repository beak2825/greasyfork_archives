// ==UserScript==
// @name         Searchable Manga Dropdown
// @namespace    http://tampermonkey.net/
// @version      20251207.002
// @description  Makes the manga dropdown searchable
// @author       Tesuto
// @match        https://admin2.armageddontl.com/mi-hoja.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=armageddontl.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555396/Searchable%20Manga%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/555396/Searchable%20Manga%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;

    // Remove duplicated roles in text and dropdown
    function deduplicateRoles() {
        if (observer) observer.disconnect();

        try {
            // Helper to clean comma-separated text roles
            function cleanTextRoles(el) {
                if (!el || !el.textContent.includes(',')) return;
                const roles = el.textContent.split(',').map(r => r.trim()).filter(Boolean);
                const uniqueRoles = [...new Set(roles)];
                const newText = uniqueRoles.join(', ');
                if (newText !== el.textContent.trim()) {
                    el.textContent = newText;
                }
            }

            cleanTextRoles(document.querySelector('#navUserRoles'));

            cleanTextRoles(document.querySelector('#rolesUsuario'));

            const sel = document.querySelector('#rolTarea');
            if (sel) {
                const seen = new Set();
                const toRemove = [];
                for (const opt of sel.options) {
                    if (opt.value && seen.has(opt.value)) {
                        toRemove.push(opt);
                    } else {
                        seen.add(opt.value);
                    }
                }
                if (toRemove.length) toRemove.forEach(o => o.remove());
            }
        } finally {
            if (observer) observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // --- Observe DOM for dynamic role updates ---
    observer = new MutationObserver(() => {
        clearTimeout(observer._timer);
        observer._timer = setTimeout(deduplicateRoles, 50);
    });
    observer.observe(document.body, { childList: true, subtree: true });


    // Using Select2 for searchable dropdown.
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css';
    document.head.appendChild(style);

    $(document).ready(function() {
        const $sel = $('#mangaSelect');
        if (!$sel.length) return;

        // Store computed styles from original <select>
        const computed = window.getComputedStyle($sel[0]);
        const baseStyles = {
            'font-size': computed.fontSize,
            'font-family': computed.fontFamily,
            'color': computed.color,
            'width': computed.width,
            'height': computed.height,
            'border': computed.border,
            'border-radius': computed.borderRadius,
            'background-color': computed.backgroundColor,
        };

        // Initialize Select2
        $sel.select2({
            placeholder: 'Search manga...',
            dropdownParent: $sel.parent()
        });

        // Apply base styles to Select2 container
        const $container = $sel.next('.select2-container');
        $container.find('.select2-selection').css(baseStyles);

        // Reset Select2 when Save button is clicked
        const saveButton = document.querySelector('.botones-tarea button[onclick="guardarTarea()"]');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                setTimeout(() => {
                    $sel.val('').trigger('change');
                }, 50);
            });
        }
    });
})();