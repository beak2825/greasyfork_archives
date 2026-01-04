// ==UserScript==
// @name        olx.pl OLED dark mode
// @namespace   Violentmonkey Scripts
// @match       https://www.olx.pl/*
// @grant       none
// @version     2.2.0
// @description OLED-black dark mode for OLX
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561169/olxpl%20OLED%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/561169/olxpl%20OLED%20dark%20mode.meta.js
// ==/UserScript==

(function () {
  function add(css) {
    const head = document.head || document.getElementsByTagName("head")[0];
    if (!head) return;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  add(`
:root {
  color-scheme: dark;
}

/* Override OLX theme + primitives (taken from page dump) */
:root, html, body {
  /* High‑level colors */
  --colorsBackgroundPrimary: #000000 !important;
  --colorsBackgroundSecondary: #000000 !important;
  --colorsBackgroundElevated: #0b0b0b !important;
  --colorsBackgroundDisabled: #111111 !important;
  --colorsBackgroundInverse: #000000 !important;

  --colorsForegroundPrimary: #e8e8e8 !important;
  --colorsForegroundSecondary: #b6b6b6 !important;
  --colorsForegroundPlaceholder: #8c8c8c !important;
  --colorsForegroundDisabled: #6f6f6f !important;

  --colorsBorderSubtle: #232323 !important;
  --colorsBorderMedium: #2b2b2b !important;
  --colorsBorderStrong: #3a3a3a !important;

  --colorsBackgroundActionPrimary: #0b2a2c !important;
  --colorsForegroundOnActionPrimary: #e8e8e8 !important;

  --colorsForegroundAccent: #23e5db !important;
  --colorsBorderFocus: #23e5db !important;

  --colorsOpacityOverlayBackdrop: #000000cc !important;
  --colorsOpacityOverlayShadow: #00000066 !important;

  /* "light gray" primitives that OLX uses for surfaces */
  --primitivesColorsLightGray01White: #000000 !important;
  --primitivesColorsLightGray02Gray:  #050505 !important;
  --primitivesColorsLightGray03Gray:  #0b0b0b !important;
  --primitivesColorsLightGray04Gray:  #111111 !important;
  --primitivesColorsLightGray05Gray:  #2a2a2a !important;
  --primitivesColorsLightGray06Gray:  #b6b6b6 !important;
  --primitivesColorsLightGray07Charcoal:#e8e8e8 !important;

  --primitivesColorsAlphaTransparentWhite16: #00000029 !important;
  --primitivesColorsAlphaTransparentWhite24: #0000003D !important;
  --primitivesColorsAlphaTransparentWhite40: #00000066 !important;
  --primitivesColorsAlphaTransparentWhite64: #000000A3 !important;
  --primitivesColorsAlphaTransparentWhite80: #000000CC !important;

  background: var(--colorsBackgroundPrimary) !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Main shells */
html, body,
body, main, header, footer, nav,
#hydrate-root,
#body-container,
#searchmain-container,
#listContainer,
#footer-container,
#locationLinks,
#categoryLinksHeader,
.popular-searches {
  background: #000000 !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Central content & footer columns (from your inspector) */
#mainContent,
#mainContent > div,
#mainContent > div > div,
#footerContent,
#footerContent > div,
#footerContent > section {
  background: #000000 !important;
}

/* Generic OLX layout cards/panels */
article, aside, section,
[class*="Card"], [class*="card"],
[class*="panel"], [class*="Panel"],
[class*="box"], [class*="Box"],
[role="dialog"], [role="menu"], [role="listbox"] {
  background: #0b0b0b !important;
  color: var(--colorsForegroundPrimary) !important;
  border-color: var(--colorsBorderSubtle) !important;
}

/* Baxter ad backgrounds visible in your screenshot */
.baxter-background--default,
.baxter-placeholder--ad--baxter-background--default,
.baxter-container {
  background: #000000 !important;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  color: var(--colorsForegroundPrimary) !important;
}
p, span, li, dt, dd, label, small {
  color: inherit;
}

/* Links */
a, .link, .link * { color: #8ab4ff !important; }

/* Price highlight */
.price, .price strong, [class*="price"] strong {
  color: #ffb86c !important;
}

/* Inputs */
input, textarea, select {
  background: #111111 !important;
  color: var(--colorsForegroundPrimary) !important;
  border: 1px solid var(--colorsBorderSubtle) !important;
}
input::placeholder, textarea::placeholder {
  color: var(--colorsForegroundPlaceholder) !important;
}
input:focus, textarea:focus, select:focus {
  outline: 2px solid var(--colorsBorderFocus) !important;
  outline-offset: 1px;
}

/* Buttons */
button, [role="button"], .btn, [class*="Button"] {
  color: var(--colorsForegroundPrimary) !important;
  border-color: var(--colorsBorderSubtle) !important;
}

/* Cookie / consent popup */
#onetrust-consent-sdk,
#onetrust-consent-sdk *[class*="ot-"] {
  background-color: #0b0b0b !important;
  color: var(--colorsForegroundPrimary) !important;
  border-color: var(--colorsBorderSubtle) !important;
}

/* Media should stay as-is */
img, picture, video, svg, canvas {
  background: transparent !important;
}

/* Specifically target common white containers */
div[class*="css-"][class*="card"]:not([class*="image"]):not([class*="photo"]):not([data-testid="l-card"]):not([data-testid="ad-card"]),
div[class*="css-"][class*="container"]:not([class*="image"]):not([class*="photo"]):not([class*="slider"]),
div[class*="css-"][class*="wrapper"]:not([class*="image"]):not([class*="photo"]):not([class*="slider"]):not([class*="gallery"]),
div[class*="css-"][class*="box"]:not([class*="image"]):not([class*="photo"]) {
  background: #0b0b0b !important;
}

/* Image galleries and sliders - keep transparent with higher priority */
.swiper-slide,
.swiper-container,
.swiper-wrapper,
[class*="gallery"],
[class*="Gallery"],
[class*="slider"],
[class*="Slider"],
[class*="image"],
[class*="Image"],
[class*="photo"],
[class*="Photo"] {
  background-color: transparent !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Recommendation / "Więcej od tego ogłoszeniodawcy" sliders */
.swiper-slide *,
.swiper-slide {
  background-color: transparent !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Ensure swiper slides / l-card ad tiles keep images visible and text readable */
[data-testid="swiper-slide"],
[data-testid="swiper-slide"] *,
[data-testid="l-card"],
[data-testid="l-card"] *,
[data-testid="ad-card"],
[data-testid="ad-card"] * {
  background-color: transparent !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Product image links and containers - use structure, not class names */
a[href*="/d/oferta/"] div,
a[href*="/oferta/"] div,
div[type="grid"],
div[type="grid"] > div,
div[type="grid"] > div > img {
  background-color: transparent !important;
}



/* Direct image containers regardless of class */
img,
img + *,
picture {
  background-color: transparent !important;
}

/* CRITICAL: Override black backgrounds on image parent divs */
div[class*="css-"] > img,
div[class*="css-"] img {
  background-color: transparent !important;
}


/* Right sidebar (seller info, price, location) - force dark */
aside[class*="css-"],
section[class*="css-"] {
  background: #0b0b0b !important;
  color: var(--colorsForegroundPrimary) !important;
}

/* Ensure all nested content respects theme */
div, section, article, aside, main {
  color: inherit !important;
}



/* Absolute last-resort override – keep content containers transparent so images/cards show correctly */
#mainContent div {
  background-color: transparent !important;
}

/* Override any white/light backgrounds from inline or specific styles */
[style*="background-color: rgb(255, 255, 255)"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background-color: white"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background: rgb(255, 255, 255)"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background: white"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background-color:#ffffff"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background-color: #ffffff"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background-color:#fff"]:not([data-testid="l-card"]):not([data-testid="ad-card"]),
[style*="background-color: #fff"]:not([data-testid="l-card"]):not([data-testid="ad-card"]) {
  background-color: #000000 !important;
}

/* FIX: OLX promoted / grid containers blacking out images */
div[type="grid"],
div[type="grid"] > div,
div[type="grid"] > div > div {
  background-color: transparent !important;
}

/* Specific promoted ads wrapper */
h2 + div[type="grid"] {
  background-color: transparent !important;
}

/* Kill background on immediate grid parents */
div[class^="css-"] > div[type="grid"] {
  background-color: transparent !important;
}

/* Kill background on hashed OLX layout wrappers inside main content
   This neutralises wrappers like <div class="css-1nh3t7z"> around promoted grids */
#mainContent div[class^="css-"] {
  background-color: transparent !important;
}


  `);
})();