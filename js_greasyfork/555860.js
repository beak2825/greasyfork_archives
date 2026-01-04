// ==UserScript==
// @name         Declutter Reddit
// @namespace    August4067
// @version      0.0.2
// @description  Remove clutter from Reddit: search telemetry links, ads, promoted posts, related content sections, and homepage search
// @author       August4067
// @license      MIT
// @match        https://www.reddit.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         https://www.reddit.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/555860/Declutter%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/555860/Declutter%20Reddit.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    selectors: {
      searchTracker: "search-telemetry-tracker",
      searchLink: 'a[href^="/search/"]',
      relatedAnswers: 'aside[id^="answers-suggested-queries"]',
      promotion: 'aside[id="right-rail-experience-root"]',
      relatedPosts: 'aside[aria-label="Related Posts Section"]',
      commentTreeAd: "shreddit-comment-tree-ad",
      adPost: "shreddit-ad-post",
      commentsPageAd: "shreddit-comments-page-ad",
      sidebarAd: "shreddit-async-loader[bundlename='sidebar_ad']",
      recentPosts: "recent-posts",
      searchHero: "#search-hero",
      resourcesSection: "faceplate-expandable-section-helper",
      advertiseButton: "advertise-button",
    },
    pollInterval: 200, // Polling interval in milliseconds
    debug: false, // Set to true for development/troubleshooting
  };

  // Settings with defaults
  const Settings = {
    get removeRelatedAnswers() {
      return GM_getValue("removeRelatedAnswers", true);
    },
    set removeRelatedAnswers(value) {
      GM_setValue("removeRelatedAnswers", value);
    },
    get removeTopPosts() {
      return GM_getValue("removeTopPosts", true);
    },
    set removeTopPosts(value) {
      GM_setValue("removeTopPosts", value);
    },
    get removeRelatedPosts() {
      return GM_getValue("removeRelatedPosts", true);
    },
    set removeRelatedPosts(value) {
      GM_setValue("removeRelatedPosts", value);
    },
    get removeSearchHero() {
      return GM_getValue("removeSearchHero", true);
    },
    set removeSearchHero(value) {
      GM_setValue("removeSearchHero", value);
    },
    get removeRecentPosts() {
      return GM_getValue("removeRecentPosts", true);
    },
    set removeRecentPosts(value) {
      GM_setValue("removeRecentPosts", value);
    },
  };

  // Utility: Debug logger
  function debug(message, ...args) {
    if (CONFIG.debug) {
      console.log(`[Declutter Reddit] ${message}`, ...args);
    }
  }

  // Core declutter functions
  const Declutterer = {
    /**
     * Remove search telemetry tracker and replace with plain text
     */
    removeSearchLink(tracker) {
      const link = tracker.querySelector(CONFIG.selectors.searchLink);

      if (!link) return false;

      // Extract text content (excluding SVG icon)
      const textContent = Array.from(link.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent)
        .join("")
        .trim();

      if (!textContent) return false;

      // Replace tracker with plain text
      const textNode = document.createTextNode(textContent);
      tracker.parentNode.replaceChild(textNode, tracker);

      debug(`Removed search link: "${textContent}"`);
      return true;
    },

    /**
     * Process all search telemetry trackers on the page
     */
    processSearchLinks() {
      const trackers = document.querySelectorAll(
        CONFIG.selectors.searchTracker,
      );
      let count = 0;

      trackers.forEach((tracker) => {
        if (this.removeSearchLink(tracker)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} search link(s)`);
      }

      return count;
    },

    /**
     * Remove Related Answers section
     */
    removeRelatedAnswers(element) {
      element.remove();
      debug(`Removed Related Answers section`);
      return true;
    },

    /**
     * Process all Related Answers sections on the page
     */
    processRelatedAnswers() {
      if (!Settings.removeRelatedAnswers) return 0;

      const sections = document.querySelectorAll(
        CONFIG.selectors.relatedAnswers,
      );
      let count = 0;

      sections.forEach((section) => {
        if (this.removeRelatedAnswers(section)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Related Answers section(s)`);
      }

      return count;
    },

    /**
     * Remove Top Posts section
     */
    removeTopPosts(element) {
      element.remove();
      debug(`Removed Top Posts section`);
      return true;
    },

    /**
     * Process all Top Posts sections on the page
     */
    processTopPosts() {
      if (!Settings.removeTopPosts) return 0;

      // Find Top Posts sections by finding h2 with "Top Posts" text
      const headers = Array.from(document.querySelectorAll("h2")).filter((h2) =>
        h2.textContent.trim().toUpperCase().includes("TOP POSTS"),
      );

      let count = 0;

      headers.forEach((header) => {
        // Find the parent container (should be a div.px-md or similar)
        const container = header.closest("div");
        if (container && this.removeTopPosts(container)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Top Posts section(s)`);
      }

      return count;
    },

    /**
     * Remove Promotion section
     */
    removePromotion(element) {
      element.remove();
      debug(`Removed Promotion section`);
      return true;
    },

    /**
     * Process all Promotion sections on the page
     */
    processPromotions() {
      const sections = document.querySelectorAll(CONFIG.selectors.promotion);
      let count = 0;

      sections.forEach((section) => {
        if (this.removePromotion(section)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Promotion section(s)`);
      }

      return count;
    },

    /**
     * Remove Related Posts section
     */
    removeRelatedPosts(element) {
      element.remove();
      debug(`Removed Related Posts section`);
      return true;
    },

    /**
     * Process all Related Posts sections on the page
     */
    processRelatedPosts() {
      if (!Settings.removeRelatedPosts) return 0;

      const sections = document.querySelectorAll(CONFIG.selectors.relatedPosts);
      let count = 0;

      sections.forEach((section) => {
        if (this.removeRelatedPosts(section)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Related Posts section(s)`);
      }

      return count;
    },

    /**
     * Remove Comment Tree Ad
     */
    removeCommentTreeAd(element) {
      element.remove();
      debug(`Removed Comment Tree Ad`);
      return true;
    },

    /**
     * Process all Comment Tree Ads on the page
     */
    processCommentTreeAds() {
      const ads = document.querySelectorAll(CONFIG.selectors.commentTreeAd);
      let count = 0;

      ads.forEach((ad) => {
        if (this.removeCommentTreeAd(ad)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Comment Tree Ad(s)`);
      }

      return count;
    },

    /**
     * Remove Ad Post
     */
    removeAdPost(element) {
      element.remove();
      debug(`Removed Ad Post`);
      return true;
    },

    /**
     * Process all Ad Posts on the page
     */
    processAdPosts() {
      const ads = document.querySelectorAll(CONFIG.selectors.adPost);
      let count = 0;

      ads.forEach((ad) => {
        if (this.removeAdPost(ad)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Ad Post(s)`);
      }

      return count;
    },

    /**
     * Remove Comments Page Ad
     */
    removeCommentsPageAd(element) {
      element.remove();
      debug(`Removed Comments Page Ad`);
      return true;
    },

    /**
     * Process all Comments Page Ads on the page
     */
    processCommentsPageAds() {
      const ads = document.querySelectorAll(CONFIG.selectors.commentsPageAd);
      let count = 0;

      ads.forEach((ad) => {
        if (this.removeCommentsPageAd(ad)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Comments Page Ad(s)`);
      }

      return count;
    },

    /**
     * Remove Sidebar Ad
     */
    removeSidebarAd(element) {
      element.remove();
      debug(`Removed Sidebar Ad`);
      return true;
    },

    /**
     * Process all Sidebar Ads on the page
     */
    processSidebarAds() {
      const ads = document.querySelectorAll(CONFIG.selectors.sidebarAd);
      let count = 0;

      ads.forEach((ad) => {
        if (this.removeSidebarAd(ad)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Sidebar Ad(s)`);
      }

      return count;
    },

    /**
     * Remove Recent Posts section
     */
    removeRecentPosts(element) {
      element.remove();
      debug(`Removed Recent Posts section`);
      return true;
    },

    /**
     * Process all Recent Posts sections on the page
     */
    processRecentPosts() {
      if (!Settings.removeRecentPosts) return 0;

      const sections = document.querySelectorAll(CONFIG.selectors.recentPosts);
      let count = 0;

      sections.forEach((section) => {
        if (this.removeRecentPosts(section)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Recent Posts section(s)`);
      }

      return count;
    },

    /**
     * Remove Search Hero section
     */
    removeSearchHero(element) {
      element.remove();
      debug(`Removed Search Hero section`);
      return true;
    },

    /**
     * Process Search Hero section on the page
     */
    processSearchHero() {
      if (!Settings.removeSearchHero) return 0;

      const section = document.querySelector(CONFIG.selectors.searchHero);
      if (section && this.removeSearchHero(section)) {
        debug(`Processed Search Hero section`);
        return 1;
      }

      return 0;
    },

    /**
     * Close Resources section
     */
    closeResourcesSection(element) {
      // Remove open attribute from faceplate-expandable-section-helper
      element.removeAttribute("open");

      // Find and close the details element within
      const details = element.querySelector("details");
      if (details) {
        details.removeAttribute("open");
      }

      debug(`Closed Resources section`);
      return true;
    },

    /**
     * Process Resources section on the page
     */
    processResourcesSection() {
      const sections = document.querySelectorAll(
        CONFIG.selectors.resourcesSection,
      );
      let count = 0;

      sections.forEach((section) => {
        // Check if this section contains the RESOURCES control
        const summary = section.querySelector(
          'summary [aria-controls="RESOURCES"]',
        );
        if (
          summary &&
          section.hasAttribute("open") &&
          this.closeResourcesSection(section)
        ) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Resources section(s)`);
      }

      return count;
    },

    /**
     * Remove Advertise Button
     */
    removeAdvertiseButton(element) {
      element.remove();
      debug(`Removed Advertise Button`);
      return true;
    },

    /**
     * Process all Advertise Buttons on the page
     */
    processAdvertiseButtons() {
      const buttons = document.querySelectorAll(
        CONFIG.selectors.advertiseButton,
      );
      let count = 0;

      buttons.forEach((button) => {
        if (this.removeAdvertiseButton(button)) {
          count++;
        }
      });

      if (count > 0) {
        debug(`Processed ${count} Advertise Button(s)`);
      }

      return count;
    },

    /**
     * Process all declutter operations
     */
    processAll() {
      try {
        this.processSearchLinks();
        this.processRelatedAnswers();
        this.processTopPosts();
        this.processPromotions();
        this.processRelatedPosts();
        this.processCommentTreeAds();
        this.processAdPosts();
        this.processCommentsPageAds();
        this.processSidebarAds();
        this.processRecentPosts();
        this.processSearchHero();
        this.processResourcesSection();
        this.processAdvertiseButtons();
      } catch (error) {
        debug("Error during processing:", error);
      }
    },
  };

  // Menu commands
  function setupMenu() {
    GM_registerMenuCommand(
      `${Settings.removeRelatedAnswers ? "✓" : "✗"} Remove Related Answers`,
      () => {
        Settings.removeRelatedAnswers = !Settings.removeRelatedAnswers;
        const state = Settings.removeRelatedAnswers ? "enabled" : "disabled";
        alert(`Related Answers removal ${state}. Refresh the page to apply.`);
      },
    );

    GM_registerMenuCommand(
      `${Settings.removeTopPosts ? "✓" : "✗"} Remove Top Posts`,
      () => {
        Settings.removeTopPosts = !Settings.removeTopPosts;
        const state = Settings.removeTopPosts ? "enabled" : "disabled";
        alert(`Top Posts removal ${state}. Refresh the page to apply.`);
      },
    );

    GM_registerMenuCommand(
      `${Settings.removeRelatedPosts ? "✓" : "✗"} Remove Related Posts`,
      () => {
        Settings.removeRelatedPosts = !Settings.removeRelatedPosts;
        const state = Settings.removeRelatedPosts ? "enabled" : "disabled";
        alert(`Related Posts removal ${state}. Refresh the page to apply.`);
      },
    );

    GM_registerMenuCommand(
      `${Settings.removeRecentPosts ? "✓" : "✗"} Remove Recent Posts`,
      () => {
        Settings.removeRecentPosts = !Settings.removeRecentPosts;
        const state = Settings.removeRecentPosts ? "enabled" : "disabled";
        alert(`Recent Posts removal ${state}. Refresh the page to apply.`);
      },
    );

    GM_registerMenuCommand(
      `${Settings.removeSearchHero ? "✓" : "✗"} Remove Homepage Search`,
      () => {
        Settings.removeSearchHero = !Settings.removeSearchHero;
        const state = Settings.removeSearchHero ? "enabled" : "disabled";
        alert(`Homepage Search removal ${state}. Refresh the page to apply.`);
      },
    );
  }

  // Initialize
  function init() {
    debug("Initializing...");

    // Setup menu
    setupMenu();

    // Initial processing (wait for DOM if needed)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        Declutterer.processAll();
      });
    } else {
      Declutterer.processAll();
    }

    debug("Ready");
  }

  // Start initialization - simple approach like Pinterest script
  function safeInit() {
    try {
      init();
    } catch (error) {
      console.error("[Declutter Reddit] Initialization failed:", error);
    }
  }

  // Initialize immediately
  safeInit();

  // Continuous processing with URL change detection (combined into one interval)
  let lastUrl = location.href;
  setInterval(() => {
    const currentUrl = location.href;

    // Always process content to catch dynamically loaded ads
    Declutterer.processAll();

    // Log navigation if URL changed
    if (currentUrl !== lastUrl) {
      debug(`Navigation detected: ${lastUrl} -> ${currentUrl}`);
      lastUrl = currentUrl;
    }
  }, CONFIG.pollInterval);
})();
