
// ==UserScript==
// @name         AutoDarts ↔ DartCounter Bridge (Tampermonkey)
// @namespace    autodarts.dartcounter.bridge
// @version      1.0.26
// @description  Read darts from AutoDarts and auto-enter score into DartCounter without WebDriver.
// @author       snoopier (dennis.p@gmx.de)
// @match        http://127.0.0.1:3180/*
// @match        http://192.168.*:3180/*
// @match        https://app.dartcounter.net/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561084/AutoDarts%20%E2%86%94%20DartCounter%20Bridge%20%28Tampermonkey%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561084/AutoDarts%20%E2%86%94%20DartCounter%20Bridge%20%28Tampermonkey%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Configuration: defaults and keys ---
  const CFG = {
    autodartsSpanClass: "css-1ny2kle",
    pollIntervalMs: 500,
    scoreSelectors: [
      'input[placeholder="Geben Sie eine Punktzahl ein und drücken Sie die Eingabetaste"]',
      'input[inputmode="numeric"][maxlength="3"]',
      'input[type="text"][maxlength="3"]'
    ],
    storeRoundKey: "autodarts_round",
    storeOwnIndexKey: "own_index",
    notify: true
  };

  // --- Logging and notification helpers ---
  function log(...args) {
    console.log("[AD2DC]", ...args);
  }

  function notify(title, text, isError = false) {
    if (!CFG.notify) return;
    try {
      const timeout = isError ? 8000 : 3000; // errors shown longer
      GM_notification({ title, text, timeout });
    } catch (e) {
      log("Notification failed:", e);
    }
  }

  // --- Bridge state: in-memory only, resets on page reload ---
  let pollIntervalId = null;
  let roundChangeListenerActive = false;
  let bridgeEnabled = false; // in-memory state, not persisted

  function getBridgeEnabled() {
    return bridgeEnabled;
  }

  function setBridgeEnabled(v) {
    const wasEnabled = bridgeEnabled;
    const requestedState = !!v;

    if (requestedState === wasEnabled) return; // no change

    bridgeEnabled = requestedState;

    // notify other tabs via temporary trigger (not state storage)
    if (requestedState) {
      GM_setValue("bridge_enable_trigger", Date.now()); // trigger only
    } else {
      GM_setValue("bridge_disable_trigger", Date.now()); // trigger only
    }

    // react to state change locally
    if (requestedState && !wasEnabled) {
      onBridgeEnabled();
    } else if (!requestedState && wasEnabled) {
      onBridgeDisabled();
      if (isDartCounter) {
        updateBridgeToggleUI(false);
        registerToggleMenu(true);
      }
      log("Bridge state: OFF");
    }
  }

  async function onBridgeEnabled() {
    if (isDartCounter) {
      // check if AutoDarts tab exists and is ready
      const autodartsReady = await checkAutodartsReady();

      if (!autodartsReady) {
        // rollback - AutoDarts not found
        bridgeEnabled = false;

        updateBridgeToggleUI(false);
        registerToggleMenu(true);
        notify(
          "AutoDarts not found",
          "Please open AutoDarts at http://127.0.0.1:3180 or http://192.168.x.x:3180 first in second tab/instance.",
          true
        );
        log("Bridge enable failed: AutoDarts not ready");
        return;
      }

      // success - enable bridge
      log("Bridge state: ON");
      notify("AD2DC-Bridge", "ready - waiting for darts from AutoDarts");
      updateBridgeToggleUI(true);
      registerToggleMenu(true);
      startDartCounterConsumer();

    } else if (isAutoDarts) {
      // on AutoDarts: just start producer silently (no UI, no notification)
      log("Bridge enabled - AutoDarts producer starting");
      startAutodartsProducer();
    }
  }

  async function checkAutodartsReady() {
    // check if there's a signal from AutoDarts that it's loaded
    // we set a heartbeat key from AutoDarts page
    const heartbeat = GM_getValue("autodarts_heartbeat", null);
    if (!heartbeat) {
      log("No AutoDarts heartbeat found");
      return false;
    }

    const age = Date.now() - heartbeat;
    if (age < 10000) { // less than 10 seconds old
      log("AutoDarts heartbeat detected:", age, "ms ago");
      return true;
    } else {
      log("AutoDarts heartbeat too old:", age, "ms ago");
      return false;
    }
  }

  function onBridgeDisabled() {
    if (isDartCounter) {
      notify("AD2DC-Bridge", "disabled");
    }

    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      pollIntervalId = null;
      log("AutoDarts producer stopped.");
    }
  }

  // listen for bridge triggers from other tabs (not state, just events)
  GM_addValueChangeListener("bridge_enable_trigger", (name, oldVal, newVal) => {
    if (newVal && !bridgeEnabled) {
      log("Bridge enable triggered from another tab");
      bridgeEnabled = true;
      onBridgeEnabled();
    }
  });

  GM_addValueChangeListener("bridge_disable_trigger", (name, oldVal, newVal) => {
    if (newVal && bridgeEnabled) {
      log("Bridge disable triggered from another tab");
      bridgeEnabled = false;
      onBridgeDisabled();
    }
  });

  // --- Inline toggle UI (floating button) ---
  let toggleUI = null;
  let toggleBtn = null;

  function ensureBridgeToggleUI() {
    if (toggleUI) return; // already created

    toggleUI = document.createElement("div");
    toggleUI.id = "ad2dc-bridge-toggle";
    Object.assign(toggleUI.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      zIndex: "99999",
      background: "#1f2937",
      color: "#ffffff",
      padding: "8px 10px",
      borderRadius: "6px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      fontFamily: "monospace",
      fontSize: "12px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    });

    const label = document.createElement("span");
    label.textContent = "Bridge";

    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.setAttribute("aria-label", "Toggle bridge");
    Object.assign(toggleBtn.style, {
      cursor: "pointer",
      padding: "6px 10px",
      border: "1px solid #374151",
      borderRadius: "4px",
      background: "#374151",
      color: "#ffffff",
      fontFamily: "monospace",
      fontSize: "12px"
    });

    toggleBtn.addEventListener("click", () => setBridgeEnabled(!getBridgeEnabled()));

    toggleUI.appendChild(label);
    toggleUI.appendChild(toggleBtn);
    document.documentElement.appendChild(toggleUI);

    updateBridgeToggleUI(getBridgeEnabled());
  }

  function updateBridgeToggleUI(enabled) {
    if (!toggleBtn) return;
    if (enabled) {
      toggleBtn.textContent = "ON";
      toggleBtn.style.background = "#059669"; // green
      toggleBtn.style.border = "1px solid #047857";
    } else {
      toggleBtn.textContent = "OFF";
      toggleBtn.style.background = "#6b7280"; // gray
      toggleBtn.style.border = "1px solid #4b5563";
    }
  }

  // keep inline UI in sync across tabs/windows via GM storage listener above

  // --- Dynamic Tampermonkey menu command (reflects current state) ---
  let menuCmdId = null;

  function registerToggleMenu(forceRefresh = false) {
    if (forceRefresh && typeof GM_unregisterMenuCommand === "function" && menuCmdId) {
      GM_unregisterMenuCommand(menuCmdId);
    }
    const label = getBridgeEnabled() ? "Bridge: Disable" : "Bridge: Enable";
    menuCmdId = GM_registerMenuCommand(label, () => setBridgeEnabled(!getBridgeEnabled()));
  }

  // --- Darts parsing and decision logic ---
  function dartToScore(d) {
    const s = String(d || "").trim();
    if (!s || s === "-") return 0;
    if (s === "25") return 25;
    if (s.toLowerCase() === "bull") return 50;

    const firstChar = s[0];
    const num = parseInt(s.slice(1), 10);

    if (firstChar === "S") return num;
    if (firstChar === "D") return num * 2;
    if (firstChar === "T") return num * 3;
    if (/^\d+$/.test(s)) return parseInt(s, 10);

    return 0;
  }

  function readRemainingScoresDC() {
    const els = document.querySelectorAll("app-remaining-score");
    return Array.from(els).map(el => {
      const text = el.textContent.trim();
      return /^\d+$/.test(text) ? parseInt(text, 10) : 0;
    });
  }

  function guessOwnIndexFromLegScoresDC() {
    try {
      const blocks = document.querySelectorAll("app-match-leg-scores div.flex.w-1\\/2.flex-col");
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].querySelector(".animate-pulse")) {
          return i; // 0 or 1
        }
      }
    } catch (e) {
      log("Error guessing own index:", e);
    }
    return null;
  }

  function decideScoreToEnter(total, ownIndex, scores, lastDarts) {
    if (ownIndex == null || ownIndex >= scores.length) return total;

    const remaining = scores[ownIndex];

    // bust: score exceeds remaining
    if (total > remaining) return 0;

    // cannot finish on 1
    if (remaining - total === 1) return 0;

    // check finish conditions
    if (total === remaining) {
      const lastDart = lastDarts?.[2] ? String(lastDarts[2]) : "";
      const isValidFinish =
        lastDart.startsWith("D") ||
        (total === 50 && lastDart.toLowerCase() === "bull");
      return isValidFinish ? total : 0;
    }

    return total; // normal score
  }

  function findScoreInputDC() {
    for (const selector of CFG.scoreSelectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return document.querySelector('input[maxlength="3"]');
  }

  // --- Role detection (producer vs consumer) ---
  const host = location.hostname.toLowerCase();
  const isAutoDarts = location.port === "3180" &&
    (host === "127.0.0.1" || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host));
  const isDartCounter = host.endsWith("dartcounter.net");

  // --- Ensure UI on relevant pages, including SPA route changes ---
  function ensureUIForRelevantHosts() {
    // only show UI on DartCounter, not on AutoDarts
    if (isDartCounter) {
      ensureBridgeToggleUI();
      registerToggleMenu(false);
    }
  }

  // hook into SPA navigation so the toggle appears even after client-side route changes
  function hookSpaNavigation() {
    if (!isDartCounter) return; // only needed on DartCounter

    const origPushState = history.pushState;
    history.pushState = function(...args) {
      const ret = origPushState.apply(this, args);
      ensureBridgeToggleUI();
      return ret;
    };

    window.addEventListener("popstate", ensureBridgeToggleUI);
  }

  // initialize UI and SPA hooks
  ensureUIForRelevantHosts();
  hookSpaNavigation();

  // --- AutoDarts heartbeat: signal that AutoDarts page is loaded ---
  if (isAutoDarts) {
    // set heartbeat on load and keep it updated
    function updateHeartbeat() {
      GM_setValue("autodarts_heartbeat", Date.now());
    }

    updateHeartbeat();
    setInterval(updateHeartbeat, 5000); // update every 5 seconds
    log("AutoDarts heartbeat active");
  }

  // --- Producer: read AutoDarts and publish round into storage ---
  function startAutodartsProducer() {
    if (pollIntervalId) return; // already running

    log("AutoDarts producer starting...");

    let previousValidDarts = [];

    function readDarts() {
      const els = document.getElementsByClassName(CFG.autodartsSpanClass);
      const darts = [];
      for (let i = 2; i < Math.min(5, els.length); i++) {
        darts.push(els[i].textContent.trim());
      }
      return darts;
    }

    function tick() {
      if (!getBridgeEnabled()) return;

      const currentDarts = readDarts();
      log("AD current:", JSON.stringify(currentDarts));

      // store valid darts before they reset
      const hasValue = currentDarts.some(d => d && d !== "-");
      if (hasValue) {
        previousValidDarts = currentDarts.slice();
      }

      // detect end of round: all three darts are "-" and we have previous valid darts
      const isEndOfRound =
        currentDarts.length === 3 &&
        currentDarts.every(d => d === "-") &&
        previousValidDarts.length === 3;

      if (isEndOfRound) {
        const payload = { darts: previousValidDarts.slice(), ts: Date.now() };
        GM_setValue(CFG.storeRoundKey, payload);
        log("Round published:", payload);
        previousValidDarts = [];
      }
    }

    pollIntervalId = setInterval(tick, CFG.pollIntervalMs);
    log("AutoDarts producer active.");
  }

  // --- Consumer: listen for round and auto-enter into DartCounter ---
  function startDartCounterConsumer() {
    if (roundChangeListenerActive) return; // already active

    log("DartCounter consumer starting...");

    function onRoundChanged(name, oldVal, newVal) {
      if (!getBridgeEnabled()) {
        log("Bridge disabled, ignoring round.");
        return;
      }
      if (!newVal?.darts) return;

      const dartValues = newVal.darts;
      const total = dartValues.map(dartToScore).reduce((a, b) => a + b, 0);

      const prevScores = readRemainingScoresDC();
      log("Prev scores:", prevScores);

      let ownIndex = GM_getValue(CFG.storeOwnIndexKey, null);
      if (ownIndex === null) {
        const guessed = guessOwnIndexFromLegScoresDC();
        if (guessed !== null) {
          ownIndex = guessed;
          GM_setValue(CFG.storeOwnIndexKey, ownIndex);
          log("Own index set to:", ownIndex);
        }
      }

      const scoreToEnter = decideScoreToEnter(total, ownIndex, prevScores, dartValues);
      const input = findScoreInputDC();

      if (!input) {
        notify("AD2DC-DartCounter Error", "Score input not found", true);
        log("Score input not found. Check selectors.");
        return;
      }

      // enter score: focus, clear, set value, dispatch events, press Enter
      input.focus();
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.value = String(scoreToEnter);
      input.dispatchEvent(new Event("input", { bubbles: true }));

      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        which: 13,
        keyCode: 13,
        bubbles: true
      });
      input.dispatchEvent(enterEvent);

      log("Score entered:", scoreToEnter);

      setTimeout(() => {
        const postScores = readRemainingScoresDC();
        log("Post scores:", postScores);
      }, 400);
    }

    GM_addValueChangeListener(CFG.storeRoundKey, onRoundChanged);
    roundChangeListenerActive = true;
  }
})();
