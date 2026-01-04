// ==UserScript==
// @name         Quick-jump to any input field by typing to search
// @namespace    http://tampermonkey.net/
// @version      2.3
// @license MIT
// @description  Jump to any input field/textarea/select/contenteditable by typing part of its placeholder/label/name/value/selected option. Use Enter to focus, Tab/Shift+Tab to cycle. Searches label text, input values, and dropdown selections.
// @author       Ophir Han
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554154/Quick-jump%20to%20any%20input%20field%20by%20typing%20to%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/554154/Quick-jump%20to%20any%20input%20field%20by%20typing%20to%20search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false; // Set to false to disable logging
    const log = (...args) => DEBUG && console.log('[JumpToInput]', ...args);

    let inputBox, counterDisplay, matchedInputs = [], selectedIndex = 0;
    let searchBoxActive = false;
    let autoFocusTimer = null;
    let scrollTimer = null;
    let userHasInteracted = false; // Track if user has cycled through matches

    // Listen for the hotkey: Ctrl + Shift + F
    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === "F") {
            log('Hotkey detected: Ctrl+Shift+F');
            event.preventDefault();
            event.stopPropagation();
            openSearchBox();
        }
    });

    function openSearchBox() {
        log('openSearchBox() called');
        
        if (searchBoxActive) {
            log('Search box already active, ignoring');
            return;
        }

        searchBoxActive = true;
        log('Setting searchBoxActive = true');

        // Create the floating search box container
        const container = document.createElement("div");
        container.id = "floatingSearchBoxContainer";
        container.style.position = "fixed";
        container.style.top = "10px";
        container.style.left = "50%";
        container.style.transform = "translateX(-50%)";
        container.style.zIndex = "9999";
        container.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        container.style.border = "2px solid blue";
        container.style.borderRadius = "5px";
        container.style.padding = "8px";
        container.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        container.style.minWidth = "320px";
        container.style.maxWidth = "400px";

        // Create the input field
        inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.placeholder = "Type to search...";
        inputBox.style.width = "100%";
        inputBox.style.padding = "5px";
        inputBox.style.border = "1px solid #ccc";
        inputBox.style.borderRadius = "3px";
        inputBox.style.outline = "none";
        inputBox.style.fontSize = "14px";
        inputBox.style.color = "black";
        inputBox.style.backgroundColor = "white";
        inputBox.id = "floatingSearchBox";

        // Create counter display
        counterDisplay = document.createElement("div");
        counterDisplay.style.marginTop = "5px";
        counterDisplay.style.fontSize = "12px";
        counterDisplay.style.color = "#666";
        counterDisplay.style.textAlign = "center";
        counterDisplay.textContent = "Press Ctrl+Shift+F to search";

        container.appendChild(inputBox);
        container.appendChild(counterDisplay);
        document.body.appendChild(container);
        
        log('Search box appended to DOM');

        // Use setTimeout to delay focus and event attachment to avoid immediate closure
        setTimeout(() => {
            log('Focusing input box and attaching events');
            inputBox.focus();
            
            inputBox.addEventListener("input", highlightMatches);
            inputBox.addEventListener("keydown", handleKeyPress);

            // Delay the outside click handler to prevent immediate closure
            setTimeout(() => {
                log('Attaching outsideClickHandler');
                document.addEventListener("click", outsideClickHandler, true);
            }, 100);

            // Immediately call highlightMatches() so that even an empty search will match all inputs
            highlightMatches();
        }, 50);
    }

    function highlightMatches() {
        const searchText = inputBox.value.toLowerCase();
        log('highlightMatches() called with search text:', searchText);
        
        // Clear any previous auto-focus timer
        if (autoFocusTimer) {
            clearTimeout(autoFocusTimer);
            autoFocusTimer = null;
        }
        
        // Clear any previous highlights
        matchedInputs.forEach(input => input.style.outline = "none");
        matchedInputs = [];
        selectedIndex = 0;

        // Get all searchable elements (excluding our floating search box)
        const elements = getAllSearchableElements();
        log('Found', elements.length, 'searchable elements');

        // If no text is entered, match all elements; otherwise filter by search text
        if (searchText.trim() === "") {
            matchedInputs = elements;
        } else {
            matchedInputs = elements.filter(element => {
                const searchableText = getSearchableText(element).toLowerCase();
                return searchableText.includes(searchText);
            });
        }

        log('Matched', matchedInputs.length, 'elements');

        if (matchedInputs.length > 0) {
            updateHighlight(false); // false = don't scroll yet
            updateCounter();

            // If there's only one match, wait for user to stop typing before auto-focusing
            if (matchedInputs.length === 1) {
                log('Only one match, waiting for user to stop typing...');
                autoFocusTimer = setTimeout(() => {
                    if (searchBoxActive && matchedInputs.length === 1) {
                        log('User stopped typing, auto-focusing now');
                        focusSelectedInput();
                        removeSearchBox();
                    }
                }, 800); // Wait 800ms after last keystroke
            }
        } else {
            updateCounter();
        }
    }

    function getAllSearchableElements() {
        const selectors = [
            'input[placeholder]',
            'input[aria-label]',
            'input[name]',
            'input[id]',
            'textarea',
            'select',
            '[contenteditable="true"]',
            '[contenteditable=""]'
        ];

        const allElements = [];
        const seen = new Set();

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Skip our own search box
                if (el.id === 'floatingSearchBox' || el.closest('#floatingSearchBoxContainer')) {
                    return;
                }
                // Avoid duplicates
                if (!seen.has(el)) {
                    seen.add(el);
                    allElements.push(el);
                }
            });
        });

        return allElements;
    }

    function getSearchableText(element) {
        // Gather all searchable text from various attributes
        const texts = [];
        
        // Standard attributes
        if (element.placeholder) texts.push(element.placeholder);
        if (element.getAttribute('aria-label')) texts.push(element.getAttribute('aria-label'));
        if (element.name) texts.push(element.name);
        if (element.id) texts.push(element.id);
        if (element.title) texts.push(element.title);
        
        // Current value of the input (if it has content)
        if (element.value && element.value.trim() !== '') {
            texts.push(element.value);
        }
        
        // For SELECT elements, include the currently selected option's text
        if (element.tagName === 'SELECT') {
            const selectedOption = element.options[element.selectedIndex];
            if (selectedOption && selectedOption.text && selectedOption.text.trim() !== '') {
                texts.push(selectedOption.text);
                log('Select element', element.id || element.name || 'unnamed', 'has selected value:', selectedOption.text);
            }
        }
        
        // Look for associated label elements
        const labelText = findLabelText(element);
        if (labelText) texts.push(labelText);
        
        // For contenteditable, use a generic identifier
        if (element.getAttribute('contenteditable') !== null) {
            texts.push('contenteditable');
            // Try to get nearby label or context
            const nearbyText = getNearbyText(element);
            if (nearbyText) texts.push(nearbyText);
        }

        return texts.join(' ');
    }

    function findLabelText(element) {
        // Strategy 1: Look for label with matching 'for' attribute
        if (element.id) {
            const label = document.querySelector(`label[for="${element.id}"]`);
            if (label) {
                return label.textContent.trim();
            }
        }
        
        // Strategy 2: Look for label in parent/ancestor elements
        // Check up to 3 levels up for a label
        let currentNode = element.parentElement;
        let levelsToCheck = 3;
        
        while (currentNode && levelsToCheck > 0) {
            // Check if this parent contains a label
            const label = currentNode.querySelector('label');
            if (label) {
                return label.textContent.trim();
            }
            
            // Check if the parent itself is a label
            if (currentNode.tagName === 'LABEL') {
                return currentNode.textContent.trim();
            }
            
            currentNode = currentNode.parentElement;
            levelsToCheck--;
        }
        
        // Strategy 3: Look for nearby text in adjacent elements
        // Check previous sibling for labels or text
        if (element.previousElementSibling) {
            const prevLabel = element.previousElementSibling.querySelector('label');
            if (prevLabel) {
                return prevLabel.textContent.trim();
            }
            if (element.previousElementSibling.tagName === 'LABEL') {
                return element.previousElementSibling.textContent.trim();
            }
        }
        
        return null;
    }

    function getNearbyText(element) {
        // Try to find a label or nearby text for context
        const parent = element.parentElement;
        if (!parent) return '';
        
        const label = parent.querySelector('label');
        if (label) return label.textContent.trim();
        
        // Get first 50 chars of parent's text content
        return parent.textContent.trim().substring(0, 50);
    }

    function updateHighlight(shouldScroll = true) {
        log('updateHighlight() called, selectedIndex:', selectedIndex, 'shouldScroll:', shouldScroll);
        
        // Highlight all matched inputs
        matchedInputs.forEach((element, index) => {
            element.style.outline = (index === selectedIndex)
                ? "3px solid green" // selected
                : "2px solid red"; // not selected
            element.dataset.index = index;
        });

        // Only scroll if explicitly requested (Tab cycling or after debounce)
        if (shouldScroll && matchedInputs[selectedIndex]) {
            scrollIntoViewIfNeeded(matchedInputs[selectedIndex]);
        }

        // Check if the floating search box overlaps any matched element
        const container = document.getElementById('floatingSearchBoxContainer');
        if (!container) return;

        let boxRect = container.getBoundingClientRect();
        let newTop = null;
        
        matchedInputs.forEach(element => {
            let rect = element.getBoundingClientRect();
            // If there is any overlap, note the element's bottom
            if (boxRect.left < rect.right && boxRect.right > rect.left &&
                boxRect.top < rect.bottom && boxRect.bottom > rect.top) {
                let candidate = rect.bottom + 5; // 5px gap
                if (newTop === null || candidate > newTop) {
                    newTop = candidate;
                }
            }
        });
        
        if (newTop !== null) {
            container.style.top = newTop + "px";
            log('Repositioned search box to avoid overlap, new top:', newTop);
        }
    }

    function scrollIntoViewIfNeeded(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );

        if (!isVisible) {
            log('Scrolling element into view');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function updateCounter() {
        if (matchedInputs.length === 0) {
            counterDisplay.textContent = "No matches found";
            counterDisplay.style.color = "#999";
        } else {
            counterDisplay.textContent = `Match ${selectedIndex + 1} of ${matchedInputs.length} (Tab/Shift+Tab to cycle, Enter to focus)`;
            counterDisplay.style.color = "#666";
        }
    }

    function handleKeyPress(event) {
        log('Key pressed:', event.key);
        
        if (event.key === "Tab") {
            event.preventDefault();
            userHasInteracted = true; // User is explicitly cycling
            if (event.shiftKey) {
                // Cycle backwards
                selectedIndex = (selectedIndex - 1 + matchedInputs.length) % matchedInputs.length;
                log('Cycling backwards to index:', selectedIndex);
            } else {
                // Cycle forwards
                selectedIndex = (selectedIndex + 1) % matchedInputs.length;
                log('Cycling forwards to index:', selectedIndex);
            }
            updateHighlight(true); // true = scroll because user is actively cycling
            updateCounter();
        } else if (event.key === "Enter") {
            // Use Enter to focus on the selected input
            event.preventDefault();
            log('Enter pressed, focusing selected input');
            focusSelectedInput();
            removeSearchBox();
        } else if (event.key === "Escape") {
            log('Escape pressed, closing search box');
            removeSearchBox();
        } else {
            // User is typing - clear previous scroll timer and set new one
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            // Only scroll after user stops typing for 600ms
            scrollTimer = setTimeout(() => {
                if (matchedInputs.length > 0) {
                    log('User stopped typing, scrolling to current match');
                    scrollIntoViewIfNeeded(matchedInputs[selectedIndex]);
                }
            }, 600);
        }
    }

    function focusSelectedInput() {
        if (matchedInputs.length > 0) {
            const selectedElement = matchedInputs[selectedIndex];
            log('Focusing element:', selectedElement.tagName, selectedElement.id || selectedElement.name);
            selectedElement.focus();
            
            // Keep green outline for 2 seconds for visibility
            selectedElement.style.outline = "3px solid green";
            setTimeout(() => {
                if (document.activeElement === selectedElement) {
                    selectedElement.style.outline = "2px solid green";
                    setTimeout(() => {
                        selectedElement.style.outline = "";
                    }, 1500);
                }
            }, 500);
        }
    }

    function removeSearchBox() {
        log('removeSearchBox() called');
        
        if (!searchBoxActive) {
            log('Search box not active, ignoring');
            return;
        }

        // Clear any pending timers
        if (autoFocusTimer) {
            clearTimeout(autoFocusTimer);
            autoFocusTimer = null;
        }
        if (scrollTimer) {
            clearTimeout(scrollTimer);
            scrollTimer = null;
        }

        const container = document.getElementById('floatingSearchBoxContainer');
        if (container) {
            container.remove();
            log('Container removed from DOM');
        }
        
        matchedInputs.forEach(element => element.style.outline = "none");
        matchedInputs = [];
        userHasInteracted = false;
        
        document.removeEventListener("click", outsideClickHandler, true);
        log('Click handler removed');
        
        searchBoxActive = false;
        log('Setting searchBoxActive = false');
    }

    function outsideClickHandler(event) {
        log('Click detected, target:', event.target.tagName, event.target.id);
        
        const container = document.getElementById('floatingSearchBoxContainer');
        if (container && !container.contains(event.target)) {
            log('Click outside search box, closing');
            removeSearchBox();
        } else {
            log('Click inside search box, keeping open');
        }
    }

    log('Script loaded and ready. Press Ctrl+Shift+F to activate.');
})();
