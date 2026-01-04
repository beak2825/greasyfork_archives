// ==UserScript==
// @name         Torn — OC Helper Panel
// @namespace    https://torn.com/
// @version      1.0.2
// @description  Floating OC panel: save API key, sync faction members, update available crimes, show who is in OC (and item status) + who is not registered.
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/560253/Torn%20%E2%80%94%20OC%20Helper%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/560253/Torn%20%E2%80%94%20OC%20Helper%20Panel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS = {
    hidden: 'sgta_oc_panel_hidden',
    pos: 'sgta_oc_panel_pos',

    membersMap: 'sgta_oc_members_map',
    memberIds: 'sgta_oc_member_ids',
    membersRaw: 'sgta_oc_members_raw',
    membersAt: 'sgta_oc_members_at',

    crimesRaw: 'sgta_oc_crimes_raw',
    crimesAt: 'sgta_oc_crimes_at',

    itemsMap: 'sgta_oc_items_map',
    itemsAt: 'sgta_oc_items_at',
  };

  const GMK = {
    apikey: 'sgta_oc_apikey',
  };

  const el = {};
  let dragging = false;
  let drag = { x: 0, y: 0, left: 20, top: 120 };

  GM_addStyle(`
    #sgta-oc-panel {
      position: fixed;
      z-index: 999999;
      left: 20px;
      top: 120px;
      width: 420px;
      background: #1f1f1f;
      color: #ffffff;
      border: 2px solid #39ff14;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.45);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      user-select: none;
    }
    #sgta-oc-panel * { box-sizing: border-box; }
    #sgta-oc-hdr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px;
      cursor: move;
      border-bottom: 1px solid rgba(57,255,20,0.25);
      user-select: none;
    }
    #sgta-oc-title {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    #sgta-oc-hdrbtns {
      display: flex;
      gap: 6px;
    }
    .sgta-oc-btn {
      background: #2b2b2b;
      color: #fff;
      border: 1px solid rgba(57,255,20,0.35);
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .sgta-oc-btn:hover { border-color: #39ff14; }
    #sgta-oc-body {
      padding: 10px;
      user-select: text;
    }
    .sgta-oc-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    #sgta-oc-apikey {
      flex: 1;
      background: #121212;
      color: #fff;
      border: 1px solid rgba(57,255,20,0.35);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      outline: none;
    }
    #sgta-oc-apikey:focus { border-color: #39ff14; }
    #sgta-oc-status {
      margin: 8px 0 10px 0;
      font-size: 12px;
      color: rgba(255,255,255,0.85);
      white-space: pre-wrap;
      line-height: 1.35;
    }
    .sgta-oc-section {
      margin-top: 10px;
      border-top: 1px solid rgba(57,255,20,0.2);
      padding-top: 10px;
    }
    .sgta-oc-h {
      font-size: 12px;
      font-weight: 800;
      margin: 0 0 6px 0;
      color: #ffffff;
    }
    .sgta-oc-list {
      max-height: 170px;
      overflow: auto;
      background: #141414;
      border: 1px solid rgba(57,255,20,0.18);
      border-radius: 10px;
      padding: 8px;
      font-size: 12px;
    }
    .sgta-oc-item {
      padding: 6px 6px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      gap: 6px;
      justify-content: space-between;
      align-items: center;
    }
    .sgta-oc-item:last-child { border-bottom: 0; }
    .sgta-oc-left { display: flex; flex-direction: column; gap: 2px; }
    .sgta-oc-name { font-weight: 700; }
    .sgta-oc-sub { opacity: 0.85; font-size: 11px; }
    .sgta-oc-tag {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      opacity: 0.95;
      white-space: nowrap;
    }
    .sgta-bad { border-color: rgba(255, 70, 70, 0.85); }
  `);

  function nowStr() {
    const d = new Date();
    return d.toLocaleString();
  }

  function setStatus(msg) {
    if (el.status) el.status.textContent = msg || '';
  }

  function safeJsonParse(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }

  function getMembersMap() {
    return safeJsonParse(localStorage.getItem(LS.membersMap) || '{}', {});
  }

  function getMemberIds() {
    return safeJsonParse(localStorage.getItem(LS.memberIds) || '[]', []);
  }

  function getItemsMap() {
    return safeJsonParse(localStorage.getItem(LS.itemsMap) || '{}', {});
  }

  function itemsCacheExists() {
    const m = getItemsMap();
    return m && typeof m === 'object' && Object.keys(m).length > 0;
  }

  function apiGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { accept: 'application/json' },
        onload: (r) => {
          const ok = r.status >= 200 && r.status < 300;
          if (!ok) return reject(new Error(`HTTP ${r.status}: ${r.responseText?.slice(0, 200) || ''}`));
          resolve(r.responseText);
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Request timeout')),
        timeout: 30000,
      });
    });
  }

  function renderList(container, items) {
    container.innerHTML = '';
    if (!items.length) {
      const div = document.createElement('div');
      div.style.opacity = '0.8';
      div.textContent = '— none —';
      container.appendChild(div);
      return;
    }
    for (const it of items) {
      const row = document.createElement('div');
      row.className = 'sgta-oc-item';

      const left = document.createElement('div');
      left.className = 'sgta-oc-left';

      const name = document.createElement('div');
      name.className = 'sgta-oc-name';
      name.textContent = it.name || `${it.id}`;

      const sub = document.createElement('div');
      sub.className = 'sgta-oc-sub';
      sub.textContent = it.sub || '';

      left.appendChild(name);
      if (it.sub) left.appendChild(sub);

      row.appendChild(left);

      if (it.tag) {
        const tag = document.createElement('div');
        tag.className = `sgta-oc-tag ${it.tagClass || ''}`;
        tag.textContent = it.tag;
        row.appendChild(tag);
      }

      container.appendChild(row);
    }
  }

  function computeAndRender(crimesJson) {
    const membersMap = getMembersMap();
    const memberIds = getMemberIds();
    const itemsMap = getItemsMap();

    const crimes = crimesJson?.crimes || [];
    const participantsSet = new Set();

    const inOC = [];

    for (const crime of crimes) {
      const crimeName = crime?.name || 'Unknown crime';
      const slots = Array.isArray(crime?.slots) ? crime.slots : [];

      for (const slot of slots) {
        const u = slot?.user;
        if (!u || !u.id) continue;

        const id = String(u.id);
        participantsSet.add(id);

        const req = slot?.item_requirement;
        let itemText = 'No item required';
        let missing = false;

        if (req && req.id != null) {
          const itemId = String(req.id);
          const itemName = itemsMap[itemId] || `Item #${itemId}`;
          missing = req.is_available === false;
          itemText = missing ? `${itemName} (missing)` : itemName;
        }

        const sub = `${crimeName} — ${slot?.position || 'Slot'} — ${itemText}`;

        inOC.push({
          id,
          name: membersMap[id] || id,
          sub,
          tag: missing ? 'MISSING' : '',
          tagClass: missing ? 'sgta-bad' : '',
        });
      }
    }

    const notRegistered = [];
    for (const id of memberIds) {
      if (!participantsSet.has(String(id))) {
        notRegistered.push({
          id,
          name: membersMap[String(id)] || String(id),
          sub: '',
          tag: '',
          tagClass: '',
        });
      }
    }

    inOC.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    notRegistered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    renderList(el.listInOC, inOC);
    renderList(el.listNot, notRegistered);

    const mAt = localStorage.getItem(LS.membersAt) || '—';
    const cAt = localStorage.getItem(LS.crimesAt) || '—';
    const iAt = localStorage.getItem(LS.itemsAt) || '—';

    const missingCount = inOC.reduce((acc, x) => acc + (x.tag === 'MISSING' ? 1 : 0), 0);

    setStatus(
      `Items cached: ${iAt}\nMembers synced: ${mAt}\nCrimes updated: ${cAt}\n\nIn OC: ${inOC.length}\nMissing item: ${missingCount}\nNot registered: ${notRegistered.length}`
    );
  }

  async function ensureItems(apikey) {
    if (itemsCacheExists()) return;

    setStatus('Fetching items list (one-time cache)...');
    const url = `https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(apikey)}`;
    const text = await apiGet(url);

    const json = safeJsonParse(text, null);
    const items = json?.items || {};

    const map = {};
    for (const id of Object.keys(items)) {
      const it = items[id];
      if (!it) continue;
      map[String(id)] = String(it.name || id);
    }

    localStorage.setItem(LS.itemsMap, JSON.stringify(map));
    localStorage.setItem(LS.itemsAt, nowStr());
  }

  async function syncMembers(apikey) {
    const url = `https://api.torn.com/v2/faction/members?striptags=true&comment=OC_Script&key=${encodeURIComponent(apikey)}`;
    setStatus('Syncing members...');
    const text = await apiGet(url);

    localStorage.setItem(LS.membersRaw, text);
    localStorage.setItem(LS.membersAt, nowStr());

    const json = safeJsonParse(text, null);
    const members = json?.members || [];
    const map = {};
    const ids = [];

    for (const m of members) {
      if (!m || m.id == null) continue;
      map[String(m.id)] = String(m.name || m.id);
      ids.push(String(m.id));
    }

    localStorage.setItem(LS.membersMap, JSON.stringify(map));
    localStorage.setItem(LS.memberIds, JSON.stringify(ids));
  }

  async function updateCrimes(apikey) {
    const url = `https://api.torn.com/v2/faction/crimes?cat=available&offset=0&sort=DESC&key=${encodeURIComponent(apikey)}`;
    setStatus('Updating crimes...');
    const text = await apiGet(url);

    localStorage.setItem(LS.crimesRaw, text);
    localStorage.setItem(LS.crimesAt, nowStr());

    const json = safeJsonParse(text, null);
    computeAndRender(json);
  }

  function setPanelVisible(visible) {
    const isHidden = !visible;
    localStorage.setItem(LS.hidden, isHidden ? '1' : '0');
    if (el.panel) el.panel.style.display = isHidden ? 'none' : 'block';
  }

  function togglePanel() {
    const hidden = (localStorage.getItem(LS.hidden) || '0') === '1';
    setPanelVisible(hidden);
  }

  function loadPos() {
    const pos = safeJsonParse(localStorage.getItem(LS.pos) || 'null', null);
    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
      el.panel.style.left = `${pos.left}px`;
      el.panel.style.top = `${pos.top}px`;
    }
  }

  function savePos(left, top) {
    localStorage.setItem(LS.pos, JSON.stringify({ left, top }));
  }

  function buildUI() {
    el.panel = document.createElement('div');
    el.panel.id = 'sgta-oc-panel';

    const hdr = document.createElement('div');
    hdr.id = 'sgta-oc-hdr';

    const title = document.createElement('div');
    title.id = 'sgta-oc-title';
    title.textContent = 'OC Helper';

    const hdrBtns = document.createElement('div');
    hdrBtns.id = 'sgta-oc-hdrbtns';

    const btnHide = document.createElement('button');
    btnHide.className = 'sgta-oc-btn';
    btnHide.textContent = 'Hide';
    btnHide.addEventListener('click', () => setPanelVisible(false));

    const btnReset = document.createElement('button');
    btnReset.className = 'sgta-oc-btn';
    btnReset.textContent = 'Reset Pos';
    btnReset.addEventListener('click', () => {
      el.panel.style.left = '20px';
      el.panel.style.top = '120px';
      savePos(20, 120);
    });

    hdrBtns.appendChild(btnReset);
    hdrBtns.appendChild(btnHide);

    hdr.appendChild(title);
    hdr.appendChild(hdrBtns);

    const body = document.createElement('div');
    body.id = 'sgta-oc-body';

    const row = document.createElement('div');
    row.className = 'sgta-oc-row';

    el.apikey = document.createElement('input');
    el.apikey.id = 'sgta-oc-apikey';
    el.apikey.type = 'password';
    el.apikey.placeholder = 'API Key...';
    el.apikey.value = GM_getValue(GMK.apikey, '') || '';

    const btnSave = document.createElement('button');
    btnSave.className = 'sgta-oc-btn';
    btnSave.textContent = 'Save';
    btnSave.addEventListener('click', async () => {
      const key = (el.apikey.value || '').trim();
      if (!key) return setStatus('Please enter API key.');
      GM_setValue(GMK.apikey, key);

      try {
        await ensureItems(key);
      } catch (e) {
        setStatus(`Items error: ${e?.message || e}`);
        return;
      }

      try {
        await syncMembers(key);
        const mAt = localStorage.getItem(LS.membersAt) || '—';
        const iAt = localStorage.getItem(LS.itemsAt) || '—';
        setStatus(`Saved.\nItems cached: ${iAt}\nMembers synced: ${mAt}`);
      } catch (e) {
        setStatus(`Members error: ${e?.message || e}`);
      }
    });

    const btnUpdate = document.createElement('button');
    btnUpdate.className = 'sgta-oc-btn';
    btnUpdate.textContent = 'Update';
    btnUpdate.addEventListener('click', async () => {
      const key = (GM_getValue(GMK.apikey, '') || '').trim();
      if (!key) return setStatus('No API key saved.');
      try {
        await updateCrimes(key);
      } catch (e) {
        setStatus(`Crimes error: ${e?.message || e}`);
      }
    });

    row.appendChild(el.apikey);
    row.appendChild(btnSave);
    row.appendChild(btnUpdate);

    el.status = document.createElement('div');
    el.status.id = 'sgta-oc-status';

    const secInOC = document.createElement('div');
    secInOC.className = 'sgta-oc-section';
    const hInOC = document.createElement('div');
    hInOC.className = 'sgta-oc-h';
    hInOC.textContent = 'In OC';
    el.listInOC = document.createElement('div');
    el.listInOC.className = 'sgta-oc-list';
    secInOC.appendChild(hInOC);
    secInOC.appendChild(el.listInOC);

    const secNot = document.createElement('div');
    secNot.className = 'sgta-oc-section';
    const hNot = document.createElement('div');
    hNot.className = 'sgta-oc-h';
    hNot.textContent = 'Not Registered';
    el.listNot = document.createElement('div');
    el.listNot.className = 'sgta-oc-list';
    secNot.appendChild(hNot);
    secNot.appendChild(el.listNot);

    body.appendChild(row);
    body.appendChild(el.status);
    body.appendChild(secInOC);
    body.appendChild(secNot);

    el.panel.appendChild(hdr);
    el.panel.appendChild(body);
    document.body.appendChild(el.panel);

    hdr.addEventListener('mousedown', (ev) => {
      if (ev.button !== 0) return;
      dragging = true;
      const rect = el.panel.getBoundingClientRect();
      drag = { x: ev.clientX, y: ev.clientY, left: rect.left, top: rect.top };
      ev.preventDefault();
    });

    document.addEventListener('mousemove', (ev) => {
      if (!dragging) return;
      const dx = ev.clientX - drag.x;
      const dy = ev.clientY - drag.y;
      const left = Math.max(0, Math.min(window.innerWidth - 80, drag.left + dx));
      const top = Math.max(0, Math.min(window.innerHeight - 40, drag.top + dy));
      el.panel.style.left = `${left}px`;
      el.panel.style.top = `${top}px`;
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      const rect = el.panel.getBoundingClientRect();
      savePos(rect.left, rect.top);
    });

    loadPos();

    const hidden = (localStorage.getItem(LS.hidden) || '0') === '1';
    setPanelVisible(!hidden);

    const rawCrimes = localStorage.getItem(LS.crimesRaw);
    if (rawCrimes) {
      const json = safeJsonParse(rawCrimes, null);
      if (json) computeAndRender(json);
    } else {
      const mAt = localStorage.getItem(LS.membersAt) || '—';
      const cAt = localStorage.getItem(LS.crimesAt) || '—';
      const iAt = localStorage.getItem(LS.itemsAt) || '—';
      setStatus(`Items cached: ${iAt}\nMembers synced: ${mAt}\nCrimes updated: ${cAt}`);
    }
  }

  GM_registerMenuCommand('Toggle OC Helper Panel', togglePanel);

  buildUI();
})();
