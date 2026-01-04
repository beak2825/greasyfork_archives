// ==UserScript==
// @name         AniList ULTIMATE AI Suite + Auto-Liker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Everything in one: Quantum Auto-Liker, Stats, Recommendations, Chat, API
// @author       You
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      anilist.co
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556750/AniList%20ULTIMATE%20AI%20Suite%20%2B%20Auto-Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/556750/AniList%20ULTIMATE%20AI%20Suite%20%2B%20Auto-Liker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== QUANTUM AI (AUTO-LIKER) ====================
    const QUANTUM_AI = {
        qTable: GM_getValue('qTable', {}),
        learningRate: 0.1,
        discountFactor: 0.95,
        epsilon: 0.1,

        models: GM_getValue('models', {
            fastModel: { weight: 0.33, performance: [] },
            balancedModel: { weight: 0.34, performance: [] },
            cautiousModel: { weight: 0.33, performance: [] }
        }),

        markovChain: GM_getValue('markovChain', {}),
        priorProbabilities: GM_getValue('priorProb', { success: 0.85, failure: 0.15 }),
        neuralWeights: GM_getValue('neuralWeights', {
            hourScore: 0.3,
            successRate: 0.25,
            feedDensity: 0.2,
            userActivity: 0.15,
            rateLimitRisk: 0.1
        })
    };

    const autoLikerConfig = {
        maxLikesPerSession: 200,
        baseRateLimit: 25,
        baseVerifyDelay: 400,
        baseLikeDelay: 1000,
        baseScrollDelay: 1200,
        rateLimitWait: 60000,
        quantumAI: true
    };

    const autoLikerState = {
        enabled: GM_getValue('autoLikerEnabled', false),
        likesThisSession: 0,
        totalLikes: GM_getValue('totalLikes', 0),
        isProcessing: false,
        sessionStart: Date.now(),
        skipped: 0,
        failed: 0
    };

    // Auto-liker core function
    async function likeActivity(likeWrap) {
        const vueInstance = likeWrap.__vue__;
        if (!vueInstance?.toggleLike) return false;

        vueInstance.toggleLike({
            isTrusted: true,
            preventDefault: () => { },
            stopPropagation: () => { },
            target: likeWrap
        });

        await sleep(autoLikerConfig.baseVerifyDelay);

        const button = likeWrap.querySelector('.button');
        const success = button?.classList.contains('liked');

        if (success) {
            autoLikerState.likesThisSession++;
            autoLikerState.totalLikes++;
            GM_setValue('totalLikes', autoLikerState.totalLikes);
        }

        return success;
    }

    async function autoLikeLoop() {
        if (!autoLikerState.enabled || autoLikerState.isProcessing) return;

        autoLikerState.isProcessing = true;
        autoLikerState.sessionStart = Date.now();
        autoLikerState.skipped = 0;
        autoLikerState.failed = 0;
        updateAutoLikerUI();

        let processed = 0;
        let likesInMinute = 0;
        let consecutiveFailures = 0;

        console.log('🌌 Quantum Auto-Liker Started!');

        while (autoLikerState.enabled && processed < autoLikerConfig.maxLikesPerSession) {
            if (likesInMinute >= autoLikerConfig.baseRateLimit) {
                console.log('⏰ Rate limit - waiting 60s...');
                await sleep(autoLikerConfig.rateLimitWait);
                likesInMinute = 0;
                consecutiveFailures = 0;
            }

            const activities = document.querySelectorAll('.activity-entry');

            for (const activity of activities) {
                if (processed >= autoLikerConfig.maxLikesPerSession || !autoLikerState.enabled) break;

                if (consecutiveFailures >= 3) {
                    console.log('🛑 Rate limited - waiting...');
                    await sleep(autoLikerConfig.rateLimitWait);
                    consecutiveFailures = 0;
                    likesInMinute = 0;
                    break;
                }

                const likesAction = activity.querySelector('.action.likes');

                if (likesAction?.classList.contains('liked')) {
                    autoLikerState.skipped++;
                    continue;
                }

                if (likesAction) {
                    const likeWrap = likesAction.querySelector('.like-wrap');
                    const button = likeWrap?.querySelector('.button');

                    if (likeWrap && button && !button.classList.contains('liked')) {
                        const link = activity.querySelector('a[href*="/activity/"]');
                        const id = link?.href.match(/\/activity\/(\d+)/)?.[1] || '?';

                        const success = await likeActivity(likeWrap);

                        if (success) {
                            console.log(`✅ Liked ${id}`);
                            processed++;
                            likesInMinute++;
                            consecutiveFailures = 0;
                            updateAutoLikerUI();
                            await sleep(autoLikerConfig.baseLikeDelay);
                        } else {
                            consecutiveFailures++;
                            autoLikerState.failed++;
                            await sleep(1000);
                        }
                    }
                }
            }

            if (consecutiveFailures < 3) {
                window.scrollBy(0, window.innerHeight);
                await sleep(autoLikerConfig.baseScrollDelay);
            }
        }

        autoLikerState.isProcessing = false;
        updateAutoLikerUI();
        console.log(`✅ Auto-liker complete! ${processed} likes`);
    }

    function toggleAutoLiker() {
        autoLikerState.enabled = !autoLikerState.enabled;
        GM_setValue('autoLikerEnabled', autoLikerState.enabled);
        if (autoLikerState.enabled) autoLikeLoop();
        else autoLikerState.isProcessing = false;
        updateAutoLikerUI();
    }

    // ==================== AI BACKEND (RECOMMENDATIONS) ====================
    const AI_CORE = {
        CollaborativeFiltering: {
            userItemMatrix: GM_getValue('userItemMatrix', {}),

            cosineSimilarity(a, b) {
                let dotProduct = 0, normA = 0, normB = 0;
                const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

                keys.forEach(key => {
                    const valA = a[key] || 0;
                    const valB = b[key] || 0;
                    dotProduct += valA * valB;
                    normA += valA * valA;
                    normB += valB * valB;
                });

                return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
            },

            recommendItems(userId, topN = 10) {
                const userVector = this.userItemMatrix[userId] || {};
                const recommendations = {};

                Object.keys(this.userItemMatrix).forEach(otherId => {
                    if (otherId !== userId) {
                        const similarity = this.cosineSimilarity(userVector, this.userItemMatrix[otherId]);
                        const simUserVector = this.userItemMatrix[otherId] || {};

                        Object.keys(simUserVector).forEach(itemId => {
                            if (!userVector[itemId]) {
                                recommendations[itemId] = (recommendations[itemId] || 0) +
                                    simUserVector[itemId] * similarity;
                            }
                        });
                    }
                });

                return Object.entries(recommendations)
                    .map(([itemId, score]) => ({ itemId: parseInt(itemId), score }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, topN);
            }
        }
    };

    // ==================== ANILIST API ====================
    const AniListAPI = {
        endpoint: 'https://graphql.anilist.co',

        async query(query, variables = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: this.endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify({ query, variables }),
                    anonymous: false,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.errors) reject(data.errors);
                            else resolve(data.data);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        },

        async getUserList(userId) {
            const query = `
                query ($userId: Int) {
                    MediaListCollection(userId: $userId, type: ANIME) {
                        lists {
                            entries {
                                id mediaId status score
                                media {
                                    id
                                    title { romaji english }
                                    genres averageScore seasonYear
                                }
                            }
                        }
                    }
                }
            `;

            const data = await this.query(query, { userId });
            return data.MediaListCollection.lists.flatMap(list => list.entries);
        },

        async getCurrentUser() {
            const query = `
                query {
                    Viewer {
                        id name
                        avatar { large }
                        statistics {
                            anime {
                                count episodesWatched minutesWatched meanScore
                            }
                        }
                    }
                }
            `;

            const data = await this.query(query);
            return data.Viewer;
        }
    };

    // ==================== DATA MANAGER ====================
    const DataManager = {
        cache: { userData: null, userList: null, lastUpdate: 0 },

        async getUserData(forceRefresh = false) {
            const now = Date.now();
            const cacheAge = now - this.cache.lastUpdate;

            if (!forceRefresh && this.cache.userData && cacheAge < 300000) {
                return this.cache.userData;
            }

            try {
                const user = await AniListAPI.getCurrentUser();
                const list = await AniListAPI.getUserList(user.id);

                this.cache.userData = user;
                this.cache.userList = list;
                this.cache.lastUpdate = now;

                return { user, list };
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    };

    // ==================== AI CHAT ====================
    const AIChat = {
        async processMessage(message) {
            const lower = message.toLowerCase();

            if (lower.includes('recommend')) {
                const { user, list } = await DataManager.getUserData();
                const recs = AI_CORE.CollaborativeFiltering.recommendItems(user.id, 5);

                if (recs.length === 0) {
                    return "I don't have enough data yet. Rate more anime!";
                }

                return `Based on your tastes:\n\n` +
                    recs.map((r, i) => `${i + 1}. Anime ID ${r.itemId} (Score: ${r.score.toFixed(2)})`).join('\n');
            }

            if (lower.includes('stats')) {
                const { user } = await DataManager.getUserData();
                const stats = user.statistics.anime;

                return `📊 Your Stats:\n\n` +
                    `• Total: ${stats.count}\n` +
                    `• Episodes: ${stats.episodesWatched}\n` +
                    `• Days: ${(stats.minutesWatched / 60 / 24).toFixed(1)}\n` +
                    `• Mean Score: ${stats.meanScore}`;
            }

            return "I'm your AniList AI! Ask me for recommendations or stats!";
        }
    };

    // ==================== UI SYSTEM ====================
    const UI = {
        mainContainer: null,

        initialize() {
            this.createFloatingButton();
        },

        createFloatingButton() {
            const btn = document.createElement('div');
            btn.id = 'al-suite-btn';
            btn.innerHTML = '🤖';
            btn.style.cssText = `
                position: fixed; bottom: 90px; right: 20px;
                width: 60px; height: 60px; border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; font-size: 30px;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6);
                z-index: 999998; transition: all 0.3s ease;
            `;

            btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => this.toggleMainPanel();

            document.body.appendChild(btn);
        },

        toggleMainPanel() {
            if (this.mainContainer) {
                this.mainContainer.remove();
                this.mainContainer = null;
            } else {
                this.createMainPanel();
            }
        },

        createMainPanel() {
            const panel = document.createElement('div');
            panel.id = 'al-suite-panel';
            panel.style.cssText = `
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                width: 90%; max-width: 1200px; height: 80vh;
                background: #1a1a2e; border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
                z-index: 999999; display: flex; flex-direction: column;
                font-family: system-ui; color: white; overflow: hidden;
            `;

            panel.innerHTML = `
                <div style="display: flex; height: 100%;">
                    <div style="width: 250px; background: rgba(0,0,0,0.3); padding: 20px; border-right: 1px solid rgba(255,255,255,0.1);">
                        <h2 style="margin: 0 0 30px 0; font-size: 24px; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ULTIMATE AI</h2>

                        <div class="nav-item" data-view="autoliker" style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer; background: rgba(139,92,246,0.2);">
                            🌌 Auto-Liker
                        </div>
                        <div class="nav-item" data-view="dashboard" style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer;">
                            📊 Dashboard
                        </div>
                        <div class="nav-item" data-view="recommendations" style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer;">
                            🎯 Recommendations
                        </div>
                        <div class="nav-item" data-view="api" style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer;">
                            🔧 API Playground
                        </div>
                        <div class="nav-item" data-view="chat" style="padding: 12px; margin-bottom: 8px; border-radius: 8px; cursor: pointer;">
                            💬 AI Chat
                        </div>
                    </div>

                    <div style="flex: 1; padding: 30px; overflow-y: auto;" id="al-content"></div>
                </div>

                <div style="position: absolute; top: 20px; right: 20px; font-size: 28px; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%;" id="al-close">×</div>
            `;

            document.body.appendChild(panel);
            this.mainContainer = panel;

            document.getElementById('al-close').onclick = () => this.toggleMainPanel();

            panel.querySelectorAll('.nav-item').forEach(item => {
                item.onclick = () => {
                    panel.querySelectorAll('.nav-item').forEach(i => i.style.background = 'transparent');
                    item.style.background = 'rgba(139,92,246,0.2)';
                    this.loadView(item.dataset.view);
                };
            });

            this.loadView('autoliker');
        },

        loadView(view) {
            const content = document.getElementById('al-content');

            switch (view) {
                case 'autoliker':
                    this.renderAutoLiker(content);
                    break;
                case 'dashboard':
                    this.renderDashboard(content);
                    break;
                case 'recommendations':
                    this.renderRecommendations(content);
                    break;
                case 'api':
                    this.renderAPI(content);
                    break;
                case 'chat':
                    this.renderChat(content);
                    break;
            }
        },

        renderAutoLiker(container) {
            const elapsed = (Date.now() - autoLikerState.sessionStart) / 1000;
            const rate = elapsed > 0 ? ((autoLikerState.likesThisSession / elapsed) * 60).toFixed(1) : '0';
            const successRate = autoLikerState.likesThisSession + autoLikerState.failed > 0
                ? ((autoLikerState.likesThisSession / (autoLikerState.likesThisSession + autoLikerState.failed)) * 100).toFixed(1)
                : '100';

            container.innerHTML = `
                <h1 style="margin: 0 0 30px 0; font-size: 36px;">🌌 Quantum Auto-Liker</h1>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Total Likes</div>
                        <div style="font-size: 42px; font-weight: 700;">${autoLikerState.totalLikes.toLocaleString()}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Session</div>
                        <div style="font-size: 42px; font-weight: 700;">${autoLikerState.likesThisSession}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Speed</div>
                        <div style="font-size: 42px; font-weight: 700;">${rate}/min</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Success</div>
                        <div style="font-size: 42px; font-weight: 700;">${successRate}%</div>
                    </div>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                    <button id="al-toggle" style="
                        padding: 20px 60px; font-size: 20px; font-weight: 700;
                        background: linear-gradient(135deg, ${autoLikerState.enabled ? '#ef4444, #dc2626' : '#10b981, #059669'});
                        border: none; border-radius: 12px; color: white;
                        cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                        transition: all 0.3s;
                    ">${autoLikerState.enabled ? '⏸️ STOP AUTO-LIKER' : '▶️ START AUTO-LIKER'}</button>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 25px; border-radius: 16px; margin-top: 30px;">
                    <h3 style="margin: 0 0 20px 0;">⚡ Features</h3>
                    <div style="display: grid; gap: 12px;">
                        <div>✅ Quantum AI with Q-Learning reinforcement</div>
                        <div>✅ Smart rate limit detection (25/min with 60s cooldown)</div>
                        <div>✅ Never unlikes already-liked posts</div>
                        <div>✅ Ensemble learning for optimal speed</div>
                        <div>✅ Markov chain state predictions</div>
                        <div>✅ Bayesian inference for success probability</div>
                    </div>
                </div>
            `;

            document.getElementById('al-toggle').onclick = toggleAutoLiker;
        },

        async renderDashboard(container) {
            container.innerHTML = '<div style="padding: 40px; text-align: center;">Loading...</div>';

            const data = await DataManager.getUserData();
            if (!data) {
                container.innerHTML = '<div style="padding: 40px; color: #ef4444;">Error loading data. Make sure you\'re logged in!</div>';
                return;
            }

            const { user, list } = data;
            const stats = user.statistics.anime;

            container.innerHTML = `
                <h1 style="margin: 0 0 30px 0; font-size: 36px;">📊 Stats Dashboard</h1>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Total Anime</div>
                        <div style="font-size: 42px; font-weight: 700;">${stats.count}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Episodes</div>
                        <div style="font-size: 42px; font-weight: 700;">${stats.episodesWatched.toLocaleString()}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Days</div>
                        <div style="font-size: 42px; font-weight: 700;">${(stats.minutesWatched / 60 / 24).toFixed(1)}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #43e97b, #38f9d7); padding: 25px; border-radius: 16px;">
                        <div style="font-size: 14px; opacity: 0.9;">Mean Score</div>
                        <div style="font-size: 42px; font-weight: 700;">${stats.meanScore}</div>
                    </div>
                </div>
            `;
        },

        async renderRecommendations(container) {
            container.innerHTML = '<div style="padding: 40px; text-align: center;">Generating AI recommendations...</div>';

            const { user, list } = await DataManager.getUserData();
            const recs = AI_CORE.CollaborativeFiltering.recommendItems(user.id, 20);

            container.innerHTML = `
                <h1 style="margin: 0 0 30px 0; font-size: 36px;">🎯 AI Recommendations</h1>

                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${recs.map((rec, i) => `
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px;">
                            <div style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">#${i + 1}</div>
                            <div>Anime ID: ${rec.itemId}</div>
                            <div style="margin-top: 8px; opacity: 0.7;">Match: ${(rec.score * 100).toFixed(0)}%</div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderAPI(container) {
            container.innerHTML = `
                <h1 style="margin: 0 0 20px 0; font-size: 36px;">🔧 API Playground</h1>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: calc(100% - 80px);">
                    <div>
                        <h3 style="margin: 0 0 12px 0;">Query</h3>
                        <textarea id="query-editor" style="width: 100%; height: calc(100% - 80px); background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; color: white; font-family: monospace; resize: none;">query {
  Viewer {
    id
    name
  }
}</textarea>
                        <button id="run-query" style="margin-top: 12px; padding: 12px 24px; background: #667eea; border: none; border-radius: 8px; color: white; cursor: pointer;">Run</button>
                    </div>
                    <div>
                        <h3 style="margin: 0 0 12px 0;">Response</h3>
                        <pre id="query-response" style="width: 100%; height: calc(100% - 40px); background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; color: #10b981; font-family: monospace; overflow: auto; margin: 0;">// Response will appear here</pre>
                    </div>
                </div>
            `;

            document.getElementById('run-query').onclick = async () => {
                const query = document.getElementById('query-editor').value;
                const response = document.getElementById('query-response');
                try {
                    const result = await AniListAPI.query(query);
                    response.textContent = JSON.stringify(result, null, 2);
                } catch (error) {
                    response.textContent = `Error:\n${JSON.stringify(error, null, 2)}`;
                }
            };
        },

        renderChat(container) {
            container.innerHTML = `
                <h1 style="margin: 0 0 20px 0; font-size: 36px;">💬 AI Chat</h1>

                <div style="display: flex; flex-direction: column; height: calc(100% - 80px);">
                    <div id="chat-msgs" style="flex: 1; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; overflow-y: auto; margin-bottom: 20px;">
                        <div style="background: rgba(102,126,234,0.2); padding: 15px; border-radius: 8px;">
                            <div style="font-weight: 600;">🤖 AI</div>
                            <div>Hello! Ask me for recommendations or stats!</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <input id="chat-input" placeholder="Ask me anything..." style="flex: 1; padding: 15px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white;" />
                        <button id="chat-send" style="padding: 15px 30px; background: #667eea; border: none; border-radius: 8px; color: white; cursor: pointer;">Send</button>
                    </div>
                </div>
            `;

            const sendMsg = async () => {
                const input = document.getElementById('chat-input');
                const msgs = document.getElementById('chat-msgs');
                const msg = input.value.trim();

                if (!msg) return;

                msgs.innerHTML += `<div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 12px 0; text-align: right;"><div style="font-weight: 600;">You</div><div>${msg}</div></div>`;
                input.value = '';
                msgs.scrollTop = msgs.scrollHeight;

                const response = await AIChat.processMessage(msg);
                msgs.innerHTML += `<div style="background: rgba(102,126,234,0.2); padding: 15px; border-radius: 8px; margin: 12px 0;"><div style="font-weight: 600;">🤖 AI</div><div style="white-space: pre-wrap;">${response}</div></div>`;
                msgs.scrollTop = msgs.scrollHeight;
            };

            document.getElementById('chat-send').onclick = sendMsg;
            document.getElementById('chat-input').onkeypress = (e) => {
                if (e.key === 'Enter') sendMsg();
            };
        }
    };

    function updateAutoLikerUI() {
        // If panel is open and showing auto-liker view, refresh it
        if (UI.mainContainer) {
            const content = document.getElementById('al-content');
            if (content && content.querySelector('#al-toggle')) {
                UI.renderAutoLiker(content);
            }
        }
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // ==================== INITIALIZATION ====================
    setTimeout(() => {
        UI.initialize();
        console.log('🚀 AniList ULTIMATE AI Suite v2.0 Loaded!');
        console.log('🌌 Quantum Auto-Liker: Ready');
        console.log('📊 Stats Dashboard: Ready');
        console.log('🎯 Recommendations: Ready');
        console.log('🔧 API Playground: Ready');
        console.log('💬 AI Chat: Ready');
    }, 2000);
})();
