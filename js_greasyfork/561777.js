// ==UserScript==
// @name         Twitch Auto Lurk (Toggle + Countdown)
// @namespace    https://www.twitch.tv/
// @version      v1.2
// @description  Auto chat messages with top-nav toggle, countdown, tooltip, and stream awareness
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/LiventNick/Auto-Lurk-Message/refs/heads/main/AutoLurk.png
// @downloadURL https://update.greasyfork.org/scripts/561777/Twitch%20Auto%20Lurk%20%28Toggle%20%2B%20Countdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561777/Twitch%20Auto%20Lurk%20%28Toggle%20%2B%20Countdown%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******************************
   * CONFIG – MESSAGE TIMING
   ******************************/
  const MIN_DELAY_MINUTES = 15;
  const MAX_DELAY_MINUTES = 25;

  /******************************
   * CONFIG – MESSAGES
   ******************************/
  const MESSAGES = [
    "Hey there!",
    "Just Lurking Over here, don't mind me",
    "Do you know the muffin man?",
    "Quackers"
  ];

  const STORAGE_KEY = 'autoLurkEnabled';

  /******************************
   * STATE
   ******************************/
  let timeoutId = null;
  let countdownInterval = null;
  let nextMessageAt = null;
  let currentDelayMs = null;

  /******************************
   * UTILITIES
   ******************************/
  function isEnabled() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomDelayMs() {
    return (
      (Math.random() * (MAX_DELAY_MINUTES - MIN_DELAY_MINUTES) +
        MIN_DELAY_MINUTES) *
      60 *
      1000
    );
  }

  function isStreamLive() {
    return Boolean(
      document.querySelector('[data-a-target="stream-live-badge"]') ||
      document.querySelector('.live-time')
    );
  }

  /******************************
   * CHAT SENDING
   ******************************/
  function sendMessage(msg) {
    const input = document.querySelector('[data-a-target="chat-input"]');
    const button = document.querySelector('[data-a-target="chat-send-button"]');
    if (!input || !button) return;

    input.focus();
    const dt = new DataTransfer();
    dt.setData('text', msg);

    input.dispatchEvent(
      new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dt
      })
    );

    setTimeout(() => button.click(), 400);
  }

  /******************************
   * STOP EVERYTHING
   ******************************/
  function stopAll() {
    if (timeoutId) clearTimeout(timeoutId);
    if (countdownInterval) clearInterval(countdownInterval);

    timeoutId = null;
    countdownInterval = null;
    nextMessageAt = null;
    currentDelayMs = null;

    const cd = document.getElementById('auto-lurk-countdown');
    if (cd) {
      cd.textContent = '--:--';
      cd.style.color = '#aaa';
    }
  }

  /******************************
   * COUNTDOWN + COLOR ANIMATION
   ******************************/
  function startCountdown() {
    if (countdownInterval) return;

    countdownInterval = setInterval(() => {
      const el = document.getElementById('auto-lurk-countdown');
      if (!el || !nextMessageAt || !currentDelayMs) return;

      const remaining = nextMessageAt - Date.now();
      if (remaining <= 0) {
        el.textContent = '00:00';
        el.style.color = '#ef4444';
        return;
      }

      const ratio = remaining / currentDelayMs;

      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      if (ratio < 0.25) el.style.color = '#ef4444';      // red
      else if (ratio < 0.5) el.style.color = '#facc15'; // yellow
      else el.style.color = '#22c55e';                  // green
    }, 1000);
  }

  /******************************
   * SCHEDULER
   ******************************/
  function scheduleNext() {
    if (!isEnabled() || !isStreamLive()) return;

    currentDelayMs = randomDelayMs();
    nextMessageAt = Date.now() + currentDelayMs;

    startCountdown();

    timeoutId = setTimeout(() => {
      if (!isEnabled() || !isStreamLive()) return;
      sendMessage(randomChoice(MESSAGES));
      scheduleNext();
    }, currentDelayMs);
  }

  /******************************
   * UI
   ******************************/
  function updateToggleUI() {
    const toggle = document.getElementById('auto-lurk-toggle');
    if (!toggle) return;

    const knob = toggle.querySelector('.knob');
    const enabled = isEnabled();

    toggle.style.background = enabled ? '#22c55e' : '#555';
    knob.style.left = enabled ? '20px' : '2px';

    toggle.setAttribute('aria-checked', enabled);
  }

  function injectUI() {
    if (document.getElementById('auto-lurk-control')) return;

    const prime = document.querySelector('[data-a-target="prime-offers-icon"]');
    if (!prime) return;

    const nav = prime.closest('.VxLcr')?.parentElement;
    if (!nav) return;

    const container = document.createElement('div');
    container.id = 'auto-lurk-control';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.fontSize = '12px';
    container.style.color = 'white';
    container.style.userSelect = 'none';

    const countdown = document.createElement('span');
    countdown.id = 'auto-lurk-countdown';
    countdown.textContent = '--:--';
    countdown.style.minWidth = '42px';
    countdown.style.textAlign = 'right';
    countdown.style.color = '#aaa';

    const toggle = document.createElement('div');
    toggle.id = 'auto-lurk-toggle';
    toggle.setAttribute('role', 'switch');
    toggle.setAttribute('aria-label', 'Toggle Auto Lurk');
    toggle.setAttribute('aria-checked', 'false');

    toggle.style.width = '36px';
    toggle.style.height = '18px';
    toggle.style.borderRadius = '999px';
    toggle.style.background = '#555';
    toggle.style.position = 'relative';
    toggle.style.cursor = 'pointer';

    const knob = document.createElement('div');
    knob.className = 'knob';
    knob.style.width = '14px';
    knob.style.height = '14px';
    knob.style.borderRadius = '50%';
    knob.style.background = 'white';
    knob.style.position = 'absolute';
    knob.style.top = '2px';
    knob.style.left = '2px';
    knob.style.transition = 'left 0.2s';

    const tooltip = document.createElement('div');
    tooltip.textContent = 'Toggle Auto Lurk?';
    tooltip.style.position = 'absolute';
    tooltip.style.top = '26px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.background = '#18181b';
    tooltip.style.color = 'white';
    tooltip.style.padding = '6px 8px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '11px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.opacity = '0';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transition = 'opacity 0.15s ease';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.6)';

    toggle.append(knob, tooltip);
    container.append(countdown, toggle);
    nav.insertBefore(container, nav.firstChild);

    toggle.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });

    toggle.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    toggle.onclick = () => {
      const newState = !isEnabled();
      localStorage.setItem(STORAGE_KEY, newState.toString());
      updateToggleUI();

      if (newState) {
        scheduleNext();
      } else {
        stopAll();
      }
    };

    updateToggleUI();
  }

  /******************************
   * INIT
   ******************************/
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, 'false');
  }

  setInterval(() => {
    injectUI();

    if (isEnabled() && isStreamLive() && !timeoutId) {
      scheduleNext();
    }

    if (isEnabled() && !isStreamLive()) {
      stopAll();
    }
  }, 1500);

})();
