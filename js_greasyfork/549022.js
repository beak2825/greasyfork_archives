// ==UserScript==
// @name         Enhanced AutoScroll v4.0 (Advanced Lazy Loading Support)
// @namespace    https://greasyfork.org/users/1513610
// @version      4.0
// @description  Advanced smooth auto-scroll with HUD, lazy loading detection, performance optimization, and accessibility features. Press S to toggle, [ ] speed, + - step, R reset, H hide, P position. Negative speed scrolls up.
// @author       NAABO (Enhanced)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549022/Enhanced%20AutoScroll%20v40%20%28Advanced%20Lazy%20Loading%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549022/Enhanced%20AutoScroll%20v40%20%28Advanced%20Lazy%20Loading%20Support%29.meta.js
// ==/UserScript==

/*
📌 Enhanced Features:
- Smart lazy loading detection with MutationObserver
- Performance-optimized frame rate limiting
- User activity tracking with smart pause
- Enhanced scroll progress indicator
- Accessibility improvements (reduced motion support)
- Error handling and recovery
- Debounced DOM change detection
- Memory leak prevention
- Advanced HUD with detailed status
*/

(function () {
  'use strict';

  /************* Configuration *************/
  const CONFIG = {
    STORAGE_KEY: 'enhanced_autoscroll_config_v4',
    DEFAULT_SPEED: 250,
    DEFAULT_SPEED_STEP: 50,
    MIN_SPEED_STEP: 10,
    MAX_SPEED_STEP: 100,
    HUD_POSITIONS: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    FLASH_DURATION: 1500,
    TARGET_FPS: 60,
    MUTATION_DEBOUNCE: 150,
    USER_ACTIVITY_THRESHOLD: 2000, // 2 seconds
    IDLE_CHECK_INTERVAL: 5000, // 5 seconds
    HEIGHT_CHANGE_THRESHOLD: 100, // Minimum height change to resume
  };

  /************* State *************/
  const state = {
    // Core scrolling
    scrolling: false,
    speed: CONFIG.DEFAULT_SPEED,
    speedStep: CONFIG.DEFAULT_SPEED_STEP,

    // UI
    hud: null,
    hudPositionIndex: 0,
    hudVisible: true,

    // Animation and performance
    animationFrame: null,
    lastFrameTime: 0,
    frameInterval: 1000 / CONFIG.TARGET_FPS,

    // Lazy loading detection
    mutationObserver: null,
    lastScrollHeight: 0,
    pausedAtBottom: false,
    pausedAtTop: false,
    mutationDebounceTimeout: null,

    // User activity tracking
    lastUserActivity: Date.now(),
    userActivityListeners: [],
    idleCheckInterval: null,

    // Accessibility
    prefersReducedMotion: false,

    // Error handling
    errorCount: 0,
    maxErrors: 5,
  };

  /************* Utils *************/
  function saveConfig() {
    try {
      const data = {
        speed: state.speed,
        speedStep: state.speedStep,
        hudPositionIndex: state.hudPositionIndex,
        hudVisible: state.hudVisible,
      };
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('AutoScroll: Failed to save config', error);
    }
  }

  function loadConfig() {
    try {
      const data = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
      if (data.speed != null) state.speed = data.speed;
      if (data.speedStep != null) state.speedStep = data.speedStep;
      if (data.hudPositionIndex != null) state.hudPositionIndex = data.hudPositionIndex;
      if (data.hudVisible != null) state.hudVisible = data.hudVisible;
    } catch (error) {
      console.warn('AutoScroll: Failed to load config, using defaults', error);
    }
  }

  function flashHUD(msg, type = 'info') {
    if (!state.hud) return;

    const div = document.createElement('div');
    div.textContent = msg;

    const colors = {
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    div.style.cssText = `
      position:absolute; top:-28px; left:50%; transform:translateX(-50%);
      background:${colors[type] || colors.info}; color:#fff; padding:4px 8px;
      border-radius:4px; font-size:11px; pointer-events:none;
      white-space:nowrap; z-index:10; box-shadow:0 2px 8px rgba(0,0,0,0.3);
    `;

    state.hud.appendChild(div);
    setTimeout(() => {
      if (div.parentNode) div.remove();
    }, CONFIG.FLASH_DURATION);
  }

  function getHUDPositionClass() {
    return `hud-pos-${CONFIG.HUD_POSITIONS[state.hudPositionIndex]}`;
  }

  function calculateScrollProgress() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 100;
  }

  function getScrollDirection() {
    return state.speed >= 0 ? '↓' : '↑';
  }

  /************* User Activity Tracking *************/
  function setupUserActivityTracking() {
    const events = ['mousedown', 'keydown', 'wheel', 'touchstart', 'mousemove'];

    const updateActivity = () => {
      state.lastUserActivity = Date.now();
    };

    events.forEach(event => {
      const listener = updateActivity;
      document.addEventListener(event, listener, { passive: true });
      state.userActivityListeners.push({ event, listener });
    });

    // Periodic idle check
    state.idleCheckInterval = setInterval(() => {
      const idleTime = Date.now() - state.lastUserActivity;
      if (idleTime > CONFIG.IDLE_CHECK_INTERVAL && state.scrolling) {
        // User has been idle, can continue normal scrolling
        updateHUD();
      }
    }, CONFIG.IDLE_CHECK_INTERVAL);
  }

  function cleanupUserActivityTracking() {
    state.userActivityListeners.forEach(({ event, listener }) => {
      document.removeEventListener(event, listener);
    });
    state.userActivityListeners = [];

    if (state.idleCheckInterval) {
      clearInterval(state.idleCheckInterval);
      state.idleCheckInterval = null;
    }
  }

  function isUserActive() {
    return Date.now() - state.lastUserActivity < CONFIG.USER_ACTIVITY_THRESHOLD;
  }

  /************* Lazy Loading Detection *************/
  function setupContentObserver() {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
    }

    state.lastScrollHeight = document.documentElement.scrollHeight;

    state.mutationObserver = new MutationObserver((mutations) => {
      // Clear existing timeout
      if (state.mutationDebounceTimeout) {
        clearTimeout(state.mutationDebounceTimeout);
      }

      // Debounce rapid changes
      state.mutationDebounceTimeout = setTimeout(() => {
        handleContentChanges(mutations);
      }, CONFIG.MUTATION_DEBOUNCE);
    });

    // Observe with optimized settings for performance
    state.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false, // Don't observe attribute changes for better performance
      characterData: false, // Don't observe text changes
    });
  }

  function handleContentChanges(mutations) {
    try {
      const currentScrollHeight = document.documentElement.scrollHeight;
      const heightIncrease = currentScrollHeight - state.lastScrollHeight;

      // Only process significant height changes
      if (heightIncrease < CONFIG.HEIGHT_CHANGE_THRESHOLD) {
        return;
      }

      // Resume scrolling if we were paused at bottom and content was added
      if (state.pausedAtBottom && heightIncrease > 0 && state.speed > 0) {
        state.pausedAtBottom = false;
        state.scrolling = true;
        requestScroll();
        flashHUD(`📄 New content detected, resuming scroll`, 'success');
        updateHUD();
      }

      // Resume scrolling if we were paused at top and content was added above
      if (state.pausedAtTop && heightIncrease > 0 && state.speed < 0) {
        state.pausedAtTop = false;
        state.scrolling = true;
        requestScroll();
        flashHUD(`📄 Content added above, resuming scroll`, 'success');
        updateHUD();
      }

      state.lastScrollHeight = currentScrollHeight;

    } catch (error) {
      handleError('Content change detection failed', error);
    }
  }

  function cleanupContentObserver() {
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
      state.mutationObserver = null;
    }

    if (state.mutationDebounceTimeout) {
      clearTimeout(state.mutationDebounceTimeout);
      state.mutationDebounceTimeout = null;
    }
  }

  /************* Error Handling *************/
  function handleError(message, error) {
    console.error(`AutoScroll: ${message}`, error);
    state.errorCount++;

    if (state.errorCount >= state.maxErrors) {
      flashHUD(`⚠️ Too many errors, stopping`, 'error');
      state.scrolling = false;
      updateHUD();
      return;
    }

    flashHUD(`⚠️ ${message}`, 'warning');
  }

  /************* HUD *************/
  function createHUD() {
    if (state.hud) {
      state.hud.remove();
    }

    const style = document.createElement('style');
    style.id = 'enhanced-autoscroll-styles';
    style.textContent = `
      #enhanced-autoscroll-hud {
        position:fixed; z-index:999999;
        padding:10px 12px; background:#111; color:#fff;
        font-family:'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace, system-ui;
        font-size:12px; border-radius:8px;
        box-shadow:0 4px 16px rgba(0,0,0,0.7);
        border:1px solid #b91c1c; opacity:0.96;
        max-width:320px; min-width:280px;
        backdrop-filter:blur(4px);
        transition:opacity 0.2s ease;
      }
      #enhanced-autoscroll-hud.hidden { opacity:0; pointer-events:none; }
      .hud-pos-bottom-right { bottom:16px; right:16px; }
      .hud-pos-bottom-left { bottom:16px; left:16px; }
      .hud-pos-top-right { top:16px; right:16px; }
      .hud-pos-top-left { top:16px; left:16px; }
      .hud-btn {
        background:#1a1a1a; border:1px solid #b91c1c; color:#f87171;
        font-size:11px; padding:3px 7px; border-radius:4px;
        cursor:pointer; transition:all 0.15s ease;
        font-family:inherit;
      }
      .hud-btn:hover {
        background:#b91c1c; color:#fff; transform:translateY(-1px);
        box-shadow:0 2px 4px rgba(185,28,28,0.3);
      }
      .hud-btn:active { transform:translateY(0); }
      .hud-status-bar {
        display:flex; justify-content:space-between; align-items:center;
        margin-bottom:8px; padding-bottom:6px;
        border-bottom:1px solid #333;
      }
      .hud-progress-bar {
        height:3px; background:#333; border-radius:2px;
        margin:6px 0; overflow:hidden;
      }
      .hud-progress-fill {
        height:100%; background:linear-gradient(90deg, #22c55e, #16a34a);
        transition:width 0.3s ease; border-radius:2px;
      }
      .hud-info-grid {
        display:grid; grid-template-columns:1fr 1fr;
        gap:4px 8px; margin-bottom:8px; font-size:10px;
        color:#aaa;
      }
      .hud-buttons {
        display:flex; flex-wrap:wrap; gap:4px;
      }
    `;

    // Remove existing styles
    const existingStyle = document.getElementById('enhanced-autoscroll-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    state.hud = document.createElement('div');
    state.hud.id = 'enhanced-autoscroll-hud';
    state.hud.classList.add(getHUDPositionClass());

    if (!state.hudVisible) {
      state.hud.classList.add('hidden');
    }

    state.hud.innerHTML = `
      <div class="hud-status-bar">
        <div id="hud-status" style="font-weight:bold; font-size:13px; color:#ef4444;">PAUSED</div>
        <button id="hud-close" style="background:none; border:none; color:#ef4444; font-size:16px; cursor:pointer; padding:0; line-height:1;" title="Terminate Script">&times;</button>
      </div>

      <div class="hud-progress-bar">
        <div id="hud-progress-fill" class="hud-progress-fill" style="width:0%"></div>
      </div>

      <div class="hud-info-grid">
        <div>Speed: <span id="hud-speed-value">0</span>px/s</div>
        <div>Step: <span id="hud-step-value">0</span></div>
        <div>Direction: <span id="hud-direction">-</span></div>
        <div>Progress: <span id="hud-progress-text">0%</span></div>
      </div>

      <div class="hud-buttons">
        ${makeButton("S", "toggle", "Toggle scroll")}
        ${makeButton("[", "speed-down", "Decrease speed")}
        ${makeButton("]", "speed-up", "Increase speed")}
        ${makeButton("+", "step-up", "Increase step")}
        ${makeButton("-", "step-down", "Decrease step")}
        ${makeButton("R", "reset", "Reset speed")}
        ${makeButton("P", "pos", "Change position")}
        ${makeButton("H", "hide", "Hide/Show HUD")}
      </div>
    `;

    document.body.appendChild(state.hud);

    state.hud.querySelector('#hud-close').addEventListener('click', shutdownScript);
    setupHUDButtons();
    updateHUD();
  }

  function makeButton(label, action, title) {
    return `<button class="hud-btn" data-action="${action}" title="${title}">${label}</button>`;
  }

  function setupHUDButtons() {
    state.hud.querySelectorAll('.hud-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleAction(btn.dataset.action);
      });
    });
  }

  function updateHUD() {
    if (!state.hud) return;

    try {
      // Status
      const status = state.hud.querySelector('#hud-status');
      const progress = calculateScrollProgress();

      let statusText = state.scrolling ? 'SCROLLING' : 'PAUSED';
      if (state.pausedAtBottom) statusText = 'AT BOTTOM';
      if (state.pausedAtTop) statusText = 'AT TOP';

      status.textContent = statusText;
      status.style.color = state.scrolling ? '#22c55e' : '#ef4444';

      // Progress bar and text
      const progressFill = state.hud.querySelector('#hud-progress-fill');
      const progressText = state.hud.querySelector('#hud-progress-text');
      if (progressFill) progressFill.style.width = `${progress}%`;
      if (progressText) progressText.textContent = `${progress}%`;

      // Info grid
      const speedValue = state.hud.querySelector('#hud-speed-value');
      const stepValue = state.hud.querySelector('#hud-step-value');
      const direction = state.hud.querySelector('#hud-direction');

      if (speedValue) speedValue.textContent = Math.abs(state.speed);
      if (stepValue) stepValue.textContent = state.speedStep;
      if (direction) direction.textContent = getScrollDirection();

    } catch (error) {
      handleError('HUD update failed', error);
    }
  }

  /************* Core Actions *************/
  function handleAction(action) {
    try {
      switch (action) {
        case 'toggle': toggleScroll(); break;
        case 'speed-down': changeSpeed(-state.speedStep); break;
        case 'speed-up': changeSpeed(state.speedStep); break;
        case 'reset': resetSpeed(); break;
        case 'hide': toggleHUD(); break;
        case 'step-up': changeStep(10); break;
        case 'step-down': changeStep(-10); break;
        case 'pos': cycleHudPosition(); break;
      }
      saveConfig();
      updateHUD();
    } catch (error) {
      handleError('Action failed', error);
    }
  }

  function toggleScroll() {
    state.scrolling = !state.scrolling;
    state.pausedAtBottom = false;
    state.pausedAtTop = false;

    if (state.scrolling) {
      requestScroll();
      flashHUD(`${getScrollDirection()} Scrolling started`, 'success');
    } else {
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
        state.animationFrame = null;
      }
      flashHUD('⏸️ Scrolling paused', 'info');
    }
  }

  function changeSpeed(delta) {
    const oldDirection = state.speed >= 0;
    state.speed += delta;
    const newDirection = state.speed >= 0;

    // Reset position flags when direction changes
    if (oldDirection !== newDirection) {
      state.pausedAtBottom = false;
      state.pausedAtTop = false;
    }

    const speedAbs = Math.abs(state.speed);
    const directionText = newDirection ? 'down' : 'up';
    flashHUD(`${getScrollDirection()} ${speedAbs}px/s (${directionText})`, 'info');
  }

  function resetSpeed() {
    state.speed = state.prefersReducedMotion
      ? Math.min(CONFIG.DEFAULT_SPEED, 150)
      : CONFIG.DEFAULT_SPEED;
    state.speedStep = CONFIG.DEFAULT_SPEED_STEP;
    state.pausedAtBottom = false;
    state.pausedAtTop = false;
    flashHUD("🔄 Speed & Step reset", 'success');
  }

  function changeStep(delta) {
    state.speedStep = Math.min(
      CONFIG.MAX_SPEED_STEP,
      Math.max(CONFIG.MIN_SPEED_STEP, state.speedStep + delta)
    );
    flashHUD(`Step: ${state.speedStep}`, 'info');
  }

  function toggleHUD() {
    if (!state.hud) return;

    state.hudVisible = !state.hudVisible;

    if (state.hudVisible) {
      state.hud.classList.remove('hidden');
      flashHUD('👁️ HUD visible', 'info');
    } else {
      state.hud.classList.add('hidden');
    }
  }

  function cycleHudPosition() {
    if (!state.hud) return;

    state.hud.classList.remove(getHUDPositionClass());
    state.hudPositionIndex = (state.hudPositionIndex + 1) % CONFIG.HUD_POSITIONS.length;
    state.hud.classList.add(getHUDPositionClass());

    const position = CONFIG.HUD_POSITIONS[state.hudPositionIndex].replace('-', ' ');
    flashHUD(`📍 ${position}`, 'info');
  }

  /************* Core Scrolling *************/
  function requestScroll() {
    if (!state.scrolling) return;

    try {
      // Frame rate limiting for better performance
      const currentTime = performance.now();
      if (currentTime - state.lastFrameTime < state.frameInterval) {
        state.animationFrame = requestAnimationFrame(requestScroll);
        return;
      }
      state.lastFrameTime = currentTime;

      // Pause during active user interaction
      if (isUserActive()) {
        state.animationFrame = requestAnimationFrame(requestScroll);
        return;
      }

      const currentScrollY = window.scrollY;
      const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

      // Check boundaries and pause if reached
      if (state.speed > 0 && currentScrollY >= maxScrollY - 2) {
        // Scrolling down and reached bottom
        state.scrolling = false;
        state.pausedAtBottom = true;
        updateHUD();
        flashHUD('📍 Reached bottom, waiting for new content...', 'warning');
        return;
      }

      if (state.speed < 0 && currentScrollY <= 0) {
        // Scrolling up and reached top
        state.scrolling = false;
        state.pausedAtTop = true;
        updateHUD();
        flashHUD('📍 Reached top', 'warning');
        return;
      }

      // Calculate smooth step based on frame rate
      const step = state.speed / CONFIG.TARGET_FPS;
      window.scrollBy(0, step);

      // Continue animation
      state.animationFrame = requestAnimationFrame(requestScroll);

      // Update HUD periodically (not every frame for performance)
      if (Math.floor(currentTime / 500) !== Math.floor((currentTime - state.frameInterval) / 500)) {
        updateHUD();
      }

    } catch (error) {
      handleError('Scroll animation failed', error);
      state.scrolling = false;
      updateHUD();
    }
  }

  /************* Keyboard Handling *************/
  function keyHandler(e) {
    // Don't interfere with form inputs
    if (e.target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      return;
    }

    // Don't interfere with modifier key combinations
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    const key = e.key.toLowerCase();
    const actions = {
      's': 'toggle',
      '[': 'speed-down',
      ']': 'speed-up',
      'r': 'reset',
      'h': 'hide',
      'p': 'pos',
      '+': 'step-up',
      '=': 'step-up', // Same key as +
      '-': 'step-down',
      '_': 'step-down', // Same key as -
    };

    if (actions[key]) {
      e.preventDefault();
      handleAction(actions[key]);
    }
  }

  /************* Accessibility *************/
  function checkAccessibility() {
    // Check for reduced motion preference
    state.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (state.prefersReducedMotion) {
      // Reduce default speeds for accessibility
      if (Math.abs(state.speed) > 150) {
        state.speed = state.speed > 0 ? 150 : -150;
      }
      flashHUD('♿ Reduced motion mode active', 'info');
    }

    // Listen for preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      state.prefersReducedMotion = e.matches;
      if (e.matches) {
        state.speed = Math.sign(state.speed) * Math.min(Math.abs(state.speed), 150);
        flashHUD('♿ Reduced motion enabled', 'info');
        updateHUD();
      }
    });
  }

  /************* Cleanup *************/
  function shutdownScript() {
    try {
      console.log(`❌ Enhanced AutoScroll v4.0 terminated on ${location.hostname}`);

      // Stop scrolling
      state.scrolling = false;
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
      }

      // Cleanup observers and listeners
      cleanupContentObserver();
      cleanupUserActivityTracking();
      document.removeEventListener('keydown', keyHandler);

      // Remove UI
      if (state.hud) {
        state.hud.remove();
        state.hud = null;
      }

      // Remove styles
      const style = document.getElementById('enhanced-autoscroll-styles');
      if (style) {
        style.remove();
      }

      flashHUD('👋 AutoScroll terminated', 'info');

    } catch (error) {
      console.error('AutoScroll: Cleanup failed', error);
    }
  }

  /************* Initialization *************/
  function init() {
    try {
      console.log(`✅ Enhanced AutoScroll v4.0 active on ${location.hostname}`);

      // Load configuration
      loadConfig();

      // Setup accessibility
      checkAccessibility();

      // Create UI
      createHUD();

      // Setup observers and trackers
      setupContentObserver();
      setupUserActivityTracking();

      // Setup keyboard handling
      document.addEventListener('keydown', keyHandler);

      // Initialize display
      updateHUD();

      // Welcome message
      setTimeout(() => {
        flashHUD('🚀 Enhanced AutoScroll v4.0 ready!', 'success');
      }, 500);

    } catch (error) {
      console.error('AutoScroll: Initialization failed', error);

      // Fallback: try basic initialization
      try {
        createHUD();
        document.addEventListener('keydown', keyHandler);
      } catch (fallbackError) {
        console.error('AutoScroll: Fallback initialization also failed', fallbackError);
      }
    }
  }

  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.scrolling) {
      // Pause when page is hidden
      state.scrolling = false;
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
        state.animationFrame = null;
      }
      updateHUD();
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
