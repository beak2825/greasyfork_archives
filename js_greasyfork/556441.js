// ==UserScript==
// @name         Aceable Autoanswer with Gemini AI
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Auto-answer Aceable questions using Gemini AI, auto-play videos, auto-next, prevent idle refresh, works in background
// @author       Coolbossco (original author: DudeUnoob)
// @match        https://*.aceable.com/*
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @connect      gitlab.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556441/Aceable%20Autoanswer%20with%20Gemini%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/556441/Aceable%20Autoanswer%20with%20Gemini%20AI.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========================================
  // CONFIGURATION - STORED IN TAMPERMONKEY STORAGE
  // ========================================
  function getConfig() {
    const defaults = {
      geminiApiKey: "YOUR_API_KEY_HERE",
      useAI: true,
      aiModel: "gemini-2.5-flash-lite",
      scriptEnabled: true,
      debugLogging: false,
      // Profile Data for Verification
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      birthDate: "", // Format: Month DD, YYYY (e.g. August 15, 2005)
    };

    // Try GM storage first
    let stored = GM_getValue("aceableScriptConfig");
    
    // Migration: If not in GM but is in localStorage, migrate it
    if (!stored) {
        const local = localStorage.getItem("aceableScriptConfig");
        if (local) {
            try {
                stored = JSON.parse(local);
                GM_setValue("aceableScriptConfig", stored); // Save to GM
                console.log("[Aceable Script] Migrated settings from localStorage to GM storage");
            } catch (e) {
                console.error("[Aceable Script] Error migrating settings:", e);
            }
        }
    }

    const config = stored ? { ...defaults, ...stored } : defaults;
    // Always use gemini-2.5-flash-lite
    config.aiModel = "gemini-2.5-flash-lite";
    return config;
  }

  function saveConfig(config) {
    GM_setValue("aceableScriptConfig", config);
  }

  function getStoredQuestions() {
    let questions = GM_getValue("questions");
    if (!questions) {
        const local = localStorage.getItem("questions");
        if (local) {
             try {
                questions = JSON.parse(local);
                GM_setValue("questions", questions);
             } catch(e) {}
        }
    }
    return questions || {};
  }

  function saveStoredQuestions(questions) {
    GM_setValue("questions", questions);
  }

  let config = getConfig();

  // Wait for DOM to be ready
  function init() {
    // --- Break Detection State ---
    let isOnBreak = false;
    let breakEndTime = null;
    let breakCheckInterval = null;
    let breakLoggedOnce = false;

    // --- AI / Question Handling State ---
    let playFactProcessing = false;
    let testQuestionProcessing = false;
    let categoryQuestionProcessing = false;
    let lastFoafFact = "";
    let lastFoafFactTime = 0;

    // --- Version Check ---
    const UPDATE_URL = "https://gitlab.com/Coolbossco/Aceable/-/raw/main/userscript.js"; // TODO: Replace with actual URL
    let isCheckingUpdate = false;

    // --- Settings Menu ---
    let settingsMenuOpen = false;

    // Inject CSS for Settings Menu
    function injectSettingsCSS() {
      if (document.getElementById("aceable-settings-css")) return;

      const style = document.createElement("style");
      style.id = "aceable-settings-css";
      style.textContent = `
        .aceable-settings-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.8); z-index: 999999;
          display: flex; justify-content: center; align-items: center;
          backdrop-filter: blur(5px);
        }
        .aceable-settings-modal {
          background: #1a1a1a; color: #e0e0e0;
          width: 700px; height: 500px;
          border-radius: 12px; display: flex; overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
          border: 1px solid #333; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .aceable-settings-sidebar {
          width: 200px; background: #252525;
          border-right: 1px solid #333; display: flex; flex-direction: column;
        }
        .aceable-settings-sidebar-header {
          padding: 20px; border-bottom: 1px solid #333;
          font-size: 16px; font-weight: bold; color: #0f0;
          display: flex; align-items: center; gap: 10px;
        }
        .aceable-nav-item {
          padding: 15px 20px; cursor: pointer; transition: background 0.2s;
          border-left: 3px solid transparent; color: #aaa; font-size: 14px;
          background: none; border: none; text-align: left; width: 100%; outline: none;
        }
        .aceable-nav-item:hover { background: #2a2a2a; color: #fff; }
        .aceable-nav-item.active {
          background: #2a2a2a; color: #fff; border-left-color: #0f0;
        }
        .aceable-settings-content {
          flex: 1; display: flex; flex-direction: column;
        }
        .aceable-tab-content {
          flex: 1; padding: 30px; overflow-y: auto; display: none;
        }
        .aceable-tab-content.active { display: block; }
        .aceable-settings-footer {
          padding: 15px 30px; background: #252525; border-top: 1px solid #333;
          display: flex; justify-content: flex-end; gap: 10px;
        }
        
        /* Form Elements */
        .aceable-form-group { margin-bottom: 20px; }
        .aceable-label { display: block; margin-bottom: 8px; font-size: 13px; color: #aaa; }
        .aceable-input {
          width: 100%; padding: 10px; background: #333; border: 1px solid #444;
          color: #fff; border-radius: 6px; font-size: 14px; box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .aceable-input:focus { border-color: #0f0; outline: none; }
        .aceable-helper { font-size: 12px; color: #666; margin-top: 5px; }
        
        /* Toggle Switch */
        .aceable-toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #333;
        }
        .aceable-toggle-label { font-weight: 500; font-size: 15px; color: #fff; }
        .aceable-switch {
          position: relative; display: inline-block; width: 50px; height: 26px;
        }
        .aceable-switch input { opacity: 0; width: 0; height: 0; }
        .aceable-slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #444; transition: .4s; border-radius: 34px;
        }
        .aceable-slider:before {
          position: absolute; content: ""; height: 20px; width: 20px;
          left: 3px; bottom: 3px; background-color: white;
          transition: .4s; border-radius: 50%;
        }
        input:checked + .aceable-slider { background-color: #0f0; }
        input:checked + .aceable-slider:before { transform: translateX(24px); }
        
        /* Buttons */
        .aceable-btn {
          padding: 8px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;
          border: none; font-size: 14px; transition: opacity 0.2s;
        }
        .aceable-btn:hover { opacity: 0.9; }
        .aceable-btn-primary { background: #0f0; color: #000; }
        .aceable-btn-secondary { background: #444; color: #fff; }
        
        /* Grid for Profile */
        .aceable-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        /* Toast Notifications */
        .aceable-toast-container {
          position: fixed; bottom: 20px; right: 20px; z-index: 1000000;
          display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .aceable-toast {
          background: #1a1a1a; color: #fff; padding: 12px 20px;
          border-radius: 8px; border-left: 4px solid #444;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
          font-family: 'Segoe UI', Roboto, sans-serif; font-size: 14px;
          display: flex; align-items: center; gap: 10px;
          opacity: 0; transform: translateX(20px);
          animation: aceable-toast-in 0.3s forwards;
          pointer-events: auto; min-width: 250px; max-width: 400px;
        }
        .aceable-toast.success { border-left-color: #0f0; }
        .aceable-toast.error { border-left-color: #f00; }
        .aceable-toast.info { border-left-color: #00f; }
        
        .aceable-toast-content { flex: 1; }
        .aceable-toast-action {
          background: #333; border: none; color: #0f0; padding: 5px 10px;
          border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;
          margin-left: 10px;
        }
        .aceable-toast-action:hover { background: #444; }

        @keyframes aceable-toast-in {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes aceable-toast-out {
          to { opacity: 0; transform: translateX(20px); }
        }
      `;
      document.head.appendChild(style);
    }

    function showToast(message, type = "info", action = null) {
      let container = document.getElementById("aceable-toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "aceable-toast-container";
        container.className = "aceable-toast-container";
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.className = `aceable-toast ${type}`;
      
      let icon = "ℹ️";
      if (type === "success") icon = "✅";
      if (type === "error") icon = "❌";

      let html = `<span>${icon}</span><div class="aceable-toast-content">${message}</div>`;
      
      if (action) {
        html += `<button class="aceable-toast-action">${action.text}</button>`;
      }

      toast.innerHTML = html;
      container.appendChild(toast);

      if (action) {
        const btn = toast.querySelector(".aceable-toast-action");
        btn.addEventListener("click", () => {
          action.callback();
          removeToast();
        });
      }

      const removeToast = () => {
        toast.style.animation = "aceable-toast-out 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
      };

      // Auto remove after 5 seconds unless it has an action
      if (!action) {
        setTimeout(removeToast, 5000);
      }
    }

    function checkForUpdates() {
      if (isCheckingUpdate) return;
      isCheckingUpdate = true;
      log("🔄 Checking for updates...", false, false);
      
      const btn = document.getElementById("settings-check-update");
      if (btn) {
          btn.disabled = true;
          btn.textContent = "Checking...";
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: UPDATE_URL,
        onload: function(response) {
          isCheckingUpdate = false;
          if (btn) {
              btn.disabled = false;
              btn.textContent = "Check for Updates";
          }

          if (response.status !== 200) {
            log(`❌ Update check failed: HTTP ${response.status}`, true);
            showToast(`Update check failed (HTTP ${response.status})`, "error");
            return;
          }

          const remoteVersionMatch = response.responseText.match(/@version\s+([\d.]+)/);
          if (!remoteVersionMatch) {
            log("❌ Could not parse remote version", true);
            showToast("Could not parse remote version", "error");
            return;
          }

          const remoteVersion = remoteVersionMatch[1];
          const localVersion = GM_info.script.version;

          if (remoteVersion !== localVersion) {
             const msg = `Update available! v${remoteVersion}`;
             log(`✨ ${msg}`);
             showToast(msg, "success", {
               text: "Update Now",
               callback: () => window.open("https://greasyfork.org/en/scripts/556441-aceable-autoanswer-with-gemini-ai", '_blank')
             });
          } else {
            log("✅ You are on the latest version.");
            showToast(`You are on the latest version (${localVersion})`, "success");
          }
        },
        onerror: function(err) {
          isCheckingUpdate = false;
          if (btn) {
              btn.disabled = false;
              btn.textContent = "Check for Updates";
          }
          log("❌ Update check error", true);
          console.error(err);
          showToast("Network error checking for updates", "error");
        }
      });
    }

    function createSettingsMenu() {
      injectSettingsCSS();

      // Check if menu is already open
      const existingOverlay = document.getElementById("aceable-settings-overlay");
      if (existingOverlay) {
        existingOverlay.remove();
        settingsMenuOpen = false;
        return;
      }

      settingsMenuOpen = true;
      const overlay = document.createElement("div");
      overlay.id = "aceable-settings-overlay";
      overlay.className = "aceable-settings-overlay";

      overlay.innerHTML = `
        <div class="aceable-settings-modal">
          <div class="aceable-settings-sidebar">
            <div class="aceable-settings-sidebar-header">
              <span>⚙️ Settings</span>
            </div>
            <button class="aceable-nav-item active" data-tab="general">General</button>
            <button class="aceable-nav-item" data-tab="verification">Verification</button>
          </div>
          
          <div class="aceable-settings-content">
            <!-- General Tab -->
            <div id="tab-general" class="aceable-tab-content active">
              <div class="aceable-toggle-row">
                <div>
                  <div class="aceable-toggle-label">Script Enabled</div>
                  <div class="aceable-helper">Master switch to enable/disable all automation</div>
                </div>
                <label class="aceable-switch">
                  <input type="checkbox" id="setting-enabled" ${config.scriptEnabled ? "checked" : ""}>
                  <span class="aceable-slider"></span>
                </label>
              </div>

              <div class="aceable-toggle-row">
                <div>
                  <div class="aceable-toggle-label">Use AI for Answers</div>
                  <div class="aceable-helper">Enable Gemini AI to answer questions</div>
                </div>
                <label class="aceable-switch">
                  <input type="checkbox" id="setting-use-ai" ${config.useAI ? "checked" : ""}>
                  <span class="aceable-slider"></span>
                </label>
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Gemini API Key</label>
                <input type="text" class="aceable-input" id="setting-api-key" 
                       value="${config.geminiApiKey}" placeholder="YOUR_API_KEY_HERE">
                <div class="aceable-helper">
                  Get free key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #0f0;">aistudio.google.com</a>
                </div>
              </div>

              <div class="aceable-form-group" style="margin-top: 20px; border-top: 1px solid #333; padding-top: 20px;">
                  <button id="settings-check-update" class="aceable-btn aceable-btn-secondary" style="width: 100%;">Check for Updates</button>
                  <div class="aceable-helper" style="text-align: center;">
                      Current Version: ${GM_info.script.version}
                  </div>
              </div>
            </div>

            <!-- Verification Tab -->
            <div id="tab-verification" class="aceable-tab-content">
              <div style="margin-bottom: 20px; padding: 10px; background: #333; border-radius: 6px; font-size: 13px; color: #ddd;">
                ℹ️ <strong>Identity Verification:</strong> Aceable may ask security questions based on your profile. Fill these out so the AI can auto-answer them.
              </div>
              
              <div class="aceable-grid-2">
                <div class="aceable-form-group">
                  <label class="aceable-label">First Name</label>
                  <input type="text" class="aceable-input" id="setting-first-name" value="${config.firstName || ''}">
                </div>
                <div class="aceable-form-group">
                  <label class="aceable-label">Last Name</label>
                  <input type="text" class="aceable-input" id="setting-last-name" value="${config.lastName || ''}">
                </div>
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Phone Number</label>
                <input type="text" class="aceable-input" id="setting-phone" value="${config.phoneNumber || ''}" placeholder="555-555-5555">
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Email</label>
                <input type="text" class="aceable-input" id="setting-email" value="${config.email || ''}">
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Birth Date</label>
                <input type="text" class="aceable-input" id="setting-birthdate" value="${config.birthDate || ''}" placeholder="Month DD, YYYY">
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Address</label>
                <input type="text" class="aceable-input" id="setting-address" value="${config.address || ''}">
              </div>

              <div class="aceable-grid-2">
                <div class="aceable-form-group">
                  <label class="aceable-label">City</label>
                  <input type="text" class="aceable-input" id="setting-city" value="${config.city || ''}">
                </div>
                <div class="aceable-form-group">
                  <label class="aceable-label">State</label>
                  <input type="text" class="aceable-input" id="setting-state" value="${config.state || ''}">
                </div>
              </div>

              <div class="aceable-form-group">
                <label class="aceable-label">Zip Code</label>
                <input type="text" class="aceable-input" id="setting-zip" value="${config.zipCode || ''}">
              </div>
            </div>

            <div class="aceable-settings-footer">
              <button id="settings-cancel" class="aceable-btn aceable-btn-secondary">Cancel</button>
              <button id="settings-save" class="aceable-btn aceable-btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Tab Switching Logic
      const navItems = overlay.querySelectorAll('.aceable-nav-item');
      const tabContents = overlay.querySelectorAll('.aceable-tab-content');

      navItems.forEach(item => {
        item.addEventListener('click', () => {
          // Remove active class from all
          navItems.forEach(n => n.classList.remove('active'));
          tabContents.forEach(t => t.classList.remove('active'));

          // Add active class to clicked
          item.classList.add('active');
          const tabId = `tab-${item.dataset.tab}`;
          document.getElementById(tabId).classList.add('active');
        });
      });

      // Event handlers
      const closeMenu = () => {
        overlay.remove();
        settingsMenuOpen = false;
      };

      document.getElementById("settings-check-update").addEventListener("click", checkForUpdates);

      document.getElementById("settings-save").addEventListener("click", () => {
        config.scriptEnabled = document.getElementById("setting-enabled").checked;
        config.useAI = document.getElementById("setting-use-ai").checked;
        config.geminiApiKey = document.getElementById("setting-api-key").value.trim();
        config.aiModel = "gemini-2.5-flash-lite";

        // Save profile data
        config.firstName = document.getElementById("setting-first-name").value.trim();
        config.lastName = document.getElementById("setting-last-name").value.trim();
        config.phoneNumber = document.getElementById("setting-phone").value.trim();
        config.email = document.getElementById("setting-email").value.trim();
        config.address = document.getElementById("setting-address").value.trim();
        config.city = document.getElementById("setting-city").value.trim();
        config.state = document.getElementById("setting-state").value.trim();
        config.zipCode = document.getElementById("setting-zip").value.trim();
        config.birthDate = document.getElementById("setting-birthdate").value.trim();

        saveConfig(config);
        log("⚙️ Settings saved!", false, true);
        closeMenu();

        // Reload if script was re-enabled
        if (config.scriptEnabled) {
          log("✅ Script enabled - resuming automation");
        } else {
          log("⏸️ Script disabled - paused");
        }
      });

      document.getElementById("settings-cancel").addEventListener("click", closeMenu);

      // Close on overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeMenu();
        }
      });

      // Close on Escape key
      const escapeHandler = (e) => {
        if (e.key === "Escape") {
          closeMenu();
          document.removeEventListener("keydown", escapeHandler);
        }
      };
      document.addEventListener("keydown", escapeHandler);
    }

    // Keyboard shortcut listener (Ctrl+Shift+A / Cmd+Shift+A)
    document.addEventListener("keydown", (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (modifierKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        createSettingsMenu();
      }
    });

    // --- Prevent Background Tab Throttling ---
    let audioContext;
    let oscillator;
    let gainNode;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      gainNode.gain.value = 0; // Silent
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Try to start oscillator - may be suspended until user interaction
      try {
        oscillator.start();
        debug("[Aceable Script] Background mode active");
      } catch (startErr) {
        // Oscillator may not start if AudioContext is suspended
        // It will be resumed on first user interaction via keepAlive()
        debug("[Aceable Script] Background mode initialized (will activate on user interaction)");
      }
    } catch (err) {
      console.warn("[Aceable Script] Could not enable background mode:", err);
    }

    // --- Debug Panel ---
    const panel = document.createElement("div");
    panel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 350px;
      max-height: 250px;
      overflow-y: auto;
      background: rgba(0,0,0,0.9);
      color: #0f0;
      font-family: monospace;
      font-size: 11px;
      padding: 10px;
      border-radius: 8px;
      z-index: 99999;
      white-space: pre-line;
      border: 2px solid #0f0;
    `;
    panel.innerText = `[Aceable AI Script v2.1]\nAI: ${config.useAI ? "ENABLED" : "DISABLED"}\n`;
    document.body.appendChild(panel);

    // Add click handler to panel to open settings
    panel.style.cursor = "pointer";
    panel.title =
      "Click to open settings (or press Ctrl+Shift+A / Cmd+Shift+A)";
    panel.addEventListener("click", createSettingsMenu);

    let logs = [];

    function debug(...args) {
      if (config.debugLogging) {
        console.log(...args);
      }
    }

    function log(msg, isError = false, isWarning = false) {
      const timestamp = Date.now();
      const timeStr = new Date(timestamp).toLocaleTimeString();
      const line = `[${timeStr}] ${msg}`;
      logs.push({
        time: timestamp,
        text: line,
        error: isError,
        warning: isWarning,
      });
      
      if (isError) {
        console.error("[Aceable Script]", msg);
      } else if (config.debugLogging) {
        console[isWarning ? "warn" : "log"]("[Aceable Script]", msg);
      }
      
      refreshPanel();
    }

    function refreshPanel() {
      const cutoff = Date.now() - 5 * 60 * 1000; // 5 min
      logs = logs.filter((l) => l.time >= cutoff);
      const statusLine = config.scriptEnabled
        ? `AI: ${config.useAI ? "ENABLED" : "DISABLED"}`
        : `SCRIPT DISABLED`;
      panel.innerText =
        `[Aceable AI Script v2.1]\n${statusLine}\n` +
        logs.map((l) => l.text).join("\n");
      panel.scrollTop = panel.scrollHeight;
    }

    // --- Break Detection System ---
    function detectBreakPopup() {
      // Look for the break notification popup
      const bodyText = document.body.innerText || "";

      // Check for daily limit lock (12 hours)
      const dailyLimitRegex =
        /course is locked.*daily limit.*unlock in (\d+) hour/i;
      const dailyMatch = bodyText.match(dailyLimitRegex);

      if (dailyMatch) {
        const hours = parseInt(dailyMatch[1]);
        if (!isOnBreak) {
          isOnBreak = true;
          breakEndTime = Date.now() + hours * 60 * 60 * 1000;
          breakLoggedOnce = false;
          log(
            `🔒 DAILY LIMIT REACHED: ${hours} hours until unlock`,
            false,
            true,
          );
          startBreakCountdown();
        }
        return true;
      }

      // Check for break/lock message (minutes)
      const breakRegex =
        /course is locked.*required to take a break.*resume in (\d+) minute/i;
      const match = bodyText.match(breakRegex);

      if (match) {
        const minutes = parseInt(match[1]);
        if (!isOnBreak) {
          isOnBreak = true;
          breakEndTime = Date.now() + minutes * 60 * 1000;
          breakLoggedOnce = false;
          log(`⏸️ BREAK DETECTED: ${minutes} minutes required`, false, true);
          startBreakCountdown();
        }
        return true;
      }

      // Check if break is over
      if (isOnBreak && breakEndTime && Date.now() >= breakEndTime) {
        isOnBreak = false;
        breakEndTime = null;
        breakLoggedOnce = false;
        log("✅ Break over - resuming automation", false, true);
        if (breakCheckInterval) {
          clearInterval(breakCheckInterval);
          breakCheckInterval = null;
        }
        // Click continue learning button after break
        handleContinueLearningButton();
      }

      return isOnBreak;
    }

    // --- Verification Popup System ---
    function detectVerificationPopup() {
        const verifyModal = document.querySelector('.gritDialogScreen--verifyMultichoice');
        if (!verifyModal) return false;

        const questionHeader = verifyModal.querySelector('h1[data-test="header"]');
        if (!questionHeader) return false;

        const questionText = questionHeader.innerText.trim();
        log(`🔒 Verification Question Detected: "${questionText}"`);

        // Define matchers for different profile fields
        // The question format is usually "Fill in the blank: My [field] is [value with blank]"
        // Example: "Fill in the blank: My phone number is 513-399-92_6"
        // Example: "Fill in the blank: My birth date is August 15, 20__."
        
        const matchers = [
            { field: 'phoneNumber', pattern: /phone number/i },
            { field: 'email', pattern: /email/i },
            { field: 'firstName', pattern: /first name/i },
            { field: 'lastName', pattern: /last name/i },
            { field: 'address', pattern: /address/i },
            { field: 'city', pattern: /city/i },
            { field: 'state', pattern: /state/i },
            { field: 'zipCode', pattern: /zip code/i },
            { field: 'birthDate', pattern: /birth date/i }
        ];

        let targetField = null;
        for (const m of matchers) {
            if (m.pattern.test(questionText)) {
                targetField = m.field;
                break;
            }
        }

        if (!targetField) {
            log("⚠️ Could not identify profile field for verification question", true);
            return false;
        }

        const userValue = config[targetField];
        if (!userValue) {
            log(`⚠️ Missing profile data for '${targetField}' - cannot auto-answer`, true);
            return false;
        }

        // Find the missing part in the question text if possible, or just look for the answer options
        // The question usually contains the partial value. We need to find which option completes it.
        // However, simply checking which option is contained in the user's full value is usually sufficient and robust.
        
        const options = Array.from(verifyModal.querySelectorAll('button[data-test="popupAnswer"]'));
        log(`Found ${options.length} options for verification`);

        for (const btn of options) {
            const optionText = btn.innerText.trim();
            // Check if the option text is part of the user's value
            // We handle case insensitivity
            if (userValue.toLowerCase().includes(optionText.toLowerCase())) {
                log(`✅ Found matching verification answer: "${optionText}" (matches "${userValue}")`);
                
                // Add a small delay to simulate human reaction
                setTimeout(() => {
                    btn.click();
                    log("Clicked verification answer");
                }, 1500 + Math.random() * 1000);
                
                return true;
            }
        }

        log(`⚠️ No option matched user value "${userValue}"`, true);
        return false;
    }

    function handleContinueLearningButton() {
      const continueBtn = document.querySelector(
        '[data-test="continueLearningButton"]',
      );
      if (continueBtn) {
        log("Clicking Continue Learning button");
        continueBtn.click();
        // Re-check for break timer after clicking
        setTimeout(() => {
          detectBreakPopup();
        }, 1000);
      }
    }

    function startBreakCountdown() {
      if (breakCheckInterval) {
        clearInterval(breakCheckInterval);
      }

      breakCheckInterval = setInterval(() => {
        if (!breakEndTime) {
          clearInterval(breakCheckInterval);
          breakCheckInterval = null;
          return;
        }

        const remaining = breakEndTime - Date.now();
        if (remaining <= 0) {
          isOnBreak = false;
          breakEndTime = null;
          clearInterval(breakCheckInterval);
          breakCheckInterval = null;
          log("✅ Break over - resuming automation", false, true);
        } else {
          const hours = Math.floor(remaining / 3600000);
          const mins = Math.floor((remaining % 3600000) / 60000);
          const secs = Math.floor((remaining % 60000) / 1000);

          if (hours > 0) {
            log(`⏳ Time remaining: ${hours}h ${mins}m`, false, true);
          } else {
            log(`⏳ Time remaining: ${mins}m ${secs}s`, false, true);
          }
        }
      }, 10000); // Update every 10 seconds
    }

    // --- Gemini AI Integration (FIXED WITH COMPREHENSIVE LOGGING) ---
    async function askGeminiForOrder(question, items) {
      debug("=== AI DEBUG: askGeminiForOrder called ===");
      debug("AI Config:", {
        useAI: config.useAI,
        hasApiKey: config.geminiApiKey !== "YOUR_API_KEY_HERE",
        apiKeyLength: config.geminiApiKey.length,
        model: config.aiModel,
      });

      if (!config.useAI) {
        debug("AI DEBUG: AI is disabled in config");
        log("AI disabled in settings", false, true);
        return null;
      }

      if (config.geminiApiKey === "YOUR_API_KEY_HERE" || !config.geminiApiKey) {
        debug("AI DEBUG: No API key configured");
        log("⚠️ No API key configured", true);
        return null;
      }

      debug("AI DEBUG: Question:", question);
      debug("AI DEBUG: Items to order:", items);

      const prompt = `You are helping with a driving education course question that requires ordering steps in the correct sequence.

Question: ${question}

Items to order (currently in random order):
${items.map((item, i) => `${i + 1}. ${item}`).join("\n")}

Please respond with ONLY a comma-separated list of numbers representing the correct order from top to bottom. For example, if the correct order is: item 3, then item 1, then item 4, then item 2, respond with: 3,1,4,2

Do not include any explanation or other text.`;

      debug("AI DEBUG: Full prompt sent to AI:", prompt);

      try {
        log("🤖 Asking Gemini AI for correct order...");
        debug("AI DEBUG: Making API request...");

        const response = await new Promise((resolve, reject) => {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.aiModel}:generateContent`;
          debug("AI DEBUG: API URL:", apiUrl);

          const requestBody = {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            tools: [
              {
                google_search: {},
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2000,
            },
          };

          debug("AI DEBUG: Request body:", JSON.stringify(requestBody, null, 2));

          GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": config.geminiApiKey,
            },
            data: JSON.stringify(requestBody),
            onload: (response) => {
              debug("AI DEBUG: Response received");
              debug("AI DEBUG: Status:", response.status);
              debug("AI DEBUG: Response text:", response.responseText);
              resolve(response);
            },
            onerror: (error) => {
              console.error("AI DEBUG: Request error:", error);
              reject(error);
            },
            ontimeout: () => {
              console.error("AI DEBUG: Request timeout");
              reject(new Error("Request timeout"));
            },
            timeout: 15000,
          });
        });

        if (response.status !== 200) {
          console.error("AI DEBUG: Non-200 status:", response.status);
          console.error("AI DEBUG: Error response:", response.responseText);
          throw new Error(
            `API error: ${response.status} - ${response.responseText}`,
          );
        }

        const data = JSON.parse(response.responseText);
        debug("AI DEBUG: Parsed response data:", JSON.stringify(data, null, 2));

        const candidate = data.candidates?.[0];
        if (!candidate) {
          throw new Error("No candidate in AI response");
        }

        // Check if response was truncated
        if (candidate.finishReason === "MAX_TOKENS") {
          console.warn("AI DEBUG: Response was truncated (MAX_TOKENS)");
          log("⚠️ AI response was truncated - increasing token limit", false, true);
        }

        const aiResponse =
          candidate.content?.parts?.[0]?.text?.trim();

        debug("AI DEBUG: Extracted AI response:", aiResponse);

        if (!aiResponse) {
          console.error("AI DEBUG: No response text from AI");
          console.error("AI DEBUG: Finish reason:", candidate.finishReason);
          console.error("AI DEBUG: Data structure:", data);
          throw new Error(`No response from AI (finishReason: ${candidate.finishReason})`);
        }

        // Parse comma-separated order (e.g., "3,1,4,2" or "3, 1, 4, 2")
        const orderMatch = aiResponse.match(/[\d,\s]+/);
        if (!orderMatch) {
          throw new Error(`Could not parse order from AI response: ${aiResponse}`);
        }

        const order = orderMatch[0]
          .split(",")
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n) && n >= 1 && n <= items.length);

        debug("AI DEBUG: Parsed order:", order);

        if (order.length !== items.length) {
          throw new Error(`Invalid order length: ${order.length} (expected ${items.length})`);
        }

        // Validate that all numbers 1..items.length are present
        const sortedOrder = [...order].sort((a, b) => a - b);
        for (let i = 0; i < items.length; i++) {
          if (sortedOrder[i] !== i + 1) {
            throw new Error(`Invalid order: missing number ${i + 1}`);
          }
        }

        log(`✅ AI determined order: ${order.join(", ")}`);
        return order;
      } catch (err) {
        console.error("AI DEBUG: Exception caught:", err);
        console.error("AI DEBUG: Error stack:", err.stack);
        log(`❌ AI Error: ${err.message}`, true);
        return null;
      }
    }

    async function askGeminiForBlank(question, blankCount) {
      debug("=== AI DEBUG: askGeminiForBlank called ===");
      debug("AI Config:", {
        useAI: config.useAI,
        hasApiKey: config.geminiApiKey !== "YOUR_API_KEY_HERE",
        apiKeyLength: config.geminiApiKey.length,
        model: config.aiModel,
      });

      if (!config.useAI) {
        log("AI disabled in settings", false, true);
        return null;
      }

      if (config.geminiApiKey === "YOUR_API_KEY_HERE" || !config.geminiApiKey) {
        log("⚠️ No API key configured", true);
        return null;
      }

      const prompt = `You are helping with a driving education course fill-in-the-blank question.
Question: ${question}

Fill in the missing word${blankCount > 1 ? "s" : ""} where each blank is represented by "____".
${
  blankCount === 1
    ? `Respond with ONLY the missing word or short phrase that correctly completes the blank. Do not include quotes, punctuation, capitalization changes, or any explanation.`
    : `Respond with the missing words or short phrases for each of the ${blankCount} blanks, in order. Provide each answer on its own line with no numbering, punctuation, or extra text.`
}
Keep answers concise and directly usable in the blanks.`;

      debug("AI DEBUG: Full prompt sent to AI:", prompt);

      try {
        log("🤖 Asking Gemini AI for blank answer...");
        debug("AI DEBUG: Making API request...");

        const response = await new Promise((resolve, reject) => {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.aiModel}:generateContent`;
          debug("AI DEBUG: API URL:", apiUrl);

          const requestBody = {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            tools: [
              {
                google_search: {},
              },
            ],
            generationConfig: {
              temperature: 0.05,
              maxOutputTokens: Math.max(120, blankCount * 40),
            },
          };

          debug(
            "AI DEBUG: Request body:",
            JSON.stringify(requestBody, null, 2),
          );

          GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": config.geminiApiKey,
            },
            data: JSON.stringify(requestBody),
            onload: (response) => {
              debug("AI DEBUG: Response received");
              debug("AI DEBUG: Status:", response.status);
              debug("AI DEBUG: Response text:", response.responseText);
              resolve(response);
            },
            onerror: (error) => {
              console.error("AI DEBUG: Request error:", error);
              reject(error);
            },
            ontimeout: () => {
              console.error("AI DEBUG: Request timeout");
              reject(new Error("Request timeout"));
            },
            timeout: 15000,
          });
        });

        if (response.status !== 200) {
          console.error("AI DEBUG: Non-200 status:", response.status);
          console.error("AI DEBUG: Error response:", response.responseText);
          throw new Error(
            `API error: ${response.status} - ${response.responseText}`,
          );
        }

        const data = JSON.parse(response.responseText);
        debug(
          "AI DEBUG: Parsed response data:",
          JSON.stringify(data, null, 2),
        );

        const candidate = data.candidates?.[0];
        if (!candidate) {
          throw new Error("No candidate in AI response");
        }

        const aiResponse = candidate.content?.parts
          ?.map((part) => part.text?.trim())
          .filter(Boolean)
          .join("\n")
          .trim();

        debug("AI DEBUG: Extracted AI response:", aiResponse);

        if (!aiResponse) {
          throw new Error("No response text from AI");
        }

        const lines =
          aiResponse
            .split(/\r?\n/)
            .map((line) =>
              line
                .trim()
                .replace(/^[-*\d.)\s]+/, "")
                .replace(/^["'“”‘’]|["'“”‘’]$/g, "")
                .replace(/[.?!]+$/g, "")
                .trim(),
            )
            .filter(Boolean) || [];

        if (blankCount === 1) {
          const single =
            lines[0] || aiResponse.replace(/[.?!]+$/g, "").trim();
          if (!single) {
            throw new Error("AI did not return a usable answer");
          }
          return [single];
        }

        if (lines.length !== blankCount) {
          console.warn(
            "AI DEBUG: Expected",
            blankCount,
            "answers but received",
            lines.length,
          );
          throw new Error("AI returned unexpected number of blank answers");
        }

        return lines;
      } catch (err) {
        console.error("AI DEBUG: Exception caught:", err);
        console.error("AI DEBUG: Error stack:", err.stack);
        log(`❌ AI Error: ${err.message}`, true);
        return null;
      }
    }

    async function askGemini(question, answerOptions, options = {}) {
      const { expectMultiple = false } = options || {};
      debug("=== AI DEBUG: askGemini called ===");
      debug("AI Config:", {
        useAI: config.useAI,
        hasApiKey: config.geminiApiKey !== "YOUR_API_KEY_HERE",
        apiKeyLength: config.geminiApiKey.length,
        model: config.aiModel,
      });

      if (!config.useAI) {
        debug("AI DEBUG: AI is disabled in config");
        log("AI disabled in settings", false, true);
        return null;
      }

      if (config.geminiApiKey === "YOUR_API_KEY_HERE" || !config.geminiApiKey) {
        debug("AI DEBUG: No API key configured");
        log("⚠️ No API key configured", true);
        return null;
      }

      debug("AI DEBUG: Question:", question);
      debug("AI DEBUG: Answer options:", answerOptions);

      const prompt = (() => {
        const base = `You are helping with a driving education course question.
Question: ${question}

Available answers:
${answerOptions.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}
`;
        if (expectMultiple) {
          return `${base}
One or more of the answers may be correct. Respond with ONLY the numbers of all correct answers, separated by commas in ascending order (for example: "1,3,4"). Do not include any explanation or other text. If no answers are correct, respond with "NONE".`;
        }
        return `${base}
Please respond with ONLY the number (1, 2, 3, or 4) of the correct answer. Do not include any explanation or other text.`;
      })();

      debug("AI DEBUG: Full prompt sent to AI:", prompt);

      try {
        log(
          expectMultiple
            ? "🤖 Asking Gemini AI for all correct answers..."
            : "🤖 Asking Gemini AI...",
        );
        debug("AI DEBUG: Making API request...");

        const response = await new Promise((resolve, reject) => {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${config.aiModel}:generateContent`;
          debug("AI DEBUG: API URL:", apiUrl);

          const requestBody = {
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            tools: [
              {
                google_search: {},
              },
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1000,
            },
          };

          debug("AI DEBUG: Request body:", JSON.stringify(requestBody, null, 2));

          GM_xmlhttpRequest({
            method: "POST",
            url: apiUrl,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": config.geminiApiKey,
            },
            data: JSON.stringify(requestBody),
            onload: (response) => {
              debug("AI DEBUG: Response received");
              debug("AI DEBUG: Status:", response.status);
              debug("AI DEBUG: Response text:", response.responseText);
              resolve(response);
            },
            onerror: (error) => {
              console.error("AI DEBUG: Request error:", error);
              reject(error);
            },
            ontimeout: () => {
              console.error("AI DEBUG: Request timeout");
              reject(new Error("Request timeout"));
            },
            timeout: 15000, // Increased timeout to 15 seconds
          });
        });

        if (response.status !== 200) {
          console.error("AI DEBUG: Non-200 status:", response.status);
          console.error("AI DEBUG: Error response:", response.responseText);
          throw new Error(
            `API error: ${response.status} - ${response.responseText}`,
          );
        }

        const data = JSON.parse(response.responseText);
        debug("AI DEBUG: Parsed response data:", JSON.stringify(data, null, 2));

        const candidate = data.candidates?.[0];
        if (!candidate) {
          throw new Error("No candidate in AI response");
        }

        // Check if response was truncated
        if (candidate.finishReason === "MAX_TOKENS") {
          console.warn("AI DEBUG: Response was truncated (MAX_TOKENS)");
          log("⚠️ AI response was truncated - increasing token limit", false, true);
        }

        const aiResponse =
          candidate.content?.parts?.[0]?.text?.trim();

        debug("AI DEBUG: Extracted AI response:", aiResponse);

        if (!aiResponse) {
          console.error("AI DEBUG: No response text from AI");
          console.error("AI DEBUG: Finish reason:", candidate.finishReason);
          console.error("AI DEBUG: Data structure:", data);
          throw new Error(`No response from AI (finishReason: ${candidate.finishReason})`);
        }

        // Extract numbers from response - handle multiple answers if requested
        const numberMatches = Array.from(aiResponse.matchAll(/(\d+)/g)).map(
          (match) => parseInt(match[1], 10),
        );
        const uniqueNumbers = [...new Set(numberMatches)].filter(
          (num) => num >= 1 && num <= answerOptions.length,
        );
        debug("AI DEBUG: Number matches:", uniqueNumbers);

        function fallbackAnswersFromText() {
          const lowerResponse = aiResponse.toLowerCase();
          return answerOptions.filter((opt) =>
            lowerResponse.includes(opt.toLowerCase()),
          );
        }

        if (expectMultiple) {
          let selectedAnswers = uniqueNumbers.map(
            (num) => answerOptions[num - 1],
          );

          if (selectedAnswers.length === 0) {
            selectedAnswers = fallbackAnswersFromText();
          }

          if (
            selectedAnswers.length === 0 &&
            aiResponse.trim().toUpperCase() === "NONE"
          ) {
            log("⚠️ AI indicated no answers are correct", false, true);
            return [];
          }

          if (selectedAnswers.length === 0) {
            console.error(
              "AI DEBUG: Could not determine answers from response:",
              aiResponse,
            );
            throw new Error(
              `Could not parse multiple answers from AI response: ${aiResponse}`,
            );
          }

          const truncatedList = selectedAnswers
            .map((ans) => ans.substring(0, 50))
            .join(", ");
          log(
            `✅ AI selected ${selectedAnswers.length} answer${
              selectedAnswers.length === 1 ? "" : "s"
            }: ${truncatedList}...`,
          );
          return selectedAnswers;
        }

        const answerNum = uniqueNumbers[0];
        if (!answerNum) {
          const fallback = fallbackAnswersFromText()[0];
          if (fallback) {
            log(`✅ AI selected: ${fallback.substring(0, 50)}...`);
            return fallback;
          }
          console.error(
            "AI DEBUG: Could not extract number from response:",
            aiResponse,
          );
          throw new Error(
            `Could not parse number from AI response: ${aiResponse}`,
          );
        }

        const selectedAnswer = answerOptions[answerNum - 1];
        debug("AI DEBUG: Selected answer:", selectedAnswer);
        log(`✅ AI selected: ${answerNum}. ${selectedAnswer.substring(0, 50)}...`);
        return selectedAnswer;
      } catch (err) {
        console.error("AI DEBUG: Exception caught:", err);
        console.error("AI DEBUG: Error stack:", err.stack);
        log(`❌ AI Error: ${err.message}`, true);
        return null;
      }
    }

    // --- Main Loop ---
    setInterval(async () => {
      try {
        // Check if script is disabled
        if (!config.scriptEnabled) {
          return; // Skip all actions if disabled
        }

        // Check for break popup first
        if (detectBreakPopup()) {
          if (!breakLoggedOnce) {
            log("⏸️ On break - paused", false, true);
            breakLoggedOnce = true;
          }
          return; // Skip all actions during break
        }

        capturePopupQuestionResults();

        const nextArrow = document.getElementById("arrow-next");
        if (nextArrow && !nextArrow.disabled) {
          log("Clicking next arrow");
          nextArrow.click();
        }

        // // Video handling
        // const video = document.querySelector("video");
        // if (video && video.paused) {
        //   const playButton = document.querySelector(".vjs-big-play-button");
        //   if (playButton) {
        //     log("Playing video");
        //     playButton.click();
        //   }
        // }
        // Video handling
        const video = document.querySelector("video");
        if (video) {
          // Skip video by seeking to end minus 1 second, then play
          if (video.duration && !isNaN(video.duration) && video.duration > 0) {
            const targetTime = video.duration - 1;
            // If video hasn't been skipped yet, skip to near the end
            if (video.currentTime < targetTime - 0.5) {
              video.currentTime = targetTime;
              log("⏩ Video skipped to end (1 second remaining)");
            }
          }
          
          // Speed up video (2x speed)
          if (video.playbackRate !== 2) {
            video.playbackRate = 2;
            log("⚡ Video speed set to 2x");
          }
          
          // Play if paused
          if (video.paused) {
            const playButton = document.querySelector(".vjs-big-play-button");
            if (playButton) {
              log("Playing video");
              playButton.click();
            } else {
              video.play();
            }
          }
        }

        const playBtn = document.getElementById("play-btn");
        if (playBtn) {
          log("Clicking Play Facts");
          playBtn.click();
        }

        const continueButton = document.querySelector(
          ".continue-learning-button",
        );
        if (continueButton) {
          log("Clicking Continue");
          continueButton.click();
        }

        const nextChapterButton = document.querySelector(
          '[data-test="continueButton"]',
        );
        if (nextChapterButton) {
          const computedStyle = window.getComputedStyle(nextChapterButton);
          const isVisible =
            nextChapterButton.offsetParent !== null &&
            computedStyle.display !== "none" &&
            computedStyle.visibility !== "hidden" &&
            computedStyle.opacity !== "0";
          const isEnabled =
            !nextChapterButton.disabled &&
            !nextChapterButton.hasAttribute("disabled") &&
            !nextChapterButton.classList.contains("disabled");
          if (isVisible && isEnabled) {
            log("Clicking Next Chapter");
            nextChapterButton.click();
          }
        }

        // Also check for continue learning button (after break)
        const continueLearningBtn = document.querySelector(
          '[data-test="continueLearningButton"]',
        );
        if (continueLearningBtn) {
          log("Clicking Continue Learning");
          continueLearningBtn.click();
        }

        const resultsContinueBtn = document.getElementById(
          "results-continue-btn",
        );
        if (resultsContinueBtn) {
          log("Clicking Results Continue");
          resultsContinueBtn.click();
        }

        const assessmentButton = document.querySelector(
          "[data-test='startAssessmentButton']",
        );
        if (assessmentButton) {
          log("Starting Assessment");
          assessmentButton.click();
        }

        const continueModalButton = document.querySelector(
          "[data-test='modalPrimaryButton']",
        );
        if (continueModalButton) {
          log("Clicking modal Continue");
          continueModalButton.click();
        }

        const continueTestButton = document.querySelector(
          "[data-test='continueTest']",
        );
        if (continueTestButton) {
          log("Continuing Test");
          continueTestButton.click();
        }

        await autoAnswerCategoryQuestions();
        await autoAnswerPlayFactQuestions();
        await autoAnswerBlankQuestions();
        await autoAnswerTestQuestionsWithAI();
        await autoAnswerSortableQuestions();
        saveReviewQuestions();
      } catch (err) {
        console.error("Script error:", err);
        log(`Script error: ${err.message}`, true);
      }
    }, 500);

    // --- Keep Alive ---
    function keepAlive() {
        // Run verification check
        detectVerificationPopup();
        
        // ... existing keepAlive logic ...
      document.dispatchEvent(new MouseEvent("mousemove"));
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
      }
      log("Keep alive ping");
    }
    setInterval(keepAlive, 120000);

    // --- Question Handlers ---
    const factsOfAFeatherLibrary = [
      {
        matchText:
          "To ride these vehicles, training classes, a license, vehicle registration, and a helmet are required.",
        keywords: [
          "training classes",
          "license",
          "vehicle registration",
          "helmet",
        ],
        category: "motorcycles",
      },
    ];

    const normalizeFoafText = (text) =>
      (text || "").replace(/\s+/g, " ").trim().toLowerCase();
    const normalizeCategoryLabel = (text) =>
      (text || "").replace(/\s+/g, " ").trim().toLowerCase();

    async function autoAnswerCategoryQuestions() {
      if (categoryQuestionProcessing) {
        return;
      }

      const categoryList = document.querySelector(".category-list");
      if (!categoryList) return;

      const descriptorEl =
        categoryList.querySelector(".categorize__descriptor") ||
        document.querySelector(".categorize__descriptor");

      const factTextRaw = descriptorEl?.innerText || "";
      const factText = factTextRaw.replace(/\s+/g, " ").trim();

      if (!factText) {
        const buttons = categoryList.querySelectorAll("button");
        for (let button of buttons) {
          while (!areAllDotsComplete(button)) {
            log("Completing category dots");
            button.click();
            await waitFor(400);
          }
        }
        return;
      }

      const now = Date.now();
      if (factText === lastFoafFact && now - lastFoafFactTime < 800) {
        return;
      }

      lastFoafFact = factText;
      lastFoafFactTime = now;
      categoryQuestionProcessing = true;

      try {
        const buttons = Array.from(categoryList.querySelectorAll("button"));
        if (buttons.length === 0) {
          return;
        }

        const normalizedFact = normalizeFoafText(factText);
        const storedQuestions =
          getStoredQuestions();
        const storageKey = `foaf:${normalizedFact}`;
        let targetCategory = storedQuestions[storageKey];

        if (!targetCategory) {
          const libraryEntry = factsOfAFeatherLibrary.find((entry) => {
            if (
              entry.matchText &&
              normalizeFoafText(entry.matchText) === normalizedFact
            ) {
              return true;
            }
            if (entry.keywords && entry.keywords.length > 0) {
              return entry.keywords.every((keyword) =>
                normalizedFact.includes(keyword.toLowerCase()),
              );
            }
            return false;
          });

          if (libraryEntry) {
            targetCategory = libraryEntry.category;
          }
        }

        if (!targetCategory) {
          debug("No FOAF mapping found for fact:", factText);
          return;
        }

        const normalizedTarget = normalizeCategoryLabel(targetCategory);
        let buttonToClick =
          buttons.find(
            (btn) =>
              normalizeCategoryLabel(btn.innerText) === normalizedTarget,
          ) ||
          buttons.find((btn) =>
            normalizeCategoryLabel(btn.innerText).includes(normalizedTarget),
          ) ||
          buttons.find((btn) =>
            normalizedTarget.includes(normalizeCategoryLabel(btn.innerText)),
          );

        if (!buttonToClick) {
          console.warn(
            "[FoAF] Could not find category button for target:",
            targetCategory,
          );
          return;
        }

        if (areAllDotsComplete(buttonToClick)) {
          debug(
            "FOAF target category already complete:",
            buttonToClick.innerText.replace(/\s+/g, " ").trim(),
          );
          return;
        }

        const buttonLabel = buttonToClick.innerText.replace(/\s+/g, " ").trim();
        log(`🪶 Categorizing fact using "${buttonLabel}"`);
        buttonToClick.click();

        storedQuestions[storageKey] = buttonLabel;
        saveStoredQuestions(storedQuestions);
      } finally {
        categoryQuestionProcessing = false;
      }
    }

    function areAllDotsComplete(button) {
      return Array.from(button.querySelectorAll(".bucket-dot")).every((dot) =>
        dot.classList.contains("complete"),
      );
    }

    async function autoAnswerPlayFactQuestions() {
      if (playFactProcessing) {
        return;
      }

      const answerButtonList = document.querySelector(
        ".gritCourseflowNode__answerButtonList",
      );
      if (!answerButtonList) return;

      playFactProcessing = true;

      try {
        // Get all answer buttons
        const answerButtons = answerButtonList.querySelectorAll("button");
        if (answerButtons.length === 0) return;

        // Check if already answered (button has selected class or is disabled)
        const alreadyAnswered = Array.from(answerButtons).some(
          (btn) => btn.classList.contains("selected") || btn.disabled,
        );

        if (alreadyAnswered) {
          // Already answered, just proceed to check and next
          await waitUntilCheckAnswerButtonIsEnabled();
          const checkAnswerButton =
            document.querySelector("[courseflow-forward]");
          if (checkAnswerButton) {
            log("Checking answer");
            checkAnswerButton.click();
          }
          const nextArrow = document.getElementById("arrow-next");
          if (nextArrow) {
            await waitFor(300);
            nextArrow.click();
          }
          return;
        }

        // Extract question text - search within the PlayFact container only
        let questionText = "";
        const parentContainer = answerButtonList.closest(".gritCourseflowNode");

        if (!parentContainer) {
          debug("No parent container found for PlayFact question");
          return;
        }

        // Exclude UI elements (settings menu, debug panel, etc.)
        const excludedSelectors = [
          "#aceable-settings-overlay",
          "#aceable-settings-overlay *",
          "[id*='aceable']",
          ".aceable-script-panel",
        ];

        // Try specific question selectors within the container first
        const questionSelectors = [
          ".gritCourseflowNode__question",
          ".question",
          "[data-test='question']",
          ".paragraph__question",
          "h1",
          "h2",
          "h3",
          "p",
        ];

        for (const selector of questionSelectors) {
          const questionEl = parentContainer.querySelector(selector);
          if (questionEl) {
            // Check if element is not in excluded areas
            let isExcluded = false;
            for (const exclSelector of excludedSelectors) {
              if (questionEl.closest(exclSelector)) {
                isExcluded = true;
                break;
              }
            }

            if (!isExcluded && questionEl.innerText.trim()) {
              const text = questionEl.innerText.trim();
              // Filter out very short text (likely not a question) and UI text
              if (
                text.length > 10 &&
                !text.includes("⚙️") &&
                !text.includes("Settings") &&
                !text.includes("Aceable Script")
              ) {
                questionText = text;
                break;
              }
            }
          }
        }

        // If no question text found, try to get it from the parent container
        // by extracting text that's not in answer buttons or excluded elements
        if (!questionText || questionText.length < 10) {
          // Clone the container to work with
          const clone = parentContainer.cloneNode(true);

          // Remove answer button list from clone
          const answerListClone =
            clone.querySelector(".gritCourseflowNode__answerButtonList");
          if (answerListClone) {
            answerListClone.remove();
          }

          // Remove any excluded elements
          excludedSelectors.forEach((selector) => {
            const excluded = clone.querySelector(selector);
            if (excluded) excluded.remove();
          });

          // Get all text and clean it up
          let allText = clone.innerText.trim();

          // Remove answer texts that might still be in there
          const answerTexts = Array.from(answerButtons).map((btn) =>
            btn.innerText.trim(),
          );
          answerTexts.forEach((ans) => {
            allText = allText.replace(ans, "").trim();
          });

          // Clean up common UI text patterns
          allText = allText
            .replace(/⚙️.*Settings.*/g, "")
            .replace(/Aceable Script.*/g, "")
            .replace(/\s+/g, " ")
            .trim();

          // Filter out very short or suspicious text
          if (
            allText.length > 10 &&
            !allText.includes("⚙️") &&
            !allText.includes("Settings")
          ) {
            questionText = allText;
          }
        }

        // Final validation - if question is still suspicious, skip AI
        if (
          !questionText ||
          questionText.length < 10 ||
          questionText.includes("⚙️") ||
          questionText.includes("Aceable Script Settings")
        ) {
          debug(
            "Could not extract valid question text, skipping PlayFact question",
          );
          questionText = "";
        }

        // Extract answer options
        const answerTexts = Array.from(answerButtons).map((btn) =>
          btn.innerText.trim(),
        );

        debug("=== PLAYFACT QUESTION DETECTED ===");
        debug("Question:", questionText || "(could not extract)");
        debug("Answer options:", answerTexts);

        // If we couldn't extract a valid question, skip AI and use fallback
        if (!questionText) {
          log(
            "⚠️ Could not extract PlayFact question text - using fallback",
            false,
            true,
          );
          // Fallback: click first option
          answerButtons[0].click();
          await waitUntilCheckAnswerButtonIsEnabled();
          const checkAnswerButton =
            document.querySelector("[courseflow-forward]");
          if (checkAnswerButton) {
            log("Checking answer");
            checkAnswerButton.click();
          }
          const nextArrow = document.getElementById("arrow-next");
          if (nextArrow) {
            await waitFor(300);
            nextArrow.click();
          }
          return;
        }

        // Try local storage first
        const storedQuestions =
          getStoredQuestions();

        if (storedQuestions[questionText]) {
          const correctAnswer = storedQuestions[questionText];
          debug("Found stored answer:", correctAnswer);

          const correctBtn = Array.from(answerButtons).find(
            (btn) => btn.innerText.trim() === correctAnswer.trim(),
          );

          if (correctBtn) {
            log(`📚 Using stored answer for PlayFact`);
            correctBtn.click();
            await waitUntilCheckAnswerButtonIsEnabled();
            const checkAnswerButton = document.querySelector(
              "[courseflow-forward]",
            );
            if (checkAnswerButton) {
              log("Checking answer");
              checkAnswerButton.click();
            }
            const nextArrow = document.getElementById("arrow-next");
            if (nextArrow) {
              await waitFor(300);
              nextArrow.click();
            }
            return;
          }
        }

        // Use AI if enabled
        if (config.useAI && questionText) {
          debug("\n" + "=".repeat(60));
          debug("🤖 AI ENABLED - PROCESSING PLAYFACT QUESTION");
          debug("=".repeat(60));
          debug("📝 QUESTION DETECTED:");
          debug("   " + questionText);
          debug("\n📋 POSSIBLE ANSWERS:");
          answerTexts.forEach((answer, index) => {
            debug(`   ${index + 1}. ${answer}`);
          });
          debug("\n🔄 Calling AI...");

          const aiAnswer = await askGemini(questionText, answerTexts);

          const aiAnswers = Array.isArray(aiAnswer)
            ? aiAnswer
            : aiAnswer
            ? [aiAnswer]
            : [];

          debug("\n✅ AI RESPONSE RECEIVED:");
          if (aiAnswers.length > 0) {
            aiAnswers.forEach((ans, idx) => {
              debug(`   Selected Answer ${idx + 1}: ${ans}`);
            });
          } else {
            debug("   ❌ No answer received (error occurred)");
          }
          debug("=".repeat(60) + "\n");

          if (aiAnswers.length > 0) {
            let aiBtn = null;

            for (const candidateAnswer of aiAnswers) {
              if (!candidateAnswer) continue;
              aiBtn = Array.from(answerButtons).find(
                (btn) => btn.innerText.trim() === candidateAnswer.trim(),
              );

              if (!aiBtn) {
                debug("No exact match, trying case-insensitive...");
                aiBtn = Array.from(answerButtons).find(
                  (btn) =>
                    btn.innerText.trim().toLowerCase() ===
                    candidateAnswer.trim().toLowerCase(),
                );
              }

              if (!aiBtn) {
                debug("No case-insensitive match, trying partial...");
                aiBtn = Array.from(answerButtons).find(
                  (btn) =>
                    btn.innerText.trim().includes(candidateAnswer.trim()) ||
                    candidateAnswer.trim().includes(btn.innerText.trim()),
                );
              }

              if (aiBtn) {
                break;
              }
            }

            if (aiBtn) {
              log(`🤖 AI answered PlayFact question`);
              aiBtn.click();

              // Cache the answer for next time
              storedQuestions[questionText] = aiBtn.innerText.trim();
              saveStoredQuestions(storedQuestions);

              await waitUntilCheckAnswerButtonIsEnabled();
              const checkAnswerButton = document.querySelector(
                "[courseflow-forward]",
              );
              if (checkAnswerButton) {
                log("Checking answer");
                checkAnswerButton.click();
              }
              const nextArrow = document.getElementById("arrow-next");
              if (nextArrow) {
                await waitFor(300);
                nextArrow.click();
              }
              return;
            } else {
              console.error("AI answer not found in button options!");
              console.error("AI returned:", aiAnswers);
              console.error("Available options:", answerTexts);
              log("⚠️ AI answer not found in PlayFact options", false, true);
            }
          }
        }

        // Fallback: if AI is disabled or failed, click first option
        if (!config.useAI) {
          log("⚠️ AI disabled - clicking first PlayFact option", false, true);
        } else {
          log("⚠️ AI failed - using fallback (first option)", false, true);
        }
        answerButtons[0].click();
        await waitUntilCheckAnswerButtonIsEnabled();
        const checkAnswerButton =
          document.querySelector("[courseflow-forward]");
        if (checkAnswerButton) {
          log("Checking answer");
          checkAnswerButton.click();
        }
        const nextArrow = document.getElementById("arrow-next");
        if (nextArrow) {
          await waitFor(300);
          nextArrow.click();
        }
      } finally {
        playFactProcessing = false;
      }
    }

    async function autoAnswerBlankQuestions() {
      debug("=== CHECKING FOR BLANK QUESTIONS ===");

      const blankContainer = document.querySelector(
        ".gritCourseflowNode--blankitivity",
      );

      if (!blankContainer) {
        debug("No blank activity container found");
        return;
      }

      const blankElements = Array.from(
        blankContainer.querySelectorAll("ace-blank"),
      );

      if (blankElements.length === 0) {
        debug("No ace-blank elements found");
        return;
      }

      const existingValues = blankElements.map((blank) =>
        getBlankElementValue(blank),
      );

      if (existingValues.every((val) => val && val.trim().length > 0)) {
        debug("Blank activity already filled");
        return;
      }

      const markupContainer = blankContainer.querySelector(
        ".gritCourseflowNode__markupContainer",
      );

      let questionText = "";
      if (markupContainer) {
        const html = markupContainer.innerHTML;
        questionText = html
          .replace(/<ace-blank[^>]*><\/ace-blank>/gi, "____")
          .replace(/<ace-blank[^>]*\/>/gi, "____")
          .replace(/<\/?[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      if (!questionText) {
        const fallbackText = blankContainer.innerText
          .replace(/\s+/g, " ")
          .trim();
        if (fallbackText.length > 5) {
          questionText = fallbackText;
        }
      }

      if (!questionText) {
        debug("Could not extract question text for blank activity");
        return;
      }

      const blankCount = blankElements.length;
      const storageKey = `blank:${questionText}::${blankCount}`;
      const storedQuestions =
        getStoredQuestions();

      let answers = storedQuestions[storageKey];
      if (answers) {
        answers = Array.isArray(answers) ? answers : [answers];
        log(
          `📚 Using stored blank answer${
            answers.length === 1 ? "" : "s"
          } for activity`,
        );
      } else if (config.useAI) {
        debug("\n" + "=".repeat(60));
        debug("🤖 AI ENABLED - PROCESSING BLANK QUESTION");
        debug("=".repeat(60));
        debug("Question:", questionText);
        debug("Blanks:", blankCount);
        debug("🔄 Calling AI for blank answers...");

        answers = await askGeminiForBlank(questionText, blankCount);

        debug("\n✅ AI RESPONSE RECEIVED:");
        if (answers && answers.length > 0) {
          answers.forEach((ans, idx) => {
            debug(`   Blank ${idx + 1}: ${ans}`);
          });
        } else {
          debug("   ❌ No blank answers received (error occurred)");
        }
        debug("=".repeat(60) + "\n");

        if (answers && answers.length === blankCount) {
          storedQuestions[storageKey] =
            blankCount === 1 ? answers[0] : answers;
                        saveStoredQuestions(storedQuestions);
        }
      }

      if (!answers || answers.length !== blankCount) {
        log("⚠️ Could not determine blank answers", false, true);
        return;
      }

      for (let i = 0; i < blankElements.length; i++) {
        const blank = blankElements[i];
        const answer = answers[i];

        if (!answer) {
          continue;
        }

        const applied = setBlankElementValue(blank, answer);
        if (applied) {
          debug(`Filled blank ${i + 1} with "${answer}"`);
          blank.setAttribute("data-ace-filled", "true");
          await waitFor(100);
        } else {
          console.warn("Could not set value for blank element", blank);
        }
      }

      await waitFor(300);
      try {
        await waitUntilCheckAnswerButtonIsEnabled();
      } catch (err) {
        debug("Check answer button did not enable:", err?.message || err);
      }
      await clickContinueButton();
    }

    async function autoAnswerTestQuestionsWithAI() {
      if (testQuestionProcessing) {
        return;
      }

      testQuestionProcessing = true;

      try {
        debug("=== CHECKING FOR TEST QUESTIONS ===");

        const questionContainer = document.querySelector(
          "[data-test='questionContainer']",
        );

        if (!questionContainer) {
          debug("No question container found");
          return;
        }

        debug("Question container found!");

        const questionTitleEl = questionContainer.querySelector(
          "[data-test='questionTitle']",
        );

        if (!questionTitleEl) {
          debug("No question title element found");
          return;
        }

        const questionTitle = questionTitleEl.innerText.trim();
        if (!questionTitle) {
          debug("Question title text empty, skipping");
          return;
        }
        debug("Question found:", questionTitle);

        const answerButtons =
          questionContainer.querySelectorAll(
            ".grit.answerButton, [data-test='answer']",
          );

        debug("Answer buttons found:", answerButtons.length);

        if (answerButtons.length === 0) {
          debug("No answer buttons found");
          return;
        }

        const instructionText =
          questionContainer
            .querySelector("[data-test='selectAllThatApply']")
            ?.innerText?.trim() ||
          questionContainer
            .querySelector(".gritCourseflowNode__questionInstructions")
            ?.innerText?.trim() ||
          "";

        const isMultiSelect =
          !!questionContainer.querySelector("[data-test='selectAllThatApply']") ||
          /select all that apply/i.test(instructionText) ||
          /select all that apply/i.test(
            questionContainer.innerText ? questionContainer.innerText.slice(0, 300) : "",
          );

        debug("Is multi-select question:", isMultiSelect);

        const alreadyAnswered = Array.from(answerButtons).some(
          (btn) =>
            btn.classList.contains("selected") ||
            btn.classList.contains("correct") ||
            btn.classList.contains("missed") ||
            btn.disabled,
        );

        if (alreadyAnswered) {
          debug("Question already answered, skipping");
          return;
        }

        debug("Question not yet answered, proceeding...");

        const normalizeText = (text) =>
          (text || "").replace(/\s+/g, " ").trim();

        const answerTexts = Array.from(answerButtons).map((btn) =>
          normalizeText(btn.innerText),
        );

        debug("Answer options:", answerTexts);

        const storedQuestions =
          getStoredQuestions();

        debug(
          "Stored questions count:",
          Object.keys(storedQuestions).length,
        );

        async function deselectUnwantedAnswers(targetSet) {
          if (!isMultiSelect) {
            return;
          }
          for (const btn of answerButtons) {
            const btnText = normalizeText(btn.innerText).toLowerCase();
            if (
              btn.classList.contains("selected") &&
              !targetSet.has(btnText) &&
              !btn.disabled
            ) {
              debug("Deselecting non-target answer:", btn.innerText.trim());
              btn.click();
              await waitFor(100);
            }
          }
        }

        async function clickAnswersByText(answersToSelect) {
          const normalizedTargets = answersToSelect
            .map((ans) => normalizeText(ans))
            .filter(Boolean);
          if (normalizedTargets.length === 0) {
            return 0;
          }

          const targetSet = new Set(
            normalizedTargets.map((text) => text.toLowerCase()),
          );
          await deselectUnwantedAnswers(targetSet);

          let clickedCount = 0;
          for (const targetText of normalizedTargets) {
            const lowerTarget = targetText.toLowerCase();
            const button = Array.from(answerButtons).find((btn) => {
              const btnText = normalizeText(btn.innerText).toLowerCase();
              return btnText === lowerTarget;
            });

            if (!button) {
              console.warn(
                "[AI] Could not find button for answer:",
                targetText,
              );
              continue;
            }

            if (!button.classList.contains("selected")) {
              debug("Selecting answer:", button.innerText.trim());
              button.click();
              clickedCount++;
              await waitFor(150);
            }
          }

          return clickedCount;
        }

        async function submitSelectedAnswers() {
          await submitTestQuestion(questionContainer, questionTitle);
        }

        if (storedQuestions[questionTitle]) {
          const storedEntry = storedQuestions[questionTitle];
          const answersToSelect = Array.isArray(storedEntry)
            ? storedEntry
            : [storedEntry];
          debug("Found stored answers:", answersToSelect);

          const clicked = await clickAnswersByText(answersToSelect);
          if (clicked > 0) {
            log(
              `📚 Using stored ${
                isMultiSelect ? "answers" : "answer"
              } for test question`,
            );
            await submitSelectedAnswers();
            return;
          }

          debug("Stored answers were not found in the current options");
        }

        if (config.useAI) {
          debug("\n" + "=".repeat(60));
          debug("🤖 AI ENABLED - PROCESSING QUESTION");
          debug("=".repeat(60));
          debug("📝 QUESTION DETECTED:");
          debug("   " + questionTitle);
          debug("\n📋 POSSIBLE ANSWERS:");
          answerTexts.forEach((answer, index) => {
            debug(`   ${index + 1}. ${answer}`);
          });
          debug("\n🔄 Calling AI...");

          const aiAnswer = await askGemini(questionTitle, answerTexts, {
            expectMultiple: isMultiSelect,
          });

          const aiAnswers = Array.isArray(aiAnswer)
            ? aiAnswer
            : aiAnswer
            ? [aiAnswer]
            : [];

          debug("\n✅ AI RESPONSE RECEIVED:");
          if (aiAnswers.length > 0) {
            aiAnswers.forEach((ans, idx) => {
              debug(`   Selected Answer ${idx + 1}: ${ans}`);
            });
          } else {
            debug("   ❌ No answer received (error occurred)");
          }
          debug("=".repeat(60) + "\n");

          if (aiAnswers.length > 0) {
            const clicked = await clickAnswersByText(aiAnswers);
            if (clicked > 0) {
              storedQuestions[questionTitle] = isMultiSelect
                ? aiAnswers
                : aiAnswers[0];
              saveStoredQuestions(storedQuestions);
              await submitSelectedAnswers();
              return;
            }

            console.error(
              "AI answers not found in button options!",
              aiAnswers,
            );
            log("⚠️ AI answers not found in options", false, true);
          } else {
            debug("AI returned null (error or disabled)");
          }
        } else {
          debug("AI is disabled, using fallback");
        }

        log("⚠️ Using fallback (first option)", false, true);
        answerButtons[0].click();
        await submitSelectedAnswers();
      } finally {
        testQuestionProcessing = false;
      }
    }

    async function submitTestQuestion(questionContainer, previousQuestionTitle) {
      try {
        await waitUntilCheckAnswerButtonIsEnabled();
      } catch (err) {
        console.warn("Wait for check answer button failed:", err);
      }

      const checkAnswerButton =
        questionContainer.querySelector("[data-test='courseflow-forward']") ||
        questionContainer.querySelector("button[data-test='courseflow-forward']") ||
        questionContainer.querySelector("[courseflow-forward]") ||
        questionContainer.querySelector("[data-test='submitAnswer']") ||
        questionContainer.querySelector("button[data-test='submitAnswer']") ||
        questionContainer.querySelector("[data-test='continueButton']") ||
        questionContainer.querySelector("button[data-test='continueButton']") ||
        document.querySelector("[data-test='courseflow-forward']") ||
        document.querySelector("[data-test='submitAnswer']") ||
        document.querySelector("[data-test='continueButton']");

      if (checkAnswerButton && !checkAnswerButton.disabled) {
        log("Checking answer");
        checkAnswerButton.click();
        await waitFor(500);
      }

      const buttonDataTest = checkAnswerButton?.getAttribute("data-test");
      if (buttonDataTest === "submitAnswer") {
        await waitForNewTestQuestion(previousQuestionTitle);
        return;
      }

      // Attempt to proceed to the next screen
      const nextArrow = document.getElementById("arrow-next");
      if (
        nextArrow &&
        nextArrow !== checkAnswerButton &&
        !nextArrow.disabled
      ) {
        log("Clicking next arrow");
        
        // Try up to 3 times to click and wait for change
        for (let i = 0; i < 3; i++) {
          await robustClick(nextArrow);
          const changed = await waitForNewTestQuestion(previousQuestionTitle);
          if (changed) break;
          
          if (i < 2) {
            log(`⚠️ Page didn't change after click (attempt ${i+1}), retrying...`, false, true);
            await waitFor(1000);
          }
        }
        
        await waitFor(400);
      }

      await clickContinueButton();
    }

    function capturePopupQuestionResults() {
      const popupContainers = document.querySelectorAll(
        "[data-test='popupQuestionContainer']",
      );
      if (popupContainers.length === 0) {
        return;
      }

      const storedQuestions =
        getStoredQuestions();
      let hasChanges = false;

      popupContainers.forEach((container) => {
        if (container.dataset.aceableResultsSaved === "true") {
          return;
        }

        const answerButtons = container.querySelectorAll(".grit.answerButton");
        if (answerButtons.length === 0) {
          return;
        }

        const resultButtons = Array.from(answerButtons).filter(
          (btn) =>
            btn.classList.contains("correct") ||
            btn.classList.contains("missed"),
        );

        if (resultButtons.length === 0) {
          return;
        }

        let questionText = "";
        const questionSelectors = [
          "[data-test='questionTitle']",
          ".gritCourseflowNode__markupContainer",
          ".content__markup-new",
          ".gritCourseflowNode__question",
          ".gritCourseflowNode__questionText",
          "h1",
          "h2",
          "h3",
          "p",
        ];

        for (const selector of questionSelectors) {
          const el = container.querySelector(selector);
          const text = el?.innerText?.trim();
          if (text && text.length > 5) {
            questionText = text.replace(/\s+/g, " ").trim();
            break;
          }
        }

        if (!questionText || questionText.length < 5) {
          return;
        }

        const answers = resultButtons
          .map((btn) => btn.innerText?.trim())
          .filter((text) => text && text.length > 0);

        if (answers.length === 0) {
          return;
        }

        const valueToStore = answers.length === 1 ? answers[0] : answers;

        const existingEntry = storedQuestions[questionText];
        const normalizeList = (entry) => {
          if (!entry) return [];
          if (Array.isArray(entry)) {
            return entry.map((ans) => ans.trim().toLowerCase());
          }
          return [entry.trim().toLowerCase()];
        };

        const existingNormalized = normalizeList(existingEntry);
        const newNormalized = normalizeList(valueToStore);

        const sameAnswers =
          existingNormalized.length === newNormalized.length &&
          existingNormalized.every((ans) => newNormalized.includes(ans));

        if (!sameAnswers) {
          storedQuestions[questionText] = valueToStore;
          hasChanges = true;
          log(
            `💾 Saved ${answers.length} correct answer${
              answers.length === 1 ? "" : "s"
            } for "${questionText.substring(0, 60)}..."`,
          );
        }

        container.dataset.aceableResultsSaved = "true";
      });

      if (hasChanges) {
                      saveStoredQuestions(storedQuestions);
      }
    }

    async function autoAnswerSortableQuestions() {
      debug("=== CHECKING FOR SORTABLE QUESTIONS ===");

      const questionContainer = document.querySelector(
        "[data-test='popupQuestionContainer']",
      );

      if (!questionContainer) {
        debug("No sortable question container found");
        return;
      }

      // Check if this is a sortable/draggable question
      const answerButtonList = questionContainer.querySelector(
        ".gritCourseflowNode__answerButtonList",
      );

      if (!answerButtonList) {
        debug("No answer button list found");
        return;
      }

      // Get all potential draggable items
      const draggableItems = answerButtonList.querySelectorAll(
        ".gritCourseflowNode__answerButtonListItem",
      );

      if (draggableItems.length === 0) {
        debug("No draggable items found");
        return;
      }

      const hasSortableMarkers = Array.from(draggableItems).some((li) =>
        li.querySelector(".sortable-item, [data-test='dragItemText']"),
      );

      if (!hasSortableMarkers) {
        debug("Detected standard question (no sortable markers)");
        return;
      }

      // Check if items are already in correct order (by checking if they're disabled or have a "correct" class)
      const sortableItems = Array.from(draggableItems).map(
        (li) => li.querySelector(".sortable-item") || li,
      );

      // Check if already answered - look for disabled state or completion indicators
      const alreadyAnswered = Array.from(sortableItems).some(
        (item) =>
          item?.getAttribute("aria-disabled") === "true" ||
          item?.classList.contains("disabled") ||
          item?.closest(".gritCourseflowNode__answerButtonListItem")
            ?.classList.contains("correct"),
      );

      if (alreadyAnswered) {
        debug("Sortable question already answered, skipping");
        return;
      }

      debug("Sortable question found with", draggableItems.length, "items");

      // Extract question text
      const questionHeader = questionContainer.querySelector(
        "[data-test='questionHeader']",
      );
      let questionText = "";

      if (questionHeader) {
        questionText = questionHeader.innerText.trim();
      }

      if (!questionText || questionText.length < 10) {
        debug("Could not extract valid question text");
        return;
      }

      // Extract all draggable item texts
      const validItems = Array.from(draggableItems)
        .map((li) => {
          const dragItemText = li.querySelector("[data-test='dragItemText']");
          return dragItemText ? dragItemText.innerText.trim() : "";
        })
        .filter((text) => text.length > 0);

      if (validItems.length === 0) {
        debug("No valid item texts found");
        return;
      }

      debug("=== SORTABLE QUESTION DETECTED ===");
      debug("Question:", questionText);
      debug("Items to order:", validItems);

      // Try local storage first
      const storedQuestions =
        getStoredQuestions();

      const storageKey = `sortable:${questionText}`;
      if (storedQuestions[storageKey]) {
        const storedOrder = storedQuestions[storageKey];
        debug("Found stored order:", storedOrder);

        if (
          Array.isArray(storedOrder) &&
          storedOrder.length === validItems.length
        ) {
          log(`📚 Using stored order for sortable question`);
          await reorderItems(draggableItems, storedOrder);

          // Wait a bit for the UI to update and verify the order
          await waitFor(1000);
          
          // Try to find and click the continue button multiple times with delays
          await clickContinueButton();

          return;
        }
      }

      // Use AI if enabled
      if (config.useAI) {
        debug("\n" + "=".repeat(60));
        debug("🤖 AI ENABLED - PROCESSING SORTABLE QUESTION");
        debug("=".repeat(60));
        debug("📝 QUESTION DETECTED:");
        debug("   " + questionText);
        debug("\n📋 ITEMS TO ORDER:");
        validItems.forEach((item, index) => {
          debug(`   ${index + 1}. ${item}`);
        });
        debug("\n🔄 Calling AI...");

        const aiOrder = await askGeminiForOrder(questionText, validItems);

        debug("\n✅ AI RESPONSE RECEIVED:");
        if (aiOrder) {
          debug("   Order: " + aiOrder.join(", "));
        } else {
          debug("   ❌ No order received (error occurred)");
        }
        debug("=".repeat(60) + "\n");

        if (aiOrder && Array.isArray(aiOrder) && aiOrder.length === validItems.length) {
          log(`🤖 AI determined order for sortable question`);
          await reorderItems(draggableItems, aiOrder);

          // Save to local storage
          storedQuestions[storageKey] = aiOrder;
                        saveStoredQuestions(storedQuestions);

          // Wait a bit for the UI to update and verify the order
          await waitFor(1000);
          
          // Try to find and click the continue button multiple times with delays
          await clickContinueButton();

          return;
        } else {
          console.error("AI returned invalid order:", aiOrder);
          log("⚠️ AI returned invalid order for sortable question", false, true);
        }
      } else {
        debug("AI is disabled, skipping sortable question");
        log("⚠️ AI disabled - cannot answer sortable question", false, true);
      }
    }

    async function robustClick(element) {
      if (!element) return false;
      
      try {
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await waitFor(200);
        
        // Native click
        element.click();
        
        // Dispatch events as backup
        const clickEvent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          button: 0
        });
        element.dispatchEvent(clickEvent);
        
        return true;
      } catch (err) {
        console.error("Robust click failed:", err);
        return false;
      }
    }

    async function clickContinueButton() {
      // Try to find and click the continue button multiple times with delays
      for (let attempt = 0; attempt < 15; attempt++) {
        await waitFor(500);
        
        // Try multiple selectors for the continue button
        // The button has data-test="courseflow-forward" attribute
        const checkAnswerButton = 
          document.querySelector('[data-test="courseflow-forward"]') ||
          document.querySelector('button[data-test="courseflow-forward"]') ||
          document.querySelector('[courseflow-forward]') ||
          document.querySelector('button[courseflow-forward]') ||
          document.querySelector('[data-test="submitAnswer"]') ||
          document.querySelector('button[data-test="submitAnswer"]') ||
          document.querySelector('#arrow-next') ||
          document.querySelector('button[aria-label="Next Page"]') ||
          document.querySelector('.continue-button') ||
          document.querySelector('[data-test="continueButton"]') ||
          document.querySelector('button[data-test="continueButton"]');
        
        if (checkAnswerButton) {
          const computedStyle = window.getComputedStyle(checkAnswerButton);
          const isVisible = checkAnswerButton.offsetParent !== null && 
                           computedStyle.display !== 'none' &&
                           computedStyle.visibility !== 'hidden' &&
                           computedStyle.opacity !== '0';
          const isEnabled = !checkAnswerButton.disabled && 
                           !checkAnswerButton.hasAttribute('disabled') &&
                           !checkAnswerButton.classList.contains('disabled');
          
          debug(`Continue button found (attempt ${attempt + 1}), disabled: ${checkAnswerButton.disabled}, visible: ${isVisible}, enabled: ${isEnabled}`);
          debug(`Button element:`, checkAnswerButton);
          debug(`Button classes:`, checkAnswerButton.className);
          debug(
            `Button attributes:`,
            Array.from(checkAnswerButton.attributes)
              .map((a) => `${a.name}="${a.value}"`)
              .join(", "),
          );
          
          // Check if button is visible and enabled
          if (isEnabled && isVisible) {
            log("Checking sortable answer");
            
            // Try multiple ways to click
            try {
              // Scroll button into view first
              checkAnswerButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
              await waitFor(200);
              
              // Try native click first
              checkAnswerButton.click();
              debug("Button clicked using .click()");
            } catch (e) {
              debug("Click failed, trying dispatchEvent:", e);
              try {
                // Try MouseEvent
                const clickEvent = new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  button: 0
                });
                checkAnswerButton.dispatchEvent(clickEvent);
                debug("Button clicked using MouseEvent");
              } catch (e2) {
                debug("MouseEvent failed, trying pointer events:", e2);
                // Try pointer events
                const pointerDown = new PointerEvent("pointerdown", {
                  bubbles: true,
                  cancelable: true,
                  pointerId: 1,
                  button: 0
                });
                const pointerUp = new PointerEvent("pointerup", {
                  bubbles: true,
                  cancelable: true,
                  pointerId: 1,
                  button: 0
                });
                checkAnswerButton.dispatchEvent(pointerDown);
                await waitFor(50);
                checkAnswerButton.dispatchEvent(pointerUp);
                debug("Button clicked using PointerEvent");
              }
            }
            
            await waitFor(800);
            
            // Check if button is still there or if page changed
            const stillThere = document.querySelector('[data-test="courseflow-forward"]');
            if (!stillThere || stillThere.disabled || stillThere !== checkAnswerButton) {
              debug("Continue button clicked and processed - button changed or removed");
              return true;
            }
          } else {
            debug(`Continue button disabled or hidden (attempt ${attempt + 1}) - visible: ${isVisible}, enabled: ${isEnabled}`);
          }
        } else {
          debug(`Continue button not found (attempt ${attempt + 1})`);
          // Log all buttons with data-test attributes for debugging
          if (attempt === 0) {
            const allButtons = document.querySelectorAll('button[data-test]');
            debug(
              `Found ${allButtons.length} buttons with data-test:`,
              Array.from(allButtons).map(
                (b) =>
                  `${b.getAttribute("data-test")}: ${b.textContent
                    ?.trim()
                    ?.substring(0, 30)}`,
              ),
            );
          }
        }
      }
      log("⚠️ Failed to click continue button after all attempts", false, true);
      return false;
    }

    async function reorderItems(draggableItems, order) {
      // order is 1-based array (e.g., [3, 1, 4, 2] means: item 3, then item 1, then item 4, then item 2)
      // draggableItems is the current DOM order

      debug("Reordering items to:", order);
      debug("Current items count:", draggableItems.length);

      if (order.length !== draggableItems.length) {
        console.error("Order length mismatch:", order.length, "vs", draggableItems.length);
        return;
      }

      // Convert NodeList to array to avoid stale references
      const itemsArray = Array.from(draggableItems);

      // Get the parent list
      const parentList = itemsArray[0]?.parentElement;
      if (!parentList) {
        console.error("Could not find parent list");
        return;
      }

      // Create array of items in the desired order (convert from 1-based to 0-based)
      const reorderedItems = order.map((pos) => itemsArray[pos - 1]);

      debug(
        "Target order items:",
        reorderedItems.map((item, idx) => {
          const text =
            item
              ?.querySelector("[data-test='dragItemText']")
              ?.innerText?.trim() || "unknown";
          return `${idx + 1}: ${text.substring(0, 50)}...`;
        }),
      );

      // Method 1: Remove all items and re-add them in the correct order
      // This ensures items are in the exact order we want
      const fragment = document.createDocumentFragment();
      
      // Add items to fragment in the correct order
      reorderedItems.forEach((item) => {
        if (item) {
          fragment.appendChild(item);
        }
      });
      
      // Clear the parent list
      while (parentList.firstChild) {
        parentList.removeChild(parentList.firstChild);
      }
      
      // Add items back in the correct order
      parentList.appendChild(fragment);
      
      debug("Items reordered using fragment method");
      
      // Method 2: Also try using insertBefore one by one as a backup
      // This might be needed for some drag-and-drop libraries
      await waitFor(200);
      
      // Verify and fix order if needed
      const currentChildren = Array.from(parentList.children);
      for (let i = 0; i < reorderedItems.length; i++) {
        const targetItem = reorderedItems[i];
        if (!targetItem) continue;
        
        const currentIndex = currentChildren.indexOf(targetItem);
        const targetIndex = i;
        
        if (currentIndex !== targetIndex) {
          // Item is in wrong position, move it
          const referenceNode = parentList.children[targetIndex] || null;
          if (referenceNode && referenceNode !== targetItem) {
            parentList.insertBefore(targetItem, referenceNode);
            debug(`Fixed item ${i + 1} position: ${currentIndex} -> ${targetIndex}`);
          } else if (!referenceNode) {
            parentList.appendChild(targetItem);
            debug(`Fixed item ${i + 1} position: ${currentIndex} -> end`);
          }
          
          // Update currentChildren array
          currentChildren.splice(currentIndex, 1);
          currentChildren.splice(targetIndex, 0, targetItem);
          
          await waitFor(100);
        }
      }
      
      // Try to simulate drag events for all items to notify the library
      const sortableItems = parentList.querySelectorAll(".sortable-item");
      sortableItems.forEach((item, index) => {
        // Trigger various events that might be needed
        const events = ["change", "input", "blur", "focus"];
        events.forEach((eventType) => {
          const event = new Event(eventType, { bubbles: true });
          item.dispatchEvent(event);
        });
      });

      log(`✅ Reordered ${reorderedItems.length} items`);

      // Verify the order is correct
      await waitFor(300);
      const finalOrder = Array.from(parentList.children).map((li, idx) => {
        const text = li.querySelector("[data-test='dragItemText']")?.innerText?.trim() || "";
        return { index: idx, text: text.substring(0, 50) };
      });
      debug("Final order after reordering:", finalOrder);

      // Wait a bit for the UI to update
      await waitFor(500);

      // Try to trigger additional events that might be needed
      const allSortableItems = parentList.querySelectorAll(".sortable-item");
      allSortableItems.forEach((item, index) => {
        // Trigger change event
        const changeEvent = new Event("change", { bubbles: true });
        item.dispatchEvent(changeEvent);

        // Trigger input event
        const inputEvent = new Event("input", { bubbles: true });
        item.dispatchEvent(inputEvent);

        // Try to trigger React's onChange if it's a React app
        // Only do this for input elements, not sortable items
        if (item instanceof HTMLInputElement) {
          try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype,
              "value"
            )?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(item, item.value || "");
              const reactEvent = new Event("input", { bubbles: true });
              item.dispatchEvent(reactEvent);
            }
          } catch (e) {
            // Ignore errors for non-input elements
            debug("Skipping React input trigger for non-input element");
          }
        }
      });

      // Try to find and trigger any drag-and-drop library callbacks
      // Look for common drag-and-drop library patterns
      const listElement = parentList;
      if (listElement) {
        // Trigger a custom event that might be listened to
        const reorderEvent = new CustomEvent("itemsReordered", {
          bubbles: true,
          detail: { order: order }
        });
        listElement.dispatchEvent(reorderEvent);

        // Try to find React state updates if it's a React app
        const reactInstance = listElement._reactInternalInstance || 
                             listElement.__reactInternalInstance ||
                             listElement._reactInternalFiber;
        if (reactInstance) {
          debug("Found React instance, trying to trigger update");
        }
      }

      debug("Items reordered successfully");
    }

    function saveReviewQuestions() {
      const reviewCards = document.querySelectorAll(
        ".grit.question-review-card",
      );
      if (reviewCards.length === 0) return;

      debug("Found review cards:", reviewCards.length);

      const storedQuestions =
        getStoredQuestions();
      let savedCount = 0;

      reviewCards.forEach((card) => {
        const q = card.querySelector(".paragraph__question");
        const a =
          card.querySelector(".grit.answerButton.selected.correct") ||
          card.querySelector(".grit.answerButton.missed");

        if (q && a) {
          const qText = q.innerText.trim();
          const aText = a.innerText.trim();

          debug("Review Q:", qText);
          debug("Review A:", aText);

          if (!storedQuestions[qText] || storedQuestions[qText] !== aText) {
            storedQuestions[qText] = aText;
            savedCount++;
          }
        }
      });

      if (savedCount > 0) {
                      saveStoredQuestions(storedQuestions);
        log(`💾 Saved ${savedCount} review answers`);
      }
    }

    function waitUntilCheckAnswerButtonIsEnabled() {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const btn =
            document.querySelector("[data-test='courseflow-forward']") ||
            document.querySelector("button[data-test='courseflow-forward']") ||
            document.querySelector("[courseflow-forward]") ||
            document.querySelector("button[courseflow-forward]") ||
            document.querySelector("[data-test='submitAnswer']") ||
            document.querySelector("button[data-test='submitAnswer']") ||
            document.querySelector("[data-test='continueButton']") ||
            document.querySelector("button[data-test='continueButton']");
          if (btn && !btn.disabled) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
    }

    async function waitForNewTestQuestion(previousQuestionTitle) {
      if (!previousQuestionTitle) {
        await waitFor(600);
        return true;
      }

      for (let attempt = 0; attempt < 24; attempt++) {
        await waitFor(200);
        const container = document.querySelector(
          "[data-test='questionContainer']",
        );
        const currentTitle = container
          ?.querySelector("[data-test='questionTitle']")
          ?.innerText?.trim();

        if (!container || !currentTitle || currentTitle !== previousQuestionTitle) {
          return true;
        }
      }
      return false;
    }

    function findEditableTarget(element) {
      if (!element) return null;

      const selectors = [
        "input",
        "textarea",
        "select",
        "[contenteditable='true']",
        "[role='textbox']",
      ];

      const visited = new Set();
      const queue = [];

      const enqueue = (node) => {
        if (!node || visited.has(node)) return;
        visited.add(node);
        queue.push(node);
      };

      enqueue(element);
      if (element.shadowRoot) {
        enqueue(element.shadowRoot);
      }

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) continue;

        for (const selector of selectors) {
          if (typeof current.querySelector === "function") {
            const found = current.querySelector(selector);
            if (found) {
              return found;
            }
          }
        }

        const children =
          current instanceof Element || current instanceof DocumentFragment
            ? current.children || current.childNodes
            : [];

        for (const child of Array.from(children || [])) {
          if (child instanceof Element) {
            enqueue(child);
            if (child.shadowRoot) {
              enqueue(child.shadowRoot);
            }
          }
        }
      }

      if (typeof element.value === "string") {
        return element;
      }

      return null;
    }

    function setValueWithEvents(target, value) {
      if (!target) return false;
      const trimmed = value.trim();

      if (target.tagName) {
        const tag = target.tagName.toLowerCase();
        if (tag === "select") {
          let matched = false;
          for (const option of Array.from(target.options || [])) {
            if (
              option.value.toLowerCase() === trimmed.toLowerCase() ||
              option.text.toLowerCase() === trimmed.toLowerCase()
            ) {
              target.value = option.value;
              option.selected = true;
              matched = true;
              break;
            }
          }
          if (!matched) {
            target.value = trimmed;
          }
        } else if (tag === "input" || tag === "textarea") {
          const descriptor = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(target),
            "value",
          );
          if (descriptor?.set) {
            descriptor.set.call(target, trimmed);
          } else {
            target.value = trimmed;
          }
        } else {
          target.textContent = trimmed;
        }
      } else if (target instanceof HTMLElement) {
        if (target.isContentEditable) {
          target.innerText = trimmed;
        } else {
          target.textContent = trimmed;
        }
      } else {
        target.textContent = trimmed;
      }

      const events = ["input", "change", "blur"];
      for (const eventName of events) {
        try {
          const event =
            eventName === "input"
              ? new InputEvent(eventName, { bubbles: true })
              : new Event(eventName, { bubbles: true });
          target.dispatchEvent(event);
        } catch (err) {
          target.dispatchEvent(new Event(eventName, { bubbles: true }));
        }
      }

      return true;
    }

    function getBlankElementValue(blankElement) {
      const target = findEditableTarget(blankElement);
      if (target) {
        if (target.tagName) {
          const tag = target.tagName.toLowerCase();
          if (tag === "input" || tag === "textarea" || tag === "select") {
            return target.value || "";
          }
        }
        if (target.isContentEditable) {
          return target.innerText || "";
        }
        return target.textContent || "";
      }

      const directValue =
        blankElement.getAttribute?.("value") ||
        blankElement.textContent ||
        blankElement.innerText;
      return directValue ? directValue.trim() : "";
    }

    function setBlankElementValue(blankElement, value) {
      if (!blankElement || !value) {
        return false;
      }

      const target = findEditableTarget(blankElement);
      if (target) {
        simulateHumanTyping(target, value);
        return true;
      }

      blankElement.textContent = value.trim();
      if (typeof blankElement.setAttribute === "function") {
        blankElement.setAttribute("value", value.trim());
      }
      blankElement.setAttribute("data-ace-filled", "true");
      return true;
    }

    function waitFor(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function simulateHumanTyping(target, value) {
      if (!target) return;
      const text = value.trim();

      target.focus?.();
      await waitFor(50);

      const descriptor = target.tagName
        ? Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(target),
            "value",
          )
        : null;

      if (descriptor?.set) {
        descriptor.set.call(target, "");
      } else if (target.tagName) {
        target.value = "";
      } else if (target.isContentEditable) {
        target.innerText = "";
      } else {
        target.textContent = "";
      }

      target.dispatchEvent(new Event("input", { bubbles: true }));

      const characters = text.split("");
      for (const char of characters) {
        const keyEventOptions = {
          key: char,
          char,
          keyCode: char.charCodeAt(0),
          which: char.charCodeAt(0),
          bubbles: true,
        };

        target.dispatchEvent(new KeyboardEvent("keydown", keyEventOptions));
        target.dispatchEvent(new KeyboardEvent("keypress", keyEventOptions));

        if (descriptor?.set) {
          descriptor.set.call(target, (target.value || "") + char);
        } else if (target.tagName) {
          target.value = (target.value || "") + char;
        } else if (target.isContentEditable) {
          target.innerText = (target.innerText || "") + char;
        } else {
          target.textContent = (target.textContent || "") + char;
        }

        target.dispatchEvent(new Event("input", { bubbles: true }));
        target.dispatchEvent(new KeyboardEvent("keyup", keyEventOptions));
        await waitFor(30 + Math.random() * 70);
      }

      target.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        }),
      );
      target.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          which: 13,
          bubbles: true,
        }),
      );

      target.dispatchEvent(new Event("change", { bubbles: true }));
      await waitFor(50);
      target.blur?.();
    }

    // Log startup
    log("✨ Script initialized!");
    log("Press Ctrl+Shift+A (Win) or Cmd+Shift+A (Mac) for settings");
    debug("=== Aceable Script Started ===");
    debug("Config:", config);
    
    if (config.useAI && config.geminiApiKey === "YOUR_API_KEY_HERE") {
      log("⚠️ Please set your Gemini API key in settings!", true);
      console.warn("No API key configured - AI will not work!");
    }
    if (!config.scriptEnabled) {
      log("⏸️ Script is DISABLED - enable in settings", false, true);
    }

    // Check for break on startup
    detectBreakPopup();
  }

  // Initialize when DOM is ready
  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
