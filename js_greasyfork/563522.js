// ==UserScript==
// @name         X Video Downloader - (mobile web)
// @namespace    https://rottencloud.dev/
// @version      1.0.4
// @description  Adds a download button to videos on X (Twitter)
// @author       RottenCloud
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563522/X%20Video%20Downloader%20-%20%28mobile%20web%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563522/X%20Video%20Downloader%20-%20%28mobile%20web%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const initializeDownloader = () => {
        const selectors = 'div[data-testid="videoComponent"]:not(.rc-initialized), div[data-testid="videoPlayer"]:not(.rc-initialized)';
        const elements = document.querySelectorAll(selectors);

        elements.forEach(container => {
            container.classList.add('rc-initialized');

            const dlBtn = document.createElement('button');
            dlBtn.innerHTML = '📂';
            dlBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                z-index: 2147483647 !important;
                background-color: rgba(15, 20, 25, 0.6);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 35px;
                height: 35px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: auto;
            `;

            dlBtn.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();

                const parentArticle = container.closest('article');
                let statusUrl = parentArticle?.querySelectorAll('a[href*="/status/"]')[0]?.href;
                
                if (!statusUrl && window.location.href.includes('/status/')) {
                    statusUrl = window.location.href;
                }

                if (statusUrl) {
                    window.open(`https://twitsave.com/info?url=${encodeURIComponent(statusUrl)}`, '_blank');
                }
            };

            container.appendChild(dlBtn);
        });
    };

    const observer = new MutationObserver(initializeDownloader);
    observer.observe(document.body, { childList: true, subtree: true });
    
    initializeDownloader();
})();
