// ==UserScript==
// @name         Discord Quest Auto-Complete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-complete Discord quests with one click
// @author       manolo_kat
// @license      GNU GPLv3
// @match        https://discord.com/*
// @match        https://*.discord.com/*
// @grant        none
// @run-at       document-end
// @supportURL   https://github.com/Manolo-Kat/discord_quests_script_tampermonkey/issues
// @downloadURL https://update.greasyfork.org/scripts/562155/Discord%20Quest%20Auto-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/562155/Discord%20Quest%20Auto-Complete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for Discord to fully load
    const waitForElement = (selector, callback, interval = 100, timeout = 10000) => {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.log('Element not found:', selector);
            }
        }, interval);
    };

    // Function to inject the button
    const injectButton = () => {
        // Check if we're on the quests page
        const checkQuestsPage = () => {
            // Look for quest-related elements
            const isQuestsPage = window.location.href.includes('/quests') ||
                                 document.querySelector('[class*="quest"]') ||
                                 document.querySelector('[aria-label*="Quest"]');

            return isQuestsPage;
        };

        const createButton = () => {
            // Remove existing button if any
            const existingButton = document.getElementById('quest-auto-complete-btn');
            if (existingButton) {
                existingButton.remove();
            }

            // Create button
            const button = document.createElement('button');
            button.id = 'quest-auto-complete-btn';
            button.textContent = 'Start Completing Quests';
            button.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                background-color: #5865F2;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(88, 101, 242, 0.3);
                transition: all 0.2s ease;
                font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            `;

            // Hover effect
            button.onmouseenter = () => {
                button.style.backgroundColor = '#4752C4';
                button.style.transform = 'translateY(-1px)';
                button.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.4)';
            };

            button.onmouseleave = () => {
                button.style.backgroundColor = '#5865F2';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = '0 2px 10px rgba(88, 101, 242, 0.3)';
            };

            // Click handler
            button.onclick = () => {
                button.disabled = true;
                button.textContent = 'Processing...';
                button.style.backgroundColor = '#4752C4';

                runQuestAutomation();
            };

            document.body.appendChild(button);
        };

        // Check if on quests page and create button
        if (checkQuestsPage()) {
            createButton();
        }

        // Watch for navigation changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (checkQuestsPage()) {
                    setTimeout(createButton, 1000);
                } else {
                    const btn = document.getElementById('quest-auto-complete-btn');
                    if (btn) btn.remove();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    };

    // The main quest automation code
    const runQuestAutomation = () => {
        try {
            delete window.$;
            let wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
            window.webpackChunkdiscord_app.pop();

            // Store references
            let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.Z;
            let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getRunningGames)?.exports?.ZP;
            let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getQuest)?.exports?.Z;
            let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent)?.exports?.Z;
            let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.ZP?.getSFWDefaultChannel)?.exports?.ZP;
            let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.Z?.__proto__?.flushWaitQueue)?.exports?.Z;
            let api = Object.values(wpRequire.c).find(x => x?.exports?.tn?.get)?.exports?.tn;

            // Validate all required stores were found
            if (!ApplicationStreamingStore || !RunningGameStore || !QuestsStore || !ChannelStore || !GuildChannelStore || !FluxDispatcher || !api) {
                console.error("❌ Failed to find required Discord stores. Please refresh and try again.");
                alert("Failed to initialize. Please refresh the page and try again.");
                resetButton();
                return;
            }

            // Configuration
            const CONFIG = {
                VIDEO_SPEED: 7,
                VIDEO_INTERVAL: 1000,
                MAX_FUTURE: 10,
                HEARTBEAT_INTERVAL: 20000,
                JITTER_MAX: 3000,
                RETRY_ATTEMPTS: 3,
                RETRY_DELAY: 2000
            };

            // Utility functions
            const log = (msg, type = 'info') => {
                const timestamp = new Date().toLocaleTimeString();
                const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
                console.log(`[${timestamp}] ${prefix} ${msg}`);
            };

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const addJitter = (ms) => ms + Math.random() * CONFIG.JITTER_MAX;

            const retryAsync = async (fn, attempts = CONFIG.RETRY_ATTEMPTS) => {
                for (let i = 0; i < attempts; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === attempts - 1) throw error;
                        log(`Retry ${i + 1}/${attempts} after error: ${error.message}`, 'warn');
                        await sleep(CONFIG.RETRY_DELAY * (i + 1));
                    }
                }
            };

            // Get active quests
            let activeQuests = [...QuestsStore.quests.values()].filter(x =>
                x.id !== "1412491570820812933" &&
                x.userStatus?.enrolledAt != null &&
                x.userStatus?.claimedAt == null &&
                x.userStatus?.completedAt == null &&
                new Date(x.config.expiresAt).getTime() > Date.now()
            );

            let isApp = typeof DiscordNative !== "undefined";

            if (activeQuests.length === 0) {
                log("No enrolled/uncompleted quests found!");
                alert("No active quests found!");
                resetButton();
                return;
            }

            log(`Found ${activeQuests.length} enrolled quest(s). Starting simultaneous execution...`);
            activeQuests.forEach(q => log(`  • ${q.config.messages.questName}`));
            log("");

            // Quest completion handlers
            const activeListeners = new Map();
            const activeFakeGames = new Map();
            let streamQuestCount = 0;

            const handlers = {
                WATCH_VIDEO: async (quest, taskConfig) => {
                    const taskName = taskConfig.tasks.WATCH_VIDEO ? 'WATCH_VIDEO' : 'WATCH_VIDEO_ON_MOBILE';
                    const secondsNeeded = taskConfig.tasks[taskName].target;
                    let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;
                    const enrolledAt = new Date(quest.userStatus.enrolledAt).getTime();

                    log(`[${quest.config.messages.questName}] Starting video watch (${secondsDone}/${secondsNeeded}s)`);

                    while (secondsDone < secondsNeeded) {
                        const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + CONFIG.MAX_FUTURE;
                        const diff = maxAllowed - secondsDone;

                        if (diff >= CONFIG.VIDEO_SPEED) {
                            const timestamp = Math.min(secondsNeeded, secondsDone + CONFIG.VIDEO_SPEED + Math.random());

                            const res = await retryAsync(() =>
                                api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp}})
                            );

                            secondsDone = Math.min(secondsNeeded, timestamp);
                            const progress = Math.round((secondsDone / secondsNeeded) * 100);
                            log(`[${quest.config.messages.questName}] Progress: ${progress}% (${secondsDone}/${secondsNeeded}s)`);

                            if (res.body.completed_at != null) break;
                        }

                        await sleep(CONFIG.VIDEO_INTERVAL);
                    }

                    log(`[${quest.config.messages.questName}] Completed!`, 'success');
                },

                WATCH_VIDEO_ON_MOBILE: async (quest, taskConfig) => {
                    return handlers.WATCH_VIDEO(quest, taskConfig);
                },

                PLAY_ON_DESKTOP: async (quest, taskConfig) => {
                    if (!isApp) {
                        log(`[${quest.config.messages.questName}] Requires desktop app - skipping`, 'error');
                        return;
                    }

                    const applicationId = quest.config.application.id;
                    const applicationName = quest.config.application.name;
                    const secondsNeeded = taskConfig.tasks.PLAY_ON_DESKTOP.target;
                    const secondsDone = quest.userStatus?.progress?.PLAY_ON_DESKTOP?.value ?? 0;
                    const pid = Math.floor(Math.random() * 30000) + 1000;

                    log(`[${quest.config.messages.questName}] Spoofing game: ${applicationName}`);

                    const res = await retryAsync(() =>
                        api.get({url: `/applications/public?application_ids=${applicationId}`})
                    );

                    if (!res.body || res.body.length === 0) {
                        log(`[${quest.config.messages.questName}] Failed to fetch application data`, 'error');
                        return;
                    }

                    const appData = res.body[0];
                    const executable = appData.executables?.find(x => x.os === "win32");

                    if (!executable) {
                        log(`[${quest.config.messages.questName}] No Windows executable found`, 'error');
                        return;
                    }

                    const exeName = executable.name.replace(">", "");

                    const fakeGame = {
                        cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                        exeName,
                        exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                        hidden: false,
                        isLauncher: false,
                        id: applicationId,
                        name: appData.name,
                        pid,
                        pidPath: [pid],
                        processName: appData.name,
                        start: Date.now(),
                    };

                    const realGames = RunningGameStore.getRunningGames();
                    const allFakeGames = Array.from(activeFakeGames.values());
                    const fakeGames = [...realGames, ...allFakeGames, fakeGame];
                    const realGetRunningGames = RunningGameStore.getRunningGames;
                    const realGetGameForPID = RunningGameStore.getGameForPID;

                    activeFakeGames.set(quest.id, fakeGame);

                    RunningGameStore.getRunningGames = () => {
                        const current = Array.from(activeFakeGames.values());
                        return [...realGetRunningGames.call(RunningGameStore), ...current];
                    };

                    RunningGameStore.getGameForPID = (p) => {
                        const fake = Array.from(activeFakeGames.values()).find(g => g.pid === p);
                        if (fake) return fake;
                        return realGetGameForPID.call(RunningGameStore, p);
                    };

                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [], added: [fakeGame], games: fakeGames});

                    return new Promise((resolve) => {
                        const fn = (data) => {
                            if (data.quest?.id !== quest.id) return;

                            const progress = quest.config.configVersion === 1
                                ? data.userStatus.streamProgressSeconds
                                : Math.floor(data.userStatus.progress?.PLAY_ON_DESKTOP?.value ?? 0);

                            const percentage = Math.round((progress / secondsNeeded) * 100);
                            log(`[${quest.config.messages.questName}] Progress: ${percentage}% (${progress}/${secondsNeeded}s)`);

                            if (progress >= secondsNeeded) {
                                log(`[${quest.config.messages.questName}] Completed!`, 'success');

                                activeFakeGames.delete(quest.id);

                                if (activeFakeGames.size === 0) {
                                    RunningGameStore.getRunningGames = realGetRunningGames;
                                    RunningGameStore.getGameForPID = realGetGameForPID;
                                }

                                const currentGames = RunningGameStore.getRunningGames();
                                FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: currentGames});

                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                activeListeners.delete(quest.id);
                                resolve();
                            }
                        };

                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                        activeListeners.set(quest.id, fn);
                        log(`[${quest.config.messages.questName}] Estimated time: ~${Math.ceil((secondsNeeded - secondsDone) / 60)} minutes`);
                    });
                },

                STREAM_ON_DESKTOP: async (quest, taskConfig) => {
                    if (!isApp) {
                        log(`[${quest.config.messages.questName}] Requires desktop app - skipping`, 'error');
                        return;
                    }

                    const applicationId = quest.config.application.id;
                    const applicationName = quest.config.application.name;
                    const secondsNeeded = taskConfig.tasks.STREAM_ON_DESKTOP.target;
                    const secondsDone = quest.userStatus?.progress?.STREAM_ON_DESKTOP?.value ?? 0;
                    const pid = Math.floor(Math.random() * 30000) + 1000;

                    log(`[${quest.config.messages.questName}] Spoofing stream: ${applicationName}`);
                    log(`[${quest.config.messages.questName}] Remember: Need at least 1 other person in VC!`, 'warn');

                    const realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                    streamQuestCount++;

                    ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({
                        id: applicationId,
                        pid,
                        sourceName: null
                    });

                    return new Promise((resolve) => {
                        const fn = (data) => {
                            if (data.quest?.id !== quest.id) return;

                            const progress = quest.config.configVersion === 1
                                ? data.userStatus.streamProgressSeconds
                                : Math.floor(data.userStatus.progress?.STREAM_ON_DESKTOP?.value ?? 0);

                            const percentage = Math.round((progress / secondsNeeded) * 100);
                            log(`[${quest.config.messages.questName}] Progress: ${percentage}% (${progress}/${secondsNeeded}s)`);

                            if (progress >= secondsNeeded) {
                                log(`[${quest.config.messages.questName}] Completed!`, 'success');

                                streamQuestCount--;
                                if (streamQuestCount === 0) {
                                    ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                }

                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                activeListeners.delete(quest.id);
                                resolve();
                            }
                        };

                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                        activeListeners.set(quest.id, fn);
                        log(`[${quest.config.messages.questName}] Estimated time: ~${Math.ceil((secondsNeeded - secondsDone) / 60)} minutes`);
                    });
                },

                PLAY_ACTIVITY: async (quest, taskConfig) => {
                    const secondsNeeded = taskConfig.tasks.PLAY_ACTIVITY.target;
                    const questName = quest.config.messages.questName;

                    log(`[${questName}] Starting activity play`);

                    const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ??
                        Object.values(GuildChannelStore.getAllGuilds()).find(x => x?.VOCAL?.length > 0)?.VOCAL?.[0]?.channel?.id;

                    if (!channelId) {
                        log(`[${questName}] No suitable channel found - skipping`, 'error');
                        return;
                    }

                    const streamKey = `call:${channelId}:1`;

                    while (true) {
                        const res = await retryAsync(() =>
                            api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}})
                        );

                        const progress = res.body.progress?.PLAY_ACTIVITY?.value ?? 0;
                        const percentage = Math.round((progress / secondsNeeded) * 100);
                        log(`[${questName}] Progress: ${percentage}% (${progress}/${secondsNeeded}s)`);

                        if (progress >= secondsNeeded) {
                            await retryAsync(() =>
                                api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}})
                            );
                            break;
                        }

                        await sleep(addJitter(CONFIG.HEARTBEAT_INTERVAL));
                    }

                    log(`[${questName}] Completed!`, 'success');
                }
            };

            // Main execution
            async function completeQuest(quest) {
                const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const taskName = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"]
                    .find(x => taskConfig.tasks[x] != null);

                if (!taskName || !handlers[taskName]) {
                    log(`[${quest.config.messages.questName}] Unknown task type: ${taskName}`, 'error');
                    return;
                }

                try {
                    await handlers[taskName](quest, taskConfig);
                } catch (error) {
                    log(`[${quest.config.messages.questName}] Failed: ${error.message}`, 'error');
                    console.error(error);
                }
            }

            // Execute all quests in parallel
            Promise.all(activeQuests.map(quest => completeQuest(quest)))
                .then(() => {
                    log("All quests completed!", 'success');

                    // Clean up
                    activeListeners.forEach((fn) => {
                        FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                    });
                    activeListeners.clear();
                    activeFakeGames.clear();

                    log("Script execution finished. All resources cleaned up.", 'success');

                    // Update button
                    const btn = document.getElementById('quest-auto-complete-btn');
                    if (btn) {
                        btn.textContent = '✓ Completed!';
                        btn.style.backgroundColor = '#3BA55D';
                        setTimeout(() => {
                            btn.disabled = false;
                            btn.textContent = 'Start Completing Quests';
                            btn.style.backgroundColor = '#5865F2';
                        }, 3000);
                    }
                })
                .catch(error => {
                    log(`Critical error: ${error.message}`, 'error');
                    console.error(error);
                    resetButton();
                });

        } catch (error) {
            console.error("Failed to run quest automation:", error);
            alert("Failed to run automation. Check console for details.");
            resetButton();
        }
    };

    const resetButton = () => {
        const btn = document.getElementById('quest-auto-complete-btn');
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Start Completing Quests';
            btn.style.backgroundColor = '#5865F2';
        }
    };

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(injectButton, 2000);
        });
    } else {
        setTimeout(injectButton, 2000);
    }

})();
