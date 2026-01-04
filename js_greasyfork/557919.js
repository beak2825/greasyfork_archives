// ==UserScript==
// @name        Filter unnecessary visa types
// @namespace   Violentmonkey Scripts
// @match       https://checkvisaslots.com/latest-us-visa-availability/*
// @grant       none
// @version     1.0
// @author      Pruthvi Raj
// @description 04/12/2025, 20:17:48
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557919/Filter%20unnecessary%20visa%20types.user.js
// @updateURL https://update.greasyfork.org/scripts/557919/Filter%20unnecessary%20visa%20types.meta.js
// ==/UserScript==

const APPOINTMENT_TYPE_PARENT_SELECTOR = '.mb-12';
const TEXT_TO_SEARCH = 'L-1 (Individual)';

(function () {
    'use strict';

    const isReady = () => {
        return [...document.querySelectorAll(APPOINTMENT_TYPE_PARENT_SELECTOR)].length > 0;
    };

    const onReady = () => {
        [...document.querySelectorAll(APPOINTMENT_TYPE_PARENT_SELECTOR)].forEach(type => {
          if(type.innerText.includes(TEXT_TO_SEARCH)) {
            console.log(type);
          } else {
            type.remove();
          }
        });
    };

    const MAX_WAIT = 30000;
    const CHECK_INTERVAL = 250;
    let timeoutHandle = null;
    const startTime = Date.now();

    const check = () => {
        try {
            if (isReady()) {
                clearTimeout(timeoutHandle);
                onReady();
                return;
            }
        } catch (err) {
            console.error('Error in isReady() condition:', err);
        }
        if (MAX_WAIT > 0 && Date.now() - startTime > MAX_WAIT) {
            console.warn('WaitForCondition: Timeout reached');
            return;
        }
        timeoutHandle = setTimeout(check, CHECK_INTERVAL);
    };

    check();

    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(() => {
            if (isReady()) {
                observer.disconnect();
                clearTimeout(timeoutHandle);
                onReady();
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-*']
        });
        if (MAX_WAIT > 0) {
            setTimeout(() => observer.disconnect(), MAX_WAIT + 5000);
        }
    }
})();