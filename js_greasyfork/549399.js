// ==UserScript==
// @name         [FORGE] OC 2.0 Role Requirements
// @namespace    MonChoon_
// @version      2.1
// @description  Torn OC 2.0 Requirements for Roles in Specific Crimes, based on TNL Forge
// @license      MIT
// @author       MonChoon [2250591], Silmaril [2665762]
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      docs.google.com
// @connect      googleusercontent.com
// @connect      doc-*.sheets.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/549404/%5BFORGE%5D%20OC%2020%20Role%20Requirements.user.js
// @updateURL https://update.greasyfork.org/scripts/549404/%5BFORGE%5D%20OC%2020%20Role%20Requirements.meta.js
// ==/UserScript==

// Configuration and global variables
const REQUIREMENTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSb0W9iwm3noNzJVoUArG4VSbeSzpgWlMB9ObhYxU8FdNMzWEhIC852N2SHSWbb-pKFdrBgMwxQr6x-/pub?gid=812446557&single=true&output=csv';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for testing
const CRIMES_TAB = '#/tab=crimes';

// Fallback data in case Google Sheets is unavailable
const FALLBACK_REQUIREMENTS = {
    'Blast from the Past': {'Bomber': 75, 'Engineer': 75, 'Hacker': 70, 'Muscle': 75, 'Picklock #1': 70, 'Picklock #2': 70},
    'Break the Bank': {'Robber': 80, 'Thief #1': 50, 'Thief #2': 65, 'Muscle #1': 60, 'Muscle #2': 60, 'Muscle #3': 65},
    'Stacking the Deck': {'Cat Burglar': 68, 'Driver': 50, 'Imitator': 68, 'Hacker': 68},
    'Ace in the Hole': {'Hacker': 63, 'Driver': 53, 'Imitator': 63, 'Muscle #1': 63, 'Muscle #2': 63},
    'Clinical Precision': {'Cat Burglar': 67, 'Cleaner': 67, 'Imitator': 70, 'Assassin': 67},
    'Bidding War': {'Driver': 75, 'Robber 1': 70, 'Robber 2': 75, 'Robber 3': 75, 'Bomber 1': 70, 'Bomber 2': 75}
};

let crimeRequirements = FALLBACK_REQUIREMENTS;
let observer = null;
let isInitialized = false;

// Enhanced storage functions with GM fallback
function getStoredValue(key, defaultValue = null) {
    try {
        // Try GM_getValue first (more reliable on mobile)
        if (typeof GM_getValue !== 'undefined') {
            return GM_getValue(key, defaultValue);
        }
        // Fallback to localStorage
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

function setStoredValue(key, value) {
    try {
        // Try GM_setValue first (more reliable on mobile)
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue(key, value);
            return;
        }
        // Fallback to localStorage
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        // Silent fail
    }
}

// Parse CSV data with detailed logging
function parseCSVToRequirements(csvText) {
    console.log('OC Requirements: Starting CSV parsing...');
    console.log('OC Requirements: CSV text length =', csvText.length);

    try {
        const lines = csvText.trim().split('\n');
        console.log('OC Requirements: Found', lines.length, 'lines in CSV');

        if (lines.length < 3) {
            console.log('OC Requirements: Not enough lines for parsing (need at least 3)');
            return null;
        }

        const requirements = {};
        let groupsProcessed = 0;

        // Process in groups of 3 lines (Crime, Role, CPR)
        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 >= lines.length) {
                console.log(`OC Requirements: Stopping at line ${i}, not enough lines for complete group`);
                break;
            }

            const crimeRow = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const roleRow = lines[i + 1].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const cprRow = lines[i + 2].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

            console.log(`OC Requirements: Processing group ${groupsProcessed + 1}:`);
            console.log(`  Crime row (${crimeRow.length} cols):`, crimeRow.slice(0, 3), '...');
            console.log(`  Role row (${roleRow.length} cols):`, roleRow.slice(0, 3), '...');
            console.log(`  CPR row (${cprRow.length} cols):`, cprRow.slice(0, 3), '...');

            // First cell should be "Crime", second cell is the crime name
            if (crimeRow[0] !== 'Crime' || !crimeRow[1]) {
                console.log(`  Skipping - invalid crime row: "${crimeRow[0]}", "${crimeRow[1]}"`);
                continue;
            }

            const crimeName = crimeRow[1];
            console.log(`  Processing crime: "${crimeName}"`);
            requirements[crimeName] = {};
            let rolesAdded = 0;

            // Process roles (skip first column which is "Role" or "CPR")
            for (let j = 1; j < roleRow.length && j < cprRow.length; j++) {
                const roleName = roleRow[j];
                const cprValue = cprRow[j];

                if (roleName && cprValue && !isNaN(cprValue)) {
                    const cpr = parseInt(cprValue);
                    if (cpr >= 0) {
                        requirements[crimeName][roleName] = cpr;
                        rolesAdded++;
                    }
                }
            }

            console.log(`  Added ${rolesAdded} roles for "${crimeName}"`);
            groupsProcessed++;
        }

        console.log(`OC Requirements: Parsing complete - processed ${groupsProcessed} crime groups`);
        console.log('OC Requirements: Final crimes found:', Object.keys(requirements));

        return Object.keys(requirements).length > 0 ? requirements : null;

    } catch (e) {
        console.log('OC Requirements: CSV parsing error =', e.message);
        console.log('OC Requirements: Error stack =', e.stack);
        return null;
    }
}

// Enhanced cache management
function getCachedRequirements() {
    try {
        const timestamp = getStoredValue('oc_cache_timestamp', 0);
        const cached = getStoredValue('oc_cache_data', null);

        if (timestamp && cached && (Date.now() - timestamp) < CACHE_DURATION) {
            console.log('OC Requirements: Using cached data');
            return cached;
        }
    } catch (e) {
        // Silent fail
    }
    return null;
}

function setCachedRequirements(requirements) {
    try {
        setStoredValue('oc_cache_timestamp', Date.now());
        setStoredValue('oc_cache_data', requirements);
    } catch (e) {
        // Silent fail
    }
}

// Enhanced fetch with detailed error logging
function fetchRequirements() {
    return new Promise((resolve) => {
        // Check cache first
        const cached = getCachedRequirements();
        if (cached) {
            console.log('OC Requirements: Using cached data - success');
            resolve(cached);
            return;
        }

        console.log('OC Requirements: Starting fetch from Google Sheets...');
        console.log('OC Requirements: URL =', REQUIREMENTS_CSV_URL);

        // Method 1: Try GM_xmlhttpRequest with detailed logging
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            console.log('OC Requirements: Attempting GM_xmlhttpRequest...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: REQUIREMENTS_CSV_URL,
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; userscript)',
                    'Accept': 'text/csv,text/plain,*/*'
                },
                onload: function(response) {
                    console.log('OC Requirements: GM_xmlhttpRequest response received');
                    console.log('OC Requirements: Status =', response.status);
                    console.log('OC Requirements: Response length =', response.responseText ? response.responseText.length : 0);

                    try {
                        if (response.status === 200 && response.responseText) {
                            console.log('OC Requirements: Starting CSV parsing...');
                            console.log('OC Requirements: First 200 chars =', response.responseText.substring(0, 200));

                            const requirements = parseCSVToRequirements(response.responseText);
                            if (requirements) {
                                console.log('OC Requirements: CSV parsing successful');
                                console.log('OC Requirements: Found crimes =', Object.keys(requirements));
                                setCachedRequirements(requirements);
                                resolve(requirements);
                                return;
                            } else {
                                console.log('OC Requirements: CSV parsing returned null/empty');
                            }
                        } else {
                            console.log('OC Requirements: Bad status or empty response');
                        }
                        throw new Error(`GM_xmlhttpRequest failed: status ${response.status}`);
                    } catch (e) {
                        console.log('OC Requirements: GM_xmlhttpRequest processing error =', e.message);
                        tryFetchFallback(resolve);
                    }
                },
                onerror: function(error) {
                    console.log('OC Requirements: GM_xmlhttpRequest network error =', error);
                    console.log('OC Requirements: This might be a CORS permission issue!');
                    console.log('OC Requirements: Check if Tampermonkey asked for docs.google.com access permission');
                    tryFetchFallback(resolve);
                },
                ontimeout: function() {
                    console.log('OC Requirements: GM_xmlhttpRequest timeout');
                    tryFetchFallback(resolve);
                }
            });
        } else {
            console.log('OC Requirements: GM_xmlhttpRequest not available');
            tryFetchFallback(resolve);
        }
    });
}

// Fallback method using regular fetch with detailed logging
function tryFetchFallback(resolve) {
    console.log('OC Requirements: Trying fetch fallback...');

    if (typeof fetch !== 'undefined') {
        console.log('OC Requirements: fetch() is available, attempting request...');

        fetch(REQUIREMENTS_CSV_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        })
        .then(response => {
            console.log('OC Requirements: fetch response received');
            console.log('OC Requirements: fetch status =', response.status);
            console.log('OC Requirements: fetch ok =', response.ok);

            if (response.ok) {
                return response.text();
            }
            throw new Error(`Fetch failed with status ${response.status}`);
        })
        .then(text => {
            console.log('OC Requirements: fetch text received, length =', text.length);
            console.log('OC Requirements: fetch first 200 chars =', text.substring(0, 200));

            const requirements = parseCSVToRequirements(text);
            if (requirements) {
                console.log('OC Requirements: fetch + parsing successful');
                console.log('OC Requirements: found crimes =', Object.keys(requirements));
                setCachedRequirements(requirements);
                resolve(requirements);
                return;
            } else {
                console.log('OC Requirements: fetch parsing returned null/empty');
            }
            throw new Error('Fetch parsing failed');
        })
        .catch(error => {
            console.log('OC Requirements: fetch method failed =', error.message);
            console.log('OC Requirements: Using fallback data due to fetch failure');
            resolve(FALLBACK_REQUIREMENTS);
        });
    } else {
        console.log('OC Requirements: fetch() not available, using fallback data');
        resolve(FALLBACK_REQUIREMENTS);
    }
}

// Set up the mutation observer for dynamic content
function setupObserver() {
    const observerTarget = document.querySelector("#faction-crimes");
    if (!observerTarget) {
        return false;
    }

    const observerConfig = {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: true
    };

    observer = new MutationObserver(function(mutations) {
        mutations.forEach(mutationRaw => {
            if (window.location.href.indexOf(CRIMES_TAB) > -1){
                let mutation = mutationRaw.target;
                if (String(mutation.className).indexOf('description___') > -1){
                    processSpecificCrime(mutation);
                }
            }
        });
    });

    observer.observe(observerTarget, observerConfig);
    return true;
}

// Process a specific crime when it's detected by the observer
function processSpecificCrime(mutation) {
    try {
        let crimeParentRow = mutation.parentNode.parentNode.parentNode;
        let crimeTitleElement = crimeParentRow.querySelector('[class^=scenario] > [class^=wrapper___] > [class^=panel___] > [class^=panelTitle___]');

        if (!crimeTitleElement) return;

        let crimeTitle = crimeTitleElement.textContent;
        let crimeTitleRequirements = crimeRequirements[crimeTitle];
        if (crimeTitleRequirements === undefined) return;

        crimeParentRow.querySelectorAll('[class^=wrapper___] > [class^=wrapper___]').forEach(crime => {
            processCrimeRole(crime, crimeTitleRequirements);
        });
    } catch (e) {
        // Silent error handling
    }
}

// Process individual crime role
function processCrimeRole(crime, crimeTitleRequirements) {
    try {
        let slotTitleElement = crime.querySelector('[class^=slotHeader___] > [class^=title___]');
        let slotSkillElement = crime.querySelector('[class^=slotHeader___] > [class^=successChance___]');

        if (!slotTitleElement || !slotSkillElement) return;

        let slotTitle = slotTitleElement.textContent;
        let slotSkill = Number(slotSkillElement.textContent);

        if (crime.className.indexOf('waitingJoin___') > -1){
            let roleRequirement = crimeTitleRequirements[slotTitle];
            if (roleRequirement !== undefined && slotSkill < roleRequirement){
                let roleJoinBtn = crime.querySelector('[class^=slotBody___] > [class^=joinContainer___] > [class^=joinButtonContainer___] > [class*=joinButton___]');
                if (roleJoinBtn && !roleJoinBtn.hasAttribute('data-oc-modified')) {
                    roleJoinBtn.setAttribute('disabled', true);
                    roleJoinBtn.textContent = `<${roleRequirement}`;
                    roleJoinBtn.style.color = 'crimson';
                    roleJoinBtn.setAttribute('data-oc-modified', 'true');
                }
            }
        }
    } catch (e) {
        // Silent error handling
    }
}

// Apply requirements to existing crimes on page load
function applyToExistingCrimes() {
    if (window.location.href.indexOf(CRIMES_TAB) === -1) return;

    document.querySelectorAll('[class^=scenario]').forEach(scenario => {
        try {
            let crimeTitleElement = scenario.querySelector('[class^=wrapper___] > [class^=panel___] > [class^=panelTitle___]');
            if (!crimeTitleElement) return;

            let crimeTitle = crimeTitleElement.textContent;
            let crimeTitleRequirements = crimeRequirements[crimeTitle];
            if (crimeTitleRequirements === undefined) return;

            let crimeParentRow = scenario.parentNode || scenario;
            crimeParentRow.querySelectorAll('[class^=wrapper___] > [class^=wrapper___]').forEach(crime => {
                processCrimeRole(crime, crimeTitleRequirements);
            });
        } catch (e) {
            // Silent error handling
        }
    });
}

// Force refresh function with detailed logging
function forceRefresh() {
    try {
        console.log('OC Requirements: Forcing refresh...');
        setStoredValue('oc_cache_timestamp', 0);
        console.log('OC Requirements: Cache cleared');
        initialize();
    } catch (e) {
        console.log('OC Requirements: Error during refresh =', e.message);
    }
}

// Diagnostic function for troubleshooting
function runDiagnostics() {
    console.log('=== OC REQUIREMENTS DIAGNOSTICS ===');
    console.log('Current URL:', window.location.href);
    console.log('On crimes tab:', window.location.href.indexOf(CRIMES_TAB) > -1);
    console.log('GM_xmlhttpRequest available:', typeof GM_xmlhttpRequest !== 'undefined');
    console.log('fetch available:', typeof fetch !== 'undefined');
    console.log('CSV URL:', REQUIREMENTS_CSV_URL);

    // Test storage
    try {
        setStoredValue('test_key', 'test_value');
        const testValue = getStoredValue('test_key', null);
        console.log('Storage test:', testValue === 'test_value' ? 'PASS' : 'FAIL');
    } catch (e) {
        console.log('Storage test: FAIL -', e.message);
    }

    // Test CSV loading
    console.log('Testing CSV fetch...');
    fetchRequirements().then(result => {
        console.log('Fetch test result:', result === FALLBACK_REQUIREMENTS ? 'USED_FALLBACK' : 'SUCCESS');
        console.log('Requirements loaded:', Object.keys(result).length, 'crimes');
        console.log('=== DIAGNOSTICS COMPLETE ===');
    }).catch(e => {
        console.log('Fetch test: ERROR -', e.message);
        console.log('=== DIAGNOSTICS COMPLETE ===');
    });
}

// Main initialization function
async function initialize() {
    if (isInitialized) return;

    try {
        // Load requirements
        crimeRequirements = await fetchRequirements();

        // Set up observer
        const observerSet = setupObserver();

        // Apply to existing crimes if on the crimes tab
        if (window.location.href.indexOf(CRIMES_TAB) > -1) {
            setTimeout(applyToExistingCrimes, 1000);
        }

        isInitialized = true;
        console.log('OC Requirements: Initialized successfully');

    } catch (e) {
        console.log('OC Requirements: Initialization failed, using fallback data');
        crimeRequirements = FALLBACK_REQUIREMENTS;
        setupObserver();
        if (window.location.href.indexOf(CRIMES_TAB) > -1) {
            setTimeout(applyToExistingCrimes, 1000);
        }
        isInitialized = true;
    }
}

// Expose functions for testing and debugging
window.ocRefreshRequirements = forceRefresh;
window.ocDiagnostics = runDiagnostics;

console.log('OC Requirements: Script loaded');
console.log('Available commands: ocRefreshRequirements(), ocDiagnostics()');

// Start the script
initialize();
// initialize();
