// ==UserScript==
// @name         YT Adblocker
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  Skips video-ads
// @author       Cepoglazik
// @license      MIT
// @match *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559392/YT%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/559392/YT%20Adblocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeAllAds() {
      const ytdRichItemRendererElements = document.querySelectorAll("ytd-rich-item-renderer");
      ytdRichItemRendererElements.forEach(ytd => {
        if (ytd.querySelector(".yt-badge-shape__text")) {
          if (ytd.querySelector(".yt-badge-shape__text").textContent === "Реклама") {
            ytd.remove();
            console.log("Was deleted:", ytd);
          }
        }
      });
  }

  const h4bjkgfbkje = setInterval(() => {
    removeAllAds();
  }, 1000);

  const njktynh = setInterval(() => {
    if (document.querySelectorAll(".ytp-ad-player-overlay-layout").length > 0) {
      const videoElement = document.querySelector("video");
      const videoDuration = Math.floor(videoElement.duration);
      videoElement.currentTime = videoDuration;
      const skipButton = document.querySelector(".ytp-skip-ad-button");
      if (videoElement.paused) {
        videoElement.play();
      }
      console.log("Skipped ad");
    }
  }, 750);

  window.addEventListener("resize", () => {
    setTimeout(() => {
      removeAllAds();
    }, 200);
  });
})();