// ==UserScript==
// @name         Disable YouTube Hotkeys with Modern Settings Page
// @namespace    https://github.com/VKrishna04
// @version      4.1
// @description  Disable various YouTube hotkeys with fine-grained control (Excludes Search/Comments)
// @author       VKrishna04
// @email        hello@vkrishna04.me
// @match        *://www.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      Apache-2.0
// @homepageURL  https://yt-hotkeys.vkrishna04.me/
// @supportURL   https://github.com/Life-Experimentalist/Youtube-Keystrokes-Blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/563265/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/563265/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  let settings = GM_getValue("hotkeySettings", {
    disableNumericKeys: true,
    disableSpacebar: false,
    disableArrowKeys: false,
    disableCtrlLeft: true,
    disableCtrlRight: true,
    disableFKey: false,
    disableMKey: true,
    disableSpeedControl: false,
    disableFrameSkip: false,
  });

  // --- 1. HOTKEY BLOCKING LOGIC ---
  window.addEventListener(
    "keydown",
    function (e) {
      const target = e.target;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (settings.disableCtrlLeft && e.ctrlKey && e.code === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableCtrlRight && e.ctrlKey && e.code === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableNumericKeys && e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableSpacebar && e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (
        settings.disableArrowKeys &&
        !e.ctrlKey &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableFKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableMKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (
        settings.disableSpeedControl &&
        e.shiftKey &&
        (e.key === "<" || e.key === ">")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (settings.disableFrameSkip && (e.key === "," || e.key === ".")) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

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
    closeIcon.textContent = "×";

    header.append(titleContainer, closeIcon);
    modal.appendChild(header);

    // Content
    let content = document.createElement("div");
    content.className = "yt-hk-content";

    let options = [
      {
        id: "disableNumericKeys",
        label: "Disable Numbers (0–9)",
        checked: settings.disableNumericKeys,
      },
      {
        id: "disableSpacebar",
        label: "Disable Spacebar",
        checked: settings.disableSpacebar,
      },
      {
        id: "disableArrowKeys",
        label: "Disable Arrow Keys",
        checked: settings.disableArrowKeys,
      },
      {
        id: "disableCtrlLeft",
        label: "Disable Ctrl + Left",
        checked: settings.disableCtrlLeft,
      },
      {
        id: "disableCtrlRight",
        label: "Disable Ctrl + Right",
        checked: settings.disableCtrlRight,
      },
      {
        id: "disableFKey",
        label: 'Disable "F" (Fullscreen)',
        checked: settings.disableFKey,
      },
      {
        id: "disableMKey",
        label: 'Disable "M" (Mute)',
        checked: settings.disableMKey,
      },
      {
        id: "disableSpeedControl",
        label: "Disable Speed (Shift+<>)",
        checked: settings.disableSpeedControl,
      },
      {
        id: "disableFrameSkip",
        label: "Disable Frame Skip (./,)",
        checked: settings.disableFrameSkip,
      },
    ];

    options.forEach((opt) => {
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
      content.appendChild(row);
    });
    modal.appendChild(content);

    // Footer
    let footer = document.createElement("div");
    footer.className = "yt-hk-footer";
    let saveBtn = document.createElement("button");
    saveBtn.className = "yt-hk-save-btn";
    saveBtn.textContent = "Save";
    footer.appendChild(saveBtn);
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
    saveBtn.onclick = () => {
      options.forEach((opt) => {
        settings[opt.id] = document.getElementById(opt.id).checked;
      });
      GM_setValue("hotkeySettings", settings);
      close();
    };

    requestAnimationFrame(() => {
      modal.style.opacity = "1";
      overlay.style.opacity = "1";
    });
  }

  // --- 3. INJECTION: ACTIONS BAR BUTTON (BELOW VIDEO) ---
  function injectActionButton() {
    // 1. Find the Actions Bar Container
    // Based on your code snippet, this is 'top-level-buttons-computed' inside 'ytd-menu-renderer'
    const actionsContainer = document.querySelector(
      "ytd-menu-renderer #top-level-buttons-computed",
    );

    if (!actionsContainer) return;
    if (document.getElementById("yt-hk-action-btn")) return; // Already exists

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

  // --- 4. OBSERVER LOGIC ---
  // Watch for the actions bar appearing (It loads lazily below the video)
  const observer = new MutationObserver((mutations) => {
    if (!document.getElementById("yt-hk-action-btn")) {
      injectActionButton();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Fallback Tampermonkey Menu
  GM_registerMenuCommand("YouTube Hotkey Settings", openSettings);

  // --- 5. STYLES ---
  GM_addStyle(`
        /* Modal Styles */
        .yt-hk-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; opacity: 0; transition: opacity 0.2s; }
        .yt-hk-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 350px; background: #212121; color: #eee; border-radius: 12px; z-index: 10000; font-family: 'Roboto', sans-serif; box-shadow: 0 12px 24px rgba(0,0,0,0.6); border: 1px solid #333; opacity: 0; transition: opacity 0.2s; }
        .yt-hk-header { padding: 16px 20px; border-bottom: 1px solid #3d3d3d; display: flex; justify-content: space-between; align-items: center; }
        .yt-hk-header h2 { margin: 0; font-size: 16px; font-weight: 500; color: #fff; }
        .yt-hk-close { cursor: pointer; font-size: 24px; color: #aaa; }
        .yt-hk-close:hover { color: #fff; }
        .yt-hk-content { padding: 10px 0; max-height: 400px; overflow-y: auto; }
        .yt-hk-row { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a2a2a; }
        .yt-hk-row:hover { background: #2a2a2a; }
        .yt-hk-switch { position: relative; width: 40px; height: 20px; display: inline-block; }
        .yt-hk-switch input { opacity: 0; width: 0; height: 0; }
        .yt-hk-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #4d4d4d; transition: .3s; border-radius: 20px; }
        .yt-hk-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .yt-hk-slider { background-color: #ff0033; }
        input:checked + .yt-hk-slider:before { transform: translateX(20px); }
        .yt-hk-footer { padding: 12px 20px; text-align: right; border-top: 1px solid #3d3d3d; }
        .yt-hk-save-btn { background: #ff0033; border: none; padding: 8px 16px; color: #fff; font-weight: 500; border-radius: 2px; cursor: pointer; text-transform: uppercase; font-size: 14px; transition: background-color 0.2s; }
        .yt-hk-save-btn:hover { background: #CC0000; }

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
