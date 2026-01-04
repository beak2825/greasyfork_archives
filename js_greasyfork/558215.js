// ==UserScript==
// @name         Custom Target Finder
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  Adds a button to the top of the page that opens a new tab with a target from a custom list.
// @author       Omanpx [1906686], xentac [3354782]
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/558215/Custom%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/558215/Custom%20Target%20Finder.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`
            body {
                --ccb-bg-color: #f0f0f0;
                --ccb-alt-bg-color: #fff;
                --ccb-border-color: #ccc;
                --ccb-input-color: #ccc;
                --ccb-text-color: #000;
                --ccb-hover-color: #ddd;
                --ccb-glow-color: #4CAF50;
                --ccb-success-color: #4CAF50;
            }

            body.dark-mode {
                --ccb-bg-color: #333;
                --ccb-alt-bg-color: #383838;
                --ccb-border-color: #444;
                --ccb-input-color: #504f4f;
                --ccb-text-color: #ccc;
                --ccb-hover-color: #555;
                --ccb-glow-color: #4CAF50;
                --ccb-success-color: #4CAF50;
            }

            .ccb-settings-accordion {
                margin: 10px 0;
                padding: 10px;
                background-color: var(--ccb-bg-color);
                border: 1px solid var(--ccb-border-color);
                border-radius: 5px;
            }

            .ccb-settings-entry {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 10px;
                margin-bottom: 5px;
            }

            .ccb-settings-entry p {
                margin: 0;
                color: var(--ccb-text-color);
            }

            .ccb-settings-input {
                width: 120px;
                padding: 5px;
                background-color: var(--ccb-input-color);
                color: var(--ccb-text-color);
                border: 1px solid var(--ccb-border-color);
                border-radius: 3px;
            }

            .ccb-settings-entry-large {
                margin-bottom: 15px;
            }

            .ccb-settings-label {
                color: var(--ccb-text-color);
            }

            .ccb-settings-label-inline {
                margin-right: 10px;
                min-width: 150px;
                display: inline-block;
            }

            .ccb-settings-input {
                width: 120px;
                padding: 5px;
                background-color: var(--ccb-input-color);
                color: var(--ff-text-color);
                border: 1px solid var(--ccb-border-color);
                border-radius: 3px;
            }

            .ccb-settings-input-wide {
                width: 200px;
            }

            .ccb-settings-button-large {
                padding: 8px 16px;
                font-size: 14px;
                font-weight: bold;
            }

            .ccb-settings-button-container {
                margin-bottom: 20px;
                text-align: center;
            }

            .ccb-settings-button {
                margin-right: 10px;
            }

            .ccb-settings-button:last-child {
                margin-right: 0;
            }
  `);

  // Define requirements
  // These are user ID ranges that will be targeted
  let userids = getSavedUserIds();
  let currentUserId = null;
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Create a button element
  const button = document.createElement("button");
  button.innerHTML = "Custom";
  button.style.position = "fixed";
  //button.style.top = '10px';
  //button.style.right = '10px';
  button.style.top = "37%"; // Adjusted to center vertically
  button.style.right = "0%"; // Center horizontally
  //button.style.transform = 'translate(-50%, -50%)'; // Center the button properly
  button.style.zIndex = "9999";

  // Add CSS styles for a green background
  button.style.backgroundColor = "green";
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "6px";
  button.style.borderRadius = "6px";
  button.style.cursor = "pointer";

  // Add a click event listener to open Google in a new tab
  button.addEventListener("click", function () {
    let randID = getRandomNumber(0, userids.length - 1);
    console.log(randID);
    // Uncomment one of the lines below, depending on what you prefer
    //let profileLink = `https://www.torn.com/profiles.php?XID=${randID}`; // Profile link
    let profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${userids[randID]}`; // Attack link

    // Comment this line and uncomment the one below it if you want the profile to open in a new tab
    //window.location.href = profileLink;
    window.open(profileLink, "_blank");
  });
  // Add the button to the page
  document.body.appendChild(button);

  function getSavedUserIds() {
    const stored = GM_getValue("ccb-userids", "");

    return stored.split(",");
  }

  function setSavedUserIds(userIds) {
    const userIdsList = userIds.trim().split("\n");
    for (const i of userIdsList) {
      if (isNaN(parseInt(i)) || !isFinite(i)) {
        alert("All user ids must be integers. Not saved!");
        return false;
      }
    }
    // randomly sort them
    GM_setValue("ccb-userids", userIdsList.join(","));
    userids = getSavedUserIds();
    return true;
  }

  async function createSettingsPanel() {
    // Check if we're on the user's own profile page
    const pageId = window.location.href.match(/XID=(\d+)/)?.[1];
    if (!pageId || pageId !== currentUserId) {
      return;
    }

    // Wait for profile wrapper to be available
    const profileWrapper = await waitForElement(".profile-wrapper", 15000);
    if (!profileWrapper) {
      console.log(
        "[Custom Chain Button] Could not find profile wrapper for settings panel",
      );
      return;
    }

    // Check if settings panel already exists
    if (document.querySelector(".ccb-settings-accordion")) {
      console.log("[Custom Chain Button] Settings panel already exists");
      return;
    }

    // Get current user data for display
    const userName =
      profileWrapper.querySelector(".user-name")?.textContent ||
      profileWrapper.querySelector(".profile-name")?.textContent ||
      profileWrapper.querySelector("h1")?.textContent ||
      "User";

    // Create the settings panel
    const settingsPanel = document.createElement("details");
    settingsPanel.className = "ccb-settings-accordion";

    profileWrapper.parentNode.insertBefore(
      settingsPanel,
      profileWrapper.nextSibling,
    );

    // Create summary
    const summary = document.createElement("summary");
    summary.textContent = "Custom Chain Button Settings";
    summary.style.cursor = "pointer";
    settingsPanel.appendChild(summary);

    // Create main content div
    const content = document.createElement("div");

    const listDiv = document.createElement("div");
    listDiv.className = "ccb-settings-entry ccb-settings-entry-large";
    content.append(listDiv);

    const listLabel = document.createElement("label");
    listLabel.setAttribute("for", "ccb-list");
    listLabel.textContent =
      "List of user ids to chain on (separated by newlines)";
    listLabel.className = "ccb-settings-label ccb-settings-label-inline";
    listDiv.appendChild(listLabel);

    const listTextarea = document.createElement("textarea");
    listTextarea.id = "ccb-list";
    listTextarea.placeholder = "12345\n67890";
    listTextarea.value = getSavedUserIds().join("\n");
    listTextarea.className = "ccb-settings-input ccb-settings-input-wide";
    listTextarea.style.height = "20em";
    listDiv.appendChild(listTextarea);

    const saveButtonDiv = document.createElement("div");
    saveButtonDiv.className = "ccb-settings-button-container";

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset to Defaults";
    resetButton.className =
      "ccb-settings-button ccb-settings-button-large torn-btn btn-big";

    resetButton.addEventListener("click", function () {
      const confirmed = confirm(
        "Are you sure you want to reset all settings to their default values?",
      );
      if (!confirmed) return;

      listTextarea.value = getSavedUserIds().join("\n");

      this.style.backgroundColor = "var(--ccb-success-color)";
      setTimeout(() => {
        this.style.backgroundColor = "";
      }, 1000);
    });

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Settings";
    saveButton.className =
      "ccb-settings-button ccb-settings-button-large torn-btn btn-big";

    saveButton.addEventListener("click", function () {
      const list = listTextarea.value;
      if (setSavedUserIds(list)) {
        alert("Custom Chain list saved successfully");
      }
    });

    saveButtonDiv.appendChild(resetButton);
    saveButtonDiv.appendChild(saveButton);
    content.appendChild(saveButtonDiv);

    settingsPanel.appendChild(content);
  }

  async function getLocalUserId() {
    const profileLink = await waitForElement(
      ".settings-menu > .link > a:first-child",
      15000,
    );

    if (!profileLink) {
      console.log(
        "[Custom Chain Button] Could not find profile link in settings menu",
      );
      return null;
    }

    const match = profileLink.href.match(/XID=(\d+)/);
    if (match) {
      const userId = match[1];
      console.log(`[Custom Chain Button] Found local user ID: ${userId}`);
      return userId;
    }

    console.log(
      "[Custom Chain Button] Could not extract user ID from profile link",
    );
    return null;
  }

  getLocalUserId().then((userId) => {
    if (userId) {
      currentUserId = userId;
      console.log(
        `[Custom Chain Button] Current user ID initialized: ${currentUserId}`,
      );

      createSettingsPanel();

      const profileObserver = new MutationObserver(() => {
        const pageId = window.location.href.match(/XID=(\d+)/)?.[1];
        if (
          pageId === currentUserId &&
          window.location.pathname === "/profiles.php"
        ) {
          createSettingsPanel();
          profileObserver.disconnect();
        }
      });

      profileObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  });

  function waitForElement(querySelector, timeout = 15000) {
    return new Promise((resolve) => {
      // Check if element already exists
      const existingElement = document.querySelector(querySelector);
      if (existingElement) {
        return resolve(existingElement);
      }

      // Set up observer to watch for element
      const observer = new MutationObserver(() => {
        const element = document.querySelector(querySelector);
        if (element) {
          observer.disconnect();
          if (timer) {
            clearTimeout(timer);
          }
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Set up timeout
      const timer = setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }
})();
