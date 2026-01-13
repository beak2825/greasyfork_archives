// ==UserScript==
// @name         COD Forecast Overlay (Ultimate)
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  A professional, highly customizable overlay for weather.cod.edu. Calculates Valid Time from Init + Forecast Hour.
// @match        https://weather.cod.edu/forecast/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562459/COD%20Forecast%20Overlay%20%28Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562459/COD%20Forecast%20Overlay%20%28Ultimate%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- STATE & CONFIGURATION ---
  let runNode = null;
  let sliderNode = null;
  let observer = null;
  let isMinimized = false;
  let isLocked = false;
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
      showTimezones: ["ET", "Local"], // Checkbox controlled
      dateTimeSpacing: 4,
    },
    timeFormat: "12",
    locked: false,
  };

  const themes = {
    dark: { bg: "rgba(20, 20, 25, 1)", text: "#ffffff", subtext: "#9ca3af", accent: "rgba(96, 165, 250, 0.5)", border: "rgba(255,255,255,0.08)" },
    light: { bg: "rgba(255, 255, 255, 1)", text: "#1f2937", subtext: "#6b7280", accent: "rgba(59, 130, 246, 0.5)", border: "rgba(0,0,0,0.08)" },
    minimal: { bg: "rgba(0, 0, 0, 1)", text: "#ffffff", subtext: "#ffffff", accent: "rgba(255, 255, 255, 0.3)", border: "rgba(255,255,255,0.15)" },
    contrast: { bg: "rgba(0, 0, 0, 1)", text: "#00ff00", subtext: "#ffff00", accent: "rgba(0, 255, 0, 0.5)", border: "rgba(0,255,0,0.3)" },
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
      const saved = localStorage.getItem("cod_overlay_settings_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultSettings,
          ...parsed,
          dimensions: { ...defaultSettings.dimensions, ...parsed.dimensions },
          font: { ...defaultSettings.font, ...parsed.font },
          display: { ...defaultSettings.display, ...parsed.display },
        };
      }
    } catch (e) { console.error("Settings load failed", e); }
    return defaultSettings;
  }

  function saveSettings(s) { localStorage.setItem("cod_overlay_settings_v3", JSON.stringify(s)); }

  let settings = loadSettings();
  isLocked = settings.locked;

  function loadFont(fontFamily) {
    const fontId = `font-${fontFamily.replace(/\s+/g, "-")}`;
    if (document.getElementById(fontId) || !fonts[fontFamily]) return;
    const fontLink = document.createElement("link");
    fontLink.id = fontId; fontLink.rel = "stylesheet";
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
    overlay.style.position = "fixed";
    overlay.style.top = settings.position.top + "px";
    overlay.style.left = settings.position.left + "px";
    overlay.style.zIndex = "99999";
    overlay.style.backdropFilter = "blur(10px)";
    overlay.style.boxShadow = "0 8px 32px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.1) inset";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.gap = "8px";
    overlay.style.pointerEvents = "auto";
    overlay.style.transition = "all 0.3s ease, transform 0.2s ease";
    document.body.appendChild(overlay);

    controlsBar.style.position = "absolute";
    controlsBar.style.top = "8px";
    controlsBar.style.right = "8px";
    controlsBar.style.display = "flex";
    controlsBar.style.gap = "6px";
    controlsBar.style.opacity = "0";
    controlsBar.style.transition = "opacity 0.3s ease";
    overlay.appendChild(controlsBar);

    dateText.style.fontWeight = "600";
    dateText.style.textTransform = "uppercase";
    dateText.style.letterSpacing = "2px";
    overlay.appendChild(dateText);

    timeContainer.style.display = "flex";
    timeContainer.style.flexDirection = "column";
    timeContainer.style.alignItems = "center";
    overlay.appendChild(timeContainer);

    accentLine.style.width = "80%";
    accentLine.style.height = "2px";
    overlay.appendChild(accentLine);

    deltaText.style.fontWeight = "600";
    overlay.appendChild(deltaText);

    resizeHandle.style.position = "absolute";
    resizeHandle.style.bottom = "0";
    resizeHandle.style.right = "0";
    resizeHandle.style.width = "20px";
    resizeHandle.style.height = "20px";
    resizeHandle.style.cursor = "se-resize";
    overlay.appendChild(resizeHandle);
  }
  setupElements();

  function applyStyles(s) {
    const theme = themes[s.theme];
    const bgColor = theme.bg.replace(/, 1\)$/, `, ${s.display.opacity})`);
    loadFont(s.font.family);

    overlay.style.width = s.dimensions.width + "px";
    overlay.style.padding = `${s.dimensions.padding}px ${s.dimensions.padding * 1.33}px`;
    overlay.style.borderRadius = s.dimensions.borderRadius + "px";
    overlay.style.backgroundColor = bgColor;
    overlay.style.color = theme.text;
    overlay.style.fontFamily = `'${s.font.family}', sans-serif`;
    overlay.style.fontSize = s.font.size + "px";
    overlay.style.border = "1px solid " + theme.border;
    overlay.style.cursor = s.locked ? "default" : "move";

    dateText.style.display = s.display.showDate ? "block" : "none";
    dateText.style.fontSize = s.font.size * 0.39 + "px";
    dateText.style.color = theme.subtext;
    dateText.style.marginBottom = s.display.dateTimeSpacing + "px";

    accentLine.style.display = s.display.showAccent ? "block" : "none";
    accentLine.style.marginTop = s.display.dateTimeSpacing * 3 + "px";
    accentLine.style.background = `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`;

    deltaText.style.display = s.display.showDelta ? "block" : "none";
    deltaText.style.fontSize = s.font.size * 0.25 + "px";
    deltaText.style.color = theme.subtext;
    deltaText.style.marginTop = s.display.dateTimeSpacing * 2 + "px";

    updateText();
  }

  // --- SETTINGS PANEL ---
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
  settingsPanel.style.backdropFilter = "blur(15px)";
  document.body.appendChild(settingsPanel);

  function createSettingRow(label, control) {
    return `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <label style="font-size: 16px; opacity: 0.8;">${label}</label>
                <div style="width: 240px;">${control}</div>
            </div>`;
  }

  function buildSettingsPanel() {
    const s = tempSettings;
    const theme = themes[s.theme];
    settingsPanel.innerHTML = `
      <div style="background-color: ${theme.bg}; border: 2px solid ${theme.border}; border-radius: 16px; padding: 30px; color: ${theme.text}; font-family: sans-serif;">
        <h2 style="margin: 0 0 25px 0; font-size: 28px;">Overlay Settings</h2>
        
        <h3 style="font-size: 14px; text-transform: uppercase; color: ${theme.subtext}; margin-bottom: 15px; border-bottom: 1px solid ${theme.border}; padding-bottom: 5px;">Appearance</h3>
        ${createSettingRow("Theme", `<select id="setTheme" style="width:100%; padding:8px; border-radius:8px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid ${theme.border};">${Object.keys(themes).map(t=>`<option value="${t}" ${s.theme===t?'selected':''}>${t.toUpperCase()}</option>`).join('')}</select>`)}
        ${createSettingRow("Font", `<select id="setFont" style="width:100%; padding:8px; border-radius:8px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid ${theme.border};">${Object.keys(fonts).map(f=>`<option value="${f}" ${s.font.family===f?'selected':''}>${f}</option>`).join('')}</select>`)}
        ${createSettingRow("Font Size", `<input type="range" id="setFontSize" min="20" max="150" value="${s.font.size}" style="width:100%">`)}
        ${createSettingRow("Opacity", `<input type="range" id="setOpacity" min="30" max="100" value="${s.display.opacity*100}" style="width:100%">`)}

        <h3 style="font-size: 14px; text-transform: uppercase; color: ${theme.subtext}; margin: 25px 0 15px; border-bottom: 1px solid ${theme.border}; padding-bottom: 5px;">Content</h3>
        ${createSettingRow("Time Format", `<select id="setFormat" style="width:100%; padding:8px; border-radius:8px; background:rgba(255,255,255,0.1); color:inherit; border:1px solid ${theme.border};"><option value="12" ${s.timeFormat==='12'?'selected':''}>12-Hour</option><option value="24" ${s.timeFormat==='24'?'selected':''}>24-Hour</option></select>`)}
        ${createSettingRow("Show Timezones", `<div id="setTimezones" style="display:flex; gap:10px; justify-content:flex-end;">${['ET', 'UTC', 'Local'].map(tz=>`<label><input type="checkbox" value="${tz}" ${s.display.showTimezones.includes(tz)?'checked':''}> ${tz}</label>`).join('')}</div>`)}
        ${createSettingRow("Elements", `<div id="setElements" style="display:flex; gap:10px; justify-content:flex-end;">
            <label><input type="checkbox" id="showDate" ${s.display.showDate?'checked':''}> Date</label>
            <label><input type="checkbox" id="showAccent" ${s.display.showAccent?'checked':''}> Accent</label>
            <label><input type="checkbox" id="showDelta" ${s.display.showDelta?'checked':''}> Delta</label>
        </div>`)}

        <div style="margin-top: 30px; display: flex; gap: 12px; border-top: 1px solid ${theme.border}; padding-top: 20px;">
          <button id="saveSet" style="flex: 2; padding: 12px; border-radius: 8px; background: ${theme.accent.replace("0.5", "1")}; color: white; border: none; cursor: pointer; font-weight: bold;">Save & Reload</button>
          <button id="cancelSet" style="flex: 1; padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.1); color: inherit; border: 1px solid ${theme.border}; cursor: pointer;">Cancel</button>
        </div>
      </div>`;
    
    // Listeners
    document.getElementById('setTheme').onchange = (e) => { tempSettings.theme = e.target.value; applyStyles(tempSettings); buildSettingsPanel(); };
    document.getElementById('setFont').onchange = (e) => { tempSettings.font.family = e.target.value; applyStyles(tempSettings); buildSettingsPanel(); };
    document.getElementById('setFontSize').oninput = (e) => { tempSettings.font.size = parseInt(e.target.value); applyStyles(tempSettings); };
    document.getElementById('setOpacity').oninput = (e) => { tempSettings.display.opacity = e.target.value / 100; applyStyles(tempSettings); };
    document.getElementById('setFormat').onchange = (e) => { tempSettings.timeFormat = e.target.value; applyStyles(tempSettings); };
    
    document.getElementById('setTimezones').onchange = () => {
        const checked = Array.from(document.querySelectorAll('#setTimezones input:checked')).map(i => i.value);
        tempSettings.display.showTimezones = checked;
        applyStyles(tempSettings);
    };

    const toggleEl = (id, prop) => { document.getElementById(id).onclick = (e) => { tempSettings.display[prop] = e.target.checked; applyStyles(tempSettings); }};
    toggleEl('showDate', 'showDate');
    toggleEl('showAccent', 'showAccent');
    toggleEl('showDelta', 'showDelta');

    document.getElementById('saveSet').onclick = () => { settings = JSON.parse(JSON.stringify(tempSettings)); saveSettings(settings); location.reload(); };
    document.getElementById('cancelSet').onclick = () => { applyStyles(settings); toggleSettings(); };
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

  // --- DATA PARSING ---

  function getCalculatedValidTime() {
    try {
      const runEl = document.getElementById('currun');
      const sliderEl = document.getElementById('slider');
      if (!runEl || !sliderEl) return null;

      // Parse Init (Format: "01/12/26 18Z 100%")
      const runText = runEl.innerText.trim();
      const parts = runText.split(/\s+/);
      const dateParts = parts[0].split('/'); 
      const initHour = parseInt(parts[1]); 
      
      const year = 2000 + parseInt(dateParts[2]);
      const month = parseInt(dateParts[0]) - 1;
      const day = parseInt(dateParts[1]);
      const initDateUTC = new Date(Date.UTC(year, month, day, initHour));

      // Parse Slider Offset (Format: "048")
      const offsetHours = parseInt(sliderEl.innerText);
      
      const validDate = new Date(initDateUTC.getTime() + (offsetHours * 3600000));
      return { validDate, initDateUTC };
    } catch (e) { return null; }
  }

  function updateText() {
    const data = getCalculatedValidTime();
    if (!data || isMinimized) return;

    const { validDate, initDateUTC } = data;
    const theme = themes[settings.theme];

    // Date
    dateText.innerText = validDate.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" }) + " (Valid)";

    // Timezones
    timeContainer.innerHTML = "";
    settings.display.showTimezones.forEach(tz => {
        let label, zone;
        if (tz === "ET") { label = "ET"; zone = "America/New_York"; }
        else if (tz === "UTC") { label = "UTC"; zone = "UTC"; }
        else { label = "Local"; zone = Intl.DateTimeFormat().resolvedOptions().timeZone; }

        const timeStr = validDate.toLocaleString("en-US", {
            hour: settings.timeFormat === "12" ? "numeric" : "2-digit",
            minute: "2-digit",
            hour12: settings.timeFormat === "12",
            timeZone: zone
        }).replace(" ", "");

        const div = document.createElement("div");
        div.style.display = "flex"; div.style.alignItems = "center"; div.style.gap = "12px"; div.style.cursor = "pointer";
        
        const tSpan = document.createElement("span");
        tSpan.innerText = timeStr; tSpan.style.color = theme.text;
        
        const lSpan = document.createElement("span");
        lSpan.innerText = label; lSpan.style.fontSize = settings.font.size * 0.39 + "px"; lSpan.style.color = theme.subtext; lSpan.style.fontWeight = "600";
        
        div.append(tSpan, lSpan);
        div.onclick = () => {
            navigator.clipboard.writeText(`${validDate.toDateString()} ${timeStr} ${label}`);
            div.style.opacity = "0.5"; setTimeout(() => div.style.opacity = "1", 200);
        };
        timeContainer.appendChild(div);
    });

    // Delta
    const deltaMin = Math.floor((Date.now() - initDateUTC.getTime()) / 60000);
    if (deltaMin >= 0) {
        const h = Math.floor(deltaMin / 60);
        const m = deltaMin % 60;
        deltaText.innerText = `${h}h ${m}m since model run`;
    }
  }

  // --- INTERACTIONS ---
  function createBtn(icon, title, click) {
    const b = document.createElement("button");
    b.innerHTML = icon; b.title = title;
    Object.assign(b.style, { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", width: "32px", height: "32px", cursor: "pointer", color: "inherit", display: "flex", alignItems: "center", justifyContent: "center" });
    b.onclick = (e) => { e.stopPropagation(); click(); };
    return b;
  }

  const lockBtn = createBtn(isLocked ? "🔒" : "🔓", "Lock", () => { isLocked = !isLocked; settings.locked = isLocked; saveSettings(settings); applyStyles(settings); lockBtn.innerHTML = isLocked ? "🔒" : "🔓"; });
  const minBtn = createBtn("−", "Minimize", () => {
      isMinimized = !isMinimized;
      if (isMinimized) {
          [timeContainer, dateText, accentLine, deltaText].forEach(el => el.style.display = "none");
          overlay.style.width = "auto"; overlay.style.minWidth = "180px"; overlay.style.padding = "15px";
      } else { applyStyles(settings); overlay.style.minWidth = ""; }
  });
  const setBtn = createBtn("⚙️", "Settings", toggleSettings);
  controlsBar.append(lockBtn, minBtn, setBtn);

  // Dragging & Hover
  let isDragging = false, dragOffset = [0,0];
  overlay.onmousedown = (e) => {
    if (isLocked || e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    isDragging = true;
    dragOffset = [overlay.offsetLeft - e.clientX, overlay.offsetTop - e.clientY];
    overlay.style.transition = "none";
  };
  window.onmousemove = (e) => {
    if (isDragging) {
      overlay.style.left = (e.clientX + dragOffset[0]) + "px";
      overlay.style.top = (e.clientY + dragOffset[1]) + "px";
    }
  };
  window.onmouseup = () => {
    if (isDragging) {
      isDragging = false;
      overlay.style.transition = "all 0.3s ease, transform 0.2s ease";
      settings.position = { top: parseInt(overlay.style.top), left: parseInt(overlay.style.left) };
      saveSettings(settings);
    }
  };

  overlay.onmouseenter = () => { controlsBar.style.opacity = "1"; if(!isLocked) overlay.style.transform = "scale(1.02)"; };
  overlay.onmouseleave = () => { controlsBar.style.opacity = "0"; overlay.style.transform = "scale(1)"; };

  // --- INITIALIZATION ---
  function initObserver() {
    const rNode = document.getElementById('currun');
    const sNode = document.getElementById('slider');
    if (rNode && sNode && (rNode !== runNode || sNode !== sliderNode)) {
      runNode = rNode; sliderNode = sNode;
      if (observer) observer.disconnect();
      observer = new MutationObserver(updateText);
      observer.observe(runNode, { characterData: true, childList: true, subtree: true });
      observer.observe(sliderNode, { characterData: true, childList: true, subtree: true });
      updateText();
    }
  }

  applyStyles(settings);
  setInterval(initObserver, 1000);
  setInterval(updateText, 30000); // Periodic refresh for delta time

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "S") { e.preventDefault(); toggleSettings(); }
  });
})();