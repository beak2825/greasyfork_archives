// ==UserScript==
// @name         Linux.do 用户快问快答解答率展示
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  在用户卡片弹出时，显示该用户最近在“快问快答”标签下的提问解答率。包含重试机制。
// @author       haorwen
// @license      GPLv3
// @match        *://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557387/Linuxdo%20%E7%94%A8%E6%88%B7%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94%E8%A7%A3%E7%AD%94%E7%8E%87%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557387/Linuxdo%20%E7%94%A8%E6%88%B7%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94%E8%A7%A3%E7%AD%94%E7%8E%87%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 工具函数 ---

    function isDarkModeDetected() {
        if (document.documentElement.classList.contains('theme-dark')) return true;
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPrefersDark;
    }

    /**
     * 强力提取用户名
     * 策略：1. 找链接 href -> 2. 找卡片 class -> 3. 找 data 属性
     */
    function getRealUsername(cardElement) {
        // 策略1: 最稳妥 - 找任意指向用户主页的链接
        // 只要 href 是 /u/ 开头，且不是 /u/ 结尾
        const link = cardElement.querySelector('a[href^="/u/"]');
        if (link) {
            const href = link.getAttribute('href'); // 例如 /u/wslzgmzs
            const parts = href.split('/');
            // 过滤掉空的，取最后一个有效段
            const validParts = parts.filter(p => p && p !== 'u');
            if (validParts.length > 0) {
                return decodeURIComponent(validParts[0]);
            }
        }

        // 策略2: 从卡片根容器的 class 中提取
        // HTML 示例: class="user-card ... user-card-WslzGmzs ..."
        for (const cls of cardElement.classList) {
            if (cls.startsWith('user-card-') && cls !== 'user-card-badges' && cls.length > 10) {
                // user-card- 有10个字符，取后面的部分
                return cls.replace('user-card-', '');
            }
        }

        // 策略3: 尝试 data-username 属性 (部分 Discourse 版本有)
        if (cardElement.dataset.username) {
            return cardElement.dataset.username;
        }

        return null;
    }

    /**
     * 获取解答率数据
     */
    function fetchSolutionStats(username) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://linux.do/search.json?q=in%3Afirst%20%40${encodeURIComponent(username)}%20tags%3A%E5%BF%AB%E9%97%AE%E5%BF%AB%E7%AD%94%20order%3Alatest_topic`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: { "Accept": "application/json" },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const result = JSON.parse(response.responseText);
                            let solvedCount = 0;
                            let totalCount = 0;
                            if (result.topics && Array.isArray(result.topics)) {
                                totalCount = result.topics.length;
                                solvedCount = result.topics.filter(t => t.has_accepted_answer === true).length;
                            }
                            resolve({ solved: solvedCount, total: totalCount });
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(`HTTP Status: ${response.status}`);
                    }
                },
                onerror: function(error) { reject(error); }
            });
        });
    }

    // --- 核心逻辑 ---

    /**
     * 处理卡片，支持重试机制
     * @param {HTMLElement} cardElement
     * @param {number} attempt - 当前尝试次数
     */
    function handleUserCard(cardElement, attempt = 1) {
        if (!cardElement) return;

        // 1. 防止重复注入
        if (cardElement.querySelector('.solution-rate-info')) return;

        // 2. 尝试获取用户名
        const username = getRealUsername(cardElement);

        if (!username) {
            // 如果没找到，且尝试次数小于 3 次，则延迟重试
            // 因为 Ember 渲染可能是分步的，卡片出来时链接还没填进去
            if (attempt <= 3) {
                // GM_log(`尝试 ${attempt} 失败，100ms 后重试...`);
                setTimeout(() => handleUserCard(cardElement, attempt + 1), 150);
                return;
            } else {
                GM_log("无法提取用户名，HTML结构可能已变动或尚未渲染完成。");
                return;
            }
        }

        // 3. 样式配置
        const isDark = isDarkModeDetected();
        const cssVar = (name, fallback) => `var(${name}, ${fallback})`;

        const bgColor = cssVar('--primary-very-low', isDark ? '#3a3a3a' : '#f9f9f9');
        const borderColor = cssVar('--primary-low', isDark ? '#555555' : '#e9e9e9');
        const textColor = cssVar('--primary-high', isDark ? '#e0e0e0' : '#222');
        const labelColor = cssVar('--primary-medium', isDark ? '#aaa' : '#666');

        // 4. 创建 UI
        const statsDiv = document.createElement('div');
        statsDiv.className = 'card-row solution-rate-info';
        statsDiv.style.cssText = `
            padding: 8px 12px;
            margin: 5px 15px;
            border: 1px solid ${borderColor};
            border-radius: 5px;
            background-color: ${bgColor};
            font-size: 0.9em;
            text-align: center;
            color: ${textColor};
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            box-sizing: border-box;
        `;
        statsDiv.innerHTML = `<span style="color:${labelColor}">正在计算...</span>`;

        // 5. 插入
        const targetRow = cardElement.querySelector('.card-row.metadata-row');
        if (targetRow) {
            targetRow.insertAdjacentElement('beforebegin', statsDiv);
        } else {
            const cardContent = cardElement.querySelector('.card-content');
            if (cardContent) cardContent.appendChild(statsDiv);
        }

        // 6. 请求数据
        fetchSolutionStats(username).then(stats => {
            if (stats.total === 0) {
                statsDiv.innerHTML = `<span style="color:${labelColor}">最近无“快问快答”提问</span>`;
            } else {
                const percentage = Math.round((stats.solved / stats.total) * 100);
                let numColor = textColor;
                if (percentage >= 80) numColor = '#28a745';
                else if (percentage <= 30) numColor = '#e45735';

                statsDiv.innerHTML = `
                    <span style="color:${labelColor}">近期快问快答解答率:</span>
                    <strong style="color: ${numColor}; font-size: 1.1em; margin: 0 4px;">${stats.solved} / ${stats.total}</strong>
                    <span style="color:${labelColor}; font-size: 0.85em;">(${percentage}%)</span>
                `;
            }
        }).catch(err => {
            console.error(err);
            statsDiv.innerHTML = `<span style="color: #e45735;">获取失败</span>`;
        });
    }

    // --- 启动 ---

    function main() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 检查新增节点本身
                            if (node.id === 'user-card' && node.classList.contains('show')) {
                                handleUserCard(node);
                            }
                            // 检查新增节点内部
                            else if (node.querySelector) {
                                const card = node.querySelector('#user-card.show');
                                if (card) handleUserCard(card);
                            }
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.id === 'user-card' && target.classList.contains('show')) {
                        handleUserCard(target);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    main();
})();