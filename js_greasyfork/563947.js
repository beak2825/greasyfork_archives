// ==UserScript==
// @name         Torn Company Suite
// @namespace    r4g3runn3r.company.suite.core
// @version      2.4.0
// @description  Company Suite panel that activates when Manage Company is detected. Adds Income Chart + Employees overview with optional API (fallback to UI scanning).
// @author       R4G3RUNN3R[3877028]
// @license      MIT
// @match        https://www.torn.com/companies.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563947/Torn%20Company%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/563947/Torn%20Company%20Suite.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'Company Suite';

  const STORAGE = {
    SEEN_WELCOME: 'cs_seen_welcome',
    API_KEY: 'cs_api_key',
    INCOME_CACHE: 'cs_income_cache_v1',   // stores parsed report points (UI scan + API)
    EMP_CACHE: 'cs_emp_cache_v1'          // stores last parsed employee snapshot (UI scan + API)
  };

  const UI = {
    launcher: null,
    panel: null,
    mounted: false,
    panelOpen: false
  };

  const STATE = {
    // Mode resolution
    apiKey: null,
    apiOk: false,
    apiError: null,

    // Data
    incomePoints: [],   // [{ts:number, label:string, income:number}]
    employees: [],      // [{name, eff, days, position}]
    empSummary: { count: null, max: null, avgEff: null },

    // Observers
    observer: null,
    lastTick: 0,
    tickQueued: false
  };

  /* ======================
     UTIL
  ====================== */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function now() { return Date.now(); }

  function safeJsonParse(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
  }

  function fmtMoney(n) {
    if (!Number.isFinite(n)) return '—';
    return `$${Math.round(n).toLocaleString()}`;
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function debounceTick(fn, delayMs = 250) {
    // Throttled scheduler to avoid SPA mutation storms
    const t = now();
    if (t - STATE.lastTick < delayMs) return;
    STATE.lastTick = t;
    fn();
  }

  /* ======================
     CONSTANT DETECTION
  ====================== */

  function hasManageCompany() {
    // minimal and stable: check a known heading area exists by text match in a smaller scope
    // (We avoid scanning full innerText repeatedly.)
    const h = $$('div, span, h1, h2').find(el => el.textContent?.trim() === 'Manage Company');
    return !!h;
  }

  function isDirector() {
    // Use a localized scan near "Your Details" box if possible, fallback to body includes (rare)
    const details = $$('div, li, span').find(el => el.textContent?.includes('Your Details:'));
    if (details && details.parentElement) {
      return details.parentElement.textContent.includes('Position: Director');
    }
    return document.body?.innerText.includes('Position: Director');
  }

  /* ======================
     API STATE (OPTIONAL)
  ====================== */

  function loadApiKey() {
    const k = localStorage.getItem(STORAGE.API_KEY);
    STATE.apiKey = k ? k.trim() : null;
    return STATE.apiKey;
  }

  function saveApiKey(key) {
    localStorage.setItem(STORAGE.API_KEY, key);
    STATE.apiKey = key;
    STATE.apiOk = false;
    STATE.apiError = null;
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE.API_KEY);
    STATE.apiKey = null;
    STATE.apiOk = false;
    STATE.apiError = null;
  }

  async function tornApi(url) {
    const res = await fetch(url, { credentials: 'omit' });
    const json = await res.json();
    if (json?.error) {
      const msg = json.error.error_fmt || json.error.error || 'Torn API error';
      throw new Error(msg);
    }
    return json;
  }

  async function apiFetchCompanyBundle() {
    // Attempt a lightweight “validation + data pull”
    // If anything fails, we fall back to UI scan mode.
    const key = STATE.apiKey;
    if (!key) throw new Error('No API key set');

    // 1) Resolve company_id from user job
    const user = await tornApi(`https://api.torn.com/user/?selections=profile,job&key=${encodeURIComponent(key)}`);
    const companyId = user?.job?.company_id;
    if (!companyId) throw new Error('API did not return company_id (check User + Company access)');

    // 2) Fetch company data + employees + company_news (used as history for chart)
    // Note: Torn API selections can vary; these are commonly supported.
    const company = await tornApi(
      `https://api.torn.com/company/${companyId}?selections=company,employees,company_news&key=${encodeURIComponent(key)}`
    );

    return { companyId, user, company };
  }

  /* ======================
     INCOME HISTORY PARSING
  ====================== */

  function loadIncomeCache() {
    const cached = safeJsonParse(localStorage.getItem(STORAGE.INCOME_CACHE), []);
    if (Array.isArray(cached)) STATE.incomePoints = cached;
  }

  function saveIncomeCache() {
    localStorage.setItem(STORAGE.INCOME_CACHE, JSON.stringify(STATE.incomePoints.slice(-200)));
  }

  function parseDateFromCellText(text) {
    // Examples seen: "18:07:09 24/01/26" or time on one line date on next
    const t = (text || '').replace(/\s+/g, ' ').trim();
    const m = t.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
    if (!m) return null;
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    let yy = Number(m[3]);
    if (yy < 100) yy += 2000;
    const d = new Date(Date.UTC(yy, mm - 1, dd, 12, 0, 0));
    return Number.isFinite(d.getTime()) ? d.getTime() : null;
  }

  function addIncomePoint(ts, label, income) {
    if (!Number.isFinite(income)) return;

    // Deduplicate by (ts + income)
    const key = `${ts || 0}:${income}`;
    const exists = STATE.incomePoints.some(p => `${p.ts || 0}:${p.income}` === key);
    if (exists) return;

    STATE.incomePoints.push({
      ts: Number.isFinite(ts) ? ts : now(),
      label: label || '',
      income: Math.round(income)
    });

    // Sort by ts
    STATE.incomePoints.sort((a, b) => a.ts - b.ts);

    // Keep reasonable size
    if (STATE.incomePoints.length > 300) STATE.incomePoints = STATE.incomePoints.slice(-300);

    saveIncomeCache();
  }

  function extractIncomeFromReportLine(line) {
    // "Saturday report: We had ... made a gross income of $149,739."
    const m = line.match(/gross income of \$([\d,]+)/i);
    if (!m) return null;
    return Number(m[1].replace(/,/g, ''));
  }

  function scanMainNewsUI() {
    // Finds visible “Main News” list rows and parses report income lines.
    // This is intentionally conservative to avoid false positives.
    const containers = $$('div').filter(el => el.textContent?.trim() === 'Main News');
    if (!containers.length) return false;

    // In Torn UI, the Main News panel is a table-like list. We’ll grab rows that look like entries.
    // Strategy: find nearby rows with "report:" and "gross income of $"
    const root = containers[0].closest('div')?.parentElement || document.body;

    const rows = $$('div, li, tr', root)
      .map(el => ({
        el,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim()
      }))
      .filter(r => /report:/i.test(r.text) && /gross income of/i.test(r.text));

    let added = false;

    for (const r of rows) {
      const income = extractIncomeFromReportLine(r.text);
      if (!income) continue;

      // Try to find a date cell nearby (often in same row container)
      let ts = null;

      // Look for date-like content inside the same element (or its children)
      const dateCandidate = (r.el.textContent || '');
      ts = parseDateFromCellText(dateCandidate);

      // If not found, look in sibling elements
      if (!ts && r.el.parentElement) {
        const sibText = r.el.parentElement.textContent || '';
        ts = parseDateFromCellText(sibText);
      }

      addIncomePoint(ts, 'Report', income);
      added = true;
    }

    return added;
  }

  function scanIncomeFromApi(company) {
    // Parse company_news entries similarly.
    // company.company_news likely is an object keyed by id with {news, timestamp} or similar.
    const newsObj = company?.company_news;
    if (!newsObj || typeof newsObj !== 'object') return false;

    let added = false;
    const entries = Object.values(newsObj);

    for (const e of entries) {
      const line = (e?.news || e?.text || '').toString();
      if (!/report:/i.test(line) || !/gross income of/i.test(line)) continue;

      const income = extractIncomeFromReportLine(line);
      if (!income) continue;

      // Torn API often has timestamp seconds
      const ts = e?.timestamp ? (Number(e.timestamp) * 1000) : null;
      addIncomePoint(ts, 'Report', income);
      added = true;
    }

    return added;
  }

  /* ======================
     EMPLOYEES PARSING
  ====================== */

  function loadEmpCache() {
    const cached = safeJsonParse(localStorage.getItem(STORAGE.EMP_CACHE), null);
    if (cached && typeof cached === 'object') {
      STATE.employees = Array.isArray(cached.employees) ? cached.employees : [];
      STATE.empSummary = cached.summary || { count: null, max: null, avgEff: null };
    }
  }

  function saveEmpCache() {
    localStorage.setItem(STORAGE.EMP_CACHE, JSON.stringify({
      employees: STATE.employees.slice(0, 200),
      summary: STATE.empSummary
    }));
  }

  function computeEmpSummary() {
    const list = STATE.employees || [];
    const count = list.length;
    const avgEff = count ? Math.round(list.reduce((s, e) => s + (Number(e.eff) || 0), 0) / count) : null;
    STATE.empSummary = { ...STATE.empSummary, count, avgEff };
  }

  function scanEmployeesUI() {
    // Only parse if the Employees tab table is visible.
    // We detect the header row containing known columns.
    const table = $$('table').find(t => {
      const headerText = (t.querySelector('thead')?.textContent || t.textContent || '').replace(/\s+/g, ' ').trim();
      return headerText.includes('Company Employees') &&
             headerText.includes('Effectiveness') &&
             headerText.includes('Stats') &&
             headerText.includes('Days') &&
             headerText.includes('Position');
    });

    if (!table) return false;

    // Find rows
    const bodyRows = $$('tr', table).slice(1); // skip header row if present
    const employees = [];

    for (const tr of bodyRows) {
      const cells = $$('td', tr);
      if (cells.length < 5) continue;

      const name = (cells[0].textContent || '').replace(/\s+/g, ' ').trim();
      if (!name || name.toLowerCase() === 'submit changes') continue;

      // Effectiveness can be displayed as number or icons + number; extract first integer found
      const effText = (cells[1].textContent || '');
      const effM = effText.match(/(\d{1,3})/);
      const eff = effM ? Number(effM[1]) : null;

      const daysText = (cells[3].textContent || '');
      const daysM = daysText.match(/(\d+)/);
      const days = daysM ? Number(daysM[1]) : null;

      const positionText = (cells[4].textContent || '').replace(/\s+/g, ' ').trim();

      employees.push({
        name,
        eff: Number.isFinite(eff) ? eff : 0,
        days: Number.isFinite(days) ? days : 0,
        position: positionText || '—'
      });
    }

    if (!employees.length) return false;

    STATE.employees = employees;
    computeEmpSummary();
    saveEmpCache();
    return true;
  }

  function scanEmployeesFromApi(company) {
    const empObj = company?.company_employees || company?.employees;
    if (!empObj || typeof empObj !== 'object') return false;

    const employees = Object.values(empObj).map(e => ({
      name: e?.name || '—',
      eff: Number(e?.effectiveness) || 0,
      days: Number(e?.days_in_company) || Number(e?.days) || 0,
      position: e?.position || e?.role || '—'
    })).filter(e => e.name && e.name !== '—');

    if (!employees.length) return false;

    STATE.employees = employees;
    computeEmpSummary();
    saveEmpCache();
    return true;
  }

  /* ======================
     CHART RENDERING (SVG)
  ====================== */

  function getLast7Points() {
    const pts = STATE.incomePoints || [];
    if (!pts.length) return [];

    // group by day (UTC) and keep last point per day
    const byDay = new Map();
    for (const p of pts) {
      const d = new Date(p.ts);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
      byDay.set(key, p);
    }

    const days = Array.from(byDay.values()).sort((a, b) => a.ts - b.ts);
    return days.slice(-7);
  }

  function renderIncomeChart() {
    const points = getLast7Points();
    const w = 380, h = 120, pad = 10;

    if (!points.length) {
      return `
        <div class="cs-chart-empty">
          No income history yet.
        </div>
      `;
    }

    const values = points.map(p => p.income);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const span = Math.max(1, maxV - minV);

    const xs = points.map((_, i) => {
      const t = points.length === 1 ? 0.5 : (i / (points.length - 1));
      return pad + t * (w - pad * 2);
    });

    const ys = points.map((p) => {
      const norm = (p.income - minV) / span;
      // invert Y
      return pad + (1 - norm) * (h - pad * 2);
    });

    const poly = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');

    const last = points[points.length - 1];
    const topLabel = fmtMoney(last.income);

    return `
      <div class="cs-chart-top">
        <div class="cs-chart-title">Last 7 days</div>
        <div class="cs-chart-value">${topLabel}</div>
      </div>
      <svg class="cs-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <polyline points="${poly}" fill="none" stroke="rgba(60,255,60,0.95)" stroke-width="2.5" />
        ${xs.map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="2.8" fill="rgba(60,255,60,0.95)" />`).join('')}
      </svg>
      <div class="cs-chart-foot">
        <span>${fmtMoney(minV)} min</span>
        <span>${fmtMoney(maxV)} max</span>
      </div>
    `;
  }

  /* ======================
     PANEL CONTENT
  ====================== */

  function hasApiKey() { return !!STATE.apiKey; }

  function setContent(html) {
    const c = $('#cs-content', UI.panel);
    if (c) c.innerHTML = html;
  }

  function showWelcome() {
    setContent(`
      <div class="cs-section">
        <b>Welcome to Company Suite</b>
        <p>This tool works <b>with or without</b> a Torn API key.</p>
        <ul>
          <li><b>No API:</b> You will scroll tabs (and Main News) so the script can scan and build reports.</li>
          <li><b>With API (optional):</b> Faster loading, automatic history pulls.</li>
        </ul>
        <p>No actions are performed. Nothing is sent anywhere.</p>
      </div>
      <div class="cs-actions">
        <button class="cs-btn" id="cs-provide-api">Provide API Key</button>
        <button class="cs-btn" id="cs-skip-api">Skip</button>
      </div>
    `);

    $('#cs-skip-api')?.addEventListener('click', () => {
      localStorage.setItem(STORAGE.SEEN_WELCOME, '1');
      showMain();
    });

    $('#cs-provide-api')?.addEventListener('click', showApiInput);
  }

  function showApiInput() {
    setContent(`
      <div class="cs-section">
        <b>Provide Torn API Key</b>
        <p>Recommended: <b>Limited API key</b> with <b>User</b> + <b>Company</b> permissions.</p>
        <input id="cs-api-input" placeholder="Paste API key here" />
        <div class="cs-muted" style="margin-top:8px;">
          API will be validated automatically. If invalid, Company Suite falls back to UI scan mode.
        </div>
      </div>
      <div class="cs-actions">
        <button class="cs-btn" id="cs-save-api">Save API Key</button>
        <button class="cs-btn" id="cs-cancel-api">Cancel</button>
      </div>
    `);

    $('#cs-cancel-api')?.addEventListener('click', () => {
      // If they haven't seen welcome, go back there; otherwise go main
      if (!localStorage.getItem(STORAGE.SEEN_WELCOME)) showWelcome();
      else showMain();
    });

    $('#cs-save-api')?.addEventListener('click', async () => {
      const key = ($('#cs-api-input')?.value || '').trim();
      if (!key) return;

      saveApiKey(key);
      localStorage.setItem(STORAGE.SEEN_WELCOME, '1');

      // Attempt validation + pull immediately (nice UX)
      await refreshData();
      showMain();
    });
  }

  function showSettings() {
    const status = !hasApiKey()
      ? 'No API key (UI scan mode)'
      : (STATE.apiOk ? 'API key valid' : `API key saved (${STATE.apiError ? 'invalid, using UI scan' : 'validating...'})`);

    setContent(`
      <div class="cs-section">
        <b>Settings</b>
        <div>API status: <b>${status}</b></div>
        ${STATE.apiError ? `<div class="cs-warn" style="margin-top:8px;">${STATE.apiError}</div>` : ''}
      </div>
      <div class="cs-actions">
        ${hasApiKey()
          ? '<button class="cs-btn" id="cs-remove-api">Remove API Key</button>'
          : '<button class="cs-btn" id="cs-add-api">Add API Key</button>'}
      </div>
    `);

    if (hasApiKey()) {
      $('#cs-remove-api')?.addEventListener('click', () => {
        clearApiKey();
        refreshData(); // re-render using UI scan caches
        showSettings();
      });
    } else {
      $('#cs-add-api')?.addEventListener('click', showApiInput);
    }
  }

  function showMain() {
    const modeLabel = hasApiKey()
      ? (STATE.apiOk ? 'API' : (STATE.apiError ? 'UI Scan (API failed)' : 'API (validating...)'))
      : 'UI Scan';

    const roleLabel = isDirector() ? 'Director' : 'Employee';

    const incomeHint = (STATE.apiOk)
      ? `<span class="cs-muted">Income history pulled via API.</span>`
      : `<span class="cs-muted"><b>UI Scan Mode:</b> Scroll down <b>Main News</b> to populate the income chart.</span>`;

    const empHint = (STATE.apiOk)
      ? `<span class="cs-muted">Employees loaded via API.</span>`
      : `<span class="cs-muted"><b>UI Scan Mode:</b> Visit the <b>Employees</b> tab so Company Suite can scan the table.</span>`;

    const incomeHtml = renderIncomeChart();

    const empCount = STATE.empSummary.count;
    const avgEff = STATE.empSummary.avgEff;

    const empList = (STATE.employees || []).slice(0, 8).map(e => `
      <div class="cs-emp-row">
        <div class="cs-emp-name">${escapeHtml(e.name)}</div>
        <div class="cs-emp-meta">${e.eff}% • ${e.days}d • ${escapeHtml(e.position)}</div>
      </div>
    `).join('') || `<div class="cs-muted">No employee data yet.</div>`;

    setContent(`
      <div class="cs-section">
        <div><b>Mode:</b> ${modeLabel}</div>
        <div><b>Detected role:</b> ${roleLabel}</div>
        ${STATE.apiError ? `<div class="cs-warn" style="margin-top:8px;">${STATE.apiError}</div>` : ''}
      </div>

      <div class="cs-card">
        <div class="cs-card-title">Income Chart</div>
        <div class="cs-card-sub">${incomeHint}</div>
        <div class="cs-card-body" id="cs-income">
          ${incomeHtml}
        </div>
      </div>

      <div class="cs-card">
        <div class="cs-card-title">Employees Overview</div>
        <div class="cs-card-sub">${empHint}</div>
        <div class="cs-card-body">
          <div class="cs-emp-summary">
            <div><b>Employees:</b> ${empCount === null ? '—' : empCount}</div>
            <div><b>Avg effectiveness:</b> ${avgEff === null ? '—' : `${avgEff}%`}</div>
          </div>
          <div class="cs-emp-list">
            ${empList}
          </div>
        </div>
      </div>

      <div class="cs-actions" style="margin-top:10px;">
        <button class="cs-btn" id="cs-refresh">Refresh Data</button>
      </div>
    `);

    $('#cs-refresh')?.addEventListener('click', async () => {
      await refreshData(true);
      // Re-render main view
      showMain();
    });
  }

  function escapeHtml(s) {
    return (s ?? '').toString()
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  /* ======================
     DATA REFRESH
  ====================== */

  async function refreshData(force = false) {
    // Load caches first for instant UI
    if (!STATE.incomePoints.length || force) loadIncomeCache();
    if (!STATE.employees.length || force) loadEmpCache();

    // Try API if key exists
    STATE.apiError = null;
    STATE.apiOk = false;

    if (STATE.apiKey) {
      try {
        const bundle = await apiFetchCompanyBundle();

        // mark validated
        STATE.apiOk = true;

        // income history from API (company_news)
        scanIncomeFromApi(bundle.company);

        // employees from API
        scanEmployeesFromApi(bundle.company);

        // update summaries
        computeEmpSummary();

      } catch (e) {
        // API failed -> fallback to UI scan
        STATE.apiOk = false;
        STATE.apiError = `API unavailable/invalid: ${e.message}. Falling back to UI scan mode.`;
      }
    }

    // If no API or API failed: attempt UI scans (non-invasive)
    if (!STATE.apiOk) {
      // Income scan from Main News (only works if user scrolled and content exists)
      scanMainNewsUI();
      // Employee scan from Employees tab (only works if the table is visible)
      scanEmployeesUI();
    }

    // Save caches after any change
    saveIncomeCache();
    saveEmpCache();
  }

  /* ======================
     OBSERVER LOOP (LIGHTWEIGHT)
  ====================== */

  function onDomChanged() {
    if (!UI.panelOpen) return;

    // Throttle work heavily; only scan when panel is open.
    debounceTick(() => {
      if (!STATE.apiOk) {
        const incomeAdded = scanMainNewsUI();
        const empAdded = scanEmployeesUI();
        if (incomeAdded || empAdded) {
          // Update visible chart quickly without re-building whole panel
          const incomeBox = $('#cs-income');
          if (incomeBox) incomeBox.innerHTML = renderIncomeChart();

          // If employee data changed, simplest safe refresh is re-render main
          if (empAdded) showMain();
        }
      }
    }, 350);
  }

  /* ======================
     MOUNTING
  ====================== */

  function createLauncher() {
    if (UI.launcher) return;

    UI.launcher = document.createElement('div');
    UI.launcher.id = 'company-suite-launcher';
    UI.launcher.textContent = SCRIPT_NAME;
    UI.launcher.onclick = togglePanel;

    document.body.appendChild(UI.launcher);
  }

  function createPanel() {
    if (UI.panel) return;

    UI.panel = document.createElement('div');
    UI.panel.id = 'company-suite-panel';
    UI.panel.innerHTML = `
      <div class="cs-header">
        <span>${SCRIPT_NAME}</span>
        <div class="cs-header-actions">
          <span id="cs-gear" title="Settings">⚙️</span>
          <button id="cs-close">✕</button>
        </div>
      </div>
      <div class="cs-body">
        <div id="cs-content"></div>
      </div>
    `;

    UI.panel.querySelector('#cs-close').onclick = () => {
      UI.panel.style.display = 'none';
      UI.panelOpen = false;
    };

    UI.panel.querySelector('#cs-gear').onclick = () => showSettings();

    document.body.appendChild(UI.panel);
  }

  async function togglePanel() {
    createPanel();

    UI.panelOpen = UI.panel.style.display !== 'block';
    UI.panel.style.display = UI.panelOpen ? 'block' : 'none';

    if (!UI.panelOpen) return;

    // Load key + caches
    loadApiKey();
    loadIncomeCache();
    loadEmpCache();

    // First show welcome/main instantly, then refresh data
    if (!localStorage.getItem(STORAGE.SEEN_WELCOME)) showWelcome();
    else showMain();

    await refreshData(false);

    // Re-render main view after data refresh (unless welcome is still shown)
    if (localStorage.getItem(STORAGE.SEEN_WELCOME)) showMain();
  }

  function tryMount() {
    if (UI.mounted) return;
    if (!hasManageCompany()) return;
    UI.mounted = true;
    createLauncher();
  }

  function init() {
    loadApiKey();
    loadIncomeCache();
    loadEmpCache();

    new MutationObserver(() => {
      tryMount();
      onDomChanged();
    }).observe(document.body, { childList: true, subtree: true });

    setTimeout(tryMount, 600);
  }

  /* ======================
     STYLES
  ====================== */

  GM_addStyle(`
    #company-suite-launcher {
      position: fixed;
      top: 14px;
      right: 14px;
      z-index: 99999;
      padding: 10px 14px;
      background: #111;
      border: 2px solid #3cff3c;
      color: #3cff3c;
      font-weight: 900;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
    }

    #company-suite-panel {
      position: fixed;
      top: 56px;
      right: 14px;
      width: 460px;
      max-height: 80vh;
      overflow: auto;
      background: rgba(15,15,15,0.97);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px;
      z-index: 100000;
      display: none;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }

    .cs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      color: #fff;
      font-weight: 900;
      position: sticky;
      top: 0;
      background: rgba(15,15,15,0.98);
      z-index: 1;
    }

    .cs-header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .cs-header button {
      background: none;
      border: none;
      color: #ff3b30;
      cursor: pointer;
      font-size: 16px;
    }

    .cs-body {
      padding: 14px;
      color: #ddd;
      font-size: 13px;
    }

    .cs-section { margin-bottom: 12px; }

    .cs-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
    }

    .cs-btn {
      background: #555;
      color: #000;
      border: 1px solid #777;
      padding: 7px 12px;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
    }
    .cs-btn:hover { background: #666; }

    input#cs-api-input {
      width: 100%;
      padding: 7px;
      margin-top: 6px;
      background: #222;
      color: #fff;
      border: 1px solid #444;
      border-radius: 4px;
    }

    .cs-muted { opacity: 0.65; font-size: 12px; }
    .cs-warn {
      color: #ffb347;
      font-size: 12px;
      opacity: 0.95;
    }

    .cs-card {
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 10px;
      background: rgba(0,0,0,0.25);
      margin-bottom: 12px;
    }

    .cs-card-title {
      font-weight: 900;
      color: #fff;
      margin-bottom: 4px;
    }

    .cs-card-sub {
      margin-bottom: 8px;
      line-height: 1.25;
    }

    .cs-card-body { }

    .cs-chart-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }
    .cs-chart-title { font-weight: 700; opacity: 0.9; }
    .cs-chart-value { font-weight: 900; color: #3cff3c; }

    .cs-chart {
      width: 100%;
      height: 120px;
      background: rgba(255,255,255,0.04);
      border-radius: 8px;
      display: block;
    }

    .cs-chart-empty {
      padding: 12px;
      background: rgba(255,255,255,0.04);
      border-radius: 8px;
      opacity: 0.8;
    }

    .cs-chart-foot {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-size: 12px;
      opacity: 0.75;
    }

    .cs-emp-summary {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    .cs-emp-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cs-emp-row {
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.03);
    }

    .cs-emp-name {
      font-weight: 900;
      color: #3cff3c;
      margin-bottom: 3px;
    }

    .cs-emp-meta {
      font-size: 12px;
      opacity: 0.85;
    }
  `);

  init();

})();

/* ======================
   CHANGELOG
======================

v2.4.0
- Added initial dashboard layout inside Company Suite:
  - Income Chart section (top)
  - Employees Overview section (under chart)
- Implemented hybrid data model:
  - API mode attempts to pull company history (company_news) + employees
  - If API fails/invalid, automatically falls back to UI scan mode
- UI Scan Mode behavior:
  - Income Chart requires user to scroll Main News so reports can be parsed
  - Employees Overview populates when user visits the Employees tab (table scan)
- Added lightweight, throttled DOM observer updates only while panel is open
- Added Refresh Data button to manually re-pull/scan without closing the panel
- No automation, no actions taken on the page, read-only foundation

*/
