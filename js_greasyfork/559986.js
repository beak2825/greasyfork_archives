// ==UserScript==
// @name         Fetlife notifications
// @namespace    B1773rm4n
// @version      2025-12-24
// @description  Fetlife notifications are annoying, this tries to hide it
// @copyright    WTFPL
// @license      WTFPL
// @source       https://github.com/B1773rm4n/Tampermonkey_Userscripts/blob/main/fetlife_Notifications.js
// @author       B1773rm4n
// @match        https://fetlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fetlife.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559986/Fetlife%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/559986/Fetlife%20notifications.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Select the target node
    var target = document.querySelector('title');
    var programmaticChange = false; // Flag to track programmatic changes

    // Create an observer instance
    var observer = new MutationObserver(titleIsChangedEvent);

    // Configuration of the observer
    var config = { subtree: true, characterData: true, childList: true };

    // Pass in the target node, as well as the observer options
    observer.observe(target, config);

    // Function to handle title changes
    function titleIsChangedEvent(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                doChangetitle()
            }
        });
    }

    setInterval(function () {
        doChangetitle()
    }, 10 * 60 * 1000);

    function doChangetitle() {

        const newMessages = document.querySelector('.flex-none.translate-x-2.rounded.bg-red-700.px-1.text-xxs.font-bold.leading-normal.light\\:text-black[aria-hidden="true"]').innerHTML
        // Get the text content
        const value = newMessages.trim();

        // Check if it's a number
        const isNumber = !isNaN(value) && value !== '';

        if (target.textContent !== "FetLife") {
            if (!programmaticChange) {
                console.log(Date()); // Log the current date and time
                // Update the title
                programmaticChange = true; // Set the flag

                if (isNumber && newMessages != 0) {
                    target.textContent = "(" + newMessages + ")" + " Fetlife"; // Change the title text
                } else {
                    target.textContent = "FetLife"; // Change the title text
                }

            } else {
                console.log("Change was made programmatically.");
                programmaticChange = false; // Reset the flag
            }
        }

    }

})();