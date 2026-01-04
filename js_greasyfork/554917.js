// ==UserScript==
// @name         E2-Simulator: export + sum line + phase shift + URL sync + schedule (v1.9.0)
// @namespace    FalineDoe
// @homepage     https://t.me/my_beloved_and_sweet_doe
// @version      1.9.0
// @description  Wide CSV, pink SUM, per-trace phase shifts (persist + URL), safe canvas-restore, schedule export (6 months), "apply phases", and NEW: real-calendar schedule until first repeat with 4-day merge.
// @license      MIT
// @match        https://transfemscience.github.io/injectable-e2-simulator/*
// @match        https://transfemscience.github.io/injectable-e2-simulator/advanced/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554917/E2-Simulator%3A%20export%20%2B%20sum%20line%20%2B%20phase%20shift%20%2B%20URL%20sync%20%2B%20schedule%20%28v190%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554917/E2-Simulator%3A%20export%20%2B%20sum%20line%20%2B%20phase%20shift%20%2B%20URL%20sync%20%2B%20schedule%20%28v190%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SUM_LABEL = 'Модель цикла E2 (сумма серий)';
  const precision = 2;
  const tolerance = Math.pow(10, -precision) * 1.1;
  const csvBOM = '\uFEFF';
  const roundX = x => Number(Number(x).toFixed(precision));
  const MONTH_DAYS = 30;          // для 6м шаблонов (оставляем как было в v1.8.4)
  const SIM_RANGE_DAYS = 180;     // 6 месяцев (для старой кнопки)
  const MERGE_WITHIN_DAYS = 4;    // объединение дат при экспорте «до повтора»
  const MAX_YEARS = 5;            // максимум симуляции для «до повтора»

  console.log('[E2] v1.9.0 — жду график…');

  // ---------- boot ----------
  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    const container = document.getElementById('graph-container') ||
                      document.getElementById('graph-canvas')?.parentElement;
    const ctxWin = container?.ownerDocument?.defaultView;
    const g = ctxWin?.graph;
    if (g && g.data && Array.isArray(g.data.datasets)) {
      clearInterval(timer);
      mainInit(ctxWin);
    }
    if (tries > 120) { clearInterval(timer); console.warn('[E2] график не найден'); }
  }, 300);

  function mainInit(ctxWin) {
    const container = document.getElementById('graph-container') ||
                      document.getElementById('graph-canvas')?.parentElement;
    addButtons(container, ctxWin);
    addPhaseShiftUI();
    observeRowsTableForUI();
    initPhaseShiftHandler(ctxWin);
    applyPhaseFromURL(ctxWin);
    patchShareButton(ctxWin);
    observeCanvasRecreate(ctxWin);
    console.log('[E2] готово');
  }

  // ---------- helpers ----------
  const toRGB = css => {
    const el = document.createElement('div'); el.style.color = css; document.body.appendChild(el);
    const c = getComputedStyle(el).color; document.body.removeChild(el);
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return m ? `rgb(${m[1]}, ${m[2]}, ${m[3]})` : css;
  };

  const getDatasetForRow = (ctxWin, row) => {
    const circ = row.querySelector('.circle');
    if (!circ) return null;
    const target = toRGB(getComputedStyle(circ).borderColor);
    return ctxWin.graph.data.datasets.find(
      d => toRGB(d.borderColor || d.backgroundColor || '') === target
    ) || null;
  };

  const estimateStepX = ds => {
    const xs = (ds.data || []).map(p => +p.x).sort((a, b) => a - b);
    const diffs = [];
    for (let i = 1; i < xs.length; i++) {
      const d = xs[i] - xs[i - 1];
      if (isFinite(d) && d > 0) diffs.push(d);
    }
    diffs.sort((a, b) => a - b);
    return diffs.length ? diffs[Math.floor(diffs.length / 2)] : 0.25;
  };

  const applyRotationFromBaseline = (ds, shiftDaysAbs) => {
    if (!ds._phase) {
      ds._phase = { baseline: (ds.data || []).map(p => ({ x:+p.x, y:+p.y })), stepX: estimateStepX(ds) };
    }
    const base = ds._phase.baseline;
    const stepX = ds._phase.stepX || estimateStepX(ds);
    const k = Math.round(shiftDaysAbs / stepX);
    const n = base.length;
    if (!n) return;
    const ys = base.map(p => p.y);
    const kk = ((k % n) + n) % n;
    const ys2 = (k > 0) ? ys.slice(-kk).concat(ys.slice(0, -kk)) : ys.slice(kk).concat(ys.slice(0, kk));
    ds.data = base.map((p, i) => ({ x: p.x, y: ys2[i] }));
    ds._phase.lastDays = k;
  };

  const UNIT_K = { days: 1, weeks: 7, months: 28 }; // как в симе
  const getRows = () => Array.from(document.querySelectorAll('#rows-table tr[id^="row"]'));

  function readRowParams(row) {
    const id = row.id.replace('row','');
    const ester = row.querySelector(`#ester${id}`)?.value || 'ec_o';
    const dose = parseFloat(row.querySelector(`#dose${id}`)?.value || '0');
    const repeated = !!row.querySelector(`#repeated-administration${id}`)?.checked;
    const intervalVal = parseFloat(row.querySelector(`#dose-interval${id}`)?.value || '0');
    const intervalUnit = row.querySelector(`#dose-interval-units${id}`)?.value || 'days';
    const intervalDays = intervalVal * (UNIT_K[intervalUnit] || 1);
    const doseLimit = (row.querySelector(`#dose-limit${id}`)?.value || '') || null;
    const steady = !!row.querySelector(`#steady-state${id}`)?.checked;
    const phase = Math.round(parseFloat(row.querySelector('.phase-shift-field')?.value || '0') || 0);
    return { id, ester, dose, repeated, intervalDays, doseLimit, steady, phase };
  }

  // ---------- canvas observer (restore phases + SUM) ----------
  function observeCanvasRecreate(ctxWin) {
    const root = document.getElementById('graph-container')?.parentElement || document.body;
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        if ([...m.addedNodes].some(n => n.tagName === 'CANVAS')) {
          setTimeout(() => {
            try {
              addPhaseShiftUI();
              restorePhasesFromCache(ctxWin);
              const g = ctxWin?.graph;
              if (g && g.ctx && (g.data.datasets || []).some(d => d.label === SUM_LABEL)) addSumLine(g);
              try { g.update(); } catch {}
            } catch (e) { console.warn('[E2] restore after canvas err', e); }
          }, 450);
        }
      }
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function restorePhasesFromCache(ctxWin) {
    if (!window._phaseCache) return;
    const rows = document.querySelectorAll('#rows-table tr[id^="row"]');
    rows.forEach(r => {
      const ds = getDatasetForRow(ctxWin, r);
      const input = r.querySelector('.phase-shift-field');
      if (!ds) return;
      const key = ds.label || toRGB(ds.borderColor);
      const saved = window._phaseCache[key];
      if (typeof saved === 'number' && !isNaN(saved)) {
        if (input) input.value = String(saved);
        applyRotationFromBaseline(ds, saved);
      }
    });
  }

  // ---------- UI: кнопки ----------
  function addButtons(container, ctxWin) {
    ['btn-export-widecsv','btn-sum-e2','btn-apply-phases','btn-export-schedule','btn-export-until-repeat']
      .forEach(id => document.getElementById(id)?.remove());

    const styleBtn = 'margin:6px;padding:6px 10px;border-radius:6px;border:1px solid #888;background:#fff;cursor:pointer';

    const exportBtn = document.createElement('button');
    exportBtn.id = 'btn-export-widecsv';
    exportBtn.textContent = 'Выгрузить WIDE CSV (с отладкой)';
    exportBtn.style.cssText = styleBtn;
    exportBtn.onclick = () => exportWideCSV(ctxWin.graph);

    const sumBtn = document.createElement('button');
    sumBtn.id = 'btn-sum-e2';
    sumBtn.textContent = 'Добавить линию: модель цикла E2';
    sumBtn.style.cssText = styleBtn;
    sumBtn.onclick = () => addSumLine(ctxWin.graph);

    const applyBtn = document.createElement('button');
    applyBtn.id = 'btn-apply-phases';
    applyBtn.textContent = 'Учесть фазы (пересчитать кривые)';
    applyBtn.style.cssText = styleBtn;
    applyBtn.onclick = () => applyAllPhasesAndRefresh(ctxWin);

    const schedBtn = document.createElement('button');
    schedBtn.id = 'btn-export-schedule';
    schedBtn.textContent = 'Выгрузить расписание (6 мес)';
    schedBtn.style.cssText = styleBtn;
    schedBtn.onclick = () => exportScheduleHuman(ctxWin);

    const repeatBtn = document.createElement('button');
    repeatBtn.id = 'btn-export-until-repeat';
    repeatBtn.textContent = 'Выгрузить расписание (до повтора)';
    repeatBtn.style.cssText = styleBtn;
    repeatBtn.onclick = () => exportScheduleUntilRepeat(ctxWin);

    container.insertBefore(repeatBtn, container.firstChild);
    container.insertBefore(schedBtn, container.firstChild);
    container.insertBefore(applyBtn, container.firstChild);
    container.insertBefore(sumBtn, container.firstChild);
    container.insertBefore(exportBtn, container.firstChild);
  }

  // ---------- Phase UI (и перенос столбца) ----------
  function addPhaseShiftUI() {
    const table = document.querySelector('#rows-table'); if (!table) return;
    const head = table.querySelector('tr:first-child');
    if (head && !head.querySelector('#phase-shift-header')) {
      const td = document.createElement('td'); td.id = 'phase-shift-header'; td.innerHTML = '<span>Phase shift (days)</span>';
      head.appendChild(td);
      const pad = document.createElement('td'); pad.innerHTML = '&nbsp;'; head.appendChild(pad);
    }
    getRows().forEach(row => {
      if (row.id === 'default-row') return;
      let field = row.querySelector('.phase-shift-field');
      if (!field) {
        const td = document.createElement('td');
        field = document.createElement('input');
        field.type = 'number'; field.min = '-84'; field.max = '84'; field.step = '1'; field.placeholder = '0';
        field.className = 'phase-shift-field'; field.style.width = '70px'; field.style.textAlign = 'center';
        td.appendChild(field);
        row.appendChild(td);
      }
      // переместить перед Clone/Delete
      const cloneTd = row.querySelector('.clone-row')?.parentElement;
      if (cloneTd && field.parentElement.nextSibling !== cloneTd) {
        row.insertBefore(field.parentElement, cloneTd);
      }
    });
  }

  function observeRowsTableForUI() {
    const container = document.querySelector('#rows-container'); if (!container) return;
    const rebuilder = new MutationObserver(() => addPhaseShiftUI());
    rebuilder.observe(container, { childList: true, subtree: true });
  }

  // ---------- Phase input logic + URL sync ----------
  function initPhaseShiftHandler(ctxWin) {
    const container = document.querySelector('#rows-container');
    if (!container || !ctxWin?.graph) return;
    window._phaseCache = window._phaseCache || {};

    const onInput = e => {
      const t = e.target;
      if (!t.classList.contains('phase-shift-field')) return;
      const raw = (t.value || '').toString().replace(',', '.');
      const targetDays = Math.round(parseFloat(raw));
      if (!isFinite(targetDays)) return;
      const row = t.closest('tr'); const ds = getDatasetForRow(ctxWin, row);
      if (!ds || ds.trace_type === 'cis-cycle') return;
      applyRotationFromBaseline(ds, targetDays);
      const key = ds.label || toRGB(ds.borderColor); window._phaseCache[key] = targetDays;
      updateShareURL(ctxWin);
      try { ctxWin.graph.update(); } catch {}
      if ((ctxWin.graph.data.datasets||[]).some(d=>d.label===SUM_LABEL)) addSumLine(ctxWin.graph);
    };

    container.addEventListener('input', onInput, true);
    container.addEventListener('change', onInput, true);
  }

  function applyPhaseFromURL(ctxWin) {
    const params = new URLSearchParams(location.search);
    const phases = [];
    for (const [k,v] of params.entries()) {
      const m = k.match(/^ph(\d+)$/i); if (m) phases[+m[1]] = parseFloat(v);
    }
    if (!phases.length) return;
    const rows = document.querySelectorAll('#rows-table tr[id^="row"]');
    rows.forEach((r, idx) => {
      const ds = getDatasetForRow(ctxWin, r); const input = r.querySelector('.phase-shift-field');
      const val = phases[idx + 1]; if (!ds || !input || isNaN(val)) return;
      input.value = String(Math.round(val)); applyRotationFromBaseline(ds, val);
      window._phaseCache[ds.label || toRGB(ds.borderColor)] = Math.round(val);
    });
    try { ctxWin.graph.update(); } catch {}
  }

  function updateShareURL(ctxWin) {
    try {
      const base = new URL(ctxWin.location.href);
      const params = new URLSearchParams(base.search);
      [...params.keys()].forEach(k => { if (/^ph\d+$/i.test(k)) params.delete(k); });
      const keys = Object.keys(window._phaseCache || {});
      keys.forEach((k, i) => { params.set(`ph${i + 1}`, window._phaseCache[k]); });
      window._lastShareUrl = `${base.origin}${base.pathname}?${params.toString()}`;
    } catch (e) { console.warn('[E2] Share URL update error', e); }
  }

  function patchShareButton(ctxWin) {
    const btn = document.querySelector('#share-button') || document.querySelector('input[value="Share"]');
    if (!btn) { console.warn('[E2] Share button not found'); return; }
    btn.addEventListener('click', () => {
      setTimeout(() => {
        if (window._lastShareUrl) {
          navigator.clipboard.writeText(window._lastShareUrl).catch(()=>{});
        } else { updateShareURL(ctxWin); }
      }, 150);
    });
  }

  // ---------- Apply phases: прочитать поля и освежить график ----------
  function applyAllPhasesAndRefresh(ctxWin) {
    const rows = getRows();
    rows.forEach(r => {
      const ds = getDatasetForRow(ctxWin, r); if (!ds || ds.trace_type === 'cis-cycle') return;
      const v = Math.round(parseFloat(r.querySelector('.phase-shift-field')?.value || '0') || 0);
      applyRotationFromBaseline(ds, v);
      const key = ds.label || toRGB(ds.borderColor); (window._phaseCache ||= {})[key] = v;
    });
    try { ctxWin.graph.update(); } catch {}
    if ((ctxWin.graph.data.datasets||[]).some(d=>d.label===SUM_LABEL)) addSumLine(ctxWin.graph);
    updateShareURL(ctxWin);
    console.log('[E2] фазы применены и график обновлён');
  }

  // ---------- Sum line ----------
  function addSumLine(graph) {
    try {
      const datasets = graph.data.datasets.filter(ds => ds.trace_type !== 'cis-cycle' && ds.label !== SUM_LABEL);
      if (!datasets.length) return;
      const allX = new Set();
      datasets.forEach(ds => (ds.data || []).forEach(pt => pt && isFinite(pt.x) && allX.add(roundX(pt.x))));
      const X = [...allX].sort((a, b) => a - b);
      const maps = datasets.map(ds => {
        const m = new Map();
        (ds.data || []).forEach(pt => { if (isFinite(pt.x) && isFinite(pt.y)) m.set(roundX(pt.x), pt.y); });
        return m;
      });
      const sumPoints = X.map(x => {
        let s=0, ok=false; maps.forEach(m => { const y=m.get(x); if (isFinite(y)) { s+=y; ok=true; } });
        return ok ? {x, y:s} : null;
      }).filter(Boolean);
      const sumDataset = {
        label: SUM_LABEL, borderWidth:3, borderColor:'#ffb3de',
        backgroundColor:'rgba(255,179,222,0.25)', pointRadius:0, fill:false,
        data: sumPoints, trace_type:'sum', order:-1
      };
      const i = graph.data.datasets.findIndex(d => d.label === SUM_LABEL);
      if (i >= 0) graph.data.datasets.splice(i, 1, sumDataset); else graph.data.datasets.push(sumDataset);
      try { graph.update(); } catch {}
    } catch(e){ console.error('[E2] sum error', e); }
  }

  // ---------- Export WIDE CSV ----------
  function exportWideCSV(graph) {
    try {
      const datasets = graph.data.datasets;
      const allX = new Set();
      datasets.forEach(ds => (ds.data || []).forEach(pt => pt && isFinite(pt.x) && allX.add(roundX(pt.x))));
      const X = [...allX].sort((a, b) => a - b);
      const idx = datasets.map((ds, i) => ({
        label: ds.label || `ds_${i}`,
        arr: (ds.data || []).map(p => ({ x: +p.x, y: +p.y })).sort((a, b) => a.x - b.x),
      }));
      const near = (arr, x) => {
        if (!arr.length) return null;
        let lo=0, hi=arr.length-1;
        while (lo<=hi){ const m=(lo+hi)>>1; if (arr[m].x===x) return arr[m]; arr[m].x<x ? (lo=m+1):(hi=m-1); }
        const c=[arr[lo],arr[hi]].filter(Boolean).sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x));
        return c[0];
      };
      let csv = csvBOM + 'День;' + idx.map(d => `"${d.label.replace(/"/g,'""')} (пг/мл)"`).join(';') + '\n';
      X.forEach(x => {
        const day = x.toFixed(2).replace('.', ','); const row=[day];
        idx.forEach(d => { const n=near(d.arr,x); let v=n && isFinite(n.y) && Math.abs(n.x-x)<=tolerance ? n.y.toFixed(2):''; row.push(v.replace('.',',')); });
        csv += row.join(';') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'estradiol_wide_pgml.csv'; a.click();
    } catch(e){ console.error('[E2] export error', e); }
  }

  // ---------- Schedule (6 месяцев, odd/even шаблоны — как в 1.8.4) ----------
  function exportScheduleHuman(ctxWin) {
    const rows = getRows();
    if (!rows.length) return alert('Нет серий для расписания');

    const blocks = [];
    rows.forEach(row => {
      const p = readRowParams(row);
      if (!p.repeated || !isFinite(p.intervalDays) || p.intervalDays <= 0) return;

      // старт с фазы, шаг интервала, до 180 дн
      let day = ((p.phase % p.intervalDays) + p.intervalDays) % p.intervalDays;
      const ev = [];
      while (day <= SIM_RANGE_DAYS) { ev.push(Math.round(day)); day += p.intervalDays; }

      const oddDays = new Set();
      const evenDays = new Set();
      for (const d of ev) {
        const monthIndex = Math.floor(d / MONTH_DAYS) + 1; // 1..6
        const dom = (d % MONTH_DAYS) + 1;                  // 1..30
        (monthIndex % 2 ? oddDays : evenDays).add(dom);
      }

      const pretty = arr => Array.from(arr).sort((a,b)=>a-b).join(', ');
      const ds = getDatasetForRow(ctxWin, row);
      const label = ds?.label || `Estradiol ${p.ester} ${p.dose} mg/${p.intervalDays} days`;
      blocks.push(
        `${label}\nпериод=${p.intervalDays}, сдвиг=${p.phase}\n` +
        `нечётные: ${pretty(oddDays) || '—'}\n` +
        `чётные: ${pretty(evenDays) || '—'}\n`
      );
    });

    if (!blocks.length) return alert('Нечего выгружать (проверь фазы/периоды).');

    const text = blocks.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'estradiol_schedule_6m.txt';
    a.click();
    console.log('[E2] schedule (6m) exported');
  }

  // ---------- NEW: Schedule until first repeat (real calendar + merge ≤4d) ----------
  function exportScheduleUntilRepeat(ctxWin) {
    const rows = getRows();
    if (!rows.length) return alert('Нет серий для расписания');

    // читаем параметры серий
    const series = rows.map(r => readRowParams(r))
      .filter(p => p.repeated && isFinite(p.intervalDays) && p.intervalDays > 0 && isFinite(p.dose) && p.dose > 0);

    if (!series.length) return alert('Нечего выгружать (серии не заданы).');

    const start = new Date(); // реальная текущая дата
    start.setHours(12,0,0,0); // середина дня, чтобы избежать переходов TZ
    const endLimit = new Date(start.getTime());
    endLimit.setDate(endLimit.getDate() + MAX_YEARS * 365 + Math.floor(MAX_YEARS / 4)); // ~с учётом високосных

    // генерим события по сериям (с учётом фазового сдвига в днях)
    const events = [];
    for (const s of series) {
      const first = new Date(start.getTime());
      first.setDate(first.getDate() + s.phase);
      first.setHours(12,0,0,0);

      // если есть limit доз — можно учесть, но в симе часто steady-state; тут просто по периоду
      let d = new Date(first.getTime());
      while (d <= endLimit) {
        events.push({ date: new Date(d.getTime()), dose: s.dose }); // храним только мг (как в твоих примерах)
        d = new Date(d.getTime());
        d.setDate(d.getDate() + s.intervalDays);
      }
    }

    if (!events.length) return alert('Нет событий для расписания.');

    // сортируем по дате
    events.sort((a,b) => a.date - b.date);

    // объединяем всё, что ближе/равно MERGE_WITHIN_DAYS
    const buckets = [];
    for (const ev of events) {
      const last = buckets[buckets.length - 1];
      if (last && Math.abs(daysDiff(last.date, ev.date)) <= MERGE_WITHIN_DAYS) {
        last.doses.push(ev.dose);
        // дата «якоря» оставляем прежней (самая ранняя)
      } else {
        buckets.push({ date: ev.date, doses: [ev.dose] });
      }
    }

    // делаем месячные подписи (для повтора сравниваем месячные сигнатуры)
    const monthSig = buildMonthlySignatures(buckets);

    // ищем первый повтор сигнатур (период P месяцев)
    // проверяем P=1..24, и находим первое место, где последние P месяцев == предыдущие P
    let cutMonths = monthSig.length; // по умолчанию — всё до лимита
    for (let P = 1; P <= Math.min(24, monthSig.length >> 1); P++) {
      for (let m = P*2; m <= monthSig.length; m++) {
        const a = monthSig.slice(m - 2*P, m - P).join('|');
        const b = monthSig.slice(m - P, m).join('|');
        if (a === b) {
          cutMonths = m - P; // берём до начала второй пачки
          P = 99; // прерываем внешний
          break;
        }
      }
      if (cutMonths !== monthSig.length) break;
    }

    // оставляем события только до конца cutMonths
    const cutDateExclusive = endOfMonthFromSigIndex(start, cutMonths - 1); // конец месяца cutMonths-1
    const finalBuckets = buckets.filter(b => b.date <= cutDateExclusive);

    // форматируем вывод
    const fmtDate = d => {
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
      return `${dd}.${mm}`; // без года, как обсуждали
    };
    const lines = [];
    lines.push(`📅 Расписание до повтора цикла (старт: ${formatFullDate(start)})`);
    lines.push('');
    finalBuckets.forEach(b => {
      const doses = b.doses.sort((x,y)=>x-y).join('+') + ' мг';
      lines.push(`${fmtDate(b.date)} — ${doses}`);
    });

    const totalDays = Math.round((finalBuckets.at(-1)?.date - start) / 86400000) || 0;
    if (cutMonths !== monthSig.length) {
      lines.push('');
      lines.push(`🔁 Полный повтор ≈ через ${totalDays} дн`);
    }

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'estradiol_schedule_cycle.txt';
    a.click();
    console.log('[E2] schedule (until repeat) exported');
  }

  function daysDiff(a, b) {
    const aa = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((bb - aa) / 86400000);
  }

  function buildMonthlySignatures(buckets) {
    // сигнатура месяца: `${YYYY}-${MM}:${sorted list of DD:[dosesSorted]}`
    const map = new Map();
    for (const b of buckets) {
      const y = b.date.getFullYear(), m = b.date.getMonth()+1;
      const key = `${y}-${String(m).padStart(2,'0')}`;
      if (!map.has(key)) map.set(key, []);
      const dd = String(b.date.getDate()).padStart(2,'0');
      const doses = b.doses.slice().sort((x,y)=>x-y).join('+');
      map.get(key).push(`${dd}:${doses}`);
    }
    const out = [];
    // сортируем по дате ключи
    const keys = Array.from(map.keys()).sort((a,b) => {
      const [ay,am] = a.split('-').map(Number);
      const [by,bm] = b.split('-').map(Number);
      return ay===by ? am-bm : ay-by;
    });
    keys.forEach(k => {
      const arr = map.get(k).sort();
      out.push(`${k}|${arr.join(',')}`);
    });
    return out;
  }

  function endOfMonthFromSigIndex(startDate, sigIndex) {
    // sigIndex = 0 → месяц startDate; 1 → следующий и т.д.
    const d = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    d.setMonth(d.getMonth() + sigIndex + 1); // 1-е число месяца после нужного
    d.setDate(0); // последний день предыдущего
    d.setHours(23,59,59,999);
    return d;
  }

  function formatFullDate(d) {
    const dd = String(d.getDate()).padStart(2,'0');
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }

})();
