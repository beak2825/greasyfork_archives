// ==UserScript==
// @name         Seiko Mod Quick Reference Guide 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Universal Seiko modding reference guide accessible on any website. Press Ctrl+Shift+S for instant access to mod compatibility charts, movement specs, and custom watch inspiration. Perfect companion for Seiko mod watches enthusiasts!
// @author       SkyrimWrist
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554132/Seiko%20Mod%20Quick%20Reference%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/554132/Seiko%20Mod%20Quick%20Reference%20Guide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RESOURCE_URL = 'https://skyrimwrist.com';

    // Comprehensive Seiko mod compatibility database
    const MOD_DATABASE = {
        cases: {
            'SKX007/009': {
                movement: 'NH35, NH36, 4R36, 7S26',
                dialSize: '28.5mm',
                handsHole: '1.5mm',
                crystal: '30.4mm × 3.8mm',
                caseback: '30mm screw-down',
                bezel: '31.5mm outer, 30.5mm inner'
            },
            'SKX013': {
                movement: 'NH35, NH36, 7S26',
                dialSize: '28.5mm',
                handsHole: '1.5mm',
                crystal: '29mm × 3.8mm',
                caseback: '29mm screw-down',
                bezel: '30mm outer'
            },
            'Turtle': {
                movement: 'NH35, NH36, 4R36',
                dialSize: '28.5mm',
                handsHole: '1.5mm',
                crystal: '30.5mm × 4mm',
                caseback: '30mm screw-down',
                bezel: '31.5mm'
            },
            '5KX (SRPD)': {
                movement: 'NH36, 4R36',
                dialSize: '28.5mm',
                handsHole: '1.5mm',
                crystal: '29.5mm',
                caseback: '29mm screw-down',
                bezel: '30.5mm'
            }
        },
        movements: {
            'NH35': {
                diameter: '27.4mm',
                height: '5.32mm',
                jewels: '24',
                frequency: '21,600 bph',
                powerReserve: '41 hours',
                features: 'Hacking, hand-winding',
                dateWheel: 'No (time-only)',
                price: '$$'
            },
            'NH36': {
                diameter: '27.4mm',
                height: '5.32mm',
                jewels: '24',
                frequency: '21,600 bph',
                powerReserve: '41 hours',
                features: 'Hacking, hand-winding, day-date',
                dateWheel: '3 o\'clock',
                price: '$$'
            },
            '4R36': {
                diameter: '27.4mm',
                height: '5.32mm',
                jewels: '24',
                frequency: '21,600 bph',
                powerReserve: '41 hours',
                features: 'Hacking, hand-winding, day-date',
                dateWheel: 'OEM quality',
                price: '$$$'
            },
            '7S26': {
                diameter: '27.4mm',
                height: '5.32mm',
                jewels: '21',
                frequency: '21,600 bph',
                powerReserve: '41 hours',
                features: 'No hacking, automatic-only',
                dateWheel: '3 o\'clock',
                price: '$'
            }
        },
        tools: [
            { name: 'Hand Removal Tool', essential: true, cost: '$' },
            { name: 'Crystal Press', essential: true, cost: '$$' },
            { name: 'Case Opening Tool', essential: true, cost: '$' },
            { name: 'Rodico Cleaning Putty', essential: true, cost: '$' },
            { name: 'Tweezers (Non-magnetic)', essential: true, cost: '$' },
            { name: 'Movement Holder', essential: false, cost: '$' },
            { name: 'Bezel Removal Tool', essential: false, cost: '$' },
            { name: 'Screwdriver Set', essential: true, cost: '$$' }
        ]
    };

    GM_addStyle(`
        #seiko-reference-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 999999999;
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }

        #seiko-reference-overlay.active {
            display: flex;
        }

        .seiko-ref-container {
            width: 90%;
            max-width: 1200px;
            height: 90vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 212, 255, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .seiko-ref-header {
            background: linear-gradient(135deg, #00d4ff 0%, #0096c7 100%);
            padding: 20px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #00d4ff;
        }

        .seiko-ref-title {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .seiko-ref-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            line-height: 1;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .seiko-ref-close:hover {
            background: rgba(255, 0, 0, 0.6);
            transform: rotate(90deg);
        }

        .seiko-ref-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.3);
            padding: 0 20px;
            gap: 5px;
            border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .seiko-ref-tab {
            padding: 15px 25px;
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 3px solid transparent;
            position: relative;
        }

        .seiko-ref-tab:hover {
            color: #00d4ff;
            background: rgba(0, 212, 255, 0.05);
        }

        .seiko-ref-tab.active {
            color: #00d4ff;
            border-bottom-color: #00d4ff;
        }

        .seiko-ref-content {
            flex: 1;
            overflow-y: auto;
            padding: 30px;
            color: #ffffff;
        }

        .seiko-ref-content::-webkit-scrollbar {
            width: 10px;
        }

        .seiko-ref-content::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }

        .seiko-ref-content::-webkit-scrollbar-thumb {
            background: rgba(0, 212, 255, 0.5);
            border-radius: 5px;
        }

        .seiko-ref-content::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 212, 255, 0.7);
        }

        .ref-section {
            display: none;
        }

        .ref-section.active {
            display: block;
        }

        .ref-card {
            background: rgba(0, 212, 255, 0.05);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            transition: all 0.2s;
        }

        .ref-card:hover {
            border-color: #00d4ff;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
            transform: translateY(-2px);
        }

        .ref-card-title {
            font-size: 18px;
            font-weight: 700;
            color: #00d4ff;
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ref-spec-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
        }

        .ref-spec-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .ref-spec-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .ref-spec-value {
            font-size: 14px;
            color: #ffffff;
            font-weight: 500;
        }

        .ref-tools-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 12px;
        }

        .ref-tool-item {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 3px solid transparent;
            transition: all 0.2s;
        }

        .ref-tool-item.essential {
            border-left-color: #ffd700;
        }

        .ref-tool-item:hover {
            background: rgba(0, 212, 255, 0.1);
        }

        .ref-tool-name {
            font-size: 14px;
            color: #ffffff;
            font-weight: 500;
        }

        .ref-tool-badge {
            padding: 4px 10px;
            background: rgba(255, 215, 0, 0.2);
            border-radius: 12px;
            font-size: 11px;
            color: #ffd700;
            font-weight: 600;
        }

        .ref-footer {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px 30px;
            border-top: 1px solid rgba(0, 212, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ref-footer-links {
            display: flex;
            gap: 15px;
        }

        .ref-footer-link {
            padding: 10px 20px;
            background: rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 8px;
            text-decoration: none;
            color: #00d4ff;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .ref-footer-link:hover {
            background: rgba(0, 212, 255, 0.25);
            border-color: #00d4ff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }

        .ref-footer-info {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
        }

        .ref-shortcut-hint {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 212, 255, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
            z-index: 999999998;
            display: none;
            animation: fadeInOut 3s ease-in-out;
        }

        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
            10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        .ref-intro {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 150, 199, 0.1));
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .ref-intro h3 {
            color: #00d4ff;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .ref-intro p {
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.6;
            margin: 10px 0;
        }

        .ref-highlight {
            color: #ffd700;
            font-weight: 600;
        }
    `);

    // Create overlay HTML
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'seiko-reference-overlay';

        const casesHtml = Object.entries(MOD_DATABASE.cases)
            .map(([model, specs]) => `
                <div class="ref-card">
                    <h3 class="ref-card-title">📦 ${model}</h3>
                    <div class="ref-spec-grid">
                        ${Object.entries(specs).map(([key, value]) => `
                            <div class="ref-spec-item">
                                <div class="ref-spec-label">${key}</div>
                                <div class="ref-spec-value">${value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        const movementsHtml = Object.entries(MOD_DATABASE.movements)
            .map(([model, specs]) => `
                <div class="ref-card">
                    <h3 class="ref-card-title">⚙️ ${model}</h3>
                    <div class="ref-spec-grid">
                        ${Object.entries(specs).map(([key, value]) => `
                            <div class="ref-spec-item">
                                <div class="ref-spec-label">${key}</div>
                                <div class="ref-spec-value">${value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        const toolsHtml = MOD_DATABASE.tools
            .map(tool => `
                <div class="ref-tool-item ${tool.essential ? 'essential' : ''}">
                    <div class="ref-tool-name">
                        ${tool.essential ? '⭐ ' : ''}${tool.name}
                    </div>
                    <div class="ref-tool-badge">${tool.cost}</div>
                </div>
            `).join('');

        overlay.innerHTML = `
            <div class="seiko-ref-container">
                <div class="seiko-ref-header">
                    <h2 class="seiko-ref-title">
                        ⌚ Seiko Mod Quick Reference
                    </h2>
                    <button class="seiko-ref-close" title="Close (or press Esc)">×</button>
                </div>

                <div class="seiko-ref-tabs">
                    <button class="seiko-ref-tab active" data-tab="home">🏠 Home</button>
                    <button class="seiko-ref-tab" data-tab="cases">📦 Cases</button>
                    <button class="seiko-ref-tab" data-tab="movements">⚙️ Movements</button>
                    <button class="seiko-ref-tab" data-tab="tools">🛠️ Tools</button>
                </div>

                <div class="seiko-ref-content">
                    <div class="ref-section active" data-section="home">
                        <div class="ref-intro">
                            <h3>Welcome to Seiko Mod Quick Reference! ⌚</h3>
                            <p>
                                This tool provides instant access to essential <span class="ref-highlight">Seiko mod watches</span>
                                compatibility information, helping you plan your next <span class="ref-highlight">custom Seiko watch</span> build.
                            </p>
                            <p>
                                <strong>How to use:</strong> Navigate between tabs to explore case dimensions, movement specifications,
                                and required tools for modding. All information is available offline and updates automatically.
                            </p>
                            <p>
                                <strong>Keyboard Shortcut:</strong> Press <span class="ref-highlight">Ctrl+Shift+S</span> on any website
                                to open this reference guide instantly!
                            </p>
                        </div>

                        <div class="ref-card">
                            <h3 class="ref-card-title">🎯 Quick Start Guide</h3>
                            <div class="ref-spec-grid">
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">Most Popular Base</div>
                                    <div class="ref-spec-value">SKX007/009</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">Best Movement</div>
                                    <div class="ref-spec-value">NH36 (Day-Date)</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">Beginner Budget</div>
                                    <div class="ref-spec-value">$150-300</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">Difficulty Level</div>
                                    <div class="ref-spec-value">Beginner-Friendly</div>
                                </div>
                            </div>
                        </div>

                        <div class="ref-card">
                            <h3 class="ref-card-title">🔥 Popular Mod Styles</h3>
                            <div class="ref-spec-grid">
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">📊 Vintage Explorer</div>
                                    <div class="ref-spec-value">Faux-patina lume, vintage dial, domed crystal</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">🌊 Modern Diver</div>
                                    <div class="ref-spec-value">Ceramic bezel, sapphire crystal, NH36 movement</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">🎨 Custom Build</div>
                                    <div class="ref-spec-value">Unique dial + hands combo, aftermarket case</div>
                                </div>
                                <div class="ref-spec-item">
                                    <div class="ref-spec-label">⚡ OEM+</div>
                                    <div class="ref-spec-value">Sapphire upgrade, bracelet swap, slight improvements</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="ref-section" data-section="cases">
                        ${casesHtml}
                    </div>

                    <div class="ref-section" data-section="movements">
                        ${movementsHtml}
                    </div>

                    <div class="ref-section" data-section="tools">
                        <div class="ref-card">
                            <h3 class="ref-card-title">🛠️ Essential Modding Tools</h3>
                            <div class="ref-tools-list">
                                ${toolsHtml}
                            </div>
                            <p style="margin-top: 20px; color: rgba(255, 255, 255, 0.7); font-size: 13px;">
                                ⭐ Essential tools are marked with a star. Cost: $ = under $20, $$ = $20-50, $$$ = over $50
                            </p>
                        </div>
                    </div>
                </div>

                <div class="ref-footer">
                    <div class="ref-footer-links">
                        <a href="${RESOURCE_URL}/collections/seiko-mod-watches" target="_blank" class="ref-footer-link">
                            🔧 Browse Seiko Mod Watches
                        </a>
                        <a href="${RESOURCE_URL}/collections/custom-seiko-watches" target="_blank" class="ref-footer-link">
                            ✨ View Custom Seiko Watches
                        </a>
                        <a href="${RESOURCE_URL}/pages/seiko-mod-guide" target="_blank" class="ref-footer-link">
                            📚 Complete Mod Guide
                        </a>
                    </div>
                    <div class="ref-footer-info">
                        Powered by SkyrimWrist • Press Ctrl+Shift+S to toggle
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Setup event listeners
        setupEventListeners(overlay);

        return overlay;
    }

    function setupEventListeners(overlay) {
        // Close button
        overlay.querySelector('.seiko-ref-close').addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });

        // Tab switching
        const tabs = overlay.querySelectorAll('.seiko-ref-tab');
        const sections = overlay.querySelectorAll('.ref-section');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));

                tab.classList.add('active');
                overlay.querySelector(`[data-section="${targetTab}"]`).classList.add('active');
            });
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
            }
        });
    }

    // Show hint on first load
    function showHint() {
        const hasSeenHint = GM_getValue('seiko_ref_hint_seen', false);

        if (!hasSeenHint) {
            const hint = document.createElement('div');
            hint.className = 'ref-shortcut-hint';
            hint.textContent = '⌚ Seiko Mod Reference: Press Ctrl+Shift+S anytime!';
            document.body.appendChild(hint);

            hint.style.display = 'block';

            setTimeout(() => {
                hint.remove();
            }, 3000);

            GM_setValue('seiko_ref_hint_seen', true);
        }
    }

    // Initialize
    function init() {
        const overlay = createOverlay();

        // Keyboard shortcut: Ctrl+Shift+S
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                overlay.classList.toggle('active');
            }
        });

        // Show hint after page loads
        setTimeout(showHint, 2000);
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
