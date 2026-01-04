// ==UserScript==
// @name         WeatherBell Overlay (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  A highly customizable overlay for WeatherBell model time data.
// @match        https://maps.weatherbell.com/*
// @match        https://models.weatherbell.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556923/WeatherBell%20Overlay%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556923/WeatherBell%20Overlay%20%28Enhanced%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- STATE & CONFIGURATION ---

  let targetNode = null;
  let observer = null;
  let isMinimized = false;
  let isLocked = false;
  let modelInitTime = null;
  let tempSettings = {};

  const defaultSettings = {
    position: { top: 100, left: 200 },
    dimensions: { width: 500, padding: 30, borderRadius: 16 },
    font: { size: 72, family: "Saira Condensed" },
    theme: "dark",
    display: {
      opacity: 0.95,
      showDate: true,
      showAccent: true,
      showDelta: true,
      showTimezones: ["ET"],
      dateTimeSpacing: 4,
    },
    timeFormat: "12",
    locked: false,
  };

  const themes = {
    dark: {
      bg: "rgba(20, 20, 25, 1)",
      text: "#ffffff",
      subtext: "#9ca3af",
      accent: "rgba(96, 165, 250, 0.5)",
      border: "rgba(255,255,255,0.08)",
    },
    light: {
      bg: "rgba(255, 255, 255, 1)",
      text: "#1f2937",
      subtext: "#6b7280",
      accent: "rgba(59, 130, 246, 0.5)",
      border: "rgba(0,0,0,0.08)",
    },
    minimal: {
      bg: "rgba(0, 0, 0, 1)",
      text: "#ffffff",
      subtext: "#ffffff",
      accent: "rgba(255, 255, 255, 0.3)",
      border: "rgba(255,255,255,0.15)",
    },
    contrast: {
      bg: "rgba(0, 0, 0, 1)",
      text: "#00ff00",
      subtext: "#ffff00",
      accent: "rgba(0, 255, 0, 0.5)",
      border: "rgba(0,255,0,0.3)",
    },
  };

  const fonts = {
    "Saira Condensed": "Saira+Condensed:wght@600;700",
    "Roboto Condensed": "Roboto+Condensed:wght@700",
    Oswald: "Oswald:wght@700",
    Montserrat: "Montserrat:wght@700",
  };

  // --- UTILITY FUNCTIONS ---

  function loadSettings() {
    try {
      const saved = localStorage.getItem("weatherbell_overlay_settings_v2");
      if (saved) {
        // Deep merge to ensure new defaults are applied if not in saved settings
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          dimensions: { ...defaultSettings.dimensions, ...parsed.dimensions },
          font: { ...defaultSettings.font, ...parsed.font },
          display: { ...defaultSettings.display, ...parsed.display },
        };
      }
    } catch (e) {
      console.error("Error loading settings, using defaults.", e);
    }
    return defaultSettings;
  }

  function saveSettings(settingsToSave) {
    localStorage.setItem(
      "weatherbell_overlay_settings_v2",
      JSON.stringify(settingsToSave)
    );
  }

  let settings = loadSettings();
  isLocked = settings.locked;

  // --- DYNAMIC FONT LOADING ---

  function loadFont(fontFamily) {
    const fontId = `font-${fontFamily.replace(/\s+/g, "-")}`;
    if (document.getElementById(fontId) || !fonts[fontFamily]) return;

    const fontLink = document.createElement("link");
    fontLink.id = fontId;
    fontLink.rel = "stylesheet";
    fontLink.href = `https://fonts.googleapis.com/css2?family=${fonts[fontFamily]}&display=swap`;
    document.head.appendChild(fontLink);
  }
  loadFont(settings.font.family);

  // --- CREATE UI ELEMENTS ---

  const overlay = document.createElement("div");
  const controlsBar = document.createElement("div");
  const dateText = document.createElement("div");
  const timeContainer = document.createElement("div");
  const accentLine = document.createElement("div");
  const deltaText = document.createElement("div");
  const resizeHandle = document.createElement("div");

  function setupElements() {
    // Overlay
    overlay.style.position = "fixed";
    overlay.style.top = settings.position.top + "px";
    overlay.style.left = settings.position.left + "px";
    overlay.style.zIndex = "99999";
    overlay.style.backdropFilter = "blur(10px)";
    overlay.style.boxShadow =
      "0 8px 32px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.1) inset";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.gap = "8px";
    overlay.style.pointerEvents = "auto";
    overlay.style.transition = "all 0.3s ease";
    document.body.appendChild(overlay);

    // Controls Bar
    controlsBar.style.position = "absolute";
    controlsBar.style.top = "8px";
    controlsBar.style.right = "8px";
    controlsBar.style.display = "flex";
    controlsBar.style.gap = "6px";
    controlsBar.style.opacity = "0";
    controlsBar.style.transition = "opacity 0.3s ease";
    overlay.appendChild(controlsBar);

    // Date Text
    dateText.style.fontWeight = "600";
    dateText.style.textTransform = "uppercase";
    dateText.style.letterSpacing = "2px";
    dateText.style.marginBottom = "4px";
    overlay.appendChild(dateText);

    // Time Container
    timeContainer.style.display = "flex";
    timeContainer.style.flexDirection = "column";
    timeContainer.style.alignItems = "center";
    timeContainer.style.gap = "4px";
    overlay.appendChild(timeContainer);

    // Accent Line
    accentLine.style.width = "80%";
    accentLine.style.height = "2px";
    accentLine.style.marginTop = "12px";
    overlay.appendChild(accentLine);

    // Delta Text
    deltaText.style.fontWeight = "600";
    deltaText.style.marginTop = "8px";
    overlay.appendChild(deltaText);

    // Resize Handle
    resizeHandle.style.position = "absolute";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "20px";
    resizeHandle.style.height = "20px";
    resizeHandle.style.cursor = "se-resize";
    resizeHandle.style.zIndex = "100000";
    overlay.appendChild(resizeHandle);
  }
  setupElements();

  function applyStyles(s) {
    const theme = themes[s.theme];
    const bgColor = theme.bg.replace(/, 1\)$/, `, ${s.display.opacity})`);

    loadFont(s.font.family);

    overlay.style.width = s.dimensions.width + "px";
    overlay.style.padding = `${s.dimensions.padding}px ${
      s.dimensions.padding * 1.33
    }px`;
    overlay.style.borderRadius = s.dimensions.borderRadius + "px";
    overlay.style.backgroundColor = bgColor;
    overlay.style.color = theme.text;
    overlay.style.fontFamily = `'${s.font.family}', sans-serif`;
    overlay.style.fontSize = s.font.size + "px";
    overlay.style.fontWeight = "700";
    overlay.style.border = "1px solid " + theme.border;
    overlay.style.cursor = s.locked ? "default" : "move";
    resizeHandle.style.display = s.locked ? "none" : "block";

    dateText.style.display = s.display.showDate ? "block" : "none";
    dateText.style.fontSize = s.font.size * 0.39 + "px";
    dateText.style.color = theme.subtext;
    dateText.style.marginBottom = s.display.dateTimeSpacing + "px";

    accentLine.style.display = s.display.showAccent ? "block" : "none";
    accentLine.style.background = `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`;

    deltaText.style.display = s.display.showDelta ? "block" : "none";
    deltaText.style.fontSize = s.font.size * 0.25 + "px";
    deltaText.style.color = theme.subtext;

    if (targetNode) updateText(targetNode.innerText);
  }

  // --- CONTROLS & SETTINGS PANEL ---

  const settingsPanel = document.createElement("div");
  settingsPanel.style.position = "fixed";
  settingsPanel.style.top = "50%";
  settingsPanel.style.left = "50%";
  settingsPanel.style.transform = "translate(-50%, -50%)";
  settingsPanel.style.zIndex = 100000;
  settingsPanel.style.display = "none";
  settingsPanel.style.width = "500px";
  settingsPanel.style.maxHeight = "90vh";
  settingsPanel.style.overflowY = "auto";
  settingsPanel.style.boxShadow = "0 20px 60px rgba(0,0,0,0.9)";
  settingsPanel.style.backdropFilter = "blur(10px)";
  document.body.appendChild(settingsPanel);

  function createSettingRow(label, control) {
    return `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <label style="font-size: 18px; color: ${
                      themes[settings.theme].subtext
                    };">${label}</label>
                    <div style="width: 250px;">${control}</div>
                </div>`;
  }
  function createSlider(id, value, min, max, unit = "") {
    return `<div style="display: flex; align-items: center; gap: 10px;">
                    <input type="range" id="${id}" min="${min}" max="${max}" value="${value}" style="width: 100%;">
                    <span id="${id}Value" style="min-width: 50px; text-align: right;">${value}${unit}</span>
                </div>`;
  }
  function createSelect(id, options) {
    return `<select id="${id}" style="width: 100%; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.1); color: ${
      themes[settings.theme].text
    }; border: 1px solid ${
      themes[settings.theme].border
    }; font-size: 16px;">${options}</select>`;
  }
  function createCheckboxGroup(groupId, options, checkedValues) {
    return `<div id="${groupId}" style="display: flex; justify-content: flex-end; gap: 15px;">${options
      .map(
        (opt) => `
            <label style="font-size: 16px;"><input type="checkbox" value="${opt}" ${
          checkedValues.includes(opt) ? "checked" : ""
        }> ${opt}</label>
        `
      )
      .join("")}</div>`;
  }

  function buildSettingsPanel() {
    const s = tempSettings;
    const theme = themes[s.theme];
    settingsPanel.innerHTML = `
            <div style="background-color: ${theme.bg}; border: 2px solid ${
      theme.border
    }; border-radius: 16px; padding: 30px; color: ${
      theme.text
    }; font-family: '${s.font.family}', sans-serif;">
            <h2 style="margin: 0 0 30px 0; font-size: 32px; font-weight: 700;">Settings</h2>

            <h3 style="font-size: 20px; color: ${
              theme.subtext
            }; margin: 25px 0 15px; border-bottom: 1px solid ${
      theme.border
    }; padding-bottom: 5px;">Appearance</h3>
            ${createSettingRow(
              "Theme",
              createSelect(
                "theme",
                Object.keys(themes)
                  .map(
                    (t) =>
                      `<option value="${t}" ${
                        s.theme === t ? "selected" : ""
                      }>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`
                  )
                  .join("")
              )
            )}
            ${createSettingRow(
              "Font Family",
              createSelect(
                "fontFamily",
                Object.keys(fonts)
                  .map(
                    (f) =>
                      `<option value="${f}" ${
                        s.font.family === f ? "selected" : ""
                      }>${f}</option>`
                  )
                  .join("")
              )
            )}
            ${createSettingRow(
              "Font Size",
              createSlider("fontSize", s.font.size, 24, 120, "px")
            )}
            ${createSettingRow(
              "Opacity",
              createSlider("opacity", s.display.opacity * 100, 50, 100, "%")
            )}

            <h3 style="font-size: 20px; color: ${
              theme.subtext
            }; margin: 25px 0 15px; border-bottom: 1px solid ${
      theme.border
    }; padding-bottom: 5px;">Dimensions</h3>
            ${createSettingRow(
              "Width",
              createSlider("width", s.dimensions.width, 100, 1000, "px")
            )}
            ${createSettingRow(
              "Padding",
              createSlider("padding", s.dimensions.padding, 10, 80, "px")
            )}
            ${createSettingRow(
              "Border Radius",
              createSlider(
                "borderRadius",
                s.dimensions.borderRadius,
                0,
                50,
                "px"
              )
            )}
            ${createSettingRow(
              "Date/Time Spacing",
              createSlider(
                "dateTimeSpacing",
                s.display.dateTimeSpacing,
                0,
                30,
                "px"
              )
            )}

            <h3 style="font-size: 20px; color: ${
              theme.subtext
            }; margin: 25px 0 15px; border-bottom: 1px solid ${
      theme.border
    }; padding-bottom: 5px;">Content</h3>
            ${createSettingRow(
              "Time Format",
              createSelect(
                "timeFormat",
                `<option value="12" ${
                  s.timeFormat === "12" ? "selected" : ""
                }>12 Hour</option><option value="24" ${
                  s.timeFormat === "24" ? "selected" : ""
                }>24 Hour</option>`
              )
            )}
            ${createSettingRow(
              "Timezones",
              createCheckboxGroup(
                "timezones",
                ["ET", "UTC", "Local"],
                s.display.showTimezones
              )
            )}
            ${createSettingRow(
              "Show Elements",
              createCheckboxGroup(
                "showElements",
                ["Date", "Accent", "Delta"],
                [
                  s.display.showDate && "Date",
                  s.display.showAccent && "Accent",
                  s.display.showDelta && "Delta",
                ].filter(Boolean)
              )
            )}

            <div style="display: flex; gap: 12px; margin-top: 30px; border-top: 1px solid ${
              theme.border
            }; padding-top: 20px;">
                <button id="saveSettings" style="flex: 2; padding: 12px; border-radius: 8px; background: ${theme.accent.replace(
                  "0.5",
                  "0.8"
                )}; color: white; border: none; cursor: pointer; font-size: 18px; font-weight: 700;">Save & Reload</button>
                <button id="cancelSettings" style="flex: 1; padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.1); color: ${
                  theme.text
                }; border: 1px solid ${
      theme.border
    }; cursor: pointer;">Cancel</button>
                <button id="resetSettings" style="padding: 12px; border-radius: 8px; background: rgba(220, 38, 38, 0.7); color: white; border: none; cursor: pointer;">Reset</button>
            </div>
            </div>
        `;
    addSettingsListeners();
  }

  function addSettingsListeners() {
    const update = (path, value) => {
      let obj = tempSettings;
      const keys = path.split(".");
      keys.slice(0, -1).forEach((key) => (obj = obj[key]));
      obj[keys[keys.length - 1]] = value;
      applyStyles(tempSettings);
      if (path.includes("theme") || path.includes("font.family"))
        buildSettingsPanel();
    };

    const addSliderListener = (id, path, unit = "") => {
      document.getElementById(id).addEventListener("input", (e) => {
        const value =
          id === "opacity" ? e.target.value / 100 : parseInt(e.target.value);
        document.getElementById(`${id}Value`).innerText = e.target.value + unit;
        update(path, value);
      });
    };
    addSliderListener("fontSize", "font.size", "px");
    addSliderListener("opacity", "display.opacity", "%");
    addSliderListener("width", "dimensions.width", "px");
    addSliderListener("padding", "dimensions.padding", "px");
    addSliderListener("borderRadius", "dimensions.borderRadius", "px");
    addSliderListener("dateTimeSpacing", "display.dateTimeSpacing", "px");

    document
      .getElementById("theme")
      .addEventListener("change", (e) => update("theme", e.target.value));
    document
      .getElementById("fontFamily")
      .addEventListener("change", (e) => update("font.family", e.target.value));
    document
      .getElementById("timeFormat")
      .addEventListener("change", (e) => update("timeFormat", e.target.value));

    document.getElementById("timezones").addEventListener("change", () => {
      const checked = Array.from(
        document.querySelectorAll("#timezones input:checked")
      ).map((cb) => cb.value);
      update("display.showTimezones", checked);
    });

    document.getElementById("showElements").addEventListener("change", () => {
      const checked = Array.from(
        document.querySelectorAll("#showElements input:checked")
      ).map((cb) => cb.value);
      update("display.showDate", checked.includes("Date"));
      update("display.showAccent", checked.includes("Accent"));
      update("display.showDelta", checked.includes("Delta"));
    });

    document.getElementById("saveSettings").addEventListener("click", () => {
      settings = JSON.parse(JSON.stringify(tempSettings));
      saveSettings(settings);
      location.reload();
    });

    document.getElementById("cancelSettings").addEventListener("click", () => {
      applyStyles(settings);
      toggleSettings();
    });

    document.getElementById("resetSettings").addEventListener("click", () => {
      if (
        confirm(
          "Are you sure you want to reset all settings to their defaults?"
        )
      ) {
        localStorage.removeItem("weatherbell_overlay_settings_v2");
        location.reload();
      }
    });
  }

  function toggleSettings() {
    if (settingsPanel.style.display === "none") {
      tempSettings = JSON.parse(JSON.stringify(settings));
      buildSettingsPanel();
      settingsPanel.style.display = "block";
    } else {
      settingsPanel.style.display = "none";
    }
  }

  // --- UI INTERACTIONS ---

  function createButton(icon, title, onClick) {
    const btn = document.createElement("button");
    btn.innerHTML = icon;
    btn.title = title;
    Object.assign(btn.style, {
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "6px",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "16px",
      color: "inherit",
      transition: "all 0.2s",
    });
    btn.addEventListener(
      "mouseenter",
      () => (btn.style.background = "rgba(255,255,255,0.2)")
    );
    btn.addEventListener(
      "mouseleave",
      () => (btn.style.background = "rgba(255,255,255,0.1)")
    );
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  const settingsBtn = createButton(
    "⚙️",
    "Settings (Ctrl+Shift+S)",
    toggleSettings
  );
  const minimizeBtn = createButton("−", "Minimize", toggleMinimize);
  const lockBtn = createButton(
    isLocked ? "🔒" : "🔓",
    "Lock/Unlock Position",
    toggleLock
  );
  controlsBar.append(lockBtn, minimizeBtn, settingsBtn);

  function toggleMinimize() {
    isMinimized = !isMinimized;
    const elementsToHide = [timeContainer, dateText, accentLine, deltaText];
    if (isMinimized) {
      elementsToHide.forEach((el) => (el.style.display = "none"));
      overlay.style.width = "auto";
      overlay.style.minWidth = "200px";
      overlay.style.padding = "15px 20px";
      minimizeBtn.innerHTML = "□";
      minimizeBtn.title = "Expand";
    } else {
      applyStyles(settings); // Restore styles
      overlay.style.minWidth = "";
      minimizeBtn.innerHTML = "−";
      minimizeBtn.title = "Minimize";
    }
  }

  function toggleLock() {
    isLocked = !isLocked;
    settings.locked = isLocked;
    saveSettings(settings);
    overlay.style.cursor = isLocked ? "default" : "move";
    resizeHandle.style.display = isLocked ? "none" : "block";
    lockBtn.innerHTML = isLocked ? "🔒" : "🔓";
    lockBtn.title = isLocked ? "Unlock Position" : "Lock Position";
  }

  // --- TIME PARSING AND DISPLAY LOGIC ---

  function formatTime(timeStr) {
    try {
      const dt = new Date(timeStr);
      if (isNaN(dt)) return null;

      if (!modelInitTime) modelInitTime = dt;

      const dateOptions = { weekday: "long", timeZone: "America/New_York" };
      const dayName = dt.toLocaleString("en-US", dateOptions);

      const results = { date: dayName, times: [] };

      settings.display.showTimezones.forEach((tz) => {
        let label, timezone;
        if (tz === "ET") {
          timezone = "America/New_York";
          label = "ET";
        } else if (tz === "UTC") {
          timezone = "UTC";
          label = "UTC";
        } else if (tz === "Local") {
          timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          label = "Local";
        }

        const timeOptions = { minute: "2-digit", timeZone: timezone };
        timeOptions.hour = settings.timeFormat === "12" ? "numeric" : "2-digit";
        timeOptions.hour12 = settings.timeFormat === "12";

        const timeFormatted = dt
          .toLocaleString("en-US", timeOptions)
          .replace(" ", "");
        results.times.push({ label, time: timeFormatted });
      });

      if (modelInitTime) {
        const delta = Math.floor(
          (Date.now() - modelInitTime.getTime()) / 1000 / 60
        );
        if (delta >= 0) {
          const hours = Math.floor(delta / 60);
          const minutes = delta % 60;
          results.delta =
            hours > 0
              ? `${hours}h ${minutes}m since model run`
              : `${minutes}m since model run`;
        }
      }
      return results;
    } catch (e) {
      return null;
    }
  }

  function updateText(text) {
    const formatted = formatTime(text);
    if (!formatted || isMinimized) return;

    dateText.innerText = formatted.date;
    timeContainer.innerHTML = "";
    const theme = themes[settings.theme];

    formatted.times.forEach((tz) => {
      const tzDiv = document.createElement("div");
      Object.assign(tzDiv.style, {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        title: "Click to copy",
      });

      const timeSpan = document.createElement("span");
      timeSpan.style.color = theme.text;
      timeSpan.style.lineHeight = "1";
      timeSpan.innerText = tz.time;

      const labelSpan = document.createElement("span");
      labelSpan.style.fontSize = settings.font.size * 0.39 + "px";
      labelSpan.style.color = theme.subtext;
      labelSpan.style.fontWeight = "600";
      labelSpan.innerText = tz.label;

      tzDiv.append(timeSpan, labelSpan);
      tzDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard
          .writeText(`${formatted.date} ${tz.time} ${tz.label}`)
          .then(() => {
            tzDiv.style.opacity = "0.5";
            setTimeout(() => {
              tzDiv.style.opacity = "1";
            }, 200);
          });
      });
      timeContainer.appendChild(tzDiv);
    });

    if (formatted.delta && modelInitTime) {
      deltaText.innerText = formatted.delta;
    }
  }

  function initObserver() {
    const el = document.querySelector(".wba-meta-time-text");
    if (el && el !== targetNode) {
      targetNode = el;
      updateText(targetNode.innerText);
      if (observer) observer.disconnect();
      observer = new MutationObserver(() => updateText(targetNode.innerText));
      observer.observe(targetNode, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  // --- DRAG & RESIZE HANDLERS ---
  function setupInteractions() {
    let offsetX,
      offsetY,
      isDragging = false,
      isResizing = false,
      originalWidth,
      originalHeight,
      originalMouseX,
      originalMouseY;

    const startDrag = (e) => {
      if (isLocked || e.target.tagName === "BUTTON" || isResizing) return;
      isDragging = true;
      offsetX = e.clientX - overlay.offsetLeft;
      offsetY = e.clientY - overlay.offsetTop;
      overlay.style.transition = "none";
    };

    const startResize = (e) => {
      if (isLocked) return;
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      originalWidth = overlay.offsetWidth;
      originalMouseX = e.clientX;
      overlay.style.transition = "none";
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        overlay.style.left = e.clientX - offsetX + "px";
        overlay.style.top = e.clientY - offsetY + "px";
      }
      if (isResizing) {
        const newWidth = originalWidth + (e.clientX - originalMouseX);
        if (newWidth > 300) {
          // min width
          settings.dimensions.width = newWidth;
          applyStyles(settings);
        }
      }
    };

    const onMouseUp = () => {
      if (isDragging || isResizing) {
        overlay.style.transition = "all 0.3s ease";
        if (isDragging)
          settings.position = {
            top: parseInt(overlay.style.top),
            left: parseInt(overlay.style.left),
          };
        saveSettings(settings);
      }
      isDragging = false;
      isResizing = false;
    };

    overlay.addEventListener("mousedown", startDrag);
    resizeHandle.addEventListener("mousedown", startResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    overlay.addEventListener("mouseenter", () => {
      controlsBar.style.opacity = "1";
      if (!isDragging && !isLocked && !isResizing) {
        overlay.style.transform = "scale(1.02)";
        overlay.style.boxShadow =
          "0 12px 40px rgba(0,0,0,0.9), 0 0 1px rgba(255,255,255,0.15) inset";
      }
    });

    overlay.addEventListener("mouseleave", () => {
      controlsBar.style.opacity = "0";
      overlay.style.transform = "scale(1)";
      overlay.style.boxShadow =
        "0 8px 32px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.1) inset";
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        overlay.style.display =
          overlay.style.display === "none" ? "flex" : "none";
      }
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        toggleSettings();
      }
    });
  }

  // --- INITIALIZATION ---
  applyStyles(settings);
  setupInteractions();
  setInterval(initObserver, 1000);
  setInterval(() => {
    if (targetNode) updateText(targetNode.innerText);
  }, 60000);
})();
