// ==UserScript==
// @name        [Fixed Sept 2025] YouTube Grey-out Seen Videos (Fixed 2025)
// @namespace   https://jacobbundgaard.dk
// @version     1.3
// @description Greys out seen videos in the YouTube watch next sidebar, subscriptions page and elsewhere. Original: https://greasyfork.org/en/scripts/381500-youtube-grey-out-seen-videos
// @match       https://www.youtube.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548098/%5BFixed%20Sept%202025%5D%20YouTube%20Grey-out%20Seen%20Videos%20%28Fixed%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548098/%5BFixed%20Sept%202025%5D%20YouTube%20Grey-out%20Seen%20Videos%20%28Fixed%202025%29.meta.js
// ==/UserScript==

(function() {
  function markWatchedVideos() {
    
    const classicSegments = document.querySelectorAll(
      ".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment[style*='width: 100%']"
    );

    
    const resumeSegments = document.querySelectorAll(
      "ytd-thumbnail-overlay-resume-playback-renderer #progress[style*='width: 100%']"
    );

    const allSegments = [...classicSegments, ...resumeSegments];

    allSegments.forEach(segment => {
      const thumbnail = segment.closest(
        "ytd-thumbnail, a, ytd-rich-item-renderer, ytd-compact-video-renderer"
      );
      if (thumbnail && thumbnail.style.opacity !== "0.2") {
        thumbnail.style.opacity = "0.2";
        console.log("✔ Marked as watched:", thumbnail);
      }
    });
  }

  // Run once at start
  markWatchedVideos();

  // Observe for dynamically loaded videos
  const observer = new MutationObserver(markWatchedVideos);
  observer.observe(document.body, { childList: true, subtree: true });
})();
