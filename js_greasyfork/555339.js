// ==UserScript==
// @name         SpeechLive Plugins
// @namespace    http://tampermonkey.net/
// @version      2025-06-18
// @description  Reassign dictations if pending; button only shows on /dictations/all (SPA-safe, no interval).
// @license      MIT
// @author       You
// @match        https://app.speechlive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speechlive.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555339/SpeechLive%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/555339/SpeechLive%20Plugins.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const attachedListeners = new Set();

    // Create and style the button
    const btn = document.createElement('button');
    btn.textContent = 'Re-assign Dictations';
    btn.id = 'reassign-dictations-btn';

    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        padding: '10px 15px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontSize: '14px',
        display: 'none' // initially hidden
    });

    btn.addEventListener('click', ReassignDictations);
    document.body.appendChild(btn);

    // Show or hide the button based on URL
    function updateButtonVisibility() {
        btn.style.display = location.href.includes('/dictations/all') ? 'block' : 'none';
    }

    function CheckForNewDictations() {
        const checkTimer = setInterval(()=> {
            const validDictations = [...document.querySelectorAll(".v-data-table__tbody > tr")].filter(row=>[...row.querySelectorAll("span")].some(span=>span.textContent.trim().toLowerCase() == "pending"))
            if (validDictations.length > 0) {
                document.title = `(${validDictations.length}) Philips SpeechLive`
            } else {
                document.title = `Philips SpeechLive`
            }
        }, 60000);
    }

    // Hook into History API to catch SPA navigation
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
        origPushState.apply(this, args);
        updateButtonVisibility();
    };

    history.replaceState = function (...args) {
        origReplaceState.apply(this, args);
        updateButtonVisibility();
    };

    if (!attachedListeners.has(updateButtonVisibility)) {
        window.addEventListener('popstate', updateButtonVisibility);
        attachedListeners.add(updateButtonVisibility);
    }

    if (!attachedListeners.has(CheckForNewDictations)) {
        CheckForNewDictations();
        attachedListeners.add(CheckForNewDictations);
    }

    // Initial check
    updateButtonVisibility();

    function ReassignDictations() {
        let authorIndex = 0
        let firstAuthor = document.querySelectorAll(".v-data-table__tbody > tr > .table-cell__author span.text-overflow")[authorIndex]?.textContent.trim();
        const allRows = document.querySelectorAll(".v-data-table__tbody > tr");

        allRows.forEach(row => {
            Reassign(row);
        });

        function Reassign(row) {
            const authorSpan = row.querySelector(".table-cell__author span.text-overflow");
            const authorName = authorSpan?.textContent.trim();

            if (authorName === firstAuthor) {
                const stateSpan = row.querySelector(".table-cell__state span.text-overflow");
                const stateText = stateSpan?.textContent.toLowerCase() || "";

                if (stateText.includes("pending") || stateText.includes("finished")) {
                    const checkboxInput = row.querySelector("input.app-checkbox__input");
                    if (checkboxInput) {
                        checkboxInput.click();

                        const reassignInterval = setInterval(() => {
                            const reassignIcon = document.querySelector(".philips-icon--reassign");
                            if (reassignIcon) {
                                clearInterval(reassignInterval);
                                reassignIcon.click();

                                const typistInterval = setInterval(() => {
                                    const typistInput = document.querySelector(".typist-selection-input input");
                                    if (typistInput) {
                                        clearInterval(typistInterval);
                                        typistInput.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
                                        typistInput.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));

                                        const listItemInterval = setInterval(() => {
                                            const listItem = document.querySelector('[data-testid="list-item-Wakefield Specialists"]');
                                            if (listItem) {
                                                clearInterval(listItemInterval);
                                                listItem.click();

                                                const primaryBtnInterval = setInterval(() => {
                                                    const primaryBtn = document.querySelector(".app-button--primary");
                                                    if (primaryBtn) {
                                                        clearInterval(primaryBtnInterval);
                                                        primaryBtn.click();

                                                        const secondClickInterval = setInterval(() => {
                                                            const primaryBtn2 = document.querySelector(".app-button--primary");
                                                            if (primaryBtn2) {
                                                                clearInterval(secondClickInterval);
                                                                primaryBtn2.click();
                                                            }
                                                        }, 500);
                                                    }
                                                }, 500);
                                            }
                                        }, 500);
                                    }
                                }, 500);
                            }
                        }, 500);
                    }
                }
            } else {
                authorIndex += 1;
                firstAuthor = document.querySelectorAll(".v-data-table__tbody > tr > .table-cell__author span.text-overflow")[authorIndex]?.textContent.trim();
                Reassign(row);
            }
        }
    }
})();
