// ==UserScript==
// @name         Audio Master: Auto Mute & Resume
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  The ultimate audio manager. Mutes background tabs automatically. Prevents background auto-play from stealing focus ("God Mode"). Adds 🔇 only to playing background tabs.
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

  // --- 1. EVENT LISTENERS ---
  const events = ['play', 'playing']; // Capture start events
  events.forEach(evt => {
    document.addEventListener(evt, (e) => {
      if (e.target instanceof HTMLMediaElement) {
        handlePlayIntent();
        updateTitle(); // Check if we need to show emoji
      }
    }, true);
  });

  document.addEventListener('pause', (e) => {
    if (e.target instanceof HTMLMediaElement) {
      checkYielding(e.target);
      updateTitle(); // Remove emoji if paused
    }
  }, true);

  document.addEventListener('ended', () => updateTitle(), true); // Remove emoji if finished
  document.addEventListener('enterpictureinpicture', claimPriority, true);

  // --- 2. PROTOTYPE HIJACKING ---
  const originalPlay = HTMLMediaElement.prototype.play;
  const originalPause = HTMLMediaElement.prototype.pause;

  HTMLMediaElement.prototype.play = function() {
    handlePlayIntent();
    // We defer the title update slightly to ensure the property 'paused' is false
    setTimeout(updateTitle, 0);
    return originalPlay.apply(this, arguments);
  };

  HTMLMediaElement.prototype.pause = function() {
    const result = originalPause.apply(this, arguments);
    checkYielding(this);
    updateTitle();
    return result;
  };

  function handlePlayIntent() {
    if (!document.hidden) {
      claimPriority();
    } else {
      checkGlobalState();
    }
  }

  function checkYielding(element) {
    if (element.paused) {
      const stillPlaying = Array.from(document.querySelectorAll('video, audio'))
      .some(el => !el.paused && el !== element);
      if (!stillPlaying) yieldPriority();
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
        if (ctx.state === 'running') handlePlayIntent();
        updateTitle();
      });
      return ctx;
    };
    window.AudioContext.prototype = OriginalAudioContext.prototype;
  }

  // --- CONFIGURATION ---
  GM_registerMenuCommand("Set Stack Limit", () => {
    const currentLimit = GM_getValue('maxStackLimit', 20);
    const newLimit = prompt("Enter max number of audio tabs to remember (Default: 20):", currentLimit);
    if (newLimit !== null && !isNaN(newLimit)) GM_setValue('maxStackLimit', parseInt(newLimit, 10));
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
    if (document.pictureInPictureElement) shouldMute = false;
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

    updateTitle();
  }

  // --- TITLE UI MANAGER ---
  // Only adds emoji if script is Muted AND Media is actually Playing
  function updateTitle() {
    const isPlaying = Array.from(document.querySelectorAll('video, audio'))
    .some(el => !el.paused && !el.ended);
    const isWebAudioRunning = audioContexts.some(ctx => ctx.state === 'running');

    if (isScriptMuted && (isPlaying || isWebAudioRunning)) {
      if (!document.title.startsWith("🔇 ")) document.title = "🔇 " + document.title;
    } else {
      if (document.title.startsWith("🔇 ")) document.title = document.title.replace(/^🔇\s/, "");
    }
  }

  function checkGlobalState() {
    const stack = getStack();
    if (stack.length === 0) return;
    const masterId = stack[stack.length - 1];
    applyMute(masterId !== TAB_ID);
  }

  // --- LISTENERS ---
  window.addEventListener('focus', () => {
    const tagsActive = Array.from(document.querySelectorAll('video, audio'))
    .some(el => !el.paused && !el.ended);
    const webAudioActive = audioContexts.some(ctx => ctx.state === 'running');
    if (tagsActive || webAudioActive) claimPriority();
  });

  GM_addValueChangeListener('audioStack', () => checkGlobalState());
  window.addEventListener('beforeunload', () => yieldPriority());

  // Observer for new elements
  new MutationObserver(() => {
    if (isScriptMuted) {
      document.querySelectorAll('video, audio').forEach(el => {
        if (!el.paused && !el.ended && !el.muted) el.muted = true;
      });
      updateTitle();
    }
  }).observe(document, { childList: true, subtree: true });

})();