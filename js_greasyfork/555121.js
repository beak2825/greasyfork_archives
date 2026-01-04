// ==UserScript==
// @name         Torn Loadout Test
// @namespace    jfk.portal
// @version      1.1.1
// @description  Shows loadout data on the attack loader page (reads on-page gear when visible; falls back to backend when hidden).
// @author       HuzGPT
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-start
// @grant        GM_GetValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      api.justferkillin.com
// @downloadURL https://update.greasyfork.org/scripts/555121/Torn%20Loadout%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/555121/Torn%20Loadout%20Test.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ======================== Config ======================== */
  const API_BASE = 'https://api.justferkillin.com/api';
  const LOADOUT_ENDPOINT = '/loadouts/record';

  const AUTO_PUSH = true;
  const DEBUG_VIEW = false;
  const DEDUPE_LOCAL = true;
  const DEBUG_LOG = false;

  const DUMMY_ON_EMPTY = false;   // show a dummy when nothing readable (debug)
  const POST_DUMMY = false;       // don't POST dummy by default
  const FALLBACK_TO_BACKEND = true;

  const postedForAttackId = new Set();
  let postedOnceThisPage = false;

  // Wait-for-readable watcher after Start/Join
  let AWAIT_READABLE_AFTER_START = false;
  let AWAIT_TIMER = null;
  const AWAIT_WINDOW_MS = 45_000;

  // Persisted API key
  const GM_API_KEY = 'JFK_TORN_API_KEY';
  const PRINT_KEY = false;

  function ensureApiKey() {
    let key = GM_getValue(GM_API_KEY);
    if (!key) {
      key = prompt('Enter your Torn API key:');
      if (key) GM_setValue(GM_API_KEY, key.trim());
    }
    return (key || '').trim();
  }
  let apiKey = (GM_getValue(GM_API_KEY, '') || '').trim();
  if (!apiKey) {
    apiKey = prompt('Enter your JFK API key:') || '';
    if (apiKey) GM_setValue(GM_API_KEY, apiKey.trim());
  }
  apiKey = (apiKey || '').trim();
  if (PRINT_KEY) console.log('[JFK-LOADOUT] Using API key:', apiKey || '(empty)');

  function authHeaders() {
    const key = ensureApiKey();
    return key ? { Authorization: key } : {};
  }

  /* ======================== Helpers / Net ======================== */
  const log = (...a) => { if (DEBUG_LOG) console.log('[JFK-LOADOUT]', ...a); };
  const toNumber = x => (Number.isFinite(Number(x)) ? Number(x) : null);
  const stripHtml = s => (s ? String(s).replace(/<[^>]*>/g, ' ').trim() : null);

  function gmFetch(method, path, query = {}, body = null) {
    const base = API_BASE.replace(/\/+$/, '');
    const url = new URL(base + path);
    Object.entries(query || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
    const gmXHR = (GM && GM.xmlHttpRequest) || GM_xmlhttpRequest;

    return new Promise((resolve, reject) => {
      gmXHR({
        method,
        url: url.toString(),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...authHeaders(),
        },
        data: body ? JSON.stringify(body) : undefined,
        timeout: 30000,
        onload: (resp) => {
          let parsed = null;
          try { parsed = resp.responseText ? JSON.parse(resp.responseText) : null; } catch { parsed = resp.responseText || null; }
          if (resp.status >= 200 && resp.status < 300) resolve(parsed);
          else reject(new Error(parsed?.message || resp.responseText || `HTTP ${resp.status}`));
        },
        onerror: (err) => reject(new Error(err?.message || 'Network error')),
        ontimeout: () => reject(new Error('Request timed out')),
      });
    });
  }
  const apiGET = (p, q) => gmFetch('GET', p, q, null);
  const apiPOST = (p, b) => gmFetch('POST', p, null, b);

  /* ======================== Normalisers ======================== */
  const WEAPON_KEYS = new Set(['1','2','3','5']);
  const ARMOUR_KEYS = new Set(['4','6','7','8','9']);
  const WEAPON_SLOTS = { '1': 'Primary', '2': 'Secondary', '3': 'Melee', '5': 'Temporary' };
  const PLACEHOLDER_BONUS_RE = /^(?:blank\s+bonus(?:\s*25%?)?|item\s+bonus|bonus|empty|none)$/i;

  function extractBonuses(currentBonuses) {
    if (!currentBonuses) return [];
    const out = [];
    for (const k of Object.keys(currentBonuses)) {
      const b = currentBonuses[k];
      if (!b) continue;
      const title = (b.title ?? '').trim();
      if (!title || PLACEHOLDER_BONUS_RE.test(title)) continue;
      out.push({ title, value: b.value ?? null, desc: stripHtml(b.desc) });
    }
    out.sort((a,b)=> (a.title||'').localeCompare(b.title||'') || (a.value||'').localeCompare(b.value||''));
    return out;
  }
  function extractUpgrades(currentUpgrades) {
    if (!currentUpgrades) return [];
    const out = (Array.isArray(currentUpgrades) ? currentUpgrades : []).map(u => ({
      title: u?.title ?? null,
      desc: stripHtml(u?.desc),
    }));
    out.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    return out;
  }
  function mapWeapon(item0) {
    if (!item0) return null;
    const name = item0.name ?? '';
    if (!name || name.toLowerCase() === 'unknown') return null;
    return {
      name,
      dmg: item0.dmg ?? null,
      acc: item0.acc ?? null,
      quality: item0.quality ?? null,
      glowClass: item0.glowClass ?? '',
      bonuses: extractBonuses(item0.currentBonuses),
      upgrades: extractUpgrades(item0.currentUpgrades),
      type: item0.type ?? null,
    };
  }
  function mapArmour(item0) {
    if (!item0) return null;
    const name = item0.name ?? '';
    if (!name || name.toLowerCase() === 'unknown') return null;
    return {
      name,
      glowClass: item0.glowClass ?? '',
      bonuses: extractBonuses(item0.currentBonuses),
      defense: item0.defense ?? item0.armor ?? item0.armour ?? null,
      type: item0.type ?? null,
    };
  }

  /* ======= Readable-gear helpers (fixes Gun Shop employee cases) ======= */
  function pickReadableItems(DB) {
    // Prefer explicit readable buckets when present, then classic keys
    return (
      DB?.defenderItemsReadable ??
      DB?.visibleDefenderItems ??
      DB?.defender_items_readable ??
      DB?.defenderItems ??
      DB?.defender_items ??
      {}
    );
  }
  function firstItemFlexible(slot) {
    // Accepts {item:[...]}, {item:{...}}, [{item:[...]}], or the object itself
    if (!slot) return null;
    const src = slot.item ?? slot?.[0]?.item ?? slot;
    if (!src) return null;
    return Array.isArray(src) ? (src[0] ?? null) : src;
  }

  /* ======================== Compact, no-shift UI ======================== */
  const styles = `
:root{
  --jfk-bg-1:#0b1220; --jfk-bg-2:#0f1724;
  --jfk-ac:#e11d48; --jfk-border:rgba(255,255,255,0.05);
  --jfk-text:#e6e7eb; --jfk-sub:#9aa6b2;
}
.loadout-helper-container{
  position:absolute;top:0;left:100%;margin-left:10px;
  width:320px;max-width:320px;z-index:9999;
  font-family:Inter,system-ui,sans-serif;color:var(--jfk-text);
  font-size:12.5px;pointer-events:auto;box-sizing:border-box;
}
.loadout-helper-layout-container{
  background:linear-gradient(180deg,var(--jfk-bg-2),var(--jfk-bg-1));
  border:1px solid var(--jfk-border);border-radius:10px;
  padding:.5rem .65rem;box-shadow:0 6px 16px rgba(2,6,23,.5);
  max-height:68vh;overflow:auto;
  scrollbar-width:thin;
  scrollbar-color:#222 rgba(255,255,255,0.03);
}
.loadout-helper-layout-container::-webkit-scrollbar{ width:6px;height:6px; }
.loadout-helper-layout-container::-webkit-scrollbar-track{ background:rgba(255,255,255,0.03);border-radius:6px; }
.loadout-helper-layout-container::-webkit-scrollbar-thumb{
  background:linear-gradient(180deg,#1a1a1a,#2a2a2a);
  border-radius:6px; box-shadow:inset 0 0 2px rgba(255,255,255,0.05);
}
.loadout-helper-layout-container::-webkit-scrollbar-thumb:hover{
  background:linear-gradient(180deg,#2d2d2d,#3b3b3b);
  box-shadow:inset 0 0 4px rgba(255,255,255,0.1);
}
.loadout-helper-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;}
.loadout-helper-title{font-size:13px;font-weight:700;}
.loadout-helper-status{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.05);}
.loadout-helper-status.ok{color:#9ae6b4;background:rgba(16,185,129,0.1);}
.loadout-helper-status.fail{color:#fecaca;background:rgba(239,68,68,0.1);}
.loadout-helper-status.warn{color:#fef3c7;background:rgba(250,204,21,0.1);}
.loadout-helper-empty{border:1px dashed rgba(255,255,255,.08);padding:.4rem .6rem;border-radius:8px;font-size:12px;color:var(--jfk-sub);margin-top:4px;}
.loadout-helper-pill{display:inline-block;border-radius:999px;border:1px solid rgba(255,255,255,.06);padding:0 6px;font-size:11px;margin-left:4px;}
.loadout-helper-weapon-info,.loadout-helper-armor-info{border:1px solid rgba(255,255,255,0.04);border-radius:8px;background:rgba(255,255,255,0.02);padding:.4rem .5rem;margin-bottom:.4rem;}
.loadout-helper-weapon-slot,.loadout-helper-armor-slot{font-size:12.5px;font-weight:600;margin-bottom:2px;display:flex;justify-content:space-between;}
.loadout-helper-weapon-damage,.loadout-helper-armor-armor{font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05);margin-bottom:4px;padding-bottom:3px;color:var(--jfk-text);}
.loadout-helper-weapon-bonus-name,.loadout-helper-armor-bonus-name{font-weight:600;font-size:12px;margin:0;display:flex;align-items:center;gap:4px;}
.loadout-helper-weapon-bonus-value,.loadout-helper-armor-bonus-value{margin:0;font-size:11.5px;color:var(--jfk-sub);padding-left:4px;}
.loadout-helper-weapon-bonus-type{font-size:10.5px;color:#ccc;background:rgba(255,255,255,0.05);border-radius:999px;padding:0 5px;}
@media (max-width:1100px){.loadout-helper-container{width:300px;max-width:300px;}}
@media (max-width:980px){.loadout-helper-container{position:absolute;left:50%;transform:translateX(-50%);margin-left:0;width:92vw;max-width:92vw;}}
.loadout-helper-level{
  display:inline-block;margin-left:6px;padding:1px 6px;border-radius:999px;font-size:11px;font-weight:600;color:#d1d5db;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.10);
}
`;

  function ensureStyle() {
    if (document.getElementById('jfk-loadout-style')) return;
    const s = document.createElement('style');
    s.id = 'jfk-loadout-style';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  function getDefenderNameFromDOM() {
    const els = Array.from(document.querySelectorAll('span.user-name, span[class*="userName"], span[class*="user-name"]'));
    return els[1]?.textContent?.trim() || null;
  }
  function getUser2IdFromUrl() {
    try {
      const u = new URL(location.href);
      const v = u.searchParams.get('user2ID');
      return v ? Number(v) : null;
    } catch { return null; }
  }

  /* ======================== Rendering ======================== */
  function renderRightPanel(weapons, armours, meta = {}, opts = {}) {
    ensureStyle();
    const defenderContainer = document.querySelector('div[class^="playersModelWrap"]');
    if (!defenderContainer) return false;

    let mount = defenderContainer.querySelector('.loadout-helper-container');
    if (!mount) {
      mount = document.createElement('div');
      mount.className = 'loadout-helper-container';
      if (!/(relative|absolute|fixed)/.test(defenderContainer.style.position)) {
        defenderContainer.style.position = 'relative';
      }
      defenderContainer.appendChild(mount);
    }
    mount.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'loadout-helper-header';

    const title = document.createElement('div');
    title.className = 'loadout-helper-title';

    const whoName = meta?.name || getDefenderNameFromDOM() || 'Defender';
    const nameEl = document.createElement('span');
    nameEl.textContent = whoName;
    title.appendChild(nameEl);

    const lvl = (meta && typeof meta.level !== 'undefined') ? meta.level : null;
    if (lvl !== null && lvl !== undefined && lvl !== '' && !Number.isNaN(Number(lvl))) {
      const lvlEl = document.createElement('span');
      lvlEl.className = 'loadout-helper-level';
      lvlEl.textContent = `Lv ${lvl}`;
      title.appendChild(lvlEl);
    }

    header.appendChild(title);

    if (DEBUG_VIEW) {
      const status = document.createElement('div');
      status.className = 'loadout-helper-status';
      status.id = 'jfk-loadout-status';
      status.textContent = 'idle';
      header.appendChild(status);
    }

    mount.appendChild(header);

    const layout = document.createElement('div');
    layout.className = 'loadout-helper-layout-container';

    const haveItems = (weapons && weapons.length) || (armours && armours.length);
    if (!haveItems && !DEBUG_VIEW && !opts.forceShow) return false;

    if (!haveItems && (DEBUG_VIEW || opts.forceShow)) {
      const box = document.createElement('div');
      box.className = 'loadout-helper-empty';
      const who = meta.name || getDefenderNameFromDOM() || 'Defender';
      const badge = opts.dummy ? '<span class="loadout-helper-pill">dummy</span>' : '<span class="loadout-helper-pill">debug</span>';
      box.innerHTML = `<strong>${who}</strong>${badge}<br>${opts.dummy ? 'Showing dummy gear loadout.' : 'No loadout items detected yet — waiting for attackData or hidden slots.'}`;
      layout.appendChild(box);
    }

    (weapons || []).forEach((w) => {
      const wrap = document.createElement('div');
      wrap.className = `loadout-helper-weapon-info ${w.glowClass || ''}`;

      const slot = document.createElement('p');
      slot.className = 'loadout-helper-weapon-slot';
      slot.textContent = `${w.name}`;
      wrap.appendChild(slot);

      const dmg = document.createElement('p');
      dmg.className = 'loadout-helper-weapon-damage';
      dmg.textContent = `Dmg ${w.dmg ?? '—'} | Acc ${w.acc ?? '—'} | Q ${w.quality ?? 'N/A'}`;
      wrap.appendChild(dmg);

      if (w.bonuses?.length) {
        for (const b of w.bonuses) {
          const head = document.createElement('p');
          head.className = 'loadout-helper-weapon-bonus-name';
          head.innerHTML = `${b.title}${b.value ? ` (${b.value})` : ''} <span class="loadout-helper-weapon-bonus-type">(Bonus)</span>`;
          wrap.appendChild(head);
          if (b.desc) {
            const val = document.createElement('p');
            val.className = 'loadout-helper-weapon-bonus-value';
            val.textContent = b.desc;
            wrap.appendChild(val);
          }
        }
      }

      if (w.upgrades?.length) {
        for (const u of w.upgrades) {
          const head = document.createElement('p');
          head.className = 'loadout-helper-weapon-bonus-name';
          head.textContent = u.title || 'Attachment';
          wrap.appendChild(head);
          if (u.desc) {
            const val = document.createElement('p');
            val.className = 'loadout-helper-weapon-bonus-value';
            val.textContent = u.desc;
            wrap.appendChild(val);
          }
        }
      }

      layout.appendChild(wrap);
    });

    (armours || []).forEach((a) => {
      const wrap = document.createElement('div');
      wrap.className = `loadout-helper-armor-info ${a.glowClass || ''}`;
      const slot = document.createElement('p');
      slot.className = 'loadout-helper-armor-slot';
      slot.textContent = `${a.name}`;
      wrap.appendChild(slot);
      if (a.bonuses?.length) {
        for (const b of a.bonuses) {
          const head = document.createElement('p');
          head.className = 'loadout-helper-armor-bonus-name';
          head.textContent = `${b.title}${b.value ? ` (${b.value})` : ''}`;
          wrap.appendChild(head);
          if (b.desc) {
            const val = document.createElement('p');
            val.className = 'loadout-helper-armor-bonus-value';
            val.textContent = b.desc;
            wrap.appendChild(val);
          }
        }
      }
      layout.appendChild(wrap);
    });

    mount.appendChild(layout);

    if (opts.status) {
      updateStatusBadge(opts.status);
    } else {
      const last = GM_getValue('JFK_LOADOUT_LAST_STATUS', null);
      if (last) updateStatusBadge(last);
    }

    return true;
  }

  function updateStatusBadge(obj) {
    if (!DEBUG_VIEW) return;
    try {
      const el = document.querySelector('#jfk-loadout-status');
      if (!el) return;
      const when = new Date(obj.at || Date.now()).toLocaleTimeString();
      const state = (obj.state || 'idle').toLowerCase();
      el.textContent = `${state} @ ${when}`;
      el.classList.remove('ok','fail','warn');
      if (state === 'posted') el.classList.add('ok');
      else if (state === 'failed') el.classList.add('fail');
      else if (state === 'deduped' || state === 'no-items' || state === 'await-start') el.classList.add('warn');
      GM_setValue('JFK_LOADOUT_LAST_STATUS', { state, at: (obj.at || Date.now()) });
    } catch {}
  }

  /* ======================== Payload + dedupe ======================== */
  function buildPayload(json) {
    const DB = json?.DB || {};
    const defenderUser =
      DB?.defenderUser || DB?.defender_user || DB?.defender || {};

    // robust: choose correct readable set; fallback to classic
    const defenderItems = pickReadableItems(DB);

    const fallbackId = getUser2IdFromUrl();
    const defender = {
      user_id: toNumber(defenderUser?.ID ?? defenderUser?.id) ?? fallbackId ?? null,
      name: defenderUser?.name ?? getDefenderNameFromDOM() ?? null,
      level: toNumber(defenderUser?.level),
      faction_id: toNumber(defenderUser?.factionID ?? defenderUser?.faction_id),
      faction_name: defenderUser?.faction ?? null,
    };

    const weapons = [];
    const armours = [];

    // normalize keys to strings so they match WEAPON_KEYS/ARMOUR_KEYS
    for (const k in defenderItems) {
      const slotKey = String(k);
      const slot = defenderItems[k];

      const it = firstItemFlexible(slot);
      if (!it) continue;

      const nm = (it.name || '').trim().toLowerCase();
      if (!nm || nm === 'unknown') continue;

      if (WEAPON_KEYS.has(slotKey)) {
        const w = mapWeapon(it);
        if (w) weapons.push({ slot_key: slotKey, slot: WEAPON_SLOTS[slotKey] || `Weapon-${slotKey}`, ...w });
      } else if (ARMOUR_KEYS.has(slotKey)) {
        const a = mapArmour(it);
        if (a) armours.push({ slot_key: slotKey, ...a });
      }
    }

    weapons.sort((a,b)=> (a.slot_key||'').localeCompare(b.slot_key||'') || (a.name||'').localeCompare(b.name||''));
    armours.sort((a,b)=> (a.slot_key||'').localeCompare(b.slot_key||'') || (a.name||'').localeCompare(b.name||''));

    const attackId =
      json?.attack_id ??
      json?.DB?.attack_id ??
      json?.DB?.attackDisplay?.id ??
      json?.DB?.attack_display?.id ??
      null;

    return {
      context: {
        attack_id: toNumber(attackId),
        captured_at: Math.floor(Date.now() / 1000),
        page: 'loader.php?sid=attack',
      },
      defender,
      weapons,
      armour: armours,
    };
  }

  function djb2(str) { let h = 5381; for (let i=0;i<str.length;i++) h=((h<<5)+h)^str.charCodeAt(i); return (h>>>0).toString(16); }
  function stableSig(payload) {
    const norm = {
      user_id: payload?.defender?.user_id ?? null,
      name: payload?.defender?.name ?? null,
      weapons: (payload?.weapons || []).map(w => ({
        slot_key:w.slot_key, slot:w.slot, name:w.name, dmg:w.dmg, acc:w.acc, quality:w.quality, type:w.type,
        bonuses:(w.bonuses||[]).map(b=>({title:b.title, value:b.value, desc:b.desc})),
        upgrades:(w.upgrades||[]).map(u=>({title:u.title, desc:u.desc}))
      })),
      armour: (payload?.armour || []).map(a => ({
        slot_key:a.slot_key, name:a.name, defense:a.defense, type:a.type,
        bonuses:(a.bonuses||[]).map(b=>({title:b.title, value:b.value, desc:b.desc}))
      })),
      dummy: !!payload?.context?.debug_dummy,
    };
    return djb2(JSON.stringify(norm));
  }
  const lastSigKey = (userId) => `JFK_LOADOUT_LASTSIG_${userId || 'unknown'}`;

  function summarizeBody(body) {
    try {
      const d = typeof body === 'string' ? JSON.parse(body) : body;
      return {
        defender: { user_id: d.defender?.user_id ?? null, name: d.defender?.name ?? null },
        weapons: (d.weapons || []).map(w => ({ slot: w.slot, name: w.name, dmg: w.dmg, acc: w.acc })),
        armour: (d.armour || []).map(a => ({ slot_key: a.slot_key, name: a.name })),
        attack_id: d.context?.attack_id ?? null,
        debug_dummy: !!d.context?.debug_dummy,
      };
    } catch {
      return { length: ('' + body).length || null };
    }
  }

  async function maybeSend(payload) {
    const haveItems = (payload.weapons && payload.weapons.length) || (payload.armour && payload.armour.length);
    if (!AUTO_PUSH) { log('AUTO_PUSH off'); updateStatusBadge({ state:'auto-off', at:Date.now() }); return; }
    if (!haveItems) { log('No items, nothing to send'); updateStatusBadge({ state:'no-items', at:Date.now() }); return; }

    const attackId = payload?.context?.attack_id ?? null;
    if (attackId != null) {
      if (postedForAttackId.has(attackId)) {
        log('Skipping send: already posted for attack_id', attackId);
        updateStatusBadge({ state:'deduped', at:Date.now() }); return;
      }
    } else if (postedOnceThisPage) {
      log('Skipping send: already posted once this page (no attack_id)');
      updateStatusBadge({ state:'deduped', at:Date.now() }); return;
    }

    const uid = payload?.defender?.user_id || 'unknown';
    const sig = stableSig(payload);
    if (DEDUPE_LOCAL) {
      const key = lastSigKey(uid);
      const prev = GM_getValue(key, '');
      if (prev === sig) {
        log('No change in gear signature → not posting.', { user: uid, sig });
        updateStatusBadge({ state:'deduped', at:Date.now() }); return;
      }
      GM_setValue(key, sig); // optimistic
    }

    log('Attempting to POST loadout', { user: uid, sig, summary: summarizeBody(payload) });
    updateStatusBadge({ state:'sending', at:Date.now() });

    try {
      const res = await apiPOST(LOADOUT_ENDPOINT, payload);
      log('Posted loadout snapshot (backend response):', res);
      updateStatusBadge({ state:'posted', at:Date.now() });
      if (attackId != null) postedForAttackId.add(attackId);
      else postedOnceThisPage = true;
    } catch (e) {
      try {
        if (DEDUPE_LOCAL) {
          const key = lastSigKey(uid);
          if (GM_getValue(key, '') === sig) GM_setValue(key, '');
        }
      } catch {}
      log('Push failed:', e?.message || e);
      updateStatusBadge({ state:'failed', at:Date.now() });
      console.warn('[JFK-LOADOUT] Push failed:', e?.message || e);
    }
  }

  /* ======================== Backend fallback ======================== */
  async function fetchLatestSnapshotForUser(userId) {
    if (!FALLBACK_TO_BACKEND || !userId) return null;
    try {
      const res = await apiGET('/loadouts/recent', { user_id: Number(userId), limit: 1 });
      const rows = Array.isArray(res) ? res : (Array.isArray(res?.rows) ? res.rows : []);
      return rows?.[0] || null;
    } catch (e) {
      log('fallback: backend fetch failed', e?.message || e);
      return null;
    }
  }
  function snapshotToClientLists(snapshot) {
    if (!snapshot) return { weapons: [], armour: [], defender: {} };
    const weapons = Array.isArray(snapshot.weapons) ? snapshot.weapons : [];
    const armour  = Array.isArray(snapshot.armour)  ? snapshot.armour  : [];
    const defender = snapshot.defender || {};
    return { weapons, armour, defender };
  }
  function makeDummyPayload() {
    const name = getDefenderNameFromDOM() || 'Unknown';
    const user_id = getUser2IdFromUrl() || null;
    const weapons = [{
      slot_key:'1', slot:'Primary', name:'ArmaLite M-15A44', dmg:80.21, acc:64.064, quality:'N/A', glowClass:'', type:'primary',
      bonuses:[{title:'Powerful',value:'23',desc:'23% increased damage'},{title:'Assassinate',value:'51',desc:'51% increased damage on the first turn'}],
      upgrades:[{title:'Reflex Sight',desc:'+1.00 Accuracy'},{title:'5mW Laser',desc:'+3% critical hit rate'}],
    },{
      slot_key:'3', slot:'Melee', name:'Pillow', dmg:1.65, acc:65.2715, quality:'N/A', glowClass:'', type:'melee',
      bonuses:[], upgrades:[],
    }];
    const armours = [{
      slot_key:'9', name:'Delta Body', glowClass:'', type:'body', defense:null,
      bonuses:[{ title:'Invulnerable', value:'9', desc:'9% reduced negative status effects' }],
    }];
    return {
      context:{ attack_id:null, captured_at:Math.floor(Date.now()/1000), page:'loader.php?sid=attack', debug_dummy:true },
      defender:{ user_id, name, level:null, faction_id:null, faction_name:null },
      weapons, armour:armours,
    };
  }

  /* ======================== Start/Join watcher ======================== */
  function isStartJoinButton(el) {
    if (!el || el.tagName !== 'BUTTON') return false;
    const t = (el.textContent || '').trim().toLowerCase();
    if (!t) return false;
    return t === 'start fight' || t === 'join fight';
  }
  function findStartJoinButtons() {
    const btns = Array.from(document.querySelectorAll('button[type="submit"], button'));
    return btns.filter(isStartJoinButton);
  }
  function armAwaitReadable() {
    if (AWAIT_READABLE_AFTER_START) return;
    AWAIT_READABLE_AFTER_START = true;
    updateStatusBadge({ state:'await-start', at: Date.now() });
    clearTimeout(AWAIT_TIMER);
    AWAIT_TIMER = setTimeout(() => {
      AWAIT_READABLE_AFTER_START = false;
      updateStatusBadge({ state:'timeout', at: Date.now() });
    }, AWAIT_WINDOW_MS);
  }
  function disarmAwaitReadable() {
    AWAIT_READABLE_AFTER_START = false;
    clearTimeout(AWAIT_TIMER);
    AWAIT_TIMER = null;
  }
  function hookStartJoinButtons() {
    for (const btn of findStartJoinButtons()) {
      if (btn.dataset.jfkStartHook === '1') continue;
      btn.dataset.jfkStartHook = '1';
      btn.addEventListener('click', () => {
        log('Start/Join clicked → arming post-after-start');
        armAwaitReadable();
        setTimeout(() => {
          if (!findStartJoinButtons().length) {
            log('Start/Join button disappeared → still armed');
          }
        }, 800);
      }, { once: true });
    }
  }
  function observeStartJoinPresence() {
    const root = document.body;
    const mo = new MutationObserver(() => hookStartJoinButtons());
    mo.observe(root, { childList: true, subtree: true });
    hookStartJoinButtons();
  }

  /* ======================== Fetch interception ======================== */
  (function hookFetch() {
    const waitForFetch = () => {
      const orig = unsafeWindow?.fetch;
      if (typeof orig !== 'function') return void setTimeout(waitForFetch, 120);
      const bound = orig.bind(unsafeWindow);

      unsafeWindow.fetch = async (...args) => {
        const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
        const isAttackData = url.includes('/loader.php?sid=attackData');

        const res = await bound(...args);

        if (isAttackData) {
          const cloned = res.clone();
          cloned.json().then((json) => {
            setTimeout(async () => {
              try {
                const payload = buildPayload(json);
                const haveItems = (payload.weapons && payload.weapons.length) || (payload.armour && payload.armour.length);

                if (!haveItems) {
                  observeStartJoinPresence();
                  if (!findStartJoinButtons().length) {
                    armAwaitReadable();
                  }
                  const uid = payload?.defender?.user_id || getUser2IdFromUrl() || null;
                  const snap = await fetchLatestSnapshotForUser(uid);
                  if (snap) {
                    const { weapons: fw, armour: fa, defender: fdef } = snapshotToClientLists(snap);
                    renderRightPanel(fw, fa, fdef, { forceShow: true, status: { state: 'fallback', at: Date.now() } });
                    return;
                  }
                  if (DEBUG_VIEW) {
                    if (DUMMY_ON_EMPTY) {
                      const dummy = makeDummyPayload();
                      renderRightPanel(dummy.weapons, dummy.armour, dummy.defender, { dummy: true, forceShow: true, status: { state: 'generated-dummy', at: Date.now() } });
                      if (POST_DUMMY) await maybeSend(dummy);
                    } else {
                      renderRightPanel([], [], {}, { forceShow: true, status: { state: 'debug-empty', at: Date.now() } });
                    }
                  } else {
                    hideRightPanel();
                  }
                  return;
                }

                // Have readable items (incl. Gun Shop staff cases)
                if (AWAIT_READABLE_AFTER_START) {
                  log('Readable gear detected after start/join → posting once');
                  disarmAwaitReadable();
                }

                renderRightPanel(payload.weapons, payload.armour, payload.defender);
                await maybeSend(payload);

              } catch (e) {
                console.warn('[JFK-LOADOUT] Build/render error:', e);
                if (DEBUG_VIEW) renderRightPanel([], [], {}, { forceShow: true });
                updateStatusBadge({ state: 'render-error', at: Date.now() });
              }
            }, 100);
          }).catch(() => {
            if (DEBUG_VIEW) {
              log('attackData parse failed; showing placeholder.');
              renderRightPanel([], [], {}, { forceShow: true });
              updateStatusBadge({ state: 'parse-failed', at: Date.now() });
            }
          });
        }

        return res;
      };

      log('attackData hook installed (full logic).');
    };
    waitForFetch();
  })();

  // Restore last status
  try {
    const last = GM_getValue('JFK_LOADOUT_LAST_STATUS', null);
    if (last && typeof last === 'object') log('Restored last status from storage', last);
  } catch {}

  function hideRightPanel() {
    const defenderContainer = document.querySelector('div[class^="playersModelWrap"]');
    const mount = defenderContainer?.querySelector('.loadout-helper-container');
    if (mount) mount.remove();
  }
})();
