// ==UserScript==
// @name        Manwa disable alert
// @namespace   https://viayoo.com/agtv4q
// @version     1.2
// @description 漫蛙(Manwa)去除恼人的弹窗和解除一些限制。
// @author      Aloazny
// @match       *://*.man-wa.wang/*
// @match       *://*.manwa.me/*
// @match       *://*.manwa.site/*
// @match       *://*.manwa.vip/*
// @match       *://*.manwa.xyz/*
// @match       *://*.manwadb*.xyz/*
// @match       *://*.manwafei*.*/*
// @match       *://*.manwaq*.vip/*
// @match       *://*.manwaqq*.vip/*
// @match       *://*.mw2.cn/*
// @match       *://*.mwai.*/*
// @match       *://*.mwai.cc/*
// @match       *://*.mwcomic*.*/*
// @match       *://*.mwcomic.*/*
// @match       *://manwa*.*/*
// @match       *://manwa*.com.cn/*
// @match       *://manwa.*/*
// @match       *://manwa.me/*
// @match       *://manwafe*.*/*
// @match       *://manwafe.*/*
// @match       *://manwafe.cc/*
// @match       *://manwafl.cc/*
// @match       *://manwajs.vip/*
// @match       *://manwawa*.cc/*
// @run-at      document-start
// @license      MIT
// @icon        data:image/jpeg;base64,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
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/559785/Manwa%20disable%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/559785/Manwa%20disable%20alert.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.$UCADBlock = undefined;

  const originalSetInterval = window.setInterval;
  window.setInterval = function(callback, delay) {
    const s = callback.toString();
    if (s.includes('.ad-area') || s.includes('ad_area_count')) {
      return 123456789;
    }
    return originalSetInterval.call(window, callback, delay);
  };

  const ensureAdAreaExists = () => {
    if (!document.querySelector('.ad-area')) {
      const div = document.createElement('div');
      div.className = 'ad-area';
      div.style.cssText = 'display:block;position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(div);
    }
  };

  document.oncontextmenu = null;
  document.onselectstart = null;
  document.oncopy = null;
  document.oncut = null;
  document.onpaste = null;
  if (document.body) {
    document.body.oncontextmenu = null;
    document.body.onselectstart = null;
    document.body.oncopy = null;
  }

  const unblockImages = () => {
    Array.from(document.images).forEach(img => {
      img.onmousedown = null;
      img.oncontextmenu = null;
      img.ondragstart = null;
    });
  };

  const hideAds = () => {
    [
      '.header-background + style + .index-banner:not([id]):not([style]) > div[class^="swiper"]',
      '[class^="ad-top"]',
      'script[src$="/ad-provider.js"] + ins',
      '.ad-area-close',
      '.fas.fa-times',
      '[data-group^="ad_chapter_top"]',
      'input[src*="/ads/"]'
    ].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  const blockAdScripts = (node) => {
    if (node.tagName !== 'SCRIPT') return;
    const src = node.getAttribute('src') || '';
    if (src.includes('/ad-provider.js') || src.includes('/lv/esnk/') || src.includes('pemsrv.com')) {
      node.remove();
    }
  };

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === 'SCRIPT') blockAdScripts(node);
          node.querySelectorAll('script').forEach(blockAdScripts);
        }
      }
    }
    ensureAdAreaExists();
    unblockImages();
    hideAds();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.querySelectorAll('script').forEach(blockAdScripts);
  ensureAdAreaExists();
  unblockImages();
  hideAds();

  window.addEventListener('DOMContentLoaded', () => {
    ensureAdAreaExists();
    unblockImages();
    hideAds();
    setTimeout(hideAds, 400);
  });

})();