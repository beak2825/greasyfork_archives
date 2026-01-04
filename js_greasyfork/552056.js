// ==UserScript==
// @name        FMP Player Training Results 
// @version     3.1
// @description Cache and display training data at the TOP of player page
// @match       https://footballmanagerproject.com/Team/Player*
// @match       https://footballmanagerproject.com/Team/Training*
// @grant       none
// @namespace https://greasyfork.org/users/1024463
// @downloadURL https://update.greasyfork.org/scripts/552056/FMP%20Player%20Training%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/552056/FMP%20Player%20Training%20Results.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.location.href.includes('/Team/Training')) {
    setTimeout(cacheTrainingData, 2000);
  } else if (window.location.href.includes('/Team/Player')) {
    setTimeout(displayCachedTrainingData, 2000);
  }

  function cacheTrainingData() {
    console.log('🔄 Caching training data...');
    
    const playerRows = document.querySelectorAll('tr');
    const trainingData = {};
    
    playerRows.forEach(row => {
      const link = row.querySelector('a[href*="Player?id="]');
      if (link) {
        const playerId = link.href.match(/id=(\d+)/)?.[1];
        const playerName = link.textContent.trim();
        
        if (playerId) {
          const cells = row.querySelectorAll('td');
          const skillGains = [];
          const trainingFocuses = [];
          let totalGI = 0;
          let trainingIntensity = '100%';
          
          // Detect if this is a goalkeeper or outfield player based on position
          let isGoalkeeper = false;
          const positionCell = cells[4]; // PPT cell
          if (positionCell && positionCell.textContent.includes('GK')) {
            isGoalkeeper = true;
          }
          
          // Use different skill mapping for GK vs outfield players
          const skillNames = isGoalkeeper ? 
            ['No', 'Info', 'Name', 'Age', 'PPT', 'GI', 'For', 'Sta', 'Pac', 'Han', 'Che', 'Ref', 'Pos', 'Ele', 'Aer', 'Kic', 'Jum', 'Thr', 'Training'] :
            ['No', 'Info', 'Name', 'Age', 'PPT', 'GI', 'For', 'Sta', 'Pac', 'Mar', 'Tac', 'Pos', 'Hea', 'Pas', 'Cro', 'Tec', 'Fin', 'Lon', 'Training'];
          
          cells.forEach((cell, index) => {
            const skillName = skillNames[index];
            const skillValue = cell.textContent.trim();
            
            // Get GI from cell 5
            if (index === 5 && skillValue) {
              totalGI = parseInt(skillValue) || 0;
            }
            
            // Check for skill improvements (progress bars)
            const progressBar = cell.querySelector('div.trainingh.pl');
            if (progressBar && index >= 7 && index <= 17) {
              const barWidth = progressBar.style.width;
              const pointsGained = Math.max(1, Math.round(parseInt(barWidth) / 4));
              
              skillGains.push({
                skill: skillName,
                currentValue: skillValue,
                pointsGained: pointsGained
              });
            }
            
            // Check for training focus
            if (cell.className.includes('trainingt') && index >= 7 && index <= 17) {
              const trainingLevel = cell.className.match(/t(\d+)/)?.[1];
              if (trainingLevel && skillName) {
                trainingFocuses.push({
                  skill: skillName,
                  percentage: parseInt(trainingLevel)
                });
              }
            }
          });
          
          // Check training intensity
          const trainingBtn = row.querySelector('.trainBtn');
          if (trainingBtn && trainingBtn.textContent.includes('110%')) {
            trainingIntensity = '110%';
          }
          
          if (skillGains.length > 0 || trainingFocuses.length > 0 || totalGI > 0) {
            trainingData[playerId] = {
              name: playerName,
              intensity: trainingIntensity,
              gi: totalGI,
              skillGains: skillGains,
              trainingFocuses: trainingFocuses,
              isGoalkeeper: isGoalkeeper,
              timestamp: Date.now()
            };
          }
        }
      }
    });
    
    localStorage.setItem('fmp_training_data', JSON.stringify(trainingData));
    console.log(`✅ Cached training data for ${Object.keys(trainingData).length} players`);
    showNotification(`Training data cached for ${Object.keys(trainingData).length} players!`);
  }

  function displayCachedTrainingData() {
    const playerId = window.location.href.match(/id=(\d+)/)?.[1];
    if (!playerId) return;
    
    // Remove any existing training box first
    const existingBoxes = document.querySelectorAll('[data-training-results="true"]');
    existingBoxes.forEach(box => box.remove());
    
    const cachedData = localStorage.getItem('fmp_training_data');
    if (!cachedData) {
      createTrainingBox(null, playerId);
      return;
    }
    
    const trainingData = JSON.parse(cachedData);
    const playerData = trainingData[playerId];
    
    createTrainingBox(playerData, playerId);
  }

  function createTrainingBox(data, playerId) {
    const box = document.createElement('div');
    box.className = 'fmpx board box';
    box.setAttribute('data-training-results', 'true'); // Mark for easy identification
    box.style.marginTop = '10px';
    box.style.marginBottom = '15px';
    box.innerHTML = '<div class="title"><div class="main">Weekly Training Results</div></div>';

    const content = document.createElement('div');
    content.style.padding = '15px';
    content.style.backgroundColor = '#1a1a1a';
    content.style.borderRadius = '5px';
    content.style.color = 'white';

    if (data) {
      // Training Summary Section
      const summaryDiv = document.createElement('div');
      summaryDiv.style.textAlign = 'center';
      summaryDiv.style.marginBottom = '15px';
      summaryDiv.style.borderBottom = '1px solid #555';
      summaryDiv.style.paddingBottom = '10px';
      summaryDiv.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 5px;">
          <strong>Training Intensity:</strong> <span style="color: #00ff00;">${data.intensity}</span>
        </div>
        <div style="font-size: 14px; margin-bottom: 5px;">
          <strong>Growth Index (GI):</strong> <span style="color: #7fff00;">${data.gi}</span>
        </div>
        <div style="font-size: 11px; color: #888;">
          ${data.isGoalkeeper ? 'Goalkeeper' : 'Outfield Player'} • Cached: ${new Date(data.timestamp).toLocaleTimeString()}
        </div>
      `;
      content.appendChild(summaryDiv);

      // Training Focus Section
      if (data.trainingFocuses.length > 0) {
        const focusTitle = document.createElement('div');
        focusTitle.style.fontSize = '13px';
        focusTitle.style.fontWeight = 'bold';
        focusTitle.style.marginBottom = '8px';
        focusTitle.textContent = 'Training Focus:';
        content.appendChild(focusTitle);

        const focusContainer = document.createElement('div');
        focusContainer.style.display = 'flex';
        focusContainer.style.flexWrap = 'wrap';
        focusContainer.style.gap = '8px';
        focusContainer.style.marginBottom = '15px';

        data.trainingFocuses.forEach(focus => {
          const focusItem = document.createElement('div');
          focusItem.style.padding = '6px 10px';
          focusItem.style.backgroundColor = '#2a2a2a';
          focusItem.style.borderRadius = '4px';
          focusItem.style.border = '1px solid #444';
          const color = focus.percentage >= 50 ? '#00ff00' : focus.percentage >= 30 ? '#ffff00' : '#ff7f00';
          focusItem.innerHTML = `<span style="color: white;">${focus.skill}:</span> <span style="color: ${color}; font-weight: bold; margin-left: 5px;">${focus.percentage}%</span>`;
          focusContainer.appendChild(focusItem);
        });
        content.appendChild(focusContainer);
      }

      // Skill Gains Section
      if (data.skillGains.length > 0) {
        const gainsTitle = document.createElement('div');
        gainsTitle.style.fontSize = '13px';
        gainsTitle.style.fontWeight = 'bold';
        gainsTitle.style.marginBottom = '8px';
        gainsTitle.textContent = 'Skill Points Gained This Week:';
        content.appendChild(gainsTitle);

        const gainsContainer = document.createElement('div');
        gainsContainer.style.display = 'flex';
        gainsContainer.style.flexWrap = 'wrap';
        gainsContainer.style.gap = '8px';

        data.skillGains.forEach(gain => {
          const gainItem = document.createElement('div');
          gainItem.style.display = 'flex';
          gainItem.style.flexDirection = 'column';
          gainItem.style.alignItems = 'center';
          gainItem.style.padding = '8px 12px';
          gainItem.style.backgroundColor = '#2a2a2a';
          gainItem.style.borderRadius = '4px';
          gainItem.style.border = '1px solid #444';
          gainItem.style.minWidth = '80px';
          gainItem.style.textAlign = 'center';
          
          const color = getGainColor(gain.pointsGained);
          gainItem.innerHTML = `
            <div style="color: white; font-size: 12px; font-weight: bold; margin-bottom: 4px;">${gain.skill}</div>
            <div style="color: #ccc; font-size: 11px; margin-bottom: 4px;">Current: ${gain.currentValue}</div>
            <div style="color: ${color}; font-size: 16px; font-weight: bold; text-shadow: 0 0 3px ${color};">+${gain.pointsGained}</div>
          `;
          
          gainsContainer.appendChild(gainItem);
        });
        content.appendChild(gainsContainer);
      }
      
    } else {
      content.innerHTML = `
        <div style="text-align: center;">
          <div style="color: #ccc; font-style: italic; margin-bottom: 10px;">
            No training data cached yet.
          </div>
          <div style="font-size: 12px; color: #888;">
            Visit the <a href="/Team/Training" style="color: #4CAF50; text-decoration: none;">Training Page</a>
            first to cache training data.
          </div>
        </div>
      `;
    }

    box.appendChild(content);
    insertBoxAtTop(box);
  }

  function insertBoxAtTop(box) {
    // Strategy 1: Try to find the main player info container and insert after Position Ratings
    const mainPlayerInfo = document.querySelector('#mainBoard, .main-content, .player-info, .content');
    
    if (mainPlayerInfo) {
      // Look for Position Ratings box first
      const positionRatingsBox = mainPlayerInfo.querySelector('[data-position-ratings="true"]');
      
      if (positionRatingsBox) {
        // Insert our training box right after Position Ratings
        positionRatingsBox.parentNode.insertBefore(box, positionRatingsBox.nextSibling);
        console.log('✅ Inserted training results after Position Ratings box');
        return;
      }
      
      // If no Position Ratings, look for the first existing .fmpx.board.box (usually player basic info)
      const firstExistingBox = mainPlayerInfo.querySelector('.fmpx.board.box');
      
      if (firstExistingBox) {
        // Insert our box right after the first existing box
        firstExistingBox.parentNode.insertBefore(box, firstExistingBox.nextSibling);
        console.log('✅ Inserted training results after first player info box');
        return;
      }
      
      // Fallback: Insert as first child of main container
      mainPlayerInfo.insertBefore(box, mainPlayerInfo.firstChild);
      console.log('✅ Inserted training results as first element in main container');
      return;
    }
    
    // Strategy 2: Find any container that looks like player content
    const possibleContainers = [
      document.querySelector('.player-container'),
      document.querySelector('.content-wrapper'),
      document.querySelector('main'),
      document.querySelector('.page-content'),
      document.body
    ];
    
    for (const container of possibleContainers) {
      if (container) {
        container.insertBefore(box, container.firstChild);
        console.log('✅ Inserted training results in backup container');
        return;
      }
    }
    
    // Final fallback: Append to body (shouldn't happen)
    document.body.appendChild(box);
    console.log('⚠️ Had to append training results to body as last resort');
  }

  function getGainColor(points) {
    if (points >= 5) return '#00ff00';
    if (points >= 4) return '#7fff00';
    if (points >= 3) return '#ffff00';
    if (points >= 2) return '#ff7f00';
    return '#ff4500';
  }

  // REMOVED OLD addBoxToPage function - replaced with insertBoxAtTop

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '10000';
    notification.style.fontSize = '14px';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
})();
