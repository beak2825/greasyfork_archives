// ==UserScript==
// @name         Show YouTube Volume % Badge
// @namespace    yt.volbadge.icon
// @version      1.1
// @description  Volume % badge that survives YouTube control re-renders without heavy observers.
// @match        *://*.youtube.com/*
// @match        *://youtu.be/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548950/Show%20YouTube%20Volume%20%25%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/548950/Show%20YouTube%20Volume%20%25%20Badge.meta.js
// ==/UserScript==

(() => {
  const BADGE_CLASS = 'ytp-volbadge';
  const STYLE_ID = 'ytp-volbadge-style';
  const stateByPlayer = new WeakMap();

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .ytp-volume-icon { position: relative !important; }
      .${BADGE_CLASS}{
        position: absolute; top: -2px; right: 2px;
        height: 16px; line-height: 16px; padding: 0 6px;
        border-radius: 10px; background: rgba(0,0,0,.65);
        color: #fff; font-size: 10px; font-family: Roboto, Arial, Helvetica, sans-serif;
        user-select: none; pointer-events: none; white-space: nowrap;
      }`;
    document.head.appendChild(s);
  }

  function getYouTubePlayer() {
    // Get the YouTube player element (movie_player) which has the getVolume() API
    return document.getElementById('movie_player') || null;
  }

  function attachToPlayer(player) {
    injectStyle();
    let st = stateByPlayer.get(player);
    if (!st) { st = {}; stateByPlayer.set(player, st); }

    const video = player.querySelector('video');
    const html5Player = player.closest('.html5-video-player') || player;

    const ensureBadge = () => {
      const icon = html5Player.querySelector('.ytp-volume-icon');
      if (!icon) return null;
      let badge = icon.querySelector('.' + BADGE_CLASS);
      if (!badge) {
        badge = document.createElement('span');
        badge.className = BADGE_CLASS;
        badge.textContent = '--%';
        icon.appendChild(badge);
      }
      st.icon = icon;
      st.badge = badge;
      return badge;
    };

    const compute = () => {
      if (!st.badge || !player) return;
      
      // Use YouTube Player API - the authoritative source for volume
      try {
        const volume = player.getVolume();
        const isMuted = player.isMuted() || volume === 0;
        
        st.badge.textContent = `${isMuted ? 0 : volume}`;
        st.badge.title = isMuted ? 'Muted' : `Volume: ${volume}%`;
      } catch (e) {
        // Fallback if player API not ready yet
        if (video) {
          const videoVol = Math.round(video.volume * 100);
          const muted = video.muted || videoVol === 0;
          st.badge.textContent = `${muted ? 0 : videoVol}`;
          st.badge.title = muted ? 'Muted' : `Volume: ${videoVol}%`;
        }
      }
    };

    // First ensure badge
    ensureBadge();
    compute();

    // Bind once: video events
    if (!st.bound) {
      if (video) {
        // Listen to volumechange event - this fires whenever volume changes
        const volumeChangeHandler = () => compute();
        video.addEventListener('volumechange', volumeChangeHandler, { passive: true });
        video.addEventListener('loadedmetadata', compute, { passive: true });
        video.addEventListener('play', compute, { passive: true });
        video.addEventListener('canplay', compute, { passive: true });
      }
      st.bound = true;
    }

    // Tiny, throttled observer on the player's controls only
    if (!st.controlsObs) {
      const controls = html5Player.querySelector('.ytp-chrome-bottom');
      if (controls) {
        let scheduled = false;
        const scheduleEnsure = () => {
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(() => {
            scheduled = false;
            // If icon or badge got replaced/removed, restore
            ensureBadge();
            compute();
          });
        };
        st.controlsObs = new MutationObserver(scheduleEnsure);
        st.controlsObs.observe(controls, { childList: true, subtree: true });
      }
    }
  }

  function bootstrap() {
    const player = getYouTubePlayer();
    const video = document.querySelector('video');
    if (player && video) {
      attachToPlayer(player);
    }
  }

  // Wait for video and player to exist before attaching
  function checkAndAttach() {
    const player = getYouTubePlayer();
    const video = document.querySelector('video');
    if (player && video) {
      bootstrap();
      observer.disconnect();
    }
  }

  // Start + keep alive across SPA navigations
  const observer = new MutationObserver(checkAndAttach);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Try immediately in case elements already exist
  checkAndAttach();
  
  // Also listen for YouTube navigation events
  window.addEventListener('yt-navigate-finish', () => {
    observer.disconnect();
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    setTimeout(checkAndAttach, 150);
  }, { passive: true });
})();
