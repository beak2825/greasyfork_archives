// ==UserScript==
// @name         Torn Elimination Team Panel
// @namespace    https://torn.com/
// @version      0.6.7
// @description  Floating movable Elimination Team panel with filters
// @match        https://www.torn.com/*
// @author       SuperGogu[3580072]
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/558512/Torn%20Elimination%20Team%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/558512/Torn%20Elimination%20Team%20Panel.meta.js
// ==/UserScript==



(function () {
  'use strict';

  // === Variables ===
  const K = {
    apiKeyLegacy: 'et_api_key',
    apiKeys: 'et_api_keys',
    apiKeyIndex: 'et_api_key_index',
    teams: 'et_teams',
    panelPos: 'et_panel_pos',
    hidden: 'et_panel_hidden',
    lastIndex: 'et_last_team_index',
    lastTeamId: 'et_last_team_id',
    filterOkay: 'et_filter_okay',
    filterLocation: 'et_filter_location',
    filterOnline: 'et_filter_online',
    filterBsMax: 'et_filter_bs_max',
    locationValue: 'et_location_value',
    bsLow: 'et_bs_low',
    bsHigh: 'et_bs_high',
    offsetPrefix: 'et_team_offset_',
    cachePrefix: 'et_team_cache_',
    lastTeamToLose: 'et_last_team_to_lose'
  };

  const DEFAULT_POS = { top: 120, left: 120 };
  const MAX_TEAMS = 12;
  const PAGE_LIMIT = 100;

  const ALWAYS_HIDE_STATES = new Set(['Awoken', 'Dormant', 'Fallen', 'Federal']);

  const TOTAL_BANKERS_ID = 52;

  const MASTER_KEY = 'et_master_tab_v2';
  const HEARTBEAT_MS = 8000;
  const STALE_MS = 25000;

  const TAB_ID_KEY = 'et_tab_id';

  let tabId = (() => {
    try {
      const existing = sessionStorage.getItem(TAB_ID_KEY);
      if (existing) return existing;
      const id = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      sessionStorage.setItem(TAB_ID_KEY, id);
      return id;
    } catch (_) {
      return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    }
  })();

  let heartbeatTimer = null;

  let dock, panel, teamsPanel, header, body, closeBtn, statusEl, apiInput, saveKeyBtn, firstFetchBtn, refreshTeamsBtn;
  let membersWrap, clockEl, filterWrap, filterCheckbox, locationCheckbox, onlineCheckbox, bsMaxCheckbox, locationSelect, bsLowInput, bsHighInput, rangeEl, pagerWrap, prevBtn, nextBtn;
  let teamsHeaderEl = null;
  let dragging = false;
  let dragOffset = { x: 0, y: 0 };
  let clockTimer = null;
  let teamsRefreshTimer = null;

  let selectedIndex = 1;
  let selectedTeamId = null;
  let currentOffset = 0;
  let lastFetchedCount = 0;

  let currentRows = [];
  let currentTeamId = null;
  let currentTeamName = '';
  let currentMembersHidden = false;

  let bsLow = null;
  let bsHigh = null;

  const COUNTRY_CODES = {
    'Mexico': 'ME',
    'Cayman Islands': 'CI',
    'Canada': 'CA',
    'Hawaii': 'HA',
    'United Kingdom': 'UK',
    'Argentina': 'AR',
    'Switzerland': 'SW',
    'Japan': 'JP',
    'China': 'CN',
    'United Arab Emirates': 'UAE',
    'South Africa': 'SA'
  };

  const CODE_TO_COUNTRY = {};
  for (const [name, code] of Object.entries(COUNTRY_CODES)) {
    CODE_TO_COUNTRY[code] = name;
  }

  // === Helpers ===
  const getVal = (k, d) => {
    const v = GM_getValue(k);
    return v === undefined ? d : v;
  };

  const setVal = (k, v) => GM_setValue(k, v);

  const delVal = (k) => {
    try { GM_deleteValue(k); } catch (_) { setVal(k, undefined); }
  };

  const listVals = () => {
    try {
      const v = GM_listValues();
      return Array.isArray(v) ? v : [];
    } catch (_) {
      return [];
    }
  };

  const el = (tag, props = {}, children = []) => {
    const n = document.createElement(tag);
    for (const [key, val] of Object.entries(props)) {
      if (key === 'class') n.className = val;
      else if (key === 'text') n.textContent = val;
      else if (key === 'html') n.innerHTML = val;
      else if (key === 'style') Object.assign(n.style, val);
      else if (key.startsWith('on') && typeof val === 'function') n.addEventListener(key.slice(2), val);
      else if (val !== null && val !== undefined) n.setAttribute(key, val);
    }
    for (const c of children) n.appendChild(c);
    return n;
  };

  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg || '';
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const fmt2 = (n) => String(n).padStart(2, '0');

  const parseKeys = (raw) => {
    if (!raw) return [];
    const arr = String(raw).split(',').map(s => s.trim()).filter(Boolean);
    const seen = new Set();
    const out = [];
    for (const k of arr) {
      if (!seen.has(k)) { seen.add(k); out.push(k); }
    }
    return out;
  };

  const getKeys = () => {
    const rawNew = getVal(K.apiKeys, '');
    const keysNew = parseKeys(rawNew);
    if (keysNew.length) return keysNew;
    const rawOld = getVal(K.apiKeyLegacy, '');
    return parseKeys(rawOld);
  };

  const saveKeys = (raw) => {
    const keys = parseKeys(raw);
    setVal(K.apiKeys, keys.join(','));
    setVal(K.apiKeyLegacy, keys[0] || '');
    const idx = parseInt(getVal(K.apiKeyIndex, 0), 10) || 0;
    setVal(K.apiKeyIndex, keys.length ? (idx % keys.length) : 0);
    return keys;
  };

  const getNextKey = () => {
    const keys = getKeys();
    if (!keys.length) return null;
    let idx = parseInt(getVal(K.apiKeyIndex, 0), 10) || 0;
    const key = keys[idx % keys.length];
    idx = (idx + 1) % keys.length;
    setVal(K.apiKeyIndex, idx);
    return key;
  };

  const gmRequest = (details) => new Promise((resolve, reject) => {
    const d = Object.assign({}, details);
    const done = (res) => resolve(res);
    const fail = (err) => reject(err);
    d.onload = done;
    d.onerror = fail;
    d.ontimeout = fail;
    try {
      const ret = GM.xmlHttpRequest(d);
      if (ret && typeof ret.then === 'function') ret.then(done).catch(fail);
    } catch (e) {
      fail(e);
    }
  });

  const requestJson = (url) => gmRequest({
    method: 'GET',
    url,
    headers: { accept: 'application/json' },
    timeout: 30000
  }).then((res) => {
    const data = JSON.parse(res.responseText);
    return { status: res.status, data };
  });

  const safeParseMaybeDouble = (raw) => {
    if (!raw) return null;
    try {
      let v = JSON.parse(raw);
      if (typeof v === 'string') {
        try { v = JSON.parse(v); } catch (_) {}
      }
      return v;
    } catch (_) {
      return null;
    }
  };

  const getFFCacheFromLocalStorage = (playerId) => {
    const pid = String(playerId);
    const keys = [`ffscouterv2-${pid}`, pid];
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const parsed = safeParseMaybeDouble(raw);
        if (!parsed) continue;
        return parsed;
      } catch (_) {}
    }
    return null;
  };

  const formatEstimateHuman = (s) => {
    if (!s) return '';
    const t = String(s).trim();
    if (/^\d+(\.\d+)?m$/i.test(t)) return t.replace(/m$/i, 'mil');
    return t;
  };

  const getEstimateHuman = (playerId) => {
    const c = getFFCacheFromLocalStorage(playerId);
    const v = c?.bs_estimate_human ?? c?.bs_human_estimate ?? '';
    return formatEstimateHuman(v);
  };

  const withNA = (s) => (s && String(s).trim()) ? String(s).trim() : 'N/A';

  const parseEstimateNumber = (s) => {
    if (!s) return null;
    const t = String(s).trim().toLowerCase();
    const m = t.match(/^(\d+(?:\.\d+)?)\s*(k|m|mil|b)?$/i);
    if (!m) return null;
    const num = parseFloat(m[1]);
    const unit = (m[2] || '').toLowerCase();
    if (unit === 'k') return num * 1000;
    if (unit === 'm' || unit === 'mil') return num * 1000000;
    if (unit === 'b') return num * 1000000000;
    return num;
  };

  const bsClassForValue = (v) => {
    if (v === null || v === undefined || Number.isNaN(v)) return '';
    const low = bsLow;
    const high = bsHigh;
    if (low == null && high == null) return '';
    if (low != null && high != null) {
      if (v < low) return 'et-bs-yellow';
      if (v > high) return 'et-bs-red';
      return 'et-bs-green';
    }
    if (low == null && high != null) {
      if (v <= high) return 'et-bs-green';
      return 'et-bs-red';
    }
    if (low != null && high == null) {
      if (v < low) return 'et-bs-yellow';
      return 'et-bs-green';
    }
    return '';
  };

  const formatStateDisplay = (state, desc) => {
    const baseState = state || '';
    const d = (desc || '').trim();
    const sLower = baseState.toLowerCase();

    if (sLower !== 'abroad' && sLower !== 'traveling') {
      return baseState;
    }

    if (!d) return baseState;

    const inMatch = d.match(/^In\s+(.+)$/i);
    if (inMatch && sLower === 'abroad') {
      const country = inMatch[1].trim();
      const code = COUNTRY_CODES[country] || country;
      return `In ${code}`;
    }

    const toMatch = d.match(/^Traveling to\s+(.+)$/i);
    if (toMatch && sLower === 'traveling') {
      const country = toMatch[1].trim();
      const code = COUNTRY_CODES[country] || country;
      return `to ${code}`;
    }

    const retMatch = d.match(/^Returning to Torn from\s+(.+)$/i);
    if (retMatch && sLower === 'traveling') {
      return 'to TORN';
    }

    return d;
  };

    const formatHospitalRemaining = (until) => {
        if (!until) return null;
        const nowSec = Math.floor(Date.now() / 1000);
        let diff = until - nowSec;
        if (diff < 0) diff = 0;

        const h = Math.floor(diff / 3600);
        diff %= 3600;
        const m = Math.floor(diff / 60);
        const s = diff % 60;

        return `Hosp: ${h}h:${fmt2(m)}m:${fmt2(s)}s`;
    };

    const getHospitalDisplay = (until, nowSec) => {
        if (!until) return null;

        const total = Math.max(0, until - nowSec);

        const hours = Math.floor(total / 3600);
        const rem = total % 3600;
        const minutes = Math.floor(rem / 60);
        const seconds = rem % 60;

        const text = `Hosp: ${hours}h:${fmt2(minutes)}m:${fmt2(seconds)}s`;

        let cls = 'et-state-other';
        if (total < 60) cls = 'et-state-hosp-green';
        else if (total < 5 * 60) cls = 'et-state-hosp-yellow';

        return { text, className: cls };
    };



  const relativeWithinMinutes = (relative, limitMinutes) => {
    if (!relative) return false;
    const lower = relative.toLowerCase().trim();

    if (lower.includes('second')) return true;

    const m = lower.match(/(\d+)\s+(\w+)/);
    if (!m) return false;

    const num = parseInt(m[1], 10);
    if (!Number.isFinite(num)) return false;
    const unit = m[2];

    let minutes = 0;
    if (unit.startsWith('min')) {
      minutes = num;
    } else if (unit.startsWith('hour')) {
      minutes = num * 60;
    } else if (unit.startsWith('day')) {
      minutes = num * 1440;
    } else {
      return false;
    }

    return minutes <= limitMinutes;
  };

  // === Master tab ===
  const readMaster = () => {
    try {
      const raw = localStorage.getItem(MASTER_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.id || !obj.ts) return null;
      return obj;
    } catch (_) { return null; }
  };

  const writeMaster = (id) => {
    try { localStorage.setItem(MASTER_KEY, JSON.stringify({ id, ts: Date.now() })); } catch (_) {}
  };

  const isMaster = () => {
    const m = readMaster();
    if (!m) return false;
    if (Date.now() - m.ts > STALE_MS) return false;
    return m.id === tabId;
  };

  const tryBecomeMaster = () => {
    const m = readMaster();
    if (!m || (Date.now() - m.ts > STALE_MS)) writeMaster(tabId);
  };

  const startHeartbeat = () => {
    tryBecomeMaster();
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (isMaster()) writeMaster(tabId);
      else tryBecomeMaster();
    }, HEARTBEAT_MS);
  };

  const guardMaster = (silent) => {
    if (isMaster()) return true;
    if (!silent) setStatus('This is a secondary tab. API calls are disabled here.');
    return false;
  };

  // === Clock / Teams header ===
    const startClock = () => {
        const tick = () => {
            if (clockEl) {
                const d = new Date();
                const h = fmt2(d.getUTCHours());
                const m = fmt2(d.getUTCMinutes());
                const s = fmt2(d.getUTCSeconds());
                clockEl.textContent = `GMT 00 - ${h}:${m}:${s}`;
            }
            updateHospitalTimers();
        };
        tick();
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(tick, 1000);
    };


  const setTeamsHeaderUpdated = (ts) => {
    if (!teamsHeaderEl) return;
    if (!ts) {
      teamsHeaderEl.textContent = 'Teams';
      return;
    }
    const d = new Date(ts);
    const h = fmt2(d.getUTCHours());
    const m = fmt2(d.getUTCMinutes());
    const s = fmt2(d.getUTCSeconds());
    teamsHeaderEl.textContent = `Teams - updated at ${h}:${m}:${s} TCT`;
  };

  // === API ===
  const fetchEliminationTeams = async () => {
    if (!guardMaster(true)) return { error: { code: -9, error: 'Secondary tab' } };
    const key = getNextKey();
    if (!key) return { error: { code: -1, error: 'API key is missing' } };

    const url = `https://api.torn.com/v2/torn/elimination?key=${encodeURIComponent(key)}`;

    try {
      const { data } = await requestJson(url);
      if (data?.error) return { error: data.error };

      const arr = Array.isArray(data?.elimination) ? data.elimination : [];

      const mapped = arr.map(t => ({
        id: t.id,
        name: t.name,
        score: t.score,
        lives: t.lives,
        position: t.position,
        eliminated: !!t.eliminated
      }));

      mapped.sort((a, b) => {
        const dl = (b.lives || 0) - (a.lives || 0);
        if (dl !== 0) return dl;
        return (b.score || 0) - (a.score || 0);
      });

      const teams = mapped.slice(0, MAX_TEAMS);
      return { teams };
    } catch (_) {
      return { error: { code: -2, error: 'Network error' } };
    }
  };

  const fetchTeamMembersPage = async (teamId, offset) => {
    if (!guardMaster(true)) return { error: { code: -9, error: 'Secondary tab' } };
    const key = getNextKey();
    if (!key) return { error: { code: -1, error: 'API key is missing' } };

    const url = `https://api.torn.com/v2/torn/${teamId}/eliminationteam?limit=${PAGE_LIMIT}&offset=${Math.max(0, offset)}&key=${encodeURIComponent(key)}`;

    try {
      const { data } = await requestJson(url);
      if (data?.error) return { error: data.error };

      const list = Array.isArray(data?.eliminationteam) ? data.eliminationteam : [];
        const simplified = list.map(m => ({
            id: m.id,
            name: m.name,
            level: m.level,
            state: m?.status?.state ?? '',
            statusDesc: m?.status?.description ?? '',
            attacks: m?.attacks ?? 0,
            score: m?.score ?? 0,
            lastStatus: m?.last_action?.status ?? '',
            lastRelative: m?.last_action?.relative ?? '',
            until: m?.status?.until ?? null
        }));
      return { members: simplified, count: simplified.length };
    } catch (_) {
      return { error: { code: -2, error: 'Network error' } };
    }
  };

  const firstFetch = async () => {
    if (!guardMaster(false)) return;
    setStatus('Fetching elimination teams...');
    const res = await fetchEliminationTeams();
    if (res.error) { setStatus(`Error ${res.error.code}: ${res.error.error}`); return; }

    setVal(K.teams, res.teams);
    setTeamsHeaderUpdated(Date.now());

    if (Array.isArray(res.teams) && res.teams.length) {
      let storedId = getVal(K.lastTeamId, null);
      let idx = 1;
      let id = res.teams[0].id;

      if (storedId != null) {
        const foundIndex = res.teams.findIndex(t => String(t.id) === String(storedId));
        if (foundIndex !== -1) {
          idx = foundIndex + 1;
          id = res.teams[foundIndex].id;
        }
      }

      selectedIndex = idx;
      selectedTeamId = id;
      setVal(K.lastIndex, idx);
      setVal(K.lastTeamId, id);

      buildTeamList(res.teams);
      setStatus(`Saved ${res.teams.length} teams.`);
      await onTeamSelect(idx, true, 0);
    } else {
      buildTeamList([]);
      setStatus('No teams received.');
    }
  };

  const refreshTeamsData = async (silent = false, updateLastLoss = false) => {
    if (!guardMaster(true)) return;

    const oldTeams = getTeams();

    const res = await fetchEliminationTeams();
    if (res.error) {
      if (!silent && res.error.code !== -9) {
        setStatus(`Error ${res.error.code}: ${res.error.error}`);
      }
      return;
    }

    const teams = Array.isArray(res.teams) ? res.teams : [];

    if (updateLastLoss && Array.isArray(oldTeams) && oldTeams.length && teams.length) {
      const oldMap = new Map(oldTeams.map(t => [String(t.id), t]));
      let bestId = getVal(K.lastTeamToLose, null);
      let bestLoss = 0;
      for (const t of teams) {
        const prev = oldMap.get(String(t.id));
        if (!prev) continue;
        const oldLives = typeof prev.lives === 'number' ? prev.lives : 0;
        const newLives = typeof t.lives === 'number' ? t.lives : 0;
        const delta = oldLives - newLives;
        if (delta > 0 && delta >= bestLoss) {
          bestLoss = delta;
          bestId = t.id;
        }
      }
      if (bestLoss > 0) {
        setVal(K.lastTeamToLose, bestId);
      }
    }

    setVal(K.teams, teams);
    setTeamsHeaderUpdated(Date.now());

    if (teams.length) {
      const storedId = selectedTeamId != null ? selectedTeamId : getVal(K.lastTeamId, null);
      let idx = 1;
      let id = teams[0].id;

      if (storedId != null) {
        const foundIndex = teams.findIndex(t => String(t.id) === String(storedId));
        if (foundIndex !== -1) {
          idx = foundIndex + 1;
          id = teams[foundIndex].id;
        }
      } else {
        const storedIdx = parseInt(getVal(K.lastIndex, 1), 10) || 1;
        idx = clamp(storedIdx, 1, teams.length);
        id = teams[idx - 1].id;
      }

      selectedIndex = idx;
      selectedTeamId = id;
      setVal(K.lastIndex, idx);
      setVal(K.lastTeamId, id);

      currentTeamId = id;
      currentTeamName = teams[idx - 1]?.name ?? `Team ${idx}`;
    } else {
      selectedIndex = 1;
      selectedTeamId = null;
      currentTeamId = null;
      currentTeamName = '';
      setVal(K.lastIndex, 1);
      setVal(K.lastTeamId, null);
    }

    buildTeamList(teams);
    markActiveTeam();

    if (!silent) setStatus('Teams updated.');
  };

  const computeNextAlignedDelay = () => {
    const now = new Date();
    const marks = [0, 15, 30, 45];
    const secTarget = 30;

    const curMin = now.getMinutes();
    const curSec = now.getSeconds();
    const curMs = now.getMilliseconds();

    let target = null;

    for (const m of marks) {
      if (curMin < m) {
        target = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          m,
          secTarget,
          0
        );
        break;
      }
      if (curMin === m) {
        if (curSec < secTarget || (curSec === secTarget && curMs === 0)) {
          target = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            m,
            secTarget,
            0
          );
          break;
        }
      }
    }

    if (!target) {
      target = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0,
        secTarget,
        0
      );
    }

    return Math.max(0, target.getTime() - now.getTime());
  };

  const scheduleTeamsRefreshAligned = () => {
    if (teamsRefreshTimer) { clearTimeout(teamsRefreshTimer); teamsRefreshTimer = null; }
    const delay = computeNextAlignedDelay();
    teamsRefreshTimer = setTimeout(async () => {
      if (isMaster()) {
        await refreshTeamsData(false, true);
      }
      scheduleTeamsRefreshAligned();
    }, delay);
  };

  // === UI ===
  const injectStyles = () => {
    const css = `
#et-dock {
  position: fixed;
  z-index: 999999;
  display: flex;
  gap: 6px;
  align-items: stretch;
}
#et-panel, #et-teams-panel {
  background: #0f1115;
  color: #e6e6e6;
  border: 1px solid rgba(57, 255, 20, 0.55);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.45);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}
#et-panel { width: 420px; }
#et-teams-panel { width: 280px; }

#et-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  cursor: move;
  user-select: none;
}
#et-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
#et-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
}
#et-clock {
  font-size: 11px;
  opacity: 0.85;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  white-space: nowrap;
}
#et-close {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #e6e6e6;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  flex: 0 0 auto;
}
#et-close:hover { background: rgba(255,255,255,0.09); }

#et-body { padding: 10px 12px 12px 12px; }

#et-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}
#et-row-2 {
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
  justify-content: start;
}

#et-api {
  width: 100%;
  min-width: 0;
  padding: 7px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #e6e6e6;
  font-size: 12px;
  box-sizing: border-box;
}

#et-btn {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: #e6e6e6;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
#et-btn:hover { background: rgba(255,255,255,0.11); }
#et-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

#et-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 6px 0;
  font-size: 11px;
  opacity: 0.9;
  flex-wrap: wrap;
}
#et-filter input[type="checkbox"] { transform: translateY(1px); }

#et-bs-low, #et-bs-high {
  width: 60px;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #e6e6e6;
  font-size: 10px;
  box-sizing: border-box;
}

#et-range {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.9;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  margin: 0 0 8px 0;
}

#et-status {
  font-size: 11px;
  opacity: 0.85;
  min-height: 16px;
  margin: 2px 0 8px 0;
}

#et-members {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 8px;
}

.et-member-selected {
  outline: 1px solid rgba(126, 200, 255, 0.95);
}

#et-members-hidden {
  padding: 18px 10px 10px 10px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
  border: 1px dashed rgba(255,255,255,0.14);
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
}

#et-member-list {
  margin: 0;
  padding: 0 0 0 18px;
  max-height: 360px;
  overflow: auto;
  font-size: 11px;
}

.et-member-item {
  padding: 4px 6px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  margin-bottom: 2px;
}

.et-member-top {
  display: flex;
  align-items: center;
  gap: 4px;
}
.et-member-bottom {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 1px;
}

.et-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.et-dot-green { background: #2ecc71; }
.et-dot-yellow { background: #f1c40f; }
.et-dot-gray { background: #7f8c8d; }

.et-state-okay { color: #2ecc71; }
.et-state-abroad { color: #3498db; }
.et-state-other { color: #e74c3c; }

.et-state-hosp-yellow { color: #f1c40f; }
.et-state-hosp-green { color: #2ecc71; }

.et-bs-yellow { color: #ffd400; }
.et-bs-green { color: #2ecc71; }
.et-bs-red { color: #e74c3c; }

.et-attack-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}
.et-attack-link:hover { opacity: 0.85; }

#et-pager {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-top: 10px;
}
#et-pager #et-btn {
  flex: 1 1 0;
}

#et-teams-panel {
  width: 280px;
}
#et-teams-header {
  padding: 10px 12px 8px 12px;
  font-size: 12px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
#et-team-list {
  max-height: 560px;
  overflow: auto;
  padding: 8px 8px 10px 8px;
  display: grid;
  gap: 6px;
}
.et-team-item {
  padding: 8px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  font-size: 12px;
  cursor: pointer;
  line-height: 1.25;
  white-space: nowrap;
}
.et-team-item:hover { background: rgba(255,255,255,0.09); }
.et-team-active {
  background: rgba(80, 140, 255, 0.22);
  border-color: rgba(80, 140, 255, 0.45);
}
.et-team-eliminated {
  color: #ff4c4c;
}
.et-team-last-loss {
  border-color: #ffd400 !important;
  box-shadow: 0 0 6px rgba(255,212,0,0.5);
}
    `.trim();
    document.head.appendChild(el('style', { html: css }));
  };

  const buildTeamsPanel = () => {
    const headerEl = el('div', { id: 'et-teams-header', text: 'Teams' });
    teamsHeaderEl = headerEl;
    const listEl = el('div', { id: 'et-team-list' });
    return el('div', { id: 'et-teams-panel' }, [headerEl, listEl]);
  };

  const getTeamsListEl = () => teamsPanel ? teamsPanel.querySelector('#et-team-list') : null;

  const buildTeamList = (teams) => {
    const listEl = getTeamsListEl();
    if (!listEl) return;

    listEl.innerHTML = '';
    const safe = Array.isArray(teams) ? teams.slice(0, MAX_TEAMS) : [];

    if (!safe.length) {
      listEl.appendChild(el('div', { class: 'et-team-item', text: 'No teams saved' }));
      return;
    }

    const lastLossId = getVal(K.lastTeamToLose, null);

    safe.forEach((t, i) => {
      const idx = i + 1;
      const score = (t?.score ?? '');
      const lives = (t?.lives ?? '');
      const eliminated = !!t?.eliminated;
      const position = (typeof t?.position === 'number' && t.position > 0) ? t.position : idx;

      let text;
      if (eliminated) {
        text = `${position} - ${t.name} - Eliminated`;
      } else {
        text = `${idx} - ${t.name} - Tickets ${score} - Lives ${lives}`;
      }

      const isActive = selectedTeamId != null
        ? String(t.id) === String(selectedTeamId)
        : idx === selectedIndex;

      const baseClass = eliminated ? 'et-team-item et-team-eliminated' : 'et-team-item';

      let cls = baseClass;
      if (isActive) cls += ' et-team-active';
      if (lastLossId != null && String(lastLossId) === String(t.id)) {
        cls += ' et-team-last-loss';
      }

      const item = el('div', {
        class: cls,
        text
      });
      item.dataset.idx = String(idx);
      item.addEventListener('click', () => onTeamSelect(idx, false, 0));
      listEl.appendChild(item);
    });
  };

  const getTeams = () => {
    const t = getVal(K.teams, []);
    return Array.isArray(t) ? t : [];
  };

  const markActiveTeam = () => {
    const listEl = getTeamsListEl();
    if (!listEl) return;
    const lastLossId = getVal(K.lastTeamToLose, null);
    const items = Array.from(listEl.querySelectorAll('.et-team-item'));
    items.forEach(it => {
      const idx = parseInt(it.dataset.idx || '0', 10);
      if (!idx) return;
      const teams = getTeams();
      const team = teams[idx - 1];
      if (!team) {
        it.classList.remove('et-team-active');
        it.classList.remove('et-team-last-loss');
        return;
      }
      const isActive = selectedTeamId != null
        ? String(team.id) === String(selectedTeamId)
        : idx === selectedIndex;
      it.classList.toggle('et-team-active', isActive);
      const isLastLoss = lastLossId != null && String(lastLossId) === String(team.id);
      it.classList.toggle('et-team-last-loss', isLastLoss);
    });
  };

  const updateBsThresholds = () => {
    const lowText = bsLowInput ? bsLowInput.value.trim() : getVal(K.bsLow, '');
    const highText = bsHighInput ? bsHighInput.value.trim() : getVal(K.bsHigh, '');
    setVal(K.bsLow, lowText);
    setVal(K.bsHigh, highText);
    bsLow = parseEstimateNumber(lowText);
    bsHigh = parseEstimateNumber(highText);
  };

  const buildFilter = () => {
    const okChecked = !!getVal(K.filterOkay, false);
    filterCheckbox = el('input', { type: 'checkbox' });
    filterCheckbox.checked = okChecked;
    filterCheckbox.addEventListener('change', () => {
      setVal(K.filterOkay, !!filterCheckbox.checked);
      if (!currentMembersHidden) renderCurrentRows();
    });

    const locEnabled = !!getVal(K.filterLocation, false);
    const savedLoc = (getVal(K.locationValue, 'TORN') || 'TORN').toString().toUpperCase();
    const options = ['TORN', 'ME', 'CI', 'CA', 'HA', 'UK', 'AR', 'SW', 'JP', 'CN', 'UAE', 'SA'];

    locationCheckbox = el('input', { type: 'checkbox' });
    locationCheckbox.checked = locEnabled;
    locationCheckbox.addEventListener('change', () => {
      setVal(K.filterLocation, !!locationCheckbox.checked);
      if (!currentMembersHidden) renderCurrentRows();
    });

    locationSelect = el('select');
    options.forEach(code => {
      const opt = el('option', { value: code, text: code });
      if (code === savedLoc) opt.selected = true;
      locationSelect.appendChild(opt);
    });
    locationSelect.addEventListener('change', () => {
      setVal(K.locationValue, locationSelect.value.toUpperCase());
      if (!currentMembersHidden) renderCurrentRows();
    });

    const onlineEnabled = !!getVal(K.filterOnline, false);
    onlineCheckbox = el('input', { type: 'checkbox' });
    onlineCheckbox.checked = onlineEnabled;
    onlineCheckbox.addEventListener('change', () => {
      setVal(K.filterOnline, !!onlineCheckbox.checked);
      if (!currentMembersHidden) renderCurrentRows();
    });

    const bsMaxEnabled = !!getVal(K.filterBsMax, false);
    bsMaxCheckbox = el('input', { type: 'checkbox' });
    bsMaxCheckbox.checked = bsMaxEnabled;
    bsMaxCheckbox.addEventListener('change', () => {
      setVal(K.filterBsMax, !!bsMaxCheckbox.checked);
      if (!currentMembersHidden) renderCurrentRows();
    });

    const storedLow = getVal(K.bsLow, '');
    const storedHigh = getVal(K.bsHigh, '');
    bsLowInput = el('input', {
      id: 'et-bs-low',
      type: 'text',
      value: storedLow,
      placeholder: '100k'
    });
    bsHighInput = el('input', {
      id: 'et-bs-high',
      type: 'text',
      value: storedHigh,
      placeholder: '10m'
    });

    const onBsChange = () => {
      updateBsThresholds();
      if (!currentMembersHidden) renderCurrentRows();
    };

    bsLowInput.addEventListener('change', onBsChange);
    bsHighInput.addEventListener('change', onBsChange);
    bsLowInput.addEventListener('blur', onBsChange);
    bsHighInput.addEventListener('blur', onBsChange);

    updateBsThresholds();

    filterWrap = el('div', { id: 'et-filter' }, [
      el('label', {}, [
        filterCheckbox,
        el('span', { text: 'OK' })
      ]),
      el('label', {}, [
        locationCheckbox,
        el('span', { text: 'Loc' })
      ]),
      locationSelect,
      el('label', {}, [
        onlineCheckbox,
        el('span', { text: 'ON' })
      ]),
      el('span', { text: 'BS:' }),
      bsLowInput,
      el('span', { text: 'to' }),
      bsHighInput,
      bsMaxCheckbox
    ]);

    return filterWrap;
  };

  const buildRange = () => {
    rangeEl = el('div', { id: 'et-range', text: '' });
    return rangeEl;
  };

  const buildPager = () => {
    prevBtn = el('button', {
      id: 'et-btn',
      text: 'Previous',
      onclick: () => {
        if (currentMembersHidden) return;
        const nextOffset = Math.max(0, currentOffset - PAGE_LIMIT);
        onTeamSelect(selectedIndex, true, nextOffset);
      }
    });

    nextBtn = el('button', {
      id: 'et-btn',
      text: 'Next',
      onclick: () => {
        if (currentMembersHidden) return;
        const nextOffset = currentOffset + PAGE_LIMIT;
        onTeamSelect(selectedIndex, true, nextOffset);
      }
    });

    pagerWrap = el('div', { id: 'et-pager' }, [prevBtn, nextBtn]);
    return pagerWrap;
  };

  const buildPanel = () => {
    injectStyles();

    const pos = getVal(K.panelPos, DEFAULT_POS);

    closeBtn = el('div', { id: 'et-close', text: 'X', onclick: () => hideDock(true) });
    clockEl = el('div', { id: 'et-clock', text: 'GMT 00 - 00:00:00' });

    const titleWrap = el('div', { id: 'et-title-wrap' }, [
      el('div', { id: 'et-title', text: 'Elimination Team' }),
      clockEl
    ]);

    header = el('div', { id: 'et-header' }, [titleWrap, closeBtn]);

    apiInput = el('input', {
      id: 'et-api',
      type: 'password',
      placeholder: 'Torn API key(s), comma-separated',
      value: getVal(K.apiKeys, '') || getVal(K.apiKeyLegacy, '')
    });

    saveKeyBtn = el('button', {
      id: 'et-btn',
      text: 'Save Key(s)',
      onclick: () => {
        const keys = saveKeys(apiInput.value || '');
        setStatus(keys.length ? `Saved ${keys.length} key(s).` : 'No valid keys found.');
      }
    });

    firstFetchBtn = el('button', {
      id: 'et-btn',
      text: 'First-Fetch',
      onclick: () => firstFetch()
    });

    refreshTeamsBtn = el('button', {
      id: 'et-btn',
      text: 'Refresh Teams',
      onclick: () => refreshTeamsData(false, false)
    });

    statusEl = el('div', { id: 'et-status', text: '' });
    membersWrap = el('div', { id: 'et-members' });

    const row1 = el('div', { id: 'et-row' }, [apiInput, saveKeyBtn]);
    const row2 = el('div', { id: 'et-row-2' }, [firstFetchBtn, refreshTeamsBtn]);

    const filterNode = buildFilter();
    const rangeNode = buildRange();
    const pagerNode = buildPager();

    body = el('div', { id: 'et-body' }, [
      row1,
      row2,
      filterNode,
      rangeNode,
      statusEl,
      membersWrap,
      pagerNode
    ]);

    panel = el('div', { id: 'et-panel' }, [header, body]);
    teamsPanel = buildTeamsPanel();

    dock = el('div', {
      id: 'et-dock',
      style: { top: `${pos.top}px`, left: `${pos.left}px` }
    }, [panel, teamsPanel]);

    document.body.appendChild(dock);

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);

    startClock();
    scheduleTeamsRefreshAligned();
  };

    const lsGet = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
    const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
    const lsDel = (k) => { try { localStorage.removeItem(k); } catch (_) {} };

    const scrollKey = (teamId, offset) => `et_scroll_${teamId}_${offset}`;
    const restoreKey = (teamId, offset) => `et_restore_scroll_${teamId}_${offset}`;
    const selectedKey = (teamId) => `et_selected_member_${teamId}`;

    const getSelectedMemberId = (teamId) => {
        if (teamId == null) return null;
        const v = lsGet(selectedKey(teamId));
        return v ? String(v) : null;
    };

    const setSelectedMemberId = (teamId, memberId) => {
        if (teamId == null || memberId == null) return;
        lsSet(selectedKey(teamId), String(memberId));
    };

    const applySelectedHighlight = (teamId) => {
        const list = membersWrap && membersWrap.querySelector('#et-member-list');
        if (!list || teamId == null) return;
        const sel = getSelectedMemberId(teamId);
        list.querySelectorAll('.et-member-item').forEach(li => {
            const id = li.getAttribute('data-id') || '';
            if (sel && id === sel) li.classList.add('et-member-selected');
            else li.classList.remove('et-member-selected');
        });
    };

    const saveScrollNow = (teamId, offset) => {
        const list = membersWrap && membersWrap.querySelector('#et-member-list');
        if (!list || teamId == null) return;
        lsSet(scrollKey(teamId, offset), String(list.scrollTop || 0));
    };

    const requestScrollRestore = (teamId, offset) => {
        if (teamId == null) return;
        lsSet(restoreKey(teamId, offset), '1');
    };

    const setupMemberListPersistence = (ol, teamId, offset) => {
        if (!ol || teamId == null) return;

        ol.addEventListener('scroll', () => {
            lsSet(scrollKey(teamId, offset), String(ol.scrollTop || 0));
        }, { passive: true });

        const shouldRestore = lsGet(restoreKey(teamId, offset)) === '1';
        if (shouldRestore) {
            const saved = parseInt(lsGet(scrollKey(teamId, offset)) || '0', 10) || 0;
            ol.scrollTop = saved;
            lsDel(restoreKey(teamId, offset));
        } else {
            ol.scrollTop = 0;
        }
    };

    const onAttackClick = (memberId) => {
        if (currentTeamId == null) return;
        setSelectedMemberId(currentTeamId, memberId);
        saveScrollNow(currentTeamId, currentOffset);
        requestScrollRestore(currentTeamId, currentOffset);
        applySelectedHighlight(currentTeamId);
    };

    const buildAttackLink = (id) => {
        const url = `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${encodeURIComponent(id)}`;
        return el('a', { class: 'et-attack-link', href: url, text: 'Attack', onclick: () => onAttackClick(id) });
    };


    const isForeignHospitalDesc = (desc) => /^\s*In\s+(?:a|an)\s+.+\s+hospital\b/i.test((desc || '').trim());

    const makeRowsFromMembers = (members, baseOffset) => {
        const offset = baseOffset || 0;
        return (members || []).map((m, idx) => {
            const rawState = m.state || '';
            const desc = m.statusDesc || '';
            const displayState = formatStateDisplay(rawState, desc);
            const estRaw = m.id ? getEstimateHuman(m.id) : '';
            const estVal = parseEstimateNumber(estRaw);

            const isHospAbroad = rawState === 'Hospital' && isForeignHospitalDesc(desc);

            return {
                rank: offset + idx + 1,
                id: m.id,
                name: m.name ?? '',
                level: m.level ?? '',
                state: displayState,
                baseState: rawState,
                rawDesc: desc,
                isHospAbroad,
                attacks: m.attacks ?? 0,
                score: m.score ?? 0,
                isOkay: rawState === 'Okay',
                attackNode: m.id ? buildAttackLink(m.id) : null,
                estimateText: withNA(estRaw),
                estimateValue: estVal,
                lastStatus: m.lastStatus || '',
                lastRelative: m.lastRelative || '',
                until: m.until ?? null
            };
        });
    };



  const renderHiddenMembersMessage = () => {
    membersWrap.innerHTML = '';
    membersWrap.appendChild(el('div', { id: 'et-members-hidden', text: 'Members list hidden.' }));
  };

const renderMemberList = (rows) => {
  membersWrap.innerHTML = '';
  const ol = el('ol', { id: 'et-member-list' });

  const isTB = currentTeamId != null && String(currentTeamId) === String(TOTAL_BANKERS_ID);

  const teamId = currentTeamId;
  const offset = currentOffset;
  const selectedId = getSelectedMemberId(teamId);

  rows.forEach(r => {
    const li = el('li', {
      class: 'et-member-item',
      'data-id': String(r.id ?? '')
    });

    if (selectedId && String(r.id ?? '') === selectedId) li.classList.add('et-member-selected');

    const top = el('div', { class: 'et-member-top' });
    const bottom = el('div', { class: 'et-member-bottom' });

    const rankSpan = el('span', { text: `#${r.rank != null ? r.rank : '?'}` });

    let dotClass = 'et-dot-gray';
    if (r.baseState === 'Okay') dotClass = 'et-dot-green';
    else if (r.baseState === 'Hospital' || r.baseState === 'Jail') dotClass = 'et-dot-yellow';

    const dot = el('span', { class: `et-dot ${dotClass}` });

    const statusText = (r.lastStatus || '').trim();
    const statusSpan = el('span', { text: statusText ? ` ${statusText} ` : ' ' });

    const nameSpan = el('span', { text: `${r.name} | L${r.level} - ` });

    let stateClass = 'et-state-other';
    if (r.baseState === 'Okay') stateClass = 'et-state-okay';
    else if (r.baseState === 'Abroad' || r.baseState === 'Traveling') stateClass = 'et-state-abroad';

    let stateText = r.state;

    if (r.baseState === 'Hospital' && r.until != null) {
      const nowSec = Math.floor(Date.now() / 1000);
      const hosp = getHospitalDisplay(r.until, nowSec);
      if (hosp) {
        stateText = hosp.text;
        stateClass = hosp.className;
      }
    }

    const stateSpan = el('span', { class: stateClass, text: stateText });

    top.appendChild(rankSpan);
    top.appendChild(dot);
    top.appendChild(statusSpan);
    top.appendChild(nameSpan);
    top.appendChild(stateSpan);

    const bsCls = bsClassForValue(r.estimateValue);
    const estimateSpan = el('span', { class: bsCls, text: withNA(r.estimateText) });

    bottom.appendChild(document.createTextNode(`Attacks ${r.attacks} - `));
    bottom.appendChild(estimateSpan);

    if (isTB) {
      bottom.appendChild(document.createTextNode(' - Ally'));
    } else if (r.attackNode) {
      bottom.appendChild(document.createTextNode(' - '));
      bottom.appendChild(r.attackNode);
    }

    li.appendChild(top);
    li.appendChild(bottom);
    ol.appendChild(li);
  });

  membersWrap.appendChild(ol);
  setupMemberListPersistence(ol, teamId, offset);
  applySelectedHighlight(teamId);
};


    const updateHospitalTimers = () => {
        if (!membersWrap || currentMembersHidden || !currentRows.length) return;

        const list = membersWrap.querySelector('#et-member-list');
        if (!list) return;

        const nowSec = Math.floor(Date.now() / 1000);
        const items = list.querySelectorAll('.et-member-item');

        items.forEach(li => {
            const id = li.getAttribute('data-id');
            if (!id) return;

            const row = currentRows.find(r => String(r.id) === id);
            if (!row || row.baseState !== 'Hospital' || row.until == null) return;

            const stateSpan = li.querySelector(
                '.et-state-okay, .et-state-abroad, .et-state-other, .et-state-hosp-yellow, .et-state-hosp-green'
            );
            if (!stateSpan) return;

            const hosp = getHospitalDisplay(row.until, nowSec);
            if (!hosp) return;

            stateSpan.textContent = hosp.text;
            stateSpan.classList.remove('et-state-other', 'et-state-hosp-yellow', 'et-state-hosp-green');
            stateSpan.classList.add(hosp.className);
        });
    };


  const updateRangeLabel = () => {
    if (!rangeEl) return;
    if (!currentTeamName) { rangeEl.textContent = ''; return; }

    if (currentMembersHidden) {
      rangeEl.textContent = `${currentTeamName}`;
      return;
    }

    const start = currentOffset + 1;
    const end = lastFetchedCount > 0 ? (currentOffset + lastFetchedCount) : (currentOffset + PAGE_LIMIT);
    rangeEl.textContent = `${currentTeamName} ${start}-${end}`;
  };

  const updatePagerState = () => {
    if (prevBtn) prevBtn.disabled = currentMembersHidden || currentOffset <= 0;
    if (nextBtn) nextBtn.disabled = currentMembersHidden || lastFetchedCount < PAGE_LIMIT;
  };

  const applyAlwaysHide = (rows) => (rows || []).filter(r => !ALWAYS_HIDE_STATES.has(r.baseState));

    const LOCATION_KEYWORDS = {
        ME: ['mexico', 'mexican'],
        CI: ['cayman islands', 'caymanian'],
        CA: ['canada', 'canadian'],
        HA: ['hawaii', 'hawaiian'],
        UK: ['united kingdom', 'british', 'uk'],
        AR: ['argentina', 'argentinian', 'argentine'],
        SW: ['switzerland', 'swiss'],
        JP: ['japan', 'japanese'],
        CN: ['china', 'chinese'],
        UAE: ['united arab emirates', 'emirati', 'uae'],
        SA: ['south africa', 'south african']
    };

    const descMatchesCode = (desc, code) => {
        const d = (desc || '').toLowerCase();
        const keys = LOCATION_KEYWORDS[code] || [];
        return keys.some(k => d.includes(k));
    };

    const applyLocationFilter = (rows) => {
        const enabled = !!getVal(K.filterLocation, false);
        if (!enabled) return rows;

        const val = (getVal(K.locationValue, 'TORN') || 'TORN').toString().toUpperCase();

        if (val === 'TORN') {
            return (rows || []).filter(r =>
                                       r.baseState !== 'Abroad' &&
                                       r.baseState !== 'Traveling' &&
                                       !r.isHospAbroad
                                      );
        }

        if (!LOCATION_KEYWORDS[val]) return rows;

        return (rows || []).filter(r => {
            const locRelevant =
                  r.baseState === 'Abroad' ||
                  r.baseState === 'Traveling' ||
                  r.isHospAbroad;

            if (!locRelevant) return false;
            return descMatchesCode(r.rawDesc || '', val);
        });
    };


  const applyOnlineFilter = (rows) => {
    const enabled = !!getVal(K.filterOnline, false);
    if (!enabled) return rows;

    return (rows || []).filter(r => {
      const s = (r.lastStatus || '').toLowerCase();
      if (s === 'online') return true;
      if (s === 'idle') {
        return relativeWithinMinutes(r.lastRelative || '', 15);
      }
      return false;
    });
  };

  const applyBsFilter = (rows) => {
    const enabled = !!getVal(K.filterBsMax, false);
    if (!enabled) return rows;
    if (bsHigh == null) return rows;
    return (rows || []).filter(r => {
      if (r.estimateValue == null || Number.isNaN(r.estimateValue)) return false;
      return r.estimateValue <= bsHigh;
    });
  };

  const renderCurrentRows = () => {
    if (currentMembersHidden) {
      updateRangeLabel();
      updatePagerState();
      renderHiddenMembersMessage();
      return;
    }

    const onlyOkay = !!getVal(K.filterOkay, false);
    const base = applyAlwaysHide(currentRows);
    const afterLocation = applyLocationFilter(base);
    const afterOnline = applyOnlineFilter(afterLocation);
    const afterBs = applyBsFilter(afterOnline);
    const rows = onlyOkay ? afterBs.filter(r => r.isOkay) : afterBs;

    updateRangeLabel();
    renderMemberList(rows);
    updatePagerState();
  };

  const clearRows = () => {
    currentRows = [];
    lastFetchedCount = 0;
    renderCurrentRows();
  };

  const hideDock = (persist) => {
    if (!dock) return;
    dock.style.display = 'none';
    if (persist) setVal(K.hidden, true);
  };

  const showDock = () => {
    if (!dock) return;
    dock.style.display = '';
    setVal(K.hidden, false);
  };

  // === Drag ===
  const startDrag = (e) => {
    if (!dock) return;
    dragging = true;
    const rect = dock.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    e.preventDefault();
  };

  const onDrag = (e) => {
    if (!dragging || !dock) return;

    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const w = dock.offsetWidth;
    const h = dock.offsetHeight;

    let left = e.clientX - dragOffset.x;
    let top = e.clientY - dragOffset.y;

    left = Math.min(Math.max(0, left), Math.max(0, vw - w));
    top = Math.min(Math.max(0, top), Math.max(0, vh - h));

    dock.style.left = `${left}px`;
    dock.style.top = `${top}px`;
  };

  const endDrag = () => {
    if (!dragging || !dock) return;
    dragging = false;
    const rect = dock.getBoundingClientRect();
    setVal(K.panelPos, { top: Math.round(rect.top), left: Math.round(rect.left) });
  };

  // === Behavior ===
  const onTeamSelect = async (idx, force = false, offsetOverride = null) => {
    const teams = getTeams();
    const len = teams.length;

    currentMembersHidden = false;

    if (!len) {
      selectedIndex = 1;
      selectedTeamId = null;
      currentOffset = 0;
      currentTeamId = null;
      currentTeamName = '';
      buildTeamList([]);
      setVal(K.lastIndex, 1);
      setVal(K.lastTeamId, null);
      setStatus('No teams saved. Use First-Fetch.');
      clearRows();
      return;
    }

    const safeIdx = clamp(parseInt(idx, 10) || 1, 1, len);
    const team = teams[safeIdx - 1];

    selectedIndex = safeIdx;
    selectedTeamId = team?.id ?? null;
    setVal(K.lastIndex, safeIdx);
    setVal(K.lastTeamId, selectedTeamId);

    currentTeamId = team?.id ?? null;
    currentTeamName = team?.name ?? `Team ${safeIdx}`;

    markActiveTeam();

    if (!currentTeamId) {
      currentOffset = 0;
      setStatus('Team ID missing.');
      clearRows();
      return;
    }

    const storedOffsetKey = `${K.offsetPrefix}${currentTeamId}`;
    const storedOffset = parseInt(getVal(storedOffsetKey, 0), 10) || 0;

    currentOffset = offsetOverride !== null && offsetOverride !== undefined
      ? Math.max(0, parseInt(offsetOverride, 10) || 0)
      : Math.max(0, storedOffset);

    setVal(storedOffsetKey, currentOffset);

    const cacheKey = `${K.cachePrefix}${currentTeamId}_${currentOffset}`;
    const cached = getVal(cacheKey, null);

    if (cached && !force) {
      setStatus('Loaded cached members.');
      currentRows = makeRowsFromMembers(cached, currentOffset);
      lastFetchedCount = Array.isArray(cached) ? cached.length : 0;
      renderCurrentRows();
      return;
    }

    if (!isMaster()) {
      setStatus('This is a secondary tab. API calls are disabled here.');
      return;
    }

    setStatus(`Fetching members ${currentOffset + 1}-${currentOffset + PAGE_LIMIT}...`);
    const res = await fetchTeamMembersPage(currentTeamId, currentOffset);

    if (!res || res.error) {
      if (res?.error) setStatus(`Error ${res.error.code}: ${res.error.error}`);
      else setStatus('Failed to fetch members.');
      clearRows();
      return;
    }

    setVal(cacheKey, res.members);
    lastFetchedCount = res.count || 0;

    setStatus(`Loaded ${lastFetchedCount} members.`);
    currentRows = makeRowsFromMembers(res.members, currentOffset);
    renderCurrentRows();
  };

  // === Menu + reset ===
  const resetScriptData = () => {
    const keys = listVals().filter(k => String(k).startsWith('et_'));
    keys.forEach(delVal);

    if (dock) dock.remove();
    dock = null;
    panel = null;
    teamsPanel = null;

    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    if (teamsRefreshTimer) { clearTimeout(teamsRefreshTimer); teamsRefreshTimer = null; }
    if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null; }

    try { localStorage.removeItem(MASTER_KEY); } catch (_) {}
    try { sessionStorage.removeItem(TAB_ID_KEY); } catch (_) {}

    bootstrap();
  };

  const initMenu = () => {
    GM_registerMenuCommand('Show/Hide Elimination Team', () => {
      const hidden = !!getVal(K.hidden, false);
      if (hidden) showDock();
      else hideDock(true);
    });

    GM_registerMenuCommand('Reset Elimination Team Data', () => {
      resetScriptData();
    });
  };

  const initAuto = async () => {
    const teams = getTeams();
    const keys = getKeys();

    if (!teams.length) {
      buildTeamList([]);
      if (keys.length && isMaster()) {
        await firstFetch();
      } else {
        clearRows();
      }
      return;
    }

    const storedId = getVal(K.lastTeamId, null);
    let idx = 1;
    let id = teams[0].id;

    if (storedId != null) {
      const foundIndex = teams.findIndex(t => String(t.id) === String(storedId));
      if (foundIndex !== -1) {
        idx = foundIndex + 1;
        id = teams[foundIndex].id;
      }
    } else {
      const storedIdx = parseInt(getVal(K.lastIndex, 1), 10) || 1;
      idx = clamp(storedIdx, 1, teams.length);
      id = teams[idx - 1].id;
    }

    selectedIndex = idx;
    selectedTeamId = id;
    setVal(K.lastIndex, idx);
    setVal(K.lastTeamId, id);

    buildTeamList(teams);

    currentTeamId = id;
    currentTeamName = teams[idx - 1]?.name ?? `Team ${idx}`;

    const storedOffsetKey = `${K.offsetPrefix}${currentTeamId}`;
    currentOffset = parseInt(getVal(storedOffsetKey, 0), 10) || 0;

    const cacheKey = `${K.cachePrefix}${currentTeamId}_${currentOffset}`;
    const cached = getVal(cacheKey, null);
    if (cached) {
      setStatus('Loaded cached members.');
      currentRows = makeRowsFromMembers(cached, currentOffset);
      lastFetchedCount = Array.isArray(cached) ? cached.length : 0;
      renderCurrentRows();
      return;
    }

    if (isMaster()) {
      await onTeamSelect(idx, false, currentOffset);
    } else {
      setStatus('This is a secondary tab. API calls are disabled here.');
    }
  };

  const bootstrap = () => {
    startHeartbeat();
    buildPanel();
    setTeamsHeaderUpdated(null);
    initMenu();

    const hidden = !!getVal(K.hidden, false);
    if (hidden) hideDock(false);

    initAuto();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
