// ==UserScript==
// @name         Gemini Shot
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  screenshot gemini conversation
// @author       momo1037
// @match        https://gemini.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563350/Gemini%20Shot.user.js
// @updateURL https://update.greasyfork.org/scripts/563350/Gemini%20Shot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        const targets = document.querySelectorAll('model-response copy-button:not(.share-processed)');
        targets.forEach(originalBtn => {
            originalBtn.classList.add('share-processed');
            addCopyButton(originalBtn);
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addCopyButton(originalBtn) {
        const btn = originalBtn.cloneNode(true);

        btn.addEventListener('click', (e) => {
            const conversation = originalBtn.closest('.conversation-container')
            const wrapper = conversation.querySelector('.markdown-main-panel')
            const originalWidth = wrapper.offsetWidth;
            const originalHeight = wrapper.offsetHeight;
            const paddingSize = 20;
            const blobPromise = window.htmlToImage.toBlob(wrapper, {
                filter: (node) => {
                    return (node.tagName !== 'LINK');
                },
                width: originalWidth + (paddingSize * 2),
                height: originalHeight + (paddingSize * 2),
                skipFonts: true,
                backgroundColor: getComputedStyle(document.body).backgroundColor,
                style: { padding: '20px' }
            });
            const item = new ClipboardItem({ "image/png": blobPromise });
            window.navigator.clipboard.write([item]);
        });


        originalBtn.parentNode.insertBefore(btn, originalBtn.nextSibling);
    }
})();