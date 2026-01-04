// ==UserScript==
// @name         MWI → XP Planner
// @author       IgnantGaming
// @namespace    ignantgaming.mwi
// @version      1.2.0
// @description  Save combat-skill snapshots with tags; open them on your GitHub planner.
// @match        http://localhost:8080/*
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @match        https://ignantgaming.github.io/MWI_XP_Planner/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @license      CC-BY-NC-SA-4.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555252/MWI%20%E2%86%92%20XP%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/555252/MWI%20%E2%86%92%20XP%20Planner.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Keep in sync with userscript header @version
  const USERSCRIPT_VERSION = '1.2.0';

  /** ---------------- Config ---------------- */
  const PLANNER_URL = 'https://ignantgaming.github.io/MWI_XP_Planner/';
  //const PLANNER_URL = 'http://localhost:8080/';
  const SNAP_KEY = 'mwi:snapshots:v1'; // GM storage key for all snapshots
  const WANTED_HRIDS = new Set([
    '/skills/melee',
    '/skills/stamina',
    '/skills/defense',
    '/skills/intelligence',
    '/skills/ranged',
    '/skills/attack',
    '/skills/magic'
  ]);

  /** ---------------- Utilities ---------------- */
  const log = (...a) => console.log('[MWI->Planner]', ...a);
  const warn = (...a) => console.warn('[MWI->Planner]', ...a);

  function safeParse(str) {
    try {
      const x = JSON.parse(str);
      if (typeof x === 'string' && /^[\[{]/.test(x)) {
        try { return JSON.parse(x); } catch {}
      }
      return x;
    } catch { return null; }
  }
  function loadAll() { return GM_getValue(SNAP_KEY, { byTag: {} }); }
  function saveAll(obj) { GM_setValue(SNAP_KEY, obj); }
  function setSnapshot(tag, payload) { const all = loadAll(); all.byTag[tag] = payload; saveAll(all); }
  function getSnapshot(tag) { return loadAll().byTag[tag] || null; }
  function deleteSnapshot(tag) { const all = loadAll(); delete all.byTag[tag]; saveAll(all); }
  function listTags() { return Object.keys(loadAll().byTag).sort(); }

  function extractFromInitCharacterData() {
    const raw = localStorage.getItem('init_character_data');
    if (!raw) return null;
    const obj = safeParse(raw);
    if (!obj || !Array.isArray(obj.characterSkills)) return null;
    const wanted = obj.characterSkills.filter(s => WANTED_HRIDS.has(s.skillHrid));
    const meta = {
      characterID: obj.character?.id || null,
      characterName: obj.character?.name || null,
      timestamp: obj.currentTimestamp || obj.announcementTimestamp || new Date().toISOString(),
      // Include equipment snapshot directly from init_character_data for accuracy
      equipment: getEquipmentMeta()
    };
    return { wanted, meta };
  }
  function extractLegacyCharacterSkills() {
    const raw = localStorage.getItem('characterSkills');
    if (!raw) return null;
    const arr = safeParse(raw);
    if (!Array.isArray(arr)) return null;
    const wanted = arr.filter(s => WANTED_HRIDS.has(s.skillHrid));
    const meta = { characterID: null, characterName: null, timestamp: new Date().toISOString() };
    return { wanted, meta };
  }
  function buildPlannerUrlWithCs(arr) {
    return PLANNER_URL + '#cs=' + encodeURIComponent(JSON.stringify(arr));
  }

  // Live EXP/hour capture (via WS); fallback-friendly if Edible Tools is present
  const mwixpRates = { charmType: null, charmPerHour: null, totalPerHour: null, primaryPerHour: null, lastAt: 0 };
  let wsHooked = false;
  let currentCharId = null;
  let perSkillRates = {};
  const LIVE_CACHE_KEY = 'mwixp:liveRates:v1';
  function readLiveCache() { try { const t = localStorage.getItem(LIVE_CACHE_KEY); return t ? JSON.parse(t) : null; } catch { return null; } }
  function writeLiveCache(obj) { try { localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(obj)); } catch {} }
  // Sampler to derive rates even if WS parsing misses messages
  let samplerId = null;
  let lastSample = null; // { at: number, xp: { key->xp } }
  // Track last battle snapshot to compute deltas between battles
  let lastBattleStart = null; // Date
  let lastBattleTotals = null; // { skillKey -> total xp in series }
  function getCurrentCharId() {
    try {
      const raw = localStorage.getItem('init_character_data');
      const obj = raw ? JSON.parse(raw) : null;
      return obj?.character?.id || null;
    } catch { return null; }
  }
  function updateRatesFromBattle(obj) {
    if (!obj || !obj.combatStartTime || !Array.isArray(obj.players)) return;
    const nowStart = new Date(obj.combatStartTime);
    const myId = currentCharId || (currentCharId = getCurrentCharId());
    const me = obj.players.find(p => p?.character?.id === myId) || obj.players[0];
    if (!me || !me.totalSkillExperienceMap) return;
    const totals = me.totalSkillExperienceMap;

    // 1) Compute instantaneous rates within the current battle using totals/time since start
    const durationSec = Math.max(1, (Date.now() - nowStart.getTime()) / 1000);
    const instPerSkill = {};
    let instTotal = 0;
    for (const k in totals) {
      const key = k.replace('/skills/', '');
      const v = Number(totals[k] || 0);
      const ph = Math.max(0, Math.round((v * 3600) / durationSec));
      instPerSkill[key] = ph;
      instTotal += ph;
      // no-op
    }

    // 2) If we have a previous battle sample from the same series, blend with delta-based rates
    let usePerSkill = instPerSkill;
    if (lastBattleStart && lastBattleTotals && nowStart.getTime() === lastBattleStart.getTime()) {
      const dtSec = Math.max(1, (Date.now() - lastBattleStart.getTime()) / 1000);
      const nextPerSkill = {};
      let total = 0;
      for (const k in totals) {
        const key = k.replace('/skills/', '');
        const curr = Number(totals[k] || 0);
        const prev = Number(lastBattleTotals[k] || 0);
        const dx = Math.max(0, curr - prev);
        const perHour = Math.round(Math.max(0, (dx * 3600) / dtSec));
        nextPerSkill[key] = perHour;
        total += perHour;
        // no-op
      }
      // Blend: simple max of instantaneous vs delta to be robust
      const blended = {};
      const keys = new Set([...Object.keys(instPerSkill), ...Object.keys(nextPerSkill)]);
      keys.forEach((key) => { blended[key] = Math.max(instPerSkill[key] || 0, nextPerSkill[key] || 0); });
      usePerSkill = blended;
    }

    // Determine current charm skill/type
    let charmKey = null;
    let charmType = null;
    try {
      const focus = me?.combatDetails?.focusTraining; // '/skills/intelligence' when charm focuses Intelligence
      if (typeof focus === 'string' && focus.startsWith('/skills/')) {
        charmKey = focus.replace('/skills/', '');
      }
    } catch {}
    if (!charmKey) {
      const eq = getEquipmentMeta();
      charmType = eq?.charmTypeFromCharm || null;
      if (charmType) charmKey = charmType.toLowerCase() === 'range' ? 'ranged' : charmType.toLowerCase();
    }

    // Publish
    perSkillRates = usePerSkill;
    const totalPerHour = Object.values(usePerSkill).reduce((a, b) => a + (Number(b) || 0), 0);
    const charmPerHour = charmKey ? Number(usePerSkill[charmKey] || 0) : 0;
    const primaryPerHour = Math.max(0, Math.round(totalPerHour - charmPerHour));
    mwixpRates.totalPerHour = Math.round(totalPerHour);
    mwixpRates.primaryPerHour = primaryPerHour;
    mwixpRates.charmPerHour = Math.round(charmPerHour);
    mwixpRates.charmType = charmType || (charmKey ? (charmKey === 'ranged' ? 'Range' : charmKey.charAt(0).toUpperCase() + charmKey.slice(1)) : null);
    mwixpRates.lastAt = Date.now();
    if (mwixpRates.totalPerHour > 0) { const filtered = { attack:Number(perSkillRates.attack||0), defense:Number(perSkillRates.defense||0), intelligence:Number(perSkillRates.intelligence||0), stamina:Number(perSkillRates.stamina||0), magic:Number(perSkillRates.magic||0), ranged:Number(perSkillRates.ranged||0), melee:Number(perSkillRates.melee||0)}; writeLiveCache({ lastAt: mwixpRates.lastAt, totalPerHour: mwixpRates.totalPerHour, primaryPerHour: mwixpRates.primaryPerHour, charmPerHour: mwixpRates.charmPerHour, charmType: mwixpRates.charmType, perSkill: filtered }); }

    // Track last sample (per battle series)
    lastBattleStart = nowStart;
    lastBattleTotals = {};
    for (const k in totals) lastBattleTotals[k] = Number(totals[k] || 0);
  }

  function readCurrentSkillXpFromInit() {
    try {
      const raw = localStorage.getItem('init_character_data');
      if (!raw) return null;
      const o = JSON.parse(raw);
      const arr = Array.isArray(o?.characterSkills) ? o.characterSkills : null;
      if (!arr) return null;
      const map = Object.create(null);
      for (const s of arr) {
        if (!s || !s.skillHrid) continue;
        const hrid = String(s.skillHrid); if (!WANTED_HRIDS.has(hrid)) continue; const key = hrid.replace('/skills/', ''); map[key] = Number(s.experience || 0);
      }
      return map;
    } catch { return null; }
  }
  function startSampler() {
    if (samplerId) return;
    samplerId = setInterval(() => {
      const now = Date.now();
      const curr = readCurrentSkillXpFromInit();
      if (!curr) return;
      if (lastSample && lastSample.at && lastSample.xp) {
        const dt = Math.max(1, (now - lastSample.at) / 1000);
        const next = {};
        let total = 0;
        for (const k in curr) {
          const prev = Number(lastSample.xp[k] || 0);
          const dx = Math.max(0, Number(curr[k] || 0) - prev);
          const ph = Math.max(0, Math.round((dx * 3600) / dt));
          next[k] = ph;
          total += ph;
        }
        perSkillRates = next;
        // Determine charm from equipment if possible
        let charmKey = null;
        let charmType = null;
        try {
          const eq = getEquipmentMeta();
          charmType = eq?.charmTypeFromCharm || null;
          if (charmType) charmKey = charmType.toLowerCase() === 'range' ? 'ranged' : charmType.toLowerCase();
        } catch {}
        const charmPerHour = charmKey ? Number(next[charmKey] || 0) : 0;
        const totalPerHour = Math.max(0, Math.round(total));
        const primaryPerHour = Math.max(0, totalPerHour - charmPerHour);
        mwixpRates.totalPerHour = totalPerHour;
        mwixpRates.primaryPerHour = primaryPerHour;
        mwixpRates.charmPerHour = Math.round(charmPerHour);
        mwixpRates.charmType = charmType || (charmKey ? (charmKey === 'ranged' ? 'Range' : charmKey.charAt(0).toUpperCase() + charmKey.slice(1)) : null);
        mwixpRates.lastAt = now;
        if (mwixpRates.totalPerHour > 0) { const filtered = { attack:Number(perSkillRates.attack||0), defense:Number(perSkillRates.defense||0), intelligence:Number(perSkillRates.intelligence||0), stamina:Number(perSkillRates.stamina||0), magic:Number(perSkillRates.magic||0), ranged:Number(perSkillRates.ranged||0), melee:Number(perSkillRates.melee||0)}; writeLiveCache({ lastAt: mwixpRates.lastAt, totalPerHour: mwixpRates.totalPerHour, primaryPerHour: mwixpRates.primaryPerHour, charmPerHour: mwixpRates.charmPerHour, charmType: mwixpRates.charmType, perSkill: filtered }); }
      }
      lastSample = { at: now, xp: curr };
    }, 15000);
  }
function hookWebSocketOnce() {
    if (wsHooked || typeof WebSocket === 'undefined') return;
    wsHooked = true;
    const NativeWS = WebSocket;

    function processObj(o) {
      try {
        if (!o) return;
        if (o.type === 'init_character_data') {
          currentCharId = o?.character?.id || currentCharId;
        }
        if (o.combatStartTime && Array.isArray(o.players)) {
          updateRatesFromBattle(o);
        }
        if (o.type === 'new_battle') {
          if (o.players && o.combatStartTime) updateRatesFromBattle(o);
        }
      } catch {}
    }

    function handleMessageEvent(ev) {
      try {
        const d = ev && ev.data;
        if (!d) return;
        if (typeof d === 'string') {
          try { processObj(JSON.parse(d)); } catch {}
        } else if (typeof Blob !== 'undefined' && d instanceof Blob && d.text) {
          d.text().then(t => { try { processObj(JSON.parse(t)); } catch {} });
        } else if (d instanceof ArrayBuffer) {
          try { const t = new TextDecoder('utf-8').decode(new Uint8Array(d)); processObj(JSON.parse(t)); } catch {}
        } else if (typeof d === 'object') {
          // Some scripts rebind MessageEvent.data to a parsed object
          try { processObj(d); } catch {}
        }
      } catch {}
    }

    function installOn(ws) {
      if (!ws) return;
      const origAdd = ws.addEventListener.bind(ws);
      try { origAdd('message', handleMessageEvent); } catch {}
      ws.addEventListener = function(type, listener, options) {
        if (type === 'message') {
          const wrapped = function(ev) { try { handleMessageEvent(ev); } catch {} return listener && listener.call(this, ev); };
          return origAdd(type, wrapped, options);
        }
        return origAdd(type, listener, options);
      };
      let userHandler = null;
      try {
        Object.defineProperty(ws, 'onmessage', {
          configurable: true,
          enumerable: true,
          get() { return userHandler; },
          set(fn) {
            userHandler = fn;
            if (typeof fn === 'function') {
              const wrapped = function(ev) { try { handleMessageEvent(ev); } catch {} return fn.call(ws, ev); };
              origAdd('message', wrapped);
            }
          }
        });
      } catch {}
    }

    WebSocket = function(...args) {
      const ws = new NativeWS(...args);
      try { installOn(ws); } catch {}
      return ws;
    };
    WebSocket.prototype = NativeWS.prototype;
    WebSocket.prototype.constructor = WebSocket;

    try {
      if (window.__MWI_LAST_WS && window.__MWI_LAST_WS instanceof NativeWS) installOn(window.__MWI_LAST_WS);
    } catch {}
  }
  function getLiveRates() {
    hookWebSocketOnce();
    // Build a stable per-skill map with default zeros
    const keys = ['attack','defense','intelligence','stamina','magic','ranged','melee'];
    const per = Object.create(null);
    for (const k of keys) per[k] = Number(perSkillRates[k] || 0);
    return { ...mwixpRates, perSkill: per };
  }
  function buildPlannerUrlWithExport(arr, rates) {
    // Always embed an object payload so equipment is carried even when rates are missing.
    const payload = {
      skills: arr,
      meta: {
        scriptVersion: USERSCRIPT_VERSION,
        equipment: getEquipmentMeta(),
        rates: {}
      }
    };
      // Build meta.rates with per-skill and any aggregates if available
      const r = {};
      r.attack = perSkillRates.attack;
      r.defense = perSkillRates.defense;
      r.intelligence = perSkillRates.intelligence;
      r.stamina = perSkillRates.stamina;
      r.magic = perSkillRates.magic;
      r.ranged = perSkillRates.ranged;
      r.melee = perSkillRates.melee;
      const eq = getEquipmentMeta();
      const charmType = eq?.charmTypeFromCharm || null;
      const charmKey = charmType ? (charmType.toLowerCase() === 'range' ? 'ranged' : charmType.toLowerCase()) : null;
      if (rates) {
        if (Number.isFinite(rates.totalPerHour)) r.total = Math.max(0, Math.round(rates.totalPerHour));
        if (Number.isFinite(rates.primaryPerHour)) r.pRate = Math.max(0, Math.round(rates.primaryPerHour));
      }
      if (charmType) r.cType = charmType;
      if (charmKey && perSkillRates && perSkillRates[charmKey] != null) {
        r.cRate = Math.max(0, Math.round(Number(perSkillRates[charmKey] || 0)));
      }
      if (r.total == null) {
        r.total = Math.max(0, Math.round(
          ['attack','defense','intelligence','stamina','magic','ranged','melee']
            .reduce((a,k)=>a+(Number(perSkillRates[k]||0)),0)
        ));
      }
      if (r.pRate == null && r.cRate != null) {
        r.pRate = Math.max(0, r.total - r.cRate);
      }
      payload.meta.rates = r;
    return PLANNER_URL + '#cs=' + encodeURIComponent(JSON.stringify(payload));
  }

  // Equipment extraction from init_character_data
  function getEquipmentMeta() {
    try {
      const raw = localStorage.getItem('init_character_data');
      const obj = raw ? JSON.parse(raw) : null;
      if (!obj || typeof obj !== 'object') return null;

      // Gather character items from known shapes
      let items = [];
      if (Array.isArray(obj?.characterInfo?.characterItems)) {
        items = obj.characterInfo.characterItems.slice();
      } else if (Array.isArray(obj?.characterItems)) {
        // Top-level characterItems as seen in data.txt
        items = obj.characterItems.slice();
      } else if (obj?.characterItemMap && typeof obj.characterItemMap === 'object') {
        items = Object.values(obj.characterItemMap);
      } else if (Array.isArray(obj?.items)) {
        items = obj.items.slice();
      }

      const byLoc = Object.create(null);
      for (const it of items) {
        if (!it || typeof it !== 'object') continue;
        const loc = it.itemLocationHrid || it.item_location_hrid || it.locationHrid || it.location_hrid || it.location;
        if (!loc) continue;
        byLoc[loc] = it;
      }

      const main = byLoc['/item_locations/main_hand'] || null;
      const charm = byLoc['/item_locations/charm'] || null;
      const mainHrid = (main && (main.itemHrid || main.item_hrid || main.item?.hrid)) || null;
      const charmHrid = (charm && (charm.itemHrid || charm.item_hrid || charm.item?.hrid)) || null;
      const primary = derivePrimaryFromMain(mainHrid);
      const charmType = deriveCharmType(charmHrid);
      return {
        mainHand: { itemHrid: mainHrid },
        charm: { itemHrid: charmHrid },
        primaryClassFromMainHand: primary,
        charmTypeFromCharm: charmType
      };
    } catch { return null; }
  }
  function derivePrimaryFromMain(itemHrid) {
    if (!itemHrid || typeof itemHrid !== 'string') return null;
    const id = itemHrid.split('/').pop();
    const has = (s) => id.includes(s);
    if (has('gobo_boomstick') || /_trident$/.test(id) || /_trident_/.test(id) || /_staff$/.test(id) || /_staff_/.test(id)) return 'Magic';
    if (has('gobo_slasher') || has('gobo_smasher') || has('werewolf_slasher') || has('chaotic_flail') || has('granite_bludgeon') || /_mace$/.test(id) || /_mace_/.test(id) || /_sword$/.test(id) || /_sword_/.test(id)) return 'Melee';
    if (/_bulwark$/.test(id) || /_bulwark_/.test(id)) return 'Defense';
    if (has('gobo_stabber') || /_spear$/.test(id) || /_spear_/.test(id)) return 'Attack';
    if (has('gobo_shooter') || /_bow$/.test(id) || /_bow_/.test(id) || /_crossbow$/.test(id) || /_crossbow_/.test(id)) return 'Range';
    return null;
  }
  function deriveCharmType(itemHrid) {
    if (!itemHrid || typeof itemHrid !== 'string') return null;
    const id = itemHrid.split('/').pop();
    // patterns like advanced_stamina_charm
    const m = /(trainee|basic|advanced|expert|master|grandmaster)_([a-z]+)_charm/.exec(id);
    if (m && m[2]) {
      const t = m[2];
      const map = { attack:'Attack', magic:'Magic', melee:'Melee', defense:'Defense', stamina:'Stamina', intelligence:'Intelligence', ranged:'Range' };
      return map[t] || null;
    }
    return null;
  }

  function hasFiniteRates(r) {
    return !!(r && (
      Number.isFinite(r.primaryPerHour) ||
      Number.isFinite(r.totalPerHour) ||
      Number.isFinite(r.charmPerHour)
    ));
  }

  /** ---------------- Site-specific behaviors ---------------- */
  const onMWI = (location.hostname === 'www.milkywayidle.com' || location.hostname === 'milkywayidle.com' || location.hostname === 'test.milkywayidle.com' || location.hostname === 'www.milkywayidlecn.com' || location.hostname === 'milkywayidlecn.com' || location.hostname === 'test.milkywayidlecn.com');
  const onPlanner = ((location.hostname === 'ignantgaming.github.io' && location.pathname.startsWith('/MWI_XP_Planner/')) || location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  // Install a minimal JSON.parse hook to catch battle payloads even if WS handlers are intercepted
  function installJsonHookOnce(){
    try {
      if (window.__mwixp_json_hooked) return; window.__mwixp_json_hooked = true;
      const _parse = JSON.parse;
      JSON.parse = function(text, reviver){
        const val = _parse.call(JSON, text, reviver);
        try {
          if (val && typeof val === 'object' && val.combatStartTime && Array.isArray(val.players)) {
            updateRatesFromBattle(val);
          } else if (val && (val.type === 'new_battle' || val.type === 'battle_update' || val.type === 'battle_result') && val.combatStartTime && Array.isArray(val.players)) {
            updateRatesFromBattle(val);
          }
        } catch {}
        return val;
      };
    } catch {}
  }

  // Advertise userscript presence to the planner site so it can hide the install CTA
  if (onPlanner) { try { window.__MWIXP_INSTALLED = USERSCRIPT_VERSION; localStorage.setItem('mwixp:userscript', USERSCRIPT_VERSION); } catch {} }
  if (onMWI) {
    GM_addStyle(`
      .mwixp-fab { position: fixed; z-index: 999999; border: 0; cursor: pointer;
                   padding: 4px 8px; border-radius: 8px; color: #fff; font: 12px/1 system-ui, sans-serif;
                   box-shadow: 0 1px 6px rgba(0,0,0,.18); text-align: center; min-width: 160px; height: 26px; }
      /* Move buttons further left from the right edge; overlap to consume the same space */
      #mwixp-save { top: 6px; right: 20%; background: #4f46e5; }
      #mwixp-open { top: 6px; right: 20%; background: #2d6cdf; }
      .mwixp-fab:hover { filter: brightness(1.06); }
    `);
    // Ensure WS hook is active as early as possible so we catch the next message
    try { hookWebSocketOnce(); } catch {}    try { installJsonHookOnce(); } catch {}    try { startSampler(); } catch {}
    try { startSampler(); } catch {}

    // Temporary action state: after saving, show Open button for 5 minutes
    const ACTION_STATE_KEY = 'mwixp:lastActionState'; // { mode: 'open'|'save', tag?: string, until?: number }
    let mwixpRevertTimerId = null;
    function getActionState() { return GM_getValue(ACTION_STATE_KEY, { mode: 'save' }); }
    function setActionState(state) { GM_setValue(ACTION_STATE_KEY, state); }
    function clearActionState() { GM_setValue(ACTION_STATE_KEY, { mode: 'save' }); }
    function updateActionButtonsFromState() {
      const saveBtn = document.getElementById('mwixp-save');
      const openBtn = document.getElementById('mwixp-open');
      if (!saveBtn || !openBtn) return;
      if (mwixpRevertTimerId) { clearTimeout(mwixpRevertTimerId); mwixpRevertTimerId = null; }
      const st = getActionState();
      if (st.mode === 'open' && st.tag && typeof st.until === 'number' && Date.now() < st.until) {
        saveBtn.style.display = 'none';
        openBtn.style.display = '';
        openBtn.textContent = `Open ${st.tag} in Planner`;
        const ms = Math.max(0, st.until - Date.now());
        mwixpRevertTimerId = setTimeout(() => { clearActionState(); updateActionButtonsFromState(); }, ms);
      } else {
        clearActionState();
        saveBtn.style.display = '';
        openBtn.style.display = 'none';
        openBtn.textContent = 'Open Tag in Planner';
      }
    }

    function runWhenBodyReady(fn) {
      if (document.body) { try { fn(); } catch {} return; }
      window.addEventListener('DOMContentLoaded', () => { try { fn(); } catch {} }, { once: true });
    }

    function ensureButtons(payload) {
      const attach = () => {
        try {
          if (!document.getElementById('mwixp-save')) {
            const b = document.createElement('button');
            b.id = 'mwixp-save'; b.className = 'mwixp-fab';
            b.textContent = 'Save MWI -> Tag';
            b.title = 'Save current combat skills to a named tag';
            b.onclick = () => { let p = extractFromInitCharacterData() || extractLegacyCharacterSkills(); if (!p) { alert('No init_character_data or characterSkills found yet. Try after loading the game UI or starting a battle.'); return; } doSaveSnapshot(p); };
            document.body.appendChild(b);
          }
          if (!document.getElementById('mwixp-open')) {
            const b = document.createElement('button');
            b.id = 'mwixp-open'; b.className = 'mwixp-fab';
            b.textContent = 'Open Tag in Planner';
            b.title = 'Open the last saved tag in the planner';
            b.style.display = 'none';
            b.onclick = () => doOpenTag();
            document.body.appendChild(b);
          }
          updateActionButtonsFromState();
        } catch {}
      };
      if (document.body) attach(); else window.addEventListener('DOMContentLoaded', attach, { once: true });
    }

    function doSaveSnapshot(payload) {
      const defaultTag = payload.meta.characterName
        ? `${payload.meta.characterName}-${new Date().toISOString().slice(0,10)}`
        : 'snapshot-' + Date.now();
      const tag = prompt('Save snapshot under tag name:', defaultTag);
      if (!tag) return;
      // attach latest EXP/hour rates for planner autofill
      const live = getLiveRates();
      payload.meta = payload.meta || {};
      // Build a robust rates object including per-skill so the planner can always reconcile
      const rr = {};
      // Per-skill snapshot from recent updates (rounded numbers, default 0)
      const keys = ['attack','defense','intelligence','stamina','magic','ranged','melee']; const cache = readLiveCache(); const perSource = (cache && cache.perSkill) || perSkillRates || {}; for (const k of keys) rr[k] = Number(perSource[k] || 0);
      // Charm type from equipment if available; otherwise from live
      const eqNow = getEquipmentMeta();
      if (eqNow?.charmTypeFromCharm) rr.cType = eqNow.charmTypeFromCharm; else if (live.charmType) rr.cType = live.charmType; else if (cache?.charmType) rr.cType = cache.charmType;
      // Compute charm rate from matching per-skill when possible; else use live
      if (rr.cType) {
        const ck = rr.cType.toLowerCase() === 'range' ? 'ranged' : rr.cType.toLowerCase();
        if (rr[ck] != null) rr.cRate = Math.max(0, Math.round(Number(rr[ck] || 0)));
      }
      if (rr.cRate == null && Number.isFinite(live.charmPerHour)) rr.cRate = Math.max(0, Math.round(live.charmPerHour)); if (rr.cRate == null && Number.isFinite(cache?.charmPerHour)) rr.cRate = Math.max(0, Math.round(cache.charmPerHour));
      // Compute total from per-skill if any present; else use live total
      const sum = keys.reduce((a,k)=>a + (Number(rr[k]||0)), 0);
      if (sum > 0) rr.total = Math.max(0, Math.round(sum));
      if (rr.total == null && Number.isFinite(live.totalPerHour)) rr.total = Math.max(0, Math.round(live.totalPerHour)); if (rr.total == null && Number.isFinite(cache?.totalPerHour)) rr.total = Math.max(0, Math.round(cache.totalPerHour));
      // Compute pRate from total − cRate if possible; else use live primary
      if (rr.pRate == null && rr.total != null && rr.cRate != null) rr.pRate = Math.max(0, rr.total - rr.cRate);
      if (rr.pRate == null && Number.isFinite(live.primaryPerHour)) rr.pRate = Math.max(0, Math.round(live.primaryPerHour)); if (rr.pRate == null && Number.isFinite(cache?.primaryPerHour)) rr.pRate = Math.max(0, Math.round(cache.primaryPerHour));
      // Final reconciliation if one is missing but others are present
      if (rr.pRate == null && rr.total != null && rr.cRate != null) rr.pRate = Math.max(0, rr.total - rr.cRate);
      if (rr.cRate == null && rr.total != null && rr.pRate != null) rr.cRate = Math.max(0, rr.total - rr.pRate);
      rr.lastAt = live.lastAt || cache?.lastAt || Date.now();
      payload.meta.rates = rr;
      payload.meta.scriptVersion = USERSCRIPT_VERSION;
      // Add equipment snapshot
      payload.meta.equipment = getEquipmentMeta();
      setSnapshot(tag, payload);
      alert(`Saved snapshot: "${tag}"`);
      setActionState({ mode: 'open', tag, until: Date.now() + 5 * 60 * 1000 });
      updateActionButtonsFromState();
    }
    function doOpenTag() {
      const st = getActionState();
      let tag = (st && st.mode === 'open') ? st.tag : null;
      if (!tag) {
        const tags = listTags();
        if (!tags.length) { alert('No saved tags yet. Save one first.'); return; }
        tag = prompt('Enter a tag to open:\n' + tags.join('\n'), tags[0]);
        if (!tag) return;
      }
      const snap = getSnapshot(tag);
      if (!snap) { alert('Tag not found.'); return; }
      const metaRates = snap?.meta?.rates;
      const live = getLiveRates();
      const chosen = hasFiniteRates(metaRates) ? metaRates : (hasFiniteRates(live) ? live : null);
      const url = buildPlannerUrlWithExport(snap.wanted, chosen);
      window.open(url, '_blank');
    }

    let payload = extractFromInitCharacterData();
    if (!payload) {
      payload = extractLegacyCharacterSkills();
      if (!payload) warn('No init_character_data or characterSkills found.');
    }

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Save snapshot (tag)', () => { let p = extractFromInitCharacterData() || extractLegacyCharacterSkills(); if (!p) { alert('No init_character_data or characterSkills found.'); return; } doSaveSnapshot(p); });
      GM_registerMenuCommand('Open snapshot in planner', doOpenTag);
      GM_registerMenuCommand('Copy current skills JSON', () => {
        if (!payload) return alert('No skills available.');
        const json = JSON.stringify(payload.wanted, null, 2);
        if (typeof GM_setClipboard === 'function') GM_setClipboard(json);
        else navigator.clipboard?.writeText(json);
        alert('Copied current combat skills JSON.');
      });
      GM_registerMenuCommand('List tags', () => alert(listTags().join('\n') || '(none)'));
      GM_registerMenuCommand('Delete tag', () => {
        const tag = prompt('Tag to delete:', listTags()[0] || '');
        if (!tag) return;
        deleteSnapshot(tag);
        alert(`Deleted: ${tag}`);
      });
    }

    ensureButtons(payload);
    updateActionButtonsFromState();

    if (payload) {
      log('Snapshot candidate:', {
        meta: payload.meta,
        sample: payload.wanted.reduce((m, s) => (m[s.skillHrid] = { lvl: s.level, xp: s.experience }, m), {})
      });
    }
  }

  // On your GitHub Page: #tag loader -> #cs
  if (onPlanner) {
    const hash = location.hash || '';
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const tag = params.get('tag');

    if (tag) {
      const snap = getSnapshot(tag);
      if (!snap) {
        alert(`No saved snapshot for tag "${tag}". Open the planner from milkywayidle.com after saving.`);
        return;
      }
      // Always embed object payload with meta (equipment + any available rates)
      const live = getLiveRates();
      // Prefer equipment saved in the snapshot; fallback to best-effort extraction (likely null on planner domain)
      const savedEq = snap?.meta?.equipment || null;
      const payload = {
        skills: snap.wanted,
        meta: {
          scriptVersion: USERSCRIPT_VERSION,
          equipment: savedEq || getEquipmentMeta(),
          rates: {}
        }
      };
      const r = snap?.meta?.rates;
      const src = (r && (r.charmPerHour != null || r.primaryPerHour != null || r.totalPerHour != null)) ? r : live;
      const rr = {};
      if (src) {
        if (Number.isFinite(src.primaryPerHour)) rr.pRate = Math.max(0, Math.round(src.primaryPerHour)); if (Number.isFinite(src.charmPerHour)) rr.cRate = Math.max(0, Math.round(src.charmPerHour)); if (src.charmType) rr.cType = src.charmType;
        if (Number.isFinite(src.totalPerHour)) rr.total = Math.max(0, Math.round(src.totalPerHour));
      }
      // Charm from equipment if present
      if (savedEq?.charmTypeFromCharm) rr.cType = savedEq.charmTypeFromCharm;
      // Always attach per-skill rates (prefer snapshot values if present)
      rr.attack = (r && r.attack != null) ? r.attack : perSkillRates.attack;
      rr.defense = (r && r.defense != null) ? r.defense : perSkillRates.defense;
      rr.intelligence = (r && r.intelligence != null) ? r.intelligence : perSkillRates.intelligence;
      rr.stamina = (r && r.stamina != null) ? r.stamina : perSkillRates.stamina;
      rr.magic = (r && r.magic != null) ? r.magic : perSkillRates.magic;
      rr.ranged = (r && r.ranged != null) ? r.ranged : perSkillRates.ranged;
      rr.melee = (r && r.melee != null) ? r.melee : perSkillRates.melee;
      // If we know cType, set cRate from matching per-skill
      if (rr.cType) {
        const key = rr.cType.toLowerCase() === 'range' ? 'ranged' : rr.cType.toLowerCase();
        if (rr[key] != null) rr.cRate = Math.max(0, Math.round(Number(rr[key] || 0)));
      }
      // If still missing, infer cType from highest non-primary per-skill rate among known charms
      if (!rr.cType) {
        const candidates = ['stamina','intelligence','defense','attack'];
        let best = null, bestV = -1;
        for (const k of candidates) { const v = Number(rr[k] || 0); if (v > bestV) { bestV = v; best = k; } }
        if (best && bestV > 0) { rr.cType = best === 'stamina' ? 'Stamina' : best.charAt(0).toUpperCase() + best.slice(1); rr.cRate = Math.max(0, Math.round(bestV)); }
      }
      // Compute pRate if missing and we have total & cRate
      if (rr.pRate == null && rr.total != null && rr.cRate != null) rr.pRate = Math.max(0, rr.total - rr.cRate);
      payload.meta.rates = rr;
      const newHash = '#cs=' + encodeURIComponent(JSON.stringify(payload));
      if (location.hash !== newHash) {
        history.replaceState(null, '', location.pathname + newHash);
        // If your site only reads hash at load, uncomment:
        // location.reload();
      }
      log('Injected snapshot for tag:', tag, snap.meta || {});
    }
  }
})();
