// ==UserScript==
// @name         ContextAndTime
// @namespace    http://tampermonkey.net/
// @version      2025-10-21.2
// @description  Internal additions for ContextAndTime
// @author       David Robinson
// @match        https://time.contextand.com/*
// @match        https://delegate-time.azurewebsites.net/*
// @match        https://supportnet.consit.dk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contextand.com
// @run-at document-idle
// @grant GM_setValue
// @grant GM_getValue
// @license CC BY-SA
// @downloadURL https://update.greasyfork.org/scripts/553203/ContextAndTime.user.js
// @updateURL https://update.greasyfork.org/scripts/553203/ContextAndTime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ColumnWidth = 'ColumnWidth';
    const IssueId = 'issueId';
    const IssueSetAt = 'issueSetAt'

    function timeLogLinkClick(e) {
        let link = document.querySelector('a[href^="https://time.contextand.com"]');
        let issueId = link.href.split('#').pop();
        GM_setValue(IssueId, issueId);
        GM_setValue(IssueSetAt, JSON.stringify(new Date()));
        return false;
    }

    if (window.location.hostname === 'supportnet.consit.dk') {
        let link = document.querySelector('a[href^="https://time.contextand.com"]');
        if (link) {
            link.addEventListener("click", timeLogLinkClick);
        }
        return;
    }


    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    waitForElement('tr.topHeadRow div:first-child', (element) => {
        let columnHeader = element;

        let storedWidth = GM_getValue(ColumnWidth, null);

        if (storedWidth !== null && storedWidth > 0) {
            columnHeader.style.width = storedWidth + 'px';
        }

        function outputsize() {
            GM_setValue(ColumnWidth, columnHeader.offsetWidth);
        }

        new ResizeObserver(outputsize).observe(columnHeader);
    });

    waitForElement('tbody td.rowHeader', (element) => {
        let hash = window.location.hash;
        let search = hash.split('#').pop();
        if (search == '') {
            let issueId = GM_getValue(IssueId);
            let issueSetAt = new Date(JSON.parse(GM_getValue(IssueSetAt)));

            if (!issueId || !issueSetAt) {
                return;
            }

            if ((new Date - issueSetAt) / 1000 > 120) {
                return;
            }
            search = issueId;

            GM_setValue(IssueId, null);
        }

        let expander = document.querySelector('div.expander:first-child:has(div[data-testid^="allTasksExpanderCollapsed"])');
        if (expander) {
            expander.click();
        }

        // We have to wait a little for the table to be populated
        setTimeout(function() {
            let xpath = `//span[contains(concat(' ', normalize-space(@class), ' '), ' subGroupName ')][starts-with(text(),'${search}')]`;
            let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (matchingElement) {
                matchingElement.scrollIntoView();
                return;
            }

            let searchBtn = document.querySelector('#tft-search');
            searchBtn.click();
            let searchInput = document.querySelector('input.ms-SearchBox-field');
            searchInput.focus();
            searchInput.value = search;
            searchInput.dispatchEvent(new CustomEvent('input', { 'bubbles': true }));
        },100);
    });
})();