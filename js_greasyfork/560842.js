// ==UserScript==
// @name         YouTube Mobile Auto Expand + Copy Unlock (Formal Verification v11.1)
// @namespace    http://tampermonkey.net/
// @version      11.1
// @description  v11.1: 支持评论区 Read more 自动展开 + 支持 …more/...more；状态不变量+穷尽扫描+三重确认+防Description跳转
// @author       ?
// @license      CC-BY-4.0
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560842/YouTube%20Mobile%20Auto%20Expand%20%2B%20Copy%20Unlock%20%28Formal%20Verification%20v111%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560842/YouTube%20Mobile%20Auto%20Expand%20%2B%20Copy%20Unlock%20%28Formal%20Verification%20v111%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // §1. FORMAL SPECIFICATION (Coq-style invariants as comments)
  // ═══════════════════════════════════════════════════════════════════
  //
  // INVARIANT INV_EPOCH:
  //   ∀ element ∈ DOM:
  //     seenAt[element].epoch = currentEpoch ∨ seenAt[element] = ⊥
  //
  // INVARIANT INV_CLICK_ONCE:
  //   ∀ element, epoch:
  //     clickedInEpoch[element][epoch] = true →
  //       ¬canClick(element) until newEpoch ∨ confirmed(element) = false
  //
  // INVARIANT INV_COMPLETENESS:
  //   ∀ expandable ∈ visibleDOM:
  //     ∃ scanCycle: expandable ∈ scanned(scanCycle)
  //
  // INVARIANT INV_TERMINATION:
  //   clicksGlobal ≤ maxClicksGlobal ∧ clicksPerEpoch ≤ maxClicksPerEpoch
  //
  // INVARIANT INV_NO_DESCRIPTION_JUMP:
  //   ∀ click on description "Read More":
  //     event.preventDefault() ∧ ¬scrollTo(description)
  //
  // ═══════════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════════
  // §2. CONFIGURATION (immutable)
  // ═══════════════════════════════════════════════════════════════════
  const CONFIG = Object.freeze({
    debug: true,

    // Resource bounds (INV_TERMINATION)
    maxClicksPerEpoch: 400,
    maxClicksGlobal: 3000,

    // Retry policy
    maxRetriesPerElement: 8,
    retryBaseDelayMs: 600,
    retryBackoffFactor: 1.3,

    // Scan intervals (INV_COMPLETENESS)
    fastScanMs: 300,
    normalScanMs: 900,
    slowScanMs: 2500,

    // Visibility
    rootMarginPx: 1200,

    // Cooldowns
    elementCooldownMs: 1500,
    mutationThrottleMs: 60,

    // Click timing
    clickDelayMs: 15,
    confirmationDelayMs: 500,

    // Stability gate
    minStableMsBeforeClick: 80,

    // Network hook
    enableNetworkHook: true,
    networkRescanDelayMs: 80,

    // Triple-scan after network (穷尽式)
    postNetworkScanDelays: [50, 200, 600, 1200],

    // Epoch rebuild detection
    rebuildCheckMs: 500,

    // Anti-description-jump
    preventDescriptionScroll: true,
  });

  const log = (...args) => CONFIG.debug && console.log('[YT-V11.1]', ...args);
  const warn = (...args) => console.warn('[YT-V11.1]', ...args);

  // ═══════════════════════════════════════════════════════════════════
  // §3. STATE (with epoch-aware maps for INV_EPOCH)
  // ═══════════════════════════════════════════════════════════════════
  const state = {
    epoch: 0,
    clicksThisEpoch: 0,
    clicksGlobal: 0,
    lastUrl: '',

    // Epoch-aware tracking (WeakMap<Element, {epoch, ...}>)
    seenAt: new WeakMap(),
    lastAttemptAt: new WeakMap(),
    retriesCount: new WeakMap(),
    confirmedExpanded: new WeakMap(),

    // Pending set (cleared on epoch change)
    pending: new WeakSet(),

    // Observer references
    io: null,
    mo: null,
    fastTimer: null,
    normalTimer: null,
    slowTimer: null,

    // DOM anchor references
    commentsRootRef: null,
    descriptionRootRef: null,

    // Network hook originals
    _fetch: null,
    _xhrOpen: null,
    _xhrSend: null,

    // Scroll position lock (anti-jump)
    scrollLock: { active: false, y: 0 },
  };

  const now = () => Date.now();
  const normalizeText = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  // ═══════════════════════════════════════════════════════════════════
  // §4. EPOCH-AWARE DATA ACCESS (ensures INV_EPOCH)
  // ═══════════════════════════════════════════════════════════════════
  function epochGet(map, el, field, defaultVal) {
    const entry = map.get(el);
    if (!entry || entry.epoch !== state.epoch) return defaultVal;
    return entry[field];
  }

  function epochSet(map, el, data) {
    map.set(el, { ...data, epoch: state.epoch });
  }

  function clearEpochData() {
    state.pending = new WeakSet();
  }

  // ═══════════════════════════════════════════════════════════════════
  // §5. COPY UNLOCK
  // ═══════════════════════════════════════════════════════════════════
  function installCopyUnlock() {
    const style = document.createElement('style');
    style.id = 'yt-copy-unlock-v11';
    style.textContent = `
      *, *::before, *::after {
        -webkit-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }
      body, html, ytm-app, #app, #content,
      ytm-video-description-header-renderer,
      ytm-expandable-video-description-body-renderer,
      ytm-comment-renderer,
      .yt-core-attributed-string,
      #description, #description-inline-expander,
      ytm-comment-text-renderer,
      ytd-comment-renderer, ytd-comments, ytd-comment-thread-renderer,
      ytd-expandable-video-description-body-renderer, ytd-watch-metadata {
        -webkit-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }
    `;

    const appendStyle = () => {
      try {
        const target = document.documentElement || document.head || document.body;
        if (target && !document.getElementById('yt-copy-unlock-v11')) {
          target.appendChild(style);
        }
      } catch (_) {}
    };

    if (document.documentElement) appendStyle();
    else document.addEventListener('DOMContentLoaded', appendStyle, { once: true });

    const unblockEvents = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart'];
    const unblockHandler = (e) => e.stopImmediatePropagation();

    for (const evt of unblockEvents) {
      window.addEventListener(evt, unblockHandler, true);
      document.addEventListener(evt, unblockHandler, true);
    }

    log('✓ Copy unlock installed');
  }

  function clearInlineHandlers(root) {
    if (!root || root.nodeType !== 1) return;
    try {
      const els = root.querySelectorAll?.(
        '[oncopy],[oncut],[onpaste],[onselectstart],[oncontextmenu],[ondragstart]'
      );
      if (!els) return;
      for (const el of els) {
        el.oncopy = el.oncut = el.onpaste = null;
        el.onselectstart = el.oncontextmenu = el.ondragstart = null;
      }
    } catch (_) {}
  }

  // ═══════════════════════════════════════════════════════════════════
  // §6. DOM UTILITIES
  // ═══════════════════════════════════════════════════════════════════
  function isElement(el) {
    return el && typeof el === 'object' && el.nodeType === 1;
  }

  function isVisible(el) {
    if (!isElement(el)) return false;
    if (!el.isConnected) return false;

    try {
      const style = getComputedStyle(el);
      if (style.display === 'none') return false;
      if (style.visibility === 'hidden') return false;
      if (parseFloat(style.opacity) === 0) return false;

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;

      return true;
    } catch (_) {
      return false;
    }
  }

  function inViewport(el) {
    if (!isElement(el)) return false;
    try {
      const rect = el.getBoundingClientRect();
      const margin = CONFIG.rootMarginPx;
      const vh = window.innerHeight || 0;
      const vw = window.innerWidth || 0;

      return (
        rect.bottom >= -margin &&
        rect.top <= vh + margin &&
        rect.right >= -margin &&
        rect.left <= vw + margin
      );
    } catch (_) {
      return false;
    }
  }

  function getTextContent(el) {
    if (!isElement(el)) return '';
    const aria = el.getAttribute('aria-label') || el.getAttribute('title') || '';
    const text = el.innerText || el.textContent || '';
    return normalizeText(aria || text);
  }

  function isDisabled(el) {
    if (!isElement(el)) return true;
    return (
      el.disabled === true ||
      el.getAttribute('aria-disabled') === 'true' ||
      el.classList.contains('disabled')
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // §7. DEEP QUERY (traverse shadow DOM)
  // ═══════════════════════════════════════════════════════════════════
  function queryAllDeep(selector, root = document) {
    const results = [];
    const seen = new WeakSet();
    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift();
      if (!node || seen.has(node)) continue;

      const base = node.nodeType === 9 ? node.documentElement : node;
      if (!base) continue;

      seen.add(node);

      try {
        if (base.querySelectorAll) {
          const matches = base.querySelectorAll(selector);
          for (const m of matches) {
            if (!seen.has(m)) {
              results.push(m);
              seen.add(m);
            }
          }
        }
      } catch (_) {}

      try {
        const walker = document.createTreeWalker(base, NodeFilter.SHOW_ELEMENT);
        let cur = walker.currentNode;
        while (cur) {
          if (cur.shadowRoot && !seen.has(cur.shadowRoot)) {
            queue.push(cur.shadowRoot);
          }
          cur = walker.nextNode();
        }
      } catch (_) {}
    }

    return results;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §8. CLASSIFICATION
  // ═══════════════════════════════════════════════════════════════════
  const PATTERNS = Object.freeze({
    SHOW_REPLIES: [
      /^view\s*\d*\s*repl(y|ies)$/,
      /^show\s*\d*\s*repl(y|ies)$/,
      /^\d+\s*repl(y|ies)$/,
      /^show\s+more\s+repl(y|ies)$/,
      /^load\s+more\s+repl(y|ies)$/,
      /^查看\s*\d*\s*条?回复$/,
      /^显示\s*\d*\s*条?回复$/,
      /^\d+\s*条?回复$/,
      /^更多回复$/,
      /^\d+件の返信/,
      /^返信を表示/,
      /^antworten\s*anzeigen/,
      /^afficher.*réponses?/,
      /^mostrar.*respuestas?/,
    ],
    READ_MORE: [
      /^read\s*more$/,
      /^show\s*more$/,
      /^more$/,
      /^expand$/,
      /^see\s*more$/,
      /^\.{3}\s*more$/,   // ...more
      /^…\s*more$/,       // …more
      /^\.{3}\s*更多$/,   // ...更多
      /^…\s*更多$/,       // …更多
      /^展开$/,
      /^更多$/,
      /^显示更多$/,
      /^阅读全文$/,
      /^もっと見る$/,
      /^詳細$/,
      /^weiterlesen$/,
      /^voir\s*plus$/,
      /^mostrar\s*más$/,
      /^показать\s*больше$/,
    ],
    EXCLUDE_READ: [
      /subscribe/,
      /like|dislike/,
      /share/,
      /download/,
      /save/,
      /report/,
      /repl(y|ies)/,
      /回复/,
      /返信/,
    ],
    EXCLUDE_REPLIES: [
      /^hide/,
      /^less/,
      /^收起/,
      /^隐藏/,
      /^read\s*more$/,
      /^show\s*more$/,
      /^展开$/,
      /^更多$/,
    ],
    ALREADY_EXPANDED: [
      /read\s*less/,
      /show\s*less/,
      /^less$/,
      /收起/,
      /隐藏/,
      /^hide/,
    ],
  });

  function matchesAny(text, patterns) {
    return patterns.some(p => p.test(text));
  }

  // ✅ v11.1: 扩展 comments 区域判断（兼容 m.youtube.com 桌面布局 ytd 组件）
  function isInCommentsArea(el) {
    if (!isElement(el)) return false;
    try {
      return !!el.closest(
        'ytm-comment-section-renderer, ytm-comment-thread-renderer, ' +
        'ytm-comment-replies-renderer, #comments, #comment-replies, ' +
        'ytm-comments-entry-point-header-renderer, ' +
        // desktop(ytd) variants:
        'ytd-comments, ytd-comment-thread-renderer, ytd-comment-renderer, ' +
        'ytd-comment-replies-renderer, ytd-comments-header-renderer, ' +
        'ytd-engagement-panel-section-list-renderer'
      );
    } catch (_) {
      return false;
    }
  }

  // ✅ v11.1: 扩展 description 区域判断（兼容 ytd 组件）
  function isInDescriptionArea(el) {
    if (!isElement(el)) return false;
    try {
      return !!el.closest(
        '#description, #description-inline-expander, ' +
        'ytm-expandable-video-description-body-renderer, ' +
        'ytm-text-inline-expander, ytm-watch-metadata, ' +
        'ytm-video-description-header-renderer, ' +
        // desktop(ytd) variants:
        'ytd-watch-metadata, ytd-video-description-renderer, ' +
        'ytd-expandable-video-description-body-renderer, ytd-text-inline-expander'
      );
    } catch (_) {
      return false;
    }
  }

  function isAlreadyExpanded(el, type) {
    if (!isElement(el)) return true;

    const aria = el.getAttribute('aria-expanded');
    if (aria === 'true') return true;

    if (el.hidden) return true;

    const text = getTextContent(el);
    if (matchesAny(text, PATTERNS.ALREADY_EXPANDED)) return true;

    if (epochGet(state.confirmedExpanded, el, 'expanded', false)) return true;

    return false;
  }

  // ✅ v11.1: READ_MORE 允许出现在“评论区”与“描述区”
  function classify(el) {
    if (!isElement(el)) return null;

    const text = getTextContent(el);
    if (!text || text.length > 100) return null;

    // Priority 1: SHOW_REPLIES
    if (matchesAny(text, PATTERNS.SHOW_REPLIES)) {
      if (!matchesAny(text, PATTERNS.EXCLUDE_REPLIES)) {
        if (isInCommentsArea(el) || /repl|回复|返信/i.test(text)) {
          return { type: 'SHOW_REPLIES', text };
        }
      }
    }

    // Priority 2: READ_MORE (description OR comments OR aria-expanded)
    if (matchesAny(text, PATTERNS.READ_MORE)) {
      if (!matchesAny(text, PATTERNS.EXCLUDE_READ)) {
        if (isInDescriptionArea(el) || isInCommentsArea(el) || el.hasAttribute('aria-expanded')) {
          return { type: 'READ_MORE', text };
        }
      }
    }

    return null;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §9. BUDGET MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  function canClickMore() {
    return (
      state.clicksGlobal < CONFIG.maxClicksGlobal &&
      state.clicksThisEpoch < CONFIG.maxClicksPerEpoch
    );
  }

  function recordClick() {
    state.clicksThisEpoch++;
    state.clicksGlobal++;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §10. STABILITY & RETRY MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  function markSeen(el) {
    if (!isElement(el)) return;
    const existing = state.seenAt.get(el);
    if (!existing || existing.epoch !== state.epoch) {
      epochSet(state.seenAt, el, { ts: now() });
    }
  }

  function isStableEnough(el) {
    const ts = epochGet(state.seenAt, el, 'ts', 0);
    if (!ts) return false;
    return (now() - ts) >= CONFIG.minStableMsBeforeClick;
  }

  function isOnCooldown(el) {
    const ts = epochGet(state.lastAttemptAt, el, 'ts', 0);
    return (now() - ts) < CONFIG.elementCooldownMs;
  }

  function markAttempt(el) {
    epochSet(state.lastAttemptAt, el, { ts: now() });
  }

  function getRetryCount(el) {
    return epochGet(state.retriesCount, el, 'n', 0);
  }

  function incrementRetry(el) {
    const n = getRetryCount(el) + 1;
    epochSet(state.retriesCount, el, { n });
    return n;
  }

  function resetRetry(el) {
    epochSet(state.retriesCount, el, { n: 0 });
  }

  function getRetryDelay(retryCount) {
    return CONFIG.retryBaseDelayMs * Math.pow(CONFIG.retryBackoffFactor, retryCount);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §11. ANTI-DESCRIPTION-JUMP
  // ═══════════════════════════════════════════════════════════════════
  function lockScroll() {
    if (!CONFIG.preventDescriptionScroll) return;
    state.scrollLock.active = true;
    state.scrollLock.y = window.scrollY;
  }

  function unlockScroll() {
    if (!CONFIG.preventDescriptionScroll) return;
    if (state.scrollLock.active) {
      const delta = Math.abs(window.scrollY - state.scrollLock.y);
      if (delta > 50) {
        window.scrollTo({ top: state.scrollLock.y, behavior: 'instant' });
        log('↩ Prevented description scroll jump');
      }
    }
    state.scrollLock.active = false;
  }

  // ✅ v11.1: 真正阻止 description 点击默认跳转（不 stopPropagation，保证展开逻辑还能执行）
  function installPreventDescriptionDefault() {
    if (!CONFIG.preventDescriptionScroll) return;

    document.addEventListener('click', (e) => {
      const t = e.target?.closest?.('a, button, [role="button"], span, yt-formatted-string, tp-yt-paper-button');
      if (!t) return;
      if (!isInDescriptionArea(t)) return;

      const meta = classify(t);
      if (meta && meta.type === 'READ_MORE') {
        e.preventDefault();
      }
    }, true);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §12. CLICK ENGINE
  // ═══════════════════════════════════════════════════════════════════
  function resolveClickTargets(el) {
    const targets = new Set();
    if (!isElement(el)) return [];

    targets.add(el);

    try {
      const ancestor = el.closest('button, [role="button"], a, tp-yt-paper-button, ytm-button-renderer, ytd-button-renderer, yt-formatted-string');
      if (ancestor) targets.add(ancestor);
    } catch (_) {}

    try {
      el.querySelectorAll('button, [role="button"], a, yt-formatted-string').forEach(x => targets.add(x));
    } catch (_) {}

    try {
      if (el.shadowRoot) {
        el.shadowRoot.querySelectorAll('button, [role="button"], a, yt-formatted-string').forEach(x => targets.add(x));
      }
    } catch (_) {}

    return Array.from(targets).filter(isElement);
  }

  function dispatchClickEvents(target, isDescription) {
    if (!isElement(target)) return;

    try {
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const topEl = document.elementFromPoint(cx, cy) || target;

      const eventInit = {
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window,
        clientX: cx,
        clientY: cy,
      };

      if (isDescription) lockScroll();

      try {
        topEl.dispatchEvent(new PointerEvent('pointerdown', {
          ...eventInit, pointerType: 'touch', isPrimary: true
        }));
        topEl.dispatchEvent(new PointerEvent('pointerup', {
          ...eventInit, pointerType: 'touch', isPrimary: true
        }));
      } catch (_) {}

      try {
        topEl.dispatchEvent(new MouseEvent('mousedown', { ...eventInit, button: 0 }));
        topEl.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, button: 0 }));
        topEl.dispatchEvent(new MouseEvent('click', { ...eventInit, button: 0 }));
      } catch (_) {}

      try {
        topEl.click();
      } catch (_) {}

      if (isDescription) {
        setTimeout(unlockScroll, 100);
        setTimeout(unlockScroll, 300);
      }

    } catch (e) {
      warn('Click dispatch error:', e);
    }
  }

  function confirmExpansion(el, type, beforeText) {
    if (!document.contains(el)) return true;

    const aria = el.getAttribute('aria-expanded');
    if (aria === 'true') return true;

    const afterText = getTextContent(el);
    if (afterText && beforeText && afterText !== beforeText) {
      if (matchesAny(afterText, PATTERNS.ALREADY_EXPANDED)) return true;
    }

    if (type === 'SHOW_REPLIES') {
      try {
        const container = el.closest('ytm-comment-thread-renderer, ytm-comment-replies-renderer, ytd-comment-thread-renderer, ytd-comment-replies-renderer');
        if (container) {
          const replies = container.querySelectorAll(
            'ytm-comment-renderer, ytm-comment-view-model, ytd-comment-renderer'
          );
          if (replies.length > 0) return true;
        }
      } catch (_) {}
    }

    if (el.hidden || isDisabled(el)) return true;
    if (!isVisible(el)) return true;

    return false;
  }

  function tryClick(el, meta, source = '') {
    if (!isElement(el)) return;
    if (!canClickMore()) return;

    if (state.pending.has(el)) return;
    if (isOnCooldown(el)) return;

    markSeen(el);

    if (!isStableEnough(el)) {
      setTimeout(() => tryClick(el, meta, source + '-retry'), CONFIG.minStableMsBeforeClick + 50);
      return;
    }

    const { type, text } = meta;

    if (!isVisible(el)) return;
    if (!inViewport(el)) return;
    if (isDisabled(el)) return;
    if (isAlreadyExpanded(el, type)) return;

    const retries = getRetryCount(el);
    if (retries >= CONFIG.maxRetriesPerElement) return;

    state.pending.add(el);
    markAttempt(el);

    const beforeText = text;
    const isDescription = (type === 'READ_MORE' && isInDescriptionArea(el));

    const targets = resolveClickTargets(el).filter(isVisible);
    const clickTarget = targets[0] || el;

    setTimeout(() => {
      try {
        if (!isVisible(clickTarget) || !canClickMore()) {
          state.pending.delete(el);
          return;
        }

        dispatchClickEvents(clickTarget, isDescription);
        recordClick();

        log(`✓ ${type} e${state.epoch} [${state.clicksThisEpoch}/${state.clicksGlobal}] "${text.slice(0, 50)}" ${source}`);

        setTimeout(() => {
          state.pending.delete(el);

          const confirmed = confirmExpansion(el, type, beforeText);

          if (confirmed) {
            epochSet(state.confirmedExpanded, el, { expanded: true });
            resetRetry(el);
            scheduleLocalRescan(el);
            log(`  ✓ Confirmed: ${type}`);
          } else {
            const newRetry = incrementRetry(el);
            const delay = getRetryDelay(newRetry);
            log(`  ✗ Not confirmed, retry ${newRetry}/${CONFIG.maxRetriesPerElement} in ${delay}ms`);

            setTimeout(() => {
              if (canClickMore() && newRetry < CONFIG.maxRetriesPerElement) {
                tryClick(el, meta, `retry-${newRetry}`);
              }
            }, delay);

            scheduleLocalRescan(el);
          }
        }, CONFIG.confirmationDelayMs);

      } catch (e) {
        state.pending.delete(el);
        warn('Click execution error:', e);
      }
    }, CONFIG.clickDelayMs);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §13. CANDIDATE DISCOVERY
  // ═══════════════════════════════════════════════════════════════════
  const CANDIDATE_SELECTORS = [
    'button',
    '[role="button"]',
    'a[href="#"]',
    '#expand',
    '#more',
    '.more-button',
    '.expand-button',
    '#more-replies button',
    '#more-replies [role="button"]',
    '[aria-expanded="false"]',
    '.yt-core-attributed-string__link--call-to-action',
    'ytm-button-renderer',
    'tp-yt-paper-button',

    // ✅ v11.1: 兼容桌面(ytd)“Read more”常见形态
    'yt-formatted-string#more',
    'yt-formatted-string.more-button',
    'ytd-button-renderer',
    'ytd-toggle-button-renderer',
    'ytd-expander #more',
    'ytd-expander #more-button',
  ];

  function scanForCandidates(root = document.documentElement) {
    if (!state.io) return;

    const scopes = [];

    const commentsRoot = document.querySelector(
      '#comments, ytm-comment-section-renderer, ytm-comments-entry-point-header-renderer, ytd-comments, ytd-engagement-panel-section-list-renderer'
    );
    if (commentsRoot) scopes.push(commentsRoot);

    const descRoot = document.querySelector(
      '#description, #description-inline-expander, ytm-watch-metadata, ytd-watch-metadata, ytd-video-description-renderer'
    );
    if (descRoot) scopes.push(descRoot);

    if (scopes.length === 0) scopes.push(root);

    let candidateCount = 0;

    for (const scope of scopes) {
      for (const selector of CANDIDATE_SELECTORS) {
        let elements = [];
        try {
          elements = queryAllDeep(selector, scope);
        } catch (_) {}

        for (const el of elements) {
          if (!isElement(el)) continue;

          markSeen(el);

          const meta = classify(el);
          if (!meta) continue;

          candidateCount++;

          if (isVisible(el) && inViewport(el)) {
            tryClick(el, meta, 'scan');
          }

          try {
            state.io.observe(el);
          } catch (_) {}
        }
      }
    }

    return candidateCount;
  }

  function scheduleLocalRescan(el) {
    if (!isElement(el)) return;

    const scope = el.closest?.(
      'ytm-comment-thread-renderer, ytm-comment-section-renderer, ' +
      'ytm-comment-replies-renderer, ytm-watch-metadata, #description, #comments, ' +
      'ytd-comment-thread-renderer, ytd-comments, ytd-comment-replies-renderer, ytd-watch-metadata'
    ) || document.documentElement;

    setTimeout(() => scanForCandidates(scope), 80);
    setTimeout(() => scanForCandidates(scope), 250);
    setTimeout(() => scanForCandidates(scope), 600);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §14. EPOCH MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  function getCommentsRoot() {
    return document.querySelector('#comments, ytm-comment-section-renderer, ytd-comments, ytd-engagement-panel-section-list-renderer') || null;
  }

  function getDescriptionRoot() {
    return document.querySelector('#description, #description-inline-expander, ytd-watch-metadata, ytd-video-description-renderer') || null;
  }

  function newEpoch(reason) {
    state.epoch++;
    state.clicksThisEpoch = 0;
    clearEpochData();

    log(`★ NEW EPOCH ${state.epoch}: ${reason}`);

    restartObservers();
  }

  function checkForRebuild() {
    if (state.commentsRootRef) {
      if (!document.contains(state.commentsRootRef)) {
        state.commentsRootRef = getCommentsRoot();
        newEpoch('comments-removed');
        return true;
      }

      const current = getCommentsRoot();
      if (current && current !== state.commentsRootRef) {
        state.commentsRootRef = current;
        newEpoch('comments-replaced');
        return true;
      }
    } else {
      const current = getCommentsRoot();
      if (current) {
        state.commentsRootRef = current;
      }
    }

    if (state.descriptionRootRef) {
      if (!document.contains(state.descriptionRootRef)) {
        state.descriptionRootRef = getDescriptionRoot();
        return false;
      }
    } else {
      state.descriptionRootRef = getDescriptionRoot();
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════
  // §15. OBSERVERS
  // ═══════════════════════════════════════════════════════════════════
  function stopObservers() {
    try { state.io?.disconnect(); } catch (_) {}
    try { state.mo?.disconnect(); } catch (_) {}
    try { if (state.fastTimer) clearInterval(state.fastTimer); } catch (_) {}
    try { if (state.normalTimer) clearInterval(state.normalTimer); } catch (_) {}
    try { if (state.slowTimer) clearInterval(state.slowTimer); } catch (_) {}

    state.io = null;
    state.mo = null;
    state.fastTimer = null;
    state.normalTimer = null;
    state.slowTimer = null;
  }

  function restartObservers() {
    stopObservers();

    state.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target;
          markSeen(el);

          const meta = classify(el);
          if (!meta) continue;

          tryClick(el, meta, 'IO');
        }
      },
      {
        root: null,
        rootMargin: `${CONFIG.rootMarginPx}px 0px ${CONFIG.rootMarginPx}px 0px`,
        threshold: [0, 0.1],
      }
    );

    let mutationTimer = null;
    state.mo = new MutationObserver((mutations) => {
      if (mutationTimer) return;

      mutationTimer = setTimeout(() => {
        mutationTimer = null;

        checkForRebuild();

        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length) {
            for (const node of mutation.addedNodes) {
              if (node && node.nodeType === 1) {
                clearInlineHandlers(node);
                scanForCandidates(node);
              }
            }
          } else if (mutation.type === 'attributes') {
            const target = mutation.target;
            if (target && target.nodeType === 1) {
              const meta = classify(target);
              if (meta) tryClick(target, meta, 'attr');
            }
          }
        }
      }, CONFIG.mutationThrottleMs);
    });

    state.mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'aria-expanded', 'expanded', 'hidden',
        'style', 'class', 'disabled', 'aria-label'
      ],
    });

    scanForCandidates(document.documentElement);

    state.fastTimer = setInterval(() => scanForCandidates(), CONFIG.fastScanMs);

    setTimeout(() => {
      if (state.fastTimer) clearInterval(state.fastTimer);
      state.normalTimer = setInterval(() => scanForCandidates(), CONFIG.normalScanMs);
    }, 5000);

    state.slowTimer = setInterval(() => {
      checkForRebuild();
      scanForCandidates();
    }, CONFIG.slowScanMs);

    log('✓ Observers started');
  }

  // ═══════════════════════════════════════════════════════════════════
  // §16. NETWORK HOOKS
  // ═══════════════════════════════════════════════════════════════════
  const NETWORK_HINTS = [
    'youtubei/v1/next',
    'youtubei/v1/browse',
    'comment',
    'repl',
    'engagement',
    'continuation',
  ];

  function urlIsRelevant(url) {
    if (!url) return false;
    const s = String(url).toLowerCase();
    return NETWORK_HINTS.some(hint => s.includes(hint));
  }

  function triggerNetworkRescan(source) {
    for (const delay of CONFIG.postNetworkScanDelays) {
      setTimeout(() => {
        checkForRebuild();
        const count = scanForCandidates();
        if (count > 0) {
          log(`↻ Network rescan (${source}): found ${count} candidates`);
        }
      }, delay);
    }
  }

  function installNetworkHooks() {
    if (!CONFIG.enableNetworkHook) return;

    if (!state._fetch && typeof window.fetch === 'function') {
      state._fetch = window.fetch.bind(window);

      window.fetch = function (...args) {
        const url = args[0]?.url || args[0];
        const promise = state._fetch(...args);

        if (urlIsRelevant(url)) {
          promise
            .then(() => triggerNetworkRescan('fetch'))
            .catch(() => triggerNetworkRescan('fetch-err'));
        }

        return promise;
      };

      log('✓ Fetch hook installed');
    }

    const XHR = window.XMLHttpRequest;
    if (XHR && XHR.prototype && !state._xhrOpen) {
      state._xhrOpen = XHR.prototype.open;
      state._xhrSend = XHR.prototype.send;

      XHR.prototype.open = function (method, url) {
        this.__ytExpandUrl = url;
        return state._xhrOpen.apply(this, arguments);
      };

      XHR.prototype.send = function () {
        const url = this.__ytExpandUrl;
        if (urlIsRelevant(url)) {
          this.addEventListener('loadend', () => triggerNetworkRescan('xhr'), { once: true });
        }
        return state._xhrSend.apply(this, arguments);
      };

      log('✓ XHR hook installed');
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // §17. SPA NAVIGATION HANDLING
  // ═══════════════════════════════════════════════════════════════════
  function hookNavigation() {
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function () {
      const result = originalPush.apply(this, arguments);
      handleNavigation('pushState');
      return result;
    };

    history.replaceState = function () {
      const result = originalReplace.apply(this, arguments);
      handleNavigation('replaceState');
      return result;
    };

    window.addEventListener('popstate', () => handleNavigation('popstate'), { passive: true });
    window.addEventListener('yt-navigate-finish', () => handleNavigation('yt-navigate-finish'), { passive: true });
  }

  function handleNavigation(source) {
    const newUrl = location.href;
    if (newUrl === state.lastUrl) return;

    state.lastUrl = newUrl;
    state.commentsRootRef = null;
    state.descriptionRootRef = null;

    newEpoch(`navigation:${source}`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // §18. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════
  function init() {
    log('Initializing v11.1 (Read more in comments enabled)...');

    state.lastUrl = location.href;
    state.commentsRootRef = getCommentsRoot();
    state.descriptionRootRef = getDescriptionRoot();

    installCopyUnlock();
    clearInlineHandlers(document.documentElement);

    // ✅ v11.1: 防 description 跳转默认行为
    installPreventDescriptionDefault();

    installNetworkHooks();
    hookNavigation();
    restartObservers();

    setInterval(checkForRebuild, CONFIG.rebuildCheckMs);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        scanForCandidates();
      }
    });

    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => scanForCandidates(), 120);
    }, { passive: true });

    log('✓ Initialization complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // ═══════════════════════════════════════════════════════════════════
  // §19. DEBUG INTERFACE
  // ═══════════════════════════════════════════════════════════════════
  if (CONFIG.debug) {
    window.__YT_EXPAND_V11__ = {
      state,
      CONFIG,
      classify,
      scanForCandidates,
      newEpoch,
      checkForRebuild,
      getStats: () => ({
        epoch: state.epoch,
        clicksThisEpoch: state.clicksThisEpoch,
        clicksGlobal: state.clicksGlobal,
      }),
    };
    log('Debug: window.__YT_EXPAND_V11__');
  }

})();
