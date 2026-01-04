// ==UserScript==
// @name Glitchey: Bazaar Buy Helper
// @namespace MarketBazaarBuy
// @version 1.9
// @description Extract product names from Torn.com item market pages and save to localStorage
// @author Glitchey
// @match https://www.torn.com/page.php?sid=ItemMarket*
// @match https://www.torn.com/bazaar.php*
// @exclude https://www.torn.com/page.php?sid=ItemMarket#/addListing*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/552314/Glitchey%3A%20Bazaar%20Buy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/552314/Glitchey%3A%20Bazaar%20Buy%20Helper.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to extract product name from the bazaar info header
    function extractProductName() {
        const headerElement = document.querySelector('.bazaar-info-header');
 
        if (headerElement) {
            const headerText = headerElement.textContent;
            // Extract text between "Bazaar Listings for " and " (ID:"
            const match = headerText.match(/Bazaar Listings for (.+?) \(ID:/);
 
            if (match && match[1]) {
                const productName = match[1].trim();
                console.log('Product name extracted from header:', productName);
                return productName;
            }
        }
        return null;
    }
 
    // Function to extract product name from button aria-label
    function extractProductNameFromButton(button) {
        const ariaLabel = button.getAttribute('aria-label');
        if (ariaLabel) {
            // Extract text between "Buy item " and ", $"
            // Example: "Buy item Box of Tissues, $560, 112857 in total"
            const match = ariaLabel.match(/Buy item (.+?), \$/);
 
            if (match && match[1]) {
                const productName = match[1].trim();
                console.log('Product name extracted from button:', productName);
 
                // Save to localStorage
                saveProductName(productName);
                return productName;
            }
        }
        return null;
    }
 
    // Function to save product name to localStorage
    function saveProductName(productName) {
        try {
            // Save the single product name, overwriting any previous one
            localStorage.setItem('tornProductName', productName);
            console.log('Product name saved to localStorage:', productName);
 
            // Optional: Show a brief notification
            showNotification(`Product "${productName}" saved!`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
 
    // Function to save quantity to localStorage
    function saveQuantity(quantity) {
        try {
            // Save the quantity, overwriting any previous one
            localStorage.setItem('tornQuantity', quantity);
            console.log('Quantity saved to localStorage:', quantity);
 
            // Optional: Show a brief notification
            showNotification(`Quantity "${quantity}" saved!`);
        } catch (error) {
            console.error('Error saving quantity to localStorage:', error);
        }
    }
 
    // Function to show a brief notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
 
        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
 
    // Function to get the saved product name (utility function)
    function getSavedProduct() {
        try {
            return localStorage.getItem('tornProductName') || null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }
 
    // Function to get the saved quantity (utility function)
    function getSavedQuantity() {
        try {
            return localStorage.getItem('tornQuantity') || null;
        } catch (error) {
            console.error('Error reading quantity from localStorage:', error);
            return null;
        }
    }
 
    // Function to clear the saved product name (utility function)
    function clearSavedProduct() {
        localStorage.removeItem('tornProductName');
        console.log('Saved product name cleared');
    }
 
    // Function to clear the saved quantity (utility function)
    function clearSavedQuantity() {
        localStorage.removeItem('tornQuantity');
        console.log('Saved quantity cleared');
    }
 
 
    // Function to add click listeners to all "Buy Item" buttons
    function addButtonListeners() {
        const buyButtons = document.querySelectorAll('button.actionButton___pb_Da[aria-label*="Buy item"]');
 
        buyButtons.forEach(button => {
            // Check if listener already added to avoid duplicates
            if (!button.hasAttribute('data-listener-added')) {
                button.addEventListener('click', handleButtonClick);
                button.setAttribute('data-listener-added', 'true');
            }
        });
 
        if (buyButtons.length > 0) {
            console.log(`Added listeners to ${buyButtons.length} Buy Item buttons`);
        }
    }
 
    // Function to add click listeners to bazaar listing cards
    function addListingCardListeners() {
        const listingCards = document.querySelectorAll('.bazaar-listing-card[data-quantity]');
 
        listingCards.forEach(card => {
            // Check if listener already added to avoid duplicates
            if (!card.hasAttribute('data-listener-added')) {
                card.addEventListener('click', handleListingCardClick);
                card.setAttribute('data-listener-added', 'true');
            }
        });
 
        if (listingCards.length > 0) {
            console.log(`Added listeners to ${listingCards.length} bazaar listing cards`);
        }
    }
 
    // Handle button click
    function handleButtonClick(event) {
        const button = event.currentTarget;
        extractProductNameFromButton(button);
    }
 
    // Function to hide rows that don't contain the saved product name
    function hideNonMatchingRows() {
        const savedProduct = getSavedProduct();
        if (!savedProduct) {
            console.log('No saved product name to filter rows');
            return;
        }
 
        const rows = document.querySelectorAll('.row___LkdFI[data-testid="bazaar-items-row"]');
        let hiddenCount = 0;
        let visibleCount = 0;
 
        rows.forEach(row => {
            // Look for the product name in the row
            const nameElement = row.querySelector('.name___B0RW3');
            if (nameElement) {
                const productName = nameElement.textContent.trim();
 
                if (productName === savedProduct) {
                    // Show matching rows
                    row.style.display = '';
                    visibleCount++;
                    
                    // Make the buy button larger - target the correct button class
                    const buyButton = row.querySelector('button.buy___Obyz6[data-testid="buy-button"]');
                    if (buyButton) {
                        buyButton.style.fontSize = '24px';
                        console.log('Buy button font-size set to 24px');
                    }
                } else {
                    // Hide non-matching rows
                    row.style.display = 'none';
                    hiddenCount++;
                }
            }
        });
 
        console.log(`Filtered bazaar rows: ${visibleCount} visible, ${hiddenCount} hidden for product: "${savedProduct}"`);
        if (visibleCount > 0) {
            showNotification(`Showing ${visibleCount} listings for "${savedProduct}"`);
        } else {
            showNotification(`No listings found for "${savedProduct}"`);
        }
    }
 
    // Function to fill quantity input with saved quantity
    function fillQuantityInput() {
        const savedQuantity = getSavedQuantity();
        const savedProduct = getSavedProduct();
 
        if (!savedQuantity) {
            console.log('No saved quantity to fill input');
            return;
        }
 
        // Look for quantity input that matches the saved product name
        const quantityInput = document.querySelector(`input.numberInput____trXC.buyAmountInput___CSV2n[aria-label*="${savedProduct}"]`);
 
        if (quantityInput) {
            // Try to access React fiber and update state directly
            const reactKey = Object.keys(quantityInput).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'));
 
            if (reactKey) {
                try {
                    const reactInstance = quantityInput[reactKey];
                    // Try to find and update the component's state/props
                    let current = reactInstance;
                    let attempts = 0;
                    while (current && attempts < 10) {
                        if (current.stateNode && current.stateNode.setState) {
                            current.stateNode.setState({ value: savedQuantity });
                            break;
                        }
                        if (current.memoizedProps && typeof current.memoizedProps.onChange === 'function') {
                            current.memoizedProps.onChange({ target: { value: savedQuantity } });
                            break;
                        }
                        current = current.return || current._owner || current.parent;
                        attempts++;
                    }
                } catch (e) {
                    console.log('React direct manipulation failed:', e.message);
                }
            }
 
            // Set the value multiple ways to ensure it sticks
            quantityInput.value = savedQuantity;
            quantityInput.setAttribute('value', savedQuantity);
            quantityInput.defaultValue = savedQuantity;
 
            // Use Object.defineProperty to override the value getter/setter
            try {
                Object.defineProperty(quantityInput, 'value', {
                    get: function() { return savedQuantity; },
                    set: function(val) { this.setAttribute('value', val); },
                    configurable: true
                });
            } catch (e) {
                console.log('Property override failed:', e.message);
            }
 
            // Focus and trigger events
            quantityInput.focus();
            quantityInput.select();
 
            // Create a more comprehensive event simulation
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(quantityInput, savedQuantity);
 
            // Trigger React-specific events
            const reactEvent = new Event('input', { bubbles: true });
            reactEvent.simulated = true;
            quantityInput.dispatchEvent(reactEvent);
 
            const changeEvent = new Event('change', { bubbles: true });
            changeEvent.simulated = true;
            quantityInput.dispatchEvent(changeEvent);
 
            // Also trigger keyboard events to simulate typing
            const keyEvents = ['keydown', 'keypress', 'keyup'];
            keyEvents.forEach(eventType => {
                const keyEvent = new KeyboardEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    key: savedQuantity.toString(),
                    code: 'Digit' + savedQuantity.toString().slice(-1),
                    keyCode: 48 + parseInt(savedQuantity.toString().slice(-1))
                });
                quantityInput.dispatchEvent(keyEvent);
            });
 
            console.log(`Quantity input filled with: "${savedQuantity}"`);
            showNotification(`Quantity "${savedQuantity}" filled!`);
        } else {
            console.log(`Quantity input not found for product: "${savedProduct}"`);
        }
    }
 
    // Function to display saved values on page load
    function displaySavedValues() {
        const savedProduct = getSavedProduct();
        const savedQuantity = getSavedQuantity();
 
        console.log('=== TORN PRODUCT EXTRACTOR ===');
        console.log('Saved Product Name:', savedProduct || 'None');
        console.log('Saved Quantity:', savedQuantity || 'None');
        console.log('==============================');
    }
    function handleListingCardClick(event) {
        const card = event.currentTarget;
        const quantity = card.getAttribute('data-quantity');
 
        if (quantity) {
            console.log('Quantity extracted from listing card:', quantity);
            saveQuantity(quantity);
        }
    }
 
    // Function to create a clear button
    // function createClearButton() {
    //     const savedProduct = getSavedProduct();
    //     const savedQuantity = getSavedQuantity();
 
    //     // Only show button if there's something saved
    //     if (!savedProduct && !savedQuantity) {
    //         return;
    //     }
 
    //     // Check if button already exists
    //     if (document.getElementById('torn-clear-saved-button')) {
    //         return;
    //     }
 
    //     const clearButton = document.createElement('button');
    //     clearButton.id = 'torn-clear-saved-button';
    //     clearButton.textContent = '✕ Clear Saved Item';
    //     clearButton.style.cssText = `
    //         position: fixed;
    //         bottom: 20px;
    //         right: 20px;
    //         background-color: #f44336;
    //         color: white;
    //         border: none;
    //         padding: 10px 15px;
    //         border-radius: 5px;
    //         cursor: pointer;
    //         z-index: 10000;
    //         font-size: 14px;
    //         font-weight: bold;
    //         box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    //         transition: background-color 0.3s;
    //     `;
 
    //     // Hover effect
    //     clearButton.addEventListener('mouseenter', () => {
    //         clearButton.style.backgroundColor = '#d32f2f';
    //     });
    //     clearButton.addEventListener('mouseleave', () => {
    //         clearButton.style.backgroundColor = '#f44336';
    //     });
 
    //     // Click handler
    //     clearButton.addEventListener('click', () => {
    //         const product = getSavedProduct();
    //         const quantity = getSavedQuantity();
 
    //         clearSavedProduct();
    //         clearSavedQuantity();
 
    //         showNotification(`Cleared saved item: "${product || 'Unknown'}" (Qty: ${quantity || 'N/A'})`);
 
    //         // Remove the button
    //         clearButton.remove();
 
    //         // Reload the page to show all items again if on bazaar page
    //         if (window.location.href.includes('bazaar.php')) {
    //             setTimeout(() => {
    //                 location.reload();
    //             }, 1500);
    //         }
    //     });
 
    //     document.body.appendChild(clearButton);
    //     console.log('Clear button added to page');
    // }
 
    // Wait for page to load and set up listeners
    function init() {
        // Create clear button
        //createClearButton();
 
        // Always display saved values on load
        displaySavedValues();
 
        // Check if we're on a bazaar.php page
        const isBazaarPage = window.location.href.includes('bazaar.php');
 
        if (isBazaarPage) {
            // On bazaar pages, hide non-matching rows and fill quantity input
            setTimeout(() => {
                hideNonMatchingRows();
                fillQuantityInput();
            }, 1000); // Wait 1 second for page to fully load
 
            // Also try again after a longer delay in case page is still loading
            setTimeout(() => {
                hideNonMatchingRows();
                fillQuantityInput();
            }, 3000);
 
            // Set up observer to filter rows and fill quantity when new content appears
            const bazaarObserver = new MutationObserver(function(mutations) {
                let shouldFilter = false;
                let shouldCheckForQuantityInput = false;
 
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                // Check for new rows
                                if (node.matches && node.matches('.row___LkdFI[data-testid="bazaar-items-row"]')) {
                                    shouldFilter = true;
                                } else if (node.querySelector && node.querySelector('.row___LkdFI[data-testid="bazaar-items-row"]')) {
                                    shouldFilter = true;
                                }
 
                                // Check for quantity inputs
                                if (node.matches && node.matches('input.numberInput____trXC.buyAmountInput___CSV2n')) {
                                    shouldCheckForQuantityInput = true;
                                } else if (node.querySelector && node.querySelector('input.numberInput____trXC.buyAmountInput___CSV2n')) {
                                    shouldCheckForQuantityInput = true;
                                }
                            }
                        }
                    }
                });
 
                if (shouldFilter) {
                    setTimeout(() => hideNonMatchingRows(), 100);
                }
                if (shouldCheckForQuantityInput) {
                    setTimeout(() => fillQuantityInput(), 100);
                }
            });
 
            bazaarObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            // On item market pages, add listeners for extraction
            addButtonListeners();
            addListingCardListeners();
 
            // Set up observer for new elements
            const observer = new MutationObserver(function(mutations) {
                let shouldCheckForButtons = false;
                let shouldCheckForCards = false;
 
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                // Check for buttons
                                if (node.matches && node.matches('button.actionButton___pb_Da[aria-label*="Buy item"]')) {
                                    shouldCheckForButtons = true;
                                } else if (node.querySelector && node.querySelector('button.actionButton___pb_Da[aria-label*="Buy item"]')) {
                                    shouldCheckForButtons = true;
                                }
 
                                // Check for listing cards
                                if (node.matches && node.matches('.bazaar-listing-card[data-quantity]')) {
                                    shouldCheckForCards = true;
                                } else if (node.querySelector && node.querySelector('.bazaar-listing-card[data-quantity]')) {
                                    shouldCheckForCards = true;
                                }
                            }
                        }
                    }
                });
 
                if (shouldCheckForButtons) {
                    addButtonListeners();
                }
                if (shouldCheckForCards) {
                    addListingCardListeners();
                }
            });
 
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    window.tornProductExtractor = {
        getSavedProduct: getSavedProduct,
        clearSavedProduct: clearSavedProduct,
        extractProductName: extractProductName
    };
 
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
})();