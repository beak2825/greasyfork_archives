// ==UserScript==
// @name         YouTube HOME - Kill Shorts & Posts (dynamic, fast)
// @namespace    ?
// @license      CC-BY-4.0
// @version      3.0.0
// @description  Hide Shorts shelves + community/posts on YouTube Home. Robust for dynamic loading.
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560970/YouTube%20HOME%20-%20Kill%20Shorts%20%20Posts%20%28dynamic%2C%20fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560970/YouTube%20HOME%20-%20Kill%20Shorts%20%20Posts%20%28dynamic%2C%20fast%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** 你要“主页” */
  const isHome = () => location.pathname === '/';

  /** 文本关键词（你截图里是“短裤”） */
  const SHORTS_WORDS = [
    'shorts', 'short', '短裤', '短片', '短视频', '短影音',
    'ショート', 'ショート動画', 'ショーツ'
  ];

  /** 需要隐藏的帖子渲染器（社区/动态/快速发布） */
  const POST_RENDERERS = [
    'ytd-post-renderer',
    'ytd-backstage-post-thread-renderer',
    'ytm-post-renderer',
    'ytm-compact-post-renderer',
    'ytm-backstage-post-renderer',
    'ytm-community-post-renderer'
  ];

  /** 常见“整块区段”容器（隐藏它 = 标题+内容一起消失，不留空白） */
  const BLOCK_CONTAINERS = [
    'ytd-rich-section-renderer',
    'ytd-rich-shelf-renderer',
    'ytd-rich-item-renderer',
    'ytd-item-section-renderer',
    'ytm-rich-section-renderer',
    'ytm-item-section-renderer'
  ];

  /** 用 attribute 统一隐藏，避免反复写 inline style */
  const HIDE_ATTR = 'data-yt-hide-fast';

  const style = document.createElement('style');
  style.textContent = `
    [${HIDE_ATTR}="1"]{
      display:none !important;
      height:0 !important;
      overflow:hidden !important;
    }

    /* 先手：直接把常见 Shorts/Posts 渲染器本体隐藏（防闪现） */
    ytd-reel-shelf-renderer,
    ytd-shorts-shelf-renderer,
    ytd-reel-item-renderer,
    ${POST_RENDERERS.join(',')}
    { display:none !important; height:0 !important; overflow:hidden !important; }
  `;
  (document.documentElement || document).appendChild(style);

  const markHide = (el) => {
    if (!el || el.nodeType !== 1) return;
    if (el.getAttribute(HIDE_ATTR) === '1') return;
    el.setAttribute(HIDE_ATTR, '1');
  };

  /** 向上找“区块容器”，最多爬 12 层，保证快且终止 */
  const hideBlockFor = (node) => {
    let el = node;
    for (let i = 0; i < 12 && el; i++) {
      if (el.nodeType === 1) {
        for (const sel of BLOCK_CONTAINERS) {
          if (el.matches(sel)) {
            markHide(el);
            return;
          }
        }
      }
      el = el.parentElement;
    }
    // 找不到就隐藏自己
    markHide(node);
  };

  const textLooksLikeShorts = (t) => {
    if (!t) return false;
    const s = String(t).trim().toLowerCase();
    return SHORTS_WORDS.some(w => s.includes(w));
  };

  /** 判定一个“shelf/section”是不是 Shorts */
  const isShortsBlock = (blockEl) => {
    if (!blockEl || blockEl.nodeType !== 1) return false;

    // 规则1：里面有 /shorts/ 链接（最稳）
    if (blockEl.querySelector('a[href^="/shorts/"]')) return true;

    // 规则2：标题文字包含 Shorts/短裤 等
    const titleEl =
      blockEl.querySelector('#title yt-formatted-string') ||
      blockEl.querySelector('#title') ||
      blockEl.querySelector('h2 yt-formatted-string') ||
      blockEl.querySelector('h2') ||
      blockEl.querySelector('yt-formatted-string');

    const titleText = titleEl?.textContent || '';
    return textLooksLikeShorts(titleText);
  };

  /** 隐藏 Shorts 区块：遍历可能的区块容器（只在给定根节点子树内） */
  const killShortsIn = (root) => {
    if (!root?.querySelectorAll) return;

    // 1) 先处理最典型渲染器（命中直接隐藏其父区块）
    const direct = root.querySelectorAll('ytd-reel-shelf-renderer, ytd-shorts-shelf-renderer, ytd-reel-item-renderer');
    for (const el of direct) hideBlockFor(el);

    // 2) 再处理“区块容器”，靠标题/shorts链接判定（更抗 YouTube 改版）
    const blocks = root.querySelectorAll('ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytd-item-section-renderer');
    for (const b of blocks) {
      if (b.getAttribute(HIDE_ATTR) === '1') continue;
      if (isShortsBlock(b)) markHide(b);
    }

    // 3) 兜底：任何新增子树里出现 /shorts/ 卡片，就隐藏它所属区块
    const shortsAnchors = root.querySelectorAll('a[href^="/shorts/"]');
    for (const a of shortsAnchors) hideBlockFor(a);
  };

  /** 隐藏帖子/快速发布（社区） */
  const killPostsIn = (root) => {
    if (!root?.querySelectorAll) return;
    const posts = root.querySelectorAll(POST_RENDERERS.join(','));
    for (const p of posts) hideBlockFor(p);
  };

  /** 批处理：只处理新增节点，避免全局扫 */
  let active = false;
  let queued = false;
  const queue = [];

  const flush = () => {
    queued = false;
    if (!active) { queue.length = 0; return; }

    while (queue.length) {
      const n = queue.pop();
      // 只处理元素节点
      if (n && n.nodeType === 1) {
        killShortsIn(n);
        killPostsIn(n);
      }
    }
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    // rAF 足够快且稳定（比 setInterval 更省）
    requestAnimationFrame(flush);
  };

  let mo = null;
  const start = () => {
    if (mo) return;
    mo = new MutationObserver((ms) => {
      for (const m of ms) {
        if (!m.addedNodes || !m.addedNodes.length) continue;
        for (const n of m.addedNodes) {
          if (n && n.nodeType === 1) queue.push(n);
        }
      }
      if (queue.length) schedule();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // 首次进入主页，扫一遍 body（只做一次）
    queue.push(document.body || document.documentElement);
    schedule();
  };

  const stop = () => {
    if (!mo) return;
    mo.disconnect();
    mo = null;
    queue.length = 0;
    queued = false;
  };

  const onRoute = () => {
    const should = isHome();
    if (should === active) return;
    active = should;
    if (active) start();
    else stop();
  };

  // YouTube SPA 导航监听（多路兜底）
  document.addEventListener('yt-navigate-finish', onRoute, true);
  document.addEventListener('yt-page-data-updated', onRoute, true);

  const _push = history.pushState;
  history.pushState = function () { _push.apply(this, arguments); onRoute(); };
  const _rep = history.replaceState;
  history.replaceState = function () { _rep.apply(this, arguments); onRoute(); };
  window.addEventListener('popstate', onRoute);

  // 启动
  onRoute();
})();
