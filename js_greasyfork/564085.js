// ==UserScript==
// @name         linux.do 外链直达（绕过确认弹窗）
// @namespace    https://linux.do/
// @version      0.8
// @license      MIT
// @description  点击外链时直接打开，绕过 “Open External Link / Continue” 确认弹窗；支持纯文本/代码块URL
// @match        https://linux.do/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564085/linuxdo%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE%EF%BC%88%E7%BB%95%E8%BF%87%E7%A1%AE%E8%AE%A4%E5%BC%B9%E7%AA%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564085/linuxdo%20%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BE%BE%EF%BC%88%E7%BB%95%E8%BF%87%E7%A1%AE%E8%AE%A4%E5%BC%B9%E7%AA%97%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====== 配置区 ======
  // 留空 [] 表示所有外链都直达；填域名则只对这些域名直达（更安全）
  const ALLOW_HOSTS = [
    // 'example.com',
    // 'ldst0re.qzz.io',
  ];

  // true: 新标签页打开；false: 当前标签页跳转
  const OPEN_IN_NEW_TAB = true;

  // 兜底：如果仍然弹出确认框，自动读取框内URL并跳走
  const FALLBACK_WHEN_MODAL_SHOWS = true;

  // When clicking blurred/hidden (spoiler) content, let the site handle the click first.
  // This prevents "first click reveals content" interactions from being hijacked by this script.
  const IGNORE_SPOILER_BLUR = true;

  // Heuristics for common Discourse spoiler/blur implementations (can be extended as needed).
  // Note: selectors here try to match "still hidden" states where possible.
  const SPOILER_SELECTORS = [
    '.spoiler:not(.spoiled)',
    '.spoiler:not(.spoiler--revealed)',
    '.spoiler-blurred',
    '.spoiler-text:not(.spoiler-text--revealed)',
    '[data-spoiler]',
    '.blur',
    '.blurred',
  ];
  // ===================

  const RECENT = { url: '', ts: 0 };
  const URL_RE = /https?:\/\/[^\s"'<>]+/i;
  const URL_RE_G = /https?:\/\/[^\s"'<>]+/gi;

  const DRAG_THRESHOLD_PX = 6;
  const SELECTION_GUARD_WINDOW_MS = 900;

  function hostAllowed(urlString) {
    if (!ALLOW_HOSTS.length) return true;
    let host;
    try {
      host = new URL(urlString).hostname.toLowerCase();
    } catch {
      return false;
    }
    return ALLOW_HOSTS.some((h) => host === h.toLowerCase() || host.endsWith('.' + h.toLowerCase()));
  }

  function openUrl(urlString, inNewTab) {
    if (!/^https?:\/\//i.test(urlString)) return;
    if (!hostAllowed(urlString)) return;

    const now = Date.now();
    if (RECENT.url === urlString && now - RECENT.ts < 800) return;
    RECENT.url = urlString;
    RECENT.ts = now;

    if (inNewTab) window.open(urlString, '_blank', 'noopener,noreferrer');
    else window.location.assign(urlString);
  }

  function extractUrlFromText(text) {
    if (!text) return '';
    const m = String(text).match(URL_RE);
    return m ? m[0] : '';
  }

  function trimUrl(url) {
    // Remove trailing punctuation that often wraps URLs in prose: ")", ".", ",", etc.
    return String(url).replace(/[)\].,;!?}]+$/g, '');
  }

  function matchesAnySelector(el, selectors) {
    if (!el || !el.closest) return false;
    for (const sel of selectors) {
      try {
        if (el.closest(sel)) return true;
      } catch {
        // Ignore invalid selectors in case the site changes.
      }
    }
    return false;
  }

  function hasBlurFilter(el) {
    // Some implementations rely on CSS filter blur without stable classnames.
    // Walk up a few levels to keep this cheap.
    let cur = el;
    for (let i = 0; cur && i < 6; i++) {
      try {
        const cs = window.getComputedStyle(cur);
        const f = cs && cs.filter;
        if (f && f !== 'none' && /blur\(/i.test(f)) return true;
      } catch {}
      cur = cur.parentElement;
    }
    return false;
  }

  function shouldLetSiteHandleClick(target) {
    if (!IGNORE_SPOILER_BLUR) return false;
    if (!target) return false;

    // If click is within a spoiler/blur region, don't intercept so the first click can reveal.
    if (matchesAnySelector(target, SPOILER_SELECTORS)) return true;
    if (hasBlurFilter(target)) return true;

    return false;
  }

  function getTextNodeAndOffsetFromPoint(x, y) {
    // Prefer caretRangeFromPoint (Chromium), fallback to caretPositionFromPoint (Firefox).
    let node = null;
    let offset = 0;

    try {
      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(x, y);
        if (range) {
          node = range.startContainer;
          offset = range.startOffset;
        }
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(x, y);
        if (pos) {
          node = pos.offsetNode;
          offset = pos.offset;
        }
      }
    } catch {}

    // Normalize to a text node if possible.
    if (node && node.nodeType === Node.ELEMENT_NODE) {
      const child = node.childNodes && node.childNodes[offset];
      if (child && child.nodeType === Node.TEXT_NODE) {
        node = child;
        offset = 0;
      }
    }

    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    return { node, offset };
  }

  function extractUrlAtPoint(x, y) {
    const info = getTextNodeAndOffsetFromPoint(x, y);
    if (!info) return '';

    const text = info.node.textContent || '';
    const offset = Math.max(0, Math.min(info.offset, text.length));

    // Only treat as a URL if the click position is inside a URL match in that text node.
    for (const m of text.matchAll(URL_RE_G)) {
      const start = m.index ?? -1;
      if (start < 0) continue;
      const end = start + m[0].length;
      if (offset >= start && offset <= end) return trimUrl(m[0]);
    }

    return '';
  }

  function getExternalUrlFromAnchor(a) {
    if (!a || !a.href) return '';
    try {
      const u = new URL(a.href, location.href);
      return u.origin !== location.origin ? u.href : '';
    } catch {
      return '';
    }
  }

  function getCandidateExternalFromEvent(e) {
    const a = e && e.target && e.target.closest ? e.target.closest('a[href]') : null;
    const urlFromA = getExternalUrlFromAnchor(a);
    if (urlFromA) return { url: urlFromA, anchor: a };

    // Pure text URL: only trigger when the pointer is *on* the URL text.
    if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
      const urlAtPoint = extractUrlAtPoint(e.clientX, e.clientY);
      if (urlAtPoint) {
        try {
          const u = new URL(urlAtPoint, location.href);
          if (u.origin !== location.origin) return { url: u.href, anchor: null };
        } catch {}
      }
    }

    return { url: '', anchor: null };
  }

  function wantsNewTabFromEvent(e, anchor) {
    return (
      OPEN_IN_NEW_TAB ||
      (anchor && String(anchor.getAttribute('target') || '').toLowerCase() === '_blank') ||
      (e && (e.ctrlKey || e.metaKey || e.shiftKey)) ||
      (e && e.button === 1)
    );
  }

  // Right-click guard: some environments may emit a synthetic click after context menu.
  const CONTEXT_GUARD = { ts: 0, url: '' };
  const POINTER_GUARD = { downTs: 0, downUrl: '', downBtn: -1 };
  const DRAG_GUARD = {
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: false,
    upTs: 0,
    selecting: false,
  };

  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!e) return;
      if (e.button !== 0 && e.button !== 1) return;
      POINTER_GUARD.downTs = Date.now();
      POINTER_GUARD.downBtn = e.button;
      try {
        const candidate = getCandidateExternalFromEvent(e);
        POINTER_GUARD.downUrl = candidate && candidate.url ? candidate.url : '';
      } catch {
        POINTER_GUARD.downUrl = '';
      }

      // Track drag-selection intent for left button only.
      if (e.button === 0) {
        DRAG_GUARD.pointerId = e.pointerId;
        DRAG_GUARD.startX = e.clientX;
        DRAG_GUARD.startY = e.clientY;
        DRAG_GUARD.moved = false;
        DRAG_GUARD.selecting = false;
        DRAG_GUARD.upTs = 0;
      }
    },
    true
  );

  document.addEventListener(
    'pointermove',
    (e) => {
      if (!e) return;
      if (DRAG_GUARD.pointerId === null) return;
      if (e.pointerId !== DRAG_GUARD.pointerId) return;
      if (DRAG_GUARD.moved) return;

      const dx = e.clientX - DRAG_GUARD.startX;
      const dy = e.clientY - DRAG_GUARD.startY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) DRAG_GUARD.moved = true;
    },
    true
  );

  function finalizeDragGuard(e) {
    if (!e) return;
    if (DRAG_GUARD.pointerId === null) return;
    if (e.pointerId !== DRAG_GUARD.pointerId) return;

    DRAG_GUARD.pointerId = null;
    DRAG_GUARD.upTs = Date.now();

    const sel = window.getSelection && window.getSelection();
    const hasSelection = !!(sel && !sel.isCollapsed && String(sel.toString() || '').trim().length > 0);
    let selectionContainsTarget = true;
    try {
      if (hasSelection && sel && typeof sel.containsNode === 'function') {
        selectionContainsTarget = sel.containsNode(e.target, true);
      }
    } catch {}
    DRAG_GUARD.selecting = hasSelection && selectionContainsTarget;
  }

  document.addEventListener('pointerup', finalizeDragGuard, true);
  document.addEventListener('pointercancel', finalizeDragGuard, true);

  document.addEventListener(
    'contextmenu',
    (e) => {
      try {
        const candidate = getCandidateExternalFromEvent(e);
        CONTEXT_GUARD.url = candidate && candidate.url ? candidate.url : '';
        CONTEXT_GUARD.ts = Date.now();
        // Clear last pointerdown so a right-click can't accidentally reuse stale state.
        POINTER_GUARD.downTs = 0;
        POINTER_GUARD.downUrl = '';
        POINTER_GUARD.downBtn = -1;
      } catch {
        CONTEXT_GUARD.url = '';
        CONTEXT_GUARD.ts = Date.now();
        POINTER_GUARD.downTs = 0;
        POINTER_GUARD.downUrl = '';
        POINTER_GUARD.downBtn = -1;
      }
    },
    true
  );

  // 捕获阶段拦截：尽量在 Discourse 自己弹框之前处理
  window.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 && e.button !== 1) return;

      if (shouldLetSiteHandleClick(e.target)) return;

      const { url, anchor } = getCandidateExternalFromEvent(e);
      if (!url) return;
      if (!hostAllowed(url)) return;

      const now = Date.now();
      const recentlySelected =
        DRAG_GUARD.selecting && DRAG_GUARD.upTs && now - DRAG_GUARD.upTs < SELECTION_GUARD_WINDOW_MS;
      if (recentlySelected) {
        e.preventDefault();
        e.stopImmediatePropagation();
        DRAG_GUARD.selecting = false;
        POINTER_GUARD.downTs = 0;
        POINTER_GUARD.downUrl = '';
        POINTER_GUARD.downBtn = -1;
        return;
      }

      const isAfterContext = CONTEXT_GUARD.url && url === CONTEXT_GUARD.url;
      const hasFreshPointerAfterContext =
        isAfterContext && POINTER_GUARD.downTs && POINTER_GUARD.downTs > CONTEXT_GUARD.ts && POINTER_GUARD.downUrl === url;

      // After a contextmenu, only treat clicks as "intentional open" if there's a new pointerdown on the same URL.
      // This avoids accidental jumps when closing the context menu (some environments emit a synthetic click).
      if (isAfterContext && !hasFreshPointerAfterContext) {
        POINTER_GUARD.downTs = 0;
        POINTER_GUARD.downUrl = '';
        POINTER_GUARD.downBtn = -1;
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();

      if (isAfterContext) {
        CONTEXT_GUARD.url = '';
        CONTEXT_GUARD.ts = 0;
      }

      openUrl(url, wantsNewTabFromEvent(e, anchor));

      POINTER_GUARD.downTs = 0;
      POINTER_GUARD.downUrl = '';
      POINTER_GUARD.downBtn = -1;
    },
    true
  );

  // 兜底：如果确认框还是出来了，直接读框内 URL 跳走（并尝试关掉弹窗）
  if (FALLBACK_WHEN_MODAL_SHOWS) {
    const tryBypassModal = () => {
      const urlEl =
        document.querySelector('code.external-link-modal__url') ||
        document.querySelector('.external-link-modal__url');
      const url = extractUrlFromText(urlEl && (urlEl.textContent || urlEl.innerText));
      if (!url) return;
      if (!hostAllowed(url)) return;

      const isAfterContext = CONTEXT_GUARD.url && url === CONTEXT_GUARD.url;
      const hasFreshPointerAfterContext =
        isAfterContext && POINTER_GUARD.downTs && POINTER_GUARD.downTs > CONTEXT_GUARD.ts && POINTER_GUARD.downUrl === url;
      // If the external-link modal is triggered via right-click/contextmenu flow, don't auto-jump.
      if (isAfterContext && !hasFreshPointerAfterContext) return;

      openUrl(url, OPEN_IN_NEW_TAB);

      const closeBtn =
        document.querySelector('button.modal-close, .d-modal__close, button[aria-label="Close"]') ||
        Array.from(document.querySelectorAll('button')).find((b) => (b.innerText || '').trim() === 'Cancel');
      if (closeBtn) closeBtn.click();
    };

    new MutationObserver(() => tryBypassModal()).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
