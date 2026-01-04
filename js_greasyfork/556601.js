// ==UserScript==
// @name         Duolingo Shop
// @icon         https://d35aaqx5ub95lt.cloudfront.net/vendor/0e58a94dda219766d98c7796b910beee.svg
// @namespace    https://tampermonkey.net/
// @version      2.6
// @description  Gets shop items
// @author       apersongithub
// @match        *://www.duolingo.com/*
// @match        *://www.duolingo.cn/*
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/556601/Duolingo%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/556601/Duolingo%20Shop.meta.js
// ==/UserScript==

/**
 * 💎 duo-gemsmith GUI - A Duolingo Reward Claim Tool 💎
 * -----------------------------------------------------------------------------------
 * Description: A GUI-based utility to claim various Duolingo rewards via API.
 *              Features categorized rewards, auto-claim functionality, and tracking.
 * Author: Modified for GUI by @apersongithub
 * Date: 2025-11-07
 *
 * DISCLAIMER: This tool is intended for educational purposes only.
 *             Use at your own risk. May violate Duolingo's Terms of Service.
 * -----------------------------------------------------------------------------------
 */

(function() {
    'use strict';

    // Reward categories with their patterns and types
    const REWARD_CATEGORIES = {
        'Daily Goals': {
            patterns: ['DAILY_GOAL', 'DAILY_GOAL_BALANCED', 'DAILY_GOAL_DOUBLE'],
            rewards: []
        },
        'Daily Quests': {
            patterns: ['DAILY_QUEST_THIRD', 'DAY_ONE_STREAK_GOAL_STARTER_REWARD'],
            rewards: []
        },
        'Skill Completion': {
            patterns: ['SKILL_COMPLETION', 'SKILL_COMPLETION_BALANCED'],
            rewards: []
        },
        'Path & Chests': {
            patterns: ['PATH_CHEST', 'CAPSTONE_COMPLETION', 'TIERED_PATH_CHEST', 'TIERED_TIMED_PATH_CHEST', 'FIRST_TIERED_PATH_CHEST', 'TIMED_PATH_CHEST'],
            rewards: []
        },
        'Streak Rewards': {
            patterns: ['STREAK_REWARD_CHEST', 'PERFECT_STREAK', 'STREAK_REWARD_ROAD_FALLBACK', 'NO_STREAK_FREEZE_CHALLENGE_REWARD'],
            rewards: []
        },
        'Social & Friends': {
            patterns: ['FRIENDS_QUEST', 'FRIENDS_QUEST_GEMS', 'FRIENDS_QUEST_XP_BOOST', 'ADD_A_FRIEND_QUEST', 'FAMILY_QUEST', 'FRIENDS_CLASH_QUEST_GEMS', 'INCENTIVIZED_FRIENDING_HEARTS', 'INCENTIVIZED_CONTACT_SYNC_GEMS'],
            rewards: []
        },
        'Events': {
            patterns: ['EVENTS_SOLO', 'EVENTS_PARTNER', 'MONTHLY_CHALLENGE', 'ARWAU'],
            rewards: []
        },
        'Sharing Rewards': {
            patterns: ['WECHAT_STREAK_SHARING', 'FIRST_TIME_SHARING_REWARD', 'RECURRING_SHARING_REWARD', 'LEADERBOARDS_RANKUP_SHARING', 'YEAR_IN_REVIEW_SHARING_REWARD'],
            rewards: []
        },
        'Shop & Videos': {
            patterns: ['SHOP_REWARDED_VIDEO', 'SHOP_REWARDED_VIDEO_BALANCED'],
            rewards: []
        },
        'Score Upgrades': {
            patterns: ['SCORE_UPGRADE', 'SCORE_UPGRADE_REDUCED', 'SCORE_UPGRADE_TIERED_CHEST'],
            rewards: []
        },
        'Time-Based': {
            patterns: ['EARLY_BIRD_CHEST', 'NIGHT_OWL_CHEST'],
            rewards: []
        },
        'Widgets & Mobile': {
            patterns: ['ADD_WIDGET_HEARTS', 'ADD_WIDGET_ENERGY_IOS'],
            rewards: []
        },
        'Other': {
            patterns: [],
            rewards: []
        }
    };

    let userId = null;
    let isClaimingAll = false;
    let claimInterval = null;

    // Parse reward data from the provided JSON
    function parseRewards(rewardBundles) {
        rewardBundles.forEach(bundle => {
            bundle.rewards.forEach(reward => {
                const rewardInfo = {
                    id: reward.id,
                    bundleType: bundle.rewardBundleType,
                    type: reward.rewardType,
                    consumed: reward.consumed,
                    amount: reward.amount || 0,
                    currency: reward.currency || '',
                    itemId: reward.itemId || '',
                    items: reward.items || [],
                    weight: reward.weight || 1,
                    isAdReward: reward.isAdReward || false
                };

                // Determine reward description
                let description = '';
                if (reward.currency && reward.amount) {
                    description = `${reward.amount} ${reward.currency}`;
                } else if (reward.itemId) {
                    description = reward.itemId.replace(/_/g, ' ');
                } else if (reward.items && reward.items.length > 0) {
                    description = reward.items.map(item =>
                        `${item.count || item.amount} ${item.itemType}`
                    ).join(', ');
                } else if (reward.amount && !reward.currency) {
                    description = `${reward.amount} Energy/Hearts`;
                } else {
                    description = reward.rewardType;
                }

                rewardInfo.description = description;

                // Categorize reward
                let categorized = false;
                for (const [category, data] of Object.entries(REWARD_CATEGORIES)) {
                    if (data.patterns.some(pattern => bundle.rewardBundleType.includes(pattern))) {
                        data.rewards.push(rewardInfo);
                        categorized = true;
                        break;
                    }
                }

                if (!categorized) {
                    REWARD_CATEGORIES['Other'].rewards.push(rewardInfo);
                }
            });
        });
    }

    // Get JWT from cookies
    function getJWTFromCookies() {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name === 'jwt_token') {
                return value;
            }
        }
        return null;
    }

    // Decode JWT to get user ID
    function decodeToken(token) {
        try {
            if (!token || !token.includes('.')) {
                throw new Error('Invalid JWT token');
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Malformed JWT');
            }

            const base64Userid = parts[1];
            const padded = base64Userid + '='.repeat((4 - (base64Userid.length % 4)) % 4);
            const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
            const payload = JSON.parse(decoded);

            return payload.sub;
        } catch (err) {
            console.error(`Error decoding token: ${err.message}`);
            throw err;
        }
    }

    // Claim a reward
    async function claimReward(rewardId, fromLanguage = 'en', learningLanguage = 'fr') {
        const apiUrl = `https://www.duolingo.com/2017-06-30/users/${userId}/rewards/${rewardId}`;

        const payload = {
            consumed: true,
            fromLanguage: fromLanguage,
            learningLanguage: learningLanguage
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            return {
                success: response.ok,
                status: response.status,
                statusText: response.statusText
            };
        } catch (err) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    // Create GUI
    function createGUI() {
        // Remove existing GUI if present
        const existing = document.getElementById('duo-gemsmith-gui');
        if (existing) existing.remove();

        // Create main container
        const gui = document.createElement('div');
        gui.id = 'duo-gemsmith-gui';
        gui.innerHTML = `
            <style>
                #duo-gemsmith-gui {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 450px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: 'Arial', sans-serif;
                    color: white;
                    overflow: hidden;
                }

                #duo-gemsmith-header {
                    background: rgba(0,0,0,0.2);
                    padding: 15px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid rgba(255,255,255,0.2);
                }

                #duo-gemsmith-header h2 {
                    margin: 0;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #duo-gemsmith-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.3s;
                }

                #duo-gemsmith-close:hover {
                    background: rgba(255,255,255,0.3);
                    transform: rotate(90deg);
                }

                #duo-gemsmith-controls {
                    padding: 15px;
                    background: rgba(0,0,0,0.1);
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .duo-btn {
                    flex: 1;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 12px;
                    transition: all 0.3s;
                    min-width: 100px;
                }

                .duo-btn-primary {
                    background: #4CAF50;
                    color: white;
                }

                .duo-btn-primary:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                }

                .duo-btn-danger {
                    background: #f44336;
                    color: white;
                }

                .duo-btn-danger:hover {
                    background: #da190b;
                }

                .duo-btn-warning {
                    background: #ff9800;
                    color: white;
                }

                .duo-btn-warning:hover {
                    background: #e68900;
                }

                .duo-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                #duo-gemsmith-stats {
                    padding: 10px 15px;
                    background: rgba(0,0,0,0.15);
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                }

                #duo-gemsmith-content {
                    max-height: 50vh;
                    overflow-y: auto;
                    padding: 10px;
                }

                #duo-gemsmith-content::-webkit-scrollbar {
                    width: 8px;
                }

                #duo-gemsmith-content::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }

                #duo-gemsmith-content::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.3);
                    border-radius: 10px;
                }

                #duo-gemsmith-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.5);
                }

                .reward-category {
                    margin-bottom: 15px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }

                .category-header {
                    padding: 12px;
                    background: rgba(0,0,0,0.2);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                    transition: background 0.3s;
                }

                .category-header:hover {
                    background: rgba(0,0,0,0.3);
                }

                .category-rewards {
                    max-height: 300px;
                    overflow-y: auto;
                }

                .reward-item {
                    padding: 10px 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 11px;
                    transition: background 0.3s;
                }

                .reward-item:hover {
                    background: rgba(255,255,255,0.05);
                }

                .reward-item:last-child {
                    border-bottom: none;
                }

                .reward-info {
                    flex: 1;
                }

                .reward-name {
                    font-weight: bold;
                    margin-bottom: 3px;
                    font-size: 11px;
                }

                .reward-desc {
                    opacity: 0.8;
                    font-size: 10px;
                }

                .reward-claimed {
                    background: rgba(76, 175, 80, 0.2);
                }

                .reward-btn {
                    padding: 5px 12px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 10px;
                    font-weight: bold;
                    transition: all 0.3s;
                }

                .claim-btn {
                    background: #2196F3;
                    color: white;
                }

                .claim-btn:hover {
                    background: #0b7dda;
                }

                .claimed-badge {
                    background: #4CAF50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 10px;
                }

                .category-collapsed .category-rewards {
                    display: none;
                }

                .collapse-icon {
                    transition: transform 0.3s;
                }

                .category-collapsed .collapse-icon {
                    transform: rotate(-90deg);
                }
            </style>

            <div id="duo-gemsmith-header">
                <h2>💎 Duo-Gemsmith GUI ⛏️</h2>
                <button id="duo-gemsmith-close">×</button>
            </div>

            <div id="duo-gemsmith-controls">
                <button class="duo-btn duo-btn-primary" id="claim-all-btn">Claim All Unclaimed</button>
                <button class="duo-btn duo-btn-danger" id="stop-claim-btn" disabled>Stop Auto-Claim</button>
                <button class="duo-btn duo-btn-warning" id="refresh-btn">Refresh Data</button>
            </div>

            <div id="duo-gemsmith-stats">
                <span id="total-rewards">Total: 0</span>
                <span id="claimed-rewards">Claimed: 0</span>
                <span id="unclaimed-rewards">Unclaimed: 0</span>
            </div>

            <div id="duo-gemsmith-content"></div>
        `;

        document.body.appendChild(gui);

        // Make draggable
        makeDraggable(gui);

        // Event listeners
        document.getElementById('duo-gemsmith-close').addEventListener('click', () => {
            gui.remove();
        });

        document.getElementById('claim-all-btn').addEventListener('click', startAutoClaimAll);
        document.getElementById('stop-claim-btn').addEventListener('click', stopAutoClaim);
        document.getElementById('refresh-btn').addEventListener('click', refreshRewards);

        // Render rewards
        renderRewards();
    }

    // Render rewards in GUI
    function renderRewards() {
        const content = document.getElementById('duo-gemsmith-content');
        content.innerHTML = '';

        let totalRewards = 0;
        let claimedCount = 0;

        Object.entries(REWARD_CATEGORIES).forEach(([categoryName, categoryData]) => {
            if (categoryData.rewards.length === 0) return;

            totalRewards += categoryData.rewards.length;
            claimedCount += categoryData.rewards.filter(r => r.consumed).length;

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'reward-category';
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <span>${categoryName} (${categoryData.rewards.length})</span>
                    <span class="collapse-icon">▼</span>
                </div>
                <div class="category-rewards"></div>
            `;

            const rewardsContainer = categoryDiv.querySelector('.category-rewards');

            categoryData.rewards.forEach(reward => {
                const rewardDiv = document.createElement('div');
                rewardDiv.className = `reward-item ${reward.consumed ? 'reward-claimed' : ''}`;
                rewardDiv.innerHTML = `
                    <div class="reward-info">
                        <div class="reward-name">${reward.bundleType}</div>
                        <div class="reward-desc">${reward.description}</div>
                    </div>
                    ${reward.consumed
                        ? '<span class="claimed-badge">✓ Claimed</span>'
                        : `<button class="reward-btn claim-btn" data-reward-id="${reward.id}">Claim</button>`
                    }
                `;

                if (!reward.consumed) {
                    const claimBtn = rewardDiv.querySelector('.claim-btn');
                    claimBtn.addEventListener('click', async () => {
                        claimBtn.textContent = '⏳';
                        claimBtn.disabled = true;

                        const result = await claimReward(reward.id);

                        if (result.success) {
                            reward.consumed = true;
                            claimBtn.parentElement.innerHTML = '<span class="claimed-badge">✓ Claimed</span>';
                            rewardDiv.classList.add('reward-claimed');
                            updateStats();
                        } else {
                            claimBtn.textContent = '❌ Failed';
                            setTimeout(() => {
                                claimBtn.textContent = 'Claim';
                                claimBtn.disabled = false;
                            }, 2000);
                        }
                    });
                }

                rewardsContainer.appendChild(rewardDiv);
            });

            // Toggle collapse
            categoryDiv.querySelector('.category-header').addEventListener('click', () => {
                categoryDiv.classList.toggle('category-collapsed');
            });

            content.appendChild(categoryDiv);
        });

        updateStats();
    }

    // Update statistics
    function updateStats() {
        let total = 0;
        let claimed = 0;

        Object.values(REWARD_CATEGORIES).forEach(category => {
            total += category.rewards.length;
            claimed += category.rewards.filter(r => r.consumed).length;
        });

        document.getElementById('total-rewards').textContent = `Total: ${total}`;
        document.getElementById('claimed-rewards').textContent = `Claimed: ${claimed}`;
        document.getElementById('unclaimed-rewards').textContent = `Unclaimed: ${total - claimed}`;
    }

    // Auto-claim all unclaimed rewards
    async function startAutoClaimAll() {
        if (isClaimingAll) return;

        isClaimingAll = true;
        document.getElementById('claim-all-btn').disabled = true;
        document.getElementById('stop-claim-btn').disabled = false;

        const unclaimedRewards = [];
        Object.values(REWARD_CATEGORIES).forEach(category => {
            unclaimedRewards.push(...category.rewards.filter(r => !r.consumed));
        });

        let index = 0;

        claimInterval = setInterval(async () => {
            if (!isClaimingAll || index >= unclaimedRewards.length) {
                stopAutoClaim();
                return;
            }

            const reward = unclaimedRewards[index];
            console.log(`Claiming [${index + 1}/${unclaimedRewards.length}]: ${reward.id}`);

            const result = await claimReward(reward.id);

            if (result.success) {
                reward.consumed = true;
                console.log(`✓ Successfully claimed: ${reward.description}`);
            } else {
                console.log(`✗ Failed to claim: ${reward.id}`);
            }

            index++;

            // Refresh GUI every 5 claims
            if (index % 5 === 0) {
                renderRewards();
            }
        }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
    }

    // Stop auto-claim
    function stopAutoClaim() {
        isClaimingAll = false;
        if (claimInterval) {
            clearInterval(claimInterval);
            claimInterval = null;
        }
        document.getElementById('claim-all-btn').disabled = false;
        document.getElementById('stop-claim-btn').disabled = true;
        renderRewards();
    }

    // Refresh rewards data
    async function refreshRewards() {
        // Clear existing data
        Object.values(REWARD_CATEGORIES).forEach(category => {
            category.rewards = [];
        });

        // Fetch fresh data
        try {
            const response = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=rewardBundles`);
            const data = await response.json();

            if (data.rewardBundles) {
                parseRewards(data.rewardBundles);
                renderRewards();
                console.log('✓ Rewards refreshed successfully');
            }
        } catch (err) {
            console.error('Failed to refresh rewards:', err);
        }
    }

    // Make element draggable
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('#duo-gemsmith-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Initialize
    async function init() {
        console.log('💎 Initializing Duo-Gemsmith GUI...');

        const token = getJWTFromCookies();
        if (!token) {
            alert('⚠️ JWT token not found! Please make sure you are logged into Duolingo.');
            return;
        }

        try {
            userId = decodeToken(token);
            console.log(`✓ User ID: ${userId}`);

            // Fetch reward data
            const response = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=rewardBundles`);
            const data = await response.json();

            if (data.rewardBundles) {
                parseRewards(data.rewardBundles);
                createGUI();
                console.log('✓ Duo-Gemsmith GUI loaded successfully!');
            } else {
                alert('⚠️ Could not load reward data.');
            }
        } catch (err) {
            console.error('Error initializing:', err);
            alert(`⚠️ Error: ${err.message}`);
        }
    }

    // Start the application
    init();
})();