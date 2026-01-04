// ==UserScript==
// @name         GeoGuessr Flashlight Game Mode
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Adds a flashlight game mode to Single Player and Multiplayer, and lowered battery recharge delay.
// @author       Odinman9847
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555579/GeoGuessr%20Flashlight%20Game%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/555579/GeoGuessr%20Flashlight%20Game%20Mode.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // --- Configuration ---
  const flashlightRadius = 150
  const flashlightFeather = 250
  const darknessColor = 'rgba(0, 0, 0, 1)'
  const batteryDurationSeconds = 5
  const rechargeDelayMilliseconds = 500
  // -------------------

  const overlayId = 'geoguessr-flashlight-overlay'
  const batteryBarId = 'geoguessr-battery-bar'
  const tooltipId = 'geoguessr-flashlight-tooltip'

  // --- Selectors ---
  const singlePlayerGameSelector = '[class*="in-game_root"]'
  const singlePlayerResultSelector = '[class*="result-layout"]'
  // Using '^=' to only match classes that start with 'duels_root'
  const multiplayerGameSelector = '[class^="duels_root"]'
  const multiplayerResultSelector = '[class*="round-score"]'
  // Selector for when you are spectating your opponent
  const spectatorSelector = '[class*="post-guess-player-spectator_root"]'

  // --- Game State Variables ---
  let isFlashlightOn = false
  let batteryLevel = 100
  let batteryUpdateInterval = null
  let rechargeDelayTimestamp = 0
  let lastMouseX = window.innerWidth / 2
  let lastMouseY = window.innerHeight / 2

  // --- Core Functions ---

  function applyFlashlightEffect(event = null) {
    const overlay = document.getElementById(overlayId)
    if (!overlay) return
    if (event) {
      lastMouseX = event.clientX
      lastMouseY = event.clientY
    }
    if (!isFlashlightOn) return
    const radius = flashlightRadius
    const feather = flashlightFeather
    overlay.style.background = `radial-gradient(
            circle at ${lastMouseX}px ${lastMouseY}px,
            transparent ${radius}px,
            rgba(0, 0, 0, 0.08) ${radius + feather * 0.2}px,
            rgba(0, 0, 0, 0.32) ${radius + feather * 0.4}px,
            rgba(0, 0, 0, 0.68) ${radius + feather * 0.6}px,
            rgba(0, 0, 0, 0.92) ${radius + feather * 0.8}px,
            ${darknessColor} ${radius + feather}px
        )`
  }

  function toggleFlashlight(forceState = null) {
    if (forceState === null && !isFlashlightOn && batteryLevel <= 0) {
      return
    }
    const overlay = document.getElementById(overlayId)
    if (!overlay) return
    const oldState = isFlashlightOn
    isFlashlightOn = forceState !== null ? forceState : !isFlashlightOn
    if (isFlashlightOn) {
      applyFlashlightEffect()
    } else {
      overlay.style.background = darknessColor
      if (oldState === true) {
        rechargeDelayTimestamp = Date.now()
      }
    }
  }

  function handleRightClick(event) {
    event.preventDefault()
    toggleFlashlight()
  }

  function updateBattery() {
    const updateAmount = 100 / (batteryDurationSeconds * 20)
    if (isFlashlightOn) {
      batteryLevel -= updateAmount
    } else {
      if (Date.now() - rechargeDelayTimestamp > rechargeDelayMilliseconds) {
        batteryLevel += updateAmount
      }
    }
    batteryLevel = Math.max(0, Math.min(100, batteryLevel))
    const batteryFill = document.querySelector(`#${batteryBarId} > div`)
    if (batteryFill) {
      batteryFill.style.width = `${batteryLevel}%`
    }
    if (batteryLevel <= 0 && isFlashlightOn) {
      toggleFlashlight(false)
    }
  }

  // --- UI and Game State Management ---

  function createGameUI() {
    const overlay = document.createElement('div')
    overlay.id = overlayId
    document.body.appendChild(overlay)
    const batteryContainer = document.createElement('div')
    batteryContainer.id = batteryBarId
    const batteryFill = document.createElement('div')
    batteryContainer.appendChild(batteryFill)
    document.body.appendChild(batteryContainer)
    const tooltip = document.createElement('div')
    tooltip.id = tooltipId
    tooltip.textContent = 'Right-click to toggle flashlight'
    document.body.appendChild(tooltip)
    GM_addStyle(`
            #${overlayId} { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99998; pointer-events: none; background-color: ${darknessColor}; }
            #${batteryBarId} { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); width: 300px; height: 20px; background-color: #222; border: 2px solid #555; border-radius: 5px; z-index: 99999; pointer-events: none; }
            #${batteryBarId} > div { height: 100%; width: ${batteryLevel}%; background-color: #6a994e; transition: width 0.05s linear; }
            #${tooltipId} { position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%); color: #ccc; font-family: sans-serif; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); z-index: 99999; pointer-events: none; }
        `)
    window.addEventListener('mousemove', applyFlashlightEffect)
    document.addEventListener('contextmenu', handleRightClick)
    batteryUpdateInterval = setInterval(updateBattery, 50)
  }

  function destroyGameUI() {
    clearInterval(batteryUpdateInterval)
    window.removeEventListener('mousemove', applyFlashlightEffect)
    document.removeEventListener('contextmenu', handleRightClick)
    const overlay = document.getElementById(overlayId)
    const batteryBar = document.getElementById(batteryBarId)
    const tooltip = document.getElementById(tooltipId)
    if (overlay) overlay.remove()
    if (batteryBar) batteryBar.remove()
    if (tooltip) tooltip.remove()
    isFlashlightOn = false
    batteryLevel = 100
    rechargeDelayTimestamp = 0
  }

  function checkGameState() {
    const singlePlayerGameElement = document.querySelector(singlePlayerGameSelector)
    const singlePlayerResultElement = document.querySelector(singlePlayerResultSelector)
    const multiplayerGameElement = document.querySelector(multiplayerGameSelector)
    const multiplayerResultElement = document.querySelector(multiplayerResultSelector)
    const spectatorElement = document.querySelector(spectatorSelector)

    const isSinglePlayerActive = singlePlayerGameElement && !singlePlayerResultElement
    // Multiplayer is now also deactivated by the spectator element
    const isMultiplayerActive =
      multiplayerGameElement && !multiplayerResultElement && !spectatorElement

    const shouldGameBeActive = isSinglePlayerActive || isMultiplayerActive

    const isUiActive = document.getElementById(overlayId)
    if (shouldGameBeActive && !isUiActive) {
      createGameUI()
    } else if (!shouldGameBeActive && isUiActive) {
      destroyGameUI()
    }
  }

  const observer = new MutationObserver(checkGameState)
  observer.observe(document.body, { childList: true, subtree: true })
  checkGameState()
})()