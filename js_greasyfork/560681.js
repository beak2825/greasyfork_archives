// ==UserScript==
// @name         Lemonade CSS Injector
// @namespace    http://tampermonkey.net/
// @version      7.1.0
// @description  Inject and manage custom CSS styles on lemonade.gg/code
// @author       Silverfox0338
// @match        https://lemonade.gg/code*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/560681/Lemonade%20CSS%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/560681/Lemonade%20CSS%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[CSS Injector] ========== SCRIPT START ==========');

    try {
        console.log('[CSS Injector] Line 1: Defining constants...');

        const STORAGE_KEY = 'lemonade_css_styles';
        const ACTIVE_STYLE_KEY = 'lemonade_active_style';
        const FAVORITES_KEY = 'lemonade_css_favorites';
        const RANDOM_FAVORITES_KEY = 'lemonade_random_favorites';
        const ORIGINAL_THEME_KEY = 'lemonade_original_theme_active';
        const HEADER_CHECK_INTERVAL = 300;
        const MAX_HEADER_CHECK_TIME = 30000;
        const TOAST_DURATION = 2500;
        const DEBOUNCE_DELAY = 150;
        const AUTO_SAVE_DELAY = 2000;

        console.log('[CSS Injector] Line 2: Constants defined');

        console.log('[CSS Injector] Line 3: Defining FEATURED_THEMES...');

        const FEATURED_THEMES = [
            {
                name: "Mountian Lake",
                author: "Silverfox0338",
                description: "Warm sunset-themed styling for Lemonade",
        css: `/*
 * @author Silverfox0338
 * @version 3.1.0
 * @description Warm sunset-themed styling for Lemonade - Mountain Lake Background
 */

@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;700&family=Raleway:wght@400;500;600&display=swap');

:root {
  /* ═══ Core Empire Colors ═══ */
  --ee-primary: #ffae00;
  --ee-primary-rgb: 255, 174, 0;
  --ee-hover: #e69900;

  /* ═══ Sunset Spectrum ═══ */
  --ee-gold: #ffc83d;
  --ee-gold-rgb: 255, 200, 61;
  --ee-amber: #ffae00;
  --ee-orange: #ff8c42;
  --ee-orange-rgb: 255, 140, 66;
  --ee-sunset: #ff6b35;
  --ee-sunset-rgb: 255, 107, 53;
  --ee-ember: #e85d04;
  --ee-ember-rgb: 232, 93, 4;

  /* ═══ Status Colors ═══ */
  --ee-success: #8fbc8f;
  --ee-danger: #cd5c5c;
  --ee-warning: #daa520;
  --ee-info: #87ceeb;
  --ee-online: #3d6b4f;
  --ee-idle: #c9a86c;
  --ee-dnd: #a85454;
  --ee-offline: #6b6b75;

  /* ═══ Deep Warm Backgrounds ═══ */
  --ee-bg-abyss: #0d0a08;
  --ee-bg-deep: #141008;
  --ee-bg-dark: #1a140c;
  --ee-bg-medium: #231a10;
  --ee-shadow: rgba(5, 3, 0, 0.8);
  --ee-glow: rgba(255, 174, 0, 0.15);

  /* ═══ Text Colors ═══ */
  --ee-text-bright: #fff8f0;
  --ee-text-primary: #ffe4c4;
  --ee-text-secondary: #d4a574;
  --ee-text-muted: #9c7a50;

  /* ═══ Fonts ═══ */
  --ee-font-heading: "Cinzel", "Georgia", serif;
  --ee-font-body: "Raleway", "Segoe UI", sans-serif;
  --ee-font-code: "JetBrains Mono", Consolas, monospace;
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL FONT APPLICATION
   ═══════════════════════════════════════════════════════════ */

html, body {
  font-family: var(--ee-font-body) !important;
  scroll-behavior: smooth !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--ee-font-heading) !important;
}

code, pre, textarea, kbd, samp, .font-mono {
  font-family: var(--ee-font-code) !important;
}

/* ═══════════════════════════════════════════════════════════
   NUCLEAR OPTION - Force Transparency on Gray Theme
   ═══════════════════════════════════════════════════════════ */

/* Force all gray theme backgrounds transparent - EXCLUDE chat input */
[class*="gray:bg"]:not([data-chat-input-container="true"]):not(.rounded-2xl),
[class*="gray\:bg"]:not([data-chat-input-container="true"]):not(.rounded-2xl),
[class*="gray:!bg"]:not([data-chat-input-container="true"]):not(.rounded-2xl),
[class*="gray\:\!bg"]:not([data-chat-input-container="true"]):not(.rounded-2xl) {
  background: transparent !important;
  background-color: transparent !important;
}

/* Force background utility classes transparent */
.bg-background:not([data-chat-input-container] *),
.bg-card:not([data-chat-input-container] *),
.bg-black\/5:not([data-chat-input-container] *),
.dark\:bg-white\/10:not([data-chat-input-container] *),
.bg-stone-200\/5:not([data-chat-input-container] *) {
  background: transparent !important;
  background-color: transparent !important;
}

.gray\:bg-card,
.gray\:bg-background,
.gray\:\!bg-\[\#333333\] {
  background: transparent !important;
  background-color: transparent !important;
}

/* ═══════════════════════════════════════════════════════════
   BACKGROUND - Static Mountain Lake Scenery
   ═══════════════════════════════════════════════════════════ */

html,
html.gray,
html[class*="gray"] {
  background: var(--ee-bg-abyss) !important;
  background-color: var(--ee-bg-abyss) !important;
  position: relative;
  min-height: 100vh;
}

/* Background image layer */
html::before,
html.gray::before {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-image: url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80") !important;
  background-position: center !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
  filter: brightness(0.5) contrast(1.1) saturate(0.7) sepia(15%) !important;
  z-index: -999999 !important;
  pointer-events: none !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Warm overlay for sunset tones */
html::after,
html.gray::after {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: linear-gradient(
    180deg,
    rgba(13, 10, 8, 0.4) 0%,
    rgba(255, 174, 0, 0.03) 50%,
    rgba(13, 10, 8, 0.5) 100%
  ) !important;
  z-index: -999998 !important;
  pointer-events: none !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Body and containers transparent */
body,
body[class] {
  background: transparent !important;
  background-color: transparent !important;
}

body > div,
body > div[class],
#__next {
  background: transparent !important;
  background-color: transparent !important;
}

/* Main app containers */
.overflow-hidden,
.overscroll-none,
.w-screen.h-screen,
div[class*="w-screen"][class*="h-screen"] {
  background: transparent !important;
  background-color: transparent !important;
}

/* ═══════════════════════════════════════════════════════════
   HEADER - Empire Banner Style
   ═══════════════════════════════════════════════════════════ */

.h-14.shrink-0.px-2.w-full.flex.items-center.justify-between,
.dark\:bg-background.light\:bg-background.gray\:bg-card,
header,
.header,
[class*="header"],
nav.h-14,
div[class*="h-14"][class*="flex"][class*="items-center"] {
  background: rgba(13, 10, 8, 0.75) !important;
  background-color: rgba(13, 10, 8, 0.75) !important;
  backdrop-filter: blur(12px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(12px) saturate(1.2) !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 -1px 0 rgba(var(--ee-gold-rgb), 0.08) !important;
}

/* ═══════════════════════════════════════════════════════════
   TABS BAR
   ═══════════════════════════════════════════════════════════ */

.flex.items-center.gap-1.px-4.py-1\.5.bg-background,
.flex.items-center.gap-1.md\:px-20.md\:py-2.bg-background,
.flex.items-center.gap-1.px-4.md\:px-20.py-1\.5.md\:py-2.bg-background.gray\:\!bg-card,
div[class*="gray:!bg-card"] {
  background: transparent !important;
  background-color: transparent !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
}

/* ═══════════════════════════════════════════════════════════
   MESSAGES CONTAINER - Transparent
   ═══════════════════════════════════════════════════════════ */

.flex-1.px-4.py-4.space-y-4.overflow-y-auto,
.px-4.py-4.space-y-4.pb-\[8vh\].overflow-y-auto,
.flex-1.px-4.md\:px-20.py-4.space-y-4.pb-\[8vh\].overflow-y-auto.styled-scrollbar.gray\:bg-card,
.styled-scrollbar.gray\:bg-card,
.flex.max-h-full.overflow-hidden.gray\:bg-card,
.flex-1.relative.flex.flex-col.min-w-0 {
  background: transparent !important;
  background-color: transparent !important;
}

/* ═══════════════════════════════════════════════════════════
   AUTOCOMPLETE/SEARCH DROPDOWN - Golden Frosted Glass
   ═══════════════════════════════════════════════════════════ */

/* Main dropdown container */
.absolute.z-50.bg-background.border.border-border.rounded-lg.shadow-lg.overflow-hidden,
.absolute.z-50.bg-background.border.border-border.rounded-lg.shadow-lg {
  background: linear-gradient(145deg,
    rgba(20, 16, 8, 0.92),
    rgba(26, 20, 12, 0.88)) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-left: 4px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(16px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.3) !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 2px 12px rgba(var(--ee-primary-rgb), 0.08),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.06) !important;
}

/* Scrollable inner container */
.absolute.z-50 .overflow-y-auto {
  background: transparent !important;
}

/* Dropdown items - base state */
.absolute.z-50 .flex.items-center.gap-2.px-3.py-2.cursor-pointer.transition-colors {
  background: transparent !important;
  border-left: 3px solid transparent !important;
  margin-left: -2px !important;
  transition: all 0.25s ease !important;
}

/* Selected/active item (bg-accent) */
.absolute.z-50 .flex.items-center.gap-2.px-3.py-2.cursor-pointer.bg-accent,
.absolute.z-50 .flex.items-center.gap-2.px-3.py-2.cursor-pointer.bg-accent.text-accent-foreground {
  background: rgba(var(--ee-primary-rgb), 0.18) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.7) !important;
  box-shadow: inset 0 0 20px rgba(var(--ee-gold-rgb), 0.04) !important;
}

/* Hover state for non-selected items */
.absolute.z-50 .flex.items-center.gap-2.px-3.py-2.cursor-pointer.transition-colors:hover:not(.bg-accent) {
  background: rgba(var(--ee-primary-rgb), 0.1) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.4) !important;
}

/* Footer section with hint text */
.absolute.z-50 .border-t.border-border.px-3.py-2,
.absolute.z-50 .border-t.border-border.px-3.py-2.bg-muted\/30 {
  background: rgba(13, 10, 8, 0.45) !important;
  border-top: 1px solid rgba(var(--ee-primary-rgb), 0.18) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

/* Item name text */
.absolute.z-50 .text-sm.font-medium {
  color: var(--ee-text-primary) !important;
}

/* Item path/description text */
.absolute.z-50 .text-xs.text-muted-foreground {
  color: var(--ee-text-muted) !important;
}

/* Footer hint text */
.absolute.z-50 .border-t p.text-xs.text-muted-foreground {
  color: var(--ee-text-secondary) !important;
  opacity: 0.8 !important;
}

/* Icons in the dropdown */
.absolute.z-50 img.w-4.h-4 {
  filter: sepia(20%) brightness(1.1) !important;
  opacity: 0.85 !important;
  transition: all 0.25s ease !important;
}

/* Icon glow on selected item */
.absolute.z-50 .bg-accent img.w-4.h-4 {
  filter: sepia(30%) brightness(1.2) drop-shadow(0 0 4px rgba(var(--ee-gold-rgb), 0.3)) !important;
  opacity: 1 !important;
}

/* ═══════════════════════════════════════════════════════════
   AI MESSAGE BUBBLES - Golden Frosted Glass
   ═══════════════════════════════════════════════════════════ */

.relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.bg-background.text-foreground.w-fit.max-w-full.break-words,
[data-message-author="assistant"],
div[class*="message"][class*="assistant"],
[class*="ai-message"] {
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-left: 4px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  backdrop-filter: blur(12px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(12px) saturate(1.2) !important;
  box-shadow:
    0 2px 12px rgba(var(--ee-primary-rgb), 0.08),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.06) !important;
  transition: all 0.25s ease !important;
  padding: 0.75rem !important;
}

.relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.bg-background.text-foreground.w-fit.max-w-full.break-words:hover,
[data-message-author="assistant"]:hover,
div[class*="message"][class*="assistant"]:hover {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.4) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  backdrop-filter: blur(16px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.3) !important;
  box-shadow:
    0 4px 20px rgba(var(--ee-primary-rgb), 0.12),
    0 0 28px rgba(var(--ee-gold-rgb), 0.06) !important;
}

/* ═══════════════════════════════════════════════════════════
   USER MESSAGE BUBBLES - Darker Ember Style
   ═══════════════════════════════════════════════════════════ */

.relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.p-2,
[data-message-author="user"],
div[class*="message"][class*="user"],
[class*="user-message"] {
  background: rgba(13, 10, 8, 0.4) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-left: 3px solid rgba(var(--ee-orange-rgb), 0.4) !important;
  backdrop-filter: blur(12px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(12px) saturate(1.2) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.02) !important;
  transition: all 0.25s ease !important;
}

.relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.p-2:hover,
[data-message-author="user"]:hover,
div[class*="message"][class*="user"]:hover {
  background: rgba(20, 15, 10, 0.5) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  border-left-color: rgba(var(--ee-orange-rgb), 0.6) !important;
  backdrop-filter: blur(16px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.3) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(var(--ee-sunset-rgb), 0.06) !important;
}

/* ═══════════════════════════════════════════════════════════
   CRITICAL: Remove Styling from Inner Message Elements
   ═══════════════════════════════════════════════════════════ */

.relative.group,
.relative.group > div,
.relative.group p,
.relative.group ul,
.relative.group li,
div[class*="rounded-tr-2xl"] .relative.group,
div[class*="rounded-tr-2xl"] p,
div[class*="rounded-tr-2xl"] ul,
div[class*="rounded-tr-2xl"] li,
[class*="message"] p,
[class*="message"] ul,
[class*="message"] li,
[class*="message"] .relative {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ═══════════════════════════════════════════════════════════
   BUTTONS - Empire Gold Style
   ═══════════════════════════════════════════════════════════ */

button:not(.sfx-toggle-btn):not(.lpb-trigger):not([class*="sfx-"]):not([class*="lpb-"]):not(.unstyled) {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.15),
    rgba(var(--ee-orange-rgb), 0.18)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
  transition: all 0.25s ease !important;
}

button:hover:not(:disabled):not(.sfx-toggle-btn):not(.lpb-trigger):not([class*="sfx-"]):not([class*="lpb-"]):not(.unstyled) {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.25),
    rgba(var(--ee-orange-rgb), 0.28)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(var(--ee-gold-rgb), 0.08) !important;
  transform: translateY(-1px) !important;
}

button:active:not(:disabled):not(.sfx-toggle-btn):not(.lpb-trigger):not([class*="sfx-"]):not([class*="lpb-"]):not(.unstyled) {
  transform: translateY(0) scale(0.98) !important;
}

.animate-shine {
  background: linear-gradient(110deg,
    rgba(var(--ee-primary-rgb), 0.25) 0%,
    rgba(var(--ee-primary-rgb), 0.25) 40%,
    rgba(var(--ee-gold-rgb), 0.5) 50%,
    rgba(var(--ee-primary-rgb), 0.25) 60%,
    rgba(var(--ee-primary-rgb), 0.25) 100%) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
}

/* ═══════════════════════════════════════════════════════════
   BADGES
   ═══════════════════════════════════════════════════════════ */

.bg-yellow-500\/20 {
  background: rgba(var(--ee-primary-rgb), 0.2) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.35) !important;
}

.bg-white\/10.ring-1,
.bg-stone-200\/5 {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.12),
    rgba(var(--ee-orange-rgb), 0.08)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

.ring-1.ring-white\/20 {
  background: rgba(var(--ee-primary-rgb), 0.1) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   CHECKPOINT/INPUT BUTTONS
   ═══════════════════════════════════════════════════════════ */

.border.rounded-md.text-sm.transition-all {
  background: rgba(var(--ee-primary-rgb), 0.06) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  color: rgba(var(--ee-primary-rgb), 0.85) !important;
  transition: all 0.25s ease !important;
}

.border.rounded-md.text-sm:hover {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBARS - Ember Glow
   ═══════════════════════════════════════════════════════════ */

::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}

::-webkit-scrollbar-track {
  background: transparent !important;
}

::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 4px !important;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--ee-primary-rgb), 0.35) !important;
}

::-webkit-scrollbar-corner {
  background: transparent !important;
}

* {
  scrollbar-width: thin !important;
  scrollbar-color: rgba(var(--ee-primary-rgb), 0.2) transparent !important;
}

/* ═══════════════════════════════════════════════════════════
   CODE BLOCKS - Dark Parchment
   ═══════════════════════════════════════════════════════════ */

code {
  background: rgba(0, 0, 0, 0.55) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 6px !important;
  color: var(--ee-gold) !important;
  padding: 0.15rem 0.4rem !important;
}

pre {
  background: rgba(0, 0, 0, 0.65) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
  border-left: 3px solid rgba(var(--ee-primary-rgb), 0.35) !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

pre code {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

/* ═══════════════════════════════════════════════════════════
   SELECTION & MISC
   ═══════════════════════════════════════════════════════════ */

::selection {
  background-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-bright) !important;
}

::-moz-selection {
  background-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-bright) !important;
}

.text-yellow-500,
.dark\:text-yellow-400 {
  color: var(--ee-gold) !important;
}

.text-muted-foreground {
  color: var(--ee-text-muted) !important;
}

.text-foreground {
  color: var(--ee-text-primary) !important;
}

/* ═══════════════════════════════════════════════════════════
   AVATARS - Golden Ring
   ═══════════════════════════════════════════════════════════ */

.rounded-full img {
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.35),
    0 0 16px rgba(var(--ee-gold-rgb), 0.06) !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

.rounded-full img:hover {
  border-color: rgba(var(--ee-gold-rgb), 0.4) !important;
  box-shadow:
    0 0 14px rgba(0, 0, 0, 0.45),
    0 0 24px rgba(var(--ee-gold-rgb), 0.12) !important;
}

/* ═══════════════════════════════════════════════════════════
   FOCUS STATES
   ═══════════════════════════════════════════════════════════ */

*:focus-visible {
  outline: 2px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.12) !important;
}

/* ═══════════════════════════════════════════════════════════
   DROPDOWNS & MODALS - Base Styles
   ═══════════════════════════════════════════════════════════ */

[role="menu"],
[role="dialog"],
[role="listbox"],
.modal,
.dropdown,
[class*="modal"]:not([class*="lpb-"]),
[class*="dropdown"] {
  background: linear-gradient(145deg,
    rgba(20, 16, 8, 0.95),
    rgba(26, 20, 12, 0.92)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.18) !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(20px) saturate(1.4) !important;
  -webkit-backdrop-filter: blur(20px) saturate(1.4) !important;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 1px rgba(var(--ee-gold-rgb), 0.15),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.05) !important;
}

/* Menu items */
[role="menuitem"],
[role="option"] {
  color: var(--ee-text-primary) !important;
  transition: all 0.2s ease !important;
}

[role="menuitem"]:hover,
[role="option"]:hover {
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  color: var(--ee-gold) !important;
}

/* ═══════════════════════════════════════════════════════════
   INPUTS & TEXTAREAS
   ═══════════════════════════════════════════════════════════ */

input:not([type="checkbox"]):not([type="radio"]):not([class*="lpb-"]),
textarea:not([class*="lpb-"]),
select:not([class*="lpb-"]) {
  background: rgba(13, 10, 8, 0.6) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  transition: all 0.25s ease !important;
}

input:focus:not([class*="lpb-"]),
textarea:focus:not([class*="lpb-"]),
select:focus:not([class*="lpb-"]) {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 0 0 3px rgba(var(--ee-primary-rgb), 0.1),
    0 0 20px rgba(var(--ee-gold-rgb), 0.08) !important;
  outline: none !important;
}

input::placeholder,
textarea::placeholder {
  color: var(--ee-text-muted) !important;
  opacity: 0.7 !important;
}

/* ═══════════════════════════════════════════════════════════
   CHAT INPUT CONTAINER - Protected Styling
   ═══════════════════════════════════════════════════════════ */

[data-chat-input-container="true"],
.chat-input-container,
.rounded-2xl[class*="border"] {
  background: rgba(13, 10, 8, 0.85) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  backdrop-filter: blur(16px) saturate(1.3) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.3) !important;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.08) !important;
}

/* ═══════════════════════════════════════════════════════════
   ENHANCED TOOLTIPS - Golden Ember Style
   ═══════════════════════════════════════════════════════════ */

[role="tooltip"],
.tooltip,
[class*="tooltip"],
[data-state="delayed-open"][data-side],
[data-radix-popper-content-wrapper] > div,
.tippy-box,
.tippy-content {
  background: linear-gradient(145deg,
    rgba(20, 16, 8, 0.97),
    rgba(26, 20, 12, 0.95)) !important;
  border: 1px solid rgba(var(--ee-gold-rgb), 0.35) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.6) !important;
  color: var(--ee-text-primary) !important;
  border-radius: 0.625rem !important;
  backdrop-filter: blur(16px) saturate(1.4) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.4) !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 4px 16px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(var(--ee-gold-rgb), 0.08),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.1) !important;
  padding: 0.625rem 0.875rem !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.015em !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  animation: tooltip-fade-in 0.2s ease-out !important;
  z-index: 999999 !important;
}

/* Tooltip arrow styling */
[role="tooltip"]::before,
.tooltip::before,
[data-radix-popper-content-wrapper] > div::before {
  border-color: rgba(var(--ee-gold-rgb), 0.35) transparent transparent transparent !important;
}

/* Tooltip animation */
@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Tooltip title/header if present */
[role="tooltip"] strong,
.tooltip strong,
[class*="tooltip"] strong {
  color: var(--ee-gold) !important;
  font-family: var(--ee-font-heading) !important;
  font-weight: 600 !important;
  display: block !important;
  margin-bottom: 0.25rem !important;
}

/* Tooltip description text */
[role="tooltip"] p,
.tooltip p,
[class*="tooltip"] p {
  color: var(--ee-text-secondary) !important;
  font-size: 0.75rem !important;
  margin: 0 !important;
  opacity: 0.9 !important;
}

/* Keyboard shortcut hints in tooltips */
[role="tooltip"] kbd,
.tooltip kbd,
[class*="tooltip"] kbd {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 4px !important;
  padding: 0.125rem 0.375rem !important;
  font-family: var(--ee-font-code) !important;
  font-size: 0.6875rem !important;
  color: var(--ee-gold) !important;
  margin-left: 0.5rem !important;
}

/* ═══════════════════════════════════════════════════════════
   LINKS
   ═══════════════════════════════════════════════════════════ */

a:not([class*="lpb-"]) {
  color: var(--ee-gold) !important;
  text-decoration: none !important;
  transition: all 0.2s ease !important;
}

a:hover:not([class*="lpb-"]) {
  color: var(--ee-primary) !important;
  text-shadow: 0 0 8px rgba(var(--ee-gold-rgb), 0.3) !important;
}

/* ═══════════════════════════════════════════════════════════
   LOADING STATES
   ═══════════════════════════════════════════════════════════ */

.animate-pulse {
  animation: ee-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
}

@keyframes ee-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-spin {
  animation: ee-spin 1s linear infinite !important;
}

@keyframes ee-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER MODAL - Complete Styling
   ═══════════════════════════════════════════════════════════ */

/* Modal Overlay */
.lpb-modal-overlay,
[class*="lpb-modal-overlay"] {
  background: rgba(5, 3, 0, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

/* Main Modal Container */
.lpb-modal,
[class*="lpb-modal"]:not(.lpb-modal-overlay) {
  background: transparent !important;
}

/* Modal Content */
.lpb-modal-content {
  background: linear-gradient(165deg,
    rgba(20, 16, 8, 0.97) 0%,
    rgba(26, 20, 12, 0.95) 50%,
    rgba(18, 14, 8, 0.97) 100%) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-top: 3px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  border-radius: 1rem !important;
  backdrop-filter: blur(24px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(24px) saturate(1.5) !important;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.65),
    0 10px 40px rgba(0, 0, 0, 0.45),
    0 0 60px rgba(var(--ee-gold-rgb), 0.06),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2) !important;
  overflow: hidden !important;
  max-height: 85vh !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Modal Header */
.lpb-header {
  background: linear-gradient(180deg,
    rgba(var(--ee-primary-rgb), 0.12) 0%,
    rgba(var(--ee-primary-rgb), 0.04) 100%) !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  padding: 1rem 1.25rem !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  position: relative !important;
}

.lpb-header::after {
  content: "" !important;
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 1px !important;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(var(--ee-gold-rgb), 0.3) 50%,
    transparent 100%) !important;
}

/* Modal Title */
.lpb-title {
  font-family: var(--ee-font-heading) !important;
  font-size: 1.375rem !important;
  font-weight: 600 !important;
  color: var(--ee-gold) !important;
  text-shadow:
    0 0 20px rgba(var(--ee-gold-rgb), 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3) !important;
  letter-spacing: 0.03em !important;
  margin: 0 !important;
}

/* Close Button */
.lpb-close-btn {
  width: 2rem !important;
  height: 2rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(var(--ee-primary-rgb), 0.1) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-secondary) !important;
  font-size: 1.25rem !important;
  font-weight: 300 !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-close-btn:hover {
  background: rgba(var(--ee-danger), 0.2) !important;
  border-color: rgba(var(--ee-danger), 0.4) !important;
  color: var(--ee-danger) !important;
  transform: rotate(90deg) !important;
  box-shadow: 0 0 12px rgba(var(--ee-danger), 0.15) !important;
}

/* Modal Body */
.lpb-body {
  padding: 0 !important;
  flex: 1 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Tabs
   ═══════════════════════════════════════════════════════════ */

.lpb-tabs {
  display: flex !important;
  gap: 0.25rem !important;
  padding: 0.75rem 1rem !important;
  background: rgba(0, 0, 0, 0.2) !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
  overflow-x: auto !important;
  flex-shrink: 0 !important;
}

.lpb-tabs::-webkit-scrollbar {
  height: 4px !important;
}

.lpb-tabs::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 2px !important;
}

/* Individual Tab */
.lpb-tab {
  padding: 0.5rem 1rem !important;
  background: rgba(var(--ee-primary-rgb), 0.06) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-secondary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  white-space: nowrap !important;
  position: relative !important;
}

.lpb-tab:hover:not(.active) {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.25) !important;
  color: var(--ee-text-primary) !important;
  transform: translateY(-1px) !important;
}

/* Active Tab */
.lpb-tab.active {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.2),
    rgba(var(--ee-gold-rgb), 0.15)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.4) !important;
  color: var(--ee-gold) !important;
  box-shadow:
    0 2px 12px rgba(var(--ee-gold-rgb), 0.15),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.1) !important;
}

.lpb-tab.active::after {
  content: "" !important;
  position: absolute !important;
  bottom: -1px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 60% !important;
  height: 2px !important;
  background: var(--ee-gold) !important;
  border-radius: 2px 2px 0 0 !important;
  box-shadow: 0 0 8px rgba(var(--ee-gold-rgb), 0.5) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Main Content Area
   ═══════════════════════════════════════════════════════════ */

#lpb-main-content {
  padding: 1.25rem !important;
  flex: 1 !important;
  overflow-y: auto !important;
  background: transparent !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Category Grid
   ═══════════════════════════════════════════════════════════ */

.lpb-category-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
  gap: 1rem !important;
}

/* Category Cards */
.lpb-category-card {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.08),
    rgba(var(--ee-orange-rgb), 0.05)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.18) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.4) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.lpb-category-card::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 100% !important;
  background: linear-gradient(180deg,
    rgba(var(--ee-gold-rgb), 0.05) 0%,
    transparent 50%) !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}

.lpb-category-card:hover {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.15),
    rgba(var(--ee-orange-rgb), 0.1)) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-3px) scale(1.01) !important;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.35),
    0 0 30px rgba(var(--ee-gold-rgb), 0.08) !important;
}

.lpb-category-card:hover::before {
  opacity: 1 !important;
}

.lpb-category-card:active {
  transform: translateY(-1px) scale(0.99) !important;
}

/* Category Name */
.lpb-category-name {
  font-family: var(--ee-font-heading) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: var(--ee-text-primary) !important;
  margin-bottom: 0.5rem !important;
  position: relative !important;
  z-index: 1 !important;
  transition: color 0.25s ease !important;
}

.lpb-category-card:hover .lpb-category-name {
  color: var(--ee-gold) !important;
  text-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.3) !important;
}

/* Category Description */
.lpb-category-desc {
  font-family: var(--ee-font-body) !important;
  font-size: 0.8125rem !important;
  color: var(--ee-text-muted) !important;
  line-height: 1.4 !important;
  position: relative !important;
  z-index: 1 !important;
  transition: color 0.25s ease !important;
}

.lpb-category-card:hover .lpb-category-desc {
  color: var(--ee-text-secondary) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Template Items (for inside categories)
   ═══════════════════════════════════════════════════════════ */

.lpb-template-item,
.lpb-history-item,
.lpb-favorite-item,
.lpb-workflow-item {
  background: rgba(var(--ee-primary-rgb), 0.06) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.625rem !important;
  padding: 1rem !important;
  margin-bottom: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-template-item:hover,
.lpb-history-item:hover,
.lpb-favorite-item:hover,
.lpb-workflow-item:hover {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  transform: translateX(4px) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Form Elements
   ═══════════════════════════════════════════════════════════ */

.lpb-input,
.lpb-textarea,
.lpb-select,
input[class*="lpb-"],
textarea[class*="lpb-"],
select[class*="lpb-"] {
  background: rgba(13, 10, 8, 0.7) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  padding: 0.625rem 0.875rem !important;
  color: var(--ee-text-primary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  width: 100% !important;
  transition: all 0.25s ease !important;
}

.lpb-input:focus,
.lpb-textarea:focus,
.lpb-select:focus,
input[class*="lpb-"]:focus,
textarea[class*="lpb-"]:focus,
select[class*="lpb-"]:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 0 0 3px rgba(var(--ee-primary-rgb), 0.1),
    0 0 16px rgba(var(--ee-gold-rgb), 0.1) !important;
  outline: none !important;
}

.lpb-input::placeholder,
.lpb-textarea::placeholder {
  color: var(--ee-text-muted) !important;
  opacity: 0.6 !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Buttons
   ═══════════════════════════════════════════════════════════ */

.lpb-btn,
button[class*="lpb-btn"] {
  padding: 0.625rem 1.25rem !important;
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.18),
    rgba(var(--ee-orange-rgb), 0.15)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-btn:hover,
button[class*="lpb-btn"]:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.28),
    rgba(var(--ee-orange-rgb), 0.25)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(var(--ee-gold-rgb), 0.1) !important;
}

.lpb-btn:active,
button[class*="lpb-btn"]:active {
  transform: translateY(0) scale(0.98) !important;
}

/* Primary Button Variant */
.lpb-btn-primary,
.lpb-btn.primary {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
}

.lpb-btn-primary:hover,
.lpb-btn.primary:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.45),
    rgba(var(--ee-primary-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(var(--ee-gold-rgb), 0.15) !important;
}

/* Secondary/Ghost Button Variant */
.lpb-btn-secondary,
.lpb-btn.secondary,
.lpb-btn-ghost {
  background: transparent !important;
  border-color: rgba(var(--ee-primary-rgb), 0.2) !important;
  color: var(--ee-text-secondary) !important;
}

.lpb-btn-secondary:hover,
.lpb-btn.secondary:hover,
.lpb-btn-ghost:hover {
  background: rgba(var(--ee-primary-rgb), 0.1) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
}

/* Danger Button Variant */
.lpb-btn-danger,
.lpb-btn.danger {
  background: linear-gradient(135deg,
    rgba(var(--ee-danger), 0.2),
    rgba(var(--ee-danger), 0.15)) !important;
  border-color: rgba(var(--ee-danger), 0.35) !important;
  color: var(--ee-danger) !important;
}

.lpb-btn-danger:hover,
.lpb-btn.danger:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-danger), 0.35),
    rgba(var(--ee-danger), 0.25)) !important;
  border-color: rgba(var(--ee-danger), 0.5) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Empty States
   ═══════════════════════════════════════════════════════════ */

.lpb-empty-state {
  text-align: center !important;
  padding: 3rem 1.5rem !important;
  color: var(--ee-text-muted) !important;
}

.lpb-empty-state-icon {
  font-size: 3rem !important;
  opacity: 0.5 !important;
  margin-bottom: 1rem !important;
}

.lpb-empty-state-title {
  font-family: var(--ee-font-heading) !important;
  font-size: 1.125rem !important;
  color: var(--ee-text-secondary) !important;
  margin-bottom: 0.5rem !important;
}

.lpb-empty-state-desc {
  font-size: 0.875rem !important;
  color: var(--ee-text-muted) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Settings Tab Styles
   ═══════════════════════════════════════════════════════════ */

.lpb-settings-section {
  margin-bottom: 1.5rem !important;
}

.lpb-settings-title {
  font-family: var(--ee-font-heading) !important;
  font-size: 1rem !important;
  color: var(--ee-gold) !important;
  margin-bottom: 0.75rem !important;
  padding-bottom: 0.5rem !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
}

.lpb-settings-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 0.75rem 0 !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.08) !important;
}

.lpb-settings-label {
  color: var(--ee-text-primary) !important;
  font-size: 0.875rem !important;
}

.lpb-settings-hint {
  color: var(--ee-text-muted) !important;
  font-size: 0.75rem !important;
  margin-top: 0.25rem !important;
}

/* Toggle Switch */
.lpb-toggle {
  width: 44px !important;
  height: 24px !important;
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 12px !important;
  position: relative !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-toggle::after {
  content: "" !important;
  position: absolute !important;
  top: 2px !important;
  left: 2px !important;
  width: 18px !important;
  height: 18px !important;
  background: var(--ee-text-muted) !important;
  border-radius: 50% !important;
  transition: all 0.25s ease !important;
}

.lpb-toggle.active {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.3),
    rgba(var(--ee-primary-rgb), 0.25)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
}

.lpb-toggle.active::after {
  left: 22px !important;
  background: var(--ee-gold) !important;
  box-shadow: 0 0 8px rgba(var(--ee-gold-rgb), 0.4) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Back Button & Navigation
   ═══════════════════════════════════════════════════════════ */

.lpb-back-btn,
.lpb-nav-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-secondary) !important;
  font-size: 0.8125rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  margin-bottom: 1rem !important;
}

.lpb-back-btn:hover,
.lpb-nav-btn:hover {
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-gold) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Search
   ═══════════════════════════════════════════════════════════ */

.lpb-search-container {
  margin-bottom: 1rem !important;
  position: relative !important;
}

.lpb-search-input {
  width: 100% !important;
  padding: 0.75rem 1rem 0.75rem 2.5rem !important;
  background: rgba(13, 10, 8, 0.6) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.625rem !important;
  color: var(--ee-text-primary) !important;
  font-size: 0.875rem !important;
}

.lpb-search-input:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.4) !important;
  box-shadow: 0 0 16px rgba(var(--ee-gold-rgb), 0.08) !important;
}

.lpb-search-icon {
  position: absolute !important;
  left: 0.875rem !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  color: var(--ee-text-muted) !important;
  pointer-events: none !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Scrollbar
   ═══════════════════════════════════════════════════════════ */

.lpb-modal-content ::-webkit-scrollbar,
#lpb-main-content::-webkit-scrollbar {
  width: 6px !important;
}

.lpb-modal-content ::-webkit-scrollbar-track,
#lpb-main-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 3px !important;
}

.lpb-modal-content ::-webkit-scrollbar-thumb,
#lpb-main-content::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 3px !important;
}

.lpb-modal-content ::-webkit-scrollbar-thumb:hover,
#lpb-main-content::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--ee-primary-rgb), 0.4) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Animations
   ═══════════════════════════════════════════════════════════ */

@keyframes lpb-modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes lpb-modal-exit {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
}

.lpb-modal-content {
  animation: lpb-modal-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.lpb-modal-content.closing {
  animation: lpb-modal-exit 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
}

/* Category card stagger animation */
.lpb-category-card {
  animation: lpb-card-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards !important;
}

@keyframes lpb-card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lpb-category-card:nth-child(1) { animation-delay: 0.05s !important; }
.lpb-category-card:nth-child(2) { animation-delay: 0.1s !important; }
.lpb-category-card:nth-child(3) { animation-delay: 0.15s !important; }
.lpb-category-card:nth-child(4) { animation-delay: 0.2s !important; }
.lpb-category-card:nth-child(5) { animation-delay: 0.25s !important; }
.lpb-category-card:nth-child(6) { animation-delay: 0.3s !important; }
.lpb-category-card:nth-child(7) { animation-delay: 0.35s !important; }
.lpb-category-card:nth-child(8) { animation-delay: 0.4s !important; }
.lpb-category-card:nth-child(9) { animation-delay: 0.45s !important; }

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Responsive
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .lpb-modal-content {
    margin: 0.5rem !important;
    max-height: 95vh !important;
    border-radius: 0.75rem !important;
  }

  .lpb-tabs {
    padding: 0.5rem 0.75rem !important;
  }

  .lpb-tab {
    padding: 0.4rem 0.75rem !important;
    font-size: 0.75rem !important;
  }

  .lpb-category-grid {
    grid-template-columns: 1fr !important;
    gap: 0.75rem !important;
  }

  .lpb-category-card {
    padding: 1rem !important;
  }

  #lpb-main-content {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .lpb-header {
    padding: 0.75rem 1rem !important;
  }

  .lpb-title {
    font-size: 1.125rem !important;
  }

  .lpb-tabs {
    gap: 0.125rem !important;
  }

  .lpb-tab {
    padding: 0.35rem 0.625rem !important;
    font-size: 0.6875rem !important;
  }
}
/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - History Tab Specific Styles
   ═══════════════════════════════════════════════════════════ */

/* Search Wrapper */
.lpb-search-wrapper {
  margin-bottom: 1.25rem !important;
  position: relative !important;
}

/* History Results Container */
#lpb-history-results {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.75rem !important;
}

/* History Item Card - Enhanced */
.lpb-history-item {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.06),
    rgba(var(--ee-orange-rgb), 0.03)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.35) !important;
  border-radius: 0.75rem !important;
  padding: 1rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

.lpb-history-item::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 100% !important;
  background: linear-gradient(90deg,
    rgba(var(--ee-gold-rgb), 0.03) 0%,
    transparent 50%) !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
  pointer-events: none !important;
}

.lpb-history-item:hover {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.1),
    rgba(var(--ee-orange-rgb), 0.06)) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.28) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.6) !important;
  transform: translateX(4px) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.25),
    0 0 20px rgba(var(--ee-gold-rgb), 0.04) !important;
}

.lpb-history-item:hover::before {
  opacity: 1 !important;
}

/* History Top Row */
.lpb-history-top {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  margin-bottom: 0.75rem !important;
  gap: 0.75rem !important;
}

/* History Info Container */
.lpb-history-info {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 0.5rem 0.75rem !important;
  flex: 1 !important;
  min-width: 0 !important;
}

/* Badge Styling */
.lpb-badge {
  display: inline-flex !important;
  align-items: center !important;
  padding: 0.25rem 0.625rem !important;
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.18),
    rgba(var(--ee-orange-rgb), 0.12)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 0.375rem !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.6875rem !important;
  font-weight: 600 !important;
  color: var(--ee-gold) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.04em !important;
  white-space: nowrap !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
}

/* Custom Name (alternative to badge) */
.lpb-custom-name {
  font-family: var(--ee-font-heading) !important;
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
  color: var(--ee-text-primary) !important;
  transition: color 0.25s ease !important;
}

.lpb-history-item:hover .lpb-custom-name {
  color: var(--ee-gold) !important;
}

/* Timestamp */
.lpb-timestamp {
  font-family: var(--ee-font-body) !important;
  font-size: 0.6875rem !important;
  color: var(--ee-text-muted) !important;
  opacity: 0.8 !important;
  white-space: nowrap !important;
}

/* Favorite Button */
.lpb-fav-btn {
  width: 2rem !important;
  height: 2rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  font-size: 1rem !important;
  color: var(--ee-text-muted) !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
}

.lpb-fav-btn:hover {
  background: rgba(var(--ee-warning), 0.15) !important;
  border-color: rgba(var(--ee-warning), 0.35) !important;
  color: var(--ee-warning) !important;
  transform: scale(1.1) !important;
}

/* Favorited state (filled star ★) */
.lpb-fav-btn[data-favorited="true"],
.lpb-fav-btn:contains("★") {
  background: rgba(var(--ee-warning), 0.2) !important;
  border-color: rgba(var(--ee-warning), 0.45) !important;
  color: var(--ee-warning) !important;
  text-shadow: 0 0 8px rgba(var(--ee-warning), 0.4) !important;
}

/* History Preview Section */
.lpb-history-preview {
  display: flex !important;
  align-items: flex-start !important;
  gap: 0.5rem !important;
  padding: 0.75rem !important;
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.1) !important;
  border-radius: 0.5rem !important;
  margin-bottom: 0.75rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-history-preview:hover {
  background: rgba(0, 0, 0, 0.28) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.2) !important;
}

/* Preview Text */
.lpb-history-preview-text {
  flex: 1 !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.8125rem !important;
  line-height: 1.5 !important;
  color: var(--ee-text-secondary) !important;
  word-break: break-word !important;
  white-space: pre-wrap !important;
}

.lpb-history-preview-text.truncated {
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
}

/* Expanded state */
.lpb-history-preview.expanded .lpb-history-preview-text {
  -webkit-line-clamp: unset !important;
  display: block !important;
}

.lpb-history-preview.expanded .lpb-expand-icon {
  transform: rotate(180deg) !important;
}

/* Expand Icon */
.lpb-expand-icon {
  font-size: 0.625rem !important;
  color: var(--ee-text-muted) !important;
  opacity: 0.6 !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
  margin-top: 0.125rem !important;
}

.lpb-history-preview:hover .lpb-expand-icon {
  opacity: 1 !important;
  color: var(--ee-gold) !important;
}

/* History Actions Row */
.lpb-history-actions {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.5rem !important;
  padding-top: 0.5rem !important;
  border-top: 1px solid rgba(var(--ee-primary-rgb), 0.1) !important;
}

/* Small Button Variant */
.lpb-btn-small,
.lpb-btn.lpb-btn-small {
  padding: 0.375rem 0.75rem !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  border-radius: 0.375rem !important;
}

/* Primary small button (Use) */
.lpb-btn-small:not(.lpb-btn-secondary):not(.lpb-btn-danger) {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.25),
    rgba(var(--ee-primary-rgb), 0.2)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.4) !important;
  color: var(--ee-gold) !important;
}

.lpb-btn-small:not(.lpb-btn-secondary):not(.lpb-btn-danger):hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.6) !important;
  box-shadow: 0 2px 12px rgba(var(--ee-gold-rgb), 0.15) !important;
}

/* Secondary small button (Rename, Copy) */
.lpb-btn-small.lpb-btn-secondary {
  background: rgba(var(--ee-primary-rgb), 0.06) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.18) !important;
  color: var(--ee-text-secondary) !important;
}

.lpb-btn-small.lpb-btn-secondary:hover {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
}

/* Delete button special styling */
.lpb-btn-small[data-action="delete"] {
  background: rgba(var(--ee-danger), 0.08) !important;
  border-color: rgba(var(--ee-danger), 0.2) !important;
  color: var(--ee-danger) !important;
  opacity: 0.7 !important;
}

.lpb-btn-small[data-action="delete"]:hover {
  background: rgba(var(--ee-danger), 0.18) !important;
  border-color: rgba(var(--ee-danger), 0.4) !important;
  opacity: 1 !important;
  box-shadow: 0 2px 10px rgba(var(--ee-danger), 0.12) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - History Item Animations
   ═══════════════════════════════════════════════════════════ */

.lpb-history-item {
  animation: lpb-item-enter 0.35s cubic-bezier(0.4, 0, 0.2, 1) backwards !important;
}

@keyframes lpb-item-enter {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Stagger animation for history items */
.lpb-history-item:nth-child(1) { animation-delay: 0.03s !important; }
.lpb-history-item:nth-child(2) { animation-delay: 0.06s !important; }
.lpb-history-item:nth-child(3) { animation-delay: 0.09s !important; }
.lpb-history-item:nth-child(4) { animation-delay: 0.12s !important; }
.lpb-history-item:nth-child(5) { animation-delay: 0.15s !important; }
.lpb-history-item:nth-child(6) { animation-delay: 0.18s !important; }
.lpb-history-item:nth-child(7) { animation-delay: 0.21s !important; }
.lpb-history-item:nth-child(8) { animation-delay: 0.24s !important; }
.lpb-history-item:nth-child(9) { animation-delay: 0.27s !important; }
.lpb-history-item:nth-child(10) { animation-delay: 0.3s !important; }
.lpb-history-item:nth-child(n+11) { animation-delay: 0.33s !important; }

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Responsive History
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 600px) {
  .lpb-history-top {
    flex-direction: column !important;
    gap: 0.5rem !important;
  }

  .lpb-fav-btn {
    position: absolute !important;
    top: 0.75rem !important;
    right: 0.75rem !important;
  }

  .lpb-history-item {
    padding-right: 3rem !important;
  }

  .lpb-history-actions {
    justify-content: stretch !important;
  }

  .lpb-history-actions .lpb-btn-small {
    flex: 1 !important;
    text-align: center !important;
    justify-content: center !important;
  }

  .lpb-badge {
    font-size: 0.625rem !important;
    padding: 0.2rem 0.5rem !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Custom Templates Tab
   ═══════════════════════════════════════════════════════════ */

/* Info Banner (Override green theme with golden) */
#lpb-main-content > div[style*="linear-gradient(135deg, rgba(76, 175, 80"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.12),
    rgba(var(--ee-gold-rgb), 0.06)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.08) !important;
}

#lpb-main-content > div[style*="linear-gradient(135deg, rgba(76, 175, 80"] h4 {
  margin: 0 0 0.5rem 0 !important;
  color: var(--ee-gold) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  text-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.2) !important;
}

#lpb-main-content > div[style*="linear-gradient(135deg, rgba(76, 175, 80"] p {
  margin: 0 !important;
  color: var(--ee-text-secondary) !important;
  font-size: 0.8125rem !important;
  line-height: 1.6 !important;
}

/* Creator Name Card */
#lpb-main-content > div[style*="background: #1a1a1a"] {
  background: linear-gradient(145deg,
    rgba(20, 16, 8, 0.8),
    rgba(26, 20, 12, 0.75)) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.75rem !important;
  padding: 1rem !important;
  margin-bottom: 1.5rem !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
}

#lpb-main-content > div[style*="background: #1a1a1a"] > div {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 1rem !important;
}

#lpb-main-content > div[style*="background: #1a1a1a"] span {
  color: var(--ee-text-muted) !important;
  font-size: 0.6875rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  display: block !important;
  margin-bottom: 0.25rem !important;
}

#lpb-main-content > div[style*="background: #1a1a1a"] > div > div > div {
  color: var(--ee-text-primary) !important;
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
  font-family: var(--ee-font-heading) !important;
}

/* Change Creator Name Button */
#lpb-change-creator-name {
  padding: 0.5rem 1rem !important;
}

/* Action Buttons Container */
#lpb-main-content > div[style*="display: flex; gap: 12px"] {
  display: flex !important;
  gap: 0.75rem !important;
  margin-bottom: 1.5rem !important;
  flex-wrap: wrap !important;
}

/* Create New Template Button (Override green) */
#lpb-create-template {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border: 1px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  color: var(--ee-gold) !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

#lpb-create-template:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.45),
    rgba(var(--ee-primary-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 16px rgba(var(--ee-gold-rgb), 0.15) !important;
}

/* Import Template Button */
#lpb-import-template {
  padding: 0.75rem 1.5rem !important;
  font-size: 0.875rem !important;
}

/* Templates Grid */
#lpb-main-content > div[style*="display: grid; gap: 12px"] {
  display: grid !important;
  gap: 0.875rem !important;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
}

/* Template Card */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"][style*="border: 2px solid rgb(51, 51, 51)"] {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.08),
    rgba(var(--ee-orange-rgb), 0.04)) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.4) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
}

#lpb-main-content div[style*="background: rgb(26, 26, 26)"][style*="border: 2px solid rgb(51, 51, 51)"]::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 100% !important;
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.05) 0%,
    transparent 50%) !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
  pointer-events: none !important;
}

#lpb-main-content div[style*="background: rgb(26, 26, 26)"][style*="border: 2px solid rgb(51, 51, 51)"]:hover {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.12),
    rgba(var(--ee-orange-rgb), 0.08)) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-3px) scale(1.01) !important;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(var(--ee-gold-rgb), 0.08) !important;
}

#lpb-main-content div[style*="background: rgb(26, 26, 26)"][style*="border: 2px solid rgb(51, 51, 51)"]:hover::before {
  opacity: 1 !important;
}

/* Template Card Header */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"] > div:first-child {
  display: flex !important;
  justify-content: space-between !important;
  align-items: flex-start !important;
  margin-bottom: 0.75rem !important;
  gap: 1rem !important;
}

/* Template Title */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"] div[style*="font-size: 16px; font-weight: 600"] {
  font-size: 1rem !important;
  font-weight: 600 !important;
  font-family: var(--ee-font-heading) !important;
  color: var(--ee-text-primary) !important;
  margin-bottom: 0.25rem !important;
  transition: color 0.25s ease !important;
}

#lpb-main-content div[style*="background: rgb(26, 26, 26)"]:hover div[style*="font-size: 16px; font-weight: 600"] {
  color: var(--ee-gold) !important;
  text-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.25) !important;
}

/* Template Meta (by creator | used X times) */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"] div[style*="font-size: 12px; color: #666"] {
  font-size: 0.75rem !important;
  color: var(--ee-text-muted) !important;
}

/* Template Description */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"] > p {
  margin: 0 0 1rem 0 !important;
  font-size: 0.8125rem !important;
  color: var(--ee-text-secondary) !important;
  line-height: 1.5 !important;
}

/* Template Actions Container */
#lpb-main-content div[style*="background: rgb(26, 26, 26)"] > div[style*="display: flex; gap: 8px"] {
  display: flex !important;
  gap: 0.5rem !important;
  flex-wrap: wrap !important;
  padding-top: 0.75rem !important;
  border-top: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
}

/* Use Template Button (Override blue) */
button[data-action="use"][style*="background: linear-gradient(135deg, #2196F3"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.3),
    rgba(var(--ee-primary-rgb), 0.25)) !important;
  border: 1px solid rgba(var(--ee-gold-rgb), 0.45) !important;
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
}

button[data-action="use"][style*="background: linear-gradient(135deg, #2196F3"]:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.4),
    rgba(var(--ee-primary-rgb), 0.35)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.65) !important;
  box-shadow:
    0 2px 12px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(var(--ee-gold-rgb), 0.12) !important;
}

/* Share Button */
button[data-action="share"] {
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  color: var(--ee-text-secondary) !important;
}

button[data-action="share"]:hover {
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  color: var(--ee-text-primary) !important;
}

/* Delete Button (Override red inline styles) */
button[data-action="delete"][style*="color: #f44336"] {
  background: rgba(var(--ee-danger), 0.1) !important;
  border: 1px solid rgba(var(--ee-danger), 0.3) !important;
  color: var(--ee-danger) !important;
  opacity: 0.8 !important;
}

button[data-action="delete"][style*="color: #f44336"]:hover {
  background: rgba(var(--ee-danger), 0.2) !important;
  border-color: rgba(var(--ee-danger), 0.5) !important;
  opacity: 1 !important;
  box-shadow: 0 2px 12px rgba(var(--ee-danger), 0.15) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Custom Templates Responsive
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  #lpb-main-content > div[style*="display: grid; gap: 12px"] {
    grid-template-columns: 1fr !important;
  }

  #lpb-main-content > div[style*="display: flex; gap: 12px"] {
    flex-direction: column !important;
  }

  #lpb-create-template,
  #lpb-import-template {
    width: 100% !important;
    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  #lpb-main-content div[style*="background: rgb(26, 26, 26)"] > div[style*="display: flex; gap: 8px"] {
    flex-direction: column !important;
  }

  #lpb-main-content div[style*="background: rgb(26, 26, 26)"] > div[style*="display: flex; gap: 8px"] button {
    width: 100% !important;
    justify-content: center !important;
  }
}
/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Settings Tab
   ═══════════════════════════════════════════════════════════ */

/* Settings Section Container */
.lpb-settings-section {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.06),
    rgba(var(--ee-orange-rgb), 0.03)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-left: 3px solid rgba(var(--ee-gold-rgb), 0.4) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.25rem !important;
  transition: all 0.3s ease !important;
}

.lpb-settings-section:hover {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.09),
    rgba(var(--ee-orange-rgb), 0.05)) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.22) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.6) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
}

/* Section Heading */
.lpb-settings-section > h3 {
  font-family: var(--ee-font-heading) !important;
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  color: var(--ee-gold) !important;
  margin: 0 0 1rem 0 !important;
  padding-bottom: 0.625rem !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  text-shadow: 0 0 16px rgba(var(--ee-gold-rgb), 0.2) !important;
  position: relative !important;
}

.lpb-settings-section > h3::after {
  content: "" !important;
  position: absolute !important;
  bottom: -1px !important;
  left: 0 !important;
  width: 60px !important;
  height: 2px !important;
  background: linear-gradient(90deg,
    rgba(var(--ee-gold-rgb), 0.7),
    transparent) !important;
  border-radius: 2px !important;
}

/* Setting Item Row */
.lpb-setting-item {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 1.5rem !important;
  padding: 1rem 0 !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.08) !important;
  transition: all 0.25s ease !important;
}

.lpb-setting-item:last-child {
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

.lpb-setting-item:hover {
  padding-left: 0.5rem !important;
  background: rgba(var(--ee-primary-rgb), 0.04) !important;
  margin-left: -0.5rem !important;
  margin-right: -0.5rem !important;
  padding-right: 0.5rem !important;
  border-radius: 0.5rem !important;
}

/* Setting Label Container */
.lpb-setting-label {
  flex: 1 !important;
  min-width: 0 !important;
}

.lpb-setting-label h4 {
  font-family: var(--ee-font-heading) !important;
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
  color: var(--ee-text-primary) !important;
  margin: 0 0 0.25rem 0 !important;
  transition: color 0.25s ease !important;
}

.lpb-setting-item:hover .lpb-setting-label h4 {
  color: var(--ee-gold) !important;
}

.lpb-setting-label p {
  font-size: 0.8125rem !important;
  color: var(--ee-text-muted) !important;
  margin: 0 !important;
  line-height: 1.4 !important;
}

/* Info Text (for file references explanation) */
.lpb-setting-label[style*="font-size: 12px"] {
  font-size: 0.75rem !important;
  color: var(--ee-text-muted) !important;
  line-height: 1.6 !important;
  padding: 0.75rem !important;
  background: rgba(0, 0, 0, 0.25) !important;
  border-radius: 0.5rem !important;
  border-left: 2px solid rgba(var(--ee-primary-rgb), 0.3) !important;
}

.lpb-setting-label[style*="font-size: 12px"] strong {
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════
   TOGGLE SWITCH
   ═══════════════════════════════════════════════════════════ */

.lpb-toggle-switch {
  width: 52px !important;
  height: 28px !important;
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 14px !important;
  position: relative !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  flex-shrink: 0 !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.lpb-toggle-switch::after {
  content: "" !important;
  position: absolute !important;
  top: 3px !important;
  left: 3px !important;
  width: 20px !important;
  height: 20px !important;
  background: var(--ee-text-muted) !important;
  border-radius: 50% !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
}

.lpb-toggle-switch:hover {
  background: rgba(var(--ee-primary-rgb), 0.18) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  transform: scale(1.05) !important;
}

/* Active/On State */
.lpb-toggle-switch.active {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.6) !important;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 12px rgba(var(--ee-gold-rgb), 0.15) !important;
}

.lpb-toggle-switch.active::after {
  left: 27px !important;
  background: var(--ee-gold) !important;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(var(--ee-gold-rgb), 0.5) !important;
}

.lpb-toggle-switch.active:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.45),
    rgba(var(--ee-primary-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.8) !important;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 0 16px rgba(var(--ee-gold-rgb), 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS INPUTS
   ═══════════════════════════════════════════════════════════ */

/* Number Input / Slider */
.lpb-slider,
input[type="number"].lpb-input {
  width: 100px !important;
  padding: 0.5rem 0.75rem !important;
  background: rgba(13, 10, 8, 0.7) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  font-family: var(--ee-font-code) !important;
  font-size: 0.875rem !important;
  text-align: center !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
}

.lpb-slider:focus,
input[type="number"].lpb-input:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 0 0 3px rgba(var(--ee-primary-rgb), 0.1),
    0 0 16px rgba(var(--ee-gold-rgb), 0.12) !important;
  outline: none !important;
}

.lpb-slider:hover,
input[type="number"].lpb-input:hover {
  border-color: rgba(var(--ee-primary-rgb), 0.4) !important;
  background: rgba(13, 10, 8, 0.85) !important;
}

/* ═══════════════════════════════════════════════════════════
   STATISTICS SECTION
   ═══════════════════════════════════════════════════════════ */

.lpb-settings-section > div[style*="color: #888"] {
  color: var(--ee-text-secondary) !important;
  font-size: 0.8125rem !important;
  line-height: 1.8 !important;
}

.lpb-settings-section > div[style*="color: #888"] p {
  margin: 0.5rem 0 !important;
  padding-left: 0.75rem !important;
  border-left: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  transition: all 0.25s ease !important;
}

.lpb-settings-section > div[style*="color: #888"] p:hover {
  border-left-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  padding-left: 1rem !important;
}

/* Statistics Numbers (Override blue #2196F3) */
.lpb-settings-section strong[style*="color: #2196F3"],
.lpb-settings-section > div[style*="color: #888"] strong {
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
  font-family: var(--ee-font-heading) !important;
  text-shadow: 0 0 8px rgba(var(--ee-gold-rgb), 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION
   ═══════════════════════════════════════════════════════════ */

.lpb-settings-section > p[style*="color: #888"] {
  color: var(--ee-text-secondary) !important;
  font-size: 0.8125rem !important;
  line-height: 1.7 !important;
  margin: 0 !important;
}

/* About Version/Title (Override blue) */
.lpb-settings-section > p strong[style*="color: #2196F3"] {
  color: var(--ee-gold) !important;
  font-weight: 700 !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 1rem !important;
  text-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.25) !important;
  display: inline-block !important;
  margin-bottom: 0.5rem !important;
}

/* Section Headers in About */
.lpb-settings-section > p strong {
  color: var(--ee-text-primary) !important;
  font-weight: 600 !important;
  display: block !important;
  margin-top: 0.75rem !important;
  margin-bottom: 0.25rem !important;
}

/* Feature Bullets */
.lpb-settings-section > p[style*="color: #888"]::first-line {
  color: var(--ee-gold) !important;
}

/* Mode Labels (Beginner/Advanced) */
span[style*="color: #4CAF50"] {
  color: var(--ee-success) !important;
  font-weight: 600 !important;
}

span[style*="color: #9C27B0"] {
  color: var(--ee-sunset) !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS BUTTONS
   ═══════════════════════════════════════════════════════════ */

/* Export/Import Buttons */
#lpb-export-data,
#lpb-import-data {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.18),
    rgba(var(--ee-orange-rgb), 0.15)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  border-radius: 0.5rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
}

#lpb-export-data:hover,
#lpb-import-data:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.28),
    rgba(var(--ee-orange-rgb), 0.25)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(var(--ee-gold-rgb), 0.1) !important;
}

/* Clear All Button */
#lpb-clear-all {
  background: rgba(var(--ee-danger), 0.1) !important;
  border: 1px solid rgba(var(--ee-danger), 0.25) !important;
  color: var(--ee-danger) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  border-radius: 0.5rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
  opacity: 0.85 !important;
}

#lpb-clear-all:hover {
  background: rgba(var(--ee-danger), 0.2) !important;
  border-color: rgba(var(--ee-danger), 0.45) !important;
  opacity: 1 !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(var(--ee-danger), 0.12) !important;
}

#lpb-clear-all:active {
  transform: translateY(0) scale(0.97) !important;
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

.lpb-settings-section {
  animation: lpb-settings-enter 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards !important;
}

@keyframes lpb-settings-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for settings sections */
.lpb-settings-section:nth-child(1) { animation-delay: 0.05s !important; }
.lpb-settings-section:nth-child(2) { animation-delay: 0.1s !important; }
.lpb-settings-section:nth-child(3) { animation-delay: 0.15s !important; }
.lpb-settings-section:nth-child(4) { animation-delay: 0.2s !important; }
.lpb-settings-section:nth-child(5) { animation-delay: 0.25s !important; }
.lpb-settings-section:nth-child(6) { animation-delay: 0.3s !important; }

/* ═══════════════════════════════════════════════════════════
   SETTINGS RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 600px) {
  .lpb-setting-item {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.75rem !important;
  }

  .lpb-toggle-switch,
  .lpb-slider,
  .lpb-setting-item button {
    align-self: flex-end !important;
  }

  .lpb-settings-section {
    padding: 1rem !important;
  }

  .lpb-settings-section > h3 {
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .lpb-setting-label h4 {
    font-size: 0.875rem !important;
  }

  .lpb-setting-label p {
    font-size: 0.75rem !important;
  }

  .lpb-settings-section > p[style*="color: #888"] {
    font-size: 0.75rem !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Template Selection & Form
   ═══════════════════════════════════════════════════════════ */

/* Back Button */
.lpb-back-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.625rem 1.25rem !important;
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-secondary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  margin-bottom: 1.25rem !important;
}

.lpb-back-btn:hover {
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.35) !important;
  color: var(--ee-gold) !important;
  transform: translateX(-4px) !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
}

.lpb-back-btn:active {
  transform: translateX(-2px) scale(0.98) !important;
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE GRID
   ═══════════════════════════════════════════════════════════ */

.lpb-template-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
  gap: 1rem !important;
}

/* Template Card */
.lpb-template-card {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.08),
    rgba(var(--ee-orange-rgb), 0.05)) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-left: 4px solid rgba(var(--ee-gold-rgb), 0.4) !important;
  border-radius: 0.75rem !important;
  padding: 1.5rem 1.25rem !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 100px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.lpb-template-card::before {
  content: "" !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 100% !important;
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.06) 0%,
    transparent 60%) !important;
  opacity: 0 !important;
  transition: opacity 0.3s ease !important;
}

.lpb-template-card:hover {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.15),
    rgba(var(--ee-orange-rgb), 0.1)) !important;
  border-color: rgba(var(--ee-primary-rgb), 0.4) !important;
  border-left-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-4px) scale(1.02) !important;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.35),
    0 0 30px rgba(var(--ee-gold-rgb), 0.1) !important;
}

.lpb-template-card:hover::before {
  opacity: 1 !important;
}

.lpb-template-card:active {
  transform: translateY(-2px) scale(1.01) !important;
}

/* Template Name */
.lpb-template-name {
  font-family: var(--ee-font-heading) !important;
  font-size: 1.0625rem !important;
  font-weight: 600 !important;
  color: var(--ee-text-primary) !important;
  text-align: center !important;
  line-height: 1.4 !important;
  position: relative !important;
  z-index: 1 !important;
  transition: all 0.25s ease !important;
}

.lpb-template-card:hover .lpb-template-name {
  color: var(--ee-gold) !important;
  text-shadow: 0 0 16px rgba(var(--ee-gold-rgb), 0.3) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Form Body Layout Fix
   ═══════════════════════════════════════════════════════════ */

/* Make modal body scrollable */
.lpb-body {
  padding: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  max-height: calc(85vh - 80px) !important; /* Subtract header height */
}

/* Form Content Container */
#lpb-form-content {
  padding: 1.5rem !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 1.5rem !important;
}

/* Form Field Container */
.lpb-form-field {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.625rem !important;
  animation: lpb-field-enter 0.35s cubic-bezier(0.4, 0, 0.2, 1) backwards !important;
}

/* Conditional hidden fields */
.lpb-form-field[style*="display: none"] {
  display: none !important;
}

/* Label */
.lpb-label {
  font-family: var(--ee-font-body) !important;
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
  color: var(--ee-text-primary) !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

/* Required Asterisk */
.lpb-required {
  color: var(--ee-danger) !important;
  font-size: 1rem !important;
  margin-left: 0.125rem !important;
}

/* Textarea */
.lpb-textarea {
  min-height: 100px !important;
  max-height: 200px !important;
  resize: vertical !important;
  padding: 0.75rem !important;
  background: rgba(13, 10, 8, 0.7) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  transition: all 0.25s ease !important;
}

.lpb-textarea:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 0 0 3px rgba(var(--ee-primary-rgb), 0.1),
    0 0 20px rgba(var(--ee-gold-rgb), 0.1) !important;
  outline: none !important;
}

.lpb-textarea::placeholder {
  color: var(--ee-text-muted) !important;
  opacity: 0.6 !important;
}

/* ═══════════════════════════════════════════════════════════
   RADIO BUTTONS
   ═══════════════════════════════════════════════════════════ */

.lpb-radio-group {
  display: flex !important;
  gap: 1.25rem !important;
  flex-wrap: wrap !important;
  padding: 0.375rem 0 !important;
}

.lpb-radio-item {
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.lpb-radio-item:hover {
  transform: translateX(2px) !important;
}

.lpb-radio-item input[type="radio"] {
  appearance: none !important;
  -webkit-appearance: none !important;
  width: 18px !important;
  height: 18px !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 50% !important;
  background: rgba(13, 10, 8, 0.6) !important;
  cursor: pointer !important;
  position: relative !important;
  transition: all 0.25s ease !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
}

.lpb-radio-item input[type="radio"]:hover {
  border-color: rgba(var(--ee-primary-rgb), 0.5) !important;
  background: rgba(13, 10, 8, 0.8) !important;
}

.lpb-radio-item input[type="radio"]:checked {
  border-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  background: rgba(var(--ee-gold-rgb), 0.15) !important;
  box-shadow:
    0 0 0 2px rgba(var(--ee-gold-rgb), 0.1),
    0 0 12px rgba(var(--ee-gold-rgb), 0.15) !important;
}

.lpb-radio-item input[type="radio"]:checked::after {
  content: "" !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 8px !important;
  height: 8px !important;
  background: var(--ee-gold) !important;
  border-radius: 50% !important;
  box-shadow: 0 0 6px rgba(var(--ee-gold-rgb), 0.6) !important;
}

.lpb-radio-item label {
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  color: var(--ee-text-secondary) !important;
  cursor: pointer !important;
  transition: color 0.2s ease !important;
  user-select: none !important;
  margin: 0 !important;
}

.lpb-radio-item:hover label {
  color: var(--ee-text-primary) !important;
}

.lpb-radio-item input[type="radio"]:checked + label {
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW SECTION (Fixed Height)
   ═══════════════════════════════════════════════════════════ */

.lpb-preview {
  background: linear-gradient(145deg,
    rgba(var(--ee-primary-rgb), 0.08),
    rgba(var(--ee-orange-rgb), 0.04)) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-left: 4px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  margin-top: 0.5rem !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.08) !important;
}

/* Preview Header */
.lpb-preview-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 1rem !important;
  padding: 1rem 1.25rem !important;
  background: rgba(var(--ee-primary-rgb), 0.08) !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  flex-wrap: wrap !important;
}

.lpb-preview-title {
  font-family: var(--ee-font-heading) !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  color: var(--ee-gold) !important;
  text-shadow: 0 0 12px rgba(var(--ee-gold-rgb), 0.2) !important;
}

.lpb-preview-stats {
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  flex-wrap: wrap !important;
}

.lpb-char-count {
  font-family: var(--ee-font-code) !important;
  font-size: 0.75rem !important;
  color: var(--ee-text-muted) !important;
  padding: 0.25rem 0.625rem !important;
  background: rgba(0, 0, 0, 0.3) !important;
  border-radius: 0.375rem !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  white-space: nowrap !important;
}

/* Copy Button in Preview */
.lpb-preview-stats .lpb-btn-small {
  padding: 0.375rem 0.875rem !important;
  font-size: 0.75rem !important;
}

/* Preview Content - FIXED SCROLLING */
.lpb-preview-content {
  padding: 1rem 1.25rem !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
  color: var(--ee-text-secondary) !important;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  max-height: 300px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  background: rgba(0, 0, 0, 0.15) !important;
}

.lpb-preview-content::-webkit-scrollbar {
  width: 6px !important;
}

.lpb-preview-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2) !important;
  border-radius: 3px !important;
}

.lpb-preview-content::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 3px !important;
}

.lpb-preview-content::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--ee-primary-rgb), 0.45) !important;
}

/* ═══════════════════════════════════════════════════════════
   ACTION BUTTONS (Sticky Bottom)
   ═══════════════════════════════════════════════════════════ */

.lpb-actions {
  display: flex !important;
  gap: 0.75rem !important;
  justify-content: flex-end !important;
  padding-top: 1.25rem !important;
  margin-top: 0.5rem !important;
  border-top: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  background: transparent !important;
}

/* Back to Templates Button */
#lpb-back-to-templates {
  padding: 0.75rem 1.5rem !important;
  font-size: 0.875rem !important;
}

/* Insert Prompt Button */
#lpb-insert-btn {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border: 1px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  color: var(--ee-gold) !important;
  padding: 0.75rem 1.75rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

#lpb-insert-btn:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.45),
    rgba(var(--ee-primary-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(var(--ee-gold-rgb), 0.15) !important;
}

#lpb-insert-btn:active {
  transform: translateY(0) scale(0.98) !important;
}

/* Copy Button */
#lpb-copy-btn {
  background: rgba(var(--ee-primary-rgb), 0.15) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
  transition: all 0.25s ease !important;
}

#lpb-copy-btn:hover {
  background: rgba(var(--ee-gold-rgb), 0.2) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  color: var(--ee-gold) !important;
}

/* ═══════════════════════════════════════════════════════════
   FORM ANIMATIONS
   ═══════════════════════════════════════════════════════════ */

@keyframes lpb-field-enter {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Stagger animation for form fields */
.lpb-form-field:nth-child(1) { animation-delay: 0.05s !important; }
.lpb-form-field:nth-child(2) { animation-delay: 0.1s !important; }
.lpb-form-field:nth-child(3) { animation-delay: 0.15s !important; }
.lpb-form-field:nth-child(4) { animation-delay: 0.2s !important; }
.lpb-form-field:nth-child(5) { animation-delay: 0.25s !important; }
.lpb-form-field:nth-child(6) { animation-delay: 0.3s !important; }
.lpb-form-field:nth-child(n+7) { animation-delay: 0.35s !important; }

/* ═══════════════════════════════════════════════════════════
   FORM RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .lpb-body {
    max-height: calc(95vh - 70px) !important;
  }

  #lpb-form-content {
    padding: 1.25rem !important;
    gap: 1.25rem !important;
  }

  .lpb-preview-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.75rem !important;
  }

  .lpb-preview-stats {
    width: 100% !important;
    justify-content: space-between !important;
  }

  .lpb-actions {
    flex-direction: column-reverse !important;
    gap: 0.625rem !important;
  }

  .lpb-actions button {
    width: 100% !important;
    justify-content: center !important;
  }

  .lpb-preview-content {
    max-height: 250px !important;
  }
}

@media (max-width: 480px) {
  #lpb-form-content {
    padding: 1rem !important;
    gap: 1rem !important;
  }

  .lpb-form-field {
    gap: 0.5rem !important;
  }

  .lpb-radio-group {
    flex-direction: column !important;
    gap: 0.75rem !important;
    padding: 0.25rem 0 !important;
  }

  .lpb-preview-content {
    max-height: 200px !important;
    font-size: 0.8125rem !important;
    padding: 0.875rem 1rem !important;
  }

  .lpb-char-count {
    font-size: 0.6875rem !important;
    padding: 0.2rem 0.5rem !important;
  }

  .lpb-preview-header {
    padding: 0.875rem 1rem !important;
  }

  .lpb-label {
    font-size: 0.875rem !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   SCROLLBAR FOR MODAL BODY
   ═══════════════════════════════════════════════════════════ */

.lpb-body::-webkit-scrollbar {
  width: 8px !important;
}

.lpb-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2) !important;
}

.lpb-body::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 4px !important;
}

.lpb-body::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--ee-primary-rgb), 0.4) !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - Template Creator (Beginner & Advanced)
   ═══════════════════════════════════════════════════════════ */

/* Mode Toggle Tabs */
.lpb-mode-tab {
  flex: 1 !important;
  padding: 0.875rem 1.5rem !important;
  background: transparent !important;
  color: var(--ee-text-muted) !important;
  border: none !important;
  cursor: pointer !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  font-family: var(--ee-font-body) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
}

.lpb-mode-tab:hover {
  color: var(--ee-text-secondary) !important;
  background: rgba(var(--ee-primary-rgb), 0.05) !important;
}

/* Beginner Mode Active */
.lpb-mode-tab.active[data-mode="beginner"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.3),
    rgba(var(--ee-success), 0.2)) !important;
  color: var(--ee-success) !important;
  box-shadow: inset 0 -3px 0 var(--ee-success) !important;
}

/* Advanced Mode Active */
.lpb-mode-tab.active[data-mode="advanced"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.3),
    rgba(var(--ee-ember-rgb), 0.2)) !important;
  color: var(--ee-sunset) !important;
  box-shadow: inset 0 -3px 0 var(--ee-sunset) !important;
}

/* Mode Tabs Container */
.lpb-mode-tab:first-child:not(:last-child) {
  border-right: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
}

/* ═══════════════════════════════════════════════════════════
   BEGINNER MODE - Quick Start Guide
   ═══════════════════════════════════════════════════════════ */

/* Override green banner with golden */
#lpb-beginner-section > div[style*="background: linear-gradient(135deg, rgba(76, 175, 80"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.12),
    rgba(var(--ee-success), 0.06)) !important;
  border: 1px solid rgba(var(--ee-success), 0.3) !important;
  border-left: 3px solid rgba(var(--ee-success), 0.6) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
}

#lpb-beginner-section h4[style*="color: #4CAF50"] {
  color: var(--ee-success) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 0.9375rem !important;
  margin: 0 0 0.75rem 0 !important;
}

/* Step circles */
#lpb-beginner-section div[style*="background: #4CAF50"] {
  width: 32px !important;
  height: 32px !important;
  background: linear-gradient(135deg, var(--ee-success), rgba(var(--ee-success), 0.8)) !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 auto 0.5rem !important;
  font-weight: bold !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(var(--ee-success), 0.3) !important;
}

/* ═══════════════════════════════════════════════════════════
   ADVANCED MODE - Purple Banner Override
   ═══════════════════════════════════════════════════════════ */

#lpb-advanced-section > div[style*="background: linear-gradient(135deg, rgba(156, 39, 176"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.12),
    rgba(var(--ee-ember-rgb), 0.06)) !important;
  border: 1px solid rgba(var(--ee-sunset-rgb), 0.3) !important;
  border-left: 3px solid rgba(var(--ee-sunset-rgb), 0.6) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.5rem !important;
}

#lpb-advanced-section h4[style*="color: #9C27B0"] {
  color: var(--ee-sunset) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 0.9375rem !important;
  margin: 0 0 0.5rem 0 !important;
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE FIELDS - Beginner Mode
   ═══════════════════════════════════════════════════════════ */

.lpb-template-field {
  margin-bottom: 0.875rem !important;
  background: rgba(13, 13, 13, 0.8) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.75rem !important;
  padding: 1rem !important;
  transition: all 0.25s ease !important;
}

.lpb-template-field:hover {
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  background: rgba(13, 13, 13, 0.95) !important;
}

/* Beginner field header */
.lpb-template-field > div:first-child {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0.875rem !important;
  padding-bottom: 0.625rem !important;
  border-bottom: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
}

.lpb-template-field > div:first-child > span {
  color: var(--ee-success) !important;
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  font-family: var(--ee-font-heading) !important;
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE FIELDS - Advanced Mode
   ═══════════════════════════════════════════════════════════ */

.lpb-template-field-adv {
  margin-bottom: 0.875rem !important;
  background: rgba(13, 13, 13, 0.8) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.75rem !important;
  padding: 1rem !important;
  transition: all 0.25s ease !important;
}

.lpb-template-field-adv:hover {
  border-color: rgba(var(--ee-sunset-rgb), 0.3) !important;
  background: rgba(13, 13, 13, 0.95) !important;
}

/* Advanced field header */
.lpb-template-field-adv > div:first-child > span {
  color: var(--ee-sunset) !important;
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  font-family: var(--ee-font-heading) !important;
}

/* ═══════════════════════════════════════════════════════════
   CONDITIONAL LOGIC SECTION
   ═══════════════════════════════════════════════════════════ */

.field-conditional-container {
  background: linear-gradient(135deg,
    rgba(var(--ee-warning), 0.08),
    rgba(var(--ee-warning), 0.04)) !important;
  border-left: 3px solid var(--ee-warning) !important;
  padding: 0.75rem !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  margin-bottom: 0.75rem !important;
}

.field-conditional-container svg {
  stroke: var(--ee-warning) !important;
}

.field-conditional-container > div:first-child span {
  color: var(--ee-warning) !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
}

/* ═══════════════════════════════════════════════════════════
   FORM FIELD LABELS (Small uppercase)
   ═══════════════════════════════════════════════════════════ */

.lpb-template-field label[style*="text-transform: uppercase"],
.lpb-template-field-adv label[style*="text-transform: uppercase"] {
  display: block !important;
  color: var(--ee-text-muted) !important;
  font-size: 0.6875rem !important;
  margin-bottom: 0.375rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════
   FIELD TYPE SPECIFIC CONTAINERS
   ═══════════════════════════════════════════════════════════ */

.field-options-container,
.field-list-options,
.field-number-options {
  background: rgba(26, 26, 26, 0.6) !important;
  padding: 0.75rem !important;
  border-radius: 0.5rem !important;
  margin-bottom: 0.75rem !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.1) !important;
}

/* ═══════════════════════════════════════════════════════════
   VARIABLE REFERENCE LIST
   ═══════════════════════════════════════════════════════════ */

#lpb-variable-list,
#lpb-variable-list-adv {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.5rem !important;
  min-height: 40px !important;
  padding: 0.75rem !important;
  background: rgba(13, 13, 13, 0.8) !important;
  border-radius: 0.5rem !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
}

#lpb-variable-list > span,
#lpb-variable-list-adv > span {
  color: var(--ee-text-muted) !important;
  font-size: 0.8125rem !important;
}

/* Variable chips (when populated) */
#lpb-variable-list code,
#lpb-variable-list-adv code {
  background: rgba(var(--ee-primary-rgb), 0.12) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.375rem !important;
  font-family: var(--ee-font-code) !important;
  font-size: 0.75rem !important;
  color: var(--ee-gold) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

#lpb-variable-list code:hover,
#lpb-variable-list-adv code:hover {
  background: rgba(var(--ee-gold-rgb), 0.2) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  transform: translateY(-1px) !important;
}

/* ═══════════════════════════════════════════════════════════
   ADD FIELD BUTTONS
   ═══════════════════════════════════════════════════════════ */

/* Beginner Add Question (green) */
#lpb-add-field {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.3),
    rgba(var(--ee-success), 0.25)) !important;
  border: 1px solid rgba(var(--ee-success), 0.5) !important;
  color: var(--ee-success) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.25s ease !important;
}

#lpb-add-field:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.4),
    rgba(var(--ee-success), 0.35)) !important;
  border-color: rgba(var(--ee-success), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(var(--ee-success), 0.2) !important;
}

/* Advanced Add Field (purple -> sunset) */
#lpb-add-field-adv {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.3),
    rgba(var(--ee-ember-rgb), 0.25)) !important;
  border: 1px solid rgba(var(--ee-sunset-rgb), 0.5) !important;
  color: var(--ee-sunset) !important;
  padding: 0.5rem 1rem !important;
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.25s ease !important;
}

#lpb-add-field-adv:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.4),
    rgba(var(--ee-ember-rgb), 0.35)) !important;
  border-color: rgba(var(--ee-sunset-rgb), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(var(--ee-sunset-rgb), 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   REMOVE FIELD BUTTONS
   ═══════════════════════════════════════════════════════════ */

button[data-action="remove-field"] {
  background: transparent !important;
  color: var(--ee-danger) !important;
  border: 1px solid var(--ee-danger) !important;
  padding: 0.25rem 0.75rem !important;
  font-size: 0.6875rem !important;
  border-radius: 0.375rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

button[data-action="remove-field"]:hover {
  background: rgba(var(--ee-danger), 0.15) !important;
  border-color: rgba(var(--ee-danger), 0.8) !important;
  transform: scale(1.05) !important;
}

/* ═══════════════════════════════════════════════════════════
   TIP BOX (Orange)
   ═══════════════════════════════════════════════════════════ */

div[style*="background: rgba(255, 152, 0, 0.1)"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-warning), 0.1),
    rgba(var(--ee-warning), 0.05)) !important;
  border-left: 3px solid var(--ee-warning) !important;
  padding: 0.75rem 1rem !important;
  margin-bottom: 0.75rem !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
}

div[style*="background: rgba(255, 152, 0, 0.1)"] span:first-child {
  color: var(--ee-warning) !important;
  font-weight: 600 !important;
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE NAME/DESC INPUTS
   ═══════════════════════════════════════════════════════════ */

#lpb-template-name,
#lpb-template-desc,
#lpb-template-name-adv,
#lpb-template-desc-adv {
  background: rgba(30, 30, 30, 0.8) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.875rem !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  transition: all 0.25s ease !important;
}

#lpb-template-name:focus,
#lpb-template-desc:focus,
#lpb-template-name-adv:focus,
#lpb-template-desc-adv:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  background: rgba(30, 30, 30, 0.95) !important;
  box-shadow: 0 0 0 3px rgba(var(--ee-primary-rgb), 0.1) !important;
  outline: none !important;
}

/* ═══════════════════════════════════════════════════════════
   PROMPT TEMPLATE TEXTAREA
   ═══════════════════════════════════════════════════════════ */

#lpb-template-generate,
#lpb-template-generate-adv {
  min-height: 200px !important;
  font-family: var(--ee-font-code) !important;
  font-size: 0.8125rem !important;
  line-height: 1.6 !important;
  background: rgba(13, 13, 13, 0.9) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  padding: 1rem !important;
  border-radius: 0.5rem !important;
  color: var(--ee-text-primary) !important;
  transition: all 0.25s ease !important;
}

#lpb-template-generate:focus,
#lpb-template-generate-adv:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow: 0 0 0 3px rgba(var(--ee-primary-rgb), 0.1) !important;
  outline: none !important;
}

/* ═══════════════════════════════════════════════════════════
   GENERATE AI PROMPT BUTTON
   ═══════════════════════════════════════════════════════════ */

#lpb-generate-ai-prompt-adv {
  background: linear-gradient(135deg,
    rgba(var(--ee-orange-rgb), 0.3),
    rgba(var(--ee-sunset-rgb), 0.25)) !important;
  border: 1px solid rgba(var(--ee-orange-rgb), 0.5) !important;
  color: var(--ee-orange) !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border-radius: 0.375rem !important;
  transition: all 0.25s ease !important;
}

#lpb-generate-ai-prompt-adv:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-orange-rgb), 0.4),
    rgba(var(--ee-sunset-rgb), 0.35)) !important;
  border-color: rgba(var(--ee-orange-rgb), 0.7) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 10px rgba(var(--ee-orange-rgb), 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   SECTION CONTAINERS
   ═══════════════════════════════════════════════════════════ */

div[style*="background: #1a1a1a; border: 2px solid #333"] {
  background: rgba(26, 26, 26, 0.6) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.75rem !important;
  padding: 1.25rem !important;
  margin-bottom: 1.25rem !important;
}

/* Section headers (h4) */
div[style*="background: #1a1a1a"] h4[style*="color: #4CAF50"],
div[style*="background: #1a1a1a"] h4[style*="color: #9C27B0"] {
  font-family: var(--ee-font-heading) !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  margin: 0 !important;
}

/* Green headers for beginner */
h4[style*="color: #4CAF50"] {
  color: var(--ee-success) !important;
}

/* Purple headers for advanced */
h4[style*="color: #9C27B0"] {
  color: var(--ee-sunset) !important;
}

/* ═══════════════════════════════════════════════════════════
   NO FIELDS MESSAGE
   ═══════════════════════════════════════════════════════════ */

#lpb-no-fields-msg,
#lpb-no-fields-msg-adv {
  text-align: center !important;
  padding: 2rem !important;
  color: var(--ee-text-muted) !important;
  font-size: 0.8125rem !important;
  border: 2px dashed rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.5rem !important;
  background: rgba(0, 0, 0, 0.2) !important;
}

/* ═══════════════════════════════════════════════════════════
   CANCEL & CREATE TEMPLATE BUTTONS
   ═══════════════════════════════════════════════════════════ */

#lpb-template-cancel {
  padding: 0.75rem 1.5rem !important;
  font-size: 0.875rem !important;
}

#lpb-template-save {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.35),
    rgba(var(--ee-primary-rgb), 0.3)) !important;
  border: 1px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  color: var(--ee-gold) !important;
  padding: 0.75rem 2rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.25s ease !important;
}

#lpb-template-save:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.45),
    rgba(var(--ee-primary-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 0 16px rgba(var(--ee-gold-rgb), 0.15) !important;
}

/* ═══════════════════════════════════════════════════════════
   SELECT DROPDOWNS (Field Type, etc)
   ═══════════════════════════════════════════════════════════ */

.lpb-select,
select.field-type,
select.field-required,
select.field-show-when {
  background: rgba(26, 26, 26, 0.8) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  padding: 0.625rem 0.75rem !important;
  font-size: 0.8125rem !important;
  color: var(--ee-text-primary) !important;
  border-radius: 0.375rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
}

.lpb-select:focus,
select.field-type:focus,
select.field-required:focus,
select.field-show-when:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow: 0 0 0 3px rgba(var(--ee-primary-rgb), 0.1) !important;
  outline: none !important;
}

/* ═══════════════════════════════════════════════════════════
   FIELD INPUTS (Variable ID, Label, etc)
   ═══════════════════════════════════════════════════════════ */

.field-id,
.field-label,
.field-default,
.field-placeholder,
.field-options,
.field-help,
.field-show-when-value,
.field-list-placeholder,
.field-min,
.field-max,
.field-step {
  background: rgba(26, 26, 26, 0.8) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  padding: 0.625rem 0.75rem !important;
  font-size: 0.8125rem !important;
  color: var(--ee-text-primary) !important;
  border-radius: 0.375rem !important;
  transition: all 0.25s ease !important;
}

/* Monospace for variable IDs */
.field-id {
  font-family: var(--ee-font-code) !important;
}

.field-id:focus,
.field-label:focus,
.field-default:focus,
.field-placeholder:focus,
.field-options:focus,
.field-help:focus,
.field-show-when-value:focus,
.field-list-placeholder:focus,
.field-min:focus,
.field-max:focus,
.field-step:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow: 0 0 0 3px rgba(var(--ee-primary-rgb), 0.1) !important;
  outline: none !important;
}

/* ═══════════════════════════════════════════════════════════
   GRID LAYOUTS
   ═══════════════════════════════════════════════════════════ */

/* 4-column quick start guide */
div[style*="display: grid; grid-template-columns: repeat(4, 1fr)"] {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 1rem !important;
}

/* 2-column name/desc */
div[style*="grid-template-columns: 2fr 1fr"] {
  display: grid !important;
  grid-template-columns: 2fr 1fr !important;
  gap: 1rem !important;
  margin-bottom: 1.25rem !important;
}

/* 3-column field grids */
div[style*="grid-template-columns: 1fr 1fr 1fr"] {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  gap: 0.75rem !important;
  margin-bottom: 0.75rem !important;
}

/* Beginner 2-column (variable + question) */
div[style*="grid-template-columns: 140px 1fr"] {
  display: grid !important;
  grid-template-columns: 140px 1fr !important;
  gap: 0.75rem !important;
  margin-bottom: 0.75rem !important;
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  div[style*="display: grid; grid-template-columns: repeat(4, 1fr)"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  div[style*="grid-template-columns: 2fr 1fr"],
  div[style*="grid-template-columns: 1fr 1fr 1fr"],
  div[style*="grid-template-columns: 140px 1fr"] {
    grid-template-columns: 1fr !important;
  }

  .lpb-template-field,
  .lpb-template-field-adv {
    padding: 0.875rem !important;
  }
}

@media (max-width: 480px) {
  div[style*="display: grid; grid-template-columns: repeat(4, 1fr)"] {
    grid-template-columns: 1fr !important;
  }

  .lpb-mode-tab {
    padding: 0.625rem 1rem !important;
    font-size: 0.75rem !important;
  }

  #lpb-template-save {
    width: 100% !important;
  }
}

/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - AI Prompt Generator Modal
   ═══════════════════════════════════════════════════════════ */

/* Modal Content Container */
.lpb-edit-modal-content {
  max-width: 900px !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  padding: 1.5rem !important;
  background: linear-gradient(165deg,
    rgba(20, 16, 8, 0.97) 0%,
    rgba(26, 20, 12, 0.95) 50%,
    rgba(18, 14, 8, 0.97) 100%) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-top: 3px solid rgba(var(--ee-gold-rgb), 0.5) !important;
  border-radius: 1rem !important;
  backdrop-filter: blur(24px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(24px) saturate(1.5) !important;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.65),
    0 10px 40px rgba(0, 0, 0, 0.45),
    0 0 60px rgba(var(--ee-gold-rgb), 0.06),
    inset 0 1px 0 rgba(var(--ee-gold-rgb), 0.1) !important;
}

/* Main Heading */
.lpb-edit-modal-content > h3 {
  color: var(--ee-orange) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
  text-shadow: 0 0 16px rgba(var(--ee-orange-rgb), 0.3) !important;
}

/* ═══════════════════════════════════════════════════════════
   INFO BANNERS
   ═══════════════════════════════════════════════════════════ */

/* How to Use Banner (Orange) */
.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(255, 107, 53"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-orange-rgb), 0.12),
    rgba(var(--ee-sunset-rgb), 0.06)) !important;
  border-left: 3px solid var(--ee-orange) !important;
  padding: 1rem !important;
  border-radius: 0 0.75rem 0.75rem 0 !important;
  margin-bottom: 1.25rem !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
}

.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(255, 107, 53"] h4 {
  margin: 0 0 0.5rem 0 !important;
  color: var(--ee-orange) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
}

.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(255, 107, 53"] ol {
  margin: 0 !important;
  padding-left: 1.25rem !important;
  color: var(--ee-text-secondary) !important;
  font-size: 0.8125rem !important;
  line-height: 1.8 !important;
}

/* Capabilities Banner (Green -> Success) */
.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(76, 175, 80"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.12),
    rgba(var(--ee-success), 0.06)) !important;
  border-left: 3px solid var(--ee-success) !important;
  padding: 1rem !important;
  border-radius: 0 0.75rem 0.75rem 0 !important;
  margin-bottom: 1.25rem !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
}

.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(76, 175, 80"] h4 {
  margin: 0 0 0.5rem 0 !important;
  color: var(--ee-success) !important;
  font-family: var(--ee-font-heading) !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
}

.lpb-edit-modal-content > div[style*="background: linear-gradient(135deg, rgba(76, 175, 80"] ul {
  margin: 0 !important;
  padding-left: 1.25rem !important;
  color: var(--ee-success) !important;
  font-size: 0.8125rem !important;
  line-height: 1.8 !important;
}

/* Pro Tips Banner (Blue -> Gold) */
.lpb-edit-modal-content > div[style*="background: rgba(33, 150, 243, 0.1)"] {
  background: linear-gradient(135deg,
    rgba(var(--ee-gold-rgb), 0.12),
    rgba(var(--ee-primary-rgb), 0.06)) !important;
  border-left: 3px solid var(--ee-gold) !important;
  padding: 0.75rem !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  margin-bottom: 1.25rem !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important;
}

.lpb-edit-modal-content > div[style*="background: rgba(33, 150, 243, 0.1)"] > div:first-child {
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  margin-bottom: 0.375rem !important;
}

.lpb-edit-modal-content > div[style*="background: rgba(33, 150, 243, 0.1)"] ul {
  margin: 0 !important;
  padding-left: 1.25rem !important;
  color: var(--ee-text-secondary) !important;
  font-size: 0.75rem !important;
  line-height: 1.6 !important;
}

/* ═══════════════════════════════════════════════════════════
   AI PROMPT TEXTAREA
   ═══════════════════════════════════════════════════════════ */

/* Label and Copy Button Container */
.lpb-edit-modal-content > div > div[style*="display: flex; justify-content: space-between"] {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0.5rem !important;
}

.lpb-edit-modal-content > div > div[style*="display: flex; justify-content: space-between"] label {
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  font-family: var(--ee-font-heading) !important;
}

/* Copy Prompt Button (Green -> Success) */
#lpb-copy-ai-prompt {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.3),
    rgba(var(--ee-success), 0.25)) !important;
  border: 1px solid rgba(var(--ee-success), 0.5) !important;
  color: var(--ee-success) !important;
  padding: 0.375rem 0.875rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border-radius: 0.375rem !important;
  transition: all 0.25s ease !important;
}

#lpb-copy-ai-prompt:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-success), 0.4),
    rgba(var(--ee-success), 0.35)) !important;
  border-color: rgba(var(--ee-success), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(var(--ee-success), 0.2) !important;
}

/* AI Prompt Textarea (Green terminal style) */
#lpb-ai-prompt-text {
  font-family: var(--ee-font-code) !important;
  font-size: 0.75rem !important;
  min-height: 300px !important;
  max-height: 400px !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: #0f0 !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.25) !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  line-height: 1.6 !important;
  resize: vertical !important;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5) !important;
}

#lpb-ai-prompt-text:focus {
  border-color: rgba(var(--ee-success), 0.5) !important;
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.5),
    0 0 0 3px rgba(var(--ee-success), 0.1) !important;
  outline: none !important;
}

/* ═══════════════════════════════════════════════════════════
   EXAMPLE OUTPUT DETAILS
   ═══════════════════════════════════════════════════════════ */

.lpb-edit-modal-content details {
  background: rgba(26, 26, 26, 0.6) !important;
  border: 2px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem !important;
  margin-bottom: 1.25rem !important;
  transition: all 0.25s ease !important;
}

.lpb-edit-modal-content details:hover {
  border-color: rgba(var(--ee-primary-rgb), 0.3) !important;
  background: rgba(26, 26, 26, 0.8) !important;
}

.lpb-edit-modal-content details summary {
  cursor: pointer !important;
  color: var(--ee-gold) !important;
  font-weight: 600 !important;
  font-size: 0.8125rem !important;
  font-family: var(--ee-font-body) !important;
  user-select: none !important;
  transition: color 0.2s ease !important;
  list-style: none !important;
}

.lpb-edit-modal-content details summary::-webkit-details-marker {
  display: none !important;
}

.lpb-edit-modal-content details summary::before {
  content: "▶" !important;
  display: inline-block !important;
  margin-right: 0.5rem !important;
  transition: transform 0.2s ease !important;
  font-size: 0.625rem !important;
}

.lpb-edit-modal-content details[open] summary::before {
  transform: rotate(90deg) !important;
}

.lpb-edit-modal-content details summary:hover {
  color: var(--ee-primary) !important;
}

/* Example code block */
.lpb-edit-modal-content details > div {
  margin-top: 0.75rem !important;
  padding: 0.75rem !important;
  background: rgba(13, 13, 13, 0.9) !important;
  border-radius: 0.5rem !important;
  font-family: var(--ee-font-code) !important;
  font-size: 0.6875rem !important;
  color: var(--ee-text-muted) !important;
  overflow-x: auto !important;
  white-space: pre-wrap !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.12) !important;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4) !important;
}

/* ═══════════════════════════════════════════════════════════
   ACTION BUTTONS
   ═══════════════════════════════════════════════════════════ */

.lpb-edit-actions {
  display: flex !important;
  gap: 0.75rem !important;
  justify-content: flex-end !important;
  padding-top: 1.25rem !important;
  margin-top: 1.25rem !important;
  border-top: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
}

/* Close Button */
#lpb-ai-prompt-close {
  padding: 0.75rem 1.5rem !important;
  font-size: 0.875rem !important;
}

/* Paste Code Button (Purple -> Sunset) */
#lpb-paste-to-template {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.35),
    rgba(var(--ee-ember-rgb), 0.3)) !important;
  border: 1px solid rgba(var(--ee-sunset-rgb), 0.5) !important;
  color: var(--ee-sunset) !important;
  padding: 0.75rem 1.75rem !important;
  font-size: 0.875rem !important;
  font-weight: 600 !important;
  border-radius: 0.5rem !important;
  transition: all 0.25s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

#lpb-paste-to-template:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-sunset-rgb), 0.45),
    rgba(var(--ee-ember-rgb), 0.4)) !important;
  border-color: rgba(var(--ee-sunset-rgb), 0.7) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(var(--ee-sunset-rgb), 0.15) !important;
}

#lpb-paste-to-template:active {
  transform: translateY(0) scale(0.98) !important;
}

/* ═══════════════════════════════════════════════════════════
   MODAL SCROLLBAR
   ═══════════════════════════════════════════════════════════ */

.lpb-edit-modal-content::-webkit-scrollbar {
  width: 8px !important;
}

.lpb-edit-modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2) !important;
}

.lpb-edit-modal-content::-webkit-scrollbar-thumb {
  background: rgba(var(--ee-primary-rgb), 0.3) !important;
  border-radius: 4px !important;
}

.lpb-edit-modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--ee-primary-rgb), 0.45) !important;
}

/* ═══════════════════════════════════════════════════════════
   ENTRY ANIMATION
   ═══════════════════════════════════════════════════════════ */

.lpb-edit-modal-content {
  animation: lpb-ai-modal-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@keyframes lpb-ai-modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .lpb-edit-modal-content {
    max-width: 95vw !important;
    padding: 1.25rem !important;
  }

  .lpb-edit-modal-content > h3 {
    font-size: 1.125rem !important;
  }

  #lpb-ai-prompt-text {
    min-height: 250px !important;
    font-size: 0.6875rem !important;
  }

  .lpb-edit-actions {
    flex-direction: column-reverse !important;
  }

  .lpb-edit-actions button {
    width: 100% !important;
    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  .lpb-edit-modal-content {
    padding: 1rem !important;
  }

  .lpb-edit-modal-content > div[style*="display: flex; justify-content: space-between"] {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 0.5rem !important;
  }

  #lpb-copy-ai-prompt {
    width: 100% !important;
    justify-content: center !important;
  }

  .lpb-edit-modal-content details summary {
    font-size: 0.75rem !important;
  }
}
/* ═══════════════════════════════════════════════════════════
   PROMPT BUILDER - List Field Wrapper
   ═══════════════════════════════════════════════════════════ */

.lpb-list-wrapper {
  background: rgba(26, 26, 26, 0.6) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.15) !important;
  border-radius: 0.5rem !important;
  padding: 0.75rem !important;
  margin-bottom: 0.75rem !important;
}

/* Individual List Row */
.lpb-list-row {
  display: flex !important;
  gap: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  align-items: center !important;
}

.lpb-list-row:last-of-type {
  margin-bottom: 0.75rem !important;
}

/* List Input Field */
.lpb-list-input {
  flex: 1 !important;
  background: rgba(13, 10, 8, 0.7) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.2) !important;
  border-radius: 0.375rem !important;
  padding: 0.625rem 0.75rem !important;
  color: var(--ee-text-primary) !important;
  font-family: var(--ee-font-body) !important;
  font-size: 0.8125rem !important;
  transition: all 0.25s ease !important;
}

.lpb-list-input:focus {
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  box-shadow:
    0 0 0 3px rgba(var(--ee-primary-rgb), 0.1),
    0 0 16px rgba(var(--ee-gold-rgb), 0.1) !important;
  outline: none !important;
}

.lpb-list-input::placeholder {
  color: var(--ee-text-muted) !important;
  opacity: 0.6 !important;
}

/* Remove Button */
.lpb-list-remove {
  background: rgba(var(--ee-danger), 0.1) !important;
  border: 1px solid rgba(var(--ee-danger), 0.25) !important;
  color: var(--ee-danger) !important;
  padding: 0.5rem 0.875rem !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  border-radius: 0.375rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}

.lpb-list-remove:hover {
  background: rgba(var(--ee-danger), 0.2) !important;
  border-color: rgba(var(--ee-danger), 0.45) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(var(--ee-danger), 0.15) !important;
}

.lpb-list-remove:active {
  transform: translateY(0) scale(0.97) !important;
}

/* Add Item Button */
.lpb-list-add {
  width: 100% !important;
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.15),
    rgba(var(--ee-orange-rgb), 0.12)) !important;
  border: 1px solid rgba(var(--ee-primary-rgb), 0.3) !important;
  color: var(--ee-text-primary) !important;
  padding: 0.625rem 1rem !important;
  font-size: 0.8125rem !important;
  font-weight: 500 !important;
  border-radius: 0.375rem !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  font-family: var(--ee-font-body) !important;
}

.lpb-list-add:hover {
  background: linear-gradient(135deg,
    rgba(var(--ee-primary-rgb), 0.25),
    rgba(var(--ee-orange-rgb), 0.22)) !important;
  border-color: rgba(var(--ee-gold-rgb), 0.5) !important;
  transform: translateY(-2px) !important;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 12px rgba(var(--ee-gold-rgb), 0.1) !important;
}

.lpb-list-add:active {
  transform: translateY(0) scale(0.98) !important;
}

/* ═══════════════════════════════════════════════════════════
   LIST FIELD - RESPONSIVE
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 480px) {
  .lpb-list-row {
    flex-direction: column !important;
    gap: 0.375rem !important;
  }

  .lpb-list-input,
  .lpb-list-remove {
    width: 100% !important;
  }

  .lpb-list-remove {
    padding: 0.5rem !important;
    text-align: center !important;
  }
}
/* ═══════════════════════════════════════════════════════════
   END OF AI PROMPT GENERATOR STYLES
   ═══════════════════════════════════════════════════════════ */`
    },
];
 console.log('[CSS Injector] Line 4: FEATURED_THEMES defined, count:', FEATURED_THEMES.length);

        console.log('[CSS Injector] Line 5: Defining state object...');
    const state = {
        currentStyle: null,
        initialized: false,
        isDirty: false,
        lastSavedContent: '',
        searchQuery: '',
        cache: {
            overlay: null,
            promptOverlay: null,
            editor: null,
            styleList: null,
            searchInput: null
        }
    };

    const resources = {
        intervals: new Set(),
        timeouts: new Set(),
        observers: new Set(),
        listeners: []
    };

    function debounce(fn, delay = DEBOUNCE_DELAY) {
        let timeoutId = null;
        return function(...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                resources.timeouts.delete(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn.apply(this, args);
                resources.timeouts.delete(timeoutId);
                timeoutId = null;
            }, delay);
            resources.timeouts.add(timeoutId);
        };
    }

    function addManagedInterval(callback, delay) {
        const id = setInterval(callback, delay);
        resources.intervals.add(id);
        return id;
    }

    function clearManagedInterval(id) {
        clearInterval(id);
        resources.intervals.delete(id);
    }

    function addManagedTimeout(callback, delay) {
        const id = setTimeout(() => {
            callback();
            resources.timeouts.delete(id);
        }, delay);
        resources.timeouts.add(id);
        return id;
    }

    function clearManagedTimeout(id) {
        clearTimeout(id);
        resources.timeouts.delete(id);
    }

    function addManagedListener(element, event, handler, options = false) {
        if (!element) return;
        element.addEventListener(event, handler, options);
        resources.listeners.push({ element, event, handler, options });
    }

    function addManagedObserver(target, callback, options) {
        const observer = new MutationObserver(callback);
        observer.observe(target, options);
        resources.observers.add(observer);
        return observer;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }

    function cleanup() {
        resources.intervals.forEach(clearInterval);
        resources.intervals.clear();
        resources.timeouts.forEach(clearTimeout);
        resources.timeouts.clear();
        resources.observers.forEach(observer => observer.disconnect());
        resources.observers.clear();
        resources.listeners.forEach(({ element, event, handler, options }) => {
            if (element?.removeEventListener) {
                element.removeEventListener(event, handler, options);
            }
        });
        resources.listeners.length = 0;

        ['#css-injector-overlay', '#css-prompt-overlay', '#css-injector-base',
         '#lemonade-user-css', '#css-injector-btn', '.css-toast'].forEach(sel => {
            $(sel)?.remove();
        });

        state.initialized = false;
    }

    function getStyles() {
        try {
            const styles = GM_getValue(STORAGE_KEY, null);
            return styles ? JSON.parse(styles) : {};
        } catch (e) {
            console.error('[CSS Injector] Error reading styles:', e);
            return {};
        }
    }

    function saveStyles(styles) {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(styles));
        } catch (e) {
            console.error('[CSS Injector] Error saving styles:', e);
            toast('Error saving styles', 'error');
        }
    }

    function getActiveStyle() {
        return GM_getValue(ACTIVE_STYLE_KEY, '');
    }

    function setActiveStyle(name) {
        GM_setValue(ACTIVE_STYLE_KEY, name);
    }

    function isOriginalThemeActive() {
        return GM_getValue(ORIGINAL_THEME_KEY, false);
    }

    function setOriginalThemeActive(active) {
        GM_setValue(ORIGINAL_THEME_KEY, active);
    }

    function getFavorites() {
        try {
            const favs = GM_getValue(FAVORITES_KEY, null);
            return favs ? JSON.parse(favs) : [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        GM_setValue(FAVORITES_KEY, JSON.stringify(favorites));
    }

    function getRandomFavoritesEnabled() {
        return GM_getValue(RANDOM_FAVORITES_KEY, false);
    }

    function setRandomFavoritesEnabled(enabled) {
        GM_setValue(RANDOM_FAVORITES_KEY, enabled);
    }

    function toggleRandomFavorites() {
        const newState = !getRandomFavoritesEnabled();
        setRandomFavoritesEnabled(newState);
        updateRandomFavoritesButton();
        toast(newState ? 'Random favorites enabled' : 'Random favorites disabled');
    }

    function updateRandomFavoritesButton() {
        const btn = $('[data-action="toggle-random"]');
        if (!btn) return;

        const enabled = getRandomFavoritesEnabled();
        btn.classList.toggle('css-btn-active', enabled);
        btn.title = enabled ? 'Random favorites: ON (click to disable)' : 'Random favorites: OFF (click to enable)';
    }

    function applyRandomFavorite() {
        const favorites = getFavorites();
        const styles = getStyles();
        const validFavorites = favorites.filter(name => styles[name]);

        if (validFavorites.length === 0) return false;

        const randomIndex = Math.floor(Math.random() * validFavorites.length);
        const randomStyle = validFavorites[randomIndex];

        setActiveStyle(randomStyle);
        setOriginalThemeActive(false);
        injectCSS(styles[randomStyle]);

        return true;
    }

    function restoreOriginalTheme() {
        setActiveStyle('');
        setOriginalThemeActive(true);
        injectCSS('');
        state.currentStyle = null;
        updateHeaderButton();
        refreshUI();
        toast('Original theme restored (Ctrl+Shift+H)');
    }

    function updateHeaderButton() {
        const btn = $('#css-injector-btn');
        if (!btn) return;

        const isOriginal = isOriginalThemeActive();
        const active = getActiveStyle();
        const isFeatured = active?.startsWith('__featured__');

        if (isOriginal) {
            btn.classList.remove('border-purple-700/50', 'bg-purple-600', 'hover:bg-purple-700');
            btn.classList.add('border-green-700/50', 'bg-green-600', 'hover:bg-green-700');
        } else if (active) {
            btn.classList.remove('border-green-700/50', 'bg-green-600', 'hover:bg-green-700');
            if (isFeatured) {
                btn.classList.remove('border-purple-700/50', 'bg-purple-600', 'hover:bg-purple-700');
                btn.classList.add('border-pink-700/50', 'bg-pink-600', 'hover:bg-pink-700');
            } else {
                btn.classList.remove('border-pink-700/50', 'bg-pink-600', 'hover:bg-pink-700');
                btn.classList.add('border-purple-700/50', 'bg-purple-600', 'hover:bg-purple-700');
            }
        } else {
            btn.classList.remove('border-green-700/50', 'bg-green-600', 'hover:bg-green-700');
            btn.classList.remove('border-pink-700/50', 'bg-pink-600', 'hover:bg-pink-700');
            btn.classList.add('border-purple-700/50', 'bg-purple-600', 'hover:bg-purple-700');
        }
    }

    function toggleFavorite(name) {
        const favorites = getFavorites();
        const index = favorites.indexOf(name);
        if (index === -1) {
            favorites.push(name);
        } else {
            favorites.splice(index, 1);
        }
        saveFavorites(favorites);
        refreshUI();
    }

    function isFavorite(name) {
        return getFavorites().includes(name);
    }

    let autoSaveTimeoutId = null;

    function getFeaturedTheme(name) {
    return FEATURED_THEMES.find(t => t.name === name);
}

function isFeaturedTheme(name) {
    return FEATURED_THEMES.some(t => t.name === name);
}

function copyFeaturedToMyStyles(featuredName) {
    const theme = getFeaturedTheme(featuredName);
    if (!theme) return;

    const styles = getStyles();
    let newName = theme.name;
    let counter = 1;
    while (styles[newName]) {
        newName = `${theme.name} (${counter})`;
        counter++;
    }

    styles[newName] = theme.css;
    saveStyles(styles);
    state.currentStyle = newName;
    state.lastSavedContent = theme.css;
    setDirty(false);
    setOriginalThemeActive(false);
    refreshUI();
    toast(`Copied "${theme.name}" to your styles`);
}

function applyFeaturedTheme(name) {
    const theme = getFeaturedTheme(name);
    if (!theme) return;

    setActiveStyle(`__featured__${name}`);
    setOriginalThemeActive(false);
    injectCSS(theme.css);
    updateHeaderButton();
    refreshUI();
    toast(`Applied "${theme.name}"`);
}

    function setDirty(dirty) {
        state.isDirty = dirty;
        updateDirtyIndicator();

        if (dirty && state.currentStyle) {
            if (autoSaveTimeoutId) {
                clearManagedTimeout(autoSaveTimeoutId);
            }
            autoSaveTimeoutId = addManagedTimeout(() => {
                if (state.isDirty && state.currentStyle) {
                    saveCurrentStyle(true);
                }
                autoSaveTimeoutId = null;
            }, AUTO_SAVE_DELAY);
        }
    }

    function updateDirtyIndicator() {
        const indicator = $('#css-dirty-indicator');
        const saveBtn = $('[data-action="save"]');

        if (indicator) {
            indicator.style.display = state.isDirty ? 'flex' : 'none';
        }
        if (saveBtn) {
            saveBtn.textContent = state.isDirty ? 'Save*' : 'Save';
        }
    }

    function checkDirty() {
        if (!state.currentStyle || !state.cache.editor) return;
        const currentContent = state.cache.editor.value;
        setDirty(currentContent !== state.lastSavedContent);
    }

    const debouncedCheckDirty = debounce(checkDirty, 100);

    function injectCSS(css) {
        let styleEl = $('#lemonade-user-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'lemonade-user-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css || '';
    }

    function injectBaseStyles() {
        if ($('#css-injector-base')) return;
        const style = document.createElement('style');
        style.id = 'css-injector-base';
        style.textContent = getBaseStyles();
        document.head.appendChild(style);
    }
function updateLineCount() {
    const lineCount = $('#css-line-count');
    if (!lineCount || !state.cache.editor) return;

    const lines = state.cache.editor.value.split('\n').length;
    lineCount.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
        ${lines} line${lines !== 1 ? 's' : ''}
    `;
}

const debouncedUpdateLineCount = debounce(updateLineCount, 100);
    function getBaseStyles() {
        return `
            #css-injector-overlay,
            #css-prompt-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                z-index: 99999;
                justify-content: center;
                align-items: center;
            }
#css-injector-modal .editor-wrapper {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
}

#css-injector-modal .line-numbers {
    padding: 16px 8px 16px 16px;
    background: rgba(0,0,0,0.2);
    border-right: 1px solid rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.3);
    font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    text-align: right;
    user-select: none;
    overflow: hidden;
    min-width: 45px;
}

#css-injector-modal .line-numbers span {
    display: block;
}

#css-injector-modal textarea {
    flex: 1;
    width: 100%;
    resize: none;
    font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    tab-size: 2;
    border-radius: 0 10px 10px 0;
    border: 1px solid var(--border-color, rgba(255,255,255,0.1));
    border-left: none;
    background: rgba(0,0,0,0.35);
    padding: 16px;
    color: inherit;
    outline: none;
}
            #css-injector-overlay.open,
            #css-prompt-overlay.open {
                display: flex;
            }

            #css-injector-modal {
                width: 95%;
                max-width: 1000px;
                height: 85vh;
                max-height: 800px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: cssModalIn 0.2s ease;
            }

            #css-prompt-modal {
                width: 95%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: cssModalIn 0.2s ease;
            }

            @keyframes cssModalIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            #css-injector-modal .modal-content {
                flex: 1;
                overflow: hidden;
                display: flex;
                min-height: 0;
            }

            #css-injector-modal .sidebar {
                width: 280px;
                border-right: 1px solid var(--border-color, rgba(255,255,255,0.1));
                display: flex;
                flex-direction: column;
                background: rgba(0,0,0,0.25);
            }

            #css-injector-modal .sidebar-header {
                padding: 12px;
                border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            #css-injector-modal .search-input {
                width: 100%;
                height: 36px;
                padding: 0 12px 0 36px;
                font-size: 13px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(0,0,0,0.3);
                color: inherit;
                outline: none;
                transition: all 0.15s ease;
            }

            #css-injector-modal .search-input:focus {
                border-color: rgba(147, 51, 234, 0.5);
                box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
            }

            #css-injector-modal .search-wrapper {
                position: relative;
            }

            #css-injector-modal .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                opacity: 0.5;
                pointer-events: none;
            }

            #css-injector-modal .search-clear {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                border: none;
                background: rgba(255,255,255,0.1);
                border-radius: 50%;
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 0;
                color: inherit;
                opacity: 0.7;
            }

            #css-injector-modal .search-clear:hover {
                opacity: 1;
                background: rgba(255,255,255,0.2);
            }

            #css-injector-modal .search-clear.visible {
                display: flex;
            }

            #css-injector-modal .sidebar-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            #css-injector-modal .style-item {
                width: 100%;
                padding: 10px 12px;
                border-radius: 10px;
                text-align: left;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
                background: transparent;
                border: 1px solid transparent;
                color: inherit;
                transition: all 0.15s ease;
                user-select: none;
                -webkit-user-select: none;
            }

            #css-injector-modal .style-item:hover {
                background: rgba(255,255,255,0.05);
            }

            #css-injector-modal .style-item.selected {
                background: rgba(255,255,255,0.1);
                border-color: rgba(255,255,255,0.15);
            }

            #css-injector-modal .style-item.active {
                background: rgba(34, 197, 94, 0.15);
                border-color: rgba(34, 197, 94, 0.3);
            }

#css-injector-modal .style-item.original-theme-item {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.1);
}

#css-injector-modal .style-item.original-theme-item:hover {
    background: rgba(255,255,255,0.05);
}


#css-injector-modal .style-item.original-theme-item.active {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
    border-color: rgba(34, 197, 94, 0.4);
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.2);
}

            #css-injector-modal .style-item .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
            }
#css-injector-modal .line-count {
    font-size: 11px;
    opacity: 0.5;
    display: flex;
    align-items: center;
    gap: 4px;
}
            #css-injector-modal .style-item .favorite-btn {
                width: 24px;
                height: 24px;
                border: none;
                background: transparent;
                cursor: pointer;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.3;
                transition: all 0.15s ease;
                flex-shrink: 0;
                color: inherit;
            }

            #css-injector-modal .style-item:hover .favorite-btn {
                opacity: 0.6;
            }

            #css-injector-modal .style-item .favorite-btn:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            #css-injector-modal .style-item .favorite-btn.is-favorite {
                opacity: 1;
                color: #fbbf24;
            }

            #css-injector-modal .style-item .active-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #22c55e;
                flex-shrink: 0;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
            }

            #css-injector-modal .style-item .original-icon {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: #22c55e;
            }

            #css-injector-modal .section-label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.5;
                padding: 8px 12px 4px;
                font-weight: 600;
            }

            #css-injector-modal .no-results {
                padding: 20px;
                text-align: center;
                opacity: 0.5;
                font-size: 13px;
            }

            #css-injector-modal .editor-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
            }

            #css-injector-modal .editor-header {
                padding: 14px 18px;
                border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            #css-injector-modal .editor-title {
                font-weight: 600;
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #css-injector-modal .editor-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            #css-injector-modal .editor-body {
                flex: 1;
                padding: 18px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            #css-injector-modal textarea,
            #css-prompt-modal textarea {
                flex: 1;
                width: 100%;
                resize: none;
                font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
                font-size: 13px;
                line-height: 1.6;
                tab-size: 2;
                border-radius: 10px;
                border: 1px solid var(--border-color, rgba(255,255,255,0.1));
                background: rgba(0,0,0,0.35);
                padding: 16px;
                color: inherit;
                outline: none;
            }

            #css-injector-modal textarea:focus,
            #css-prompt-modal textarea:focus,
            #css-prompt-modal input:focus,
            #css-prompt-modal select:focus {
                border-color: rgba(147, 51, 234, 0.5);
                box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
            }

            #css-injector-modal .editor-footer {
                padding: 14px 18px;
                border-top: 1px solid var(--border-color, rgba(255,255,255,0.1));
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            #css-injector-modal .footer-left {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            #css-injector-modal .footer-right {
                display: flex;
                gap: 8px;
            }

            #css-injector-modal .shortcut-hint {
                font-size: 11px;
                opacity: 0.5;
            }

            #css-injector-modal .dirty-indicator {
                display: none;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #fbbf24;
            }

            #css-injector-modal .dirty-indicator .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #fbbf24;
                animation: pulse 1.5s ease infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            #css-injector-modal .shortcuts-btn {
                opacity: 0.5;
                cursor: pointer;
                transition: opacity 0.15s;
            }

            #css-injector-modal .shortcuts-btn:hover {
                opacity: 1;
            }

            #css-injector-modal .shortcuts-popup {
                position: absolute;
                bottom: 100%;
                left: 0;
                margin-bottom: 8px;
                background: rgba(0,0,0,0.95);
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 10px;
                padding: 12px 16px;
                font-size: 12px;
                min-width: 220px;
                display: none;
                z-index: 10;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }

            #css-injector-modal .shortcuts-popup.show {
                display: block;
            }

            #css-injector-modal .shortcuts-popup h4 {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.6;
                margin: 0 0 10px;
                font-weight: 600;
            }

            #css-injector-modal .shortcut-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
            }

            #css-injector-modal .shortcut-key {
                background: rgba(255,255,255,0.1);
                padding: 2px 8px;
                border-radius: 4px;
                font-family: 'SF Mono', monospace;
                font-size: 11px;
            }

            .css-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 0 14px;
                height: 36px;
                font-size: 13px;
                font-weight: 500;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.15s ease;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(255,255,255,0.05);
                color: inherit;
            }

            .css-btn:hover {
                background: rgba(255,255,255,0.1);
            }

            .css-btn-sm {
                height: 32px;
                padding: 0 12px;
                font-size: 12px;
            }

            .css-btn-icon {
                width: 36px;
                padding: 0;
            }

            .css-btn-icon.css-btn-sm {
                width: 32px;
            }

            .css-btn-primary {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                border-color: rgba(34, 197, 94, 0.5);
                color: white;
            }

            .css-btn-primary:hover {
                background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            }

            .css-btn-purple {
                background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
                border-color: rgba(147, 51, 234, 0.5);
                color: white;
            }

            .css-btn-purple:hover {
                background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
            }

            .css-btn-green {
                background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
                border-color: rgba(34, 197, 94, 0.5);
                color: white;
            }

            .css-btn-green:hover {
                background: linear-gradient(135deg, #16a34a 0%, #059669 100%);
            }

            .css-btn-danger {
                border-color: rgba(239, 68, 68, 0.4);
                color: #f87171;
            }

            .css-btn-danger:hover {
                background: rgba(239, 68, 68, 0.15);
            }

            .css-btn-active {
                background: rgba(251, 191, 36, 0.2);
                border-color: rgba(251, 191, 36, 0.5);
                color: #fbbf24;
            }

            .css-btn-active:hover {
                background: rgba(251, 191, 36, 0.3);
            }

            .css-btn-active-green {
                background: rgba(34, 197, 94, 0.2);
                border-color: rgba(34, 197, 94, 0.5);
                color: #22c55e;
            }

            .css-btn-active-green:hover {
                background: rgba(34, 197, 94, 0.3);
            }

            #css-injector-modal .empty-state {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                opacity: 0.6;
                padding: 40px;
                text-align: center;
            }

            #css-injector-modal .empty-state-title {
                font-weight: 600;
                font-size: 16px;
            }

            #css-injector-modal .empty-state-desc {
                font-size: 14px;
                max-width: 280px;
                line-height: 1.5;
            }

            #css-injector-modal .original-theme-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                padding: 40px;
                text-align: center;
            }

            #css-injector-modal .original-theme-info .icon {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #22c55e;
            }

            #css-injector-modal .original-theme-info .title {
                font-weight: 600;
                font-size: 18px;
                color: #22c55e;
            }

            #css-injector-modal .original-theme-info .desc {
                font-size: 14px;
                opacity: 0.7;
                max-width: 320px;
                line-height: 1.5;
            }

            #css-injector-modal .original-theme-info .shortcut {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 12px;
                margin-top: 8px;
            }

            #css-injector-modal .original-theme-info .shortcut kbd {
                background: rgba(255,255,255,0.1);
                padding: 2px 8px;
                border-radius: 4px;
                font-family: 'SF Mono', monospace;
            }

            #css-prompt-modal .prompt-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            #css-prompt-modal .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            #css-prompt-modal .form-label {
                font-size: 13px;
                font-weight: 500;
                opacity: 0.9;
            }

            #css-prompt-modal .form-hint {
                font-size: 11px;
                opacity: 0.5;
                margin-top: 4px;
            }

            #css-prompt-modal input,
            #css-prompt-modal select {
                height: 40px;
                padding: 0 12px;
                font-size: 14px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(0,0,0,0.3);
                color: inherit;
                outline: none;
            }

            #css-prompt-modal textarea {
                min-height: 80px;
            }

            #css-prompt-modal .color-row {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            #css-prompt-modal .color-input {
                width: 50px;
                height: 40px;
                padding: 4px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(0,0,0,0.3);
                cursor: pointer;
            }

            #css-prompt-modal .color-input::-webkit-color-swatch-wrapper {
                padding: 0;
            }

            #css-prompt-modal .color-input::-webkit-color-swatch {
                border: none;
                border-radius: 4px;
            }

            #css-prompt-modal .output-section {
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 16px;
            }

            #css-prompt-modal .output-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 12px;
            }

            #css-prompt-modal .output-title {
                font-size: 14px;
                font-weight: 600;
            }

            #css-prompt-modal .output-text {
                font-size: 13px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-word;
                background: rgba(0,0,0,0.4);
                padding: 14px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.05);
                max-height: 200px;
                overflow-y: auto;
            }

            #css-prompt-modal .checkbox-group {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }

            #css-prompt-modal .checkbox-item {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 13px;
            }

            #css-prompt-modal .checkbox-item input {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }

            .css-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                padding: 14px 20px;
                border-radius: 10px;
                font-size: 13px;
                font-weight: 500;
                z-index: 100000;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                border: 1px solid;
                pointer-events: none;
            }

            .css-toast.show {
                transform: translateY(0);
                opacity: 1;
            }

            .css-toast.success {
                background: rgba(34, 197, 94, 0.15);
                border-color: rgba(34, 197, 94, 0.3);
                color: #4ade80;
            }

            .css-toast.error {
                background: rgba(239, 68, 68, 0.15);
                border-color: rgba(239, 68, 68, 0.3);
                color: #f87171;
            }

            .css-toast.info {
                background: rgba(59, 130, 246, 0.15);
                border-color: rgba(59, 130, 246, 0.3);
                color: #60a5fa;
            }

            @media (max-width: 768px) {
                #css-injector-modal {
                    height: 90vh;
                }

                #css-injector-modal .modal-content {
                    flex-direction: column;
                }

                #css-injector-modal .sidebar {
                    width: 100%;
                    max-height: 200px;
                    border-right: none;
                    border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
                }

                #css-injector-modal .shortcuts-popup {
                    left: auto;
                    right: 0;
                }
            }

                        #css-injector-modal .featured-item {
                width: 100%;
                padding: 10px 12px;
                border-radius: 10px;
                text-align: left;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                gap: 4px;
                margin-bottom: 4px;
                background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
                border: 1px solid rgba(147, 51, 234, 0.2);
                color: inherit;
                transition: all 0.15s ease;
            }

            #css-injector-modal .featured-item:hover {
                background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%);
                border-color: rgba(147, 51, 234, 0.4);
            }

            #css-injector-modal .featured-item.active {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%);
                border-color: rgba(34, 197, 94, 0.4);
            }

            #css-injector-modal .featured-item .featured-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
            }

            #css-injector-modal .featured-item .featured-name {
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #css-injector-modal .featured-item .featured-badge {
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 2px 6px;
                border-radius: 4px;
                background: rgba(147, 51, 234, 0.3);
                color: #c084fc;
                flex-shrink: 0;
            }

            #css-injector-modal .featured-item .featured-author {
                font-size: 11px;
                opacity: 0.6;
            }

            #css-injector-modal .featured-item .featured-desc {
                font-size: 11px;
                opacity: 0.5;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

                       #css-injector-modal .featured-preview {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #css-injector-modal .featured-preview-inner {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 20px;
                gap: 16px;
                overflow-y: auto;
            }

            #css-injector-modal .featured-preview-header {
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex-shrink: 0;
            }

            #css-injector-modal .featured-preview-title {
                font-size: 20px;
                font-weight: 600;
                color: #c084fc;
            }

            #css-injector-modal .featured-preview-meta {
                display: flex;
                gap: 12px;
                font-size: 13px;
                opacity: 0.7;
            }

            #css-injector-modal .featured-preview-desc {
                font-size: 14px;
                line-height: 1.5;
                opacity: 0.8;
                flex-shrink: 0;
            }

            #css-injector-modal .featured-preview-css {
                flex: 1;
                min-height: 200px;
                max-height: 400px;
                font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
                font-size: 12px;
                line-height: 1.5;
                background: rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 16px;
                overflow: auto;
                white-space: pre-wrap;
                word-break: break-word;
            }

            #css-injector-modal .featured-preview-actions {
                display: flex;
                gap: 8px;
                padding: 16px 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                background: rgba(0,0,0,0.2);
                flex-shrink: 0;
            }
        `;
    }

    function toast(message, type = 'success') {
        $('.css-toast')?.remove();

        const t = document.createElement('div');
        t.className = `css-toast ${type}`;
        t.textContent = message;
        document.body.appendChild(t);

        t.offsetHeight;
        t.classList.add('show');

        addManagedTimeout(() => {
            t.classList.remove('show');
            addManagedTimeout(() => t.remove(), 250);
        }, TOAST_DURATION);
    }

    function createModal() {
        if ($('#css-injector-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'css-injector-overlay';
        overlay.innerHTML = getModalHTML();
        document.body.appendChild(overlay);

        state.cache.overlay = overlay;
        state.cache.editor = $('#css-editor');
        state.cache.styleList = $('#css-style-list');
        state.cache.searchInput = $('#css-search');

        createPromptModal();
        setupEventDelegation();
        updateRandomFavoritesButton();
        refreshUI();
    }

    function getModalHTML() {
        const randomEnabled = getRandomFavoritesEnabled();
        const isOriginal = isOriginalThemeActive();
        return `
            <div id="css-injector-modal" class="border shadow-xl dark:bg-background light:bg-background gray:bg-card rounded-xl border-border">
                <div class="h-14 shrink-0 px-4 w-full flex items-center justify-between border-b border-border">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold">CSS Style Manager</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="toggle-random" class="css-btn css-btn-sm ${randomEnabled ? 'css-btn-active' : ''}" title="Random favorites: ${randomEnabled ? 'ON' : 'OFF'}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/></svg>
                            Shuffle
                        </button>
                        <button data-action="import" class="css-btn css-btn-sm" title="Import styles from file">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            Import
                        </button>
                        <button data-action="export" class="css-btn css-btn-sm" title="Export all styles to file">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            Export
                        </button>
                        <button data-action="close" class="css-btn css-btn-sm css-btn-icon" title="Close (Esc)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    </div>
                </div>

                <div class="modal-content">
                    <div class="sidebar">
                        <div class="sidebar-header">
                            <div class="search-wrapper">
                                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                <input type="text" id="css-search" class="search-input" placeholder="Search styles..." autocomplete="off">
                                <button class="search-clear" data-action="clear-search" title="Clear search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                            <button data-action="new" class="css-btn css-btn-sm" style="width: 100%;" title="Create new style">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                New Style
                            </button>
                            <button data-action="generate" class="css-btn css-btn-sm css-btn-purple" style="width: 100%;" title="Generate theme prompt">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z"/></svg>
                                Make Your Own
                            </button>
                        </div>
                        <div class="sidebar-list" id="css-style-list"></div>
                    </div>

                    <div class="editor-panel">
                        <div id="css-editor-container" style="display: flex; flex-direction: column; flex: 1;">
                            <div class="editor-header">
                                <span class="editor-title" id="css-editor-title">Select a style</span>
                                <div class="editor-actions">
                                    <button data-action="rename" class="css-btn css-btn-sm css-btn-icon" title="Rename style">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                    </button>
                                    <button data-action="duplicate" class="css-btn css-btn-sm css-btn-icon" title="Duplicate style">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                    </button>
                                    <button data-action="delete" class="css-btn css-btn-sm css-btn-icon css-btn-danger" title="Delete style">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="editor-body">
                                <textarea id="css-editor" placeholder="Enter your CSS code here..." spellcheck="false"></textarea>
                            </div>
                            <div class="editor-footer">
                                <div class="footer-left" style="position: relative;">
                                    <span class="line-count" id="css-line-count">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
                                        0 lines
                                    </span>
                                    <button class="shortcuts-btn" data-action="toggle-shortcuts" title="Keyboard shortcuts">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>
                                    </button>
                                    <div class="shortcuts-popup" id="shortcuts-popup">
                                        <h4>Keyboard Shortcuts</h4>
                                        <div class="shortcut-row">
                                            <span>Save</span>
                                            <span class="shortcut-key">Ctrl+S</span>
                                        </div>
                                        <div class="shortcut-row">
                                            <span>Close</span>
                                            <span class="shortcut-key">Esc</span>
                                        </div>
                                        <div class="shortcut-row">
                                            <span>Indent</span>
                                            <span class="shortcut-key">Tab</span>
                                        </div>
                                        <div class="shortcut-row">
                                            <span>Search</span>
                                            <span class="shortcut-key">Ctrl+F</span>
                                        </div>
                                        <div class="shortcut-row">
                                            <span>Original Theme</span>
                                            <span class="shortcut-key">Ctrl+Shift+H</span>
                                        </div>
                                    </div>
                                    <div class="dirty-indicator" id="css-dirty-indicator">
                                        <span class="dot"></span>
                                        <span>Unsaved</span>
                                    </div>
                                </div>
                                <div class="footer-right">
                                    <button data-action="save" class="css-btn" title="Save changes (Ctrl+S)">Save</button>
                                    <button data-action="apply" class="css-btn css-btn-primary" title="Save and activate">Apply</button>
                                </div>
                            </div>
                        </div>
                        <div id="css-empty-state" class="empty-state" style="display: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 2 2 4-4"/><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"/><path d="m12 12-1-1"/><path d="m9 15-1-1"/><path d="m15 9-1-1"/></svg>
                            <div class="empty-state-title">No Styles Yet</div>
                            <div class="empty-state-desc">Create a new style or use "Make Your Own" to generate a custom theme.</div>
                        </div>
                        <div id="css-original-theme-state" class="original-theme-info" style="display: none;">
                            <div class="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                            </div>
                            <div class="title">Original Theme Active</div>
                            <div class="desc">You're viewing Lemonade's default theme. Select a custom style from the sidebar to customize.</div>
                            <div class="shortcut">
                                <span>Toggle with</span>
                                <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd>
                            </div>
                        </div>
                        <div id="css-featured-preview" class="featured-preview" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    function createPromptModal() {
        if ($('#css-prompt-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'css-prompt-overlay';
        overlay.innerHTML = getPromptModalHTML();
        document.body.appendChild(overlay);

        state.cache.promptOverlay = overlay;
        setupPromptEvents();
    }

    function getPromptModalHTML() {
        return `
            <div id="css-prompt-modal" class="border shadow-xl dark:bg-background light:bg-background gray:bg-card rounded-xl border-border">
                <div class="h-14 shrink-0 px-4 w-full flex items-center justify-between border-b border-border">
                    <span class="text-sm font-semibold">Theme Prompt Generator</span>
                    <button data-action="prompt-close" class="css-btn css-btn-sm css-btn-icon" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <div class="prompt-body">
                    <div class="form-group">
                        <label class="form-label">Theme Name</label>
                        <input type="text" id="prompt-name" placeholder="e.g., Midnight Aurora">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Theme Aesthetic</label>
                        <select id="prompt-aesthetic">
                            <option value="">Select an aesthetic...</option>
                            <option value="anime">Anime / Manga</option>
                            <option value="cyberpunk">Cyberpunk / Neon</option>
                            <option value="nature">Nature / Organic</option>
                            <option value="minimalist">Minimalist / Clean</option>
                            <option value="retro">Retro / Vintage</option>
                            <option value="space">Space / Cosmic</option>
                            <option value="ocean">Ocean / Aquatic</option>
                            <option value="forest">Forest / Woodland</option>
                            <option value="sunset">Sunset / Warm Tones</option>
                            <option value="monochrome">Monochrome</option>
                            <option value="pastel">Pastel / Soft</option>
                            <option value="dark">Dark / Gothic</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Custom Description (optional)</label>
                        <textarea id="prompt-description" placeholder="Describe your theme in detail..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Primary Color</label>
                        <div class="color-row">
                            <input type="color" id="prompt-color" class="color-input" value="#9333ea">
                            <input type="text" id="prompt-color-text" placeholder="#9333ea" style="flex: 1;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Background Image URL (optional)</label>
                        <input type="text" id="prompt-bg-url" placeholder="https://example.com/image.jpg">
                        <span class="form-hint">Leave empty for solid color background</span>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Style Features</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item"><input type="checkbox" id="prompt-glass" checked> Frosted glass</label>
                            <label class="checkbox-item"><input type="checkbox" id="prompt-rounded" checked> Rounded corners</label>
                            <label class="checkbox-item"><input type="checkbox" id="prompt-glow"> Glow effects</label>
                            <label class="checkbox-item"><input type="checkbox" id="prompt-transparent" checked> Transparent</label>
                            <label class="checkbox-item"><input type="checkbox" id="prompt-animations"> Animations</label>
                            <label class="checkbox-item"><input type="checkbox" id="prompt-shadows" checked> Soft shadows</label>
                        </div>
                    </div>
                    <div class="output-section">
                        <div class="output-header">
                            <span class="output-title">Generated Prompt</span>
                            <button data-action="prompt-copy" class="css-btn css-btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                Copy
                            </button>
                        </div>
                        <div class="output-text" id="prompt-output">Fill in the form above...</div>
                    </div>
                </div>
                <div class="h-14 shrink-0 px-4 w-full flex items-center justify-end gap-2 border-t border-border">
                    <button data-action="prompt-cancel" class="css-btn">Cancel</button>
                    <button data-action="prompt-use" class="css-btn css-btn-primary">Copy and Close</button>
                </div>
            </div>
        `;
    }

    function generatePrompt() {
        const name = $('#prompt-name')?.value.trim() || 'Custom Theme';
        const aesthetic = $('#prompt-aesthetic')?.value || '';
        const description = $('#prompt-description')?.value.trim() || '';
        const color = $('#prompt-color-text')?.value.trim() || $('#prompt-color')?.value || '#9333ea';
        const bgUrl = $('#prompt-bg-url')?.value.trim() || '';

        const features = [
            ['prompt-glass', 'frosted glass (backdrop-filter: blur(12px))'],
            ['prompt-rounded', 'rounded corners'],
            ['prompt-glow', 'glow effects'],
            ['prompt-transparent', 'transparent backgrounds'],
            ['prompt-animations', 'smooth transitions'],
            ['prompt-shadows', 'soft shadows']
        ].filter(([id]) => $(`#${id}`)?.checked).map(([, l]) => l);

        const aestheticMap = {
            anime: 'anime/manga', cyberpunk: 'cyberpunk/neon', nature: 'nature/earthy',
            minimalist: 'minimal', retro: 'retro/vintage', space: 'space/cosmic',
            ocean: 'ocean/aquatic', forest: 'forest/woodland', sunset: 'warm sunset',
            monochrome: 'monochromatic', pastel: 'soft pastels', dark: 'dark/gothic'
        };

        let prompt = `CSS theme "${name}" for lemonade.gg/code\nPrimary color: ${color}`;
        if (aesthetic && aestheticMap[aesthetic]) prompt += `\nStyle: ${aestheticMap[aesthetic]}`;
        if (description) prompt += `\n${description}`;
        if (features.length) prompt += `\nFeatures: ${features.join(', ')}`;
        if (bgUrl) prompt += `\nBackground image: ${bgUrl}`;
        prompt += getPromptTemplate();
        return prompt;
    }

function getPromptTemplate() {
    return `

Site uses Tailwind with gray/dark/light theme variants. Use !important everywhere.

SELECTORS REFERENCE:

Background: html, html.gray { background: #0A0C12 !important; } html::before for bg image with filter, html::after for overlay, body transparent.

Gray overrides: [class*="gray:bg"]:not([data-chat-input-container="true"]):not(.rounded-2xl) { background: transparent !important; }

Header: .h-14.shrink-0.px-2.w-full.flex.items-center.justify-between { background: rgba(10,12,18,0.7) !important; backdrop-filter: blur(10px) !important; }

Tabs bar: .flex.items-center.gap-1.px-4.md\\:px-20.py-1\\.5.md\\:py-2.bg-background.gray\\:\\!bg-card

Messages container: .flex-1.px-4.md\\:px-20.py-4.space-y-4.pb-\\[8vh\\].overflow-y-auto.styled-scrollbar.gray\\:bg-card { background: transparent !important; }

AI bubbles: .relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.bg-background.text-foreground.w-fit.max-w-full.break-words, [data-message-author="assistant"]

User bubbles: .relative.rounded-tr-2xl.rounded-tl-2xl.rounded-bl-2xl.rounded-br-none.p-2, [data-message-author="user"]

Inner message elements (remove styling): .relative.group, .relative.group > div, .relative.group p, div[class*="rounded-tr-2xl"] p, div[class*="rounded-tr-2xl"] ul, div[class*="rounded-tr-2xl"] li

Chat input: [data-chat-input-container="true"], .chat-input-container, .rounded-2xl[class*="border"]

Autocomplete dropdown: .absolute.z-50.bg-background.border.border-border.rounded-lg.shadow-lg.overflow-hidden (container), .absolute.z-50 .flex.items-center.gap-2.px-3.py-2.cursor-pointer.transition-colors (items), .absolute.z-50 .bg-accent.text-accent-foreground (selected item), .absolute.z-50 .border-t.border-border.px-3.py-2.bg-muted\\/30 (footer hint)

Tooltips: [role="tooltip"], .tooltip, [class*="tooltip"], [data-state="delayed-open"][data-side], [data-radix-popper-content-wrapper] > div, .tippy-box

Buttons: button:not(.sfx-toggle-btn):not(.lpb-trigger):not([class*="sfx-"]):not([class*="lpb-"]):not(.unstyled)

Badges: .bg-yellow-500\\/20, .bg-white\\/10.ring-1, .bg-stone-200\\/5

Checkpoint buttons: .border.rounded-md.text-sm.transition-all

Scrollbars: ::-webkit-scrollbar, ::-webkit-scrollbar-track, ::-webkit-scrollbar-thumb, * { scrollbar-width, scrollbar-color }

Code blocks: code { background, border, border-radius, color }, pre { background, border, border-left }

Avatars: .rounded-full img

Dropdowns & modals: [role="menu"], [role="dialog"], [role="listbox"], .modal, .dropdown

Links: a:not([class*="lpb-"])

PROMPT BUILDER MODAL SELECTORS:

Modal overlay: .lpb-modal-overlay

Modal content: .lpb-modal-content { background gradient, border, backdrop-filter, box-shadow, max-height }

Header: .lpb-header { background gradient, border-bottom, padding }

Title: .lpb-title { font-family heading, color gold, text-shadow }

Close button: .lpb-close-btn { background, border, hover rotate }

Body: .lpb-body { padding 0, overflow-y auto, max-height calc(85vh - 80px) }

Tabs: .lpb-tabs { display flex, gap, padding, background, border-bottom, overflow-x auto }

Tab button: .lpb-tab { padding, background, border, border-radius, color, font, cursor, transition }

Active tab: .lpb-tab.active { background gradient, border-color gold, box-shadow, ::after bottom line }

Main content: #lpb-main-content { padding, flex 1, overflow-y auto }

Category grid: .lpb-category-grid { display grid, grid-template-columns repeat(auto-fill, minmax(220px, 1fr)), gap }

Category card: .lpb-category-card { background gradient, border, border-left gold, border-radius, padding, cursor, transition, ::before overlay }

Category name: .lpb-category-name { font-family heading, font-size, font-weight, color, hover gold }

Category description: .lpb-category-desc { font-family body, font-size, color muted }

Back button: .lpb-back-btn { display inline-flex, background, border, hover translateX(-4px) }

Template grid: .lpb-template-grid { display grid, grid-template-columns repeat(auto-fill, minmax(240px, 1fr)), gap }

Template card: .lpb-template-card { background gradient, border, border-left gold, border-radius, padding, cursor, hover lift, ::before overlay }

Template name: .lpb-template-name { font-family heading, color, text-align center, hover gold glow }

FORM ELEMENTS:

Form content: #lpb-form-content { padding, display flex column, gap }

Form field: .lpb-form-field { display flex column, gap }

Label: .lpb-label { font-family body, font-size, font-weight, color }

Required asterisk: .lpb-required { color danger }

Input: .lpb-input { background, border, border-radius, color, font, padding, transition, focus gold border }

Textarea: .lpb-textarea { min-height, resize vertical, background, border, color, font-family body }

Radio group: .lpb-radio-group { display flex, gap, flex-wrap }

Radio item: .lpb-radio-item { display flex, align-items center, gap }

Radio input: .lpb-radio-item input[type="radio"] { appearance none, width height 18px, border, border-radius 50%, background, checked border-color gold, ::after dot }

Radio label: .lpb-radio-item label { font-family body, color, cursor, checked color gold }

Preview: .lpb-preview { background gradient, border, border-left gold, border-radius, overflow hidden }

Preview header: .lpb-preview-header { display flex, justify-between, background, border-bottom }

Preview title: .lpb-preview-title { font-family heading, color gold, text-shadow }

Char count: .lpb-char-count { font-family code, font-size, color muted, background, border }

Preview content: .lpb-preview-content { padding, font-family body, max-height 300px, overflow-y auto, white-space pre-wrap }

Actions: .lpb-actions { display flex, gap, justify-end, padding-top, border-top }

Insert button: #lpb-insert-btn { background gradient gold, border, color gold, padding, hover lift glow }

HISTORY TAB:

Search wrapper: .lpb-search-wrapper { margin-bottom, position relative }

Search input: .lpb-search-input { width 100%, padding, background, border }

History results: #lpb-history-results { display flex column, gap }

History item: .lpb-history-item { background gradient, border, border-left gold, border-radius, padding, hover lift, ::before overlay }

History top: .lpb-history-top { display flex, justify-between, align-items flex-start }

History info: .lpb-history-info { display flex, flex-wrap, align-items center, gap }

Badge: .lpb-badge { display inline-flex, padding, background gradient, border, border-radius, font code, color gold, text-transform uppercase }

Custom name: .lpb-custom-name { font-family heading, color, hover gold }

Timestamp: .lpb-timestamp { font-family body, font-size small, color muted }

Fav button: .lpb-fav-btn { width height 2rem, background, border, border-radius, color, cursor, hover scale }

Fav active: .lpb-fav-btn:contains("★") { background warning, border-color warning, color warning, text-shadow }

History preview: .lpb-history-preview { display flex, padding, background, border, border-radius, cursor }

Preview text: .lpb-history-preview-text { flex 1, font-family body, color }

Truncated: .lpb-history-preview-text.truncated { -webkit-line-clamp 2, overflow hidden }

Expand icon: .lpb-expand-icon { font-size small, color muted, transition, rotate on expand }

History actions: .lpb-history-actions { display flex, flex-wrap, gap, padding-top, border-top }

Small button: .lpb-btn-small { padding, font-size small }

Delete button: .lpb-btn-small[data-action="delete"] { background danger, border-color danger, color danger, opacity 0.7 }

CUSTOM TEMPLATES TAB:

Info banner override green: #lpb-main-content > div[style*="linear-gradient(135deg, rgba(76, 175, 80"] { background gradient gold, border gold, border-left }

Creator name card: #lpb-main-content > div[style*="background: #1a1a1a"] { background gradient, border, backdrop-filter }

Create button override green: #lpb-create-template { background gradient gold, border gold, color gold }

Import button: #lpb-import-template

Template card: div[style*="background: rgb(26, 26, 26)"][style*="border: 2px solid rgb(51, 51, 51)"] { background gradient, border, border-left gold, hover lift }

Use button override blue: button[data-action="use"][style*="linear-gradient(135deg, #2196F3"] { background gradient gold, color gold }

Share button: button[data-action="share"]

Delete button override red: button[data-action="delete"][style*="color: #f44336"] { background danger, border danger, opacity }

SETTINGS TAB:

Settings section: .lpb-settings-section { background gradient, border, border-left gold, padding, margin-bottom, hover }

Section heading: .lpb-settings-section > h3 { font-family heading, color gold, border-bottom, ::after gradient line }

Setting item: .lpb-setting-item { display flex, justify-between, align-items center, padding, border-bottom, hover background }

Setting label: .lpb-setting-label { flex 1 }

Label h4: .lpb-setting-label h4 { font-family heading, color, hover gold }

Label p: .lpb-setting-label p { font-size small, color muted }

Toggle switch: .lpb-toggle-switch { width 52px, height 28px, background, border, border-radius, cursor, ::after dot }

Toggle active: .lpb-toggle-switch.active { background gradient gold, border gold, box-shadow, ::after left 27px gold }

Slider input: .lpb-slider, input[type="number"].lpb-input { width 100px, padding, background, border, font-family code, text-align center }

Statistics numbers: .lpb-settings-section strong[style*="color: #2196F3"] { color gold, text-shadow }

About version: .lpb-settings-section > p strong[style*="color: #2196F3"] { color gold, font-family heading, text-shadow }

Mode labels: span[style*="color: #4CAF50"] { color success }, span[style*="color: #9C27B0"] { color sunset }

Export/import buttons: #lpb-export-data, #lpb-import-data { background gradient, border }

Clear button: #lpb-clear-all { background danger, border danger, color danger, opacity }

TEMPLATE CREATOR:

Mode tabs: .lpb-mode-tab { flex 1, padding, background transparent, color muted, cursor, transition }

Beginner active: .lpb-mode-tab.active[data-mode="beginner"] { background gradient success, color success, box-shadow inset bottom }

Advanced active: .lpb-mode-tab.active[data-mode="advanced"] { background gradient sunset, color sunset, box-shadow inset bottom }

Beginner banner override green: #lpb-beginner-section > div[style*="rgba(76, 175, 80"] { background gradient success, border success, border-left }

Advanced banner override purple: #lpb-advanced-section > div[style*="rgba(156, 39, 176"] { background gradient sunset, border sunset, border-left }

Step circles: #lpb-beginner-section div[style*="background: #4CAF50"] { background gradient success, box-shadow }

Template field beginner: .lpb-template-field { background, border, border-radius, hover }

Template field advanced: .lpb-template-field-adv { background, border, hover border sunset }

Conditional container: .field-conditional-container { background gradient warning, border-left warning }

Variable list: #lpb-variable-list, #lpb-variable-list-adv { display flex wrap, gap, background, border }

Variable chips: #lpb-variable-list code { background, border, font-family code, color gold, cursor, hover lift }

Add field beginner: #lpb-add-field { background gradient success, border success, color success }

Add field advanced: #lpb-add-field-adv { background gradient sunset, border sunset, color sunset }

Remove field: button[data-action="remove-field"] { background transparent, border danger, color danger, hover scale }

Tip box: div[style*="rgba(255, 152, 0, 0.1)"] { background gradient warning, border-left warning }

Template inputs: #lpb-template-name, #lpb-template-desc, #lpb-template-name-adv, #lpb-template-desc-adv

Template textarea: #lpb-template-generate, #lpb-template-generate-adv { font-family code, background, border, focus gold }

Generate AI button: #lpb-generate-ai-prompt-adv { background gradient orange, border orange, color orange }

Section containers: div[style*="background: #1a1a1a; border: 2px solid #333"] { background, border }

No fields message: #lpb-no-fields-msg, #lpb-no-fields-msg-adv { text-align center, color muted, border dashed }

Template save button: #lpb-template-save { background gradient gold, border gold, color gold, hover lift }

Select dropdowns: .lpb-select, select.field-type, select.field-required, select.field-show-when

Field inputs: .field-id, .field-label, .field-default, .field-placeholder, .field-options, .field-help, .field-show-when-value, .field-list-placeholder, .field-min, .field-max, .field-step

AI PROMPT GENERATOR MODAL:

Edit modal content: .lpb-edit-modal-content { max-width 900px, max-height 90vh, overflow-y auto, background gradient, border, backdrop-filter }

Main heading: .lpb-edit-modal-content > h3 { color orange, font-family heading, text-shadow }

How to use banner: div[style*="rgba(255, 107, 53"] { background gradient orange, border-left orange }

Capabilities banner: div[style*="rgba(76, 175, 80"] { background gradient success, border-left success }

Pro tips banner: div[style*="rgba(33, 150, 243, 0.1)"] { background gradient gold, border-left gold }

AI prompt textarea: #lpb-ai-prompt-text { font-family code, font-size small, background black, color green #0f0, border }

Copy prompt button: #lpb-copy-ai-prompt { background gradient success, border success, color success }

Details/example: .lpb-edit-modal-content details { background, border, summary color gold, ::before arrow rotate }

Paste code button: #lpb-paste-to-template { background gradient sunset, border sunset, color sunset, hover lift }

Edit actions: .lpb-edit-actions { display flex, gap, justify-end, padding-top, border-top }

ANIMATIONS:

Modal enter: @keyframes lpb-modal-enter, lpb-settings-enter, lpb-ai-modal-enter { opacity scale translateY }

Card enter: @keyframes lpb-card-enter { opacity translateY }

Field enter: @keyframes lpb-field-enter { opacity translateX }

Item enter: @keyframes lpb-item-enter { opacity translateX }

Tooltip fade: @keyframes tooltip-fade-in { opacity translateY scale }

Stagger delays: nth-child animation-delay

RESPONSIVE:

@media (max-width: 768px): grid-template-columns, flex-direction column, padding adjustments

@media (max-width: 600px): setting-item column, toggle align-self

@media (max-width: 480px): font-size reductions, char-count smaller, preview max-height

Use :root variables. Include -webkit-backdrop-filter for Safari. Escape colons (gray\\:bg-card, py-1\\.5).

Give me the full CSS with all sections: background, header, tabs, messages, AI/user bubbles, chat input, autocomplete, tooltips, buttons, badges, scrollbars, code blocks, avatars, dropdowns, links, loading states, modal (overlay, content, header, body, tabs, categories, templates, form, history, custom templates, settings, template creator beginner/advanced, AI generator), animations, responsive.`;
}

    function updatePromptOutput() {
        const output = $('#prompt-output');
        if (output) output.textContent = generatePrompt();
    }

    const debouncedUpdatePrompt = debounce(updatePromptOutput, DEBOUNCE_DELAY);

    function setupPromptEvents() {
        const overlay = $('#css-prompt-overlay');
        if (!overlay) return;

        const colorPicker = $('#prompt-color');
        const colorText = $('#prompt-color-text');

        if (colorPicker && colorText) {
            addManagedListener(colorPicker, 'input', () => {
                colorText.value = colorPicker.value;
                debouncedUpdatePrompt();
            });
            addManagedListener(colorText, 'input', () => {
                if (/^#[0-9A-Fa-f]{6}$/.test(colorText.value)) colorPicker.value = colorText.value;
                debouncedUpdatePrompt();
            });
        }

        $$('input, select, textarea', overlay).forEach(input => {
            addManagedListener(input, 'input', debouncedUpdatePrompt);
            addManagedListener(input, 'change', debouncedUpdatePrompt);
        });

        addManagedListener(overlay, 'click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    }

    function setupEventDelegation() {
        const overlay = state.cache.overlay;
        const promptOverlay = $('#css-prompt-overlay');

        addManagedListener(overlay, 'click', handleModalClick);
        addManagedListener(overlay, 'click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });

        if (promptOverlay) {
            addManagedListener(promptOverlay, 'click', handlePromptClick);
        }

        addManagedListener(document, 'keydown', handleKeydown);

        if (state.cache.editor) {
            addManagedListener(state.cache.editor, 'keydown', handleEditorKeydown);
            addManagedListener(state.cache.editor, 'input', debouncedCheckDirty);
            addManagedListener(state.cache.editor, 'input', debouncedUpdateLineCount);
        }

        if (state.cache.searchInput) {
            addManagedListener(state.cache.searchInput, 'input', debounce(handleSearch, 100));
        }

        addManagedListener(document, 'click', (e) => {
            const popup = $('#shortcuts-popup');
            if (popup?.classList.contains('show') && !e.target.closest('[data-action="toggle-shortcuts"]') && !e.target.closest('.shortcuts-popup')) {
                popup.classList.remove('show');
            }
        });
    }

    function handleSearch() {
        state.searchQuery = state.cache.searchInput?.value.trim().toLowerCase() || '';

        const clearBtn = $('.search-clear');
        if (clearBtn) {
            clearBtn.classList.toggle('visible', state.searchQuery.length > 0);
        }

        refreshUI();
    }

    function handleModalClick(e) {
        const button = e.target.closest('[data-action]');
        const favoriteBtn = e.target.closest('.favorite-btn');

        if (favoriteBtn) {
            e.stopPropagation();
            const styleName = favoriteBtn.dataset.styleName;
            if (styleName) toggleFavorite(styleName);
            return;
        }

        if (!button) {
            const featuredItem = e.target.closest('.featured-item');
            const styleItem = e.target.closest('.style-item');

            if (featuredItem) {
                const name = featuredItem.dataset.featuredName;
                if (name) {
                    state.selectedFeatured = name;
                    state.currentStyle = null;
                    if (e.detail === 2) {
                        applyFeaturedTheme(name);
                    }
                    refreshUI();
                }
                return;
            }

            if (styleItem) {
                state.selectedFeatured = null;
                const name = styleItem.dataset.styleName;
                const isOriginalItem = styleItem.dataset.originalTheme === 'true';

                if (isOriginalItem) {
                    if (e.detail === 2) {
                        restoreOriginalTheme();
                    } else {
                        selectOriginalTheme();
                    }
                } else if (name) {
                    setOriginalThemeActive(false);
                    if (e.detail === 2) {
                        selectStyle(name);
                        applyStyle();
                    } else {
                        selectStyle(name);
                    }
                }
            }
            return;
        }

        const action = button.dataset.action;
        const actions = {
            close: () => state.cache.overlay?.classList.remove('open'),
            new: handleNewStyle,
            generate: () => {
                $('#css-prompt-overlay')?.classList.add('open');
                updatePromptOutput();
            },
            rename: handleRename,
            duplicate: handleDuplicate,
            delete: handleDelete,
            save: () => saveCurrentStyle(),
            apply: applyStyle,
            import: handleImport,
            export: handleExport,
            'toggle-random': toggleRandomFavorites,
            'original-theme': restoreOriginalTheme,
            'clear-search': () => {
                if (state.cache.searchInput) {
                    state.cache.searchInput.value = '';
                    handleSearch();
                    state.cache.searchInput.focus();
                }
            },
            'toggle-shortcuts': () => {
                const popup = $('#shortcuts-popup');
                popup?.classList.toggle('show');
            },
            'apply-featured': () => {
                const btn = e.target.closest('[data-action="apply-featured"]');
                const themeName = btn?.dataset.theme;
                if (themeName) applyFeaturedTheme(themeName);
            },
            'copy-featured': () => {
                const btn = e.target.closest('[data-action="copy-featured"]');
                const themeName = btn?.dataset.theme;
                if (themeName) copyFeaturedToMyStyles(themeName);
            }
        };

        if (actions[action]) actions[action]();
    }

    function handlePromptClick(e) {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const promptOverlay = $('#css-prompt-overlay');

        const actions = {
            'prompt-close': () => promptOverlay?.classList.remove('open'),
            'prompt-cancel': () => promptOverlay?.classList.remove('open'),
            'prompt-copy': () => {
                navigator.clipboard.writeText(generatePrompt()).then(() => toast('Prompt copied'));
            },
            'prompt-use': () => {
                navigator.clipboard.writeText(generatePrompt()).then(() => {
                    toast('Prompt copied');
                    promptOverlay?.classList.remove('open');
                });
            }
        };

        if (actions[action]) actions[action]();
    }

    function handleKeydown(e) {
        const overlay = state.cache.overlay;
        const promptOverlay = $('#css-prompt-overlay');
        const isMainOpen = overlay?.classList.contains('open');
        const isPromptOpen = promptOverlay?.classList.contains('open');

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            restoreOriginalTheme();
            return;
        }

        if (!isMainOpen && !isPromptOpen) return;

        if (e.key === 'Escape') {
            $('#shortcuts-popup')?.classList.remove('show');
            overlay?.classList.remove('open');
            promptOverlay?.classList.remove('open');
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 's' && isMainOpen) {
            e.preventDefault();
            saveCurrentStyle();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && isMainOpen) {
            e.preventDefault();
            state.cache.searchInput?.focus();
        }
    }

    function handleEditorKeydown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const editor = e.target;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
            debouncedCheckDirty();
        }
    }

    function handleNewStyle() {
        const name = prompt('Enter style name:');
        if (!name?.trim()) return;

        const styles = getStyles();
        if (styles[name.trim()]) {
            toast('Style already exists', 'error');
            return;
        }

        styles[name.trim()] = '';
        saveStyles(styles);
        state.currentStyle = name.trim();
        state.lastSavedContent = styles[name.trim()];
        setDirty(false);
        setOriginalThemeActive(false);
        refreshUI();
        toast('Style created');
    }

    function handleRename() {
        if (!state.currentStyle) return;

        const newName = prompt('Enter new name:', state.currentStyle);
        if (!newName?.trim() || newName.trim() === state.currentStyle) return;

        const styles = getStyles();
        if (styles[newName.trim()]) {
            toast('Style already exists', 'error');
            return;
        }

        const favorites = getFavorites();
        const wasFavorite = favorites.includes(state.currentStyle);

        styles[newName.trim()] = styles[state.currentStyle];
        delete styles[state.currentStyle];
        saveStyles(styles);

        if (wasFavorite) {
            const idx = favorites.indexOf(state.currentStyle);
            favorites[idx] = newName.trim();
            saveFavorites(favorites);
        }

        if (getActiveStyle() === state.currentStyle) {
            setActiveStyle(newName.trim());
        }

        state.currentStyle = newName.trim();
        refreshUI();
        toast('Style renamed');
    }

    function handleDuplicate() {
        if (!state.currentStyle) return;

        const styles = getStyles();
        let newName = state.currentStyle + ' (copy)';
        let counter = 1;
        while (styles[newName]) {
            counter++;
            newName = state.currentStyle + ` (copy ${counter})`;
        }

        styles[newName] = styles[state.currentStyle];
        saveStyles(styles);
        state.currentStyle = newName;
        state.lastSavedContent = styles[newName];
        setDirty(false);
        refreshUI();
        toast('Style duplicated');
    }

    function handleDelete() {
        if (!state.currentStyle) return;
        if (!confirm(`Delete "${state.currentStyle}"?`)) return;

        const styles = getStyles();
        delete styles[state.currentStyle];
        saveStyles(styles);

        const favorites = getFavorites();
        const idx = favorites.indexOf(state.currentStyle);
        if (idx !== -1) {
            favorites.splice(idx, 1);
            saveFavorites(favorites);
        }

        if (getActiveStyle() === state.currentStyle) {
            setActiveStyle('');
            setOriginalThemeActive(true);
            injectCSS('');
        }

        state.currentStyle = null;
        setDirty(false);
        refreshUI();
        toast('Style deleted');
    }

    function handleImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (typeof imported !== 'object' || imported === null) throw new Error();

                    const styles = getStyles();
                    let count = 0;

                    for (const [name, css] of Object.entries(imported)) {
                        if (typeof css === 'string') {
                            let finalName = name;
                            let counter = 1;
                            while (styles[finalName]) {
                                finalName = `${name} (${counter})`;
                                counter++;
                            }
                            styles[finalName] = css;
                            count++;
                        }
                    }

                    saveStyles(styles);
                    refreshUI();
                    toast(`Imported ${count} style${count !== 1 ? 's' : ''}`);
                } catch {
                    toast('Invalid file format', 'error');
                }
            };
            reader.onerror = () => toast('Error reading file', 'error');
            reader.readAsText(file);
        };
        input.click();
    }

    function handleExport() {
        const styles = getStyles();
        if (Object.keys(styles).length === 0) {
            toast('No styles to export', 'info');
            return;
        }

        const blob = new Blob([JSON.stringify(styles, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lemonade-css-styles.json';
        a.click();
        URL.revokeObjectURL(url);
        toast('Styles exported');
    }

    function saveCurrentStyle(silent = false) {
        if (!state.currentStyle) return;

        const css = state.cache.editor?.value || '';
        const styles = getStyles();
        styles[state.currentStyle] = css;
        saveStyles(styles);

        state.lastSavedContent = css;
        setDirty(false);

        if (getActiveStyle() === state.currentStyle) {
            injectCSS(css);
        }

        if (!silent) toast('Style saved');
    }

    function applyStyle() {
        if (!state.currentStyle) return;

        const css = state.cache.editor?.value || '';
        const styles = getStyles();
        styles[state.currentStyle] = css;
        saveStyles(styles);
        setActiveStyle(state.currentStyle);
        setOriginalThemeActive(false);
        injectCSS(css);

        state.lastSavedContent = css;
        setDirty(false);

        updateHeaderButton();
        refreshUI();
        toast('Style applied');
    }

    function selectOriginalTheme() {
        if (state.isDirty && state.currentStyle) {
            saveCurrentStyle(true);
        }

        state.currentStyle = null;
        setDirty(false);
        refreshUI();
    }

    function selectStyle(name) {
        if (state.isDirty && state.currentStyle) {
            saveCurrentStyle(true);
        }

        state.currentStyle = name;
        const styles = getStyles();
        state.lastSavedContent = styles[name] || '';
        setDirty(false);
        refreshUI();
    }

function refreshUI() {
    const styles = getStyles();
    const active = getActiveStyle();
    const favorites = getFavorites();
    const isOriginal = isOriginalThemeActive();
    const list = state.cache.styleList || $('#css-style-list');

    if (!list) return;

    list.innerHTML = '';

    const editorContainer = $('#css-editor-container');
    const emptyState = $('#css-empty-state');
    const originalThemeState = $('#css-original-theme-state');
    const featuredPreview = $('#css-featured-preview');

    let styleNames = Object.keys(styles);

    if (state.searchQuery) {
        styleNames = styleNames.filter(name =>
            name.toLowerCase().includes(state.searchQuery)
        );
    }

    const fragment = document.createDocumentFragment();

    const isOriginalActive = isOriginalThemeActive() && !active;
    const originalItem = createOriginalThemeItem(isOriginalActive);
    fragment.appendChild(originalItem);

    // Add Featured Themes Section
    const filteredFeatured = FEATURED_THEMES.filter(t =>
        !state.searchQuery || t.name.toLowerCase().includes(state.searchQuery)
    );

    if (filteredFeatured.length > 0) {
        const featuredLabel = document.createElement('div');
        featuredLabel.className = 'section-label';
        featuredLabel.innerHTML = 'Featured Themes';
        fragment.appendChild(featuredLabel);

        filteredFeatured.forEach(theme => {
            const item = createFeaturedItem(theme, active);
            fragment.appendChild(item);
        });
    }

    // Determine what to show in editor panel
    const isFeaturedSelected = state.selectedFeatured != null;
    const isFeaturedActive = active?.startsWith('__featured__');

    if (isFeaturedSelected) {
        if (editorContainer) editorContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        if (originalThemeState) originalThemeState.style.display = 'none';
        if (featuredPreview) {
            featuredPreview.style.display = 'flex';
            updateFeaturedPreview(state.selectedFeatured);
        }
    } else if (Object.keys(styles).length === 0 && state.currentStyle === null) {
        if (editorContainer) editorContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        if (originalThemeState) originalThemeState.style.display = 'none';
        if (featuredPreview) featuredPreview.style.display = 'none';
    } else if (state.currentStyle === null) {
        if (editorContainer) editorContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
        if (originalThemeState) originalThemeState.style.display = 'flex';
        if (featuredPreview) featuredPreview.style.display = 'none';
    } else {
        if (editorContainer) editorContainer.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';
        if (originalThemeState) originalThemeState.style.display = 'none';
        if (featuredPreview) featuredPreview.style.display = 'none';
    }

    if (!state.currentStyle && !isFeaturedSelected && styleNames.length > 0 && !isOriginal) {
        state.currentStyle = styleNames[0] || Object.keys(styles)[0];
        state.lastSavedContent = styles[state.currentStyle] || '';
    }

    if (styleNames.length === 0 && state.searchQuery && filteredFeatured.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No styles match your search';
        fragment.appendChild(noResults);
        list.appendChild(fragment);
        return;
    }

    const favoriteStyles = styleNames.filter(n => favorites.includes(n)).sort();
    const regularStyles = styleNames.filter(n => !favorites.includes(n)).sort();

    if (favoriteStyles.length > 0) {
        const label = document.createElement('div');
        label.className = 'section-label';
        label.textContent = 'Favorites';
        fragment.appendChild(label);

        favoriteStyles.forEach(name => {
            const item = createStyleItem(name, active, true);
            fragment.appendChild(item);
        });
    }

    if (regularStyles.length > 0) {
        if (favoriteStyles.length > 0 || filteredFeatured.length > 0) {
            const label = document.createElement('div');
            label.className = 'section-label';
            label.textContent = 'My Styles';
            fragment.appendChild(label);
        }

        regularStyles.forEach(name => {
            const item = createStyleItem(name, active, false);
            fragment.appendChild(item);
        });
    }

    list.appendChild(fragment);

    const title = $('#css-editor-title');
    if (title && !isFeaturedSelected) {
        title.textContent = state.currentStyle || 'Original Theme';
    }

    if (state.cache.editor && state.currentStyle && !isFeaturedSelected) {
        state.cache.editor.value = styles[state.currentStyle] || '';
    }

    updateDirtyIndicator();
    updateLineCount();
}

function createFeaturedItem(theme, active) {
    const item = document.createElement('div');
    item.className = 'featured-item';
    item.dataset.featuredName = theme.name;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    if (active === `__featured__${theme.name}`) {
        item.classList.add('active');
    }
    if (state.selectedFeatured === theme.name) {
        item.classList.add('selected');
    }

    item.innerHTML = `
        <div class="featured-header">
            <span class="featured-name">${escapeHtml(theme.name)}</span>
            <span class="featured-badge">Featured</span>
            ${active === `__featured__${theme.name}` ? '<span class="active-dot"></span>' : ''}
        </div>
        <span class="featured-author">by ${escapeHtml(theme.author)}</span>
        <span class="featured-desc">${escapeHtml(theme.description)}</span>
    `;

    return item;
}

function updateFeaturedPreview(themeName) {
    const theme = getFeaturedTheme(themeName);
    if (!theme) return;

    const preview = $('#css-featured-preview');
    if (!preview) return;

    const lineCount = theme.css.split('\n').length;

    preview.innerHTML = `
        <div class="featured-preview-inner">
            <div class="featured-preview-header">
                <div class="featured-preview-title">${escapeHtml(theme.name)}</div>
                <div class="featured-preview-meta">
                    <span>${escapeHtml(theme.author)}</span>
                    <span>${lineCount} lines</span>
                </div>
            </div>
            <div class="featured-preview-desc">${escapeHtml(theme.description)}</div>
            <div class="featured-preview-css">${escapeHtml(theme.css)}</div>
        </div>
        <div class="featured-preview-actions">
            <button class="css-btn css-btn-primary" data-action="apply-featured" data-theme="${escapeHtml(theme.name)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Apply Theme
            </button>
            <button class="css-btn" data-action="copy-featured" data-theme="${escapeHtml(theme.name)}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy to My Styles
            </button>
        </div>
    `;
}

function createOriginalThemeItem(isActive) {
    const item = document.createElement('div');
    item.className = 'style-item original-theme-item';
    item.dataset.originalTheme = 'true';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    const isOriginal = isOriginalThemeActive();
    const noActiveStyle = !getActiveStyle();

    if (isOriginal && noActiveStyle) {
        item.classList.add('active');
    }
    if (state.currentStyle === null) {
        item.classList.add('selected');
    }

    item.innerHTML = `
        <span class="original-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </span>
        <span class="name">Original Theme</span>
        ${(isOriginal && noActiveStyle) ? '<span class="active-dot"></span>' : ''}
    `;

    return item;
}
function createStyleItem(name, active, isFav) {
    const item = document.createElement('div');
    item.className = 'style-item';
    item.dataset.styleName = name;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');

    if (name === state.currentStyle) item.classList.add('selected');
    if (name === active) item.classList.add('active');

    const starIcon = isFav
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

    item.innerHTML = `
        <button class="favorite-btn ${isFav ? 'is-favorite' : ''}" data-style-name="${escapeHtml(name)}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" type="button">
            ${starIcon}
        </button>
        <span class="name">${escapeHtml(name)}</span>
        ${name === active ? '<span class="active-dot"></span>' : ''}
    `;

    return item;
}
    function addHeaderButton() {
        let attempts = 0;
        const maxAttempts = MAX_HEADER_CHECK_TIME / HEADER_CHECK_INTERVAL;

        const intervalId = addManagedInterval(() => {
            attempts++;

            if (attempts >= maxAttempts) {
                clearManagedInterval(intervalId);
                return;
            }

            const header = $('.h-14.shrink-0.px-2.w-full.flex.items-center.justify-between');
            if (!header) return;

            const buttonContainer = header.querySelector('.flex.items-center.h-full.space-x-2');
            if (!buttonContainer) return;

            if ($('#css-injector-btn')) {
                clearManagedInterval(intervalId);
                return;
            }

            clearManagedInterval(intervalId);

            const isOriginal = isOriginalThemeActive();
            const btn = document.createElement('button');
            btn.id = 'css-injector-btn';
            btn.className = `rounded-xl border flex flex-row items-center justify-center gap-2 ${isOriginal ? 'border-gray-700/50 bg-green-600 hover:bg-green-700' : 'border-purple-700/50 bg-purple-600 hover:bg-purple-700'} px-4 py-1.5 text-sm font-medium text-white transition-colors`;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                <span>CSS</span>
            `;

            const firstBtn = buttonContainer.querySelector('button');
            buttonContainer.insertBefore(btn, firstBtn);

            addManagedListener(btn, 'click', () => {
                refreshUI();
                state.cache.overlay?.classList.add('open');
            });
        }, HEADER_CHECK_INTERVAL);
    }

    function setupNavigationObserver() {
        addManagedObserver(document.body, (mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.removedNodes) {
                    if (node.id === 'css-injector-btn' ||
                        (node.nodeType === 1 && node.querySelector?.('#css-injector-btn'))) {
                        addManagedTimeout(addHeaderButton, 100);
                        return;
                    }
                }
            }
        }, { childList: true, subtree: true });
    }

function init() {
    if (state.initialized) return;

    injectBaseStyles();
    createModal();
    addHeaderButton();
    setupNavigationObserver();

    const styles = getStyles();
    const isOriginal = isOriginalThemeActive();
    const active = getActiveStyle();

    console.log('[CSS Injector] Initializing...');
    console.log('[CSS Injector] Active style:', active);
    console.log('[CSS Injector] Is original:', isOriginal);

    // Apply theme on load
    if (isOriginal) {
        injectCSS('');
        console.log('[CSS Injector] Original theme active');
    } else if (active) {
        if (active.startsWith('__featured__')) {
            // Featured theme
            const featuredName = active.replace('__featured__', '');
            const theme = FEATURED_THEMES.find(t => t.name === featuredName);
            if (theme) {
                injectCSS(theme.css);
                console.log('[CSS Injector] ✅ Applied featured theme:', featuredName);
            } else {
                console.warn('[CSS Injector] Featured theme not found:', featuredName);
                injectCSS('');
            }
        } else if (styles[active]) {
            // Custom theme
            injectCSS(styles[active]);
            console.log('[CSS Injector] ✅ Applied custom theme:', active);
        } else {
            console.warn('[CSS Injector] Active style not found:', active);
            injectCSS('');
        }
    } else {
        console.log('[CSS Injector] No active theme');
        injectCSS('');
    }

    state.initialized = true;

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    console.log('[CSS Injector] ✅ Initialization complete');

}
console.log('[CSS Injector] Line FINAL: Calling init...');
        init();
        console.log('[CSS Injector] ========== SCRIPT END ==========');

    } catch (error) {
        console.error('[CSS Injector] ❌ CRITICAL ERROR:', error);
        console.error('[CSS Injector] Error stack:', error.stack);
        alert('CSS Injector failed to load!\n\n' + error.message + '\n\nCheck console for details.');
    }

})();