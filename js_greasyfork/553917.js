// ==UserScript==
// @name         Enable Text Select and Copy
// @namespace    RW5hYmxlIFRleHQgU2VsZWN0IGFuZCBDb3B5
// @version      1.3
// @description  Enables text selection and copying on websites that block it using CSS or JavaScript.
// @author       smed79
// @license      GPLv3
// @icon         https://i25.servimg.com/u/f25/11/94/21/24/select10.png
// @match        http://*/*
// @match        https://*/*
// @exclude      https://*.proton.me/*
// @exclude      https://*.github.com/*
// @exclude      https://github.com/*
// @exclude      https://www.yggtorrent.*/engine/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553917/Enable%20Text%20Select%20and%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/553917/Enable%20Text%20Select%20and%20Copy.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // CSS properties to enforce
  const props = [
    'user-select',
    '-webkit-user-select',
    '-moz-user-select',
    '-ms-user-select',
    '-khtml-user-select',
    '-o-user-select',
    '-webkit-touch-callout'
  ];

  // Inline event handlers to remove
  const eventsToRemove = [
    'onselectstart',
    'onmousedown',
    'oncontextmenu',
    'ondragstart'
  ];

  // Inject global CSS override but exclude form controls and editable areas
  const style = document.createElement('style');
  style.innerHTML = props.map(p =>
    `*:not(input):not(textarea):not(select):not(option):not(button):not([contenteditable="true"]) { ${p}: text !important; }`
  ).join('\n');
  document.head.appendChild(style);

  // Helper: check if element should be skipped
  const shouldSkip = el => {
    if (!el || !el.tagName) return false;
    const tag = el.tagName;
    if (['INPUT','TEXTAREA','SELECT','OPTION','BUTTON'].includes(tag)) return true;
    if (el.hasAttribute('contenteditable') && el.getAttribute('contenteditable') !== 'false') return true;
    if (el.getAttribute('role') === 'textbox' || el.getAttribute('role') === 'combobox') return true;
    if (el.hasAttribute('aria-haspopup') || el.hasAttribute('aria-expanded')) return true;
    return false;
  };

  // Apply fixes to elements
  const applyFixes = el => {
    if (shouldSkip(el)) return;

    props.forEach(prop => {
      el.style?.setProperty?.(prop, 'text', 'important');
    });
    eventsToRemove.forEach(evt => {
      if (el[evt]) {
        el[evt] = null;
        el.setAttribute(evt, '');
      }
    });
  };

  // Initial pass
  document.querySelectorAll('*').forEach(applyFixes);

  // Observe future DOM changes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          applyFixes(node);
          node.querySelectorAll?.('*')?.forEach?.(applyFixes);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Re-enable default behaviors via event listeners
  const allowEvent = e => e.stopPropagation();
  ['selectstart', 'mousedown', 'contextmenu', 'dragstart'].forEach(evt => {
    document.addEventListener(evt, allowEvent, true);
  });
})();
