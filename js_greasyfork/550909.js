// ==UserScript==
// @name         DeepFlood & NodeSeek 主题皮肤切换器
// @namespace    https://nodeseek-userscripts.local
// @version      0.1.3
// @author       https://www.nodeseek.com/space/38137
// @description  为 DeepFlood 和 NodeSeek 论坛添加主题颜色切换器，支持自定义颜色和预设颜色，所选颜色会被记住并应用于当前域名
// @match        *://*.nodeseek.com/*
// @match        *://*.deepflood.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550909/DeepFlood%20%20NodeSeek%20%E4%B8%BB%E9%A2%98%E7%9A%AE%E8%82%A4%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550909/DeepFlood%20%20NodeSeek%20%E4%B8%BB%E9%A2%98%E7%9A%AE%E8%82%A4%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const storageKey = "dfThemeColor:" + location.host;
  const originalMetaTheme = getMetaThemeColor();
  const defaultColor = detectDefaultColor() || "#3d6c45";
  let currentColor = loadStoredColor();
  let themeStyleTag = null;
  let activePanel = null;
  let activeButton = null;
  let globalListenersBound = false;
  let observerInitialized = false;

  if (currentColor) {
    applyThemeColor(currentColor, true);
  }

  ready(function () {
    injectUiStyles();
    setupObserver();
    const switcher = document.querySelector(".color-theme-switcher");
    if (switcher) {
      setupColorPicker(switcher);
    } else {
      waitForElement(".color-theme-switcher", 15000)
        .then(function (el) {
          setupColorPicker(el);
        })
        .catch(function () {
          // element not found
        });
    }
  });

  function setupObserver() {
    if (observerInitialized) {
      return;
    }
    const observer = new MutationObserver(function () {
      if (!document.querySelector(".tm-theme-color-wrapper")) {
        const switcher = document.querySelector(".color-theme-switcher");
        if (switcher) {
          setupColorPicker(switcher);
        }
      }
    });
    const attachObserver = function () {
      if (observerInitialized || !document.body) {
        return;
      }
      observer.observe(document.body, { childList: true, subtree: true });
      observerInitialized = true;
    };
    if (document.body) {
      attachObserver();
    } else {
      const domReadyHandler = function () {
        document.removeEventListener("DOMContentLoaded", domReadyHandler);
        attachObserver();
      };
      document.addEventListener("DOMContentLoaded", domReadyHandler);
    }
  }

  function setupColorPicker(themeSwitcher) {
    if (!themeSwitcher) {
      return;
    }
    const parent = themeSwitcher.parentElement;
    if (!parent) {
      return;
    }
    if (parent.querySelector(".tm-theme-color-wrapper")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "tm-theme-color-wrapper";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "tm-theme-color-button";
    toggleButton.setAttribute("aria-haspopup", "true");
    toggleButton.setAttribute("aria-expanded", "false");
    toggleButton.setAttribute("title", "Customize theme color");
    toggleButton.innerHTML =
      '<span class="tm-theme-color-preview"></span><span class="tm-theme-color-label">Color</span>';

    const preview = toggleButton.querySelector(".tm-theme-color-preview");

    const panel = document.createElement("div");
    panel.className = "tm-theme-color-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Theme color picker");

    const heading = document.createElement("div");
    heading.className = "tm-theme-color-heading";
    heading.textContent = "Theme color";
    panel.appendChild(heading);

    const colorRow = document.createElement("div");
    colorRow.className = "tm-theme-color-row";

    const colorLabel = document.createElement("label");
    colorLabel.className = "tm-theme-color-input-label";
    colorLabel.textContent = "Custom color";
    colorRow.appendChild(colorLabel);

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "tm-theme-color-input";
    colorRow.appendChild(colorInput);

    panel.appendChild(colorRow);

    const colorValue = document.createElement("div");
    colorValue.className = "tm-theme-color-value";
    panel.appendChild(colorValue);

    const presetTitle = document.createElement("div");
    presetTitle.className = "tm-theme-color-subtitle";
    presetTitle.textContent = "Presets";
    panel.appendChild(presetTitle);

    const presetWrapper = document.createElement("div");
    presetWrapper.className = "tm-theme-color-presets";
    panel.appendChild(presetWrapper);

    const presets = [
      "#3d6c45",
      "#1e6fff",
      "#ff6b00",
      "#00aa5b",
      "#c37ff1",
      "#ffab00",
      "#ff3366",
      "#2b908f",
    ];
    for (var i = 0; i < presets.length; i += 1) {
      var presetColor = presets[i];
      var presetButton = document.createElement("button");
      presetButton.type = "button";
      presetButton.className = "tm-theme-color-preset";
      presetButton.dataset.color = presetColor;
      presetButton.style.backgroundColor = presetColor;
      presetButton.title = "Use " + presetColor;
      presetButton.addEventListener("click", function (event) {
        var selected = event.currentTarget.dataset.color;
        selectColor(selected, true);
        closePanel();
      });
      presetWrapper.appendChild(presetButton);
    }

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "tm-theme-color-reset";
    resetButton.textContent = "Reset to default";
    resetButton.addEventListener("click", function () {
      resetTheme();
      closePanel();
    });
    panel.appendChild(resetButton);

    const note = document.createElement("div");
    note.className = "tm-theme-color-note";
    note.textContent = "Picked colors are remembered per domain.";
    panel.appendChild(note);

    wrapper.appendChild(toggleButton);
    wrapper.appendChild(panel);

    var baseColor =
      normalizeColor(currentColor) || normalizeColor(defaultColor) || "#3d6c45";
    updateButtonPreview(baseColor, preview, toggleButton);
    colorInput.value = baseColor;
    updateDisplayedColor(baseColor);

    colorInput.addEventListener("input", function (event) {
      var value = normalizeColor(event.target.value);
      if (!value) {
        return;
      }
      selectColor(value, false);
    });

    colorInput.addEventListener("change", function (event) {
      var value = normalizeColor(event.target.value);
      if (!value) {
        return;
      }
      selectColor(value, true);
    });

    toggleButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (panel.classList.contains("open")) {
        closePanel();
      } else {
        openPanel();
      }
    });

    panel.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    parent.insertBefore(wrapper, themeSwitcher.nextSibling);

    if (!globalListenersBound) {
      document.addEventListener("click", onDocumentClick, true);
      document.addEventListener("keydown", onDocumentKeydown, true);
      globalListenersBound = true;
    }

    function openPanel() {
      if (activePanel && activePanel !== panel) {
        closeActivePanel();
      }
      panel.classList.add("open");
      toggleButton.setAttribute("aria-expanded", "true");
      activePanel = panel;
      activeButton = toggleButton;
    }

    function closePanel() {
      if (activePanel === panel) {
        closeActivePanel();
      } else {
        panel.classList.remove("open");
        toggleButton.setAttribute("aria-expanded", "false");
      }
    }

    function selectColor(value, persist) {
      var normalized = normalizeColor(value);
      if (!normalized) {
        return;
      }
      currentColor = normalized;
      applyThemeColor(normalized);
      updateButtonPreview(normalized, preview, toggleButton);
      updateDisplayedColor(normalized);
      colorInput.value = normalized;
      if (persist) {
        saveColor(normalized);
      }
    }

    function resetTheme() {
      clearStoredColor();
      currentColor = null;
      removeThemeStyle();
      restoreMetaThemeColor();
      var restored = normalizeColor(defaultColor) || "#3d6c45";
      updateButtonPreview(restored, preview, toggleButton);
      updateDisplayedColor(restored);
      colorInput.value = restored;
    }

    function updateDisplayedColor(value) {
      var normalized = normalizeColor(value);
      colorValue.textContent = normalized || "";
    }
  }

  function onDocumentClick(event) {
    if (!activePanel) {
      return;
    }
    if (activePanel.contains(event.target)) {
      return;
    }
    if (activeButton && activeButton.contains(event.target)) {
      return;
    }
    closeActivePanel();
  }

  function onDocumentKeydown(event) {
    if ((event.key === "Escape" || event.key === "Esc") && activePanel) {
      closeActivePanel();
    }
  }

  function closeActivePanel() {
    if (!activePanel) {
      return;
    }
    activePanel.classList.remove("open");
    if (activeButton) {
      activeButton.setAttribute("aria-expanded", "false");
    }
    activePanel = null;
    activeButton = null;
  }

  function updateButtonPreview(color, previewElement, buttonElement) {
    var normalized = normalizeColor(color);
    if (!normalized) {
      return;
    }
    if (previewElement) {
      previewElement.style.backgroundColor = normalized;
      previewElement.setAttribute("data-color", normalized);
    }
    if (buttonElement) {
      buttonElement.style.setProperty("--tm-theme-selected-color", normalized);
    }
  }

  function injectUiStyles() {
    if (document.getElementById("tm-theme-color-ui-style")) {
      return;
    }
    var style = document.createElement("style");
    style.id = "tm-theme-color-ui-style";
    style.textContent = [
      ".tm-theme-color-wrapper{position:relative;display:inline-flex;align-items:center;margin-left:8px;}",
      ".tm-theme-color-button{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid rgba(0,0,0,0.15);background:var(--bg-sub-color,#f7f7f7);color:var(--text-color,#333);font-size:12px;line-height:1;cursor:pointer;transition:background-color 0.2s ease,border-color 0.2s ease,box-shadow 0.2s ease;}",
      ".tm-theme-color-button:hover,.tm-theme-color-button:focus{border-color:var(--tm-theme-selected-color,#3d6c45);box-shadow:0 0 0 3px rgba(0,0,0,0.05);outline:none;}",
      '.tm-theme-color-button[aria-expanded="true"]{border-color:var(--tm-theme-selected-color,#3d6c45);}',
      ".tm-theme-color-preview{width:14px;height:14px;border-radius:50%;border:2px solid rgba(0,0,0,0.1);background:var(--tm-theme-selected-color,#3d6c45);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.6);}",
      ".tm-theme-color-label{font-weight:600;letter-spacing:0.02em;}",
      ".tm-theme-color-panel{position:absolute;top:calc(100% + 6px);right:0;min-width:220px;background:var(--bg-main-color,#fff);border:1px solid rgba(0,0,0,0.12);border-radius:10px;padding:12px;box-shadow:0 12px 30px rgba(17,20,39,0.18);display:none;z-index:2500;}",
      ".tm-theme-color-panel.open{display:block;}",
      ".tm-theme-color-heading{font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-color,#333);}",
      ".tm-theme-color-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}",
      ".tm-theme-color-input-label{font-size:12px;color:var(--fade-color,#666);}",
      ".tm-theme-color-input{flex:0 0 100px;height:32px;border:1px solid rgba(0,0,0,0.2);border-radius:6px;background:var(--bg-sub-color,#f7f7f7);cursor:pointer;}",
      ".tm-theme-color-input::-moz-color-swatch,.tm-theme-color-input::-webkit-color-swatch{border:none;border-radius:4px;}",
      ".tm-theme-color-value{margin-top:6px;font-family:monospace;font-size:12px;letter-spacing:0.04em;color:var(--fade-color,#666);}",
      ".tm-theme-color-subtitle{margin-top:12px;font-size:12px;font-weight:600;color:var(--text-color,#333);}",
      ".tm-theme-color-presets{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;}",
      ".tm-theme-color-preset{width:28px;height:28px;border-radius:6px;border:1px solid rgba(0,0,0,0.15);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease;}",
      ".tm-theme-color-preset:hover,.tm-theme-color-preset:focus{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.2);outline:none;}",
      ".tm-theme-color-reset{width:100%;margin-top:12px;padding:6px 10px;border-radius:6px;border:1px solid rgba(0,0,0,0.16);background:transparent;color:var(--text-color,#333);font-size:12px;cursor:pointer;transition:background-color 0.2s ease,border-color 0.2s ease;}",
      ".tm-theme-color-reset:hover{background:rgba(0,0,0,0.04);}",
      ".tm-theme-color-note{margin-top:10px;font-size:11px;line-height:1.4;color:var(--fade-color,#666);}",
      "@media (max-width:680px){.tm-theme-color-panel{right:auto;left:0;}}",
    ].join("");
    document.head.appendChild(style);
  }

  function ready(callback) {
    if (document.readyState === "loading") {
      const handler = function () {
        document.removeEventListener("DOMContentLoaded", handler);
        callback();
      };
      document.addEventListener("DOMContentLoaded", handler);
    } else {
      callback();
    }
  }

  function waitForElement(selector, timeout) {
    return new Promise(function (resolve, reject) {
      const existing = document.querySelector(selector);
      if (existing) {
        resolve(existing);
        return;
      }
      const observer = new MutationObserver(function () {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      if (timeout) {
        setTimeout(function () {
          observer.disconnect();
          reject(new Error("Element not found: " + selector));
        }, timeout);
      }
    });
  }

  function detectDefaultColor() {
    const meta = normalizeColor(getMetaThemeColor());
    if (meta) {
      return meta;
    }
    try {
      const computed = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--main-color");
      const normalized = normalizeColor(computed);
      if (normalized) {
        return normalized;
      }
    } catch (error) {
      // ignore
    }
    return "#3d6c45";
  }

  function getMetaThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      return null;
    }
    return meta.getAttribute("content");
  }

  function loadStoredColor() {
    let value = null;
    try {
      if (typeof GM_getValue === "function") {
        value = GM_getValue(storageKey, null);
      } else {
        value = window.localStorage.getItem(storageKey);
      }
    } catch (error) {
      value = null;
    }
    return normalizeColor(value);
  }

  function saveColor(color) {
    if (!color) {
      return;
    }
    try {
      if (typeof GM_setValue === "function") {
        GM_setValue(storageKey, color);
      } else {
        window.localStorage.setItem(storageKey, color);
      }
    } catch (error) {
      // ignore
    }
  }

  function clearStoredColor() {
    try {
      if (typeof GM_deleteValue === "function") {
        GM_deleteValue(storageKey);
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch (error) {
      // ignore
    }
  }

  function applyThemeColor(color, preferAddStyle) {
    const normalized = normalizeColor(color);
    if (!normalized) {
      return;
    }
    const cssText = buildThemeCss(normalized);
    const style = ensureThemeStyleTag(Boolean(preferAddStyle));
    style.textContent = cssText;
    updateMetaThemeColor(normalized);
  }

  function buildThemeCss(normalized) {
    const lighter = lighten(normalized, 18);
    const slight = lighten(normalized, 10);
    const dark = darken(normalized, 18);
    const borderShade = darken(normalized, 28);
    const contrast = getContrastingTextColor(normalized);
    const overlay = toRgba(normalized, 0.15);
    const bgMainLight = lighten(normalized, 86);
    const bgSubLight = lighten(normalized, 92);
    const bgMainDark = darken(normalized, 70);
    const surfaceDark = darken(normalized, 60);
    const headerDark = darken(normalized, 50);
    const darkOverlay = toRgba(bgMainDark, 0.35);
    const fadeLight = toRgba(bgMainLight, 0.45);
    const fadeDark = toRgba(bgMainDark, 0.55);
    const textOnDark = getContrastingTextColor(bgMainDark);

    return [
      ":root{",
      "  --main-color:",
      normalized,
      ";",
      "  --sub-color:",
      slight,
      ";",
      "  --link-color:",
      normalized,
      ";",
      "  --link-hover-color:",
      lighter,
      ";",
      "  --glass-color:",
      overlay,
      " !important;",
      "  --bg-main-color:",
      bgMainLight,
      " !important;",
      "  --bg-sub-color:",
      bgSubLight,
      " !important;",
      "  --fade-color:",
      fadeLight,
      " !important;",
      "}",
      "body.bg1{",
      "  background-color:",
      bgMainLight,
      " !important;",
      "  background-image:none !important;",
      "}",
      "body.bg2{",
      "  background-color:",
      bgSubLight,
      " !important;",
      "  background-image:none !important;",
      "}",
      "body.dark-layout,.dark-layout{",
      "  --bg-main-color:",
      bgMainDark,
      " !important;",
      "  --bg-sub-color:",
      surfaceDark,
      " !important;",
      "  --glass-color:",
      darkOverlay,
      " !important;",
      "  --fade-color:",
      fadeDark,
      " !important;",
      "  --text-color:",
      textOnDark,
      " !important;",
      "}",
      "body.dark-layout.bg1,.dark-layout.bg1{",
      "  background-color:",
      bgMainDark,
      " !important;",
      "  background-image:none !important;",
      "}",
      "body.dark-layout.bg2,.dark-layout.bg2{",
      "  background-color:",
      surfaceDark,
      " !important;",
      "  background-image:none !important;",
      "}",
      ".dark-layout header,.dark-layout .nav-menu,.dark-layout .mobile-nav{",
      "  background-color:",
      headerDark,
      " !important;",
      "}",
      ".dark-layout .nsk-panel,.dark-layout .post-list-item,.dark-layout .message-item .content-column .content{",
      "  background-color:",
      surfaceDark,
      " !important;",
      "  border-color:",
      borderShade,
      " !important;",
      "}",
      ".btn,.btn-primary,.pure-button-primary,.meta-button,.pure-button.pure-button-primary{",
      "  background-color:",
      normalized,
      " !important;",
      "  border-color:",
      dark,
      " !important;",
      "  color:",
      contrast,
      " !important;",
      "}",
      ".btn:hover,.btn-primary:hover,.pure-button-primary:hover,.meta-button:hover{",
      "  background-color:",
      slight,
      " !important;",
      "  border-color:",
      dark,
      " !important;",
      "  color:",
      contrast,
      " !important;",
      "}",
      ".pager-cur,.pager-pos.pager-cur,.page-item.active .page-link,.pure-menu-selected{",
      "  background-color:",
      normalized,
      " !important;",
      "  border-color:",
      borderShade,
      " !important;",
      "  color:",
      contrast,
      " !important;",
      "}",
      "a,a:visited,.post-title a{",
      "  color:",
      normalized,
      " !important;",
      "}",
      "a:hover,.post-title a:hover{",
      "  color:",
      lighter,
      " !important;",
      "}",
      ".color-theme-switcher svg{",
      "  color:",
      normalized,
      " !important;",
      "}",
    ].join("");
  }

  function ensureThemeStyleTag(preferAddStyle) {
    if (themeStyleTag && themeStyleTag.parentNode) {
      return themeStyleTag;
    }
    if (
      (preferAddStyle || !themeStyleTag) &&
      typeof GM_addStyle === "function"
    ) {
      const created = GM_addStyle("");
      if (created) {
        created.id = created.id || "tm-theme-accent-style";
        themeStyleTag = created;
        return themeStyleTag;
      }
    }
    const style = document.createElement("style");
    style.id = "tm-theme-accent-style";
    const target = document.head || document.documentElement;
    target.appendChild(style);
    themeStyleTag = style;
    return style;
  }

  function removeThemeStyle() {
    if (themeStyleTag && themeStyleTag.parentNode) {
      themeStyleTag.parentNode.removeChild(themeStyleTag);
    }
    themeStyleTag = null;
  }

  function updateMetaThemeColor(color) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      return;
    }
    meta.setAttribute("content", color);
  }

  function restoreMetaThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      return;
    }
    if (originalMetaTheme) {
      meta.setAttribute("content", originalMetaTheme);
    } else {
      meta.removeAttribute("content");
    }
  }

  function normalizeColor(value) {
    if (!value || typeof value !== "string") {
      return null;
    }
    let color = value.trim().toLowerCase();
    if (!color) {
      return null;
    }
    if (color.indexOf("rgb") === 0) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        return rgbToHex(r, g, b);
      }
    }
    if (color.charAt(0) !== "#") {
      if (/^[0-9a-f]{6}$/i.test(color) || /^[0-9a-f]{3}$/i.test(color)) {
        color = "#" + color;
      } else {
        return null;
      }
    }
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return (
        "#" +
        color.charAt(1) +
        color.charAt(1) +
        color.charAt(2) +
        color.charAt(2) +
        color.charAt(3) +
        color.charAt(3)
      );
    }
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      return color;
    }
    return null;
  }

  function hexToRgb(color) {
    const normalized = normalizeColor(color);
    if (!normalized) {
      return null;
    }
    const value = parseInt(normalized.slice(1), 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function componentToHex(component) {
    const value = Math.round(clamp(component, 0, 255));
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  function lighten(color, percent) {
    const rgb = hexToRgb(color);
    if (!rgb) {
      return color;
    }
    const ratio = clamp(percent, 0, 100) / 100;
    const r = Math.round(rgb.r + (255 - rgb.r) * ratio);
    const g = Math.round(rgb.g + (255 - rgb.g) * ratio);
    const b = Math.round(rgb.b + (255 - rgb.b) * ratio);
    return rgbToHex(r, g, b);
  }

  function darken(color, percent) {
    const rgb = hexToRgb(color);
    if (!rgb) {
      return color;
    }
    const ratio = clamp(percent, 0, 100) / 100;
    const r = Math.round(rgb.r * (1 - ratio));
    const g = Math.round(rgb.g * (1 - ratio));
    const b = Math.round(rgb.b * (1 - ratio));
    return rgbToHex(r, g, b);
  }

  function toRgba(color, alpha) {
    const rgb = hexToRgb(color);
    if (!rgb) {
      const fallback = clamp(alpha, 0, 1);
      return "rgba(0, 0, 0, " + fallback + ")";
    }
    const value = clamp(alpha, 0, 1);
    return (
      "rgba(" +
      rgb.r +
      ", " +
      rgb.g +
      ", " +
      rgb.b +
      ", " +
      value.toFixed(2) +
      ")"
    );
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!isFinite(number)) {
      return min;
    }
    if (number < min) {
      return min;
    }
    if (number > max) {
      return max;
    }
    return number;
  }

  function getContrastingTextColor(color) {
    const rgb = hexToRgb(color);
    if (!rgb) {
      return "#ffffff";
    }
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.6 ? "#000000" : "#ffffff";
  }
})();
