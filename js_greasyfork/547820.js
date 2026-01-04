// ==UserScript==
// @name         Remove Comick.dev Translator Entry Lines
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Removes border lines between translator entries in manga chapter tables
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547820/Remove%20Comickdev%20Translator%20Entry%20Lines.user.js
// @updateURL https://update.greasyfork.org/scripts/547820/Remove%20Comickdev%20Translator%20Entry%20Lines.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBorderLines() {
        const tableRows = document.querySelectorAll('tr.border-t');

        tableRows.forEach(function(row) {
            row.classList.remove('border-t', 'dark:border-gray-600', 'border-gray-300');
        });

        const groupRows = document.querySelectorAll('tr.group');
        groupRows.forEach(function(row) {
            if (row.classList.contains('border-t')) {
                row.classList.remove('border-t', 'dark:border-gray-600', 'border-gray-300');
            }
        });
    }

    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    removeBorderLines();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeBorderLines();
            observeChanges();
        });
    } else {
        removeBorderLines();
        observeChanges();
    }
})();