// ==UserScript==
// @name         Veyra - Extension Overhaul
// @namespace    http://violentmonkey.github.io/smol-veyra-extension-overhaul
// @version      0.40
// @author       Smol
// @description  Comprehensive game enhancement suite featuring advanced sidebar navigation, PvP/farming automation, real-time stats, inventory management, battle enhancements, monster filtering, damage calculation, secure auto-login, customizable themes, and mobile-responsive design for demonicscans.org
// @match        https://demonicscans.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550617/Veyra%20-%20Extension%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/550617/Veyra%20-%20Extension%20Overhaul.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Global variables
  var alarmInterval = null;
  var monsterFiltersSettings = {"nameFilter":"","hideImg":false, "battleLimitAlarm":false, "battleLimitAlarmSound":true, "battleLimitAlarmVolume":70, "monsterTypeFilter":[], "hpFilter":"", "playerCountFilter":"", "waveFilter":""}
  var isMobileView = window.innerWidth <= 600;
  var resizeListener = null;

  // Mobile state detection listener
  window.addEventListener('resize', () => {
    isMobileView = window.innerWidth <= 600;
  });

  // Embedded encryption utilities
  class SecureCredentials {
    constructor() {
      this.storageKey = 'veyra_encryption_key';
      this.encryptionKey = this.getOrCreateKey();
    }

    getOrCreateKey() {
      let key = sessionStorage.getItem(this.storageKey);

      if (!key) {
        const fingerprint = btoa(
          navigator.userAgent +
          navigator.platform +
          navigator.language +
          screen.width +
          screen.height +
          Date.now().toString().slice(0, 5)
        );

        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
          const char = fingerprint.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        key = Math.abs(hash).toString(36).substring(0, 16);
        sessionStorage.setItem(this.storageKey, key);
      }

      return key;
    }

    encrypt(data) {
      const key = this.encryptionKey;
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return btoa(result);
    }

    decrypt(encryptedData) {
      const key = this.encryptionKey;
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    }

    saveEmail(email) {
      if (email) {
        const encrypted = this.encrypt(email);
        sessionStorage.setItem('autologin-email', encrypted);
      }
    }

    savePassword(password) {
      if (password) {
        const encrypted = this.encrypt(password);
        sessionStorage.setItem('autologin-password', encrypted);
      }
    }

    getEmail() {
      const encrypted = sessionStorage.getItem('autologin-email');
      return encrypted ? this.decrypt(encrypted) : '';
    }

    getPassword() {
      const encrypted = sessionStorage.getItem('autologin-password');
      return encrypted ? this.decrypt(encrypted) : '';
    }
  }

  // Enhanced settings management
  var extensionSettings = {
    statAllocationCollapsed: true,
    statsExpanded: false,
    petsExpanded: false,
    blacksmithExpanded: false,
    continueBattlesExpanded: true,
    lootExpanded: true,
    merchantExpanded: false,
    inventoryExpanded: false,
    pinnedMerchantItems: [],
    pinnedInventoryItems: [],
    multiplePotsEnabled: false,
    multiplePotsCount: 3,
    pinnedItemsLimit: 3,
    automationExpanded: false,
    sidebarVisible: true,
    farmingMode: 'energy-cap',
    energyCap: 30,
    energyTarget: 150,
    autoSurrenderEnabled: false,
    gameBackgroundEnabled: true,
  };

  // Page-specific functionality mapping
  const extensionPageHandlers = {
    '/active_wave.php': initWaveMods,
    '/game_dash.php': initDashboardTools,
    '/battle.php': initBattleMods,
    '/chat.php': initChatMods,
    '/inventory.php': initInventoryMods,
    '/pets.php': initPetMods,
    '/stats.php': initStatMods,
    '/pvp.php': initPvPMods,
    '/pvp_battle.php': initPvPBattleMods,
    '/blacksmith.php': initBlacksmithMods,
    '/merchant.php': initMerchantMods,
    '/orc_cull_event.php': initEventMods,
  };

  // Automatic retrieval of userId from cookie
  function getCookieExtension(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const userId = getCookieExtension('demon');
  if(!userId){
    console.log('User session not found.')
    checkUserLogin(true);
  }

  // Initialize farming localStorage if not exists
  if (localStorage.getItem('veyra-farming-automation') === null) {
    localStorage.setItem('veyra-farming-automation', 'false');
  }
  if (localStorage.getItem('minus-energy-cap') === null) {
    localStorage.setItem('minus-energy-cap', '30');
  }
  if (localStorage.getItem('target-farming-energy') === null) {
    localStorage.setItem('target-farming-energy', '150');
  }
  if (localStorage.getItem('farming-mode') === null) {
    localStorage.setItem('farming-mode', 'energy-cap');
  }

  // Initialize PvP localStorage if not exists
  if (localStorage.getItem('veyra-pvp-automation') === null) {
    localStorage.setItem('veyra-pvp-automation', 'false');
  }
  if (localStorage.getItem('pvp-auto-surrend') === null) {
    localStorage.setItem('pvp-auto-surrend', 'false');
  }
  if (localStorage.getItem('pvp-automation-mode') === null) {
    localStorage.setItem('pvp-automation-mode', 'all'); // 'all' or 'x'
  }
  if (localStorage.getItem('pvp-automation-x-count') === null) {
    localStorage.setItem('pvp-automation-x-count', '0');
  }
  if (localStorage.getItem('pvp-automation-x-remaining') === null) {
    localStorage.setItem('pvp-automation-x-remaining', '0');
  }

  function initDraggableFalse(){
    document.querySelectorAll('a').forEach(x => x.draggable = false);
    document.querySelectorAll('button').forEach(x => x.draggable = false);
  }

  // Settings management
  function loadSettings() {
    const saved = localStorage.getItem('demonGameExtensionSettings');
    if (saved) {
      extensionSettings = { ...extensionSettings, ...JSON.parse(saved) };
    }

    // Sync farming settings from localStorage
    const farmingMode = localStorage.getItem('farming-mode');
    const energyCap = localStorage.getItem('minus-energy-cap');
    const energyTarget = localStorage.getItem('target-farming-energy');

    if (farmingMode) extensionSettings.farmingMode = farmingMode;
    if (energyCap) extensionSettings.energyCap = parseInt(energyCap);
    if (energyTarget) extensionSettings.energyTarget = parseInt(energyTarget);

    applySettings();
  }

  function saveSettings() {
    localStorage.setItem('demonGameExtensionSettings', JSON.stringify(extensionSettings));
  }

  function applySettings() {
    // Settings applied through CSS
  }

  // Function to update sidebar stats
  function updateSidebarStats(userStats) {
    // Update stats in the menu item
    const sidebarAttack = document.getElementById('sidebar-attack');
    const sidebarDefense = document.getElementById('sidebar-defense');
    const sidebarStamina = document.getElementById('sidebar-stamina');
    const sidebarPoints = document.getElementById('sidebar-points');

    // Expanded section elements
    const sidebarAttackExp = document.getElementById('sidebar-attack-exp');
    const sidebarDefenseExp = document.getElementById('sidebar-defense-exp');
    const sidebarStaminaExp = document.getElementById('sidebar-stamina-exp');
    const sidebarPointsExp = document.getElementById('sidebar-points-exp');

    // Update menu item stats
    if (sidebarAttack) sidebarAttack.textContent = userStats.ATTACK;
    if (sidebarDefense) sidebarDefense.textContent = userStats.DEFENSE;
    if (sidebarStamina) sidebarStamina.textContent = userStats.STAMINA;
    if (sidebarPoints) sidebarPoints.textContent = userStats.STAT_POINTS;

    // Update expanded section
    if (sidebarAttackExp) sidebarAttackExp.textContent = userStats.ATTACK;
    if (sidebarDefenseExp) sidebarDefenseExp.textContent = userStats.DEFENSE;
    if (sidebarStaminaExp) sidebarStaminaExp.textContent = userStats.STAMINA;
    if (sidebarPointsExp) sidebarPointsExp.textContent = userStats.STAT_POINTS;
  }

  // Player state management
  function savePlayerState(params) {
    const attack = document.getElementById('v-attack')?.textContent || params?.attack;
    const defense = document.getElementById('v-defense')?.textContent || params?.defense;
    const stamina = document.getElementById('v-stamina')?.textContent || params?.stamina;
    const points = document.getElementById('v-points')?.textContent || params?.points;
    const levelEl = document.querySelector('.gtb-level');
    const level = levelEl ? parseInt(levelEl.textContent.replace(/\D/g, '')) : 0;

    if (attack && defense && stamina && points) {
      const playerState = {
        attack: parseInt(attack.replace(/,/g, '')),
        defense: parseInt(defense.replace(/,/g, '')),
        stamina: parseInt(stamina.replace(/,/g, '')),
        points: parseInt(points.replace(/,/g, '')),
        level: level,
        timestamp: Date.now()
      };
      localStorage.setItem('playerState', JSON.stringify(playerState));
    }
  }

  function getPlayerState() {
    try {
      const saved = localStorage.getItem('playerState');
      if (!saved) return null;

      const playerState = JSON.parse(saved);
      const currentLevelEl = document.querySelector('.gtb-level');
      const currentLevel = currentLevelEl ? parseInt(currentLevelEl.textContent.replace(/\D/g, '')) : playerState.level;

      // Calculate level difference and adjust unallocated points
      const levelDiff = currentLevel - playerState.level;
      const additionalPoints = levelDiff * 5;

      return {
        attack: playerState.attack,
        defense: playerState.defense,
        stamina: playerState.stamina,
        points: playerState.points + additionalPoints,
        level: currentLevel,
        askToFetch: additionalPoints > 0 ? true : false
      };
    } catch {
      return null;
    }
  }

  // Function to fetch current stats and update sidebar
  async function fetchAndUpdateSidebarStats() {
    try {
      // First try to get from saved player state
      const savedState = getPlayerState();
      if (savedState && !savedState.askToFetch) {
        updateSidebarStats({
          ATTACK: savedState.attack,
          DEFENSE: savedState.defense,
          STAMINA: savedState.stamina,
          STAT_POINTS: savedState.points
        });
        return;
      }

      // Fallback to original method
      let attack = '-', defense = '-', stamina = '-', points = '-';

      // Method 1: Try stats page elements (v-attack, etc.)
      attack = document.getElementById('v-attack')?.textContent ||
              document.querySelector('[data-stat="attack"]')?.textContent;
      defense = document.getElementById('v-defense')?.textContent ||
               document.querySelector('[data-stat="defense"]')?.textContent;
      stamina = document.getElementById('v-stamina')?.textContent ||
               document.querySelector('[data-stat="stamina"]')?.textContent;
      points = document.getElementById('v-points')?.textContent ||
              document.querySelector('[data-stat="points"]')?.textContent;

      // Method 2: Try topbar stamina (but we'll need AJAX for attack/defense/points)
      if (!stamina || stamina === '-') {
        const staminaSpan = document.getElementById('stamina_span');
        if (staminaSpan) {
          const staminaText = staminaSpan.textContent;
          const staminaMatch = staminaText.match(/(\d+)/);
          if (staminaMatch) {
            stamina = staminaMatch[1];
          }
        }
      }

      // Method 3: If we don't have attack/defense/points, try these stupid trick
      if ((!attack || attack === '-') || (!defense || defense === '-') || (!points || points === '-')) {
        try {
          // Fetch the Stats Page and See the HTML Result
          let response = await fetch('stats.php', {
            method: 'GET',
          });

          if (response.ok) {
            const htmlPage = document.createElement('html')
            htmlPage.innerHTML = await response.text();

            try {
              const data = htmlPage.querySelector('.container');
              if (data) {
                attack = data.querySelector('#v-attack')?.textContent || attack || '-';
                defense = data.querySelector('#v-defense')?.textContent || defense || '-';
                stamina = data.querySelector('#v-stamina')?.textContent || stamina || '-';
                points = data.querySelector('#v-points')?.textContent || points || '-';
                savePlayerState({attack,defense,stamina,points})
                console.log('Parsed stats:', { attack, defense, stamina, points });
              }
            } catch (err) {
              console.log('Error happened here: ', err);
            }
          }
        } catch (ajaxError) {
          console.log('AJAX stats fetch failed:', ajaxError);
        }
      }

      updateSidebarStats({
        ATTACK: attack || '-',
        DEFENSE: defense || '-',
        STAMINA: stamina || '-',
        STAT_POINTS: points || '-'
      });
    } catch (error) {
      console.log('Could not fetch stats:', error);
      updateSidebarStats({
        ATTACK: '-',
        DEFENSE: '-',
        STAMINA: '-',
        STAT_POINTS: '-'
      });
    }
  }

  // Update sidebar sections
  function updateSidebarInventorySection() {
    const inventoryContent = document.getElementById('inventory-expanded');
    if (!inventoryContent) return;

    let content = '<div class="sidebar-quick-access">';

    if (extensionSettings.pinnedInventoryItems.length === 0) {
      content += '<div class="quick-access-empty">No pinned items. Visit inventory to pin items.</div>';
    } else {
      extensionSettings.pinnedInventoryItems.forEach(item => {
        const displayQuantity = item.type === 'consumable' ? ` (x${item.quantity || 1})` : '';

        content += `
          <div class="quick-access-item" data-item-id="${item.id}" data-item-name="${item.name}" data-item-type="${item.type}">
            <div class="qa-item-header">
              <img src="${item.image}" alt="${item.name}" style="width: 24px; height: 24px; border-radius: 4px;" onerror="this.style.display='none'">
              <div class="qa-item-info">
                <div class="qa-item-name">${item.name}</div>
                <div class="qa-item-stats">Available: ${item.quantity}</div>
              </div>
              <button class="qa-remove-btn" data-action="remove">×</button>
            </div>
            <div class="qa-item-actions">
              ${item.type === 'consumable' && item.quantity > 0 ?
                `<button class="qa-use-btn" data-action="use">Use</button>` :
                item.type === 'equipment' ?
                `<button class="qa-equip-btn" data-action="equip">View</button>` :
                `<span style="font-size: 11px; color: #888;">Material</span>`
              }
              ${item.type === 'consumable' && item.quantity === 0 ?
                `<span style="font-size: 11px; color: #f38ba8;">Out of stock</span>` : ''
              }
            </div>
          </div>
        `;
      });
    }

    content += '</div>';
    inventoryContent.innerHTML = content;
    setupInventoryQuickAccessListeners();
  }

  function setupInventoryQuickAccessListeners() {
    const inventoryContent = document.getElementById('inventory-expanded');
    if (!inventoryContent) return;

    inventoryContent.querySelectorAll('.qa-remove-btn[data-action="remove"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = btn.closest('.quick-access-item');
        const itemId = item?.dataset.itemId;
        const itemName = item?.dataset.itemName;
        if (itemId && itemName) {
          removeFromInventoryQuickAccess(itemId, itemName);
        }
      });
    });

    inventoryContent.querySelectorAll('.qa-use-btn[data-action="use"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = btn.closest('.quick-access-item');
        const itemName = item?.dataset.itemName;
        if (itemName) {
          showNotification(`Visit inventory page to use ${itemName}`, 'info');
        }
      });
    });

    inventoryContent.querySelectorAll('.qa-equip-btn[data-action="equip"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = btn.closest('.quick-access-item');
        const itemName = item?.dataset.itemName;
        if (itemName) {
          showNotification(`Visit inventory page to equip ${itemName}`, 'info');
        }
      });
    });
  }

  function updateSidebarMerchantSection() {
    const merchantContent = document.getElementById('merchant-expanded');
    if (!merchantContent) return;

    let content = '<div class="sidebar-quick-access">';

    if (extensionSettings.pinnedMerchantItems.length === 0) {
      content += '<div class="quick-access-empty">No pinned items. Visit merchant to pin items.</div>';
    } else {
      extensionSettings.pinnedMerchantItems.forEach(item => {
        const remaining = item.maxQ > 0 ? Math.max(0, item.maxQ - item.bought) : 999;
        const canBuy = item.maxQ === 0 || remaining > 0;

        content += `
          <div class="quick-access-item" data-item-id="${item.id}" data-item-name="${item.name}" data-item-currency="${item.currency}" data-item-price="${item.price}">
            <div class="qa-item-header">
              <img src="${item.image}" alt="${item.name}" style="width: 24px; height: 24px; border-radius: 4px;" onerror="this.style.display='none'">
              <div class="qa-item-info">
                <div class="qa-item-name">${item.name}</div>
                <div class="qa-item-price">${item.priceDisplay}</div>
                ${item.maxQ > 0 ? `<div class="qa-item-limit">Remaining: ${remaining}/${item.maxQ}</div>` : ''}
              </div>
              <button class="qa-remove-btn" data-action="remove">×</button>
            </div>
            <div class="qa-item-actions">
              <button class="qa-buy-btn" ${!canBuy ? 'disabled' : ''} data-action="buy">
                ${canBuy ? 'Buy' : 'Sold Out'}
              </button>
            </div>
          </div>
        `;
      });
    }

    content += '</div>';
    merchantContent.innerHTML = content;
  }
  function showNotification(msg, type = 'success') {
    let note = document.getElementById('notification');
    if (!note) {
      note = document.createElement('div');
      note.id = 'notification';
      note.style.cssText = `position: fixed; top: 90px; right: 20px; background: #2ecc71; color: white; padding: 12px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); font-size: 15px; display: none; z-index: 9999;`;
      document.body.appendChild(note);
    }

    // Add emojis to enhance messages
    let emoji = '';
    if (type === 'success') emoji = '✅ ';
    else if (type === 'error') emoji = '❌ ';
    else if (type === 'warning') emoji = '⚠️ ';
    else if (type === 'info') emoji = 'ℹ️ ';

    note.innerHTML = emoji + msg;

    // Enhanced styling
    if (type === 'error') {
      note.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
      note.style.borderLeft = '4px solid #c0392b';
    } else if (type === 'warning') {
      note.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
      note.style.borderLeft = '4px solid #e67e22';
    } else if (type === 'info') {
      note.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
      note.style.borderLeft = '4px solid #2980b9';
    } else {
      note.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
      note.style.borderLeft = '4px solid #27ae60';
    }

    note.style.display = 'block';
    note.style.borderRadius = '8px';
    note.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';

    setTimeout(() => {
        note.style.display = 'none';
    }, 4000); // Slightly longer display time
  }

  // MAIN INITIALIZATION
  // Always initialize farming automation on main site pages
  if (window.location.hostname === 'demonicscans.org' && (!window.location.pathname.includes('.php') || window.location.pathname === '/index.php')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => safeExecute(initFarmingAutomation, 'Farming Automation'));
    } else {
      safeExecute(initFarmingAutomation, 'Farming Automation');
    }
  }

  // Initialize game extension only on game pages
  if (document.querySelector('.game-topbar')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => safeExecute(initializeExtension, 'DOMContentLoaded'));
    } else {
      safeExecute(initializeExtension, 'Direct Initialization');
    }
  }

  function initializeExtension() {
    console.log('Veyra UI Overhaul v0.40 - Initializing...');

    // Initialize encryption utilities
    safeExecute(() => initSecureCredentials(), 'Initialize Encryption');

    // Load settings first
    safeExecute(() => loadSettings(), 'Load Settings');

    // Initialize sidebar
    safeExecute(() => initSideBar(), 'Sidebar Initialization');

    // Disable dragging on interactive elements
    safeExecute(() => initDraggableFalse(), 'Disable Dragging');

    // Initialize page-specific functionality
    safeExecute(() => initPageSpecificFunctionality(), 'Page-Specific Functionality');

    console.log('Veyra UI Overhaul v0.40 - Initialization Complete!');
    console.log('Type debugExtension() in console for debug info');
  }

  function initSecureCredentials() {
    if (!window.secureCredentials) {
      window.secureCredentials = new SecureCredentials();
    }
  }

  function initPageSpecificFunctionality() {
    const currentPath = window.location.pathname;

    for (const [path, handler] of Object.entries(extensionPageHandlers)) {
      if (currentPath.includes(path)) {
        console.log(`Initializing ${path} functionality`);
        handler();
        break;
      }
    }
  }

  // Error handling wrapper for all functions
  function safeExecute(func, context = 'Unknown') {
    try {
      return func();
    } catch (error) {
      console.error(`Error in ${context}:`, error);
      if (typeof showNotification === 'function') {
        showNotification(`Error in ${context}: ${error.message}`, 'error');
      }
    }
  }

  // Placeholder functions for page handlers
  function initWaveMods() {
    initGateCollapse();
    initMonsterFilter();
    loadInstaLoot();
    initContinueBattleFirst();
    initImprovedWaveButtons();
    initMonsterSorting();
  }

  async function loadFilterSettings() {
    return new Promise((resolve) => {
      try {
        const settings = JSON.parse(localStorage.getItem('demonGameFilterSettings') || '{}');
        resolve(settings);
      } catch {
        resolve({});
      }
    });
  }

  async function initMonsterFilter() {
    const observer = new MutationObserver(async (mutations, obs) => {
      const monsterList = document.querySelectorAll('.monster-card');
      if (monsterList.length > 0) {
        obs.disconnect();
        const settings = await loadFilterSettings();
        monsterFiltersSettings = settings;
        createFilterUI(monsterList, settings);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function createFilterUI(monsterList, settings) {
    const filterContainer = document.createElement('div');
    filterContainer.style.cssText = `
      padding: 10px;
      background: #2d2d3d;
      border-radius: 5px;
      margin-bottom: 15px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `;

    filterContainer.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: flex-start; justify-content: center; width: 100%;">
        <input type="text" id="monster-name-filter" placeholder="Filter by name"
               style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; min-width: 150px;">

        <select id="wave-filter" style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; min-width: 100px;">
          <option value="">All Waves</option>
          <option value="wave1">Wave 1 Only</option>
          <option value="wave2">Wave 2 Only</option>
        </select>

        <select id="hp-filter" style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; min-width: 100px;">
          <option value="">All HP</option>
          <option value="low">Low HP (&lt;50%)</option>
          <option value="medium">Medium HP (50-80%)</option>
          <option value="high">High HP (&gt;80%)</option>
          <option value="full">Full HP (100%)</option>
        </select>

        <select id="player-count-filter" style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; min-width: 100px;">
          <option value="">All Players</option>
          <option value="empty">Empty (0 players)</option>
          <option value="few">Few (&lt;10 players)</option>
          <option value="many">Many (&gt;20 players)</option>
          <option value="full">Full (30 players)</option>
        </select>

        <label style="display: flex; align-items: center; gap: 5px; color: #cdd6f4;">
          <input type="checkbox" id="hide-img-monsters">
          Hide images
        </label>

        <button id="clear-filters" style="padding: 5px 10px; background: #f38ba8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          Clear All
        </button>
      </div>
    `;

    const contentArea = document.querySelector('.content-area');
    const monsterContainer = document.querySelector('.monster-container');
    if (contentArea && monsterContainer) {
      contentArea.insertBefore(filterContainer, monsterContainer);
    }

    // Add event listeners
    document.getElementById('monster-name-filter').addEventListener('input', applyMonsterFilters);
    document.getElementById('wave-filter').addEventListener('change', applyMonsterFilters);
    document.getElementById('hp-filter').addEventListener('change', applyMonsterFilters);
    document.getElementById('player-count-filter').addEventListener('change', applyMonsterFilters);
    document.getElementById('hide-img-monsters').addEventListener('change', applyMonsterFilters);
    document.getElementById('clear-filters').addEventListener('click', clearAllFilters);

    // Initialize filter values from settings
    if (settings.nameFilter) document.getElementById('monster-name-filter').value = settings.nameFilter;
    if (settings.waveFilter) document.getElementById('wave-filter').value = settings.waveFilter;
    if (settings.hpFilter) document.getElementById('hp-filter').value = settings.hpFilter;
    if (settings.playerCountFilter) document.getElementById('player-count-filter').value = settings.playerCountFilter;
    if (settings.hideImg) document.getElementById('hide-img-monsters').checked = settings.hideImg;

    if (settings.nameFilter || settings.waveFilter || settings.hpFilter || settings.playerCountFilter || settings.hideImg) {
      applyMonsterFilters();
    }
  }

  function applyMonsterFilters() {
    const nameFilter = document.getElementById('monster-name-filter').value.toLowerCase();
    const waveFilter = document.getElementById('wave-filter').value;
    const hpFilter = document.getElementById('hp-filter').value;
    const playerCountFilter = document.getElementById('player-count-filter').value;
    const hideImg = document.getElementById('hide-img-monsters').checked;

    const monsters = document.querySelectorAll('.monster-card');

    monsters.forEach(monster => {
      const monsterName = monster.querySelector('h3').textContent.toLowerCase();
      const monsterImg = monster.querySelector('img');

      const hpText = monster.querySelector('.hp-bar')?.nextElementSibling?.textContent || '';
      const hpMatch = hpText.match(/❤️\s*([\d,]+)\s*\/\s*([\d,]+)\s*HP/);
      const currentHp = hpMatch ? parseInt(hpMatch[1].replace(/,/g, '')) : 0;
      const maxHp = hpMatch ? parseInt(hpMatch[2].replace(/,/g, '')) : 1;
      const hpPercentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;

      const playerText = monster.textContent;
      const playerMatch = playerText.match(/👥 Players Joined (\d+)\/30/);
      const playerCount = playerMatch ? parseInt(playerMatch[1]) : 0;

      let shouldShow = true;

      if (nameFilter && !monsterName.includes(nameFilter)) {
        shouldShow = false;
      }

      if (hpFilter) {
        switch (hpFilter) {
          case 'low':
            if (hpPercentage >= 50) shouldShow = false;
            break;
          case 'medium':
            if (hpPercentage < 50 || hpPercentage > 80) shouldShow = false;
            break;
          case 'high':
            if (hpPercentage <= 80) shouldShow = false;
            break;
          case 'full':
            if (hpPercentage < 100) shouldShow = false;
            break;
        }
      }

      if (playerCountFilter) {
        switch (playerCountFilter) {
          case 'empty':
            if (playerCount > 0) shouldShow = false;
            break;
          case 'few':
            if (playerCount >= 10) shouldShow = false;
            break;
          case 'many':
            if (playerCount <= 20) shouldShow = false;
            break;
          case 'full':
            if (playerCount < 30) shouldShow = false;
            break;
        }
      }

      monster.style.display = shouldShow ? '' : 'none';

      if (hideImg && monsterImg) {
        monsterImg.style.display = 'none';
      } else if (monsterImg) {
        monsterImg.style.removeProperty('display');
      }
    });

    const settings = {
      nameFilter: document.getElementById('monster-name-filter').value,
      waveFilter: document.getElementById('wave-filter').value,
      hpFilter: document.getElementById('hp-filter').value,
      playerCountFilter: document.getElementById('player-count-filter').value,
      hideImg: document.getElementById('hide-img-monsters').checked
    };
    localStorage.setItem('demonGameFilterSettings', JSON.stringify(settings));
  }

  function clearAllFilters() {
    document.getElementById('monster-name-filter').value = '';
    document.getElementById('wave-filter').value = '';
    document.getElementById('hp-filter').value = '';
    document.getElementById('player-count-filter').value = '';
    document.getElementById('hide-img-monsters').checked = false;

    applyMonsterFilters();
    showNotification('All filters cleared!', 'info');
  }

  async function loadInstaLoot(){
    if (!document.getElementById('lootModal')) {
      var modal = document.createElement('div');
      modal.innerHTML = `<div id="lootModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center;">
      <div style="background:#2a2a3d; border-radius:12px; padding:20px; max-width:90%; width:400px; text-align:center; color:white; overflow-y:auto; max-height:80%;">
          <h2 style="margin-bottom:15px;">🎁 Loot Gained</h2>
          <div id="lootItems" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;"></div>
          <br>
          <button class="join-btn" onclick="document.getElementById('lootModal').style.display='none'" style="margin-top:10px;">Close</button>
      </div>
  </div>`;

      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        contentArea.appendChild(modal.firstElementChild);
      }

      document.getElementById('lootModal').addEventListener('click', function(event) {
        this.style.display = 'none';
      });
    }

    document.querySelectorAll('.monster-card > a').forEach(x => {
      if (x.innerText.includes('Loot')) {
        var instaBtn = document.createElement('button');
        instaBtn.onclick = function() {
          lootWave(x.href.split("id=")[1]);
        };
        instaBtn.className = "join-btn";
        instaBtn.innerText = "💰 Loot Instantly";
        instaBtn.style.marginTop = "8px";
        x.parentNode.append(instaBtn);
      }
    });
  }

  function lootWave(monsterId) {
    fetch('loot.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'monster_id=' + monsterId + '&user_id=' + userId
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            const lootContainer = document.getElementById('lootItems');
            lootContainer.innerHTML = '';

            data.items.forEach(item => {
                const div = document.createElement('div');
                div.style = 'background:#1e1e2f; border-radius:8px; padding:10px; text-align:center; width:80px;';
                div.innerHTML = `
                    <img src="${item.IMAGE_URL}" alt="${item.NAME}" style="width:64px; height:64px;"><br>
                    <small>${item.NAME}</small>
                `;
                lootContainer.appendChild(div);
            });

            document.getElementById('lootModal').style.display = 'flex';
        } else {
            showNotification(data.message || 'Failed to loot.', 'error');
        }
    })
    .catch(() => showNotification("Server error", 'error'));
  }

  function initGateCollapse() {
    const gateInfo = document.querySelector('.gate-info');
    if (!gateInfo) return;

    const header = gateInfo.querySelector('.gate-info-header');
    const scrollContent = gateInfo.querySelector('.gate-info-scroll');

    if (!header || !scrollContent) return;

    header.classList.add('collapsible-header');
    scrollContent.classList.add('collapsible-content');
    scrollContent.classList.toggle('collapsed');

    const style = document.createElement('style');
    style.textContent = `
      .collapsible-header {
        cursor: pointer;
        user-select: none;
      }
      .collapsible-header:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .collapsible-content.collapsed {
        display: none;
      }
    `;
    document.head.appendChild(style);

    header.addEventListener('click', function() {
      scrollContent.classList.toggle('collapsed');
    });
  }

  function initContinueBattleFirst(){
    const monsterContainer = document.querySelector('.monster-container');
    if (!monsterContainer) return;

    document.querySelectorAll('.monster-card').forEach(x => {
      if (x.innerText.includes('Continue the Battle')) {
        monsterContainer.prepend(x);
      }
    });
  }

  function initImprovedWaveButtons() {
    document.querySelectorAll('.monster-card > a').forEach(battleLink => {
      if (battleLink.innerText.includes('Join the Battle')) {
        const monsterId = battleLink.href.split("id=")[1];

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-top: 8px;';

        const joinBtn = document.createElement('button');
        joinBtn.className = "join-btn";
        joinBtn.style.cssText = 'flex: 1; font-size: 12px;';
        joinBtn.innerText = "⚔️ Join Battle";
        joinBtn.onclick = function() {
          joinWaveInstant(monsterId, battleLink);
        };

        const viewBtn = document.createElement('button');
        viewBtn.className = "join-btn";
        viewBtn.style.cssText = 'flex: 1; font-size: 12px; background: #6c7086;';
        viewBtn.innerText = "👁️ View";
        viewBtn.onclick = function() {
          window.location.href = battleLink.href;
        };

        buttonContainer.appendChild(joinBtn);
        buttonContainer.appendChild(viewBtn);

        battleLink.style.display = 'none';
        battleLink.parentNode.appendChild(buttonContainer);
      }
    });
  }

  function joinWaveInstant(monsterId, originalLink) {
    showNotification('Joining battle...', 'success');

    fetch('user_join_battle.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'monster_id=' + monsterId + '&user_id=' + userId,
      referrer: 'https://demonicscans.org/battle.php?id=' + monsterId
    })
    .then(res => res.text())
    .then(data => {
      const msg = (data || '').trim();
      const ok = msg.toLowerCase().startsWith('you have successfully');
      showNotification(msg || 'Unknown response', ok ? 'success' : 'error');
      if (ok) {
        setTimeout(() => {
          window.location.href = originalLink.href;
        }, 1000);
      }
    })
    .catch(() => showNotification('Server error. Please try again.', 'error'));
  }

  function initMonsterSorting() {
    const monsterContainer = document.querySelector('.monster-container');
    if (!monsterContainer) return;

    const continueBattleSection = document.createElement('div');
    continueBattleSection.className = 'monster-section';
    continueBattleSection.innerHTML = `
      <div class="monster-section-header">
        <h3 style="color: #f38ba8; margin: 0; flex: 1;">⚔️ Continue Battle</h3>
        <button class="section-toggle-btn" id="continue-battle-toggle">${extensionSettings.continueBattlesExpanded ? '-' : '+'}</button>
      </div>
      <div class="monster-section-content" id="continue-battle-content" style="display: ${extensionSettings.continueBattlesExpanded ? 'block' : 'none'};">
        <div class="monster-container" style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;"></div>
      </div>
    `;

    const lootSection = document.createElement('div');
    lootSection.className = 'monster-section';
    lootSection.innerHTML = `
      <div class="monster-section-header">
        <h3 style="color: #f9e2af; margin: 0; flex: 1;">💰 Available Loot</h3>
        <button class="section-toggle-btn" id="loot-toggle">${extensionSettings.lootExpanded ? '-' : '+'}</button>
      </div>
      <div class="monster-section-content" id="loot-content" style="display: ${extensionSettings.lootExpanded ? 'block' : 'none'};">
        <div class="monster-container" style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;"></div>
      </div>
    `;

    const joinBattleSection = document.createElement('div');
    joinBattleSection.className = 'monster-section';
    joinBattleSection.innerHTML = `
      <div class="monster-section-header">
        <h3 style="color: #a6e3a1; margin: 0; flex: 1;">🆕 Join a Battle</h3>
      </div>
      <div class="monster-section-content">
        <div class="monster-container" style="display: flex; flex-wrap: wrap; gap: 15px;"></div>
      </div>
    `;

    const monsterCards = Array.from(document.querySelectorAll('.monster-card'));
    const continueCards = [];
    const lootCards = [];
    const joinCards = [];

    monsterCards.forEach(card => {
      if (card.innerText.includes('Continue the Battle')) {
        continueCards.push(card);
      } else if (card.innerText.includes('Loot')) {
        lootCards.push(card);
      } else {
        const hpText = card.querySelector('div[style*="width:"]')?.parentNode?.nextElementSibling?.textContent || '';
        const hpMatch = hpText.match(/❤️\s*([\d,]+)\s*\/\s*([\d,]+)\s*HP/);
        if (hpMatch) {
          const currentHp = parseInt(hpMatch[1].replace(/,/g, ''));
          card.dataset.currentHp = currentHp;
        }
        joinCards.push(card);
      }
    });

    joinCards.sort((a, b) => {
      const hpA = parseInt(a.dataset.currentHp) || 0;
      const hpB = parseInt(b.dataset.currentHp) || 0;
      return hpA - hpB;
    });

    monsterContainer.innerHTML = '';

    if (continueCards.length > 0) {
      const continueGrid = continueBattleSection.querySelector('.monster-container');
      continueCards.forEach(card => continueGrid.appendChild(card));
      monsterContainer.appendChild(continueBattleSection);
    }

    if (lootCards.length > 0) {
      const lootHeader = lootSection.querySelector('h3');
      lootHeader.textContent = `💰 Available Loot (${lootCards.length})`;

      const lootGrid = lootSection.querySelector('.monster-container');
      lootCards.forEach(card => lootGrid.appendChild(card));
      monsterContainer.appendChild(lootSection);
    }

    if (joinCards.length > 0) {
      const joinGrid = joinBattleSection.querySelector('.monster-container');
      joinCards.forEach(card => joinGrid.appendChild(card));
      monsterContainer.appendChild(joinBattleSection);
    }

    const continueToggle = document.getElementById('continue-battle-toggle');
    const lootToggle = document.getElementById('loot-toggle');
    const continueContent = document.getElementById('continue-battle-content');
    const lootContent = document.getElementById('loot-content');

    if (continueToggle && continueContent) {
      continueToggle.addEventListener('click', () => {
        const isCollapsed = continueContent.style.display === 'none';
        continueContent.style.display = isCollapsed ? 'block' : 'none';
        continueToggle.textContent = isCollapsed ? '-' : '+';
        extensionSettings.continueBattlesExpanded = isCollapsed;
        saveSettings();
      });
    }

    if (lootToggle && lootContent) {
      lootToggle.addEventListener('click', () => {
        const isCollapsed = lootContent.style.display === 'none';
        lootContent.style.display = isCollapsed ? 'block' : 'none';
        lootToggle.textContent = isCollapsed ? '-' : '+';
        extensionSettings.lootExpanded = isCollapsed;
        saveSettings();
      });
    }

    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
      .monster-section {
        margin-bottom: 30px;
        background: rgba(30, 30, 46, 0.3);
        border-radius: 8px;
        overflow: hidden;
      }

      .monster-section-header {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        background: rgba(203, 166, 247, 0.1);
        cursor: pointer;
        border-bottom: 1px solid rgba(88, 91, 112, 0.3);
      }

      .monster-section-header:hover {
        background: rgba(203, 166, 247, 0.15);
      }

      .section-toggle-btn {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e0e0e0;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        min-width: 24px;
      }

      .section-toggle-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .monster-section-content {
        padding: 15px 20px;
      }
    `;
    document.head.appendChild(sectionStyle);
  }

  function initDashboardTools() {
    console.log('Dashboard tools initialized');
  }

  function initBattleMods() {
    console.log('init Battle Mods')
  }

  function initChatMods() {
    console.log('Chat mods initialized');
  }

  function initInventoryMods() {
    initItemTotalDmg();
    addInventoryQuickAccessButtons();
  }

  function initItemTotalDmg(){
    const itemSection = document.querySelector('.section');
    const sectionTitle = document.querySelector('.section-title');
    if (!itemSection || !sectionTitle) return;

    var itemsTotalDmg = 0;
    itemSection.querySelectorAll('.label').forEach(x => {
      const labelText = x.innerText;
      const atkIndex = labelText.indexOf('🔪');
      if (atkIndex !== -1) {
        const atkText = labelText.substring(atkIndex + 3);
        const atkMatch = atkText.match(/(\d+)\s*ATK/);
        if (atkMatch) {
          itemsTotalDmg += parseInt(atkMatch[1]);
        }
      }
    });

    var finalAmount = itemsTotalDmg * 20;
    var totalDmgContainer = document.createElement('span');
    totalDmgContainer.id = 'total-item-damage';
    totalDmgContainer.innerText = ' - Total item damage: ' + finalAmount;
    totalDmgContainer.style.color = '#a6e3a1';
    sectionTitle.appendChild(totalDmgContainer);
  }

  function addInventoryQuickAccessButtons() {
    if (!window.location.pathname.includes('inventory.php')) return;

    let attempts = 0;
    const maxAttempts = 50;

    const checkAndAddButtons = () => {
      attempts++;

      const inventoryItems = document.querySelectorAll('.slot-box:not(.empty):not([data-pin-added])');

      if (inventoryItems.length === 0) {
        if (attempts < maxAttempts) {
          setTimeout(checkAndAddButtons, 100);
        }
        return;
      }

      inventoryItems.forEach(item => {
        if (item.hasAttribute('data-pin-added') || item.querySelector('.empty')) return;

        const itemData = extractInventoryItemData(item);
        if (!itemData) return;

        const pinBtn = document.createElement('button');
        pinBtn.className = 'btn extension-pin-btn';
        pinBtn.textContent = '📌 Pin';
        pinBtn.style.cssText = `
          background: #8a2be2;
          color: white;
          margin-top: 5px;
          font-size: 11px;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        `;

        pinBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          addToInventoryQuickAccess(itemData, item);
        };

        const labelDiv = item.querySelector('.label');
        if (labelDiv) {
          labelDiv.appendChild(pinBtn);
        } else {
          item.appendChild(pinBtn);
        }

        item.setAttribute('data-pin-added', 'true');
      });
    };

    checkAndAddButtons();
  }

  function extractInventoryItemData(item) {
    try {
      const img = item.querySelector('img');
      const itemName = img?.alt || 'Unknown Item';
      const imageSrc = img?.src || '';

      const labelDiv = item.querySelector('.label');
      const labelText = labelDiv?.textContent || '';

      let itemType = 'material';
      let itemId = null;
      let quantity = 1;

      const useButton = item.querySelector('button[onclick*="useItem"]');
      const equipButton = item.querySelector('button[onclick*="showEquipModal"]');

      if (useButton) {
        itemType = 'consumable';
        const onclickStr = useButton.getAttribute('onclick') || '';
        const match = onclickStr.match(/useItem\(([^)]+)\)/);
        itemId = match ? match[1] : null;
      } else if (equipButton) {
        itemType = 'equipment';
        const onclickStr = equipButton.getAttribute('onclick') || '';
        const match = onclickStr.match(/showEquipModal\(\s*(\d+)\s*,\s*['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\s*\)/);
        if (match) {
          itemId = match[3];
        }
      }

      const quantityMatch = labelText.match(/x(\d+)/);
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1], 10);
      }

      return {
        id: itemId || Date.now().toString(),
        name: itemName,
        image: imageSrc,
        type: itemType,
        quantity: quantity,
        rawLabel: labelText
      };

    } catch (error) {
      console.error('Error extracting inventory item data:', error);
      return null;
    }
  }

  function addToInventoryQuickAccess(itemData, itemElement) {
    if (extensionSettings.pinnedInventoryItems.length >= extensionSettings.pinnedItemsLimit) {
      showNotification(`Maximum ${extensionSettings.pinnedItemsLimit} inventory items can be pinned!`, 'warning');
      return;
    }

    const checkKey = itemData.type === 'consumable' ? itemData.name : itemData.id;
    const alreadyPinned = extensionSettings.pinnedInventoryItems.some(item => {
      const pinnedKey = item.type === 'consumable' ? item.name : item.id;
      return pinnedKey === checkKey;
    });

    if (alreadyPinned) {
      showNotification(`"${itemData.name}" is already pinned!`, 'warning');
      return;
    }

    extensionSettings.pinnedInventoryItems.push(itemData);
    saveSettings();
    updateSidebarInventorySection();
    showNotification(`Successfully pinned "${itemData.name}" to inventory quick access!`, 'success');

    const pinBtn = itemElement.querySelector('.extension-pin-btn');
    if (pinBtn) {
      pinBtn.textContent = '✓ Pinned';
      pinBtn.style.background = '#28a745';
      pinBtn.disabled = true;
    }
  }

  function removeFromInventoryQuickAccess(itemId, itemName) {
    extensionSettings.pinnedInventoryItems = extensionSettings.pinnedInventoryItems.filter(item => {
      if (item.type === 'consumable') {
        return item.name !== itemName;
      }
      return item.id !== itemId;
    });

    saveSettings();
    updateSidebarInventorySection();
    showNotification(`Removed "${itemName || 'item'}" from inventory quick access`, 'info');
  }

  function initPetMods() {
    initPetTotalDmg();
    initPetRequiredFood();
  }

  function initPetTotalDmg(){
    const petSection = document.querySelector('.section');
    const sectionTitle = document.querySelector('.section-title');
    if (!petSection || !sectionTitle) return;

    var petTotalDmg = 0;
    petSection.querySelectorAll('.pet-atk').forEach(x => {
      petTotalDmg += Number.parseInt(x.innerText)
    });

    var finalAmount = petTotalDmg * 20;
    var totalDmgContainer = document.createElement('span');
    totalDmgContainer.id = 'total-pet-damage';
    totalDmgContainer.innerText = ' - Total pet damage: ' + finalAmount;
    totalDmgContainer.style.color = '#f38ba8';
    sectionTitle.appendChild(totalDmgContainer);
  }

  function initPetRequiredFood(){
    document.querySelectorAll('.exp-top').forEach(x => {
      var curExp = Number.parseInt(x.querySelector('.exp-current').innerText);
      var reqExp = Number.parseInt(x.querySelector('.exp-required').innerText);
      var needed = Math.ceil((reqExp - curExp) / 300);
      x.insertAdjacentHTML('afterEnd', `<div style='margin-top:5px;'><span style='color:green;margin-top:5px'>Requires ${needed} Arcane Treat S</span></div>`);
    });
  }

  function initStatMods() {
    initPlayerAtkDamage();
    savePlayerState();
  }

  function initPlayerAtkDamage(){
    const atkElement = document.getElementById('v-attack');
    if (!atkElement) return;

    var atkValue = Number.parseInt(atkElement.innerText.replaceAll(',','').replaceAll('.',''))
    const statCard = document.querySelectorAll('.grid .card')[1];
    if (!statCard) return;

    const defenseValues = [0, 25, 50];
    defenseValues.forEach((def, index) => {
      var statRow = document.createElement('div')
      statRow.title = `Damage is calculated based on ${def} DEF monster`
      statRow.classList.add('row')
      statRow.style.color = 'red'

      var statName = document.createElement('span')
      statName.innerText = `ATTACK DMG VS ${def} DEF`

      var statValue = document.createElement('span')
      var playerTotalDmg = calcDmg(atkValue, def)
      statValue.innerText = playerTotalDmg;

      statRow.append(statName)
      statRow.append(statValue)
      statCard.append(statRow)
    });
  }

  function calcDmg(atkValue,def){
    return Math.round(1000*((atkValue-def)**0.25));
  }

  function initPvPMods() {
    initPvPBannerFix();
    initPvPTable();
    createPvPAutomationButton();
    initPvPAutomation();
  }

  function initPvPBannerFix(){
    var contentArea = document.querySelector('.content-area');
    var seasonCountdown = document.querySelector('.season-cta');
    var pvpHero = document.querySelector('.pvp-hero');
    if (pvpHero) {
      pvpHero.style.marginTop = "0px";
      if(seasonCountdown){
        contentArea.prepend(seasonCountdown)
      }
      contentArea.prepend(pvpHero)
      const br = document.querySelector('br');
      if (br) br.remove();
    }

    const scopedStyle = document.createElement('style')
    scopedStyle.innerHTML = `
      .hero-btn {
        padding: 15px 10px;
      }

      .wrap:has(a.hero-btn) {
        margin-top: 16px;
      }

      .wrap a.hero-btn {
        padding: 7px 10px;
      }

      .card {
        overflow: auto;
      }

      .card table {
        max-width: 100%;
        width: 100%;
      }

      @media (max-width:600px) {
        .card table:first-of-type thead tr th:nth-child(4), 
        .card table:first-of-type tbody tr td:nth-child(4),
        .card table:first-of-type thead tr th:nth-child(5), 
        .card table:first-of-type tbody tr td:nth-child(5) {
          display: none;
        }

      }

      @media (min-width:641px) {
        .card table {
          
        }
      }
    `;

    contentArea.prepend(scopedStyle)
  }

  function initPvPTable() {
    const header = document.querySelector('.card .muted')
    const table = document.querySelector('.card table');
    if (!table || !header) return;

    const indicator = document.createElement('span')
    indicator.classList.add('indicator')
    indicator.innerHTML = "<img src='https://www.svgrepo.com/show/533664/chevron-up.svg' alt='Indicator' />"
    header.classList.add('transition')
    header.style = 'cursor: pointer;'
    header.append(indicator)

    // Add Point column header
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
      const pointHeader = document.createElement('th');
      pointHeader.textContent = 'Point';
      headerRow.appendChild(pointHeader);
    }

    // Process each body row
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      const role = cells[0].textContent.trim();
      const result = cells[2].textContent.trim();
      
      let points = 0;
      let bgColor = '';
      
      if (role === 'Defender' && result === 'Loss') {
        points = -5;
        bgColor = '#ff7b7b30';
      } else if (role === 'Defender' && result === 'Win') {
        points = +5;
        bgColor = '#81ff9c30';
      } else if (role === 'Attacker' && result === 'Loss') {
        points = -15;
        bgColor = '#ff7b7b30';
      } else if (role === 'Attacker' && result === 'Win') {
        points = +10;
        bgColor = '#81ff9c30';
      }
      
      // Add point cell
      const pointCell = document.createElement('td');
      pointCell.textContent = points > 0 ? `+${points}` : points;
      pointCell.style.color = points > 0 ? '#4ade80' : '#f87171';
      row.appendChild(pointCell);
      
      // Set row background
      row.style.backgroundColor = bgColor;
    });

    const tableWrapper = document.createElement('div')
    tableWrapper.classList.add('collapsible')
    tableWrapper.appendChild(table)
    header.insertAdjacentElement('afterend', tableWrapper)

    header.addEventListener('click', () => {
      if(header.classList.contains('open')) {
        tableWrapper.style.height = '0'
        header.classList.remove('open')
      }else {
        tableWrapper.style.height = '924px'
        header.classList.add('open')
      }
    })
  }

  function createPvPAutomationButton() {
    const heroRow = document.querySelector('.hero-row');
    const btnStartTop = document.getElementById('btnStartTop');

    if (heroRow && btnStartTop && !document.getElementById('btnAutomationXPvp')) {
      const automationXBtnInput = document.createElement('input');
      automationXBtnInput.id = 'automationXBtnInput';
      automationXBtnInput.type = 'number';
      automationXBtnInput.style = 'width: 60px;padding: 5px;background: #63636300;color: #cdd6f4;border: 1px solid #45475a;border-radius: 4px;margin-right: 10px;';
      automationXBtnInput.draggable = false;
      automationXBtnInput.max = 20;
      automationXBtnInput.min = 0;
      automationXBtnInput.value = 1;

      const automationXBtn = document.createElement('button');
      automationXBtn.id = 'btnAutomationXPvp';
      automationXBtn.title = 'PvP Automation x times';
      automationXBtn.draggable = false;
      automationXBtn.textContent = 'Automate PvP';
      automationXBtn.style = 'background: #ffffff;color: #000000;border: 1.25px solid rgba(255, 255, 255, .85);border-radius: 10px;padding: 7px 10px;font-weight: 900;cursor: pointer;';

      const automationXBtnWrapper = document.createElement('div');
      automationXBtnWrapper.style = 'background: transparent;color: #fff;border: 1.25px solid rgba(255, 255, 255, .85);border-radius: 10px;padding: 7px 10px;font-weight: 900;cursor: pointer;backdrop-filter: blur(2px);';
      automationXBtnWrapper.draggable = false;

      automationXBtnWrapper.append(automationXBtnInput);
      automationXBtnWrapper.append(automationXBtn);

      automationXBtn.addEventListener('click', togglePvPAutomationX);

      btnStartTop.insertAdjacentElement('afterend', automationXBtnWrapper);

      const automationAllBtn = document.createElement('button');
      automationAllBtn.id = 'btnAutomationAllPvp';
      automationAllBtn.className = 'hero-btn';
      automationAllBtn.title = 'PvP Automation All Coin';
      automationAllBtn.draggable = false;
      automationAllBtn.textContent = 'Automate PvP (All Coins)';

      automationAllBtn.addEventListener('click', togglePvPAutomationAll);

      automationXBtnWrapper.insertAdjacentElement('afterend', automationAllBtn);
      updatePvPHeroButtonState();
    }
  }

  function updatePvPHeroButtonState() {
    const xBtn = document.getElementById('btnAutomationXPvp');
    const allBtn = document.getElementById('btnAutomationAllPvp');
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 1;
    const isRunning = getPvPAutomation();
    const automationMode = localStorage.getItem('pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('pvp-automation-x-remaining') || '0');

    if (xBtn) {
      if (coins === 0 && !isRunning) {
        xBtn.disabled = true;
        xBtn.style.cursor = 'not-allowed';
        xBtn.textContent = 'No PvP Coins';
        xBtn.style.background = '#6c7086';
      } else {
        xBtn.disabled = false;
        xBtn.style.cursor = 'pointer';
        if (isRunning && automationMode === 'x') {
          xBtn.textContent = `Stop PvP (${remaining})`;
          xBtn.style.background = '#f38ba8';
        } else {
          xBtn.textContent = 'Automate PvP';
          xBtn.style.background = '#ffffff';
        }
      }
    }

    if (allBtn) {
      if (coins === 0 && !isRunning) {
        allBtn.disabled = true;
        allBtn.style.cursor = 'not-allowed';
        allBtn.textContent = 'No PvP Coins';
        allBtn.style.background = '#6c7086';
      } else {
        allBtn.disabled = false;
        allBtn.style.cursor = 'pointer';
        if (isRunning && automationMode === 'all') {
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
      // Force override browser dialogs immediately if automation is running
      if (getPvPAutomation()) {
        window.alert = () => true;
        window.confirm = () => true;
        window.prompt = () => true;
      }

      createPvPBattleHUD();
      createPvPStopButton();
      createAutoSurrenderCheckbox();

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

  function initPvPBattleMods(){
    initPvPAutomation();
  }

  function createPvPBattleHUD() {
    const myHpText = document.getElementById('myHpText');
    if (!myHpText || document.getElementById('pvp-hud')) return;

    const hudDiv = document.createElement('div');
    hudDiv.id = 'pvp-hud';
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

  var autoSlashEnabled = false;
  var autoSlashInterval = null;

  function updatePvPStopButtonState() {
    const stopBtn = document.getElementById('pvp-stop-btn');
    if (!stopBtn) return;

    const isPvPRunning = getPvPAutomation();
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;

    if (isPvPRunning) {
      stopBtn.textContent = '⏹️ Stop Auto';
      stopBtn.style.background = 'linear-gradient(180deg, #eb4582, #d33855)';
      stopBtn.style.border = '1px solid #ef6095';
    } else if (autoSlashEnabled) {
      stopBtn.textContent = '⏹️ Stop Slash';
      stopBtn.style.background = 'linear-gradient(180deg, #eb4582, #d33855)';
      stopBtn.style.border = '1px solid #ef6095';
    } else {
      stopBtn.textContent = '⚔️ Start AutoSlash';
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
      localStorage.setItem('pvp-automation-mode', 'all');
      localStorage.setItem('pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      updatePvPStopButtonState();
      showNotification('PvP automation stopped', 'info');
    } else if (autoSlashEnabled) {
      stopAutoSlash();
      updatePvPStopButtonState();
      showNotification('AutoSlash stopped', 'info');
    } else {
      startAutoSlash();
      updatePvPStopButtonState();
      showNotification('AutoSlash started', 'success');
    }
  }

  function startAutoSlash() {
    autoSlashEnabled = true;
    autoSlashInterval = setInterval(() => {
      if (!autoSlashEnabled) return;

      const enemyHealthEl = document.getElementById('enemyHpText');
      if (enemyHealthEl) {
        const enemyHealth = parseInt(enemyHealthEl.textContent.split('/')[0].replace(/[^0-9,.]/g, ''));
        if (enemyHealth <= 0) {
          stopAutoSlash();
          updatePvPStopButtonState();
          showNotification('Enemy defeated - AutoSlash stopped', 'success');
          return;
        }
      }

      const attackBtn = document.querySelector('.attack-btn.skill-btn[data-cost="1"]');
      if (attackBtn && attackBtn.offsetParent !== null && !attackBtn.disabled) {
        attackBtn.click();
      }
    }, 1070);
  }

  function stopAutoSlash() {
    autoSlashEnabled = false;
    if (autoSlashInterval) {
      clearInterval(autoSlashInterval);
      autoSlashInterval = null;
    }
  }

  function createAutoSurrenderCheckbox() {
    const surrenderRow = document.querySelector('.surrender-row');
    if (!surrenderRow || document.getElementById('pvp-auto-surrender')) return;

    const checkboxDiv = document.createElement('div');
    checkboxDiv.style.cssText = 'margin-top: 10px; text-align: center;';
    checkboxDiv.innerHTML = `
      <label style="color: #cdd6f4; font-size: 14px; cursor: pointer;">
        <input type="checkbox" id="pvp-auto-surrender" ${extensionSettings.autoSurrenderEnabled ? 'checked' : ''}>
        Auto Surrender (when losing)
      </label>
    `;

    surrenderRow.appendChild(checkboxDiv);

    const checkbox = document.getElementById('pvp-auto-surrender');
    checkbox.addEventListener('change', () => {
      extensionSettings.autoSurrenderEnabled = checkbox.checked;
      saveSettings();
    });
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

  function initBlacksmithMods() {
    console.log('Blacksmith mods initialized');
  }

  function initMerchantMods() {
    console.log('Merchant mods initialized');
  }

  function initEventMods() {
    console.log('Event mods initialized');
  }

  // PvP Automation System
  var originalAlert = window.alert;
  var originalConfirm = window.confirm;
  var originalPrompt = window.prompt;

  function getPvPAutomation() {
    return localStorage.getItem('veyra-pvp-automation') === 'true';
  }

  function setPvPAutomation(value) {
    localStorage.setItem('veyra-pvp-automation', value.toString());
  }

  function updatePvPButtonState() {
    const btn = document.getElementById('btn-automation-pvp');
    if (!btn) return;

    const isRunning = getPvPAutomation();
    const automationMode = localStorage.getItem('pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('pvp-automation-x-remaining') || '0');

    if (isRunning && automationMode === 'x') {
      btn.textContent = `⏹️ Stop PvP (${remaining})`;
      btn.style.background = '#f38ba8';
    } else {
      btn.textContent = isRunning ? '⏹️ Stop PvP' : '🤖 PvP Auto';
      btn.style.background = isRunning ? '#f38ba8' : '#74c0fc';
    }
  }

  function togglePvPAutomationX() {
    const input = document.getElementById('automationXBtnInput');
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;
    const isRunning = getPvPAutomation();

    if (isRunning) {
      setPvPAutomation(false);
      localStorage.setItem('pvp-automation-mode', 'x');
      localStorage.setItem('pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      showNotification('PvP automation stopped', 'info');
      return;
    }

    const xValue = parseInt(input.value) || 0;

    if (xValue < 1) {
      showNotification('Value must be at least 1', 'error');
      return;
    }

    if (xValue > coins) {
      showNotification(`Not enough coins! You have ${coins} coins but need ${xValue}`, 'error');
      return;
    }

    localStorage.setItem('pvp-automation-mode', 'x');
    localStorage.setItem('pvp-automation-x-count', xValue.toString());
    localStorage.setItem('pvp-automation-x-remaining', xValue.toString());
    setPvPAutomation(true);
    updatePvPHeroButtonState();

    if (!window.location.pathname.includes('pvp.php') && !window.location.pathname.includes('pvp_battle.php')) {
      showNotification(`Starting PvP automation for ${xValue} battles...`, 'success');
      window.location.href = 'pvp.php';
    } else {
      showNotification(`Starting PvP automation for ${xValue} battles...`, 'success');
      startPvPAutomation();
    }
  }

  function togglePvPAutomationAll() {
    const coinsEl = document.querySelector('#pvp-coins');
    const coins = coinsEl ? parseInt(coinsEl.textContent) : 0;
    const isRunning = getPvPAutomation();

    if (isRunning) {
      setPvPAutomation(false);
      localStorage.setItem('pvp-automation-mode', 'all');
      localStorage.setItem('pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      showNotification('PvP automation stopped', 'info');
      return;
    }

    if (coins === 0) {
      showNotification('No PvP coins available', 'error');
      return;
    }

    localStorage.setItem('pvp-automation-mode', 'all');
    localStorage.setItem('pvp-automation-x-remaining', '0');
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
    const automationMode = localStorage.getItem('pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('pvp-automation-x-remaining') || '0');

    // Check stopping conditions BEFORE starting battle
    if (automationMode === 'x' && remaining <= 0) {
      showNotification('PvP automation completed', 'success');
      setPvPAutomation(false);
      localStorage.setItem('pvp-automation-mode', 'all');
      localStorage.setItem('pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      return;
    }

    if (coins <= 0) {
      showNotification('No more PVP coins available', 'warning');
      setPvPAutomation(false);
      localStorage.setItem('pvp-automation-mode', 'all');
      localStorage.setItem('pvp-automation-x-remaining', '0');
      updatePvPHeroButtonState();
      return;
    }

    // Start battle and handle completion
    performSingleBattle().then(async () => {
      // Continue to next battle
      setTimeout(() => {
        window.location.href = 'https://demonicscans.org/pvp.php';
      }, 1000);
    });
  }

  function performSingleBattle() {
    const automationMode = localStorage.getItem('pvp-automation-mode') || 'all';
    const remaining = parseInt(localStorage.getItem('pvp-automation-x-remaining') || '0');

    if (automationMode === 'x') {
      const newRemaining = remaining - 1;
      console.log('Battle completed, updating remaining from', remaining, 'to', newRemaining);
      localStorage.setItem('pvp-automation-x-remaining', newRemaining.toString());
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
        if (extensionSettings.autoSurrenderEnabled) {
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

    const endBody = document.querySelector('#endBody');
    if (endBody && endBody.textContent.trim() !== '') {
      setTimeout(() => {
        window.location.href = 'https://demonicscans.org/pvp.php';
      }, 2000);
      return;
    }

    // Check for auto surrender
    if (extensionSettings.autoSurrenderEnabled) {
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
    if (attackBtn && attackBtn.offsetParent !== null) {
      attackBtn.click();
      setTimeout(() => {
        updatePvPBattleStats();
      }, 500);
    }

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

  // Farming automation variables
  function getFarmingAutomation() {
    return localStorage.getItem('veyra-farming-automation') === 'true';
  }

  function setFarmingAutomation(value) {
    localStorage.setItem('veyra-farming-automation', value.toString());
  }

  function createFarmingHUD() {
    // Only create HUD on main site pages (not game pages)
    if (window.location.hostname !== 'demonicscans.org' ||
        (window.location.pathname.includes('.php') && window.location.pathname !== '/index.php')) return;

    if (document.getElementById('farming-hud')) return;

    const hud = document.createElement('div');
    hud.id = 'farming-hud';
    hud.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: lime;
      font-size: 14px;
      font-family: monospace;
      padding: 8px 12px;
      border-radius: 8px;
      z-index: 99999;
      line-height: 1.5em;
    `;

    document.body.appendChild(hud);
    updateFarmingHUD();
  }

  function updateFarmingHUD() {
    const hud = document.getElementById('farming-hud');
    if (!hud) return;

    const isRunning = getFarmingAutomation();
    hud.style.color = isRunning ? 'lime' : 'yellow';

    if (window.location.pathname.includes('/title/') && window.location.pathname.includes('/chapter/')) {
      // Chapter page - show stamina and farm stats
      const staminaEl = document.evaluate(
        '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[1]/span',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;

      const farmEl = document.evaluate(
        '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[2]/span',
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;

      const staminaText = staminaEl ? staminaEl.innerText.trim() : '0/0';
      const farmText = farmEl ? farmEl.innerText.trim() : '0/0';

      const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';
      hud.innerHTML = `⚡ Stamina: ${staminaText}<br/>🌾 Farm: ${farmText}<br/>🤖 Mode: ${farmingMode === 'energy-cap' ? 'Energy Cap' : 'Energy Target'}<br/><button id="farming-hud-toggle">${isRunning ? 'Stop' : 'Start'} Farming</button>`;
    } else if (window.location.pathname.includes('/manga/')) {
      // Manga page
      const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';
      hud.innerHTML = `📖 Manga Page<br/>🤖 Mode: ${farmingMode === 'energy-cap' ? 'Energy Cap' : 'Energy Target'}<br/>Auto Farming: ${isRunning}<br/><button id="farming-hud-toggle">${isRunning ? 'Stop' : 'Start'} Farming</button>`;
    } else {
      // Homepage
      const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';
      hud.innerHTML = isRunning ?
        'Veyra - UI Overhaul v0.37<br/>Running Auto Farming<br/><button id="farming-hud-toggle">Stop Farming</button>' :
        `Veyra - UI Overhaul v0.37<br/><br/>🤖 Mode: ${farmingMode === 'energy-cap' ? 'Energy Cap' : 'Energy Target'}<br/>Configure in Settings<br/><button id="farming-hud-toggle">Start Farming</button>`;
    }

    // Setup farming HUD toggle button
    setTimeout(() => {
      const toggleBtn = document.getElementById('farming-hud-toggle');
      if (toggleBtn && !toggleBtn.hasAttribute('data-listener-added')) {
        toggleBtn.addEventListener('click', toggleFarmingAutomationHUD);
        toggleBtn.setAttribute('data-listener-added', 'true');
      }
    }, 100);
  }

  function toggleFarmingAutomationHUD() {
    const newRunningState = !getFarmingAutomation();
    setFarmingAutomation(newRunningState);
    updateFarmingHUD();

    if (newRunningState) {
      showNotification('Starting farming automation...', 'success');
      window.location.href = 'https://demonicscans.org/';
    } else {
      showNotification('Farming automation stopped', 'info');
    }
  }

  function getStamina() {
    const staminaEl = document.evaluate(
      '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[1]/span',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;
    if (!staminaEl) return null;
    const [current, max] = staminaEl.innerText.split('/').map(s => parseInt(s.trim()));
    return { current, max };
  }

  function getFarm() {
    const farmEl = document.evaluate(
      '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[2]/span',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;
    if (!farmEl) return null;
    const [current, max] = farmEl.innerText.split('/').map(s => parseInt(s.replace(/,/g, '').trim(), 10));
    return { current, max };
  }

  function checkUserLogin(bypass = false) {
    let userInfo, loginContainer
    
    if(bypass) {
      userInfo = false
      loginContainer = true
    } else {
      userInfo = document.querySelector('.comments-section .user-info');
      loginContainer = document.querySelector('#login-container');
    }

    if ((!userInfo || loginContainer) && !window.location.href.includes("signin.php")) {
      console.log('User not logged in, clearing cookies and redirecting to login');
      // Clear all cookies for this domain
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Save current page for resume
      sessionStorage.setItem("veyra_resume_page", window.location.href);
      window.location.href = "https://demonicscans.org/signin.php";
      return false;
    }
    return true;
  }

  function checkFarmingLimits() {
    const stamina = getStamina();
    const farm = getFarm();
    if (!stamina || !farm) return false;

    if (!getFarmingAutomation()) return false;

    // Check if user is still logged in
    if (!checkUserLogin()) return false;

    const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';

    if (farmingMode === 'energy-cap') {
      const minusEnergyCap = parseInt(localStorage.getItem('minus-energy-cap')) || 30;
      if (stamina.max - stamina.current <= minusEnergyCap) {
        setFarmingAutomation(false);
        updateFarmingHUD();
        return false;
      }
    } else {
      const targetEnergy = parseInt(localStorage.getItem('target-farming-energy')) || 150;
      if (stamina.current >= targetEnergy) {
        setFarmingAutomation(false);
        updateFarmingHUD();
        return false;
      }
    }

    if (farm.current >= farm.max) {
      setFarmingAutomation(false);
      startFarming();
      return false;
    }

    return true;
  }

  function clickReaction() {
    const reaction = document.evaluate(
      '/html/body/div[5]/center/div/div[1]/div[3]/div[1]',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;

    if (reaction) {
      reaction.scrollIntoView();
      reaction.click();
      console.log('✅ Clicked reaction on', window.location.href);
      return true;
    } else {
      console.log('⚠️ Reaction not found on', window.location.href);
      console.log('User not logged in, clearing cookies and redirecting to login');
      // Clear all cookies for this domain
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Save current page for resume
      sessionStorage.setItem("veyra_resume_page", window.location.href);
      window.location.href = "https://demonicscans.org/signin.php";
      return false;
    }
  }

  function goNextPage() {
    const nextBtn = document.querySelector('body > div.chapter-info > div > a.nextchap');

    if (nextBtn) {
      console.log('➡️ Navigating to next chapter:', nextBtn.href);
      window.location.href = nextBtn.href;
    } else {
      console.log('❌ Next button not found, picking new manga');
      startFarming();
    }
  }

  function startFarming() {
    if (!getFarmingAutomation()) return;
    window.location.href = 'https://demonicscans.org';
  }

  function pickRandomManga() {
    const owlItems = document.querySelectorAll('.owl-item .owl-element a');
    if (owlItems.length === 0) {
      setTimeout(pickRandomManga, 1000);
      return;
    }

    const randomIndex = Math.floor(Math.random() * owlItems.length);
    const randomManga = owlItems[randomIndex];
    console.log('Picked random manga:', randomManga.href);
    window.location.href = randomManga.href;
  }

  function startFromLastChapter() {
    const chapters = document.querySelectorAll('#chapters-list > li > a');
    if (chapters.length === 0) {
      setTimeout(startFromLastChapter, 1000);
      return;
    }

    const lastChapter = chapters[chapters.length - 1];
    console.log('Starting from last chapter:', lastChapter.href);
    window.location.href = lastChapter.href;
  }

  // Autologin functions
  function autoLogin() {
    if (!window.location.href.includes("signin.php")) return false;

    const isEnabled = sessionStorage.getItem('autologin-enabled') === 'true';
    if (!isEnabled) return false;

    const email = window.secureCredentials ? window.secureCredentials.getEmail() : '';
    const password = window.secureCredentials ? window.secureCredentials.getPassword() : '';

    if (!email || !password) return false;

    const emailInput = document.evaluate('//*[@id="login-container"]/form/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const passwordInput = document.evaluate('//*[@id="login-container"]/form/input[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const loginBtn = document.evaluate('//*[@id="login-container"]/form/input[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (emailInput && passwordInput && loginBtn) {
      emailInput.value = email;
      passwordInput.value = password;
      loginBtn.click();
      return true;
    }
    return false;
  }

  function checkLoginOnChapterPage() {
    if (!window.location.href.includes("/chapter/")) return false;

    const isEnabled = sessionStorage.getItem('autologin-enabled') === 'true';
    const isFarmingRunning = getFarmingAutomation();

    if (!isEnabled || !isFarmingRunning) return false;

    const loginBtn = document.evaluate(
      '//*[@id="discuscontainer"]/div[1]/div[3]/div[5]/a[1]',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;

    if (loginBtn) {
      sessionStorage.setItem("veyra_resume_page", window.location.href);
      window.location.href = "https://demonicscans.org/signin.php";
      return true;
    }
    return false;
  }

  function handleResumeAfterLogin() {
    const resumePage = sessionStorage.getItem("veyra_resume_page");
    if (resumePage && resumePage !== window.location.href) {
      sessionStorage.removeItem("veyra_resume_page");
      window.location.href = resumePage;
      return true;
    }
    return false;
  }

  function runFarming() {
    updateFarmingHUD();

    // Handle login detection on chapter pages
    if (checkLoginOnChapterPage()) return;

    // Handle auto-login
    if (window.location.href.includes("signin.php")) {
      if (autoLogin()) return;
      return; // wait for manual login if auto-login fails
    }

    // Handle resume after login
    if (handleResumeAfterLogin()) return;

    // Handle different page types
    if (window.location.pathname === '/' && getFarmingAutomation()) {
      pickRandomManga();
      return;
    }

    // Check if we're on manga page and need to pick last chapter
    if (window.location.pathname.includes('/manga/') && getFarmingAutomation()) {
      startFromLastChapter();
      return;
    }

    // Only run farming logic if on chapter pages
    if (!window.location.pathname.includes('/title/') || !window.location.pathname.includes('/chapter/')) return;

    if (!checkFarmingLimits()) {
      if (!getFarmingAutomation()) return;
      setTimeout(runFarming, 5000);
      return;
    }

    const reactSuccess = clickReaction();
    if (reactSuccess) {
      setTimeout(() => {
        goNextPage();
      }, 1500);
    }
  }

  function initFarmingAutomationButton() {
    const farmingBtn = document.getElementById('btn-automation-farming');
    if (farmingBtn) {
      updateFarmingButtonState();
      farmingBtn.addEventListener('click', toggleFarmingAutomation);
    }
  }

  function updateFarmingButtonState() {
    const btn = document.getElementById('btn-automation-farming');
    if (!btn) return;

    const isRunning = getFarmingAutomation();
    btn.textContent = isRunning ? '⏹️ Stop Farm' : '🌽 Auto Farm';
    btn.style.background = isRunning ? '#f38ba8' : '#74c0fc';
  }

  function toggleFarmingAutomation() {
    const newRunningState = !getFarmingAutomation();
    setFarmingAutomation(newRunningState);
    updateFarmingButtonState();

    if (newRunningState) {
      showNotification('Starting farming automation...', 'success');
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = 'https://demonicscans.org/'
      if(isMobileView) window.location.href = 'https://demonicscans.org/'
      else a.click()

    } else {
      showNotification('Farming automation stopped', 'info');
    }
  }

  function initFarmingAutomation() {
    // Only run on main site pages
    if (window.location.hostname !== 'demonicscans.org' ||
        (window.location.pathname.includes('.php') && window.location.pathname !== '/index.php')) return;

    createFarmingHUD();

    // Update HUD every 2 seconds
    setInterval(() => {
      if (document.getElementById('farming-hud')) {
        updateFarmingHUD();
      }
    }, 2000);

    if (getFarmingAutomation()) {
      setTimeout(runFarming, 1000);
    }
  }

  function initSideBar(){
    const noContainerPage = !document.querySelector('.container') && !document.querySelector('.wrap');
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-wrapper';

    const sidebar = document.createElement('aside');
    sidebar.id = 'game-sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <a href="game_dash.php" style="text-decoration:none;"><h2>Game Menu</h2></a>
      </div>

      <ul class="sidebar-menu">
        <li><a href="pvp.php"><img src="/images/pvp/season_1/compressed_menu_pvp_season_1.webp" alt="PvP Arena"> PvP Arena</a></li>
        <li><a href="orc_cull_event.php"><img src="/images/events/orc_cull/banner.webp" alt="Goblin Feast"> 🪓 ⚔️ War Drums of GRAKTHAR</a></li>
        <li><a href="active_wave.php?event=2&wave=6" draggable="false"><img src="/images/events/orc_cull/banner.webp" alt="War Drums of GRAKTHAR"> Event Battlefield</a></li>
        <li><a href="active_wave.php?gate=3&wave=3"><img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Gate Grakthar</a></li>
        <li><a href="inventory.php"><img src="images/menu/compressed_chest.webp" alt="Inventory"> Inventory & Equipment</a></li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="pets.php"><img src="images/menu/compressed_eggs_menu.webp" alt="Pets"> Pets & Eggs</a>
            <button class="expand-btn" id="pets-expand-btn">${extensionSettings.petsExpanded ? '-' : '+'}</button>
          </div>
          <div id="pets-expanded" class="sidebar-submenu ${extensionSettings.petsExpanded ? '' : 'collapsed'}">
            <div class="coming-soon-text">🚧 Working on it / Coming Soon</div>
          </div>
        </li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="stats.php" draggable="false">
              <img src="images/menu/compressed_stats_menu.webp" alt="Stats">
              <span id="stats-menu-text">Stats ⚔️<span id="sidebar-attack">-</span> 🛡️<span id="sidebar-defense">-</span> ⚡<span id="sidebar-stamina">-</span> 🔵<span id="sidebar-points">-</span></span>
            </a>
            <button class="expand-btn" id="stats-expand-btn" draggable="false">${extensionSettings.statsExpanded ? '-' : '+'}</button>
          </div>
          <div id="stats-expanded" class="sidebar-submenu ${extensionSettings.statsExpanded ? '' : 'collapsed'}">
            <div class="upgrade-section">
              <div class="stat-upgrade-row">
                <div class="stat-info">
                  <span>⚔️ Atk</span>
                  <span id="sidebar-attack-exp" style="margin-right:6px;">-</span>
                </div>
                <div class="upgrade-controls">
                  <button class="upgrade-btn" onclick="sidebarAlloc('attack',1)">+1</button>
                  <button class="upgrade-btn" onclick="sidebarAlloc('attack',5)">+5</button>
                </div>
              </div>
              <div class="stat-upgrade-row">
                <div class="stat-info">
                  <span>🛡️ Def</span>
                  <span id="sidebar-defense-exp" style="margin-right:6px;">-</span>
                </div>
                <div class="upgrade-controls">
                  <button class="upgrade-btn" onclick="sidebarAlloc('defense',1)">+1</button>
                  <button class="upgrade-btn" onclick="sidebarAlloc('defense',5)">+5</button>
                </div>
              </div>
              <div class="stat-upgrade-row">
                <div class="stat-info">
                  <span>⚡ Sta</span>
                  <span id="sidebar-stamina-exp" style="margin-right:6px;">-</span>
                </div>
                <div class="upgrade-controls">
                  <button class="upgrade-btn" onclick="sidebarAlloc('stamina',1)">+1</button>
                  <button class="upgrade-btn" onclick="sidebarAlloc('stamina',5)">+5</button>
                </div>
              </div>
              <div class="upgrade-note">Available Points: <span id="sidebar-points-exp">-</span></div>
            </div>
          </div>
        </li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="blacksmith.php"><img src="images/menu/compressed_crafting.webp" alt="Blacksmith"> Blacksmith</a>
            <button class="expand-btn" id="blacksmith-expand-btn">${extensionSettings.blacksmithExpanded ? '-' : '+'}</button>
          </div>
          <div id="blacksmith-expanded" class="sidebar-submenu ${extensionSettings.blacksmithExpanded ? '' : 'collapsed'}">
            <div class="coming-soon-text">🚧 Working on it / Coming Soon</div>
          </div>
        </li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="merchant.php"><img src="images/menu/compressed_merchant.webp" alt="Merchant"> Merchant</a>
            <button class="expand-btn" id="merchant-expand-btn">${extensionSettings.merchantExpanded ? '-' : '+'}</button>
          </div>
          <div id="merchant-expanded" class="sidebar-submenu ${extensionSettings.merchantExpanded ? '' : 'collapsed'}">
            <div class="coming-soon-text">Visit merchant page to pin items for quick access</div>
          </div>
        </li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="inventory.php"><img src="images/menu/compressed_chest.webp" alt="Inventory"> Inventory Quick Access</a>
            <button class="expand-btn" id="inventory-expand-btn">${extensionSettings.inventoryExpanded ? '-' : '+'}</button>
          </div>
          <div id="inventory-expanded" class="sidebar-submenu ${extensionSettings.inventoryExpanded ? '' : 'collapsed'}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; color: #888;">Pinned Items</span>
              <button id="refresh-inventory-btn" style="background: #74c0fc; color: #1e1e2e; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">🔄</button>
            </div>
            <div class="sidebar-quick-access">
              <div class="quick-access-empty">No items pinned. Visit inventory page to pin items.</div>
            </div>
          </div>
        </li>
        <li><a href="achievements.php"><img src="images/menu/compressed_achievments.webp" alt="Achievements"> Achievements</a></li>
        <li><a href="collections.php"><img src="images/menu/compressed_collections.webp" alt="Collections"> Collections</a></li>
        <li><a href="guide.php"><img src="images/menu/compressed_guide.webp" alt="Guide"> How To Play</a></li>
        <li><a href="weekly.php"><img src="images/menu/weekly_leaderboard.webp" alt="Leaderboard"> Weekly Leaderboard</a></li>
        <li><a href="chat.php"><img src="images/menu/compressed_chat.webp" alt="Chat"> Global Chat</a></li>
        <li><a href="patches.php"><img src="images/menu/compressed_patches.webp" alt="PatchNotes"> Patch Notes</a></li>
        <li><a href="index.php"><img src="images/menu/compressed_manga.webp" alt="Manga"> Manga-Manhwa-Manhua</a></li>
        <li>
          <div class="sidebar-menu-expandable">
            <a href="#"><img src="https://i.ibb.co.com/hJ0dXP13/1758653168-small.jpg" alt="Automation"> Automation Script</a>
            <button class="expand-btn" id="automation-expand-btn">${extensionSettings.automationExpanded ? '-' : '+'}</button>
          </div>
          <div id="automation-expanded" class="sidebar-submenu ${extensionSettings.automationExpanded ? '' : 'collapsed'}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; color: #888;">PvP Autofight</span>
              <button id="btn-automation-pvp" style="background: #74c0fc; color: #1e1e2e; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">🤖 PvP Auto</button>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; color: #888;">Energy Autofarm</span>
              <button id="btn-automation-farming" style="background: #74c0fc; color: #1e1e2e; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px;">🌽 Auto Farm Energy</button>
            </div>
          </div>
        </li>
        <li><a href="#" id="settings-link"><img src="images/menu/compressed_stats_menu.webp" alt="Settings"> ⚙️ Settings</a></li>
        <li><a href="#" id="about-link"><img src="images/menu/compressed_guide.webp" alt="About"> ℹ️ About</a></li>
      </ul>
      <div style="font-size: 11px;color: #a6adc8; margin-top:10px;text-align: center;">Veyra - UI Overhaul v0.37</div>
    `;

    const sidebarClose = document.createElement('div')
    sidebarClose.className = 'sidebar-toggle-x';
    sidebarClose.innerText = 'X';
    sidebar.querySelector('.sidebar-header').appendChild(sidebarClose)

    const sidebarToggle = document.createElement('div')
    sidebarToggle.className = 'sidebar-toggle hide';
    sidebarToggle.innerText = 'Game Menu';

    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    if(noContainerPage){
      const topbar = document.querySelector('.game-topbar');
      const allElements = Array.from(document.body.children);
      const topbarIndex = allElements.indexOf(topbar);

      for (let i = topbarIndex + 1; i < allElements.length; i++) {
        if (!allElements[i].classList.contains('main-wrapper') &&
            !allElements[i].id !== 'sidebarToggle') {
          contentArea.appendChild(allElements[i]);
        }
      }
    } else {
      const existingContainer = document.querySelector('.container') || document.querySelector('.wrap');
      if (existingContainer) {
        contentArea.appendChild(existingContainer);
      }
    }

    mainWrapper.appendChild(sidebar);
    mainWrapper.appendChild(sidebarToggle);
    mainWrapper.appendChild(contentArea);
    document.body.appendChild(mainWrapper);

    sidebarToggle.addEventListener('click', () => {
      if(sidebar.classList.contains('hide')){
        sidebar.classList.remove('hide')
        if(!isMobileView) contentArea.classList.remove('full')
        sidebarToggle.classList.add('hide')
        extensionSettings.sidebarVisible = true;
      } else {
        sidebar.classList.add('hide')
        if(!isMobileView && !contentArea.classList.contains('full')) contentArea.classList.add('full')
        sidebarToggle.classList.remove('hide')
        extensionSettings.sidebarVisible = false;
      }
      saveSettings();
    });

    sidebarClose.addEventListener('click', () => {
      if(sidebar.classList.contains('hide')){
        sidebar.classList.remove('hide')
        if(!isMobileView) contentArea.classList.remove('full')
        sidebarToggle.classList.add('hide')
        extensionSettings.sidebarVisible = true;
      } else {
        sidebar.classList.add('hide')
        if(!isMobileView && !contentArea.classList.contains('full')) contentArea.classList.add('full')
        sidebarToggle.classList.remove('hide')
        extensionSettings.sidebarVisible = false;
      }
      saveSettings();
    });

    // Apply saved sidebar visibility state
    if (!extensionSettings.sidebarVisible || isMobileView) {
      sidebar.classList.add('hide');
      contentArea.classList.add('full');
      sidebarToggle.classList.remove('hide');
    }

    // Add resize listener for responsive behavior
    if(!resizeListener) {
      resizeListener = window.addEventListener('resize', () => {
        handleSidebarResize();
      });
    }

    function handleSidebarResize() {
      if(isMobileView && !contentArea.classList.contains('full') && extensionSettings.sidebarVisible) {
        sidebar.classList.add('hide')
        contentArea.classList.add('full')
        sidebarToggle.classList.remove('hide')
      } else if (!isMobileView && contentArea.classList.contains('full') && extensionSettings.sidebarVisible) {
        contentArea.classList.remove('full')
        sidebarToggle.classList.add('hide')
        sidebar.classList.remove('hide')
      }
    }

    document.body.style.paddingTop = !isMobileView ? "55px" : "80px";
    document.body.style.paddingLeft = "0px";
    document.body.style.margin = "0px";

    const style = document.createElement('style');
    style.textContent = `
      body.veyra-background {
        background: rgba(0,0,0,0) !important;
      }

      #veyra-background {
        display: none;
      }

      .veyra-background #veyra-background {
        display: block;
      }

      .main-wrapper {
        display: flex;
        min-height: calc(100vh - 74px);
      }

      #game-sidebar {
        width: 250px;
        background: linear-gradient(145deg, #272727, #000000);
        border-right: 1px solid rgba(255, 255, 255, 0.06);
        flex-shrink: 0;
        padding: 18px 0;
        overflow-y: auto;
        position: fixed;
        transition: all .5s ease;
        left: 0;
        z-index: 100;
        margin-top: 0;
        height:calc(100vh - 74px);
        top:82px;
      }

      #game-sidebar.veyra-background {
        background: linear-gradient(145deg, rgb(39 39 39 / 90%), rgb(0 0 0 / 90%)) !important;
      }

      .content-area.full .panel .event-table td:has(a.btn) {
        padding: 10px 0;
      }

      #game-sidebar::-webkit-scrollbar, .settings-content::-webkit-scrollbar {
        background-color: rgba(255,255,255,0);
        width:10px;
      }

      #game-sidebar::-webkit-scrollbar-track, .settings-content::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
      }

      #game-sidebar::-webkit-scrollbar-thumb, .settings-content::-webkit-scrollbar-thumb {
        background-color: #555;
        border-radius:16px;
        border: 1px solid rgba(255,255,255,0);
      }

      #game-sidebar.hide {
        left:-252px;
        z-index: -1;
      }

      .sidebar-header {
        padding: 0 20px 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 15px;
      }

      .sidebar-header h2 {
        color: #FFD369;
        margin: 0;
        font-size: 1.4rem;
      }

      .sidebar-toggle {
        cursor: pointer;
        background: linear-gradient(145deg, #272727, #000000);
        position: fixed;
        left: -46px;
        bottom: 60px;
        transform: rotate(90deg);
        padding: 10px 20px;
        border-radius: 14px 14px 0 0;
        z-index: 1;
      }

      .veyra-background .sidebar-toggle {
        background: linear-gradient(145deg, #312b2b, #100d0d) !important;
      }

      .sidebar-toggle.hide {
        z-index: -1;
        left: -110px;
      }

      .sidebar-toggle-x {
        position: absolute;
        right: 8px;
        top: 16px;
        padding: 8px;
        cursor: pointer;
        color: #FFD369;
      }

      .expand-btn {
        background: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #e0e0e0;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        min-width: 24px;
      }

      .expand-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .upgrade-section {
        color: #e0e0e0;
      }

      .stat-upgrade-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
      }

      .stat-info {
        display: flex;
        justify-content: space-between;
        min-width: 120px;
      }

      .upgrade-controls {
        display: flex;
        gap: 6px;
      }

      .upgrade-btn {
        background: #a6e3a1;
        color: #1e1e2e;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
      }

      .upgrade-btn:hover {
        background: #94d3a2;
      }

      .upgrade-btn:disabled {
        background: #6c7086;
        cursor: not-allowed;
      }

      .upgrade-note {
        font-size: 11px;
        color: #a6adc8;
        text-align: center;
        margin-top: 10px;
        font-style: italic;
      }

      .stats-display-section {
        color: #e0e0e0;
        padding: 10px;
      }

      .stat-display-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 6px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-size: 13px;
      }

      .stat-display-row span {
        font-weight: bold;
      }

      .sidebar-menu {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .sidebar-menu li:last-child {
        border-bottom: none;
      }

      .sidebar-menu a {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        color: #e0e0e0;
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 14px;
      }

      .sidebar-menu a:hover {
        background-color: #252525;
        color: #FFD369;
      }

      .sidebar-menu img {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        object-fit: cover;
        border-radius: 4px;
      }

      .sidebar-menu-expandable {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
      }

      .sidebar-menu-expandable a {
        flex: 1;
        margin: 0;
        padding: 12px 20px;
      }

      .sidebar-menu-expandable .expand-btn {
        margin-left: 10px;
      }

      .sidebar-submenu {
        background: rgba(0, 0, 0, 0.3);
        padding: 15px 20px;
        margin: 0;
        height: max-content;
        overflow: hidden;
        transition: all .5s ease;
      }

      .sidebar-submenu.collapsed {
        padding-top: 0;
        padding-bottom: 0;
        height: 0;
      }

      .coming-soon-text {
        color: #f38ba8;
        font-size: 12px;
        text-align: center;
        font-style: italic;
      }

      .sidebar-quick-access {
        max-height: 300px;
        overflow-y: auto;
      }

      .quick-access-empty {
        color: #888;
        font-size: 12px;
        text-align: center;
        padding: 10px;
        font-style: italic;
      }

      .quick-access-item {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 8px;
      }

      .qa-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }

      .qa-item-info {
        flex: 1;
        min-width: 0;
      }

      .qa-item-name {
        font-size: 11px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .qa-item-price, .qa-item-stats {
        font-size: 10px;
        color: #888;
      }

      .qa-remove-btn {
        background: #f38ba8;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .qa-item-actions {
        display: flex;
        gap: 4px;
      }

      .qa-buy-btn, .qa-use-btn, .qa-equip-btn {
        background: #a6e3a1;
        color: #1e1e2e;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        font-weight: bold;
      }

      .qa-buy-btn:hover, .qa-use-btn:hover, .qa-equip-btn:hover {
        background: #94d3a2;
      }

      .qa-buy-btn:disabled {
        background: #6c7086;
        cursor: not-allowed;
      }

      .qa-use-btn {
        background: #74c0fc;
      }

      .qa-use-btn:hover {
        background: #5aa3e0;
      }

      .qa-equip-btn {
        background: #f9e2af;
      }

      .qa-equip-btn:hover {
        background: #e6d196;
      }

      .content-area {
        flex: 1;
        padding: 20px;
        margin-left: 250px;
        transition: all .5s ease;
      }

      .content-area.full {
        margin-left: 0;
      }

      #stats-menu-text {
        font-size: 13px;
      }

      #stats-menu-text span {
        font-weight: bold;
        margin: 0 2px;
      }

      /* PvP chip Style */
      .pvp-chip {
        text-align: center;
        color: #fafafa;
        border-radius: 999px;
        padding: 4px 6px;
        font-weight: 600;
        font-size: 12px;
      }

      .pvp-chip.danger {
        background: #bb2d2d;
        border: 1px solid #d33939;
      }

      .pvp-chip.success {
        background: #3ddd65;
        border: 1px solid #45e26d;
      }

      .settings-modal {
        background: rgba(0,0,0,0.7);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .settings-content {
        background: linear-gradient(145deg, #272727, #000000);
        border: 2px solid #181818ff;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 75%;
        color: #e0e0e0;
        margin: 10px 0;
        height: -webkit-fill-available;
        overflow: auto;
        display: flex;
        flex-flow: column;
        position: fixed;
        margin-top: 0;
        top: 100px;
      }

      .settings-section {
        margin-bottom: 25px;
      }

      .settings-section .header {
        border-top: 1px solid #a3a3a3;
        border-left: 1px solid #a3a3a3;
        border-right: 1px solid #a3a3a3;
        border-bottom: 0;
        padding: 6px 6px;
        cursor: pointer;
        margin-bottom: 0;
        border-radius: 4px 4px 0 0;
      }

      .header:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .settings-section .header h3 {
        margin: 0;
        border: 0;
        padding: 0;
      }

      .indicator {
        transform: rotate(0deg);
      }

      .settings-section .header .indicator {
        transition: all .5s ease;
        display: inline-block;
        right: 0;
        margin-top: -28px;
        float: right;
      }

      .transition {
        transition: all .5s ease;
      }

      .transition-1 {
        transition: all 1s ease;
      }

      .open .indicator, .open .indicator img {
        transition: all .5s ease;
        transform: rotate(-180deg);
      }

      .indicator img {
        float: right;
        width: 24px;
        filter: contrast(0);
      }

      .settings-section h3 {
        color: #fefefe;
        margin-bottom: 15px;
        border-bottom: 1px solid #464646ff;
        padding-bottom: 8px;
      }

      .collapsible {
        display: block;
        height: 0;
        overflow: hidden;
        transition: all 1s ease;
      }

      .open ~ .collapsible {
        height: fit-content;
      }

      .settings-section .collapsible {
        border: 1px solid #a3a3a3;
        padding: 0px 8px;
        border-radius: 0 0px 4px 4px;
      }

      .settings-section .header.open ~ .collapsible {
        padding: 12px 8px;
      }

      .settings-section .note {
        font-size: 13px;
        color: #acacacff;
        text-align: center;
        margin-top: 10px;
      }

      .settings-section .note-italic {
        font-size: 13px;
        color: #acacacff;
        text-align: center;
        margin-top: 10px;
        font-style: italic;
      }

      .settings-section input, .settings-section select {
        padding: 5px;
        color: #bbbbbbff;
        background: #1f1f1fff;
        border: 1px solid #3a3a3aff;
        border-radius: 4px;
      }

      .settings-section label:has(input[type="checkbox"]) {
        display: flex;
        align-items: end;
        gap: 10px;
        margin-bottom: 10px;
      }

      .settings-button {
        background: #464646ff;
        color: #e0e0e0;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin-right: 10px;
        margin-top: 10px;
      }

      .settings-button:hover {
        background: #6b6b6bff;
      }

      @media (min-width:926px) {
        #game-sidebar {
          height: calc(100vh - 54px);
          top: 54px;
        }

        #extension-enemy-loot-container {
          display: inline-flex;
        }

        #extension-loot-container {
          display: ruby;
          max-width: 50%;
        }

        #extension-loot-container .loot-card {
          width: 50%;
        }
      }

      @media (min-width:601px) and (max-width:925px) {
        #game-sidebar ${isMobileView ? '{height: calc(100vh - 66px);top: 64px;}' : '{height: calc(100vh - 84px);top: 76px;}'}
      }

      @media (max-width: 640px) {
        .pvp-hero {
          height: 260px;
        }
      }

      @media (max-width:600px) {
        body {
          padding-right: 0;
          padding-top: 70px;
        }

        .content-area.full {
          width: -webkit-fill-available;
          top: 74px;
        }

        .sidebar-toggle {
          background: linear-gradient(90deg, #b73bf6, #7022ee);
        }

        .content-area.full .panel {
          width: -webkit-fill-available;
        }

        .ranking-wrapper {
          flex-wrap: wrap
        }

        #extension-enemy-loot-container {
          display: flex;
          flex-flow: column;
          flex-wrap: wrap;
          gap: 16px;
        }

        #extension-loot-container {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
        }

        #extension-loot-container .loot-card {
          width: 42%;
        }
      }
    `;
    document.head.appendChild(style);

    initSidebarExpandables();
    initSettingsModal();
    initGameBackground();
    fetchAndUpdateSidebarStats();
    updateSidebarInventorySection();
    updateSidebarMerchantSection();

    // Refresh stats every 30 seconds
    setInterval(fetchAndUpdateSidebarStats, 30000);

    showNotification('Veyra UI Overhaul loaded successfully!', 'success');
  }

  function initSidebarExpandables() {
    const statsExpandBtn = document.getElementById('stats-expand-btn');
    const statsExpanded = document.getElementById('stats-expanded');

    if (statsExpandBtn && statsExpanded) {
      statsExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = statsExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          statsExpanded.classList.remove('collapsed');
          statsExpandBtn.textContent = '-';
          extensionSettings.statsExpanded = true;
        } else {
          statsExpanded.classList.add('collapsed');
          statsExpandBtn.textContent = '+';
          extensionSettings.statsExpanded = false;
        }

        saveSettings();
      });

      if (extensionSettings.statsExpanded) {
        statsExpanded.classList.remove('collapsed');
        statsExpandBtn.textContent = '-';
      } else {
        statsExpanded.classList.add('collapsed');
        statsExpandBtn.textContent = '+';
      }
    }

    // Add programmatic event listeners for stat upgrade buttons
    const upgradeControls = document.querySelectorAll('.upgrade-controls');
    upgradeControls.forEach(controls => {
      const plus1Btn = controls.querySelector('button:first-child');
      const plus5Btn = controls.querySelector('button:last-child');

      if (plus1Btn) {
        plus1Btn.addEventListener('click', () => {
          const statRow = controls.closest('.stat-upgrade-row');
          const stat = statRow?.dataset.stat || 'attack';
          sidebarAlloc(stat, 1);
        });
      }

      if (plus5Btn) {
        plus5Btn.addEventListener('click', () => {
          const statRow = controls.closest('.stat-upgrade-row');
          const stat = statRow?.dataset.stat || 'attack';
          sidebarAlloc(stat, 5);
        });
      }
    });

    // Pets expandable
    const petsExpandBtn = document.getElementById('pets-expand-btn');
    const petsExpanded = document.getElementById('pets-expanded');

    if (petsExpandBtn && petsExpanded) {
      petsExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = petsExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          petsExpanded.classList.remove('collapsed');
          petsExpandBtn.textContent = '-';
          extensionSettings.petsExpanded = true;
        } else {
          petsExpanded.classList.add('collapsed');
          petsExpandBtn.textContent = '+';
          extensionSettings.petsExpanded = false;
        }

        saveSettings();
      });

      if (extensionSettings.petsExpanded) {
        petsExpanded.classList.remove('collapsed');
        petsExpandBtn.textContent = '-';
      }
    }

    // Blacksmith expandable
    const blacksmithExpandBtn = document.getElementById('blacksmith-expand-btn');
    const blacksmithExpanded = document.getElementById('blacksmith-expanded');

    if (blacksmithExpandBtn && blacksmithExpanded) {
      blacksmithExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = blacksmithExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          blacksmithExpanded.classList.remove('collapsed');
          blacksmithExpandBtn.textContent = '-';
          extensionSettings.blacksmithExpanded = true;
        } else {
          blacksmithExpanded.classList.add('collapsed');
          blacksmithExpandBtn.textContent = '+';
          extensionSettings.blacksmithExpanded = false;
        }

        saveSettings();
      });

      if (extensionSettings.blacksmithExpanded) {
        blacksmithExpanded.classList.remove('collapsed');
        blacksmithExpandBtn.textContent = '-';
      }
    }

    // Merchant expandable
    const merchantExpandBtn = document.getElementById('merchant-expand-btn');
    const merchantExpanded = document.getElementById('merchant-expanded');

    if (merchantExpandBtn && merchantExpanded) {
      merchantExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = merchantExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          merchantExpanded.classList.remove('collapsed');
          merchantExpandBtn.textContent = '-';
          extensionSettings.merchantExpanded = true;
        } else {
          merchantExpanded.classList.add('collapsed');
          merchantExpandBtn.textContent = '+';
          extensionSettings.merchantExpanded = false;
        }

        saveSettings();
      });

      if (extensionSettings.merchantExpanded) {
        merchantExpanded.classList.remove('collapsed');
        merchantExpandBtn.textContent = '-';
      }
    }

    // Inventory expandable
    const inventoryExpandBtn = document.getElementById('inventory-expand-btn');
    const inventoryExpanded = document.getElementById('inventory-expanded');

    if (inventoryExpandBtn && inventoryExpanded) {
      inventoryExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = inventoryExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          inventoryExpanded.classList.remove('collapsed');
          inventoryExpandBtn.textContent = '-';
          extensionSettings.inventoryExpanded = true;
        } else {
          inventoryExpanded.classList.add('collapsed');
          inventoryExpandBtn.textContent = '+';
          extensionSettings.inventoryExpanded = false;
        }

        saveSettings();
      });

      // Refresh inventory button
      const refreshBtn = document.getElementById('refresh-inventory-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          showNotification('Refreshing inventory quantities...', 'info');
        });
      }

      if (extensionSettings.inventoryExpanded) {
        inventoryExpanded.classList.remove('collapsed');
        inventoryExpandBtn.textContent = '-';
      }
    }

    // Automation expandable
    const automationExpandBtn = document.getElementById('automation-expand-btn');
    const automationExpanded = document.getElementById('automation-expanded');

    if (automationExpandBtn && automationExpanded) {
      automationExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = automationExpanded.classList.contains('collapsed');

        if (isCollapsed) {
          automationExpanded.classList.remove('collapsed');
          automationExpandBtn.textContent = '-';
          extensionSettings.automationExpanded = true;
        } else {
          automationExpanded.classList.add('collapsed');
          automationExpandBtn.textContent = '+';
          extensionSettings.automationExpanded = false;
        }

        saveSettings();
      });

      if (extensionSettings.automationExpanded) {
        automationExpanded.classList.remove('collapsed');
        automationExpandBtn.textContent = '-';
      }
    }

    initFarmingAutomationButton();
    initPvPAutomationButton();
  }

  function initPvPAutomationButton() {
    const pvpBtn = document.getElementById('btn-automation-pvp');
    if (pvpBtn) {
      updatePvPButtonState();
      pvpBtn.addEventListener('click', togglePvPAutomationAll);
    }
  }

  function initSettingsModal() {
    document.getElementById('settings-link').addEventListener('click', (e) => {
      e.preventDefault();
      showSettingsModal();
    });

    document.getElementById('about-link').addEventListener('click', (e) => {
      e.preventDefault();
      showAboutModal();
    });
  }

  function showSettingsModal() {
    let modal = document.getElementById('settings-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'settings-modal';
      modal.className = 'settings-modal';

      modal.innerHTML = `
        <div class="settings-content">
          <h2 style="color: #e6e6e6ff; margin-bottom: 25px; text-align: center;">Settings</h2>

          <div class="settings-section">
            <div class="header">
              <h3>🎨 Game Background</h3>
              <span class="indicator"><img src="https://www.svgrepo.com/show/533664/chevron-up.svg" alt="indicator" /></span>
            </div>
            <div class="collapsible">
              <label style="margin: 0;">
                <input type="checkbox" id="game-setting-bg-image" style="transform: scale(1.2);">
                <span>Enable Game Background Image</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <div class="header">
              <h3>📌 Pinned Items</h3>
              <span class="indicator"><img src="https://www.svgrepo.com/show/533664/chevron-up.svg" alt="indicator" /></span>
            </div>
            <div class="collapsible">
              <div style="display: flex; align-items: center; gap: 10px; color: #cdd6f4;">
                <label for="pinned-items-limit">Maximum pinned items:</label>
                <input type="number" id="pinned-items-limit" min="1" max="10" value="3" style="width: 60px">
              </div>
            </div>
          </div>

          <div class="settings-section">
            <div class="header">
              <h3>⚔️ PvP Setting</h3>
              <span class="indicator"><img src="https://www.svgrepo.com/show/533664/chevron-up.svg" alt="indicator" /></span>
            </div>
            <div class="collapsible">
              <label>
                <input type="checkbox" id="autosurrender-function-enable" style="transform: scale(1.2);">
                <span>Enable Auto Surrender in PvP (when losing)</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <div class="header">
              <h3>🌽 Farm Setting</h3>
              <span class="indicator"><img src="https://www.svgrepo.com/show/533664/chevron-up.svg" alt="indicator" /></span>
            </div>
            <div class="collapsible">
              <div style="display:flex; flex-flow: column; gap: 8px; margin-bottom: 1rem;">
                <label for="autofarm-value-mode">Energy Farming Mode:</label>
                <select id="autofarm-value-mode">
                  <option value="energy-cap">Energy Cap</option>
                  <option value="energy-target">Energy Target</option>
                </select>
              </div>
              <div style="display:flex; flex-flow: column; gap: 8px; margin-bottom: 1rem;">
                <label for="autofarm-value-energy-cap">Energy Cap:</label>
                <input type="number" id="autofarm-value-energy-cap" min="0">
              </div>
              <div style="display:flex; flex-flow: column; gap: 8px; margin-bottom: 1rem;">
                <label for="autofarm-value-energy-target">Energy Target:</label>
                <input type="number" id="autofarm-value-energy-target" min="0">
              </div>
              <label>
                <input type="checkbox" id="autologin-function-enable" style="transform: scale(1.2);">
                <span>Enable Autologin when Autofarm Energy</span>
              </label>
            </div>
          </div>

          <div class="settings-section">
            <div class="header">
              <h3>🔐 Autologin Value</h3>
              <span class="indicator"><img src="https://www.svgrepo.com/show/533664/chevron-up.svg" alt="indicator" /></span>
            </div>
            <div class="collapsible">
              <div style="display:flex; flex-flow: column; gap: 8px; margin-bottom: 1rem;">
                <label for="autologin-value-email">Email:</label>
                <input type="email" id="autologin-value-email">
              </div>
              <div style="display:flex; flex-flow: column; gap: 8px; margin-bottom: 1rem;">
                <label for="autologin-value-password">Password:</label>
                <input type="password" id="autologin-value-password">
              </div>
              <span class="note">*Email and Password will be saved in your session with encryption, so please be careful when use this feature</span>
            </div>
          </div>

          <div style="text-align: center; margin-top: auto;">
            <button class="settings-button" data-action="close">Close</button>
            <button class="settings-button" data-action="reset">Reset to Default</button>
            <button class="settings-button" data-action="clear" style="background: #f38ba8; color: #030303;">Clear All Data</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      setupPinnedItemsLimitSettings();
      setupAutofarmSettings();
      setupSettingsModalListeners();
    }

    modal.style.display = 'flex';

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeSettingsModal();
      }
    });
  }


  function initGameBackground() {
    if (!extensionSettings.gameBackgroundEnabled) return;

    const body = document.querySelector('body')
    const mainWrapper = document.querySelector('.main-wrapper')
    const sidebar = document.querySelector('#game-sidebar')

    const newBg = document.createElement('div')
    newBg.id = 'veyra-background'
    newBg.style = `width: 102vw;height: 102vh;position: fixed;top: 0px;left: -16px;background: url('https://demonicscans.org/images/veyra.webp');background-size: cover;background-repeat: no-repeat;z-index: -20;filter: blur(10px);`
    body.appendChild(newBg)

    body.classList.add('veyra-background')
    mainWrapper.classList.add('veyra-background')
    sidebar.classList.add('veyra-background')
  }

  function setupAutofarmSettings() {
    const modeSelect = document.getElementById('autofarm-value-mode');
    const energyCapInput = document.getElementById('autofarm-value-energy-cap');
    const energyTargetInput = document.getElementById('autofarm-value-energy-target');
    const autoSurrenderCheckbox = document.getElementById('autosurrender-function-enable');

    if (modeSelect) {
      modeSelect.value = extensionSettings.farmingMode;
      modeSelect.addEventListener('change', (e) => {
        extensionSettings.farmingMode = e.target.value;
        localStorage.setItem('farming-mode', e.target.value);
        saveSettings();
        // Update HUD if it exists
        if (document.getElementById('farming-hud')) {
          updateFarmingHUD();
        }
      });
    }

    if (energyCapInput) {
      energyCapInput.value = extensionSettings.energyCap;
      energyCapInput.addEventListener('change', (e) => {
        const value = Math.max(0, parseInt(e.target.value) || 30);
        extensionSettings.energyCap = value;
        localStorage.setItem('minus-energy-cap', value.toString());
        saveSettings();
        // Update HUD if it exists
        if (document.getElementById('farming-hud')) {
          updateFarmingHUD();
        }
      });
    }

    if (energyTargetInput) {
      energyTargetInput.value = extensionSettings.energyTarget;
      energyTargetInput.addEventListener('change', (e) => {
        const value = Math.max(0, parseInt(e.target.value) || 150);
        extensionSettings.energyTarget = value;
        localStorage.setItem('target-farming-energy', value.toString());
        saveSettings();
        // Update HUD if it exists
        if (document.getElementById('farming-hud')) {
          updateFarmingHUD();
        }
      });
    }

    if (autoSurrenderCheckbox) {
      autoSurrenderCheckbox.checked = extensionSettings.autoSurrenderEnabled;
      autoSurrenderCheckbox.addEventListener('change', (e) => {
        extensionSettings.autoSurrenderEnabled = e.target.checked;
        saveSettings();
      });
    }

    setupAutologinSettings();
  }

  function setupPinnedItemsLimitSettings() {
    const limitInput = document.getElementById('pinned-items-limit');

    if (limitInput) {
      limitInput.value = extensionSettings.pinnedItemsLimit;
      limitInput.addEventListener('change', (e) => {
        const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 3));
        extensionSettings.pinnedItemsLimit = value;
        e.target.value = value;
        saveSettings();
      });
    }
  }

  function setupAutologinSettings() {
    const enabledCheckbox = document.getElementById('autologin-function-enable');
    const emailInput = document.getElementById('autologin-value-email');
    const passwordInput = document.getElementById('autologin-value-password');

    // Load saved values using encryption
    const savedEnabled = sessionStorage.getItem('autologin-enabled') === 'true';
    const savedEmail = window.secureCredentials ? window.secureCredentials.getEmail() : '';
    const savedPassword = window.secureCredentials ? window.secureCredentials.getPassword() : '';

    if (enabledCheckbox) {
      enabledCheckbox.checked = savedEnabled;
      enabledCheckbox.addEventListener('change', (e) => {
        sessionStorage.setItem('autologin-enabled', e.target.checked.toString());
      });
    }

    if (emailInput) {
      emailInput.value = savedEmail;
      emailInput.addEventListener('change', (e) => {
        if (window.secureCredentials) {
          window.secureCredentials.saveEmail(e.target.value);
        }
      });
    }

    if (passwordInput) {
      passwordInput.value = savedPassword;
      passwordInput.addEventListener('change', (e) => {
        if (window.secureCredentials) {
          window.secureCredentials.savePassword(e.target.value);
        }
      });
    }
  }

  function setupSettingsModalListeners() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    document.querySelectorAll('.settings-section .header').forEach( group => {
      group.addEventListener('click', () => { 
        if(group.classList.contains('open')) group.classList.remove('open')
        else group.classList.add('open') 
      })
    })

    const gameBackgroundCheckbox = document.getElementById('game-setting-bg-image');
    if (gameBackgroundCheckbox) {
      gameBackgroundCheckbox.checked = extensionSettings.gameBackgroundEnabled;
      gameBackgroundCheckbox.addEventListener('change', (e) => {
        extensionSettings.gameBackgroundEnabled = e.target.checked;
        saveSettings();

        // Remove existing background
        const existingBg = document.getElementById('veyra-background');
        if (existingBg) existingBg.remove();

        // Apply or remove background classes
        const body = document.querySelector('body');
        const mainWrapper = document.querySelector('.main-wrapper');
        const sidebar = document.querySelector('#game-sidebar');

        if (e.target.checked) {
          initGameBackground();
        } else {
          body?.classList.remove('veyra-background');
          mainWrapper?.classList.remove('veyra-background');
          sidebar?.classList.remove('veyra-background');
        }
      });
    }

    // Close button
    modal.querySelector('.settings-button[data-action="close"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSettingsModal();
    });

    // Reset button
    modal.querySelector('.settings-button[data-action="reset"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetSettings();
    });

    // Clear All Data button
    modal.querySelector('.settings-button[data-action="clear"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearAllData();
    });
  }


  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function resetSettings() {
    extensionSettings = {
      statAllocationCollapsed: true,
      statsExpanded: false,
      petsExpanded: false,
      blacksmithExpanded: false,
      continueBattlesExpanded: true,
      lootExpanded: true,
      merchantExpanded: false,
      inventoryExpanded: false,
      pinnedMerchantItems: [],
      pinnedInventoryItems: [],
      multiplePotsEnabled: false,
      multiplePotsCount: 3,
      pinnedItemsLimit: 3,
      automationExpanded: false,
      sidebarVisible: true,
      farmingMode: 'energy-cap',
      energyCap: 30,
      energyTarget: 150,
      autoSurrenderEnabled: false,
      gameBackgroundEnabled: true,
    };
    saveSettings();
    applySettings();
    showNotification('Settings reset to default!', 'success');
  }

  function clearAllData() {
    if (confirm('Are you sure you want to clear ALL extension data? This will remove all settings, pinned items, and preferences. This action cannot be undone.')) {
      // Clear all extension-related localStorage data
      localStorage.removeItem('demonGameExtensionSettings');
      localStorage.removeItem('demonGameFilterSettings');
      localStorage.removeItem('inventoryView');
      localStorage.removeItem('playerState');
      localStorage.removeItem('farming-mode');
      localStorage.removeItem('minus-energy-cap');
      localStorage.removeItem('pvp-auto-surrend');
      localStorage.removeItem('pvp-automation-x-count');
      localStorage.removeItem('pvp-automation-x-remaining');
      localStorage.removeItem('target-farming-energy');
      localStorage.removeItem('veyra-farming-automation');
      localStorage.removeItem('veyra-pvp-automation');
      sessionStorage.removeItem('autologin-email');
      sessionStorage.removeItem('autologin-password');
      sessionStorage.removeItem('veyra_encryption_key');

      // Reset extension settings to default
      resetSettings();

      // Close settings modal
      closeSettingsModal();

      showNotification('Reloading Page...', 'success');

      // Reload page to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  function showAboutModal() {
    let modal = document.getElementById('about-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'about-modal';
      modal.className = 'settings-modal';
      modal.innerHTML = `
        <div class="settings-content">
          <h3 style="color: #cba6f7; margin-bottom: 25px; text-align: center;">About Veyra UI Overhaul</h3>

          <div class="settings-section">
            <h4>🚀 Features</h4>
            <p>Comprehensive game enhancement suite with advanced sidebar interface, automation systems, and enhanced gameplay features.</p>
            <p>Version 0.40</p>
          </div>

          <div class="settings-section">
            <h4>🙏 Credits</h4>
            <div style="margin: 15px 0; line-height: 1.6;">
              <h4 style="color: #f9e2af; margin-top: 20px;">Development Team</h4>
              <p><strong>Smol:</strong> Automation Integration and Script update</p>
              
              <h4 style="color: #f9e2af;">Original Sources</h4>
              <p><strong>Mrdhnto:</strong> Mobile-Responsive UI, encryption implementation</p>
              <p><strong>UI Foundation:</strong> asura-cr/ui-addon - Original Chrome extension UI</p>
              <p><strong>Sidebar UI Origin:</strong> Keazte's for creating first sidebar extension</p>
              <p><strong>Automation Inspiration:</strong> ASHU's</p>

              <h4 style="color: #f9e2af; margin-top: 20px;">Special Thanks</h4>
              <p>All Veyra Discord Member who give feedback and courage</p>
            </div>
          </div>

          <div class="settings-section" style="text-align: center; background: rgba(203, 166, 247, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin-bottom: 10px;">Any question, request, feedback, bug, or fast update, join our discord</p>
            <a href="https://discord.gg/epJCUWj6" target="_blank" style="color: #cba6f7; text-decoration: underline;">Discord Link</a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <button class="settings-button" onclick="document.getElementById('about-modal').style.display='none'">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  function sidebarAlloc(stat, amount) {
    const pointsElement = document.getElementById('sidebar-points');
    const currentPoints = parseInt(pointsElement?.textContent || '0');

    if (currentPoints < amount) {
      showNotification(`Not enough points! You need ${amount} points but only have ${currentPoints}.`, 'error');
      return;
    }

    // Map our stat names to what the server expects
    const statMapping = {
      'attack': 'attack',
      'defense': 'defense',
      'stamina': 'stamina'
    };

    const serverStat = statMapping[stat] || stat;
    const body = `action=allocate&stat=${encodeURIComponent(serverStat)}&amount=${encodeURIComponent(amount)}`;

    // Disable all upgrade buttons temporarily
    document.querySelectorAll('.upgrade-btn').forEach(btn => btn.disabled = true);

    fetch('stats_ajax.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body
    })
    .then(async r => {
      const txt = await r.text();
      try {
        const json = JSON.parse(txt);
        if (json.error) {
          throw new Error(json.error);
        }
        return { okHTTP: r.ok, json, raw: txt };
      } catch (parseError) {
        // If not JSON or has error, try to parse as plain text
        if (r.ok && txt.includes('STAT_POINTS')) {
          const stats = {};
          const lines = txt.split('\n');
          lines.forEach(line => {
            if (line.includes('STAT_POINTS')) stats.STAT_POINTS = line.split('=')[1]?.trim();
            if (line.includes('ATTACK')) stats.ATTACK = line.split('=')[1]?.trim();
            if (line.includes('DEFENSE')) stats.DEFENSE = line.split('=')[1]?.trim();
            if (line.includes('STAMINA')) stats.STAMINA = line.split('=')[1]?.trim();
          });
          return { okHTTP: r.ok, json: { ok: true, user: stats }, raw: txt };
        }
        throw new Error(`Bad response (${r.status}): ${txt}`);
      }
    })
    .then(pack => {
      if (!pack.okHTTP) {
        showNotification(`HTTP Error: ${pack.raw}`, 'error');
        return;
      }

      const res = pack.json;
      if (!res.ok) {
        showNotification(res.msg || res.error || 'Allocation failed', 'error');
        return;
      }

      const u = res.user;
      updateSidebarStats(u);

      // Also update main stats page if we're on it
      if (window.location.pathname.includes('stats')) {
        const mainPoints = document.getElementById('v-points');
        const mainAttack = document.getElementById('v-attack');
        const mainDefense = document.getElementById('v-defense');
        const mainStamina = document.getElementById('v-stamina');

        if (mainPoints) mainPoints.textContent = u.STAT_POINTS || u.stat_points || 0;
        if (mainAttack) mainAttack.textContent = u.ATTACK || u.attack || 0;
        if (mainDefense) mainDefense.textContent = u.DEFENSE || u.defense || 0;
        if (mainStamina) mainStamina.textContent = u.STAMINA || u.MAX_STAMINA || u.stamina || 0;
      }

      localStorage.removeItem('playerState')
      showNotification(`Successfully upgraded ${stat} by ${amount}!`, 'success');
    })
    .catch(err => {
      console.error(err);
      showNotification(err.message || 'Network error occurred', 'error');
    })
    .finally(() => {
      // Re-enable upgrade buttons
      document.querySelectorAll('.upgrade-btn').forEach(btn => btn.disabled = false);
      // Refresh stats after allocation
      setTimeout(fetchAndUpdateSidebarStats, 500);
    });
  }

  // Make debug function globally available for troubleshooting
  window.debugExtension = function() {
    console.log('Extension Debug Info:');
    console.log('User ID:', userId);
    console.log('Current Path:', window.location.pathname);
    console.log('Extension Settings:', extensionSettings);
    console.log('Mobile View:', isMobileView);
  };

})();