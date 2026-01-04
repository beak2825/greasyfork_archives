// ==UserScript==
// @name         Piaotia Copier
// @namespace    http://tampermonkey.net/
// @version      2025-11-12
// @description  Copy page content from piaotia.com to your clipboard.
// @author       mrseaman
// @match        https://*.piaotia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=piaotia.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555642/Piaotia%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/555642/Piaotia%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '📋 Copy Content';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            padding: '8px 12px',
            fontSize: '14px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            opacity: '0.85',
        });
        btn.addEventListener('mouseover', () => btn.style.opacity = '1');
        btn.addEventListener('mouseout', () => btn.style.opacity = '0.85');
        return btn;
    }

    function showToast(message, success = true) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            backgroundColor: success ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            zIndex: 100000,
            opacity: '0',
            transition: 'opacity 0.4s ease',
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    async function copyContent() {
        const div = document.getElementById('content');
        if (!div) return showToast('❌ No #content element found', false);

        const text = div.innerText.trim();
        if (!text) return showToast('⚠️ #content is empty', false);

        try {
            // Try Tampermonkey API first
            GM_setClipboard(text);
            showToast('✅ Text copied via GM_setClipboard!');
        } catch (e1) {
            try {
                // Fallback to browser API
                await navigator.clipboard.writeText(text);
                showToast('✅ Text copied via navigator.clipboard!');
            } catch (e2) {
                console.error('Clipboard failed:', e1, e2);
                showToast('❌ Failed to copy text', false);
            }
        }
    }

    // Inject the floating button
    const button = createButton();
    button.addEventListener('click', copyContent);
    document.body.appendChild(button);


})();