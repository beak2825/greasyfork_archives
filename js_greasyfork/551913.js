// ==UserScript==
// @name         WhatsApp Privacy
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Blur messages, chats, names, pics and etc.. until you hover your mouse over it!
// @match        https://web.whatsapp.com/*
// @author       emree.el
// @license     MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551913/WhatsApp%20Privacy.user.js
// @updateURL https://update.greasyfork.org/scripts/551913/WhatsApp%20Privacy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
    /* core blur class applied by script */
    .wh-wv-blur {
      filter: blur(12px) !important;
      transition: filter 0.25s ease-in-out !important;
      -webkit-backface-visibility: hidden !important;
      backface-visibility: hidden !important;
    }
    .wh-wv-blur:hover { filter: blur(0px) !important; }

    /* keep previous broad rules too */
    span[title], ._21S-L, ._3OvU8, .copyable-text, header span, header div[title], header ._21nHd {
      filter: blur(6px) !important;
      transition: filter 0.2s ease-in-out !important;
    }
    span[title]:hover, ._21S-L:hover, ._3OvU8:hover, .copyable-text:hover, header span:hover, header div[title]:hover, header ._21nHd:hover {
      filter: blur(0px) !important;
    }

    /* images/videos/canvas baseline (covers typical img/video elements) */
    img, video, canvas {
      filter: blur(10px) !important;
      transition: filter 0.25s ease-in-out !important;
    }
    img:hover, video:hover, canvas:hover { filter: blur(0px) !important; }
  `);

  const ATTR = 'data-wh-wv-processed';

  function mark(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.hasAttribute(ATTR)) return;
    el.setAttribute(ATTR, '1');
    el.classList.add('wh-wv-blur');
  }

  function findThumbnailContainer(el) {
    // climb up ancestors (max 7) and pick first with img/video/canvas or a background-image
    let node = el;
    for (let i = 0; i < 7 && node.parentElement; i++) {
      node = node.parentElement;
      try {
        if (node.querySelector && node.querySelector('img, video, canvas')) return node;
        const bg = window.getComputedStyle(node).getPropertyValue('background-image');
        if (bg && bg !== 'none' && bg !== 'initial' && bg !== 'unset') return node;
        if (node.getAttribute && node.getAttribute('role') === 'img') return node;
      } catch (e) { /* ignore cross-doc errors */ }
    }
    // fallback: nearest div that is not massive (avoid blurring full page)
    let fallback = el.closest('div');
    if (fallback) {
      const r = fallback.getBoundingClientRect();
      if (r.width > 30 && r.width < window.innerWidth * 0.9) return fallback;
    }
    return null;
  }

  function processPlayIcons(root=document) {
    root.querySelectorAll && root.querySelectorAll('span[data-icon="media-play"]').forEach(icon => {
      const container = findThumbnailContainer(icon) || icon.parentElement || icon;
      if (container) mark(container);
    });
  }

  function processBackgroundDivs(root=document) {
    // cautious scan for divs with background-image (limit by size to avoid main bg)
    root.querySelectorAll && root.querySelectorAll('div').forEach(d => {
      if (d.hasAttribute && d.hasAttribute(ATTR)) return;
      try {
        const bg = window.getComputedStyle(d).getPropertyValue('background-image');
        if (bg && bg !== 'none' && bg !== 'initial' && bg !== 'unset') {
          const r = d.getBoundingClientRect();
          if (r.width > 30 && r.width < window.innerWidth * 0.9) mark(d);
        }
      } catch (e) {}
    });
  }

  function processImgsVideos(root=document) {
    root.querySelectorAll && root.querySelectorAll('img, video, canvas').forEach(el => mark(el));
  }

  // initial runs
  setTimeout(() => { processPlayIcons(); processBackgroundDivs(); processImgsVideos(); }, 800);
  setTimeout(() => { processPlayIcons(); processBackgroundDivs(); processImgsVideos(); }, 1800);

  // observe dynamic changes
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // direct matches
          if (node.matches && node.matches('span[data-icon="media-play"]')) {
            const c = findThumbnailContainer(node) || node.parentElement || node;
            mark(c);
          }
          if (node.matches && node.matches('img,video,canvas')) mark(node);
          // search inside added subtree
          processPlayIcons(node);
          processBackgroundDivs(node);
          processImgsVideos(node);
        });
      }
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });

})();
