// ==UserScript==
// @name         Keep playing Instagram Reels in the background
// @namespace    cougar16
// @version      1.6
// @description  Keep playing Instagram reels in the background & Prevent them from pausing when switching to another tab.
// @match        https://www.instagram.com/
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?domain=instagram.com&sz=32
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549068/Keep%20playing%20Instagram%20Reels%20in%20the%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/549068/Keep%20playing%20Instagram%20Reels%20in%20the%20background.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function keepPlaying(video) {
    if (video._patched) return;
    video._patched = true;

    const originalPause = video.pause;
    const originalPlay = video.play;

    video.pause = function () {
      if (document.hidden) return;
      return originalPause.call(this);
    };

    video.addEventListener('play', () => {
      document.querySelectorAll('video').forEach(v => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });
    });

    video.play = function () {
      return originalPlay.call(this);
    };
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'VIDEO') {
          keepPlaying(node);
        } else if (node.querySelectorAll) {
          node.querySelectorAll('video').forEach(keepPlaying);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('video').forEach(keepPlaying);

})();