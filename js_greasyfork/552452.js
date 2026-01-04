// ==UserScript==
// @name         CircleFTP File Date Display
// @namespace    http://tampermonkey.net/
// @match        *://*.circleftp.net/*
// @version      1.3
// @description  Add File Upload Date For Pc Games
// @author       BlazeFTL
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/552452/CircleFTP%20File%20Date%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/552452/CircleFTP%20File%20Date%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create a CSS class so styles are easy to tweak later
    const style = document.createElement('style');
    style.textContent = `
    .cf-date-inline {
        display: inline-block;
        min-width: 11ch;      /* reserve fixed width so 1-digit and 2-digit days align */
        max-width: 14ch;
        text-align: right;    /* right-align text within the fixed width */
        white-space: nowrap;
        font-size: 0.95em;
        color: #4caf50;
        margin-left: 8px;     /* gap between button and date */
        vertical-align: middle;

    }
    .cf-date-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }`;
    document.head.appendChild(style);

    function formatDate(dateObj) {
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = months[dateObj.getMonth()];
        return `${day} ${monthName}, ${year}`;
    }

    function makeDateElement(text) {
        const span = document.createElement('span');
        span.className = 'cf-date-inline';
        span.textContent = `📅 ${text}`;
        return span;
    }

    // Show date *inside the same cell* as the button to avoid table misalignment
    function showDateNearButton(link, text) {
        // try to find the table cell (td) containing the button
        const cell = link.closest('td') || link.parentElement;
        if (!cell) {
            // fallback: insert after the link
            const span = makeDateElement(text);
            link.insertAdjacentElement('afterend', span);
            return;
        }

        // If we already wrapped the button in our wrapper, don't do it again
        if (link.dataset.cfWrapped === "true") return;

        // create wrapper so we don't disturb other inline content in the cell
        const wrapper = document.createElement('span');
        wrapper.className = 'cf-date-wrapper';

        // Move the button into wrapper
        // If link has siblings like icons, we only move the link itself to keep other elements intact.
        const nextSibling = link.nextSibling;
        wrapper.appendChild(link.cloneNode(true)); // clone the button to keep original events intact for many pages
        link.dataset.cfWrapped = "true";
        // remove original link (we will replace it with wrapper content)
        link.remove();

        // Now append the date span
        const dateSpan = makeDateElement(text);
        wrapper.appendChild(dateSpan);

        // Insert wrapper where the old link was (attempt to place at the position of nextSibling)
        if (nextSibling) {
            cell.insertBefore(wrapper, nextSibling);
        } else {
            cell.appendChild(wrapper);
        }
    }

    // Primary processing function
    function processLinks() {
        // selector includes typical download buttons used earlier and general anchors inside content
        const selector = '.content.entry-content [href]:not([data-date-shown]), .btn-success:not([data-date-shown]), a[class*=btn-warning][download]:not([data-date-shown])';
        document.querySelectorAll(selector).forEach(link => {
            // mark immediately to avoid duplicate processing while async request is in flight
            link.dataset.dateShown = "loading";

            const fileUrl = link.href;
            if (!fileUrl) {
                // no href; mark as done
                link.dataset.dateShown = "true";
                return;
            }

            // HEAD request to fetch headers
            GM_xmlhttpRequest({
                method: "HEAD",
                url: fileUrl,
                onload: function (response) {
                    try {
                        const headers = response.responseHeaders || '';
                        const lastModifiedMatch = headers.match(/Last-Modified:\s*(.*)/i);
                        if (lastModifiedMatch && lastModifiedMatch[1]) {
                            const dateObj = new Date(lastModifiedMatch[1]);
                            if (!isNaN(dateObj.getTime())) {
                                const formatted = formatDate(dateObj);
                                showDateNearButton(link, formatted);
                            } else {
                                showDateNearButton(link, "Unknown date");
                            }
                        } else {
                            showDateNearButton(link, "No date header");
                        }
                    } catch (e) {
                        showDateNearButton(link, "Error");
                    } finally {
                        link.dataset.dateShown = "true";
                    }
                },
                onerror: function () {
                    try { showDateNearButton(link, "Error"); } catch(e) {}
                    link.dataset.dateShown = "true";
                },
                ontimeout: function () {
                    try { showDateNearButton(link, "Timeout"); } catch(e) {}
                    link.dataset.dateShown = "true";
                }
            });
        });
    }

    // Run initially
    processLinks();

    // Also observe DOM changes for dynamically added buttons
    const observer = new MutationObserver(() => processLinks());
    observer.observe(document.body, { childList: true, subtree: true });

})();