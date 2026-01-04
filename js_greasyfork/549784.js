// ==UserScript==
// @name         TikTok 达人独立状态标记器（Creative Center）
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  【最终版】在达人卡片上通过按钮颜色标记达人状态，按钮状态独立且持久。
// @author       Gemini & You
// @match        https://ads.tiktok.com/creative/creator/explore*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549784/TikTok%20%E8%BE%BE%E4%BA%BA%E7%8B%AC%E7%AB%8B%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0%E5%99%A8%EF%BC%88Creative%20Center%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549784/TikTok%20%E8%BE%BE%E4%BA%BA%E7%8B%AC%E7%AB%8B%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0%E5%99%A8%EF%BC%88Creative%20Center%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'tiktok_creator_tags_ads';

    let tagsData = {};

    // GitHub 配置
    const GITHUB_GIST_FILENAME = 'tiktok_creator_tags.json';
    let githubToken = null;
    let gistId = null;

    // 自动同步配置 - 优化速度
    let autoSyncEnabled = true;
    let autoSyncInterval = 10; // 默认10秒，更快响应
    let lastCloudSync = 0;
    let syncTimer = null;
    let syncInProgress = false;
    let pendingAutoUpload = false;

    // 增量同步相关
    let deviceId = null;
    let localDataVersion = '2.0';
    let syncScheduler = null;

    // 定义按钮的颜色
    const buttonColors = {
        'default': '#f0f2f5',
        '已联系': '#007bff',
        '已拒绝': '#dc3545',
        '已合作': '#28a745',
        '不合适': '#ffc107' // 更新为橙色
    };
    const statuses = ['已联系', '已拒绝', '已合作', '不合适'];

    // 封装GM_xmlhttpRequest为类似fetch的函数
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                timeout: 30000,
                onload: function(response) {
                    const result = {
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.responseHeaders,
                        text: () => Promise.resolve(response.responseText),
                        json: () => {
                            try {
                                return Promise.resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                return Promise.reject(new Error('Failed to parse JSON'));
                            }
                        }
                    };
                    resolve(result);
                },
                onerror: function(error) {
                    reject(new Error('Network request failed: ' + error.error));
                },
                ontimeout: function() {
                    reject(new Error('Request timeout'));
                }
            };
            if (options.body) {
                requestOptions.data = options.body;
            }
            GM_xmlhttpRequest(requestOptions);
        });
    }

    // === 增量同步核心功能 ===

    // 生成设备ID
    function generateDeviceId() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'device_';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 智能调度器
    class SyncScheduler {
        constructor() {
            this.baseInterval = 5000; // 5秒基础间隔
            this.maxInterval = 300000; // 5分钟最大间隔
            this.currentInterval = this.baseInterval;
            this.consecutiveNoChanges = 0;
            this.lastCheckTime = 0;
        }

        adjustInterval(hasChanges) {
            this.lastCheckTime = Date.now();

            if (hasChanges) {
                console.log('TM-SCHEDULER: 检测到变化，重置为快速检查间隔');
                this.currentInterval = this.baseInterval;
                this.consecutiveNoChanges = 0;
            } else {
                this.consecutiveNoChanges++;
                // 指数退避算法
                const newInterval = Math.min(
                    this.baseInterval * Math.pow(1.5, this.consecutiveNoChanges),
                    this.maxInterval
                );

                if (newInterval !== this.currentInterval) {
                    console.log(`TM-SCHEDULER: 无变化 ${this.consecutiveNoChanges} 次，调整间隔 ${this.currentInterval/1000}s → ${newInterval/1000}s`);
                    this.currentInterval = newInterval;
                }
            }

            return this.currentInterval;
        }

        getNextInterval() {
            return this.currentInterval;
        }

        reset() {
            console.log('TM-SCHEDULER: 重置调度器');
            this.currentInterval = this.baseInterval;
            this.consecutiveNoChanges = 0;
        }
    }

    // 数据格式迁移
    function migrateDataFormat(oldData) {
        // 检查是否已经是新格式
        if (oldData && oldData._meta && oldData._meta.version === localDataVersion) {
            console.log('TM-MIGRATION: 数据已是新格式 v' + localDataVersion);
            return oldData;
        }

        console.log('TM-MIGRATION: 检测到旧格式数据，开始迁移...');
        console.log('TM-MIGRATION: 旧数据:', oldData);

        const now = Date.now();
        const newData = {
            _meta: {
                version: localDataVersion,
                last_global_update: now,
                device_id: deviceId,
                migrated_at: now
            },
            users: {}
        };

        // 迁移用户数据
        if (oldData && typeof oldData === 'object') {
            for (const [username, tags] of Object.entries(oldData)) {
                // 跳过元数据字段
                if (username.startsWith('_')) continue;

                newData.users[username] = {
                    tags: Array.isArray(tags) ? tags : [],
                    updated_at: now,
                    device_id: deviceId,
                    migrated: true
                };
            }
        }

        console.log('TM-MIGRATION: 迁移完成，新数据:', newData);
        console.log(`TM-MIGRATION: 迁移了 ${Object.keys(newData.users).length} 个用户的数据`);

        return newData;
    }

    // 获取服务器时间戳（用于时钟同步）
    async function getServerTimestamp() {
        try {
            const response = await gmFetch('https://api.github.com/gists', {
                method: 'HEAD'
            });

            if (response.headers && response.headers.date) {
                const serverTime = new Date(response.headers.date).getTime();
                const localTime = Date.now();
                const offset = serverTime - localTime;

                console.log('TM-SYNC: 时钟同步信息');
                console.log('  服务器时间:', new Date(serverTime).toLocaleString());
                console.log('  本地时间:', new Date(localTime).toLocaleString());
                console.log('  时间偏移:', offset + 'ms');

                return serverTime;
            }
        } catch (error) {
            console.warn('TM-SYNC: 无法获取服务器时间，使用本地时间:', error.message);
        }

        return Date.now();
    }

    // 创建新格式的用户数据
    function createUserData(tags, timestamp = null) {
        return {
            tags: Array.isArray(tags) ? tags : [],
            updated_at: timestamp || Date.now(),
            device_id: deviceId
        };
    }

    // 清理长期未使用的空标签记录（手动调用）
    function cleanupEmptyTagsRecords(daysThreshold = 30) {
        if (!tagsData.users) return 0;

        const cutoffTime = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
        let cleanedCount = 0;

        for (const [username, userData] of Object.entries(tagsData.users)) {
            if ((!userData.tags || userData.tags.length === 0) &&
                userData.updated_at < cutoffTime) {
                delete tagsData.users[username];
                cleanedCount++;
                console.log(`TM-CLEANUP: 清理 ${daysThreshold} 天前的空标签记录: "${username}"`);
            }
        }

        if (cleanedCount > 0) {
            GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
            console.log(`TM-CLEANUP: 共清理了 ${cleanedCount} 个长期未使用的空标签记录`);
        }

        return cleanedCount;
    }

    // 智能合并用户数据
    function mergeUserData(localData, cloudData) {
        console.log('TM-MERGE: 开始智能合并数据');

        const result = {
            _meta: {
                version: localDataVersion,
                last_global_update: Date.now(),
                device_id: deviceId
            },
            users: {}
        };

        // 合并本地数据
        if (localData && localData.users) {
            for (const [username, userData] of Object.entries(localData.users)) {
                result.users[username] = { ...userData };
            }
        }

        // 合并云端数据
        if (cloudData && cloudData.users) {
            for (const [username, cloudUser] of Object.entries(cloudData.users)) {
                const localUser = result.users[username];

                if (!localUser) {
                    // 云端有本地没有
                    result.users[username] = { ...cloudUser };
                    console.log(`TM-MERGE: 新增用户 "${username}" (来自云端)`);
                } else {
                    // 冲突解决：时间戳较新的获胜
                    if (cloudUser.updated_at > localUser.updated_at) {
                        result.users[username] = { ...cloudUser };
                        console.log(`TM-MERGE: 更新用户 "${username}" (云端较新: ${new Date(cloudUser.updated_at).toLocaleString()})`);
                    } else if (cloudUser.updated_at === localUser.updated_at) {
                        // 相同时间戳，使用设备ID排序解决冲突
                        if (cloudUser.device_id && localUser.device_id &&
                            cloudUser.device_id.localeCompare(localUser.device_id) > 0) {
                            result.users[username] = { ...cloudUser };
                            console.log(`TM-MERGE: 更新用户 "${username}" (相同时间戳，设备ID排序)`);
                        }
                    }
                    // else: 本地较新，保持本地数据
                }
            }
        }

        // *** 修复：保留空标签用户记录，确保删除操作能跨设备同步 ***
        // 不再自动清理空标签用户，因为这些记录携带重要的删除操作信息
        let emptyTagsCount = 0;
        for (const [username, userData] of Object.entries(result.users)) {
            if (!userData.tags || userData.tags.length === 0) {
                emptyTagsCount++;
                console.log(`TM-MERGE: 保留空标签用户 "${username}" (同步删除操作需要)`);
            }
        }

        if (emptyTagsCount > 0) {
            console.log(`TM-MERGE: 保留了 ${emptyTagsCount} 个空标签用户记录以确保跨设备同步`);
        }

        result._meta.last_global_update = Math.max(
            localData?._meta?.last_global_update || 0,
            cloudData?._meta?.last_global_update || 0,
            Date.now()
        );

        console.log(`TM-MERGE: 合并完成，最终用户数: ${Object.keys(result.users).length}`);
        return result;
    }

    // 注入自定义 CSS 样式
    GM_addStyle(`
        /* 为卡片添加底部内边距，为按钮腾出空间 */
        section[data-testid*="ExploreCreatorCard"] {
            position: relative !important;
            padding-bottom: 60px !important;
            box-sizing: border-box !important;
        }

        .tm-tag-actions-container {
            position: absolute;
            bottom: 8px;
            left: 8px;
            right: 8px;
            display: flex;
            gap: 6px;
            z-index: 100;
            background: rgba(248, 250, 252, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            padding: 8px;
            box-shadow:
                0 2px 8px rgba(0, 0, 0, 0.06),
                0 1px 2px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.04);
            transition: all 0.2s ease;
        }

        .tm-tag-actions-container:hover {
            background: rgba(255, 255, 255, 0.98);
            box-shadow:
                0 4px 12px rgba(0, 0, 0, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.12);
        }

        .tm-tag-btn {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            color: #495057;
            cursor: pointer;
            font-size: 10px;
            padding: 4px 8px;
            white-space: nowrap;
            text-align: center;
            flex: 1;
            box-sizing: border-box;
            transition: all 0.2s ease;
            font-weight: 500;
            min-height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .tm-tag-btn.active {
            color: white;
            border: none;
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .tm-tag-btn:hover {
            opacity: 0.9;
            transform: translateY(-0.5px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }

        .tm-tag-btn[style*="#ffc107"] {
            color: #212529 !important;
        }

        /* 同步面板样式 */
        #tm-sync-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .tm-sync-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            min-width: 400px;
            max-width: 600px;
        }

        .tm-sync-content h3 {
            margin: 0 0 20px 0;
            color: #333;
            text-align: center;
        }

        .tm-sync-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .tm-sync-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            flex: 1;
        }

        .tm-sync-btn:not(.close) {
            background: #007bff;
            color: white;
        }

        .tm-sync-btn:not(.close):hover {
            background: #0056b3;
        }

        .tm-sync-btn.close {
            background: #6c757d;
            color: white;
        }

        .tm-sync-btn.close:hover {
            background: #545b62;
        }

        .tm-sync-btn.primary {
            background: #28a745;
            color: white;
        }

        .tm-sync-btn.primary:hover {
            background: #218838;
        }

        .tm-sync-btn.secondary {
            background: #6c757d;
            color: white;
        }

        .tm-sync-btn.secondary:hover {
            background: #5a6268;
        }

        .tm-sync-btn.cloud {
            background: #17a2b8;
            color: white;
        }

        .tm-sync-btn.cloud:hover {
            background: #138496;
        }

        .tm-sync-section {
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            background: #f8f9fa;
        }

        .tm-sync-section h4 {
            margin: 0 0 15px 0;
            color: #495057;
            font-size: 16px;
        }

        .tm-github-status {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 6px;
            background: white;
        }

        .tm-status-indicator.connected {
            color: #28a745;
            font-weight: bold;
        }

        .tm-status-indicator.disconnected {
            color: #dc3545;
            font-weight: bold;
        }

        .tm-gist-info {
            color: #6c757d;
            font-size: 12px;
            font-family: monospace;
        }

        .tm-config-hint {
            color: #6c757d;
            font-style: italic;
        }

        .tm-sync-status-text {
            color: #28a745;
            font-size: 12px;
            font-weight: 500;
            margin-left: auto;
        }

        /* 快捷键提示 */
        .tm-sync-hotkey {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            z-index: 9999;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow:
                0 4px 12px rgba(0, 123, 255, 0.3),
                0 2px 6px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            user-select: none;
            max-width: 200px;
            text-align: center;
        }

        .tm-sync-hotkey:hover {
            background: rgba(0, 123, 255, 1);
            transform: translateY(-2px);
            box-shadow:
                0 6px 20px rgba(0, 123, 255, 0.4),
                0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .tm-sync-hotkey:active {
            transform: translateY(0);
            transition: all 0.1s ease;
        }

        /* 响应式设计 - 确保不遮挡内容 */
        @media (max-width: 768px) {
            .tm-sync-hotkey {
                bottom: 15px;
                right: 15px;
                padding: 8px 12px;
                font-size: 12px;
                max-width: 160px;
            }
        }

        @media (max-height: 600px) {
            .tm-sync-hotkey {
                bottom: 10px;
                right: 10px;
                padding: 6px 10px;
                font-size: 11px;
            }
        }

        /* 确保按钮不与页面滚动条重叠 */
        @media (min-width: 1200px) {
            .tm-sync-hotkey {
                right: 30px;
            }
        }

        /* 自动同步设置样式 */
        .tm-auto-sync-settings {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }

        .tm-setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .tm-setting-row:last-child {
            margin-bottom: 0;
        }

        .tm-setting-hint {
            color: #6c757d;
            font-size: 12px;
            margin-left: 10px;
        }

        /* 开关按钮样式 */
        .tm-toggle-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
        }

        .tm-toggle-label input[type="checkbox"] {
            display: none;
        }

        .tm-toggle-slider {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            background-color: #ccc;
            border-radius: 24px;
            margin-right: 10px;
            transition: background-color 0.3s;
        }

        .tm-toggle-slider:before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: white;
            top: 2px;
            left: 2px;
            transition: transform 0.3s;
        }

        .tm-toggle-label input:checked + .tm-toggle-slider {
            background-color: #28a745;
        }

        .tm-toggle-label input:checked + .tm-toggle-slider:before {
            transform: translateX(26px);
        }

        /* 间隔选择器样式 */
        .tm-setting-row select {
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            font-size: 12px;
        }
    `);

    async function loadData() {
        console.log('TM-DEBUG: Loading tags data from GM_storage...');

        // 初始化设备ID
        if (!deviceId) {
            deviceId = await GM_getValue('device_id', null);
            if (!deviceId) {
                deviceId = generateDeviceId();
                await GM_setValue('device_id', deviceId);
                console.log('TM-DEBUG: Generated new device ID:', deviceId);
            } else {
                console.log('TM-DEBUG: Loaded existing device ID:', deviceId);
            }
        }

        const storedData = await GM_getValue(STORAGE_KEY, "{}");
        try {
            const rawData = JSON.parse(storedData);
            console.log('TM-DEBUG: Raw stored data:', rawData);

            // 自动迁移数据格式
            tagsData = migrateDataFormat(rawData);

            // 如果发生了迁移，保存新格式
            if (!rawData._meta || rawData._meta.version !== localDataVersion) {
                console.log('TM-DEBUG: Saving migrated data format...');
                await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
            }

            // 数据完整性检查
            let hasCorruption = false;
            if (tagsData.users) {
                for (const [username, userData] of Object.entries(tagsData.users)) {
                    if (!userData || !Array.isArray(userData.tags)) {
                        console.warn(`TM-WARNING: Corrupted user data for "${username}":`, userData);
                        tagsData.users[username] = createUserData([], Date.now());
                        hasCorruption = true;
                    }
                }
            }

            // 如果发现损坏数据，重新保存修复后的数据
            if (hasCorruption) {
                console.log('TM-DEBUG: Repairing corrupted data...');
                await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
            }

        } catch (e) {
            console.error('TM-ERROR: Failed to parse stored data.', e);
            // 创建空的新格式数据
            tagsData = {
                _meta: {
                    version: localDataVersion,
                    last_global_update: Date.now(),
                    device_id: deviceId
                },
                users: {}
            };
            await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
        }

        console.log('TM-DEBUG: Data loaded. Users count:', Object.keys(tagsData.users || {}).length);
        console.log('TM-DEBUG: Data format version:', tagsData._meta?.version);
    }

    async function saveTags(username, newTags) {
        console.log(`TM-SAVE: 保存用户 "${username}" 的标签:`, newTags);

        // 确保tagsData有正确的结构
        if (!tagsData._meta) {
            tagsData = {
                _meta: {
                    version: localDataVersion,
                    last_global_update: Date.now(),
                    device_id: deviceId
                },
                users: tagsData.users || {}
            };
        }

        const timestamp = Date.now();

        // *** 关键修复：保留空标签用户记录，确保删除操作能同步到其他设备 ***
        if (newTags.length === 0) {
            // 保留用户记录但标签为空，确保其他设备能感知到删除操作
            tagsData.users[username] = createUserData([], timestamp);
            console.log(`TM-SAVE: 清空用户 "${username}" 的所有标签（保留记录以同步删除操作）`);
        } else {
            // 更新用户数据
            tagsData.users[username] = createUserData(newTags, timestamp);
            console.log(`TM-SAVE: 更新用户 "${username}" 标签: [${newTags.join(', ')}] 时间: ${new Date(timestamp).toLocaleString()}`);
        }

        // 更新全局时间戳
        tagsData._meta.last_global_update = timestamp;
        tagsData._meta.device_id = deviceId;

        await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
        console.log(`TM-SAVE: 数据已保存，总用户数: ${Object.keys(tagsData.users).length}`);

        // 触发智能调度器重置（有变化）
        if (syncScheduler) {
            syncScheduler.reset();
        }

        // 快速云同步 - 减少延迟到1秒
        if (autoSyncEnabled && githubToken && gistId) {
            pendingAutoUpload = true;
            setTimeout(() => {
                if (pendingAutoUpload) {
                    autoUploadToGithub();
                }
            }, 1000);
        }
    }

    function renderButtonsState(card, username) {
        // 从新格式数据中获取用户标签
        let currentTags = [];

        if (tagsData.users && tagsData.users[username] && tagsData.users[username].tags) {
            currentTags = tagsData.users[username].tags;
        } else if (tagsData[username]) {
            // 兼容旧格式数据（在迁移过程中可能存在）
            currentTags = Array.isArray(tagsData[username]) ? tagsData[username] : [];
            console.warn(`TM-WARNING: Found legacy format data for "${username}", consider refreshing page for migration`);
        }

        // 类型安全检查
        if (!Array.isArray(currentTags)) {
            console.warn(`TM-WARNING: Data for "${username}" is not an array:`, currentTags, 'Converting to empty array.');
            currentTags = [];
        }

        const buttons = card.querySelectorAll('.tm-tag-btn');

        buttons.forEach(button => {
            const tag = button.textContent;
            if (currentTags.includes(tag)) {
                button.classList.add('active');
                button.style.backgroundColor = buttonColors[tag];
            } else {
                button.classList.remove('active');
                button.style.backgroundColor = buttonColors.default;
            }
        });
    }

    function processCard(card) {
        if (card.dataset.tagsProcessed) {
            return;
        }

        const usernameElement = card.querySelector('div[class*="truncated__text truncated__text-single"]');

        if (usernameElement) {
            const username = usernameElement.textContent.trim();
            card.dataset.username = username;

            console.log(`TM-DEBUG: Processing card for user "${username}".`);

            // 创建按钮容器
            const actionContainer = document.createElement('div');
            actionContainer.className = 'tm-tag-actions-container';

            statuses.forEach(status => {
                const button = document.createElement('button');
                button.className = 'tm-tag-btn';
                button.textContent = status;

                button.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    console.log(`TM-CLICK: 标签 "${status}" 被点击，用户: "${username}"`);

                    // 从新格式数据中获取当前标签
                    let currentTags = [];
                    if (tagsData.users && tagsData.users[username] && tagsData.users[username].tags) {
                        currentTags = [...tagsData.users[username].tags];
                    } else if (tagsData[username]) {
                        // 兼容旧格式（在迁移过程中）
                        currentTags = Array.isArray(tagsData[username]) ? [...tagsData[username]] : [];
                    }

                    const tagIndex = currentTags.indexOf(status);

                    if (tagIndex > -1) {
                        currentTags.splice(tagIndex, 1);
                        console.log(`TM-CLICK: 标签 "${status}" 已移除`);
                    } else {
                        currentTags.push(status);
                        console.log(`TM-CLICK: 标签 "${status}" 已添加`);
                    }

                    await saveTags(username, currentTags);
                    renderButtonsState(card, username);
                });

                actionContainer.appendChild(button);
            });

            // 将按钮容器添加到卡片底部
            card.appendChild(actionContainer);
            console.log('TM-DEBUG: Tag buttons added to card bottom.');

            renderButtonsState(card, username);

            card.dataset.tagsProcessed = 'true';
            console.log('TM-DEBUG: Card processed with bottom buttons.');
        } else {
            console.warn('TM-WARNING: Failed to find username on a new card.', { usernameElement, card });
        }
    }

    // === 云同步功能 ===

    // 创建同步面板
    function createSyncPanel() {
        const syncPanel = document.createElement('div');
        syncPanel.id = 'tm-sync-panel';

        const hasGithubConfig = githubToken && gistId;

        syncPanel.innerHTML = `
            <div class="tm-sync-content">
                <h3>标签数据同步</h3>

                <div class="tm-sync-section">
                    <h4>🌐 GitHub 云同步</h4>
                    ${hasGithubConfig ? `
                        <div class="tm-github-status">
                            <span class="tm-status-indicator connected">✅ 已连接</span>
                            <span class="tm-gist-info">Gist ID: ${gistId.substring(0, 8)}...</span>
                            <span id="tm-sync-status" class="tm-sync-status-text">就绪</span>
                        </div>

                        <div class="tm-auto-sync-settings">
                            <div class="tm-setting-row">
                                <label class="tm-toggle-label">
                                    <input type="checkbox" id="tm-auto-sync-toggle" ${autoSyncEnabled ? 'checked' : ''}>
                                    <span class="tm-toggle-slider"></span>
                                    自动同步
                                </label>
                                <span class="tm-setting-hint">修改标签时自动上传，定期检查云端更新</span>
                            </div>
                            ${autoSyncEnabled ? `
                                <div class="tm-setting-row">
                                    <label for="tm-sync-interval">检查间隔：</label>
                                    <select id="tm-sync-interval">
                                        <option value="5" ${autoSyncInterval === 5 ? 'selected' : ''}>5秒 (最快)</option>
                                        <option value="10" ${autoSyncInterval === 10 ? 'selected' : ''}>10秒 (快速)</option>
                                        <option value="15" ${autoSyncInterval === 15 ? 'selected' : ''}>15秒</option>
                                        <option value="30" ${autoSyncInterval === 30 ? 'selected' : ''}>30秒</option>
                                        <option value="60" ${autoSyncInterval === 60 ? 'selected' : ''}>1分钟</option>
                                    </select>
                                </div>
                            ` : ''}
                        </div>

                        <div class="tm-sync-actions">
                            <button id="tm-cloud-upload" class="tm-sync-btn cloud">立即上传</button>
                            <button id="tm-cloud-download" class="tm-sync-btn cloud">立即下载</button>
                            <button id="tm-github-settings" class="tm-sync-btn secondary">重新设置</button>
                        </div>
                    ` : `
                        <div class="tm-github-status">
                            <span class="tm-status-indicator disconnected">❌ 未配置</span>
                            <span class="tm-config-hint">需要设置 GitHub Token</span>
                        </div>
                        <button id="tm-github-setup" class="tm-sync-btn primary">设置 GitHub 同步</button>
                    `}
                </div>

                <div class="tm-sync-actions">
                    <button id="tm-close-sync" class="tm-sync-btn close">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(syncPanel);

        bindSyncPanelEvents();
    }

    function bindSyncPanelEvents() {
        const closeBtn = document.getElementById('tm-close-sync');
        if (closeBtn) closeBtn.onclick = closeSyncPanel;

        const githubSetupBtn = document.getElementById('tm-github-setup');
        const githubSettingsBtn = document.getElementById('tm-github-settings');
        const cloudUploadBtn = document.getElementById('tm-cloud-upload');
        const cloudDownloadBtn = document.getElementById('tm-cloud-download');

        if (githubSetupBtn) githubSetupBtn.onclick = showGithubSetup;
        if (githubSettingsBtn) githubSettingsBtn.onclick = showGithubSetup;
        if (cloudUploadBtn) cloudUploadBtn.onclick = uploadToGithub;
        if (cloudDownloadBtn) cloudDownloadBtn.onclick = downloadFromGithub;

        const autoSyncToggle = document.getElementById('tm-auto-sync-toggle');
        const syncIntervalSelect = document.getElementById('tm-sync-interval');

        if (autoSyncToggle) {
            autoSyncToggle.onchange = async (e) => {
                autoSyncEnabled = e.target.checked;
                await GM_setValue('auto_sync_enabled', autoSyncEnabled);

                if (autoSyncEnabled) {
                    startAutoSync();
                } else {
                    stopAutoSync();
                }

                closeSyncPanel();
                showSyncPanel();
            };
        }

        if (syncIntervalSelect) {
            syncIntervalSelect.onchange = async (e) => {
                autoSyncInterval = parseInt(e.target.value);
                await GM_setValue('auto_sync_interval', autoSyncInterval);

                if (autoSyncEnabled) {
                    stopAutoSync();
                    startAutoSync();
                }
            };
        }
    }

    function showGithubSetup() {
        const setupModal = document.createElement('div');
        setupModal.id = 'tm-github-setup-modal';
        setupModal.innerHTML = `
            <div class="tm-sync-content">
                <h3>设置 GitHub 同步</h3>
                <div class="tm-sync-section">
                    <h4>步骤 1: 获取 GitHub Token</h4>
                    <ol>
                        <li>访问 <a href="https://github.com/settings/tokens" target="_blank">GitHub Token 设置页面</a></li>
                        <li>点击 "Generate new token (classic)"</li>
                        <li>设置名称，勾选 <code>gist</code> 权限</li>
                        <li>复制生成的 Token</li>
                    </ol>

                    <h4>步骤 2: 输入配置</h4>
                    <div>
                        <label>GitHub Token:</label>
                        <input type="password" id="tm-github-token" placeholder="粘贴你的 GitHub Token" value="${githubToken || ''}" style="width: 100%; padding: 8px; margin: 5px 0;">
                    </div>
                    <div>
                        <label>Gist ID (可选):</label>
                        <input type="text" id="tm-gist-id" placeholder="留空自动创建" value="${gistId || ''}" style="width: 100%; padding: 8px; margin: 5px 0;">
                        <small style="color: #666;">如果是第一次使用，留空即可</small>
                    </div>
                </div>

                <div class="tm-sync-actions">
                    <button id="tm-test-github" class="tm-sync-btn secondary">测试连接</button>
                    <button id="tm-save-github" class="tm-sync-btn primary">保存配置</button>
                    <button id="tm-cancel-setup" class="tm-sync-btn close">取消</button>
                </div>

                <div id="tm-setup-status" style="margin-top: 10px; padding: 10px; border-radius: 4px; text-align: center;"></div>
            </div>
        `;

        setupModal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); display: flex;
            justify-content: center; align-items: center; z-index: 10001;
        `;

        document.body.appendChild(setupModal);

        document.getElementById('tm-test-github').onclick = testGithubConnection;
        document.getElementById('tm-save-github').onclick = saveGithubConfig;
        document.getElementById('tm-cancel-setup').onclick = () => setupModal.remove();
    }

    async function testGithubConnection() {
        const tokenInput = document.getElementById('tm-github-token');
        const statusDiv = document.getElementById('tm-setup-status');
        const testToken = tokenInput.value.trim();

        if (!testToken) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">请输入 GitHub Token</span>';
            return;
        }

        statusDiv.innerHTML = '<span style="color: #007bff;">正在测试连接...</span>';

        try {
            const response = await gmFetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${testToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                statusDiv.innerHTML = `<span style="color: #28a745;">✅ 连接成功！用户: ${userData.login}</span>`;
            } else {
                statusDiv.innerHTML = '<span style="color: #dc3545;">❌ Token 无效，请检查权限设置</span>';
            }
        } catch (error) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">❌ 网络错误，请检查网络连接</span>';
            console.error('GitHub connection test failed:', error);
        }
    }

    async function saveGithubConfig() {
        const tokenInput = document.getElementById('tm-github-token');
        const gistIdInput = document.getElementById('tm-gist-id');
        const statusDiv = document.getElementById('tm-setup-status');
        const token = tokenInput.value.trim();
        const inputGistId = gistIdInput.value.trim();

        if (!token) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">请输入 GitHub Token</span>';
            return;
        }

        statusDiv.innerHTML = '<span style="color: #007bff;">正在保存配置...</span>';

        try {
            await GM_setValue('github_token', token);
            githubToken = token;

            if (inputGistId) {
                const gistExists = await verifyGist(inputGistId);
                if (gistExists) {
                    gistId = inputGistId;
                    await GM_setValue('gist_id', gistId);
                } else {
                    statusDiv.innerHTML = '<span style="color: #dc3545;">❌ 指定的 Gist 不存在或无权访问</span>';
                    return;
                }
            } else {
                const newGistId = await createNewGist();
                if (newGistId) {
                    gistId = newGistId;
                    await GM_setValue('gist_id', gistId);
                } else {
                    statusDiv.innerHTML = '<span style="color: #dc3545;">❌ 创建 Gist 失败</span>';
                    return;
                }
            }

            statusDiv.innerHTML = `<span style="color: #28a745;">✅ 配置保存成功！Gist ID: ${gistId}</span>`;

            if (autoSyncEnabled) {
                startAutoSync();
            }

            setTimeout(() => {
                document.getElementById('tm-github-setup-modal').remove();
                closeSyncPanel();
                showSyncPanel();
            }, 2000);

        } catch (error) {
            statusDiv.innerHTML = '<span style="color: #dc3545;">❌ 保存配置失败</span>';
            console.error('Failed to save GitHub config:', error);
        }
    }

    async function verifyGist(gistId) {
        try {
            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Failed to verify gist:', error);
            return false;
        }
    }

    async function createNewGist() {
        try {
            const response = await gmFetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'TikTok Creator Tags Sync Data',
                    public: false,
                    files: {
                        [GITHUB_GIST_FILENAME]: {
                            content: JSON.stringify({}, null, 2)
                        }
                    }
                })
            });

            if (response.ok) {
                const gistData = await response.json();
                console.log('TM-DEBUG: New gist created:', gistData.id);
                return gistData.id;
            } else {
                console.error('Failed to create gist:', response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Failed to create gist:', error);
            return null;
        }
    }

    async function uploadToGithub() {
        if (!githubToken || !gistId) {
            alert('GitHub 配置未完成，请先设置 GitHub 同步');
            return;
        }

        try {
            const uploadBtn = document.getElementById('tm-cloud-upload');
            if (uploadBtn) {
                uploadBtn.textContent = '上传中...';
                uploadBtn.disabled = true;
            }

            // 确保数据格式正确
            if (!tagsData._meta) {
                console.log('TM-UPLOAD: 检测到旧格式数据，进行迁移...');
                tagsData = migrateDataFormat(tagsData);
            }

            // 更新上传时的元数据
            const uploadData = {
                ...tagsData,
                _meta: {
                    ...tagsData._meta,
                    last_global_update: Date.now(),
                    device_id: deviceId,
                    uploaded_at: Date.now(),
                    uploaded_by: deviceId
                }
            };

            console.log('TM-UPLOAD: 准备上传数据');
            console.log('  设备ID:', deviceId);
            console.log('  用户数量:', Object.keys(uploadData.users).length);
            console.log('  数据版本:', uploadData._meta.version);
            console.log('  全局更新时间:', new Date(uploadData._meta.last_global_update).toLocaleString());

            const dataStr = JSON.stringify(uploadData, null, 2);

            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [GITHUB_GIST_FILENAME]: {
                            content: dataStr
                        }
                    }
                })
            });

            if (response.ok) {
                lastCloudSync = Date.now();
                await GM_setValue('last_cloud_sync', lastCloudSync);
                console.log('TM-UPLOAD: 数据已成功上传到GitHub Gist');
                console.log('TM-UPLOAD: 云端同步时间:', new Date(lastCloudSync).toLocaleString());
                alert('✅ 数据已成功上传到云端！');
            } else {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

        } catch (error) {
            console.error('TM-UPLOAD: 上传失败:', error);
            alert('❌ 上传失败，请检查网络连接和 GitHub 配置');
        } finally {
            const uploadBtn = document.getElementById('tm-cloud-upload');
            if (uploadBtn) {
                uploadBtn.textContent = '立即上传';
                uploadBtn.disabled = false;
            }
        }
    }

    // *** 增量同步优化：智能合并数据 ***
    async function downloadFromGithub() {
        if (!githubToken || !gistId) {
            alert('GitHub 配置未完成，请先设置 GitHub 同步');
            return;
        }

        try {
            const downloadBtn = document.getElementById('tm-cloud-download');
            if (downloadBtn) {
                downloadBtn.textContent = '下载中...';
                downloadBtn.disabled = true;
            }

            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gistData = await response.json();
                const file = gistData.files[GITHUB_GIST_FILENAME];

                if (file && file.content) {
                    const cloudData = JSON.parse(file.content);

                    console.log('TM-DOWNLOAD: 开始下载云端数据');
                    console.log('TM-DOWNLOAD: Gist更新时间:', new Date(gistData.updated_at).toLocaleString());

                    // 自动迁移云端数据格式
                    const migratedCloudData = migrateDataFormat(cloudData);

                    console.log('TM-DOWNLOAD: 云端数据概况');
                    console.log('  数据版本:', migratedCloudData._meta?.version || 'legacy');
                    console.log('  用户数量:', Object.keys(migratedCloudData.users || cloudData).length);
                    console.log('  全局更新时间:', migratedCloudData._meta?.last_global_update ?
                        new Date(migratedCloudData._meta.last_global_update).toLocaleString() : '未知');

                    // 智能合并数据
                    tagsData = mergeUserData(tagsData, migratedCloudData);

                    await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));

                    lastCloudSync = new Date(gistData.updated_at).getTime();
                    await GM_setValue('last_cloud_sync', lastCloudSync);

                    // 重新渲染所有卡片
                    const cards = document.querySelectorAll('section[data-testid*="ExploreCreatorCard"]');
                    cards.forEach(card => {
                        const username = card.dataset.username;
                        if (username) {
                            renderButtonsState(card, username);
                        }
                    });

                    console.log('TM-DOWNLOAD: 数据合并完成');
                    console.log('  最终用户数:', Object.keys(tagsData.users).length);
                    console.log('  本地同步时间:', new Date(lastCloudSync).toLocaleString());

                    alert('✅ 数据已从云端同步成功！');
                } else {
                    throw new Error('Gist file not found or empty');
                }
            } else {
                const errorText = await response.text();
                throw new Error(`Download failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

        } catch (error) {
            console.error('TM-DOWNLOAD: 下载失败:', error);
            alert('❌ 下载失败，请检查网络连接和 GitHub 配置');
        } finally {
            const downloadBtn = document.getElementById('tm-cloud-download');
            if (downloadBtn) {
                downloadBtn.textContent = '立即下载';
                downloadBtn.disabled = false;
            }
        }
    }

    // 自动同步功能
    function startAutoSync() {
        if (!githubToken || !gistId) {
            console.log('TM-SMART-SYNC: GitHub配置缺失，智能同步已禁用');
            console.log('TM-SMART-SYNC: githubToken:', !!githubToken, 'gistId:', !!gistId);
            return;
        }

        stopAutoSync();

        // 初始化智能调度器
        if (!syncScheduler) {
            syncScheduler = new SyncScheduler();
            console.log('TM-SMART-SYNC: 智能调度器已初始化');
        } else {
            syncScheduler.reset();
        }

        console.log('TM-SMART-SYNC: 启动智能同步系统');
        console.log('  基础间隔:', syncScheduler.baseInterval / 1000 + 's');
        console.log('  最大间隔:', syncScheduler.maxInterval / 1000 + 's');
        console.log('  设备ID:', deviceId);

        updateSyncStatus('🔄 智能同步启动中...');

        // 立即执行一次检查
        console.log('TM-SMART-SYNC: 执行初始检查...');
        autoCheckAndDownload().then(() => {
            // 启动智能定时器
            scheduleNextCheck();
        });
    }

    function scheduleNextCheck() {
        if (!syncScheduler || !autoSyncEnabled || !githubToken || !gistId) {
            return;
        }

        const nextInterval = syncScheduler.getNextInterval();
        console.log(`TM-SMART-SYNC: 计划下次检查，间隔: ${nextInterval/1000}s`);

        if (syncTimer) {
            clearTimeout(syncTimer);
        }

        syncTimer = setTimeout(async () => {
            const hasUpdates = await autoCheckAndDownload();
            scheduleNextCheck(); // 递归调度下一次检查
        }, nextInterval);
    }

    function stopAutoSync() {
        if (syncTimer) {
            clearTimeout(syncTimer);
            syncTimer = null;
            console.log('TM-SMART-SYNC: 智能同步已停止');
        }

        if (syncScheduler) {
            syncScheduler.reset();
        }

        updateSyncStatus('⏸️ 同步已暂停');
    }

    async function autoUploadToGithub() {
        if (syncInProgress) return;

        syncInProgress = true;
        pendingAutoUpload = false;
        updateSyncStatus('⬆️ 自动上传中...');

        try {
            const dataStr = JSON.stringify(tagsData, null, 2);

            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [GITHUB_GIST_FILENAME]: {
                            content: dataStr
                        }
                    }
                })
            });

            if (response.ok) {
                lastCloudSync = Date.now();
                await GM_setValue('last_cloud_sync', lastCloudSync);
                console.log('TM-DEBUG: Auto upload successful');
                updateSyncStatus('✅ 自动上传成功');

                setTimeout(() => {
                    updateSyncStatus('🔄 自动同步运行中');
                }, 2000); // 减少状态显示时间
            } else {
                throw new Error(`Auto upload failed: ${response.status}`);
            }

        } catch (error) {
            console.error('Auto upload failed:', error);
            updateSyncStatus('❌ 自动上传失败');

            setTimeout(() => {
                updateSyncStatus('🔄 自动同步运行中');
            }, 3000);
        } finally {
            syncInProgress = false;
        }
    }

    // *** 关键修复：自动下载也使用覆盖模式 ***
    // *** 增量同步核心算法 ***
    async function autoCheckAndDownload() {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`TM-AUTO-SYNC: [${timestamp}] 增量检查开始`);

        if (syncInProgress) {
            console.log(`TM-AUTO-SYNC: [${timestamp}] 同步正在进行，跳过检查`);
            return false;
        }

        if (!githubToken || !gistId) {
            console.log(`TM-AUTO-SYNC: [${timestamp}] GitHub配置缺失，跳过检查`);
            return false;
        }

        try {
            syncInProgress = true;

            // 步骤1: 快速检查Gist元数据
            console.log(`TM-AUTO-SYNC: [${timestamp}] 步骤1 - 检查Gist元数据`);
            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API错误: ${response.status} ${response.statusText}`);
            }

            const gistData = await response.json();
            const cloudUpdateTime = new Date(gistData.updated_at).getTime();
            const localLastSync = lastCloudSync || 0;

            console.log(`TM-AUTO-SYNC: [${timestamp}] 时间对比`);
            console.log('  云端更新时间:', new Date(cloudUpdateTime).toLocaleString());
            console.log('  本地同步时间:', new Date(localLastSync).toLocaleString());
            console.log('  云端较新:', cloudUpdateTime > localLastSync);

            // 智能调度器处理
            const hasCloudUpdates = cloudUpdateTime > localLastSync;
            const nextInterval = syncScheduler.adjustInterval(hasCloudUpdates);

            if (!hasCloudUpdates) {
                // 没有更新，更新本地同步时间
                lastCloudSync = cloudUpdateTime;
                await GM_setValue('last_cloud_sync', lastCloudSync);
                console.log(`TM-AUTO-SYNC: [${timestamp}] 无云端更新，下次检查间隔: ${nextInterval/1000}s`);
                return false;
            }

            // 步骤2: 有更新，下载并智能合并
            console.log(`TM-AUTO-SYNC: [${timestamp}] 步骤2 - 发现更新，开始增量同步`);
            updateSyncStatus('⬇️ 发现云端更新，增量同步中...');

            const file = gistData.files[GITHUB_GIST_FILENAME];
            if (!file || !file.content) {
                throw new Error('Gist文件未找到或为空');
            }

            const cloudData = JSON.parse(file.content);

            // 步骤3: 数据迁移和验证
            console.log(`TM-AUTO-SYNC: [${timestamp}] 步骤3 - 数据验证和迁移`);
            const migratedCloudData = migrateDataFormat(cloudData);

            console.log(`TM-AUTO-SYNC: [${timestamp}] 云端数据概况`);
            console.log('  数据版本:', migratedCloudData._meta?.version || 'legacy');
            console.log('  用户数量:', Object.keys(migratedCloudData.users || cloudData).length);
            console.log('  全局更新时间:', migratedCloudData._meta?.last_global_update ?
                new Date(migratedCloudData._meta.last_global_update).toLocaleString() : '未知');

            // 步骤4: 智能合并
            console.log(`TM-AUTO-SYNC: [${timestamp}] 步骤4 - 智能合并数据`);
            const originalUserCount = Object.keys(tagsData.users || {}).length;

            tagsData = mergeUserData(tagsData, migratedCloudData);

            await GM_setValue(STORAGE_KEY, JSON.stringify(tagsData));
            lastCloudSync = cloudUpdateTime;
            await GM_setValue('last_cloud_sync', lastCloudSync);

            // 步骤5: UI更新
            console.log(`TM-AUTO-SYNC: [${timestamp}] 步骤5 - 更新UI`);
            const cards = document.querySelectorAll('section[data-testid*="ExploreCreatorCard"]');
            cards.forEach(card => {
                const username = card.dataset.username;
                if (username) {
                    renderButtonsState(card, username);
                }
            });

            const finalUserCount = Object.keys(tagsData.users).length;
            console.log(`TM-AUTO-SYNC: [${timestamp}] 增量同步完成`);
            console.log('  原始用户数:', originalUserCount);
            console.log('  最终用户数:', finalUserCount);
            console.log('  下次检查间隔:', nextInterval/1000 + 's');

            updateSyncStatus('✅ 增量同步完成');

            setTimeout(() => {
                updateSyncStatus('🔄 智能同步运行中');
            }, 2000);

            return true;

        } catch (error) {
            console.error(`TM-AUTO-SYNC: [${timestamp}] 增量同步失败:`, error);
            updateSyncStatus('❌ 同步失败');

            setTimeout(() => {
                updateSyncStatus('🔄 智能同步运行中');
            }, 3000);

            return false;
        } finally {
            syncInProgress = false;
        }
    }

    function updateSyncStatus(status) {
        const statusElement = document.getElementById('tm-sync-status');
        if (statusElement) {
            statusElement.textContent = status;
        }

        const hotkeyBtn = document.querySelector('.tm-sync-hotkey');
        if (hotkeyBtn && autoSyncEnabled && githubToken && gistId) {
            if (status.includes('运行中')) {
                hotkeyBtn.style.background = 'rgba(40, 167, 69, 0.9)';
            } else if (status.includes('上传中') || status.includes('同步中')) {
                hotkeyBtn.style.background = 'rgba(255, 193, 7, 0.9)';
            } else if (status.includes('失败')) {
                hotkeyBtn.style.background = 'rgba(220, 53, 69, 0.9)';
            }
        }
    }

    function closeSyncPanel() {
        const panel = document.getElementById('tm-sync-panel');
        if (panel) {
            panel.remove();
        }
    }

    function showSyncPanel() {
        if (!document.getElementById('tm-sync-panel')) {
            createSyncPanel();
        }
        document.getElementById('tm-sync-panel').style.display = 'flex';
    }

    // 创建快捷键按钮
    function createSyncHotkey() {
        const hotkeyBtn = document.createElement('div');
        hotkeyBtn.className = 'tm-sync-hotkey';
        hotkeyBtn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                📊
                <span>同步标签</span>
            </div>
            <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">Ctrl+S</div>
        `;
        hotkeyBtn.onclick = showSyncPanel;
        document.body.appendChild(hotkeyBtn);

        console.log('TM-UI: 同步按钮已创建在右下角');
    }

    // 加载 GitHub 配置
    async function loadGithubConfig() {
        try {
            githubToken = await GM_getValue('github_token', null);
            gistId = await GM_getValue('gist_id', null);
            autoSyncEnabled = await GM_getValue('auto_sync_enabled', true);
            autoSyncInterval = await GM_getValue('auto_sync_interval', 10); // 默认10秒
            lastCloudSync = await GM_getValue('last_cloud_sync', 0);

            if (githubToken && gistId) {
                console.log('TM-DEBUG: GitHub config loaded successfully');
                console.log(`TM-DEBUG: Auto sync enabled: ${autoSyncEnabled}, interval: ${autoSyncInterval}s`);
            } else {
                console.log('TM-DEBUG: GitHub not configured yet');
            }
        } catch (error) {
            console.error('Failed to load GitHub config:', error);
        }
    }

    // 添加键盘快捷键
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                showSyncPanel();
            }
            if (e.key === 'Escape') {
                closeSyncPanel();
            }
            // Ctrl+Shift+A 显示自动同步状态
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                showAutoSyncStatus();
            }
            // Ctrl+Shift+G 查看GitHub Gist数据
            if (e.ctrlKey && e.shiftKey && e.key === 'G') {
                e.preventDefault();
                viewGistData();
            }
            // Ctrl+Shift+C 清理空标签记录
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                showCleanupDialog();
            }
        });
    }

    // 显示自动同步状态（调试用）
    function showAutoSyncStatus() {
        console.log('=== TM-DEBUG: Auto Sync Status ===');
        console.log('Auto sync enabled:', autoSyncEnabled);
        console.log('Auto sync interval:', autoSyncInterval, 'seconds');
        console.log('GitHub token configured:', !!githubToken);
        console.log('Gist ID:', gistId);
        console.log('Sync timer active:', !!syncTimer);
        console.log('Sync in progress:', syncInProgress);
        console.log('Last cloud sync:', new Date(lastCloudSync).toLocaleString());
        console.log('Next check in approximately:', autoSyncInterval, 'seconds');

        const statusMsg = `
自动同步状态:
- 启用: ${autoSyncEnabled ? '是' : '否'}
- 检查间隔: ${autoSyncInterval}秒
- GitHub配置: ${githubToken && gistId ? '已配置' : '未配置'}
- 定时器运行: ${syncTimer ? '是' : '否'}
- 正在同步: ${syncInProgress ? '是' : '否'}
- 上次同步: ${new Date(lastCloudSync).toLocaleString()}

详细信息已输出到控制台。
        `;

        alert(statusMsg);

        // 手动触发一次检查（用于测试）
        if (autoSyncEnabled && githubToken && gistId) {
            console.log('TM-DEBUG: Manually triggering auto check for testing...');
            autoCheckAndDownload();
        }
    }

    // 查看GitHub Gist数据（调试用）
    async function viewGistData() {
        if (!githubToken || !gistId) {
            alert('GitHub 配置未完成，无法查看Gist数据！');
            console.log('TM-DEBUG: GitHub not configured for viewing Gist data');
            return;
        }

        console.log('TM-DEBUG: Fetching Gist data for viewing...');

        try {
            const response = await gmFetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const gistData = await response.json();
                const file = gistData.files[GITHUB_GIST_FILENAME];

                console.log('=== TM-DEBUG: GitHub Gist 详情 ===');
                console.log('Gist ID:', gistId);
                console.log('Gist URL:', gistData.html_url);
                console.log('创建时间:', new Date(gistData.created_at).toLocaleString());
                console.log('更新时间:', new Date(gistData.updated_at).toLocaleString());
                console.log('文件名:', GITHUB_GIST_FILENAME);

                if (file && file.content) {
                    const cloudData = JSON.parse(file.content);
                    console.log('文件内容:', cloudData);
                    console.log('用户数量:', Object.keys(cloudData).length);

                    // 显示详细信息
                    let userDetails = '';
                    for (const [username, tags] of Object.entries(cloudData)) {
                        userDetails += `${username}: [${tags.join(', ')}]\n`;
                    }

                    const gistInfo = `
📊 GitHub Gist 数据查看

🔗 Gist URL: ${gistData.html_url}
🆔 Gist ID: ${gistId}
📅 创建时间: ${new Date(gistData.created_at).toLocaleString()}
🔄 更新时间: ${new Date(gistData.updated_at).toLocaleString()}
👥 用户数量: ${Object.keys(cloudData).length}个

📋 用户标签详情:
${userDetails || '暂无数据'}

💡 提示:
- 详细数据已输出到控制台
- 可以点击URL直接访问GitHub查看
- Ctrl+C 可复制此信息
                    `;

                    alert(gistInfo);

                    // 提供在线查看链接
                    console.log(`TM-DEBUG: 在线查看链接: ${gistData.html_url}`);

                } else {
                    console.warn('TM-DEBUG: Gist file is empty or not found');
                    alert('Gist文件为空或不存在！\n\n可能原因：\n1. 还没有上传过数据\n2. 文件名不匹配\n3. Gist已被删除');
                }

            } else {
                console.error('TM-DEBUG: Failed to fetch Gist:', response.status, response.statusText);
                alert(`无法获取Gist数据！\n\n错误: ${response.status} ${response.statusText}\n\n可能原因：\n1. GitHub Token无效\n2. Gist ID错误\n3. 网络连接问题`);
            }

        } catch (error) {
            console.error('TM-DEBUG: Error viewing Gist data:', error);
            alert(`查看Gist数据时发生错误！\n\n错误信息: ${error.message}\n\n请检查网络连接和GitHub配置`);
        }
    }

    // 显示清理空标签记录对话框
    function showCleanupDialog() {
        if (!tagsData.users) {
            alert('暂无用户数据需要清理！');
            return;
        }

        // 统计空标签记录
        let emptyTagsUsers = [];
        let totalUsers = 0;
        const now = Date.now();

        for (const [username, userData] of Object.entries(tagsData.users)) {
            totalUsers++;
            if (!userData.tags || userData.tags.length === 0) {
                const daysSinceUpdate = Math.floor((now - userData.updated_at) / (24 * 60 * 60 * 1000));
                emptyTagsUsers.push({
                    username,
                    daysSinceUpdate,
                    updatedAt: new Date(userData.updated_at).toLocaleString(),
                    deviceId: userData.device_id || '未知'
                });
            }
        }

        console.log('=== TM-CLEANUP: 空标签记录统计 ===');
        console.log('总用户数:', totalUsers);
        console.log('空标签用户数:', emptyTagsUsers.length);
        console.log('空标签用户详情:', emptyTagsUsers);

        if (emptyTagsUsers.length === 0) {
            alert('🎉 当前没有空标签记录需要清理！\n\n所有用户都有有效的标签数据。');
            return;
        }

        // 按更新时间排序
        emptyTagsUsers.sort((a, b) => b.daysSinceUpdate - a.daysSinceUpdate);

        // 生成详细信息
        const oldRecords = emptyTagsUsers.filter(u => u.daysSinceUpdate >= 30);
        const recentRecords = emptyTagsUsers.filter(u => u.daysSinceUpdate < 30);

        let details = '';
        if (oldRecords.length > 0) {
            details += `\n📅 超过30天的记录 (${oldRecords.length}个):\n`;
            oldRecords.slice(0, 5).forEach(u => {
                details += `  • ${u.username} (${u.daysSinceUpdate}天前)\n`;
            });
            if (oldRecords.length > 5) {
                details += `  • ...还有${oldRecords.length - 5}个\n`;
            }
        }

        if (recentRecords.length > 0) {
            details += `\n🕒 最近30天的记录 (${recentRecords.length}个):\n`;
            recentRecords.slice(0, 3).forEach(u => {
                details += `  • ${u.username} (${u.daysSinceUpdate}天前)\n`;
            });
            if (recentRecords.length > 3) {
                details += `  • ...还有${recentRecords.length - 3}个\n`;
            }
        }

        const cleanupMsg = `
🧹 空标签记录清理

📊 当前统计:
• 总用户数: ${totalUsers}
• 空标签记录: ${emptyTagsUsers.length}个
• 可清理记录(>30天): ${oldRecords.length}个
${details}

💡 说明:
• 空标签记录用于跨设备同步删除操作
• 建议保留最近30天的记录
• 超过30天的记录可以安全清理

❓ 是否清理超过30天的空标签记录？
（点击"确定"清理 ${oldRecords.length} 个记录）
        `;

        if (confirm(cleanupMsg.trim())) {
            const cleanedCount = cleanupEmptyTagsRecords(30);
            alert(`✅ 清理完成！\n\n已清理 ${cleanedCount} 个超过30天的空标签记录。\n\n详细信息已输出到控制台。`);
        } else {
            console.log('TM-CLEANUP: 用户取消了清理操作');
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const cards = node.querySelectorAll('section[data-testid*="ExploreCreatorCard"]');
                        if (cards.length > 0) {
                            console.log('TM-DEBUG: Found new creator cards via subtree mutation. Processing...');
                            cards.forEach(card => processCard(card));
                        } else if (node.matches('section[data-testid*="ExploreCreatorCard"]')) {
                            console.log('TM-DEBUG: Found a new creator card directly. Processing...');
                            processCard(node);
                        }
                    }
                });
            }
        });
    });

    async function init() {
        console.log('=== TM增量同步脚本启动 v2.0 ===');

        // 加载数据和配置（包含自动迁移）
        await loadData();
        await loadGithubConfig();

        console.log('TM-INIT: 初始化完成');
        console.log('  设备ID:', deviceId);
        console.log('  数据版本:', tagsData._meta?.version || 'legacy');
        console.log('  用户数量:', Object.keys(tagsData.users || {}).length);

        // 创建同步相关界面
        createSyncHotkey();
        setupKeyboardShortcuts();

        // 检查智能同步启动条件
        console.log('TM-INIT: 检查智能同步启动条件...');
        console.log('  自动同步已启用:', autoSyncEnabled);
        console.log('  GitHub Token已配置:', !!githubToken);
        console.log('  Gist ID已配置:', !!gistId);

        if (autoSyncEnabled && githubToken && gistId) {
            console.log('TM-INIT: 智能同步条件满足，3秒后启动...');
            // 延迟3秒启动，确保页面完全加载
            setTimeout(() => {
                console.log('TM-INIT: 启动智能同步系统...');
                startAutoSync();
            }, 3000);
        } else {
            console.log('TM-INIT: 智能同步启动条件不满足');
            if (!autoSyncEnabled) console.log('  - 自动同步已禁用');
            if (!githubToken) console.log('  - GitHub令牌缺失');
            if (!gistId) console.log('  - Gist ID缺失');
        }

        const targetNode = document.body;

        if (targetNode) {
            console.log('TM-DEBUG: Found target node. Observing DOM changes...');
            observer.observe(targetNode, { childList: true, subtree: true });

            // 处理已存在的卡片
            const existingCards = document.querySelectorAll('section[data-testid*="ExploreCreatorCard"]');
            if (existingCards.length > 0) {
                console.log(`TM-DEBUG: Found ${existingCards.length} existing cards. Processing...`);
                existingCards.forEach(card => processCard(card));
            }
        } else {
            console.warn('TM-WARNING: Main content not found. Retrying in 500ms...');
            setTimeout(init, 500);
        }
    }

    init();

})();