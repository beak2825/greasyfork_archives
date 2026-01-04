// ==UserScript==
// @name         HUANG SHAOLUN Ticket Modifier
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Modify ticket name, birthday, and expire date. Supports Korean names. No flicker, works on home, detail, and my-info pages.
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @match        *://triple.global/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549474/HUANG%20SHAOLUN%20Ticket%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/549474/HUANG%20SHAOLUN%20Ticket%20Modifier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** Configuration ***/
    const OLD_NAME = "최정숙";             // Old name (Korean)
    const NEW_NAME = "HUANG SHAOLUN";      // New name
    const NEW_BIRTHDAY = "(**0208)";       // New birthday
    const NEW_EXPIRE_DATE = "2034-05-13";  // New expire date

    const DATE_RE = /\d{4}-\d{2}-\d{2}/g;
    const BIRTHDAY_RE = /\(\*\*\d{4}\)/g;
    const NAME_RE = new RegExp(OLD_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");

    /*** Safe text node replacement ***/
    function replaceTextNode(node) {
        if (node.nodeType !== 3) return; // Only text nodes
        let text = node.nodeValue.normalize("NFC");
        let newText = text.replace(NAME_RE, NEW_NAME)
                          .replace(BIRTHDAY_RE, NEW_BIRTHDAY)
                          .replace(DATE_RE, NEW_EXPIRE_DATE);
        if (newText !== text) node.nodeValue = newText;
    }

    /*** Traverse nodes and replace text ***/
    function traverseAndReplace(root) {
        if (!root) return;
        if (root.nodeType === 3) {
            replaceTextNode(root);
        } else {
            root.childNodes.forEach(child => traverseAndReplace(child));
        }
    }

    /*** Home page ***/
    function replaceInHome() {
        document.querySelectorAll("div.mbs_4").forEach(el => traverseAndReplace(el));
    }

    /*** Ticket detail page ***/
    function replaceInTicketDetail() {
        document.querySelectorAll("li, span, div, h2, h3, dd").forEach(el => traverseAndReplace(el));
    }

    /*** My info page ***/
    function replaceInMyInfoNode(node) {
        if (node.nodeType !== 1) return;
        if (node.tagName.toLowerCase() === 'dt' && node.textContent.includes("预订者姓名")) {
            const dd = node.nextElementSibling;
            if (dd && dd.tagName.toLowerCase() === 'dd') traverseAndReplace(dd);
        }
        if (node.tagName && node.tagName.toLowerCase() === 'dd') traverseAndReplace(node);
    }

    function replaceInMyInfo() {
        document.querySelectorAll('dt').forEach(dt => {
            if (dt.textContent.includes("预订者姓名")) {
                const dd = dt.nextElementSibling;
                if (dd && dd.tagName.toLowerCase() === 'dd') traverseAndReplace(dd);
            }
        });
    }

    /*** Routing logic ***/
    function run() {
        const url = location.href;
        if (/\/my-info\/reservations\//.test(url)) {
            replaceInMyInfo();
        } else if (/\/tickets\.interpark\.com\/mt\/detail/.test(url)) {
            replaceInTicketDetail();
        } else {
            replaceInHome();
        }
    }

    /*** MutationObserver for dynamic content, debounced ***/
    let timer = null;
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (/\/my-info\/reservations\//.test(location.href)) {
                    replaceInMyInfoNode(node);
                }
            });
        });
        if (timer) clearTimeout(timer);
        timer = setTimeout(run, 50);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial run
    run();
})();
