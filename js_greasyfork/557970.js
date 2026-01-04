// ==UserScript==
// @name         薄荷签到助手
// @namespace    https://linux.do/
// @version      0.1.6
// @description  linux.do 提示薄荷签到、抽奖强化与炫酷提示
// @match        https://linux.do/*
// @match        https://qd.x666.me/*
// @match        https://x666.me/*
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js
// @icon         https://linux.do/uploads/default/original/4X/c/5/e/c5ea17002056c51316b5344ed0b8ccbb6661e244.webp
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557970/%E8%96%84%E8%8D%B7%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557970/%E8%96%84%E8%8D%B7%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  /**
   * ==========================================================================
   * 常量与基础配置
   * ==========================================================================
   */
  const CONFIG = {
    iconUrl: 'https://linux.do/uploads/default/original/4X/c/5/e/c5ea17002056c51316b5344ed0b8ccbb6661e244.webp',
    urls: {
      popup: 'https://qd.x666.me/?from=bohe-popup',
      topup: 'https://x666.me/console/topup'
    },
    storage: {
      spinStatus: 'bohe-spin-status',
      latestCdk: 'bohe-latest-cdk',
      topupFinish: 'bohe-topup-finish',
      loginSuccess: 'bohe-login-success',
      floatPos: 'bohe-float-pos',
      logs: 'bohe-logs'
    },
    events: {
      canSpin: 'bohe-event-can-spin',
      topupDone: 'bohe-event-topup-done'
    }
  };
  // 站点刷新以 UTC+8 的 8:00 为界
  const TARGET_TZ_OFFSET_HOURS = 8;
  // 测试模式，无限月读
  const IS_TEST_MODE = GM_getValue('bohe-test-mode', false);
 
  const UTILS = {
    // 按目标时区（UTC+8）计算日期，避免本地时区干扰
    todayStr: () => {
      const now = new Date();
      const diffMinutes = TARGET_TZ_OFFSET_HOURS * 60 + now.getTimezoneOffset();
      const shifted = new Date(now.getTime() + diffMinutes * 60000);
      return shifted.toISOString().slice(0, 10);
    },
    now: () => Date.now(),
    // 计算下一次目标时区小时的本地触发时间（默认 8:00）
    nextTargetTimeMs: (targetHour = 8) => {
      const now = new Date();
      const diffMinutes = TARGET_TZ_OFFSET_HOURS * 60 + now.getTimezoneOffset();
      const toTargetMs = (ts) => ts + diffMinutes * 60000;
      const fromTargetMs = (ts) => ts - diffMinutes * 60000;
 
      const nowTarget = new Date(toTargetMs(now.getTime()));
      const target = new Date(nowTarget);
      target.setHours(targetHour, 0, 1, 0);
      if (target <= nowTarget) target.setDate(target.getDate() + 1);
 
      return fromTargetMs(target.getTime());
    },
    isAfterTargetHour: (hour = 8) => {
      const now = new Date();
      const diffMinutes = TARGET_TZ_OFFSET_HOURS * 60 + now.getTimezoneOffset();
      const targetNow = new Date(now.getTime() + diffMinutes * 60000);
      return targetNow.getHours() >= hour;
    },
    // 等待 DOM 加载完成
    domReady: () => {
      return new Promise(resolve => {
        if (document.readyState !== 'loading') resolve();
        else document.addEventListener('DOMContentLoaded', resolve);
      });
    },
    // 通过 MutationObserver 监听节点变动，等待元素出现
    waitFor: (selector, root = document, timeout = 15000) => {
      return new Promise((resolve, reject) => {
        const existing = root.querySelector(selector);
        if (existing) return resolve(existing);
 
        const observer = new MutationObserver(() => {
          const el = root.querySelector(selector);
          if (el) {
            observer.disconnect();
            clearTimeout(timer);
            resolve(el);
          }
        });
 
        observer.observe(root, { childList: true, subtree: true });
 
        const timer = setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for ${selector}`));
        }, timeout);
      });
    }
  };
 
  /**
   * ==========================================================================
   * 简易日志
   * ==========================================================================
   */
  const Log = {
    retentionMs: 30 * 24 * 60 * 60 * 1000,
    maxItems: 200,
    add(entry) {
      try {
        const now = UTILS.now();
        const logs = GM_getValue(CONFIG.storage.logs, []);
        const fresh = logs.filter((i) => now - i.time <= this.retentionMs);
        fresh.push({ ...entry, time: now });
        GM_setValue(CONFIG.storage.logs, fresh.slice(-this.maxItems));
      } catch (e) {
        console.error('[Bohe] Log write failed:', e);
      }
    },
    error(label, err, extra = {}) {
      const detail = err instanceof Error ? { message: err.message, stack: err.stack } : { message: String(err) };
      this.add({ level: 'error', label, ...detail, extra });
    },
    info(label, extra = {}) {
      this.add({ level: 'info', label, extra });
    },
    exportLogs() {
      const logs = GM_getValue(CONFIG.storage.logs, []);
      const text = JSON.stringify(logs, null, 2);
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bohe-logs-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 1000);
    }
  };

  let testModeMenuId = null;

  function updateTestModeMenu() {
    try {
      // 注销旧的菜单（如果存在）
      if (testModeMenuId !== null) {
        GM_unregisterMenuCommand(testModeMenuId);
        testModeMenuId = null;
      }

      const isTestMode = GM_getValue('bohe-test-mode', false);
      const menuText = isTestMode ? '破除无限月读' : '发动无限月读';

      testModeMenuId = GM_registerMenuCommand(menuText, () => {
        const current = GM_getValue('bohe-test-mode', false);
        GM_setValue('bohe-test-mode', !current);
        alert(`测试模式已${!current ? '开启' : '关闭'}，刷新页面后生效`);
        updateTestModeMenu(); // 更新菜单文本
      });
    } catch (_) {}
  }

  try {
    GM_registerMenuCommand('导出薄荷日志', () => Log.exportLogs());
    updateTestModeMenu();
  } catch (_) {}
 
  /**
   * ==========================================================================
   * 站内跨页面消息桥（事件总线）
   * ==========================================================================
   */
  const Bridge = {
    // 仅允许主域及其子域，使用 hostname 避免 linux.do.evil.com 伪装
    allowedOrigins: ['linux.do', 'qd.x666.me', 'x666.me'],
    isAllowedOrigin(origin) {
      try {
        const u = new URL(origin);
        if (u.protocol !== 'https:') return false;
        const host = u.hostname;
        return this.allowedOrigins.some((allowed) =>
          host === allowed || host.endsWith('.' + allowed)
        );
      } catch (_) {
        return false;
      }
    },
    emit: (type, payload) => {
      try {
        // 使用 location.origin 替代 '*'，提高安全性
        window.postMessage({ type, payload, source: 'bohe-bridge' }, location.origin);
      } catch (e) {
        Log.error('Bridge emit failed', e);
      }
    },
    on: (type, callback) => {
      window.addEventListener('message', (event) => {
        console.log('[Bohe] Bridge message received', { origin: event.origin, data: event.data, type });
        if (!event.origin || !Bridge.isAllowedOrigin(event.origin)) return;
        if (event.data?.source === 'bohe-bridge' && event.data?.type === type) {
          callback(event.data.payload);
        }
      });
    }
  };
 
  /**
   * ==========================================================================
   * UI 系统（Shadow DOM 容器）
   * ==========================================================================
   */
  class BoheUI {
    constructor() {
      this.host = document.createElement('div');
      this.host.id = 'bohe-ui-host';
      this.host.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 2147483647; pointer-events: none;';
      document.body.appendChild(this.host);
      this.shadow = this.host.attachShadow({ mode: 'closed' });
      this.injectStyles();
    }
 
    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        :host { font-family: system-ui, -apple-system, sans-serif; } 
        
                /* 悬浮签到按钮 */
                .float-btn {
                  position: fixed;
                  top: 120px;
                  pointer-events: auto;
                  display: flex;
                  align-items: center;
                  gap: 0;
                  padding: 10px;
                  padding-left: 12px;
                  background: linear-gradient(135deg, #48d1a0, #3fb58c);
                  color: #fff;
                  cursor: pointer;
                  font-size: 14px;
                  font-weight: 600;
                  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                  opacity: 0;
                  z-index: 999999;
                  user-select: none;
                  touch-action: none;
                }
                .float-btn.right {
                  right: 0;
                  border-radius: 30px 0 0 30px;
                  box-shadow: -2px 4px 15px rgba(63, 181, 140, 0.3);
                  transform: translateX(100%);
                }
                .float-btn.left {
                  left: 0;
                  border-radius: 0 30px 30px 0;
                  box-shadow: 2px 4px 15px rgba(63, 181, 140, 0.3);
                  transform: translateX(-100%);
                }
                .float-btn.visible {
                  opacity: 1;
                  transform: translateX(0);
                }
                .float-btn.right:hover {
                  padding-right: 16px;
                  border-radius: 30px;
                  transform: translateX(0);
                  box-shadow: 0 8px 25px rgba(63, 181, 140, 0.5);
                }
                .float-btn.left:hover {
                  padding-right: 16px;
                  border-radius: 30px;
                  transform: translateX(0);
                  box-shadow: 0 8px 25px rgba(63, 181, 140, 0.5);
                }
                .float-btn.dragging {
                  transition: none !important;
                  box-shadow: 0 8px 25px rgba(63, 181, 140, 0.5);
                  cursor: grabbing;
                }
                .float-btn img {
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
                  pointer-events: none;
                }
                .float-btn span {
                  max-width: 0;
                  opacity: 0;
                  overflow: hidden;
                  white-space: nowrap;
                  transition: all 0.3s ease;
                  pointer-events: none;
                }
                .float-btn:hover span {
                  max-width: 100px;
                  opacity: 1;
                  margin-left: 8px;
                }
                
        /* 拖拽提示 */
        .drag-hint {
          position: absolute;
          top: -38px;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          z-index: 1000000;
        }
        .drag-hint::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
        }
        .float-btn[data-is-default="true"]:hover .drag-hint {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* 烟花弹窗文案 */
        .fw-overlay {
          position: fixed; inset: 0; 
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .fw-text {
          font-size: 6rem; font-weight: 900;
          color: #48d1a0;
          text-shadow: 2px 2px 0px #2d8a68, 4px 4px 0px #1a5c43, 0 0 30px rgba(72, 209, 160, 0.8);
          display: flex; gap: 0.05em;
          filter: drop-shadow(0 0 8px rgba(255,255,255,0.5));
        }
        .fw-char {
          display: inline-block;
          position: relative;
          animation: jump 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        .fw-char::after {
          content: '';
          position: absolute;
          top: 15%; left: 50%;
          width: 6px; height: 8px;
          background: #ff5e5e;
          transform-origin: top center;
          animation: sway 2s ease-in-out infinite alternate;
          border-radius: 50%;
          z-index: 1;
          opacity: 0.9;
          box-shadow: 8px 12px 0 -1px #f4d03f, -10px 15px 0 -1px #48d1a0;
        }
        .fw-char:nth-child(odd)::after { background: #48d1a0; width: 5px; height: 6px; animation-delay: 0.2s; box-shadow: 12px 10px 0 -1px #ff5e5e; }
        .fw-char:nth-child(3n)::after { background: #f4d03f; width: 7px; height: 9px; animation-delay: 0.4s; box-shadow: -12px 12px 0 -1px #3fb58c; }
 
        @keyframes jump {
          0% { opacity: 0; transform: translateY(80px) scale(0.3); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sway {
          0% { transform: translateX(-50%) rotate(-25deg); }
          100% { transform: translateX(-50%) rotate(25deg); }
        }
      `;
      this.shadow.appendChild(style);
    }
 
    createFloatBtn(onClick, initialPos, onPosChange) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', '打开薄荷签到面板');
      btn.tabIndex = 0;
      const pos = this.applyFloatPosition(btn, initialPos);
      btn.classList.add('float-btn', pos.side);

      // 初始位置检测 (默认右侧 120px)
      if (pos.side === 'right' && Math.abs(pos.top - 120) < 1) {
        btn.dataset.isDefault = 'true';
      }

      btn.innerHTML = `
        <img src="${CONFIG.iconUrl}" alt="Bohe" />
        <span>薄荷签到</span>
        <div class="drag-hint">可拖拽</div>
      `;
      
      this.enableDrag(btn, pos, onPosChange, onClick);
      // 键盘无障碍支持
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      });
      this.shadow.appendChild(btn);
      
      // 通过下一帧触发过渡，让按钮滑入
      requestAnimationFrame(() => btn.classList.add('visible'));
      
      return btn;
    }
 
    applyFloatPosition(btn, pos = {}) {
      const side = pos.side === 'left' ? 'left' : 'right';
      const rawTop = Number.isFinite(pos.top) ? pos.top : 120;
      const clampedTop = Math.min(Math.max(rawTop, 10), Math.max(20, window.innerHeight - 80));
      btn.classList.remove('left', 'right');
      btn.classList.add(side);
      btn.style.left = side === 'left' ? '0' : 'auto';
      btn.style.right = side === 'right' ? '0' : 'auto';
      btn.style.top = `${clampedTop}px`;
      return { side, top: clampedTop };
    }
 
    enableDrag(btn, initialPos, onPosChange, onClick) {
      let lastPos = this.applyFloatPosition(btn, initialPos);
      let startX = 0;
      let startY = 0;
      let startTime = 0;
      
      const onPointerDown = (e) => {
        if (e.button !== 0) return; // 仅左键
        btn.setPointerCapture(e.pointerId);
        
        startX = e.clientX;
        startY = e.clientY;
        startTime = Date.now();
        
        const rect = btn.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
 
        const move = (ev) => {
          // 移动超过 5px 才视为拖拽开始，避免手抖
          if (!btn.classList.contains('dragging') && 
              (Math.abs(ev.clientX - startX) > 5 || Math.abs(ev.clientY - startY) > 5)) {
            btn.classList.add('dragging');
          }
 
          if (btn.classList.contains('dragging')) {
            const x = ev.clientX - offsetX;
            const y = ev.clientY - offsetY;
            const clampedTop = Math.min(Math.max(y, 10), window.innerHeight - btn.offsetHeight - 10);
            const clampedLeft = Math.min(Math.max(x, 0), window.innerWidth - btn.offsetWidth);
            btn.style.left = `${clampedLeft}px`;
            btn.style.right = 'auto';
            btn.style.top = `${clampedTop}px`;
            btn.classList.remove('left', 'right');
          }
        };
 
        const up = (ev) => {
          const endTime = Date.now();
          const dist = Math.sqrt(Math.pow(ev.clientX - startX, 2) + Math.pow(ev.clientY - startY, 2));
          const isDrag = btn.classList.contains('dragging') || dist > 5;
 
          btn.classList.remove('dragging');
          btn.releasePointerCapture(e.pointerId);
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
 
          if (isDrag) {
            // 拖拽结束：吸附边缘并保存位置
            const centerX = ev.clientX;
            const side = centerX < window.innerWidth / 2 ? 'left' : 'right';
            const finalPos = this.applyFloatPosition(btn, { side, top: parseFloat(btn.style.top) || lastPos.top });
            
            // 更新是否在默认位置的状态
            if (finalPos.side === 'right' && Math.abs(finalPos.top - 120) < 1) {
              btn.dataset.isDefault = 'true';
            } else {
              delete btn.dataset.isDefault;
            }

            lastPos = finalPos;
            onPosChange(finalPos);
          } else {
            // 点击判定：距离小且时间短，或者单纯未触发拖拽
             onClick(ev);
          }
        };
 
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      };
 
      btn.addEventListener('pointerdown', onPointerDown);
    }
 
    showFireworksText(text) {
      const overlay = document.createElement('div');
      overlay.className = 'fw-overlay';
      const container = document.createElement('div');
      container.className = 'fw-text';
      overlay.appendChild(container);
      this.shadow.appendChild(overlay);
 
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'fw-char';
        span.style.animationDelay = `${i * 0.1}s`;
        container.appendChild(span);
      });
 
      // 延迟淡出并移除节点，避免残留
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
      }, 4000);
    }
  }
 
  // 全局 UI 实例
  let ui = null;
 
  /**
   * ==========================================================================
   * 模块：linux.do 站内集成
   * ==========================================================================
   */
  async function initLinux() {
    // 等待 DOM 准备好再渲染 UI
    await UTILS.domReady();
 
    ui = new BoheUI();
    
    const state = {
      spinStatus: GM_getValue(CONFIG.storage.spinStatus, null),
      floatPos: GM_getValue(CONFIG.storage.floatPos, { side: 'right', top: 120 }),
      floatBtn: null,
      popupWindow: null,
      topupHandledAt: 0,
    };
 
    // 1. 悬浮按钮
    state.floatBtn = ui.createFloatBtn(
      () => openOverlay(state),
      state.floatPos,
      (pos) => {
        state.floatPos = pos;
        GM_setValue(CONFIG.storage.floatPos, pos);
      }
    );
    
    // 2. 同步抽奖状态
    GM_addValueChangeListener(CONFIG.storage.spinStatus, (_, __, val) => {
      state.spinStatus = val;
      updateBtnVisibility(state);
    });
    updateBtnVisibility(state);
 
    // 3. 监听充值成功事件
    GM_addValueChangeListener(CONFIG.storage.topupFinish, (_, __, val) => {
      if (!val || val.time === state.topupHandledAt) return;
      state.topupHandledAt = val.time;
      closeOverlay(state);
      triggerFireworks(val.message || '恭喜佬薄荷签到获得10000点');
    });
 
    // 4. 搜索彩蛋
    setupSearchEgg();
  }
 
  function updateBtnVisibility(state) {
    if (!state.floatBtn) return;
    const s = state.spinStatus;
    const canSpin = s?.canSpin;
    const isDone = s && s.date === UTILS.todayStr() && (canSpin === false || canSpin === 0) && !IS_TEST_MODE;
    state.floatBtn.style.display = isDone ? 'none' : 'flex';
  }
 
  function openOverlay(state) {
    if (state.popupWindow && !state.popupWindow.closed) {
      state.popupWindow.focus();
      return;
    }
    const w = Math.min(520, window.screen.availWidth * 0.6);
    const h = Math.min(900, window.screen.availHeight * 0.86);
    const l = (window.screen.availWidth - w) / 2;
    const t = (window.screen.availHeight - h) / 2;
    
    state.popupWindow = window.open(
      CONFIG.urls.popup, 
      'bohe-popup',
      `width=${w},height=${h},left=${l},top=${t},resizable=yes,scrollbars=yes`
    );
  }
 
  function closeOverlay(state) {
    if (state.popupWindow && !state.popupWindow.closed) state.popupWindow.close();
    state.popupWindow = null;
  }
 
  function setupSearchEgg() {
    let eggTriggered = false;
    document.body.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'header-search-input') {
        const val = e.target.value.trim();
        if (val === '薄荷' && !eggTriggered) {
          eggTriggered = true;
          triggerFireworks('我爱薄荷佬');
          setTimeout(() => (eggTriggered = false), 8000);
        }
      }
    });
  }
 
  /**
   * ==========================================================================
   * 模块：抽奖页（qd.x666.me）
   * ==========================================================================
   */
  async function initQd() {
    // 1. 优先注入网络拦截器（无需等待 DOM）
    setupNetworkInterceptor();
 
    // 2. 等待 DOM 处理 UI
    await UTILS.domReady();
 
    const params = new URLSearchParams(location.search);
    if (params.has('from')) {
        sessionStorage.setItem('bohe_from', params.get('from'));
    }
    const fromSource = params.get('from') || sessionStorage.getItem('bohe_from');
 
    // 仅脚本打开时隐藏榜单
    if (fromSource) {
      const style = document.createElement('style');
      style.textContent = '#mainContent .ranking-panel{display:none !important;}';
      document.head.appendChild(style);
    }
 
    // 3. 监听消息
    Bridge.on(CONFIG.events.canSpin, (payload) => {
      Log.info('Bridge canSpin event received', payload);
      const prev = GM_getValue(CONFIG.storage.spinStatus, {});
      GM_setValue(CONFIG.storage.spinStatus, {
        ...prev,
        canSpin: payload.canSpin,
        date: payload.date || UTILS.todayStr(),
        time: UTILS.now()
      });
    });
 
    tweakResultModal();
    tweakSpinBtn();
    observeCdk();
  }
 
  function setupNetworkInterceptor() {
    // 立即执行：在页面脚本执行前挂载 fetch 代理
    const interceptorFn = (eventName, isTestMode) => {
      const PATCH_KEY = '__bohe_fetch_patched__';
      if (window[PATCH_KEY]) return;
      
      const origFetch = window.fetch;
      const dateStr = () => {
        // 简单模拟 UTC+8 日期字符串
        const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
        return now.toISOString().slice(0, 10);
      };
 
      const wrapped = new Proxy(origFetch, {
        apply(target, thisArg, args) {
          return target.apply(thisArg, args).then(async (res) => {
            const url = (typeof args[0] === 'string' ? args[0] : args[0]?.url) || '';
 
            // 拦截用户信息接口
            if (url.includes('/api/user/info')) {
              // 异步通知脚本
              res.clone().json().then(data => {
                console.log('[Bohe] Interceptor sending canSpin event', { canSpin: data?.data?.can_spin, date: dateStr() });
                window.postMessage({
                  source: 'bohe-bridge',
                  type: eventName,
                  payload: { canSpin: data?.data?.can_spin, date: dateStr() }
                }, location.origin);
              }).catch(() => {});
 
              // 修改显示配额 (UI效果)
              try {
                const data = await res.clone().json();
                if (data?.data?.user?.total_quota !== undefined) {
                  data.data.user.total_quota *= 88;
                }
                return new Response(JSON.stringify(data), {
                  status: res.status,
                  statusText: res.statusText,
                  headers: res.headers
                });
              } catch (_) {
                return res;
              }
            }
 
            // 拦截抽奖接口
            if (url.includes('/api/lottery/spin')) {
              let realData = null;
              try { realData = await res.clone().json(); } catch (_) {}

              const emitSpinDone = () => {
                window.postMessage({
                  source: 'bohe-bridge',
                  type: eventName,
                  payload: { canSpin: false, date: dateStr() }
                }, location.origin);
              };

              if (res.ok && realData?.success !== false && realData?.data?.cdk) {
                emitSpinDone();
              }

              // 测试模式
              if (isTestMode && !realData?.data?.cdk) {
                emitSpinDone();
                return new Response(JSON.stringify({
                  success: true,
                  data: { level: 1, label: '10000次', cdk: 'BOHE-TEST-CDK-10000' }
                }), { status: 200, headers: { 'Content-Type': 'application/json' } });
              }
              // 视觉修改
              try {
                const data = await res.clone().json();
                if (data && data.data && typeof data.data.level !== 'undefined') {
                  data.data.level = 1;
                  data.data.label = '10000次';
                  return new Response(JSON.stringify(data), {
                    status: res.status,
                    statusText: res.statusText,
                    headers: res.headers
                  });
                }
              } catch (_) {
                return res;
              }
            }
 
            return res;
          });
        }
      });
      window.fetch = wrapped;
      window[PATCH_KEY] = true;
    };
 
    const script = document.createElement('script');
    script.textContent = `(${interceptorFn.toString()})('${CONFIG.events.canSpin}', ${IS_TEST_MODE});`;
    // documentElement 即使在 document-start 时也存在
    (document.head || document.documentElement).appendChild(script);
    // 测试模式下保留 script 元素便于调试
    if (!IS_TEST_MODE) {
      script.remove();
    }
  }
 
  function tweakSpinBtn() {
    if (!IS_TEST_MODE) return;
    const update = () => {
      const btn = document.getElementById('spinButton');
      if (btn) {
        if (btn.disabled) btn.disabled = false;
        if (btn.textContent.includes('今日已抽奖')) btn.textContent = '开始转动';
      }
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
    window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
  }
 
  function tweakResultModal() {
    const patchButton = (btn) => {
      btn.dataset.patched = '1';
      btn.textContent = '确定并自动兑换';
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const modal = document.getElementById('resultModal');
        if (modal) modal.style.display = 'none';
        
        const cdkText = document.getElementById('resultCdk')?.textContent || '';
        const match = cdkText.match(/([A-Za-z0-9-]+)/);
        const cdk = match ? match[1] : '';
        if (cdk) GM_setValue(CONFIG.storage.latestCdk, cdk);
        
        window.location.href = cdk 
          ? `${CONFIG.urls.topup}?cdk=${encodeURIComponent(cdk)}` 
          : CONFIG.urls.topup;
      });
    };
 
    const observer = new MutationObserver(() => {
      const btn = document.querySelector('#resultModal .close-button');
      if (btn && !btn.dataset.patched) patchButton(btn);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
  }
 
  function observeCdk() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.target.id === 'resultCdk' || m.target.parentElement?.id === 'resultCdk') {
           const text = document.getElementById('resultCdk')?.textContent || '';
           const match = text.match(/([A-Za-z0-9-]+)/);
           if (match) GM_setValue(CONFIG.storage.latestCdk, match[1]);
        }
      }
    });
    
    UTILS.waitFor('#resultCdk').then(el => {
       observer.observe(el, { characterData: true, childList: true, subtree: true });
       window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
    }).catch(() => {});
  }
 
  /**
   * ==========================================================================
   * 模块：充值页（x666.me）
   * ==========================================================================
   */
  async function initX666() {
    const path = location.pathname;
 
    // 1. 登录回跳检测
    GM_addValueChangeListener(CONFIG.storage.loginSuccess, (_, __, val) => {
         if (val && (Date.now() - val < 10000)) {
             handleRedirectToTopup();
         }
    });
 
    if (window.opener) {
        const checkAndClose = () => {
            let isScriptPopup = false;
            try { isScriptPopup = window.opener.name === 'bohe-popup'; } catch (e) {}
            if (!isScriptPopup) return false;
            if (location.pathname.includes('/console/token')) {
                 GM_setValue(CONFIG.storage.loginSuccess, Date.now());
                 setTimeout(() => window.close(), 300);
                 return true;
            }
            return false;
        };
        if (!checkAndClose()) setInterval(checkAndClose, 500);
    }
 
    if (path.includes('/console/topup')) {
        injectTopupInterceptor();
        // 确保 DOM 准备好后再填充
        await UTILS.domReady();
        autofill();
        return;
    }
 
    if ((path === '/console' || path === '/console/') && !window.opener) {
        handleRedirectToTopup();
    }
  }
 
  function handleRedirectToTopup() {
      const cdk = GM_getValue(CONFIG.storage.latestCdk, '');
      const target = cdk 
        ? `${CONFIG.urls.topup}?cdk=${encodeURIComponent(cdk)}` 
        : CONFIG.urls.topup;
      if (!location.href.includes(target)) window.location.href = target;
  }
 
  function injectTopupInterceptor() {
    const interceptorFn = (eventName) => {
      const PATCH_KEY = '__bohe_topup_patched__';
      if (window[PATCH_KEY]) return;
      
      const notify = () => {
        window.postMessage({ 
          source: 'bohe-bridge', 
          type: eventName, 
          payload: { message: '恭喜佬薄荷签到获得10000点' } 
        }, location.origin);
      };
 
      const shouldNotify = (data, status) => {
        if (status && status >= 400) return false;
        if (data && typeof data === 'object' && data.success === false) return false;
        return true;
      };
 
      // XHR Interception
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) {
        this._isTopup = url && url.includes('/api/user/topup');
        return origOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function () {
        if (this._isTopup) {
          this.addEventListener('loadend', () => {
            let parsed = null;
            try { parsed = JSON.parse(this.responseText || '{}'); } catch (_) {}
            if (shouldNotify(parsed, this.status)) notify();
          });
        }
        return origSend.apply(this, arguments);
      };
      
      // Fetch Interception
      const origFetch = window.fetch;
      const wrappedFetch = new Proxy(origFetch, {
        apply(target, thisArg, args) {
          return target.apply(thisArg, args).then(async (res) => {
            const url = (typeof args[0] === 'string' ? args[0] : args[0]?.url) || '';
            if (url.includes('/api/user/topup')) {
              if (!res.ok) return res;
              try {
                const data = await res.clone().json();
                if (shouldNotify(data, res.status)) notify();
              } catch (_) {}
            }
            return res;
          });
        }
      });
      window.fetch = wrappedFetch;
      window[PATCH_KEY] = true;
    };
 
    const script = document.createElement('script');
    script.textContent = `(${interceptorFn.toString()})('${CONFIG.events.topupDone}');`;
    (document.head || document.documentElement).appendChild(script);
    // 测试模式下保留 script 元素便于调试
    if (!IS_TEST_MODE) {
      script.remove();
    }
 
    Bridge.on(CONFIG.events.topupDone, (payload) => {
      GM_setValue(CONFIG.storage.topupFinish, { time: UTILS.now(), message: payload.message });
      GM_setValue(CONFIG.storage.latestCdk, '');
      setTimeout(() => window.close(), 800);
    });
  }
 
  async function autofill() {
    const params = new URLSearchParams(location.search);
    const cdk = params.get('cdk') || GM_getValue(CONFIG.storage.latestCdk, '');
    if (!cdk) return;
 
    try {
        const input = await UTILS.waitFor('#redemptionCode');
        
        const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(input, cdk);
        } else {
          input.value = cdk;
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // 查找按钮：优先兄弟节点，其次父级兄弟节点
        let btn = null;
        try {
            // 尝试在父容器附近寻找按钮，增加容错
            const parent = input.parentElement?.parentElement || document.body;
            btn = await UTILS.waitFor('.semi-button-primary', parent, 3000);
        } catch (e) {
            console.warn('[Bohe] Button lookup timeout');
        }
        
        if (btn) {
             // 稍微延迟一下，显得更自然，也给 React 状态更新留出时间
             setTimeout(() => btn.click(), 300);
        }
    } catch (e) {
        console.error('[Bohe] Autofill failed', e);
    }
  }
 
  /**
   * ==========================================================================
   * 共享特效
   * ==========================================================================
   */
  async function triggerFireworks(text) {
    if (typeof confetti === 'undefined') return;
    
    // UI 必须就绪
    if (!ui) {
        await UTILS.domReady();
        if (!ui) ui = new BoheUI();
    }
 
    const colors = ['#ff4d4d', '#48d1a0', '#3fb58c', '#ffffff', '#f4d03f', '#ff5e5e', '#1a73e8', '#9c27b0', '#ff9800', '#00ffff', '#ff00ff'];
    let leaf = null;
    try { leaf = confetti.shapeFromText({ text: '🍃', scalar: 3 }); } catch (_) {}
    
    const end = Date.now() + 3000;
    (function frame() {
      const opts = {
        colors, 
        shapes: leaf ? [leaf, 'circle', 'square'] : ['circle', 'square'],
        scalar: 1.3, startVelocity: 70, zIndex: 2147483647 
      };
      
      confetti({ ...opts, particleCount: 7, angle: 55, spread: 90, origin: { x: 0, y: 0.65 } });
      confetti({ ...opts, particleCount: 7, angle: 125, spread: 90, origin: { x: 1, y: 0.65 } });
      
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
 
    if (ui) ui.showFireworksText(text);
  }
 
  /**
   * ==========================================================================
   * 入口
   * ==========================================================================
   */
  const host = location.hostname;
  try {
    if (host.includes('linux.do')) initLinux();
    else if (host === 'qd.x666.me') initQd();
    else if (host === 'x666.me') initX666();
  } catch (err) {
    console.error('[Bohe] Init error:', err);
  }
 
})();