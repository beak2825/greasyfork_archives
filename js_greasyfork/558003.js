// ==UserScript==
// @name         Neopets Inventory Price Injector
// @namespace   http://tampermonkey.net/
// @version      1.1.0
// @description Injects ItemDB Market Price, Restock Range, and Item Effects into the item details pop-up on the Neopets Inventory page. Also attempts to help remove ads from inventory.
// @author       Logan Bell
// @match        https://www.neopets.com/inventory.phtml
// @connect      itemdb.com.br
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558003/Neopets%20Inventory%20Price%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/558003/Neopets%20Inventory%20Price%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const ITEMDB_BASE_URL = "https://itemdb.com.br/item/";
    // Element IDs/Classes to remove
    const ELEMENT_TO_REMOVE_ID = 'celtra-object-3051';
    // Array of classes to remove for ad-blocking
    const ELEMENTS_TO_REMOVE_CLASSES = [
        'nl-ad-top-content',
        'nl-ad-bottom'
    ];
    // New: URL for Quick Stock link modification
    const QUICKSTOCK_NEW_URL = '/quickstock.phtml?r=';


    // --- GUI: Status Box for Debugging ---
    const statusBox = document.createElement('div');
    statusBox.id = 'gemini-status-box';
    statusBox.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; padding: 6px 10px;
        background: #e0f7fa; border: 1px solid #b2ebf2; z-index: 9999;
        font-size: 11px; font-weight: bold; border-radius: 4px; color: #006064;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    statusBox.innerText = 'NeoScanner waiting to help...';
    document.body.appendChild(statusBox);
    console.log("ItemDB Injector V1.16: Script started.");

    // --- Helper Functions ---

    function updateStatus(text, color = '#006064', background = '#e0f7fa') {
        statusBox.innerText = text;
        statusBox.style.color = color;
        statusBox.style.background = background;
    }

    /** Creates a URL slug from the item name for ItemDB. */
    function createSlug(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    /** Extracts all necessary data from the ItemDB HTML response. */
    function extractPricesAndEffectsFromHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let marketPrice = null;
        let restockMin = null;
        let restockMax = null;
        let restockShopLink = null;
        let itemEffectsText = null;

        // Market Price Extraction
        const marketPriceElement = doc.querySelector('.css-1kdqswr .chakra-stat__number');
        if (marketPriceElement) {
            const priceText = marketPriceElement.textContent.replace(/[^\d]/g, '');
            marketPrice = parseInt(priceText, 10) || null;
        }

        // --- Restock Price Range Extraction ---
        const statTitles = doc.querySelectorAll('.css-ztobn h3');
        let restockPriceElement = null;

        for (const title of statTitles) {
            if (title.textContent.trim() === 'Restock Price') {
                const priceContainer = title.nextElementSibling;
                if (priceContainer) {
                    restockPriceElement = priceContainer.querySelector('p:nth-child(2)');
                    break;
                }
            }
        }

        if (restockPriceElement) {
            const rangeText = restockPriceElement.textContent;
            const parts = rangeText.match(/(\d[\d,]*)\s*NP\s*-\s*(\d[\d,]*)\s*NP/);
            if (parts && parts.length === 3) {
                restockMin = parseInt(parts[1].replace(/,/g, ''), 10) || null;
                restockMax = parseInt(parts[2].replace(/,/g, ''), 10) || null;
            }
        }

        // --- Restock Shop Link Extraction ---
        const findAtContainer = doc.querySelector('.css-172f9ra .css-1a9obp4');

        if (findAtContainer) {
            const restockLinkElement = findAtContainer.querySelector('a[href*="objects.phtml?type=shop"]');

            if (restockLinkElement) {
                restockShopLink = restockLinkElement.href;
            }
        }

        // --- Item Effects Extraction and Cleaning ---
        let itemEffectsTitle = null;
        for (const title of statTitles) {
            if (title.textContent.trim() === 'Item Effects') {
                itemEffectsTitle = title;
                break;
            }
        }

        if (itemEffectsTitle) {
            const effectContainer = itemEffectsTitle.nextElementSibling;
            if (effectContainer) {
                // To get the complete, clean text, we clone the node and remove images/unwanted elements
                const clone = effectContainer.cloneNode(true);

                // Replace complex elements like pet images and links with their text content
                clone.querySelectorAll('img, a').forEach(el => {
                    const boldText = el.querySelector('b');
                    if (boldText) {
                        // Replace pet image/container with bold text (e.g., "Pteri")
                        el.replaceWith(document.createTextNode(boldText.textContent));
                    } else if (el.tagName === 'A') {
                        // For links, replace with text content, removing any icon placeholders
                        el.replaceWith(document.createTextNode(el.textContent.replace(/link icon|Shop/gi, '').trim()));
                    } else {
                        // Remove other images (like the "Cure" icon)
                        el.remove();
                    }
                });

                // Get the raw text of the entire clean container
                let fullDescription = clone.textContent.trim();

                // Get the main effect name (e.g., "Cure") for later control
                const effectNameElement = clone.querySelector('.chakra-text.css-lhluam');
                const name = effectNameElement ? effectNameElement.textContent.trim() : 'Cure';


                // --- CRITICAL NEW STEP: Aggressive CSS Selector and Rule Cleanup ---

                // 1. Target anything that looks like a CSS selector followed by curly braces {...}
                const cssRuleCleanupRegex = /([\.#\:\w-]+)?\{[^{}]*\}|(\.css-[a-zA-Z0-9]+)/g;
                itemEffectsText = fullDescription.replace(cssRuleCleanupRegex, '').trim();

                // 2. Clean up any remaining common pseudo-classes/attributes or loose characters
                const orphanedSelectorRegex = /(:hover|\[data-hover\]|:focus-visible|\[data-focus-visible\]|b|strong|,)/g;
                itemEffectsText = itemEffectsText.replace(orphanedSelectorRegex, '').trim();

                // 3. Remove the Effect Name (like 'Cure') from the beginning of the description if it's there
                itemEffectsText = itemEffectsText.replace(new RegExp(`^${name}`, 'i'), '').trim();

                // 4. Final cleaning and spacing normalization
                itemEffectsText = itemEffectsText
                    .replace(/\s{2,}/g, ' ')  // Replace multiple spaces with a single space
                    .trim();

                // 5. Fallback/Final Check: Ensure the "This item cures..." starting text is present
                const desiredStart = "This item cures";
                if (!itemEffectsText.startsWith(desiredStart) && itemEffectsText) {
                    // Attempt to find the descriptive phrase in the original full description
                    const descriptiveMatch = fullDescription.match(/(This item cures.*?Pteri)/i);
                    if (descriptiveMatch) {
                        itemEffectsText = descriptiveMatch[1].replace(/\s{2,}/g, ' ').trim();
                        // Re-run the aggressive CSS cleanup on just this phrase just in case
                        itemEffectsText = itemEffectsText.replace(cssRuleCleanupRegex, '').replace(orphanedSelectorRegex, '').replace(/\s{2,}/g, ' ').trim();
                    }
                }

                // If the result is still empty or is a generic fallback, set to null so the line is skipped
                if (!itemEffectsText || itemEffectsText === 'N/A' || itemEffectsText === 'None/N/A') {
                    itemEffectsText = null;
                }
            }
        }


        return { marketPrice, restockMin, restockMax, restockShopLink, itemEffectsText };
    }

    /**
     * Injects the market and restock data into the item details pop-up table.
     */
    function injectDataIntoPopup(itemDBLink, marketPrice, restockMin, restockMax, restockShopLink, itemEffectsText) {
        const grid = document.querySelector('.inv-itemStat-grid');

        if (!grid) {
            console.error('Could not find .inv-itemStat-grid to inject data.');
            return;
        }

        // Remove old injected prices to prevent duplicates
        grid.querySelectorAll('.injected-stat').forEach(el => el.remove());
        grid.querySelectorAll('.injected-link').forEach(el => el.remove());


        // Helper to create a linked title
        function createLinkedTitle(text, customLink = itemDBLink) {
            const link = document.createElement('a');
            link.href = customLink;
            link.target = '_blank';
            link.className = 'inv-itemStat injected-link';
            // Custom styling for plain black text without underline
            link.style.cssText = 'color: #000000; text-decoration: none; font-weight: bold;';
            link.textContent = text;
            return link;
        }

        // --- 1. Market Price Link and Value Injection ---
        const marketPriceLink = createLinkedTitle('Market Price', itemDBLink);
        grid.appendChild(marketPriceLink);

        const marketPriceSpan = document.createElement('span');
        marketPriceSpan.className = 'inv-itemStat-num injected-stat';
        if (marketPrice !== null) {
             marketPriceSpan.textContent = marketPrice.toLocaleString('en-US') + ' NP';
             marketPriceSpan.title = 'Source: itemdb.com.br';
             marketPriceSpan.style.color = '#388e3c'; // Green color
        } else {
             marketPriceSpan.textContent = 'N/A';
             marketPriceSpan.style.color = '#d32f2f'; // Red for error/not found
        }
        grid.appendChild(marketPriceSpan);


        // --- 2. Restock Range Link and Value Injection ---
        const finalRestockLink = restockShopLink || itemDBLink;

        const restockLink = createLinkedTitle('Restock Range', finalRestockLink);
        grid.appendChild(restockLink);

        const restockSpan = document.createElement('span');
        restockSpan.className = 'inv-itemStat-num injected-stat';
        if (restockMin !== null && restockMax !== null) {
             restockSpan.textContent = `${restockMin.toLocaleString('en-US')} - ${restockMax.toLocaleString('en-US')} NP`;
             restockSpan.title = `Source: itemdb.com.br. Link to Neopets shop.`;
             restockSpan.style.color = '#1976d2'; // Blue color
        } else {
             restockSpan.textContent = 'N/A';
             restockSpan.style.color = '#d32f2f'; // Red for error/not found
        }
        grid.appendChild(restockSpan);

        // --- 3. Item Effects Link and Value Injection ---
        // ONLY inject the effects line if the text is successfully extracted.
        if (itemEffectsText) {
            const effectsLink = createLinkedTitle('Item Effects', itemDBLink);
            grid.appendChild(effectsLink);

            const effectsSpan = document.createElement('span');
            effectsSpan.className = 'inv-itemStat-num injected-stat';
            // Use the extracted and cleaned text for the content
            effectsSpan.textContent = itemEffectsText;
            effectsSpan.title = 'Source: itemdb.com.br';
            // Styled to be smaller, center-aligned, black text
            effectsSpan.style.cssText = 'font-size: 10px; line-height: 1.2; text-align: center; color: #000000;';

            grid.appendChild(effectsSpan);
        }


        updateStatus("NeoScanner priced successfully!", 'green', '#d4edda');
        setTimeout(() => statusBox.remove(), 5000);
    }

    /**
     * The main processing function triggered when the item pop-up is shown.
     */
    function checkAndInjectPrice() {
        // 1. Get the item name from the pop-up header
        const itemNameElement = document.getElementById('invItemName');
        if (!itemNameElement) {
            console.log('Pop-up is open, but item name element not found.');
            return;
        }

        const itemName = itemNameElement.textContent.trim();
        if (!itemName) {
            updateStatus("ItemDB Injector: Item name not found in pop-up.", 'red', '#f8d7da');
            return;
        }

        updateStatus(`ItemDB Injector: Checking price for "${itemName}"...`);

        const itemSlug = createSlug(itemName);
        const itemDBLink = ITEMDB_BASE_URL + itemSlug;

        // 2. Fetch ItemDB Data
        GM_xmlhttpRequest({
            method: "GET",
            url: itemDBLink,
            onload: function(response) {
                if (response.status !== 200) {
                    console.error(`ItemDB lookup failed for ${itemName}: ${response.statusText}`);
                    updateStatus(`ItemDB Injector: Price check failed (${response.status})`, 'red', '#f8d7da');
                    injectDataIntoPopup(itemDBLink, null, null, null, null, null);
                    return;
                }

                const { marketPrice, restockMin, restockMax, restockShopLink, itemEffectsText } = extractPricesAndEffectsFromHTML(response.responseText);

                // 3. Inject results into the pop-up
                injectDataIntoPopup(itemDBLink, marketPrice, restockMin, restockMax, restockShopLink, itemEffectsText);
                console.log(`✅ Injected data for "${itemName}" - Market: ${marketPrice}, Restock: ${restockMin}-${restockMax}, Effects: ${itemEffectsText || 'N/A'}`);
            },
            onerror: function(err) {
                console.error(`Request Failed for ${itemName}:`, err);
                updateStatus("ItemDB Injector: Network request failed.", 'red', '#f8d7da');
                injectDataIntoPopup(itemDBLink, null, null, null, null, null);
            }
        });
    }

    // 🚀 --- Page Modification Logic ---

    // 1. Remove element by ID (celtra)
    const elementToRemoveById = document.getElementById(ELEMENT_TO_REMOVE_ID);
    if (elementToRemoveById) {
        elementToRemoveById.remove();
        console.log(`🗑️ Successfully removed element with ID: ${ELEMENT_TO_REMOVE_ID}`);
    } else {
        console.log(`Element with ID: ${ELEMENT_TO_REMOVE_ID} not found, skipping removal.`);
    }

    // 2. Remove elements by Class (ad wrappers)
    ELEMENTS_TO_REMOVE_CLASSES.forEach(className => {
        const elementToRemoveByClass = document.querySelector(`.${className}`);
        if (elementToRemoveByClass) {
            elementToRemoveByClass.remove();
            console.log(`🗑️ Successfully removed element with Class: ${className}`);
        } else {
            console.log(`Element with Class: ${className} not found, skipping removal.`);
        }
    });

    // 3. Update Quick Stock Link (NEW)
    // Find the 'a' tag whose href is exactly '/quickstock.phtml'
    const quickStockLink = document.querySelector('a[href="/quickstock.phtml"]');
    if (quickStockLink) {
        quickStockLink.href = QUICKSTOCK_NEW_URL;
        console.log(`🔗 Successfully updated Quick Stock link to: ${QUICKSTOCK_NEW_URL}`);
    } else {
        console.log('Quick Stock link not found, skipping update.');
    }
    // -----------------------------------


    // --- Observer Setup (Main Logic for Inventory) ---

    // The item pop-up element
    const popup = document.getElementById('invDesc');

    if (!popup) {
        updateStatus("ItemDB Injector: Item pop-up element not found. Script may fail.", 'red', '#f8d7da');
        console.error('The item pop-up element #invDesc was not found.');
        return;
    }

    // Create a MutationObserver to watch for changes to the pop-up's style (when it becomes visible)
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const currentDisplay = window.getComputedStyle(popup).display;
                if (currentDisplay === 'block') {
                    // Pop-up has just been opened/shown
                    checkAndInjectPrice();
                }
            }
        }
    });

    // Start observing the target node for changes in attributes (specifically 'style')
    observer.observe(popup, { attributes: true, attributeFilter: ['style'] });

    // Initial check in case the pop-up is already visible on script load (unlikely, but safe)
    if (window.getComputedStyle(popup).display === 'block') {
        checkAndInjectPrice();
    }

})();