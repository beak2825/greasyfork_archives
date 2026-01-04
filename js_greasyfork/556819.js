// ==UserScript==
// @name         zyBooks Alt Text Copier
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Click images to copy their alt text to clipboard
// @author       GooglyBlox
// @match        https://learn.zybooks.com/zybook/*/chapter/*/section/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556819/zyBooks%20Alt%20Text%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/556819/zyBooks%20Alt%20Text%20Copier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        img[alt]:not([alt=""]) {
            cursor: pointer !important;
        }
        .alt-copy-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 20px;
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #444;
            border-radius: 6px;
            font-size: 14px;
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 400px;
            word-wrap: break-word;
            animation: toast-in 0.2s ease;
        }
        .alt-copy-toast.hiding {
            animation: toast-out 0.2s ease forwards;
        }
        @keyframes toast-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-out {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
    `;
    document.head.appendChild(style);

    let currentToast = null;

    function showToast(message) {
        if (currentToast) {
            currentToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'alt-copy-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        currentToast = toast;

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
                if (currentToast === toast) {
                    currentToast = null;
                }
            }, 200);
        }, 2500);
    }

    function copyAltText(altText) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(altText, 'text');
        } else {
            navigator.clipboard.writeText(altText);
        }
    }

    function markImages() {
        document.querySelectorAll('img[alt]:not([alt=""])').forEach((img) => {
            if (!img.dataset.altCopyReady) {
                img.dataset.altCopyReady = 'true';
                img.title = 'Click to copy alt text';
            }
        });
    }

    markImages();

    const observer = new MutationObserver(() => {
        markImages();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (e) => {
        const img = e.target.closest('img[alt]');
        if (!img) return;

        const altText = img.alt;
        if (!altText || !altText.trim()) return;

        e.preventDefault();
        e.stopPropagation();

        copyAltText(altText);
        showToast('Copied: ' + altText);
    }, true);
})();