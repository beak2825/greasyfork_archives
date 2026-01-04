// ==UserScript==
// @name         Jonas Tournament Scraper PRO (v1.5 – Real Click Edition)
// @namespace    lukasmalec
// @version      1.5
// @description  Simuluje skutečné kliknutí na popup, čte hodnoty z DOMu a stahuje CSV s výsledky
// @author       LM + GPT
// @license      MIT
// @match        *://dc.livesport.eu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554787/Jonas%20Tournament%20Scraper%20PRO%20%28v15%20%E2%80%93%20Real%20Click%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554787/Jonas%20Tournament%20Scraper%20PRO%20%28v15%20%E2%80%93%20Real%20Click%20Edition%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===== UTILITKY =====
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function clean(text) { return (text || '').trim().replace(/\s+/g, ' '); }

  function makeCSV(data) {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(h => `"${(obj[h] || '').toString().replace(/"/g, '""')}"`).join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function showProgress(current, total) {
    let box = document.getElementById('tm-progress-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'tm-progress-box';
      Object.assign(box.style, {
        position: 'fixed', top: '10px', right: '10px',
        padding: '8px 14px', background: 'rgba(0,0,0,0.75)',
        color: '#fff', fontSize: '13px', borderRadius: '8px',
        zIndex: 999999
      });
      document.body.appendChild(box);
    }
    box.textContent = `🔄 Scraping: ${current}/${total}`;
  }

  // ===== FUNKCE: Čtení z popupu =====
  async function scrapePopupFromVisibleDOM() {
    console.log('🟢 Čekám, až se objeví popup v DOMu...');
    let popup = null;

    for (let i = 0; i < 75; i++) { // max 15 s
      popup = document.querySelector('.dc-winbox-wrapper [data-test-id="jonas-field-tournament-propertyData"]');
      if (popup) break;
      await wait(200);
    }

    if (!popup) {
      console.warn('❌ Popup nebyl nalezen v DOMu ani po 15s.');
      return { 'LiveInput Difficulty': '', 'Lineups interval': '' };
    }

    console.log('✅ Popup nalezen! Čtu data...');
    await wait(500);

    const difficultyInput = popup.querySelector('input[id*="_poa_48_i"]');
    const lineupInput     = popup.querySelector('input[id*="_poa_70_i"]');

    const difficulty = difficultyInput ? difficultyInput.value.trim() : '';
    const interval   = lineupInput ? lineupInput.value.trim() : '';

    console.log('🎯 Z popupu načteno:', { difficulty, interval });
    return { 'LiveInput Difficulty': difficulty, 'Lineups interval': interval };
  }

  // ===== HLAVNÍ SCRAPER =====
  async function runScraper() {
    const rows = Array.from(document.querySelectorAll('tr[data-test-id="table-body-row"]'));
    if (!rows.length) return alert('❌ Žádné řádky nenalezeny.');

    const results = [];

    for (let i = 0; i < rows.length; i++) {
      const tr = rows[i];
      showProgress(i + 1, rows.length);
      console.log(`➡️ Zpracovávám řádek ${i + 1}/${rows.length}`);

      const editIcon = tr.querySelector('td:nth-child(2) i[title="Edit"]');
      const editLink = editIcon ? editIcon.closest('a') : null;
      if (!editLink) {
        console.warn(`❌ Žádný Edit odkaz v řádku ${i + 1}`);
        continue;
      }

      // === Reálná simulace kliknutí ===
      editLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(500);
      console.log('🖱️ Simuluji fyzické kliknutí na Edit...');

      ['mousedown', 'mouseup', 'click'].forEach(type => {
        const evt = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0,
        });
        editLink.dispatchEvent(evt);
      });

      console.log('⏳ Čekám na otevření popupu...');
      await wait(2000);

      // === Čtení z popupu ===
      const popupData = await scrapePopupFromVisibleDOM();

      // === Data z tabulky ===
      const tds = tr.querySelectorAll('td');
      const TournamentID = clean(tds[2]?.textContent);
      const Sport = clean(tds[4]?.textContent);
      const Country = clean(tds[5]?.textContent);
      const Tournament = clean(tds[8]?.textContent);
      const Season = clean(tds[9]?.textContent);

      const rowData = {
        'Tournament ID': TournamentID,
        'Sport': Sport,
        'Country': Country,
        'Tournament': Tournament,
        'Season': Season,
        'LiveInput Difficulty': popupData['LiveInput Difficulty'],
        'Lineups interval': popupData['Lineups interval']
      };
      console.log('✅ Řádek uložen:', rowData);
      results.push(rowData);

      // === Zavři popup ===
      const closeBtn = document.querySelector('.dc-winbox-focusable i[title="Close window"]');
      if (closeBtn) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        closeBtn.dispatchEvent(evt);
        console.log('❎ Popup zavřen');
      }

      await wait(1500); // malá pauza
    }

    console.log('📦 Hotovo, výsledky:', results);

    if (!results.length) {
      alert('⚠️ Žádná data nebyla načtena.');
      return;
    }

    const csv = makeCSV(results);
    const filename = 'tournament_data_' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.csv';
    downloadCSV(csv, filename);

    document.getElementById('tm-progress-box').textContent =
      '✅ Hotovo! ' + results.length + ' řádků staženo.';
    alert('Hotovo! CSV staženo.');
  }

  // ===== UI TLAČÍTKO =====
  function addButton() {
    if (document.getElementById('runScraperBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'runScraperBtn';
    btn.textContent = '🟢 Spustit scraper';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '20px', right: '20px',
      padding: '10px 20px', background: '#28a745',
      color: '#fff', border: 'none', borderRadius: '8px',
      cursor: 'pointer', zIndex: 999999, fontWeight: 'bold'
    });
    btn.onclick = runScraper;
    document.body.appendChild(btn);
  }

  window.addEventListener('load', () => setTimeout(addButton, 2000));
})();
