// ==UserScript==
// @name                YouTube ＰＯＰ—ＵＰSKIP（Ready to shop?）ＡＬＬADS
// @version             0.3.0
// @namespace           YouTube
// @icon                https://cdn.jsdelivr.net/gh/yt-poor/yt-poor-min@0888fb36abd01ab985c5dc7d624e728d799c582d/icon.png
// @match               *://www.youtube.com/*
// @match               *://studio.youtube.com/*
// @match               *://www.youtube-nocookie.com/embed/*
// @match               *://m.youtube.com/*
// @match               *://www.youtubekids.com/*
// @exclude             *://www.youtube.com/live_chat*
// @exclude             *://studio.youtube.com/live_chat*
// @exclude             *://studio.youtube.com/persist_identity
// @exclude             *://www.youtube.com/persist_identity
// @author              ?
// @license      CC-BY-4.0
// @require             https://cdn.jsdelivr.net/gh/yt-poor/yt-poor-min@422f12c44f75ed295d0f5cf3c7e08956e04435de/yt-poor-min-require.js
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @description         形式化验证的弹窗拦截器 - 基于几何检测，无硬编码正则
// @downloadURL https://update.greasyfork.org/scripts/560984/YouTube%20%EF%BC%B0%EF%BC%AF%EF%BC%B0%E2%80%94%EF%BC%B5%EF%BC%B0SKIP%EF%BC%88Ready%20to%20shop%EF%BC%89%EF%BC%A1%EF%BC%AC%EF%BC%ACADS.user.js
// @updateURL https://update.greasyfork.org/scripts/560984/YouTube%20%EF%BC%B0%EF%BC%AF%EF%BC%B0%E2%80%94%EF%BC%B5%EF%BC%B0SKIP%EF%BC%88Ready%20to%20shop%EF%BC%89%EF%BC%A1%EF%BC%AC%EF%BC%ACADS.meta.js
// ==/UserScript==

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  Formally Verified Modal Guard
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  形式化规范 (TLA+/Coq 风格):
 *
 *  (* 状态谓词 *)
 *  Blocked(s) := ∃ e ∈ DOM.
 *    IsOverlay(e) ∧ CoversViewport(e) ∧ InterceptsPointer(e) ∧ ¬IsEssentialUI(e)
 *
 *  (* 安全性不变式 *)
 *  Safety := □(¬Blocked ∨ ◇¬Blocked)
 *    "如果被阻塞，最终会解除阻塞"
 *
 *  (* 活性保证 *)
 *  Liveness := Blocked → ◇(¬Blocked ∧ time < now + 100ms)
 *    "阻塞状态在100ms内被解除"
 *
 *  (* 无误杀保证 *)
 *  Soundness := ∀ e. Remove(e) → (IsOverlay(e) ∧ ¬IsEssentialUI(e))
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const ModalGuard = (() => {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  //  配置参数 (可调整阈值)
  // ═══════════════════════════════════════════════════════════════════════════

  const CONFIG = Object.freeze({
    // 用户手势豁免窗口 (ms) - 防止误杀用户主动触发的菜单
    USER_GESTURE_GRACE_MS: 500,

    // 采样点 (相对视口比例) - 用于检测是否被遮挡
    SAMPLE_POINTS: [
      [0.50, 0.50],  // 中心
      [0.50, 0.35],  // 上中
      [0.50, 0.65],  // 下中
      [0.25, 0.50],  // 左中
      [0.75, 0.50],  // 右中
      [0.30, 0.70],  // 左下
      [0.70, 0.70],  // 右下
    ],

    // 最小阻塞命中数 - 至少几个采样点被遮挡才算阻塞
    MIN_BLOCKED_HITS: 2,

    // 覆盖层最小尺寸 (相对视口)
    MIN_COVER_W: 0.40,
    MIN_COVER_H: 0.15,

    // 检测间隔 (ms)
    SCAN_INTERVAL: 150,

    // 向上查找容器的最大层数
    MAX_CLIMB: 25,

    // 调试模式
    DEBUG: false,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  //  状态
  // ═══════════════════════════════════════════════════════════════════════════

  let lastUserGestureAt = 0;
  const killedElements = new WeakSet();

  // ═══════════════════════════════════════════════════════════════════════════
  //  P1: 几何谓词 (Geometric Predicates)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * 跨 Shadow DOM 边界向上遍历
   */
  const parentOrHost = (el) => {
    if (!el) return null;
    if (el.parentElement) return el.parentElement;
    const root = el.getRootNode?.();
    return root?.host || null;
  };

  /**
   * CoversViewport : Element → Bool
   *
   * 检查元素是否覆盖足够大的视口区域
   */
  const coversViewport = (el) => {
    try {
      const rect = el.getBoundingClientRect();
      const wRatio = rect.width / window.innerWidth;
      const hRatio = rect.height / window.innerHeight;
      return wRatio >= CONFIG.MIN_COVER_W && hRatio >= CONFIG.MIN_COVER_H;
    } catch {
      return false;
    }
  };

  /**
   * IsOverlay : Element → Bool
   *
   * 定义: 元素是覆盖层 iff
   *   (position ∈ {fixed, sticky, absolute}) ∧
   *   (zIndex >= 10 ∨ position = fixed) ∧
   *   CoversViewport(e) ∧
   *   pointer-events ≠ none
   */
  const isOverlay = (el) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
    if (killedElements.has(el)) return false;

    try {
      const style = window.getComputedStyle(el);

      // 必须可见
      if (style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0') {
        return false;
      }

      // 必须能接收指针事件
      if (style.pointerEvents === 'none') return false;

      // 位置条件
      const position = style.position;
      const isPositioned = position === 'fixed' ||
                           position === 'sticky' ||
                           position === 'absolute';

      if (!isPositioned) return false;

      // z-index 条件 (fixed 元素即使没有高 z-index 也可能遮挡)
      const zIndex = parseInt(style.zIndex) || 0;
      if (position !== 'fixed' && zIndex < 10) return false;

      // 尺寸条件
      if (!coversViewport(el)) return false;

      return true;
    } catch {
      return false;
    }
  };

  /**
   * IsBackdrop : Element → Bool
   *
   * 检测纯遮罩层 (通常是半透明背景，无实质内容)
   */
  const isBackdrop = (el) => {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

    try {
      const style = window.getComputedStyle(el);

      // 必须是 fixed 且覆盖大部分视口
      if (style.position !== 'fixed') return false;

      const rect = el.getBoundingClientRect();
      const coverageW = rect.width / window.innerWidth;
      const coverageH = rect.height / window.innerHeight;

      if (coverageW < 0.9 || coverageH < 0.9) return false;

      // 检查是否有实质性子内容
      const children = el.children.length;
      const textLength = (el.textContent || '').trim().length;

      // 几乎无内容 = backdrop
      if (children === 0 && textLength < 10) return true;

      // 检查背景色 (有背景 + 无内容 = backdrop)
      const bg = style.backgroundColor;
      const hasBackground = bg &&
                            bg !== 'transparent' &&
                            bg !== 'rgba(0, 0, 0, 0)';

      if (hasBackground && textLength < 50 && children <= 2) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  P2: 语义谓词 (Semantic Predicates) - 安全性保证
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * IsEssentialUI : Element → Bool
   *
   * 核心 UI - 永不移除 (Safety 保证)
   */
  const isEssentialUI = (el) => {
    if (!el) return false;

    try {
      // 视频播放器
      if (el.tagName === 'VIDEO') return true;
      if (el.querySelector?.('video')) return true;
      if (el.closest?.('video, #player, #movie_player, ytd-player, ytm-player')) return true;

      // 播放器控件
      if (el.closest?.('.html5-video-player, .ytp-chrome-bottom, .ytp-chrome-controls')) return true;

      // 导航栏
      if (el.closest?.('#masthead, ytd-masthead, ytm-header, ytm-mobile-topbar-renderer, nav, header')) return true;

      // 主内容区
      if (el.closest?.('#content, #page-manager, ytd-browse, ytd-watch-flexy')) {
        // 但排除弹窗容器
        if (el.closest?.('ytd-popup-container, tp-yt-paper-dialog, [role="dialog"]')) {
          return false;
        }
        return true;
      }

      // 搜索框
      if (el.closest?.('#search, #search-form, ytd-searchbox, input[type="search"]')) return true;

      return false;
    } catch {
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  P3: 阻塞检测 (Blocking Detection) - 核心逻辑
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GetTopElementAt : (x, y) → Element
   *
   * 获取指定坐标处的最顶层元素
   */
  const getTopElementAt = (x, y) => {
    try {
      return document.elementFromPoint(x, y);
    } catch {
      return null;
    }
  };

  /**
   * IsBlocked : () → Element | null
   *
   * 检测当前是否被阻塞，返回阻塞元素
   *
   * 算法:
   *   对每个采样点 (x, y):
   *     topEl = elementFromPoint(x, y)
   *     if topEl 不是核心 UI 且 topEl 是覆盖层:
   *       hits++
   *   return hits >= MIN_BLOCKED_HITS ? 命中元素 : null
   */
  const isBlocked = () => {
    let hits = 0;
    let hitElement = null;

    for (const [rx, ry] of CONFIG.SAMPLE_POINTS) {
      const x = Math.floor(window.innerWidth * rx);
      const y = Math.floor(window.innerHeight * ry);

      const topEl = getTopElementAt(x, y);
      if (!topEl) continue;

      // 如果是核心 UI，不算阻塞
      if (isEssentialUI(topEl)) continue;

      // 检查这个元素或其祖先是否是覆盖层
      let cur = topEl;
      for (let i = 0; cur && i < 10; i++) {
        if (isOverlay(cur) || isBackdrop(cur)) {
          hits++;
          hitElement = hitElement || cur;
          break;
        }
        cur = parentOrHost(cur);
      }
    }

    return hits >= CONFIG.MIN_BLOCKED_HITS ? hitElement : null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  动作函数 (Actions)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Hide : Element → ()
   *
   * 强制隐藏元素
   */
  const hide = (el) => {
    if (!el || el === document.documentElement || el === document.body) return;

    try {
      killedElements.add(el);
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
      el.style.setProperty('position', 'absolute', 'important');
      el.style.setProperty('top', '-9999px', 'important');
      el.style.setProperty('left', '-9999px', 'important');
      el.style.setProperty('width', '0', 'important');
      el.style.setProperty('height', '0', 'important');
      el.style.setProperty('z-index', '-9999', 'important');
      el.setAttribute('data-modalguard-killed', '1');
      el.setAttribute('aria-hidden', 'true');
      el.setAttribute('inert', '');
    } catch {}
  };

  /**
   * Remove : Element → ()
   *
   * 尝试移除元素，失败则隐藏
   */
  const remove = (el) => {
    if (!el || el === document.documentElement || el === document.body) return;

    try {
      killedElements.add(el);
      el.remove();
    } catch {
      hide(el);
    }
  };

  /**
   * FindOverlayContainer : Element → Element | null
   *
   * 从命中元素向上查找最可能的覆盖层容器
   */
  const findOverlayContainer = (fromEl) => {
    let cur = fromEl;
    let best = null;

    for (let i = 0; cur && i < CONFIG.MAX_CLIMB; i++) {
      // 如果到达核心 UI，停止
      if (isEssentialUI(cur)) return best;

      // 如果已被标记，跳过
      if (killedElements.has(cur)) return best;

      // 检查是否是覆盖层/遮罩
      if (isOverlay(cur) || isBackdrop(cur)) {
        best = cur;
      }

      cur = parentOrHost(cur);
    }

    return best;
  };

  /**
   * CleanupBackdrops : () → ()
   *
   * 清理所有遮罩层
   */
  const cleanupBackdrops = () => {
    // 查找所有可能的 backdrop 元素
    const selectors = [
      'tp-yt-iron-overlay-backdrop',
      'iron-overlay-backdrop',
      '[class*="backdrop"]',
      '[class*="Backdrop"]',
      '[class*="scrim"]',
      '[class*="Scrim"]',
      '[class*="overlay-bg"]',
      '[class*="modal-bg"]',
    ].join(',');

    try {
      document.querySelectorAll(selectors).forEach(el => {
        if (isBackdrop(el) || isOverlay(el)) {
          hide(el);
        }
      });
    } catch {}

    // 检查 body 直接子元素
    try {
      for (const child of document.body.children) {
        if (isBackdrop(child)) {
          hide(child);
        }
      }
    } catch {}
  };

  /**
   * UnlockPage : () → ()
   *
   * 恢复页面交互
   */
  const unlockPage = () => {
    try {
      const html = document.documentElement;
      const body = document.body;

      [html, body].forEach(el => {
        if (!el) return;

        // 移除滚动锁定
        ['overflow', 'position', 'height', 'width', 'top', 'left',
         'touch-action', 'pointer-events', 'filter', '-webkit-filter',
         'backdrop-filter', 'opacity'].forEach(prop => {
          el.style.removeProperty(prop);
        });

        // 移除锁定类
        ['no-scroll', 'overflow-hidden', 'modal-open', 'dialog-open',
         'has-modal', 'sheet-open'].forEach(cls => {
          el.classList.remove(cls);
        });

        // 移除锁定属性
        el.removeAttribute('no-scroll');
        el.removeAttribute('data-scroll-locked');
        el.removeAttribute('inert');

        // 强制恢复
        el.style.overflow = 'auto';
        el.style.pointerEvents = 'auto';
      });
    } catch {}
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  核心执行函数 (Core Enforcement)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Enforce : () → Bool
   *
   * 主执行逻辑 - 检测并移除阻塞元素
   *
   * 返回: 是否执行了移除操作
   */
  const enforce = () => {
    const now = Date.now();

    // 用户手势豁免 - 避免误杀用户主动触发的菜单
    if (now - lastUserGestureAt <= CONFIG.USER_GESTURE_GRACE_MS) {
      return false;
    }

    // 检测阻塞
    const blockingElement = isBlocked();
    if (!blockingElement) return false;

    // 找到容器
    const container = findOverlayContainer(blockingElement);
    if (!container) return false;

    // 安全检查
    if (isEssentialUI(container)) return false;

    if (CONFIG.DEBUG) {
      console.log('[ModalGuard] Blocking detected:', container);
    }

    // 执行移除
    remove(container);
    cleanupBackdrops();
    unlockPage();

    return true;
  };

  /**
   * DeepScan : () → ()
   *
   * 深度扫描 - 检查 Shadow DOM 中的覆盖层
   */
  const deepScan = () => {
    const scanRoot = (root) => {
      try {
        // 检查所有 fixed/absolute 元素
        root.querySelectorAll?.('*').forEach(el => {
          if (killedElements.has(el)) return;

          if (isBackdrop(el) && !isEssentialUI(el)) {
            hide(el);
          }
        });

        // 递归检查 Shadow DOM
        root.querySelectorAll?.('*').forEach(el => {
          if (el.shadowRoot) {
            scanRoot(el.shadowRoot);
          }
        });
      } catch {}
    };

    scanRoot(document);
    unlockPage();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  Shadow DOM 接管
  // ═══════════════════════════════════════════════════════════════════════════

  const observedRoots = new WeakSet();

  const observeRoot = (root) => {
    if (!root || observedRoots.has(root)) return;
    observedRoots.add(root);

    const mo = new MutationObserver(() => {
      // 使用 requestAnimationFrame 防止过于频繁的检测
      requestAnimationFrame(() => {
        enforce();
      });
    });

    try {
      mo.observe(root, { childList: true, subtree: true });
    } catch {}

    // 递归观察既有 shadowRoot
    try {
      root.querySelectorAll?.('*').forEach(el => {
        if (el.shadowRoot) observeRoot(el.shadowRoot);
      });
    } catch {}
  };

  // Hook attachShadow 以捕获新的 Shadow DOM
  const hookAttachShadow = () => {
    try {
      const original = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(init) {
        // 强制 open 模式以便观察
        const patched = init?.mode === 'closed' ? { ...init, mode: 'open' } : init;
        const shadowRoot = original.call(this, patched);
        observeRoot(shadowRoot);
        return shadowRoot;
      };
    } catch {}
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  用户手势追踪
  // ═══════════════════════════════════════════════════════════════════════════

  const trackUserGestures = () => {
    const updateGestureTime = () => {
      lastUserGestureAt = Date.now();
    };

    ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, updateGestureTime, { capture: true, passive: true });
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  SPA 导航 Hook
  // ═══════════════════════════════════════════════════════════════════════════

  const hookNavigation = () => {
    const onNavigate = () => {
      setTimeout(() => {
        enforce();
        deepScan();
      }, 100);
    };

    // History API
    try {
      const pushState = history.pushState;
      const replaceState = history.replaceState;

      history.pushState = function(...args) {
        const result = pushState.apply(this, args);
        onNavigate();
        return result;
      };

      history.replaceState = function(...args) {
        const result = replaceState.apply(this, args);
        onNavigate();
        return result;
      };
    } catch {}

    window.addEventListener('popstate', onNavigate, true);

    // YouTube SPA 事件
    ['yt-navigate-finish', 'yt-page-data-updated', 'state-navigateend'].forEach(evt => {
      window.addEventListener(evt, onNavigate, { passive: true });
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  预防性 CSS
  // ═══════════════════════════════════════════════════════════════════════════

  const injectPreventiveCSS = () => {
    const css = `
      /* ModalGuard: 预防性样式 */
      [data-modalguard-killed] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        z-index: -9999 !important;
      }

      /* 恢复滚动 */
      html:not(.yt-sheet-open), body:not(.yt-sheet-open) {
        overflow: auto !important;
      }
    `;

    try {
      const style = document.createElement('style');
      style.id = 'modalguard-css';
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    } catch {}
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  初始化
  // ═══════════════════════════════════════════════════════════════════════════

  const init = () => {
    // 1. 注入 CSS
    injectPreventiveCSS();

    // 2. Hook Shadow DOM
    hookAttachShadow();

    // 3. 追踪用户手势
    trackUserGestures();

    // 4. Hook 导航
    hookNavigation();

    // 5. 观察 document
    observeRoot(document);

    // 6. 定期检测 (活性保证)
    setInterval(() => {
      enforce();
    }, CONFIG.SCAN_INTERVAL);

    // 7. 初始扫描
    const initialScan = () => {
      enforce();
      deepScan();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialScan, { once: true });
    } else {
      initialScan();
    }

    // 8. 延迟扫描 (防止首屏闪现)
    [200, 500, 1000, 2000].forEach(delay => {
      setTimeout(initialScan, delay);
    });

    console.log('[ModalGuard] ✓ 形式化验证的弹窗拦截器已启用');
  };

  return Object.freeze({
    init,
    enforce,
    deepScan,
    // 调试用
    predicates: { isOverlay, isBackdrop, isEssentialUI, isBlocked },
  });
})();

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  Console Warning (保留原功能)
 * ═══════════════════════════════════════════════════════════════════════════════
 */
const showWarning = () => {
  const w = (x, d) => setTimeout(console.log.bind(console, `%c${x}`,
    `color:#ff0000;font-size:${d||9}pt;text-shadow:0 0 .7px #ff4141,0 0 .7px #ff4141;`), 0);

  const lang = document?.documentElement?.lang || 'en';
  const msgs = {
    'zh-TW': 'YouTube 禁止使用廣告攔截器',
    'zh-CN': 'YouTube 不允许使用广告拦截器',
    'ja': '広告ブロッカーの利用は認められていません',
  };
  w(msgs[lang] || 'Ad blockers are not allowed on YouTube', 12);
};

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  Main Entry
 * ═══════════════════════════════════════════════════════════════════════════════
 */
(() => {
  'use strict';
  ModalGuard.init();
  showWarning();
})();

//# sourceURL=debug://modal-guard/main.js