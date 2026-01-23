// ==UserScript==
// @name         X Block (Fixed)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a block button to tweets excluding your own, using native Twitter block
// @author       adamlproductions
// @match        https://x.com/*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563574/X%20Block%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563574/X%20Block%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let myScreenName = null;

    function extractUserInfo() {
        if (myScreenName) return;
        const profileLink = document.querySelector('a[href^="/"][aria-label*="Profile"]');
        if (profileLink) {
            const href = profileLink.getAttribute('href');
            if (href && href !== '/settings/profile') {
                myScreenName = href.slice(1).toLowerCase();
            }
        }
    }

    function triggerNativeBlock(tweetElement) {
        const menuButton = tweetElement.querySelector('button[aria-label="More"][role="button"]');
        if (!menuButton) return;

        menuButton.click();
        setTimeout(() => {
            const blockOption = document.querySelector(`div[role="menuitem"][data-testid="block"]`);
            if (blockOption) {
                blockOption.click();
            }
        }, 100);
    }

    function addBlockButton(tweet) {
        const actions = tweet.querySelector('div[role="group"]');
        if (actions && !actions.querySelector('.block-button')) {
            const usernameLink = tweet.querySelector('a[href^="/"]');
            if (usernameLink) {
                const screenName = usernameLink.getAttribute('href').slice(1).toLowerCase();

                if (screenName !== myScreenName) {
                    const blockButton = document.createElement('button');
                    blockButton.textContent = 'Block';
                    blockButton.className = 'block-button';
                    blockButton.setAttribute('style', 'margin-left:10px; color:rgb(249, 24, 128); cursor:pointer; font-size:13px; font-weight:bold; border:none; background:none;');

                    blockButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        triggerNativeBlock(tweet);
                    });
                    actions.appendChild(blockButton);
                }
            }
        }
    }

    function scanAndAddButtons() {
        extractUserInfo();
        document.querySelectorAll('article').forEach(article => {
            addBlockButton(article);
        });
    }

    const observer = new MutationObserver(() => {
        scanAndAddButtons();
    });

    function start() {
        const target = document.querySelector('body');
        if (target) {
            observer.observe(target, { childList: true, subtree: true });
            scanAndAddButtons();
        } else {
            setTimeout(start, 500);
        }
    }

    start();
})();