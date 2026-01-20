// ==UserScript==
// @name         Dexy's Easy Fight
// @namespace    dexterity.torn.easyfight.redux
// @version      1.0.2
// @description  Custom attack UI with Redux wiring
// @match        https://www.torn.com/loader.php*
// @author       Dexterity [3131335]
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563277/Dexy%27s%20Easy%20Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/563277/Dexy%27s%20Easy%20Fight.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* -------------------- state -------------------- */
  const state = {
    step: 'check',
    eligible: false,
    fightStarted: false,
    canFinish: false,
    store: null
  };

  const qs = sel => document.querySelector(sel);

  const waitFor = sel =>
    new Promise(resolve => {
      const i = setInterval(() => {
        const el = qs(sel);
        if (el) { clearInterval(i); resolve(el); }
      }, 50);
    });

  const setStatus = text => { const el = qs('#ef-status'); if (el) el.textContent = text; };
  const setButton = text => { const el = qs('#ef-action'); if (el) el.textContent = text; };
  const getUser2ID = () => new URLSearchParams(window.location.search).get('user2ID');

  /* -------------------- Redux store -------------------- */
  const locateStore = () => {
    if (state.store) return state.store;
    const weapon = qs('#weapon_main,#weapon_second,#weapon_melee');
    if (!weapon) return null;
    const fiberKey = Object.keys(weapon).find(k => k.startsWith('__reactFiber$'));
    if (!fiberKey) return null;
    let node = weapon[fiberKey];
    while (node) {
      if (node.memoizedProps?.store?.dispatch) {
        state.store = node.memoizedProps.store;
        console.log('[EasyFight] Redux store found!', state.store);
        return state.store;
      }
      node = node.return;
    }
    console.warn('[EasyFight] Redux store not found.');
    return null;
  };

  /* -------------------- UI -------------------- */
  const buildUI = anchor => {
    const wrap = document.createElement('div');
    wrap.id = 'easy-fight-ui';
    wrap.style.cssText = `
      margin-top: 10px;
      padding: 10px 12px;
      background: rgba(30,30,30,0.85);
      border-radius: 10px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 13px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #eee;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    wrap.innerHTML = `
      <select id="ef-finish" style="
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid #555;
        background: #222;
        color: #eee;
        cursor: pointer;
        font-size: 12px;
      ">
        <option value="mug">Mug</option>
        <option value="leave">Leave</option>
        <option value="hospitalize">Hospitalize</option>
      </select>

      <select id="ef-weapon" style="
        padding: 5px 8px;
        border-radius: 6px;
        border: 1px solid #555;
        background: #222;
        color: #eee;
        cursor: pointer;
        font-size: 12px;
      ">
        <option value="1">Primary</option>
        <option value="2">Secondary</option>
        <option value="3" selected>Melee</option>
      </select>

      <button id="ef-action" style="
        padding: 6px 14px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(145deg, #ff7a18, #af002d);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
      ">Check attack</button>

      <span id="ef-status" style="margin-left:8px; font-style: italic;"></span>
    `;

    const btn = wrap.querySelector('#ef-action');
    btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

    anchor.appendChild(wrap);
  };

  /* -------------------- eligibility -------------------- */
  const checkEligibility = async () => {
    setStatus('Checking...');
    state.eligible = false;

    const user2ID = getUser2ID();
    if (!user2ID) { setStatus('No target'); return; }

    const rfcv = Math.random().toString(16).slice(2);
    const url = `/loader.php?sid=attackData&mode=json&rfcv=${rfcv}`;

    let text;
    try {
      const res = await fetch(url, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams({ user2ID })
      });
      text = await res.text();
    } catch (e) { console.error(e); setStatus('Request failed'); return; }

    if (text.trim().startsWith('<')) { setButton('Check attack'); setStatus('Unavailable'); return; }

    let data;
    try { data = JSON.parse(text); } catch { setStatus('Bad response'); return; }

    const hasError = data.startErrorTitle || data.error || (data.DB && data.DB.error);
    if (!hasError) { state.eligible = true; state.step = 'start'; setButton('Start Fight'); setStatus('Ready'); }
    else { setButton('Check attack'); setStatus('Unavailable'); }
  };

  const getWeaponID = () => {
    const selected = qs('#ef-weapon')?.value;
    const map = { '1': 1, '2': 2, '3': 3 };
    return map[selected] || null;
  };

  /* -------------------- fight actions -------------------- */
  const startFight = () => {
    const store = locateStore();
    if (!store) { setStatus('Redux store missing'); return; }
    state.fightStarted = true;
    setStatus('Fight started. Click Attack.');
    state.step = 'attack';
    store.dispatch({ type: 'attack/fightStartAttempt' });
  };

  const attack = () => {
    const store = locateStore();
    if (!store) { setStatus('Redux store missing'); return; }
    const weaponID = getWeaponID();
    if (!weaponID) { setStatus('Weapon invalid'); return; }
    setStatus(`Attacking with weapon ID ${weaponID}...`);
    store.dispatch({ type: 'attack/attackStart', payload: { weaponID } });
  };

  const finishFight = () => {
    const finishType = qs('#ef-finish')?.value;
    if (!finishType) return;
    const modal = qs('.dialogButtons___nX4Bz');
    if (!modal) { setStatus('Finish modal not found'); return; }
    const button = Array.from(modal.querySelectorAll('button'))
      .find(btn => btn.textContent.toLowerCase() === finishType);
    if (button) { console.log(`[EasyFight] Selecting finish type: ${finishType}`); button.click(); state.step='check'; state.eligible=false; state.fightStarted=false; setButton('Check attack'); setStatus('Fight finished'); }
  };

  /* -------------------- observe fight result -------------------- */
const observeFightResult = () => {
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        const modal = node.querySelector?.('.dialogButtons___nX4Bz') || (node.classList?.contains('dialogButtons___nX4Bz') && node);
        if (modal) {
          state.canFinish = true;
          if (state.step !== 'finish') {
            state.step = 'finish';
            setButton('Finish Fight');
            setStatus('Fight finished! Click to select outcome.');
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

  /* -------------------- bind button -------------------- */
  const bindEvents = () => {
    qs('#ef-action').addEventListener('click', () => {
      switch (state.step) {
        case 'check': checkEligibility(); break;
        case 'start': startFight(); break;
        case 'attack': attack(); break;
        case 'finish': if(state.canFinish) finishFight(); break;
      }
    });
  };

  /* -------------------- init -------------------- */
  (async () => {
    const anchor = await waitFor('.playersModelWrap___dkqHO');
    buildUI(anchor);
    bindEvents();
    observeFightResult();
  })();

})();