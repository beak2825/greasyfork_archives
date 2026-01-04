// ==UserScript==
// @name         RGBTorn (v2.62)
// @namespace    http://tampermonkey.net/
// @version      2.62
// @description  RGBTorn. 2.62- patched with more comprehensive heading class search, exceptions added. Emoji (WIP). Responsive buttons
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551759/RGBTorn%20%28v262%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551759/RGBTorn%20%28v262%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* --------------------
     Default settings
     -------------------- */
  const defaults = {
    text: {
      scheme: 'vivid',       // vivid | pastel | dark | light
      speed: 30,             // seconds
      brightness: 1,         // multiplier
      saturation: 1,         // multiplier
      glow: true
    },
    background: {
      scheme: 'vivid',
      speed: 12,             // seconds
      opacity: 0.35,         // whole overlay opacity
      blend: 'overlay',      // overlay | screen | multiply | lighten | soft-light
      position: 'behind'     // 'behind' or 'over' (behind = tries to sit under content, over = on top)
    },
    visible: true
  };

 const SCHEMES = {
 vivid: ['red','orange','yellow','green','cyan','violet','red','orange','yellow','green','cyan','violet','red'],
pastel: ['#ffb3ba','#ffdfba','#ffffba','#baffc9','#bae1ff','#e1baff','#ffb3ba'],
dark: ['#ff4d4d','#ff944d','#ffff66','#66ff66','#66ffff','#b366ff','#ff4d4d'],
light: ['#ff6666','#ffb366','#ffff99','#99ff99','#99ffff','#cc99ff','#ff6666'],

// New ones
poison: ['#6a0dad','#32cd32','#39ff14','#6a0dad'],
sunset: ['#ff4500','#ff6a6a','#ff1493','#8a2be2'],
ocean: ['#20b2aa','#00ced1','#1e90ff','#000080'],
fire: ['#ff0000','#ff7f00','#ffff00','#ffffff'],
candy: ['#ff69b4','#dda0dd','#7fffd4','#98ff98'],
neon: ['#ff00ff','#39ff14','#00ffff','#ff00ff'],
royal: ['#6a0dad','#4b0082','#ffd700'],
bloodlust: ['#8b0000','#b22222','#000000'],

// Holiday / seasonal themes
jollyholly: ['#ff0000','#00ff00','#ffffff','#ffcccc'], // Christmas-y, festive
spookyshadows: ['#000000','#4b0082','#8b0000','#ff8c00'], // Halloween, dark and eerie
frostedpine: ['#e0f7fa','#a7ffeb','#00bfa5','#004d40'], // Winter/Christmas cold greens & blues
pumpkinspice: ['#ff7518','#ffb347','#8b4513','#f5deb3'], // Halloween autumnal vibes
candycane: ['#ff0000','#ffffff','#ffcccc','#ffe6e6'], // Sweet Christmas stripes

// Extra fun themes
aurora: ['#ff00ff','#00ffff','#00ff00','#ff4500'], // Northern Lights inspired
sunriseblush: ['#ffb6c1','#ff7f50','#ffd700','#ffa07a'], // Soft morning hues
volcanic: ['#ff4500','#ff6347','#8b0000','#4b0082'], // Hot molten lava feel
moonlitnight: ['#191970','#000080','#483d8b','#708090'], // Night sky vibes
tropicalrain: ['#00fa9a','#00ff7f','#7fffd4','#00ced1'], // Fresh tropical feel
galactic: ['#8a2be2','#4b0082','#00ffff','#ff1493'], // Spacey, neon galaxy feel
strawberryfields: ['#ff007f','#ff66a3','#ffb6c1','#ffe6f0'], // Sweet berry tones

};


  // storage
  let settings = JSON.parse(localStorage.getItem('rgbtorn_settings_v2')) || defaults;

  /* --------------------
     Helpers
     -------------------- */
  function saveSettings() {
    localStorage.setItem('rgbtorn_settings_v2', JSON.stringify(settings));
  }

function cssGradientFromScheme(schemeName) {
  const arr = SCHEMES[schemeName] || SCHEMES.vivid;
  // To ensure smooth blending at the edges, add an interpolated midpoint
  const first = arr[0];
  const last = arr[arr.length - 1];
  // Use average color between first and last for seamless wrap-around
  const avgColor = averageColor(first, last);
  const extended = [last, ...arr, first, avgColor];
  return `linear-gradient(270deg, ${extended.join(',')})`;
}

// Helper to blend two colors smoothly (hex or named)
function averageColor(c1, c2) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = c1;
  const color1 = ctx.fillStyle;
  ctx.fillStyle = c2;
  const color2 = ctx.fillStyle;

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [
      parseInt(m[1], 16),
      parseInt(m[2], 16),
      parseInt(m[3], 16)
    ] : [0, 0, 0];
  }

  function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(x => {
      const h = x.toString(16);
      return h.length === 1 ? '0' + h : h;
    }).join('')}`;
  }

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  return rgbToHex(
    Math.round((r1 + r2) / 2),
    Math.round((g1 + g2) / 2),
    Math.round((b1 + b2) / 2)
  );
}


  /* --------------------
     Overlay element
     -------------------- */
  let overlay = null;
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.getElementById('rgbtorn-overlay-v2');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'rgbtorn-overlay-v2';
        // insert as first child so it's before most other nodes (we control stacking via z-index)
        document.body.insertBefore(overlay, document.body.firstChild);
      }
    }
  }

    /* --------------------
   Ensure emoji overlay exists
   -------------------- */
let emojiOverlay = null;
function ensureEmojiOverlay() {
  if (!emojiOverlay) {
    emojiOverlay = document.getElementById('rgbtorn-emoji-overlay');
    if (!emojiOverlay) {
      emojiOverlay = document.createElement('div');
      emojiOverlay.id = 'rgbtorn-emoji-overlay';
      emojiOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 1; /* above rainbow overlay, below content */
        overflow: hidden;
      `;
      document.body.insertBefore(emojiOverlay, document.body.firstChild.nextSibling);
    }
  }
}

/* --------------------
   Extend defaults for emoji overlay
   -------------------- */
if (!settings.emojiOverlay) {
  settings.emojiOverlay = {
    enabled: false,
    type: 'money',  // money | snow | cobwebs | hearts | stars
    density: 30,    // number of emojis
    speed: 1.5      // pixels per frame
  };
}

  /* --------------------
     Stacking control (for 'behind' mode)
     -------------------- */
  const stackSelector = '#mainContainer, .content-wrapper, #react-root, .main-layout';
  function adoptStackingAboveOverlay() {
    const els = Array.from(document.querySelectorAll(stackSelector));
    els.forEach(el => {
      try {
        if (el.dataset.rgbOrigPos === undefined) {
          el.dataset.rgbOrigPos = el.style.position || '';
          el.dataset.rgbOrigZ = el.style.zIndex || '';
        }
        const computed = window.getComputedStyle(el);
        if (computed.position === 'static') el.style.position = 'relative';
        el.style.zIndex = 1;
      } catch (e) {/* ignore */}
    });
  }
  function revertStackingChanges() {
    const els = Array.from(document.querySelectorAll(stackSelector));
    els.forEach(el => {
      try {
        if (el.dataset.rgbOrigPos !== undefined) {
          el.style.position = el.dataset.rgbOrigPos;
          el.style.zIndex = el.dataset.rgbOrigZ;
          delete el.dataset.rgbOrigPos;
          delete el.dataset.rgbOrigZ;
        }
      } catch (e) {/* ignore */}
    });
  }

  /* --------------------
     Apply styles (live preview + save)
     -------------------- */
  function applyStyles() {
    ensureOverlay();

    // remove old style tag then recreate
    const existing = document.getElementById('rgbtorn-style-v2');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'rgbtorn-style-v2';

    // Title gradient CSS
    const titleGradient = cssGradientFromScheme(settings.text.scheme);
    const textAnimSec = Math.max(1, Number(settings.text.speed) || defaults.text.speed);
    const textFilter = `brightness(${settings.text.brightness}) saturate(${settings.text.saturation})`;
    const glowCss = settings.text.glow ? 'text-shadow: 0 0 8px rgba(255,255,255,0.6);' : 'text-shadow: none;';

    style.textContent = `
      @keyframes rgbtornTextFlow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
      @keyframes rgbtornBgFlow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
    /* Titles and headings */
.content-title h1, .content-title h2, .content-title h3, .content-title h4, .content-title h5, .content-title h6,.newspaper-header h1, .newspaper-header h2, .newspaper-header h3, .newspaper-header h4,
.newspaper-header h5, .newspaper-header h6,
h1[class*="title"]:not(.title___XfwKa),
h2[class*="title"]:not(.title___XfwKa),
h3[class*="title"]:not(.title___XfwKa),
h4[class*="title"]:not(.title___XfwKa),
h5[class*="title"]:not(.title___XfwKa),
h6[class*="title"]:not(.title___XfwKa),
h1[class^="heading___"],
h2[class^="heading___"],
h3[class^="heading___"],
h4[class^="heading___"],

h6[class^="heading___"] {
    background: ${titleGradient};
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    color: transparent;
    animation: rgbtornTextFlow ${textAnimSec}s linear infinite;
    -webkit-animation: rgbtornTextFlow ${textAnimSec}s linear infinite;
    -moz-animation: rgbtornTextFlow ${textAnimSec}s linear infinite;
    filter: ${textFilter};
    -webkit-filter: ${textFilter};
    ${glowCss}
}


      /* keep the overlay element basic (dynamic properties below will be applied inline) */
      #rgbtorn-overlay-v2 {
        position: fixed;
        inset: 0;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background-size: 400% 400%;
        animation: rgbtornBgFlow ${Math.max(2, Number(settings.background.speed) || defaults.background.speed)}s linear infinite;
        -webkit-animation: rgbtornBgFlow ${Math.max(2, Number(settings.background.speed) || defaults.background.speed)}s linear infinite;
        -moz-animation: rgbtornBgFlow ${Math.max(2, Number(settings.background.speed) || defaults.background.speed)}s linear infinite;
        transition: opacity 220ms linear;
        -webkit-transition: opacity 220ms linear;
        -moz-transition: opacity 220ms linear;
      }
    `;
    document.head.appendChild(style);

    // configure overlay inline style
    overlay.style.backgroundImage = cssGradientFromScheme(settings.background.scheme);
    overlay.style.mixBlendMode = settings.background.blend;
    overlay.style.opacity = settings.background.opacity;
    if (settings.background.position === 'behind') {
      overlay.style.zIndex = 0;
      adoptStackingAboveOverlay();
    } else {
      overlay.style.zIndex = 9998;
      revertStackingChanges();
    }

    overlay.style.display = settings.visible ? 'block' : 'none';
  }
/* --------------------
   Emoji overlay logic
   -------------------- */
let emojis = [];

function createEmojis() {
  ensureEmojiOverlay();
  emojiOverlay.innerHTML = '';

  if (!settings.emojiOverlay.enabled) return;

  const types = {
    money: '💸',
    snow: '❄️',
    cobwebs: '🕸️',
    hearts: '❤️',
    stars: '⭐'
  };

  const emoji = types[settings.emojiOverlay.type] || '✨';
  const count = settings.emojiOverlay.density || 30;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = emoji;
    span.className = 'rgbtorn-emoji';
    span.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      font-size: ${Math.random() * 20 + 10}px;
      opacity: ${Math.random() * 0.8 + 0.2};
      transform: translate(${Math.random() * window.innerWidth}px, ${Math.random() * window.innerHeight}px);
      pointer-events: none;
      user-select: none;
    `;
    span.dataset.x = Math.random() * window.innerWidth;
    span.dataset.y = Math.random() * window.innerHeight;
    span.dataset.r = Math.random() * 360;
    emojiOverlay.appendChild(span);
  }
}


function animateEmojis() {
  if (!settings.emojiOverlay.enabled || !emojiOverlay) return;

  const speed = settings.emojiOverlay.speed || 1.5;
  const emojis = emojiOverlay.querySelectorAll('.rgbtorn-emoji');
  const screenHeight = window.innerHeight;

  function loop() {
    if (!settings.emojiOverlay.enabled) return;

    emojis.forEach(emoji => {
      const y = parseFloat(emoji.dataset.y) + speed;
      emoji.dataset.y = y;
      emoji.style.transform = `translate(${emoji.dataset.x}px, ${y}px) rotate(${emoji.dataset.r}deg)`;

      // reset if past bottom
      if (y > screenHeight + 50) {
        // reset to top at random X, Y, rotation, and size
        emoji.dataset.x = Math.random() * window.innerWidth;
        emoji.dataset.y = -Math.random() * 200;
        emoji.dataset.r = Math.random() * 360;
        emoji.style.transform = `translate(${emoji.dataset.x}px, ${emoji.dataset.y}px) rotate(${emoji.dataset.r}deg)`;
      }
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}


  /* --------------------
     Build settings panel (items page only)
     Live preview on input; Save persists to localStorage
     Collapsible via toggle button; Save & Reset
     -------------------- */
function buildPanel() {
  if (!location.pathname.includes('item.php')) return; // items page only
  if (document.getElementById('rgbtorn-panel')) return;

  ensureOverlay();

  // --- Create overlay ---
  const overlay = document.createElement('div');
  overlay.id = 'rgbtorn-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    display: none; z-index: 10000;
  `;
  document.body.appendChild(overlay);

  // --- Panel wrapper ---
  const panel = document.createElement('div');
  panel.id = 'rgbtorn-panel';
  panel.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 90%; max-width: 320px; max-height: 80%;
    background: rgba(12,12,12,0.96); color: #fff;
    padding: 10px 12px; border-radius: 10px;
    z-index: 10001; font-family: Arial, sans-serif; font-size: 13px;
    display: none; overflow: hidden;
    box-shadow: 0 0 12px rgba(0,0,0,0.6);
  `;

  // --- Scrollable inner content ---
  const inner = document.createElement('div');
  inner.id = 'rgbtorn-panel-inner';
  inner.style.cssText = `
    overflow-y: auto;
    max-height: calc(80vh - 60px);
    padding-right: 6px;
  `;

  // --- Panel header with close button ---
  const header = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <strong style="font-size:15px">🌈 RGBTorn</strong>
      <button id="rgbtorn-close" style="background:none;border:none;color:#fff;font-size:16px;cursor:pointer;">✖️</button>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
      <button id="rgbtorn-save-btn" style="flex:1; color:#fff; background:#222; border:1px solid #444; border-radius:4px; padding:5px 0; cursor:pointer; transition:all 0.15s ease;">Save</button>
      <button id="rgbtorn-reset-btn" style="flex:1; color:#fff; background:#222; border:1px solid #444; border-radius:4px; padding:5px 0; cursor:pointer; transition:all 0.15s ease;">Reset</button>
    </div>
    <div id="rgbtorn-feedback" style="font-size:12px; text-align:center; min-height:16px; opacity:0; transition:opacity 0.3s ease;"></div>
  `;

  // --- Settings sections ---
  const content = `
    <div style="margin-bottom:6px"><strong>Titles</strong></div>
    <label style="display:block;margin-bottom:6px">Scheme:
      <select id="rgbtorn-text-scheme" style="width:100%">
        <option value="vivid">Vivid</option>
        <option value="pastel">Pastel</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="poison">Poison (purple/green)</option>
        <option value="sunset">Sunset (orange/pink/purple)</option>
        <option value="ocean">Ocean (teal/blue)</option>
        <option value="fire">Fire (red/orange/yellow)</option>
        <option value="candy">Candy (pink/pastel)</option>
        <option value="neon">Neon (bright)</option>
        <option value="royal">Royal (purple/gold)</option>
        <option value="bloodlust">Bloodlust (red/black)</option>
        <option value="jollyholly">Jolly Holly (Christmas)</option>
        <option value="spookyshadows">Spooky Shadows (Halloween)</option>
        <option value="frostedpine">Frosted Pine (winter)</option>
        <option value="pumpkinspice">Pumpkin Spice (Halloween)</option>
        <option value="candycane">Candy Cane (Christmas)</option>
        <option value="aurora">Aurora (Northern Lights)</option>
        <option value="sunriseblush">Sunrise Blush</option>
        <option value="volcanic">Volcanic</option>
        <option value="moonlitnight">Moonlit Night</option>
        <option value="tropicalrain">Tropical Rain</option>
        <option value="galactic">Galactic</option>
        <option value="strawberryfields">Strawberry Fields</option>
      </select>
    </label>
    <label style="display:block;margin-bottom:6px">Text Speed:
      <input id="rgbtorn-text-speed" type="number" min="1" max="60" style="width:72px"> s
    </label>
    <label style="display:block;margin-bottom:6px">Brightness:
      <input id="rgbtorn-text-bright" type="range" min="0.5" max="2" step="0.1" style="width:140px">
    </label>
    <label style="display:block;margin-bottom:6px">Saturation:
      <input id="rgbtorn-text-sat" type="range" min="0.5" max="2" step="0.1" style="width:140px">
    </label>
    <label style="display:block;margin-bottom:6px"><input id="rgbtorn-text-glow" type="checkbox"> Glow</label>

    <hr style="border:0;border-top:1px solid rgba(255,255,255,0.06);margin:8px 0">

    <div style="margin-bottom:6px"><strong>Background</strong></div>
    <label style="display:block;margin-bottom:6px">Scheme:
      <select id="rgbtorn-bg-scheme" style="width:100%">
        <option value="vivid">Vivid</option>
        <option value="pastel">Pastel</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="poison">Poison (purple/green)</option>
        <option value="sunset">Sunset (orange/pink/purple)</option>
        <option value="ocean">Ocean (teal/blue)</option>
        <option value="fire">Fire (red/orange/yellow)</option>
        <option value="candy">Candy (pink/pastel)</option>
        <option value="neon">Neon (bright)</option>
        <option value="royal">Royal (purple/gold)</option>
        <option value="bloodlust">Bloodlust (red/black)</option>
        <option value="jollyholly">Jolly Holly (Christmas)</option>
        <option value="spookyshadows">Spooky Shadows (Halloween)</option>
        <option value="frostedpine">Frosted Pine (winter)</option>
        <option value="pumpkinspice">Pumpkin Spice (Halloween)</option>
        <option value="candycane">Candy Cane (Christmas)</option>
        <option value="aurora">Aurora (Northern Lights)</option>
        <option value="sunriseblush">Sunrise Blush</option>
        <option value="volcanic">Volcanic</option>
        <option value="moonlitnight">Moonlit Night</option>
        <option value="tropicalrain">Tropical Rain</option>
        <option value="galactic">Galactic</option>
        <option value="strawberryfields">Strawberry Fields</option>
      </select>
    </label>
    <label style="display:block;margin-bottom:6px">BG Speed:
      <input id="rgbtorn-bg-speed" type="number" min="1" max="60" style="width:72px"> s
    </label>
    <label style="display:block;margin-bottom:6px">Opacity:
      <input id="rgbtorn-bg-opacity" type="range" min="0" max="1" step="0.05" style="width:140px">
    </label>
    <label style="display:block;margin-bottom:6px">Blend Mode:
      <select id="rgbtorn-bg-blend" style="width:100%">
        <option value="overlay">overlay</option>
        <option value="screen">screen</option>
        <option value="multiply">multiply</option>
        <option value="lighten">lighten</option>
        <option value="soft-light">soft-light</option>
      </select>
    </label>
    <label style="display:block;margin-bottom:6px">Position:
      <select id="rgbtorn-bg-pos" style="width:100%">
        <option value="behind">behind (try to sit under content)</option>
        <option value="over">over (on top of content)</option>
      </select>
    </label>

    <div style="font-size:11px;opacity:0.85;margin-top:8px">Changes preview as you move controls. Save to persist.</div>
  `;

  inner.innerHTML = content;
  panel.innerHTML = header;
  panel.appendChild(inner);
  document.body.appendChild(panel);

  (function() {
  'use strict';

  function addSidebarButton() {
    const sidebar = document.querySelector('#sidebar, .sidebar, #sidebar-root');
    if (!sidebar || document.getElementById('rgbtorn-sidebar-btn')) return;

    // Create the button
    const btn = document.createElement('div');
    btn.id = 'rgbtorn-sidebar-btn';
    btn.className = 'menu-item'; // Torn’s default sidebar item class
    btn.style.cssText = `
      cursor: pointer; display: flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 6px; color: #fff; font-weight: 600;
      transition: background 0.2s; margin: 4px 0;
    `;
    btn.innerHTML = '🌈 <span>RGBTorn</span>';

    // Click event (toggles panel/overlay)
    btn.addEventListener('click', () => {
      const panel = document.getElementById('rgbtorn-panel');
      const overlay = document.getElementById('rgbtorn-overlay-v2');
      if (!panel || !overlay) return;
      const visible = panel.style.display === 'block';
      panel.style.display = visible ? 'none' : 'block';
      overlay.style.display = visible ? 'none' : 'block';
    });

    // Insert at top of sidebar (after Torn logo if it exists)
    const firstMenuItem = sidebar.querySelector('.menu-item, ul li, div');
    if (firstMenuItem) {
      sidebar.insertBefore(btn, firstMenuItem);
    } else {
      sidebar.prepend(btn);
    }
  }

  // Watch for sidebar to appear and keep it persistent
  const obs = new MutationObserver(() => {
    const sidebar = document.querySelector('#sidebar, .sidebar, #sidebar-root');
    if (sidebar && !document.getElementById('rgbtorn-sidebar-btn')) {
      addSidebarButton();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });

  // Attempt initial insertion
  addSidebarButton();
})();

  // --- Populate and attach events ---
  (id => document.getElementById(id).value = settings.text.scheme)('rgbtorn-text-scheme');
  (id => document.getElementById(id).value = settings.text.speed)('rgbtorn-text-speed');
  (id => document.getElementById(id).value = settings.text.brightness)('rgbtorn-text-bright');
  (id => document.getElementById(id).value = settings.text.saturation)('rgbtorn-text-sat');
  document.getElementById('rgbtorn-text-glow').checked = !!settings.text.glow;

  (id => document.getElementById(id).value = settings.background.scheme)('rgbtorn-bg-scheme');
  (id => document.getElementById(id).value = settings.background.speed)('rgbtorn-bg-speed');
  (id => document.getElementById(id).value = settings.background.opacity)('rgbtorn-bg-opacity');
  (id => document.getElementById(id).value = settings.background.blend)('rgbtorn-bg-blend');
  (id => document.getElementById(id).value = settings.background.position)('rgbtorn-bg-pos');

  function previewUpdate() {
    settings.text.scheme = document.getElementById('rgbtorn-text-scheme').value;
    settings.text.speed = Number(document.getElementById('rgbtorn-text-speed').value) || defaults.text.speed;
    settings.text.brightness = Number(document.getElementById('rgbtorn-text-bright').value) || defaults.text.brightness;
    settings.text.saturation = Number(document.getElementById('rgbtorn-text-sat').value) || defaults.text.saturation;
    settings.text.glow = !!document.getElementById('rgbtorn-text-glow').checked;

    settings.background.scheme = document.getElementById('rgbtorn-bg-scheme').value;
    settings.background.speed = Number(document.getElementById('rgbtorn-bg-speed').value) || defaults.background.speed;
    settings.background.opacity = Number(document.getElementById('rgbtorn-bg-opacity').value);
    settings.background.blend = document.getElementById('rgbtorn-bg-blend').value;
    settings.background.position = document.getElementById('rgbtorn-bg-pos').value;

    applyStyles();
  }

  const inputs = panel.querySelectorAll('input, select');
  inputs.forEach(inp => inp.addEventListener('input', previewUpdate));

  const feedback = document.getElementById('rgbtorn-feedback');
  const saveBtn = document.getElementById('rgbtorn-save-btn');
  const resetBtn = document.getElementById('rgbtorn-reset-btn');

  function showFeedback(text, color) {
    feedback.textContent = text;
    feedback.style.color = color;
    feedback.style.opacity = '1';
    setTimeout(() => feedback.style.opacity = '0', 1000);
  }

  function buttonFlash(btn, color) {
    btn.style.transform = 'scale(0.96)';
    btn.style.background = color;
    setTimeout(() => {
      btn.style.transform = '';
      btn.style.background = '#222';
    }, 200);
  }

  saveBtn.addEventListener('click', () => {
    saveSettings();
    buttonFlash(saveBtn, '#228B22');
    showFeedback('Saved!', '#32CD32');
  });

  resetBtn.addEventListener('click', () => {
    settings = JSON.parse(JSON.stringify(defaults));
    document.getElementById('rgbtorn-text-scheme').value = settings.text.scheme;
    document.getElementById('rgbtorn-text-speed').value = settings.text.speed;
    document.getElementById('rgbtorn-text-bright').value = settings.text.brightness;
    document.getElementById('rgbtorn-text-sat').value = settings.text.saturation;
    document.getElementById('rgbtorn-text-glow').checked = settings.text.glow;
    document.getElementById('rgbtorn-bg-scheme').value = settings.background.scheme;
    document.getElementById('rgbtorn-bg-speed').value = settings.background.speed;
    document.getElementById('rgbtorn-bg-opacity').value = settings.background.opacity;
    document.getElementById('rgbtorn-bg-blend').value = settings.background.blend;
    document.getElementById('rgbtorn-bg-pos').value = settings.background.position;
    applyStyles();
    saveSettings();
    buttonFlash(resetBtn, '#8B0000');
    showFeedback('Reset!', '#FF5555');
  });

  previewUpdate();
  extendPanelWithEmojiOptions(panel);
}


/* --------------------
   Extend settings panel with emoji controls
   -------------------- */
function extendPanelWithEmojiOptions(panel) {
  const emojiHTML = [
    '<hr style="border:0;border-top:1px solid rgba(255,255,255,0.06);margin:8px 0">',
    '<div style="margin-bottom:6px"><strong>Emoji Overlay</strong></div>',
    '<label style="display:block;margin-bottom:6px"><input id="rgbtorn-emoji-enable" type="checkbox"> Enable Overlay</label>',
    '<label style="display:block;margin-bottom:6px">Type:',
      '<select id="rgbtorn-emoji-type" style="width:100%">',
        '<option value="money">💸 Money</option>',
        '<option value="snow">❄️ Snow</option>',
        '<option value="cobwebs">🕸️ Cobwebs</option>',
        '<option value="hearts">❤️ Hearts</option>',
        '<option value="stars">⭐ Stars</option>',
      '</select>',
    '</label>',
    '<label style="display:block;margin-bottom:6px">Density:',
      '<input id="rgbtorn-emoji-density" type="number" min="5" max="200" style="width:72px">',
    '</label>',
    '<label style="display:block;margin-bottom:6px">Speed:',
      '<input id="rgbtorn-emoji-speed" type="number" min="0.1" max="5" step="0.1" style="width:72px"> px/frame',
    '</label>'
  ];
  panel.insertAdjacentHTML('beforeend', emojiHTML.join(''));

  // Populate current settings
  document.getElementById('rgbtorn-emoji-enable').checked = !!settings.emojiOverlay.enabled;
  document.getElementById('rgbtorn-emoji-type').value = settings.emojiOverlay.type;
  document.getElementById('rgbtorn-emoji-density').value = settings.emojiOverlay.density;
  document.getElementById('rgbtorn-emoji-speed').value = settings.emojiOverlay.speed;

  function emojiPreviewUpdate() {
  settings.emojiOverlay.enabled =
    document.getElementById('rgbtorn-emoji-enable').checked;
  settings.emojiOverlay.type =
    document.getElementById('rgbtorn-emoji-type').value;
  settings.emojiOverlay.density =
    Number(document.getElementById('rgbtorn-emoji-density').value) || 30;
  settings.emojiOverlay.speed =
    Number(document.getElementById('rgbtorn-emoji-speed').value) || 1.5;

  // apply instantly
  createEmojis();   // rebuild emoji elements
  animateEmojis();  // restart animation loop
}


  ['rgbtorn-emoji-enable','rgbtorn-emoji-type','rgbtorn-emoji-density','rgbtorn-emoji-speed']
    .forEach(id => document.getElementById(id).addEventListener('input', emojiPreviewUpdate));
}
// =====================
// 🌈 Rainbow Sparkle Mouse Trail
// =====================
function initRainbowTrail() {
  const numSparkles = 15; // how many sparkles on screen at once
  const sparkles = [];
  const colors = [
    '#ff0000', '#ff7f00', '#ffff00',
    '#00ff00', '#0000ff', '#4b0082', '#8b00ff'
  ];

  // create sparkles
  for (let i = 0; i < numSparkles; i++) {
    const s = document.createElement('div');
    s.className = 'rgbtorn-sparkle';
    s.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      z-index: 9999;
      mix-blend-mode: screen;
      will-change: transform, opacity;
      transition: opacity 0.3s linear;
    `;
    document.body.appendChild(s);
    sparkles.push(s);
  }

  let lastX = 0, lastY = 0, tick = 0;
  document.addEventListener('mousemove', e => {
    lastX = e.clientX;
    lastY = e.clientY;
  });

  function animate() {
    tick++;
    for (let i = 0; i < sparkles.length; i++) {
      const s = sparkles[i];
      if (!s.dataset.active) {
        // randomly activate one sparkle at mouse pos
        if (Math.random() < 0.1) {
          s.dataset.active = '1';
          s.style.opacity = '1';
          s.style.background = colors[Math.floor(Math.random() * colors.length)];
          s.x = lastX + (Math.random() - 0.5) * 20;
          s.y = lastY + (Math.random() - 0.5) * 20;
          s.life = 20 + Math.random() * 20;
        }
      } else {
        // move sparkle upward and fade
        s.life--;
        s.y -= 0.8;
        s.style.transform = `translate(${s.x}px, ${s.y}px) scale(${1 + (20 - s.life) / 40})`;
        s.style.opacity = (s.life / 40).toFixed(2);
        if (s.life <= 0) {
          s.dataset.active = '';
          s.style.opacity = '0';
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// initialize after DOM is ready
document.addEventListener('DOMContentLoaded', initRainbowTrail);

  /* --------------------
     Init
     -------------------- */
  try {
  ensureOverlay();
  applyStyles();
  buildPanel();
  overlay.style.display = settings.visible ? 'block' : 'none';

  // 🔹 Emoji overlay setup
  ensureEmojiOverlay();
  createEmojis();
  animateEmojis();

} catch (err) {
  console.error('RGBTorn init error', err);
}


})();