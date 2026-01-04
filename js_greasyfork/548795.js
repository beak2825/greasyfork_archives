// ==UserScript==
// @name         Satori → In-page cleaner (Migaku-friendly)
// @namespace    sr-migaku-inplace
// @version      1.0
// @description  Capture Satori article at document-start, sanitize to plain <h1>/<p>, replace in-page before extensions parse; optional toggle to view original.
// @author       Matskye
// @icon https://www.google.com/s2/favicons?sz=64&domain=satorireader.com
// @match        https://satorireader.com/*
// @match        https://www.satorireader.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548795/Satori%20%E2%86%92%20In-page%20cleaner%20%28Migaku-friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548795/Satori%20%E2%86%92%20In-page%20cleaner%20%28Migaku-friendly%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- helpers ----------
  const ZW = /[\u200B-\u200D\u2060\uFEFF]/g;
  const stripZW = (s) => (s || '').replace(ZW, '');
  const qs = (r, s) => r.querySelector(s);
  const qsa = (r, s) => Array.prototype.slice.call(r.querySelectorAll(s));

  function cleanArticleNode(articleEl) {
    // deep clone to avoid touching original
    const doc = articleEl.ownerDocument;
    const clone = articleEl.cloneNode(true);

    // remove UI/extra controls that are not text
    qsa(clone, [
      '.play-button-container',
      '.notes-button-container',
      '.tooltip',
      '.article-standard-preloads',
      'button','nav','header','footer','aside','svg','script','style'
    ].join(',')).forEach(n => n.remove());

    // drop furigana/readings
    qsa(clone, '.wpr, rt, rp, .fg').forEach(n => n.remove());

    // replace word packs with their surface form (.wpt)
    qsa(clone, '.wp').forEach(wp => {
      const wpt = qs(wp, '.wpt');
      const span = doc.createElement('span');
      span.textContent = wpt ? wpt.textContent : wp.textContent;
      wp.replaceWith(span);
    });

    // normalize Satori “space” nodes and any leftover ruby
    qsa(clone, '.space').forEach(s => s.replaceWith(doc.createTextNode(' ')));
    qsa(clone, 'ruby').forEach(r => {
      const span = doc.createElement('span');
      span.textContent = r.textContent;
      r.replaceWith(span);
    });

    return clone;
  }

  function extractTitleBodyFromClean(cleanRoot) {
    const headlineNode = cleanRoot.querySelector('.paragraph.headline');
    let title = '';
    if (headlineNode) {
      title = stripZW(headlineNode.textContent).replace(/\s+/g, ' ').trim();
      headlineNode.remove();
    }
    // gather paragraphs in reading order
    const paras = [];
    qsa(cleanRoot, '.paragraph.body, .paragraph').forEach(p => {
      const t = stripZW(p.textContent)
        .replace(/\u00A0/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\n\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
      if (t) paras.push(t);
    });
    // fallback if markup differs
    if (paras.length === 0) {
      const t = stripZW(cleanRoot.textContent || '')
        .replace(/\u00A0/g, ' ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      if (t) return { title, paras: t.split(/\n{2,}/).map(s => s.trim()).filter(Boolean) };
    }
    return { title, paras };
  }

  function buildCleanArticleDOM(doc, originalArticle, { title, paras }) {
    const clean = doc.createElement('span');
    clean.className = originalArticle.className;
    clean.id = originalArticle.id || '';
    clean.setAttribute('lang', 'ja');
    clean.setAttribute('data-migaku-clean', '1'); // mark for our own sanity

    // Headline
    if (title) {
      const head = doc.createElement('span');
      head.className = 'paragraph headline';
      const s = doc.createElement('span');
      s.className = 'sentence';
      s.textContent = title;
      head.appendChild(s);
      clean.appendChild(head);
    }

    // Body paragraphs
    for (const para of paras) {
      const p = doc.createElement('p');
      p.className = 'paragraph body';
      p.textContent = para;
      clean.appendChild(p);
    }

    return clean;
  }

  function addToggleUI(originalParent, placeholder, originalArticle, cleanArticle) {
    if (!document.body) return;
    if (document.getElementById('sr-inplace-toggle')) return;

    const box = document.createElement('div');
    box.id = 'sr-inplace-toggle';
    box.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:2147483647;' +
      'background:#fff;border:1px solid #ddd;border-radius:10px;' +
      'box-shadow:0 6px 18px rgba(0,0,0,.15);padding:8px 10px;font:13px system-ui;color:#111';
    const btn = document.createElement('button');
    btn.textContent = 'Show original article';
    btn.style.cssText = 'all:unset;cursor:pointer;color:#0b57d0;font-weight:600';
    let showingOriginal = false;
    btn.addEventListener('click', () => {
      showingOriginal = !showingOriginal;
      if (showingOriginal) {
        // swap clean → original
        if (cleanArticle.isConnected) originalParent.replaceChild(originalArticle, cleanArticle);
        btn.textContent = 'Show cleaned article';
      } else {
        if (originalArticle.isConnected) originalParent.replaceChild(cleanArticle, originalArticle);
        btn.textContent = 'Show original article';
      }
    });
    box.appendChild(btn);
    document.body.appendChild(box);
  }

  // ---------- capture early, clean, replace ----------
  let captured = false;

  const mo = new MutationObserver((muts) => {
    if (captured) return;
    for (const m of muts) {
      if (m.type !== 'childList') continue;
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        const article = node.matches?.('.article') ? node : node.querySelector?.('.article');
        if (!article) continue;

        captured = true;

        // 1) Clean on a clone
        const cleanedClone = cleanArticleNode(article);
        const { title, paras } = extractTitleBodyFromClean(cleanedClone);

        // 2) Build flat, Migaku-friendly article
        const cleanDom = buildCleanArticleDOM(document, article, { title, paras });

        // 3) Replace in page BEFORE other extensions parse
        const parent = article.parentNode;
        const placeholder = document.createComment('sr-inplace-cleaner');
        parent.replaceChild(cleanDom, article); // put cleaned in DOM immediately

        // Keep the original in memory in case you want to toggle it back
        // (don’t leave it in DOM so nothing else touches it)
        addToggleUI(parent, placeholder, article, cleanDom);

        // We’re done; stop observing to save cycles
        mo.disconnect();
        return;
      }
    }
  });

  mo.observe(document.documentElement, { subtree: true, childList: true });
})();
