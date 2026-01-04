// ==UserScript==
// @name         Torn Bazaar Auto Update (Next to Save Changes)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds Auto Update All button next to the Save Changes button on Torn bazaar management page
// @author       Nova
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548732/Torn%20Bazaar%20Auto%20Update%20%28Next%20to%20Save%20Changes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548732/Torn%20Bazaar%20Auto%20Update%20%28Next%20to%20Save%20Changes%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CLICK_DELAY_MS = 1000; // 1 second between clicks
    const BUTTON_ID = 'autoUpdateBazaarBtn';

    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.innerText = 'Auto Update All';

        // Style similar to Torn buttons
        button.style.marginLeft = '10px';
        button.style.padding = '6px 12px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Find the Save Changes button
        const saveButton = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'))
            .find(el => el.innerText?.trim().toUpperCase() === 'SAVE CHANGES' || el.value?.trim().toUpperCase() === 'SAVE CHANGES');

        if (saveButton && saveButton.parentNode) {
            saveButton.parentNode.insertBefore(button, saveButton.nextSibling);
        } else {
            // fallback: top of body
            document.body.insertBefore(button, document.body.firstChild);
        }

        return button;
    }

    function scrollToLoadAll(callback) {
        let lastHeight = 0;
        function scrollStep() {
            window.scrollTo(0, document.body.scrollHeight);
            const newHeight = document.body.scrollHeight;
            if (newHeight !== lastHeight) {
                lastHeight = newHeight;
                setTimeout(scrollStep, 800);
            } else {
                window.scrollTo(0, 0);
                callback();
            }
        }
        scrollStep();
    }

    function clickAllUpdateButtons() {
        const updateButtons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'))
            .filter(el => el.innerText?.trim().toUpperCase() === 'UPDATE' || el.value?.trim().toUpperCase() === 'UPDATE');

        if (updateButtons.length === 0) {
            alert('No UPDATE buttons found. Ensure you are on the bazaar management page.');
            return;
        }

        let index = 0;
        function clickNext() {
            if (index < updateButtons.length) {
                updateButtons[index].click();
                index++;
                setTimeout(clickNext, CLICK_DELAY_MS);
            }
        }
        clickNext();
    }

    function init() {
        if (window.location.hash.includes('#/manage')) {
            const button = createButton();
            if (button) {
                button.addEventListener('click', () => {
                    button.disabled = true;
                    button.innerText = 'Loading Items...';
                    scrollToLoadAll(() => {
                        button.innerText = 'Updating...';
                        clickAllUpdateButtons();
                        setTimeout(() => {
                            button.disabled = false;
                            button.innerText = 'Auto Update All';
                        }, CLICK_DELAY_MS * 50);
                    });
                });
            }
        }
    }

    window.addEventListener('load', init);
    setTimeout(init, 3000);
})();