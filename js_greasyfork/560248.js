// ==UserScript==
// @name         JPDB Review - Per-Sentence Toggle (JP + EN), No Movement (Aligned)
// @license      MIT
// @namespace    https://jpdb.io/
// @version      4.2.3
// @description  One toggle per sentence block to show/hide both Japanese and English; toggles are always below; text is hidden via visibility (no layout shift); example toggles align to text column; pitch accent untouched. Includes pre-hide CSS at document-start to prevent flash. Front card stays hidden without a main toggle.
// @match        https://jpdb.io/review*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560248/JPDB%20Review%20-%20Per-Sentence%20Toggle%20%28JP%20%2B%20EN%29%2C%20No%20Movement%20%28Aligned%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560248/JPDB%20Review%20-%20Per-Sentence%20Toggle%20%28JP%20%2B%20EN%29%2C%20No%20Movement%20%28Aligned%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_REVEALED = false;
  const HIDE_MEANINGS = true;

  // New: Front card remains hidden without a main toggle button
  const NO_MAIN_TOGGLE_ON_FRONT = true;

  const SEL = {
    cardRoot: ".review-hidden, .review-reveal",
    cardSentenceRow: ".card-sentence",
    sentenceJP: ".card-sentence .sentence",
    sentenceEN: ".sentence-translation",

    termAnchor: ".answer-box > .plain > a.plain[href*=\"/vocabulary/\"]",
    termDivDirect: ".answer-box > .plain > div:not([style]):not(:empty)",

    exampleBlock: ".used-in",
    exampleJP: ".jp",
    exampleEN: ".en",
  };

  const ATTR = {
    // We store either "front" or "reveal" to allow safe re-processing if the same root node changes role.
    mainProcessed: "data-jpdb-quiz-main-processed",
    exProcessed: "data-jpdb-quiz-ex-processed",
  };

  const CLS = {
    wrap: "jpdb-quiz-toggle-wrap",
    wrapMain: "jpdb-quiz-toggle-wrap--main",
    wrapEx: "jpdb-quiz-toggle-wrap--example",
    btn: "jpdb-quiz-toggle-btn",

    hiddenMainJP: "jpdb-quiz-main-jp-hidden",
    visHidden: "jpdb-quiz-vis-hidden",
  };

  function addStyle(cssText) {
    const style = document.createElement("style");
    style.textContent = cssText;
    // document-start safe: head might not exist yet
    (document.head || document.documentElement).appendChild(style);
  }

  addStyle(`
    ${HIDE_MEANINGS ? ".subsection-meanings { display: none !important; }" : ""}

    /* ============================================================
       PREHIDE (prevents flash before script marks nodes processed)
       NOTE: Uses presence check for mainProcessed (not value check).
       ============================================================ */

    /* Hide the term (front/back) until the cardRoot is processed */
    .review-hidden:not([${ATTR.mainProcessed}]) .answer-box > .plain > a.plain[href*="/vocabulary/"],
    .review-reveal:not([${ATTR.mainProcessed}]) .answer-box > .plain > a.plain[href*="/vocabulary/"],
    .review-hidden:not([${ATTR.mainProcessed}]) .answer-box > .plain > div:not([style]):not(:empty),
    .review-reveal:not([${ATTR.mainProcessed}]) .answer-box > .plain > div:not([style]):not(:empty) {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* Hide main JP sentence text until processed (but keep icons clickable) */
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence {
      visibility: hidden !important;
    }

    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence a,
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence a * ,
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence button,
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence button * ,
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence svg,
    .review-hidden:not([${ATTR.mainProcessed}]) .card-sentence .sentence i,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence a,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence a * ,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence button,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence button * ,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence svg,
    .review-reveal:not([${ATTR.mainProcessed}]) .card-sentence .sentence i {
      visibility: visible !important;
      pointer-events: auto !important;
    }

    /* Hide EN translation until processed (only exists on reveal side) */
    .review-reveal:not([${ATTR.mainProcessed}]) .sentence-translation {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* Hide examples until each .used-in block is processed */
    .used-in:not([${ATTR.exProcessed}="1"]) .jp,
    .used-in:not([${ATTR.exProcessed}="1"]) .en {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* ============================================================
       Existing styling and behavior
       ============================================================ */

    /* Keep layout, hide content */
    .${CLS.visHidden} {
      visibility: hidden !important;
      pointer-events: none !important;
    }

    /* Main JP sentence: hide JP text but keep icons usable */
    .${CLS.hiddenMainJP} { visibility: hidden !important; }
    .${CLS.hiddenMainJP} a,
    .${CLS.hiddenMainJP} a * ,
    .${CLS.hiddenMainJP} button,
    .${CLS.hiddenMainJP} button * ,
    .${CLS.hiddenMainJP} svg,
    .${CLS.hiddenMainJP} i {
      visibility: visible !important;
      pointer-events: auto !important;
    }

    /* Toggle wrapper */
    .${CLS.wrap} {
      width: 100% !important;
      display: flex !important;
      box-sizing: border-box !important;
    }

    /* Main toggle: centered */
    .${CLS.wrap}.${CLS.wrapMain} {
      justify-content: center !important;
      margin: 10px 0 12px 0 !important;
    }

    /* Example toggle: aligned to sentence text column (JS sets padding-left) */
    .${CLS.wrap}.${CLS.wrapEx} {
      justify-content: flex-start !important;
      margin: 6px 0 10px 0 !important;
    }

    .${CLS.btn} {
      padding: 6px 12px;
      font-size: 12px;
      border: 1px solid rgba(255,255,255,0.35);
      background: rgba(0,0,0,0.70);
      color: inherit;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      line-height: 1.2;
      white-space: nowrap;
    }

    .${CLS.btn}.on {
      border-color: rgba(120, 220, 120, 0.85);
    }
  `);

  function isElement(node) {
    return node && node.nodeType === 1;
  }

  function makeWrap(kindClass) {
    const wrap = document.createElement("div");
    wrap.className = `${CLS.wrap} ${kindClass}`;
    return wrap;
  }

  function makeButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = CLS.btn;
    return btn;
  }

  function setButtonState(btn, revealed) {
    btn.textContent = revealed ? "Hide JP + EN" : "Show JP + EN";
    btn.classList.toggle("on", revealed);
  }

  function setVisibleKeepsSpace(el, visible) {
    if (!isElement(el)) return;

    // Clear any leftover inline display:none from older scripts
    if (el.style && el.style.display === "none") el.style.display = "";

    el.classList.toggle(CLS.visHidden, !visible);
  }

  function setMainJapaneseVisible(sentenceEl, visible) {
    if (!isElement(sentenceEl)) return;
    sentenceEl.classList.toggle(CLS.hiddenMainJP, !visible);
  }

  function setTermVisible(termEl, visible) {
    if (!isElement(termEl)) return;
    termEl.classList.toggle(CLS.visHidden, !visible);
  }

  function cleanupOldInjectedUI() {
    document.querySelectorAll(".jpdb-ps-toggle-wrap, .jpdb-ps-toggle-btn").forEach((n) => n.remove());
    document.querySelectorAll(".jpdb-st-toggle-wrap, .jpdb-st-toggle-btn").forEach((n) => n.remove());
    document.documentElement.classList.remove("jpdb-st-hidden");

    document.querySelectorAll(".jpdb-audio-quiz-en-toggle").forEach((b) => b.remove());
    document.querySelectorAll(".jpdb-audio-quiz-en-wrap").forEach((wrap) => {
      const parent = wrap.parentNode;
      if (!parent) return;
      while (wrap.firstChild) parent.insertBefore(wrap.firstChild, wrap);
      wrap.remove();
    });

    document.querySelectorAll(`${SEL.sentenceEN}, ${SEL.exampleJP}, ${SEL.exampleEN}`).forEach((el) => {
      if (el && el.style && el.style.display === "none") el.style.display = "";
    });
  }

  function findTermElement(cardRoot) {
    if (!isElement(cardRoot)) return null;
    return (
      cardRoot.querySelector(SEL.termAnchor) ||
      cardRoot.querySelector(SEL.termDivDirect) ||
      null
    );
  }

  // Updated: front stays hidden without main toggle; reveal side keeps normal toggle.
  // Also: mainProcessed stores "front" or "reveal", and PREHIDE CSS only checks for presence.
  function processMainCard(cardRoot) {
    if (!isElement(cardRoot)) return;

    const isFront = cardRoot.classList.contains("review-hidden");
    const mode = isFront ? "front" : "reveal";

    if (cardRoot.getAttribute(ATTR.mainProcessed) === mode) return;

    const row = cardRoot.querySelector(SEL.cardSentenceRow);
    const sentenceJP = cardRoot.querySelector(SEL.sentenceJP);
    if (!isElement(row) || !isElement(sentenceJP)) return;

    const sentenceEN = cardRoot.querySelector(SEL.sentenceEN);
    const termEl = findTermElement(cardRoot);

    if (NO_MAIN_TOGGLE_ON_FRONT && isFront) {
      // Remove any previously injected main toggle (in case DOM is reused)
      cardRoot.querySelectorAll(`.${CLS.wrap}.${CLS.wrapMain}`).forEach((n) => n.remove());

      // Force hidden state, but keep layout stable
      const revealed = false;
      if (termEl) setTermVisible(termEl, revealed);
      setMainJapaneseVisible(sentenceJP, revealed);
      if (sentenceEN) setVisibleKeepsSpace(sentenceEN, revealed);

      // Mark processed to disable PREHIDE rules; our classes keep it hidden.
      cardRoot.setAttribute(ATTR.mainProcessed, mode);
      return;
    }

    // Reveal side: normal toggle injection
    const columnWrap = row.parentElement;
    if (!isElement(columnWrap)) return;

    // Remove any existing main toggle before reinjecting (safe on re-process)
    columnWrap.querySelectorAll(`.${CLS.wrap}.${CLS.wrapMain}`).forEach((n) => n.remove());

    const wrap = makeWrap(CLS.wrapMain);
    const btn = makeButton();
    let revealed = DEFAULT_REVEALED;

    function apply() {
      if (termEl) setTermVisible(termEl, revealed);
      setMainJapaneseVisible(sentenceJP, revealed);
      if (sentenceEN) setVisibleKeepsSpace(sentenceEN, revealed);
      setButtonState(btn, revealed);
    }

    btn.addEventListener("click", () => {
      revealed = !revealed;
      apply();
    });

    wrap.appendChild(btn);
    columnWrap.appendChild(wrap);

    // Apply first while PREHIDE is still active, then mark processed.
    apply();
    cardRoot.setAttribute(ATTR.mainProcessed, mode);
  }

  function alignExampleToggleToText(exampleEl, wrap, jpEl, enEl) {
    // Choose whichever text line exists (JP preferred), and match its left offset.
    const ref = isElement(jpEl) ? jpEl : (isElement(enEl) ? enEl : null);
    if (!ref) return;

    // Both elements keep layout (even when hidden via visibility), so rects remain valid.
    const exRect = exampleEl.getBoundingClientRect();
    const refRect = ref.getBoundingClientRect();

    const offset = Math.max(0, Math.round(refRect.left - exRect.left));
    wrap.style.paddingLeft = offset ? `${offset}px` : "";
  }

  function processExampleBlock(exampleEl) {
    if (!isElement(exampleEl)) return;
    if (exampleEl.getAttribute(ATTR.exProcessed) === "1") return;

    const jpEl = exampleEl.querySelector(SEL.exampleJP);
    const enEl = exampleEl.querySelector(SEL.exampleEN);
    if (!isElement(jpEl) && !isElement(enEl)) return;

    const wrap = makeWrap(CLS.wrapEx);
    const btn = makeButton();
    let revealed = DEFAULT_REVEALED;

    function apply() {
      if (isElement(jpEl)) setVisibleKeepsSpace(jpEl, revealed);
      if (isElement(enEl)) setVisibleKeepsSpace(enEl, revealed);
      setButtonState(btn, revealed);

      // Recompute alignment after state changes (safe and cheap)
      alignExampleToggleToText(exampleEl, wrap, jpEl, enEl);
    }

    btn.addEventListener("click", () => {
      revealed = !revealed;
      apply();
    });

    wrap.appendChild(btn);

    // Always below JP + EN
    exampleEl.appendChild(wrap);

    // Initial alignment needs one frame to ensure layout is stable
    requestAnimationFrame(() => {
      alignExampleToggleToText(exampleEl, wrap, jpEl, enEl);
    });

    // Apply first while PREHIDE is still active, then mark processed.
    apply();
    exampleEl.setAttribute(ATTR.exProcessed, "1");
  }

  let scheduled = false;

  function scan() {
    scheduled = false;
    cleanupOldInjectedUI();

    document.querySelectorAll(SEL.cardRoot).forEach(processMainCard);
    document.querySelectorAll(SEL.exampleBlock).forEach(processExampleBlock);
  }

  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(scan);
  }

  // Boot: run once (even if the DOM is not ready, this is harmless),
  // and rely on MutationObserver for content that loads later.
  scan();

  new MutationObserver(scheduleScan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();