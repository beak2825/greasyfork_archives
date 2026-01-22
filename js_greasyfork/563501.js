// ==UserScript==
// @name         Torn Company Control Panel (API Salary Advisor)
// @namespace    torn.company.control.panel
// @version      1.9.2
// @description  Unified company salary advisor using Torn API (read-only).
// @author       R4G3RUNN3R [3877028]
// @license      MIT
// @match        https://www.torn.com/companies.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563501/Torn%20Company%20Control%20Panel%20%28API%20Salary%20Advisor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563501/Torn%20Company%20Control%20Panel%20%28API%20Salary%20Advisor%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ======================
     CONFIG / STORAGE
  ====================== */

  const API_KEY_STORAGE = 'tcp_api_key';
  const API_CACHE_TTL = 60_000; // 60s

  let apiCache = { ts: 0, data: null };

  function getApiKey() {
    let key = localStorage.getItem(API_KEY_STORAGE);
    if (!key) {
      key = prompt('Enter your Torn API key (FULL or read-only with User + Company access):');
      if (key) localStorage.setItem(API_KEY_STORAGE, key);
    }
    return key;
  }

  /* ======================
     API HELPERS
  ====================== */

  async function api(url) {
    const res = await fetch(url);
    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.error_fmt || json.error.error || 'Torn API error');
    }
    return json;
  }

  async function apiFetchCompany() {
    if (Date.now() - apiCache.ts < API_CACHE_TTL && apiCache.data) {
      return apiCache.data;
    }

    const key = getApiKey();
    if (!key) throw new Error('No API key provided.');

    // Step 1: get company_id from user (job MUST be requested)
    const user = await api(
      `https://api.torn.com/user/?selections=profile,job&key=${key}`
    );

    if (!user.job || !user.job.company_id) {
      throw new Error('Torn did not return company_id. Check User + Company permissions.');
    }

    const companyId = user.job.company_id;

    // Step 2: fetch company data by ID using v1-safe selections
    const data = await api(
      `https://api.torn.com/company/${companyId}?selections=employees,company&key=${key}`
    );

    apiCache = { ts: Date.now(), data };
    return data;
  }

  /* ======================
     STYLES
  ====================== */

  GM_addStyle(`
    #tcpBar {
      margin: 10px 0 12px;
      padding: 10px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 8px;
      background: rgba(10,10,10,.92);
    }
    #tcpOpenBtn {
      all: unset;
      cursor: pointer;
      background: #000;
      color: #3cff3c;
      border: 2px solid #3cff3c;
      border-radius: 6px;
      padding: 8px 16px;
      font-weight: bold;
    }
    #tcpOverlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.75);
      z-index: 999999;
    }
    #tcpPanel {
      background: #1e1e1e;
      color: #fff;
      width: 900px;
      max-height: 85vh;
      overflow-y: auto;
      margin: 4% auto;
      padding: 20px;
      border-radius: 8px;
    }
    #tcpPanel .close {
      float: right;
      cursor: pointer;
      font-size: 20px;
    }
    .tcp-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .tcp-table th, .tcp-table td {
      border: 1px solid #444;
      padding: 6px;
      text-align: left;
    }
    .tcp-green { color: #3cff3c; font-weight: bold; }
    .tcp-warn { color: #ffb347; }
  `);

  /* ======================
     PANEL
  ====================== */

  function openPanel(html) {
    document.getElementById('tcpOverlay')?.remove();
    const o = document.createElement('div');
    o.id = 'tcpOverlay';
    o.innerHTML = `
      <div id="tcpPanel">
        <span class="close">✕</span>
        ${html}
      </div>`;
    document.body.appendChild(o);
    o.querySelector('.close').onclick = () => o.remove();
    o.onclick = e => { if (e.target === o) o.remove(); };
  }

  async function salaryAdvisor() {
    try {
      const data = await apiFetchCompany();

      // v1 structure: company + company_employees
      const c = data.company;
      const income = Number(c.daily_income) ||
        Math.floor(Number(c.weekly_income || 0) / 7) || 0;

      const employees = Object.values(data.company_employees || {}).map(e => ({
        name: e.name,
        eff: Number(e.effectiveness) || 0
      }));

      if (!income || !employees.length) {
        openPanel(`<h2>Salary Advisor</h2><p class="tcp-warn">API returned no usable company income or employees.</p>`);
        return;
      }

      const percent = parseFloat(prompt('Percent of DAILY income to distribute?', '80'));
      const base = parseInt(prompt('Base DAILY pay per employee', '25000'), 10);
      const rate = parseFloat(prompt('Pay per effectiveness point', '2000'));
      const capInput = prompt('Optional DAILY salary cap (blank = none)', '');
      const cap = capInput ? parseInt(capInput, 10) : null;

      if (![percent, base, rate].every(Number.isFinite)) return;

      const pool = Math.floor(income * (percent / 100));
      let total = 0;

      const rows = employees.map(e => {
        const effAdj = e.eff < 100 ? e.eff * (e.eff / 100) : e.eff;
        let pay = Math.floor(base + effAdj * rate);
        if (cap) pay = Math.min(pay, cap);
        total += pay;
        return { ...e, pay };
      });

      if (total > pool) {
        const scale = pool / total;
        rows.forEach(r => r.pay = Math.floor(r.pay * scale));
        total = rows.reduce((s, r) => s + r.pay, 0);
      }

      openPanel(`
        <h2>Salary Advisor (API mode)</h2>
        <p>Daily income: <b>$${income.toLocaleString()}</b></p>
        <p>Salary pool: <b>$${pool.toLocaleString()}</b></p>
        <p>Distributed: <b>$${total.toLocaleString()}</b></p>

        <table class="tcp-table">
          <tr><th>Employee</th><th>Effectiveness</th><th>Suggested Salary</th></tr>
          ${rows.map(r => `
            <tr>
              <td class="tcp-green">${r.name}</td>
              <td>${r.eff}%</td>
              <td>$${r.pay.toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
      `);

    } catch (err) {
      openPanel(`<h2>Salary Advisor</h2><p class="tcp-warn">${err.message}</p>`);
    }
  }

  /* ======================
     UI MOUNT
  ====================== */

  function mountUI() {
    if (document.getElementById('tcpBar')) return;

    const employees = document.getElementById('employees');
    if (!employees) return;

    const bar = document.createElement('div');
    bar.id = 'tcpBar';

    const btn = document.createElement('button');
    btn.id = 'tcpOpenBtn';
    btn.textContent = 'Open Company Control Panel';

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      salaryAdvisor();
    }, true);

    bar.appendChild(btn);
    (employees.closest('.company-wrap') || employees.parentElement).prepend(bar);
  }

  const observer = new MutationObserver(mountUI);
  observer.observe(document.body, { childList: true, subtree: true });

})();

/* ======================
   CHANGELOG
======================

v1.9.2
- FIXED: Uses /user/?selections=profile,job to resolve company_id
- FIXED: Uses /company/{companyId}?selections=employees,company (v1-safe)
- Avoids v2-only selection error from Torn API
- Salary advisor logic and UI unchanged

*/
