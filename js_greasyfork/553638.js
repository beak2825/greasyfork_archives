// ==UserScript==
// @name         WP Remove Articles Containing
// @version      1.1
// @description  Detects .mh-loop-excerpt elements containing "巻s" and removes the entire .mh-loop-item article
// @match        *://x3dl.net/*
// @run-at       document-idle
// @grant        none
// @namespace https://example.com/
// @downloadURL https://update.greasyfork.org/scripts/553638/WP%20Remove%20Articles%20Containing.user.js
// @updateURL https://update.greasyfork.org/scripts/553638/WP%20Remove%20Articles%20Containing.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const KEY_RE = /巻s/i; 

  function processArticle(article) {
    if (!article || article.dataset._processed === '1') return;
    const excerpt = article.querySelector('.mh-loop-excerpt');
    const text = (excerpt ? excerpt.textContent : article.textContent || '').trim();
    if (!text) {
      article.dataset._processed = '1';
      return;
    }

    if (KEY_RE.test(text)) {
      const placeholder = document.createElement('article');
      placeholder.className = 'mh-loop-item mh-deleted-placeholder';
      placeholder.style.padding = '1rem';
      placeholder.style.border = '1px dashed #ccc';
      placeholder.style.borderRadius = '7px';
      placeholder.style.background = 'rgba(0,0,0,0.02)';
      placeholder.textContent = 'An article has been deleted.';
      article.replaceWith(placeholder);
    } else {
      article.dataset._processed = '1';
    }
  }

  function scanAll(root = document) {
    const items = root.querySelectorAll('article.mh-loop-item');
    items.forEach(processArticle);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches && node.matches('article.mh-loop-item')) {
          processArticle(node);
        } else {
          const inner = node.querySelectorAll?.('article.mh-loop-item');
          if (inner && inner.length) inner.forEach(processArticle);
        }
      });

      if (mutation.target instanceof HTMLElement && mutation.target.classList?.contains('mh-loop-excerpt')) {
        const article = mutation.target.closest('article.mh-loop-item');
        if (article) {
          article.dataset._processed = '';
          processArticle(article);
        }
      }
    }
  });

  scanAll();
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: false,
  });

  ['pushState', 'replaceState'].forEach((fn) => {
    const original = history[fn];
    history[fn] = function () {
      const result = original.apply(this, arguments);
      setTimeout(scanAll, 0);
      return result;
    };
  });
  window.addEventListener('popstate', () => setTimeout(scanAll, 0));
})();
