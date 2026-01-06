// ==UserScript==
// @name         FUCK THE TIMER
// @namespace    http://tampermonkey.net/
// @version      666
// @license      opensource
// @description  FUCK 30 SEC TIMER
// @match        https://lzt.market/*
// @match        https://*.lzt.market/*
// @grant        none
// @author       lolz.live/rsz9
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561619/FUCK%20THE%20TIMER.user.js
// @updateURL https://update.greasyfork.org/scripts/561619/FUCK%20THE%20TIMER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AUTO_CONFIRM = true;

    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;

    window.setTimeout = function(fn, delay, ...args) {
        if (delay >= 900 && delay <= 31000) {
            delay = 1;
        }
        return originalSetTimeout.call(window, fn, delay, ...args);
    };

    window.setInterval = function(fn, delay, ...args) {
        if (delay >= 900 && delay <= 1100) {
            return originalSetTimeout.call(window, fn, 1, ...args);
        }
        return originalSetInterval.call(window, fn, delay, ...args);
    };

    function processForm() {
        const timer = document.querySelector('.RegTimer');
        if (timer) {
            timer.style.display = 'none';
        }

        const form = document.querySelector('form.xenForm.formOverlay.AutoValidator[action*="invoice"][action*="pay"]') ||
                     document.querySelector('form[action*="invoice"][action*="pay"]');

        const btn = form ? form.querySelector('input[type="submit"].SubmitButton') : null;

        if (btn && form) {
            btn.removeAttribute('disabled');
            btn.disabled = false;

            if (AUTO_CONFIRM) {
                setTimeout(() => btn.click(), 50);
                setTimeout(() => {
                    if (form) form.submit();
                }, 200);
                return;
            }

            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                form.submit();
            }, true);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processForm);
    } else {
        processForm();
    }

    setTimeout(processForm, 100);
    setTimeout(processForm, 500);
    setTimeout(processForm, 1000);
    setTimeout(processForm, 2000);

    const observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.classList && (node.classList.contains('xenOverlay') ||
                        node.classList.contains('confirmPayInvoice') ||
                        node.querySelector && node.querySelector('.RegTimer'))) {
                        setTimeout(processForm, 50);
                        setTimeout(processForm, 200);
                        setTimeout(processForm, 500);
                    }
                }
            }
        }
    });

    const waitForBody = setInterval(function() {
        if (document.body) {
            clearInterval(waitForBody);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 10);

})();