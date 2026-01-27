// ==UserScript==
// @name         Monsters Wrath Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Helper tool for Monsters Wrath game - autofill, calculations, and more
// @author       You
// @match        https://www.monsterswrath.com/*
// @match        https://monsterswrath.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/563318/Monsters%20Wrath%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563318/Monsters%20Wrath%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // WEAPONS DATA
    // ============================================================================
    // Data structure: { type, name, htmlTag, strength, cost, efficiency, sellback }
    const WEAPONS_DATA = [
        // Attack weapons
        { type: 'attack', name: 'Infantry', htmlTag: 'w1', strength: 55000, cost: 250000, efficiency: 2.2, sellback: 0.4 },
        { type: 'attack', name: 'Pzycho Blade', htmlTag: 'w2', strength: 85000, cost: 500000, efficiency: 1.7, sellback: 0.5 },
        { type: 'attack', name: 'Blazing Cleaver', htmlTag: 'w3', strength: 130000, cost: 1000000, efficiency: 1.3, sellback: 0.65 },
        { type: 'attack', name: 'Bloodzerker Sword', htmlTag: 'w4', strength: 200000, cost: 2000000, efficiency: 1, sellback: 0.75 },
        { type: 'attack', name: 'Obsidian Claws', htmlTag: 'w5', strength: 300000, cost: 4000000, efficiency: 0.8, sellback: 0.8 },
        { type: 'attack', name: 'Legendary Blade', htmlTag: 'l1', strength: 145000, cost: 800000, efficiency: 1.8, sellback: 0.6 },
        { type: 'attack', name: 'Devastating Sword', htmlTag: 'l2', strength: 210000, cost: 1500000, efficiency: 1.4, sellback: 0.8 },
        
        // Defense weapons
        { type: 'defense', name: 'Spike', htmlTag: 'w1', strength: 55000, cost: 250000, efficiency: 2.2, sellback: 0.4 },
        { type: 'defense', name: 'Pzycho Shield', htmlTag: 'w2', strength: 85000, cost: 500000, efficiency: 1.7, sellback: 0.5 },
        { type: 'defense', name: 'Blazing Armour', htmlTag: 'w3', strength: 130000, cost: 1000000, efficiency: 1.3, sellback: 0.65 },
        { type: 'defense', name: 'Bloodzerker Hide', htmlTag: 'w4', strength: 200000, cost: 2000000, efficiency: 1, sellback: 0.75 },
        { type: 'defense', name: 'Obsidian Wall', htmlTag: 'w5', strength: 300000, cost: 4000000, efficiency: 0.8, sellback: 0.8 },
        { type: 'defense', name: 'Legendary Shield', htmlTag: 'l1', strength: 145000, cost: 800000, efficiency: 1.8, sellback: 0.6 },
        { type: 'defense', name: 'Devastating Hide', htmlTag: 'l2', strength: 210000, cost: 1500000, efficiency: 1.4, sellback: 0.8 },
        
        // Stealth weapons
        { type: 'stealth', name: 'Scout', htmlTag: 'w1', strength: 2750, cost: 250000, efficiency: 2.2, sellback: 0.4 },
        { type: 'stealth', name: "Mantle's Drone", htmlTag: 'w2', strength: 4250, cost: 500000, efficiency: 1.7, sellback: 0.5 },
        { type: 'stealth', name: "Razor's Blade", htmlTag: 'w3', strength: 6500, cost: 1000000, efficiency: 1.3, sellback: 0.65 },
        { type: 'stealth', name: 'Bloodmage Cloak', htmlTag: 'w4', strength: 10000, cost: 2000000, efficiency: 1, sellback: 0.75 },
        { type: 'stealth', name: 'Death Scythe', htmlTag: 'w5', strength: 15000, cost: 4000000, efficiency: 0.8, sellback: 0.8 },
        { type: 'stealth', name: 'Legendary Drone', htmlTag: 'l1', strength: 7250, cost: 800000, efficiency: 1.8, sellback: 0.6 },
        { type: 'stealth', name: 'Devastating Cloak', htmlTag: 'l2', strength: 10500, cost: 1500000, efficiency: 1.4, sellback: 0.8 },
        
        // Security (Surveillance) weapons
        { type: 'security', name: 'Sensor', htmlTag: 'w1', strength: 2750, cost: 250000, efficiency: 2.2, sellback: 0.4 },
        { type: 'security', name: "Mantle's Infared", htmlTag: 'w2', strength: 4250, cost: 500000, efficiency: 1.7, sellback: 0.5 },
        { type: 'security', name: "Razor's Radar", htmlTag: 'w3', strength: 6500, cost: 1000000, efficiency: 1.3, sellback: 0.65 },
        { type: 'security', name: 'Bloodmage Staff', htmlTag: 'w4', strength: 10000, cost: 2000000, efficiency: 1, sellback: 0.75 },
        { type: 'security', name: 'Death Tower', htmlTag: 'w5', strength: 15000, cost: 4000000, efficiency: 0.8, sellback: 0.8 },
        { type: 'security', name: 'Legendary Radar', htmlTag: 'l1', strength: 7250, cost: 800000, efficiency: 1.8, sellback: 0.6 },
        { type: 'security', name: 'Devastating Staff', htmlTag: 'l2', strength: 10500, cost: 1500000, efficiency: 1.4, sellback: 0.8 }
    ];

    // ============================================================================
    // UPGRADES DATA
    // ============================================================================
    // Data structure: { type, appliesTo, level, name, cost, multiplier, bonusPoints }
    // type: 'skirmish', 'resistance', 'sleeper', 'surveillance', 'technology'
    // appliesTo: 'attack', 'defense', 'stealth', 'security', 'all four'
    // Helper function to add totalCost to upgrade arrays
    function addTotalCost(upgradeArray) {
        let totalCost = 0;
        return upgradeArray.map(upgrade => {
            totalCost += upgrade.cost;
            return { ...upgrade, totalCost: totalCost };
        });
    }
    
    const UPGRADES_DATA = {
        skirmish: addTotalCost([
            { level: 0, name: 'Sticks', cost: 0, multiplier: 1.00 },
            { level: 1, name: 'Daggers', cost: 250000, multiplier: 1.10 },
            { level: 2, name: 'Claws', cost: 500000, multiplier: 1.22 },
            { level: 3, name: 'Clubs', cost: 1000000, multiplier: 1.37 },
            { level: 4, name: 'Maces', cost: 2000000, multiplier: 1.55 },
            { level: 5, name: 'Nunchucks', cost: 4000000, multiplier: 1.76 },
            { level: 6, name: 'Switch Blades', cost: 8000000, multiplier: 2.03 },
            { level: 7, name: 'Knives', cost: 16000000, multiplier: 2.35 },
            { level: 8, name: 'Bayonets', cost: 32000000, multiplier: 2.75 },
            { level: 9, name: 'Swords', cost: 64000000, multiplier: 3.24 },
            { level: 10, name: 'Axes', cost: 128000000, multiplier: 3.86 },
            { level: 11, name: 'Lasers', cost: 256000000, multiplier: 4.63 },
            { level: 12, name: 'Pistols', cost: 512000000, multiplier: 5.61 },
            { level: 13, name: 'Outriders', cost: 1024000000, multiplier: 6.84 },
            { level: 14, name: 'Flamethrowers', cost: 2048000000, multiplier: 8.41 },
            { level: 15, name: 'Grenades', cost: 4096000000, multiplier: 10.43 },
            { level: 16, name: 'Molotov Cocktails', cost: 8192000000, multiplier: 13.04 },
            { level: 17, name: 'Rockets', cost: 16384000000, multiplier: 16.43 },
            { level: 18, name: 'Cannons', cost: 32768000000, multiplier: 20.87 },
            { level: 19, name: 'Snipers', cost: 65536000000, multiplier: 26.71 },
            { level: 20, name: 'Plasma Rifles', cost: 131072000000, multiplier: 34.45 },
            { level: 21, name: 'Rapid Fire', cost: 262144000000, multiplier: 44.79 },
            { level: 22, name: 'Bolts from Heaven', cost: 524288000000, multiplier: 58.67 },
            { level: 23, name: 'Incendiary', cost: 1048576000000, multiplier: 77.45 },
            { level: 24, name: 'Doomsday', cost: 2097152000000, multiplier: 103.01 },
            { level: 25, name: 'Genocide', cost: 4194304000000, multiplier: 138.03 }
        ]),
        resistance: addTotalCost([
            { level: 0, name: 'Tent', cost: 0, multiplier: 1.00 },
            { level: 1, name: 'Hut', cost: 250000, multiplier: 1.10 },
            { level: 2, name: 'Shack', cost: 500000, multiplier: 1.22 },
            { level: 3, name: 'Cabin', cost: 1000000, multiplier: 1.37 },
            { level: 4, name: 'Townhouse', cost: 2000000, multiplier: 1.55 },
            { level: 5, name: 'Moat', cost: 4000000, multiplier: 1.76 },
            { level: 6, name: 'Drawbridge', cost: 8000000, multiplier: 2.03 },
            { level: 7, name: 'Towers', cost: 16000000, multiplier: 2.35 },
            { level: 8, name: 'Keep', cost: 32000000, multiplier: 2.75 },
            { level: 9, name: 'Stockade', cost: 64000000, multiplier: 3.24 },
            { level: 10, name: 'Moat', cost: 128000000, multiplier: 3.86 },
            { level: 11, name: 'Barricades', cost: 256000000, multiplier: 4.63 },
            { level: 12, name: 'Stone Walls', cost: 512000000, multiplier: 5.61 },
            { level: 13, name: 'Sunken Colony', cost: 1024000000, multiplier: 6.84 },
            { level: 14, name: 'Blockhouse', cost: 2048000000, multiplier: 8.41 },
            { level: 15, name: 'Palace', cost: 4096000000, multiplier: 10.43 },
            { level: 16, name: 'Land Mines', cost: 8192000000, multiplier: 13.04 },
            { level: 17, name: 'Castle', cost: 16384000000, multiplier: 16.43 },
            { level: 18, name: 'Citadel', cost: 32768000000, multiplier: 20.87 },
            { level: 19, name: 'Guardian', cost: 65536000000, multiplier: 26.71 },
            { level: 20, name: 'Parliament', cost: 131072000000, multiplier: 34.45 },
            { level: 21, name: 'Fortress', cost: 262144000000, multiplier: 44.79 },
            { level: 22, name: 'The Void', cost: 524288000000, multiplier: 58.67 },
            { level: 23, name: 'Labyrinth', cost: 1048576000000, multiplier: 77.45 },
            { level: 24, name: 'Kingdom', cost: 2097152000000, multiplier: 103.01 },
            { level: 25, name: 'Heaven', cost: 4194304000000, multiplier: 138.03 }
        ]),
        sleeper: addTotalCost([
            { level: 0, name: 'Scouts', cost: 0, multiplier: 1.00 },
            { level: 1, name: 'Spies', cost: 250000, multiplier: 18.33 },
            { level: 2, name: 'Coverts', cost: 500000, multiplier: 20.35 },
            { level: 3, name: 'Investigators', cost: 1000000, multiplier: 22.79 },
            { level: 4, name: 'Drones', cost: 2000000, multiplier: 25.75 },
            { level: 5, name: 'Cloaks', cost: 4000000, multiplier: 29.36 },
            { level: 6, name: 'Night Vision', cost: 8000000, multiplier: 33.76 },
            { level: 7, name: 'Agent Handlers', cost: 16000000, multiplier: 39.17 },
            { level: 8, name: 'Coders', cost: 32000000, multiplier: 45.82 },
            { level: 9, name: 'Hackers', cost: 64000000, multiplier: 54.07 },
            { level: 10, name: 'PSI Force', cost: 128000000, multiplier: 64.35 },
            { level: 11, name: 'Kinesis', cost: 256000000, multiplier: 77.21 },
            { level: 12, name: 'Ninjas', cost: 512000000, multiplier: 93.43 },
            { level: 13, name: 'Assassins', cost: 1024000000, multiplier: 113.98 },
            { level: 14, name: 'Silencer', cost: 2048000000, multiplier: 140.20 },
            { level: 15, name: 'Stealth Tanks', cost: 4096000000, multiplier: 173.85 },
            { level: 16, name: 'Hunter Seeker Drones', cost: 8192000000, multiplier: 217.31 },
            { level: 17, name: 'Brainwave Overload', cost: 16384000000, multiplier: 273.81 },
            { level: 18, name: 'Detectives', cost: 32768000000, multiplier: 347.74 },
            { level: 19, name: 'Clairvoyance', cost: 65536000000, multiplier: 445.11 },
            { level: 20, name: 'Interrogators', cost: 131072000000, multiplier: 574.19 },
            { level: 21, name: 'Cloaking Device', cost: 262144000000, multiplier: 746.45 },
            { level: 22, name: 'Mindfray', cost: 524288000000, multiplier: 977.85 },
            { level: 23, name: 'Special Forces', cost: 1048576000000, multiplier: 1290.76 },
            { level: 24, name: 'Psychic Energy', cost: 2097152000000, multiplier: 1716.71 },
            { level: 25, name: 'Black Ops', cost: 4194304000000, multiplier: 2300.39 }
        ]),
        surveillance: addTotalCost([
            { level: 0, name: 'Watch Towers', cost: 0, multiplier: 1.00 },
            { level: 1, name: 'Sentry Towers', cost: 250000, multiplier: 18.33 },
            { level: 2, name: 'Trip Wires', cost: 500000, multiplier: 20.35 },
            { level: 3, name: 'Radars', cost: 1000000, multiplier: 22.79 },
            { level: 4, name: 'Guard Dogs', cost: 2000000, multiplier: 25.75 },
            { level: 5, name: 'Infrared', cost: 4000000, multiplier: 29.36 },
            { level: 6, name: 'Motion Sensors', cost: 8000000, multiplier: 33.76 },
            { level: 7, name: 'Alarms', cost: 16000000, multiplier: 39.17 },
            { level: 8, name: 'Force Shields', cost: 32000000, multiplier: 45.82 },
            { level: 9, name: 'Intuition', cost: 64000000, multiplier: 54.07 },
            { level: 10, name: 'Radar Jammer', cost: 128000000, multiplier: 64.35 },
            { level: 11, name: 'Psychic Beacon', cost: 256000000, multiplier: 77.21 },
            { level: 12, name: 'PSI Resistance', cost: 512000000, multiplier: 93.43 },
            { level: 13, name: 'Security Cameras', cost: 1024000000, multiplier: 113.98 },
            { level: 14, name: 'Atoms', cost: 2048000000, multiplier: 140.20 },
            { level: 15, name: 'Sea of Mist', cost: 4096000000, multiplier: 173.85 },
            { level: 16, name: 'Relay Nodes', cost: 8192000000, multiplier: 217.31 },
            { level: 17, name: 'Communication Waves', cost: 16384000000, multiplier: 273.81 },
            { level: 18, name: 'Satellites', cost: 32768000000, multiplier: 347.74 },
            { level: 19, name: 'Interceptors', cost: 65536000000, multiplier: 445.11 },
            { level: 20, name: 'Hyperdrive', cost: 131072000000, multiplier: 574.19 },
            { level: 21, name: 'Iron Curtain', cost: 262144000000, multiplier: 746.45 },
            { level: 22, name: 'Sensory Deprivation', cost: 524288000000, multiplier: 977.85 },
            { level: 23, name: 'Thermal Technology', cost: 1048576000000, multiplier: 1290.76 },
            { level: 24, name: 'Dark Matter', cost: 2097152000000, multiplier: 1716.71 },
            { level: 25, name: 'Mystic Energy', cost: 4194304000000, multiplier: 2300.39 }
        ]),
        technology: addTotalCost([
            { level: 0, name: 'Retreat', cost: 0, multiplier: 1.00 },
            { level: 1, name: 'Vandalizer', cost: 250000, multiplier: 1.05 },
            { level: 2, name: 'Ravanger', cost: 500000, multiplier: 1.10 },
            { level: 3, name: 'Indoctrinator', cost: 1000000, multiplier: 1.16 },
            { level: 4, name: 'Ambusher', cost: 2000000, multiplier: 1.23 },
            { level: 5, name: 'Treacherer', cost: 4000000, multiplier: 1.30 },
            { level: 6, name: 'Corruptor', cost: 8000000, multiplier: 1.38 },
            { level: 7, name: 'Smasher', cost: 16000000, multiplier: 1.46 },
            { level: 8, name: 'Diversionist', cost: 32000000, multiplier: 1.56 },
            { level: 9, name: 'Disputor', cost: 64000000, multiplier: 1.66 },
            { level: 10, name: 'Pulverizer', cost: 128000000, multiplier: 1.77 },
            { level: 11, name: 'Bounty Hunter', cost: 256000000, multiplier: 1.90 },
            { level: 12, name: 'Avenger', cost: 512000000, multiplier: 2.03 },
            { level: 13, name: 'Inflictor', cost: 1024000000, multiplier: 2.19 },
            { level: 14, name: 'Demolisher', cost: 2048000000, multiplier: 2.35 },
            { level: 15, name: 'Decimation', cost: 4096000000, multiplier: 2.53 },
            { level: 16, name: 'Incinerator', cost: 8192000000, multiplier: 2.74 },
            { level: 17, name: 'Eradicator', cost: 16384000000, multiplier: 2.96 },
            { level: 18, name: 'Onslaught', cost: 32768000000, multiplier: 3.21 },
            { level: 19, name: 'Butcherer', cost: 65536000000, multiplier: 3.49 },
            { level: 20, name: 'Impaler', cost: 131072000000, multiplier: 3.79 },
            { level: 21, name: 'Mutilator', cost: 262144000000, multiplier: 4.13 },
            { level: 22, name: 'Berserker', cost: 524288000000, multiplier: 4.52 },
            { level: 23, name: 'Destroyer', cost: 1048576000000, multiplier: 4.94 },
            { level: 24, name: 'Decimator', cost: 2097152000000, multiplier: 5.41 },
            { level: 25, name: 'Devastator', cost: 4194304000000, multiplier: 5.94 },
            { level: 26, name: 'Annihilator', cost: 8388608000000, multiplier: 6.69 }
        ])
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    /**
     * Parse a number string with commas (e.g., "39,143,791,272" -> 39143791272)
     */
    function parseNumber(str) {
        return parseInt(str.replace(/,/g, ''), 10);
    }

    /**
     * Format a number with abbreviations (m, b, t, q) to 2 decimal places
     * Examples: 1,500,000 -> "1.50m", 2,500,000,000 -> "2.50b"
     */
    function formatNumber(num) {
        if (num === 0) return '0';
        
        const absNum = Math.abs(num);
        let formatted = '';
        
        if (absNum >= 1000000000000000) { // Quadrillion
            formatted = (num / 1000000000000000).toFixed(2) + 'q';
        } else if (absNum >= 1000000000000) { // Trillion
            formatted = (num / 1000000000000).toFixed(2) + 't';
        } else if (absNum >= 1000000000) { // Billion
            formatted = (num / 1000000000).toFixed(2) + 'b';
        } else if (absNum >= 1000000) { // Million
            formatted = (num / 1000000).toFixed(2) + 'm';
        } else {
            // For numbers less than 1 million, use comma formatting
            formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        return formatted;
    }
    
    /**
     * Format a number with commas (no abbreviations)
     * Examples: 1500000 -> "1,500,000"
     */
    function formatNumberWithCommas(num) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        return num.toLocaleString();
    }

    /**
     * Get weapon by name and type
     */
    function getWeapon(name, type) {
        return WEAPONS_DATA.find(w => w.name === name && w.type === type);
    }

    /**
     * Get all weapons of a specific type
     */
    function getWeaponsByType(type) {
        return WEAPONS_DATA.filter(w => w.type === type);
    }

    /**
     * Get weapon by HTML tag (e.g., 'w1', 'l2')
     */
    function getWeaponByHtmlTag(htmlTag) {
        return WEAPONS_DATA.find(w => w.htmlTag === htmlTag);
    }

    // ============================================================================
    // FEATURE TOGGLES
    // ============================================================================
    
    const FEATURE_TOGGLES_KEY = 'featureToggles';
    
    /**
     * Get all feature toggles (defaults to all enabled)
     */
    function getFeatureToggles() {
        const defaults = {
            'armoryAutofill': true,
            'upgradeCalculator': true,
            'legendsTimer': true,
            'incomeUpSnapshot': true,
            'commandCenterStats': true,
            'headToHeadStats': true
        };
        const stored = GM_getValue(FEATURE_TOGGLES_KEY, {});
        // Merge stored values with defaults, ensuring all features have a value
        const toggles = { ...defaults, ...stored };
        // Return all features, preserving explicit false values
        return {
            'armoryAutofill': toggles.armoryAutofill !== false,
            'upgradeCalculator': toggles.upgradeCalculator !== false,
            'legendsTimer': toggles.legendsTimer !== false,
            'incomeUpSnapshot': toggles.incomeUpSnapshot !== false,
            'commandCenterStats': toggles.commandCenterStats !== false,
            'headToHeadStats': toggles.headToHeadStats !== false
        };
    }
    
    /**
     * Get a specific feature toggle
     */
    function isFeatureEnabled(featureName) {
        const toggles = getFeatureToggles();
        // Check if the toggle exists and is explicitly set
        if (toggles.hasOwnProperty(featureName)) {
            return toggles[featureName] !== false;
        }
        // Default to true if not set
        return true;
    }
    
    /**
     * Set a feature toggle
     */
    function setFeatureToggle(featureName, enabled) {
        // Get the raw stored values (not processed)
        const defaults = {
            'armoryAutofill': true,
            'upgradeCalculator': true,
            'legendsTimer': true,
            'incomeUpSnapshot': true,
            'commandCenterStats': true,
            'headToHeadStats': true
        };
        const stored = GM_getValue(FEATURE_TOGGLES_KEY, {});
        // Merge with defaults to ensure all features exist
        const toggles = { ...defaults, ...stored };
        // Update the specific feature
        toggles[featureName] = enabled;
        // Save the updated toggles
        GM_setValue(FEATURE_TOGGLES_KEY, toggles);
        console.log(`Saved feature toggle: ${featureName} = ${enabled}, all toggles:`, toggles);
    }
    
    /**
     * Feature descriptions for help tooltips
     */
    const FEATURE_DESCRIPTIONS = {
        'armoryAutofill': 'Automatically fills weapon purchase quantities based on your saved preferences and available gold. Set your preferred weapon percentages in the preferences section below.',
        'upgradeCalculator': 'Displays recommendations on the upgrades page showing when it\'s more efficient to buy upgrades versus weapons. Also calculates sell-off options if you need to sell weapons to afford an upgrade.',
        'incomeUpSnapshot': 'Captures income and unit production data from the battlefield by comparing values between two consecutive turns. Displays the calculated values on the Top Stats page. Note: Income shown is only displayed gold stashed (not banked income), but stashed gold is a good proxy for understanding total income.',
        'legendsTimer': 'Displays time overlays on the Legends page showing total time needed and a live countdown for each unsought legend. Requires mana production data from Command Center.',
        'commandCenterStats': 'Displays a compact overlay on the Command Center page showing Total Gold Revenue, Total Unit Revenue, and Mana Produced in one convenient location.',
        'headToHeadStats': 'Tracks gold stolen from and lost to each player in battle logs. Provides head-to-head statistics and attack summaries.'
    };
    
    // ============================================================================
    // PREFERENCES MANAGEMENT
    // ============================================================================
    
    const PREF_KEY = 'armoryPreferences';
    const SNAPSHOT_DISPLAY_PREF_KEY = 'snapshotDisplayPreferences';
    
    /**
     * Get saved armory preferences
     * Returns: { weaponKey: percentage, ... }
     * weaponKey format: "type-name" (e.g., "attack-Devastating Sword")
     */
    function getPreferences() {
        return GM_getValue(PREF_KEY, {});
    }

    /**
     * Save armory preferences
     */
    function savePreferences(prefs) {
        GM_setValue(PREF_KEY, prefs);
    }
    
    /**
     * Get snapshot display preferences
     * Returns: { showOnBattlefield: boolean, showOnTopStats: boolean }
     */
    function getSnapshotDisplayPreferences() {
        return GM_getValue(SNAPSHOT_DISPLAY_PREF_KEY, { showOnBattlefield: true, showOnTopStats: true });
    }
    
    /**
     * Save snapshot display preferences
     */
    function saveSnapshotDisplayPreferences(prefs) {
        GM_setValue(SNAPSHOT_DISPLAY_PREF_KEY, prefs);
    }

    /**
     * Get weapon key for preferences
     */
    function getWeaponKey(type, name) {
        return `${type}-${name}`;
    }

    // ============================================================================
    // ARMORY AUTOFILL
    // ============================================================================
    
    /**
     * Read current gold amount from the page
     */
    function getCurrentGold() {
        const goldElement = document.getElementById('data-gold');
        if (!goldElement) {
            console.error('Could not find gold element');
            return 0;
        }
        const goldText = goldElement.textContent.trim();
        return parseNumber(goldText);
    }

    /**
     * Get input element for a weapon purchase
     */
    function getWeaponInput(type, htmlTag) {
        // Map our internal type names to HTML type names
        // Security weapons use "magic" in the HTML, not "security"
        const htmlTypeMap = {
            'security': 'magic',
            'attack': 'attack',
            'defense': 'defense',
            'stealth': 'stealth'
        };
        const htmlType = htmlTypeMap[type] || type;
        const inputId = `buy-${htmlType}-${htmlTag}`;
        return document.getElementById(inputId);
    }

    /**
     * Calculate weapon purchases based on preferences and available gold
     */
    function calculatePurchases(gold, preferences) {
        const purchases = {};
        const totalPercentage = Object.values(preferences).reduce((sum, p) => sum + p, 0);
        
        console.log('calculatePurchases - Gold:', gold, 'Preferences:', preferences, 'Total %:', totalPercentage);
        
        if (totalPercentage === 0) {
            console.warn('No preferences set or all percentages are 0');
            return purchases;
        }

        // Normalize percentages to sum to 100%
        const normalizedPrefs = {};
        for (const [key, percentage] of Object.entries(preferences)) {
            normalizedPrefs[key] = (percentage / totalPercentage) * 100;
        }

        console.log('Normalized preferences:', normalizedPrefs);

        // Calculate purchases for each preferred weapon
        for (const [weaponKey, percentage] of Object.entries(normalizedPrefs)) {
            // Split on first hyphen only (in case weapon name has hyphens)
            const firstDashIndex = weaponKey.indexOf('-');
            if (firstDashIndex === -1) {
                console.warn(`Invalid weapon key format: ${weaponKey}`);
                continue;
            }
            
            const type = weaponKey.substring(0, firstDashIndex);
            const name = weaponKey.substring(firstDashIndex + 1);
            
            console.log(`Looking up weapon: type="${type}", name="${name}"`);
            
            const weapon = getWeapon(name, type);
            
            if (!weapon) {
                console.warn(`Weapon not found: ${name} (${type})`);
                continue;
            }

            console.log(`Found weapon: ${weapon.name}, cost: ${weapon.cost}, htmlTag: ${weapon.htmlTag}`);

            // Calculate gold allocation for this weapon
            const allocatedGold = (gold * percentage) / 100;
            
            // Calculate how many we can buy
            const quantity = Math.floor(allocatedGold / weapon.cost);
            
            console.log(`Allocated ${allocatedGold} gold (${percentage}%), can buy ${quantity} units`);
            
            if (quantity > 0) {
                purchases[weaponKey] = {
                    type: weapon.type,
                    htmlTag: weapon.htmlTag,
                    quantity: quantity,
                    cost: weapon.cost,
                    totalCost: quantity * weapon.cost
                };
            } else {
                console.log(`Cannot afford any ${weapon.name} (need ${weapon.cost}, allocated ${allocatedGold})`);
            }
        }

        console.log('Final purchases:', purchases);
        return purchases;
    }

    /**
     * Fill weapon purchase inputs based on calculated purchases
     */
    function fillWeaponInputs(purchases) {
        let filledCount = 0;
        let totalCost = 0;

        for (const [weaponKey, purchase] of Object.entries(purchases)) {
            const input = getWeaponInput(purchase.type, purchase.htmlTag);
            
            if (input) {
                input.value = purchase.quantity;
                // Trigger input event to ensure the page recognizes the change
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                filledCount++;
                totalCost += purchase.totalCost;
            } else {
                console.warn(`Input not found for ${weaponKey} (${purchase.type}-${purchase.htmlTag})`);
            }
        }

        return { filledCount, totalCost };
    }

    /**
     * Main autofill function
     * @param {boolean} silent - If true, don't show alerts/notifications (for auto-run)
     */
    function performAutofill(silent = false) {
        // Check if feature is enabled
        if (!isFeatureEnabled('armoryAutofill')) {
            console.log('Armory Autofill is disabled');
            return;
        }
        
        const gold = getCurrentGold();
        console.log('performAutofill - Gold:', gold);
        
        if (gold === 0) {
            if (!silent) {
                alert('Could not read gold amount from page. Please check that the gold element exists.');
            }
            return;
        }

        const preferences = getPreferences();
        console.log('performAutofill - Preferences:', preferences);
        
        if (Object.keys(preferences).length === 0) {
            if (!silent) {
                alert('No weapon preferences set. Please configure preferences first using the Settings button.');
            }
            return;
        }

        // Check if all preferences are 0% (autofill disabled)
        const totalPercentage = Object.values(preferences).reduce((sum, p) => sum + p, 0);
        if (totalPercentage === 0) {
            console.log('Autofill disabled: all preferences are 0%');
            return;
        }

        const purchases = calculatePurchases(gold, preferences);
        console.log('performAutofill - Purchases:', purchases);
        
        if (Object.keys(purchases).length === 0) {
            if (!silent) {
                if (totalPercentage === 0) {
                    alert('Preferences are set but all percentages are 0%. Please set at least one weapon to a percentage greater than 0.');
                } else {
                    alert(`No weapons can be purchased with current gold (${formatNumber(gold)}) and preferences. You may need more gold or cheaper weapons in your preferences.`);
                }
            }
            return;
        }

        const result = fillWeaponInputs(purchases);
        
        console.log(`Autofill complete: ${result.filledCount} weapons filled, total cost: ${formatNumber(result.totalCost)} gold`);
        
        // Show a brief notification (only if not silent)
        if (!silent) {
            showNotification(`Autofilled ${result.filledCount} weapon types (${formatNumber(result.totalCost)} gold)`);
        } else {
            // Silent mode: show a subtle notification
            showNotification(`Auto-filled ${result.filledCount} weapons`, 2000);
        }
    }

    // ============================================================================
    // UI COMPONENTS
    // ============================================================================
    
    /**
     * Show a temporary notification (stacks vertically)
     */
    function showNotification(message, duration = 3000) {
        // Get or create notification container
        let container = document.getElementById('mwh-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'mwh-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 120px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            font-size: 14px;
            pointer-events: auto;
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.3s, transform 0.3s;
        `;
        notification.textContent = message;
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(20px)';
            setTimeout(() => {
                notification.remove();
                // Remove container if empty
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        }, duration);
    }

    /**
     * Create preferences UI
     */
    function createPreferencesUI() {
        const container = document.createElement('div');
        container.id = 'mwh-preferences-panel';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            display: none;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Armory Purchase Preferences';
        title.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333;';
        container.appendChild(title);

        // Store weapon data on inputs for easy retrieval
        const weaponInputs = new Map(); // Map<input, {type, name, weaponKey}>

        const stats = ['attack', 'defense', 'stealth', 'security'];

        function loadPreferencesIntoUI() {
            const prefs = getPreferences();
            weaponInputs.forEach((weaponData, input) => {
                const value = prefs[weaponData.weaponKey] || 0;
                input.value = value;
            });
        }

        stats.forEach(stat => {
            const statSection = document.createElement('div');
            statSection.dataset.stat = stat; // Store stat type for easy retrieval
            statSection.style.marginBottom = '20px';
            
            const statLabel = document.createElement('div');
            statLabel.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);
            statLabel.style.cssText = 'font-weight: bold; margin-bottom: 8px; color: #555;';
            statSection.appendChild(statLabel);

            const weapons = getWeaponsByType(stat);
            weapons.forEach(weapon => {
                const weaponKey = getWeaponKey(weapon.type, weapon.name);
                const row = document.createElement('div');
                row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';

                const label = document.createElement('label');
                label.style.cssText = 'flex: 1; font-size: 12px;';
                label.textContent = weapon.name;
                row.appendChild(label);

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.max = '100';
                input.step = '1';
                input.dataset.weaponKey = weaponKey; // Store weapon key for easy retrieval
                input.style.cssText = 'width: 60px; margin-left: 10px; padding: 3px;';
                input.addEventListener('change', () => {
                    const value = parseFloat(input.value) || 0;
                    if (value < 0) input.value = 0;
                    if (value > 100) input.value = 100;
                });

                // Store weapon data on the input element
                weaponInputs.set(input, {
                    type: weapon.type,
                    name: weapon.name,
                    weaponKey: weaponKey
                });

                const percentLabel = document.createElement('span');
                percentLabel.textContent = '%';
                percentLabel.style.cssText = 'margin-left: 5px; font-size: 12px;';
                row.appendChild(input);
                row.appendChild(percentLabel);
                statSection.appendChild(row);
            });

            container.appendChild(statSection);
        });

        // Load saved preferences when UI is created
        loadPreferencesIntoUI();

        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = 'display: flex; gap: 10px; margin-top: 20px;';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Preferences';
        saveBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        saveBtn.addEventListener('click', () => {
            const newPrefs = {};
            
            // Iterate through all inputs and save their values
            weaponInputs.forEach((weaponData, input) => {
                const value = parseFloat(input.value) || 0;
                if (value > 0) {
                    newPrefs[weaponData.weaponKey] = value;
                }
            });

            console.log('Saving preferences:', newPrefs);
            savePreferences(newPrefs);
            showNotification('Preferences saved!');
            container.style.display = 'none';
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #ccc;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        cancelBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });

        buttonRow.appendChild(saveBtn);
        buttonRow.appendChild(cancelBtn);
        container.appendChild(buttonRow);

        document.body.appendChild(container);
        return container;
    }

    /**
     * Reload preferences into the UI (call this when opening the panel)
     */
    function reloadPreferencesUI() {
        // Try both old and new panel IDs for backwards compatibility
        const oldPanel = document.getElementById('mwh-preferences-panel');
        const newPanel = document.getElementById('mwh-settings-dashboard');
        const container = newPanel || oldPanel;
        if (!container) return;
        
        const prefs = getPreferences();
        const inputs = container.querySelectorAll('input[type="number"]');
        
        inputs.forEach(input => {
            if (input.dataset.weaponKey) {
                const weaponKey = input.dataset.weaponKey;
                const value = prefs[weaponKey] || 0;
                input.value = value;
            }
        });
    }

    /**
     * Create Settings Dashboard (replaces old control buttons)
     */
    function createSettingsDashboard() {
        try {
            console.log('Creating Settings Dashboard...');
            // Remove old control buttons if they exist
            const oldControls = document.getElementById('mwh-controls');
            if (oldControls) oldControls.remove();
            
            // Remove old settings button if it exists
            const oldSettingsBtn = document.getElementById('mwh-settings-button');
            if (oldSettingsBtn) oldSettingsBtn.remove();
            
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'mwh-settings-button';
            buttonContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;

            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️ Settings';
            settingsBtn.style.cssText = `
                padding: 12px 20px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            settingsBtn.addEventListener('click', () => {
                const panel = document.getElementById('mwh-settings-dashboard');
                if (panel) {
                    const isVisible = panel.style.display === 'block';
                    panel.style.display = isVisible ? 'none' : 'block';
                    
                    // Hide/show Key Stats overlay when opening/closing settings
                    const keyStatsOverlay = document.getElementById('mwh-command-center-stats');
                    if (keyStatsOverlay) {
                        if (!isVisible) {
                            // Opening settings - hide overlay
                            keyStatsOverlay.style.display = 'none';
                        } else {
                            // Closing settings - show overlay if feature is enabled
                            if (isFeatureEnabled('commandCenterStats')) {
                                keyStatsOverlay.style.display = 'block';
                            }
                        }
                    }
                    
                    if (!isVisible) {
                        // Reload preferences when opening the dashboard
                        reloadPreferencesUI();
                    }
                }
            });
            settingsBtn.addEventListener('mouseenter', () => {
                settingsBtn.style.background = '#1976D2';
            });
            settingsBtn.addEventListener('mouseleave', () => {
                settingsBtn.style.background = '#2196F3';
            });

            buttonContainer.appendChild(settingsBtn);
            document.body.appendChild(buttonContainer);
            console.log('Settings button created');
            
            // Create the settings dashboard panel
            createSettingsDashboardPanel();
            console.log('Settings Dashboard created successfully');
        } catch (e) {
            console.error('Error creating Settings Dashboard:', e);
        }
    }
    
    /**
     * Create the Settings Dashboard panel
     */
    function createSettingsDashboardPanel() {
        // Remove old panel if it exists
        const oldPanel = document.getElementById('mwh-settings-dashboard');
        if (oldPanel) oldPanel.remove();
        
        const container = document.createElement('div');
        container.id = 'mwh-settings-dashboard';
        container.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            max-width: 500px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            display: none;
        `;

        const title = document.createElement('h2');
        title.textContent = '⚙️ Settings Dashboard';
        title.style.cssText = 'margin-top: 0; margin-bottom: 20px; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;';
        container.appendChild(title);

        // Features Section
        const featuresSection = document.createElement('div');
        featuresSection.style.marginBottom = '30px';
        
        const featuresTitle = document.createElement('h3');
        featuresTitle.textContent = 'Features';
        featuresTitle.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #555; font-size: 16px;';
        featuresSection.appendChild(featuresTitle);
        
        const features = [
            { key: 'armoryAutofill', label: 'Armory Autofill' },
            { key: 'upgradeCalculator', label: 'Upgrade Calculator' },
            { key: 'legendsTimer', label: 'Legends Timer' },
            { key: 'commandCenterStats', label: 'Command Center Stats' }
        ];
        
        // Helper function to create help button with tooltip
        function createHelpButton(description) {
            const helpBtn = document.createElement('button');
            helpBtn.textContent = '?';
            helpBtn.title = description;
            helpBtn.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #999;
                background: #fff;
                color: #666;
                cursor: help;
                font-size: 12px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            `;
            
            let tooltip = null;
            helpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                } else {
                    tooltip = document.createElement('div');
                    tooltip.textContent = description;
                    tooltip.style.cssText = `
                        position: absolute;
                        background: #333;
                        color: white;
                        padding: 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        max-width: 300px;
                        z-index: 10001;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        margin-top: 25px;
                        margin-left: -150px;
                    `;
                    helpBtn.style.position = 'relative';
                    helpBtn.appendChild(tooltip);
                    
                    // Close tooltip when clicking outside
                    setTimeout(() => {
                        const closeTooltip = (e) => {
                            if (!tooltip.contains(e.target) && e.target !== helpBtn) {
                                tooltip.remove();
                                tooltip = null;
                                document.removeEventListener('click', closeTooltip);
                            }
                        };
                        document.addEventListener('click', closeTooltip);
                    }, 100);
                }
            });
            
            return helpBtn;
        }
        
        features.forEach(feature => {
            const featureContainer = document.createElement('div');
            featureContainer.style.cssText = 'margin-bottom: 15px;';
            
            const featureRow = document.createElement('div');
            featureRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f5f5f5; border-radius: 5px;';
            
            const labelContainer = document.createElement('div');
            labelContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
            
            const label = document.createElement('label');
            label.textContent = feature.label;
            label.style.cssText = 'font-weight: bold; font-size: 14px; cursor: pointer; flex: 1;';
            label.setAttribute('for', `toggle-${feature.key}`);
            
            // Help button (?)
            const helpBtn = createHelpButton(FEATURE_DESCRIPTIONS[feature.key]);
            labelContainer.appendChild(label);
            labelContainer.appendChild(helpBtn);
            
            // Toggle switch
            const toggleContainer = document.createElement('label');
            toggleContainer.style.cssText = 'position: relative; display: inline-block; width: 50px; height: 24px;';
            
            const toggleInput = document.createElement('input');
            toggleInput.type = 'checkbox';
            toggleInput.id = `toggle-${feature.key}`;
            toggleInput.checked = isFeatureEnabled(feature.key);
            toggleInput.style.cssText = 'opacity: 0; width: 0; height: 0;';
            
            const toggleSlider = document.createElement('span');
            toggleSlider.style.cssText = `
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${toggleInput.checked ? '#4CAF50' : '#ccc'};
                transition: .4s;
                border-radius: 24px;
            `;
            
            const toggleCircle = document.createElement('span');
            toggleCircle.style.cssText = `
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
                transform: translateX(${toggleInput.checked ? '26px' : '0'});
            `;
            
            toggleInput.addEventListener('change', () => {
                const enabled = toggleInput.checked;
                setFeatureToggle(feature.key, enabled);
                toggleSlider.style.backgroundColor = enabled ? '#4CAF50' : '#ccc';
                toggleCircle.style.transform = `translateX(${enabled ? '26px' : '0'})`;
                showNotification(`${feature.label} ${enabled ? 'enabled' : 'disabled'}`);
                
                // Immediately update Command Center stats overlay if toggled
                if (feature.key === 'commandCenterStats' && window.location.pathname.includes('base.php')) {
                    displayCommandCenterStatsOverlay();
                }
            });
            
            toggleContainer.appendChild(toggleInput);
            toggleContainer.appendChild(toggleSlider);
            toggleSlider.appendChild(toggleCircle);
            
            featureRow.appendChild(labelContainer);
            featureRow.appendChild(toggleContainer);
            featureContainer.appendChild(featureRow);
            
            // Add collapsible preferences section for Armory Autofill
            if (feature.key === 'armoryAutofill' && (window.location.pathname.includes('armory.php') || isFeatureEnabled('armoryAutofill'))) {
                const prefsContainer = document.createElement('div');
                prefsContainer.id = 'mwh-armory-preferences-container';
                prefsContainer.style.cssText = 'margin-top: 10px; display: none;';
                
                const prefsContent = document.createElement('div');
                prefsContent.style.cssText = 'padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 5px;';
                
                const prefsTitle = document.createElement('div');
                prefsTitle.textContent = 'Purchase Preferences';
                prefsTitle.style.cssText = 'font-weight: bold; margin-bottom: 12px; color: #555; font-size: 13px;';
                prefsContent.appendChild(prefsTitle);
                
                // Store weapon data on inputs for easy retrieval
                const weaponInputs = new Map();
                
                const stats = ['attack', 'defense', 'stealth', 'security'];
                
                function loadPreferencesIntoUI() {
                    const prefs = getPreferences();
                    weaponInputs.forEach((weaponData, input) => {
                        const value = prefs[weaponData.weaponKey] || 0;
                        input.value = value;
                    });
                }
                
                stats.forEach(stat => {
                    const statSection = document.createElement('div');
                    statSection.dataset.stat = stat;
                    statSection.style.marginBottom = '12px';
                    
                    const statLabel = document.createElement('div');
                    statLabel.textContent = stat.charAt(0).toUpperCase() + stat.slice(1);
                    statLabel.style.cssText = 'font-weight: bold; margin-bottom: 6px; color: #555; font-size: 12px;';
                    statSection.appendChild(statLabel);
                    
                    const weapons = getWeaponsByType(stat);
                    weapons.forEach(weapon => {
                        const weaponKey = getWeaponKey(weapon.type, weapon.name);
                        const row = document.createElement('div');
                        row.style.cssText = 'display: flex; align-items: center; margin-bottom: 4px;';
                        
                        const label = document.createElement('label');
                        label.style.cssText = 'flex: 1; font-size: 11px;';
                        label.textContent = weapon.name;
                        row.appendChild(label);
                        
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.min = '0';
                        input.max = '100';
                        input.step = '1';
                        input.dataset.weaponKey = weaponKey;
                        input.style.cssText = 'width: 50px; margin-left: 10px; padding: 3px; font-size: 11px;';
                        input.addEventListener('change', () => {
                            const value = parseFloat(input.value) || 0;
                            if (value < 0) input.value = 0;
                            if (value > 100) input.value = 100;
                        });
                        
                        weaponInputs.set(input, {
                            type: weapon.type,
                            name: weapon.name,
                            weaponKey: weaponKey
                        });
                        
                        const percentLabel = document.createElement('span');
                        percentLabel.textContent = '%';
                        percentLabel.style.cssText = 'margin-left: 5px; font-size: 11px;';
                        row.appendChild(input);
                        row.appendChild(percentLabel);
                        statSection.appendChild(row);
                    });
                    
                    prefsContent.appendChild(statSection);
                });
                
                loadPreferencesIntoUI();
                
                const buttonRow = document.createElement('div');
                buttonRow.style.cssText = 'display: flex; gap: 10px; margin-top: 12px;';
                
                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';
                saveBtn.style.cssText = `
                    flex: 1;
                    padding: 6px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                `;
                saveBtn.addEventListener('click', () => {
                    const newPrefs = {};
                    weaponInputs.forEach((weaponData, input) => {
                        const value = parseFloat(input.value) || 0;
                        if (value > 0) {
                            newPrefs[weaponData.weaponKey] = value;
                        }
                    });
                    savePreferences(newPrefs);
                    showNotification('Preferences saved!');
                });
                
                const resetBtn = document.createElement('button');
                resetBtn.textContent = 'Reset';
                resetBtn.style.cssText = `
                    flex: 1;
                    padding: 6px;
                    background: #ccc;
                    color: #333;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                `;
                resetBtn.addEventListener('click', () => {
                    loadPreferencesIntoUI();
                });
                
                buttonRow.appendChild(saveBtn);
                buttonRow.appendChild(resetBtn);
                prefsContent.appendChild(buttonRow);
                
                prefsContainer.appendChild(prefsContent);
                featureContainer.appendChild(prefsContainer);
                
                // Toggle preferences visibility
                const togglePrefsBtn = document.createElement('button');
                togglePrefsBtn.textContent = '▼ Preferences';
                togglePrefsBtn.style.cssText = `
                    width: 100%;
                    margin-top: 8px;
                    padding: 6px;
                    background: #e0e0e0;
                    color: #555;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    text-align: left;
                `;
                let prefsExpanded = false;
                togglePrefsBtn.addEventListener('click', () => {
                    prefsExpanded = !prefsExpanded;
                    prefsContainer.style.display = prefsExpanded ? 'block' : 'none';
                    togglePrefsBtn.textContent = prefsExpanded ? '▲ Preferences' : '▼ Preferences';
                });
                featureContainer.appendChild(togglePrefsBtn);
            }
            
            featuresSection.appendChild(featureContainer);
        });
        
        // Income/UP Snapshot Feature (button instead of toggle)
        const snapshotFeatureContainer = document.createElement('div');
        snapshotFeatureContainer.style.cssText = 'margin-bottom: 15px;';
        
        const snapshotFeatureRow = document.createElement('div');
        snapshotFeatureRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f5f5f5; border-radius: 5px;';
        
        const snapshotLabelContainer = document.createElement('div');
        snapshotLabelContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
        
        const snapshotLabel = document.createElement('div');
        snapshotLabel.textContent = 'Income/UP Snapshot';
        snapshotLabel.style.cssText = 'font-weight: bold; font-size: 14px; flex: 1;';
        
        const snapshotHelpBtn = createHelpButton(FEATURE_DESCRIPTIONS['incomeUpSnapshot']);
        snapshotLabelContainer.appendChild(snapshotLabel);
        snapshotLabelContainer.appendChild(snapshotHelpBtn);
        
        const snapshotActionBtn = document.createElement('button');
        snapshotActionBtn.textContent = 'Run Snapshot';
        snapshotActionBtn.style.cssText = `
            padding: 6px 12px;
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        snapshotActionBtn.addEventListener('click', () => {
            container.style.display = 'none';
            startIncomeUpSnapshot();
        });
        snapshotActionBtn.addEventListener('mouseenter', () => {
            snapshotActionBtn.style.background = '#7B1FA2';
        });
        snapshotActionBtn.addEventListener('mouseleave', () => {
            snapshotActionBtn.style.background = '#9C27B0';
        });
        
        snapshotFeatureRow.appendChild(snapshotLabelContainer);
        snapshotFeatureRow.appendChild(snapshotActionBtn);
        snapshotFeatureContainer.appendChild(snapshotFeatureRow);
        
        // Add collapsible preferences section for Snapshot Display
        const snapshotPrefsContainer = document.createElement('div');
        snapshotPrefsContainer.id = 'mwh-snapshot-prefs';
        snapshotPrefsContainer.style.cssText = `
            display: none;
            padding: 10px;
            background: #fafafa;
            border-radius: 5px;
            margin-top: 10px;
        `;
        
        const snapshotPrefsTitle = document.createElement('div');
        snapshotPrefsTitle.textContent = 'Display Options:';
        snapshotPrefsTitle.style.cssText = 'font-weight: bold; margin-bottom: 10px; font-size: 12px;';
        snapshotPrefsContainer.appendChild(snapshotPrefsTitle);
        
        // Load current preferences
        const snapshotPrefs = getSnapshotDisplayPreferences();
        
        // Battlefield checkbox
        const battlefieldCheckboxContainer = document.createElement('div');
        battlefieldCheckboxContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
        const battlefieldCheckbox = document.createElement('input');
        battlefieldCheckbox.type = 'checkbox';
        battlefieldCheckbox.id = 'snapshot-battlefield';
        battlefieldCheckbox.checked = snapshotPrefs.showOnBattlefield !== false; // Default to true
        battlefieldCheckbox.style.cssText = 'margin-right: 8px;';
        const battlefieldLabel = document.createElement('label');
        battlefieldLabel.htmlFor = 'snapshot-battlefield';
        battlefieldLabel.textContent = 'Show on Battlefield';
        battlefieldLabel.style.cssText = 'font-size: 12px; cursor: pointer;';
        battlefieldCheckboxContainer.appendChild(battlefieldCheckbox);
        battlefieldCheckboxContainer.appendChild(battlefieldLabel);
        snapshotPrefsContainer.appendChild(battlefieldCheckboxContainer);
        
        // Top Stats checkbox
        const topStatsCheckboxContainer = document.createElement('div');
        topStatsCheckboxContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 8px;';
        const topStatsCheckbox = document.createElement('input');
        topStatsCheckbox.type = 'checkbox';
        topStatsCheckbox.id = 'snapshot-topstats';
        topStatsCheckbox.checked = snapshotPrefs.showOnTopStats !== false; // Default to true
        topStatsCheckbox.style.cssText = 'margin-right: 8px;';
        const topStatsLabel = document.createElement('label');
        topStatsLabel.htmlFor = 'snapshot-topstats';
        topStatsLabel.textContent = 'Show on Top Stats';
        topStatsLabel.style.cssText = 'font-size: 12px; cursor: pointer;';
        topStatsCheckboxContainer.appendChild(topStatsCheckbox);
        topStatsCheckboxContainer.appendChild(topStatsLabel);
        snapshotPrefsContainer.appendChild(topStatsCheckboxContainer);
        
        // Save button
        const saveSnapshotPrefsBtn = document.createElement('button');
        saveSnapshotPrefsBtn.textContent = 'Save Display Preferences';
        saveSnapshotPrefsBtn.style.cssText = `
            padding: 6px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 5px;
        `;
        saveSnapshotPrefsBtn.addEventListener('click', () => {
            const newPrefs = {
                showOnBattlefield: battlefieldCheckbox.checked,
                showOnTopStats: topStatsCheckbox.checked
            };
            saveSnapshotDisplayPreferences(newPrefs);
            showNotification('Snapshot display preferences saved!');
            // Refresh displays if on relevant pages
            if (window.location.pathname.includes('battlefield2.php')) {
                displaySnapshotOnBattlefield();
            }
            if (window.location.pathname.includes('toplist.php')) {
                displaySnapshotOverlays();
            }
        });
        snapshotPrefsContainer.appendChild(saveSnapshotPrefsBtn);
        
        // Toggle button
        const toggleSnapshotPrefsBtn = document.createElement('button');
        toggleSnapshotPrefsBtn.textContent = '▼ Display Preferences';
        toggleSnapshotPrefsBtn.style.cssText = `
            width: 100%;
            padding: 4px;
            background: #e0e0e0;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            text-align: left;
            margin-top: 10px;
        `;
        let snapshotPrefsExpanded = false;
        toggleSnapshotPrefsBtn.addEventListener('click', () => {
            snapshotPrefsExpanded = !snapshotPrefsExpanded;
            snapshotPrefsContainer.style.display = snapshotPrefsExpanded ? 'block' : 'none';
            toggleSnapshotPrefsBtn.textContent = snapshotPrefsExpanded ? '▲ Display Preferences' : '▼ Display Preferences';
        });
        snapshotFeatureContainer.appendChild(toggleSnapshotPrefsBtn);
        snapshotFeatureContainer.appendChild(snapshotPrefsContainer);
        
        featuresSection.appendChild(snapshotFeatureContainer);
        
        // Intelligence Display Feature
        const intelFeatureContainer = document.createElement('div');
        intelFeatureContainer.style.cssText = 'margin-bottom: 15px;';
        
        const intelFeatureRow = document.createElement('div');
        intelFeatureRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f5f5f5; border-radius: 5px;';
        
        const intelLabelContainer = document.createElement('div');
        intelLabelContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
        
        const intelLabel = document.createElement('div');
        intelLabel.textContent = 'Player Intelligence';
        intelLabel.style.cssText = 'font-weight: bold; font-size: 14px; flex: 1;';
        
        const intelHelpBtn = createHelpButton('View detailed intelligence data on all tracked players, including top rankings and gold invested breakdowns.');
        intelLabelContainer.appendChild(intelLabel);
        intelLabelContainer.appendChild(intelHelpBtn);
        
        const intelActionBtn = document.createElement('button');
        intelActionBtn.textContent = 'View Intelligence';
        intelActionBtn.style.cssText = `
            padding: 6px 12px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        intelActionBtn.addEventListener('click', () => {
            container.style.display = 'none';
            showIntelligenceDisplay();
        });
        intelActionBtn.addEventListener('mouseenter', () => {
            intelActionBtn.style.background = '#1976D2';
        });
        intelActionBtn.addEventListener('mouseleave', () => {
            intelActionBtn.style.background = '#2196F3';
        });
        
        intelFeatureRow.appendChild(intelLabelContainer);
        intelFeatureRow.appendChild(intelActionBtn);
        intelFeatureContainer.appendChild(intelFeatureRow);
        featuresSection.appendChild(intelFeatureContainer);
        
        // Head to Head Stats Feature
        const h2hFeatureContainer = document.createElement('div');
        h2hFeatureContainer.style.cssText = 'margin-bottom: 15px;';
        
        const h2hFeatureRow = document.createElement('div');
        h2hFeatureRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: #f5f5f5; border-radius: 5px;';
        
        const h2hLabelContainer = document.createElement('div');
        h2hLabelContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
        
        const h2hLabel = document.createElement('div');
        h2hLabel.textContent = 'Head to Head Stats';
        h2hLabel.style.cssText = 'font-weight: bold; font-size: 14px; flex: 1;';
        
        const h2hHelpBtn = createHelpButton(FEATURE_DESCRIPTIONS['headToHeadStats']);
        h2hLabelContainer.appendChild(h2hLabel);
        h2hLabelContainer.appendChild(h2hHelpBtn);
        
        const h2hUpdateBtn = document.createElement('button');
        h2hUpdateBtn.textContent = 'Update Head to Head Stats';
        h2hUpdateBtn.style.cssText = `
            padding: 6px 12px;
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
        `;
        h2hUpdateBtn.addEventListener('click', () => {
            container.style.display = 'none';
            updateHeadToHeadStats();
        });
        h2hUpdateBtn.addEventListener('mouseenter', () => {
            h2hUpdateBtn.style.background = '#F57C00';
        });
        h2hUpdateBtn.addEventListener('mouseleave', () => {
            h2hUpdateBtn.style.background = '#FF9800';
        });
        
        const h2hViewBtn = document.createElement('button');
        h2hViewBtn.textContent = 'View Stats';
        h2hViewBtn.style.cssText = `
            padding: 6px 12px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
        `;
        h2hViewBtn.addEventListener('click', () => {
            container.style.display = 'none';
            showHeadToHeadStats();
        });
        h2hViewBtn.addEventListener('mouseenter', () => {
            h2hViewBtn.style.background = '#1976D2';
        });
        h2hViewBtn.addEventListener('mouseleave', () => {
            h2hViewBtn.style.background = '#2196F3';
        });
        
        const h2hFreshBtn = document.createElement('button');
        h2hFreshBtn.textContent = 'Fresh Scrape';
        h2hFreshBtn.style.cssText = `
            padding: 6px 12px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            margin-left: 8px;
        `;
        h2hFreshBtn.addEventListener('click', () => {
            const shouldRescrape = confirm(
                'This will clear all existing Head to Head data and re-scrape everything from scratch.\n\n' +
                'This may take a while if you have many pages of data.\n\n' +
                'Continue?'
            );
            if (shouldRescrape) {
                container.style.display = 'none';
                // Clear existing data
                saveH2HData({ battleDefenses: [], battleAttacks: [] });
                GM_deleteValue('mwh_h2h_scraping');
                GM_deleteValue('mwh_h2h_update_pending');
                // Set fresh scrape flag
                GM_setValue('mwh_h2h_fresh_scrape', true);
                showNotification('Starting fresh scrape...', 2000);
                updateHeadToHeadStats();
            }
        });
        h2hFreshBtn.addEventListener('mouseenter', () => {
            h2hFreshBtn.style.background = '#d32f2f';
        });
        h2hFreshBtn.addEventListener('mouseleave', () => {
            h2hFreshBtn.style.background = '#f44336';
        });
        
        const h2hButtonContainer = document.createElement('div');
        h2hButtonContainer.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
        h2hButtonContainer.appendChild(h2hUpdateBtn);
        h2hButtonContainer.appendChild(h2hViewBtn);
        h2hButtonContainer.appendChild(h2hFreshBtn);
        
        h2hFeatureRow.appendChild(h2hLabelContainer);
        h2hFeatureRow.appendChild(h2hButtonContainer);
        h2hFeatureContainer.appendChild(h2hFeatureRow);
        featuresSection.appendChild(h2hFeatureContainer);
        
        container.appendChild(featuresSection);
        
        // Changelog Section
        const changelogSection = document.createElement('div');
        changelogSection.style.marginTop = '30px';
        changelogSection.style.marginBottom = '20px';
        changelogSection.style.paddingTop = '20px';
        changelogSection.style.borderTop = '2px solid #eee';
        
        const changelogTitle = document.createElement('h3');
        changelogTitle.textContent = 'What\'s New';
        changelogTitle.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #555; font-size: 16px;';
        changelogSection.appendChild(changelogTitle);
        
        const changelogBtn = document.createElement('button');
        changelogBtn.textContent = '📋 View Changelog';
        changelogBtn.style.cssText = `
            padding: 10px 20px;
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            width: 100%;
        `;
        changelogBtn.addEventListener('click', () => {
            showChangelog();
        });
        changelogBtn.addEventListener('mouseenter', () => {
            changelogBtn.style.background = '#7B1FA2';
        });
        changelogBtn.addEventListener('mouseleave', () => {
            changelogBtn.style.background = '#9C27B0';
        });
        changelogSection.appendChild(changelogBtn);
        
        container.appendChild(changelogSection);
        
        document.body.appendChild(container);
        return container;
    }
    
    /**
     * Show changelog in a modal overlay
     */
    function showChangelog() {
        // Remove existing changelog if present
        const existing = document.getElementById('mwh-changelog-overlay');
        if (existing) {
            existing.remove();
        }
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'mwh-changelog-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 30px;
            max-width: 700px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            position: relative;
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
        modal.appendChild(closeBtn);
        
        // Title
        const title = document.createElement('h2');
        title.textContent = '📋 Changelog';
        title.style.cssText = 'margin-top: 0; margin-bottom: 25px; color: #333; border-bottom: 2px solid #eee; padding-bottom: 15px;';
        modal.appendChild(title);
        
        // Changelog content
        const changelogContent = document.createElement('div');
        changelogContent.style.cssText = 'line-height: 1.8; color: #555;';
        
        const changelog = `
            <div style="margin-bottom: 40px;">
                <h2 style="color: #4CAF50; margin-bottom: 20px; font-size: 20px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">✨ Major Changes</h2>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">⚔️ Head to Head Stats</h3>
                    <p><strong>New Feature:</strong> Track gold stolen from and lost to each player! Comprehensive battle log analysis with:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Head to Head table showing gold differentials with each opponent</li>
                        <li>Your Attack Stats with breakdowns by time period (24h, 3 days, all age)</li>
                        <li>Separate stats for attacks vs players vs farms</li>
                        <li>Automatic data collection from war logs with smart pagination</li>
                        <li>Fresh scrape option for complete data collection</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">📸 Snapshot Feature Enhancements</h3>
                    <p><strong>New:</strong> Snapshot data now appears on the battlefield page! See income and unit production rates directly on the battlefield list.</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Unit Production appears as "+X" next to each player's army size</li>
                        <li>Income appears as "+X/turn" with hourly estimate near the gold display</li>
                        <li>New settings to control where snapshot data appears (battlefield, top stats, or both)</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">📈 Command Center Stats Overlay</h3>
                    <p><strong>New Feature:</strong> A convenient overlay on the Command Center page showing your key stats in one place:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Total Gold Revenue</li>
                        <li>Total Unit Revenue</li>
                        <li>Mana Produced</li>
                    </ul>
                    <p style="margin-top: 10px;">Can be toggled on/off in settings. Positioned to avoid blocking other UI elements.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">📊 Upgrade Calculator Enhancements</h3>
                    <p>Added efficiency percentage display to help you see how close an upgrade is to being worthwhile. Shows "Efficiency: X%" with color coding - green when it's better than weapons, yellow when it's getting close. This helps you make better upgrade decisions!</p>
                </div>
            </div>
            
            <div style="margin-bottom: 40px;">
                <h2 style="color: #FF9800; margin-bottom: 20px; font-size: 20px; border-bottom: 2px solid #FF9800; padding-bottom: 10px;">🔧 Minor Changes & Fixes</h2>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">⚙️ Feature Toggle Persistence</h3>
                    <p>Fixed an issue where feature toggles (like Command Center Stats) weren't saving properly. All toggle switches now save their state automatically and persist across page reloads.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">⏱️ Legends Summary Calculation Fix</h3>
                    <p>Fixed the Legends summary to properly account for current mana on hand when calculating time until completion. The summary now shows both:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Time from 0 mana (theoretical full time)</li>
                        <li>Time with current mana (actual remaining time, highlighted in green)</li>
                    </ul>
                    <p style="margin-top: 10px;">Also displays current mana on hand and remaining mana needed for better visibility.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">🔧 Intelligence System Fixes</h3>
                    <p>Fixed a bug where "???" values from new recon missions were overwriting older valid data. Now the system preserves your existing data when new recon returns "???" values, preventing undercounting of player stats.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">⚔️ Armory Autofill Improvements</h3>
                    <p>Fixed security weapon autofill! Security weapons (like Devastating Staff) now work correctly. The game uses "magic" in the HTML instead of "security", and the helper now handles this properly.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #2196F3; margin-bottom: 10px; font-size: 18px;">🎨 UI Improvements</h3>
                    <p>Various improvements to make the interface cleaner and less cluttered:</p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>Notifications moved lower to avoid blocking the settings box</li>
                        <li>Better positioning of overlays to prevent conflicts</li>
                        <li>Improved visual hierarchy and spacing throughout</li>
                    </ul>
                </div>
            </div>
        `;
        
        changelogContent.innerHTML = changelog;
        modal.appendChild(changelogContent);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Close on overlay click (outside modal)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    /**
     * Create main control buttons
     */
    function createControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'mwh-controls';
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const prefsBtn = document.createElement('button');
        prefsBtn.textContent = '⚙️ Autofill Preferences';
        prefsBtn.style.cssText = `
            padding: 12px 20px;
            background: #FF9800;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        prefsBtn.addEventListener('click', () => {
            const panel = document.getElementById('mwh-preferences-panel');
            if (panel) {
                const isVisible = panel.style.display === 'block';
                if (!isVisible) {
                    // Reload preferences when opening the panel
                    reloadPreferencesUI();
                }
                panel.style.display = isVisible ? 'none' : 'block';
            }
        });
        prefsBtn.addEventListener('mouseenter', () => {
            prefsBtn.style.background = '#F57C00';
        });
        prefsBtn.addEventListener('mouseleave', () => {
            prefsBtn.style.background = '#FF9800';
        });

        buttonContainer.appendChild(prefsBtn);
        document.body.appendChild(buttonContainer);
    }

    // ============================================================================
    // INVENTORY TRACKING
    // ============================================================================
    
    const INVENTORY_KEY = 'weaponInventory';
    const INVENTORY_VALUE_KEY = 'inventoryValue';
    
    /**
     * Scrape weapon inventory from armory page
     * Weapons are displayed in order: Attack, Defense, Stealth, Security
     * Each weapon has an element like: <div id="qty-wep-15">Qty: 107,444</div>
     * The weapon name is in a nearby div: <div class="text s14">Death Scythe</div>
     * Mobile version may have slightly different HTML structure
     */
    function scrapeInventory() {
        const inventory = {};
        const inventoryValue = {
            attack: 0,
            defense: 0,
            stealth: 0,
            security: 0,
            total: 0
        };

        let foundCount = 0;

        // Find all weapon quantity elements (they have IDs like qty-wep-0, qty-wep-1, etc.)
        // We'll match them by finding the weapon name in the same table cell
        for (let i = 0; i < 50; i++) { // Check up to 50 weapons (should be 28 total)
            const qtyElement = document.getElementById(`qty-wep-${i}`);
            if (!qtyElement) continue;
            
            // Find the weapon name in the parent table cell
            let parentCell = qtyElement.closest('td');
            if (!parentCell) {
                // Try finding parent cell by going up the DOM tree
                let parent = qtyElement.parentElement;
                while (parent && parent.tagName !== 'TD' && parent.tagName !== 'BODY') {
                    parent = parent.parentElement;
                }
                if (!parent || parent.tagName !== 'TD') continue;
                parentCell = parent;
            }
            
            // Find the weapon name div - try multiple selectors for mobile compatibility
            let nameDiv = parentCell.querySelector('.text.s14');
            if (!nameDiv) {
                // Try alternative selectors for mobile
                nameDiv = parentCell.querySelector('.text');
            }
            if (!nameDiv) {
                // Try finding any div with text that looks like a weapon name
                const allDivs = parentCell.querySelectorAll('div');
                for (const div of allDivs) {
                    const text = div.textContent.trim();
                    // Check if this looks like a weapon name (not a number, not "Qty:")
                    if (text && !text.match(/^Qty:/i) && !text.match(/^[\d,]+$/) && text.length > 2) {
                        nameDiv = div;
                        break;
                    }
                }
            }
            if (!nameDiv) continue;
            
            const weaponName = nameDiv.textContent.trim();
            
            // Find matching weapon in our data
            // Try to match by name across all weapon types
            let matchedWeapon = null;
            for (const weapon of WEAPONS_DATA) {
                if (weapon.name === weaponName) {
                    matchedWeapon = weapon;
                    break;
                }
            }
            
            if (!matchedWeapon) {
                console.warn(`Could not match weapon name: "${weaponName}"`);
                continue;
            }
            
            // Extract quantity - try multiple patterns
            const qtyText = qtyElement.textContent.trim();
            let match = qtyText.match(/[\d,]+/);
            if (!match) {
                // Try alternative patterns (mobile might format differently)
                match = qtyText.match(/(\d[\d,]*)/);
            }
            let quantity = 0;
            if (match) {
                quantity = parseNumber(match[0]);
            }
            
            // Store inventory
            const key = `${matchedWeapon.type}-${matchedWeapon.htmlTag}`;
            inventory[key] = quantity;
            foundCount++;
            
            // Calculate value invested
            const value = quantity * matchedWeapon.cost;
            inventoryValue[matchedWeapon.type] += value;
            inventoryValue.total += value;
        }

        // Ensure all weapons are in inventory (set to 0 if not found)
        WEAPONS_DATA.forEach(weapon => {
            const key = `${weapon.type}-${weapon.htmlTag}`;
            if (!(key in inventory)) {
                inventory[key] = 0;
            }
        });

        // Store inventory and calculated values
        GM_setValue(INVENTORY_KEY, inventory);
        GM_setValue(INVENTORY_VALUE_KEY, inventoryValue);
        
        console.log(`Inventory scraped: ${foundCount} weapons found`);
        console.log('Inventory values:', inventoryValue);
        
        // Show notification with more detail if few weapons found (might indicate mobile issue)
        const totalWeapons = Object.values(inventory).reduce((sum, qty) => sum + qty, 0);
        if (foundCount === 0) {
            console.warn('No weapons found during scraping - this might indicate a mobile HTML structure issue');
            showNotification(`Inventory update: 0 weapons found (check console)`);
        } else {
            showNotification(`Inventory updated (${formatNumber(totalWeapons)} total weapons)`);
        }
        
        return { inventory, inventoryValue };
    }

    /**
     * Get stored inventory
     */
    function getInventory() {
        return GM_getValue(INVENTORY_KEY, {});
    }

    /**
     * Get stored inventory values
     */
    function getInventoryValues() {
        return GM_getValue(INVENTORY_VALUE_KEY, {
            attack: 0,
            defense: 0,
            stealth: 0,
            security: 0,
            total: 0
        });
    }

    // ============================================================================
    // UPGRADE LEVEL TRACKING
    // ============================================================================
    
    const UPGRADE_LEVELS_KEY = 'upgradeLevels';
    
    /**
     * Scrape upgrade levels from upgrades page
     * Upgrades are displayed in order: Skirmish, Resistance, Sleeper, Surveillance, Technology
     */
    function scrapeUpgradeLevels() {
        const upgradeLevels = {};
        
        // Find all upgrade rows (tr.r1.upg)
        // Note: Upgrades are in a two-column layout:
        // Left column: Skirmish (0), Resistance (1), Sleeper (2), Surveillance (3)
        // Right column: Unit Production (4), Mana Production (5), Income Deposit (6), Technology (7)
        const upgradeRows = document.querySelectorAll('tr.r1.upg');
        const upgradeTypeMap = {
            0: 'skirmish',
            1: 'resistance',
            2: 'sleeper',
            3: 'surveillance',
            4: 'unit',      // Skip
            5: 'mana',      // Skip
            6: 'income',    // Skip
            7: 'technology'
        };
        
        upgradeRows.forEach((row, index) => {
            const upgradeType = upgradeTypeMap[index];
            if (!upgradeType || upgradeType === 'unit' || upgradeType === 'mana' || upgradeType === 'income') return;
            
            // Get current upgrade info from first td
            const currentTd = row.querySelector('td.c1.l.btl');
            let currentName = '';
            let currentMultiplier = 1.0;
            
            if (currentTd) {
                const text = currentTd.textContent.trim();
                // Extract name (before the multiplier)
                const nameMatch = text.match(/^([^x]+)/);
                if (nameMatch) {
                    currentName = nameMatch[1].trim();
                }
                // Extract multiplier (x44.8 or x1,290.76) - handle commas
                const multMatch = text.match(/x([\d,.]+)/);
                if (multMatch) {
                    const multStr = multMatch[1].replace(/,/g, '');
                    currentMultiplier = parseFloat(multStr);
                }
            }
            
            // Get next upgrade info from button
            // Technology uses "submit-economy", Surveillance uses "submit-alchemy"
            let button = row.querySelector('button[name^="submit-"]');
            if (!button) {
                if (upgradeType === 'technology') {
                    button = row.querySelector('button[name="submit-economy"]');
                } else if (upgradeType === 'surveillance') {
                    button = row.querySelector('button[name="submit-alchemy"]');
                }
            }
            let nextName = '';
            let nextCost = 0;
            
            if (button) {
                // Get text content (handles <b> tags in Technology button)
                const buttonText = button.textContent.trim();
                // Extract name and cost from button text like "Bolts from Heaven  - 524,288,000,000 Gold"
                // or "Destroyer  - 1,048,576,000,000 Gold" (Technology has <b> tags)
                const parts = buttonText.split(' - ');
                if (parts.length >= 2) {
                    nextName = parts[0].trim();
                    const costMatch = parts[1].match(/[\d,]+/);
                    if (costMatch) {
                        nextCost = parseNumber(costMatch[0]);
                    }
                }
            }
            
            // Get next multiplier from third td
            const nextTd = row.querySelector('td.c2.r.btr');
            let nextMultiplier = currentMultiplier;
            
            if (nextTd) {
                const multMatch = nextTd.textContent.match(/x([\d,.]+)/);
                if (multMatch) {
                    const multStr = multMatch[1].replace(/,/g, '');
                    nextMultiplier = parseFloat(multStr);
                }
            }
            
            // Find current level in upgrades data
            let currentLevel = 0;
            const upgrades = UPGRADES_DATA[upgradeType];
            if (upgrades) {
                const found = upgrades.find(u => u.name === currentName);
                if (found) {
                    currentLevel = found.level;
                }
            }
            
            upgradeLevels[upgradeType] = {
                currentLevel: currentLevel,
                currentName: currentName,
                currentMultiplier: currentMultiplier,
                nextName: nextName,
                nextCost: nextCost,
                nextMultiplier: nextMultiplier
            };
        });
        
        GM_setValue(UPGRADE_LEVELS_KEY, upgradeLevels);
        console.log('Upgrade levels scraped:', upgradeLevels);
        
        // Show notification
        const upgradeCount = Object.keys(upgradeLevels).length;
        showNotification(`Upgrades updated (${upgradeCount} tracked)`);
        
        return upgradeLevels;
    }

    /**
     * Get stored upgrade levels
     */
    function getUpgradeLevels() {
        return GM_getValue(UPGRADE_LEVELS_KEY, {});
    }

    // ============================================================================
    // GOLD TRACKING
    // ============================================================================
    
    /**
     * Get gold on hand from page
     */
    function getGoldOnHand() {
        const goldElement = document.getElementById('data-gold');
        if (!goldElement) return 0;
        const goldText = goldElement.textContent.trim();
        return parseNumber(goldText);
    }

    /**
     * Get banked gold from page
     */
    function getBankedGold() {
        const bankElement = document.getElementById('data-bank');
        if (!bankElement) return 0;
        const bankText = bankElement.textContent.trim();
        return parseNumber(bankText);
    }

    /**
     * Get total gold (on hand + banked) from upgrades page
     */
    function getTotalGold() {
        // Try to get from the displayed total on upgrades page
        const totalGoldDiv = document.querySelector('.table.gold.s14.m0');
        if (totalGoldDiv) {
            const text = totalGoldDiv.textContent.trim();
            const match = text.match(/[\d,]+/);
            if (match) {
                return parseNumber(match[0]);
            }
        }
        
        // Fallback: calculate from on hand + banked
        return getGoldOnHand() + getBankedGold();
    }

    // ============================================================================
    // UPGRADE CALCULATOR
    // ============================================================================
    
    /**
     * Calculate if upgrade is more efficient than buying weapons
     */
    function calculateUpgradeRecommendation(upgradeType, upgradeData, inventoryValues) {
        if (!upgradeData || !upgradeData.nextCost || upgradeData.nextCost === 0) {
            return null; // No next upgrade available
        }

        const currentMult = upgradeData.currentMultiplier;
        const nextMult = upgradeData.nextMultiplier;
        
        if (!currentMult || !nextMult || nextMult <= currentMult) {
            // Invalid multiplier - return null and let UI handle with fallback
            return null;
        }

        // Calculate percentage increase
        const percentIncrease = ((nextMult - currentMult) / currentMult) * 100;

        let inventoryValue = 0;
        let statName = '';

        if (upgradeType === 'technology') {
            // Technology applies to all 4 stats
            inventoryValue = inventoryValues.total;
            statName = 'All Stats';
        } else {
            // Map upgrade type to stat
            const typeMap = {
                'skirmish': 'attack',
                'resistance': 'defense',
                'sleeper': 'stealth',
                'surveillance': 'security'
            };
            const stat = typeMap[upgradeType];
            if (!stat) return null;
            
            inventoryValue = inventoryValues[stat];
            statName = stat.charAt(0).toUpperCase() + stat.slice(1);
        }

        // Calculate equivalent weapon cost to achieve same % increase
        // If we have X value in weapons and want Y% increase, we need X * (Y/100) more value
        let equivalentWeaponCost = 0;
        if (inventoryValue > 0) {
            equivalentWeaponCost = inventoryValue * (percentIncrease / 100);
        }

        const upgradeCost = upgradeData.nextCost;
        const isUpgradeBetter = inventoryValue > 0 && upgradeCost < equivalentWeaponCost;
        const savings = Math.abs(equivalentWeaponCost - upgradeCost);
        
        // Calculate efficiency percentage: how close the upgrade is to being worthwhile
        // If equivalentWeaponCost = 1000 and upgradeCost = 900, efficiency = 111% (better than weapons)
        // If equivalentWeaponCost = 1000 and upgradeCost = 1111, efficiency = 90% (90% as effective, 10% away)
        let efficiencyPercentage = null;
        if (inventoryValue > 0 && equivalentWeaponCost > 0 && upgradeCost > 0) {
            efficiencyPercentage = (equivalentWeaponCost / upgradeCost) * 100;
        }
        
        // Calculate how much more inventory value is needed to make upgrade worthwhile
        // If upgradeCost > equivalentWeaponCost, we need more inventory
        // equivalentWeaponCost = inventoryValue * (percentIncrease / 100)
        // So: inventoryValue = equivalentWeaponCost / (percentIncrease / 100)
        // We need: upgradeCost = inventoryValue * (percentIncrease / 100)
        // Therefore: neededInventoryValue = upgradeCost / (percentIncrease / 100)
        const neededInventoryValue = upgradeCost / (percentIncrease / 100);
        const neededMoreValue = Math.max(0, neededInventoryValue - inventoryValue);

        return {
            upgradeType: upgradeType,
            statName: statName,
            currentMultiplier: currentMult,
            nextMultiplier: nextMult,
            percentIncrease: percentIncrease,
            upgradeCost: upgradeCost,
            equivalentWeaponCost: equivalentWeaponCost,
            isUpgradeBetter: isUpgradeBetter,
            savings: savings,
            nextName: upgradeData.nextName,
            inventoryValue: inventoryValue,
            neededMoreValue: neededMoreValue,
            efficiencyPercentage: efficiencyPercentage
        };
    }

    /**
     * Calculate sell-off recommendation for an upgrade
     * Returns weapons to sell and their quantities
     * @param {boolean} force - If true, calculate even when goldNeeded <= 0 (for early purchases)
     */
    function calculateSellOffRecommendation(upgradeType, upgradeCost, totalGold, inventory, inventoryValues, force = false) {
        const goldNeeded = upgradeCost - totalGold;
        
        if (goldNeeded <= 0 && !force) {
            return null; // Have enough gold, no need to sell (unless forced for early purchase)
        }
        
        // If they have enough gold but want to see sell options, use the upgrade cost as gold needed
        const effectiveGoldNeeded = goldNeeded > 0 ? goldNeeded : upgradeCost;

        // Determine which stat's weapons to sell
        let targetStat = null;
        if (upgradeType === 'technology') {
            // Technology affects all stats, so we can sell from any
            // Prefer selling from the stat with highest inventory value
            targetStat = null; // null means all stats
        } else {
            const typeMap = {
                'skirmish': 'attack',
                'resistance': 'defense',
                'sleeper': 'stealth',
                'surveillance': 'security'
            };
            targetStat = typeMap[upgradeType];
            if (!targetStat) {
                console.warn(`Unknown upgrade type for sell-off: ${upgradeType}`);
                return null;
            }
        }

        // Get weapons to consider selling
        let weaponsToSell = [];
        if (targetStat) {
            // Sell from specific stat
            weaponsToSell = WEAPONS_DATA.filter(w => w.type === targetStat);
            console.log(`Sell-off for ${upgradeType} (${targetStat}): Found ${weaponsToSell.length} weapons to consider`);
        } else {
            // Sell from all stats (for technology)
            weaponsToSell = WEAPONS_DATA;
        }

        // Sort by: non-legendary first, then by sellback ratio (highest first)
        weaponsToSell.sort((a, b) => {
            // Non-legendary (w1-w5) before legendary (l1-l2)
            const aIsLegendary = a.htmlTag.startsWith('l');
            const bIsLegendary = b.htmlTag.startsWith('l');
            if (aIsLegendary !== bIsLegendary) {
                return aIsLegendary ? 1 : -1;
            }
            // Higher sellback ratio first
            return b.sellback - a.sellback;
        });

        // Calculate which weapons to sell
        const sellPlan = [];
        let remainingGoldNeeded = effectiveGoldNeeded;
        let remainingInventory = { ...inventory };

        for (const weapon of weaponsToSell) {
            const key = `${weapon.type}-${weapon.htmlTag}`;
            const quantity = remainingInventory[key] || 0;
            
            if (quantity === 0) continue;

            // Calculate gold per weapon when sold
            const goldPerWeapon = weapon.cost * weapon.sellback;
            
            // Calculate how many we need to sell
            const neededToSell = Math.ceil(remainingGoldNeeded / goldPerWeapon);
            const toSell = Math.min(neededToSell, quantity);
            
            if (toSell > 0) {
                const goldFromSell = toSell * goldPerWeapon;
                sellPlan.push({
                    weapon: weapon,
                    quantity: toSell,
                    goldValue: goldFromSell
                });
                
                remainingGoldNeeded -= goldFromSell;
                remainingInventory[key] = quantity - toSell;
                
                if (remainingGoldNeeded <= 0) break;
            }
        }

        if (remainingGoldNeeded > 0) {
            // Can't afford even after selling all available weapons
            return {
                feasible: false,
                goldNeeded: effectiveGoldNeeded,
                remainingGoldNeeded: remainingGoldNeeded,
                sellPlan: sellPlan
            };
        }

        return {
            feasible: true,
            goldNeeded: effectiveGoldNeeded,
            sellPlan: sellPlan,
            totalGoldFromSell: sellPlan.reduce((sum, item) => sum + item.goldValue, 0)
        };
    }

    /**
     * Get all upgrade recommendations
     */
    function getAllUpgradeRecommendations() {
        const inventoryValues = getInventoryValues();
        const upgradeLevels = getUpgradeLevels();
        const recommendations = [];

        const upgradeTypes = ['skirmish', 'resistance', 'sleeper', 'surveillance', 'technology'];
        
        upgradeTypes.forEach(type => {
            const upgradeData = upgradeLevels[type];
            if (upgradeData && upgradeData.nextCost > 0) {
                const rec = calculateUpgradeRecommendation(type, upgradeData, inventoryValues);
                if (rec) {
                    recommendations.push(rec);
                }
            }
        });

        return recommendations;
    }

    // ============================================================================
    // UPGRADE CALCULATOR UI
    // ============================================================================
    
    /**
     * Create visual overlay on upgrades page showing recommendations
     */
    function createUpgradeCalculatorOverlay() {
        const recommendations = getAllUpgradeRecommendations();
        const inventoryValues = getInventoryValues();
        const upgradeLevels = getUpgradeLevels();

        // Find upgrade rows and add indicators
        // Note: Upgrades are in a two-column layout:
        // Left column: Skirmish, Resistance, Sleeper, Surveillance
        // Right column: Unit Production, Mana Production, Income Deposit, Technology
        // We need to map them correctly
        const upgradeRows = document.querySelectorAll('tr.r1.upg');
        const upgradeTypeMap = {
            0: 'skirmish',      // Left column, row 1
            1: 'resistance',    // Left column, row 2
            2: 'sleeper',       // Left column, row 3
            3: 'surveillance',  // Left column, row 4
            4: 'unit',          // Right column, row 1 (skip)
            5: 'mana',          // Right column, row 2 (skip)
            6: 'income',        // Right column, row 3 (skip)
            7: 'technology'     // Right column, row 4
        };
        
        upgradeRows.forEach((row, index) => {
            const upgradeType = upgradeTypeMap[index];
            if (!upgradeType) return; // Skip unit, mana, income upgrades
            const rec = recommendations.find(r => r.upgradeType === upgradeType);
            const upgradeData = upgradeLevels[upgradeType];
            
            // Only show box if we have upgrade data with a next cost
            if (upgradeData && upgradeData.nextCost > 0) {
                // If we don't have a recommendation, create a basic one
                let displayRec = rec;
                if (!displayRec && upgradeData) {
                    // Create a minimal recommendation for display
                    let statName = '';
                    let inventoryValue = 0;
                    
                    if (upgradeType === 'technology') {
                        statName = 'All Stats';
                        inventoryValue = inventoryValues.total;
                    } else {
                        // Map upgrade type to stat
                        const typeMap = {
                            'skirmish': 'attack',
                            'resistance': 'defense',
                            'sleeper': 'stealth',
                            'surveillance': 'security'
                        };
                        const stat = typeMap[upgradeType];
                        if (stat) {
                            statName = stat.charAt(0).toUpperCase() + stat.slice(1);
                            inventoryValue = inventoryValues[stat] || 0;
                        } else {
                            statName = upgradeType.charAt(0).toUpperCase() + upgradeType.slice(1);
                            inventoryValue = 0;
                        }
                    }
                    
                    // Calculate percent increase if we have multiplier data
                    let percentIncrease = 0;
                    if (upgradeData.currentMultiplier && upgradeData.nextMultiplier && upgradeData.nextMultiplier > upgradeData.currentMultiplier) {
                        percentIncrease = ((upgradeData.nextMultiplier - upgradeData.currentMultiplier) / upgradeData.currentMultiplier) * 100;
                    }
                    
                    // Calculate needed more value properly
                    let neededMoreValue = upgradeData.nextCost;
                    let equivalentWeaponCost = 0;
                    if (percentIncrease > 0 && inventoryValue > 0) {
                        // Calculate equivalent weapon cost
                        equivalentWeaponCost = inventoryValue * (percentIncrease / 100);
                        // Calculate needed inventory value
                        const neededInventoryValue = upgradeData.nextCost / (percentIncrease / 100);
                        neededMoreValue = Math.max(0, neededInventoryValue - inventoryValue);
                    }
                    
                    // Calculate efficiency percentage
                    let efficiencyPercentage = null;
                    if (inventoryValue > 0 && equivalentWeaponCost > 0 && upgradeData.nextCost > 0) {
                        efficiencyPercentage = (equivalentWeaponCost / upgradeData.nextCost) * 100;
                    }
                    
                    displayRec = {
                        upgradeType: upgradeType,
                        statName: statName,
                        percentIncrease: percentIncrease,
                        upgradeCost: upgradeData.nextCost,
                        isUpgradeBetter: false,
                        inventoryValue: inventoryValue,
                        neededMoreValue: neededMoreValue,
                        equivalentWeaponCost: equivalentWeaponCost,
                        savings: 0,
                        currentMultiplier: upgradeData.currentMultiplier || 1,
                        nextMultiplier: upgradeData.nextMultiplier || 1,
                        nextName: upgradeData.nextName || '',
                        efficiencyPercentage: efficiencyPercentage
                    };
                }
                
                if (displayRec) {
                // Create collapsible recommendation box
                const isRecommended = displayRec.isUpgradeBetter;
                const borderColor = isRecommended ? '#4CAF50' : '#FF9800';
                const bgColor = isRecommended ? '#4CAF50' : '#FF9800';
                
                // Find the button cell to place the box next to it
                // Try multiple selectors in case the structure varies
                let buttonCell = row.querySelector('td.c2.c.ms');
                if (!buttonCell) {
                    buttonCell = row.querySelector('td.c2.c');
                }
                if (!buttonCell) {
                    // Technology uses submit-economy, Surveillance uses submit-alchemy
                    let buttonSelector = `button[name^="submit-"]`;
                    if (upgradeType === 'technology') {
                        buttonSelector = 'button[name="submit-economy"]';
                    } else if (upgradeType === 'surveillance') {
                        buttonSelector = 'button[name="submit-alchemy"]';
                    }
                    buttonCell = row.querySelector(`td:has(${buttonSelector})`);
                }
                if (!buttonCell) {
                    // Fallback: find any cell with a button
                    const cells = row.querySelectorAll('td');
                    for (const cell of cells) {
                        let hasButton = null;
                        if (upgradeType === 'technology') {
                            hasButton = cell.querySelector('button[name="submit-economy"]');
                        } else if (upgradeType === 'surveillance') {
                            hasButton = cell.querySelector('button[name="submit-alchemy"]');
                        } else {
                            hasButton = cell.querySelector('button[name^="submit-"]');
                        }
                        if (hasButton) {
                            buttonCell = cell;
                            break;
                        }
                    }
                }
                if (!buttonCell) {
                    // For Technology, try alternative placement - maybe place it in the first cell or row
                    if (upgradeType === 'technology') {
                        // Try to find any cell in the row that might work
                        const allCells = row.querySelectorAll('td');
                        if (allCells.length > 0) {
                            // Use the middle cell (index 1) which should be where the button is
                            buttonCell = allCells[1] || allCells[Math.floor(allCells.length / 2)] || allCells[allCells.length - 1];
                        }
                    }
                    if (!buttonCell) {
                        console.warn(`Could not find button cell for ${upgradeType} upgrade`);
                        return;
                    }
                }
                
                // Create container for the recommendation box
                const boxContainer = document.createElement('div');
                boxContainer.className = 'mwh-upgrade-recommendation';
                boxContainer.style.cssText = `
                    display: inline-block;
                    margin-left: 10px;
                    vertical-align: middle;
                `;
                
                // Create collapsed header (always visible)
                const header = document.createElement('div');
                header.style.cssText = `
                    background: ${bgColor};
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    border: 2px solid ${borderColor};
                    white-space: nowrap;
                `;
                header.textContent = isRecommended ? '✅ Recommended' : '⏳ Not Yet Worthwhile';
                
                // Create expandable content box
                const contentBox = document.createElement('div');
                contentBox.style.cssText = `
                    display: none;
                    position: absolute;
                    background: ${bgColor};
                    color: white;
                    padding: 10px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
                    border: 2px solid ${borderColor};
                    z-index: 1000;
                    margin-top: 5px;
                    min-width: 300px;
                    max-width: 400px;
                `;
                
                // Get gold amounts and calculate purchase methods
                const totalGold = getTotalGold();
                const goldOnHand = getGoldOnHand();
                const bankedGold = getBankedGold();
                const inventory = getInventory();
                
                // Always calculate sell-off recommendation if needed (even for non-recommended upgrades)
                // This allows users to purchase upgrades "early" if they want
                let sellOffRec = null;
                if (totalGold < displayRec.upgradeCost) {
                    // Calculate sell-off when short on gold (regardless of recommendation status)
                    console.log(`Calculating sell-off for ${upgradeType}:`, {
                        upgradeCost: displayRec.upgradeCost,
                        totalGold: totalGold,
                        goldNeeded: displayRec.upgradeCost - totalGold,
                        inventory: Object.keys(inventory).filter(k => inventory[k] > 0).length + ' weapons with quantity > 0'
                    });
                    sellOffRec = calculateSellOffRecommendation(
                        upgradeType,
                        displayRec.upgradeCost,
                        totalGold,
                        inventory,
                        inventoryValues,
                        false
                    );
                    console.log(`${upgradeType} (${displayRec.statName}) sell-off result:`, sellOffRec);
                    if (sellOffRec && sellOffRec.feasible && sellOffRec.sellPlan) {
                        console.log(`Sell plan for ${upgradeType}:`, sellOffRec.sellPlan.map(item => 
                            `${item.quantity}x ${item.weapon.name} (${item.weapon.type}-${item.weapon.htmlTag})`
                        ));
                    }
                } else {
                    console.log(`${upgradeType}: Have enough gold (${totalGold} >= ${displayRec.upgradeCost}), skipping sell-off calculation`);
                }
                
                const percentIncrease = displayRec.percentIncrease ? displayRec.percentIncrease.toFixed(1) : '0.0';
                const upgradeCostFormatted = formatNumber(displayRec.upgradeCost);
                const totalGoldFormatted = formatNumber(totalGold);
                
                let messageHtml = '';
                
                // Header
                if (isRecommended && displayRec.percentIncrease > 0) {
                    messageHtml += `<div style="margin-bottom: 6px; font-size: 12px;">✅ UPGRADE RECOMMENDED</div>`;
                } else {
                    messageHtml += `<div style="margin-bottom: 6px; font-size: 12px;">⏳ NOT YET WORTHWHILE</div>`;
                }
                
                messageHtml += `<div style="font-size: 10px; font-weight: normal; line-height: 1.4;">`;
                messageHtml += `${percentIncrease}% increase for ${displayRec.statName}<br>`;
                messageHtml += `Upgrade: ${upgradeCostFormatted} Gold<br>`;
                
                // Efficiency percentage display
                if (displayRec.efficiencyPercentage !== null && displayRec.efficiencyPercentage !== undefined) {
                    const efficiencyFormatted = displayRec.efficiencyPercentage.toFixed(1);
                    if (displayRec.efficiencyPercentage >= 100) {
                        messageHtml += `<span style="color: #4CAF50; font-weight: bold;">Efficiency: ${efficiencyFormatted}% (Better than weapons)</span><br>`;
                    } else {
                        messageHtml += `<span style="color: #FFC107; font-weight: bold;">Efficiency: ${efficiencyFormatted}% (${(100 - displayRec.efficiencyPercentage).toFixed(1)}% away from worthwhile)</span><br>`;
                    }
                }
                
                // Outright Purchase Section
                messageHtml += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);"><strong>Outright Purchase:</strong><br>`;
                if (totalGold >= displayRec.upgradeCost) {
                    const excess = totalGold - displayRec.upgradeCost;
                    messageHtml += `✅ You have enough gold!<br>`;
                    messageHtml += `Total: ${totalGoldFormatted} Gold<br>`;
                    messageHtml += `Excess: ${formatNumber(excess)} Gold`;
                } else {
                    const short = displayRec.upgradeCost - totalGold;
                    messageHtml += `❌ Short by ${formatNumber(short)} Gold<br>`;
                    messageHtml += `On hand: ${formatNumber(goldOnHand)} Gold<br>`;
                    messageHtml += `Banked: ${formatNumber(bankedGold)} Gold<br>`;
                    messageHtml += `Total: ${totalGoldFormatted} Gold`;
                }
                messageHtml += `</div>`;
                
                // Sell-Off Section
                messageHtml += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);"><strong>Sell Weapons:</strong><br>`;
                if (sellOffRec) {
                    if (sellOffRec.feasible) {
                        messageHtml += `✅ Can afford by selling:<br>`;
                        sellOffRec.sellPlan.forEach(item => {
                            messageHtml += `• ${item.quantity.toLocaleString()}x ${item.weapon.name} (${formatNumber(item.goldValue)} Gold)<br>`;
                        });
                        messageHtml += `Total from sell: ${formatNumber(sellOffRec.totalGoldFromSell)} Gold<br>`;
                        
                        // Create link to armory with sell prefill
                        // Build URL parameters properly - each item needs to be encoded separately
                        const sellParamsArray = sellOffRec.sellPlan.map(item => 
                            `${encodeURIComponent(item.weapon.type + '-' + item.weapon.htmlTag)}=${encodeURIComponent(item.quantity.toString())}`
                        );
                        const sellParams = sellParamsArray.join('&');
                        const baseUrl = window.location.origin.includes('www.') 
                            ? 'https://www.monsterswrath.com' 
                            : 'https://monsterswrath.com';
                        const armoryUrl = `${baseUrl}/delta2/armory.php?sell=${sellParams}`;
                        console.log(`${upgradeType} prefill URL:`, armoryUrl);
                        console.log(`${upgradeType} sell params:`, sellParams);
                        messageHtml += `<a href="${armoryUrl}" target="_self" style="color: #FFEB3B; text-decoration: underline; margin-top: 4px; display: inline-block; font-weight: bold;">→ Prefill Sell on Armory</a>`;
                    } else {
                        messageHtml += `❌ Cannot afford even after selling<br>`;
                        messageHtml += `Still need: ${formatNumber(sellOffRec.remainingGoldNeeded)} Gold`;
                    }
                } else {
                    if (totalGold < displayRec.upgradeCost) {
                        // Should have calculated sell-off but didn't - this is an error
                        messageHtml += `⚠️ Sell calculation failed (check console for details)`;
                        console.error(`${upgradeType} (${displayRec.statName}) sell-off returned null but gold is short. totalGold: ${totalGold}, upgradeCost: ${displayRec.upgradeCost}`);
                    } else {
                        messageHtml += `Not needed (have enough gold)`;
                    }
                }
                messageHtml += `</div>`;
                
                // Efficiency comparison (if applicable)
                if (isRecommended && displayRec.percentIncrease > 0) {
                    const weaponCostFormatted = formatNumber(displayRec.equivalentWeaponCost);
                    const savingsFormatted = formatNumber(displayRec.savings);
                    messageHtml += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">`;
                    messageHtml += `Equivalent weapons: ${weaponCostFormatted} Gold<br>`;
                    messageHtml += `<strong>Save: ${savingsFormatted} Gold</strong>`;
                    messageHtml += `</div>`;
                }
                
                messageHtml += `</div>`;
                
                contentBox.innerHTML = messageHtml;
                
                // Toggle functionality
                let isExpanded = false;
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isExpanded = !isExpanded;
                    contentBox.style.display = isExpanded ? 'block' : 'none';
                });
                
                // Close when clicking outside
                document.addEventListener('click', (e) => {
                    if (isExpanded && !boxContainer.contains(e.target)) {
                        isExpanded = false;
                        contentBox.style.display = 'none';
                    }
                });
                
                boxContainer.appendChild(header);
                boxContainer.appendChild(contentBox);
                
                // Make button cell position relative if not already
                if (getComputedStyle(buttonCell).position === 'static') {
                    buttonCell.style.position = 'relative';
                }
                
                // Remove existing box if any
                const existing = buttonCell.querySelector('.mwh-upgrade-recommendation');
                if (existing) {
                    existing.remove();
                }
                
                buttonCell.appendChild(boxContainer);
                }
            }
        });
    }

    // ============================================================================
    // HEAD TO HEAD STATS
    // ============================================================================
    
    const H2H_DATA_KEY = 'headToHeadStatsData';
    
    /**
     * Get all Head to Head stats data
     * Returns: { battleDefenses: [...], battleAttacks: [...] }
     */
    function getH2HData() {
        return GM_getValue(H2H_DATA_KEY, { battleDefenses: [], battleAttacks: [] });
    }
    
    /**
     * Save Head to Head stats data
     */
    function saveH2HData(data) {
        GM_setValue(H2H_DATA_KEY, data);
    }
    
    /**
     * Extract attack ID from details link
     */
    function extractAttackId(detailsLink) {
        if (!detailsLink) return null;
        const href = detailsLink.getAttribute('href');
        if (!href) return null;
        const match = href.match(/battlelog\.php\?id=(\d+)/);
        return match ? match[1] : null;
    }
    
    /**
     * Parse gold amount from gold span
     */
    function parseGoldFromSpan(goldSpan) {
        if (!goldSpan) return 0;
        const goldText = goldSpan.textContent.trim();
        const match = goldText.match(/([\d,]+)\s*Gold/);
        return match ? parseNumber(match[1]) : 0;
    }
    
    /**
     * Parse relative time string to timestamp
     * Examples: "40 Minutes", "2 Hours", "3 Days", "1 Hour, 30 Minutes"
     */
    function parseRelativeTime(timeText) {
        const now = Date.now();
        let minutesAgo = 0;
        
        // Parse days
        const dayMatch = timeText.match(/(\d+)\s*Day/i);
        if (dayMatch) {
            minutesAgo += parseInt(dayMatch[1], 10) * 24 * 60;
        }
        
        // Parse hours
        const hourMatch = timeText.match(/(\d+)\s*Hour/i);
        if (hourMatch) {
            minutesAgo += parseInt(hourMatch[1], 10) * 60;
        }
        
        // Parse minutes
        const minuteMatch = timeText.match(/(\d+)\s*Minute/i);
        if (minuteMatch) {
            minutesAgo += parseInt(minuteMatch[1], 10);
        }
        
        return now - (minutesAgo * 60 * 1000);
    }
    
    /**
     * Scrape Battle Defense table from current page (attacks against user)
     */
    function scrapeBattleDefensesFromPage(knownIds = new Set()) {
        // Find Battle Defense table - look for the header with colspan="11"
        const defenseHeader = Array.from(document.querySelectorAll('th')).find(th => 
            th.textContent.trim().includes('Battle Defense') && th.getAttribute('colspan') === '11'
        );
        if (!defenseHeader) {
            console.warn('Battle Defense header not found');
            return { attacks: [], hasMore: false, foundKnown: false, totalExpected: 0 };
        }
        
        // Find the table - the header is in a thead, and data is in tbody
        const table = defenseHeader.closest('table') || defenseHeader.closest('tbody') || defenseHeader.parentElement;
        const rows = table.querySelectorAll('tbody tr.r1, tbody tr.r2, tr.r1, tr.r2');
        
        console.log(`Found ${rows.length} defense rows in table`);
        
        const attacks = [];
        let foundKnown = false;
        let skippedCount = 0;
        
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 11) {
                skippedCount++;
                return;
            }
            
            // Extract attack ID from details link
            const detailsLink = cells[10].querySelector('a.link-stats');
            const attackId = extractAttackId(detailsLink);
            if (!attackId) {
                skippedCount++;
                return;
            }
            
            // Check if we've seen this attack before
            // Since logs are in chronological order (newest first), if we find one known ID,
            // all subsequent entries are also known, so we can stop
            if (knownIds.has(attackId)) {
                foundKnown = true;
                console.log(`Found known defense attack ID: ${attackId} - reached old data (chronological order)`);
                return; // Stop processing this page
            }
            
            // Extract enemy name
            const enemyLink = cells[1].querySelector('a.link-battle');
            const enemyName = enemyLink ? enemyLink.textContent.trim() : cells[1].textContent.trim();
            
            // Extract gold stolen (from user)
            const goldSpan = cells[3].querySelector('span.gold');
            const goldStolen = parseGoldFromSpan(goldSpan);
            
            // Extract timestamp (for filtering by date)
            const timeText = cells[0].textContent.trim();
            const timestamp = parseRelativeTime(timeText);
            
            attacks.push({
                id: attackId,
                enemy: enemyName,
                goldStolen: goldStolen,
                time: timeText,
                timestamp: timestamp
            });
        });
        
        if (skippedCount > 0) {
            console.log(`Skipped ${skippedCount} defense rows (invalid format)`);
        }
        
        // Check if there's a next page and get total expected count
        // Footer might be in tfoot, or in a td with colspan, or in the table itself
        let footer = table.querySelector('tfoot td[colspan]');
        if (!footer) {
            footer = table.querySelector('td[colspan]');
        }
        if (!footer) {
            // Try finding any td with colspan in the table's parent
            const parent = table.parentElement;
            if (parent) {
                footer = parent.querySelector('td[colspan]');
            }
        }
        // Also try finding by text content - look for "Attacks On You" or "page X of Y"
        if (!footer) {
            const allTds = Array.from(document.querySelectorAll('td[colspan]'));
            footer = allTds.find(td => {
                const text = td.textContent;
                return text.includes('Attacks On You') || text.includes('Attacks On') || /page \d+ of \d+/.test(text);
            });
        }
        
        // Also check for next page link as fallback
        const nextPageLink = document.querySelector('a[href*="warlogs.php?dp="]');
        
        let hasMore = false;
        let currentPage = 1;
        let totalPages = 1;
        let totalExpected = 0;
        if (footer) {
            const footerText = footer.textContent.trim();
            console.log('Defense footer text:', footerText);
            // Match: "11 Attacks On You | page 1 of 1"
            const countMatch = footerText.match(/(\d+)\s+Attacks?\s+On\s+You/i);
            if (countMatch) {
                totalExpected = parseInt(countMatch[1], 10);
            }
            const pageMatch = footerText.match(/page (\d+) of (\d+)/);
            if (pageMatch) {
                currentPage = parseInt(pageMatch[1], 10);
                totalPages = parseInt(pageMatch[2], 10);
                hasMore = currentPage < totalPages && !foundKnown;
                console.log(`Defense pagination: page ${currentPage} of ${totalPages}, hasMore: ${hasMore}, foundKnown: ${foundKnown}`);
            } else {
                console.warn('Could not parse defense page info from footer:', footerText);
            }
        } else {
            console.warn('Defense footer not found!');
            // Fallback: if we found a next page link, there are more pages
            if (nextPageLink) {
                hasMore = !foundKnown;
                console.log('Defense footer not found, but next page link exists, assuming hasMore:', hasMore);
            }
        }
        
        console.log(`Defense scraping: Found ${attacks.length} new attacks, page ${currentPage}/${totalPages}, total expected: ${totalExpected}`);
        
        return { attacks, hasMore, foundKnown, currentPage, totalPages, totalExpected };
    }
    
    /**
     * Scrape Battle Attacks table from current page (attacks by user)
     */
    function scrapeBattleAttacksFromPage(knownIds = new Set()) {
        // Find Battle Attacks table - look for the header with colspan="11"
        const attackHeader = Array.from(document.querySelectorAll('th')).find(th => 
            th.textContent.trim().includes('Battle Attacks') && th.getAttribute('colspan') === '11'
        );
        if (!attackHeader) {
            console.warn('Battle Attacks header not found');
            return { attacks: [], hasMore: false, foundKnown: false, totalExpected: 0 };
        }
        
        // Find the table - the header is in a thead, and data is in tbody
        let table = attackHeader.closest('table');
        if (!table) {
            // Try to find table by going up the DOM
            let parent = attackHeader.parentElement;
            while (parent && parent.tagName !== 'TABLE') {
                parent = parent.parentElement;
            }
            table = parent;
        }
        if (!table) {
            console.error('Could not find table element');
            return { attacks: [], hasMore: false, foundKnown: false, currentPage: 1, totalPages: 1, totalExpected: 0 };
        }
        
        const rows = table.querySelectorAll('tbody tr.r1, tbody tr.r2, tr.r1, tr.r2');
        
        console.log(`Found ${rows.length} attack rows in table`);
        
        const attacks = [];
        let foundKnown = false;
        let skippedCount = 0;
        
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 11) {
                skippedCount++;
                return;
            }
            
            // Extract attack ID from details link
            const detailsLink = cells[10].querySelector('a.link-stats');
            const attackId = extractAttackId(detailsLink);
            if (!attackId) {
                skippedCount++;
                return;
            }
            
            // Check if we've seen this attack before
            // Since logs are in chronological order (newest first), if we find one known ID,
            // all subsequent entries are also known, so we can stop
            if (knownIds.has(attackId)) {
                foundKnown = true;
                console.log(`Found known attack ID: ${attackId} - reached old data (chronological order)`);
                return; // Stop processing this page
            }
            
            // Extract enemy name
            const enemyLink = cells[1].querySelector('a.link-battle');
            const enemyName = enemyLink ? enemyLink.textContent.trim() : cells[1].textContent.trim();
            
            // Extract gold stolen (from enemy)
            const goldSpan = cells[3].querySelector('span.gold');
            const goldStolen = parseGoldFromSpan(goldSpan);
            
            // Extract timestamp
            const timeText = cells[0].textContent.trim();
            const timestamp = parseRelativeTime(timeText);
            
            attacks.push({
                id: attackId,
                enemy: enemyName,
                goldStolen: goldStolen,
                time: timeText,
                timestamp: timestamp
            });
        });
        
        if (skippedCount > 0) {
            console.log(`Skipped ${skippedCount} attack rows (invalid format)`);
        }
        
        // Check if there's a next page and get total expected count
        // Footer might be in tfoot, or in a td with colspan, or in the table itself
        // Try multiple strategies to find the footer
        
        // Strategy 1: Look for td with "Your Attacks" text content (NOT "Attacks On You")
        // CRITICAL: Must specifically look for "Your Attacks" to avoid matching Battle Defense footer
        let footer = null;
        const allTds = Array.from(document.querySelectorAll('td'));
        footer = allTds.find(td => {
            const text = td.textContent.trim();
            const innerText = td.innerText.trim();
            // Must contain "Your Attacks" (not "Attacks On You") AND have page info
            const hasYourAttacks = (text.includes('Your Attacks') || innerText.includes('Your Attacks')) &&
                                   !text.includes('Attacks On You') && !innerText.includes('Attacks On You');
            const hasPageInfo = /page\s+\d+\s+of\s+\d+/.test(text) || /page\s+\d+\s+of\s+\d+/.test(innerText);
            return hasYourAttacks && hasPageInfo;
        });
        
        // Strategy 2: If not found, try within the table's tfoot
        if (!footer) {
            const tfoot = table.querySelector('tfoot');
            if (tfoot) {
                const tfootTds = tfoot.querySelectorAll('td');
                for (const td of tfootTds) {
                    const text = td.textContent.trim();
                    const innerText = td.innerText.trim();
                    if ((text.includes('Your Attacks') || innerText.includes('Your Attacks')) && 
                        !text.includes('Attacks On You') && !innerText.includes('Attacks On You') &&
                        (/page\s+\d+\s+of\s+\d+/.test(text) || /page\s+\d+\s+of\s+\d+/.test(innerText))) {
                        footer = td;
                        break;
                    }
                }
            }
        }
        
        // Strategy 3: Try any td with colspan in the table (but verify it's "Your Attacks")
        if (!footer) {
            const tableTds = table.querySelectorAll('td[colspan]');
            for (const td of tableTds) {
                const text = td.textContent.trim();
                const innerText = td.innerText.trim();
                if ((text.includes('Your Attacks') || innerText.includes('Your Attacks')) &&
                    !text.includes('Attacks On You') && !innerText.includes('Attacks On You') &&
                    (/page\s+\d+\s+of\s+\d+/.test(text) || /page\s+\d+\s+of\s+\d+/.test(innerText))) {
                    footer = td;
                    break;
                }
            }
        }
        
        // Strategy 4: Look after the table - sometimes footer is in a separate row after tbody
        if (!footer) {
            const tableParent = table.parentElement;
            if (tableParent) {
                // Look for sibling elements after the table
                let nextSibling = table.nextElementSibling;
                while (nextSibling && !footer) {
                    const tds = nextSibling.querySelectorAll('td');
                    for (const td of tds) {
                        const text = td.textContent.trim();
                        const innerText = td.innerText.trim();
                        if ((text.includes('Your Attacks') || innerText.includes('Your Attacks')) &&
                            !text.includes('Attacks On You') && !innerText.includes('Attacks On You') &&
                            (/page\s+\d+\s+of\s+\d+/.test(text) || /page\s+\d+\s+of\s+\d+/.test(innerText))) {
                            footer = td;
                            break;
                        }
                    }
                    nextSibling = nextSibling.nextElementSibling;
                }
            }
        }
        
        // Also check for next page link as fallback
        const nextPageLink = document.querySelector('a[href*="warlogs.php?ap="]');
        const currentUrl = window.location.href;
        const urlApMatch = currentUrl.match(/[?&]ap=(\d+)/);
        const urlCurrentPage = urlApMatch ? parseInt(urlApMatch[1], 10) : 1;
        
        let hasMore = false;
        let currentPage = urlCurrentPage; // Start with URL-based page number
        let totalPages = 1;
        let totalExpected = 0;
        
        if (footer) {
            const footerText = footer.textContent.trim();
            const footerInnerHTML = footer.innerHTML.trim();
            console.log('📄 Attack footer found!');
            console.log('📄 Footer text (raw):', JSON.stringify(footerText));
            console.log('📄 Footer HTML:', footerInnerHTML);
            console.log('📄 Footer element:', footer);
            
            // If text is empty but HTML exists, try innerText or wait a bit
            if (!footerText && footerInnerHTML) {
                console.log('⚠️ Footer text is empty but HTML exists, trying innerText...');
                const innerText = footer.innerText.trim();
                console.log('📄 Footer innerText:', JSON.stringify(innerText));
                if (innerText) {
                    // Use innerText instead
                    footer = { textContent: innerText };
                }
            }
            
            const finalFooterText = footer.textContent ? footer.textContent.trim() : footerText;
            
            // Match: "431 Your Attacks | page 1 of 22"
            // Try multiple patterns to be robust
            const countMatch = finalFooterText.match(/(\d+)\s+Your\s+Attacks?/i);
            if (countMatch) {
                totalExpected = parseInt(countMatch[1], 10);
                console.log(`📄 Parsed total expected: ${totalExpected}`);
            } else {
                console.warn('⚠️ Could not parse total expected from footer:', finalFooterText);
            }
            
            // Try multiple regex patterns for page info
            let pageMatch = finalFooterText.match(/page\s+(\d+)\s+of\s+(\d+)/i);
            if (!pageMatch) {
                // Try with pipe separator: "| page 1 of 22"
                pageMatch = finalFooterText.match(/\|\s*page\s+(\d+)\s+of\s+(\d+)/i);
            }
            if (!pageMatch) {
                // Try without "page" word: "1 of 22"
                pageMatch = finalFooterText.match(/(\d+)\s+of\s+(\d+)/i);
            }
            if (!pageMatch) {
                // Try slash format: "1/22"
                pageMatch = finalFooterText.match(/(\d+)\s*\/\s*(\d+)/);
            }
            
            if (pageMatch) {
                currentPage = parseInt(pageMatch[1], 10);
                totalPages = parseInt(pageMatch[2], 10);
                hasMore = currentPage < totalPages && !foundKnown;
                console.log(`✅ Attack pagination from footer: page ${currentPage} of ${totalPages}, hasMore: ${hasMore}, foundKnown: ${foundKnown}`);
            } else {
                console.error('❌ Could not parse attack page info from footer with any pattern!');
                console.error('Footer text:', finalFooterText);
                console.error('Footer HTML:', footerInnerHTML);
                console.error('Tried patterns: /page\\s+(\\d+)\\s+of\\s+(\\d+)/i, /\\|\\s*page\\s+(\\d+)\\s+of\\s+(\\d+)/i, /(\\d+)\\s+of\\s+(\\d+)/i, /(\\d+)\\s*\\/\\s*(\\d+)/');
            }
        } else {
            console.error('❌ Attack footer not found! Trying fallbacks...');
            // Try to find ANY td that might be the footer
            const allTds = Array.from(document.querySelectorAll('td'));
            console.log(`Found ${allTds.length} td elements total`);
            console.log('Looking for footer with "Your Attacks" (not "Attacks On You")...');
            allTds.forEach((td, idx) => {
                const text = td.textContent.trim();
                const innerText = td.innerText.trim();
                // Show both "Your Attacks" and "Attacks On You" to see what we're finding
                if (text.includes('Your Attacks') || text.includes('Attacks On You') || 
                    innerText.includes('Your Attacks') || innerText.includes('Attacks On You')) {
                    const isYourAttacks = text.includes('Your Attacks') || innerText.includes('Your Attacks');
                    const isAttacksOnYou = text.includes('Attacks On You') || innerText.includes('Attacks On You');
                    console.log(`  td[${idx}]: text="${text}", innerText="${innerText}"`);
                    console.log(`    -> "Your Attacks": ${isYourAttacks}, "Attacks On You": ${isAttacksOnYou}`);
                }
            });
        }
        
        // Fallback: check for next page link (ONLY if footer parsing failed)
        // Don't use this to set totalPages - we need the footer for that
        if (!footer || totalPages === 1) {
            if (nextPageLink) {
                const linkHref = nextPageLink.getAttribute('href');
                const linkText = nextPageLink.textContent.trim();
                console.log('⚠️ Footer parsing failed, checking next page link:', linkHref, 'Text:', linkText);
                
                // Extract next page number from link text (e.g., "2 >>" or "2 &gt;&gt;" means next is page 2)
                const nextPageMatch = linkText.match(/(\d+)\s*[>&]+\s*[>&]*/);
                if (nextPageMatch) {
                    const nextPageNum = parseInt(nextPageMatch[1], 10);
                    console.log(`Next page link indicates page ${nextPageNum}`);
                    // If next page number is greater than current, we have more pages
                    if (nextPageNum > currentPage) {
                        hasMore = !foundKnown;
                        // DON'T set totalPages from link - we need footer for accurate count
                        console.log(`Inferred from next link text: hasMore = ${hasMore} (but totalPages still unknown)`);
                    }
                }
                
                // Also check the href directly (more reliable)
                const apMatch = linkHref.match(/ap=(\d+)/);
                if (apMatch) {
                    const nextPageFromHref = parseInt(apMatch[1], 10);
                    console.log(`Next page from href: ${nextPageFromHref}`);
                    if (nextPageFromHref > currentPage) {
                        hasMore = !foundKnown;
                        // DON'T set totalPages from link - we need footer for accurate count
                        console.log(`Inferred from href: next page is ${nextPageFromHref}, hasMore = ${hasMore} (but totalPages still unknown)`);
                    }
                }
            } else {
                console.log('No next page link found');
            }
        }
        
        // Final check: if we're on page 1 and found attacks, assume there might be more
        if (currentPage === 1 && attacks.length > 0 && !footer && !nextPageLink) {
            console.warn('Could not determine pagination, but found attacks on page 1. Assuming more pages might exist.');
            // Don't assume hasMore in this case - we need the footer or link to be sure
        }
        
        console.log(`Final attack pagination: currentPage=${currentPage}, totalPages=${totalPages}, hasMore=${hasMore}, foundKnown=${foundKnown}`);
        
        console.log(`Attack scraping: Found ${attacks.length} new attacks, page ${currentPage}/${totalPages}, total expected: ${totalExpected}`);
        
        return { attacks, hasMore, foundKnown, currentPage, totalPages, totalExpected };
    }
    
    /**
     * Wait for page to be ready and elements to exist
     */
    function waitForPageReady(selector, maxWait = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element || (Date.now() - startTime) > maxWait) {
                    clearInterval(checkInterval);
                    resolve(element !== null);
                }
            }, 100);
        });
    }
    
    /**
     * Update Head to Head Stats by scraping war logs
     */
    async function updateHeadToHeadStats() {
        // Navigate to war logs page
        const baseUrl = window.location.origin.includes('www.') 
            ? 'https://www.monsterswrath.com' 
            : 'https://monsterswrath.com';
        
        // Check if we're in the middle of scraping
        let scrapingState = GM_getValue('mwh_h2h_scraping', null);
        
        // If we're not on warlogs.php, navigate to the appropriate starting page
        if (!window.location.href.includes('warlogs.php')) {
            if (!scrapingState) {
                // Starting fresh - go to defense page 1
                window.location.href = `${baseUrl}/delta2/warlogs.php?dp=1`;
                GM_setValue('mwh_h2h_update_pending', true);
                return;
            } else if (scrapingState.phase === 'defense') {
                // Continue defense scraping
                window.location.href = `${baseUrl}/delta2/warlogs.php?dp=${scrapingState.defensePage}`;
                return;
            } else if (scrapingState.phase === 'attack') {
                // Continue attack scraping
                window.location.href = `${baseUrl}/delta2/warlogs.php?ap=${scrapingState.attackPage}`;
                return;
            }
        }
        
        // Wait for page to be ready - check for either table header
        const pageReady = await waitForPageReady('th');
        if (!pageReady) {
            console.warn('Page not ready, retrying...');
            setTimeout(() => updateHeadToHeadStats(), 1000);
            return;
        }
        
        // We're on the war logs page, start scraping
        const existingData = getH2HData();
        
        // Reload state to ensure we have latest
        scrapingState = GM_getValue('mwh_h2h_scraping', null);
        
        // Check if this is a fresh scrape (no known IDs)
        const isFreshScrape = GM_getValue('mwh_h2h_fresh_scrape', false);
        
        // Debug: Log current state and URL
        console.log('🔍 Current URL:', window.location.href);
        if (scrapingState) {
            console.log('🔍 Current scraping state:', {
                phase: scrapingState.phase,
                defensePage: scrapingState.defensePage,
                attackPage: scrapingState.attackPage,
                attackTotalPages: scrapingState.attackTotalPages,
                isFreshScrape: scrapingState.isFreshScrape,
                defenseCount: scrapingState.defenseCount,
                attackCount: scrapingState.attackCount
            });
        }
        
        if (!scrapingState) {
            // Start scraping
            let knownDefenseIds = new Set();
            let knownAttackIds = new Set();
            let existingDefenses = [];
            let existingAttacks = [];
            
            if (!isFreshScrape) {
                // Normal update: use existing data to skip known entries
                knownDefenseIds = new Set(existingData.battleDefenses.map(a => a.id));
                knownAttackIds = new Set(existingData.battleAttacks.map(a => a.id));
                existingDefenses = existingData.battleDefenses;
                existingAttacks = existingData.battleAttacks;
                showNotification('Starting to scrape new Battle Defense logs...', 2000);
            } else {
                // Fresh scrape: clear flag and start with empty data
                GM_deleteValue('mwh_h2h_fresh_scrape');
                showNotification('Starting fresh scrape of all Battle Defense logs...', 2000);
            }
            
            GM_setValue('mwh_h2h_scraping', {
                phase: 'defense',
                defensePage: 1,
                attackPage: 1,
                defenseCount: 0,
                attackCount: 0,
                defenseTotalExpected: 0,
                attackTotalExpected: 0,
                attackTotalPages: 0, // Will be set when we scrape the first attack page
                isFreshScrape: isFreshScrape,
                knownDefenseIds: Array.from(knownDefenseIds),
                knownAttackIds: Array.from(knownAttackIds),
                existingDefenses: existingDefenses,
                existingAttacks: existingAttacks
            });
            
            // Navigate directly to defense page 1
            window.location.href = `${baseUrl}/delta2/warlogs.php?dp=1`;
            return;
        }
        
            // Continue scraping based on current state
        if (scrapingState.phase === 'defense') {
            // Wait for defense table to be ready
            const defenseReady = await waitForPageReady('th');
            if (!defenseReady) {
                setTimeout(() => updateHeadToHeadStats(), 1000);
                return;
            }
            
            // Get current page from URL
            const urlParams = new URLSearchParams(window.location.search);
            const currentDp = urlParams.get('dp') ? parseInt(urlParams.get('dp'), 10) : 1;
            
            // For fresh scrape, use empty set (collect everything)
            // For normal update, use known IDs to stop when we find old data
            const knownIds = scrapingState.isFreshScrape ? new Set() : new Set(scrapingState.knownDefenseIds);
            const result = scrapeBattleDefensesFromPage(knownIds);
            
            // Store total expected from first page
            if (result.totalExpected > 0 && scrapingState.defenseTotalExpected === 0) {
                scrapingState.defenseTotalExpected = result.totalExpected;
            }
            
            // Add defenses to state BEFORE checking continuation
            if (result.attacks.length > 0) {
                scrapingState.existingDefenses.unshift(...result.attacks);
                scrapingState.defenseCount += result.attacks.length;
            }
            
            // Determine current page and total pages
            const currentPage = result.currentPage || currentDp;
            const totalPages = result.totalPages || 1;
            
            console.log(`📊 Defense page ${currentPage} of ${totalPages}: Found ${result.attacks.length} defenses (total: ${scrapingState.defenseCount})`);
            
            // For normal update: stop when we find known data
            if (!scrapingState.isFreshScrape && result.foundKnown) {
                console.log('Found known defense data, moving to attack phase');
                scrapingState.phase = 'attack';
                scrapingState.attackPage = 1;
                GM_setValue('mwh_h2h_scraping', scrapingState);
                showNotification(`Scraping Battle Attacks logs... (${scrapingState.defenseCount} defenses collected)`, 2000);
                setTimeout(() => {
                    window.location.href = `${baseUrl}/delta2/warlogs.php?ap=1`;
                }, 1500);
                return;
            }
            
            // Continue to next page or move to attack phase
            if (currentPage < totalPages) {
                // More defense pages
                const nextPage = currentPage + 1;
                scrapingState.defensePage = nextPage;
                GM_setValue('mwh_h2h_scraping', scrapingState);
                showNotification(`Scraping Defense page ${currentPage}... (${scrapingState.defenseCount} collected)`, 1500);
                setTimeout(() => {
                    window.location.href = `${baseUrl}/delta2/warlogs.php?dp=${nextPage}`;
                }, 1500);
                return;
            } else {
                // No more defense pages, move to attack phase
                console.log('No more defense pages, moving to attack phase');
                scrapingState.phase = 'attack';
                scrapingState.attackPage = 1;
                GM_setValue('mwh_h2h_scraping', scrapingState);
                showNotification(`Scraping Battle Attacks logs... (${scrapingState.defenseCount} defenses collected)`, 2000);
                setTimeout(() => {
                    window.location.href = `${baseUrl}/delta2/warlogs.php?ap=1`;
                }, 1500);
                return;
            }
            
        } else if (scrapingState.phase === 'attack') {
            // Reload state to ensure we have latest values (including accumulated attacks from previous pages)
            scrapingState = GM_getValue('mwh_h2h_scraping', scrapingState);
            console.log(`📥 Reloaded state: ${scrapingState.existingAttacks.length} attacks already collected, attackCount=${scrapingState.attackCount}`);
            
            // Wait for attack table to be ready
            const attackReady = await waitForPageReady('th');
            if (!attackReady) {
                setTimeout(() => updateHeadToHeadStats(), 1000);
                return;
            }
            
            // Get current page from URL
            const attackUrlParams = new URLSearchParams(window.location.search);
            const currentAp = attackUrlParams.get('ap') ? parseInt(attackUrlParams.get('ap'), 10) : 1;
            
            // For fresh scrape, use empty set (collect everything)
            // For normal update, use known IDs to stop when we find old data
            const knownIds = scrapingState.isFreshScrape ? new Set() : new Set(scrapingState.knownAttackIds);
            const result = scrapeBattleAttacksFromPage(knownIds);
            
            // Add attacks to state FIRST (before any state reloads)
            if (result.attacks.length > 0) {
                scrapingState.existingAttacks.unshift(...result.attacks);
                scrapingState.attackCount += result.attacks.length;
                console.log(`➕ Added ${result.attacks.length} attacks. Total now: ${scrapingState.existingAttacks.length} (count: ${scrapingState.attackCount})`);
            }
            
            // On page 1, read the footer to get total pages and store it
            if (currentAp === 1) {
                console.log(`🔍 Page 1: result.totalPages = ${result.totalPages}, result.totalExpected = ${result.totalExpected}`);
                console.log(`🔍 Page 1: result.currentPage = ${result.currentPage}`);
                
                if (result.totalExpected > 0 && scrapingState.attackTotalExpected === 0) {
                    scrapingState.attackTotalExpected = result.totalExpected;
                    console.log(`💾 Stored attack total expected: ${result.totalExpected}`);
                }
                
                if (result.totalPages > 1) {
                    scrapingState.attackTotalPages = result.totalPages;
                    console.log(`💾 Stored attack total pages: ${result.totalPages}`);
                } else {
                    console.error(`❌ CRITICAL: Failed to get total pages from page 1 footer!`);
                    console.error(`   result.totalPages = ${result.totalPages}`);
                    console.error(`   This means footer parsing failed. Check console for footer parsing logs above.`);
                }
            }
            
            // Use stored totalPages if available, otherwise use result
            // CRITICAL: Use URL page number as source of truth for current page
            const currentPage = currentAp; // Always use URL, not result.currentPage
            const totalPages = scrapingState.attackTotalPages || result.totalPages || 1;
            
            console.log(`📊 Attack page ${currentPage} of ${totalPages}: Found ${result.attacks.length} attacks (total in state: ${scrapingState.existingAttacks.length}, count: ${scrapingState.attackCount})`);
            console.log(`📊 State check: attackTotalPages=${scrapingState.attackTotalPages}, result.totalPages=${result.totalPages}, totalPages=${totalPages}`);
            console.log(`📊 Continuation check: currentPage=${currentPage}, totalPages=${totalPages}, comparison: ${currentPage} < ${totalPages} = ${currentPage < totalPages}`);
            
            // CRITICAL: Save state IMMEDIATELY after adding attacks and before navigation
            // This ensures all accumulated data is persisted
            GM_setValue('mwh_h2h_scraping', scrapingState);
            console.log(`💾 Saved state: ${scrapingState.existingAttacks.length} attacks, ${scrapingState.attackCount} count`);
            
            // For normal update: stop when we find known data
            if (!scrapingState.isFreshScrape && result.foundKnown) {
                console.log('⚠️ Found known attack data, completing scrape');
                // Fall through to validation and save
            } else if (currentPage === 1 && totalPages === 1) {
                // CRITICAL: On page 1, if totalPages is still 1, footer parsing failed
                // Don't continue - we can't determine if there are more pages
                console.error(`❌ CRITICAL ERROR: On page 1, totalPages is still 1!`);
                console.error(`   This means footer parsing completely failed.`);
                console.error(`   Cannot continue scraping without knowing total pages.`);
                console.error(`   Check console logs above for footer parsing details.`);
                // Fall through to validation and save (with error)
            } else if (currentPage < totalPages) {
                // Continue to next attack page
                const nextPage = currentPage + 1;
                console.log(`✅ Continuing: page ${currentPage} < ${totalPages}, going to page ${nextPage}`);
                
                // Update page number and save state again (with all accumulated attacks)
                scrapingState.attackPage = nextPage;
                GM_setValue('mwh_h2h_scraping', scrapingState);
                console.log(`💾 Saved state before navigation: ${scrapingState.existingAttacks.length} attacks, ${scrapingState.attackCount} count`);
                
                // Show notification for CURRENT page being scraped, not next
                showNotification(`Scraping Attack page ${currentPage} of ${totalPages}... (${scrapingState.attackCount} attacks collected)`, 2000);
                
                setTimeout(() => {
                    console.log(`🚀 Navigating to page ${nextPage}: ${baseUrl}/delta2/warlogs.php?ap=${nextPage}`);
                    window.location.href = `${baseUrl}/delta2/warlogs.php?ap=${nextPage}`;
                }, 2000);
                return; // Continue scraping
            } else {
                // Reached last page
                console.log(`✅ Reached last attack page (${currentPage} of ${totalPages}), completing scrape`);
                // Fall through to validation and save
            }
            
            // Done scraping - reload state one final time to ensure we have all accumulated data
            scrapingState = GM_getValue('mwh_h2h_scraping', scrapingState);
            console.log(`📥 Final state reload: ${scrapingState.existingAttacks.length} attacks, ${scrapingState.existingDefenses.length} defenses`);
            
            // Validate data
            const finalDefenseCount = scrapingState.existingDefenses.length;
            const finalAttackCount = scrapingState.existingAttacks.length;
            
            console.log(`=== VALIDATION ===`);
            console.log(`Defense: Collected ${finalDefenseCount}, Expected ${scrapingState.defenseTotalExpected}`);
            console.log(`Attack: Collected ${finalAttackCount}, Expected ${scrapingState.attackTotalExpected}`);
            console.log(`Attack array length: ${scrapingState.existingAttacks.length}, attackCount: ${scrapingState.attackCount}`);
            
            let needsRescrape = false;
            let validationMessage = '';
            
            // Validate defense count
            if (scrapingState.defenseTotalExpected > 0) {
                if (finalDefenseCount !== scrapingState.defenseTotalExpected) {
                    needsRescrape = true;
                    validationMessage += `Defense: Expected ${scrapingState.defenseTotalExpected}, got ${finalDefenseCount}. `;
                } else {
                    console.log(`✓ Defense count matches: ${finalDefenseCount}`);
                }
            }
            
            // Validate attack count
            if (scrapingState.attackTotalExpected > 0) {
                if (finalAttackCount !== scrapingState.attackTotalExpected) {
                    needsRescrape = true;
                    validationMessage += `Attack: Expected ${scrapingState.attackTotalExpected}, got ${finalAttackCount}. `;
                } else {
                    console.log(`✓ Attack count matches: ${finalAttackCount}`);
                }
            }
            
            if (needsRescrape) {
                console.warn('❌ Data validation failed:', validationMessage);
                // Show validation message with option to fresh scrape
                const validationMsg = `Data Validation Failed!\n\n` +
                    `${validationMessage}\n\n` +
                    `This usually means some data was missed during scraping.\n\n` +
                    `Would you like to do a fresh scrape? (This will clear all existing data and re-scrape everything)`;
                
                const shouldRescrape = confirm(validationMsg);
                
                if (shouldRescrape) {
                    // Clear existing data and start fresh
                    saveH2HData({ battleDefenses: [], battleAttacks: [] });
                    GM_deleteValue('mwh_h2h_scraping');
                    GM_deleteValue('mwh_h2h_update_pending');
                    // Set fresh scrape flag
                    GM_setValue('mwh_h2h_fresh_scrape', true);
                    
                    showNotification('Starting fresh scrape due to validation failure...', 2000);
                    // Navigate to start page
                    setTimeout(() => {
                        window.location.href = warlogsUrl;
                    }, 1000);
                    return;
                } else {
                    // User chose not to rescrape, but show warning
                    showNotification(`Validation failed! ${validationMessage} Consider using "Fresh Scrape" button.`, 8000);
                }
            } else {
                console.log('✓ Validation passed - all counts match');
            }
            
            // Save data
            const finalData = {
                battleDefenses: scrapingState.existingDefenses,
                battleAttacks: scrapingState.existingAttacks
            };
            saveH2HData(finalData);
            GM_deleteValue('mwh_h2h_scraping');
            GM_deleteValue('mwh_h2h_update_pending');
            
            const validationText = needsRescrape ? ' (validation failed but saved anyway)' : '';
            showNotification(`${scrapingState.defenseCount} battle defenses recorded, ${scrapingState.attackCount} battle attacks recorded${validationText}`, 5000);
            
            // Show the stats page
            setTimeout(() => {
                showHeadToHeadStats();
            }, 2000);
        }
    }
    
    /**
     * Show Head to Head Stats display page
     */
    function showHeadToHeadStats() {
        // Navigate to a special URL that will trigger the display
        const baseUrl = window.location.origin.includes('www.') 
            ? 'https://www.monsterswrath.com' 
            : 'https://monsterswrath.com';
        window.location.href = `${baseUrl}/delta2/warlogs.php?mwh=h2h`;
    }
    
    /**
     * Create Head to Head Stats display page
     */
    function createHeadToHeadStatsPage() {
        const existing = document.getElementById('mwh-h2h-display');
        if (existing) existing.remove();
        
        const data = getH2HData();
        
        // Get player intelligence to identify real players vs farms
        const playerIntel = getPlayerIntelligence();
        // Create a set of real player usernames (case-insensitive)
        const realPlayerNames = new Set();
        Object.values(playerIntel).forEach(player => {
            if (player.username) {
                realPlayerNames.add(player.username.toLowerCase());
            }
        });
        
        // Helper function to check if a player is a farm
        const isFarm = (playerName) => {
            return !realPlayerNames.has(playerName.toLowerCase());
        };
        
        const container = document.createElement('div');
        container.id = 'mwh-h2h-display';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            z-index: 99999;
            overflow-y: auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #fff;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 30px; text-align: center;';
        const title = document.createElement('h1');
        title.textContent = 'Head to Head Stats';
        title.style.cssText = 'margin: 0 0 10px 0; color: #4B9CD3;';
        header.appendChild(title);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Close';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;
        closeBtn.addEventListener('click', () => {
            container.remove();
            // Remove URL parameter
            const url = new URL(window.location.href);
            url.searchParams.delete('mwh');
            window.history.replaceState({}, '', url);
        });
        container.appendChild(closeBtn);
        
        container.appendChild(header);
        
        // Calculate Head to Head stats - separate farms from real players
        const h2hStats = {};
        const farmStats = { stolenFrom: 0, lostTo: 0 };
        
        // Process battle defenses (gold lost to enemies)
        data.battleDefenses.forEach(attack => {
            if (isFarm(attack.enemy)) {
                farmStats.lostTo += attack.goldStolen;
            } else {
                if (!h2hStats[attack.enemy]) {
                    h2hStats[attack.enemy] = { stolenFrom: 0, lostTo: 0 };
                }
                h2hStats[attack.enemy].lostTo += attack.goldStolen;
            }
        });
        
        // Process battle attacks (gold stolen from enemies)
        data.battleAttacks.forEach(attack => {
            if (isFarm(attack.enemy)) {
                farmStats.stolenFrom += attack.goldStolen;
            } else {
                if (!h2hStats[attack.enemy]) {
                    h2hStats[attack.enemy] = { stolenFrom: 0, lostTo: 0 };
                }
                h2hStats[attack.enemy].stolenFrom += attack.goldStolen;
            }
        });
        
        // Create Head to Head table with collapsible functionality
        const h2hTableSection = document.createElement('div');
        h2hTableSection.style.marginBottom = '40px';
        
        const h2hTitleContainer = document.createElement('div');
        h2hTitleContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;';
        
        const h2hToggle = document.createElement('span');
        h2hToggle.textContent = '▼';
        h2hToggle.style.cssText = 'margin-right: 10px; font-size: 12px; color: #4B9CD3; user-select: none;';
        
        const h2hTitle = document.createElement('h2');
        h2hTitle.textContent = 'Head to Head Stats';
        h2hTitle.style.cssText = 'margin: 0; color: #4B9CD3;';
        
        h2hTitleContainer.appendChild(h2hToggle);
        h2hTitleContainer.appendChild(h2hTitle);
        
        const h2hTableContainer = document.createElement('div');
        h2hTableContainer.style.cssText = 'display: block;'; // Default to visible
        
        let h2hExpanded = true;
        h2hTitleContainer.addEventListener('click', () => {
            h2hExpanded = !h2hExpanded;
            h2hTableContainer.style.display = h2hExpanded ? 'block' : 'none';
            h2hToggle.textContent = h2hExpanded ? '▼' : '▶';
        });
        
        h2hTableSection.appendChild(h2hTitleContainer);
        
        const h2hTable = document.createElement('table');
        h2hTable.style.cssText = 'width: 100%; border-collapse: collapse; background: #1a1a1a;';
        
        // Header
        const h2hThead = document.createElement('thead');
        const h2hHeaderRow = document.createElement('tr');
        h2hHeaderRow.style.cssText = 'background: #333;';
        
        const headers = ['Player', 'Gold Stolen From', 'Gold Lost To', 'Differential'];
        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.cssText = 'padding: 12px; text-align: left; border-bottom: 2px solid #4B9CD3; cursor: pointer;';
            if (index > 0) {
                th.style.textAlign = 'right';
                th.dataset.sort = ['player', 'stolenFrom', 'lostTo', 'differential'][index];
                th.addEventListener('click', () => sortH2HTable(h2hTable, index));
            }
            h2hHeaderRow.appendChild(th);
        });
        h2hThead.appendChild(h2hHeaderRow);
        h2hTable.appendChild(h2hThead);
        
        // Body
        const h2hTbody = document.createElement('tbody');
        const h2hPlayers = Object.keys(h2hStats).sort();
        
        // Add farm row first (if there are any farm stats)
        const farmDifferential = farmStats.stolenFrom - farmStats.lostTo;
        if (farmStats.stolenFrom > 0 || farmStats.lostTo > 0) {
            const farmRow = document.createElement('tr');
            farmRow.style.cssText = 'border-bottom: 2px solid #555; background: rgba(255, 215, 0, 0.1);';
            
            const farmPlayerCell = document.createElement('td');
            farmPlayerCell.textContent = 'All Farms (Combined)';
            farmPlayerCell.style.cssText = 'padding: 10px; font-weight: bold; color: #FFD700;';
            farmRow.appendChild(farmPlayerCell);
            
            const farmStolenCell = document.createElement('td');
            farmStolenCell.textContent = formatNumberWithCommas(farmStats.stolenFrom);
            farmStolenCell.dataset.sortValue = farmStats.stolenFrom;
            farmStolenCell.style.cssText = 'padding: 10px; text-align: right; color: #FFD700; font-weight: bold;';
            farmRow.appendChild(farmStolenCell);
            
            const farmLostCell = document.createElement('td');
            farmLostCell.textContent = formatNumberWithCommas(farmStats.lostTo);
            farmLostCell.dataset.sortValue = farmStats.lostTo;
            farmLostCell.style.cssText = 'padding: 10px; text-align: right; color: #FFD700; font-weight: bold;';
            farmRow.appendChild(farmLostCell);
            
            const farmDiffCell = document.createElement('td');
            farmDiffCell.textContent = formatNumberWithCommas(farmDifferential);
            farmDiffCell.dataset.sortValue = farmDifferential;
            farmDiffCell.style.cssText = `padding: 10px; text-align: right; color: ${farmDifferential >= 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;`;
            farmRow.appendChild(farmDiffCell);
            
            h2hTbody.appendChild(farmRow);
        }
        
        // Add real player rows
        h2hPlayers.forEach(player => {
            const stats = h2hStats[player];
            const differential = stats.stolenFrom - stats.lostTo;
            
            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #333;';
            
            const playerCell = document.createElement('td');
            playerCell.textContent = player;
            playerCell.style.cssText = 'padding: 10px;';
            row.appendChild(playerCell);
            
            const stolenCell = document.createElement('td');
            stolenCell.textContent = formatNumberWithCommas(stats.stolenFrom);
            stolenCell.dataset.sortValue = stats.stolenFrom; // Store numeric value for sorting
            stolenCell.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(stolenCell);
            
            const lostCell = document.createElement('td');
            lostCell.textContent = formatNumberWithCommas(stats.lostTo);
            lostCell.dataset.sortValue = stats.lostTo; // Store numeric value for sorting
            lostCell.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(lostCell);
            
            const diffCell = document.createElement('td');
            diffCell.textContent = formatNumberWithCommas(differential);
            diffCell.dataset.sortValue = differential; // Store numeric value for sorting
            diffCell.style.cssText = `padding: 10px; text-align: right; color: ${differential >= 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;`;
            row.appendChild(diffCell);
            
            h2hTbody.appendChild(row);
        });
        
        h2hTable.appendChild(h2hTbody);
        h2hTableContainer.appendChild(h2hTable);
        h2hTableSection.appendChild(h2hTableContainer);
        container.appendChild(h2hTableSection);
        
        // Calculate own attack stats
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
        
        const last24h = data.battleAttacks.filter(a => a.timestamp >= oneDayAgo);
        const last3Days = data.battleAttacks.filter(a => a.timestamp >= threeDaysAgo);
        const allTime = data.battleAttacks;
        
        // Separate attacks by target type (players vs farms)
        const separateByTarget = (attacks) => {
            const vsPlayers = attacks.filter(a => !isFarm(a.enemy));
            const vsFarms = attacks.filter(a => isFarm(a.enemy));
            return { vsPlayers, vsFarms };
        };
        
        const last24hSeparated = separateByTarget(last24h);
        const last3DaysSeparated = separateByTarget(last3Days);
        const allTimeSeparated = separateByTarget(allTime);
        
        const calculateStats = (attacks) => {
            const totalGold = attacks.reduce((sum, a) => sum + a.goldStolen, 0);
            const avgGold = attacks.length > 0 ? totalGold / attacks.length : 0;
            return {
                totalGold,
                avgGold,
                count: attacks.length
            };
        };
        
        // Calculate stats for all attacks
        const stats24h = calculateStats(last24h);
        const stats3Days = calculateStats(last3Days);
        const statsAll = calculateStats(allTime);
        
        // Calculate stats for players vs farms
        const stats24hPlayers = calculateStats(last24hSeparated.vsPlayers);
        const stats24hFarms = calculateStats(last24hSeparated.vsFarms);
        const stats3DaysPlayers = calculateStats(last3DaysSeparated.vsPlayers);
        const stats3DaysFarms = calculateStats(last3DaysSeparated.vsFarms);
        const statsAllPlayers = calculateStats(allTimeSeparated.vsPlayers);
        const statsAllFarms = calculateStats(allTimeSeparated.vsFarms);
        
        // Create Own Attack Stats table with collapsible functionality
        const ownStatsSection = document.createElement('div');
        
        const ownStatsTitleContainer = document.createElement('div');
        ownStatsTitleContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;';
        
        const ownStatsToggle = document.createElement('span');
        ownStatsToggle.textContent = '▼';
        ownStatsToggle.style.cssText = 'margin-right: 10px; font-size: 12px; color: #4B9CD3; user-select: none;';
        
        const ownStatsTitle = document.createElement('h2');
        ownStatsTitle.textContent = 'Your Attack Stats';
        ownStatsTitle.style.cssText = 'margin: 0; color: #4B9CD3;';
        
        ownStatsTitleContainer.appendChild(ownStatsToggle);
        ownStatsTitleContainer.appendChild(ownStatsTitle);
        
        const ownStatsTableContainer = document.createElement('div');
        ownStatsTableContainer.style.cssText = 'display: block;'; // Default to visible
        
        let ownStatsExpanded = true;
        ownStatsTitleContainer.addEventListener('click', () => {
            ownStatsExpanded = !ownStatsExpanded;
            ownStatsTableContainer.style.display = ownStatsExpanded ? 'block' : 'none';
            ownStatsToggle.textContent = ownStatsExpanded ? '▼' : '▶';
        });
        
        ownStatsSection.appendChild(ownStatsTitleContainer);
        
        const ownStatsTable = document.createElement('table');
        ownStatsTable.style.cssText = 'width: 100%; border-collapse: collapse; background: #1a1a1a;';
        
        // Header
        const ownStatsThead = document.createElement('thead');
        const ownStatsHeaderRow = document.createElement('tr');
        ownStatsHeaderRow.style.cssText = 'background: #333;';
        
        const ownStatsHeaders = ['Metric', 'Last 24 Hours', 'Last 3 Days', 'All Age'];
        ownStatsHeaders.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.cssText = 'padding: 12px; text-align: left; border-bottom: 2px solid #4B9CD3;';
            if (ownStatsHeaders.indexOf(headerText) > 0) {
                th.style.textAlign = 'right';
            }
            ownStatsHeaderRow.appendChild(th);
        });
        ownStatsThead.appendChild(ownStatsHeaderRow);
        ownStatsTable.appendChild(ownStatsThead);
        
        // Body
        const ownStatsTbody = document.createElement('tbody');
        
        // All Attacks section
        const allAttacksHeader = document.createElement('tr');
        allAttacksHeader.style.cssText = 'background: #2a2a2a; font-weight: bold;';
        const allAttacksHeaderCell = document.createElement('td');
        allAttacksHeaderCell.textContent = 'All Attacks';
        allAttacksHeaderCell.colSpan = 4;
        allAttacksHeaderCell.style.cssText = 'padding: 10px; color: #4B9CD3;';
        allAttacksHeader.appendChild(allAttacksHeaderCell);
        ownStatsTbody.appendChild(allAttacksHeader);
        
        const metrics = [
            { label: 'Total Gold Stolen', getValue: (s) => formatNumberWithCommas(s.totalGold) },
            { label: 'Average Gold per Attack', getValue: (s) => formatNumberWithCommas(Math.round(s.avgGold)) },
            { label: 'Number of Attacks', getValue: (s) => s.count.toLocaleString() }
        ];
        
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #333;';
            
            const labelCell = document.createElement('td');
            labelCell.textContent = metric.label;
            labelCell.style.cssText = 'padding: 10px; font-weight: bold;';
            row.appendChild(labelCell);
            
            const cell24h = document.createElement('td');
            cell24h.textContent = metric.getValue(stats24h);
            cell24h.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cell24h);
            
            const cell3Days = document.createElement('td');
            cell3Days.textContent = metric.getValue(stats3Days);
            cell3Days.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cell3Days);
            
            const cellAll = document.createElement('td');
            cellAll.textContent = metric.getValue(statsAll);
            cellAll.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cellAll);
            
            ownStatsTbody.appendChild(row);
        });
        
        // Separator row
        const separatorRow = document.createElement('tr');
        separatorRow.style.cssText = 'height: 10px;';
        const separatorCell = document.createElement('td');
        separatorCell.colSpan = 4;
        separatorCell.style.cssText = 'padding: 0; border: none;';
        separatorRow.appendChild(separatorCell);
        ownStatsTbody.appendChild(separatorRow);
        
        // vs Players section
        const vsPlayersHeader = document.createElement('tr');
        vsPlayersHeader.style.cssText = 'background: #2a2a2a; font-weight: bold;';
        const vsPlayersHeaderCell = document.createElement('td');
        vsPlayersHeaderCell.textContent = 'vs Players';
        vsPlayersHeaderCell.colSpan = 4;
        vsPlayersHeaderCell.style.cssText = 'padding: 10px; color: #4CAF50;';
        vsPlayersHeader.appendChild(vsPlayersHeaderCell);
        ownStatsTbody.appendChild(vsPlayersHeader);
        
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #333;';
            
            const labelCell = document.createElement('td');
            labelCell.textContent = metric.label;
            labelCell.style.cssText = 'padding: 10px; font-weight: bold;';
            row.appendChild(labelCell);
            
            const cell24h = document.createElement('td');
            cell24h.textContent = metric.getValue(stats24hPlayers);
            cell24h.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cell24h);
            
            const cell3Days = document.createElement('td');
            cell3Days.textContent = metric.getValue(stats3DaysPlayers);
            cell3Days.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cell3Days);
            
            const cellAll = document.createElement('td');
            cellAll.textContent = metric.getValue(statsAllPlayers);
            cellAll.style.cssText = 'padding: 10px; text-align: right;';
            row.appendChild(cellAll);
            
            ownStatsTbody.appendChild(row);
        });
        
        // Separator row
        const separatorRow2 = document.createElement('tr');
        separatorRow2.style.cssText = 'height: 10px;';
        const separatorCell2 = document.createElement('td');
        separatorCell2.colSpan = 4;
        separatorCell2.style.cssText = 'padding: 0; border: none;';
        separatorRow2.appendChild(separatorCell2);
        ownStatsTbody.appendChild(separatorRow2);
        
        // vs Farms section
        const vsFarmsHeader = document.createElement('tr');
        vsFarmsHeader.style.cssText = 'background: #2a2a2a; font-weight: bold;';
        const vsFarmsHeaderCell = document.createElement('td');
        vsFarmsHeaderCell.textContent = 'vs Farms';
        vsFarmsHeaderCell.colSpan = 4;
        vsFarmsHeaderCell.style.cssText = 'padding: 10px; color: #FFD700;';
        vsFarmsHeader.appendChild(vsFarmsHeaderCell);
        ownStatsTbody.appendChild(vsFarmsHeader);
        
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #333;';
            
            const labelCell = document.createElement('td');
            labelCell.textContent = metric.label;
            labelCell.style.cssText = 'padding: 10px; font-weight: bold;';
            row.appendChild(labelCell);
            
            const cell24h = document.createElement('td');
            cell24h.textContent = metric.getValue(stats24hFarms);
            cell24h.style.cssText = 'padding: 10px; text-align: right; color: #FFD700;';
            row.appendChild(cell24h);
            
            const cell3Days = document.createElement('td');
            cell3Days.textContent = metric.getValue(stats3DaysFarms);
            cell3Days.style.cssText = 'padding: 10px; text-align: right; color: #FFD700;';
            row.appendChild(cell3Days);
            
            const cellAll = document.createElement('td');
            cellAll.textContent = metric.getValue(statsAllFarms);
            cellAll.style.cssText = 'padding: 10px; text-align: right; color: #FFD700;';
            row.appendChild(cellAll);
            
            ownStatsTbody.appendChild(row);
        });
        
        ownStatsTable.appendChild(ownStatsTbody);
        ownStatsTableContainer.appendChild(ownStatsTable);
        ownStatsSection.appendChild(ownStatsTableContainer);
        container.appendChild(ownStatsSection);
        
        document.body.appendChild(container);
    }
    
    /**
     * Sort Head to Head table
     */
    function sortH2HTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const header = table.querySelector('thead tr');
        const sortKey = header.children[columnIndex].dataset.sort;
        
        // Determine sort direction
        const currentSort = header.dataset.currentSort;
        const ascending = currentSort === sortKey && header.dataset.sortDir === 'asc';
        header.dataset.currentSort = sortKey;
        header.dataset.sortDir = ascending ? 'desc' : 'asc';
        
        rows.sort((a, b) => {
            let aVal, bVal;
            
            if (sortKey === 'player') {
                aVal = a.children[0].textContent.trim();
                bVal = b.children[0].textContent.trim();
            } else {
                // Use stored numeric value if available (from data-sort-value attribute)
                // Otherwise parse from text content
                const aCell = a.children[columnIndex];
                const bCell = b.children[columnIndex];
                aVal = aCell.dataset.sortValue ? parseFloat(aCell.dataset.sortValue) : parseNumber(aCell.textContent);
                bVal = bCell.dataset.sortValue ? parseFloat(bCell.dataset.sortValue) : parseNumber(bCell.textContent);
            }
            
            if (aVal < bVal) return ascending ? 1 : -1;
            if (aVal > bVal) return ascending ? -1 : 1;
            return 0;
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Attempt to scrape inventory with retries (for mobile compatibility)
     */
    function scrapeInventoryWithRetry(retries = 3, delay = 500) {
        const result = scrapeInventory();
        const foundCount = Object.values(result.inventory).filter(qty => qty > 0).length;
        
        // If we found 0 weapons and have retries left, try again
        if (foundCount === 0 && retries > 0) {
            console.log(`No weapons found, retrying... (${retries} retries left)`);
            setTimeout(() => {
                scrapeInventoryWithRetry(retries - 1, delay * 1.5); // Increase delay each retry
            }, delay);
        }
    }

    /**
     * Prefill sell amounts from URL parameters
     */
    function prefillSellFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const sellParam = urlParams.get('sell');
        
        if (!sellParam) return false;
        
        try {
            // Parse sell parameters (format: "type-htmlTag=quantity&type-htmlTag=quantity")
            const sellItems = sellParam.split('&');
            let filledCount = 0;
            
            sellItems.forEach(item => {
                const [encodedKey, encodedQuantity] = item.split('=');
                if (!encodedKey || !encodedQuantity) {
                    console.warn('Invalid sell item format:', item);
                    return;
                }
                
                // Decode the key and quantity (they're URL encoded)
                const key = decodeURIComponent(encodedKey);
                const quantityStr = decodeURIComponent(encodedQuantity);
                
                const [type, htmlTag] = key.split('-');
                if (!type || !htmlTag) {
                    console.warn('Invalid sell key format:', key);
                    return;
                }
                
                const quantity = parseInt(quantityStr, 10);
                if (isNaN(quantity) || quantity <= 0) {
                    console.warn('Invalid quantity:', quantityStr);
                    return;
                }
                
                // Map our internal type names to HTML type names
                // Security weapons use "magic" in the HTML, not "security"
                const htmlTypeMap = {
                    'security': 'magic',
                    'attack': 'attack',
                    'defense': 'defense',
                    'stealth': 'stealth'
                };
                const htmlType = htmlTypeMap[type] || type;
                
                // Find the sell input
                const inputId = `sell-${htmlType}-${htmlTag}`;
                console.log(`Looking for sell input: ${inputId} (our type: ${type}, HTML type: ${htmlType}, htmlTag: ${htmlTag})`);
                
                let sellInput = document.getElementById(inputId);
                if (!sellInput) {
                    // Try alternative selector in case ID format is different
                    sellInput = document.querySelector(`input[name*="sell-${htmlType}"][id*="${htmlTag}"]`);
                }
                if (!sellInput) {
                    // List all sell inputs to help debug
                    const allSellInputs = document.querySelectorAll('input[id^="sell-"]');
                    console.warn(`❌ Sell input not found: ${inputId}`);
                    console.log('Available sell inputs:', Array.from(allSellInputs).map(inp => inp.id));
                    return;
                }
                
                sellInput.value = quantity;
                // Trigger input event
                sellInput.dispatchEvent(new Event('input', { bubbles: true }));
                sellInput.dispatchEvent(new Event('change', { bubbles: true }));
                filledCount++;
                console.log(`✅ Prefilled sell input: ${inputId} = ${quantity}`);
            });
            
            if (filledCount > 0) {
                showNotification(`Prefilled ${filledCount} weapon types for selling`);
                return true;
            }
        } catch (e) {
            console.error('Error parsing sell parameters:', e);
        }
        
        return false;
    }

    function init() {
        // Wait for DOM to be ready before creating dashboard
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Create Settings Dashboard on all pages
                createSettingsDashboard();
                initializePageFeatures();
            });
        } else {
            // DOM is already ready
            createSettingsDashboard();
            initializePageFeatures();
        }
    }
    
    function initializePageFeatures() {
        // Initialize on armory page
        if (window.location.pathname.includes('armory.php')) {
            // Check if we have sell parameters in URL (disable autofill if so)
            const urlParams = new URLSearchParams(window.location.search);
            const hasSellParam = urlParams.has('sell');
            
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    // Scrape inventory with retries (mobile may need more time)
                    setTimeout(() => {
                        scrapeInventoryWithRetry(3, 500);
                        // Prefill sell amounts after a delay to ensure inputs exist
                        if (hasSellParam) {
                            setTimeout(() => prefillSellFromURL(), 300);
                            setTimeout(() => prefillSellFromURL(), 800);
                            setTimeout(() => prefillSellFromURL(), 1500);
                        }
                        // Only auto-run autofill if not selling and feature is enabled
                        if (!hasSellParam && isFeatureEnabled('armoryAutofill')) {
                            performAutofill(true); // Silent mode for auto-run
                        }
                    }, 500);
                });
            } else {
                // Scrape inventory with retries (mobile may need more time)
                setTimeout(() => {
                    scrapeInventoryWithRetry(3, 500);
                    // Prefill sell amounts after a delay to ensure inputs exist
                    if (hasSellParam) {
                        setTimeout(() => prefillSellFromURL(), 300);
                        setTimeout(() => prefillSellFromURL(), 800);
                        setTimeout(() => prefillSellFromURL(), 1500);
                    }
                    // Only auto-run autofill if not selling and feature is enabled
                    if (!hasSellParam && isFeatureEnabled('armoryAutofill')) {
                        performAutofill(true); // Silent mode for auto-run
                    }
                }, 500);
            }
        }
        
        // Initialize on upgrades page
        if (window.location.pathname.includes('upgrades.php')) {
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        scrapeUpgradeLevels();
                        if (isFeatureEnabled('upgradeCalculator')) {
                            createUpgradeCalculatorOverlay();
                        }
                    }, 500);
                });
            } else {
                setTimeout(() => {
                    scrapeUpgradeLevels();
                    if (isFeatureEnabled('upgradeCalculator')) {
                        createUpgradeCalculatorOverlay();
                    }
                }, 500);
            }
        }
    }

    // ============================================================================
    // INCOME/UP SNAPSHOT
    // ============================================================================
    
    const SNAPSHOT_DATA_KEY = 'incomeUpSnapshotData';
    
    /**
     * Parse battlefield data from current page
     * Returns: { username: { gold: number, armySize: number }, ... }
     */
    function parseBattlefieldData() {
        const data = {};
        const rows = document.querySelectorAll('tr.r1, tr.r2');
        
        rows.forEach(row => {
            // Find username link
            const usernameLink = row.querySelector('a.link-battle');
            if (!usernameLink) return;
            
            const username = usernameLink.textContent.trim();
            
            // Find gold (in span.gold)
            const goldSpan = row.querySelector('span.gold');
            let gold = 0;
            if (goldSpan) {
                const goldText = goldSpan.textContent.replace(/[^0-9]/g, '');
                gold = parseInt(goldText, 10) || 0;
            }
            
            // Find army size (6th td, data-sort attribute or text content)
            const tds = row.querySelectorAll('td');
            let armySize = 0;
            if (tds.length >= 6) {
                const armyTd = tds[5]; // 0-indexed, 6th column
                const sortValue = armyTd.getAttribute('data-sort');
                if (sortValue) {
                    armySize = parseInt(sortValue, 10) || 0;
                } else {
                    const armyText = armyTd.textContent.replace(/[^0-9]/g, '');
                    armySize = parseInt(armyText, 10) || 0;
                }
            }
            
            if (username && (gold > 0 || armySize > 0)) {
                data[username] = { gold, armySize };
            }
        });
        
        return data;
    }
    
    /**
     * Parse timer from page (format: "0:29" or "1:05")
     * Returns seconds until next turn
     */
    function parseTimer() {
        const timeElement = document.querySelector('span.data-time');
        if (!timeElement) return null;
        
        const timeText = timeElement.textContent.trim();
        const parts = timeText.split(':');
        if (parts.length !== 2) return null;
        
        const minutes = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;
        
        return minutes * 60 + seconds;
    }
    
    /**
     * Show "Capturing Snapshot" overlay
     */
    function showSnapshotOverlay(message) {
        let overlay = document.getElementById('mwh-snapshot-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'mwh-snapshot-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
            `;
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div style="background: #333; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                <div style="font-size: 28px; margin-bottom: 15px;">📸 Capturing Snapshot</div>
                <div style="font-size: 18px; color: #ccc;">${message}</div>
                <div style="font-size: 14px; color: #999; margin-top: 10px;">Please do not navigate away from this page</div>
            </div>
        `;
        overlay.style.display = 'flex';
    }
    
    /**
     * Hide snapshot overlay
     */
    function hideSnapshotOverlay() {
        const overlay = document.getElementById('mwh-snapshot-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    /**
     * Start the Income/UP Snapshot process
     */
    function startIncomeUpSnapshot() {
        // Navigate to battlefield page
        const baseUrl = window.location.origin.includes('www.') 
            ? 'https://www.monsterswrath.com' 
            : 'https://monsterswrath.com';
        const battlefieldUrl = `${baseUrl}/delta2/battlefield2.php?page=1`;
        
        if (window.location.href !== battlefieldUrl) {
            window.location.href = battlefieldUrl;
            // Store flag to start snapshot when page loads
            GM_setValue('mwh_snapshot_pending', true);
            return;
        }
        
        // We're already on battlefield page, start the process
        runSnapshotProcess();
    }
    
    /**
     * Run the snapshot process
     */
    function runSnapshotProcess() {
        showSnapshotOverlay('Capturing first turn data...');
        
        // Parse current battlefield data
        const firstTurnData = parseBattlefieldData();
        console.log('First turn data:', firstTurnData);
        
        if (Object.keys(firstTurnData).length === 0) {
            hideSnapshotOverlay();
            alert('Could not parse battlefield data. Please make sure you are on the battlefield page.');
            return;
        }
        
        // Store first turn data
        GM_setValue('mwh_snapshot_first_turn', firstTurnData);
        
        // Get timer
        const secondsUntilTurn = parseTimer();
        if (secondsUntilTurn === null) {
            hideSnapshotOverlay();
            alert('Could not find timer. Please refresh the page and try again.');
            return;
        }
        
        console.log(`Waiting ${secondsUntilTurn} seconds until next turn...`);
        showSnapshotOverlay(`Waiting for next turn... (${Math.floor(secondsUntilTurn / 60)}:${String(secondsUntilTurn % 60).padStart(2, '0')})`);
        
        // Update countdown
        let remainingSeconds = secondsUntilTurn;
        const countdownInterval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                // Refresh page to get new turn data
                showSnapshotOverlay('Refreshing for second turn data...');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                const mins = Math.floor(remainingSeconds / 60);
                const secs = remainingSeconds % 60;
                showSnapshotOverlay(`Waiting for next turn... (${mins}:${String(secs).padStart(2, '0')})`);
            }
        }, 1000);
        
        // Set flag to process second turn when page reloads
        GM_setValue('mwh_snapshot_processing', true);
    }
    
    /**
     * Process second turn and calculate differences
     */
    function processSecondTurn() {
        const firstTurnData = GM_getValue('mwh_snapshot_first_turn', null);
        if (!firstTurnData) {
            hideSnapshotOverlay();
            return;
        }
        
        const secondTurnData = parseBattlefieldData();
        console.log('Second turn data:', secondTurnData);
        
        if (Object.keys(secondTurnData).length === 0) {
            hideSnapshotOverlay();
            alert('Could not parse second turn data.');
            GM_deleteValue('mwh_snapshot_first_turn');
            GM_deleteValue('mwh_snapshot_processing');
            return;
        }
        
        // Calculate differences
        const snapshotData = {};
        const allUsernames = new Set([...Object.keys(firstTurnData), ...Object.keys(secondTurnData)]);
        
        allUsernames.forEach(username => {
            const first = firstTurnData[username] || { gold: 0, armySize: 0 };
            const second = secondTurnData[username] || { gold: 0, armySize: 0 };
            
            const income = second.gold - first.gold;
            const unitProduction = second.armySize - first.armySize;
            
            if (income !== 0 || unitProduction !== 0) {
                snapshotData[username] = {
                    income: income,
                    unitProduction: unitProduction
                };
            }
        });
        
        console.log('Snapshot data calculated:', snapshotData);
        
        // Store snapshot data
        GM_setValue(SNAPSHOT_DATA_KEY, snapshotData);
        
        // Clear processing flags
        GM_deleteValue('mwh_snapshot_first_turn');
        GM_deleteValue('mwh_snapshot_processing');
        GM_deleteValue('mwh_snapshot_pending');
        
        hideSnapshotOverlay();
        
        // Navigate to Top Stats page
        const baseUrl = window.location.origin.includes('www.') 
            ? 'https://www.monsterswrath.com' 
            : 'https://monsterswrath.com';
        window.location.href = `${baseUrl}/delta2/toplist.php`;
    }
    
    /**
     * Display snapshot overlays on Top Stats page
     */
    function displaySnapshotOverlays() {
        const prefs = getSnapshotDisplayPreferences();
        if (!prefs.showOnTopStats) return;
        
        const snapshotData = GM_getValue(SNAPSHOT_DATA_KEY, {});
        if (Object.keys(snapshotData).length === 0) return;
        
        // Find all table sections (Top Income and Top Unit Production)
        const tables = document.querySelectorAll('tbody');
        
        tables.forEach(tbody => {
            // Check if this is a Top Income or Top Unit Production section
            const header = tbody.querySelector('th');
            if (!header) return;
            
            const headerText = header.textContent.trim();
            const isIncomeSection = headerText.includes('Top Income');
            const isUPSection = headerText.includes('Top Unit Production');
            
            if (!isIncomeSection && !isUPSection) return;
            
            // Find all rows in this section
            const rows = tbody.querySelectorAll('tr.r1, tr.r2');
            
            rows.forEach(row => {
                // Find username link
                const usernameLink = row.querySelector('a.link-battle');
                if (!usernameLink) return;
                
                const username = usernameLink.textContent.trim();
                if (!snapshotData[username]) return;
                
                const data = snapshotData[username];
                
                // Find the cell containing the username link
                const usernameCell = usernameLink.closest('td');
                if (!usernameCell) return;
                
                // Create overlay element
                const overlay = document.createElement('span');
                overlay.className = 'mwh-snapshot-overlay';
                overlay.style.cssText = `
                    display: inline-block;
                    margin-left: 10px;
                    padding: 4px 8px;
                    background: #9C27B0;
                    color: white;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    vertical-align: middle;
                `;
                
                // Show appropriate data based on section
                if (isIncomeSection && data.income !== 0) {
                    overlay.textContent = formatNumber(data.income);
                    usernameCell.appendChild(overlay);
                } else if (isUPSection && data.unitProduction !== 0) {
                    overlay.textContent = formatNumber(data.unitProduction);
                    usernameCell.appendChild(overlay);
                }
            });
        });
    }
    
    /**
     * Display snapshot data on battlefield page (inline with player names)
     */
    function displaySnapshotOnBattlefield() {
        const prefs = getSnapshotDisplayPreferences();
        if (!prefs.showOnBattlefield) return;
        
        const snapshotData = GM_getValue(SNAPSHOT_DATA_KEY, {});
        if (Object.keys(snapshotData).length === 0) return;
        
        // Find all player rows on battlefield
        const rows = document.querySelectorAll('tr.r1, tr.r2');
        
        rows.forEach(row => {
            // Find username link
            const usernameLink = row.querySelector('a.link-battle');
            if (!usernameLink) return;
            
            const username = usernameLink.textContent.trim();
            if (!snapshotData[username]) return;
            
            const data = snapshotData[username];
            
            // Find army size cell (td with data-sort attribute containing a number, typically the 6th column)
            // Army size is typically a large number (millions+), while Rank is small (1-1000)
            const allCells = row.querySelectorAll('td');
            let armySizeCell = null;
            
            // Try the 6th column first (index 5) - this is where army size should be
            if (allCells.length >= 6) {
                const candidateCell = allCells[5];
                const sortValue = candidateCell.getAttribute('data-sort');
                const cellText = candidateCell.textContent.trim();
                // Check if it has a numeric data-sort and contains a number (army size is typically large)
                if (sortValue && /^\d+$/.test(sortValue.trim()) && cellText && /[\d,]+/.test(cellText)) {
                    const sortNum = parseInt(sortValue, 10);
                    // Army size is typically > 1000, while rank is usually < 1000
                    if (sortNum > 1000) {
                        armySizeCell = candidateCell;
                    }
                } else if (cellText && /[\d,]+/.test(cellText)) {
                    // Fallback: if no data-sort but has number, check if it's a large number
                    const cellNum = parseNumber(cellText);
                    if (cellNum > 1000) {
                        armySizeCell = candidateCell;
                    }
                }
            }
            
            // If still not found, look for any cell with a large numeric data-sort
            if (!armySizeCell) {
                for (const cell of allCells) {
                    const sortValue = cell.getAttribute('data-sort');
                    if (sortValue && /^\d+$/.test(sortValue.trim())) {
                        const sortNum = parseInt(sortValue, 10);
                        // Army size is typically > 1000
                        if (sortNum > 1000) {
                            const cellText = cell.textContent.trim();
                            if (cellText && /[\d,]+/.test(cellText)) {
                                armySizeCell = cell;
                                break;
                            }
                        }
                    }
                }
            }
            
            // Find gold span
            const goldSpan = row.querySelector('span.gold');
            
            // Remove existing snapshot displays
            const existingUnitProd = row.querySelector('.mwh-snapshot-unit-production');
            if (existingUnitProd) existingUnitProd.remove();
            const existingIncome = row.querySelector('.mwh-snapshot-income');
            if (existingIncome) existingIncome.remove();
            
            // Add unit production near army size
            if (data.unitProduction !== undefined && data.unitProduction !== 0 && armySizeCell) {
                const unitProdSpan = document.createElement('span');
                unitProdSpan.className = 'mwh-snapshot-unit-production';
                unitProdSpan.style.cssText = `
                    display: inline-block;
                    margin-left: 8px;
                    color: #2196F3;
                    font-size: 11px;
                    font-weight: bold;
                `;
                unitProdSpan.textContent = `+${formatNumber(data.unitProduction)}`;
                unitProdSpan.title = 'Unit Production per turn';
                armySizeCell.appendChild(unitProdSpan);
            }
            
            // Add income near gold (with hourly display)
            if (data.income !== undefined && data.income !== 0 && goldSpan) {
                const incomeContainer = document.createElement('div');
                incomeContainer.className = 'mwh-snapshot-income';
                incomeContainer.style.cssText = `
                    margin-top: 2px;
                    font-size: 10px;
                    line-height: 1.3;
                `;
                
                // Per turn income
                const incomeSpan = document.createElement('span');
                incomeSpan.style.cssText = `
                    display: block;
                    color: #4CAF50;
                    font-weight: bold;
                `;
                incomeSpan.textContent = `+${formatNumber(data.income)}/turn`;
                incomeSpan.title = 'Income per turn';
                incomeContainer.appendChild(incomeSpan);
                
                // Hourly income (60x per turn income)
                const hourlyIncome = data.income * 60;
                const hourlySpan = document.createElement('span');
                hourlySpan.style.cssText = `
                    display: block;
                    color: #66BB6A;
                    font-size: 9px;
                `;
                hourlySpan.textContent = `Hourly: ${formatNumber(hourlyIncome)}`;
                hourlySpan.title = 'Estimated hourly income (60x per turn)';
                incomeContainer.appendChild(hourlySpan);
                
                // Find the parent of gold span and append after it
                const goldParent = goldSpan.parentElement;
                if (goldParent) {
                    goldParent.appendChild(incomeContainer);
                }
            }
        });
    }

    // ============================================================================
    // PLAYER INTELLIGENCE SYSTEM
    // ============================================================================
    
    const PLAYER_INTEL_KEY = 'playerIntelligence';
    
    /**
     * Get all player intelligence data
     * Returns: { [statsId]: playerData, ... }
     */
    function getPlayerIntelligence() {
        return GM_getValue(PLAYER_INTEL_KEY, {});
    }
    
    /**
     * Save player intelligence data
     */
    function savePlayerIntelligence(intel) {
        GM_setValue(PLAYER_INTEL_KEY, intel);
    }
    
    /**
     * Get a specific player's intelligence data
     */
    function getPlayerData(statsId) {
        const intel = getPlayerIntelligence();
        return intel[statsId] || null;
    }
    
    /**
     * Update a player's intelligence data
     * Smart merge: keeps old values if new value is "???"
     */
    function updatePlayerData(statsId, newData) {
        const intel = getPlayerIntelligence();
        const existing = intel[statsId] || {};
        
        // Merge data, keeping old values if new is "???"
        const merged = { ...existing };
        
        // Update basic info (always overwrite)
        if (newData.username) merged.username = newData.username;
        if (newData.statsId) merged.statsId = newData.statsId;
        if (newData.statsUrl) merged.statsUrl = newData.statsUrl;
        
        // Update military stats
        if (newData.militaryStats) {
            merged.militaryStats = merged.militaryStats || {};
            Object.keys(newData.militaryStats).forEach(key => {
                const newValue = newData.militaryStats[key];
                const oldValue = merged.militaryStats[key];
                // Only update if new value is valid (not "???" or null/undefined)
                // If new value is "???", explicitly preserve the old value
                if (newValue !== '???' && newValue !== null && newValue !== undefined) {
                    merged.militaryStats[key] = newValue;
                } else if (oldValue !== undefined && oldValue !== null && oldValue !== '???') {
                    // Explicitly preserve old value when new value is "???"
                    merged.militaryStats[key] = oldValue;
                }
                // If both old and new are invalid, leave as is (undefined or "???")
            });
        }
        
        // Update general stats
        if (newData.generalStats) {
            merged.generalStats = merged.generalStats || {};
            Object.keys(newData.generalStats).forEach(key => {
                const newValue = newData.generalStats[key];
                const oldValue = merged.generalStats[key];
                // Only update if new value is valid (not "???" or null/undefined)
                // If new value is "???", explicitly preserve the old value
                if (newValue !== '???' && newValue !== null && newValue !== undefined) {
                    merged.generalStats[key] = newValue;
                } else if (oldValue !== undefined && oldValue !== null && oldValue !== '???') {
                    // Explicitly preserve old value when new value is "???"
                    merged.generalStats[key] = oldValue;
                }
                // If both old and new are invalid, leave as is (undefined or "???")
            });
        }
        
        // Update army stats
        if (newData.armyStats) {
            merged.armyStats = merged.armyStats || {};
            Object.keys(newData.armyStats).forEach(key => {
                const newValue = newData.armyStats[key];
                const oldValue = merged.armyStats[key];
                // Only update if new value is valid (not "???" or null/undefined)
                // If new value is "???", explicitly preserve the old value
                if (newValue !== '???' && newValue !== null && newValue !== undefined) {
                    merged.armyStats[key] = newValue;
                } else if (oldValue !== undefined && oldValue !== null && oldValue !== '???') {
                    // Explicitly preserve old value when new value is "???"
                    merged.armyStats[key] = oldValue;
                }
                // If both old and new are invalid, leave as is (undefined or "???")
            });
        }
        
        // Update armory inventory (always overwrite with new data)
        if (newData.armory) {
            merged.armory = newData.armory;
        }
        
        // Update own rankings and next values (for own player data from Command Center)
        if (newData.ownRankings) {
            merged.ownRankings = newData.ownRankings;
        }
        if (newData.ownNextValues) {
            merged.ownNextValues = newData.ownNextValues;
        }
        
        // Update mana production (for own player data from Command Center)
        if (newData.manaProduction !== null && newData.manaProduction !== undefined) {
            merged.manaProduction = newData.manaProduction;
        }
        
        // Update gold invested (for own player data)
        if (newData.goldInvested) {
            merged.goldInvested = newData.goldInvested;
        }
        
        // Update timestamp
        merged.lastUpdated = Date.now();
        
        intel[statsId] = merged;
        savePlayerIntelligence(intel);
        
        return merged;
    }
    
    /**
     * Parse battlefield page to extract player list
     * Returns: { [statsId]: { username, statsId, statsUrl }, ... }
     */
    function parseBattlefieldPlayers() {
        const players = {};
        const rows = document.querySelectorAll('tr.r1, tr.r2');
        
        rows.forEach(row => {
            // Check if this is a farm account (has "FARM" div)
            const farmDiv = row.querySelector('div.acc-type.fade');
            if (farmDiv && farmDiv.textContent.trim() === 'FARM') {
                return; // Skip farm accounts
            }
            
            // Find username link
            const usernameLink = row.querySelector('a.link-battle');
            if (!usernameLink) return;
            
            const username = usernameLink.textContent.trim();
            const href = usernameLink.getAttribute('href');
            
            // Extract stats ID from href (e.g., "stats.php?id=192")
            const idMatch = href.match(/id=(\d+)/);
            if (!idMatch) return;
            
            const statsId = idMatch[1];
            const baseUrl = window.location.origin.includes('www.') 
                ? 'https://www.monsterswrath.com' 
                : 'https://monsterswrath.com';
            const statsUrl = `${baseUrl}/delta2/${href}`;
            
            players[statsId] = {
                username: username,
                statsId: statsId,
                statsUrl: statsUrl
            };
        });
        
        return players;
    }
    
    /**
     * Parse spy results page (spylog.php) to extract all player intelligence data
     * Returns: player data object
     */
    function parseSpyPage() {
        // Extract player name from mission report header
        const missionHeader = document.querySelector('div.bm20');
        if (!missionHeader) {
            console.warn('Could not find mission report header');
            return null;
        }
        
        const playerNameSpan = missionHeader.querySelector('span.race');
        if (!playerNameSpan) {
            console.warn('Could not find player name in mission report');
            return null;
        }
        
        const username = playerNameSpan.textContent.trim();
        if (!username) {
            console.warn('Player name is empty');
            return null;
        }
        
        // Find the player's statsId from our intelligence data by matching username
        const intel = getPlayerIntelligence();
        let statsId = null;
        Object.keys(intel).forEach(id => {
            if (intel[id].username === username) {
                statsId = id;
            }
        });
        
        // If not found, we'll need to create a new entry - but we need the statsId
        // For now, we'll use a placeholder and update it when we get more info
        if (!statsId) {
            // Try to extract from any links on the page
            const statsLink = document.querySelector('a[href*="stats.php?id="]');
            if (statsLink) {
                const href = statsLink.getAttribute('href');
                const idMatch = href.match(/id=(\d+)/);
                if (idMatch) {
                    statsId = idMatch[1];
                }
            }
            
            // If still no statsId, create a temporary one based on username
            if (!statsId) {
                statsId = `temp_${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            }
        }
        
        const data = {
            statsId: statsId,
            username: username,
            lastUpdated: Date.now()
        };
        
        // Parse Military Stats
        const militaryStats = {};
        const militaryTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('Military Stats');
        });
        
        if (militaryTable) {
            const rows = militaryTable.querySelectorAll('tr.r1, tr.r2');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const label = cells[0].textContent.trim();
                    const value = cells[1].textContent.trim();
                    
                    // Map labels to keys
                    const keyMap = {
                        'Attack Force': 'attack',
                        'Defense Force': 'defense',
                        'Stealth Force': 'stealth',
                        'Security Force': 'security',
                        'Supernatural Power': 'supernatural'
                    };
                    
                    const key = keyMap[label];
                    if (key) {
                        if (value === '???') {
                            militaryStats[key] = '???';
                        } else {
                            militaryStats[key] = parseNumber(value);
                        }
                    }
                }
            });
        }
        data.militaryStats = militaryStats;
        
        // Parse General Stats
        const generalStats = {};
        const generalTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('General Stats');
        });
        
        if (generalTable) {
            const rows = generalTable.querySelectorAll('tr.r1, tr.r2');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const label = cells[0].textContent.trim();
                    let value = cells[1].textContent.trim();
                    
                    // Map labels to keys
                    const keyMap = {
                        'Skirmish Level': 'skirmish',
                        'Resistance Level': 'resistance',
                        'Sleeper Level': 'sleeper',
                        'Surveillance Level': 'surveillance',
                        'Economy Level': 'economy',
                        'Unit Production': 'unitProduction',
                        'Attack Turns': 'attackTurns',
                        'Mana': 'mana',
                        'Banked Gold': 'bankedGold'
                    };
                    
                    const key = keyMap[label];
                    if (key) {
                        if (value === '???') {
                            generalStats[key] = '???';
                        } else {
                            // Try to parse as number
                            const numValue = parseNumber(value);
                            generalStats[key] = isNaN(numValue) ? value : numValue;
                        }
                    }
                }
            });
        }
        data.generalStats = generalStats;
        
        // Parse Army Stats
        const armyStats = {};
        const armyTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('Army Stats');
        });
        
        if (armyTable) {
            const rows = armyTable.querySelectorAll('tr.r1, tr.r2, tr.legendary');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const label = cells[0].textContent.trim();
                    let value = cells[1].textContent.trim();
                    
                    // Skip "Total Fighting Force" for now (we can calculate it)
                    if (label === 'Total Fighting Force') return;
                    
                    // Map labels to keys (camelCase)
                    const keyMap = {
                        'Untrained': 'untrained',
                        'Soldiers': 'soldiers',
                        'Warriors': 'warriors',
                        'Fortifiers': 'fortifiers',
                        'Stealth Ops': 'stealthOps',
                        'Security Guards': 'securityGuards',
                        'Farmers': 'farmers',
                        'Untrained Mercenaries': 'untrainedMercenaries',
                        'Attack Mercenaries': 'attackMercenaries',
                        'Defense Mercenaries': 'defenseMercenaries',
                        'Gladiators': 'gladiators',
                        'Warlords': 'warlords',
                        'Assassins': 'assassins'
                    };
                    
                    const key = keyMap[label];
                    if (key) {
                        if (value === '???') {
                            armyStats[key] = '???';
                        } else {
                            armyStats[key] = parseNumber(value);
                        }
                    }
                }
            });
        }
        data.armyStats = armyStats;
        
        // Parse Armory Inventory
        const armory = [];
        const inventoryTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('Inventory');
        });
        
        if (inventoryTable) {
            const rows = inventoryTable.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 4) {
                    const type = cells[0].querySelector('span.fade')?.textContent.trim() || cells[0].textContent.trim();
                    const name = cells[1].textContent.trim();
                    const strength = parseNumber(cells[2].textContent.trim());
                    const quantity = parseNumber(cells[3].textContent.trim());
                    
                    if (name && !isNaN(strength) && !isNaN(quantity)) {
                        armory.push({
                            type: type.toLowerCase(),
                            name: name,
                            strength: strength,
                            quantity: quantity
                        });
                    }
                }
            });
        }
        data.armory = armory;
        
        return data;
    }
    
    /**
     * Update player list from battlefield page
     */
    function updatePlayerList() {
        const players = parseBattlefieldPlayers();
        const intel = getPlayerIntelligence();
        
        // Update existing players or add new ones
        Object.keys(players).forEach(statsId => {
            const playerInfo = players[statsId];
            if (!intel[statsId]) {
                // New player, add basic info
                intel[statsId] = {
                    ...playerInfo,
                    lastUpdated: Date.now()
                };
            } else {
                // Existing player, update basic info if changed
                intel[statsId].username = playerInfo.username;
                intel[statsId].statsUrl = playerInfo.statsUrl;
            }
        });
        
        savePlayerIntelligence(intel);
        return Object.keys(players).length;
    }
    
    /**
     * Process spy page data and update player intelligence
     */
    function processSpyPage() {
        const spyData = parseSpyPage();
        if (!spyData) {
            console.error('Could not parse spy page data');
            return false;
        }
        
        updatePlayerData(spyData.statsId, spyData);
        console.log('Parsed spy data:', spyData);
        
        // Show clickable notification
        const notification = showNotification(`Intelligence updated for ${spyData.username}`);
        if (notification) {
            notification.style.cursor = 'pointer';
            notification.title = 'Click to view Intelligence Dashboard';
            notification.addEventListener('click', (e) => {
                e.stopPropagation();
                showIntelligenceDisplay();
            });
        }
        return true;
    }
    
    /**
     * Parse Command Center page to get player's own stats and rankings
     * Returns: { username: string, militaryStats: {...}, rankings: {...}, nextValues: {...}, upgrades: {...}, manaProduction: number }
     */
    function parseCommandCenter() {
        const data = {
            username: null,
            militaryStats: {},
            rankings: {},
            nextValues: {},
            upgrades: {},
            manaProduction: null
        };
        
        // Find username
        const usernameRow = Array.from(document.querySelectorAll('tr')).find(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length >= 2) {
                return cells[0].textContent.trim() === 'Username:';
            }
            return false;
        });
        
        if (usernameRow) {
            const usernameSpan = usernameRow.querySelector('span.username-fancy');
            if (usernameSpan) {
                data.username = usernameSpan.textContent.trim();
            }
        }
        
        // Find Military Stats table
        const militaryTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('Military Stats');
        });
        
        if (!militaryTable) {
            console.warn('Could not find Military Stats table');
            return data;
        }
        
        // Get all rows, excluding header rows (hd, sb)
        const rows = Array.from(militaryTable.querySelectorAll('tr')).filter(row => {
            return row.classList.contains('r1') || row.classList.contains('r2');
        });
        
        console.log(`Found ${rows.length} military stat rows`);
        
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const label = cells[0].textContent.trim();
                const powerSpan = cells[1].querySelector('span[id$="-power"]');
                const nextDiv = cells[2].querySelector('div.fade');
                const rankCell = cells[3];
                
                if (!powerSpan) {
                    console.warn(`Row ${index}: No power span found. Label: "${label}"`);
                    return;
                }
                if (!rankCell) {
                    console.warn(`Row ${index}: No rank cell found. Label: "${label}"`);
                    return;
                }
                
                const powerText = powerSpan.textContent.trim();
                const power = parseNumber(powerText);
                const nextValue = nextDiv ? parseNumber(nextDiv.textContent.trim()) : null;
                const rankText = rankCell.textContent.trim();
                const rankMatch = rankText.match(/#(\d+)/);
                const rank = rankMatch ? parseInt(rankMatch[1], 10) : null;
                
                // Map labels to keys (more flexible matching)
                let key = null;
                if (label.includes('Attack Force')) {
                    key = 'attack';
                } else if (label.includes('Defense Force')) {
                    key = 'defense';
                } else if (label.includes('Stealth Force')) {
                    key = 'stealth';
                } else if (label.includes('Security Force')) {
                    key = 'security';
                } else if (label.includes('Supernatural Power')) {
                    key = 'supernatural';
                }
                
                if (key) {
                    data.militaryStats[key] = power;
                    if (rank !== null) {
                        data.rankings[key] = rank;
                    }
                    if (nextValue !== null && nextValue > 0) {
                        data.nextValues[key] = nextValue;
                    }
                    console.log(`Parsed ${key}: power=${power}, rank=${rank}, next=${nextValue}`);
                } else {
                    console.warn(`Row ${index}: Unknown label "${label}"`);
                }
            } else {
                console.warn(`Row ${index}: Expected 4 cells, found ${cells.length}`);
            }
        });
        
        // Find Upgrades table
        const upgradesTable = Array.from(document.querySelectorAll('tbody')).find(tbody => {
            const header = tbody.querySelector('th');
            return header && header.textContent.includes('Upgrades');
        });
        
        if (upgradesTable) {
            // Get all rows, excluding header rows (hd, sb)
            const upgradeRows = Array.from(upgradesTable.querySelectorAll('tr')).filter(row => {
                return row.classList.contains('r1') || row.classList.contains('r2');
            });
            
            console.log(`Found ${upgradeRows.length} upgrade rows`);
            
            upgradeRows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const upgradeName = cells[0].textContent.trim();
                    const levelCell = cells[1];
                    const levelText = levelCell.textContent.trim();
                    
                    // Extract level from format like "Rapid Fire (21/25)" or "Berserker (22/26)"
                    const levelMatch = levelText.match(/\((\d+)\/\d+\)/);
                    const level = levelMatch ? parseInt(levelMatch[1], 10) : null;
                    
                    // Extract level name (text before the parentheses)
                    const nameMatch = levelText.match(/^(.+?)\s*\(/);
                    const levelName = nameMatch ? nameMatch[1].trim() : levelText.split('(')[0].trim();
                    
                    // Map upgrade names to keys
                    let upgradeKey = null;
                    if (upgradeName.includes('Skirmish Level')) {
                        upgradeKey = 'skirmish';
                    } else if (upgradeName.includes('Resistance Level')) {
                        upgradeKey = 'resistance';
                    } else if (upgradeName.includes('Sleeper Level')) {
                        upgradeKey = 'sleeper';
                    } else if (upgradeName.includes('Surveillance Level')) {
                        upgradeKey = 'surveillance';
                    } else if (upgradeName.includes('Economy')) {
                        upgradeKey = 'technology';
                    }
                    // Skip Unit Production, Mana Production, Income Deposit
                    
                    if (upgradeKey && level !== null) {
                        data.upgrades[upgradeKey] = {
                            level: level,
                            name: levelName
                        };
                        console.log(`Parsed upgrade ${upgradeKey}: level=${level}, name="${levelName}"`);
                    }
                }
            });
        } else {
            console.warn('Could not find Upgrades table');
        }
        
        // Find Mana Production
        const manaRow = Array.from(document.querySelectorAll('tr')).find(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length >= 2) {
                const firstCellText = cells[0].textContent.trim();
                return firstCellText === 'Mana Production';
            }
            return false;
        });
        
        if (manaRow) {
            const manaCell = manaRow.querySelectorAll('td')[1];
            if (manaCell) {
                const manaText = manaCell.textContent.trim();
                // Extract the number (e.g., "1770" from "1770        2,548,800 per day")
                const manaMatch = manaText.match(/^(\d+)/);
                if (manaMatch) {
                    data.manaProduction = parseInt(manaMatch[1], 10);
                } else {
                    console.warn('Could not extract mana production number from:', manaText);
                }
            }
        } else {
            console.warn('Could not find Mana Production row');
        }
        
        console.log('Parsed Command Center data:', data);
        return data;
    }
    
    /**
     * Parse and display key revenue stats overlay on Command Center
     */
    function displayCommandCenterStatsOverlay() {
        // Check if feature is enabled
        if (!isFeatureEnabled('commandCenterStats')) {
            // Remove overlay if it exists and feature is disabled
            const existingOverlay = document.getElementById('mwh-command-center-stats');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            return;
        }
        
        // Find Total Gold Revenue
        let totalGoldRevenue = null;
        const allRows = Array.from(document.querySelectorAll('tr'));
        for (const row of allRows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const firstCellText = cells[0].textContent.trim();
                if (firstCellText.includes('Total Gold Revenue')) {
                    const valueCell = cells[1];
                    if (valueCell) {
                        const valueText = valueCell.textContent.trim();
                        totalGoldRevenue = parseNumber(valueText);
                        break;
                    }
                }
            }
        }
        
        // Find Total Unit Revenue
        let totalUnitRevenue = null;
        for (const row of allRows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const firstCellText = cells[0].textContent.trim();
                if (firstCellText.includes('Total Unit Revenue')) {
                    const valueCell = cells[1];
                    if (valueCell) {
                        const valueText = valueCell.textContent.trim();
                        totalUnitRevenue = parseNumber(valueText);
                        break;
                    }
                }
            }
        }
        
        // Find Mana Produced
        let manaProduced = null;
        for (const row of allRows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const firstCellText = cells[0].textContent.trim();
                // Check if it contains "Mana Produced" (might have tooltip div)
                if (firstCellText.includes('Mana Produced')) {
                    const valueCell = cells[1];
                    if (valueCell) {
                        const valueText = valueCell.textContent.trim();
                        manaProduced = parseNumber(valueText);
                        break;
                    }
                }
            }
        }
        
        // Remove existing overlay if present
        const existingOverlay = document.getElementById('mwh-command-center-stats');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Only create overlay if we have at least one value
        if (totalGoldRevenue === null && totalUnitRevenue === null && manaProduced === null) {
            return;
        }
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'mwh-command-center-stats';
        overlay.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
            font-size: 13px;
            z-index: 10000;
            min-width: 250px;
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        // Create title
        const title = document.createElement('div');
        title.textContent = '📊 Key Stats';
        title.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        `;
        overlay.appendChild(title);
        
        // Create stats container
        const statsContainer = document.createElement('div');
        statsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        
        // Add Total Gold Revenue
        if (totalGoldRevenue !== null) {
            const goldStat = document.createElement('div');
            goldStat.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            const goldLabel = document.createElement('span');
            goldLabel.textContent = '💰 Total Gold Revenue:';
            goldLabel.style.cssText = 'font-weight: 500;';
            const goldValue = document.createElement('span');
            goldValue.textContent = formatNumber(totalGoldRevenue);
            goldValue.style.cssText = 'font-weight: bold; color: #FFD700;';
            goldStat.appendChild(goldLabel);
            goldStat.appendChild(goldValue);
            statsContainer.appendChild(goldStat);
        }
        
        // Add Total Unit Revenue
        if (totalUnitRevenue !== null) {
            const unitStat = document.createElement('div');
            unitStat.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            const unitLabel = document.createElement('span');
            unitLabel.textContent = '⚔️ Total Unit Revenue:';
            unitLabel.style.cssText = 'font-weight: 500;';
            const unitValue = document.createElement('span');
            unitValue.textContent = formatNumber(totalUnitRevenue);
            unitValue.style.cssText = 'font-weight: bold; color: #4CAF50;';
            unitStat.appendChild(unitLabel);
            unitStat.appendChild(unitValue);
            statsContainer.appendChild(unitStat);
        }
        
        // Add Mana Produced
        if (manaProduced !== null) {
            const manaStat = document.createElement('div');
            manaStat.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            const manaLabel = document.createElement('span');
            manaLabel.textContent = '🔮 Mana Produced:';
            manaLabel.style.cssText = 'font-weight: 500;';
            const manaValue = document.createElement('span');
            manaValue.textContent = formatNumber(manaProduced);
            manaValue.style.cssText = 'font-weight: bold; color: #FFD700;';
            manaStat.appendChild(manaLabel);
            manaStat.appendChild(manaValue);
            statsContainer.appendChild(manaStat);
        }
        
        overlay.appendChild(statsContainer);
        document.body.appendChild(overlay);
    }
    
    /**
     * Store player's own stats from Command Center
     */
    function storeOwnStats() {
        const commandCenterData = parseCommandCenter();
        if (!commandCenterData || Object.keys(commandCenterData.militaryStats).length === 0) {
            console.warn('Could not parse Command Center data');
            return false;
        }
        
        // Get existing own data to preserve other fields
        const existingOwn = getPlayerData('own') || {};
        
        // Get gold invested data from armory and upgrades
        const inventoryValues = getInventoryValues();
        const upgradeLevels = getUpgradeLevels();
        const inventory = getInventory();
        
        // Use Command Center upgrade data if available, otherwise fall back to stored upgrade levels
        const ccUpgrades = commandCenterData.upgrades || {};
        const skirmishLevel = ccUpgrades.skirmish?.level || upgradeLevels.skirmish?.level;
        const resistanceLevel = ccUpgrades.resistance?.level || upgradeLevels.resistance?.level;
        const sleeperLevel = ccUpgrades.sleeper?.level || upgradeLevels.sleeper?.level;
        const surveillanceLevel = ccUpgrades.surveillance?.level || upgradeLevels.surveillance?.level;
        const technologyLevel = ccUpgrades.technology?.level || upgradeLevels.technology?.level;
        
        // Calculate gold invested
        const goldInvested = {
            attack: {
                upgrades: calculateUpgradeGoldInvested('skirmish', skirmishLevel),
                weapons: inventoryValues.attack || 0,
                total: 0
            },
            defense: {
                upgrades: calculateUpgradeGoldInvested('resistance', resistanceLevel),
                weapons: inventoryValues.defense || 0,
                total: 0
            },
            stealth: {
                upgrades: calculateUpgradeGoldInvested('sleeper', sleeperLevel),
                weapons: inventoryValues.stealth || 0,
                total: 0
            },
            security: {
                upgrades: calculateUpgradeGoldInvested('surveillance', surveillanceLevel),
                weapons: inventoryValues.security || 0,
                total: 0
            },
            technology: {
                upgrades: calculateUpgradeGoldInvested('technology', technologyLevel),
                weapons: 0,
                total: 0
            },
            grandTotal: 0
        };
        
        // Calculate totals
        Object.keys(goldInvested).forEach(key => {
            if (key !== 'grandTotal' && goldInvested[key].total !== undefined) {
                goldInvested[key].total = goldInvested[key].upgrades + goldInvested[key].weapons;
            }
        });
        goldInvested.grandTotal = goldInvested.attack.total + goldInvested.defense.total + 
                                 goldInvested.stealth.total + goldInvested.security.total + 
                                 goldInvested.technology.total;
        
        // Build armory array from inventory
        const armory = [];
        Object.keys(inventory).forEach(key => {
            const [type, htmlTag] = key.split('-');
            const weapon = WEAPONS_DATA.find(w => w.type === type && w.htmlTag === htmlTag);
            if (weapon && inventory[key] > 0) {
                armory.push({
                    type: type,
                    name: weapon.name,
                    strength: weapon.strength,
                    quantity: inventory[key]
                });
            }
        });
        
        // Build general stats from upgrade levels (use Command Center data if available, otherwise fall back to stored data)
        const generalStats = {
            skirmish: ccUpgrades.skirmish?.level || upgradeLevels.skirmish?.level || null,
            resistance: ccUpgrades.resistance?.level || upgradeLevels.resistance?.level || null,
            sleeper: ccUpgrades.sleeper?.level || upgradeLevels.sleeper?.level || null,
            surveillance: ccUpgrades.surveillance?.level || upgradeLevels.surveillance?.level || null,
            economy: ccUpgrades.technology?.level || upgradeLevels.technology?.level || null
        };
        
        // Also update the stored upgrade levels with Command Center data
        if (ccUpgrades.skirmish) {
            upgradeLevels.skirmish = {
                level: ccUpgrades.skirmish.level,
                name: ccUpgrades.skirmish.name
            };
        }
        if (ccUpgrades.resistance) {
            upgradeLevels.resistance = {
                level: ccUpgrades.resistance.level,
                name: ccUpgrades.resistance.name
            };
        }
        if (ccUpgrades.sleeper) {
            upgradeLevels.sleeper = {
                level: ccUpgrades.sleeper.level,
                name: ccUpgrades.sleeper.name
            };
        }
        if (ccUpgrades.surveillance) {
            upgradeLevels.surveillance = {
                level: ccUpgrades.surveillance.level,
                name: ccUpgrades.surveillance.name
            };
        }
        if (ccUpgrades.technology) {
            upgradeLevels.technology = {
                level: ccUpgrades.technology.level,
                name: ccUpgrades.technology.name
            };
        }
        GM_setValue(UPGRADE_LEVELS_KEY, upgradeLevels);
        
        // Store as special player with statsId "own"
        const ownData = {
            ...existingOwn,
            statsId: 'own',
            username: commandCenterData.username || existingOwn.username || 'You',
            statsUrl: window.location.href,
            lastUpdated: Date.now(),
            militaryStats: commandCenterData.militaryStats,
            ownRankings: commandCenterData.rankings,
            ownNextValues: commandCenterData.nextValues,
            generalStats: generalStats,
            armory: armory,
            goldInvested: goldInvested,
            manaProduction: commandCenterData.manaProduction || existingOwn.manaProduction || null
        };
        
        updatePlayerData('own', ownData);
        console.log('Stored own stats:', ownData);
        
        // Show clickable notification
        const notification = showNotification('Your stats updated from Command Center');
        if (notification) {
            notification.style.cursor = 'pointer';
            notification.title = 'Click to view Intelligence Dashboard';
            notification.addEventListener('click', (e) => {
                e.stopPropagation();
                showIntelligenceDisplay();
            });
        }
        return true;
    }
    
    /**
     * Update own player's gold invested when visiting armory or upgrades pages
     */
    function updateOwnGoldInvested() {
        const ownData = getPlayerData('own');
        if (!ownData) return; // No own data yet
        
        // Get current data
        const inventoryValues = getInventoryValues();
        const upgradeLevels = getUpgradeLevels();
        const inventory = getInventory();
        
        // Recalculate gold invested
        const goldInvested = {
            attack: {
                upgrades: calculateUpgradeGoldInvested('skirmish', upgradeLevels.skirmish?.level),
                weapons: inventoryValues.attack || 0,
                total: 0
            },
            defense: {
                upgrades: calculateUpgradeGoldInvested('resistance', upgradeLevels.resistance?.level),
                weapons: inventoryValues.defense || 0,
                total: 0
            },
            stealth: {
                upgrades: calculateUpgradeGoldInvested('sleeper', upgradeLevels.sleeper?.level),
                weapons: inventoryValues.stealth || 0,
                total: 0
            },
            security: {
                upgrades: calculateUpgradeGoldInvested('surveillance', upgradeLevels.surveillance?.level),
                weapons: inventoryValues.security || 0,
                total: 0
            },
            technology: {
                upgrades: calculateUpgradeGoldInvested('technology', upgradeLevels.technology?.level),
                weapons: 0,
                total: 0
            },
            grandTotal: 0
        };
        
        // Calculate totals
        Object.keys(goldInvested).forEach(key => {
            if (key !== 'grandTotal' && goldInvested[key].total !== undefined) {
                goldInvested[key].total = goldInvested[key].upgrades + goldInvested[key].weapons;
            }
        });
        goldInvested.grandTotal = goldInvested.attack.total + goldInvested.defense.total + 
                                 goldInvested.stealth.total + goldInvested.security.total + 
                                 goldInvested.technology.total;
        
        // Build armory array from inventory
        const armory = [];
        Object.keys(inventory).forEach(key => {
            const [type, htmlTag] = key.split('-');
            const weapon = WEAPONS_DATA.find(w => w.type === type && w.htmlTag === htmlTag);
            if (weapon && inventory[key] > 0) {
                armory.push({
                    type: type,
                    name: weapon.name,
                    strength: weapon.strength,
                    quantity: inventory[key]
                });
            }
        });
        
        // Build general stats from upgrade levels
        const generalStats = {
            ...ownData.generalStats,
            skirmish: upgradeLevels.skirmish?.level || ownData.generalStats?.skirmish || null,
            resistance: upgradeLevels.resistance?.level || ownData.generalStats?.resistance || null,
            sleeper: upgradeLevels.sleeper?.level || ownData.generalStats?.sleeper || null,
            surveillance: upgradeLevels.surveillance?.level || ownData.generalStats?.surveillance || null,
            economy: upgradeLevels.technology?.level || ownData.generalStats?.economy || null
        };
        
        // Update own data
        const updatedOwn = {
            ...ownData,
            goldInvested: goldInvested,
            armory: armory,
            generalStats: generalStats,
            lastUpdated: Date.now()
        };
        
        updatePlayerData('own', updatedOwn);
    }
    
    /**
     * Calculate gold invested in upgrades for a stat
     */
    function calculateUpgradeGoldInvested(upgradeType, level) {
        const upgrades = UPGRADES_DATA[upgradeType];
        if (!upgrades || level === null || level === undefined || level === '???') {
            return 0;
        }
        
        const upgrade = upgrades.find(u => u.level === level);
        if (!upgrade) {
            // Find highest level <= level
            const validUpgrade = upgrades
                .filter(u => u.level <= level)
                .sort((a, b) => b.level - a.level)[0];
            return validUpgrade ? validUpgrade.totalCost : 0;
        }
        
        return upgrade.totalCost || 0;
    }
    
    /**
     * Calculate gold invested in weapons for a stat
     */
    function calculateWeaponGoldInvested(statType, armory) {
        if (!armory || !Array.isArray(armory)) return 0;
        
        let total = 0;
        armory.forEach(weapon => {
            if (weapon.type.toLowerCase() === statType.toLowerCase()) {
                // Find weapon in WEAPONS_DATA to get cost
                const weaponData = WEAPONS_DATA.find(w => 
                    w.type === statType && w.name === weapon.name
                );
                if (weaponData) {
                    total += weaponData.cost * weapon.quantity;
                }
            }
        });
        
        return total;
    }
    
    /**
     * Calculate total gold invested for a player
     * Returns: { attack: { upgrades, weapons, total }, defense: {...}, stealth: {...}, security: {...}, technology: {...}, grandTotal: ... }
     */
    function calculateGoldInvested(playerData) {
        const result = {
            attack: { upgrades: 0, weapons: 0, total: 0 },
            defense: { upgrades: 0, weapons: 0, total: 0 },
            stealth: { upgrades: 0, weapons: 0, total: 0 },
            security: { upgrades: 0, weapons: 0, total: 0 },
            technology: { upgrades: 0, weapons: 0, total: 0 },
            grandTotal: 0
        };
        
        if (!playerData) return result;
        
        const generalStats = playerData.generalStats || {};
        const armory = playerData.armory || [];
        
        // Calculate for each stat
        const statMap = {
            attack: { upgradeType: 'skirmish', upgradeLevel: generalStats.skirmish },
            defense: { upgradeType: 'resistance', upgradeLevel: generalStats.resistance },
            stealth: { upgradeType: 'sleeper', upgradeLevel: generalStats.sleeper },
            security: { upgradeType: 'surveillance', upgradeLevel: generalStats.surveillance }
        };
        
        Object.keys(statMap).forEach(stat => {
            const { upgradeType, upgradeLevel } = statMap[stat];
            result[stat].upgrades = calculateUpgradeGoldInvested(upgradeType, upgradeLevel);
            result[stat].weapons = calculateWeaponGoldInvested(stat, armory);
            result[stat].total = result[stat].upgrades + result[stat].weapons;
        });
        
        // Technology (applies to all stats)
        const techLevel = generalStats.economy;
        result.technology.upgrades = calculateUpgradeGoldInvested('technology', techLevel);
        result.technology.total = result.technology.upgrades;
        
        // Grand total
        result.grandTotal = result.attack.total + result.defense.total + 
                           result.stealth.total + result.security.total + 
                           result.technology.total;
        
        return result;
    }
    
    /**
     * Get data age color (green <4h, yellow 4-24h, red >24h)
     */
    function getDataAgeColor(timestamp) {
        if (!timestamp) return '#999'; // No data
        
        const ageMs = Date.now() - timestamp;
        const ageHours = ageMs / (1000 * 60 * 60);
        
        if (ageHours < 4) return '#4CAF50'; // Green
        if (ageHours < 24) return '#FFC107'; // Yellow
        return '#F44336'; // Red
    }
    
    /**
     * Calculate data age for a specific stat's gold invested calculation
     * Checks upgrade level and all weapons for that stat type
     * Returns timestamp or a very old timestamp if data is missing
     */
    function getStatDataAge(playerData, statType) {
        if (!playerData) return null;
        
        const generalStats = playerData.generalStats || {};
        const armory = playerData.armory;
        
        // Map stat types to upgrade types
        const upgradeMap = {
            'attack': 'skirmish',
            'defense': 'resistance',
            'stealth': 'sleeper',
            'security': 'surveillance'
        };
        
        const upgradeType = upgradeMap[statType];
        if (!upgradeType) return null;
        
        // Check upgrade level for this stat
        const upgradeLevel = generalStats[upgradeType];
        if (upgradeLevel === null || upgradeLevel === undefined || upgradeLevel === '???') {
            // Missing upgrade data - return very old timestamp (red)
            return Date.now() - (25 * 60 * 60 * 1000);
        }
        
        // Check armory inventory - we need to verify we have complete data
        // If armory is missing entirely (not an array), that's a problem
        if (armory === undefined || armory === null) {
            // Armory data is missing - return very old timestamp (red)
            return Date.now() - (25 * 60 * 60 * 1000);
        }
        
        // Note: We can't check individual weapon quantities for '???' because
        // the armory array only contains weapons with quantity > 0
        // If a weapon is missing from the array, it means quantity is 0, not that data is missing
        // However, if we have the armory array, we assume all weapons for this stat are accounted for
        
        // All required data is present - use the player's lastUpdated timestamp
        return playerData.lastUpdated || null;
    }
    
    /**
     * Calculate data age for the total (grand total) column
     * Returns red if ANY stat is missing data, otherwise returns oldest timestamp among all stats
     */
    function getTotalDataAge(playerData) {
        if (!playerData) return null;
        
        const stats = ['attack', 'defense', 'stealth', 'security', 'technology'];
        const timestamps = [];
        let hasMissingData = false;
        
        stats.forEach(stat => {
            let statTimestamp;
            if (stat === 'technology') {
                // Technology only needs economy upgrade level
                const generalStats = playerData.generalStats || {};
                const techLevel = generalStats.economy;
                if (techLevel === null || techLevel === undefined || techLevel === '???') {
                    hasMissingData = true;
                    statTimestamp = Date.now() - (25 * 60 * 60 * 1000);
                } else {
                    statTimestamp = playerData.lastUpdated || null;
                }
            } else {
                statTimestamp = getStatDataAge(playerData, stat);
                if (statTimestamp && statTimestamp < Date.now() - (24 * 60 * 60 * 1000)) {
                    // This stat has missing data (very old timestamp)
                    hasMissingData = true;
                }
            }
            if (statTimestamp) {
                timestamps.push(statTimestamp);
            }
        });
        
        // If any stat is missing data, return red
        if (hasMissingData) {
            return Date.now() - (25 * 60 * 60 * 1000);
        }
        
        // Return the oldest timestamp among all stats
        if (timestamps.length > 0) {
            return Math.min(...timestamps);
        }
        
        return playerData.lastUpdated || null;
    }
    
    /**
     * Format time duration as human-readable string (e.g., "1d3h45m")
     */
    function formatTimeDuration(minutes) {
        if (!minutes || minutes <= 0) return '0m';
        
        const days = Math.floor(minutes / (60 * 24));
        const hours = Math.floor((minutes % (60 * 24)) / 60);
        const mins = Math.floor(minutes % 60);
        
        let result = '';
        if (days > 0) result += `${days}d`;
        if (hours > 0) result += `${hours}h`;
        if (mins > 0 || result === '') result += `${mins}m`;
        
        return result;
    }
    
    /**
     * Format data age as human-readable string
     */
    function formatDataAge(timestamp) {
        if (!timestamp) return 'Never';
        
        const ageMs = Date.now() - timestamp;
        const ageHours = ageMs / (1000 * 60 * 60);
        const ageDays = ageHours / 24;
        
        if (ageHours < 1) {
            const ageMins = Math.floor(ageMs / (1000 * 60));
            return `${ageMins}m ago`;
        } else if (ageHours < 24) {
            return `${Math.floor(ageHours)}h ago`;
        } else {
            return `${Math.floor(ageDays)}d ago`;
        }
    }
    
    /**
     * Create Legends overlays on legends page
     */
    function createLegendsOverlays() {
        // Check if feature is enabled
        if (!isFeatureEnabled('legendsTimer')) {
            console.log('Legends Timer is disabled');
            return;
        }
        
        // Get mana production and current mana
        const ownData = getPlayerData('own');
        const manaProduction = ownData?.manaProduction;
        
        if (!manaProduction || manaProduction <= 0) {
            console.warn('Mana production not available. Visit Command Center to update.');
            showNotification('Legends Timer: Visit Command Center to update mana production', 5000);
            return;
        }
        
        // Get current mana
        const manaElement = document.getElementById('data-mana');
        if (!manaElement) {
            console.warn('Could not find current mana element');
            return;
        }
        
        const currentMana = parseNumber(manaElement.textContent.trim());
        
        // Find all legend tbody elements
        const allTbodies = Array.from(document.querySelectorAll('tbody'));
        const legendTbodies = allTbodies.filter(tbody => {
            const th = tbody.querySelector('th');
            if (!th) return false;
            const text = th.textContent.trim();
            return text.match(/^\d+\./); // Matches "17. The Underworld Protector"
        });
        
        let overlayCount = 0;
        
        legendTbodies.forEach(tbody => {
            // Extract legend number first for logging
            const th = tbody.querySelector('th');
            if (!th) {
                console.warn('Legend tbody has no th element');
                return;
            }
            const legendMatch = th.textContent.trim().match(/^(\d+)\./);
            if (!legendMatch) {
                console.warn('Could not extract legend number from:', th.textContent.trim());
                return;
            }
            const legendNumber = legendMatch[1];
            
            // Check if this legend is already sought (has legends-seeked class)
            const legendDiv = tbody.querySelector('div.legends-seeked');
            if (legendDiv) {
                return; // Skip already-sought legends
            }
            
            // Check if it's a regular (not sought) legend
            const regularLegendDiv = tbody.querySelector('div.legends');
            if (!regularLegendDiv) {
                return; // Not a valid legend entry
            }
            
            // Find mana cost in the tbody
            const allSpans = Array.from(tbody.querySelectorAll('span'));
            const manaCostText = allSpans.find(span => 
                span.textContent.includes('Mana')
            )?.textContent.trim();
            
            if (!manaCostText) return;
            
            const manaCostMatch = manaCostText.match(/([\d,]+)\s*Mana/);
            if (!manaCostMatch) return;
            
            const manaCost = parseNumber(manaCostMatch[1]);
            
            // Calculate times
            const totalMinutes = manaCost / manaProduction; // Total time from 0 mana
            const remainingMana = Math.max(0, manaCost - currentMana);
            const remainingMinutes = remainingMana / manaProduction; // Time remaining with current mana
            
            // Create overlay container
            const overlayContainer = document.createElement('div');
            overlayContainer.className = 'mwh-legend-overlay';
            overlayContainer.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.7) !important;
                color: white !important;
                padding: 8px !important;
                font-size: 11px !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
                z-index: 1000 !important;
                pointer-events: none !important;
                box-sizing: border-box !important;
            `;
            
            // Total time overlay
            const totalTimeDiv = document.createElement('div');
            totalTimeDiv.style.cssText = 'margin-bottom: 4px; font-weight: bold;';
            totalTimeDiv.textContent = `Total: ${formatTimeDuration(totalMinutes)}`;
            overlayContainer.appendChild(totalTimeDiv);
            
            // Remaining time overlay (with live countdown)
            const remainingTimeDiv = document.createElement('div');
            remainingTimeDiv.style.cssText = 'font-size: 10px; color: #4B9CD3;';
            
            // Store initial values for countdown calculation
            const startTime = Date.now();
            const initialRemainingMana = remainingMana;
            
            // Declare countdownInterval before the function so it's in scope
            let countdownInterval = null;
            
            function updateCountdown() {
                const elapsedMs = Date.now() - startTime;
                const elapsedMinutes = elapsedMs / (60 * 1000);
                const manaProduced = elapsedMinutes * manaProduction;
                const currentRemainingMana = Math.max(0, initialRemainingMana - manaProduced);
                const currentRemainingMinutes = currentRemainingMana / manaProduction;
                
                if (currentRemainingMinutes <= 0) {
                    remainingTimeDiv.textContent = 'Ready!';
                    remainingTimeDiv.style.color = '#4CAF50';
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        countdownInterval = null;
                    }
                } else {
                    remainingTimeDiv.textContent = `${formatTimeDuration(currentRemainingMinutes)} left`;
                }
            }
            
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000); // Update every second for live countdown
            
            overlayContainer.appendChild(remainingTimeDiv);
            
            // Find the legend image container and make it relative positioned
            // Based on the HTML structure: <td class="bd-l bd-r"> contains <a> with <div class="legends">
            let legendImageContainer = null;
            
            // Try finding the td that contains the legend image div
            const allTds = Array.from(tbody.querySelectorAll('td'));
            for (const td of allTds) {
                const legendDiv = td.querySelector('div.legends');
                if (legendDiv) {
                    legendImageContainer = td;
                    break;
                }
            }
            
            if (legendImageContainer) {
                // Ensure the container is positioned relatively
                const currentPosition = window.getComputedStyle(legendImageContainer).position;
                if (currentPosition === 'static' || currentPosition === '') {
                    legendImageContainer.style.position = 'relative';
                }
                
                // Remove any existing overlay for this legend (in case of re-runs)
                const existingOverlay = legendImageContainer.querySelector('.mwh-legend-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                
                // Add a class to identify our overlay
                overlayContainer.classList.add('mwh-legend-overlay');
                
                legendImageContainer.appendChild(overlayContainer);
                overlayCount++;
            }
        });
        
        if (overlayCount > 0) {
            showNotification(`Legends Timer: ${overlayCount} overlays created`, 3000);
        }
        
        // Create summary overlay at the top of the page
        createLegendsSummaryOverlay(manaProduction, currentMana, legendTbodies);
    }
    
    /**
     * Create a summary overlay showing total mana needed, production remaining, and surplus/deficit
     */
    function createLegendsSummaryOverlay(manaProduction, currentMana, legendTbodies) {
        // Parse age end time - try multiple selectors
        let ageEndDiv = document.querySelector('div.cd-eoa-2.v.valid');
        if (!ageEndDiv) {
            // Try without the 'v' class
            ageEndDiv = document.querySelector('div.cd-eoa-2.valid');
        }
        if (!ageEndDiv) {
            // Try just the class
            ageEndDiv = document.querySelector('div.cd-eoa-2');
        }
        if (!ageEndDiv) {
            // Try finding any div containing "ends in"
            const allDivs = Array.from(document.querySelectorAll('div'));
            ageEndDiv = allDivs.find(div => div.textContent.includes('ends in'));
        }
        
        if (!ageEndDiv) {
            console.warn('Could not find age end time element');
            return;
        }
        
        const ageEndText = ageEndDiv.textContent.trim();
        // Parse format: "Age Alpha 101 ends in 12d, 9h, 1m, 50s"
        const timeMatch = ageEndText.match(/ends in\s+(?:(\d+)d,?\s*)?(?:(\d+)h,?\s*)?(?:(\d+)m,?\s*)?(?:(\d+)s)?/i);
        if (!timeMatch) {
            console.warn('Could not parse age end time:', ageEndText);
            return;
        }
        
        const days = parseInt(timeMatch[1] || '0', 10);
        const hours = parseInt(timeMatch[2] || '0', 10);
        const minutes = parseInt(timeMatch[3] || '0', 10);
        const seconds = parseInt(timeMatch[4] || '0', 10);
        const totalMinutesRemaining = (days * 24 * 60) + (hours * 60) + minutes + (seconds / 60);
        
        // Calculate total mana needed for all unsought legends
        let totalManaNeeded = 0;
        let totalRemainingMana = 0; // Total remaining mana needed after accounting for current mana
        let unsoughtCount = 0;
        let manaApplied = 0; // Track how much of currentMana has been applied to previous legends
        
        legendTbodies.forEach(tbody => {
            // Check if already sought
            const legendDiv = tbody.querySelector('div.legends-seeked');
            if (legendDiv) return; // Skip already-sought legends
            
            // Check if it's a regular (not sought) legend
            const regularLegendDiv = tbody.querySelector('div.legends');
            if (!regularLegendDiv) return;
            
            // Find mana cost
            const allSpans = Array.from(tbody.querySelectorAll('span'));
            const manaCostText = allSpans.find(span => 
                span.textContent.includes('Mana')
            )?.textContent.trim();
            
            if (!manaCostText) return;
            
            const manaCostMatch = manaCostText.match(/([\d,]+)\s*Mana/);
            if (!manaCostMatch) return;
            
            const manaCost = parseNumber(manaCostMatch[1]);
            totalManaNeeded += manaCost;
            
            // Calculate remaining mana for this legend after applying available mana sequentially
            // Each legend gets priority for any remaining currentMana that hasn't been applied yet
            const manaAvailableForThisLegend = Math.max(0, currentMana - manaApplied);
            const remainingManaForThisLegend = Math.max(0, manaCost - manaAvailableForThisLegend);
            totalRemainingMana += remainingManaForThisLegend;
            
            // Update how much mana has been applied (can't apply more than the legend costs)
            manaApplied += Math.min(manaCost, manaAvailableForThisLegend);
            
            unsoughtCount++;
        });
        
        // Calculate total mana production remaining
        const totalManaProductionRemaining = totalMinutesRemaining * manaProduction;
        
        // Calculate total mana available (current + production remaining)
        const totalManaAvailable = currentMana + totalManaProductionRemaining;
        
        // Calculate surplus/deficit
        const manaSurplus = totalManaAvailable - totalManaNeeded;
        
        // Calculate time until all legends completed (two scenarios)
        // 1. Time if assuming 0 mana on hand (full cost)
        const minutesToCompleteFromZero = totalManaNeeded / manaProduction;
        // 2. Time if accounting for current mana on hand (remaining after applying current mana)
        const minutesToCompleteWithCurrentMana = totalRemainingMana / manaProduction;
        
        // Create summary overlay
        const summaryOverlay = document.createElement('div');
        summaryOverlay.id = 'mwh-legends-summary';
        summaryOverlay.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0, 0, 0, 0.9) !important;
            border: 2px solid #4B9CD3 !important;
            border-radius: 8px !important;
            padding: 15px 20px !important;
            color: white !important;
            font-size: 13px !important;
            z-index: 10000 !important;
            min-width: 400px !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) !important;
        `;
        
        const title = document.createElement('div');
        title.style.cssText = 'font-weight: bold; font-size: 15px; margin-bottom: 10px; color: #4B9CD3; text-align: center;';
        title.textContent = 'Legends Summary';
        summaryOverlay.appendChild(title);
        
        // Total mana production remaining
        const productionDiv = document.createElement('div');
        productionDiv.style.cssText = 'margin-bottom: 5px;';
        productionDiv.innerHTML = `<strong>Total Mana Production Remaining:</strong> ${formatNumber(totalManaProductionRemaining)}`;
        summaryOverlay.appendChild(productionDiv);
        
        // Total mana needed
        const neededDiv = document.createElement('div');
        neededDiv.style.cssText = 'margin-bottom: 5px;';
        neededDiv.innerHTML = `<strong>Total Mana Needed:</strong> ${formatNumber(totalManaNeeded)}`;
        summaryOverlay.appendChild(neededDiv);
        
        // Current mana on hand
        const currentManaDiv = document.createElement('div');
        currentManaDiv.style.cssText = 'margin-bottom: 5px;';
        currentManaDiv.innerHTML = `<strong>Mana On Hand:</strong> ${formatNumber(currentMana)}`;
        summaryOverlay.appendChild(currentManaDiv);
        
        // Remaining mana after applying current mana
        const remainingManaDiv = document.createElement('div');
        remainingManaDiv.style.cssText = 'margin-bottom: 5px;';
        remainingManaDiv.innerHTML = `<strong>Remaining Mana Needed:</strong> ${formatNumber(totalRemainingMana)}`;
        summaryOverlay.appendChild(remainingManaDiv);
        
        // Time until completion (two scenarios)
        const timeDiv = document.createElement('div');
        timeDiv.style.cssText = 'margin-bottom: 5px;';
        let timeHtml = '<strong>Time Until All Legends Complete:</strong><br>';
        
        // Time assuming 0 mana on hand
        if (minutesToCompleteFromZero <= totalMinutesRemaining) {
            timeHtml += `&nbsp;&nbsp;• From 0 mana: ${formatTimeDuration(minutesToCompleteFromZero)}<br>`;
        } else {
            timeHtml += `&nbsp;&nbsp;• From 0 mana: <span style="color: #ff6b6b;">Not possible in remaining time</span><br>`;
        }
        
        // Time accounting for current mana
        if (minutesToCompleteWithCurrentMana <= totalMinutesRemaining) {
            timeHtml += `&nbsp;&nbsp;• With current mana (${formatNumber(currentMana)}): <span style="color: #4CAF50; font-weight: bold;">${formatTimeDuration(minutesToCompleteWithCurrentMana)}</span>`;
        } else {
            timeHtml += `&nbsp;&nbsp;• With current mana (${formatNumber(currentMana)}): <span style="color: #ff6b6b;">Not possible in remaining time</span>`;
        }
        
        timeDiv.innerHTML = timeHtml;
        summaryOverlay.appendChild(timeDiv);
        
        // Surplus/Deficit
        const surplusDiv = document.createElement('div');
        surplusDiv.style.cssText = `margin-top: 10px; padding-top: 10px; border-top: 1px solid #4B9CD3; font-weight: bold; font-size: 14px; text-align: center; color: ${manaSurplus >= 0 ? '#4CAF50' : '#ff6b6b'};`;
        if (manaSurplus >= 0) {
            surplusDiv.textContent = `Surplus: ${formatNumber(manaSurplus)} Mana`;
        } else {
            surplusDiv.textContent = `Deficit: ${formatNumber(Math.abs(manaSurplus))} Mana`;
        }
        summaryOverlay.appendChild(surplusDiv);
        
        // Insert at the top of the page
        document.body.insertBefore(summaryOverlay, document.body.firstChild);
    }
    
    /**
     * Create the Intelligence Display Page with tables
     */
    function createIntelligenceDisplayPage() {
        // Remove existing display if present
        const existing = document.getElementById('mwh-intelligence-display');
        if (existing) existing.remove();
        
        const intel = getPlayerIntelligence();
        const ownData = intel['own'] || null;
        
        // Debug: log own data structure
        console.log('Intelligence Display - ownData:', ownData);
        if (ownData) {
            console.log('ownData.ownRankings:', ownData.ownRankings);
            console.log('ownData.militaryStats:', ownData.militaryStats);
        }
        
        // Create container
        const container = document.createElement('div');
        container.id = 'mwh-intelligence-display';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            z-index: 99999;
            overflow-y: auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            color: #fff;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 30px; text-align: center;';
        const title = document.createElement('h1');
        title.textContent = 'Player Intelligence Dashboard';
        title.style.cssText = 'margin: 0 0 10px 0; color: #4B9CD3;';
        header.appendChild(title);
        
        const helpText = document.createElement('div');
        helpText.innerHTML = '📊 Data displayed is only as much as is known from recent recon missions. <span style="color: #4CAF50;">Green</span> = <4h, <span style="color: #FFC107;">Yellow</span> = 4-24h, <span style="color: #F44336;">Red</span> = >24h';
        helpText.style.cssText = 'font-size: 12px; color: #ccc;';
        header.appendChild(helpText);
        
        container.appendChild(header);
        
        // Top Rankings Tables (2 per row)
        const stats = ['attack', 'defense', 'stealth', 'security', 'supernatural'];
        const statNames = {
            attack: 'Attack Force',
            defense: 'Defense Force',
            stealth: 'Stealth Force',
            security: 'Security Force',
            supernatural: 'Supernatural Power'
        };
        
        // Create a container for the stat tables with grid layout
        const statsContainer = document.createElement('div');
        statsContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        `;
        
        // Add all 5 stats (supernatural will be alone in the last row, half width)
        stats.forEach(stat => {
            const tableSection = createTopRankingsTable(stat, statNames[stat], intel, ownData);
            statsContainer.appendChild(tableSection);
        });
        
        container.appendChild(statsContainer);
        
        // Player Overview Table
        const overviewSection = createPlayerOverviewTable(intel);
        container.appendChild(overviewSection);
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #F44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 100000;
        `;
        closeBtn.addEventListener('click', () => {
            container.remove();
            window.history.back();
        });
        container.appendChild(closeBtn);
        
        document.body.appendChild(container);
    }
    
    /**
     * Create Top Rankings Table for a stat
     */
    function createTopRankingsTable(statKey, statName, intel, ownData) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 20px;';
        
        // Collapsible header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #4B9CD3;
            color: #000;
            padding: 15px 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        const title = document.createElement('span');
        title.textContent = `Top ${statName} Rankings`;
        header.appendChild(title);
        
        const toggleIcon = document.createElement('span');
        toggleIcon.style.cssText = 'font-size: 14px;';
        header.appendChild(toggleIcon);
        
        // Table container (open by default, remember user preference)
        const TABLE_STATE_KEY = 'mwh_table_states';
        const tableStates = GM_getValue(TABLE_STATE_KEY, {});
        const tableKey = `top_${statKey}_rankings`;
        const defaultExpanded = tableStates[tableKey] !== false; // Default to true (open)
        
        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = `display: ${defaultExpanded ? 'block' : 'none'}; background: #000;`;
        let isExpanded = defaultExpanded;
        
        // Update toggle icon based on initial state
        toggleIcon.textContent = defaultExpanded ? '▲' : '▼';
        
        header.addEventListener('click', () => {
            isExpanded = !isExpanded;
            tableContainer.style.display = isExpanded ? 'block' : 'none';
            toggleIcon.textContent = isExpanded ? '▲' : '▼';
            
            // Remember user preference
            const tableStates = GM_getValue(TABLE_STATE_KEY, {});
            tableStates[tableKey] = isExpanded;
            GM_setValue(TABLE_STATE_KEY, tableStates);
        });
        
        section.appendChild(header);
        section.appendChild(tableContainer);
        
        // Collect all players with this stat (excluding own, which will be inserted at correct rank)
        const playersWithStat = [];
        Object.keys(intel).forEach(statsId => {
            const player = intel[statsId];
            // Skip 'own' player here - we'll insert it at the correct rank later
            if (statsId === 'own') return;
            if (player.militaryStats && player.militaryStats[statKey] && player.militaryStats[statKey] !== '???') {
                playersWithStat.push({
                    statsId: statsId,
                    username: player.username || 'Unknown',
                    value: player.militaryStats[statKey],
                    lastUpdated: player.lastUpdated,
                    isOwn: false
                });
            }
        });
        
        // Sort by value descending
        playersWithStat.sort((a, b) => b.value - a.value);
        
        // Get own ranking and next value
        let ownRank = null;
        let ownValue = null;
        let nextValue = null;
        
        if (ownData) {
            // Try to get rank from ownRankings
            if (ownData.ownRankings && ownData.ownRankings[statKey]) {
                ownRank = ownData.ownRankings[statKey];
            }
            
            // Try to get value from militaryStats
            if (ownData.militaryStats && ownData.militaryStats[statKey]) {
                const statValue = ownData.militaryStats[statKey];
                if (statValue !== '???' && statValue !== null && statValue !== undefined) {
                    ownValue = typeof statValue === 'number' ? statValue : parseNumber(statValue);
                }
            }
            
            // Try to get next value
            if (ownData.ownNextValues && ownData.ownNextValues[statKey]) {
                nextValue = ownData.ownNextValues[statKey];
            }
            
            // Debug logging
            console.log(`[${statKey}] ownData check:`, {
                hasOwnRankings: !!ownData.ownRankings,
                hasMilitaryStats: !!ownData.militaryStats,
                ownRankingsValue: ownData.ownRankings?.[statKey],
                militaryStatsValue: ownData.militaryStats?.[statKey],
                extracted: { ownRank, ownValue, nextValue }
            });
        } else {
            console.log(`[${statKey}] No ownData found`);
        }
        
        // Build rankings array (top 10)
        const rankings = [];
        
        // If we have own data with rank, use it to structure the rankings
        if (ownRank !== null && ownValue !== null && ownData) {
            // Separate players into those above and below own value
            const playersAbove = playersWithStat.filter(p => p.value > ownValue).sort((a, b) => b.value - a.value);
            const playersBelow = playersWithStat.filter(p => p.value < ownValue).sort((a, b) => b.value - a.value);
            
            let currentRank = 1;
            let aboveIndex = 0;
            let belowIndex = 0;
            
            // Fill ranks 1 to 10
            while (currentRank <= 10) {
                // Insert own player at correct rank
                if (currentRank === ownRank) {
                    rankings.push({
                        rank: currentRank,
                        username: ownData.username || 'You',
                        value: ownValue,
                        lastUpdated: ownData.lastUpdated,
                        isOwn: true,
                        color: getDataAgeColor(ownData.lastUpdated),
                        statsId: 'own'
                    });
                    currentRank++;
                    continue;
                }
                
                // Before own rank: insert players above or fill with ???
                if (currentRank < ownRank) {
                    if (aboveIndex < playersAbove.length) {
                        const player = playersAbove[aboveIndex];
                        rankings.push({
                            rank: currentRank,
                            username: player.username,
                            value: player.value,
                            lastUpdated: player.lastUpdated,
                            isOwn: false,
                            color: getDataAgeColor(player.lastUpdated),
                            statsId: player.statsId
                        });
                        aboveIndex++;
                    } else {
                        // Use next value if we're right before own rank
                        // Next value is the difference, so we need to add it to ownValue to get the actual next rank value
                        let value = null;
                        let lastUpdated = null;
                        if (currentRank === ownRank - 1 && nextValue !== null && ownValue !== null) {
                            value = ownValue + nextValue; // Next value is the difference, not absolute
                            lastUpdated = ownData.lastUpdated; // Use same timestamp as own data
                        }
                        rankings.push({
                            rank: currentRank,
                            username: '???',
                            value: value,
                            lastUpdated: lastUpdated,
                            isOwn: false,
                            color: lastUpdated ? getDataAgeColor(lastUpdated) : '#999',
                            isEstimated: false // Not estimated, it's the exact value
                        });
                    }
                    currentRank++;
                    continue;
                }
                
                // After own rank: insert players below or fill with ???
                if (currentRank > ownRank) {
                    if (belowIndex < playersBelow.length) {
                        const player = playersBelow[belowIndex];
                        rankings.push({
                            rank: currentRank,
                            username: player.username,
                            value: player.value,
                            lastUpdated: player.lastUpdated,
                            isOwn: false,
                            color: getDataAgeColor(player.lastUpdated),
                            statsId: player.statsId
                        });
                        belowIndex++;
                    } else {
                        rankings.push({
                            rank: currentRank,
                            username: '???',
                            value: null,
                            lastUpdated: null,
                            isOwn: false,
                            color: '#999'
                        });
                    }
                    currentRank++;
                    continue;
                }
            }
        } else {
            // No own data - just show all players sorted by value
            const sortedPlayers = [...playersWithStat].sort((a, b) => b.value - a.value);
            for (let i = 0; i < 10; i++) {
                if (i < sortedPlayers.length) {
                    const player = sortedPlayers[i];
                    rankings.push({
                        rank: i + 1,
                        username: player.username,
                        value: player.value,
                        lastUpdated: player.lastUpdated,
                        isOwn: false,
                        color: getDataAgeColor(player.lastUpdated),
                        statsId: player.statsId
                    });
                } else {
                    rankings.push({
                        rank: i + 1,
                        username: '???',
                        value: null,
                        lastUpdated: null,
                        isOwn: false,
                        color: '#999'
                    });
                }
            }
        }
        
        // Create table
        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse;';
        
        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.cssText = 'background: #4B9CD3; color: #000;';
        ['Rank', 'Player', 'Value', 'Data Age'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.cssText = 'padding: 10px; text-align: left; font-weight: bold;';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = document.createElement('tbody');
        rankings.forEach((item, index) => {
            const row = document.createElement('tr');
            // Alternate gray and black rows
            const bgColor = index % 2 === 0 ? '#333' : '#000';
            row.style.cssText = `border-bottom: 1px solid #555; background: ${item.isOwn ? '#1a4d4d' : bgColor}; color: #fff;`;
            
            // Rank
            const rankCell = document.createElement('td');
            rankCell.textContent = `#${item.rank}`;
            rankCell.style.cssText = 'padding: 8px; font-weight: bold;';
            row.appendChild(rankCell);
            
            // Player
            const playerCell = document.createElement('td');
            playerCell.textContent = item.username;
            playerCell.style.cssText = 'padding: 8px;';
            if (item.statsId && item.statsId !== 'own') {
                const link = document.createElement('a');
                link.href = intel[item.statsId]?.statsUrl || '#';
                link.textContent = item.username;
                link.target = '_blank';
                link.style.cssText = 'color: #4B9CD3; text-decoration: none;';
                link.addEventListener('mouseenter', () => {
                    link.style.textDecoration = 'underline';
                });
                link.addEventListener('mouseleave', () => {
                    link.style.textDecoration = 'none';
                });
                playerCell.innerHTML = '';
                playerCell.appendChild(link);
            }
            row.appendChild(playerCell);
            
            // Value
            const valueCell = document.createElement('td');
            if (item.value !== null) {
                valueCell.textContent = formatNumberWithCommas(item.value);
                if (item.isEstimated) {
                    valueCell.textContent += ' (min)';
                    valueCell.style.fontStyle = 'italic';
                }
            } else {
                valueCell.textContent = '???';
            }
            valueCell.style.cssText = `padding: 8px; color: ${item.color}; font-weight: bold;`;
            row.appendChild(valueCell);
            
            // Data Age
            const ageCell = document.createElement('td');
            ageCell.textContent = formatDataAge(item.lastUpdated);
            ageCell.style.cssText = `padding: 8px; color: ${item.color};`;
            row.appendChild(ageCell);
            
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        tableContainer.appendChild(table);
        return section;
    }
    
    /**
     * Create Player Overview Table with Gold Invested
     */
    function createPlayerOverviewTable(intel) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 20px;';
        
        // Collapsible header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #4B9CD3;
            color: #000;
            padding: 15px 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        const title = document.createElement('span');
        title.textContent = 'Player Overview - Gold Invested';
        header.appendChild(title);
        
        const toggleIcon = document.createElement('span');
        toggleIcon.style.cssText = 'font-size: 14px;';
        header.appendChild(toggleIcon);
        
        // Table container (open by default, remember user preference)
        const TABLE_STATE_KEY = 'mwh_table_states';
        const tableStates = GM_getValue(TABLE_STATE_KEY, {});
        const tableKey = 'player_overview';
        const defaultExpanded = tableStates[tableKey] !== false; // Default to true (open)
        
        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = `display: ${defaultExpanded ? 'block' : 'none'}; background: #000;`;
        let isExpanded = defaultExpanded;
        
        // Update toggle icon based on initial state
        toggleIcon.textContent = defaultExpanded ? '▲' : '▼';
        
        header.addEventListener('click', () => {
            isExpanded = !isExpanded;
            tableContainer.style.display = isExpanded ? 'block' : 'none';
            toggleIcon.textContent = isExpanded ? '▲' : '▼';
            
            // Remember user preference
            const tableStates = GM_getValue(TABLE_STATE_KEY, {});
            tableStates[tableKey] = isExpanded;
            GM_setValue(TABLE_STATE_KEY, tableStates);
        });
        
        section.appendChild(header);
        section.appendChild(tableContainer);
        
        // Get all players (including 'own', but filter out duplicates)
        // If 'own' exists, exclude any other entries with the same username
        const ownData = intel['own'];
        const ownUsername = ownData?.username;
        
        const players = Object.keys(intel)
            .map(id => ({ ...intel[id], statsId: id }))
            .filter(p => {
                if (!p.username) return false;
                // If this is the 'own' entry, always include it
                if (p.statsId === 'own') return true;
                // If we have own data and this player has the same username, exclude it (duplicate)
                if (ownUsername && p.username === ownUsername) return false;
                return true;
            });
        
        // Calculate gold invested for each
        let playersWithGold = players.map(player => ({
            ...player,
            goldInvested: player.goldInvested || calculateGoldInvested(player)
        }));
        
        // Sort by grand total descending (default)
        let sortColumn = 'total';
        let sortDirection = 'desc';
        
        // Create table
        const table = document.createElement('table');
        table.style.cssText = 'width: 100%; border-collapse: collapse;';
        
        // Header with sortable columns
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.cssText = 'background: #4B9CD3; color: #000;';
        
        const columns = [
            { key: 'player', label: 'Player', sortable: false },
            { key: 'attack', label: 'Attack', sortable: true },
            { key: 'defense', label: 'Defense', sortable: true },
            { key: 'stealth', label: 'Stealth', sortable: true },
            { key: 'security', label: 'Security', sortable: true },
            { key: 'total', label: 'Total', sortable: true }
        ];
        
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col.label;
            th.style.cssText = 'padding: 10px; text-align: left; font-weight: bold;';
            
            if (col.sortable) {
                th.style.cursor = 'pointer';
                th.style.userSelect = 'none';
                th.addEventListener('mouseenter', () => {
                    th.style.background = 'rgba(0,0,0,0.1)';
                });
                th.addEventListener('mouseleave', () => {
                    th.style.background = '';
                });
                
                th.addEventListener('click', () => {
                    if (sortColumn === col.key) {
                        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                    } else {
                        sortColumn = col.key;
                        sortDirection = 'desc';
                    }
                    
                    // Update sort indicators
                    headerRow.querySelectorAll('th').forEach((h, i) => {
                        if (i === 0) return; // Skip player column
                        h.textContent = columns[i].label;
                        if (columns[i].key === sortColumn) {
                            h.textContent += sortDirection === 'asc' ? ' ▲' : ' ▼';
                        }
                    });
                    
                    // Sort and re-render
                    sortPlayers();
                    renderTableBody();
                });
            }
            
            headerRow.appendChild(th);
        });
        
        // Set initial sort indicator
        const totalHeader = headerRow.querySelectorAll('th')[5];
        if (totalHeader) totalHeader.textContent = 'Total ▼';
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Body
        const tbody = document.createElement('tbody');
        
        function sortPlayers() {
            playersWithGold.sort((a, b) => {
                let aVal, bVal;
                
                if (sortColumn === 'total') {
                    aVal = a.goldInvested.grandTotal;
                    bVal = b.goldInvested.grandTotal;
                } else {
                    aVal = a.goldInvested[sortColumn]?.total || 0;
                    bVal = b.goldInvested[sortColumn]?.total || 0;
                }
                
                return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            });
        }
        
        function renderTableBody() {
            tbody.innerHTML = '';
            playersWithGold.forEach((player, index) => {
                const row = document.createElement('tr');
                // Alternate gray and black rows
                const bgColor = index % 2 === 0 ? '#333' : '#000';
                row.style.cssText = `border-bottom: 1px solid #555; background: ${bgColor}; color: #fff;`;
                
                const gold = player.goldInvested;
                // Calculate data age for total column (red if any stat is missing)
                const totalTimestamp = getTotalDataAge(player);
                const totalColor = getDataAgeColor(totalTimestamp);
                
                // Player
                const playerCell = document.createElement('td');
                if (player.statsId === 'own') {
                    // Own player - just show username, no link
                    playerCell.textContent = player.username || 'You';
                    playerCell.style.cssText = 'padding: 8px; font-weight: bold; color: #4B9CD3;';
                } else {
                    const link = document.createElement('a');
                    link.href = player.statsUrl || '#';
                    link.textContent = player.username;
                    link.target = '_blank';
                    link.style.cssText = 'color: #4B9CD3; text-decoration: none;';
                    link.addEventListener('mouseenter', () => {
                        link.style.textDecoration = 'underline';
                    });
                    link.addEventListener('mouseleave', () => {
                        link.style.textDecoration = 'none';
                    });
                    playerCell.appendChild(link);
                    playerCell.style.cssText = 'padding: 8px;';
                }
                row.appendChild(playerCell);
                
                // Stats columns
                ['attack', 'defense', 'stealth', 'security'].forEach(stat => {
                    const cell = document.createElement('td');
                    cell.style.cssText = 'padding: 8px;';
                    
                    const total = gold[stat].total;
                    // Calculate data age color for this specific stat
                    const statTimestamp = getStatDataAge(player, stat);
                    const statColor = getDataAgeColor(statTimestamp);
                    
                    const dropdown = document.createElement('span');
                    // Use data age color for this stat instead of blue
                    dropdown.style.cssText = `cursor: pointer; color: ${statColor}; text-decoration: underline;`;
                    dropdown.textContent = formatNumberWithCommas(total);
                    dropdown.title = `Upgrades: ${formatNumberWithCommas(gold[stat].upgrades)}\nWeapons: ${formatNumberWithCommas(gold[stat].weapons)}`;
                    
                    let tooltip = null;
                    dropdown.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (tooltip) {
                            tooltip.remove();
                            tooltip = null;
                        } else {
                            tooltip = document.createElement('div');
                            tooltip.innerHTML = `
                                <strong>${stat.toUpperCase()}</strong><br>
                                Upgrades: ${formatNumberWithCommas(gold[stat].upgrades)}<br>
                                Weapons: ${formatNumberWithCommas(gold[stat].weapons)}<br>
                                Total: ${formatNumberWithCommas(gold[stat].total)}
                            `;
                            tooltip.style.cssText = `
                                position: absolute;
                                background: #333;
                                color: white;
                                padding: 10px;
                                border-radius: 5px;
                                font-size: 12px;
                                z-index: 10001;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                                margin-top: 20px;
                            `;
                            dropdown.style.position = 'relative';
                            dropdown.appendChild(tooltip);
                            
                            setTimeout(() => {
                                const closeTooltip = (e) => {
                                    if (!tooltip.contains(e.target) && e.target !== dropdown) {
                                        tooltip.remove();
                                        tooltip = null;
                                        document.removeEventListener('click', closeTooltip);
                                    }
                                };
                                document.addEventListener('click', closeTooltip);
                            }, 100);
                        }
                    });
                    
                    cell.appendChild(dropdown);
                    row.appendChild(cell);
                });
                
                // Total
                // Total (red if any stat is missing, otherwise oldest timestamp)
                const totalCell = document.createElement('td');
                totalCell.textContent = formatNumberWithCommas(gold.grandTotal);
                totalCell.style.cssText = `padding: 8px; font-weight: bold; color: ${totalColor};`;
                row.appendChild(totalCell);
                
                tbody.appendChild(row);
            });
        }
        
        // Initial sort and render
        sortPlayers();
        renderTableBody();
        table.appendChild(tbody);
        
        tableContainer.appendChild(table);
        return section;
    }
    
    /**
     * Navigate to intelligence display page
     */
    function showIntelligenceDisplay() {
        const baseUrl = window.location.origin.includes('www.') 
            ? 'https://www.monsterswrath.com' 
            : 'https://monsterswrath.com';
        // Use current page and add parameter, or use a default page
        const currentPath = window.location.pathname;
        const separator = currentPath.includes('?') ? '&' : '?';
        window.location.href = `${baseUrl}${currentPath}${separator}mwh=intel`;
    }

    init();
    
    // Check if we need to process snapshot
    if (GM_getValue('mwh_snapshot_pending', false)) {
        GM_deleteValue('mwh_snapshot_pending');
        if (window.location.pathname.includes('battlefield2.php')) {
            setTimeout(() => {
                runSnapshotProcess();
            }, 1000);
        }
    }
    
    if (GM_getValue('mwh_snapshot_processing', false)) {
        if (window.location.pathname.includes('battlefield2.php')) {
            setTimeout(() => {
                processSecondTurn();
            }, 1000);
        }
    }
    
    // Display overlays on Top Stats page
    if (window.location.pathname.includes('toplist.php')) {
        setTimeout(() => {
            displaySnapshotOverlays();
        }, 1000);
    }
    
    // Update player list when on battlefield page
    if (window.location.pathname.includes('battlefield2.php')) {
        // Display snapshot data on battlefield (try multiple times in case DOM isn't ready)
        const tryDisplaySnapshot = (attempts = 3) => {
            displaySnapshotOnBattlefield();
            if (attempts > 1) {
                setTimeout(() => tryDisplaySnapshot(attempts - 1), 500);
            }
        };
        
        setTimeout(() => {
            const count = updatePlayerList();
            if (count > 0) {
                showNotification(`Updated player list: ${count} players`);
            }
            // Display snapshot data on battlefield with retries
            tryDisplaySnapshot();
        }, 1000);
        
        // Also try immediately in case page is already loaded
        if (document.readyState === 'complete') {
            tryDisplaySnapshot();
        }
    }
    
    // Process spy results page data when on spylog.php (after completing captcha)
    if (window.location.pathname.includes('spylog.php')) {
        setTimeout(() => {
            processSpyPage();
        }, 1000);
    }
    
    // Store own stats when on Command Center
    if (window.location.pathname.includes('base.php')) {
        // Display key stats overlay with retries (in case DOM isn't ready)
        const tryDisplayStats = (attempts = 3) => {
            displayCommandCenterStatsOverlay();
            if (attempts > 1) {
                setTimeout(() => tryDisplayStats(attempts - 1), 500);
            }
        };
        
        setTimeout(() => {
            storeOwnStats();
            // Display key stats overlay with retries
            tryDisplayStats();
        }, 1000);
        
        // Also try to display overlay immediately if page is already loaded
        if (document.readyState === 'complete') {
            setTimeout(() => tryDisplayStats(), 500);
        }
    }
    
    // Create intelligence display page (works on any page with mwh=intel parameter)
    if (window.location.search.includes('mwh=intel')) {
        setTimeout(() => {
            createIntelligenceDisplayPage();
        }, 500);
    }
    
    // Check if we need to update Head to Head stats
    if (window.location.pathname.includes('warlogs.php')) {
        const scrapingState = GM_getValue('mwh_h2h_scraping', null);
        const updatePending = GM_getValue('mwh_h2h_update_pending', false);
        const lastDebug = GM_getValue('mwh_h2h_last_debug', null);
        
        // Show last debug info if available
        if (lastDebug) {
            try {
                const debug = JSON.parse(lastDebug);
                console.log('=== LAST DEBUG INFO ===', debug);
            } catch (e) {
                console.log('Last debug info:', lastDebug);
            }
        }
        
        if (updatePending || scrapingState) {
            console.log('H2H scraping state:', scrapingState ? 'Active' : 'None', 'Update pending:', updatePending);
            // Wait for page to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        updateHeadToHeadStats();
                    }, 2000); // Extra wait for dynamic content
                });
            } else {
                setTimeout(() => {
                    updateHeadToHeadStats();
                }, 2000); // Wait for page to fully load
            }
        }
    }
    
    // Create Head to Head stats display page (works on any page with mwh=h2h parameter)
    if (window.location.search.includes('mwh=h2h')) {
        setTimeout(() => {
            createHeadToHeadStatsPage();
        }, 500);
    }
    
    // Add Legends overlays when on legends page
    if (window.location.pathname.includes('legends3.php')) {
        setTimeout(() => {
            if (isFeatureEnabled('legendsTimer')) {
                createLegendsOverlays();
            }
        }, 1000);
    }

})();

