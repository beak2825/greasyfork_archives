// ==UserScript==
// @name         Haunted Woods Hunt Autocollector
// @namespace
// @version      1.0.1
// @description  Clicks the items in the haunted woods hunt daily for items
// @author
// @match        *://*.neopets.com/halloween/haunted_woods_hunt.phtml*
// @grant        none
// @license      The Unlicense
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/557097/Haunted%20Woods%20Hunt%20Autocollector.user.js
// @updateURL https://update.greasyfork.org/scripts/557097/Haunted%20Woods%20Hunt%20Autocollector.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        // --- GLOBAL STATE AND CONFIGURATION ---

        let isRunning = false;
        const CONTROL_BUTTON_ID = 'hw_control_button';
        const baseURL = 'https://www.neopets.com';
        const REQUEST_DELAY_MS = 500; 


        function extractAndStartUrls() {
            const hauntedHuntDiv = document.getElementById('haunted_hunt');

            if (!hauntedHuntDiv) {
                console.error("Script Initialization Failed: Could not find element with ID 'haunted_hunt'.");
                return;
            }

            // Use nextElementSibling (Vanilla JS) instead of jQuery's .next('selector')
            const scriptElement = hauntedHuntDiv.nextElementSibling;

            if (!scriptElement || scriptElement.tagName !== 'SCRIPT') {
                console.error("Script Initialization Failed: Adjacent sibling is not a <script> tag.");
                return;
            }

            // Use textContent (Vanilla JS) instead of jQuery's .text()
            const scriptText = scriptElement.textContent;

            const configRegex = /const\s*config\s*=\s*(\{[\s\S]*?\});/;
            const configMatch = scriptText.match(configRegex);

            if (!configMatch || !configMatch[1]) {
                console.error("Script Initialization Failed: Could not find 'const config' object.");
                return;
            }

            const configString = configMatch[1].trim();
            let evaluatedConfig;
            try {
                // Using new Function() for safe object literal evaluation (handles unquoted keys)
                evaluatedConfig = new Function('return ' + configString)();
            } catch (e) {
                console.error("Script Initialization Failed: Could not safely evaluate 'config' object.", e);
                return;
            }

            const overlaysArray = evaluatedConfig.overlays;
            const button = document.getElementById(CONTROL_BUTTON_ID);

            if (!overlaysArray || overlaysArray.length === 0) {
                console.log("Already clicked all objects");
                if (button) {
                    // Already clicked all objects text in button
                    button.classList.remove('button-green__2020');
                    button.classList.add('button-red__2020');
                    button.textContent = 'Already clicked all objects';
                }
                isRunning = false;
                return;
            }

            // Map the array of objects to an array of just the URL strings
            const allUrls = overlaysArray.map(overlayObject => overlayObject.url).filter(url => url);

            console.log(`[Autohunter] Found ${allUrls.length} URLs. Starting visit sequence...`);
            processUrlsSequentially(allUrls, 0);
        }

        /**
         * Processes the list of URLs one by one with a delay between each fetch.
         */
        function processUrlsSequentially(urls, index) {
            const button = document.getElementById(CONTROL_BUTTON_ID);

            if(isRunning && index<=urls.length) {
                // Display process in button
                button.textContent = `Clicking Link [${index + 1}/${urls.length}]`;
                button.classList.remove('button-yellow__2020');
                button.classList.add('button-purple__2020');

            }

            // Check isRunning flag before proceeding
            if (!isRunning || index >= urls.length) {
                isRunning = false;
                if (button) {
                    button.textContent = 'Done!';
                    button.classList.remove('hw-stop', 'button-purple__2020');
                    button.classList.add('hw-start', 'button-green__2020');
                }
                console.log("--- Done autohunting ---");
                return;
            }

            const relativeUrl = urls[index];
            const fullUrl = baseURL + relativeUrl;

            console.log(`[${index + 1}/${urls.length}] Fetching: ${fullUrl}`);

            fetch(fullUrl)
                .then(response => {
                    if (response.ok) {
                        console.log(`[${index + 1}] Status 200: Successfully processed.`);
                    } else {
                        console.error(`[${index + 1}] Status ${response.status}: Failed to process.`);
                    }
                })
                .catch(error => {
                    console.error(`[${index + 1}] Network Error: ${error.message}`);
                })
                .finally(() => {
                    // Schedule the next request with a delay
                    setTimeout(() => {
                        processUrlsSequentially(urls, index + 1);
                    }, REQUEST_DELAY_MS);
                });
        }

        // SETUP UI AND EVENT HANDLING

        function setupUIAndEvents() {
            const buttonContainer = document.querySelector('div#haunted_hunt div.buttons');

            // for debugging
            if (!buttonContainer) {
                console.error("Could not find the button container 'div#haunted_hunt div.buttons'.");
                return;
            }

            // Start Script button
            const buttonHTML = `<button id="${CONTROL_BUTTON_ID}" class="hw-start button-default__2020 button-yellow__2020">Start Script</button>`;
            // Add the button in the div
            buttonContainer.insertAdjacentHTML('beforeend', buttonHTML);

            // event handler for start button
            const button = document.getElementById(CONTROL_BUTTON_ID);

            if (button) {
                button.addEventListener('click', function() {
                    if (isRunning) {
                        // Stop logic
                        isRunning = false;
                        this.textContent = 'Stopping...';
                        this.classList.remove('button-green__2020');
                        this.classList.add('button-red__2020');
                        console.log("!!! Stop requested by user. Finishing current request...");
                        this.textContent = 'Stopped!'
                    } else {
                        // Start logic
                        isRunning = true;
                        this.textContent = 'Stop Script';
                        this.classList.remove('button-green__2020', 'hw-start');
                        this.classList.add('button-red__2020', 'hw-stop');
                        console.log("--- Automator Started ---");
                        extractAndStartUrls();
                    }
                });
            }
        }

        setupUIAndEvents();

    })();

