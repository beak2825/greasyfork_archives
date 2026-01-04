// ==UserScript==
// @name         Torn Bazaar Price Updater
// @namespace    Dondermerwe
// @version      2.4.1
// @description  Auto-fills Torn bazaar prices at (Market Value ± discount%). Positive % = MV - %, negative % = MV + %. Panel above #bazaarRoot with heading, Update All (Alt=Deep Scan), status badge, and a gear (bottom-right) for Settings. Customizable colors. Ignores "Remove" field on manage page. Strong detection & value writing, MV scrape fallback, diagnostics, and smooth auto-scroll pre-scan to capture lazy-loaded rows. Ignores inputs inside its own UI so settings never get overwritten. Works with TornTools.
// @author       Dondermerwe
// @copyright    © 2025 Dondermerwe — All Rights Reserved
// @license      Apache-2.0
// @homepageURL  https://example.com/   // (optional: your page/repo; remove if not used)
// @supportURL   https://example.com/   // (optional)
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/bazaar*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552889/Torn%20Bazaar%20Price%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/552889/Torn%20Bazaar%20Price%20Updater.meta.js
// ==/UserScript==

(function () {
  'use strict';

    /*
  Copyright (c) 2025 Dondermerwe

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy at http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  */


  // ---- Author & metadata note (warn-only; do not abort) ----
  const EXPECTED_META = Object.freeze({
    name: 'Torn Bazaar Price Updater',
    namespace: 'Dondermerwe',
    author: 'Dondermerwe'
  });

  (function softAttributionCheck() {
    try {
      const info = (typeof GM_info !== 'undefined' ? GM_info :
                   (typeof GM !== 'undefined' && GM.info ? GM.info : null));
      const meta = info && (info.script || {});
      const metaStr = info && info.scriptMetaStr || '';

      const looksRight =
        meta.name === EXPECTED_META.name &&
        meta.namespace === EXPECTED_META.namespace &&
        meta.author === EXPECTED_META.author ||
        // Also accept when raw meta block *contains* your tags (some managers don’t fill GM_info fully)
        (/\b@author\s+Dondermerwe\b/i.test(metaStr) &&
         /\b@namespace\s+Dondermerwe\b/i.test(metaStr) &&
         /\b@name\s+Torn Bazaar Price Updater\b/i.test(metaStr));

      if (!looksRight) {
        console.warn('[Bazaar Auto Price] Non-official build or metadata changed. Author: Dondermerwe');
        // Intentionally DO NOT abort — users can still run it.
      }
    } catch {
      // If we can’t read metadata, don’t punish the user; just note it.
      console.warn('[Bazaar Auto Price] Could not verify metadata (GM_info unavailable). Author: Dondermerwe');
    }
  })();
  // ---- /warn-only attribution check ----



  // =========== Defaults & persisted config ===========
  const DEFAULTS = {
    discountPercent: 2,      // Positive => MV - %, Negative => MV + %
    debug: true,
    testItemId: 196,
    throttleMs: 140,
    headingText: 'Bazaar Auto Update',
    deepScanDefault: false,
    theme: { bg:'#1e1f24', border:'#2a2c33', accent:'#0a84ff' },
    autoScroll: {
      segments: 6,           // waypoints downwards (mirrored upwards)
      pauseMs: 180,          // pause after each segment to let DOM render
      downDurationMs: 1200,  // total duration going down
      upDurationMs: 1000     // total duration going up
    }
  };

  let CONFIG = {
    apiKey: GM_getValue('bap_api_key', ''),
    discountPercent: Number(GM_getValue('bap_discount_percent', DEFAULTS.discountPercent)) || DEFAULTS.discountPercent,
    debug: GM_getValue('bap_debug', DEFAULTS.debug),
    throttleMs: DEFAULTS.throttleMs,
    deepScanDefault: GM_getValue('bap_deep_scan_default', DEFAULTS.deepScanDefault),
    theme: {
      bg: GM_getValue('bap_theme_bg', DEFAULTS.theme.bg),
      border: GM_getValue('bap_theme_border', DEFAULTS.theme.border),
      accent: GM_getValue('bap_theme_accent', DEFAULTS.theme.accent),
    }
  };

  const log   = (...a) => CONFIG.debug && console.log('[Bazaar Auto Price]', ...a);
  const warn  = (...a) => console.warn('[Bazaar Auto Price]', ...a);
  const error = (...a) => console.error('[Bazaar Auto Price]', ...a);

  // =========== API helpers ===========
  const API_BASE = 'https://api.torn.com';
  const mvCache = new Map();
  let APIERROR = false;

  const tornApiGet = (pathWithQuery) =>
    new Promise((resolve, reject) => {
      const key = CONFIG.apiKey || '';
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${API_BASE}/${pathWithQuery}&key=${encodeURIComponent(key)}`,
        headers: { Accept: 'application/json' },
        onload: (res) => { try { resolve(JSON.parse(res.responseText || '{}')); } catch (e) { reject(e); } },
        onerror: (err) => reject(err),
      });
    });

  async function getMarketValueFromAPI(itemId) {
    if (!CONFIG.apiKey) return '';
    if (APIERROR) return 'API key error';
    if (mvCache.has(itemId)) return mvCache.get(itemId);
    try {
      const data = await tornApiGet(`torn/${encodeURIComponent(itemId)}?selections=items`);
      if (data?.error) {
        APIERROR = true;
        warn('API error:', data.error);
        mvCache.set(itemId, 'API key error');
        return 'API key error';
      }
      const mv = data?.items?.[itemId]?.market_value;
      if (!Number.isFinite(mv)) { mvCache.set(itemId, ''); return ''; }
      mvCache.set(itemId, mv);
      return mv;
    } catch (e) {
      error('API get MV failed:', e);
      mvCache.set(itemId, '');
      return '';
    }
  }

  // Positive % => MV - %, Negative % => MV + %
  const priceFromMV = (mv, pct) => {
    const p = Number(pct) || 0;
    const price = p >= 0
      ? Number(mv) * (1 - p / 100)
      : Number(mv) * (1 + Math.abs(p) / 100);
    return Math.round(Math.max(0, price));
  };

  // =========== Theme ===========
  GM_addStyle(`
    :root { --bap-bg:${CONFIG.theme.bg}; --bap-border:${CONFIG.theme.border}; --bap-accent:${CONFIG.theme.accent}; }
    .bap-btn{padding:8px 12px;border-radius:6px;border:1px solid #3b3d45;background:#111;color:#fff;cursor:pointer;line-height:1;font-family:inherit;font-size:12px}
    .bap-btn.primary{background:var(--bap-accent);border-color:var(--bap-accent);color:#fff}
    .bap-btn.danger{background:#e5484d;border-color:#e5484d;color:#fff}
    .bap-panel{position:relative;background:var(--bap-bg);color:#e6e8ec;border:1px solid var(--bap-border);border-radius:12px;padding:12px;margin:10px 0 14px;box-shadow:0 10px 26px rgba(0,0,0,.35)}
    .bap-panel h3{margin:0 0 8px;font-size:15px;font-weight:600;color:#fff}
    .bap-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .bap-badge{margin-left:4px;font-size:11px;padding:4px 8px;border-radius:999px;border:1px solid #3b3d45;background:#0f1013;color:#cdd0d6}
    .bap-gear{position:absolute;right:10px;bottom:10px;width:34px;height:34px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;border:1px solid #3b3d45;background:#111;color:#fff;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.35);font-size:18px}
    .bap-gear:hover{filter:brightness(1.1)}
    .bap-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999998;display:none}
    .bap-modal{position:fixed;inset:0;display:none;z-index:999999;align-items:center;justify-content:center}
    .bap-card{width:min(560px,94vw);background:var(--bap-bg);color:#fff;border-radius:12px;padding:18px 18px 14px;border:1px solid var(--bap-border);box-shadow:0 12px 32px rgba(0,0,0,.5);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Arial,Noto Sans,Apple Color Emoji,Segoe UI Emoji}
    .bap-card h4{margin:0 0 10px;font-size:18px}
    .bap-row{margin:10px 0}
    .bap-row label{display:block;font-size:12px;opacity:.9;margin-bottom:6px}
    .bap-row input[type="text"],.bap-row input[type="number"],.bap-row input[type="password"],.bap-row input[type="color"]{width:100%;padding:8px 10px;border-radius:8px;border:1px solid #3b3d45;background:#0f1013;color:#fff}
    .bap-row .bap-inline{display:flex;gap:8px;align-items:center}
    .bap-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
  `);

  // =========== Helpers to ignore our own UI ===========
  function isInBAPUI(el) {
    return !!(el && (el.closest('.bap-modal') || el.closest('.bap-card') || el.closest('.bap-panel')));
  }

  // =========== Visibility & input detection ===========
  function isVisible(el) {
    if (!el) return false;
    const cs = window.getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return false;
    if (el.getClientRects && el.getClientRects().length > 0) return true;
    return !!el.offsetParent;
  }

  const PRICE_CANDIDATE_SELECTORS = [
    'input[type="text"]','input[type="number"]','input[type="tel"]',
    'input[inputmode="numeric"]','input[inputmode="decimal"]',
    'input[pattern*="\\d"]',
    'input[placeholder*="$"]','input[placeholder*="£"]','input[placeholder*="€"]',
    'input[data-testid*="price" i]','input[data-test*="price" i]','input[data-field*="price" i]','input[data-name*="price" i]',
    'input[class*="price" i]','input[class*="money" i]','input[class*="cost" i]','input[id*="price" i]','input[name*="price" i]',
    '[role="textbox"]','[role="spinbutton"]',
    'div[contenteditable="true"]','span[contenteditable="true"]'
  ].join(',');

  const PRICE_WORD  = /(price|cost|sell|money|value|listing|amountprice|ask)/i;
  const REMOVE_WORD = /(^(?:remove|rmv|delete|del)\b|\bremove\b|\bto remove\b|\bremove amount\b)/i;

  function looksLikeRemoveInput(el) {
    const cls = `${el.className || ''} ${el.id || ''}`;
    const nameAttr = el.name || '';
    const placeholder = el.placeholder || '';
    const aria = el.getAttribute?.('aria-label') || '';
    if (REMOVE_WORD.test(cls) || REMOVE_WORD.test(nameAttr) || REMOVE_WORD.test(placeholder) || REMOVE_WORD.test(aria)) return true;
    const labelBy = el.getAttribute?.('aria-labelledby');
    if (labelBy) {
      const labelNode = document.getElementById(labelBy);
      if (labelNode && REMOVE_WORD.test(labelNode.textContent || '')) return true;
    }
    const sib = el.previousElementSibling;
    if (sib && REMOVE_WORD.test(sib.textContent || '')) return true;
    return false;
  }

  function looksLikePriceInput(el) {
    if (!el) return false;
    if (isInBAPUI(el)) return false; // ignore our own UI entirely
    if (el.hasAttribute('readonly') || el.hasAttribute('disabled')) return false;
    if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') return false;
    if (looksLikeRemoveInput(el)) return false;

    const tag = el.tagName?.toLowerCase() || '';
    const type = (el.type || '').toLowerCase();
    const isTextual =
      (tag === 'input' && (type === 'text' || type === 'number' || type === 'tel')) ||
      el.getAttribute?.('contenteditable') === 'true' ||
      el.getAttribute?.('role') === 'textbox' ||
      el.getAttribute?.('role') === 'spinbutton';
    if (!isTextual) return false;

    const cls = `${el.className || ''} ${el.id || ''}`;
    const nameAttr = el.name || '';
    const placeholder = el.placeholder || '';
    const aria = el.getAttribute?.('aria-label') || '';
    if (PRICE_WORD.test(cls) || PRICE_WORD.test(nameAttr) || PRICE_WORD.test(placeholder) || PRICE_WORD.test(aria)) return true;

    const labelBy = el.getAttribute?.('aria-labelledby');
    if (labelBy) {
      const labelNode = document.getElementById(labelBy);
      if (labelNode && PRICE_WORD.test(labelNode.textContent || '')) return true;
    }
    const sib = el.previousElementSibling;
    if (sib && PRICE_WORD.test(sib.textContent || '')) return true;

    const cont = el.closest?.('[class*="price" i], [class*="money" i], [class*="cost" i], [class*="sell" i], [class*="value" i]') || el.parentElement;
    if (cont && PRICE_WORD.test(cont.className || '')) return true;

    const parentText = (el.closest?.('[class]')?.textContent || '').slice(0, 200);
    if (/[€$£]|Torn|\b\$/.test(parentText) && (type === 'number' || type === 'tel' || el.getAttribute?.('contenteditable') === 'true')) return true;

    return false;
  }

  function collectPriceInputs({ debug = false, deep = false } = {}) {
    const nodes = Array.from(document.querySelectorAll(PRICE_CANDIDATE_SELECTORS));
    const accepted = [];
    const reasons = [];
    const seen = new Set();

    for (const el of nodes) {
      if (isInBAPUI(el)) { if (debug) reasons.push(['bap-ui', el]); continue; } // ignore our UI
      if (!deep && !isVisible(el)) { if (debug) reasons.push(['hidden', el]); continue; }
      if (looksLikeRemoveInput(el)) { if (debug) reasons.push(['remove-field', el]); continue; }
      if (!looksLikePriceInput(el)) { if (debug) reasons.push(['not price-like', el]); continue; }
      if (seen.has(el)) continue;
      seen.add(el);
      accepted.push(el);
    }

    if (debug) {
      console.group('[Bazaar Auto Price] Input scan');
      console.log('Candidates:', nodes.length);
      console.log('Accepted price inputs:', accepted.length, accepted);
      if (reasons.length) {
        console.log('Rejected (reason, element):');
        reasons.slice(0, 160).forEach(r => console.log(r[0], r[1]));
        if (reasons.length > 160) console.log(`(…and ${reasons.length - 160} more)`);
      }
      console.groupEnd();
    }
    return accepted;
  }

  // =========== Item ID detection ===========
  function findItemIdFromContext(el) {
    const root = el.closest?.('[class*="item"], [class*="row"], [class*="card"], li, .bazaar-item, .ui-dialog, [id*="bazaar"], [class*="bazaar"]')
             || el.parentElement || document;

    const img = root.querySelector?.('img[src*="/images/items/"]') || document.querySelector('img[src*="/images/items/"]');
    if (img?.src) {
      const m = img.src.match(/\/images\/items\/(\d+)\/(?:medium|large)\.png/i) || img.src.match(/\/images\/items\/(\d+)\//i);
      if (m) return m[1];
    }

    const link = root.querySelector?.('a[href*="items.php"], a[href*="item.php"]') || document.querySelector('a[href*="items.php"]');
    if (link?.href) {
      const m = link.href.match(/[?&](?:XID|id|IID)=(\d+)/i);
      if (m) return m[1];
    }

    const meta = root.querySelector?.('[data-item-id],[data-id],[data-itemid],[data-key],input[name="item_id"],input[name="itemId"],input[name="XID"]');
    if (meta) {
      const id = meta.dataset?.itemId || meta.dataset?.id || meta.dataset?.itemid || meta.dataset?.key || meta.value || '';
      if (/^\d+$/.test(id)) return id;
    }

    const hidden = root.querySelector?.('input[type="hidden"][name*="item" i]');
    if (hidden?.value && /^\d+$/.test(hidden.value)) return hidden.value;

    let p = root.parentElement;
    for (let i = 0; i < 5 && p; i++, p = p.parentElement) {
      const img2 = p.querySelector?.('img[src*="/images/items/"]');
      if (img2?.src) {
        const m2 = img2.src.match(/\/images\/items\/(\d+)\/(?:medium|large)\.png/i) || img2.src.match(/\/images\/items\/(\d+)\//i);
        if (m2) return m2[1];
      }
    }
    return null;
  }

  // =========== MV fallback (scrape) ===========
  const MV_TEXT_RE = /(market[\s-]*value|average|estimated|avg|est|mv|value)\s*[:\-]?\s*[\$£€]?\s*([\d,.]+)/i;

  function scrapeLocalMVFromContext(el) {
    const container = el.closest?.('[class]') || el.parentElement || document;
    const attrHit = container.querySelector?.('[data-mv],[data-market-value],[data-value]');
    const tryAttr = (n) => {
      if (!n) return null;
      const v = n.getAttribute('data-mv') || n.getAttribute('data-market-value') || n.getAttribute('data-value') || n.getAttribute('aria-valuetext');
      if (!v) return null;
      const num = Number(String(v).replace(/[^\d.]/g, ''));
      return Number.isFinite(num) && num > 0 ? num : null;
    };
    let num = tryAttr(attrHit);
    if (Number.isFinite(num)) return num;

    const nodes = Array.from(container.querySelectorAll?.('*') || []);
    for (let i = 0; i < Math.min(500, nodes.length); i++) {
      const t = (nodes[i].textContent || '').trim();
      if (!t) continue;
      const m = t.match(MV_TEXT_RE);
      if (m && m[2]) {
        const val = Number(String(m[2]).replace(/[^\d.]/g, ''));
        if (Number.isFinite(val) && val > 0) return val;
      }
    }
    return null;
  }

  // =========== Value writing helpers ===========
  function clickFocus(el) {
    try { el.scrollIntoView?.({ block: 'center', inline: 'nearest' }); } catch {}
    try { el.click?.(); } catch {}
    try { el.dispatchEvent?.(new MouseEvent('mousedown', { bubbles: true })); } catch {}
    try { el.dispatchEvent?.(new MouseEvent('mouseup',   { bubbles: true })); } catch {}
    try { el.focus?.({ preventScroll: true }); } catch {}
    try { el.dispatchEvent?.(new FocusEvent('focus', { bubbles: true })); } catch {}
  }

  function setFieldValue(el, val) {
    val = String(val);

    if (el.getAttribute?.('contenteditable') === 'true' || el.getAttribute?.('role') === 'textbox') {
      clickFocus(el);
      const last = el.innerText;
      try {
        document.getSelection()?.selectAllChildren?.(el);
        document.execCommand('insertText', false, val);
      } catch {
        el.innerText = val;
      }
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('keyup',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      if (el._valueTracker) el._valueTracker.setValue(last);
      return;
    }

    if (el.getAttribute?.('role') === 'spinbutton') {
      clickFocus(el);
      const last = el.value ?? '';
      el.value = val;
      el.setAttribute('aria-valuenow', val);
      el.setAttribute('value', val);
      el.dispatchEvent(new Event('input',  { bubbles: true }));
      el.dispatchEvent(new Event('keyup',  { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      if (el._valueTracker) el._valueTracker.setValue(last);
      return;
    }

    clickFocus(el);
    const lastValue = el.value ?? '';
    el.value = val;
    const ev = new Event('input', { bubbles: true });
    ev.simulated = true;
    if (el._valueTracker) el._valueTracker.setValue(lastValue);
    el.dispatchEvent(ev);
    el.dispatchEvent(new Event('keyup',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // =========== Focus-to-fill (ignore our UI) ===========
  document.addEventListener('focusin', (ev) => {
    setTimeout(async () => {
      const input = ev.target;
      if (isInBAPUI(input)) return;         // ignore our settings/panel
      if (!looksLikePriceInput(input)) return;

      const itemId = findItemIdFromContext(input);
      if (!itemId) return;

      let mv = await getMarketValueFromAPI(itemId);
      if (!Number.isFinite(mv)) {
        const scraped = scrapeLocalMVFromContext(input);
        if (Number.isFinite(scraped)) mv = scraped;
      }
      if (!Number.isFinite(mv)) return;

      setFieldValue(input, String(priceFromMV(mv, CONFIG.discountPercent)));
    }, 0);
  }, true);

  // =========== Settings UI ===========
  const backdrop = document.createElement('div');
  backdrop.className = 'bap-modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'bap-modal';
  modal.innerHTML = `
    <div class="bap-card">
      <h4>Bazaar Auto Update — Settings</h4>

      <div class="bap-row">
        <label for="bap-key">Torn API Key</label>
        <div class="bap-inline">
          <input id="bap-key" type="password" placeholder="Paste your Torn API key" autocomplete="off" />
          <button class="bap-btn" data-action="toggle-visibility" title="Show/Hide">👁️</button>
        </div>
      </div>

      <div class="bap-row">
        <label for="bap-discount">% relative to Market Value (positive lowers price, negative raises price)</label>
        <input id="bap-discount" type="number" min="-99.99" max="200" step="0.25" placeholder="2" />
      </div>

      <div class="bap-row">
        <label>Panel Colors</label>
        <div class="bap-inline" style="flex-wrap:wrap; gap:12px">
          <div><div style="font-size:12px;opacity:.9;margin-bottom:4px">Background</div><input id="bap-color-bg" type="color" value="${CONFIG.theme.bg}"></div>
          <div><div style="font-size:12px;opacity:.9;margin-bottom:4px">Border</div><input id="bap-color-border" type="color" value="${CONFIG.theme.border}"></div>
          <div><div style="font-size:12px;opacity:.9;margin-bottom:4px">Accent</div><input id="bap-color-accent" type="color" value="${CONFIG.theme.accent}"></div>
          <button class="bap-btn" data-action="theme-reset" title="Reset to defaults">Reset</button>
        </div>
      </div>

      <div class="bap-row">
        <label><input id="bap-deep-default" type="checkbox" ${GM_getValue('bap_deep_scan_default', DEFAULTS.deepScanDefault) ? 'checked' : ''}/> Deep Scan by default (same as holding Alt)</label>
      </div>

      <div class="bap-actions">
        <button class="bap-btn" data-action="test">Test API</button>
        <div style="flex:1"></div>
        <button class="bap-btn danger" data-action="clear">Clear key</button>
        <button class="bap-btn" data-action="cancel">Cancel</button>
        <button class="bap-btn primary" data-action="save">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  function applyThemeToDocument(theme) {
    document.documentElement.style.setProperty('--bap-bg', theme.bg);
    document.documentElement.style.setProperty('--bap-border', theme.border);
    document.documentElement.style.setProperty('--bap-accent', theme.accent);
  }

  function showSettings() {
    const keyInput   = modal.querySelector('#bap-key');
    const discInput  = modal.querySelector('#bap-discount');
    const cBg        = modal.querySelector('#bap-color-bg');
    const cBorder    = modal.querySelector('#bap-color-border');
    const cAccent    = modal.querySelector('#bap-color-accent');
    const deepChk    = modal.querySelector('#bap-deep-default');

    keyInput.value  = CONFIG.apiKey || '';
    discInput.value = CONFIG.discountPercent ?? DEFAULTS.discountPercent;
    cBg.value       = CONFIG.theme.bg;
    cBorder.value   = CONFIG.theme.border;
    cAccent.value   = CONFIG.theme.accent;
    deepChk.checked = !!CONFIG.deepScanDefault;

    cBg.oninput     = () => applyThemeToDocument({ ...CONFIG.theme, bg: cBg.value });
    cBorder.oninput = () => applyThemeToDocument({ ...CONFIG.theme, border: cBorder.value });
    cAccent.oninput = () => applyThemeToDocument({ ...CONFIG.theme, accent: cAccent.value });

    backdrop.style.display = 'block';
    modal.style.display = 'flex';
    keyInput.focus();
  }
  function hideSettings() {
    backdrop.style.display = 'none';
    modal.style.display = 'none';
    applyThemeToDocument(CONFIG.theme);
  }
  backdrop.addEventListener('click', hideSettings);

  modal.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');

    const keyInput   = modal.querySelector('#bap-key');
    const discInput  = modal.querySelector('#bap-discount');
    const cBg        = modal.querySelector('#bap-color-bg');
    const cBorder    = modal.querySelector('#bap-color-border');
    const cAccent    = modal.querySelector('#bap-color-accent');
    const deepChk    = modal.querySelector('#bap-deep-default');

    if (action === 'toggle-visibility') { keyInput.type = keyInput.type === 'password' ? 'text' : 'password'; return; }
    if (action === 'cancel') { hideSettings(); return; }
    if (action === 'clear') { GM_setValue('bap_api_key',''); CONFIG.apiKey=''; mvCache.clear(); hideSettings(); return; }
    if (action === 'theme-reset') { cBg.value=DEFAULTS.theme.bg; cBorder.value=DEFAULTS.theme.border; cAccent.value=DEFAULTS.theme.accent; applyThemeToDocument(DEFAULTS.theme); return; }
    if (action === 'save') {
      const key   = (keyInput.value || '').trim();
      const pct   = Number(discInput.value);
      const theme = { bg:cBg.value||DEFAULTS.theme.bg, border:cBorder.value||DEFAULTS.theme.border, accent:cAccent.value||DEFAULTS.theme.accent };
      const deep  = !!deepChk.checked;
      GM_setValue('bap_api_key', key);
      GM_setValue('bap_discount_percent', pct);
      GM_setValue('bap_theme_bg', theme.bg);
      GM_setValue('bap_theme_border', theme.border);
      GM_setValue('bap_theme_accent', theme.accent);
      GM_setValue('bap_deep_scan_default', deep);
      CONFIG.apiKey = key; CONFIG.discountPercent = pct; CONFIG.theme = theme; CONFIG.deepScanDefault = deep;
      mvCache.clear();
      applyThemeToDocument(CONFIG.theme);
      hideSettings(); return;
    }
    if (action === 'test') {
      const trialKey = (keyInput.value || '').trim();
      if (!trialKey) { alert('Enter an API key first.'); return; }
      try {
        const data = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_BASE}/torn/${DEFAULTS.testItemId}?selections=items&key=${encodeURIComponent(trialKey)}`,
            headers: { Accept: 'application/json' },
            onload: (res) => { try { resolve(JSON.parse(res.responseText || '{}')); } catch (e) { reject(e); } },
            onerror: (err) => reject(err),
          });
        });
        if (data?.error) alert(`API error: ${data.error.code} ${data.error.error}`);
        else if (data?.items?.[DEFAULTS.testItemId]?.market_value) alert('API OK ✓ Market Value fetched.');
        else alert('API reachable, but market_value missing.');
      } catch (err) {
        alert('Network/parse error. Check console.'); console.error('[Bazaar Auto Price] Test API error:', err);
      }
    }
  });

  GM_registerMenuCommand('Bazaar Auto Update → Settings', showSettings);

  // =========== Panel (UI) ===========
  function buildPanel() {
    const panel = document.createElement('div');
    panel.className = 'bap-panel';

    const heading = document.createElement('h3');
    heading.textContent = DEFAULTS.headingText;

    const bar = document.createElement('div');
    bar.className = 'bap-toolbar';

    const btnUpdate = document.createElement('button');
    btnUpdate.className = 'bap-btn';
    btnUpdate.type = 'button';
    btnUpdate.textContent = 'Update All Prices';
    btnUpdate.title = 'Click to update all. Hold Alt for Deep Scan.';
    btnUpdate.addEventListener('click', (e) => updateAllPrices(btnUpdate, badge, e ? (e.altKey || CONFIG.deepScanDefault) : CONFIG.deepScanDefault));

    const badge = document.createElement('span');
    badge.className = 'bap-badge';
    badge.textContent = 'Idle';

    const gear = document.createElement('button');
    gear.className = 'bap-gear';
    gear.type = 'button';
    gear.title = 'Settings';
    gear.textContent = '⚙️';
    gear.addEventListener('click', showSettings);

    bar.appendChild(btnUpdate);
    bar.appendChild(badge);

    panel.appendChild(heading);
    panel.appendChild(bar);
    panel.appendChild(gear);

    return { panel, badge, btnUpdate };
  }

  let panelRefs = null;
  function mountPanelAboveBazaarRoot() {
    const root = document.getElementById('bazaarRoot');
    if (!root) return false;
    if (document.querySelector('.bap-panel')) return true;
    const { panel, badge, btnUpdate } = buildPanel();
    panelRefs = { badge, btnUpdate };
    root.insertAdjacentElement('beforebegin', panel);
    log('Mounted Bazaar Auto Update panel.');
    return true;
  }

  // =========== Smooth auto-scroll helpers ===========
  function getScrollElement() {
    return document.scrollingElement || document.documentElement || document.body;
  }
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  function smoothScrollTo(targetY, durationMs, badgeEl, label = 'Preparing…') {
    return new Promise((resolve) => {
      const scroller = getScrollElement();
      const startY = scroller.scrollTop;
      const delta = Math.max(0, targetY) - startY;
      const start = performance.now();
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (durationMs <= 0 || Math.abs(delta) < 2 || reduce) {
        scroller.scrollTo(0, Math.max(0, targetY));
        if (badgeEl && !reduce) badgeEl.textContent = `${label}`;
        resolve();
        return;
      }
      function frame(now) {
        const t = Math.min(1, (now - start) / durationMs);
        const y = startY + delta * easeInOutQuad(t);
        scroller.scrollTo(0, y);
        if (badgeEl) {
          const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
          const pct = Math.min(100, Math.round((y / max) * 100));
          badgeEl.textContent = `${label} (${pct}%)`;
        }
        if (t < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  async function autoScrollPreScan(segments, pauseMs, badgeEl) {
    const scroller = getScrollElement();
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const segs = Math.max(2, segments ?? DEFAULTS.autoScroll.segments);
    const pause = Math.max(0, pauseMs ?? DEFAULTS.autoScroll.pauseMs);

    let max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    if (max <= 0) return;

    // Down in segments
    for (let i = 1; i <= segs; i++) {
      max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const target = Math.round((i / segs) * max);
      const dur = Math.round(DEFAULTS.autoScroll.downDurationMs / segs);
      if (badgeEl) badgeEl.textContent = `Preparing…`;
      if (reduce) scroller.scrollTo(0, target);
      else await smoothScrollTo(target, dur, badgeEl, 'Preparing…');
      if (pause) await new Promise(r => setTimeout(r, pause));
    }

    // Up
    max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
    if (reduce) scroller.scrollTo(0, 0);
    else await smoothScrollTo(0, DEFAULTS.autoScroll.upDurationMs, badgeEl, 'Preparing…');

    scroller.scrollTo(0, 0);
  }

  // =========== Update All (smooth auto-scroll + diagnostics) ===========
  async function updateAllPrices(btn, badgeEl, deep = false) {
    if (!CONFIG.apiKey) { showSettings(); return; }

    btn.disabled = true;

    // 1) Smooth pre-scan scroll (down then up)
    try {
      if (badgeEl) badgeEl.textContent = 'Preparing… (0%)';
      await autoScrollPreScan(DEFAULTS.autoScroll.segments, DEFAULTS.autoScroll.pauseMs, badgeEl);
    } catch (e) {
      warn('Auto-scroll pre-scan failed (continuing):', e);
    }

    // 2) Collect inputs after pre-scan
    const inputs = collectPriceInputs({ debug: false, deep });
    const total = inputs.length;
    if (!total) { if (badgeEl) badgeEl.textContent = deep ? 'No inputs (deep)' : 'No inputs'; btn.disabled = false; return; }

    const stats = { total, setOk:0, setFailed:0, noItemId:0, mvAPI:0, mvScraped:0, mvMissing:0 };
    if (badgeEl) badgeEl.textContent = `Updating 0/${total}`;

    const rows = [];

    // 3) Update loop
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      let row = { index:i+1, status:'', itemId:'', origin:'', price:'', note:'' };

      try {
        const itemId = findItemIdFromContext(input);
        row.itemId = itemId || '(none)';
        if (!itemId) { stats.noItemId++; row.status='skip'; row.note='no itemId'; continue; }

        let mv = await getMarketValueFromAPI(itemId);
        if (Number.isFinite(mv)) { stats.mvAPI++; row.origin='API'; }
        if (!Number.isFinite(mv)) {
          const scraped = scrapeLocalMVFromContext(input);
          if (Number.isFinite(scraped)) { mv = scraped; stats.mvScraped++; row.origin='SCRAPE'; }
        }
        if (!Number.isFinite(mv)) { stats.mvMissing++; row.status='skip'; row.note='mv missing'; continue; }

        const price = priceFromMV(mv, CONFIG.discountPercent);
        setFieldValue(input, String(price));
        stats.setOk++; row.status='OK'; row.price=price;

      } catch (e) {
        stats.setFailed++; row.status='error'; row.note = String(e?.message || e);
      } finally {
        rows.push(row);
        if (badgeEl) badgeEl.textContent = `Updating ${i+1}/${total}`;
        await new Promise(r => setTimeout(r, CONFIG.throttleMs));
      }
    }

    // 4) Summary
    if (badgeEl) {
      const summary = `Done: set ${stats.setOk}, skipped ${stats.total - stats.setOk} (noId ${stats.noItemId}, mvMissing ${stats.mvMissing}, failed ${stats.setFailed})${deep ? ' (deep)' : ''}`;
      badgeEl.textContent = summary;
    }

    // 5) Diagnostics
    console.group('[Bazaar Auto Price] UpdateAll report');
    console.table(rows);
    console.log('Stats:', stats, 'Deep:', deep);
    console.groupEnd();

    btn.disabled = false;

    // 6) Return to top
    try { getScrollElement().scrollTo(0, 0); } catch {}
  }

  // =========== Mount panel ===========
  let tries = 0;
  const MAX_TRIES = 12;
  const tryMount = () => {
    if (mountPanelAboveBazaarRoot()) return;
    if (++tries < MAX_TRIES) setTimeout(tryMount, 500);
    else {
      const obs = new MutationObserver(() => mountPanelAboveBazaarRoot());
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 15000);
    }
  };
  tryMount();

  // Apply theme now
  applyThemeToDocument(CONFIG.theme);
})();
