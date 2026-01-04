// ==UserScript==
// @name        Overleaf Space Maximiser
// @namespace   https://www.github.com/sjain882
// @author      sjain882 / shanie
// @match       https://www.overleaf.com/project/*
// @version     0.4.2
// @icon        https://www.google.com/s2/favicons?sz=64&domain=overleaf.com
// @description (Requires Tampermonkey Legacy / MV2 on Chromium!) Auto-hide Overleaf top toolbar to maximise vertical space. Hover over that area to show it again. To optionally maximise horizontal space, you can optimise file tree/outline spacing and/or hide file outline to maximise horizontal space. Toggle with settings button in toolbar.
// @homepageURL https://www.github.com/sjain882/Browser-Tweaks/Userscripts
// @supportURL  https://www.github.com/sjain882/Browser-Tweaks/issues
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @require     http://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550576/Overleaf%20Space%20Maximiser.user.js
// @updateURL https://update.greasyfork.org/scripts/550576/Overleaf%20Space%20Maximiser.meta.js
// ==/UserScript==

/* globals $, GM_config */

(function () {
  "use strict";

  var $jqueryOverleafUserScript = jQuery.noConflict();
  // $j is now an alias to the jQuery function; creating the new alias is optional.

  var setIntervalFileTree;

  let gmc = new GM_config({
    id: "OverleafMaximiserConfig", // The id used for this instance of GM_config
    title: "Settings (WARNING: Saving will reload page!)", // Panel Title

    // Fields object
    fields: {

      // This is the id of the field
      HIDE_FILE_OUTLINE: {
        label: "Hide File Outline", // Appears next to field
        type: "checkbox", // Makes this setting a checkbox
        default: true, // Default value if user doesn't change it
      },

      OPTIMISE_FILE_TREE_SPACING: {
        label: "Optimise File Tree Spacing", 
        type: "checkbox", 
        default: true, 
      },

      FILE_TREE_FONT_SIZE: {
        label: "File Tree Font Size", 
        type: "text",
        default: "8", 
      },

      OPTIMISE_FILE_OUTLINE_SPACING: {
        label: "Optimise File Outline Spacing", 
        type: "checkbox", 
        default: true, 
      },

      FILE_OUTLINE_FONT_SIZE: {
        label: "File Outline Font Size", 
        type: "text", 
        default: "8", 
      }
    },

    events: {
      init: function () {
        // runs after initialization completes
        // override saved value
        this.set(
          "HIDE_FILE_OUTLINE",
          localStorage.getItem("ls_HIDE_FILE_OUTLINE") === "true"
        );
        this.set(
          "OPTIMISE_FILE_TREE_SPACING",
          localStorage.getItem("ls_OPTIMISE_FILE_TREE_SPACING") === "true"
        );
        this.set(
          "FILE_TREE_FONT_SIZE",
          localStorage.getItem("ls_FILE_TREE_FONT_SIZE") || "8"
        );
        this.set(
          "OPTIMISE_FILE_OUTLINE_SPACING",
          localStorage.getItem("ls_OPTIMISE_FILE_OUTLINE_SPACING") === "true"
        );
        this.set(
          "FILE_OUTLINE_FONT_SIZE",
          localStorage.getItem("ls_FILE_OUTLINE_FONT_SIZE") || "8"
        );

        optimiseFileTree();
        optimiseFileOutline();
        hideFileOutline();
        // gmc.open();
      },
      save: function () {
        localStorage.setItem(
          "ls_HIDE_FILE_OUTLINE",
          gmc.get("HIDE_FILE_OUTLINE")
        );
        localStorage.setItem(
          "ls_OPTIMISE_FILE_TREE_SPACING",
          gmc.get("OPTIMISE_FILE_TREE_SPACING")
        );
        localStorage.setItem(
          "ls_FILE_TREE_FONT_SIZE",
          gmc.get("FILE_TREE_FONT_SIZE")
        );
        localStorage.setItem(
          "ls_OPTIMISE_FILE_OUTLINE_SPACING",
          gmc.get("OPTIMISE_FILE_OUTLINE_SPACING")
        );
        localStorage.setItem(
          "ls_FILE_OUTLINE_FONT_SIZE",
          gmc.get("FILE_OUTLINE_FONT_SIZE")
        );
        optimiseFileTree();
        hideFileOutline();
        optimiseFileOutline();
        window.location.reload();
      },
    },
  });

  GM_addStyle(`
    nav.toolbar.toolbar-header {
      transition: transform 0.25s ease-in-out, opacity 0.25s ease-in-out;
      opacity: 1;
      z-index: 1000;
    }
    nav.toolbar.toolbar-header.toolbar-hidden {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      position: absolute !important; /* take it out of flex flow */
      top: 0;
      left: 0;
      right: 0;
    }

    .ide-react-body {
      flex: 1 1 auto !important; /* always expand to fill */
      transition: all 0.25s ease-in-out;
    }

  `);

  function makeButton() {
    const a = document.createElement("a");
    a.className =
      "d-inline-grid toolbar-header-upgrade-prompt btn btn-primary btn-sm";
    a.setAttribute("tabindex", "0");
    a.setAttribute("href", "#"); // prevents navigation
    a.setAttribute("role", "button");
    a.dataset.osmSettings = "1"; // marker so we don't duplicate
    const span = document.createElement("span");
    span.className = "button-content";
    span.setAttribute("aria-hidden", "false");
    span.textContent = "Overleaf Space Maximiser";
    a.appendChild(span);

    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      try {
        gmc.open(); // open the GM_config UI from inside the userscript scope
      } catch (err) {
        console.error("Failed to open GM_config:", err);
        alert("Could not open settings UI — see console for details.");
      }
    });

    return a;
  }

  function insertIntoContainer(container) {
    if (!container) return false;
    // avoid duplicates
    if (container.querySelector('a[data-osm-settings="1"]')) return true;
    const btn = makeButton();

    // insert before the first "Upgrade" button if present, otherwise append
    const firstUpgrade = container.querySelector(
      "a.toolbar-header-upgrade-prompt"
    );
    if (firstUpgrade) container.insertBefore(btn, firstUpgrade);
    else container.appendChild(btn);

    return true;
  }

  function tryFindAndInsert() {
    // prefer targeting the nav by aria-label so it's less brittle
    const nav =
      document.querySelector('nav[aria-label="Project actions"]') ||
      document.querySelector("nav.toolbar.toolbar-header") ||
      document.querySelector("nav.toolbar-header") ||
      document.querySelector("nav.toolbar");
    if (!nav) return false;

    // direct-child selector to match your pasted markup:
    const container =
      nav.querySelector("div.d-flex.align-items-center") ||
      nav.querySelector(".d-flex.align-items-center");
    return insertIntoContainer(container);
  }

  // try immediately (in case element already present)
  if (!tryFindAndInsert()) {
    // element not found yet — observe DOM until the toolbar appears
    const mo = new MutationObserver((mutations, observer) => {
      if (tryFindAndInsert()) {
        observer.disconnect();
      }
    });
    mo.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
    // also set a fallback timeout to stop observing after 30s
    setTimeout(() => mo.disconnect(), 30000);
  }

  function optimiseFileTree() {
    if (gmc.get("OPTIMISE_FILE_TREE_SPACING")) {
      GM_addStyle(`
        #panel-file-tree > div > div.file-tree-inner {
          font-size: ${gmc.get("FILE_TREE_FONT_SIZE")}pt !important;
        }

        .item-name-button {
          padding-right: 0 !important;
        }
      `);
    }
  }

  function optimiseFileOutline() {
    if (gmc.get("OPTIMISE_FILE_OUTLINE_SPACING")) {
      GM_addStyle(`
        .outline-pane {
          font-size: ${gmc.get("FILE_OUTLINE_FONT_SIZE")}pt !important;
        }
      `);
    }
  }

  function collapsePanels() {
    const separator = document.querySelector(
      '[role="separator"][aria-controls="panel-file-tree"]'
    );
    if (!separator) return;

    // Force aria-valuenow to 0
    separator.setAttribute("aria-valuenow", "0");

    // Collapse the file tree panel
    const fileTreePanel = document.querySelector("#panel-file-tree");
    if (fileTreePanel) {
      fileTreePanel.style.flexBasis = "0px";
      fileTreePanel.style.height = "0px";
      fileTreePanel.style.minHeight = "0px";
      fileTreePanel.style.overflow = "hidden";
    }

    // Expand remaining panels if needed
    const otherPanels = document.querySelectorAll(
      '[data-panel-group-id=":r3:"] > div'
    );
    otherPanels.forEach((panel) => {
      if (panel !== separator && panel.id !== "panel-file-tree") {
        panel.style.flexGrow = "1";
      }
    });
  }

  function hideFileOutline() {
    if (gmc.get("HIDE_FILE_OUTLINE")) {
      GM_addStyle(`

            .outline-pane {
              position: absolute !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }

            .outline-container {
              position: absolute !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }

            .vertical-resize-handle {
              position: absolute !important;
              width: 0 !important;
              height: 0 !important;
              overflow: hidden !important;
            }

            .file-tree
            {
              height: 100% !important;
            }
            `);

      // Reapply every 500ms to override layout JS
      setIntervalFileTree = setInterval(collapsePanels, 500);
    }
  }

  function setupToolbarHider(toolbar) {
    if (!toolbar) return;

    let visible = false;

    // invisible hover zone at top
    const hoverZone = document.createElement("div");
    hoverZone.style.position = "fixed";
    hoverZone.style.top = "0";
    hoverZone.style.left = "0";
    hoverZone.style.width = "100%";
    hoverZone.style.height = "8px";
    hoverZone.style.zIndex = "2000";
    hoverZone.style.background = "transparent";
    document.body.appendChild(hoverZone);

    function showToolbar() {
      if (visible) return;
      toolbar.classList.remove("toolbar-hidden");
      toolbar.style.position = "relative"; // put back into flex flow
      visible = true;
    }

    function hideToolbar() {
      if (!visible) return;
      toolbar.classList.add("toolbar-hidden");
      visible = false;
    }

    // start hidden
    hideToolbar();

    hoverZone.addEventListener("mouseenter", showToolbar);
    toolbar.addEventListener("mouseleave", (ev) => {
      const rt = ev.relatedTarget;
      if (rt && (rt === hoverZone || hoverZone.contains(rt))) return;
      hideToolbar();
    });
  }

  const observer = new MutationObserver((_, obs) => {
    const toolbar = document.querySelector("nav.toolbar.toolbar-header");
    if (toolbar) {
      setupToolbarHider(toolbar);
      obs.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
