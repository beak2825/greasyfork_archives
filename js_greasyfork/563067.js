// ==UserScript==
// @name         Streamed.pk Optimizer
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  The ultimate zero-lag script for Streamed.pk, Streami.su & Streamed.st. Blocks all ads/popups, removes chat, adds Theater Mode, fixes layout, and boosts performance.
// @author       Ernesto oBeats
// @match        https://streamed.pk/*
// @match        https://www.streamed.pk/*
// @match        https://streami.su/*
// @match        https://www.streami.su/*
// @match        https://streamed.st/*
// @match        https://www.streamed.st/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563067/Streamedpk%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/563067/Streamedpk%20Optimizer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[Streamed.pk Optimizer] Script loaded (v2.2 - SEO Update).");

  // --- Configuration ---
  const CONFIG = {
    removeChat: true,
    blockAds: true,
    centerVideo: true,
    theaterMode: false, // Hides header/titles to push video top-left
  };

  function log(msg) {
    console.log(`[Streamed.pk Optimizer] ${msg}`);
  }

  // --- 0. Pre-emptive Ad/Bloat Neutering ---
  try {
    window.aclib = {
      runPop: function () {
        log("Blocked aclib.runPop");
      },
      _pop: function () {
        log("Blocked aclib._pop");
      },
    };
    Object.freeze(window.aclib);
  } catch (e) {
    console.error(e);
  }

  // --- 1. Ad Blocking & Popups ---
  if (CONFIG.blockAds) {
    window.open = function (url) {
      log(`Blocked popup: ${url}`);
      return null;
    };
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (target.tagName === "DIV" || target.tagName === "A") {
          const style = window.getComputedStyle(target);
          if (
            style.position === "fixed" &&
            style.zIndex > 100 &&
            style.opacity < 0.1
          ) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            target.remove();
            log("Intercepted invisible overlay click.");
          }
        }
      },
      true,
    );
  }

  // --- 2. Layout Engine ---
  function cleanLayout() {
    if (CONFIG.removeChat) {
      const sidebars = document.querySelectorAll(".md\\:w-1\\/4");
      sidebars.forEach((sidebar) => {
        if (
          !sidebar.querySelector("video") &&
          !sidebar.querySelector("iframe")
        ) {
          sidebar.remove();
        }
      });
      const msgContainer = document.querySelector(".messages-container");
      if (msgContainer) {
        const parent =
          msgContainer.closest(".md\\:w-1\\/4") || msgContainer.parentElement;
        parent.remove();
      }
    }

    if (CONFIG.centerVideo) {
      const videoCols = document.querySelectorAll(".md\\:w-3\\/4");
      videoCols.forEach((col) => {
        if (col.querySelector("video") || col.querySelector("iframe")) {
          col.classList.remove("md:w-3/4");
          col.classList.add("w-full", "max-w-7xl", "mx-auto");
          // Ensure flexibility
          col.style.setProperty("width", "100%", "important");
          col.style.setProperty("max-width", "100%", "important");
          col.style.setProperty("flex", "0 0 100%", "important");
          col.style.setProperty("margin-inline", "auto", "important");
        }
      });

      // Layout Fixes for Flex Containers
      const vid =
        document.querySelector("video") || document.querySelector("iframe");
      if (vid) {
        let container = vid.parentElement;
        while (container && container.tagName !== "BODY") {
          // Fix flex-row constraint
          if (container.classList.contains("md:flex-row")) {
            container.classList.remove("md:flex-row");
            container.classList.add(
              "flex-col",
              "items-center",
              "justify-center",
            );
          }
          // Remove top padding/margins if needed
          if (window.getComputedStyle(container).paddingTop !== "0px") {
            container.style.paddingTop = "0";
          }
          container = container.parentElement;
        }
      }
    }

    // C. Theater Mode (Above the Fold)
    if (CONFIG.theaterMode) {
      // Hide Header
      const header = document.querySelector("header");
      if (header) header.style.display = "none";

      // Hide Titles (H1, H3, P)
      // Be careful not to hide video controls if they utilize these tags (unlikely)
      const h1 = document.querySelector("h1");
      if (h1) h1.style.display = "none";

      const h3 = document.querySelector("h3");
      if (h3) h3.style.display = "none"; // Description text

      // Hide Top Banners (Mirror Domains etc)
      const banners = document.querySelectorAll(
        '.bg-red-950, .bg-blue-900, div[class*="bg-"][class*="text-center"]',
      );
      banners.forEach((b) => {
        if (
          b.textContent.includes("Mirror") ||
          b.textContent.includes("Domain")
        ) {
          b.style.display = "none";
        }
      });
    }
  }

  // --- 3. Performance ---
  function optimizePerformance() {
    if (!CONFIG.optimizePerf) return;

    if (!document.getElementById("streamed-opt-style")) {
      const style = document.createElement("style");
      style.id = "streamed-opt-style";
      let css = `
                /* Hardware accelerate video */
                video { transform: translateZ(0); will-change: transform; }

                /* Layout overrides */
                .md\\:w-1\\/4 { display: none !important; }
                .messages-container { display: none !important; }

                /* Responsive Video Sizing */
                .video-js, video, iframe {
                    max-height: 95vh !important; /* Fit within viewport */
                }

                /* Remove vertical spacing */
                .container { padding-top: 0 !important; margin-top: 0 !important; max-width: 100% !important; }
                
                /* FIX: Ensure Text & Links Legibility */
                .container, p, h3, h4 { 
                    color: #eee !important; 
                    text-shadow: 0px 1px 3px rgba(0,0,0,0.9);
                }
                a { 
                    color: #60a5fa !important; /* Light blue for visibility */
                    text-decoration: underline;
                }
            `;

      if (CONFIG.disableGlow) {
        css += `
                    .backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg, .backdrop-blur-xl {
                        backdrop-filter: none !important;
                        -webkit-backdrop-filter: none !important;
                        background: rgba(0,0,0,0.9) !important;
                    }
                    [class*="shadow"] { box-shadow: none !important; filter: none !important; }
                    *, *::before, *::after {
                        text-shadow: none !important;
                        box-shadow: none !important;
                        animation: none !important;
                        transition: none !important;
                    }
                `;
      }
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);
    }

    // Cleanup Bloat
    document
      .querySelectorAll(
        'script[src*="analytics"], script[src*="beat"], iframe[width="0"]',
      )
      .forEach((el) => el.remove());
  }

  function init() {
    optimizePerformance();
    cleanLayout();

    if (document.body) {
      const observer = new MutationObserver(() => {
        cleanLayout();
        optimizePerformance();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      const bodyObserver = new MutationObserver(() => {
        if (document.body) {
          bodyObserver.disconnect();
          init();
        }
      });
      bodyObserver.observe(document.documentElement, { childList: true });
    }
  }

  if (document.readyState === "loading") {
    init();
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Add Toggle Command (Optional, if supported)
  if (typeof GM_registerMenuCommand !== "undefined") {
    GM_registerMenuCommand("Toggle Header", () => {
      const header = document.querySelector("header");
      if (header)
        header.style.display = header.style.display === "none" ? "" : "none";
    });
  }
})();
