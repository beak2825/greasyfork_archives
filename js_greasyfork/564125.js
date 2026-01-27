// ==UserScript==
// @name         WoJ: Torn Quick Deposit (Property Vault ONLY)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick deposit ALL cash to Property Vault only (button + hotkey)
// @author       themcgarvie (WolfOfJedah [3317459])
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564125/WoJ%3A%20Torn%20Quick%20Deposit%20%28Property%20Vault%20ONLY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564125/WoJ%3A%20Torn%20Quick%20Deposit%20%28Property%20Vault%20ONLY%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // =============== CONFIG ===============
  const VAULT_KEY = "KeyV"; // Press V to deposit to property vault
  const PROPERTY_KEY_STORE = 'torn_quick_property_id';

  let currentBalance = 0;
  let isSending = false;
  let injectTimeout;

  // Torn uses rfc_v; some older flows used rfc_id. Support both.
  const getRfcv = () =>
    document.cookie.match(/(?:^|; )rfc_v=([^;]*)/)?.[1] ||
    document.cookie.match(/(?:^|; )rfc_id=([^;]*)/)?.[1];

  const getPropertyID = () => localStorage.getItem(PROPERTY_KEY_STORE);
  const savePropertyID = (id) => {
    if (id && /^\d+$/.test(String(id)) && localStorage.getItem(PROPERTY_KEY_STORE) !== String(id)) {
      localStorage.setItem(PROPERTY_KEY_STORE, String(id));
      safeInjectButton();
      showToast(`Property ID saved: <span style="color:#4dff4d">${id}</span>`);
    }
  };

  // =============== BALANCE TRACKING ===============
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    const url = args[0] ? args[0].toString() : '';
    if (url.includes('sidebar') || url.includes('user')) {
      try {
        const clone = response.clone();
        clone.json().then(data => {
          const money = data?.user?.money || data?.sidebarData?.user?.money;
          if (money) updateBalance(money);
        }).catch(() => {});
      } catch(e) {}
    }
    return response;
  };

  function updateBalance(rawMoney) {
    let val = rawMoney;
    if (typeof rawMoney === 'object' && rawMoney?.value) val = rawMoney.value;
    const num = parseInt(val);
    if (!isNaN(num)) currentBalance = num;
    if (currentBalance <= 0) isSending = false;
  }

  // =============== PROPERTY ID DISCOVERY ===============
  function scanPropertyForID() {
    if (!window.location.href.includes('properties.php')) return;

    // 1) URL has ?ID=123
    try {
      const u = new URL(window.location.href);
      const id = u.searchParams.get('ID');
      if (id) { savePropertyID(id); return; }
    } catch(e) {}

    // 2) Any property link like ...p=properties&ID=123
    try {
      const anchors = Array.from(document.querySelectorAll('a[href*="p=properties&ID="], a[href*="properties.php?step="]'));
      for (const a of anchors) {
        const m = a.href.match(/(?:\?|&)ID=(\d+)/);
        if (m && m[1]) { savePropertyID(m[1]); return; }
      }
    } catch(e) {}
  }

  // =============== CORE DEPOSIT (PROPERTY VAULT ONLY) ===============
  async function depositToPropertyVault() {
    if (isSending) return;

    const propertyID = getPropertyID();
    if (!propertyID) {
      showToast(`Open your property page once so I can learn your Property ID.`);
      return;
    }

    const rfcv = getRfcv();
    if (!rfcv) {
      showToast(`Missing RFC token (rfc_v). Try refreshing Torn.`);
      return;
    }

    if (!currentBalance || currentBalance <= 0) {
      showToast(`No cash to deposit.`);
      return;
    }

    isSending = true;
    showToast(`Depositing <span style="color:#4dff4d">$${currentBalance.toLocaleString('en-US')}</span> to Property Vault...`);

    try {
      // Known working request format:
      // POST properties.php?rfcv=...  body: step=vaultProperty&deposit=<amount>&ID=<propertyId>
      await fetch(`https://www.torn.com/properties.php?rfcv=${encodeURIComponent(rfcv)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `step=vaultProperty&deposit=${encodeURIComponent(String(currentBalance))}&ID=${encodeURIComponent(String(propertyID))}`
      }).catch(() => null);

      // Let balance update clear isSending via updateBalance; safety unlock:
      setTimeout(() => { isSending = false; }, 2500);
    } catch (e) {
      isSending = false;
      showToast(`Deposit failed (request error).`);
    }
  }

  // =============== UI ===============
  function safeInjectButton() {
    if (injectTimeout) clearTimeout(injectTimeout);
    injectTimeout = setTimeout(realInjectButton, 100);
  }

  function realInjectButton() {
    const moneyEl = document.getElementById('user-money');
    if (!moneyEl) return;

    let btn = document.getElementById('torn-property-vault-deposit');
    if (!btn) {
      btn = document.createElement('a');
      btn.id = 'torn-property-vault-deposit';
      btn.href = '#';
      btn.style.cssText = 'margin-left: 8px; cursor: pointer; color: #999; text-decoration: none; font-size: 11px;';
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        depositToPropertyVault();
      });
    }

    if (moneyEl.parentNode && moneyEl.nextSibling !== btn) {
      moneyEl.parentNode.insertBefore(btn, moneyEl.nextSibling);
    }

    const propertyID = getPropertyID();
    if (propertyID) {
      btn.innerText = '[vault]';
      btn.title = `Deposit ALL cash to Property Vault (V)\nProperty ID: ${propertyID}`;
      btn.style.display = '';
    } else {
      btn.innerText = '[vault?]';
      btn.title = `Open properties.php once so I can learn your Property ID`;
      btn.style.display = '';
    }
  }

  function showToast(html) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
      z-index: 2147483647; background: rgba(0, 0, 0, 0.85); color: white;
      font-family: Arial, sans-serif; font-size: 14px; font-weight: bold;
      padding: 10px 18px; border-radius: 8px; pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      opacity: 0; transition: opacity 0.2s ease-in-out;
      text-align: center; border: 1px solid rgba(255,255,255,0.2);
    `;
    toast.innerHTML = html;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.style.opacity = '1');
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 1600);
  }

  // =============== HOTKEY ===============
  function handleKey(e) {
    if (!e.isTrusted) return;
    if (e.repeat) return;

    const tag = document.activeElement?.tagName?.toLowerCase?.() || '';
    if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;

    if (e.code === VAULT_KEY) {
      e.preventDefault();
      depositToPropertyVault();
    }
  }

  // =============== INIT ===============
  function init() {
    // try initial balance if present
    try {
      const moneyEl = document.getElementById('user-money');
      const dm = moneyEl?.getAttribute?.('data-money');
      if (dm) updateBalance(dm);
    } catch(e) {}

    const observer = new MutationObserver(() => {
      safeInjectButton();
      scanPropertyForID();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      safeInjectButton();
      scanPropertyForID();
      window.addEventListener('keydown', handleKey, true);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
