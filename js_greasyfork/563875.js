// ==UserScript==
// @name         MWI Guild xp extractor
// @namespace    http://tampermonkey.net/
// @version      2026-01-24
// @description  Extracts out the guild xp for each member for the guild xp sheet
// @author       Hsin
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563875/MWI%20Guild%20xp%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/563875/MWI%20Guild%20xp%20extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  waitForGuildPanel().then(initButton);

  // ─────────────────────────────────────────────
  // Wait until the guild panel rows exist
  // ─────────────────────────────────────────────
  function waitForGuildPanel() {
    return new Promise(resolve => {
      const selector = 'td[class^="GuildPanel_name__"] div[data-name]';
      if (document.querySelector(selector)) return resolve();

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // ─────────────────────────────────────────────
  // Initialize the export button
  // ─────────────────────────────────────────────
  function initButton() {
    const btn = document.createElement('button');
    btn.textContent = 'Export Guild CSV';
    btn.disabled = true;
    styleButton(btn);

    document.body.appendChild(btn);

    // Wait until total guild XP is available
    waitForTotalGuildXP().then(() => {
      btn.disabled = false;
    });

    btn.addEventListener('click', () => {
      const guildXP = getTotalGuildXP();
      const rows = scrapeGuildXP();
      // Add total guild XP as first row
      const csvRows = [['Name', 'XP'], ...rows.map(r => [r.name, r.xp])];
      csvRows.push(['Total Guild XP', guildXP]);
      const csv = toCSV(csvRows);
      downloadCSV(csv, 'guild_data.csv');
    });
  }

  // ─────────────────────────────────────────────
  // Wait until total guild XP value exists in DOM
  // ─────────────────────────────────────────────
  function waitForTotalGuildXP() {
    return new Promise(resolve => {
      const xpDiv = findGuildXPDiv();
      if (xpDiv) return resolve();

      const observer = new MutationObserver(() => {
        if (findGuildXPDiv()) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function findGuildXPDiv() {
    return Array.from(document.querySelectorAll('div[class^="GuildPanel_label__"]'))
      .find(el => el.innerText.trim() === 'Guild Experience')?.nextElementSibling;
  }

  function getTotalGuildXP() {
    const xpDiv = findGuildXPDiv();
    if (!xpDiv) return 0;
    return normalizeXP(xpDiv.innerText.trim());
  }

  // ─────────────────────────────────────────────
  // Scrape guild member names and XP
  // ─────────────────────────────────────────────
  function scrapeGuildXP() {
    const rows = [];
    document
      .querySelectorAll('td[class^="GuildPanel_name__"] div[data-name]')
      .forEach(nameEl => {
        const name = nameEl.dataset.name;
        const row = nameEl.closest('tr');
        const rawXP = row
          ?.querySelector('td:nth-child(3) div')
          ?.innerText.trim() ?? '';
        const xp = normalizeXP(rawXP);
        rows.push({ name, xp });
      });
    console.table(rows);
    return rows;
  }

  // ─────────────────────────────────────────────
  // Normalize XP string to number
  // ─────────────────────────────────────────────
  function normalizeXP(value) {
    if (!value) return 0;
    const v = value.trim().toUpperCase();
    if (v.endsWith('K')) return Math.round(parseFloat(v) * 1000);
    if (v.endsWith('M')) return Math.round(parseFloat(v) * 1_000_000);
    return parseInt(v.replace(/,/g, ''), 10) || 0;
  }

  // ─────────────────────────────────────────────
  // CSV helpers
  // ─────────────────────────────────────────────
  function toCSV(rows) {
    return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ─────────────────────────────────────────────
  // Button styling helper
  // ─────────────────────────────────────────────
  function styleButton(btn) {
  btn.style.position = 'fixed';
  btn.style.top = '20px';
  btn.style.right = '400px';
  btn.style.padding = '10px 15px';
  btn.style.zIndex = '9999';
  btn.style.backgroundColor = '#28a745';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '14px';
  btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
}
})();