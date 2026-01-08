// ==UserScript==
// @name         ChatGPT Custom UI Suite (Stable v9)
// @namespace    https://tampermonkey.net/
// @version      9.0.0
// @description  Stable themes + sidebar recolor + scrollbars + hover glow + cool theme gallery + custom backgrounds (incl. video) + subtle animations + optional sounds.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561762/ChatGPT%20Custom%20UI%20Suite%20%28Stable%20v9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561762/ChatGPT%20Custom%20UI%20Suite%20%28Stable%20v9%29.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Keep same key so your existing settings persist
  const STORAGE_KEY = "tm_chatgpt_custom_ui_v7";

  // 32 themes (popular, distinct)
  const THEMES = [
    // ===== Dark =====
    { name:"Midnight Violet", scheme:"dark", accent:"#8b5cf6", bg:"#050611", surface:"#0b1020", surface2:"#131a33", text:"#e8e7ff", muted:"#a8a3c7" },
    { name:"Tokyo Night",     scheme:"dark", accent:"#7aa2f7", bg:"#1a1b26", surface:"#24283b", surface2:"#2f3549", text:"#c0caf5", muted:"#9aa5ce" },
    { name:"Dracula",         scheme:"dark", accent:"#bd93f9", bg:"#282a36", surface:"#303241", surface2:"#3b3d52", text:"#f8f8f2", muted:"#6272a4" },
    { name:"Catppuccin Mocha",scheme:"dark", accent:"#cba6f7", bg:"#1e1e2e", surface:"#313244", surface2:"#45475a", text:"#cdd6f4", muted:"#a6adc8" },
    { name:"One Dark",        scheme:"dark", accent:"#61afef", bg:"#1e2127", surface:"#282c34", surface2:"#303541", text:"#abb2bf", muted:"#7f848e" },
    { name:"Material Ocean",  scheme:"dark", accent:"#82aaff", bg:"#0f111a", surface:"#1a1c25", surface2:"#232635", text:"#c8d3f5", muted:"#7a88cf" },
    { name:"Everforest Dark", scheme:"dark", accent:"#a7c080", bg:"#2b3339", surface:"#323c41", surface2:"#3a454a", text:"#d3c6aa", muted:"#9da9a0" },
    { name:"Rose Pine",       scheme:"dark", accent:"#eb6f92", bg:"#191724", surface:"#1f1d2e", surface2:"#26233a", text:"#e0def4", muted:"#908caa" },
    { name:"Night Owl",       scheme:"dark", accent:"#82aaff", bg:"#011627", surface:"#0b253a", surface2:"#143a52", text:"#d6deeb", muted:"#7e9bb7" },
    { name:"Monokai",         scheme:"dark", accent:"#a6e22e", bg:"#272822", surface:"#2f302a", surface2:"#3b3c35", text:"#f8f8f2", muted:"#cfcfc2" },
    { name:"Ayu Dark",        scheme:"dark", accent:"#ffcc66", bg:"#0a0e14", surface:"#111822", surface2:"#182233", text:"#bfbdb6", muted:"#5c6773" },
    { name:"Neon Cyan",       scheme:"dark", accent:"#22d3ee", bg:"#020814", surface:"#07162a", surface2:"#0b223f", text:"#e6fbff", muted:"#93c5dd" },
    { name:"Synthwave Pink",  scheme:"dark", accent:"#ff4fd8", bg:"#120018", surface:"#220028", surface2:"#34003c", text:"#ffe8fb", muted:"#ff9ae6" },
    { name:"Ember Orange",    scheme:"dark", accent:"#fb923c", bg:"#0f0703", surface:"#1a0d06", surface2:"#2a160c", text:"#fff1e6", muted:"#f1b48b" },
    { name:"Forest Green",    scheme:"dark", accent:"#22c55e", bg:"#05110a", surface:"#0a1f12", surface2:"#0f2b18", text:"#eafff1", muted:"#9bd3ad" },
    { name:"Ruby Noir",       scheme:"dark", accent:"#ef4444", bg:"#110407", surface:"#220a10", surface2:"#2f0f18", text:"#ffe7ef", muted:"#f2a7bf" },
    { name:"Ocean Deep",      scheme:"dark", accent:"#38bdf8", bg:"#031019", surface:"#082132", surface2:"#0a2c44", text:"#e6f7ff", muted:"#9ac7dd" },
    { name:"Nord",            scheme:"dark", accent:"#88c0d0", bg:"#2e3440", surface:"#3b4252", surface2:"#434c5e", text:"#eceff4", muted:"#a3b0c0" },
    { name:"Gruvbox Dark",    scheme:"dark", accent:"#fe8019", bg:"#1d2021", surface:"#282828", surface2:"#32302f", text:"#ebdbb2", muted:"#bdae93" },
    { name:"Solarized Dark",  scheme:"dark", accent:"#2aa198", bg:"#002b36", surface:"#073642", surface2:"#0b3f4c", text:"#eee8d5", muted:"#93a1a1" },
    { name:"Mono Slate",      scheme:"dark", accent:"#a3a3a3", bg:"#0b0f14", surface:"#111827", surface2:"#0f172a", text:"#e5e7eb", muted:"#9ca3af" },

    // ===== Light =====
    { name:"Arctic Light",    scheme:"light", accent:"#2563eb", bg:"#f6f7fb", surface:"#ffffff", surface2:"#eef2f7", text:"#0f172a", muted:"#475569" },
    { name:"One Light",       scheme:"light", accent:"#4078f2", bg:"#fafafa", surface:"#ffffff", surface2:"#f2f2f2", text:"#383a42", muted:"#696c77" },
    { name:"Ayu Light",       scheme:"light", accent:"#ff9940", bg:"#fafafa", surface:"#ffffff", surface2:"#f2f2f2", text:"#5c6773", muted:"#8a9199" },
    { name:"Catppuccin Latte",scheme:"light", accent:"#8839ef", bg:"#eff1f5", surface:"#ffffff", surface2:"#e6e9ef", text:"#4c4f69", muted:"#6c6f85" },
    { name:"Solarized Light", scheme:"light", accent:"#268bd2", bg:"#fdf6e3", surface:"#fffaf0", surface2:"#eee8d5", text:"#586e75", muted:"#93a1a1" },
    { name:"Lavender Light",  scheme:"light", accent:"#7c3aed", bg:"#faf5ff", surface:"#ffffff", surface2:"#f3e8ff", text:"#1f2937", muted:"#6b7280" },
    { name:"Mint Light",      scheme:"light", accent:"#10b981", bg:"#f3fbf8", surface:"#ffffff", surface2:"#e8f7f1", text:"#0b1220", muted:"#4b5563" },
    { name:"Peach Light",     scheme:"light", accent:"#f97316", bg:"#fff7ed", surface:"#ffffff", surface2:"#ffedd5", text:"#1f2937", muted:"#6b7280" },
    { name:"Paper Sepia",     scheme:"light", accent:"#b45309", bg:"#f7efe3", surface:"#fffaf2", surface2:"#f1e4d0", text:"#3a2d1f", muted:"#6b5a48" },
    { name:"GitHub Light",    scheme:"light", accent:"#0969da", bg:"#f6f8fa", surface:"#ffffff", surface2:"#f0f3f6", text:"#24292f", muted:"#57606a" },
  ];

  const DEFAULTS = {
    // Existing
    themeEnabled: true,
    presetName: "Midnight Violet",

    accent: "#8b5cf6",
    bg: "#050611",
    surface: "#0b1020",
    surface2: "#131a33",
    text: "#e8e7ff",
    muted: "#a8a3c7",
    scheme: "dark",

    radius: 18,
    fontSize: 15,
    borderStrength: 0.18,

    hideDisclaimer: true,
    hardRemoveDisclaimer: false,

    wideMode: false,
    zenMode: false,
    bubbleMode: false,
    glassMode: false,
    hidePromos: false,
    reduceMotion: false,

    hoverGlow: true,

    iconsEnabled: false,
    iconMap: {},

    // ===== Background FX (OFF by default) =====
    bgFxEnabled: false,
    bgFxType: "gradient",           // solid | gradient | image | anim | video
    bgFxSolid: "#050611",
    bgFxG1: "#050611",
    bgFxG2: "#131a33",
    bgFxG3: "#8b5cf6",
    bgFxAngle: 135,
    bgFxOpacity: 1.0,
    bgFxBlur: 0,                    // now up to 30
    bgFxImageUrl: "",
    bgFxVideoUrl: "",               // NEW
    bgFxImageFit: "cover",          // cover | contain
    bgFxAnimSpeed: 40,

    // ===== Subtle Animations (OFF by default) =====
    animEnabled: false,
    animMsgMs: 180,
    animUiMs: 120,

    // ===== Sounds (OFF, muted by default) =====
    soundsEnabled: false,
    soundsVolume: 0,
    soundsDoneOnAnyCompletion: false,
    soundSend: "soft",
    soundDone: "chime",
    soundSendUrl: "",
    soundDoneUrl: ""
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? JSON.parse(raw) : {};
      const merged = { ...DEFAULTS, ...s };

      merged.radius = clamp(Number(merged.radius ?? DEFAULTS.radius), 0, 36);
      merged.fontSize = clamp(Number(merged.fontSize ?? DEFAULTS.fontSize), 12, 20);
      merged.borderStrength = clamp(Number(merged.borderStrength ?? DEFAULTS.borderStrength), 0, 0.6);

      merged.themeEnabled = !!merged.themeEnabled;
      merged.hideDisclaimer = !!merged.hideDisclaimer;
      merged.hardRemoveDisclaimer = !!merged.hardRemoveDisclaimer;

      merged.wideMode = !!merged.wideMode;
      merged.zenMode = !!merged.zenMode;
      merged.bubbleMode = !!merged.bubbleMode;
      merged.glassMode = !!merged.glassMode;
      merged.hidePromos = !!merged.hidePromos;
      merged.reduceMotion = !!merged.reduceMotion;
      merged.hoverGlow = !!merged.hoverGlow;

      merged.iconsEnabled = !!merged.iconsEnabled;
      merged.iconMap = (merged.iconMap && typeof merged.iconMap === "object") ? merged.iconMap : {};

      merged.scheme = (merged.scheme === "light" || merged.scheme === "dark") ? merged.scheme : "dark";

      // Background FX
      merged.bgFxEnabled = !!merged.bgFxEnabled;
      merged.bgFxType = ["solid","gradient","image","anim","video"].includes(merged.bgFxType) ? merged.bgFxType : "gradient";
      merged.bgFxAngle = clamp(Number(merged.bgFxAngle ?? 135), 0, 360);
      merged.bgFxOpacity = clamp(Number(merged.bgFxOpacity ?? 1), 0, 1);
      merged.bgFxBlur = clamp(Number(merged.bgFxBlur ?? 0), 0, 30);
      merged.bgFxAnimSpeed = clamp(Number(merged.bgFxAnimSpeed ?? 40), 10, 120);
      merged.bgFxImageFit = (merged.bgFxImageFit === "contain" ? "contain" : "cover");
      merged.bgFxImageUrl = String(merged.bgFxImageUrl || "");
      merged.bgFxVideoUrl = String(merged.bgFxVideoUrl || "");

      // Animations
      merged.animEnabled = !!merged.animEnabled;
      merged.animMsgMs = clamp(Number(merged.animMsgMs ?? 180), 80, 420);
      merged.animUiMs = clamp(Number(merged.animUiMs ?? 120), 60, 300);

      // Sounds
      merged.soundsEnabled = !!merged.soundsEnabled;
      merged.soundsVolume = clamp(Number(merged.soundsVolume ?? 0), 0, 100);
      merged.soundsDoneOnAnyCompletion = !!merged.soundsDoneOnAnyCompletion;

      const sndOpt = (v) => (["off","soft","click","chime","url"].includes(v) ? v : "off");
      merged.soundSend = sndOpt(merged.soundSend);
      merged.soundDone = sndOpt(merged.soundDone);
      merged.soundSendUrl = String(merged.soundSendUrl || "");
      merged.soundDoneUrl = String(merged.soundDoneUrl || "");

      return merged;
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function addStyle(css) {
    try { if (typeof GM_addStyle === "function") return GM_addStyle(css); } catch {}
    const st = document.createElement("style");
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  // ===== CSS =====
  addStyle(`
    :root{
      --tm-accent: ${DEFAULTS.accent};
      --tm-bg: ${DEFAULTS.bg};
      --tm-surface: ${DEFAULTS.surface};
      --tm-surface2: ${DEFAULTS.surface2};
      --tm-text: ${DEFAULTS.text};
      --tm-muted: ${DEFAULTS.muted};
      --tm-radius: ${DEFAULTS.radius}px;
      --tm-font: ${DEFAULTS.fontSize}px;
      --tm-borderA: ${DEFAULTS.borderStrength};
      --tm-scheme: ${DEFAULTS.scheme};

      /* Background FX vars */
      --tm-bgfx-solid: ${DEFAULTS.bgFxSolid};
      --tm-bgfx-g1: ${DEFAULTS.bgFxG1};
      --tm-bgfx-g2: ${DEFAULTS.bgFxG2};
      --tm-bgfx-g3: ${DEFAULTS.bgFxG3};
      --tm-bgfx-angle: ${DEFAULTS.bgFxAngle}deg;
      --tm-bgfx-opacity: ${DEFAULTS.bgFxOpacity};
      --tm-bgfx-blur: ${DEFAULTS.bgFxBlur}px;
      --tm-bgfx-image: none;
      --tm-bgfx-fit: ${DEFAULTS.bgFxImageFit};
      --tm-bgfx-speed: ${DEFAULTS.bgFxAnimSpeed}s;

      /* Animation vars */
      --tm-anim-msg: ${DEFAULTS.animMsgMs}ms;
      --tm-anim-ui: ${DEFAULTS.animUiMs}ms;
    }

    /* ---- Gate classes ---- */
    html.tm-on { color-scheme: var(--tm-scheme); }
    html.tm-on, html.tm-on body{
      background: var(--tm-bg) !important;
      color: var(--tm-text) !important;
      font-size: var(--tm-font) !important;
    }

    /* ---- Map ChatGPT vars (sidebar robustness) ---- */
    html.tm-on{
      --bg-primary: var(--tm-bg) !important;
      --bg-secondary: var(--tm-surface) !important;
      --bg-tertiary: var(--tm-surface2) !important;

      --bg-elevated-secondary: var(--tm-surface) !important;
      --bg-elevated-primary: var(--tm-surface2) !important;

      --sidebar-bg: var(--tm-surface) !important;
      --sidebar-mask-bg: var(--tm-surface) !important;

      --text-primary: var(--tm-text) !important;
      --text-secondary: var(--tm-muted) !important;

      --tm-border: color-mix(in srgb, var(--tm-surface2) 78%, black) !important;
      --tm-hover:  color-mix(in srgb, var(--tm-surface2) 82%, var(--tm-accent)) !important;
    }

    /* ---- Token text ---- */
    html.tm-on .text-token-text-primary{ color: var(--tm-text) !important; }
    html.tm-on .text-token-text-secondary{ color: var(--tm-muted) !important; }
    html.tm-on .text-token-text-tertiary{
      color: color-mix(in srgb, var(--tm-muted) 70%, var(--tm-text)) !important;
    }

    /* ---- Token backgrounds ---- */
    html.tm-on .bg-token-bg-primary{ background: var(--tm-bg) !important; }
    html.tm-on .bg-token-main-surface-primary,
    html.tm-on .bg-token-surface-primary{ background: var(--tm-surface) !important; }
    html.tm-on .bg-token-main-surface-secondary,
    html.tm-on .bg-token-surface-secondary{ background: var(--tm-surface2) !important; }

    html.tm-on .bg-token-bg-elevated-secondary{ background: var(--tm-surface) !important; }
    html.tm-on .bg-token-bg-elevated-primary{ background: var(--tm-surface2) !important; }

    html.tm-on [class*="bg-(--sidebar-bg"]{ background: var(--tm-surface) !important; }
    html.tm-on [class*="bg-(--sidebar-mask-bg"]{ background: var(--tm-surface) !important; }

    /* ---- Borders ---- */
    html.tm-on .border-token-interactive-border-secondary-default,
    html.tm-on .border-token-interactive-border-primary-default,
    html.tm-on [class*="border-token-"]{
      border-color: var(--tm-border) !important;
    }

    /* ---- Links/accents ---- */
    html.tm-on :where(a, .markdown a, .prose a){ color: var(--tm-accent) !important; }

    /* ---- Hover token surface hover used in sidebar header buttons ---- */
    html.tm-on .hover\\:bg-token-surface-hover:hover{
      background: color-mix(in srgb, var(--tm-surface2) 70%, transparent) !important;
    }

    /* ---- Focus rings that are hard-coded ---- */
    html.tm-on :where(button, a, [role="button"]):focus-visible{
      outline: none !important;
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tm-accent) 70%, transparent) !important;
    }

    /* ---- Sidebar item styling ---- */
    html.tm-on :where(.__menu-item){ border-radius: 12px !important; }
    html.tm-on :where(.__menu-item.hoverable:hover, .__menu-item:hover){
      background: color-mix(in srgb, var(--tm-surface2) 78%, transparent) !important;
    }
    html.tm-on :where([data-sidebar-item="true"][data-active]){
      background: color-mix(in srgb, var(--tm-accent) 14%, var(--tm-surface2)) !important;
      border: 1px solid color-mix(in srgb, var(--tm-accent) 28%, var(--tm-border)) !important;
    }

    /* ---- Scrollbars (global) ---- */
    html.tm-on{
      scrollbar-color: color-mix(in srgb, var(--tm-accent) 55%, var(--tm-surface2)) color-mix(in srgb, var(--tm-surface) 75%, transparent);
      scrollbar-width: thin;
    }
    html.tm-on ::-webkit-scrollbar{ width: 10px; height: 10px; }
    html.tm-on ::-webkit-scrollbar-track{ background: color-mix(in srgb, var(--tm-surface) 75%, transparent); }
    html.tm-on ::-webkit-scrollbar-thumb{
      background: color-mix(in srgb, var(--tm-accent) 55%, var(--tm-surface2));
      border-radius: 999px;
      border: 2px solid color-mix(in srgb, var(--tm-surface) 78%, transparent);
    }
    html.tm-on ::-webkit-scrollbar-thumb:hover{ background: var(--tm-accent); }

    /* ===== Composer / prompt bar fix ===== */
    html.tm-on #thread-bottom{ background: var(--tm-bg) !important; }

    /* ✅ THE ONE CHANGE YOU ASKED:
       When Background FX is ON, remove that solid rectangle behind the composer area */
    html.tm-bgfx-on #thread-bottom{ background: transparent !important; }

    html.tm-on #thread-bottom form[data-type="unified-composer"] [class*="corner-superellipse"]{
      background: var(--tm-surface2) !important;
      border: 1px solid var(--tm-border) !important;
      border-radius: var(--tm-radius) !important;
      overflow: hidden !important;
      background-clip: padding-box !important;
      box-shadow: none !important;
      outline: none !important;
    }
    html.tm-on #thread-bottom form[data-type="unified-composer"] [class*="corner-superellipse"]::before,
    html.tm-on #thread-bottom form[data-type="unified-composer"] [class*="corner-superellipse"]::after{
      content: none !important;
      display: none !important;
    }
    html.tm-on #thread-bottom :where(#prompt-textarea, .ProseMirror){
      background: transparent !important;
      color: var(--tm-text) !important;
      box-shadow: none !important;
      outline: none !important;
    }

    /* Recolor bottom composer accent buttons */
    html.tm-on #thread-bottom :where(
      #composer-submit-button,
      [data-testid="send-button"],
      .composer-submit-btn,
      .composer-submit-button-color
    ):not(:disabled){
      background: var(--tm-accent) !important;
      border: 1px solid color-mix(in srgb, var(--tm-accent) 55%, black) !important;
      color: #fff !important;
      box-shadow: none !important;
    }
    html.tm-on #thread-bottom :where(.text-submit-btn-text){ color: #fff !important; }

    html.tm-on .vertical-scroll-fade-mask{
      -webkit-mask-image: none !important;
      mask-image: none !important;
    }

    /* ===== Safe disclaimer hide/remove (TARGETED ONLY) ===== */
    html.tm-hide-disclaimer [class*="view-transition-name:var(--vt-disclaimer)"]{
      display: none !important;
    }

    /* ===== Extras ===== */
    html.tm-wide [class*="--thread-content-max-width"]{ --thread-content-max-width: min(78rem, 98vw) !important; }
    html.tm-wide [class*="--thread-content-margin"]{ --thread-content-margin: 1.25rem !important; }

    html.tm-zen aside, html.tm-zen [role="navigation"]{ display: none !important; }
    html.tm-zen header{ display: none !important; }

    html.tm-reduce-motion *{
      transition: none !important;
      animation: none !important;
      scroll-behavior: auto !important;
    }

    /* ===== Hover Glow ===== */
    html.tm-on.tm-hoverglow :where(
      a, button, [role="button"],
      [data-sidebar-item="true"], .__menu-item
    ):hover{
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--tm-accent) 55%, transparent), 0 10px 26px rgba(0,0,0,.22) !important;
    }
    .tm-ui :where(a,button,[role="button"]):hover{ box-shadow: none !important; }

    /* ===== Icons replacement ===== */
    html.tm-icons-on svg.tm-icon-replaced{
      background-repeat:no-repeat !important;
      background-position:center !important;
      background-size:contain !important;
    }
    html.tm-icons-on svg.tm-icon-replaced > use{ opacity: 0 !important; }

    /* =========================================
       Background FX (overlay)
       ========================================= */
    #tm-bgfx-layer{
      display: none;
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: var(--tm-bgfx-opacity);
      filter: blur(var(--tm-bgfx-blur));
      transform: translateZ(0);
      will-change: opacity, filter, background-position;
      background: var(--tm-bgfx-solid);
      overflow: hidden;
    }
    html.tm-bgfx-on #tm-bgfx-layer{ display:block; }

    html.tm-bgfx-on, html.tm-bgfx-on body{
      background: transparent !important;
    }

    html.tm-bgfx-on[data-tm-bgfx="solid"] #tm-bgfx-layer{
      background: var(--tm-bgfx-solid);
    }
    html.tm-bgfx-on[data-tm-bgfx="gradient"] #tm-bgfx-layer{
      background: linear-gradient(var(--tm-bgfx-angle), var(--tm-bgfx-g1), var(--tm-bgfx-g2));
    }
    html.tm-bgfx-on[data-tm-bgfx="image"] #tm-bgfx-layer{
      background-color: var(--tm-bgfx-solid);
      background-image: var(--tm-bgfx-image);
      background-size: var(--tm-bgfx-fit);
      background-position: center;
      background-repeat: no-repeat;
    }

    @keyframes tmBgShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    html.tm-bgfx-on[data-tm-bgfx="anim"] #tm-bgfx-layer{
      background: linear-gradient(var(--tm-bgfx-angle), var(--tm-bgfx-g1), var(--tm-bgfx-g2), var(--tm-bgfx-g3));
      background-size: 400% 400%;
      animation: tmBgShift var(--tm-bgfx-speed) ease-in-out infinite;
    }

    /* NEW: video background */
    html.tm-bgfx-on[data-tm-bgfx="video"] #tm-bgfx-layer{
      background: var(--tm-bgfx-solid);
    }
    #tm-bgfx-layer > video#tm-bgfx-video{
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: var(--tm-bgfx-fit);
      transform: translateZ(0);
    }

    /* =========================================
       Subtle Animations
       ========================================= */
    @keyframes tmMsgFade {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    html.tm-anim :where(
      a, button, [role="button"],
      input, textarea, select,
      .__menu-item
    ){
      transition:
        background-color var(--tm-anim-ui) ease,
        border-color var(--tm-anim-ui) ease,
        color var(--tm-anim-ui) ease,
        box-shadow var(--tm-anim-ui) ease,
        transform var(--tm-anim-ui) ease;
    }

    html.tm-anim :where([data-message-author-role]){
      animation: tmMsgFade var(--tm-anim-msg) ease-out both;
    }

    html.tm-anim.tm-hoverglow :where(a, button, [role="button"], .__menu-item):hover{
      transform: translateY(-1px);
    }

    @media (prefers-reduced-motion: reduce){
      html.tm-anim :where([data-message-author-role]){ animation: none !important; }
      html.tm-anim :where(a, button, [role="button"], input, textarea, select, .__menu-item){ transition: none !important; }
      html.tm-bgfx-on[data-tm-bgfx="anim"] #tm-bgfx-layer{ animation: none !important; }
    }

    /* ===== UI styles (unchanged) ===== */
    #tm-ui-btn{
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483600;
      padding: 10px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(18,18,18,.75);
      color: #fff;
      cursor: pointer;
      font: 700 13px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      user-select:none;
    }

    #tm-ui-panel{
      position: fixed;
      right: 16px;
      bottom: 64px;
      z-index: 2147483601;
      width: 380px;
      max-height: 72vh;
      overflow: hidden;
      display: none;

      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(18,18,18,.86);
      color: #fff;
      box-shadow: 0 18px 60px rgba(0,0,0,.55);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font: 13px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    }
    #tm-ui-panel.tm-open{ display:block; }

    #tm-ui-panel .tm-head{
      display:flex; align-items:center; justify-content:space-between;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255,255,255,.12);
    }
    #tm-ui-panel .tm-title{ font-weight: 900; display:flex; align-items:center; gap:8px; }
    #tm-ui-panel .tm-close{ border:none; background:transparent; color:#fff; font-size:18px; cursor:pointer; }

    #tm-ui-panel .tm-tabs{ display:flex; gap:6px; padding: 8px 10px; border-bottom:1px solid rgba(255,255,255,.12); }
    #tm-ui-panel .tm-tab{
      flex:1; padding:7px 8px; border-radius:10px; cursor:pointer;
      border:1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      color:#fff; font-weight:700;
    }
    #tm-ui-panel .tm-tab.tm-active{ background: rgba(255,255,255,.14); }

    #tm-ui-panel .tm-body{
      padding: 10px 12px;
      max-height: calc(72vh - 96px);
      overflow: auto;
    }
    #tm-ui-panel .tm-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin: 9px 0; }
    #tm-ui-panel label{ color: rgba(255,255,255,.78); }
    #tm-ui-panel input[type="color"]{ width:44px; height:28px; padding:0; border:none; background:transparent; cursor:pointer; }
    #tm-ui-panel input[type="range"]{ width: 180px; }
    #tm-ui-panel input[type="text"], #tm-ui-panel input[type="search"]{
      width: 100%;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.12);
      color: #fff;
      border-radius: 12px;
      padding: 8px 10px;
    }
    #tm-ui-panel select, #tm-ui-panel textarea{
      width: 100%;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.12);
      color: #fff;
      border-radius: 12px;
      padding: 8px 10px;
    }
    #tm-ui-panel textarea{
      min-height: 130px;
      resize: vertical;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
    }
    #tm-ui-panel .tm-actions{ display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
    #tm-ui-panel .tm-actions button{
      flex: 1 1 48%;
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.10);
      color:#fff;
      cursor:pointer;
      font-weight: 800;
    }
    #tm-ui-panel .tm-actions button:hover{ background: rgba(255,255,255,.16); }

    /* ===== Theme Gallery ===== */
    #tm-theme-overlay{
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: none;
      background: rgba(0,0,0,.58);
      backdrop-filter: blur(7px);
      -webkit-backdrop-filter: blur(7px);
    }
    #tm-theme-overlay.tm-open{ display:flex; align-items:center; justify-content:center; padding: 18px; }

    #tm-theme-modal{
      width: min(980px, 96vw);
      max-height: 86vh;
      overflow: hidden;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(18,18,18,.92);
      color:#fff;
      box-shadow: 0 25px 90px rgba(0,0,0,.65);
      display:flex;
      flex-direction: column;
    }
    #tm-theme-head{
      padding: 12px 14px;
      display:flex;
      align-items:center;
      justify-content: space-between;
      gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,.12);
    }
    #tm-theme-head .left{ display:flex; flex-direction:column; gap:2px; }
    #tm-theme-head .left strong{ font-size: 14px; }
    #tm-theme-head .left span{ font-size: 12px; opacity: .78; }
    #tm-theme-head .right{ display:flex; gap:10px; align-items:center; }
    #tm-theme-search{
      width: 320px;
      padding: 8px 10px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.08);
      color:#fff;
    }
    #tm-theme-body{
      padding: 14px;
      overflow: auto;
    }
    #tm-theme-grid{
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 12px;
    }
    .tm-theme-card{
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      overflow:hidden;
      cursor:pointer;
      transition: transform .08s ease, background .08s ease, border-color .08s ease;
    }
    .tm-theme-card:hover{
      transform: translateY(-1px);
      background: rgba(255,255,255,.10);
      border-color: rgba(255,255,255,.22);
    }
    .tm-theme-prev{
      height: 92px;
      position: relative;
    }
    .tm-theme-chip{
      position:absolute;
      left: 10px;
      top: 10px;
      padding: 6px 8px;
      border-radius: 999px;
      font-size: 11px;
      background: rgba(0,0,0,.32);
      border: 1px solid rgba(255,255,255,.14);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .tm-theme-badge{
      position:absolute;
      right: 10px;
      top: 10px;
      padding: 6px 8px;
      border-radius: 999px;
      font-size: 11px;
      background: rgba(0,0,0,.32);
      border: 1px solid rgba(255,255,255,.14);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: .95;
    }
    .tm-theme-meta{
      padding: 10px 10px 12px;
      display:flex;
      flex-direction: column;
      gap: 4px;
    }
    .tm-theme-meta strong{ font-size: 13px; }
    .tm-theme-meta span{ font-size: 12px; opacity: .75; }
  `);

  function applyRootVars() {
    const root = document.documentElement;
    root.style.setProperty("--tm-accent", state.accent);
    root.style.setProperty("--tm-bg", state.bg);
    root.style.setProperty("--tm-surface", state.surface);
    root.style.setProperty("--tm-surface2", state.surface2);
    root.style.setProperty("--tm-text", state.text);
    root.style.setProperty("--tm-muted", state.muted);
    root.style.setProperty("--tm-radius", `${state.radius}px`);
    root.style.setProperty("--tm-font", `${state.fontSize}px`);
    root.style.setProperty("--tm-borderA", String(state.borderStrength));
    root.style.setProperty("--tm-scheme", state.scheme);

    root.style.setProperty("--tm-bgfx-solid", state.bgFxSolid || state.bg);
    root.style.setProperty("--tm-bgfx-g1", state.bgFxG1 || state.bg);
    root.style.setProperty("--tm-bgfx-g2", state.bgFxG2 || state.surface2);
    root.style.setProperty("--tm-bgfx-g3", state.bgFxG3 || state.accent);
    root.style.setProperty("--tm-bgfx-angle", `${state.bgFxAngle}deg`);
    root.style.setProperty("--tm-bgfx-opacity", String(state.bgFxOpacity));
    root.style.setProperty("--tm-bgfx-blur", `${state.bgFxBlur}px`);
    root.style.setProperty("--tm-bgfx-fit", state.bgFxImageFit === "contain" ? "contain" : "cover");
    root.style.setProperty("--tm-bgfx-speed", `${state.bgFxAnimSpeed}s`);
    root.style.setProperty("--tm-bgfx-image", state.bgFxImageUrl ? `url("${state.bgFxImageUrl.replaceAll('"', '%22')}")` : "none");

    root.style.setProperty("--tm-anim-msg", `${state.animMsgMs}ms`);
    root.style.setProperty("--tm-anim-ui", `${state.animUiMs}ms`);
  }

  function applyClasses() {
    const html = document.documentElement;

    html.classList.toggle("tm-on", state.themeEnabled);
    html.classList.toggle("tm-hide-disclaimer", state.hideDisclaimer);

    html.classList.toggle("tm-wide", state.wideMode);
    html.classList.toggle("tm-zen", state.zenMode);
    html.classList.toggle("tm-bubbles", state.bubbleMode);
    html.classList.toggle("tm-glass", state.glassMode);

    html.classList.toggle("tm-hide-promos", state.hidePromos);
    html.classList.toggle("tm-reduce-motion", state.reduceMotion);

    html.classList.toggle("tm-hoverglow", state.hoverGlow);

    html.classList.toggle("tm-icons-on", state.iconsEnabled);

    // Background FX + Animations
    html.classList.toggle("tm-bgfx-on", state.bgFxEnabled);
    if (state.bgFxEnabled) html.dataset.tmBgfx = state.bgFxType;
    else delete html.dataset.tmBgfx;

    html.classList.toggle("tm-anim", state.animEnabled && !state.reduceMotion);
  }

  const DISCLAIMER_SELECTOR = '[class*="view-transition-name:var(--vt-disclaimer)"]';
  function hardRemoveDisclaimer() {
    if (!state.hardRemoveDisclaimer) return;
    document.querySelectorAll(DISCLAIMER_SELECTOR).forEach(el => el.remove());
  }

  function ensureBgFxLayer() {
    // If disabled, also stop video if any
    if (!state.bgFxEnabled) {
      const vid = document.getElementById("tm-bgfx-video");
      if (vid) {
        try { vid.pause(); } catch {}
        try { vid.removeAttribute("src"); vid.load(); } catch {}
        vid.remove();
      }
      return;
    }

    let layer = document.getElementById("tm-bgfx-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.id = "tm-bgfx-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.prepend(layer);
    }

    syncBgFxVideo();
  }

  function shouldReduceMotionNow() {
    if (state.reduceMotion) return true;
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  }

  function syncBgFxVideo() {
    const layer = document.getElementById("tm-bgfx-layer");
    if (!layer) return;

    const needVideo =
      state.bgFxEnabled &&
      state.bgFxType === "video" &&
      !!state.bgFxVideoUrl;

    let vid = document.getElementById("tm-bgfx-video");

    if (!needVideo) {
      if (vid) {
        try { vid.pause(); } catch {}
        try { vid.removeAttribute("src"); vid.load(); } catch {}
        vid.remove();
      }
      return;
    }

    if (!vid) {
      vid = document.createElement("video");
      vid.id = "tm-bgfx-video";
      vid.setAttribute("playsinline", "");
      vid.muted = true;
      vid.loop = true;
      vid.autoplay = true;
      vid.preload = "metadata";
      layer.appendChild(vid);
    }

    // Update src only if changed (avoid reload spam)
    const next = state.bgFxVideoUrl.trim();
    if (next && vid.dataset.tmSrc !== next) {
      vid.dataset.tmSrc = next;
      try {
        vid.src = next;
      } catch {}
    }

    // Respect reduced-motion by pausing video
    if (shouldReduceMotionNow()) {
      try { vid.pause(); } catch {}
    } else {
      // Try to play silently; ignore failures due to autoplay policy
      try { vid.play().catch(() => {}); } catch {}
    }
  }

  // ===== Icon swapping (unchanged) =====
  function getUseHref(useEl) {
    return useEl.getAttribute("href") || useEl.getAttribute("xlink:href") || "";
  }
  function getIconKeys(svg, useEl) {
    const keys = [];
    const href = getUseHref(useEl);
    const sym = href.includes("#") ? href.split("#").pop() : "";
    if (sym) keys.push(`symbol:${sym}`);

    const host = svg.closest("button,a,[role='button']") || svg;
    const testid = host.getAttribute("data-testid") || "";
    const aria = host.getAttribute("aria-label") || "";
    const id = host.id || "";

    if (testid) keys.unshift(`testid:${testid}`);
    if (id) keys.unshift(`id:${id}`);
    if (aria) keys.unshift(`aria:${aria}`);

    keys.push("*");
    return keys;
  }
  function applyIconSwaps() {
    if (!state.iconsEnabled) return;

    const iconMap = (state.iconMap && typeof state.iconMap === "object") ? state.iconMap : {};
    const uses = document.querySelectorAll("svg use[href], svg use[xlink\\:href]");

    uses.forEach((useEl) => {
      if (useEl.closest("#tm-ui-panel") || useEl.closest("#tm-theme-overlay")) return;

      const svg = useEl.closest("svg");
      if (!svg) return;

      const keys = getIconKeys(svg, useEl);
      let url = "";
      for (const k of keys) {
        if (typeof iconMap[k] === "string" && iconMap[k].trim()) { url = iconMap[k].trim(); break; }
      }

      if (!url) {
        if (svg.classList.contains("tm-icon-replaced")) {
          svg.classList.remove("tm-icon-replaced");
          svg.style.backgroundImage = "";
        }
        return;
      }

      svg.classList.add("tm-icon-replaced");
      svg.style.backgroundImage = `url("${url.replaceAll('"', '%22')}")`;
      svg.style.backgroundSize = "contain";
      svg.style.backgroundRepeat = "no-repeat";
      svg.style.backgroundPosition = "center";
    });
  }
  function scanIconSymbols() {
    const set = new Map();
    document.querySelectorAll("svg use[href], svg use[xlink\\:href]").forEach(useEl => {
      if (useEl.closest("#tm-ui-panel") || useEl.closest("#tm-theme-overlay")) return;
      const href = getUseHref(useEl);
      if (!href.includes("#")) return;
      const sym = href.split("#").pop();
      if (!sym) return;
      set.set(sym, (set.get(sym) || 0) + 1);
    });
    return [...set.entries()].sort((a,b) => b[1]-a[1]);
  }

  // ===== Sounds system (unchanged from v8) =====
  let soundInit = false;
  let audioCtx = null;
  let lastSoundAt = { send: 0, done: 0 };
  let pendingAssistant = false;
  let wasGenerating = false;
  let genStartAt = 0;
  let lastSendAt = 0;

  function canPlaySounds() {
    return state.soundsEnabled && state.soundsVolume > 0 && document.visibilityState === "visible";
  }

  function ensureAudioContext() {
    if (audioCtx) return audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try { audioCtx = new Ctx(); return audioCtx; } catch { return null; }
  }

  async function unlockAudioIfNeeded() {
    const ctx = ensureAudioContext();
    if (!ctx) return false;
    try {
      if (ctx.state === "suspended") await ctx.resume();
      return true;
    } catch { return false; }
  }

  function playSynth(preset, volume01) {
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.value = 0.0001;
    g.connect(ctx.destination);

    const o = ctx.createOscillator();
    o.connect(g);

    if (preset === "click") {
      o.type = "square";
      o.frequency.setValueAtTime(520, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.06 * volume01), now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      o.start(now);
      o.stop(now + 0.06);
      return;
    }

    if (preset === "soft") {
      o.type = "sine";
      o.frequency.setValueAtTime(440, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.08 * volume01), now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      o.start(now);
      o.stop(now + 0.13);
      return;
    }

    // chime
    o.type = "sine";
    o.frequency.setValueAtTime(523.25, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.08 * volume01), now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.start(now);
    o.stop(now + 0.20);

    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(659.25, now + 0.03);
    const g2 = ctx.createGain();
    g2.gain.value = 0.0001;
    o2.connect(g2);
    g2.connect(ctx.destination);
    g2.gain.setValueAtTime(0.0001, now + 0.03);
    g2.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.06 * volume01), now + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    o2.start(now + 0.03);
    o2.stop(now + 0.24);
  }

  function playUrl(url, volume01) {
    try {
      const a = new Audio(url);
      a.volume = clamp(volume01, 0, 1);
      a.play().catch(() => {});
    } catch {}
  }

  async function playSound(kind, force = false) {
    if (!force && !canPlaySounds()) return;

    const now = Date.now();
    if (!force && now - (lastSoundAt[kind] || 0) < 250) return;
    lastSoundAt[kind] = now;

    const ok = await unlockAudioIfNeeded();
    if (!ok) return;

    const volume01 = clamp(state.soundsVolume / 100, 0, 1);

    let mode = "off";
    let url = "";
    if (kind === "send") { mode = state.soundSend; url = state.soundSendUrl; }
    if (kind === "done") { mode = state.soundDone; url = state.soundDoneUrl; }

    if (mode === "off") return;
    if (mode === "url" && url) return playUrl(url, volume01);
    return playSynth(mode, volume01);
  }

  function initSoundSystemOnce() {
    if (soundInit) return;
    soundInit = true;

    const unlockOnce = () => { unlockAudioIfNeeded(); };
    document.addEventListener("pointerdown", unlockOnce, { capture: true, once: true });
    document.addEventListener("keydown", unlockOnce, { capture: true, once: true });

    document.addEventListener("submit", (e) => {
      if (!state.soundsEnabled) return;

      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;

      const isComposer =
        form.matches('form[data-type="unified-composer"]') ||
        !!form.querySelector("#prompt-textarea") ||
        !!form.querySelector('[name="prompt-textarea"]');

      if (!isComposer) return;

      pendingAssistant = true;
      lastSendAt = Date.now();
      playSound("send");
    }, true);
  }

  function findStopButtonInComposer() {
    const root = document.getElementById("thread-bottom") || document.body;
    const sels = [
      'button[data-testid*="stop"]',
      'button[aria-label*="Stop"]',
      'button[name*="stop"]'
    ];
    for (const sel of sels) {
      const b = root.querySelector(sel);
      if (b) return b;
    }
    return null;
  }

  function updateGenerationStateForSounds() {
    if (!state.soundsEnabled) {
      wasGenerating = false;
      pendingAssistant = false;
      return;
    }

    const isNowGenerating = !!findStopButtonInComposer();
    const t = Date.now();

    if (!wasGenerating && isNowGenerating) {
      wasGenerating = true;
      genStartAt = t;
      return;
    }

    if (wasGenerating && !isNowGenerating) {
      wasGenerating = false;

      const elapsed = t - genStartAt;
      const sentRecently = (t - lastSendAt) < 5 * 60 * 1000;

      if (elapsed > 600 && (state.soundsDoneOnAnyCompletion || (pendingAssistant && sentRecently))) {
        playSound("done");
      }

      pendingAssistant = false;
    }
  }

  // ===== UI helpers =====
  function el(tag, attrs = {}, children = []) {
    const n = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, String(v));
    }
    for (const c of children) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    return n;
  }
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  // ===== Theme Gallery (unchanged) =====
  function ensureThemeGallery() {
    if (document.getElementById("tm-theme-overlay")) return;

    const overlay = el("div", { id:"tm-theme-overlay", class:"tm-ui" });
    const modal = el("div", { id:"tm-theme-modal" });

    modal.innerHTML = `
      <div id="tm-theme-head">
        <div class="left">
          <strong>Themes Gallery</strong>
          <span>Named presets with a real preview. Scrollable. Searchable.</span>
        </div>
        <div class="right">
          <input id="tm-theme-search" type="search" placeholder="Search themes..." />
          <button id="tm-theme-close" type="button" style="padding:8px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.10);color:#fff;cursor:pointer;font-weight:800;">Close</button>
        </div>
      </div>
      <div id="tm-theme-body">
        <div id="tm-theme-grid"></div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    $("#tm-theme-close", overlay).addEventListener("click", () => overlay.classList.remove("tm-open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("tm-open"); });

    const search = $("#tm-theme-search", overlay);
    search.addEventListener("input", () => renderThemeGallery(search.value));
    renderThemeGallery("");
  }

  function themePreviewNode(t) {
    const prev = document.createElement("div");
    prev.className = "tm-theme-prev";
    prev.style.background = `linear-gradient(135deg, ${t.bg}, ${t.surface2})`;

    const top = document.createElement("div");
    top.style.position = "absolute";
    top.style.left = "10px";
    top.style.right = "10px";
    top.style.top = "14px";
    top.style.height = "16px";
    top.style.borderRadius = "10px";
    top.style.background = t.surface;

    const bubble = document.createElement("div");
    bubble.style.position = "absolute";
    bubble.style.left = "10px";
    bubble.style.top = "40px";
    bubble.style.width = "72%";
    bubble.style.height = "18px";
    bubble.style.borderRadius = "12px";
    bubble.style.background = t.surface2;

    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.left = "18px";
    line.style.top = "46px";
    line.style.width = "44%";
    line.style.height = "3px";
    line.style.borderRadius = "999px";
    line.style.background = t.scheme === "light" ? "rgba(15,23,42,.35)" : "rgba(255,255,255,.22)";

    const accent = document.createElement("div");
    accent.style.position = "absolute";
    accent.style.right = "10px";
    accent.style.bottom = "12px";
    accent.style.width = "74px";
    accent.style.height = "20px";
    accent.style.borderRadius = "999px";
    accent.style.background = t.accent;

    prev.appendChild(top);
    prev.appendChild(bubble);
    prev.appendChild(line);
    prev.appendChild(accent);
    return prev;
  }

  function renderThemeGallery(query) {
    ensureThemeGallery();
    const overlay = document.getElementById("tm-theme-overlay");
    const grid = $("#tm-theme-grid", overlay);
    if (!grid) return;

    const q = (query || "").trim().toLowerCase();
    const list = q ? THEMES.filter(t => t.name.toLowerCase().includes(q) || t.scheme.includes(q)) : THEMES;

    const activeName = state.themeEnabled ? (state.presetName || "__custom__") : "ChatGPT Default";
    grid.innerHTML = "";

    // Default card
    {
      const card = document.createElement("div");
      card.className = "tm-theme-card";
      const prev = document.createElement("div");
      prev.className = "tm-theme-prev";
      prev.style.background = "linear-gradient(135deg,#111827,#374151)";

      const chip = document.createElement("div");
      chip.className = "tm-theme-chip";
      chip.textContent = "ChatGPT Default";

      const badge = document.createElement("div");
      badge.className = "tm-theme-badge";
      badge.textContent = (activeName === "ChatGPT Default") ? "Active" : "Default";

      prev.appendChild(chip);
      prev.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "tm-theme-meta";
      meta.innerHTML = `<strong>ChatGPT Default</strong><span>Turns OFF theme overrides</span>`;

      card.appendChild(prev);
      card.appendChild(meta);

      card.addEventListener("click", () => {
        state.themeEnabled = false;
        state.presetName = "ChatGPT Default";
        saveState();
        applyAll();
        overlay.classList.remove("tm-open");
      });

      grid.appendChild(card);
    }

    for (const t of list) {
      const card = document.createElement("div");
      card.className = "tm-theme-card";

      const prev = themePreviewNode(t);

      const chip = document.createElement("div");
      chip.className = "tm-theme-chip";
      chip.textContent = t.name;

      const badge = document.createElement("div");
      badge.className = "tm-theme-badge";
      badge.textContent = (activeName === t.name) ? "Active" : (t.scheme === "light" ? "Light" : "Dark");

      prev.appendChild(chip);
      prev.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "tm-theme-meta";
      meta.innerHTML = `<strong>${escapeHtml(t.name)}</strong><span>Accent ${escapeHtml(t.accent)} • ${escapeHtml(t.scheme)}</span>`;

      card.appendChild(prev);
      card.appendChild(meta);

      card.addEventListener("click", () => {
        state.themeEnabled = true;
        state.presetName = t.name;
        state.scheme = t.scheme;
        state.accent = t.accent;
        state.bg = t.bg;
        state.surface = t.surface;
        state.surface2 = t.surface2;
        state.text = t.text;
        state.muted = t.muted;

        // keep bgfx palette aligned (bgfx still OFF unless user enables)
        state.bgFxSolid = t.bg;
        state.bgFxG1 = t.bg;
        state.bgFxG2 = t.surface2;
        state.bgFxG3 = t.accent;

        saveState();
        applyAll();
        overlay.classList.remove("tm-open");
      });

      grid.appendChild(card);
    }
  }

  function openThemeGallery() {
    ensureThemeGallery();
    const panel = document.getElementById("tm-ui-panel");
    if (panel) panel.classList.remove("tm-open");

    const overlay = document.getElementById("tm-theme-overlay");
    overlay.classList.add("tm-open");

    const search = $("#tm-theme-search", overlay);
    if (search) { search.value = ""; search.focus(); renderThemeGallery(""); }
  }

  // ===== UI PANEL (Theme/Tweaks/FX/Icons) =====
  function ensureUI() {
    if (document.getElementById("tm-ui-btn")) return;

    const btn = el("button", { id:"tm-ui-btn", class:"tm-ui", type:"button", title:"Open Custom UI" }, ["🎨 UI"]);
    const panel = el("div", { id:"tm-ui-panel", class:"tm-ui" });

    panel.innerHTML = `
      <div class="tm-head">
        <div class="tm-title">🎨 Custom UI <span style="opacity:.7;font-weight:800;">v9</span></div>
        <button class="tm-close" type="button" title="Close">×</button>
      </div>
      <div class="tm-tabs">
        <button class="tm-tab tm-active" data-tab="theme" type="button">Theme</button>
        <button class="tm-tab" data-tab="tweaks" type="button">Tweaks</button>
        <button class="tm-tab" data-tab="fx" type="button">FX</button>
        <button class="tm-tab" data-tab="icons" type="button">Icons</button>
      </div>
      <div class="tm-body">
        <div class="tm-page" data-page="theme"></div>
        <div class="tm-page" data-page="tweaks" style="display:none;"></div>
        <div class="tm-page" data-page="fx" style="display:none;"></div>
        <div class="tm-page" data-page="icons" style="display:none;"></div>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const togglePanel = () => panel.classList.toggle("tm-open");
    const closePanel = () => panel.classList.remove("tm-open");

    btn.addEventListener("click", togglePanel);
    $(".tm-close", panel).addEventListener("click", closePanel);

    $$(".tm-tab", panel).forEach(tab => {
      tab.addEventListener("click", () => {
        $$(".tm-tab", panel).forEach(t => t.classList.remove("tm-active"));
        tab.classList.add("tm-active");
        const name = tab.getAttribute("data-tab");
        $$(".tm-page", panel).forEach(p => p.style.display = (p.getAttribute("data-page") === name) ? "block" : "none");
      });
    });

    buildThemePage($('[data-page="theme"]', panel));
    buildTweaksPage($('[data-page="tweaks"]', panel));
    buildFxPage($('[data-page="fx"]', panel));
    buildIconsPage($('[data-page="icons"]', panel));

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePanel();
        const overlay = document.getElementById("tm-theme-overlay");
        if (overlay) overlay.classList.remove("tm-open");
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "u") togglePanel();
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "g") openThemeGallery();
    });

    btn.addEventListener("click", () => {
      const overlay = document.getElementById("tm-theme-overlay");
      if (overlay) overlay.classList.remove("tm-open");
    });
  }

  function buildThemePage(root) {
    root.innerHTML = `
      <div class="tm-row"><label><b>Enable custom theme</b></label><input id="tm-theme-enabled" type="checkbox"></div>
      <div class="tm-row"><label>Preset</label><select id="tm-preset"></select></div>

      <div class="tm-actions">
        <button id="tm-open-gallery" type="button">Themes Gallery</button>
        <button id="tm-default" type="button">ChatGPT Default</button>
      </div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:12px 0;">

      <div class="tm-row"><label>Accent</label><input id="tm-accent" type="color"></div>
      <div class="tm-row"><label>Background</label><input id="tm-bg" type="color"></div>
      <div class="tm-row"><label>Surface</label><input id="tm-surface" type="color"></div>
      <div class="tm-row"><label>Surface 2</label><input id="tm-surface2" type="color"></div>
      <div class="tm-row"><label>Text</label><input id="tm-text" type="color"></div>
      <div class="tm-row"><label>Muted</label><input id="tm-muted" type="color"></div>

      <div class="tm-row"><label>Radius</label><input id="tm-radius" type="range" min="0" max="36" step="1"></div>
      <div class="tm-row"><label>Font size</label><input id="tm-font" type="range" min="12" max="20" step="1"></div>
      <div class="tm-row"><label>Border strength</label><input id="tm-border" type="range" min="0" max="0.6" step="0.01"></div>

      <div class="tm-actions">
        <button id="tm-random" type="button">Random theme</button>
        <button id="tm-export" type="button">Export config</button>
      </div>
    `;

    const presetSel = $("#tm-preset", root);
    presetSel.innerHTML = `
      <option value="__default__">ChatGPT Default (no theme)</option>
      ${THEMES.map(t => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)} (${t.scheme})</option>`).join("")}
      <option value="__custom__">Custom (current)</option>
    `;

    $("#tm-theme-enabled", root).checked = state.themeEnabled;

    $("#tm-accent", root).value = state.accent;
    $("#tm-bg", root).value = state.bg;
    $("#tm-surface", root).value = state.surface;
    $("#tm-surface2", root).value = state.surface2;
    $("#tm-text", root).value = state.text;
    $("#tm-muted", root).value = state.muted;

    $("#tm-radius", root).value = String(state.radius);
    $("#tm-font", root).value = String(state.fontSize);
    $("#tm-border", root).value = String(state.borderStrength);

    presetSel.value = state.themeEnabled ? (state.presetName || "__custom__") : "__default__";
    if (![...presetSel.options].some(o => o.value === presetSel.value)) presetSel.value = "__custom__";

    const markCustom = () => {
      state.themeEnabled = true;
      state.presetName = "__custom__";
      $("#tm-theme-enabled", root).checked = true;
      presetSel.value = "__custom__";
    };

    $("#tm-theme-enabled", root).addEventListener("change", (e) => {
      state.themeEnabled = !!e.target.checked;
      if (!state.themeEnabled) presetSel.value = "__default__";
      saveState(); applyAll();
    });

    presetSel.addEventListener("change", () => {
      const v = presetSel.value;
      if (v === "__default__") {
        state.themeEnabled = false;
        state.presetName = "ChatGPT Default";
        saveState(); applyAll();
        $("#tm-theme-enabled", root).checked = false;
        return;
      }
      if (v === "__custom__") {
        state.themeEnabled = true;
        state.presetName = "__custom__";
        saveState(); applyAll();
        $("#tm-theme-enabled", root).checked = true;
        return;
      }
      const t = THEMES.find(x => x.name === v);
      if (t) {
        state.themeEnabled = true;
        state.presetName = t.name;
        state.scheme = t.scheme;
        state.accent = t.accent;
        state.bg = t.bg;
        state.surface = t.surface;
        state.surface2 = t.surface2;
        state.text = t.text;
        state.muted = t.muted;

        state.bgFxSolid = t.bg;
        state.bgFxG1 = t.bg;
        state.bgFxG2 = t.surface2;
        state.bgFxG3 = t.accent;

        saveState(); applyAll();

        $("#tm-theme-enabled", root).checked = true;
        $("#tm-accent", root).value = state.accent;
        $("#tm-bg", root).value = state.bg;
        $("#tm-surface", root).value = state.surface;
        $("#tm-surface2", root).value = state.surface2;
        $("#tm-text", root).value = state.text;
        $("#tm-muted", root).value = state.muted;
      }
    });

    [["#tm-accent","accent"],["#tm-bg","bg"],["#tm-surface","surface"],["#tm-surface2","surface2"],["#tm-text","text"],["#tm-muted","muted"]]
      .forEach(([id,key]) => {
        $(id, root).addEventListener("input", (e) => {
          markCustom();
          state[key] = e.target.value;
          if (key === "bg") state.bgFxSolid = e.target.value;
          saveState(); applyAll();
        });
      });

    $("#tm-radius", root).addEventListener("input", (e) => { markCustom(); state.radius = clamp(+e.target.value,0,36); saveState(); applyAll(); });
    $("#tm-font", root).addEventListener("input", (e) => { markCustom(); state.fontSize = clamp(+e.target.value,12,20); saveState(); applyAll(); });
    $("#tm-border", root).addEventListener("input", (e) => { markCustom(); state.borderStrength = clamp(+e.target.value,0,0.6); saveState(); applyAll(); });

    $("#tm-open-gallery", root).addEventListener("click", openThemeGallery);

    $("#tm-default", root).addEventListener("click", () => {
      state.themeEnabled = false;
      state.presetName = "ChatGPT Default";
      saveState(); applyAll();
      presetSel.value = "__default__";
      $("#tm-theme-enabled", root).checked = false;
    });

    $("#tm-random", root).addEventListener("click", () => {
      const t = THEMES[Math.floor(Math.random() * THEMES.length)];
      state.themeEnabled = true;
      state.presetName = t.name;
      state.scheme = t.scheme;
      state.accent = t.accent;
      state.bg = t.bg;
      state.surface = t.surface;
      state.surface2 = t.surface2;
      state.text = t.text;
      state.muted = t.muted;

      state.bgFxSolid = t.bg;
      state.bgFxG1 = t.bg;
      state.bgFxG2 = t.surface2;
      state.bgFxG3 = t.accent;

      saveState(); applyAll();
      presetSel.value = t.name;
      $("#tm-theme-enabled", root).checked = true;
      $("#tm-accent", root).value = state.accent;
      $("#tm-bg", root).value = state.bg;
      $("#tm-surface", root).value = state.surface;
      $("#tm-surface2", root).value = state.surface2;
      $("#tm-text", root).value = state.text;
      $("#tm-muted", root).value = state.muted;
    });

    $("#tm-export", root).addEventListener("click", async () => {
      const txt = JSON.stringify(state, null, 2);
      try { await navigator.clipboard.writeText(txt); alert("Config copied ✅"); }
      catch { prompt("Copy config:", txt); }
    });
  }

  function buildTweaksPage(root) {
    root.innerHTML = `
      <div class="tm-row"><label><b>Hide disclaimer</b></label><input id="tm-hide-disc" type="checkbox"></div>
      <div class="tm-row"><label>Hard-remove disclaimer (targeted)</label><input id="tm-hard-disc" type="checkbox"></div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:12px 0;">

      <div class="tm-row"><label><b>Hover glow</b></label><input id="tm-hoverglow" type="checkbox"></div>
      <div class="tm-row"><label>Wide mode</label><input id="tm-wide" type="checkbox"></div>
      <div class="tm-row"><label>Zen mode (hide sidebar+header)</label><input id="tm-zen" type="checkbox"></div>
      <div class="tm-row"><label>Reduce motion</label><input id="tm-motion" type="checkbox"></div>
    `;

    const bind = (id, key) => {
      const input = $(id, root);
      input.checked = !!state[key];
      input.addEventListener("change", (e) => {
        state[key] = !!e.target.checked;
        saveState(); applyAll();
      });
    };

    bind("#tm-hide-disc", "hideDisclaimer");
    bind("#tm-hard-disc", "hardRemoveDisclaimer");
    bind("#tm-hoverglow", "hoverGlow");
    bind("#tm-wide", "wideMode");
    bind("#tm-zen", "zenMode");
    bind("#tm-motion", "reduceMotion");
  }

  // FX tab (Backgrounds + Animations + Sounds)
  function buildFxPage(root) {
    root.innerHTML = `
      <div style="font-weight:900;margin-bottom:6px;">Custom Backgrounds</div>
      <div class="tm-row"><label><b>Enable background FX</b></label><input id="tm-bgfx-en" type="checkbox"></div>
      <div class="tm-row"><label>Type</label>
        <select id="tm-bgfx-type">
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
          <option value="anim">Animated Gradient</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div id="tm-bgfx-solid-box">
        <div class="tm-row"><label>Solid color</label><input id="tm-bgfx-solid" type="color"></div>
      </div>

      <div id="tm-bgfx-grad-box">
        <div class="tm-row"><label>Gradient 1</label><input id="tm-bgfx-g1" type="color"></div>
        <div class="tm-row"><label>Gradient 2</label><input id="tm-bgfx-g2" type="color"></div>
        <div class="tm-row"><label>Angle</label><input id="tm-bgfx-angle" type="range" min="0" max="360" step="1"></div>
      </div>

      <div id="tm-bgfx-anim-box">
        <div class="tm-row"><label>Anim color 1</label><input id="tm-bgfx-a1" type="color"></div>
        <div class="tm-row"><label>Anim color 2</label><input id="tm-bgfx-a2" type="color"></div>
        <div class="tm-row"><label>Anim color 3</label><input id="tm-bgfx-a3" type="color"></div>
        <div class="tm-row"><label>Speed (sec)</label><input id="tm-bgfx-speed" type="range" min="10" max="120" step="1"></div>
      </div>

      <div id="tm-bgfx-img-box">
        <div class="tm-row" style="align-items:flex-start;">
          <label>Image URL</label>
          <div style="flex:1">
            <input id="tm-bgfx-url" type="text" placeholder="https://... (or data:image/...)" />
          </div>
        </div>
        <div class="tm-row"><label>Fit</label>
          <select id="tm-bgfx-fit">
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>

      <div id="tm-bgfx-vid-box">
        <div class="tm-row" style="align-items:flex-start;">
          <label>Video URL</label>
          <div style="flex:1">
            <input id="tm-bgfx-vurl" type="text" placeholder="Direct .mp4/.webm URL (or blob:/data:)" />
            <div style="opacity:.75;font-size:12px;margin-top:6px;">
              Tip: keep opacity low; video is always muted.
            </div>
          </div>
        </div>
        <div class="tm-row"><label>Fit</label>
          <select id="tm-bgfx-vfit">
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
          </select>
        </div>
      </div>

      <div class="tm-row"><label>Opacity</label><input id="tm-bgfx-op" type="range" min="0" max="1" step="0.01"></div>
      <div class="tm-row"><label>Background Blur</label><input id="tm-bgfx-blur" type="range" min="0" max="30" step="1"></div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:12px 0;">

      <div style="font-weight:900;margin-bottom:6px;">Subtle Animations</div>
      <div class="tm-row"><label><b>Enable animations</b></label><input id="tm-anim-en" type="checkbox"></div>
      <div class="tm-row"><label>Message fade (ms)</label><input id="tm-anim-msg" type="range" min="80" max="420" step="10"></div>
      <div class="tm-row"><label>UI transitions (ms)</label><input id="tm-anim-ui" type="range" min="60" max="300" step="10"></div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:12px 0;">

      <div style="font-weight:900;margin-bottom:6px;">Custom Sounds</div>
      <div class="tm-row"><label><b>Enable sounds</b></label><input id="tm-snd-en" type="checkbox"></div>
      <div class="tm-row"><label>Volume</label><input id="tm-snd-vol" type="range" min="0" max="100" step="1"></div>

      <div class="tm-actions">
        <button id="tm-test-send" type="button">Test Send</button>
        <button id="tm-test-done" type="button">Test Done</button>
      </div>
    `;

    $("#tm-bgfx-en", root).checked = state.bgFxEnabled;
    $("#tm-bgfx-type", root).value = state.bgFxType;

    $("#tm-bgfx-solid", root).value = state.bgFxSolid || state.bg;
    $("#tm-bgfx-g1", root).value = state.bgFxG1 || state.bg;
    $("#tm-bgfx-g2", root).value = state.bgFxG2 || state.surface2;
    $("#tm-bgfx-angle", root).value = String(state.bgFxAngle);

    $("#tm-bgfx-a1", root).value = state.bgFxG1 || state.bg;
    $("#tm-bgfx-a2", root).value = state.bgFxG2 || state.surface2;
    $("#tm-bgfx-a3", root).value = state.bgFxG3 || state.accent;
    $("#tm-bgfx-speed", root).value = String(state.bgFxAnimSpeed);

    $("#tm-bgfx-url", root).value = state.bgFxImageUrl || "";
    $("#tm-bgfx-fit", root).value = state.bgFxImageFit === "contain" ? "contain" : "cover";

    $("#tm-bgfx-vurl", root).value = state.bgFxVideoUrl || "";
    $("#tm-bgfx-vfit", root).value = state.bgFxImageFit === "contain" ? "contain" : "cover";

    $("#tm-bgfx-op", root).value = String(state.bgFxOpacity);
    $("#tm-bgfx-blur", root).value = String(state.bgFxBlur);

    $("#tm-anim-en", root).checked = state.animEnabled;
    $("#tm-anim-msg", root).value = String(state.animMsgMs);
    $("#tm-anim-ui", root).value = String(state.animUiMs);

    $("#tm-snd-en", root).checked = state.soundsEnabled;
    $("#tm-snd-vol", root).value = String(state.soundsVolume);

    const updateBgFxVisibility = () => {
      const type = $("#tm-bgfx-type", root).value;
      $("#tm-bgfx-solid-box", root).style.display = (type === "solid") ? "block" : "none";
      $("#tm-bgfx-grad-box", root).style.display  = (type === "gradient") ? "block" : "none";
      $("#tm-bgfx-img-box", root).style.display   = (type === "image") ? "block" : "none";
      $("#tm-bgfx-anim-box", root).style.display  = (type === "anim") ? "block" : "none";
      $("#tm-bgfx-vid-box", root).style.display   = (type === "video") ? "block" : "none";
    };
    updateBgFxVisibility();

    $("#tm-bgfx-en", root).addEventListener("change", (e) => {
      state.bgFxEnabled = !!e.target.checked;
      saveState(); applyAll();
    });

    $("#tm-bgfx-type", root).addEventListener("change", (e) => {
      state.bgFxType = e.target.value;
      updateBgFxVisibility();
      saveState(); applyAll();
    });

    $("#tm-bgfx-solid", root).addEventListener("input", (e) => { state.bgFxSolid = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-g1", root).addEventListener("input", (e) => { state.bgFxG1 = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-g2", root).addEventListener("input", (e) => { state.bgFxG2 = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-angle", root).addEventListener("input", (e) => { state.bgFxAngle = clamp(+e.target.value,0,360); saveState(); applyAll(); });

    $("#tm-bgfx-a1", root).addEventListener("input", (e) => { state.bgFxG1 = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-a2", root).addEventListener("input", (e) => { state.bgFxG2 = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-a3", root).addEventListener("input", (e) => { state.bgFxG3 = e.target.value; saveState(); applyAll(); });
    $("#tm-bgfx-speed", root).addEventListener("input", (e) => { state.bgFxAnimSpeed = clamp(+e.target.value,10,120); saveState(); applyAll(); });

    $("#tm-bgfx-url", root).addEventListener("input", (e) => { state.bgFxImageUrl = e.target.value.trim(); saveState(); applyAll(); });
    $("#tm-bgfx-fit", root).addEventListener("change", (e) => { state.bgFxImageFit = (e.target.value === "contain" ? "contain" : "cover"); saveState(); applyAll(); });
    $("#tm-bgfx-vfit", root).addEventListener("change", (e) => { state.bgFxImageFit = (e.target.value === "contain" ? "contain" : "cover"); saveState(); applyAll(); });

    $("#tm-bgfx-vurl", root).addEventListener("input", (e) => { state.bgFxVideoUrl = e.target.value.trim(); saveState(); applyAll(); });

    $("#tm-bgfx-op", root).addEventListener("input", (e) => { state.bgFxOpacity = clamp(+e.target.value,0,1); saveState(); applyAll(); });
    $("#tm-bgfx-blur", root).addEventListener("input", (e) => { state.bgFxBlur = clamp(+e.target.value,0,30); saveState(); applyAll(); });

    $("#tm-anim-en", root).addEventListener("change", (e) => { state.animEnabled = !!e.target.checked; saveState(); applyAll(); });
    $("#tm-anim-msg", root).addEventListener("input", (e) => { state.animMsgMs = clamp(+e.target.value,80,420); saveState(); applyAll(); });
    $("#tm-anim-ui", root).addEventListener("input", (e) => { state.animUiMs = clamp(+e.target.value,60,300); saveState(); applyAll(); });

    $("#tm-snd-en", root).addEventListener("change", (e) => { state.soundsEnabled = !!e.target.checked; saveState(); applyAll(); });
    $("#tm-snd-vol", root).addEventListener("input", (e) => { state.soundsVolume = clamp(+e.target.value,0,100); saveState(); });

    $("#tm-test-send", root).addEventListener("click", () => playSound("send", true));
    $("#tm-test-done", root).addEventListener("click", () => playSound("done", true));
  }

  function buildIconsPage(root) {
    root.innerHTML = `
      <div class="tm-row"><label><b>Enable icon replacements</b></label><input id="tm-icons-on" type="checkbox"></div>

      <div style="opacity:.85;margin:8px 0 10px 0;">
        Replace ChatGPT SVG icons with PNG/URLs. Keys: <code>symbol:HASH</code>, <code>aria:Label</code>, <code>testid:xxx</code>, <code>*</code>
      </div>

      <div class="tm-actions">
        <button id="tm-scan-icons" type="button">Scan icons</button>
        <button id="tm-apply-icons" type="button">Apply</button>
      </div>

      <div style="margin-top:10px;">
        <label><b>Icon map JSON</b></label>
        <textarea id="tm-icon-json" spellcheck="false"></textarea>
      </div>
    `;

    $("#tm-icons-on", root).checked = !!state.iconsEnabled;
    const box = $("#tm-icon-json", root);
    box.value = JSON.stringify(state.iconMap || {}, null, 2);

    $("#tm-icons-on", root).addEventListener("change", (e) => {
      state.iconsEnabled = !!e.target.checked;
      saveState(); applyAll();
    });

    function updateIconMapFromText() {
      try {
        const parsed = JSON.parse(box.value || "{}");
        if (!parsed || typeof parsed !== "object") throw new Error("JSON must be an object");
        state.iconMap = parsed;
        saveState();
        applyAll();
        return true;
      } catch (err) {
        alert("Icon JSON invalid:\n" + err.message);
        return false;
      }
    }

    $("#tm-apply-icons", root).addEventListener("click", () => {
      if (!updateIconMapFromText()) return;
      applyIconSwaps();
      alert("Applied ✅");
    });

    $("#tm-scan-icons", root).addEventListener("click", () => {
      const found = scanIconSymbols().slice(0, 25);
      const sample = found.map(([sym,count]) => `symbol:${sym}  // seen ${count}x`).join("\n");
      const hint =
`// Example mapping:
{
  "symbol:${(found[0]?.[0] || "55180d")}": "https://your-site/icon.png"
}

// Top detected (25):
${sample}`;
      prompt("Icon scan results:", hint);
    });

    box.addEventListener("blur", () => updateIconMapFromText());
  }

  function applyAll() {
    applyRootVars();
    applyClasses();
    ensureBgFxLayer();
    hardRemoveDisclaimer();
    applyIconSwaps();
    syncBgFxVideo();
  }

  // Observer
  let scheduled = false;
  function scheduleReapply() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      ensureUI();
      ensureThemeGallery();
      ensureBgFxLayer();

      hardRemoveDisclaimer();
      applyIconSwaps();
      updateGenerationStateForSounds();
      syncBgFxVideo();
    });
  }

  function startObserver() {
    const obs = new MutationObserver(scheduleReapply);
    obs.observe(document.documentElement, { subtree: true, childList: true });
  }

  // Pause/resume background video on tab visibility changes (perf-friendly)
  document.addEventListener("visibilitychange", () => {
    const vid = document.getElementById("tm-bgfx-video");
    if (!vid) return;
    if (document.visibilityState === "hidden") {
      try { vid.pause(); } catch {}
    } else {
      syncBgFxVideo();
    }
  });

  function waitForBody(cb) {
    if (document.body) return cb();
    requestAnimationFrame(() => waitForBody(cb));
  }

  // Boot
  waitForBody(() => {
    ensureUI();
    ensureThemeGallery();
    applyAll();
    initSoundSystemOnce();
    startObserver();
  });

})();
