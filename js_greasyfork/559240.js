// ==UserScript==
// @name         Gemini界面美化
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  替换令人难受的浅蓝色UI
// @match        https://*.google.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559240/Gemini%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559240/Gemini%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');

    style.textContent = `
/* ======================================================
 * GLOBAL DESIGN TOKENS（五色体系，只定义一次）
 * ====================================================== */
:root {
  --_t-bg: rgb(255,255,255);
  --_t-container: rgb(249,249,249);
  --_t-selected: rgb(234,234,234);
  --_t-accent: rgb(4,184,76);
  --_t-accent-weak: rgb(217,244,228);
  --_t-on: rgb(13,13,13);
}

/* ======================================================
 * 1. Gemini gem-sys 主题变量
 * ====================================================== */
:where(.theme-host) {
  --gem-sys-color--surface: var(--_t-bg);
  --gem-sys-color--surface-bright: var(--_t-bg);
  --gem-sys-color--surface-container-lowest: var(--_t-bg);

  --gem-sys-color--surface-container: var(--_t-container);
  --gem-sys-color--surface-container-low: var(--_t-container);
  --gem-sys-color--surface-container-high: var(--_t-container);
  --gem-sys-color--surface-container-highest: var(--_t-selected);

  --gem-sys-color--surface-variant: var(--_t-selected);
  --gem-sys-color--surface-dim: var(--_t-selected);

  --gem-sys-color--primary: var(--_t-accent);
  --gem-sys-color--blue-primary: var(--_t-accent);
  --gem-sys-color--secondary: var(--_t-accent);

  --gem-sys-color--primary-fixed: var(--_t-accent-weak);
  --gem-sys-color--primary-container: var(--_t-selected);
  --gem-sys-color--primary-fixed-dim: var(--_t-accent-weak);

  --gem-sys-color--secondary-container: var(--_t-container);
  --gem-sys-color--secondary-fixed: var(--_t-container);
  --gem-sys-color--secondary-fixed-dim: var(--_t-selected);

  --gem-sys-color--outline-low: var(--_t-selected);
  --gem-sys-color--outline-variant: var(--_t-selected);

  --gem-sys-color--on-primary-container: var(--_t-on);
  --gem-sys-color--on-primary-fixed-variant: var(--_t-on);
  --gem-sys-color--on-secondary-container: var(--_t-on);
  --gem-sys-color--on-surface: var(--_t-on);

  --gem-sys-color--image-stop: var(--_t-selected);
  --gem-sys-color--universal-stop: var(--_t-bg);
}

/* ======================================================
 * 2. Bard light-theme 变量
 * ====================================================== */
:root .light-theme {
  --bard-color-footer-background: var(--_t-bg);
  --bard-color-lightbox-background: var(--_t-bg);
  --bard-color-imagen-selection-dialog-background: var(--_t-bg);

  --bard-color-sidenav-background-desktop: var(--_t-container);
  --bard-color-response-container-flipped-background: var(--_t-container);
  --bard-color-recitation-background: var(--_t-container);
  --bard-color-share-social-media-icon-background: var(--_t-container);

  --bard-color-onhover-conversation-metadata-button-v2: var(--_t-selected);
  --bard-color-new-conversation-button: var(--_t-selected);
  --bard-color-chart-highlighted-background: var(--_t-selected);

  --bard-color-continue-chat-discovery-tooltip-button-text: var(--_t-accent);
  --bard-color-share-selected-title-card-border: var(--_t-accent);
  --bard-color-zero-state-prompt-chip-text: var(--_t-accent);
  --bard-color-form-field-outline-active: var(--_t-accent);
  --bard-color-fact-title: var(--_t-accent);

  --bard-color-custom-primary-container: var(--_t-accent-weak);
  --bard-color-fact-check-button-complete: var(--_t-accent-weak);
  --bard-color-zero-state-card-selected: var(--_t-accent-weak);
  --bard-color-zero-state-prompt-chip-background: var(--_t-accent-weak);
  --bard-color-immersive-editor-user-selection: var(--_t-accent-weak);
  --bard-color-fact-check-tooltip-entailed-highlight: var(--_t-accent-weak);

  --bard-color-neutral-90: var(--_t-selected);
  --bard-color-neutral-95: var(--_t-container);
  --bard-color-neutral-96: var(--_t-container);
  --bard-color-icon-separator: var(--_t-selected);
  --bard-color-image-placeholder-background: var(--_t-selected);

  --bard-color-surface-dim-tmp: var(--_t-bg) !important;
  --bard-color-processing-animation-color-2: var(--_t-container) !important;
  --bard-color-resize-canvas-background: var(--_t-container) !important;
  --bard-color-sidenav-tile-background-aurora: var(--_t-container) !important;

  --bard-color-input-companion-button-hover-background: var(--_t-selected) !important;
  --bard-color-input-companion-button-active-background: var(--_t-selected) !important;

  --bard-color-imagen-loading-gradient-step-1: rgba(249,249,249,0.2) !important;
  --bard-color-imagen-loading-gradient-step-2: var(--_t-container) !important;
  --bard-color-imagen-loading-gradient-step-3: var(--_t-selected) !important;
}

/* ======================================================
 * 3. Monaco / VSCode 编辑器
 * ====================================================== */
.monaco-editor,
.monaco-diff-editor,
.monaco-component {
  --vscode-editor-background: var(--_t-container);
  --vscode-editorGutter-background: var(--_t-container);
  --vscode-breadcrumb-background: var(--_t-container);
  --vscode-multiDiffEditor-background: var(--_t-container);

  --vscode-input-background: var(--_t-bg);
  --vscode-dropdown-background: var(--_t-bg);
  --vscode-menu-background: var(--_t-bg);

  --vscode-editorWidget-background: var(--_t-container);
  --vscode-editorHoverWidget-background: var(--_t-container);
  --vscode-editorSuggestWidget-background: var(--_t-container);

  --vscode-editor-selectionBackground: var(--_t-selected);
  --vscode-editor-inactiveSelectionBackground: var(--_t-selected);
  --vscode-list-hoverBackground: var(--_t-selected);

  --vscode-editor-selectionHighlightBackground: rgba(217,244,228,0.6);
  --vscode-editor-hoverHighlightBackground: rgba(217,244,228,0.4);

  --vscode-focusBorder: var(--_t-accent);
  --vscode-textLink-foreground: var(--_t-accent);
  --vscode-textLink-activeForeground: var(--_t-accent);
  --vscode-progressBar-background: var(--_t-accent);
  --vscode-button-background: var(--_t-accent);

  --vscode-editor-foreground: var(--_t-on);
  --vscode-foreground: rgb(68,71,70);
}

/* ======================================================
 * 4. Silence hallucination disclaimer (keep layout)
 * ====================================================== */
.hallucination-disclaimer,
[data-testid="hallucination-disclaimer"] {
  min-height: 24px;
  height: 24px;
  box-sizing: border-box;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  text-shadow: none !important;
}

.hallucination-disclaimer *,
[data-testid="hallucination-disclaimer"] * {
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}
`;

    document.documentElement.appendChild(style);
})();