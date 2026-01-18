// ==UserScript==
// @name         PD2 Market - Base Stats Without Sockets
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows base item stats without jewel/rune bonuses on Project Diablo 2 market
// @author       Nikrozja powered by AI
// @match        https://www.projectdiablo2.com/market*
// @icon         https://www.projectdiablo2.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563147/PD2%20Market%20-%20Base%20Stats%20Without%20Sockets.user.js
// @updateURL https://update.greasyfork.org/scripts/563147/PD2%20Market%20-%20Base%20Stats%20Without%20Sockets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('PD2 Market Stats - Script started');

    const STAT_CONFIG = [
        { regex: /\+(\d+) to Attack Rating against Undead/, key: 'arUndead' },
        { regex: /\+(\d+) to Attack Rating against Demons/, key: 'arDemons' },
        { regex: /\+(\d+) to Attack Rating(?! against)/, key: 'ar' },
        { regex: /\+(\d+) to Mana after each Kill/, key: 'manaPerKill' },
        { regex: /\+(\d+) to Mana(?! after)/, key: 'mana' },
        { regex: /\+(\d+) to Life after each Kill/, key: 'lifePerKill' },
        { regex: /\+(\d+) to Life(?! after)/, key: 'life' },
        { regex: /\+?(\d+)% Enhanced Damage/, key: 'ed' },
        { regex: /\+(\d+) to Minimum Damage/, key: 'minDmg' },
        { regex: /\+(\d+) to Maximum Damage/, key: 'maxDmg' },
        { regex: /(\d+)% Increased Attack Speed/, key: 'ias' },
        { regex: /(\d+)% Deadly Strike /, key: 'ds' },
        { regex: /\+?(\d+)% Fire Resist/, key: 'fireRes' },
        { regex: /\+?(\d+)% Cold Resist/, key: 'coldRes' },
        { regex: /\+?(\d+)% Lightning Resist/, key: 'lightningRes' },
        { regex: /\+?(\d+)% Poison Resist/, key: 'poisonRes' },
        { regex: /All Resistances \+?(\d+)/, key: 'allRes' },
        { regex: /(\d+)% Faster Hit Recovery/, key: 'fhr' },
        { regex: /(\d+)% Faster Cast Rate/, key: 'fcr' },
        { regex: /\+?(\d+)% to Fire Skill Damage/, key: 'fireSkillDmg' },
        { regex: /\+?(\d+)% to Cold Skill Damage/, key: 'coldSkillDmg' },
        { regex: /\+?(\d+)% to Lightning Skill Damage/, key: 'lightningSkillDmg' },
        { regex: /\+?(\d+)% to Poison Skill Damage/, key: 'poisonSkillDmg' },
        { regex: /[-−](\d+)% to Enemy Fire Resistance/, key: 'enemyFireRes' },
        { regex: /[-−](\d+)% to Enemy Cold Resistance/, key: 'enemyColdRes' },
        { regex: /[-−](\d+)% to Enemy Lightning Resistance/, key: 'enemyLightningRes' },
        { regex: /[-−](\d+)% to Enemy Poison Resistance/, key: 'enemyPoisonRes' },
        { regex: /[-−](\d+)% to Enemy Physical Resistance/, key: 'enemyPhysRes' }
    ];

    function getSocketBonuses(listingElement) {
        const bonuses = {};
        STAT_CONFIG.forEach(s => bonuses[s.key] = 0);

        const sockets = listingElement.querySelectorAll('.socket');

        console.log(`Found ${sockets.length} sockets`);

        sockets.forEach(socket => {
            const socketProps = socket.querySelectorAll('.property');
            socketProps.forEach(prop => {
                const text = prop.textContent.trim();
                console.log(`Socket property text: "${text}"`);

                STAT_CONFIG.forEach(stat => {
                    const match = text.match(stat.regex);
                    if(match) {
                        const value = parseInt(match[1]);
                        bonuses[stat.key] += value;
                        console.log(`✓ Socket bonus: ${stat.key} +${value}`);
                    }
                });
            });
        });

        return bonuses;
    }

    function processListing(listing) {
        if(listing.classList.contains('pd2-processed')) return;
        listing.classList.add('pd2-processed');

        console.log('--- Processing listing ---');

        const socketBonuses = getSocketBonuses(listing);

        const propertiesSection = listing.querySelector('.properties');
        if(!propertiesSection) {
            console.log('❌ .properties section not found');
            return;
        }

        const allProps = propertiesSection.querySelectorAll('.property');
        console.log(`Found ${allProps.length} properties in main section`);

        allProps.forEach((prop, index) => {
            if(prop.closest('.socket')) return;

            const text = prop.textContent.trim();
            console.log(`[${index}] Property: "${text}"`);

            STAT_CONFIG.forEach(stat => {
                const match = text.match(stat.regex);
                if(match) {
                    const total = parseInt(match[1]);
                    const socketBonus = socketBonuses[stat.key] || 0;
                    const base = total - socketBonus;

                    console.log(`  ✓ Match! ${stat.key}: Total=${total}, Socket=${socketBonus}, Base=${base}`);

                    if(socketBonus !== 0 && !prop.querySelector('.pd2-base-stat')) {
                        const firstSpan = prop.querySelector('span');
                        if(firstSpan) {
                            const baseInfo = document.createElement('span');
                            baseInfo.className = 'pd2-base-stat';
                            baseInfo.style.color = '#10b981';
                            baseInfo.style.fontWeight = 'bold';
                            baseInfo.style.marginLeft = '6px';
                            baseInfo.textContent = `(base: ${base})`;
                            firstSpan.appendChild(baseInfo);
                            console.log(`  ✓✓ Added base info!`);
                        }
                    }
                }
            });
        });

        console.log('--- End of processing ---\n');
    }

    function findAndProcessListings() {
        let listings = document.querySelectorAll('a[href^="/market/listing/"]');

        console.log(`\n=== Searching listings: found ${listings.length} ===`);

        listings.forEach((link, idx) => {
            console.log(`\nListing ${idx + 1}:`);
            let container = link;
            let depth = 0;

            while(container && depth < 10) {
                if(container.querySelector && container.querySelector('.properties')) {
                    processListing(container);
                    break;
                }
                container = container.parentElement;
                depth++;
            }
        });
    }

    function init() {
        console.log('Initializing script...');
        setTimeout(findAndProcessListings, 2000);
    }

    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if(node.nodeType === 1 && (node.matches('a[href^="/market/listing/"]') || node.querySelector('a[href^="/market/listing/"]'))) {
                    shouldProcess = true;
                }
            });
        });
        if(shouldProcess) {
            setTimeout(findAndProcessListings, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();