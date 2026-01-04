// ==UserScript==
// @name         CRYSTAL's PAWS Bank Request
// @version      1.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      discord.com
// @icon         https://raw.githubusercontent.com/Crystallized22/torn-assets/main/paw-icon.png
// @namespace    https://greasyfork.org/users/1514317
// @description  Paws Bank Request
// @downloadURL https://update.greasyfork.org/scripts/555797/CRYSTAL%27s%20PAWS%20Bank%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/555797/CRYSTAL%27s%20PAWS%20Bank%20Request.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0YpDbCQYrYzfV-nnGTwDNkWz4Hui7UoM7ncME8sUPAWtvl9f3cs3c7rjzRmlF1IjvNg/exec";

  GM_addStyle(`
    /* overall box */
    ul.settings-menu li#faction-req-wrap { max-width:130px !important; }
    #faction-req-wrap { background:#333; color:#CCC; padding:6px 6px 6px 6px; border-radius:6px; max-width:130px; font-size:12px; font-family:Arial, sans-serif; }
    /* heading */
    #faction-req-wrap .heading { color:#ff69b4; font-weight:700; text-align:center; font-size:12px; margin:0 0 6px 0; }
    /* check balance button (small) */
    #faction-req-check { width:100%; padding:4px; border-radius:6px; border:none; background:#bbb; color:#000; font-weight:700; font-size:11px; margin-bottom:6px; cursor:pointer; box-sizing:border-box; }
    /* balance text (hidden until set) */
    #faction-req-balance { display:none; text-align:center; font-size:11px; color:#ddd; margin-bottom:6px; }
    /* amount */
    #faction-req-amount { width:100%; padding:5px; border-radius:6px; border:1px solid #444; background:#222; color:#CCC; font-size:12px; text-align:center; margin-bottom:6px; box-sizing:border-box; }
    /* checkbox row */
    #faction-req-row { display:flex; align-items:center; justify-content:flex-start; gap:6px; margin-bottom:8px; }
    #faction-req-row label { font-size:11px; color:#CCC; margin:0; display:flex; align-items:center; gap:6px; }
    #faction-req-row input[type="checkbox"] { width:14px; height:14px; margin:0; }
    /* request button (primary) */
    #faction-req-request { width:100%; padding:6px; border-radius:6px; border:none; background:#ff69b4; color:#fff; font-weight:700; font-size:12px; cursor:pointer; box-sizing:border-box; }
    /* response line */
    #faction-req-response { font-size:11px; text-align:center; word-break:break-word; min-height:14px; margin-top:6px; color:#00ff99; }
  `);

  const targetNode = document.getElementById('header-root');
  let injected = false;

  function parseAmount(input) {
    if (input === null || input === undefined) return null;
    input = String(input).replace(/[$,]/g, '').trim().toLowerCase();
    if (input === '') return null;
    const suffix = input.slice(-1);
    let multiplier = 1;
    if (suffix === 'k') { multiplier = 1e3; input = input.slice(0, -1); }
    else if (suffix === 'm') { multiplier = 1e6; input = input.slice(0, -1); }
    else if (suffix === 'b') { multiplier = 1e9; input = input.slice(0, -1); }
    else if (suffix === 't') { multiplier = 1e12; input = input.slice(0, -1); }
    const base = Number(input);
    if (isNaN(base)) return null;
    return Math.floor(base * multiplier);
  }

  function formatNumber(n) { return Number(n).toLocaleString(); }

  function gmGetJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(res) {
          try {
            const json = JSON.parse(res.responseText);
            resolve(json);
          } catch (e) { reject(e); }
        },
        onerror: function(err) { reject(err); }
      });
    });
  }

  function showMessage(text, ok = true) {
    let el = document.getElementById('faction-req-response');
    if (!el) {
      const wrap = document.getElementById('faction-req-wrap');
      el = document.createElement('div');
      el.id = 'faction-req-response';
      wrap.appendChild(el);
    }
    el.style.color = ok ? '#00ff99' : '#ff5555';
    el.innerHTML = (text || '').toString().replace(/\n/g, '<br>');
  }

  function readChatData() {
    const el = document.querySelector('div#websocketConnectionData');
    if (!el) return null;
    try {
      const d = JSON.parse(el.textContent);
      return { id: d.userID, name: d.playername };
    } catch {
      return null;
    }
  }

  function insertUI() {
    if (injected) return;
    const container = document.querySelector('ul.settings-menu');
    if (!container) return;

    container.insertAdjacentHTML('beforeend', `
<li class="server-info" id="faction-req-wrap">
  <div class="heading">PAWS Bank Request</div>
  <button id="faction-req-check">Check Balance</button>
  <span id="faction-req-balance"></span>
  <input type="text" id="faction-req-amount" placeholder="Amount">
  <div id="faction-req-row"><label><input type="checkbox" id="faction-req-offline">Send While Offline?</label></div>
  <button id="faction-req-request">Request</button>
</li>
    `.trim());

    injected = true;

    const amountEl = document.getElementById('faction-req-amount');
    const offlineEl = document.getElementById('faction-req-offline');
    const checkBtn = document.getElementById('faction-req-check');
    const reqBtn = document.getElementById('faction-req-request');
    const balanceSpan = document.getElementById('faction-req-balance');

    let cachedBalance = null;
    let cachedUser = null;

    // watch for websocketConnectionData to get user info
    const observer = new MutationObserver(() => {
      const u = readChatData();
      if (u) { cachedUser = u; observer.disconnect(); }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    async function doCheckBalance(showErrors = true) {
      const u = readChatData() || cachedUser;
      if (!u || !u.id) {
        if (showErrors) showMessage('Could not detect Torn user info.', false);
        return null;
      }
      try {
        showMessage('Checking balance...', true);
        const url = `${WEB_APP_URL}?action=checkBalance&userId=${encodeURIComponent(u.id)}`;
        const res = await gmGetJson(url);
        if (!res || !res.success) {
          if (showErrors) showMessage(res && res.message ? res.message : 'Member not found in PAWS.', false);
          balanceSpan.textContent = '';
          balanceSpan.style.display = 'none';
          cachedBalance = null;
          return null;
        }
        cachedBalance = Number(res.balance);
        balanceSpan.textContent = `Current Balance: $${formatNumber(cachedBalance)}`;
        balanceSpan.style.display = 'block';
        showMessage('', true);
        return cachedBalance;
      } catch (err) {
        if (showErrors) showMessage('Error connecting to service.', false);
        balanceSpan.textContent = '';
        balanceSpan.style.display = 'none';
        return null;
      }
    }

    checkBtn.addEventListener('click', () => doCheckBalance(true));

    reqBtn.addEventListener('click', async () => {
      const u = readChatData() || cachedUser;
      if (!u || !u.id) { showMessage('Could not detect Torn user info.', false); return; }

      const amount = parseAmount(amountEl.value);
      if (!amount || amount <= 0) { showMessage('Invalid amount.', false); return; }

      // fresh balance check before sending
      const bal = await doCheckBalance(true);
      if (bal === null) return;
      if (amount > bal) { showMessage('Amount exceeds your faction balance.', false); return; }

      const offline = offlineEl.checked;

      try {
        showMessage('Sending request...', true);
        const reqUrl = `${WEB_APP_URL}?action=request&userId=${encodeURIComponent(u.id)}&amount=${encodeURIComponent(amount)}&offline=${encodeURIComponent(offline)}`;
        const resp = await gmGetJson(reqUrl);
        if (!resp || !resp.success) { showMessage(resp && resp.message ? resp.message : 'Error sending request.', false); return; }
        if (offline) showMessage('Request sent successfully!', true);
        else showMessage('Request sent successfully!<br>If not fulfilled within a few hours, please request again.', true);
        amountEl.value = ''; offlineEl.checked = false;
        // update local cached balance
        cachedBalance = bal - amount;
        if (cachedBalance >= 0) {
          balanceSpan.textContent = `Current Balance: $${formatNumber(cachedBalance)}`;
          balanceSpan.style.display = 'block';
        } else {
          balanceSpan.textContent = '';
          balanceSpan.style.display = 'none';
        }
      } catch {
        showMessage('Error connecting to service.', false);
      }
    });
  }

  // insert immediately if possible, otherwise wait for the settings menu
  const containerNow = document.querySelector('ul.settings-menu');
  if (containerNow) insertUI();
  else {
    const mo = new MutationObserver((mutations, o) => {
      if (document.querySelector('ul.settings-menu')) { insertUI(); o.disconnect(); }
    });
    mo.observe(targetNode, { childList: true, subtree: true });
  }

})();
