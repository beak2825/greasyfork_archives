// ==UserScript==
// @name         BBB Playback Controls+ (FINKI)
// @namespace    sj14apps.bbb.playerplus
// @version      1.1.1
// @description  Enhance BigBlueButton recording playback with extra controls
// @author       SlaVcE14
// @license      MIT
// @match        https://bbb-lb.finki.ukim.mk/playback/presentation/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548273/BBB%20Playback%20Controls%2B%20%28FINKI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548273/BBB%20Playback%20Controls%2B%20%28FINKI%29.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const SPEED_KEY = "bbb_playerplus_speed";

  // Utility: get & set preferred speed
  const getSavedSpeed = () => {
    try { return parseFloat(localStorage.getItem(SPEED_KEY)) || 1.0; } catch { return 1.0; }
  };
  const saveSpeed = (v) => { try { localStorage.setItem(SPEED_KEY, String(v)); } catch {} };

  const seen = new WeakSet();
  function upgradeVideo(video) {
    if (!video || seen.has(video)) return;
    seen.add(video);

    // Start with saved speed
    const initialSpeed = getSavedSpeed();
    if (!Number.isNaN(initialSpeed) && initialSpeed > 0) video.playbackRate = initialSpeed;

    // Helpers
    const setSpeed = (val) => {
      const v = Math.max(0.25, Math.min(3.0, val));
      video.playbackRate = v;
      saveSpeed(v);
    };

    // Keyboard shortcuts
    document.addEventListener("keydown", (ev) => {
      // Ignore if typing in inputs
      const t = ev.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      switch (ev.key.toLowerCase()) {
        case "k":
        case " ":
          ev.preventDefault();
          video.paused ? video.play().catch(()=>{}) : video.pause();
          break;
        case "j":
        case "arrowleft":
          ev.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "l":
        case "arrowright":
          ev.preventDefault();
          video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
          break;
        case "[":
          ev.preventDefault();
          setSpeed(video.playbackRate - 0.25);
          break;
        case "]":
          ev.preventDefault();
          setSpeed(video.playbackRate + 0.25);
          break;
        case "m":
          ev.preventDefault();
          video.muted = !video.muted;
          break;
      }
    }, { passive: false });
  }

  // Find videos in main document and same-origin iframes
  function scan(root) {
    root.querySelectorAll("video").forEach(upgradeVideo);
    root.querySelectorAll("iframe").forEach((ifr) => {
      try {
        if (ifr.contentDocument) scan(ifr.contentDocument);
      } catch {}
    });
  }

  // Initial + observe changes
  scan(document);
  const mo = new MutationObserver(() => scan(document));
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
