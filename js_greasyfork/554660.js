// ==UserScript==
// @name         Duolingo League Data Simulator (Educational)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  EDUCATIONAL: Simulates league promotion by modifying API responses in memory and persisting state. No DOM changes.
// @author       Grok
// @match        https://www.duolingo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554660/Duolingo%20League%20Data%20Simulator%20%28Educational%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554660/Duolingo%20League%20Data%20Simulator%20%28Educational%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURATION ===
    const SIMULATED_XP_BOOST = 50000;
    const PERSIST_KEY = 'duolingo_league_simulation_v5';
    const LEAGUES = ['Bronze', 'Silver', 'Gold', 'Sapphire', 'Ruby', 'Emerald', 'Amethyst', 'Pearl', 'Obsidian', 'Diamond'];

    // Load persisted simulation state
    let simulation = { enabled: false, targetLeague: null, xp: 0, rank: 1 };
    try {
        const stored = localStorage.getItem(PERSIST_KEY);
        if (stored) simulation = JSON.parse(stored);
    } catch (e) { console.warn('[EduSim] Failed to load persisted state', e); }

    // === CORE: Response Interceptor ===
    const { fetch: originalFetch } = window;

    window.fetch = async function (input, init) {
        const url = typeof input === 'string' ? input : input.url;

        // Target only league-related API calls
        const isLeagueAPI = url.includes('/api/1/') && (
            url.includes('leaderboards') ||
            url.includes('points_ranking') ||
            url.includes('league')
        );

        const response = await originalFetch(input, init);

        if (!isLeagueAPI || !simulation.enabled) return response;

        try {
            const cloned = response.clone();
            const data = await cloned.json();

            // === EDUCATIONAL MUTATION ===
            let modified = false;

            // Find current league
            let currentLeague = 'Bronze';
            if (data.league?.name) currentLeague = data.league.name;
            else if (data.leaderboard?.league) currentLeague = data.leaderboard.league;

            const currentIdx = LEAGUES.indexOf(currentLeague);
            const targetIdx = LEAGUES.indexOf(simulation.targetLeague);

            if (currentIdx >= 0 && targetIdx > currentIdx) {
                // Promote league
                if (data.league) data.league.name = simulation.targetLeague;
                if (data.leaderboard) data.leaderboard.league = simulation.targetLeague;

                // Modify user entry in points_ranking_data
                if (Array.isArray(data.points_ranking_data)) {
                    const userEntry = data.points_ranking_data.find(e => e.is_me);
                    if (userEntry) {
                        userEntry.league_name = simulation.targetLeague;
                        userEntry.total_xp = simulation.xp;
                        userEntry.ranking = simulation.rank;
                        modified = true;
                    }
                }

                // Fallback: modify top-level user
                if (data.user) {
                    data.user.xp = simulation.xp;
                    data.user.rank = simulation.rank;
                    modified = true;
                }

                if (modified) {
                    console.log(`[EduSim] Simulated promotion: ${currentLeague} → ${simulation.targetLeague}`);
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }
            }
        } catch (e) {
            console.warn('[EduSim] Failed to parse/modify response', e);
        }

        return response;
    };

    // === CONTROL PANEL (Injected via Console Command) ===
    window.duolingoSim = {
        enable: (targetLeague = 'Diamond') => {
            if (!LEAGUES.includes(targetLeague)) {
                console.error('[EduSim] Invalid league:', targetLeague);
                return;
            }
            simulation.enabled = true;
            simulation.targetLeague = targetLeague;
            simulation.xp = 99999 + SIMULATED_XP_BOOST;
            simulation.rank = 1;
            saveState();
            console.log(`[EduSim] ENABLED → ${targetLeague} with ${simulation.xp} XP`);
            alert(`Simulation ACTIVE: You are now #1 in ${targetLeague}.\nRefresh leagues to see effect.`);
        },
        disable: () => {
            simulation.enabled = false;
            saveState();
            console.log('[EduSim] Simulation DISABLED');
            alert('Simulation stopped. Refresh to revert.');
        },
        status: () => console.log('[EduSim] Current state:', simulation)
    };

    function saveState() {
        localStorage.setItem(PERSIST_KEY, JSON.stringify(simulation));
    }

    // Auto-restore on page load
    if (simulation.enabled) {
        console.log(`[EduSim] Restored simulation: #1 in ${simulation.targetLeague}`);
    }

    // === INSTRUCTIONS (Logged on First Load) ===
    setTimeout(() => {
        if (!localStorage.getItem('duolingo_sim_instructions_shown')) {
            console.log('%c🎓 DUOLINGO LEAGUE SIMULATOR (EDUCATIONAL)', 'font-size:14px; font-weight:bold; color:#58cc02');
            console.log('Open Dev Console (F12) and run:');
            console.log('%cduolingoSim.enable("Diamond")', 'color:#ff4500; font-weight:bold');
            console.log('%cduolingoSim.disable()', 'color:#666');
            console.log('Changes are local only. Study the code to learn fetch interception!');
            localStorage.setItem('duolingo_sim_instructions_shown', 'true');
        }
    }, 2000);

})();