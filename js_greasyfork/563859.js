// ==UserScript==
// @name         WP Safelink – Submit + 90s Timer + Redirect
// @namespace    http://tampermonkey.net/
// @version      6.0.1
// @description  Auto submit form, clear page, wait 90s, then redirect
// @match        https://studyrays.djbasskingg.com/*
// @match        https://vidyarays.com/*
// @match        https://govrays.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563859/WP%20Safelink%20%E2%80%93%20Submit%20%2B%2090s%20Timer%20%2B%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/563859/WP%20Safelink%20%E2%80%93%20Submit%20%2B%2090s%20Timer%20%2B%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let started = false;

    function startTimerAndRedirect(url) {
        if (started) return;
        started = true;

        // Clear full page
        document.documentElement.innerHTML = '';

        // Create timer UI
        const container = document.createElement('div');
        container.style.cssText = `
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            font-size:40px;
            font-family:Arial,sans-serif;
            background:#000;
            color:#0f0;
        `;
        document.body.appendChild(container);

        let timeLeft = 90;

        container.textContent = `Redirecting in ${timeLeft}s`;

        const timer = setInterval(() => {
            timeLeft--;
            container.textContent = `Redirecting in ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                window.location.href = url;
            }
        }, 1000);
    }

    function runBypass() {
        // STEP 2: Final link found
        const finalLink = document.getElementById('final-get-link');
        if (finalLink && finalLink.href) {
            console.log('[SafeLink] Final link detected, starting timer');
            startTimerAndRedirect(finalLink.href);
        }

        // STEP 1: Submit form
        const form = document.getElementById('sgu4tech');
        if (form && !form.dataset.submitted) {
            console.log('[SafeLink] Submitting form');
            form.dataset.submitted = 'true';
            form.submit();
            return;
        }

        
    }

    runBypass();

    new MutationObserver(runBypass)
        .observe(document.body, { childList: true, subtree: true });

})();