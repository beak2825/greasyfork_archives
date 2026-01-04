// ==UserScript==
// @name         Jollytext
// @namespace    yuniDev
// @version      1.1
// @description  Jolly greentext
// @author       yuniDev
// @match        https://www.destiny.gg/embed/chat*
// @match        https://www.destiny.gg/chat*
// @match        https://www.destiny.gg/bigscreen*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557698/Jollytext.user.js
// @updateURL https://update.greasyfork.org/scripts/557698/Jollytext.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function processTextNodes(container, wordIndex = { value: 0 }) {
    const children = Array.from(container.childNodes);

    for (const node of children) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const parts = text.split(/(\s+)/);

        if (parts.length === 0) continue;

        const fragment = document.createDocumentFragment();

        for (const part of parts) {
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const shouldWrap = wordIndex.value % 2 !== 0;
            if (shouldWrap) {
              const span = document.createElement('span');
              span.style.color = '#f43a38';
              span.textContent = part;
              fragment.appendChild(span);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
            wordIndex.value++;
          }
        }

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName !== 'SPAN') {
          processTextNodes(node, wordIndex);
        }
      }
    }
  }

  function mutationCallback(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const addedNode of mutation.addedNodes) {
          const greentextSpan = addedNode.querySelector('.greentext');
          if (!greentextSpan) continue;

          const wordIndex = { value: 0 };
          processTextNodes(greentextSpan, wordIndex);
        }
      }
    }
  }

  const targetElement = document
    .getElementById('chat-win-main')
    ?.querySelector('.chat-lines');
  if (targetElement) {
    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetElement, { childList: true });
  }
})();