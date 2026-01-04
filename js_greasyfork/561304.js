// ==UserScript==
// @name         OC Timing: Travel Blocker Plus (Modular)
// @namespace    zonure.scripts
// @version      1.0.0
// @description  Blocks travel to destinations where the return time would overlap with OC initiation or when the user is not in OC. Works on both mobile and desktop. Toggle in UI, disables Travel or Continue when blocked.
// @author       Zonure [3787510](core), hyons [2543653](modifications)
// @match        https://www.torn.com/page.php?sid=travel
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561304/OC%20Timing%3A%20Travel%20Blocker%20Plus%20%28Modular%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561304/OC%20Timing%3A%20Travel%20Blocker%20Plus%20%28Modular%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
// Uncomment(remove the two /) and set your Minimal perm Torn API key
//  const tornApiKey = 'YOUR_API_KEY_HERE';
  const DEBUG = false;
  const FORCE_OCREADY_TEST = false;

  const STORAGE_KEY = 'oc_travel_block_enabled';
  const BOOT_TS = performance.now();

  const log = (...a) => { if (DEBUG) console.log('[OC-TB]', ...a); };
  const warn = (...a) => { if (DEBUG) console.warn('[OC-TB]', ...a); };
  const ocApiURL = 'https://api.torn.com/v2/user/organizedcrime';
  log('BOOT START');
  let isUserInOC = false;
  if (DEBUG) {
    const keys = Object.keys(localStorage);
    log('LOCALSTORAGE KEY COUNT', keys.length);
    keys.forEach(k => {
      try { log('LOCALSTORAGE ENTRY', k, localStorage.getItem(k)); }
      catch (e) { warn('LOCALSTORAGE READ FAIL', k, e); }
    });
  }
  const fetchUserOC = async () => {
    if (typeof tornApiKey === 'undefined' || !tornApiKey) {
      log('API KEY MISSING: Cannot fetch user OC data');
      return null;
    }
    try {
      const response = await fetch(ocApiURL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `ApiKey ${tornApiKey}` },
      });
      const data = await response.json();
      log('API RESPONSE', data);
      return data;
    } catch (e) {
      log('[OC-TB] API FETCH ERROR', e);
      return null;
    }
  };
  const fetchOC = async () => {
    const data = await fetchUserOC();
    if(data.organizedCrime == null) {
      console.log('USER NOT IN OC');
      return false;
    }
    return true;
  }
  const updateOCStatus = async () => {
  isUserInOC = await fetchOC();
};
  const isMobileView = window.matchMedia('(max-width: 600px)').matches;
  log('VIEW MODE', isMobileView ? 'MOBILE' : 'DESKTOP');

  let isEnabled = localStorage.getItem(STORAGE_KEY);
  if (isEnabled === null) {
    localStorage.setItem(STORAGE_KEY, 'true');
    isEnabled = 'true';
    log('STORAGE INIT enabled=true');
  }
  isEnabled = isEnabled === 'true';
  log('SCRIPT ENABLED', isEnabled);

  const style = document.createElement('style');
  style.textContent = `
  #oc-toggle-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 12px;
    font-size: 14px;
    color: var(--appheader-title-color);
  }

  .oc-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }

  .oc-toggle input {
    display: none;
  }

  .oc-slider {
    position: relative;
    width: 36px;
    height: 18px;
    background-color: rgba(255,255,255,0.25);
    border-radius: 999px;
    transition: background-color 0.2s ease;
  }

  .oc-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background-color: currentColor;
    border-radius: 50%;
    transition: transform 0.2s ease;
  }

  .oc-toggle input:checked + .oc-slider {
    background-color: rgba(0,150,0,0.6);
  }

  .oc-toggle input:checked + .oc-slider::before {
    transform: translateX(18px);
  }

  .oc-toggle-label {
    font-weight: 500;
  }

  .script-disabled-button {
    background-color: #a00 !important;
    color: crimson !important;
    font-weight: bold;
    text-transform: uppercase;
    cursor: not-allowed !important;
    pointer-events: none;
  }
  `;
  document.head.appendChild(style);
  log('STYLE INJECTED');

  const getTravelRoot = () => {
    const root = document.getElementById('travel-root');
    root ? log('SANITY OK travel-root found') : warn('SANITY FAIL travel-root missing');
    return root;
  };

  const getDataModel = () => {
    const root = getTravelRoot();
    if (!root) return null;

    const raw = root.getAttribute('data-model');
    if (!raw) { warn('SANITY FAIL data-model missing'); return null; }
    log('SANITY OK data-model attribute present');

    try {
      const parsed = JSON.parse(raw);
      log('SANITY OK data-model parsed', parsed.destinations?.length);
      return parsed;
    } catch (e) {
      console.error('[OC-TB] data-model parse error', e);
      return null;
    }
  };

  const disableActionButton = (label, country, method) => {
    const buttons = [...document.querySelectorAll('a.torn-btn.btn-dark-bg,button.torn-btn.btn-dark-bg')];
    log('DISABLE SCAN buttons found', buttons.map(b => b.textContent.trim()));

    const target = buttons.find(b => b.textContent.trim() === label);
    if (!target) { warn('DISABLE FAIL button not found', label); return; }

    warn('BLOCKING', label, country, method);
    target.disabled = true;
    target.textContent = 'DISABLED';
    target.title = 'Blocked: OC not ready before return.';
    target.classList.add('script-disabled-button');
  };

  const injectToggle = () => {
    const root = getTravelRoot();
    if (!root) return;

    const topSection = [...root.querySelectorAll('div')]
      .find(d => [...d.classList].some(c => c.startsWith('topSection')));
    if (!topSection) return;

    const titleContainer = [...topSection.children]
      .find(d => [...d.classList].some(c => c.startsWith('titleContainer')));
    const linksContainer = [...topSection.children]
      .find(d => [...d.classList].some(c => c.startsWith('linksContainer')));
    if (!titleContainer || !linksContainer) return;

    let container = document.getElementById('oc-toggle-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'oc-toggle-container';
      container.innerHTML = `
        <label class="oc-toggle">
          <input type="checkbox" id="oc-toggle-checkbox" ${isEnabled ? 'checked' : ''}>
          <span class="oc-slider"></span>
          <span class="oc-toggle-label">Travel Blocker</span>
        </label>
      `;
      container.querySelector('input').addEventListener('change', e => {
        isEnabled = e.target.checked;
        log('TOGGLE CHANGED', isEnabled);
      });
    }

    if (container.parentNode !== topSection) {
      topSection.insertBefore(container, linksContainer);
      log('TOGGLE INSERTED');
    }
  };

  const shouldBlock = ocReady => FORCE_OCREADY_TEST ? ocReady !== undefined : ocReady === true;

  const handleDesktopClick = () => {
    const root = getTravelRoot();
    if (!root) return;

    const panel = [...root.querySelectorAll('div')]
      .find(d => [...d.classList].some(c => c.startsWith('patternPanel')));
    panel ? log('SANITY OK patternPanel found', panel.className)
          : warn('CLICK FAIL patternPanel missing');

    if (!panel) return;

    const buttons = [...panel.querySelectorAll('button,a')];
    const labels = buttons.map(b => b.textContent.trim());
    log('DESKTOP panel buttons', labels);

    const actionLabel = labels.includes('Travel') ? 'Travel'
                      : labels.includes('Continue') ? 'Continue'
                      : null;
    if (!actionLabel) { warn('DESKTOP no actionable button yet'); return; }

    const flightGrid = root.querySelector('div[class^="flightDetailsGrid"]');
    flightGrid ? log('SANITY OK flightDetailsGrid', flightGrid.className)
               : warn('CLICK FAIL flightDetailsGrid missing');
    if (!flightGrid) return;

    const countrySpan = flightGrid.querySelector('span[class^="country"]');
    if (!countrySpan) { warn('CLICK FAIL country span missing', flightGrid.innerHTML); return; }

    const countryName = countrySpan.textContent.trim();
    log('CLICK country detected', countryName);

    const parsed = getDataModel();
    if (!parsed) return;

    const match = parsed.destinations?.find(d => d.country.toLowerCase() === countryName.toLowerCase());
    if (!match) { warn('DATA FAIL destination missing', countryName); return; }

    const methodInput = root.querySelector('fieldset[class^="travelTypeSelector"] input[name="travelType"]:checked');
    if (!methodInput) { warn('CLICK FAIL travel method not selected'); return; }

    log('CLICK method detected', methodInput.value);

    const ocReady = match[methodInput.value]?.ocReadyBeforeBack;
    log('OC READY VALUE', ocReady);
    if (shouldBlock(ocReady) || !isUserInOC) disableActionButton(actionLabel, countryName, methodInput.value);
  };

  const handleMobileClick = event => {
    const root = getTravelRoot();
    if (!root) return;

    const button = event.target.closest('button');
    if (!button) { warn('MOBILE no button'); return; }

    const spans = [...button.querySelectorAll('span')];
    const texts = spans.map(s => s.textContent.trim());
    const countryName = texts.find(t => /^[A-Za-z\s]+$/.test(t));

    if (!countryName) { warn('MOBILE FAIL country not detected', texts); return; }
    log('MOBILE country detected', countryName);

    const parsed = getDataModel();
    if (!parsed) return;

    const match = parsed.destinations?.find(d => d.country.toLowerCase() === countryName.toLowerCase());
    if (!match) { warn('DATA FAIL destination missing', countryName); return; }

    for (const key of ['standard','airstrip','private','business']) {
      const ocReady = match[key]?.ocReadyBeforeBack;
      log('MOBILE method check', key, ocReady);
      if (shouldBlock(ocReady) || !isUserInOC) { disableActionButton('Continue', countryName, key); return; }
    }
  };

  const setupClickInterceptor = () => {
    document.body.addEventListener('click', e => {
      if (!isEnabled) { log('CLICK ignored script disabled'); return; }
      isMobileView ? handleMobileClick(e) : handleDesktopClick(e);
    });
    log('CLICK interceptor installed');
  };

  const init = async () => {
    await updateOCStatus();
    injectToggle();
    setupClickInterceptor();
    log('BOOT COMPLETE', (performance.now() - BOOT_TS).toFixed(1) + 'ms');
  };

  const observer = new MutationObserver(() => injectToggle());
  observer.observe(document.body, { childList: true, subtree: true });
  log('MUTATION observer active');

  init();
})();