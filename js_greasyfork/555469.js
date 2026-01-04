// ==UserScript==
// @name         Battery Pro iOS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Muestra el porcentaje de batería en cualquier ventana con un estilo Apple. Toggle: Ctrl+Shift+B. Arrastrable y recuerda posición.
// @author       ZacheryMar
// @match        *://*/*
// @icon         data:image/jpeg;base64,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
// @grant        none
// @run-at       document-idle
// @license      CC BY-ND 4.0
// @license      No distribute or Modification Allowed
// @description  This script is © 2025 ZacheryMar 
// @description  Iy is not allowed to copy, modify, or redistribute this script in any form.
// @downloadURL https://update.greasyfork.org/scripts/555469/Battery%20Pro%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/555469/Battery%20Pro%20iOS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (!('getBattery' in navigator)) return;

  const css = `
#battery-overlay-appleish {
  position: fixed;
  left: 20px;          /* Alineado hacia la izquierda */
  top: 8%;             /* Cerca del borde superior */
  z-index: 2147483647;
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,250,250,0.88));
  color: #0b0b0b;
  padding: 14px 18px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.30);
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  user-select: none;
  min-width: 220px;
  max-width: 420px;
  backdrop-filter: blur(8px) saturate(1.05);
  cursor: grab;
}
#battery-overlay-appleish:active { cursor: grabbing; }
.batt-left {
  display:flex;
  align-items:center;
  gap:12px;
}
.batt-shell {
  width: 56px;
  height: 28px;
  border-radius: 6px;
  border: 2px solid rgba(0,0,0,0.12);
  position: relative;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(245,245,245,0.6));
  overflow: hidden;
}
.batt-shell::after {
  content: "";
  position: absolute;
  right: -6px;
  top: 7px;
  width: 6px;
  height: 14px;
  border-radius: 2px;
  background: rgba(0,0,0,0.12);
}
.batt-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(90deg, #4cd964, #32d74b);
  transition: width 300ms ease, background 300ms ease;
  box-shadow: inset 0 -6px 12px rgba(0,0,0,0.06);
}
.batt-text {
  display:flex;
  flex-direction: column;
  gap:2px;
}
.batt-percent {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.4px;
}
.batt-sub {
  font-size: 12px;
  color: rgba(0,0,0,0.55);
}
.batt-charge {
  width: 34px;
  height: 34px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius: 8px;
  background: rgba(0,0,0,0.06);
}
.batt-charge svg { width:18px; height:18px; display:block; }
.batt-hidden { display:none !important; }
@media (max-width:400px){
  #battery-overlay-appleish{
    left: 10px;
    top: 6%;
    min-width: 180px;
  }
}
`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'battery-overlay-appleish';
  overlay.innerHTML = `
    <div class="batt-left">
      <div class="batt-shell" aria-hidden="true">
        <div class="batt-fill" style="width:50%"></div>
      </div>
      <div class="batt-text">
        <div class="batt-percent">--%</div>
        <div class="batt-sub">Estado: --</div>
      </div>
    </div>
    <div class="batt-charge" title="Clic para ocultar/mostrar">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z" fill="#000" opacity="0.9"/>
      </svg>
    </div>
  `;
  document.body.appendChild(overlay);

  const fill = overlay.querySelector('.batt-fill');
  const percentEl = overlay.querySelector('.batt-percent');
  const subEl = overlay.querySelector('.batt-sub');
  const chargeBtn = overlay.querySelector('.batt-charge');

  let visible = true;
  function setVisible(v) {
    visible = !!v;
    overlay.style.display = visible ? 'flex' : 'none';
    localStorage.setItem('battery_overlay_visible', visible ? '1' : '0');
  }

  if (localStorage.getItem('battery_overlay_visible') === '0') setVisible(false);
  chargeBtn.addEventListener('click', () => setVisible(!visible));

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyB') {
      e.preventDefault();
      setVisible(!visible);
    }
  });

  let dragging = false, startX=0, startY=0, origLeft=0, origTop=0;
  function getSavedPos() {
    try { return JSON.parse(localStorage.getItem('battery_overlay_pos') || 'null'); } catch { return null; }
  }
  function savePos(x,y) { localStorage.setItem('battery_overlay_pos', JSON.stringify([x,y])); }
  const saved = getSavedPos();
  if (saved && Array.isArray(saved)) {
    overlay.style.left = saved[0] + 'px';
    overlay.style.top = saved[1] + 'px';
  }

  overlay.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    dragging = true;
    startX = ev.clientX; startY = ev.clientY;
    const rect = overlay.getBoundingClientRect();
    origLeft = rect.left; origTop = rect.top;
    overlay.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  });

  window.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const newLeft = Math.max(8, origLeft + dx);
    const newTop = Math.max(8, origTop + dy);
    overlay.style.left = newLeft + 'px';
    overlay.style.top = newTop + 'px';
  });

  window.addEventListener('pointerup', (ev) => {
    if (!dragging) return;
    dragging = false;
    overlay.releasePointerCapture(ev.pointerId);
    const rect = overlay.getBoundingClientRect();
    savePos(rect.left, rect.top);
  });

  function formatTime(minutes) {
    if (!isFinite(minutes) || minutes <= 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return (h ? h + 'h ' : '') + m + 'm';
  }

  navigator.getBattery().then(function(battery) {
    function update() {
      const pct = Math.round(battery.level * 100);
      percentEl.textContent = pct + '%';
      fill.style.width = pct + '%';

      if (battery.charging) {
        fill.style.background = 'linear-gradient(90deg, #0a84ff, #32d74b)';
      } else if (pct <= 10) {
        fill.style.background = 'linear-gradient(90deg, #ff3b30, #ff6b6b)';
      } else if (pct <= 30) {
        fill.style.background = 'linear-gradient(90deg, #ff9f0a, #ffcc66)';
      } else {
        fill.style.background = 'linear-gradient(90deg, #4cd964, #32d74b)';
      }

      const state = battery.charging
        ? 'Cargando • ' + (battery.chargingTime && battery.chargingTime !== Infinity ? formatTime(battery.chargingTime/60) : '—')
        : 'Descargando • ' + (battery.dischargingTime && battery.dischargingTime !== Infinity ? formatTime(battery.dischargingTime/60) : '—');
      subEl.textContent = state;

      overlay.animate([{ transform: 'translateY(-2px)' }, { transform: 'translateY(0)' }], { duration: 220, easing: 'ease-out' });
    }

    battery.addEventListener('levelchange', update);
    battery.addEventListener('chargingchange', update);
    battery.addEventListener('chargingtimechange', update);
    battery.addEventListener('dischargingtimechange', update);
    update();
  }).catch(() => {
    overlay.classList.add('batt-hidden');
  });

})();
