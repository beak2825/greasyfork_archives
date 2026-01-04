// ==UserScript==
// @name         Digg Auto-Linker
// @namespace    Z4CK-tools
// @version      1.3
// @description  Automatically turns plain-text URLs in Digg posts and comments into clickable hyperlinks
// @author       Z4CK
// @match        https://*.digg.com/*
// @run-at       document-start
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/549891/Digg%20Auto-Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/549891/Digg%20Auto-Linker.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SKIP_SELECTOR = 'a, code, pre, script, style, textarea, head, title, noscript';
  const SKIP_TAGS = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'HEAD', 'TITLE', 'NOSCRIPT']);
  const URL_PATTERN = /\b((?:https?:\/\/|www\.)[^\s<>"'()]+)(?=$|[\s<>\p{P}])/gu;
  const TRAILING_PUNCTUATION = /[)\]}.,!?:;'"]+$/;

  // Batch to avoid dupes
  const queue = new Set();
  let flushing = false;

  function schedule(node) {
    if (!node) return;
    queue.add(node);
    if (!flushing) {
      flushing = true;
      requestAnimationFrame(flushQueue);
    }
  }

  function flushQueue() {
    for (const node of queue) {
      processNode(node);
    }
    queue.clear();
    flushing = false;
  }

  function processNode(node) {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (!parent) return;
      if (parent.closest(SKIP_SELECTOR)) return;
      linkifyTextNode(node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (SKIP_TAGS.has(node.tagName)) return;
      for (const child of node.childNodes) {
        processNode(child);
      }
    }
  }

  function linkifyTextNode(textNode) {
    const text = textNode.textContent;
    URL_PATTERN.lastIndex = 0;

    let match;
    let lastIndex = 0;
    let replaced = false;
    const fragment = document.createDocumentFragment();

    while ((match = URL_PATTERN.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (start > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      }

      let displayText = match[1];
      let trailing = '';
      const trailingMatch = displayText.match(TRAILING_PUNCTUATION);
      if (trailingMatch) {
        trailing = trailingMatch[0];
        displayText = displayText.slice(0, -trailing.length);
      }

      if (!displayText) {
        fragment.appendChild(document.createTextNode(match[0]));
        lastIndex = end;
        continue;
      }

      const link = document.createElement('a');
      link.href = displayText.startsWith('www.') ? `https://${displayText}` : displayText;
      link.textContent = displayText;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.color = 'inherit';
      link.style.textDecoration = 'underline';

      fragment.appendChild(link);
      if (trailing) fragment.appendChild(document.createTextNode(trailing));

      lastIndex = end;
      replaced = true;
    }

    if (!replaced) return;

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  // Track live edits
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        schedule(mutation.target);
      }
      for (const added of mutation.addedNodes) {
        if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
          schedule(added);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  schedule(document.documentElement);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => schedule(document.body), { once: true });
  } else {
    schedule(document.body);
  }

  window.addEventListener('beforeunload', () => observer.disconnect(), { once: true });
})();
