// ==UserScript==
// @name         Post-n-Ghost
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fly away after adding an item to your bazaar. Now with a persistent, collapsible UI.
// @author       You
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/557362/Post-n-Ghost.user.js
// @updateURL https://update.greasyfork.org/scripts/557362/Post-n-Ghost.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2025 You

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(async function() {
    'use strict';

    // --- PART 1: Independent UI ---
    // A self-contained, draggable, collapsible, and persistent UI panel.

    const styles = `
        #png-container { position: fixed; width: 250px; z-index: 9999; background-color: #f0f0f0; border: 1px solid #ccc; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; font-size: 13px; }
        #png-header { display: flex; justify-content: space-between; align-items: center; padding: 8px; cursor: move; background-color: #333; color: white; font-weight: bold; }
        #png-minimize-btn { background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0 5px; }
        #png-content { padding: 10px; }
        #png-content label { display: block; margin-bottom: 5px; }
        #png-content select { width: 100%; padding: 5px; box-sizing: border-box; margin-bottom: 10px; }
        #png-content button { width: 100%; padding: 8px; border: none; background-color: #4CAF50; color: white; cursor: pointer; }
        #png-content button:hover { background-color: #45a049; }
        #png-current-dest { margin-top: 10px; font-style: italic; color: #555; }
        #png-feedback-msg { margin-top: 10px; padding: 8px; background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 4px; text-align: center; display: none; opacity: 0; transition: opacity 0.5s ease-out; }
        #png-button-container { display: flex; justify-content: space-between; gap: 10px; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    let isMinimized = await GM.getValue("png_isMinimized", false);
    let savedPosition = await GM.getValue("png_position", null);

    const container = document.createElement('div');
    container.id = 'png-container';

    if (savedPosition) {
        container.style.top = savedPosition.top;
        container.style.left = savedPosition.left;
    } else {
        container.style.top = '150px';
        container.style.right = '20px';
    }
    document.body.appendChild(container);

    const header = document.createElement('div');
    header.id = 'png-header';
    header.innerHTML = `
        <span>Post-n-Ghost</span>
        <button id="png-minimize-btn" title="Toggle Minimize">${isMinimized ? '&#9660;' : '&#9650;'}</button>
    `;
    container.appendChild(header);

    const content = document.createElement('div');
    content.id = 'png-content';
    if (isMinimized) {
        content.style.display = 'none';
    }
    container.appendChild(content);

    const destinations = ["Argentina", "Canada", "Cayman Islands", "China", "Hawaii", "Japan", "Mexico", "South Africa", "Switzerland", "UAE", "United Kingdom"];
    let savedDestination = await GM.getValue("ghostDestination", "");

    const label = document.createElement('label');
    label.setAttribute('for', 'png-dest-input');
    label.textContent = 'Destination:';
    content.appendChild(label);

    const select = document.createElement('select');
    select.id = 'png-dest-input';

    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select a destination...";
    if (savedDestination === "") defaultOption.selected = true;
    select.appendChild(defaultOption);

    destinations.forEach(dest => {
        const option = document.createElement('option');
        option.value = dest;
        option.textContent = dest;
        if (dest === savedDestination) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    content.appendChild(select);

    const spacer = document.createElement('div');
    spacer.style.marginTop = '10px';
    content.appendChild(spacer);

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'png-button-container';
    content.appendChild(buttonContainer);

    const saveButton = document.createElement('button');
    saveButton.id = 'png-save-btn';
    saveButton.textContent = 'Save'; // Shorter label
    saveButton.style.width = '48%'; // Adjust width
    buttonContainer.appendChild(saveButton);

    const travelButton = document.createElement('button');
    travelButton.id = 'png-travel-btn';
    travelButton.textContent = 'Travel';
    travelButton.style.width = '48%'; // Adjust width
    travelButton.style.backgroundColor = '#007BFF'; // Different color to distinguish
    buttonContainer.appendChild(travelButton);

    const currentDestDisplay = document.createElement('div');
    currentDestDisplay.id = 'png-current-dest';
    currentDestDisplay.textContent = `Current: ${savedDestination || 'Not set'}`;
    content.appendChild(currentDestDisplay);

    const feedbackMsg = document.createElement('div');
    feedbackMsg.id = 'png-feedback-msg';
    content.appendChild(feedbackMsg);

    function showFeedback(message, type = 'success') {
        feedbackMsg.textContent = message;
        if (type === 'error') {
            feedbackMsg.style.backgroundColor = '#f8d7da';
            feedbackMsg.style.color = '#721c24';
            feedbackMsg.style.borderColor = '#f5c6cb';
        } else {
            feedbackMsg.style.backgroundColor = '#d4edda';
            feedbackMsg.style.color = '#155724';
            feedbackMsg.style.borderColor = '#c3e6cb';
        }

        feedbackMsg.style.display = 'block';
        setTimeout(() => { feedbackMsg.style.opacity = 1; }, 10);

        // Hide after a delay
        setTimeout(() => {
            feedbackMsg.style.opacity = 0;
            setTimeout(() => {
                feedbackMsg.style.display = 'none';
            }, 500);
        }, 2500);
    }

    saveButton.addEventListener('click', async () => {
        const newDestination = select.value;
        await GM.setValue("ghostDestination", newDestination);
        savedDestination = newDestination;
        currentDestDisplay.textContent = `Current: ${savedDestination || 'Not set'}`;
        showFeedback(newDestination ? `Destination saved: ${newDestination}` : "Destination cleared.");
    });

    travelButton.addEventListener('click', async () => {
        const destination = await GM.getValue("ghostDestination");
        if (destination) {
            window.location.href = 'https://www.torn.com/page.php?sid=travel';
        } else {
            showFeedback("Please select and save a destination first.", 'error');
        }
    });

    const minimizeButton = document.getElementById('png-minimize-btn');
    minimizeButton.addEventListener('click', async () => {
        isMinimized = !isMinimized;
        content.style.display = isMinimized ? 'none' : 'block';
        minimizeButton.innerHTML = isMinimized ? '&#9660;' : '&#9650;';
        await GM.setValue("png_isMinimized", isMinimized);
    });

    let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
    header.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDragging = true;
        dragOffsetX = e.clientX - container.offsetLeft;
        dragOffsetY = e.clientY - container.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = (e.clientX - dragOffsetX) + 'px';
            container.style.top = (e.clientY - dragOffsetY) + 'px';
            container.style.right = '';
        }
    });
    document.addEventListener('mouseup', async () => {
        if (isDragging) {
            isDragging = false;
            const finalPosition = { top: container.style.top, left: container.style.left };
            await GM.setValue("png_position", finalPosition);
        }
    });

    // --- PART 2: Bazaar "Add Item" Page Logic ---
    async function handleBazaarAddPage() {
        // This logic is no longer needed as the travel button is now in the main UI.
    }

    // --- PART 3: Travel Page Automation (Robust Version) ---
    async function handleTravelPage() {
        const savedDestination = await GM.getValue("ghostDestination");
        if (!savedDestination) return;

        // This map handles special cases where the image name doesn't match the country name.
        const imageNameMap = {
            "United Kingdom": "uk"
        };

        // Format the destination name to match the image URL format.
        // Use the map for special cases, otherwise replace spaces with underscores.
        let searchString;
        if (imageNameMap[savedDestination]) {
            searchString = imageNameMap[savedDestination];
        } else {
            searchString = savedDestination.toLowerCase().replace(/\s/g, '_');
        }

        const performCheckAndClick = () => {
            // --- Desktop Layout Check (divs with background-image) ---
            const pinDivs = document.querySelectorAll('div[class*="pin___"]');
            if (pinDivs.length > 0) {
                for (const pin of pinDivs) {
                    if (pin.style.backgroundImage.includes(searchString)) {
                        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                        pin.dispatchEvent(clickEvent);
                        return true; // Success
                    }
                }
            }

            // --- Mobile Layout Check (buttons with text) ---
            const countrySpans = document.querySelectorAll('span[class*="country___"]');
            if (countrySpans.length > 0) {
                for (const span of countrySpans) {
                    // Mobile view uses the plain text name.
                    if (span.textContent.trim() === savedDestination) {
                        const clickableElement = span.closest('button');
                        if (clickableElement) {
                            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
                            clickableElement.dispatchEvent(clickEvent);
                            return true; // Success
                        }
                    }
                }
            }

            return false; // Failure
        };

        // 1. Try an immediate check for cached pages.
        if (performCheckAndClick()) {
            return;
        }

        // 2. If the immediate check fails, set up an observer for dynamic pages.
        const observer = new MutationObserver((mutations, obs) => {
            if (performCheckAndClick()) {
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Stop the observer after 10 seconds as a fallback.
        setTimeout(() => {
            observer.disconnect();
        }, 10000);
    }

    // --- Main Router ---
    function router() {
        if (window.location.hash === '#/add' && window.location.pathname.includes('bazaar.php')) {
            handleBazaarAddPage();
        } else if (window.location.search.includes('sid=travel')) {
            handleTravelPage();
        }
    }

    window.addEventListener('hashchange', router);
    router();

})();