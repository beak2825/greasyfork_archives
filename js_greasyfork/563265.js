// ==UserScript==
// @name         Disable YouTube Hotkeys with Modern Settings Page
// @namespace    https://github.com/VKrishna04
// @version      4.5.1
// @description  Disable various YouTube hotkeys with fine-grained control (Excludes Search/Comments)
// @author       VKrishna04
// @match        *://www.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      Apache-2.0
// @homepageURL  https://yt-hotkeys.vkrishna04.me/
// @supportURL   https://github.com/Life-Experimentalist/Youtube-Keystrokes-Blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/563265/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/563265/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  const DEFAULT_SETTINGS = {
    disableNumericKeys: true,
    disableMKey: true,
    disableCtrlLeft: true,
    disableCtrlRight: true,
    disableSpacebar: false,
    disableHorizontalArrows: false,
    disableVerticalArrows: false,
    disablePlayPauseK: false,
    disableRewindJ: false,
    disableFastForwardL: false,
    disablePreviousVideoP: false,
    disableNextVideoN: false,
    disableFKey: false,
    disableVKey: false,
    disableTheatreModeT: false,
    disableMiniPlayerI: false,
    disableCloseDialogEsc: false,
    disableCaptionsC: false,
    disableTextOpacityO: false,
    disableWindowOpacityW: false,
    disableFontIncrease: false,
    disableFontDecrease: false,
    disablePanUpW: false,
    disablePanLeftA: false,
    disablePanDownS: false,
    disablePanRightD: false,
    disableZoomIn: false,
    disableZoomOut: false,
    disableShiftSlash: false,
    disableSpeedControl: false,
    disableFrameSkip: false,
  };

  let settings = loadSettings();

  function loadSettings() {
    const stored = GM_getValue("hotkeySettings", DEFAULT_SETTINGS);
    // Migrate legacy single-arrow toggle into split horizontal/vertical controls
    if (stored.disableArrowKeys !== undefined) {
      if (stored.disableHorizontalArrows === undefined) stored.disableHorizontalArrows = stored.disableArrowKeys;
      if (stored.disableVerticalArrows === undefined) stored.disableVerticalArrows = stored.disableArrowKeys;
    }
    return { ...DEFAULT_SETTINGS, ...stored };
  }

  function persistSettings(newSettings) {
    settings = { ...DEFAULT_SETTINGS, ...newSettings };
    GM_setValue("hotkeySettings", settings);
    return settings;
  }

  // Helper function to get fresh settings
  function getSettings() {
    return loadSettings();
  }

  // --- 1. HOTKEY BLOCKING LOGIC ---
  function handleHotkeyEvent(e) {
    const currentSettings = getSettings();
    const target = e.target;
    const isTyping =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable;

    if (isTyping) return;

    const block = () => {
      e.preventDefault();
      e.stopPropagation();
    };

    if (currentSettings.disableCtrlLeft && e.ctrlKey && e.code === "ArrowLeft") {
      block();
      return;
    }
    if (currentSettings.disableCtrlRight && e.ctrlKey && e.code === "ArrowRight") {
      block();
      return;
    }
    if (currentSettings.disablePlayPauseK && (e.key === "k" || e.key === "K")) {
      block();
      return;
    }
    if (currentSettings.disableRewindJ && (e.key === "j" || e.key === "J")) {
      block();
      return;
    }
    if (currentSettings.disableFastForwardL && (e.key === "l" || e.key === "L")) {
      block();
      return;
    }
    if (currentSettings.disablePreviousVideoP && e.shiftKey && (e.key === "p" || e.key === "P")) {
      block();
      return;
    }
    if (currentSettings.disableNextVideoN && e.shiftKey && (e.key === "n" || e.key === "N")) {
      block();
      return;
    }
    if (currentSettings.disableShiftSlash && e.shiftKey && (e.key === "?" || e.key === "/")) {
      block();
      return;
    }
    if (currentSettings.disableNumericKeys && e.key >= "0" && e.key <= "9") {
      block();
      return;
    }
    if (
      currentSettings.disableSpacebar &&
      (e.code === "Space" || e.key === " " || e.key === "Spacebar" || e.keyCode === 32)
    ) {
      block();
      return;
    }
    if (
      currentSettings.disableHorizontalArrows &&
      !e.ctrlKey &&
      ["ArrowLeft", "ArrowRight"].includes(e.code)
    ) {
      block();
      return;
    }
    if (
      currentSettings.disableVerticalArrows &&
      !e.ctrlKey &&
      ["ArrowUp", "ArrowDown"].includes(e.code)
    ) {
      block();
      return;
    }
    if (currentSettings.disableFKey && (e.key === "f" || e.key === "F")) {
      block();
      return;
    }
    if (currentSettings.disableMKey && (e.key === "m" || e.key === "M")) {
      block();
      return;
    }
    if (currentSettings.disableVKey && (e.key === "v" || e.key === "V")) {
      block();
      return;
    }
    if (currentSettings.disableTheatreModeT && (e.key === "t" || e.key === "T")) {
      block();
      return;
    }
    if (currentSettings.disableMiniPlayerI && (e.key === "i" || e.key === "I")) {
      block();
      return;
    }
    if (currentSettings.disableCloseDialogEsc && (e.key === "Escape" || e.key === "Esc")) {
      block();
      return;
    }
    if (currentSettings.disableCaptionsC && (e.key === "c" || e.key === "C")) {
      block();
      return;
    }
    if (currentSettings.disableTextOpacityO && (e.key === "o" || e.key === "O")) {
      block();
      return;
    }
    if (currentSettings.disableWindowOpacityW && (e.key === "w" || e.key === "W")) {
      block();
      return;
    }
    if (currentSettings.disableFontIncrease && (e.key === "+" || e.key === "=")) {
      block();
      return;
    }
    if (currentSettings.disableFontDecrease && (e.key === "-" || e.key === "_")) {
      block();
      return;
    }
    if (currentSettings.disablePanUpW && (e.key === "w" || e.key === "W")) {
      block();
      return;
    }
    if (currentSettings.disablePanLeftA && (e.key === "a" || e.key === "A")) {
      block();
      return;
    }
    if (currentSettings.disablePanDownS && (e.key === "s" || e.key === "S")) {
      block();
      return;
    }
    if (currentSettings.disablePanRightD && (e.key === "d" || e.key === "D")) {
      block();
      return;
    }
    if (
      currentSettings.disableZoomIn &&
      (e.key === "+" || e.key === "=" || e.key === "]")
    ) {
      block();
      return;
    }
    if (
      currentSettings.disableZoomOut &&
      (e.key === "-" || e.key === "_" || e.key === "[")
    ) {
      block();
      return;
    }
    if (
      currentSettings.disableSpeedControl &&
      e.shiftKey &&
      (e.key === "<" || e.key === ">")
    ) {
      block();
      return;
    }
    if (currentSettings.disableFrameSkip && (e.key === "," || e.key === ".")) {
      block();
      return;
    }
  }

  ["keydown", "keypress", "keyup"].forEach((evt) => {
    window.addEventListener(evt, handleHotkeyEvent, true);
  });

  // --- 2. UI: SETTINGS MODAL ---
  function openSettings() {
    document.getElementById("yt-hotkey-settings-modal")?.remove();
    document.getElementById("yt-hotkey-settings-overlay")?.remove();

    let overlay = document.createElement("div");
    overlay.id = "yt-hotkey-settings-overlay";
    overlay.className = "yt-hk-overlay";

    let modal = document.createElement("div");
    modal.id = "yt-hotkey-settings-modal";
    modal.className = "yt-hk-modal";

    // Header
    let header = document.createElement("div");
    header.className = "yt-hk-header";

    let titleContainer = document.createElement("div");
    titleContainer.style.display = "flex";
    titleContainer.style.alignItems = "baseline";
    titleContainer.style.gap = "10px";

    let title = document.createElement("h2");
    title.textContent = "Hotkey Settings";
    titleContainer.appendChild(title);

    let versionSpan = document.createElement("span");
    versionSpan.textContent = `v${GM_info.script.version}`;
    versionSpan.style.fontSize = "11px";
    versionSpan.style.color = "#aaa";
    titleContainer.appendChild(versionSpan);

    let closeIcon = document.createElement("div");
    closeIcon.className = "yt-hk-close";
    closeIcon.textContent = "❌";

    header.append(titleContainer, closeIcon);
    modal.appendChild(header);

    // Content
    let content = document.createElement("div");
    content.className = "yt-hk-content";

    const liveSettings = getSettings();

    const resetSettings = () => {
      settings = persistSettings(DEFAULT_SETTINGS);
      [...document.querySelectorAll(".yt-hk-row input[type='checkbox']")].forEach((checkbox) => {
        if (checkbox.id in DEFAULT_SETTINGS) {
          checkbox.checked = DEFAULT_SETTINGS[checkbox.id];
        }
      });
    };

    const baseOptions = [
      { id: "disableNumericKeys", label: "Disable Numbers (0-9)", checked: liveSettings.disableNumericKeys },
      { id: "disableSpacebar", label: "Disable Spacebar", checked: liveSettings.disableSpacebar },
      { id: "disableHorizontalArrows", label: "Disable Progress Forward / Rewind (← →)", checked: liveSettings.disableHorizontalArrows },
      { id: "disableVerticalArrows", label: "Disable Volume Up / Down (↑ ↓)", checked: liveSettings.disableVerticalArrows },
      { id: "disableCtrlLeft", label: "Disable (Ctrl + Left)", checked: liveSettings.disableCtrlLeft },
      { id: "disableCtrlRight", label: "Disable Ctrl + Right", checked: liveSettings.disableCtrlRight },
      { id: "disableFKey", label: 'Disable "F" (Fullscreen)', checked: liveSettings.disableFKey },
      { id: "disableMKey", label: 'Disable "M" (Mute)', checked: liveSettings.disableMKey },
      { id: "disableVKey", label: 'Disable "V" (Captions toggle)', checked: liveSettings.disableVKey },
      { id: "disableSpeedControl", label: "Disable Speed (Shift+<>)", checked: liveSettings.disableSpeedControl },
      { id: "disableFrameSkip", label: "Disable Frame Skip (./,)", checked: liveSettings.disableFrameSkip },
    ];

    const advancedOptions = [
      { id: "disablePlayPauseK", label: "Play/Pause (k)", checked: liveSettings.disablePlayPauseK },
      { id: "disableRewindJ", label: "Rewind (j)", checked: liveSettings.disableRewindJ },
      { id: "disableFastForwardL", label: "Fast Forward (l)", checked: liveSettings.disableFastForwardL },
      { id: "disablePreviousVideoP", label: "Previous Video (Shift+p)", checked: liveSettings.disablePreviousVideoP },
      { id: "disableNextVideoN", label: "Next Video (Shift+n)", checked: liveSettings.disableNextVideoN },
      { id: "disableTheatreModeT", label: "Theatre Mode (t)", checked: liveSettings.disableTheatreModeT },
      { id: "disableMiniPlayerI", label: "Miniplayer (i)", checked: liveSettings.disableMiniPlayerI },
      { id: "disableCloseDialogEsc", label: "Escape (close dialog)", checked: liveSettings.disableCloseDialogEsc },
      { id: "disableCaptionsC", label: "Captions (c)", checked: liveSettings.disableCaptionsC },
      { id: "disableTextOpacityO", label: "Text Opacity (o)", checked: liveSettings.disableTextOpacityO },
      { id: "disableWindowOpacityW", label: "Window Opacity (w)", checked: liveSettings.disableWindowOpacityW },
      { id: "disableFontIncrease", label: "Font Size + (+)", checked: liveSettings.disableFontIncrease },
      { id: "disableFontDecrease", label: "Font Size - (-)", checked: liveSettings.disableFontDecrease },
      { id: "disablePanUpW", label: "Pan Up (w)", checked: liveSettings.disablePanUpW },
      { id: "disablePanLeftA", label: "Pan Left (a)", checked: liveSettings.disablePanLeftA },
      { id: "disablePanDownS", label: "Pan Down (s)", checked: liveSettings.disablePanDownS },
      { id: "disablePanRightD", label: "Pan Right (d)", checked: liveSettings.disablePanRightD },
      { id: "disableZoomIn", label: "Zoom In (+ or ])", checked: liveSettings.disableZoomIn },
      { id: "disableZoomOut", label: "Zoom Out (- or [)", checked: liveSettings.disableZoomOut },
      { id: "disableShiftSlash", label: "Keyboard Shortcuts (Shift+/)", checked: liveSettings.disableShiftSlash },
    ];

    const buildRows = (opts, container) => {
      opts.forEach((opt) => {
        let row = document.createElement("div");
        row.className = "yt-hk-row";
        let label = document.createElement("span");
        label.textContent = opt.label;
        let labelSwitch = document.createElement("label");
        labelSwitch.className = "yt-hk-switch";
        let input = document.createElement("input");
        input.type = "checkbox";
        input.id = opt.id;
        input.checked = opt.checked;
        let slider = document.createElement("span");
        slider.className = "yt-hk-slider";
        labelSwitch.append(input, slider);
        row.append(label, labelSwitch);
        container.appendChild(row);
      });
    };

    buildRows(baseOptions, content);

    const advancedToggle = document.createElement("button");
    advancedToggle.className = "yt-hk-advanced-toggle";
    advancedToggle.textContent = "Show more controls";

    const advancedContainer = document.createElement("div");
    advancedContainer.className = "yt-hk-advanced";

    buildRows(advancedOptions, advancedContainer);

    advancedToggle.onclick = () => {
      const isOpen = advancedContainer.classList.toggle("open");
      advancedToggle.textContent = isOpen ? "Hide extra controls" : "Show more controls";
    };

    content.appendChild(advancedToggle);
    content.appendChild(advancedContainer);
    modal.appendChild(content);

    // Footer
    let footer = document.createElement("div");
    footer.className = "yt-hk-footer";

    let resetBtn = document.createElement("button");
    resetBtn.className = "yt-hk-reset-btn";
    resetBtn.textContent = "Reset to defaults";

    let shortcutsBtn = document.createElement("button");
    shortcutsBtn.className = "yt-hk-shortcuts-btn";
    shortcutsBtn.textContent = "Show Keyboard Shortcuts";
    shortcutsBtn.title = "Open YouTube's keyboard shortcuts help (Shift+?)";

    let footerActions = document.createElement("div");
    footerActions.className = "yt-hk-footer-actions";

    let saveBtn = document.createElement("button");
    saveBtn.className = "yt-hk-save-btn";
    saveBtn.textContent = "Save";

    footer.append(resetBtn, shortcutsBtn, footerActions);
    footerActions.appendChild(saveBtn);
    modal.appendChild(footer);

    document.body.append(overlay, modal);

    const close = () => {
      modal.style.opacity = "0";
      overlay.style.opacity = "0";
      setTimeout(() => {
        modal.remove();
        overlay.remove();
      }, 200);
    };
    closeIcon.onclick = overlay.onclick = close;
    resetBtn.onclick = () => {
      resetSettings();
      resetBtn.textContent = "Reset ✓";
      setTimeout(() => {
        resetBtn.textContent = "Reset to defaults";
      }, 1200);
    };
    shortcutsBtn.onclick = () => {
      const evt = new KeyboardEvent("keydown", {
        key: "?",
        shiftKey: true,
        code: "Slash",
        keyCode: 191,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(evt);
      close();
    };
    saveBtn.onclick = () => {
      const newSettings = {};
      [...baseOptions, ...advancedOptions].forEach((opt) => {
        const el = document.getElementById(opt.id);
        newSettings[opt.id] = el ? el.checked : DEFAULT_SETTINGS[opt.id];
      });

      const mergedSettings = persistSettings({ ...liveSettings, ...newSettings });
      settings = mergedSettings;

      saveBtn.textContent = "Saved!";
      saveBtn.style.backgroundColor = "#00cc00";

      setTimeout(() => {
        saveBtn.textContent = "Save";
        saveBtn.style.backgroundColor = "";
      }, 1000);

      setTimeout(close, 500);
    };

    requestAnimationFrame(() => {
      modal.style.opacity = "1";
      overlay.style.opacity = "1";
    });
  }

  // --- 3. INJECTION: ACTIONS BAR BUTTON (BELOW VIDEO) ---
  function injectActionButton() {
    // Check if button already exists
    if (document.getElementById("yt-hk-action-btn")) return;

    // Multiple selectors to try - YouTube changes DOM structure frequently
    const possibleContainers = [
      document.querySelector("ytd-menu-renderer #top-level-buttons-computed"),
      document.querySelector("ytd-menu-renderer #menu-top-level-buttons"),
      document.querySelector("ytd-menu-renderer #flexible-item-buttons"),
      document.querySelector("ytd-menu-renderer") ? document.querySelector("ytd-menu-renderer").querySelector("div[id*='buttons']") : null,
      document.querySelector("div[role='region'] [data-content-region]") ? document.querySelector("div[role='region'] [data-content-region]").querySelector("div[id*='buttons']") : null,
    ].filter(Boolean)[0];

    const actionsContainer = possibleContainers;

    if (!actionsContainer) {
      // Container not found yet, will retry with observer
      return;
    }

    // 2. Create Wrapper (to match YouTube's flex layout)
    const wrapper = document.createElement("div");
    wrapper.id = "yt-hk-action-btn";
    wrapper.style.display = "inline-block";
    wrapper.style.marginLeft = "8px"; // Add some spacing between buttons

    // 3. Create the Button (Native Look - Pill Shape)
    // We use YouTube CSS variables to ensure it works in Dark & Light mode automatically
    const btn = document.createElement("button");
    btn.className = "yt-hk-native-pill-btn";
    btn.setAttribute("aria-label", "Hotkey Settings");

    // 4. Icon
    const iconSpan = document.createElement("span");
    iconSpan.className = "yt-hk-icon-wrapper";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "24");
    svg.style.fill = "currentColor"; // Important: Inherits text color (black/white)

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M20,5H4C2.9,5,2,5.9,2,7v10c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V7C22,5.9,21.1,5,20,5z M11,8h2v2h-2V8z M11,11h2v2h-2 V11z M8,8h2v2H8V8z M8,11h2v2H8V11z M7,13H5v-2h2V13z M7,10H5V8h2V10z M16,17H8v-2h8V17z M16,13h-2v-2h2V13z M16,10h-2V8h2V10z M19,13h-2v-2 h2V13z M19,10h-2V8h2V10z",
    );
    svg.appendChild(path);
    iconSpan.appendChild(svg);

    // 5. Text Label
    const textSpan = document.createElement("span");
    textSpan.textContent = "Hotkeys";
    textSpan.style.marginLeft = "6px";
    textSpan.style.fontWeight = "500";
    textSpan.style.fontFamily = "Roboto, Arial, sans-serif";
    textSpan.style.fontSize = "14px";

    btn.append(iconSpan, textSpan);
    btn.onclick = openSettings;

    wrapper.appendChild(btn);

    // 6. Insert into DOM
    // Append to the end of the action buttons list
    actionsContainer.appendChild(wrapper);
  }

  // --- 4. OBSERVER LOGIC WITH PROPER TIMING ---
  let injectionAttempts = 0;
  let isInjecting = false;
  let injectionTimeout = null;

  // Improved injection with better timing and waiting for specific elements
  async function tryInjectWithRetry() {
    if (isInjecting) return;
    isInjecting = true;

    // Don't try if button already exists
    if (document.getElementById("yt-hk-action-btn")) {
      isInjecting = false;
      return;
    }

    // Wait for the video player and actions container to be present
    const maxAttempts = 40; // Increased from 20
    const baseDelay = 50; // Reduced from 100 for faster initial checks

    for (let i = 0; i < maxAttempts; i++) {
      // Check if we're on a watch page
      if (!window.location.pathname.startsWith('/watch')) {
        isInjecting = false;
        return;
      }

      // Check if button already exists (another attempt might have succeeded)
      if (document.getElementById("yt-hk-action-btn")) {
        isInjecting = false;
        return;
      }

      // Look for the video player AND the actions container
      const videoPlayer = document.querySelector('ytd-watch-flexy') || document.querySelector('#player');
      const actionsContainer = document.querySelector("ytd-menu-renderer #top-level-buttons-computed") ||
                               document.querySelector("ytd-menu-renderer #menu-top-level-buttons") ||
                               document.querySelector("ytd-menu-renderer #flexible-item-buttons");

      if (videoPlayer && actionsContainer) {
        // Both elements are ready, inject now
        injectActionButton();
        isInjecting = false;
        return;
      }

      // Exponential backoff: wait longer each attempt, but slower growth
      const delay = baseDelay * Math.pow(1.15, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    isInjecting = false;
  }

  // Watch for YouTube's SPA navigation events
  function handlePageChange() {
    // Clear any pending timeout
    if (injectionTimeout) clearTimeout(injectionTimeout);

    // Reset injection state on navigation
    injectionAttempts = 0;
    isInjecting = false;

    // Try injection after a short delay to let the page render
    injectionTimeout = setTimeout(() => tryInjectWithRetry(), 100);
  }

  // Listen for YouTube's navigation events (SPA)
  document.addEventListener('yt-navigate-finish', handlePageChange);
  document.addEventListener('yt-page-data-updated', handlePageChange);

  // Backup: MutationObserver to catch when the actions container appears
  const observer = new MutationObserver((mutations) => {
    // Only observe if on a watch page and button doesn't exist
    if (window.location.pathname.startsWith('/watch') && !document.getElementById("yt-hk-action-btn") && !isInjecting) {
      tryInjectWithRetry();
    }
  });

  // Start observing immediately once DOM is ready
  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    }
  }

  // Start observing as early as possible
  if (document.body) {
    startObserver();
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }

  // Initial injection attempts - more aggressive on first load
  function scheduleInitialInjection() {
    // Try immediately
    tryInjectWithRetry();

    // Also try after a short delay
    setTimeout(() => {
      if (!document.getElementById("yt-hk-action-btn") && !isInjecting && window.location.pathname.startsWith('/watch')) {
        tryInjectWithRetry();
      }
    }, 300);

    // And again after a bit longer
    setTimeout(() => {
      if (!document.getElementById("yt-hk-action-btn") && !isInjecting && window.location.pathname.startsWith('/watch')) {
        tryInjectWithRetry();
      }
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInitialInjection);
  } else {
    // DOM already loaded, schedule injection
    scheduleInitialInjection();
  }

  // Fallback Tampermonkey Menu
  GM_registerMenuCommand("YouTube Hotkey Settings", openSettings);

  // --- 5. STYLES ---
  GM_addStyle(`
        /* Modal Styles */
        .yt-hk-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; opacity: 0; transition: opacity 0.2s; }
        .yt-hk-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background: #212121; color: #eee; border-radius: 12px; z-index: 10000; font-family: 'Roboto', sans-serif; box-shadow: 0 12px 24px rgba(0,0,0,0.6); border: 1px solid #333; opacity: 0; transition: opacity 0.2s; }
        .yt-hk-header { padding: 16px 20px; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center; }
        .yt-hk-header h2 { margin: 0; font-size: 18px; font-weight: 500; color: #fff; }
        .yt-hk-close { cursor: pointer; font-size: 28px; color: #aaa; }
        .yt-hk-close:hover { color: #fff; }
        .yt-hk-content { padding: 10px 0; max-height: 60vh; overflow-y: auto; overflow-x: hidden; }
        .yt-hk-row { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a2a2a; font-size: 15px; }
        .yt-hk-row:hover { background: #2a2a2a; }
        .yt-hk-switch { position: relative; width: 40px; height: 20px; display: inline-block; }
        .yt-hk-switch input { opacity: 0; width: 0; height: 0; }
        .yt-hk-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4d4d4d; transition: .3s; border-radius: 20px; }
        .yt-hk-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .yt-hk-slider { background-color: #ff0033; }
        input:checked + .yt-hk-slider:before { transform: translateX(20px); }
        .yt-hk-advanced-toggle { width: calc(100% - 40px); margin: 10px 20px; padding: 10px 12px; background: #2a2a2a; border: 1px solid #3d3d3d; color: #eee; border-radius: 8px; cursor: pointer; text-align: left; }
        .yt-hk-advanced-toggle:hover { background: #333; }
        .yt-hk-advanced { display: none; padding-top: 6px; }
        .yt-hk-advanced.open { display: block; }
        .yt-hk-footer { padding: 12px 20px; border-top: 1px solid #3d3d3d; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .yt-hk-footer-actions { display: flex; gap: 10px; }
        .yt-hk-save-btn { background: #ff0033; border: none; padding: 10px 18px; color: #fff; font-weight: 500; border-radius: 8px; cursor: pointer; text-transform: uppercase; font-size: 15px; transition: background-color 0.2s; }
        .yt-hk-save-btn:hover { background: #CC0000; }
        .yt-hk-reset-btn { background: transparent; border: 1px solid #555; color: #eee; padding: 9px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .yt-hk-reset-btn:hover { background: #2a2a2a; border-color: #777; }
        .yt-hk-shortcuts-btn { background: #2a2a2a; border: 1px solid #444; color: #eee; padding: 9px 14px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; white-space: nowrap; }
        .yt-hk-shortcuts-btn:hover { background: #333; border-color: #666; }

        /* NATIVE BUTTON STYLES (MATCHING SHARE BUTTON) */
        .yt-hk-native-pill-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            padding: 0 16px;
            border-radius: 18px;
            border: none;
            cursor: pointer;

            /* The magic variables that make it match Light/Dark mode automatically */
            background-color: var(--yt-spec-badge-chip-background, rgba(255, 255, 255, 0.1));
            color: var(--yt-spec-text-primary, #fff);

            transition: background-color 0.2s;
        }

        .yt-hk-native-pill-btn:hover {
            background-color: var(--yt-spec-brand-button-background-hover, rgba(255, 255, 255, 0.2));
        }

        .yt-hk-icon-wrapper {
            display: flex;
            align-items: center;
            width: 24px;
            height: 24px;
        }
    `);
})();
