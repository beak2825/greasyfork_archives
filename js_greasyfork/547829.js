// ==UserScript==
// @name         Trade Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Calculates the total value of items in a trade on Torn.com.
// @author       You
// @match        https://www.torn.com/trade.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      weav3r.lol
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547829/Trade%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/547829/Trade%20Value%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the latest receipt & URL in these global variables
    let currentReceipt = null;
    let currentReceiptURL = null;



    // Function to store trade data in localStorage (replaces chrome.storage)
    function storeTradeData(tradeID, items, receipt, receiptURL) {
        const tradeData = {
            items,
            receipt,
            receiptURL,
            timestamp: Date.now(),
            total_value: receipt.total_value,
            manual_prices: {}
        };
        localStorage.setItem(`trade_${tradeID}`, JSON.stringify(tradeData));
    }

    // Function to get stored trade data (replaces chrome.storage)
    function getStoredTradeData(tradeID) {
        return new Promise((resolve) => {
            const stored = localStorage.getItem(`trade_${tradeID}`);
            if (stored) {
                try {
                    resolve(JSON.parse(stored));
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Get the seller's name from the DOM.
     */
    function getSellerName() {
        const userElement = document.querySelector('.user.left .title-black');
        if (userElement) {
            return userElement.childNodes[0].nodeValue.trim();
        }
        return null;
    }

    // Function to automatically calculate trade value
    async function autoCalculateTrade() {
        const tradeID = getTradeID();
        if (!tradeID) return;

        // Check if we have stored data for this trade
        const storedData = await getStoredTradeData(tradeID);
        if (storedData) {
            currentReceipt = storedData.receipt;
            currentReceiptURL = storedData.receiptURL;

            if (storedData.manual_prices) {
                currentReceipt.items = currentReceipt.items.map(item => {
                    if (storedData.manual_prices[item.name]) {
                        return {
                            ...item,
                            priceUsed: storedData.manual_prices[item.name],
                            totalValue: storedData.manual_prices[item.name] * item.quantity
                        };
                    }
                    return item;
                });
                currentReceipt.total_value = currentReceipt.items.reduce((sum, item) => sum + item.totalValue, 0);
            }

            updateUIWithReceipt();
        }
        // Note: New trade calculations are now handled by the fetch interceptor
    }

    // Direct API call function using GM_xmlhttpRequest to bypass CSP
    function calculateTotalAPI(items, username, tradeID) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://weav3r.lol/api/calculateTotal',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ items, username, tradeID }),
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const data = JSON.parse(response.responseText);
                            if (data?.receipt?.total_value !== undefined && data.receiptURL) {
                                currentReceipt = data.receipt;
                                currentReceiptURL = data.receiptURL;
                                storeTradeData(tradeID, items, data.receipt, data.receiptURL);
                                updateUIWithReceipt();
                            }
                            resolve(data);
                        } else {
                            reject(new Error(`Server error: ${response.status}`));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('Error calculating total:', error);
                    reject(error);
                }
            });
        });
    }

    // Function to update UI with receipt data
    function updateUIWithReceipt() {
        const totalValueElement = document.querySelector('.total-value-container');
        const receiptURLElement = document.querySelector('.receipt-url-container');
        const valueContainer = document.querySelector('.value-container');
        const stripe = document.querySelector('.stripe-container');

        if (totalValueElement && currentReceipt?.total_value !== undefined) {
            totalValueElement.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
            totalValueElement.classList.remove('hidden');
            receiptURLElement.classList.remove('hidden');
            valueContainer.classList.add('visible');
            stripe.classList.add('expanded');

            totalValueElement.onclick = () => {
                navigator.clipboard.writeText(currentReceipt.total_value.toString());
                showCopyConfirmation(totalValueElement, 'Copied!');
            };

            receiptURLElement.onclick = showReceiptInModal;
        }
    }

    // ---------------------------
    // Fetch interceptor utilities
    // ---------------------------

    // Keep a hash of the last parsed items to avoid duplicate calculations
    let lastInterceptItemsHash = null;

    function hashItems(items) {
        try {
            const normalized = [...items]
                .map(it => ({ name: String(it.name || '').trim(), quantity: Number(it.quantity) || 0 }))
                .sort((a, b) => a.name.localeCompare(b.name) || a.quantity - b.quantity);
            return JSON.stringify(normalized);
        } catch (e) {
            return null;
        }
    }

    function installFetchInterceptor() {
        try {
            const script = document.createElement('script');
            script.textContent = `(() => {
                const originalFetch = window.fetch;
                if (!originalFetch) return;
                const shouldWatch = (url) => {
                    try {
                        const u = typeof url === 'string' ? url : (url && url.url) || '';
                        return u.includes('/trade.php') && u.includes('rfcv=');
                    } catch (e) { return false; }
                };
                window.fetch = function(...args) {
                    try {
                        const url = args[0];
                        if (shouldWatch(url)) {
                            return originalFetch.apply(this, args).then(resp => {
                                try {
                                    const clone = resp.clone();
                                    clone.text().then(html => {
                                        try {
                                            window.postMessage({ type: '__TVC_TRADE_HTML__', url: (typeof url==='string'?url:(url&&url.url)||''), html }, '*');
                                        } catch (_) {}
                                    }).catch(() => {});
                                } catch (_) {}
                                return resp;
                            });
                        }
                    } catch (_) {}
                    return originalFetch.apply(this, args);
                };
            })();`;
            document.documentElement.appendChild(script);
            script.remove();
        } catch (e) {
            // no-op
        }
    }

    window.addEventListener('message', (event) => {
        try {
            if (event.source !== window) return;
            const data = event.data;
            if (!data || data.type !== '__TVC_TRADE_HTML__' || !data.html) return;
            handleInterceptedTradeHTML(data.html, data.url || '');
        } catch (e) {
            // ignore
        }
    });

    function handleInterceptedTradeHTML(html, requestUrl) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const items = parseItemsFromDocument(doc);

            const allAreEmpty = items.length === 0 || items.every(it => (it.name || '').toLowerCase() === 'no items in trade');
            if (allAreEmpty) return;

            const itemsHash = hashItems(items);
            if (itemsHash && itemsHash === lastInterceptItemsHash) return;
            lastInterceptItemsHash = itemsHash;

            // Extract data from intercepted HTML
            const username = getUsernameFromDocument(doc);
            let tradeID = extractTradeIdFromHtml(html) || getTradeID();

            // Ensure UI exists
            initializeStripe();

            // Kick off calculation
            calculateTotalAPI(items, username, tradeID);
        } catch (e) {
            // ignore
        }
    }

    function parseItemsFromDocument(root) {
        const items = [];
        try {
            const itemRows = root.querySelectorAll('.user.right .cont li.color2 ul.desc li');
            itemRows.forEach(row => {
                const nameElement = row.querySelector('.name.left');
                if (nameElement) {
                    const textNode = nameElement.childNodes[0];
                    if (textNode) {
                        const text = (textNode.nodeValue || '').trim();
                        const match = text.match(/^(.+?)(?:\s+x(\d+))?$/);
                        if (match) {
                            const name = match[1].trim();
                            const quantity = match[2] ? parseInt(match[2].trim(), 10) : 1;
                            items.push({ name, quantity });
                        }
                    }
                }
            });
        } catch (e) {}
        return items;
    }

    function getUsernameFromDocument(root) {
        try {
            const userElement = root.querySelector('.user.right .title-black');
            if (userElement) {
                const text = userElement.textContent || '';
                return text.trim();
            }
        } catch (e) {}
        return null;
    }

    function extractTradeIdFromHtml(html) {
        try {
            const match = html.match(/\bID=(\d{3,})\b/);
            if (match) return match[1];
        } catch (e) {}
        return null;
    }

    // Initialize when DOM is ready
    function initialize() {
        console.log('DOM fully loaded and parsed. Setting up fetch interceptor.');

        // Install fetch interceptor early to capture server-rendered trade snapshots
        installFetchInterceptor();

        // Initialize UI and check for stored data
        initializeStripe();
        autoCalculateTrade();
    }

    /**
     * Creates the overall modal overlay (only once).
     */
    function createModal() {
        const modalHTML = `
            <div class="receipt-modal-overlay">
                <div class="receipt-modal">
                    <div class="modal-header">
                        <h2>Trade Items</h2>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-content">
                        <div class="receipt-content">
                            <div class="loading-spinner">Loading items...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalElement = document.createElement('div');
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement.firstElementChild);

        const overlay = document.querySelector('.receipt-modal-overlay');
        const closeBtn = document.querySelector('.close-modal');

        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('visible');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });

        return overlay;
    }

    /**
     * Opens the modal showing `currentReceipt`.
     * Changing prices inside the modal only updates the local row totals.
     * The main "Total Value" label is NOT changed until after "Save Changes".
     */
    function showReceiptInModal() {
        if (!currentReceipt || !currentReceiptURL) return;

        let modal = document.querySelector('.receipt-modal-overlay');
        if (!modal) {
            modal = createModal();
        }

        const contentDiv = modal.querySelector('.receipt-content');
        contentDiv.innerHTML = '<div class="loading-spinner">Loading items...</div>';
        modal.classList.add('visible');

        setTimeout(() => {
            // Clear the loading spinner
            contentDiv.innerHTML = '';

            // ---- (A) Add URL copy area ----
            const urlContainer = document.createElement('div');
            urlContainer.classList.add('receipt-url-copy');
            urlContainer.innerHTML = `
                <div class="url-display">
                    <span class="url-text">${currentReceiptURL}</span>
                    <button class="copy-url-button">Copy URL</button>
                </div>
            `;
            contentDiv.appendChild(urlContainer);

            const copyButton = urlContainer.querySelector('.copy-url-button');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(currentReceiptURL).then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy URL';
                    }, 2000);
                });
            });

            // ---- (B) Build the items table from `currentReceipt.items` ----
            const itemsTable = document.createElement('table');
            itemsTable.classList.add('items-table');

            // Table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            `;
            itemsTable.appendChild(thead);

            // Table body
            const tbody = document.createElement('tbody');
            (currentReceipt.items || []).forEach(item => {
                const row = document.createElement('tr');
                const imageUrl = item.image_url || 'https://via.placeholder.com/50';

                row.innerHTML = `
                    <td><img src="${imageUrl}" alt="Item Image" style="max-width:50px; max-height:50px;" /></td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${(item.priceUsed || 0).toLocaleString()}</td>
                    <td>$${(item.totalValue || 0).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
            itemsTable.appendChild(tbody);

            contentDiv.appendChild(itemsTable);

            // ---- (C) "Save Changes" button ----
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Changes';
            saveButton.classList.add('save-changes-button');
            saveButton.style.display = 'none'; // hidden until user edits something
            contentDiv.appendChild(saveButton);

            // Enable local editing of the price column (4th col)
            makeTableEditable(itemsTable, saveButton);

            // Update row-level totals for any existing data
            updateTableTotals(itemsTable);

            // Save changes event
            saveButton.addEventListener('click', () => {
                saveChanges(itemsTable, saveButton);
            });
        }, 200);
    }

    /**
     * Clicking on a price cell creates an <input>, letting the user edit the price.
     * As soon as the user is done, we recalc the row's total in the table.
     * The main UI total is NOT touched here.
     */
    function makeTableEditable(table, saveButton) {
        const priceCells = table.querySelectorAll('tbody tr td:nth-child(4)');
        priceCells.forEach(cell => {
            cell.classList.add('price-editable');
            cell.addEventListener('click', () => {
                const currentPrice = cell.textContent.replace(/[^0-9.]/g, '');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = currentPrice;
                input.style.width = '100px';
                input.style.padding = '5px';
                input.style.textAlign = 'center';

                cell.textContent = '';
                cell.appendChild(input);
                input.focus();

                // When the input loses focus (blur), we finalize the change
                input.addEventListener('blur', () => {
                    const newPrice = parseFloat(input.value);
                    if (!isNaN(newPrice)) {
                        cell.textContent = `$${newPrice.toLocaleString()}`;
                        cell.classList.add('price-edited');
                        // Recompute row totals in the table
                        updateTableTotals(table);

                        // Show the save button in case it was hidden
                        saveButton.style.display = 'block';
                    } else {
                        cell.textContent = `$${currentPrice}`;
                    }
                });

                // If user presses Enter, also finalize the change
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            });
        });
    }

    /**
     * For each row, quantity * price -> row's total cell.
     * We do NOT update the main UI "Total Value" here.
     */
    function updateTableTotals(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const quantity = parseInt(row.cells[2].textContent) || 0;
            const price = parseFloat(row.cells[3].textContent.replace(/[^0-9.]/g, '')) || 0;
            const itemTotal = quantity * price;
            row.cells[4].textContent = `$${itemTotal.toLocaleString()}`;
        });
    }

    /**
     * Sends the updated items to the server.
     * Only after a successful response do we update the main UI's "Total Value".
     */
    function saveChanges(table, saveButton) {
        saveButton.classList.add('saving');
        saveButton.disabled = true;

        // Gather updated items from the table
        const updatedItems = [];
        const manualPrices = {};
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const imageCell = row.cells[0].querySelector('img');
            const name = row.cells[1].textContent;
            const quantity = parseInt(row.cells[2].textContent);
            const priceUsed = parseFloat(row.cells[3].textContent.replace(/[^0-9.]/g, '')) || 0;
            const wasEdited = row.cells[3].classList.contains('price-edited');
            const totalValue = parseFloat(row.cells[4].textContent.replace(/[^0-9.]/g, '')) || 0;

            if (wasEdited) {
                manualPrices[name] = priceUsed;
            }

            updatedItems.push({
                name,
                quantity,
                priceUsed,
                wasEdited,
                totalValue,
                image_url: imageCell ? imageCell.src : null
            });
        });

        // tradeID is the last segment of the URL
        const tradeID = currentReceiptURL.split('/').pop();

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://weav3r.lol/api/updateReceipt/${tradeID}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ items: updatedItems }),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data && data.success) {
                        if (data.data && data.data.receipt) {
                            currentReceipt = data.data.receipt;

                            // Store the manual prices in the trade data
                            const tradeID = getTradeID();
                            if (tradeID) {
                                const stored = localStorage.getItem(`trade_${tradeID}`);
                                if (stored) {
                                    const tradeData = JSON.parse(stored);
                                    tradeData.manual_prices = manualPrices;
                                    localStorage.setItem(`trade_${tradeID}`, JSON.stringify(tradeData));
                                }
                            }

                            const totalValueElement = document.querySelector('.total-value-container');
                            if (totalValueElement && currentReceipt.total_value !== undefined) {
                                totalValueElement.textContent = `Total Value: $${currentReceipt.total_value.toLocaleString()}`;
                            }
                        }

                        saveButton.classList.add('saved');
                        setTimeout(() => {
                            saveButton.style.display = 'none';
                            saveButton.classList.remove('saved');
                        }, 2000);
                    } else {
                        saveButton.classList.add('error');
                        setTimeout(() => {
                            saveButton.classList.remove('error');
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error parsing response:', error);
                    saveButton.classList.add('error');
                    setTimeout(() => {
                        saveButton.classList.remove('error');
                    }, 2000);
                } finally {
                    saveButton.classList.remove('saving');
                    saveButton.disabled = false;
                }
            },
            onerror: function(error) {
                console.error('Error updating receipt:', error);
                saveButton.classList.add('error');
                setTimeout(() => {
                    saveButton.classList.remove('error');
                }, 2000);
                saveButton.classList.remove('saving');
                saveButton.disabled = false;
            }
        });
    }

    /**
     * Creates a "Calculate Trade" button and a "View/Edit Receipt" link.
     * The "Total Value" label is updated from the server
     * only when "calculateTotal" or "updateReceipt" succeeds.
     */
    function initializeStripe() {
        const tradeContainer = document.querySelector('.trade-cont.m-top10');

        if (tradeContainer && !document.querySelector('.stripe-container')) {
            console.log('Initializing stripe container...');

            const stripe = document.createElement('div');
            stripe.classList.add('stripe-container');

            const button = document.createElement('button');
            button.textContent = 'Calculate Trade';
            button.classList.add('calculate-button');

            const valueContainer = document.createElement('div');
            valueContainer.classList.add('value-container');

            // This is the main UI label that shows the total value
            // after server calls (NOT after local changes!)
            const totalValueElement = document.createElement('div');
            totalValueElement.classList.add('hidden', 'total-value-container');
            totalValueElement.textContent = 'Total Value: $0';

            const receiptURLElement = document.createElement('div');
            receiptURLElement.classList.add('hidden', 'receipt-url-container');
            receiptURLElement.textContent = 'View/Edit Receipt';

            valueContainer.appendChild(totalValueElement);
            valueContainer.appendChild(receiptURLElement);

            stripe.appendChild(button);
            stripe.appendChild(valueContainer);

            tradeContainer.parentNode.insertBefore(stripe, tradeContainer);

            // When user clicks "Calculate Trade"
            button.addEventListener('click', () => {
                button.classList.add('calculating');
                button.disabled = true;

                // Trigger a page refresh to get fresh data via fetch interceptor
                // This will capture the current trade state and calculate values
                window.location.reload();
            });

            console.log('Stripe container added successfully.');
        }
    }



    /**
     * Shows a small visual confirmation (like "Copied!") after copying.
     */
    function showCopyConfirmation(element, message) {
        const originalText = element.textContent;
        element.textContent = message;
        element.classList.add('copy-confirmation');

        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('copy-confirmation');
        }, 1000);
    }





    /**
     * Get the tradeID from the URL (unchanged).
     */
    function getTradeID() {
        const url = new URL(window.location.href);
        const hash = url.hash;
        const params = new URLSearchParams(hash.substring(1));
        return params.get('ID');
    }

    // Add all the CSS styles inline
    const styles = `
        /* ---------------------------------------------------------------------------
           Base Styles for Stripe Container
        ---------------------------------------------------------------------------- */

        .stripe-container {
           width: 100%;
           max-width: 1200px;
           background-color: #333;
           margin: 0 auto;
           border-radius: 8px;
           display: flex;
           justify-content: center;
           align-items: center;
           padding: 15px 25px;
           border: 1px solid #444;
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
           transition: box-shadow 0.3s ease, justify-content 0.3s ease;
           box-sizing: border-box;
         }

         .stripe-container.expanded {
           justify-content: space-around;
         }

         /* ---------------------------------------------------------------------------
           Button and Element Styles
         ---------------------------------------------------------------------------- */

         .calculate-button,
         .total-value-container,
         .receipt-url-container,
         .copy-url-button,
         .view-edit-receipt-button {
           padding: 10px 20px;
           background: linear-gradient(145deg, #444, #555);
           color: #ffffff;
           border: 1px solid #333;
           border-radius: 6px;
           cursor: pointer;
           font-size: 14px;
           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
           margin: 0 10px;
           transition: background-color 0.3s ease, transform 0.2s ease, color 0.3s ease;
           text-align: center;
           white-space: nowrap;
           min-width: 150px;
           flex: 0 1 auto;
         }

         .calculate-button:hover,
         .total-value-container:hover,
         .receipt-url-container:hover,
         .copy-url-button:hover,
         .view-edit-receipt-button:hover {
           background: linear-gradient(145deg, #555, #444);
           transform: translateY(-2px);
         }

         .value-container {
           display: none;
           align-items: center;
           justify-content: space-evenly;
           flex-grow: 1;
         }

         .value-container.visible {
           display: flex;
         }

         .hidden {
           display: none;
         }

         .copy-confirmation {
           color: #66bb6a !important;
           transition: color 0.3s ease;
           pointer-events: none;
         }

         /* Error button styles */
         .error-button {
           background-color: #ff6666 !important;
           border-color: #cc0000 !important;
         }

         /* Link styles */
         a {
           color: #e0e0e0;
           text-decoration: none;
           cursor: pointer;
           transition: color 0.3s ease;
         }

         a:hover {
           color: #ffffff;
         }

         /* ---------------------------------------------------------------------------
           Modal Styles
         ---------------------------------------------------------------------------- */

         .receipt-modal-overlay {
           display: flex;
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background-color: rgba(0, 0, 0, 0.5);
           z-index: 1000;
           justify-content: center;
           align-items: center;
           opacity: 0;
           visibility: hidden;
           transition: opacity 0.3s ease, visibility 0.3s ease;
         }

         .receipt-modal-overlay.visible {
           opacity: 1;
           visibility: visible;
         }

         .receipt-modal {
           background: white;
           padding: 20px;
           border-radius: 8px;
           max-width: 90%;
           max-height: 90vh;
           overflow-y: auto;
           transform: translateY(20px);
           opacity: 0;
           transition: transform 0.3s ease, opacity 0.3s ease;
         }

         .receipt-modal-overlay.visible .receipt-modal {
           transform: translateY(0);
           opacity: 1;
         }

         .receipt-modal {
           background-color: #1a1a1a;
           border-radius: 12px;
           width: 90%;
           max-width: 650px;
           max-height: 80vh;
           display: flex;
           flex-direction: column;
           box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
         }

         .modal-header {
           background-color: #222;
           padding: 12px 20px;
           border-bottom: 1px solid #333;
           display: flex;
           justify-content: space-between;
           align-items: center;
           z-index: 1;
         }

         .modal-header h2 {
           margin: 0;
           color: #ffffff;
           font-size: 1.1em;
           font-weight: 500;
         }

         .close-modal {
           background: none;
           border: none;
           color: #ffffff;
           font-size: 24px;
           cursor: pointer;
           padding: 0;
           line-height: 1;
           opacity: 0.8;
           transition: opacity 0.2s;
         }

         .close-modal:hover {
           opacity: 1;
         }

         .modal-content {
           padding: 15px;
           background-color: #1a1a1a;
           flex: 1;
           overflow-y: auto;
         }

         .receipt-content {
           height: 100%;
         }

         /* Loading spinner styles */
         .loading-spinner {
           width: 40px;
           height: 40px;
           border: 4px solid #f3f3f3;
           border-top: 4px solid #3498db;
           border-radius: 50%;
           animation: spin 1s linear infinite;
           margin: 20px auto;
         }

         @keyframes spin {
           0% { transform: rotate(0deg); }
           100% { transform: rotate(360deg); }
         }

         /* ---------------------------------------------------------------------------
           Table Styles
         ---------------------------------------------------------------------------- */

         .items-table {
           width: 100%;
           border-collapse: separate;
           border-spacing: 0 8px;
           margin: 0;
           background-color: #1a1a1a;
           font-size: 14px;
         }

         .items-table th {
           background-color: #333;
           font-weight: 600;
           text-transform: uppercase;
           font-size: 13px;
           letter-spacing: 0.5px;
           padding: 14px 15px;
           color: #ffffff;
           text-align: center;
           border-bottom: 2px solid #444;
         }

         .items-table td {
           background-color: #222;
           border: 1px solid #444;
           padding: 14px 15px;
           text-align: center;
           color: #e2e8f0;
           font-family: 'Courier New', monospace;
         }

         .items-table tbody tr {
           transition: background-color 0.2s ease;
         }

         .items-table tbody tr:hover {
           background-color: #f5f5f5;
         }

         .items-table tbody tr:hover td {
           background-color: #2f2f2f;
         }

         /* Style for editable prices */
         .price-editable {
           cursor: pointer;
           position: relative;
           padding-right: 20px;
         }

         .price-editable::after {
           content: '✎';
           position: absolute;
           right: 5px;
           opacity: 0;
           transition: opacity 0.2s;
         }

         .price-editable:hover::after {
           opacity: 0.7;
         }

         .price-edited {
           position: relative;
         }

         .price-edited::after {
           content: '*';
           color: #ffd700;
           position: absolute;
           right: -8px;
           top: 0;
         }

         /* Save button styles */
         .save-changes-button {
           transition: all 0.3s ease;
         }

         .save-changes-button.saving {
           opacity: 0.7;
           cursor: not-allowed;
         }

         .save-changes-button.saved {
           background-color: #28a745;
         }

         .save-changes-button.error {
           background-color: #dc3545;
           animation: shake 0.5s ease-in-out;
         }

         /* ---------------------------------------------------------------------------
           URL Copy Feature Styles
         ---------------------------------------------------------------------------- */

         .receipt-url-copy {
           margin-bottom: 15px;
           padding: 10px;
           background: #2a2a2a;
           border-radius: 4px;
           border: 1px solid #444;
         }

         .url-display {
           display: flex;
           align-items: center;
           justify-content: space-between;
           gap: 10px;
         }

         .url-text {
           color: #e2e8f0;
           font-family: monospace;
           font-size: 12px;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
         }

         .copy-url-button {
           background: linear-gradient(145deg, #444, #555);
           color: #ffffff;
           border: 1px solid #333;
           border-radius: 6px;
           padding: 10px 20px;
           font-size: 14px;
           cursor: pointer;
           white-space: nowrap;
           transition: background-color 0.3s ease, transform 0.2s ease, color 0.3s ease;
           min-width: 150px;
           flex: 0 1 auto;
         }

         .copy-url-button:hover {
           background: linear-gradient(145deg, #555, #444);
           transform: translateY(-2px);
         }

         .view-edit-receipt-button {
           padding: 10px 20px;
           background: linear-gradient(145deg, #444, #555);
           color: #ffffff;
           border: 1px solid #333;
           border-radius: 6px;
           cursor: pointer;
           font-size: 14px;
           font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
           margin: 0 10px;
           transition: background-color 0.3s ease, transform 0.2s ease, color 0.3s ease;
           text-align: center;
           white-space: nowrap;
           min-width: 150px;
           flex: 0 1 auto;
         }

         .view-edit-receipt-button:hover {
           background: linear-gradient(145deg, #555, #444);
           transform: translateY(-2px);
         }

         /* ---------------------------------------------------------------------------
           Responsive / Mobile Styles
         ---------------------------------------------------------------------------- */

         @media (max-width: 768px) {
           .stripe-container {
             gap: 12px;
             padding: 15px;
             flex-direction: column;
           }
           .value-container.visible {
             flex-direction: column;
             width: 100%;
             gap: 12px;
           }
           .calculate-button,
           .total-value-container,
           .receipt-url-container,
           .copy-url-button,
           .view-edit-receipt-button {
             width: 100%;
             min-width: unset;
             margin: 0;
             padding: 12px 20px;
             font-size: 16px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
             flex: none;
           }
           .receipt-modal {
             width: 95%;
             margin: 20px;
           }
           .items-table {
             border-spacing: 0 12px;
           }
           .items-table td,
           .items-table th {
             padding: 16px;
             font-size: 15px;
           }
           .url-display {
             flex-direction: column;
             gap: 5px;
           }
           .copy-url-button {
             width: 100%;
             padding: 12px 20px;
           }
         }

         @media (max-width: 480px) {
           .stripe-container {
             gap: 10px;
             padding: 12px;
           }
           .calculate-button,
           .total-value-container,
           .receipt-url-container,
           .copy-url-button,
           .view-edit-receipt-button {
             padding: 14px;
             font-size: 15px;
           }
           .receipt-modal {
             width: 100%;
             margin: 15px;
           }
           .items-table {
             border-spacing: 0 10px;
           }
           .items-table td,
           .items-table th {
             padding: 14px 12px;
             font-size: 14px;
           }
           .modal-header {
             padding: 10px 15px;
           }
           .modal-header h2 {
             font-size: 1em;
           }
           .close-modal {
             font-size: 20px;
           }
           .save-changes-button {
             width: 100%;
             margin: 15px 0;
           }
           .copy-url-button,
           .view-edit-receipt-button {
             width: 100%;
             padding: 14px 20px;
           }
         }

         /* ---------------------------------------------------------------------------
           Price Input Styles
         ---------------------------------------------------------------------------- */

         .items-table input[type="number"] {
           background: #333;
           border: 1px solid #444;
           color: #ffffff;
           border-radius: 4px;
           font-family: 'Courier New', monospace;
           font-size: 14px;
           width: 100%;
           padding: 8px;
         }

         .items-table input[type="number"]:focus {
           outline: 2px solid #4a9eff;
           border-color: #4a9eff;
         }

         /* Button States */
         .calculate-button {
            transition: all 0.3s ease;
        }

        .calculate-button.calculating {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .calculate-button.error {
            animation: shake 0.5s ease-in-out;
            background-color: #ff4444;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        /* Loading Spinner */
        .loading-spinner::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: translateY(-50%) rotate(360deg); }
        }

        /* Table Row Animations */
        .items-table tbody tr {
            transform: translateY(0);
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .items-table tbody tr:hover {
            transform: translateY(-2px);
            background-color: #2f2f2f;
        }

        /* Save Button States */
        .save-changes-button {
            position: relative;
            overflow: hidden;
        }

        .save-changes-button.saving {
            background: #666;
            cursor: wait;
        }

        .save-changes-button.saving::after {
            content: 'Saving...';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #666;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .save-changes-button.saved {
            background: #45a049;
        }

        .save-changes-button.error {
            background: #ff6666;
            animation: shake 0.5s ease-in-out;
        }

        /* Copy confirmation */
        .copy-confirmation {
            color: #28a745;
            transition: color 0.3s ease;
        }
    `;

    // Add styles to the page
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
