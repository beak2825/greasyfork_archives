// ==UserScript==
// @name         Torn Chain Watch Assistant
// @namespace    https://greasyfork.org/users/TheGingerbeardman
// @version      2.1
// @description  Monitors chain timer, alerts on user defined thresholds, and finds targets to save the chain.
// @author       Gingerbeardman
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @credit       tos https://greasyfork.org/en/scripts/370905-chain-warn-v2
// @credit       Omanpx [1906686], Titanic_ [2968477] https://greasyfork.org/en/scripts/511611-faction-target-finder
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554062/Torn%20Chain%20Watch%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/554062/Torn%20Chain%20Watch%20Assistant.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEYS = {
    enabled: 'chain_watch_enabled',
    apiKey: 'chain_watch_api_key',
    thresholds: 'chain_watch_thresholds',
  };

  const state = {
    enabled: localStorage.getItem(STORAGE_KEYS.enabled) === 'true',
    apiKey: localStorage.getItem(STORAGE_KEYS.apiKey) || '',
    thresholds: JSON.parse(localStorage.getItem(STORAGE_KEYS.thresholds) || '{}'),
    overlay: null,
    audioAlarm: null,
    audioCheckInterval: null,  // For checking when to escalate audio
    overlayShownTime: null,    // When overlay was first shown
    currentAudioInterval: null, // Current interval duration for audio
    interval: null,
    overlayDismissed: false,
    lastDisplayedSeconds: null, // Last timer value displayed (for conditional updates)
  };

  const TARGET_FALLBACK_FACTIONS = [1111, 2222, 3333];
  const MAX_LEVEL = 100;
  const API_TIMEOUT = 5000;  // 5 second timeout per request

  // Audio System (from Chain Warn v2)
  const audioContext = new AudioContext();

  const playTone = (gain, frequency, duration) => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    osc.frequency.value = frequency;
    osc.type = "square";
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = gain * 0.01;
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + duration * 0.001);
  };

  const playAlert = () => {
    playTone(10, 233, 100);
    playTone(3, 603, 200);
  };

  const playContinuousTone = () => {
    // Play a longer, continuous urgent tone
    playTone(15, 800, 1000);
  };

  const updateAudioUrgency = () => {
    if (!state.overlayShownTime) return;

    const elapsedSeconds = Math.floor((Date.now() - state.overlayShownTime) / 1000);
    let newInterval;

    if (elapsedSeconds >= 30) {
      // After 30 seconds: continuous tone every 1.2 seconds
      newInterval = 1200;

      // Only update if we haven't switched to continuous mode yet
      if (state.currentAudioInterval !== 'continuous') {
        console.log('[Chain Watch] Audio: Switching to continuous tone mode (30+ seconds)');
        if (state.audioAlarm) {
          clearInterval(state.audioAlarm);
        }
        state.audioAlarm = setInterval(playContinuousTone, newInterval);
        state.currentAudioInterval = 'continuous';
      }
    } else {
      // 0-30 seconds: escalating beeps
      // Start at 1500ms, reduce by 200ms every 5 seconds
      const reductionSteps = Math.floor(elapsedSeconds / 5);
      newInterval = Math.max(500, 1500 - (reductionSteps * 200));

      // Only update if the interval has changed
      if (state.currentAudioInterval !== newInterval) {
        console.log('[Chain Watch] Audio: Updating interval to', newInterval, 'ms (elapsed:', elapsedSeconds, 's)');
        if (state.audioAlarm) {
          clearInterval(state.audioAlarm);
        }
        state.audioAlarm = setInterval(playAlert, newInterval);
        state.currentAudioInterval = newInterval;
      }
    }
  };

  const startEscalatingAudio = () => {
    // Record when overlay was shown
    state.overlayShownTime = Date.now();
    state.currentAudioInterval = null;

    // Play immediate first alert
    console.log('[Chain Watch] Audio: Starting - playing immediate alert');
    playAlert();

    // Start the repeating audio at initial interval (1500ms)
    state.audioAlarm = setInterval(playAlert, 1500);
    state.currentAudioInterval = 1500;

    // Check every second to update audio urgency when needed
    state.audioCheckInterval = setInterval(updateAudioUrgency, 1000);
  };

  const stopAllAudio = () => {
    if (state.audioAlarm) {
      clearInterval(state.audioAlarm);
      state.audioAlarm = null;
    }
    if (state.audioCheckInterval) {
      clearInterval(state.audioCheckInterval);
      state.audioCheckInterval = null;
    }
    state.overlayShownTime = null;
    state.currentAudioInterval = null;
    console.log('[Chain Watch] Audio: Stopped');
  };

  GM_addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');

    .cw-button {
      margin-left: 10px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ccff;
      border: 1px solid #00ccff;
      border-radius: 6px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 0 4px #00ccff55;
      text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
    }

    .cw-button:hover {
      background: #00ccff;
      color: #111;
      box-shadow: 0 0 10px #00ccffaa;
    }

    .cw-popup {
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: #111;
      border: 1px solid #444;
      padding: 20px;
      color: #eee;
      z-index: 10000;
      width: 320px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      box-shadow: 0 0 20px #000;
    }

    .cw-popup input[type="text"] {
      background: #222;
      color: #fff;
      border: 1px solid #555;
      border-radius: 4px;
      font-size: 14px;
      padding: 6px;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .cw-api-key-error {
      color: #ff0000;
      font-size: 12px;
      margin-top: -8px;
      margin-bottom: 10px;
      display: none;
      font-weight: bold;
    }

    .cw-popup .threshold-group {
      margin-bottom: 14px;
    }

    .cw-popup .threshold-group label {
      display: block;
      margin-bottom: 4px;
      font-size: 13px;
    }

    .cw-popup .threshold-group .mins-secs {
      display: flex;
      gap: 8px;
    }

    .cw-popup .threshold-group .mins-secs input {
      width: 100px;
    }

    .cw-popup button.save-changes {
      width: 100%;
      padding: 8px;
      margin-top: 10px;
      background: #28a745;
      border: none;
      color: #fff;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .cw-popup button.save-changes:hover {
      background: #218838;
    }

    .cw-close {
      position: absolute;
      top: 6px;
      right: 10px;
      color: #ccc;
      font-size: 16px;
      cursor: pointer;
    }

    .cw-close:hover {
      color: #f66;
    }

    .cw-toggle {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: none;
      border-radius: 999px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
    }

    .cw-toggle.on {
      background: #28a745;
    }

    .cw-toggle.off {
      background: #dc3545;
    }

    .cw-title-timer {
      font-size: 22px;
      font-weight: bold;
      margin-left: 10px;
      cursor: pointer;
      font-family: 'Orbitron', sans-serif;
      color: #00ccff;
      text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
    }

    .cw-flash {
      animation: flash 1s infinite;
    }

    @keyframes flash {
      0% { opacity: 1; }
      50% { opacity: 0.4; }
      100% { opacity: 1; }
    }

    .cw-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(255,0,0,0.5);
      z-index: 10001;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .cw-overlay-timer {
      font-size: 100px;
      font-weight: bold;
      color: red;
      font-family: 'Orbitron', sans-serif;
      text-shadow:
        -1px -1px 0 #000,
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000;
    }

    .cw-overlay button {
      margin-top: 20px;
      font-size: 24px;
      padding: 10px 20px;
      background: black;
      color: white;
      border: 2px solid red;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
    }
  `);

  const secToMMSS = sec => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  const getDOMTimer = () => {
    const el = document.querySelector('.bar-timeleft___B9RGV');
    if (!el) return null;
    const [m, s] = el.innerText.split(':').map(Number);
    return isNaN(m) || isNaN(s) ? null : m * 60 + s;
  };

  const openTargetPage = (id) => {
    const url = `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
    hideOverlay(true);  // User taking action - dismiss overlay
    window.open(url, '_blank');
  };

  const findTargetFromList = () => {
    return new Promise((resolve) => {
      const url = `https://api.torn.com/v2/user/list?cat=Targets&key=${state.apiKey}`;
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload(res) {
          try {
            const data = JSON.parse(res.responseText);
            const live = data.list?.filter(u => u.status?.state === "Okay" && u.level <= MAX_LEVEL);
            const selected = live[Math.floor(Math.random() * live.length)];
            resolve(selected?.user_id || null);
          } catch { resolve(null); }
        },
        onerror: () => resolve(null)
      });
    });
  };

  const findTargetFromFactions = (index = 0) => {
    return new Promise((resolve) => {
      if (index >= TARGET_FALLBACK_FACTIONS.length) {
        const randomId = Math.floor(Math.random() * (3900000 - 3600000) + 3600000);
        return resolve(randomId);
      }
      const fid = TARGET_FALLBACK_FACTIONS[index];
      const url = `https://api.torn.com/faction/${fid}?selections=basic&key=${state.apiKey}`;
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload(res) {
          try {
            const data = JSON.parse(res.responseText);
            const members = Object.values(data.members || {});
            const live = members.filter(m => m.status?.state === "Okay" && m.level <= MAX_LEVEL);
            const chosen = live[Math.floor(Math.random() * live.length)];
            if (chosen) resolve(chosen.user_id);
            else findTargetFromFactions(index + 1).then(resolve);
          } catch {
            findTargetFromFactions(index + 1).then(resolve);
          }
        },
        onerror: () => findTargetFromFactions(index + 1).then(resolve)
      });
    });
  };

  const findTarget = async () => {
    const idFromList = await findTargetFromList();
    if (idFromList) return openTargetPage(idFromList);
    const idFromFacs = await findTargetFromFactions();
    if (idFromFacs) return openTargetPage(idFromFacs);
  };

  const showOverlay = (seconds) => {
    if (state.overlay) return;

    const overlay = document.createElement('div');
    overlay.className = 'cw-overlay';
    overlay.innerHTML = `
      <div class="cw-overlay-timer">${secToMMSS(seconds)}</div>
      <button id="cw-save-chain-btn">Save the Chain!</button>
      <div style="margin-top:8px; color:#fff; font-size:16px;">(press ESC to dismiss)</div>
    `;
    overlay.querySelector('#cw-save-chain-btn').onclick = () => {
      hideOverlay(true);  // User clicked button - mark as dismissed
      findTarget();
    };
    document.body.appendChild(overlay);
    state.overlay = overlay;

    const escHandler = e => {
      if (e.key === 'Escape') {
        hideOverlay(true);  // User pressed ESC - mark as dismissed
      }
    };
    document.addEventListener('keydown', escHandler);

    overlay._escHandler = escHandler;

    // Start escalating audio alarm system
    startEscalatingAudio();
  };

  const hideOverlay = (userDismissed = false) => {
    if (state.overlay) {
      document.removeEventListener('keydown', state.overlay._escHandler);
      state.overlay.remove();
      state.overlay = null;
    }

    // Stop all audio (both alarm and check interval)
    stopAllAudio();

    // Only set dismissed flag if user manually dismissed it
    if (userDismissed) {
      state.overlayDismissed = true;
    }
  };

  const updateOverlay = (seconds) => {
    if (state.overlay) {
      const timerEl = state.overlay.querySelector('.cw-overlay-timer');
      if (timerEl) {
        timerEl.textContent = secToMMSS(seconds);
      }
    }
  };

  const validateAPIKey = (apiKey) => {
    return new Promise((resolve, reject) => {
      if (!apiKey || apiKey.trim() === '') return reject('empty');
      const url = `https://api.torn.com/v2/faction/chain?key=${apiKey}`;
      const timeout = setTimeout(() => reject('timeout'), API_TIMEOUT);
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: res => {
          clearTimeout(timeout);
          try {
            const json = JSON.parse(res.responseText);
            if (json.error) {
              reject('invalid');
            } else {
              resolve(true);
            }
          } catch { reject('invalid'); }
        },
        onerror: () => reject('error')
      });
    });
  };

  const showSettingsPanel = () => {
    const wrap = document.createElement('div');
    wrap.className = 'cw-popup';

    const upM = state.thresholds.upper != null ? Math.floor(state.thresholds.upper / 60) : '';
    const upS = state.thresholds.upper != null ? (state.thresholds.upper % 60) : '';
    const midM = state.thresholds.middle != null ? Math.floor(state.thresholds.middle / 60) : '';
    const midS = state.thresholds.middle != null ? (state.thresholds.middle % 60) : '';
    const lowM = state.thresholds.lower != null ? Math.floor(state.thresholds.lower / 60) : '';
    const lowS = state.thresholds.lower != null ? (state.thresholds.lower % 60) : '';

    wrap.innerHTML = `
      <button id="cw-toggle" class="cw-toggle ${state.enabled ? 'on' : 'off'}">
        ${state.enabled ? 'Chain Watch ON' : 'Chain Watch OFF'}
      </button>
      <input id="cw-apikey" type="text" placeholder="API Key (limited)" value="${state.apiKey}" />
      <div id="cw-api-key-error" class="cw-api-key-error">API Key Invalid</div>

      <div class="threshold-group">
        <label>Upper Threshold</label>
        <div class="mins-secs">
          <input id="cw-upper-mins" type="text" placeholder="Minutes" value="${upM}" />
          <input id="cw-upper-secs" type="text" placeholder="Seconds" value="${upS}" />
        </div>
      </div>

      <div class="threshold-group">
        <label>Middle Threshold</label>
        <div class="mins-secs">
          <input id="cw-middle-mins" type="text" placeholder="Minutes" value="${midM}" />
          <input id="cw-middle-secs" type="text" placeholder="Seconds" value="${midS}" />
        </div>
      </div>

      <div class="threshold-group">
        <label>Lower Threshold</label>
        <div class="mins-secs">
          <input id="cw-lower-mins" type="text" placeholder="Minutes" value="${lowM}" />
          <input id="cw-lower-secs" type="text" placeholder="Seconds" value="${lowS}" />
        </div>
      </div>

      <button id="cw-save" class="save-changes">Save Changes</button>
      <div class="cw-close">✖</div>
    `;
    wrap.querySelector('#cw-toggle').onclick = e => {
      state.enabled = !state.enabled;
      localStorage.setItem(STORAGE_KEYS.enabled, state.enabled);
      e.target.className = 'cw-toggle ' + (state.enabled ? 'on' : 'off');
      e.target.textContent = state.enabled ? 'Chain Watch ON' : 'Chain Watch OFF';

      if (!state.enabled) {
        // Disabling - clean up everything
        const existing = document.getElementById('cw-duplicate-timer');
        if (existing) existing.remove();
        if (state.interval) {
          clearInterval(state.interval);
          state.interval = null;
        }
        hideOverlay();
      } else {
        // Re-enabling - reset dismissal flag and inject timer immediately
        state.overlayDismissed = false;
        injectTimerUI();
      }
      // Note: interval is already running from init, no need to start here
    };
    wrap.querySelector('#cw-save').onclick = async () => {
      const api = wrap.querySelector('#cw-apikey').value.trim();
      const errorEl = wrap.querySelector('#cw-api-key-error');

      // Validate API key if one was provided
      if (api) {
        try {
          await validateAPIKey(api);
          errorEl.style.display = 'none';
        } catch (error) {
          errorEl.style.display = 'block';
          return; // Don't save if invalid
        }
      } else {
        errorEl.style.display = 'none';
      }

      const upMins = parseInt(wrap.querySelector('#cw-upper-mins').value, 10);
      const upSecs = parseInt(wrap.querySelector('#cw-upper-secs').value, 10);
      const midMins = parseInt(wrap.querySelector('#cw-middle-mins').value, 10);
      const midSecs = parseInt(wrap.querySelector('#cw-middle-secs').value, 10);
      const lowMins = parseInt(wrap.querySelector('#cw-lower-mins').value, 10);
      const lowSecs = parseInt(wrap.querySelector('#cw-lower-secs').value, 10);

      state.apiKey = api;
      localStorage.setItem(STORAGE_KEYS.apiKey, api);

      const thresholds = {};
      if (!isNaN(upMins) && !isNaN(upSecs)) thresholds.upper = upMins * 60 + upSecs;
      if (!isNaN(midMins) && !isNaN(midSecs)) thresholds.middle = midMins * 60 + midSecs;
      if (!isNaN(lowMins) && !isNaN(lowSecs)) thresholds.lower = lowMins * 60 + lowSecs;

      state.thresholds = thresholds;
      localStorage.setItem(STORAGE_KEYS.thresholds, JSON.stringify(thresholds));

      // Automatically enable and reset dismissal flag
      state.enabled = true;
      state.overlayDismissed = false;
      localStorage.setItem(STORAGE_KEYS.enabled, 'true');

      // Inject timer immediately without waiting for page refresh
      injectTimerUI();

      wrap.remove();
      // Note: interval is already running from init, will start working on next tick
    };
    wrap.querySelector('.cw-close').onclick = () => wrap.remove();
    document.body.appendChild(wrap);
  };

  const injectTimerUI = () => {
    const h4 = document.querySelector('h4');
    if (!h4 || document.getElementById('cw-duplicate-timer')) return;

    const timerEl = document.createElement('span');
    timerEl.className = 'cw-title-timer';
    timerEl.id = 'cw-duplicate-timer';
    timerEl.title = 'Click to Save Chain!';
    timerEl.onclick = findTarget;
    h4.appendChild(timerEl);
  };

  const injectUIIfFactionPage = () => {
    if (!location.href.includes('/factions.php')) return;
    const h4 = document.querySelector('h4');
    if (!h4 || document.querySelector('.cw-button')) return;
    const btn = document.createElement('button');
    btn.className = 'cw-button';
    btn.textContent = '🔗 Chain Watch 🔗';
    btn.onclick = showSettingsPanel;
    h4.parentElement.appendChild(btn);
  };

  const runLoop = () => {
    if (!state.enabled) return;

    // Get DOM element references
    const timerEl = document.getElementById('cw-duplicate-timer');
    const domTimerEl = document.querySelector('.bar-timeleft___B9RGV');

    // Ensure timer UI is injected
    if (!timerEl) {
      injectTimerUI();
      return; // Wait for next loop to process
    }

    // Read timer value directly from DOM
    const sec = getDOMTimer();

    // If we can't read from DOM, bail
    if (sec == null) return;

    // Debug logging (only log once per second change to avoid spam)
    if (sec !== state.lastDisplayedSeconds) {
      console.log('[Chain Watch] Timer:', sec, 'Thresholds:', state.thresholds, 'Dismissed:', state.overlayDismissed);
    }

    // Update duplicate timer display
    if (timerEl) timerEl.textContent = '🔗 Chain 🔗 ' + secToMMSS(sec);

    // Only update document title when timer value changes
    if (sec !== state.lastDisplayedSeconds) {
      const originalTitle = document.title.replace(/^\d+:\d+\s—\s*/, '');
      document.title = `${secToMMSS(sec)} — ${originalTitle}`;
      state.lastDisplayedSeconds = sec;
    }

    // Reset dismissal when timer goes above threshold
    if (state.thresholds.lower != null && sec > state.thresholds.lower) {
      if (state.overlayDismissed) {
        console.log('[Chain Watch] Timer above threshold - resetting dismissed flag');
      }
      state.overlayDismissed = false;
    }

    // Show/hide overlay based on lower threshold
    if (state.thresholds.lower != null && sec <= state.thresholds.lower && !state.overlayDismissed) {
      console.log('[Chain Watch] Triggering overlay - Timer:', sec, 'Threshold:', state.thresholds.lower);
      showOverlay(sec);
    } else {
      hideOverlay();
    }

    // Flash effect for middle threshold
    if (state.thresholds.middle && sec <= state.thresholds.middle) {
      timerEl?.classList.add('cw-flash');
      domTimerEl?.classList.add('cw-flash');
    } else {
      timerEl?.classList.remove('cw-flash');
      domTimerEl?.classList.remove('cw-flash');
    }

    // Red color for upper threshold
    if (state.thresholds.upper && sec <= state.thresholds.upper) {
      if (timerEl) timerEl.style.color = 'red';
      if (domTimerEl) domTimerEl.style.color = 'red';
    } else {
      if (timerEl) timerEl.style.color = '';
      if (domTimerEl) domTimerEl.style.color = '';
    }

    // Update overlay timer if showing
    updateOverlay(sec);
  };

  const init = () => {
    // Inject UI elements with retry logic for timer
    const attemptTimerInjection = () => {
      if (document.getElementById('cw-duplicate-timer')) {
        return true; // Already injected
      }
      injectTimerUI();
      return document.getElementById('cw-duplicate-timer') != null;
    };

    // Try to inject timer immediately
    attemptTimerInjection();

    // Keep trying to inject timer until it appears (for late-loading pages)
    let timerRetries = 0;
    const maxTimerRetries = 40; // 20 seconds total
    const timerInterval = setInterval(() => {
      if (attemptTimerInjection()) {
        clearInterval(timerInterval);
      }
      timerRetries++;
      if (timerRetries >= maxTimerRetries) {
        clearInterval(timerInterval);
      }
    }, 500);

    // Inject faction page button
    injectUIIfFactionPage();

    // Keep trying to inject faction button until it appears (for late-loading pages)
    let factionButtonRetries = 0;
    const maxRetries = 20; // 10 seconds total
    const factionButtonInterval = setInterval(() => {
      injectUIIfFactionPage();
      factionButtonRetries++;
      if (document.querySelector('.cw-button') || factionButtonRetries >= maxRetries) {
        clearInterval(factionButtonInterval);
      }
    }, 500);

    // Start the main loop at 250ms for smooth updates
    // This ensures we catch DOM timer changes quickly and stay in sync
    state.interval = setInterval(runLoop, 250);
  };

  init();
})();