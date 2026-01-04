// ==UserScript==
// @name         【内容营销系统】权限新增与删除插件（左侧拖拽与收起/展开）
// @namespace    https://kol-edt.netease.com/
// @description  读取「权限配置表」, 批量新增/取消权限；失败行回写 Excel；SPA 兼容；Shadow DOM 样式隔离；左侧宽度拖拽；收起/展开日志与进度；未上传不显示进度/日志
// @version      0.2.4
// @license      MIT
// @match        https://kol-edt.netease.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      kol-edt.netease.com
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/549788/%E3%80%90%E5%86%85%E5%AE%B9%E8%90%A5%E9%94%80%E7%B3%BB%E7%BB%9F%E3%80%91%E6%9D%83%E9%99%90%E6%96%B0%E5%A2%9E%E4%B8%8E%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6%EF%BC%88%E5%B7%A6%E4%BE%A7%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%94%B6%E8%B5%B7%E5%B1%95%E5%BC%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549788/%E3%80%90%E5%86%85%E5%AE%B9%E8%90%A5%E9%94%80%E7%B3%BB%E7%BB%9F%E3%80%91%E6%9D%83%E9%99%90%E6%96%B0%E5%A2%9E%E4%B8%8E%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6%EF%BC%88%E5%B7%A6%E4%BE%A7%E6%8B%96%E6%8B%BD%E4%B8%8E%E6%94%B6%E8%B5%B7%E5%B1%95%E5%BC%80%EF%BC%89.meta.js
// ==/UserScript==

/* globals XLSX, GM_xmlhttpRequest */
(function () {
  'use strict';

  // ====== 路由判断（SPA）======
  const PATH_TARGET = /^\/admin_manager\/system(?:\/|$)/;

  // ====== 业务常量 ======
  const SHEET_NAME = '权限配置表';
  const REQUIRED_KEYS = ['email', 'role', 'opType'];
  const HEADER_RULES = [
    { key: 'email',       re: /用户邮箱[*＊]?$/i },
    { key: 'userName',    re: /用户名称$/ },
    { key: 'role',        re: /角色[*＊]?$/ },
    { key: 'productName', re: /产品名称.*[（(].*下拉.*[）)]$/ },
    { key: 'productCode', re: /^(?:内容营销)?产品编码[*＊]?(?:[（(]此列为公式[）)])?$/ },
    { key: 'opType',      re: /权限操作类型$/ },
    { key: 'reason',      re: /操作原因$/ },
  ];

  const BASE = location.origin;
  const API = {
    roles:    `${BASE}/auth/roles/`,
    users:    `${BASE}/auth/users/`,
    projects: `${BASE}/auth/projects/`,
    addRoles: (userId) => `${BASE}/auth/users/${userId}/roles/`,
    delRole:  (userRoleId) => `${BASE}/auth/user_roles/${userRoleId}/`,
  };

  // ====== Shadow DOM 面板（样式隔离）======
  let host, shadow, ui = {
    panel: null, uploadBtn: null, toggleBtn: null,
    progressWrap: null, progressBar: null,
    logWrap: null, logList: null, fileInput: null,
    resizer: null, collapsed: false,
  };

  function buildPanel() {
    if (host) return;
    host = document.createElement('div');
    host.id = 'kol-bulk-host';
    host.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483647;display:none;';
    document.body.appendChild(host);

    shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      :host { all: initial; }
      .panel {
        box-sizing: border-box;
        width: 360px; min-width: 320px; max-width: 60vw;
        background:#fff; border:1px solid #e5e7eb; border-radius:12px;
        box-shadow:0 8px 24px rgba(0,0,0,.08);
        display:flex; flex-direction:column; gap:10px; padding:12px;
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial;
        /* 去掉原生 resize 手柄，改用左侧自定义拖拽 */
        position: relative; max-height: 70vh; overflow: auto;
      }
      .panel.collapsed #progressWrap,
      .panel.collapsed #logWrap { display: none !important; }
      .header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
      .title { margin:0; font-size:14px; line-height:20px; color:#111827; }
      .btn {
        appearance:none; padding:6px 12px; border:1px solid #d1d5db; border-radius:8px;
        background:#fff; color:#111827; cursor:pointer; font-size:13px;
      }
      .btn:hover{ background:#f9fafb; } .btn:active{ background:#f3f4f6; }
      .row { display:flex; gap:8px; align-items:center; }
      .progress { width:100%; height:10px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px; overflow:hidden; }
      .bar { height:100%; width:0%; background:linear-gradient(90deg,#22c55e,#3b82f6); transition: width .2s ease; }
      .log { border:1px dashed #e5e7eb; border-radius:8px; background:#fafafa; max-height: 38vh; overflow:auto; padding:0; }
      .log-list { list-style:none; margin:0; padding:6px; display:flex; flex-direction:column; gap:6px; }
      .item { display:grid; grid-template-columns: 6px 1fr auto; gap:8px; align-items:flex-start;
              background:#fff; border:1px solid #eef2f7; border-radius:8px; padding:8px 10px;
              font-size:12px; line-height:1.45; word-break:break-word; box-shadow:0 1px 1px rgba(17,24,39,.04); }
      .item .lv{ width:6px; border-radius:4px; }
      .item .msg{ font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace; color:#374151; }
      .item .ts{ color:#6b7280; white-space:nowrap; font-variant-numeric: tabular-nums; }
      .success .lv{ background:#22c55e; } .info .lv{ background:#3b82f6; } .warn .lv{ background:#f59e0b; } .error .lv{ background:#ef4444; }
      .hidden{ display:none !important; }

      /* 左侧拖拽手柄 */
      .resizer {
        position:absolute; left:0; top:8px; bottom:8px; width:10px;
        cursor: ew-resize; background: transparent;
      }
      .resizer::after{
        content:''; position:absolute; left:3px; top:50%; transform:translateY(-50%);
        width:4px; height:28px; border-radius:2px; background:#e5e7eb;
      }
      .resizing { user-select:none; cursor: ew-resize !important; }
    `;
    shadow.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'panel';
    wrap.innerHTML = `
      <div class="resizer" id="resizer" title="拖拽调整宽度"></div>
      <div class="header">
        <h4 class="title">权限批量导入</h4>
        <div class="row">
          <button class="btn" id="toggleBtn">收起</button>
          <button class="btn" id="uploadBtn">上传文件</button>
        </div>
      </div>
      <div id="progressWrap" class="hidden"><div class="progress"><div id="bar" class="bar"></div></div></div>
      <div id="logWrap" class="log hidden"><ul id="logList" class="log-list"></ul></div>
    `;
    shadow.appendChild(wrap);

    ui.panel = wrap;
    ui.uploadBtn = shadow.getElementById('uploadBtn');
    ui.toggleBtn = shadow.getElementById('toggleBtn');
    ui.progressWrap = shadow.getElementById('progressWrap');
    ui.progressBar = shadow.getElementById('bar');
    ui.logWrap = shadow.getElementById('logWrap');
    ui.logList = shadow.getElementById('logList');
    ui.resizer = shadow.getElementById('resizer');

    ui.fileInput = document.createElement('input');
    ui.fileInput.type = 'file';
    ui.fileInput.accept = '.xlsx,.xls';
    ui.fileInput.className = 'hidden';
    shadow.appendChild(ui.fileInput);

    ui.uploadBtn.addEventListener('click', () => ui.fileInput.click());
    ui.fileInput.addEventListener('change', onPickFile);

    ui.toggleBtn.addEventListener('click', () => {
      ui.collapsed = !ui.collapsed;
      if (ui.collapsed) ui.panel.classList.add('collapsed');
      else ui.panel.classList.remove('collapsed');
      ui.toggleBtn.textContent = ui.collapsed ? '展开' : '收起';
    });

    // 左侧拖拽宽度
    initResizer();
  }

  function initResizer(){
    let startX = 0, startW = 0, minW = 320, maxW = Math.round(window.innerWidth * 0.6), active = false;

    const onDown = (e) => {
      active = true;
      startX = e.clientX;
      startW = ui.panel.getBoundingClientRect().width;
      document.documentElement.classList.add('resizing');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp, { once:true });
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!active) return;
      const dx = e.clientX - startX;           // 往右为正，往左为负
      let w = startW - dx;                     // 固定在右侧，左边拖动 => 宽度 = 起始宽度 - dx
      w = Math.max(minW, Math.min(maxW, w));
      ui.panel.style.width = w + 'px';
    };
    const onUp = () => {
      active = false;
      document.documentElement.classList.remove('resizing');
      window.removeEventListener('pointermove', onMove);
    };

    ui.resizer.addEventListener('pointerdown', onDown);
    // 双击手柄恢复默认宽度
    ui.resizer.addEventListener('dblclick', () => ui.panel.style.width = '360px');
  }

  function showPanel(){ buildPanel(); host.style.display = atTarget() ? 'block' : 'none'; }
  function hidePanel(){ if (host) host.style.display = 'none'; }
  function atTarget(){ return PATH_TARGET.test(location.pathname); }
  function togglePanel(){ atTarget() ? showPanel() : hidePanel(); }

  (function(history){
    const _push = history.pushState, _replace = history.replaceState;
    history.pushState = function(...args){ const r = _push.apply(this, args);   window.dispatchEvent(new Event('tm:urlchange')); return r; };
    history.replaceState = function(...args){ const r = _replace.apply(this, args); window.dispatchEvent(new Event('tm:urlchange')); return r; };
  })(window.history);
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('tm:urlchange')));
  window.addEventListener('hashchange', () => window.dispatchEvent(new Event('tm:urlchange')));
  window.addEventListener('tm:urlchange', togglePanel);
  togglePanel();

  // ====== UI 辅助 ======
  function nowTs(){ return new Date().toLocaleTimeString(); }
  function ensureWorkAreaVisible(){
    ui.progressWrap.classList.remove('hidden');
    ui.logWrap.classList.remove('hidden');
  }
  function addLog(msg, level='info'){
    if (!ui.logList) return;
    const m = String(msg);
    if (m.startsWith('✅')) level = 'success';
    else if (m.startsWith('❌')) level = 'error';
    else if (m.startsWith('🗑️')) level = 'warn';
    const li = document.createElement('li');
    li.className = `item ${level}`;
    li.innerHTML = `<div class="lv"></div><div class="msg"></div><div class="ts">${nowTs()}</div>`;
    li.querySelector('.msg').textContent = m;
    ui.logList.appendChild(li);
    ui.logWrap.scrollTop = ui.logWrap.scrollHeight;
  }
  function setProgress(i, total){
    const pct = Math.round((i / Math.max(total,1)) * 100);
    ui.progressBar.style.width = `${pct}%`;
  }

  // ====== 工具 ======
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const ucase = (s) => (s ?? '').toString().trim().toUpperCase();
  function cleanse(s){
    if (s == null) return '';
    let t = String(s);
    t = t.replace(/[\p{Z}\u200B\u200C\u200D\uFEFF]/gu, '');
    t = t.replace(/＊/g, '*').replace(/[（）]/g, m => ({'（':'(', '）':')'}[m]));
    return t.trim();
  }
  function gmRequest({ method = 'GET', url, headers = {}, data = null, anonymous = false }) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method, url, data, anonymous,
        headers: Object.assign({
          'accept':'*/*','cache-control':'no-cache','pragma':'no-cache','x-dept-id':'1',
          'content-type': data ? 'application/json' : undefined,
        }, headers),
        responseType: 'json',
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(typeof res.response === 'object' ? res.response : safeJSON(res.responseText));
          } else {
            reject(new Error(`HTTP ${res.status}: ${res.responseText || res.statusText}`));
          }
        },
        onerror: (err) => reject(new Error(`Network error: ${err.error || 'unknown'}`)),
        ontimeout: () => reject(new Error('Request timeout')),
      });
    });
  }
  const safeJSON = (txt) => { try { return JSON.parse(txt); } catch { return { raw: txt }; } };

  // ====== Excel 读取 ======
  async function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    ensureWorkAreaVisible();
    addLog(`读取文件：${file.name}`, 'info');

    const arrayBuf = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuf, { type: 'array', cellFormula: true, cellNF: true, cellText: true });
    const ws = wb.Sheets[SHEET_NAME];
    if (!ws) { addLog(`❌ 未找到工作表「${SHEET_NAME}」`, 'error'); return; }

    const { headerRow, headersFound, colByKey } = detectHeaders(ws);
    if (headerRow < 0) { addLog('❌ 无法识别表头，请确认包含「用户邮箱」「角色」「权限操作类型」等关键词', 'error'); return; }
    addLog(`✅ 表头行：第 ${headerRow + 1} 行`);
    addLog(`🧭 识别到列：` + Object.entries(colByKey).map(([k,c]) => `${k}->${XLSX.utils.encode_col(c)}`).join('、'), 'info');

    const range = XLSX.utils.decode_range(ws['!ref']);
    const rows = [];
    for (let r = headerRow + 1; r <= range.e.r; r++) {
      const raw = headersFound.map((_, c) => getCellValue(ws, r, c));
      if (raw.every(v => (v ?? '').toString().trim() === '')) continue;
      rows.push({
        raw,
        email:        getByKey(ws, r, colByKey, 'email'),
        userName:     getByKey(ws, r, colByKey, 'userName'),
        roleNameOrCode: getByKey(ws, r, colByKey, 'role'),
        productName:  getByKey(ws, r, colByKey, 'productName'),
        productCode:  getByKey(ws, r, colByKey, 'productCode'),
        opType:       getByKey(ws, r, colByKey, 'opType'),
        reason:       getByKey(ws, r, colByKey, 'reason'),
      });
    }
    if (!rows.length) { addLog('❌ 没有可处理的数据行', 'error'); return; }

    addLog('预取系统角色与项目...', 'info');
    const [roleMap, projectMap] = await Promise.all([fetchRoleMap(), fetchProjectMap()]);
    addLog(`角色(code)=${roleMap.get('byCode').size}，角色(name)=${roleMap.get('byName').size}；项目索引=${projectMap.size}`, 'info');

    await processAll(rows, roleMap, projectMap, headersFound);
    ui.fileInput.value = '';
  }

  function getCellValue(ws, r, c) {
    const addr = XLSX.utils.encode_cell({ r, c });
    const cell = ws[addr];
    return cell ? String(cell.v ?? cell.w ?? '').trim() : '';
  }
  function detectHeaders(ws) {
    const ref = XLSX.utils.decode_range(ws['!ref']);
    const MAX_SCAN = Math.min(ref.s.r + 10, ref.e.r);
    for (let r = ref.s.r; r <= MAX_SCAN; r++) {
      const headersFound = [];
      const colByKey = {};
      let hit = 0;
      for (let c = ref.s.c; c <= ref.e.c; c++) {
        const label = getCellValue(ws, r, c);
        headersFound.push(label);
        const cleaned = cleanse(label);
        for (const rule of HEADER_RULES) {
          if (colByKey[rule.key] != null) continue;
          if (rule.re.test(cleaned)) { colByKey[rule.key] = c; hit++; }
        }
      }
      const hasRequired = REQUIRED_KEYS.every(k => colByKey[k] != null);
      if (hit >= 4 && hasRequired) return { headerRow: r, headersFound, colByKey };
    }
    return { headerRow: -1, headersFound: [], colByKey: {} };
  }
  function getByKey(ws, r, colByKey, key) {
    const c = colByKey[key];
    return c == null ? '' : getCellValue(ws, r, c);
  }

  // ====== 预取：角色、项目 ======
  async function fetchRoleMap() {
    const json = await gmRequest({ url: API.roles });
    const byCode = new Map(), byName = new Map();
    for (const r of json.data || []) {
      if (r.code) byCode.set(ucase(r.code), r);
      if (r.name) byName.set(ucase(r.name), r);
    }
    return new Map([['byCode', byCode], ['byName', byName]]);
  }
  async function fetchProjectMap() {
    const json = await gmRequest({ url: API.projects });
    const idx = new Map();
    for (const p of json.data || []) {
      if (p.mpc_code) idx.set(ucase(p.mpc_code), p);
      if (p.code)     idx.set(ucase(p.code), p);
      if (p.name)     idx.set(ucase(p.name), p);
    }
    return idx;
  }

  // ====== 接口封装 ======
  async function getUserByEmail(email) {
    const q = encodeURIComponent(String(email).trim());
    const url = `${API.users}?q=${q}&page_size=10&current_page=1`;
    const json = await gmRequest({ url });
    return (json.data || []).find(u => (u.email || '').toLowerCase() === String(email).toLowerCase()) || null;
  }
  async function addUserRole(userId, roleId, projectId) {
    const body = { roles: [{ id: `new_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, role_id: roleId, project_id: projectId }] };
    const json = await gmRequest({ method: 'POST', url: API.addRoles(userId), data: JSON.stringify(body) });
    return json?.data?.user_role_ids || [];
  }
  async function deleteUserRole(userRoleId) {
    await gmRequest({ method: 'DELETE', url: API.delRole(userRoleId) });
    return true;
  }
  function findUserRoleId(userInfo, roleId, projectId) {
    const roles = userInfo?.roles || [];
    const match = roles.find(x => x?.role?.id === roleId && x?.project?.id === projectId);
    return match?.id || null;
  }

  // ====== 主流程 ======
  async function processAll(rows, roleMap, projectMap, headersFound) {
    let failedRows = [];
    const byCode = roleMap.get('byCode');
    const byName = roleMap.get('byName');

    let ok = 0, fail = 0;
    setProgress(0, rows.length);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setProgress(i, rows.length);
      try {
        if (!row.email) throw new Error('缺少用户邮箱');
        const user = await getUserByEmail(row.email);
        if (!user) throw new Error('用户不存在');

        if (!row.roleNameOrCode) throw new Error('缺少角色');
        const roleKey = ucase(row.roleNameOrCode);
        const role = byCode.get(roleKey) || byName.get(roleKey);
        if (!role) throw new Error(`角色不存在：${row.roleNameOrCode}`);

        if (!row.productCode && !row.productName) throw new Error('缺少产品编码或产品名称');
        const projKeys = [ucase(row.productCode), ucase(row.productName)].filter(Boolean);
        let project = null;
        for (const k of projKeys) { if (projectMap.has(k)) { project = projectMap.get(k); break; } }
        if (!project) throw new Error(`找不到项目：${row.productCode || row.productName}`);

        const op = String(row.opType || '').trim();
        if (/新增/.test(op)) {
          const existingId = findUserRoleId(user, role.id, project.id);
          if (existingId) throw new Error(`权限已存在（user_role_id=${existingId}），跳过`);
          const ids = await addUserRole(user.id, role.id, project.id);
          addLog(`✅ 新增成功：${row.email} / ${role.code || role.name} / ${project.code || project.mpc_code || project.name} → user_role_ids=${ids.join(',')}`, 'success');
          ok++;
        } else if (/减|删|取消/.test(op)) {
          const existingId = findUserRoleId(user, role.id, project.id);
          if (!existingId) throw new Error('要删除的权限不存在');
          await deleteUserRole(existingId);
          addLog(`🗑️ 删除成功：${row.email} / ${role.code || role.name} / ${project.code || project.mpc_code || project.name}（user_role_id=${existingId}）`, 'warn');
          ok++;
        } else {
          throw new Error(`未知的权限操作类型：${row.opType}`);
        }
      } catch (err) {
        fail++;
        const reason = err?.message || '未知错误';
        addLog(`❌ 第${i + 1}行失败：${reason}`, 'error');
        const failed = row.raw.slice();
        failed.push(reason);
        failedRows.push(failed);
      }
      await sleep(120);
    }

    setProgress(rows.length, rows.length);
    addLog(`INFO: 完成，成功 ${ok} 行，失败 ${fail} 行`, 'info');

    if (failedRows.length) exportFailedXlsx(headersFound, failedRows);
  }

  // ====== 失败明细导出 ======
  function exportFailedXlsx(headersFound, failedRows) {
    const wb = XLSX.utils.book_new();
    const aoa = [headersFound.concat(['失败原因']), ...failedRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, '失败明细');
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const name = `权限导入失败_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.xlsx`;
    XLSX.writeFile(wb, name);
    addLog(`⬇️ 已导出失败明细：${name}`, 'info');
  }
})();
