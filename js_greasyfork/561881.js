// ==UserScript==
// @name         MrA's Stat Gains Modeler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Model stat gains in Torn with Training Forecast, Happy Jump, and SE Effectiveness calculators
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561881/MrA%27s%20Stat%20Gains%20Modeler.user.js
// @updateURL https://update.greasyfork.org/scripts/561881/MrA%27s%20Stat%20Gains%20Modeler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State
    let currentTab = 'single';
    let isHidden = false;
    let stats = {
        strength: 0,
        defense: 0,
        speed: 0,
        dexterity: 0
    };
    let steadfast = {
        strength: 0,
        defense: 0,
        speed: 0,
        dexterity: 0
    };
    let propertyPerks = {
        strength: 0,
        defense: 0,
        speed: 0,
        dexterity: 0
    };
    let education = {
        strength: 0,
        defense: 0,
        speed: 0,
        dexterity: 0
    };
    let jobPerks = {
        strength: 0,
        defense: 0,
        speed: 0,
        dexterity: 0
    };
    let onePercentEdu = false;
    let happy = 0;
    let topGym = {
        strength: '[H] George\'s',
        defense: '[H] George\'s',
        speed: '[H] George\'s',
        dexterity: '[H] George\'s'
    };
    let singleTrainEnergy = 50;
    
    // Training Forecast state
    let trainingForecast = {
        xanPerDay: 3.5,
        refill: false,
        rehabDays: 1,
        hoursSleep: 8.0,
        isDonator: true,
        overdoseReduction: 0,
        boosterType: 'None',
        boosterCount: 0,
        rows: [
            { days: 1, strength: 0, defense: 0, speed: 0, dexterity: 0 },
            { days: 2, strength: 0, defense: 0, speed: 0, dexterity: 0 },
            { days: 7, strength: 0, defense: 0, speed: 0, dexterity: 0 },
            { days: 28, strength: 0, defense: 0, speed: 0, dexterity: 0 },
            { days: 180, strength: 0, defense: 0, speed: 0, dexterity: 0 },
            { days: 365, strength: 0, defense: 0, speed: 0, dexterity: 0 }
        ]
    };

    // Load saved data
    function loadData() {
        const saved = localStorage.getItem('torn_stat_gains_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                stats = { ...stats, ...data.stats };
                steadfast = { ...steadfast, ...data.steadfast };
                propertyPerks = { ...propertyPerks, ...(data.propertyPerks || {}) };
                education = { ...education, ...data.education };
                jobPerks = { ...jobPerks, ...(data.jobPerks || {}) };
                if (data.onePercentEdu !== undefined) onePercentEdu = data.onePercentEdu;
                if (data.happy !== undefined) happy = typeof data.happy === 'number' ? data.happy : 0;
                if (data.topGym) topGym = { ...topGym, ...data.topGym };
                if (data.singleTrainEnergy !== undefined) singleTrainEnergy = typeof data.singleTrainEnergy === 'number' ? data.singleTrainEnergy : 50;
                if (data.trainingForecast) {
                    trainingForecast = { ...trainingForecast, ...data.trainingForecast };
                    // Ensure rows array exists and has 6 items
                    if (!trainingForecast.rows || trainingForecast.rows.length !== 6) {
                        trainingForecast.rows = [
                            { days: 1, strength: 0, defense: 0, speed: 0, dexterity: 0 },
                            { days: 2, strength: 0, defense: 0, speed: 0, dexterity: 0 },
                            { days: 7, strength: 0, defense: 0, speed: 0, dexterity: 0 },
                            { days: 28, strength: 0, defense: 0, speed: 0, dexterity: 0 },
                            { days: 180, strength: 0, defense: 0, speed: 0, dexterity: 0 },
                            { days: 365, strength: 0, defense: 0, speed: 0, dexterity: 0 }
                        ];
                    }
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
        const hiddenState = localStorage.getItem('torn_stat_gains_hidden');
        if (hiddenState === 'true') {
            isHidden = true;
        }
    }

    // Save data
    function saveData() {
        const data = {
            stats,
            steadfast,
            propertyPerks,
            education,
            jobPerks,
            onePercentEdu,
            happy,
            topGym,
            singleTrainEnergy,
            trainingForecast
        };
        localStorage.setItem('torn_stat_gains_data', JSON.stringify(data));
    }

    // Format number with commas
    function formatNumber(num) {
        if (num === 0 || num === '' || num === null || num === undefined) return '';
        return parseInt(num).toLocaleString('en-US');
    }

    // Parse number from formatted string (removes commas)
    function parseFormattedNumber(str) {
        if (!str || str === '') return 0;
        // Remove all commas and parse
        const cleaned = str.replace(/,/g, '');
        return parseFloat(cleaned) || 0;
    }

    // Gym data: energy per train and stat-specific dots
    const GYM_DATA = {
        '[L] Premier Fitness': { energyPerTrain: 5, dots: { 'Strength': 2, 'Speed': 2, 'Defense': 2, 'Dexterity': 2 } },
        '[L] Average Joes': { energyPerTrain: 5, dots: { 'Strength': 2.4, 'Speed': 2.4, 'Defense': 2.8, 'Dexterity': 2.4 } },
        '[L] Woody\'s Workout': { energyPerTrain: 5, dots: { 'Strength': 2.8, 'Speed': 3.2, 'Defense': 3, 'Dexterity': 2.8 } },
        '[L] Beach Bods': { energyPerTrain: 5, dots: { 'Strength': 3.2, 'Speed': 3.2, 'Defense': 3.2, 'Dexterity': null } },
        '[L] Silver Gym': { energyPerTrain: 5, dots: { 'Strength': 3.4, 'Speed': 3.6, 'Defense': 3.4, 'Dexterity': 3.2 } },
        '[L] Pour Femme': { energyPerTrain: 5, dots: { 'Strength': 3.4, 'Speed': 3.6, 'Defense': 3.6, 'Dexterity': 3.8 } },
        '[L] Davies Den': { energyPerTrain: 5, dots: { 'Strength': 3.7, 'Speed': null, 'Defense': 3.7, 'Dexterity': 3.7 } },
        '[L] Global Gym': { energyPerTrain: 5, dots: { 'Strength': 4, 'Speed': 4, 'Defense': 4, 'Dexterity': 4 } },
        '[M] Knuckle Heads': { energyPerTrain: 10, dots: { 'Strength': 4.8, 'Speed': 4.4, 'Defense': 4, 'Dexterity': 4.2 } },
        '[M] Pioneer Fitness': { energyPerTrain: 10, dots: { 'Strength': 4.4, 'Speed': 4.6, 'Defense': 4.8, 'Dexterity': 4.4 } },
        '[M] Anabolic Anomalies': { energyPerTrain: 10, dots: { 'Strength': 5, 'Speed': 4.6, 'Defense': 5.2, 'Dexterity': 4.6 } },
        '[M] Core': { energyPerTrain: 10, dots: { 'Strength': 5, 'Speed': 5.2, 'Defense': 5, 'Dexterity': 5 } },
        '[M] Racing Fitness': { energyPerTrain: 10, dots: { 'Strength': 5, 'Speed': 5.4, 'Defense': 4.8, 'Dexterity': 5.2 } },
        '[M] Complete Cardio': { energyPerTrain: 10, dots: { 'Strength': 5.5, 'Speed': 5.8, 'Defense': 5.5, 'Dexterity': 5.2 } },
        '[M] Legs, Bums and Tums': { energyPerTrain: 10, dots: { 'Strength': null, 'Speed': 5.6, 'Defense': 5.6, 'Dexterity': 5.8 } },
        '[M] Deep Burn': { energyPerTrain: 10, dots: { 'Strength': 6, 'Speed': 6, 'Defense': 6, 'Dexterity': 6 } },
        '[H] Apollo Gym': { energyPerTrain: 10, dots: { 'Strength': 6, 'Speed': 6.2, 'Defense': 6.4, 'Dexterity': 6.2 } },
        '[H] Gun Shop': { energyPerTrain: 10, dots: { 'Strength': 6.6, 'Speed': 6.4, 'Defense': 6.2, 'Dexterity': 6.2 } },
        '[H] Force Training': { energyPerTrain: 10, dots: { 'Strength': 6.4, 'Speed': 6.6, 'Defense': 6.4, 'Dexterity': 6.8 } },
        '[H] Cha Cha\'s': { energyPerTrain: 10, dots: { 'Strength': 6.4, 'Speed': 6.4, 'Defense': 6.8, 'Dexterity': 7 } },
        '[H] Atlas': { energyPerTrain: 10, dots: { 'Strength': 7, 'Speed': 6.4, 'Defense': 6.4, 'Dexterity': 6.6 } },
        '[H] Last Round': { energyPerTrain: 10, dots: { 'Strength': 6.8, 'Speed': 6.6, 'Defense': 7, 'Dexterity': 6.6 } },
        '[H] The Edge': { energyPerTrain: 10, dots: { 'Strength': 6.8, 'Speed': 7, 'Defense': 7, 'Dexterity': 6.8 } },
        '[H] George\'s': { energyPerTrain: 10, dots: { 'Strength': 7.3, 'Speed': 7.3, 'Defense': 7.3, 'Dexterity': 7.3 } },
        '[S] Balboas Gym': { energyPerTrain: 25, dots: { 'Strength': null, 'Speed': null, 'Defense': 7.5, 'Dexterity': 7.5 } },
        '[S] Frontline Fitness': { energyPerTrain: 25, dots: { 'Strength': 7.5, 'Speed': 7.5, 'Defense': null, 'Dexterity': null } },
        '[S] Gym 3000': { energyPerTrain: 50, dots: { 'Strength': 8, 'Speed': null, 'Defense': null, 'Dexterity': null } },
        '[S] Mr. Isoyamas': { energyPerTrain: 50, dots: { 'Strength': null, 'Speed': null, 'Defense': 8, 'Dexterity': null } },
        '[S] Total Rebound': { energyPerTrain: 50, dots: { 'Strength': null, 'Speed': 8, 'Defense': null, 'Dexterity': null } },
        '[S] Elites': { energyPerTrain: 50, dots: { 'Strength': null, 'Speed': null, 'Defense': null, 'Dexterity': 8 } },
        '[S] Sports Science Lab': { energyPerTrain: 25, dots: { 'Strength': 9, 'Speed': 9, 'Defense': 9, 'Dexterity': 9 } }
    };

    // Stat-specific VLOOKUP values (from Sheet2!K1:N4)
    // Column 2, Column 3, and Column 4 values for each stat
    const STAT_VLOOKUP = {
        'Strength': { col2: 1600, col3: 1700, col4: 700 },
        'Defense': { col2: 2100, col3: -600, col4: 1500 },
        'Speed': { col2: 1600, col3: 2000, col4: 1350 },
        'Dexterity': { col2: 1800, col3: 1500, col4: 1000 }
    };

    /**
     * Calculate cap-adjusted stat value
     * IF(stat<50000000,stat,(stat-50000000)/(8.77635*LOG(stat))+50000000)
     */
    function getCapAdjustedStat(stat) {
        if (stat < 50000000) {
            return stat;
        }
        return (stat - 50000000) / (8.77635 * Math.log10(stat)) + 50000000;
    }

    /**
     * Calculate Iterate sheet values for a given number of iterations
     * This implements the iterative calculation that accounts for happy reduction
     * 
     * @param {string} stat - Stat name ('Strength', 'Defense', 'Speed', 'Dexterity')
     * @param {number} initialStatTotal - Initial stat total (H3)
     * @param {number} initialHappy - Initial happy (G3)
     * @param {number} gymDots - Gym dots (C3)
     * @param {number} energyPerTrain - Energy per train (D3)
     * @param {number} bonusMultiplier - Bonus multiplier (K3)
     * @param {number} maxIterations - Maximum number of iterations to calculate (default 250)
     * @returns {Array} Array of iteration results, each with { iteration, minStat, maxStat, minHappy, maxHappy }
     */
    function calculateIterateSheet(stat, initialStatTotal, initialHappy, gymDots, energyPerTrain, bonusMultiplier, maxIterations = 250) {
        const statLookup = STAT_VLOOKUP[stat] || { col2: 0, col3: 0, col4: 0 };
        const results = [];

        // Helper function to calculate stat gain for one iteration
        function calculateStatGainForIteration(capAdjustedStat, currentHappy, subtractCol4) {
            // ROUND(1+0.07*ROUND(LN(1+currentHappy/250),4),4)
            const g3LnComponent = Math.round(Math.log(1 + currentHappy / 250) * 10000) / 10000;
            const g3Component = Math.round((1 + 0.07 * g3LnComponent) * 10000) / 10000;

            // Additional components: 8*currentHappy^1.05 + VLOOKUP col2*(1-(currentHappy/99999)^2) + VLOOKUP col3
            const additionalComponent = 
                8 * Math.pow(currentHappy, 1.05) +
                statLookup.col2 * (1 - Math.pow(currentHappy / 99999, 2)) +
                statLookup.col3;

            // Full calculation: (1/200000)*C3*D3*(K3)*(capAdjustedStat*g3Component + additionalComponent ± col4)
            // col4 should be inside the parentheses so it gets multiplied by the coefficient
            const col4Adjustment = subtractCol4 ? -statLookup.col4 : statLookup.col4;
            const baseGain = (1 / 200000) * gymDots * energyPerTrain * bonusMultiplier * 
                           (capAdjustedStat * g3Component + additionalComponent + col4Adjustment);
            
            return baseGain;
        }

        // Iteration 1 (row 2 in spreadsheet)
        // For iteration 1, we use the initial cap-adjusted stat (I3 in Sheet1)
        const initialCapAdjustedStat = getCapAdjustedStat(initialStatTotal);
        
        // B2: min gain (uses I3 and subtracts col4)
        let b = calculateStatGainForIteration(initialCapAdjustedStat, initialHappy, true);
        
        // C2: max gain (uses I3 and adds col4)
        let c = calculateStatGainForIteration(initialCapAdjustedStat, initialHappy, false);
        
        // D2: = Sheet1!H3 (initial stat total)
        let d = initialStatTotal;
        
        // E2: = Sheet1!H3 (initial stat total)
        let e = initialStatTotal;
        
        // F2: = Sheet1!G3 (initial happy)
        let f = initialHappy;
        
        // G2: cap-adjusted D (for use in next iteration's B calculation)
        let g = getCapAdjustedStat(d);
        
        // H2: cap-adjusted E (for use in next iteration's C calculation)
        let h = getCapAdjustedStat(e);
        
        // I2: = Sheet1!G3 (initial happy)
        let i = initialHappy;

        // Store iteration 1
        results.push({
            iteration: 1,
            minStat: d,
            maxStat: e,
            minHappy: f,
            maxHappy: i
        });

        // Iterations 2 through maxIterations
        for (let iteration = 2; iteration <= maxIterations; iteration++) {
            // First, add the gains from the previous iteration to D and E
            // D3 = D2 + B2 (adds previous iteration's B to D)
            d = d + b;
            
            // E3 = E2 + C2 (adds previous iteration's C to E)
            e = e + c;
            
            // Update G and H based on new D and E values
            // G3: Cap-adjusted D3
            g = getCapAdjustedStat(d);
            
            // H3: Cap-adjusted E3
            h = getCapAdjustedStat(e);
            
            // Update happy values
            // F3: IF(F2-0.6*D3<0,0,F2-0.6*D3) (reduces happy by 0.6*energyPerTrain)
            f = Math.max(0, f - 0.6 * energyPerTrain);
            
            // I3: IF(I2-0.4*D3<0,0,I2-0.4*D3) (reduces happy by 0.4*energyPerTrain)
            i = Math.max(0, i - 0.4 * energyPerTrain);
            
            // Then calculate new B and C for this iteration using updated G and H
            // B3: Uses G3 (cap-adjusted D3) and subtracts col4
            b = calculateStatGainForIteration(g, f, true);
            
            // C3: Uses H3 (cap-adjusted E3) and adds col4
            c = calculateStatGainForIteration(h, i, false);

            // Store iteration result
            results.push({
                iteration: iteration,
                minStat: d,
                maxStat: e,
                minHappy: f,
                maxHappy: i
            });
        }

        return results;
    }

    /**
     * Calculate stat gain based on spreadsheet formulas
     * 
     * @param {string} stat - Stat to train ('Strength', 'Defense', 'Speed', 'Dexterity')
     * @param {number} currentHappy - Current happy value (G3)
     * @param {number} energySpent - Total energy to be spent (J3)
     * @param {number} statTotal - Stat total for the stat being trained (H3)
     * @param {string} gym - Gym name (e.g., '[S] Mr. Isoyamas')
     * @param {object} perks - Perk bonuses object:
     *   - factionSteadfast: Faction Steadfast bonus (e.g., 0.12 for 12%)
     *   - propertyPerks: Property Perks bonus (e.g., 0.02 for 2%)
     *   - educationStatSpecific: Education (Stat Specific) bonus (e.g., 0.01 for 1%)
     *   - educationGeneral: Education (General) bonus (e.g., 0.01 for 1%)
     *   - jobPerks: Job Perks bonus (e.g., 0.00 for 0%)
     *   - bookPerks: Book Perks bonus (e.g., 0.00 for 0%)
     * @param {number} energyPerTrain - Energy per train (D3), optional - will use gym data if not provided
     * @param {function} iterateLookup - Optional function for Iterate sheet lookup: (numTrains) => { min: number, max: number }
     * @returns {object} Object with:
     *   - statGain: Predicted stat gain (P3 - average of N3 and O3)
     *   - statGainMin: Minimum stat gain (N3)
     *   - statGainMax: Maximum stat gain (O3)
     *   - numTrains: Number of trains (L3)
     *   - bonusMultiplier: Bonus multiplier (K3)
     */
    function calculateStatGain(stat, currentHappy, energySpent, statTotal, gym, perks, energyPerTrain = null, iterateLookup = null) {
        // Validate inputs
        if (!stat || !gym || !perks) {
            throw new Error('Missing required parameters');
        }

        // Get gym data
        const gymData = GYM_DATA[gym];
        if (!gymData) {
            throw new Error(`Gym "${gym}" not found in GYM_DATA`);
        }

        // Get stat-specific gym dots (C3)
        const gymDots = gymData.dots[stat];
        if (gymDots === null || gymDots === undefined) {
            throw new Error(`Gym "${gym}" does not train stat "${stat}"`);
        }

        // Get energy per train from gym data if not provided
        const energyPerTrainValue = energyPerTrain !== null ? energyPerTrain : gymData.energyPerTrain;

        // Calculate bonus multiplier (K3) = (1+F3)*(1+F4)*(1+F5)*(1+F6)*(1+F7)*(1+F8)
        const bonusMultiplier = 
            (1 + (perks.factionSteadfast || 0)) *
            (1 + (perks.propertyPerks || 0)) *
            (1 + (perks.educationStatSpecific || 0)) *
            (1 + (perks.educationGeneral || 0)) *
            (1 + (perks.jobPerks || 0)) *
            (1 + (perks.bookPerks || 0));

        // Calculate number of trains (L3) = INT(J3/D3)
        const numTrains = Math.floor(energySpent / energyPerTrainValue);

        // Get stat-specific VLOOKUP values
        const statLookup = STAT_VLOOKUP[stat] || { col2: 0, col3: 0 };

        // Calculate M3 formula components
        // M3 = (1/200000)*C3*D3*(K3)*(IF(H3<50000000,H3,(H3-50000000)/(8.77635*LOG(H3))+50000000)*ROUND(1+0.07*ROUND(LN(1+G3/250),4),4)+8*G3^1.05+VLOOKUP(B3,Sheet2!K1:M4,2,FALSE)*(1-(G3/99999)^2)+VLOOKUP(B3,Sheet2!K1:M4,3,FALSE))
        
        // H3 component: IF(H3<50000000,H3,(H3-50000000)/(8.77635*LOG(H3))+50000000)
        const h3Component = statTotal < 50000000 
            ? statTotal 
            : (statTotal - 50000000) / (8.77635 * Math.log10(statTotal)) + 50000000;

        // G3 component: ROUND(1+0.07*ROUND(LN(1+G3/250),4),4)
        const g3LnComponent = Math.round(Math.log(1 + currentHappy / 250) * 10000) / 10000;
        const g3Component = Math.round((1 + 0.07 * g3LnComponent) * 10000) / 10000;

        // Additional components: 8*G3^1.05 + VLOOKUP col2*(1-(G3/99999)^2) + VLOOKUP col3
        const additionalComponent = 
            8 * Math.pow(currentHappy, 1.05) +
            statLookup.col2 * (1 - Math.pow(currentHappy / 99999, 2)) +
            statLookup.col3;

        // Full M3 calculation
        // M3 = (1/200000)*C3*D3*(K3)*(h3Component*g3Component + additionalComponent)
        const m3 = (1 / 200000) * gymDots * energyPerTrainValue * bonusMultiplier * 
                   (h3Component * g3Component + additionalComponent);

        // Calculate N3 and O3 using Iterate sheet lookup
        // N3 = VLOOKUP($L$3+1,Iterate!$A$2:$G$251,4)-H3
        // O3 = VLOOKUP($L$3+1,Iterate!$A$2:$G$251,5)-H3
        let statGainMin, statGainMax;
        
        if (iterateLookup && typeof iterateLookup === 'function') {
            const iterateResult = iterateLookup(numTrains + 1);
            statGainMin = iterateResult.min - statTotal;
            statGainMax = iterateResult.max - statTotal;
        } else {
            // Calculate Iterate sheet values
            const iterateResults = calculateIterateSheet(
                stat,
                statTotal,
                currentHappy,
                gymDots,
                energyPerTrainValue,
                bonusMultiplier,
                Math.max(250, numTrains + 1) // Calculate enough iterations
            );
            
            // Get the result for iteration numTrains + 1 (L3+1)
            const targetIteration = numTrains + 1;
            const iterateResult = iterateResults.find(r => r.iteration === targetIteration);
            
            if (iterateResult) {
                // N3 = column D (minStat) - H3
                statGainMin = iterateResult.minStat - statTotal;
                // O3 = column E (maxStat) - H3
                statGainMax = iterateResult.maxStat - statTotal;
            } else {
                // Fallback if iteration not found (shouldn't happen, but safety check)
                statGainMin = m3 - statTotal;
                statGainMax = m3 - statTotal;
            }
        }

        // Calculate P3 = AVERAGE(N3:O3)
        const statGain = (statGainMin + statGainMax) / 2;

        return {
            statGain: statGain,
            statGainMin: statGainMin,
            statGainMax: statGainMax,
            numTrains: numTrains,
            bonusMultiplier: bonusMultiplier,
            m3Value: m3 // For debugging
        };
    }

    /**
     * Simplified wrapper function that uses the script's current state
     * 
     * @param {string} stat - Stat to train ('strength', 'defense', 'speed', 'dexterity')
     * @param {number} energySpent - Total energy to be spent
     * @param {function} iterateLookup - Optional function for Iterate sheet lookup
     * @param {number} statValue - Optional stat value to use instead of state value
     * @returns {object} Stat gain calculation result
     */
    function calculateStatGainFromState(stat, energySpent, iterateLookup = null, statValue = null) {
        // Map stat key to display name
        const statMap = {
            'strength': 'Strength',
            'defense': 'Defense',
            'speed': 'Speed',
            'dexterity': 'Dexterity'
        };
        const statName = statMap[stat] || stat;

        // Build perks object from state
        const perks = {
            factionSteadfast: (steadfast[stat] || 0) / 100, // Convert percentage to decimal
            propertyPerks: (propertyPerks[stat] || 0) / 100,
            educationStatSpecific: (education[stat] || 0) / 100,
            educationGeneral: onePercentEdu ? 0.01 : 0,
            jobPerks: (jobPerks[stat] || 0) / 100,
            bookPerks: 0 // TODO: Add book perks to state if needed
        };

        // Use provided statValue if given, otherwise use state value
        const statTotal = statValue !== null ? statValue : (stats[stat] || 0);

        return calculateStatGain(
            statName,
            happy,
            energySpent,
            statTotal,
            topGym[stat] || '[H] George\'s',
            perks,
            null, // Will use gym data automatically
            iterateLookup
        );
    }

    // Create input field (for grid cells)
    function createGridInput(value, onChange, placeholder = '0') {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value ? formatNumber(value) : '';
        input.placeholder = placeholder;
        input.style.cssText = `
            width: 100%;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        input.addEventListener('input', (e) => {
            // Parse the value (removes commas) and update the state
            const val = parseFormattedNumber(e.target.value);
            onChange(val);
            saveData();
        });
        input.addEventListener('blur', (e) => {
            // Format the display value when user finishes editing
            const val = parseFormattedNumber(e.target.value);
            e.target.value = val ? formatNumber(val) : '';
        });
        return input;
    }

    // Create tab button
    function createTabButton(text, tabKey, isActive) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            flex: 1;
            padding: 10px;
            background: ${isActive ? '#444' : '#2a2a2a'};
            color: ${isActive ? '#4CAF50' : '#aaa'};
            border: none;
            border-bottom: 2px solid ${isActive ? '#4CAF50' : 'transparent'};
            cursor: pointer;
            font-size: 13px;
            font-weight: ${isActive ? 'bold' : 'normal'};
            transition: all 0.2s;
        `;
        button.addEventListener('click', () => {
            switchTab(tabKey);
        });
        button.addEventListener('mouseenter', () => {
            if (!isActive) {
                button.style.background = '#333';
            }
        });
        button.addEventListener('mouseleave', () => {
            if (!isActive) {
                button.style.background = '#2a2a2a';
            }
        });
        return button;
    }

    // Switch tabs
    function switchTab(tabKey) {
        currentTab = tabKey;
        updateUI();
    }

    // Update single train results
    function updateSingleTrainResults() {
        const content = document.getElementById('single-train-content');
        if (!content) return;

        const resultsContainer = document.getElementById('single-train-results');
        if (!resultsContainer) return;

        const energy = singleTrainEnergy || 50;

        // Clear existing results
        resultsContainer.innerHTML = '';

        const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
        const statNames = {
            strength: 'Strength',
            defense: 'Defense',
            speed: 'Speed',
            dexterity: 'Dexterity'
        };

        // Create grid table similar to Basic Information section
        const gridTable = document.createElement('div');
        gridTable.style.cssText = `
            display: grid;
            grid-template-columns: 120px repeat(4, 1fr);
            gap: 8px;
            font-size: 12px;
        `;

        // Calculate all results first
        const results = {};
        const hasErrors = {};
        statKeys.forEach(stat => {
            try {
                results[stat] = calculateStatGainFromState(stat, energy);
                hasErrors[stat] = false;
            } catch (error) {
                console.error(`Error calculating ${stat}:`, error);
                hasErrors[stat] = error.message;
            }
        });

        // Helper function to create a cell
        function createCell(content, isLabel = false, isHeader = false) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                color: ${isHeader ? '#4CAF50' : (isLabel ? '#aaa' : '#ccc')};
                font-weight: ${isHeader || isLabel ? 'bold' : 'normal'};
                display: flex;
                align-items: center;
                ${isLabel ? '' : 'justify-content: center;'}
            `;
            if (typeof content === 'string') {
                cell.textContent = content;
            } else {
                cell.appendChild(content);
            }
            return cell;
        }

        // Header row
        const headerRow = document.createElement('div');
        headerRow.style.cssText = `display: contents;`;
        headerRow.appendChild(createCell('', false, false)); // Empty first cell
        statKeys.forEach(stat => {
            headerRow.appendChild(createCell(statNames[stat], false, true));
        });
        gridTable.appendChild(headerRow);

        // Average Gain row
        const avgRow = document.createElement('div');
        avgRow.style.cssText = `display: contents;`;
        avgRow.appendChild(createCell('Average Gain', true));
        statKeys.forEach(stat => {
            if (hasErrors[stat]) {
                avgRow.appendChild(createCell('—', false));
            } else {
                avgRow.appendChild(createCell(formatNumber(Math.round(results[stat].statGain)) || '0', false));
            }
        });
        gridTable.appendChild(avgRow);

        // Min row
        const minRow = document.createElement('div');
        minRow.style.cssText = `display: contents;`;
        minRow.appendChild(createCell('Min', true));
        statKeys.forEach(stat => {
            if (hasErrors[stat]) {
                minRow.appendChild(createCell('—', false));
            } else {
                minRow.appendChild(createCell(formatNumber(Math.round(results[stat].statGainMin)) || '0', false));
            }
        });
        gridTable.appendChild(minRow);

        // Max row
        const maxRow = document.createElement('div');
        maxRow.style.cssText = `display: contents;`;
        maxRow.appendChild(createCell('Max', true));
        statKeys.forEach(stat => {
            if (hasErrors[stat]) {
                maxRow.appendChild(createCell('—', false));
            } else {
                maxRow.appendChild(createCell(formatNumber(Math.round(results[stat].statGainMax)) || '0', false));
            }
        });
        gridTable.appendChild(maxRow);

        // Trains row
        const trainsRow = document.createElement('div');
        trainsRow.style.cssText = `display: contents;`;
        trainsRow.appendChild(createCell('Trains', true));
        statKeys.forEach(stat => {
            if (hasErrors[stat]) {
                trainsRow.appendChild(createCell('—', false));
            } else {
                trainsRow.appendChild(createCell(String(results[stat].numTrains), false));
            }
        });
        gridTable.appendChild(trainsRow);

        resultsContainer.appendChild(gridTable);

        // Show errors if any
        const errorKeys = Object.keys(hasErrors).filter(k => hasErrors[k]);
        if (errorKeys.length > 0) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                background: #2a1a1a;
                border-radius: 6px;
                border: 1px solid #552222;
                color: #ff6666;
                font-size: 12px;
            `;
            errorDiv.innerHTML = '<strong>Errors:</strong><br>' + 
                errorKeys.map(k => `${statNames[k]}: ${hasErrors[k]}`).join('<br>');
            resultsContainer.appendChild(errorDiv);
        }
    }

    // Create single train tab content
    function createSingleTrainTab() {
        const content = document.createElement('div');
        content.id = 'single-train-content';
        content.style.cssText = `
            padding: 15px;
            color: #ccc;
            font-size: 13px;
        `;

        // Energy input section
        const energySection = document.createElement('div');
        energySection.style.cssText = `
            margin-bottom: 20px;
            padding: 15px;
            background: #222;
            border-radius: 6px;
            border: 1px solid #333;
        `;

        const energyLabel = document.createElement('label');
        energyLabel.textContent = 'Energy to Spend:';
        energyLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            color: #4CAF50;
            font-weight: bold;
            font-size: 13px;
        `;
        energySection.appendChild(energyLabel);

        const energyInputContainer = document.createElement('div');
        energyInputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        const energyInput = document.createElement('input');
        energyInput.type = 'text';
        energyInput.value = singleTrainEnergy ? formatNumber(singleTrainEnergy) : '50';
        energyInput.placeholder = '50';
        energyInput.style.cssText = `
            flex: 1;
            padding: 8px 10px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 13px;
            box-sizing: border-box;
        `;
        energyInput.addEventListener('input', (e) => {
            const val = parseFormattedNumber(e.target.value);
            singleTrainEnergy = Math.max(0, val);
            updateSingleTrainResults();
            saveData();
        });
        energyInput.addEventListener('blur', (e) => {
            const val = parseFormattedNumber(e.target.value);
            singleTrainEnergy = Math.max(0, val || 50);
            e.target.value = singleTrainEnergy ? formatNumber(singleTrainEnergy) : '50';
            updateSingleTrainResults();
            saveData();
        });
        energyInputContainer.appendChild(energyInput);
        energySection.appendChild(energyInputContainer);

        content.appendChild(energySection);

        // Results section
        const resultsTitle = document.createElement('div');
        resultsTitle.textContent = 'Results:';
        resultsTitle.style.cssText = `
            font-weight: bold;
            color: #4CAF50;
            font-size: 14px;
            margin-bottom: 12px;
        `;
        content.appendChild(resultsTitle);

        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'single-train-results';
        resultsContainer.style.cssText = `
            margin-top: 10px;
        `;
        content.appendChild(resultsContainer);

        // Initial calculation
        updateSingleTrainResults();

        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #444;
            color: #888;
            font-size: 11px;
            text-align: center;
            line-height: 1.5;
        `;
        footer.innerHTML = `
            Developed by MrA (2646829), feedback welcome, as are FHCs or any other thanks.<br>
            Based on Formula and Spreadsheet Developed by Vladar (1996140)
        `;
        content.appendChild(footer);

        return content;
    }

    /**
     * Create Web Worker for training forecast calculations
     */
    function createTrainingForecastWorker() {
        // Serialize the data structures for the worker
        const gymDataStr = JSON.stringify(GYM_DATA);
        const statVlookupStr = JSON.stringify(STAT_VLOOKUP);
        
        const workerCode = 
            'const GYM_DATA = ' + gymDataStr + ';' +
            'const STAT_VLOOKUP = ' + statVlookupStr + ';' +
            'function getCapAdjustedStat(stat) {' +
            '    if (stat < 50000000) {' +
            '        return stat;' +
            '    }' +
            '    return (stat - 50000000) / (8.77635 * Math.log10(stat)) + 50000000;' +
            '}' +
            'function calculateIterateSheet(stat, initialStatTotal, initialHappy, gymDots, energyPerTrain, bonusMultiplier, maxIterations) {' +
            '    if (maxIterations === undefined) maxIterations = 250;' +
            '    const statLookup = STAT_VLOOKUP[stat] || { col2: 0, col3: 0, col4: 0 };' +
            '    function calculateStatGainForIteration(capAdjustedStat, currentHappy, subtractCol4) {' +
            '        const g3LnComponent = Math.round(Math.log(1 + currentHappy / 250) * 10000) / 10000;' +
            '        const g3Component = Math.round((1 + 0.07 * g3LnComponent) * 10000) / 10000;' +
            '        const additionalComponent = 8 * Math.pow(currentHappy, 1.05) + statLookup.col2 * (1 - Math.pow(currentHappy / 99999, 2)) + statLookup.col3;' +
            '        const col4Adjustment = subtractCol4 ? -statLookup.col4 : statLookup.col4;' +
            '        const baseGain = (1 / 200000) * gymDots * energyPerTrain * bonusMultiplier * (capAdjustedStat * g3Component + additionalComponent + col4Adjustment);' +
            '        return baseGain;' +
            '    }' +
            '    const initialCapAdjustedStat = getCapAdjustedStat(initialStatTotal);' +
            '    let b = calculateStatGainForIteration(initialCapAdjustedStat, initialHappy, true);' +
            '    let c = calculateStatGainForIteration(initialCapAdjustedStat, initialHappy, false);' +
            '    let d = initialStatTotal;' +
            '    let e = initialStatTotal;' +
            '    let f = initialHappy;' +
            '    let g = getCapAdjustedStat(d);' +
            '    let h = getCapAdjustedStat(e);' +
            '    let i = initialHappy;' +
            '    const results = [{ iteration: 1, minStat: d, maxStat: e, minHappy: f, maxHappy: i }];' +
            '    for (let iteration = 2; iteration <= maxIterations; iteration++) {' +
            '        d = d + b;' +
            '        e = e + c;' +
            '        g = getCapAdjustedStat(d);' +
            '        h = getCapAdjustedStat(e);' +
            '        f = Math.max(0, f - 0.6 * energyPerTrain);' +
            '        i = Math.max(0, i - 0.4 * energyPerTrain);' +
            '        b = calculateStatGainForIteration(g, f, true);' +
            '        c = calculateStatGainForIteration(h, i, false);' +
            '        results.push({ iteration: iteration, minStat: d, maxStat: e, minHappy: f, maxHappy: i });' +
            '    }' +
            '    return results;' +
            '}' +
            'function calculateStatGain(stat, currentHappy, energySpent, statTotal, gym, perks, energyPerTrain, iterateLookup) {' +
            '    const gymData = GYM_DATA[gym];' +
            '    if (!gymData) throw new Error("Gym not found: " + gym);' +
            '    const gymDots = gymData.dots[stat];' +
            '    if (gymDots === null || gymDots === undefined) throw new Error("Gym does not train stat: " + stat);' +
            '    const energyPerTrainValue = energyPerTrain !== null ? energyPerTrain : gymData.energyPerTrain;' +
            '    const bonusMultiplier = (1 + (perks.factionSteadfast || 0)) * (1 + (perks.propertyPerks || 0)) * (1 + (perks.educationStatSpecific || 0)) * (1 + (perks.educationGeneral || 0)) * (1 + (perks.jobPerks || 0)) * (1 + (perks.bookPerks || 0));' +
            '    const numTrains = Math.floor(energySpent / energyPerTrainValue);' +
            '    const statLookup = STAT_VLOOKUP[stat] || { col2: 0, col3: 0 };' +
            '    const h3Component = statTotal < 50000000 ? statTotal : (statTotal - 50000000) / (8.77635 * Math.log10(statTotal)) + 50000000;' +
            '    const g3LnComponent = Math.round(Math.log(1 + currentHappy / 250) * 10000) / 10000;' +
            '    const g3Component = Math.round((1 + 0.07 * g3LnComponent) * 10000) / 10000;' +
            '    const additionalComponent = 8 * Math.pow(currentHappy, 1.05) + statLookup.col2 * (1 - Math.pow(currentHappy / 99999, 2)) + statLookup.col3;' +
            '    let statGainMin, statGainMax, endHappy;' +
            '    if (iterateLookup && typeof iterateLookup === "function") {' +
            '        const iterateResult = iterateLookup(numTrains + 1);' +
            '        statGainMin = iterateResult.min - statTotal;' +
            '        statGainMax = iterateResult.max - statTotal;' +
            '        endHappy = Math.max(0, currentHappy - (numTrains * energyPerTrainValue * 0.5));' +
            '    } else {' +
            '        const iterateResults = calculateIterateSheet(stat, statTotal, currentHappy, gymDots, energyPerTrainValue, bonusMultiplier, Math.max(250, numTrains + 1));' +
            '        const targetIteration = numTrains + 1;' +
            '        const iterateResult = iterateResults.find(function(r) { return r.iteration === targetIteration; });' +
            '        if (iterateResult) {' +
            '            statGainMin = iterateResult.minStat - statTotal;' +
            '            statGainMax = iterateResult.maxStat - statTotal;' +
            '            endHappy = (iterateResult.minHappy + iterateResult.maxHappy) / 2;' +
            '        } else {' +
            '            const m3 = (1 / 200000) * gymDots * energyPerTrainValue * bonusMultiplier * (h3Component * g3Component + additionalComponent);' +
            '            statGainMin = m3 - statTotal;' +
            '            statGainMax = m3 - statTotal;' +
            '            endHappy = Math.max(0, currentHappy - (numTrains * energyPerTrainValue * 0.5));' +
            '        }' +
            '    }' +
            '    const statGain = (statGainMin + statGainMax) / 2;' +
            '    return { statGain: statGain, statGainMin: statGainMin, statGainMax: statGainMax, numTrains: numTrains, bonusMultiplier: bonusMultiplier, endHappy: endHappy };' +
            '}' +
            'function stochasticRound(num) {' +
            '    var floor = Math.floor(num);' +
            '    var decimal = num - floor;' +
            '    return Math.random() < decimal ? Math.ceil(num) : floor;' +
            '}' +
            'function calculateTrainingForecastWorker(statKey, params) {' +
            '    var initialStat = params.initialStat;' +
            '    var maxDays = params.maxDays;' +
            '    var isDonator = params.isDonator;' +
            '    var refill = params.refill;' +
            '    var gymName = params.gymName;' +
            '    var energyPerTrain = params.energyPerTrain;' +
            '    var maxHappy = params.happy;' +
            '    var rehabDays = params.rehabDays || 1;' +
            '    var perks = params.perks;' +
            '    var rows = params.rows;' +
            '    var hoursSleep = params.hoursSleep || 0;' +
            '    var xanPerDay = params.xanPerDay || 0;' +
            '    var overdoseReduction = params.overdoseReduction || 0;' +
            '    var boosterType = params.boosterType || "None";' +
            '    var boosterCount = params.boosterCount || 0;' +
            '    var boosterEnergy = 0;' +
            '    if (boosterType.startsWith("Can - ")) {' +
            '       var energyStr = boosterType.replace("Can - ", "").replace("e", "");' +
            '       boosterEnergy = parseFloat(energyStr) || 0;' +
            '    } else if (boosterType === "FHC") {' +
            '       boosterEnergy = 150;' +
            '    }' +
            '    var statMap = { "strength": "Strength", "defense": "Defense", "speed": "Speed", "dexterity": "Dexterity" };' +
            '    var statName = statMap[statKey] || statKey;' +
            '    var currentStat = initialStat;' +
            '    var currentHappy = maxHappy;' +
            '    var maxHours = maxDays * 24;' +
            '    var maxRegenEnergy = isDonator ? 150 : 100;' +
            '    var currentEnergy = maxRegenEnergy;' +
            '    var results = {};' +
            '    for (var i = 0; i < rows.length; i++) {' +
            '        results[rows[i].days] = null;' +
            '    }' +
            '    var YIELD_INTERVAL = 100;' +
            '    var lastYieldHour = 0;' +
            '    var nextXanaxHour = 0;' +
            '    var xanaxBlockedUntil = -1;' +
            '    var xanaxInterval = xanPerDay > 0 ? 24 / xanPerDay : 0;' +
            '    var baseFailChance = 0.03;' +
            '    var minFailChance = 0.02;' +
            '    var maxOverdoseReduction = 30;' +
            '    var overdoseReductionClamped = Math.min(maxOverdoseReduction, Math.max(0, overdoseReduction));' +
            '    var xanaxFailChance = baseFailChance - ((baseFailChance - minFailChance) * (overdoseReductionClamped / maxOverdoseReduction));' +
            '    for (var hour = 0; hour < maxHours; hour++) {' +
            '        if (hour > 0) {' +
            '            var energyRegen = isDonator ? 30 : 20;' +
            '            currentEnergy = Math.min(maxRegenEnergy, currentEnergy + energyRegen);' +
            '        }' +
            '        ' +
            '        if (hour % (24 * rehabDays) === 0) {' +
            '            currentHappy = maxHappy;' +
            '        } else {' +
            '            currentHappy += 20;' +
            '            if (currentHappy > maxHappy) currentHappy = maxHappy;' +
            '        }' +
            '        ' +
            '        var hourInDay = hour % 24;' +
            '        var sleepStartHour = 24 - hoursSleep;' +
            '        var isAsleep = hourInDay >= sleepStartHour;' +
            '        if (hour % 24 === 0) {' +
            '            if (boosterType === "FHC" && boosterCount > 0) {' +
            '                var fhcEnergy = 150;' +
            '                var fhcHappyBoost = 500;' +
            '                for (var b = 0; b < boosterCount; b++) {' +
            '                    currentHappy += fhcHappyBoost;' +
            '                    currentEnergy += fhcEnergy;' +
            '                    if (currentEnergy >= energyPerTrain) {' +
            '                        try {' +
            '                            var numTrains = Math.floor(currentEnergy / energyPerTrain);' +
            '                            var energyToSpend = numTrains * energyPerTrain;' +
            '                            var result = calculateStatGain(statName, currentHappy, energyToSpend, currentStat, gymName, perks, energyPerTrain, null);' +
            '                            currentStat += result.statGain;' +
            '                            currentHappy = result.endHappy;' +
            '                            currentEnergy -= energyToSpend;' +
            '                        } catch (e) {' +
            '                             console.error("Error training FHC " + statKey + " at hour " + hour + ":", e);' +
            '                        }' +
            '                    }' +
            '                }' +
            '            }' +
            '            if (boosterType === "SE" && boosterCount > 0) {' +
            '                for (var s = 0; s < boosterCount; s++) {' +
            '                    currentStat = currentStat * 1.01;' +
            '                }' +
            '            }' +
            '            if (boosterEnergy > 0 && boosterCount > 0) {' +
            '                try {' +
            '                    var totalBoosterEnergy = boosterEnergy * boosterCount;' +
            '                    var roundedBoosterEnergy = stochasticRound(totalBoosterEnergy);' +
            '                    currentEnergy += roundedBoosterEnergy;' +
            '                } catch (e) {' +
            '                     console.error("Error adding can energy " + statKey + " at hour " + hour + ":", e);' +
            '                }' +
            '            }' +
            '        }' +
            '        if (xanPerDay > 0 && hour >= nextXanaxHour && hour > xanaxBlockedUntil) {' +
            '            var xanaxRoll = Math.random();' +
            '            if (xanaxRoll < xanaxFailChance) {' +
            '                xanaxBlockedUntil = hour + 24;' +
            '                nextXanaxHour = hour + stochasticRound(xanaxInterval);' +
            '            } else {' +
            '                try {' +
            '                    var xanaxResult = calculateStatGain(statName, currentHappy, 250, currentStat, gymName, perks, energyPerTrain, null);' +
            '                    currentStat += xanaxResult.statGain;' +
            '                    currentHappy = xanaxResult.endHappy;' +
            '                    nextXanaxHour = hour + stochasticRound(xanaxInterval);' +
            '                } catch (e) {' +
            '                    console.error("Error training with xanax " + statKey + " at hour " + hour + ":", e);' +
            '                    nextXanaxHour = hour + stochasticRound(xanaxInterval);' +
            '                }' +
            '            }' +
            '        }' +
            '        if (hour % 24 === 0 && refill && !isAsleep) {' +
            '            try {' +
            '                var result = calculateStatGain(statName, currentHappy, maxRegenEnergy, currentStat, gymName, perks, energyPerTrain, null);' +
            '                currentStat += result.statGain;' +
            '                currentHappy = result.endHappy;' +
            '            } catch (e) {' +
            '                console.error("Error training " + statKey + " at hour " + hour + ":", e);' +
            '            }' +
            '        }' +
            '        if (currentEnergy >= energyPerTrain && !isAsleep) {' +
            '            try {' +
            '                var numTrains = Math.floor(currentEnergy / energyPerTrain);' +
            '                var energyToSpend = numTrains * energyPerTrain;' +
            '                var result = calculateStatGain(statName, currentHappy, energyToSpend, currentStat, gymName, perks, energyPerTrain, null);' +
            '                currentStat += result.statGain;' +
            '                currentHappy = result.endHappy;' +
            '                currentEnergy -= energyToSpend;' +
            '            } catch (e) {' +
            '                console.error("Error training " + statKey + " at hour " + hour + " with currentEnergy:", e);' +
            '            }' +
            '        }' +
            '        for (var j = 0; j < rows.length; j++) {' +
            '            var rowDays = rows[j].days || 0;' +
            '            var rowHours = rowDays * 24;' +
            '            if (rowDays > 0 && rowHours > 0 && hour === rowHours - 1) {' +
            '                results[rowDays] = Math.round(currentStat);' +
            '            }' +
            '        }' +
            '        if (hour - lastYieldHour >= YIELD_INTERVAL) {' +
            '            lastYieldHour = hour;' +
            '            postMessage({ type: "progress", statKey: statKey, hour: hour, maxHours: maxHours, currentStat: currentStat });' +
            '        }' +
            '    }' +
            '    return results;' +
            '}' +
            'self.onmessage = function(e) {' +
            '    var type = e.data.type;' +
            '    var data = e.data.data;' +
            '    if (type === "calculate") {' +
            '        try {' +
            '            var results = calculateTrainingForecastWorker(data.statKey, data.params);' +
            '            postMessage({ type: "result", statKey: data.statKey, results: results });' +
            '        } catch (error) {' +
            '            postMessage({ type: "error", statKey: data.statKey, error: error.message });' +
            '        }' +
            '    }' +
            '};';
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    }
    /**
     * Calculate training forecast using Web Worker
     * 
     * @param {string} statKey - Stat to calculate ('strength', 'defense', 'speed', 'dexterity')
     * @returns {Promise<Object>}
     */
    function calculateTrainingForecast(statKey) {
        return new Promise((resolve, reject) => {
            const worker = createTrainingForecastWorker();
            
            const statMap = {
                'strength': 'Strength',
                'defense': 'Defense',
                'speed': 'Speed',
                'dexterity': 'Dexterity'
            };
            
            // Build perks object from state
            const perks = {
                factionSteadfast: (steadfast[statKey] || 0) / 100,
                propertyPerks: (propertyPerks[statKey] || 0) / 100,
                educationStatSpecific: (education[statKey] || 0) / 100,
                educationGeneral: onePercentEdu ? 0.01 : 0,
                jobPerks: (jobPerks[statKey] || 0) / 100,
                bookPerks: 0
            };
            
            const gymName = topGym[statKey] || '[H] George\'s';
            const gymData = GYM_DATA[gymName];
            if (!gymData) {
                worker.terminate();
                reject(new Error(`Gym "${gymName}" not found for stat "${statKey}"`));
                return;
            }
            
            const maxDays = trainingForecast.rows[5].days || 365;
            
            worker.onmessage = (e) => {
                const { type, statKey: msgStatKey, results, error, hour, maxHours, currentStat } = e.data;
                
                if (type === 'progress') {
                    // Update progress if needed (optional)
                    // Could show a progress bar here
                } else if (type === 'result') {
                    // Update the trainingForecast.rows with results
                    trainingForecast.rows.forEach((row) => {
                        if (results[row.days] !== null && results[row.days] !== undefined) {
                            row[statKey] = results[row.days];
                        }
                    });
                    worker.terminate();
                    resolve(results);
                } else if (type === 'error') {
                    worker.terminate();
                    reject(new Error(error));
                }
            };
            
            worker.onerror = (error) => {
                worker.terminate();
                reject(error);
            };
            
            // Send calculation request
            worker.postMessage({
                type: 'calculate',
                data: {
                    statKey: statKey,
                    params: {
                        initialStat: stats[statKey] || 0,
                        maxDays: maxDays,
                        rehabDays: trainingForecast.rehabDays || 1,
                        isDonator: trainingForecast.isDonator,
                        refill: trainingForecast.refill,
                        hoursSleep: trainingForecast.hoursSleep || 0,
                        xanPerDay: trainingForecast.xanPerDay || 0,
                        overdoseReduction: trainingForecast.overdoseReduction || 0,
                        boosterType: trainingForecast.boosterType || 'None',
                        boosterCount: trainingForecast.boosterCount || 0,
                        gymName: gymName,
                        energyPerTrain: gymData.energyPerTrain,
                        happy: happy,
                        perks: perks,
                        rows: trainingForecast.rows.map(r => ({ days: r.days }))
                    }
                }
            });
        });
    }

    /**
     * Calculate training forecast for all rows
     */
    async function calculateAllTrainingForecasts() {
        const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
        
        // Clear all rows first
        trainingForecast.rows.forEach((row) => {
            statKeys.forEach(statKey => {
                row[statKey] = 0;
            });
        });

        // Update UI to show cleared values
        updateTrainingForecastTable();

        // Calculate all stats in parallel using workers
        try {
            await Promise.all(statKeys.map(statKey => calculateTrainingForecast(statKey)));
            
            // Update the UI after all calculations complete
            updateTrainingForecastTable();
        } catch (error) {
            console.error('Error calculating forecasts:', error);
            throw error;
        }

        // Save after all calculations complete
        saveData();
    }

    /**
     * Update the training forecast table with calculated values
     */
    function updateTrainingForecastTable() {
        const content = document.getElementById('training-forecast-content');
        if (!content) return;

        const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
        
        trainingForecast.rows.forEach((row, rowIndex) => {
            statKeys.forEach(statKey => {
                // Find the input field for this row and stat
                const input = content.querySelector(`input[data-row="${rowIndex}"][data-stat="${statKey}"]`);
                if (input) {
                    const val = row[statKey] || 0;
                    input.value = val ? formatNumber(val) : '';
                }
            });
        });
    }

    // Create training forecast tab content
    function createTrainingForecastTab() {
        const content = document.createElement('div');
        content.id = 'training-forecast-content';
        content.style.cssText = `
            padding: 15px;
            color: #ccc;
            font-size: 13px;
        `;

        // Top section with Xan per day, Refill, Hours sleep
        const topSection = document.createElement('div');
        topSection.style.cssText = `
            margin-bottom: 20px;
            padding: 15px;
            background: #222;
            border-radius: 6px;
            border: 1px solid #333;
            display: flex;
            gap: 20px;
            align-items: center;
            flex-wrap: wrap;
        `;

        // Xan per day input
        const xanContainer = document.createElement('div');
        xanContainer.style.cssText = `display: flex; align-items: center; gap: 8px;`;
        const xanLabel = document.createElement('label');
        xanLabel.textContent = 'Xan per day:';
        xanLabel.style.cssText = `color: #aaa; font-size: 12px; font-weight: bold; white-space: nowrap;`;
        const xanInput = document.createElement('input');
        xanInput.type = 'number';
        xanInput.step = '0.1';
        xanInput.value = trainingForecast.xanPerDay || 3.5;
        xanInput.style.cssText = `
            width: 80px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        xanInput.addEventListener('input', (e) => {
            trainingForecast.xanPerDay = parseFloat(e.target.value) || 0;
            saveData();
        });
        xanContainer.appendChild(xanLabel);
        xanContainer.appendChild(xanInput);

        // Donator checkbox
        const donatorContainer = document.createElement('div');
        donatorContainer.style.cssText = `display: flex; align-items: center; gap: 6px;`;
        const donatorCheckbox = document.createElement('input');
        donatorCheckbox.type = 'checkbox';
        donatorCheckbox.id = 'training-forecast-donator';
        donatorCheckbox.checked = trainingForecast.isDonator || false;
        donatorCheckbox.style.cssText = `width: 16px; height: 16px; cursor: pointer;`;
        donatorCheckbox.addEventListener('change', (e) => {
            trainingForecast.isDonator = e.target.checked;
            saveData();
        });
        const donatorLabel = document.createElement('label');
        donatorLabel.htmlFor = 'training-forecast-donator';
        donatorLabel.textContent = 'Donator';
        donatorLabel.style.cssText = `color: #aaa; font-size: 12px; cursor: pointer; user-select: none;`;
        donatorContainer.appendChild(donatorCheckbox);
        donatorContainer.appendChild(donatorLabel);

        // Refill checkbox
        const refillContainer = document.createElement('div');
        refillContainer.style.cssText = `display: flex; align-items: center; gap: 6px;`;
        const refillCheckbox = document.createElement('input');
        refillCheckbox.type = 'checkbox';
        refillCheckbox.id = 'training-forecast-refill';
        refillCheckbox.checked = trainingForecast.refill || false;
        refillCheckbox.style.cssText = `width: 16px; height: 16px; cursor: pointer;`;
        refillCheckbox.addEventListener('change', (e) => {
            trainingForecast.refill = e.target.checked;
            saveData();
        });
        const refillLabel = document.createElement('label');
        refillLabel.htmlFor = 'training-forecast-refill';
        refillLabel.textContent = 'Refill';
        refillLabel.style.cssText = `color: #aaa; font-size: 12px; cursor: pointer; user-select: none;`;
        refillContainer.appendChild(refillCheckbox);
        refillContainer.appendChild(refillLabel);

        // Hours sleep input
        const sleepContainer = document.createElement('div');
        sleepContainer.style.cssText = `display: flex; align-items: center; gap: 8px;`;
        const sleepLabel = document.createElement('label');
        sleepLabel.textContent = 'Hours sleep:';
        sleepLabel.style.cssText = `color: #aaa; font-size: 12px; font-weight: bold; white-space: nowrap;`;
        const sleepInput = document.createElement('input');
        sleepInput.type = 'number';
        sleepInput.step = '0.1';
        sleepInput.value = trainingForecast.hoursSleep || 8.0;
        sleepInput.style.cssText = `
            width: 80px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        sleepInput.addEventListener('input', (e) => {
            trainingForecast.hoursSleep = parseFloat(e.target.value) || 0;
            saveData();
        });
        sleepContainer.appendChild(sleepLabel);
        sleepContainer.appendChild(sleepInput);

        // Overdose reduction input
        const overdoseContainer = document.createElement('div');
        overdoseContainer.style.cssText = `display: flex; align-items: center; gap: 8px;`;
        const overdoseLabel = document.createElement('label');
        overdoseLabel.textContent = 'Overdose reduction %:';
        overdoseLabel.style.cssText = `color: #aaa; font-size: 12px; font-weight: bold; white-space: nowrap;`;
        const overdoseInput = document.createElement('input');
        overdoseInput.type = 'number';
        overdoseInput.step = '1';
        overdoseInput.min = '0';
        overdoseInput.max = '30';
        overdoseInput.value = trainingForecast.overdoseReduction || 0;
        overdoseInput.style.cssText = `
            width: 80px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        overdoseInput.addEventListener('input', (e) => {
            const val = Math.min(30, Math.max(0, parseFloat(e.target.value) || 0));
            trainingForecast.overdoseReduction = val;
            saveData();
        });
        overdoseContainer.appendChild(overdoseLabel);
        overdoseContainer.appendChild(overdoseInput);

        // Rehab days input
        const rehabContainer = document.createElement('div');
        rehabContainer.style.cssText = `display: flex; align-items: center; gap: 8px;`;
        const rehabLabel = document.createElement('label');
        rehabLabel.textContent = 'Rehab (days):';
        rehabLabel.style.cssText = `color: #aaa; font-size: 12px; font-weight: bold; white-space: nowrap;`;
        const rehabInput = document.createElement('input');
        rehabInput.type = 'number';
        rehabInput.step = '1';
        rehabInput.min = '1';
        rehabInput.max = '30';
        rehabInput.value = trainingForecast.rehabDays || 1;
        rehabInput.style.cssText = `
            width: 50px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        rehabInput.addEventListener('input', (e) => {
            let val = parseInt(e.target.value) || 1;
            if (val < 1) val = 1;
            if (val > 30) val = 30;
            trainingForecast.rehabDays = val;
            saveData();
        });
        rehabContainer.appendChild(rehabLabel);
        rehabContainer.appendChild(rehabInput);

        // Booster input
        const boosterContainer = document.createElement('div');
        boosterContainer.style.cssText = `display: flex; align-items: center; gap: 8px;`;
        
        const boosterLabel = document.createElement('label');
        boosterLabel.textContent = 'Booster:';
        boosterLabel.style.cssText = `color: #aaa; font-size: 12px; font-weight: bold; white-space: nowrap;`;
        
        const boosterSelect = document.createElement('select');
        boosterSelect.style.cssText = `
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        const boosterOptions = [
            'None',
            'Can - 5e', 'Can - 7.5e', 'Can - 10e', 'Can - 15e',
            'Can - 20e', 'Can - 22.5e', 'Can - 27.5e', 'Can - 30e', 'Can - 45e',
            'FHC', 'SE'
        ];
        boosterOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (opt === (trainingForecast.boosterType || 'None')) option.selected = true;
            boosterSelect.appendChild(option);
        });
        
        const boosterCountInput = document.createElement('input');
        boosterCountInput.type = 'number';
        boosterCountInput.step = '1';
        boosterCountInput.min = '0';
        boosterCountInput.max = '12'; // Default max
        boosterCountInput.value = trainingForecast.boosterCount || 0;
        boosterCountInput.style.cssText = `
            width: 50px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        
        function updateBoosterMax() {
            const type = trainingForecast.boosterType || 'None';
            let max = 12;
            if (type === 'FHC' || type === 'SE') {
                max = 4;
            } else if (type === 'None') {
                max = 0;
            }
            boosterCountInput.max = max;
            if (parseFloat(boosterCountInput.value) > max) {
                boosterCountInput.value = max;
                trainingForecast.boosterCount = max;
            }
        }
        
        boosterSelect.addEventListener('change', (e) => {
            trainingForecast.boosterType = e.target.value;
            updateBoosterMax();
            saveData();
        });
        
        // Initialize max
        updateBoosterMax();

        boosterCountInput.addEventListener('input', (e) => {
            const type = trainingForecast.boosterType || 'None';
            let max = 12;
            if (type === 'FHC' || type === 'SE') max = 4;
            
            let val = parseFloat(e.target.value) || 0;
            if (val > max) val = max;
            if (val < 0) val = 0;
            
            // Update input if clamped (only on blur or calculate? no, immediate clamp is fine for small range)
            // But immediate clamp prevents typing "1" then "0" for "10" if max is single digit? No, max is 12.
            // If I type 1, it's fine. If I type 12, fine. If I type 13, it becomes 12.
            if (val > max) {
                 e.target.value = max;
                 val = max;
            }
            
            trainingForecast.boosterCount = val;
            saveData();
        });

        boosterContainer.appendChild(boosterLabel);
        boosterContainer.appendChild(boosterSelect);
        boosterContainer.appendChild(boosterCountInput);

        // Calculate button
        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate';
        calculateButton.style.cssText = `
            background: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
            margin-left: auto;
        `;
        calculateButton.addEventListener('click', async () => {
            calculateButton.disabled = true;
            calculateButton.textContent = 'Calculating...';
            try {
                await calculateAllTrainingForecasts();
                calculateButton.textContent = 'Calculate';
            } catch (e) {
                console.error('Error calculating forecasts:', e);
                alert('Error calculating forecasts: ' + e.message);
                calculateButton.textContent = 'Calculate';
            } finally {
                calculateButton.disabled = false;
            }
        });
        calculateButton.addEventListener('mouseenter', () => {
            if (!calculateButton.disabled) {
                calculateButton.style.background = '#45a049';
            }
        });
        calculateButton.addEventListener('mouseleave', () => {
            if (!calculateButton.disabled) {
                calculateButton.style.background = '#4CAF50';
            }
        });

        topSection.appendChild(xanContainer);
        topSection.appendChild(donatorContainer);
        topSection.appendChild(refillContainer);
        topSection.appendChild(sleepContainer);
        topSection.appendChild(overdoseContainer);
        topSection.appendChild(rehabContainer);
        topSection.appendChild(boosterContainer);
        topSection.appendChild(calculateButton);
        content.appendChild(topSection);

        // Table section with 6 rows of 5 columns
        const tableSection = document.createElement('div');
        tableSection.style.cssText = `
            padding: 15px;
            background: #222;
            border-radius: 6px;
            border: 1px solid #333;
        `;

        const gridTable = document.createElement('div');
        gridTable.style.cssText = `
            display: grid;
            grid-template-columns: 80px repeat(4, 1fr);
            gap: 8px;
            font-size: 12px;
        `;

        // Header row
        const headerRow = document.createElement('div');
        headerRow.style.cssText = `display: contents;`;
        
        const daysHeader = document.createElement('div');
        daysHeader.textContent = 'Days';
        daysHeader.style.cssText = `
            color: #4CAF50;
            font-weight: bold;
            text-align: center;
        `;
        headerRow.appendChild(daysHeader);

        const statNames = ['Strength', 'Defense', 'Speed', 'Dexterity'];
        statNames.forEach(stat => {
            const header = document.createElement('div');
            header.textContent = stat;
            header.style.cssText = `
                color: #4CAF50;
                font-weight: bold;
                text-align: center;
            `;
            headerRow.appendChild(header);
        });
        gridTable.appendChild(headerRow);

        // Create 6 data rows
        const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
        trainingForecast.rows.forEach((row, rowIndex) => {
            const dataRow = document.createElement('div');
            dataRow.style.cssText = `display: contents;`;

            // Days input (first column)
            const daysCell = document.createElement('div');
            const daysInput = document.createElement('input');
            daysInput.type = 'number';
            daysInput.value = row.days || 0;
            daysInput.style.cssText = `
                width: 100%;
                padding: 6px 8px;
                background: #333;
                color: #fff;
                border: 1px solid #555;
                border-radius: 4px;
                font-size: 12px;
                box-sizing: border-box;
            `;
            daysInput.addEventListener('input', (e) => {
                trainingForecast.rows[rowIndex].days = parseInt(e.target.value) || 0;
                saveData();
            });
            daysCell.appendChild(daysInput);
            dataRow.appendChild(daysCell);

            // Stat inputs (4 columns)
            statKeys.forEach(statKey => {
                const statCell = document.createElement('div');
                const statInput = document.createElement('input');
                statInput.type = 'text';
                statInput.value = row[statKey] ? formatNumber(row[statKey]) : '';
                statInput.placeholder = '0';
                statInput.setAttribute('data-row', rowIndex);
                statInput.setAttribute('data-stat', statKey);
                statInput.style.cssText = `
                    width: 100%;
                    padding: 6px 8px;
                    background: #333;
                    color: #fff;
                    border: 1px solid #555;
                    border-radius: 4px;
                    font-size: 12px;
                    box-sizing: border-box;
                `;
                statInput.addEventListener('input', (e) => {
                    const val = parseFormattedNumber(e.target.value);
                    trainingForecast.rows[rowIndex][statKey] = val;
                    saveData();
                });
                statInput.addEventListener('blur', (e) => {
                    const val = parseFormattedNumber(e.target.value);
                    e.target.value = val ? formatNumber(val) : '';
                });
                statCell.appendChild(statInput);
                dataRow.appendChild(statCell);
            });

            gridTable.appendChild(dataRow);
        });

        tableSection.appendChild(gridTable);
        content.appendChild(tableSection);

        return content;
    }

    // Create happy jump tab content
    function createHappyJumpTab() {
        const content = document.createElement('div');
        content.id = 'happy-jump-content';
        content.style.cssText = `
            padding: 15px;
            color: #ccc;
            font-size: 13px;
        `;

        const placeholder = document.createElement('div');
        placeholder.textContent = 'Happy Jump calculations will appear here...';
        placeholder.style.cssText = `
            text-align: center;
            color: #888;
            padding: 20px;
        `;
        content.appendChild(placeholder);

        return content;
    }

    // Create SE effectiveness tab content
    function createSEEffectivenessTab() {
        const content = document.createElement('div');
        content.id = 'se-effectiveness-content';
        content.style.cssText = `
            padding: 15px;
            color: #ccc;
            font-size: 13px;
        `;

        const placeholder = document.createElement('div');
        placeholder.textContent = 'SE Effectiveness calculations will appear here...';
        placeholder.style.cssText = `
            text-align: center;
            color: #888;
            padding: 20px;
        `;
        content.appendChild(placeholder);

        return content;
    }

    // Update UI
    function updateUI() {
        const panel = document.getElementById('torn-stat-gains-panel');
        if (!panel) return;

        // Update tab buttons
        const tabButtons = panel.querySelectorAll('.tab-button');
        tabButtons.forEach((btn, idx) => {
            const tabs = ['single', 'training', 'happy', 'se'];
            const isActive = tabs[idx] === currentTab;
            btn.style.background = isActive ? '#444' : '#2a2a2a';
            btn.style.color = isActive ? '#4CAF50' : '#aaa';
            btn.style.borderBottom = isActive ? '2px solid #4CAF50' : '2px solid transparent';
            btn.style.fontWeight = isActive ? 'bold' : 'normal';
        });

        // Update tab content
        const contents = {
            single: document.getElementById('single-train-content'),
            training: document.getElementById('training-forecast-content'),
            happy: document.getElementById('happy-jump-content'),
            se: document.getElementById('se-effectiveness-content')
        };

        Object.keys(contents).forEach(key => {
            if (contents[key]) {
                contents[key].style.display = key === currentTab ? 'block' : 'none';
            }
        });

        // Update single train results when switching to that tab
        if (currentTab === 'single') {
            updateSingleTrainResults();
        }
    }

    // Load API key from localStorage
    function loadApiKey() {
        return localStorage.getItem('torn_stat_gains_api_key') || '';
    }

    // Save API key to localStorage
    function saveApiKey(key) {
        localStorage.setItem('torn_stat_gains_api_key', key);
    }

    // Show API key modal
    function showApiKeyModal() {
        // Remove existing modal if it exists
        const existing = document.getElementById('torn-stat-gains-api-modal');
        if (existing) {
            existing.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'torn-stat-gains-api-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100002;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #1a1a1a;
            border: 2px solid #444;
            border-radius: 10px;
            padding: 20px;
            min-width: 400px;
            max-width: 500px;
            color: #fff;
        `;

        const modalTitle = document.createElement('div');
        modalTitle.textContent = 'Fetch Stats from API';
        modalTitle.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #4CAF50;
            margin-bottom: 15px;
        `;
        modalContent.appendChild(modalTitle);

        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'API Key:';
        apiKeyLabel.style.cssText = `
            display: block;
            margin-bottom: 8px;
            color: #ccc;
            font-size: 13px;
        `;
        modalContent.appendChild(apiKeyLabel);

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.value = loadApiKey();
        apiKeyInput.placeholder = 'Enter your Torn API key';
        apiKeyInput.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 13px;
            box-sizing: border-box;
            margin-bottom: 15px;
        `;
        modalContent.appendChild(apiKeyInput);

        const note = document.createElement('div');
        note.textContent = 'Note: The API key is only used for fetching stats, is kept locally, and never sent or used for any other purpose.';
        note.style.cssText = `
            background: #2a2a2a;
            border-left: 3px solid #4CAF50;
            padding: 10px;
            margin-bottom: 15px;
            color: #aaa;
            font-size: 12px;
            line-height: 1.4;
        `;
        modalContent.appendChild(note);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            background: #555;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });
        cancelButton.addEventListener('mouseenter', () => {
            cancelButton.style.background = '#666';
        });
        cancelButton.addEventListener('mouseleave', () => {
            cancelButton.style.background = '#555';
        });
        buttonContainer.appendChild(cancelButton);

        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Fetch';
        fetchButton.style.cssText = `
            background: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        fetchButton.addEventListener('click', async () => {
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                alert('Please enter an API key');
                return;
            }
            saveApiKey(apiKey);
            fetchButton.disabled = true;
            fetchButton.textContent = 'Fetching...';
            try {
                await fetchStatsFromAPI(apiKey);
                modal.remove();
            } catch (error) {
                alert('Error fetching stats: ' + error.message);
                fetchButton.disabled = false;
                fetchButton.textContent = 'Fetch';
            }
        });
        fetchButton.addEventListener('mouseenter', () => {
            if (!fetchButton.disabled) {
                fetchButton.style.background = '#45a049';
            }
        });
        fetchButton.addEventListener('mouseleave', () => {
            if (!fetchButton.disabled) {
                fetchButton.style.background = '#4CAF50';
            }
        });
        buttonContainer.appendChild(fetchButton);

        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        document.body.appendChild(modal);
        apiKeyInput.focus();
    }

    // Fetch stats from Torn API
    async function fetchStatsFromAPI(apiKey) {
        const url = `https://api.torn.com/v2/user/battlestats?key=${encodeURIComponent(apiKey)}`;
        
        const response = await fetch(url, { credentials: 'omit' });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`${data.error.code}: ${data.error.error}`);
        }
        
        // The Torn API v2 battlestats endpoint returns stats nested in battlestats object
        // Each stat has a 'value' property containing the actual stat value
        if (!data.battlestats) {
            throw new Error('Battlestats not found in API response. Please check your API key permissions.');
        }
        
        const battlestats = data.battlestats;
        
        // Extract stat values from the nested structure
        // Each stat object has: { value: number, modifier: number, modifiers: [...] }
        if (battlestats.strength && battlestats.strength.value !== undefined) {
            stats.strength = parseInt(battlestats.strength.value) || 0;
        }
        if (battlestats.defense && battlestats.defense.value !== undefined) {
            stats.defense = parseInt(battlestats.defense.value) || 0;
        }
        if (battlestats.speed && battlestats.speed.value !== undefined) {
            stats.speed = parseInt(battlestats.speed.value) || 0;
        }
        if (battlestats.dexterity && battlestats.dexterity.value !== undefined) {
            stats.dexterity = parseInt(battlestats.dexterity.value) || 0;
        }
        
        // Save updated stats
        saveData();
        
        // Refresh the UI to show updated values
        const panel = document.getElementById('torn-stat-gains-panel');
        if (panel) {
            // Find all input fields in the grid (now type="text" for comma formatting)
            const inputs = panel.querySelectorAll('input[type="text"]');
            // The first 4 inputs are the "Current" stats row (strength, defense, speed, dexterity)
            if (inputs.length >= 4) {
                const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
                statKeys.forEach((key, idx) => {
                    if (inputs[idx]) {
                        inputs[idx].value = stats[key] ? formatNumber(stats[key]) : '';
                        // Trigger input event to ensure onChange handlers are called
                        inputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            }
        }
    }

    // Create main panel
    function createPanel() {
        // Remove existing panel if it exists
        const existing = document.getElementById('torn-stat-gains-panel');
        if (existing) {
            existing.remove();
        }

        loadData();

        const panel = document.createElement('div');
        panel.id = 'torn-stat-gains-panel';
        
        // Load saved position and size
        const savedPos = localStorage.getItem('torn_stat_gains_position');
        let initialTop = '80px';
        let initialRight = '40px';
        let initialLeft = 'auto';
        let initialWidth = '450px';
        let initialHeight = 'auto';
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                if (pos.top !== undefined) initialTop = pos.top;
                if (pos.left !== undefined) {
                    initialLeft = pos.left;
                    initialRight = 'auto';
                } else if (pos.right !== undefined) {
                    initialRight = pos.right;
                    initialLeft = 'auto';
                }
                if (pos.width !== undefined) initialWidth = pos.width;
                if (pos.height !== undefined) initialHeight = pos.height;
            } catch (e) {
                console.error('Error loading position:', e);
            }
        }
        
        panel.style.cssText = `
            position: fixed;
            top: ${initialTop};
            left: ${initialLeft};
            right: ${initialRight};
            width: ${initialWidth};
            ${initialHeight !== 'auto' ? `height: ${initialHeight};` : ''}
            background: #1a1a1a;
            color: #fff;
            border: 2px solid #444;
            border-radius: 10px;
            min-width: 400px;
            min-height: 300px;
            z-index: 100000;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
        `;

        // Header (draggable)
        const header = document.createElement('div');
        header.style.cssText = `
            background: #2a2a2a;
            padding: 12px;
            font-weight: bold;
            font-size: 15px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: move;
            color: #4CAF50;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('div');
        title.textContent = "MrA's Stat Gains Modeler";
        title.style.cssText = `
            flex: 1;
            user-select: none;
        `;
        header.appendChild(title);

        const hideButton = document.createElement('button');
        hideButton.textContent = '−';
        hideButton.title = 'Hide panel';
        hideButton.style.cssText = `
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            padding: 0 8px;
            line-height: 1;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            user-select: none;
        `;
        hideButton.addEventListener('click', (e) => {
            e.stopPropagation();
            hidePanel();
        });
        hideButton.addEventListener('mouseenter', () => {
            hideButton.style.background = '#444';
            hideButton.style.color = '#fff';
        });
        hideButton.addEventListener('mouseleave', () => {
            hideButton.style.background = 'transparent';
            hideButton.style.color = '#aaa';
        });
        header.appendChild(hideButton);

        panel.appendChild(header);

        // Input section
        const inputSection = document.createElement('div');
        inputSection.style.cssText = `
            padding: 15px;
            background: #222;
            border-bottom: 2px solid #333;
        `;

        const inputTitleRow = document.createElement('div');
        inputTitleRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        `;
        
        const inputTitle = document.createElement('div');
        inputTitle.textContent = 'Basic Information';
        inputTitle.style.cssText = `
            font-weight: bold;
            color: #4CAF50;
            font-size: 14px;
        `;
        inputTitleRow.appendChild(inputTitle);
        
        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Fetch Info';
        fetchButton.style.cssText = `
            background: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        fetchButton.addEventListener('click', () => {
            showApiKeyModal();
        });
        fetchButton.addEventListener('mouseenter', () => {
            fetchButton.style.background = '#45a049';
        });
        fetchButton.addEventListener('mouseleave', () => {
            fetchButton.style.background = '#4CAF50';
        });
        inputTitleRow.appendChild(fetchButton);
        
        inputSection.appendChild(inputTitleRow);

        // Create grid table
        const gridTable = document.createElement('div');
        gridTable.style.cssText = `
            display: grid;
            grid-template-columns: 120px repeat(4, 1fr);
            gap: 8px;
            font-size: 12px;
        `;

        // Header row
        const headerRow = document.createElement('div');
        headerRow.style.cssText = `
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 120px repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 4px;
        `;
        
        const emptyHeader = document.createElement('div');
        emptyHeader.style.cssText = `color: #888; font-weight: bold;`;
        headerRow.appendChild(emptyHeader);
        
        const statNames = ['Strength', 'Defense', 'Speed', 'Dexterity'];
        statNames.forEach(stat => {
            const header = document.createElement('div');
            header.textContent = stat;
            header.style.cssText = `
                color: #4CAF50;
                font-weight: bold;
                text-align: center;
            `;
            headerRow.appendChild(header);
        });
        gridTable.appendChild(headerRow);

        // Row function
        function createRow(label, values, onChange) {
            const row = document.createElement('div');
            row.style.cssText = `
                display: contents;
            `;

            const labelCell = document.createElement('div');
            labelCell.textContent = label;
            labelCell.style.cssText = `
                color: #aaa;
                font-weight: bold;
                display: flex;
                align-items: center;
            `;
            row.appendChild(labelCell);

            const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
            statKeys.forEach((key, idx) => {
                const inputCell = document.createElement('div');
                inputCell.appendChild(createGridInput(values[key], (val) => {
                    onChange(key, val);
                }));
                row.appendChild(inputCell);
            });

            return row;
        }

        // Create dropdown row function
        function createDropdownRow(label, values, options, onChange) {
            const row = document.createElement('div');
            row.style.cssText = `
                display: contents;
            `;

            const labelCell = document.createElement('div');
            labelCell.textContent = label;
            labelCell.style.cssText = `
                color: #aaa;
                font-weight: bold;
                display: flex;
                align-items: center;
            `;
            row.appendChild(labelCell);

            const statKeys = ['strength', 'defense', 'speed', 'dexterity'];
            statKeys.forEach((key) => {
                const dropdownCell = document.createElement('div');
                const select = document.createElement('select');
                select.style.cssText = `
                    width: 100%;
                    padding: 6px 8px;
                    background: #333;
                    color: #fff;
                    border: 1px solid #555;
                    border-radius: 4px;
                    font-size: 12px;
                    box-sizing: border-box;
                    cursor: pointer;
                `;
                
                // Add options
                options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = option;
                    optionEl.textContent = option;
                    select.appendChild(optionEl);
                });
                
                // Set current value
                select.value = values[key] || '[H] George\'s';
                
                // Add change handler
                select.addEventListener('change', (e) => {
                    onChange(key, e.target.value);
                });
                
                dropdownCell.appendChild(select);
                row.appendChild(dropdownCell);
            });

            return row;
        }

        // Create rows
        gridTable.appendChild(createRow('Current', stats, (key, val) => { 
            stats[key] = val; 
            saveData();
            updateSingleTrainResults();
        }));
        gridTable.appendChild(createRow('Steadfast', steadfast, (key, val) => { 
            steadfast[key] = val; 
            saveData();
            updateSingleTrainResults();
        }));
        gridTable.appendChild(createRow('Property Perks', propertyPerks, (key, val) => { 
            propertyPerks[key] = val; 
            saveData();
            updateSingleTrainResults();
        }));
        gridTable.appendChild(createRow('Education', education, (key, val) => { 
            education[key] = val; 
            saveData();
            updateSingleTrainResults();
        }));
        gridTable.appendChild(createRow('Job Perks', jobPerks, (key, val) => { 
            jobPerks[key] = val; 
            saveData();
            updateSingleTrainResults();
        }));
        
        // Top Gym dropdown row
        const gymOptions = [
            '[L] Premier Fitness',
            '[L] Average Joes',
            '[L] Woody\'s Workout',
            '[L] Beach Bods',
            '[L] Silver Gym',
            '[L] Pour Femme',
            '[L] Davies Den',
            '[L] Global Gym',
            '[M] Knuckle Heads',
            '[M] Pioneer Fitness',
            '[M] Anabolic Anomalies',
            '[M] Core',
            '[M] Racing Fitness',
            '[M] Complete Cardio',
            '[M] Legs, Bums and Tums',
            '[M] Deep Burn',
            '[H] Apollo Gym',
            '[H] Gun Shop',
            '[H] Force Training',
            '[H] Cha Cha\'s',
            '[H] Atlas',
            '[H] Last Round',
            '[H] The Edge',
            '[H] George\'s',
            '[S] Balboas Gym',
            '[S] Frontline Fitness',
            '[S] Gym 3000',
            '[S] Mr. Isoyamas',
            '[S] Total Rebound',
            '[S] Elites',
            '[S] Sports Science Lab'
        ];
        gridTable.appendChild(createDropdownRow('Top Gym', topGym, gymOptions, (key, val) => {
            topGym[key] = val;
            saveData();
            updateSingleTrainResults();
        }));

        // Create checkbox row for 1% Edu and Happy
        const checkboxRow = document.createElement('div');
        checkboxRow.style.cssText = `
            display: grid;
            grid-template-columns: 120px repeat(4, 1fr);
            gap: 8px;
        `;

        // Empty label cell (to align with other rows)
        const checkboxLabelCell = document.createElement('div');
        checkboxLabelCell.style.cssText = `
            color: #aaa;
            font-weight: bold;
            display: flex;
            align-items: center;
        `;
        checkboxRow.appendChild(checkboxLabelCell);

        // Create container for checkboxes (spans remaining columns)
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.cssText = `
            grid-column: 2 / -1;
            display: flex;
            gap: 20px;
            align-items: center;
        `;

        // 1% Edu checkbox
        const eduCheckboxContainer = document.createElement('div');
        eduCheckboxContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        const eduCheckbox = document.createElement('input');
        eduCheckbox.type = 'checkbox';
        eduCheckbox.id = 'one-percent-edu-checkbox';
        eduCheckbox.checked = onePercentEdu;
        eduCheckbox.style.cssText = `
            width: 16px;
            height: 16px;
            cursor: pointer;
        `;
        eduCheckbox.addEventListener('change', (e) => {
            onePercentEdu = e.target.checked;
            saveData();
            updateSingleTrainResults();
        });
        const eduLabel = document.createElement('label');
        eduLabel.htmlFor = 'one-percent-edu-checkbox';
        eduLabel.textContent = '1% Edu';
        eduLabel.style.cssText = `
            color: #aaa;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
        `;
        eduCheckboxContainer.appendChild(eduCheckbox);
        eduCheckboxContainer.appendChild(eduLabel);

        // Happy number input
        const happyInputContainer = document.createElement('div');
        happyInputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        const happyLabel = document.createElement('label');
        happyLabel.textContent = 'Happy:';
        happyLabel.style.cssText = `
            color: #aaa;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
        `;
        const happyInput = document.createElement('input');
        happyInput.type = 'text';
        happyInput.value = happy ? formatNumber(happy) : '';
        happyInput.placeholder = '5025';
        happyInput.style.cssText = `
            width: 100px;
            padding: 6px 8px;
            background: #333;
            color: #fff;
            border: 1px solid #555;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
        `;
        happyInput.addEventListener('input', (e) => {
            const val = parseFormattedNumber(e.target.value);
            // Clamp value between 0 and 99999
            const clampedVal = Math.max(0, Math.min(99999, val));
            happy = clampedVal;
            saveData();
            updateSingleTrainResults();
        });
        happyInput.addEventListener('blur', (e) => {
            const val = parseFormattedNumber(e.target.value);
            const clampedVal = Math.max(0, Math.min(99999, val));
            happy = clampedVal;
            e.target.value = clampedVal ? formatNumber(clampedVal) : '';
            saveData();
            updateSingleTrainResults();
        });
        happyInputContainer.appendChild(happyLabel);
        happyInputContainer.appendChild(happyInput);

        checkboxContainer.appendChild(eduCheckboxContainer);
        checkboxContainer.appendChild(happyInputContainer);
        checkboxRow.appendChild(checkboxContainer);

        gridTable.appendChild(checkboxRow);

        inputSection.appendChild(gridTable);
        panel.appendChild(inputSection);

        // Tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.style.cssText = `
            display: flex;
            background: #222;
            border-bottom: 2px solid #333;
        `;

        const singleTab = createTabButton('Single Train', 'single', currentTab === 'single');
        singleTab.className = 'tab-button';
        const trainingTab = createTabButton('Training Forecast', 'training', currentTab === 'training');
        trainingTab.className = 'tab-button';
        const happyTab = createTabButton('Happy Jump', 'happy', currentTab === 'happy');
        happyTab.className = 'tab-button';
        const seTab = createTabButton('SE Effectiveness', 'se', currentTab === 'se');
        seTab.className = 'tab-button';

        tabsContainer.appendChild(singleTab);
        tabsContainer.appendChild(trainingTab);
        tabsContainer.appendChild(happyTab);
        tabsContainer.appendChild(seTab);
        panel.appendChild(tabsContainer);

        // Tab content container
        const contentContainer = document.createElement('div');
        contentContainer.style.cssText = `
            flex: 1;
            min-height: 200px;
            overflow-y: auto;
        `;

        const singleContent = createSingleTrainTab();
        const trainingContent = createTrainingForecastTab();
        const happyContent = createHappyJumpTab();
        const seContent = createSEEffectivenessTab();

        contentContainer.appendChild(singleContent);
        contentContainer.appendChild(trainingContent);
        contentContainer.appendChild(happyContent);
        contentContainer.appendChild(seContent);
        panel.appendChild(contentContainer);

        // Resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 0%, transparent 40%, #555 40%, #555 45%, transparent 45%, transparent 55%, #555 55%, #555 60%, transparent 60%);
            border-bottom-right-radius: 8px;
            z-index: 1;
        `;
        panel.appendChild(resizeHandle);

        // Drag and resize functionality
        let isDragging = false;
        let isResizing = false;
        let startX, startY, startLeft, startTop;
        let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

        header.addEventListener('mousedown', (e) => {
            // Don't start dragging if clicking on resize handle
            if (e.target === resizeHandle || resizeHandle.contains(e.target)) {
                return;
            }
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            document.body.style.userSelect = 'none';
        });

        const dragMouseMove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            // Keep panel within viewport bounds
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - 100; // Leave some space at bottom
            
            const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
            
            panel.style.left = constrainedLeft + 'px';
            panel.style.top = constrainedTop + 'px';
            panel.style.right = 'auto';
        };

        const resizeMouseMove = (e) => {
            if (!isResizing) return;
            const dx = e.clientX - resizeStartX;
            const dy = e.clientY - resizeStartY;
            const newWidth = Math.max(400, resizeStartWidth + dx);
            const newHeight = Math.max(300, resizeStartHeight + dy);
            
            panel.style.width = newWidth + 'px';
            panel.style.height = newHeight + 'px';
        };

        const combinedMouseMove = (e) => {
            dragMouseMove(e);
            resizeMouseMove(e);
        };

        const combinedMouseUp = () => {
            if (isDragging || isResizing) {
                // Save position and size
                const rect = panel.getBoundingClientRect();
                const position = {
                    top: rect.top + 'px',
                    left: rect.left + 'px',
                    width: panel.style.width || rect.width + 'px',
                    height: panel.style.height || 'auto'
                };
                localStorage.setItem('torn_stat_gains_position', JSON.stringify(position));
            }
            isDragging = false;
            isResizing = false;
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', combinedMouseMove);
        document.addEventListener('mouseup', combinedMouseUp);

        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            const rect = panel.getBoundingClientRect();
            resizeStartWidth = rect.width;
            resizeStartHeight = rect.height;
            document.body.style.userSelect = 'none';
        });

        document.body.appendChild(panel);
        updateUI();

        // Set initial visibility
        if (isHidden) {
            panel.style.display = 'none';
            createShowButton();
        }
    }

    // Hide panel
    function hidePanel() {
        const panel = document.getElementById('torn-stat-gains-panel');
        if (panel) {
            panel.style.display = 'none';
            isHidden = true;
            localStorage.setItem('torn_stat_gains_hidden', 'true');
            createShowButton();
        }
    }

    // Show panel
    function showPanel() {
        const panel = document.getElementById('torn-stat-gains-panel');
        if (panel) {
            panel.style.display = 'block';
            isHidden = false;
            localStorage.removeItem('torn_stat_gains_hidden');
            const showBtn = document.getElementById('torn-stat-gains-show-btn');
            if (showBtn) {
                showBtn.remove();
            }
        }
    }

    // Create show button (when panel is hidden)
    function createShowButton() {
        // Remove existing show button if it exists
        const existing = document.getElementById('torn-stat-gains-show-btn');
        if (existing) {
            existing.remove();
        }

        const showBtn = document.createElement('button');
        showBtn.id = 'torn-stat-gains-show-btn';
        showBtn.textContent = 'Stat Gains';
        showBtn.title = 'Show Stat Gains Modeler';
        showBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2a2a2a;
            color: #4CAF50;
            border: 2px solid #444;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 100001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;
        showBtn.addEventListener('click', () => {
            showPanel();
        });
        showBtn.addEventListener('mouseenter', () => {
            showBtn.style.background = '#333';
            showBtn.style.borderColor = '#555';
        });
        showBtn.addEventListener('mouseleave', () => {
            showBtn.style.background = '#2a2a2a';
            showBtn.style.borderColor = '#444';
        });
        document.body.appendChild(showBtn);
    }

    // Initialize
    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createPanel);
        } else {
            createPanel();
        }
    }

    init();

})();


