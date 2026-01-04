// ==UserScript==
// @name         TM Opponent Scouting
// @version      2.0
// @description  Trophy Manager: Show match events for the last 5 games of next opponent. with adaptations from TMVN Match Event (Xpand Club_Id: 4423730) and TM League Match History (Irreal Madrid FC. Club ID: 4402745)
// @author       Scunny Club ID: 4464490
// @namespace    https://trophymanager.com
// @include      https://trophymanager.com/home/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548566/TM%20Opponent%20Scouting.user.js
// @updateURL https://update.greasyfork.org/scripts/548566/TM%20Opponent%20Scouting.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('TM Last Five Match Reports Enhanced script starting...');

    // Configuration
    const LAST_MATCHES = 5;
    const REFRESH_INTERVAL = 2000;

    // Constants
    const LEAGUE = 1;
    const COUNTRY = 2;
    const DIVISION = 3;
    const GROUP = 4;
    const FIXTURES = '/ajax/fixtures.ajax.php';

    // Event types and mappings
    const MENTALITY_MAP = new Map()
        .set("1", "Very Defensive")
        .set("2", "Defensive")
        .set("3", "Slightly Defensive")
        .set("4", "Normal")
        .set("5", "Slightly Attacking")
        .set("6", "Attacking")
        .set("7", "Very Attacking");

    const STYLE_MAP = new Map()
        .set("1", "Balanced")
        .set("2", "Direct")
        .set("3", "Wings")
        .set("4", "Shortpassing")
        .set("5", "Long Balls")
        .set("6", "Through Balls");

    const GOAL_STYLE_MAP = new Map()
        .set("p_s", "Penalty")
        .set("kco", "GK Counter")
        .set("klo", "GK Kick")
        .set("doe", "Corner")
        .set("cou", "Counter/Direct")
        .set("dir", "Freekick")
        .set("win", "Wing Attack")
        .set("sho", "Short Pass")
        .set("lon", "Long Ball")
        .set("thr", "Through Ball");

    const FOCUS_MAP = new Map()
        .set("1", "Balanced")
        .set("2", "Left")
        .set("3", "Center")
        .set("4", "Right");

    const EVENT_TYPE = {
        GOAL: 'goal',
        YELLOW_CARD: 'yellow',
        RED_CARD: 'red',
        MENTALITY: 'mentality',
        STYLE: 'style',
        POSITION: 'position',
        SUBSTITUTION: 'substitution',
        INJURY: 'injury'
    };

    let matchReports = [];
    let processedMatches = 0;
    let totalMatches = 0;

    // Add status indicator
    function addStatusIndicator(message) {
        let statusDiv = document.getElementById('tm-reports-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'tm-reports-status';
            statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-size: 12px;';
            document.body.appendChild(statusDiv);
        }
        statusDiv.textContent = message;
        console.log('Status: ' + message);
    }

    // Get current team info from SESSION data
    function getCurrentTeamInfo() {
        try {
            // SESSION data is available globally on Trophy Manager pages
            if (typeof SESSION !== 'undefined') {
                return {
                    id: SESSION.id || SESSION.main_id,
                    name: SESSION.clubname
                };
            }
        } catch (e) {
            console.error('Error accessing SESSION data:', e);
        }
        return null;
    }

    // Search for fixture/opponent and return OPPONENT team name (excluding current team)
    function getOpponentId() {
        const currentTeam = getCurrentTeamInfo();
        if (!currentTeam) {
            console.error('Could not identify current team from SESSION data');
            return null;
        }

        console.log('Current team:', currentTeam.name, '(ID:', currentTeam.id + ')');

        const fixtureElements = document.querySelectorAll('[class*="fixture"], [class*="opponent"], [class*="match"], [class*="next"]');

        for (let el of fixtureElements) {
            const clubLinks = el.querySelectorAll('a[href*="/club/"]');
            for (let clubLink of clubLinks) {
                const match = clubLink.href.match(/\/club\/(\d+)/);
                if (match) {
                    const teamId = match[1];
                    const teamName = clubLink.textContent.trim();

                    // Skip if this is the current team
                    if (teamId === currentTeam.id.toString() || teamName === currentTeam.name) {
                        console.log('Skipping current team:', teamName);
                        continue;
                    }

                    // This must be the opponent
                    console.log('Found opponent Club ID:', teamId, 'Name:', teamName);
                    return teamName;
                }
            }
        }

        console.error('Could not find opponent team name');
        return null;
    }

    // Get league fixtures URL. fetches league URL from fixtures page.
    async function getLeagueUrlFromAnotherPage() {
        // Try to automatically find the league URL from the current page
        let targetUrl = null;

        // Look for the league link in the event div
        const leagueLink = document.querySelector('.event a[href*="/league/"]');
        if (leagueLink) {
            const leaguePath = leagueLink.getAttribute('href');
            // Convert /league/en/3/12/ to /fixtures/league/en/3/12/
            targetUrl = 'https://trophymanager.com/fixtures' + leaguePath;
            console.log('Found league URL automatically:', targetUrl);
        } else {
            // Fallback to hardcoded URL if not found
            targetUrl = 'https://trophymanager.com/fixtures/league/en/3/12/'; // edit this league link if not auto found.
            console.log('Could not find league link, using fallback URL:', targetUrl);
        }

        try {
            const response = await fetch(targetUrl);
            if (!response.ok) {
                console.error('Failed to fetch target page:', response.statusText);
                return null;
            }
            const html = await response.text();

            // Create a temporary DOM element to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Find the calendar link within the fetched HTML
            const calendarLink = tempDiv.querySelector('.content_menu .calendar');

            if (calendarLink) {
                const href = calendarLink.getAttribute('href');
                if (href) {
                    // Now you have the href, split and process it as before
                    let urlParts = href.split('/').filter(el => el.length > 0);
                    console.log('Extracted URL parts from fetched page:', urlParts);
                    return urlParts;
                } else {
                    console.error('Calendar link found, but href attribute is missing.');
                    return null;
                }
            } else {
                console.error('Could not find .content_menu .calendar element on the fetched page.');
                return null;
            }

        } catch (error) {
            console.error('Error fetching or processing target page:', error);
            return null;
        }
    }

    // Example of how you might use this
    (async function() {
        const UrlParts = await getLeagueUrlFromAnotherPage();
        if (UrlParts) {
            // Proceed with your logic using leagueUrlParts
            var postobj = {
                'type': UrlParts[LEAGUE],
                'var1': UrlParts[COUNTRY],
                'var2': UrlParts.length > (DIVISION) ? UrlParts[DIVISION] : '',
                'var3': UrlParts.length > (GROUP) ? UrlParts[GROUP] : ''
            };
            console.log('Post object:', postobj);

            // Make your $.post request here using postobj
            $.post(FIXTURES, postobj, function(data) {
                if (data != null) {
                    applyResults(data);
                }
            }, 'json');

        } else {
            console.error('Could not get league URL. Cannot fetch fixtures.');
        }
    })();

    function applyResults(data) {
        let fixtures = filterFixtures(data);
    }

    // Filter fixtures to get completed matches only
    function filterFixtures(data) {
        let months = [];
        let matches = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                months.push(data[key]);
            }
        }
        for (let index = 0; index < months.length; index++) {
            const thisMonth = months[index];
            matches = matches.concat(thisMonth.matches.filter(function testUnPlayed(match) {
                return match.result != null;
            }));
        }
        return matches;
    }

    // Get team's last matches
    function getTeamMatches(matches, teamName) {
        console.log('Looking for matches for team: ' + teamName);
        let teamMatches = [];

        for (let index = matches.length - 1; index >= 0 && teamMatches.length < LAST_MATCHES; index--) {
            const match = matches[index];

            // Handle both exact match and partial match (in case team name format differs)(partial removed.040925)
            const homeMatch = match.hometeam_name === teamName; //|| match.hometeam_name.includes(teamName.split(' ')[0]);
            const awayMatch = match.awayteam_name === teamName; //|| match.awayteam_name.includes(teamName.split(' ')[0]);

            if (homeMatch || awayMatch) {
                let matchLink = '';
                try {
                    if (typeof $ !== 'undefined') {
                        matchLink = $(match.match_link).attr('href') || match.match_link;
                    } else {
                        // Parse match link without jQuery
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = match.match_link;
                        const linkElement = tempDiv.querySelector('a');
                        matchLink = linkElement ? linkElement.href : match.match_link;
                    }
                } catch (e) {
                    console.error('Error getting match link:', e);
                    continue;
                }

                let matchData = {
                    date: match.date,
                    homeTeam: match.hometeam_name,
                    awayTeam: match.awayteam_name,
                    result: match.result,
                    matchLink: matchLink
                };
                teamMatches.unshift(matchData);
                console.log('Added match: ' + match.hometeam_name + ' vs ' + match.awayteam_name);
            }
        }
        console.log('Found ' + teamMatches.length + ' team matches');
        return teamMatches;
    }

    // Process match events and return filtered events for a specific team
    function processMatchEvents(matchData, targetTeamName) {
        const report = matchData.report;
        if (Object.keys(report).length <= 3) {
            return []; // No match data available
        }

        const homeClubName = matchData.club.home.club_name;
        const awayClubName = matchData.club.away.club_name;
        const homeClubId = matchData.club.home.id;
        const awayClubId = matchData.club.away.id;

        // Determine if target team is home or away - with debugging
        console.log('Team comparison - Target:', targetTeamName);
        console.log('Home club name:', homeClubName);
        console.log('Away club name:', awayClubName);
        
        const isTargetHome = homeClubName === targetTeamName;
        const isTargetAway = awayClubName === targetTeamName;
        
        console.log('Is target home?', isTargetHome, 'Is target away?', isTargetAway);
        
        if (!isTargetHome && !isTargetAway) {
            console.log('Target team not found in match:', targetTeamName, 'vs', homeClubName, '&', awayClubName);
            return [];
        }

        const homeLineup = matchData.lineup.home;
        const awayLineup = matchData.lineup.away;
        const homePlayerIds = Object.getOwnPropertyNames(homeLineup);
        const awayPlayerIds = Object.getOwnPropertyNames(awayLineup);
        
        const homePlayer = new Map();
        const awayPlayer = new Map();
        
        homePlayerIds.forEach((playerId) => {
            homePlayer.set(playerId, homeLineup[playerId].name);
        });
        awayPlayerIds.forEach((playerId) => {
            awayPlayer.set(playerId, awayLineup[playerId].name);
        });

        let eventReport = [];
        
        // Add starting tactics info for target team only
        if (isTargetHome) {
            const homeStartStyle = matchData.match_data.attacking_style.home === "0" ? "1" : matchData.match_data.attacking_style.home;
            const homeStartMentality = matchData.match_data.mentality.home.toString();
            const homeFocus = matchData.match_data.focus_side.home;
            
            eventReport.push({
                minute: "0",
                type: "tactics",
                content: `Starting - Mentality: ${MENTALITY_MAP.get(homeStartMentality)}, Style: ${STYLE_MAP.get(homeStartStyle)}, Focus: ${FOCUS_MAP.get(homeFocus)}`
            });
        } else if (isTargetAway) {
            const awayStartStyle = matchData.match_data.attacking_style.away === "0" ? "1" : matchData.match_data.attacking_style.away;
            const awayStartMentality = matchData.match_data.mentality.away.toString();
            const awayFocus = matchData.match_data.focus_side.away;
            
            eventReport.push({
                minute: "0",
                type: "tactics",
                content: `Starting - Mentality: ${MENTALITY_MAP.get(awayStartMentality)}, Style: ${STYLE_MAP.get(awayStartStyle)}, Focus: ${FOCUS_MAP.get(awayFocus)}`
            });
        }

        // Process all match events
        Object.keys(report).forEach(function (minute) {
            const minuteArr = report[minute];
            for (let i = 0; i < minuteArr.length; i++) {
                const paramArr = minuteArr[i].parameters;
                if (paramArr) {
                    for (let j = 0; j < paramArr.length; j++) {
                        const paramObj = paramArr[j];
                        
                        // Goals
                        if (paramObj.goal) {
                            const isTargetTeamGoal = (isTargetHome && homePlayer.has(paramObj.goal.player)) || 
                                                     (isTargetAway && awayPlayer.has(paramObj.goal.player));
                            
                            if (isTargetTeamGoal) {
                                let goalStyle = "";
                                let chanceType = minuteArr[i].type;
                                if (chanceType) {
                                    chanceType = chanceType.substring(0, 3);
                                    if (GOAL_STYLE_MAP.has(chanceType)) {
                                        goalStyle = GOAL_STYLE_MAP.get(chanceType);
                                    }
                                }
                                
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                const scorer = playerMap.get(paramObj.goal.player);
                                const assister = paramObj.goal.assist ? playerMap.get(paramObj.goal.assist) : null;
                                
                                eventReport.push({
                                    minute: minute,
                                    type: "goal",
                                    content: `[Goal] ${scorer}${assister ? ` (${assister})` : ""} ${goalStyle ? `[${goalStyle}]` : ""} ${paramObj.goal.score[0]} - ${paramObj.goal.score[1]}`
                                });
                            }
                        }
                        
                        // Yellow cards
                        else if (paramObj.yellow) {
                            const isTargetTeamCard = (isTargetHome && homePlayer.has(paramObj.yellow)) || 
                                                     (isTargetAway && awayPlayer.has(paramObj.yellow));
                            
                            if (isTargetTeamCard) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "yellow",
                                    content: `[Yellow card] ${playerMap.get(paramObj.yellow)}`
                                });
                            }
                        }
                        
                        // Red cards
                        else if (paramObj.red) {
                            const isTargetTeamCard = (isTargetHome && homePlayer.has(paramObj.red)) || 
                                                     (isTargetAway && awayPlayer.has(paramObj.red));
                            
                            if (isTargetTeamCard) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "red",
                                    content: `[Red card] ${playerMap.get(paramObj.red)}`
                                });
                            }
                        }
                        
                        // Double yellow = red
                        else if (paramObj.yellow_red) {
                            const isTargetTeamCard = (isTargetHome && homePlayer.has(paramObj.yellow_red)) || 
                                                     (isTargetAway && awayPlayer.has(paramObj.yellow_red));
                            
                            if (isTargetTeamCard) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "red",
                                    content: `[Red card] (2 yellow cards) ${playerMap.get(paramObj.yellow_red)}`
                                });
                            }
                        }
                        
                        // Tactical changes
                        else if (paramObj.mentality_change) {
                            const targetClubId = isTargetHome ? homeClubId : awayClubId;
                            
                            if (paramObj.mentality_change.team == targetClubId) {
                                if (paramObj.mentality_change.mentality) {
                                    eventReport.push({
                                        minute: minute,
                                        type: "mentality",
                                        content: `[Tactics] Mentality change to ${MENTALITY_MAP.get(paramObj.mentality_change.mentality)}`
                                    });
                                } else if (paramObj.mentality_change.style) {
                                    eventReport.push({
                                        minute: minute,
                                        type: "style",
                                        content: `[Tactics] Attacking style change to ${STYLE_MAP.get(paramObj.mentality_change.style)}`
                                    });
                                }
                            }
                        }
                        
                        // Position changes
                        else if (paramObj.player_change) {
                            const isTargetTeamChange = (isTargetHome && homePlayer.has(paramObj.player_change.player)) || 
                                                       (isTargetAway && awayPlayer.has(paramObj.player_change.player));
                            
                            if (isTargetTeamChange) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "position",
                                    content: `[Position] ${playerMap.get(paramObj.player_change.player)} change to ${paramObj.player_change.position ? paramObj.player_change.position.toUpperCase() : ""}`
                                });
                            }
                        }
                        
                        // Substitutions
                        else if (paramObj.sub && paramObj.sub.player_in && paramObj.sub.player_out) {
                            const isTargetTeamSub = (isTargetHome && homePlayer.has(paramObj.sub.player_in)) || 
                                                    (isTargetAway && awayPlayer.has(paramObj.sub.player_in));
                            
                            if (isTargetTeamSub) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "substitution",
                                    content: `[Substitution] ${playerMap.get(paramObj.sub.player_in)} replace ${playerMap.get(paramObj.sub.player_out)}${paramObj.sub.player_position ? ` and play ${paramObj.sub.player_position.toUpperCase()}` : ""}`
                                });
                            }
                        }
                        
                        // Injuries
                        else if (paramObj.injury) {
                            const isTargetTeamInjury = (isTargetHome && homePlayer.has(paramObj.injury)) || 
                                                       (isTargetAway && awayPlayer.has(paramObj.injury));
                            
                            if (isTargetTeamInjury) {
                                const playerMap = isTargetHome ? homePlayer : awayPlayer;
                                eventReport.push({
                                    minute: minute,
                                    type: "injury",
                                    content: `[Injury] ${playerMap.get(paramObj.injury)}`
                                });
                            }
                        }
                    }
                }
            }
        });

        return eventReport;
    }

    // Enhanced display function with dropdown functionality
    function displayEnhancedMatchList(matches, opponentTeamName) {
        let html = '<div id="tm-match-reports" style="margin: 1px 0; padding: 1px; border: 2px solid #333; background: #333333;">';
        html += '<h2 style="text-align: center; color: #ffffff; margin: 5px; margin-bottom: 8px; font-size: 16px;">Next Opponent Last ' + matches.length + ' Matches</h2>';

        matches.forEach((match, index) => {
            const matchId = `match-${index}`;
            const dropdownId = `dropdown-${index}`;
            
            html += '<div style="margin: 2px 0; padding: 1px; border: 1px solid #ccc; background: #008000; border-radius: 1px; font-size: 14px; line-height: 14px;">';
            
            // Match header with dropdown button
            html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 5px;">';
            html += '<div>';
            html += '<p style="margin: 0; padding-bottom: 5px;">M ' + (index + 1) + ': ' + match.homeTeam + ' ' + match.result + ' ' + match.awayTeam + '</p>';
            html += '<p style="margin: 0; padding-bottom: 5px; font-size: 12px;">Date: ' + match.date + ' | <a href="' + match.matchLink + '" target="_blank">View Match</a></p>';
            html += '</div>';
            
        // Dropdown toggle button
        html += '<button onclick="toggleMatchEvents(\'' + matchId + '\', \'' + dropdownId + '\', \'' + match.matchLink + '\', \'' + opponentTeamName.replace(/'/g, "\\'") + '\')" ';
        html += 'style="background: #006600; color: white; border: 1px solid #004400; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 11px; line-height: 1.2; text-align: center; min-width: 50px;">';
        html += '<div>Show</div><div>Events</div></button>';
            html += '</div>';
            
            // Dropdown content area (initially hidden)
            html += '<div id="' + dropdownId + '" style="display: none; padding: 10px; background: #004d00; border-top: 1px solid #ccc; margin-top: 5px;">';
            html += '<div id="' + dropdownId + '-content">Click "Show Events" to load match details...</div>';
            html += '</div>';
            
            html += '</div>';
        });

        html += '</div>';

        // Insert the enhanced HTML
        const targetElement = document.querySelector('.column2_a .box_footer');
        if (targetElement) {
            targetElement.insertAdjacentHTML('beforebegin', html);
            console.log('Inserted enhanced match list with dropdowns');
        } else {
            console.error('Could not find the target element to insert before');
        }
    }

    // Function to toggle dropdown and load match events
    function toggleMatchEvents(matchId, dropdownId, matchUrl, opponentTeamName) {
        const dropdown = document.getElementById(dropdownId);
        const button = event.target.closest('button'); // Get the button element even if clicked on inner div
        
        if (dropdown.style.display === 'none') {
            // Show dropdown and load events
            dropdown.style.display = 'block';
            button.innerHTML = '<div>Hide</div><div>Events</div>';
            
            const contentDiv = document.getElementById(dropdownId + '-content');
            contentDiv.innerHTML = '<div style="color: yellow;">Loading match events...</div>';
            
            // Load match events
            loadMatchEvents(matchUrl, opponentTeamName, contentDiv);
            
        } else {
            // Hide dropdown
            dropdown.style.display = 'none';
            button.innerHTML = '<div>Show</div><div>Events</div>';
        }
    }

    // Function to load and display match events
    function loadMatchEvents(matchUrl, opponentTeamName, contentDiv) {
        // Extract match ID from URL - fix the extraction logic
        const urlParts = matchUrl.split('/');
        let matchId = '';
        
        // Handle different URL formats
        if (matchUrl.includes('/nt/')) {
            // National team match format
            matchId = 'nt' + urlParts[urlParts.length - 2];
        } else {
            // Regular match format: https://trophymanager.com/matches/170827356/
            for (let i = urlParts.length - 1; i >= 0; i--) {
                if (urlParts[i] && !isNaN(urlParts[i])) {
                    matchId = urlParts[i];
                    break;
                }
            }
        }
        
        console.log('Extracted match ID:', matchId, 'from URL:', matchUrl);
        const ajaxUrl = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', ajaxUrl, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    const data = JSON.parse(this.responseText);
                    const events = processMatchEvents(data, opponentTeamName);
                    displayMatchEvents(events, contentDiv);
                } catch (e) {
                    console.error('Error parsing match data:', e);
                    contentDiv.innerHTML = '<div style="color: red;">Error loading match data</div>';
                }
            } else if (this.readyState == 4) {
                contentDiv.innerHTML = '<div style="color: red;">Failed to load match data (Status: ' + this.status + ')</div>';
            }
        };
        xhr.send();
    }

    // Function to display formatted match events
    function displayMatchEvents(events, contentDiv) {
        if (events.length === 0) {
            contentDiv.innerHTML = '<div style="color: #cccccc;">No events found for this team in this match.</div>';
            return;
        }
        
        let html = '<div style="color: white; font-size: 13px;">';
        
        events.forEach((event, index) => {
            let color = '#ffffff';
            switch (event.type) {
                case 'goal':
                    color = '#00ffff'; // Cyan
                    break;
                case 'yellow':
                    color = '#ffff00'; // Yellow
                    break;
                case 'red':
                    color = '#ff4444'; // Red
                    break;
                case 'mentality':
                    color = '#ff9900'; // Orange
                    break;
                case 'style':
                    color = '#6666ff'; // Blue
                    break;
                case 'position':
                    color = '#99ff99'; // Light green
                    break;
                case 'substitution':
                    color = '#ff99ff'; // Pink
                    break;
                case 'injury':
                    color = '#996633'; // Brown
                    break;
                case 'tactics':
                    color = '#ffcc99'; // Light orange
                    break;
            }
            
            html += '<div style="color: ' + color + '; margin: 3px 0; padding: 2px;">';
            html += event.minute + "': " + event.content;
            html += '</div>';
        });
        
        html += '</div>';
        contentDiv.innerHTML = html;
    }

    // Make functions available globally
    window.toggleMatchEvents = toggleMatchEvents;
    window.loadMatchEvents = loadMatchEvents;
    window.displayMatchEvents = displayMatchEvents;

    // Main function to get match history
    async function generateMatchReports() {
        addStatusIndicator('Starting match report generation...');

        const currentTeam = getOpponentId();
        if (!currentTeam) {
            addStatusIndicator('Error: Could not find team name');
            return;
        }

        addStatusIndicator('Found team: ' + currentTeam);

        const url = await getLeagueUrlFromAnotherPage();
        if (!url) {
            addStatusIndicator('Error: Could not find league URL');
            return;
        }

        if (url.length < 3) {
            console.error('Invalid league URL structure');
            addStatusIndicator('Error: Invalid league URL');
            return;
        }

        addStatusIndicator('Fetching fixtures...');

        // Use jQuery if available, otherwise use vanilla JS
        const requestData = {
            'type': url[LEAGUE],
            'var1': url[COUNTRY],
            'var2': url.length > DIVISION ? url[DIVISION] : '',
            'var3': url.length > GROUP ? url[GROUP] : ''
        };

        if (typeof $ !== 'undefined') {
            // Use jQuery
            $.post(FIXTURES, requestData, function(data) {
                handleFixturesResponse(data, currentTeam);
            }, 'json').fail(function(xhr, status, error) {
                console.error('AJAX request failed:', status, error);
                addStatusIndicator('Error: Failed to fetch fixtures');
            });
        } else {
            // Use vanilla JS
            const xhr = new XMLHttpRequest();
            xhr.open('POST', FIXTURES, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            const formData = Object.keys(requestData)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(requestData[key]))
                .join('&');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            handleFixturesResponse(data, currentTeam);
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                            addStatusIndicator('Error: Invalid response data');
                        }
                    } else {
                        console.error('Request failed with status:', xhr.status);
                        addStatusIndicator('Error: Failed to fetch fixtures');
                    }
                }
            };

            xhr.send(formData);
        }
    }

    function handleFixturesResponse(data, currentTeam) {
        console.log('Fixtures data received:', data);

        if (data != null) {
            addStatusIndicator('Processing fixtures...');
            const fixtures = filterFixtures(data);
            const teamMatches = getTeamMatches(fixtures, currentTeam);

            if (teamMatches.length === 0) {
                addStatusIndicator('No matches found for ' + currentTeam);
                console.log('No completed matches found for team:', currentTeam);
                return;
            }

            addStatusIndicator('Found ' + teamMatches.length + ' matches. Displaying...');
            displayEnhancedMatchList(teamMatches, currentTeam);
            addStatusIndicator('Complete! Found ' + teamMatches.length + ' matches with events');

            // Remove status after 5 seconds
            setTimeout(() => {
                const statusDiv = document.getElementById('tm-reports-status');
                if (statusDiv) statusDiv.remove();
            }, 5000);
        } else {
            console.error('No fixtures data received');
            addStatusIndicator('Error: No fixtures data');
        }
    }

    // Wait for page to load
    function waitForReady() {
        console.log('Waiting for page to be ready...');
        addStatusIndicator('Page loading, please wait...');

        // Give the page more time to fully load
        setTimeout(generateMatchReports, 3000);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForReady);
    } else {
        waitForReady();
    }

    console.log('TM Last Five Match Reports Enhanced script initialized');
})();
