// ==UserScript==
// @name         Zoho CRM Copy Cell 
// @namespace    https://tampermonkey.net/
// @version      1.2
// @match        https://crm.zoho.eu/*
// @grant        none
// @description  Zoho CRM Copy Cell (Ctrl+C + Toast)
// @downloadURL https://update.greasyfork.org/scripts/564103/Zoho%20CRM%20Copy%20Cell.user.js
// @updateURL https://update.greasyfork.org/scripts/564103/Zoho%20CRM%20Copy%20Cell.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentText = null;

    // --- Toast ---
    const toast = document.createElement('div');
    toast.textContent = 'Copied';
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#323232',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '6px',
        fontSize: '13px',
        opacity: '0',
        pointerEvents: 'none',
        transition: 'opacity 0.2s ease',
        zIndex: 999999
    });
    document.body.appendChild(toast);

    function showToast() {
        toast.style.opacity = '1';
        clearTimeout(toast._t);
        toast._t = setTimeout(() => {
            toast.style.opacity = '0';
        }, 900);
    }

    function copy(text) {
        if (!text) return;
        navigator.clipboard.writeText(text);
        showToast();
    }

    // Track hovered cell value
    document.addEventListener('mouseover', e => {
        const el = e.target;
        if (el && el.tagName === 'LYTE-TEXT') {
            const txt = el.textContent.trim();
            currentText = txt || null;
        }
    }, true);

    document.addEventListener('mouseout', e => {
        if (e.target && e.target.tagName === 'LYTE-TEXT') {
            currentText = null;
        }
    }, true);

    // Ctrl + C to copy hovered cell
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key.toLowerCase() === 'c' && currentText) {
            e.preventDefault(); // block normal Ctrl+C
            copy(currentText);
        }
    }, true);

})();
