// ==UserScript==
// @name         Zoho CRM – Expand All Ticket Replies
// @author       Kyle M Hall
// @namespace    bywatersolutions.com
// @version      1.2
// @description  Adds a button to expand all ticket replies (SPA-safe)
// @match        https://crm.zoho.com/*
// @match        https://help.bywatersolutions.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559393/Zoho%20CRM%20%E2%80%93%20Expand%20All%20Ticket%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/559393/Zoho%20CRM%20%E2%80%93%20Expand%20All%20Ticket%20Replies.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'expand-all-replies-btn';
    const REPLY_CLASS = '.zd_v2-usertime-container';
    const FIRST_COLLAPSED_INDEX = 2;
    const URL_MATCH = 'tickets/details';

    function expandAllReplies() {
        document.querySelectorAll(REPLY_CLASS).forEach((el, i) => {
            if (i > FIRST_COLLAPSED_INDEX) {
                el.click();
            }
        });
    }

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = 'Expand all replies';

        Object.assign(btn.style, {
            position: 'fixed',
            top: '100px',
            right: '24px',
            zIndex: 9999,
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            background: '#f8f8f8',
            border: '1px solid #ccc',
            display: 'none'
        });

        btn.addEventListener('click', expandAllReplies);
        document.body.appendChild(btn);
    }

    function updateButtonVisibility() {
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) return;

        btn.style.display = location.href.includes(URL_MATCH)
            ? 'block'
            : 'none';
    }

    function watchUrlChanges() {
        let lastUrl = location.href;

        const check = () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                updateButtonVisibility();
            }
        };

        // React router changes
        const origPush = history.pushState;
        const origReplace = history.replaceState;

        history.pushState = function () {
            origPush.apply(this, arguments);
            check();
        };

        history.replaceState = function () {
            origReplace.apply(this, arguments);
            check();
        };

        window.addEventListener('popstate', check);

        // Fallback for edge cases
        setInterval(check, 500);
    }

    /* ---------------- Init ---------------- */

    createButton();
    updateButtonVisibility();
    watchUrlChanges();

})();
