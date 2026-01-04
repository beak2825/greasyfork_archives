// ==UserScript==
// @name            Youtube download button - addyoutube
// @namespace       http://tampermonkey.net/
// @version         1.0
// @author          God Mario
// @match           *://*.youtube.com/*
// @run-at          document-start
// @icon            https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFbcLYrofSf_CfiO9Vq01UwTI40KKwXrprF86Z64RMRVjmwTxU3VtMCMocBsQMjReHu2n8xMf8HfvYskpF36au9XaDxNjy6IA_6Jwt2zDfBXkjGpCRD5yb7_AcEKI7pOYRt9g5P9g1cBS2BrtGYVSsxg1lyL4rV8lCjbhRIbiZ5z4XXJehUx1ulD-qH4EG/s1920/pngwing.com.png
// @grant           GM_addStyle
// @connect         https://addyoutube.com/
// @license         MIT
// @description     This Script Adds a Download Button on the right side of the subscribe button, you can easily download Audio/Video
// @downloadURL https://update.greasyfork.org/scripts/550548/Youtube%20download%20button%20-%20addyoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/550548/Youtube%20download%20button%20-%20addyoutube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        subscribeButton: '#subscribe-button button',
        downloadButton: '.addyt-download-btn'
    };

    const STRINGS = {
        downloadText: 'Download'
    };

    const STYLES = `
        .addyt-download-btn {
            background-color: var(--yt-spec-additive-background);
            color: var(--yt-spec-text-primary);
            margin: 0px 4px;
            border-radius: 18px;
            width: 120px;
            height: 36px;
            line-height: 37px;
            text-align: center;
            font-style: normal;
            font-size: 14px;
            font-family: Roboto, Noto, sans-serif;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: none;
            cursor: pointer;
        }
        .addyt-download-btn:hover {
            background-color: var(--yt-spec-mono-tonal-hover);
            color: var(--yt-spec-text-primary);
        }
        .addyt-buttons-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `;

    GM_addStyle(STYLES);

    function createDownloadButton() {
        if (document.querySelector(SELECTORS.downloadButton)) {
            return null;
        }

        const downloadButton = document.createElement('button');
        downloadButton.className = 'addyt-download-btn';
        downloadButton.textContent = `⬇ ${STRINGS.downloadText}`;

        downloadButton.addEventListener('click', function() {
            const videoUrl = window.location.href;
            const downloadDomains = ['addyoutube.com/'];
            const newUrl = videoUrl.replace('youtube.com/', downloadDomains);
            window.open(newUrl, '_blank');
        });

        return downloadButton;
    }

    function addDownloadButton() {
        const subscribeButton = document.querySelector(SELECTORS.subscribeButton);
        if (!subscribeButton) {
            return;
        }

        const downloadButton = createDownloadButton();
        if (!downloadButton) {
            return;
        }

        const container = subscribeButton.closest('#subscribe-button');
        if (container) {
            const wrapper = document.createElement('div');
            wrapper.className = 'addyt-buttons-wrapper';

            container.parentNode.insertBefore(wrapper, container);
            wrapper.appendChild(container);
            wrapper.appendChild(downloadButton);
        }
    }

    function init() {
        if (window.location.pathname.includes('/watch')) {
            addDownloadButton();
        }
    }

    const observer = new MutationObserver(init);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    window.addEventListener('yt-navigate-finish', init);

    init();

})();