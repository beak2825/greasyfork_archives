// ==UserScript==
// @name         Looksmax - Toggle for the TestTest1 account in reports
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Adds a toggle button to hide the TestTest1 reports
// @author       tuberculosisinmybal
// @match        https://looksmax.org/reports/*
// @icon         https://www.google.com/s2/favicons?domain=looksmax.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554891/Looksmax%20-%20Toggle%20for%20the%20TestTest1%20account%20in%20reports.user.js
// @updateURL https://update.greasyfork.org/scripts/554891/Looksmax%20-%20Toggle%20for%20the%20TestTest1%20account%20in%20reports.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HIDDEN_USERNAME = "TestTest1";
    let filterActive = true;

    function hideEntries() {
        document.querySelectorAll('.structItem').forEach(item => {
            const latestUser = item.querySelector('.structItem-cell--latest .username span');
            if (latestUser && latestUser.textContent.trim() === HIDDEN_USERNAME) {
                item.style.display = filterActive ? 'none' : '';
            }
        });
    }

    function createToggleButton() {
        const findReportsBtn = document.querySelector('.block-outer-opposite > button.menuTrigger');
        if (!findReportsBtn) return false;

        if (document.querySelector('#filterToggleBtn')) return true;

        const btn = document.createElement('button');
        btn.id = "filterToggleBtn";
        btn.textContent = filterActive ? "Filter ON" : "Filter OFF";
        btn.className = "button--link menuTrigger button";
        btn.style.marginRight = "5px";
        btn.addEventListener('click', () => {
            filterActive = !filterActive;
            btn.textContent = filterActive ? "Filter ON" : "Filter OFF";
            hideEntries();
        });

        findReportsBtn.parentNode.insertBefore(btn, findReportsBtn);
        return true;
    }

    document.addEventListener('DOMContentLoaded', () => {
        hideEntries();
        createToggleButton();
    });

    const observer = new MutationObserver(() => {
        hideEntries();
        createToggleButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
