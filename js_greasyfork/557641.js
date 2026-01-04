// ==UserScript==
// @name         Manarion Woodcutting vs Farms
// @namespace    http://tampermonkey.net/
// @version      8.1.0
// @description  Compares Woodcutting Research vs Farm upgrades cost
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manarion.com
// @match        *://manarion.com/*
// @author       LincolnLawyer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557641/Manarion%20Woodcutting%20vs%20Farms.user.js
// @updateURL https://update.greasyfork.org/scripts/557641/Manarion%20Woodcutting%20vs%20Farms.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Manarion Woodcutting vs Farms v8.1.0 loading...');

    // YOUR CURRENT MARKET PRICES (Update these!)
    const MARKET = {
        shard: 2295,  // Elemental Shard sell price
        iron: 139,    // Iron sell price
        wood: 138,    // Wood sell price
        fish: 133     // Fish sell price
    };

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'woodcutting-vs-farms';
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 420px;
        background: #000000;
        border: 3px solid #ff9900;
        border-radius: 10px;
        color: #ff9900;
        font-family: 'Courier New', monospace;
        z-index: 99999;
        box-shadow: 0 0 20px rgba(255, 153, 0, 0.5);
    `;

    overlay.innerHTML = `
        <div style="background: #332200; padding: 12px 15px; border-bottom: 2px solid #ff9900; display: flex; justify-content: space-between; align-items: center; cursor: move;">
            <div style="font-weight: bold; font-size: 14px;">🪓 Woodcutting vs Farms v8.1.0</div>
            <button id="close-btn" style="background: #ff0000; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 16px;">×</button>
        </div>
        <div id="content" style="padding: 15px;">
            <div id="loading">Loading...</div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Make draggable
    const header = overlay.querySelector('div');
    let dragging = false;
    let offset = { x: 0, y: 0 };
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.id === 'close-btn') return;
        dragging = true;
        const rect = overlay.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        overlay.style.left = (e.clientX - offset.x) + 'px';
        overlay.style.top = (e.clientY - offset.y) + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        dragging = false;
    });

    // Close button
    document.getElementById('close-btn').addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // Parse numbers with M suffix
    function parseM(numberStr) {
        if (!numberStr) return 0;
        const num = parseFloat(numberStr.replace(/[^\d.]/g, ''));
        return numberStr.toLowerCase().includes('m') ? num * 1000000 : num;
    }

    // Format numbers
    function format(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(0);
    }

    // Get costs from page
    function getCosts() {
        const text = document.body.textContent;
        const costs = {};

        // Woodcutting Research: 1.09M [Elemental Shards]
        const wcMatch = text.match(/Woodcutting.*?([\d.]+M?)\s*\[Elemental Shards\]/i);
        if (wcMatch) {
            costs.woodcutting = parseM(wcMatch[1]);
        } else {
            costs.woodcutting = 1090000; // 1.09M default
        }

        // Harvest Golems: 253.55M [Iron]
        const golemsMatch = text.match(/Harvest Golems.*?([\d.]+M?)\s*\[Iron\]/i);
        if (golemsMatch) {
            costs.golems = parseM(golemsMatch[1]);
        } else {
            costs.golems = 253550000; // 253.55M default
        }

        // Fertilizer: 242.09M [Fish]
        const fertMatch = text.match(/Fertilizer.*?([\d.]+M?)\s*\[Fish\]/i);
        if (fertMatch) {
            costs.fertilizer = parseM(fertMatch[1]);
        } else {
            costs.fertilizer = 242090000; // 242.09M default
        }

        // Plots: 222.34M [Wood]
        const plotsMatch = text.match(/Plots.*?([\d.]+M?)\s*\[Wood\]/i);
        if (plotsMatch) {
            costs.plots = parseM(plotsMatch[1]);
        } else {
            costs.plots = 222340000; // 222.34M default
        }

        return costs;
    }

    // Calculate total costs
    function calculateTotalCosts(costs) {
        return {
            woodcutting: costs.woodcutting * MARKET.shard,
            golems: costs.golems * MARKET.iron,
            fertilizer: costs.fertilizer * MARKET.fish,
            plots: costs.plots * MARKET.wood
        };
    }

    // Find cheapest
    function findCheapest(totalCosts) {
        const entries = Object.entries(totalCosts);
        entries.sort((a, b) => a[1] - b[1]);
        return entries[0]; // [name, cost]
    }

    // Update display
    function update() {
        const content = document.getElementById('content');
        
        try {
            const costs = getCosts();
            const totals = calculateTotalCosts(costs);
            const cheapest = findCheapest(totals);

            let html = `
                <div style="margin-bottom: 15px;">
                    <div style="color: #ffcc00; font-weight: bold; margin-bottom: 10px; font-size: 14px;">💰 Market Prices</div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 10px;">
                        <div style="background: #332200; padding: 8px; border-radius: 5px; border: 1px solid #664400; text-align: center;">
                            <div style="color: #ffcc99; font-size: 11px;">Elemental Shard</div>
                            <div style="color: #ff9900; font-weight: bold; font-size: 13px;">${format(MARKET.shard)}</div>
                        </div>
                        <div style="background: #332200; padding: 8px; border-radius: 5px; border: 1px solid #664400; text-align: center;">
                            <div style="color: #ffcc99; font-size: 11px;">Iron</div>
                            <div style="color: #ff9900; font-weight: bold; font-size: 13px;">${format(MARKET.iron)}</div>
                        </div>
                        <div style="background: #332200; padding: 8px; border-radius: 5px; border: 1px solid #664400; text-align: center;">
                            <div style="color: #ffcc99; font-size: 11px;">Wood</div>
                            <div style="color: #ff9900; font-weight: bold; font-size: 13px;">${format(MARKET.wood)}</div>
                        </div>
                        <div style="background: #332200; padding: 8px; border-radius: 5px; border: 1px solid #664400; text-align: center;">
                            <div style="color: #ffcc99; font-size: 11px;">Fish</div>
                            <div style="color: #ff9900; font-weight: bold; font-size: 13px;">${format(MARKET.fish)}</div>
                        </div>
                    </div>
                </div>

                <div style="background: #442200; border: 3px solid #ffcc00; border-radius: 8px; padding: 15px; margin-bottom: 15px; animation: pulse 2s infinite;">
                    <style>
                        @keyframes pulse {
                            0% { border-color: #ffcc00; box-shadow: 0 0 10px rgba(255,204,0,0.5); }
                            50% { border-color: #ff9900; box-shadow: 0 0 20px rgba(255,153,0,0.8); }
                            100% { border-color: #ffcc00; box-shadow: 0 0 10px rgba(255,204,0,0.5); }
                        }
                    </style>
                    <div style="color: #ffcc00; font-weight: bold; margin-bottom: 10px; font-size: 15px;">🎯 Cheapest to Buy</div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: white; font-weight: bold; font-size: 16px;">
                            ${cheapest[0] === 'woodcutting' ? '🪓 Woodcutting Research' : 
                              cheapest[0] === 'golems' ? '🤖 Harvest Golems' :
                              cheapest[0] === 'fertilizer' ? '🌱 Fertilizer' : '📦 Plots'}
                        </span>
                        <span style="color: #00ff00; font-weight: bold; font-size: 18px;">${format(cheapest[1])}</span>
                    </div>
                    <div style="font-size: 13px; color: #ffcc99;">
                        ${cheapest[0] === 'woodcutting' ? 
                            `Buy ${format(costs.woodcutting)} Shards × ${format(MARKET.shard)}` :
                          cheapest[0] === 'golems' ? 
                            `Buy ${format(costs.golems)} Iron × ${format(MARKET.iron)}` :
                          cheapest[0] === 'fertilizer' ? 
                            `Buy ${format(costs.fertilizer)} Fish × ${format(MARKET.fish)}` :
                            `Buy ${format(costs.plots)} Wood × ${format(MARKET.wood)}`}
                    </div>
                </div>

                <div style="color: #ff9900; font-weight: bold; margin-bottom: 10px; font-size: 14px;">📊 All Costs</div>
            `;

            // Show all options
            const options = [
                { key: 'woodcutting', name: 'Woodcutting Research', cost: totals.woodcutting, resource: 'Shards', amount: costs.woodcutting },
                { key: 'plots', name: 'Plots', cost: totals.plots, resource: 'Wood', amount: costs.plots },
                { key: 'fertilizer', name: 'Fertilizer', cost: totals.fertilizer, resource: 'Fish', amount: costs.fertilizer },
                { key: 'golems', name: 'Harvest Golems', cost: totals.golems, resource: 'Iron', amount: costs.golems }
            ];

            options.sort((a, b) => a.cost - b.cost);

            options.forEach(option => {
                const isCheapest = option.key === cheapest[0];
                const bgColor = isCheapest ? '#332200' : '#221100';
                const borderColor = isCheapest ? '#ffcc00' : '#664400';
                
                html += `
                    <div style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: ${isCheapest ? '#ffcc00' : 'white'}; font-weight: ${isCheapest ? 'bold' : 'normal'};">
                                ${isCheapest ? '🏆 ' : ''}${option.name}
                            </span>
                            <span style="color: #00ff00; font-weight: bold;">${format(option.cost)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #ffcc99;">
                            <span>${format(option.amount)} ${option.resource}</span>
                            <span>× ${format(MARKET[option.resource.toLowerCase()])} each</span>
                        </div>
                    </div>
                `;
            });

            // Show the math
            html += `
                <div style="margin-top: 15px; padding: 12px; background: #221100; border: 1px solid #664400; border-radius: 6px;">
                    <div style="color: #ffcc00; font-weight: bold; margin-bottom: 8px; font-size: 13px;">🧮 Cost Comparison</div>
                    <div style="font-size: 12px; color: #ffcc99; line-height: 1.4;">
                        <div>Woodcutting: ${format(costs.woodcutting)} Shards × ${format(MARKET.shard)} = <strong>${format(totals.woodcutting)}</strong></div>
                        <div>Plots: ${format(costs.plots)} Wood × ${format(MARKET.wood)} = ${format(totals.plots)} (${(totals.plots/totals.woodcutting).toFixed(1)}x more)</div>
                        <div>Fertilizer: ${format(costs.fertilizer)} Fish × ${format(MARKET.fish)} = ${format(totals.fertilizer)} (${(totals.fertilizer/totals.woodcutting).toFixed(1)}x more)</div>
                        <div>Golems: ${format(costs.golems)} Iron × ${format(MARKET.iron)} = ${format(totals.golems)} (${(totals.golems/totals.woodcutting).toFixed(1)}x more)</div>
                    </div>
                </div>

                <div style="text-align: center; font-size: 11px; color: #ffcc99; margin-top: 15px; padding-top: 10px; border-top: 1px solid #664400;">
                    v8.1.0 • Only compares Woodcutting vs Farms<br>
                    Updates every 5s • By LincolnLawyer
                </div>
            `;

            content.innerHTML = html;

        } catch (error) {
            content.innerHTML = `
                <div style="color: #ff5555; text-align: center; padding: 20px;">
                    Error: ${error.message}
                </div>
            `;
        }
    }

    // Initialize
    setTimeout(() => {
        update();
        setInterval(update, 5000); // Update every 5 seconds
    }, 1000);

})();