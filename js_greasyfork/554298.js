// ==UserScript==
// @name        YouTube View Filter
// @description Remove YouTube videos below view threshold (1000 views)
// @version     1.0.0
// @author      trungung
// @match       *://www.youtube.com/*
// @grant       none
// @namespace   https://github.com/trungung/userscripts
// @homepage    https://github.com/trungung/userscripts/tree/main/scripts/youtubeViewFilter
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554298/YouTube%20View%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/554298/YouTube%20View%20Filter.meta.js
// ==/UserScript==

const CONFIG = {
  viewThreshold: 1000, // Minimum view count threshold
  enableLogging: false, // Set to true to enable console logs
  whitelistedChannels: [
    // Add channel names here that should never be filtered
    // Example: "PewDiePie", "MrBeast", "Kurzgesagt"
  ],
};

const logger = {
  prefix: "[YT-FILTER]",
  log: function (message, ...args) {
    if (CONFIG.enableLogging) {
      console.log(`${this.prefix} ${message}`, ...args);
    }
  },
  info: function (message, ...args) {
    if (CONFIG.enableLogging) {
      console.info(`${this.prefix} ℹ️ ${message}`, ...args);
    }
  },
  warn: function (message, ...args) {
    if (CONFIG.enableLogging) {
      console.warn(`${this.prefix} ⚠️ ${message}`, ...args);
    }
  },
  debug: function (message, ...args) {
    if (CONFIG.enableLogging) {
      console.debug(`${this.prefix} 🔍 ${message}`, ...args);
    }
  },
  removed: function (videoTitle, channelName, viewCount) {
    if (CONFIG.enableLogging) {
      console.log(
        `${this.prefix} 🗑️ Removed: "${videoTitle}" by "${channelName}" (${viewCount} views < ${CONFIG.viewThreshold} threshold)`
      );
    }
  },
};

function isChannelWhitelisted(channelName) {
  if (!channelName) return false;
  return CONFIG.whitelistedChannels.some((whitelisted) =>
    channelName.toLowerCase().includes(whitelisted.toLowerCase())
  );
}

function getVideoTitle(videoElement) {
  const titleSelectors = [
    ".yt-lockup-metadata-view-model__title",
    ".shortsLockupViewModelHostMetadataTitle",
    "#video-title",
    'h3 a[href*="/watch"]',
    "a[aria-label]",
  ];

  for (const selector of titleSelectors) {
    const titleElement = videoElement.querySelector(selector);
    if (titleElement) {
      return (
        titleElement.textContent ||
        titleElement.getAttribute("aria-label") ||
        "Unknown Title"
      );
    }
  }
  return "Unknown Title";
}

function getChannelName(videoElement) {
  const channelSelectors = [
    'a[href*="/@"]',
    'a[href*="/channel/"]',
    'a[href*="/c/"]',
    ".yt-core-attributed-string__link",
    ".channel-name",
  ];

  for (const selector of channelSelectors) {
    const channelElement = videoElement.querySelector(selector);
    if (channelElement) {
      const channelText =
        channelElement.textContent || channelElement.innerText;
      if (
        channelText &&
        !channelText.toLowerCase().includes("views") &&
        !channelText.toLowerCase().includes("ago")
      ) {
        return channelText.trim();
      }
    }
  }
  return "Unknown Channel";
}

function parseViewCount(viewText) {
  if (!viewText) return 0;

  // Remove commas and spaces
  const cleanText = viewText.replace(/[,\s]/g, "").toLowerCase();

  // Extract number and multiplier
  const match = cleanText.match(/(\d+(?:\.\d+)?)(k|m|b)?views?/);
  if (!match) return 0;

  const number = parseFloat(match[1]);
  const multiplier = match[2];

  switch (multiplier) {
    case "k":
      return Math.floor(number * 1000);
    case "m":
      return Math.floor(number * 1000000);
    case "b":
      return Math.floor(number * 1000000000);
    default:
      return Math.floor(number);
  }
}

function processVideoElement(video) {
  if (video.dataset.ytFilterProcessed === "true") {
    return;
  }

  // Mark as processed immediately to prevent duplicate processing
  video.dataset.ytFilterProcessed = "true";

  const videoTitle = getVideoTitle(video);
  const channelName = getChannelName(video);

  logger.debug(`Processing: "${videoTitle}" by "${channelName}"`);

  if (isChannelWhitelisted(channelName)) {
    logger.debug(`Skipped (whitelisted): "${channelName}"`);
    return;
  }

  // Find view count in the metadata - different selectors for different video types
  let viewElements;
  if (video.matches("ytm-shorts-lockup-view-model")) {
    viewElements = video.querySelectorAll(
      ".shortsLockupViewModelHostOutsideMetadataSubhead, .yt-core-attributed-string"
    );
  } else if (
    video.matches(
      "ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer"
    )
  ) {
    viewElements = video.querySelectorAll(
      'span[aria-label*="views"], #metadata-line span, .ytd-video-meta-block span'
    );
  } else {
    // Default for ytd-rich-item-renderer and others
    viewElements = video.querySelectorAll(
      ".yt-content-metadata-view-model__metadata-text, .yt-core-attributed-string"
    );
  }

  let viewCount = 0;
  let found = false;

  viewElements.forEach((element) => {
    const text = element.textContent || element.innerText;
    if (text && text.toLowerCase().includes("views")) {
      viewCount = parseViewCount(text);
      found = true;
    }
  });

  if (found && viewCount < CONFIG.viewThreshold) {
    logger.removed(videoTitle, channelName, viewCount);

    // For shorts, hide the parent container
    if (video.matches("ytm-shorts-lockup-view-model")) {
      const parentItem = video.closest("ytd-rich-item-renderer");
      if (parentItem) {
        parentItem.style.display = "none";
      }
    } else {
      video.style.display = "none";
    }
  }
}

function processExistingVideos() {
  logger.info("Processing existing videos...");

  const selectors = [
    "ytd-rich-item-renderer",
    "ytm-shorts-lockup-view-model",
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
  ];

  selectors.forEach((selector) => {
    const videos = document.querySelectorAll(selector);
    videos.forEach((video) => processVideoElement(video));
  });
}

function observeAndFilter() {
  // Initial filter for existing videos
  processExistingVideos();

  logger.info("Starting MutationObserver...");

  // Create observer for dynamic content loading
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself is a video element
            if (
              node.matches &&
              (node.matches("ytd-rich-item-renderer") ||
                node.matches("ytm-shorts-lockup-view-model") ||
                node.matches("ytd-video-renderer") ||
                node.matches("ytd-grid-video-renderer") ||
                node.matches("ytd-compact-video-renderer"))
            ) {
              // Process this specific video immediately
              processVideoElement(node);
            }

            // Also check if the node contains any video elements
            if (node.querySelectorAll) {
              const videoSelectors = [
                "ytd-rich-item-renderer",
                "ytm-shorts-lockup-view-model",
                "ytd-video-renderer",
                "ytd-grid-video-renderer",
                "ytd-compact-video-renderer",
              ];

              videoSelectors.forEach((selector) => {
                const videos = node.querySelectorAll(selector);
                videos.forEach((video) => processVideoElement(video));
              });
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Initialize when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeAndFilter);
} else {
  observeAndFilter();
}

window.addEventListener("yt-navigate-finish", () => {
  logger.info("YouTube navigation detected");
  // Process any new videos that may have appeared after navigation
  setTimeout(processExistingVideos, 1000);
});

logger.log("✅ Loaded - filtering video with config", CONFIG);