// ==UserScript==
// @name         Jira Copy ID
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  Sharing Jira tasks made a bit more Easy
// @author       Peter Briers
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        all
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554300/Jira%20Copy%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/554300/Jira%20Copy%20ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectorShare = '[data-testid="share-button.ui.pre-share-view.button"], [data-testid="share-dialog.ui.share-button"]';
    const selectorTicketId = '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]';
    const selectorTitle = '[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"]';
    const selectorPermalink = '[data-testid="issue.common.component.permalink-button.button.copy-link-button-wrapper"]';
    const elJiraContainer = document.querySelector('#jira-frontend');

    const observerConfig = { attributes: false, childList: true, subtree: true };
    const observer = new MutationObserver(debounce(createButton));
    observer.observe(elJiraContainer, observerConfig);

    function createButton() {
        const elTicket = document.querySelector(selectorTicketId);
        const elTitle = document.querySelector(selectorTitle);
        const elShare = document.querySelector(selectorShare);
        const elPermalink = document.querySelector(selectorPermalink);

        if(elShare) {
            observer.disconnect(); // Stop listening to changes until the following changes are done.
            // Nuke all the eventListeners through cloning the element
            const elShareModified = elShare.cloneNode(true);
            elShareModified.addEventListener('click', function() {
                setClipboard(`[${elTicket.textContent}] ${elTitle.textContent} \n${elTicket.href}`);
            });
            elShare.replaceWith(elShareModified);
            observer.observe(elJiraContainer, observerConfig); // Start listening to changes again. :)
        }
    }

    function debounce(func, timeout = 500){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    async function setClipboard(text) {
        const type = "text/plain";
        const clipboardItemData = {
            [type]: text,
        };
        const clipboardItem = new ClipboardItem(clipboardItemData);
        await navigator.clipboard.write([clipboardItem]);
    }
})();