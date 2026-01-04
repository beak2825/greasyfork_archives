// ==UserScript==
// @name         噼里啪啦吞评申诉助手
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  由于噼里啪啦经常不告知吞评论，故开发此申诉工具来一键申诉，可以通过返回结果得知是否被吞评，噼里啪啦的有效申诉存在次数限制。在任意 B 站页面固定显示“申诉”按钮，并把响应详情输出到控制台。
// @author       betterer(不死の祥云)
// @match        https://*.bilibili.com/*
// @run-at       document-idle
// @grant        none
// @icon         https://i2.hdslb.com/bfs/garb/item/d2de77bf182351a5dd0d1b097c372a6c90434a50.png
// @license      GPL-3.0-only
// @licenseURL   https://www.gnu.org/licenses/gpl-3.0.html
// @downloadURL https://update.greasyfork.org/scripts/553381/%E5%99%BC%E9%87%8C%E5%95%AA%E5%95%A6%E5%90%9E%E8%AF%84%E7%94%B3%E8%AF%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553381/%E5%99%BC%E9%87%8C%E5%95%AA%E5%95%A6%E5%90%9E%E8%AF%84%E7%94%B3%E8%AF%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 许可证说明：本脚本采用 GNU 通用公共许可证 第3版（GPL-3.0-only）。
// 你可以自由复制、分发和修改本脚本，但必须在相同许可证（GPLv3）下发布衍生作品并保留原作者信息。
// 详情见 https://www.gnu.org/licenses/gpl-3.0.html

(function () {
  'use strict';

  // ========== 常量与 UI 模板 ==========
  const API_URL = 'https://api.bilibili.com/x/v2/reply/appeal/submit';      // 评论申诉接口
  const HISTORY_KEY = 'appeal_success_times';

  const UI_HTML = `
  <style>
    /* UI 样式 */
    #appeal-overlay { display:none; position:fixed; inset:0; background:transparent; z-index:999 }
    #appeal-dialog { display:none; position:fixed; right:50%; bottom:8%; transform:translateX(50%); width:360px; padding:12px; background:#fff; box-shadow:0 6px 20px rgba(0,0,0,0.2); border-radius:6px; z-index:10000; font-family:Arial,Helvetica,sans-serif }
    #appeal-title{ font-size:16px; font-weight:700; margin:0 0 8px }
    #appeal-message{ font-size:13px; color:#222; white-space:pre-wrap; margin:6px 0 8px }
    #appeal-actions{ text-align:right }
    #appeal-actions button{ margin-left:8px }
    #appeal-cancel{ padding:6px 10px; background:#fff; color:#FB7299; border:1px solid #FB7299; border-radius:4px; cursor:pointer; font-weight:700 }
    #appeal-cancel:hover{ background:#F0F0F0 }
    #appeal-submit{ padding:6px 10px; background:#FB7299; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:700 }
    #appeal-submit:hover{ background:#E06680 }
    #appeal-fixed-btn{ position:fixed; right:16px; bottom:140px; width:48px; height:48px; border-radius:24px; background:#FB7299; color:#fff; border:none; box-shadow:0 2px 8px rgba(0,0,0,0.25); cursor:pointer; font-weight:700; z-index:999 }
    #appeal-fixed-btn:hover{ background:#E06680 }
    #appeal-history{ font-size:12px; color:#666; margin-top:6px; display:none }
    @media(max-width:600px){ #appeal-fixed-btn{ right:12px; bottom:120px; width:44px; height:44px } }
  </style>
  <div id="appeal-overlay"></div>
  <div id="appeal-dialog">
    <div id="appeal-title">申诉</div>
    <div id="appeal-message">等待操作</div>
    <div id="appeal-history"></div>
    <div id="appeal-actions"><button id="appeal-cancel">关闭</button><button id="appeal-submit">重新提交申诉</button></div>
  </div>
  <button id="appeal-fixed-btn" title="申诉">申诉</button>
  `;

  // UI 元素引用（init 时赋值）
  let overlay, dialog, titleEl, messageEl, btnCancel, btnSubmit, fixedBtn, historyEl;

  // ========== 本地历史（最近申诉提交成功时间） ==========
  function loadHistory() {
    const raw = localStorage.getItem(HISTORY_KEY) || '[]';
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(arr) {
    const normalized = (Array.isArray(arr) ? arr : []).slice(0, 3);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(normalized));
  }

  function addSuccessTimestamp(ts = new Date()) {
    const arr = loadHistory();
    const iso = (ts instanceof Date) ? ts.toISOString() : String(ts);
    // 去重并保持最新在前
    const uniq = [iso, ...arr.filter(x => x !== iso)];
    saveHistory(uniq);
  }

  function renderHistory() {
    if (!historyEl) return;
    const arr = loadHistory();
    if (!arr || arr.length === 0) {
      historyEl.style.display = 'none';
      historyEl.innerHTML = '';
      return;
    }
    historyEl.style.display = 'block';
    const items = arr.slice(0, 3).map((s, i) => {
      const d = new Date(s);
      const label = isNaN(d.getTime()) ? s : d.toLocaleString();
      return `<div>${i + 1}. ${label}</div>`;
    }).join('');
    historyEl.innerHTML = `<div style="font-weight:600;margin-top:6px">最近申诉提交成功时间</div>${items}`;
  }

  // ========== 工具函数 ==========
  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(^|\\s)' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : '';
  }

  // ========== 构建请求头 ==========
  function buildFetchOptions(bodyString) {
    return {
      method: 'POST',
      credentials: 'include',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json, text/plain, */*',
        'origin': 'https://www.bilibili.com',
        'referer': 'https://www.bilibili.com/blackboard/cmmnty-appeal.html'
      },
      body: bodyString
    };
  }

  // ========== 统一网络请求与日志封装 ==========
  /**
   * 发送 HTTP 请求并统一记录控制台日志
   * @param {string} url - 请求地址
   * @param {object} options - fetch 选项
   * @param {string} [logPrefix='请求'] - 控制台日志分组前缀
   * @returns {Promise<{parsed: object|null, raw: string, res: Response}>}
   */
  async function fetchWithLog(url, options, logPrefix = '请求') {
    console.groupCollapsed(`[${logPrefix}] 接口响应`);
    console.log(`[${logPrefix}] 发送请求：`, {url, options});

    const res = await fetch(url, options);
    const raw = await res.clone().text();
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = null;
    }

    console.log('URL:', url);
    console.log('Status:', res.status, res.statusText);

    const headers = {};
    res.headers.forEach((v, k) => headers[k] = v);
    console.log('Headers:', headers);
    console.log('Raw response text:', raw);
    console.log('Parsed JSON:', parsed);

    // 如果有请求体，也打印出来
    if (options.body) {
      if (options.headers?.['content-type']?.includes('application/json')) {
        console.log('Request body (JSON):', options.body);
      } else {
        console.log('Request body (URL-encoded):', options.body);
      }
    }

    console.groupEnd();

    return {parsed, raw, res};
  }

  /**
   * 提交普通评论申诉（使用 URLencoded）
   * @param {string} bodyString - URL-encoded 字符串 (e.g., "type=1&...&csrf=...")
   * @returns {Promise<{parsed: object|null, raw: string, res: Response}>}
   */
  async function postAppeal(bodyString) {
    return fetchWithLog(API_URL, buildFetchOptions(bodyString), '申诉');
  }

  /**
   * 统一显示申诉结果（含返回码）
   * @param {string} title - 标题（如“申诉提交成功”）
   * @param {string} message - 主要提示信息
   * @param {boolean} success - 是否成功（用于记录时间）
   * @param {number} [code] - 接口返回的 code 值（可选）
   */
  function showAppealResult(title, message, success = false, code = null) {
    if (dialog) dialog.style.display = 'block';
    if (overlay) overlay.style.display = 'block';

    if (titleEl) titleEl.textContent = title;

    // 构造完整消息：主信息 + code
    let fullMessage = message;
    if (code !== null) {
      fullMessage += `\n\n(返回码: ${code})`;
    }

    if (messageEl) messageEl.textContent = fullMessage;

    // 成功时记录时间
    if (success) {
      addSuccessTimestamp(new Date());
    }

    renderHistory();
  }

  function hideAppealDialog() {
    if (overlay) overlay.style.display = 'none';
    if (dialog) dialog.style.display = 'none';
  }

  // ========== UI 初始化 ==========
  function createUI() {
    const existing = document.getElementById('appeal-fixed-btn');
    if (!existing) {
      document.body.insertAdjacentHTML('beforeend', UI_HTML);
    }
    return {
      overlay: document.getElementById('appeal-overlay'),
      dialog: document.getElementById('appeal-dialog'),
      titleEl: document.getElementById('appeal-title'),
      messageEl: document.getElementById('appeal-message'),
      btnCancel: document.getElementById('appeal-cancel'),
      btnSubmit: document.getElementById('appeal-submit'),
      fixedBtn: document.getElementById('appeal-fixed-btn'),
      historyEl: document.getElementById('appeal-history')
    };
  }

  function init() {
    if (!document.body) {
      window.addEventListener('DOMContentLoaded', init, {once: true});
      return;
    }

    const ui = createUI();
    overlay = ui.overlay;
    dialog = ui.dialog;
    titleEl = ui.titleEl;
    messageEl = ui.messageEl;
    btnCancel = ui.btnCancel;
    btnSubmit = ui.btnSubmit;
    fixedBtn = ui.fixedBtn;
    historyEl = ui.historyEl;

    if (!dialog) return;
    if (dialog.dataset.appealInited === '1') return;
    dialog.dataset.appealInited = '1';

    btnCancel.addEventListener('click', hideAppealDialog);
    fixedBtn.addEventListener('click', async () => {
      await submitAppealFlow();
    });
    btnSubmit.addEventListener('click', async () => {
      await submitAppealFlow();
    });
  }

  init();

  // ========== 主申诉流程 ==========
  /**
   * 提交申诉主流程
   * @param {{bvidOrOid?:string,type?:number,reasonText?:string}} opts
   */
  async function submitAppealFlow({type = 1, reasonText = '我的评论可能被误判，请求复核'} = {}) {
    // reasonText 不置 null 跳过对话框
    console.log(`[申诉] 开始提交申诉，参数：type=${type}, url=${window.location.href}`);

    // ==================== 评论申诉流程 ====================
    let reason = reasonText || window.prompt('请输入申诉理由（会作为 reason 字段发送）：', '我的评论可能被误判，请求复核');
    if (!reason) {
      showAppealResult('已取消', '未提供申诉理由，申诉取消');
      return;
    }

    const csrf = getCookie('bili_jct') || '';
    const params = new URLSearchParams();
    params.set('type', String(type));
    params.set('reason', reason);
    params.set('url', document.location.href);
    params.set('csrf', csrf);

    try {
      const {parsed} = await postAppeal(params.toString());

      if (parsed && parsed.code === 0) {
        showAppealResult('申诉提交成功', parsed?.data?.success_toast || '申诉提交成功', true, parsed?.code);
        return;
      }

      // 特定错误：无可申诉评论
      if (parsed && parsed.code === 12082) {
        showAppealResult('无需申诉', '该bv号或链接下无可申诉评论', false, 12082);
        return;
      }

      // 常规失败
      showAppealResult(
        '申诉提交失败',
        parsed?.message || `服务器返回：${parsed?.code ?? 'unknown'}`,
        false,
        parsed?.code
      );

    } catch (err) {
      console.error('[申诉] 网络或执行错误', err);
      showAppealResult('申诉失败', '发生网络或执行错误，详见控制台');
    }
  }

  // 暴露便捷函数用于动态申诉：window.appealDynamicSubmit({ link, reason })
  window.appealDynamicSubmit = async function ({reason = ''} = {}) {
    return submitAppealFlow({reasonText: reason});
  };

})();
