// ==UserScript==
// @name         XenForo Show Single Post
// @namespace    https://greasyfork.org/en/users/1552401-chipfin
// @version      1.3.4
// @description  Adds a toggle button to XenForo posts to isolate a single message. The button appears only when a specific post is targeted in the URL.
// @author       ChatGPT & Gemini
// @license      MIT
// @match        *://*/*threads/*
// @match        *://*/*t/*
// @match        *://*/*posts/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561431/XenForo%20Show%20Single%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/561431/XenForo%20Show%20Single%20Post.meta.js
// ==/UserScript==

/* HOTKEY:
  - ESC: Exit single post view and return to full thread.
*/

(function () {
  'use strict';

  const STYLE_ID = 'xfo-single-style';
  const BODY_CLASS = 'xfo-single';
  const TARGET_CLASS = 'xfo-target';

  // Helper: extract the targeted post ID from the URL hash or path
  function getPostId() {
    const hashMatch = location.hash.match(/#post-(\d+)/);
    if (hashMatch) return hashMatch[1];
    const pathMatch = location.pathname.match(/(?:post-|\/posts\/)(\d+)/);
    if (pathMatch) return pathMatch[1];
    return null;
  }

  // Helper: locate the message element based on ID with precise selectors
  function findArticleById(id) {
    if (!id) return null;
    const selectors = [
      `#post-${id}`,
      `#js-post-${id}`,
      `article[data-content="post-${id}"]`,
      `article.message[id*="${id}"]`
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      // Ensure we get the main message container, not an inner element
      if (el) return el.closest('article.message') || el;
    }
    return Array.from(document.querySelectorAll('article.message')).find(a =>
      a.dataset.content === `post-${id}` || a.id.includes(id)
    ) || null;
  }

  // Helper: inject CSS that hides only other posts, keeping target content visible
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      body.${BODY_CLASS} .p-body-sidebar,
      body.${BODY_CLASS} .p-breadcrumbs,
      body.${BODY_CLASS} .p-body-header,
      body.${BODY_CLASS} .block--quickreply,
      body.${BODY_CLASS} .pageNav,
      body.${BODY_CLASS} .block[data-widget-key*="similar_threads"] {
        display: none !important;
      }
      /* Hide all other posts that are not the target */
      body.${BODY_CLASS} article.message:not(.${TARGET_CLASS}) {
        display: none !important;
      }
    `;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Helper: smooth scroll to element
  function scrollToPost(el) {
    if (!el) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
  }

  // Main logic: create and attach the toggle button
  function addToggle(article, id) {
    if (!article || article.querySelector('.xfo-toggle-btn')) return;

    const btn = document.createElement('a');
    btn.href = '#post-' + id;
    btn.textContent = 'Show only this post';
    btn.className = 'xfo-toggle-btn';
    btn.style.cursor = 'pointer';
    btn.style.marginRight = '8px';

    btn.addEventListener('click', e => {
      e.preventDefault();
      ensureStyle();
      const isSingle = document.body.classList.toggle(BODY_CLASS);
      article.classList.toggle(TARGET_CLASS, isSingle);
      btn.textContent = isSingle ? 'Show full thread' : 'Show only this post';
      scrollToPost(article);
    });

    const opp = article.querySelector('.message-attribution-opposite');
    const li = document.createElement('li');
    li.appendChild(btn);
    if (opp) {
      opp.prepend(li);
    } else {
      const fallbackHeader = article.querySelector('header.message-attribution') || article;
      fallbackHeader.prepend(btn);
    }
  }

  // Initialization: verify targeting and start the article lookup wait loop
  function init() {
    const id = getPostId();
    if (!id) return;
    const start = Date.now();
    (function wait() {
      const art = findArticleById(id);
      if (art) {
        addToggle(art, id);
        return;
      }
      if (Date.now() - start > 5000) return;
      requestAnimationFrame(wait);
    })();
  }

  init();
  window.addEventListener('hashchange', init);
  window.addEventListener('popstate', init);

  // Observer for handling dynamically loaded content
  new MutationObserver(mutations => {
    if (mutations.some(m => m.addedNodes.length)) init();
  }).observe(document.body, { childList: true, subtree: true });

  // Keyboard support: Close single post view via ESC
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains(BODY_CLASS)) {
      const activeBtn = document.querySelector(`.${TARGET_CLASS} .xfo-toggle-btn`);
      if (activeBtn) activeBtn.click();
    }
  });

})();