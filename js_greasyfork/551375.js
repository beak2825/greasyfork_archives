// ==UserScript==
// @name         Kagi Assistant Ctrl + Enter to submit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes Enter key behavior in Kagi assistant to submit message only on Ctrl + Enter
// @author       nothingbird
// @match        https://kagi.com/assistant*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/551375/Kagi%20Assistant%20Ctrl%20%2B%20Enter%20to%20submit.user.js
// @updateURL https://update.greasyfork.org/scripts/551375/Kagi%20Assistant%20Ctrl%20%2B%20Enter%20to%20submit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }
    setTimeout(() => waitForElement(selector, callback), 100);
  }

  function modifyKeyBehavior(textarea) {
    textarea.removeEventListener('keydown', handleKeydown, true);

    textarea.addEventListener('keydown', handleKeydown, true);
  }

  function handleKeydown(event) {
    // Skip IME composition events
    if (event.isComposing || event.keyCode === 229) return;

    if (event.key === 'Enter') {
      // Ctrl+Enter (without other modifiers, Shift+Enter remains unchanged)
      if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        event.stopImmediatePropagation();

        const form = event.target.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
      // Regular Enter (without modifiers)
      else if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        // Allow default behavior (new line)
        event.stopImmediatePropagation();
      }
    }
  }

  waitForElement('textarea', modifyKeyBehavior);
})();