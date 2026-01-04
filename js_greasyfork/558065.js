// ==UserScript==
// @name         RipperStore Forums Gifts/Downloads Highlighter
// @namespace    http://forum.ripper.store/
// @version      1.0
// @description  Highlights popular posts (over 1K+ views) and full sets of outfits to better filter out slop
// @author       indistinctive
// @match        https://forum.ripper.store/category/44/gifts-downloads*
// @icon         https://www.google.com/s2/favicons?domain=forum.ripper.store
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/558065/RipperStore%20Forums%20GiftsDownloads%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/558065/RipperStore%20Forums%20GiftsDownloads%20Highlighter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `.copilot-highlight{background:#a2e436!important;}`; // CHANGE COLOR HERE
  document.head.appendChild(style);

  function findTitleNode(el) {
    let selectors = [
      '.topic-title',
      '[itemprop="name"]',
      'h2',
      'a'
    ];
    for (let sel of selectors) {
      let node = el.querySelector(sel);
      if (node && node.textContent.trim()) return node;
    }
    let candidates = Array.from(el.querySelectorAll('a, h2, span')).filter(n => n.textContent.trim().length > 7);
    if (candidates.length) return candidates[0];
    return null;
  }

  function highlight() {
    const items = document.querySelectorAll('[class*="topic-item"], [class*="category-topic-item"], li, tr');
    items.forEach(el => {
      let titleNode = findTitleNode(el);
      if (!titleNode) return;
      const title = titleNode.textContent.trim();
      if (/only/i.test(title)) {
        el.classList.remove('copilot-highlight');
        return;
      }
      let match = /\d\.?\d*k\b/i.test(title)
                 || /Avatars/i.test(title)
                 || /アバター/.test(title)
                 || (/full/i.test(title) && /set/i.test(title));
      if (match) {
        el.classList.add('copilot-highlight');
      } else {
        el.classList.remove('copilot-highlight');
      }
    });
  }

  highlight();

  const target = document.querySelector('.category-topic-list') || document.body;
  new MutationObserver(() => { highlight(); }).observe(target, { childList:true, subtree:true });

  let lastUrl = location.href;
  setInterval(() => {
    if(location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(highlight, 500);
    }
  }, 1000);
})();