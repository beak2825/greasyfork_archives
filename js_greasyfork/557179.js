// ==UserScript==
// @name         JanitorAI - Live2D Avatars for Characters (with TTS Lip-Sync)
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @license      MIT
// @description  Loads Live2D models with TTS lip-sync in JanitorAI chats. Click to interact, drag to reposition, and customize emotions and motions via the settings menu.
// @author       Zephyr (xzeph__ on Discord)
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557179/JanitorAI%20-%20Live2D%20Avatars%20for%20Characters%20%28with%20TTS%20Lip-Sync%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557179/JanitorAI%20-%20Live2D%20Avatars%20for%20Characters%20%28with%20TTS%20Lip-Sync%29.meta.js
// ==/UserScript==

/* ==========================================================
   SECCIÓN 1. CONFIGURACIÓN (flags y opciones de filtros)
   ----------------------------------------------------------
   - 'Functions' agrupa switches de comportamiento del modelo,
     interacción y filtros visuales opcionales (PIXI Filters).
   ========================================================== */
const Functions = {
  enabled: true,           // Habilitar/deshabilitar toda la funcionalidad de Live2D
  followCursor: true,      // El modelo sigue el cursor si está activo
  draggable: true,         // Habilitar arrastre del contenedor del modelo
  enableTapping: true,     // Habilitar hitTest para interacciones por toque/clic
  showFrames: false,       // Fondo del canvas con alpha 0.25 si true (debug)
  lipsyncOnly: false,      // Si true, solo se realiza lipsync sin motion (usa model.speak())
  filters: {
    outline: false,        // Ej.: new PIXI.filters.OutlineFilter(2, 0x0000ff)
    pixelate: false,       // Ej.: new PIXI.filters.PixelateFilter(5)
    crt: false,            // Ej.: new PIXI.filters.CRTFilter({...})
    noise: false,          // Ej.: new PIXI.filters.NoiseFilter(0.1)
    alpha: false,          // Ej.: new PIXI.filters.AlphaFilter(0.8)
  },
  filterParams: {
    outline: {
      thickness: 2,
      color: '#0000ff'
    },
    pixelate: {
      size: 5
    },
    crt: {
      curvature: 3,
      lineWidth: 3,
      lineContrast: 0.2,
      vignetting: 0.3,
      vignettingAlpha: 0.8,
      noise: 0.1
    },
    noise: {
      noise: 0.2
    },
    alpha: {
      alpha: 0.8
    }
  },
};

/* ==========================================================
   SECCIÓN 2. LISTA DE EMOCIONES (para mapeo Emoción→Motion)
   ========================================================== */
const EMOTION_LIST = [
  "Admiration","Amusement","Anger","Annoyance","Approval","Caring","Confusion",
  "Curiosity","Desire","Disappointment","Disapproval","Disgust","Embarrassment",
  "Excitement","Fear","Gratitude","Joy","Love","Nervousness","Neutral",
  "Optimism","Pride","Realization","Relief","Remorse","Sadness","Surprise"
];

/* ==========================================================
   SECCIÓN 3. ESTADO GLOBAL Y COLAS
   ----------------------------------------------------------
   - 'allMotions': se carga desde el modelo (settings.motions)
   - 'allExpressions': array de expressions del modelo activo
   - 'actionMapping': mapeo Action→{motion, expression}
   - 'priorityList': orden de prioridad para resolver motion/expression
   - 'live2dModel': referencia al modelo cargado
   - 'modelsList': lista de modelos disponibles con sus URLs
   - NOTA: emotionMapping se guarda DIRECTAMENTE en cada modelo (model.emotionMapping)
   ========================================================== */
let allMotions = {};
let allExpressions = [];
// ELIMINADO: let emotionMapping = {}; - Ahora cada modelo tiene su propio emotionMapping
let live2dModel = null;
let modelsList = [
  {
    id: 1,
    name: "Shizuku",
    url: "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json",
    enabled: true,
    emotionMapping: {}, // Mapeo de emoción -> {motion, expression}
    actionMapping: [],  // Array de {id, description, motion, expression}
    priorityList: [     // Orden de prioridad para resolver motion/expression
      {priority: 4, type: "action", target: "motion", label: "Action Motions"},
      {priority: 3, type: "emotion", target: "expression", label: "Emotion Expressions"},
      {priority: 2, type: "emotion", target: "motion", label: "Emotion Motions"},
      {priority: 1, type: "action", target: "expression", label: "Action Expressions"}
    ],
    disableSettings: {  // Configuración de desactivación de motions/expressions
      emotionMotions: false,
      emotionExpressions: false,
      actionMotions: false,
      actionExpressions: false
    },
    settings: {
      scale: 0.7,
      canvasWidth: 900,
      canvasHeight: 900,
      positionX: 50, // Porcentaje (0-100)
      positionY: 50, // Porcentaje (0-100)
      anchorX: 0.5,
      anchorY: 0.5
    }
  }
];

/* ==========================================================
   SECCIÓN 4. CONSTANTES DE UI/DOM Y CSS
   ----------------------------------------------------------
   - IDs/Selectores únicos del contenedor y canvas del modelo
   - CSS mínimo inyectado para posicionar y estilizar elementos
   ========================================================== */
const CONTAINER_ID = "unique-live2d-container";
const CANVAS_ID = "unique-live2d-canvas";
const DRAG_BTN_ID = "unique-live2d-drag-btn";
const MOTION_DROPDOWN_CONTAINER_ID = "motion-dropdown-container";
const MOTION_SELECT_ID = "motion-select";

// Selectores del menú de JanitorAI para inyectar un botón “Live2D”
const MENU_LIST_SELECTOR = '[class^="_menuList_"]';
const MENU_ITEM_CLASS = '[class^="_menuItem_"]';
const LIVE2D_BUTTON_ID = 'live2d-menu-item';

// CSS mínimo para contenedor, canvas y botón de arrastre
const MINIMAL_CSS = `
  #${CONTAINER_ID} {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 9998;
    pointer-events: auto;
    user-select: none;
    background: transparent !important;
    width: fit-content;
    height: fit-content;
  }
  #${CONTAINER_ID}.dragging { /* Estilo opcional durante el arrastre */ }
  #${CANVAS_ID} { display: block; }

  #${DRAG_BTN_ID} {
    position: fixed;
    border-radius: 50%;
    background: linear-gradient(to bottom, rgba(176,196,222,0.8), rgba(255,255,255,0.5));
    color: rgba(255,255,255,0.9) !important;
    box-shadow: 0 0 5px rgba(176,196,222,0.8);
    transition: box-shadow 0.3s ease-in-out, opacity 0.4s ease;
    border: none;
    width: 40px; height: 40px; padding: 0; margin: 2px 0;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    z-index: 9998;
    opacity: 1; pointer-events: auto;
  }
  #${DRAG_BTN_ID}:hover { box-shadow: 0 0 10px rgba(176,196,222,1); }

  #${MOTION_DROPDOWN_CONTAINER_ID} {
    position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    background-color: rgba(44,62,80,0.8);
    padding: 15px; border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
    color: #ecf0f1;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  #${MOTION_SELECT_ID} {
    padding: 8px 12px; border-radius: 5px;
    border: 1px solid #34495e; background-color: #34495e;
    color: #ecf0f1; font-size: 16px; cursor: pointer; outline: none;
    max-width: 300px;
  }
  #${MOTION_SELECT_ID}:focus { border-color: #3498db; box-shadow: 0 0 0 2px rgba(52,152,219,0.5); }
  #${MOTION_SELECT_ID} option { background-color: #34495e; color: #ecf0f1; }
`;

/* ==========================================================
   SECCIÓN 5. UTILIDADES (inyección de estilos y carga de libs)
   ========================================================== */
function addStyle(css) {
  const node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  document.head.appendChild(node);
}

const loadScript = (src) => new Promise((resolve, reject) => {
  const script = document.createElement("script");
  script.src = src;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

// Carga de librerías externas requeridas (orden específico)
async function loadLibs() {
  await loadScript("https://cdn.jsdelivr.net/npm/greensock@1.20.2/dist/TweenLite.js");
  await loadScript("https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js");
  await loadScript("https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/pixi.js@7.4.2/dist/pixi.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/pixi-live2d-display-lipsyncpatch@0.5.0-ls-8/dist/index.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/pixi-filters@latest/dist/browser/pixi-filters.min.js");
}

/* ==========================================================
   SECCIÓN 6. UI: MENÚ DE AJUSTES Live2D EN JANITORAI
   ----------------------------------------------------------
   - Inyecta un botón "Live2D" en el menú de la app
   - Abre modal con switches globales y mapeo Emoción→Motion
   - Persiste ajustes en localStorage
   ========================================================== */
function injectLive2DMenuItem() {
  const menuList = document.querySelector(MENU_LIST_SELECTOR);
  if (!menuList) return;
  if (menuList.querySelector(`#${LIVE2D_BUTTON_ID}`)) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  const firstMenuItem = menuList.querySelector(MENU_ITEM_CLASS);
  btn.className = firstMenuItem ? firstMenuItem.className : '';
  btn.id = LIVE2D_BUTTON_ID;
  btn.innerHTML = `
    <span class="_menuItemIcon_1fzcr_81">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-circle-user-round-icon">
        <path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/>
        <circle cx="12" cy="12" r="10"/></svg>
    </span>
    <span class="_menuItemContent_1fzcr_96">Live2D</span>
  `;

  btn.addEventListener('click', function () {
    // Sección/Modal de ajustes Live2D - Glassmorphism Style
    const LIVE2D_MENU_CSS = `
      /* === GLASSMORPHISM BASE VARIABLES === */
      :root {
        /* Dark neutral glass base with a very subtle blue hint */
        --glass-bg: rgba(18, 18, 22, 0.78);
        --glass-bg-light: rgba(30, 30, 36, 0.7);
        --glass-border: rgba(255, 255, 255, 0.08);
        --glass-border-hover: rgba(176, 196, 222, 0.4);
        --accent-primary: rgba(176, 196, 222, 0.9);
        --accent-gradient: linear-gradient(135deg, rgba(176, 196, 222, 0.9), rgba(147, 197, 253, 0.8));
        --accent-glow: 0 0 15px rgba(176, 196, 222, 0.4);
        --accent-glow-strong: 0 0 20px rgba(176, 196, 222, 0.6), 0 0 40px rgba(176, 196, 222, 0.2);
        --text-primary: rgba(255, 255, 255, 0.95);
        --text-secondary: rgba(200, 200, 220, 0.8);
        --text-muted: rgba(160, 160, 180, 0.7);
        --blur-amount: 12px;
        --radius-sm: 8px;
        --radius-md: 15px;
        --radius-lg: 20px;
      }

      /* === MODAL OVERLAY === */
      .live2d-modal-overlay {
        position: fixed; z-index: 9999; inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

      /* === MODAL CONTAINER === */
      .live2d-modal-container {
        background: var(--glass-bg);
        backdrop-filter: blur(var(--blur-amount));
        -webkit-backdrop-filter: blur(var(--blur-amount));
        border-radius: var(--radius-lg);
        border: 1px solid var(--glass-border);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        min-width: 480px; max-width: 95vw; min-height: 320px; max-height: 90vh; padding: 0;
        display: flex; flex-direction: column; font-family: 'Segoe UI', system-ui, sans-serif;
        animation: slideUp 0.3s ease-out;
      }

      /* === HEADER === */
      .live2d-modal-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 20px 28px 16px 28px;
        border-bottom: 1px solid var(--glass-border);
      }
      .live2d-modal-title {
        font-size: 1.35rem; font-weight: 600;
        background: linear-gradient(135deg, #fff 0%, rgba(176, 196, 222, 1) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; margin: 0;
        text-shadow: 0 0 30px rgba(176, 196, 222, 0.3);
      }
      .live2d-modal-close {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
        font-size: 1.2rem; cursor: pointer;
        padding: 8px; border-radius: var(--radius-sm);
        transition: all 0.2s ease;
      }
      .live2d-modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
        box-shadow: var(--accent-glow);
      }

      /* === BODY === */
      .live2d-modal-body {
        padding: 24px 28px; display: flex; flex-direction: column; gap: 18px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(176, 196, 222, 0.3) transparent;
      }
      .live2d-modal-body::-webkit-scrollbar { width: 6px; }
      .live2d-modal-body::-webkit-scrollbar-track { background: transparent; }
      .live2d-modal-body::-webkit-scrollbar-thumb { background: rgba(176, 196, 222, 0.3); border-radius: 3px; }
      .live2d-modal-body::-webkit-scrollbar-thumb:hover { background: rgba(176, 196, 222, 0.5); }

      /* === CHECKBOXES === */
      .live2d-checkbox-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
      .live2d-checkbox-row {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 14px;
        /* Match Emotion Mapping row glass background */
        background: rgba(255, 255, 255, 0.02);
        border-radius: var(--radius-sm);
        border: 1px solid transparent;
        transition: all 0.2s ease;
      }
      .live2d-checkbox-row:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--glass-border);
      }
      .live2d-checkbox-row label { color: var(--text-secondary); font-size: 0.95rem; cursor: pointer; }
      .live2d-checkbox-row input[type="checkbox"] {
        appearance: none; -webkit-appearance: none;
        width: 20px; height: 20px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(176, 196, 222, 0.3);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
      }
      .live2d-checkbox-row input[type="checkbox"]:checked {
        background: var(--accent-gradient);
        border-color: transparent;
        box-shadow: var(--accent-glow);
      }
      .live2d-checkbox-row input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        color: #1a1a2e;
        font-size: 12px;
        font-weight: bold;
      }

      /* === DROPDOWNS === */
      .live2d-dropdown-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
      .live2d-dropdown-label {
        color: var(--text-secondary); font-size: 0.9rem;
        font-weight: 500; margin-bottom: 2px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .live2d-dropdown {
        padding: 10px 14px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary); font-size: 0.95rem;
        min-width: 120px; margin-bottom: 2px;
        cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(4px);
      }
      .live2d-dropdown:hover, .live2d-dropdown:focus {
        border-color: var(--glass-border-hover);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-dropdown option { background: #1e1f28; color: var(--text-primary); }
      #live2d-section-select { background: rgb(255 255 255 / 2%); }

      /* === SECTIONS === */
      .live2d-section { display: none; }
      .live2d-section.active { display: flex; flex-direction: column; gap: 18px; }

      /* === EMOTION MAPPING === */
      .live2d-motion-mapping-row {
        display: grid; grid-template-columns: 150px 1fr 1fr;
        align-items: center; gap: 12px; color: var(--text-primary);
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.01);
        border-radius: var(--radius-sm);
        margin-bottom: 4px;
        transition: all 0.2s ease;
      }
      .live2d-motion-mapping-row:hover { background: rgba(255, 255, 255, 0.05); }
      .live2d-motion-mapping-row label { font-weight: 500; color: var(--text-secondary); }
      .live2d-motion-mapping-row select {
        width: 100%; padding: 8px 12px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        transition: all 0.2s ease;
      }
      .live2d-motion-mapping-row select:hover, .live2d-motion-mapping-row select:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-emotion-mapping-header {
        display: grid; grid-template-columns: 150px 1fr 1fr; gap: 12px;
        color: var(--text-muted); font-size: 0.8rem; font-weight: 600;
        margin-bottom: 12px; text-align: center;
        text-transform: uppercase; letter-spacing: 0.5px;
        padding: 0 12px;
      }

      /* === FOOTER === */
      .live2d-modal-footer {
        display: flex; justify-content: flex-end; gap: 12px;
        padding: 18px 28px;
        border-top: 1px solid var(--glass-border);
        background: transparent;
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      }

      /* === BUTTONS === */
      .live2d-modal-btn {
        padding: 10px 28px; border-radius: var(--radius-sm); border: none;
        font-size: 0.95rem; font-weight: 600; cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .live2d-modal-btn.cancel {
        background: transparent;
        border: 1px solid var(--glass-border);
        color: var(--text-secondary);
      }
      .live2d-modal-btn.save {
        background: var(--accent-gradient);
        color: #1a1a2e;
        box-shadow: var(--accent-glow);
      }
      .live2d-modal-btn.cancel:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
      }
      .live2d-modal-btn.save:hover {
        box-shadow: var(--accent-glow-strong);
        transform: translateY(-1px);
      }

      /* === CARDS (Filter, Setting, Motion Test) === */
      .live2d-filter-card, .live2d-setting-card, .live2d-motion-test-group {
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(8px);
        border-radius: var(--radius-md);
        padding: 18px; margin-bottom: 12px;
        border: 1px solid var(--glass-border);
        transition: all 0.2s ease;
      }
      .live2d-filter-card:hover, .live2d-setting-card:hover, .live2d-motion-test-group:hover {
        border-color: var(--glass-border-hover);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      }
      .live2d-filter-header, .live2d-motion-test-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 14px; padding-bottom: 10px;
        border-bottom: 1px solid var(--glass-border);
      }
      .live2d-filter-title {
        font-size: 1rem; font-weight: 600;
        background: linear-gradient(135deg, #fff 0%, rgba(176, 196, 222, 1) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; margin: 0;
      }
      .live2d-filter-reset {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-muted);
        border: 1px solid var(--glass-border);
        padding: 6px 14px; border-radius: var(--radius-sm);
        cursor: pointer; font-size: 0.8rem;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .live2d-filter-reset:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
      }
      .live2d-filter-body { display: flex; flex-direction: column; gap: 14px; }
      .live2d-filter-param { display: flex; flex-direction: column; gap: 8px; }
      .live2d-filter-param-header { display: flex; justify-content: space-between; align-items: center; }
      .live2d-filter-param label { color: var(--text-secondary); font-size: 0.9rem; }

      /* === SLIDERS === */
      .live2d-filter-param input[type="range"], .live2d-setting-slider {
        width: 100%; height: 6px;
        background: linear-gradient(90deg, rgba(176, 196, 222, 0.2), rgba(176, 196, 222, 0.1));
        border-radius: 3px; outline: none; -webkit-appearance: none;
        cursor: pointer;
      }
      .live2d-filter-param input[type="range"]::-webkit-slider-thumb,
      .live2d-setting-slider::-webkit-slider-thumb {
        -webkit-appearance: none; appearance: none;
        width: 18px; height: 18px;
        background: var(--accent-gradient);
        cursor: pointer; border-radius: 50%;
        box-shadow: var(--accent-glow);
        transition: all 0.2s ease;
      }
      .live2d-filter-param input[type="range"]::-webkit-slider-thumb:hover,
      .live2d-setting-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: var(--accent-glow-strong);
      }
      .live2d-filter-param input[type="range"]::-moz-range-thumb,
      .live2d-setting-slider::-moz-range-thumb {
        width: 18px; height: 18px;
        background: var(--accent-gradient);
        cursor: pointer; border-radius: 50%; border: none;
        box-shadow: var(--accent-glow);
      }
      .live2d-filter-param input[type="number"], .live2d-filter-param input[type="color"] {
        padding: 8px 10px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        transition: all 0.2s ease;
      }
      .live2d-filter-param input[type="number"]:focus, .live2d-filter-param input[type="color"]:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-filter-value, .live2d-setting-value {
        color: var(--accent-primary); font-size: 0.85rem;
        font-family: 'JetBrains Mono', monospace;
        min-width: 50px; text-align: right;
        font-weight: 500;
      }

      /* === COLOR PICKER === */
      .live2d-color-picker-container { display: flex; gap: 10px; align-items: center; }
      .live2d-color-picker-container input[type="color"] {
        width: 50px; height: 36px; cursor: pointer;
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        background: transparent;
        padding: 2px;
      }
      .live2d-color-picker-container input[type="text"] {
        flex: 1; padding: 8px 12px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace;
      }

      /* === MODELS TABLE === */
      .live2d-models-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
      #live2d-models-tbody { background: rgba(255, 255, 255, 0.01); }
      .live2d-models-table th {
        background: transparent;
        color: var(--text-muted);
        padding: 12px 12px; text-align: left;
        font-weight: 600; font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .live2d-models-table td {
        padding: 14px 12px;
        background: rgba(255, 255, 255, 0.03);
        vertical-align: middle;
      }
      .live2d-models-table tr td:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
      .live2d-models-table tr td:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
      .live2d-models-table tr:hover td { background: rgba(255, 255, 255, 0.06); }
      .live2d-model-name { color: var(--text-primary); font-weight: 500; min-width: 150px; }
      .live2d-model-url { width: 100%; }
      .live2d-model-url textarea {
        width: 100%; min-height: 60px; padding: 10px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;
        resize: vertical;
        transition: all 0.2s ease;
      }
      .live2d-model-url textarea:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-model-actions {
        text-align: center; min-width: 130px;
        display: flex; flex-direction: column;
        align-items: center; gap: 8px;
      }

      /* === MODEL BUTTONS === */
      .live2d-model-enable-btn {
        width: 100%; max-width: 130px;
        padding: 8px 16px; border-radius: var(--radius-sm);
        border: 1px solid transparent; cursor: pointer;
        font-size: 0.8rem; font-weight: 600;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .live2d-model-enable-btn.enabled {
        background: var(--accent-gradient);
        color: #1a1a2e;
        box-shadow: var(--accent-glow);
      }
      .live2d-model-enable-btn.disabled {
        background: rgba(255, 255, 255, 0.05);
        border-color: var(--glass-border);
        color: var(--text-muted);
      }
      .live2d-model-enable-btn.disabled:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
      }
      .live2d-add-model-btn, .live2d-add-action-btn {
        width: 100%; padding: 12px; border-radius: var(--radius-sm);
        border: 1px dashed var(--glass-border);
        background: rgba(255, 255, 255, 0.02);
        color: var(--text-muted); cursor: pointer;
        font-size: 0.9rem; transition: all 0.2s ease; margin-top: 12px;
      }
      .live2d-add-model-btn:hover, .live2d-add-action-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-color: var(--accent-primary);
        box-shadow: var(--accent-glow);
      }
      .live2d-delete-model-btn {
        width: 100%; max-width: 130px;
        padding: 8px 16px; border-radius: var(--radius-sm);
        border: 1px solid rgba(248, 113, 113, 0.5);
        background: rgba(127, 29, 29, 0.25);
        color: rgba(254, 226, 226, 0.9); cursor: pointer;
        font-size: 0.8rem; margin-left: 0;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .live2d-delete-model-btn:hover {
        background: rgba(220, 38, 38, 0.55);
        border-color: rgba(248, 113, 113, 0.9);
        color: #fff;
        box-shadow: 0 0 12px rgba(248, 113, 113, 0.6);
      }
      .live2d-reload-model-btn {
        width: 100%; padding: 12px; border-radius: var(--radius-sm);
        border: none;
        background: var(--accent-gradient);
        color: #1a1a2e; cursor: pointer;
        font-size: 1rem; font-weight: 600;
        transition: all 0.2s ease; margin-top: 16px;
        box-shadow: var(--accent-glow);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .live2d-reload-model-btn:hover {
        box-shadow: var(--accent-glow-strong);
        transform: translateY(-2px);
      }

      /* === SETTINGS === */
      .live2d-setting-header {
        font-size: 1rem; font-weight: 600; margin-bottom: 14px;
        padding-bottom: 10px; border-bottom: 1px solid var(--glass-border);
        background: linear-gradient(135deg, #fff 0%, rgba(176, 196, 222, 1) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .live2d-setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
      .live2d-setting-label { color: var(--text-secondary); font-size: 0.9rem; }
      .live2d-setting-input {
        width: 100px; padding: 8px 12px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary); font-size: 0.9rem; text-align: center;
        transition: all 0.2s ease;
      }
      .live2d-setting-input:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-setting-slider-container { display: flex; align-items: center; gap: 12px; flex: 1; margin-left: 20px; }
      .live2d-reset-settings-btn {
        width: 100%; padding: 10px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-muted); cursor: pointer;
        font-size: 0.85rem; transition: all 0.2s ease; margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      .live2d-reset-settings-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
      }

      /* === MOTION TEST === */
      .live2d-motion-test-header {
        color: var(--text-primary); font-size: 1rem; font-weight: 600;
      }
      .live2d-motion-test-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
      .live2d-motion-test-btn {
        padding: 10px 14px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-secondary); cursor: pointer;
        font-size: 0.85rem; transition: all 0.2s ease;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .live2d-motion-test-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--glass-border-hover);
        color: var(--text-primary);
        box-shadow: var(--accent-glow);
      }
      .live2d-motion-test-btn:active {
        background: var(--accent-gradient);
        color: #1a1a2e;
        transform: scale(0.98);
      }
      .live2d-motion-group-count { color: var(--text-muted); font-size: 0.8rem; font-weight: 400; }

      /* === ACTION TABLE === */
      .live2d-action-table { width: 100%; border-collapse: separate; border-spacing: 0 6px; margin-top: 12px; }
      .live2d-action-table th {
        background: transparent;
        color: var(--text-muted); font-size: 0.8rem; font-weight: 600;
        text-align: left; padding: 10px 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .live2d-action-table td {
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.02);
      }
      .live2d-action-table tr td:first-child { border-radius: var(--radius-sm) 0 0 var(--radius-sm); }
      .live2d-action-table tr td:last-child { border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
      .live2d-action-table textarea {
        width: 100%; padding: 8px 12px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-primary); font-size: 0.9rem;
        resize: vertical; min-height: 40px; font-family: inherit;
        transition: all 0.2s ease;
      }
      .live2d-action-table textarea:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-action-table select {
        width: 100%; padding: 8px 12px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary); font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .live2d-action-table select:focus {
        border-color: var(--glass-border-hover);
        box-shadow: var(--accent-glow);
        outline: none;
      }
      .live2d-action-delete-btn {
        padding: 8px 14px; border-radius: var(--radius-sm);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.03);
        color: var(--text-muted); cursor: pointer;
        font-size: 0.8rem; transition: all 0.2s ease;
      }
      .live2d-action-delete-btn:hover {
        background: rgba(220, 53, 69, 0.2);
        border-color: rgba(220, 53, 69, 0.5);
        color: #ff6b6b;
      }

      /* === PRIORITY LIST === */
      .live2d-priority-list { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
      .live2d-priority-item {
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(8px);
        border-radius: var(--radius-sm); padding: 16px 18px;
        border: 1px solid var(--glass-border);
        cursor: grab; transition: all 0.2s ease;
        display: flex; justify-content: space-between; align-items: center;
      }
      .live2d-priority-item:hover {
        border-color: var(--glass-border-hover);
        background: rgba(255, 255, 255, 0.05);
      }
      .live2d-priority-item:active { cursor: grabbing; }
      .live2d-priority-item.dragging {
        opacity: 0.6;
        border-color: var(--accent-primary);
        box-shadow: var(--accent-glow);
      }
      .live2d-priority-item.drag-over {
        border-color: var(--accent-primary);
        background: rgba(176, 196, 222, 0.1);
        box-shadow: var(--accent-glow);
      }
      .live2d-priority-label { color: var(--text-primary); font-size: 1rem; font-weight: 500; }
      .live2d-priority-badge {
        background: var(--accent-gradient);
        color: #1a1a2e;
        padding: 6px 14px; border-radius: 20px;
        font-size: 0.8rem; font-weight: 600;
        box-shadow: var(--accent-glow);
      }
      .live2d-priority-handle { color: var(--text-muted); font-size: 1.2rem; margin-right: 14px; }

      /* === MODEL INDICATOR BANNER === */
      .live2d-model-indicator {
        /* Match the glassy option rows from Emotion Mapping */
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        padding: 10px 16px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
      }
      .live2d-model-indicator::before {
        content: '◆';
        color: var(--accent-primary);
        font-size: 0.8rem;
      }
      .live2d-model-indicator span {
        color: var(--text-primary);
        font-size: 0.9rem;
        font-weight: 500;
      }
      .live2d-model-indicator strong {
        background: linear-gradient(135deg, #fff 0%, rgba(176, 196, 222, 1) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `;
    if (!document.getElementById("live2d-menu-style")) {
      const style = document.createElement("style");
      style.id = "live2d-menu-style";
      style.textContent = LIVE2D_MENU_CSS;
      document.head.appendChild(style);
    }

    let overlay = document.getElementById("live2d-modal-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "live2d-modal-overlay";
      overlay.id = "live2d-modal-overlay";
      overlay.style.display = "none";
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = "";

    const container = document.createElement("div");
    container.className = "live2d-modal-container";

    // Header
    const header = document.createElement("div");
    header.className = "live2d-modal-header";
    const title = document.createElement("h2");
    title.className = "live2d-modal-title";
    title.textContent = "Live2D Settings";
    const closeBtn = document.createElement("button");
    closeBtn.className = "live2d-modal-close";
    closeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
    closeBtn.onclick = () => { overlay.style.display = "none"; };
    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const mainBody = document.createElement("div");
    mainBody.className = "live2d-modal-body";

    // Selector de sección (similar al TTS)
    const sectionDropdownRow = document.createElement("div");
    sectionDropdownRow.className = "live2d-dropdown-row";
    sectionDropdownRow.style.paddingBottom = "18px";
    sectionDropdownRow.style.marginBottom = "0";
    sectionDropdownRow.style.borderBottom = "1px solid #444";

    const sectionLabel = document.createElement("label");
    sectionLabel.className = "live2d-dropdown-label";
    sectionLabel.textContent = "Section";
    const sectionSelect = document.createElement("select");
    sectionSelect.id = "live2d-section-select";
    sectionSelect.className = "live2d-dropdown";
    sectionSelect.innerHTML = `<option value="general">General</option><option value="models">Models</option><option value="modelSettings">Model Settings</option><option value="filters">Filters</option><option value="motionTest">M/E Test</option><option value="motionMapping">Emotion Mapping</option><option value="actionMapping">Action Mapping</option><option value="priorityConfig">Priority Config</option>`;
    sectionSelect.value = "general";
    sectionDropdownRow.appendChild(sectionLabel);
    sectionDropdownRow.appendChild(sectionSelect);
    mainBody.appendChild(sectionDropdownRow);

    // Sección Generalsk_179206faf6d8b9144240de2b37292a2c94d2b9bb4008d2a1
    const generalSection = document.createElement("div");
    generalSection.id = "live2d-section-general";
    generalSection.className = "live2d-section active";
    generalSection.style.display = "flex";
    generalSection.style.flexDirection = "column";
    generalSection.style.gap = "18px";

    const checkboxListGeneral = document.createElement("div");
    checkboxListGeneral.className = "live2d-checkbox-list";
    [
      { id: "enabled",       label: "Enable Live2D",    default: true },
      { id: "followCursor",  label: "Follow cursor",    default: false },
      { id: "enableTapping", label: "Enable tapping",   default: false },
      { id: "draggable",     label: "Enable dragging",  default: false },
      { id: "lipsyncOnly",   label: "Lipsync Only",     default: false },
    ].forEach(opt => {
      const row = document.createElement("div");
      row.className = "live2d-checkbox-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = `live2d-${opt.id}`;
      cb.dataset.key = opt.id;
      cb.checked = (Functions[opt.id] !== undefined) ? !!Functions[opt.id] : opt.default;
      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = opt.label;
      row.appendChild(cb);
      row.appendChild(label);
      checkboxListGeneral.appendChild(row);
    });
    generalSection.appendChild(checkboxListGeneral);

    // Botón de Reload Model
    const reloadModelBtn = document.createElement("button");
    reloadModelBtn.className = "live2d-reload-model-btn";
    reloadModelBtn.id = "live2d-reload-model-btn";
    reloadModelBtn.textContent = "Reload Model";
    reloadModelBtn.addEventListener('click', () => {
      reloadModel();
      overlay.style.display = "none";
    });
    generalSection.appendChild(reloadModelBtn);

    mainBody.appendChild(generalSection);

    // Sección Models
    const modelsSection = document.createElement("div");
    modelsSection.id = "live2d-section-models";
    modelsSection.className = "live2d-section";
    modelsSection.style.display = "none";

    const modelsTableContainer = document.createElement("div");
    modelsTableContainer.innerHTML = `
      <table class="live2d-models-table">
        <thead>
          <tr>
            <th>Model Name</th>
            <th>Model Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="live2d-models-tbody">
        </tbody>
      </table>
    `;

    const addModelBtn = document.createElement("button");
    addModelBtn.className = "live2d-add-model-btn";
    addModelBtn.id = "live2d-add-model-btn";
    addModelBtn.textContent = "+ Add New Model";

    modelsSection.appendChild(modelsTableContainer);
    modelsSection.appendChild(addModelBtn);

    // Función para extraer el nombre del modelo desde la URL
    const extractModelName = (url) => {
      if (!url) return 'Unnamed Model';

      try {
        // Extraer el nombre del archivo .model.json o .model3.json
        const match = url.match(/([^\/]+)\.(model3?\.json)$/i);
        if (match) {
          // Capitalizar primera letra y reemplazar guiones/underscores por espacios
          return match[1]
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }

        // Si no se encuentra, intentar extraer del path
        const pathMatch = url.match(/\/([^\/]+)\/[^\/]+\.(model3?\.json)$/i);
        if (pathMatch) {
          return pathMatch[1]
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        }

        return 'Unknown Model';
      } catch (e) {
        return 'Invalid URL';
      }
    };

    // Función para renderizar la tabla de modelos
    const renderModelsTable = () => {
      const tbody = document.getElementById('live2d-models-tbody');
      if (!tbody) return;

      tbody.innerHTML = '';

      modelsList.forEach((model) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="live2d-model-name">${model.name}</td>
          <td class="live2d-model-url">
            <textarea data-model-id="${model.id}" class="live2d-model-url-input">${model.url}</textarea>
          </td>
          <td class="live2d-model-actions">
            <button class="live2d-model-enable-btn ${model.enabled ? 'enabled' : 'disabled'}" data-model-id="${model.id}">
              ${model.enabled ? 'Enabled' : 'Enable'}
            </button>
            ${modelsList.length > 1 ? `<button class="live2d-delete-model-btn" data-model-id="${model.id}">Delete</button>` : ''}
          </td>
        `;
        tbody.appendChild(row);
      });

      // Event listeners para los botones de enable/disable
      tbody.querySelectorAll('.live2d-model-enable-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const modelId = parseInt(this.dataset.modelId);

          // No hacer nada si ya está habilitado
          const targetModel = modelsList.find(m => m.id === modelId);
          if (targetModel && targetModel.enabled) {
            console.log("[Live2D] Model already enabled:", targetModel.name);
            return;
          }

          // Guardar los settings del modelo actual antes de cambiar (SOLO settings de canvas, NO emotion mapping)
          // El emotion mapping se guarda cuando el usuario está en la sección de Emotion Mapping y hace click en Save
          const currentActiveModel = modelsList.find(m => m.enabled);
          if (currentActiveModel) {
            // Guardar settings actuales del canvas y modelo antes de cambiar
            const scaleSlider = document.getElementById('live2d-scale-slider');
            const canvasWidthInput = document.getElementById('live2d-canvas-width');
            const canvasHeightInput = document.getElementById('live2d-canvas-height');
            const posXSlider = document.getElementById('live2d-position-x-slider');
            const posYSlider = document.getElementById('live2d-position-y-slider');
            const anchorXSlider = document.getElementById('live2d-anchor-x-slider');
            const anchorYSlider = document.getElementById('live2d-anchor-y-slider');

            if (scaleSlider && canvasWidthInput && canvasHeightInput && posXSlider && posYSlider && anchorXSlider && anchorYSlider) {
              currentActiveModel.settings = {
                scale: parseFloat(scaleSlider.value),
                canvasWidth: parseInt(canvasWidthInput.value),
                canvasHeight: parseInt(canvasHeightInput.value),
                positionX: parseFloat(posXSlider.value),
                positionY: parseFloat(posYSlider.value),
                anchorX: parseFloat(anchorXSlider.value),
                anchorY: parseFloat(anchorYSlider.value)
              };
              console.log("[Live2D] Saved settings for model before switching:", currentActiveModel.name, currentActiveModel.settings);
            }

            // NO guardar emotionMapping desde DOM aquí - cada modelo ya tiene su propio emotionMapping
            // guardado en su objeto. Solo se actualiza cuando el usuario guarda desde la sección Emotion Mapping.
            console.log("[Live2D] Preserving emotionMapping for model:", currentActiveModel.name, currentActiveModel.emotionMapping || {});
          }

          // Deshabilitar todos los modelos
          modelsList.forEach(m => m.enabled = false);

          // Habilitar el modelo seleccionado
          const model = modelsList.find(m => m.id === modelId);
          if (model) {
            model.enabled = true;

            // Asegurar que el nuevo modelo tenga sus propias estructuras inicializadas
            if (!model.settings) {
              model.settings = {
                scale: 0.7,
                canvasWidth: 900,
                canvasHeight: 900,
                positionX: 50,
                positionY: 50,
                anchorX: 0.5,
                anchorY: 0.5
              };
            }

            // Asegurar que el modelo tenga su propio emotionMapping (NO copiar del anterior)
            if (!model.emotionMapping) {
              model.emotionMapping = {};
            }

            // Restaurar motions y expressions del modelo si existen
            if (model.motions) {
              allMotions = { ...model.motions };
              console.log("[Live2D] Restored motions for model:", model.name, allMotions);
            } else {
              allMotions = {};
              console.log("[Live2D] No motions found for model:", model.name);
            }

            if (model.expressions) {
              allExpressions = [...model.expressions];
              console.log("[Live2D] Restored expressions for model:", model.name, allExpressions);
            } else {
              allExpressions = [];
              console.log("[Live2D] No expressions found for model:", model.name);
            }

            console.log("[Live2D] Switched to model:", model.name, "with emotionMapping:", model.emotionMapping);
          }

          // Guardar en localStorage inmediatamente
          localStorage.setItem('live2dModelsList', JSON.stringify(modelsList));
          console.log("[Live2D] Saved modelsList to localStorage");

          // Enviar nueva lista de actions al TTS script
          sendAvailableEmotionsAndActions();

          renderModelsTable();
        });
      });

      // Event listeners para actualizar URLs
      tbody.querySelectorAll('.live2d-model-url-input').forEach(textarea => {
        textarea.addEventListener('blur', function() {
          const modelId = parseInt(this.dataset.modelId);
          const model = modelsList.find(m => m.id === modelId);
          if (model) {
            model.url = this.value.trim();
            // Actualizar el nombre automáticamente basado en la URL
            if (model.url) {
              model.name = extractModelName(model.url);
              renderModelsTable();
            }
          }
        });
      });

      // Event listeners para eliminar modelos
      tbody.querySelectorAll('.live2d-delete-model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const modelId = parseInt(this.dataset.modelId);
          const modelIndex = modelsList.findIndex(m => m.id === modelId);

          if (modelIndex !== -1) {
            const wasEnabled = modelsList[modelIndex].enabled;
            modelsList.splice(modelIndex, 1);

            // Si el modelo eliminado estaba habilitado, habilitar el primero
            if (wasEnabled && modelsList.length > 0) {
              modelsList[0].enabled = true;
              // El emotionMapping ya está en modelsList[0].emotionMapping, no necesita variable global
              console.log("[Live2D] New active model after deletion:", modelsList[0].name, modelsList[0].emotionMapping || {});
            }

            // Guardar en localStorage después de eliminar
            localStorage.setItem('live2dModelsList', JSON.stringify(modelsList));
            console.log("[Live2D] Deleted model, updated localStorage");

            renderModelsTable();
          }
        });
      });
    };

    // Event listener para el botón de añadir modelo
    addModelBtn.addEventListener('click', () => {
      const newId = Math.max(0, ...modelsList.map(m => m.id)) + 1;
      modelsList.push({
        id: newId,
        name: `Model ${newId}`,
        url: '',
        enabled: false,
        emotionMapping: {}, // Cada nuevo modelo tiene su propio mapeo vacío de emotion → {motion, expression}
        actionMapping: [],  // Array vacío de actions
        priorityList: [     // Prioridades por defecto
          {priority: 4, type: "action", target: "motion", label: "Action Motions"},
          {priority: 3, type: "emotion", target: "expression", label: "Emotion Expressions"},
          {priority: 2, type: "emotion", target: "motion", label: "Emotion Motions"},
          {priority: 1, type: "action", target: "expression", label: "Action Expressions"}
        ],
        disableSettings: {  // Disable settings por defecto
          emotionMotions: false,
          emotionExpressions: false,
          actionMotions: false,
          actionExpressions: false
        },
        settings: { // Settings por defecto para el nuevo modelo
          scale: 0.7,
          canvasWidth: 900,
          canvasHeight: 900,
          positionX: 50,
          positionY: 50,
          anchorX: 0.5,
          anchorY: 0.5
        }
      });
      renderModelsTable();
    });

    // Renderizar inicialmente
    renderModelsTable();

    mainBody.appendChild(modelsSection);

    // Sección Filters
    const filtersSection = document.createElement("div");
    filtersSection.id = "live2d-section-filters";
    filtersSection.className = "live2d-section";
    filtersSection.style.display = "none";

    // Default values for filters
    const defaultFilterParams = {
      outline: { thickness: 2, color: '#0000ff' },
      pixelate: { size: 5 },
      crt: { curvature: 3, lineWidth: 3, lineContrast: 0.2, vignetting: 0.3, vignettingAlpha: 0.8, noise: 0.1 },
      noise: { noise: 0.2 },
      alpha: { alpha: 0.8 }
    };

    // Outline Filter Card
    const outlineCard = document.createElement("div");
    outlineCard.className = "live2d-filter-card";
    outlineCard.innerHTML = `
      <div class="live2d-filter-header">
        <h3 class="live2d-filter-title">Outline Filter</h3>
        <button class="live2d-filter-reset" data-filter="outline">Reset</button>
      </div>
      <div class="live2d-filter-body">
        <div class="live2d-checkbox-row">
          <input type="checkbox" id="filter-outline-enabled" ${Functions.filters.outline ? 'checked' : ''}>
          <label for="filter-outline-enabled">Enable Outline Filter</label>
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Thickness</label>
            <span class="live2d-filter-value" id="outline-thickness-value">${Functions.filterParams?.outline?.thickness || 2}</span>
          </div>
          <input type="range" id="outline-thickness" min="0.5" max="10" step="0.5" value="${Functions.filterParams?.outline?.thickness || 2}">
        </div>
        <div class="live2d-filter-param">
          <label>Color</label>
          <div class="live2d-color-picker-container">
            <input type="color" id="outline-color-picker" value="${Functions.filterParams?.outline?.color || '#0000ff'}">
            <input type="text" id="outline-color-text" value="${Functions.filterParams?.outline?.color || '#0000ff'}">
          </div>
        </div>
      </div>
    `;
    filtersSection.appendChild(outlineCard);

    // Pixelate Filter Card
    const pixelateCard = document.createElement("div");
    pixelateCard.className = "live2d-filter-card";
    pixelateCard.innerHTML = `
      <div class="live2d-filter-header">
        <h3 class="live2d-filter-title">Pixelate Filter</h3>
        <button class="live2d-filter-reset" data-filter="pixelate">Reset</button>
      </div>
      <div class="live2d-filter-body">
        <div class="live2d-checkbox-row">
          <input type="checkbox" id="filter-pixelate-enabled" ${Functions.filters.pixelate ? 'checked' : ''}>
          <label for="filter-pixelate-enabled">Enable Pixelate Filter</label>
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Pixel Size</label>
            <span class="live2d-filter-value" id="pixelate-size-value">${Functions.filterParams?.pixelate?.size || 5}</span>
          </div>
          <input type="range" id="pixelate-size" min="1" max="20" step="1" value="${Functions.filterParams?.pixelate?.size || 5}">
        </div>
      </div>
    `;
    filtersSection.appendChild(pixelateCard);

    // CRT Filter Card
    const crtCard = document.createElement("div");
    crtCard.className = "live2d-filter-card";
    crtCard.innerHTML = `
      <div class="live2d-filter-header">
        <h3 class="live2d-filter-title">CRT Filter</h3>
        <button class="live2d-filter-reset" data-filter="crt">Reset</button>
      </div>
      <div class="live2d-filter-body">
        <div class="live2d-checkbox-row">
          <input type="checkbox" id="filter-crt-enabled" ${Functions.filters.crt ? 'checked' : ''}>
          <label for="filter-crt-enabled">Enable CRT Filter</label>
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Curvature</label>
            <span class="live2d-filter-value" id="crt-curvature-value">${Functions.filterParams?.crt?.curvature || 3}</span>
          </div>
          <input type="range" id="crt-curvature" min="0" max="10" step="0.1" value="${Functions.filterParams?.crt?.curvature || 3}">
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Line Width</label>
            <span class="live2d-filter-value" id="crt-lineWidth-value">${Functions.filterParams?.crt?.lineWidth || 3}</span>
          </div>
          <input type="range" id="crt-lineWidth" min="0" max="10" step="0.1" value="${Functions.filterParams?.crt?.lineWidth || 3}">
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Line Contrast</label>
            <span class="live2d-filter-value" id="crt-lineContrast-value">${Functions.filterParams?.crt?.lineContrast || 0.2}</span>
          </div>
          <input type="range" id="crt-lineContrast" min="0" max="1" step="0.01" value="${Functions.filterParams?.crt?.lineContrast || 0.2}">
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Vignetting</label>
            <span class="live2d-filter-value" id="crt-vignetting-value">${Functions.filterParams?.crt?.vignetting || 0.3}</span>
          </div>
          <input type="range" id="crt-vignetting" min="0" max="1" step="0.01" value="${Functions.filterParams?.crt?.vignetting || 0.3}">
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Vignetting Alpha</label>
            <span class="live2d-filter-value" id="crt-vignettingAlpha-value">${Functions.filterParams?.crt?.vignettingAlpha || 0.8}</span>
          </div>
          <input type="range" id="crt-vignettingAlpha" min="0" max="1" step="0.01" value="${Functions.filterParams?.crt?.vignettingAlpha || 0.8}">
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Noise</label>
            <span class="live2d-filter-value" id="crt-noise-value">${Functions.filterParams?.crt?.noise || 0.1}</span>
          </div>
          <input type="range" id="crt-noise" min="0" max="1" step="0.01" value="${Functions.filterParams?.crt?.noise || 0.1}">
        </div>
      </div>
    `;
    filtersSection.appendChild(crtCard);

    // Noise Filter Card
    const noiseCard = document.createElement("div");
    noiseCard.className = "live2d-filter-card";
    noiseCard.innerHTML = `
      <div class="live2d-filter-header">
        <h3 class="live2d-filter-title">Noise Filter</h3>
        <button class="live2d-filter-reset" data-filter="noise">Reset</button>
      </div>
      <div class="live2d-filter-body">
        <div class="live2d-checkbox-row">
          <input type="checkbox" id="filter-noise-enabled" ${Functions.filters.noise ? 'checked' : ''}>
          <label for="filter-noise-enabled">Enable Noise Filter</label>
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Noise Amount</label>
            <span class="live2d-filter-value" id="noise-noise-value">${Functions.filterParams?.noise?.noise || 0.2}</span>
          </div>
          <input type="range" id="noise-noise" min="0" max="1" step="0.01" value="${Functions.filterParams?.noise?.noise || 0.2}">
        </div>
      </div>
    `;
    filtersSection.appendChild(noiseCard);

    // Alpha Filter Card
    const alphaCard = document.createElement("div");
    alphaCard.className = "live2d-filter-card";
    alphaCard.innerHTML = `
      <div class="live2d-filter-header">
        <h3 class="live2d-filter-title">Alpha Filter</h3>
        <button class="live2d-filter-reset" data-filter="alpha">Reset</button>
      </div>
      <div class="live2d-filter-body">
        <div class="live2d-checkbox-row">
          <input type="checkbox" id="filter-alpha-enabled" ${Functions.filters.alpha ? 'checked' : ''}>
          <label for="filter-alpha-enabled">Enable Alpha Filter</label>
        </div>
        <div class="live2d-filter-param">
          <div class="live2d-filter-param-header">
            <label>Alpha</label>
            <span class="live2d-filter-value" id="alpha-alpha-value">${Functions.filterParams?.alpha?.alpha || 0.8}</span>
          </div>
          <input type="range" id="alpha-alpha" min="0" max="1" step="0.01" value="${Functions.filterParams?.alpha?.alpha || 0.8}">
        </div>
      </div>
    `;
    filtersSection.appendChild(alphaCard);

    mainBody.appendChild(filtersSection);

    // ============ Motion Test Section ============
    const motionTestSection = document.createElement("div");
    motionTestSection.id = "live2d-section-motionTest";
    motionTestSection.className = "live2d-section";
    motionTestSection.style.display = "none";
    motionTestSection.style.flexDirection = "column";
    motionTestSection.style.gap = "18px";

    // Función para renderizar la sección de M/E Test (Motions and Expressions)
    const renderMotionTest = () => {
      motionTestSection.innerHTML = '';

      // Obtener el modelo activo
      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        motionTestSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No active model found</p>';
        return;
      }

      // Mostrar qué modelo se está probando
      const modelIndicator = document.createElement("div");
      modelIndicator.style.cssText = "padding: 12px 16px; background: rgb(49 51 57 / 40%); border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #7ab7ff;";
      modelIndicator.innerHTML = `<span style="color: #bbb; font-size: 0.9rem;">Testing motions/expressions for: </span><strong style="color: #fff;">${activeModel.name}</strong><span style="color: #666; font-size: 0.8rem;"> (ID: ${activeModel.id})</span>`;
      motionTestSection.appendChild(modelIndicator);

      // ========== SECCIÓN DE EXPRESSIONS ==========
      if (allExpressions && allExpressions.length > 0) {
        const expressionsCard = document.createElement("div");
        expressionsCard.className = "live2d-motion-test-group";

        const expressionsHeader = document.createElement("div");
        expressionsHeader.className = "live2d-motion-test-header";

        const expressionsTitle = document.createElement("span");
        expressionsTitle.textContent = "EXPRESSIONS";

        const expressionsCount = document.createElement("span");
        expressionsCount.className = "live2d-motion-group-count";
        expressionsCount.textContent = `${allExpressions.length} expression${allExpressions.length > 1 ? 's' : ''}`;

        expressionsHeader.appendChild(expressionsTitle);
        expressionsHeader.appendChild(expressionsCount);
        expressionsCard.appendChild(expressionsHeader);

        const expressionsGrid = document.createElement("div");
        expressionsGrid.className = "live2d-motion-test-grid";

        allExpressions.forEach((expression, expressionIndex) => {
          const btn = document.createElement("button");
          btn.className = "live2d-motion-test-btn";
          btn.textContent = expression.name || expression.Name || `Expression ${expressionIndex}`;
          btn.title = `Apply: ${expression.name || expression.Name || 'Expression ' + expressionIndex}`;
          https://guansss.github.io/pixi-live2d-display/motions_expressions/
          btn.onclick = () => {
            if (window.live2dModel) {
              try {
                // Aplicar la expression por índice
                window.live2dModel.expression(expressionIndex);
                console.log(`[Live2D Expression Test] Applied: ${expression.name || expression.Name} [${expressionIndex}]`);

                // Feedback visual
                btn.style.background = '#7ab7ff';
                btn.style.color = '#23242a';
                setTimeout(() => {
                  btn.style.background = '';
                  btn.style.color = '';
                }, 300);
              } catch (e) {
                console.error(`[Live2D Expression Test] Error applying expression:`, e);
              }
            } else {
              console.warn('[Live2D Expression Test] Model not loaded yet');
            }
          };

          expressionsGrid.appendChild(btn);
        });

        expressionsCard.appendChild(expressionsGrid);
        motionTestSection.appendChild(expressionsCard);
      }

      // ========== SECCIÓN DE MOTIONS ==========
      // Verificar si hay motions disponibles
      if (!allMotions || Object.keys(allMotions).length === 0) {
        if (!allExpressions || allExpressions.length === 0) {
          motionTestSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No motions or expressions available. Load a model first.</p>';
        }
        return;
      }

      // Crear un grupo por cada categoría de motion
      for (const groupName in allMotions) {
        if (!allMotions.hasOwnProperty(groupName)) continue;
        const motionGroup = allMotions[groupName];
        if (motionGroup.length === 0) continue;

        // Card para el grupo
        const groupCard = document.createElement("div");
        groupCard.className = "live2d-motion-test-group";

        // Header con nombre del grupo y contador
        const groupHeader = document.createElement("div");
        groupHeader.className = "live2d-motion-test-header";

        const groupTitle = document.createElement("span");
        // Manejar nombres vacíos o especiales
        const displayGroupName = groupName === ""
          ? "(DEFAULT/UNNAMED)"
          : groupName.replace(/_/g, ' ').toUpperCase();
        groupTitle.textContent = displayGroupName;

        const groupCount = document.createElement("span");
        groupCount.className = "live2d-motion-group-count";
        groupCount.textContent = `${motionGroup.length} motion${motionGroup.length > 1 ? 's' : ''}`;

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupCount);
        groupCard.appendChild(groupHeader);

        // Grid de botones para cada motion
        const motionGrid = document.createElement("div");
        motionGrid.className = "live2d-motion-test-grid";

        motionGroup.forEach((motion, motionIndex) => {
          const btn = document.createElement("button");
          btn.className = "live2d-motion-test-btn";

          // Obtener el nombre del archivo (File o file)
          const fileName = motion.File || motion.file || motion.name || `Motion ${motionIndex + 1}`;

          // Remover la extensión del archivo para mostrar solo el nombre
          const displayName = fileName.replace(/\.(mtn|json)$/i, '');

          btn.textContent = displayName;
          btn.title = `Play: ${fileName} (Index: ${motionIndex})`;

          // Al hacer clic, reproducir la motion
          btn.onclick = () => {
            if (window.live2dModel) {
              try {
                // Detener todas las motions antes de reproducir una nueva
                if (window.live2dModel.internalModel && window.live2dModel.internalModel.motionManager) {
                  window.live2dModel.internalModel.motionManager.stopAllMotions();
                }

                // Reproducir la nueva motion
                window.live2dModel.motion(groupName, motionIndex);
                console.log(`[Live2D Motion Test] Playing: "${groupName}"[${motionIndex}] - ${fileName}`);

                // Feedback visual
                btn.style.background = '#7ab7ff';
                btn.style.color = '#23242a';
                setTimeout(() => {
                  btn.style.background = '';
                  btn.style.color = '';
                }, 300);
              } catch (e) {
                console.error(`[Live2D Motion Test] Error playing motion:`, e);
              }
            } else {
              console.warn('[Live2D Motion Test] Model not loaded yet');
            }
          };

          motionGrid.appendChild(btn);
        });

        groupCard.appendChild(motionGrid);
        motionTestSection.appendChild(groupCard);
      }
    };

    mainBody.appendChild(motionTestSection);

    // Sección Motion Mapping
    const motionMappingSection = document.createElement("div");
    motionMappingSection.id = "live2d-section-motionMapping";
    motionMappingSection.className = "live2d-section";
    motionMappingSection.style.display = "none";
    motionMappingSection.style.flexDirection = "column";
    motionMappingSection.style.gap = "18px";

    // Función para renderizar los selectores de emotion mapping (motion + expression)
    const renderMotionMapping = () => {
      motionMappingSection.innerHTML = '';

      // Obtener el modelo activo para cargar su mapeo
      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        motionMappingSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No active model found</p>';
        motionMappingSection.dataset.renderedForModelId = '';
        return;
      }

      // Marcar la sección con el ID del modelo para el cual fue renderizada
      motionMappingSection.dataset.renderedForModelId = activeModel.id.toString();

      // Mostrar qué modelo se está configurando
      const modelIndicator = document.createElement("div");
      modelIndicator.style.cssText = "padding: 12px 16px; background: rgb(49 51 57 / 40%); border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #7ab7ff;";
      modelIndicator.innerHTML = `<span style="color: #bbb; font-size: 0.9rem;">Configuring emotion mapping for: </span><strong style="color: #fff;">${activeModel.name}</strong><span style="color: #666; font-size: 0.8rem;"> (ID: ${activeModel.id})</span>`;
      motionMappingSection.appendChild(modelIndicator);

      // Verificar si el modelo tiene motions/expressions cargados
      const hasMotions = allMotions && Object.keys(allMotions).length > 0;
      const hasExpressions = allExpressions && allExpressions.length > 0;

      if (!hasMotions && !hasExpressions) {
        const warningDiv = document.createElement("div");
        warningDiv.style.cssText = "padding: 16px; background: #3d2f1f; border-radius: 8px; margin-bottom: 16px; border: 1px solid #5a4a2a; color: #f5d98a;";
        warningDiv.innerHTML = `
          <strong>⚠️ No motions or expressions loaded</strong>
          <p style="margin: 8px 0 0 0; font-size: 0.9rem;">Please save settings and reload the model first to load its motions and expressions.</p>
        `;
        motionMappingSection.appendChild(warningDiv);
      }

      // Inicializar disableSettings si no existe
      if (!activeModel.disableSettings) {
        activeModel.disableSettings = {
          emotionMotions: false,
          emotionExpressions: false,
          actionMotions: false,
          actionExpressions: false
        };
      }

      // Inicializar emotionMapping si no existe
      if (!activeModel.emotionMapping) {
        activeModel.emotionMapping = {};
      }

      // Cargar el mapeo del modelo activo (migrar formato antiguo si existe)
      if (activeModel.emotionMotionMap) {
        // Migrar formato antiguo (solo motion) al nuevo formato (motion + expression)
        for (const [key, value] of Object.entries(activeModel.emotionMotionMap)) {
          if (!activeModel.emotionMapping[key]) {
            activeModel.emotionMapping[key] = {
              motion: value,
              expression: "" // Sin expression por defecto
            };
          }
        }
        delete activeModel.emotionMotionMap; // Eliminar el formato antiguo
      }

      // Usar directamente activeModel.emotionMapping (NO variable global)
      const modelEmotionMapping = activeModel.emotionMapping;

      // ===== CHECKBOXES DE DISABLE =====
      const disableSection = document.createElement("div");
      disableSection.style.cssText = "display: flex; gap: 20px; padding: 16px; background: #1e1f25; border-radius: 8px; margin-bottom: 16px;";

      const createCheckbox = (id, label, checked) => {
        const wrapper = document.createElement("label");
        wrapper.style.cssText = "display: flex; align-items: center; gap: 8px; cursor: pointer; color: #bbb; font-size: 0.9rem;";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.style.cssText = "cursor: pointer; width: 16px; height: 16px;";

        const text = document.createElement("span");
        text.textContent = label;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(text);
        return wrapper;
      };

      disableSection.appendChild(createCheckbox(
        'live2d-disable-emotion-motions',
        'Disable Emotion Motions',
        activeModel.disableSettings.emotionMotions
      ));

      disableSection.appendChild(createCheckbox(
        'live2d-disable-emotion-expressions',
        'Disable Emotion Expressions',
        activeModel.disableSettings.emotionExpressions
      ));

      motionMappingSection.appendChild(disableSection);

      // Header con las columnas
      const header = document.createElement("div");
      header.className = "live2d-emotion-mapping-header";
      header.innerHTML = `
        <div>Emotion</div>
        <div>Motion</div>
        <div>Expression</div>
      `;
      motionMappingSection.appendChild(header);

      EMOTION_LIST.forEach((emotion, index) => {
        const emotionKey = index + 1;
        const row = document.createElement("div");
        row.className = "live2d-motion-mapping-row";

        // Label de la emoción
        const label = document.createElement("label");
        label.htmlFor = `live2d-motion-${emotionKey}`;
        label.textContent = emotion;
        row.appendChild(label);

        // ===== SELECT DE MOTION =====
        const motionSelect = document.createElement("select");
        motionSelect.id = `live2d-motion-${emotionKey}`;
        motionSelect.dataset.emotionKey = emotionKey;
        motionSelect.innerHTML = '<option value="">-- Default (Fallback) --</option><option value="null">-- No Motion --</option>';

        // Usar modelEmotionMapping del modelo activo (NO variable global)
        const currentMapping = modelEmotionMapping[emotionKey] || {};
        const currentMotion = typeof currentMapping === 'string' ? currentMapping : currentMapping.motion || "";

        for (const groupName in allMotions) {
          if (!allMotions.hasOwnProperty(groupName)) continue;
          const motionGroup = allMotions[groupName];
          if (motionGroup.length === 0) continue;

          const optgroup = document.createElement("optgroup");
          // Manejar nombres vacíos o especiales
          const displayGroupName = groupName === ""
            ? "(Default/Unnamed)"
            : groupName.replace(/_/g, ' ').toUpperCase();
          optgroup.label = displayGroupName;

          motionGroup.forEach((motion, motionIndex) => {
            const option = document.createElement("option");
            const motionValue = `${groupName}:${motionIndex}`;
            option.value = motionValue;
            const fileName = motion.File || motion.file || `Motion ${motionIndex + 1}`;
            option.textContent = fileName;
            if (currentMotion === motionValue) {
              option.selected = true;
            }
            optgroup.appendChild(option);
          });

          motionSelect.appendChild(optgroup);
        }

        row.appendChild(motionSelect);

        // ===== SELECT DE EXPRESSION =====
        const expressionSelect = document.createElement("select");
        expressionSelect.id = `live2d-expression-${emotionKey}`;
        expressionSelect.dataset.emotionKey = emotionKey;
        expressionSelect.innerHTML = '<option value="">-- No Expression --</option>';

        const currentExpression = typeof currentMapping === 'object' ? currentMapping.expression || "" : "";

        if (allExpressions && allExpressions.length > 0) {
          allExpressions.forEach((expression, expressionIndex) => {
            const option = document.createElement("option");
            option.value = expressionIndex.toString();
            option.textContent = expression.name || expression.Name || `Expression ${expressionIndex}`;
            if (currentExpression === expressionIndex.toString()) {
              option.selected = true;
            }
            expressionSelect.appendChild(option);
          });
        } else {
          expressionSelect.disabled = true;
          expressionSelect.title = "No expressions available in this model";
        }

        row.appendChild(expressionSelect);
        motionMappingSection.appendChild(row);
      });
    };

    // Renderizar inicialmente
    renderMotionMapping();

    mainBody.appendChild(motionMappingSection);

    // ============ Action Mapping Section ============
    const actionMappingSection = document.createElement("div");
    actionMappingSection.id = "live2d-section-actionMapping";
    actionMappingSection.className = "live2d-section";
    actionMappingSection.style.display = "none";
    actionMappingSection.style.flexDirection = "column";
    actionMappingSection.style.gap = "18px";

    // Función para renderizar la tabla de Action Mapping
    const renderActionMapping = () => {
      actionMappingSection.innerHTML = '';

      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        actionMappingSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No active model found</p>';
        actionMappingSection.dataset.renderedForModelId = '';
        return;
      }

      // Marcar la sección con el ID del modelo para el cual fue renderizada
      actionMappingSection.dataset.renderedForModelId = activeModel.id.toString();

      // Mostrar qué modelo se está configurando
      const modelIndicator = document.createElement("div");
      modelIndicator.style.cssText = "padding: 12px 16px; background: rgb(49 51 57 / 40%); border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #7ab7ff;";
      modelIndicator.innerHTML = `<span style="color: #bbb; font-size: 0.9rem;">Configuring action mapping for: </span><strong style="color: #fff;">${activeModel.name}</strong><span style="color: #666; font-size: 0.8rem;"> (ID: ${activeModel.id})</span>`;
      actionMappingSection.appendChild(modelIndicator);

      // Inicializar actionMapping si no existe
      if (!activeModel.actionMapping) {
        activeModel.actionMapping = [];
      }

      // Inicializar disableSettings si no existe
      if (!activeModel.disableSettings) {
        activeModel.disableSettings = {
          emotionMotions: false,
          emotionExpressions: false,
          actionMotions: false,
          actionExpressions: false
        };
      }

      // ===== CHECKBOXES DE DISABLE =====
      const disableSection = document.createElement("div");
      disableSection.style.cssText = "display: flex; gap: 20px; padding: 16px; background: #1e1f25; border-radius: 8px; margin-bottom: 16px;";

      const createCheckbox = (id, label, checked) => {
        const wrapper = document.createElement("label");
        wrapper.style.cssText = "display: flex; align-items: center; gap: 8px; cursor: pointer; color: #bbb; font-size: 0.9rem;";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.style.cssText = "cursor: pointer; width: 16px; height: 16px;";

        const text = document.createElement("span");
        text.textContent = label;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(text);
        return wrapper;
      };

      disableSection.appendChild(createCheckbox(
        'live2d-disable-action-motions',
        'Disable Action Motions',
        activeModel.disableSettings.actionMotions
      ));

      disableSection.appendChild(createCheckbox(
        'live2d-disable-action-expressions',
        'Disable Action Expressions',
        activeModel.disableSettings.actionExpressions
      ));

      actionMappingSection.appendChild(disableSection);

      // Crear tabla
      const table = document.createElement("table");
      table.className = "live2d-action-table";

      // Header
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th style="width: 40%;">Action Description</th>
          <th style="width: 25%;">Motion</th>
          <th style="width: 25%;">Expression</th>
          <th style="width: 10%; text-align: center;">Actions</th>
        </tr>
      `;
      table.appendChild(thead);

      // Body
      const tbody = document.createElement("tbody");

      if (activeModel.actionMapping.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = '<td colspan="4" style="text-align: center; color: #888; padding: 20px;">No actions defined. Click "Add Action" to create one.</td>';
        tbody.appendChild(emptyRow);
      } else {
        activeModel.actionMapping.forEach((action, index) => {
          const row = document.createElement("tr");

          // Description textarea
          const descCell = document.createElement("td");
          const descTextarea = document.createElement("textarea");
          descTextarea.value = action.description || "";
          descTextarea.placeholder = "e.g., Wave hand, Nod in agreement";
          descTextarea.dataset.actionId = action.id;
          descCell.appendChild(descTextarea);
          row.appendChild(descCell);

          // Motion select
          const motionCell = document.createElement("td");
          const motionSelect = document.createElement("select");
          motionSelect.dataset.actionId = action.id;
          motionSelect.innerHTML = '<option value="">-- No Motion --</option><option value="null">-- Null --</option>';

          for (const groupName in allMotions) {
            if (!allMotions.hasOwnProperty(groupName)) continue;
            const motionGroup = allMotions[groupName];
            if (motionGroup.length === 0) continue;

            const optgroup = document.createElement("optgroup");
            // Manejar nombres vacíos o especiales
            const displayGroupName = groupName === ""
              ? "(Default/Unnamed)"
              : groupName.replace(/_/g, ' ').toUpperCase();
            optgroup.label = displayGroupName;

            motionGroup.forEach((motion, motionIndex) => {
              const option = document.createElement("option");
              const motionValue = `${groupName}:${motionIndex}`;
              option.value = motionValue;
              const fileName = motion.File || motion.file || `Motion ${motionIndex + 1}`;
              option.textContent = fileName;
              if (action.motion === motionValue) {
                option.selected = true;
              }
              optgroup.appendChild(option);
            });

            motionSelect.appendChild(optgroup);
          }

          motionCell.appendChild(motionSelect);
          row.appendChild(motionCell);

          // Expression select
          const expressionCell = document.createElement("td");
          const expressionSelect = document.createElement("select");
          expressionSelect.dataset.actionId = action.id;
          expressionSelect.innerHTML = '<option value="">-- No Expression --</option>';

          if (allExpressions && allExpressions.length > 0) {
            allExpressions.forEach((expression, expressionIndex) => {
              const option = document.createElement("option");
              option.value = expressionIndex.toString();
              option.textContent = expression.name || expression.Name || `Expression ${expressionIndex}`;
              if (action.expression === expressionIndex.toString()) {
                option.selected = true;
              }
              expressionSelect.appendChild(option);
            });
          } else {
            expressionSelect.disabled = true;
            expressionSelect.title = "No expressions available in this model";
          }

          expressionCell.appendChild(expressionSelect);
          row.appendChild(expressionCell);

          // Delete button
          const actionsCell = document.createElement("td");
          actionsCell.style.textAlign = "center";
          const deleteBtn = document.createElement("button");
          deleteBtn.className = "live2d-action-delete-btn";
          deleteBtn.textContent = "Delete";
          deleteBtn.dataset.actionId = action.id;
          deleteBtn.onclick = () => {
            const actionId = parseInt(deleteBtn.dataset.actionId);
            const actionIndex = activeModel.actionMapping.findIndex(a => a.id === actionId);
            if (actionIndex !== -1) {
              activeModel.actionMapping.splice(actionIndex, 1);
              renderActionMapping();
            }
          };
          actionsCell.appendChild(deleteBtn);
          row.appendChild(actionsCell);

          tbody.appendChild(row);
        });
      }

      table.appendChild(tbody);
      actionMappingSection.appendChild(table);

      // Add Action button
      const addButton = document.createElement("button");
      addButton.className = "live2d-add-action-btn";
      addButton.textContent = "+ Add Action";
      addButton.onclick = () => {
        const newId = activeModel.actionMapping.length > 0
          ? Math.max(...activeModel.actionMapping.map(a => a.id)) + 1
          : 1;

        activeModel.actionMapping.push({
          id: newId,
          description: "",
          motion: "",
          expression: ""
        });

        renderActionMapping();
      };
      actionMappingSection.appendChild(addButton);
    };

    // Renderizar inicialmente
    renderActionMapping();

    mainBody.appendChild(actionMappingSection);

    // ============ Priority Config Section ============
    const priorityConfigSection = document.createElement("div");
    priorityConfigSection.id = "live2d-section-priorityConfig";
    priorityConfigSection.className = "live2d-section";
    priorityConfigSection.style.display = "none";
    priorityConfigSection.style.flexDirection = "column";
    priorityConfigSection.style.gap = "18px";

    // Función para renderizar la lista de prioridades
    const renderPriorityConfig = () => {
      priorityConfigSection.innerHTML = '';

      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        priorityConfigSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No active model found</p>';
        return;
      }

      // Mostrar qué modelo se está configurando
      const modelIndicator = document.createElement("div");
      modelIndicator.style.cssText = "padding: 12px 16px; background: rgb(49 51 57 / 40%); border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #7ab7ff;";
      modelIndicator.innerHTML = `<span style="color: #bbb; font-size: 0.9rem;">Configuring priority for: </span><strong style="color: #fff;">${activeModel.name}</strong><span style="color: #666; font-size: 0.8rem;"> (ID: ${activeModel.id})</span>`;
      priorityConfigSection.appendChild(modelIndicator);

      // Inicializar priorityList si no existe
      if (!activeModel.priorityList) {
        activeModel.priorityList = [
          {priority: 4, type: "action", target: "motion", label: "Action Motions"},
          {priority: 3, type: "emotion", target: "expression", label: "Emotion Expressions"},
          {priority: 2, type: "emotion", target: "motion", label: "Emotion Motions"},
          {priority: 1, type: "action", target: "expression", label: "Action Expressions"}
        ];
      }

      // Descripción
      const description = document.createElement("p");
      description.style.color = "#bbb";
      description.style.fontSize = "0.95rem";
      description.style.marginBottom = "12px";
      description.textContent = "Drag and drop to reorder priorities. Higher positions = higher priority when resolving motion/expression conflicts.";
      priorityConfigSection.appendChild(description);

      // Lista de prioridades
      const priorityList = document.createElement("div");
      priorityList.className = "live2d-priority-list";
      priorityList.id = "live2d-priority-list-container";

      // Ordenar por prioridad (descendente)
      const sortedPriorities = [...activeModel.priorityList].sort((a, b) => b.priority - a.priority);

      sortedPriorities.forEach((item, index) => {
        const priorityItem = document.createElement("div");
        priorityItem.className = "live2d-priority-item";
        priorityItem.draggable = true;
        priorityItem.dataset.priority = item.priority;
        priorityItem.dataset.type = item.type;
        priorityItem.dataset.target = item.target;

        priorityItem.innerHTML = `
          <div style="display: flex; align-items: center;">
            <span class="live2d-priority-handle">☰</span>
            <span class="live2d-priority-label">${item.label}</span>
          </div>
          <span class="live2d-priority-badge">Priority ${item.priority}</span>
        `;

        // Drag events
        priorityItem.addEventListener('dragstart', (e) => {
          priorityItem.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', index.toString());
        });

        priorityItem.addEventListener('dragend', () => {
          priorityItem.classList.remove('dragging');
          document.querySelectorAll('.live2d-priority-item').forEach(item => {
            item.classList.remove('drag-over');
          });
        });

        priorityItem.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          priorityItem.classList.add('drag-over');
        });

        priorityItem.addEventListener('dragleave', () => {
          priorityItem.classList.remove('drag-over');
        });

        priorityItem.addEventListener('drop', (e) => {
          e.preventDefault();
          priorityItem.classList.remove('drag-over');

          const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
          const targetIndex = index;

          if (draggedIndex !== targetIndex) {
            // Reordenar
            const draggedItem = sortedPriorities[draggedIndex];
            sortedPriorities.splice(draggedIndex, 1);
            sortedPriorities.splice(targetIndex, 0, draggedItem);

            // Actualizar prioridades
            sortedPriorities.forEach((item, i) => {
              item.priority = sortedPriorities.length - i;
            });

            activeModel.priorityList = sortedPriorities;
            renderPriorityConfig();
          }
        });

        priorityList.appendChild(priorityItem);
      });

      priorityConfigSection.appendChild(priorityList);
    };

    // Renderizar inicialmente
    renderPriorityConfig();

    mainBody.appendChild(priorityConfigSection);

    // ============ Model Settings Section ============
    const modelSettingsSection = document.createElement("div");
    modelSettingsSection.id = "live2d-section-modelSettings";
    modelSettingsSection.className = "live2d-section";
    modelSettingsSection.style.display = "none";
    modelSettingsSection.style.flexDirection = "column";
    modelSettingsSection.style.gap = "18px";

    // Función para renderizar los controles de Model Settings
    const renderModelSettings = () => {
      modelSettingsSection.innerHTML = '';

      // Obtener el modelo activo
      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        modelSettingsSection.innerHTML = '<p style="color: #bbb; text-align: center; padding: 20px;">No active model found</p>';
        modelSettingsSection.dataset.renderedForModelId = '';
        return;
      }

      // Marcar la sección con el ID del modelo para el cual fue renderizada
      modelSettingsSection.dataset.renderedForModelId = activeModel.id.toString();

      // Mostrar qué modelo se está configurando
      const modelIndicator = document.createElement("div");
      modelIndicator.style.cssText = "padding: 12px 16px; background: #313339; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #7ab7ff;";
      modelIndicator.innerHTML = `<span style="color: #bbb; font-size: 0.9rem;">Configuring settings for: </span><strong style="color: #fff;">${activeModel.name}</strong><span style="color: #666; font-size: 0.8rem;"> (ID: ${activeModel.id})</span>`;
      modelSettingsSection.appendChild(modelIndicator);

      // Si el modelo no tiene settings, inicializarlos con valores por defecto
      if (!activeModel.settings) {
        activeModel.settings = {
          scale: 0.7,
          canvasWidth: 900,
          canvasHeight: 900,
          positionX: 50,
          positionY: 50,
          anchorX: 0.5,
          anchorY: 0.5
        };
      }

      const settings = activeModel.settings;

      // Scale Card
      const scaleCard = document.createElement("div");
      scaleCard.className = "live2d-setting-card";
      scaleCard.innerHTML = `
        <div class="live2d-setting-header">Model Scale</div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Scale:</span>
          <div class="live2d-setting-slider-container">
            <input type="range" id="live2d-scale-slider" class="live2d-setting-slider" min="0.1" max="2" step="0.01" value="${settings.scale}">
            <span class="live2d-setting-value" id="live2d-scale-value">${settings.scale}</span>
          </div>
        </div>
      `;
      modelSettingsSection.appendChild(scaleCard);

      // Canvas Size Card
      const canvasCard = document.createElement("div");
      canvasCard.className = "live2d-setting-card";
      canvasCard.innerHTML = `
        <div class="live2d-setting-header">Canvas Dimensions</div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Width:</span>
          <input type="number" id="live2d-canvas-width" class="live2d-setting-input" min="100" max="2000" value="${settings.canvasWidth}">
          <span style="color: #888; margin-left: 8px;">px</span>
        </div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Height:</span>
          <input type="number" id="live2d-canvas-height" class="live2d-setting-input" min="100" max="2000" value="${settings.canvasHeight}">
          <span style="color: #888; margin-left: 8px;">px</span>
        </div>
      `;
      modelSettingsSection.appendChild(canvasCard);

      // Position Card
      const positionCard = document.createElement("div");
      positionCard.className = "live2d-setting-card";
      positionCard.innerHTML = `
        <div class="live2d-setting-header">Position (Percentage)</div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">X Position:</span>
          <div class="live2d-setting-slider-container">
            <input type="range" id="live2d-position-x-slider" class="live2d-setting-slider" min="0" max="100" step="1" value="${settings.positionX}">
            <span class="live2d-setting-value" id="live2d-position-x-value">${settings.positionX}%</span>
          </div>
        </div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Y Position:</span>
          <div class="live2d-setting-slider-container">
            <input type="range" id="live2d-position-y-slider" class="live2d-setting-slider" min="0" max="100" step="1" value="${settings.positionY}">
            <span class="live2d-setting-value" id="live2d-position-y-value">${settings.positionY}%</span>
          </div>
        </div>
      `;
      modelSettingsSection.appendChild(positionCard);

      // Anchor Card
      const anchorCard = document.createElement("div");
      anchorCard.className = "live2d-setting-card";
      anchorCard.innerHTML = `
        <div class="live2d-setting-header">Anchor Point</div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Anchor X:</span>
          <div class="live2d-setting-slider-container">
            <input type="range" id="live2d-anchor-x-slider" class="live2d-setting-slider" min="0" max="1" step="0.01" value="${settings.anchorX}">
            <span class="live2d-setting-value" id="live2d-anchor-x-value">${settings.anchorX}</span>
          </div>
        </div>
        <div class="live2d-setting-row">
          <span class="live2d-setting-label">Anchor Y:</span>
          <div class="live2d-setting-slider-container">
            <input type="range" id="live2d-anchor-y-slider" class="live2d-setting-slider" min="0" max="1" step="0.01" value="${settings.anchorY}">
            <span class="live2d-setting-value" id="live2d-anchor-y-value">${settings.anchorY}</span>
          </div>
        </div>
      `;
      modelSettingsSection.appendChild(anchorCard);

      // Reset Button
      const resetBtn = document.createElement("button");
      resetBtn.className = "live2d-reset-settings-btn";
      resetBtn.textContent = "Reset to Defaults";
      resetBtn.onclick = () => {
        activeModel.settings = {
          scale: 0.7,
          canvasWidth: 900,
          canvasHeight: 900,
          positionX: 50,
          positionY: 50,
          anchorX: 0.5,
          anchorY: 0.5
        };
        renderModelSettings();
      };
      modelSettingsSection.appendChild(resetBtn);
    };

    mainBody.appendChild(modelSettingsSection);

    // Cambiar sección al seleccionar en el dropdown
    sectionSelect.addEventListener("change", () => {
      const selectedSection = sectionSelect.value;
      const sections = ["general", "models", "modelSettings", "filters", "motionTest", "motionMapping", "actionMapping", "priorityConfig"];
      sections.forEach(section => {
        const sectionElement = document.getElementById(`live2d-section-${section}`);
        if (sectionElement) {
          if (section === selectedSection) {
            sectionElement.style.display = "flex";
            sectionElement.classList.add("active");
          } else {
            sectionElement.style.display = "none";
            sectionElement.classList.remove("active");
          }
        }
      });

      // Re-renderizar la tabla de modelos cuando se selecciona esa sección
      if (selectedSection === 'models') {
        setTimeout(() => renderModelsTable(), 50);
      }

      // Re-renderizar el motion mapping cuando se selecciona esa sección
      if (selectedSection === 'motionMapping') {
        setTimeout(() => renderMotionMapping(), 50);
      }

      // Re-renderizar action mapping cuando se selecciona esa sección
      if (selectedSection === 'actionMapping') {
        setTimeout(() => renderActionMapping(), 50);
      }

      // Re-renderizar priority config cuando se selecciona esa sección
      if (selectedSection === 'priorityConfig') {
        setTimeout(() => renderPriorityConfig(), 50);
      }

      // Re-renderizar model settings cuando se selecciona esa sección
      if (selectedSection === 'modelSettings') {
        setTimeout(() => renderModelSettings(), 50);
      }

      // Re-renderizar motion test cuando se selecciona esa sección
      if (selectedSection === 'motionTest') {
        setTimeout(() => renderMotionTest(), 50);
      }
    });

    // Footer (guardar/cancelar)
    const footer = document.createElement("div");
    footer.className = "live2d-modal-footer";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "live2d-modal-btn cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => { overlay.style.display = "none"; };
    const saveBtn = document.createElement("button");
    saveBtn.className = "live2d-modal-btn save";
    saveBtn.textContent = "Save Settings";
    saveBtn.onclick = () => {
      // Guardar switches
      ["enabled", "followCursor", "enableTapping", "draggable", "lipsyncOnly"].forEach(key => {
        const cb = document.getElementById(`live2d-${key}`);
        if (cb) Functions[key] = cb.checked;
      });

      // Guardar estados de filtros
      Functions.filters.outline = document.getElementById('filter-outline-enabled')?.checked || false;
      Functions.filters.pixelate = document.getElementById('filter-pixelate-enabled')?.checked || false;
      Functions.filters.crt = document.getElementById('filter-crt-enabled')?.checked || false;
      Functions.filters.noise = document.getElementById('filter-noise-enabled')?.checked || false;
      Functions.filters.alpha = document.getElementById('filter-alpha-enabled')?.checked || false;

      // Guardar parámetros de filtros
      Functions.filterParams.outline = {
        thickness: parseFloat(document.getElementById('outline-thickness')?.value || 2),
        color: document.getElementById('outline-color-text')?.value || '#0000ff'
      };
      Functions.filterParams.pixelate = {
        size: parseFloat(document.getElementById('pixelate-size')?.value || 5)
      };
      Functions.filterParams.crt = {
        curvature: parseFloat(document.getElementById('crt-curvature')?.value || 3),
        lineWidth: parseFloat(document.getElementById('crt-lineWidth')?.value || 3),
        lineContrast: parseFloat(document.getElementById('crt-lineContrast')?.value || 0.2),
        vignetting: parseFloat(document.getElementById('crt-vignetting')?.value || 0.3),
        vignettingAlpha: parseFloat(document.getElementById('crt-vignettingAlpha')?.value || 0.8),
        noise: parseFloat(document.getElementById('crt-noise')?.value || 0.1)
      };
      Functions.filterParams.noise = {
        noise: parseFloat(document.getElementById('noise-noise')?.value || 0.2)
      };
      Functions.filterParams.alpha = {
        alpha: parseFloat(document.getElementById('alpha-alpha')?.value || 0.8)
      };

      // Persistir configuración en localStorage
      localStorage.setItem('live2dFunctions', JSON.stringify({
        enabled: Functions.enabled,
        followCursor: Functions.followCursor,
        enableTapping: Functions.enableTapping,
        draggable: Functions.draggable,
        lipsyncOnly: Functions.lipsyncOnly,
        filters: Functions.filters,
        filterParams: Functions.filterParams
      }));

      // Guardar mapeos Emoción→Motion+Expression DIRECTAMENTE en el modelo activo
      const activeModel = modelsList.find(m => m.enabled);
      if (activeModel) {
        // Inicializar emotionMapping si no existe
        if (!activeModel.emotionMapping) {
          activeModel.emotionMapping = {};
        }

        // Verificar si la sección de Emotion Mapping fue renderizada para este modelo
        // Esto evita sobrescribir el mapping con datos de un modelo anterior
        const emotionMappingSection = document.getElementById('live2d-section-motionMapping');
        const renderedModelId = emotionMappingSection?.dataset?.renderedForModelId;
        const isCorrectModelRendered = renderedModelId === activeModel.id.toString();

        if (isCorrectModelRendered) {
          // Añadir metadata del modelo para validación
          activeModel.emotionMapping._modelId = activeModel.id;
          activeModel.emotionMapping._modelName = activeModel.name;

          // Guardar directamente en activeModel.emotionMapping (SIN variable global)
          EMOTION_LIST.forEach((_, index) => {
            const emotionKey = index + 1;
            const motionSelect = document.getElementById(`live2d-motion-${emotionKey}`);
            const expressionSelect = document.getElementById(`live2d-expression-${emotionKey}`);

            if (motionSelect && expressionSelect) {
              activeModel.emotionMapping[emotionKey] = {
                motion: motionSelect.value,
                expression: expressionSelect.value
              };
            }
          });

          console.log("[Live2D] Saved emotion mapping for model:", activeModel.name, "(ID:", activeModel.id + ")", activeModel.emotionMapping);
        } else {
          console.log("[Live2D] Skipping emotion mapping save - UI not rendered for current model. Keeping existing mapping for:", activeModel.name);
        }

        // Limpiar formato antiguo si existe
        if (activeModel.emotionMotionMap) {
          delete activeModel.emotionMotionMap;
        }

        // Verificar si la sección de Action Mapping fue renderizada para este modelo
        const actionMappingSection = document.getElementById('live2d-section-actionMapping');
        const actionRenderedModelId = actionMappingSection?.dataset?.renderedForModelId;
        const isCorrectActionModelRendered = actionRenderedModelId === activeModel.id.toString();

        // Guardar actionMapping del modelo activo (solo si UI está renderizada para este modelo)
        if (isCorrectActionModelRendered && activeModel.actionMapping) {
          activeModel.actionMapping.forEach(action => {
            const descTextarea = document.querySelector(`textarea[data-action-id="${action.id}"]`);
            const motionSelect = document.querySelector(`select[data-action-id="${action.id}"]`);
            const expressionSelects = document.querySelectorAll(`select[data-action-id="${action.id}"]`);
            const expressionSelect = expressionSelects[1]; // Segundo select es el de expression

            if (descTextarea) {
              action.description = descTextarea.value;
            }
            if (motionSelect) {
              action.motion = motionSelect.value;
            }
            if (expressionSelect) {
              action.expression = expressionSelect.value;
            }
          });
          console.log("[Live2D] Saved action mapping for model:", activeModel.name, activeModel.actionMapping);
        } else if (activeModel.actionMapping) {
          console.log("[Live2D] Skipping action mapping save - UI not rendered for current model. Keeping existing mapping for:", activeModel.name);
        }

        // priorityList ya está actualizado en tiempo real por el drag & drop
        console.log("[Live2D] Priority list for model:", activeModel.name, activeModel.priorityList);

        // Guardar disableSettings del modelo activo (solo si las secciones correspondientes están renderizadas)
        if (!activeModel.disableSettings) {
          activeModel.disableSettings = {
            emotionMotions: false,
            emotionExpressions: false,
            actionMotions: false,
            actionExpressions: false
          };
        }

        // Solo actualizar emotion disable settings si la sección de Emotion Mapping está renderizada para este modelo
        if (isCorrectModelRendered) {
          const emotionMotionsCheckbox = document.getElementById('live2d-disable-emotion-motions');
          const emotionExpressionsCheckbox = document.getElementById('live2d-disable-emotion-expressions');
          if (emotionMotionsCheckbox) activeModel.disableSettings.emotionMotions = emotionMotionsCheckbox.checked;
          if (emotionExpressionsCheckbox) activeModel.disableSettings.emotionExpressions = emotionExpressionsCheckbox.checked;
        }

        // Solo actualizar action disable settings si la sección de Action Mapping está renderizada para este modelo
        if (isCorrectActionModelRendered) {
          const actionMotionsCheckbox = document.getElementById('live2d-disable-action-motions');
          const actionExpressionsCheckbox = document.getElementById('live2d-disable-action-expressions');
          if (actionMotionsCheckbox) activeModel.disableSettings.actionMotions = actionMotionsCheckbox.checked;
          if (actionExpressionsCheckbox) activeModel.disableSettings.actionExpressions = actionExpressionsCheckbox.checked;
        }

        console.log("[Live2D] Saved disable settings for model:", activeModel.name, activeModel.disableSettings);

        // Auto-activar Lipsync Only si todos los motions y expressions están desactivados
        const allMotionsDisabled = activeModel.disableSettings.emotionMotions && activeModel.disableSettings.actionMotions;
        const allExpressionsDisabled = activeModel.disableSettings.emotionExpressions && activeModel.disableSettings.actionExpressions;

        if (allMotionsDisabled && allExpressionsDisabled) {
          Functions.lipsyncOnly = true;
          const lipsyncCheckbox = document.getElementById('live2d-lipsyncOnly');
          if (lipsyncCheckbox) lipsyncCheckbox.checked = true;
          console.log("[Live2D] Auto-enabled Lipsync Only mode (all motions/expressions disabled)");
        }

        // Verificar si la sección de Model Settings fue renderizada para este modelo
        const modelSettingsSection = document.getElementById('live2d-section-modelSettings');
        const settingsRenderedModelId = modelSettingsSection?.dataset?.renderedForModelId;
        const isCorrectSettingsModelRendered = settingsRenderedModelId === activeModel.id.toString();

        // Guardar los Model Settings del modelo activo (solo si UI está renderizada para este modelo)
        const scaleSlider = document.getElementById('live2d-scale-slider');
        const canvasWidthInput = document.getElementById('live2d-canvas-width');
        const canvasHeightInput = document.getElementById('live2d-canvas-height');
        const posXSlider = document.getElementById('live2d-position-x-slider');
        const posYSlider = document.getElementById('live2d-position-y-slider');
        const anchorXSlider = document.getElementById('live2d-anchor-x-slider');
        const anchorYSlider = document.getElementById('live2d-anchor-y-slider');

        if (isCorrectSettingsModelRendered && scaleSlider && canvasWidthInput && canvasHeightInput && posXSlider && posYSlider && anchorXSlider && anchorYSlider) {
          activeModel.settings = {
            scale: parseFloat(scaleSlider.value),
            canvasWidth: parseInt(canvasWidthInput.value),
            canvasHeight: parseInt(canvasHeightInput.value),
            positionX: parseFloat(posXSlider.value),
            positionY: parseFloat(posYSlider.value),
            anchorX: parseFloat(anchorXSlider.value),
            anchorY: parseFloat(anchorYSlider.value)
          };
          console.log("[Live2D] Saved model settings for model:", activeModel.name, activeModel.settings);
        } else {
          console.log("[Live2D] Skipping model settings save - UI not rendered for current model. Keeping existing settings for:", activeModel.name);
        }
      }

      // Guardar lista de modelos (con sus mapeos, motions y expressions individuales)
      localStorage.setItem('live2dModelsList', JSON.stringify(modelsList));

      console.log("[Live2D] Saved settings:", Functions);
      console.log("[Live2D] Saved filter parameters:", Functions.filterParams);
      console.log("[Live2D] Saved models list with motions and expressions");
      console.log("[Live2D] Saved models list:", modelsList);

      // Enviar nueva lista de actions al TTS script (por si cambiaron)
      sendAvailableEmotionsAndActions();

      overlay.style.display = "none";

      // Recargar el modelo para aplicar los cambios
      reloadModel();
    };
    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);

    container.appendChild(header);
    container.appendChild(mainBody);
    container.appendChild(footer);
    overlay.appendChild(container);

    overlay.style.display = "flex";

    // Configurar event listeners después de que el modal esté en el DOM
    // Event listeners for sliders to update value displays
    const setupSliderListener = (sliderId, valueId) => {
      const slider = document.getElementById(sliderId);
      const valueSpan = document.getElementById(valueId);
      if (slider && valueSpan) {
        slider.addEventListener('input', (e) => {
          valueSpan.textContent = e.target.value;
        });
      }
    };

    // Setup all slider listeners
    setupSliderListener('outline-thickness', 'outline-thickness-value');
    setupSliderListener('pixelate-size', 'pixelate-size-value');
    setupSliderListener('crt-curvature', 'crt-curvature-value');
    setupSliderListener('crt-lineWidth', 'crt-lineWidth-value');
    setupSliderListener('crt-lineContrast', 'crt-lineContrast-value');
    setupSliderListener('crt-vignetting', 'crt-vignetting-value');
    setupSliderListener('crt-vignettingAlpha', 'crt-vignettingAlpha-value');
    setupSliderListener('crt-noise', 'crt-noise-value');
    setupSliderListener('noise-noise', 'noise-noise-value');
    setupSliderListener('alpha-alpha', 'alpha-alpha-value');

    // Color picker sync
    const colorPicker = document.getElementById('outline-color-picker');
    const colorText = document.getElementById('outline-color-text');
    if (colorPicker && colorText) {
      colorPicker.addEventListener('input', (e) => {
        colorText.value = e.target.value;
      });
      colorText.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          colorPicker.value = e.target.value;
        }
      });
    }

    // Model Settings sliders and inputs listeners
    const setupModelSettingListener = () => {
      // Scale slider
      const scaleSlider = document.getElementById('live2d-scale-slider');
      const scaleValue = document.getElementById('live2d-scale-value');
      if (scaleSlider && scaleValue) {
        scaleSlider.addEventListener('input', (e) => {
          scaleValue.textContent = e.target.value;
        });
      }

      // Position X slider
      const posXSlider = document.getElementById('live2d-position-x-slider');
      const posXValue = document.getElementById('live2d-position-x-value');
      if (posXSlider && posXValue) {
        posXSlider.addEventListener('input', (e) => {
          posXValue.textContent = e.target.value + '%';
        });
      }

      // Position Y slider
      const posYSlider = document.getElementById('live2d-position-y-slider');
      const posYValue = document.getElementById('live2d-position-y-value');
      if (posYSlider && posYValue) {
        posYSlider.addEventListener('input', (e) => {
          posYValue.textContent = e.target.value + '%';
        });
      }

      // Anchor X slider
      const anchorXSlider = document.getElementById('live2d-anchor-x-slider');
      const anchorXValue = document.getElementById('live2d-anchor-x-value');
      if (anchorXSlider && anchorXValue) {
        anchorXSlider.addEventListener('input', (e) => {
          anchorXValue.textContent = e.target.value;
        });
      }

      // Anchor Y slider
      const anchorYSlider = document.getElementById('live2d-anchor-y-slider');
      const anchorYValue = document.getElementById('live2d-anchor-y-value');
      if (anchorYSlider && anchorYValue) {
        anchorYSlider.addEventListener('input', (e) => {
          anchorYValue.textContent = e.target.value;
        });
      }
    };

    // Llamar inicialmente (por si la sección ya está renderizada)
    setupModelSettingListener();

    // Re-configurar listeners cuando cambia a la sección de Model Settings
    const originalSectionChange = sectionSelect.onchange;
    sectionSelect.addEventListener('change', () => {
      if (sectionSelect.value === 'modelSettings') {
        setTimeout(() => setupModelSettingListener(), 100);
      }
    });

    // Reset buttons
    document.querySelectorAll('.live2d-filter-reset').forEach(btn => {
      btn.addEventListener('click', function() {
        const filterName = this.dataset.filter;
        const defaults = defaultFilterParams[filterName];

        if (filterName === 'outline') {
          const thicknessSlider = document.getElementById('outline-thickness');
          const thicknessValue = document.getElementById('outline-thickness-value');
          const colorPickerEl = document.getElementById('outline-color-picker');
          const colorTextEl = document.getElementById('outline-color-text');

          thicknessSlider.value = defaults.thickness;
          thicknessValue.textContent = defaults.thickness;
          colorPickerEl.value = defaults.color;
          colorTextEl.value = defaults.color;
        } else if (filterName === 'pixelate') {
          const sizeSlider = document.getElementById('pixelate-size');
          const sizeValue = document.getElementById('pixelate-size-value');

          sizeSlider.value = defaults.size;
          sizeValue.textContent = defaults.size;
        } else if (filterName === 'crt') {
          const updateCrtParam = (param) => {
            const slider = document.getElementById(`crt-${param}`);
            const value = document.getElementById(`crt-${param}-value`);
            slider.value = defaults[param];
            value.textContent = defaults[param];
          };

          updateCrtParam('curvature');
          updateCrtParam('lineWidth');
          updateCrtParam('lineContrast');
          updateCrtParam('vignetting');
          updateCrtParam('vignettingAlpha');
          updateCrtParam('noise');
        } else if (filterName === 'noise') {
          const noiseSlider = document.getElementById('noise-noise');
          const noiseValue = document.getElementById('noise-noise-value');

          noiseSlider.value = defaults.noise;
          noiseValue.textContent = defaults.noise;
        } else if (filterName === 'alpha') {
          const alphaSlider = document.getElementById('alpha-alpha');
          const alphaValue = document.getElementById('alpha-alpha-value');

          alphaSlider.value = defaults.alpha;
          alphaValue.textContent = defaults.alpha;
        }
      });
    });
  });

  const menuItems = Array.from(menuList.querySelectorAll(MENU_ITEM_CLASS));
  let inserted = false;
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    if (item.textContent && /settings|tts|voice|live2d/i.test(item.textContent)) {
      item.parentNode.insertBefore(btn, item.nextSibling);
      inserted = true;
      break;
    }
  }
  if (!inserted) menuList.appendChild(btn);
}

// Observa el DOM para inyectar el botón del menú cuando aparezca
const bodyObserver = new MutationObserver(() => {
  injectLive2DMenuItem();
});
bodyObserver.observe(document.body, { childList: true, subtree: true });

/* ==========================================================
   SECCIÓN 7. CONTENEDOR Y CANVAS DEL MODELO + ARRASRE
   ----------------------------------------------------------
   - Crea el contenedor y canvas (tamaño fijo)
   - Crea botón de arrastre externo y lógica de auto-hide
   ========================================================== */
function createContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.position = "fixed";
    document.body.appendChild(container);
  }

  let canvas = document.getElementById(CANVAS_ID);
  if (!canvas) {
    // Obtener settings del modelo activo
    const activeModel = modelsList.find(m => m.enabled);
    const canvasWidth = activeModel?.settings?.canvasWidth || 900;
    const canvasHeight = activeModel?.settings?.canvasHeight || 900;

    canvas = document.createElement("canvas");
    canvas.id = CANVAS_ID;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    container.appendChild(canvas);
  }

  // Botón de arrastre (solo visible si draggable = true)
  let dragBtn = document.getElementById(DRAG_BTN_ID);

  // Remover el botón si ya existe para recrearlo con la nueva configuración
  if (dragBtn) {
    dragBtn.remove();
    dragBtn = null;
  }

  if (Functions.draggable) {
    dragBtn = document.createElement("button");
    dragBtn.id = DRAG_BTN_ID;
    dragBtn.title = "Move model";
    dragBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move">
      <path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/>
      <path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg>`;
    document.body.appendChild(dragBtn);

    function positionDragBtn() {
      const rect = container.getBoundingClientRect();
      dragBtn.style.top = Math.max(0, rect.top - 20) + "px";
      dragBtn.style.left = (rect.right - 20) + "px";
    }
    positionDragBtn();
    window.addEventListener("resize", positionDragBtn);
    window.addEventListener("scroll", positionDragBtn);

    // Auto-hide del botón de arrastre
    let hideTimeout = null;
    let fadeTimeout = null;
    function showDragBtn() {
      clearTimeout(hideTimeout);
      clearTimeout(fadeTimeout);
      dragBtn.style.display = "flex";
      void dragBtn.offsetWidth;
      dragBtn.style.opacity = "1";
      dragBtn.style.pointerEvents = "auto";
      hideTimeout = setTimeout(() => {
        dragBtn.style.opacity = "0";
        dragBtn.style.pointerEvents = "none";
        fadeTimeout = setTimeout(() => { dragBtn.style.display = "none"; }, 400);
      }, 3000);
    }
    container.addEventListener("mouseenter", showDragBtn);
    container.addEventListener("mouseleave", () => {
      clearTimeout(hideTimeout);
      clearTimeout(fadeTimeout);
      hideTimeout = setTimeout(() => {
        dragBtn.style.opacity = "0";
        dragBtn.style.pointerEvents = "none";
        fadeTimeout = setTimeout(() => { dragBtn.style.display = "none"; }, 400);
      }, 3000);
    });
    dragBtn.addEventListener("mouseenter", showDragBtn);
    dragBtn.addEventListener("mouseleave", () => {
      if (!container.matches(":hover")) {
        clearTimeout(hideTimeout);
        clearTimeout(fadeTimeout);
        hideTimeout = setTimeout(() => {
          dragBtn.style.opacity = "0";
          dragBtn.style.pointerEvents = "none";
          fadeTimeout = setTimeout(() => { dragBtn.style.display = "none"; }, 400);
        }, 3000);
      }
    });
    showDragBtn();

    // Habilitar arrastre con el botón
    makeDraggableWithButton(container, dragBtn, positionDragBtn);
  }

  return canvas;
}

// Lógica de arrastre usando solo el botón externo
function makeDraggableWithButton(element, dragBtn, positionDragBtn) {
  if (!Functions.draggable) return;
  let isDragging = false;
  let startX, startY, startRight, startBottom;

  dragBtn.addEventListener("mousedown", function (e) {
    if (!Functions.draggable || e.button !== 0) return;
    isDragging = true;
    element.classList.add("dragging");
    startX = e.clientX;
    startY = e.clientY;
    const rect = element.getBoundingClientRect();
    startRight = window.innerWidth - rect.right;
    startBottom = window.innerHeight - rect.bottom;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    e.preventDefault();
    e.stopPropagation();
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newRight = startRight - dx;
    let newBottom = startBottom - dy;

    // Obtener el tamaño del botón de arrastre
    const btnRect = dragBtn.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    // Aplicar límites solo para que el BOTÓN no salga de la pantalla
    // El modelo puede salir, pero el botón siempre será visible
    newRight = Math.max(-element.offsetWidth + btnWidth, Math.min(window.innerWidth - btnWidth, newRight));
    newBottom = Math.max(-element.offsetHeight + btnHeight, Math.min(window.innerHeight - btnHeight, newBottom));

    element.style.right = newRight + "px";
    element.style.bottom = newBottom + "px";
    if (typeof positionDragBtn === "function") positionDragBtn();
  }

  function onMouseUp() {
    isDragging = false;
    element.classList.remove("dragging");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    if (typeof positionDragBtn === "function") positionDragBtn();
  }
}

/* ==========================================================
   SECCIÓN 8. INTEGRACIÓN CON SCRIPT TTS
   ----------------------------------------------------------
   - Notifica al TTS que Live2D está presente
   - Detecta cuando TTS está presente
   - Recibe los segmentos de audio con emociones del TTS
   ========================================================== */

// Estado de detección del TTS
let ttsScriptDetected = false;

// 1. Notificar al TTS que Live2D está listo
function notifyTTSScriptReady() {
  console.log("[Live2D] 📢 Dispatching 'Live2DScriptReady' event...");
  const event = new CustomEvent('Live2DScriptReady', {
    detail: {
      version: '2.9.1',
      capabilities: {
        emotionMotions: true,
        audioPlayback: true,
        lipSync: true,
        actionMapping: true,
        prioritySystem: true
      }
    }
  });
  window.dispatchEvent(event);
  console.log("[Live2D] ✓ 'Live2DScriptReady' event dispatched");

  // Enviar lista de emociones y acciones disponibles
  sendAvailableEmotionsAndActions();
}

// Nueva función para enviar emotions y actions al TTS
function sendAvailableEmotionsAndActions() {
  const activeModel = modelsList.find(m => m.enabled);
  if (!activeModel) {
    console.warn("[Live2D] ⚠️ No active model found, cannot send actions list");
    return;
  }

  const actions = activeModel.actionMapping
    ? activeModel.actionMapping.map(a => a.description).filter(d => d && d.trim() !== "")
    : [];

  console.log("[Live2D] 📢 Dispatching 'Live2DActionsReady' event...");
  const event = new CustomEvent('Live2DActionsReady', {
    detail: {
      emotions: EMOTION_LIST,
      actions: actions,
      modelName: activeModel.name
    }
  });
  window.dispatchEvent(event);
  console.log("[Live2D] ✓ 'Live2DActionsReady' event dispatched");
  console.log("[Live2D]   Emotions:", EMOTION_LIST.length);
  console.log("[Live2D]   Actions:", actions.length, actions);
}

// 2. Detectar cuando el script TTS está presente
window.addEventListener('TTSScriptReady', function(event) {
  if (!ttsScriptDetected) {
    ttsScriptDetected = true;
    console.log("[Live2D] ✓ TTS Script detected!");

    if (event.detail) {
      console.log("[Live2D] TTS Version:", event.detail.version);
      console.log("[Live2D] TTS Capabilities:", event.detail.capabilities);
    }
  }
});

// 3. Recibir los segmentos de audio con emociones del TTS
window.addEventListener('TTSEmotionSegmentsReady', function(event) {
  if (!event.detail || !event.detail.segments) {
    console.warn("[Live2D] ⚠️ Received 'TTSEmotionSegmentsReady' but no segments data");
    return;
  }

  const { segments, totalDuration, sampleRate } = event.detail;

  console.log("[Live2D] 🎵 Received emotion segments from TTS:");
  console.log(`  Total segments: ${segments.length}`);
  console.log(`  Total duration: ${totalDuration.toFixed(2)}s`);
  console.log(`  Sample rate: ${sampleRate}Hz`);

  segments.forEach((segment, index) => {
    console.log(`\n  Segment ${index + 1}:`);
    console.log(`    Emotion: ${segment.emotion}`);
    console.log(`    Text: "${segment.text.substring(0, 50)}${segment.text.length > 50 ? '...' : ''}"`);
    console.log(`    Blob URL: ${segment.blobUrl}`);
    console.log(`    Duration: ${segment.duration.toFixed(3)}s`);
  });

  // Reproducir los segmentos secuencialmente
  playEmotionSegmentsSequentially(segments);
});

/**
 * Reproduce los segmentos de emoción secuencialmente
 * Para cada segmento: primero inicia el motion según la emoción, luego reproduce el audio con lip-sync
 */
async function playEmotionSegmentsSequentially(segments) {
  if (!live2dModel) {
    console.error("[Live2D] ❌ Model not loaded, cannot play emotion segments");
    return;
  }

  if (!segments || segments.length === 0) {
    console.warn("[Live2D] ⚠️ No segments to play");
    return;
  }

  console.log(`[Live2D] 🎬 Starting sequential playback of ${segments.length} segments...`);

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    console.log(`\n[Live2D] 📍 Playing segment ${i + 1}/${segments.length}:`);
    console.log(`  Emotion: ${segment.emotion}`);
    console.log(`  Duration: ${segment.duration.toFixed(3)}s`);

    await playSegmentWithMotionAndLipSync(segment, i);
  }

  console.log("[Live2D] ✅ All segments playback completed!");

  // Función helper para detener todas las expressions de forma segura
  function stopAllExpressionsHelper(attemptNumber) {
    try {
      if (live2dModel && live2dModel.internalModel && live2dModel.internalModel.motionManager) {
        // Detener todas las expressions activas, si el manager existe
        if (live2dModel.internalModel.motionManager.expressionManager &&
            typeof live2dModel.internalModel.motionManager.expressionManager.stopAllExpressions === 'function') {
          live2dModel.internalModel.motionManager.expressionManager.stopAllExpressions();
          console.log(`[Live2D] 🔄 stopAllExpressions() executed (attempt ${attemptNumber})`);
        } else {
          console.warn(`[Live2D] ⚠️ expressionManager.stopAllExpressions not available (attempt ${attemptNumber})`);
        }
      } else {
        console.warn(`[Live2D] ⚠️ motionManager not available (attempt ${attemptNumber})`);
      }
    } catch (e) {
      console.error(`[Live2D] ❌ Error in stopAllExpressions (attempt ${attemptNumber}):`, e);
    }
  }

  // Resetear expression y detener completamente motions/expressions al finalizar toda la reproducción
  try {
    // Resetear expression a neutral
    if (live2dModel && live2dModel.expression) {
      live2dModel.expression(0);
      console.log("[Live2D] 🔄 Expression reset to neutral after all segments");
    }

    // Detener cualquier motion en curso
    if (live2dModel && live2dModel.internalModel && live2dModel.internalModel.motionManager) {
      console.log("[Live2D] 🔄 Stopping all motions after queue...");
      live2dModel.internalModel.motionManager.stopAllMotions();
    }

    // Primera ejecución de stopAllExpressions (inmediatamente)
    stopAllExpressionsHelper(1);

    // Segunda ejecución de stopAllExpressions (después de 150ms para estar seguro)
    setTimeout(() => {
      stopAllExpressionsHelper(2);
    }, 150);

  } catch (e) {
    console.error("[Live2D] ❌ Error resetting motion/expression:", e);
  }
}

/**
 * Reproduce un segmento individual: primero el motion, luego el audio con lip-sync
 */
function playSegmentWithMotionAndLipSync(segment, segmentIndex) {
  return new Promise((resolve, reject) => {
    try {
      const { emotion, action, blobUrl, duration, text } = segment;

      // 0. Resetear/detener cualquier motion en curso antes de iniciar el nuevo
      if (live2dModel && live2dModel.internalModel && live2dModel.internalModel.motionManager) {
        console.log(`  🔄 Stopping previous motions before segment ${segmentIndex + 1}...`);
        live2dModel.internalModel.motionManager.stopAllMotions();
      }

      // Si Lipsync Only está activo, solo hacer lipsync sin motion (pero puede incluir expression)
      if (Functions.lipsyncOnly) {
        console.log(`  🎤 Lipsync Only mode: Playing audio with lip-sync only`);

        // Obtener expression usando el sistema de prioridades (pero solo expressions, no motions)
        const activeModel = modelsList.find(m => m.enabled);
        if (!activeModel) {
          console.error(`  ❌ No active model found`);
          resolve();
          return;
        }

        const emotionIndex = EMOTION_LIST.indexOf(emotion) + 1;
        const emotionMapping = activeModel.emotionMapping ? activeModel.emotionMapping[emotionIndex] : null;

        let actionMapping = null;
        if (action && activeModel.actionMapping) {
          actionMapping = activeModel.actionMapping.find(a => a.description === action);
        }

        const priorityList = activeModel.priorityList || [];
        const disableSettings = activeModel.disableSettings || {
          emotionMotions: false,
          emotionExpressions: false,
          actionMotions: false,
          actionExpressions: false
        };

        let finalExpression = null;

        // Resolver expression usando prioridades (ignorar motions en lipsync mode)
        const sortedPriorities = [...priorityList].sort((a, b) => b.priority - a.priority);
        for (const priorityItem of sortedPriorities) {
          const { type, target } = priorityItem;

          if (target === "expression" && !finalExpression) {
            // Aplicar disable settings
            if (type === "emotion" && !disableSettings.emotionExpressions && emotionMapping && emotionMapping.expression && emotionMapping.expression !== "") {
              finalExpression = emotionMapping.expression;
            } else if (type === "action" && !disableSettings.actionExpressions && actionMapping && actionMapping.expression && actionMapping.expression !== "") {
              finalExpression = actionMapping.expression;
            }
          }
        }

        // Aplicar expression ANTES de reproducir el audio (si existe)
        if (finalExpression && finalExpression !== "") {
          const expIndex = parseInt(finalExpression, 10);
          if (!isNaN(expIndex) && live2dModel.expression) {
            try {
              live2dModel.expression(expIndex);
              console.log(`  🎭 Expression ${expIndex} applied in lipsync only mode`);
            } catch (e) {
              console.error(`  ❌ Error applying expression ${expIndex}:`, e);
            }
          }
        }

        // Reproducir audio con lipsync
        live2dModel.speak(blobUrl, {
          volume: 0.7,
          crossOrigin: "anonymous",
          onFinish: () => {
            // Resetear expression después del segmento
            if (finalExpression && finalExpression !== "" && live2dModel.expression) {
              try {
                live2dModel.expression(0); // Resetear a expression neutral (índice 0)
                console.log(`  🔄 Expression reset to neutral`);
              } catch (e) {
                console.error(`  ❌ Error resetting expression:`, e);
              }
            }
            console.log(`  ✓ Segment ${segmentIndex + 1} completed (lipsync only mode)`);
            resolve();
          },
          onError: (err) => {
            console.error(`  ❌ Error playing segment ${segmentIndex + 1}:`, err);
            resolve();
          }
        });
        return;
      }

      // Modo normal: buscar motion + expression + audio usando sistema de prioridades
      // 1. Obtener el modelo activo y sus configuraciones
      const activeModel = modelsList.find(m => m.enabled);
      if (!activeModel) {
        console.error(`  ❌ No active model found`);
        resolve();
        return;
      }

      // 2. Buscar el emotion mapping
      const emotionIndex = EMOTION_LIST.indexOf(emotion) + 1; // +1 porque el mapeo usa keys 1-27
      const emotionMapping = activeModel.emotionMapping ? activeModel.emotionMapping[emotionIndex] : null;

      // 3. Buscar el action mapping (si hay action)
      let actionMapping = null;
      if (action && activeModel.actionMapping) {
        console.log(`  🔍 Looking for action: "${action}"`);
        console.log(`  📋 Available actions:`, activeModel.actionMapping.map(a => a.description));

        actionMapping = activeModel.actionMapping.find(a => a.description === action);
        if (actionMapping) {
          console.log(`  ✓ Action found:`, actionMapping);
        } else {
          console.warn(`  ⚠️ Action "${action}" not found in actionMapping`);
          console.warn(`  Did you mean one of these?`, activeModel.actionMapping.map(a => a.description).join(', '));
        }
      } else if (action) {
        console.warn(`  ⚠️ Action "${action}" specified but no actionMapping available in model`);
      }

      // 4. Aplicar sistema de prioridades para resolver motion y expression
      const priorityList = activeModel.priorityList || [];
      const disableSettings = activeModel.disableSettings || {
        emotionMotions: false,
        emotionExpressions: false,
        actionMotions: false,
        actionExpressions: false
      };

      let finalMotion = null;
      let finalExpression = null;

      console.log(`  🎯 Resolving motion/expression with priority system...`);
      console.log(`     Emotion: "${emotion}", Action: "${action || 'none'}"`);
      console.log(`     Disable settings:`, disableSettings);
      console.log(`     Priority list:`, priorityList.map(p => `[${p.priority}] ${p.type} ${p.target}`));

      // Debug: mostrar qué datos tenemos
      if (emotionMapping) {
        console.log(`     Emotion mapping:`, emotionMapping);
      } else {
        console.log(`     No emotion mapping found for "${emotion}"`);
      }
      if (actionMapping) {
        console.log(`     Action mapping:`, actionMapping);
      }

      // Ordenar priorityList por prioridad descendente y procesar
      const sortedPriorities = [...priorityList].sort((a, b) => b.priority - a.priority);

      for (const priorityItem of sortedPriorities) {
        const { type, target, priority } = priorityItem;

        if (type === "action" && target === "motion" && !finalMotion) {
          // Priority: Action Motions (solo si no está desactivado)
          if (!disableSettings.actionMotions && actionMapping && actionMapping.motion && actionMapping.motion !== "null" && actionMapping.motion !== "") {
            finalMotion = actionMapping.motion;
            console.log(`     ✓ [Priority ${priority}] Action Motion: ${finalMotion}`);
          } else if (disableSettings.actionMotions && actionMapping && actionMapping.motion) {
            console.log(`     ⊗ [Priority ${priority}] Action Motion DISABLED by settings`);
          }
        } else if (type === "emotion" && target === "expression" && !finalExpression) {
          // Priority: Emotion Expressions (solo si no está desactivado)
          if (!disableSettings.emotionExpressions && emotionMapping && emotionMapping.expression && emotionMapping.expression !== "") {
            finalExpression = emotionMapping.expression;
            console.log(`     ✓ [Priority ${priority}] Emotion Expression: ${finalExpression}`);
          } else if (disableSettings.emotionExpressions && emotionMapping && emotionMapping.expression) {
            console.log(`     ⊗ [Priority ${priority}] Emotion Expression DISABLED by settings`);
          }
        } else if (type === "emotion" && target === "motion" && !finalMotion) {
          // Priority: Emotion Motions (solo si no está desactivado)
          if (!disableSettings.emotionMotions && emotionMapping && emotionMapping.motion && emotionMapping.motion !== "null" && emotionMapping.motion !== "") {
            finalMotion = emotionMapping.motion;
            console.log(`     ✓ [Priority ${priority}] Emotion Motion: ${finalMotion}`);
          } else if (disableSettings.emotionMotions && emotionMapping && emotionMapping.motion) {
            console.log(`     ⊗ [Priority ${priority}] Emotion Motion DISABLED by settings`);
          }
        } else if (type === "action" && target === "expression" && !finalExpression) {
          // Priority: Action Expressions (solo si no está desactivado)
          if (!disableSettings.actionExpressions && actionMapping && actionMapping.expression && actionMapping.expression !== "") {
            finalExpression = actionMapping.expression;
            console.log(`     ✓ [Priority ${priority}] Action Expression: ${finalExpression}`);
          } else if (disableSettings.actionExpressions && actionMapping && actionMapping.expression) {
            console.log(`     ⊗ [Priority ${priority}] Action Expression DISABLED by settings`);
          }
        }
      }

      console.log(`  🎭 Final resolution: Motion="${finalMotion || 'none'}", Expression="${finalExpression || 'none'}"`);

      // 5. Parsear y validar el motion final
      let motionGroup = null;
      let motionIndex = null;
      let isValidMotion = false;

      if (finalMotion && finalMotion !== "null" && finalMotion.includes(':')) {
        [motionGroup, motionIndex] = finalMotion.split(':');
        motionIndex = parseInt(motionIndex, 10);

        // Validación exhaustiva del motion
        console.log(`  🔍 Validating motion: group="${motionGroup}", index=${motionIndex}`);
        console.log(`  📚 Available motion groups:`, Object.keys(allMotions));

        // Verificar que el grupo existe (puede ser string vacío "")
        if (motionGroup in allMotions) {
          console.log(`  ✓ Motion group "${motionGroup}" exists with ${allMotions[motionGroup].length} motions`);

          // Verificar que el índice existe
          if (allMotions[motionGroup][motionIndex]) {
            console.log(`  ✓ Motion index ${motionIndex} exists in group "${motionGroup}"`);
            isValidMotion = true;
          } else {
            console.warn(`  ⚠️ Motion index ${motionIndex} NOT found in group "${motionGroup}"`);
            console.warn(`  Available indices: 0 - ${allMotions[motionGroup].length - 1}`);
          }
        } else {
          console.warn(`  ⚠️ Motion group "${motionGroup}" NOT found in allMotions`);
          console.warn(`  Did you mean one of these? ${Object.keys(allMotions).join(', ')}`);
        }
      }

      // 6. Aplicar expression ANTES del motion (si existe)
      if (finalExpression && finalExpression !== "") {
        const expIndex = parseInt(finalExpression, 10);
        if (!isNaN(expIndex) && live2dModel.expression) {
          try {
            live2dModel.expression(expIndex);
            console.log(`  🎭 Expression ${expIndex} applied before motion`);
          } catch (e) {
            console.error(`  ❌ Error applying expression ${expIndex}:`, e);
          }
        }
      }

      // 7. Iniciar el motion (si es válido)
      if (isValidMotion && live2dModel && live2dModel.motion) {
        console.log(`  ▶️ Starting motion: "${motionGroup}"[${motionIndex}] with priority 3 (forced)`);

        try {
          // Prioridad 3 = Forzado (recomendado cuando se usa audio)
          live2dModel.motion(motionGroup, motionIndex, 3, {
            sound: blobUrl,
            volume: 0.7,
            crossOrigin: "anonymous",
            onFinish: () => {
              // Resetear expression después del segmento
              if (finalExpression && finalExpression !== "" && live2dModel.expression) {
                try {
                  live2dModel.expression(0); // Resetear a expression neutral
                  console.log(`  🔄 Expression reset to neutral`);
                } catch (e) {
                  console.error(`  ❌ Error resetting expression:`, e);
                }
              }
              console.log(`  ✓ Segment ${segmentIndex + 1} completed (motion + audio + expression)`);
              resolve();
            },
            onError: (err) => {
              console.error(`  ❌ Error in motion.onError callback:`, err);
              // Continuar con el siguiente segmento incluso si hay error
              resolve();
            }
          });
        } catch (e) {
          console.error(`  ❌ Exception calling live2dModel.motion():`, e);
          console.error(`  Falling back to lip-sync only`);

          // Fallback a lipsync si falla el motion
          live2dModel.speak(blobUrl, {
            volume: 0.7,
            crossOrigin: "anonymous",
            onFinish: () => {
              if (finalExpression && finalExpression !== "" && live2dModel.expression) {
                try {
                  live2dModel.expression(0);
                } catch (e) {}
              }
              console.log(`  ✓ Segment ${segmentIndex + 1} completed (fallback lip-sync)`);
              resolve();
            },
            onError: (err) => {
              console.error(`  ❌ Error in speak():`, err);
              resolve();
            }
          });
        }
      } else {
        // 8. Si no hay motion válido, solo hacer lip-sync con el audio
        const reason = !isValidMotion ? 'Invalid motion mapping' : 'No motion specified';
        console.log(`  🎤 ${reason}, playing audio with lip-sync only`);

        live2dModel.speak(blobUrl, {
          volume: 0.7,
          crossOrigin: "anonymous",
          onFinish: () => {
            // Resetear expression después del segmento
            if (finalExpression && finalExpression !== "" && live2dModel.expression) {
              try {
                live2dModel.expression(0); // Resetear a expression neutral
                console.log(`  🔄 Expression reset to neutral`);
              } catch (e) {
                console.error(`  ❌ Error resetting expression:`, e);
              }
            }
            console.log(`  ✓ Segment ${segmentIndex + 1} completed (lip-sync only)`);
            resolve();
          },
          onError: (err) => {
            console.error(`  ❌ Error playing segment ${segmentIndex + 1}:`, err);
            resolve();
          }
        });
      }

    } catch (error) {
      console.error(`[Live2D] ❌ Exception playing segment ${segmentIndex + 1}:`, error);
      resolve(); // Continuar con el siguiente segmento
    }
  });
}

/* ==========================================================
   SECCIÓN 9. UI: DROPDOWN PARA PROBAR MOTIONS MANUALMENTE
   ----------------------------------------------------------
   - Crea un dropdown centrado con todos los motions cargados
   - Al seleccionar, detiene motions actuales y reproduce
   - No se invoca por defecto; útil para pruebas/debug
   ========================================================== */
function createMotionDropdown(allMotions, model) {
  let container = document.getElementById(MOTION_DROPDOWN_CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = MOTION_DROPDOWN_CONTAINER_ID;
    document.body.appendChild(container);
  }
  let selectElement = document.getElementById(MOTION_SELECT_ID);
  if (!selectElement) {
    selectElement = document.createElement("select");
    selectElement.id = MOTION_SELECT_ID;
    container.appendChild(selectElement);
  }

  // Opciones
  selectElement.innerHTML = '<option value="">-- Select Motion --</option>';
  for (const groupName in allMotions) {
    if (!allMotions.hasOwnProperty(groupName)) continue;
    const motionGroup = allMotions[groupName];
    if (motionGroup.length === 0) continue;

    const optgroup = document.createElement("optgroup");
    optgroup.label = groupName.replace(/_/g, ' ').toUpperCase();
    motionGroup.forEach((motion, index) => {
      const option = document.createElement("option");
      option.value = `${groupName}:${index}`;
      option.textContent = motion.File || `Motion ${index + 1}`;
      optgroup.appendChild(option);
    });
    selectElement.appendChild(optgroup);
  }

  // Reproducir al cambiar
  selectElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;
    if (!selectedValue) return;
    const [group, indexStr] = selectedValue.split(":");
    const index = parseInt(indexStr, 10);

    if (model && model.motion && model.internalModel && model.internalModel.motionManager && allMotions[group] && allMotions[group][index]) {
      console.log(`Stopping all current motions and attempting to play: Group=${group}, Index=${index}`);
      try {
        model.internalModel.motionManager.stopAllMotions(); // parar motions previos
        model.motion(group, index, 2, { sound: null });     // reproducir sin audio
      } catch (e) {
        console.error(`Error playing motion ${group}[${index}]:`, e);
        alert(`Failed to play motion "${group}" at index ${index}. Check console for details.`);
      }
    } else {
      console.warn(`Motion not found or model/motionManager not ready: ${group} [${index}]`);
    }
  });
}

/* ==========================================================
   SECCIÓN 10. CARGA DEL MODELO Live2D (PIXI + filtros + hit)
   ----------------------------------------------------------
   - Inicializa PIXI, añade modelo, centra, escala y ancla
   - Aplica filtros activos (Functions.filters.*)
   - Extrae motions/hitAreas de settings para 'allMotions'
   - Configura interacción por 'hit' si está activada
   ========================================================== */

// Variable global para mantener referencia a la aplicación PIXI
let pixiApp = null;

// Función para recargar el modelo con la configuración actual
function reloadModel() {
  console.log("[Live2D] Reloading model with new settings...");

  // Destruir el modelo anterior si existe
  if (live2dModel) {
    try {
      live2dModel.destroy();
      console.log("[Live2D] Previous model destroyed");
    } catch (e) {
      console.error("[Live2D] Error destroying model:", e);
    }
  }

  // Destruir la aplicación PIXI anterior si existe
  if (pixiApp) {
    try {
      pixiApp.destroy(true, { children: true, texture: true, baseTexture: true });
      console.log("[Live2D] Previous PIXI app destroyed");
    } catch (e) {
      console.error("[Live2D] Error destroying PIXI app:", e);
    }
  }

  // Manejar visibilidad del contenedor según enabled
  const container = document.getElementById(CONTAINER_ID);
  if (!Functions.enabled) {
    if (container) container.style.display = "none";
    const dragBtn = document.getElementById(DRAG_BTN_ID);
    if (dragBtn) dragBtn.style.display = "none";
    console.log("[Live2D] Model disabled");
    return;
  } else {
    if (container) container.style.display = "block";
  }

  // Recrear canvas
  const canvas = createContainer();

  // Obtener el modelo habilitado
  const enabledModel = modelsList.find(m => m.enabled);
  if (!enabledModel || !enabledModel.url) {
    console.error("[Live2D] No enabled model found or URL is empty");
    return;
  }

  // Asegurar que el modelo tenga su propio emotionMapping inicializado
  if (!enabledModel.emotionMapping) {
    enabledModel.emotionMapping = {};
  }
  console.log("[Live2D] Loaded emotion mapping for model:", enabledModel.name, enabledModel.emotionMapping);

  // Cargar el modelo con la nueva configuración
  live2dModel = loadLive2DModel(CANVAS_ID, enabledModel.url);

  console.log("[Live2D] Model reloaded successfully:", enabledModel.name);
}

function applyActiveFilters() {
  const filters = [];

  if (Functions.filters.outline) {
    const params = Functions.filterParams.outline;
    // Convertir color hex a número
    const colorValue = parseInt(params.color.replace('#', ''), 16);
    filters.push(new PIXI.filters.OutlineFilter(params.thickness, colorValue));
  }

  if (Functions.filters.pixelate) {
    const params = Functions.filterParams.pixelate;
    filters.push(new PIXI.filters.PixelateFilter(params.size));
  }

  if (Functions.filters.crt) {
    const params = Functions.filterParams.crt;
    filters.push(new PIXI.filters.CRTFilter({
      curvature: params.curvature,
      lineWidth: params.lineWidth,
      lineContrast: params.lineContrast,
      vignetting: params.vignetting,
      vignettingAlpha: params.vignettingAlpha,
      noise: params.noise,
      seed: Math.random()
    }));
  }

  if (Functions.filters.noise) {
    const params = Functions.filterParams.noise;
    filters.push(new PIXI.filters.NoiseFilter(params.noise));
  }

  if (Functions.filters.alpha) {
    const params = Functions.filterParams.alpha;
    filters.push(new PIXI.filters.AlphaFilter(params.alpha));
  }

  return filters;
}

function loadLive2DModel(canvasId, modelUrl) {
  // Obtener el modelo activo para usar sus settings
  const activeModel = modelsList.find(m => m.enabled);
  const modelSettings = activeModel?.settings || {
    scale: 0.7,
    canvasWidth: 900,
    canvasHeight: 900,
    positionX: 50,
    positionY: 50,
    anchorX: 0.5,
    anchorY: 0.5
  };

  const app = new PIXI.Application({
    view: document.getElementById(canvasId),
    transparent: true,
    backgroundAlpha: Functions.showFrames ? 0.25 : 0,
    autoStart: true,
    width: modelSettings.canvasWidth,
    height: modelSettings.canvasHeight,
  });

  // Guardar referencia a la aplicación PIXI
  pixiApp = app;

  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  const model = PIXI.live2d.Live2DModel.fromSync(modelUrl, {
    autoFocus: !!Functions.followCursor,
    autoHitTest: !!Functions.enableTapping,
  });

  model.once("load", () => {
    app.stage.addChild(model);

    // Escala y posición usando los settings del modelo
    model.scale.set(modelSettings.scale);
    model.x = (app.view.width * modelSettings.positionX) / 100;
    model.y = (app.view.height * modelSettings.positionY) / 100;
    model.anchor.set(modelSettings.anchorX, modelSettings.anchorY);

    // Exponer para debug en consola
    window.live2dModel = model;

    // Filtros activos
    const activeFilters = applyActiveFilters();
    if (activeFilters.length > 0) {
      model.filters = activeFilters;
      console.log("Applied Live2D filters:", Functions.filters);
    }

    // Extraer motions e hitAreas desde settings
    try {
      const settings = model.internalModel && model.internalModel.settings;
      if (settings) {
        if (settings.motions) {
          // Limpiar motions anteriores antes de cargar los nuevos
          allMotions = {};

          console.log("[Live2D] 🔍 Extracting motions from model.internalModel.settings.motions...");

          for (const [group, motionsArray] of Object.entries(settings.motions)) {
            // Importante: preservar nombres de grupos exactamente como están (incluso "" vacíos)
            allMotions[group] = motionsArray.map((motion, idx) => ({ index: idx, ...motion }));

            // Log detallado por grupo
            const groupDisplay = group === "" ? '(empty string)' : `"${group}"`;
            console.log(`  ✓ Motion group ${groupDisplay}: ${motionsArray.length} motion(s)`);
            motionsArray.forEach((motion, idx) => {
              const fileName = motion.File || motion.file || 'unknown';
              console.log(`    [${idx}] ${fileName}`);
            });
          }

          console.log("[Live2D] ✅ Total motion groups loaded:", Object.keys(allMotions).length);
          console.log("[Live2D] 📋 Motion groups list:", Object.keys(allMotions).map(g => g === "" ? "(empty)" : g));

          // Guardar motions en el modelo activo de modelsList
          const activeModel = modelsList.find(m => m.enabled);
          if (activeModel) {
            activeModel.motions = { ...allMotions };
            console.log("[Live2D] 💾 Saved motions to active model:", activeModel.name);
          }

          // Utilidad de prueba (opcional):
          // createMotionDropdown(allMotions, model);
        } else {
          console.warn("⚠️ No motions found in model.internalModel.settings.motions.");
        }

        // Extraer expressions del modelo
        if (settings.expressions) {
          // Limpiar expressions anteriores
          allExpressions = [];

          // Las expressions pueden ser un array o un objeto
          if (Array.isArray(settings.expressions)) {
            allExpressions = settings.expressions.map((expr, idx) => ({
              index: idx,
              name: expr.Name || expr.name || `Expression ${idx}`,
              ...expr
            }));
          } else if (typeof settings.expressions === 'object') {
            // Si es un objeto, convertirlo a array
            allExpressions = Object.entries(settings.expressions).map(([name, expr], idx) => ({
              index: idx,
              name: name,
              ...expr
            }));
          }

          console.log("Live2D Model Expressions (settings.expressions):", allExpressions);

          // Guardar expressions en el modelo activo de modelsList
          const activeModel = modelsList.find(m => m.enabled);
          if (activeModel) {
            activeModel.expressions = [...allExpressions];
            console.log("[Live2D] Saved expressions to active model:", activeModel.name);
          }
        } else {
          console.warn("No expressions found in model.internalModel.settings.expressions.");
          allExpressions = [];
        }

        if (settings.hitAreas) {
          console.log("Live2D Model Hit Areas (settings.hitAreas):", settings.hitAreas);
        } else {
          console.warn("No hit areas found in model.internalModel.settings.hitAreas.");
        }
      } else {
        console.warn("Model settings not found.");
      }
    } catch (e) {
      console.error("Error fetching data from settings:", e);
    }

    // Interacción por tapping/hit
    if (Functions.enableTapping) {
      model.on("hit", (hitAreaNames) => {
        console.log("Hit on:", hitAreaNames);
        if (hitAreaNames.length > 0) {
          hitAreaNames.forEach((hitArea) => {
            console.log(`Detected tap on hit area: "${hitArea}"`);
            // Añadir lógica por zona si se desea
          });
        }
      });
    }
  });

  return model;
}

/* ==========================================================
   SECCIÓN 11. BOOTSTRAP PRINCIPAL (IIFE)
   ----------------------------------------------------------
   - Carga ajustes guardados (localStorage)
   - Carga librerías, crea contenedor/canvas y modelo
   - Notifica a TTS que Live2D está listo
   ========================================================== */
(function () {
  "use strict";

  (async function main() {
    // Cargar configuración de Functions desde localStorage
    const savedFunctions = localStorage.getItem('live2dFunctions');
    if (savedFunctions) {
      const parsed = JSON.parse(savedFunctions);
      // Preservar filterParams si existe en el localStorage
      if (parsed.filterParams) {
        Object.assign(Functions.filterParams, parsed.filterParams);
      }
      Object.assign(Functions, parsed);
      console.log("[Live2D] Loaded settings from localStorage:", Functions);
    }

    // Cargar lista de modelos desde localStorage
    const savedModels = localStorage.getItem('live2dModelsList');
    if (savedModels) {
      modelsList = JSON.parse(savedModels);

      // Asegurar que cada modelo tenga su propio emotionMapping, actionMapping, priorityList y settings
      modelsList.forEach(model => {
        // Migrar formato antiguo (emotionMotionMap) al nuevo (emotionMapping)
        if (model.emotionMotionMap && !model.emotionMapping) {
          model.emotionMapping = {};
          for (const [key, value] of Object.entries(model.emotionMotionMap)) {
            model.emotionMapping[key] = {
              motion: value,
              expression: "" // Sin expression por defecto
            };
          }
          delete model.emotionMotionMap;
        }

        if (!model.emotionMapping) {
          model.emotionMapping = {};
        }

        // Inicializar actionMapping si no existe
        if (!model.actionMapping) {
          model.actionMapping = [];
        }

        // Inicializar priorityList si no existe
        if (!model.priorityList) {
          model.priorityList = [
            {priority: 4, type: "action", target: "motion", label: "Action Motions"},
            {priority: 3, type: "emotion", target: "expression", label: "Emotion Expressions"},
            {priority: 2, type: "emotion", target: "motion", label: "Emotion Motions"},
            {priority: 1, type: "action", target: "expression", label: "Action Expressions"}
          ];
        }

        // Inicializar disableSettings si no existe
        if (!model.disableSettings) {
          model.disableSettings = {
            emotionMotions: false,
            emotionExpressions: false,
            actionMotions: false,
            actionExpressions: false
          };
        }

        // Inicializar settings si no existen
        if (!model.settings) {
          model.settings = {
            scale: 0.7,
            canvasWidth: 900,
            canvasHeight: 900,
            positionX: 50,
            positionY: 50,
            anchorX: 0.5,
            anchorY: 0.5
          };
        }
      });

      console.log("[Live2D] Loaded models list:", modelsList);
    }

    // El emotionMapping ahora está DIRECTAMENTE en cada modelo (activeModel.emotionMapping)
    // NO se usa variable global
    const activeModel = modelsList.find(m => m.enabled);
    if (activeModel) {
      // Asegurar que tenga emotionMapping inicializado
      if (!activeModel.emotionMapping) {
        activeModel.emotionMapping = {};
      }
      console.log("[Live2D] Active model emotion mapping:", activeModel.name, activeModel.emotionMapping);
    }

    // Restaurar motions y expressions del modelo activo si existen
    if (activeModel) {
      if (activeModel.motions) {
        allMotions = { ...activeModel.motions };
        console.log("[Live2D] Restored motions from active model:", activeModel.name, allMotions);
      }
      if (activeModel.expressions) {
        allExpressions = [...activeModel.expressions];
        console.log("[Live2D] Restored expressions from active model:", activeModel.name, allExpressions);
      }
    }

    // Migrar mapeo antiguo si existe (retrocompatibilidad)
    const oldSavedMap = localStorage.getItem('live2dEmotionMotionMap');
    if (oldSavedMap && activeModel && Object.keys(activeModel.emotionMapping || {}).length === 0) {
      const oldMap = JSON.parse(oldSavedMap);
      activeModel.emotionMapping = {};
      for (const [key, value] of Object.entries(oldMap)) {
        activeModel.emotionMapping[key] = {
          motion: value,
          expression: ""
        };
      }
      console.log("[Live2D] Migrated old emotion mapping to active model:", activeModel.name, activeModel.emotionMapping);
      // Guardar la migración
      localStorage.setItem('live2dModelsList', JSON.stringify(modelsList));
      // Eliminar el viejo formato
      localStorage.removeItem('live2dEmotionMotionMap');
    }

    if (!Functions.enabled) {
      const container = document.getElementById(CONTAINER_ID);
      if (container) container.remove();
      const dropdownContainer = document.getElementById(MOTION_DROPDOWN_CONTAINER_ID);
      if (dropdownContainer) dropdownContainer.remove();
      const dragBtn = document.getElementById(DRAG_BTN_ID);
      if (dragBtn) dragBtn.remove();
      console.log("[Live2D] Model disabled by settings");
      return;
    }

    addStyle(MINIMAL_CSS);
    await loadLibs();

    const canvas = createContainer(); // eslint-disable-line no-unused-vars

    // Obtener el modelo habilitado
    const enabledModel = modelsList.find(m => m.enabled);
    if (!enabledModel || !enabledModel.url) {
      console.error("[Live2D] No enabled model found or URL is empty");
      return;
    }

    console.log("[Live2D] Loading model:", enabledModel.name, "from", enabledModel.url);
    live2dModel = loadLive2DModel(CANVAS_ID, enabledModel.url);

    // Notificar al TTS que Live2D está listo
    notifyTTSScriptReady();

    console.log("[Live2D] Script initialized and ready.");
  })();
})();
