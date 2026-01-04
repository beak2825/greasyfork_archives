// ==UserScript==
// @name         DeepWiki Local Chat History
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  自动保存在 DeepWiki 上的聊天记录到本地, 并在仓库页面显示历史列表。(SPA 修复版)
// @author       Gemini (Updated)
// @match        https://deepwiki.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554017/DeepWiki%20Local%20Chat%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/554017/DeepWiki%20Local%20Chat%20History.meta.js
// ==/UserScript==

/* eslint-env es2017 */

(async function() {
    'use strict';

    const HISTORY_KEY = 'deepWikiHistory';
    let currentPath = ''; // 跟踪当前路径, 防止重复运行
    let saveInterval = null; // 跟踪保存逻辑的轮询
    let displayInterval = null; // 跟踪显示逻辑的轮询

    // --- 1. 存储辅助函数 (GM_ functions) ---

    async function getHistory() {
        const historyJson = await GM_getValue(HISTORY_KEY, '[]');
        try {
            return JSON.parse(historyJson);
        } catch (e) {
            console.error('DeepWiki History: Failed to parse history', e);
            return [];
        }
    }

    async function saveHistory(historyArray) {
        await GM_setValue(HISTORY_KEY, JSON.stringify(historyArray));
    }

    async function addHistoryEntry(entry) {
        const history = await getHistory();
        if (!history.some(e => e.sessionId === entry.sessionId)) {
            history.push(entry);
            await saveHistory(history);
            console.log('DeepWiki History: Saved new chat.', entry);
        }
    }

    async function removeHistoryEntry(sessionId) {
        let history = await getHistory();
        history = history.filter(entry => entry.sessionId !== sessionId);
        await saveHistory(history);
        console.log('DeepWiki History: Removed chat.', sessionId);
    }

    // --- 2. 停止所有轮询 (新) ---
    // 这是修复 Bug 的关键: 停止所有正在运行的 interval
    function stopAllPollers() {
        if (saveInterval) {
            clearInterval(saveInterval);
            saveInterval = null;
        }
        if (displayInterval) {
            clearInterval(displayInterval);
            displayInterval = null;
        }
    }

    // --- 3. 页面逻辑路由 (新) ---
    // 这个主函数现在会在每次页面导航时运行
    function mainRouter() {
        const path = window.location.pathname;
        if (path === currentPath) {
            return; // 路径没变, 不做任何事
        }
        currentPath = path;

        // 关键: 在决定新路由前, 停止所有旧的轮询
        stopAllPollers();

        if (path.startsWith('/search/')) {
            // 场景 A: 聊天页面
            console.log('DeepWiki History: Router -> Chat Page');
            runSaveLogic();
        } else {
            const parts = path.split('/').filter(p => p.length > 0);
            if (parts.length === 2) {
                // 场景 B: 仓库主页
                console.log('DeepWiki History: Router -> Repo Page');
                runDisplayLogic(parts.join('/'));
            } else {
                // 其他页面 (如 /)
                console.log('DeepWiki History: Router -> Other Page, doing nothing.');
            }
        }
    }

    // --- 4. 逻辑实现 ---

    /**
     * 场景 A: 在聊天页面 (/search/...) 自动保存记录
     */
    function runSaveLogic() {
        const sessionId = window.location.pathname.split('/').pop();
        if (!sessionId) return;

        (async () => {
            const history = await getHistory();
            if (history.some(entry => entry.sessionId === sessionId)) {
                return;
            }

            let attempt = 0;
            // 启动轮询, 并保存句柄
            saveInterval = setInterval(async () => {
                attempt++;

                const repoLinkElement = document.querySelector('a.text-neutral-400[href*="/"]');
                let repoName = null;
                if (repoLinkElement) {
                    const href = repoLinkElement.getAttribute('href');
                    if (href && href.startsWith('/') && href.split('/').length === 3) {
                         repoName = href.substring(1);
                    }
                }

                const promptElement = document.querySelector('span.text-xl');
                let firstPromptText = null;
                if (promptElement) {
                    const textNode = Array.from(promptElement.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                    if (textNode) {
                        firstPromptText = textNode.textContent.trim();
                    }
                }

                if (repoName && firstPromptText && sessionId) {
                    clearInterval(saveInterval); // 停止轮询
                    saveInterval = null; // 清理句柄
                    await addHistoryEntry({
                        repo: repoName,
                        prompt: firstPromptText,
                        sessionId: sessionId,
                        fullUrl: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                } else if (attempt > 20) {
                    clearInterval(saveInterval); // 超时停止
                    saveInterval = null;
                    console.log('DeepWiki History: Polling timed out. Could not find all elements.');
                }
            }, 500);
        })();
    }

    /**
     * 场景 B: 在仓库主页 (/owner/repo) 显示历史列表
     */
    function runDisplayLogic(currentRepo) {
        let attempt = 0;
        // 启动轮询, 并保存句柄
        displayInterval = setInterval(async () => {
            attempt++;

            const wikiList = document.querySelector('ul.overflow-y-auto');

            if (wikiList && !document.getElementById('tampermonkey-history-container')) {
                clearInterval(displayInterval); // 停止轮询
                displayInterval = null; // 清理句柄

                const sidebarContainer = wikiList.parentNode;
                if (!sidebarContainer) {
                    console.log('DeepWiki History: Found list but no parent container.');
                    return;
                }

                const history = await getHistory();
                const repoHistory = history
                    .filter(entry => entry.repo === currentRepo)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                if (repoHistory.length > 0) {
                    const container = document.createElement('div');
                    container.id = 'tampermonkey-history-container';
                    container.innerHTML = `
                        <hr style="border-top: 1px solid #eee; margin: 12px 0;">
                        <h3 style="padding: 0 8px; margin-top: 16px; margin-bottom: 8px; font-weight: 600; font-size: 14px; color: #888;">本地对话记录</h3>
                    `;

                    const list = document.createElement('ul');
                    list.style.listStyle = 'none';
                    list.style.padding = '0';
                    list.style.margin = '0';

                    repoHistory.forEach(entry => {
                        const li = document.createElement('li');
                        li.style.display = 'flex';
                        li.style.justifyContent = 'space-between';
                        li.style.alignItems = 'center';
                        li.style.padding = '0 8px';
                        li.style.marginBottom = '4px';
                        li.style.fontSize = '14px';

                        const link = document.createElement('a');
                        link.href = entry.fullUrl;
                        link.textContent = entry.prompt;
                        link.title = `保存于: ${new Date(entry.timestamp).toLocaleString()}\n点击跳转: ${entry.fullUrl}`;
                        link.className = 'hover:bg-hover block w-full rounded px-2 py-1.5 text-left text-sm transition-none text-secondary';
                        link.style.flex = '1';
                        link.style.overflow = 'hidden';
                        link.style.textOverflow = 'ellipsis';
                        link.style.whiteSpace = 'nowrap';
                        link.style.textDecoration = 'none';

                        const deleteBtn = document.createElement('button');
                        deleteBtn.textContent = '✕';
                        deleteBtn.title = '移除此条记录';
                        deleteBtn.style.marginLeft = '10px';
                        deleteBtn.style.cursor = 'pointer';
                        deleteBtn.style.border = 'none';
                        deleteBtn.style.background = 'transparent';
                        deleteBtn.style.color = '#999';
                        deleteBtn.style.fontSize = '16px';
                        deleteBtn.style.padding = '0 5px';
                        deleteBtn.addEventListener('mouseover', () => deleteBtn.style.color = '#333');
                        deleteBtn.addEventListener('mouseout', () => deleteBtn.style.color = '#999');

                        deleteBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm(`是否移除 "${entry.prompt}" 这条记录？\n(这只会从您的本地存储中删除)`)) {
                                await removeHistoryEntry(entry.sessionId);
                                li.remove();
                                if (list.children.length === 0) {
                                    container.remove();
                                }
                            }
                        });

                        li.appendChild(link);
                        li.appendChild(deleteBtn);
                        list.appendChild(li);
                    });

                    container.appendChild(list);
                    sidebarContainer.appendChild(container);
                }
            } else if (attempt > 20) {
                clearInterval(displayInterval); // 超时停止
                displayInterval = null;
                console.log('DeepWiki History: Polling timed out. Could not find sidebar (ul.overflow-y-auto).');
            }
        }, 500);
    }

    // --- 5. 启动器 (新) ---
    // 使用 MutationObserver 监视 URL 变化 (SPA 兼容)
    // 我们监视 <title> 元素的变化, 这是一个非常可靠的 SPA 导航信号
    const observer = new MutationObserver((mutations) => {
        mainRouter(); // 每次 <title> 变化时, 重新运行路由
    });

    // 等待 <title> 元素出现, 然后开始监视
    let titlePoll = setInterval(() => {
        const titleElement = document.querySelector('head > title');
        if (titleElement) {
            clearInterval(titlePoll);
            observer.observe(titleElement, { childList: true });
            // 立即运行一次路由, 以处理当前页面
            mainRouter();
        }
    }, 100);

})();