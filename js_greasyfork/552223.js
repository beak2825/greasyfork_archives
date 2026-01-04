// ==UserScript==
// @license MIT
// @name         StockTwits Symbol Scraper
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Scrapes Symbol column stock tickers from StockTwits sentiment pages and displays them in a copyable popup with a refined button layout.
// @author       ZP
// @match        https://stocktwits.com/
// @match        https://stocktwits.com/sentiment
// @match        https://stocktwits.com/sentiment/most-active
// @match        https://stocktwits.com/sentiment/watchers
// @match        https://stocktwits.com/sentiment/trending
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552223/StockTwits%20Symbol%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/552223/StockTwits%20Symbol%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let initialized = false;
    const targetUrls = [
        'https://stocktwits.com/sentiment',
        'https://stocktwits.com/sentiment/most-active',
        'https://stocktwits.com/sentiment/watchers',
        'https://stocktwits.com/sentiment/trending'
    ];

    // Function to extract tickers from Symbol column
    function extractTickers() {
        const tickers = [];
        const elements = document.querySelectorAll('p.TickerTable_symbol___hQ3F a[href*="/symbol/"]');
        elements.forEach(element => {
            const ticker = element.textContent.trim();
            if (ticker) {
                tickers.push(`$${ticker}`);
            }
        });
        return tickers;
    }

    // Function to initialize the button and popup
    function initialize() {
        if (initialized) return;
        initialized = true;
        console.log('Initializing StockTwits Scraper button...');

        // Create a styled button
        const button = document.createElement('button');
        button.innerText = 'Show Stock Codes';
        button.style.position = 'fixed';
        button.style.bottom = '30px';
        button.style.right = '30px';
        button.style.padding = '12px 24px';
        button.style.fontSize = '16px';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.border = '1px solid #2e7d32';
        button.style.borderRadius = '6px';
        button.style.backgroundColor = '#4caf50';
        button.style.color = '#fff';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.style.transition = 'all 0.3s ease';
        button.style.zIndex = '1000';
        button.onmouseover = () => { button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)'; button.style.backgroundColor = '#66bb6a'; };
        button.onmouseout = () => { button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; button.style.backgroundColor = '#4caf50'; };

        // Create popup for copyable content
        function showPopup() {
            const tickers = extractTickers();
            const output = tickers.length > 0 ? tickers.join('\n') : 'No stock codes found!';

            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#fff';
            popup.style.padding = '20px';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            popup.style.zIndex = '1001';
            popup.style.textAlign = 'center';
            popup.style.minWidth = '350px';
            popup.style.display = 'flex';
            popup.style.flexDirection = 'column';
            popup.style.alignItems = 'stretch';

            const title = document.createElement('h3');
            title.innerText = 'Stock Codes Scraped';
            title.style.margin = '0 0 15px 0';
            title.style.color = '#333';

            const textareaContainer = document.createElement('div');
            textareaContainer.style.position = 'relative';
            textareaContainer.style.width = '100%';

            const textarea = document.createElement('textarea');
            textarea.value = output;
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            textarea.style.padding = '10px';
            textarea.style.border = '1px solid #ccc';
            textarea.style.borderRadius = '4px';
            textarea.style.resize = 'none';
            textarea.style.fontFamily = 'monospace';
            textarea.style.fontSize = '14px';
            textarea.readOnly = 'true';
            textarea.style.marginBottom = '15px';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.width = '100%';

            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copy Tickers';
            copyButton.style.flexGrow = '1';
            copyButton.style.padding = '10px 15px';
            copyButton.style.fontSize = '14px';
            copyButton.style.border = '1px solid #2196f3';
            copyButton.style.borderRadius = '4px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.backgroundColor = '#2196f3';
            copyButton.style.color = '#fff';
            copyButton.style.transition = 'all 0.3s ease';
            copyButton.onmouseover = () => { copyButton.style.backgroundColor = '#42a5f5'; };
            copyButton.onmouseout = () => { copyButton.style.backgroundColor = '#2196f3'; };
            copyButton.onclick = () => {
                textarea.select();
                document.execCommand('copy');
                copyButton.innerText = 'Copied! ✅';
                setTimeout(() => { copyButton.innerText = 'Copy Tickers'; }, 1500);
            };

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.flexGrow = '1';
            closeButton.style.padding = '10px 15px';
            closeButton.style.fontSize = '14px';
            closeButton.style.border = '1px solid #f44336';
            closeButton.style.borderRadius = '4px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = '#fff';
            closeButton.style.transition = 'all 0.3s ease';
            closeButton.onmouseover = () => { closeButton.style.backgroundColor = '#e57373'; };
            closeButton.onmouseout = () => { closeButton.style.backgroundColor = '#f44336'; };
            closeButton.onclick = () => { document.body.removeChild(popup); document.body.removeChild(overlay); };

            buttonContainer.appendChild(copyButton);
            buttonContainer.appendChild(closeButton);
            textareaContainer.appendChild(textarea);
            textareaContainer.appendChild(buttonContainer);
            popup.appendChild(title);
            popup.appendChild(textareaContainer);
            document.body.appendChild(popup);

            // Add overlay for clicking outside to close
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '1000';
            overlay.onclick = () => { document.body.removeChild(popup); document.body.removeChild(overlay); };
            document.body.appendChild(overlay);
        }

        // Add click event to show popup
        button.addEventListener('click', showPopup);

        // Add button to the page
        document.body.appendChild(button);
    }

    // Check URL changes and initialize if matched
    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (targetUrls.includes(currentUrl)) {
                console.log('URL changed to target page, initializing...');
                initialize();
            } else if (currentUrl === 'https://stocktwits.com/' && initialized) {
                // Reset initialized flag when leaving target pages
                initialized = false;
                console.log('Left target page, resetting initialization...');
            }
        } else if (!initialized && targetUrls.includes(currentUrl)) {
            console.log('Current URL matches target, initializing...');
            initialize();
        }
    }, 500); // Check every 500ms

    // Initial check on page load
    if (targetUrls.includes(location.href)) {
        initialize();
    }
})();