// ==UserScript==
// @name         HP Zero Alarm
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Alert when HP reaches zero in Milky Way Idle combat
// @match        https://www.milkywayidle.com/game*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563790/HP%20Zero%20Alarm.user.js
// @updateURL https://update.greasyfork.org/scripts/563790/HP%20Zero%20Alarm.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ============================================================================
  // CONFIGURATION - Change these values to customize behavior
  // ============================================================================

  const CONFIG = {
    hpBarSelector: '[class*="HitpointsBar_hpValue"]', // Matches any class containing this
    checkIntervalMs: 500, // How often to check HP (milliseconds)
    beepFrequencyHz: 380, // Beep pitch (880 = A5 musical note)
    beepDurationSec: 3, // How long each beep lasts
    beepIntervalSec: 1, // Time between continuous beeps
    lowHPThreshold: 1, // Alert when HP drops below this value
  };

  // ============================================================================
  // STATE - Variables that track what's happening
  // ============================================================================

  let wasLowHPOnLastCheck = false; // Prevents beeping multiple times
  let audioContext = null; // Web Audio API context (created lazily)
  let statusBox = null; // The visual indicator box
  let beepInterval = null; // Interval for continuous beeping
  let isMuted = false; // Whether sound is muted

  // ============================================================================
  // VISUAL INDICATOR - Shows what the script is detecting
  // ============================================================================

  function createStatusBox() {
    statusBox = document.createElement("div");

    // Position it in top-right corner, above everything else
    statusBox.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 10px 15px;
      background: #333;
      color: white;
      border-radius: 5px;
      font-family: monospace;
      font-size: 14px;
      z-index: 99999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      cursor: move;
      user-select: none;
    `;

    statusBox.innerHTML = `
      <div style="margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: bold;">🎯 HP Zero Alarm</span>
        <button id="mute-button" style="
          background: #555;
          border: none;
          color: white;
          padding: 3px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          margin-left: 10px;
        ">🔊 Mute</button>
      </div>
      <div id="battle-status" style="margin-bottom: 3px;">
        Battle Tab: <span style="color: #ff4444;">❌ Not Active</span>
      </div>
      <div id="hp-status">
        HP Value: <span style="color: #ff4444;">❌ Not Found</span>
      </div>
    `;

    document.body.appendChild(statusBox);

    // Make it draggable
    makeDraggable(statusBox);

    // Setup mute button
    const muteButton = statusBox.querySelector("#mute-button");
    muteButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent dragging when clicking button
      toggleMute();
    });
  }

  function toggleMute() {
    isMuted = !isMuted;
    const muteButton = statusBox.querySelector("#mute-button");

    if (isMuted) {
      muteButton.textContent = "🔇 Unmute";
      muteButton.style.background = "#aa4444";

      // Stop any currently playing beeps
      if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
      }
    } else {
      muteButton.textContent = "🔊 Mute";
      muteButton.style.background = "#555";
    }
  }

  function makeDraggable(element) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    element.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
      element.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      element.style.left = x + "px";
      element.style.top = y + "px";
      element.style.right = "auto"; // Remove right positioning
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = "move";
      }
    });
  }

  function updateStatusBox(isBattleActive, currentHP) {
    // Create the box if it doesn't exist yet
    if (!statusBox) {
      createStatusBox();
    }

    const battleStatusText = statusBox.querySelector("#battle-status span");
    const hpStatusText = statusBox.querySelector("#hp-status span");

    // Show if we're on a battle tab
    if (isBattleActive) {
      battleStatusText.innerHTML =
        '✅ <span style="color: #44ff44;">Active</span>';
      statusBox.style.background = "#1a4d1a"; // Dark green background
    } else {
      battleStatusText.innerHTML =
        '❌ <span style="color: #ff4444;">Not Active</span>';
      statusBox.style.background = "#333"; // Gray background
    }

    // Show current HP value with color coding
    if (currentHP !== null) {
      const hpColor = getHPColor(currentHP);
      hpStatusText.innerHTML = `✅ <span style="color: ${hpColor}; font-weight: bold;">${currentHP} HP</span>`;
    } else {
      hpStatusText.innerHTML =
        '❌ <span style="color: #ff4444;">Not Found</span>';
    }
  }

  function getHPColor(hp) {
    if (hp === 0) return "#ff4444"; // Red = dead
    if (hp < CONFIG.lowHPThreshold) return "#ffaa44"; // Orange = low
    return "#44ff44"; // Green = healthy
  }

  function flashStatusBoxRed() {
    if (!statusBox) return;

    statusBox.style.background = "#cc0000"; // Bright red
    statusBox.style.animation = "pulse 0.5s ease-in-out infinite";
  }

  function stopFlashingStatusBox() {
    if (!statusBox) return;

    statusBox.style.background = "#1a4d1a"; // Back to green
    statusBox.style.animation = "";
  }

  // ============================================================================
  // BATTLE DETECTION - Check if we're on a battle tab
  // ============================================================================

  function isOnBattleTab() {
    // Find the currently selected tab
    const activeTab = document.querySelector(
      'button[role="tab"][aria-selected="true"]'
    );

    if (!activeTab) {
      return false; // No tab is selected
    }

    // Check if it's a battle tab (contains "Battle #52" or similar)
    return activeTab.textContent.includes("Battle #");
  }

  // ============================================================================
  // HP DETECTION - Read the current HP value from the page
  // ============================================================================

  function readCurrentHP() {
    // Find all combat units on the page
    const combatUnits = document.querySelectorAll(
      '[class*="CombatUnit_combatUnit"]'
    );

    if (combatUnits.length === 0) {
      return null; // No combat units found
    }

    // In solo play or when you're first, use the first unit
    // In group play, try to find YOUR unit (has your character name)
    let targetUnit = combatUnits[0]; // Default to first unit

    // Try to find your unit by checking if it's the leftmost/first in battle layout
    // The game typically shows your character first
    for (const unit of combatUnits) {
      const hpBar = unit.querySelector(CONFIG.hpBarSelector);
      if (hpBar) {
        targetUnit = unit;
        break; // Use the first one with an HP bar (usually yours)
      }
    }

    // Now find the HP display element within the target unit
    const hpElement = targetUnit.querySelector(CONFIG.hpBarSelector);

    if (!hpElement) {
      return null; // HP element not found
    }

    const displayText = hpElement.textContent.trim();

    // Extract the first number from "1613/1962" format
    const numberMatch = displayText.match(/\d+/);

    if (!numberMatch) {
      return null; // No number found in the text
    }

    return parseInt(numberMatch[0], 10);
  }

  // ============================================================================
  // AUDIO ALERT - Play a beep sound
  // ============================================================================

  function playBeep() {
    // Don't play if muted
    if (isMuted) {
      return;
    }

    // Create audio context on first use (some browsers require user interaction)
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume if browser suspended it (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Create the beep sound
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.frequency.value = CONFIG.beepFrequencyHz;
    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    // Play and fade out to avoid clicking sound at the end
    oscillator.start();
    volume.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + CONFIG.beepDurationSec
    );
    oscillator.stop(audioContext.currentTime + CONFIG.beepDurationSec);
  }

  // ============================================================================
  // MAIN LOGIC - The heart of the script
  // ============================================================================

  function checkHPAndAlert() {
    const isBattleActive = isOnBattleTab();
    const currentHP = readCurrentHP();

    // Always update the visual indicator
    updateStatusBox(isBattleActive, currentHP);

    // Don't do anything if we're not in battle or can't read HP
    if (!isBattleActive || currentHP === null) {
      return;
    }

    // ALARM! HP dropped below threshold
    if (currentHP < CONFIG.lowHPThreshold && !wasLowHPOnLastCheck) {
      console.warn(
        `⚠️ HP BELOW ${CONFIG.lowHPThreshold}! Current: ${currentHP}`
      );
      playBeep();
      flashStatusBoxRed();

      // Start continuous beeping
      beepInterval = setInterval(() => {
        playBeep();
      }, CONFIG.beepIntervalSec * 1000);

      wasLowHPOnLastCheck = true; // Don't restart beeping until HP recovers
    }

    // HP recovered - ready to beep again next time it drops
    if (currentHP >= CONFIG.lowHPThreshold && wasLowHPOnLastCheck) {
      stopFlashingStatusBox();

      // Stop continuous beeping
      if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
      }

      wasLowHPOnLastCheck = false;
    }
  }

  // ============================================================================
  // STARTUP - Initialize and start monitoring
  // ============================================================================

  function startScript() {
    // Add CSS for the pulsing animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { background: #cc0000; }
        50% { background: #ff3333; }
      }
    `;
    document.head.appendChild(style);

    // Create the status indicator
    createStatusBox();

    // Start checking HP repeatedly
    setInterval(checkHPAndAlert, CONFIG.checkIntervalMs);

    console.log(
      `✅ HP Zero Alarm started - checking every ${CONFIG.checkIntervalMs}ms`
    );
  }

  // Wait 1 second for page to load, then start
  setTimeout(startScript, 1000);
})();
