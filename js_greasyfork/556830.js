// ==UserScript==
// @name         SimpCity - Open Unread Alerts in Tabs
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a button next to "Alerts" to open all unread alerts in new tabs with a delay to prevent rate limiting.
// @author       bitter.beer
// @match        https://simpcity.cr/*
// @match        https://simpcity.is/*
// @match        https://simpcity.cz/*
// @match        https://simpcity.hk/*
// @match        https://simpcity.rs/*
// @match        https://simpcity.ax/*
// @grant        GM_openInTab
// @connect      simpcity.cr
// @connect      simpcity.is
// @connect      simpcity.cz
// @connect      simpcity.hk
// @connect      simpcity.rs
// @connect      simpcity.ax
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556830/SimpCity%20-%20Open%20Unread%20Alerts%20in%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/556830/SimpCity%20-%20Open%20Unread%20Alerts%20in%20Tabs.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===== CONFIG =====
  // Delay (in ms) between opening each unread alert
  const OPEN_DELAY_MS = 3000; // 1 second — adjust as needed

  // Max number of unread alerts to open per click (set to null for all)
  const MAX_TO_OPEN = null; // e.g. 10 to limit to 10 alerts

  // ===== CORE LOGIC =====

  // Adaptive opening queue state (must be defined before usage)
  let isProcessingQueue = false;
  let waitingForNext = false;
  let currentQueueTimer = null;

  /**
   * Find all unread alert links (the actual thread/post links).
   * These are the `.fauxBlockLink-blockLink` anchors inside `.alert.is-unread` items.
   */
  function getUnreadAlertLinks() {
    const selector =
      ".js-alertsMenuBody li.alert.is-unread .fauxBlockLink-blockLink";
    const links = Array.from(document.querySelectorAll(selector));
    return links;
  }

  /**
   * Opens all unread alert links in new tabs with a delay between each.
   */
  function openUnreadAlerts() {
    const links = getUnreadAlertLinks();

    if (!links.length) {
      alert("No unread alerts found.");
      return;
    }

    const totalToOpen = MAX_TO_OPEN
      ? Math.min(MAX_TO_OPEN, links.length)
      : links.length;

    let index = 0;

    // Initialize queue state
    isProcessingQueue = true;
    waitingForNext = false;
    if (currentQueueTimer) {
      clearTimeout(currentQueueTimer);
      currentQueueTimer = null;
    }

    function openNext() {
      // Finished queue
      if (index >= totalToOpen) {
        isProcessingQueue = false;
        waitingForNext = false;
        currentQueueTimer = null;
        return;
      }

      const link = links[index++];
      if (!link || !link.href) {
        openNext();
        return;
      }

      const url = link.href;

      try {
        if (typeof GM_openInTab === "function") {
          GM_openInTab(url, { active: false, insert: true, setParent: true });
        } else {
          window.open(url, "_blank");
        }
      } catch (e) {
        console.error("Failed to open alert tab:", e);
      }

      // Prepare for next opening (either early via message or fallback timer)
      if (index < totalToOpen) {
        waitingForNext = true;
        currentQueueTimer = setTimeout(() => {
          // Fallback path if tab load is slower than delay
          if (!waitingForNext) return; // Already handled by early open
          waitingForNext = false;
          openNext();
        }, OPEN_DELAY_MS);
      } else {
        // Queue will finish after last open
        isProcessingQueue = false;
      }
    }

    // Expose openNext so message handler can trigger early advance
    window.__scOpenNext = openNext;

    openNext();
  }

  /**
   * Ensure the "Open Unread" button exists only when there are unread alerts.
   * Creates the button if needed, removes it if none remain.
   */
  function ensureUnreadButtonForAlertsHeader(headerEl) {
    if (!headerEl) return;
    const existingBtn = headerEl.querySelector("button[data-unread-open-btn]");
    const unreadCount = getUnreadAlertLinks().length;

    if (unreadCount === 0) {
      if (existingBtn) existingBtn.remove();
      return;
    }

    if (existingBtn) return; // Already present and unread exist

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Open Unread";
    btn.title = "Open all unread alerts in new tabs (with delay)";
    btn.setAttribute("data-unread-open-btn", "1");
    btn.style.marginLeft = "0.5em";
    btn.style.fontSize = "0.9em";
    btn.style.cursor = "pointer";
    btn.style.padding = "2px 6px";
    btn.style.borderRadius = "3px";
    btn.style.border = "1px solid rgba(255,255,255,0.2)";
    btn.style.background = "hsla(187, 73%, 52%, 0.5)";

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openUnreadAlerts();
    });

    headerEl.appendChild(btn);
  }

  /**
   * Find the Alerts header(s) and ensure button visibility accordingly.
   */
  function updateAlertsHeaders(root = document) {
    const headers = root.querySelectorAll("h3.menu-header");
    headers.forEach((h3) => {
      if (h3.textContent.trim() === "Alerts") {
        ensureUnreadButtonForAlertsHeader(h3);
      }
    });
  }

  // Try immediately (in case the menu is already in DOM)
  updateAlertsHeaders(document);

  // ===== MutationObserver to handle dynamically inserted alerts menu =====
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        // If a chunk of menu content is added, search within it
        if (
          node.matches(".js-alertsMenuBody, .menu, .menu-content") ||
          node.querySelector(".js-alertsMenuBody")
        ) {
          updateAlertsHeaders(node);
        }

        // General fallback: if any h3.menu-header is added anywhere
        if (
          node.matches("h3.menu-header") ||
          node.querySelector("h3.menu-header")
        ) {
          updateAlertsHeaders(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Periodically re-check in case read state changes without DOM additions (optional safeguard)
  setInterval(() => updateAlertsHeaders(document), 1000);

  // ===== Adaptive Opening Support =====

  // Listen for load completion messages from child tabs
  window.addEventListener("message", (e) => {
    // Basic validation: expecting our custom type
    if (!e.data || e.data.type !== "SC_TAB_LOADED") return;
    if (!isProcessingQueue || !waitingForNext) return;
    // Early proceed
    waitingForNext = false;
    if (currentQueueTimer) {
      clearTimeout(currentQueueTimer);
      currentQueueTimer = null;
    }
    // Continue queue immediately
    // Slight micro-delay to allow browser idle time
    // Proceed immediately (micro-delay not strictly needed)
    if (typeof window.__scOpenNext === "function") {
      window.__scOpenNext();
    }
  });
  // Ensure global callback reference exists even before first queue
  if (typeof window.__scOpenNext !== "function") {
    window.__scOpenNext = function () {};
  }

  // In newly opened tabs, notify opener early once load finishes
  if (window.opener) {
    window.addEventListener("load", () => {
      try {
        window.opener.postMessage({ type: "SC_TAB_LOADED" }, "*");
      } catch (err) {
        // Ignore
      }
    });
  }
})();
