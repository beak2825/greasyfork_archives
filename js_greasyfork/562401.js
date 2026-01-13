// ==UserScript==
// @name         XJTU成绩查询
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  XJTU成绩查询，可以查看未评教课程的卷面和平时分
// @match        https://ehall.xjtu.edu.cn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562401/XJTU%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/562401/XJTU%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ROW_ID_SUFFIX = 'dqxq-index-table';
  const PANEL_ID = 'tm-result-panel';

  // ✅ 你需要的“第N个非空td”（N 从 1 开始计数）
  // 按你截图红框：3, 8, 9, 13, 21, 22, 23, 24
  const PICK_NONEMPTY_N = [3, 8, 9, 12, 13, 21, 22, 23, 24];

  // 表头（你可以随便改名字；数量要和 PICK_NONEMPTY_N 一致）
  const HEADERS = [
  '课程名',
  '学分',
  '学时',
  '总成绩',
  '绩点',
  '过程分（期中）',
  '期末卷面',
  '平时分2',
  '平时分3'
];


  function rowId(i) {
    return `row${i}${ROW_ID_SUFFIX}`;
  }

  function esc(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function createPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = PANEL_ID;
      panel.innerHTML = `
  <div id="tm-header" style="display:flex;align-items:center;gap:8px;cursor:move;user-select:none;">
    <div style="font-weight:700;">
      📋 课程成绩
      <a href="https://dzpz.xjtu.edu.cn/wui/index.html#/?menuId=1&mode=guide&id=29&_key=c4dzps" target="_blank" style="color:blue; text-decoration: underline;">
        点击查看未评教成绩
      </a>
    </div>
    <button id="tm-refresh" style="margin-left:auto;cursor:pointer;padding:2px 8px;">刷新</button>
    <span id="tm-close" style="cursor:pointer;">✖</span>
  </div>
  <div id="tm-content" style="margin-top:8px;"></div>
`;


    Object.assign(panel.style, {
      position: 'fixed',
      top: '80px',
      right: '10px',
      width: '860px',
      maxHeight: '75vh',
      overflow: 'auto',
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      zIndex: 99999,
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      fontSize: '13px'
    });

    document.body.appendChild(panel);

    panel.querySelector('#tm-close').onclick = () => panel.remove();
    panel.querySelector('#tm-refresh').onclick = () => scanAndRender();

    makeDraggable(panel, panel.querySelector('#tm-header'));
    return panel;
  }

  function makeDraggable(panel, handle) {
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;

    handle.addEventListener('mousedown', (e) => {
      const t = e.target;
      if (t && (t.id === 'tm-refresh' || t.id === 'tm-close' || t.tagName === 'BUTTON')) return;

      dragging = true;
      const rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      startX = e.clientX;
      startY = e.clientY;

      panel.style.left = `${startLeft}px`;
      panel.style.top = `${startTop}px`;
      panel.style.right = 'auto';

      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      newLeft = Math.max(0, Math.min(window.innerWidth - 80, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - 40, newTop));

      panel.style.left = `${newLeft}px`;
      panel.style.top = `${newTop}px`;
    });

    window.addEventListener('mouseup', () => { dragging = false; });
  }

  // 取一个 td 的“文本值”——优先 innerText，其次 title（你截图里很多span有title）
  function getCellText(td) {
    if (!td) return '';
    let v = (td.innerText || '').trim();
    if (v) return v;

    const spanTitle = td.querySelector('span[title]');
    if (spanTitle) {
      const t = (spanTitle.getAttribute('title') || '').trim();
      if (t) return t;
    }

    const t2 = (td.getAttribute('title') || '').trim();
    if (t2) return t2;

    return (td.textContent || '').trim();
  }

  // ✅ 把“所有td”变成“非空td列表”（保持顺序），然后取第N个（N从1开始）
  function pickNthNonEmpty(tr, N) {
    const nonEmpty = [];
    const tds = Array.from(tr.querySelectorAll('td'));

    for (const td of tds) {
      const v = getCellText(td);
      if (v) nonEmpty.push(v);
    }

    return nonEmpty[N - 1] ?? ''; // N从1开始
  }

  function collectRows() {
    const rows = [];
    let i = 0;

    while (true) {
      const tr = document.getElementById(rowId(i));
      if (!tr) break;

      const values = PICK_NONEMPTY_N.map(n => pickNthNonEmpty(tr, n));

      // 如果这一行你要的字段全空，就跳过（可按需改成不跳过）
      if (!values.every(v => !v)) {
        rows.push({ rowIndex: i, values });
      }

      i += 1;
    }
    return rows;
  }

  function thStyle() {
    return [
      'border:1px solid #e5e5e5',
      'background:#f7f7f7',
      'padding:6px',
      'text-align:left',
      'position:sticky',
      'top:0',
      'z-index:1',
      'white-space:nowrap'
    ].join(';');
  }

  function tdStyle() {
    return [
      'border:1px solid #e5e5e5',
      'padding:6px',
      'vertical-align:top',
      'white-space:nowrap'
    ].join(';');
  }

  function renderTable(rows) {
    const panel = createPanel();
    const content = panel.querySelector('#tm-content');

    if (!rows.length) {
      content.innerHTML = `<div style="color:#999;">未抓到数据（可能表格未渲染到 DOM，或需要滚动/翻页后点“刷新”）。</div>`;
      return;
    }

    const thead = `
      <thead>
        <tr>
          ${HEADERS.map(h => `<th style="${thStyle()}">${esc(h)}</th>`).join('')}
        </tr>
      </thead>
    `;

    const tbody = `
      <tbody>
        ${rows.map(r => `
          <tr>
            ${r.values.map(v => `<td style="${tdStyle()}">${esc(v)}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;

    content.innerHTML = `
      <table style="border-collapse:collapse;width:100%;min-width:820px;">
        ${thead}
        ${tbody}
      </table>
    `;
  }

  function scanAndRender() {
    renderTable(collectRows());
  }

  // 等异步渲染：看到 row0 就开始
  const obs = new MutationObserver(() => {
    if (document.getElementById(rowId(0))) {
      obs.disconnect();
      scanAndRender();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

})();
