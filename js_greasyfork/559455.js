// ==UserScript==
// @name         Audio Master: Auto Mute & Resume
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  The ultimate audio manager. Automatically mutes background tabs when a new video/audio plays. Resumes the previous audio tab when you pause. "God Mode" detection captures videos, audios, Shadow DOM, and Web Audio (Games).
// @author       hacker09
// @match        *://*/*
// @tag          MINE!
// @icon         https://i.imgur.com/UEBGdsQ.png
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/559455/Audio%20Master%3A%20Auto%20Mute%20%20Resume.user.js
// @updateURL https://update.greasyfork.org/scripts/559455/Audio%20Master%3A%20Auto%20Mute%20%20Resume.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const TAB_ID = Math.random().toString(36).slice(2) + "-" + Date.now();
  let isScriptMuted = false;

  // --- 1. EVENT LISTENERS (FIX FOR NATIVE PLAYERS) ---
  // Captures events from native browser controls (like direct .mp4 files)
  document.addEventListener('play', (e) => {
    if (e.target instanceof HTMLMediaElement) {
      claimPriority();
    }
  }, true);

  document.addEventListener('pause', (e) => {
    if (e.target instanceof HTMLMediaElement) {
      checkYielding(e.target);
    }
  }, true);

  // --- 2. PROTOTYPE HIJACKING (GOD MODE DETECTION) ---
  const originalPlay = HTMLMediaElement.prototype.play;
  const originalPause = HTMLMediaElement.prototype.pause;

  // Trap video.play()
  HTMLMediaElement.prototype.play = function() {
    claimPriority();
    return originalPlay.apply(this, arguments);
  };

  // Trap video.pause()
  HTMLMediaElement.prototype.pause = function() {
    const result = originalPause.apply(this, arguments);
    checkYielding(this);
    return result;
  };

  // Shared Logic: Check if we should yield priority
  function checkYielding(element) {
    if (element.paused) {
      // Check if OTHER videos are still playing on this tab
      const stillPlaying = Array.from(document.querySelectorAll('video, audio'))
      .some(el => !el.paused && el !== element);
      if (!stillPlaying) {
        yieldPriority();
      }
    }
  }

  // --- 3. WEB AUDIO API HIJACK ---
  const audioContexts = [];
  const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
  if (OriginalAudioContext) {
    window.AudioContext = window.webkitAudioContext = function(...args) {
      const ctx = new OriginalAudioContext(...args);
      audioContexts.push(ctx);
      ctx.addEventListener('statechange', () => {
        if (ctx.state === 'running') claimPriority();
      });
      return ctx;
    };
    window.AudioContext.prototype = OriginalAudioContext.prototype;
  }

  // --- CONFIGURATION ---
  GM_registerMenuCommand("Set Stack Limit", () => {
    const currentLimit = GM_getValue('maxStackLimit', 20);
    const newLimit = prompt("Enter max number of audio tabs to remember (Default: 20):", currentLimit);
    if (newLimit !== null && !isNaN(newLimit)) {
      GM_setValue('maxStackLimit', parseInt(newLimit, 10));
    }
  });

  // --- STACK MANAGEMENT ---
  function getStack() { return GM_getValue('audioStack', []); }
  function saveStack(stack) { GM_setValue('audioStack', stack); }

  function claimPriority() {
    let stack = getStack();
    const MAX_SIZE = GM_getValue('maxStackLimit', 20);
    stack = stack.filter(id => id !== TAB_ID);
    stack.push(TAB_ID);
    if (stack.length > MAX_SIZE) stack = stack.slice(stack.length - MAX_SIZE);
    saveStack(stack);
    applyMute(false);
  }

  function yieldPriority() {
    let stack = getStack();
    const newStack = stack.filter(id => id !== TAB_ID);
    if (stack.length !== newStack.length) saveStack(newStack);
  }

  // --- MUTE LOGIC ---
  function applyMute(shouldMute) {
    isScriptMuted = shouldMute;

    // 1. Standard Tags
    document.querySelectorAll('video, audio').forEach(el => {
      if (shouldMute) {
        if (!el.paused && !el.ended) el.muted = true;
      } else {
        if (el.muted) el.muted = false;
      }
    });

    // 2. Web Audio
    audioContexts.forEach(ctx => {
      if (ctx.state === 'closed') return;
      if (shouldMute) {
        if (ctx.state === 'running') ctx.suspend();
      } else {
        if (ctx.state === 'suspended') ctx.resume();
      }
    });
  }

  function checkGlobalState() {
    const stack = getStack();
    if (stack.length === 0) return;
    const masterId = stack[stack.length - 1];
    applyMute(masterId !== TAB_ID);
  }

  // --- LISTENERS (Backup only) ---
  window.addEventListener('focus', () => {
    const tagsActive = Array.from(document.querySelectorAll('video, audio'))
    .some(el => !el.paused && !el.ended);
    const webAudioActive = audioContexts.some(ctx => ctx.state === 'running');
    if (tagsActive || webAudioActive) claimPriority();
  });

  GM_addValueChangeListener('audioStack', () => checkGlobalState());
  window.addEventListener('beforeunload', () => yieldPriority());

  // Deep Observer for new elements
  new MutationObserver(() => {
    if (isScriptMuted) {
      document.querySelectorAll('video, audio').forEach(el => {
        if (!el.paused && !el.ended && !el.muted) el.muted = true;
      });
    }
  }).observe(document, { childList: true, subtree: true });

})();