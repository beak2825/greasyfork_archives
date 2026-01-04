// ==UserScript==
// @name         Ghost Trade Depo
// @namespace    https://mayhemhub.net/
// @version      1.0
// @description  Adds a “Deposit” button on trade header that deposits all on-hand cash into the current trade in one click (adds money -> max ($) -> Change), following Torn’s normal page flow without breaking ToS.
// @author       IAMAPEX [2523988]
// @match        https://www.torn.com/trade.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548193/Ghost%20Trade%20Depo.user.js
// @updateURL https://update.greasyfork.org/scripts/548193/Ghost%20Trade%20Depo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEPOSIT_EMOJI = '💸';
  const BTN_TITLE = 'Deposit';
  const HEADER_LIST_SELECTOR = '#top-page-links-list';
  const ADD_MONEY_LINK_SELECTOR = 'a[href*="#step=addmoney"]';
  const MAX_DOLLAR_BTN_SELECTOR = '.input-money-group .input-money-symbol input.wai-btn';
  const CHANGE_SUBMIT_SELECTOR = 'input.torn-btn[type="submit"][value="Change"]';
  const REFRESH_LINK_SELECTOR = 'a.refresh.t-clear.h.c-pointer.m-icon.line-h24.right.last';

  let depositFlowActive = false;

  function getHashParams() {
    const hash = (location.hash || '').replace(/^#/, '');
    const idx = hash.indexOf('?');
    const qs = idx >= 0 ? hash.slice(idx + 1) : hash.split('&').slice(1).join('&');
    const params = new URLSearchParams(qs);
    return params;
  }
  function getStep() {
    const hash = (location.hash || '').replace(/^#/, '');
    const match = hash.match(/(?:^|#|&)step=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }
  function getTradeIdFromUrl() {
    const params = getHashParams();
    const id = params.get('ID');
    return id ? id : null;
  }

  function waitForElm(selector, root = document, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const found = root.querySelector(selector);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root, { childList: true, subtree: true });
      if (timeoutMs > 0) {
        setTimeout(() => {
          try { obs.disconnect(); } catch {}
          reject(new Error('Timeout waiting for ' + selector));
        }, timeoutMs);
      }
    });
  }

  function ensureDepositButton() {
    const list = document.querySelector(HEADER_LIST_SELECTOR);
    if (!list) return;
    if (list.querySelector('a.apex-deposit-btn')) return;

    const a = document.createElement('a');
    a.className = 'apex-deposit-btn t-clear h c-pointer m-icon line-h24 right';
    a.setAttribute('aria-labelledby', 'deposit');
    a.setAttribute('role', 'button');
    a.style.display = 'flex';

    const iconWrap = document.createElement('span');
    iconWrap.className = 'icon-wrap svg-icon-wrap';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'link-icon-svg apex-deposit-icon';
    iconSpan.textContent = DEPOSIT_EMOJI;

    iconWrap.appendChild(iconSpan);
    a.appendChild(iconWrap);

    const textSpan = document.createElement('span');
    textSpan.id = 'deposit';
    textSpan.textContent = BTN_TITLE;
    a.appendChild(textSpan);

    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (depositFlowActive) return;
      const tradeId = getTradeIdFromUrl();
      if (!tradeId) {
        const addLink = document.querySelector(ADD_MONEY_LINK_SELECTOR);
        if (addLink) {
          depositFlowActive = true;
          addLink.click();
          return;
        }
        alert('Could not determine Trade ID.');
        return;
      }
      depositFlowActive = true;
      const addLink = document.querySelector(ADD_MONEY_LINK_SELECTOR);
      if (addLink) {
        addLink.click();
      } else {
        location.hash = `step=addmoney&ID=${encodeURIComponent(tradeId)}`;
      }
    });

    const refresh = list.querySelector(REFRESH_LINK_SELECTOR) || list.lastElementChild;
    if (refresh && refresh.parentElement === list) {
      list.insertBefore(a, refresh);
    } else {
      list.appendChild(a);
    }
  }

  async function tryPerformAddMoneyActions() {
    if (!depositFlowActive) return;
    const step = getStep();
    if (step !== 'addmoney') return;
    try {
      const dollarBtn = await waitForElm(MAX_DOLLAR_BTN_SELECTOR, document, 8000);
      setTimeout(() => {
        dollarBtn.click();
        setTimeout(async () => {
          try {
            const changeBtn = await waitForElm(CHANGE_SUBMIT_SELECTOR, document, 8000);
            changeBtn.click();
          } catch (e2) {
            console.warn('Deposit flow: could not find Change button:', e2);
            depositFlowActive = false;
          }
        }, 50);
      }, 30);
    } catch (e) {
      console.warn('Deposit flow: could not find $ (max) button:', e);
      depositFlowActive = false;
    }
  }

  const rootObserver = new MutationObserver(() => {
    ensureDepositButton();
    tryPerformAddMoneyActions();
    if (depositFlowActive && getStep() !== 'addmoney') {
      setTimeout(() => { depositFlowActive = false; }, 300);
    }
  });
  rootObserver.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('hashchange', () => {
    ensureDepositButton();
    tryPerformAddMoneyActions();
    if (depositFlowActive && getStep() !== 'addmoney') {
      setTimeout(() => { depositFlowActive = false; }, 300);
    }
  });

  ensureDepositButton();
  tryPerformAddMoneyActions();
})();
