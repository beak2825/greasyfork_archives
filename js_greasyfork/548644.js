// ==UserScript==
// @name         Enable Select & Copy — Multi-Level (L1–L6)
// @namespace    tm-copy-unlock
// @version      3.1
// @description  多等级解锁复制：默认最保守(等级1)，可逐级增强到等级6；为每站点记忆；菜单与快捷键快速升降；尽量降低被风控检测的概率
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548644/Enable%20Select%20%20Copy%20%E2%80%94%20Multi-Level%20%28L1%E2%80%93L6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548644/Enable%20Select%20%20Copy%20%E2%80%94%20Multi-Level%20%28L1%E2%80%93L6%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***************************************************************************
   * 总览
   * L1 纯样式                   —— 最安全，仅 user-select:text
   * L2 复制瞬间放行             —— 监听 Ctrl/⌘+C，临时宽松 copy
   * L3 选择与右键修复           —— 少量事件捕获拦截 + 根节点清理 inline
   * L4 动态节点定向修复         —— Scoped MutationObserver + 定向容器
   * L5 全局防御（激进）         —— 全站事件捕获 + 全树扫描 + 全站 MO + Shadow
   * L6 复制瞬间直接写剪贴板     —— 不修页面，只在复制瞬间写 clipboard（兜底）
   ***************************************************************************/

  // ===== 0) 配置 & 存储 Key =====
  const DEFAULT_LEVEL = 1; // 全局默认等级（1 最保守）
  const STORAGE = {
    SITE_LEVEL_PREFIX: 'copyUnlock.level.', // + hostname => 1..6
    HOTKEY_ENABLED: 'copyUnlock.hotkeyEnabled', // 是否启用快捷键
    DIAG_ENABLED: 'copyUnlock.diagEnabled', // 轻量诊断日志
  };

  // 可按需调整：用于 L4 的“定向容器”白名单（仅对这些容器子树做修复）
  const L4_SCOPE_SELECTORS = [
    'article', 'main', '#main', '.content', '.post', '.article', '.RichContent', '[role="article"]'
  ];

  const host = location.hostname;
  const SITE_KEY = STORAGE.SITE_LEVEL_PREFIX + host;

  // 读取/保存
  const read = (k, d) => {
    const v = GM_getValue(k);
    return v === undefined ? d : v;
  };
  const save = (k, v) => GM_setValue(k, v);

  let currentLevel = clamp(read(SITE_KEY, DEFAULT_LEVEL), 1, 6);
  let hotkeyEnabled = read(STORAGE.HOTKEY_ENABLED, true);
  let diag = read(STORAGE.DIAG_ENABLED, false);

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n | 0)); }

  // ===== 1) 轻量日志 & 提示 =====
  function log(...args) { if (diag) console.log('[CopyUnlock]', ...args); }
  function toast(msg) {
    try { alert(msg); } catch { console.log('[CopyUnlock][toast]', msg); }
  }

  // ===== 2) 诊断探针（可选，超轻量）=====
  const CopyProbe = (() => {
    let lastCopySuccess = null; // true/false/null
    let recent = []; // 最近结果
    function note(ok) {
      lastCopySuccess = !!ok;
      recent.push({ t: Date.now(), ok: !!ok });
      if (recent.length > 10) recent.shift();
      log('Copy result:', ok);
    }
    function stats() {
      const total = recent.length;
      const ok = recent.filter(x => x.ok).length;
      return { total, ok, fail: total - ok, lastCopySuccess };
    }
    return { note, stats, last: () => lastCopySuccess };
  })();

  // ===== 3) 工具 =====
  function isMac() { return navigator.platform && /mac/i.test(navigator.platform); }
  function isCopyCombo(e) {
    const meta = isMac() ? e.metaKey : e.ctrlKey;
    return meta && (e.key === 'c' || e.key === 'C');
  }
  function addCSS(css, root = document.documentElement) {
    if (typeof GM_addStyle === 'function' && root === document.documentElement) {
      GM_addStyle(css);
      return;
    }
    const st = document.createElement('style');
    st.textContent = css;
    (root.shadowRoot ? root.shadowRoot : root).appendChild(st);
  }

  // 读取选区文本
  function getSelectionText() {
    try { return String(window.getSelection ? window.getSelection().toString() : ''); }
    catch { return ''; }
  }

  // 尝试写剪贴板（优先 clipboard.writeText，退回 execCommand）
  async function writeClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { log('clipboard.writeText failed', e); }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', 'readonly');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      log('execCommand(copy) failed', e);
      return false;
    }
  }

  // 仅在捕获阶段“拦链不拦默认”（用于 L3/L5）
  function makeStopper(allowCtrlC = true) {
    return function stopper(e) {
      if (allowCtrlC && e.type === 'keydown' && isCopyCombo(e)) return; // 放行原生复制
      e.stopImmediatePropagation();
    };
  }

  // 基础清理（少量）
  const INLINE_ATTRS = ['oncopy', 'oncut', 'oncontextmenu', 'onselectstart', 'ondragstart', 'onbeforecopy', 'onkeydown'];
  function cleanNodeLight(el) {
    if (!el || el.nodeType !== 1) return;
    for (const a of INLINE_ATTRS) {
      if (a in el) { try { el[a] = null; } catch {} }
      if (el.hasAttribute && el.hasAttribute(a)) el.removeAttribute(a);
    }
    const s = el.style;
    if (s) {
      try {
        s.setProperty('user-select', 'text', 'important');
        s.setProperty('-webkit-user-select', 'text', 'important');
      } catch {}
    }
  }

  function scanTreeLight(root) {
    cleanNodeLight(root);
    const it = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
    let n; while ((n = it.nextNode())) cleanNodeLight(n);
  }

  // ===== 4) 各等级实现 =====
  const Levels = {
    1() {
      // 纯样式（最安全）
      addCSS(`
        html, body, * {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `);
      log('L1 enabled');
    },

    2() {
      // 复制瞬间临时放行：仅在按下 Ctrl/⌘+C 时，尽量保证复制能成功
      Levels[1](); // 保留 L1 的样式
      const onKeyDown = (e) => {
        if (!isCopyCombo(e)) return;
        // 短暂“疏通” copy 事件链：在捕获阶段抢先阻断站点监听
        const tempStopper = (ev) => { ev.stopImmediatePropagation(); };
        document.addEventListener('copy', tempStopper, true);
        setTimeout(() => {
          document.removeEventListener('copy', tempStopper, true);
        }, 100); // 瞬时生效

        // 同时兜底：如果站点仍阻止，我们手工写剪贴板（不破坏默认）
        setTimeout(async () => {
          const text = getSelectionText();
          if (!text) return;
          // 检测是否已经复制成功：无法可靠检测，只做兜底写入
          const ok = await writeClipboard(text);
          CopyProbe.note(ok);
        }, 0);
      };
      window.addEventListener('keydown', onKeyDown, true);
      log('L2 enabled');
    },

    3() {
      // 选择与右键修复（中等）：少量事件捕获 + 根节点清理 inline
      Levels[1]();
      const stopper = makeStopper(true);
      ['selectstart', 'contextmenu', 'copy'].forEach(t => {
        document.addEventListener(t, stopper, true);
        window.addEventListener(t, stopper, true);
      });
      // 根节点轻量清理一次
      cleanNodeLight(document.documentElement);
      cleanNodeLight(document.body);
      log('L3 enabled');
    },

    4() {
      // 动态节点定向修复：Scoped MO + 指定容器
      Levels[3]();
      const scopeNodes = [];
      const pushIf = (el) => { if (el) scopeNodes.push(el); };

      for (const sel of L4_SCOPE_SELECTORS) {
        try { pushIf(document.querySelector(sel)); } catch {}
      }
      // 如果没匹配到，就退回 body（仍算“定向”，别全站乱扫）
      if (!scopeNodes.length) pushIf(document.body);

      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes') cleanNodeLight(m.target);
          else if (m.addedNodes && m.addedNodes.length) {
            m.addedNodes.forEach(n => { if (n.nodeType === 1) scanTreeLight(n); });
          }
        }
      });
      scopeNodes.forEach(node => {
        try { mo.observe(node, { subtree: true, childList: true, attributes: true }); } catch {}
      });
      log('L4 enabled on scopes:', scopeNodes);
    },

    5() {
      // 全局防御（激进）：全站事件捕获 + 初始化全树清理 + 全站 MO + Shadow 样式注入
      Levels[1]();

      const stopper = makeStopper(true);
      const BLOCKED = ['copy','cut','contextmenu','selectstart','dragstart','beforecopy','keydown'];
      BLOCKED.forEach(t => {
        document.addEventListener(t, stopper, true);
        window.addEventListener(t, stopper, true);
      });

      // 初始化全树清理（谨慎：只做一次）
      try { scanTreeLight(document.documentElement); } catch {}

      // 全站观察（注意：可能影响性能，若页面很重可改成节流/选择器限定）
      const mo = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes') cleanNodeLight(m.target);
          else if (m.addedNodes && m.addedNodes.length) {
            m.addedNodes.forEach(n => { if (n.nodeType === 1) scanTreeLight(n); });
          }
        }
      });
      try { mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true }); } catch {}

      // Shadow DOM：不覆写原型，不改函数签名。仅“被动探测已存在的 shadowRoot”并注入样式
      const shadowMO = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.addedNodes) {
            m.addedNodes.forEach(n => {
              try {
                if (n.shadowRoot) {
                  addCSS(`
                    :host, * {
                      -webkit-user-select: text !important;
                      user-select: text !important;
                    }
                  `, n.shadowRoot);
                  // 在 shadowRoot 内也拦常见事件（捕获）
                  const s2 = makeStopper(true);
                  ['copy','contextmenu','selectstart'].forEach(t => n.shadowRoot.addEventListener(t, s2, true));
                }
              } catch {}
            });
          }
        }
      });
      try { shadowMO.observe(document.documentElement, { subtree: true, childList: true }); } catch {}

      log('L5 enabled');
    },

    6() {
      // 复制瞬间直接写剪贴板（兜底）：不解锁右键/选择；仅在 Ctrl/⌘+C 时写剪贴板
      const onKeyDown = async (e) => {
        if (!isCopyCombo(e)) return;
        const text = getSelectionText();
        if (!text) return;
        // 主动拦下默认 copy，直接写入，避免被站点逻辑“洗稿/插尾注”
        e.preventDefault();
        const ok = await writeClipboard(text);
        CopyProbe.note(ok);
      };
      window.addEventListener('keydown', onKeyDown, true);
      log('L6 enabled');
    },
  };

  // ===== 5) 运行入口 =====
  function bootstrap(level) {
    log(`Boot at level ${level} for ${host}`);
    // 分等级延迟：某些站点初始化期间会做完整性检查，低等级不需延迟
    const delayByLevel = { 1: 0, 2: 0, 3: 0, 4: 200, 5: 600, 6: 0 };
    const run = () => {
      try { Levels[level](); } catch (e) { console.error('[CopyUnlock] init error', e); }
    };
    if (document.readyState === 'loading') {
      // 对于 L5/L4 可等 DOM 基本完成后再注入，降低被检概率
      const dly = delayByLevel[level] || 0;
      if (dly > 0) {
        document.addEventListener('DOMContentLoaded', () => setTimeout(run, dly), { once: true });
      } else {
        document.addEventListener('DOMContentLoaded', run, { once: true });
      }
    } else {
      const dly = delayByLevel[level] || 0;
      if (dly > 0) setTimeout(run, dly);
      else run();
    }
  }

  // ===== 6) 菜单 & 快捷键 =====
  function setLevel(lv, silent = false) {
    currentLevel = clamp(lv, 1, 6);
    save(SITE_KEY, currentLevel);
    if (!silent) toast(`已设置本站等级为：L${currentLevel}（${host}）\n刷新页面后生效。`);
  }
  function incLevel() { setLevel(currentLevel + 1); }
  function decLevel() { setLevel(currentLevel - 1); }
  function resetLevel() { setLevel(DEFAULT_LEVEL); }

  GM_registerMenuCommand(`当前等级：L${currentLevel}（点击查看说明）`, () => {
    toast(
      `等级说明（越高越强，越易触发风控）：
L1 纯样式（最安全）
L2 复制瞬间放行
L3 选择/右键修复（少量事件捕获）
L4 动态节点定向修复（Scoped MO）
L5 全局防御（激进）
L6 复制瞬间直写剪贴板（兜底）

建议：从 L1 开始，遇阻再升；如遇异常/风控，立即降级或切 L6。`
    );
  }, { autoClose: true });

  GM_registerMenuCommand('升一级 (L↑)', () => incLevel(), { autoClose: true });
  GM_registerMenuCommand('降一级 (L↓)', () => decLevel(), { autoClose: true });
  GM_registerMenuCommand('重置为默认等级 (L1)', () => resetLevel(), { autoClose: true });

  GM_registerMenuCommand(`${hotkeyEnabled ? '关闭' : '开启'} 快捷键 (Alt+Shift+↑/↓/0)`, () => {
    hotkeyEnabled = !hotkeyEnabled;
    save(STORAGE.HOTKEY_ENABLED, hotkeyEnabled);
    toast(`快捷键已${hotkeyEnabled ? '开启' : '关闭'}`);
  }, { autoClose: true });

  GM_registerMenuCommand(`${diag ? '关闭' : '开启'} 诊断日志`, () => {
    diag = !diag;
    save(STORAGE.DIAG_ENABLED, diag);
    toast(`诊断日志已${diag ? '开启' : '关闭'}`);
  }, { autoClose: true });

  // 快捷键：Alt+Shift+↑/↓ 调整等级；Alt+Shift+0 复位
  window.addEventListener('keydown', (e) => {
    if (!hotkeyEnabled) return;
    if (!e.altKey || !e.shiftKey) return;
    const k = e.key;
    if (k === 'ArrowUp') { e.preventDefault(); incLevel(); }
    else if (k === 'ArrowDown') { e.preventDefault(); decLevel(); }
    else if (k === '0' || k === ')') { e.preventDefault(); resetLevel(); }
  }, true);

  // ===== 7) 启动当前等级 =====
  bootstrap(currentLevel);

  // ===== 8) 合规提醒（一次性提示，可按需保留/删除）=====
  // console.warn('[CopyUnlock] 请在合法、合规且尊重版权的前提下使用本脚本。');
})();
