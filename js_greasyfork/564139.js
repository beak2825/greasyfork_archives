// ==UserScript==
// @name         Auto Ludus ADLogin click
// @namespace    http://tampermonkey.net/
// @version      2026-01-24
// @description  Click the annoyingly small ADLogin button
// @match        https://gges.luduseg.dk/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564139/Auto%20Ludus%20ADLogin%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/564139/Auto%20Ludus%20ADLogin%20click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let startskema = false;
    let adClicked = false;

    function handleClicks(node) {
        // Look for ADLogin button
        if (!adClicked) {
            const adLoginSpans = node.querySelectorAll ? node.querySelectorAll('div span') : [];
            adLoginSpans.forEach((span) => {
                if (span.textContent.trim() === 'ADLogin') {
                    const parentDiv = span.closest('div');
                    if (parentDiv) {
                        parentDiv.click();
                        adClicked = true;
                        console.log('ADLogin clicked');
                    }
                }
            });
        }

        // Look for Skemaer button
        if (!startskema) {
            const skemaSpans = node.querySelectorAll ? node.querySelectorAll('span') : [];
            skemaSpans.forEach((span) => {
                if (span.textContent.trim() === 'Skemaer') {
                    const parentSpan = span.closest('span');
                    if (parentSpan) {
                        parentSpan.click();
                        startskema = true;
                        console.log('Skemaer clicked');
                    }
                }
            });
        }

        // If both buttons clicked, stop observing
        if (adClicked && startskema && observer) {
            observer.disconnect();
            console.log('Observer disconnected, all actions complete.');
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            mutation.addedNodes.forEach((node) => {
                handleClicks(node);
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Immediate check in case elements are already present
    handleClicks(document.body);

})();
