// ==UserScript==
// @name         Gameserver.gratis Popup Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove ad popup from gameserver.gratis
// @author       You
// @match        https://gameserver.gratis/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547849/Gameservergratis%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/547849/Gameservergratis%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAdOverlay() {
        const overlays = document.querySelectorAll('div[style*="z-index"]');

        for (let overlay of overlays) {
            if (overlay.style.zIndex === '45' ||
                (overlay.classList.contains('fixed') &&
                 overlay.classList.contains('inset-0') &&
                 overlay.querySelector('ins.adsbygoogle'))) {

                console.log('Found ad overlay');

                overlay.remove();
                console.log('Ad overlay removed completely!');
                return true;
            }
        }

        const adContainers = document.querySelectorAll('.fixed.inset-0');
        for (let container of adContainers) {
            if (container.querySelector('ins.adsbygoogle') ||
                container.textContent.includes('Financed by advertisements')) {

                console.log('Found ad container');
                container.remove();
                console.log('Ad container removed!');
                return true;
            }
        }

        return false;
    }

    function tryClickButton() {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            if (button.textContent.includes('No Thanks')) {
                console.log('Found No Thanks button');

                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                button.dispatchEvent(clickEvent);
                console.log('Dispatched click event');
                return true;
            }
        }
        return false;
    }

    function removeAds() {
        if (removeAdOverlay()) {
            return true;
        }

        if (tryClickButton()) {
            return true;
        }

        return false;
    }

    if (removeAds()) {
        console.log('Ads removed successfully!');
    } else {
        console.log('Ads not found yet, setting up watcher...');

        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    removeAds();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        const checkInterval = setInterval(function() {
            if (removeAds()) {
                clearInterval(checkInterval);
                observer.disconnect();
            }
        }, 300);
    }

    const style = document.createElement('style');
    style.textContent = `
        body {
            overflow: auto !important;
        }
        .overflow-hidden {
            overflow: auto !important;
        }
    `;
    document.head.appendChild(style);
})();