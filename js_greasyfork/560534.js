// ==UserScript==
// @name         DogeRPG Ultra Light Mode + Timed Auto Claim + Auto Mining
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Ultra Light Mode + Remove All Animations From The Page + Reload Cycle + Auto Claim + Auto Mining
// @author       Rubystance
// @license      MIT
// @match        https://dogerpg.lovable.app/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560534/DogeRPG%20Ultra%20Light%20Mode%20%2B%20Timed%20Auto%20Claim%20%2B%20Auto%20Mining.user.js
// @updateURL https://update.greasyfork.org/scripts/560534/DogeRPG%20Ultra%20Light%20Mode%20%2B%20Timed%20Auto%20Claim%20%2B%20Auto%20Mining.meta.js
// ==/UserScript==

GM_addStyle(`
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    backdrop-filter: none !important;
    will-change: auto !important;
  }

  canvas, video {
    display: none !important;
  }
`);

window.requestAnimationFrame = () => 0;
HTMLCanvasElement.prototype.getContext = () => null;

const CLAIM_INTERVAL = 60 * 60 * 1000;
const STORAGE_KEY = "dogerpg_last_claim";

function canClaim() {
  const last = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  return Date.now() - last >= CLAIM_INTERVAL;
}

function saveClaim() {
  localStorage.setItem(STORAGE_KEY, Date.now());
}

function findClaimButton() {
  return [...document.querySelectorAll("button")].find(b =>
    b.textContent.includes("Reclamar") &&
    b.className.includes("from-amber-500") &&
    !b.disabled &&
    b.offsetParent !== null
  );
}

function findStartMiningButton() {
  return [...document.querySelectorAll("button")].find(b =>
    b.textContent.includes("Start Mining") ||
    b.textContent.includes("Iniciar Minado")
  );
}

function tryClaim() {
  if (!canClaim()) return;

  const btn = findClaimButton();
  if (!btn) return;

  btn.click();
  saveClaim();

  setTimeout(() => location.reload(), 3000);
}

function startMining() {
  const btn = findStartMiningButton();
  if (btn && !btn.disabled) {
    btn.click();
  }
}

setInterval(() => {
  tryClaim();
  startMining();
}, 5000);

setTimeout(() => {
  location.reload();
}, CLAIM_INTERVAL + 20000);
