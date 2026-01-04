// ==UserScript==
// @name         微博综合屏蔽
// @namespace    https://github.com/SIXiaolong1117/Rules
// @version      0.13
// @description  屏蔽推荐、广告、荐读标签，屏蔽自定义关键词的微博内容，支持正则表达式
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553299/%E5%BE%AE%E5%8D%9A%E7%BB%BC%E5%90%88%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553299/%E5%BE%AE%E5%8D%9A%E7%BB%BC%E5%90%88%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置区域 ====================
    // 写死的推荐标签（不可通过菜单修改）
    const HIDDEN_TAGS = [
        '荐读',
        '广告',
        '推荐'
    ];

    // 默认关键词（可通过菜单修改）
    const DEFAULT_KEYWORDS = [
    ];

    // 默认屏蔽ID（可通过菜单修改）
    const DEFAULT_BLOCKED_IDS = [
    ];

    // 默认来源关键词
    const DEFAULT_SOURCE_KEYWORDS = [
    ];

    // 为所有存储键添加脚本专属前缀
    const STORAGE_PREFIX = 'sixiaolong1117_weibo_';
    const TIME_FILTER_DAYS_KEY = STORAGE_PREFIX + 'time_filter_days';
    const DEFAULT_SHOW_BLOCK_BUTTON = true;  // 默认显示屏蔽按钮
    const DEFAULT_SHOW_PLACEHOLDER = true;   // 默认显示占位块
    const DEFAULT_AUTO_EXPAND = false;

    // 提取 @version
    const SCRIPT_VERSION = GM_info.script.version || 'unknown';

    // WebDAV配置存储键
    const WEBDAV_CONFIG_KEY = STORAGE_PREFIX + 'webdav_config';
    // =================================================

    // 初始化关键词列表和ID列表
    let keywords = GM_getValue(STORAGE_PREFIX + 'keywords', DEFAULT_KEYWORDS);
    let blockedIds = GM_getValue(STORAGE_PREFIX + 'blocked_ids', DEFAULT_BLOCKED_IDS);
    let sourceKeywords = GM_getValue(STORAGE_PREFIX + 'source_keywords', DEFAULT_SOURCE_KEYWORDS);
    let timeFilterDays = GM_getValue(TIME_FILTER_DAYS_KEY, 0);
    let keywordManager = null;
    let showBlockButton = GM_getValue(STORAGE_PREFIX + 'show_block_button', DEFAULT_SHOW_BLOCK_BUTTON);
    let showPlaceholder = GM_getValue(STORAGE_PREFIX + 'show_placeholder', DEFAULT_SHOW_PLACEHOLDER);
    let autoExpandEnabled = GM_getValue(STORAGE_PREFIX + 'auto_expand', DEFAULT_AUTO_EXPAND);

    // WebDAV配置
    let webdavConfig = GM_getValue(WEBDAV_CONFIG_KEY, {
        enabled: false,
        url: '',
        username: '',
        password: '',
        lastSync: 0
    });

    // 统计隐藏的内容
    let hiddenCount = 0;
    const hiddenDetails = [];

    // 注册油猴菜单命令
    GM_registerMenuCommand('管理屏蔽关键词', showKeywordManager);
    GM_registerMenuCommand('设置WebDAV同步', showWebDAVConfig);
    GM_registerMenuCommand('显示设置', showDisplaySettings);
    GM_registerMenuCommand('设置时间过滤天数', showTimeFilterConfig);
    GM_registerMenuCommand('自动展开设置', showAutoExpandSettings);

    // 深浅色模式样式
    const styles = `
        .custom-hidden-message {
            margin: 10px 0;
        }
        .custom-hidden-message .message-content {
            padding: 15px;
            text-align: center;
            border: 1px solid;
            border-radius: 6px;
            font-size: 14px;
            margin: 10px 0;
        }
        .weibo-block-btn {
            padding: 2px 8px;
            border: 1px solid #d0d0d0;
            border-radius: 3px;
            background: transparent;
            color: #8590a6;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
            margin-left: 10px;
        }
        .weibo-block-btn:hover {
            border-color: #f1403c;
            color: #f1403c;
            background: rgba(241, 64, 60, 0.05);
        }
        .weibo-block-btn-comment {
            font-size: 11px;
            padding: 1px 6px;
            margin-left: 5px;
        }
        .head_name_24eEB {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .keyword-manager-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 90vw;
            background: var(--bg-color, white);
            border: 1px solid var(--border-color, #ccc);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
        }
        .keyword-manager-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .keyword-manager h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: var(--text-color, #333);
        }
        .keyword-manager .tabs {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid var(--border-color, #ddd);
        }
        .keyword-manager .tab {
            padding: 8px 16px;
            cursor: pointer;
            border: none;
            background: none;
            color: var(--text-color, #333);
            border-bottom: 2px solid transparent;
        }
        .keyword-manager .tab.active {
            border-bottom-color: #1890ff;
            color: #1890ff;
        }
        .keyword-manager textarea {
            width: 100%;
            height: 180px;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid var(--border-color, #ddd);
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
            font-size: 14px;
            background: var(--input-bg, white);
            color: var(--input-color, #333);
        }
        .keyword-manager .button-group {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        .keyword-manager button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .keyword-manager .save-btn {
            background: #1890ff;
            color: white;
        }
        .keyword-manager .save-btn:hover {
            background: #40a9ff;
        }
        .keyword-manager .close-btn {
            background: var(--btn-bg, #f5f5f5);
            color: var(--btn-color, #666);
        }
        .keyword-manager .close-btn:hover {
            background: var(--btn-hover-bg, #e8e8e8);
        }
        .keyword-manager .help-text {
            margin-top: 10px;
            font-size: 12px;
            color: var(--help-color, #666);
            line-height: 1.4;
        }
        @media (prefers-color-scheme: light) {
            .keyword-manager-modal {
                --bg-color: white;
                --text-color: #333;
                --border-color: #ccc;
                --input-bg: white;
                --input-color: #333;
                --btn-bg: #f5f5f5;
                --btn-color: #666;
                --btn-hover-bg: #e8e8e8;
                --help-color: #666;
            }
            .custom-hidden-message .message-content {
                background: #f5f5f5;
                color: #666;
                border-color: #ddd;
            }
        }
        @media (prefers-color-scheme: dark) {
            .keyword-manager-modal {
                --bg-color: #2d2d2d;
                --text-color: #ccc;
                --border-color: #444;
                --input-bg: #1a1a1a;
                --input-color: #ccc;
                --btn-bg: #444;
                --btn-color: #ccc;
                --btn-hover-bg: #555;
                --help-color: #999;
            }
            .custom-hidden-message .message-content {
                background: #2d2d2d;
                color: #ccc;
                border-color: #444;
            }
            .weibo-block-btn {
                border-color: #555;
                color: #8590a6;
            }
            .weibo-block-btn:hover {
                border-color: #f1403c;
                color: #f1403c;
                background: rgba(241, 64, 60, 0.1);
            }
        }    
        .time-filter-hidden-message {
            margin: 10px 0;
        }
        .time-filter-hidden-message .message-content {
            padding: 15px;
            text-align: center;
            border: 1px solid;
            border-radius: 6px;
            font-size: 14px;
            background: var(--time-filter-bg, #fff3cd);
            color: var(--time-filter-color, #856404);
            border-color: var(--time-filter-border, #ffeaa7);
        }
        @media (prefers-color-scheme: dark) {
            .time-filter-hidden-message .message-content {
                background: #332701;
                color: #f1c40f;
                border-color: #665200;
            }
        }
    `;

    // 添加样式到页面
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 在控制台输出隐藏信息
    function logHiddenContent(type, matchedText, element, reason) {
        hiddenCount++;
        const detail = {
            index: hiddenCount,
            type: type,
            matched: matchedText,
            reason: reason,
            timestamp: new Date().toLocaleTimeString(),
            element: element
        };
        hiddenDetails.push(detail);

        console.log(
            `🚫 微博内容隐藏 #${hiddenCount}\n` +
            `📌 类型: ${type}\n` +
            `🔍 匹配: "${matchedText}"\n` +
            `📝 原因: ${reason}\n` +
            `⏰ 时间: ${detail.timestamp}\n` +
            `📍 元素:`, element
        );

        // 每隐藏10条内容时输出汇总信息
        if (hiddenCount % 10 === 0) {
            const tagStats = hiddenDetails.filter(d => d.type === '推荐标签').length;
            const keywordStats = hiddenDetails.filter(d => d.type === '关键词').length;
            const idStats = hiddenDetails.filter(d => d.type === '用户ID').length;
            console.log(
                `📊 隐藏内容汇总: 已隐藏 ${hiddenCount} 条内容\n` +
                `🏷️ 推荐标签: ${tagStats} 条\n` +
                `🔤 关键词: ${keywordStats} 条\n` +
                `👤 用户ID: ${idStats} 条\n` +
                `📋 详细分布:`,
                hiddenDetails.reduce((acc, detail) => {
                    const key = detail.reason;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {})
            );
        }
    }

    // 输出脚本信息
    function logScriptInfo() {
        console.log(
            `%c🐦 微博内容综合屏蔽脚本已启动\n` +
            `🏷️ 屏蔽标签: ${HIDDEN_TAGS.join(', ')}\n` +
            `🔤 屏蔽关键词: ${keywords.length} 个\n` +
            `📱 屏蔽来源: ${sourceKeywords.length} 个\n` +
            `👤 屏蔽用户ID: ${blockedIds.length} 个\n` +
            `⏰ 时间过滤: ${timeFilterDays > 0 ? timeFilterDays + '天前' : '已禁用'}\n` +
            `📱 自动展开: ${autoExpandEnabled ? '已启用' : '未启用'}\n` +
            `🔗 WebDAV同步: ${webdavConfig.enabled ? '已启用' : '未启用'}\n` +
            `⌨️  按 F8 添加选中文本到屏蔽词\n` +
            `⌨️  按 F9 添加选中文本到来源屏蔽词\n` +
            `⏰ 启动时间: ${new Date().toLocaleString()}`,
            'background: #ff6b35; color: white; padding: 5px; border-radius: 3px;'
        );
    }

    // 显示WebDAV配置界面
    function showWebDAVConfig() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'keyword-manager-overlay';

        // 创建配置模态框
        const configModal = document.createElement('div');
        configModal.className = 'keyword-manager-modal';
        configModal.innerHTML = `
            <div class="keyword-manager">
                <h3>WebDAV同步设置</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; margin-bottom: 10px;">
                        <input type="checkbox" id="webdav-enabled" ${webdavConfig.enabled ? 'checked' : ''} style="margin-right: 8px;">
                        启用WebDAV同步
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <input type="url" id="webdav-url" placeholder="WebDAV服务器地址 (https://example.com/dav/)" 
                           value="${webdavConfig.url || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color, #ddd); border-radius: 4px; margin-bottom: 10px;">
                    <input type="text" id="webdav-username" placeholder="用户名" 
                           value="${webdavConfig.username || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color, #ddd); border-radius: 4px; margin-bottom: 10px;">
                    <input type="password" id="webdav-password" placeholder="密码" 
                           value="${webdavConfig.password || ''}" style="width: 100%; padding: 8px; border: 1px solid var(--border-color, #ddd); border-radius: 4px;">
                </div>
                <div class="button-group">
                    <button class="close-btn">取消</button>
                    <button class="save-btn">保存</button>
                </div>
                <div class="help-text">
                    <div><strong>WebDAV同步说明：</strong></div>
                    <div>• 启用后，每次修改屏蔽词会自动同步到WebDAV服务器</div>
                    <div>• 支持 Nextcloud、OwnCloud、坚果云等WebDAV服务</div>
                    <div>• 文件将保存为: weibo_blocklist.json</div>
                    <div>• 多设备使用时请注意冲突问题</div>
                </div>
            </div>
        `;

        // 保存按钮事件
        configModal.querySelector('.save-btn').addEventListener('click', function () {
            const enabled = configModal.querySelector('#webdav-enabled').checked;
            const url = configModal.querySelector('#webdav-url').value.trim();
            const username = configModal.querySelector('#webdav-username').value.trim();
            const password = configModal.querySelector('#webdav-password').value;

            webdavConfig = {
                enabled: enabled,
                url: url,
                username: username,
                password: password,
                lastSync: webdavConfig.lastSync
            };

            GM_setValue(WEBDAV_CONFIG_KEY, webdavConfig);

            // 如果启用了同步，立即执行一次同步
            if (enabled) {
                syncToWebDAV('保存配置后同步');
            }

            // 关闭配置窗口
            overlay.remove();
            configModal.remove();

            showNotification('WebDAV配置已保存' + (enabled ? '，正在同步...' : ''));
        });

        // 关闭按钮事件
        configModal.querySelector('.close-btn').addEventListener('click', function () {
            overlay.remove();
            configModal.remove();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                configModal.remove();
            }
        });

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(configModal);
    }

    // =============== WebDAV 相关逻辑 START ===============

    // 版本比较
    function compareVersion(a, b) {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const na = pa[i] || 0, nb = pb[i] || 0;
            if (na > nb) return 1;
            if (na < nb) return -1;
        }
        return 0;
    }

    // WebDAV URL 构建
    function getWebDAVUrls() {
        let base = webdavConfig.url;
        if (!base.endsWith('/')) base += '/';
        const folder = base + 'WeiboGeneralBlock/';
        const file = folder + 'weibo_blocklist.json';
        const auth = 'Basic ' + btoa(webdavConfig.username + ':' + webdavConfig.password);
        return { base, folder, file, auth };
    }

    // GM_xmlhttpRequest 封装
    function webdavRequest({ method, url, data, headers = {}, responseType }, callback) {
        GM_xmlhttpRequest({
            method,
            url,
            data,
            headers: { 'Authorization': headers.auth || getWebDAVUrls().auth, ...headers },
            responseType: responseType || 'text',
            onload: res => callback(res),
            onerror: () => callback({ status: 0, responseText: '' })
        });
    }

    // lastSync 更新
    function updateLastSync(timestamp) {
        webdavConfig.lastSync = timestamp;
        GM_setValue(WEBDAV_CONFIG_KEY, webdavConfig);
    }

    // 配置对象构造
    function createConfigObject(base = {}, reason = '手动同步') {
        return {
            ...base,
            keywords: keywords,
            blockedIds: blockedIds,
            sourceKeywords: sourceKeywords,
            timeFilterDays: timeFilterDays,
            lastModified: Date.now(),
            reason,
            timestamp: new Date().toISOString(),
            _script_version: SCRIPT_VERSION
        };
    }

    // 版本检查与自动升级
    function checkAndUpgradeVersion(remoteData) {
        if (!remoteData._script_version || remoteData._script_version === SCRIPT_VERSION) {
            console.log(`✅ 云端配置版本匹配：v${SCRIPT_VERSION}`);
            return;
        }

        const remoteVer = remoteData._script_version;
        const cmp = compareVersion(remoteVer, SCRIPT_VERSION);

        if (cmp > 0) {
            const msg = `🚨 警告：云端配置 v${remoteVer} 高于本地 v${SCRIPT_VERSION}，请升级脚本！`;
            showNotification(msg);
            console.log(msg);
        } else if (cmp < 0) {
            console.log(`⬆️ 云端配置 v${remoteVer} 较旧，自动升级中...`);
            if (!window._weibo_version_upgrading) {
                window._weibo_version_upgrading = true;
                setTimeout(() => {
                    syncToWebDAV('自动版本升级')
                        .then(() => {
                            const msg = `✅ 云端配置已升级：v${remoteVer} → v${SCRIPT_VERSION}`;
                            console.log(msg);
                            showNotification(msg);
                        })
                        .catch(() => showNotification('❌ 自动升级失败'))
                        .finally(() => window._weibo_version_upgrading = false);
                }, 1500);
            }
        }
    }

    // 合并
    function mergeFields(data) {
        let updated = false;
        ['keywords', 'blockedIds', 'sourceKeywords'].forEach(key => {
            if (Array.isArray(data[key])) {
                window[key] = data[key];
                GM_setValue(STORAGE_PREFIX + key.toLowerCase(), data[key]);
                updated = true;
            }
        });
        if (typeof data.timeFilterDays === 'number') {
            timeFilterDays = data.timeFilterDays;
            GM_setValue(TIME_FILTER_DAYS_KEY, timeFilterDays);
            updated = true;
        }
        return updated;
    }

    // 拉取同步（下载）
    function syncFromWebDAV() {
        if (!webdavConfig.enabled || !webdavConfig.url) return Promise.resolve(false);

        const { file, auth } = getWebDAVUrls();

        return new Promise(resolve => {
            webdavRequest({ method: 'GET', url: file, responseType: 'json' }, res => {
                if (res.status !== 200) {
                    if (res.status === 404) {
                        console.log('🔄 文件不存在，初始化上传');
                        syncToWebDAV('初始化同步').then(() => resolve(false));
                    } else {
                        console.error('❌ 拉取失败:', res.status);
                        resolve(false);
                    }
                    return;
                }

                let data;
                try { data = res.response || {}; } catch { data = {}; }

                const localTS = webdavConfig.lastSync || 0;
                const remoteTS = data.lastModified || 0;
                const remoteVer = data._script_version;

                // 1. 时间戳判断：是否需要下载
                const shouldDownload = remoteTS > localTS;
                // 2. 版本判断：是否需要上传（即使时间戳最新）
                const shouldUpload = remoteVer && compareVersion(remoteVer, SCRIPT_VERSION) < 0;

                let finalResolved = false;

                // === 情况1：远端时间更新 → 下载合并 ===
                if (shouldDownload) {
                    const updated = mergeFields(data);
                    if (updated) {
                        updateLastSync(remoteTS);
                        const msg = '✅ 时间戳更新：已从云端同步数据';
                        console.log(msg);
                        showNotification(msg);
                        checkAndUpgradeVersion(data); // 可能触发上传
                        resolve(true);
                        finalResolved = true;
                    }
                }

                // === 情况2：远端版本落后 → 强制上传（即使时间戳最新）===
                if (shouldUpload && !finalResolved) {
                    console.log(`⬆️ 远端版本 v${remoteVer} 落后，强制升级`);
                    syncToWebDAV('强制版本升级')
                        .then(success => {
                            if (success) {
                                showNotification(`✅ 远端配置已强制升级至 v${SCRIPT_VERSION}`);
                                // 更新 lastSync 为当前时间，防止重复触发
                                updateLastSync(Date.now());
                            }
                            resolve(success);
                        });
                    return;
                }

                // === 情况3：两者都不需要 ===
                if (!finalResolved) {
                    console.log('✅ 本地已是最新，无需操作');
                    // 仍触发版本检查（提示升级脚本）
                    if (remoteVer && compareVersion(remoteVer, SCRIPT_VERSION) > 0) {
                        const msg = `🚨 警告：云端配置 v${remoteVer} 高于本地 v${SCRIPT_VERSION}，请升级脚本！`;
                        showNotification(msg);
                        console.log(msg);
                    }
                    resolve(false);
                }
            });
        });
    }

    // 推送同步（上传）
    function syncToWebDAV(reason = '手动同步') {
        if (!webdavConfig.url || !webdavConfig.username || !webdavConfig.password) {
            console.log('请配置 WebDAV');
            return Promise.resolve();
        }

        const { folder, file, auth } = getWebDAVUrls();

        return new Promise(resolve => {
            // 确保目录
            webdavRequest({ method: 'PROPFIND', url: folder }, res => {
                if (res.status === 404) {
                    webdavRequest({ method: 'MKCOL', url: folder }, () => proceed());
                } else {
                    proceed();
                }
            });

            function proceed() {
                // 读取远端
                webdavRequest({ method: 'GET', url: file }, res => {
                    let remote = {};
                    if (res.status === 200) {
                        try { remote = JSON.parse(res.responseText) || {}; } catch { }
                    }

                    // 合并 + 上传
                    const data = createConfigObject(remote, reason);
                    webdavRequest({
                        method: 'PUT',
                        url: file,
                        data: JSON.stringify(data, null, 2),
                        headers: { 'Content-Type': 'application/json; charset=utf-8', auth }
                    }, putRes => {
                        if (putRes.status >= 200 && putRes.status < 300) {
                            updateLastSync(data.lastModified);
                            console.log('上传成功');
                            resolve(true);
                        } else {
                            console.log('上传失败:', putRes.status);
                            resolve(false);
                        }
                    });
                });
            }
        });
    }

    // =============== WebDAV 相关逻辑 END ===============

    // 强类型检查辅助函数
    function ensureArray(value, fallback = []) {
        if (Array.isArray(value)) {
            return value;
        }

        // 如果是字符串且看起来像是理由/描述，返回fallback
        if (typeof value === 'string' && (value.includes('屏蔽用户:') || value.includes('快捷键添加'))) {
            console.warn('检测到错误传递的字符串参数，使用fallback:', value);
            return Array.isArray(fallback) ? fallback : [];
        }

        // 如果是字符串，尝试按行分割
        if (typeof value === 'string') {
            return value.split('\n').filter(line => line.trim().length > 0);
        }

        // 其他情况返回空数组
        console.warn('无法修复的数据类型，返回空数组:', typeof value, value);
        return [];
    }

    // 保存关键词函数
    function saveKeywordsAndSync(newKeywords, newBlockedIds, newSourceKeywords, reason = '手动修改') {
        // ✅ 更新内存数据
        keywords = ensureArray(newKeywords, keywords);
        blockedIds = ensureArray(newBlockedIds, blockedIds);
        sourceKeywords = ensureArray(newSourceKeywords, sourceKeywords);

        // ✅ 本地保存（始终执行）
        GM_setValue(STORAGE_PREFIX + 'keywords', keywords);
        GM_setValue(STORAGE_PREFIX + 'blocked_ids', blockedIds);
        GM_setValue(STORAGE_PREFIX + 'source_keywords', sourceKeywords);
        GM_setValue(TIME_FILTER_DAYS_KEY, timeFilterDays);

        console.log(`📦 已保存到本地 (${reason})：`, {
            keywordsCount: keywords.length,
            blockedIdsCount: blockedIds.length,
            sourceKeywordsCount: sourceKeywords.length,
            timeFilterDays: timeFilterDays
        });

        // ✅ 同步到 WebDAV
        if (webdavConfig && webdavConfig.enabled) {
            syncToWebDAV(reason);
        }

        return true;
    }

    // 显示关键词管理器
    function showKeywordManager() {
        // 添加类型检查和安全处理
        if (!Array.isArray(sourceKeywords)) {
            console.warn('sourceKeywords 不是数组，正在修复:', sourceKeywords);
            sourceKeywords = Array.isArray(sourceKeywords) ? sourceKeywords : [];
            // 保存修复后的数据
            GM_setValue(STORAGE_PREFIX + 'source_keywords', sourceKeywords);
        }

        if (!Array.isArray(keywords)) {
            console.warn('keywords 不是数组，正在修复:', keywords);
            keywords = Array.isArray(keywords) ? keywords : [];
            GM_setValue(STORAGE_PREFIX + 'keywords', keywords);
        }

        if (!Array.isArray(blockedIds)) {
            console.warn('blockedIds 不是数组，正在修复:', blockedIds);
            blockedIds = Array.isArray(blockedIds) ? blockedIds : [];
            GM_setValue(STORAGE_PREFIX + 'blocked_ids', blockedIds);
        }

        // 如果已经存在，先移除
        if (keywordManager) {
            keywordManager.remove();
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'keyword-manager-overlay';


        // 在 textarea 的值设置处也要确保是数组
        const safeSourceKeywords = Array.isArray(sourceKeywords) ? sourceKeywords : [];
        const safeKeywords = Array.isArray(keywords) ? keywords : [];
        const safeBlockedIds = Array.isArray(blockedIds) ? blockedIds : [];

        // 创建管理器模态框
        const manager = document.createElement('div');
        manager.className = 'keyword-manager-modal';
        manager.innerHTML = `
            <div class="keyword-manager">
                <h3>屏蔽管理</h3>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: var(--help-color, #666);">
                    推荐标签已内置: ${HIDDEN_TAGS.join(', ')}
                </p>
                <div class="tabs">
                    <button class="tab active" data-tab="keywords">关键词屏蔽</button>
                    <button class="tab" data-tab="sources">来源屏蔽</button>
                    <button class="tab" data-tab="ids">用户ID屏蔽</button>
                </div>
                <textarea id="keywords-textarea" placeholder="每行一个关键词&#10;&#10;普通关键词示例：&#10;推广&#10;营销&#10;&#10;正则表达式示例：&#10;/推广.*活动/&#10;/\\d+元优惠/&#10;">${safeKeywords.join('\n')}</textarea>
                <textarea id="sources-textarea" placeholder="每行一个来源关键词&#10;&#10;来源关键词示例：&#10;iPhone客户端&#10;微博 weibo.com&#10;HUAWEI&#10;&#10;正则表达式示例：&#10;/iPhone.*客户端/&#10;/.*广告平台.*/" style="display: none;">${safeSourceKeywords.join('\n')}</textarea>
                <textarea id="ids-textarea" placeholder="每行一个用户ID&#10;&#10;用户ID示例：&#10;6510119885&#10;1234567890&#10;&#10;注意：用户ID是数字ID，不是昵称" style="display: none;">${safeBlockedIds.join('\n')}</textarea>
                <div class="button-group">
                    <button class="close-btn">取消</button>
                    <button class="save-btn">保存</button>
                </div>
                <div class="help-text">
                    <div id="keywords-help">
                        <div><strong>关键词屏蔽说明：</strong></div>
                        <div>• 普通关键词：直接匹配微博文本内容</div>
                        <div>• 正则表达式：用 // 包裹，如 /推广\d+元/</div>
                        <div>• 每行输入一个关键词</div>
                        <div>• 推荐标签已内置，无需重复添加</div>
                        <div>• 按 F8 键将选中文本添加到屏蔽词</div>
                    </div>
                    <div id="sources-help" style="display: none;">
                        <div><strong>来源屏蔽说明：</strong></div>
                        <div>• 每行输入一个来源关键词</div>
                        <div>• 来源通常显示在微博时间后方（如"iPhone客户端"）</div>
                        <div>• 支持正则表达式匹配</div>
                        <div>• 按 F9 键将选中文本添加到来源屏蔽词</div>
                        <div>• 可用于屏蔽特定客户端或推广来源</div>
                    </div>
                    <div id="ids-help" style="display: none;">
                        <div><strong>用户ID屏蔽说明：</strong></div>
                        <div>• 每行输入一个用户数字ID</div>
                        <div>• 用户ID可在博主主页链接中找到</div>
                        <div>• 点击微博旁的"屏蔽"按钮可快速添加用户ID</div>
                        <div>• 屏蔽后该用户的所有微博都将被隐藏</div>
                    </div>
                </div>
            </div>
        `;

        // 标签切换功能
        const tabs = manager.querySelectorAll('.tab');
        const textareas = {
            keywords: manager.querySelector('#keywords-textarea'),
            sources: manager.querySelector('#sources-textarea'),
            ids: manager.querySelector('#ids-textarea')
        };
        const helps = {
            keywords: manager.querySelector('#keywords-help'),
            sources: manager.querySelector('#sources-help'),
            ids: manager.querySelector('#ids-help')
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // 移除所有active类
                tabs.forEach(t => t.classList.remove('active'));
                // 隐藏所有文本域和帮助
                Object.values(textareas).forEach(ta => ta.style.display = 'none');
                Object.values(helps).forEach(help => help.style.display = 'none');

                // 激活当前标签
                this.classList.add('active');
                const tabType = this.dataset.tab;
                textareas[tabType].style.display = 'block';
                helps[tabType].style.display = 'block';
            });
        });

        // 保存按钮事件
        manager.querySelector('.save-btn').addEventListener('click', function () {
            const keywordsText = textareas.keywords.value;
            const sourcesText = textareas.sources.value;
            const idsText = textareas.ids.value;

            // 更新全局变量
            keywords = keywordsText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            sourceKeywords = sourcesText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            blockedIds = idsText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            saveKeywordsAndSync(keywords, blockedIds, sourceKeywords, '通过管理器修改');

            // 关闭管理器
            overlay.remove();
            manager.remove();
            keywordManager = null;

            // 重新执行屏蔽
            hideContent();

            // 强制更新页面布局
            forceLayoutUpdate();
        });

        // 关闭按钮事件
        manager.querySelector('.close-btn').addEventListener('click', function () {
            overlay.remove();
            manager.remove();
            keywordManager = null;
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                manager.remove();
                keywordManager = null;
            }
        });

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(manager);
        keywordManager = manager;

        // 聚焦到关键词文本框
        textareas.keywords.focus();
    }

    // 检查文本是否匹配关键词
    function isTextMatched(text) {
        for (const keyword of keywords) {
            if (keyword.startsWith('/') && keyword.endsWith('/')) {
                // 正则表达式
                try {
                    const pattern = keyword.slice(1, -1);
                    const regex = new RegExp(pattern);
                    if (regex.test(text)) {
                        return { type: 'regex', keyword: keyword };
                    }
                } catch (e) {
                    console.warn('无效的正则表达式:', keyword, e);
                }
            } else {
                // 普通关键词
                if (text.includes(keyword)) {
                    return { type: 'normal', keyword: keyword };
                }
            }
        }
        return null;
    }

    // 检查来源是否匹配关键词
    function isSourceMatched(sourceText) {
        for (const keyword of sourceKeywords) {
            if (keyword.startsWith('/') && keyword.endsWith('/')) {
                // 正则表达式
                try {
                    const pattern = keyword.slice(1, -1);
                    const regex = new RegExp(pattern);
                    if (regex.test(sourceText)) {
                        return { type: 'regex', keyword: keyword };
                    }
                } catch (e) {
                    console.warn('无效的正则表达式:', keyword, e);
                }
            } else {
                // 普通关键词
                if (sourceText.includes(keyword)) {
                    return { type: 'normal', keyword: keyword };
                }
            }
        }
        return null;
    }

    // 检查用户ID是否在屏蔽列表中
    function isUserIdBlocked(userId) {
        return blockedIds.includes(userId);
    }

    // 显示通知
    function showNotification(message, timeout = 3000) {
        // 备用方案：在页面右上角显示临时提示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10001;
            font-size: 14px;
            max-width: 300px;
            word-break: break-all;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, timeout);
    }

    // 处理快捷键添加屏蔽词
    function handleKeyPress(event) {
        // 检查是否按下了 F8 键（keyCode 119）
        if (event.keyCode === 119 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
            const selectedText = window.getSelection().toString().trim();

            if (selectedText && selectedText.length > 0) {
                // 防止默认行为
                event.preventDefault();
                event.stopPropagation();

                // 检查是否已存在该关键词
                if (!keywords.includes(selectedText)) {
                    // 添加到关键词列表
                    keywords.push(selectedText);
                    saveKeywordsAndSync(keywords, blockedIds, sourceKeywords, `快捷键添加: ${selectedText}`);

                    // 显示成功提示
                    showNotification(`✅ 已添加屏蔽词: "${selectedText}"`);

                    // 立即执行一次匹配处理
                    hideContent();

                    // 强制更新页面布局
                    forceLayoutUpdate();

                    console.log(`✅ 快捷键添加屏蔽关键词: "${selectedText}"`);
                } else {
                    showNotification(`ℹ️ 屏蔽词已存在: "${selectedText}"`);
                }
            } else {
                showNotification('⚠️ 请先选择要屏蔽的文本');
            }
        }

        // 检查是否按下了 F9 键（keyCode 120）
        if (event.keyCode === 120 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
            const selectedText = window.getSelection().toString().trim();

            if (selectedText && selectedText.length > 0) {
                // 防止默认行为
                event.preventDefault();
                event.stopPropagation();

                // 检查是否已存在该来源关键词
                if (!sourceKeywords.includes(selectedText)) {
                    // 添加到来源关键词列表
                    const newSourceKeywords = [...sourceKeywords, selectedText];
                    saveKeywordsAndSync(keywords, blockedIds, newSourceKeywords, `快捷键添加来源: ${selectedText}`);

                    // 显示成功提示
                    showNotification(`✅ 已添加来源屏蔽词: "${selectedText}"`);

                    // 立即执行一次匹配处理
                    hideContent();

                    // 强制更新页面布局
                    forceLayoutUpdate();

                    console.log(`✅ 快捷键添加来源屏蔽关键词: "${selectedText}"`);
                } else {
                    showNotification(`ℹ️ 来源屏蔽词已存在: "${selectedText}"`);
                }
            } else {
                showNotification('⚠️ 请先选择要屏蔽的来源文本');
            }
        }
    }

    // 添加屏蔽按钮到用户名称旁
    function addBlockButtons() {
        // 如果设置为不显示按钮,直接返回
        if (!showBlockButton) {
            return;
        }

        const feedItems = document.querySelectorAll('.Feed_body_3R0rO');

        feedItems.forEach((feedItem) => {
            if (feedItem.querySelector('.weibo-block-btn')) return;

            // 直接找到用户名链接
            const userLink = feedItem.querySelector('a.head_name_24eEB[usercard]');
            if (!userLink) return;

            const userId = userLink.getAttribute('usercard');
            let userName = '未知用户';
            const userSpan = userLink.querySelector('span');
            if (userSpan) {
                userName = userSpan.getAttribute('title') || userSpan.textContent || userName;
            }

            if (!userId) return;

            // 创建屏蔽按钮
            const blockBtn = document.createElement('button');
            blockBtn.className = 'weibo-block-btn';
            blockBtn.textContent = '屏蔽';
            blockBtn.title = `屏蔽用户 ${userName} (ID: ${userId})`;
            blockBtn.style.cssText = `
                padding: 2px 8px;
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                background: transparent;
                color: #8590a6;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                margin-left: 8px;
                vertical-align: middle;
            `;

            // 悬停效果
            blockBtn.addEventListener('mouseenter', () => {
                blockBtn.style.borderColor = '#f1403c';
                blockBtn.style.color = '#f1403c';
                blockBtn.style.background = 'rgba(241, 64, 60, 0.05)';
            });

            blockBtn.addEventListener('mouseleave', () => {
                blockBtn.style.borderColor = '#d0d0d0';
                blockBtn.style.color = '#8590a6';
                blockBtn.style.background = 'transparent';
            });

            // 按钮点击事件
            blockBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 添加用户ID到屏蔽列表
                if (!blockedIds.includes(userId)) {
                    const newBlockedIds = [...blockedIds, userId];
                    saveKeywordsAndSync(keywords, newBlockedIds, sourceKeywords, `屏蔽用户: ${userName}`);

                    console.log(`✅ 已屏蔽用户: "${userName}" (ID: ${userId})`);

                    // 显示成功提示
                    showNotification(`已屏蔽用户: ${userName}`);

                    // 调用 hideContent 统一处理屏蔽逻辑
                    hideContent();

                    // 强制更新页面布局
                    forceLayoutUpdate();
                } else {
                    showNotification(`用户 ${userName} 已在屏蔽列表中`);
                }
            });

            // 直接将按钮插入到用户名链接的后面
            userLink.parentNode.insertBefore(blockBtn, userLink.nextSibling);
        });

        // 为评论区添加屏蔽按钮
        addCommentBlockButtons();
    }

    // 为评论区用户添加屏蔽按钮
    function addCommentBlockButtons() {
        // 查找所有评论区容器
        const commentFeeds = document.querySelectorAll('[class*="RepostCommentFeed_"], [class*="RepostCommentList_"]');

        commentFeeds.forEach(feed => {
            // 查找该评论区内的所有评论项
            const commentItems = feed.querySelectorAll('.wbpro-list');

            commentItems.forEach(item => {
                // 检查是否已经添加过按钮
                if (item.querySelector('.weibo-block-btn')) {
                    return;
                }

                // 查找评论中的用户链接
                const userLink = item.querySelector('a[usercard]');
                if (!userLink) return;

                const userId = userLink.getAttribute('usercard');
                if (!userId) return;

                // 获取用户名
                let userName = userLink.textContent.trim() || '未知用户';

                // 创建屏蔽按钮
                const blockBtn = document.createElement('button');
                blockBtn.className = 'weibo-block-btn weibo-block-btn-comment';
                blockBtn.textContent = '屏蔽';
                blockBtn.title = `屏蔽用户 ${userName} (ID: ${userId})`;
                blockBtn.style.cssText = `
                    padding: 1px 6px;
                    border: 1px solid #d0d0d0;
                    border-radius: 3px;
                    background: transparent;
                    color: #8590a6;
                    font-size: 11px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex-shrink: 0;
                    margin-left: 5px;
                `;

                // 悬停效果
                blockBtn.addEventListener('mouseenter', () => {
                    blockBtn.style.borderColor = '#f1403c';
                    blockBtn.style.color = '#f1403c';
                    blockBtn.style.background = 'rgba(241, 64, 60, 0.05)';
                });

                blockBtn.addEventListener('mouseleave', () => {
                    blockBtn.style.borderColor = '#d0d0d0';
                    blockBtn.style.color = '#8590a6';
                    blockBtn.style.background = 'transparent';
                });

                // 按钮点击事件
                blockBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    // 添加用户ID到屏蔽列表
                    if (!blockedIds.includes(userId)) {
                        const newBlockedIds = [...blockedIds, userId];
                        saveKeywordsAndSync(keywords, newBlockedIds, sourceKeywords, `屏蔽评论用户: ${userName}`);

                        console.log(`✅ 已屏蔽评论用户: "${userName}" (ID: ${userId})`);

                        // 显示成功提示
                        showNotification(`已屏蔽用户: ${userName}`);

                        // 调用 hideContent 统一处理屏蔽逻辑
                        hideContent();

                        // 强制更新页面布局
                        forceLayoutUpdate();
                    } else {
                        showNotification(`用户 ${userName} 已在屏蔽列表中`);
                    }
                });

                // 创建评论区按钮容器
                const commentButtonContainer = document.createElement('div');
                commentButtonContainer.className = 'weibo-block-button-container';
                commentButtonContainer.style.cssText = `
                    display: inline-block;
                    margin-left: 5px;
                    vertical-align: middle;
                `;

                commentButtonContainer.appendChild(blockBtn);

                // 阻止容器的点击事件冒泡
                commentButtonContainer.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                // 将按钮容器添加到用户链接后面
                userLink.parentNode.insertBefore(commentButtonContainer, userLink.nextSibling);
            });
        });
    }

    // 强制更新页面布局
    function forceLayoutUpdate() {
        // 方法1: 触发resize事件（最温和的方式）
        window.dispatchEvent(new Event('resize'));

        // 方法2: 使用requestAnimationFrame确保渲染完成
        requestAnimationFrame(() => {
            // 触发回流但不改变滚动位置
            document.body.offsetHeight;
        });

        // 方法3: 微调一个隐藏元素来触发重排
        const trigger = document.createElement('div');
        trigger.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
        document.body.appendChild(trigger);
        trigger.offsetHeight;
        document.body.removeChild(trigger);
    }

    // 修改用户ID屏蔽逻辑
    function hideContent() {
        // 先添加屏蔽按钮
        addBlockButtons();
        // 方法1: 通过推荐标签屏蔽
        hideByTags();
        // 方法2: 通过关键词屏蔽
        hideByKeywords();
        // 方法3: 通过用户ID屏蔽
        hideByUserId();
        // 方法4: 通过来源关键词屏蔽
        hideBySourceKeywords();
        // 方法5: 通过时间过滤屏蔽
        hideByTimeFilter();
        // 方法6: 屏蔽评论区用户
        hideCommentsByUserId();
        // 强制更新页面布局
        forceLayoutUpdate();
    }

    // 判断当前页面是否为热搜页
    function isHotWeiboPage() {
        return location.pathname.startsWith('/hot/weibo/');
    }

    // 通过时间过滤屏蔽
    function hideByTimeFilter() {
        // 只在热搜页执行
        if (!isHotWeiboPage()) {
            return;
        }

        const feedBodies = document.querySelectorAll('.Feed_body_3R0rO');

        feedBodies.forEach(feedBody => {
            // 跳过已经被隐藏的内容，检查是否已处理
            if (feedBody.classList.contains('custom-hidden') || isProcessed(feedBody, 'time')) {
                return;
            }

            if (isWeiboTooOld(feedBody)) {
                feedBody.classList.add('custom-hidden');
                markAsProcessed(feedBody, 'time'); // 标记已处理

                // 隐藏所有同级子元素
                const parent = feedBody.parentElement;
                Array.from(parent.children).forEach(child => {
                    if (!child.classList.contains('custom-hidden-message') &&
                        !child.classList.contains('time-filter-hidden-message')) {
                        child.style.display = 'none';
                    }
                });

                // 根据设置决定是否显示占位块
                if (showPlaceholder) {
                    const message = document.createElement('div');
                    message.className = 'time-filter-hidden-message';
                    message.innerHTML = `
                    <div class="message-content">
                        ⏰ 已隐藏 ${timeFilterDays} 天前的微博
                    </div>
                `;
                    parent.appendChild(message);
                } else {
                    // 使用最小化占位符
                    const placeholder = document.createElement('div');
                    placeholder.className = 'time-filter-hidden-message minimal-placeholder';
                    placeholder.style.cssText = 'height: 0px; margin: 0; padding: 0; overflow: hidden;';
                    parent.appendChild(placeholder);
                }

                // 记录到控制台
                logHiddenContent('时间过滤', `${timeFilterDays}天前`, feedBody, '时间过滤');
            }
        });
    }

    // 通过标签屏蔽
    function hideByTags() {
        const tags = Array.from(document.querySelectorAll('*[class], [node-type="feed_list_top"]')).filter(el =>
            Array.from(el.classList).some(c => c.startsWith('wbpro-tag')) || el.getAttribute('node-type') === 'feed_list_top'
        );
        tags.forEach(tag => {
            const tagText = tag.textContent.trim();

            // 检查是否包含隐藏关键词
            const matchesKeyword = HIDDEN_TAGS.some(keyword => tagText.includes(keyword));

            // 检查是否包含 base64 图片
            const img = tag.querySelector('img');
            const hasBase64Img = img && img.src.startsWith('data:image/');

            if (matchesKeyword || hasBase64Img) {
                // 找到 Feed_body_3R0rO 元素
                const feedBody = tag.closest('.woo-panel-main')?.querySelector('.Feed_body_3R0rO') ||
                    tag.closest('.WB_cardwrap')?.querySelector('.Feed_body_3R0rO');

                // ✅ 检查是否已处理
                if (feedBody && !feedBody.classList.contains('custom-hidden') && !isProcessed(feedBody, 'tag')) {
                    feedBody.classList.add('custom-hidden');
                    markAsProcessed(feedBody, 'tag'); // 标记已处理

                    // 获取原文文本
                    let originalText = "";
                    const contentEl = feedBody.querySelector('.wbpro-feed-content .detail_text_1U10O .detail_wbtext_4CRf9');
                    if (contentEl) {
                        originalText = contentEl.textContent.trim();
                    }

                    // 隐藏所有同级子元素
                    const parent = feedBody.parentElement;
                    Array.from(parent.children).forEach(child => {
                        if (!child.classList.contains('custom-hidden-message')) {
                            child.style.display = 'none';
                        }
                    });

                    // 根据设置决定是否显示占位块
                    if (showPlaceholder) {
                        // 创建提示元素并添加到父容器
                        const message = document.createElement('div');
                        message.className = 'custom-hidden-message';
                        message.innerHTML = `
                            <div class="message-content">
                                已隐藏包含"${tagText}"标签的内容 ${hasBase64Img ? "(含 Base64 图片标签,通常是广告)" : ""}
                            </div>
                        `;
                        parent.appendChild(message);
                    } else {
                        // 使用最小化占位符
                        const placeholder = document.createElement('div');
                        placeholder.className = 'custom-hidden-message minimal-placeholder';
                        placeholder.style.cssText = 'height: 0px; margin: 0; padding: 0; overflow: hidden;';
                        parent.appendChild(placeholder);
                    }

                    // 控制台记录
                    console.group("屏蔽内容信息");
                    console.log("标签:", tagText);
                    if (hasBase64Img) console.log("包含 Base64 图片");
                    console.log("原文内容:", originalText);
                    console.groupEnd();
                }
            }
        });
    }

    // 通过关键词屏蔽
    function hideByKeywords() {
        const feedContents = document.querySelectorAll('.wbpro-feed-content, .weibo-text');
        feedContents.forEach(feedContent => {
            const contentText = feedContent.textContent.trim();
            const matchResult = isTextMatched(contentText);

            if (matchResult) {
                // 找到 Feed_body_3R0rO 元素
                const feedBody = feedContent.closest('.Feed_body_3R0rO');
                // 检查是否已处理
                if (feedBody && !feedBody.classList.contains('custom-hidden') && !isProcessed(feedBody, 'keyword')) {
                    feedBody.classList.add('custom-hidden');
                    markAsProcessed(feedBody, 'keyword'); // 标记已处理

                    let displayKeyword = matchResult.keyword;
                    let displayType = '关键词';

                    if (matchResult.type === 'regex') {
                        displayKeyword = `正则: ${matchResult.keyword}`;
                    }

                    // 隐藏所有同级子元素
                    const parent = feedBody.parentElement;
                    Array.from(parent.children).forEach(child => {
                        if (!child.classList.contains('custom-hidden-message')) {
                            child.style.display = 'none';
                        }
                    });

                    // 根据设置决定是否显示占位块
                    if (showPlaceholder) {
                        // 创建提示元素并添加到父容器
                        const message = document.createElement('div');
                        message.className = 'custom-hidden-message';
                        message.innerHTML = `
                            <div class="message-content">
                                已隐藏包含${displayType}"${displayKeyword}"的内容
                            </div>
                        `;
                        parent.appendChild(message);
                    } else {
                        // 使用最小化占位符
                        const placeholder = document.createElement('div');
                        placeholder.className = 'custom-hidden-message minimal-placeholder';
                        placeholder.style.cssText = 'height: 0px; margin: 0; padding: 0; overflow: hidden;';
                        parent.appendChild(placeholder);
                    }

                    // 记录到控制台
                    logHiddenContent('关键词', contentText.substring(0, 50) + '...', feedBody, `${matchResult.type}: ${matchResult.keyword}`);
                }
            }
        });
    }

    // 通过用户ID屏蔽
    function hideByUserId() {
        const userLinks = document.querySelectorAll('a[usercard], [usercard] a');
        userLinks.forEach(userLink => {
            const userId = userLink.getAttribute('usercard');
            let userName = '未知用户';

            // 获取用户名称
            const nameSpan = userLink.querySelector('span');
            if (nameSpan) {
                userName = nameSpan.getAttribute('title') || nameSpan.textContent || userName;
            }

            if (userId && isUserIdBlocked(userId)) {
                // 找到 Feed_body_3R0rO 元素
                const feedBody = userLink.closest('.Feed_body_3R0rO');
                // 检查是否已处理
                if (feedBody && !feedBody.classList.contains('custom-hidden') && !isProcessed(feedBody, 'userid')) {
                    feedBody.classList.add('custom-hidden');
                    markAsProcessed(feedBody, 'userid'); // 标记已处理

                    // 隐藏所有同级子元素
                    const parent = feedBody.parentElement;
                    Array.from(parent.children).forEach(child => {
                        if (!child.classList.contains('custom-hidden-message')) {
                            child.style.display = 'none';
                        }
                    });

                    // 根据设置决定是否显示占位块
                    if (showPlaceholder) {
                        // 创建提示元素并添加到父容器
                        const message = document.createElement('div');
                        message.className = 'custom-hidden-message';
                        message.innerHTML = `
                        <div class="message-content">
                             已隐藏屏蔽用户: ${userName} (ID: ${userId})
                        </div>
                    `;
                        parent.appendChild(message);
                    } else {
                        // 使用最小化占位符
                        const placeholder = document.createElement('div');
                        placeholder.className = 'custom-hidden-message minimal-placeholder';
                        placeholder.style.cssText = 'height: 0px; margin: 0; padding: 0; overflow: hidden;';
                        parent.appendChild(placeholder);
                    }

                    // 记录到控制台
                    logHiddenContent('用户ID', userId, feedBody, `屏蔽用户: ${userName}`);
                }
            }
        });
    }

    // 通过来源关键词屏蔽
    function hideBySourceKeywords() {
        const sourceTags = document.querySelectorAll('.head-info_cut_1tPQI.head-info_source_2zcEX');
        sourceTags.forEach(sourceTag => {
            const sourceText = sourceTag.textContent.trim();
            const matchResult = isSourceMatched(sourceText);

            if (matchResult) {
                // 找到 Feed_body_3R0rO 元素
                const feedBody = sourceTag.closest('.Feed_body_3R0rO');
                // 检查是否已处理
                if (feedBody && !feedBody.classList.contains('custom-hidden') && !isProcessed(feedBody, 'source')) {
                    feedBody.classList.add('custom-hidden');
                    markAsProcessed(feedBody, 'source'); // 标记已处理

                    let displayKeyword = matchResult.keyword;
                    let displayType = '来源';

                    if (matchResult.type === 'regex') {
                        displayKeyword = `正则: ${matchResult.keyword}`;
                    }

                    // 隐藏所有同级子元素
                    const parent = feedBody.parentElement;
                    Array.from(parent.children).forEach(child => {
                        if (!child.classList.contains('custom-hidden-message')) {
                            child.style.display = 'none';
                        }
                    });

                    // 根据设置决定是否显示占位块
                    if (showPlaceholder) {
                        // 创建提示元素并添加到父容器
                        const message = document.createElement('div');
                        message.className = 'custom-hidden-message';
                        message.innerHTML = `
                        <div class="message-content">
                            已隐藏来源包含${displayType}"${displayKeyword}"的内容
                        </div>
                    `;
                        parent.appendChild(message);
                    } else {
                        // 使用最小化占位符
                        const placeholder = document.createElement('div');
                        placeholder.className = 'custom-hidden-message minimal-placeholder';
                        placeholder.style.cssText = 'height: 0px; margin: 0; padding: 0; overflow: hidden;';
                        parent.appendChild(placeholder);
                    }

                    // 记录到控制台
                    logHiddenContent('来源', sourceText, feedBody, `${matchResult.type}: ${matchResult.keyword}`);
                }
            }
        });
    }

    // 屏蔽评论区用户
    function hideCommentsByUserId() {
        // 查找所有评论区容器（支持两种类型）
        const commentFeeds = document.querySelectorAll('[class*="RepostCommentFeed_"], [class*="RepostCommentList_"]');

        commentFeeds.forEach(feed => {
            // 查找该评论区内的所有评论项
            const commentItems = feed.querySelectorAll('.wbpro-list');

            commentItems.forEach(item => {
                // 查找用户链接
                const userLink = item.querySelector('a[usercard]');

                if (userLink) {
                    const userId = userLink.getAttribute('usercard');

                    if (userId && isUserIdBlocked(userId)) {
                        // 检查是否已经被隐藏
                        if (!item.classList.contains('custom-hidden-comment')) {
                            item.classList.add('custom-hidden-comment');

                            // 获取用户名
                            let userName = '未知用户';
                            const nameElement = userLink.textContent.trim();
                            if (nameElement) {
                                userName = nameElement;
                            }

                            // 根据设置决定是否显示占位块
                            if (showPlaceholder) {
                                // 隐藏原内容但保留容器
                                Array.from(item.children).forEach(child => {
                                    child.style.display = 'none';
                                });

                                // 添加提示信息
                                const message = document.createElement('div');
                                message.className = 'custom-hidden-message';
                                message.innerHTML = `
                                <div class="message-content" style="padding: 8px; font-size: 12px;">
                                    已隐藏用户评论: ${userName} (ID: ${userId})
                                </div>
                            `;
                                item.appendChild(message);
                            } else {
                                // 完全隐藏
                                item.style.display = 'none';
                            }

                            // 记录到控制台
                            logHiddenContent('评论区用户ID', userId, item, `屏蔽评论用户: ${userName}`);
                        }
                    }
                }
            });
        });
    }

    // 显示显示设置界面
    function showDisplaySettings() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'keyword-manager-overlay';

        // 创建设置模态框
        const settingsModal = document.createElement('div');
        settingsModal.className = 'keyword-manager-modal';
        settingsModal.innerHTML = `
            <div class="keyword-manager">
                <h3>显示设置</h3>
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; margin-bottom: 10px;">
                        <input type="checkbox" id="show-block-button" ${showBlockButton ? 'checked' : ''} style="margin-right: 8px;">
                        显示用户名旁边的屏蔽按钮
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 10px;">
                        <input type="checkbox" id="show-placeholder" ${showPlaceholder ? 'checked' : ''} style="margin-right: 8px;">
                        显示已屏蔽微博的占位块
                    </label>
                </div>
                <div class="button-group">
                    <button class="close-btn">取消</button>
                    <button class="save-btn">保存</button>
                </div>
                <div class="help-text">
                    <div><strong>设置说明:</strong></div>
                    <div>• 屏蔽按钮: 在用户名旁显示"屏蔽"按钮,方便快速屏蔽用户</div>
                    <div>• 占位块: 被屏蔽的微博会显示灰色提示框,取消则完全隐藏</div>
                </div>
            </div>
        `;

        // 保存按钮事件
        settingsModal.querySelector('.save-btn').addEventListener('click', function () {
            const newShowBlockButton = settingsModal.querySelector('#show-block-button').checked;
            const newShowPlaceholder = settingsModal.querySelector('#show-placeholder').checked;

            showBlockButton = newShowBlockButton;
            showPlaceholder = newShowPlaceholder;

            GM_setValue(STORAGE_PREFIX + 'show_block_button', showBlockButton);
            GM_setValue(STORAGE_PREFIX + 'show_placeholder', showPlaceholder);

            // 关闭设置窗口
            overlay.remove();
            settingsModal.remove();

            showNotification('显示设置已保存');

            // 重新执行屏蔽以应用新设置
            location.reload(); // 刷新页面以应用新设置
        });

        // 关闭按钮事件
        settingsModal.querySelector('.close-btn').addEventListener('click', function () {
            overlay.remove();
            settingsModal.remove();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                settingsModal.remove();
            }
        });

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(settingsModal);
    }

    // 显示时间过滤配置界面函数
    function showTimeFilterConfig() {
        const overlay = document.createElement('div');
        overlay.className = 'keyword-manager-overlay';

        const configModal = document.createElement('div');
        configModal.className = 'keyword-manager-modal';
        configModal.innerHTML = `
        <div class="keyword-manager">
            <h3>设置时间过滤</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">
                    隐藏多少天之前的微博：
                </label>
                <input type="number" id="time-filter-days" 
                    value="${timeFilterDays}" 
                    min="0" max="3650" 
                    style="width: 100%; padding: 8px; border: 1px solid var(--border-color, #ddd); border-radius: 4px; background: var(--input-bg, white); color: var(--input-color, #333);">
            </div>
            <div class="button-group">
                <button class="close-btn">取消</button>
                <button class="save-btn">保存</button>
            </div>
            <div class="help-text">
                <div><strong>时间过滤说明：</strong></div>
                <div>• 设置隐藏多少天之前的微博</div>
                <div>• 设置为 0 表示禁用时间过滤</div>
                <div>• 基于微博的发布时间进行过滤</div>
                <div>• 对首页的所有微博生效</div>
            </div>
        </div>
    `;

        configModal.querySelector('.save-btn').addEventListener('click', function () {
            const daysInput = configModal.querySelector('#time-filter-days');
            const newDays = parseInt(daysInput.value);

            if (!isNaN(newDays) && newDays >= 0) {
                timeFilterDays = newDays;
                GM_setValue(TIME_FILTER_DAYS_KEY, timeFilterDays);

                overlay.remove();
                configModal.remove();

                showNotification(`时间过滤已设置为: ${timeFilterDays}天`);

                // 重新执行屏蔽
                hideContent();
            } else {
                showNotification('请输入有效的天数');
            }
        });

        configModal.querySelector('.close-btn').addEventListener('click', function () {
            overlay.remove();
            configModal.remove();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                configModal.remove();
            }
        });

        document.body.appendChild(overlay);
        document.body.appendChild(configModal);

        // 聚焦到输入框并选中文本
        const input = configModal.querySelector('#time-filter-days');
        input.focus();
        input.select();
    }

    // 时间过滤检查函数
    function isWeiboTooOld(feedBody) {
        if (timeFilterDays <= 0) return false;

        // 查找时间链接元素
        const timeLink = feedBody.querySelector('a[class*="head-info_time"]');
        if (!timeLink) return false;

        const dateString = timeLink.getAttribute('title');
        if (!dateString) return false;

        try {
            const weiboDate = new Date(dateString);
            const currentDate = new Date();
            const timeDiff = currentDate - weiboDate;
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            return daysDiff > timeFilterDays;
        } catch (e) {
            console.warn('解析日期失败:', dateString, e);
            return false;
        }
    }

    // 为元素添加已处理标记
    function markAsProcessed(element, type) {
        if (!element.dataset.blockProcessed) {
            element.dataset.blockProcessed = '';
        }
        element.dataset.blockProcessed += type + ',';
    }

    function isProcessed(element, type) {
        return element.dataset.blockProcessed && element.dataset.blockProcessed.includes(type + ',');
    }

    // 标记按钮处理状态
    function markButtonAsProcessed(button, type) {
        button.dataset.autoExpandProcessed = type;
    }

    // 标记按钮处理状态
    function isButtonProcessed(button, type) {
        return button.dataset.autoExpandProcessed === type;
    }

    // 点击展开按钮
    function clickExpandButtons() {
        if (!autoExpandEnabled) return;

        const expandButtons = document.querySelectorAll('.expand');
        let clickCount = 0;

        expandButtons.forEach(button => {
            if (button.offsetParent !== null &&
                !button.classList.contains('clicked') &&
                !isButtonProcessed(button, 'expanded')) {

                button.click();
                button.classList.add('clicked');
                markButtonAsProcessed(button, 'expanded');
                clickCount++;
            }
        });

        if (clickCount > 0) {
            console.log(`📱 自动展开: 已点击 ${clickCount} 个展开按钮`);
            setTimeout(hideCollapseButtons, 800);
        }
    }

    // 隐藏收起按钮
    function hideCollapseButtons() {
        if (!autoExpandEnabled) return;

        const collapseButtons = document.querySelectorAll('.collapse');
        collapseButtons.forEach(btn => {
            if (!isButtonProcessed(btn, 'hidden')) {
                btn.style.display = 'none';
                btn.style.visibility = 'hidden';
                markButtonAsProcessed(btn, 'hidden');
            }
        });
    }

    // 初始化自动展开功能
    function initAutoExpand() {
        if (!autoExpandEnabled) return;

        // 初始执行
        clickExpandButtons();
        hideCollapseButtons();

        // 设置定时检查
        setInterval(() => {
            clickExpandButtons();
            hideCollapseButtons();
        }, 2000);

        console.log('📱 微博自动展开功能已启用');
    }

    // 显示自动展开设置界面
    function showAutoExpandSettings() {
        const overlay = document.createElement('div');
        overlay.className = 'keyword-manager-overlay';

        const settingsModal = document.createElement('div');
        settingsModal.className = 'keyword-manager-modal';
        settingsModal.innerHTML = `
        <div class="keyword-manager">
            <h3>自动展开设置</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px;">
                    <input type="checkbox" id="auto-expand-enabled" ${autoExpandEnabled ? 'checked' : ''} style="margin-right: 8px;">
                    启用微博自动展开功能
                </label>
            </div>
            <div class="button-group">
                <button class="close-btn">取消</button>
                <button class="save-btn">保存</button>
            </div>
            <div class="help-text">
                <div><strong>自动展开说明:</strong></div>
                <div>• 启用后会自动点击微博的"展开"按钮显示完整内容</div>
                <div>• 同时会自动隐藏"收起"按钮避免界面混乱</div>
                <div>• 适用于长微博、多图微博等被折叠的内容</div>
                <div>• 默认关闭，需要手动开启</div>
            </div>
        </div>
    `;

        // 保存按钮事件
        settingsModal.querySelector('.save-btn').addEventListener('click', function () {
            const newAutoExpandEnabled = settingsModal.querySelector('#auto-expand-enabled').checked;

            autoExpandEnabled = newAutoExpandEnabled;
            GM_setValue(STORAGE_PREFIX + 'auto_expand', autoExpandEnabled);

            // 关闭设置窗口
            overlay.remove();
            settingsModal.remove();

            showNotification(`自动展开功能已${autoExpandEnabled ? '启用' : '禁用'}`);

            // 如果启用，重新初始化自动展开
            if (autoExpandEnabled) {
                initAutoExpand();
            } else {
                // 如果禁用，恢复收起按钮的显示
                const collapseButtons = document.querySelectorAll('.collapse');
                collapseButtons.forEach(btn => {
                    btn.style.display = '';
                    btn.style.visibility = '';
                    delete btn.dataset.autoExpandProcessed;
                });

                // 清除展开按钮的标记
                const expandButtons = document.querySelectorAll('.expand');
                expandButtons.forEach(btn => {
                    btn.classList.remove('clicked');
                    delete btn.dataset.autoExpandProcessed;
                });
            }
        });

        // 关闭按钮事件
        settingsModal.querySelector('.close-btn').addEventListener('click', function () {
            overlay.remove();
            settingsModal.remove();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
                settingsModal.remove();
            }
        });

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(settingsModal);
    }

    // 使用防抖避免频繁执行
    let timeoutId;
    function debouncedHide() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(hideContent, 100);
    }

    // 初始化
    function init() {
        // 初始化时进行全局类型检查
        keywords = ensureArray(keywords, DEFAULT_KEYWORDS);
        blockedIds = ensureArray(blockedIds, DEFAULT_BLOCKED_IDS);
        sourceKeywords = ensureArray(sourceKeywords, DEFAULT_SOURCE_KEYWORDS);

        // 保存修复后的数据
        GM_setValue(STORAGE_PREFIX + 'keywords', keywords);
        GM_setValue(STORAGE_PREFIX + 'blocked_ids', blockedIds);
        GM_setValue(STORAGE_PREFIX + 'source_keywords', sourceKeywords);

        // 输出脚本启动信息
        logScriptInfo();

        // 添加键盘事件监听
        document.addEventListener('keydown', handleKeyPress);

        // 页面加载时执行一次WebDAV同步检查
        if (webdavConfig.enabled) {
            console.log('🔗 检查WebDAV同步...');
            syncFromWebDAV().then(synced => {
                if (synced) {
                    // 如果同步了新的数据，重新执行屏蔽
                    hideContent();
                }
            });
        }

        // 页面加载时执行一次
        hideContent();

        // 监听DOM变化（使用防抖）
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let shouldAutoExpand = false;

            for (const mutation of mutations) {
                // 只处理新增的 Feed 节点
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            // 检查是否是微博内容节点
                            if (node.classList && (
                                node.classList.contains('Feed_body_3R0rO') ||
                                node.querySelector('.Feed_body_3R0rO')
                            )) {
                                shouldProcess = true;
                            }
                            // 检查是否有展开按钮
                            if (autoExpandEnabled && (
                                node.classList && node.classList.contains('expand') ||
                                (node.querySelector && node.querySelector('.expand'))
                            )) {
                                shouldAutoExpand = true;
                            }
                        }
                    }
                }
                if (shouldProcess || shouldAutoExpand) break;
            }

            if (shouldProcess) {
                debouncedHide();
            }
            if (shouldAutoExpand) {
                clickExpandButtons();
                hideCollapseButtons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false, // 不监听属性变化
            characterData: false // ✅ 不监听文本变化
        });

        // 初始化自动展开功能
        initAutoExpand();

        // 添加全局函数以便在控制台手动查看统计
        window.getHiddenStats = function () {
            const tagStats = hiddenDetails.filter(d => d.type === '推荐标签').length;
            const keywordStats = hiddenDetails.filter(d => d.type === '关键词').length;
            const idStats = hiddenDetails.filter(d => d.type === '用户ID').length;

            console.log(
                `%c📊 微博内容隐藏统计\n` +
                `📈 总共隐藏: ${hiddenCount} 条内容\n` +
                `🏷️ 推荐标签: ${tagStats} 条\n` +
                `🔤 关键词: ${keywordStats} 条\n` +
                `👤 用户ID: ${idStats} 条\n` +
                `📋 详细分布:`,
                'background: #4CAF50; color: white; padding: 5px; border-radius: 3px;',
                hiddenDetails.reduce((acc, detail) => {
                    const key = detail.reason;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {})
            );
            console.log('📋 完整记录:', hiddenDetails);
        };

        // 添加重置统计的函数
        window.resetHiddenStats = function () {
            hiddenCount = 0;
            hiddenDetails.length = 0;
            console.log('🔄 隐藏统计已重置');
        };

        console.log(
            `💡 提示: 在控制台使用以下命令:\n` +
            `   getHiddenStats() - 查看隐藏统计\n` +
            `   resetHiddenStats() - 重置统计计数\n` +
            `💡 功能: 按 F8 将选中文本添加到屏蔽词\n` +
            `💡 功能: 按 F9 将选中文本添加到来源屏蔽词\n` +
            `💡 功能: 点击用户名称旁的"屏蔽"按钮屏蔽该用户\n` +
            `💡 功能: 自动展开${autoExpandEnabled ? '已启用' : '未启用，可在菜单中开启'}`
        );
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();