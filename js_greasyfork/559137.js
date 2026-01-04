// ==UserScript==
// @name             FlatMMO Play – Overview Style Button by SleepyyNet
// @name:en          FlatMMO Play – Overview Style Button by SleepyyNet
// @name:sv          FlatMMO Play - Översiktlig Stilknapp av SleepyyNet
// @namespace        https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/FlatMMO.Com-By-SleepyyNet.js
// @namespace:en     https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/FlatMMO.Com-By-SleepyyNet.js
// @namespace:sv     https://github.com/SleepyyDotNet/FlatMMO-Scripts/blob/greasyfork/FlatMMO.Com-By-SleepyyNet.js 
// @version          1.22
// @version:en       1.22
// @version:sv       1.22
// @description      Adds an overview-style Play button for FlatMMO + credits, with optional auto-redirect.
// @description:en   Adds an overview-style Play button for FlatMMO + credits, with optional auto-redirect.
// @description:sv   Lägger till en översiktsliknande Spela-knapp för FlatMMO med krediter, samt valfri automatisk omdirigering.
// @match            *://flatmmo.com/*
// @match            *://www.flatmmo.com/*
// @match            https://flatmmo.com/*
// @match            https://www.flatmmo.com/*
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/559137/FlatMMO%20Play%20%E2%80%93%20Overview%20Style%20Button%20by%20SleepyyNet.user.js
// @updateURL https://update.greasyfork.org/scripts/559137/FlatMMO%20Play%20%E2%80%93%20Overview%20Style%20Button%20by%20SleepyyNet.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const PLAY_URL = "https://flatmmo.com/play.php";

  // If we are already on /play.php, do nothing
  if (location.pathname.toLowerCase() === "/play.php") return;

  function createOverviewStylePlayButton() {
    // Avoid duplicates
    if (document.getElementById("flatmmo-play-container")) return;

    // === Container (matches site overlay feel) ===
    const container = document.createElement("div");
    container.id = "flatmmo-play-container";
    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "99999",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "6px",
      color: "#e0e0e0",
    });

    // === Main button (green accent, flat style) ===
    const btn = document.createElement("button");
    btn.textContent = "Play FlatMMO";
    btn.type = "button";

    Object.assign(btn.style, {
      minWidth: "160px",
      padding: "10px 20px",
      borderRadius: "4px",
      border: "1px solid #1b5e20",
      background: "linear-gradient(180deg, #43a047 0%, #2e7d32 100%)",
      color: "#f5f5f5",
      fontSize: "14px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      cursor: "pointer",
      boxShadow: "0 3px 8px rgba(0,0,0,0.7)",
      outline: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      transition:
        "background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease",
    });

    // Icon (simple ▶ to feel like a "start" button)
    const icon = document.createElement("span");
    icon.textContent = "▶";
    Object.assign(icon.style, {
      fontSize: "12px",
      opacity: "0.9",
    });
    btn.prepend(icon);

    // Hover / active states
    btn.addEventListener("mouseover", () => {
      btn.style.background = "linear-gradient(180deg, #4caf50 0%, #388e3c 100%)";
      btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.8)";
      btn.style.transform = "translateY(-1px)";
      btn.style.borderColor = "#2e7d32";
    });

    btn.addEventListener("mouseout", () => {
      btn.style.background = "linear-gradient(180deg, #43a047 0%, #2e7d32 100%)";
      btn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.7)";
      btn.style.transform = "translateY(0)";
      btn.style.borderColor = "#1b5e20";
    });

    btn.addEventListener("mousedown", () => {
      btn.style.transform = "translateY(1px) scale(0.99)";
      btn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.7)";
    });

    btn.addEventListener("mouseup", () => {
      btn.style.transform = "translateY(-1px)";
      btn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.8)";
    });

    // Click: go to play.php
    btn.addEventListener("click", () => {
      window.location.href = PLAY_URL;
    });

    // === Credits text under button ===
    const credits = document.createElement("div");
    credits.textContent = "Credits goes to: SleepyyNet & Taskade AI";
    Object.assign(credits.style, {
      fontSize: "11px",
      color: "#9e9e9e",
      textAlign: "right",
      textShadow: "0 1px 2px rgba(0,0,0,0.8)",
      padding: "2px 4px",
      background: "rgba(0,0,0,0.45)",
      borderRadius: "3px",
      border: "1px solid rgba(255,255,255,0.05)",
    });

    container.appendChild(btn);
    container.appendChild(credits);
    document.body.appendChild(container);
  }

  //const path = location.pathname.toLowerCase();

  // Optional: auto-redirect from home to play (you can remove this if you only want the button)
  //if (path === "/" || path === "/index.php") {
    //setTimeout(() => {
      //window.location.href = PLAY_URL;
    //}, 500);
  //}

  // Show button on all pages except play.php
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createOverviewStylePlayButton);
  } else {
    createOverviewStylePlayButton();
  }
})();