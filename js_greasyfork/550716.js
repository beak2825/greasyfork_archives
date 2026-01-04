// ==UserScript==
// @name         网站限制解除脚本 (优化版)
// @namespace    https://web.zyxn.dpdns.org
// @version      5.0
// @description  解锁复制/粘贴/右键，彻底屏蔽 debugger 循环和 eval/Function 注入。
// @author       flkGit (Gemini 优化)
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550716/%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E8%84%9A%E6%9C%AC%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550716/%E7%BD%91%E7%AB%99%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E8%84%9A%E6%9C%AC%20%28%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // --- 基础解锁：右键/复制/粘贴 + F12保护 ---
  const SENSITIVE_EVENTS = [
    'copy', 'paste', 'cut', 'contextmenu', 'selectstart', 'dragstart',
    'keydown', 'keyup', 'keypress'  // 包含键盘事件保护F12等
  ];

  // 优化：在 window 和 document 上同时进行高优先级拦截
  const highPriorityListener = e => {
    // 特殊保护开发者工具快捷键
    if (e.type.startsWith('key')) {
      const isF12 = e.keyCode === 123;
      const isDevTools = e.ctrlKey && e.shiftKey && e.keyCode === 73; // Ctrl+Shift+I
      const isConsole = e.ctrlKey && e.shiftKey && e.keyCode === 74;  // Ctrl+Shift+J
      const isViewSource = e.ctrlKey && e.keyCode === 85;           // Ctrl+U
      const isInspect = e.ctrlKey && e.shiftKey && e.keyCode === 67;  // Ctrl+Shift+C

      if (isF12 || isDevTools || isConsole || isViewSource || isInspect) {
        e.stopImmediatePropagation();
        return; // 让浏览器处理这些快捷键
      }
    }
    // 其他敏感事件全部放行（通过停止站点的监听器）
    e.stopImmediatePropagation();
  };

  for (const ev of SENSITIVE_EVENTS) {
    window.addEventListener(ev, highPriorityListener, true);
    document.addEventListener(ev, highPriorityListener, true);
  }

  // 清理内联事件处理器
  function cleanInline() {
    const inlineEvents = ['oncopy', 'onpaste', 'oncut', 'oncontextmenu', 'onselectstart', 'onkeydown', 'onkeyup'];
    const targets = [document, document.documentElement, document.body].filter(Boolean);

    for (const target of targets) {
      for (const attr of inlineEvents) {
        if (target[attr]) target[attr] = null;
      }
    }
  }

  // 定期清理 + 页面变化时清理
  const cleanTimer = setInterval(cleanInline, 2000);
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(cleanInline).observe(document, {childList: true, subtree: true});
  }

  // 页面卸载前清理定时器
  window.addEventListener('beforeunload', () => clearInterval(cleanTimer));

  // 强制CSS样式解锁
  function injectUnlockCSS() {
    if (document.head) {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          user-select: text !important;
          -webkit-touch-callout: default !important;
          -webkit-user-drag: element !important;
          pointer-events: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // 立即注入CSS，DOM加载后再次注入
  injectUnlockCSS();
  document.addEventListener('DOMContentLoaded', injectUnlockCSS);

  // 强制允许 execCommand
  const origExecCommand = document.execCommand;
  document.execCommand = function(cmd, showUI, value) {
    return origExecCommand.call(this, cmd, showUI, value) || true; // 强制返回true
  };

  // === 增强版 Debugger 拦截系统 ===
  // 关键修复：使用 unsafeWindow 访问页面真实的 window 对象
  const uWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  function createDebuggerBlocker() {
    const logBlocked = (type, info) => uWindow.console.warn(`[Debugger Blocked] ${type}:`, info);

    // 1. 重写核心函数 (基于 unsafeWindow)
    const originals = {
      eval: uWindow.eval,
      Function: uWindow.Function,
      setTimeout: uWindow.setTimeout,
      setInterval: uWindow.setInterval
    };

    // 检测debugger的正则（更严格）
    const debuggerRegex = /\bdebugger\b/;

    // 重写 eval
    uWindow.eval = function(code) {
      if (typeof code === 'string' && debuggerRegex.test(code)) {
        logBlocked('eval', code.slice(0, 100));
        return undefined;
      }
      return originals.eval.call(this, code);
    };

    // 重写 Function 构造器
    uWindow.Function = function(...args) {
      const code = args[args.length - 1];
      if (typeof code === 'string' && debuggerRegex.test(code)) {
        logBlocked('Function', code.slice(0, 100));
        return () => {}; // 返回无害的空函数
      }
      return originals.Function.apply(this, args);
    };

    // 重写定时器函数
    const wrapTimer = (original, name) => function(callback, delay, ...args) {
      if (typeof callback === 'string' && debuggerRegex.test(callback)) {
        logBlocked(name + ' string', callback.slice(0, 100));
        return original.call(this, () => {}, delay, ...args);
      }

      if (typeof callback === 'function') {
        try {
          const funcStr = callback.toString();
          if (debuggerRegex.test(funcStr)) {
            logBlocked(name + ' function', funcStr.slice(0, 100));
            return original.call(this, () => {}, delay, ...args);
          }
        } catch (e) {
          // 如果toString()失败，可能是native函数，放行
        }
      }

      return original.call(this, callback, delay, ...args);
    };

    uWindow.setTimeout = wrapTimer(originals.setTimeout, 'setTimeout');
    uWindow.setInterval = wrapTimer(originals.setInterval, 'setInterval');

    // 2. 主动清理现有定时器
    let cleanupActive = true;
    const cleanupDebuggers = () => {
      if (!cleanupActive) return;

      try {
        // 获取当前最高的timer ID
        const testId = uWindow.setTimeout(() => {}, 0);
        uWindow.clearTimeout(testId);

        // 清理可疑的定时器（延迟很短的）
        for (let i = Math.max(1, testId - 1000); i <= testId; i++) {
          try {
            uWindow.clearTimeout(i);
            uWindow.clearInterval(i);
          } catch (e) {}
        }
      } catch (e) {}
    };

    // 启动清理任务
    const cleanupTimer = uWindow.setInterval(cleanupDebuggers, 3000);

    // 15秒后停止清理
    uWindow.setTimeout(() => {
      cleanupActive = false;
      uWindow.clearInterval(cleanupTimer);
      logBlocked('cleanup', '定时器清理任务已完成');
    }, 15000);

    // 3. 保护 console 对象
    try {
      const originalClear = uWindow.console.clear;
      Object.defineProperty(uWindow.console, 'clear', {
        value: function() {
          logBlocked('console.clear', '阻止清除控制台');
        },
        writable: false,
        configurable: false
      });
    } catch (e) {}
  }

  // 立即启动debugger拦截
  createDebuggerBlocker();

  // === 页面加载完成后的额外保护 ===
  const finalSetup = () => {
    cleanInline();
    injectUnlockCSS();

    // 移除可能的CSS限制
    const restrictiveStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    restrictiveStyles.forEach(style => {
      try {
        if (style.textContent && /user-select\s*:\s*none|pointer-events\s*:\s*none/.test(style.textContent)) {
          style.textContent = style.textContent
            .replace(/user-select\s*:\s*none/gi, 'user-select: text')
            .replace(/pointer-events\s*:\s*none/gi, 'pointer-events: auto');
        }
      } catch (e) {}
    });
  };

  // 多个时机执行最终设置
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', finalSetup);
  } else {
    finalSetup();
  }

  window.addEventListener('load', () => setTimeout(finalSetup, 500));

  console.info('[Unlocker v5.0] 已启用：F12保护 + 复制解锁 + Debugger全面拦截');
})();