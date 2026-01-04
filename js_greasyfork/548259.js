// ==UserScript==
// @name        Full screen Jira sidebar
// @namespace   Violentmonkey Scripts
// @license     MIT
// @match       https://*.atlassian.net/jira/*
// @grant       none
// @version     1.3.4
// @author      -
// @description 9/5/2025, 3:20:00 PM
// @downloadURL https://update.greasyfork.org/scripts/548259/Full%20screen%20Jira%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/548259/Full%20screen%20Jira%20sidebar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let originalWidth = undefined;
  let originalMinWidth = undefined;
  let originalModalWidth = undefined;

  function toggleSidebarWidth(sidebar) {
    if (!sidebar) {
      console.error("Jira sidebar element not found.");
      return;
    }

    if (originalWidth === undefined) {
      originalWidth = sidebar.style.width || "360px";
      sidebar.style.width = "calc(100vw - 2rem)";
    } else {
      sidebar.style.width = originalWidth;
      originalWidth = undefined;
    }
  }

  function toggleSidebarMinWidth(sidebar) {
    if (!sidebar) {
      console.error("Jira sidebar element not found.");
      return;
    }

    if (originalMinWidth === undefined) {
      originalMinWidth = sidebar.style.minWidth || "400px";
      sidebar.style.minWidth = "75%";
    } else {
      sidebar.style.minWidth = originalMinWidth;
      originalMinWidth = undefined;
    }
  }

  function toggleModalWidth(dialog) {
    if (!dialog) {
      console.error("Jira Modal element not found.");
      return;
    }

    if (originalModalWidth === undefined) {
      originalModalWidth = dialog.style.getPropertyValue('--modal-dialog-width') || "1280px";
      dialog.style.setProperty('--modal-dialog-width', 'calc(100vw - 2rem)');
    } else {
      dialog.style.setProperty('--modal-dialog-width', 'calc(100vw - 2rem)');
      // originalModalWidth = undefined;
    }
  }

  function appendButton(sidebar, cb, style = {}) {
    if (document.getElementById("fu-sidebar-btn")) {
      return;
    }

    const targat = document.querySelector("#jira-issue-header");
    if (sidebar) {
      const fuBtn = document.createElement("button");
      fuBtn.id = "fu-sidebar-btn";
      fuBtn.innerText = "F";
      fuBtn.style.position = style.position || "absolute";
      fuBtn.style.top = style.top || "3.5rem";
      fuBtn.style.right = style.right || "1.5rem";
      fuBtn.style.height = "2rem";
      fuBtn.style.width = "2rem";
      fuBtn.style.zIndex = "9999"; // Ensure the button is on top
      fuBtn.style.cursor = "pointer";
      fuBtn.style.background = "transprent";
      fuBtn.style.color = "orange";
      fuBtn.addEventListener("click", cb);

      sidebar.appendChild(fuBtn);
      console.log("Button appended successfully.");
    } else {
      console.log("Sidebar not yet available, waiting...");
    }
  }

  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        const backlogSidebar = document.querySelector('div[data-onboarding-observer-id="backlog-wrapper"] > div:has(style)');
        if (backlogSidebar) {
          const toolbar = document.querySelector('[data-testid="software-backlog.page-header"] > div > div:last-of-type > div')
          appendButton(toolbar, () => toggleSidebarWidth(backlogSidebar), { position: 'static' });
          return;
        }
        const timelineSidebar = document.querySelector('[data-testid="flex-resizer.ui.resize-wrapper"]');
        if (timelineSidebar) {
          const toolbar = document.querySelector('[data-ep-placeholder-id="route_entry_point"] > div > div > div > div:last-of-type')
          appendButton(toolbar, () => toggleSidebarMinWidth(timelineSidebar), { position: 'static' });
          return;
        }
        const kanbanSidebar = document.querySelector('[data-onboarding-observer-id="board-wrapper"] ~ div')
        if (kanbanSidebar) {
          const toolbar = document.querySelector('[data-testid="software-board.header.controls-bar"] > div:last-of-type > div')
          appendButton(toolbar, () => toggleSidebarMinWidth(kanbanSidebar), { position: 'static' });
          return;
        }
        const kanbanModal = document.querySelector('[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]')
        if (kanbanModal) {
          kanbanModal.style.position = 'relative';
          toggleModalWidth(kanbanModal)
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
