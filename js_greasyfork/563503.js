// ==UserScript==
// @name         Torn Company Salary Advisor (Table-Safe)
// @namespace    torn.salary.modulstyle
// @version      1.1.0
// @description  Salary advisor for Torn companies using table-based employee layout.
// @author       R4G3RUNN3R [3877028]
// @match        https://www.torn.com/companies.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563503/Torn%20Company%20Salary%20Advisor%20%28Table-Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563503/Torn%20Company%20Salary%20Advisor%20%28Table-Safe%29.meta.js
// ==/UserScript==


(function () {
  'use strict';

  let mounted = false;

  function getDailyIncome() {
    let income = 0;
    $('li').each(function () {
      const t = $(this).text();
      if (t.includes('Daily income')) {
        const m = t.match(/\$([\d,]+)/);
        if (m) income = parseInt(m[1].replace(/,/g, ''), 10);
      }
    });
    return income;
  }

  function getEmployees() {
    const out = [];
    $('[data-user]').each(function () {
      const row = $(this);
      const name = row.find('a.user').first().text().trim();
      const effCell = row.find('td').eq(1).text();
      const effMatch = effCell.match(/(\d+)/);
      const eff = effMatch ? parseInt(effMatch[1], 10) : 0;
      if (name) out.push({ name, eff });
    });
    return out;
  }

  function openPanel(html) {
    $('#salaryOverlay').remove();
    $('body').append(`
      <div id="salaryOverlay" style="position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:999999;">
        <div style="background:#1e1e1e; color:#fff; width:900px; max-height:85vh; overflow:auto;
                    margin:4% auto; padding:20px; border-radius:8px;">
          <span id="closeSalary" style="float:right; cursor:pointer;">✕</span>
          ${html}
        </div>
      </div>
    `);
    $('#closeSalary').on('click', () => $('#salaryOverlay').remove());
    $('#salaryOverlay').on('click', e => {
      if (e.target.id === 'salaryOverlay') $('#salaryOverlay').remove();
    });
  }

  function runAdvisor() {
    const income = getDailyIncome();
    const employees = getEmployees();

    if (!income || !employees.length) {
      openPanel(`
        <h2>Salary Advisor</h2>
        <p style="color:#ffb347;">Unable to read company data.</p>
        <p>Income detected: ${income}</p>
        <p>Employees detected: ${employees.length}</p>
      `);
      return;
    }

    const percent = parseFloat(prompt('Percent of DAILY income to distribute?', '80'));
    const base = parseInt(prompt('Base DAILY pay per employee', '25000'), 10);
    const rate = parseFloat(prompt('Pay per effectiveness point', '2000'));

    if (![percent, base, rate].every(Number.isFinite)) return;

    const pool = Math.floor(income * (percent / 100));
    let total = 0;

    employees.forEach(e => {
      e.pay = Math.floor(base + e.eff * rate);
      total += e.pay;
    });

    if (total > pool) {
      const scale = pool / total;
      employees.forEach(e => e.pay = Math.floor(e.pay * scale));
      total = employees.reduce((s, e) => s + e.pay, 0);
    }

    openPanel(`
      <h2>Salary Advisor</h2>
      <p>Daily income: <b>$${income.toLocaleString()}</b></p>
      <p>Salary pool: <b>$${pool.toLocaleString()}</b></p>
      <p>Distributed: <b>$${total.toLocaleString()}</b></p>

      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <tr>
          <th style="border:1px solid #444; padding:6px;">Employee</th>
          <th style="border:1px solid #444; padding:6px;">Effectiveness</th>
          <th style="border:1px solid #444; padding:6px;">Suggested Pay</th>
        </tr>
        ${employees.map(e => `
          <tr>
            <td style="border:1px solid #444; padding:6px; color:#3cff3c;">${e.name}</td>
            <td style="border:1px solid #444; padding:6px;">${e.eff}%</td>
            <td style="border:1px solid #444; padding:6px;">$${e.pay.toLocaleString()}</td>
          </tr>
        `).join('')}
      </table>
    `);
  }

  const observer = new MutationObserver(() => {
    if (mounted) return;

    const table = $('[data-user]').first().closest('table');
    if (!table.length) return;

    mounted = true;

    const bar = $(`
      <div style="margin:10px 0; padding:10px; background:#0a0a0a; border:1px solid #333;">
        <button id="openSalaryAdvisor"
          style="background:#000; color:#3cff3c; border:2px solid #3cff3c;
                 padding:8px 16px; font-weight:bold; cursor:pointer;">
          Open Salary Advisor
        </button>
      </div>
    `);

    bar.find('#openSalaryAdvisor').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      runAdvisor();
    });

    table.before(bar);
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
