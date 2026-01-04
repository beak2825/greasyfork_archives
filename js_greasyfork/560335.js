// ==UserScript==
// @name         Strava - Hide Unwanted Feed Items
// @namespace    https://github.com/dtruebin/userscripts/
// @supportURL   https://github.com/dtruebin/userscripts/issues
// @version      4.1.0
// @description  Hides uninspiring activities and challenge progress from Strava feed based on device, tags, and activity name.
// @author       Dmitry Trubin
// @match        https://www.strava.com/dashboard*
// @match        https://www.strava.com/athletes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560335/Strava%20-%20Hide%20Unwanted%20Feed%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/560335/Strava%20-%20Hide%20Unwanted%20Feed%20Items.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // === Config ===
  const CONFIG = {
    unwantedTags: new Set([
      "Commute", "Регулярный маршрут",
      "Virtual", "Виртуальный",
    ]),
    unwantedPartnerTags: new Set([
      "TrainerRoad",
    ]),
    unwantedDevices: new Set([
      "Rouvy",
      "Tacx App",
      "Zwift",
    ]),
    unwantedNames: [
      "weight training", "Gewichtstraining"
    ].map((s) => s.toLowerCase())
  };

  // === Helper to hide an element and log reason ===
  function hideElement(element, logMessage) {
    console.log(logMessage);
    element.style.display = "none";
    markAsProcessed(element);
  }

  // === Helper to mark an element as processed ===
  function markAsProcessed(element) {
    element.dataset.processed = "true";
  }

  const SELECTORS = {
    feedEntry: '[data-testid="web-feed-entry"]',
    activityName: '[data-testid="activity_name"]',
    device: '[data-testid="device"]',
    tag: '[data-testid="tag"]',
    partnerTag: '[data-testid="partner_tag"]',
  };

  // === Main function ===
  function hideUnwantedEntries(root = document) {
    root.querySelectorAll(`div[role="button"]:not([data-processed]):has(${SELECTORS.feedEntry})`)
      .forEach((div) => {
        const challenge = div.querySelector('[data-testid="group-header"]');
        if (challenge) {
          const challengeName = div.querySelector('[data-testid="title-text"]')?.textContent;
          hideElement(div, `hiding challenge progress: ${challenge.textContent} - ${challengeName}`);
          return;
        }

        const activity = div.querySelector(SELECTORS.activityName);
        if (!activity) {
          markAsProcessed(div);
          return;
        }

        const activityName = activity?.textContent.trim();

        const fromFavoriteAthlete = div.querySelector('[data-testid="boosted"]');
        if (fromFavoriteAthlete) {
          if (!document.URL.includes("/athletes/")) {
            const athleteName = div.querySelector('[data-testid="owners-name"]')?.textContent;
            console.log(`skipping further processing of ${athleteName}'s ⭐ activity: ${activityName}`);
          }
          markAsProcessed(div);
          return;
        }

        const tags = div.querySelectorAll(SELECTORS.tag);
        for (const tag of [...tags].map((tagElement) => tagElement?.textContent.trim())) {
          if (CONFIG.unwantedTags.has(tag)) {
            const hasPhoto = div.querySelector('[data-testid="photo"]');
            if ((tag === "Commute" || tag === "Регулярный маршрут") && hasPhoto) {
              console.log(`not hiding commute activity with photo(s): ${activityName}`);
              markAsProcessed(div);
              return;
            }

            hideElement(div, `hiding activity by tag "${tag}": ${activityName}`);
            return;
          }
        }

        const partnerTags = div.querySelectorAll(SELECTORS.partnerTag);
        for (const tag of [...partnerTags].map((tagElement) => tagElement?.textContent.trim())) {
          if (CONFIG.unwantedPartnerTags.has(tag)) {
            hideElement(div, `hiding activity by partner tag "${tag}": ${activityName}`);
            return;
          }
        }

        const device = div.querySelector(SELECTORS.device);
        if (device) {
          const deviceName = device?.textContent.trim();
          if (CONFIG.unwantedDevices.has(deviceName)) {
            hideElement(div, `hiding activity by device "${deviceName}": ${activityName}`);
            return;
          }
        }

        if (CONFIG.unwantedNames.some((name) => activityName.toLowerCase().includes(name))) {
          hideElement(div, `hiding activity by name: ${activityName}`);
          return;
        }

        markAsProcessed(div);
      });
  }

  const observer = new MutationObserver(() => hideUnwantedEntries());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
