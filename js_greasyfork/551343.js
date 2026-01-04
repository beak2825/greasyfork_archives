// ==UserScript==
// @name         GeoGuessr Profile – Best/Worst Countries
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Show a player's best and worst countries on their profile page, below the level progressbar
// @author       JanosGeo
// @match        https://www.geoguessr.com/user/*
// @match        https://www.geoguessr.com/me/profile
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551343/GeoGuessr%20Profile%20%E2%80%93%20BestWorst%20Countries.user.js
// @updateURL https://update.greasyfork.org/scripts/551343/GeoGuessr%20Profile%20%E2%80%93%20BestWorst%20Countries.meta.js
// ==/UserScript==

// Update 0.3.0: Adapt to new profile page by Geoguessr. The current position is TBD, it might change once other scripts that I personally use
// have decided on their placements (specifically: head-to-head duel statistics script).

// Update 0.2.0: Change how flags are generated - should work on more browsers than Firefox now

function checkURL() {
  return (
    location.pathname.includes("/user") ||
    location.pathname.includes("/me/profile")
  );
}

async function fetchBestCountries(profileId) {
  try {
    const res = await fetch(
      `${location.origin}/api/v4/ranked-system/progress/${profileId}`
    );
    return res.json();
  } catch (err) {
    console.log("Fetch error:", err);
    return null;
  }
}

function codeToFlagEmoji(code) {
  const lower = code.toLowerCase();
  return `<img
    src="https://flagcdn.com/24x18/${lower}.png"
    alt="${code.toUpperCase()} flag"
    title="${code.toUpperCase()}"
    style="margin-right:4px;vertical-align:middle;"
  >`;
}

function placeholderFlag(count = 3) {
  const grayFlag =
    '<div style="display:inline-block;width:24px;height:18px;background:#555;margin-right:4px;border:1px solid #333;border-radius:2px;vertical-align:middle;"></div>';
  return Array(count).fill(grayFlag).join(" ");
}

/* ------------------------------------------------------------------ */
/*  UI Rendering                                                      */
/* ------------------------------------------------------------------ */

function createBox() {
  const box = document.createElement("div");
  box.id = "best-worst-countries-box";
  box.style = `
    padding:10px 20px 10px 10px;
    border:2px solid #000;
    border-radius:5px;
    font-size:20px;
    display:flex;
    align-items:center;
    gap:3rem;
    background-color:#1c163a;
  `;
  box.innerHTML = `
    <div id="best-country-display"><strong>Best: ${placeholderFlag()}</strong></div>
    <div id="worst-country-display"><strong>Worst: ${placeholderFlag()}</strong></div>
  `;
  return box;
}

function showPlaceholders() {
  const multiplayerBox = document.querySelector(
    '[class^="level-progress-bar_trackContainer"]'
  );
  if (!multiplayerBox) return;

  const old = document.getElementById("best-worst-countries-box");
  if (old) old.remove();

  const container = createBox();
  multiplayerBox.parentNode.insertBefore(container, multiplayerBox.nextSibling);
}

function updateBox(data) {
  const bestDisplay = document.getElementById("best-country-display");
  const worstDisplay = document.getElementById("worst-country-display");
  if (!bestDisplay || !worstDisplay) return;

  const best =
    data.bestCountries?.map((c) => codeToFlagEmoji(c)).join(" ") || "N/A";
  const worst =
    data.worstCountries?.map((c) => codeToFlagEmoji(c)).join(" ") || "N/A";

  bestDisplay.innerHTML = `<strong>Best: ${best}</strong>`;
  worstDisplay.innerHTML = `<strong>Worst: ${worst}</strong>`;
}

/* ------------------------------------------------------------------ */
/*  Wait for dynamic elements                                         */
/* ------------------------------------------------------------------ */

function waitForElement(selector) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const obs = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        resolve(el);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });
}

/* ------------------------------------------------------------------ */
/*  Main logic                                                        */
/* ------------------------------------------------------------------ */

async function loadProfileData() {
  if (!checkURL()) return;

  await waitForElement('[class^="level-progress-bar_trackContainer"]');

  const profileLink = location.pathname.includes("/me/profile")
    ? document.querySelector('[name="copy-link"]').value
    : location.href;
  const profileId = profileLink.split("/").pop();

  showPlaceholders(); // Show placeholder UI first
  const data = await fetchBestCountries(profileId);
  if (data) updateBox(data);
}

/* ------------------------------------------------------------------ */
/*  Detect SPA navigation changes (pushState/popstate)                */
/* ------------------------------------------------------------------ */

let lastURL = location.href;

function checkForURLChange() {
  if (location.href !== lastURL) {
    lastURL = location.href;
    loadProfileData(); // URL changed, reload data
  }
}

// Hook history API
const pushState = history.pushState;
history.pushState = function () {
  pushState.apply(this, arguments);
  checkForURLChange();
};
const replaceState = history.replaceState;
history.replaceState = function () {
  replaceState.apply(this, arguments);
  checkForURLChange();
};
window.addEventListener("popstate", checkForURLChange);

// Initial load
loadProfileData();
