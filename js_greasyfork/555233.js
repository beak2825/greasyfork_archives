// ==UserScript==
// @name        Better Styling
// @namespace   Violentmonkey Scripts
// @match       *://*.scriptblox.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=scriptblox.com
// @grant       GM_addStyle
// @version     1.0.1
// @author      darraghd493
// @description A personal styling adjustment for the ScriptBlox website.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555233/Better%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/555233/Better%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* fix: no header padding - looks off still */
        header {
          padding-top: 40px;
          padding-bottom: 40px;
        }

        /* fix: no content padding */
        #__nuxt > div.flex.flex-col.transition-imp {
          padding-top: 24px;
        }

        /* qol: input */
        input {
          margin-bottom: 4px;
          color: #ccc;
        }

        /* qol: emphasised buttons */
        button {
          transition: transform 0.2s ease-out;
        }

        button:hover {
          transform: scale(103%);
        }

        button:active {
          transform: scale(97%);
        }
    `);

    // remove empty advert blocks (leftover from adblocker - uBlock Origin)
    function removeAds() {
        document.querySelectorAll('.adsbygoogle').forEach(el => {
            const grandParent = el.parentElement?.parentElement;
            if (!grandParent) return;

            // ensure the holder only contains the ad
            const nonAdChildren = Array.from(grandParent.children).filter(child => {
                return !child.classList.contains('adsbygoogle') && child.offsetParent !== null;
            });

            if (nonAdChildren.length === 0 ||
                (nonAdChildren.length === 1 && nonAdChildren[0].contains(el))) {
                grandParent.style.display = 'none';
            }
        });
    }

    removeAds();

    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
