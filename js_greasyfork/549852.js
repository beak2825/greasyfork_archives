// ==UserScript==
// @name         Auto MPESA – IMOS One-Time Payment Helper
// @namespace    benf.auto.mpesa
// @version      1.0.1
// @description  Upload a CSV and auto-fill IMOS account distribution lines (description + amount). Adds rows in <=20 chunks.
// @match        https://imos.churchofjesuschrist.org/payments/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549852/Auto%20MPESA%20%E2%80%93%20IMOS%20One-Time%20Payment%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549852/Auto%20MPESA%20%E2%80%93%20IMOS%20One-Time%20Payment%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*****************
   * Small helpers *
   *****************/
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  function notify(msg, type = 'info', t = 3500) {
    let box = document.getElementById('auto-mpesa-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'auto-mpesa-toast';
      Object.assign(box.style, {
        position: 'fixed', right: '16px', bottom: '16px', padding: '10px 14px',
        background: '#111', color: '#fff', borderRadius: '10px', zIndex: 999999,
        fontSize: '13px', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', maxWidth: '60vw'
      });
      document.body.appendChild(box);
    }
    box.style.background = (type === 'error') ? '#b00020' : (type === 'success' ? '#196e3d' : '#111');
    box.textContent = msg;
    clearTimeout(box._t);
    box._t = setTimeout(() => { box.remove(); }, t);
  }

  // Set input.value the "Angular-safe" way and emit events
  function setInputValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // Normalize header keys (remove accents/spaces/punct, lowercase)
  function normKey(s) {
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  }

  // Detect CSV columns by flexible names
  function detectColumns(headers) {
    const norms = headers.map(normKey);

    const wantAmount = ['mznvalor', 'amount', 'mzn', 'valor', 'amountmzn', "Valor MZN (cost)", 'montante', 'valoramount'].map(normKey);
    const wantDesc = ['lineitem', 'Line Item', 'memo', 'descricao', 'item', 'details'].map(normKey);

    const findIdx = (wantList) => {
      for (const w of wantList) {
        const idx = norms.indexOf(w);
        if (idx !== -1) return idx;
      }
      return -1;
    };

    return { amountIdx: findIdx(wantAmount), descIdx: findIdx(wantDesc) };
  }

  // Safe MZN parser: handles "1.234,56", "1,234.56", "1234,56", "1234.56", "1 234,56", etc.
  function toTwoDecimalAmount(raw) {
    if (raw == null) return '';
    let s = String(raw).trim();

    // Remove currency symbols and spaces
    s = s.replace(/[^\d,.\-]/g, '');

    if (s.includes(',') && s.includes('.')) {
      // Decide decimal by last occurrence
      if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
        // comma decimal
        s = s.replace(/\./g, '').replace(',', '.');
      } else {
        // dot decimal
        s = s.replace(/,/g, '');
      }
    } else if (s.includes(',') && !s.includes('.')) {
      // comma decimal
      s = s.replace(',', '.');
    } // else already dot decimal or integer

    const num = parseFloat(s);
    if (Number.isNaN(num)) return '';
    return num.toFixed(2);
  }

    function sumTaxaColumn(headers, data) {
        const idx = headers.findIndex(h => normKey(h) === 'taxa');
        if (idx === -1) return null; // no TAXA column
        let total = 0;
        for (const row of data) {
            const raw = (row[idx] || '').toString().trim().replace(',', '.');
            const num = parseFloat(raw);
            if (!isNaN(num)) total += num;
        }
        return total;
    }


  // Lightweight CSV parser (handles quotes, commas, newlines)
  function parseCSV(text) {
    // Remove BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

    const rows = [];
    let i = 0, cur = '', cell = '', inQuotes = false;

    function pushCell() { cur += cell; cell = ''; }
    function pushField(r) { r.push(cur); cur = ''; }
    function pushRow(r) { rows.push(r); }

    let r = [];
    while (i < text.length) {
      const ch = text[i];

      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i += 2; continue; } // escaped quote
          else { inQuotes = false; i++; continue; }
        } else {
          cell += ch; i++; continue;
        }
      } else {
        if (ch === '"') { inQuotes = true; i++; continue; }
        if (ch === ',') { pushCell(); pushField(r); i++; continue; }
        if (ch === '\r') { i++; continue; }
        if (ch === '\n') { pushCell(); pushField(r); pushRow(r); r = []; i++; continue; }
        cell += ch; i++;
      }
    }
    // flush last cell/row
    pushCell(); pushField(r);
    if (r.length > 1 || (r.length === 1 && r[0] !== '')) pushRow(r);

    if (!rows.length) return { headers: [], data: [] };

    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.some(v => String(v).trim() !== ''));
    return { headers, data };
  }

  function getTableRoot() {
    // Withholding vs non-withholding IDs (site misspells "withholding" as "witholding")
    return document.querySelector('#one-time-payment-account-distribution-no-witholding, #one-time-payment-account-distribution-witholding');
  }

  function getLineBodies() {
    const table = getTableRoot();
    if (!table) return [];
    return Array.from(table.querySelectorAll('tbody[ng-repeat="line in accountDistribution.service.payment.distributionList"]'));
  }

  async function waitForElm(selector, timeoutMs = 20000) {
    const existing = document.querySelector(selector);
    if (existing) return existing;
    return new Promise((resolve, reject) => {
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('Timeout waiting for ' + selector));
      }, timeoutMs);
    });
  }

  async function addRowsUntil(targetCount) {
    const inputSel = 'span.add-number-lines-input-wrapper input[ng-model="accountDistribution.service.payment.numLinesToAdd"]';
    const addBtnSel = 'imos-button[type="action add"] button';

    const input = await waitForElm(inputSel);
    const addBtn = await waitForElm(addBtnSel);

    let current = getLineBodies().length;
    if (current >= targetCount) {
      console.log('[Auto MPESA] Already have', current, 'rows; target', targetCount);
      return;
    }

    let remaining = targetCount - current;
    console.log('[Auto MPESA] Need to add', remaining, 'rows');

    while (remaining > 0) {
      const chunk = Math.min(20, remaining);
      setInputValue(input, String(chunk));
      addBtn.click();
      console.log('[Auto MPESA] Clicked Add for', chunk);
      // Wait until rows increase
      const targetAfter = current + chunk;

      // Poll up to 10 seconds for rows to appear
      const t0 = Date.now();
      while (getLineBodies().length < targetAfter && (Date.now() - t0) < 10000) {
        await sleep(200);
      }

      current = getLineBodies().length;
      remaining = targetCount - current;
      console.log('[Auto MPESA] Row count now', current, '; remaining', remaining);
      await sleep(150); // slight breather
    }
  }

  function ensureButton() {
    if (document.getElementById('auto-mpesa-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'auto-mpesa-btn';
    btn.textContent = 'Auto MPESA';
    Object.assign(btn.style, {
      position: 'fixed',
      left: '16px',
      bottom: '16px',
      zIndex: 999999,
      background: '#0a84ff',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 14px',
      fontSize: '14px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      cursor: 'pointer'
    });
    btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(1.05)');
    btn.addEventListener('mouseleave', () => btn.style.filter = '');

    btn.addEventListener('click', openModal);
    document.body.appendChild(btn);
  }

  function openModal() {
    if (document.getElementById('auto-mpesa-modal')) {
      document.getElementById('auto-mpesa-modal').remove();
    }
    const overlay = document.createElement('div');
    overlay.id = 'auto-mpesa-modal';
    Object.assign(overlay.style, {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999999
    });

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      background: '#fff', padding: '20px', borderRadius: '14px', width: 'min(520px, 92vw)',
      boxShadow: '0 10px 40px rgba(0,0,0,.25)', fontFamily: 'system-ui, Roboto, Segoe UI, Arial'
    });

    const h = document.createElement('div');
    h.textContent = 'Auto MPESA — Upload CSV';
    Object.assign(h.style, { fontSize: '18px', fontWeight: 700, marginBottom: '10px' });

    const p = document.createElement('div');
    p.innerHTML = 'Select a CSV with headers including <code>MZN Valor</code> and <code>Line Item</code>.';
    Object.assign(p.style, { fontSize: '13px', marginBottom: '14px' });

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.style.marginBottom = '12px';

    const hint = document.createElement('div');
    hint.textContent = 'We will add N + 1 rows and fill the first N rows.';
    Object.assign(hint.style, { fontSize: '12px', color: '#444', marginBottom: '12px' });

    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', gap: '10px', justifyContent: 'flex-end' });

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    Object.assign(cancel.style, commonBtn('#e5e7eb', '#111'));
    cancel.addEventListener('click', () => overlay.remove());

    const go = document.createElement('button');
    go.textContent = 'Process CSV';
    Object.assign(go.style, commonBtn('#0a84ff', '#fff'));
    go.addEventListener('click', async () => {
      if (!input.files || !input.files[0]) { notify('Please choose a CSV file.', 'error'); return; }
      overlay.remove();
      const file = input.files[0];
      const text = await file.text();
      await processCSVText(text);
    });

    row.append(cancel, go);
    panel.append(h, p, input, hint, row);
    overlay.append(panel);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  function commonBtn(bg, fg) {
    return {
      background: bg, color: fg, border: 'none', borderRadius: '10px',
      padding: '8px 12px', cursor: 'pointer', fontSize: '14px'
    };
  }

  /********************
   * Core CSV -> Form *
   ********************/
  async function processCSVText(text) {
    try {
      const { headers, data } = parseCSV(text);
      if (!headers.length) {
        notify('CSV appears empty or unparseable.', 'error');
        return;
      }

      function showColumnSelector(headers) {
        return new Promise((resolve) => {
          const overlay = document.createElement('div');
          Object.assign(overlay.style, {
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999999
          });

          const panel = document.createElement('div');
          Object.assign(panel.style, {
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            background: '#fff', padding: '20px', borderRadius: '14px',
            width: 'min(420px, 92vw)', boxShadow: '0 10px 40px rgba(0,0,0,.25)',
            fontFamily: 'system-ui, Roboto, Segoe UI, Arial'
          });

          const title = document.createElement('div');
          title.textContent = 'Select CSV Columns';
          Object.assign(title.style, { fontSize: '18px', fontWeight: 700, marginBottom: '14px' });

          function makeSelect(labelText) {
            const label = document.createElement('label');
            label.textContent = labelText;
            Object.assign(label.style, { display: 'block', marginBottom: '6px', fontSize: '13px' });

            const select = document.createElement('select');
            headers.forEach(h => {
              const opt = document.createElement('option');
              opt.value = h;
              opt.textContent = h;
              select.appendChild(opt);
            });
            Object.assign(select.style, { width: '100%', marginBottom: '12px', padding: '4px' });

            label.appendChild(select);
            panel.appendChild(label);
            return select;
          }

          const lineItemSel = makeSelect('Line Item column:');
          const costSel     = makeSelect('Cost column:');
          const feeSel      = makeSelect('Fee column (for TAX total):');

          const btn = document.createElement('button');
          btn.textContent = 'Continue';
          Object.assign(btn.style, {
            background: '#0a84ff', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '8px 12px', cursor: 'pointer'
          });
          btn.addEventListener('click', () => {
            const cols = {
              lineItem: lineItemSel.value,
              cost: costSel.value,
              fee: feeSel.value
            };
            overlay.remove();
            resolve(cols);
          });

          panel.appendChild(btn);
          overlay.appendChild(panel);
          document.body.appendChild(overlay);
        });
      }


      const selectedCols = await showColumnSelector(headers);
      const lineIdx = headers.indexOf(selectedCols.lineItem);
      const costIdx = headers.indexOf(selectedCols.cost);
      const feeIdx  = headers.indexOf(selectedCols.fee);



      // Build normalized records
      const records = data.map(row => ({
        description: (row[lineIdx] || '').toString().trim(),
        amount: toTwoDecimalAmount(row[costIdx])
      }));

      let taxaTotal = 0;
      for (const row of data) {
        const raw = (row[feeIdx] || '').toString().trim();
        const num = parseFloat(raw.replace(',', '.'));
        if (!isNaN(num)) taxaTotal += num;
      }

      if (!records.length) {
        notify('No non-empty rows found after parsing.', 'error');
        return;
      }

      const targetLines = records.length + 1; // keep last one empty
      notify(`Preparing ${targetLines} total lines…`);

      await addRowsUntil(targetLines);

      // Required: wait 2 seconds before filling
      await sleep(2000);

      const bodies = getLineBodies();
      if (bodies.length < targetLines) {
        notify(`Only ${bodies.length} lines available; expected ${targetLines}.`, 'error');
        return;
      }

      // Fill the first N rows
      let filled = 0;
      for (let i = 0; i < records.length; i++) {
        const rowBody = bodies[i];
        const descInput = rowBody.querySelector('input[ng-model="line.distributionDescription"]');
        const amtInput  = rowBody.querySelector('input[ng-model="line.amountDisplayedToUser"]');

        if (!descInput || !amtInput) {
          console.warn('[Auto MPESA] Could not find inputs in row', i + 1, rowBody);
          continue;
        }

        // Truncate description to maxlength if needed
        let desc = records[i].description || '';
        const maxLen = parseInt(descInput.getAttribute('maxlength') || '30', 10);
        if (desc.length > maxLen) {
          console.warn(`[Auto MPESA] Row ${i + 1} description truncated to ${maxLen} chars.`);
          desc = desc.slice(0, maxLen);
        }

        const amt = records[i].amount || '';
        if (amt === '') {
          console.warn(`[Auto MPESA] Row ${i + 1} has empty/invalid amount; leaving blank.`);
        }

        setInputValue(descInput, desc);
        await sleep(30);
        setInputValue(amtInput, amt);
        await sleep(30);

        filled++;
      }

      notify(`Filled ${filled}/${records.length} rows. Last row left blank.`, 'success', 5000);
      console.log('[Auto MPESA] Done. Filled:', filled, 'of', records.length);
        if (taxaTotal !== null) {
            const lastRow = bodies[records.length]; // the +1 row
            const descInput = lastRow.querySelector('input[ng-model="line.distributionDescription"]');
            const amtInput  = lastRow.querySelector('input[ng-model="line.amountDisplayedToUser"]');

            if (descInput && amtInput) {
                setInputValue(descInput, 'TAX');
                await sleep(30);
                setInputValue(amtInput, taxaTotal.toFixed(2));
                await sleep(30);
                notify(`Added TAX row with total ${taxaTotal.toFixed(2)}.`, 'success');
            }
        }

    } catch (err) {
      console.error('[Auto MPESA] Error:', err);
      notify('Auto MPESA encountered an error. See console for details.', 'error', 6000);
    }
  }

  /********************
   * Bootstrapping    *
   ********************/
  function init() {
    if (document.documentElement.hasAttribute('data-auto-mpesa-init')) return;
    document.documentElement.setAttribute('data-auto-mpesa-init', '1');

    // Keep watching for the target area; button is global/fixed anyway
    ensureButton();

    // If SPA route changes, still keep button; nothing else to do
    const mo = new MutationObserver(() => {
      ensureButton();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    console.log('[Auto MPESA] Initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Expose for manual retry if needed
  window.__AutoMPESA = { processCSVText, addRowsUntil };
})();
