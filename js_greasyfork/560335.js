// @ts-check
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

  const SELECTORS = {
    feedEntry: '[data-testid="web-feed-entry"]',
    activityName: '[data-testid="activity_name"]',
    device: '[data-testid="device"]',
    tag: '[data-testid="tag"]',
    partnerTag: '[data-testid="partner_tag"]',
    groupHeader: '[data-testid="group-header"]',
    titleText: '[data-testid="title-text"]',
    boosted: '[data-testid="boosted"]',
    ownersName: '[data-testid="owners-name"]',
    photo: '[data-testid="photo"]',
  };

  // === Helpers ===
  /**
   * Wraps the raw DOM element to provide clean accessors to data.
   * Acts as the 'Request' object passed down the chain.
   */
  class FeedItem {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
      this.el = element;

      /** @type {Record<string, unknown>} */
      this._cache = {};
    }

    // Marks this item as processed
    markAsProcessed() {
      this.el.dataset.processed = "true";
    }

    // Hides this item and logs the description of what is being hidden
    /**
     * @param {string} description
     */
    hide(description) {
      console.log(`hiding ${description}`);
      this.el.style.display = "none";
      this.markAsProcessed();
    }

    /**
     * @param {string} selector
     */
    _getText(selector) {
      return this.el.querySelector(selector)?.textContent.trim() || "";
    }

    get isChallenge() {
      return !!this.el.querySelector(SELECTORS.groupHeader);
    }

    get challengeInfo() {
      const text = this._getText(SELECTORS.groupHeader);
      const name = this._getText(SELECTORS.titleText);
      return `${text} - ${name}`;
    }

    get isActivity() {
      return !!this.el.querySelector(SELECTORS.activityName);
    }

    get activityName() {
      if (this._cache.activityName === undefined) {
        this._cache.activityName = this._getText(SELECTORS.activityName);
      }
      return /** @type {string} */ (this._cache.activityName);
    }

    get athleteName() {
      return this._getText(SELECTORS.ownersName);
    }

    get isFromFavoriteAthlete() { // aka isBoosted
      return !!this.el.querySelector(SELECTORS.boosted);
    }

    get tags() {
      return [...this.el.querySelectorAll(SELECTORS.tag)].map(t => t?.textContent.trim());
    }

    get hasPhoto() {
      return !!this.el.querySelector(SELECTORS.photo);
    }

    get partnerTags() {
      return [...this.el.querySelectorAll(SELECTORS.partnerTag)].map(t => t?.textContent.trim());
    }

    get deviceName() {
      return this._getText(SELECTORS.device);
    }
  }

  // === Main function ===
  function hideUnwantedEntries(root = document) {
    root.querySelectorAll(`div[role="button"]:not([data-processed]):has(${SELECTORS.feedEntry})`)
      .forEach((div) => {
        const item = new FeedItem(/** @type {HTMLElement} */ (div));

        if (item.isChallenge) {
          item.hide(`challenge progress: ${item.challengeInfo}`);
          return;
        }

        if (!item.isActivity) {
          item.markAsProcessed();
          return;
        }

        if (item.isFromFavoriteAthlete) {
          if (!document.URL.includes("/athletes/")) {
            console.log(`skipping further processing of ${item.athleteName}'s ⭐ activity: ${item.activityName}`);
          }
          item.markAsProcessed();
          return;
        }

        for (const tag of item.tags) {
          if (CONFIG.unwantedTags.has(tag)) {
            if ((tag === "Commute" || tag === "Регулярный маршрут") && item.hasPhoto) {
              console.log(`not hiding commute activity with photo(s): ${item.activityName}`);
              item.markAsProcessed();
              return;
            }
            item.hide(`activity by tag "${tag}": ${item.activityName}`);
            return;
          }
        }

        for (const tag of item.partnerTags) {
          if (CONFIG.unwantedPartnerTags.has(tag)) {
            item.hide(`activity by partner tag "${tag}": ${item.activityName}`);
            return;
          }
        }

        if (CONFIG.unwantedDevices.has(item.deviceName)) {
          item.hide(`activity by device "${item.deviceName}": ${item.activityName}`);
          return;
        }

        if (CONFIG.unwantedNames.some(name => item.activityName.toLowerCase().includes(name))) {
          item.hide(`activity by name: ${item.activityName}`);
          return;
        }

        item.markAsProcessed();
      });
  }

  const observer = new MutationObserver(() => hideUnwantedEntries());
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
