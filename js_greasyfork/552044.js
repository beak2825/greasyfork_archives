// ==UserScript==
// @name        FMP Player Position Ratings
// @version     2.0
// @description Show all 14 position ratings for players from ANY team
// @match       https://footballmanagerproject.com/Team/Player*
// @match       https://www.footballmanagerproject.com/Team/Player*
// @grant       none
// @author      Enhanced Universal Version
// @namespace https://greasyfork.org/users/1024463
// @downloadURL https://update.greasyfork.org/scripts/552044/FMP%20Player%20Position%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/552044/FMP%20Player%20Position%20Ratings.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Wait for page to load
  window.addEventListener('load', function() {
    setTimeout(addPositionRatings, 1000);
  });

  // Function to get color based on rating
  function getRatingColor(rating) {
    if (rating >= 18) return '#00ff00';      // Bright green for excellent (18+)
    if (rating >= 15) return '#7fff00';      // Yellow-green for very good (15-17.9)
    if (rating >= 12) return '#ffff00';      // Yellow for good (12-14.9)
    if (rating >= 9) return '#ff7f00';       // Orange for average (9-11.9)
    if (rating >= 6) return '#ff4500';       // Orange-red for below average (6-8.9)
    return '#ff0000';                        // Red for poor (below 6)
  }

  // Get all possible team IDs dynamically
  async function getAllTeamIds() {
    const teamIds = new Set();
    
    // Method 1: Extract team IDs from current page links
    document.querySelectorAll('a[href*="Team/"]').forEach(link => {
      const match = link.href.match(/Team.*[?&]id=(\d+)/);
      if (match) {
        teamIds.add(parseInt(match[1]));
      }
    });

    // Method 2: Try common team ID patterns
    const commonRanges = [
      { start: 1, end: 100 },      // Very low IDs
      { start: 100, end: 500 },    // Low IDs  
      { start: 1000, end: 3000 },  // Medium IDs
      { start: 4000, end: 6000 },  // High IDs
    ];

    // Add some strategic team IDs to check
    for (const range of commonRanges) {
      for (let i = range.start; i <= range.end; i += 10) {
        teamIds.add(i);
      }
    }

    // Method 3: Include your known working team IDs
    const knownTeamIds = [183, 1616, 2872, 4367];
    knownTeamIds.forEach(id => teamIds.add(id));

    console.log(`🔍 Will check ${teamIds.size} potential team IDs`);
    return Array.from(teamIds).sort((a, b) => a - b);
  }

  // Try to find player in a specific team's lineup
  async function checkTeamForPlayer(teamId, playerId) {
    try {
      const response = await fetch(`/Team/Lineup?handler=LineupData&id=${teamId}`);
      
      if (!response.ok) {
        return null; // Team doesn't exist or no access
      }
      
      const data = await response.json();
      
      if (!data || !data.field) {
        return null; // Invalid response
      }
      
      const all = data.field.concat(data.reserves || [], data.tribune || []);
      const player = all.find(x => x && x.info && x.info.id.toString() === playerId);
      
      if (player) {
        console.log(`✅ Found player ${playerId} in team ${teamId}`);
        return player;
      }
      
      return null;
    } catch (err) {
      // Team doesn't exist or other error - skip silently
      return null;
    }
  }

  async function addPositionRatings() {
    try {
      // Get player ID from URL
      const playerId = window.location.href.match(/id=(\d+)/);
      if (!playerId) {
        console.log('❌ No player ID found in URL');
        return;
      }
      
      const playerIdStr = playerId[1];
      console.log(`🔍 Looking for player ${playerIdStr} across all teams...`);
      
      // Remove any existing position ratings box
      const existingBox = document.querySelector('.fmpx.board.box .title .main[textContent="Position Ratings"]');
      if (existingBox) {
        existingBox.closest('.fmpx.board.box').remove();
      }

      // Get all possible team IDs
      const teamIds = await getAllTeamIds();
      
      let playerFound = false;
      let checkedCount = 0;
      
      // Check teams in batches to avoid overwhelming the server
      for (let i = 0; i < teamIds.length && !playerFound; i += 5) {
        const batch = teamIds.slice(i, i + 5);
        
        const batchPromises = batch.map(async teamId => {
          checkedCount++;
          if (checkedCount % 20 === 0) {
            console.log(`🔍 Checked ${checkedCount} teams so far...`);
          }
          return await checkTeamForPlayer(teamId, playerIdStr);
        });
        
        const results = await Promise.all(batchPromises);
        const player = results.find(p => p !== null);
        
        if (player) {
          console.log(`🎯 Found player data after checking ${checkedCount} teams`);
          createPositionRatingsBox(player);
          playerFound = true;
          break;
        }
        
        // Small delay between batches to be nice to the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (!playerFound) {
        console.log(`❌ Player ${playerIdStr} not found in any of the ${checkedCount} teams checked`);
        showNotFoundMessage();
      }
      
    } catch (err) {
      console.error('FMP Position Ratings error:', err);
      showErrorMessage();
    }
  }

  function createPositionRatingsBox(player) {
    // Create the ratings box
    const box = document.createElement('div');
    box.className = 'fmpx board box';
    box.style.marginTop = '10px';
    box.innerHTML = '<div class="title"><div class="main">Position Ratings</div></div>';

    // Create horizontal container
    const container = document.createElement('div');
    container.style.padding = '15px';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '8px';
    container.style.justifyContent = 'center';
    container.style.backgroundColor = '#1a1a1a';
    container.style.borderRadius = '5px';

    const positions = ['GK','DC','DL','DR','DMC','DML','DMR','MC','ML','MR','OMC','OML','OMR','FC'];
    
    positions.forEach(pos => {
      const rating = player.info.allRatings[pos] / 10;
      const ratingStr = rating.toFixed(1);
      const color = getRatingColor(rating);
      
      // Create position item
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'center';
      item.style.padding = '8px 12px';
      item.style.backgroundColor = '#2a2a2a';
      item.style.borderRadius = '4px';
      item.style.border = '1px solid #444';
      item.style.minWidth = '65px';
      item.style.textAlign = 'center';
      item.style.transition = 'transform 0.2s ease';
      
      // Hover effect
      item.onmouseover = () => item.style.transform = 'scale(1.05)';
      item.onmouseout = () => item.style.transform = 'scale(1)';
      
      // Position name
      const posName = document.createElement('div');
      posName.style.color = '#fff';
      posName.style.fontSize = '12px';
      posName.style.fontWeight = 'bold';
      posName.style.marginBottom = '4px';
      posName.textContent = pos;
      
      // Rating number
      const ratingDiv = document.createElement('div');
      ratingDiv.style.color = color;
      ratingDiv.style.fontSize = '18px';
      ratingDiv.style.fontWeight = 'bold';
      ratingDiv.style.textShadow = `0 0 5px ${color}`;
      ratingDiv.textContent = ratingStr;
      
      item.appendChild(posName);
      item.appendChild(ratingDiv);
      container.appendChild(item);
    });

    // Add success message
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'center';
    infoDiv.style.color = '#4CAF50';
    infoDiv.style.fontSize = '12px';
    infoDiv.style.marginTop = '10px';
    infoDiv.style.fontStyle = 'italic';
    infoDiv.textContent = '✅ Position ratings loaded successfully';

    box.appendChild(container);
    box.appendChild(infoDiv);

    // Find container and add the box
    let mainContainer = document.getElementById('mainBoard');
    if (!mainContainer) mainContainer = document.querySelector('.main-content');
    if (!mainContainer) mainContainer = document.querySelector('.fmpx.board');
    if (!mainContainer) mainContainer = document.body;
    
    mainContainer.appendChild(box);
  }

  function showNotFoundMessage() {
    const box = document.createElement('div');
    box.className = 'fmpx board box';
    box.style.marginTop = '10px';
    box.innerHTML = '<div class="title"><div class="main">Position Ratings</div></div>';

    const container = document.createElement('div');
    container.style.padding = '15px';
    container.style.backgroundColor = '#1a1a1a';
    container.style.borderRadius = '5px';
    container.style.textAlign = 'center';
    container.style.color = '#ff6666';

    container.innerHTML = `
      <div style="font-size: 16px; margin-bottom: 10px;">⚠️ Player Not Found</div>
      <div style="font-size: 12px; color: #ccc;">
        Could not find this player in any team's lineup.<br>
        The player might be in a team not accessible or retired.
      </div>
    `;

    box.appendChild(container);

    let mainContainer = document.getElementById('mainBoard');
    if (!mainContainer) mainContainer = document.querySelector('.main-content');
    if (!mainContainer) mainContainer = document.body;
    
    mainContainer.appendChild(box);
  }

  function showErrorMessage() {
    const box = document.createElement('div');
    box.className = 'fmpx board box';
    box.style.marginTop = '10px';
    box.innerHTML = '<div class="title"><div class="main">Position Ratings</div></div>';

    const container = document.createElement('div');
    container.style.padding = '15px';
    container.style.backgroundColor = '#1a1a1a';
    container.style.borderRadius = '5px';
    container.style.textAlign = 'center';
    container.style.color = '#ff6666';

    container.innerHTML = `
      <div style="font-size: 16px; margin-bottom: 10px;">❌ Error Loading Ratings</div>
      <div style="font-size: 12px; color: #ccc;">
        There was an error loading position ratings.<br>
        Please try refreshing the page.
      </div>
    `;

    box.appendChild(container);

    let mainContainer = document.getElementById('mainBoard');
    if (!mainContainer) mainContainer = document.querySelector('.main-content');
    if (!mainContainer) mainContainer = document.body;
    
    mainContainer.appendChild(box);
  }

})();
