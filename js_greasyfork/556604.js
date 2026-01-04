// ==UserScript==
// @name        Ranked Streams V2 (Grid & Sync Fix - Bottom)
// @namespace   Violentmonkey Scripts
// @match       *://*.mcsrranked.com/*
// @grant       GM_addStyle
// @version     1.0
// @run-at      document-idle
// @description Adds synced streams natively in MCSR Ranked at the bottom, supports split-screen grid and relative instant seeking.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/556604/Ranked%20Streams%20V2%20%28Grid%20%20Sync%20Fix%20-%20Bottom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556604/Ranked%20Streams%20V2%20%28Grid%20%20Sync%20Fix%20-%20Bottom%29.meta.js
// ==/UserScript==

(function () {
  // Configuration
  const TWITCH_EMBED_URL = "https://player.twitch.tv/js/embed/v1.js";
  const CONTAINER_SELECTOR = "div.min-h-64.flex-1.overflow-scroll.pt-2";
  const LINK_SELECTOR =
    'a[href^="https://www.twitch.tv/videos"][target="_blank"]';
  const BUTTON_SELECTOR =
    "button.cursor-pointer.border.px-2.py-1\\.5, div.cursor-pointer.border.px-2.py-1\\.5";

  // Declare basic variables
  let activePlayers = {}; // Map: videoId -> Twitch.Player instance
  let videoStartTimes = {}; // Map: videoId -> int (Earliest timestamp found for this video)
  let debounceTimer = null;

  // Add CSS for the streams grid layout
  // Bad styling
  const style = document.createElement("style");
  style.textContent = `
    #twitch-grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 8px;
      width: 100%;
    }
    .twitch-stream-wrapper {
      position: relative;
      width: 100%;
      padding-top: 43.75%; /* 16:7 Aspect Ratio */
      background: #000;
      border-radius: 8px;
      overflow: hidden;
    }
    .twitch-stream-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `;
  document.head.appendChild(style);

  // --- Helpers ---
  // Parse the twitch url
  function parseTwitchUrl(url) {
    const match = /videos\/(\d+)(?:\?t=(\d+)s)?/.exec(url);
    if (match) {
      return {
        videoId: match[1],
        time: match[2] ? parseInt(match[2]) : 0,
      };
    }
    return null;
  }

  // Load the script required for playback from twitch
  function loadTwitchAPI(callback) {
    const script = document.createElement("script");
    script.id = "twitch-api-script";
    script.src = TWITCH_EMBED_URL;
    script.onload = callback;
    document.body.appendChild(script);
  }

  // --- Core Logic ---

  function initStreams() {
    const container = document.querySelector(CONTAINER_SELECTOR);
    const links = document.querySelectorAll(LINK_SELECTOR);

    if (!container || links.length === 0) return;

    // Prevent double injection
    if (document.getElementById("twitch-grid-container")) return;

    console.log("[Ranked Streams] Match detected. Initializing...");

    // 1. Identify Start Times (The "Zero Point" for each stream)
    videoStartTimes = {};
    const uniqueVideos = new Set();

    links.forEach((link) => {
      const data = parseTwitchUrl(link.href);
      if (data) {
        uniqueVideos.add(data.videoId);
        // We assume the earliest timestamp found for a video ID is the "Match Start"
        if (
          typeof videoStartTimes[data.videoId] === "undefined" ||
          data.time < videoStartTimes[data.videoId]
        ) {
          videoStartTimes[data.videoId] = data.time;
        }
      }
    });

    // 2. Setup / Add Grid Container
    const gridDiv = document.createElement("div");
    gridDiv.id = "twitch-grid-container";
    container.appendChild(gridDiv);

    activePlayers = {}; // Reset Twitch Players

    // 3. Create Players

    uniqueVideos.forEach((videoId) => {
      const startTime = videoStartTimes[videoId] || 0;
      const wrapper = document.createElement("div");
      wrapper.className = "twitch-stream-wrapper";
      const playerDivId = `twitch-embed-${videoId}`;
      const playerDiv = document.createElement("div");
      playerDiv.id = playerDivId;
      wrapper.appendChild(playerDiv);
      gridDiv.appendChild(wrapper);

      const player = new Twitch.Player(playerDivId, {
        video: videoId,
        time: `${startTime}s`,
        autoplay: true,
        muted: true,
        controls: true,
        width: "100%",
        controls: false,
        height: "100%",
        parent: ["mcsrranked.com"],
      });

      activePlayers[videoId] = player;
    });

    // 4. Intercept Timeline Clicks
    addButtonEventListeners();
    addLinkEventListeners();
  }

  // 5. Start observing for changes to grid
  function startObserver() {
    const observer = new MutationObserver(() => {
      const container = document.querySelector(CONTAINER_SELECTOR);
      const grid = document.getElementById("twitch-grid-container");

      if (container && !grid) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(initStreams, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(initStreams, 1000);
  }

  // 6. Listen for changes in splits and detail level and reload streams.
  function addButtonEventListeners() {
    const buttons = document.querySelectorAll(BUTTON_SELECTOR);
    console.log(buttons);
    buttons.forEach((button) => {
      button.addEventListener("click", addLinkEventListeners);
    });
  }

  // Add link click listeners which take you that point in stream
  function addLinkEventListeners() {
    const links = document.querySelectorAll(LINK_SELECTOR);
    links.forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = parseTwitchUrl(newLink.href);
        if (!data) return;

        // Calculate Offset
        const originBaseTime = videoStartTimes[data.videoId];
        if (originBaseTime === undefined) return;

        const matchOffset = data.time - originBaseTime;
        console.log(`[Ranked] Syncing to Match Time +${matchOffset}s`);

        // Apply Offset to all players
        Object.keys(activePlayers).forEach((targetVideoId) => {
          const targetBaseTime = videoStartTimes[targetVideoId];
          // 1 second so it starts correctly
          const targetSeekTime = targetBaseTime + matchOffset - 1;
          activePlayers[targetVideoId].seek(Math.max(0, targetSeekTime));
        });
      });
    });
  }

  // Start script
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      loadTwitchAPI(startObserver),
    );
  } else {
    loadTwitchAPI(startObserver);
  }
})();
