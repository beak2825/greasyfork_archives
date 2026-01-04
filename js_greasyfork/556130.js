// ==UserScript==
// @name         PTP Go Top & Bottom Buttons
// @namespace    PTP
// @version      1.0
// @description  Adds Go Top & Go Bottom buttons with customizable design, hover, and transparency options
// @author       mbkr
// @license GPL-3.0-or-later
// @icon        https://passthepopcorn.me/favicon.ico
// @match        *://passthepopcorn.me/*
// @downloadURL https://update.greasyfork.org/scripts/556130/PTP%20Go%20Top%20%20Bottom%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/556130/PTP%20Go%20Top%20%20Bottom%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // ================================================================================================
  // ====================================== GENERAL SETTINGS ========================================
  // ================================================================================================ //

  // Design presets (visual size/spacing philosophy)
  //   'compact'  → tight spacing, small footprint (trackers, dense UIs) (default)
  //   'modern'   → balanced spacing and size (Reddit/Discord-like)
  //   'material' → largest spacing and size (touch-friendly)
  const DESIGN = 'compact';

  // Shape of the button container
  //   'square' (default) | 'circle'
  const SHAPE = 'square';

  // Visual mode controls how button opacity behaves:
  //   'fade'       → always 40% opacity
  //   'hover'      → 40% idle → 100% on hover (default)
  //   'highlight'  → always 100% opacity
  // The selected VISUAL mode combines with transparency settings to determine the final appearance.
  const VISUAL = 'hover';

  // Scroll behavior when clicking
  //   'jump'   → instant jump to top/bottom (default)
  //   'smooth' → animated scroll
  const SCROLL_BEHAVIOR = 'jump';

  // Transparency scales the final opacity applied after VISUAL effects
  // Range: 0–100 (0 = fully transparent, 100 = fully opaque)
  const BG_TRANSPARENCY = 50; // background opacity
  const AR_TRANSPARENCY = 80; // arrow opacity

  // Edge-float behavior (show buttons only when pointer is near right-bottom area)
  // If false → buttons are always visible according to VISUAL mode
  const EDGE_FLOAT = false;
  const EDGE_FLOAT_TRIGGER_RIGHT_PX = 140; // distance from right edge to trigger visibility
  const EDGE_FLOAT_TRIGGER_BOTTOM_PX = 160; // distance from bottom edge to trigger visibility

  // Delay (ms) to absorb mouse-wheel momentum after click
  //   0–200 = light filtering, 200–400 = balanced (recommended), 400–600 = strong
  const ANTI_BOUNCE = 300;


  // ================================================================================================
  // ====================================== OVERRIDE SETTINGS =======================================
  // ================================================================================================ //

  // Set any value to override the current DESIGN preset; leave null to inherit defaults.
  const OVERRIDES = {
    right:     null, // Distance from right edge (px)
    bottom:    null, // Distance from bottom edge for lower button (px)
    gap:       null, // Vertical gap between buttons (px)
    size:      null, // Button size (width/height in px)
    radius:    null, // Corner radius (ignored if SHAPE === 'circle')
    fontRatio: null, // Arrow size ratio relative to button size (0–1)
    bg:        null, // Background color (e.g. '255,255,255' for rgb)
    fg:        null, // Arrow color (e.g. '255,255,255' for rgb)
    blur:      null, // Background blur (e.g. '8px' for frosted-glass effect)
    baseBgAlpha: null // Base background alpha before transparency multiplier (0–1)
  };


  // ================================================================================================
  // ====================================== STYLE PRESETS ==========================================
  // ================================================================================================ //

  const PRESETS = {
    compact:  { right: 6, bottom: 22, gap: 8, size: 38, radius: 6, fontRatio: 0.60, bg: '255,255,255', baseBgAlpha: 0.10, fg: '255,255,255', blur: '4px' },
    modern:   { right:10, bottom: 26, gap:10, size: 44, radius: 6, fontRatio: 0.58, bg: '255,255,255', baseBgAlpha: 0.12, fg: '255,255,255', blur: '6px' },
    material: { right:14, bottom: 24, gap:12, size: 51, radius: 6, fontRatio: 0.55, bg: '255,255,255', baseBgAlpha: 0.16, fg: '255,255,255', blur: '8px' }
  };


  // ================================================================================================
  // ====================================== INTERNAL LOGIC ==========================================
  // ================================================================================================ //

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // Resolve preset + overrides
  const P0 = PRESETS[DESIGN] || PRESETS.compact;
  const P  = {
    right:       OVERRIDES.right       ?? P0.right,
    bottom:      OVERRIDES.bottom      ?? P0.bottom,
    gap:         OVERRIDES.gap         ?? P0.gap,
    size:        OVERRIDES.size        ?? P0.size,
    radius:      OVERRIDES.radius      ?? P0.radius,
    fontRatio:   OVERRIDES.fontRatio   ?? P0.fontRatio,
    blur:        OVERRIDES.blur        ?? P0.blur,
    bg:          OVERRIDES.bg          ?? P0.bg,
    fg:          OVERRIDES.fg          ?? P0.fg,
    baseBgAlpha: OVERRIDES.baseBgAlpha ?? P0.baseBgAlpha
  };

  // ----- Apply transparency / Final colors -----
  const bgAlphaUser = clamp(BG_TRANSPARENCY, 0, 100) / 100;
  const arAlphaUser = clamp(AR_TRANSPARENCY, 0, 100) / 100;
  const BG_RGBA = `rgba(${P.bg}, ${clamp(P.baseBgAlpha * bgAlphaUser, 0, 1)})`;
  const FG_RGBA = `rgba(${P.fg}, ${clamp(arAlphaUser, 0, 1)})`;

  // ----- Idle opacity from VISUAL (fade/hover use 0.4 idle; highlight is 1.0) -----
  const idleOpacity = (VISUAL === 'highlight') ? 1.0 : 0.4;

  const computedRadius = (SHAPE === 'circle') ? (P.size / 2) : P.radius;

  // ----- Base CSS for the buttons -----
  const baseBtnCSS = `
    position: fixed;
    right: ${P.right}px;
    width: ${P.size}px;
    height: ${P.size}px;
    line-height: ${P.size}px;
    text-align: center;
    color: ${FG_RGBA};
    background: ${BG_RGBA};
    backdrop-filter: blur(${P.blur});
    border-radius: ${computedRadius}px;
    font-size: ${P.size * P.fontRatio}px;
    cursor: pointer;
    z-index: 9999;
    opacity: ${idleOpacity};
    transition: opacity 0.25s ease, background 0.25s ease, transform 0.2s ease;
    user-select: none;
    display: ${EDGE_FLOAT ? 'none' : 'block'};
  `;

  // ----- Tiny CSS so hover can win over JS updates -----
  (() => {
    const css = document.createElement('style');
    css.textContent = `
      .ptp-goto { transition: opacity .25s ease; }
      .ptp-goto:hover { opacity: 1 !important; }
    `;
    document.head.appendChild(css);
  })();

  // ----- Anti-scroll momentum after jump - Block wheel/touch/keys briefly after an instant jump -----
  const suppressMomentum = (ms) => {
    if (ms <= 0) return;
    const stop = (e) => { e.preventDefault(); e.stopImmediatePropagation(); };
    const opts = { capture: true, passive: false };
    window.addEventListener('wheel', stop, opts);
    window.addEventListener('touchmove', stop, opts);
    window.addEventListener('keydown', stop, opts);
    setTimeout(() => {
      window.removeEventListener('wheel', stop, opts);
      window.removeEventListener('touchmove', stop, opts);
      window.removeEventListener('keydown', stop, opts);
    }, ms);
  };

  // ----- Create a button -----
  const createButton = (arrow, bottomOffset, action) => {
    const b = document.createElement('div');
    b.className = 'ptp-goto';
    b.textContent = arrow;
    b.title = action === 'top' ? 'Go Top' : 'Go Bottom';
    b.style.cssText = baseBtnCSS + `bottom: ${bottomOffset}px;`;

    // ----- Hover brightening is handled via CSS; keep JS minimal -----
    if (VISUAL === 'hover') {
      // Ensure idle state when not hovered (EdgeFloat updater will also respect :hover)
      b.addEventListener('mouseleave', () => { b.style.opacity = '0.4'; });
    }

    b.onclick = () => {
      const doc = document.documentElement;
      const body = document.body;
      const maxY = Math.max(
        doc.scrollHeight, body.scrollHeight,
        doc.offsetHeight, body.offsetHeight,
        doc.clientHeight, body.clientHeight
      );
      const targetY = (action === 'top') ? 0 : (maxY - doc.clientHeight);

      if (SCROLL_BEHAVIOR === 'smooth') {
        window.scrollTo({ top: targetY, left: 0, behavior: 'smooth' });
      } else {
        suppressMomentum(ANTI_BOUNCE);
        window.scrollTo(0, targetY);
      }
    };

    return b;
  };

  // ----- Add the button to page -----
  const btnTop = createButton('▲', P.bottom + P.size + P.gap, 'top');
  const btnBottom = createButton('▼', P.bottom, 'bottom');
  document.body.appendChild(btnTop);
  document.body.appendChild(btnBottom);

  // ----- Edge-float: show near right-bottom area -----
  if (EDGE_FLOAT) {
    const updateEdgeVisibility = (e) => {
      const nearRight = (window.innerWidth - e.clientX) <= EDGE_FLOAT_TRIGGER_RIGHT_PX;
      const nearBottom = (window.innerHeight - e.clientY) <= EDGE_FLOAT_TRIGGER_BOTTOM_PX;
      const show = nearRight && nearBottom;

      const apply = (el) => {
        el.style.display = show ? 'block' : 'none';
        if (!show) return;

        if (VISUAL === 'highlight') {
          el.style.opacity = '1';
        } else if (VISUAL === 'fade') {
          el.style.opacity = '0.4';
        } else { // 'hover'
          // Let :hover take it to 1; only set idle when not hovered -----
          if (!el.matches(':hover')) el.style.opacity = '0.4';
        }
      };

      apply(btnTop);
      apply(btnBottom);
    };

    window.addEventListener('mousemove', updateEdgeVisibility, { passive: true });
  }
})();