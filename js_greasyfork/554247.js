// ==UserScript==
// @name        BJ's Coupon Clipper with Controls
// @namespace   https://greasyfork.org/en/users/807108-jeremy-r
// @version     1.5
// @author      JRem
// @description Clicks all "clipToCard" buttons with data-testid="coupon-btn" with controls
// @match       https://www.bjs.com/myCoupons*
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/554247/BJ%27s%20Coupon%20Clipper%20with%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/554247/BJ%27s%20Coupon%20Clipper%20with%20Controls.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Persistent keys
  const AUTOSTART_KEY = 'bjs_coupon_autostart_v1';
  const DELAY_KEY = 'bjs_coupon_delay_v1';

  // Runtime state
  let buttonCount = 0;
  let delay = 500; // Default delay in milliseconds (will be overwritten by saved preference if present)
  let isRunning = false; // user-intended run state (Start/Stop)
  let isClicking = false; // prevents re-entrant clickCoupons runs
  let lastParsedTotal = null; // last parsed total coupons from the UI (integer or null)

  // control refs
  let startButtonRef = null;
  let countDisplayRef = null;
  let delayInputRef = null;
  let autoStatusRef = null;

  // Read saved delay from localStorage (return integer or default)
  function getSavedDelay() {
    try {
      const v = localStorage.getItem(DELAY_KEY);
      if (!v) return null;
      const parsed = parseInt(v, 10);
      if (Number.isNaN(parsed) || parsed < 0) return null;
      return parsed;
    } catch (e) {
      console.warn('Failed to read saved delay from localStorage', e);
      return null;
    }
  }

  // Save delay to localStorage
  function saveDelay(ms) {
    try {
      localStorage.setItem(DELAY_KEY, String(ms));
    } catch (e) {
      console.warn('Failed to save delay to localStorage', e);
    }
  }

  // Initialize delay from storage if available
  const saved = getSavedDelay();
  if (saved !== null) delay = saved;

  function createControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.left = '10px';
    controlPanel.style.zIndex = '9999';
    controlPanel.style.backgroundColor = '#f0f0f0';
    controlPanel.style.padding = '10px';
    controlPanel.style.border = '1px solid #ccc';
    controlPanel.style.fontFamily = 'Arial, sans-serif';
    controlPanel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    // Start / Stop button
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Clipping';
    startButton.style.marginRight = '8px';
    startButton.addEventListener('click', () => {
      if (!isRunning) {
        isRunning = true;
        startButton.textContent = 'Stop Clipping';
        clickCoupons().catch(err => console.error('clickCoupons error:', err));
      } else {
        isRunning = false;
        startButton.textContent = 'Start Clipping';
        clearAutostart();
      }
    });

    // Count display (readonly) - will show "clipped/total" (e.g., "3/12" or "3/?")
    const countDisplay = document.createElement('input');
    countDisplay.type = 'text';
    countDisplay.classList.add('countDisplay');
    countDisplay.value = `${buttonCount}/${lastParsedTotal === null ? '?' : lastParsedTotal}`;
    countDisplay.disabled = true;
    countDisplay.style.width = '80px';
    countDisplay.style.marginRight = '8px';

    // Delay input
    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.min = '0';
    delayInput.value = delay;
    delayInput.style.width = '90px';
    delayInput.addEventListener('change', (e) => {
      const v = parseInt(e.target.value, 10);
      if (!Number.isNaN(v) && v >= 0) {
        delay = v;
        saveDelay(delay); // persist the user's choice
      } else {
        e.target.value = delay;
      }
    });

    // Info / status for auto-reload mode
    const autoStatus = document.createElement('span');
    autoStatus.textContent = '';
    autoStatus.style.marginLeft = '8px';
    autoStatus.style.fontSize = '12px';
    autoStatus.style.color = '#333';

    controlPanel.appendChild(startButton);
    controlPanel.appendChild(document.createTextNode(' Buttons Clipped: '));
    controlPanel.appendChild(countDisplay);
    controlPanel.appendChild(document.createTextNode(' Delay (ms): '));
    controlPanel.appendChild(delayInput);
    controlPanel.appendChild(autoStatus);

    // Insert control panel near page content if possible, else body
    const targetContainer = document.querySelector('.container.card-wrap-container');
    if (targetContainer && targetContainer.parentNode) {
      targetContainer.parentNode.insertBefore(controlPanel, targetContainer);
    } else {
      document.body.appendChild(controlPanel);
    }

    // store refs
    startButtonRef = startButton;
    countDisplayRef = countDisplay;
    delayInputRef = delayInput;
    autoStatusRef = autoStatus;

    // Update autoStatus text based on localStorage flag
    if (getAutostart()) {
      autoStatus.textContent = 'Auto-Reload: ON';
      autoStatus.style.color = 'green';
    } else {
      autoStatus.textContent = '';
    }
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Parse the page-provided coupon count from:
  // document.querySelector('li[data-auto-data="coupon_categoryFilteredCouponCnt"] span')
  // Returns integer number or null if not found/parseable and updates lastParsedTotal
  function getTotalCouponsFromUI() {
    try {
      const el = document.querySelector('li[data-auto-data="coupon_categoryFilteredCouponCnt"] span');
      if (!el) {
        lastParsedTotal = null;
        return null;
      }
      const text = el.textContent || '';
      const m = text.match(/\d+/);
      if (!m) {
        lastParsedTotal = null;
        return null;
      }
      const parsed = parseInt(m[0], 10);
      lastParsedTotal = parsed;
      return parsed;
    } catch (err) {
      console.warn('Failed to parse total coupons:', err);
      lastParsedTotal = null;
      return null;
    }
  }

  // Update the count display to show "clipped/total" or "clipped/?" if total unknown
  function updateCountDisplay() {
    if (!countDisplayRef) return;
    const total = lastParsedTotal === null ? '?' : lastParsedTotal;
    countDisplayRef.value = `${buttonCount}/${total}`;
  }

  // Autostart flag helpers
  function setAutostart() {
    try {
      localStorage.setItem(AUTOSTART_KEY, '1');
      if (autoStatusRef) {
        autoStatusRef.textContent = 'Auto-Reload: ON';
        autoStatusRef.style.color = 'green';
      }
    } catch (e) {
      console.warn('Failed to set autostart in localStorage', e);
    }
  }
  function clearAutostart() {
    try {
      localStorage.removeItem(AUTOSTART_KEY);
      if (autoStatusRef) {
        autoStatusRef.textContent = '';
      }
    } catch (e) {
      console.warn('Failed to clear autostart in localStorage', e);
    }
  }
  function getAutostart() {
    try {
      return localStorage.getItem(AUTOSTART_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // Scroll helper - ensures element is visible and gives the page a moment to render/load more content
  async function ensureVisibleAndAllowLoad(el) {
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } catch (e) {
      try {
        const rect = el.getBoundingClientRect();
        window.scrollBy(0, rect.top - (window.innerHeight / 2));
      } catch (e2) {
        // ignore
      }
    }
    // short wait to allow any lazy-loading or DOM updates
    await wait(300);
  }

  // Core clicking loop:
  // - finds next clickable coupon button (not disabled)
  // - scrolls into view
  // - clicks, increments count, waits delay
  // If no button found:
  // - checks parsed total coupon count
  // - if total === 0 -> done, clear autostart
  // - if total > buttonCount -> set autostart and reload page to load more coupons
  async function clickCoupons() {
    // Prevent concurrent runs
    if (isClicking) return;
    isClicking = true;

    try {
      while (isRunning) {
        // Update parsed total from UI (keeps lastParsedTotal current)
        getTotalCouponsFromUI();
        updateCountDisplay();

        // pick the next clickable coupon button (visible / not disabled)
        let button = document.querySelector('button[name="clipToCard"][data-testid="coupon-btn"]:not([disabled])');

        if (!button) {
          // No immediate clickable buttons found on this viewport/DOM snapshot.
          // Check page-reported total coupons.
          const total = getTotalCouponsFromUI();

          if (total === 0) {
            console.log('Parsed total coupons is 0 — nothing left to clip.');
            // clear autostart and stop
            clearAutostart();
            isRunning = false;
            if (startButtonRef) startButtonRef.textContent = 'Start Clipping';
            updateCountDisplay();
            break;
          }

          if (total !== null && buttonCount < total) {
            // We have not yet clicked as many as the page reports. Try to trigger loading more coupons.
            console.log(`Clicked ${buttonCount}/${total} reported coupons but no clickable buttons found. Will reload and continue automatically.`);
            // Set autostart so on reload the script continues automatically
            setAutostart();
            // small delay to allow any last-minute updates or logs to flush
            await wait(200);
            // Reload the page so more coupons can be loaded; script will auto-start after reload
            location.reload();
            // return because we will unload
            return;
          }

          // If total is null (couldn't parse), attempt to scroll down to try to load more coupons before giving up.
          if (total === null) {
            console.log('Could not parse total coupons; attempting to scroll to bottom to load more content.');
            try {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } catch (e) {
              window.scrollTo(0, document.body.scrollHeight);
            }
            await wait(1000);
            // then continue the loop and try to find a button again
            continue;
          }

          // If we reached here and buttonCount >= total, assume finished
          if (total !== null && buttonCount >= total) {
            console.log(`Completed expected count: ${buttonCount}/${total}.`);
            clearAutostart();
            isRunning = false;
            if (startButtonRef) startButtonRef.textContent = 'Start Clipping';
            updateCountDisplay();
            break;
          }

          // fallback: nothing to do
          console.log('No clickable button found and no reload condition matched; stopping.');
          isRunning = false;
          if (startButtonRef) startButtonRef.textContent = 'Start Clipping';
          clearAutostart();
          updateCountDisplay();
          break;
        }

        // Make sure button is visible and allow page to load related elements
        await ensureVisibleAndAllowLoad(button);

        // Click the button
        try {
          button.click();
          buttonCount++;
          updateCountDisplay();
          console.log(`Clicked coupon button #${buttonCount}`, button);
        } catch (err) {
          console.warn('Failed to click coupon button:', err);
        }

        // Wait for the site to process the click before continuing
        await wait(delay);
      }
    } finally {
      isClicking = false;
      // If we exit naturally, ensure UI reflects stopped state where appropriate
      if (!isRunning && startButtonRef) {
        startButtonRef.textContent = 'Start Clipping';
      }
      // If we finished and there truly are no coupons left, clear autostart
      const totalAfter = getTotalCouponsFromUI();
      if (totalAfter === 0) {
        clearAutostart();
      }
      updateCountDisplay();
    }
  }

  // Initial execution
  createControlPanel();

  // Ensure we parse the total at least once on load and update the UI display
  getTotalCouponsFromUI();
  updateCountDisplay();

  // If autostart flag is set from a previous run, auto-start clicking now.
  if (getAutostart()) {
    console.log('Autostart flag detected — starting clipping automatically.');
    isRunning = true;
    if (startButtonRef) startButtonRef.textContent = 'Stop Clipping';
    // small delay to let UI settle
    setTimeout(() => {
      clickCoupons().catch(err => console.error('clickCoupons error (autostart):', err));
    }, 500);
  }

  // Observe for new coupon elements being added. If user is running, call clickCoupons (it will guard re-entrancy).
  const observer = new MutationObserver(mutations => {
    // Update parsed total if relevant UI node changed
    let sawRelevant = false;
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        sawRelevant = true;
        break;
      }
      if (mutation.type === 'attributes' && mutation.target && mutation.target.matches && mutation.target.matches('li[data-auto-data="coupon_categoryFilteredCouponCnt"] span')) {
        sawRelevant = true;
        break;
      }
    }
    if (sawRelevant) {
      getTotalCouponsFromUI();
      updateCountDisplay();
    }

    if (!isRunning) return;
    // If new nodes added, attempt to continue clicking (guarded inside clickCoupons)
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        if (!isClicking) {
          clickCoupons().catch(err => console.error('clickCoupons error from observer:', err));
        }
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: false });

  // Optional: expose a small API on window for debugging
  window._bjsCouponClipper = {
    start: () => {
      if (!isRunning) {
        isRunning = true;
        if (startButtonRef) startButtonRef.textContent = 'Stop Clipping';
        clickCoupons().catch(err => console.error(err));
      }
    },
    stop: () => {
      isRunning = false;
      clearAutostart();
      if (startButtonRef) startButtonRef.textContent = 'Start Clipping';
    },
    getStatus: () => ({ isRunning, isClicking, buttonCount, parsedTotal: lastParsedTotal, delay })
  };

})();