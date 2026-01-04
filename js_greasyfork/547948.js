// ==UserScript==
// @name         ChatGPT Sidebar GPTs — Fold/Unfold List
// @name:fr      ChatGPT Barre latérale — Plier/Déplier la liste des GPTs
// @namespace    https://omega.tools/userscripts
// @version      1.0.4
// @description  Fold ChatGPT custom GPTs list in the sidebar (show only 3 by default, add “See more (n)” button).
// @description:fr  Plie la liste des GPTs personnalisés de ChatGPT dans la barre latérale (affiche seulement 3 par défaut, ajoute un bouton « Voir plus (n) »).
// @author       Omega
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://www.chatgpt.com/*
// @match        https://openai.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547948/ChatGPT%20Sidebar%20GPTs%20%E2%80%94%20FoldUnfold%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/547948/ChatGPT%20Sidebar%20GPTs%20%E2%80%94%20FoldUnfold%20List.meta.js
// ==/UserScript==

/* eslint-env browser */
/* eslint-disable no-console */

(function () {
  "use strict";

  const MAX_VISIBLE = 3;
  const NS = "gpts-fold";
  const LOG_PREFIX = "[gpts-fold]";

  let mo = null;
  let observe = null;
  let observerPaused = false;
  let pauseTimerId = null;

  function log() {
    console.log.apply(console, [LOG_PREFIX].concat(Array.prototype.slice.call(arguments)));
  }
  function warn() {
    console.warn.apply(console, [LOG_PREFIX].concat(Array.prototype.slice.call(arguments)));
  }
  function error() {
    console.error.apply(console, [LOG_PREFIX].concat(Array.prototype.slice.call(arguments)));
  }

  function ensureStyle() {
    const id = NS + "-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      "." + NS + "-toggle{display:flex;align-items:center;gap:8px;width:100%;border:none;background:transparent;cursor:pointer;padding:8px 12px;border-radius:12px;font:inherit;text-align:left;}" +
      "." + NS + "-toggle:hover{background:rgba(127,127,127,.08);}" +
      "." + NS + "-toggle:focus{outline:2px solid rgba(127,127,127,.35);outline-offset:2px;}" +
      "." + NS + "-hidden-row{display:none!important;}" +
      "." + NS + "-chev{margin-left:auto;}";
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    if (el.offsetParent === null) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function normalizeText(s) {
    return String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  }

  function isHeadingLike(el) {
    if (!el || !isVisible(el)) return false;
    const tag = el.tagName;
    if (tag && /^H[1-6]$/.test(tag)) return true;
    if (el.getAttribute("role") === "heading") return true;
    const txt = normalizeText(el.textContent);
    if (txt.length >= 2 && txt.length <= 30) {
      try {
        const cs = window.getComputedStyle(el);
        const fw = parseInt(cs.fontWeight, 10);
        if (!Number.isNaN(fw) && fw >= 600) return true;
        if (cs.textTransform === "uppercase" && txt === txt.toUpperCase()) return true;
      } catch (e) { /* ignore */ }
    }
    return false;
  }

  function findGptHeader() {
    const candidates = document.querySelectorAll("h1,h2,h3,h4,div,span");
    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      if (!isVisible(el)) continue;
      const txt = normalizeText(el.textContent);
      if (txt === "GPT") return el;
    }
    return null;
  }

  function collectGptAnchors() {
    const header = findGptHeader();
    if (!header) return [];
    let root = header.closest("nav,aside");
    if (!root) root = header.parentElement || document.body;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    let inGpt = false;
    const anchors = [];

    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (el === header) {
        inGpt = true;
        continue;
      }
      if (!inGpt) continue;

      if (isHeadingLike(el)) {
        break;
      }
      if ((el.tagName === "A" || el.getAttribute("role") === "link") && isVisible(el)) {
        anchors.push(el);
      }
    }
    return anchors;
  }

  function anchorToRow(anchor) {
    return anchor.closest("li") || anchor;
  }

  function cleanup() {
    Array.prototype.forEach.call(document.querySelectorAll("." + NS + "-toggle"), function (btn) {
      if (btn.parentElement) btn.remove();
    });
    Array.prototype.forEach.call(document.querySelectorAll("." + NS + "-hidden-row"), function (row) {
      row.classList.remove(NS + "-hidden-row");
    });
  }

  function pauseObserver(ms) {
    if (!mo) return;
    observerPaused = true;
    if (pauseTimerId) window.clearTimeout(pauseTimerId);
    pauseTimerId = window.setTimeout(function () {
      observerPaused = false;
    }, ms || 400);
  }

  function insertToggle(afterNode, hiddenRows) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = NS + "-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.dataset.state = "collapsed";

    const label = document.createElement("span");
    const chev = document.createElement("span");
    chev.className = NS + "-chev";
    chev.textContent = "▾";

    function setCollapsedLabel() {
      label.textContent = "Voir plus (" + hiddenRows.length + ")";
      chev.textContent = "▾";
    }
    function setExpandedLabel() {
      label.textContent = "Voir moins";
      chev.textContent = "▴";
    }
    setCollapsedLabel();

    btn.appendChild(label);
    btn.appendChild(chev);

    btn.addEventListener("click", function () {
      pauseObserver(500);
      const expanded = btn.dataset.state === "expanded";
      if (expanded) {
        Array.prototype.forEach.call(hiddenRows, function (el) {
          el.classList.add(NS + "-hidden-row");
        });
        btn.dataset.state = "collapsed";
        btn.setAttribute("aria-expanded", "false");
        setCollapsedLabel();
      } else {
        Array.prototype.forEach.call(hiddenRows, function (el) {
          el.classList.remove(NS + "-hidden-row");
        });
        btn.dataset.state = "expanded";
        btn.setAttribute("aria-expanded", "true");
        setExpandedLabel();
      }
    });

    const parent = afterNode.parentElement || document.body;
    try {
      afterNode.insertAdjacentElement("afterend", btn);
    } catch (e) {
      parent.insertBefore(btn, afterNode.nextSibling);
    }
  }

  function applyFold() {
    try {
      ensureStyle();
      cleanup();

      const anchors = collectGptAnchors();
      log("Items GPT détectés (section bornée):", anchors.length);

      if (anchors.length <= MAX_VISIBLE) return;

      const rows = [];
      const seen = new Set();
      anchors.forEach(function (a) {
        const row = anchorToRow(a);
        if (row && !seen.has(row)) {
          seen.add(row);
          rows.push(row);
        }
      });
      if (rows.length <= MAX_VISIBLE) return;

      const hiddenRows = rows.slice(MAX_VISIBLE);
      hiddenRows.forEach(function (row) {
        row.classList.add(NS + "-hidden-row");
      });

      insertToggle(rows[MAX_VISIBLE - 1], hiddenRows);

      const hiddenCount = hiddenRows.filter(function (r) {
        return r.classList.contains(NS + "-hidden-row");
      }).length;
      log("Pliage appliqué. Rangées masquées:", hiddenCount);
    } catch (e) {
      error("Échec de l'application du pliage:", e);
    }
  }

  function debounce(fn, delay) {
    let t = null;
    return function () {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(function () {
        try { fn(); } catch (e) { error("Erreur debounced:", e); }
      }, delay);
    };
  }

  observe = debounce(function () {
    if (observerPaused) {
      log("Observation ignorée (pause).");
      return;
    }
    applyFold();
  }, 250);

  function startObserver() {
    if (mo) return;
    try {
      mo = new MutationObserver(observe);
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {
      error("MutationObserver indisponible:", e);
    }
  }

  applyFold();
  startObserver();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) applyFold();
  });
})();
