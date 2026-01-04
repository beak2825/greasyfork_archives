// ==UserScript==
// @name         show tiktok titles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  shows video titles below video previews on tiktok user profiles
// @author       Dax
// @match        https://www.tiktok.com/@*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554376/show%20tiktok%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/554376/show%20tiktok%20titles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .video-title-below {
            margin-top: 8px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            line-height: 1.4;
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding: 0 4px;
        }

        [class*="DivCardFooter"] {
            background: none !important;
        }
    `;
    document.head.appendChild(style);

    function getTitle(img) {
        const alt = img.getAttribute('alt');
        if (!alt) return null;

        let match = alt.match(/^([^#]+?)(?:\s+#|\s+created by)/);
        if (match) {
            return match[1].trim();
        }

        const idx = alt.indexOf('#');
        if (idx > 0) {
            return alt.substring(0, idx).trim();
        }

        return alt;
    }

    function addTitle(container) {
        if (container.querySelector('.video-title-below')) {
            return;
        }

        const img = container.querySelector('img[alt]');
        if (!img) return;

        const title = getTitle(img);
        if (!title) return;

        const vidContainer = container.querySelector('[data-e2e="user-post-item"]');
        if (!vidContainer) return;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'video-title-below';
        titleDiv.textContent = title;

        vidContainer.parentElement.appendChild(titleDiv);
    }

    function processAll() {
        const containers = document.querySelectorAll('[class*="DivItemContainerV2"]');
        containers.forEach(c => addTitle(c));
    }

    processAll();

    const observer = new MutationObserver(() => {
        processAll();
    });

    const main = document.querySelector('[data-e2e="user-post-item-list"]') || document.body;
    observer.observe(main, {
        childList: true,
        subtree: true
    });

    let timeout;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(processAll, 300);
    }, { passive: true });

})();