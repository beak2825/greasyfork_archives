// ==UserScript==
// @name         YouTube Focus Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.5.2
// @description  Hides comments and recommendations until you watch a configurable percentage of the video without skipping; automatically pauses when the player moves out of view, switches between tabs, or clicks away, and automatically resumes the video when you return.
// @author       Choudhary
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550595/YouTube%20Focus%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/550595/YouTube%20Focus%20Enhancer.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /********** CONFIGURATION **********/
  const config = {
    requiredPercentToUnlockComments: 50, // TEST: set to 100 to reproduce playlist-end behavior; set to 50 normally
    seekToleranceSeconds: 2,
    intersectionVisibilityThreshold: 0.5,
    smoothRevealMs: 350,
    // how many seconds before end to attempt pause (base). we will use a margin to attempt earlier
    pauseAtEndPlaylistTolerance: 0.8,
    // extra safety margin (seconds) to attempt earlier than tolerance to beat autoplay
    pauseMarginSeconds: 0.55,
    // frequently poll remaining time when guarding the end (small => more aggressive)
    endMonitorIntervalMs: 40,
    // after calling pause, how long (ms) we'll wait and re-check success (total timeout)
    pauseConfirmTimeoutMs: 900,
    // period to try re-attaching to video when initializing
    initRetryIntervalMs: 500,
    verbose: false
  };

  /********** UTILITIES **********/
  const INSTANCE_ID = Math.random().toString(36).slice(2, 9);
  const log = (...args) => { if (config.verbose) console.debug(`[YT-SMART ${INSTANCE_ID}]`, ...args); };
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  /********** CSS inject (once) **********/
  function ensureCSS() {
    if (document.head.querySelector('style[data-yt-smart]')) return;
    const css = `
    ytd-comments#comments, ytd-item-section-renderer#related, ytd-watch-next-secondary-results-renderer {
      transition: opacity ${config.smoothRevealMs}ms ease, max-height ${config.smoothRevealMs}ms ease;
    }
    .tm-hide-comments { opacity: 0 !important; max-height: 0 !important; overflow: hidden !important; pointer-events: none !important; }
    .tm-hide-related { opacity: 0 !important; max-height: 0 !important; overflow: hidden !important; pointer-events: none !important; }
    .tm-show-comments { opacity: 1 !important; max-height: 2000px !important; pointer-events: auto !important; }`;
    const s = document.createElement('style');
    s.setAttribute('data-yt-smart', INSTANCE_ID);
    s.textContent = css;
    document.head.appendChild(s);
    log('CSS injected');
  }

  /********** MAIN CLASS (per-tab instance) **********/
  class YTGuard {
    constructor() {
      this.playerVideo = null;
      this.videoWrapper = null;
      this.currentWatchId = null;
      this.watchingState = null;

      // sets to avoid carryover and to ensure id-based ops
      this.unlockedVideoIds = new Set();        // video IDs that were unlocked in this tab
      this.pausedAtEndForIds = new Set();       // video IDs for which we already did end-pause handling

      this.endMonitorInterval = null;           // interval id used for end-monitor
      this.mutationObserver = null;
      this.intersectionObserver = null;

      this.bound = {};
      this.lastUrl = location.href;
      this.urlPoller = null;
      this.initialized = false;
      this.destroyed = false;

      // flag set if navigation started (yt-navigate-start detected)
      this._navigationStarted = false;

      // NEW: Flag to prevent auto-resume when we've paused at the end
      this._pausedAtEnd = false;

      log('constructor');
      this.setup();
    }

    setup() {
      ensureCSS();

      // Clean previous instance in same tab
      if (window.__ytSmartInstance && !window.__ytSmartInstance.destroyed) {
        window.__ytSmartInstance.destroy();
      }
      window.__ytSmartInstance = this;

      // bind handlers with stable references
      this.bound.visibility = this.onVisibilityChange.bind(this);
      this.bound.focus = this.onWindowFocus.bind(this);
      this.bound.blur = this.onWindowBlur.bind(this);
      this.bound.pageshow = this.onPageShow.bind(this);
      this.bound.mutation = this.onBodyMutations.bind(this);
      this.bound.popstate = this.onHistoryChange.bind(this);
      this.bound.pointer = this.onMouseMove.bind(this);
      this.bound.click = this.onDocumentClick.bind(this);
      this.bound.ytNavStart = this.onYouTubeNavigateStart.bind(this);

      // global listeners
      document.addEventListener('visibilitychange', this.bound.visibility, true);
      window.addEventListener('focus', this.bound.focus, true);
      window.addEventListener('blur', this.bound.blur, true);
      window.addEventListener('pageshow', this.bound.pageshow);
      window.addEventListener('popstate', this.bound.popstate);
      document.addEventListener('mousemove', this.bound.pointer, { passive: true });
      document.addEventListener('click', this.bound.click, true);

      // Listen for YouTube SPA navigation start event if available
      window.addEventListener('yt-navigate-start', this.bound.ytNavStart, true);
      // Also listen to our injected 'yt-smart-history' via history patch
      this.patchHistory();

      // MutationObserver for dynamic content
      this.mutationObserver = new MutationObserver(this.bound.mutation);
      try {
        this.mutationObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });
      } catch (e) { /* ignore */ }

      // Poll URL as backup for SPA changes
      this.urlPoller = setInterval(() => {
        if (location.href !== this.lastUrl) {
          log('URL change (poller)', this.lastUrl, '->', location.href);
          this.lastUrl = location.href;
          this.onUrlChange();
        }
      }, config.initRetryIntervalMs);

      // initial attach attempts
      this.tryAttachLoop();
    }

    patchHistory() {
      try {
        const push = history.pushState;
        const replace = history.replaceState;
        history.pushState = function () {
          const r = push.apply(this, arguments);
          window.dispatchEvent(new Event('yt-smart-history'));
          return r;
        };
        history.replaceState = function () {
          const r = replace.apply(this, arguments);
          window.dispatchEvent(new Event('yt-smart-history'));
          return r;
        };
        window.addEventListener('yt-smart-history', () => {
          log('history API change -> onUrlChange');
          this.onUrlChange();
        });
      } catch (e) {
        log('history patch failed', e);
      }
    }

    async tryAttachLoop() {
      for (let i = 0; !this.initialized && i < 120 && !this.destroyed; i++) {
        try {
          const v = this.findVideoElement();
          if (v) {
            log('found <video>');
            this.initForVideo(v);
            break;
          }
        } catch (e) { /* ignore */ }
        await sleep(config.initRetryIntervalMs);
      }
    }

    findVideoElement() {
      return document.querySelector('video.html5-main-video, video.video-stream, #movie_player video');
    }

    onBodyMutations() {
      if (this.destroyed) return;
      const v = this.findVideoElement();
      if (v && (!this.playerVideo || this.playerVideo !== v)) {
        log('MutationObserver -> new video element');
        this.initForVideo(v);
      }
      this.tryAttachHideClasses();
    }

    onHistoryChange() {
      if (this.destroyed) return;
      log('history popstate -> onUrlChange');
      this.onUrlChange();
    }

    onYouTubeNavigateStart() {
      // YouTube SPA emits this at the start of navigation in many builds
      log('yt-navigate-start detected');
      this._navigationStarted = true;

      // NEW: Clear unlockedVideoIds when navigation starts to prevent carry-over
      this.unlockedVideoIds.clear();
      log('cleared unlockedVideoIds due to navigation start');
    }

    onUrlChange() {
      log('onUrlChange invoked');
      // reset transient state & listeners for previous video
      this.cleanupVideoListeners();
      this.playerVideo = null;
      this.videoWrapper = null;
      this.currentWatchId = null;
      this.watchingState = null;
      this._navigationStarted = false;
      this._pausedAtEnd = false; // NEW: Reset end-pause flag
      this._stopEndMonitor();
      this.initialized = false;

      // NEW: Don't clear unlockedVideoIds here - only clear on navigation start
      // This allows same-page video changes to maintain unlock state

      // reattach cleanly
      this.tryAttachLoop();
      this.tryAttachHideClasses();
    }

    onPageShow() { log('pageshow'); this.tryAttachLoop(); }
    onWindowFocus() { log('window focus'); this.tryAttachLoop(); if (this.playerVideo) this.resumeIfAllowed('window:focus'); }
    onWindowBlur() { log('window blur'); if (this.playerVideo) this.pauseByScript('window:blur'); }
    onVisibilityChange() {
      if (document.hidden) { if (this.playerVideo) this.pauseByScript('visibility:hidden'); }
      else {
        if (this.playerVideo) {
          // NEW: Don't resume if we're paused at the end
          if (this._pausedAtEnd) {
            log('visibility change: ignoring resume because paused at end');
            return;
          }
          this.resumeIfAllowed('visibility:visible');
        }
      }
    }

    tryAttachHideClasses() {
      const comments = document.querySelector('ytd-comments#comments');
      if (comments && !comments.classList.contains('tm-show-comments') && !comments.classList.contains('tm-hide-comments')) {
        comments.classList.add('tm-hide-comments');
        log('comments hidden initially');
      }
      const related = document.querySelector('ytd-watch-next-secondary-results-renderer, ytd-item-section-renderer#related');
      if (related && !related.classList.contains('tm-hide-related')) {
        related.classList.add('tm-hide-related');
        log('sidebar hidden initially');
      }
    }

    initForVideo(videoEl) {
      if (this.destroyed) return;
      if (!videoEl) return;

      // if the same element is still attached and already initialized, skip
      if (this.playerVideo === videoEl && this.initialized) {
        log('initForVideo: already attached');
        return;
      }

      this.cleanupVideoListeners();

      this.playerVideo = videoEl;
      this.videoWrapper = document.querySelector('.html5-video-player') || document.querySelector('#movie_player') || (this.playerVideo ? this.playerVideo.closest('.html5-video-player') : null);
      this.currentWatchId = this.getVideoIdFromUrl() || `${Date.now()}`;

      // reset transient counters (prevents carryover)
      this.resetWatchingState();

      // NEW: Only reveal comments if this video was unlocked in THIS SESSION
      // and we're not in a playlist context where we want fresh start
      if (this.unlockedVideoIds.has(this.currentWatchId)) {
        log('this video was unlocked previously in this tab -> revealing now if same id');
        this._revealCommentsNowIfCurrent(this.currentWatchId);
      } else {
        // NEW: Ensure comments are hidden for new videos in playlist
        this._hideCommentsNow();
        log('new video detected, comments hidden');
      }

      // bind stable handlers for removal later
      this.bound.timeupdate = this.onTimeUpdate.bind(this);
      this.bound.seeking = this.onSeeking.bind(this);
      this.bound.seeked = this.onSeeked.bind(this);
      this.bound.pause = this.onPauseEvent.bind(this);
      this.bound.play = this.onPlayEvent.bind(this);
      this.bound.ended = this.onEndedEvent.bind(this);

      this.playerVideo.addEventListener('timeupdate', this.bound.timeupdate);
      this.playerVideo.addEventListener('seeking', this.bound.seeking);
      this.playerVideo.addEventListener('seeked', this.bound.seeked);
      this.playerVideo.addEventListener('pause', this.bound.pause);
      this.playerVideo.addEventListener('play', this.bound.play);
      this.playerVideo.addEventListener('ended', this.bound.ended);

      this.setupIntersectionObserver();

      this.initialized = true;
      log('initForVideo complete, videoId:', this.currentWatchId);

      // if playlist + requires ~100%, start aggressive end monitor to attempt pause before autoplay
      if (this.isPlaylistActive() && config.requiredPercentToUnlockComments >= 99.5) {
        this._startEndMonitor(this.currentWatchId);
      } else {
        this._stopEndMonitor();
      }

      this.tryAttachHideClasses();
    }

    resetWatchingState() {
      this.watchingState = {
        organic: true,
        watchedOrganicSeconds: 0,
        lastTimeSeen: this.playerVideo ? this.playerVideo.currentTime : 0,
        lastReportedCurrentTime: this.playerVideo ? this.playerVideo.currentTime : 0,
        lastSeekedFrom: null,
        unlocked: false,
        autoPausedByScript: false,
        userPaused: false
      };
    }

    getVideoIdFromUrl() {
      const m = location.search.match(/[?&]v=([^&]+)/);
      return m ? decodeURIComponent(m[1]) : null;
    }

    /******** time / seek handlers ********/
    onTimeUpdate() {
      if (!this.playerVideo || this.destroyed) return;
      const t = this.playerVideo.currentTime;
      const d = this.playerVideo.duration || 0;
      const last = this.watchingState.lastReportedCurrentTime || t;

      if (t >= last && !this.playerVideo.seeking) {
        const delta = t - last;
        if (this.watchingState.organic && delta > 0 && delta < 10) {
          this.watchingState.watchedOrganicSeconds += delta;
        }
        this.watchingState.lastReportedCurrentTime = t;
        this.watchingState.lastTimeSeen = t;
      } else {
        this.watchingState.lastReportedCurrentTime = t;
        this.watchingState.lastTimeSeen = t;
      }

      // Normal unlock logic (for non-100% or early unlock)
      this.tryUnlockCommentsIfEligible(d);
      // End monitor handles playlist+100% aggressively; no extra here
    }

    onSeeking() {
      if (!this.playerVideo) return;
      this.watchingState.lastSeekedFrom = this.watchingState.lastReportedCurrentTime || this.playerVideo.currentTime;
      log('seeking from', this.watchingState.lastSeekedFrom);
    }

    onSeeked() {
      if (!this.playerVideo) return;
      const from = this.watchingState.lastSeekedFrom != null ? this.watchingState.lastSeekedFrom : this.watchingState.lastReportedCurrentTime;
      const to = this.playerVideo.currentTime;
      const delta = to - from;
      log('seeked', { from, to, delta });
      if (delta > config.seekToleranceSeconds) {
        this.watchingState.organic = false;
        this.watchingState.watchedOrganicSeconds = 0;
        log('forward skip detected -> organic=false');
      } else {
        log('small/backwards seek allowed');
      }
      this.watchingState.lastReportedCurrentTime = to;
      this.watchingState.lastSeekedFrom = null;
    }

    tryUnlockCommentsIfEligible(duration) {
      if (!this.playerVideo) return;
      if (!duration || !isFinite(duration) || duration <= 0) return;

      const requiredSeconds = (config.requiredPercentToUnlockComments / 100) * duration;
      const watched = this.watchingState.watchedOrganicSeconds;

      log('tryUnlockCommentsIfEligible', {watched, requiredSeconds, organic: this.watchingState.organic});

      if (watched >= requiredSeconds && this.watchingState.organic) {
        const vid = this.currentWatchId || this.getVideoIdFromUrl();
        if (!vid) return;
        // mark unlocked at id-level to avoid carry-over
        this.unlockedVideoIds.add(vid);
        this.watchingState.unlocked = true;
        // reveal now only if still on same id
        this._revealCommentsNowIfCurrent(vid);
        log('marked unlocked for id', vid);
      }
    }

    _revealCommentsNowIfCurrent(videoId) {
      const cur = this.getVideoIdFromUrl();
      if (cur && cur === videoId) {
        const comments = document.querySelector('ytd-comments#comments');
        if (comments) {
          comments.classList.remove('tm-hide-comments');
          comments.classList.add('tm-show-comments');
          log('comments revealed for id', videoId);
        }
      } else {
        log('reveal skipped because currentId != targetId', {cur, videoId});
      }
    }

    // NEW: Method to hide comments for new videos
    _hideCommentsNow() {
      const comments = document.querySelector('ytd-comments#comments');
      if (comments && !comments.classList.contains('tm-hide-comments')) {
        comments.classList.remove('tm-show-comments');
        comments.classList.add('tm-hide-comments');
        log('comments hidden for new video');
      }
    }

    isPlaylistActive() {
      try {
        if (location.search && location.search.includes('list=')) return true;
        if (document.querySelector('ytd-playlist-panel-renderer')) return true;
      } catch (e) {}
      return false;
    }

    /******** end-monitor (aggressive pre-end pause) ********/
    _startEndMonitor(videoId) {
      this._stopEndMonitor();
      log('start end monitor for', videoId);
      this.endMonitorInterval = setInterval(() => {
        this._checkEndGuard(videoId);
      }, config.endMonitorIntervalMs);
    }

    _stopEndMonitor() {
      if (this.endMonitorInterval) {
        clearInterval(this.endMonitorInterval);
        this.endMonitorInterval = null;
        log('stop end monitor');
      }
    }

    async _checkEndGuard(videoId) {
      if (this.destroyed) return;
      if (!this.playerVideo) return;
      const cur = this.getVideoIdFromUrl();
      if (!cur || cur !== videoId) { this._stopEndMonitor(); return; }
      const d = this.playerVideo.duration || 0;
      if (!d || !isFinite(d) || d <= 0) return;
      const remaining = d - this.playerVideo.currentTime;
      // use margin to attempt earlier than base tolerance
      const triggerAt = Math.max(0, config.pauseAtEndPlaylistTolerance + config.pauseMarginSeconds);
      if (remaining <= triggerAt && !this.pausedAtEndForIds.has(videoId)) {
        log('end guard triggered', {videoId, remaining, triggerAt});
        this.pausedAtEndForIds.add(videoId);
        await this._attemptPauseAndConfirmUnlock(videoId);
      }
    }

    async _attemptPauseAndConfirmUnlock(videoId) {
      if (!this.playerVideo) return;
      // mark navigation flag as false until we detect it
      this._navigationStarted = false;

      // NEW: Set the paused-at-end flag to prevent auto-resume
      this._pausedAtEnd = true;

      // Try to pause immediately and then poll to confirm paused & same video
      try {
        try { this.playerVideo.pause(); } catch (e) { log('pause() threw', e); }
      } catch (e) { log('pause attempt error', e); }

      const start = Date.now();
      let confirmed = false;
      while (Date.now() - start < config.pauseConfirmTimeoutMs) {
        // if a navigation started, abort
        if (this._navigationStarted) {
          log('navigation started during pauseConfirm -> abort unlock for', videoId);
          break;
        }
        // if video element replaced or id changed, abort
        const cur = this.getVideoIdFromUrl();
        if (!cur || cur !== videoId) {
          log('video id changed during pauseConfirm -> abort', {cur, videoId});
          break;
        }
        // check paused state
        if (this.playerVideo.paused) {
          confirmed = true;
          break;
        }
        // else wait briefly and re-check
        await sleep(40);
      }

      if (confirmed) {
        // treat as fully watched: mark watched time and unlock for that id
        const d = this.playerVideo.duration || 0;
        this.watchingState.watchedOrganicSeconds = d;
        this.watchingState.unlocked = true;
        this.watchingState.autoPausedByScript = true;
        this.unlockedVideoIds.add(videoId);
        // reveal only if still on same id
        this._revealCommentsNowIfCurrent(videoId);
        log('Pause confirmed & unlocked for', videoId);
      } else {
        // abort: ensure we do not keep unlocked state for this id (to avoid carry-over)
        this.unlockedVideoIds.delete(videoId);
        // NEW: Reset the paused-at-end flag if we failed
        this._pausedAtEnd = false;
        log('Pause NOT confirmed - abort unlocking for', videoId);
      }

      // stop end monitor
      this._stopEndMonitor();
    }

    // legacy stub kept for parity
    tryPauseAtEndIfPlaylist() { return; }

    /******** event handlers: pause/play/ended ********/
    onPauseEvent() {
      if (this.watchingState.autoPausedByScript) log('pause by script');
      else { this.watchingState.userPaused = true; log('pause by user'); }
    }

    onPlayEvent() {
      this.watchingState.userPaused = false;
      this.watchingState.autoPausedByScript = false;
      // NEW: Reset paused-at-end flag when user manually plays
      this._pausedAtEnd = false;
      log('play event');
    }

    onEndedEvent() {
      // fallback: ended may be fired if we missed pre-end guard
      if (!this.playerVideo) return;
      const d = this.playerVideo.duration || 0;
      this.watchingState.watchedOrganicSeconds = d;
      const vid = this.currentWatchId || this.getVideoIdFromUrl();
      if (vid) {
        // only mark as unlocked for this id, reveal only if still on same id
        this.unlockedVideoIds.add(vid);
        this._revealCommentsNowIfCurrent(vid);
        log('ended fallback: unlocked for', vid);
      }

      // fallback pause attempt if playlist+100% and we didn't yet handle
      if (this.isPlaylistActive() && config.requiredPercentToUnlockComments >= 99.5 && vid && !this.pausedAtEndForIds.has(vid)) {
        try {
          this.playerVideo.pause();
          this.watchingState.autoPausedByScript = true;
          // NEW: Set paused-at-end flag for fallback case too
          this._pausedAtEnd = true;
          this.pausedAtEndForIds.add(vid);
          this._revealCommentsNowIfCurrent(vid);
          log('ended fallback: paused & revealed for', vid);
        } catch (e) {
          log('ended fallback pause failed', e);
        }
      }

      // stop monitor (if any)
      this._stopEndMonitor();
      log('ended event processed');
    }

    /******** pause/resume helpers ********/
    pauseByScript(reason) {
      if (!this.playerVideo) return;
      try {
        if (!this.playerVideo.paused) {
          this.playerVideo.pause();
          this.watchingState.autoPausedByScript = true;
          log('pauseByScript', reason);
        }
      } catch (e) { log('pauseByScript err', e); }
    }

    async resumeIfAllowed(reason) {
      if (!this.playerVideo) return;

      // NEW: Don't resume if we're paused at the end
      if (this._pausedAtEnd) {
        log('resume skip: paused at end', reason);
        return;
      }

      if (!this.watchingState.autoPausedByScript) { log('resume skip: not autoPaused'); return; }
      if (this.watchingState.userPaused) { log('resume skip: userPaused'); return; }
      try {
        await this.playerVideo.play();
        this.watchingState.autoPausedByScript = false;
        log('resumeIfAllowed', reason);
      } catch (e) { log('resume play() failed', e); }
    }

    isClickInsidePlayer(evt) {
      const player = document.querySelector('.html5-video-player, #movie_player');
      if (!player) return false;
      return player.contains(evt.target);
    }

    onDocumentClick(evt) {
      const inside = this.isClickInsidePlayer(evt);
      if (!inside && this.playerVideo && !this.playerVideo.paused) {
        this.pauseByScript('click:outside-player');
      }
    }

    onMouseMove(evt) {
      if (!this.playerVideo) return;

      // NEW: Don't resume if we're paused at the end
      if (this._pausedAtEnd) {
        return;
      }

      const player = document.querySelector('.html5-video-player, #movie_player');
      if (!player) return;
      const rect = player.getBoundingClientRect();
      const inside = evt.clientX >= rect.left && evt.clientX <= rect.right && evt.clientY >= rect.top && evt.clientY <= rect.bottom;
      if (inside) this.resumeIfAllowed('pointer:enter-player');
    }

    setupIntersectionObserver() {
      try {
        if (this.intersectionObserver) { this.intersectionObserver.disconnect(); this.intersectionObserver = null; }
        const videoWrapper = this.videoWrapper || document.querySelector('.html5-video-player') || document.querySelector('#movie_player');
        if (!videoWrapper) { log('Intersection wrapper not found'); return; }
        this.intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            log('intersection ratio', ratio);

            // NEW: Don't resume if we're paused at the end
            if (ratio < config.intersectionVisibilityThreshold) {
              this.pauseByScript('intersection:out-of-view');
            } else if (!this._pausedAtEnd) {
              this.resumeIfAllowed('intersection:back-in-view');
            } else {
              log('intersection: ignoring resume because paused at end');
            }
          });
        }, { threshold: [0, config.intersectionVisibilityThreshold, 1.0] });
        this.intersectionObserver.observe(videoWrapper);
      } catch (e) { log('intersection error', e); }
    }

    cleanupVideoListeners() {
      try {
        if (!this.playerVideo) return;
        ['timeupdate','seeking','seeked','pause','play','ended'].forEach(ev => {
          const h = this.bound[ev];
          if (h) this.playerVideo.removeEventListener(ev, h);
        });
      } catch (e) {}
      try { if (this.intersectionObserver) { this.intersectionObserver.disconnect(); this.intersectionObserver = null; } } catch (e) {}
      this._stopEndMonitor();
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      log('destroying instance');
      try {
        if (this.mutationObserver) this.mutationObserver.disconnect();
        if (this.intersectionObserver) this.intersectionObserver.disconnect();
        if (this.urlPoller) clearInterval(this.urlPoller);
        document.removeEventListener('visibilitychange', this.bound.visibility, true);
        window.removeEventListener('focus', this.bound.focus, true);
        window.removeEventListener('blur', this.bound.blur, true);
        window.removeEventListener('pageshow', this.bound.pageshow);
        window.removeEventListener('popstate', this.bound.popstate);
        window.removeEventListener('yt-navigate-start', this.bound.ytNavStart, true);
        document.removeEventListener('mousemove', this.bound.pointer, { passive: true });
        document.removeEventListener('click', this.bound.click, true);
        this.cleanupVideoListeners();
      } catch (e) {}
      if (window.__ytSmartInstance === this) window.__ytSmartInstance = null;
    }
  } // end class

  /******** STARTUP ********/
  try {
    if (!window.__ytSmartInstance || window.__ytSmartInstance.destroyed) {
      new YTGuard();
      log('YTGuard started', INSTANCE_ID);
    } else {
      window.__ytSmartInstance.destroy();
      new YTGuard();
      log('YTGuard restarted', INSTANCE_ID);
    }
  } catch (e) {
    console.error('YT-SMART init error', e);
  }

})();