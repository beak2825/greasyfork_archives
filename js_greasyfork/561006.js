// ==UserScript==
// @name         X Milady Reply Button
// @namespace    https://tampermonkey.net/
// @version      0.1
// @description  Adds a Milady-eyes button under each tweet that replies "milady"
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561006/X%20Milady%20Reply%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561006/X%20Milady%20Reply%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_CLASS = 'milady-reply-button';

    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '👀';
        btn.title = 'Reply "milady"';
        btn.className = BUTTON_CLASS;

        btn.style.border = 'none';
        btn.style.background = 'transparent';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '18px';
        btn.style.marginLeft = '8px';

        return btn;
    }

    async function replyMilady(article) {
        // Click the native reply button
        const replyButton = article.querySelector('[data-testid="reply"]');
        if (!replyButton) return;

        replyButton.click();

        // Wait for reply dialog to appear
        await new Promise(r => setTimeout(r, 500));

        // Find the text box
        const textbox = document.querySelector('[data-testid="tweetTextarea_0"]');
        if (!textbox) return;

        textbox.focus();
        document.execCommand('insertText', false, 'milady');

        // Small pause so X notices the text
        await new Promise(r => setTimeout(r, 300));

        // Click the send button
        const sendButton = document.querySelector('[data-testid="tweetButtonInline"]');
        if (sendButton && !sendButton.disabled) {
            sendButton.click();
        }
    }

    function enhanceTweet(article) {
        if (article.querySelector(`.${BUTTON_CLASS}`)) return;

        const actionBar = article.querySelector('[role="group"]');
        if (!actionBar) return;

        const btn = createButton();
        btn.addEventListener('click', () => replyMilady(article));
        actionBar.appendChild(btn);
    }

    function scan() {
        document.querySelectorAll('article[data-testid="tweet"]').forEach(enhanceTweet);
    }

    // Initial scan
    scan();

    // Observe future tweets (infinite scroll)
    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
