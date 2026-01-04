// ==UserScript==
// @name         Azure DevOps Extension Dev Magic : ADO Extension Local Development Helper
// @namespace    https://github.com/vs4vijay/ado-extension-dev-magic
// @version      1.0.0
// @description  Replace production Azure DevOps extension iframe URLs with local development URLs for testing
// @author       Open Source Community
// @match        https://dev.azure.com/*
// @match        https://*.visualstudio.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @homepageURL  https://github.com/vs4vijay/ado-extension-dev-magic
// @supportURL   https://github.com/vs4vijay/ado-extension-dev-magic/issues
// @downloadURL https://update.greasyfork.org/scripts/556429/Azure%20DevOps%20Extension%20Dev%20Magic%20%3A%20ADO%20Extension%20Local%20Development%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556429/Azure%20DevOps%20Extension%20Dev%20Magic%20%3A%20ADO%20Extension%20Local%20Development%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========================================
  // CONFIGURATION - Customize these values
  // ========================================

  /**
   * URL Mappings Configuration
   * Add your extension URLs here to map production URLs to local development URLs
   * Format: { productionUrl: 'localDevUrl' }
   */
  const URL_MAPPINGS = {
    // Example mappings - replace with your actual URLs
    "https://your-production-extension.azurestaticapps.net/": "http://localhost:3000/",

    // Another example
    "https://another-extension.azurewebsites.net/app": "http://localhost:8080/app",
    // Add more mappings as needed
  };

  /**
   * Configuration Settings
   */
  const ENABLE_DEBUG_LOG = true; // Enable console logging
  const CHECK_INTERVAL = 2000; // Check interval for iframe replacement (milliseconds)

  /**
   * Target Page Configuration
   * Specify which Azure DevOps pages to target
   */
  const TARGET_PAGES = {
    pullRequests: true,
    workItems: false,
    builds: false,
    releases: false,
    repos: false,
    // Add more page types as needed
  };

  // ========================================
  // CORE FUNCTIONALITY - Do not modify unless you know what you're doing
  // ========================================

  const SCRIPT_NAME = "ADO Extension Local Dev Helper";

  function log(message, level = "info") {
    if (ENABLE_DEBUG_LOG) {
      const timestamp = new Date().toISOString();
      console[level](`[${timestamp}] ${SCRIPT_NAME}: ${message}`);
    }
  }

  function getReplacementUrl(originalUrl) {
    // Check for exact matches first
    if (URL_MAPPINGS[originalUrl]) {
      return URL_MAPPINGS[originalUrl];
    }

    // Check for partial matches (in case of query parameters or fragments)
    for (const [prodUrl, localUrl] of Object.entries(URL_MAPPINGS)) {
      if (originalUrl.startsWith(prodUrl)) {
        const remainder = originalUrl.substring(prodUrl.length);
        return localUrl + remainder;
      }
    }

    return null;
  }

  function replaceIframeSrc() {
    const iframes = document.querySelectorAll(
      'iframe.external-content--iframe, iframe[src*="azurestaticapps.net"], iframe[src*="azurewebsites.net"]'
    );
    let replacedCount = 0;

    iframes.forEach((iframe) => {
      const originalSrc = iframe.src;
      const replacementUrl = getReplacementUrl(originalSrc);

      if (replacementUrl) {
        log(
          `Found production iframe (${originalSrc}), replacing with local URL (${replacementUrl})`
        );
        iframe.src = replacementUrl;
        replacedCount++;

        // Add visual indicator that this iframe has been replaced
        iframe.style.border = "2px solid #0078d4";
        iframe.title =
          "Local Development - " + (iframe.title || "Extension iframe");
      }
    });

    if (replacedCount > 0) {
      log(
        `Successfully replaced ${replacedCount} iframe(s) with local development URLs`
      );
    }
  }

  function interceptIframeCreation() {
    const originalSetAttribute = HTMLIFrameElement.prototype.setAttribute;

    HTMLIFrameElement.prototype.setAttribute = function (name, value) {
      if (name === "src") {
        const replacementUrl = getReplacementUrl(value);
        if (replacementUrl) {
          log(
            `Intercepting iframe src attribute (${value}), using local URL (${replacementUrl})`
          );
          value = replacementUrl;
        }
      }
      return originalSetAttribute.call(this, name, value);
    };

    // Intercept direct src property assignment
    Object.defineProperty(HTMLIFrameElement.prototype, "src", {
      get: function () {
        return this.getAttribute("src") || "";
      },
      set: function (value) {
        const replacementUrl = getReplacementUrl(value);
        if (replacementUrl) {
          log(
            `Intercepting iframe src property (${value}), using local URL (${replacementUrl})`
          );
          value = replacementUrl;
        }
        this.setAttribute("src", value);
      },
      configurable: true,
      enumerable: true,
    });
  }

  function setupMutationObserver() {
    const observer = new MutationObserver(function (mutations) {
      let shouldCheck = false;

      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === "IFRAME" || node.querySelector("iframe")) {
                shouldCheck = true;
              }
            }
          });
        } else if (
          mutation.type === "attributes" &&
          mutation.target.tagName === "IFRAME" &&
          mutation.attributeName === "src"
        ) {
          shouldCheck = true;
        }
      });

      if (shouldCheck) {
        setTimeout(replaceIframeSrc, 100);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
      log("MutationObserver setup complete");
    }
  }

  function isTargetPage() {
    const path = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();

    return (
      (TARGET_PAGES.pullRequests &&
        (path.includes("/pullrequest/") || href.includes("pullrequest"))) ||
      (TARGET_PAGES.workItems && path.includes("/_workitems/")) ||
      (TARGET_PAGES.builds && path.includes("/_build/")) ||
      (TARGET_PAGES.releases && path.includes("/_release/")) ||
      (TARGET_PAGES.repos && path.includes("/_git/"))
    );
  }

  function init() {
    log("Initializing extension local development helper...");
    log(
      `Configured URL mappings: ${Object.keys(URL_MAPPINGS).length} mapping(s)`
    );

    if (Object.keys(URL_MAPPINGS).length === 0) {
      log(
        "Warning: No URL mappings configured. Please update the URL_MAPPINGS configuration.",
        "warn"
      );
      return;
    }

    interceptIframeCreation();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        replaceIframeSrc();
        setupMutationObserver();
      });
    } else {
      replaceIframeSrc();
      setupMutationObserver();
    }

    // Periodic check as fallback
    setInterval(replaceIframeSrc, CHECK_INTERVAL);

    log("Initialization complete");
  }

  // Monitor for page navigation in Azure DevOps SPA
  function setupNavigationMonitor() {
    let lastUrl = location.href;
    const navigationObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (isTargetPage()) {
          log("Navigated to target page, re-initializing...");
          setTimeout(init, 1000);
        }
      }
    });

    if (document.documentElement) {
      navigationObserver.observe(document.documentElement, {
        subtree: true,
        childList: true,
      });
    }
  }

  // Main execution
  if (isTargetPage()) {
    init();
  }

  setupNavigationMonitor();

  // Expose configuration for runtime modification (optional)
  window.adoExtensionDevHelper = {
    config: {
      urlMappings: URL_MAPPINGS,
      enableDebugLog: ENABLE_DEBUG_LOG,
      checkInterval: CHECK_INTERVAL,
      targetPages: TARGET_PAGES,
    },
    addMapping: function (productionUrl, localUrl) {
      URL_MAPPINGS[productionUrl] = localUrl;
      log(`Added new URL mapping: ${productionUrl} -> ${localUrl}`);
    },
    removeMapping: function (productionUrl) {
      delete URL_MAPPINGS[productionUrl];
      log(`Removed URL mapping: ${productionUrl}`);
    },
    reinitialize: init,
  };
})();

