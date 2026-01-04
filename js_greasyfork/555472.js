// ==UserScript==
// @name         Bonk UI Font & Color Customizer
// @namespace    https://bonk-customizer.local
// @version      2.0
// @description  Change the UI font and color on bonk.io, bonkisback.io, and multiplayer.gg (no game-code injection) but though the page n inside text is all sectioned
// @author       bonkiestofthem
// @match        *://bonk.io/*
// @match        *://bonkisback.io/*
// @match        *://multiplayer.gg/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555472/Bonk%20UI%20Font%20%20Color%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/555472/Bonk%20UI%20Font%20%20Color%20Customizer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const GOOGLE_FONTS = [
    "Roboto","Open Sans","Lato","Poppins","Montserrat","Raleway","Oswald",
    "Playfair Display","Merriweather","Noto Sans","Nunito","Ubuntu","Fira Sans",
    "Quicksand","Overpass","Rubik","Karla","Heebo","Mukta","Cabin","Josefin Sans",
    "PT Sans","Muli","Source Sans Pro","Arimo","Bitter","Alegreya","Bebas Neue",
    "Anton","Archivo","Baskerville"
  ];
  const SYSTEM_FONTS = [
    "Arial","Verdana","Tahoma","Georgia","Courier New","Lucida Console",
    "Trebuchet MS","Comic Sans MS","Impact","Palatino","Garamond",
    "Bookman","Candara","Segoe UI"
  ];

  const FONTS = [...new Set([...SYSTEM_FONTS, ...GOOGLE_FONTS])];
  const LS_FONT = "bonk_ui_font";
  const LS_COLOR = "bonk_ui_color";

  // Load Google Fonts dynamically
  (function loadFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map(f => 'family=' + encodeURIComponent(f.replace(/\s+/g, '+'))).join('&')}&display=swap`;
    document.head.appendChild(link);
  })();

  // Create the floating UI panel
  const panel = document.createElement('div');
  panel.innerHTML = `
    <div id="buc-header" style="cursor:move;background:#333;padding:6px 8px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;">
      <span>🎨 Bonk UI</span>
      <button id="buc-min" style="border:none;background:#444;color:#fff;cursor:pointer;padding:2px 6px;border-radius:4px;">−</button>
    </div>
    <div id="buc-body" style="padding:10px;">
      <label>Font</label>
      <select id="buc-font" style="width:100%;margin:6px 0;padding:6px;border-radius:4px;"></select>
      <label>Color</label>
      <input type="color" id="buc-color" style="width:100%;height:36px;margin-bottom:6px;">
      <input type="text" id="buc-hex" placeholder="#ffffff" maxlength="7" style="width:100%;padding:6px;border-radius:4px;margin-bottom:6px;">
      <div id="buc-scale" style="height:24px;border-radius:4px;margin-bottom:6px;cursor:pointer;"></div>
      <button id="buc-apply" style="width:100%;padding:8px;border:none;border-radius:4px;background:#4caf50;color:white;cursor:pointer;">Apply</button>
    </div>
  `;
  Object.assign(panel.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    width: "250px",
    background: "#222",
    color: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    zIndex: 999999,
    fontFamily: "Arial, sans-serif"
  });
  document.body.appendChild(panel);

  // Populate fonts
  const fontSel = panel.querySelector('#buc-font');
  FONTS.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    opt.style.fontFamily = f;
    fontSel.appendChild(opt);
  });

  // Build color scale (rainbow)
  const scale = panel.querySelector('#buc-scale');
  scale.style.background = "linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet, white)";
  scale.addEventListener('click', e => {
    const rect = scale.getBoundingClientRect();
    const ctx = document.createElement('canvas').getContext('2d');
    const c = ctx.canvas;
    c.width = rect.width; c.height = 1;
    const grad = ctx.createLinearGradient(0,0,c.width,0);
    ["#ff0000","#ffa500","#ffff00","#00ff00","#00ffff","#0000ff","#8a2be2","#ffffff"].forEach((clr,i,a)=>grad.addColorStop(i/(a.length-1),clr));
    ctx.fillStyle = grad; ctx.fillRect(0,0,c.width,1);
    const data = ctx.getImageData(e.clientX - rect.left, 0, 1, 1).data;
    const hex = "#" + [data[0],data[1],data[2]].map(x => x.toString(16).padStart(2,"0")).join("");
    color.value = hex;
    hexInput.value = hex;
  });

  // Hook up elements
  const color = panel.querySelector('#buc-color');
  const hexInput = panel.querySelector('#buc-hex');
  const applyBtn = panel.querySelector('#buc-apply');
  const minBtn = panel.querySelector('#buc-min');
  const body = panel.querySelector('#buc-body');

  color.addEventListener('input', () => hexInput.value = color.value);
  hexInput.addEventListener('input', () => {
    const val = hexInput.value.trim();
    if(/^#([0-9a-fA-F]{6})$/.test(val)) color.value = val;
  });

  // Apply font & color
  function applyStyles(font, col) {
    let style = document.getElementById('buc-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'buc-style';
      document.head.appendChild(style);
    }
    style.textContent = `
      *:not(canvas):not(svg) {
        font-family: '${font}', sans-serif !important;
        color: ${col} !important;
      }
      ::placeholder { color: ${col} !important; opacity: 0.8; }
    `;
    localStorage.setItem(LS_FONT, font);
    localStorage.setItem(LS_COLOR, col);
  }

  applyBtn.addEventListener('click', () => {
    applyStyles(fontSel.value, color.value);
  });

  minBtn.addEventListener('click', () => {
    if (body.style.display === 'none') {
      body.style.display = 'block';
      minBtn.textContent = '−';
    } else {
      body.style.display = 'none';
      minBtn.textContent = '+';
    }
  });

  // Restore previous settings
  const savedFont = localStorage.getItem(LS_FONT);
  const savedColor = localStorage.getItem(LS_COLOR);
  if (savedFont) fontSel.value = savedFont;
  if (savedColor) { color.value = savedColor; hexInput.value = savedColor; }
  if (savedFont && savedColor) applyStyles(savedFont, savedColor);

  // Draggable
  const header = panel.querySelector('#buc-header');
  let dragging = false, startX=0, startY=0, startLeft=0, startTop=0;
  header.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    const r = panel.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    panel.style.left = startLeft + (e.clientX - startX) + 'px';
    panel.style.top = startTop + (e.clientY - startY) + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  });
  window.addEventListener('mouseup', () => dragging = false);

})();