// ==UserScript==
// @name         HalloweenTorn
// @author       Tornholio
// @namespace    https://greasyfork.org/en/users/1469540-halfg567
// @version      1.1
// @description  Halloween theme
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553354/HalloweenTorn.user.js
// @updateURL https://update.greasyfork.org/scripts/553354/HalloweenTorn.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* --------------------
     Default settings
     -------------------- */
  const defaults = {
    text: {
      speed: 30,          // seconds
      brightness: 1,      // multiplier
      saturation: 1,      // multiplier
      glow: true
    },
    background: {
      speed: 60,          // seconds - slower animation
      opacity: 0.50,      // higher opacity for bright colors
      blend: 'overlay',   // overlay blend mode like original
      position: 'behind'  // 'behind' content
    },
    emojiOverlay: {
      enabled: true,
      type: 'mixed',
      density: 25,
      speed: 0.5
    },
    visible: true
  };

  // Fixed Halloween color scheme
  const HALLOWEEN_TEXT_PULSE = ['#ff9900', '#ff6600'];
  const HALLOWEEN_BG = ['#9d00ff', '#00ff41', '#7700dd', '#39ff14', '#aa00ff', '#00ff41']; // Purple and zombie green


  // Storage - use defaults (no customization)
  let settings = JSON.parse(JSON.stringify(defaults));

  /* --------------------
     Helpers
     -------------------- */
  function saveSettings() {
    localStorage.setItem('halloweentorn_settings', JSON.stringify(settings));
  }

  function createBgGradient() {
    return `linear-gradient(270deg, ${HALLOWEEN_BG.join(',')})`;
  }

  /* --------------------
     Overlay element
     -------------------- */
  let overlay = null;
  function ensureOverlay() {
    if (!overlay) {
      overlay = document.getElementById('halloweentorn-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'halloweentorn-overlay';
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
      emojiOverlay = document.getElementById('halloweentorn-emoji-overlay');
      if (!emojiOverlay) {
        emojiOverlay = document.createElement('div');
        emojiOverlay.id = 'halloweentorn-emoji-overlay';
        emojiOverlay.style.cssText = `
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0; /* Place behind main content stack */
          overflow: hidden;
        `;
        document.body.insertBefore(emojiOverlay, document.body.firstChild);
      }
    }
  }

  /* --------------------
     Stacking control (for 'behind' mode)
     -------------------- */
  const stackSelector = '#header, .header-container-wrap, #mainContainer, .content-wrapper, #react-root, .main-layout';
  function adoptStackingAboveOverlay() {
    const els = Array.from(document.querySelectorAll(stackSelector));
    els.forEach(el => {
      try {
        if (el.dataset.htOrigPos === undefined) {
          el.dataset.htOrigPos = el.style.position || '';
          el.dataset.htOrigZ = el.style.zIndex || '';
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
        if (el.dataset.htOrigPos !== undefined) {
          el.style.position = el.dataset.htOrigPos;
          el.style.zIndex = el.dataset.htOrigZ;
          delete el.dataset.htOrigPos;
          delete el.dataset.htOrigZ;
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
    const existing = document.getElementById('halloweentorn-style');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'halloweentorn-style';

    // Fixed Halloween settings
    const textAnimSec = settings.text.speed;
    const textFilter = `brightness(${settings.text.brightness}) saturate(${settings.text.saturation})`;
    const glowCss = settings.text.glow ? 'text-shadow: 0 0 10px rgba(255,153,0,0.8), 0 0 20px rgba(255,102,0,0.6);' : 'text-shadow: none;';

    style.textContent = `
      @keyframes halloweenColorShift {
        0% { color: #ff9900; }
        50% { color: #ff6600; }
        100% { color: #ff9900; }
      }
      @keyframes halloweenBgFlow {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }

    /* Exclude header, navigation, and top banner from effects */
    header, header *,
    nav, nav *,
    .header, .header *,
    #header, #header *,
    [class*="header"] *,
    [class*="Header"] *,
    [class*="nav"] *,
    [class*="Nav"] *,
    .top-banner, .top-banner *,
    #topBanner, #topBanner *,
    [class*="banner"] *,
    [class*="Banner"] *,
    .logo, .logo *,
    #logo, #logo *,
    a[href="/index.php"] {
      animation: none !important;
      background: none !important;
      -webkit-text-fill-color: initial !important;
      color: inherit !important;
      text-shadow: none !important;
      filter: none !important;
    }

    /* Apply color shift to titles and headings only */
    .m-title15Bold___OrjuC,
    h1:not(header h1):not(nav h1):not([class*="header"] h1):not([class*="nav"] h1),
    h2:not(header h2):not(nav h2):not([class*="header"] h2):not([class*="nav"] h2),
    h3:not(header h3):not(nav h3):not([class*="header"] h3):not([class*="nav"] h3),
    h4:not(header h4):not(nav h4):not([class*="header"] h4):not([class*="nav"] h4),
    .title:not(header .title):not(nav .title):not([class*="header"] .title),
    .heading:not(header .heading):not(nav .heading):not([class*="header"] .heading),
    [class*='title']:not(header *):not(nav *):not([class*="header"] *):not([class*="nav"] *):not([class*="banner"] *) {
      animation: halloweenColorShift ${textAnimSec}s ease-in-out infinite;
      filter: ${textFilter};
      ${glowCss}
    }

    /* Exclude small text from effects to prevent blur */
    *[style*="font-size"][style*="px"] {
      animation: none !important;
      filter: none !important;
    }

    small, .small, [class*="small"],
    span:not(.title):not([class*="title"]):not(.heading):not([class*="heading"]),
    p, li, td, label, input, select, textarea {
      animation: none !important;
      text-shadow: none !important;
      filter: none !important;
    }

    /* Specific targeting for content headings */
    div[class*='___']:has(> :is(h1,h2,h3,h4,h5,h6)) > :is(h1,h2,h3,h4,h5,h6):not(header *):not(nav *):not([class*="header"] *):not([class*="nav"] *) {
      animation: halloweenColorShift ${textAnimSec}s ease-in-out infinite;
      filter: ${textFilter};
      ${glowCss}
    }
  `;

    // Background overlay
    const bgSpeed = settings.background.speed;
    const bgOpacity = settings.background.opacity;
    const bgGradient = createBgGradient();
    const zIndex = 0; // Overlays sit at z-index 0

    const overlayCSS = `
      #halloweentorn-overlay {
        position: fixed;
        inset: 0;
        z-index: ${zIndex};
        pointer-events: none;
        background: ${bgGradient};
        background-size: 300% 300%;
        animation: halloweenBgFlow ${bgSpeed}s ease infinite;
        opacity: ${bgOpacity};
        mix-blend-mode: ${settings.background.blend};
      }
    `;
    style.textContent += overlayCSS;
    document.head.appendChild(style);

    // Stacking: Main content is lifted above the overlays
    if (settings.background.position === 'behind') adoptStackingAboveOverlay();
    else revertStackingChanges();
  }

  /* --------------------
    Emoji creation & animation
    -------------------- */
  const EMOJI_SETS = {
    pumpkins: ['🎃', '🎃', '🎃', '🎃', '🎃'],
    ghosts: ['👻', '👻', '👻', '👻', '👻'],
    bats: ['🦇', '🦇', '🦇', '🦇', '🦇'],
    spiders: ['🕷️', '🕸️', '🕷️', '🕸️', '🕷️'],
    skulls: ['💀', '☠️', '💀', '☠️', '💀'],
    mixed: ['🎃', '👻', '🦇', '🕷️', '💀', '☠️', '🕸️', '🧙', '🧛', '🧟', '🍬', '🍭'],
    candy: ['🍬', '🍭', '🍫', '🍬', '🍭'],
  };

  let emojiElements = [];

  function createEmojis() {
    if (!emojiOverlay) ensureEmojiOverlay();

    // Clear any existing emojis
    while (emojiOverlay.firstChild) {
      emojiOverlay.removeChild(emojiOverlay.firstChild);
    }
    emojiElements = [];

    if (!settings.emojiOverlay.enabled) return;

    const emojiType = settings.emojiOverlay.type || 'mixed';
    const set = EMOJI_SETS[emojiType] || EMOJI_SETS.mixed;
    const density = settings.emojiOverlay.density || 25;
    const viewportWidth = window.innerWidth;

    console.log('Creating emojis with type:', emojiType, 'Set:', set); // Debug log

    for (let i = 0; i < density; i++) {
      const emoji = document.createElement('div');
      const randomEmoji = set[Math.floor(Math.random() * set.length)];
      emoji.textContent = randomEmoji;

      const size = Math.random() * 25 + 25; // 25-50px
      const initialX = Math.random() * viewportWidth;
      const initialY = -50 - Math.random() * window.innerHeight; // Spread vertically too

      emoji.style.cssText = `
        position: absolute;
        font-size: ${size}px;
        left: 0;
        top: 0;
        opacity: ${Math.random() * 0.4 + 0.6};
        pointer-events: none;
        user-select: none;
        will-change: transform;
      `;

      // Store initial position and velocity as numbers
      emoji.dataset.x = initialX;
      emoji.dataset.y = initialY;
      emoji.dataset.speed = Math.random() * 0.5 + (settings.emojiOverlay.speed || 0.5);
      emoji.dataset.drift = (Math.random() - 0.5) * 1.2; // side-to-side drift
      emoji.dataset.rotation = Math.random() * 360;
      emoji.dataset.rotationSpeed = (Math.random() - 0.5) * 3;

      // Set initial transform
      emoji.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${emoji.dataset.rotation}deg)`;

      emojiOverlay.appendChild(emoji);
      emojiElements.push(emoji);
    }
  }

  let animationFrame = null;

  function animateEmojis() {
    if (animationFrame) cancelAnimationFrame(animationFrame);

    function loop() {
      if (!settings.emojiOverlay.enabled) {
        animationFrame = null;
        return;
      }

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const emojiType = settings.emojiOverlay.type || 'mixed';
      const currentSet = EMOJI_SETS[emojiType] || EMOJI_SETS.mixed;

      emojiElements.forEach(emoji => {
        let y = parseFloat(emoji.dataset.y);
        let x = parseFloat(emoji.dataset.x);
        let rotation = parseFloat(emoji.dataset.rotation);

        const speed = parseFloat(emoji.dataset.speed);
        const drift = parseFloat(emoji.dataset.drift);
        const rotationSpeed = parseFloat(emoji.dataset.rotationSpeed);

        // Update position
        y += speed;
        x += drift;
        rotation += rotationSpeed;

        // Reset if off-screen (bottom)
        if (y > viewportHeight + 100) {
          y = -100;
          x = Math.random() * viewportWidth;
          emoji.dataset.speed = Math.random() * 0.5 + (settings.emojiOverlay.speed || 0.5);
          emoji.dataset.drift = (Math.random() - 0.5) * 1.2;

          // Change emoji to a random one from current set
          emoji.textContent = currentSet[Math.floor(Math.random() * currentSet.length)];
        }

        // Wrap horizontally
        if (x < -100) x = viewportWidth + 50;
        if (x > viewportWidth + 100) x = -50;

        // Save state
        emoji.dataset.y = y;
        emoji.dataset.x = x;
        emoji.dataset.rotation = rotation;

        // Apply transform
        emoji.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      });

      animationFrame = requestAnimationFrame(loop);
    }

    loop();
  }


  /* --------------------
    Emoji overlay hotkey
    -------------------- */
  document.addEventListener('keydown', (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
    if (e.key === 'e' || e.key === 'E') {
      settings.emojiOverlay.enabled = !settings.emojiOverlay.enabled;
      saveSettings();
      createEmojis();
      animateEmojis();
    }
  });

  /* --------------------
     Hotkey: R toggles overlay on/off
     -------------------- */
  document.addEventListener('keydown', (e) => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;
    if (e.key === 'r' || e.key === 'R') {
      settings.visible = !settings.visible;
      console.log('Halloween background toggled:', settings.visible ? 'ON' : 'OFF');
      saveSettings();
      overlay.style.display = settings.visible ? 'block' : 'none';
    }
  });

  /* --------------------
     Init
     -------------------- */
  try {
    ensureOverlay();
    applyStyles();
    overlay.style.display = settings.visible ? 'block' : 'none';

    // 🎃 Halloween emoji overlay setup
    ensureEmojiOverlay();
    createEmojis();
    animateEmojis();

  } catch (err) {
    console.error('HalloweenTorn init error', err);
  }

})();

