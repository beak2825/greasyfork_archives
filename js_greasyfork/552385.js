// ==UserScript==
// @name         Disable Atlassian Emoji Autocomplete (":" typeahead)
// @version      1.0.2
// @namespace    http://wimgodden.be/
// @license      MIT
// @description  Stop Jira/Confluence from opening the emoji picker when typing ":" while still allowing ":" to be typed.
// @author       Wim Godden <wim@wimgodden.be>
// @match        https://*.atlassian.net/*
// @match        https://*jira*/*
// @match        https://*confluence*/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/552385/Disable%20Atlassian%20Emoji%20Autocomplete%20%28%22%3A%22%20typeahead%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552385/Disable%20Atlassian%20Emoji%20Autocomplete%20%28%22%3A%22%20typeahead%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // Only act for editable fields (inputs, textareas, contenteditable)
  function isEditable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    if (!tag) return false;
    if (tag === "TEXTAREA") return true;
    if (tag === "INPUT") {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      return (
        type === "text" ||
        type === "search" ||
        type === "email" ||
        type === "url" ||
        type === "tel" ||
        type === "password"
      );
    }
    return false;
  }

  // Core handler: stop Atlaskit’s typeahead from seeing the ":" trigger
  function installCaptureGuards(win, doc) {
    if (!win || !doc || win.__akEmojiBlockInstalled__) return;
    win.__akEmojiBlockInstalled__ = true;

    const guard = (e) => {
      const t = e.target;
      if (!isEditable(t)) return;

      // Handle keyboard events
      if (e.type === "keydown" || e.type === "keypress" || e.type === "keyup") {
        // Use key first; fall back to code+shift in case key is localized
        const isSpecialChar =
          e.key === ":" || (e.code === "Semicolon" && e.shiftKey === true);

        if (isColon) {
          // Don’t preventDefault => ":" still types
          // Do stop propagation so Atlaskit never sees the trigger
          if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
          e.stopPropagation();
        }
      }

      // Modern editors may listen on beforeinput/input to trigger typeaheads
      if (e.type === "beforeinput") {
        const data = e.data || "";
        if (e.inputType === "insertText" && data === ":") {
          if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
          e.stopPropagation();
          // no preventDefault(): keep the character insertion
        }
      }

      if (e.type === "input") {
        // Some implementations key off recent ":" in input events.
        // We can safely stop propagation here too if the last inserted data was likely ":".
        // Heuristic: when value changed by exactly one char and last char is ":".
        // This is conservative and won’t block normal input logic.
        try {
          const val =
            t.isContentEditable ? t.textContent || "" : (t.value || "");
          if (val && val.slice(-1) === ":") {
            if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
            e.stopPropagation();
          }
        } catch (_) {}
      }
    };

    // Capture-phase listeners as early as possible
    const opts = { capture: true, passive: false };
    ["keydown", "keypress", "keyup", "beforeinput", "input"].forEach((type) => {
      win.addEventListener(type, guard, opts);
      doc.addEventListener(type, guard, opts);
    });

    // As a belt-and-braces fallback, hide any emoji/typeahead popover if it still appears.
    if (typeof GM_addStyle === "function") {
      GM_addStyle(`
        /* Common Atlaskit typeahead/emoji popovers */
        [data-testid*="typeahead" i],
        [data-testid*="emoji" i],
        .ak-typeahead,
        .ak-emoji-typeahead,
        [role="dialog"][aria-label*="emoji" i],
        [role="listbox"][id*="typeahead" i] {
          display: none !important;
          visibility: hidden !important;
        }
      `);
    }
  }

  // Install for the main page
  installCaptureGuards(window, document);

  // Also install for same-origin iframes (Jira/Confluence occasionally render editors in iframes)
  const hookIframes = () => {
    document.querySelectorAll("iframe").forEach((f) => {
      try {
        const w = f.contentWindow;
        const d = f.contentDocument;
        if (w && d) installCaptureGuards(w, d);
      } catch {
        // cross-origin; ignore
      }
    });
  };

  // Observe added iframes/editors dynamically
  const mo = new MutationObserver(hookIframes);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Run once after load as well, just in case
  window.addEventListener("load", hookIframes, { once: true });
})();
