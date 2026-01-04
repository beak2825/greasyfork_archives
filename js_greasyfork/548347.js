// ==UserScript==
// @name         AllDebrid Premium Link Converter
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.4
// @description  Convert links using AllDebrid.com. Uses regex for accurate matching
// @author       JRem
// @include      *://*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548347/AllDebrid%20Premium%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/548347/AllDebrid%20Premium%20Link%20Converter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Config ----
  const STORAGE_KEY = 'alldebrid_apikey';
  const REGEXPS_KEY = 'alldebrid_host_regexps';
  const PANEL_MINIMIZED_KEY = 'alldebrid_panel_minimized';
  const TARGET_HOST = 'alldebrid.com';
  const APIKEYS_URL = 'https://alldebrid.com/apikeys/';
  const HOSTS_API_BASE = 'https://api.alldebrid.com/v4/hosts';
  const UNLOCK_API_BASE = 'https://api.alldebrid.com/v4/link/unlock';
  const MAGNET_UPLOAD_API = 'https://api.alldebrid.com/v4/magnet/upload';

  // ---- Utilities ----
  function isOnTargetHost() {
    const host = (window.location.hostname || '').toLowerCase();
    return host === TARGET_HOST || host.endsWith('.' + TARGET_HOST);
  }
  function safeLog(...args) { console.log('[Alldebrid userscript]', ...args); }

  // Simple toast
  function showToast(message, duration = 3000) {
    try {
      const id = 'alldebrid-apikey-toast';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('div');
        el.id = id;
        Object.assign(el.style, {
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          zIndex: 2147483647,
          padding: '10px 16px',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          fontFamily: 'sans-serif',
          fontSize: '13px',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          opacity: '0',
          transition: 'opacity 200ms',
          pointerEvents: 'auto'
        });
        document.documentElement.appendChild(el);
      }
      el.textContent = message;
      requestAnimationFrame(() => { el.style.opacity = '1'; });
      if (el._hideTimeout) clearTimeout(el._hideTimeout);
      el._hideTimeout = setTimeout(() => {
        el.style.opacity = '0';
        el._hideTimeout = setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 220);
      }, duration);
    } catch (e) { safeLog('showToast error', e); }
  }

  // ---- Storage helpers ----
  async function saveValue(key, val) {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(key, val);
      else if (typeof GM !== 'undefined' && GM.setValue) await GM.setValue(key, val);
      else localStorage.setItem(key, val);
      return true;
    } catch (e) { console.error('saveValue error', e); return false; }
  }
  async function readValue(key) {
    try {
      if (typeof GM_getValue === 'function') return GM_getValue(key);
      else if (typeof GM !== 'undefined' && GM.getValue) return await GM.getValue(key);
      else return localStorage.getItem(key);
    } catch (e) { console.error('readValue error', e); return null; }
  }
  async function deleteValue(key) {
    try {
      if (typeof GM_deleteValue === 'function') GM_deleteValue(key);
      else if (typeof GM !== 'undefined' && GM.deleteValue) await GM.deleteValue(key);
      else localStorage.removeItem(key);
      return true;
    } catch (e) { console.error('deleteValue error', e); return false; }
  }
  async function saveApiKey(key) { return saveValue(STORAGE_KEY, key); }
  async function readApiKey() { return readValue(STORAGE_KEY); }
  async function saveRegexps(list) { return saveValue(REGEXPS_KEY, JSON.stringify(list || [])); }
  async function readRegexps() {
    const j = await readValue(REGEXPS_KEY);
    if (!j) return [];
    try { const arr = JSON.parse(j); return Array.isArray(arr) ? arr : []; } catch (e) { return []; }
  }

  // ---- Fetch helpers (with GM fallback) ----
  function gmRequest(cfg) {
    return new Promise((resolve) => {
      const gm = (typeof GM_xmlhttpRequest !== 'undefined') ? GM_xmlhttpRequest
        : (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest
        : null;
      if (!gm) return resolve({ success: false, error: 'GM_xmlhttpRequest not available' });
      try {
        const inner = Object.assign({}, cfg);
        inner.onload = function (res) {
          const raw = res.responseText || res.response || '';
          let data = raw;
          try {
            if ((res.responseHeaders || '').toLowerCase().includes('application/json') || /^[\s{[]/.test(raw)) data = JSON.parse(raw);
          } catch (e) { /* ignore */ }
          resolve({ success: true, status: res.status, data, raw, headers: res.responseHeaders });
        };
        inner.onerror = function (err) { resolve({ success: false, error: err }); };
        inner.ontimeout = function () { resolve({ success: false, error: 'timeout' }); };
        gm(inner);
      } catch (e) { resolve({ success: false, error: e.message || e }); }
    });
  }

  async function tryFetch(url, opts = {}) {
    try {
      const resp = await fetch(url, opts);
      const text = await resp.text();
      let data = text;
      const ct = (resp.headers && resp.headers.get) ? (resp.headers.get('content-type') || '') : '';
      if (ct && ct.toLowerCase().includes('application/json')) {
        try { data = JSON.parse(text); } catch (e) { data = text; }
      }
      return { success: true, status: resp.status, data, raw: text };
    } catch (e) {
      // fallback to GM
      const gmCfg = {
        method: opts.method || 'GET',
        url,
        headers: opts.headers || { 'Accept': 'application/json, text/plain, */*' },
        data: opts.body || null,
        withCredentials: !!opts.credentials && opts.credentials === 'include'
      };
      return await gmRequest(gmCfg);
    }
  }

  // ---- APIKey extraction ----
  function findApiKeyInText(text) {
    if (!text) return null;
    let m = text.match(/["']\s*apikey\s*["']\s*[:=]\s*["']([^"']{8,})["']/i);
    if (m && m[1]) return m[1];
    m = text.match(/apikey\s*[:=]\s*["']([^"']{8,})["']/i);
    if (m && m[1]) return m[1];
    m = text.match(/apikey=([A-Za-z0-9\-_]{8,})/i);
    if (m && m[1]) return m[1];
    return null;
  }
  function findApiKeyInObject(obj, depth = 0) {
    if (!obj || depth > 6) return null;
    if (typeof obj === 'string') return findApiKeyInText(obj);
    if (Array.isArray(obj)) {
      for (const it of obj) { const r = findApiKeyInObject(it, depth + 1); if (r) return r; }
      return null;
    }
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        if (/apikey/i.test(k) && obj[k]) { const s = String(obj[k]).trim(); if (s.length >= 8) return s; }
      }
      for (const k of Object.keys(obj)) {
        const r = findApiKeyInObject(obj[k], depth + 1); if (r) return r;
      }
    }
    return null;
  }

  async function tryFetchApikey() {
    safeLog('Attempting to fetch', APIKEYS_URL);
    let resp = await tryFetch(APIKEYS_URL, { method: 'GET', credentials: 'include', headers: { 'Accept': 'application/json, text/html, text/plain, */*' } });
    if (!resp.success) resp = await tryFetch(APIKEYS_URL, { method: 'GET' });
    if (!resp || !resp.success) return { found: false, reason: 'fetch_failed', detail: resp && resp.error };
    const data = resp.data;
    if (typeof data === 'object' && data !== null) {
      if ('apikey' in data && data.apikey) return { found: true, apikey: String(data.apikey) };
      const key = findApiKeyInObject(data);
      if (key) return { found: true, apikey: key };
      try { const s = JSON.stringify(data); const k2 = findApiKeyInText(s); if (k2) return { found: true, apikey: k2 }; } catch (e) {}
    }
    if (typeof data === 'string') {
      const key = findApiKeyInText(data);
      if (key) return { found: true, apikey: key };
    }
    return { found: false, reason: 'not_found_in_response', detail: resp.data };
  }

  // ---- Hosts fetch / extract regexps ----
  async function fetchHostsUsingApiKey(apikey) {
    const url = HOSTS_API_BASE + '?agent=userscript&apikey=' + encodeURIComponent(apikey);
    safeLog('Fetching hosts API:', url);
    let resp = await tryFetch(url, { method: 'GET' });
    if (!resp.success) resp = await tryFetch(url, { method: 'GET' });
    if (!resp || !resp.success) return { success: false, reason: 'fetch_failed', detail: resp && resp.error, resp };
    const data = resp.data;
    if (!data || typeof data !== 'object') {
      if (typeof resp.raw === 'string') {
        try { const parsed = JSON.parse(resp.raw); return { success: true, payload: parsed, raw: resp.raw }; } catch (e) {}
      }
      return { success: false, reason: 'unexpected_response', detail: resp.raw, resp };
    }
    return { success: true, payload: data, raw: resp.raw };
  }

  function extractRegexpsFromHostsPayload(payload) {
    const collected = [];
    if (!payload || typeof payload !== 'object') return [];
    function collectFromHostEntry(entry) {
      if (!entry) return;
      if (Array.isArray(entry)) { for (const r of entry) if (typeof r === 'string' && r.trim()) collected.push(r.trim()); return; }
      if (typeof entry === 'string') { if (entry.trim()) collected.push(entry.trim()); return; }
      const tryKeys = ['regexps', 'regexp', 'regex', 'patterns', 'pattern', 'match', 'matches'];
      for (const k of tryKeys) {
        if (k in entry && entry[k]) {
          const val = entry[k];
          if (Array.isArray(val)) for (const r of val) if (typeof r === 'string' && r.trim()) collected.push(r.trim());
          else if (typeof val === 'string') collected.push(val.trim());
        }
      }
      for (const k of Object.keys(entry)) {
        const v = entry[k];
        if (!v) continue;
        if (typeof v === 'string' && /[\\\/\.\*\+\?\|\(\)\[\]\^]/.test(v) && v.length > 8) collected.push(v.trim());
        else if (Array.isArray(v)) for (const it of v) if (typeof it === 'string' && it.trim()) collected.push(it.trim());
        else if (typeof v === 'object' && v !== null) for (const k2 of Object.keys(v)) { const vv = v[k2]; if (typeof vv === 'string' && vv.trim()) collected.push(vv.trim()); if (Array.isArray(vv)) for (const iti of vv) if (typeof iti === 'string' && iti.trim()) collected.push(iti.trim()); }
      }
    }

    if (payload.data && payload.data.hosts) {
      const hosts = payload.data.hosts;
      if (Array.isArray(hosts)) for (const h of hosts) collectFromHostEntry(h.regexps || h.regexp || h);
      else if (typeof hosts === 'object') for (const siteKey of Object.keys(hosts)) {
        const h = hosts[siteKey];
        if (h && typeof h === 'object') {
          if ('regexp' in h && h.regexp) collectFromHostEntry(h.regexp);
          else if ('regexps' in h && h.regexps) collectFromHostEntry(h.regexps);
          else collectFromHostEntry(h);
        } else collectFromHostEntry(h);
      }
    } else if (payload.hosts) {
      const hosts = payload.hosts;
      if (Array.isArray(hosts)) for (const h of hosts) collectFromHostEntry(h.regexps || h.regexp || h);
      else if (typeof hosts === 'object') for (const k of Object.keys(hosts)) collectFromHostEntry(hosts[k]);
    } else if (Array.isArray(payload)) for (const h of payload) collectFromHostEntry(h.regexps || h.regexp || h);
    else {
      for (const k of Object.keys(payload)) {
        if (/hosts?/i.test(k) || /list/i.test(k)) {
          const candidate = payload[k];
          if (Array.isArray(candidate)) for (const h of candidate) collectFromHostEntry(h);
          else if (typeof candidate === 'object') for (const sk of Object.keys(candidate)) collectFromHostEntry(candidate[sk]);
        }
      }
    }

    return Array.from(new Set(collected.map(s => (s || '').trim()).filter(s => s && s.length > 0)));
  }

  function compileRegexpStrings(list) {
    const compiled = [];
    for (const s of (list || [])) {
      if (!s || typeof s !== 'string') continue;
      let pattern = s;
      let flags = 'i';
      const m = s.match(/^\/(.+)\/([gimsuy]*)$/);
      if (m) { pattern = m[1]; flags = m[2] || ''; try { compiled.push(new RegExp(pattern, flags)); continue; } catch (e) { continue; } }
      try { compiled.push(new RegExp(pattern, flags)); } catch (e) { try { const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); compiled.push(new RegExp(escaped, flags)); } catch (e2) {} }
    }
    return compiled;
  }

  // ---- Helpers to extract a filename from a URL or response payload ----
  function extractFilenameFromUrl(urlStr, payload = null) {
    try {
      // First prefer payload hints if provided
      if (payload && typeof payload === 'object') {
        // Common fields: payload.data.filename, payload.data.name, payload.data.file.name, payload.fileName, payload.filename etc.
        const get = (obj, keys) => { for (const k of keys) if (obj && k in obj && obj[k]) return obj[k]; return null; };
        const candidate =
          get(payload, ['filename', 'fileName', 'name']) ||
          (payload.data && get(payload.data, ['filename', 'fileName', 'name'])) ||
          (payload.data && payload.data.file && get(payload.data.file, ['name', 'filename']));
        if (candidate) return String(candidate);
      }

      if (!urlStr || typeof urlStr !== 'string') return urlStr;
      // Use URL to parse query params like magnet dn
      let u;
      try {
        u = new URL(urlStr);
      } catch (e) {
        // Try constructing with window.location.origin as base (for relative URLs)
        try { u = new URL(urlStr, window.location.href); } catch (e2) { return urlStr; }
      }
      // For magnet scheme, "dn" is commonly used for display name
      if (u.protocol && u.protocol.startsWith('magnet')) {
        const dn = u.searchParams.get('dn') || u.searchParams.get('name') || u.searchParams.get('displayname');
        if (dn) return decodeURIComponent(dn);
      }
      // Check query parameters common: name, filename, file, title
      const qNames = ['name', 'filename', 'file', 'title'];
      for (const q of qNames) {
        const v = u.searchParams.get(q);
        if (v) return decodeURIComponent(v);
      }
      // Otherwise take last segment of pathname
      const path = u.pathname || '';
      const last = path.split('/').filter(Boolean).pop();
      if (last) return decodeURIComponent(last);
      // fallback to host
      return u.hostname || urlStr;
    } catch (e) {
      return urlStr;
    }
  }

  // ---- Unlock / magnet upload (POST) ----
  async function unlockLinkWithApi(apikey, targetUrl) {
    if (!apikey) return { ok: false, error: 'no_apikey' };
    const url = UNLOCK_API_BASE;
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + apikey,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams();
    body.append('agent', 'userscript');
    body.append('apikey', apikey);
    body.append('link', targetUrl);
    const resp = await tryFetch(url, { method: 'POST', headers, body: body.toString() });
    if (!resp.success) return { ok: false, error: resp.error || 'fetch_failed' };
    return { ok: true, status: resp.status, data: resp.data, raw: resp.raw };
  }

  async function uploadMagnetWithApi(apikey, magnetUrl) {
    if (!apikey) return { ok: false, error: 'no_apikey' };
    const url = MAGNET_UPLOAD_API;
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + apikey,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams();
    body.append('agent', 'userscript');
    body.append('apikey', apikey);
    body.append('magnets[]', magnetUrl);
    const resp = await tryFetch(url, { method: 'POST', headers, body: body.toString() });
    if (!resp.success) return { ok: false, error: resp.error || 'fetch_failed' };
    return { ok: true, status: resp.status, data: resp.data, raw: resp.raw };
  }

  // ---- Buttons and scanning ----
  const BUTTON_CLASS = 'alldebrid-send-button';
  const BUTTON_STYLE = `
    .alldebrid-send-button { background:#fac63f;color:#111;border:none;border-radius:4px;padding:4px 8px;margin-left:6px;cursor:pointer;font-size:12px;font-family:sans-serif; }
    .alldebrid-send-button[disabled]{opacity:0.6;cursor:default;}
  `;
  try { GM_addStyle(BUTTON_STYLE); } catch (e) { const s = document.createElement('style'); s.textContent = BUTTON_STYLE; (document.head || document.documentElement).appendChild(s); }

  function findMatchingAnchors(compiledRegexps) {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const matches = [];
    for (const a of anchors) {
      const href = a.getAttribute('href') || '';
      if (!href) continue;
      for (const r of compiledRegexps) {
        try { if (r.test(href)) { matches.push(a); break; } } catch (e) {}
        try { if (r.global) r.lastIndex = 0; } catch (e) {}
      }
      if (href.startsWith('magnet:') && !matches.includes(a)) matches.push(a);
    }
    return matches;
  }

  async function attachButtonsToMatchingAnchors(compiledRegexps) {
    const anchors = findMatchingAnchors(compiledRegexps);
    if (!anchors.length) { safeLog('No matching anchors found'); return []; }
    const attached = [];
    const apikey = await readApiKey();
    for (const a of anchors) {
      if (a.dataset && a.dataset.alldebridButtonAttached) continue;
      const btn = document.createElement('button');
      btn.className = BUTTON_CLASS;
      btn.type = 'button';
      btn.textContent = 'Send to AD';
      btn.title = 'Send this link to Alldebrid';
      btn.style.whiteSpace = 'nowrap';
      const originalHref = a.href || a.getAttribute('href');
      btn.addEventListener('click', async (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        if (btn.disabled) return;
        btn.disabled = true;
        const prevText = btn.textContent; btn.textContent = 'Sending...';
        try {
          let apiResp;
          if (originalHref && originalHref.startsWith('magnet:')) apiResp = await uploadMagnetWithApi(apikey, originalHref);
          else apiResp = await unlockLinkWithApi(apikey, originalHref);
          if (!apiResp || apiResp.ok === false) {
            console.error('API request failed:', apiResp);
            showToast('Request failed. See console.', 3500);
            btn.textContent = prevText; btn.disabled = false; return;
          }
          const payload = apiResp.data || null;
          let newLink = null;
          // Try to find new link depending on response shape
          if (payload && typeof payload === 'object') {
            if (payload.data && typeof payload.data === 'object') {
              if (Array.isArray(payload.data.magnets) && payload.data.magnets.length) {
                const m0 = payload.data.magnets[0];
                if (m0 && typeof m0 === 'object') {
                  if (m0.link) newLink = m0.link;
                  else if (m0.download) newLink = m0.download;
                  else if (m0.file && m0.file.link) newLink = m0.file.link;
                }
              }
              if (!newLink && payload.data.link) newLink = payload.data.link;
            }
            if (!newLink && payload.link) newLink = payload.link;
            if (!newLink) {
              try { const s = JSON.stringify(payload); const m = s.match(/"link"\s*:\s*"([^"]+)"/); if (m && m[1]) newLink = m[1]; } catch (e) {}
            }
          } else if (typeof payload === 'string') {
            try { const p = JSON.parse(payload); if (p && p.data && p.data.link) newLink = p.data.link; else if (p && p.link) newLink = p.link; } catch (e) {}
          }

          if (newLink) {
            try {
              // Replace href
              a.href = newLink;
              // Determine filename from payload or URL and set as visible text
              const filename = extractFilenameFromUrl(newLink, payload) || newLink;
              a.textContent = filename;
              // Add to panel (show filename + full URL)
              addConvertedUrl(newLink, filename);
              showToast('Success: link replaced.', 2600);
              safeLog('API success: replaced', { original: originalHref, newLink, resp: apiResp });
              btn.textContent = 'Unlocked';
              btn.disabled = true;
              btn.style.background = '#8fd38f';
            } catch (e) {
              console.error('Error updating link on page:', e);
              showToast('Succeeded but failed to update link on page. See console.', 4500);
              btn.textContent = prevText; btn.disabled = false;
            }
          } else {
            console.warn('API response did not contain a usable link:', apiResp);
            showToast('No new link returned. See console.', 4500);
            btn.textContent = prevText; btn.disabled = false;
          }
        } catch (e) {
          console.error('Error during API call:', e);
          showToast('Error during request. See console.', 3500);
          btn.textContent = 'Send to AD'; btn.disabled = false;
        }
      });

      try { a.parentNode && a.parentNode.insertBefore(btn, a.nextSibling); if (a.dataset) a.dataset.alldebridButtonAttached = '1'; attached.push({ anchor: a, button: btn }); }
      catch (e) { console.warn('Insert button failed', e); }
    }
    safeLog('Attached buttons', attached.length);
    return attached;
  }

  // ---- Scanning utilities ----
  function scanPageWithCompiledRegexps(compiledRegexps) {
    const results = new Set();
    try {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      for (const a of anchors) {
        const href = a.getAttribute('href') || '';
        for (const r of compiledRegexps) { try { if (r.test(href)) results.add(href); } catch (e) {} try { if (r.global) r.lastIndex = 0; } catch (e) {} }
        if (href.startsWith('magnet:')) results.add(href);
      }
      const html = document.documentElement && document.documentElement.innerHTML ? document.documentElement.innerHTML : document.body && document.body.innerHTML ? document.body.innerHTML : '';
      if (html) {
        for (const r of compiledRegexps) {
          try {
            let flags = r.flags || '';
            if (!flags.includes('g')) {
              try {
                const r2 = new RegExp(r.source, flags + 'g');
                let m; while ((m = r2.exec(html)) !== null) results.add(m[0]);
                continue;
              } catch (e) {}
            }
            let m; while ((m = r.exec(html)) !== null) { results.add(m[0]); if (!r.global) break; }
          } catch (e) {}
        }
      }
    } catch (e) { console.error('scan error', e); }
    return Array.from(results);
  }

  // ---- Converted URLs panel (DOM-built) ----
  const PANEL_ID = 'alldebrid-converted-panel';
  const PANEL_TA_ID = 'alldebrid-converted-textarea';
  let panelCreated = false;
  let convertedSet = new Set();

  (function addPanelStyles() {
    const PANEL_CSS = `
#${PANEL_ID} { position: fixed; right: 12px; bottom: 12px; width: 360px; max-width: calc(100% - 24px); z-index: 2147483647; font-family: sans-serif; box-shadow: 0 6px 20px rgba(0,0,0,0.35); background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,0,0,0.12); }
#${PANEL_ID} .ad-header { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background: linear-gradient(180deg,#fafafa,#f2f2f2); border-bottom:1px solid rgba(0,0,0,0.06); font-weight:600; font-size:13px; color:#111; }
#${PANEL_ID} .ad-controls { display:flex; gap:6px; align-items:center; }
#${PANEL_ID} .ad-controls button { background:#f0f0f0; border:1px solid rgba(0,0,0,0.06); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px; }
#${PANEL_ID} .ad-controls button.small { padding:4px 6px; font-size:11px; }
#${PANEL_ID} .ad-body { padding:8px; background:#fff; }
#${PANEL_ID} textarea#${PANEL_TA_ID} { width:100%; height:160px; resize: vertical; font-size:12px; padding:8px; box-sizing:border-box; font-family:monospace; border:1px solid rgba(0,0,0,0.08); border-radius:6px; background:#fafafa; color:#111; }
#${PANEL_ID}.minimized { width:200px; height:auto; }
#${PANEL_ID}.minimized .ad-body { display:none; }
#${PANEL_ID}.minimized .ad-header { background: linear-gradient(180deg,#fff,#fbfbfb); }
`;
    try { GM_addStyle(PANEL_CSS); } catch (e) { const s = document.createElement('style'); s.textContent = PANEL_CSS; (document.head || document.documentElement).appendChild(s); }
  })();

  function createPanelIfNeeded() {
    if (panelCreated) return;
    panelCreated = true;
    if (!document.body) { document.addEventListener('DOMContentLoaded', createPanelIfNeeded, { once: true }); return; }
    const existing = document.getElementById(PANEL_ID); if (existing) existing.remove();
    const panel = document.createElement('div'); panel.id = PANEL_ID;
    if (localStorage.getItem(PANEL_MINIMIZED_KEY) === '1') panel.classList.add('minimized');

    // header
    const header = document.createElement('div'); header.className = 'ad-header';
    const title = document.createElement('div'); title.className = 'ad-title'; title.textContent = 'Alldebrid Converted URLs';
    const controls = document.createElement('div'); controls.className = 'ad-controls';
    const btnCopy = document.createElement('button'); btnCopy.className = 'small'; btnCopy.title = 'Copy all'; btnCopy.textContent = 'Copy';
    const btnClear = document.createElement('button'); btnClear.className = 'small'; btnClear.title = 'Clear list'; btnClear.textContent = 'Clear';
    const btnMin = document.createElement('button'); btnMin.className = 'small'; btnMin.title = 'Minimize/Restore'; btnMin.textContent = panel.classList.contains('minimized') ? 'Restore' : 'Min';
    const btnClose = document.createElement('button'); btnClose.className = 'small'; btnClose.title = 'Close'; btnClose.textContent = 'Hide';
    controls.appendChild(btnCopy); controls.appendChild(btnClear); controls.appendChild(btnMin); controls.appendChild(btnClose);
    header.appendChild(title); header.appendChild(controls);

    // body
    const body = document.createElement('div'); body.className = 'ad-body';
    const ta = document.createElement('textarea'); ta.id = PANEL_TA_ID; ta.readOnly = true; ta.placeholder = 'Converted URLs will appear here...';
    body.appendChild(ta);

    panel.appendChild(header); panel.appendChild(body);
    document.body.appendChild(panel);

    function updateTA() { ta.value = Array.from(convertedSet).join('\n'); }
    btnCopy.addEventListener('click', async () => {
      const text = ta.value;
      if (!text) { showToast('No converted URLs to copy.', 1800); return; }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
        else { ta.select(); document.execCommand('copy'); window.getSelection().removeAllRanges(); }
        showToast('Copied converted URLs to clipboard.', 1800);
      } catch (e) { showToast('Copy failed (see console).', 2000); console.error('copy error', e); }
    });
    btnClear.addEventListener('click', () => { convertedSet.clear(); updateTA(); showToast('Cleared converted URLs list.', 1400); });
    btnMin.addEventListener('click', () => {
      panel.classList.toggle('minimized');
      const minimized = panel.classList.contains('minimized');
      btnMin.textContent = minimized ? 'Restore' : 'Min';
      localStorage.setItem(PANEL_MINIMIZED_KEY, minimized ? '1' : '0');
    });
    btnClose.addEventListener('click', () => { panel.style.display = 'none'; showToast('Panel hidden. Use menu "Show Converted URLs Panel" or convert a link to show again.', 3000); });

    // expose helper function globally to add converted urls programmatically
    window.alldebridAddConvertedUrl = function (url, filename) {
      createPanelIfNeeded();
      if (!url) return;
      const display = filename ? (filename + ' - ' + url) : url;
      convertedSet.add(display);
      updateTA();
      panel.style.display = '';
    };

    // initial populate
    updateTA();
  }

  // convenience wrapper (used by unlock flow)
  function addConvertedUrl(url, filename) { createPanelIfNeeded(); if (!url) return; const display = filename ? (filename + ' - ' + url) : url; convertedSet.add(display); const ta = document.getElementById(PANEL_TA_ID); if (ta) ta.value = Array.from(convertedSet).join('\n'); const panel = document.getElementById(PANEL_ID); if (panel) panel.style.display = ''; }

  // Expose a function to show the panel if hidden
  function showPanel() { createPanelIfNeeded(); const panel = document.getElementById(PANEL_ID); if (panel) { panel.style.display = ''; if (panel.classList.contains('minimized')) { /* keep minimized state */ } } }
  window.alldebridShowPanel = showPanel;

  // ---- High-level actions ----
  async function actionUpdateHostsAndScan() {
    try {
      const apikey = await readApiKey();
      if (!apikey) { showToast('No API key stored. Please set API key.', 6000); return; }
      showToast('Fetching hosts list from API...', 2000);
      const resp = await fetchHostsUsingApiKey(apikey);
      if (!resp.success) { showToast('Failed to fetch hosts. See console.', 5000); console.warn('Hosts fetch failed:', resp); return; }
      const regexps = extractRegexpsFromHostsPayload(resp.payload);
      if (!regexps || regexps.length === 0) { showToast('No host regexps found in API response.', 4500); return; }
      await saveRegexps(regexps);
      const compiled = compileRegexpStrings(regexps);
      showToast(`Fetched ${regexps.length} host patterns. Scanning page...`, 2500);
      await attachButtonsToMatchingAnchors(compiled);
    } catch (e) { console.error('actionUpdateHostsAndScan error', e); showToast('Error while updating hosts. See console.', 3000); }
  }

  // ---- Menu & manual set ----
  async function actionGrabApiKey() {
    showToast('Attempting to grab apikey...', 1500);
    const result = await tryFetchApikey();
    if (result.found) {
      await saveApiKey(result.apikey);
      showToast('API key grabbed and saved.', 2500);
      await actionUpdateHostsAndScan();
    } else {
      console.warn('No apikey found:', result);
      showToast('No API key found. You may need to log in to alldebrid.com and reload, or set a key manually via the menu.', 7000);
    }
  }

  async function actionSetManual() {
    try {
      const current = await readApiKey();
      const promptText = current ? `Current key: ${current}\n\nEnter new API key (or cancel):` : 'Enter your Alldebrid API key:';
      const val = prompt(promptText);
      if (val === null) { showToast('Manual entry canceled.', 1500); return; }
      const key = String(val).trim();
      if (!key || key.length < 8) { showToast('Entered value looks too short.', 3000); return; }
      await saveApiKey(key);
      showToast('API key saved (manual). Fetching hosts...', 2000);
      await actionUpdateHostsAndScan();
    } catch (e) { console.error('actionSetManual', e); showToast('Error during manual set. See console.', 3000); }
  }

  function registerMenu(name, fn) {
    try { if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(name, fn); } catch (e) { console.warn('registerMenu error', e); }
  }

  registerMenu('Alldebrid: Grab APIKey', actionGrabApiKey);
  registerMenu('Alldebrid: Set APIKey (manual)', actionSetManual);
  registerMenu('Alldebrid: Update hosts regexps & scan', actionUpdateHostsAndScan);
  registerMenu('Alldebrid: Scan page with stored regexps', async () => {
    const rawList = await readRegexps();
    const compiled = compileRegexpStrings(rawList);
    await attachButtonsToMatchingAnchors(compiled);
    showToast('Scan complete (see console).', 2000);
  });
  registerMenu('Alldebrid: Show Converted URLs Panel', () => { showPanel(); showToast('Panel shown.', 1500); });

  // ---- Auto init ----
  (async function init() {
    try {
      // Create panel when DOM ready
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createPanelIfNeeded, { once: true });
      else createPanelIfNeeded();

      const existing = await readApiKey();
      if (existing) {
        safeLog('API key present, updating hosts...');
        await actionUpdateHostsAndScan();
        return;
      }
      safeLog('No API key, attempting auto-grab...');
      await actionGrabApiKey();
      const after = await readApiKey();
      if (!after) {
        showToast('No API key found automatically. Log in to alldebrid.com and reload, or set API key manually via the menu.', 8000);
      }
    } catch (e) { console.error('init error', e); }
  })();

})();