// ==UserScript==
// @name        View streams
// @namespace   Violentmonkey Scripts
// @match       *://mcsrranked.com/**
// @grant       none
// @version     1.0
// @license     MIT
// @description View MCSR Ranked Vods
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/555258/View%20streams.user.js
// @updateURL https://update.greasyfork.org/scripts/555258/View%20streams.meta.js
// ==/UserScript==

(function () {
  const TWITCH_EMBED_URL = "https://player.twitch.tv/js/embed/v1.js";
  let player = null;

  function loadTwitchAPI(callback) {
    if (window.Twitch) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src = TWITCH_EMBED_URL;
      script.onload = callback;
      document.body.appendChild(script);
    }
  }

  function createTwitchPlayer(videoId, time) {
    const container = document.querySelector(
      "div.min-h-64.flex-1.overflow-scroll.pt-2"
    );
    if (!container) return;

    // Remove existing player if any
    const existing = document.getElementById("twitch-embed");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.id = "twitch-embed";
    div.style.minWidth = "100%";
    container.appendChild(div);

    player = new Twitch.Player("twitch-embed", {
      video: videoId,
      time: `${time}s`,
      autoplay: true,
      parent: ["mcsrranked.com"],
    });

    const iframe = document.querySelector("#twitch-embed iframe");
    iframe.style.width = "100%";
    iframe.style.aspectRatio = "16 / 7";
  }

  function createIFrame() {
    const links = document.querySelectorAll(
      'a[href^="https://www.twitch.tv/videos"][target="_blank"]'
    );
    if (links.length === 0) return;

    loadTwitchAPI(() => {
      console.log("Twitch API loaded");
      const twitchVideoRegex = /videos\/(\d+)\?t=(\d+)s/;
      const firstMatch = twitchVideoRegex.exec(links[0].href);
      if (!firstMatch) return;

      createTwitchPlayer(firstMatch[1], firstMatch[2]);

      // Listen for click events
      for (const link of links) {
        link.addEventListener("click", e => {
          e.preventDefault();
          const match = twitchVideoRegex.exec(e.target.href);
          if (!match) return;
          const videoId = match[1];
          const time = parseInt(match[2]);

          if (player && player.getVideo() === videoId) {
            // ✅ Seek to time without reloading
            player.seek(time);
          } else {
            // Load a new video
            createTwitchPlayer(videoId, time);
          }
        });
      }
    });
    document.querySelectorAll("div.cursor-pointer").forEach(button => {
      button.addEventListener("click", () => {
        console.log("button click");
        createIFrame();
      });
    });

    document
      .querySelectorAll("button.cursor-pointer.min-w-8")
      .forEach(button => {
        button.addEventListener("click", () => {
          console.log("button click");
          createIFrame();
        });
      });
  }

  function createObserver() {
    let lastUrl = location.href;
    createIFrame();
    setInterval(function () {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl && location.pathname.startsWith("/stats")) {
        lastUrl = currentUrl;
        createIFrame();
      }
    }, 200);
  }

  setTimeout(createObserver, 1000);
})();
