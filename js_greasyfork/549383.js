// ==UserScript==
// @name         Ui - Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ui-Addon
// @author       l3v2s
// @match        https://demonicscans.org/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549383/Ui%20-%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/549383/Ui%20-%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Automatic retrieval of userId from cookie
    function getCookieExtension(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const userId = getCookieExtension('demon');
    if(!userId){
      // Not logged in
      console.log('Not logged in')
    }

    var alarmInterval = null;
    var monsterFiltersSettings = {"hideDead":true,"nameFilter":"","hideImg":false, "monsterAlarm":false,"battleLimitAlarm":false}

    // Settings management
    var extensionSettings = {
      sidebarColor: '#1e1e2e',
      backgroundColor: '#000000',
      statAllocationCollapsed: true,
      statsExpanded: false,
      petsExpanded: false,
      blacksmithExpanded: false
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
      '/blacksmith.php': initBlacksmithMods,
    };

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

    //#region Monster filters
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
      // Create filter controls
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

      // Add filter HTML
      filterContainer.innerHTML = `
        <input type="text" id="monster-name-filter" placeholder="Filter by name"
               style="padding: 5px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px;">
        <label style="display: flex; align-items: center; gap: 5px; color: #cdd6f4;">
          <input type="checkbox" id="hide-dead-monsters">
          Hide defeated
        </label>
        <label style="display: flex; align-items: center; gap: 5px; color: #cdd6f4;">
          <input type="checkbox" id="hide-img-monsters">
          Hide images
        </label>
        <label style="display: flex; align-items: center; gap: 5px; color: #cdd6f4;">
          <input type="checkbox" id="monster-alarm">
          Monster alarm
        </label>
        <label style="display: flex; align-items: center; gap: 5px; color: #cdd6f4;">
          <input type="checkbox" id="battle-limit-alarm">
          Battle limit alarm
        </label>
      `;

      // Insert before the monster list
      const contentArea = document.querySelector('.content-area');
      const monsterContainer = document.querySelector('.monster-container');
      if (contentArea && monsterContainer) {
        contentArea.insertBefore(filterContainer, monsterContainer);
      }

      // Add event listeners
      document.getElementById('monster-name-filter').addEventListener('input', applyMonsterFilters);
      document.getElementById('hide-dead-monsters').addEventListener('change', applyMonsterFilters);
      document.getElementById('hide-img-monsters').addEventListener('change', applyMonsterFilters);
      document.getElementById('monster-alarm').addEventListener('change', applyMonsterFilters);
      document.getElementById('battle-limit-alarm').addEventListener('change', applyMonsterFilters);

      // Apply saved settings
      if (settings.nameFilter) {
        document.getElementById('monster-name-filter').value = settings.nameFilter;
      }
      if (settings.hideDead) {
        document.getElementById('hide-dead-monsters').checked = settings.hideDead;
      }
      if (settings.hideImg) {
        document.getElementById('hide-img-monsters').checked = settings.hideImg;
      }
      if (settings.monsterAlarm) {
        document.getElementById('monster-alarm').checked = settings.monsterAlarm;
      }
      if (settings.battleLimitAlarm) {
        document.getElementById('battle-limit-alarm').checked = settings.battleLimitAlarm;
      }

      // Apply filters immediately if settings exist
      if (settings.nameFilter || settings.hideDead || settings.hideImg || settings.monsterAlarm || settings.battleLimitAlarm) {
        applyMonsterFilters();
      }
    }

    function applyMonsterFilters() {
      const nameFilter = document.getElementById('monster-name-filter').value.toLowerCase();
      const hideDead = document.getElementById('hide-dead-monsters').checked;
      const hideImg = document.getElementById('hide-img-monsters').checked;
      const monsterAlarm = document.getElementById('monster-alarm').checked;
      const battleLimitAlarm = document.getElementById('battle-limit-alarm').checked;

      if (monsterAlarm || battleLimitAlarm) {
        alarmInterval = setInterval(() => {
          location.reload();
        }, 5000);
      } else {
        clearInterval(alarmInterval);
      }

      const monsters = document.querySelectorAll('.monster-card');
      var limitBattleCount = 0;

      monsters.forEach(monster => {
        const monsterName = monster.querySelector('h3').textContent.toLowerCase();
        const monsterImg = monster.querySelector('img');
        const isDead = monsterImg && monsterImg.classList.contains('grayscale');
        const hasLoot = monster.innerText.includes("Loot");

        const nameMatch = monsterName.includes(nameFilter);
        const shouldHideDead = hideDead && isDead && !hasLoot;

        // Hide images
        if (hideImg && monsterImg) {
          monsterImg.style.display = 'none';
        } else if (monsterImg) {
          monsterImg.style.removeProperty('display');
        }

        if (monster.innerText.includes('Continue the Battle')) {
          limitBattleCount++;
        }

        // Name filter + dead filter
        if ((nameFilter && !nameMatch) || shouldHideDead) {
          monster.style.display = 'none';
        } else {
          monster.style.display = '';

          // Alarm when alive and still not in battle
          if (monsterAlarm) {
            if (!monster.innerText.includes('❤️ 0 / ') && !monster.innerText.includes('Continue the Battle')) {
              // Play sound through notification
              showNotification('🔔 Monster available for battle!', 'success');
            }
          }
        }
      });

      // If found less than 3 ongoing battles run the alarm
      if (battleLimitAlarm && limitBattleCount < 3) {
        showNotification('🔔 Battle limit alarm: Less than 3 battles!', 'success');
      }

      // Save filter settings
      const settings = {
        nameFilter: document.getElementById('monster-name-filter').value,
        hideDead: document.getElementById('hide-dead-monsters').checked,
        hideImg: document.getElementById('hide-img-monsters').checked,
        monsterAlarm: document.getElementById('monster-alarm').checked,
        battleLimitAlarm: document.getElementById('battle-limit-alarm').checked
      };
      localStorage.setItem('demonGameFilterSettings', JSON.stringify(settings));
    }
    //#endregion

    //#region Loot in wave page
    function initInstaLoot(){
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

        var notif = document.createElement('div');
        notif.style = `position: fixed; top: 50vh; right: 40vw;background: #2ecc71;color: white;padding: 12px 20px;border-radius: 10px;box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);font-size: 15px;display: none;z-index: 9999;`;
        notif.id = "notification";

        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
          contentArea.appendChild(modal.firstElementChild);
          contentArea.appendChild(notif);
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
          // Automatically navigate to battle page
          setTimeout(() => {
            window.location.href = originalLink.href;
          }, 1000);
        }
      })
      .catch(() => showNotification('Server error. Please try again.', 'error'));
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

    function showNotification(msg, type = 'success') {
      const note = document.getElementById('notification');
      if (note) {
        note.innerHTML = msg;
        note.style.background = type === 'error' ? '#e74c3c' : '#2ecc71';
        note.style.display = 'block';
        setTimeout(() => {
            note.style.display = 'none';
        }, 3000);
      }
    }
    //#endregion

    //#region Gate info collapsed
    function initGateCollapse() {
      const gateInfo = document.querySelector('.gate-info');
      if (!gateInfo) return;

      const header = gateInfo.querySelector('.gate-info-header');
      const scrollContent = gateInfo.querySelector('.gate-info-scroll');

      if (!header || !scrollContent) return;

      header.classList.add('collapsible-header');
      scrollContent.classList.add('collapsible-content');
      scrollContent.classList.toggle('collapsed');

      // Add CSS for collapsible content
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
    //#endregion

    function initContinueBattleFirst(){
      const monsterContainer = document.querySelector('.monster-container');
      if (!monsterContainer) return;

      document.querySelectorAll('.monster-card').forEach(x => {
        if (x.innerText.includes('Continue the Battle')) {
          monsterContainer.prepend(x);
        }
      });
    }

    // Improved wave buttons - separate Join Battle and View options
    function initImprovedWaveButtons() {
      document.querySelectorAll('.monster-card > a').forEach(battleLink => {
        if (battleLink.innerText.includes('Join the Battle')) {
          const monsterId = battleLink.href.split("id=")[1];

          // Create buttons container
          const buttonContainer = document.createElement('div');
          buttonContainer.style.cssText = 'display: flex; gap: 8px; margin-top: 8px;';

          // Join Battle button (instant join)
          const joinBtn = document.createElement('button');
          joinBtn.className = "join-btn";
          joinBtn.style.cssText = 'flex: 1; font-size: 12px;';
          joinBtn.innerText = "⚔️ Join Battle";
          joinBtn.onclick = function() {
            joinWaveInstant(monsterId, battleLink);
          };

          // View button (just navigate)
          const viewBtn = document.createElement('button');
          viewBtn.className = "join-btn";
          viewBtn.style.cssText = 'flex: 1; font-size: 12px; background: #6c7086;';
          viewBtn.innerText = "👁️ View";
          viewBtn.onclick = function() {
            window.location.href = battleLink.href;
          };

          buttonContainer.appendChild(joinBtn);
          buttonContainer.appendChild(viewBtn);

          // Replace the original link with our buttons
          battleLink.style.display = 'none';
          battleLink.parentNode.appendChild(buttonContainer);
        }
      });
    }

    // Monster sorting functionality
    function initMonsterSorting() {
      const monsterContainer = document.querySelector('.monster-container');
      if (!monsterContainer) return;

      // Create containers for sorted monsters
      const continueBattleContainer = document.createElement('div');
      continueBattleContainer.innerHTML = '<h3 style="color: #f38ba8; margin: 20px 0 10px 0;">⚔️ Continue Battle</h3>';
      continueBattleContainer.style.cssText = 'margin-bottom: 30px;';

      const joinBattleContainer = document.createElement('div');
      joinBattleContainer.innerHTML = '<h3 style="color: #a6e3a1; margin: 20px 0 10px 0;">🆕 Join a Battle</h3>';

      const continueBattleGrid = document.createElement('div');
      continueBattleGrid.className = 'monster-container';
      continueBattleGrid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;';

      const joinBattleGrid = document.createElement('div');
      joinBattleGrid.className = 'monster-container';
      joinBattleGrid.style.cssText = 'display: flex; flex-wrap: wrap; gap: 15px;';

      // Get all monster cards and sort them
      const monsterCards = Array.from(document.querySelectorAll('.monster-card'));
      const continueCards = [];
      const joinCards = [];

      monsterCards.forEach(card => {
        if (card.innerText.includes('Continue the Battle')) {
          continueCards.push(card);
        } else {
          // Extract HP for sorting
          const hpText = card.querySelector('div[style*="width:"]')?.parentNode?.nextElementSibling?.textContent || '';
          const hpMatch = hpText.match(/❤️\s*([\d,]+)\s*\/\s*([\d,]+)\s*HP/);
          if (hpMatch) {
            const currentHp = parseInt(hpMatch[1].replace(/,/g, ''));
            card.dataset.currentHp = currentHp;
          }
          joinCards.push(card);
        }
      });

      // Sort join cards by health (lowest first)
      joinCards.sort((a, b) => {
        const hpA = parseInt(a.dataset.currentHp) || 0;
        const hpB = parseInt(b.dataset.currentHp) || 0;
        return hpA - hpB;
      });

      // Clear original container and add sorted sections
      monsterContainer.innerHTML = '';

      if (continueCards.length > 0) {
        continueBattleContainer.appendChild(continueBattleGrid);
        continueCards.forEach(card => continueBattleGrid.appendChild(card));
        monsterContainer.appendChild(continueBattleContainer);
      }

      if (joinCards.length > 0) {
        joinBattleContainer.appendChild(joinBattleGrid);
        joinCards.forEach(card => joinBattleGrid.appendChild(card));
        monsterContainer.appendChild(joinBattleContainer);
      }
    }

    function initReducedImageSize(){
      const monsterImage = document.getElementById('monsterImage');
      const panel = document.querySelector('.content-area > .panel');
      const hpBar = document.querySelector('.hp-bar');

      if (monsterImage) {
        monsterImage.style.maxHeight = "400px";
      }
      if (panel) {
        panel.style.justifyItems = "center";
        panel.style.textAlign = "center";
      }
      if (hpBar) {
        hpBar.style.justifySelf = "normal";
      }
    }

    function initPossibleLootReached(){
      // TODO: Implementation for loot tracking
    }

    function initTotalOwnDamage(){
      colorMyself();
      const observer = new MutationObserver((mutations) => {
        const shouldUpdate = mutations.some(mutation =>
          mutation.type === 'childList' && mutation.addedNodes.length > 0
        );

        if (shouldUpdate) {
          setTimeout(colorMyself, 50);
        }
      });

      const config = {
        childList: true,
        subtree: true
      };

      const targetElement = document.querySelector('.leaderboard-panel');
      if (targetElement) {
        observer.observe(targetElement, config);
      }
    }

    function colorMyself(){
      document.querySelectorAll('.lb-row a').forEach(x => {
        if (x.href.includes(userId)) {
          var lbrow = x.parentElement.parentElement;
          var exDamageDone = lbrow.querySelector('.lb-dmg').innerText;
          var exDamageNumber = Number.parseInt(exDamageDone.replaceAll(',','').replaceAll('.',''));

          // Color leaderboard row
          lbrow.style.backgroundColor = '#7a2020';

          // Update "Your damage"
          document.querySelectorAll("div.stats-stack > span").forEach(x => {
            if (x.innerText.includes('Your Damage: ')) {
              x.innerText = "Your Damage: " + exDamageDone;
            }
          });

          // Update loot requirements
          var lootContainer = document.createElement('div');
          lootContainer.id = 'extension-loot-container';
          lootContainer.style.display = 'ruby';
          lootContainer.style.maxWidth = '50%';

          document.querySelectorAll('.loot-card').forEach(x => lootContainer.append(x));

          var enemyAndLootContainer = document.createElement('div');
          enemyAndLootContainer.id = 'extension-enemy-loot-container';
          enemyAndLootContainer.style.display = 'inline-flex';

          const monsterImage = document.querySelector('.monster_image');
          if (monsterImage) {
            enemyAndLootContainer.append(monsterImage);
          }
          enemyAndLootContainer.append(lootContainer);

          const panel = document.querySelector("body > div.main-wrapper > div > .panel");
          if (panel) {
            panel.prepend(enemyAndLootContainer);
          }

          document.querySelectorAll('.loot-card').forEach(y => {
            y.style.margin = '5px';
            y.querySelectorAll('.loot-stats .chip').forEach(x => {
              if (x.parentElement) {
                x.parentElement.style.gap = '0px';
              }
              if (x.innerText.includes('DMG req')) {
                var lootReqNumber = Number.parseInt(x.innerText.substr(9).replaceAll(',','').replaceAll('.',''));
                if (lootReqNumber <= exDamageNumber) {
                  y.style.background = 'rgb(0 255 30 / 20%)';
                  y.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.6)';
                  try {
                    y.classList.remove('locked');
                    const lockBadge = y.querySelector('.lock-badge');
                    if (lockBadge) {
                      lockBadge.remove();
                    }
                  } catch {}
                }
              }
            });
          });
        }
      });
    }

    function initAnyClickClosesModal(){
      const lootModal = document.getElementById('lootModal');
      if (lootModal) {
        lootModal.addEventListener('click', function(event) {
          this.style.display = 'none';
        });
      }
    }

    // Stat Allocation collapsible section
    function initStatAllocation() {
      const statsContainer = document.querySelector('.grid');
      if (!statsContainer) return;

      // Create stat allocation section
      const statAllocationSection = document.createElement('div');
      statAllocationSection.style.cssText = `
        background: rgba(30, 30, 46, 0.8);
        border: 1px solid #585b70;
        border-radius: 10px;
        margin: 20px 0;
        overflow: hidden;
      `;

      // Header with toggle
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 15px 20px;
        background: rgba(203, 166, 247, 0.1);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        color: #cba6f7;
      `;
      header.innerHTML = `
        <span>📊 Stat Allocation</span>
        <span id="stat-toggle-icon">${extensionSettings.statAllocationCollapsed ? '[+]' : '[–]'}</span>
      `;

      // Content
      const content = document.createElement('div');
      content.id = 'stat-allocation-content';
      content.style.cssText = `
        padding: 20px;
        display: ${extensionSettings.statAllocationCollapsed ? 'none' : 'block'};
      `;

      // Get current stats
      const currentPoints = document.getElementById('v-points')?.textContent || '0';
      const availablePoints = parseInt(currentPoints);

      content.innerHTML = `
        <div style="margin-bottom: 15px; color: #f9e2af; font-weight: bold;">
          Available Points: ${availablePoints}
        </div>
        <div class="stat-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(69, 71, 90, 0.3); border-radius: 8px;">
          <span style="color: #e0e0e0; min-width: 80px;">Strength:</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="stat-btn" onclick="allocateStatPoints('attack', 1)" ${availablePoints < 1 ? 'disabled' : ''}
                    style="background: #a6e3a1; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+1</button>
            <button class="stat-btn" onclick="allocateStatPoints('attack', 5)" ${availablePoints < 5 ? 'disabled' : ''}
                    style="background: #a6e3a1; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+5</button>
          </div>
        </div>
        <div class="stat-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 10px; background: rgba(69, 71, 90, 0.3); border-radius: 8px;">
          <span style="color: #e0e0e0; min-width: 80px;">Agility:</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="stat-btn" onclick="allocateStatPoints('defense', 1)" ${availablePoints < 1 ? 'disabled' : ''}
                    style="background: #74c0fc; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+1</button>
            <button class="stat-btn" onclick="allocateStatPoints('defense', 5)" ${availablePoints < 5 ? 'disabled' : ''}
                    style="background: #74c0fc; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+5</button>
          </div>
        </div>
        <div class="stat-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; background: rgba(69, 71, 90, 0.3); border-radius: 8px;">
          <span style="color: #e0e0e0; min-width: 80px;">Dexterity:</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="stat-btn" onclick="allocateStatPoints('stamina', 1)" ${availablePoints < 1 ? 'disabled' : ''}
                    style="background: #f9e2af; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+1</button>
            <button class="stat-btn" onclick="allocateStatPoints('stamina', 5)" ${availablePoints < 5 ? 'disabled' : ''}
                    style="background: #f9e2af; color: #1e1e2e; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">+5</button>
          </div>
        </div>
      `;

      // Assemble section
      statAllocationSection.appendChild(header);
      statAllocationSection.appendChild(content);

      // Insert after the first card in stats page
      const firstCard = statsContainer.querySelector('.card');
      if (firstCard) {
        firstCard.parentNode.insertBefore(statAllocationSection, firstCard.nextSibling);
      }

      // Toggle functionality
      header.addEventListener('click', () => {
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        document.getElementById('stat-toggle-icon').textContent = isCollapsed ? '[–]' : '[+]';
        extensionSettings.statAllocationCollapsed = !isCollapsed;
        saveSettings();
      });
    }

    // Stat allocation function
    function allocateStatPoints(stat, amount) {
      const currentPoints = parseInt(document.getElementById('v-points')?.textContent || '0');
      if (currentPoints < amount) {
        showNotification('Not enough stat points!', 'error');
        return;
      }

      const body = `action=allocate&stat=${encodeURIComponent(stat)}&amount=${encodeURIComponent(amount)}`;
      fetch('stats_ajax.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      .then(async r => {
        const txt = await r.text();
        try {
          return { okHTTP: r.ok, json: JSON.parse(txt), raw: txt };
        } catch {
          throw new Error(`Bad JSON (${r.status}): ${txt}`);
        }
      })
      .then(pack => {
        if (!pack.okHTTP) {
          showNotification(`HTTP ${pack.raw}`, 'error');
          return;
        }
        const res = pack.json;
        if (!res.ok) {
          showNotification(res.msg || 'Error', 'error');
          return;
        }

        // Update UI
        const u = res.user;
        document.getElementById('v-points').textContent = u.STAT_POINTS;
        document.getElementById('v-attack').textContent = u.ATTACK;
        document.getElementById('v-defense').textContent = u.DEFENSE;
        document.getElementById('v-stamina').textContent = u.STAMINA;

        // Update sidebar stats if they exist
        updateSidebarStats(u);

        showNotification(`Allocated ${amount} points to ${stat}!`, 'success');

        // Refresh stat allocation section
        setTimeout(() => {
          const statSection = document.querySelector('#stat-allocation-content');
          if (statSection) {
            initStatAllocation();
          }
        }, 500);
      })
      .catch(error => {
        showNotification('Failed to allocate stats', 'error');
        console.error('Error:', error);
      });
    }

    // Sidebar stat allocation function
    function sidebarAlloc(stat, amount) {
      const currentPoints = parseInt(document.getElementById('sidebar-points')?.textContent || '0');
      if (currentPoints < amount) {
        showNotification('Not enough stat points!', 'error');
        return;
      }

      const body = `action=allocate&stat=${encodeURIComponent(stat)}&amount=${encodeURIComponent(amount)}`;
      fetch('stats_ajax.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      })
      .then(async r => {
        const txt = await r.text();
        try {
          return { okHTTP: r.ok, json: JSON.parse(txt), raw: txt };
        } catch {
          throw new Error(`Bad JSON (${r.status}): ${txt}`);
        }
      })
      .then(pack => {
        if (!pack.okHTTP) {
          showNotification(`HTTP ${pack.raw}`, 'error');
          return;
        }
        const res = pack.json;
        if (!res.ok) {
          showNotification(res.msg || 'Error', 'error');
          return;
        }

        // Update sidebar stats
        updateSidebarStats(res.user);
        showNotification(`Allocated ${amount} points to ${stat}!`, 'success');
      })
      .catch(error => {
        showNotification('Failed to allocate stats', 'error');
        console.error('Error:', error);
      });
    }

    function initWaveMods() {
      initGateCollapse()
      initMonsterFilter()
      initInstaLoot()
      initContinueBattleFirst()
      initImprovedWaveButtons()
      initMonsterSorting()
    }

    function initPvPMods(){
      initPvPBannerFix()
    }

    function initDashboardTools() {
      console.log("Initializing dashboard tools");
    }

    function initBattleMods(){
      initReducedImageSize()
      initPossibleLootReached()
      initTotalOwnDamage()
      initAnyClickClosesModal()
    }

    function initChatMods(){
        const logEl = document.getElementById("chatLog");
        if (logEl) {
          logEl.scrollTop = logEl.scrollHeight;
        }
    }

    function initInventoryMods(){
      initAlternativeInventoryView()
      initItemTotalDmg()
    }

    function initPetMods(){
      initPetTotalDmg()
      showComingSoon('Pets')
    }

    function initStatMods(){
      initPlayerAtkDamage()
      initStatAllocation()
    }

    function initBlacksmithMods(){
      showComingSoon('Blacksmith')
    }

    // Show "Working on it / Coming Soon" message
    function showComingSoon(section) {
      const contentArea = document.querySelector('.content-area');
      if (contentArea) {
        const comingSoonDiv = document.createElement('div');
        comingSoonDiv.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(30, 30, 46, 0.95);
          border: 2px solid #cba6f7;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          color: #cdd6f4;
          font-size: 18px;
          z-index: 10000;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        `;


        document.getElementById('close-coming-soon').addEventListener('click', () => {
          comingSoonDiv.remove();
        });

        // Auto-remove after 3 seconds
        setTimeout(() => {
          if (comingSoonDiv.parentNode) {
            comingSoonDiv.remove();
          }
        }, 3000);
      }
    }

    // Settings management
    function loadSettings() {
      const saved = localStorage.getItem('demonGameExtensionSettings');
      if (saved) {
        extensionSettings = { ...extensionSettings, ...JSON.parse(saved) };
      }
      applySettings();
    }

    function saveSettings() {
      localStorage.setItem('demonGameExtensionSettings', JSON.stringify(extensionSettings));
    }

    function applySettings() {
      // Apply sidebar color
      const sidebar = document.getElementById('game-sidebar');
      if (sidebar) {
        sidebar.style.background = extensionSettings.sidebarColor;
      }

      // Apply background color
      document.body.style.backgroundColor = extensionSettings.backgroundColor;
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

    function initAlternativeInventoryView(){
      if (!window.location.pathname.includes('inventory.php')) return;

      // Add toggle functionality to the header
      const header = document.querySelector('h1');
      if (header) {
        header.style.cursor = 'pointer';
        header.title = 'Click to toggle between grid and table view';
        const viewIndicator = document.createElement('span');
        viewIndicator.id = 'view-indicator';
        viewIndicator.style.marginLeft = '10px';
        viewIndicator.style.fontSize = '14px';
        viewIndicator.style.color = '#cba6f7';
        header.appendChild(viewIndicator);

        // Load saved view preference
        const savedView = localStorage.getItem('inventoryView') || 'grid';
        viewIndicator.textContent = `[${savedView.toUpperCase()} VIEW]`;

        if (savedView === 'table') {
          convertToTableView();
        }

        header.addEventListener('click', toggleInventoryView);
      }

      function toggleInventoryView() {
        const viewIndicator = document.getElementById('view-indicator');
        const currentView = viewIndicator.textContent.includes('TABLE') ? 'table' : 'grid';
        const newView = currentView === 'table' ? 'grid' : 'table';

        viewIndicator.textContent = `[${newView.toUpperCase()} VIEW]`;
        localStorage.setItem('inventoryView', newView);

        if (newView === 'table') {
          convertToTableView();
        } else {
          convertToGridView();
        }
      }

      function convertToTableView() {
        // Remove any existing tables
        document.querySelectorAll('.inventory-table').forEach(table => table.remove());

        // Process each section
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
          const grid = section.querySelector('.grid');

          if (grid) {
            // Hide the grid
            grid.style.display = 'none';

            // Create table
            const table = document.createElement('table');
            table.className = 'inventory-table';
            table.style.cssText = `
              width: 100%;
              border-collapse: collapse;
              background: rgba(30, 30, 46, 0.8);
              border-radius: 8px;
              overflow: hidden;
              margin-bottom: 20px;
            `;
            table.innerHTML = `
              <thead>
                <tr style="background: rgba(203, 166, 247, 0.2);">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #585b70;">Item</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #585b70;">Details</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #585b70;">Actions</th>
                </tr>
              </thead>
              <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');

            // Process each item
            const items = grid.querySelectorAll('.slot-box');
            items.forEach(item => {
              const row = document.createElement('tr');
              row.style.cssText = 'border-bottom: 1px solid rgba(88, 91, 112, 0.3);';

              // Extract item image
              const img = item.querySelector('img');
              const imgSrc = img ? img.src : '';
              const imgAlt = img ? img.alt : '';

              // Extract item info
              const label = item.querySelector('.label');
              const labelText = label ? label.textContent : '';

              // Extract buttons
              const buttons = item.querySelectorAll('button');

              // Create table cells
              row.innerHTML = `
                <td class="table-item-image" style="padding: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${imgSrc}" alt="${imgAlt}" onerror="this.style.display='none'"
                         style="width: 40px; height: 40px; border-radius: 4px;">
                    <div class="table-item-name" style="color: #e0e0e0;">${imgAlt}</div>
                  </div>
                </td>
                <td class="table-item-details" style="padding: 12px; color: #cdd6f4;">${labelText}</td>
                <td class="table-item-actions" style="padding: 12px;"></td>
              `;

              // Add buttons to actions cell
              const actionsCell = row.querySelector('.table-item-actions');
              buttons.forEach(button => {
                if (!button.classList.contains('info-btn')) {
                  const buttonClone = button.cloneNode(true);
                  buttonClone.style.marginRight = '8px';
                  actionsCell.appendChild(buttonClone);
                }
              });

              // Add info button if exists
              const infoBtn = item.querySelector('.info-btn');
              if (infoBtn) {
                const infoClone = infoBtn.cloneNode(true);
                actionsCell.appendChild(infoClone);
              }

              tbody.appendChild(row);
            });

            // Insert table after the section title
            section.insertBefore(table, grid);
          }
        });
      }

      function convertToGridView() {
        // Remove all tables
        document.querySelectorAll('.inventory-table').forEach(table => table.remove());

        // Show all grids
        document.querySelectorAll('.grid').forEach(grid => {
          grid.style.display = 'flex';
        });
      }
    }

    function initDraggableFalse(){
      document.querySelectorAll('a').forEach(x => x.draggable = false);
      document.querySelectorAll('button').forEach(x => x.draggable = false);
    }

    // Function to update sidebar stats
    function updateSidebarStats(userStats) {
      const sidebarAttack = document.getElementById('sidebar-attack');
      const sidebarDefense = document.getElementById('sidebar-defense');
      const sidebarStamina = document.getElementById('sidebar-stamina');
      const sidebarPoints = document.getElementById('sidebar-points');

      const sidebarAttackExp = document.getElementById('sidebar-attack-exp');
      const sidebarDefenseExp = document.getElementById('sidebar-defense-exp');
      const sidebarStaminaExp = document.getElementById('sidebar-stamina-exp');

      if (sidebarAttack) sidebarAttack.textContent = userStats.ATTACK;
      if (sidebarDefense) sidebarDefense.textContent = userStats.DEFENSE;
      if (sidebarStamina) sidebarStamina.textContent = userStats.STAMINA;
      if (sidebarPoints) sidebarPoints.textContent = userStats.STAT_POINTS;

      if (sidebarAttackExp) sidebarAttackExp.textContent = userStats.ATTACK;
      if (sidebarDefenseExp) sidebarDefenseExp.textContent = userStats.DEFENSE;
      if (sidebarStaminaExp) sidebarStaminaExp.textContent = userStats.STAMINA;
    }

    // Function to fetch current stats and update sidebar
    async function fetchAndUpdateSidebarStats() {
      try {
        const response = await fetch('get_user_stats.php');
        const data = await response.json();
        if (data.ok) {
          updateSidebarStats(data.user);
        }
      } catch (error) {
        // Fallback: try to get stats from page elements
        const attack = document.getElementById('v-attack')?.textContent || '-';
        const defense = document.getElementById('v-defense')?.textContent || '-';
        const stamina = document.getElementById('v-stamina')?.textContent || '-';
        const points = document.getElementById('v-points')?.textContent || '-';

        updateSidebarStats({
          ATTACK: attack,
          DEFENSE: defense,
          STAMINA: stamina,
          STAT_POINTS: points
        });
      }
    }

    function initSideBar(){
      // Create and inject the sidebar and layout structure
      const noContainerPage = !document.querySelector('.container') && !document.querySelector('.wrap');
      const mainWrapper = document.createElement('div');
      mainWrapper.className = 'main-wrapper';

      // Create the sidebar
      const sidebar = document.createElement('aside');
      sidebar.id = 'game-sidebar';
      sidebar.innerHTML = `
        <div class="sidebar-header">
          <a href="game_dash.php" style="text-decoration:none;"><h2>Game Menu</h2></a>
        </div>

        <!-- Stats Section - Compact with Expand Button -->
        <div class="sidebar-section stats-compact">
            <div class="stats-header">
                <div class="stats-basic">
                    <span class="stats-title">📊 My Stats</span>
                    <div class="stats-inline">
                        <span>⚔️<span id="sidebar-attack">-</span></span>
                        <span>🛡️<span id="sidebar-defense">-</span></span>
                        <span>⚡<span id="sidebar-stamina">-</span></span>
                        <span class="points">🔵<span id="sidebar-points">-</span></span>
                    </div>
                </div>
                <button id="stats-expand-btn" class="expand-btn">⚙️</button>
            </div>
            <div id="stats-expanded" class="stats-expanded collapsed">
                <div class="upgrade-section">
                    <div class="stat-upgrade-row">
                        <div class="stat-info">
                            <span>⚔️ Attack:</span>
                            <span id="sidebar-attack-exp">-</span>
                        </div>
                        <div class="upgrade-controls">
                            <button class="upgrade-btn" onclick="sidebarAlloc('attack',1)">+1</button>
                            <button class="upgrade-btn" onclick="sidebarAlloc('attack',5)">+5</button>
                        </div>
                    </div>

                    <div class="stat-upgrade-row">
                        <div class="stat-info">
                            <span>🛡️ Defense:</span>
                            <span id="sidebar-defense-exp">-</span>
                        </div>
                        <div class="upgrade-controls">
                            <button class="upgrade-btn" onclick="sidebarAlloc('defense',1)">+1</button>
                            <button class="upgrade-btn" onclick="sidebarAlloc('defense',5)">+5</button>
                        </div>
                    </div>

                    <div class="stat-upgrade-row">
                        <div class="stat-info">
                            <span>⚡ Stamina:</span>
                            <span id="sidebar-stamina-exp">-</span>
                        </div>
                        <div class="upgrade-controls">
                            <button class="upgrade-btn" onclick="sidebarAlloc('stamina',1)">+1</button>
                            <button class="upgrade-btn" onclick="sidebarAlloc('stamina',5)">+5</button>
                        </div>
                    </div>

                    <div class="upgrade-note">Each point adds +1 to the chosen stat</div>
                </div>
            </div>
        </div>

        <ul class="sidebar-menu">
          <li><a href="pvp.php"><img src="/images/pvp/season_1/compressed_menu_pvp_season_1.webp" alt="PvP Arena"> PvP Arena</a></li>
          <li><a href="orc_cull_event.php"><img src="/images/events/orc_cull/banner.webp" alt="Goblin Feast"> 🪓 ⚔️ War Drums of GRAKTHAR</a></li>
          <li><a href="active_wave.php?gate=3&wave=3"><img src="images/gates/gate_688e438aba7f24.99262397.webp" alt="Gate"> Gate Grakthar</a></li>
          <li><a href="inventory.php"><img src="images/menu/compressed_chest.webp" alt="Inventory"> Inventory & Equipment</a></li>
          <li>
            <div class="sidebar-menu-expandable">
              <a href="pets.php"><img src="images/menu/compressed_eggs_menu.webp" alt="Pets"> Pets & Eggs</a>
              <button class="expand-btn" id="pets-expand-btn">+</button>
            </div>
            <div id="pets-expanded" class="sidebar-submenu collapsed">
              <div class="coming-soon-text">🚧 Working on it / Coming Soon</div>
            </div>
          </li>
          <li><a href="stats.php"><img src="images/menu/compressed_stats_menu.webp" alt="Stats"> Stats</a></li>
          <li>
            <div class="sidebar-menu-expandable">
              <a href="blacksmith.php"><img src="images/menu/compressed_crafting.webp" alt="Blacksmith"> Blacksmith</a>
              <button class="expand-btn" id="blacksmith-expand-btn">+</button>
            </div>
            <div id="blacksmith-expanded" class="sidebar-submenu collapsed">
              <div class="coming-soon-text">🚧 Working on it / Coming Soon</div>
            </div>
          </li>
          <li><a href="merchant.php"><img src="images/menu/compressed_merchant.webp" alt="Merchant"> Merchant</a></li>
          <li><a href="achievements.php"><img src="images/menu/compressed_achievments.webp" alt="Achievements"> Achievements</a></li>
          <li><a href="collections.php"><img src="images/menu/compressed_collections.webp" alt="Collections"> Collections</a></li>
          <li><a href="guide.php"><img src="images/menu/compressed_guide.webp" alt="Guide"> How To Play</a></li>
          <li><a href="weekly.php"><img src="images/menu/weekly_leaderboard.webp" alt="Leaderboard"> Weekly Leaderboard</a></li>
          <li><a href="chat.php"><img src="images/menu/compressed_chat.webp" alt="Chat"> Global Chat</a></li>
          <li><a href="patches.php"><img src="images/menu/compressed_patches.webp" alt="PatchNotes"> Patch Notes</a></li>
          <li><a href="index.php"><img src="images/menu/compressed_manga.webp" alt="Manga"> Manga-Manhwa-Manhua</a></li>
          <li><a href="#" id="settings-link"><img src="images/menu/compressed_stats_menu.webp" alt="Settings"> ⚙️ Settings</a></li>
        </ul>
      `;

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
        // Move existing container to content area
        const existingContainer = document.querySelector('.container') || document.querySelector('.wrap');
        if (existingContainer) {
          contentArea.appendChild(existingContainer);
        }
      }

      // Add sidebar and content area to wrapper
      mainWrapper.appendChild(sidebar);
      mainWrapper.appendChild(contentArea);

      // Add everything to the body
      document.body.appendChild(mainWrapper);

      // Add the necessary CSS
      document.body.style.paddingTop = "55px";
      document.body.style.paddingLeft = "0px";
      document.body.style.margin = "0px";

      const style = document.createElement('style');
      style.textContent = `
        /* Main layout with sidebar */
        .main-wrapper {
          display: flex;
          min-height: calc(100vh - 74px);
        }

        /* Sidebar styles */
        #game-sidebar {
          width: 250px;
          background: ${extensionSettings.sidebarColor};
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
          padding: 15px 0;
          overflow-y: auto;
          position: fixed;
          height: calc(100vh - 74px);
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

        /* Stats section styles */
        .sidebar-section {
          margin: 0 20px 20px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 15px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .stats-header:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .stats-basic {
          flex: 1;
        }

        .stats-title {
          display: block;
          color: #FFD369;
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .stats-inline {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #e0e0e0;
        }

        .stats-inline .points {
          color: #74c0fc;
          font-weight: bold;
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

        .stats-expanded {
          padding: 15px;
          background: rgba(0, 0, 0, 0.2);
        }

        .stats-expanded.collapsed {
          display: none;
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

        /* Sidebar menu styles */
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

        /* Expandable menu items */
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
        }

        .sidebar-submenu.collapsed {
          display: none;
        }

        .coming-soon-text {
          color: #f38ba8;
          font-size: 12px;
          text-align: center;
          font-style: italic;
        }

        /* Content area */
        .content-area {
          flex: 1;
          padding: 20px;
          margin-left: 250px;
        }

        /* Settings Modal */
        .settings-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-content {
          background: #1e1e2e;
          border: 2px solid #cba6f7;
          border-radius: 15px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          color: #cdd6f4;
        }

        .settings-section {
          margin-bottom: 25px;
        }

        .settings-section h3 {
          color: #f38ba8;
          margin-bottom: 15px;
          border-bottom: 1px solid #585b70;
          padding-bottom: 8px;
        }

        .color-palette {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-top: 10px;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-option:hover {
          transform: scale(1.1);
        }

        .color-option.selected {
          border-color: #cba6f7;
          box-shadow: 0 0 10px rgba(203, 166, 247, 0.5);
        }

        .settings-button {
          background: #cba6f7;
          color: #1e1e2e;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          margin-right: 10px;
          margin-top: 10px;
        }

        .settings-button:hover {
          background: #a281d4;
        }
      `;
      document.head.appendChild(style);

      // Initialize sidebar functionality
      initSidebarExpandables();
      initSettingsModal();

      // Fetch and update stats
      fetchAndUpdateSidebarStats();
    }

    function initSidebarExpandables() {
      // Stats expand functionality
      const statsExpandBtn = document.getElementById('stats-expand-btn');
      const statsExpanded = document.getElementById('stats-expanded');

      if (statsExpandBtn && statsExpanded) {
        // Set initial state
        if (extensionSettings.statsExpanded) {
          statsExpanded.classList.remove('collapsed');
          statsExpandBtn.textContent = '⚙️';
        } else {
          statsExpanded.classList.add('collapsed');
          statsExpandBtn.textContent = '⚙️';
        }

        statsExpandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCollapsed = statsExpanded.classList.contains('collapsed');

          if (isCollapsed) {
            statsExpanded.classList.remove('collapsed');
            extensionSettings.statsExpanded = true;
          } else {
            statsExpanded.classList.add('collapsed');
            extensionSettings.statsExpanded = false;
          }

          saveSettings();
        });
      }

      // Pets expand functionality
      const petsExpandBtn = document.getElementById('pets-expand-btn');
      const petsExpanded = document.getElementById('pets-expanded');

      if (petsExpandBtn && petsExpanded) {
        petsExpandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCollapsed = petsExpanded.classList.contains('collapsed');

          if (isCollapsed) {
            petsExpanded.classList.remove('collapsed');
            petsExpandBtn.textContent = '–';
            extensionSettings.petsExpanded = true;
          } else {
            petsExpanded.classList.add('collapsed');
            petsExpandBtn.textContent = '+';
            extensionSettings.petsExpanded = false;
          }

          saveSettings();
        });

        // Set initial state
        if (extensionSettings.petsExpanded) {
          petsExpanded.classList.remove('collapsed');
          petsExpandBtn.textContent = '–';
        }
      }

      // Blacksmith expand functionality
      const blacksmithExpandBtn = document.getElementById('blacksmith-expand-btn');
      const blacksmithExpanded = document.getElementById('blacksmith-expanded');

      if (blacksmithExpandBtn && blacksmithExpanded) {
        blacksmithExpandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCollapsed = blacksmithExpanded.classList.contains('collapsed');

          if (isCollapsed) {
            blacksmithExpanded.classList.remove('collapsed');
            blacksmithExpandBtn.textContent = '–';
            extensionSettings.blacksmithExpanded = true;
          } else {
            blacksmithExpanded.classList.add('collapsed');
            blacksmithExpandBtn.textContent = '+';
            extensionSettings.blacksmithExpanded = false;
          }

          saveSettings();
        });

        // Set initial state
        if (extensionSettings.blacksmithExpanded) {
          blacksmithExpanded.classList.remove('collapsed');
          blacksmithExpandBtn.textContent = '–';
        }
      }
    }

    function initSettingsModal() {
      // Add click event to settings link
      document.getElementById('settings-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsModal();
      });
    }

    function showSettingsModal() {
      // Create modal if it doesn't exist
      let modal = document.getElementById('settings-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'settings-modal';

        modal.innerHTML = `
          <div class="settings-content">
            <h2 style="color: #cba6f7; margin-bottom: 25px; text-align: center;">Settings</h2>

            <div class="settings-section">
              <h3>Sidebar Color</h3>
              <p>Choose a color for the side panel:</p>
              <div class="color-palette" id="sidebar-colors">
                <div class="color-option" style="background: #1e1e2e" data-color="#1e1e2e" title="Dark Blue"></div>
                <div class="color-option" style="background: #2d2d3d" data-color="#2d2d3d" title="Dark Gray"></div>
                <div class="color-option" style="background: #1a1a2e" data-color="#1a1a2e" title="Night Blue"></div>
                <div class="color-option" style="background: #16213e" data-color="#16213e" title="Navy"></div>
                <div class="color-option" style="background: #0f3460" data-color="#0f3460" title="Ocean Blue"></div>
                <div class="color-option" style="background: #533483" data-color="#533483" title="Purple"></div>
                <div class="color-option" style="background: #7209b7" data-color="#7209b7" title="Violet"></div>
                <div class="color-option" style="background: #2d1b69" data-color="#2d1b69" title="Deep Purple"></div>
                <div class="color-option" style="background: #0b6623" data-color="#0b6623" title="Forest Green"></div>
                <div class="color-option" style="background: #654321" data-color="#654321" title="Brown"></div>
                <div class="color-option" style="background: #8b0000" data-color="#8b0000" title="Dark Red"></div>
                <div class="color-option" style="background: #000000" data-color="#000000" title="Black"></div>
              </div>
            </div>

            <div class="settings-section">
              <h3>Background Color</h3>
              <p>Choose a background color for the webpage:</p>
              <div class="color-palette" id="background-colors">
                <div class="color-option" style="background: #000000" data-color="#000000" title="Black"></div>
                <div class="color-option" style="background: #1a1a1a" data-color="#1a1a1a" title="Very Dark Gray"></div>
                <div class="color-option" style="background: #2d2d2d" data-color="#2d2d2d" title="Dark Gray"></div>
                <div class="color-option" style="background: #0f0f23" data-color="#0f0f23" title="Dark Blue"></div>
                <div class="color-option" style="background: #1a0033" data-color="#1a0033" title="Dark Purple"></div>
                <div class="color-option" style="background: #001a00" data-color="#001a00" title="Dark Green"></div>
                <div class="color-option" style="background: #1a0000" data-color="#1a0000" title="Dark Red"></div>
                <div class="color-option" style="background: #001a1a" data-color="#001a1a" title="Dark Teal"></div>
                <div class="color-option" style="background: #1a1a00" data-color="#1a1a00" title="Dark Yellow"></div>
                <div class="color-option" style="background: #0a0a0a" data-color="#0a0a0a" title="Almost Black"></div>
                <div class="color-option" style="background: #404040" data-color="#404040" title="Medium Gray"></div>
                <div class="color-option" style="background: #1e1e2e" data-color="#1e1e2e" title="Blue Gray"></div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <button class="settings-button" onclick="closeSettingsModal()">Close</button>
              <button class="settings-button" onclick="resetSettings()">Reset to Default</button>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        // Add color selection handlers
        setupColorSelectors();

        // Mark current selections
        updateColorSelections();
      }

      modal.style.display = 'flex';

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeSettingsModal();
        }
      });
    }

    function setupColorSelectors() {
      // Sidebar colors
      document.querySelectorAll('#sidebar-colors .color-option').forEach(option => {
        option.addEventListener('click', () => {
          const color = option.dataset.color;
          extensionSettings.sidebarColor = color;
          saveSettings();
          applySettings();
          updateColorSelections();
        });
      });

      // Background colors
      document.querySelectorAll('#background-colors .color-option').forEach(option => {
        option.addEventListener('click', () => {
          const color = option.dataset.color;
          extensionSettings.backgroundColor = color;
          saveSettings();
          applySettings();
          updateColorSelections();
        });
      });
    }

    function updateColorSelections() {
      // Clear all selections
      document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
      });

      // Mark current sidebar color
      document.querySelectorAll('#sidebar-colors .color-option').forEach(option => {
        if (option.dataset.color === extensionSettings.sidebarColor) {
          option.classList.add('selected');
        }
      });

      // Mark current background color
      document.querySelectorAll('#background-colors .color-option').forEach(option => {
        if (option.dataset.color === extensionSettings.backgroundColor) {
          option.classList.add('selected');
        }
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
        sidebarColor: '#1e1e2e',
        backgroundColor: '#000000',
        statAllocationCollapsed: true,
        statsExpanded: false,
        petsExpanded: false,
        blacksmithExpanded: false
      };
      saveSettings();
      applySettings();
      updateColorSelections();
      showNotification('Settings reset to default!', 'success');
    }

    // Make functions globally available
    window.closeSettingsModal = closeSettingsModal;
    window.resetSettings = resetSettings;
    window.allocateStatPoints = allocateStatPoints;
    window.sidebarAlloc = sidebarAlloc;

    // MAIN INIT AND CHECKS
    // Check if we're on a page with the game topbar (it means we are in the game)
    if (document.querySelector('.game-topbar')) {
      // We should wait for the DOM to load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtension);
      } else {
        initializeExtension();
      }
    }

    function initializeExtension() {
      loadSettings();
      initSideBar();
      initDraggableFalse();
      initPageSpecificFunctionality();
    }

})();