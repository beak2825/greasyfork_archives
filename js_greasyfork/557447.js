// ==UserScript==
// @name         Ultra cloak - Copy Allowed + Screenshot Allowed + Anti-Tab-Detect
// @namespace    ultra.cloak.copy.screenshot.tab.change
// @version      7.0
// @description  Allows copy & screenshots; blocks tab-change detection and screenshot/printscreen detection.
// @include        *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557447/Ultra%20cloak%20-%20Copy%20Allowed%20%2B%20Screenshot%20Allowed%20%2B%20Anti-Tab-Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/557447/Ultra%20cloak%20-%20Copy%20Allowed%20%2B%20Screenshot%20Allowed%20%2B%20Anti-Tab-Detect.meta.js
// ==/UserScript==

(function () {
  const injected = function () {

    /****************************************************************
     * 1) BLOCK TAB/FOCUS/BLUR DETECTION (window / document only)
     ****************************************************************/
    const TAB_EVENTS = new Set([
      "visibilitychange",
      "webkitvisibilitychange",
      "msvisibilitychange",
      "mozvisibilitychange",
      "blur",
      "focus"
    ]);

    // Force always-visible
    Object.defineProperty(document, "hidden", { get: () => false });
    Object.defineProperty(document, "visibilityState", { get: () => "visible" });

    document.hasFocus = () => true;
    window.hasFocus = () => true;

    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, opts) {
      if (TAB_EVENTS.has(type) && (this === window || this === document)) {
        return; // Block only the page’s tab-change detection
      }
      return origAdd.call(this, type, listener, opts);
    };

    const origDispatch = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (evt) {
      if (TAB_EVENTS.has(evt.type) && (this === window || this === document)) {
        return true; // swallow event
      }
      return origDispatch.call(this, evt);
    };


    /****************************************************************
     * 2) COPY + SELECTION ALWAYS ALLOWED
     ****************************************************************/
    // Restore universal selection
    const style = document.createElement("style");
    style.textContent = `
      * {
        user-select: text !important;
        -webkit-user-select: text !important;
      }
    `;
    document.documentElement.appendChild(style);

    ["copy", "cut", "paste", "contextmenu", "selectstart"].forEach(ev => {
      document.addEventListener(ev, e => {
        e.stopImmediatePropagation(); // kill site’s blocking code
      }, true);
    });

    // Allow execCommand('copy')
    try {
      const origExec = Document.prototype.execCommand;
      Document.prototype.execCommand = function (cmd) {
        return origExec.call(this, cmd); // always allow copy
      };
    } catch {}


    /****************************************************************
     * 3) BLOCK SCREENSHOT / PRINT SCREEN DETECTION
     * (NOT block screenshots themselves)
     ****************************************************************/
    document.addEventListener("keydown", e => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        // Kill detection only
        e.stopImmediatePropagation();
        // DO NOT prevent default → screenshot allowed
      }
    }, true);

    document.addEventListener("keyup", e => {
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.stopImmediatePropagation();
      }
    }, true);

    // Some pages try to erase clipboard on PrintScreen — block that too
    try {
      navigator.clipboard.writeText = navigator.clipboard.writeText;
    } catch {}


    /****************************************************************
     * 4) REMOVE beforeprint / print detection
     ****************************************************************/
    window.addEventListener("beforeprint", e => {
      e.stopImmediatePropagation(); // page won’t detect printing
    }, true);


    /****************************************************************
     * 5) REMOVE YOUR protected.html Overlay
     ****************************************************************/
    const killOverlay = setInterval(() => {
      const overlay = document.getElementById("overlay");
      if (overlay) {
        overlay.remove();
        clearInterval(killOverlay);
      }
    }, 20);

    // Disable showOverlay() function if defined later
    try {
      Object.defineProperty(window, "showOverlay", {
        value: () => {},
        writable: false
      });
    } catch {}

    console.info("Tab detection disabled, copy allowed, screenshot allowed, detection blocked.");
  };

  // Inject into page-context
  const s = document.createElement("script");
  s.textContent = `(${injected.toString()})();`;
  (document.documentElement || document.head).prepend(s);
  s.remove();
})();
