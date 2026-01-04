// ==UserScript==
// @name         YouTube Music Volume Booster (Gain x3)
// @namespace    https://juan-copilot.example
// @version      1.0.0
// @description  Aumenta el volumen de YouTube Music usando WebAudio con control de ganancia hasta 3x.
// @author       Juan
// @match        https://music.youtube.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556723/YouTube%20Music%20Volume%20Booster%20%28Gain%20x3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556723/YouTube%20Music%20Volume%20Booster%20%28Gain%20x3%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configuración
  const MAX_GAIN = 3.0;              // máximo 3x
  const DEFAULT_GAIN = 1.4;          // valor inicial razonable
  const STORE_KEY = 'ytm_gain_booster_v1';

  // Estado global único
  let audioContext = null;
  let gainNode = null;
  let sourceNode = null;
  let connectedMedia = null;
  let ui = null;

  // Utilidad: leer/escribir localStorage
  function getSavedGain() {
    const v = parseFloat(localStorage.getItem(STORE_KEY));
    return Number.isFinite(v) ? Math.min(Math.max(v, 1.0), MAX_GAIN) : DEFAULT_GAIN;
  }
  function saveGain(v) {
    localStorage.setItem(STORE_KEY, String(v));
  }

  // Crear o conectar WebAudio al elemento de medios
  function connectMediaElement(media) {
    if (!media) return;

    // Evitar reconectar al mismo elemento
    if (connectedMedia === media && sourceNode) return;

    // Crear/reusar AudioContext
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // iOS/Chrome requiere reanudar tras interacción
    audioContext.resume().catch(() => { /* noop */ });

    // Limpiar conexiones previas
    try { if (sourceNode) sourceNode.disconnect(); } catch (e) {}
    try { if (gainNode) gainNode.disconnect(); } catch (e) {}

    // Crear nodos
    gainNode = audioContext.createGain();
    gainNode.gain.value = getSavedGain();

    // Crear MediaElementSource (una sola vez por elemento)
    sourceNode = audioContext.createMediaElementSource(media);
    sourceNode.connect(gainNode).connect(audioContext.destination);

    connectedMedia = media;
  }

  // Buscar el elemento <video> o <audio> de YTM
  function findMediaElement() {
    // YT Music usa <video> con solo audio en la mayoría de casos
    return document.querySelector('video') || document.querySelector('audio');
  }

  // Observa cambios en el DOM porque YTM es SPA
  function observeForMedia() {
    const tryConnect = () => {
      const media = findMediaElement();
      if (media) {
        connectMediaElement(media);
      }
    };
    // Intento inicial y reintentos
    tryConnect();
    const mo = new MutationObserver(tryConnect);
    mo.observe(document.documentElement, { childList: true, subtree: true });
    // También reconectar cuando cambia de canción
    window.addEventListener('yt-page-data-updated', tryConnect);
  }

  // UI flotante
  function createUI() {
    if (ui) return;
    ui = document.createElement('div');
    ui.style.position = 'fixed';
    ui.style.right = '12px';
    ui.style.bottom = '12px';
    ui.style.zIndex = '999999';
    ui.style.background = 'rgba(28,28,28,0.85)';
    ui.style.color = '#fff';
    ui.style.backdropFilter = 'blur(6px)';
    ui.style.border = '1px solid rgba(255,255,255,0.18)';
    ui.style.borderRadius = '10px';
    ui.style.padding = '10px 12px';
    ui.style.boxShadow = '0 6px 24px rgba(0,0,0,0.3)';
    ui.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif';
    ui.style.fontSize = '13px';

    const title = document.createElement('div');
    title.textContent = 'YTM Gain';
    title.style.fontWeight = '600';
    title.style.marginBottom = '6px';

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';

    const label = document.createElement('span');
    label.textContent = 'Gain';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1.0';
    slider.max = String(MAX_GAIN);
    slider.step = '0.05';
    slider.value = String(getSavedGain());
    slider.style.width = '140px';

    const value = document.createElement('span');
    value.textContent = `${Number(slider.value).toFixed(2)}x`;
    value.style.minWidth = '44px';
    value.style.textAlign = 'right';

    const toggle = document.createElement('button');
    toggle.textContent = 'On';
    toggle.style.cursor = 'pointer';
    toggle.style.padding = '4px 8px';
    toggle.style.borderRadius = '8px';
    toggle.style.border = 'none';
    toggle.style.background = '#1db954';
    toggle.style.color = '#fff';
    toggle.style.fontWeight = '600';

    let enabled = true;

    slider.addEventListener('input', () => {
      const g = Number(slider.value);
      value.textContent = `${g.toFixed(2)}x`;
      saveGain(g);
      if (gainNode) gainNode.gain.value = g;
    });

    toggle.addEventListener('click', () => {
      enabled = !enabled;
      toggle.textContent = enabled ? 'On' : 'Off';
      toggle.style.background = enabled ? '#1db954' : '#888';
      if (gainNode) gainNode.gain.value = enabled ? getSavedGain() : 1.0; // 1.0 = sin boost
    });

    // Arrastrable
    let drag = null;
    ui.addEventListener('mousedown', (e) => {
      if (e.target === slider) return; // no molestar el deslizador
      drag = { x: e.clientX, y: e.clientY, right: parseInt(ui.style.right), bottom: parseInt(ui.style.bottom) };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
    function onMove(e) {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      ui.style.right = `${Math.max(0, drag.right - dx)}px`;
      ui.style.bottom = `${Math.max(0, drag.bottom - dy)}px`;
    }
    function onUp() {
      drag = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(value);
    row.appendChild(toggle);

    ui.appendChild(title);
    ui.appendChild(row);
    document.body.appendChild(ui);
  }

  // Inicialización
  function init() {
    observeForMedia();
    createUI();
    // Resume contexto tras cualquier click
    window.addEventListener('click', () => {
      if (audioContext && audioContext.state !== 'running') {
        audioContext.resume().catch(() => {});
      }
    }, { once: false, capture: true });
  }

  // Ejecutar
  init();

})();
