// ==UserScript==
// @name         linux.do 外链直达（绕过确认弹窗）
// @namespace    https://linux.do/
// @version      0.3
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

  function extractUrlAtClickPoint(e) {
    const info = getTextNodeAndOffsetFromPoint(e.clientX, e.clientY);
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

  function getCandidateUrlFromClick(e) {
    const origin = location.origin;

    // 1) 常规 <a href>
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (a && a.href) {
      try {
        const u = new URL(a.href, location.href);
        if (u.origin !== origin) return u.href;
      } catch {}
    }

    // 2) Pure text URL: only trigger when the click point is *on* the URL text.
    const urlAtPoint = extractUrlAtClickPoint(e);
    if (urlAtPoint) {
      try {
        const u = new URL(urlAtPoint, location.href);
        if (u.origin !== origin) return u.href;
      } catch {}
    }

    // 3) 选中文本里有 URL
    const sel = window.getSelection && window.getSelection();
    const selectedText = sel && sel.toString ? sel.toString() : '';
    if (selectedText) {
      const url = extractUrlFromText(selectedText);
      if (url) {
        try {
          const u = new URL(trimUrl(url), location.href);
          if (u.origin !== origin) return u.href;
        } catch {}
      }
    }

    return '';
  }

  // 捕获阶段拦截：尽量在 Discourse 自己弹框之前处理
  window.addEventListener(
    'click',
    (e) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 && e.button !== 1) return;

      if (shouldLetSiteHandleClick(e.target)) return;

      const url = getCandidateUrlFromClick(e);
      if (!url) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const wantNewTab =
        OPEN_IN_NEW_TAB ||
        (e.target && e.target.closest && e.target.closest('a[target=\"_blank\"]')) ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.button === 1;

      openUrl(url, wantNewTab);
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

      openUrl(url, OPEN_IN_NEW_TAB);

      const closeBtn =
        document.querySelector('button.modal-close, .d-modal__close, button[aria-label=\"Close\"]') ||
        Array.from(document.querySelectorAll('button')).find((b) => (b.innerText || '').trim() === 'Cancel');
      if (closeBtn) closeBtn.click();
    };

    new MutationObserver(() => tryBypassModal()).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();
