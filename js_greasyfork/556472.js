// ==UserScript==
// @name         Torn – Unique Outcome Detector (UID) + 5s Beep While Present
// @namespace    https://torn.com/
// @version      1.7.0
// @description  Beep every 5s while "unique outcome" is present on Torn crime pages, with a sound toggle (default OFF)
// @match        https://www.torn.com/page.php?sid=crimes*
// @run-at       document-idle
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556472/Torn%20%E2%80%93%20Unique%20Outcome%20Detector%20%28UID%29%20%2B%205s%20Beep%20While%20Present.user.js
// @updateURL https://update.greasyfork.org/scripts/556472/Torn%20%E2%80%93%20Unique%20Outcome%20Detector%20%28UID%29%20%2B%205s%20Beep%20While%20Present.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('[UID] Script loaded.');

  const SCAN_INTERVAL_MS = 5_000;           // Beep every 5 seconds
  const STORAGE_KEY = 'uidSoundEnabled_v3';

  // Default sound OFF: if no stored value, treat as '0'
  let audioEnabled = (localStorage.getItem(STORAGE_KEY) ?? '0') === '1';
  let audioCtx = null;

  // ---- AudioContext handling ----
  async function ensureAudioContext() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      console.warn('[UID] AudioContext not supported in this browser.');
      return null;
    }

    if (!audioCtx) {
      audioCtx = new AC();
    }

    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume();
      } catch (e) {
        console.warn('[UID] Failed to resume AudioContext:', e);
        return null;
      }
    }

    return audioCtx.state === 'running' ? audioCtx : null;
  }

  // ---- Beep ----
  async function playBeep(durationMs = 200, freqHz = 440, volume = 0.5) {
    if (!audioEnabled) return;

    const ctx = await ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freqHz, ctx.currentTime);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);

      oscillator.start();

      setTimeout(() => {
        try {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        } catch {}
      }, durationMs);
    } catch (e) {
      console.warn('[UID] Error while playing beep:', e);
    }
  }

  // ---- Always-visible Sound toggle button ----
  function addSoundToggleButton() {
    if (document.getElementById('uid-sound-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'uid-sound-toggle';

    function updateLabel() {
      btn.textContent = audioEnabled ? 'Sound: ON' : 'Sound: OFF';
    }
    updateLabel();

    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 999999999,
      fontSize: '14px',
      padding: '8px 12px',
      borderRadius: '6px',
      border: '2px solid #000',
      background: '#ffeb3b',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer'
    });

    btn.addEventListener('click', async () => {
      audioEnabled = !audioEnabled;
      localStorage.setItem(STORAGE_KEY, audioEnabled ? '1' : '0');
      updateLabel();
      console.log('[UID] Sound is now', audioEnabled ? 'ON' : 'OFF');

      if (audioEnabled) {
        await ensureAudioContext();
        await playBeep(200, 880, 0.5); // confirmation beep when turning ON
      }
    });

    document.body.appendChild(btn);
    console.log('[UID] Sound toggle button added.');
  }

  // ---- Your tested condition: scan all elements + outerHTML.includes("unique outcome") ----
  function scanPageForUniqueOutcome() {
    const elements = document.querySelectorAll('*'); // Select all elements on the page
    let found = false;

    elements.forEach(element => {
      const html = element.outerHTML;
      if (!html) return;

      if (html.includes('unique outcome')) { // <— your tested condition
        if (!found) {
          console.log("[UID] Element found containing 'unique outcome':", element);
        }
        found = true;
      }
    });

    if (found) {
      console.log('[UID] "unique outcome" present – beeping (if sound ON).');
      if (audioEnabled) {
        playBeep();
      }
    } else {
      console.log('[UID] No elements containing "unique outcome" were found on the page.');
    }
  }

  // ---- Init ----
  function init() {
    console.log('[UID] Initialising...');
    addSoundToggleButton();
    scanPageForUniqueOutcome();                     // run once immediately
    setInterval(scanPageForUniqueOutcome, SCAN_INTERVAL_MS); // then every 5s
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
