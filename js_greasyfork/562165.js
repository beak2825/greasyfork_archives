// ==UserScript==
// @name         Torn Stocks - Dollar Input Box
// @author       srsbsns (modified by Claude)
// @version      2.5
// @description  Adds a dollar input box that auto-calculates shares with $1M button - accounts for 0.1% selling fee
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

    .stock-fee-info {
      color: #888;
      font-size: 10px;
      margin-top: 2px;
      margin-left: 20px;
    }

    .stock-fee-info.selling {
      color: #FFA500;
    }
  `);

  // Get current stock price from the active stock
  function getCurrentStockPrice() {
    // Strategy 1: Find the active owned tab, then find its sibling price tab
    const activeOwnedTab = document.querySelector('li.stockOwned___eXJed.active___IUYLC[id="ownedTab"]');

    if (activeOwnedTab) {
      // The price tab should be a sibling (same parent)
      const parent = activeOwnedTab.parentElement;
      if (parent) {
        const priceTab = parent.querySelector('li.stockPrice___WCQuw[id="priceTab"]');
        if (priceTab) {
          // Get the price from the price___CTjJE div
          const priceDiv = priceTab.querySelector('.price___CTjJE');
          if (priceDiv) {
            // Extract all the numbers (they're in separate spans)
            const priceText = priceDiv.textContent.replace(/\s/g, '');
            const price = parseFloat(priceText);
            if (price > 0) {
              console.log('Found stock price from active stock price tab:', price);
              return price;
            }
          }
        }
      }
    }

    // Strategy 2: Use aria-label from the price tab if available
    const priceTab = document.querySelector('li.stockPrice___WCQuw[id="priceTab"]');
    if (priceTab) {
      const ariaLabel = priceTab.getAttribute('aria-label');
      if (ariaLabel) {
        // Example: "Share stock price: $809.63. Increased by 17.17 dollars / 2.17 percents"
        const match = ariaLabel.match(/price:\s*\$([0-9,.]+)/i);
        if (match) {
          const price = parseFloat(match[1].replace(/,/g, ''));
          console.log('Found stock price from aria-label:', price);
          return price;
        }
      }
    }

    // Strategy 3: Fallback - look for any visible price element
    const priceElement = document.querySelector('.stockPrice___WCQuw .price___CTjJE');
    if (priceElement) {
      const priceText = priceElement.textContent.replace(/\s/g, '');
      const price = parseFloat(priceText);
      if (price > 0) {
        console.log('Found stock price (fallback):', price);
        return price;
      }
    }

    console.log('Could not find stock price');
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

  // Convert dollar amount to number of shares (BUYING - round down, no fee)
  function dollarsToSharesBuying(dollarAmount, stockPrice) {
    if (!stockPrice) return 0;
    return Math.floor(dollarAmount / stockPrice);
  }

  // Convert dollar amount to number of shares (SELLING - round up, account for 0.1% fee)
  function dollarsToSharesSelling(dollarAmount, stockPrice) {
    if (!stockPrice) return 0;

    // When selling, you want to receive AT LEAST dollarAmount after the 0.1% fee
    // Formula: shares * price * 0.999 >= dollarAmount
    // Therefore: shares >= dollarAmount / (price * 0.999)

    const sharesNeeded = dollarAmount / (stockPrice * 0.999);
    const sharesCeil = Math.ceil(sharesNeeded);

    console.log(`Selling calculation: Target=$${dollarAmount}, Price=$${stockPrice}, Shares needed=${sharesNeeded.toFixed(2)}, Rounded up to=${sharesCeil}`);

    return sharesCeil;
  }

  // Calculate actual proceeds after selling fee
  function calculateSellingProceeds(shares, stockPrice) {
    const gross = shares * stockPrice;
    const fee = gross * 0.001; // 0.1% = 0.001
    const net = gross - fee;
    return { gross, fee, net };
  }

  // Detect if this is a buy or sell block
  function isSellBlock(container) {
    const sellBlock = container.closest('.sellBlock___A_yTW, [class*="sellBlock"]');
    return !!sellBlock;
  }

  // Add dollar input box
  function addDollarInputBox(sharesInput) {
    // Check if already added
    if (sharesInput.dataset.dollarBoxAdded) return;
    sharesInput.dataset.dollarBoxAdded = 'true';

    console.log('Adding dollar input box');

    const currentStockPrice = getCurrentStockPrice();
    if (!currentStockPrice) {
      console.log('No stock price found, skipping');
      return;
    }

    const isSelling = isSellBlock(sharesInput);
    console.log(`This is a ${isSelling ? 'SELL' : 'BUY'} block`);

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

    // Add fee info display (only for selling)
    let feeInfoDiv = null;
    if (isSelling) {
      feeInfoDiv = document.createElement('div');
      feeInfoDiv.className = 'stock-fee-info selling';
      feeInfoDiv.textContent = 'Accounting for 0.1% selling fee';
      wrapper.parentNode.insertBefore(feeInfoDiv, wrapper.nextSibling);
    }

    const dollarInput = wrapper.querySelector('.stock-dollar-input');
    const millionBtn = wrapper.querySelector('.stock-million-btn');

    // Update shares as user types dollars - GET FRESH PRICE EACH TIME
    dollarInput.addEventListener('input', () => {
      const dollarAmount = parseFloat(dollarInput.value.replace(/,/g, '')) || 0;

      if (dollarAmount > 0) {
        // Get the current stock price dynamically
        const freshPrice = getCurrentStockPrice();
        console.log('Calculating with fresh price:', freshPrice);

        let shares;
        if (isSelling) {
          // SELLING: Round UP and account for 0.1% fee
          shares = dollarsToSharesSelling(dollarAmount, freshPrice);

          // Update fee info
          if (feeInfoDiv) {
            const proceeds = calculateSellingProceeds(shares, freshPrice);
            feeInfoDiv.innerHTML = `💰 ${shares} shares × $${freshPrice.toFixed(2)} = $${proceeds.gross.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} - $${proceeds.fee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} fee = <strong style="color: #00FF00;">$${proceeds.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>`;
          }
        } else {
          // BUYING: Round DOWN (normal behavior)
          shares = dollarsToSharesBuying(dollarAmount, freshPrice);
        }

        // Auto-fill the shares input
        setInputValue(sharesInput, shares.toString());
      } else {
        setInputValue(sharesInput, '');
        if (feeInfoDiv && isSelling) {
          feeInfoDiv.textContent = 'Accounting for 0.1% selling fee';
        }
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
        if (feeInfoDiv && isSelling) {
          feeInfoDiv.textContent = 'Accounting for 0.1% selling fee';
        }
      }
    });
  }

  // Main function to inject dollar boxes
  function injectDollarBoxes() {
    const currentStockPrice = getCurrentStockPrice();

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