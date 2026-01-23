// ==UserScript==
// @name        Youtube hide watched videos
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/feed/subscriptions*
// @grant       none
// @version     1.1
// @author      -
// @description 1/20/2026, 9:33:24 PM
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/563597/Youtube%20hide%20watched%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/563597/Youtube%20hide%20watched%20videos.meta.js
// ==/UserScript==

async function sleep(durationMs) {
  return await new Promise(resolve => setTimeout(resolve, durationMs));
}

async function waitForVideoThumbnails() {
  while (true) {
    console.log("Querying for video thumbnails...");
    const videoThumbnail = document.querySelector("yt-thumbnail-view-model");
    if (videoThumbnail) return;
    await sleep(200);
  }
}

async function run() {
  console.log("Starting wait loop for grid of video cards...");
  await waitForVideoThumbnails();
  const progressBars = document.querySelectorAll("yt-thumbnail-overlay-progress-bar-view-model");
  if (progressBars.length === 0) return;
  progressBars.forEach(pbar => {
    const parentVideoCard = pbar.closest("ytd-rich-item-renderer");
    parentVideoCard.hidden = true;
  });
}

run();
