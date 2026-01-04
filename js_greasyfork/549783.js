// ==UserScript==
// @name         ⚡ Night X Hub Bypass ⚡
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Auto-click To Direct Link (15x) | UI with Switch On/Off Manual Control| Dev: @Fer3on_Mod
// @author       Fer3on_Mod
// @license      MIT
// @match        https://nighthub.pro/key
// @grant        unsafeWindow
// @run-at       document-idle
// @icon     https://i.postimg.cc/bNWy1CvS/cybercrime.png
// @iconURL  https://i.postimg.cc/bNWy1CvS/cybercrime.png

// @downloadURL https://update.greasyfork.org/scripts/549783/%E2%9A%A1%20Night%20X%20Hub%20Bypass%20%E2%9A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/549783/%E2%9A%A1%20Night%20X%20Hub%20Bypass%20%E2%9A%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_DELAY_MS = 500;
  let running = false;
  let clicks = 0;
  let lastDelay = DEFAULT_DELAY_MS;
  let stopRequested = false;


  const toastStyle = document.createElement("style");
  toastStyle.textContent = `[data-sonner-toast]{display:none!important;}`;
  document.head.appendChild(toastStyle);


  unsafeWindow.alert = () => {};
  unsafeWindow.confirm = () => false;
  unsafeWindow.prompt = () => null;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const log = (...a) => console.log("[ElegantBypass]", ...a);

  async function runAutoLoop(token) {
    while (!token.stop && !stopRequested) {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        (b.innerText || "").includes("Direct Link")
      );

      if (!btn) {
        log("Direct Link button not found, retrying...");
        await sleep(1000);
        continue;
      }

      try {
        btn.click();
        clicks++;
        updateUI();
        log("Clicked Direct Link:", clicks);
      } catch (e) {
        log("Click failed:", e);
      }

      if (clicks >= 15) {
        log("Finished 15 clicks, now pressing Create Key...");
        await sleep(800);
        const createBtn = document.querySelector(
          "button.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-background.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.\\[\\&_svg\\]\\:pointer-events-none.\\[\\&_svg\\]\\:size-4.\\[\\&_svg\\]\\:shrink-0.bg-primary.hover\\:bg-primary\\/90.h-10.px-4.py-2.bg-gradient-to-r.from-emerald-600.to-emerald-700.hover\\:from-emerald-700.hover\\:to-emerald-800.text-white.shadow-lg.shadow-emerald-900\\/30.transition-all.duration-300.hover\\:shadow-emerald-900\\/50"
        );
        if (createBtn) {
          createBtn.click();
          log("Create Key button clicked!");
        } else {
          log("Create Key button not found!");
        }
        stopRequested = true;
        token.stop = true;
        running = false;
        updateUI();
        break;
      }

      const waitMs = lastDelay || DEFAULT_DELAY_MS;
      const jitter = Math.floor(Math.random() * 120) - 60;
      await sleep(Math.max(150, waitMs + jitter));
    }
  }

  let autoLoopToken = { stop: false };
  function toggleAuto() {
    if (!running) {
      running = true;
      stopRequested = false;
      clicks = 0;
      autoLoopToken = { stop: false };
      runAutoLoop(autoLoopToken);
    } else {
      stopRequested = true;
      autoLoopToken.stop = true;
      running = false;
    }
    updateUI();
  }

  function createUI() {
    if (document.getElementById("elegant-ui")) return;

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Inter:wght@400;600&display=swap');
      #menu-toggle {
        position: fixed; bottom: 20px; right: 20px;
        padding: 10px 20px;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        border-radius: 12px;
        color: #fff;
        font-family: 'Cinzel Decorative', cursive;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0,0,0,0.4);
        z-index: 99999;
        transition: all .3s ease;
      }
      #menu-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 22px rgba(0,0,0,0.5);
      }
      #elegant-ui {
        position: fixed; bottom: 80px; right: 20px;
        width: 260px;
        background: rgba(20,25,40,0.95);
        backdrop-filter: blur(12px);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.45);
        font-family: 'Inter', sans-serif;
        font-size: 13px; color: #e2e8f0;
        display: none;
        z-index: 99999;
      }
      #elegant-ui .title {
        text-align: center;
        font-family: 'Cinzel Decorative', cursive;
        font-size: 20px;
        font-weight: 700;
        color: #60a5fa;
        margin-bottom: 10px;
        text-shadow: 1px 1px 2px #000;
      }
      .divider {
        border-top: 1px solid rgba(255,255,255,0.15);
        margin: 10px 0;
      }
      #elegant-ui .row {
        display:flex; justify-content:space-between;
        margin:6px 0;
      }
      #elegant-ui .footer {
        text-align:center; margin-top:8px;
        font-size:12px;
      }
      #elegant-ui .footer a {
        color:#38bdf8; text-decoration:none; font-weight:600;
      }
      #elegant-ui .footer a:hover { text-decoration:underline; }
      .switch {
        position: relative; display: inline-block;
        width: 60px; height: 30px;
      }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider {
        position: absolute; cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #555; transition: .4s; border-radius: 34px;
      }
      .slider:before {
        position: absolute; content: "";
        height: 22px; width: 22px;
        left: 4px; bottom: 4px;
        background-color: white; transition: .4s; border-radius: 50%;
      }
      input:checked + .slider { background-color: #22c55e; }
      input:checked + .slider:before { transform: translateX(28px); }
      .dev-box {
        text-align: center; padding: 6px 0;
        margin-top: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        background: rgba(255,255,255,0.03);
        font-weight: bold; font-size: 13px; color: #93c5fd;
      }
    `;
    document.head.appendChild(style);

    const toggle = document.createElement("div");
    toggle.id = "menu-toggle";
    toggle.textContent = "Bypass Menu";
    toggle.addEventListener("click", () => {
      const panel = document.getElementById("elegant-ui");
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
    document.body.appendChild(toggle);

    const panel = document.createElement("div");
    panel.id = "elegant-ui";
    panel.innerHTML = `
      <div class="title">💠 Night X Hub 💠</div>
      <div class="divider"></div>
      <div style="text-align:center; margin-bottom:8px;">
        <label class="switch">
          <input type="checkbox" id="powerSwitch">
          <span class="slider"></span>
        </label>
        <div>Status: <span id="statusText">OFF</span></div>
      </div>
      <div class="row"><span>🖱️ Clicks:</span> <span id="elite-clicks">0</span></div>
      <div class="row"><span>⏱️ Delay:</span> <span id="elite-delay">${DEFAULT_DELAY_MS}ms</span></div>
      <div class="divider"></div>
      <<div class="dev-box">&lt;/&gt; Developer: 
  <a href="https://t.me/Fer3on_Mod" target="_blank">@Fer3on_Mod</a>
</div>
    `;
    document.body.appendChild(panel);

    document.getElementById("powerSwitch").addEventListener("change", toggleAuto);
  }

  function updateUI() {
    const clicksEl = document.getElementById("elite-clicks");
    const delayEl = document.getElementById("elite-delay");
    const statusText = document.getElementById("statusText");
    const powerSwitch = document.getElementById("powerSwitch");

    if (clicksEl) clicksEl.textContent = clicks;
    if (delayEl) delayEl.textContent = `${lastDelay}ms`;
    if (statusText) statusText.textContent = running ? "ON" : "OFF";
    if (powerSwitch) powerSwitch.checked = running;
  }

  createUI();
})();