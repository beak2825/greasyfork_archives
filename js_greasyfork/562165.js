// ==UserScript==
// @name         Torn Stocks - Dollar Input Box
// @author       srsbsns
// @version      2.1
// @description  Adds a dollar input box that auto-calculates shares with $1M button
// @match        https://www.torn.com/page.php?sid=stocks*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1553986
// @downloadURL https://update.greasyfork.org/scripts/562165/Torn%20Stocks%20-%20Dollar%20Input%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/562165/Torn%20Stocks%20-%20Dollar%20Input%20Box.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Add styles
  GM_addStyle(`
    .stock-dollar-input-wrapper {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 10px;
      margin-left: -20px;
    }

    .stock-dollar-symbol {
      color: #ffffff;
      font-size: 15px;
      font-weight: normal;
    }

    .stock-dollar-input {
      background: #1a1a1a;
      color: #fff;
      border: 1px solid #555;
      border-radius: 3px;
      padding: 3px 6px;
      font-size: 12px;
      width: 100px;
      height: 15px;
      line-height: 20px;
    }

    .stock-dollar-input:focus {
      outline: none;
      border-color: #7cfc00;
    }

    .stock-million-btn {
      background: #2a2a2a;
      color: #ffffff;
      border: 1px solid #555;
      border-radius: 3px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      height: 21px;
      line-height: 1;
      margin-left: 8px;
    }

    .stock-million-btn:hover {
      background: #3a3a3a;
      border-color: #7cfc00;
    }

    .stock-million-btn:active {
      background: #1a1a1a;
    }
  `);

  let currentStockPrice = 0;

  // Get current stock price from the page
  function getCurrentStockPrice() {
    // Look for the stockPrice element
    const priceElement = document.querySelector('.stockPrice___WCQuw .price___CTjJE, [class*="stockPrice"] [class*="price"]');
    if (priceElement) {
      const priceText = priceElement.textContent.replace(/\s/g, '');
      const price = parseFloat(priceText);
      if (price > 0) {
        console.log('Found stock price:', price);
        return price;
      }
    }

    // Fallback: look for aria-label with price
    const priceTab = document.querySelector('[data-name="priceTab"], [id="priceTab"]');
    if (priceTab) {
      const ariaLabel = priceTab.getAttribute('aria-label');
      if (ariaLabel) {
        const match = ariaLabel.match(/price:\s*\$([0-9,.]+)/i);
        if (match) {
          const price = parseFloat(match[1].replace(/,/g, ''));
          console.log('Found stock price from aria-label:', price);
          return price;
        }
      }
    }

    return 0;
  }

  // Apply native input setter for React compatibility
  function setInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, value);

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Convert dollar amount to number of shares
  function dollarsToShares(dollarAmount, stockPrice) {
    if (!stockPrice) return 0;
    return Math.floor(dollarAmount / stockPrice);
  }

  // Add dollar input box
  function addDollarInputBox(sharesInput) {
    // Check if already added
    if (sharesInput.dataset.dollarBoxAdded) return;
    sharesInput.dataset.dollarBoxAdded = 'true';

    console.log('Adding dollar input box');

    currentStockPrice = getCurrentStockPrice();
    if (!currentStockPrice) {
      console.log('No stock price found, skipping');
      return;
    }

    // Create dollar input wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'stock-dollar-input-wrapper';
    wrapper.innerHTML = `
      <span class="stock-dollar-symbol">$</span>
      <input type="text" class="stock-dollar-input" placeholder="0">
      <button class="stock-million-btn">$1M</button>
    `;

    // Insert after the entire actions container (below the buy/sell button)
    const actionsContainer = sharesInput.closest('.actions___PIYmF, [class*="actions"]');
    if (actionsContainer) {
      actionsContainer.parentNode.insertBefore(wrapper, actionsContainer.nextSibling);
    } else {
      // Fallback
      const container = sharesInput.closest('div') || sharesInput.parentElement;
      container.parentNode.insertBefore(wrapper, container.nextSibling);
    }

    const dollarInput = wrapper.querySelector('.stock-dollar-input');
    const millionBtn = wrapper.querySelector('.stock-million-btn');

    // Update shares as user types dollars
    dollarInput.addEventListener('input', () => {
      const dollarAmount = parseFloat(dollarInput.value.replace(/,/g, '')) || 0;

      if (dollarAmount > 0) {
        const shares = dollarsToShares(dollarAmount, currentStockPrice);

        // Auto-fill the shares input
        setInputValue(sharesInput, shares.toString());
      } else {
        setInputValue(sharesInput, '');
      }
    });

    // Add $1,000,000 when $1M button is clicked
    millionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentAmount = parseFloat(dollarInput.value.replace(/,/g, '')) || 0;
      const newAmount = currentAmount + 1000000;
      dollarInput.value = newAmount.toString();

      // Trigger input event to update shares
      dollarInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Clear dollar input when user types in shares input
    sharesInput.addEventListener('input', () => {
      if (document.activeElement === sharesInput) {
        dollarInput.value = '';
      }
    });
  }

  // Main function to inject dollar boxes
  function injectDollarBoxes() {
    currentStockPrice = getCurrentStockPrice();

    if (currentStockPrice === 0) {
      console.log('Stock price not found yet, will retry...');
      return;
    }

    console.log('Injecting dollar boxes, stock price:', currentStockPrice);

    // Find the actual stock buy/sell inputs
    const buyBlock = document.querySelector('.buyBlock___bIlBS, [class*="buyBlock"]');
    const sellBlock = document.querySelector('.sellBlock___A_yTW, [class*="sellBlock"]');

    if (buyBlock) {
      const buyInput = buyBlock.querySelector('input.input-money:not([type="hidden"])');
      if (buyInput) {
        console.log('Found buy input');
        addDollarInputBox(buyInput);
      }
    }

    if (sellBlock) {
      const sellInput = sellBlock.querySelector('input.input-money:not([type="hidden"])');
      if (sellInput) {
        console.log('Found sell input');
        addDollarInputBox(sellInput);
      }
    }
  }

  // Watch for page changes
  const observer = new MutationObserver(() => {
    injectDollarBoxes();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial injection with multiple retries
  setTimeout(() => injectDollarBoxes(), 500);
  setTimeout(() => injectDollarBoxes(), 1000);
  setTimeout(() => injectDollarBoxes(), 2000);
})();