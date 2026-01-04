// ==UserScript==
// @name         Degen Idle - XP Tracker
// @namespace    http://tampermonkey.net/
// @version      4.0.1
// @description  Advanced XP tracking and crafting optimization for Degen Idle
// @author       Seisen
// @match        https://degenidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=degenidle.com
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/constants.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/game-database.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/database-loader.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/item-data-engine.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/api-handler.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/state-manager-enhanced.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/ui-manager-enhanced.js
// @require      https://cdn.jsdelivr.net/gh/Seisen99/Degen-Idle-XP-Tracker@add4dfd4c493e851a891d56b05fa5276a1f2dace/v3/modules/optimizer.js
// @downloadURL https://update.greasyfork.org/scripts/555510/Degen%20Idle%20-%20XP%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/555510/Degen%20Idle%20-%20XP%20Tracker.meta.js
// ==/UserScript==

// ============================================
// MAIN INITIALIZATION
// ============================================

(function() {
    'use strict';

    console.log('═══════════════════════════════════════════════════════');
    console.log('Degen Idle XP Tracker v4.0.1');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Loading modules from CDN...');
    console.log('═══════════════════════════════════════════════════════');
    
    async function init() {
        console.log('[INIT] Starting XP Tracker v4.0.1...');

        // Verify modules are loaded
        if (!GAME_DATABASE_DATA) {
            console.error('[INIT] Game database not loaded from CDN!');
            return;
        }

        // Initialize game database with CDN data
        GameDB.data = GAME_DATABASE_DATA;
        console.log(`[GameDB] Loaded ${GameDB.data.total_items} items (v${GameDB.data.version})`);

        // Initialize API handler (sets up token capture + polling)
        APIHandler.init();

        // Initialize state
        State.init();

        // Initialize UI (includes navbar button injection)
        UI.init();

        console.log('[INIT] XP Tracker v4.0.1 ready!');
        console.log('[INIT] Navbar button "XP Tracker" added to game interface');
        console.log('[INIT] Waiting for token capture to start data polling...');
        console.log('[INIT] Press Alt+X to toggle panel or click navbar button');
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
