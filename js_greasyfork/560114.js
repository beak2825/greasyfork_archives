// ==UserScript==
// @name         ZedTools Cooldown Sync
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  多端设备同步ZedTools本地时间
// @author       Owen
// @license      MIT
// @match        https://www.zed.city/*
// @icon         https://www.zed.city/icons/favicon.svg
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      101.35.15.85
// @downloadURL https://update.greasyfork.org/scripts/560114/ZedTools%20Cooldown%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/560114/ZedTools%20Cooldown%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        serverUrl: GM_getValue('serverUrl', 'http://101.35.15.85/admin-api'),
        dataKeys: [
            'script_exploration_fuelTrade_cooldown_at_ms',
            'script_exploration_map5_cooldown_at_ms',
            'script_exploration_map6_cooldown_at_ms',
            'script_forgeTimestamp',
            'script_raidTimestamp',
            'script_junkStoreResetTimestamp',
            'script_radioTowerTradeTimestamp',
            'script_exploration_fuelTrade_openDoor_cooldown_at_ms',
            'script_exploration_map5_openDoor_cooldown_at_ms',
            'script_exploration_map6_openDoor_cooldown_at_ms',
            // 可以添加更多需要同步的键
        ]
    };

    // 注册配置菜单
    // GM_registerMenuCommand('设置服务器地址', setServerUrl);

    // XMLHttpRequest hook 获取用户唯一标识
    const open_prototype = XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function (event) {
        if (this.readyState === 4) {
            if (this.responseURL.includes("api.zed.city/getStats")) {
                const response = JSON.parse(this.response);
                // Player name
                localStorage.setItem("script_playerName", response.username);
            }
        }});
        return open_prototype.apply(this, arguments);
    };

    // 获取用户唯一标识
    function getUserId() {
        return localStorage.getItem('script_playerName');
    }

    // 获取本地数据
    function getLocalData() {
        const userId = getUserId();
        if (!userId) return null;

        const data = {
            userId: userId,
            timestamp: Date.now(),
            data: {}
        };

        // 收集需要同步的数据
        CONFIG.dataKeys.forEach(key => {
            const value = localStorage.getItem(key);
            if (value !== null) {
                data.data[key] = value;
            }
        });

        return data;
    }

    // 上传数据到服务器
    function uploadData() {
        const localData = getLocalData();
        if (!localData) return;

        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.serverUrl + '/business/data-sync/sync',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(localData),
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const serverData = JSON.parse(response.responseText);
                        updateLocalData(serverData);
                    } catch (e) {
                        console.error('解析服务器响应失败:', e);
                    }
                } else {
                    console.error('上传数据失败:', response.statusText);
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
            }
        });
    }

    // 更新本地数据
    function updateLocalData(serverData) {
        if (!serverData || !serverData.data) return;

        const localData = getLocalData();
        const updates = {};

        // 对比并更新数据
        CONFIG.dataKeys.forEach(key => {
            //console.log(key,serverData.data.data[key])
            if (serverData.data.data[key]) {
                const localValue = localData ? localData.data[key] : null;
                const serverValue = serverData.data.data[key];
                //console.log(localValue,serverValue)

                // 如果本地没有该数据，或者服务器数据更新，则更新本地
                if (!localValue || parseInt(serverValue) > parseInt(localValue)) {
                    updates[key] = serverValue;
                }
            }
        });

        // 应用更新
        if (Object.keys(updates).length > 0) {
            Object.entries(updates).forEach(([key, value]) => {
                localStorage.setItem(key, value);
                //console.log(`更新本地数据: ${key} = ${value}`);
            });
        }
    }

    // 设置服务器地址
    function setServerUrl() {
        const url = prompt('请输入服务器地址:', CONFIG.serverUrl);
        if (url) {
            GM_setValue('serverUrl', url);
            CONFIG.serverUrl = url;
            console.log('服务器地址已更新:', url);
        }
    }



    // 初始化 - 页面加载时执行一次同步
    function init() {
        console.log('ZedTools CD同步脚本已启动');
        uploadData();
    }
    setInterval(uploadData, 1000*60);

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();