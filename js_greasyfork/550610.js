// ==UserScript==
// @name         B站粉丝与关注变化检测器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  定期存储B站指定用户的粉丝列表和关注列表，并比对得出新增和取关/取关的用户名单。
// @author       JOE
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550610/B%E7%AB%99%E7%B2%89%E4%B8%9D%E4%B8%8E%E5%85%B3%E6%B3%A8%E5%8F%98%E5%8C%96%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550610/B%E7%AB%99%E7%B2%89%E4%B8%9D%E4%B8%8E%E5%85%B3%E6%B3%A8%E5%8F%98%E5%8C%96%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PAGE_SIZE = 50; // B站API每页通常最多50个
    let currentMid = ''; // 当前查看的UP主的UID

    // --- UI & 辅助函数 ---
    GM_addStyle(`
        #tracker-controls {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tracker-btn {
            padding: 10px 15px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            text-align: center;
        }
        .tracker-btn:hover {
            background-color: #00b5e5;
        }
        #tracker-btn-following {
            background-color: #fb7299;
        }
        #tracker-btn-following:hover {
            background-color: #fc8bab;
        }
        #tracker-panel {
            position: fixed;
            top: 150px;
            right: 20px;
            width: 350px;
            max-height: 70vh;
            overflow-y: auto;
            background-color: #f4f4f4;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 15px;
            z-index: 9998;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-size: 14px;
        }
        #tracker-panel h3 { margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        #tracker-panel .user-list { list-style: none; padding-left: 0; }
        #tracker-panel .user-list li { padding: 5px 0; border-bottom: 1px dashed #eee; display: flex; align-items: center; }
        #tracker-panel .user-list li:last-child { border-bottom: none; }
        #tracker-panel .user-list a { text-decoration: none; color: #00a1d6; }
        #tracker-panel .user-list a:hover { text-decoration: underline; }
        #tracker-panel .user-list img { width:24px; height:24px; border-radius:50%; margin-right:8px; }
        #tracker-panel .loading-text,
        #tracker-panel .status-text { font-style: italic; color: #555; margin-bottom: 10px; }
        #tracker-panel .close-btn { float: right; cursor: pointer; font-weight: bold; color: #777; }
    `);

    function getMidFromUrl() {
        const match = window.location.pathname.match(/^\/(\d+)/);
        return match ? match[1] : null;
    }

    async function fetchApi(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Referer': 'https://space.bilibili.com/'
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                resolve(data.data);
                            } else {
                                reject(new Error(`B站API错误: ${data.message || data.code}`));
                            }
                        } catch (e) {
                            reject(new Error(`解析JSON失败: ${e.message}`));
                        }
                    } else {
                        reject(new Error(`HTTP请求失败: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`GM_xmlhttpRequest错误: ${error.statusText || 'Network error'}`));
                }
            });
        });
    }

    async function getAllUsers(vmid, panel, type) {
        const apiPath = type === 'fans' ? 'followers' : 'followings';
        const entityName = type === 'fans' ? '粉丝' : '关注';

        let allUsers = [];
        let pageNum = 1;
        let totalUsers = -1;
        let fetchedCount = 0;

        const loadingText = panel.querySelector('.loading-text');
        loadingText.textContent = `正在获取${entityName}列表 (第 1 页)...`;

        try {
            const firstPageUrl = `https://api.bilibili.com/x/relation/${apiPath}?vmid=${vmid}&pn=${pageNum}&ps=${PAGE_SIZE}&order=desc&jsonp=jsonp`;
            const firstPageData = await fetchApi(firstPageUrl);

            if (!firstPageData || !firstPageData.list) {
                throw new Error(`未能获取到${entityName}列表数据结构。`);
            }

            totalUsers = firstPageData.total;
            if (totalUsers === 0) {
                loadingText.textContent = `该用户没有${entityName}。`;
                return [];
            }
            allUsers = allUsers.concat(firstPageData.list);
            fetchedCount += firstPageData.list.length;
            loadingText.textContent = `正在获取${entityName}列表 (已获取 ${fetchedCount} / ${totalUsers})...`;

            const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

            for (pageNum = 2; pageNum <= totalPages; pageNum++) {
                const url = `https://api.bilibili.com/x/relation/${apiPath}?vmid=${vmid}&pn=${pageNum}&ps=${PAGE_SIZE}&order=desc&jsonp=jsonp`;
                const pageData = await fetchApi(url);
                if (pageData && pageData.list) {
                    allUsers = allUsers.concat(pageData.list);
                    fetchedCount += pageData.list.length;
                    loadingText.textContent = `正在获取${entityName}列表 (已获取 ${fetchedCount} / ${totalUsers})...`;
                } else {
                    console.warn(`第 ${pageNum} 页数据获取不完整或失败，已获取 ${allUsers.length} 条`);
                    break;
                }
                if (pageNum % 5 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            loadingText.textContent = `${entityName}列表获取完毕，共 ${allUsers.length} 人。`;
            return allUsers.map(f => ({ mid: f.mid, uname: f.uname, face: f.face, sign: f.sign }));
        } catch (error) {
            loadingText.textContent = `获取${entityName}列表失败: ${error.message}`;
            console.error(`获取${entityName}列表失败:`, error);
            return null;
        }
    }

    function compareUserLists(oldList = [], newList = []) {
        const oldUsers = new Map(oldList.map(user => [user.mid, user]));
        const newUsers = new Map(newList.map(user => [user.mid, user]));
        const added = [], removed = [];

        for (const [mid, user] of newUsers) {
            if (!oldUsers.has(mid)) added.push(user);
        }
        for (const [mid, user] of oldUsers) {
            if (!newUsers.has(mid)) removed.push(user);
        }
        return { added, removed };
    }

    function displayResults(panel, changes, mid, type) {
        const { added, removed } = changes;
        const typeNames = type === 'fans' ? {
            title: '粉丝变化',
            added: '新增粉丝',
            removed: '取关粉丝'
        } : {
            title: '关注变化',
            added: '新增关注',
            removed: '取消关注'
        };

        let html = `<span class="close-btn" title="关闭面板">X</span><h3>${typeNames.title} (UP主ID: ${mid})</h3>`;
        html += `<div class="status-text">上次检测时间: ${new Date(GM_getValue(`bili_last_check_time_${type}_${mid}`, Date.now())).toLocaleString()}</div>`;

        if (added.length === 0 && removed.length === 0) {
            html += '<p>与上次相比，列表没有变化。</p>';
        } else {
            if (added.length > 0) {
                html += `<h4>${typeNames.added} (${added.length}):</h4><ul class="user-list">`;
                added.forEach(user => {
                    html += `<li><img src="${user.face.replace('http:','https:')}@48w_48h.webp"> <a href="//space.bilibili.com/${user.mid}" target="_blank">${user.uname}</a></li>`;
                });
                html += '</ul>';
            }
            if (removed.length > 0) {
                html += `<h4>${typeNames.removed} (${removed.length}):</h4><ul class="user-list">`;
                removed.forEach(user => {
                    html += `<li><img src="${user.face.replace('http:','https:')}@48w_48h.webp"> <a href="//space.bilibili.com/${user.mid}" target="_blank">${user.uname}</a></li>`;
                });
                html += '</ul>';
            }
        }
        panel.innerHTML = html;
        panel.style.display = 'block';
        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    async function runCheck(type) {
        currentMid = getMidFromUrl();
        if (!currentMid) {
            alert("无法从当前URL获取UP主MID。请确保在正确的用户空间页面。");
            return;
        }

        let panel = document.getElementById('tracker-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'tracker-panel';
            document.body.appendChild(panel);
        }
        panel.style.display = 'block';
        panel.innerHTML = `<span class="close-btn" title="关闭面板">X</span><h3>${type === 'fans' ? '粉丝' : '关注'}变化检测 (UP主MID: ${currentMid})</h3><div class="loading-text">准备开始...</div>`;
        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        const storageKey = `bili_${type}_list_${currentMid}`;
        const lastCheckTimeKey = `bili_last_check_time_${type}_${currentMid}`;

        const statusText = panel.querySelector('.loading-text');
        statusText.textContent = `正在获取当前${type === 'fans' ? '粉丝' : '关注'}列表...`;
        const currentUserList = await getAllUsers(currentMid, panel, type);

        if (currentUserList === null) {
            statusText.textContent = `获取当前${type === 'fans' ? '粉丝' : '关注'}列表失败，请查看控制台错误信息。`;
            return;
        }

        statusText.textContent = `正在读取上次存储的${type === 'fans' ? '粉丝' : '关注'}列表...`;
        const previousUserListRaw = await GM_getValue(storageKey);
        const previousUserList = previousUserListRaw ? JSON.parse(previousUserListRaw) : [];

        if (previousUserList.length === 0 && currentUserList.length > 0 && !GM_getValue(lastCheckTimeKey)) {
            statusText.textContent = "首次运行，已存储当前列表供下次比对。";
            await GM_setValue(storageKey, JSON.stringify(currentUserList));
            await GM_setValue(lastCheckTimeKey, Date.now());
            panel.innerHTML += `<p>首次为MID ${currentMid} 运行，已存储 ${currentUserList.length} 位${type === 'fans' ? '粉丝' : '关注'}数据。</p>`;
            return;
        }

        statusText.textContent = "正在比对列表...";
        const changes = compareUserLists(previousUserList, currentUserList);
        displayResults(panel, changes, currentMid, type);

        // 更新存储
        await GM_setValue(storageKey, JSON.stringify(currentUserList));
        await GM_setValue(lastCheckTimeKey, Date.now());
        console.log(`${type === 'fans' ? '粉丝' : '关注'}列表比对完成，新列表已存储。`);
    }

    // --- 初始化 ---
    function init() {
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'tracker-controls';

        const btnFans = document.createElement('button');
        btnFans.id = 'tracker-btn-fans';
        btnFans.className = 'tracker-btn';
        btnFans.textContent = '检测粉丝变化';
        btnFans.addEventListener('click', () => runCheck('fans'));

        const btnFollowing = document.createElement('button');
        btnFollowing.id = 'tracker-btn-following';
        btnFollowing.className = 'tracker-btn';
        btnFollowing.textContent = '检测关注变化';
        btnFollowing.addEventListener('click', () => runCheck('following'));

        controlsContainer.appendChild(btnFans);
        controlsContainer.appendChild(btnFollowing);
        document.body.appendChild(controlsContainer);

        console.log("B站粉丝与关注变化检测器已加载。");

        const handleUrlChange = () => {
            const newMid = getMidFromUrl();
            if (newMid !== currentMid) {
                currentMid = newMid;
                if (currentMid) {
                    console.log(`已切换到UP主MID: ${currentMid}`);
                    let panel = document.getElementById('tracker-panel');
                    if (panel) panel.style.display = 'none';
                }
            }
        };

        // 初始检测
        handleUrlChange();
        // 监听B站的SPA路由变化
        new MutationObserver(handleUrlChange).observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();