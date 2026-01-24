// ==UserScript==
// @name        Win 11 ISO Downloader
// @namespace   danielytuk/MSISODL
// @version     1.0.2
// @description Download official Microsoft Windows 11 ISO files even when VPN, firewalls, or restricted corporate networks block Microsoft’s own downloads.
// @author      danielytuk
// @license     Unlicense
// @match       https://www.microsoft.com/*/software-download/windows*
// @homepageURL https://github.com/danielytuk/UserScripts
// @supportURL  https://github.com/danielytuk/UserScripts/Issues
// @icon        https://www.microsoft.com/favicon.ico
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/563789/Win%2011%20ISO%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563789/Win%2011%20ISO%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG_PREFIX = '[MSDL userscript]';
  const MSDL_BASE = 'https://api.gravesoft.dev/msdl';

  function normalizeName(str) {
    return (str || '')
      .toString()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function warn(...args) {
    console.warn(LOG_PREFIX, ...args);
  }

  function error(...args) {
    console.error(LOG_PREFIX, ...args);
  }


  // Fetch SKU info for a given product ID.
  async function getSkuInfo(productId) {
    if (!productId) {
      return null;
    }

    const url = `${MSDL_BASE}/skuinfo?product_id=${encodeURIComponent(productId)}`;

    try {
      const resp = await fetch(url);

      if (!resp.ok) {
        error('SKU info request failed with status', resp.status, 'for product', productId);
        return null;
      }

      const data = await resp.json();
      const skus = (data && data.Skus) || [];
      const byId = Object.create(null);

      skus.forEach((sku) => {
        if (!sku || !sku.Id) return;
        byId[String(sku.Id)] = sku;
      });

      return { all: skus, byId };
    } catch (e) {
      error('Failed to fetch skuinfo for product', productId, e);
      return null;
    }
  }

  // Call the Gravesoft proxy for a specific product and SKU.
  async function fetchProxyData(productId, skuId) {
    const proxyUrl = `${MSDL_BASE}/proxy?product_id=${encodeURIComponent(
      productId
    )}&sku_id=${encodeURIComponent(skuId)}`;

    log('Calling Gravesoft proxy:', proxyUrl);

    try {
      const proxyResp = await fetch(proxyUrl);

      if (!proxyResp.ok) {
        error('Gravesoft proxy request failed with status', proxyResp.status);
        return null;
      }

      const proxyData = await proxyResp.json();
      return proxyData || null;
    } catch (e) {
      error('Failed to call Gravesoft proxy:', e);
      return null;
    }
  }

  // Try to guess architecture (x64/x32) from URL or name.
  function detectArchFromUriOrName(uri, name) {
    const combined = `${uri || ''} ${name || ''}`;

    if (/x64\.iso/i.test(combined) || /\b64[-\s]?bit\b/i.test(combined) || /\b64 ?bits?\b/i.test(combined)) {
      return 'x64';
    }

    if (
      /x32\.iso/i.test(combined) ||
      /\b32[-\s]?bit\b/i.test(combined) ||
      /\b32 ?bits?\b/i.test(combined) ||
      /\bx86\b/i.test(combined)
    ) {
      return 'x32';
    }

    return 'unknown';
  }

  // Trigger a browser download for the given URL. Falls back to window.location on failure.
  function triggerDownload(url) {
    if (!url) {
      error('triggerDownload called with empty URL');
      return;
    }

    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.rel = 'noopener';
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      error('Failed to trigger download via anchor, falling back to window.location:', e);
      try {
        window.location.href = url;
      } catch (ignored) {
        // Swallow
      }
    }
  }
  
  // Pick the "best" SKU from skuinfo given the selected language info.
  // Prefers: Exact ID match / Best language match / First entry as fallback
  function pickBestSkuFromSkuinfo(langInfo, skuinfo) {
    if (!skuinfo || !Array.isArray(skuinfo.all) || skuinfo.all.length === 0) {
      return null;
    }

    const targetSkuId =
      langInfo && (langInfo.id || langInfo.sku || langInfo.SKU || langInfo.Id);
    const targetLanguage = normalizeName(langInfo && langInfo.language);

    // 1) Exact ID match if present
    if (targetSkuId && skuinfo.byId[String(targetSkuId)]) {
      log('Found exact SKU id match in skuinfo:', targetSkuId);
      return skuinfo.byId[String(targetSkuId)];
    }

    // 2) Language-based match
    let best = null;
    let bestScore = -1;

    skuinfo.all.forEach((sku) => {
      if (!sku) return;

      const lang1 = normalizeName(sku.Language);
      const lang2 = normalizeName(sku.LocalizedLanguage);
      let score = 0;

      if (targetLanguage && lang1 && targetLanguage === lang1) score += 10;
      if (targetLanguage && lang2 && targetLanguage === lang2) score += 10;

      if (score > bestScore) {
        bestScore = score;
        best = sku;
      }
    });

    if (best) {
      log('Selected SKU by language match from skuinfo:', best.Id);
      return best;
    }

    // 3) Fallback to first entry
    warn('No good SKU match found in skuinfo, using first entry as fallback');
    return skuinfo.all[0];
  }

  // Given a list of ProductDownloadOptions, pick the best one based on architecture.
  // Rules: If only 64-bit options, pick first 64-bit. If only 32-bit options, pick first 32-bit. If both 64-bit and 32-bit options, ask the user. If all unknown, pick the first option.
  function chooseDownloadOption(options) {
    if (!Array.isArray(options) || options.length === 0) {
      return null;
    }
    if (options.length === 1) {
      return options[0];
    }

    const x64 = [];
    const x32 = [];
    const unknown = [];

    options.forEach((opt) => {
      if (!opt) return;

      const name = opt.Name || opt.LocalizedProductDisplayName;
      const arch = detectArchFromUriOrName(opt.Uri, name);

      if (arch === 'x64') {
        x64.push(opt);
      } else if (arch === 'x32') {
        x32.push(opt);
      } else {
        unknown.push(opt);
      }
    });

    // Prefer exact-arch buckets. If both present, ask the user.
    if (x64.length && !x32.length) return x64[0];
    if (!x64.length && x32.length) return x32[0];

    if (x64.length && x32.length) {
      const use64 = window.confirm(
        `${LOG_PREFIX} Two ISOs are available.\n\n` +
          'OK = Download 64-bit (x64)\nCancel = Download 32-bit (x32)'
      );
      return use64 ? x64[0] : x32[0];
    }

    // If we get here, everything is "unknown" – just use the first.
    return options[0];
  }

  async function handleSubmitSkuClick(event) {
    // We deliberately do NOT call event.preventDefault / stopPropagation.
    log('submit-sku clicked, starting Gravesoft flow');

    const productSelect = document.querySelector('#product-edition');
    const langSelect = document.querySelector('#product-languages');

    if (!productSelect || !langSelect) {
      warn('Could not find #product-edition or #product-languages elements');
      return;
    }

    const productId = productSelect.value;
    const langRaw = langSelect.value;

    if (!productId) {
      warn('product-edition has no value, aborting Gravesoft flow');
      return;
    }

    // Parse language selection (expected to be JSON, but fall back to simple object)
    let langInfo = null;

    try {
      langInfo = langRaw ? JSON.parse(langRaw) : null;
    } catch (e) {
      warn('Failed to parse #product-languages value as JSON, raw value:', langRaw);
      langInfo = { id: langRaw, language: null };
    }

    const skuIdFromPage =
      langInfo && (langInfo.id || langInfo.sku || langInfo.SKU || langInfo.Id);

    log('Page selection:', {
      productId,
      langInfo,
      skuIdFromPage
    });

    try {
      // 1) Fetch skuinfo to validate / refine SKU, if available
      const skuinfo = await getSkuInfo(productId);
      const chosenSku = pickBestSkuFromSkuinfo(langInfo, skuinfo) || { Id: skuIdFromPage };
      const finalSkuId = chosenSku && (chosenSku.Id || skuIdFromPage);

      if (!finalSkuId) {
        error('No SKU id available for Gravesoft proxy, aborting');
        return;
      }

      // 2) Call Gravesoft proxy with the (productId, finalSkuId)
      const proxyData = await fetchProxyData(productId, finalSkuId);
      if (!proxyData) {
        error('Gravesoft proxy returned no data');
        return;
      }

      const options = proxyData.ProductDownloadOptions || [];
      if (!Array.isArray(options) || options.length === 0) {
        error('Gravesoft proxy returned no ProductDownloadOptions');
        return;
      }

      const chosenOption = chooseDownloadOption(options);
      if (!chosenOption || !chosenOption.Uri) {
        error('Could not determine which ProductDownloadOption to use');
        return;
      }

      log('Starting ISO download from Gravesoft-mapped Uri:', {
        uri: chosenOption.Uri,
        name: chosenOption.Name,
        productDisplayName: chosenOption.ProductDisplayName,
        language: chosenOption.Language,
        localizedProductDisplayName: chosenOption.LocalizedProductDisplayName
      });

      triggerDownload(chosenOption.Uri);
    } catch (e) {
      error('Unexpected error in submit-sku handler:', e);
    }
  }

  function attachSubmitListenerIfReady() {
    const btn = document.querySelector('#submit-sku');
    if (!btn) {
      return false;
    }

    if (!btn.__msdl_gravesoft_bound) {
      btn.addEventListener('click', handleSubmitSkuClick, false);
      btn.__msdl_gravesoft_bound = true;
      log('Attached click listener to #submit-sku');
    }

    return true;
  }

  function setupListeners() {
    // Try immediately (if the button already exists)
    attachSubmitListenerIfReady();

    // Also observe DOM changes in case the button is added later
    const obs = new MutationObserver(() => {
      attachSubmitListenerIfReady();
    });

    const target = document.documentElement || document.body;
    if (!target) {
      warn('No document root available for MutationObserver');
      return;
    }

    obs.observe(target, {
      childList: true,
      subtree: true
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupListeners, { once: true });
  } else {
    setupListeners();
  }

  log('Initialized (button + arch-aware Gravesoft ISO downloader)');

})();