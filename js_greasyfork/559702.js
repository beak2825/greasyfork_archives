// ==UserScript==
// @name         Neopets NC Mall - Block Welcome Modal and Overlay (Proactive)
// @namespace    https://ncmall.neopets.com/
// @version      1.5
// @description  Prevents the "Get Started with the NC Mall" modal and its overlay from being created at all. No flicker, no interaction required.
// @author       luna
// @match        https://ncmall.neopets.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559702/Neopets%20NC%20Mall%20-%20Block%20Welcome%20Modal%20and%20Overlay%20%28Proactive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559702/Neopets%20NC%20Mall%20-%20Block%20Welcome%20Modal%20and%20Overlay%20%28Proactive%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Trap and block insertion of modal and overlay as early as possible
  const BLOCK_CLASS_KEYWORDS = [
    'modal',            // generic modal
    'ant-modal',        // Ant Design modal
    'modal-mask',       // modal overlay mask
    'vcDialogTitle1'    // known modal title ID
  ];

  const isBlockedElement = (node) => {
    if (!(node instanceof HTMLElement)) return false;

    // Check ID
    if (node.id === 'vcDialogTitle1') return true;

    // Check class names
    const classList = Array.from(node.classList);
    return classList.some(cls =>
      BLOCK_CLASS_KEYWORDS.some(keyword => cls.includes(keyword))
    );
  };

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        const element = node;
        if (isBlockedElement(element)) {
          console.log('[Tampermonkey] Blocking unwanted modal or overlay:', element);
          element.remove();
        }

        // Recursively check child elements in case modal content is nested
        const descendants = element.querySelectorAll?.('*') || [];
        for (const child of descendants) {
          if (isBlockedElement(child)) {
            console.log('[Tampermonkey] Blocking nested unwanted modal or overlay:', child);
            child.remove();
          }
        }
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });

  // Also restore scroll behavior in case they try to disable it
  const restoreScroll = () => {
    document.body.style.overflow = 'auto';
    document.body.classList.remove('ant-scrolling-effect');
  };

  const scrollFixInterval = setInterval(() => {
    restoreScroll();
  }, 200);

  // Stop restoring after 10 seconds to avoid waste
  setTimeout(() => clearInterval(scrollFixInterval), 10000);

  console.log('[Tampermonkey] Modal blocker initialized.');
})();
