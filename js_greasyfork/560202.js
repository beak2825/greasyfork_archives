// ==UserScript==
// @name        Bypass Confirmations
// @description Bypass all confirmation dialogs
// @author      anhkhoakz
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0.0
// @license     AGPL-3.0; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @noframes
// @match       *://*/*
// @downloadURL https://update.greasyfork.org/scripts/560202/Bypass%20Confirmations.user.js
// @updateURL https://update.greasyfork.org/scripts/560202/Bypass%20Confirmations.meta.js
// ==/UserScript==
(() => {
  const DEBOUNCE_DELAY_MS = 50;
  const CONFIRM_ATTRIBUTES = [
    "data-action-confirm",
    "data-confirm",
    "data-method",
    "data-remote"
  ];
  const INLINE_HANDLERS = [
    "onclick",
    "onsubmit",
    "onchange",
    "onblur"
  ];
  const MUTATION_OBSERVER_ATTRIBUTE_FILTER = [
    "data-action-confirm",
    "data-confirm",
    "data-method",
    "onclick",
    "onsubmit"
  ];
  const overrideWindowConfirm = () => {
    const confirmOverride = () => true;
    Object.defineProperty(window, "confirm", {
      value: confirmOverride,
      writable: false,
      configurable: false
    });
    Object.defineProperty(Window.prototype, "confirm", {
      value: confirmOverride,
      writable: false,
      configurable: false
    });
  };
  const overrideReturnValueProperty = () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(BeforeUnloadEvent.prototype, "returnValue");
    if (!originalDescriptor) {
      return;
    }
    Object.defineProperty(BeforeUnloadEvent.prototype, "returnValue", {
      get: () => "",
      set: () => {},
      configurable: false
    });
  };
  const preventOnBeforeUnloadAssignment = () => {
    Object.defineProperty(window, "onbeforeunload", {
      get: () => null,
      set: () => {},
      configurable: false
    });
  };
  const preventBeforeUnloadConfirmations = () => {
    window.addEventListener("beforeunload", (e) => {
      e.stopImmediatePropagation();
      delete e.returnValue;
    }, { capture: true });
  };
  const interceptAddEventListener = () => {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === "beforeunload") {
        return;
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  };
  const removeConfirmDataAttributes = () => {
    for (const attr of CONFIRM_ATTRIBUTES) {
      const elements = document.querySelectorAll(`[${attr}]`);
      for (const el of elements) {
        el.removeAttribute(attr);
      }
    }
  };
  const removeInlineConfirmHandlers = () => {
    for (const handler of INLINE_HANDLERS) {
      const selector = `[${handler}*="confirm("]`;
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        el.removeAttribute(handler);
      }
    }
  };
  const removeWindowLevelConfirmHandlers = () => {
    const selector = '[onbeforeunload*="confirm("], [onunload*="confirm("]';
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      const htmlEl = el;
      if (htmlEl.onbeforeunload) {
        htmlEl.onbeforeunload = null;
      }
      if (htmlEl.onunload) {
        htmlEl.onunload = null;
      }
    }
  };
  const removeFormConfirmHandlers = () => {
    const forms = document.querySelectorAll("form");
    for (const form of forms) {
      const htmlForm = form;
      if (!htmlForm.onsubmit) {
        continue;
      }
      const handlerStr = String(htmlForm.onsubmit);
      if (handlerStr.includes("confirm(")) {
        htmlForm.onsubmit = null;
      }
    }
  };
  const removeAllConfirmations = () => {
    removeConfirmDataAttributes();
    removeInlineConfirmHandlers();
    removeWindowLevelConfirmHandlers();
    removeFormConfirmHandlers();
  };
  let debounceTimer = null;
  const debouncedRemove = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(removeAllConfirmations, DEBOUNCE_DELAY_MS);
  };
  const initializeMutationObserver = () => {
    const observer = new MutationObserver(debouncedRemove);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: MUTATION_OBSERVER_ATTRIBUTE_FILTER
    });
  };
  overrideWindowConfirm();
  overrideReturnValueProperty();
  preventOnBeforeUnloadAssignment();
  preventBeforeUnloadConfirmations();
  interceptAddEventListener();
  initializeMutationObserver();
})();
