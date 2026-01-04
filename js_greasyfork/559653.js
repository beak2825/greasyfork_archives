// ==UserScript==
// @name         ChatGPT - Hide Atlas/Codex/Apps/Images/Projects from Sidebar
// @namespace    https://tampermonkey.net/
// @version      2.0.0
// @description  Safely hides Atlas, Codex, Apps, Images buttons and the Projects section without breaking sidebar rendering.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559653/ChatGPT%20-%20Hide%20AtlasCodexAppsImagesProjects%20from%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/559653/ChatGPT%20-%20Hide%20AtlasCodexAppsImagesProjects%20from%20Sidebar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 1) CSS-only hiding for the link-style items (safe for React)
  function injectCSS() {
    if (document.getElementById("tm-hide-chatgpt-sidebar-items")) return;

    const style = document.createElement("style");
    style.id = "tm-hide-chatgpt-sidebar-items";
    style.textContent = `
      /* Hide Atlas / Codex / Apps / Images by href */
      a[href^="/atlas"],
      a[href^="/codex"],
      a[href^="/apps"],
      a[href^="/images"] {
        display: none !important;
      }

      /* Extra safety: hide by known testids too */
      a[data-testid="apps-button"],
      a[data-testid="sidebar-item-library"] {
        display: none !important;
      }

      /* Hide Projects section once we mark it */
      .tm-hide-projects-section {
        display: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  // 2) Mark the Projects expando section (no removing)
  function markProjectsSection(root = document) {
    // Your snippet: <div class="group/sidebar-expando-section ..."><button ...><h2 class="__menu-label">Projects</h2>...
    // The class contains a "/" which must be escaped in CSS selectors as \/
    const sections = root.querySelectorAll("div.group\\/sidebar-expando-section");
    for (const section of sections) {
      const label = section.querySelector("h2.__menu-label");
      if (label && label.textContent.trim().toLowerCase() === "projects") {
        section.classList.add("tm-hide-projects-section");
      }
    }
  }

  // 3) Observe only the sidebar area (not the whole document)
  function observeSidebar() {
    const nav = document.querySelector("nav");
    if (!nav) return false;

    // Initial mark
    markProjectsSection(nav);

    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // Only scan newly added nodes for speed
        for (const node of m.addedNodes) {
          if (node && node.nodeType === 1) {
            // Element node
            markProjectsSection(node);
          }
        }
      }
    });

    obs.observe(nav, { childList: true, subtree: true });
    return true;
  }

  function start() {
    injectCSS();

    // Wait until nav exists (SPA hydration)
    const tryAttach = () => {
      if (observeSidebar()) return;
      requestAnimationFrame(tryAttach);
    };
    tryAttach();
  }

  // Run as early as possible; document-start means DOM may not exist yet.
  start();
})();
