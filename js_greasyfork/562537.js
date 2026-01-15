// ==UserScript==
// @name         Twitter/X Video Downloader (Premium)
// @name:ja      Twitter/X 動画 ダウンローダー (Premium)
// @name:zh-CN   Twitter/X 视频下载器 (Premium)
// @namespace    https://twisaver.net/
// @version      1.0
// @description  Add a Download button under Twitter/X videos that opens Twisaver with the tweet URL.
// @description:ja  ワンクリックでTwitter/Xの動画やGIFを保存します。Twisaverで高速・高画質にダウンロード。
// @description:zh-CN  在 Twitter/X 视频下方添加下载按钮，点击直接跳转 Twisaver 进行下载。
// @author       Twisaver
// @license      MIT
// @match        *://twitter.com/*
// @match        *://x.com/*
// @icon         https://twisaver.net/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562537/TwitterX%20Video%20Downloader%20%28Premium%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562537/TwitterX%20Video%20Downloader%20%28Premium%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID = 'twisaver-userscript-style';
  const BUTTON_CLASS = 'twisaver-download-btn';
  const ICON_CLASS = 'twisaver-download-icon';
  const TOOLTIP_CLASS = 'twisaver-download-tooltip';
  const UTM_QUERY = '&utm_source=userscript&utm_medium=twitter_button&utm_campaign=extension';
  const SCAN_DEBOUNCE_MS = 300;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${BUTTON_CLASS} {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 32px;
        padding: 0 12px;
        border-radius: 9999px;
        color: rgb(83, 100, 113);
        font-size: 13px;
        line-height: 16px;
        cursor: pointer;
        user-select: none;
        position: relative;
        z-index: 3;
        transition: background-color 120ms ease, color 120ms ease;
      }
      .${BUTTON_CLASS}:hover {
        background-color: rgba(29, 155, 240, 0.12);
        color: rgb(29, 155, 240);
      }
      .${ICON_CLASS} {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        flex: 0 0 auto;
      }
      .${TOOLTIP_CLASS} {
        position: absolute;
        left: 50%;
        top: calc(100% + 6px);
        transform: translateX(-50%);
        white-space: nowrap;
        background: rgba(29, 155, 240, 0.16);
        color: rgb(29, 155, 240);
        border: 1px solid rgba(29, 155, 240, 0.35);
        padding: 6px 10px;
        border-radius: 10px;
        font-size: 12px;
        line-height: 14px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 120ms ease, transform 120ms ease;
        z-index: 9999;
      }
      .${BUTTON_CLASS}:hover .${TOOLTIP_CLASS} {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(2px);
      }
    `;
    document.head.appendChild(style);
  }

  function getTweetUrl(article) {
    // 只抓取包含 /status/ 的推文链接
    const anchor = article.querySelector('a[href*="/status/"]');
    if (!anchor) return null;

    const href = anchor.getAttribute('href');
    if (!href) return null;

    return href.startsWith('http') ? href : `${location.origin}${href}`;
  }

  function isVideoTweet(article) {
    // 仅对包含 video 标签的推文加按钮
    return Boolean(article.querySelector('video'));
  }

  function buildTargetUrl(tweetUrl) {
    const encoded = encodeURIComponent(tweetUrl);
    return `https://twisaver.net/?url=${encoded}${UTM_QUERY}`;
  }

  function onActivate(article) {
    const tweetUrl = getTweetUrl(article) || location.href;
    const targetUrl = buildTargetUrl(tweetUrl);
    window.open(targetUrl, '_blank', 'noopener');
  }

  function createButton(article) {
    const button = document.createElement('div');
    button.className = BUTTON_CLASS;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Download');

    const icon = document.createElement('img');
    icon.className = ICON_CLASS;
    const fallbackIcon =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="%23536' +
      '471" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3v12"/><path ' +
      'd="M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>';
    // 优先使用 favicon，加载失败时回退到内联 SVG
    icon.src = 'https://twisaver.net/favicon.ico';
    icon.addEventListener(
      'error',
      () => {
        icon.src = fallbackIcon;
      },
      { once: true }
    );
    icon.alt = '';

    const label = document.createElement('span');
    label.textContent = 'Download';

    const tooltip = document.createElement('span');
    tooltip.className = TOOLTIP_CLASS;
    tooltip.textContent = 'Download via Twisaver.net (Fast & Free)';

    button.appendChild(icon);
    button.appendChild(label);
    button.appendChild(tooltip);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      onActivate(article);
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate(article);
      }
    });

    return button;
  }

  function insertButton(article) {
    const actionGroup = article.querySelector('div[role="group"]');
    if (!actionGroup) return;
    if (actionGroup.querySelector(`.${BUTTON_CLASS}`)) return;

    // 让父容器可溢出显示，避免气泡被裁剪
    article.style.overflow = 'visible';
    actionGroup.style.overflow = 'visible';
    actionGroup.style.position = 'relative';

    const button = createButton(article);
    actionGroup.appendChild(button);
  }

  function scanTweets() {
    ensureStyle();

    const articles = document.querySelectorAll('article');
    for (const article of articles) {
      if (!isVideoTweet(article)) continue;
      insertButton(article);
    }
  }

  let scanTimer = 0;
  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = window.setTimeout(() => {
      scanTimer = 0;
      scanTweets();
    }, SCAN_DEBOUNCE_MS);
  }

  const observer = new MutationObserver(() => {
    // SPA + 无限滚动：使用防抖避免高频触发
    scheduleScan();
  });

  function start() {
    scanTweets();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
