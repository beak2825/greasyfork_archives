// ==UserScript==
// @name         OpenList中国移动云盘更新脚本
// @namespace    https://github.com/WooHooDai
// @version      1.0
// @description  自动获取中国移动云盘的Authorization，并更新到OpenList中
// @license MIT
// @match        https://yun.139.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557673/OpenList%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8%E4%BA%91%E7%9B%98%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557673/OpenList%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8%E4%BA%91%E7%9B%98%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/**
 * ============================================================================
 * 使用说明
 * ============================================================================
 *
 * 【功能说明】
 * - 打开中国移动云盘网页时，自动获取 Authorization，并同步到 OpenList 中；
 * - 配合插件 Check酱，定时打开中国移动云盘网页，即可实现全自动刷新
 * - 若不想使用其他插件，可以保持中国移动云盘网页打开，同时打开本脚本的自动刷新配置
 *
 * 【使用方法】
 * 1. 首次使用：右键点击浏览器扩展栏的 Tampermonkey 图标 -> "配置脚本" 进行配置
 * 2. 访问 https://yun.139.com/，若未登录完成登录即可
 * 3. 脚本会自动捕获 Authorization 并发送到 OpenList
 *
 * 【配置说明】
 *
 * 敏感信息：通过右键菜单 -> "配置脚本" 进行配置：
 * - 【必填】API_URL: OpenList的API地址，如：'http://localhost:6999/api/admin/storage/update'
 * - 【必填】API_AUTH: OpenList的令牌（查看路径：管理后台 -> 设置 -> 其他 -> 页面最底部）
 * - 【可选】自动刷新: 是否启用页面自动刷新
 * - 【可选】刷新间隔: 自动刷新间隔（分钟）
 * - 此方式避免敏感信息暴露在源代码中
 *
 * 中国移动云盘存储配置
 * - 查看路径：数据库data.db -> 表x_storages）
 * - 需要在下方源代码的配置区域中配置
 * - ⚠️注意：要填写完整，留空会导致该配置被重置为空或默认值
 *
 * 【控制台信息】
 * - [CaptureAuth] Script initialized - 脚本初始化成功
 * - [CaptureAuth] Authorization captured: xxx - 捕获到授权信息
 * - [CaptureAuth] Successfully sent to server - 发送成功
 * - [CaptureAuth] Request failed: xxx - 发送失败（查看错误信息）
 *
 * ============================================================================
 */

(function () {
    'use strict';

    // ==================== 配置区域 ====================

    /**
     * 从存储中读取配置，如果不存在则使用默认值
     * 敏感信息（API_AUTH）不会硬编码在脚本中，需要用户通过配置菜单设置
     */
    function getConfig() {
        // 默认配置（非敏感信息可以保留）
        const defaultConfig = {
            API_URL: 'http://localhost:5244/api/admin/storage/update',
            STORAGE_CONFIG: {
                id: 1,
                mount_path: "/移动云盘",
                order: 0,
                driver: "139Yun",
                cache_expiration: 30,
                status: "work",
                remark: "",
                disabled: false,
                disable_index: false,
                enable_sign: true,
                order_by: "name",
                order_direction: "asc",
                extract_folder: "front",
                web_proxy: false,
                webdav_policy: "native_proxy",
                down_proxy_url: "",
                proxy_range: true
            },
            ADDITION_FIELDS: {
                root_folder_id: "/",
                type: "personal_new",
                cloud_id: "",
                user_domain_id: "",
                custom_upload_part_size: 0,
                report_real_size: true,
                use_large_thumbnail: false
            }
        };

        // 从存储中读取敏感信息
        return {
            API_URL: GM_getValue('API_URL', defaultConfig.API_URL),
            API_AUTH: GM_getValue('API_AUTH', ''), // 敏感信息，必须通过配置菜单设置
            STORAGE_CONFIG: GM_getValue('STORAGE_CONFIG', defaultConfig.STORAGE_CONFIG),
            ADDITION_FIELDS: GM_getValue('ADDITION_FIELDS', defaultConfig.ADDITION_FIELDS)
        };
    }

    // 获取配置（使用函数确保每次获取最新值）
    function getCurrentConfig() {
        return getConfig();
    }

    // 自动刷新配置（非敏感信息）
    const AUTO_REFRESH = GM_getValue('AUTO_REFRESH', false);
    const AUTO_REFRESH_INTERNAL = GM_getValue('AUTO_REFRESH_INTERVAL', 120);

    // ==================== 状态管理 ====================
    let authSaved = false; // 确保只处理一次

    // ==================== 核心功能函数 ====================

    /**
     * 处理捕获到的 Authorization 值
     * @param {string} rawAuth - 原始 Authorization 值（可能包含 "Basic " 前缀）
     */
    function handleAuth(rawAuth) {
        if (!rawAuth || authSaved) return;
        authSaved = true;

        // 去掉前缀 "Basic "（包括空格）
        let processedAuth = rawAuth.trim();
        if (processedAuth.startsWith('Basic ')) {
            processedAuth = processedAuth.slice(6).trim();
        }

        console.log('[CaptureAuth] Authorization captured:', processedAuth);
        sendAuthToServer(processedAuth);
    }

    /**
     * 检查配置是否完整
     * @returns {boolean} 配置是否完整
     */
    function checkConfig() {
        const config = getCurrentConfig();
        if (!config.API_URL) {
            console.error('[CaptureAuth] 错误: API_URL 未配置');
            return false;
        }
        if (!config.API_AUTH) {
            console.error('[CaptureAuth] 错误: API_AUTH 未配置，请通过右键菜单 -> "配置脚本" 进行设置');
            return false;
        }
        return true;
    }

    /**
     * 发送 Authorization 到服务端
     * @param {string} auth - 处理后的 Authorization 值
     */
    function sendAuthToServer(auth) {
        // 检查配置
        if (!checkConfig()) {
            console.warn('[CaptureAuth] 配置不完整，跳过发送');
            return;
        }

        const config = getCurrentConfig();

        // 构造 addition 对象
        const additionObj = {
            authorization: auth,
            ...config.ADDITION_FIELDS
        };

        // 构造完整 payload
        const payload = {
            ...config.STORAGE_CONFIG,
            addition: JSON.stringify(additionObj)
        };

        // 发送请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: config.API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.API_AUTH
            },
            data: JSON.stringify(payload),
            onload: function (res) {
                if (res.status === 200) {
                    console.log('[CaptureAuth] Successfully sent to server');
                } else {
                    console.error('[CaptureAuth] Server error:', res.status, res.responseText);
                }
            },
            onerror: function (err) {
                console.error('[CaptureAuth] Request failed:', err);
            }
        });
    }

    // ==================== 请求拦截器 ====================

    /**
     * 拦截 XMLHttpRequest.prototype.setRequestHeader
     * 这是最可靠的方法，即使构造函数被替换也能工作
     */
    function interceptXHRPrototype() {
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        XMLHttpRequest.prototype.setRequestHeader = function(key, value) {
            // 捕获 Authorization 头
            if (key.toLowerCase() === 'authorization') {
                handleAuth(value);
            }
            // 调用原始方法
            return originalSetRequestHeader.call(this, key, value);
        };

        console.log('[CaptureAuth] XMLHttpRequest interceptor installed');
    }

    /**
     * 拦截 fetch API（备用方案）
     */
    function interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = function(input, init = {}) {
            try {
                const headers = init.headers || {};

                // 处理 Headers 对象
                if (headers instanceof Headers) {
                    const auth = headers.get('authorization') || headers.get('Authorization');
                    if (auth) handleAuth(auth);
                }
                // 处理普通对象
                else if (typeof headers === 'object' && !Array.isArray(headers)) {
                    const auth = headers['authorization'] || headers['Authorization'];
                    if (auth) handleAuth(auth);
                }
            } catch (e) {
                console.warn('[CaptureAuth] Fetch interception error:', e);
            }

            return originalFetch.apply(this, arguments);
        };
    }

    // ==================== 自动刷新页面 ====================
    // 定时刷新页面
    function autoRefresh() {
        setInterval(() => {
            console.log('[CaptureAuth] Auto refreshing page...');
            location.reload();
        }, AUTO_REFRESH_INTERNAL * 60 * 1000);
    }
    // ==================== 配置管理 ====================

    /**
     * 打开配置界面
     */
    function openConfig() {
        const config = getCurrentConfig();

        const apiUrl = prompt('请输入 OpenList API 地址:', config.API_URL);
        if (apiUrl !== null) {
            GM_setValue('API_URL', apiUrl.trim());
        }

        const apiAuth = prompt('请输入 OpenList 令牌 (查看路径：管理后台 -> 设置 -> 其他 -> 页面最底部):', config.API_AUTH || '');
        if (apiAuth !== null) {
            GM_setValue('API_AUTH', apiAuth.trim());
        }

        const autoRefreshEnabled = confirm('是否启用自动刷新页面？\n当前设置: ' + (AUTO_REFRESH ? '已启用' : '未启用'));
        GM_setValue('AUTO_REFRESH', autoRefreshEnabled);

        if (autoRefreshEnabled) {
            const interval = prompt('请输入自动刷新间隔（分钟）:', AUTO_REFRESH_INTERNAL);
            if (interval !== null && !isNaN(interval)) {
                GM_setValue('AUTO_REFRESH_INTERVAL', parseInt(interval));
            }
        }

        alert('配置已保存！\n\n请刷新页面使配置生效。');
    }

    // 注册配置菜单（右键点击扩展图标 -> 配置脚本）
    GM_registerMenuCommand('配置脚本', openConfig);

    // ==================== 初始化 ====================

    // 检查配置
    if (!checkConfig()) {
        console.warn('[CaptureAuth] 配置不完整，请通过右键菜单 -> "配置脚本" 进行设置');
    }

    // 安装拦截器
    interceptXHRPrototype();
    interceptFetch();

    // 启用自动刷新
    if(AUTO_REFRESH) {
        autoRefresh();
    }

    console.log('[CaptureAuth] Script initialized');

})();
