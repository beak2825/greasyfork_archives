// ==UserScript==
// @name         Brave-dumps popup cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hides the modal dialog and restores right click actions based on ExamTopics Popup Remover by  Aruna Telshan
// @author       Diego garcia del Rio 
// @match        https://brave-dumps.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/558948/Brave-dumps%20popup%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/558948/Brave-dumps%20popup%20cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePopup() {
        const popup = document.getElementById('autoShowModal');
        if (popup) {
            popup.remove();
        }
        const backdrop = document.getElementById('custom-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    function cleanupBody(){
        document.body.classList.remove('modal-open');
        document.body.style="";
    }

    function enableRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.returnValue = true;
            return true;
        }, true);
        document.addEventListener('mousedown', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);
        document.addEventListener('mouseup', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);
        document.addEventListener('click', function(e) {
            if (e.button === 2) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.returnValue = true;
                return true;
            }
        }, true);

        // Remove potential inline event handlers that might be blocking right-click.
        document.querySelectorAll('*').forEach(function(element) {
            element.oncontextmenu = null;
            element.onmousedown = null;
            element.onmouseup = null;
            element.onclick = null;
        });

    }

    hidePopup();
    enableRightClick();
    cleanupBody();

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            hidePopup();
            cleanupBody();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
