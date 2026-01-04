// ==UserScript==
// @name         【内容营销系统】三级单查询助手
// @namespace    https://kol-edt.netease.com/
// @version      0.1.2
// @description  左下角输入6位单号 -> 调用接口1查 mpc_code_one -> 调用接口2取第一个 promotion id -> 直接跳转到详情页
// @match        https://kol-edt.netease.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549789/%E3%80%90%E5%86%85%E5%AE%B9%E8%90%A5%E9%94%80%E7%B3%BB%E7%BB%9F%E3%80%91%E4%B8%89%E7%BA%A7%E5%8D%95%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549789/%E3%80%90%E5%86%85%E5%AE%B9%E8%90%A5%E9%94%80%E7%B3%BB%E7%BB%9F%E3%80%91%E4%B8%89%E7%BA%A7%E5%8D%95%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** ------------------ 工具 & 样式 ------------------ */
  const css = `
  .edt-helper-wrap{position:fixed;left:16px;bottom:16px;z-index:999999;
    background:#fff;border:1px solid #e5e7eb;border-radius:10px;box-shadow:0 6px 16px rgba(0,0,0,.1);
    padding:10px 12px;font:14px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial;}
  .edt-helper-title{font-weight:600;margin-bottom:6px;}
  .edt-helper-row{display:flex;align-items:center;gap:8px}
  .edt-helper-input{width:160px;padding:6px 8px;border:1px solid #d1d5db;border-radius:8px;outline:none}
  .edt-helper-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}
  .edt-helper-status{min-width:120px;color:#6b7280}
  .edt-helper-badge{font-size:12px;padding:2px 6px;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;color:#374151}
  .edt-helper-ok{color:#059669}
  .edt-helper-err{color:#dc2626}
  .edt-helper-dim{opacity:.7}
  .edt-helper-actions{margin-top:6px;display:flex;gap:8px}
  .edt-helper-btn{padding:4px 8px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;cursor:pointer}
  .edt-helper-btn:hover{background:#eef2ff;border-color:#c7d2fe}
  `;
  try { typeof GM_addStyle === 'function' ? GM_addStyle(css) : addStyle(css); }
  catch { addStyle(css); }
  function addStyle(text){
    const s = document.createElement('style');
    s.textContent = text;
    document.head.appendChild(s);
  }

  /** ------------------ UI ------------------ */
  const wrap = document.createElement('div');
  wrap.className = 'edt-helper-wrap';
  wrap.innerHTML = `
    <div class="edt-helper-title">单号跳转助手</div>
    <div class="edt-helper-row">
      <span class="edt-helper-badge">三级单号：</span>
      <input type="text" inputmode="numeric" pattern="\\d{6}" maxlength="6"
        placeholder="输入三级单号"
        class="edt-helper-input" id="edtHelperInput"/>
    </div>
    <div class="edt-helper-actions">
      <div id="edtHelperStatus" class="edt-helper-status edt-helper-dim">待输入...</div>
      <button id="edtHelperClear" class="edt-helper-btn" title="清空">清空</button>
      <button id="edtHelperCollapse" class="edt-helper-btn" title="折叠/展开">折叠</button>
    </div>
  `;
  document.body.appendChild(wrap);

  const $input = wrap.querySelector('#edtHelperInput');
  const $status = wrap.querySelector('#edtHelperStatus');
  const $clear = wrap.querySelector('#edtHelperClear');
  const $collapse = wrap.querySelector('#edtHelperCollapse');

  // 判断是否为“恰好 6 位数字”（会剔除非数字字符）
  function parseClipboardTo6(txt) {
    const onlyDigits = String(txt || '').replace(/\D+/g, '');
    return /^\d{6}$/.test(onlyDigits) ? onlyDigits : null;
  }

  // 展开面板并聚焦输入框
  function ensurePanelOpenAndFocus() {
    if (collapsed) {
      collapsed = false;
      wrap.style.height = '';
      wrap.style.overflow = 'visible';
      $collapse.textContent = '折叠';
    }
    setStatus('请在此输入 6 位单号', 'dim');
    $input.focus();
    $input.select?.();
  }

  // 用 6 位码直接触发查询
  function runWithCode(code6) {
    if (!/^\d{6}$/.test(code6)) return;
    $input.value = code6;
    lastQuery = '';
    setStatus(`检测到剪贴板单号：${code6}，开始查询...`);
    runFlow(code6).catch(err => {
      console.error('[EDT Helper] Uncaught error:', err);
      setStatus(`异常：${err?.message || err}`, 'err');
    });
  }

  $clear.addEventListener('click', () => {
    $input.value = '';
    setStatus('已清空，待输入...', 'dim');
    $input.focus();
  });

  let collapsed = false;
  $collapse.addEventListener('click', () => {
    collapsed = !collapsed;
    wrap.style.height = collapsed ? '38px' : '';
    wrap.style.overflow = collapsed ? 'hidden' : 'visible';
    $collapse.textContent = collapsed ? '展开' : '折叠';
  });

  /** ------------------ 业务逻辑 ------------------ */
  const API1 = '/demand/overview/total_price_dashboard/'; // POST
  const API2 = '/promotions/';                             // GET
  const API3 = '/demand_live/overview/total_price_dashboard/'; // POST
  const DETAIL_URL = (id) =>
    `https://kol-edt.netease.com/admin_manager/supplier_manager/detail?promotionId=${encodeURIComponent(String(id))}&dept=1`;

  let lastQuery = '';
  let debounceTimer = null;
  let runAbort = null;

  $input.addEventListener('input', () => {
    const v = ($input.value || '').trim();
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (/^\d{6}$/.test(v)) {
        if (v === lastQuery) return;
        lastQuery = v;
        runFlow(v).catch(err => {
          console.error('[EDT Helper] Uncaught error:', err);
          setStatus(`异常：${err?.message || err}`, 'err');
        });
      } else {
        setStatus('请输入 6 位数字单号', 'dim');
      }
    }, 350);
  });

  $input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = ($input.value || '').trim();
      if (/^\d{6}$/.test(v)) {
        lastQuery = v;
        runFlow(v).catch(err => {
          console.error('[EDT Helper] Uncaught error:', err);
          setStatus(`异常：${err?.message || err}`, 'err');
        });
      }
    }
  });

  function setStatus(text, type = 'dim') {
    $status.textContent = text;
    $status.classList.remove('edt-helper-ok', 'edt-helper-err', 'edt-helper-dim');
    if (type === 'ok') $status.classList.add('edt-helper-ok');
    else if (type === 'err') $status.classList.add('edt-helper-err');
    else $status.classList.add('edt-helper-dim');
  }

  async function queryFirstFrom(apiPath, code6, signal) {
    const r = await fetch(apiPath, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'x-dept-id': '1',
      },
      body: JSON.stringify({
        filters: [{
          names: ['demand_title', 'demand_id', 'mpc3_id'],
          condition: 'contains',
          filter_value: code6
        }],
        sort_cols: ['coop_time'],
        sort_types: ['desc'],
        current_page: 1,
        page_size: 20
      }),
      signal
    });

    if (!r.ok) throw new Error(`请求失败（${r.status}）：${apiPath}`);
    const j = await r.json().catch(() => ({}));
    return (Array.isArray(j?.data) && j.data.length ? j.data[0] : null);
  }

  async function runFlow(code6) {
    if (runAbort) runAbort.abort();
    runAbort = new AbortController();

    setStatus(`查询中（单号：${code6}）...`);

    // 先查接口1；查不到则回退到接口3（直播库）
    let first = await queryFirstFrom(API1, code6, runAbort.signal);
    if (!first) {
      setStatus('接口1未找到匹配数据，尝试直播库...', 'dim');
      first = await queryFirstFrom(API3, code6, runAbort.signal);
      if (!first) {
        setStatus('接口1/接口3均未找到匹配数据', 'err');
        return;
      }
    }

    const mpcOne = first.mpc_code_one || '';
    if (!mpcOne) {
      setStatus('返回缺少 mpc_code_one', 'err');
      return;
    }
    setStatus(`已获取一级单：${mpcOne}，继续查询...`);

    const qParam = '\t' + String(mpcOne).trim();
    const url2 = new URL(API2, location.origin);
    url2.searchParams.set('sort_col', 'id');
    url2.searchParams.set('current_page', '1');
    url2.searchParams.set('page_size', '20');
    url2.searchParams.set('q', qParam);

    const r2 = await fetch(url2.toString(), {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': '*/*',
        'x-dept-id': '1',
      },
      signal: runAbort.signal
    });

    if (!r2.ok) throw new Error(`接口2请求失败（${r2.status}）`);
    const j2 = await r2.json().catch(() => ({}));
    const first2 = Array.isArray(j2?.data) && j2.data.length ? j2.data[0] : null;
    if (!first2 || !first2.id) {
      setStatus('接口2未找到匹配数据或缺少 id', 'err');
      return;
    }

    const targetId = first2.id;
    setStatus(`即将跳转到 ID=${targetId} 的详情页...`, 'ok');
    window.location.assign(DETAIL_URL(targetId));
  }

  /** ------------------ 快捷键（新增 Ctrl+B，不影响 v） ------------------ */
  function isEditableTarget(el) {
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || !!el.isContentEditable;
  }

  document.addEventListener('keydown', async (e) => {
    if (e.isComposing || e.repeat) return;

    // 若焦点在输入控件（含 contentEditable），不拦截，避免影响正常输入/富文本快捷键
    if (isEditableTarget(e.target)) return;

    // Ctrl+B / Cmd+B：直接进入输入状态（展开 + focus）
    const isCtrlB = (e.key === 'b' || e.key === 'B' || e.code === 'KeyB')
      && (e.ctrlKey || e.metaKey)
      && !e.altKey
      && !e.shiftKey;

    if (isCtrlB) {
      e.preventDefault();
      e.stopPropagation();
      ensurePanelOpenAndFocus();
      return;
    }

    // 原功能：裸按 v → 读剪贴板 → 6 位则直查，否则展开输入框
    const isKeyV = (e.key === 'v' || e.key === 'V' || e.code === 'KeyV');
    if (!isKeyV || e.ctrlKey || e.metaKey || e.altKey) return;

    let clipText = '';
    try {
      if (typeof GM_getClipboard === 'function') {
        clipText = GM_getClipboard() || '';
      }
      if (!clipText && navigator.clipboard?.readText) {
        clipText = await navigator.clipboard.readText();
      }
    } catch (_) {
      // 读取失败也不报错，转入输入模式
    }

    const code6 = parseClipboardTo6(clipText);

    e.preventDefault();
    e.stopPropagation();

    if (code6) {
      runWithCode(code6);
    } else {
      ensurePanelOpenAndFocus();
      if (clipText) setStatus('剪贴板内容不是 6 位数字，请输入...', 'dim');
    }
  }, true);
})();
