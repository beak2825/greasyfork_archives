// ==UserScript==
// @name         Bluesky Copy AT URI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a "Copy AT URI" button to the post's "More Options" menu on Bluesky.
// @author       icealtria
// @match        https://bsky.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563119/Bluesky%20Copy%20AT%20URI.user.js
// @updateURL https://update.greasyfork.org/scripts/563119/Bluesky%20Copy%20AT%20URI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cachedAtUri = '';

    function getAtUriFromPostElement(post) {
        const timeLink = post.querySelector('a[href*="/post/"]');
        if (!timeLink) return null;

        const href = timeLink.getAttribute('href');
        const match = href.match(/profile\/([^\/]+)\/post\/([a-zA-Z0-9]+)/);
        if (!match) return null;

        const handle = match[1];
        const rkey = match[2];

        let did = null;
        const avatarImg = post.querySelector('img[src*="/did:"]');
        if (avatarImg) {
            const srcMatch = avatarImg.src.match(/(did:[a-z]+:[a-zA-Z0-9]+)/);
            if (srcMatch) did = srcMatch[1];
        }

        const repo = did || handle;
        return `at://${repo}/app.bsky.feed.post/${rkey}`;
    }

    document.addEventListener('click', (e) => {
        const target = e.target;
        const btn = target.closest('[data-testid="postDropdownBtn"], [aria-label="More options"]');

        if (btn) {
            const post = btn.closest('div[data-testid^="feedItem-"], div[data-testid^="postThreadItem-"]');
            if (post) {
                const uri = getAtUriFromPostElement(post);
                if (uri) {
                    cachedAtUri = uri;
                }
            }
        }
    }, true);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const copyTextBtn = document.querySelector('[data-testid="postDropdownCopyTextBtn"]');
                if (copyTextBtn && !document.querySelector('#my-aturl-btn')) {
                    insertMenuOption(copyTextBtn);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function insertMenuOption(referenceNode) {
        if (!cachedAtUri) return;

        const newBtn = referenceNode.cloneNode(true);
        newBtn.id = 'my-aturl-btn';
        newBtn.removeAttribute('data-testid');
        newBtn.setAttribute('aria-label', 'Copy AT URI');

        const textDiv = newBtn.querySelector('div[dir="auto"]');
        if (textDiv) {
            textDiv.textContent = 'Copy AT URI';
        }

        const svgPath = newBtn.querySelector('svg path');
        if (svgPath) {
            svgPath.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z');
        }

        newBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            GM_setClipboard(cachedAtUri);

            if (textDiv) textDiv.textContent = 'Copied!';

            setTimeout(() => {
                if (textDiv) textDiv.textContent = 'Copy AT URI';
                document.body.click();
            }, 500);
        };

        const separator = referenceNode.nextElementSibling;
        if (separator && separator.getAttribute('role') === 'separator') {
            separator.parentNode.insertBefore(newBtn, separator.nextSibling);
            const newSeparator = separator.cloneNode(true);
            newBtn.parentNode.insertBefore(newSeparator, newBtn.nextSibling);
        } else {
            referenceNode.parentNode.insertBefore(newBtn, referenceNode.nextSibling);
        }
    }
})();