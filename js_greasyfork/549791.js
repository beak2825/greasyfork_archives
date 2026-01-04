// ==UserScript==
// @name         Optimoroute POD - Gray Order ID by Darrien
// @namespace    pod-gray-debug
// @version      1.2.0
// @description  Mark Order ID gray when POD is viewed (row click + modal fallback) with debug logs
// @match        https://*.optimoroute.com/*
// @match        https://optimoroute.com/*
// @run-at       document-idle
// @inject-into  content
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549791/Optimoroute%20POD%20-%20Gray%20Order%20ID%20by%20Darrien.user.js
// @updateURL https://update.greasyfork.org/scripts/549791/Optimoroute%20POD%20-%20Gray%20Order%20ID%20by%20Darrien.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const DEBUG = true;
  const log = (...a) => DEBUG && console.debug('[POD]', ...a);

  /* 文案（如界面是中文可替换） */
  const TXT_ORDER_DETAILS = 'Order Details';
  const TXT_POD           = 'Proof of Delivery';
  const TXT_ORDER_ID_LBL  = 'Order ID';

  /* 宽松一点：2~3个大写字母 + ≥5位数字（ZX..., WP... 都能匹配）*/
  const ORDER_ID_REGEX = /[A-Z]{2,3}\d{5,}/;

  /* 颜色样式（尽量提高优先级） */
  const style = document.createElement('style');
  style.textContent = `
  td .x-grid-cell-inner.pod-orderid-viewed,
  td.pod-orderid-viewed .x-grid-cell-inner,
  .x-grid-cell-inner.pod-orderid-viewed {
    color: #9ca3af !important;
  }`;
  document.head.appendChild(style);

  /* 按天存储 */
  const STORAGE_PREFIX = 'podViewedIDs:';
  const todayKey = () => {
    const d = new Date();
    return `${STORAGE_PREFIX}${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };
  const loadSet = () => { try { return new Set(JSON.parse(localStorage.getItem(todayKey())||'[]')); } catch { return new Set(); } };
  const saveSet = (s) => localStorage.setItem(todayKey(), JSON.stringify([...s]));
  const viewed = loadSet();

  /* 小工具 */
  const byTextEq  = (el,t)=>!!el && (el.textContent||'').trim()===t;
  const findByText= (root,t)=>[...root.querySelectorAll('*')].find(el=>byTextEq(el,t));

  // 从行里拿 Order ID：优先“第3列”，不行再全行正则
  function getOrderIdFromRow(tr) {
    if (!tr) return null;
    const third = tr.querySelector('td:nth-child(3) .x-grid-cell-inner, td:nth-child(3)');
    const s = (third?.textContent || '').trim();
    if (s) {
      const m = s.match(ORDER_ID_REGEX);
      if (m) return m[0];
    }
    const text = (tr.textContent || '');
    const m2 = text.match(ORDER_ID_REGEX);
    return m2 ? m2[0] : null;
  }

  // 找到“Order ID 那格”的 DOM
  function findOrderIdCellInRow(tr, orderId) {
    if (!tr || !orderId) return null;
    // 精确匹配
    let cell = [...tr.querySelectorAll('td .x-grid-cell-inner, td')].find(c => (c.textContent||'').trim() === orderId);
    if (cell) return cell;
    // 包含匹配
    cell = [...tr.querySelectorAll('td .x-grid-cell-inner, td')].find(c => (c.textContent||'').includes(orderId));
    return cell || null;
  }

  function grayCell(cell) {
    if (!cell) return;
    if (cell.classList.contains('x-grid-cell-inner')) cell.classList.add('pod-orderid-viewed');
    else {
      cell.classList.add('pod-orderid-viewed');
      const inner = cell.querySelector('.x-grid-cell-inner');
      inner && inner.classList.add('pod-orderid-viewed');
    }
  }

  // 扫描整表，应用灰色
  function markTable() {
    const rows = document.querySelectorAll('tr.x-grid-row, table tr');
    rows.forEach(tr => {
      const oid = getOrderIdFromRow(tr);
      if (!oid) return;
      const cell = findOrderIdCellInRow(tr, oid);
      if (!cell) return;
      if (viewed.has(oid)) grayCell(cell); else {
        cell.classList.remove('pod-orderid-viewed');
        cell.querySelector?.('.x-grid-cell-inner')?.classList.remove('pod-orderid-viewed');
      }
    });
  }

  // —— A. 行内点击（相机/POD 列）立即记录 —— //
  // 兼容多种点击目标：相机图标、整个 POD 列、Action 列等；用捕获阶段拿到被阻止冒泡的点击
  ['pointerdown','click','mousedown'].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const icon = e.target.closest('.podIndicatorPhotoIconSmall, .pod-indicator-icon, [data-qtip*="Photo attached"]');
      const podCell = icon ? icon.closest('td')
                      : e.target.closest('td[class*="pod-indicator-column"], td.x-action-col-cell');
      if (!icon && !podCell) return;

      const tr = (podCell || icon)?.closest('tr.x-grid-row, tr');
      if (!tr) return;

      const oid = getOrderIdFromRow(tr);
      log('row-click:', {evt, oid, tr});
      if (!oid) return;

      viewed.add(oid);
      saveSet(viewed);

      const cell = findOrderIdCellInRow(tr, oid);
      grayCell(cell);
    }, true); // capture
  });

  // —— B. 弹窗兜底（打开详情时也记录） —— //
  function extractOrderIdFromModal(modalRoot) {
    const label = findByText(modalRoot, TXT_ORDER_ID_LBL);
    if (!label) return null;
    const valueEl = label.parentElement?.querySelector(':scope > *:nth-child(2)');
    const raw = (valueEl?.textContent || '').trim();
    if (!raw) return null;
    const m = raw.match(ORDER_ID_REGEX);
    return m ? m[0] : raw;
  }
  function tryRecordFromNode(node) {
    const candidates = [...(node.querySelectorAll?.('div') || [])].filter(el => {
      const t = (el.textContent || '');
      return t.includes(TXT_ORDER_DETAILS) && t.includes(TXT_POD);
    });
    candidates.forEach(modalRoot => {
      const oid = extractOrderIdFromModal(modalRoot);
      log('modal-detect:', {oid, modalRoot});
      if (!oid) return;
      if (!viewed.has(oid)) {
        viewed.add(oid);
        saveSet(viewed);
        markTable();
      }
    });
  }

  // 初次/监听
  markTable();
  tryRecordFromNode(document);

  const mo = new MutationObserver(muts => {
    let needMark = false;
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        tryRecordFromNode(n); // 可能是弹窗
        if (n.matches?.('table,tbody,tr,td,div')) needMark = true; // 表格更新
      });
    });
    if (needMark) markTable();
  });
  mo.observe(document.body, { childList:true, subtree:true });

  // 便捷：Alt+Shift+V 将“当前选中行”置灰（用于测试）
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'v') {
      const tr = document.querySelector('tr.x-grid-row-selected, tr.x-grid-row-focused') || document.querySelector('tr.x-grid-row');
      const oid = getOrderIdFromRow(tr);
      log('hotkey Alt+Shift+V:', {tr, oid});
      if (oid) {
        viewed.add(oid); saveSet(viewed);
        grayCell(findOrderIdCellInRow(tr, oid));
      }
    }
  });
})();
