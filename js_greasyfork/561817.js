// ==UserScript==
// @name         b站：查看关注时间
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  bilibili查看关注时间
// @author       你看清楚了吗
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561817/b%E7%AB%99%EF%BC%9A%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/561817/b%E7%AB%99%EF%BC%9A%E6%9F%A5%E7%9C%8B%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取当前用户ID
    const uidMatch = window.location.pathname.match(/\/(\d+)/);
    if (!uidMatch) {
        console.error('无法提取UID');
        return;
    }
    const uid = uidMatch[1];

    // 获取单页数据（用于获取total）
    function fetchTotalCount() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=1&ps=1`,
                headers: { 'User-Agent': 'Mozilla/5.0' },
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.total !== undefined) {
                            resolve(data.data.total); // 返回总关注数
                        } else if (data.code === 22115) {
                            console.log(data.message);//用户已设置隐私
                            resolve(0);
                        } else {
                            reject(`获取总数失败: ${data.message || '数据格式异常'}`);
                        }
                    } catch (e) {
                        reject(`解析总数失败: ${e.message}`);
                    }
                },
                onerror: function () { reject('网络错误（获取总数）'); }
            });
        });
    }

    // 获取指定页数的关注数据
    function fetchFollowings(page) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${page}&ps=50`,
                headers: { 'User-Agent': 'Mozilla/5.0' },
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            resolve(data.data.list || []);
                        } else {
                            reject(`第${page}页请求失败: ${data.message}`);
                        }
                    } catch (e) {
                        reject(`第${page}页解析失败: ${e.message}`);
                    }
                },
                onerror: function () { reject(`第${page}页网络错误`); }
            });
        });
    }

    // 检查指定页数是否有数据
    async function checkPageHasData(page) {
        try {
            const data = await fetchFollowings(page);
            // 如果返回的列表为空，说明该页无数据
            return data.length > 0;
        } catch (error) {
            console.warn(`检查第${page}页数据时出错:`, error);
            return false;
        }
    }

    // 插入关注时间到卡片
    function insertFollowTime(item, followData) {
        if (item.querySelector('.follow-time')) return; // 防止重复插入
        const followTime = new Date(followData.mtime * 1000).toLocaleString();
        const timeSpan = document.createElement('span');
        timeSpan.className = 'follow-time';
        timeSpan.style.cssText = 'color: #999; font-size: 12px; margin-top: 5px; display: block;';
        timeSpan.textContent = `关注时间: ${followTime}`;
        item.appendChild(timeSpan);
    }

    // 处理卡片
    function processCards(allFollowings) {
        const userItems = document.querySelectorAll('.relation-card-info a');
        userItems.forEach(item => {
            const href = item.getAttribute('href');
            const midMatch = href.match(/space\.bilibili\.com\/(\d+)/);
            if (midMatch) {
                const mid = midMatch[1];
                const followData = allFollowings.find(f => f.mid == mid);
                if (followData) insertFollowTime(item.parentElement, followData);
            }
        });
    }

    // 主函数
    async function main() {
        try {
            // 第一步：获取总关注数
            const total = await fetchTotalCount();
            console.log(`共获取到 ${total} 个关注用户`);

            // 修复：使用更严谨的判断，覆盖 0/undefined/null 等情况
            if (!total || total === 0) {
                console.log("total 为 0 或空，终止执行");
                return; // 终止 main 函数
            }

            // 计算总页数（每页50条，向上取整）
            const pageSize = 50;
            let totalPages = Math.ceil(total / pageSize);
            console.log(`初始计算需要获取 ${totalPages} 页数据`);

            // 新增逻辑：检查第3页是否有数据
            if (totalPages >= 3) {
                const page3HasData = await checkPageHasData(3);
                if (!page3HasData) {
                    totalPages = 2;
                    console.log('第3页无数据，总页数已调整为2');
                }
            }

            // 第二步：批量异步获取所有页数的数据
            let allFollowings = [];
            // 生成所有页数的请求Promise
            const pagePromises = [];
            for (let page = 1; page <= totalPages; page++) {
                pagePromises.push(fetchFollowings(page));
            }
            // 等待所有请求完成
            const pageResults = await Promise.allSettled(pagePromises);

            // 处理每个请求的结果
            pageResults.forEach((result, index) => {
                const page = index + 1;
                if (result.status === 'fulfilled') {
                    allFollowings = allFollowings.concat(result.value);
                } else {
                    console.error(`第${page}页数据获取失败:`, result.reason);
                }
            });

            console.log(`最终获取到 ${allFollowings.length} 个用户的关注数据`);

            // 初始处理页面卡片
            processCards(allFollowings);

            // 设置MutationObserver监听动态加载
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) processCards(allFollowings);
                });
            });

            const container = document.querySelector('.relation-list') || document.querySelector('#app');
            if (container) {
                observer.observe(container, { childList: true, subtree: true });
            } else {
                console.error('未找到可观察的容器');
            }
        } catch (e) {
            console.error('主流程出错:', e);
        }
    }

    main();
})();