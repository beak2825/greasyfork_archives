// ==UserScript==
// @name         YouTube Mobile 评论自动@用户名+引用 (全局版)
// @namespace    yt-mobile-autoreply
// @version      1.6
// @description  Cromite 兼容版：点击任何Reply时，自动在输入框插入“@用户名 「原评论内容不超过100字」”，日志3秒后自动消失
// @match        https://m.youtube.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553174/YouTube%20Mobile%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%40%E7%94%A8%E6%88%B7%E5%90%8D%2B%E5%BC%95%E7%94%A8%20%28%E5%85%A8%E5%B1%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553174/YouTube%20Mobile%20%E8%AF%84%E8%AE%BA%E8%87%AA%E5%8A%A8%40%E7%94%A8%E6%88%B7%E5%90%8D%2B%E5%BC%95%E7%94%A8%20%28%E5%85%A8%E5%B1%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ====== 页面日志（3秒自动移除） ======
  function log(msg) {
    let box = document.getElementById('yt-reply-debug');
    if (!box) {
      box = document.createElement('div');
      box.id = 'yt-reply-debug';
      Object.assign(box.style, {
        position: 'fixed',
        bottom: '0',
        left: '0',
        background: 'rgba(0,0,0,0.75)',
        color: '#0f0',
        fontSize: '11px',
        padding: '4px 6px',
        zIndex: 999999,
        fontFamily: 'monospace',
        pointerEvents: 'none'
      });
      document.body.appendChild(box);
    }
    const line = document.createElement('div');
    line.textContent = msg;
    line.style.transition = 'opacity 0.6s ease';
    box.appendChild(line);
    setTimeout(() => {
      line.style.opacity = '0';
      setTimeout(() => line.remove(), 600);
    }, 3000);
  }

  let lastClickedUser = null;
  let lastClickedText = null;

  // ====== 抓用户名 ======
  function extractUsername(comment) {
    if (!comment) return null;
    const sel = [
      '.YtmCommentRendererTitle .yt-core-attributed-string',
      'a.yt-core-attributed-string',
      'yt-attributed-string',
      '[id*="author-text"]',
      '[role="link"] span'
    ];
    for (const s of sel) {
      const el = comment.querySelector(s);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return null;
  }

  // ====== 抓评论文字内容（最多30字） ======
  function extractCommentText(comment) {
    if (!comment) return null;
    let el = comment.querySelector('.YtmCommentRendererText .yt-core-attributed-string');
    if (!el) el = comment.querySelector('.YtmCommentRendererText');
    if (!el) {
      el = comment.querySelector('span.yt-core-attributed-string');
    }
    if (!el) return null;
    let txt = el.textContent.trim().replace(/\s+/g, ' ');
    if (txt.length > 30) txt = txt.slice(0, 30) + '…';
    return txt;
  }

  // ====== 全局点击捕获 ======
  document.addEventListener('click', function(e) {
    const comment = e.target.closest('ytm-comment-renderer');
    if (comment) {
      lastClickedUser = extractUsername(comment);
      lastClickedText = extractCommentText(comment);
      log(`[YT Reply Script] 捕获用户名: ${lastClickedUser || '(空)'} | 文本: ${lastClickedText || '(空)'}`);
    }

    const replyText = e.target.textContent?.trim();
    if (replyText === 'Reply' || replyText === '回复') {
      log('[YT Reply Script] 检测到点击 Reply 按钮');
      waitForReplyDialog();
    }
  }, true);

  // ====== 监听 shadowRoot 内 click ======
  const openShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function(init) {
    const shadow = openShadow.call(this, init);
    shadow.addEventListener('click', function(ev) {
      const text = ev.target.textContent?.trim();
      if (text === 'Reply' || text === '回复') {
        log('[YT Reply Script] Shadow DOM 内检测到 Reply 点击');
        waitForReplyDialog();
      }
    }, true);
    return shadow;
  };

  // ====== 监听对话框出现 ======
  function waitForReplyDialog() {
    const observer = new MutationObserver(() => {
      const textarea = document.querySelector('dialog .YtmCommentReplyDialogRendererInput');
      if (textarea) {
        log('[YT Reply Script] 回复输入框已出现');
        observer.disconnect();
        insertQuoteWithRetry(textarea);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ====== 稳定插入逻辑（带引用） ======
  function insertQuoteWithRetry(textarea, attempt = 0) {
    if (!textarea || !lastClickedUser) return;

    const username = lastClickedUser.startsWith('@') ? lastClickedUser : '@' + lastClickedUser;
    const quote = lastClickedText ? ` 「${lastClickedText}」` : '';
    const content = `${username}${quote} `;

    setTimeout(() => {
      textarea.focus();
      textarea.value = content;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      if (textarea.value.startsWith(username)) {
        log(`[YT Reply Script] 插入引用成功 ✅ (${attempt + 1}次尝试)`);
      } else if (attempt < 15) {
        insertQuoteWithRetry(textarea, attempt + 1);
      }
    }, 100 + attempt * 100);
  }

  log('[YT Reply Script] 全局引用版已加载');
})();
