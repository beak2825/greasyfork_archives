// ==UserScript==
// @name         Hide NDM Video Download Button
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  在不禁用 Neat Download Manager 插件的情况下，移除其注入到页面中的下载浮层
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561914/Hide%20NDM%20Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561914/Hide%20NDM%20Video%20Download%20Button.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const EXT_ID = 'pbghcbaeehloijjcebiflemhcebmlnke';
  const EXT_PREFIX = `chrome-extension://${EXT_ID}/`;

  const DEBUG = false; // 改 true 会在控制台打印日志
  const log = (...a) => DEBUG && console.log('[KillNDM]', ...a);

  // 可选兜底（有误伤风险，默认关闭）
  const ENABLE_TEXT_FALLBACK = false;

  function zIndexOf(el) {
    try {
      const z = getComputedStyle(el).zIndex;
      const n = Number(z);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  }

  // 从 table 往上找更像“浮层容器”的父节点（fixed/absolute + 高 z-index）
  function findOverlayContainer(el) {
    let cur = el;
    for (let i = 0; i < 8 && cur && cur !== document.documentElement; i++) {
      try {
        const cs = getComputedStyle(cur);
        const pos = cs.position;
        const zi = zIndexOf(cur);
        if ((pos === 'fixed' || pos === 'absolute') && zi >= 100) return cur;
      } catch {}
      cur = cur.parentElement;
    }
    return el;
  }

  function kill(el) {
    if (!el || el.nodeType !== 1) return;
    try {
      // 先隐藏再移除，降低某些页面报错概率
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.remove();
      log('removed:', el);
    } catch {}
  }

  function isNDMTable(tableEl) {
    if (!tableEl || tableEl.nodeType !== 1 || tableEl.tagName !== 'TABLE') return false;

    // 1) table 内含扩展资源（你给的 icon）
    try {
      const hitExt = tableEl.querySelector(
        `img[src^="${EXT_PREFIX}"], [style*="${EXT_PREFIX}"], [src^="${EXT_PREFIX}"], [href^="${EXT_PREFIX}"]`
      );
      if (hitExt) return true;
    } catch {}

    // 2) neatHCell* 这个特征（你贴出来的 td id）
    try {
      if (tableEl.querySelector('[id^="neatHCell"]')) return true;
    } catch {}

    // 3) 文本兜底（默认关闭）
    if (ENABLE_TEXT_FALLBACK) {
      const t = (tableEl.textContent || '').toLowerCase();
      if (t.includes('mp4 file') && t.includes('mb')) return true;
    }

    return false;
  }

  function sweep(root) {
    const scope = root && root.querySelectorAll ? root : document;

    // 只扫 table，性能好很多
    let tables = [];
    try {
      tables = scope.querySelectorAll('table');
    } catch {
      return;
    }

    for (const tb of tables) {
      if (isNDMTable(tb)) {
        const victim = findOverlayContainer(tb);
        kill(victim);
      }
    }

    // root 自己可能就是 table
    if (root && root.nodeType === 1 && root.tagName === 'TABLE' && isNDMTable(root)) {
      kill(findOverlayContainer(root));
    }
  }

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes?.forEach(n => {
          if (n && n.nodeType === 1) sweep(n);
        });
      } else if (m.type === 'attributes') {
        const t = m.target;
        if (!t || t.nodeType !== 1) continue;

        // 如果某个 table 的属性变化（比如 style/src）导致命中，也处理
        const tb = t.tagName === 'TABLE' ? t : t.closest?.('table');
        if (tb && isNDMTable(tb)) kill(findOverlayContainer(tb));
      }
    }
  });

  function start() {
    sweep(document);
    mo.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['id', 'class', 'style', 'src', 'href']
    });
    log('observer started');
  }

  if (document.documentElement) start();
  else window.addEventListener('DOMContentLoaded', start, { once: true });
})();
