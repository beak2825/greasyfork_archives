// ==UserScript==
// @name         Script 3 – Empty widget congratulations
// @namespace    http://tampermonkey.net/
// @version      2.1 - 25-12-16
// @description  Replaces the "No items to display." empty-state text with a custom message + light green highlight for selected dashboard widgets
// @match        https://translations.myelan.net/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559059/Script%203%20%E2%80%93%20Empty%20widget%20congratulations.user.js
// @updateURL https://update.greasyfork.org/scripts/559059/Script%203%20%E2%80%93%20Empty%20widget%20congratulations.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================================================
     DEPLOYMENT CONFIG
     =========================================================
     - Add/remove widgets in WIDGETS below.
     - "title" must match the widget header text in XTRF.
     - "message" is what will replace the default empty-state text.
  */

  const CHECK_INTERVAL_MS = 700;

  /** Widgets to process (widget header -> replacement empty message) */
  const WIDGETS = [
    { title: "Requests pending", message: "No pending requests 🤖" },
    { title: "Projects due today", message: "Congrats, all done for today! 🎉" },
    { title: "Projects ready for finalization", message: "Good job, all done... For now! 🌱" },
    { title: "Projects still to be started", message: "You're on a rrrrrroll! 🐯" },
    { title: "Requested / Open", message: "It's empty in here... 🍃" },
  ];

  /* =========================================================
     HELPERS
     ========================================================= */

  function normalize(text) {
    return (text || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  /**
   * Find the dashboard widget "card" by its title.
   * Supports multiple common XTRF container classes.
   */
  function findWidgetCardByTitle(title) {
    const wanted = normalize(title);

    const cards = Array.from(document.querySelectorAll(
      ".x-card, .xlt-card, .xdb-dashboard__widget, .card, .panel"
    ));

    for (const card of cards) {
      const heading =
        card.querySelector(".x-card__header__heading, .xlt-card__header__heading, h1, h2, h3, h4") ||
        card.querySelector(".x-card__header, .xlt-card__header, .card-header");

      if (!heading) continue;

      const txt = normalize(heading.textContent);
      if (txt === wanted || txt.includes(wanted)) return card;
    }

    return null;
  }

  /**
   * Apply a light green "success" style to the empty-state cell/element.
   * Prefer styling the parent <td> when available.
   */
  function applyGreenStyle(targetEl) {
    if (!targetEl) return;

    const td = targetEl.closest ? targetEl.closest("td") : null;
    const el = td || targetEl;

    el.style.setProperty("background", "rgba(46, 204, 113, 0.12)", "important");
    el.style.setProperty("color", "#1b6b3a", "important");
    el.style.setProperty("font-weight", "650", "important");
    el.style.setProperty("text-align", "center", "important");
    el.style.setProperty("padding", "22px 12px", "important");
    el.style.setProperty("border-radius", "12px", "important");
  }

  /**
   * Replace the default empty-state message within a given root (widget DOM or iframe DOM).
   * We search broadly because XTRF sometimes wraps the message in spans/divs.
   *
   * Returns true if an empty-state message was found (and styled).
   */
  function replaceNoItemsMessage(root, newText) {
    if (!root) return false;

    const candidates = Array.from(root.querySelectorAll("td, div, span, p"));
    let changed = false;

    for (const el of candidates) {
      const t = normalize(el.textContent);
      if (!t) continue;

      if (t.includes("no items to display")) {
        // Avoid rewriting repeatedly if XTRF re-renders
        if (normalize(el.textContent) !== normalize(newText)) {
          el.textContent = newText;
        }

        applyGreenStyle(el);
        changed = true;
      }
    }

    return changed;
  }

  /**
   * Process a single widget:
   * 1) Try to replace the empty-state message directly in the widget card.
   * 2) If not found, try inside the widget's iframe (Smart View pattern).
   */
  function processWidget(widget) {
    const card = findWidgetCardByTitle(widget.title);
    if (!card) return;

    // Case 1: table/message is directly inside the widget card
    if (replaceNoItemsMessage(card, widget.message)) return;

    // Case 2: Smart View content is inside an iframe
    const iframe = card.querySelector("iframe");
    if (!iframe) return;

    let iframeDoc = null;
    try {
      iframeDoc = iframe.contentDocument || iframe.contentWindow?.document || null;
    } catch {
      // If the iframe is cross-origin, we cannot access it (unlikely in this setup)
      return;
    }

    if (!iframeDoc || !iframeDoc.body) return;

    replaceNoItemsMessage(iframeDoc, widget.message);
  }

  /* =========================================================
     RUN LOOP (XTRF re-renders often, so we keep it resilient)
     ========================================================= */

  function run() {
    for (const w of WIDGETS) processWidget(w);
  }

  run();
  setInterval(run, CHECK_INTERVAL_MS);

  // Extra resilience: handle DOM changes triggered by XTRF (Angular/JSF re-render)
  try {
    const obs = new MutationObserver(() => run());
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  } catch {
    // Ignore observer failures
  }
})();
