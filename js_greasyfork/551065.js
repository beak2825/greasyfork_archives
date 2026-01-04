// ==UserScript==
// @name         Linux.do 富可敌国评分展示
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @license      GNU GPLv3
// @description  每日自动缓存商户数据，并在用户卡片弹出时，为富可敌国显示其评分信息，并适配网站暗色模式。优先通过头像URL获取用户名，失败时再通过API获取。
// @author       haorwen
// @match        *://linux.do/*
// @connect      rate.linux.do
// @connect      linux.do
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/551065/Linuxdo%20%E5%AF%8C%E5%8F%AF%E6%95%8C%E5%9B%BD%E8%AF%84%E5%88%86%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551065/Linuxdo%20%E5%AF%8C%E5%8F%AF%E6%95%8C%E5%9B%BD%E8%AF%84%E5%88%86%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量与工具函数 ---
    const LAST_FETCH_DATE_KEY = 'ld_merchant_last_fetch_date';
    const MERCHANT_DATA_KEY = 'ld_merchant_ratings_data';
    let premiumTopicAuthor = null;

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function isDarkModeDetected() {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const cookieForceDark = getCookie('forced_color_mode') === 'dark';
        return systemPrefersDark || cookieForceDark;
    }

    // --- Part 1: 数据获取与缓存 ---
    function getTodayDateString() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * [方法一：快速] 尝试从头像URL中提取用户名
     * e.g., /user_avatar/linux.do/username/45/1_2.png -> username
     * @param {string} avatarUrl
     * @returns {string|null}
     */
    function extractUsernameFromAvatar(avatarUrl) {
        if (!avatarUrl || typeof avatarUrl !== 'string') return null;
        try {
            // 匹配 /user_avatar/域名/用户名/ 的格式
            const match = avatarUrl.match(/\/user_avatar\/[^/]+\/([^/]+)/);
            return match ? match[1] : null;
        } catch (error) {
            console.error('从头像URL提取用户名失败:', avatarUrl, error);
            return null;
        }
    }

    /**
     * [方法二：后备] 从linux.do帖子URL中提取主题ID
     * @param {string} url - 帖子的URL
     * @returns {string|null} - 帖子ID或null
     */
    function extractTopicIdFromUrl(url) {
        if (!url) return null;
        const match = url.match(/\/t\/(?:[^\/]+\/)?(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * [核心修改] 获取并存储商户数据，采用混合模式获取用户名
     */
    function fetchAndStoreMerchantData() {
        GM_log('开始获取商户评价数据...');
        const apiUrl = 'https://rate.linux.do/api/merchant?page=1&size=100&order_by=average_rating&order_direction=desc';

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: { "Accept": "application/json, text/plain, */*" },
            onload: function(response) {
                if (response.status !== 200) {
                    GM_log(`获取商户列表失败，HTTP状态码: ${response.status}`);
                    return;
                }

                try {
                    const result = JSON.parse(response.responseText);
                    if (!result.success || !Array.isArray(result.data?.data)) {
                        GM_log('商户列表API响应格式不正确:', result.message);
                        return;
                    }

                    const merchants = result.data.data;
                    const merchantDataToStore = {};
                    GM_log(`获取到 ${merchants.length} 条商户原始数据，开始混合模式处理...`);

                    const promises = merchants.map(merchant => {
                        // ** 步骤1: 尝试快速方法 **
                        const usernameFromAvatar = extractUsernameFromAvatar(merchant.avatar_url);

                        if (usernameFromAvatar) {
                            // ** 快速通道：成功从头像URL提取 **
                            GM_log(`[快速通道] 商户'${merchant.name}' -> 用户名'${usernameFromAvatar}' (来自头像)`);
                            merchantDataToStore[usernameFromAvatar.toLowerCase()] = {
                                id: merchant.id, name: merchant.name, like_count: merchant.like_count,
                                dislike_count: merchant.dislike_count, average_rating: merchant.average_rating, rating_count: merchant.rating_count,
                            };
                            return Promise.resolve(); // 返回一个已解决的Promise
                        }

                        // ** 步骤2: 降级到后备方法 **
                        GM_log(`[后备通道] 商户'${merchant.name}' 头像URL无法提取，尝试API获取...`);
                        return new Promise((resolve) => {
                            const topicId = extractTopicIdFromUrl(merchant.linux_do_url);
                            if (!topicId) {
                                GM_log(`[跳过] 商户'${merchant.name}'的URL格式不正确: ${merchant.linux_do_url}`);
                                resolve();
                                return;
                            }

                            const topicJsonUrl = `https://linux.do/t/${topicId}.json`;
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: topicJsonUrl,
                                onload: function(topicResponse) {
                                    if (topicResponse.status === 200) {
                                        try {
                                            const topicData = JSON.parse(topicResponse.responseText);
                                            const username = topicData?.post_stream?.posts[0]?.username;
                                            if (username) {
                                                GM_log(`[成功] 商户'${merchant.name}' -> 用户名'${username}' (来自API)`);
                                                merchantDataToStore[username.toLowerCase()] = {
                                                    id: merchant.id, name: merchant.name, like_count: merchant.like_count,
                                                    dislike_count: merchant.dislike_count, average_rating: merchant.average_rating, rating_count: merchant.rating_count,
                                                };
                                            } else {
                                                GM_log(`[API失败] 无法从 ${topicJsonUrl} 中解析出用户名。`);
                                            }
                                        } catch (e) {
                                            GM_log(`[API失败] 解析 ${topicJsonUrl} 的JSON时出错:`, e);
                                        }
                                    } else {
                                        GM_log(`[API失败] 请求 ${topicJsonUrl} 失败，状态码: ${topicResponse.status}`);
                                    }
                                    resolve();
                                },
                                onerror: function(error) {
                                    GM_log(`[API失败] 网络请求 ${topicJsonUrl} 失败:`, error);
                                    resolve();
                                }
                            });
                        });
                    });

                    // 等待所有处理（包括快速通道和后备通道）完成后，再统一存储
                    Promise.all(promises).then(() => {
                        localStorage.setItem(MERCHANT_DATA_KEY, JSON.stringify(merchantDataToStore));
                        localStorage.setItem(LAST_FETCH_DATE_KEY, getTodayDateString());
                        GM_log(`--------- 数据更新完成 ---------`);
                        GM_log(`成功缓存了 ${Object.keys(merchantDataToStore).length} 条商户数据。`);
                        GM_log(`---------------------------------`);
                    });

                } catch (error) {
                    GM_log('解析商户列表API响应时出错:', error);
                }
            },
            onerror: function(error) {
                GM_log('网络请求失败:', error);
            }
        });
    }

    function dailyCheckAndFetch() {
        if (localStorage.getItem(LAST_FETCH_DATE_KEY) !== getTodayDateString()) {
            GM_log(`日期已更新或首次加载，准备更新商户数据。`);
            fetchAndStoreMerchantData();
        } else {
            GM_log(`今日已缓存商户数据。`);
        }
    }


    // --- Part 2: 页面监控与信息注入 --- (无变化)
    function checkForPremiumTag() {
        const premiumTag = document.querySelector('a[data-tag-name="高级推广"]');
        if (premiumTag) {
            const authorElement = document.querySelector('.topic-post.regular:first-of-type a[data-user-card]');
            if (authorElement) {
                const authorUsername = authorElement.getAttribute('data-user-card');
                if (authorUsername) {
                    const lowerCaseAuthor = authorUsername.toLowerCase();
                    if (premiumTopicAuthor !== lowerCaseAuthor) {
                        premiumTopicAuthor = lowerCaseAuthor;
                        GM_log(`[高级推广] 已记录作者 (小写): ${premiumTopicAuthor}`);
                    }
                }
                return;
            }
        }
        if (premiumTopicAuthor && !premiumTag) { premiumTopicAuthor = null; }
    }

    function handleUserCard(cardElement) {
        if (!cardElement) return;

        const oldInfo = cardElement.querySelector('.merchant-rating-info');
        if (oldInfo) oldInfo.remove();

        const usernameElement = cardElement.querySelector('.names__secondary.username');
        if (!usernameElement) return;
        const username = usernameElement.textContent.trim().toLowerCase();

        const isMerchant = cardElement.classList.contains('group-g-merchant');
        const isRichTitle = Array.from(cardElement.querySelectorAll('.names__secondary')).some(el => el.textContent.trim() === '富可敌国');
        const isPremiumAuthor = !!(username && premiumTopicAuthor && username === premiumTopicAuthor);

        if (!isMerchant && !isRichTitle && !isPremiumAuthor) return;

        GM_log(`检测到目标用户 [${username}] 的卡片。`);

        const allMerchantData = JSON.parse(localStorage.getItem(MERCHANT_DATA_KEY) || '{}');
        const merchantInfo = allMerchantData[username];

        if (!merchantInfo) {
            GM_log(`本地缓存中未找到 [${username}] 的评分数据。`);
            return;
        }

        const isDark = isDarkModeDetected();
        GM_log(`暗色模式检测: ${isDark}`);

        const bgColor = isDark ? '#3a3a3a' : '#f9f9f9';
        const borderColor = isDark ? '#555555' : '#e9e9e9';
        const textColor = isDark ? '#e0e0e0' : '#222';
        const linkStyle = `color: ${textColor}; text-decoration: none; display:contents;`;

        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'card-row merchant-rating-info';
        ratingDiv.style.cssText = `
            padding: 8px 12px; margin: 10px 18px 0; border: 1px solid ${borderColor}; border-radius: 5px;
            background-color: ${bgColor}; font-size: 0.9em; display: flex; justify-content: space-around;
            flex-wrap: wrap; gap: 10px; text-align: center;
        `;
        ratingDiv.innerHTML = `
            <a href="https://rate.linux.do/merchant/${merchantInfo.id}" target="_blank" title="点击查看详情" style="${linkStyle}">
                <span>⭐ <strong>${merchantInfo.average_rating.toFixed(1)}</strong> (${merchantInfo.rating_count}人)</span>
                <span>👍 <strong>${merchantInfo.like_count}</strong></span>
                <span>👎 <strong>${merchantInfo.dislike_count}</strong></span>
            </a>
        `;

        const targetRow = cardElement.querySelector('.card-row.metadata-row');
        if (targetRow) {
            targetRow.insertAdjacentElement('beforebegin', ratingDiv);
            GM_log(`已为 [${username}] 成功注入评分信息。`);
        }
    }

    // --- Part 3: 主逻辑与启动 --- (无变化)
    function main() {
        dailyCheckAndFetch();
        const waitForElement = (selector, callback) => {
            const el = document.querySelector(selector);
            if (el) { callback(el); return; }
            const obs = new MutationObserver((mutations, observer) => {
                const targetEl = document.querySelector(selector);
                if (targetEl) { observer.disconnect(); callback(targetEl); }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        };
        waitForElement('#d-menu-portals', (portalElement) => {
            GM_log("商户信息增强脚本已启动 (v1.2.0 by haorwen)");
            checkForPremiumTag();
            const observer = new MutationObserver((mutationsList) => {
                checkForPremiumTag();
                for (const mutation of mutationsList) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target.closest('#user-card');
                        if (target && target.classList.contains('show')) {
                           queueMicrotask(() => handleUserCard(target));
                        }
                    } else if (mutation.type === 'childList') {
                         for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && node.querySelector) {
                                const card = node.querySelector('#user-card.show');
                                if (card) { queueMicrotask(() => handleUserCard(card)); }
                            }
                        }
                    }
                }
            });
            observer.observe(portalElement, {
                childList: true, subtree: true, attributes: true, attributeFilter: ['class']
            });
        });
    }
    main();
})();
