// ==UserScript==
// @name         通用表格排序/筛选/导出（Excel风格）
// @namespace    table.tools.universal.excel.like
// @version      1.0.0
// @description  为任意网页表格提供排序、筛选、全局搜索与CSV导出。自动识别文本/数值/日期列，多表选择，三态排序，联合筛选，导出当前可见行。
// @author       Frankie
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT License with Attribution
// @downloadURL https://update.greasyfork.org/scripts/552938/%E9%80%9A%E7%94%A8%E8%A1%A8%E6%A0%BC%E6%8E%92%E5%BA%8F%E7%AD%9B%E9%80%89%E5%AF%BC%E5%87%BA%EF%BC%88Excel%E9%A3%8E%E6%A0%BC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/552938/%E9%80%9A%E7%94%A8%E8%A1%A8%E6%A0%BC%E6%8E%92%E5%BA%8F%E7%AD%9B%E9%80%89%E5%AF%BC%E5%87%BA%EF%BC%88Excel%E9%A3%8E%E6%A0%BC%EF%BC%89.meta.js
// ==/UserScript==
 
// Additional clause:
// 1. Any redistribution or modification must retain the original donation link and cannot remove or modify it.

(function () {
  'use strict';

  // ============ 样式 ============
  GM_addStyle(`
    .tt-btn {
      position: fixed; z-index: 999999; top: 14px; right: 14px;
      padding: 8px 12px; border-radius: 10px; cursor: pointer;
      border: 1px solid rgba(0,0,0,0.12); background: #fff; font-weight: 600;
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
      font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    }
    .tt-panel {
      position: fixed; z-index: 1000000; top: 64px; right: 14px;
      width: min(1100px, 96vw); max-height: 80vh; overflow: auto;
      background: #fff; border: 1px solid rgba(0,0,0,0.12); border-radius: 12px;
      box-shadow: 0 10px 26px rgba(0,0,0,0.12);
      padding: 14px; font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
    }
    .tt-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 10px; }
    .tt-row .span1{ grid-column: span 1; }
    .tt-row .span2{ grid-column: span 2; }
    .tt-row .span3{ grid-column: span 3; }
    .tt-row .span4{ grid-column: span 4; }
    .tt-row .span6{ grid-column: span 6; }
    .tt-panel input, .tt-panel select, .tt-panel button, .tt-panel label {
      padding: 6px 8px; border: 1px solid #ddd; border-radius: 8px; background: #fafafa; width: 100%;
      box-sizing: border-box;
    }
    .tt-panel button { cursor: pointer; }
    .tt-muted { opacity: .7; border: 0; background: transparent; padding: 0; }
    .tt-tagbar { display:flex; flex-wrap: wrap; gap: 6px; }
    .tt-tag { padding: 4px 8px; border-radius: 999px; border: 1px solid #ddd; background: #f8f8f8; cursor: pointer; user-select: none; }
    .tt-tag.active { background: #1a73e8; color: #fff; border-color: #1a73e8; }

    .tt-table { width:100%; border-collapse: collapse; font-size: 12px; }
    .tt-table th, .tt-table td { padding: 6px 8px; border-bottom: 1px solid #eee; text-align: left; }
    .tt-table thead th { position: sticky; top: 0; background: #fafafa; }
    .tt-right { text-align: right; }

    .tt-chip { display:inline-block; padding:2px 6px; border-radius:999px; background:#f5f5f5; font-size:11px; border:1px solid #eee; }
    .tt-hint { font-size: 12px; color: #666; }
    .tt-colbox { border:1px solid #eee; border-radius:8px; padding:8px; background:#fcfcfc; }
    .tt-flex { display:flex; gap:8px; align-items:center; }
    .tt-col-grid { display:grid; grid-template-columns: repeat(12, 1fr); gap:6px; }
    .tt-col-grid > div { grid-column: span 4; }
    .tt-col-grid .wide { grid-column: span 12; }
  `);

  // ============ 工具 ============
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const isNum = (v) => /^-?\d+(?:\.\d+)?$/.test(String(v).trim().replace(/,/g,''));
  const toNum = (v) => Number(String(v).trim().replace(/,/g,''));
  const isDateLike = (s) => !isNaN(Date.parse(s));
  const cmp = (a,b) => (a<b?-1:(a>b?1:0));

  function detectType(samples) {
    // 简单启发式：多数样本是数值 => number；多数是可解析日期 => date；否则 text
    let n=0, d=0, t=0;
    for (const s of samples) {
      const v = (s??'').toString().trim();
      if (!v) { t++; continue; }
      if (isNum(v)) n++; else if (isDateLike(v)) d++; else t++;
    }
    if (n >= d && n >= t) return 'number';
    if (d >= n && d >= t) return 'date';
    return 'text';
  }

  function getText(el) {
    return (el?.textContent || '').replace(/\s+/g,' ').trim();
  }

  function uniqueValues(arr, limit=2000) {
    const set = new Set();
    for (const v of arr) { set.add(v); if (set.size > limit) break; }
    return Array.from(set);
  }

  function toCSV(rows) {
    const esc = (s) => {
      const str = s==null? '' : String(s);
      return /[",\n]/.test(str) ? `"${str.replace(/"/g,'""')}"` : str;
    };
    return rows.map(r=>r.map(esc).join(',')).join('\n');
  }

  // ============ 主逻辑 ============
  // 扫描页面中可用表格
  function scanTables() {
    const tables = Array.from(document.querySelectorAll('table'))
      .filter(tb => tb.querySelector('tbody tr') && tb.querySelector('thead th'));
    return tables.map((tb, idx) => {
      const heads = Array.from(tb.querySelectorAll('thead th')).map(getText);
      const rows = Array.from(tb.querySelectorAll('tbody tr'))
        .filter(tr => tr.offsetParent !== null); // 只要可见行
      return { tb, idx, heads, rowCount: rows.length };
    });
  }

  // 从 table 提取二维数组数据
  function extractData(tb) {
    const heads = Array.from(tb.querySelectorAll('thead th')).map(getText);
    const trs = Array.from(tb.querySelectorAll('tbody tr'));
    const data = [];
    for (const tr of trs) {
      const tds = Array.from(tr.querySelectorAll('td'));
      const row = tds.map(td => getText(td));
      data.push({ tr, row });
    }
    return { heads, data };
  }

  // 构建列元信息（类型、枚举、小样本等）
  function buildColumnMeta(heads, data) {
    const samplesPerCol = heads.map(()=>[]);
    const valuePerCol = heads.map(()=>[]);
    for (let i=0;i<data.length;i++) {
      const row = data[i].row;
      for (let c=0;c<heads.length;c++) {
        const v = row[c] ?? '';
        if (samplesPerCol[c].length < 50) samplesPerCol[c].push(v);
        valuePerCol[c].push(v);
      }
    }
    const meta = heads.map((h,c) => {
      const type = detectType(samplesPerCol[c]);
      const uniques = uniqueValues(valuePerCol[c], 5000);
      const enumCap = 30;
      const useEnum = (type==='text' && uniques.length>0 && uniques.length<=enumCap);
      return { name:h, type, uniques: useEnum ? uniques.sort((a,b)=>a.localeCompare(b)) : null };
    });
    return meta;
  }

  // 过滤函数构建
  function makeFilterFns(filters, meta) {
    // filters: { globalQ, byCol: { c: {type, textQ, enumSel:Set, min, max} } }
    const glbKeys = (filters.globalQ||'').trim().toLowerCase().split(/\s+/).filter(Boolean);
    const byCol = filters.byCol || {};
    return (row) => {
      // 全局关键词：任意单元包含全部关键词
      if (glbKeys.length) {
        const joined = row.join(' ').toLowerCase();
        for (const k of glbKeys) {
          if (!joined.includes(k)) return false;
        }
      }
      // 按列过滤
      for (const cStr of Object.keys(byCol)) {
        const c = Number(cStr);
        const f = byCol[c]; if (!f) continue;
        const vRaw = row[c] ?? '';
        const v = vRaw.trim();

        if (f.type==='text') {
          if (f.enumSel && f.enumSel.size) {
            if (!f.enumSel.has(v)) return false;
          }
          if (f.textQ && f.textQ.length) {
            const vs = v.toLowerCase();
            for (const k of f.textQ) {
              if (!vs.includes(k)) return false;
            }
          }
        } else if (f.type==='number') {
          const numable = isNum(v);
          const val = numable ? toNum(v) : NaN;
          if (f.min!=null && !(numable && val >= f.min)) return false;
          if (f.max!=null && !(numable && val <= f.max)) return false;
        } else if (f.type==='date') {
          const t = Date.parse(v);
          if (f.min!=null && !(isFinite(t) && t >= f.min)) return false;
          if (f.max!=null && !(isFinite(t) && t <= f.max)) return false;
        }
      }
      return true;
    };
  }

  // 排序函数构建
  function makeSortFn(sort, meta) {
    // sort: { col, dir: 1|-1|0 }
    if (!sort || sort.dir===0 || sort.col==null) return null;
    const c = sort.col, dir = sort.dir;
    const type = meta[c]?.type || 'text';
    if (type==='number') {
      return (a,b) => {
        const av = isNum(a[c]) ? toNum(a[c]) : NaN;
        const bv = isNum(b[c]) ? toNum(b[c]) : NaN;
        if (isNaN(av) && isNaN(bv)) return 0;
        if (isNaN(av)) return 1; // NaN放后
        if (isNaN(bv)) return -1;
        return dir * (av - bv);
      };
    } else if (type==='date') {
      return (a,b) => dir * (Date.parse(a[c]) - Date.parse(b[c]));
    } else {
      return (a,b) => dir * cmp(String(a[c]||''), String(b[c]||''));
    }
  }

  // 将过滤/排序结果应用到原始表格（仅显示/隐藏，不改数据）
  function applyToTable(tb, heads, data, filterFn, sortFn) {
    // 先全部显示
    for (const {tr} of data) { tr.style.display = ''; }

    // 过滤
    const filtered = [];
    for (const rec of data) {
      if (filterFn(rec.row)) filtered.push(rec);
      else rec.tr.style.display = 'none';
    }

    // 排序：若有排序，按DOM顺序重新插入
    if (sortFn) {
      const sorted = filtered.slice().sort((A,B) => sortFn(A.row, B.row));
      const tbody = tb.querySelector('tbody');
      for (const rec of sorted) tbody.appendChild(rec.tr);
      return { visible: sorted.length };
    }
    return { visible: filtered.length };
  }

  // ============ UI ============
  let STATE = {
    tables: [],
    curIdx: 0,
    heads: [],
    data: [],
    meta: [],
    filters: { globalQ: '', byCol: {} },
    sort: { col: null, dir: 0 }, // 0无序, 1升序, -1降序
  };

  function ensureButton() {
    if (document.querySelector('.tt-btn')) return;
    const b = document.createElement('button');
    b.className = 'tt-btn';
    b.textContent = '🔎 Table Tools';
    b.onclick = togglePanel;
    document.body.appendChild(b);
  }

  function togglePanel() {
    const panel = document.querySelector('.tt-panel');
    if (panel) { panel.remove(); return; }
    openPanel();
  }

  async function openPanel() {
    STATE.tables = scanTables();
    if (!STATE.tables.length) {
      alert('未发现可用表格（需要带 thead/tbody 的 <table>）。');
      return;
    }
    if (STATE.curIdx >= STATE.tables.length) STATE.curIdx = 0;

    // 初次加载当前表
    await loadCurrentTable();

    const p = document.createElement('div');
    p.className = 'tt-panel';
    p.innerHTML = `
      <h3>通用表格工具（排序 / 筛选 / 导出 CSV）</h3>
      <div class="tt-row">
        <div class="span2">
          <label class="tt-muted">选择表格</label>
          <select id="tt-table"></select>
        </div>
        <div class="span4">
          <label class="tt-muted">全局搜索（空格分词：需全部命中）</label>
          <input id="tt-global" placeholder="在全部列里模糊搜索">
        </div>
        <div class="span2">
          <label class="tt-muted">排序字段</label>
          <select id="tt-sort-col"></select>
        </div>
        <div class="span2">
          <label class="tt-muted">排序方向</label>
          <select id="tt-sort-dir">
            <option value="0">不排序</option>
            <option value="1">升序</option>
            <option value="-1">降序</option>
          </select>
        </div>
        <div class="span2">
          <label class="tt-muted">可见行数</label>
          <button id="tt-stat" disabled>—</button>
        </div>
      </div>

      <div class="tt-colbox">
        <div class="tt-hint">按列筛选（自动识别类型：文本/枚举/数值/日期）</div>
        <div class="tt-col-grid" id="tt-cols"></div>
        <div class="tt-flex" style="margin-top:8px;">
          <button id="tt-reset">重置筛选</button>
          <button id="tt-export">导出当前可见为 CSV</button>
          <span class="tt-muted">小贴士：文本列支持“多关键字 AND”——用空格分隔关键字；数值/日期支持范围。</span>
        </div>
      </div>
    `;
    document.body.appendChild(p);

    // 初始化表选择
    const sel = p.querySelector('#tt-table');
    sel.innerHTML = STATE.tables.map(t =>
      `<option value="${t.idx}">表#${t.idx+1}（列：${t.heads.length} 行：${t.rowCount}）</option>`
    ).join('');
    sel.value = String(STATE.curIdx);
    sel.onchange = async () => {
      STATE.curIdx = Number(sel.value);
      await loadCurrentTable();
      refreshPanel();
      applyAll();
    };

    // 全局与排序控件
    p.querySelector('#tt-global').value = STATE.filters.globalQ || '';
    p.querySelector('#tt-global').oninput = (e) => {
      STATE.filters.globalQ = e.target.value || '';
      applyAll();
    };

    const sortColSel = p.querySelector('#tt-sort-col');
    sortColSel.innerHTML = STATE.heads.map((h,i)=>`<option value="${i}">${h||('列'+(i+1))}</option>`).join('');
    sortColSel.value = STATE.sort.col==null ? '0' : String(STATE.sort.col);
    sortColSel.onchange = (e) => {
      STATE.sort.col = Number(e.target.value);
      applyAll();
    };

    const sortDirSel = p.querySelector('#tt-sort-dir');
    sortDirSel.value = String(STATE.sort.dir||0);
    sortDirSel.onchange = (e) => {
      STATE.sort.dir = Number(e.target.value);
      applyAll();
    };

    // 渲染列筛选区
    renderColFilters();

    // 按钮
    p.querySelector('#tt-reset').onclick = () => {
      STATE.filters = { globalQ: '', byCol: {} };
      STATE.sort = { col: null, dir: 0 };
      p.querySelector('#tt-global').value = '';
      p.querySelector('#tt-sort-dir').value = '0';
      p.querySelector('#tt-sort-col').value = '0';
      renderColFilters();
      applyAll();
    };

    p.querySelector('#tt-export').onclick = () => {
      const visibleRows = Array.from(STATE.data).filter(({tr}) => tr.style.display !== 'none');
      const rows = [STATE.heads].concat(visibleRows.map(r => r.row));
      const csv = toCSV(rows);
      const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'table_filtered.csv';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    };

    applyAll(); // 首次应用
  }

  async function loadCurrentTable() {
    const info = scanTables().find(t => t.idx === STATE.curIdx) || scanTables()[0];
    if (!info) return;
    STATE.curIdx = info.idx;
    const { heads, data } = extractData(info.tb);
    const meta = buildColumnMeta(heads, data);

    STATE.heads = heads;
    STATE.data = data;
    STATE.meta = meta;

    // 如果当前排序列超出范围，重置
    if (STATE.sort.col==null || STATE.sort.col >= heads.length) {
      STATE.sort = { col: null, dir: 0 };
    }
  }

  function renderColFilters() {
    const wrap = document.querySelector('.tt-panel #tt-cols');
    if (!wrap) return;
    wrap.innerHTML = '';

    STATE.meta.forEach((m, c) => {
      const f = STATE.filters.byCol[c] || {};
      const box = document.createElement('div');
      box.innerHTML = `<div class="tt-colbox">
        <div class="tt-hint"><b>${m.name || ('列'+(c+1))}</b> <span class="tt-chip">${m.type}</span></div>
        <div class="tt-row" style="margin:6px 0 0 0;">
          ${m.type==='number' ? `
            <div class="span3"><label class="tt-muted">≥</label><input id="min-${c}" type="number" step="any" placeholder="最小" value="${f.min??''}"></div>
            <div class="span3"><label class="tt-muted">≤</label><input id="max-${c}" type="number" step="any" placeholder="最大" value="${f.max??''}"></div>
          ` : m.type==='date' ? `
            <div class="span3"><label class="tt-muted">起始</label><input id="min-${c}" type="datetime-local" value="${f.min? new Date(f.min).toISOString().slice(0,16):''}"></div>
            <div class="span3"><label class="tt-muted">结束</label><input id="max-${c}" type="datetime-local" value="${f.max? new Date(f.max).toISOString().slice(0,16):''}"></div>
          ` : (m.uniques ? `
            <div class="span6">
              <div class="tt-tagbar" id="enum-${c}"></div>
            </div>
          ` : `
            <div class="span6"><label class="tt-muted">包含关键字（空格分词，AND）</label><input id="q-${c}" placeholder="示例：abc def" value="${(f.textQ||[]).join(' ')}"></div>
          `)}
        </div>
      </div>`;
      wrap.appendChild(box);

      if (m.type === 'number') {
        box.querySelector(`#min-${c}`).oninput = (e) => {
          STATE.filters.byCol[c] = STATE.filters.byCol[c] || {type:'number'};
          STATE.filters.byCol[c].type='number';
          STATE.filters.byCol[c].min = e.target.value===''? null : Number(e.target.value);
          applyAll();
        };
        box.querySelector(`#max-${c}`).oninput = (e) => {
          STATE.filters.byCol[c] = STATE.filters.byCol[c] || {type:'number'};
          STATE.filters.byCol[c].type='number';
          STATE.filters.byCol[c].max = e.target.value===''? null : Number(e.target.value);
          applyAll();
        };
      } else if (m.type === 'date') {
        box.querySelector(`#min-${c}`).onchange = (e) => {
          STATE.filters.byCol[c] = STATE.filters.byCol[c] || {type:'date'};
          STATE.filters.byCol[c].type='date';
          STATE.filters.byCol[c].min = e.target.value? Date.parse(e.target.value) : null;
          applyAll();
        };
        box.querySelector(`#max-${c}`).onchange = (e) => {
          STATE.filters.byCol[c] = STATE.filters.byCol[c] || {type:'date'};
          STATE.filters.byCol[c].type='date';
          STATE.filters.byCol[c].max = e.target.value? Date.parse(e.target.value) : null;
          applyAll();
        };
      } else if (m.uniques) {
        const bar = box.querySelector(`#enum-${c}`);
        const sel = (STATE.filters.byCol[c]?.enumSel) || new Set();
        m.uniques.slice(0, 1000).forEach(val => {
          const tag = document.createElement('span');
          tag.className = 'tt-tag' + (sel.has(val)? ' active':'');
          tag.textContent = val || '(空)';
          tag.onclick = () => {
            STATE.filters.byCol[c] = STATE.filters.byCol[c] || {type:'text'};
            STATE.filters.byCol[c].type='text';
            const set = (STATE.filters.byCol[c].enumSel ||= new Set());
            if (set.has(val)) set.delete(val); else set.add(val);
            tag.classList.toggle('active');
            applyAll();
          };
          bar.appendChild(tag);
        });
      } else {
        box.querySelector(`#q-${c}`).oninput = (e) => {
          const words = (e.target.value||'').toLowerCase().split(/\s+/).filter(Boolean);
          if (!STATE.filters.byCol[c]) STATE.filters.byCol[c] = {type:'text'};
          STATE.filters.byCol[c].type='text';
          STATE.filters.byCol[c].textQ = words;
          applyAll();
        };
      }
    });
  }

  function refreshPanel() {
    const p = document.querySelector('.tt-panel'); if (!p) return;
    // 头部控件更新
    const sortColSel = p.querySelector('#tt-sort-col');
    sortColSel.innerHTML = STATE.heads.map((h,i)=>`<option value="${i}">${h||('列'+(i+1))}</option>`).join('');
    sortColSel.value = STATE.sort.col==null ? '0' : String(STATE.sort.col);

    // 列筛选重画
    renderColFilters();
  }

  function applyAll() {
    const info = scanTables().find(t => t.idx === STATE.curIdx);
    if (!info) return;
    const tb = info.tb;

    // 重抓一次数据（可能动态变化）
    const { heads, data } = extractData(tb);
    STATE.heads = heads; STATE.data = data;

    const filterFn = makeFilterFns(STATE.filters, STATE.meta);
    const sortFn = makeSortFn(STATE.sort, STATE.meta);
    const { visible } = applyToTable(tb, heads, data, filterFn, sortFn);

    const statBtn = document.querySelector('.tt-panel #tt-stat');
    if (statBtn) statBtn.textContent = `${visible}/${data.length}`;
  }

  // ============ 初始化 ============
  function init() {
    ensureButton();

    // 首次扫描一遍，若有表就预构建 meta
    const tables = scanTables();
    if (tables.length) {
      STATE.curIdx = 0;
      const { heads, data } = extractData(tables[0].tb);
      STATE.heads = heads;
      STATE.data = data;
      STATE.meta = buildColumnMeta(heads, data);
    }
  }

  // 监听 DOM 变化，尝试自动刷新（防抖）
  let busy = false, debTimer = null;
  const mo = new MutationObserver(() => {
    if (busy) return;
    if (debTimer) clearTimeout(debTimer);
    debTimer = setTimeout(async () => {
      busy = true;
      try {
        const pOpen = !!document.querySelector('.tt-panel');
        const tables = scanTables();
        if (!tables.length) return;

        // 如果当前表不存在了，切回第一个
        if (!tables.find(t => t.idx === STATE.curIdx)) STATE.curIdx = 0;

        // 重新加载当前表的 meta
        const cur = tables.find(t => t.idx === STATE.curIdx) || tables[0];
        const { heads, data } = extractData(cur.tb);
        STATE.heads = heads; STATE.data = data; STATE.meta = buildColumnMeta(heads, data);

        if (pOpen) {
          refreshPanel();
          applyAll();
        }
      } finally {
        busy = false;
      }
    }, 400);
  });

  init();
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();
