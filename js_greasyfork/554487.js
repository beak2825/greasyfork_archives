// ==UserScript==
// @name         MyFitnessPal Percentages & Net Carbs (No-Deps Modernized)
// @namespace    1337-server
// @version      2.0.0
// @description  Adds Net Carbs column (Carbs - Fiber), per-row macro %s, and daily pies without external libraries. Robust against MFP layout changes.
// @author       1337-server
// @match        https://www.myfitnesspal.com/food/diary*
// @match        http://www.myfitnesspal.com/food/diary*
// @match        https://www.myfitnesspal.com/food/diary.php*
// @match        http://www.myfitnesspal.com/food/diary.php*
// @license MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554487/MyFitnessPal%20Percentages%20%20Net%20Carbs%20%28No-Deps%20Modernized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554487/MyFitnessPal%20Percentages%20%20Net%20Carbs%20%28No-Deps%20Modernized%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Guard: run once ------------------------------------------------------
  if (document.documentElement.dataset.mfpNetCarbsApplied === '1') return;
  document.documentElement.dataset.mfpNetCarbsApplied = '1';

  // ---- Utilities -------------------------------------------------------------
  const num = (txt) => {
    if (txt == null) return NaN;
    const s = String(txt).replace(/[, ]+/g, '').trim();
    if (s === '' || s === '--') return NaN;
    // Handle “1.234,56” vs “1,234.56”
    // Prefer dot as decimal; strip thousands separators.
    const normalized = s.replace(/(\d)[,](\d{3}\b)/g, '$1$2').replace(',', '.');
    const v = parseFloat(normalized);
    return Number.isFinite(v) ? v : NaN;
  };

  const createEl = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'style') Object.assign(el.style, v);
      else el.setAttribute(k, v);
    }
    for (const child of [].concat(children)) {
      if (child == null) continue;
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return el;
  };

  const css = `
  .mfp-us-note{font-size:10px;line-height:1;margin-top:2px;color:#0a0;text-align:center;white-space:nowrap}
  .mfp-us-pies{display:flex;gap:16px;justify-content:center;align-items:flex-start;margin:16px 0;flex-wrap:wrap}
  .mfp-us-pie{border:1px solid #e5e5e5;border-radius:12px;padding:8px 12px}
  .mfp-us-pie h4{margin:6px 0 8px;font-size:14px;text-align:center}
  .mfp-us-pie svg{display:block}
  .mfp-us-bad{background: pink !important}
  `;
  const style = createEl('style', { type: 'text/css' }, css);
  document.head.appendChild(style);

  // ---- Find the diary table --------------------------------------------------
  // We try a few robust guesses that have survived multiple redesigns.
  const table =
    document.querySelector('.food_container table') ||
    document.querySelector('table.diary-table') ||
    document.querySelector('table[data-test="diary-table"]') ||
    document.querySelector('table'); // fallback

  if (!table) return; // give up silently if no table

  const rows = Array.from(table.querySelectorAll('tr'));
  if (!rows.length) return;

  // Try to locate the header row (meal_header or first row with recognizable labels)
  const headerRow =
    rows.find(r => r.classList.contains('meal_header')) ||
    rows.find(r => {
      const cells = Array.from(r.cells).map(td => td.textContent.trim().toLowerCase());
      return ['calories', 'carbs', 'fat', 'protein'].some(x => cells.includes(x));
    }) ||
    rows[0];

  const headerCells = Array.from(headerRow.cells);

  // Map column indices by header text
  const findCol = (name) => {
    const target = name.toLowerCase();
    let idx = headerCells.findIndex(td => td.textContent.trim().toLowerCase() === target);
    if (idx === -1) {
      // More lenient match (e.g., "Carbohydrates" or localized variations)
      idx = headerCells.findIndex(td => td.textContent.trim().toLowerCase().startsWith(target));
    }
    return idx;
  };

  let col = {
    calories: findCol('calories'),
    carbs: findCol('carbs'),
    fiber: findCol('fiber'),
    fat: findCol('fat'),
    protein: findCol('protein'),
  };

  // If we cannot find essential columns, bail.
  if (col.calories === -1 || col.carbs === -1 || col.fat === -1 || col.protein === -1) {
    // MFP layout too different—do nothing rather than breaking the page.
    return;
  }

  const insertNetCarbsBefore = col.carbs;

  // Insert a "Net Carbs" column before Carbs for all rows
  for (const r of rows) {
    const cells = Array.from(r.cells);
    // If this row has fewer cells than header, skip (e.g. ads/notes)
    if (!cells.length) continue;
    const ref = cells[insertNetCarbsBefore] || cells[cells.length - 1];
    const newTd = r === headerRow
      ? createEl('th', {}, 'Net Carbs')
      : createEl('td', {});
    r.insertBefore(newTd, ref);
  }

  // Recompute column indices after insertion
  const shift = (idx) => (idx >= insertNetCarbsBefore ? idx + 1 : idx);
  const NET = insertNetCarbsBefore;
  col = {
    net: NET,
    calories: shift(col.calories),
    carbs: shift(col.carbs),
    fiber: col.fiber === -1 ? -1 : shift(col.fiber),
    fat: shift(col.fat),
    protein: shift(col.protein),
  };

  // Style header cell similar to MFP "alt" headers if present
  const headerNet = headerRow.cells[col.net];
  headerNet.textContent = 'Net Carbs';
  headerNet.classList.add('alt');

  // Try to find footer rows we’ll want to label/adjust
  const tfootRow = table.querySelector('tfoot tr');
  if (tfootRow && tfootRow.cells[col.net]) {
    const c = tfootRow.cells[col.net];
    c.textContent = 'Net Carbs';
    c.classList.add('alt');
  }

  // ---- Iterate rows to compute per-row values & accumulate totals -----------
  let daily = {
    carbCals: 0,
    proteinCals: 0,
    fatCals: 0,
    netCarbGrams: 0,
    goalNetCarbs: NaN, // from "Goals" row if present
  };

  // Helper: detect totals/remaining/goal rows by class or content
  const isTotalRow = (r) => r.classList.contains('total') || /total/i.test(r.className);
  const isRemainingRow = (r) => r.classList.contains('remaining') || /remaining/i.test(r.className);
  const isGoalRow = (r) => r.classList.contains('alt') && isTotalRow(r);

  // Walk all rows
  for (const r of rows) {
    const cells = Array.from(r.cells);
    if (!cells.length) continue;

    // Identify meal/food rows: often the last cell is a delete cell or contains an "Add Food" link.
    const lastCell = cells[cells.length - 1];
    const looksLikeFoodRow =
      lastCell.classList.contains('delete') ||
      r.classList.contains('meal_food') ||
      r.matches('.meal_food, tr[id^="entry_"]') ||
      (!!lastCell.querySelector('a[href*="delete"]')) ||
      (!!r.querySelector('a[href*="food"]') && !isTotalRow(r) && !isRemainingRow(r));

    const cals = num(cells[col.calories]?.textContent);
    const carbs = num(cells[col.carbs]?.textContent);
    const fiber = col.fiber === -1 ? NaN : num(cells[col.fiber]?.textContent);
    const protein = num(cells[col.protein]?.textContent);
    const fat = num(cells[col.fat]?.textContent);

    // Compute net carbs when possible
    let netCarbs = carbs;
    if (!Number.isNaN(fiber)) {
      netCarbs = carbs - fiber;
    }
    // Write Net Carbs value for food and total rows (skip headers)
    if (cells[col.net] && r !== headerRow) {
      cells[col.net].textContent = Number.isFinite(netCarbs) ? String(netCarbs) : '';
    }

    // Highlight impossible (negative) net carbs
    if (looksLikeFoodRow && Number.isFinite(netCarbs) && netCarbs < 0) {
      r.classList.add('mfp-us-bad');
      const warn = createEl('td', { class: 'mfp-us-bad' }, 'Bad data, negative net carbs!');
      r.appendChild(warn);
    }

    // For goal row, capture goal net carbs if present in the original carbs column
    if (isGoalRow(r)) {
      const goalNC = netCarbs; // because our Net column equals carbs − fiber or carbs if no fiber
      if (Number.isFinite(goalNC)) daily.goalNetCarbs = goalNC;
    }

    // For the first non-alt total row, capture daily totals by calories
    const isPrimaryTotals = isTotalRow(r) && !isGoalRow(r) && !isRemainingRow(r);
    if (isPrimaryTotals) {
      const carbCals = Number.isFinite(netCarbs) ? netCarbs * 4 : 0;
      const proteinCals = Number.isFinite(protein) ? protein * 4 : 0;
      const fatCals = Number.isFinite(fat) ? fat * 9 : 0;

      if (daily.carbCals === 0 && daily.proteinCals === 0 && daily.fatCals === 0) {
        daily.carbCals = carbCals;
        daily.proteinCals = proteinCals;
        daily.fatCals = fatCals;
        daily.netCarbGrams = Number.isFinite(netCarbs) ? netCarbs : 0;
      }
    }

    // Add per-row macro % notes where meaningful
    const canCalcRow =
      Number.isFinite(cals) &&
      cals > 0 &&
      Number.isFinite(netCarbs) &&
      Number.isFinite(protein) &&
      Number.isFinite(fat);

    if (canCalcRow) {
      const carbCals = netCarbs * 4;
      const proteinCals = protein * 4;
      const fatCals = fat * 9;
      const realCals = carbCals + proteinCals + fatCals;
      if (realCals > 0) {
        const pct = {
          carbs: Math.round((carbCals / realCals) * 100),
          fat: Math.round((fatCals / realCals) * 100),
          protein: Math.round((proteinCals / realCals) * 100),
        };
        // Append a tiny note area to relevant cells
        const ensureNote = (td) => {
          let div = td.querySelector('.mfp-us-note');
          if (!div) {
            div = createEl('div', { class: 'mfp-us-note' }, '\u00A0');
            td.appendChild(div);
          }
          return div;
        };
        if (cells[col.net]) ensureNote(cells[col.net]).textContent = `${pct.carbs}%`;
        if (cells[col.fat]) ensureNote(cells[col.fat]).textContent = `${pct.fat}%`;
        if (cells[col.protein]) ensureNote(cells[col.protein]).textContent = `${pct.protein}%`;
      }
    }
  }

  // ---- Adjust "Remaining" row for Net Carbs coloring/value ------------------
  const remainingRow = rows.find(r => isRemainingRow(r));
  if (remainingRow && Number.isFinite(daily.goalNetCarbs)) {
    const remCells = Array.from(remainingRow.cells);
    const netCell = remCells[col.net];
    if (netCell) {
      const remaining = daily.goalNetCarbs - daily.netCarbGrams;
      netCell.textContent = String(Math.trunc(remaining));
      netCell.classList.remove('positive', 'negative');
      netCell.classList.add(remaining < 0 ? 'negative' : 'positive');
    }
  }

  // ---- Render inline SVG pies (no external deps) ----------------------------
  const hasTotals = daily.carbCals + daily.proteinCals + daily.fatCals > 0;
  if (!hasTotals) return;

  const grams = {
    carbs: daily.carbCals / 4,
    protein: daily.proteinCals / 4,
    fat: daily.fatCals / 9,
  };

  const pieContainer = createEl('div', { class: 'mfp-us-pies' });

  const makePie = (entries, title, labelsSuffixFn) => {
    const total = entries.reduce((a, b) => a + b.value, 0);
    const size = 180, r = 80, cx = 90, cy = 90; // simple square SVG
    let start = 0;
    const svg = createEl('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}` });

    entries.forEach((seg, i) => {
      const val = seg.value;
      const angle = total > 0 ? (val / total) * 2 * Math.PI : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const end = start + angle;
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const largeArc = angle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${cx} ${cy}`,
        `L ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Let browser pick colors (no explicit colors to keep it simple)
      const path = createEl('path', { d: pathData });
      svg.appendChild(path);

      start = end;
    });

    // Legend
    const legend = createEl('div');
    entries.forEach(seg => {
      const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
      const label = `${seg.name}${labelsSuffixFn ? labelsSuffixFn(seg) : ''}: ${pct}%`;
      legend.appendChild(createEl('div', {}, label));
    });

    const wrap = createEl('div', { class: 'mfp-us-pie' }, [
      createEl('h4', {}, title),
      svg,
      legend
    ]);
    return wrap;
  };

  const piesWrap = createEl('div', { class: 'mfp-us-pies' });

  piesWrap.appendChild(
    makePie(
      [
        { name: 'Net Carbs', value: daily.carbCals },
        { name: 'Protein', value: daily.proteinCals },
        { name: 'Fat', value: daily.fatCals },
      ],
      'Daily Totals by Calories',
      null
    )
  );

  piesWrap.appendChild(
    makePie(
      [
        { name: `Net Carbs (${Math.round(grams.carbs)}g)`, value: grams.carbs },
        { name: `Protein (${Math.round(grams.protein)}g)`, value: grams.protein },
        { name: `Fat (${Math.round(grams.fat)}g)`, value: grams.fat },
      ],
      'Daily Totals by Grams',
      null
    )
  );

  // Append pies after the table container if available, else after table
  const container = document.querySelector('.food_container') || table.parentElement || table;
  container.appendChild(piesWrap);
})();
