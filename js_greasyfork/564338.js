// ==UserScript==
// @name         ChatGPT长对话加速
// @namespace    npm/chatgpt-conversation-speedup
// @version      1.0
// @description  通过智能隐藏旧对话节点，显著降低 ChatGPT 长对话页面的内存占用与渲染卡顿。提供“加速”开关，开启后仅保留最近的对话内容，关闭后瞬间恢复全部历史。安全无损，不修改网页内容。
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564338/ChatGPT%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/564338/ChatGPT%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * Configuration Constants
   * 可动态修改的状态参数
   */
  let KEEP_VISIBLE = 8;
  let HIDE_BEYOND = 10;
  let IS_OPTIMIZED = true; // 默认开启优化
  const BOOT_CHECK_INTERVAL = 500;

  /**
   * LocalStorage Key
   * UI 状态持久化键名
   */
  const UI_STATE_KEY = 'cgpt_pruner_ui_state_v2';


  /**
   * Get Conversation Turns
   * 获取当前页面所有的对话节点DOM
   */
  function getTurns() {
    return Array.from(
      document.querySelectorAll('article[data-testid^="conversation-turn"]')
    );
  }

  /**
   * Prune / Optimize Logic
   * 核心优化逻辑：通过 display:none 隐藏非活跃区的对话节点
   */
  function prune() {
    const turns = getTurns();
    const total = turns.length;

    // 如果未开启优化，或者数量未达到阈值，则全部显示
    if (!IS_OPTIMIZED || total <= HIDE_BEYOND) {
      turns.forEach(el => {
        if (el.style.display === 'none') el.style.display = '';
      });
      return;
    }

    // 开启优化：隐藏旧消息
    const hideBefore = total - KEEP_VISIBLE;

    for (let i = 0; i < total; i++) {
      const el = turns[i];
      if (i < hideBefore) {
        if (el.style.display !== 'none') el.style.display = 'none';
      } else {
        if (el.style.display === 'none') el.style.display = '';
      }
    }
  }

  /**
   * Start Observer
   * 启动 DOM 监听，当新消息出现时触发优化
   */
  function startObserver() {
    const observer = new MutationObserver(prune);
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[ChatGPT Speedup] Observer started');
  }

  /**
   * Wait for Chat Load
   * 等待对话加载完成后初始化
   */
  function waitForChat() {
    const timer = setInterval(() => {
      if (getTurns().length > 0) {
        clearInterval(timer);
        prune();
        startObserver();
      }
    }, BOOT_CHECK_INTERVAL);
  }

  /**
   * Create Settings Panel
   * 创建配置面板 (Shadow DOM isolated)
   */
  function createPanel() {
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.bottom = '20px';
    host.style.right = '20px';
    host.style.zIndex = '10000'; // Ensure visibility
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif; }
        .panel, .mini {
          background: #ffffff;
          color: #111827;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .panel {
          width: 190px;
          padding: 0;
          font-size: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        /* Highlighted Switch Row */
        .switch-row {
          background: #f0fdf4; /* Very light green */
          border-bottom: 1px solid #dcfce7;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .iconBtn {
          width: 20px; height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          color: #10a37f;
          cursor: pointer;
          user-select: none;
          font-size: 14px;
          margin-left: 8px;
        }
        .iconBtn:hover { background: rgba(16, 163, 127, 0.1); }
        
        .settings-body { padding: 12px; }

        .row { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
        .row:last-child { margin-bottom: 0; }
        
        .label { color: #4b5563; font-weight: 500; font-size: 12px; }
        .main-label { color: #065f46; font-weight: 600; font-size: 12px; }
        
        input[type="number"] {
          width: 44px;
          background: #fff;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 2px 0;
          outline: none;
          text-align: center;
          font-size: 12px;
          transition: all 0.2s;
        }
        input[type="number"]:focus { border-color: #10a37f; box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.1); }

        /* Toggle Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 16px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #9ca3af;
            transition: .3s;
            border-radius: 16px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        input:checked + .slider { background-color: #10a37f; }
        input:checked + .slider:before { transform: translateX(14px); }
        
        .controls-group { display: flex; align-items: center; }

        button.apply { display: none; }
        .hint { display: none; }

        .mini {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          transition: transform 0.2s;
          border-radius: 8px;
        }
        .mini:hover { transform: scale(1.05); }
        .miniDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10a37f;
          box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
        }
        .miniDot.off { background: #9ca3af; box-shadow: none; }

        .hidden { display: none !important; }
      </style>

      <div class="panel" id="panel">
        <div class="switch-row">
            <span class="main-label">加速开关</span>
            <div class="controls-group">
                <label class="switch">
                    <input type="checkbox" id="masterToggle">
                    <span class="slider"></span>
                </label>
                <div class="iconBtn" id="minBtn" title="最小化">−</div>
            </div>
        </div>

        <div class="settings-body">
          <div class="row">
            <span class="label">保留最近</span>
            <input type="number" id="keepVisible" min="1">
          </div>

          <div class="row">
            <span class="label">优化阈值</span>
            <input type="number" id="hideBeyond" min="1">
          </div>
        </div>
      </div>

      <div class="mini hidden" id="mini" title="点击展开设置">
        <div class="miniDot" id="miniDot"></div>
      </div>
    `;

    const $ = (id) => shadow.getElementById(id);

    function setMinimized(minimized) {
      $('panel').classList.toggle('hidden', minimized);
      $('mini').classList.toggle('hidden', !minimized);
      updateMiniDot();
      saveState();
    }

    function updateMiniDot() {
      if (IS_OPTIMIZED) $('miniDot').classList.remove('off');
      else $('miniDot').classList.add('off');
    }

    function saveState() {
      const state = {
        minimized: $('panel').classList.contains('hidden'),
        optimized: IS_OPTIMIZED,
        keep: KEEP_VISIBLE,
        threshold: HIDE_BEYOND
      };
      localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
    }

    function loadState() {
      try {
        const raw = localStorage.getItem(UI_STATE_KEY);
        if (raw) {
          const state = JSON.parse(raw);
          setMinimized(state.minimized);
          IS_OPTIMIZED = state.optimized;
          KEEP_VISIBLE = state.keep;
          HIDE_BEYOND = state.threshold;
        } else {
          setMinimized(false); // Default open first time
        }
      } catch (e) { console.error('Load state failed', e); }
    }

    // Apply Logic
    function applySettings() {
      IS_OPTIMIZED = $('masterToggle').checked;
      KEEP_VISIBLE = parseInt($('keepVisible').value, 10) || 8;
      HIDE_BEYOND = parseInt($('hideBeyond').value, 10) || 10;

      prune();
      updateMiniDot();
      saveState();
    }

    // Events
    $('masterToggle').onchange = applySettings; // Instant toggle
    $('keepVisible').onchange = applySettings;  // Auto apply
    $('hideBeyond').onchange = applySettings;   // Auto apply
    $('minBtn').onclick = () => setMinimized(true);
    $('mini').onclick = () => setMinimized(false);

    // Init
    loadState();

    // Sync UI with loaded state
    $('masterToggle').checked = IS_OPTIMIZED;
    $('keepVisible').value = KEEP_VISIBLE;
    $('hideBeyond').value = HIDE_BEYOND;
    updateMiniDot();

    // Initial Prune
    prune();
  }

  waitForChat();
  createPanel();
})();
