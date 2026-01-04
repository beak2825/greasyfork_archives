// ==UserScript==
// @name         GarticPhone - Imagen Guía Overlay
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Overlay con zoom real del lienzo, control de tamaño y edición sin bloquear dibujo. Hecho por CidGG.
// @author       CidGG
// @license      MIT
// @match        https://garticphone.com/*
// @match        https://*.garticphone.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555664/GarticPhone%20-%20Imagen%20Gu%C3%ADa%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/555664/GarticPhone%20-%20Imagen%20Gu%C3%ADa%20Overlay.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("[GP-OVERLAY] Iniciando overlay con zoom real ✅ Hecho por CidGG");

  function waitForBody(cb) {
    if (document.body) return cb();
    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        cb();
      }
    });
    obs.observe(document.documentElement, { childList: true });
  }

  waitForBody(() => {
    // === Contenedor del overlay ===
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      left: '100px',
      top: '100px',
      width: '400px',
      height: '300px',
      zIndex: '999999',
      overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.2)',
      borderRadius: '6px',
      resize: 'both',
      padding: '0',
      pointerEvents: 'none',
      cursor: 'default'
    });
    document.body.appendChild(container);

    // === Imagen dentro ===
    const overlay = document.createElement('img');
    Object.assign(overlay.style, {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      opacity: '0.3',
      pointerEvents: 'none',
      display: 'none',
      userSelect: 'none'
    });
    container.appendChild(overlay);

    // === Marca de agua ===
    const watermark = document.createElement('div');
    watermark.textContent = 'Hecho por CidGG';
    Object.assign(watermark.style, {
      position: 'fixed',
      bottom: '8px',
      right: '12px',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '13px',
      fontWeight: '600',
      textShadow: '0 0 4px rgba(0,0,0,0.7)',
      zIndex: '1000002',
      pointerEvents: 'none',
      userSelect: 'none'
    });
    document.body.appendChild(watermark);

    // === Botón principal ===
    const btn = document.createElement('button');
    btn.textContent = '🖼 Imagen Guía';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: '1000000',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 15px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600'
    });
    document.body.appendChild(btn);

    // === Interfaz flotante ===
    const gui = document.createElement('div');
    Object.assign(gui.style, {
      position: 'fixed',
      right: '10px',
      top: '60px',
      width: '320px',
      background: 'white',
      color: '#111',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(0,0,0,0.2)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      zIndex: '1000001',
      display: 'none'
    });
    gui.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px;">Imagen guía</div>
        <input type="file" id="imgFile" accept="image/*" style="width:100%"><br><br>
        <input type="text" id="imgURL" placeholder="Pegar URL de imagen" style="width:100%;padding:6px;"><br><br>
        Opacidad: <input type="range" id="imgOpacity" min="0" max="1" step="0.01" value="0.3" style="width:100%;"><br><br>

        <div style="font-weight:600;margin-bottom:4px;">Tamaño:</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;">
            <button id="zoomOut" style="flex:1;">➖ Reducir</button>
            <button id="zoomReset" style="flex:1;">🔄 Reset</button>
            <button id="zoomIn" style="flex:1;">➕ Agrandar</button>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button id="applyBtn" style="flex:1;">Aplicar</button>
            <button id="clearBtn" style="flex:1;">Borrar</button>
        </div>
        <div style="margin-top:8px;">
            <button id="editToggle" style="width:100%;background:#f0ad4e;border:none;border-radius:6px;padding:6px;font-weight:600;cursor:pointer;">✋ Activar edición</button>
        </div>
        <div style="font-size:12px;margin-top:6px;color:#555;">Alt+H = Mostrar / Ocultar</div>
        <div style="font-size:11px;color:#888;margin-top:4px;">Hecho por CidGG</div>
    `;
    document.body.appendChild(gui);

    btn.addEventListener('click', () => {
      gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
    });

    const fileInput = gui.querySelector('#imgFile');
    const urlInput = gui.querySelector('#imgURL');
    const opRange = gui.querySelector('#imgOpacity');
    const applyBtn = gui.querySelector('#applyBtn');
    const clearBtn = gui.querySelector('#clearBtn');
    const editBtn = gui.querySelector('#editToggle');

    const zoomInBtn = gui.querySelector('#zoomIn');
    const zoomOutBtn = gui.querySelector('#zoomOut');
    const zoomResetBtn = gui.querySelector('#zoomReset');

    let editMode = false;
    let zoom = 1.0;
    let baseWidth = 400;
    let baseHeight = 300;

    // === Cargar imagen ===
    applyBtn.addEventListener('click', () => {
      const file = fileInput.files && fileInput.files[0];
      const url = urlInput.value.trim();
      overlay.style.opacity = opRange.value;

      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          overlay.src = e.target.result;
          overlay.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else if (url) {
        overlay.src = url;
        overlay.style.display = 'block';
      } else {
        alert('Selecciona un archivo o pega una URL.');
      }
    });

    // === Borrar imagen ===
    clearBtn.addEventListener('click', () => {
      overlay.src = '';
      overlay.style.display = 'none';
      fileInput.value = '';
      urlInput.value = '';
    });

    // === Opacidad ===
    opRange.addEventListener('input', () => overlay.style.opacity = opRange.value);

    // === Zoom real (afecta el contenedor) ===
    function updateZoom() {
      const newWidth = baseWidth * zoom;
      const newHeight = baseHeight * zoom;
      container.style.width = newWidth + 'px';
      container.style.height = newHeight + 'px';
    }

    zoomInBtn.addEventListener('click', () => {
      zoom += 0.1;
      if (zoom > 3) zoom = 3;
      updateZoom();
    });

    zoomOutBtn.addEventListener('click', () => {
      zoom -= 0.1;
      if (zoom < 0.2) zoom = 0.2;
      updateZoom();
    });

    zoomResetBtn.addEventListener('click', () => {
      zoom = 1.0;
      updateZoom();
    });

    // === Activar / Desactivar modo edición ===
    editBtn.addEventListener('click', () => {
      editMode = !editMode;
      if (editMode) {
        container.style.pointerEvents = 'auto';
        container.style.overflow = 'auto';
        container.style.cursor = 'move';
        editBtn.textContent = '🔒 Bloquear edición';
        editBtn.style.background = '#5cb85c';
      } else {
        container.style.pointerEvents = 'none';
        container.style.overflow = 'hidden';
        container.style.cursor = 'default';
        editBtn.textContent = '✋ Activar edición';
        editBtn.style.background = '#f0ad4e';
      }
    });

    // === Mover contenedor ===
    let isDragging = false, startX, startY, startLeft, startTop;

    container.addEventListener('mousedown', (e) => {
      if (!editMode || e.target !== container) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = container.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      container.style.left = startLeft + dx + 'px';
      container.style.top = startTop + dy + 'px';
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    // === Atajo Alt + H ===
    window.addEventListener('keydown', e => {
      if (e.altKey && e.key.toLowerCase() === 'h') {
        const visible = container.style.display !== 'none';
        container.style.display = visible ? 'none' : 'block';
        e.preventDefault();
      }
    });

    console.log("[GP-OVERLAY] Script cargado ✅ Zoom real del lienzo - Hecho por CidGG");
  });
})();
