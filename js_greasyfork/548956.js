// ==UserScript==
// @name         GoBattle.io Theme Panel
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1
// @description  Add a floating panel to recolor GoBattle.io with tint overlays and filters (hue, saturation, brightness, contrast).
// @author       YourName
// @match        *://gobattle.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548956/GoBattleio%20Theme%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/548956/GoBattleio%20Theme%20Panel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'gobattle_theme';
  const defaults = {
    tint: '#00aaff',
    blend: 'multiply',
    opacity: 0.35,
    hue: 0,
    saturate: 120,
    bright: 100,
    contrast: 100,
    applyAll: false,
    panelPos: { left: null, top: 80, right: 20 }
  };

  function loadSettings() {
    try {
      return Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch {
      return { ...defaults };
    }
  }
  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  let settings = loadSettings();

  // Panel CSS
  const style = document.createElement('style');
  style.textContent = `
    #gb-theme-panel {
      width: 260px;
      position: fixed;
      background: #111;
      color: #eee;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #444;
      font-family: sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6);
      z-index: 100000;
      user-select: none;
    }
    #gb-panel-header { font-weight: bold; font-size: 13px; margin: 0 0 6px; cursor: move; text-align:center; }
    #gb-theme-panel label { display:block; font-size:12px; margin-top:6px; }
    #gb-theme-panel input[type="color"], 
    #gb-theme-panel select, 
    #gb-theme-panel input[type="range"], 
    #gb-theme-panel input[type="checkbox"] { width: 100%; }
    .gb-overlay { position: fixed; pointer-events: none; z-index: 99990; }
  `;
  document.head.appendChild(style);

  // Panel HTML
  const panel = document.createElement('div');
  panel.id = 'gb-theme-panel';
  panel.style.top = `${settings.panelPos.top}px`;
  if (settings.panelPos.left !== null) {
    panel.style.left = `${settings.panelPos.left}px`;
  } else {
    panel.style.right = `${settings.panelPos.right}px`;
  }

  panel.innerHTML = `
    <div id="gb-panel-header">KING MAMBA PANNEL</div>
    <label>Tint <input id="gb-tint" type="color" value="${settings.tint}"></label>
    <label>Blend
      <select id="gb-blend">
        <option>multiply</option><option>screen</option><option>overlay</option>
        <option>color</option><option>lighten</option><option>darken</option>
      </select>
    </label>
    <label>Opacity <input id="gb-opacity" type="range" min="0" max="100" value="${Math.round(settings.opacity*100)}"></label>
    <label>Hue <input id="gb-hue" type="range" min="0" max="360" value="${settings.hue}"></label>
    <label>Saturate <input id="gb-saturate" type="range" min="0" max="300" value="${settings.saturate}"></label>
    <label>Brightness <input id="gb-bright" type="range" min="0" max="200" value="${settings.bright}"></label>
    <label>Contrast <input id="gb-contrast" type="range" min="0" max="200" value="${settings.contrast}"></label>
    <label><input id="gb-applyall" type="checkbox"${settings.applyAll ? ' checked' : ''}> Apply to all canvases</label>
  `;
  document.body.appendChild(panel);

  // Drag panel
  (function () {
    const header = panel.querySelector('#gb-panel-header');
    let dragging = false, sx=0, sy=0, sl=0, st=0;
    header.addEventListener('mousedown', e => {
      dragging = true; sx=e.clientX; sy=e.clientY;
      const r=panel.getBoundingClientRect(); sl=r.left; st=r.top;
      panel.style.right='auto'; panel.style.left=`${sl}px`;
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    function move(e){ if(!dragging) return; panel.style.left=`${sl+(e.clientX-sx)}px`; panel.style.top=`${st+(e.clientY-sy)}px`;
      settings.panelPos.left=parseInt(panel.style.left); settings.panelPos.top=parseInt(panel.style.top);}
    function up(){dragging=false; document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); saveSettings();}
  })();

  // Overlay
  const overlays = new Map();
  function applySettings() {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    if (!canvases.length) return;
    const targets = settings.applyAll ? canvases : [canvases.sort((a,b)=>b.width*b.height - a.width*a.height)[0]];
    targets.forEach(c => {
      if (!overlays.has(c)) {
        const ov=document.createElement('div'); ov.className='gb-overlay'; document.body.appendChild(ov); overlays.set(c,ov);
      }
      const ov=overlays.get(c), r=c.getBoundingClientRect();
      ov.style.left=`${r.left}px`; ov.style.top=`${r.top}px`;
      ov.style.width=`${r.width}px`; ov.style.height=`${r.height}px`;
      ov.style.backgroundColor=settings.tint;
      ov.style.mixBlendMode=settings.blend;
      ov.style.opacity=settings.opacity;
      c.style.filter=`hue-rotate(${settings.hue}deg) saturate(${settings.saturate}%) brightness(${settings.bright}%) contrast(${settings.contrast}%)`;
    });
  }

  // Controls
  const el = id => panel.querySelector(id);
  function update(){
    settings.tint=el('#gb-tint').value;
    settings.blend=el('#gb-blend').value;
    settings.opacity=parseInt(el('#gb-opacity').value)/100;
    settings.hue=parseInt(el('#gb-hue').value);
    settings.saturate=parseInt(el('#gb-saturate').value);
    settings.bright=parseInt(el('#gb-bright').value);
    settings.contrast=parseInt(el('#gb-contrast').value);
    settings.applyAll=el('#gb-applyall').checked;
    saveSettings();
    applySettings();
  }
  panel.querySelectorAll('input,select').forEach(e=>e.addEventListener('input',update));

  // Run
  setInterval(applySettings, 1500);
  applySettings();
})();
