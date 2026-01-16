// ==UserScript==
// @name         YouTube Rotate & Zoom (R / Z / X)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  R = rotate 90°, Z = zoom +5%, X = reset
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562808/YouTube%20Rotate%20%20Zoom%20%28R%20%20Z%20%20X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562808/YouTube%20Rotate%20%20Zoom%20%28R%20%20Z%20%20X%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const ZOOM_STEP = 0.05;
  const ROTATE_STEP = 90;

  let rotation = 0;
  let scale = 1;

  function getVideo() {
    return document.querySelector('video.html5-main-video');
  }

  function applyTransform(video) {
    if (!video) return;
    video.style.transformOrigin = 'center center';
    video.style.transition = 'transform 0.15s ease-out';
    video.style.transform = `rotate(${rotation}deg) scale(${scale})`;

    const player = video.closest('.html5-video-player');
    if (player) {
      player.style.overflow = 'hidden';
    }
  }

  function rotateVideo() {
    const video = getVideo();
    if (!video) return;
    rotation = (rotation + ROTATE_STEP) % 360;
    applyTransform(video);
  }

  function zoomVideo() {
    const video = getVideo();
    if (!video) return;
    scale = +(scale + ZOOM_STEP).toFixed(3);
    if (scale > 5) scale = 5;
    applyTransform(video);
  }

  function resetVideo() {
    const video = getVideo();
    if (!video) return;
    rotation = 0;
    scale = 1;
    applyTransform(video);
  }

  document.addEventListener('keydown', (e) => {
    //.
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) {
      return;
    }

    if (e.key === 'r' || e.key === 'R') {
      rotateVideo();
    } else if (e.key === 'z' || e.key === 'Z') {
      zoomVideo();
    } else if (e.key === 'x' || e.key === 'X') {
      resetVideo();
    }
  });

})();