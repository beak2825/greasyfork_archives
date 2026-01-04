// ==UserScript==
// @name         Grok Auto-Regenerate
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Auto-regenerate with a persistent prompt
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @author       bigelelya
// @license GNU GPLv3
// @match        *://grok.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560375/Grok%20Auto-Regenerate.user.js
// @updateURL https://update.greasyfork.org/scripts/560375/Grok%20Auto-Regenerate.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isAutoRegenEnabled = true;
  let isCurrentlyAttemptingRegen = false;
  let lastRegenTime = 0;
  let retryCount = 0;
  const REGEN_COOLDOWN_MS = 5000;

  let dock, header, statusChip, statusDot, statusText, retryCountRef, switchBtn, progressWrap, progressFill, progressLabel, promptInputRef;

  // Selectors
  const popupSelector = 'body > section > ol > li > div > span';
  const popupText = 'Content Moderated. Try a different idea.';
  const grokInputSelector = 'textarea[aria-label="Make a video"]';
  const regenerateButtonSelector = 'button[aria-label="Make video"]';

  console.log('[Grok Auto-Regen] Loaded: v4.4');

  function injectPrompt() {
    const grokInput = document.querySelector(grokInputSelector);
    const myPrompt = promptInputRef ? promptInputRef.value : '';

    if (grokInput && myPrompt) {
      console.log('[Grok Auto-Regen] Injecting custom prompt...');

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      nativeInputValueSetter.call(grokInput, myPrompt);

      const inputEvent = new Event('input', { bubbles: true });
      grokInput.dispatchEvent(inputEvent);
    }
  }


  function getCurrentGenerationProgress() {
    const candidateDivs = document.querySelectorAll('div.font-semibold');
    const percentageRegex = /^(\d{1,3})%$/;
    for (const div of candidateDivs) {
      const match = div.textContent.trim().match(percentageRegex);
      if (match) return Math.min(100, Math.max(0, parseInt(match[1], 10)));
    }
    return null;
  }

  function updateProgressBar() {
    if (!progressWrap) return;
    const progress = getCurrentGenerationProgress();
    const now = Date.now();

    if (progress !== null) {
      // Active State
      progressWrap.classList.add('active');
      progressFill.style.width = `${progress}%`;
      progressLabel.textContent = `${progress}%`;

      statusText.textContent = 'Generating';
      statusChip.dataset.state = 'active';
      isCurrentlyAttemptingRegen = true;

    } else {
      // Idle State
      progressWrap.classList.remove('active');
      progressFill.style.width = `0%`;
      progressLabel.textContent = `Ready`;

      // Safe reset logic
      if (isCurrentlyAttemptingRegen && (now - lastRegenTime > REGEN_COOLDOWN_MS)) {
        isCurrentlyAttemptingRegen = false;
        statusText.textContent = 'Standby';
        statusChip.dataset.state = 'idle';
      }
    }
  }

  function updateRetryUI() {
      if(retryCountRef) {
          retryCountRef.innerText = retryCount;
          retryCountRef.parentElement.animate([
              { transform: 'scale(1)' },
              { transform: 'scale(1.2)' },
              { transform: 'scale(1)' }
          ], { duration: 200 });
      }
  }


  const observerCallback = function () {
    if (!isAutoRegenEnabled) return;
    if (Date.now() - lastRegenTime < REGEN_COOLDOWN_MS) return;

    const potentialPopup = document.querySelector(popupSelector);
    if (potentialPopup && potentialPopup.textContent.trim() === popupText) {
      const btn = document.querySelector(regenerateButtonSelector);

      if (btn) {
        console.log('[Grok Auto-Regen] Moderation detected. Initiating Injection & Regen...');
        lastRegenTime = Date.now();
        isCurrentlyAttemptingRegen = true;

        // INCREMENT RETRY COUNT
        retryCount++;
        updateRetryUI();

        statusText.textContent = 'Injecting...';
        statusChip.dataset.state = 'active';

        injectPrompt();

        setTimeout(() => {
             statusText.textContent = 'Retrying...';
             btn.click();
        }, 500);
      }
    }
  };

  // UI
  function createModernUI() {
    dock = document.createElement('div');
    dock.id = 'grok-glass-dock';

    // Header
    header = document.createElement('div');
    header.className = 'glass-header';
    header.innerHTML = `
      <div class="glass-title-group">
        <div class="glass-icon">
          <img src="https://www.google.com/s2/favicons?sz=64&domain=grok.com" alt="Grok Logo" draggable="false" />
        </div>
        <span class="glass-title">Auto-Regen</span>
      </div>
      <div class="glass-controls">
        <button id="grok-switch" class="modern-switch on" role="switch">
          <div class="switch-handle">
            <div class="switch-glow"></div>
          </div>
        </button>
      </div>
      <div class="drag-grip">
        <span></span><span></span><span></span>
      </div>
    `;

    // Status Row
    const statusRow = document.createElement('div');
    statusRow.className = 'glass-info-row';

    // Status Chip
    statusChip = document.createElement('div');
    statusChip.className = 'glass-status';
    statusChip.dataset.state = 'idle';
    statusChip.innerHTML = `
      <div class="status-dot"></div>
      <span class="status-text">Standby</span>
    `;

    // Retry Counter
    const retryWrapper = document.createElement('div');
    retryWrapper.className = 'glass-counter';
    retryWrapper.innerHTML = `
      <span class="counter-label">RETRIES</span>
      <span class="counter-value" id="grok-retry-val">0</span>
    `;

    statusRow.appendChild(statusChip);
    statusRow.appendChild(retryWrapper);

    // Manual Prompt Input Area
    const inputArea = document.createElement('div');
    inputArea.className = 'glass-input-wrapper';
    inputArea.innerHTML = `
      <label class="input-label">Persistent Prompt</label>
      <textarea id="grok-manual-prompt" placeholder="Type prompt here. Script will use this for every regen."></textarea>
    `;

    // Progress Bar
    progressWrap = document.createElement('div');
    progressWrap.className = 'glass-progress-container';
    progressWrap.innerHTML = `
      <div class="glass-track">
        <div class="glass-fill" id="grok-fill">
          <div class="liquid-light"></div>
        </div>
      </div>
      <div class="progress-label" id="grok-label">Ready</div>
    `;

    dock.appendChild(header);
    dock.appendChild(statusRow);
    dock.appendChild(inputArea);
    dock.appendChild(progressWrap);
    document.body.appendChild(dock);

    // Ref Assignments
    switchBtn = dock.querySelector('#grok-switch');
    statusDot = dock.querySelector('.status-dot');
    statusText = dock.querySelector('.status-text');
    retryCountRef = dock.querySelector('#grok-retry-val');
    progressFill = dock.querySelector('#grok-fill');
    progressLabel = dock.querySelector('#grok-label');
    promptInputRef = dock.querySelector('#grok-manual-prompt');

    // Load saved prompt
    const savedPrompt = localStorage.getItem('grokAutoRegenPrompt');
    if (savedPrompt) {
      promptInputRef.value = savedPrompt;
    }

    // Event Listeners
    switchBtn.addEventListener('click', toggleSwitch);

    // Prompt Save
    promptInputRef.addEventListener('input', (e) => {
        localStorage.setItem('grokAutoRegenPrompt', e.target.value);
        // Reset retry count when user types new prompt
        retryCount = 0;
        updateRetryUI();
    });

    // Draggable Logic
    makeDraggable(dock, header);
    restorePosition(dock);
  }

  function toggleSwitch() {
    isAutoRegenEnabled = !isAutoRegenEnabled;
    switchBtn.classList.toggle('on', isAutoRegenEnabled);

    if (isAutoRegenEnabled) {
      statusText.textContent = 'Standby';
      statusChip.dataset.state = 'idle';
    } else {
      statusText.textContent = 'Disabled';
      statusChip.dataset.state = 'off';
    }
  }

  // Draggable Logic
  function makeDraggable(el, handle) {
    let isDown = false, startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.modern-switch')) return;
      isDown = true;
      const rect = el.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      startLeft = rect.left; startTop = rect.top;
      el.classList.add('grabbing');
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    function onMove(e) {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = `${startLeft + dx}px`;
      el.style.top = `${startTop + dy}px`;
      el.style.right = 'auto'; el.style.bottom = 'auto';
    }

    function onUp() {
      isDown = false;
      el.classList.remove('grabbing');
      savePosition(el);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
  }

  function savePosition(el) {
    const rect = el.getBoundingClientRect();
    localStorage.setItem('grokDockPos_v4', JSON.stringify({ left: rect.left, top: rect.top }));
  }

  function restorePosition(el) {
    const saved = localStorage.getItem('grokDockPos_v4');
    if (saved) {
      const pos = JSON.parse(saved);
      el.style.left = `${pos.left}px`;
      el.style.top = `${pos.top}px`;
      el.style.right = 'auto'; el.style.bottom = 'auto';
    }
  }

  // CSS
  GM_addStyle(`
    /* Fonts & Variables */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

    :root {
      --glass-bg: rgba(20, 20, 23, 0.65);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-highlight: rgba(255, 255, 255, 0.15);
      --glass-input-bg: rgba(0, 0, 0, 0.3);
      --accent-primary: #3b82f6;
      --accent-glow: rgba(59, 130, 246, 0.5);
      --text-main: #ffffff;
      --text-muted: rgba(255, 255, 255, 0.6);
      --ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Main Dock */
    #grok-glass-dock {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 300px;
      background: var(--glass-bg);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border-radius: 24px;
      border: 1px solid var(--glass-border);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0, 0.2);
      padding: 16px;
      font-family: 'Inter', sans-serif;
      color: var(--text-main);
      z-index: 999999;
      animation: slideUp FadeIn 0.6s var(--ease-elastic);
    }

    #grok-glass-dock::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.07;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* Header */
    .glass-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      cursor: grab;
      position: relative;
    }

    .glass-title-group { display: flex; align-items: center; gap: 10px; }
    .glass-icon {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
      border: 1px solid var(--glass-border);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .glass-icon img { width: 20px; height: 20px; object-fit: contain; }
    .glass-title { font-weight: 600; font-size: 14px; }

    /* Controls */
    .modern-switch {
      width: 48px; height: 28px;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--glass-border);
      border-radius: 99px;
      position: relative; cursor: pointer;
      transition: all 0.4s var(--ease-elastic);
    }
    .switch-handle {
      width: 20px; height: 20px;
      background: #fff; border-radius: 50%;
      position: absolute; top: 3px; left: 4px;
      transition: all 0.4s var(--ease-elastic);
    }
    .modern-switch.on { background: var(--accent-primary); }
    .modern-switch.on .switch-handle { transform: translateX(20px); }

    /* Status Row Flex */
    .glass-info-row {
      display: flex; gap: 8px; margin-bottom: 12px;
    }

    /* Status Chip */
    .glass-status {
      flex: 1;
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      padding: 8px 12px;
      border-radius: 12px;
    }
    .glass-status[data-state="active"] { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #fbbf24; transition: all 0.3s ease; }
    .glass-status[data-state="active"] .status-dot { background: #4ade80; box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.2); animation: pulse 2s infinite; }
    .glass-status[data-state="off"] .status-dot { background: #ef4444; }
    .status-text { font-size: 12px; font-weight: 500; color: var(--text-muted); text-transform: uppercase; white-space: nowrap; }

    /* Retry Counter Style */
    .glass-counter {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.4);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      min-width: 60px; padding: 0 8px;
    }
    .counter-label { font-size: 8px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px; }
    .counter-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; color: #fff; }

    /* New Prompt Input Area */
    .glass-input-wrapper {
      margin-bottom: 16px;
    }
    .input-label {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 6px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    #grok-manual-prompt {
      width: 100%;
      height: 60px;
      background: var(--glass-input-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 10px;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #grok-manual-prompt:focus {
      border-color: var(--accent-primary);
      background: rgba(0,0,0,0.5);
    }
    #grok-manual-prompt::placeholder {
      color: rgba(255,255,255,0.3);
    }

    /* Progress */
    .glass-progress-container { position: relative; }
    .glass-track { height: 6px; width: 100%; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; }
    .glass-fill { height: 100%; width: 0%; background: var(--accent-primary); border-radius: 99px; position: relative; transition: width 0.6s var(--ease-elastic); }
    .liquid-light {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
      transform: translateX(-100%); animation: shimmer 1.5s infinite;
    }
    .progress-label {
      position: absolute; right: 0; top: -20px;
      font-size: 11px; color: var(--text-muted);
      opacity: 0; transform: translateY(5px); transition: all 0.3s ease;
    }
    .glass-progress-container.active .progress-label { opacity: 1; transform: translateY(0); }

    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); } 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); } }
    @keyframes shimmer { 100% { transform: translateX(100%); } }
  `);

  // Init
  function initialize() {
    createModernUI();
    setInterval(updateProgressBar, 250);
    new MutationObserver(observerCallback).observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('load', initialize);
})();