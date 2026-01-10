// ==UserScript==
// @name         jpdb Review: hide JP text + per-sentence reveal (aligned, no-freeze)
// @namespace    https://jpdb.io/
// @version      1.0.2
// @description  Front: hide Japanese text (preserve layout, keep audio). Back: remove sections, force examples visible, hide each JP+EN pair, add aligned per-item show/hide buttons, prevent flash, avoid observer loops.
// @license MIT
// @match        https://jpdb.io/review*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562123/jpdb%20Review%3A%20hide%20JP%20text%20%2B%20per-sentence%20reveal%20%28aligned%2C%20no-freeze%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562123/jpdb%20Review%3A%20hide%20JP%20text%20%2B%20per-sentence%20reveal%20%28aligned%2C%20no-freeze%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * CSS at document-start to prevent any brief appearance (FOUC).
   * Important change versus prior version:
   * - Examples: hide .used-in .jp and .used-in .en (not the .used-in container),
   *   so we can place the toggle button inside .used-in and keep it aligned.
   */
  const CSS = `
/* ---------- Toggle button styling ---------- */
.jpdb-toggle-wrap{
  display:flex;
  width: 100%;
  margin: .35rem 0 .6rem 0;
}
.jpdb-toggle-wrap[data-jpdb-toggle-kind="top"]{
  justify-content: center;
}
.jpdb-toggle-wrap[data-jpdb-toggle-kind="example"]{
  justify-content: flex-start;
}

.jpdb-toggle-btn{
  font: inherit;
  padding: .25rem .7rem;
  border: 1px solid currentColor;
  background: transparent;
  border-radius: .45rem;
  cursor: pointer;
}

/* =============================================================================
   FRONT: Hide all Japanese text while preserving layout; keep audio visible.
   ========================================================================== */

/* Vocabulary spelling row (contains ruby) */
.review-hidden .answer-box .plain{
  visibility: hidden;
}
/* Re-show vocabulary audio */
.review-hidden .answer-box .plain a.icon-link,
.review-hidden .answer-box .plain a.icon-link *{
  visibility: visible !important;
}

/* Example sentence block */
.review-hidden .answer-box .sentence{
  visibility: hidden;
}
/* Re-show example audio */
.review-hidden .answer-box .sentence a.icon-link,
.review-hidden .answer-box .sentence a.icon-link *{
  visibility: visible !important;
}

/* =============================================================================
   BACK: Pre-hide sections to remove, then remove in JS.
   ========================================================================== */
.review-reveal .subsection-meanings,
.review-reveal .subsection-composed-of-kanji,
.review-reveal .subsection-pitch-accent,
.review-reveal .subsection-composed-of-vocabulary{
  display: none !important;
}

/* =============================================================================
   BACK: Remove examples toggle UI; force examples visible.
   ========================================================================== */
#show-checkbox-examples-label,
#show-checkbox-examples{
  display: none !important;
}
#show-checkbox-examples + .hidden-body{
  display: block !important;
}

/* =============================================================================
   BACK: Hide each sentence (JP + EN) via visibility; keep audio visible.
   ========================================================================== */

/* Top “main” vocabulary spelling */
.review-reveal .answer-box a.plain[href*="/vocabulary/"]{
  visibility: hidden;
}

/* Top main JP sentence: hide sentence container but keep its audio visible */
.review-reveal .answer-box .sentence{
  visibility: hidden;
}
.review-reveal .answer-box .sentence a.icon-link,
.review-reveal .answer-box .sentence a.icon-link *{
  visibility: visible !important;
}

/* Top main EN translation */
.review-reveal .answer-box .sentence-translation{
  visibility: hidden;
}

/* Examples list:
   - Hide JP and EN lines only (preserve layout).
   - Keep audio links visible (they are outside .used-in, but this is safe). */
.review-reveal .subsection-examples .used-in .jp,
.review-reveal .subsection-examples .used-in .en{
  visibility: hidden;
}
.review-reveal .subsection-examples a.icon-link,
.review-reveal .subsection-examples a.icon-link *{
  visibility: visible !important;
}
`;

  const styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.documentElement.appendChild(styleEl);

  function removeAll(root, selectors) {
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    });
  }

  function setVisibility(els, v) {
    els.filter(Boolean).forEach((el) => {
      el.style.visibility = v; // Inline override.
    });
  }

  function areAllHidden(els) {
    const list = els.filter(Boolean);
    if (!list.length) return true;
    return list.every((el) => getComputedStyle(el).visibility === "hidden");
  }

  function makeToggle(kind, getTargets, labelShow, labelHide) {
    const wrap = document.createElement("div");
    wrap.className = "jpdb-toggle-wrap";
    wrap.dataset.jpdbToggleKind = kind;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "jpdb-toggle-btn";

    function refreshLabel() {
      const targets = getTargets();
      btn.textContent = areAllHidden(targets) ? labelShow : labelHide;
    }

    btn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const targets = getTargets();
      if (areAllHidden(targets)) {
        setVisibility(targets, "visible");
      } else {
        setVisibility(targets, "hidden");
      }
      refreshLabel();
    });

    wrap.appendChild(btn);
    // Initial label
    refreshLabel();

    return wrap;
  }

  function processBackSide() {
    const reveal = document.querySelector(".review-reveal");
    if (!reveal) return;

    // 1) Remove requested sections completely.
    removeAll(reveal, [
      ".subsection-meanings",
      ".subsection-composed-of-kanji",      // Kanji used
      ".subsection-pitch-accent",
      ".subsection-composed-of-vocabulary"  // Composed of
    ]);

    // 2) Remove "Click to toggle examples..." UI and ensure examples are always present.
    const checkbox = reveal.querySelector("#show-checkbox-examples");
    if (checkbox) {
      const container = checkbox.parentElement;
      const hiddenBody = container ? container.querySelector(".hidden-body") : null;

      if (container && hiddenBody) {
        const frag = document.createDocumentFragment();
        while (hiddenBody.firstChild) frag.appendChild(hiddenBody.firstChild);

        container.insertAdjacentElement("afterend", document.createElement("div"));
        const insertionPoint = container.nextSibling;
        insertionPoint.replaceWith(frag);

        container.remove();
      } else {
        const label = reveal.querySelector("#show-checkbox-examples-label");
        if (label) label.remove();
        checkbox.remove();
      }
    } else {
      const label = reveal.querySelector("#show-checkbox-examples-label");
      if (label) label.remove();
    }

    // Remove any previous toggles (idempotent rebuild).
    reveal.querySelectorAll(".jpdb-toggle-wrap").forEach((el) => el.remove());

    // 3) Top main toggle (vocab + main JP sentence + EN translation).
    const answerBox = reveal.querySelector(".answer-box");
    if (answerBox) {
      const vocabEl = answerBox.querySelector('a.plain[href*="/vocabulary/"]');
      const jpSentenceEl = answerBox.querySelector(".sentence");
      const enTranslationEl = answerBox.querySelector(".sentence-translation");

      const topToggle = makeToggle(
        "top",
        () => [vocabEl, jpSentenceEl, enTranslationEl],
        "Show text",
        "Hide text"
      );

      // Place directly under the top block area.
      answerBox.insertAdjacentElement("afterend", topToggle);
    }

    // 4) Per-example toggles, inserted INSIDE .used-in to align under text.
    // Each row structure: <div style="display:flex ..."><a ...audio...></a><div class="used-in">...</div></div>
    reveal.querySelectorAll(".subsection-examples .subsection > div").forEach((row) => {
      const usedIn = row.querySelector(".used-in");
      if (!usedIn) return;

      const jp = usedIn.querySelector(".jp");
      const en = usedIn.querySelector(".en");

      const exampleToggle = makeToggle(
        "example",
        () => [jp, en],
        "Show sentence",
        "Hide sentence"
      );

      // Insert under the EN line (or under JP if EN is missing).
      usedIn.appendChild(exampleToggle);
    });
  }

  function applyAll() {
    processBackSide();
    // Front behavior is fully CSS-driven.
  }

  // Debounced observer that disconnects while applying to avoid self-trigger loops.
  let observer = null;
  let scheduled = 0;
  let applying = false;

  function safeApply() {
    if (applying) return;
    applying = true;

    if (observer) observer.disconnect();
    try {
      applyAll();
    } finally {
      applying = false;
      if (observer) observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = window.setTimeout(() => {
      scheduled = 0;
      safeApply();
    }, 0);
  }

  // Initial run
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => safeApply(), { once: true });
  } else {
    safeApply();
  }

  // React to in-page changes
  window.addEventListener("hashchange", scheduleApply, true);
  window.addEventListener("popstate", scheduleApply, true);

  observer = new MutationObserver(() => scheduleApply());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();