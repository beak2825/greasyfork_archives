// ==UserScript==
// @name         Old School Replit
// @namespace    https://tommustbe12.dev/replit
// @version      1.0
// @description  Add option to create apps with normal code in Replit.
// @match        https://replit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563566/Old%20School%20Replit.user.js
// @updateURL https://update.greasyfork.org/scripts/563566/Old%20School%20Replit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function modifySidebar() {
    const createBtn = document.querySelector('[data-cy="sidebar-new-repl-btn"]');
    if (!createBtn || createBtn.dataset.tmModified) return;

    createBtn.dataset.tmModified = 'true';

    // Change text
    const textSpan = createBtn.querySelector(
      'span[class*="Text-module__zSV44a__text"]'
    );
    if (textSpan) textSpan.textContent = 'Create App with Agent';

    const li = createBtn.closest('li');
    if (!li) return;

    // Force vertical layout
    li.style.flexDirection = 'column';
    li.style.alignItems = 'stretch';
    li.style.gap = '6px';

    // Clone for Make App
    const makeAppBtn = createBtn.cloneNode(true);
    makeAppBtn.href = 'https://replit.com/developer-frameworks';
    makeAppBtn.rel = 'noopener noreferrer';
    makeAppBtn.removeAttribute('data-cy');

    const makeAppText = makeAppBtn.querySelector(
      'span[class*="Text-module__zSV44a__text"]'
    );
    if (makeAppText) makeAppText.textContent = 'Create App with Code';

    li.appendChild(makeAppBtn);
  }

  modifySidebar();

  const observer = new MutationObserver(modifySidebar);
  observer.observe(document.body, { childList: true, subtree: true });
})();
