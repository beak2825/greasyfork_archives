// ==UserScript==
// @name         ChatGPT Response Complete Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       ramhaidar
// @description  Sends a desktop notification with text preview when ChatGPT finishes a response. Robustly handles 'New Chat' detection and prevents notification spam.
// @homepage     https://github.com/ramhaidar/ChatGPT-Response-Complete-Notifier
// @source       https://github.com/ramhaidar/ChatGPT-Response-Complete-Notifier/raw/refs/heads/main/chatgpt-response-complete-notifier.user.js
// @license      GPL-3.0
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562945/ChatGPT%20Response%20Complete%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/562945/ChatGPT%20Response%20Complete%20Notifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // [CRN] Configuration
  const CONFIG = {
    DEBUG_MODE: false,
    NOTIFICATION_COOLDOWN: 3000,
    PERMISSION_KEY: 'crn_notification_permission_granted',
    POLL_INTERVAL: 500 // Check status every 500ms
  };

  // [CRN] State tracking
  let state = {
    isStreaming: false,
    lastNotificationTime: 0,
    lastButtonState: null,
    buttonObserver: null,
    pollInterval: null,
    notificationPermissionGranted: false,
    observedForm: null,
    lastUrlPath: window.location.pathname // Track URL changes
  };

  // [CRN] Enhanced logging
  function crnLog(message, data = null) {
    if (CONFIG.DEBUG_MODE) {
      const timestamp = new Date().toISOString();
      const logMessage = `[CRN] [${timestamp}] ${message}`;
      console.log(logMessage);
      if (data !== null && typeof data === 'object') {
        console.log(`[CRN] DATA:`, JSON.stringify(data, null, 2));
      }
    }
  }

  // [CRN] Check notification permission
  async function checkNotificationPermissionNative() {
    crnLog('🔑 Checking native notification permission...');
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') {
      state.notificationPermissionGranted = true;
      return true;
    }
    const userDenied = GM_getValue('notification_permission_denied', false);
    if (userDenied) return false;

    try {
      const permission = await Notification.requestPermission();
      state.notificationPermissionGranted = permission === 'granted';
      if (state.notificationPermissionGranted) {
        GM_setValue(CONFIG.PERMISSION_KEY, true);
        return true;
      } else {
        GM_setValue('notification_permission_denied', true);
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  // [CRN] Get current button state
  function getCurrentButtonState() {
    // Primary selectors for the send/stop button
    const buttonSelectors = [
      '#composer-submit-button',
      'button[data-testid="send-button"]',
      'button[data-testid="stop-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label="Stop streaming"]'
    ];

    let button = null;
    for (const selector of buttonSelectors) {
      button = document.querySelector(selector);
      if (button) break;
    }

    if (!button) return null;

    const dataTestId = button.getAttribute('data-testid');
    const ariaLabel = button.getAttribute('aria-label');
    const isDisabled = button.disabled;

    return {
      buttonElement: button,
      dataTestId: dataTestId,
      ariaLabel: ariaLabel,
      isDisabled: isDisabled,
      isSendButton: dataTestId === 'send-button' && ariaLabel === 'Send prompt',
      isStopButton: dataTestId === 'stop-button' && ariaLabel === 'Stop streaming',
      timestamp: Date.now()
    };
  }

  // [CRN] Handle button state changes
  function handleButtonStateChange(buttonState) {
    // Case 1: Streaming started (Stop button visible)
    if (buttonState.isStopButton) {
      if (!state.isStreaming) {
        crnLog('▶️ Streaming started');
        state.isStreaming = true;
      }
      return;
    }

    // Case 2: Response COMPLETED (Send button visible AND disabled)
    // Note: Button is disabled immediately after streaming stops
    if (buttonState.isSendButton && buttonState.isDisabled && state.isStreaming) {
      crnLog('✅ Response completed!');
      state.isStreaming = false;
      showResponseCompleteNotification();
      return;
    }

    // Case 3: Reset states (e.g. user clicked New Chat manually while streaming was stuck, or page refreshed)
    if (buttonState.isSendButton && !buttonState.isDisabled) {
      if (state.isStreaming) {
        // If we were streaming, but now see an enabled send button, we might have missed the stop.
        // But usually this happens on New Chat where context resets.
        crnLog('🔄 Resetting streaming state (Ready)');
        state.isStreaming = false;
      }
    }
  }

  // [CRN] Show notification
  function showResponseCompleteNotification() {
    const now = Date.now();
    if (now - state.lastNotificationTime < CONFIG.NOTIFICATION_COOLDOWN) return;

    crnLog('🔔 Response complete - showing notification');

    if (!state.notificationPermissionGranted) {
      checkNotificationPermissionNative().then(granted => {
        if (granted) actuallyShowNotification();
      });
      return;
    }

    actuallyShowNotification();
  }

  // [CRN] Show native notification
  function actuallyShowNotification() {
    if (!('Notification' in window)) {
      fallbackToGMNotification();
      return;
    }

    try {
      const lastAssistantMessage = document.querySelector([
        'div[data-message-author-role="assistant"]:last-of-type div.markdown',
        'div[data-message-author-role="assistant"]:last-of-type div.prose',
        'div[data-message-author-role="assistant"]:last-of-type > div > div',
        'div[data-message-author-role="assistant"]:last-of-type span',
        'div[data-message-author-role="assistant"]:last-of-type'
      ].join(', '));

      let previewText = 'ChatGPT response completed';

      if (lastAssistantMessage) {
        const content = lastAssistantMessage.textContent?.trim() || '';
        if (content) {
          const cleanContent = content.replace(/\s+/g, ' ').trim();
          previewText = cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
        }
      }

      const notification = new Notification('✅ ChatGPT Response Complete', {
        body: previewText,
        icon: 'https://chatgpt.com/favicon.ico',
        badge: 'https://chatgpt.com/favicon.ico',
        silent: false
      });

      notification.onclick = function () {
        window.focus();
        this.close();
      };

      state.lastNotificationTime = Date.now();

    } catch (error) {
      fallbackToGMNotification();
    }
  }

  // [CRN] Fallback
  function fallbackToGMNotification() {
    try {
      if (typeof GM_notification === 'function') {
        GM_notification({
          title: '✅ ChatGPT Response Complete',
          text: 'Response completed',
          image: 'https://chatgpt.com/favicon.ico',
          timeout: 8000,
          onclick: function () { window.focus(); }
        });
      } else {
        alert('ChatGPT Response Complete!');
        window.focus();
      }
    } catch (e) { }
  }

  // [CRN] Setup Button Observer (Watches attributes of the specific form)
  function setupButtonObserver() {
    if (state.buttonObserver) {
      state.buttonObserver.disconnect();
      state.buttonObserver = null;
    }

    // Find the container form
    const container = document.querySelector('form[aria-label="Chat input form"]') ||
      document.querySelector('div[data-testid="conversation-container"] footer');

    if (!container) {
      crnLog('⚠️ Input container not found yet.');
      return;
    }

    state.observedForm = container;

    state.buttonObserver = new MutationObserver(() => {
      const currentState = getCurrentButtonState();
      if (currentState) handleButtonStateChange(currentState);
    });

    state.buttonObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-testid', 'aria-label', 'disabled', 'class']
    });

    // Initial check
    const initialState = getCurrentButtonState();
    if (initialState) handleButtonStateChange(initialState);
  }

  // [CRN] Main Heartbeat (Polling)
  // Handles "New Chat" detection via URL and Form presence checks
  function startPolling() {
    if (state.pollInterval) clearInterval(state.pollInterval);

    state.pollInterval = setInterval(() => {
      // 1. Check for NEW CHAT via URL
      const currentPath = window.location.pathname;

      // If URL changed (e.g. /c/abc -> /c/def or /c/abc -> /)
      if (state.lastUrlPath !== currentPath) {
        crnLog(`🌐 URL changed from "${state.lastUrlPath}" to "${currentPath}". Resetting context.`);
        state.lastUrlPath = currentPath;
        state.isStreaming = false; // Force reset
        setupButtonObserver(); // Re-attach to new DOM
        return; // Skip button check this tick
      }

      // 2. Check if our observed form is still alive
      // If the form was removed from DOM (e.g. during a UI swap), re-initialize
      if (state.observedForm && !document.body.contains(state.observedForm)) {
        crnLog('⚠️ Observed form removed from DOM. Re-initializing.');
        state.isStreaming = false;
        setupButtonObserver();
        return;
      }

      // 3. Standard Button State Check (if observer is working, this is redundant but safe)
      // The observer handles this efficiently, but we keep a check here just in case
      // the observer missed something or hasn't attached yet.
      const currentState = getCurrentButtonState();
      if (currentState) {
        handleButtonStateChange(currentState);
      }

    }, CONFIG.POLL_INTERVAL);

    crnLog('✅ Polling heartbeat started');
  }

  // [CRN] Initialize
  async function initialize() {
    crnLog('🚀 Initializing (No Spam Version)');

    state.notificationPermissionGranted = await checkNotificationPermissionNative();

    setupButtonObserver();
    startPolling();

    window.addEventListener('beforeunload', () => {
      if (state.buttonObserver) state.buttonObserver.disconnect();
      clearInterval(state.pollInterval);
    });

    crnLog('✅ Initialization Complete');
  }

  // [CRN] Start
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initialize();
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 200));
    window.addEventListener('load', () => setTimeout(initialize, 500));
  }

  // [CRN] Expose test function to global scope for console testing
  unsafeWindow.testCRNNotification = function () {
    crnLog('🧪 Manual test');
    actuallyShowNotification();
  };
})();
