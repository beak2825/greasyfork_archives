// ==UserScript==
// @name         ChatGPT Customizer (Dracula + Toggles)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dracula chat area, unified bubbles, code styling, sidebar/header, scrollbars, and disclaimer removal — all with feature toggles.
// @author       Mohamed
// @license      MIT
// @match        https://chatgpt.com
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556083/ChatGPT%20Customizer%20%28Dracula%20%2B%20Toggles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556083/ChatGPT%20Customizer%20%28Dracula%20%2B%20Toggles%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================================================
   * Desktop-only guard
   * ---------------------------------------------------------
   * Only apply styles on larger screens to avoid breaking mobile.
   * ======================================================= */
  function isDesktop() {
    return window.innerWidth >= 1024;
  }

  /* =========================================================
   * Feature toggles (persistent via Tampermonkey storage)
   * ---------------------------------------------------------
   * Flip these in TM menu; values persist across sessions.
   * ======================================================= */
  const TOGGLES = {
    // Global layout/theme
    layoutAndWidth: GM_getValue("layoutAndWidth", true),          // main chat column width, centered inner content
    chatAreaBackground: GM_getValue("chatAreaBackground", true),  // Dracula background for chat area and page
    headerBar: GM_getValue("headerBar", true),                    // Dracula header bar + remove fades
    sidebarTheme: GM_getValue("sidebarTheme", true),              // Dracula sidebar
    sidebarCollapsedTheme: GM_getValue("sidebarCollapsedTheme", true), // Dracula theme for collapsed sidebar
    scrollbars: GM_getValue("scrollbars", true),                  // Dracula scrollbars

    // Composer area
    transparentComposer: GM_getValue("transparentComposer", true),// kill backgrounds/shadows in bottom container
    inputPill: GM_getValue("inputPill", true),                    // visible Dracula pill for input

    // Bubbles
    aiBubble: GM_getValue("aiBubble", true),                      // AI bubble unified Dracula style
    userBubble: GM_getValue("userBubble", true),                  // User bubble unified to match AI
    bubbleHover: GM_getValue("bubbleHover", true),                // subtle hover on bubbles

    // Code
    codeFont: GM_getValue("codeFont", true),                      // Nerd font family for code/hljs
    codeDracula: GM_getValue("codeDracula", true),                // Dracula colors for code blocks + syntax
    codeHeaderDracula: GM_getValue("codeHeaderDracula", true),    // Dracula header bar within code block
    codeCopyAreaDracula: GM_getValue("codeCopyAreaDracula", true),// Dracula copy button container
    codeHeaderRadiusFix: GM_getValue("codeHeaderRadiusFix", true),// normalize top rounding of code header
    codeAreaBackground: GM_getValue("codeAreaBackground", true),  // background for the code area body

    // Misc
    disclaimerRemoval: GM_getValue("disclaimerRemoval", true),    // remove “ChatGPT can make mistakes” footer
  };

  /* =========================================================
   * Tampermonkey menu commands for each toggle
   * ---------------------------------------------------------
   * Toggle -> reload to re-render styles cleanly.
   * ======================================================= */
  function registerMenu() {
    const toggle = (key, label) => GM_registerMenuCommand(
      `${TOGGLES[key] ? "Disable" : "Enable"} ${label}`,
      () => { GM_setValue(key, !TOGGLES[key]); location.reload(); }
    );

    // Global layout/theme
    toggle("layoutAndWidth", "Layout & width");
    toggle("chatAreaBackground", "Chat area background");
    toggle("headerBar", "Header bar theme");
    toggle("sidebarTheme", "Sidebar theme");
    toggle("sidebarCollapsedTheme", "Collapsed sidebar theme");
    toggle("scrollbars", "Scrollbars");

    // Composer
    toggle("transparentComposer", "Transparent composer container");
    toggle("inputPill", "Input pill");

    // Bubbles
    toggle("aiBubble", "AI bubble");
    toggle("userBubble", "User bubble");
    toggle("bubbleHover", "Bubble hover");

    // Code
    toggle("codeFont", "Code font");
    toggle("codeDracula", "Code Dracula theme");
    toggle("codeHeaderDracula", "Code header Dracula");
    toggle("codeCopyAreaDracula", "Code copy area Dracula");
    toggle("codeHeaderRadiusFix", "Code header radius fix");
    toggle("codeAreaBackground", "Code area body background");

    // Misc
    toggle("disclaimerRemoval", "Disclaimer removal");
  }

  /* =========================================================
   * Build CSS string based on active toggles
   * ---------------------------------------------------------
   * Ordered from broad customizations to specific tweaks.
   * ======================================================= */
  function buildCSS() {
    let css = "";

    // -------------------------------------------------------
    // Global: Layout & width (broad)
    // - Ensures main chat column uses full width
    // - Centers inner message content around ~78vw
    // -------------------------------------------------------
    if (TOGGLES.layoutAndWidth) {
      css += `
      /* Main chat column container layout */
      div.relative.basis-auto.grow.flex.overflow-hidden {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      /* Inner message content - centered at ~80% viewport width */
      div[class*="max-w-"][class*="mx-auto"].flex-1,
      div[class*="max-w-"][class*="mx-auto"] {
        max-width: 78vw !important;
        width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* Scrollbar container sizing baseline */
      div.flex.h-full.flex-col.overflow-y-auto {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Global: Chat area Dracula background (broad)
    // - Sets chat area + <main> background
    // -------------------------------------------------------
    if (TOGGLES.chatAreaBackground) {
      css += `
      /* Keep main page and chat area background Dracula-dark */
      main { background-color: #16161e !important; }
      #thread > div.relative.basis-auto.grow.flex.overflow-hidden {
        background-color: #16161e !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Header bar (broad)
    // - Unifies header background and removes pseudo-element fades
    // -------------------------------------------------------
    if (TOGGLES.headerBar) {
      css += `
      /* Top header bar: Dracula background and neutralize theme tokens */
      #page-header {
        background: none !important;
        background-color: #16161e !important;
        box-shadow: none !important;
        border: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        --token-main-surface-primary: #16161e !important;
        --sharp-edge-top-shadow: none !important;
      }
      #page-header::before, #page-header::after {
        content: none !important;
        display: none !important;
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Sidebar theme (broad)
    // - Applies Dracula shades and removes gradients/shadows
    // -------------------------------------------------------
    if (TOGGLES.sidebarTheme) {
      css += `
      /* Sidebar root: slightly darker Dracula shade */
      nav.group\\/scrollport[aria-label="Chat history"] {
        background: none !important;
        background-color: #121217 !important;
        box-shadow: none !important;
        border: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        --token-sidebar-surface-primary: #121217 !important;
        --token-sidebar-surface-secondary: #121217 !important;
        --token-sidebar-surface-tertiary: #121217 !important;
      }
      /* Inherit darker shade for direct children and kill pseudo fades */
      nav.group\\/scrollport[aria-label="Chat history"] > * { background-color: #121217 !important; }
      nav.group\\/scrollport[aria-label="Chat history"]::before,
      nav.group\\/scrollport[aria-label="Chat history"]::after,
      nav.group\\/scrollport[aria-label="Chat history"] > *::before,
      nav.group\\/scrollport[aria-label="Chat history"] > *::after {
        content: none !important;
        background: none !important;
        box-shadow: none !important;
      }
      `;
    }

    // -------------------------------------------------------
// Sidebar collapsed theme (specific)
// - Applies Dracula shade to the tiny sidebar when collapsed
// -------------------------------------------------------
if (TOGGLES.sidebarCollapsedTheme) {
  css += `
  /* Collapsed sidebar root */
  .group\\/tiny-bar {
    background-color: #121217 !important;
    box-shadow: none !important;
    border: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  /* Remove pseudo-element fades */
  .group\\/tiny-bar::before,
  .group\\/tiny-bar::after {
    content: none !important;
    background: none !important;
    box-shadow: none !important;
  }
  `;
}

    // -------------------------------------------------------
    // Scrollbars (broad)
    // - Dracula-style scrollbars for chat area + sidebar
    // -------------------------------------------------------
    if (TOGGLES.scrollbars) {
      css += `
      /* Dracula-style scrollbar for chat area */
      div.flex.h-full.flex-col.overflow-y-auto {
        scrollbar-width: thin !important;
        scrollbar-color: #2a2a32 #16161e !important;
      }
      div.flex.h-full.flex-col.overflow-y-auto::-webkit-scrollbar { width: 8px; }
      div.flex.h-full.flex-col.overflow-y-auto::-webkit-scrollbar-track { background: #16161e; }
      div.flex.h-full.flex-col.overflow-y-auto::-webkit-scrollbar-thumb {
        background-color: #2a2a32; border-radius: 4px; border: 1px solid #121217;
      }
      div.flex.h-full.flex-col.overflow-y-auto::-webkit-scrollbar-thumb:hover { background-color: #444; }

      /* Sidebar scrollbar */
      nav.group\\/scrollport[aria-label="Chat history"] {
        scrollbar-width: thin !important;
        scrollbar-color: #2a2a32 #121217 !important;
      }
      nav.group\\/scrollport[aria-label="Chat history"]::-webkit-scrollbar { width: 8px; }
      nav.group\\/scrollport[aria-label="Chat history"]::-webkit-scrollbar-track { background: #121217; }
      nav.group\\/scrollport[aria-label="Chat history"]::-webkit-scrollbar-thumb {
        background-color: #2a2a32; border-radius: 4px; border: 1px solid #16161e;
      }
      nav.group\\/scrollport[aria-label="Chat history"]::-webkit-scrollbar-thumb:hover { background-color: #444; }
      `;
    }

    // -------------------------------------------------------
    // Composer area (broad)
    // - Kill backgrounds/shadows/filters to keep area clean
    // -------------------------------------------------------
    if (TOGGLES.transparentComposer) {
      css += `
      /* Transparent lower container: kill backgrounds, shadows, filters, and theme tokens */
      #thread-bottom-container, .group\\/thread-bottom-container {
        background: none !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        --token-bg-primary: transparent !important;
        --sharp-edge-bottom-shadow: none !important;
      }

      /* Also clear pseudo-elements that can paint gradients/fades */
      #thread-bottom-container::before,
      #thread-bottom-container::after,
      .group\\/thread-bottom-container::before,
      .group\\/thread-bottom-container::after {
        content: none !important;
        display: none !important;
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* Top child area that spans full width (holds the composer): clear any pseudo-elements too */
      #thread-bottom {
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      #thread-bottom::before, #thread-bottom::after {
        content: none !important;
        display: none !important;
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* Disclaimer (bottom child): scope only to the container and clear pseudo-elements */
      #thread-bottom-container > .text-token-text-secondary {
        background: none !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      #thread-bottom-container > .text-token-text-secondary::before,
      #thread-bottom-container > .text-token-text-secondary::after {
        content: none !important;
        display: none !important;
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Input pill (broad)
    // - Make the composer pill visible in Dracula styling
    // -------------------------------------------------------
    if (TOGGLES.inputPill) {
      css += `
      /* Input bar pill: visible Dracula pill */
      .bg-token-bg-primary {
        background-color: #282a36 !important;
        border-radius: 28px !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }
      .bg-token-bg-primary::before, .bg-token-bg-primary::after {
        content: none !important; display: none !important;
      }
      .bg-token-bg-primary * { opacity: 1 !important; }

      /* Slim disclaimer rectangle transparent fallback (if class changes slightly) */
      div.text-token-text-secondary.relative.mt-auto.flex.min-h-8.w-full.items-center.justify-center.p-2.text-center.text-xs {
        background: none !important;
        background-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Bubbles (broad)
    // - AI + User unified Dracula bubble
    // - Optional hover effect
    // -------------------------------------------------------
    if (TOGGLES.aiBubble) {
      css += `
      /* AI reply bubble container: unified Dracula */
      div.markdown.prose.dark.markdown-new-styling {
        background-color: #1a1a22 !important;
        color: #f8f8f2 !important;
        border-radius: 8px !important;
        padding: 12px !important;
        border: 1px solid #121217 !important;
      }
      div.markdown.prose.dark.markdown-new-styling p { color: #f8f8f2 !important; }
      `;
    }
    if (TOGGLES.userBubble) {
      css += `
      /* User message bubble: unified to match AI bubble */
      .user-message-bubble-color {
        background-color: #1a1a22 !important;
        color: #f8f8f2 !important;
        border-radius: 8px !important;
        padding: 12px !important;
        border: 1px solid #121217 !important;
      }
      `;
    }
    if (TOGGLES.bubbleHover) {
      css += `
      /* Optional hover effect for both bubble types */
      div.markdown.prose.dark.markdown-new-styling:hover,
      .user-message-bubble-color:hover {
        background-color: #20202a !important;
      }
      `;
    }

    // -------------------------------------------------------
    // Code: fonts and Dracula theme (specific)
    // - Font family for code and hljs
    // - Dracula colors for syntax, container, header, copy area, body
    // - Normalize header rounding
    // -------------------------------------------------------
    if (TOGGLES.codeFont) {
      css += `
      /* Code block font customization (Nerd fonts) */
      code, code *,
      .hljs {
        font-family: 'CaskaydiaCove Nerd Font Mono','JetBrainsMono Nerd Font Mono','FiraCode Nerd Font Mono', monospace !important;
      }
      `;
    }

    if (TOGGLES.codeDracula) {
      css += `
      /* Dracula Theme - Code Blocks syntax and base background */
      code, .hljs { background-color: #282a36 !important; color: #f8f8f2 !important; }
      .hljs-attr, .hljs-attribute { color: #50fa7b !important; }
      .hljs-string, .hljs-literal { color: #f1fa8c !important; }
      .hljs-number { color: #bd93f9 !important; }
      .hljs-built_in, .hljs-builtin-name { color: #8be9fd !important; }
      .hljs-function .hljs-title, .hljs-function > .hljs-title, .hljs-title.function_ { color: #50fa7b !important; }
      .hljs-keyword, .hljs-selector-tag, .hljs-literal, .hljs-title, .hljs-section, .hljs-link, .hljs-tag { color: #ff79c6 !important; }
      .hljs-class { color: #50fa7b !important; }
      .hljs-symbol, .hljs-bullet, .hljs-link { color: #f1fa8c !important; }
      .hljs-meta, .hljs-comment { color: #6272a4 !important; }
      .hljs-emphasis { font-style: italic !important; }
      .hljs-strong { font-weight: bold !important; }

      /* Code block container background */
      div.contain-inline-size.rounded-2xl.relative.bg-token-sidebar-surface-primary { background-color: #282a36 !important; }
      div.contain-inline-size.rounded-2xl.relative.bg-token-sidebar-surface-primary div { background-color: #282a36 !important; }
      `;
    }

    if (TOGGLES.codeAreaBackground) {
      css += `
      /* Code area body background (the scrolling body) */
      div.overflow-y-auto.p-4 { background-color: #282a36 !important; }
      `;
    }

    if (TOGGLES.codeHeaderDracula) {
      css += `
      /* Dracula Theme - Code header bar (language label row) */
      div.flex.items-center.text-token-text-secondary.px-4.py-2.text-xs.font-sans.justify-between.h-9 {
        background-color: #1e1f29 !important; color: #f8f8f2 !important;
      }
      `;
    }

    if (TOGGLES.codeCopyAreaDracula) {
      css += `
      /* Dracula Theme - Copy button container and its inner */
      div.absolute.end-0.bottom-0.flex.h-9.items-center.pe-2 { background-color: #1e1f29 !important; }
      div.bg-token-bg-elevated-secondary.text-token-text-secondary.flex.items-center.gap-4.rounded-sm.px-2.font-sans.text-xs {
        background-color: #1e1f29 !important; color: #f8f8f2 !important;
      }
      `;
    }

    if (TOGGLES.codeHeaderRadiusFix) {
      css += `
      /* Code block header: override exaggerated top rounding (rounded-t-2xl -> 6px) */
      div.flex.items-center.justify-between.h-9.bg-token-sidebar-surface-primary {
        border-top-left-radius: 6px !important;
        border-top-right-radius: 6px !important;
      }
      `;
    }

    return css;
  }

  /* =========================================================
   * Apply styles (replace single style tag to avoid duplicates)
   * ---------------------------------------------------------
   * Ensures clean re-render on resize/mutation.
   * ======================================================= */
  function applyStyles() {
    if (!isDesktop()) return;
    const css = buildCSS();

    let styleEl = document.getElementById("cgpt-customizer-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "cgpt-customizer-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  /* =========================================================
   * Remove disclaimer/footer element (optional)
   * ---------------------------------------------------------
   * Deletes “ChatGPT can make mistakes / Check important info”
   * ======================================================= */
  function removeDisclaimer() {
    if (!TOGGLES.disclaimerRemoval) return;
    document.querySelectorAll('div.pointer-events-auto').forEach(div => {
      const text = div.textContent || '';
      if (text.includes('ChatGPT can make mistakes') || text.includes('Check important info')) {
        div.remove();
      }
    });
  }

  /* =========================================================
   * Initialization and reactive updates
   * ---------------------------------------------------------
   * - Register menu commands
   * - Apply styles on load/resize/mutations
   * ======================================================= */
  function init() {
    registerMenu();
    applyStyles();
    removeDisclaimer();

    window.addEventListener('resize', applyStyles);

    const observer = new MutationObserver(() => {
      applyStyles();
      removeDisclaimer();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic safeguard to re-apply in dynamic UIs
    setInterval(() => {
      applyStyles();
      removeDisclaimer();
    }, 1000);
  }

  function waitForMain() {
    const main = document.querySelector('main');
    if (main) {
      init();
    } else {
      setTimeout(waitForMain, 400);
    }
  }

  waitForMain();
})();
