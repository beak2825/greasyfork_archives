// ==UserScript==
// @name         Smol - Veyra PvP Extension
// @namespace    http://violentmonkey.github.io/smol-veyra-pvp-extension
// @version      1.3
// @author       Smol
// @description  Enhanced PvP automation with draggable HUD, battle prediction, auto attack, auto surrender and X-times mode - can be integrates with Smol Script Extension Hub
// @match        https://demonicscans.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/550957/Smol%20-%20Veyra%20PvP%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/550957/Smol%20-%20Veyra%20PvP%20Extension.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // PvP automation variables
  var originalAlert = window.alert;
  var originalConfirm = window.confirm;
  var originalPrompt = window.prompt;

  // Initialize PvP localStorage if not exists
  if (localStorage.getItem('smol-pvp-automation') === null) {
    localStorage.setItem('smol-pvp-automation', 'false');
  }
  if (localStorage.getItem('smol-pvp-auto-surrend') === null) {
    localStorage.setItem('smol-pvp-auto-surrend', 'false');
  }
  if (localStorage.getItem('smol-pvp-automation-mode') === null) {
    localStorage.setItem('smol-pvp-automation-mode', 'all');
  }
  if (localStorage.getItem('smol-pvp-automation-x-count') === null) {
    localStorage.setItem('smol-pvp-automation-x-count', '0');
  }
  if (localStorage.getItem('smol-pvp-automation-x-remaining') === null) {
    localStorage.setItem('smol-pvp-automation-x-remaining', '0');
  }
  if (localStorage.getItem('smol-pvp-use-power-slash') === null) {
    localStorage.setItem('smol-pvp-use-power-slash', 'false');
  }
  if (localStorage.getItem('smol-script-expanded') === null) {
    localStorage.setItem('smol-script-expanded', 'false');
  }
  if (localStorage.getItem('smol-script-pvp-enabled') === null) {
    localStorage.setItem('smol-script-pvp-enabled', 'true');
  }

  // Initialize extension
  if (window.location.hostname === 'demonicscans.org') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setTimeout(() => initAsExtension(), 250));
    } else {
      setTimeout(() => initAsExtension(), 250);
    }
  }

  function initAsExtension() {
    const smolScript = window.smolScript ? window.smolScript : undefined
    
    if (smolScript) {
      const scriptExpanded = document.getElementById('script-expanded');
      if (scriptExpanded && !document.getElementById('pvp-script-toggle')) {
        const smolSettings = {
          scriptPvpEnabled: localStorage.getItem('smol-script-pvp-enabled') === 'true'
        };
        
        const pvpDiv = document.createElement('div');
        pvpDiv.innerHTML = `
          <div class="smol-script-item" style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px;">⚔️ PvP Script</span>
            <input type="checkbox" id="pvp-script-toggle" ${smolSettings.scriptPvpEnabled ? 'checked' : ''}></input>
          </div>
        `;
        scriptExpanded.appendChild(pvpDiv);
        
        document.getElementById('pvp-script-toggle').addEventListener('change', (e) => {
          localStorage.setItem('smol-script-pvp-enabled', e.target.checked.toString());
          window.location.reload();
        });
      }
    }
    if (localStorage.getItem('smol-script-pvp-enabled') === 'true' && (window.location.pathname === '/pvp.php' || window.location.pathname === '/pvp_battle.php')) {
      initPvPExtension();
    }
  }

  function initPvPExtension() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('pvp.php')) {
      initPvPMods();
    } else if (currentPath.includes('pvp_battle.php')) {
      initPvPBattleMods();
    }

    createPvPHUD();
  }

  function initPvPMods() {
    createPvPAutomationButton();
    initPvPAutomation();
  }

  function initPvPBattleMods() {
    initPvPAutomation();
    hideConflictingElements();
    startBattleStatsInterval();
  }

  var battleStatsInterval = null;
  var lastBattleStats = null;

  function startBattleStatsInterval() {
    if (battleStatsInterval) return;
    
    lastBattleStats = null;
    battleStatsInterval = setInterval(() => {
      if (getPvPAutomation()) {
        clearInterval(battleStatsInterval);
        battleStatsInterval = null;
        return;
      }
      
      readBattleStats();
      const currentStats = window.battleStats;
      
      if (!lastBattleStats || 
          lastBattleStats.enemyDamage !== currentStats.enemyDamage || 
          lastBattleStats.yourDamage !== currentStats.yourDamage) {
        updatePvPBattleStats();
        lastBattleStats = { ...currentStats };
        
        // Stop interval if stats are populated (content updated)
        if (currentStats.enemyDamage > 0 || currentStats.yourDamage > 0) {
          clearInterval(battleStatsInterval);
          battleStatsInterval = null;
        }
      }
    }, 500);
  }

  function stopBattleStatsInterval() {
    if (battleStatsInterval) {
      clearInterval(battleStatsInterval);
      battleStatsInterval = null;
    }
    lastBattleStats = null;
  }

  function hideConflictingElements() {
    setTimeout(() => {
      const autoSlashBtn = document.getElementById('auto-slash-btn');
      const pvpPredictionBox = document.getElementById('pvp-prediction-box');
      
      if (autoSlashBtn) {
        autoSlashBtn.style.display = 'none';
      }
      
      if (pvpPredictionBox) {
        pvpPredictionBox.style.display = 'none';
      }
    }, 400);
  }
  function createPvPHUD() {
    if (document.getElementById('pvp-hud-main')) return;

    const hud = document.createElement('div');
    hud.id = 'pvp-hud-main';
    hud.className = 'veyra-glass';
    
    // Load saved position or use default
    const savedPosition = localStorage.getItem('pvp-hud-position');
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      hud.style.cssText = `
        position: fixed;
        left: ${pos.left}px;
        top: ${pos.top}px;
        z-index: 2147483647;
      `;
    } else {
      hud.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 2147483647;
      `;
    }

    document.body.appendChild(hud);
    makeDraggable(hud);
    updatePvPHUD();
  }

  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    element.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('drag-handle')) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        element.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'default';
        // Save position to localStorage
        const rect = element.getBoundingClientRect();
        localStorage.setItem('pvp-hud-position', JSON.stringify({
          left: rect.left,
          top: rect.top
        }));
      }
    });
  }
  
  function updatePvPHUD() {
    const hud = document.getElementById('pvp-hud-main');
    if (!hud) return;

    const isRunning = getPvPAutomation();
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;
    const automationMode = localStorage.getItem('smol-pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('smol-pvp-automation-x-remaining') || '0');
    const isBattleOnly = localStorage.getItem('pvp-battle-only-mode') === 'true';
    const currentPath = window.location.pathname;
    const inBattlePage = currentPath.includes('pvp_battle.php');

    let statusText = 'Idle';
    if (isRunning) {
      statusText = isBattleOnly ? 'Attack Only' : 'Fully Automated';
    }

    const content = `
      <div class="veyra-header">
        <div class="veyra-title">Veyra — PVP</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="veyra-pill ${isRunning ? 'pill-live' : 'pill-stop'}">${isRunning ? 'RUNNING' : 'PAUSED'}</span>
          <div class="drag-handle" style="width: 16px; height: 16px; background: rgba(255,255,255,0.3); border-radius: 3px; cursor: grab; display: flex; align-items: center; justify-content: center; font-size: 10px;">⋮⋮</div>
        </div>
      </div>
      <div class="veyra-body">
        ${!inBattlePage || !isBattleOnly ? `
        <div class="veyra-row">
          <div>Mode</div>
          <div><select id="pvp-mode-select" class="veyra-select" ${isRunning ? 'disabled' : ''}>
            <option value="all" ${automationMode === 'all' ? 'selected' : ''}>All Coins</option>
            <option value="x" ${automationMode === 'x' ? 'selected' : ''}>X Times</option>
          </select></div>
        </div>
        <div class="veyra-row" id="x-count-row" style="display: ${automationMode === 'x' ? 'flex' : 'none'}">
          <div>Count</div>
          <div><input id="pvp-x-count" type="number" class="veyra-input" min="1" max="20" value="${localStorage.getItem('smol-pvp-automation-x-count') || '1'}" ${isRunning ? 'disabled' : ''}></div>
        </div>` : ''}
        <div class="veyra-row">
          <div>Auto PVP</div>
          <div><button id="pvp-hud-toggle" class="veyra-btn">${isRunning ? 'Stop' : 'Start'}</button></div>
        </div>
        <div class="veyra-row">
          <div>Use Power Slash</div>
          <div><input id="smol-pvp-use-power-slash" type="checkbox" ${localStorage.getItem('smol-pvp-use-power-slash') === 'true' ? 'checked' : ''}></div>
        </div>
        <div class="veyra-row">
          <div>Auto Surrender</div>
          <div><input id="smol-pvp-auto-surrender" type="checkbox" ${localStorage.getItem('smol-pvp-auto-surrend') === 'true' ? 'checked' : ''}></div>
        </div>
        ${!inBattlePage ? `
        <div class="veyra-row">
          <div>Coins</div>
          <div style="color:var(--glass-muted)">${coins}</div>
        </div>
        ${automationMode === 'x' && isRunning ? `<div class="veyra-row"><div>Remaining</div><div style="color:var(--glass-muted)">${remaining}</div></div>` : ''}` : ''}
        <div class="veyra-divider"></div>
        <div class="veyra-row">
          <div>Status</div>
          <div>${statusText}</div>
        </div>
      </div>
    `;

    hud.innerHTML = content;

    // Setup event listeners
    setTimeout(() => {
      const toggleBtn = document.getElementById('pvp-hud-toggle');
      const modeSelect = document.getElementById('pvp-mode-select');
      const xCountInput = document.getElementById('pvp-x-count');
      const xCountRow = document.getElementById('x-count-row');

      if (toggleBtn && !toggleBtn.hasAttribute('data-listener-added')) {
        toggleBtn.addEventListener('click', togglePvPFromHUD);
        toggleBtn.setAttribute('data-listener-added', 'true');
      }

      if (modeSelect && !modeSelect.hasAttribute('data-listener-added')) {
        modeSelect.addEventListener('change', (e) => {
          localStorage.setItem('smol-pvp-automation-mode', e.target.value);
          xCountRow.style.display = e.target.value === 'x' ? 'flex' : 'none';
        });
        modeSelect.setAttribute('data-listener-added', 'true');
      }

      if (xCountInput && !xCountInput.hasAttribute('data-listener-added')) {
        xCountInput.addEventListener('change', (e) => {
          const value = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
          localStorage.setItem('smol-pvp-automation-x-count', value.toString());
          e.target.value = value;
        });
        xCountInput.setAttribute('data-listener-added', 'true');
      }

      const usePowerSlashCheckbox = document.getElementById('smol-pvp-use-power-slash');
      if (usePowerSlashCheckbox && !usePowerSlashCheckbox.hasAttribute('data-listener-added')) {
        usePowerSlashCheckbox.addEventListener('change', (e) => {
          localStorage.setItem('smol-pvp-use-power-slash', e.target.checked.toString());
        });
        usePowerSlashCheckbox.setAttribute('data-listener-added', 'true');
      }

      const autoSurrenderCheckbox = document.getElementById('smol-pvp-auto-surrender');
      if (autoSurrenderCheckbox && !autoSurrenderCheckbox.hasAttribute('data-listener-added')) {
        autoSurrenderCheckbox.addEventListener('change', (e) => {
          localStorage.setItem('smol-pvp-auto-surrend', e.target.checked.toString());
        });
        autoSurrenderCheckbox.setAttribute('data-listener-added', 'true');
      }
    }, 100);
  }

  function togglePvPFromHUD() {
    const isRunning = getPvPAutomation();
    const currentPath = window.location.pathname;

    if (isRunning) {
      setPvPAutomation(false);
      localStorage.setItem('smol-pvp-automation-x-remaining', '0');
      showNotification('PvP automation stopped', 'info');
    } else {
      if (currentPath.includes('pvp_battle.php')) {
        // In battle page, just start attack loop and mark as battle-only mode
        stopBattleStatsInterval();
        localStorage.setItem('pvp-battle-only-mode', 'true');
        setPvPAutomation(true);
        showNotification('Attack loop started', 'success');
        startBattleLoop();
      } else {
        // In pvp.php or other pages, start full automation
        localStorage.removeItem('pvp-battle-only-mode');
        const coinsEl = document.querySelector('#pvp-coins');
        const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;
        const automationMode = localStorage.getItem('smol-pvp-automation-mode') || 'all';

        if (coins === 0) {
          showNotification('No PvP coins available', 'error');
          return;
        }

        if (automationMode === 'x') {
          const xCount = parseInt(localStorage.getItem('smol-pvp-automation-x-count') || '1');
          if (xCount > coins) {
            showNotification(`Not enough coins! You have ${coins} coins but need ${xCount}`, 'error');
            return;
          }
          localStorage.setItem('smol-pvp-automation-x-remaining', xCount.toString());
          showNotification(`Starting PvP automation for ${xCount} battles...`, 'success');
        } else {
          localStorage.setItem('smol-pvp-automation-x-remaining', '0');
          showNotification('Starting PvP automation for all coins...', 'success');
        }

        setPvPAutomation(true);

        if (!window.location.pathname.includes('pvp.php') && !window.location.pathname.includes('pvp_battle.php')) {
          window.location.href = 'pvp.php';
        } else {
          startPvPAutomation();
        }
      }
    }

    updatePvPHUD();
  }

  function createPvPAutomationButton() {
    const heroRow = document.querySelector('.hero-row');
    const btnStartTop = document.getElementById('btnStartTop');

    if (heroRow && btnStartTop && !document.getElementById('btnAutomationAllPvp')) {
      const automationAllBtn = document.createElement('button');
      automationAllBtn.id = 'btnAutomationAllPvp';
      automationAllBtn.className = 'hero-btn';
      automationAllBtn.title = 'PvP Automation All Coin';
      automationAllBtn.draggable = false;
      automationAllBtn.textContent = 'Automate PvP (All Coins)';

      automationAllBtn.addEventListener('click', togglePvPAutomationAll);
      btnStartTop.insertAdjacentElement('afterend', automationAllBtn);
      updatePvPHeroButtonState();
    }
  }

  function updatePvPHeroButtonState() {
    const allBtn = document.getElementById('btnAutomationAllPvp');
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 1;
    const isRunning = getPvPAutomation();

    if (allBtn) {
      if (coins === 0 && !isRunning) {
        allBtn.disabled = true;
        allBtn.style.cursor = 'not-allowed';
        allBtn.textContent = 'No PvP Coins';
        allBtn.style.background = '#6c7086';
      } else {
        allBtn.disabled = false;
        allBtn.style.cursor = 'pointer';
        if (isRunning) {
          allBtn.textContent = 'Stop PvP';
          allBtn.style.background = '#f38ba8';
        } else {
          allBtn.textContent = 'Automate PvP (All Coins)';
          allBtn.style.background = '';
        }
      }
    }
  }

  function initPvPAutomation() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('pvp_battle.php')) {
      if (getPvPAutomation()) {
        window.alert = () => true;
        window.confirm = () => true;
        window.prompt = () => true;
      }

      createPvPBattleHUD();
      createPvPStopButton();

      if (getPvPAutomation()) {
        startBattleLoop();
      }
    } else if (currentPath.includes('pvp.php')) {
      updatePvPHeroButtonState();
      if (getPvPAutomation()) {
        setTimeout(checkCoinsAndBattle, 1000);
      }
    }
  }

  function createPvPBattleHUD() {
    const myHpText = document.getElementById('myHpText');
    if (!myHpText || document.getElementById('pvp-battle-hud')) return;

    const hudDiv = document.createElement('div');
    hudDiv.id = 'pvp-battle-hud';
    hudDiv.innerHTML = `
      <div style="border-bottom: 1px solid; margin: 8px 0;"></div>
      <div>
        <div>⚔️ Enemy Damage: <span id="pvp-stats-enemy-damage">0</span></div>
        <div style="margin-bottom: 10px">⚔️ Your Damage: <span id="pvp-stats-your-damage">0</span></div>
        <div class="pvp-chip" id="pvp-prediction">Waiting Attack</div>
      </div>
      <div style="border-bottom: 1px solid; margin: 8px 0;"></div>
    `;

    myHpText.insertAdjacentElement('afterend', hudDiv);
  }

  function createPvPStopButton() {
    const attackBtnWrap = document.querySelector('.attack-btn-wrap');
    if (!attackBtnWrap || document.getElementById('pvp-stop-btn')) return;

    const stopBtn = document.createElement('button');
    stopBtn.id = 'pvp-stop-btn';
    stopBtn.style.cssText = `
      background: linear-gradient(180deg, #74c0fc, #5aa3e0);
      border: 1px solid #88ccffff;
      color: white;
      padding: 10px 14px;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 8px 18px rgb(238 59 125 / 28%);
      min-width: 140px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: .2px;
      line-height: 1rem;
    `;

    stopBtn.addEventListener('click', handlePvPStopButtonClick);
    attackBtnWrap.appendChild(stopBtn);
    updatePvPStopButtonState();
  }

  function updatePvPStopButtonState() {
    const stopBtn = document.getElementById('pvp-stop-btn');
    if (!stopBtn) return;

    const isPvPRunning = getPvPAutomation();

    if (isPvPRunning) {
      stopBtn.textContent = '⏹️ Stop Auto';
      stopBtn.style.background = 'linear-gradient(180deg, #eb4582, #d33855)';
      stopBtn.style.border = '1px solid #ef6095';
    } else {
      stopBtn.textContent = '⚔️ Start Auto';
      stopBtn.style.background = 'linear-gradient(180deg, #74c0fc, #5aa3e0)';
      stopBtn.style.border = '1px solid #88ccffff';
    }
  }

  function handlePvPStopButtonClick() {
    const isPvPRunning = getPvPAutomation();

    if (isPvPRunning) {
      setPvPAutomation(false);
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
      localStorage.setItem('smol-pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      updatePvPStopButtonState();
      showNotification('Attack loop stopped', 'info');
    } else {
      // In battle page, just start attack loop and mark as battle-only mode
      stopBattleStatsInterval();
      localStorage.setItem('pvp-battle-only-mode', 'true');
      setPvPAutomation(true);
      updatePvPStopButtonState();
      showNotification('Attack loop started', 'success');
      startBattleLoop();
    }

    updatePvPHUD();
  }

  function updatePvPBattleStats() {
    const enemyDamageEl = document.getElementById('pvp-stats-enemy-damage');
    const yourDamageEl = document.getElementById('pvp-stats-your-damage');
    const predictionEl = document.getElementById('pvp-prediction');

    if (!enemyDamageEl || !yourDamageEl || !predictionEl) return;

    readBattleStats();
    const stats = window.battleStats || { enemyDamage: 0, yourDamage: 0 };

    enemyDamageEl.textContent = stats.enemyDamage;
    yourDamageEl.textContent = stats.yourDamage;

    if (stats.enemyDamage === 0 || stats.yourDamage === 0) {
      predictionEl.textContent = 'Waiting Attack';
      predictionEl.className = 'pvp-chip';
    } else {
      const enemyHealthEl = document.getElementById('enemyHpText');
      const yourHealthEl = document.getElementById('myHpText');

      const enemyMaxHealth = enemyHealthEl ? parseInt(enemyHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;
      const yourMaxHealth = yourHealthEl ? parseInt(yourHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;

      const atkNeeded = enemyMaxHealth / stats.yourDamage;
      const enemyAtkNeeded = yourMaxHealth / stats.enemyDamage;

      if (enemyAtkNeeded > atkNeeded) {
        predictionEl.textContent = 'You will WIN';
        predictionEl.className = 'pvp-chip success';
      } else {
        predictionEl.textContent = 'You will LOSE';
        predictionEl.className = 'pvp-chip danger';
      }
    }
  }

  // PvP Automation System
  function getPvPAutomation() {
    return localStorage.getItem('smol-pvp-automation') === 'true';
  }

  function setPvPAutomation(value) {
    localStorage.setItem('smol-pvp-automation', value.toString());
  }

  function togglePvPAutomationAll() {
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;
    const isRunning = getPvPAutomation();

    if (isRunning) {
      setPvPAutomation(false);
      localStorage.setItem('smol-pvp-automation-mode', 'all');
      localStorage.setItem('smol-pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      showNotification('PvP automation stopped', 'info');
      return;
    }

    if (coins === 0) {
      showNotification('No PvP coins available', 'error');
      return;
    }

    localStorage.setItem('smol-pvp-automation-mode', 'all');
    localStorage.setItem('smol-pvp-automation-x-remaining', '0');
    setPvPAutomation(true);
    updatePvPHeroButtonState();

    if (!window.location.pathname.includes('pvp.php') && !window.location.pathname.includes('pvp_battle.php')) {
      showNotification('Starting PvP automation for all coins...', 'success');
      window.location.href = 'pvp.php';
    } else {
      showNotification('Starting PvP automation for all coins...', 'success');
      startPvPAutomation();
    }
  }

  function startPvPAutomation() {
    if (!getPvPAutomation()) return;

    if (window.location.pathname.includes('pvp.php')) {
      checkCoinsAndBattle();
    } else if (window.location.pathname.includes('pvp_battle.php')) {
      startBattleLoop();
    }
  }

  function checkCoinsAndBattle() {
    if (!getPvPAutomation()) return;

    const coinsEl = document.querySelector('#pvp-coins');
    if (!coinsEl) {
      setTimeout(checkCoinsAndBattle, 1000);
      return;
    }

    const coins = parseInt(coinsEl.textContent);
    const automationMode = localStorage.getItem('smol-pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('smol-pvp-automation-x-remaining') || '0');

    // Check stopping conditions
    if (automationMode === 'x' && remaining <= 0) {
      showNotification('PvP automation completed', 'success');
      setPvPAutomation(false);
      localStorage.setItem('smol-pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      return;
    }

    if (coins <= 0) {
      showNotification('No more PVP coins available', 'warning');
      setPvPAutomation(false);
      localStorage.setItem('smol-pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      updatePvPHUD();
      return;
    }

    performSingleBattle().then(async () => {
      setTimeout(() => {
        window.location.href = 'https://demonicscans.org/pvp.php';
      }, 1000);
    });
  }

  function performSingleBattle() {
    const automationMode = localStorage.getItem('smol-pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('smol-pvp-automation-x-remaining') || '0');

    if (automationMode === 'x') {
      const newRemaining = remaining - 1;
      localStorage.setItem('smol-pvp-automation-x-remaining', newRemaining.toString());
    }

    return new Promise((resolve) => {
      const startBtn = document.querySelector('#btnStartTop');
      if (!startBtn) {
        resolve();
        return;
      }

      startBtn.click();

      const attackLoop = async () => {
        if (!getPvPAutomation()) {
          resolve();
          return;
        }

        const endBody = document.querySelector('#endBody');
        if (endBody && endBody.textContent.trim() !== '') {
          resolve();
          return;
        }

        // Check for auto surrender
        if (localStorage.getItem('smol-pvp-auto-surrend') === 'true') {
          const stats = window.battleStats;
          if (stats && stats.enemyDamage > 0 && stats.yourDamage > 0) {
            const enemyHealthEl = document.getElementById('enemyHpText');
            const yourHealthEl = document.getElementById('myHpText');

            const enemyMaxHealth = enemyHealthEl ? parseInt(enemyHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;
            const yourMaxHealth = yourHealthEl ? parseInt(yourHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;

            const atkNeeded = enemyMaxHealth / stats.yourDamage;
            const enemyAtkNeeded = yourMaxHealth / stats.enemyDamage;

            if (enemyAtkNeeded < atkNeeded) {
              const surrenderBtn = document.getElementById('btnSurrender');
              if (surrenderBtn) {
                surrenderBtn.click();
                resolve();
                return;
              }
            }
          }
        }

        const attackBtn = document.querySelector('.attack-btn.skill-btn[data-cost="1"]');
        if (attackBtn && attackBtn.offsetParent !== null) {
          attackBtn.click();
          setTimeout(() => {
            readBattleStats();
            updatePvPBattleStats();
          }, 500);
        }

        setTimeout(attackLoop, 1070);
      };

      attackLoop();
    });
  }

  function startBattleLoop() {
    if (!getPvPAutomation()) return;
    const attackCoinsElement = document.getElementById('pvpCoinsSpan');
    const attackCoins = attackCoinsElement ? parseInt(attackCoinsElement.textContent) : 0;

    const endBody = document.querySelector('#endBody');
    if (endBody && endBody.textContent.trim() !== '') {
      // Check if this is battle-only mode (triggered from battle page buttons)
      if (localStorage.getItem('pvp-battle-only-mode') === 'true') {
        setPvPAutomation(false);
        localStorage.removeItem('pvp-battle-only-mode');
        updatePvPStopButtonState();
        updatePvPHUD();
        showNotification('Battle finished - Attack loop stopped', 'info');
        return;
      }
      
      // Full automation mode - continue to next battle
      setTimeout(() => {
        window.location.href = 'https://demonicscans.org/pvp.php';
      }, 2000);
      return;
    }

    // Check for auto surrender
    if (localStorage.getItem('smol-pvp-auto-surrend') === 'true') {
      const stats = window.battleStats;
      if (stats && stats.enemyDamage > 0 && stats.yourDamage > 0) {
        const enemyHealthEl = document.getElementById('enemyHpText');
        const yourHealthEl = document.getElementById('myHpText');

        const enemyMaxHealth = enemyHealthEl ? parseInt(enemyHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;
        const yourMaxHealth = yourHealthEl ? parseInt(yourHealthEl.textContent.split('/')[1].replace(/[^0-9,.]/g, '')) : 0;

        const atkNeeded = enemyMaxHealth / stats.yourDamage;
        const enemyAtkNeeded = yourMaxHealth / stats.enemyDamage;

        if (enemyAtkNeeded <= atkNeeded) {
          const surrenderBtn = document.getElementById('btnSurrender');
          if (surrenderBtn) {
            surrenderBtn.click();
            setTimeout(() => {
              window.location.href = 'https://demonicscans.org/pvp.php';
            }, 2000);
            return;
          }
        }
      }
    }

    const attackBtn = document.querySelector('.attack-btn.skill-btn[data-cost="1"]');
    const attackBtnPower = document.querySelector('.attack-btn.skill-btn.power[data-cost="5"]');
    const usePowerSlash = localStorage.getItem('smol-pvp-use-power-slash') === true || localStorage.getItem('smol-pvp-use-power-slash') === 'true';

    if (usePowerSlash && attackBtnPower && attackCoins >= 5) {
      attackBtnPower.click();
    } else if (attackBtn) {
      attackBtn.click();
    }
    setTimeout(() => {
      readBattleStats();
      updatePvPBattleStats();
    }, 500);

    setTimeout(startBattleLoop, 1000);
  }

  function readBattleStats() {
    const logItems = document.querySelectorAll('#logWrap .log-item .log-left');
    const enemyDamage = logItems.length > 0 ? logItems[0].querySelector('strong')?.innerText || 0 : 0;
    const yourDamage = logItems.length > 1 ? logItems[1].querySelector('strong')?.innerText || 0 : 0;

    window.battleStats = {
      enemyDamage: parseInt(enemyDamage.toString().replace(/,/g, '')) || 0,
      yourDamage: parseInt(yourDamage.toString().replace(/,/g, '')) || 0
    };
  }

  function showNotification(msg, type = 'success') {
    let note = document.getElementById('pvp-notification');
    if (!note) {
      note = document.createElement('div');
      note.id = 'pvp-notification';
      note.style.cssText = `position: fixed; top: 90px; right: 20px; background: #2ecc71; color: white; padding: 12px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); font-size: 15px; display: none; z-index: 9999;`;
      document.body.appendChild(note);
    }

    let emoji = '';
    if (type === 'success') emoji = '✅ ';
    else if (type === 'error') emoji = '❌ ';
    else if (type === 'warning') emoji = '⚠️ ';
    else if (type === 'info') emoji = 'ℹ️ ';

    note.innerHTML = emoji + msg;

    if (type === 'error') {
      note.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else if (type === 'warning') {
      note.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
    } else if (type === 'info') {
      note.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    } else {
      note.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    }

    note.style.display = 'block';
    setTimeout(() => {
      note.style.display = 'none';
    }, 4000);
  }

  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    :root{
      --glass-bg: rgba(255,255,255,0.06);
      --glass-border: rgba(255,255,255,0.08);
      --glass-text: #e6eef8;
      --glass-muted: #b6c2d3;
      --accent: #3aa3ff;
      --danger: #ff6b6b;
    }

    .veyra-glass {
      background: var(--glass-bg);
      color: var(--glass-text);
      backdrop-filter: blur(12px) saturate(120%);
      -webkit-backdrop-filter: blur(12px) saturate(120%);
      border: 1px solid var(--glass-border);
      border-radius: 14px;
      padding: 12px;
      min-width: 260px;
      box-shadow: 0 8px 30px rgba(2,6,23,0.6);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
      user-select: none;
      box-sizing: border-box;
    }

    .veyra-header { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; }
    .veyra-title { font-weight:700; font-size:14px; }
    .veyra-body { display:block; }
    .veyra-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0; }

    .veyra-btn {
      padding:6px 8px;
      border-radius:8px;
      border:none;
      cursor:pointer;
      background:linear-gradient(180deg,#3aa3ff,#1b7ed6);
      color:white;
    }

    .veyra-divider { height:1px; background:rgba(255,255,255,0.04); margin:8px 0; border-radius:2px; }

    .veyra-pill { font-size:11px; padding:4px 8px; border-radius:999px; }
    .pill-live { background:rgba(34,197,94,0.18); color:#c7ffd3; border:1px solid rgba(34,197,94,0.22); }
    .pill-stop { background:rgba(239,68,68,0.12); color:#ffd6d6; border:1px solid rgba(239,68,68,0.18); }

    .pvp-chip {
      text-align: center;
      color: #fafafa;
      border-radius: 999px;
      padding: 4px 6px;
      font-weight: 600;
      font-size: 12px;
    }

    .pvp-chip.danger {
      color: #bb2d2d;
      border: 1px solid #d33939;
    }

    .pvp-chip.success {
      color: #3ddd65;
      border: 1px solid #45e26d;
    }

    .veyra-select, .veyra-input {
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.04);
      color: var(--glass-text);
      font-size: 12px;
      width: 80px;
    }

    .veyra-select:disabled, .veyra-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);



})();