// ==UserScript==
// @name         Dexy's Easy Fight
// @namespace    dexterity.torn.easyfight.redux
// @version      1.1.4
// @description  Custom attack UI with Redux wiring
// @match        https://www.torn.com/loader.php*
// @author       Dexterity [3131335]
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/563277/Dexy%27s%20Easy%20Fight.user.js
// @updateURL https://update.greasyfork.org/scripts/563277/Dexy%27s%20Easy%20Fight.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* -------------------- helpers -------------------- */
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const qs = sel => document.querySelector(sel);
  const waitFor = sel => new Promise(resolve => {
    const i = setInterval(() => {
      const el = qs(sel);
      if (el) { clearInterval(i); resolve(el); }
    }, 50);
  });

  /* -------------------- preferences -------------------- */
  const PREF_KEY = 'dexyEasyFightPrefs';
  const loadPrefs = () => {
    try { return JSON.parse(localStorage.getItem(PREF_KEY)) || {}; }
    catch { return {}; }
  };
  const savePrefs = prefs => { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); };

  /* -------------------- state -------------------- */
  const state = {
    step: 'check',
    eligible: false,
    fightStarted: false,
    canFinish: false,
    store: null,
    attackLocked: false,
    lastResultText: ''
  };
  const setStatus = t => qs('#ef-status') && (qs('#ef-status').textContent = t);
  const setButton = t => qs('#ef-action') && (qs('#ef-action').textContent = t);
  const lockButton = () => {
    const b = qs('#ef-action');
    if (!b) return;
    b.disabled = true;
    b.style.opacity = '0.6';
    b.style.cursor = 'not-allowed';
  };
  const unlockButton = () => {
    const b = qs('#ef-action');
    if (!b) return;
    b.disabled = false;
    b.style.opacity = '1';
    b.style.cursor = 'pointer';
  };
  const getUser2ID = () => new URLSearchParams(location.search).get('user2ID');

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
        console.log('[EasyFight] Redux store found');
        return state.store;
      }
      node = node.return;
    }
    return null;
  };

  /* -------------------- UI -------------------- */
  const buildUI = anchor => {
    const wrap = document.createElement('div');
    wrap.id = 'easy-fight-ui';
    wrap.style.cssText = `margin-top:10px; padding:10px 12px; background:rgba(30,30,30,.85); border-radius:10px; display:flex; gap:8px; align-items:center; font-size:13px; font-family:Segoe UI,Tahoma; color:#eee; box-shadow:0 4px 15px rgba(0,0,0,.3);`;
    wrap.innerHTML = `
      <select id="ef-finish" style="padding:5px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;">
        <option value="mug">Mug</option>
        <option value="leave">Leave</option>
        <option value="hospitalize">Hospitalize</option>
      </select>
      <select id="ef-weapon" style="padding:5px 8px;border-radius:6px;border:1px solid #555;background:#222;color:#eee;">
        <option value="1">Primary</option>
        <option value="2">Secondary</option>
        <option value="3">Melee</option>
      </select>
      <button id="ef-action" style="padding:6px 14px; border-radius:8px; border:none; background:linear-gradient(145deg,#ff7a18,#af002d); color:#fff; font-weight:bold; cursor:pointer; transition:.2s; box-shadow:0 3px 8px rgba(0,0,0,.4);">Check attack</button>
      <span id="ef-status" style="margin-left:8px;font-style:italic;"></span>
    `;
    anchor.appendChild(wrap);
    const btn = wrap.querySelector('#ef-action');
    btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';

    /* ---------- restore saved preferences ---------- */
    const prefs = loadPrefs();
    const finishSel = wrap.querySelector('#ef-finish');
    const weaponSel = wrap.querySelector('#ef-weapon');
    if (prefs.finish) finishSel.value = prefs.finish;
    else finishSel.value = 'mug';
    if (prefs.weapon) weaponSel.value = prefs.weapon;
    else weaponSel.value = '3'; // melee default

    /* ---------- save on change ---------- */
    finishSel.addEventListener('change', () => { savePrefs({ ...loadPrefs(), finish: finishSel.value }); });
    weaponSel.addEventListener('change', () => { savePrefs({ ...loadPrefs(), weapon: weaponSel.value }); });
  };

  /* -------------------- eligibility -------------------- */
  const checkEligibility = async () => {
    setStatus('Checking...');
    state.eligible = false;
    const user2ID = getUser2ID();
    if (!user2ID) return setStatus('No target');
    const url = `/loader.php?sid=attackData&mode=json&rfcv=${Math.random().toString(16).slice(2)}`;
    let text;
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With':'XMLHttpRequest'
        },
        body: new URLSearchParams({ user2ID })
      });
      text = await res.text();
    } catch { return setStatus('Request failed'); }
    if (text.trim().startsWith('<')) return setStatus('Unavailable');
    let data;
    try { data = JSON.parse(text); } catch { return setStatus('Bad response'); }
    if (!data.startErrorTitle && !data.error && !(data.DB && data.DB.error)) {
      state.eligible = true;
      state.step = 'start';
      setButton('Start Fight');
      setStatus('Ready');
    } else setStatus('Unavailable');
  };

  const getWeaponID = () => ({ '1':1,'2':2,'3':3 })[qs('#ef-weapon')?.value];

  /* -------------------- fight actions -------------------- */
  const startFight = () => {
    const store = locateStore();
    if (!store) return setStatus('Redux store missing');
    lockButton();
    setButton('Starting...');
    setStatus('Waiting for fight start...');
    store.dispatch({ type: 'attack/fightStartAttempt' });
    state.step = 'attack';
  };

  const attack = () => {
    if (state.attackLocked) return;
    const store = locateStore();
    const weaponID = getWeaponID();
    if (!store || !weaponID) return setStatus('Attack failed');
    state.attackLocked = true;
    lockButton();
    setStatus('Attacking...');
    store.dispatch({ type: 'attack/attackStart', payload: { weaponID } });
  };

  const finishFight = () => {
    const modal = qs('.dialogButtons___nX4Bz');
    if (!modal) return;
    const type = qs('#ef-finish').value;
    const btn = [...modal.querySelectorAll('button')].find(b => b.textContent.toLowerCase() === type);
    if (!btn) return;
    btn.click();
    state.step = 'check';
    state.attackLocked = false;
    setButton('Check attack');
    setStatus('Fight finished');
    unlockButton();
  };

  /* -------------------- observe fight start -------------------- */
const observeFightStart = () => {
  new MutationObserver(muts => {
    for (const m of muts) {
      if (m.target.classList?.contains('attackStarted___iMM2u')) {
        state.fightStarted = true;
        unlockButton();
        setButton('Attack');
        setStatus('Fight started');
      }
    }
  }).observe(document.body, { subtree: true, attributes: true });

  setTimeout(() => {
    if (state.step === 'start' && qs('#ef-action')?.disabled) {
      unlockButton();
      setStatus('Fight start timeout, button unlocked');
    }
  }, 1500);
};

  /* -------------------- observe per-hit results -------------------- */
const observeAttackResults = async () => {
  const resultBox = await waitFor('.result___VUCXY.box___CSVwz');
  let mutationSeen = false;

  new MutationObserver(() => {
    if (!state.attackLocked) return;
    if (mutationSeen) return;
    mutationSeen = true;
    setTimeout(() => {
      state.attackLocked = false;
      unlockButton();
      setStatus('Ready for next attack');
      mutationSeen = false;
    }, 80);
  }).observe(resultBox, { childList: true, subtree: true, characterData: true, attributes: true });


  setInterval(() => {
    if (state.attackLocked && qs('#ef-action')?.disabled) {
      state.attackLocked = false;
      unlockButton();
      setStatus('Attack timeout, button unlocked');
    }
  }, 1500);
};

  /* -------------------- observe finish modal -------------------- */
  const observeFightResult = () => {
    new MutationObserver(muts => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          const modal = n.querySelector?.('.dialogButtons___nX4Bz');
          if (!modal) continue;
          state.canFinish = true;
          state.step = 'finish';
          setButton('Finish Fight');
          setStatus('Select outcome');
          unlockButton();
        }
      }
    }).observe(document.body, { childList:true, subtree:true });
  };

  /* -------------------- bind -------------------- */
  const bindEvents = () => {
    qs('#ef-action').onclick = () => {
      if (state.step === 'check') checkEligibility();
      else if (state.step === 'start') startFight();
      else if (state.step === 'attack') attack();
      else if (state.step === 'finish' && state.canFinish) finishFight();
    };
  };

  /* -------------------- init -------------------- */
  (async () => {
    const anchor = await waitFor('.playersModelWrap___dkqHO');
    buildUI(anchor);
    bindEvents();
    observeFightStart();
    observeAttackResults();
    observeFightResult();
  })();

})();