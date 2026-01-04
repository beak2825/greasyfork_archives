// ==UserScript==
// @name         DegenIdle World Boss Queue
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Join World Boss queue with teleport - Manual panel with per-character buttons
// @author       Seisen
// @match        https://degenidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558962/DegenIdle%20World%20Boss%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/558962/DegenIdle%20World%20Boss%20Queue.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('═══════════════════════════════════════════════════════');
  console.log('World Boss Queue v1.1');
  console.log('═══════════════════════════════════════════════════════');

  const API_ROOT = "https://api-v1.degenidle.com/api/";
  const ACTION_DELAY_MIN = 1000;  // 1s
  const ACTION_DELAY_MAX = 1500;  // 1.5s

  // ============================================
  // TOKEN MANAGER
  // ============================================
  const TokenManager = {
    authToken: null,
    lastUpdate: null,
    onTokenCaptured: null,

    update(token) {
      if (token && token !== this.authToken) {
        const isFirstCapture = !this.authToken;
        this.authToken = token;
        this.lastUpdate = Date.now();
        console.log('[WBQueue] Token captured!');

        if (isFirstCapture && this.onTokenCaptured) {
          console.log('[WBQueue] First token capture - initializing panel');
          this.onTokenCaptured();
        }
      }
    },

    isReady() {
      return !!this.authToken;
    }
  };

  // ============================================
  // DATA STORAGE
  // ============================================
  const WBData = {
    characters: [],
    charactersMap: {},
    portraitImages: {},
    currentBoss: null,
    characterStatuses: {} // Track join status per character
  };

  // ============================================
  // FETCH INTERCEPTOR
  // ============================================
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const [url, options] = args;

    const urlStr = typeof url === 'string' ? url : url?.url || '';
    if (urlStr.includes('api-v1.degenidle.com') && options?.headers) {
      let authHeader = null;
      
      // Handle different header formats
      if (options.headers instanceof Headers) {
        authHeader = options.headers.get('Authorization');
      } else if (Array.isArray(options.headers)) {
        const entry = options.headers.find(h => h[0].toLowerCase() === 'authorization');
        if (entry) authHeader = entry[1];
      } else if (typeof options.headers === 'object') {
        authHeader = options.headers['Authorization'] || options.headers['authorization'] || options.headers['AUTHORIZATION'];
      }
      
      if (authHeader) {
        TokenManager.update(authHeader);
      }
    }

    return originalFetch.apply(this, args);
  };

  // ============================================
  // XHR INTERCEPTOR - Capture Authorization Token from XMLHttpRequest
  // ============================================
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._degenIdleUrl = url;
    this._degenIdleHeaders = {};
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (this._degenIdleHeaders) {
      this._degenIdleHeaders[name.toLowerCase()] = value;
    }
    
    // Capture Authorization header for api-v1.degenidle.com
    if (name.toLowerCase() === 'authorization' && this._degenIdleUrl?.includes('api-v1.degenidle.com')) {
      TokenManager.update(value);
    }
    
    return originalXHRSetRequestHeader.apply(this, arguments);
  };

  console.log('[WBQueue] Token interceptor installed (fetch + XHR)');

  // ============================================
  // API HELPER FUNCTIONS
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

  async function apiPost(endpoint, body) {
    if (!TokenManager.isReady()) {
      throw new Error('Token not available yet');
    }

    const url = `${API_ROOT}${endpoint}`;
    const response = await originalFetch(url, {
      method: 'POST',
      headers: {
        'Authorization': TokenManager.authToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://degenidle.com',
        'Referer': 'https://degenidle.com/'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API POST failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // WORLD BOSS FUNCTIONS
  // ============================================
  async function getActiveWorldBoss() {
    try {
      const data = await apiCall('worldboss/schedule?limit=5');
      
      if (!data.success || !data.data || data.data.length === 0) {
        return null;
      }

      // Find the first boss with status "queuing"
      const queuingBoss = data.data.find(boss => boss.status === 'queuing');
      
      if (queuingBoss) {
        return queuingBoss;
      }

      // If no queuing boss, return the next scheduled one for info
      return data.data[0];
    } catch (error) {
      console.error('[WBQueue] Error fetching world boss schedule:', error);
      return null;
    }
  }

  async function teleportToLocation(characterId, locationName) {
    console.log(`[WBQueue] Teleporting to ${locationName}...`);
    
    const result = await apiPost(`map/${characterId}/teleport/managed`, {
      locationName: locationName,
      cancel: {
        tasks: true,
        altar: true,
        idleCombat: true,
        dungeon: true,
        worldBossQueues: true
      },
      dryRun: false
    });

    return result;
  }

  async function joinWorldBossQueue(characterId, worldBossId) {
    console.log(`[WBQueue] Joining WB queue...`);
    
    const result = await apiPost(`worldboss/queue/${worldBossId}`, {
      characterId: characterId
    });

    return result;
  }

  // Check if a character is already in the WB queue
  async function checkCharacterQueueStatus(characterId, worldBossId) {
    try {
      const result = await apiCall(`worldboss/queue/${worldBossId}?characterId=${characterId}`);
      return result.data?.is_queued || false;
    } catch (error) {
      console.error(`[WBQueue] Error checking queue status:`, error);
      return false;
    }
  }

  async function joinWBForCharacter(characterId, characterName) {
    const boss = WBData.currentBoss;
    
    if (!boss || boss.status !== 'queuing') {
      showNotification(`No active World Boss queue available`, 'error');
      return false;
    }

    const location = boss.boss.location;
    const wbId = boss.id;
    const bossName = boss.boss.name;

    // Update status to "joining"
    WBData.characterStatuses[characterId] = 'joining';
    updatePanel();

    try {
      // Step 1: Teleport to location
      showNotification(`${characterName}: Teleporting to ${location}...`, 'info', 2000);
      console.log(`[WBQueue] ${characterName}: Teleporting to ${location}...`);
      
      try {
        await teleportToLocation(characterId, location);
      } catch (tpError) {
        // If already at location, that's fine - continue to join queue
        const errorMsg = tpError.message.toLowerCase();
        if (errorMsg.includes('already at location') || errorMsg.includes('already at')) {
          console.log(`[WBQueue] ${characterName}: Already at ${location}, skipping teleport`);
        } else {
          throw tpError; // Re-throw if it's a different error
        }
      }
      
      // Delay between actions
      const delay = randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX);
      await sleep(delay);

      // Step 2: Join the queue
      showNotification(`${characterName}: Joining ${bossName} queue...`, 'info', 2000);
      console.log(`[WBQueue] ${characterName}: Joining queue...`);
      
      try {
        const result = await joinWorldBossQueue(characterId, wbId);

        if (result.success) {
          WBData.characterStatuses[characterId] = 'joined';
          showNotification(`${characterName}: Joined queue! Position: ${result.data.position}`, 'success');
          console.log(`[WBQueue] ${characterName}: Joined! Position ${result.data.position}/${result.data.queue_count}`);
          updatePanel();
          return true;
        } else {
          WBData.characterStatuses[characterId] = 'error';
          showNotification(`${characterName}: Failed to join queue`, 'error');
          updatePanel();
          return false;
        }
      } catch (joinError) {
        // If already in queue, mark as joined
        const errorMsg = joinError.message.toLowerCase();
        if (errorMsg.includes('already in queue') || errorMsg.includes('already queued') || errorMsg.includes('already joined')) {
          WBData.characterStatuses[characterId] = 'joined';
          showNotification(`${characterName}: Already in queue!`, 'success');
          console.log(`[WBQueue] ${characterName}: Already in queue`);
          updatePanel();
          return true;
        } else {
          throw joinError; // Re-throw if it's a different error
        }
      }

    } catch (error) {
      console.error(`[WBQueue] Error for ${characterName}:`, error);
      WBData.characterStatuses[characterId] = 'error';
      showNotification(`${characterName}: ${error.message}`, 'error');
      updatePanel();
      return false;
    }
  }

  async function joinAllCharacters() {
    const boss = WBData.currentBoss;
    
    if (!boss || boss.status !== 'queuing') {
      showNotification('No active World Boss queue available', 'error');
      return;
    }

    showNotification(`Joining all characters to ${boss.boss.name}...`, 'info');

    let successCount = 0;

    for (let i = 0; i < WBData.characters.length; i++) {
      const char = WBData.characters[i];
      
      // Skip already joined characters
      if (WBData.characterStatuses[char.id] === 'joined') {
        console.log(`[WBQueue] ${char.name}: Already joined, skipping`);
        continue;
      }

      const success = await joinWBForCharacter(char.id, char.name);
      if (success) successCount++;

      // Delay between characters
      if (i < WBData.characters.length - 1) {
        const delay = randomDelay(ACTION_DELAY_MIN, ACTION_DELAY_MAX);
        await sleep(delay);
      }
    }

    showNotification(`Joined ${successCount}/${WBData.characters.length} characters!`, 'success', 5000);
  }

  // ============================================
  // LOAD DATA
  // ============================================
  async function loadData() {
    try {
      if (!TokenManager.isReady()) {
        console.log('[WBQueue] Token not ready yet');
        return false;
      }

      console.log('[WBQueue] Loading data...');

      // Load characters
      const charsData = await apiCall('characters/all');
      if (charsData.success && charsData.characters) {
        WBData.characters = charsData.characters;
        WBData.charactersMap = Object.fromEntries(
          charsData.characters.map(char => [char.id, char])
        );
        console.log(`[WBQueue] Loaded ${charsData.characters.length} characters`);
      }

      // Load world boss info
      WBData.currentBoss = await getActiveWorldBoss();
      if (WBData.currentBoss) {
        console.log(`[WBQueue] Current WB: ${WBData.currentBoss.boss.name} (${WBData.currentBoss.status})`);
        
        // Check queue status for each character if boss is queuing
        if (WBData.currentBoss.status === 'queuing') {
          console.log('[WBQueue] Checking queue status for each character...');
          for (const char of WBData.characters) {
            const isQueued = await checkCharacterQueueStatus(char.id, WBData.currentBoss.id);
            if (isQueued) {
              WBData.characterStatuses[char.id] = 'joined';
              console.log(`[WBQueue] ${char.name}: Already in queue`);
            }
            // Small delay between API calls
            await sleep(200);
          }
        }
      }

      // Scan portraits from DOM
      scanPortraits();

      updatePanel();
      return true;

    } catch (error) {
      console.error('[WBQueue] Error loading data:', error);
      return false;
    }
  }

  function scanPortraits() {
    const allPortraits = document.querySelectorAll('button img[alt]');
    const portraits = Array.from(allPortraits).filter(img => {
      const parentClasses = img.parentElement?.className || '';
      return parentClasses.includes('relative') &&
             parentClasses.includes('w-9') &&
             parentClasses.includes('h-9') &&
             parentClasses.includes('rounded-lg') &&
             !parentClasses.includes('md:hidden');
    });

    portraits.forEach(img => {
      WBData.portraitImages[img.alt] = img.src;
    });
  }

  async function refreshBossInfo() {
    if (!TokenManager.isReady()) {
      console.log('[WBQueue] Token not ready, skipping boss refresh');
      return;
    }
    WBData.currentBoss = await getActiveWorldBoss();
    updatePanel();
  }

  // ============================================
  // NOTIFICATION SYSTEM
  // ============================================
  let notificationIdCounter = 0;

  function showNotification(message, type = 'info', duration = 3000) {
    const id = `wb-notification-${notificationIdCounter++}`;
    const notification = document.createElement('div');
    notification.id = id;
    notification.className = `wb-notification wb-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    const allNotifications = document.querySelectorAll('.wb-notification');
    let offset = 20;
    allNotifications.forEach((notif) => {
      notif.style.top = `${offset}px`;
      offset += notif.offsetHeight + 10;
    });

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
  // UI PANEL
  // ============================================
  function createUI() {
    const style = document.createElement('style');
    style.textContent = `
      #wb-toggle {
        position: fixed;
        bottom: 90px;
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
        z-index: 9997;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #wb-toggle:hover {
        background: #4338ca;
        transform: scale(1.05);
      }

      #wb-toggle:active {
        transform: scale(0.95);
      }

      #wb-panel {
        position: fixed;
        bottom: 160px;
        right: 20px;
        width: 380px;
        max-height: 500px;
        background: #0B0E14;
        border: 1px solid #1E2330;
        border-radius: 0.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: wbSlideIn 0.3s ease;
      }

      @keyframes wbSlideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #wb-panel.visible {
        display: flex;
      }

      .wb-header {
        background: #0B0E14;
        padding: 16px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #1E2330;
      }

      .wb-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .wb-header-buttons {
        display: flex;
        gap: 8px;
      }

      .wb-header button {
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

      .wb-header button:hover {
        color: white;
      }

      .wb-header button svg {
        width: 20px;
        height: 20px;
      }

      .wb-boss-info {
        padding: 12px 16px;
        background: #1E2330;
        border-bottom: 1px solid #2A3041;
      }

      .wb-boss-name {
        font-size: 1rem;
        font-weight: 600;
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .wb-boss-details {
        font-size: 0.8rem;
        color: #9ca3af;
        margin-top: 6px;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .wb-boss-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .wb-boss-status.queuing {
        background: #10b981;
        color: white;
      }

      .wb-boss-status.scheduled {
        background: #f59e0b;
        color: white;
      }

      .wb-boss-status.none {
        background: #6b7280;
        color: white;
      }

      .wb-content {
        padding: 12px 16px;
        overflow-y: auto;
        max-height: 350px;
      }

      .wb-content::-webkit-scrollbar {
        width: 8px;
      }

      .wb-content::-webkit-scrollbar-track {
        background: #1E2330;
        border-radius: 4px;
      }

      .wb-content::-webkit-scrollbar-thumb {
        background: #2A3041;
        border-radius: 4px;
      }

      .wb-join-all-btn {
        width: 100%;
        padding: 10px;
        margin-bottom: 12px;
        background: #4f46e5;
        border: none;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .wb-join-all-btn:hover {
        background: #4338ca;
        transform: translateY(-1px);
      }

      .wb-join-all-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .wb-character {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #1E2330;
        border: 1px solid #2A3041;
        border-radius: 6px;
        margin-bottom: 8px;
        transition: all 0.2s;
      }

      .wb-character:hover {
        border-color: #4f46e5;
        background: #252B3B;
      }

      .wb-character:last-child {
        margin-bottom: 0;
      }

      .wb-char-pfp {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      .wb-char-info {
        flex: 1;
        min-width: 0;
      }

      .wb-char-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .wb-char-class {
        font-size: 0.75rem;
        color: #9ca3af;
      }

      .wb-char-status {
        font-size: 0.7rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 500;
      }

      .wb-char-status.pending {
        background: #374151;
        color: #9ca3af;
      }

      .wb-char-status.joining {
        background: #3b82f6;
        color: white;
      }

      .wb-char-status.joined {
        background: #10b981;
        color: white;
      }

      .wb-char-status.error {
        background: #ef4444;
        color: white;
      }

      .wb-join-btn {
        padding: 6px 14px;
        background: #4f46e5;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .wb-join-btn:hover {
        background: #4338ca;
      }

      .wb-join-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .wb-no-data {
        text-align: center;
        padding: 30px 20px;
        color: #9ca3af;
      }

      .wb-no-data div {
        font-size: 40px;
        margin-bottom: 10px;
      }

      .wb-notification {
        position: fixed;
        right: 20px;
        min-width: 300px;
        max-width: 380px;
        padding: 14px 18px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        font-weight: 500;
        font-size: 13px;
        z-index: 999999;
        transition: all 0.3s ease;
        animation: wbSlideInRight 0.3s ease;
      }

      @keyframes wbSlideInRight {
        from {
          opacity: 0;
          transform: translateX(400px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .wb-notification-info {
        background: #3b82f6;
        color: white;
        border-left: 4px solid #2563eb;
      }

      .wb-notification-success {
        background: #10b981;
        color: white;
        border-left: 4px solid #059669;
      }

      .wb-notification-error {
        background: #ef4444;
        color: white;
        border-left: 4px solid #dc2626;
      }

      @media (max-width: 768px) {
        #wb-toggle {
          bottom: 160px;
          right: 15px;
          width: 50px;
          height: 50px;
        }

        #wb-panel {
          bottom: 220px;
          right: 10px;
          left: 10px;
          width: auto;
          max-width: calc(100vw - 20px);
        }
      }
    `;
    document.head.appendChild(style);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'wb-toggle';
    toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>';
    toggleBtn.title = 'World Boss Queue';
    document.body.appendChild(toggleBtn);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'wb-panel';
    panel.innerHTML = `
      <div class="wb-header">
        <h3>World Boss Queue</h3>
        <div class="wb-header-buttons">
          <button id="wb-refresh-btn" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button id="wb-close-btn" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="wb-boss-info" id="wb-boss-info">
        <div class="wb-boss-name">Loading...</div>
      </div>
      <div class="wb-content" id="wb-content">
        <div class="wb-no-data">
          <div>Loading...</div>
          <p>Fetching character data...</p>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('visible');
      if (panel.classList.contains('visible')) {
        refreshBossInfo();
      }
    });

    document.getElementById('wb-close-btn').addEventListener('click', () => {
      panel.classList.remove('visible');
    });

    document.getElementById('wb-refresh-btn').addEventListener('click', async () => {
      // Reset all statuses
      WBData.characterStatuses = {};
      await loadData();
    });
  }

  function updatePanel() {
    const bossInfoEl = document.getElementById('wb-boss-info');
    const contentEl = document.getElementById('wb-content');
    
    if (!bossInfoEl || !contentEl) return;

    // Update boss info
    const boss = WBData.currentBoss;
    if (boss) {
      const statusClass = boss.status === 'queuing' ? 'queuing' : 'scheduled';
      bossInfoEl.innerHTML = `
        <div class="wb-boss-name">
          <img src="${boss.boss.image_url}" style="width: 32px; height: 32px; border-radius: 4px;">
          ${boss.boss.name}
          <span class="wb-boss-status ${statusClass}">${boss.status}</span>
        </div>
        <div class="wb-boss-details">
          <span>Lv.${boss.boss.level}</span>
          <span>${boss.boss.location}</span>
          <span>Queue: ${boss.queue_count}</span>
          <span>${boss.time_until_spawn}</span>
        </div>
      `;
    } else {
      bossInfoEl.innerHTML = `
        <div class="wb-boss-name">
          <span class="wb-boss-status none">No Boss</span>
          No World Boss scheduled
        </div>
      `;
    }

    // Update character list
    if (WBData.characters.length === 0) {
      contentEl.innerHTML = `
        <div class="wb-no-data">
          <div>Loading...</div>
          <p>Navigate in the game to load characters</p>
        </div>
      `;
      return;
    }

    const canJoin = boss && boss.status === 'queuing';

    let html = '';

    // Join All button
    if (canJoin) {
      html += `
        <button class="wb-join-all-btn" onclick="window.wbJoinAll()" ${!canJoin ? 'disabled' : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Join All Characters
        </button>
      `;
    }

    // Character list
    WBData.characters.forEach(char => {
      const status = WBData.characterStatuses[char.id] || 'pending';
      const portraitUrl = char.pfp || WBData.portraitImages[char.name] || '';
      
      const statusLabels = {
        pending: 'Ready',
        joining: 'Joining...',
        joined: 'Joined!',
        error: 'Error'
      };

      const isJoining = status === 'joining';
      const isJoined = status === 'joined';
      const btnDisabled = !canJoin || isJoining || isJoined;

      html += `
        <div class="wb-character">
          ${portraitUrl ? `<img src="${portraitUrl}" class="wb-char-pfp">` : '<span style="font-size: 28px;">🎮</span>'}
          <div class="wb-char-info">
            <div class="wb-char-name">${char.name}</div>
            <div class="wb-char-class">${char.class}</div>
          </div>
          <span class="wb-char-status ${status}">${statusLabels[status]}</span>
          <button class="wb-join-btn" onclick="window.wbJoinChar('${char.id}', '${char.name}')" ${btnDisabled ? 'disabled' : ''}>
            ${isJoined ? 'Done' : 'Join'}
          </button>
        </div>
      `;
    });

    contentEl.innerHTML = html;
  }

  // ============================================
  // GLOBAL FUNCTIONS
  // ============================================
  window.wbJoinChar = function(charId, charName) {
    joinWBForCharacter(charId, charName);
  };

  window.wbJoinAll = function() {
    joinAllCharacters();
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  TokenManager.onTokenCaptured = async () => {
    setTimeout(async () => {
      await loadData();
    }, 500);
  };

  setTimeout(() => {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('World Boss Queue v1.1 Loaded!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Click the red button to open the World Boss panel');
    console.log('Waiting for token capture...');
    console.log('═══════════════════════════════════════════════════════\n');

    createUI();

    if (TokenManager.isReady()) {
      loadData();
    }
  }, 500);

})();
