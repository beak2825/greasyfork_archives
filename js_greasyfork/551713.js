// ==UserScript==
// @name         Game Debug Mode + Manual Stat Booster (Refined)
// @match        https://*.devvit.net/index.html*
// @grant        GM_addStyle
// @description  Fun script for Sword and Supper
// @version 0.0.1.20251005230329
// @namespace https://greasyfork.org/users/1522633
// @downloadURL https://update.greasyfork.org/scripts/551713/Game%20Debug%20Mode%20%2B%20Manual%20Stat%20Booster%20%28Refined%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551713/Game%20Debug%20Mode%20%2B%20Manual%20Stat%20Booster%20%28Refined%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createTargetedStats() {
        // Only modify the specific stats requested
        return {
            MaxHp: {
                key: "MaxHp",
                level: 999,
                value: 36036  // Very high health
            },
            Attack: {
                key: "Attack",
                level: 999,
                value: 6006   // Very high attack
            },
            Defense: {
                key: "Defense",
                level: 999,
                value: 5005   // Very high defense
            },
            Speed: {
                key: "Speed",
                level: 999,
                value: 1000   // Max speed
            },
            Dodge: {
                key: "Dodge",
                level: 999,
                value: 0.99   // 99% dodge chance
            },
            Crit: {
                key: "Crit",
                level: 999,
                value: 0.99   // 99% crit chance
            }
            // Deliberately NOT modifying: Gold, Gem, Lives, Level, etc.
        };
    }

    function createStatsOnlyProfile() {
        // Get current profile first to preserve other values
        const targetStats = createTargetedStats();

        // Only send the stats we want to modify, preserve everything else
        return {
            stats: targetStats
            // Don't include Level, Lives, Gold, Gem, etc. - let server keep original values
        };
    }

    function enableDebugMode() {
        console.log('🚀 Enabling debug mode...');

        window.postMessage({
            type: "devvit-message",
            data: {
                message: {
                    type: "options",
                    data: {
                        devMode: true
                    }
                }
            }
        }, "*");
    }

    function boostPlayerStats() {
        console.log('💪 Boosting combat stats only...');

        window.postMessage({
            type: "devvit-message",
            data: {
                message: {
                    type: "playerProfile",
                    data: {
                        stats: createStatsOnlyProfile()
                    }
                }
            }
        }, "*");

        console.log('✅ Combat stats boosted (HP, Attack, Defense, Speed, Crit, Dodge)!');

        // Visual feedback
        const statButton = document.getElementById('stat-boost-button');
        if (statButton) {
            const originalText = statButton.textContent;
            statButton.textContent = '✅ BOOSTED!';
            statButton.style.background = 'linear-gradient(135deg, #00ff00, #008800)';

            setTimeout(() => {
                statButton.textContent = originalText;
                statButton.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
            }, 2000);
        }
    }

    function createStatBoostButton() {
        const statButton = document.createElement('div');
        statButton.id = 'stat-boost-button';
        statButton.textContent = 'BOOST STATS';
        statButton.style.cssText = `
            position: fixed;
            top: 110px;  /* Closer to debug button */
            left: 0;
            width: 80px;   /* Smaller width */
            height: 40px;  /* Smaller height */
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            border: 2px solid #ff4500;  /* Thinner border */
            border-radius: 6px;
            cursor: pointer;
            z-index: 999999;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 10px;  /* Smaller font */
            text-align: center;
            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.4);
            transition: all 0.3s ease;
            user-select: none;
        `;

        statButton.addEventListener('mouseenter', () => {
            statButton.style.transform = 'scale(1.05)';
            statButton.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.6)';
        });

        statButton.addEventListener('mouseleave', () => {
            statButton.style.transform = 'scale(1)';
            statButton.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.4)';
        });

        statButton.addEventListener('click', (e) => {
            e.stopPropagation();
            boostPlayerStats();
        });

        document.body.appendChild(statButton);
        console.log('🎯 Stat boost button created!');

        return statButton;
    }

    function createNetworkExploitButton() {
        const exploitButton = document.createElement('div');
        exploitButton.id = 'exploit-button';
        exploitButton.textContent = 'EXPLOITS';
        exploitButton.style.cssText = `
            position: fixed;
            top: 160px;  /* Below stat button */
            left: 0;
            width: 80px;   /* Smaller width */
            height: 40px;  /* Smaller height */
            background: linear-gradient(135deg, #9b59b6, #8e44ad);
            color: white;
            border: 2px solid #8e44ad;  /* Thinner border */
            border-radius: 6px;
            cursor: pointer;
            z-index: 999999;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 10px;  /* Smaller font */
            text-align: center;
            box-shadow: 0 2px 8px rgba(155, 89, 182, 0.4);
            transition: all 0.3s ease;
            user-select: none;
        `;

        exploitButton.addEventListener('mouseenter', () => {
            exploitButton.style.transform = 'scale(1.05)';
            exploitButton.style.boxShadow = '0 4px 12px rgba(155, 89, 182, 0.6)';
        });

        exploitButton.addEventListener('mouseleave', () => {
            exploitButton.style.transform = 'scale(1)';
            exploitButton.style.boxShadow = '0 2px 8px rgba(155, 89, 182, 0.4)';
        });

        exploitButton.addEventListener('click', (e) => {
            e.stopPropagation();
            startBackgroundExploits();
        });

        document.body.appendChild(exploitButton);
        console.log('🌐 Network exploit button created!');

        return exploitButton;
    }

    let exploitRunning = false;

    function startBackgroundExploits() {
        if (exploitRunning) {
            console.log('⚠️ Exploits already running...');
            return;
        }

        exploitRunning = true;
        console.log('🌐 Starting background exploits...');

        const exploitButton = document.getElementById('exploit-button');
        if (exploitButton) {
            exploitButton.textContent = 'RUNNING...';
            exploitButton.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        }

        // Continuous login bonus farming - no delays
        let bonusCount = 0;
        const bonusFarming = setInterval(() => {
            // Send login bonus claim
            window.postMessage({
                type: "devvit-message",
                data: {
                    message: {
                        type: "playerLoginBonusClaimed"
                    }
                }
            }, "*");

            bonusCount++;
            console.log(`💰 Login bonus attempt #${bonusCount}`);

            // Also try the direct network call method
            if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({
                    type: "playerLoginBonusClaimed"
                }, "*");
            }

        }, 100); // Every 100ms for rapid fire

        // Lives boost every 5 seconds
        const livesBoost = setInterval(() => {
            window.postMessage({
                type: "devvit-message",
                data: {
                    message: {
                        type: "playerLivesUpdated",
                        amount: 999
                    }
                }
            }, "*");
            console.log('❤️ Lives boost sent');
        }, 5000);

        // Stop after 30 seconds to prevent spam
        setTimeout(() => {
            clearInterval(bonusFarming);
            clearInterval(livesBoost);
            exploitRunning = false;

            console.log(`✅ Background exploits completed! Sent ${bonusCount} login bonus attempts.`);

            if (exploitButton) {
                exploitButton.textContent = '✅ DONE!';
                exploitButton.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

                setTimeout(() => {
                    exploitButton.textContent = 'EXPLOITS';
                    exploitButton.style.background = 'linear-gradient(135deg, #9b59b6, #8e44ad)';
                }, 3000);
            }
        }, 30000); // Run for 30 seconds

        console.log('🚀 Background exploits started! Will run for 30 seconds...');
    }

    function fixDebugButtonOnly() {
        GM_addStyle(`
            [style*="position: fixed"][style*="top: 0"][style*="left: 0"][style*="width: 100px"][style*="height: 100px"] {
                pointer-events: auto !important;
                z-index: 999999 !important;
                background-color: rgba(255,0,0,0.8) !important;
                border: 3px solid #ff0000 !important;
                border-radius: 8px !important;
            }

            #stat-boost-button, #exploit-button {
                z-index: 1000000 !important;
            }
        `);
    }

    function makeDebugButtonClickable() {
        const debugBtn = document.querySelector('[style*="rgba(255,0,0,0.1)"]');
        if (debugBtn) {
            console.log('🎯 Making debug button clickable...');
            debugBtn.style.pointerEvents = 'auto';
            debugBtn.style.zIndex = '999999';

            debugBtn.addEventListener('mousedown', function(e) {
                e.stopPropagation();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                debugBtn.dispatchEvent(clickEvent);
            }, true);

            console.log('🔴 Debug button ready!');
            return true;
        }
        return false;
    }

    function main() {
        console.log('🎮 Game Enhancement Script (Refined Version)');

        fixDebugButtonOnly();
        createStatBoostButton();
        createNetworkExploitButton();

        setTimeout(() => {
            enableDebugMode();

            setTimeout(() => {
                let attempts = 0;
                const checkForDebugButton = setInterval(() => {
                    attempts++;
                    if (makeDebugButtonClickable() || attempts > 10) {
                        clearInterval(checkForDebugButton);
                    }
                }, 1000);
            }, 1000);
        }, 3000);

        console.log('🎮 Controls:');
        console.log('🔴 Red (100x100) = Debug menu');
        console.log('🟠 Orange (80x40) = Boost combat stats only');
        console.log('🟣 Purple (80x40) = Background exploits (30s)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();