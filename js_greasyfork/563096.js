// ==UserScript==
// @name         Torn: More Legible Player Names (PX fork)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces Torn's pixel honor bar names with a larger, more legible font. Fork of https://greasyfork.org/en/scripts/531629-torn-more-legible-player-names
// @author       PedroXimenz
// @author       GingerBeardMan
// @match        https://www.torn.com/*
// @grant        none
// @license      GNU GPLv3
// @homepageURL  https://github.com/pedroximeneztorn/torn-more-legible-player-names
// @downloadURL https://update.greasyfork.org/scripts/563096/Torn%3A%20More%20Legible%20Player%20Names%20%28PX%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563096/Torn%3A%20More%20Legible%20Player%20Names%20%28PX%20fork%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const BIG_TEXT = 14;
  const STEP_DOWN = 1; // how much smaller to make text that's too big, in px

  // Load Inter font
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Outline colors: [name, color, thick]
  const outlineColors = [
    ["black", "#000", false],
    ["blue", "#310AF5", true],
    ["red", "#ff4d4d", true],
    ["green", "#3B9932", true],
    ["orange", "#ff9c40", true],
    ["purple", "#c080ff", true],
  ];

  function buildOutline(color, thick) {
    const offsets = [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ];
    if (thick) {
      offsets.push([0, -1], [0, 1], [-1, 0], [1, 0]);
    }
    return offsets.map(([x, y]) => `${x}px ${y}px 0 ${color}`).join(", ");
  }

  const outlineStyles = outlineColors
    .map(
      ([name, color, thick]) =>
        `.outline-${name} { text-shadow: ${buildOutline(color, thick)} !important; }`
    )
    .join("\n");

  // Inject styling
  const style = document.createElement("style");
  style.textContent = `
        .custom-honor-text {
            font-family: 'Inter', sans-serif !important;
            font-weight: 700 !important;
            font-size: ${BIG_TEXT}px !important;
            color: white !important;
            font-variant: small-caps !important;
            letter-spacing: 0.5px !important;
            pointer-events: none !important;

            position: absolute !important;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100% !important;
            height: auto;

            display: flex !important;
            align-items: center;
            justify-content: center;

            text-align: center !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 10 !important;
        }

        .honor-text-svg {
            display: none !important;
        }

        ${outlineStyles}

        .forums-thread-wrap .poster-wrap .poster {
            overflow: visible !important;
        }
    `;
  document.head.appendChild(style);

  // Determine the outline style based on role
  function getOutlineClass(wrap) {
    if (wrap.classList.contains("admin")) return "outline-red";
    if (wrap.classList.contains("officer")) return "outline-green";
    if (wrap.classList.contains("moderator")) return "outline-orange";
    if (wrap.classList.contains("helper")) return "outline-purple";
    if (wrap.classList.contains("blue")) return "outline-blue";
    return "outline-black";
  }

  // Replace honor bar name with custom text
  function replaceHonorText() {
    document.querySelectorAll(".honor-text-wrap").forEach((wrap) => {
      const sprite = wrap.querySelector(".honor-text-svg");
      const existing = wrap.querySelector(".custom-honor-text");

      if (sprite) sprite.style.display = "none";
      if (existing) return;

      const text =
        wrap.getAttribute("data-title") ||
        wrap.getAttribute("aria-label") ||
        wrap.innerText ||
        "";
      const cleaned = text.trim();
      if (!cleaned) return;

      const div = document.createElement("div");
      div.className = `custom-honor-text ${getOutlineClass(wrap)}`;
      div.textContent = cleaned;
      wrap.appendChild(div);

      // Shrink font if text overflows
      if (div.scrollWidth > wrap.clientWidth) {
        div.style.setProperty("font-size", `${BIG_TEXT - STEP_DOWN}px`, "important");
      }
    });
  }

  // Run initially
  replaceHonorText();

  // Watch for dynamic changes
  const observer = new MutationObserver(replaceHonorText);
  observer.observe(document.body, { childList: true, subtree: true });
})();
