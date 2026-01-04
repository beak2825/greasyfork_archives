// ==UserScript==
// @name         Comgate GitLab MR Rules
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Softove hlida ze splnujeme pravidla pro MR
// @author       You
// @match        https://gitlab.comgate.cz/*/merge_requests/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556486/Comgate%20GitLab%20MR%20Rules.user.js
// @updateURL https://update.greasyfork.org/scripts/556486/Comgate%20GitLab%20MR%20Rules.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function checkRules() {
        const btn = document.querySelector('.accept-merge-request');
        if (!btn) return;

        const currentUser = window.gon?.current_username;

        const authorLink = document.querySelector('.issuable-meta .author-link');
        const authorUsername = authorLink ? authorLink.getAttribute('href').replace('/', '') : '';

        const title = document.querySelector('h1.title')?.innerText.trim() || '';


        let validApprovals = 0;

        const approverLinks = document.querySelectorAll('a.gl-link.gl-avatar-link.user-avatar-link.js-user-link');
        validApprovals = Array.from(approverLinks).filter(link => {
            const username = link.getAttribute('href').split('/').pop();
            return username !== authorUsername;
        }).length;

        const errors = [];

        if (currentUser === authorUsername) {
            errors.push("⛔ Jsi autor tohoto MR.");
        }

        const titleRegex = /^INFSYS-[0-9]{4,5}/;
        if (!titleRegex.test(title)) {
            errors.push("⛔ Špatný název (chybí INFSYS-XXXX). Nalezeno: '" + title + "'");
        }

        if (validApprovals < 3) {
            errors.push(`⛔ Málo schválení (${validApprovals}/3).`);
        }

        const errorContainerId = 'mr-rules-blocker-msg';
        let errorMsg = document.getElementById(errorContainerId);

        if (errors.length > 0) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';

            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.id = errorContainerId;
                errorMsg.style.color = '#d9534f';
                errorMsg.style.marginTop = '10px';
                errorMsg.style.fontWeight = 'bold';
                errorMsg.style.whiteSpace = 'pre-line';
                errorMsg.style.marginLeft = '10px'
                btn.parentElement.appendChild(errorMsg);
            }
            errorMsg.innerText = "BLOKOVÁNO:\n" + errors.join('\n');
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            if (errorMsg) errorMsg.remove();
        }
    }

    if (window.mrRulesInterval) clearInterval(window.mrRulesInterval);
    window.mrRulesInterval = setInterval(checkRules, 1000);

    // Initial check after a short delay to ensure page is fully loaded
    setTimeout(checkRules, 500);

    console.log("🛡️ Comgate MR Rules Loaded");
})();
