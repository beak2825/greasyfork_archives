// ==UserScript==
// @name         DeepCo Queue Notifier
// @namespace    https://deepco.app/
// @version      0.0.10
// @description  Sends a notification when your queue hits a certain threshold
// @author       NaN
// @match        https://*.deepco.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560258/DeepCo%20Queue%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/560258/DeepCo%20Queue%20Notifier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_THRESHOLD = 0;
  let currentObserver = null;
  let notificationSent = false;
  let lastElement = null;
  let notifyThreshold = GM_getValue("notifyThreshold", DEFAULT_THRESHOLD);
  let settingsButton = null;
  let notificationsSuppressed = false;
  let layerCompleteTextWasVisible = false;

  function shouldShowButton() {
    return window.location.pathname.includes("/dig");
  }

  function updateButtonText() {
    if (settingsButton) {
      settingsButton.textContent = `⚙️ Queue Notifier (${notifyThreshold})`;
    }
  }

  function createSettingsButton() {
    if (!shouldShowButton()) {
      console.log("Not on /dig page, skipping button creation");
      return;
    }

    const navBar = document.getElementsByClassName("navbar-end")[0];
    if (!navBar) {
      console.log("Navbar not found, skipping button creation");
      return;
    }

    // Remove old button if it exists
    if (settingsButton && settingsButton.parentNode) {
      settingsButton.remove();
    }

    const button = document.createElement("button");
    button.textContent = `Queue Notifier (${notifyThreshold})`;
    button.className = `btn btn-sm btn-outline gap-2 font-mono join-item`;
    button.style.cssText = `
      margin-left: 15px;
      margin-right: 15px;
      z-index: 10000;
      padding: 10px 15px;
      cursor: pointer;
      transition: background 0.2s;
    `;

    button.onmouseover = () => (button.style.background = "#2d3748");
    button.onmouseout = () => (button.style.background = "#4a5568");
    button.onclick = showSettingsPrompt;

    navBar.insertBefore(button, navBar.lastChild);
    settingsButton = button;
    console.log("Settings button created");
  }

  function ensureButtonExists() {
    if (!shouldShowButton()) {
      // Remove button if it exists but we're not on the right page
      if (settingsButton && settingsButton.parentNode) {
        settingsButton.remove();
        settingsButton = null;
      }
      return;
    }

    // Check if button exists and is still attached to the DOM
    if (!settingsButton || !document.body.contains(settingsButton)) {
      console.log("Settings button not found, recreating...");
      createSettingsButton();
    }
  }

  function showSettingsPrompt() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const modal = document.createElement("div");
    modal.className = `text-sm p-2 card bg-base-100 text-base-content border border-base-300 rounded-box pt-4`;
    modal.style.cssText = `
      padding: 30px;
      max-width: 400px;
    `;

    modal.innerHTML = `
      <h2 class="font-semibold tracking-widest uppercase text-xl" style="margin: 0 0 15px 0;">
        Queue Notifier Settings
      </h2>
      <p class="stat-title" style="margin: 0 0 20px 0; text-wrap: auto;">
        Get notified when your queue reaches this number or below:
      </p>
      <input
        type="number"
        id="threshold-input"
        value="${notifyThreshold}"
        class="stat-title"
        min="0"
        style="
          width: 100%;
          padding: 10px;
          border: 2px solid #e2e8f0;
          font-size: 16px;
          box-sizing: border-box;
        "
      />
      <div style="margin-top: 20px; display: flex; gap: 10px;">
        <button class="btn btn-sm btn-outline gap-2 font-mono join-item" id="save-btn" style="
          flex: 1;
          padding: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">Save</button>
        <button class="btn btn-sm btn-outline gap-2 font-mono join-item" id="cancel-btn" style="
          flex: 1;
          padding: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        ">Cancel</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = modal.querySelector("#threshold-input");
    const saveBtn = modal.querySelector("#save-btn");
    const cancelBtn = modal.querySelector("#cancel-btn");

    input.focus();
    input.select();

    saveBtn.onclick = () => {
      const value = parseInt(input.value);
      if (!isNaN(value) && value >= 0) {
        notifyThreshold = value;
        GM_setValue("notifyThreshold", value);
        notificationSent = false;
        updateButtonText();
        console.log(`Threshold updated to: ${value}`);
        overlay.remove();
      } else {
        alert("Please enter a valid number (0 or greater)");
      }
    };

    cancelBtn.onclick = () => overlay.remove();
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };

    input.onkeypress = (e) => {
      if (e.key === "Enter") saveBtn.click();
    };
  }

  function checkLayerCompleteStatus() {
    const layerCompleteText = document.getElementById("layer-complete-text");
    const isVisible = layerCompleteText !== null;

    if (layerCompleteTextWasVisible && !isVisible) {
      console.log(
        "Layer complete text disappeared, suppressing notifications for 5 seconds"
      );
      notificationsSuppressed = true;

      setTimeout(() => {
        notificationsSuppressed = false;
        console.log("Notification suppression ended");
      }, 5000);
    }

    layerCompleteTextWasVisible = isVisible;
  }

  function checkQueueStatus() {
    const queueStatusElm = document.getElementById("queue-status");
    if (!queueStatusElm) return;

    if (lastElement && lastElement !== queueStatusElm) {
      console.log("Element was replaced, re-initializing observer");
      initObserver(queueStatusElm);
    }

    const innerText = queueStatusElm.innerText.trim();
    const queueCount = parseInt(innerText);

    console.log("Queue status text:", innerText);

    if (!isNaN(queueCount) && queueCount <= notifyThreshold) {
      if (!notificationSent && !notificationsSuppressed) {
        console.log(
          `Sending notification - queue is at ${queueCount} (threshold: ${notifyThreshold})`
        );
        GM_notification({
          title: "DeepCo Queue Alert",
          text: `Your queue has ${queueCount} item${queueCount === 1 ? "" : "s"} left!`,
          timeout: 5000,
        });
        notificationSent = true;
      } else if (notificationsSuppressed) {
        console.log("Notification suppressed due to layer complete");
      }
    } else if (queueCount > notifyThreshold) {
      notificationSent = false;
    }
  }

  function initObserver(element) {
    if (currentObserver) {
      currentObserver.disconnect();
    }

    lastElement = element;
    currentObserver = new MutationObserver(checkQueueStatus);
    currentObserver.observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    console.log("Observer attached to element");
  }

  function init() {
    const queueStatusElm = document.getElementById("queue-status");
    if (queueStatusElm) {
      console.log("Found queue-status element");
      initObserver(queueStatusElm);
      checkQueueStatus();
    }
  }

  // Wait for initial element
  const checkInterval = setInterval(() => {
    if (document.getElementById("queue-status")) {
      clearInterval(checkInterval);
      init();
    }
  }, 500);

  // Create settings button once page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createSettingsButton);
  } else {
    createSettingsButton();
  }

  // Poll every 2 seconds
  setInterval(() => {
    checkQueueStatus();
    checkLayerCompleteStatus();
    ensureButtonExists();
  }, 2000);

  // Re-check when tab becomes visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      checkQueueStatus();
      checkLayerCompleteStatus();
      ensureButtonExists();
    }
  });
})();