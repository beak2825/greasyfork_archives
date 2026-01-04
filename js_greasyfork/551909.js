// ==UserScript==
// @name         TI/XP Transfer List Modified
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Transfer List: Show Routine (always) and Training Intensity (from Tuesday to Saturday)
// @match        https://trophymanager.com/transfer/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551909/TIXP%20Transfer%20List%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/551909/TIXP%20Transfer%20List%20Modified.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONST = {
    WRAP: 'div#transfer_list',

    TI_COL: 6,           
    DIFF_COL: 9,         
    XP_COL: 12,
    CURRENT_PRICE_COL_BASE: 7,  

    TI_HEADER: 'TI',
    XP_HEADER: 'XP',
    DIFF_HEADER: 'Price diff',

    TI_PREC: 0,
    XP_PREC: 1,
    DIFF_PREC: 0,
    CONCURRENCY: 8
  };

  const GK = 'GK';

  let initialized = false;
  let columnsAdded = false;

  const currentPriceById = Object.create(null);

  const num = (t) => Number(String(t || '').replace(/[^\d.-]/g, ''));
  const formatCoin = (n, prec = 0) => {
    if (!isFinite(n)) return '-';
    const s = Number(n).toFixed(prec);
    const [i, d] = s.split('.');
    const withSep = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `<span class='coin'>${d ? `${withSep}.${d}` : withSep}</span>`;
  };

  const getRows = () =>
    Array.from(document.querySelectorAll(`${CONST.WRAP} tr[id^=player_row]`));

  const mapRows = () =>
    getRows().map(row => ({ id: row.id.split('_')[2], row }));

  const getOldASI = (row) => {
    const cells = row.querySelectorAll('td,th');
    const cell = cells[5];
    if (!cell) return NaN;
    const m = cell.innerHTML.match(/[0-9,\.]+/);
    return m ? Number(m[0].replace(/[^\d.-]/g, '')) : NaN;
  };

  const addColumn = (colIndex, headerName) => {
    const headerRow = document.querySelector(`${CONST.WRAP} tr.header`);
    if (!headerRow) return;
    const ths = headerRow.querySelectorAll('th');
    const th = document.createElement('th');
    th.style.width = '80px';
    th.textContent = headerName;

    if (ths.length > colIndex + 1) headerRow.insertBefore(th, ths[colIndex]);
    else headerRow.appendChild(th);

    const rows = getRows();
    rows.forEach(row => {
      if (!row.children.length) return;
      const td = document.createElement('td');
      td.className = 'align_center';
      td.textContent = '-';
      const tds = row.querySelectorAll('td');
      if (tds.length > colIndex && tds[colIndex]) row.insertBefore(td, tds[colIndex]);
      else row.appendChild(td);
    });
  };

  const writeCell = (rowIndex, colIndex, html) => {
    const rows = getRows();
    const row = rows[rowIndex];
    if (!row) return;
    const cells = row.querySelectorAll('td,th');
    if (cells[colIndex]) cells[colIndex].innerHTML = html;
  };

  const TI = {
    compute(asiNew, asiOld, fp) {
      const P = Math.pow;
      if (fp === GK) {
        return (
          (P(asiNew * P(2, 9) * P(5, 4) * P(7, 7), 1 / 7) -
            P(asiOld * P(2, 9) * P(5, 4) * P(7, 7), 1 / 7)) /
            14 * 11 * 10
        );
      }
      return (
        (P(asiNew * P(2, 9) * P(5, 4) * P(7, 7), 1 / 7) -
          P(asiOld * P(2, 9) * P(5, 4) * P(7, 7), 1 / 7)) * 10
      );
    }
  };

  const priceDiff = (asiNew, ageYears, ageMonths, currentPrice, fp) => {
    const age = Number(ageYears) + Number(ageMonths) / 12;
    if (!asiNew || !age || age <= 0 || !isFinite(currentPrice)) return NaN;
    const est = asiNew * 500 * Math.pow(25 / age, 2.5);
    if (fp === GK) return est * 3 / 4 - currentPrice;
    return est - currentPrice;
  };

  const fetchPlayer = (id) =>
    new Promise((resolve, reject) => {
      $.ajax({
        url: '/ajax/tooltip.ajax.php',
        method: 'POST',
        dataType: 'json',
        data: { player_id: id, minigame: undefined }
      })
        .done((data) => {
          const p = data.player || {};
          resolve({
            id: p.player_id,
            fp: p.fp,
            asi: Number(String(p.skill_index || '0').replace(/,/g, '')),
            xp: Number(String(p.routine || '0').replace(',', '.')),
            age: Number(p.age || 0),
            months: Number(p.months || 0)
          });
        })
        .fail(reject);
    });

  const runPool = async (items, worker, concurrency) => {
    const out = Array(items.length);
    let i = 0, active = 0;
    return new Promise((resolve) => {
      const next = () => {
        while (active < concurrency && i < items.length) {
          const cur = i++;
          active++;
          worker(items[cur], cur)
            .then((res) => (out[cur] = res))
            .catch(() => (out[cur] = null))
            .finally(() => {
              active--;
              if (i >= items.length && active === 0) resolve(out);
              else next();
            });
        }
      };
      next();
    });
  };

  const readCurrentPricesBeforeInsert = () => {
    const rows = mapRows();
    rows.forEach(({ id, row }) => {
      const tds = row.querySelectorAll('td'); // cột gốc chưa bị chèn
      const cell = tds[CONST.CURRENT_PRICE_COL_BASE];
      const val = cell ? num(cell.textContent) : NaN;
      currentPriceById[id] = isFinite(val) ? val : NaN;
    });
  };

  const init = async () => {
    if (initialized) return;
    const table = document.querySelector(`${CONST.WRAP} table`);
    if (!table) return;

    initialized = true;

    readCurrentPricesBeforeInsert();

    if (!columnsAdded) {
      addColumn(CONST.TI_COL,   CONST.TI_HEADER);
      addColumn(CONST.DIFF_COL, CONST.DIFF_HEADER);
      addColumn(CONST.XP_COL,   CONST.XP_HEADER);
      columnsAdded = true;
    }

    const items = mapRows();
    if (!items.length) return;

    await runPool(
      items,
      async ({ id, row }, idx) => {
        try {
          const data = await fetchPlayer(id);
          const oldAsi   = getOldASI(row);
          const tiVal    = TI.compute(data.asi, oldAsi, data.fp);
          const curPrice = currentPriceById[id]; // ✅ dùng giá đã đọc trước
          const diffVal  = priceDiff(data.asi, data.age, data.months, curPrice, data.fp);

          requestAnimationFrame(() => {
            writeCell(idx, CONST.TI_COL,   isFinite(tiVal) ? tiVal.toFixed(CONST.TI_PREC) : '-');
            writeCell(idx, CONST.DIFF_COL, isFinite(diffVal) ? formatCoin(diffVal, CONST.DIFF_PREC) : '-');
            writeCell(idx, CONST.XP_COL,   isFinite(data.xp) ? data.xp.toFixed(CONST.XP_PREC) : '-');
          });
        } catch {
          requestAnimationFrame(() => {
            writeCell(idx, CONST.TI_COL,   'Error');
            writeCell(idx, CONST.DIFF_COL, 'Error');
            writeCell(idx, CONST.XP_COL,   'Error');
          });
        }
      },
      CONST.CONCURRENCY
    );
  };

  const host = document.querySelector(CONST.WRAP);
  if (!host) return;

  const observer = new MutationObserver(() => init());
  observer.observe(host, { childList: true });

  init();
})();
