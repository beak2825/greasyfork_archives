// ==UserScript==
// @name         Torn Dump Enhancer Pro
// @namespace    https://greasyfork.org/en/users/YOURNAME
// @version      2.1.0
// @description  Enhanced dump interface with instant item display and real market prices
// @author       Sensimillia
// @match        https://www.torn.com/dump.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554925/Torn%20Dump%20Enhancer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554925/Torn%20Dump%20Enhancer%20Pro.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
  const log = (...a)=>console.log('[DumpEnhancer]',...a);

  // Get or prompt for API key
  let API_KEY = localStorage.getItem('tornDumpEnhancerApiKey');
  
  if (!API_KEY) {
    API_KEY = prompt('Please enter your Torn API key for market prices.\nYou only need to do this once.\n\nGet your API key from: Torn → Settings → API Key');
    if (API_KEY) {
      localStorage.setItem('tornDumpEnhancerApiKey', API_KEY);
      alert('API key saved! Refresh the page to start using market prices.');
    }
  }

  // Item rarity estimates
  const RARITY_HINTS = {
    'Plushie': { rarity: 'Common', color: '#8a8a8a' },
    'Flower': { rarity: 'Common', color: '#8a8a8a' },
    'Book': { rarity: 'Uncommon', color: '#4a9eff' },
    'Temporary': { rarity: 'Uncommon', color: '#4a9eff' },
    'Drug': { rarity: 'Rare', color: '#b84aff' },
    'Enhancer': { rarity: 'Rare', color: '#b84aff' },
    'Supply Pack': { rarity: 'Very Rare', color: '#ffa500' },
    'Collectible': { rarity: 'Very Rare', color: '#ffa500' }
  };
 
  function initEnhancer() {
    if (!window.getAction) {
      log('getAction not yet loaded, retrying...');
      return setTimeout(initEnhancer, 1000);
    }

    // Inject styles
    injectStyles();
 
    // Preserve original
    const orig = window.getAction;
    window.getAction = function(opts) {
      const wrapped = Object.assign({}, opts);
 
      // Wrap success handler
      if (typeof opts.success === 'function') {
        wrapped.success = async function(respText) {
          try {
            const msg = JSON.parse(respText);
            if (msg && msg.success && msg.item) {
              const { id, name, glowClass } = msg.item;
              const donorMatch = msg.text.match(/href="profiles\.php\?XID=(\d+)">([^<]+)<\/a>/);
              const donor = donorMatch ? donorMatch[2] : 'Unknown';
 
              injectInfo({ id, name, glowClass, donor });
            }
          } catch (e) {
            // ignore parsing errors for non-JSON responses
          }
          return opts.success.apply(this, arguments);
        };
      }
 
      return orig.call(this, wrapped);
    };
 
    log('Hooked getAction successfully');
  }

  // Inject CSS
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .dump-enhancer-info {
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .dump-rarity-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        margin-left: 4px;
      }
      .dump-price-loading {
        display: inline-block;
        width: 50px;
        height: 10px;
        background: linear-gradient(90deg, rgba(74,255,74,0.3) 0%, rgba(74,255,74,0.6) 50%, rgba(74,255,74,0.3) 100%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 2px;
        vertical-align: middle;
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Get rarity info
  function getRarityInfo(name) {
    for (const [keyword, info] of Object.entries(RARITY_HINTS)) {
      if (name.includes(keyword)) return info;
    }
    return { rarity: 'Unknown', color: '#666' };
  }

  // Format currency
  function formatCurrency(value) {
    if (!value) return 'N/A';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  }

  // Fetch market price from Torn API
  async function fetchMarketPrice(itemId) {
    if (!API_KEY) return null;

    try {
      const response = await fetch(`https://api.torn.com/torn/${itemId}?selections=items&key=${API_KEY}`);
      const data = await response.json();
      
      if (data.error) {
        log('API Error:', data.error);
        if (data.error.code === 2) {
          // Invalid API key
          localStorage.removeItem('tornDumpEnhancerApiKey');
          alert('Invalid API key. Please refresh and enter a valid key.');
        }
        return null;
      }

      if (data.items && data.items[itemId]) {
        return data.items[itemId].market_value || null;
      }

      return null;
    } catch (e) {
      log('Error fetching market price:', e);
      return null;
    }
  }
 
  // --- UI injection ---
  async function injectInfo(data) {
    const dumpMain = document.querySelector('.dump-main-page');
    if (!dumpMain) return;
    let panel = dumpMain.querySelector('.dump-enhancer-info');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'dump-enhancer-info';
      panel.style.cssText = `
        margin-top:8px;padding:8px 10px;border-radius:8px;
        background:rgba(0,0,0,0.45);color:#fff;font-size:13px;line-height:1.4;
      `;
      dumpMain.appendChild(panel);
    }
 
    const time = new Date().toLocaleTimeString();
    const img = `https://www.torn.com/images/items/${data.id}/large.png`;
    const rarityInfo = getRarityInfo(data.name);
    
    // Initial render with loading
    panel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${img}" style="width:40px;height:40px;border-radius:4px;">
        <div style="flex:1;">
          <div style="font-weight:600;color:${data.glowClass ? '#0ff':'#fff'}">
            ${data.name}
            <span class="dump-rarity-badge" style="background:${rarityInfo.color}">${rarityInfo.rarity}</span>
          </div>
          <div style="font-size:11px;opacity:0.85;">
            Dropped by <span style="color:#aef;">${data.donor}</span>
          </div>
          <div style="font-size:10px;opacity:0.6;margin-top:2px;">
            ⏱ ${time} • 💰 <span class="dump-price-loading"></span>
          </div>
        </div>
      </div>`;

    // Fetch real market price
    const marketPrice = await fetchMarketPrice(data.id);
    
    // Update with actual price
    const priceElement = panel.querySelector('.dump-price-loading');
    if (priceElement) {
      if (marketPrice) {
        priceElement.outerHTML = `<span style="color:#4aff4a;font-weight:600;">${formatCurrency(marketPrice)}</span>`;
      } else {
        priceElement.outerHTML = `<span style="opacity:0.5;">Price N/A</span>`;
      }
    }
  }
 
  // Wait until Torn has defined getAction
  initEnhancer();
})();