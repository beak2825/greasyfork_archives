// ==UserScript==
// @name         DBLP: Open Menu1 First Item Button
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  在 nav.publ > ul 插入按钮，点击即在新窗口打开“菜单1的第一项”（通常为 electronic edition via DOI）。
// @match        https://dblp.uni-trier.de/*
// @match        https://dblp.dagstuhl.de/*
// @match        https://dblp.org/*
// @icon         https://dblp.org/img/favicon.ico
// @grant        GM_openInTab
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562638/DBLP%3A%20Open%20Menu1%20First%20Item%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/562638/DBLP%3A%20Open%20Menu1%20First%20Item%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ICON_URL = 'https://dblp.uni-trier.de/img/download.dark.16x16.png';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function openInNew(url) {
    if (!url) return;
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, { active: true, insert: true, setParent: true });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function buildBtnLi(onClick) {
    const li = document.createElement('li');
    li.className = 'drop-down tm-open-ee';

    const head = document.createElement('div');
    head.className = 'head';

    const a = document.createElement('a');
    a.href = 'javascript:void(0)';
    a.title = 'electronic edition via DOI';
    a.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); onClick(); });

    const img = document.createElement('img');
    img.src = ICON_URL;
    img.className = 'icon';
    img.alt = 'Open';

    a.appendChild(img);
    head.appendChild(a);
    li.appendChild(head);
    return li;
  }

  // 在同一 entry 内查找“菜单1的第一项”链接（不依赖 nth-child，避免插入按钮改变序号）
  function findMenu1FirstLink(entryLi) {
    // 常规：菜单1（view）的 body 里第一项通常是 li.ee
    const ee = $('nav.publ ul li.drop-down .body ul li.ee a[href]', entryLi);
    if (ee) return ee.href;

    // 兜底：菜单1的 head 链接（通常也是 DOI 图标）
    const headA = $('nav.publ > ul > li.drop-down:first-of-type .head a[href]', entryLi);
    return headA ? headA.href : null;
  }

  function enhanceEntry(entryLi) {
    if (!entryLi || entryLi.dataset.tmMenu1Btn === '1') return;

    const ul = $('nav.publ > ul', entryLi);
    if (!ul) return;

    entryLi.dataset.tmMenu1Btn = '1';

    const liBtn = buildBtnLi(() => {
      const href = findMenu1FirstLink(entryLi);
      if (href) openInNew(href);
      else alert('未找到“菜单1的第一项”链接（electronic edition via DOI）');
    });

    // 插到 publ > ul 的最前面
    ul.insertBefore(liBtn, ul.firstElementChild || null);
  }

  function enhanceAll(root = document) {
    $$('.publ-list li.entry', root).forEach(enhanceEntry);
  }

  // 初次执行
  enhanceAll();

  // 监听动态加载（分页/无限加载场景）
  const mo = new MutationObserver((muts) => {
    for (const mut of muts) {
      mut.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches?.('.publ-list li.entry')) {
          enhanceEntry(node);
        } else {
          node.querySelectorAll?.('.publ-list li.entry')?.forEach(enhanceEntry);
        }
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
