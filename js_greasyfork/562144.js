// ==UserScript==
// @name         Torn AH - Item search DB
// @namespace    torn.com
// @version      1.0.9
// @description  Floating movable panel + GET-ITEM buttons on amarket rows to display item stats/bonuses.
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/amarket.php*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562144/Torn%20AH%20-%20Item%20search%20DB.user.js
// @updateURL https://update.greasyfork.org/scripts/562144/Torn%20AH%20-%20Item%20search%20DB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEY_POS = 'sg_am_getitem_panel_pos_v1';
  const KEY_VIS = 'sg_am_getitem_panel_vis_v1';
  const KEY_DB_ENDPOINT = 'sg_am_db_endpoint_v1';
  const KEY_DB_LIMIT = 'sg_am_db_limit_v1';
  const KEY_STAT_RANGE = 'sg_am_stat_range_v1';
  const KEY_BONUS_RANGE = 'sg_am_bonus_range_v1';

  const DEFAULT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzgN3pN3vrnUGd_7TuPXqJZt5b-dG1yLtnUbyYBFG_u6DcuuuhLKuM2J1CGLCM8O2c65w/exec';
  const DEFAULT_LIMIT = 50;
  const DEFAULT_STAT_RANGE = 1.5;
  const DEFAULT_BONUS_RANGE = 1.0;

  const neon = '#39ff14';
  const orange = '#ff9900';
  const panelId = 'sg-am-getitem-panel';
  const btnClass = 'sg-am-x-btn';

  function safeTxt(v) {
    const s = String(v ?? '').trim();
    return s.length ? s : '-';
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function toNumStat(v) {
    let s = String(v ?? '').trim();
    if (!s) return null;
    if (s.includes(',') && !s.includes('.')) s = s.replace(',', '.');
    s = s.replace(/[^\d.\-]/g, '');
    const parts = s.split('.');
    if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join('');
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  }

  function moneyToInt(v) {
    const s = String(v ?? '').replace(/[^\d]/g, '');
    if (!s) return null;
    const n = parseInt(s, 10);
    return Number.isFinite(n) ? n : null;
  }

  function clampStepHalf(n, min, max) {
    let x = Number(n);
    if (!Number.isFinite(x)) x = min;
    x = Math.max(min, Math.min(max, x));
    x = Math.round(x * 2) / 2;
    return x;
  }

  function getDbLimit() {
    const raw = GM_getValue(KEY_DB_LIMIT, DEFAULT_LIMIT);
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
    return Math.max(1, Math.min(300, n));
  }

  function getStatRange() {
    return clampStepHalf(GM_getValue(KEY_STAT_RANGE, DEFAULT_STAT_RANGE), 0, 2.5);
  }

  function getBonusRange() {
    return clampStepHalf(GM_getValue(KEY_BONUS_RANGE, DEFAULT_BONUS_RANGE), 0, 2.5);
  }

  function decodeHtmlEntities(s) {
    if (!s) return '';
    const t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }

  function parseBonusFromTitle(titleAttr) {
    const decoded = decodeHtmlEntities(titleAttr || '');
    const nameMatch = decoded.match(/<b>(.*?)<\/b>/i);
    const name = (nameMatch && nameMatch[1]) ? nameMatch[1].trim() : decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const noTags = decoded.replace(/<[^>]*>/g, ' ');
    const pct = noTags.match(/(\d+(?:\.\d+)?)\s*%/);
    const val = pct ? parseFloat(pct[1]) : null;
    return { name: name || '', val: Number.isFinite(val) ? val : null };
  }

  function getStatFromRow(li, iconClass) {
    const el = li.querySelector(`.infobonuses i.${iconClass}`);
    if (!el) return null;
    const wrap = el.closest('.bonus-attachment');
    const val = wrap ? wrap.querySelector('.label-value') : null;
    return val ? val.textContent.trim() : null;
  }

  function parseRow(li) {
    const nameEl = li.querySelector('.item-name');
    const name = nameEl ? nameEl.textContent.trim() : '(unknown item)';

    const dmg = getStatFromRow(li, 'bonus-attachment-item-damage-bonus');
    const acc = getStatFromRow(li, 'bonus-attachment-item-accuracy-bonus');
    const def = getStatFromRow(li, 'bonus-attachment-item-defence-bonus');

    const bonuses = Array.from(li.querySelectorAll('.iconsbonuses .bonus-attachment-icons'))
      .map(x => parseBonusFromTitle(x.getAttribute('title')))
      .filter(b => (b.name || '').trim().length);

    const b1 = bonuses[0] || { name: '-', val: null };
    const b2 = bonuses[1] || { name: '-', val: null };

    if (dmg != null || acc != null) {
      return { type: 'weapon', name, dmg: safeTxt(dmg), acc: safeTxt(acc), bonus1: b1.name || '-', bonus2: b2.name || '-', bonus1Val: b1.val, bonus2Val: b2.val };
    }
    if (def != null) {
      return { type: 'armor', name, def: safeTxt(def), bonus1: b1.name || '-', bonus2: b2.name || '-', bonus1Val: b1.val, bonus2Val: b2.val };
    }
    return { type: 'unknown', name, bonus1: b1.name || '-', bonus2: b2.name || '-', bonus1Val: b1.val, bonus2Val: b2.val };
  }

  function ensureStyles() {
    if (document.getElementById('sg-am-getitem-style')) return;

    const css = `
#${panelId}{
  position: fixed;
  z-index: 9999999;
  width: 340px;
  background: #2a2a2a;
  border: 2px solid ${neon};
  border-radius: 10px;
  color: #eaeaea;
  box-shadow: 0 10px 30px rgba(0,0,0,.45);
  font-family: Arial, sans-serif;
}
#${panelId}.hidden{ display:none !important; }
#${panelId} .sg-head{
  display:flex; align-items:center; justify-content:space-between;
  padding: 8px 10px; cursor: move; user-select:none;
  border-bottom: 1px solid rgba(57,255,20,.35);
}
#${panelId} .sg-title{ font-weight:700; font-size:13px; color:${neon}; }
#${panelId} .sg-x{
  cursor:pointer; font-weight:900; font-size:16px; line-height:16px;
  padding:2px 8px; border-radius:7px; color:#111; background:${neon};
}
#${panelId} .sg-body{ padding:10px; font-size:12px; }

#${panelId} .sg-sectionTitle{ margin:6px 0 8px 0; font-weight:800; color:${neon}; font-size:12px; }
#${panelId} .sg-row{ margin:6px 0; display:flex; gap:8px; }
#${panelId} .sg-k{ width:98px; color:#bfbfbf; }
#${panelId} .sg-v{ flex:1; color:#fff; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
#${panelId} .sg-hr{ height:1px; background: rgba(57,255,20,.25); margin:10px 0; }
#${panelId} .sg-hint{ color:#cfcfcf; opacity:.9; }

#${panelId} .sg-status{
  margin-top: 8px;
  padding: 8px;
  border-radius: 10px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(57,255,20,.18);
  color: #ddd;
}
#${panelId} .sg-status strong{ color:${neon}; }

#${panelId} .sg-results{
  margin-top: 8px;
  max-height: 240px;
  overflow: auto;
  padding-right: 4px;
}

#${panelId} .sg-card{
  border: 1px solid rgba(57,255,20,.25);
  background: rgba(0,0,0,.18);
  border-radius: 12px;
  padding: 8px;
  margin: 8px 0;
}
#${panelId} .sg-card.sg-perfect{
  border: 2px solid ${orange};
  box-shadow: 0 0 0 1px rgba(255,153,0,.25), 0 8px 20px rgba(0,0,0,.35);
}
#${panelId} .sg-card .sg-name{ font-weight:900; margin-bottom:6px; color:#fff; }
#${panelId} .sg-card .sg-mini{ display:flex; justify-content:space-between; gap:10px; margin:3px 0; }
#${panelId} .sg-card .sg-mini span:first-child{ color:#bfbfbf; }
#${panelId} .sg-card .sg-mini span:last-child{ font-weight:800; color:#fff; }

#${panelId} .sg-settings{
  border: 1px solid rgba(57,255,20,.18);
  background: rgba(255,255,255,.04);
  border-radius: 12px;
  padding: 8px;
}
#${panelId} .sg-set-row{ margin:8px 0; }
#${panelId} .sg-set-label{
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:6px; color:#ddd; font-weight:700;
}
#${panelId} input[type="range"]{ width:100%; }
#${panelId} .sg-num{
  width: 110px;
  padding: 4px 6px;
  border-radius: 10px;
  border: 1px solid rgba(57,255,20,.25);
  background: rgba(0,0,0,.25);
  color: #fff;
  font-weight: 800;
}

.${btnClass}{
  display:inline-flex; align-items:center; justify-content:center;
  width:16px; height:16px; margin-left:6px;
  border-radius:6px; border:1px solid ${neon};
  background: rgba(57,255,20,.10);
  color:${neon}; font-weight:900; font-size:11px; line-height:1;
  cursor:pointer; user-select:none;
}
.${btnClass}:hover{ background: rgba(57,255,20,.18); }
`;
    GM_addStyle(css);
    const style = document.createElement('style');
    style.id = 'sg-am-getitem-style';
    document.head.appendChild(style);
  }

  function loadPos() {
    const pos = GM_getValue(KEY_POS, null);
    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') return pos;
    return { left: 20, top: 140 };
  }

  function savePos(left, top) {
    GM_setValue(KEY_POS, { left, top });
  }

  function setVisible(isVisible) {
    GM_setValue(KEY_VIS, !!isVisible);
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.classList.toggle('hidden', !isVisible);
  }

  function isVisible() {
    return GM_getValue(KEY_VIS, true);
  }

  function ensurePanel() {
    ensureStyles();

    let panel = document.getElementById(panelId);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = panelId;

    const head = document.createElement('div');
    head.className = 'sg-head';

    const title = document.createElement('div');
    title.className = 'sg-title';
    title.textContent = 'AMarket Item';

    const x = document.createElement('div');
    x.className = 'sg-x';
    x.textContent = '×';
    x.addEventListener('click', () => setVisible(false));

    head.appendChild(title);
    head.appendChild(x);

    const body = document.createElement('div');
    body.className = 'sg-body';
    body.innerHTML = `
      <div class="sg-sectionTitle">Settings</div>
      <div class="sg-settings">
        <div class="sg-set-row">
          <div class="sg-set-label">
            <span>Stat range</span>
            <span>± <b data-sg="statRangeVal"></b></span>
          </div>
          <input data-sg="statRange" type="range" min="0" max="2.5" step="0.5">
        </div>

        <div class="sg-set-row">
          <div class="sg-set-label">
            <span>Bonus value range</span>
            <span>± <b data-sg="bonusRangeVal"></b></span>
          </div>
          <input data-sg="bonusRange" type="range" min="0" max="2.5" step="0.5">
        </div>

        <div class="sg-set-row" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div class="sg-set-label" style="margin:0;"><span>Limit</span></div>
          <input data-sg="limit" class="sg-num" type="number" min="1" max="300" step="1">
        </div>
      </div>

      <div class="sg-hr"></div>
      <div class="sg-hint">Click <b>X</b> next to <b>Item seller</b> to display details and search your DB.</div>
      <div class="sg-hr"></div>

      <div data-sg="selected"></div>
      <div data-sg="status"></div>
      <div class="sg-results" data-sg="results"></div>
    `;

    panel.appendChild(head);
    panel.appendChild(body);

    const pos = loadPos();
    panel.style.left = `${pos.left}px`;
    panel.style.top = `${pos.top}px`;
    panel.classList.toggle('hidden', !isVisible());
    document.body.appendChild(panel);

    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    head.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = panel.offsetLeft;
      startTop = panel.offsetTop;
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth - 6);
      const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight - 6);

      const newLeft = Math.min(maxLeft, Math.max(0, startLeft + dx));
      const newTop = Math.min(maxTop, Math.max(0, startTop + dy));

      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
    });

    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      savePos(panel.offsetLeft, panel.offsetTop);
    });

    initSettingsUI(panel);
    return panel;
  }

  function panelEls() {
    const panel = ensurePanel();
    return {
      selected: panel.querySelector('[data-sg="selected"]'),
      status: panel.querySelector('[data-sg="status"]'),
      results: panel.querySelector('[data-sg="results"]'),
      statRange: panel.querySelector('[data-sg="statRange"]'),
      statRangeVal: panel.querySelector('[data-sg="statRangeVal"]'),
      bonusRange: panel.querySelector('[data-sg="bonusRange"]'),
      bonusRangeVal: panel.querySelector('[data-sg="bonusRangeVal"]'),
      limit: panel.querySelector('[data-sg="limit"]'),
    };
  }

  function initSettingsUI(panel) {
    const els = panelEls();

    const stat = getStatRange();
    const bon = getBonusRange();
    const lim = getDbLimit();

    els.statRange.value = String(stat);
    els.statRangeVal.textContent = stat.toFixed(1);
    els.bonusRange.value = String(bon);
    els.bonusRangeVal.textContent = bon.toFixed(1);
    els.limit.value = String(lim);

    els.statRange.addEventListener('input', () => {
      const v = clampStepHalf(els.statRange.value, 0, 2.5);
      els.statRangeVal.textContent = v.toFixed(1);
      GM_setValue(KEY_STAT_RANGE, v);
    });

    els.bonusRange.addEventListener('input', () => {
      const v = clampStepHalf(els.bonusRange.value, 0, 2.5);
      els.bonusRangeVal.textContent = v.toFixed(1);
      GM_setValue(KEY_BONUS_RANGE, v);
    });

    els.limit.addEventListener('input', () => {
      const n = parseInt(String(els.limit.value || '').trim(), 10);
      if (!Number.isFinite(n)) return;
      GM_setValue(KEY_DB_LIMIT, Math.max(1, Math.min(300, n)));
    });

    els.limit.addEventListener('change', () => {
      els.limit.value = String(getDbLimit());
    });
  }

  function setStatus(html) {
    const { status } = panelEls();
    status.innerHTML = `<div class="sg-status">${html}</div>`;
  }

  function clearResults() {
    const { results } = panelEls();
    results.innerHTML = '';
  }

  function renderSelected(data) {
    const { selected } = panelEls();
    const statRange = getStatRange();

    const b1 = data.bonus1Val != null ? `${data.bonus1} (${data.bonus1Val}%)` : data.bonus1;
    const b2 = data.bonus2Val != null ? `${data.bonus2} (${data.bonus2Val}%)` : data.bonus2;

    const rows = [];
    rows.push(`<div class="sg-sectionTitle">Selected item</div>`);
    rows.push(`<div class="sg-row"><div class="sg-k">Name</div><div class="sg-v" title="${escapeHtml(data.name)}">${escapeHtml(data.name)}</div></div>`);
    rows.push(`<div class="sg-hr"></div>`);

    if (data.type === 'weapon') {
      const d = toNumStat(data.dmg);
      const a = toNumStat(data.acc);
      const dR = (d === null) ? '-' : `${(d - statRange).toFixed(2)} – ${(d + statRange).toFixed(2)}`;
      const aR = (a === null) ? '-' : `${(a - statRange).toFixed(2)} – ${(a + statRange).toFixed(2)}`;
      rows.push(`<div class="sg-row"><div class="sg-k">Damage</div><div class="sg-v">${escapeHtml(data.dmg)} <span style="opacity:.75;font-weight:700;">(${escapeHtml(dR)})</span></div></div>`);
      rows.push(`<div class="sg-row"><div class="sg-k">Accuracy</div><div class="sg-v">${escapeHtml(data.acc)} <span style="opacity:.75;font-weight:700;">(${escapeHtml(aR)})</span></div></div>`);
    } else if (data.type === 'armor') {
      const v = toNumStat(data.def);
      const r = (v === null) ? '-' : `${(v - statRange).toFixed(2)} – ${(v + statRange).toFixed(2)}`;
      rows.push(`<div class="sg-row"><div class="sg-k">Armor</div><div class="sg-v">${escapeHtml(data.def)} <span style="opacity:.75;font-weight:700;">(${escapeHtml(r)})</span></div></div>`);
    } else {
      rows.push(`<div class="sg-row"><div class="sg-k">Type</div><div class="sg-v">Unknown</div></div>`);
    }

    rows.push(`<div class="sg-hr"></div>`);
    rows.push(`<div class="sg-row"><div class="sg-k">Bonus 1</div><div class="sg-v" title="${escapeHtml(b1)}">${escapeHtml(b1)}</div></div>`);
    rows.push(`<div class="sg-row"><div class="sg-k">Bonus 2</div><div class="sg-v" title="${escapeHtml(b2)}">${escapeHtml(b2)}</div></div>`);

    selected.innerHTML = rows.join('');
  }

  function normalizeBonusList(b1, b2) {
    return [b1, b2]
      .map(x => String(x ?? '').trim())
      .filter(x => x && x !== '-')
      .map(x => x.toLowerCase())
      .sort();
  }

  function isPerfectMatch(selectedItem, dbRow) {
    if (!selectedItem || !dbRow) return false;
    if (selectedItem.type !== 'weapon' && selectedItem.type !== 'armor') return false;

    const eps = 1e-4;

    if (selectedItem.type === 'weapon') {
      const sd = toNumStat(selectedItem.dmg);
      const sa = toNumStat(selectedItem.acc);
      const rd = toNumStat(dbRow.dmg);
      const ra = toNumStat(dbRow.acc);
      if (sd == null || sa == null || rd == null || ra == null) return false;
      if (Math.abs(sd - rd) > eps) return false;
      if (Math.abs(sa - ra) > eps) return false;
    } else {
      const sv = toNumStat(selectedItem.def);
      const rv = toNumStat(dbRow.arm);
      if (sv == null || rv == null) return false;
      if (Math.abs(sv - rv) > eps) return false;
    }

    const selBon = normalizeBonusList(selectedItem.bonus1, selectedItem.bonus2);
    const rowBon = normalizeBonusList(dbRow.b1, dbRow.b2);
    if (selBon.length !== rowBon.length) return false;
    for (let i = 0; i < selBon.length; i++) {
      if (selBon[i] !== rowBon[i]) return false;
    }
    return true;
  }

  function fmtBonus(name, val) {
    const n = String(name ?? '').trim();
    if (!n || n === '-') return '-';
    if (val == null || val === '') return n;
    const num = parseFloat(String(val).replace('%',''));
    if (Number.isFinite(num)) return `${n} (${num}%)`;
    return `${n} (${String(val)})`;
  }

    function renderResults(items, type, selectedItem) {
        const { results } = panelEls();
        if (!items || !items.length) { results.innerHTML = ''; return; }

        const fmtBonus = (name, val) => {
            const n = String(name ?? '').trim();
            if (!n || n === '-') return '-';
            if (val == null || val === '') return n;
            const num = parseFloat(String(val).replace('%', '').trim());
            if (Number.isFinite(num)) return `${n} (${num}%)`;
            return `${n} (${String(val)})`;
        };

        const cards = items.map(it => {
            const name = safeTxt(it.name);
            const end = (it.enddate || '').toString().trim();
            const titleName = end ? `${name} (${end})` : name;

            const b1 = fmtBonus(it.b1, it.b1v);
            const b2 = fmtBonus(it.b2, it.b2v);

            const topBidRaw = safeTxt(it.topBid); // show exact like $1,400,000,017

            const perfect = selectedItem ? isPerfectMatch(selectedItem, it) : false;

            let statLines = '';
            if (type === 'weapon') {
                statLines += `<div class="sg-mini"><span>Damage</span><span>${escapeHtml(safeTxt(it.dmg))}</span></div>`;
                statLines += `<div class="sg-mini"><span>Accuracy</span><span>${escapeHtml(safeTxt(it.acc))}</span></div>`;
            } else if (type === 'armor') {
                statLines += `<div class="sg-mini"><span>Armor</span><span>${escapeHtml(safeTxt(it.arm))}</span></div>`;
            }

            statLines += `<div class="sg-mini"><span>Bonus 1</span><span title="${escapeHtml(b1)}">${escapeHtml(b1)}</span></div>`;
            statLines += `<div class="sg-mini"><span>Bonus 2</span><span title="${escapeHtml(b2)}">${escapeHtml(b2)}</span></div>`;
            statLines += `<div class="sg-mini"><span>TopBid</span><span>${escapeHtml(topBidRaw)}</span></div>`;

            return `<div class="sg-card ${perfect ? 'sg-perfect' : ''}">
      <div class="sg-name" title="${escapeHtml(titleName)}">${escapeHtml(titleName)}</div>
      ${statLines}
    </div>`;
        });

        results.innerHTML = cards.join('');
    }


  function buildDbQueryFromItem(data) {
    const q = new URLSearchParams();

    q.set('range', String(getStatRange()));
    q.set('limit', String(getDbLimit()));

    if (data.type === 'weapon') {
      q.set('type', 'weapon');
      q.set('dmg', String(toNumStat(data.dmg) ?? ''));
      q.set('acc', String(toNumStat(data.acc) ?? ''));
      q.set('arm', '');
    } else if (data.type === 'armor') {
      q.set('type', 'armor');
      q.set('dmg', '');
      q.set('acc', '');
      q.set('arm', String(toNumStat(data.def) ?? ''));
    } else {
      q.set('type', 'unknown');
    }

    q.set('b1', data.bonus1 === '-' ? '' : data.bonus1);
    q.set('b2', data.bonus2 === '-' ? '' : data.bonus2);

    q.set('b1v', (data.bonus1Val == null) ? '' : String(data.bonus1Val));
    q.set('b2v', (data.bonus2Val == null) ? '' : String(data.bonus2Val));
    q.set('bvrange', String(getBonusRange()));

    q.set('_', String(Date.now()));
    return q;
  }

  function gmGetJson(url, timeoutMs) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: timeoutMs,
        headers: { 'Accept': 'application/json,text/plain,*/*' },
        onload: (r) => {
          try {
            const txt = (r && r.responseText) ? r.responseText : '';
            resolve(JSON.parse(txt));
          } catch (e) {
            reject(new Error('DB: Invalid JSON response'));
          }
        },
        ontimeout: () => reject(new Error('DB timeout')),
        onerror: () => reject(new Error('DB request failed')),
      });
    });
  }

  async function searchDbFromItem(selectedItem) {
    const endpoint = (GM_getValue(KEY_DB_ENDPOINT, '') || '').trim();
    if (!endpoint) {
      setStatus(`<strong>DB</strong>: no endpoint set.`);
      return;
    }

    setStatus(`<strong>Searching in DB...</strong>`);
    clearResults();

    const qs = buildDbQueryFromItem(selectedItem).toString();
    const url = endpoint + (endpoint.includes('?') ? '&' : '?') + qs;

    try {
      const res = await gmGetJson(url, 30000);
      if (!res || res.ok !== true) {
        setStatus(`<strong>DB</strong>: error.`);
        return;
      }

      const matches = Array.isArray(res.matches) ? res.matches : [];
      if (!matches.length) {
        setStatus(`<strong>DB</strong>: no matches found.`);
        return;
      }

      // LOWEST first
      matches.sort((a, b) => (moneyToInt(a.topBid) ?? 9e18) - (moneyToInt(b.topBid) ?? 9e18));

      setStatus(`<strong>DB</strong>: found <b>${matches.length}</b> matches (sorted by Lowest bid).`);
      renderResults(matches, selectedItem.type, selectedItem);
    } catch (err) {
      setStatus(`<strong>DB</strong>: ${escapeHtml(err.message || String(err))}`);
    }
  }

  function installMenu() {
    GM_registerMenuCommand('AH panel: Show', () => setVisible(true));
    GM_registerMenuCommand('AH panel: Hide', () => setVisible(false));
    GM_registerMenuCommand('AH panel: Toggle', () => setVisible(!isVisible()));

    GM_registerMenuCommand('AH DB: Set endpoint', () => {
      const cur = GM_getValue(KEY_DB_ENDPOINT, '') || '';
      const v = prompt('Paste your Apps Script Web App /exec URL:', cur || '');
      if (v && v.trim()) {
        GM_setValue(KEY_DB_ENDPOINT, v.trim());
        setStatus(`<strong>DB</strong>: endpoint saved.`);
      }
    });

    if (!GM_getValue(KEY_DB_ENDPOINT, '')) GM_setValue(KEY_DB_ENDPOINT, DEFAULT_ENDPOINT);
    if (!GM_getValue(KEY_DB_LIMIT, null)) GM_setValue(KEY_DB_LIMIT, DEFAULT_LIMIT);
    if (!GM_getValue(KEY_STAT_RANGE, null)) GM_setValue(KEY_STAT_RANGE, DEFAULT_STAT_RANGE);
    if (!GM_getValue(KEY_BONUS_RANGE, null)) GM_setValue(KEY_BONUS_RANGE, DEFAULT_BONUS_RANGE);
  }

  function ensurePanelQuick() {
    try { ensurePanel(); } catch (_) {}
  }

  function findSellerAnchor(li) {
    return (
      li.querySelector('.seller-wrap .name a') ||
      li.querySelector('.seller-wrap a[href*="profiles.php?XID="]') ||
      li.querySelector('.seller-mob-wrap a[href*="profiles.php?XID="]') ||
      li.querySelector('.seller-mob-wrap a') ||
      null
    );
  }

  function addXButtonsEverywhere() {
    const lists = Array.from(document.querySelectorAll('.items-list'));
    if (!lists.length) return;

    for (const list of lists) {
      const rows = list.querySelectorAll('li');
      rows.forEach(li => {
        if (!li || li.querySelector(`.${btnClass}`)) return;

        const sellerA = findSellerAnchor(li);
        if (!sellerA) return;

        const btn = document.createElement('span');
        btn.className = btnClass;
        btn.textContent = 'X';
        btn.title = 'Show item details + search DB';

        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const item = parseRow(li);
          ensurePanelQuick();
          setVisible(true);

          renderSelected(item);
          await searchDbFromItem(item);
        });

        sellerA.insertAdjacentElement('afterend', btn);
      });
    }
  }

  function observeAndHash() {
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        addXButtonsEverywhere();
      }, 150);
    };

    const mo = new MutationObserver(() => schedule());
    mo.observe(document.body, { childList: true, subtree: true });

    const burst = () => {
      addXButtonsEverywhere();
      setTimeout(addXButtonsEverywhere, 300);
      setTimeout(addXButtonsEverywhere, 900);
      setTimeout(addXButtonsEverywhere, 1600);
    };

    window.addEventListener('hashchange', burst);
    burst();
  }

  function init() {
    installMenu();
    ensurePanelQuick();
    observeAndHash();
  }

  init();
})();
