// ==UserScript==
// @name         超星学习通 直播 假装未切换到其他标签且未最小化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  尽量让页面认为窗口是可见且未切换到其他标签（注：有局限，可能无法应对所有检测）
// @author       kaesinol
// @match        https://zhibo.chaoxing.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553633/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E7%9B%B4%E6%92%AD%20%E5%81%87%E8%A3%85%E6%9C%AA%E5%88%87%E6%8D%A2%E5%88%B0%E5%85%B6%E4%BB%96%E6%A0%87%E7%AD%BE%E4%B8%94%E6%9C%AA%E6%9C%80%E5%B0%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/553633/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E7%9B%B4%E6%92%AD%20%E5%81%87%E8%A3%85%E6%9C%AA%E5%88%87%E6%8D%A2%E5%88%B0%E5%85%B6%E4%BB%96%E6%A0%87%E7%AD%BE%E4%B8%94%E6%9C%AA%E6%9C%80%E5%B0%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 将脚本注入到页面上下文（以便覆盖原生只读属性）
  const inject = (fn) => {
    const s = document.createElement('script');
    s.textContent = '(' + fn.toString() + ')();';
    document.documentElement.appendChild(s);
    s.remove();
  };

  inject(function () {
    try {
      // 保留原始方法
      const _doc = Document.prototype;
      const _win = Window.prototype;
      const _addEventListenerDoc = _doc.addEventListener;
      const _addEventListenerWin = _win.addEventListener;

      // 强制 document.hidden 和 visibilityState 返回“可见”
      try {
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get() { return false; }
        });
        Object.defineProperty(document, 'visibilityState', {
          configurable: true,
          get() { return 'visible'; }
        });
      } catch (e) {
        // 有的浏览器/策略可能拒绝重定义，这里无声失败
        // console.warn('defineProperty failed', e);
      }

      // 拦截 addEventListener，屏蔽或替换 visibilitychange / blur 触发
      _doc.addEventListener = function (type, listener, options) {
        if (type === 'visibilitychange') {
          // 立即以可见状态调用一次（避免脚本等待第一次事件）
          try { listener.call(document, new Event('visibilitychange')); } catch (e) {}
          // 不阻止注册：仍然注册，但我们将在后面周期性派发可见事件
        }
        return _addEventListenerDoc.apply(this, arguments);
      };

      _win.addEventListener = function (type, listener, options) {
        if (type === 'blur' || type === 'pagehide' || type === 'freeze') {
          // 屏蔽绑定这些事件的逻辑：不让页面感知失焦/隐藏事件
          // 为了兼容性，仍然允许绑定但不主动触发（浏览器可能会触发，我们只是减少触发点）
          // 选择直接注册：这样不会破坏页面对事件的管理
        }
        return _addEventListenerWin.apply(this, arguments);
      };

      // 劫持 window.onblur / onfocus 等属性，使其看起来一直是聚焦的
      try {
        Object.defineProperty(window, 'onblur', { configurable: true, get() { return null; }, set() {} });
        Object.defineProperty(window, 'onfocus', { configurable: true, get() { return null; }, set() {} });
      } catch (e) {}

      // 周期性派发“visible / focus / mousemove”事件以模拟在前台
      const dispatchVisible = () => {
        try {
          document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
        } catch (e) {}
        try {
          window.dispatchEvent(new Event('focus', { bubbles: true }));
        } catch (e) {}
      };

      // 轻微鼠标移动事件（坐标固定、轻量级）
      const dispatchMouseMove = () => {
        try {
          const ev = new MouseEvent('mousemove', { bubbles: true, cancelable: false, view: window, clientX: 1, clientY: 1 });
          document.dispatchEvent(ev);
        } catch (e) {}
      };

      // 定时器：每隔一段时间派发事件（不宜太频繁以减少性能影响与检测风险）
      const VIS_INTERVAL = 5 * 1000; // 5s
      const MOUSE_INTERVAL = 17 * 1000; // 17s
      const FOCUS_INTERVAL = 30 * 1000; // 30s

      setInterval(dispatchVisible, VIS_INTERVAL);
      setInterval(dispatchMouseMove, MOUSE_INTERVAL);
      setInterval(() => {
        try {
          // 尝试调用 focus（浏览器可能忽略），并派发 focus 事件
          window.focus && window.focus();
          window.dispatchEvent(new Event('focus', { bubbles: true }));
        } catch (e) {}
      }, FOCUS_INTERVAL);

      // 劫持 document.hasFocus() 始终返回 true
      try {
        const originalHasFocus = document.hasFocus;
        document.hasFocus = function () { return true; };
        // 若 site 调用 window.hasFocus 也劫持
        if (typeof window.hasFocus === 'function') {
          window.hasFocus = function () { return true; };
        }
      } catch (e) {}

      // 覆盖 visibilityState 的 getter（作为补充）
      try {
        const proto = Object.getPrototypeOf(document);
        if (proto && Object.getOwnPropertyDescriptor(proto, 'visibilityState')) {
          Object.defineProperty(proto, 'visibilityState', {
            configurable: true,
            get() { return 'visible'; }
          });
        }
      } catch (e) {}

      // 防止某些监听器基于 document.visibilityState 的即时检查导致问题
      // 直接把 document.visibilityState.toString 安全化
      try {
        if (document.visibilityState && document.visibilityState.toString) {
          // noop - 保持兼容
        }
      } catch (e) {}

      // 额外提示（可注释掉）：console.log('Visibility spoofing active');
    } catch (ex) {
      // console.error('visibility spoof init failed', ex);
    }
  });

})();
