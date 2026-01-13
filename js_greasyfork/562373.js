// ==UserScript==
// @name         OC Preferred Roles Highlighter
// @namespace    http://torn.com/
// @version      2.5
// @description  Highlights preferred roles in Organized Crimes with custom thresholds per role
// @author       srsbsns
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562373/OC%20Preferred%20Roles%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/562373/OC%20Preferred%20Roles%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // PREFERRED ROLES CONFIGURATION
    // Each crime has specific roles with their own success chance thresholds
    // Format: "Crime Name": { "Role Name": { min: X, max: Y } }
    // Role will be highlighted if success is >= min and <= max
    // ============================================================================
    const CRIME_ROLE_THRESHOLDS = {
        "Gaslight the Way": {
            "Imitator #1": { min: 60, max: 100 },
            "Imitator #2": { min: 70, max: 100 },
            "Imitator #3": { min: 75, max: 100 },
            "Looter #1": { min: 55, max: 100 },
            "Looter #2": { min: 0, max: 50 },
            "Looter #3": { min: 60, max: 100 }
        },
        "Counter Offer": {
            "Robber": { min: 75, max: 100 },
            "Engineer": { min: 75, max: 100 },
            "Picklock": { min: 70, max: 100 },
            "Hacker": { min: 70, max: 100 },
            "Looter": { min: 65, max: 100 }
        },
        "No Reserve": {
            "Techie": { min: 75, max: 100 },
            "Engineer": { min: 70, max: 100 },
            "Car Thief": { min: 70, max: 100 }
        },
        "Bidding War": {
            "Robber #1": { min: 65, max: 100 },
            "Robber #2": { min: 70, max: 100 },
            "Robber #3": { min: 75, max: 100 },
            "Bomber #1": { min: 67, max: 100 },
            "Bomber #2": { min: 70, max: 100 },
            "Driver": { min: 70, max: 100 }
        },
        "Honey Trap": {
            "Muscle #1": { min: 70, max: 100 },
            "Muscle #2": { min: 75, max: 100 },
            "Enforcer": { min: 70, max: 100 }
        },
        "Blast from the Past": {
            "Muscle": { min: 75, max: 100 },
            "Engineer": { min: 73, max: 100 },
            "Bomber": { min: 70, max: 100 },
            "Hacker": { min: 70, max: 100 },
            "Picklock #1": { min: 70, max: 100 },
            "Picklock #2": { min: 40, max: 100 }
        },
        "Break the Bank": {
            "Muscle #1": { min: 60, max: 100 },
            "Muscle #2": { min: 60, max: 100 },
            "Muscle #3": { min: 63, max: 100 },
            "Thief #1": { min: 60, max: 100 },
            "Thief #2": { min: 62, max: 100 }
        }
    };

    // ============================================================================
    // STYLES
    // ============================================================================
    GM_addStyle(`
        /* Highlight available roles that meet threshold in blue */
        .oc-preferred-role {
            background-color: rgba(0, 47, 255, 0.15) !important;
            border: 2px solid #002FFF !important;
        }

        /* Highlight filled roles that DO meet threshold in blue */
        .oc-good-role {
            background-color: rgba(0, 47, 255, 0.15) !important;
            border: 2px solid #002FFF !important;
        }

        /* Highlight filled roles that DON'T meet threshold in red */
        .oc-bad-role {
            background-color: rgba(255, 0, 0, 0.15) !important;
            border: 2px solid #ff0000 !important;
            box-shadow: 0 0 8px rgba(255, 0, 0, 0.3) !important;
            position: relative !important;
        }

        /* Requirement badge for bad roles */
        .oc-requirement-badge {
            position: absolute !important;
            top: 2px !important;
            right: 2px !important;
            background: #ff0000 !important;
            color: #ffffff !important;
            font-size: 9px !important;
            font-weight: bold !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            z-index: 100 !important;
            pointer-events: none !important;
            white-space: nowrap !important;
        }
    `);

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    function sanitize(text) {
        return text.trim().replace(/\s+/g, ' ');
    }

    function isOnCrimesTab() {
        const hash = window.location.hash || '';
        return hash.includes('tab=crimes') || window.location.href.includes('type=1');
    }

    function normalizeRoleName(roleName) {
        // Normalize role names for matching (handle case and spacing differences)
        return roleName.toLowerCase().trim();
    }

    // ============================================================================
    // MAIN ANNOTATION LOGIC
    // ============================================================================
    function highlightPreferredRoles() {
        if (!isOnCrimesTab()) return;

        // Find all crime containers - each has data-oc-id
        const crimeContainers = document.querySelectorAll('[data-oc-id]');

        crimeContainers.forEach(container => {
            // Find crime name in panelTitle
            const nameElement = container.querySelector('.panelTitle___aoGuV, [class*="panelTitle"]');
            if (!nameElement) return;

            const crimeName = sanitize(nameElement.textContent);

            // Check if this crime has configured thresholds
            const roleThresholds = CRIME_ROLE_THRESHOLDS[crimeName];
            if (!roleThresholds) return; // Skip crimes not in our config

            // Find all role slots - wrapper___Lpz_D contains the role
            const roleSlots = container.querySelectorAll('.wrapper___Lpz_D, [class*="wrapper___L"]');

            roleSlots.forEach(roleSlot => {
                // Remove any existing highlighting first
                roleSlot.classList.remove('oc-preferred-role', 'oc-good-role', 'oc-bad-role');

                // Get role name from title___UqFNy span
                const roleNameElement = roleSlot.querySelector('.title___UqFNy, [class*="title___"]');
                if (!roleNameElement) return;

                const roleName = sanitize(roleNameElement.textContent);

                // Get success chance number
                const successElement = roleSlot.querySelector('.successChance___ddHsR, [class*="successChance"]');
                const successChance = successElement ? Number(successElement.textContent.trim()) : 0;

                // Check if JOIN button is available (not disabled)
                const joinButton = roleSlot.querySelector('.joinButton___Ikoyy, [class*="joinButton"]');
                const roleIsFilled = !joinButton || joinButton.disabled;

                // Check if this specific role has a threshold configured
                let roleConfig = null;

                // Try exact match first
                if (roleThresholds[roleName]) {
                    roleConfig = roleThresholds[roleName];
                } else {
                    // Try normalized matching (case-insensitive)
                    const normalizedRoleName = normalizeRoleName(roleName);
                    for (const [configRoleName, config] of Object.entries(roleThresholds)) {
                        if (normalizeRoleName(configRoleName) === normalizedRoleName) {
                            roleConfig = config;
                            break;
                        }
                    }
                }

                // If this role has a threshold configured, check if it meets criteria
                if (roleConfig) {
                    const meetsThreshold = successChance >= roleConfig.min && successChance <= roleConfig.max;

                    if (meetsThreshold) {
                        // Meets threshold - highlight BLUE (whether filled or available)
                        if (roleIsFilled) {
                            roleSlot.classList.add('oc-good-role');
                        } else {
                            roleSlot.classList.add('oc-preferred-role');
                        }
                    } else {
                        // Doesn't meet threshold - highlight RED (whether filled or available)
                        roleSlot.classList.add('oc-bad-role');
                        
                        // Add requirement badge
                        const existingBadge = roleSlot.querySelector('.oc-requirement-badge');
                        if (existingBadge) existingBadge.remove();
                        
                        const badge = document.createElement('div');
                        badge.className = 'oc-requirement-badge';
                        
                        // Format the requirement text
                        let reqText = '';
                        if (roleConfig.min > 0 && roleConfig.max >= 100) {
                            reqText = `req. >${roleConfig.min}%`;
                        } else if (roleConfig.min === 0 && roleConfig.max < 100) {
                            reqText = `req. <${roleConfig.max}%`;
                        } else if (roleConfig.min > 0 && roleConfig.max < 100) {
                            reqText = `req. ${roleConfig.min}-${roleConfig.max}%`;
                        }
                        
                        badge.textContent = reqText;
                        roleSlot.appendChild(badge);
                    }
                }
            });
        });
    }

    // ============================================================================
    // MUTATION OBSERVER
    // ============================================================================
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        // Debounce to prevent too many rapid calls
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (isOnCrimesTab()) {
                highlightPreferredRoles();
            }
        }, 500); // Wait 500ms before processing
    });

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    function init() {
        console.log('[OC Roles] Script initialized (v2.3)');

        // Initial highlight
        setTimeout(() => {
            highlightPreferredRoles();
        }, 2000);

        // Watch for changes (React app)
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Re-run on hash change
        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                highlightPreferredRoles();
            }, 500);
        });

        // Periodic check (reduced frequency)
        setInterval(() => {
            if (isOnCrimesTab()) {
                highlightPreferredRoles();
            }
        }, 10000); // Every 10 seconds instead of 5
    }

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();