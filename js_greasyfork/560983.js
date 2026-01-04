// ==UserScript==
// @name         CRG Markers Customization UX
// @namespace    http://lamansion-crg.net
// @version      0.0.1
// @description  Interfaz de configuración para personalizar marcadores en CRG Mark ShowTopics
// @author       Pinocchio
// @match        *://*lamansion-crg.net/*
// @require      https://cdn.jsdelivr.net/npm/winbox@0.2.82/dist/winbox.bundle.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560983/CRG%20Markers%20Customization%20UX.user.js
// @updateURL https://update.greasyfork.org/scripts/560983/CRG%20Markers%20Customization%20UX.meta.js
// ==/UserScript==

(() => { 'use strict';

  // ===== UX STORAGE =====
  // UX saves to its own storage for remembering user preferences
  const UX_PREF_KEY = 'UX_Prefs';
  const CORE_PREF_KEY = 'savedPrefs';
  const DEFAULT_PREFS = {
    saturation: 75,
    lightness: 65,
    hueOffset: 0,             // 0-360, shifts the entire palette
    forceBlackText: true,
    borderWidth: 1,           // 0-3px border
    borderRadius: 3,          // 0-8px rounded corners
    fontWeight: 700,          // 400=normal, 700=bold, 900=extra bold
    fontStyle: 'normal',      // 'normal' or 'italic'
    boxShadow: 1,             // 0=none, 1=subtle, 2=medium, 3=strong

    // Flat color system
    useFlatColors: false,     // false = random colors, true = flat colors
    flatBackgroundColor: '#ffffff',
    flatTextColor: '#000000',

    commentDotColor: '#00ff00', // Comment indicator dot
    starColors: {             // HSL colors for star ratings
      empty: [0, 0, 0],       // Empty stars - transparent
      half: [30, 70, 50],     // Half stars (orange)
      full: [0, 70, 50],      // Full stars (red)
      perfect: [120, 70, 50]  // Perfect rating (green)
    },
    iconSet: 'default'        // Icon set: 'default', 'minimal', 'circles' -- very mediocre sets to be honest
  };

  // ===== FUNCTIONS =====

  async function getTagColorPrefs() {
    // Try UX storage first, then core storage as fallback
    let saved = await GM_getValue(UX_PREF_KEY, null);
    if (!saved) {
      saved = await GM_getValue(CORE_PREF_KEY, null);
    }
    if (saved) {
      return { ...DEFAULT_PREFS, ...saved };
    }
    return DEFAULT_PREFS;
  }

  async function saveTagColorPrefs(prefs) {
    try {
      // Save to UX storage for remembering user preferences
      await GM_setValue(UX_PREF_KEY, prefs);
      // Notify core script to update styles and colors
      if (window.updateGlobalTagStyles) {
        window.updateGlobalTagStyles();
      }
      if (window.updateAllTagColors) {
        window.updateAllTagColors();
      }
    } catch (error) {
      console.error('[CRG TagUX] Error saving preferences:', error);
      throw error; // Re-throw to let the caller handle it
    }
  }

  // Helper functions for hex ↔ HSL conversion
  function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255;
    let g = parseInt(hex.slice(3,5),16)/255;
    let b = parseInt(hex.slice(5,7),16)/255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
  }

  // Function for live preview in dropdowns
  async function getTagColorsWithPrefs(tag, previewPrefs) {
    // Check if flat colors are enabled
    if (previewPrefs.useFlatColors) {
      return {
        background: previewPrefs.flatBackgroundColor,
        color: previewPrefs.flatTextColor
      };
    }

    // Random colors using golden ratio algorithm
    const goldenRatio = 0.618033988749895;
    let h = 0;

    for (let i = 0; i < tag.length; i++) {
      h += tag.charCodeAt(i) * goldenRatio;
      h -= Math.floor(h);
    }
    h -= Math.floor(h);

    const hue = Math.floor((h * 360 + previewPrefs.hueOffset) % 360);
    const saturation = previewPrefs.saturation;
    const lightness = previewPrefs.lightness;

    const background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const textColor = previewPrefs.forceBlackText ? '#000' : (lightness > 60 ? '#000' : '#fff');

    return { background, color: textColor };
  }

  async function openTagColorConfig() {
    // Check if panel already exists
    if (document.getElementById('crg-tag-config')) return;

    // Double safety check for core script
    if (!window.coreScriptLoaded && !document.getElementById('crg-core-marker')) {
      alert('Core script not detected.\n\nOpen the configuration on a page with visible badges.');
      return;
    }

    const prefs = await getTagColorPrefs();

    // Create content container
    const content = document.createElement('div');
    content.id = 'crg-tag-config';
    content.style.cssText = 'padding:20px; font-family:Arial,sans-serif;';

    content.innerHTML = `
      <!-- ETIQUETAS SECTION -->
      <fieldset style="border:1px solid #ccc; border-radius:4px; margin-bottom:25px; padding:15px;">
        <legend style="font-weight:bold; color:#333; padding:0 10px;">Etiquetas</legend>

        <div style="margin-bottom:15px;">
          <strong>Sistema de colores:</strong><br>
          <label style="margin-right:15px;">
            <input type="radio" name="color-system" value="random" ${!prefs.useFlatColors ? 'checked' : ''}> Colores aleatorios
          </label>
          <label>
            <input type="radio" name="color-system" value="flat" ${prefs.useFlatColors ? 'checked' : ''}> Colores planos
          </label>
        </div>

        <div id="random-colors-section" style="display: ${!prefs.useFlatColors ? 'block' : 'none'}; margin-bottom:25px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="flex: 0 0 100px; text-align: left; padding-right: 10px; padding-left: 4px;">
              <strong>Saturación:</strong> <span id="sat-val">${prefs.saturation}%</span>
            </div>
            <input type="range" id="sat-slider" min="0" max="100" value="${prefs.saturation}" style="width: 150px;">
          </div>

          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="flex: 0 0 100px; text-align: left; padding-right: 10px; padding-left: 4px;">
              <strong>Brillo:</strong> <span id="light-val">${prefs.lightness}%</span>
            </div>
            <input type="range" id="light-slider" min="0" max="100" value="${prefs.lightness}" style="width: 150px;">
          </div>

          <div style="display: flex; align-items: center;">
            <div style="flex: 0 0 100px; text-align: left; padding-right: 10px; padding-left: 4px;">
              <strong>Tono:</strong> <span id="hue-val">${prefs.hueOffset}°</span>
            </div>
            <input type="range" id="hue-slider" min="0" max="359" value="${prefs.hueOffset}" style="width: 150px;">
          </div>
        </div>

        <div id="flat-colors-section" style="display: ${prefs.useFlatColors ? 'block' : 'none'}; margin-bottom:15px;">
          <div style="display: flex; gap: 20px;">
            <label style="display: flex; align-items: center;">
              Color del texto:
              <input type="color" id="flat-text-color" value="${prefs.flatTextColor}" style="margin-left:10px;width:40px;height:30px;border:none;">
            </label>
            <label style="display: flex; align-items: center;">
              Color de fondo:
              <input type="color" id="flat-bg-color" value="${prefs.flatBackgroundColor}" style="margin-left:10px;width:40px;height:30px;border:none;">
            </label>
          </div>
        </div>

        <div style="margin-bottom:15px;">
          <label style="margin-right:20px;">Bordes curvados:
            <div class="custom-dropdown" id="radius-dropdown">
              <div class="dropdown-trigger">${prefs.borderRadius}px ▼</div>
              <div class="dropdown-options">
                <div class="dropdown-option" data-value="0">0px</div>
                <div class="dropdown-option" data-value="2">2px</div>
                <div class="dropdown-option" data-value="4">4px</div>
                <div class="dropdown-option" data-value="6">6px</div>
                <div class="dropdown-option" data-value="8">8px</div>
              </div>
            </div>
          </label>

          <label>Sombra:
            <div class="custom-dropdown" id="shadow-dropdown">
              <div class="dropdown-trigger">${prefs.boxShadow === 0 ? 'Ninguna' : prefs.boxShadow === 1 ? 'Suave' : prefs.boxShadow === 2 ? 'Media' : 'Fuerte'} ▼</div>
              <div class="dropdown-options">
                <div class="dropdown-option" data-value="0">Ninguna</div>
                <div class="dropdown-option" data-value="1">Suave</div>
                <div class="dropdown-option" data-value="2">Media</div>
                <div class="dropdown-option" data-value="3">Fuerte</div>
              </div>
            </div>
          </label>
        </div>

        <div style="margin-bottom:15px;">
          <label style="margin-right:10px;"><input type="checkbox" id="bold-text" ${prefs.fontWeight === 700 ? 'checked' : ''}> <strong>Negrita</strong></label>
          <label style="margin-right:10px;"><input type="checkbox" id="italic-text" ${prefs.fontStyle === 'italic' ? 'checked' : ''}> <em>Itálica</em></label>
          <label><input type="checkbox" id="black-text" ${prefs.forceBlackText ? 'checked' : ''}> Forzar texto negro</label>
        </div>

        <div style="margin-bottom:10px;">
          <strong>Perfiles de color predeterminados:</strong><br>
          <button class="preset-btn" data-preset="vibrant" style="margin:4px;">Vibrante</button>
          <button class="preset-btn" data-preset="pastel" style="margin:4px;">Pastel</button>
        </div>
      </fieldset>

      <!-- ESTRELLAS Y MARCADORES SECTION -->
      <fieldset style="border:1px solid #ccc; border-radius:4px; margin-bottom:25px; padding:15px;">
        <legend style="font-weight:bold; color:#333; padding:0 10px;">Estrellas y Marcadores</legend>

        <div style="margin-bottom:15px;">
          <strong>Colores de las estrellas:</strong>
          <div style="display:flex; gap:15px; align-items:center; margin-top:8px;">
            <div style="display:flex; align-items:center;">
              <span style="width:50px;">Media:</span>
              <input type="color" class="star-color" data-star="half" style="width:25px; height:25px; margin:0 3px;">
            </div>

            <div style="display:flex; align-items:center;">
              <span style="width:50px;">Completa:</span>
              <input type="color" class="star-color" data-star="full" style="width:25px; height:25px; margin:0 3px;">
            </div>

            <div style="display:flex; align-items:center;">
              <span style="width:50px;">Perfectas:</span>
              <input type="color" class="star-color" data-star="perfect" style="width:25px; height:25px; margin:0 3px;">
            </div>
          </div>
        </div>

        <div style="margin-bottom:15px;">
          <strong>Conjuntos de Iconos:</strong>
          <div class="custom-dropdown" id="icon-set-dropdown" style="margin-top:5px;">
            <div class="dropdown-trigger">Predeterminado ▼</div>
            <div class="dropdown-options">
              <div class="dropdown-option" data-set="default">Predeterminado: 🗒 ✅ ☑️ ⛔️ 💙</div>
              <div class="dropdown-option" data-set="minimal">Minimal: ○ ✓ ■ ✗ ♥</div>
              <div class="dropdown-option" data-set="circles">Círculos: 🔵 🟢 🟡 🔴 🟣</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom:10px;">
          <strong>Indicador de comentario:</strong>
          <input type="color" id="comment-dot-color" value="${prefs.commentDotColor}" style="width:25px; height:25px; margin-left:10px;">
        </div>
      </fieldset>

      <!-- PERFILES SECTION -->
      <fieldset style="border:1px solid #ccc; border-radius:4px; margin-bottom:25px; padding:15px;">
        <legend style="font-weight:bold; color:#333; padding:0 10px;">Perfiles globales</legend>
        <div style="margin-bottom:10px;">
          <button class="preset-btn" data-preset="default" style="margin:4px;">Por defecto</button>
          <button class="preset-btn preset-user" data-preset="user" style="margin:4px; background:#333; color:white; font-weight:bold;">Usuario</button>
        </div>
      </fieldset>

      <!-- SAVE/CLOSE BUTTONS - OUTSIDE BOTH TABS -->
      <div style="margin-top:30px; text-align:center; border-top:1px solid #ddd; padding-top:20px;">
        <button id="save-prefs" style="padding:10px 20px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; margin-right:10px;">Guardar</button>
        <button id="close-prefs" style="padding:10px 20px; background:#6c757d; color:white; border:none; border-radius:4px; cursor:pointer;">Cerrar</button>
      </div>
    `;

    // Create WinBox window
    const winbox = new WinBox({
      title: "Configuración Gráfica",
      id: "crg-tag-config",
      width: "375x",
      height: "780px",
      x: "right",
      y: "center",
      right: 20,
      mount: content,
      class: "modern",
      index: 9999
    });

    // Add styles
    content.innerHTML += `
      <style>
        /* Custom WinBox header styling */
        .winbox .wb-title { color: white !important; font-weight: bold !important; }
        .winbox { background: #252b4e !important; }

        /* Hide fullscreen button - most reliable approach */
        .winbox .wb-full,
        .winbox .wb-fullscreen,
        .winbox button[title*="full"],
        .winbox button[title*="Full"] {
          display: none !important;
        }
        .wb-body { background: #f5f5f5 !important; }
        /* Custom dropdown styling */
        .custom-dropdown { position: relative; display: inline-block; min-width: 60px; }
        .dropdown-trigger {
          padding: 4px 8px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          user-select: none;
          border-radius: 3px;
          text-align: center;
        }
        .dropdown-trigger:hover { background: #f8f8f8; }
        .dropdown-options {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-top: none;
          z-index: 1000;
          max-height: 200px;
          overflow-y: auto;
        }
        .dropdown-option {
          padding: 6px 8px;
          cursor: pointer;
          text-align: center;
        }
        .dropdown-option:hover { background: #007bff; color: white; }
        .custom-dropdown.open .dropdown-options { display: block; }

        /* Disabled preset buttons */
        .preset-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed !important;
          pointer-events: none;
        }
        .preset-btn:disabled:hover {
          background: #ccc !important;
        }

        /* Disabled checkbox styling */
        input[type="checkbox"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        input[type="checkbox"]:disabled + strong,
        input[type="checkbox"]:disabled + em {
          opacity: 0.7;
          cursor: not-allowed;
        }
      </style>
    `;

    // Build iconSets for live preview (matches core definitions)
    const iconSets = {
      'default': {'0':'🗒', '1':'✅', '2':'☑️', '3':'⛔️', '4':'💙'},
      'minimal': {'0':'○', '1':'✓', '2':'■', '3':'✗', '4':'♥'},
      'circles': {'0':'◯', '1':'🟢', '2':'🔵', '3':'🔴', '4':'🟣'}
    };

    // === Event attachments ===
    const satSlider = content.querySelector('#sat-slider');
    const lightSlider = content.querySelector('#light-slider');
    const hueSlider = content.querySelector('#hue-slider');
    const radiusDropdown = content.querySelector('#radius-dropdown');
    const shadowDropdown = content.querySelector('#shadow-dropdown');
    const boldText = content.querySelector('#bold-text');
    const italicText = content.querySelector('#italic-text');
    const blackText = content.querySelector('#black-text');

    // Store current values for dropdowns (since they're not real form elements)
    let currentRadiusValue = prefs.borderRadius;
    let currentShadowValue = prefs.boxShadow;

    const applyLive = async () => {
      const colorSystemRadios = content.querySelectorAll('input[name="color-system"]');
      const selectedSystem = Array.from(colorSystemRadios).find(radio => radio.checked)?.value;
      const flatBgColor = content.querySelector('#flat-bg-color');
      const flatTextColor = content.querySelector('#flat-text-color');

      const tempPrefs = {
        saturation: +satSlider.value,
        lightness: +lightSlider.value,
        hueOffset: +hueSlider.value,
        borderWidth: 1, // Fixed for core compatibility
        borderRadius: currentRadiusValue,
        fontWeight: boldText.checked ? 700 : 400,
        fontStyle: italicText.checked ? 'italic' : 'normal',
        boxShadow: currentShadowValue,
        forceBlackText: blackText.checked,
        // Color system
        useFlatColors: selectedSystem === 'flat',
        flatBackgroundColor: flatBgColor ? flatBgColor.value : '#ffffff',
        flatTextColor: flatTextColor ? flatTextColor.value : '#000000'
      };

      content.querySelector('#sat-val').textContent = tempPrefs.saturation;
      content.querySelector('#light-val').textContent = tempPrefs.lightness;
      content.querySelector('#hue-val').textContent = tempPrefs.hueOffset;

      // Apply live preview to all existing badges
      document.querySelectorAll('.tag-badge').forEach(async (badge) => {
        const tag = '#' + badge.textContent;
        const colors = await getTagColorsWithPrefs(tag, tempPrefs);
        badge.style.background = colors.background;
        badge.style.color = colors.color;
        badge.style.border = `1px solid rgba(0,0,0,0.2)`;
        badge.style.borderRadius = `${tempPrefs.borderRadius}px`;
        badge.style.fontWeight = tempPrefs.fontWeight;
        badge.style.fontStyle = tempPrefs.fontStyle;
        badge.style.boxShadow =
          tempPrefs.boxShadow == 0 ? 'none' :
          tempPrefs.boxShadow == 1 ? '0 1px 3px rgba(0,0,0,0.2)' :
          tempPrefs.boxShadow == 2 ? '0 2px 6px rgba(0,0,0,0.25)' :
          '0 4px 12px rgba(0,0,0,0.3)';
      });
    };

    // Function for previewing dropdown hover changes
    const applyLiveWithPreview = async (previewValue, dropdownId) => {
      const tempPrefs = {
        saturation: +satSlider.value,
        lightness: +lightSlider.value,
        hueOffset: +hueSlider.value,
        borderWidth: 1,
        borderRadius: dropdownId === 'radius-dropdown' ? +previewValue : currentRadiusValue,
        fontWeight: boldText.checked ? 700 : 400,
        fontStyle: italicText.checked ? 'italic' : 'normal',
        boxShadow: dropdownId === 'shadow-dropdown' ? +previewValue : currentShadowValue,
        forceBlackText: blackText.checked
      };

      // Apply live preview to all existing badges with preview value
      document.querySelectorAll('.tag-badge').forEach(async (badge) => {
        const tag = '#' + badge.textContent;
        const colors = await getTagColorsWithPrefs(tag, tempPrefs);
        badge.style.background = colors.background;
        badge.style.color = colors.color;
        badge.style.border = `1px solid rgba(0,0,0,0.2)`;
        badge.style.borderRadius = `${tempPrefs.borderRadius}px`;
        badge.style.fontWeight = tempPrefs.fontWeight;
        badge.style.fontStyle = tempPrefs.fontStyle;
        badge.style.boxShadow =
          tempPrefs.boxShadow == 0 ? 'none' :
          tempPrefs.boxShadow == 1 ? '0 1px 3px rgba(0,0,0,0.2)' :
          tempPrefs.boxShadow == 2 ? '0 2px 6px rgba(0,0,0,0.25)' :
          '0 4px 12px rgba(0,0,0,0.3)';
      });
    };

    // Events
    [satSlider, lightSlider, hueSlider].forEach(s => s.oninput = applyLive);
    boldText.onchange = italicText.onchange = blackText.onchange = applyLive;

    // Function to toggle preset buttons based on color system
    function togglePresetButtons(useFlatColors) {
      const presetButtons = content.querySelectorAll('.preset-btn:not(.preset-user)');
      presetButtons.forEach(btn => {
        btn.disabled = useFlatColors;
      });
    }

    // Color system toggle
    const colorSystemRadios = content.querySelectorAll('input[name="color-system"]');
    colorSystemRadios.forEach(radio => {
      radio.onchange = () => {
        const selectedSystem = radio.value;
        const useFlatColors = selectedSystem === 'flat';
        const randomSection = content.querySelector('#random-colors-section');
        const flatSection = content.querySelector('#flat-colors-section');
        const blackTextCheckbox = content.querySelector('#black-text');

        if (selectedSystem === 'random') {
          randomSection.style.display = 'block';
          flatSection.style.display = 'none';
          // Enable "Forzar texto negro" for random colors
          blackTextCheckbox.disabled = false;
        } else {
          randomSection.style.display = 'none';
          flatSection.style.display = 'block';
          // Disable "Forzar texto negro" for flat colors since text color is user-defined
          blackTextCheckbox.disabled = true;
        }

        // Toggle preset buttons
        togglePresetButtons(useFlatColors);
        applyLive();
      };
    });

    // Flat color pickers
    const flatBgColor = content.querySelector('#flat-bg-color');
    const flatTextColor = content.querySelector('#flat-text-color');
    if (flatBgColor) flatBgColor.oninput = applyLive;
    if (flatTextColor) flatTextColor.oninput = applyLive;



    // Custom dropdown behavior: hover to preview, click to commit
    [radiusDropdown, shadowDropdown].forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const options = dropdown.querySelector('.dropdown-options');
      let previewValue = null;

      // Toggle dropdown on trigger click
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.custom-dropdown.open').forEach(openDropdown => {
          if (openDropdown !== dropdown) {
            openDropdown.classList.remove('open');
          }
        });
        dropdown.classList.toggle('open');
      });

      // Add hover preview to options
      options.querySelectorAll('.dropdown-option').forEach(option => {
        option.addEventListener('mouseenter', () => {
          previewValue = parseInt(option.dataset.value);
          const dropdownId = dropdown.id;
          applyLiveWithPreview(previewValue, dropdownId);
        });

        option.addEventListener('click', () => {
          // Commit the value
          const newValue = parseInt(option.dataset.value);
          if (dropdown.id === 'radius-dropdown') {
            currentRadiusValue = newValue;
            trigger.textContent = `${newValue}px ▼`;
          } else if (dropdown.id === 'shadow-dropdown') {
            currentShadowValue = newValue;
            const text = newValue === 0 ? 'Ninguna' : newValue === 1 ? 'Suave' : newValue === 2 ? 'Media' : 'Fuerte';
            trigger.textContent = `${text} ▼`;
          }

          previewValue = null;
          dropdown.classList.remove('open');
          applyLive(); // Apply committed change
        });
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          previewValue = null;
          dropdown.classList.remove('open');
          applyLive(); // Reset to committed values
        }
      });
    });

    // Icon set dropdown
    let selectedIconSet = prefs.iconSet || 'default';
    const iconSetDropdown = content.querySelector('#icon-set-dropdown');
    if (iconSetDropdown) {
      const trigger = iconSetDropdown.querySelector('.dropdown-trigger');
      const options = iconSetDropdown.querySelector('.dropdown-options');

      // Initialize with current selection
      const iconLabels = {'default': 'Predeterminado', 'minimal': 'Minimal', 'circles': 'Círculos'};
      trigger.textContent = iconLabels[selectedIconSet] + ' ▼';

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-dropdown.open').forEach(openDropdown => {
          if (openDropdown !== iconSetDropdown) {
            openDropdown.classList.remove('open');
          }
        });
        iconSetDropdown.classList.toggle('open');
      });

      options.querySelectorAll('.dropdown-option').forEach(option => {
        option.addEventListener('click', () => {
          selectedIconSet = option.dataset.set;
          trigger.textContent = option.textContent.split(':')[0] + ' ▼';
          iconSetDropdown.classList.remove('open');

          // Live preview: Update marker icons
          const icons = iconSets[selectedIconSet];
          document.querySelectorAll('.lm-tm').forEach(marker => {
            const status = marker.className.match(/status-(\d)/)?.[1] || '0';
            marker.textContent = icons[status] || icons['0'];
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!iconSetDropdown.contains(e.target)) {
          iconSetDropdown.classList.remove('open');
        }
      });
    }

    // Presets
    content.querySelectorAll('.preset-btn').forEach(btn => {
      btn.onclick = async () => {
        const p = btn.dataset.preset;
        if (p === 'default') {
          satSlider.value = 100;
          lightSlider.value = 100;
          hueSlider.value = 359;
          // Update dropdowns for default preset
          currentRadiusValue = 6;
          currentShadowValue = 2;
          radiusDropdown.querySelector('.dropdown-trigger').textContent = '6px ▼';
          shadowDropdown.querySelector('.dropdown-trigger').textContent = 'Media ▼';
          // Update checkboxes for default preset
          boldText.checked = true;
          italicText.checked = false;
          blackText.checked = false;
        } else if (p === 'vibrant') {
          satSlider.value = 75;
          lightSlider.value = 65;
          hueSlider.value = 0;
        } else if (p === 'pastel') {
          satSlider.value = 45;
          lightSlider.value = 82;
          hueSlider.value = 0;
        } else if (p === 'user') {
          // Load user's saved settings
          const savedPrefs = await getTagColorPrefs();
          satSlider.value = savedPrefs.saturation;
          lightSlider.value = savedPrefs.lightness;
          hueSlider.value = savedPrefs.hueOffset;
          currentRadiusValue = savedPrefs.borderRadius;
          currentShadowValue = savedPrefs.boxShadow;
          radiusDropdown.querySelector('.dropdown-trigger').textContent = `${savedPrefs.borderRadius}px ▼`;
          const shadowText = savedPrefs.boxShadow === 0 ? 'Ninguna' : savedPrefs.boxShadow === 1 ? 'Suave' : savedPrefs.boxShadow === 2 ? 'Media' : 'Fuerte';
          shadowDropdown.querySelector('.dropdown-trigger').textContent = `${shadowText} ▼`;
        }
        applyLive();
      };
    });

    // Save button
    content.querySelector('#save-prefs').onclick = async () => {
      // Collect star colors from color pickers (only half/full/perfect)
      const starColorsObj = {};
      starColors.forEach(picker => {
        const star = picker.dataset.star;
        // Skip empty stars - keep them semi-transparent
        if (star !== 'empty') {
          const hex = picker.value;
          const hsl = hexToHsl(hex);
          starColorsObj[star] = hsl; // Save as [h, s, l]
        }
      });

      // Get color system settings
      const colorSystemRadios = content.querySelectorAll('input[name="color-system"]');
      const selectedSystem = Array.from(colorSystemRadios).find(radio => radio.checked)?.value;
      const flatBgColor = content.querySelector('#flat-bg-color');
      const flatTextColor = content.querySelector('#flat-text-color');

      const finalPrefs = {
        saturation: +satSlider.value,
        lightness: +lightSlider.value,
        hueOffset: +hueSlider.value,
        borderWidth: 1,
        borderRadius: currentRadiusValue,
        fontWeight: boldText.checked ? 700 : 400,
        fontStyle: italicText.checked ? 'italic' : 'normal',
        boxShadow: currentShadowValue,
        forceBlackText: blackText.checked,
        // Color system
        useFlatColors: selectedSystem === 'flat',
        flatBackgroundColor: flatBgColor ? flatBgColor.value : '#ffffff',
        flatTextColor: flatTextColor ? flatTextColor.value : '#000000',
        // Comment dot and stars only
        commentDotColor: commentDotColor.value,
        starColors: starColorsObj,
        iconSet: iconSets[selectedIconSet] // Save the icon mapping object
      };

      // Save to UX storage for remembering user preferences
      await saveTagColorPrefs(finalPrefs);

      // Call core's save function via the shared DOM marker
      const marker = document.getElementById('crg-core-marker');
      await marker.savePreferencesToCore(finalPrefs);

      // Update global styles immediately
      if (window.updateGlobalTagStyles) {
        window.updateGlobalTagStyles();
      }

      alert('¡Preferencias guardadas correctamente!');
      winbox.close(true); // Close panel after saving
    };

    // Star controls (only half/full/perfect, no status or empty stars)
    const starColors = content.querySelectorAll('.star-color:not([data-star="empty"])');
    const commentDotColor = content.querySelector('#comment-dot-color');

    // Initialize star color pickers (skip empty stars)
    starColors.forEach(picker => {
      const star = picker.dataset.star;
      if (star !== 'empty') {
        const hsl = prefs.starColors[star];
        const hex = hslToHex(hsl[0], hsl[1], hsl[2]);
        picker.value = hex;
        updateStarPreview(star, hsl);
      }
    });

    // Initialize comment dot color
    commentDotColor.value = prefs.commentDotColor;

    // Star color picker change handlers with LIVE updates
    starColors.forEach(picker => {
      picker.oninput = () => {
        const starType = picker.dataset.star;
        const hex = picker.value;
        const hsl = hexToHsl(hex);

        // Update preview circle
        updateStarPreview(starType, hsl);

        // LIVE UPDATE: Apply to actual star SVGs that match this star type
        document.querySelectorAll('.rating-stars').forEach(container => {
          const svgs = container.querySelectorAll('svg');
          const rating = parseFloat(container.dataset.rating) || 0;

          svgs.forEach((svg, i) => {
            // Determine what type this star should be based on rating
            let currentStarType = 'empty';
            const isActive = rating >= i + 0.5;
            if (isActive) {
              const isFull = rating >= i + 1;
              if (rating === 5) { // Perfect/5-star - all stars get perfect color
                currentStarType = 'perfect';
              } else if (isFull) {
                currentStarType = 'full';
              } else {
                currentStarType = 'half';
              }
            }

            // If this star matches the type we're changing, update its color
            if (currentStarType === starType) {
              const path = svg.querySelector('path');
              if (path) {
                path.setAttribute('fill', `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`);
              }
            }
          });
        });
      };
    });

    // Comment dot color change handler
    commentDotColor.oninput = () => {
      // Live preview: Update the CSS variable for immediate visual feedback
      document.documentElement.style.setProperty('--comment-dot-color', commentDotColor.value);
    };

    // Helper functions for live preview
    function updateStarPreview(star, hsl) {
      const preview = content.querySelector(`.star-preview[data-star="${star}"]`);
      if (preview) {
        preview.style.backgroundColor = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
      }
    }

    // Close button
    content.querySelector('#close-prefs').onclick = () => {
      winbox.close(true); // Force close without confirmation
    };

    // Load saved values and initial preview
    satSlider.value = prefs.saturation;
    lightSlider.value = prefs.lightness;
    hueSlider.value = prefs.hueOffset;
    currentRadiusValue = prefs.borderRadius;
    currentShadowValue = prefs.boxShadow;
    boldText.checked = prefs.fontWeight === 700;
    italicText.checked = prefs.fontStyle === 'italic';
    blackText.checked = prefs.forceBlackText;

    // Update dropdown trigger text
    radiusDropdown.querySelector('.dropdown-trigger').textContent = `${currentRadiusValue}px ▼`;
    const shadowText = currentShadowValue === 0 ? 'Ninguna' : currentShadowValue === 1 ? 'Suave' : currentShadowValue === 2 ? 'Media' : 'Fuerte';
    shadowDropdown.querySelector('.dropdown-trigger').textContent = `${shadowText} ▼`;

    // Initialize preset button states based on current color system
    togglePresetButtons(prefs.useFlatColors);

    // Initialize "Forzar texto negro" checkbox disabled state based on color system
    if (prefs.useFlatColors) {
      blackText.disabled = true;
    } else {
      blackText.disabled = false;
    }


  }

  // Run only in the top-level frame (not in iframes)
  if (window.top === window.self) {
    function waitForCoreAndRegisterMenu() {
      // Success if either the window flag OR the DOM marker exists
      const corePresent = window.coreScriptLoaded || document.getElementById('crg-core-marker');

      if (corePresent) {
        GM_registerMenuCommand('💠 Configuración Gráfica', openTagColorConfig);
        console.log('[CRG TagUX] Core detected → menu registered');
        return;
      }

      // Otherwise: set up a MutationObserver to watch for the marker
      const observer = new MutationObserver(() => {
        if (document.getElementById('crg-core-marker') || window.coreScriptLoaded) {
          observer.disconnect();
          try {
            GM_registerMenuCommand('Configurar colores de etiquetas', openTagColorConfig);
            console.log('[CRG TagUX] Core detected via observer → menu registered');
          } catch (error) {
            console.error('[CRG TagUX] Error registering menu command:', error);
          }
        }
      });

      // Add error handling for observer
      try {
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        // Add a safety timeout to prevent infinite waiting
        setTimeout(() => {
          if (observer) {
            observer.disconnect();
            console.warn('[CRG TagUX] Core script not detected after timeout');
          }
        }, 30000); // 30 second timeout
      } catch (error) {
        console.error('[CRG TagUX] Error setting up MutationObserver:', error);
        // Fallback: try to register menu anyway
        try {
          GM_registerMenuCommand('Configurar colores de etiquetas', openTagColorConfig);
          console.log('[CRG TagUX] Menu registered in fallback mode');
        } catch (fallbackError) {
          console.error('[CRG TagUX] Fallback menu registration failed:', fallbackError);
        }
      }
    }

    // Start waiting
    waitForCoreAndRegisterMenu();
  }

})();
