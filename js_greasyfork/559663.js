// ==UserScript==
// @name         ZJUTOJ Rank 显示真名（学号映射）
// @namespace    https://www.zjutacm.cn/
// @version      1.0.1
// @description  在 contest 排名页面把用户名中的学号映射成真名并展示（支持导入 Excel/CSV，自动处理 GBK/UTF-8 编码）
// @match        http://www.zjutacm.cn/contest/*/rank*
// @match        https://www.zjutacm.cn/contest/*/rank*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559663/ZJUTOJ%20Rank%20%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%90%8D%EF%BC%88%E5%AD%A6%E5%8F%B7%E6%98%A0%E5%B0%84%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559663/ZJUTOJ%20Rank%20%E6%98%BE%E7%A4%BA%E7%9C%9F%E5%90%8D%EF%BC%88%E5%AD%A6%E5%8F%B7%E6%98%A0%E5%B0%84%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORE_KEY = 'zjut_sid_to_name_map_v1';
  const STORE_META = 'zjut_sid_to_name_meta_v1';
  const REALNAME_CLASS = 'tm-realname-badge';
  const PROCESSED_ATTR = 'data-tm-realname-processed';

  GM_addStyle(`
    .tm-realname-toolbar {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 999999;
      background: rgba(255,255,255,0.95);
      border: 1px solid #e8eaec;
      box-shadow: 0 2px 10px rgba(0,0,0,.08);
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 12px;
      color: #333;
      user-select: none;
    }
    .tm-realname-toolbar button {
      cursor: pointer;
      border: 1px solid #2d8cf0;
      background: #2d8cf0;
      color: white;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 12px;
      margin-right: 8px;
    }
    .tm-realname-toolbar button.secondary {
      border: 1px solid #e8eaec;
      background: #fff;
      color: #333;
    }
    .tm-realname-toolbar .meta {
      margin-top: 6px;
      color: #666;
      line-height: 1.4;
    }
    .${REALNAME_CLASS} {
      margin-left: 6px;
      padding: 1px 6px;
      border-radius: 999px;
      background: #f0f9eb;
      color: #2a7b2e;
      border: 1px solid #d6f5d8;
      font-size: 12px;
      white-space: nowrap;
    }
  `);

  function loadMap() {
    const json = GM_getValue(STORE_KEY, '{}');
    try {
      const obj = JSON.parse(json);
      if (obj && typeof obj === 'object') return obj;
    } catch (e) {}
    return {};
  }

  function saveMap(mapObj, meta = {}) {
    GM_setValue(STORE_KEY, JSON.stringify(mapObj));
    GM_setValue(STORE_META, JSON.stringify({
      updatedAt: Date.now(),
      count: Object.keys(mapObj).length,
      ...meta,
    }));
  }

  function loadMeta() {
    const json = GM_getValue(STORE_META, '{}');
    try { return JSON.parse(json) || {}; } catch (e) { return {}; }
  }

  // 从用户名里提取学号（取最后一个 9~13 位数字串）
  function extractStudentId(username) {
    if (!username) return null;
    const s = String(username);
    const matches = s.match(/(\d{9,13})(?!\d)/g);
    if (!matches || !matches.length) return null;
    return matches[matches.length - 1];
  }

  function findUserAnchors() {
    const anchors = Array.from(document.querySelectorAll('.ivu-table-body .ivu-table-tbody a'));
    return anchors.filter(a => {
      const t = (a.textContent || '').trim();
      return t.length >= 6 && /\d/.test(t);
    });
  }

  function applyRealNames() {
    const map = loadMap();
    const anchors = findUserAnchors();
    if (!anchors.length) return;

    for (const a of anchors) {
      if (a.getAttribute(PROCESSED_ATTR) === '1') continue;

      const username = (a.textContent || '').trim();
      const sid = extractStudentId(username);
      if (!sid) {
        a.setAttribute(PROCESSED_ATTR, '1');
        continue;
      }

      const realName = map[sid];
      if (realName) {
        let badge = a.parentElement && a.parentElement.querySelector(`.${REALNAME_CLASS}`);
        if (!badge) {
          badge = document.createElement('span');
          badge.className = REALNAME_CLASS;
          badge.textContent = realName;
          badge.title = `学号：${sid}`;
          a.insertAdjacentElement('afterend', badge);
        } else {
          badge.textContent = realName;
          badge.title = `学号：${sid}`;
        }
        const oldTitle = a.getAttribute('title') || '';
        if (!oldTitle.includes(sid)) a.setAttribute('title', `${oldTitle ? oldTitle + ' / ' : ''}学号：${sid}`);
      }

      a.setAttribute(PROCESSED_ATTR, '1');
    }
  }

  function resetProcessedMarksInTable() {
    const nodes = document.querySelectorAll(`.ivu-table-body .ivu-table-tbody a[${PROCESSED_ATTR}="1"]`);
    for (const n of nodes) n.removeAttribute(PROCESSED_ATTR);
  }

  // ======== 关键修复：CSV/TSV 自动识别编码（UTF-8 / GBK / UTF-16）========
  function decodeTextSmart(buf) {
    const u8 = new Uint8Array(buf);

    // BOM 检测
    if (u8.length >= 3 && u8[0] === 0xEF && u8[1] === 0xBB && u8[2] === 0xBF) {
      return new TextDecoder('utf-8').decode(u8.subarray(3));
    }
    if (u8.length >= 2 && u8[0] === 0xFF && u8[1] === 0xFE) {
      return new TextDecoder('utf-16le').decode(u8.subarray(2));
    }
    if (u8.length >= 2 && u8[0] === 0xFE && u8[1] === 0xFF) {
      return new TextDecoder('utf-16be').decode(u8.subarray(2));
    }

    const candidates = [];
    const tryDecode = (enc) => {
      try {
        const s = new TextDecoder(enc, { fatal: false }).decode(buf);
        const rep = (s.match(/\uFFFD/g) || []).length;                 // 乱码替换符数量
        const cn = (s.match(/[\u4e00-\u9fff]/g) || []).length;         // 中文字符数量
        const score = cn * 5 - rep * 20;                               // 越大越好
        candidates.push({ enc, s, score, rep, cn });
      } catch (e) {}
    };

    // 常见：UTF-8 / GBK（Excel 普通 CSV）/ UTF-16LE（有些导出）
    tryDecode('utf-8');
    tryDecode('gbk');
    tryDecode('utf-16le');

    candidates.sort((a, b) => b.score - a.score);
    return (candidates[0] && candidates[0].s) ? candidates[0].s : new TextDecoder('utf-8').decode(buf);
  }

  async function importMappingFile(file) {
    if (!file) return;

    const fname = file.name.toLowerCase();
    let rows = [];

    if (fname.endsWith('.xlsx') || fname.endsWith('.xls')) {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: '' });
    } else if (fname.endsWith('.csv') || fname.endsWith('.tsv') || fname.endsWith('.txt')) {
      const buf = await file.arrayBuffer();
      const text = decodeTextSmart(buf);

      const lines = text.split(/\r?\n/).filter(l => l.trim().length);
      const isTSV = fname.endsWith('.tsv') || lines.some(l => l.includes('\t'));
      const sep = isTSV ? '\t' : ',';

      rows = lines.map(l => l.split(sep));
    } else {
      alert('不支持的文件类型，请导入 .xlsx / .csv / .tsv');
      return;
    }

    const map = {};
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < 2) continue;

      const col0 = String(r[0] ?? '').trim();
      const col1 = String(r[1] ?? '').trim();

      if (i === 0 && (!/^\d+$/.test(col0) || /学号|姓名/.test(col0 + col1))) continue;

      const sid = col0.replace(/\s+/g, '');
      const realName = col1.replace(/\s+/g, '');

      if (!/^\d{6,20}$/.test(sid)) continue;
      if (!realName) continue;

      map[sid] = realName;
    }

    if (!Object.keys(map).length) {
      alert('没有解析到任何“学号-姓名”数据。请确认：第一列学号，第二列姓名，且有数据行。');
      return;
    }

    saveMap(map, { sourceFile: file.name });
    updateToolbarMeta();
    resetProcessedMarksInTable();
    applyRealNames();
    alert(`导入成功：${Object.keys(map).length} 条学号-姓名映射已保存。`);
  }

  let toolbarEl = null;

  function updateToolbarMeta() {
    if (!toolbarEl) return;
    const meta = loadMeta();
    const count = meta.count || 0;
    const updatedAt = meta.updatedAt ? new Date(meta.updatedAt) : null;
    const t = updatedAt ? updatedAt.toLocaleString() : '未导入';
    const source = meta.sourceFile ? `来源：${meta.sourceFile}` : '';
    toolbarEl.querySelector('.meta').textContent =
      `映射条数：${count}\n更新时间：${t}${source ? '\n' + source : ''}`;
  }

  function mountToolbar() {
    if (toolbarEl) return;

    toolbarEl = document.createElement('div');
    toolbarEl.className = 'tm-realname-toolbar';
    toolbarEl.innerHTML = `
      <div>
        <button id="tmImportBtn">导入Excel/CSV</button>
        <button class="secondary" id="tmClearBtn">清空映射</button>
      </div>
      <pre class="meta" style="margin:6px 0 0 0;white-space:pre-wrap;"></pre>
      <input id="tmFileInput" type="file" accept=".xlsx,.xls,.csv,.tsv,.txt" style="display:none;" />
    `;
    document.body.appendChild(toolbarEl);

    const input = toolbarEl.querySelector('#tmFileInput');
    toolbarEl.querySelector('#tmImportBtn').addEventListener('click', () => input.click());
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      input.value = '';
      await importMappingFile(file);
    });

    toolbarEl.querySelector('#tmClearBtn').addEventListener('click', () => {
      if (!confirm('确定要清空已保存的学号-姓名映射吗？')) return;
      saveMap({}, { sourceFile: '' });
      updateToolbarMeta();
      document.querySelectorAll(`.${REALNAME_CLASS}`).forEach(n => n.remove());
      resetProcessedMarksInTable();
      alert('已清空。');
    });

    updateToolbarMeta();
  }

  function registerMenu() {
    GM_registerMenuCommand('导入学号-姓名表（Excel/CSV）', () => {
      mountToolbar();
      toolbarEl.querySelector('#tmImportBtn').click();
    });
    GM_registerMenuCommand('清空学号-姓名映射', () => {
      mountToolbar();
      toolbarEl.querySelector('#tmClearBtn').click();
    });
    GM_registerMenuCommand('显示/隐藏悬浮工具条', () => {
      mountToolbar();
      toolbarEl.style.display = (toolbarEl.style.display === 'none') ? 'block' : 'none';
    });
  }

  let debounceTimer = null;
  function scheduleApply() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      resetProcessedMarksInTable();
      applyRealNames();
    }, 200);
  }

  function startObserver() {
    const mo = new MutationObserver(() => scheduleApply());
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  function watchUrlChange() {
    let last = location.href;
    setInterval(() => {
      if (location.href !== last) {
        last = location.href;
        scheduleApply();
      }
    }, 400);
  }

  function init() {
    registerMenu();
    mountToolbar();

    const wait = setInterval(() => {
      const hasTable = document.querySelector('.ivu-table-body .ivu-table-tbody');
      if (hasTable) {
        clearInterval(wait);
        applyRealNames();
        startObserver();
        watchUrlChange();
      }
    }, 300);
  }

  init();
})();