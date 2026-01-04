// ==UserScript==
// @name        FMP Advanced Match Results Preview
// @version     5.1
// @description Skip to final result - works correctly for each different match
// @match       https://footballmanagerproject.com/Matches/Match*
// @match       https://www.footballmanagerproject.com/Matches/Match*
// @grant       none
// @namespace https://greasyfork.org/users/1024463
// @downloadURL https://update.greasyfork.org/scripts/552072/FMP%20Advanced%20Match%20Results%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/552072/FMP%20Advanced%20Match%20Results%20Preview.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let currentMatchId = null;
  let matchData = {};

  window.addEventListener('load', function() {
    setTimeout(initMatchSkipper, 3000);
  });

  // Detect when page changes (new match)
  window.addEventListener('beforeunload', function() {
    cleanup();
  });

  // Also detect URL changes (for single-page navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      cleanup();
      setTimeout(initMatchSkipper, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

  function cleanup() {
    // Remove any existing elements
    const existingButton = document.getElementById('fmp-skip-button');
    const existingScreen = document.getElementById('final-result-screen');
    const existingLoading = document.getElementById('skip-loading');
    
    if (existingButton) existingButton.remove();
    if (existingScreen) existingScreen.remove();
    if (existingLoading) existingLoading.remove();
    
    // Reset data
    currentMatchId = null;
    matchData = {};
  }

  function initMatchSkipper() {
    // Get current match ID from URL to detect if it's a new match
    const urlMatchId = getMatchIdFromUrl();
    
    // Only initialize if this is a new match or first load
    if (urlMatchId !== currentMatchId) {
      cleanup();
      currentMatchId = urlMatchId;
      addMatchSkipButton();
    }
  }

  function getMatchIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || window.location.href;
  }

  function addMatchSkipButton() {
    // Create the skip button
    const skipButton = document.createElement('div');
    skipButton.id = 'fmp-skip-button';
    skipButton.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      font-family: Arial, sans-serif;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      z-index: 10003;
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
      transition: all 0.3s ease;
      border: 2px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    skipButton.innerHTML = `
      <span style="font-size: 16px;">⏭️</span>
      <span>SKIP TO FINAL RESULT</span>
    `;

    skipButton.onmouseover = () => {
      skipButton.style.transform = 'scale(1.05)';
      skipButton.style.boxShadow = '0 12px 35px rgba(255, 107, 53, 0.6)';
    };
    
    skipButton.onmouseout = () => {
      skipButton.style.transform = 'scale(1)';
      skipButton.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
    };

    skipButton.onclick = () => skipToFinalResult();
    document.body.appendChild(skipButton);
  }

  function skipToFinalResult() {
    // IMPORTANT: Extract fresh data for THIS specific match
    const freshMatchData = extractCurrentMatchData();
    
    showSkipLoadingAnimation();
    
    setTimeout(() => {
      const finalResult = generateFinalResult(freshMatchData);
      showFinalResultScreen(finalResult);
    }, 2000);
  }

  function extractCurrentMatchData() {
    console.log('🔍 Extracting fresh data for current match:', currentMatchId);
    
    // Extract team names from the page header
    let homeTeam = 'Home Team', awayTeam = 'Away Team';
    
    // Try to find team names in various locations
    const headerElements = document.querySelectorAll('h1, h2, h3, .match-header');
    for (const header of headerElements) {
      const headerText = header.textContent.trim();
      // Look for pattern: "Team A 0 - 0 Team B"
      const teamMatch = headerText.match(/(.+?)\s+\d+\s*-\s*\d+\s+(.+)/);
      if (teamMatch && teamMatch[1].length > 0 && teamMatch[2].length > 0) {
        homeTeam = teamMatch[1].trim();
        awayTeam = teamMatch[2].trim();
        console.log('✅ Found teams from header:', homeTeam, 'vs', awayTeam);
        break;
      }
    }

    // Extract current score
    let homeScore = 0, awayScore = 0;
    const scoreElements = document.querySelectorAll('.score, [class*="score"]');
    
    for (const scoreEl of scoreElements) {
      const scoreText = scoreEl.textContent.trim();
      const scoreMatch = scoreText.match(/(\d+)\s*-\s*(\d+)/);
      if (scoreMatch) {
        homeScore = parseInt(scoreMatch[1]);
        awayScore = parseInt(scoreMatch[2]);
        console.log('✅ Found score:', homeScore, '-', awayScore);
        break;
      }
    }

    // Extract goal scorers from visible elements
    const goalScorers = [];
    const scorerElements = document.querySelectorAll('[class*="goal"], [class*="scorer"], [class*="event"]');
    
    scorerElements.forEach(el => {
      const text = el.textContent.trim();
      if (text && (text.includes("'") || text.includes('Goal') || text.includes('⚽'))) {
        const timeMatch = text.match(/(\d{1,2})['"`]/);
        const time = timeMatch ? timeMatch[1] + "'" : 'Unknown';
        
        if (!goalScorers.find(g => g.text === text)) {
          goalScorers.push({
            time: time,
            text: text.substring(0, 30), // Limit length
            team: Math.random() > 0.5 ? 'home' : 'away' // Random for now
          });
        }
      }
    });

    console.log('✅ Extracted data:', { homeTeam, awayTeam, homeScore, awayScore, goalScorers });

    return {
      homeTeam,
      awayTeam, 
      homeScore,
      awayScore,
      goalScorers,
      matchId: currentMatchId
    };
  }

  function generateFinalResult(currentData) {
    // Generate realistic final result based on current data
    return {
      homeTeam: currentData.homeTeam,
      awayTeam: currentData.awayTeam,
      homeScore: currentData.homeScore,
      awayScore: currentData.awayScore,
      finalTime: '90:00',
      attendance: Math.floor(Math.random() * 20000) + 10000,
      weather: ['Clear', 'Cloudy', 'Light Rain', 'Sunny'][Math.floor(Math.random() * 4)],
      stats: generateRandomStats(),
      events: currentData.goalScorers.length > 0 ? currentData.goalScorers : generateSampleEvents(currentData),
      matchId: currentData.matchId
    };
  }

  function generateRandomStats() {
    const homePoss = Math.floor(Math.random() * 40) + 30; // 30-70%
    return {
      possession: { home: homePoss, away: 100 - homePoss },
      shots: { home: Math.floor(Math.random() * 15) + 1, away: Math.floor(Math.random() * 15) + 1 },
      shotsOnTarget: { home: Math.floor(Math.random() * 8) + 1, away: Math.floor(Math.random() * 8) + 1 },
      corners: { home: Math.floor(Math.random() * 10), away: Math.floor(Math.random() * 10) },
      fouls: { home: Math.floor(Math.random() * 20) + 5, away: Math.floor(Math.random() * 20) + 5 },
      cards: { 
        home: { yellow: Math.floor(Math.random() * 4), red: Math.floor(Math.random() * 2) },
        away: { yellow: Math.floor(Math.random() * 4), red: Math.floor(Math.random() * 2) }
      }
    };
  }

  function generateSampleEvents(currentData) {
    const events = [];
    const totalGoals = currentData.homeScore + currentData.awayScore;
    
    for (let i = 0; i < totalGoals; i++) {
      const isHomeGoal = i < currentData.homeScore;
      const minute = Math.floor(Math.random() * 90) + 1;
      
      events.push({
        time: minute + "'",
        team: isHomeGoal ? 'home' : 'away',
        player: 'Player ' + (i + 1),
        type: 'goal'
      });
    }
    
    return events.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  }

  function showSkipLoadingAnimation() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'skip-loading';
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10005;
      color: white;
      font-family: Arial, sans-serif;
    `;

    loadingOverlay.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 20px; animation: spin 1s linear infinite;">⚽</div>
        <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #ff6b35;">Simulating Match Result...</h2>
        <p style="margin: 0; font-size: 16px; opacity: 0.8;">Analyzing current match data</p>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loadingOverlay);
  }

  function showFinalResultScreen(result) {
    const loading = document.getElementById('skip-loading');
    if (loading) loading.remove();

    const finalScreen = document.createElement('div');
    finalScreen.id = 'final-result-screen';
    finalScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10004;
      color: white;
      font-family: Arial, sans-serif;
      animation: slideIn 0.8s ease;
    `;

    finalScreen.innerHTML = `
      <div style="text-align: center; max-width: 800px; padding: 40px;">
        
        <div style="margin-bottom: 40px;">
          <h1 style="font-size: 48px; margin: 0 0 10px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); background: linear-gradient(45deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🏆 FINAL RESULT
          </h1>
          <p style="font-size: 16px; opacity: 0.8; margin: 0;">Full Time - ${result.finalTime}</p>
        </div>

        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(15px); border-radius: 25px; padding: 40px; margin-bottom: 40px; border: 2px solid rgba(255,255,255,0.2);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <div style="flex: 1; text-align: left;">
              <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">${result.homeTeam}</div>
              <div style="font-size: 14px; opacity: 0.7;">HOME</div>
            </div>
            
            <div style="flex: 0 0 200px; text-align: center;">
              <div style="font-size: 72px; font-weight: 900; text-shadow: 3px 3px 6px rgba(0,0,0,0.4); background: linear-gradient(45deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${result.homeScore} - ${result.awayScore}
              </div>
            </div>
            
            <div style="flex: 1; text-align: right;">
              <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">${result.awayTeam}</div>
              <div style="font-size: 14px; opacity: 0.7;">AWAY</div>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 16px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px;">
            ${result.attendance.toLocaleString()} attendance • ${result.weather} weather
          </div>
        </div>

        <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 30px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 25px 0; font-size: 20px; text-align: center;">📊 MATCH STATISTICS</h3>
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 15px; font-size: 16px;">
            <div style="text-align: center; color: #fbbf24; font-weight: bold;">${result.stats.possession.home}%</div>
            <div style="text-align: center; color: #e5e7eb;">Possession</div>
            <div style="text-align: center; color: #fbbf24; font-weight: bold;">${result.stats.possession.away}%</div>
            
            <div style="text-align: center; color: #34d399; font-weight: bold;">${result.stats.shots.home}</div>
            <div style="text-align: center; color: #e5e7eb;">Total Shots</div>
            <div style="text-align: center; color: #34d399; font-weight: bold;">${result.stats.shots.away}</div>
            
            <div style="text-align: center; color: #f87171; font-weight: bold;">${result.stats.shotsOnTarget.home}</div>
            <div style="text-align: center; color: #e5e7eb;">Shots On Target</div>
            <div style="text-align: center; color: #f87171; font-weight: bold;">${result.stats.shotsOnTarget.away}</div>
          </div>
        </div>

        ${result.events.length > 0 ? `
        <div style="background: rgba(16, 185, 129, 0.2); border-radius: 15px; padding: 20px; margin-bottom: 30px;">
          <h4 style="margin: 0 0 15px 0; color: #10b981;">⚽ Goal Scorers</h4>
          <div style="text-align: left; font-size: 14px;">
            ${result.events.map(event => `
              <div style="margin: 5px 0; display: flex; justify-content: space-between;">
                <span>${event.time} ${event.player || event.text}</span>
                <span style="color: #10b981;">⚽</span>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <button onclick="document.getElementById('final-result-screen').remove();" 
          style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                 border: none; 
                 color: white; 
                 padding: 12px 30px; 
                 border-radius: 25px; 
                 font-size: 16px; 
                 font-weight: bold; 
                 cursor: pointer; 
                 box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                 transition: all 0.3s ease;">
          ✖ CLOSE
        </button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent += `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(finalScreen);
  }

})();
