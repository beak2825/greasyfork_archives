// ==UserScript==
// @name HyperSpace Chrome Bar
// @namespace https://greasyfork.org/users/you
// @version 2.2
// @description Fully animated space-themed Chrome top bar
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match http*
// @downloadURL https://update.greasyfork.org/scripts/557586/HyperSpace%20Chrome%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/557586/HyperSpace%20Chrome%20Bar.meta.js
// ==/UserScript==

(function() {
let css = `
  body::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 48px;
    background: linear-gradient(to bottom, #05010f, #0a001a);
    backdrop-filter: blur(6px) brightness(1.2);
    z-index: 999999;
    pointer-events: none;
  }

  .hs-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 48px;
    overflow: hidden;
    pointer-events: none;
    z-index: 999999;
    mix-blend-mode: screen;
  }

  .hs-stars, .hs-stars2, .hs-stars3 {
    position: absolute;
    width: 200%;
    height: 100%;
    background-repeat: repeat;
    background-size: contain;
    animation: moveStars linear infinite;
  }
  .hs-stars { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='50'%3E%3Ccircle cx='10' cy='10' r='1' fill='white'/%3E%3C/svg%3E"); animation-duration: 24s; opacity: .45; }
  .hs-stars2 { background-image: inherit; animation-duration: 48s; opacity: .25; }
  .hs-stars3 { background-image: inherit; animation-duration: 72s; opacity: .15; }

  @keyframes moveStars {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .hs-warp {
    position: absolute;
    width: 200%;
    height: 48px;
    background: repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 2px, transparent 2px 6px);
    animation: warpSpeed 1.2s linear infinite;
    opacity: .35;
  }

  @keyframes warpSpeed {
    from { transform: translateX(0); }
    to { transform: translateX(-40%); }
  }

  .hs-scan {
    position: absolute;
    width: 100%;
    height: 48px;
    background: linear-gradient(180deg, transparent 0%, rgba(0,255,255,.2) 50%, transparent 100%);
    animation: scanMotion 4s ease-in-out infinite;
    opacity: .25;
  }

  @keyframes scanMotion {
    0% { transform: translateY(-30px); }
    50% { transform: translateY(10px); }
    100% { transform: translateY(-30px); }
  }

  .hs-holo:hover {
    filter: drop-shadow(0 0 6px cyan) brightness(1.6);
  }

  .hs-planet {
    position: absolute;
    width: 36px;
    height: 36px;
    top: 6px;
    left: -40px;
    background: radial-gradient(circle, #6f5aff, #1c0b3a);
    border-radius: 50%;
    animation: planetOrbit 20s linear infinite;
  }

  @keyframes planetOrbit {
    0% { transform: translateX(0) rotate(0deg); }
    100% { transform: translateX(calc(100vw + 80px)) rotate(360deg); }
  }

  .hs-satellite {
    position: absolute;
    top: 14px;
    left: -40px;
    width: 40px;
    height: 20px;
    background: linear-gradient(to right, #e2e2e2, #b1b1b1);
    border-radius: 4px;
    animation: satFlyby 14s linear infinite;
  }

  @keyframes satFlyby {
    0% { transform: translateX(0) rotate(0deg); }
    100% { transform: translateX(110vw) rotate(12deg); }
  }

  .hs-nebula {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 48px;
    background: radial-gradient(circle at 40% 50%, rgba(138,43,226,.22), transparent 50%), radial-gradient(circle at 70% 40%, rgba(0,191,255,.18), transparent 60%);
    animation: nebulaFlow 38s ease-in-out infinite;
  }

  @keyframes nebulaFlow {
    0% { transform: translateX(0); }
    50% { transform: translateX(-12%); }
    100% { transform: translateX(0); }
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
