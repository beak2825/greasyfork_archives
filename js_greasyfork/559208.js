// ==UserScript==
// @name         ChatGPT 长对话卡顿优化
// @namespace    chatgpt-conversation-pruner
// @version      1.0
// @description  chatgpt长对话卡顿是因为前端一次性加载了全部对话，导致每次新增对话时要渲染的聊天太多，因此可以通过设置属性为display=none来部分解决，通过卸载部分DOM来进一步缓解。
// @match        https://chatgpt.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/559208/ChatGPT%20%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559208/ChatGPT%20%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /************* 🔧 状态参数（可动态修改） *************/
  let KEEP_VISIBLE = 8;
  let HIDE_BEYOND = 10;
  let ENABLE_REMOVE = false;
  const BOOT_CHECK_INTERVAL = 500;

  // UI 状态持久化 key
  const UI_STATE_KEY = 'cgpt_pruner_ui_minimized_v1';
  /*****************************************************/

  function getTurns() {
    return Array.from(
      document.querySelectorAll('article[data-testid^="conversation-turn"]')
    );
  }

  function prune() {
    const turns = getTurns();
    const total = turns.length;
    if (total <= HIDE_BEYOND) return;

    const removeBefore = ENABLE_REMOVE ? total - HIDE_BEYOND : -1;
    const hideBefore = total - KEEP_VISIBLE;

    for (let i = 0; i < total; i++) {
      const el = turns[i];

      if (ENABLE_REMOVE && i < removeBefore) {
        el.remove();
      } else if (i < hideBefore) {
        el.style.display = 'none';
      }
    }
  }

  function startObserver() {
    const observer = new MutationObserver(prune);
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[ChatGPT Pruner] Observer started');
  }

  function waitForChat() {
    const timer = setInterval(() => {
      if (getTurns().length > 0) {
        clearInterval(timer);
        prune();
        startObserver();
      }
    }, BOOT_CHECK_INTERVAL);
  }

  /************* 🪟 浮窗 UI（Shadow DOM + 最小化） *************/
  function createPanel() {
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.bottom = '20px';
    host.style.right = '20px';
    host.style.zIndex = '999999';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
        .panel, .mini {
          background: #111;
          color: #eee;
          border-radius: 10px;
          box-shadow: 0 6px 20px rgba(0,0,0,.4);
          border: 1px solid rgba(255,255,255,.08);
        }
        .panel {
          width: 240px;
          padding: 10px;
          font-size: 12px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .title { font-weight: 600; font-size: 12px; opacity: .95; }
        .iconBtn {
          width: 26px; height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.06);
          color: #fff;
          cursor: pointer;
          user-select: none;
        }
        .iconBtn:hover { background: rgba(255,255,255,.12); }
        .row { margin-bottom: 8px; }
        label { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        input[type="number"] {
          width: 70px;
          background: #1b1b1b;
          color: #fff;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 6px;
          padding: 4px 6px;
          outline: none;
        }
        input[type="checkbox"] { transform: scale(1.05); }
        button.apply {
          width: 100%;
          margin-top: 6px;
          padding: 6px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,.12);
          cursor: pointer;
          background: rgba(255,255,255,.08);
          color: #fff;
        }
        button.apply:hover { background: rgba(255,255,255,.14); }
        .hint { opacity: 0.7; font-size: 11px; margin-top: 6px; line-height: 1.3; }

        .mini {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
        }
        .mini:hover { background: #171717; }
        .miniDot {
          width: 18px;
          height: 18px;
          border-radius: 6px;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.14);
        }

        .hidden { display: none !important; }
      </style>

      <div class="panel" id="panel">
        <div class="header">
          <div class="title">Pruner</div>
          <div class="iconBtn" id="minBtn" title="最小化">—</div>
        </div>

        <div class="row">
          <label>
            <span>真卸载 DOM</span>
            <input type="checkbox" id="removeToggle">
          </label>
        </div>

        <div class="row">
          <label>
            <span>保留最近</span>
            <input type="number" id="keepVisible" min="1">
          </label>
        </div>

        <div class="row">
          <label>
            <span>超过开始处理</span>
            <input type="number" id="hideBeyond" min="1">
          </label>
        </div>

        <button class="apply" id="applyBtn">立即应用</button>
        <div class="hint">关闭卸载并刷新即可恢复全部历史。</div>
      </div>

      <div class="mini hidden" id="mini" title="展开设置">
        <div class="miniDot"></div>
      </div>
    `;

    const $ = (id) => shadow.getElementById(id);

    function setMinimized(minimized) {
      $('panel').classList.toggle('hidden', minimized);
      $('mini').classList.toggle('hidden', !minimized);
      try { localStorage.setItem(UI_STATE_KEY, minimized ? '1' : '0'); } catch (_) {}
    }

    // 初始化控件值
    $('removeToggle').checked = ENABLE_REMOVE;
    $('keepVisible').value = KEEP_VISIBLE;
    $('hideBeyond').value = HIDE_BEYOND;

    // 绑定按钮
    $('applyBtn').onclick = () => {
      ENABLE_REMOVE = $('removeToggle').checked;
      KEEP_VISIBLE = parseInt($('keepVisible').value, 10);
      HIDE_BEYOND = parseInt($('hideBeyond').value, 10);
      prune();
    };

    // 最小化/展开
    $('minBtn').onclick = () => setMinimized(true);
    $('mini').onclick = () => setMinimized(false);

    // 读取持久化状态
    let initMin = false;
    try { initMin = localStorage.getItem(UI_STATE_KEY) === '1'; } catch (_) {}
    setMinimized(initMin);
  }

  waitForChat();
  createPanel();
})();
