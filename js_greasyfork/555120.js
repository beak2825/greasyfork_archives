// ==UserScript==
// @name         SSW Style King 👑 (Fundo Inteligente + Auto contraste + Fontes)
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  Personalize fontes, cores e plano de fundo no SSW, com salvamento automático e contraste inteligente no texto principal. Agora com fundo proporcional e nítido! 👑
// @author       Você
// @license MIT
// @match        https://sistema.ssw.inf.br/bin/menu01*
// @match        https://sistema.ssw.inf.br/bin/ssw0017*
// @match        https://sistema.ssw.inf.br/bin/*
// @match        https://sistema.ssw.inf.br/bin/ssw0017*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555120/SSW%20Style%20King%20%F0%9F%91%91%20%28Fundo%20Inteligente%20%2B%20Auto%20contraste%20%2B%20Fontes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555120/SSW%20Style%20King%20%F0%9F%91%91%20%28Fundo%20Inteligente%20%2B%20Auto%20contraste%20%2B%20Fontes%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORE_KEY = 'ssw_style_king_v69';
  const HIDDEN_KEY = 'ssw_panel_hidden_v69';

  const FONTS = [
    { id: 'default', label: 'Padrão do site', css: '' },
    { id: 'arial', label: 'Arial', css: 'Arial, Helvetica, sans-serif' },
    { id: 'arial-bold', label: 'Arial Negrito', css: 'Arial Black, Arial, sans-serif' },
    { id: 'verdana', label: 'Verdana', css: 'Verdana, Geneva, sans-serif' },
    { id: 'tahoma', label: 'Tahoma', css: 'Tahoma, Geneva, sans-serif' },
    { id: 'georgia', label: 'Georgia', css: 'Georgia, serif' },
    { id: 'times', label: 'Times New Roman', css: '"Times New Roman", Times, serif' },
    { id: 'courier', label: 'Courier New', css: '"Courier New", monospace' },
    { id: 'roboto', label: 'Roboto', css: '"Roboto", sans-serif' },
    { id: 'montserrat', label: 'Montserrat', css: '"Montserrat", sans-serif' },
    { id: 'ubuntu', label: 'Ubuntu', css: '"Ubuntu", sans-serif' },
    { id: 'poppins', label: 'Poppins', css: '"Poppins", sans-serif' },
  ];

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins&family=Roboto:wght@400;700&family=Montserrat&family=Ubuntu&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  const style = document.createElement('style');
  document.head.appendChild(style);

  const defaultSettings = {
    font: 'default',
    size: 14,
    colorText: '#ffffff',
    colorInputText: '#000000',
    colorInputBg: '#f8f8f8',
    bg: '',
    bgMode: 'cover',
    darkMode: false,
  };

  // --- funções utilitárias ---
  const luminance = hex => {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  const isLightColor = hex => luminance(hex) > 0.6;

  // --- função que aplica os estilos principais ---
  function applyStyle({ fontCss, size, colorText, colorInputText, colorInputBg, bg, bgMode }) {
    const fontSize = `${size}px`;
    style.textContent = `
      html, body, body * {
        font-family: ${fontCss || 'inherit'} !important;
        font-size: ${fontSize} !important;
        color: ${colorText || '#fff'} !important;
      }
      input, textarea, select {
        color: ${colorInputText || '#000'} !important;
        background-color: ${colorInputBg || '#f8f8f8'} !important;
        border: 1px solid rgba(100,100,100,0.3) !important;
      }
      button, input[type="button"], input[type="submit"] {
        color: ${colorInputText || '#000'} !important;
      }
    `;

    document.body.style.backgroundImage = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundSize = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundAttachment = '';

    if (!bg) return;

    const img = new Image();
    img.onload = function () {
      const nw = img.naturalWidth || 1;
      const nh = img.naturalHeight || 1;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      if (bgMode === 'repeat') {
        document.body.style.backgroundImage = `url("${bg}")`;
        document.body.style.backgroundRepeat = 'repeat';
        document.body.style.backgroundSize = 'auto';
        document.body.style.backgroundPosition = 'center top';
        document.body.style.backgroundAttachment = 'scroll';
        return;
      }

      if (bgMode === 'contain') {
        document.body.style.backgroundImage = `url("${bg}")`;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'contain';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'scroll';
        return;
      }

      // Ajuste de "cover" proporcional para a imagem de fundo
      const scaleFit = Math.min(vw / nw, vh / nh);
      const useScale = Math.min(scaleFit, 1);
      const targetW = Math.round(nw * useScale);
      const targetH = Math.round(nh * useScale);

      document.body.style.backgroundImage = `url("${bg}")`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = `${targetW}px ${targetH}px`;
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundAttachment = 'scroll';
    };

    img.onerror = function () {
      document.body.style.backgroundImage = `url("${bg}")`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'contain';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundAttachment = 'scroll';
    };
    img.src = bg;
  }

  // --- salva e carrega ---
  const saveSettings = s => localStorage.setItem(STORE_KEY, JSON.stringify(s));
  const loadSettings = () => {
    try {
      return Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(STORE_KEY)) || {});
    } catch {
      return { ...defaultSettings };
    }
  };

  // --- Interface ---
  function initUI() {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });

    const css = document.createElement('style');
    css.textContent = `
      :host { all: initial; }
      .bubble {
        position: fixed; bottom: 25px; right: 25px;
        width: 70px; height: 70px; border-radius: 50%;
        background: #000; color: gold; font-size: 30px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transition: transform 0.2s; animation: floaty 3s ease-in-out infinite;
        z-index: 999999;
      }
      .bubble:hover { transform: scale(1.1); }
      @keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-6px);} }

      .panel {
        position: fixed; bottom: 110px; right: 25px;
        background: var(--panel-bg, #fff);
        color: var(--panel-text, #000);
        border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        padding: 16px; width: 300px; font-family: Arial; z-index: 999998;
        transform: scale(0); transform-origin: bottom right; transition: 0.25s;
      }

      .panel.dark {
        --panel-bg: #121212;
        --panel-text: #f1f1f1;
      }

      .title { font-weight: bold; text-align: center; margin-bottom: 10px; font-size: 16px; position: relative; }
      .font-list div {
        padding: 6px 10px; border-radius: 6px; border: 1px solid #444;
        cursor: pointer; background: var(--panel-bg, #fff); margin-bottom: 4px;
        transition: background 0.2s;
      }
      .panel.dark .font-list div { background: #222; border: 1px solid #555; }
      .font-list div:hover { background: #333; color: #fff; }

      .label { font-weight: bold; display: block; margin-top: 8px; }
      input[type="range"], input[type="color"], input[type="text"], select { width: 100%; }
      .preview { text-align:center; margin-top:10px; border-top:1px solid #555; padding-top:5px; }
      .mode-btn { position:absolute; top:0; right:0; background:none; border:none; font-size:18px; cursor:pointer; color:inherit; }
    `;
    shadow.appendChild(css);

    const btn = document.createElement('div');
    btn.className = 'bubble';
    btn.textContent = '👑';
    shadow.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `
      <div class="title">👑 Style King <button class="mode-btn" title="Modo Noturno">🌞</button></div>
      <div class="font-list"></div>

      <span class="label">Tamanho da Fonte</span>
      <input type="range" id="fontSize" min="10" max="26">
      <div id="fontSizeValue">14px</div>

      <span class="label">Cor do Texto (fora dos campos)</span>
      <input type="color" id="colorText">

      <span class="label">Cor do Texto (dentro dos campos)</span>
      <input type="color" id="colorInputText">

      <span class="label">Cor de Fundo dos Campos</span>
      <input type="color" id="colorInputBg">

      <span class="label">Imagem de Fundo</span>
      <input type="text" id="bgInput" placeholder="https://exemplo.com/imagem.jpg">

      <span class="label">Modo de Exibição</span>
      <select id="bgMode">
        <option value="cover">Preencher</option>
        <option value="contain">Centralizar</option>
        <option value="repeat">Repetir</option>
      </select>

      <div class="preview" id="preview">A raposa marrom salta sobre o cão preguiçoso.</div>
    `;
    shadow.appendChild(panel);

    const s = loadSettings();
    const fontList = panel.querySelector('.font-list');
    const fontSize = panel.querySelector('#fontSize');
    const fontValue = panel.querySelector('#fontSizeValue');
    const colorText = panel.querySelector('#colorText');
    const colorInputText = panel.querySelector('#colorInputText');
    const colorInputBg = panel.querySelector('#colorInputBg');
    const bgInput = panel.querySelector('#bgInput');
    const bgMode = panel.querySelector('#bgMode');
    const preview = panel.querySelector('#preview');
    const modeBtn = panel.querySelector('.mode-btn');

    fontSize.value = s.size;
    fontValue.textContent = `${s.size}px`;
    colorText.value = s.colorText;
    colorInputText.value = s.colorInputText;
    colorInputBg.value = s.colorInputBg;
    bgInput.value = s.bg;
    bgMode.value = s.bgMode;

    FONTS.forEach(f => {
      const item = document.createElement('div');
      item.textContent = f.label;
      item.style.fontFamily = f.css || 'inherit';
      item.addEventListener('click', () => {
        s.font = f.id;
        applyStyle({ ...s, fontCss: f.css });
        preview.style.fontFamily = f.css;
        saveSettings(s);
      });
      fontList.appendChild(item);
    });

    const toggleDarkMode = force => {
      s.darkMode = force !== undefined ? force : !s.darkMode;
      panel.classList.toggle('dark', s.darkMode);
      modeBtn.textContent = s.darkMode ? '🌙' : '🌞';
      saveSettings(s);
    };

    const update = () => {
      const f = FONTS.find(x => x.id === s.font);
      applyStyle({ ...s, fontCss: f?.css });
      preview.style.color = s.colorText;
      preview.style.background = s.colorInputBg;
      preview.style.fontSize = `${s.size}px`;
      saveSettings(s);
    };

    fontSize.oninput = e => { s.size = parseInt(e.target.value); fontValue.textContent = `${s.size}px`; update(); };

    colorText.oninput = e => {
      s.colorText = e.target.value;
      if (isLightColor(s.colorText)) toggleDarkMode(true);
      else toggleDarkMode(false);
      update();
    };

    colorInputText.oninput = e => { s.colorInputText = e.target.value; update(); };
    colorInputBg.oninput = e => { s.colorInputBg = e.target.value; update(); };
    bgInput.onchange = e => { s.bg = e.target.value.trim(); update(); };
    bgMode.onchange = e => { s.bgMode = e.target.value; update(); };
    modeBtn.onclick = () => toggleDarkMode();

    btn.onclick = () => {
      const open = panel.style.transform === 'scale(1)';
      panel.style.transform = open ? 'scale(0)' : 'scale(1)';
    };

    if (isLightColor(s.colorText)) toggleDarkMode(true);
    update();
  }

  // --- reload automático na tela de coleta ---
  if (window.location.href.includes('ssw0017')) {
    const applied = localStorage.getItem('ssw_style_applied_once');
    if (!applied) {
      localStorage.setItem('ssw_style_applied_once', '1');
      location.reload();
    }
  }

  window.addEventListener('load', initUI);
})();