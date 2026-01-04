// ==UserScript==
// @name         eRepublik: Calculator for country economy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds selector for summing custom data in the country page
// @match        https://www.erepublik.com/*/country/economy/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557032/eRepublik%3A%20Calculator%20for%20country%20economy.user.js
// @updateURL https://update.greasyfork.org/scripts/557032/eRepublik%3A%20Calculator%20for%20country%20economy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function injectPageReader() {
    const script = document.createElement('script');
    script.textContent = '(' + function () {
      function dispatch(data) {
        window.dispatchEvent(new CustomEvent('GM_tableDataJSON_ready', { detail: data }));
      }
      if (typeof window.tableDataJSON !== 'undefined' && window.tableDataJSON) {
        dispatch(window.tableDataJSON);
      } else {
        let tries = 0;
        const iv = setInterval(function () {
          tries++;
          if (typeof window.tableDataJSON !== 'undefined' && window.tableDataJSON) {
            clearInterval(iv);
            dispatch(window.tableDataJSON);
          } else if (tries > 50) {
            clearInterval(iv);
            dispatch(null);
          }
        }, 200);
      }
    } + ')();';
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  }

  function buildUI(tableData) {
    if (!tableData || !Array.isArray(tableData) || tableData.length < 2) {
      console.warn('GM: tableDataJSON no encontrado o formato inesperado', tableData);
      return;
    }

    const existing = document.getElementById('gm-econ-sum-container');
    if (existing) existing.remove();

    const daysRow = tableData[0];
    const sampleRow = tableData[1];

    let valueIndexOffset = 1;
    if (sampleRow.length === daysRow.length) {
      valueIndexOffset = 0;
    } else if (sampleRow.length === daysRow.length + 1) {
      valueIndexOffset = 1;
    } else {
      let firstNumIdx = null;
      for (let i = 0; i < sampleRow.length; i++) {
        if (!isNaN(parseFloat(sampleRow[i])) && isFinite(sampleRow[i])) {
          firstNumIdx = i;
          break;
        }
      }
      if (firstNumIdx === null) {
        console.warn('GM: no se detectaron columnas numéricas en tableDataJSON[1]', sampleRow);
        return;
      }
      valueIndexOffset = firstNumIdx;
    }

    const fullDays = Array.isArray(daysRow) ? daysRow.slice() : [];

    const daysStart = 1;
    const daysEnd = Math.max(-1, fullDays.length - 3); // inclusive
    let filteredDayIndices = [];
    if (fullDays.length >= 4 && daysEnd >= daysStart) {
      for (let i = daysStart; i <= daysEnd; i++) filteredDayIndices.push(i);
    } else {
      if (fullDays.length > 2) {
        for (let i = 1; i < fullDays.length - 2; i++) filteredDayIndices.push(i);
      } else {
        for (let i = 0; i < fullDays.length; i++) filteredDayIndices.push(i);
      }
    }

    const revenueRows = tableData.slice(1);
    const revenueNames = revenueRows.map(r => String(r[0] || ''));

    const container = document.createElement('div');
    container.id = 'gm-econ-sum-container';
    container.style.border = '1px solid #ccc';
    container.style.padding = '8px';
    container.style.marginBottom = '10px';
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.alignItems = 'center';
    container.style.flexWrap = 'wrap';
    container.style.background = '#fafafa';

    function makeSelect(labelText, options, id) {
      const wrap = document.createElement('label');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.fontSize = '12px';
      wrap.style.minWidth = '160px';

      const label = document.createElement('span');
      label.textContent = labelText;
      label.style.marginBottom = '4px';
      wrap.appendChild(label);

      const sel = document.createElement('select');
      sel.id = id;
      sel.style.padding = '4px';
      sel.style.fontSize = '13px';

      options.forEach(opt => {
        const o = document.createElement('option');
        o.value = String(opt.value);
        o.textContent = opt.label;
        sel.appendChild(o);
      });

      wrap.appendChild(sel);
      return { wrap, sel };
    }

    const revOptions = revenueNames.map((name, idx) => ({ value: idx, label: name }));

    const daysOptions = filteredDayIndices.map(idx => ({ value: idx, label: fullDays[idx] }));

    const revEl = makeSelect('Revenue source', revOptions, 'gm_rev_select');
    const fromEl = makeSelect('From', daysOptions, 'gm_from_select');
    const toEl = makeSelect('To', daysOptions, 'gm_to_select');

    const resultWrap = document.createElement('label');
    resultWrap.style.display = 'flex';
    resultWrap.style.flexDirection = 'column';
    resultWrap.style.fontSize = '12px';
    resultWrap.style.minWidth = '160px';
    const resultLabel = document.createElement('span');
    resultLabel.textContent = 'Result';
    resultLabel.style.marginBottom = '4px';
    const resultInput = document.createElement('input');
    resultInput.type = 'text';
    resultInput.readOnly = true;
    resultInput.id = 'gm_result_field';
    resultInput.style.padding = '4px';
    resultInput.style.fontSize = '13px';
    resultInput.value = '0';
    resultWrap.appendChild(resultLabel);
    resultWrap.appendChild(resultInput);

    container.appendChild(revEl.wrap);
    container.appendChild(fromEl.wrap);
    container.appendChild(toEl.wrap);
    container.appendChild(resultWrap);

    const charts = document.querySelector('#country_charts');
    if (charts && charts.parentNode) {
      charts.parentNode.insertBefore(container, charts);
    } else {
      document.body.insertBefore(container, document.body.firstChild);
    }

    const revSelect = revEl.sel;
    const fromSelect = fromEl.sel;
    const toSelect = toEl.sel;

    function updateToConstraints() {
      const fromIdx = parseInt(fromSelect.value, 10);
      Array.from(toSelect.options).forEach(opt => {
        const idx = parseInt(opt.value, 10);
        opt.disabled = idx < fromIdx;
      });
      if (parseInt(toSelect.value, 10) < fromIdx) {
        toSelect.value = String(fromIdx);
      }
    }

    function computeSum() {
      const revIdx = parseInt(revSelect.value, 10);
      const fromDayIdx = parseInt(fromSelect.value, 10);
      const toDayIdx = parseInt(toSelect.value, 10);

      if (isNaN(revIdx) || isNaN(fromDayIdx) || isNaN(toDayIdx)) {
        resultInput.value = '';
        return;
      }

      const row = revenueRows[revIdx];
      if (!row) {
        resultInput.value = '0';
        return;
      }

      const startCol = valueIndexOffset + fromDayIdx;
      const endCol = valueIndexOffset + toDayIdx;
      let sum = 0;
      for (let c = startCol; c <= endCol; c++) {
        const raw = row[c];
        const num = parseFloat(String(raw).replace(/,/g, ''));
        if (!isNaN(num)) sum += num;
      }
      const isInt = Number.isInteger(sum);
      resultInput.value = isInt ? String(sum) : String(sum.toFixed(2));
    }

    fromSelect.addEventListener('change', function () {
      updateToConstraints();
      computeSum();
    }, { passive: true });

    toSelect.addEventListener('change', function () {
      computeSum();
    }, { passive: true });

    revSelect.addEventListener('change', function () {
      computeSum();
    }, { passive: true });

    if (fromSelect.options.length > 0) {
      fromSelect.selectedIndex = 0;
    }
    if (toSelect.options.length > 0) {
      toSelect.selectedIndex = toSelect.options.length - 1;
    }
    updateToConstraints();
    computeSum();

    window.__GM_tableDataJSON_info = {
      tableData,
      revenueRows,
      fullDays,
      filteredDayIndices,
      valueIndexOffset,
      computeSum
    };
    console.log('GM: tableDataJSON leída y UI creada (updated). Detalles en window.__GM_tableDataJSON_info', window.__GM_tableDataJSON_info);
  }

  window.addEventListener('GM_tableDataJSON_ready', function (ev) {
    const data = ev.detail;
    if (!data) {
      console.warn('GM: tableDataJSON no disponible (evento recibido con detalle null).');
      return;
    }
    buildUI(data);
  }, false);

  injectPageReader();

  try {
    if (typeof window.tableDataJSON !== 'undefined' && window.tableDataJSON) {
      setTimeout(() => {
        const ev = new CustomEvent('GM_tableDataJSON_ready', { detail: window.tableDataJSON });
        window.dispatchEvent(ev);
      }, 300);
    }
  } catch (e) {
    // ignore
  }

})();
