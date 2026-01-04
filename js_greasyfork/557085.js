// ==UserScript==
// @name         右键和复制
// @version      1.0
// @description  Try to re-enable text selection, copy, context menu on sites that disable them. Does not bypass paywalls/DRM.
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/210455
// @downloadURL https://update.greasyfork.org/scripts/557085/%E5%8F%B3%E9%94%AE%E5%92%8C%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/557085/%E5%8F%B3%E9%94%AE%E5%92%8C%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1) Inject CSS to force selectable text
  const css = `
    * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      -webkit-touch-callout: default !important; /* iOS Safari */
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  // append as early as possible
  const addStyle = () => {
    try { document.documentElement.appendChild(style); }
    catch (e) {
      // if document not ready, try later
      document.addEventListener('DOMContentLoaded', () => {
        try { document.documentElement.appendChild(style); } catch(_) {}
      }, { once: true });
    }
  };
  addStyle();

  // 2) Capture-phase handlers to block site handlers for these event types.
  // We stop immediate propagation so site handlers (which often call preventDefault)
  // don't run; we don't call preventDefault ourselves so the browser default copy/menu can work.
  const protectedEvents = ['copy', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'mouseup', 'pointerdown'];
  const captureHandler = (e) => {
    try {
      // Allow some special cases: if the event is triggered by extension/tooling we might skip.
      // But in general, stop immediate propagation to prevent site script interference.
      e.stopImmediatePropagation();
      // do not call preventDefault() here — we want browser default behaviors to remain possible.
    } catch (err) {
      // swallow
    }
  };

  const addCaptureHandlers = (root = document) => {
    protectedEvents.forEach(ev => {
      root.addEventListener(ev, captureHandler, { capture: true, passive: false });
    });
  };

  // Add as early as possible
  if (document && document.documentElement) addCaptureHandlers(document);

  // Also monkeypatch addEventListener to prevent site scripts from registering certain handlers that block copy/select.
  // This is conservative: we only intercept attempts to add handlers of blocked event types on window/document/Element.prototype.
  (function patchAddEventListener() {
    const blocked = new Set(['copy','cut','contextmenu','selectstart']);
    const protoList = [Window.prototype, Document.prototype, Element.prototype];
    protoList.forEach(proto => {
      const orig = proto.addEventListener;
      if (!orig || orig.__patched_by_enable_select) return;
      const newAdd = function (type, listener, options) {
        try {
          if (blocked.has(type)) {
            // Instead of completely dropping, wrap the listener so it won't run (no-op),
            // preventing site code from interfering later. Safer than throwing away user intent.
            return orig.call(this, type, function noopWrapper(evt) {
              // Do nothing, because we already blocked propagation in capture phase.
            }, options);
          }
        } catch (e) {}
        return orig.call(this, type, listener, options);
      };
      newAdd.__patched_by_enable_select = true;
      proto.addEventListener = newAdd;
    });
  })();

  // 3) Clean inline handlers and style attributes for elements currently in DOM
  const cleanElement = (el) => {
    try {
      // remove inline handlers commonly used to block selection
      ['oncopy','oncut','oncontextmenu','onselectstart','onmousedown','onmouseup','onpointerdown'].forEach(name => {
        if (el[name]) {
          try { el[name] = null; } catch(e) {}
        }
      });

      // enforce style
      if (el.style) {
        try {
          el.style.userSelect = 'text';
          el.style.webkitUserSelect = 'text';
          el.style.MozUserSelect = 'text';
          el.style.msUserSelect = 'text';
        } catch(e) {}
      }

      // remove "unselectable" attribute used by some sites
      if (el.hasAttribute && (el.hasAttribute('unselectable') || el.getAttribute('unselectable') === 'on')) {
        try { el.removeAttribute('unselectable'); } catch(e) {}
      }
    } catch (err) { /* ignore */ }
  };

  const cleanAll = (root = document) => {
    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
      let n = walker.currentNode;
      while (n) {
        cleanElement(n);
        n = walker.nextNode();
      }
    } catch (e) {}
  };

  // run when DOM is ready
  const onReady = () => {
    try {
      cleanAll(document);
      addCaptureHandlers(document);
    } catch (e) {}
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  // 4) Observe mutations (dynamic content)
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.type === 'childList') {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            cleanElement(node);
            // also clean subtree
            try {
              node.querySelectorAll && node.querySelectorAll('*').forEach(cleanElement);
            } catch (e) {}
          }
        });
      } else if (m.type === 'attributes' && m.target) {
        cleanElement(m.target);
      }
    });
  });
  try {
    mo.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['oncopy','oncontextmenu','unselectable','style'] });
  } catch (e) {
    // if observe failed early, try again after ready
    document.addEventListener('DOMContentLoaded', () => {
      try { mo.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['oncopy','oncontextmenu','unselectable','style'] }); } catch(_) {}
    }, { once: true });
  }

  // Optional: expose a quick toggle in console for debugging
  window.__enableSelect_debug = {
    cleanAll: () => { try { cleanAll(document); console.info('enable-select: cleaned'); } catch(e){console.error(e);} },
    stop: () => {
      try {
        protectedEvents.forEach(ev => document.removeEventListener(ev, captureHandler, { capture: true }));
        mo.disconnect();
        console.info('enable-select: stopped');
      } catch (e) { console.error(e); }
    }
  };

  // Hint: If a page uses overlays that intercept clicks, you can open devtools and inspect the element under pointer,
  // then remove that overlay element manually (delete it in Elements panel) — this script will try to help but can't handle every weird custom anti-select scheme.
})();
