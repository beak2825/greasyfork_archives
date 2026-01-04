// ==UserScript==
// @name         YouTube Archive Me Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds an "Archive Me" button to YouTube video action panels that redirects to PreserveTube.com with the current video URL.
// @author       Ghosty-Tongue
// @match        *://www.youtube.com/watch?v=*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554229/YouTube%20Archive%20Me%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/554229/YouTube%20Archive%20Me%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ARCHIVE_URL_BASE = 'https://preservetube.com/save?url=';
    const BUTTON_ID = 'archive-me-custom-button';
    const ACTION_BUTTONS_CONTAINER_SELECTOR = '#actions';
    const LIKE_DISLIKE_SEGMENT_SELECTOR = '#segmented-like-button';

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    function createArchiveButton(container) {
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.title = ''; 

        const iconSpan = document.createElement('span');
        iconSpan.textContent = '🗃️';
        iconSpan.style.marginRight = '6px';
        iconSpan.style.fontSize = '18px';
        iconSpan.style.lineHeight = '1';

        const textSpan = document.createElement('span');
        textSpan.textContent = 'Archive Me';

        button.appendChild(iconSpan);
        button.appendChild(textSpan);

        button.style.cssText = `
            background-color: var(--yt-spec-badge-chip-background);
            color: var(--yt-spec-text-primary);
            border: none;
            padding: 8px 12px;
            border-radius: 18px;
            font-size: 14px;
            font-family: "Roboto", "Arial", sans-serif;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.1s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 0;
            line-height: 1.25;
            text-transform: none;
            white-space: nowrap;
        `;

        const defaultBg = 'var(--yt-spec-badge-chip-background)';
        const hoverBg = 'var(--yt-spec-flat-button-hover-background)'; 

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = hoverBg;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = defaultBg;
        });

        button.addEventListener('click', () => {
            const currentUrl = window.location.href;
            const encodedUrl = encodeURIComponent(currentUrl);
            const targetUrl = ARCHIVE_URL_BASE + encodedUrl;

            window.location.href = targetUrl;
        });

        const likeDislikeSegment = container.querySelector(LIKE_DISLIKE_SEGMENT_SELECTOR);

        if (likeDislikeSegment) {
            likeDislikeSegment.after(button);
            button.style.marginLeft = '8px';
        } else {
            const fallbackContainer = container.querySelector('#top-level-buttons-computed') || container;
            fallbackContainer.prepend(button);
            button.style.marginLeft = '8px';
        }
    }

    waitForElement(ACTION_BUTTONS_CONTAINER_SELECTOR, (container) => {
        const observer = new MutationObserver(() => {
            createArchiveButton(container);
        });

        observer.observe(container, { childList: true, subtree: true });

        createArchiveButton(container);
    });

})();
