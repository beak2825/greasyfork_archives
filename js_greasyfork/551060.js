// ==UserScript==
// @name         YouTube Shorts Enhancer
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  AutoScroll + Force Shorts always play at 1080p
// @author       Thnh01
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @run-at       document-start
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/551060/YouTube%20Shorts%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/551060/YouTube%20Shorts%20Enhancer.meta.js
// ==/UserScript==

(async () => {
  const i18n = {
    autoScroll: "AutoScroll",
    force1080p: "Force 1080p",
    on: "ON",
    off: "OFF",
  };

  // ===== Load state =====
  let autoScrollEnabled = await GM.getValue("autoScrollEnabled");
  if (autoScrollEnabled === void 0) {
    autoScrollEnabled = true;
    GM.setValue("autoScrollEnabled", autoScrollEnabled);
  }

  let force1080pEnabled = await GM.getValue("force1080pEnabled");
  if (force1080pEnabled === void 0) {
    force1080pEnabled = true;
    GM.setValue("force1080pEnabled", force1080pEnabled);
  }

  // ===== Menu =====
  GM.registerMenuCommand(
    `${i18n.autoScroll}: ${autoScrollEnabled ? i18n.on : i18n.off}`,
    () => {
      autoScrollEnabled = !autoScrollEnabled;
      GM.setValue("autoScrollEnabled", autoScrollEnabled).then(() => location.reload());
    }
  );

  GM.registerMenuCommand(
    `${i18n.force1080p}: ${force1080pEnabled ? i18n.on : i18n.off}`,
    () => {
      force1080pEnabled = !force1080pEnabled;
      GM.setValue("force1080pEnabled", force1080pEnabled).then(() => location.reload());
    }
  );

  if (!autoScrollEnabled && !force1080pEnabled) return;

  // ================== AutoScroll logic ==================
  function navigationButtonDown() {
    document.querySelector("#navigation-button-down button")?.click();
  }

  async function updateVidElem(video) {
    if (!autoScrollEnabled) return;
    const reel = document.querySelector("ytd-reel-video-renderer[is-active]");
    if (reel === null) return;

    video.removeAttribute("loop");
    video.removeEventListener("ended", navigationButtonDown);
    video.addEventListener("ended", navigationButtonDown);
  }

  // ================== Force 1080p logic ==================
  function forceQuality1080p() {
    if (!force1080pEnabled) return;
    if (!location.href.includes("/shorts/")) return;
    const ytPlayer = document.querySelector("ytd-player")?.player_;
    if (ytPlayer && ytPlayer.setPlaybackQualityRange) {
      ytPlayer.setPlaybackQualityRange("hd1080", "hd1080");
      ytPlayer.setPlaybackQuality("hd1080");
    }
  }

  // ================== Main loop ==================
  function updateVidElemWithRAF(video) {
    try {
      if (currentUrl?.includes("youtube.com/shorts")) {
        updateVidElem(video);
        forceQuality1080p(video);
      }
    } catch (e) {
      console.error(e);
    }
    requestAnimationFrame(() => updateVidElemWithRAF(video));
  }

  // ================== Observer & Init ==================
  const once = (fn) => {
    let done = false;
    let result;
    return async (...args) => {
      if (done) return result;
      done = true;
      result = await fn(...args);
      return result;
    };
  };

  const initialize = once(async () => {
    const observer = new MutationObserver(
      async (mutations, shortsReady = false, videoPlayerReady = false) => {
        outer: for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (!shortsReady) {
              shortsReady = node.tagName === "YTD-SHORTS";
            }
            if (!videoPlayerReady) {
              videoPlayerReady =
                typeof node.className === "string" &&
                node.className.includes("html5-main-video");
            }
            if (shortsReady && videoPlayerReady) {
              observer.disconnect();
              const video = node;
              updateVidElemWithRAF(video);
              break outer;
            }
          }
        }
      }
    );
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });

  let currentUrl = "";
  const urlChange = (event) => {
    const destinationUrl = event?.destination?.url || "";
    if (destinationUrl.startsWith("about:blank")) return;
    const href = destinationUrl || location.href;
    if (href.includes("youtube.com/shorts")) {
      currentUrl = href;
      initialize();
    }
  };
  urlChange();

  unsafeWindow?.navigation?.addEventListener("navigate", urlChange);
  unsafeWindow.addEventListener("replaceState", urlChange);
  unsafeWindow.addEventListener("pushState", urlChange);
  unsafeWindow.addEventListener("popState", urlChange);
  unsafeWindow.addEventListener("hashchange", urlChange);
})();
