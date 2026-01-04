// ==UserScript==
// @name         DegenIdle DPS Display
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Display DPS in combat character cards with mobile overlay support + World Boss & Guild Boss DPS tracker
// @match        https://degenidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557891/DegenIdle%20DPS%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/557891/DegenIdle%20DPS%20Display.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const API_ROOT = "https://api-v1.degenidle.com/api/";

  let state = {
    characterId: null,
    inCombat: false,
    combatData: null,
    personalDPS: 0,
    overlayCollapsed: false,
    // World Boss / Guild Boss state
    worldBoss: {
      active: false,
      type: null,  // 'world' ou 'guild'
      spawnId: null,
      characterName: null,
      stats: null,
      bossHp: null,
      bossMaxHp: null,
      bossPercentage: null,
      lastUpdate: 0,
      finished: false,
      dismissed: false
    },
    wbOverlayCollapsed: false
  };

  // === UTILITY ===
  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toLocaleString('en-US');
  }

  function isMobile() {
    // Detect mobile via width OR touch capability (for "Desktop site" mode on phones)
    return window.innerWidth < 768 || 
           ('ontouchstart' in window && window.innerWidth < 1200) ||
           (navigator.maxTouchPoints > 0 && window.innerWidth < 1200);
  }

  function isOnCombatPage() {
    return window.location.pathname === '/skills/view/combat';
  }

  function shouldShowOverlay() {
    if (!state.inCombat) return false;
    // Show overlay on mobile OR if HTML injection failed (fallback for desktop site mode)
    if (isMobile()) {
      return isOnCombatPage();
    }
    // Desktop: check if HTML injection is working, otherwise show overlay as fallback
    const hasInjectedDPS = document.querySelector('[data-dps-inject]');
    return isOnCombatPage() && !hasInjectedDPS;
  }

  function calculateDPS(damage, duration) {
    return duration > 0 ? damage / duration : 0;
  }

  function calculateParticipantDuration(joinedAt) {
    return (Date.now() - joinedAt) / 1000;
  }

  // === API HANDLER ===
  function handleApiResponse(url, json) {
    // Idle Combat handler
    if (url.includes('/idle-combat/status/')) {
      const charIdMatch = url.match(/\/idle-combat\/status\/([a-f0-9-]{36})/);
      if (charIdMatch) state.characterId = charIdMatch[1];

      if (json.success && json.data) {
        state.inCombat = json.data.in_combat;
        state.combatData = json.data;

        if (json.data.participant_stats && json.data.participant_duration > 0) {
          state.personalDPS = json.data.participant_stats.damage_dealt / json.data.participant_duration;
        }
      }
      return;
    }

    // World Boss participant handler
    const wbParticipantMatch = url.match(/\/worldboss\/participant\/([a-f0-9-]+)\/([a-f0-9-]+)/);
    if (wbParticipantMatch && json.success && json.data) {
      const data = json.data;
      const newSpawnId = wbParticipantMatch[1];
      
      // Reset if new boss spawn
      if (state.worldBoss.spawnId !== newSpawnId) {
        state.worldBoss.finished = false;
        state.worldBoss.dismissed = false;
      }
      
      state.worldBoss.active = true;
      state.worldBoss.type = 'world';
      state.worldBoss.spawnId = newSpawnId;
      state.worldBoss.characterName = data.characterName;
      state.worldBoss.stats = data.combatStats;
      state.worldBoss.lastUpdate = Date.now();
      return;
    }

    // World Boss HP handler
    const wbHpMatch = url.match(/\/worldboss\/hp\/([a-f0-9-]+)/);
    if (wbHpMatch && json.success && json.data) {
      const data = json.data;
      state.worldBoss.bossHp = data.current_hp;
      state.worldBoss.bossMaxHp = data.max_hp;
      state.worldBoss.bossPercentage = data.percentage;
      state.worldBoss.lastUpdate = Date.now();
      
      // Detect boss finished (status not active or HP <= 0)
      if (data.status !== 'active' || data.current_hp <= 0) {
        state.worldBoss.active = false;
        state.worldBoss.finished = true;
      }
      return;
    }

    // Guild World Boss participant handler
    const guildWbParticipantMatch = url.match(/\/guild-worldboss\/participant\/([a-f0-9-]+)\/([a-f0-9-]+)/);
    if (guildWbParticipantMatch && json.success && json.data) {
      const data = json.data;
      const newSpawnId = guildWbParticipantMatch[1];
      
      // Reset if new boss spawn
      if (state.worldBoss.spawnId !== newSpawnId) {
        state.worldBoss.finished = false;
        state.worldBoss.dismissed = false;
      }
      
      state.worldBoss.active = true;
      state.worldBoss.type = 'guild';
      state.worldBoss.spawnId = newSpawnId;
      state.worldBoss.characterName = data.characterName;
      state.worldBoss.stats = data.combat_stats;  // underscore pour guild
      state.worldBoss.lastUpdate = Date.now();
      return;
    }

    // Guild World Boss HP handler
    const guildWbHpMatch = url.match(/\/guild-worldboss\/hp\/([a-f0-9-]+)/);
    if (guildWbHpMatch && json.success && json.data) {
      const data = json.data;
      state.worldBoss.bossHp = data.current_hp;
      state.worldBoss.bossMaxHp = data.max_hp;
      state.worldBoss.bossPercentage = (data.current_hp / data.max_hp) * 100;  // calculé
      state.worldBoss.lastUpdate = Date.now();
      
      // Detect boss finished (HP <= 0)
      if (data.current_hp <= 0) {
        state.worldBoss.active = false;
        state.worldBoss.finished = true;
      }
      return;
    }
  }

  // === API HOOKS ===
  const _fetch = window.fetch;
  window.fetch = async function(input, init) {
    const resp = await _fetch.apply(this, arguments);
    const url = (typeof input === "string") ? input : (input?.url) || "";
    if (url.startsWith(API_ROOT)) {
      resp.clone().json().then(json => handleApiResponse(url, json)).catch(() => {});
    }
    return resp;
  };

  (function() {
    const XHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const real = new XHR();
      real.addEventListener("readystatechange", function() {
        if (real.readyState === 4 && real.responseURL?.startsWith(API_ROOT)) {
          try { handleApiResponse(real.responseURL, JSON.parse(real.responseText)); } catch(_) {}
        }
      });
      return real;
    };
  })();

  // === DPS INJECTION ===
  function getDPSForCharacter(characterName) {
    if (!characterName || !state.combatData) return null;
    const data = state.combatData;

    // Check if player's character
    const myLog = data.combat_log?.participants?.[state.characterId];
    if (characterName === myLog?.character_name) return state.personalDPS;

    // Check group members
    for (const p of data.session_stats?.other_participants || []) {
      if (p.character_name === characterName) {
        const pLog = data.combat_log?.participants?.[p.character_id];
        if (pLog) {
          const duration = pLog.joined_at ? calculateParticipantDuration(pLog.joined_at) : 0;
          return calculateDPS(pLog.combat_stats?.damage_dealt || 0, duration);
        }
      }
    }
    return null;
  }

  function injectDPS() {
    if (!state.inCombat || !state.combatData) return;

    document.querySelectorAll('.bg-\\[\\#2A3041\\].p-2.rounded-lg.overflow-hidden.relative.border.transition-all').forEach(card => {
      const statsGrid = card.querySelector('.grid.grid-cols-3.gap-x-2.gap-y-1.text-xs.relative.z-10');
      if (!statsGrid) return;

      const characterName = card.querySelector('.font-semibold.text-white.truncate')?.textContent?.trim();
      const dps = getDPSForCharacter(characterName);
      if (dps === null) return;

      const existing = statsGrid.querySelector('[data-dps-inject]');
      if (existing) {
        existing.querySelector('.dps-val').textContent = formatNumber(dps);
        return;
      }

      const el = document.createElement('div');
      el.className = 'flex items-center gap-1';
      el.setAttribute('data-dps-inject', 'true');
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame w-3 h-3 text-purple-400">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
        <span class="text-purple-300 font-medium"><span class="dps-val">${formatNumber(dps)}</span> DPS</span>
      `;
      statsGrid.insertBefore(el, statsGrid.firstChild);
    });
  }

  // === DPS OVERLAY ===
  function getAllDPS() {
    if (!state.combatData) return [];
    const data = state.combatData;
    const results = [];

    // Player's character
    const myLog = data.combat_log?.participants?.[state.characterId];
    if (myLog) {
      results.push({
        name: myLog.character_name,
        dps: state.personalDPS,
        isPlayer: true
      });
    }

    // Group members
    for (const p of data.session_stats?.other_participants || []) {
      const pLog = data.combat_log?.participants?.[p.character_id];
      if (pLog) {
        const duration = pLog.joined_at ? calculateParticipantDuration(pLog.joined_at) : 0;
        const dps = calculateDPS(pLog.combat_stats?.damage_dealt || 0, duration);
        results.push({
          name: p.character_name,
          dps: dps,
          isPlayer: false
        });
      }
    }

    // Sort by DPS descending
    return results.sort((a, b) => b.dps - a.dps);
  }

  function createOverlay() {
    let overlay = document.getElementById('dps-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'dps-overlay';
    overlay.innerHTML = `
      <style>
        #dps-overlay {
          position: fixed;
          bottom: 16px;
          left: 16px;
          background: #2A3041;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12px;
          color: white;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        #dps-overlay-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          cursor: pointer;
          user-select: none;
        }
        #dps-overlay-header:hover {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
        }
        #dps-overlay-content {
          padding: 0 12px 8px 12px;
          overflow: hidden;
          transition: max-height 0.2s ease, opacity 0.2s ease;
        }
        #dps-overlay.collapsed #dps-overlay-content {
          max-height: 0;
          padding: 0 12px;
          opacity: 0;
        }
        #dps-overlay.collapsed #dps-overlay-header {
          border-radius: 8px;
        }
        #dps-overlay-chevron {
          transition: transform 0.2s ease;
        }
        #dps-overlay.collapsed #dps-overlay-chevron {
          transform: rotate(180deg);
        }
        .dps-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 3px 0;
        }
        .dps-name {
          color: rgba(255,255,255,0.7);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dps-name.player {
          color: #a78bfa;
        }
        .dps-value {
          color: #c4b5fd;
          font-weight: 500;
        }
      </style>
      <div id="dps-overlay-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
        <span style="font-weight: 500;">DPS</span>
        <svg id="dps-overlay-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </div>
      <div id="dps-overlay-content"></div>
    `;

    overlay.querySelector('#dps-overlay-header').addEventListener('click', () => {
      state.overlayCollapsed = !state.overlayCollapsed;
      overlay.classList.toggle('collapsed', state.overlayCollapsed);
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function updateOverlay() {
    const overlay = document.getElementById('dps-overlay');
    
    if (!shouldShowOverlay()) {
      if (overlay) overlay.style.display = 'none';
      return;
    }

    const el = overlay || createOverlay();
    el.style.display = 'block';

    const content = el.querySelector('#dps-overlay-content');
    const allDPS = getAllDPS();

    if (allDPS.length === 0) {
      content.innerHTML = '<div style="color: rgba(255,255,255,0.5); padding: 4px 0;">No data</div>';
      return;
    }

    content.innerHTML = allDPS.map(p => `
      <div class="dps-row">
        <span class="dps-name ${p.isPlayer ? 'player' : ''}">${p.name}</span>
        <span class="dps-value">${formatNumber(p.dps)}</span>
      </div>
    `).join('');
  }

  // === WORLD BOSS OVERLAY ===
  function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  function createWBOverlay() {
    let overlay = document.getElementById('wb-dps-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'wb-dps-overlay';
    overlay.innerHTML = `
      <style>
        #wb-dps-overlay {
          position: fixed;
          bottom: 16px;
          left: 16px;
          background: #2A3041;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12px;
          color: white;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          min-width: 180px;
        }
        #wb-dps-overlay-header {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          cursor: pointer;
          user-select: none;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        #wb-dps-overlay-header:hover {
          background: rgba(255,255,255,0.05);
          border-radius: 8px 8px 0 0;
        }
        #wb-dps-overlay-content {
          padding: 8px 12px;
          overflow: hidden;
          transition: max-height 0.2s ease, opacity 0.2s ease;
        }
        #wb-dps-overlay.collapsed #wb-dps-overlay-content {
          max-height: 0;
          padding: 0 12px;
          opacity: 0;
        }
        #wb-dps-overlay.collapsed #wb-dps-overlay-header {
          border-radius: 8px;
          border-bottom: none;
        }
        #wb-dps-overlay-chevron {
          transition: transform 0.2s ease;
        }
        #wb-dps-overlay.collapsed #wb-dps-overlay-chevron {
          transform: rotate(180deg);
        }
        #wb-dps-overlay-close {
          margin-left: auto;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s ease;
          padding: 2px;
        }
        #wb-dps-overlay-close:hover {
          opacity: 1;
        }
        .wb-finished-badge {
          color: #4ade80;
          font-size: 10px;
          margin-left: 4px;
        }
        .wb-char-name {
          color: #a78bfa;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .wb-stat-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }
        .wb-stat-label {
          color: rgba(255,255,255,0.6);
        }
        .wb-stat-value {
          color: #c4b5fd;
          font-weight: 500;
        }
        .wb-stat-value.boss-hp {
          color: #f87171;
        }
      </style>
      <div id="wb-dps-overlay-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 9h.01"></path>
          <path d="M15 9h.01"></path>
          <path d="M8 13a4 4 0 0 0 8 0"></path>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.5 0 1-.04 1.5-.12a8.5 8.5 0 0 1-1.5-3.88c0-4.7 3.8-8.5 8.5-8.5.5 0 1 .04 1.5.12C21.96 4.5 17.5 2 12 2"></path>
        </svg>
        <span id="wb-dps-overlay-title" style="font-weight: 500;">World Boss</span>
        <svg id="wb-dps-overlay-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
        <div id="wb-dps-overlay-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
      <div id="wb-dps-overlay-content"></div>
    `;

    overlay.querySelector('#wb-dps-overlay-header').addEventListener('click', (e) => {
      // Don't toggle if clicking the close button
      if (e.target.closest('#wb-dps-overlay-close')) return;
      state.wbOverlayCollapsed = !state.wbOverlayCollapsed;
      overlay.classList.toggle('collapsed', state.wbOverlayCollapsed);
    });
    
    overlay.querySelector('#wb-dps-overlay-close').addEventListener('click', (e) => {
      e.stopPropagation();
      state.worldBoss.dismissed = true;
      overlay.style.display = 'none';
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function updateWBOverlay() {
    const overlay = document.getElementById('wb-dps-overlay');
    const wb = state.worldBoss;

    // Hide if dismissed by user or no stats available
    if (wb.dismissed || !wb.stats) {
      if (overlay) overlay.style.display = 'none';
      return;
    }
    
    // Hide if not active and not finished (no data to show)
    if (!wb.active && !wb.finished) {
      if (overlay) overlay.style.display = 'none';
      return;
    }

    const el = overlay || createWBOverlay();
    el.style.display = 'block';

    // Update title dynamically with finished badge
    const title = el.querySelector('#wb-dps-overlay-title');
    if (title) {
      const bossType = wb.type === 'guild' ? 'Guild Boss' : 'World Boss';
      const finishedBadge = wb.finished ? '<span class="wb-finished-badge">- Finished</span>' : '';
      title.innerHTML = `${bossType}${finishedBadge}`;
    }

    const content = el.querySelector('#wb-dps-overlay-content');
    const stats = wb.stats;
    const durationSec = stats.totalCombatDuration / 1000;

    const dps = durationSec > 0 ? stats.damageDealt / durationSec : 0;
    const dtps = durationSec > 0 ? stats.damageTaken / durationSec : 0;
    const hps = durationSec > 0 ? stats.healthRecovered / durationSec : 0;

    content.innerHTML = `
      <div class="wb-char-name">${wb.characterName || 'Unknown'}</div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">DPS</span>
        <span class="wb-stat-value">${formatNumber(dps)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Total Damage</span>
        <span class="wb-stat-value">${formatNumber(stats.damageDealt)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Total Duration</span>
        <span class="wb-stat-value">${formatDuration(stats.totalCombatDuration)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Dmg Taken/s</span>
        <span class="wb-stat-value">${formatNumber(dtps)}</span>
      </div>
      <div class="wb-stat-row">
        <span class="wb-stat-label">Heal/s</span>
        <span class="wb-stat-value">${formatNumber(hps)}</span>
      </div>
      ${wb.bossPercentage !== null ? `
      <div class="wb-stat-row">
        <span class="wb-stat-label">Boss HP</span>
        <span class="wb-stat-value boss-hp">${wb.bossPercentage.toFixed(1)}%</span>
      </div>
      ` : ''}
    `;
  }

  // === INIT ===
  setInterval(injectDPS, 250);
  setInterval(updateOverlay, 500);
  setInterval(updateWBOverlay, 500);
  console.log('[DegenIdle] DPS Display v1.3 loaded');
})();
