// ==UserScript==
// @name         ChatGPT 移动视图暗色紫罗兰MD3主题
// @version      0.3.0
// @description  为 ChatGPT 移动端视图添加暗色紫罗兰 MD3 主题
// @author       大触紫衣
// @match        https://chat.openai.com/*
// @license MIT
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @namespace    gptmd3zy
// @downloadURL https://update.greasyfork.org/scripts/557752/ChatGPT%20%E7%A7%BB%E5%8A%A8%E8%A7%86%E5%9B%BE%E6%9A%97%E8%89%B2%E7%B4%AB%E7%BD%97%E5%85%B0MD3%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/557752/ChatGPT%20%E7%A7%BB%E5%8A%A8%E8%A7%86%E5%9B%BE%E6%9A%97%E8%89%B2%E7%B4%AB%E7%BD%97%E5%85%B0MD3%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
@media (max-width: 768px) {
  :root {
    --md3-primary: #D0BCFF;
    --md3-on-primary: #381E72;
    --md3-surface: #141218;
    --md3-surface-variant: #1E1B24;
    --md3-surface-bright: #1D1B20;
    --md3-outline: #3F3A45;
    --md3-outline-variant: #49454F;
    --md3-secondary: #CCC2DC;
    --md3-on-surface: #E6E0E9;
    --md3-on-surface-variant: #CAC4D0;
    --md3-shadow-color: rgba(0, 0, 0, 0.8);
    --md3-easing-standard: cubic-bezier(0.2, 0.0, 0, 1);
    --md3-duration-short: 180ms;
    --md3-duration-medium: 220ms;
  }

  /* 整体背景 */
  html.dark,
  html[data-theme="dark"],
  html {
    background:
      radial-gradient(circle at 0 0, rgba(208,188,255,0.18) 0, transparent 55%),
      radial-gradient(circle at 100% 100%, rgba(130,120,255,0.35) 0, transparent 55%),
      #0B0515 !important;
    color: var(--md3-on-surface) !important;
  }

  body {
    background: transparent !important;
  }

  main#main {
    background: linear-gradient(to bottom, rgba(12,10,20,0.9), rgba(5,3,10,0.98)) !important;
  }

  /* 顶部栏（移动端 header） */
  [class~="md:hidden"][class~="h-header-height"],
  [class~="draggable"][class~="h-header-height"][class~="md:hidden"] {
    background: rgba(20,18,24,0.92) !important;
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(208,188,255,0.24);
  }

  .text-token-text-primary {
    color: var(--md3-on-surface) !important;
  }

  .text-token-text-secondary,
  .text-token-text-tertiary {
    color: rgba(230,224,233,0.7) !important;
  }

  h1.text-page-header {
    color: var(--md3-primary) !important;
    text-shadow: 0 0 24px rgba(208,188,255,0.3);
  }

  #thread {
    padding-top: 0.75rem;
  }

  /* ========== 代码块卡片（使用 sidebar token 的那一层） ========== */
  .markdown pre .bg-token-sidebar-surface-primary,
  .markdown-new-styling pre .bg-token-sidebar-surface-primary {
    background:
      radial-gradient(circle at 0 0, rgba(208,188,255,0.16), transparent 65%) padding-box,
      linear-gradient(to bottom right, #241B33, #141218) border-box !important;
    border-radius: 18px !important;
    border: 1px solid rgba(208,188,255,0.25) !important;
    box-shadow:
      0 18px 45px rgba(0,0,0,0.85),
      0 0 0 1px rgba(255,255,255,0.02);
    transition:
      box-shadow var(--md3-duration-medium) var(--md3-easing-standard),
      transform var(--md3-duration-medium) var(--md3-easing-standard),
      border-color var(--md3-duration-short) var(--md3-easing-standard);
  }

  .markdown pre .bg-token-sidebar-surface-primary:hover,
  .markdown-new-styling pre .bg-token-sidebar-surface-primary:hover {
    transform: translateY(-1px);
    box-shadow:
      0 24px 60px rgba(0,0,0,0.95),
      0 0 0 1px rgba(208,188,255,0.4);
  }

  .bg-token-bg-elevated-secondary {
    background: rgba(23,20,32,0.98) !important;
    border-radius: 14px !important;
    border: 1px solid rgba(121,116,126,0.9) !important;
  }

  /* ========== 侧边栏 ========== */
  /* 整个蒙版区域 */
  #stage-popover-sidebar {
    background:
      radial-gradient(circle at 0 0, rgba(208,188,255,0.16), transparent 55%),
      radial-gradient(circle at 100% 100%, rgba(130,120,255,0.32), transparent 55%);
    backdrop-filter: blur(22px);
  }

  /* 左侧滑出 panel 本体：只改这一层，避免内部一堆 div 都变成圆角卡片 */
  #stage-popover-sidebar > [data-side="left"],
  #stage-popover-sidebar > [data-radix-side="left"] {
    background: linear-gradient(135deg, #1F182C, #141218);
    border-radius: 0 24px 24px 0;
    border: 1px solid rgba(208,188,255,0.26);
    box-shadow:
      0 26px 60px rgba(0,0,0,0.95),
      0 0 0 1px rgba(255,255,255,0.03);
    overflow: hidden;
    animation: md3-sidebar-in var(--md3-duration-medium) var(--md3-easing-standard);
  }

  /* 修复你截图里那种“洋葱圈”效果：侧边栏内部用到 bg-token-sidebar-surface-primary 的卡片全部去掉边框和额外阴影，只留内容 */
  #stage-popover-sidebar .bg-token-sidebar-surface-primary {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }

  /* 侧边栏条目 hover / 选中态 */
  #stage-popover-sidebar a,
  #stage-popover-sidebar button {
    border-radius: 14px;
    transition:
      background-color var(--md3-duration-short) var(--md3-easing-standard),
      color var(--md3-duration-short) var(--md3-easing-standard),
      transform var(--md3-duration-short) var(--md3-easing-standard);
  }

  #stage-popover-sidebar a:hover,
  #stage-popover-sidebar button:hover {
    background-color: rgba(208,188,255,0.14);
    color: var(--md3-primary);
    transform: translateY(-0.5px);
  }

  #stage-popover-sidebar [aria-current="page"],
  #stage-popover-sidebar [data-active="true"] {
    background: radial-gradient(circle at 0 0, rgba(208,188,255,0.4), rgba(154,130,219,0.9));
    color: #1B1033;
  }

  /* ========== 底部输入框（composer） ========== */
  [class~="group/composer"] .bg-token-bg-primary {
    background:
      radial-gradient(circle at 0 0, rgba(208,188,255,0.16), transparent 70%) padding-box,
      linear-gradient(to bottom, #1E1B24, #141218) border-box !important;
    border-radius: 24px !important;
    border: 1px solid rgba(208,188,255,0.26) !important;
    box-shadow:
      0 18px 45px rgba(0,0,0,0.75),
      0 0 0 1px rgba(255,255,255,0.01);
    transition:
      box-shadow var(--md3-duration-medium) var(--md3-easing-standard),
      transform var(--md3-duration-medium) var(--md3-easing-standard),
      border-color var(--md3-duration-short) var(--md3-easing-standard),
      background var(--md3-duration-medium) var(--md3-easing-standard);
  }

  [class~="group/composer"][data-expanded="true"] .bg-token-bg-primary,
  [class~="group/composer"]:focus-within .bg-token-bg-primary {
    transform: translateY(-1px);
    box-shadow:
      0 22px 60px rgba(0,0,0,0.95),
      0 0 0 1px rgba(208,188,255,0.5);
  }

  [class~="group/composer"] .ProseMirror,
  [class~="group/composer"] textarea[name="prompt-textarea"] {
    color: var(--md3-on-surface) !important;
  }

  [class~="group/composer"] .ProseMirror p.placeholder {
    color: rgba(230,224,233,0.5) !important;
  }

  /* ========== 按钮 & 主操作 ========== */
  button,
  .btn,
  .composer-btn,
  .composer-submit-btn {
    border-radius: 999px !important;
    transition:
      background-color var(--md3-duration-short) var(--md3-easing-standard),
      box-shadow var(--md3-duration-short) var(--md3-easing-standard),
      transform var(--md3-duration-short) var(--md3-easing-standard),
      opacity var(--md3-duration-short) var(--md3-easing-standard);
    position: relative;
    overflow: hidden;
  }

  .composer-submit-btn,
  .btn.btn-primary,
  .btn.btn-secondary {
    background: radial-gradient(circle at 0 0, #D0BCFF, #9A82DB) !important;
    color: #1B1033 !important;
    box-shadow:
      0 10px 25px rgba(0,0,0,0.6),
      0 0 0 1px rgba(255,255,255,0.05);
  }

  .composer-submit-btn[disabled] {
    background: linear-gradient(to bottom, #4A4458, #2B2930) !important;
    color: rgba(230,224,233,0.45) !important;
    box-shadow: none !important;
    opacity: 0.65;
  }

  .composer-submit-btn svg,
  .btn svg {
    color: inherit !important;
  }

  button:not([disabled]):active,
  .btn:not([disabled]):active,
  .composer-submit-btn:not([disabled]):active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 6px 16px rgba(0,0,0,0.9);
  }

  /* 模型选择器 chip */
  [data-testid="model-switcher-dropdown-button"] {
    background: rgba(44,40,60,0.96) !important;
    border-radius: 999px !important;
    border: 1px solid rgba(208,188,255,0.3);
  }

  [data-testid="model-switcher-dropdown-button"]:hover {
    background: rgba(72,63,100,0.98) !important;
  }

  button.btn-secondary {
    background: linear-gradient(to right, #1E1B24, #211F26) !important;
    border: 1px solid rgba(121, 116, 126, 0.9);
  }

  /* ========== AI 消息卡片（有 bg-token-main-surface-* 的层） ========== */
  div[class*="bg-token-main-surface-primary"],
  div[class*="bg-token-main-surface-secondary"] {
    border-radius: 18px !important;
    background: #1E1B24 !important;
    border: 1px solid rgba(121,116,126,0.7);
    box-shadow: 0 12px 30px rgba(0,0,0,0.9);
  }

  /* ========== 用户消息气泡 ========== */
  .user-message-bubble-color {
    background:
      radial-gradient(circle at 0 0, rgba(208,188,255,0.35), transparent 55%),
      linear-gradient(135deg, #4B2E67, #24163B);
    color: #F5EFF7 !important;
    border-radius: 18px !important;
    border: 1px solid rgba(236,208,255,0.65);
    box-shadow: 0 12px 30px rgba(0,0,0,0.9);
    position: relative;
    overflow: hidden;
    transition:
      transform var(--md3-duration-medium) var(--md3-easing-standard),
      box-shadow var(--md3-duration-medium) var(--md3-easing-standard),
      border-color var(--md3-duration-short) var(--md3-easing-standard);
  }

  article[data-turn="user"] .text-message:hover .user-message-bubble-color,
  article[data-turn="user"] .text-message:focus-within .user-message-bubble-color {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 20px 45px rgba(0,0,0,0.95);
    border-color: rgba(245,228,255,0.9);
  }

  .user-message-bubble-color a {
    color: var(--md3-primary);
  }

  /* 底部 disclaimer 等 */
  #thread-bottom-container + div .text-token-text-secondary {
    color: rgba(230,224,233,0.6) !important;
  }

  [view-transition-name="var(--vt-disclaimer)"],
  [view-transition-name="--vt-disclaimer"],
  div[view-transition-name*="disclaimer"] {
    color: rgba(230,224,233,0.56) !important;
  }

  [style*="var(--sharp-edge-top-shadow-placeholder)"],
  [style*="var(--sharp-edge-bottom-shadow)"] {
    box-shadow: none !important;
  }

  main#main,
  #thread,
  #thread-bottom-container {
    transition:
      background var(--md3-duration-medium) var(--md3-easing-standard),
      box-shadow var(--md3-duration-medium) var(--md3-easing-standard);
  }

  /* 移动端滚动条 */
  main#main::-webkit-scrollbar {
    width: 6px;
  }

  main#main::-webkit-scrollbar-track {
    background: transparent;
  }

  main#main::-webkit-scrollbar-thumb {
    background: rgba(208,188,255,0.45);
    border-radius: 999px;
  }
}

/* ========== 动效 keyframes ========== */
@keyframes md3-sidebar-in {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes md3-dialog-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Ripple */
@keyframes md3-ripple {
  from {
    transform: scale(0);
    opacity: 0.35;
  }
  to {
    transform: scale(1);
    opacity: 0;
  }
}

.md3-ripple {
  position: absolute;
  border-radius: 999px;
  background: rgba(208,188,255,0.35);
  transform: scale(0);
  transform-origin: center;
  animation: md3-ripple 550ms var(--md3-easing-standard, cubic-bezier(0.2, 0.0, 0, 1));
  pointer-events: none;
}
`;

  function injectStyle(text) {
    if (typeof GM_addStyle !== 'undefined') {
      GM_addStyle(text);
    } else {
      const style = document.createElement('style');
      style.textContent = text;
      document.documentElement.appendChild(style);
    }
  }

  injectStyle(css);

  /* 全局 MD3 ripple 点击水波纹（按钮 / 菜单 / 侧边栏条目） */
  function enableRipple() {
    document.addEventListener(
      'pointerdown',
      function (e) {
        const target = e.target.closest(
          'button, .btn, .composer-btn, .composer-submit-btn, a[role="button"], [role="menuitem"], [data-radix-collection-item]'
        );
        if (!target || target.dataset.noRipple === 'true') return;

        const rect = target.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const old = target.querySelector('.md3-ripple');
        if (old) old.remove();

        const ripple = document.createElement('span');
        ripple.className = 'md3-ripple';

        const size = Math.max(rect.width, rect.height) * 1.4;
        ripple.style.width = ripple.style.height = size + 'px';

        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        target.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 650);
      },
      { passive: true }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableRipple);
  } else {
    enableRipple();
  }
})();
