// ==UserScript==
// @name         Torn ID link replacer thing
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Replaces {###} with embedded link to the specified ID anywhere in Torn
// @author       Weav3r
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548310/Torn%20ID%20link%20replacer%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/548310/Torn%20ID%20link%20replacer%20thing.meta.js
// ==/UserScript==

(() => {
  const RE = /\{(\d+)\}$/;
  const ok = el => el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT");

  addEventListener("beforeinput", e => {
    if (e.data !== "}" || !ok(document.activeElement)) return;
    const el = document.activeElement;
    const val = el.value.slice(0, el.selectionStart) + "}";
    const m = val.match(RE);
    if (!m) return;
    e.preventDefault();
    el.setRangeText(`<a href="/profiles.php?XID=${m[1]}">${m[1]}</a>`,
                    el.selectionStart - m[0].length + 1,
                    el.selectionStart + 1,
                    "end");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, true);
})();