// ==UserScript==
// @name         DegenIdle Multi-Character Monitor v2
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Monitor all characters with API calls + Restart Tasks & Combat
// @author       Seisen
// @match        https://degenidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558960/DegenIdle%20Multi-Character%20Monitor%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/558960/DegenIdle%20Multi-Character%20Monitor%20v2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ============================================
  // DEBUG MODE - Set to true for verbose logging
  // ============================================
  const DEBUG_MODE = true;

  function debugLog(...args) {
    if (DEBUG_MODE) {
      console.log('[DEBUG]', ...args);
    }
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 Multi-Character Monitor v2.3');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔧 DEBUG_MODE:', DEBUG_MODE ? 'ENABLED' : 'DISABLED');

  const API_ROOT = "https://api-v1.degenidle.com/api/";

  // ============================================
  // TOKEN MANAGER
  // ============================================
  const TokenManager = {
    authToken: null,
    lastUpdate: null,
    onTokenCaptured: null, // Callback to call when token is first captured

    update(token) {
      debugLog('[TokenManager] update() called with token:', token ? 'YES (length: ' + token.length + ')' : 'NO/NULL');

      if (token && token !== this.authToken) {
        const isFirstCapture = !this.authToken;
        this.authToken = token;
        this.lastUpdate = Date.now();
        console.log('[TokenManager] 🔑 Token captured!');
        console.log('[TokenManager] 📏 Token length:', token.length);
        console.log('[TokenManager] 🔍 Token starts with:', token.substring(0, 20) + '...');

        // Trigger callback on first capture
        if (isFirstCapture && this.onTokenCaptured) {
          console.log('[TokenManager] 🎯 First token capture - triggering auto-load');
          this.onTokenCaptured();
        }
      } else if (token && token === this.authToken) {
        debugLog('[TokenManager] Token unchanged (same as before)');
      } else if (!token) {
        debugLog('[TokenManager] ⚠️ update() called with null/undefined token');
      }
    },

    isReady() {
      return !!this.authToken;
    },

    getStatus() {
      return {
        hasToken: !!this.authToken,
        tokenAge: this.lastUpdate ? Math.floor((Date.now() - this.lastUpdate) / 1000) : null
      };
    }
  };

  // ============================================
  // CHARACTER DATA STORAGE
  // ============================================
  window.allCharactersData = {
    characters: {},
    charactersList: [],
    charactersMap: {},         // Map of character_id -> full character info (name, class, pfp, etc.)
    portraitsOrder: [],        // Array of character names in navbar order
    portraitImages: {},        // Map of character name -> portrait URL
    lastUpdate: null
  };

  // ============================================
  // FETCH INTERCEPTOR - Capture Authorization Token
  // ============================================
  debugLog('🔧 Installing fetch interceptor...');

  const originalFetch = window.fetch;
  if (!originalFetch) {
    console.error('[CRITICAL] ❌ window.fetch is not available! This browser may not support fetch.');
  }

  window.fetch = async function(...args) {
    const [url, options] = args;

    // 🔑 Capture Authorization header from OUTGOING requests
    const urlStr = typeof url === 'string' ? url : url?.url || '';

    debugLog('📡 Fetch intercepted:', urlStr.substring(0, 80) + (urlStr.length > 80 ? '...' : ''));

    if (urlStr.includes('api-v1.degenidle.com')) {
      debugLog('   ✅ This is a DegenIdle API call');
      debugLog('   📦 Options present:', !!options);
      debugLog('   📋 Headers present:', !!options?.headers);

      if (options?.headers) {
        let authHeader = null;
        const headersType = options.headers instanceof Headers ? 'Headers' :
                           Array.isArray(options.headers) ? 'Array' :
                           typeof options.headers === 'object' ? 'Object' : 'Unknown';

        debugLog('   📋 Headers type:', headersType);

        // Handle different header formats
        if (options.headers instanceof Headers) {
          authHeader = options.headers.get('Authorization');
          debugLog('   🔍 Headers.get("Authorization"):', authHeader ? 'FOUND' : 'NOT FOUND');
        } else if (Array.isArray(options.headers)) {
          const entry = options.headers.find(h => h[0].toLowerCase() === 'authorization');
          if (entry) authHeader = entry[1];
          debugLog('   🔍 Array search for authorization:', authHeader ? 'FOUND' : 'NOT FOUND');
        } else if (typeof options.headers === 'object') {
          authHeader = options.headers['Authorization'] || options.headers['authorization'] || options.headers['AUTHORIZATION'];
          debugLog('   🔍 Object keys:', Object.keys(options.headers).join(', '));
          debugLog('   🔍 Authorization in object:', authHeader ? 'FOUND' : 'NOT FOUND');
        }

        if (authHeader) {
          debugLog('   🔑 Auth header captured! Length:', authHeader.length);
          debugLog('   🔑 Auth header preview:', authHeader.substring(0, 30) + '...');
          TokenManager.update(authHeader);
        } else {
          debugLog('   ⚠️ No Authorization header found in this request');
        }
      } else {
        debugLog('   ⚠️ No headers in this request');
      }
    }

    return originalFetch.apply(this, args);
  };

  debugLog('✅ Fetch interceptor installed');

  // ============================================
  // XHR INTERCEPTOR - Capture Authorization Token from XMLHttpRequest
  // ============================================
  debugLog('🔧 Installing XHR interceptor...');

  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._degenIdleUrl = url;
    this._degenIdleHeaders = {};
    debugLog('📡 XHR.open intercepted:', method, url?.substring(0, 60) + (url?.length > 60 ? '...' : ''));
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (this._degenIdleHeaders) {
      this._degenIdleHeaders[name.toLowerCase()] = value;
    }

    debugLog('📋 XHR.setRequestHeader:', name, '=', name.toLowerCase() === 'authorization' ? '[REDACTED]' : value?.substring(0, 30));

    // Capture Authorization header for api-v1.degenidle.com
    if (name.toLowerCase() === 'authorization' && this._degenIdleUrl?.includes('api-v1.degenidle.com')) {
      debugLog('   🔑 XHR Auth header captured for DegenIdle API!');
      TokenManager.update(value);
    }

    return originalXHRSetRequestHeader.apply(this, arguments);
  };

  debugLog('✅ XHR interceptor installed');

  console.log('[TokenManager] ✅ Token interceptor installed (fetch + XHR)');
  console.log('[TokenManager] 🎯 Waiting for game to make API calls...');
  console.log('[TokenManager] 💡 If no token appears after navigating, check DEBUG logs above');

  // ============================================
  // API HELPER FUNCTION
  // ============================================
  async function apiCall(endpoint) {
    if (!TokenManager.isReady()) {
      throw new Error('Token not available yet');
    }

    const url = `${API_ROOT}${endpoint}`;
    const response = await originalFetch(url, {
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // ============================================
  // WAIT FOR PORTRAITS IN DOM
  // ============================================
  async function waitForPortraits(maxWaitMs = 10000) {
    return new Promise((resolve) => {
      const checkPortraits = () => {
        const allPortraits = document.querySelectorAll('button img[alt]');
        const portraits = Array.from(allPortraits).filter(img => {
          const parentClasses = img.parentElement?.className || '';
          return parentClasses.includes('relative') &&
                 parentClasses.includes('w-9') &&
                 parentClasses.includes('h-9') &&
                 parentClasses.includes('rounded-lg') &&
                 !parentClasses.includes('md:hidden');
        });

        if (portraits.length > 0) {
          console.log(`📸 Found ${portraits.length} portraits in DOM`);
          return portraits;
        }
        return null;
      };

      // Try immediately
      const immediate = checkPortraits();
      if (immediate) {
        resolve(immediate);
        return;
      }

      // Otherwise, poll every 200ms
      const startTime = Date.now();
      const interval = setInterval(() => {
        const found = checkPortraits();
        if (found) {
          clearInterval(interval);
          resolve(found);
        } else if (Date.now() - startTime > maxWaitMs) {
          console.warn('⚠️ Timeout waiting for portraits in DOM');
          clearInterval(interval);
          resolve([]);
        }
      }, 200);
    });
  }

  // ============================================
  // SCAN PORTRAITS FROM DOM
  // ============================================
  function scanPortraits(portraits) {
    const portraitsData = portraits.map(img => ({
      name: img.alt,
      imageUrl: img.src
    }));

    window.allCharactersData.portraitsOrder = portraitsData.map(p => p.name);
    window.allCharactersData.portraitImages = Object.fromEntries(
      portraitsData.map(p => [p.name, p.imageUrl])
    );

    console.log(`✅ Scanned portraits:`, portraitsData.map(p => p.name));
  }

  // ============================================
  // LOAD CHARACTER NAMES AND INFO
  // ============================================
  window.loadCharacterNames = async function(waitForDom = true) {
    try {
      if (!TokenManager.isReady()) {
        console.log('⏳ Token not ready yet, cannot load character names');
        return false;
      }

      // Step 1: Wait for portraits in DOM (if requested)
      if (waitForDom) {
        console.log('⏳ Waiting for portraits in DOM...');
        const portraits = await waitForPortraits();
        if (portraits.length > 0) {
          scanPortraits(portraits);
        }
      }

      // Step 2: Load character data from API
      console.log('📋 Loading character names from API...');
      const allCharsData = await apiCall('characters/all');

      if (!allCharsData.success || !allCharsData.characters) {
        console.error('❌ Failed to get character list');
        return false;
      }

      const charactersList = allCharsData.characters;
      window.allCharactersData.charactersList = charactersList;

      // Create a map of character_id -> character info for easy lookup
      window.allCharactersData.charactersMap = Object.fromEntries(
        charactersList.map(char => [char.id, char])
      );

      console.log(`✅ Loaded ${charactersList.length} character names`);

      // Step 3: Update toggle icon with proper pfp
      updateToggleIcon();

      return true;
    } catch (error) {
      console.error('❌ Error loading character names:', error);
      return false;
    }
  };

  // ============================================
  // REFRESH ALL CHARACTERS - NEW VERSION
  // ============================================
  window.refreshAllCharacters = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 Refreshing all characters via API...');
    console.log('═══════════════════════════════════════════════════════');

    // Update UI refresh button state
    const refreshBtn = document.getElementById('mc-refresh-btn');
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.style.opacity = '0.5';
    }

    try {
      // Check token
      if (!TokenManager.isReady()) {
        console.error('❌ Token not captured yet!');
        console.log('💡 Navigate in the game (visit a skill page) to capture the token');
        return;
      }

      console.log('✅ Token ready');

      // Step 1: Get list of all characters with their names
      console.log('\n📋 Step 1: Fetching character list...');
      const allCharsData = await apiCall('characters/all');

      if (!allCharsData.success || !allCharsData.characters) {
        console.error('❌ Failed to get character list');
        return;
      }

      const charactersList = allCharsData.characters;
      window.allCharactersData.charactersList = charactersList;

      // Create a map of character_id -> character info for easy lookup
      window.allCharactersData.charactersMap = Object.fromEntries(
        charactersList.map(char => [char.id, char])
      );

      console.log(`✅ Found ${charactersList.length} characters:`);
      charactersList.forEach((char, i) => {
        console.log(`   ${i + 1}. ${char.name} (${char.class}) - ${char.id.substring(0, 8)}...`);
      });

      // Step 2: Scan DOM to get portrait order (optional, for sorting)
      console.log('\n📸 Step 2: Scanning navbar for portrait order...');
      const portraits = await waitForPortraits();
      if (portraits.length > 0) {
        scanPortraits(portraits);
        // Update toggle button icon with first character's portrait
        updateToggleIcon();
      } else {
        console.warn('⚠️ No portraits found in DOM');
      }

      // Step 3: Fetch data for each character
      console.log('\n📊 Step 3: Fetching character data...');

      for (let i = 0; i < charactersList.length; i++) {
        const char = charactersList[i];
        const charId = char.id;

        // Get character name from the map we created
        const characterName = window.allCharactersData.charactersMap[charId]?.name || charId.substring(0, 8) + '...';

        console.log(`\n[${i + 1}/${charactersList.length}] Fetching data for ${characterName} (${charId.substring(0, 8)}...)...`);

        try {
          const data = await apiCall(`batch/periodic-status/${charId}`);

          if (!data.success) {
            console.error(`   ❌ API returned success=false`);
            continue;
          }

          // Extract combat info
          const combat = data.data.activeCombat;
          let combatInfo = null;

          if (combat) {
            // Extract energy from combat_log
            let energy = null;
            if (combat.combat_log?.participants?.[charId]) {
              const participant = combat.combat_log.participants[charId];
              energy = {
                current: participant.current_energy,
                max: participant.max_energy,
                percent: Math.round((participant.current_energy / participant.max_energy) * 100)
              };
            }

            combatInfo = {
              in_combat: combat.in_combat,
              current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
              max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
              hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
              actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
              monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
              location_id: combat.in_combat ? combat.location_id : null,
              current_monster: combat.in_combat ? combat.current_monster : null,
              energy: energy,
              participant_duration: combat.participant_duration || 0
            };
          }

          // Extract tasks info
          const tasks = data.data.activeTasks || [];
          const tasksInfo = tasks.map(t => ({
            id: t.id,
            skill: t.skill_name,
            item: t.item_name,
            progress: `${t.actions_completed}/${t.total_actions}`,
            actions_completed: t.actions_completed,
            total_actions: t.total_actions,
            percent: Math.round((t.actions_completed / t.total_actions) * 100),
            exp_earned: t.exp_earned
          }));

          // Store character data
          window.allCharactersData.characters[charId] = {
            character_id: charId,
            character_name: characterName,
            lastUpdate: new Date().toISOString(),
            combat: combatInfo,
            tasks: tasksInfo
          };

          // Update UI after each character (real-time feedback)
          updatePanel();

          // Log summary
          console.log(`   ✅ ${characterName}`);
          if (combatInfo?.in_combat) {
            console.log(`      ❤️  HP: ${combatInfo.current_hp}/${combatInfo.max_hp} (${combatInfo.hp_percent}%)`);
            if (combatInfo.energy) {
              console.log(`      ⚡ Energy: ${combatInfo.energy.current}/${combatInfo.energy.max} (${combatInfo.energy.percent}%)`);
            }
            console.log(`      ⚔️  Actions: ${combatInfo.actions_performed.toLocaleString()} | Kills: ${combatInfo.monsters_killed}`);
          } else {
            console.log(`      💤 Not in combat`);
          }

          if (tasksInfo.length > 0) {
            const task = tasksInfo[0];
            console.log(`      🛠️  Task: ${task.skill} - ${task.item} (${task.percent}%)`);
          } else {
            console.log(`      ⭕ No active task`);
          }

          // Random delay between API calls to appear more natural (300-800ms)
          if (i < charactersList.length - 1) {
            const delay = Math.random() * 500 + 300; // Random between 300-800ms
            await new Promise(resolve => setTimeout(resolve, delay));
          }

        } catch (error) {
          console.error(`   ❌ Error fetching data:`, error.message);
        }
      }

      window.allCharactersData.lastUpdate = new Date().toISOString();

      console.log('\n═══════════════════════════════════════════════════════');
      console.log('✨ Refresh complete!');
      console.log('═══════════════════════════════════════════════════════');

      // Update UI
      updatePanel();

    } catch (error) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('❌ Error during refresh:');
      console.error(error);
      console.error('═══════════════════════════════════════════════════════');
    } finally {
      // Restore refresh button
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.style.opacity = '1';
      }
    }
  };

  // ============================================
  // RESTART TASK FOR A CHARACTER
  // ============================================
  window.restartTask = async function(taskId, characterId, characterName) {
    console.log(`🔄 Restarting task for ${characterName}...`);

    if (!TokenManager.isReady()) {
      console.error('❌ Token not ready');
      return false;
    }

    try {
      const response = await originalFetch(`${API_ROOT}tasks/${taskId}/restart`, {
        method: 'POST',
        headers: {
          'Authorization': TokenManager.authToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'https://degenidle.com',
          'Referer': 'https://degenidle.com/'
        },
        body: JSON.stringify({
          characterId: characterId
        })
      });

      if (!response.ok) {
        throw new Error(`Restart failed: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Task restarted for ${characterName}`);

      // Auto-refresh character data after 500ms
      setTimeout(async () => {
        console.log(`🔄 Refreshing ${characterName} data...`);
        const data = await apiCall(`batch/periodic-status/${characterId}`);

        if (data.success) {
          const tasks = data.data.activeTasks || [];
          const tasksInfo = tasks.map(t => ({
            id: t.id,
            skill: t.skill_name,
            item: t.item_name,
            progress: `${t.actions_completed}/${t.total_actions}`,
            actions_completed: t.actions_completed,
            total_actions: t.total_actions,
            percent: Math.round((t.actions_completed / t.total_actions) * 100),
            exp_earned: t.exp_earned
          }));

          window.allCharactersData.characters[characterId].tasks = tasksInfo;
          window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();

          updatePanel();
          showNotification(`✅ Task restarted for ${characterName}`, 'success', 2000);
          console.log(`✅ ${characterName} data refreshed`);
        }
      }, 500);

      return result;

    } catch (error) {
      const errorMsg = `Error restarting task for ${characterName}: ${error.message}`;
      showNotification(`❌ ${errorMsg}`, 'error');
      console.error(`❌ ${errorMsg}`);
      return false;
    }
  };

  // ============================================
  // RESTART ALL TASKS
  // ============================================
  window.restartAllTasks = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 Restarting all active tasks...');
    console.log('═══════════════════════════════════════════════════════');

    const characters = Object.values(window.allCharactersData.characters)
      .filter(char => char.tasks && char.tasks.length > 0 && char.tasks[0].id);

    if (characters.length === 0) {
      const msg = 'No active tasks to restart';
      showNotification(`⚠️ ${msg}`, 'info');
      console.log(`⚠️ ${msg}`);
      return;
    }

    showNotification(`🔄 Restarting ${characters.length} task(s)...`, 'info');
    let count = 0;

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      const task = char.tasks[0];

      showNotification(`🔄 Restarting task for ${char.character_name}...`, 'info', 2000);
      await restartTask(task.id, char.character_id, char.character_name);
      count++;

      // Random delay between restarts to appear more natural (800-1300ms)
      if (i < characters.length - 1) {
        const delay = Math.random() * 500 + 800;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const finalMsg = `All tasks restarted (${count}/${characters.length})`;
    showNotification(`✅ ${finalMsg}`, 'success', 5000);
    console.log(`✅ ${finalMsg}`);
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // LEAVE COMBAT
  // ============================================
  async function leaveCombat(characterId) {
    const response = await originalFetch(`${API_ROOT}idle-combat/leave`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({
        characterId: characterId
      })
    });

    if (!response.ok) {
      throw new Error(`Leave combat failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // JOIN COMBAT
  // ============================================
  async function joinCombat(characterId, combatId) {
    const response = await originalFetch(`${API_ROOT}idle-combat/join`, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify({
        characterId: characterId,
        combatId: combatId
      })
    });

    if (!response.ok) {
      throw new Error(`Join combat failed: ${response.status}`);
    }

    return await response.json();
  }

  // ============================================
  // RESTART COMBAT FOR A CHARACTER
  // ============================================
  window.restartCombat = async function(characterId, locationId, characterName, skipAutoRefresh = false) {
    showNotification(`🔄 Restarting combat for ${characterName}...`, 'info');
    console.log(`🔄 Restarting combat for ${characterName}...`);

    if (!TokenManager.isReady()) {
      const errorMsg = 'Token not ready';
      showNotification(`❌ ${errorMsg}`, 'error');
      console.error('❌', errorMsg);
      return false;
    }

    try {
      // Step 1: Leave combat
      console.log(`  1/3: Leaving combat...`);
      await leaveCombat(characterId);

      // Step 2: Wait random delay (1200-2100ms)
      const delay = Math.random() * 900 + 1200;
      console.log(`  2/3: Waiting ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Step 3: Join combat again
      console.log(`  3/3: Rejoining combat...`);
      await joinCombat(characterId, locationId);

      console.log(`✅ Combat restarted for ${characterName}`);

      // Step 4: Refresh character data after 500ms (only if not skipping auto-refresh)
      if (!skipAutoRefresh) {
        setTimeout(async () => {
          const data = await apiCall(`batch/periodic-status/${characterId}`);

          if (data.success) {
            const combat = data.data.activeCombat;
            let combatInfo = null;

            if (combat) {
              let energy = null;
              if (combat.combat_log?.participants?.[characterId]) {
                const participant = combat.combat_log.participants[characterId];
                energy = {
                  current: participant.current_energy,
                  max: participant.max_energy,
                  percent: Math.round((participant.current_energy / participant.max_energy) * 100)
                };
              }

              combatInfo = {
                in_combat: combat.in_combat,
                current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
                max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
                hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
                actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
                monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
                location_id: combat.in_combat ? combat.location_id : null,
                current_monster: combat.in_combat ? combat.current_monster : null,
                energy: energy,
                participant_duration: combat.participant_duration || 0
              };
            }

            window.allCharactersData.characters[characterId].combat = combatInfo;
            window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();

            updatePanel();
            showNotification(`✅ Combat restarted for ${characterName}`, 'success');
          }
        }, 500);
      }

      return true;

    } catch (error) {
      const errorMsg = `Error restarting combat for ${characterName}: ${error.message}`;
      showNotification(`❌ ${errorMsg}`, 'error');
      console.error('❌', errorMsg);
      return false;
    }
  };

  // ============================================
  // RESTART ALL COMBATS
  // ============================================
  window.restartAllCombats = async function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔄 Restarting all active combats...');
    console.log('═══════════════════════════════════════════════════════');

    const characters = Object.values(window.allCharactersData.characters)
      .filter(char => char.combat?.in_combat && char.combat?.location_id);

    if (characters.length === 0) {
      const msg = 'No characters in combat';
      showNotification(`⚠️ ${msg}`, 'info');
      console.log(`⚠️ ${msg}`);
      return;
    }

    showNotification(`🔄 Restarting ${characters.length} combat(s)...`, 'info');
    let successCount = 0;
    const restartedCharacterIds = [];

    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];

      // Skip auto-refresh for each individual restart
      const result = await restartCombat(char.character_id, char.combat.location_id, char.character_name, true);
      if (result) {
        successCount++;
        restartedCharacterIds.push(char.character_id);
      }

      // Random delay between characters (1800-2300ms)
      if (i < characters.length - 1) {
        const delay = Math.random() * 500 + 1800;
        console.log(`⏳ Waiting ${Math.round(delay)}ms before next character...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Wait a bit then do a single global refresh for all restarted characters
    console.log('⏳ Waiting 1000ms before global refresh...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('🔄 Refreshing all restarted characters...');
    for (const characterId of restartedCharacterIds) {
      try {
        const data = await apiCall(`batch/periodic-status/${characterId}`);

        if (data.success) {
          const combat = data.data.activeCombat;
          let combatInfo = null;

          if (combat) {
            let energy = null;
            if (combat.combat_log?.participants?.[characterId]) {
              const participant = combat.combat_log.participants[characterId];
              energy = {
                current: participant.current_energy,
                max: participant.max_energy,
                percent: Math.round((participant.current_energy / participant.max_energy) * 100)
              };
            }

            combatInfo = {
              in_combat: combat.in_combat,
              current_hp: combat.in_combat ? combat.participant_stats?.current_hp : null,
              max_hp: combat.in_combat ? combat.participant_stats?.max_hp : null,
              hp_percent: combat.in_combat ? combat.participant_stats?.hp_percentage : null,
              actions_performed: combat.in_combat ? combat.participant_stats?.actions_performed : 0,
              monsters_killed: combat.in_combat ? combat.participant_stats?.monsters_killed : 0,
              location_id: combat.in_combat ? combat.location_id : null,
              current_monster: combat.in_combat ? combat.current_monster : null,
              energy: energy,
              participant_duration: combat.participant_duration || 0
            };
          }

          window.allCharactersData.characters[characterId].combat = combatInfo;
          window.allCharactersData.characters[characterId].lastUpdate = new Date().toISOString();
        }
      } catch (error) {
        console.error(`❌ Error refreshing character ${characterId}:`, error.message);
      }
    }

    // Single panel update at the end
    updatePanel();

    const finalMsg = `All combats restarted (${successCount}/${characters.length})`;
    showNotification(`✅ ${finalMsg}`, 'success', 5000);
    console.log(`✅ ${finalMsg}`);
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // CONSOLE HELPER - Display all characters
  // ============================================
  window.showAllCharacters = function() {
    console.log("\n" + "=".repeat(60));
    console.log("📊 ALL CHARACTERS STATUS");
    console.log("=".repeat(60));

    const data = window.allCharactersData;

    if (Object.keys(data.characters).length === 0) {
      console.log("⚠️  No data yet - run refreshAllCharacters()");
      return;
    }

    Object.values(data.characters).forEach((charData, i) => {
      console.log(`\n🎮 Character ${i + 1}: ${charData.character_name}`);
      console.log(`   ID: ${charData.character_id}`);

      if (charData.combat?.in_combat) {
        console.log(`   ⚔️  COMBAT:`);
        console.log(`      HP: ${charData.combat.current_hp}/${charData.combat.max_hp} (${charData.combat.hp_percent}%)`);
        if (charData.combat.energy) {
          console.log(`      Energy: ${charData.combat.energy.current}/${charData.combat.energy.max} (${charData.combat.energy.percent}%)`);
        }
        console.log(`      Actions: ${charData.combat.actions_performed.toLocaleString()} | Kills: ${charData.combat.monsters_killed}`);
        console.log(`      Location: ${charData.combat.location_id}`);
        if (charData.combat.current_monster) {
          console.log(`      Fighting: ${charData.combat.current_monster.name} Lv${charData.combat.current_monster.level} (${charData.combat.current_monster.hp_percentage}% HP)`);
        }
      } else {
        console.log(`   💤 Not in combat`);
      }

      if (charData.tasks.length > 0) {
        charData.tasks.forEach(task => {
          console.log(`   🛠️  TASK: ${task.skill} - ${task.item}`);
          console.log(`      Progress: ${task.progress} (${task.percent}%) | XP: ${task.exp_earned}`);
        });
      } else {
        console.log(`   ⭕ No active task`);
      }

      console.log(`   🕐 Last update: ${new Date(charData.lastUpdate).toLocaleTimeString()}`);
    });

    console.log("\n" + "=".repeat(60));
  };

  // ============================================
  // CHECK TOKEN STATUS
  // ============================================
  window.checkToken = function() {
    const status = TokenManager.getStatus();
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 Token Manager Status:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔑 Token captured:', status.hasToken ? '✅ YES' : '❌ NO');
    if (status.tokenAge !== null) {
      console.log('⏱️  Token age:', status.tokenAge + 's');
    }
    console.log('═══════════════════════════════════════════════════════');

    if (TokenManager.isReady()) {
      console.log('✅ Ready! Run refreshAllCharacters() to fetch data');
    } else {
      console.log('⚠️ Not ready yet. Navigate in the game (visit a skill page)');
    }
  };

  // ============================================
  // DIAGNOSTIC FUNCTION - For troubleshooting
  // ============================================
  window.diagnoseMonitor = function() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔬 DIAGNOSTIC REPORT - Multi-Character Monitor v2.3');
    console.log('═══════════════════════════════════════════════════════');

    // 1. Check if script is loaded properly
    console.log('\n📋 1. SCRIPT STATUS:');
    console.log('   ✅ diagnoseMonitor function exists (script loaded)');
    console.log('   🔧 DEBUG_MODE:', DEBUG_MODE);

    // 2. Check fetch/XHR interceptors
    console.log('\n📋 2. INTERCEPTORS:');
    console.log('   📡 window.fetch modified:', window.fetch !== originalFetch ? '✅ YES' : '❌ NO');
    console.log('   📡 XHR.open modified:', XMLHttpRequest.prototype.open !== originalXHROpen ? '✅ YES' : '❌ NO');
    console.log('   📡 XHR.setRequestHeader modified:', XMLHttpRequest.prototype.setRequestHeader !== originalXHRSetRequestHeader ? '✅ YES' : '❌ NO');

    // 3. Check token status
    console.log('\n📋 3. TOKEN STATUS:');
    const status = TokenManager.getStatus();
    console.log('   🔑 Token captured:', status.hasToken ? '✅ YES' : '❌ NO');
    if (status.hasToken) {
      console.log('   📏 Token length:', TokenManager.authToken?.length);
      console.log('   ⏱️  Token age:', status.tokenAge + 's');
    }

    // 4. Check data storage
    console.log('\n📋 4. DATA STORAGE:');
    console.log('   📦 window.allCharactersData exists:', !!window.allCharactersData);
    console.log('   👥 Characters loaded:', Object.keys(window.allCharactersData?.characters || {}).length);
    console.log('   📋 Characters list:', window.allCharactersData?.charactersList?.length || 0);
    console.log('   🗺️  Characters map:', Object.keys(window.allCharactersData?.charactersMap || {}).length);
    console.log('   📸 Portraits order:', window.allCharactersData?.portraitsOrder?.length || 0);

    // 5. Check UI
    console.log('\n📋 5. UI STATUS:');
    console.log('   🔘 Toggle button exists:', !!document.getElementById('mc-monitor-toggle'));
    console.log('   📊 Panel exists:', !!document.getElementById('mc-monitor-panel'));
    console.log('   📄 Content container exists:', !!document.getElementById('mc-content'));

    // 6. Check browser environment
    console.log('\n📋 6. BROWSER ENVIRONMENT:');
    console.log('   🌐 Current URL:', window.location.href);
    console.log('   🌐 Origin:', window.location.origin);
    console.log('   📱 User Agent:', navigator.userAgent.substring(0, 50) + '...');

    // 7. Suggestions
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('💡 TROUBLESHOOTING SUGGESTIONS:');

    if (!status.hasToken) {
      console.log('   ❌ Token not captured. Try:');
      console.log('      1. Refresh the page with Ctrl+Shift+R (hard refresh)');
      console.log('      2. Make sure you are logged in to DegenIdle');
      console.log('      3. Navigate in the game (click skills, change character)');
      console.log('      4. Check if Tampermonkey is enabled');
      console.log('      5. Check if there are any console errors above');
      console.log('      6. Try disabling other userscripts/extensions');
    } else {
      console.log('   ✅ Token is captured! Run refreshAllCharacters() to fetch data');
    }

    console.log('═══════════════════════════════════════════════════════');

    return {
      tokenCaptured: status.hasToken,
      debugMode: DEBUG_MODE,
      charactersLoaded: Object.keys(window.allCharactersData?.characters || {}).length,
      uiLoaded: !!document.getElementById('mc-monitor-panel')
    };
  };

  // ============================================
  // EXPORT CREDENTIALS - For CLI Usage
  // ============================================
  window.exportCredentials = function() {
    if (!TokenManager.isReady()) {
      console.log('❌ Token not captured yet!');
      console.log('💡 Navigate in the game first to capture the token');
      return;
    }

    console.log('═══════════════════════════════════════════════════════');
    console.log('🔑 CREDENTIALS FOR CLI');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 TOKEN:');
    console.log(TokenManager.authToken);
    console.log('\n👥 CHARACTER IDs:');

    if (window.allCharactersData.charactersList.length > 0) {
      window.allCharactersData.charactersList.forEach((char, i) => {
        console.log(`\n${i + 1}. ${char.name} (${char.class})`);
        console.log(`   ID: ${char.id}`);
      });
    } else {
      console.log('⚠️ No characters loaded yet');
      console.log('💡 Run: await loadCharacterNames()');
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('💾 Copy these values for CLI configuration');
    console.log('═══════════════════════════════════════════════════════');
  };

  // ============================================
  // NOTIFICATION SYSTEM
  // ============================================

  let notificationIdCounter = 0;

  function showNotification(message, type = 'info', duration = 3000) {
    const id = `mc-notification-${notificationIdCounter++}`;
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `mc-notification mc-notification-${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Position stacked notifications
    const allNotifications = document.querySelectorAll('.mc-notification');
    let offset = 20;
    allNotifications.forEach((notif, index) => {
      notif.style.top = `${offset}px`;
      offset += notif.offsetHeight + 10;
    });

    // Auto-remove after duration
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  // ============================================
  // UI PANEL CODE
  // ============================================

  function createUI() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #mc-monitor-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #4f46e5;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 9998;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #mc-monitor-toggle:hover {
        background: #4338ca;
        transform: scale(1.05);
      }

      #mc-monitor-toggle:active {
        transform: scale(0.95);
      }

      #mc-monitor-panel {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 420px;
        max-height: 600px;
        background: #0B0E14;
        border: 1px solid #1E2330;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #mc-monitor-panel.visible {
        display: flex;
      }

      .mc-header {
        background: #0B0E14;
        padding: 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1E2330;
      }

      .mc-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mc-header-buttons {
        display: flex;
        gap: 8px;
      }

      .mc-header button {
        background: transparent;
        border: none;
        color: #9ca3af;
        padding: 4px;
        cursor: pointer;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mc-header button:hover {
        color: white;
      }

      .mc-header button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .mc-header button svg {
        width: 20px;
        height: 20px;
      }

      #mc-refresh-btn {
        background: transparent;
        color: #9ca3af;
        padding: 4px;
      }

      #mc-refresh-btn:hover {
        background: transparent;
        color: white;
      }

      #mc-refresh-btn svg {
        width: 20px;
        height: 20px;
      }

      .mc-content {
        padding: 16px;
        overflow-y: auto;
        max-height: 60vh;
      }

      .mc-content::-webkit-scrollbar {
        width: 8px;
      }

      .mc-content::-webkit-scrollbar-track {
        background: #1E2330;
        border-radius: 4px;
      }

      .mc-content::-webkit-scrollbar-thumb {
        background: #2A3041;
        border-radius: 4px;
      }

      .mc-content::-webkit-scrollbar-thumb:hover {
        background: #363d52;
      }

      .mc-character {
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 0.5rem;
        margin-bottom: 12px;
        transition: all 0.2s;
        overflow: hidden;
      }

      .mc-character:hover {
        border-color: #4f46e5;
        background: #252B3B;
      }

      .mc-character:last-child {
        margin-bottom: 0;
      }

      .mc-char-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        user-select: none;
      }

      .mc-char-header:hover {
        background: rgba(79, 70, 229, 0.05);
      }

      .mc-char-header-pfp {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .mc-char-header-name {
        font-size: 1rem;
        font-weight: 600;
        color: white;
        min-width: 100px;
        flex-shrink: 0;
      }

      .mc-char-header-status {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
        font-size: 0.875rem;
        color: #9ca3af;
      }

      .mc-char-header-combat,
      .mc-char-header-task {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .mc-char-header-expand {
        flex-shrink: 0;
        color: #9ca3af;
        font-size: 1.25rem;
        transition: transform 0.2s;
      }

      .mc-character.expanded .mc-char-header-expand {
        transform: rotate(180deg);
      }

      .mc-char-details {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        padding: 0 16px;
      }

      .mc-character.expanded .mc-char-details {
        max-height: 500px;
        padding: 0 16px 16px 16px;
      }

      .mc-char-restart-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        padding: 4px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-left: 8px;
      }

      .mc-char-restart-btn:hover {
        color: #4f46e5;
        transform: rotate(-15deg) scale(1.1);
      }

      .mc-char-restart-btn:active {
        transform: rotate(-15deg) scale(0.95);
      }

      .mc-char-restart-btn svg {
        width: 16px;
        height: 16px;
      }

      .mc-char-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: white;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mc-char-hp {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 13px;
        color: #cbd5e1;
      }

      .mc-hp-bar {
        flex: 1;
        height: 6px;
        background: #2A3041;
        border-radius: 3px;
        overflow: hidden;
      }

      .mc-hp-fill {
        height: 100%;
        transition: width 0.3s ease, background-color 0.3s ease;
        border-radius: 3px;
      }

      .mc-hp-fill.high {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .mc-hp-fill.medium {
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }

      .mc-hp-fill.low {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }

      .mc-char-info {
        font-size: 0.875rem;
        color: #9ca3af;
        line-height: 1.6;
      }

      .mc-char-info div {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
      }

      .mc-task-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 6px;
      }

      .mc-progress-bar {
        flex: 1;
        height: 6px;
        background: #2A3041;
        border-radius: 3px;
        overflow: hidden;
      }

      .mc-progress-fill {
        height: 100%;
        background: #4f46e5;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .mc-progress-fill.combat {
        background: linear-gradient(90deg, #ef4444, #f87171);
      }

      .mc-no-data {
        text-align: center;
        padding: 40px 20px;
        color: #9ca3af;
      }

      .mc-no-data div {
        font-size: 48px;
        margin-bottom: 12px;
      }

      /* Notifications Toast */
      .mc-notification {
        position: fixed;
        right: 20px;
        min-width: 320px;
        max-width: 400px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        font-weight: 500;
        font-size: 14px;
        z-index: 999999;
        transition: all 0.3s ease;
        animation: slideInRight 0.3s ease;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .mc-notification-info {
        background: #3b82f6;
        color: white;
        border-left: 4px solid #2563eb;
      }

      .mc-notification-success {
        background: #10b981;
        color: white;
        border-left: 4px solid #059669;
      }

      .mc-notification-error {
        background: #ef4444;
        color: white;
        border-left: 4px solid #dc2626;
      }

      /* ============================================ */
      /* RESPONSIVE MOBILE STYLES */
      /* ============================================ */
      @media (max-width: 768px) {
        #mc-monitor-toggle {
          bottom: 100px;
          right: 15px;
          width: 50px;
          height: 50px;
          font-size: 20px;
        }

        #mc-monitor-panel {
          bottom: 160px;
          right: 10px;
          left: 10px;
          width: auto;
          max-width: calc(100vw - 20px);
          max-height: 70vh;
        }

        .mc-content {
          max-height: calc(70vh - 70px);
        }

        .mc-char-header {
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 12px;
        }

        .mc-char-header-name {
          font-size: 0.9rem;
          min-width: 80px;
        }

        .mc-char-header-status {
          gap: 12px;
          font-size: 0.8rem;
        }

        .mc-header h3 {
          font-size: 1.1rem;
        }

        .mc-header button svg {
          width: 18px;
          height: 18px;
        }

        .mc-notification {
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: calc(100vw - 20px);
        }
      }

      @media (max-width: 480px) {
        #mc-monitor-toggle {
          bottom: 120px;
        }

        #mc-monitor-panel {
          bottom: 180px;
        }

        .mc-char-header-pfp {
          width: 28px;
          height: 28px;
        }

        .mc-char-header-name {
          font-size: 0.85rem;
          min-width: 70px;
        }

        .mc-char-header-status {
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          font-size: 0.75rem;
        }
      }
    `;
    document.head.appendChild(style);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mc-monitor-toggle';
    toggleBtn.innerHTML = '📊';
    toggleBtn.title = 'Toggle Character Monitor';
    document.body.appendChild(toggleBtn);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'mc-monitor-panel';
    panel.innerHTML = `
      <div class="mc-header">
        <h3>Character Monitor</h3>
        <div class="mc-header-buttons">
          <button id="mc-refresh-btn" title="Refresh All Characters Data">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-download">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
              <path d="M12 12v9"/>
              <path d="m8 17 4 4 4-4"/>
            </svg>
          </button>
          <button id="mc-restart-all-combats-btn" title="Restart All Active Combats">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" opacity="0.6"/>
              <path d="M3 3v5h5" opacity="0.6"/>
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" stroke-width="1.5"/>
              <line x1="13" x2="19" y1="19" y2="13" stroke-width="1.5"/>
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" stroke-width="1.5"/>
              <line x1="5" x2="9" y1="14" y2="18" stroke-width="1.5"/>
            </svg>
          </button>
          <button id="mc-restart-all-tasks-btn" title="Restart All Active Tasks">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button id="mc-close-btn" title="Close Panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="mc-content" id="mc-content">
        <div class="mc-no-data">
          <div>👋</div>
          <p>Click the cloud icon to load character data</p>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
    });

    document.getElementById('mc-close-btn').addEventListener('click', () => {
      panel.classList.remove('visible');
    });

    document.getElementById('mc-refresh-btn').addEventListener('click', () => {
      window.refreshAllCharacters();
    });

    document.getElementById('mc-restart-all-tasks-btn').addEventListener('click', () => {
      window.restartAllTasks();
    });

    document.getElementById('mc-restart-all-combats-btn').addEventListener('click', () => {
      window.restartAllCombats();
    });
  }

  function updateToggleIcon() {
    const toggleBtn = document.getElementById('mc-monitor-toggle');
    if (!toggleBtn) return;

    let iconUrl = null;

    // Priority 1: Use first character from DOM order (portraitsOrder)
    if (window.allCharactersData.portraitsOrder.length > 0) {
      const firstCharName = window.allCharactersData.portraitsOrder[0];

      // Find this character in charactersMap by name
      const charEntry = Object.values(window.allCharactersData.charactersMap).find(
        char => char.name === firstCharName
      );

      if (charEntry?.pfp) {
        iconUrl = charEntry.pfp;
      } else {
        // Fallback to portrait from navbar
        iconUrl = window.allCharactersData.portraitImages[firstCharName];
      }
    }

    // Priority 2: If no portraits order yet, use first from charactersList
    if (!iconUrl && window.allCharactersData.charactersList.length > 0) {
      iconUrl = window.allCharactersData.charactersList[0]?.pfp;
    }

    // Priority 3: Use first portrait from navbar
    if (!iconUrl) {
      iconUrl = Object.values(window.allCharactersData.portraitImages)[0];
    }

    if (iconUrl) {
      toggleBtn.innerHTML = `<img src="${iconUrl}"
        style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      toggleBtn.innerHTML = '📊'; // Fallback
    }
  }

  function getHPClass(percent) {
    if (percent >= 80) return 'high';
    if (percent >= 40) return 'medium';
    return 'low';
  }

  function getCombatDurationClass(percent) {
    if (percent >= 75) return 'low';      // Rouge (critique)
    if (percent >= 50) return 'medium';   // Orange (attention)
    return 'high';                         // Vert (safe)
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  function updatePanel() {
    const content = document.getElementById('mc-content');
    if (!content) return;

    const data = window.allCharactersData;

    if (Object.keys(data.characters).length === 0) {
      content.innerHTML = `
        <div class="mc-no-data">
          <div>📭</div>
          <p>No character data available yet</p>
          <p style="font-size: 11px; margin-top: 8px;">Click "Refresh All" to collect data</p>
        </div>
      `;
      return;
    }

    let html = '';

    // Get all characters sorted by navbar portrait order
    const characters = Object.values(data.characters).sort((a, b) => {
      const nameA = a.character_name;
      const nameB = b.character_name;
      const indexA = data.portraitsOrder.indexOf(nameA);
      const indexB = data.portraitsOrder.indexOf(nameB);

      // If both are in the portraits order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only one is in the portraits order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // Otherwise, sort alphabetically
      return nameA.localeCompare(nameB);
    });

    characters.forEach((charData) => {
      const charName = charData.character_name;
      const charId = charData.character_id;

      // Get portrait URL - prefer API pfp, fallback to navbar portrait
      const charInfo = data.charactersMap[charId];
      const portraitUrl = charInfo?.pfp || data.portraitImages[charName] || '';

      // ========== PRE-CALCULATE COMBAT DURATION (used in both collapsed and expanded views) ==========
      let durationPercent = null;
      let formattedDuration = null;
      let durationClass = null;

      if (charData.combat?.in_combat && charData.combat.participant_duration !== undefined) {
        const MAX_COMBAT_DURATION = 8 * 60 * 60; // 8 heures en secondes
        const currentDuration = charData.combat.participant_duration || 0;
        durationPercent = Math.min(100, Math.round((currentDuration / MAX_COMBAT_DURATION) * 100));
        durationClass = getCombatDurationClass(durationPercent);
        formattedDuration = formatDuration(currentDuration);
      }

      // ========== COMPACT HEADER INFO ==========
      let headerCombatStatus = '';
      let headerTaskStatus = '';

      if (charData.combat?.in_combat) {
        // Show combat duration percentage instead of HP
        if (durationPercent !== null) {
          headerCombatStatus = `<span class="mc-char-header-combat">⚔️ ${durationPercent}%</span>`;
        } else {
          headerCombatStatus = `<span class="mc-char-header-combat">⚔️ In combat</span>`;
        }
      } else {
        headerCombatStatus = `<span class="mc-char-header-combat">💤 Idle</span>`;
      }

      if (charData.tasks.length > 0) {
        const task = charData.tasks[0];
        headerTaskStatus = `<span class="mc-char-header-task">🛠️ ${task.percent}%</span>`;
      } else {
        headerTaskStatus = `<span class="mc-char-header-task">⭕ No task</span>`;
      }

      // ========== DETAILED INFO (for expanded view) ==========
      let statsHTML = '';
      if (charData.combat?.in_combat) {
        const hpPercent = charData.combat.hp_percent || 0;
        const hpClass = getHPClass(hpPercent);

        // HP text
        const hpText = `${Math.round(charData.combat.current_hp)}/${charData.combat.max_hp}`;

        // Energy text
        let energyText = '';
        if (charData.combat.energy) {
          energyText = ` | ⚡ ${charData.combat.energy.current}/${charData.combat.energy.max}`;
        }

        statsHTML = `
          <div class="mc-char-info" style="margin-bottom: 8px;">
            <div style="font-size: 13px; color: #cbd5e1;">
              ❤️ ${hpText} HP (${hpPercent}%)${energyText}
            </div>
          </div>
        `;
      }

      // Combat duration progress bar (reuse pre-calculated values)
      let combatActionsHTML = '';
      if (charData.combat?.in_combat && durationPercent !== null) {
        combatActionsHTML = `
          <div class="mc-char-info" style="margin-bottom: 6px;">
            <div style="font-size: 12px;">⚔️ Combat Duration:</div>
            <div class="mc-task-progress">
              <div class="mc-progress-bar">
                <div class="mc-progress-fill ${durationClass}" style="width: ${durationPercent}%"></div>
              </div>
              <span style="min-width: 95px; text-align: right; font-size: 11px;">${formattedDuration} (${durationPercent}%)</span>
            </div>
          </div>
        `;
      }

      // Combat status (simple message if not in combat)
      let combatHTML = '';
      if (!charData.combat?.in_combat) {
        combatHTML = '<div>💤 Not in combat</div>';
      }

      // Task info
      let taskHTML = '';
      if (charData.tasks.length > 0) {
        const task = charData.tasks[0];
        taskHTML = `
          <div style="margin-top: 6px;">🛠️ ${task.skill} - ${task.item}</div>
          <div class="mc-task-progress">
            <div class="mc-progress-bar">
              <div class="mc-progress-fill" style="width: ${task.percent}%"></div>
            </div>
            <span style="min-width: 80px; text-align: right; font-size: 11px;">${task.percent}% (${task.actions_completed}/${task.total_actions})</span>
          </div>
        `;
      } else {
        taskHTML = '<div style="margin-top: 6px;">⭕ No active task</div>';
      }

      // Last update
      const updateTime = new Date(charData.lastUpdate).toLocaleTimeString();

      html += `
        <div class="mc-character" data-char-id="${charId}">
          <div class="mc-char-header">
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer;" onclick="toggleCharacterExpand('${charId}')">
              ${portraitUrl ? `<img src="${portraitUrl}" class="mc-char-header-pfp">` : '<span style="font-size: 24px;">🎮</span>'}
              <div class="mc-char-header-name">${charName}</div>
              <div class="mc-char-header-status">
                ${headerCombatStatus}
                ${headerTaskStatus}
              </div>
            </div>
            ${charData.combat?.in_combat && charData.combat?.location_id ? `
              <button class="mc-char-restart-btn" onclick="event.stopPropagation(); restartCombat('${charId}', ${charData.combat.location_id}, '${charName}');" title="Restart this character's combat">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" opacity="0.5"/>
                  <path d="M3 3v5h5" opacity="0.5"/>
                  <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" stroke-width="1.5"/>
                  <line x1="13" x2="19" y1="19" y2="13" stroke-width="1.5"/>
                  <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" stroke-width="1.5"/>
                  <line x1="5" x2="9" y1="14" y2="18" stroke-width="1.5"/>
                </svg>
              </button>
            ` : ''}
            ${charData.tasks.length > 0 && charData.tasks[0].id ? `
              <button class="mc-char-restart-btn" onclick="event.stopPropagation(); restartTask('${charData.tasks[0].id}', '${charId}', '${charName}');" title="Restart this character's task">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              </button>
            ` : ''}
            <div class="mc-char-header-expand" onclick="toggleCharacterExpand('${charId}')" style="cursor: pointer;">▼</div>
          </div>
          <div class="mc-char-details">
            ${statsHTML}
            ${combatActionsHTML}
            <div class="mc-char-info">
              ${combatHTML}
              ${taskHTML}
              <div style="margin-top: 6px; font-size: 11px; opacity: 0.7;">🕐 ${updateTime}</div>
            </div>
          </div>
        </div>
      `;
    });

    content.innerHTML = html;
  }

  // ============================================
  // TOGGLE CHARACTER EXPAND/COLLAPSE
  // ============================================
  window.toggleCharacterExpand = function(charId) {
    const charElement = document.querySelector(`.mc-character[data-char-id="${charId}"]`);
    if (charElement) {
      charElement.classList.toggle('expanded');
    }
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  debugLog('🚀 Starting initialization...');

  // Setup auto-load when token is captured
  TokenManager.onTokenCaptured = async () => {
    debugLog('[onTokenCaptured] Callback triggered!');
    // Auto-load character names (will wait for portraits in DOM)
    if (Object.keys(window.allCharactersData.charactersMap).length === 0) {
      console.log('[AutoLoad] 🚀 Starting auto-load of character data...');
      await loadCharacterNames(true); // true = wait for DOM
      console.log('[AutoLoad] ✅ Auto-load complete!');
    } else {
      debugLog('[onTokenCaptured] Characters map already populated, skipping auto-load');
    }
  };

  debugLog('✅ TokenManager.onTokenCaptured callback registered');

  // Create UI after page loads
  setTimeout(() => {
    debugLog('⏰ setTimeout callback executing (500ms delay passed)');

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🟢 Multi-Character Monitor v2.3 Loaded!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔧 DEBUG_MODE:', DEBUG_MODE ? 'ENABLED - verbose logs active' : 'DISABLED');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📝 Commands:');
    console.log('   - checkToken()                        : Check if token is captured');
    console.log('   - diagnoseMonitor()                   : 🔬 Full diagnostic report (for debugging)');
    console.log('   - exportCredentials()                 : Export token & character IDs for CLI');
    console.log('   - loadCharacterNames()                : Load character names and pfp');
    console.log('   - refreshAllCharacters()              : Fetch all character data via API');
    console.log('   - restartTask(id, charId, name)       : Restart a specific task');
    console.log('   - restartAllTasks()                   : Restart all active tasks');
    console.log('   - restartCombat(charId, locId, name)  : Restart a specific combat');
    console.log('   - restartAllCombats()                 : Restart all active combats');
    console.log('   - showAllCharacters()                 : Display summary in console');
    console.log('💾 Access raw data via: window.allCharactersData');
    console.log('\n🎨 UI Panel: Click the button in the bottom-right corner!');
    console.log('🔔 Notifications: Toast notifications for all actions');
    console.log('═══════════════════════════════════════════════════════');
    console.log('⏳ Waiting for token to be captured...');
    console.log('💡 Navigate in the game (click on a skill, change character, etc.)');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔍 TROUBLESHOOTING:');
    console.log('   1. Make sure Tampermonkey is enabled');
    console.log('   2. Try refreshing the page (Ctrl+F5)');
    console.log('   3. Navigate in the game to trigger API calls');
    console.log('   4. Check for [DEBUG] logs above - they show API interception');
    console.log('   5. Run checkToken() to see current token status');
    console.log('═══════════════════════════════════════════════════════\n');

    // Create UI
    debugLog('🎨 Creating UI...');
    createUI();
    debugLog('✅ UI created');

    // Check current token status
    debugLog('📊 Current token status:', TokenManager.isReady() ? 'READY' : 'NOT READY');

    // If token is already captured (unlikely but possible), load immediately
    if (TokenManager.isReady() && Object.keys(window.allCharactersData.charactersMap).length === 0) {
      console.log('[AutoLoad] Token already ready, loading now...');
      loadCharacterNames(true);
    }

    // Periodic check to help debug (only in debug mode)
    if (DEBUG_MODE) {
      let checkCount = 0;
      const debugInterval = setInterval(() => {
        checkCount++;
        if (TokenManager.isReady()) {
          console.log(`[DEBUG] ✅ Token is captured after ${checkCount * 5}s`);
          clearInterval(debugInterval);
        } else if (checkCount <= 6) { // Check for 30 seconds
          console.log(`[DEBUG] ⏳ Still waiting for token... (${checkCount * 5}s elapsed)`);
          console.log(`[DEBUG] 💡 Navigate in the game to trigger API calls`);
        } else {
          console.log(`[DEBUG] ⚠️ Token not captured after 30s. Possible issues:`);
          console.log(`[DEBUG]    - Game might use a different API method`);
          console.log(`[DEBUG]    - Script might have loaded after game initialized`);
          console.log(`[DEBUG]    - Try refreshing the page with Ctrl+Shift+R`);
          clearInterval(debugInterval);
        }
      }, 5000);
    }
  }, 500);

  debugLog('📋 Script setup complete, waiting for setTimeout...');

})();
