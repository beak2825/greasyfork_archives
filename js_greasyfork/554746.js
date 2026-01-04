// ==UserScript==
// @name         Tailwind Docs Nav Switcher
// @version      1.3.1
// @namespace    tianyw0
// @description  使用左右箭头切换 Tailwind Docs 导航链接
// @author       tianyw0
// @match        https://tailwindcss.com/docs/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554746/Tailwind%20Docs%20Nav%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/554746/Tailwind%20Docs%20Nav%20Switcher.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const nav = document.querySelector('nav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="/docs/"]'));
  if (links.length === 0) return;

  function getCurrentIndex() {
    const current = location.href.split('#')[0];
    let idx = links.findIndex(a => a.href === current);
    if (idx === -1) idx = links.findIndex(a => current.startsWith(a.href));
    return idx >= 0 ? idx : 0;
  }

  let currentIndex = getCurrentIndex();

  nav.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const idx = links.indexOf(a);
    if (idx >= 0) currentIndex = idx;
  });

  function tryExpand() {
    const button = Array.from(document.querySelectorAll('button'))
      .find(b => /show more/i.test(b.textContent.trim()));
    if (button) button.click();
  }

  function updateClassCount() {
    const table = document.querySelector('table');
    if (!table) return;
    const rows = table.querySelectorAll('tr');
    const count = Math.max(0, rows.length - 1);
    const h1 = document.querySelector('h1');
    if (h1 && !/class/.test(h1.textContent)) {
      h1.textContent += `（class:${count}）`;
    }
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      currentIndex =
        e.key === 'ArrowLeft'
          ? (currentIndex - 1 + links.length) % links.length
          : (currentIndex + 1) % links.length;

      const target = links[currentIndex];
      if (!target) return;
      target.click();

      const observer = new MutationObserver(() => {
        tryExpand();
        updateClassCount();
      });
      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        tryExpand();
        updateClassCount();
        observer.disconnect();
      }, 800);
    }
  });
})();