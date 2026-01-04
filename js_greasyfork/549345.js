// ==UserScript==
// @name         Chaoxing MOOC 屏蔽焦点/鼠标检测（捕获期拦截）
// @namespace    https://austin.cx/userscripts
// @version      1.0.0
// @description  在捕获阶段拦截 blur/focus/visibilitychange 及常见鼠标/指针事件，减少“切出/移出”检测。内置菜单与控制台开关，尝试处理同源 iframe。
// @match        https://mooc1.chaoxing.com/mycourse/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/549345/Chaoxing%20MOOC%20%E5%B1%8F%E8%94%BD%E7%84%A6%E7%82%B9%E9%BC%A0%E6%A0%87%E6%A3%80%E6%B5%8B%EF%BC%88%E6%8D%95%E8%8E%B7%E6%9C%9F%E6%8B%A6%E6%88%AA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549345/Chaoxing%20MOOC%20%E5%B1%8F%E8%94%BD%E7%84%A6%E7%82%B9%E9%BC%A0%E6%A0%87%E6%A3%80%E6%B5%8B%EF%BC%88%E6%8D%95%E8%8E%B7%E6%9C%9F%E6%8B%A6%E6%88%AA%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // --- 配置：需要拦截的事件类型 ---
  const TYPES = [
    'blur', 'focus', 'visibilitychange',
    'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mousemove',
    'pointerenter', 'pointerleave', 'pointerover', 'pointerout', 'pointermove'
  ];
  const POINTER_TYPES = new Set([
    'mouseenter','mouseleave','mouseover','mouseout','mousemove',
    'pointerenter','pointerleave','pointerover','pointerout','pointermove'
  ]);

  // --- 状态与登记表 ---
  let enabled = true;                                 // 是否启用拦截
  const blockers = [];                                // [target, type, handler]
  const installedTargets = new WeakSet();             // 防重复安装
  const frameMarked = new WeakSet();                  // 标记已尝试注入的 iframe

  // --- 统一的捕获期处理器 ---
  const handler = (e) => {
    if (!enabled) return;
    // 阻断冒泡/捕获阶段的后续监听器
    e.stopImmediatePropagation?.();
    e.stopPropagation?.();
    // 对指针/鼠标类事件，尽量阻止默认行为（可取消时）
    if (POINTER_TYPES.has(e.type) && e.cancelable) e.preventDefault();
  };

  // --- 为某个目标（window 或 document）安装拦截器 ---
  function addForTarget(target) {
    if (!target || installedTargets.has(target)) return;
    TYPES.forEach(type => {
      try {
        target.addEventListener(type, handler, { capture: true, passive: false });
        blockers.push([target, type, handler]);
      } catch (_) { /* 某些目标可能不支持，忽略 */ }
    });
    installedTargets.add(target);
  }

  // --- 尝试为一个 window/document 对安装 ---
  function installForWindow(win) {
    try {
      addForTarget(win);
      addForTarget(win.document);
    } catch (_) { /* 跨域或早期阶段可能失败，忽略 */ }
  }

  // ---（同源）iframe 注入 ---
  function tryInstallInIframe(iframe) {
    if (!iframe || frameMarked.has(iframe)) return;
    frameMarked.add(iframe);

    const inject = () => {
      try {
        const w = iframe.contentWindow;
        const d = iframe.contentDocument;
        if (w && d) {
          installForWindow(w);
        }
      } catch (_) { /* 跨域 iframe 会抛异常，忽略 */ }
    };

    // 已加载或可直接访问
    inject();

    // 监听 iframe 自身的 load（例如后续 src 变化）
    iframe.addEventListener('load', inject, { passive: true });
  }

  // --- 扫描并注入同源 iframe ---
  function scanIframes(rootDoc) {
    const list = rootDoc.querySelectorAll('iframe');
    list.forEach(tryInstallInIframe);
  }

  // --- MutationObserver：捕获后续新增的 iframe ---
  function observeIframes(rootDoc) {
    const mo = new MutationObserver(records => {
      for (const r of records) {
        r.addedNodes && r.addedNodes.forEach(n => {
          if (n && n.tagName === 'IFRAME') tryInstallInIframe(n);
          // 某些站点会包裹在容器里
          if (n && n.querySelectorAll) {
            n.querySelectorAll('iframe').forEach(tryInstallInIframe);
          }
        });
      }
    });
    mo.observe(rootDoc, { childList: true, subtree: true });
  }

  // --- 安装/卸载（用于菜单或控制台切换） ---
  function installAll() {
    installForWindow(window);
    // 首屏扫描 + 监听
    try {
      scanIframes(document);
      observeIframes(document);
    } catch (_) {}
  }

  function uninstallAll() {
    // 移除所有已注册的捕获监听器
    while (blockers.length) {
      const [tgt, type, h] = blockers.pop();
      try { tgt.removeEventListener(type, h, true); } catch (_) {}
    }
    installedTargets.clear?.();
  }

  // --- 控制台辅助函数 ---
  // 立即禁用（恢复页面原状）
  window.__unblockFocusAndMouse = () => {
    enabled = false;
    uninstallAll();
    console.log('[Chaoxing-blocker] 已禁用并移除拦截器');
  };
  // 重新启用
  window.__blockFocusAndMouse = () => {
    if (!enabled) {
      enabled = true;
      installAll();
      console.log('[Chaoxing-blocker] 已重新启用拦截');
    } else {
      console.log('[Chaoxing-blocker] 已经处于启用状态');
    }
  };

  // --- Tampermonkey 菜单 ---
  try {
    GM_registerMenuCommand('禁用拦截（恢复页面）', () => {
      window.__unblockFocusAndMouse();
      alert('已禁用并移除拦截器。如需再次启用，可打开菜单选择“启用拦截”。');
    });
    GM_registerMenuCommand('启用拦截', () => {
      window.__blockFocusAndMouse();
      alert('已启用拦截。');
    });
  } catch (_) {
    // 某些管理器未提供 GM_*，忽略
  }

  // --- 初始化：尽早在 document-start 安装 ---
  installAll();

  // 一些页面会在 readyState 变化后再动态挂载 iframe/监听器，再扫描一次以保险
  document.addEventListener('DOMContentLoaded', () => scanIframes(document), { once: true });

  console.log('[Chaoxing-blocker] 拦截器已安装。控制台可用：__unblockFocusAndMouse() / __blockFocusAndMouse()');
})();
