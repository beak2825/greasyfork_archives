// ==UserScript==
// @name         Scroll Buttons
// @namespace    tampermonkey.net/
// @version      1.0
// @description  Adds scroll buttons to Dead Frontier Marketplace which lets you quickly jump up or down to the next item with different name. Scrolling happens from the top item perspective - it logs the first visible item inside the marketplace list and scrolls until the top item becomes something else, based on different item name or different data-type.
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552211/Scroll%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/552211/Scroll%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ignoreBulletCount = false;//if it's set to true and Ignore_Colour_Stats set to false then while scrolling it will ignore bullet count next to the bullets name
    const ignore_GC_MC_tags = false;//if it's set to true and Ignore_Colour_Stats set to false then while scrolling it will ignore (GC) (MC) tags next to the gun names

    const Ignore_Colour_Stats = true;//if set to true it ignores whatever ignoreBulletCount or ignore_GC_MC_tags is set to. Then it skips acts as if both of them are set to true plus ignoring different colours. It only doesn't ignore and stops if item is renamed with different name.
    const smoothScroll = true;//set to false to disable scroll animation
    // Toggle controls     //KEYBOARD CONTROL
    const animation_when_keyboard_scroll = true; // Set to false to disable button color changing animation
    const disableArrowKeys = false; // Set to true to disable scrolling with UP and DOWN arrow keys
    const disableWSKeys = true; // Set to true to disable scrolling with W and S keys
    function Main() {
        // Check if the button already exists to avoid duplicates
        if (document.getElementById('jumpDownButton')) return;

        // Create buttons
        const logButton = document.createElement('button');
        logButton.id = 'logButton'; // Set an ID for the button
        logButton.innerText = 'Log First Visible Item';
        logButton.style.margin = '10px';
        logButton.style.padding = '5px 10px';
        logButton.style.cursor = 'pointer';

        const jumpDownButton = document.createElement('button');
        jumpDownButton.id = 'jumpDownButton'; // Set an ID for the button
        jumpDownButton.style.top = '272px'; // Move the button lower by 150px
        jumpDownButton.style.left = '667px';
        jumpDownButton.style.padding = '0'; // Remove padding for a cleaner look
        jumpDownButton.style.cursor = 'pointer';
        jumpDownButton.style.position = 'absolute';
        jumpDownButton.style.height = '138px'; // Adjust height as needed
        jumpDownButton.style.width = '18px'; // Adjust width as needed
        //jumpDownButton.style.border = 'none';
        jumpDownButton.style.border = '1px solid #990000'; // Border with color
        jumpDownButton.style.backgroundColor = 'rgba(153, 0, 0, 0.3)';//For semi-transparent fill:
        //jumpDownButton.style.backgroundColor = 'transparent'; // No fill color
        //jumpDownButton.style.backgroundColor = '#007BFF'; // Button color
        //jumpDownButton.style.borderRadius = '5px'; // Rounded corners

        // Create the arrow Down element
        const arrowdown = document.createElement('div');
        arrowdown.style.position = 'absolute';
        arrowdown.style.top = '50%'; // Center the arrow vertically
        arrowdown.style.left = '50%'; // Center the arrow horizontally
        arrowdown.style.transform = 'translate(-50%, -50%)'; // Center the arrow
        arrowdown.style.width = '0';
        arrowdown.style.height = '0';
        arrowdown.style.borderLeft = '5px solid transparent';
        arrowdown.style.borderRight = '5px solid transparent';
        arrowdown.style.borderTop = '10px solid white'; // Arrow color

        // Append the arrow Down to the button
        jumpDownButton.appendChild(arrowdown);

        const jumpUpButton = document.createElement('button');
        jumpUpButton.id = 'jumpUpButton'; // Set an ID for the button
        jumpUpButton.style.margin = '130px';
        jumpUpButton.style.left = '537px';
        jumpUpButton.style.padding = '0'; // Remove padding for a cleaner look
        jumpUpButton.style.cursor = 'pointer';
        jumpUpButton.style.position = 'absolute';
        jumpUpButton.style.height = '138px'; // Adjust height as needed
        jumpUpButton.style.width = '18px'; // Adjust width as needed
        //jumpUpButton.style.border = 'none';
        jumpUpButton.style.border = '1px solid #990000'; // Border with color
        jumpUpButton.style.backgroundColor = 'rgba(153, 0, 0, 0.3)';//For semi-transparent fill:
        //jumpUpButton.style.borderRadius = '5px'; // Rounded corners

        // Create the arrow Up element
        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.top = '50%'; // Center the arrow vertically
        arrow.style.left = '50%'; // Center the arrow horizontally
        arrow.style.transform = 'translate(-50%, -50%)'; // Center the arrow
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '5px solid transparent';
        arrow.style.borderRight = '5px solid transparent';
        arrow.style.borderBottom = '10px solid white'; // Arrow color

        // Append the arrow Up to the button
        jumpUpButton.appendChild(arrow);

        // Append buttons to the invController div
        const invController = document.getElementById('invController');
        //invController.appendChild(logButton); //enable only for developing - logs in console the top visible item info ect.
        invController.appendChild(jumpDownButton);
        invController.appendChild(jumpUpButton);


        //KEYBOARD CONTROL
        // Track key press states to prevent multiple triggers on hold
        const keyStates = {
            ArrowUp: false,
            ArrowDown: false,
            W: false,
            S: false
        };
        let isAnimatingButton = false;

        // Function to animate button style
        function animateButton(button) {
            if (!animation_when_keyboard_scroll || isAnimatingButton) return;
            isAnimatingButton = true; // Lock
            //button.disabled = true; // Disable button
            // Save original styles
            const originalBorderColor = button.style.borderColor || '';
            const originalBackgroundColor = button.style.backgroundColor || '';

            // Change styles to indicate activation
            button.style.borderColor = '#FFCC00'; // Bright border
            button.style.backgroundColor = 'rgba(204, 100, 0, 0.5)'; // Less transparent

            // Revert after 200ms
            setTimeout(() => {
                button.style.borderColor = originalBorderColor;
                button.style.backgroundColor = originalBackgroundColor;
                //button.disabled = false; // Re-enable button
                isAnimatingButton = false; // Unlock
            }, 100);
        }
        // Function to handle keydown events
        function handleKeyDown(e) {
            // Prevent default if needed
            if (disableArrowKeys && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();
            }

            // Handle arrow keys with one activation per press
            if (e.key === 'ArrowUp') {
                if (!keyStates.ArrowUp) {
                    keyStates.ArrowUp = true;
                    //console.log('Arrow Up pressed');
                    jumpUp();
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (!keyStates.ArrowDown) {
                    keyStates.ArrowDown = true;
                    //console.log('Arrow Down pressed');
                    jumpDown();
                }
                e.preventDefault();
            } else if (!disableWSKeys) {
                // W/S keys as Up/Down
                if (e.key === 'w' || e.key === 'W') {
                    if (!keyStates.W) {
                        keyStates.W = true;
                        //console.log('W pressed (treated as Arrow Up)');
                        jumpUp();
                    }
                } else if (e.key === 's' || e.key === 'S') {
                    if (!keyStates.S) {
                        keyStates.S = true;
                        //console.log('S pressed (treated as Arrow Down)');
                        jumpDown();
                    }
                }
            }
        }

        function handleKeyUp(e) {
            // Reset key states
            if (e.key === 'ArrowUp') {
                keyStates.ArrowUp = false;
                //console.log('Arrow Up released');
            } else if (e.key === 'ArrowDown') {
                keyStates.ArrowDown = false;
                //console.log('Arrow Down released');
            } else if (!disableWSKeys) {
                if (e.key === 'w' || e.key === 'W') {
                    keyStates.W = false;
                    console.log('W released');
                } else if (e.key === 's' || e.key === 'S') {
                    keyStates.S = false;
                    console.log('S released');
                }
            }
        }

        // Attach event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        //KEYBOARD CONTROL

        function cleanItemNameAmmo(itemName) {
            const lastParenIndex = itemName.lastIndexOf(' (');
            const closingParenIndex = itemName.indexOf(')', lastParenIndex);

            if (lastParenIndex !== -1 && closingParenIndex !== -1) {
                const countInParentheses = itemName.substring(lastParenIndex + 2, closingParenIndex).trim();
                if (/^\d+$/.test(countInParentheses)) {
                    return itemName.substring(0, lastParenIndex).trim();
                }
            }
            return itemName;
        }
        function cleanItemNameTags(itemName) {
            const tagsToRemove = ['(MC)', '(GC)', '(HC)', '(NGC)','(AC)'];
            for (const tag of tagsToRemove) {
                const tagIndex = itemName.lastIndexOf(tag);
                if (tagIndex !== -1) {
                    return itemName.substring(0, tagIndex).trim();
                }
            }
            return itemName;
        }

        function getStandardizedItemName(item) {
            let itemName = item.innerText.split('\n')[0].trim();

            if (Ignore_Colour_Stats) {
                const dataType = item.getAttribute('data-type');
                if (dataType) {
                    if (dataType.includes('_name')) {
                        // itemName remains unchanged
                    } else {
                        const dataTypeParts = dataType.split('_');
                        if (dataTypeParts[dataTypeParts.length - 1] === 'cooked') {
                            itemName = dataTypeParts.join('_');
                        } else {
                            itemName = dataTypeParts[0];
                            if (itemName === 'credits' && item.innerText) {
                                itemName = item.innerText.split('\n')[0].trim();
                            }
                        }
                    }
                } else {
                    //console.log('data-type attribute is null or undefined for item:', item);
                    itemName = item.innerText.split('\n')[0].trim();
                }
            }
            if (ignoreBulletCount && !Ignore_Colour_Stats) {
                itemName = cleanItemNameAmmo(itemName);
            }
            if (ignore_GC_MC_tags && !Ignore_Colour_Stats) {
                itemName = cleanItemNameTags(itemName);
            }
            //if services then return level not name and data-type is null
            const levelElement = item.querySelector('.level'); // Select the level element
            const dataLevel = levelElement ? levelElement.textContent : null; // Get the text content
            if (dataLevel) {
                itemName = dataLevel;
            }
            return itemName;
        }

        // Function to log the first visible item in the itemDisplay div
        logButton.addEventListener('click', () => {
            const itemDisplay = document.getElementById('itemDisplay');
            const items = itemDisplay.children;

            let firstVisibleItem = null;
            let lastVisibleItem = null;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const rect = item.getBoundingClientRect();
                const displayRect = itemDisplay.getBoundingClientRect();

                if (rect.top >= displayRect.top && rect.bottom <= displayRect.bottom) {
                    firstVisibleItem = item;
                    break;
                }
            }
            // If the first visible item is found, look for the last visible item
            if (firstVisibleItem) {
                const firstVisibleIndex = Array.from(items).indexOf(firstVisibleItem);
                const lastVisibleIndex = Math.min(firstVisibleIndex + 13, items.length - 1); // Limit to 13 items below

                // Find the last visible item within the specified range
                for (let i = firstVisibleIndex + 1; i <= lastVisibleIndex; i++) {
                    const item = items[i];
                    const rect = item.getBoundingClientRect();
                    const displayRect = itemDisplay.getBoundingClientRect();

                    if (rect.top >= displayRect.top && rect.bottom <= displayRect.bottom) {
                        lastVisibleItem = item; // Update last visible item
                    }
                }

                console.log('First Visible Item:', firstVisibleItem.innerText);
                const dataType = firstVisibleItem.getAttribute('data-type');
                console.log('Data Type:', dataType);

                console.log('Last Visible Item:', lastVisibleItem.innerText);
                const dataTypeLast = lastVisibleItem.getAttribute('data-type');
                console.log('Data Type of Last Visible Item:', dataTypeLast);

                // Get all child elements inside itemDisplay
                const items123 = itemDisplay.children;
                // Check if there are any child elements
                if (items123.length > 0) {
                    // Get the last child element
                    const lastItem123 = items123[items123.length - 1];
                    // Log the inner text of the last item
                    console.log('Inner Text:', lastItem123.innerText);
                    // Log the data-type attribute of the last item
                    console.log('Data-type:', lastItem123.getAttribute('data-type'));
                } else {
                    console.log('No items found inside itemDisplay.');
                }

                if (ignoreBulletCount) {
                    let itemName = getStandardizedItemName(firstVisibleItem);
                    console.log(itemName);
                }
            } else {
                console.log('No items currently visible.');
            }
        });
        function smoothScrollTo(element, targetTop) {
            return new Promise((resolve) => {
                const startTop = element.scrollTop;
                const distance = targetTop - startTop;
                const duration = 200; // duration in ms
                const startTime = performance.now();

                function scroll() {
                    const now = performance.now();
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    element.scrollTop = startTop + distance * progress;
                    if (progress < 1) {
                        requestAnimationFrame(scroll);
                    } else {
                        resolve();
                    }
                }
                requestAnimationFrame(scroll);
            });
        }

        let isScrolling = false;
        async function jumpDown() {
            if (isScrolling) return;
            isScrolling = true;
            jumpDownButton.disabled = true; // Disable button
            // Animate button if enabled
            animateButton(jumpDownButton);
            const itemDisplay = document.getElementById('itemDisplay');
            //const items = itemDisplay.children;
            let items;
            try {
                items = itemDisplay.children;
            } catch (error) {
                console.error('An error occurred while accessing itemDisplay.children:', error);
                isScrolling = false; // Reset scrolling state if no items are found
                jumpDownButton.disabled = false; // Re-enable button
                return; // Exit the function if an error occurs
            }
            let firstVisibleItem = null;
            let firstVisibleItemName = '';

            // Find the first visible item
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const rect = item.getBoundingClientRect();
                const displayRect = itemDisplay.getBoundingClientRect();

                if (rect.top >= displayRect.top && rect.bottom <= displayRect.bottom) {
                    firstVisibleItem = item;
                    firstVisibleItemName = getStandardizedItemName(firstVisibleItem);
                    break;
                }
            }

            if (firstVisibleItem) {
                let foundFirstVisible = false;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const itemName = getStandardizedItemName(item);
                    if (foundFirstVisible) {
                        if (itemName !== firstVisibleItemName) {
                            const itemTop = item.offsetTop;

                            // Check if we are at the bottom of the itemDisplay
                            const isAtBottom = itemDisplay.scrollTop + itemDisplay.clientHeight >= itemDisplay.scrollHeight - 1;

                            if (isAtBottom) {
                                console.log("Reached the bottom, stopping scroll.");
                                isScrolling = false; // Reset scrolling state
                                jumpDownButton.disabled = false; // Re-enable button
                                return; // Exit if at the bottom
                            }

                            if (smoothScroll) {
                                // Use smoothScrollTo for smooth scrolling
                                await smoothScrollTo(itemDisplay, itemTop); // Await the smooth scroll
                                isScrolling = false; // Reset scrolling state after completion
                                jumpDownButton.disabled = false; // Re-enable button
                            } else {
                                itemDisplay.scrollTop = itemTop; // Set scroll position directly
                                isScrolling = false; // Reset scrolling state
                                jumpDownButton.disabled = false; // Re-enable button
                            }
                            break;
                        }
                    }

                    if (item === firstVisibleItem) {
                        foundFirstVisible = true;
                    }
                }
            } else {
                console.log('No items currently visible to jump down from.');
                isScrolling = false; // Reset scrolling state if no items are found
                jumpDownButton.disabled = false; // Re-enable button
            }
            isScrolling = false; // Reset scrolling state if no items are found
            jumpDownButton.disabled = false; // Re-enable button
        }

        // Function to jump up to the next item above with a different name
        async function jumpUp() {
            if (isScrolling) return;
            isScrolling = true;
            jumpUpButton.disabled = true; // Disable button
            // Animate button if enabled
            animateButton(jumpUpButton);
            const itemDisplay = document.getElementById('itemDisplay');
            //const items = itemDisplay.children;
            let items;
            try {
                items = itemDisplay.children;
            } catch (error) {
                console.error('An error occurred while accessing itemDisplay.children:', error);
                isScrolling = false;
                jumpUpButton.disabled = false; // Disable button
                return; // Exit the function if an error occurs
            }
            let firstVisibleItem = null;
            let firstVisibleItemName = '';

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const rect = item.getBoundingClientRect();
                const displayRect = itemDisplay.getBoundingClientRect();

                if (rect.top >= displayRect.top && rect.bottom <= displayRect.bottom) {
                    firstVisibleItem = item;
                    firstVisibleItemName = getStandardizedItemName(firstVisibleItem);
                    break;
                }
            }

            if (firstVisibleItem) {
                for (let i = Array.from(items).indexOf(firstVisibleItem) - 1; i >= 0; i--) {
                    const item = items[i];
                    const itemName = getStandardizedItemName(item);

                    if (itemName !== firstVisibleItemName) {
                        let foundIndex = -1;
                        for (let j = 0; j < items.length; j++) {
                            if (getStandardizedItemName(items[j]) === itemName) {
                                foundIndex = j;
                                break;
                            }
                        }
                        if (foundIndex !== -1) {
                            const targetTop = items[foundIndex].offsetTop;
                            if (smoothScroll) {
                                await smoothScrollTo(itemDisplay, targetTop);
                            }else{
                                const itemTop = items[foundIndex].offsetTop; // Get the top position of the item
                                itemDisplay.scrollTop = itemTop; // Set the scroll position directly
                            }
                            isScrolling = false;
                            jumpUpButton.disabled = false; // Disable button
                            return;
                        }
                        //return;
                    }
                    if (Array.from(items).indexOf(item) === 0) {
                        if (smoothScroll) {
                            await smoothScrollTo(itemDisplay, items[0]);
                        }else{
                            const itemTop = items[0].offsetTop; // Get the top position of the item
                            itemDisplay.scrollTop = itemTop; // Set the scroll position directly
                        }
                        isScrolling = false;
                        jumpUpButton.disabled = false; // Disable button
                        return;
                    }
                }
            } else {
                console.log('No items currently visible to jump up from.');
            }
            isScrolling = false;
            jumpUpButton.disabled = false; // Disable button
        }
        // button event listeners
        jumpDownButton.addEventListener('click', jumpDown);
        jumpUpButton.addEventListener('click', jumpUp);
    }
    //AddButtons();

    /*
     * Part of the Code below of this script is derived from the "Dead Frontier - Fast Services" script by Shrike00
     * Original source: https://update.greasyfork.org/scripts/472536/Dead%20Frontier%20-%20Fast%20Services.user.js
     * Copyright (c) Shrike00
     * Licensed under the MIT License.
     */
    // Initial button creation and observer setup
    function waitForItemDisplay(callback, timeout) {
        const start = performance.now();
        const check = setInterval(function() {
            if (document.getElementById("itemDisplay") !== null) {
                clearInterval(check);
                callback();
            } else if (performance.now() - start > timeout) {
                clearInterval(check);
            }
        }, 100);
    }
    function Start() {
        waitForItemDisplay(function() {
            // Initial addition of button.
            Main();
            // Mutation observer to check for changes to the marketplace child nodes, re-adding the event listener
            // whenever the selectMarket element is re-added (which happens when the market tab is changed).
            const callback = function(mutationList, observer) {
                for (const record of mutationList) {
                    const element = record.addedNodes[0];
                    if (element !== undefined && element.id === "selectMarket") {
                        //createSortButton();
                        checkAndCreateSortButton();
                    }
                }
            }
            const observer = new MutationObserver(callback);
            const marketplace = document.getElementById("marketplace");
            observer.observe(marketplace, {childList: true});
        }, 5000);
    }
    function removeButtons() {
        const logButton = document.getElementById('logButton');
        const jumpDownButton = document.getElementById('jumpDownButton');
        const jumpUpButton = document.getElementById('jumpUpButton');

        if (logButton) {
            logButton.remove(); // Remove the log button
        }
        if (jumpDownButton) {
            jumpDownButton.remove(); // Remove the jump down button
        }
        if (jumpUpButton) {
            jumpUpButton.remove(); // Remove the jump up button
        }
    }
    function checkAndCreateSortButton() {
        const pageLogo = document.getElementById("pageLogo");
        const marketType = pageLogo ? pageLogo.getAttribute("data-market-type") : null;
        const innerText = pageLogo ? pageLogo.innerText.trim() : "";
        //console.log(innerText);
        //console.log(marketType);

        if (marketType === "buy" || innerText === "ITEM-FOR-ITEM") {
            //console.log("added buttons");
            Main();
        } else {//if not buy or item for item section of marketplace then remove buttons.
            //console.log("Removing buttons");
            removeButtons(); // Call the function to remove buttons
        }
    }
    Start();
})();