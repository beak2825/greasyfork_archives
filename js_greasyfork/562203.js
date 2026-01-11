// ==UserScript==
// @name         Cookie Clicker Helper
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Helpful automation features for Cookie Clicker
// @author       Pyrates
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @license      MIT
// @copyright    2025, Cookie Clicker Helper Contributors
// @downloadURL https://update.greasyfork.org/scripts/562203/Cookie%20Clicker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562203/Cookie%20Clicker%20Helper.meta.js
// ==/UserScript==

/*
 * Cookie Clicker Helper - Tampermonkey Script
 * 
 * Copyright (c) 2025 Cookie Clicker Helper Contributors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Cookie Clicker is created and owned by Orteil (https://orteil.dashnet.org/)
 * This script is not affiliated with or endorsed by the original game developer.
 */

(function() {
    'use strict';

    // Wait for the game to load
    function waitForGame() {
        if (typeof Game === 'undefined' || !Game.ready) {
            setTimeout(waitForGame, 100);
            return;
        }
        initHelper();
    }

    function initHelper() {
        console.log('Cookie Clicker Helper loaded!');

        // Create control panel
        const panel = document.createElement('div');
        panel.id = 'helper-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%);
            color: white;
            padding: 0;
            border-radius: 16px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 280px;
            cursor: move;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1) inset;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform-origin: top right;
        `;

        panel.innerHTML = `
            <div id="dragHandle" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 20px; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center; user-select: none; cursor: move;">
                <h3 style="margin: 0; font-size: 1.2em; font-weight: 600; letter-spacing: 0.5px;">🍪 Cookie Helper</h3>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button id="scaleDown" style="width: 24px; height: 24px; border-radius: 6px; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Scale Down">−</button>
                    <button id="scaleUp" style="width: 24px; height: 24px; border-radius: 6px; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Scale Up">+</button>
                    <button id="minimizeBtn" style="width: 24px; height: 24px; border-radius: 6px; border: none; background: rgba(255,255,255,0.2); color: white; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Minimize">−</button>
                </div>
            </div>
            <div id="panelContent" style="padding: 16px 20px; max-height: 70vh; overflow-y: auto;">
                <!-- Tab Navigation -->
                <div style="display: flex; gap: 8px; margin-bottom: 16px; border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 8px; flex-wrap: wrap;">
                    <button class="tab-btn active" data-tab="automation">Auto</button>
                    <button class="tab-btn" data-tab="cheats">Cheats</button>
                    <button class="tab-btn" data-tab="spawns">Spawns</button>
                    <button class="tab-btn" data-tab="minigames">Minigames</button>
                    <button class="tab-btn" data-tab="advanced">Advanced</button>
                    <button class="tab-btn" data-tab="settings">Settings</button>
                    <button class="tab-btn" data-tab="stats">Stats</button>
                </div>

                <!-- AUTOMATION TAB -->
                <div id="tab-automation" class="tab-content active">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Basic Automation</div>
                        <button id="autoClick" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🖱️</span>
                            <span class="btn-text">Auto Click</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="autoBuy" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🏪</span>
                            <span class="btn-text">Auto Buy</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="autoGolden" class="toggle-btn" data-active="false">
                            <span class="btn-icon">✨</span>
                            <span class="btn-text">Auto Golden</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="autoAscend" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">Auto Ascend</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="autoSave" class="toggle-btn" data-active="false">
                            <span class="btn-icon">💾</span>
                            <span class="btn-text">Auto Save (5min)</span>
                            <span class="btn-status">OFF</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Click Settings</div>
                        <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Clicks Per Second: <span id="cpsValue">20</span></label>
                        <input type="range" id="clickSpeed" min="1" max="100" value="20" style="width: 100%;">
                    </div>
                </div>

                <!-- CHEATS TAB -->
                <div id="tab-cheats" class="tab-content">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Money Cheats</div>
                        <button id="infiniteMoney" class="toggle-btn special-btn" data-active="false">
                            <span class="btn-icon">💰</span>
                            <span class="btn-text">Infinite Money</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="freeBuildings" class="toggle-btn special-btn" data-active="false">
                            <span class="btn-icon">🆓</span>
                            <span class="btn-text">Free Buildings</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Add Cookies</label>
                            <input type="text" id="cookieAmount" placeholder="e.g. 1M, 1B, 1T, 1Sx, 1Dc" 
                                style="width: 100%; padding: 10px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; font-size: 0.95em; box-sizing: border-box; margin-bottom: 8px; transition: all 0.2s;">
                            <button id="addCookies" class="action-btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                <span class="btn-icon">➕</span>
                                <span class="btn-text">Add Cookies</span>
                            </button>
                        </div>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">CPS Multiplier: <span id="cpsMultValue">1</span>x</label>
                            <input type="range" id="cpsMultiplier" min="1" max="1000" value="1" style="width: 100%; margin-bottom: 8px;">
                        </div>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Click Power Multiplier: <span id="clickMultValue">1</span>x</label>
                            <input type="range" id="clickMultiplier" min="1" max="1000" value="1" style="width: 100%; margin-bottom: 8px;">
                        </div>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Golden Cookie Multiplier: <span id="goldenMultValue">1</span>x</label>
                            <input type="range" id="goldenMultiplier" min="1" max="1000" value="1" style="width: 100%;">
                        </div>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Buff Duration Multiplier: <span id="buffMultValue">1</span>x</label>
                            <input type="range" id="buffMultiplier" min="1" max="100" value="1" style="width: 100%;">
                        </div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Instant Unlocks</div>
                        <button id="unlockUpgrades" class="action-btn">
                            <span class="btn-icon">🔓</span>
                            <span class="btn-text">Unlock All Upgrades</span>
                        </button>
                        <button id="unlockAchievements" class="action-btn">
                            <span class="btn-icon">🏆</span>
                            <span class="btn-text">Unlock All Achievements</span>
                        </button>
                        <button id="maxBuildings" class="action-btn">
                            <span class="btn-icon">🏗️</span>
                            <span class="btn-text">Max All Buildings (100)</span>
                        </button>
                        <button id="sellBuildings" class="action-btn">
                            <span class="btn-icon">💸</span>
                            <span class="btn-text">Sell All Buildings</span>
                        </button>
                        <button id="infiniteLumps" class="action-btn">
                            <span class="btn-icon">🍬</span>
                            <span class="btn-text">Infinite Sugar Lumps</span>
                        </button>
                    </div>
                </div>

                <!-- SPAWNS TAB -->
                <div id="tab-spawns" class="tab-content">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Force Spawn</div>
                        <button id="spawnGolden" class="action-btn">
                            <span class="btn-icon">✨</span>
                            <span class="btn-text">Spawn Golden Cookie</span>
                        </button>
                        <button id="spawnReindeer" class="action-btn">
                            <span class="btn-icon">🦌</span>
                            <span class="btn-text">Spawn Reindeer</span>
                        </button>
                        <button id="spawnWrinklers" class="action-btn">
                            <span class="btn-icon">🐛</span>
                            <span class="btn-text">Spawn Max Wrinklers</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Quick Actions</div>
                        <button id="popWrinklers" class="action-btn">
                            <span class="btn-icon">💥</span>
                            <span class="btn-text">Pop All Wrinklers</span>
                        </button>
                        <button id="fastBuy" class="action-btn">
                            <span class="btn-icon">🛒</span>
                            <span class="btn-text">Buy 10 Most Expensive</span>
                        </button>
                        <button id="ascendLuck" class="action-btn">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Ascend Luck Timer</span>
                        </button>
                    </div>
                </div>

                <!-- MINIGAMES TAB -->
                <div id="tab-minigames" class="tab-content">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Garden Automation</div>
                        <button id="autoGarden" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🌱</span>
                            <span class="btn-text">Auto-Plant Optimal</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="harvestAll" class="action-btn">
                            <span class="btn-icon">🌾</span>
                            <span class="btn-text">Harvest All Plants</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Grimoire Magic</div>
                        <button id="autoGrimoire" class="toggle-btn" data-active="false">
                            <span class="btn-icon">📖</span>
                            <span class="btn-text">Auto-Cast Spells</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="fillMagic" class="action-btn">
                            <span class="btn-icon">✨</span>
                            <span class="btn-text">Fill Magic Meter</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Stock Market</div>
                        <button id="autoStock" class="toggle-btn" data-active="false">
                            <span class="btn-icon">📈</span>
                            <span class="btn-text">Auto-Trade Stocks</span>
                            <span class="btn-status">OFF</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Pantheon</div>
                        <button id="autoPantheon" class="action-btn">
                            <span class="btn-icon">⚡</span>
                            <span class="btn-text">Optimize Pantheon</span>
                        </button>
                    </div>
                </div>

                <!-- ADVANCED TAB -->
                <div id="tab-advanced" class="tab-content">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Game Controls</div>
                        <button id="hideUI" class="toggle-btn" data-active="false">
                            <span class="btn-icon">👁️</span>
                            <span class="btn-text">Hide Game UI</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Game Speed: <span id="gameSpeedValue">1</span>x</label>
                            <input type="range" id="gameSpeed" min="0.1" max="10" step="0.1" value="1" style="width: 100%;">
                        </div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Custom Goals</div>
                        <input type="text" id="goalAmount" placeholder="Goal (e.g. 1T)" 
                            style="width: 100%; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; margin-bottom: 8px;">
                        <button id="setGoal" class="action-btn">
                            <span class="btn-icon">🎯</span>
                            <span class="btn-text">Set Cookie Goal</span>
                        </button>
                        <div id="goalProgress" style="margin-top: 10px; font-size: 0.85em; color: rgba(255,255,255,0.7);"></div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Season Control</div>
                        <select id="seasonSelect" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; margin-bottom: 8px;">
                            <option value="" style="background: #2a2a3e; color: white;">Current Season</option>
                            <option value="christmas" style="background: #2a2a3e; color: white;">Christmas</option>
                            <option value="easter" style="background: #2a2a3e; color: white;">Easter</option>
                            <option value="halloween" style="background: #2a2a3e; color: white;">Halloween</option>
                            <option value="valentines" style="background: #2a2a3e; color: white;">Valentines</option>
                        </select>
                        <button id="changeSeason" class="action-btn">
                            <span class="btn-icon">🎄</span>
                            <span class="btn-text">Change Season</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Save Management</div>
                        <button id="backupSave" class="action-btn">
                            <span class="btn-icon">💾</span>
                            <span class="btn-text">Backup Save</span>
                        </button>
                        <button id="restoreSave" class="action-btn">
                            <span class="btn-icon">📂</span>
                            <span class="btn-text">Restore Backup</span>
                        </button>
                        <button id="savePreset" class="action-btn">
                            <span class="btn-icon">💾</span>
                            <span class="btn-text">Save Configuration</span>
                        </button>
                        <button id="loadPreset" class="action-btn">
                            <span class="btn-icon">📂</span>
                            <span class="btn-text">Load Configuration</span>
                        </button>
                        <button id="exportStats" class="action-btn">
                            <span class="btn-icon">📊</span>
                            <span class="btn-text">Export Statistics</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Cheat Profiles</div>
                        <button id="idleMode" class="action-btn">
                            <span class="btn-icon">💤</span>
                            <span class="btn-text">Idle Mode (Auto Everything)</span>
                        </button>
                        <button id="activeMode" class="action-btn">
                            <span class="btn-icon">⚡</span>
                            <span class="btn-text">Active Mode (Manual + Assists)</span>
                        </button>
                        <button id="godMode" class="action-btn">
                            <span class="btn-icon">👑</span>
                            <span class="btn-text">God Mode (All Cheats)</span>
                        </button>
                    </div>
                </div>

                <!-- SETTINGS TAB -->
                <div id="tab-settings" class="tab-content">
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Panel Settings</div>
                        <label style="display: block; margin-bottom: 6px; font-size: 0.85em; color: rgba(255,255,255,0.8);">Panel Opacity: <span id="opacityValue">98</span>%</label>
                        <input type="range" id="panelOpacity" min="50" max="100" value="98" style="width: 100%; margin-bottom: 12px;">
                        
                        <div class="section-title" style="margin-top: 16px;">Position Presets</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <button class="action-btn" data-position="top-right">↗️ Top Right</button>
                            <button class="action-btn" data-position="top-left">↖️ Top Left</button>
                            <button class="action-btn" data-position="bottom-right">↘️ Bottom Right</button>
                            <button class="action-btn" data-position="bottom-left">↙️ Bottom Left</button>
                        </div>
                        
                        <div class="section-title" style="margin-top: 16px;">Theme</div>
                        <select id="themeSelect" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;">
                            <option value="purple" style="background: #2a2a3e; color: white;">Purple (Default)</option>
                            <option value="blue" style="background: #2a2a3e; color: white;">Blue Ocean</option>
                            <option value="green" style="background: #2a2a3e; color: white;">Green Matrix</option>
                            <option value="red" style="background: #2a2a3e; color: white;">Red Fire</option>
                            <option value="gold" style="background: #2a2a3e; color: white;">Golden</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Notifications</div>
                        <button id="hideNotifications" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🔕</span>
                            <span class="btn-text">Hide All Game Notifications</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="notifyGolden" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🔔</span>
                            <span class="btn-text">Golden Cookie Alerts</span>
                            <span class="btn-status">OFF</span>
                        </button>
                        <button id="notifyAchiev" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🏆</span>
                            <span class="btn-text">Achievement Alerts</span>
                            <span class="btn-status">OFF</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Audio Controls</div>
                        <button id="muteAll" class="toggle-btn" data-active="false">
                            <span class="btn-icon">🔇</span>
                            <span class="btn-text">Mute All Sounds</span>
                            <span class="btn-status">OFF</span>
                        </button>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <div class="section-title">Hotkeys</div>
                        <div style="font-size: 0.85em; color: rgba(255,255,255,0.7); line-height: 1.8;">
                            <div>Alt+C - Toggle Auto Click</div>
                            <div>Alt+B - Toggle Auto Buy</div>
                            <div>Alt+G - Toggle Auto Golden</div>
                            <div>Alt+H - Toggle Hide UI</div>
                            <div>Alt+S - Manual Save</div>
                        </div>
                    </div>
                </div>

                <!-- STATS TAB -->
                <div id="tab-stats" class="tab-content">
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px;">
                        <div class="section-title">Current Statistics</div>
                        <div style="display: grid; gap: 6px; font-size: 0.9em;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">CPS:</span>
                                <span style="font-weight: 600; color: #4CAF50;" id="cpsDisplay">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Cookies:</span>
                                <span style="font-weight: 600; color: #FFC107;" id="cookieDisplay">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Buildings:</span>
                                <span style="font-weight: 600; color: #2196F3;" id="buildingDisplay">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Prestige:</span>
                                <span style="font-weight: 600; color: #9C27B0;" id="prestigeDisplay">0</span>
                            </div>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px;">
                        <div class="section-title">Session Stats</div>
                        <div style="display: grid; gap: 6px; font-size: 0.9em;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Session Time:</span>
                                <span style="font-weight: 600;" id="sessionTime">0:00:00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Cookies Earned:</span>
                                <span style="font-weight: 600;" id="sessionCookies">0</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Golden Clicks:</span>
                                <span style="font-weight: 600;" id="goldenClicks">0</span>
                            </div>
                        </div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <div class="section-title">Efficiency</div>
                        <div style="display: grid; gap: 6px; font-size: 0.9em;">
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Best Building:</span>
                                <span style="font-weight: 600;" id="bestBuilding">-</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Next Milestone:</span>
                                <span style="font-weight: 600;" id="nextMilestone">-</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: rgba(255,255,255,0.7);">Time to Goal:</span>
                                <span style="font-weight: 600;" id="timeToGoal">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                #helper-panel input:focus, #helper-panel select:focus {
                    outline: none;
                    border-color: #667eea;
                    background: rgba(255,255,255,0.15);
                }
                #helper-panel select {
                    cursor: pointer;
                }
                #helper-panel select option {
                    background: #2a2a3e;
                    color: white;
                }
                #helper-panel input[type="range"] {
                    -webkit-appearance: none;
                    background: rgba(255,255,255,0.1);
                    border-radius: 5px;
                    height: 6px;
                }
                #helper-panel input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #667eea;
                    cursor: pointer;
                }
                #helper-panel .section-title {
                    font-size: 0.75em;
                    color: rgba(255,255,255,0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    font-weight: 600;
                }
                #helper-panel .tab-btn {
                    flex: 1;
                    padding: 8px 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.85em;
                    font-family: inherit;
                }
                #helper-panel .tab-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.9);
                }
                #helper-panel .tab-btn.active {
                    background: rgba(102, 126, 234, 0.3);
                    border-color: rgba(102, 126, 234, 0.5);
                    color: white;
                }
                #helper-panel .tab-content {
                    display: none;
                }
                #helper-panel .tab-content.active {
                    display: block;
                }
                #helper-panel .toggle-btn {
                    width: 100%;
                    margin: 6px 0;
                    padding: 12px 14px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 10px;
                    color: white;
                    font-size: 0.9em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-family: inherit;
                }
                #helper-panel .toggle-btn:hover {
                    background: rgba(255,255,255,0.12);
                    border-color: rgba(255,255,255,0.25);
                    transform: translateX(2px);
                }
                #helper-panel .toggle-btn[data-active="true"] {
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%);
                    border-color: rgba(76, 175, 80, 0.5);
                }
                #helper-panel .special-btn[data-active="true"] {
                    background: linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.3) 100%);
                    border-color: rgba(255, 193, 7, 0.5);
                }
                #helper-panel .action-btn {
                    width: 100%;
                    margin: 6px 0;
                    padding: 12px 14px;
                    background: rgba(102, 126, 234, 0.2);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    border-radius: 10px;
                    color: white;
                    font-size: 0.9em;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: inherit;
                }
                #helper-panel .action-btn:hover {
                    background: rgba(102, 126, 234, 0.3);
                    border-color: rgba(102, 126, 234, 0.5);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }
                #helper-panel .btn-icon {
                    font-size: 1.1em;
                }
                #helper-panel .btn-text {
                    flex: 1;
                    text-align: left;
                }
                #helper-panel .btn-status {
                    font-size: 0.85em;
                    padding: 2px 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 6px;
                    font-weight: 600;
                }
                #helper-panel #scaleDown:hover, #helper-panel #scaleUp:hover, #helper-panel #minimizeBtn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: scale(1.1);
                }
                #panelContent::-webkit-scrollbar {
                    width: 8px;
                }
                #panelContent::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }
                #panelContent::-webkit-scrollbar-thumb {
                    background: rgba(102, 126, 234, 0.5);
                    border-radius: 10px;
                }
                #panelContent::-webkit-scrollbar-thumb:hover {
                    background: rgba(102, 126, 234, 0.7);
                }
            </style>
        `;

        document.body.appendChild(panel);

        // Make panel draggable - only from drag handle
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const dragHandle = document.getElementById('dragHandle');
        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            // Only drag if clicking on the drag handle itself or the title
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                return;
            }
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            dragHandle.style.cursor = 'grabbing';
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            dragHandle.style.cursor = 'move';
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) scale(${currentScale})`;
        }

        // State variables
        let autoClickEnabled = false;
        let autoBuyEnabled = false;
        let autoGoldenEnabled = false;
        let infiniteMoneyEnabled = false;
        let uiHidden = false;
        let panelMinimized = false;
        let originalGoldenCookieClick = null;
        let currentScale = 1;
        let autoAscendEnabled = false;
        let autoSaveEnabled = false;
        let notifyGoldenEnabled = false;
        let notifyAchievEnabled = false;
        let clicksPerSecond = 20;
        let cpsMultiplierValue = 1;
        let clickMultiplierValue = 1;
        let goldenMultiplierValue = 1;
        let sessionStartTime = Date.now();
        let sessionCookiesStart = 0;
        let goldenClickCount = 0;
        let presetConfig = null;

        // Scale controls
        document.getElementById('scaleUp').addEventListener('click', function(e) {
            e.stopPropagation();
            currentScale = Math.min(currentScale + 0.1, 1.5);
            panel.style.transform = `scale(${currentScale})`;
        });

        document.getElementById('scaleDown').addEventListener('click', function(e) {
            e.stopPropagation();
            currentScale = Math.max(currentScale - 0.1, 0.6);
            panel.style.transform = `scale(${currentScale})`;
        });

        // Panel toggle (minimize/maximize)
        document.getElementById('minimizeBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            panelMinimized = !panelMinimized;
            const content = document.getElementById('panelContent');
            content.style.display = panelMinimized ? 'none' : 'block';
            this.textContent = panelMinimized ? '+' : '−';
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Update buttons
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update content
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById('tab-' + tabName).classList.add('active');
            });
        });

        // Click speed slider
        document.getElementById('clickSpeed').addEventListener('input', function() {
            clicksPerSecond = parseInt(this.value);
            document.getElementById('cpsValue').textContent = clicksPerSecond;
            
            // Restart auto-clicker if active
            if (autoClickEnabled) {
                clearInterval(clickInterval);
                clickInterval = setInterval(() => {
                    Game.ClickCookie();
                }, 1000 / clicksPerSecond);
            }
        });

        // CPS Multiplier
        document.getElementById('cpsMultiplier').addEventListener('input', function() {
            cpsMultiplierValue = parseInt(this.value);
            document.getElementById('cpsMultValue').textContent = cpsMultiplierValue;
        });

        // Click Power Multiplier
        document.getElementById('clickMultiplier').addEventListener('input', function() {
            clickMultiplierValue = parseInt(this.value);
            document.getElementById('clickMultValue').textContent = clickMultiplierValue;
        });

        // Golden Multiplier Slider
        document.getElementById('goldenMultiplier').addEventListener('input', function() {
            goldenMultiplierValue = parseInt(this.value);
            document.getElementById('goldenMultValue').textContent = goldenMultiplierValue;
            setupGoldenMultiplier();
        });

        // Panel Opacity
        document.getElementById('panelOpacity').addEventListener('input', function() {
            const opacity = parseInt(this.value) / 100;
            document.getElementById('opacityValue').textContent = this.value;
            panel.style.background = `linear-gradient(135deg, rgba(30, 30, 50, ${opacity}) 0%, rgba(20, 20, 35, ${opacity}) 100%)`;
        });

        // Theme Selector
        document.getElementById('themeSelect').addEventListener('change', function() {
            const theme = this.value;
            const header = panel.querySelector('div');
            const themes = {
                purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                blue: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                green: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                red: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
            };
            header.style.background = themes[theme] || themes.purple;
        });

        // Position Presets
        document.querySelectorAll('[data-position]').forEach(btn => {
            btn.addEventListener('click', function() {
                const pos = this.getAttribute('data-position');
                panel.style.transform = `scale(${currentScale})`;
                xOffset = 0;
                yOffset = 0;
                
                switch(pos) {
                    case 'top-right':
                        panel.style.top = '10px';
                        panel.style.right = '10px';
                        panel.style.bottom = 'auto';
                        panel.style.left = 'auto';
                        break;
                    case 'top-left':
                        panel.style.top = '10px';
                        panel.style.left = '10px';
                        panel.style.bottom = 'auto';
                        panel.style.right = 'auto';
                        break;
                    case 'bottom-right':
                        panel.style.bottom = '10px';
                        panel.style.right = '10px';
                        panel.style.top = 'auto';
                        panel.style.left = 'auto';
                        break;
                    case 'bottom-left':
                        panel.style.bottom = '10px';
                        panel.style.left = '10px';
                        panel.style.top = 'auto';
                        panel.style.right = 'auto';
                        break;
                }
            });
        });

        // Notification toggles
        document.getElementById('notifyGolden').addEventListener('click', function() {
            notifyGoldenEnabled = !notifyGoldenEnabled;
            this.setAttribute('data-active', notifyGoldenEnabled);
            this.querySelector('.btn-status').textContent = notifyGoldenEnabled ? 'ON' : 'OFF';
        });

        document.getElementById('notifyAchiev').addEventListener('click', function() {
            notifyAchievEnabled = !notifyAchievEnabled;
            this.setAttribute('data-active', notifyAchievEnabled);
            this.querySelector('.btn-status').textContent = notifyAchievEnabled ? 'ON' : 'OFF';
        });

        // Infinite money toggle
        let moneyInterval;
        document.getElementById('infiniteMoney').addEventListener('click', function() {
            infiniteMoneyEnabled = !infiniteMoneyEnabled;
            this.setAttribute('data-active', infiniteMoneyEnabled);
            this.querySelector('.btn-status').textContent = infiniteMoneyEnabled ? 'ON' : 'OFF';

            if (infiniteMoneyEnabled) {
                // Set to game's absolute maximum (1.8 nonillion)
                Game.cookies = 1.8e308;
                
                // Keep it at max constantly
                moneyInterval = setInterval(() => {
                    // Double check we're still enabled and game hasn't been wiped
                    if (infiniteMoneyEnabled && Game.ready && Game.cookies < 1.8e308) {
                        Game.cookies = 1.8e308;
                    } else if (!Game.ready || (Game.cookiesEarned === 0 && Game.cookies < 1.8e308)) {
                        // Game was wiped, stop the interval
                        infiniteMoneyEnabled = false;
                        clearInterval(moneyInterval);
                    }
                }, 10);
            } else {
                clearInterval(moneyInterval);
            }
        });

        // Monitor for game resets/wipes
        let freeBuildingsInterval;
        const originalHardReset = Game.HardReset;
        Game.HardReset = function(wipe) {
            // Turn off infinite money when wiping save
            if (infiniteMoneyEnabled && wipe) {
                infiniteMoneyEnabled = false;
                clearInterval(moneyInterval);
                const infiniteBtn = document.getElementById('infiniteMoney');
                if (infiniteBtn) {
                    infiniteBtn.setAttribute('data-active', 'false');
                    infiniteBtn.querySelector('.btn-status').textContent = 'OFF';
                }
            }
            // Turn off free buildings
            if (freeBuildingsEnabled && wipe) {
                freeBuildingsEnabled = false;
                clearInterval(freeBuildingsInterval);
                const freeBtn = document.getElementById('freeBuildings');
                if (freeBtn) {
                    freeBtn.setAttribute('data-active', 'false');
                    freeBtn.querySelector('.btn-status').textContent = 'OFF';
                }
            }
            return originalHardReset.call(this, wipe);
        };

        const originalReset = Game.Reset;
        Game.Reset = function(hard) {
            // Turn off infinite money on any reset
            if (infiniteMoneyEnabled) {
                infiniteMoneyEnabled = false;
                clearInterval(moneyInterval);
                const infiniteBtn = document.getElementById('infiniteMoney');
                if (infiniteBtn) {
                    infiniteBtn.setAttribute('data-active', 'false');
                    infiniteBtn.querySelector('.btn-status').textContent = 'OFF';
                }
            }
            // Turn off free buildings
            if (freeBuildingsEnabled) {
                freeBuildingsEnabled = false;
                clearInterval(freeBuildingsInterval);
                const freeBtn = document.getElementById('freeBuildings');
                if (freeBtn) {
                    freeBtn.setAttribute('data-active', 'false');
                    freeBtn.querySelector('.btn-status').textContent = 'OFF';
                }
            }
            return originalReset.call(this, hard);
        };

        // Golden cookie multiplier setup
        document.getElementById('goldenMultiplier').addEventListener('input', function() {
            setupGoldenMultiplier();
        });

        function setupGoldenMultiplier() {
            const multiplier = parseFloat(document.getElementById('goldenMultiplier').value) || 1;
            
            // Hook into the shimmer click to multiply golden cookie effects
            if (!originalGoldenCookieClick && Game.shimmerTypes && Game.shimmerTypes.golden) {
                originalGoldenCookieClick = Game.shimmerTypes.golden.popFunc;
                
                Game.shimmerTypes.golden.popFunc = function() {
                    const result = originalGoldenCookieClick.apply(this, arguments);
                    
                    // Multiply the cookie gain from golden cookies
                    if (this.wrath === 0) { // Regular golden cookie
                        const baseGain = Game.cookiesPs * 60 * 7; // Approximate base gain
                        const bonusGain = baseGain * (multiplier - 1);
                        if (bonusGain > 0) {
                            Game.Earn(bonusGain);
                        }
                    }
                    
                    return result;
                };
            }
        }

        // Add cookies button
        document.getElementById('addCookies').addEventListener('click', function() {
            const input = document.getElementById('cookieAmount');
            let amount = input.value.trim();
            
            // Parse different formats
            if (amount) {
                // Support abbreviations like 1M, 1B, 1T, etc.
                const multipliers = {
                    'k': 1000,                          // Thousand
                    'm': 1000000,                       // Million
                    'b': 1000000000,                    // Billion
                    't': 1000000000000,                 // Trillion
                    'q': 1000000000000000,              // Quadrillion
                    'qi': 1000000000000000,             // Quadrillion (alt)
                    'sx': 1000000000000000000,          // Sextillion
                    'sp': 1000000000000000000000,       // Septillion
                    'oc': 1000000000000000000000000,    // Octillion
                    'no': 1000000000000000000000000000, // Nonillion
                    'dc': 1e30,                         // Decillion
                    'ud': 1e33                          // Undecillion
                };
                
                // Check for multi-character abbreviations first
                let matched = false;
                for (let key in multipliers) {
                    if (amount.toLowerCase().endsWith(key)) {
                        const numPart = amount.slice(0, -key.length);
                        amount = parseFloat(numPart) * multipliers[key];
                        matched = true;
                        break;
                    }
                }
                
                if (!matched) {
                    amount = parseFloat(amount);
                }
                
                if (!isNaN(amount) && amount > 0) {
                    Game.Earn(amount);
                    Game.Notify('Cookies Added!', `Added ${Beautify(amount, 2)} cookies!`, [10, 0], 3);
                    input.value = '';
                } else {
                    Game.Notify('Invalid Amount', 'Please enter a valid number!', [0, 3], 3);
                }
            }
        });

        // Allow Enter key to add cookies
        document.getElementById('cookieAmount').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('addCookies').click();
            }
        });

        // Hide game UI toggle
        document.getElementById('hideUI').addEventListener('click', function() {
            uiHidden = !uiHidden;
            this.setAttribute('data-active', uiHidden);
            this.querySelector('.btn-status').textContent = uiHidden ? 'ON' : 'OFF';

            const elementsToHide = [
                document.getElementById('game'),
                document.getElementById('topBar'),
                document.getElementById('prefsButton')
            ];

            elementsToHide.forEach(el => {
                if (el) {
                    el.style.display = uiHidden ? 'none' : '';
                }
            });

            // Show only the big cookie when UI is hidden
            const bigCookie = document.getElementById('bigCookie');
            if (bigCookie && uiHidden) {
                bigCookie.parentElement.style.display = 'block';
                bigCookie.parentElement.style.position = 'fixed';
                bigCookie.parentElement.style.left = '50%';
                bigCookie.parentElement.style.top = '50%';
                bigCookie.parentElement.style.transform = 'translate(-50%, -50%)';
            } else if (bigCookie) {
                bigCookie.parentElement.style.position = '';
                bigCookie.parentElement.style.left = '';
                bigCookie.parentElement.style.top = '';
                bigCookie.parentElement.style.transform = '';
            }
        });

        // Auto clicker
        let clickInterval;
        document.getElementById('autoClick').addEventListener('click', function() {
            autoClickEnabled = !autoClickEnabled;
            this.setAttribute('data-active', autoClickEnabled);
            this.querySelector('.btn-status').textContent = autoClickEnabled ? 'ON' : 'OFF';

            if (autoClickEnabled) {
                clickInterval = setInterval(() => {
                    Game.ClickCookie();
                }, 50); // Click 20 times per second
            } else {
                clearInterval(clickInterval);
            }
        });

        // Auto buyer - buys the most expensive building
        let buyInterval;
        document.getElementById('autoBuy').addEventListener('click', function() {
            autoBuyEnabled = !autoBuyEnabled;
            this.setAttribute('data-active', autoBuyEnabled);
            this.querySelector('.btn-status').textContent = autoBuyEnabled ? 'ON' : 'OFF';

            if (autoBuyEnabled) {
                buyInterval = setInterval(() => {
                    buyBestBuilding();
                    buyUpgrades();
                }, 100); // Changed from 1000ms to 100ms for 10x faster buying
            } else {
                clearInterval(buyInterval);
            }
        });

        // Auto golden cookie clicker
        let goldenInterval;
        document.getElementById('autoGolden').addEventListener('click', function() {
            autoGoldenEnabled = !autoGoldenEnabled;
            this.setAttribute('data-active', autoGoldenEnabled);
            this.querySelector('.btn-status').textContent = autoGoldenEnabled ? 'ON' : 'OFF';

            if (autoGoldenEnabled) {
                goldenInterval = setInterval(() => {
                    clickGoldenCookies();
                }, 100);
            } else {
                clearInterval(goldenInterval);
            }
        });

        // Auto Ascend
        let ascendInterval;
        document.getElementById('autoAscend').addEventListener('click', function() {
            autoAscendEnabled = !autoAscendEnabled;
            this.setAttribute('data-active', autoAscendEnabled);
            this.querySelector('.btn-status').textContent = autoAscendEnabled ? 'ON' : 'OFF';

            if (autoAscendEnabled) {
                ascendInterval = setInterval(() => {
                    if (Game.Ascend && Game.prestige && Game.prestige > Game.ascendMeterLevel + 100) {
                        Game.Ascend(1);
                        setTimeout(() => { if (Game.Reincarnate) Game.Reincarnate(1); }, 1000);
                    }
                }, 5000);
            } else {
                clearInterval(ascendInterval);
            }
        });

        // Auto Save
        let saveInterval;
        document.getElementById('autoSave').addEventListener('click', function() {
            autoSaveEnabled = !autoSaveEnabled;
            this.setAttribute('data-active', autoSaveEnabled);
            this.querySelector('.btn-status').textContent = autoSaveEnabled ? 'ON' : 'OFF';

            if (autoSaveEnabled) {
                saveInterval = setInterval(() => {
                    Game.SaveTo = 'main';
                    Game.save();
                    Game.Notify('Auto-Save', 'Game saved successfully!', [10, 0], 2);
                }, 300000); // 5 minutes
            } else {
                clearInterval(saveInterval);
            }
        });

        // Unlock All Upgrades
        document.getElementById('unlockUpgrades').addEventListener('click', function() {
            let count = 0;
            for (let i in Game.Upgrades) {
                if (!Game.Upgrades[i].bought && !Game.Upgrades[i].noPerm) {
                    Game.Upgrades[i].earn();
                    count++;
                }
            }
            Game.Notify('Upgrades Unlocked!', `Unlocked ${count} upgrades!`, [10, 0], 3);
        });

        // Unlock All Achievements
        document.getElementById('unlockAchievements').addEventListener('click', function() {
            let count = 0;
            for (let i in Game.Achievements) {
                if (!Game.Achievements[i].won) {
                    Game.Win(Game.Achievements[i].name);
                    count++;
                }
            }
            Game.Notify('Achievements Unlocked!', `Unlocked ${count} achievements!`, [10, 0], 3);
        });

        // Max All Buildings
        document.getElementById('maxBuildings').addEventListener('click', function() {
            let totalBought = 0;
            Game.ObjectsById.forEach(building => {
                const toBuy = 100;
                for (let i = 0; i < toBuy; i++) {
                    if (building.price <= Game.cookies) {
                        building.buy(1);
                        totalBought++;
                    }
                }
            });
            Game.Notify('Buildings Maxed!', `Bought ${totalBought} buildings!`, [10, 0], 3);
        });

        // Infinite Sugar Lumps
        document.getElementById('infiniteLumps').addEventListener('click', function() {
            Game.lumps = 999999;
            Game.Notify('Sugar Lumps', 'Set to 999,999 lumps!', [19, 27], 3);
        });

        // Change Season
        document.getElementById('changeSeason').addEventListener('click', function() {
            const season = document.getElementById('seasonSelect').value;
            if (season) {
                const seasonIds = {
                    christmas: 'christmas',
                    easter: 'easter',
                    halloween: 'halloween',
                    valentines: 'valentines'
                };
                
                if (Game.seasonTrigger) {
                    Game.season = seasonIds[season] || '';
                    Game.seasonTrigger();
                    Game.Notify('Season Changed!', `Now celebrating ${season}!`, [16, 6], 3);
                }
            }
        });

        // Save Preset
        document.getElementById('savePreset').addEventListener('click', function() {
            presetConfig = {
                autoClick: autoClickEnabled,
                autoBuy: autoBuyEnabled,
                autoGolden: autoGoldenEnabled,
                infiniteMoney: infiniteMoneyEnabled,
                autoAscend: autoAscendEnabled,
                autoSave: autoSaveEnabled,
                clickSpeed: clicksPerSecond,
                cpsMultiplier: cpsMultiplierValue,
                clickMultiplier: clickMultiplierValue,
                goldenMultiplier: goldenMultiplierValue
            };
            localStorage.setItem('cookieHelperPreset', JSON.stringify(presetConfig));
            Game.Notify('Preset Saved!', 'Configuration saved successfully!', [10, 0], 3);
        });

        // Load Preset
        document.getElementById('loadPreset').addEventListener('click', function() {
            const saved = localStorage.getItem('cookieHelperPreset');
            if (saved) {
                presetConfig = JSON.parse(saved);
                Game.Notify('Preset Loaded!', 'Configuration restored!', [10, 0], 3);
                
                // Apply settings (would need to trigger each button/slider)
                document.getElementById('clickSpeed').value = presetConfig.clickSpeed || 20;
                document.getElementById('cpsMultiplier').value = presetConfig.cpsMultiplier || 1;
                document.getElementById('clickMultiplier').value = presetConfig.clickMultiplier || 1;
                document.getElementById('goldenMultiplier').value = presetConfig.goldenMultiplier || 1;
            } else {
                Game.Notify('No Preset Found', 'Save a preset first!', [0, 3], 3);
            }
        });

        // Export Stats
        document.getElementById('exportStats').addEventListener('click', function() {
            const stats = {
                cookies: Game.cookies,
                cookiesEarned: Game.cookiesEarned,
                cps: Game.cookiesPs,
                buildings: {},
                prestige: Game.prestige || 0,
                achievements: Object.values(Game.Achievements).filter(a => a.won).length,
                sessionTime: Date.now() - sessionStartTime,
                sessionCookies: Game.cookies - sessionCookiesStart
            };
            
            Game.ObjectsById.forEach(b => {
                stats.buildings[b.name] = b.amount;
            });
            
            const dataStr = JSON.stringify(stats, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'cookie-clicker-stats.json';
            link.click();
            
            Game.Notify('Stats Exported!', 'Check your downloads!', [10, 0], 3);
        });

        // Fast buy button
        document.getElementById('fastBuy').addEventListener('click', function() {
            for (let i = 0; i < 10; i++) {
                buyBestBuilding();
            }
        });

        // Pop all wrinklers button
        document.getElementById('popWrinklers').addEventListener('click', function() {
            if (Game.wrinklers) {
                let popped = 0;
                Game.wrinklers.forEach(wrinkler => {
                    if (wrinkler.phase > 0) {
                        wrinkler.hp = 0;
                        popped++;
                    }
                });
                if (popped > 0) {
                    Game.Notify('Wrinklers Popped', `Popped ${popped} wrinkler(s)!`, [19, 8]);
                }
            }
        });

        // Ascend luck notification
        document.getElementById('ascendLuck').addEventListener('click', function() {
            if (typeof Game.ascensionMode !== 'undefined') {
                const luckTime = (Math.ceil(Game.fps*60*Math.random())/Game.fps)%60;
                const currentTime = ((Date.now()-Game.startDate)/1000)%60;
                const timeUntilLuck = luckTime - currentTime;
                
                Game.Notify('Ascension Luck Timer', 
                    `Lucky time is at ${Math.floor(luckTime)} seconds in the minute cycle.<br>` +
                    `Current time: ${Math.floor(currentTime)}s<br>` +
                    `Time until next lucky window: ${timeUntilLuck > 0 ? Math.floor(timeUntilLuck) : Math.floor(60 + timeUntilLuck)}s`, 
                    [18, 7], 10);
            } else {
                Game.Notify('Ascend Info', 'Ascension mechanics not yet unlocked!', [0, 7]);
            }
        });

        // Helper functions
        function buyBestBuilding() {
            let mostExpensiveBuilding = null;
            let highestPrice = 0;

            Game.ObjectsById.forEach(building => {
                if (building.price <= Game.cookies && building.price > highestPrice) {
                    highestPrice = building.price;
                    mostExpensiveBuilding = building;
                }
            });

            if (mostExpensiveBuilding) {
                mostExpensiveBuilding.buy(1);
            }
        }

        function buyUpgrades() {
            Game.UpgradesInStore.forEach(upgrade => {
                if (upgrade.canBuy() && upgrade.pool !== 'debug') {
                    upgrade.buy();
                }
            });
        }

        function clickGoldenCookies() {
            Game.shimmers.forEach(shimmer => {
                if (shimmer.type === 'golden' || shimmer.type === 'reindeer') {
                    shimmer.pop();
                    goldenClickCount++;
                    if (notifyGoldenEnabled) {
                        Game.Notify('Golden Cookie!', 'Auto-clicked!', [10, 0], 1);
                    }
                }
            });
        }

        function setupGoldenMultiplier() {
            const multiplier = goldenMultiplierValue;
            
            // Hook into the shimmer click to multiply golden cookie effects
            if (!originalGoldenCookieClick && Game.shimmerTypes && Game.shimmerTypes.golden) {
                originalGoldenCookieClick = Game.shimmerTypes.golden.popFunc;
                
                Game.shimmerTypes.golden.popFunc = function() {
                    const result = originalGoldenCookieClick.apply(this, arguments);
                    
                    // Multiply the cookie gain from golden cookies
                    if (this.wrath === 0) { // Regular golden cookie
                        const baseGain = Game.cookiesPs * 60 * 7; // Approximate base gain
                        const bonusGain = baseGain * (multiplier - 1);
                        if (bonusGain > 0) {
                            Game.Earn(bonusGain);
                        }
                    }
                    
                    return result;
                };
            }
        }

        // Apply multipliers to game
        setInterval(() => {
            // CPS Multiplier
            if (cpsMultiplierValue > 1) {
                const baseCps = Game.cookiesPs / cpsMultiplierValue;
                Game.cookiesPs = baseCps * cpsMultiplierValue;
            }
            
            // Click Power Multiplier
            if (clickMultiplierValue > 1 && Game.computedMouseCps) {
                Game.computedMouseCps *= clickMultiplierValue;
            }
        }, 100);

        // Update display
        setInterval(() => {
            // Basic stats
            document.getElementById('cpsDisplay').textContent = 
                Beautify(Game.cookiesPs, 1);
            document.getElementById('cookieDisplay').textContent = 
                Beautify(Game.cookies, 1);
            
            // Count total buildings
            let totalBuildings = 0;
            Game.ObjectsById.forEach(building => {
                totalBuildings += building.amount;
            });
            document.getElementById('buildingDisplay').textContent = totalBuildings;
            
            // Prestige
            if (document.getElementById('prestigeDisplay')) {
                document.getElementById('prestigeDisplay').textContent = 
                    Beautify(Game.prestige || 0, 0);
            }
            
            // Session stats
            if (document.getElementById('sessionTime')) {
                const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
                const hours = Math.floor(elapsed / 3600);
                const minutes = Math.floor((elapsed % 3600) / 60);
                const seconds = elapsed % 60;
                document.getElementById('sessionTime').textContent = 
                    `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (document.getElementById('sessionCookies')) {
                const sessionEarned = Game.cookies - sessionCookiesStart;
                // If negative (cookies were spent/lost), show 0 instead
                document.getElementById('sessionCookies').textContent = 
                    Beautify(Math.max(0, sessionEarned), 1);
            }
            
            if (document.getElementById('goldenClicks')) {
                document.getElementById('goldenClicks').textContent = goldenClickCount;
            }
            
            // Efficiency stats
            if (document.getElementById('bestBuilding')) {
                let best = null;
                let bestEfficiency = 0;
                
                Game.ObjectsById.forEach(building => {
                    if (building.price <= Game.cookies * 10) {
                        const efficiency = building.storedCps / building.price;
                        if (efficiency > bestEfficiency) {
                            bestEfficiency = efficiency;
                            best = building;
                        }
                    }
                });
                
                document.getElementById('bestBuilding').textContent = 
                    best ? best.name : '-';
            }
            
            if (document.getElementById('nextMilestone')) {
                const milestones = [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30];
                const next = milestones.find(m => m > Game.cookies);
                document.getElementById('nextMilestone').textContent = 
                    next ? Beautify(next, 0) : 'MAX';
            }
            
            if (document.getElementById('timeToGoal')) {
                const milestones = [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30];
                const next = milestones.find(m => m > Game.cookies);
                if (next && Game.cookiesPs > 0) {
                    const secondsToGoal = (next - Game.cookies) / Game.cookiesPs;
                    const hours = Math.floor(secondsToGoal / 3600);
                    const minutes = Math.floor((secondsToGoal % 3600) / 60);
                    document.getElementById('timeToGoal').textContent = 
                        hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                } else {
                    document.getElementById('timeToGoal').textContent = '-';
                }
            }
        }, 1000);
        
        // Track session start cookies
        setTimeout(() => {
            sessionCookiesStart = Game.cookies || 0;
        }, 1000);

        // Beautify number function (game has this built-in)
        function Beautify(num, precision) {
            if (!precision) precision = 0;
            if (num < 1000) return Math.round(num);
            if (num < 1000000) return (Math.round(num/1000*Math.pow(10,precision))/Math.pow(10,precision)) + 'K';
            if (num < 1000000000) return (Math.round(num/1000000*Math.pow(10,precision))/Math.pow(10,precision)) + 'M';
            if (num < 1000000000000) return (Math.round(num/1000000000*Math.pow(10,precision))/Math.pow(10,precision)) + 'B';
            return (Math.round(num/1000000000000*Math.pow(10,precision))/Math.pow(10,precision)) + 'T';
        }

        // Initialize golden multiplier
        setupGoldenMultiplier();

        // Hotkeys
        document.addEventListener('keydown', function(e) {
            if (e.altKey) {
                switch(e.key.toLowerCase()) {
                    case 'c':
                        e.preventDefault();
                        document.getElementById('autoClick').click();
                        break;
                    case 'b':
                        e.preventDefault();
                        document.getElementById('autoBuy').click();
                        break;
                    case 'g':
                        e.preventDefault();
                        document.getElementById('autoGolden').click();
                        break;
                    case 'h':
                        e.preventDefault();
                        document.getElementById('hideUI').click();
                        break;
                    case 's':
                        e.preventDefault();
                        Game.save();
                        Game.Notify('Manual Save', 'Game saved!', [10, 0], 2);
                        break;
                }
            }
        });

        // === NEW FEATURES ===

        // Spawn Golden Cookie
        document.getElementById('spawnGolden').addEventListener('click', function() {
            const newShimmer = new Game.shimmer('golden');
            Game.Notify('Golden Cookie Spawned!', 'Click it quick!', [10, 0], 2);
        });

        // Spawn Reindeer
        document.getElementById('spawnReindeer').addEventListener('click', function() {
            const newShimmer = new Game.shimmer('reindeer');
            Game.Notify('Reindeer Spawned!', 'Click it quick!', [12, 9], 2);
        });

        // Spawn Max Wrinklers
        document.getElementById('spawnWrinklers').addEventListener('click', function() {
            for (let i = 0; i < Game.wrinklers.length; i++) {
                if (Game.wrinklers[i].phase === 0) {
                    Game.wrinklers[i].phase = 2;
                    Game.wrinklers[i].hp = 3;
                }
            }
            Game.Notify('Wrinklers Spawned!', 'Maximum wrinklers active!', [19, 8], 2);
        });

        // Free Buildings
        let freeBuildingsEnabled = false;
        let originalPrices = {};
        document.getElementById('freeBuildings').addEventListener('click', function() {
            freeBuildingsEnabled = !freeBuildingsEnabled;
            this.setAttribute('data-active', freeBuildingsEnabled);
            this.querySelector('.btn-status').textContent = freeBuildingsEnabled ? 'ON' : 'OFF';

            if (freeBuildingsEnabled) {
                // Store original prices and set to 0
                Game.ObjectsById.forEach((building, index) => {
                    originalPrices[index] = building.price;
                });
                
                // Intercept the buy function
                freeBuildingsInterval = setInterval(() => {
                    if (freeBuildingsEnabled) {
                        Game.ObjectsById.forEach(building => {
                            building.price = 0;
                        });
                    }
                }, 10);
                
                Game.Notify('Free Buildings!', 'All buildings now cost 0!', [10, 0], 2);
            } else {
                clearInterval(freeBuildingsInterval);
                // Restore original pricing calculation
                Game.ObjectsById.forEach(building => {
                    building.price = building.basePrice * Math.pow(Game.priceIncrease, Math.max(0, building.amount - building.free));
                });
            }
        });

        // Sell All Buildings
        document.getElementById('sellBuildings').addEventListener('click', function() {
            let totalSold = 0;
            Game.ObjectsById.forEach(building => {
                while (building.amount > 0) {
                    building.sell(1);
                    totalSold++;
                }
            });
            Game.Notify('Buildings Sold!', `Sold ${totalSold} buildings!`, [10, 0], 3);
        });

        // Buff Multiplier
        let buffMultiplierValue = 1;
        document.getElementById('buffMultiplier').addEventListener('input', function() {
            buffMultiplierValue = parseInt(this.value);
            document.getElementById('buffMultValue').textContent = buffMultiplierValue;
        });

        setInterval(() => {
            if (buffMultiplierValue > 1) {
                for (let i in Game.buffs) {
                    Game.buffs[i].time *= 1.01;
                }
            }
        }, 1000);

        // Game Speed
        document.getElementById('gameSpeed').addEventListener('input', function() {
            const speed = parseFloat(this.value);
            document.getElementById('gameSpeedValue').textContent = speed.toFixed(1);
            Game.fps = Math.round(30 * speed);
        });

        // Custom Goals
        let customGoal = 0;
        document.getElementById('setGoal').addEventListener('click', function() {
            const input = document.getElementById('goalAmount').value.trim();
            if (input) {
                const multipliers = {
                    'k': 1000, 'm': 1000000, 'b': 1000000000, 't': 1000000000000,
                    'q': 1000000000000000, 'qi': 1000000000000000, 'sx': 1000000000000000000,
                    'sp': 1000000000000000000000, 'oc': 1000000000000000000000000,
                    'no': 1000000000000000000000000000, 'dc': 1e30, 'ud': 1e33
                };
                
                let amount = input;
                for (let key in multipliers) {
                    if (amount.toLowerCase().endsWith(key)) {
                        amount = parseFloat(amount.slice(0, -key.length)) * multipliers[key];
                        break;
                    }
                }
                customGoal = parseFloat(amount);
                Game.Notify('Goal Set!', `Target: ${Beautify(customGoal, 2)} cookies!`, [10, 0], 3);
            }
        });

        setInterval(() => {
            if (customGoal > 0 && document.getElementById('goalProgress')) {
                const progress = (Game.cookies / customGoal * 100).toFixed(1);
                const remaining = customGoal - Game.cookies;
                const timeLeft = remaining / Game.cookiesPs;
                document.getElementById('goalProgress').innerHTML = `
                    Progress: ${progress}%<br>
                    Remaining: ${Beautify(remaining, 1)}<br>
                    Time: ${timeLeft > 3600 ? Math.floor(timeLeft/3600) + 'h' : Math.floor(timeLeft/60) + 'm'}
                `;
            }
        }, 1000);

        // Backup/Restore Save
        let backupSaveData = null;
        document.getElementById('backupSave').addEventListener('click', function() {
            backupSaveData = Game.WriteSave(1);
            localStorage.setItem('cookieHelperBackup', backupSaveData);
            Game.Notify('Backup Created!', 'Save backed up successfully!', [10, 0], 3);
        });

        document.getElementById('restoreSave').addEventListener('click', function() {
            const backup = localStorage.getItem('cookieHelperBackup');
            if (backup) {
                Game.LoadSave(backup);
                Game.Notify('Backup Restored!', 'Save restored successfully!', [10, 0], 3);
            } else {
                Game.Notify('No Backup Found!', 'Create a backup first!', [0, 3], 3);
            }
        });

        // Hide Notifications
        let hideNotificationsEnabled = false;
        let originalNotify = null;
        document.getElementById('hideNotifications').addEventListener('click', function() {
            hideNotificationsEnabled = !hideNotificationsEnabled;
            this.setAttribute('data-active', hideNotificationsEnabled);
            this.querySelector('.btn-status').textContent = hideNotificationsEnabled ? 'ON' : 'OFF';

            if (hideNotificationsEnabled && !originalNotify) {
                originalNotify = Game.Notify;
                Game.Notify = function() {};
            } else if (!hideNotificationsEnabled && originalNotify) {
                Game.Notify = originalNotify;
            }
        });

        // Mute All
        document.getElementById('muteAll').addEventListener('click', function() {
            const muted = Game.volume === 0;
            this.setAttribute('data-active', !muted);
            this.querySelector('.btn-status').textContent = !muted ? 'ON' : 'OFF';
            Game.volume = muted ? 1 : 0;
        });

        // Cheat Profiles
        document.getElementById('idleMode').addEventListener('click', function() {
            if (!autoClickEnabled) document.getElementById('autoClick').click();
            if (!autoBuyEnabled) document.getElementById('autoBuy').click();
            if (!autoGoldenEnabled) document.getElementById('autoGolden').click();
            if (!autoSaveEnabled) document.getElementById('autoSave').click();
            Game.Notify('Idle Mode!', 'All automation enabled!', [10, 0], 3);
        });

        document.getElementById('activeMode').addEventListener('click', function() {
            if (autoClickEnabled) document.getElementById('autoClick').click();
            if (!autoGoldenEnabled) document.getElementById('autoGolden').click();
            Game.Notify('Active Mode!', 'Manual clicking + assists!', [10, 0], 3);
        });

        document.getElementById('godMode').addEventListener('click', function() {
            if (!infiniteMoneyEnabled) document.getElementById('infiniteMoney').click();
            if (!freeBuildingsEnabled) document.getElementById('freeBuildings').click();
            document.getElementById('cpsMultiplier').value = 1000;
            document.getElementById('cpsMultValue').textContent = '1000';
            cpsMultiplierValue = 1000;
            document.getElementById('clickMultiplier').value = 1000;
            document.getElementById('clickMultValue').textContent = '1000';
            clickMultiplierValue = 1000;
            document.getElementById('goldenMultiplier').value = 1000;
            document.getElementById('goldenMultValue').textContent = '1000';
            goldenMultiplierValue = 1000;
            Game.Notify('GOD MODE!', 'UNLIMITED POWER!', [10, 0], 5);
        });

        // Minigame: Fill Magic
        document.getElementById('fillMagic').addEventListener('click', function() {
            if (Game.Objects['Wizard tower'].minigame) {
                Game.Objects['Wizard tower'].minigame.magic = Game.Objects['Wizard tower'].minigame.magicM;
                Game.Notify('Magic Filled!', 'Magic meter at maximum!', [10, 0], 2);
            } else {
                Game.Notify('Grimoire Not Unlocked!', 'Unlock the Wizard Tower minigame first!', [0, 3], 3);
            }
        });

        // Minigame: Harvest All
        document.getElementById('harvestAll').addEventListener('click', function() {
            if (Game.Objects['Farm'].minigame) {
                const garden = Game.Objects['Farm'].minigame;
                let harvested = 0;
                for (let y = 0; y < 6; y++) {
                    for (let x = 0; x < 6; x++) {
                        if (garden.plot[y][x][0] > 0) {
                            garden.harvest(x, y);
                            harvested++;
                        }
                    }
                }
                Game.Notify('Harvest Complete!', `Harvested ${harvested} plants!`, [10, 0], 3);
            } else {
                Game.Notify('Garden Not Unlocked!', 'Unlock the Farm minigame first!', [0, 3], 3);
            }
        });

        // Minigame: Optimize Pantheon
        document.getElementById('autoPantheon').addEventListener('click', function() {
            if (Game.Objects['Temple'].minigame) {
                const pantheon = Game.Objects['Temple'].minigame;
                
                // Best general-purpose god setup
                const optimalGods = {
                    0: 'godzamok',      // Diamond slot - Godzamok (sell buildings for power)
                    1: 'mokalsium',     // Ruby slot - Mokalsium (golden cookies)
                    2: 'holobore'       // Jade slot - Holobore (buildings production)
                };
                
                // Find and slot gods
                for (let slot in optimalGods) {
                    const godName = optimalGods[slot];
                    const god = pantheon.godsById.find(g => g.name.toLowerCase().includes(godName));
                    
                    if (god) {
                        pantheon.slotGod(god, parseInt(slot));
                    }
                }
                
                Game.Notify('Pantheon Optimized!', 'Best spirits slotted!', [10, 0], 3);
            } else {
                Game.Notify('Pantheon Not Unlocked!', 'Unlock the Temple minigame first!', [0, 3], 3);
            }
        });

        // Minigame Toggles (full implementations)
        let autoGardenEnabled = false;
        let autoGardenInterval;
        document.getElementById('autoGarden').addEventListener('click', function() {
            autoGardenEnabled = !autoGardenEnabled;
            this.setAttribute('data-active', autoGardenEnabled);
            this.querySelector('.btn-status').textContent = autoGardenEnabled ? 'ON' : 'OFF';
            
            if (autoGardenEnabled) {
                autoGardenInterval = setInterval(() => {
                    if (Game.Objects['Farm'].minigame) {
                        const garden = Game.Objects['Farm'].minigame;
                        
                        // Auto-harvest mature plants
                        for (let y = 0; y < 6; y++) {
                            for (let x = 0; x < 6; x++) {
                                const tile = garden.plot[y][x];
                                if (tile[0] >= 1) { // Has a plant
                                    const plant = garden.plantsById[tile[0] - 1];
                                    const age = tile[1];
                                    if (plant && age >= plant.mature) {
                                        garden.harvest(x, y);
                                    }
                                }
                            }
                        }
                        
                        // Auto-plant profitable crops in empty spots
                        const bestPlants = ['queenbeet', 'duketater', 'drowsyfern'];
                        for (let y = 0; y < 6; y++) {
                            for (let x = 0; x < 6; x++) {
                                if (garden.plot[y][x][0] === 0) { // Empty spot
                                    for (let plantName of bestPlants) {
                                        const plant = garden.plantsById.find(p => p.key === plantName);
                                        if (plant && garden.plantsUnlocked[plant.id]) {
                                            garden.clickTile(x, y);
                                            if (garden.seedSelected === plant.id) {
                                                garden.clickTile(x, y);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }, 5000); // Check every 5 seconds
                Game.Notify('Auto Garden', 'Enabled! Auto-harvesting and planting!', [10, 0], 2);
            } else {
                clearInterval(autoGardenInterval);
                Game.Notify('Auto Garden', 'Disabled!', [10, 0], 2);
            }
        });

        let autoGrimoireEnabled = false;
        let autoGrimoireInterval;
        document.getElementById('autoGrimoire').addEventListener('click', function() {
            autoGrimoireEnabled = !autoGrimoireEnabled;
            this.setAttribute('data-active', autoGrimoireEnabled);
            this.querySelector('.btn-status').textContent = autoGrimoireEnabled ? 'ON' : 'OFF';
            
            if (autoGrimoireEnabled) {
                autoGrimoireInterval = setInterval(() => {
                    if (Game.Objects['Wizard tower'].minigame) {
                        const grimoire = Game.Objects['Wizard tower'].minigame;
                        const magic = grimoire.magic;
                        const maxMagic = grimoire.magicM;
                        
                        // Cast best spell when we have enough magic
                        if (magic >= maxMagic * 0.9) { // 90% or more magic
                            // Priority: Force the Hand of Fate > Gambler's Fever Dream
                            if (grimoire.spells['hand of fate'] && grimoire.spells['hand of fate'].costM <= magic) {
                                grimoire.castSpell(grimoire.spells['hand of fate']);
                            } else if (grimoire.spells['gambler\'s fever dream'] && grimoire.spells['gambler\'s fever dream'].costM <= magic) {
                                grimoire.castSpell(grimoire.spells['gambler\'s fever dream']);
                            } else if (grimoire.spells['spontaneous edifice'] && grimoire.spells['spontaneous edifice'].costM <= magic) {
                                grimoire.castSpell(grimoire.spells['spontaneous edifice']);
                            }
                        }
                    }
                }, 10000); // Check every 10 seconds
                Game.Notify('Auto Grimoire', 'Enabled! Auto-casting spells!', [10, 0], 2);
            } else {
                clearInterval(autoGrimoireInterval);
                Game.Notify('Auto Grimoire', 'Disabled!', [10, 0], 2);
            }
        });

        let autoStockEnabled = false;
        let autoStockInterval;
        let stockHistory = {};
        document.getElementById('autoStock').addEventListener('click', function() {
            autoStockEnabled = !autoStockEnabled;
            this.setAttribute('data-active', autoStockEnabled);
            this.querySelector('.btn-status').textContent = autoStockEnabled ? 'ON' : 'OFF';
            
            if (autoStockEnabled) {
                autoStockInterval = setInterval(() => {
                    if (Game.Objects['Bank'].minigame) {
                        const market = Game.Objects['Bank'].minigame;
                        
                        // Trade each stock
                        for (let i = 0; i < market.goods.length; i++) {
                            const good = market.goods[i];
                            const price = good.val;
                            const stockId = good.id;
                            
                            // Initialize history
                            if (!stockHistory[stockId]) {
                                stockHistory[stockId] = [];
                            }
                            stockHistory[stockId].push(price);
                            
                            // Keep only last 10 prices
                            if (stockHistory[stockId].length > 10) {
                                stockHistory[stockId].shift();
                            }
                            
                            if (stockHistory[stockId].length >= 5) {
                                const avgPrice = stockHistory[stockId].reduce((a, b) => a + b) / stockHistory[stockId].length;
                                
                                // Buy if price is significantly below average and we have money
                                if (price < avgPrice * 0.7 && Game.cookies > good.val * 100) {
                                    market.buyGood(i, 10); // Buy 10
                                }
                                
                                // Sell if price is significantly above average and we own some
                                if (price > avgPrice * 1.3 && good.stock > 0) {
                                    market.sellGood(i, Math.min(10, good.stock)); // Sell up to 10
                                }
                            }
                        }
                    }
                }, 30000); // Check every 30 seconds
                Game.Notify('Auto Stock', 'Enabled! Auto-trading stocks!', [10, 0], 2);
            } else {
                clearInterval(autoStockInterval);
                stockHistory = {};
                Game.Notify('Auto Stock', 'Disabled!', [10, 0], 2);
            }
        });
    }

    // Start the script
    waitForGame();
})();