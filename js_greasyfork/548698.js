// ==UserScript==
// @name         AI提示词增强器 - 飞书知识库版
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description  在AI对话网站中增强用户输入，使用飞书多维表格作为知识库存储和检索方法论。v1.2.9: 简化代码逻辑，移除复杂验证，优化用户体验
// @author       AI Assistant
// @license      MIT
// @match        https://chat.deepseek.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://www.kimi.com/*
// @match        https://kimi.com/*
// @match        https://www.doubao.com/chat/*
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      open.feishu.cn
// @connect      api.moonshot.cn
// @connect      api.deepseek.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/548698/AI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20%E9%A3%9E%E4%B9%A6%E7%9F%A5%E8%AF%86%E5%BA%93%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548698/AI%E6%8F%90%E7%A4%BA%E8%AF%8D%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20%E9%A3%9E%E4%B9%A6%E7%9F%A5%E8%AF%86%E5%BA%93%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置和常量 ====================

    // 网站类型枚举
    const SiteType = {
        DEEPSEEK: 'deepseek',
        KIMI: 'kimi',
        DOUBAO: 'doubao',
        UNKNOWN: 'unknown'
    };

    // 按钮状态枚举
    const ButtonState = {
        NORMAL: 'normal',
        LOADING: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
    };

    // 飞书多维表格配置
    const FEISHU_CONFIG = {
        API_URL: 'https://open.feishu.cn/open-apis',
        // 用户需要配置的字段
        get APP_ID() { return GM_getValue('feishu_app_id', ''); },
        get APP_SECRET() { return GM_getValue('feishu_app_secret', ''); },
        get BASE_ID() { return GM_getValue('feishu_base_id', ''); },
        get TABLE_ID() { return GM_getValue('feishu_table_id', ''); }
    };

    // AI模型配置
    const AI_CONFIG = {
        get MODEL_NAME() { return GM_getValue('ai_model_name', 'moonshot-v1-8k'); },
        get BASE_URL() { return GM_getValue('ai_base_url', 'https://api.moonshot.cn/v1'); },
        get API_KEY() { return GM_getValue('ai_api_key', ''); }
    };

    // 网站配置
    const SITE_CONFIGS = {
        [SiteType.DEEPSEEK]: {
            type: SiteType.DEEPSEEK,
            name: 'DeepSeek',
            inputSelector: '#chat-input, textarea[placeholder*="输入"], textarea[placeholder*="问题"], .chat-input textarea, textarea',
            inputType: 'textarea',
            buttonContainerSelector: '.ec4f5d61, .chat-input-container, .input-container, .toolbar, .chat-toolbar, [class*="toolbar"], [class*="input-container"], [class*="container"]',
            sendButtonSelector: '.bcc55ca1, [data-testid*="send"], button[type="submit"]',
            isEnabled: true
        },
        [SiteType.KIMI]: {
            type: SiteType.KIMI,
            name: 'Kimi',
            inputSelector: '.chat-input-editor',
            inputType: 'contenteditable',
            buttonContainerSelector: '.left-area',
            sendButtonSelector: '.send-button-container',
            isEnabled: true
        },
        [SiteType.DOUBAO]: {
            type: SiteType.DOUBAO,
            name: '豆包',
            inputSelector: '[data-testid="chat_input_input"]',
            inputType: 'textarea',
            buttonContainerSelector: '.left-tools-wrapper-INTHKl',
            sendButtonSelector: '[data-testid="chat_input_send_button"]',
            isEnabled: true
        }
    };

    // 全局变量
    let currentSiteType = SiteType.UNKNOWN;
    let enhanceButton = null;
    let inputHandler = null;
    let accessTokenCache = { token: null, expireTime: 0 };
    let isInitialized = false;

    // ==================== 工具函数 ====================

    // 检测当前网站类型
    function detectSiteType() {
        const hostname = window.location.hostname;
        console.log('🔍 检测网站类型 - 当前域名:', hostname);
        console.log('🔍 检测网站类型 - 当前完整URL:', window.location.href);

        if (hostname.includes('deepseek.com')) {
            console.log('✅ 检测到DeepSeek网站');
            return SiteType.DEEPSEEK;
        } else if (hostname.includes('moonshot.cn') || hostname.includes('kimi.com')) {
            console.log('✅ 检测到Kimi网站');
            return SiteType.KIMI;
        } else if (hostname.includes('doubao.com')) {
            console.log('✅ 检测到豆包网站');
            return SiteType.DOUBAO;
        }

        console.log('❌ 未识别的网站类型');
        return SiteType.UNKNOWN;
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // 判断是否为聊天页面
    function isChatPage() {
        switch (currentSiteType) {
            case SiteType.DEEPSEEK:
                // DeepSeek网站的所有页面都可能需要增强功能，不限制特定路径
                return true;
            case SiteType.KIMI:
                return true;
            case SiteType.DOUBAO:
                return window.location.pathname === '/' || window.location.pathname.includes('/chat');
            default:
                return false;
        }
    }

    // 添加样式
    function addStyles() {
        GM_addStyle(`
            .prompt-enhancer-button {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                border: 1px solid rgba(0, 0, 0, 0.12);
                border-radius: 6px;
                background: #fff;
                color: #4c4c4c;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                margin-right: 8px;
            }

            .prompt-enhancer-button:hover {
                background: #f5f5f5;
                border-color: rgba(0, 0, 0, 0.2);
            }

            .prompt-enhancer-button.pe-loading {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .prompt-enhancer-button.pe-success {
                background: #e8f5e8;
                border-color: #4caf50;
                color: #2e7d32;
            }

            .prompt-enhancer-button.pe-error {
                background: #ffebee;
                border-color: #f44336;
                color: #c62828;
            }

            .pe-tooltip {
                position: absolute;
                top: -40px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10000;
                pointer-events: none;
            }

            .pe-config-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 450px;
                max-width: 90vw;
                max-height: 90vh;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
            }

            .pe-config-header {
                padding: 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
                border-radius: 8px 8px 0 0;
                flex-shrink: 0;
            }

            .pe-config-content {
                padding: 16px;
                overflow-y: auto;
                flex: 1;
                min-height: 0;
            }

            .pe-config-section {
                margin-bottom: 20px;
            }

            .pe-config-section h3 {
                margin: 0 0 12px 0;
                font-size: 16px;
                color: #333;
            }

            .pe-form-group {
                margin-bottom: 12px;
            }

            .pe-form-group label {
                display: block;
                margin-bottom: 4px;
                font-size: 14px;
                color: #555;
            }

            .pe-form-group input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                box-sizing: border-box;
            }

            .pe-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-right: 8px;
            }

            .pe-button-primary {
                background: #007bff;
                color: white;
            }

            .pe-button-secondary {
                background: #6c757d;
                color: white;
            }

            .pe-close-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #666;
            }

            /* 右侧悬浮增强窗样式 */
            .pe-floating-enhancer {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                transition: all 0.3s ease;
                user-select: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .pe-floating-enhancer:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            }

            .pe-floating-enhancer.pe-loading {
                animation: pe-spin 1s linear infinite;
            }

            .pe-floating-enhancer.pe-success {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            }

            .pe-floating-enhancer.pe-error {
                background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
            }

            @keyframes pe-spin {
                0% { transform: translateY(-50%) rotate(0deg); }
                100% { transform: translateY(-50%) rotate(360deg); }
            }

            .pe-floating-tooltip {
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .pe-floating-enhancer:hover .pe-floating-tooltip {
                opacity: 1;
            }
        `);
    }

    // ==================== 飞书API相关 ====================

    // 从飞书表格URL中提取Base ID和Table ID
    function parseFeishuUrl(url) {
        if (!url || !url.trim()) {
            throw new Error('URL不能为空');
        }

        // 匹配Base ID (支持多种URL格式)
        const baseIdMatch = url.match(/\/(?:base|sheets)\/([^\/\?]+)/);
        // 匹配Table ID
        const tableIdMatch = url.match(/[?&]table=([^&]+)/);

        if (!baseIdMatch) {
            throw new Error('无法从URL中解析Base ID，请检查URL格式');
        }

        if (!tableIdMatch) {
            throw new Error('无法从URL中解析Table ID，请确保URL包含table参数');
        }

        return {
            baseId: baseIdMatch[1],
            tableId: tableIdMatch[1]
        };
    }

    // 获取飞书访问令牌
    function getFeishuAccessToken() {
        return new Promise((resolve, reject) => {
            // 检查缓存
            const now = Date.now();
            if (accessTokenCache.token && now < accessTokenCache.expireTime) {
                resolve(accessTokenCache.token);
                return;
            }

            console.log('正在获取飞书访问令牌...');
            console.log('飞书配置:', {
                APP_ID: FEISHU_CONFIG.APP_ID ? '已配置' : '未配置',
                APP_SECRET: FEISHU_CONFIG.APP_SECRET ? '已配置' : '未配置',
                BASE_ID: FEISHU_CONFIG.BASE_ID ? '已配置' : '未配置',
                TABLE_ID: FEISHU_CONFIG.TABLE_ID ? '已配置' : '未配置'
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${FEISHU_CONFIG.API_URL}/auth/v3/tenant_access_token/internal`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                timeout: 15000, // 15秒超时
                data: JSON.stringify({
                    app_id: FEISHU_CONFIG.APP_ID,
                    app_secret: FEISHU_CONFIG.APP_SECRET
                }),
                onload: function(response) {
                    console.log('飞书令牌响应状态:', response.status);
                    console.log('飞书令牌响应内容:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.tenant_access_token) {
                            // 缓存令牌，有效期设为90分钟
                            accessTokenCache.token = data.tenant_access_token;
                            accessTokenCache.expireTime = Date.now() + (90 * 60 * 1000);
                            console.log('飞书访问令牌获取成功');
                            resolve(data.tenant_access_token);
                        } else {
                            console.error('飞书API错误:', data);
                            let errorMsg = '获取飞书访问令牌失败';
                            if (data.msg) {
                                errorMsg += ': ' + data.msg;
                            }
                            if (data.msg && data.msg.includes('app secret invalid')) {
                                errorMsg = '飞书App Secret无效，请检查配置';
                            }
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        console.error('解析飞书响应失败:', e, '原始响应:', response.responseText);
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('飞书网络请求失败:', error);
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    console.error('飞书请求超时');
                    reject(new Error('获取访问令牌超时'));
                }
            });
        });
    }

    // 列出多维表格的数据表
    function listFeishuTables(appToken, accessToken) {
        return new Promise((resolve, reject) => {
            console.log('正在获取数据表列表...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${appToken}/tables`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                onload: function(response) {
                    console.log('获取数据表列表响应状态:', response.status);
                    console.log('获取数据表列表响应内容:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            const tables = data.data.items || [];
                            console.log(`获取到 ${tables.length} 个数据表`);
                            resolve(tables);
                        } else {
                            console.error('获取数据表列表API错误:', data);
                            reject(new Error(data.msg || '获取数据表列表失败'));
                        }
                    } catch (e) {
                        console.error('解析获取数据表列表响应失败:', e, '原始响应:', response.responseText);
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('获取数据表列表网络请求失败:', error);
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 查询多维表格记录（标准四步流程）
    function queryFeishuRecords(appToken, tableId, accessToken, options = {}, retryCount = 0) {
        return new Promise((resolve, reject) => {
            console.log('正在查询多维表格记录...');

            const {
                pageSize = 100,
                fieldNames = null,
                filter = null,
                sort = null
            } = options;

            const params = new URLSearchParams();
            if (pageSize) params.append('page_size', pageSize.toString());
            if (fieldNames && fieldNames.length > 0) {
                fieldNames.forEach(name => params.append('field_names', name));
            }

            let url = `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
            if (params.toString()) {
                url += '?' + params.toString();
            }

            const requestData = {};
            if (filter) requestData.filter = filter;
            if (sort) requestData.sort = sort;

            const requestOptions = {
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                timeout: 30000 // 增加超时时间
            };

            // 如果有filter或sort，使用POST方法
            if (filter || sort) {
                requestOptions.method = 'POST';
                requestOptions.url = `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`;
                requestOptions.data = JSON.stringify(requestData);
            }

            GM_xmlhttpRequest({
                ...requestOptions,
                onload: function(response) {
                    console.log('查询记录响应状态:', response.status);

                    // 检查响应是否完整
                    if (!response.responseText || response.responseText.trim() === '') {
                        console.warn('查询记录获取到空响应，尝试重试...');
                        if (retryCount < 3) {
                            setTimeout(() => {
                                queryFeishuRecords(appToken, tableId, accessToken, options, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000 * (retryCount + 1));
                            return;
                        } else {
                            reject(new Error('查询记录失败：响应为空'));
                            return;
                        }
                    }

                    // 检查响应是否被截断
                    const responseText = response.responseText.trim();
                    if (!responseText.endsWith('}') && !responseText.endsWith(']')) {
                        console.warn('查询记录响应可能被截断，尝试重试...', '响应长度:', responseText.length);
                        if (retryCount < 2) { // 查询记录重试次数稍少一些
                            setTimeout(() => {
                                queryFeishuRecords(appToken, tableId, accessToken, options, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1500 * (retryCount + 1));
                            return;
                        }
                    }

                    console.log('查询记录响应内容长度:', responseText.length);
                    console.log('查询记录响应内容:', responseText.substring(0, 300) + (responseText.length > 300 ? '...' : ''));

                    try {
                        const data = JSON.parse(responseText);
                        if (data.code === 0) {
                            const records = data.data.items || [];
                            console.log(`查询到 ${records.length} 条记录`);
                            resolve({
                                records: records,
                                hasMore: data.data.has_more || false,
                                pageToken: data.data.page_token || null,
                                total: data.data.total || records.length
                            });
                        } else {
                            console.error('查询记录API错误:', data);
                            let errorMsg = '查询记录失败';
                            if (data.msg) {
                                errorMsg += ': ' + data.msg;
                            }
                            if (response.status === 403 || data.msg?.includes('Forbidden')) {
                                errorMsg = '飞书应用权限不足，请检查应用权限配置：\n1. 确保应用有"查看、评论、编辑和管理多维表格"权限\n2. 确保应用已发布并获得管理员审批\n3. 检查Base ID和Table ID是否正确';
                            }
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        console.error('解析查询记录响应失败:', e);
                        console.error('原始响应长度:', responseText.length);
                        console.error('原始响应前300字符:', responseText.substring(0, 300));

                        // 如果是JSON解析错误且还有重试次数，尝试重试
                        if (retryCount < 2) {
                            console.log(`查询记录JSON解析失败，进行第${retryCount + 1}次重试...`);
                            setTimeout(() => {
                                queryFeishuRecords(appToken, tableId, accessToken, options, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 2000 * (retryCount + 1));
                            return;
                        }

                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('查询记录网络请求失败:', error);
                    if (retryCount < 2) {
                        console.log(`查询记录网络请求失败，进行第${retryCount + 1}次重试...`);
                        setTimeout(() => {
                            queryFeishuRecords(appToken, tableId, accessToken, options, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 2000 * (retryCount + 1));
                        return;
                    }
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    console.error('查询记录请求超时');
                    if (retryCount < 2) {
                        console.log(`查询记录请求超时，进行第${retryCount + 1}次重试...`);
                        setTimeout(() => {
                            queryFeishuRecords(appToken, tableId, accessToken, options, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 3000 * (retryCount + 1));
                        return;
                    }
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 从飞书知识库检索方法论（改进版，使用标准四步流程）
    function retrieveFromFeishu(query, topK = 3) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('开始标准四步流程检索飞书数据...');

                // 步骤一：获取访问令牌
                const accessToken = await getFeishuAccessToken();
                console.log('✓ 步骤一：访问令牌获取成功');

                // 步骤二：获取数据表信息（验证table_id是否存在）
                const appToken = FEISHU_CONFIG.BASE_ID;
                const targetTableId = FEISHU_CONFIG.TABLE_ID;

                try {
                    const tables = await listFeishuTables(appToken, accessToken);
                    const targetTable = tables.find(table => table.table_id === targetTableId);
                    if (!targetTable) {
                        throw new Error(`未找到指定的数据表 ID: ${targetTableId}`);
                    }
                    console.log(`✓ 步骤二：找到目标数据表 "${targetTable.name}"`);
                } catch (tableError) {
                    console.warn('获取数据表列表失败，继续使用配置的Table ID:', tableError.message);
                }

                // 步骤三：获取字段信息
                let fieldInfo = {};
                let availableFieldNames = [];
                try {
                    const fields = await getFeishuFields(appToken, targetTableId, accessToken);
                    fields.forEach(field => {
                        fieldInfo[field.field_name] = {
                            field_id: field.field_id,
                            type: field.type
                        };
                        availableFieldNames.push(field.field_name);
                    });
                    console.log(`✓ 步骤三：获取到 ${fields.length} 个字段信息`);
                    console.log('可用字段名称:', availableFieldNames);

                    // 检查必需字段是否存在
                    const requiredFields = ['标题', '内容', '关键词', '助手'];
                    const missingFields = requiredFields.filter(field => !availableFieldNames.includes(field));
                    if (missingFields.length > 0) {
                        console.warn('缺少必需字段:', missingFields);
                        console.log('将使用可用字段进行查询');
                    }
                } catch (fieldError) {
                    console.warn('获取字段信息失败，使用字段名称查询:', fieldError.message);
                    // 字段信息获取失败不影响后续查询，继续执行
                    availableFieldNames = ['标题', '内容', '关键词', '助手']; // 使用默认字段名
                }

                // 辅助函数：智能提取搜索关键词
                const extractSearchKeywords = (query) => {
                    const keywords = [];

                    // 添加原始查询
                    keywords.push(query.trim());

                    // 中文分词（简单实现）
                    const chineseWords = query.match(/[\u4e00-\u9fff]+/g) || [];
                    chineseWords.forEach(word => {
                        if (word.length >= 2) {
                            keywords.push(word);
                            // 添加子词
                            for (let i = 0; i <= word.length - 2; i++) {
                                for (let j = i + 2; j <= word.length; j++) {
                                    keywords.push(word.substring(i, j));
                                }
                            }
                        }
                    });

                    // 英文单词分割
                    const englishWords = query.match(/[a-zA-Z]+/g) || [];
                    englishWords.forEach(word => {
                        if (word.length >= 2) {
                            keywords.push(word.toLowerCase());
                        }
                    });

                    // 去重并按长度排序（长的在前）
                    return [...new Set(keywords)].sort((a, b) => b.length - a.length);
                };

                // 辅助函数：安全地构建查询条件，只使用存在的字段
                const buildSafeQueryConditions = (searchFields, searchTerms) => {
                    const conditions = [];
                    searchFields.forEach(fieldName => {
                        if (availableFieldNames.includes(fieldName)) {
                            searchTerms.forEach(term => {
                                conditions.push({
                                    field_name: fieldName,
                                    operator: "contains",
                                    value: [term]
                                });
                            });
                        } else {
                            console.warn(`字段 "${fieldName}" 不存在，跳过此字段的查询条件`);
                        }
                    });
                    return conditions;
                };

                // 辅助函数：安全提取字段文本值
                const extractFieldText = (fieldValue) => {
                    if (!fieldValue) return '';
                    if (typeof fieldValue === 'string') return fieldValue;
                    if (Array.isArray(fieldValue)) {
                        return fieldValue.map(item => {
                            if (typeof item === 'string') return item;
                            if (item && typeof item === 'object' && item.text) return item.text;
                            return String(item || '');
                        }).join(' ');
                    }
                    if (typeof fieldValue === 'object' && fieldValue.text) {
                        return fieldValue.text;
                    }
                    return String(fieldValue);
                };

                // 辅助函数：计算文本相似度
                const calculateSimilarity = (text1, text2) => {
                    const t1 = extractFieldText(text1).toLowerCase();
                    const t2 = extractFieldText(text2).toLowerCase();

                    if (!t1 || !t2) return 0;

                    // 直接包含得分最高
                    if (t1.includes(t2) || t2.includes(t1)) {
                        return 0.9;
                    }

                    // 计算共同字符数
                    const chars1 = new Set(t1);
                    const chars2 = new Set(t2);
                    const intersection = new Set([...chars1].filter(x => chars2.has(x)));
                    const union = new Set([...chars1, ...chars2]);

                    return intersection.size / union.size;
                };

                // 步骤四：查询记录数据
                console.log('开始查询记录，搜索关键词:', query);

                // 提取智能搜索关键词
                const searchKeywords = extractSearchKeywords(query);
                console.log('提取的搜索关键词:', searchKeywords.slice(0, 5)); // 只显示前5个

                // 首先尝试获取所有记录进行调试（不指定字段名，获取所有字段）
                const debugOptions = {
                    pageSize: 10
                    // 移除 fieldNames 参数，让API返回所有字段
                };

                try {
                    const debugResult = await queryFeishuRecords(appToken, targetTableId, accessToken, debugOptions);
                    console.log('调试：获取到的所有记录数量:', debugResult.records.length);
                    debugResult.records.forEach((record, index) => {
                        console.log(`调试：记录${index + 1}:`, {
                            所有字段名: Object.keys(record.fields),
                            标题字段: record.fields['标题'] || record.fields['1'],
                            助手字段内容: (record.fields['助手'] || record.fields['助手']) ? extractFieldText(record.fields['助手'] || record.fields['助手']).substring(0, 100) + '...' : '无',
                            助手字段长度: record.fields['助手'] ? extractFieldText(record.fields['助手']).length : 0,
                            原始字段结构: record.fields
                        });
                    });
                } catch (debugError) {
                    console.warn('调试查询失败:', debugError.message);
                }

                // 尝试多种搜索策略
                let result = null;
                let searchStrategy = '';

                // 策略1: 使用主要关键词在助手字段中搜索
                try {
                    const primaryKeywords = searchKeywords.slice(0, 3); // 使用前3个最重要的关键词
                    const assistantConditions = buildSafeQueryConditions(['助手'], primaryKeywords);
                    if (assistantConditions.length === 0) {
                        console.warn('策略1跳过：助手字段不存在');
                        throw new Error('助手字段不存在');
                    }

                    const queryOptions1 = {
                        pageSize: topK,
                        filter: {
                            conjunction: "or", // 改为OR，增加匹配可能性
                            conditions: assistantConditions
                        }
                    };

                    result = await queryFeishuRecords(appToken, targetTableId, accessToken, queryOptions1);
                    searchStrategy = '助手字段关键词匹配';
                    console.log(`策略1(${searchStrategy})：找到 ${result.records.length} 条记录`);
                } catch (error1) {
                    console.warn('策略1失败:', error1.message);
                }

                // 策略2: 如果助手字段搜索无结果，尝试使用更多关键词在多个字段中搜索
                if (!result || result.records.length === 0) {
                    try {
                        const extendedKeywords = searchKeywords.slice(0, 5); // 使用前5个关键词
                        const multiFieldConditions = buildSafeQueryConditions(['助手', '内容', '标题', '关键词'], extendedKeywords);
                        if (multiFieldConditions.length === 0) {
                            console.warn('策略2跳过：没有可用的搜索字段');
                            throw new Error('没有可用的搜索字段');
                        }

                        const queryOptions2 = {
                            pageSize: topK * 2, // 获取更多结果用于后续排序
                            filter: {
                                conjunction: "or",
                                conditions: multiFieldConditions
                            }
                        };

                        result = await queryFeishuRecords(appToken, targetTableId, accessToken, queryOptions2);
                        searchStrategy = '多字段扩展搜索';
                        console.log(`策略2(${searchStrategy})：找到 ${result.records.length} 条记录`);
                    } catch (error2) {
                        console.warn('策略2失败:', error2.message);
                    }
                }

                // 策略3: 如果仍无结果，尝试获取所有记录并在客户端过滤
                if (!result || result.records.length === 0) {
                    try {
                        console.log('策略3：尝试获取所有记录进行客户端过滤...');
                        const queryOptions3 = {
                            pageSize: 50
                            // 移除 fieldNames，获取所有字段
                        };

                        const allRecords = await queryFeishuRecords(appToken, targetTableId, accessToken, queryOptions3);
                        console.log(`策略3：获取所有记录进行客户端过滤，总记录数: ${allRecords.records.length}`);

                        // 智能客户端过滤和排序
                        const scoredRecords = allRecords.records.map(record => {
                            try {
                                let maxScore = 0;
                                let matchedField = '';
                                const searchFields = ['助手', '内容', '标题', '关键词'];

                                // 计算每个字段的相似度得分
                                for (const fieldName of searchFields) {
                                    if (availableFieldNames.includes(fieldName)) {
                                        const fieldValue = record.fields[fieldName];
                                        const fieldText = extractFieldText(fieldValue);

                                        // 对每个搜索关键词计算相似度
                                        for (const keyword of searchKeywords.slice(0, 8)) {
                                            const similarity = calculateSimilarity(fieldText, keyword);
                                            if (similarity > maxScore) {
                                                maxScore = similarity;
                                                matchedField = fieldName;
                                            }
                                        }

                                        // 特别关注助手字段，给予额外权重
                                        if (fieldName === '助手' && fieldText) {
                                            for (const keyword of searchKeywords.slice(0, 5)) {
                                                if (fieldText.toLowerCase().includes(keyword.toLowerCase())) {
                                                    maxScore = Math.max(maxScore, 0.8);
                                                    matchedField = '助手';
                                                }
                                            }
                                        }
                                    }
                                }

                                return {
                                    record,
                                    score: maxScore,
                                    matchedField
                                };
                            } catch (filterError) {
                                console.warn('计算记录得分时出错:', filterError.message);
                                return { record, score: 0, matchedField: '' };
                            }
                        });

                        // 过滤出有意义的匹配（得分 > 0.1）并按得分排序
                        const filteredRecords = scoredRecords
                            .filter(item => item.score > 0.1)
                            .sort((a, b) => {
                                // 助手字段匹配优先
                                if (a.matchedField === '助手' && b.matchedField !== '助手') return -1;
                                if (b.matchedField === '助手' && a.matchedField !== '助手') return 1;
                                // 然后按得分排序
                                return b.score - a.score;
                            })
                            .map(item => item.record);

                        console.log('智能过滤结果:', filteredRecords.length, '条记录');
                        if (filteredRecords.length > 0) {
                            console.log('最佳匹配得分:', scoredRecords.find(item => item.record === filteredRecords[0])?.score);
                        }

                        result = {
                            records: filteredRecords.slice(0, topK),
                            total: filteredRecords.length
                        };
                        searchStrategy = '客户端模糊匹配';
                        console.log(`策略3(${searchStrategy})：过滤后找到 ${result.records.length} 条记录`);
                    } catch (error3) {
                        console.warn('策略3失败:', error3.message);

                        // 策略4: 最后的降级策略，尝试简单获取记录（不使用过滤）
                        try {
                            console.log('策略4：降级策略，尝试简单获取记录...');
                            const simpleOptions = {
                                pageSize: Math.min(topK * 2, 10)
                                // 移除 fieldNames，获取所有字段
                            };

                            const simpleRecords = await queryFeishuRecords(appToken, targetTableId, accessToken, simpleOptions);
                            console.log(`策略4：简单获取到 ${simpleRecords.records.length} 条记录`);

                            result = {
                                records: simpleRecords.records.slice(0, topK),
                                total: simpleRecords.records.length
                            };
                            searchStrategy = '降级简单获取';
                            console.log(`策略4(${searchStrategy})：返回 ${result.records.length} 条记录`);
                        } catch (error4) {
                            console.warn('策略4也失败:', error4.message);
                            // 如果所有策略都失败，返回空结果但不抛出错误
                            result = { records: [], total: 0 };
                            searchStrategy = '所有策略失败，返回空结果';
                            console.log('所有检索策略都失败，将继续使用AI增强（不使用知识库）');
                        }
                    }
                }

                console.log(`✓ 步骤四：查询完成，使用策略"${searchStrategy}"，找到 ${result.records.length} 条相关记录`);

                // 对所有策略的结果进行智能排序（除了策略3已经排序过的）
                if (searchStrategy !== '客户端模糊匹配' && result.records.length > 1) {
                    console.log('对查询结果进行智能排序...');
                    const scoredResults = result.records.map(record => {
                        let maxScore = 0;
                        const fields = record.fields;

                        // 计算与查询的相关性得分
                        for (const keyword of searchKeywords.slice(0, 5)) {
                            const assistantText = extractFieldText(fields['助手']);
                            const titleText = extractFieldText(fields['标题']);
                            const contentText = extractFieldText(fields['内容']);

                            // 助手字段权重最高
                            const assistantScore = calculateSimilarity(assistantText, keyword) * 1.0;
                            const titleScore = calculateSimilarity(titleText, keyword) * 0.8;
                            const contentScore = calculateSimilarity(contentText, keyword) * 0.6;

                            maxScore = Math.max(maxScore, assistantScore, titleScore, contentScore);
                        }

                        return { record, score: maxScore };
                    });

                    // 按得分排序
                    result.records = scoredResults
                        .sort((a, b) => b.score - a.score)
                        .map(item => item.record);

                    console.log('排序完成，最高得分:', scoredResults[0]?.score);
                }

                // 处理查询结果（安全地访问字段）
                const methodologies = result.records.map(item => {
                    const fields = item.fields;

                    // 安全地获取字段值（支持字段名和字段ID）
                    const getFieldValue = (fieldName, defaultValue = '') => {
                        // 首先尝试使用字段名
                        let fieldValue = fields[fieldName];

                        // 如果字段名不存在，尝试使用字段ID（数字键）
                        if (!fieldValue) {
                            const fieldKeys = Object.keys(fields);
                            // 查找可能的字段ID或其他键名
                            for (const key of fieldKeys) {
                                const keyFieldValue = fields[key];
                                if (keyFieldValue) {
                                    const textValue = extractFieldText(keyFieldValue);
                                    // 简单的启发式匹配：如果是标题字段，通常内容较短且不包含大量文本
                                    if (fieldName === '标题' && textValue && textValue.length < 200 && !textValue.includes('来源：')) {
                                        fieldValue = keyFieldValue;
                                        break;
                                    }
                                    // 如果是助手字段，通常内容较长
                                    else if (fieldName === '助手' && textValue && textValue.length > 100) {
                                        fieldValue = keyFieldValue;
                                        break;
                                    }
                                    // 如果是内容字段，通常包含'来源：'或很长
                                    else if (fieldName === '内容' && textValue && (textValue.includes('来源：') || textValue.length > 500)) {
                                        fieldValue = keyFieldValue;
                                        break;
                                    }
                                    // 如果是关键词字段，通常包含逗号分隔的短词
                                    else if (fieldName === '关键词' && textValue && textValue.includes(',') && textValue.length < 500) {
                                        fieldValue = keyFieldValue;
                                        break;
                                    }
                                }
                            }
                        }

                        return extractFieldText(fieldValue) || defaultValue;
                    };

                    const methodology = {
                        title: getFieldValue('标题', '未知标题'),
                        content: getFieldValue('内容'),
                        keywords: getFieldValue('关键词'),
                        assistant: getFieldValue('助手'),
                        recordId: item.record_id
                    };

                    // 计算匹配度用于调试
                    let matchScore = 0;
                    const assistantText = methodology.assistant || '';
                    for (const keyword of searchKeywords.slice(0, 3)) {
                        if (assistantText.toLowerCase().includes(keyword.toLowerCase())) {
                            matchScore += 1;
                        }
                    }
                    methodology.matchScore = matchScore;

                    return methodology;
                });

                console.log('飞书数据检索完成，返回结果');
                console.log('返回的方法论数据:', methodologies.map((m, index) => ({
                    序号: index + 1,
                    标题: m.title,
                    匹配得分: m.matchScore,
                    助手字段长度: m.assistant.length,
                    助手内容预览: m.assistant ? m.assistant.substring(0, 150) + '...' : '无内容',
                    关键词: m.keywords
                })));

                // 如果找到了结果，显示最佳匹配的详细信息
                if (methodologies.length > 0) {
                    const bestMatch = methodologies[0];
                    console.log('🎯 最佳匹配方法论:');
                    console.log('标题:', bestMatch.title);
                    console.log('匹配得分:', bestMatch.matchScore);
                    console.log('助手内容长度:', bestMatch.assistant.length);
                    console.log('关键词:', bestMatch.keywords);

                    // 显示匹配的关键词
                    const matchedKeywords = searchKeywords.slice(0, 5).filter(keyword =>
                        bestMatch.assistant.toLowerCase().includes(keyword.toLowerCase())
                    );
                    if (matchedKeywords.length > 0) {
                        console.log('匹配的关键词:', matchedKeywords);
                    }
                } else {
                    console.log('⚠️ 未找到匹配的方法论');
                    console.log('搜索关键词:', searchKeywords.slice(0, 5));
                    console.log('建议：');
                    console.log('1. 检查飞书表格中是否有相关内容');
                    console.log('2. 尝试使用更通用的关键词');
                    console.log('3. 检查【助手】字段是否包含相关方法论');
                }

                resolve(methodologies);

            } catch (error) {
                console.error('飞书数据检索失败:', error);
                reject(error);
            }
        });
    }

    // 创建飞书多维表格字段
    function createFeishuField(baseId, tableId, accessToken, fieldName, fieldType = 1) {
        return new Promise((resolve, reject) => {
            console.log(`正在创建字段: ${fieldName}`);

            const requestData = {
                field_name: fieldName,
                type: fieldType
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${baseId}/tables/${tableId}/fields`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    console.log(`创建字段${fieldName}响应状态:`, response.status);
                    console.log(`创建字段${fieldName}响应内容:`, response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0) {
                            console.log(`字段"${fieldName}"创建成功`);
                            resolve(data.data.field);
                        } else {
                            console.error(`创建字段${fieldName}API错误:`, data);
                            let errorMsg = `创建字段"${fieldName}"失败`;
                            if (data.msg) {
                                errorMsg += ': ' + data.msg;
                            }
                            reject(new Error(errorMsg));
                        }
                    } catch (e) {
                        console.error(`解析创建字段${fieldName}响应失败:`, e, '原始响应:', response.responseText);
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error(`创建字段${fieldName}网络请求失败:`, error);
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 获取飞书多维表格字段列表
    function getFeishuFields(baseId, tableId, accessToken, retryCount = 0) {
        return new Promise((resolve, reject) => {
            console.log('正在获取飞书表格字段列表...');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${baseId}/tables/${tableId}/fields`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                timeout: 30000, // 增加超时时间到30秒
                onload: function(response) {
                    console.log('获取字段列表响应状态:', response.status);

                    // 检查响应是否完整
                    if (!response.responseText || response.responseText.trim() === '') {
                        console.warn('获取到空响应，尝试重试...');
                        if (retryCount < 3) {
                            setTimeout(() => {
                                getFeishuFields(baseId, tableId, accessToken, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000 * (retryCount + 1));
                            return;
                        } else {
                            reject(new Error('获取字段列表失败：响应为空'));
                            return;
                        }
                    }

                    // 检查响应是否被截断
                    const responseText = response.responseText.trim();
                    if (!responseText.endsWith('}') && !responseText.endsWith(']')) {
                        console.warn('响应可能被截断，尝试重试...', '响应长度:', responseText.length);
                        if (retryCount < 3) {
                            setTimeout(() => {
                                getFeishuFields(baseId, tableId, accessToken, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000 * (retryCount + 1));
                            return;
                        }
                    }

                    console.log('获取字段列表响应内容长度:', responseText.length);
                    console.log('获取字段列表响应内容:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));

                    try {
                        const data = JSON.parse(responseText);
                        if (data.code === 0) {
                            const fields = data.data.items || [];
                            console.log(`获取到 ${fields.length} 个字段`);
                            resolve(fields);
                        } else {
                            console.error('获取字段列表API错误:', data);
                            reject(new Error(data.msg || '获取字段列表失败'));
                        }
                    } catch (e) {
                        console.error('解析获取字段列表响应失败:', e);
                        console.error('原始响应长度:', responseText.length);
                        console.error('原始响应前500字符:', responseText.substring(0, 500));

                        // 如果是JSON解析错误且还有重试次数，尝试重试
                        if (retryCount < 3) {
                            console.log(`JSON解析失败，进行第${retryCount + 1}次重试...`);
                            setTimeout(() => {
                                getFeishuFields(baseId, tableId, accessToken, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 2000 * (retryCount + 1));
                            return;
                        }

                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('获取字段列表网络请求失败:', error);
                    if (retryCount < 3) {
                        console.log(`网络请求失败，进行第${retryCount + 1}次重试...`);
                        setTimeout(() => {
                            getFeishuFields(baseId, tableId, accessToken, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 2000 * (retryCount + 1));
                        return;
                    }
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    console.error('获取字段列表请求超时');
                    if (retryCount < 3) {
                        console.log(`请求超时，进行第${retryCount + 1}次重试...`);
                        setTimeout(() => {
                            getFeishuFields(baseId, tableId, accessToken, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        }, 3000 * (retryCount + 1));
                        return;
                    }
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 确保必要字段存在
    async function ensureRequiredFields(baseId, tableId, accessToken) {
        try {
            console.log('检查并创建必要字段...');

            // 获取现有字段
            const existingFields = await getFeishuFields(baseId, tableId, accessToken);
            const fieldNames = existingFields.map(field => field.field_name);

            // 定义必要字段
             const requiredFields = [
                 { name: '标题', type: 1 },      // 文本
                 { name: '内容', type: 1 },      // 文本
                 { name: '关键词', type: 1 },    // 文本
                 { name: '助手', type: 1 },      // 文本
                 { name: '创建时间', type: 1 }   // 文本（也可以用1001创建时间类型）
             ];

            // 检查并创建缺失的字段
            for (const field of requiredFields) {
                if (!fieldNames.includes(field.name)) {
                    console.log(`字段"${field.name}"不存在，正在创建...`);
                    try {
                        await createFeishuField(baseId, tableId, accessToken, field.name, field.type);
                        console.log(`字段"${field.name}"创建成功`);
                    } catch (error) {
                        console.warn(`创建字段"${field.name}"失败:`, error.message);
                        // 继续创建其他字段，不中断流程
                    }
                } else {
                    console.log(`字段"${field.name}"已存在`);
                }
            }

            console.log('字段检查完成');
        } catch (error) {
            console.error('检查字段时出错:', error);
            throw error;
        }
    }

    // 添加方法论到飞书知识库
    function addToFeishu(title, content, keywords = '') {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await getFeishuAccessToken();

                // 确保必要字段存在
                try {
                    await ensureRequiredFields(FEISHU_CONFIG.BASE_ID, FEISHU_CONFIG.TABLE_ID, token);
                } catch (fieldError) {
                    console.warn('字段检查失败，但继续尝试添加数据:', fieldError.message);
                }

                const requestData = {
                    records: [{
                        fields: {
                            '标题': title,
                            '内容': content,
                            '关键词': keywords,
                            '创建时间': new Date().toISOString()
                        }
                    }]
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${FEISHU_CONFIG.API_URL}/bitable/v1/apps/${FEISHU_CONFIG.BASE_ID}/tables/${FEISHU_CONFIG.TABLE_ID}/records/batch_create`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(requestData),
                    onload: function(response) {
                        console.log('飞书添加记录响应状态:', response.status);
                        console.log('飞书添加记录响应内容:', response.responseText);
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 0) {
                                resolve(data.data);
                            } else {
                                console.error('飞书添加记录API错误:', data);
                                let errorMsg = '添加到飞书失败';
                                if (data.msg) {
                                    errorMsg += ': ' + data.msg;
                                }
                                if (response.status === 403 || data.msg?.includes('Forbidden')) {
                                    errorMsg = '飞书应用权限不足，请检查应用权限配置：\n1. 确保应用有"查看、编辑、新增和删除多维表格"权限\n2. 确保应用已发布并获得管理员审批\n3. 检查Base ID和Table ID是否正确';
                                }
                                reject(new Error(errorMsg));
                            }
                        } catch (e) {
                            console.error('解析飞书添加记录响应失败:', e, '原始响应:', response.responseText);
                            reject(new Error('响应解析失败: ' + e.message));
                        }
                    },
                    onerror: function(error) {
                        console.error('飞书添加记录网络请求失败:', error);
                        reject(new Error('网络请求失败'));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    // ==================== AI增强相关 ====================

    // 调用AI API增强提示词
    function enhancePromptWithAI(userInput, methodologyContext = '') {
        return new Promise((resolve, reject) => {
            const systemPrompt = `扮演一名提示词工程师，根据我接下来为你提供的需求、相关方法论和示例，创建一个可以满足需求的提示词。

## 创作方法
1. 分析需求：理解或挖掘需求的背景和目标，尽可能详细的提供在提示词中，但不要意向编造需求中未描述的信息；
2. 方法论挑选：我会为你提供 0-3个与用户需求相关的方法论，你可以选择其中 1 个或整合多个，放在提示词中。如果接下来的信息中不包含方法论，可以省略。
3. 我为你提供的信息中可能会包含参考示例，从中选择与需求的输出相关的示例，放在提示词中。如果未提供示例，则省略这部分。

## 提示词框架
在创建提示词时，参考以下框架：

# 扮演角色：
为 AI 定义角色，让它由通用的"助理"，变成更擅长处理具体工作的定向角色，可以使用职业来描述定义。

## 做什么：
向 AI 尽可能详细的描述任务的背景信息，可以调用它更多的"知识记忆"。

## 怎么做：
把你完成这项任务的成熟方法论告诉AI，可以确保 AI 按照预期的方法完成任务，几个tips：
1）如果能给出完成任务的步骤，并要求 AI 输出过程指标，效果会非常棒；
2）可以使用现成的方法论或者理论知识框架，即便你并不能熟练的应用它；
3）如果你不知道这项工作的方法，可以先向 AI 询问，从它推荐的方法中选择你觉得靠谱的。

## 参考示例：
"怎么做"和"结果要求"中你可能列不出全面的信息，让 AI 自己在示例中学习。保留示例前后的代码块分隔符。

## 结果要求：
为 AI 列出输出的要求，包括格式、结构等。
另一个重要的提示：为了防止 AI 胡编乱造，有些时候可以在要求为 AI 留出路，类似"如果你无法执行这个任务，可以回复XXX"。

## 输出要求
直接输出优化后的提示词，不要包含任何解释或说明。确保提示词清晰、具体、可执行。`;

            let userPrompt = `用户需求：
<user_query>
${userInput}
</user_query>`;

            if (methodologyContext && methodologyContext.trim()) {
                userPrompt += `

可选方法论支持
<methodology>
${methodologyContext}
</methodology>`;
            }

            const requestData = {
                model: AI_CONFIG.MODEL_NAME,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            };

            console.log('发送AI请求到:', `${AI_CONFIG.BASE_URL}/chat/completions`);
            console.log('AI配置:', {
                MODEL_NAME: AI_CONFIG.MODEL_NAME,
                BASE_URL: AI_CONFIG.BASE_URL,
                API_KEY: AI_CONFIG.API_KEY ? '已配置' : '未配置'
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${AI_CONFIG.BASE_URL}/chat/completions`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    console.log('AI响应状态:', response.status);
                    console.log('AI响应内容:', response.responseText);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices[0] && data.choices[0].message) {
                            resolve(data.choices[0].message.content.trim());
                        } else {
                            console.error('AI响应格式异常:', data);
                            reject(new Error('AI响应格式异常: ' + JSON.stringify(data)));
                        }
                    } catch (e) {
                        console.error('解析AI响应失败:', e, '原始响应:', response.responseText);
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    console.error('AI网络请求失败:', error);
                    reject(new Error('AI请求失败，请检查网络连接和API配置'));
                },
                ontimeout: function() {
                    console.error('AI请求超时');
                    reject(new Error('AI请求超时'));
                }
            });
        });
    }

    // ==================== 输入处理相关 ====================

    // 输入处理器类
    class InputHandler {
        constructor(element, inputType) {
            this.element = element;
            this.inputType = inputType;
        }

        getInputText() {
            switch (this.inputType) {
                case 'textarea':
                    return this.element.value || '';
                case 'contenteditable':
                    return this.getContentEditableText();
                default:
                    return '';
            }
        }

        setInputText(text) {
            try {
                switch (this.inputType) {
                    case 'textarea':
                        this.setTextareaValue(text);
                        break;
                    case 'contenteditable':
                        this.setContentEditableText(text);
                        break;
                    default:
                        this.element.textContent = text;
                }

                this.triggerInput();

            } catch (error) {
                console.error('设置输入文本失败:', error);
                // 回退方案
                try {
                    if (this.element.value !== undefined) {
                        this.element.value = text;
                    } else {
                        this.element.textContent = text;
                    }
                    this.triggerInput();
                } catch (fallbackError) {
                    console.error('回退设置也失败:', fallbackError);
                }
            }
        }

        focus() {
            try {
                this.element.focus();
                if (this.inputType === 'contenteditable') {
                    this.setCursorToEnd();
                }
            } catch (e) {
                console.warn('聚焦失败:', e);
            }
        }

        getContentEditableText() {
            return this.element.textContent || '';
        }

        setTextareaValue(text) {
            try {
                const element = this.element;
                const start = element.selectionStart;
                element.value = text;
                const newPos = Math.min(text.length, start + text.length);
                element.setSelectionRange(newPos, newPos);
            } catch (e) {
                console.warn('设置textarea值失败:', e);
            }
        }

        setContentEditableText(text) {
            try {
                if (this.isKimiEditor()) {
                    this.setKimiEditorText(text);
                } else {
                    this.element.textContent = text;
                }
            } catch (e) {
                console.warn('设置contenteditable文本失败:', e);
                this.element.textContent = text;
            }
        }

        isKimiEditor() {
            return this.element.classList.contains('chat-input-editor') ||
                   this.element.hasAttribute('data-lexical-editor') ||
                   this.element.getAttribute('contenteditable') === 'true' ||
                   this.element.querySelector('[data-lexical-text]') !== null;
        }

        setKimiEditorText(text) {
            try {
                // 清空现有内容
                this.element.innerHTML = '';

                // 创建段落元素
                const p = document.createElement('p');
                p.setAttribute('dir', 'ltr');

                // 处理文本内容
                const lines = text.split('\n');

                lines.forEach((line, index) => {
                    if (index > 0) {
                        p.appendChild(document.createElement('br'));
                    }
                    if (line.trim()) {
                        const span = document.createElement('span');
                        span.setAttribute('data-lexical-text', 'true');
                        span.textContent = line;
                        p.appendChild(span);
                    }
                });

                // 如果没有内容，添加默认span
                if (p.children.length === 0) {
                    const span = document.createElement('span');
                    span.setAttribute('data-lexical-text', 'true');
                    span.textContent = text || '';
                    p.appendChild(span);
                }

                // 添加到编辑器
                this.element.appendChild(p);

                // 触发输入事件
                this.triggerInput();

                // 延迟设置光标和触发框架事件
                setTimeout(() => {
                    this.setCursorToEnd();
                    this.triggerFrameworkEvents();
                }, 100);

                // 额外的兼容性处理
                setTimeout(() => {
                    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                    this.element.dispatchEvent(inputEvent);

                    if (this.element._lexicalEditor) {
                        try {
                            this.element._lexicalEditor.update(() => {});
                        } catch (lexicalError) {
                            console.warn('Lexical编辑器更新失败:', lexicalError);
                        }
                    }
                }, 200);

            } catch (e) {
                console.error('设置Kimi编辑器文本失败:', e);
                this.element.textContent = text;
                this.triggerInput();
            }
        }

        setCursorToEnd() {
            try {
                const range = document.createRange();
                range.selectNodeContents(this.element);
                range.collapse(false);
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } catch (e) {
                console.warn('设置光标位置失败:', e);
            }
        }

        triggerInput() {
            ['input', 'change', 'keyup', 'blur'].forEach(eventType => {
                try {
                    const event = new Event(eventType, { bubbles: true, cancelable: true });
                    this.element.dispatchEvent(event);
                } catch (e) {
                    console.warn(`触发 ${eventType} 事件失败:`, e);
                }
            });
            this.triggerFrameworkEvents();
        }

        triggerFrameworkEvents() {
            try {
                // React事件触发
                const reactKeys = Object.keys(this.element).filter(key =>
                    key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber')
                );
                if (reactKeys.length > 0) {
                    const event = new Event('input', { bubbles: true });
                    event.simulated = true;
                    this.element.dispatchEvent(event);
                }

                // Vue事件触发
                if (this.element.__vue__) {
                    const event = new CustomEvent('input', {
                        bubbles: true,
                        detail: { value: this.getInputText() }
                    });
                    this.element.dispatchEvent(event);
                }
            } catch (e) {
                console.warn('触发框架事件失败:', e);
            }
        }
    }

    // ==================== 按钮注入相关 ====================

    // 创建增强按钮
    function createEnhanceButton() {
        const button = document.createElement('div');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.className = 'prompt-enhancer-button';
        button.innerHTML = getButtonContent();
        button.title = '使用方法论增强提示词';
        button.setAttribute('data-testid', 'prompt-enhancer-button');

        button.addEventListener('click', handleEnhanceClick);
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                handleEnhanceClick();
            }
        });

        return button;
    }

    // 获取按钮内容
    function getButtonContent() {
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
        </svg>`;

        return `${icon} <span>P增强</span>`;
    }

    // 注入按钮到页面
    async function injectButton() {
        const siteConfig = SITE_CONFIGS[currentSiteType];
        if (!siteConfig) return false;

        const container = await waitForElement(siteConfig.buttonContainerSelector);
        if (!container) {
            console.warn('未找到按钮容器');
            return false;
        }

        const inputElement = await waitForElement(siteConfig.inputSelector);
        if (!inputElement) {
            console.warn('未找到输入元素');
            return false;
        }

        inputHandler = new InputHandler(inputElement, siteConfig.inputType);
        enhanceButton = createEnhanceButton();

        // 根据不同网站调整按钮样式和位置
        switch (currentSiteType) {
            case SiteType.DEEPSEEK:
                injectForDeepSeek(container);
                break;
            case SiteType.KIMI:
                injectForKimi(container);
                break;
            case SiteType.DOUBAO:
                injectForDoubao(container);
                break;
            default:
                container.appendChild(enhanceButton);
        }

        console.log('增强按钮注入成功');
        return true;
    }

    // DeepSeek网站特殊处理
    function injectForDeepSeek(container) {
        if (!enhanceButton) return;

        enhanceButton.style.cssText += `
            margin-right: 8px;
            cursor: pointer;
        `;

        container.appendChild(enhanceButton);
    }

    // Kimi网站特殊处理
    function injectForKimi(container) {
        if (!enhanceButton) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'researcher-switch-container';
        wrapper.style.cssText = `
            display: flex;
            align-items: center;
            margin-right: 8px;
        `;

        enhanceButton.style.cssText += `
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: rgba(0, 0, 0, 0.05);
            border: none;
            border-radius: 16px;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease, color 0.2s ease;
            white-space: nowrap;
        `;

        wrapper.appendChild(enhanceButton);
        container.appendChild(wrapper);
    }

    // 豆包网站特殊处理
    function injectForDoubao(container) {
        if (!enhanceButton) return;

        const deepThinkButton = container.querySelector('[data-testid="deep_think_select_button"]');
        if (deepThinkButton && deepThinkButton.parentElement) {
            deepThinkButton.parentElement.insertBefore(enhanceButton, deepThinkButton.nextSibling);
        } else {
            container.appendChild(enhanceButton);
        }

        enhanceButton.style.cssText += `
            flex-shrink: 0;
            margin-left: 8px;
            margin-right: 8px;
        `;
    }

    // ==================== 事件处理 ====================

    // 处理增强按钮点击
    async function handleEnhanceClick() {
        if (!inputHandler) {
            console.error('输入处理器未初始化');
            showTooltip('系统未初始化，请刷新页面重试');
            return;
        }

        try {
            const userInput = inputHandler.getInputText();
            if (!userInput || userInput.trim().length === 0) {
                showTooltip('请先输入内容');
                return;
            }

            setButtonState(ButtonState.LOADING);
            setFloatingEnhancerState('loading');
            let knowledgeBaseStatus = '未使用';

            // 从飞书知识库检索相关方法论
            console.log('正在检索知识库...');
            let methodologyContext = '';
            let methodologyCount = 0;

            try {
                // 检查飞书配置是否完整
                const hasFeishuConfig = FEISHU_CONFIG.APP_ID && FEISHU_CONFIG.APP_SECRET &&
                                       FEISHU_CONFIG.BASE_ID && FEISHU_CONFIG.TABLE_ID;

                if (hasFeishuConfig) {
                    const methodologies = await retrieveFromFeishu(userInput);
                    if (methodologies && methodologies.length > 0) {
                        methodologyContext = methodologies.map((m, index) =>
                            `【相关方法论 ${index + 1}】\n标题: ${m.title}\n助手内容: ${m.assistant}\n关键词: ${m.keywords}`
                        ).join('\n\n');
                        methodologyCount = methodologies.length;
                        knowledgeBaseStatus = `找到${methodologyCount}个相关方法论`;
                        console.log('找到相关方法论:', methodologyCount, '个');
                        console.log('方法论上下文内容长度:', methodologyContext.length);
                        console.log('方法论上下文预览:', methodologyContext.substring(0, 300) + '...');
                    } else {
                        knowledgeBaseStatus = '未找到相关方法论';
                        console.log('未找到相关方法论，将使用纯AI增强');
                    }
                } else {
                    knowledgeBaseStatus = '飞书配置不完整';
                    console.log('飞书配置不完整，跳过知识库检索，使用纯AI增强');
                }
            } catch (error) {
                knowledgeBaseStatus = `检索失败: ${error.message}`;
                console.warn('知识库检索失败:', error.message);
                console.log('知识库检索失败，将继续使用纯AI增强');
            }

            // 使用AI增强提示词
            console.log('正在AI增强...');
            console.log('用户输入:', userInput);
            console.log('是否有方法论上下文:', methodologyContext ? '是' : '否');
            try {
                const enhancedText = await enhancePromptWithAI(userInput, methodologyContext);
                console.log('AI增强完成，增强后文本长度:', enhancedText.length);
                console.log('增强后文本预览:', enhancedText.substring(0, 200) + '...');

                // 自动复制、清空并粘贴增强后的文本
                console.log('正在复制增强后的文本到剪切板...');
                try {
                    // 使用现代剪切板API复制文本
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(enhancedText);
                        console.log('文本已复制到剪切板');
                    } else {
                        // 回退到传统方法
                        const textArea = document.createElement('textarea');
                        textArea.value = enhancedText;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        console.log('文本已复制到剪切板（传统方法）');
                    }

                    // 立即清空输入框并使用剪切板粘贴
                    console.log('正在清空输入框并使用剪切板粘贴...');

                    // 聚焦输入框
                    inputHandler.focus();
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // 全选当前输入框内容
                    console.log('正在全选输入框内容...');
                    if (inputHandler.inputType === 'textarea') {
                        inputHandler.element.select();
                    } else {
                        // 对于contenteditable，使用Selection API全选
                        const range = document.createRange();
                        range.selectNodeContents(inputHandler.element);
                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // 使用剪切板粘贴替换选中内容
                    console.log('正在使用剪切板粘贴...');
                    try {
                        // 尝试使用现代剪切板API粘贴
                        if (navigator.clipboard && navigator.clipboard.readText) {
                            const clipboardText = await navigator.clipboard.readText();
                            if (clipboardText === enhancedText) {
                                // 模拟Ctrl+V粘贴
                                const pasteEvent = new KeyboardEvent('keydown', {
                                    key: 'v',
                                    code: 'KeyV',
                                    ctrlKey: true,
                                    bubbles: true,
                                    cancelable: true
                                });
                                inputHandler.element.dispatchEvent(pasteEvent);

                                // 也尝试paste事件
                                const clipboardData = new DataTransfer();
                                clipboardData.setData('text/plain', enhancedText);
                                const pasteEventClipboard = new ClipboardEvent('paste', {
                                    clipboardData: clipboardData,
                                    bubbles: true,
                                    cancelable: true
                                });
                                inputHandler.element.dispatchEvent(pasteEventClipboard);
                            }
                        }

                        // 等待粘贴完成
                        await new Promise(resolve => setTimeout(resolve, 300));

                        // 验证粘贴结果
                        const finalText = inputHandler.getInputText();
                        if (finalText.includes(enhancedText.substring(0, 100))) {
                            console.log('剪切板粘贴操作成功完成');
                        } else {
                            console.warn('剪切板粘贴失败，回退到直接设置文本');
                            // 回退到直接设置文本
                            inputHandler.setInputText(enhancedText);
                        }

                    } catch (clipboardPasteError) {
                        console.warn('剪切板粘贴失败，回退到直接设置文本:', clipboardPasteError);
                        // 回退到直接设置文本
                        inputHandler.setInputText(enhancedText);
                    }

                } catch (error) {
                    console.error('自动复制粘贴失败:', error);
                    // 回退到直接设置文本
                    inputHandler.setInputText(enhancedText);
                    inputHandler.focus();
                }

                setButtonState(ButtonState.SUCCESS);
                setFloatingEnhancerState('success');

                // 显示增强结果信息
                const successMessage = methodologyCount > 0
                    ? `增强完成！已自动复制并粘贴（使用了${methodologyCount}个方法论）`
                    : '增强完成！已自动复制并粘贴（纯AI增强）';
                showTooltip(successMessage);

                setTimeout(() => {
                    setButtonState(ButtonState.NORMAL);
                    setFloatingEnhancerState('normal');
                }, 2000);

                console.log(`增强完成 - 知识库状态: ${knowledgeBaseStatus}`);

            } catch (aiError) {
                console.error('AI增强失败:', aiError);
                setButtonState(ButtonState.ERROR);
                setFloatingEnhancerState('error');

                // 提供更详细的错误信息
                let errorMessage = 'AI增强失败';
                if (aiError.message) {
                    if (aiError.message.includes('API')) {
                        errorMessage = 'AI API调用失败，请检查配置';
                    } else if (aiError.message.includes('网络')) {
                        errorMessage = '网络连接失败，请重试';
                    } else {
                        errorMessage = `AI增强失败: ${aiError.message}`;
                    }
                }

                showTooltip(errorMessage);

                setTimeout(() => {
                    setButtonState(ButtonState.NORMAL);
                    setFloatingEnhancerState('normal');
                }, 3000);

                throw aiError; // 重新抛出错误以便外层catch处理
            }

        } catch (error) {
            console.error('增强处理失败:', error);

            // 如果还没有设置错误状态，设置它
            if (!enhanceButton?.classList.contains('pe-error')) {
                setButtonState(ButtonState.ERROR);
                setFloatingEnhancerState('error');
                showTooltip('增强失败，请重试');
                setTimeout(() => {
                    setButtonState(ButtonState.NORMAL);
                    setFloatingEnhancerState('normal');
                }, 3000);
            }
        }
    }

    // 设置按钮状态
    function setButtonState(state) {
        if (!enhanceButton) return;

        enhanceButton.classList.remove('pe-loading', 'pe-success', 'pe-error');

        switch (state) {
            case ButtonState.LOADING:
                enhanceButton.classList.add('pe-loading');
                enhanceButton.disabled = true;
                updateButtonContent('增强中...');
                break;
            case ButtonState.SUCCESS:
                enhanceButton.classList.add('pe-success');
                enhanceButton.disabled = false;
                updateButtonContent('✓ 已增强');
                break;
            case ButtonState.ERROR:
                enhanceButton.classList.add('pe-error');
                enhanceButton.disabled = false;
                updateButtonContent('× 失败');
                break;
            default:
                enhanceButton.disabled = false;
                enhanceButton.innerHTML = getButtonContent();
        }
    }

    // 更新按钮内容
    function updateButtonContent(text) {
        if (!enhanceButton) return;

        const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
        </svg>`;

        enhanceButton.innerHTML = `${icon} <span>${text}</span>`;
    }

    // 显示提示
    function showTooltip(message) {
        if (!enhanceButton) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'pe-tooltip';
        tooltip.textContent = message;

        enhanceButton.style.position = 'relative';
        enhanceButton.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // ==================== 配置面板 ====================

    // 创建配置面板
    function createConfigPanel() {
        // 检查是否已存在配置面板
        const existingPanel = document.querySelector('.pe-config-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.className = 'pe-config-panel';
        // 创建配置面板HTML结构
        const headerDiv = document.createElement('div');
        headerDiv.className = 'pe-config-header';
        headerDiv.innerHTML = '<h2>AI提示词增强器 - 配置</h2><button class="pe-close-btn">×</button>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'pe-config-content';

        // 飞书配置区域
        const feishuSection = document.createElement('div');
        feishuSection.className = 'pe-config-section';
        feishuSection.innerHTML = `
            <h3>飞书多维表格配置</h3>
            <div class="pe-form-group">
                <label>App ID:</label>
                <input type="text" id="feishu-app-id" placeholder="请输入飞书应用的App ID">
            </div>
            <div class="pe-form-group">
                <label>App Secret:</label>
                <input type="password" id="feishu-app-secret" placeholder="请输入飞书应用的App Secret">
            </div>
            <div class="pe-form-group">
                <label>飞书表格URL (可选):</label>
                <input type="text" id="feishu-table-url" placeholder="输入完整的飞书多维表格URL，将自动解析Base ID和Table ID">
                <small style="color: #666; font-size: 12px; display: block; margin-top: 4px;">例如: https://example.feishu.cn/base/T1M4bzmLLarNLhs5jcEcwAcRn8Q?table=tbliBckxa87pskV8</small>
            </div>
            <div class="pe-form-group">
                <label>Base ID:</label>
                <input type="text" id="feishu-base-id" placeholder="请输入多维表格的Base ID">
            </div>
            <div class="pe-form-group">
                <label>Table ID:</label>
                <input type="text" id="feishu-table-id" placeholder="请输入数据表的Table ID">
            </div>
        `;

        // AI配置区域
        const aiSection = document.createElement('div');
        aiSection.className = 'pe-config-section';
        aiSection.innerHTML = `
            <h3>AI模型配置</h3>
            <div class="pe-form-group">
                <label>模型名称:</label>
                <input type="text" id="ai-model-name" placeholder="如: moonshot-v1-8k">
            </div>
            <div class="pe-form-group">
                <label>API Base URL:</label>
                <input type="text" id="ai-base-url" placeholder="如: https://api.moonshot.cn/v1">
            </div>
            <div class="pe-form-group">
                <label>API Key:</label>
                <input type="password" id="ai-api-key" placeholder="请输入AI模型的API Key">
            </div>
        `;

        // 按钮区域
        const buttonSection = document.createElement('div');
        buttonSection.className = 'pe-config-section';
        buttonSection.innerHTML = `
            <button class="pe-button pe-button-primary" id="save-config-btn">保存配置</button>
            <button class="pe-button pe-button-secondary" id="test-config-btn">测试连接</button>
        `;

        // 组装面板
        contentDiv.appendChild(feishuSection);
        contentDiv.appendChild(aiSection);
        contentDiv.appendChild(buttonSection);

        panel.appendChild(headerDiv);
        panel.appendChild(contentDiv);

        // 设置当前配置值
        setTimeout(() => {
            const appIdInput = document.getElementById('feishu-app-id');
            const appSecretInput = document.getElementById('feishu-app-secret');
            const tableUrlInput = document.getElementById('feishu-table-url');
            const baseIdInput = document.getElementById('feishu-base-id');
            const tableIdInput = document.getElementById('feishu-table-id');
            const modelNameInput = document.getElementById('ai-model-name');
            const baseUrlInput = document.getElementById('ai-base-url');
            const apiKeyInput = document.getElementById('ai-api-key');

            if (appIdInput) appIdInput.value = FEISHU_CONFIG.APP_ID || '';
            if (appSecretInput) appSecretInput.value = FEISHU_CONFIG.APP_SECRET || '';
            if (tableUrlInput) tableUrlInput.value = GM_getValue('feishu_table_url', '') || '';
            if (baseIdInput) baseIdInput.value = FEISHU_CONFIG.BASE_ID || '';
            if (tableIdInput) tableIdInput.value = FEISHU_CONFIG.TABLE_ID || '';
            if (modelNameInput) modelNameInput.value = AI_CONFIG.MODEL_NAME || '';
            if (baseUrlInput) baseUrlInput.value = AI_CONFIG.BASE_URL || '';
            if (apiKeyInput) apiKeyInput.value = AI_CONFIG.API_KEY || '';

            // 添加URL输入框的事件监听器
            if (tableUrlInput) {
                tableUrlInput.addEventListener('input', function() {
                    const url = this.value.trim();
                    if (url) {
                        try {
                            const { baseId, tableId } = parseFeishuUrl(url);
                            if (baseIdInput) baseIdInput.value = baseId;
                            if (tableIdInput) tableIdInput.value = tableId;

                            // 显示成功提示
                            const small = this.nextElementSibling;
                            if (small) {
                                small.style.color = '#28a745';
                                small.textContent = `✓ 解析成功: Base ID=${baseId}, Table ID=${tableId}`;
                                setTimeout(() => {
                                    small.style.color = '#666';
                                    small.textContent = '例如: https://example.feishu.cn/base/T1M4bzmLLarNLhs5jcEcwAcRn8Q?table=tbliBckxa87pskV8';
                                }, 3000);
                            }
                        } catch (error) {
                            // 显示错误提示
                            const small = this.nextElementSibling;
                            if (small) {
                                small.style.color = '#dc3545';
                                small.textContent = `✗ ${error.message}`;
                                setTimeout(() => {
                                    small.style.color = '#666';
                                    small.textContent = '例如: https://example.feishu.cn/base/T1M4bzmLLarNLhs5jcEcwAcRn8Q?table=tbliBckxa87pskV8';
                                }, 3000);
                            }
                        }
                    }
                });
            }
        }, 100);

        document.body.appendChild(panel);

        // 绑定关闭按钮事件
        const closeBtn = panel.querySelector('.pe-close-btn');
        closeBtn.addEventListener('click', () => {
            panel.remove();
        });

        // 绑定保存配置按钮事件
        const saveBtn = panel.querySelector('#save-config-btn');
        saveBtn.addEventListener('click', function() {
            try {
                const appId = document.getElementById('feishu-app-id').value.trim();
                const appSecret = document.getElementById('feishu-app-secret').value.trim();
                const tableUrl = document.getElementById('feishu-table-url').value.trim();
                const baseId = document.getElementById('feishu-base-id').value.trim();
                const tableId = document.getElementById('feishu-table-id').value.trim();
                const modelName = document.getElementById('ai-model-name').value.trim();
                const baseUrl = document.getElementById('ai-base-url').value.trim();
                const apiKey = document.getElementById('ai-api-key').value.trim();

                // 如果有URL但没有手动填写Base ID和Table ID，尝试从URL解析
                let finalBaseId = baseId;
                let finalTableId = tableId;

                if (tableUrl && (!baseId || !tableId)) {
                    try {
                        const parsed = parseFeishuUrl(tableUrl);
                        if (!baseId) finalBaseId = parsed.baseId;
                        if (!tableId) finalTableId = parsed.tableId;
                    } catch (error) {
                        console.warn('URL解析失败:', error.message);
                    }
                }

                // 保存到GM存储
                GM_setValue('feishu_app_id', appId);
                GM_setValue('feishu_app_secret', appSecret);
                GM_setValue('feishu_table_url', tableUrl);
                GM_setValue('feishu_base_id', finalBaseId);
                GM_setValue('feishu_table_id', finalTableId);
                GM_setValue('ai_model_name', modelName);
                GM_setValue('ai_base_url', baseUrl);
                GM_setValue('ai_api_key', apiKey);

                // 清除访问令牌缓存
                accessTokenCache = { token: null, expireTime: 0 };

                console.log('配置已保存');

                // 显示成功提示
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '保存成功',
                        text: '配置已保存',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    alert('配置保存成功！');
                }
            } catch (error) {
                console.error('保存配置失败:', error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '保存失败',
                        text: error.message,
                        icon: 'error'
                    });
                } else {
                    alert('保存配置失败: ' + error.message);
                }
            }
        });

        // 绑定测试配置按钮事件
        const testBtn = panel.querySelector('#test-config-btn');
        testBtn.addEventListener('click', async function() {
            try {
                console.log('开始测试配置...');

                // 显示测试中提示
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '测试中...',
                        text: '正在测试连接',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                }

                // 测试飞书连接
                const token = await getFeishuAccessToken();
                console.log('飞书连接测试成功');

                // 测试字段检查和创建
                try {
                    await ensureRequiredFields(FEISHU_CONFIG.BASE_ID, FEISHU_CONFIG.TABLE_ID, token);
                    console.log('飞书字段检查成功');
                } catch (fieldError) {
                    console.warn('字段检查失败:', fieldError.message);
                }

                // 测试AI连接
                await enhancePromptWithAI('测试连接', '');
                console.log('AI连接测试成功');

                // 显示成功提示
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '测试成功',
                        text: '所有配置都正常工作',
                        icon: 'success'
                    });
                } else {
                    alert('测试成功！所有配置都正常工作');
                }
            } catch (error) {
                console.error('测试配置失败:', error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '测试失败',
                        text: error.message,
                        icon: 'error'
                    });
                } else {
                    alert('测试失败: ' + error.message);
                }
            }
        });
    }

    // ==================== 主初始化逻辑 ====================

    // 主初始化函数
    async function init() {
        try {
            console.log('🚀 开始初始化AI提示词增强器...');
            currentSiteType = detectSiteType();
            console.log('🎯 当前网站类型:', currentSiteType);

            if (currentSiteType === SiteType.UNKNOWN) {
                console.log('❌ 当前网站不受支持，初始化终止');
                return;
            }

            const chatPageResult = isChatPage();
            console.log('📄 聊天页面检查结果:', chatPageResult);
            if (!chatPageResult) {
                console.log('⏳ 当前页面不是聊天页面，设置页面变化监听...');
                setupPageChangeListener();
                return;
            }

            console.log(`✅ AI提示词增强器已加载，网站类型: ${currentSiteType}`);
            console.log('🔧 开始添加样式和初始化组件...');

            // 添加样式
            addStyles();

            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeEnhancer);
            } else {
                await initializeEnhancer();
            }

        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 初始化增强器
    async function initializeEnhancer() {
        if (isInitialized) return;

        try {
            console.log('等待页面元素加载...');

            const success = await injectButton();
            if (success) {
                isInitialized = true;
                console.log('AI提示词增强器初始化完成');

                // 设置页面变化监听
                setupMutationObserver();

                // 添加快捷键支持
                setupKeyboardShortcuts();

                // 检查配置完整性
                checkConfigCompleteness();
            } else {
                console.warn('按钮注入失败，将在页面变化时重试');
                setupRetryMechanism();
            }
        } catch (error) {
            console.error('增强器初始化失败:', error);
            setupRetryMechanism();
        }
    }

    // 设置页面变化监听
    function setupPageChangeListener() {
        let currentUrl = window.location.href;

        const checkUrlChange = () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                if (isChatPage()) {
                    console.log('检测到跳转到聊天页面，开始初始化...');
                    isInitialized = false;
                    setTimeout(() => initializeEnhancer(), 1000);
                }
            }
        };

        setInterval(checkUrlChange, 1000);

        // 监听popstate事件
        window.addEventListener('popstate', () => {
            setTimeout(checkUrlChange, 100);
        });
    }

    // 设置DOM变化监听
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldReinject = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查按钮是否还在页面中
                    if (enhanceButton && !document.contains(enhanceButton)) {
                        shouldReinject = true;
                    }
                }
            });

            if (shouldReinject) {
                console.log('检测到页面变化，重新注入按钮...');
                setTimeout(() => {
                    isInitialized = false;
                    initializeEnhancer();
                }, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 设置重试机制
    function setupRetryMechanism() {
        setTimeout(() => {
            if (!isInitialized) {
                console.log('重试初始化...');
                initializeEnhancer();
            }
        }, 3000);
    }

    // 设置键盘快捷键
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + P 打开配置面板
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                createConfigPanel();
            }

            // Ctrl/Cmd + Enter 触发增强
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeElement = document.activeElement;
                const siteConfig = SITE_CONFIGS[currentSiteType];
                if (siteConfig && activeElement && activeElement.matches(siteConfig.inputSelector)) {
                    e.preventDefault();
                    handleEnhanceClick();
                }
            }
        });
    }

    // 检查配置完整性
    function checkConfigCompleteness() {
        const hasFeishuConfig = FEISHU_CONFIG.APP_ID && FEISHU_CONFIG.APP_SECRET &&
                               FEISHU_CONFIG.BASE_ID && FEISHU_CONFIG.TABLE_ID;
        const hasAIConfig = AI_CONFIG.API_KEY && AI_CONFIG.BASE_URL && AI_CONFIG.MODEL_NAME;

        if (!hasFeishuConfig || !hasAIConfig) {
            setTimeout(() => {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '配置不完整',
                        text: '请先配置飞书多维表格和AI模型信息。按 Ctrl+Shift+P 打开配置面板。',
                        icon: 'warning',
                        confirmButtonText: '打开配置',
                        showCancelButton: true,
                        cancelButtonText: '稍后配置'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            createConfigPanel();
                        }
                    });
                }
            }, 2000);
        }
    }

    // ==================== 文章采集功能 ====================

    // 采集当前页面内容到飞书知识库
    async function collectCurrentPage() {
        try {
            // 检查飞书配置
            const hasFeishuConfig = FEISHU_CONFIG.APP_ID && FEISHU_CONFIG.APP_SECRET &&
                                   FEISHU_CONFIG.BASE_ID && FEISHU_CONFIG.TABLE_ID;

            if (!hasFeishuConfig) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '配置不完整',
                        text: '请先配置飞书多维表格信息',
                        icon: 'warning',
                        confirmButtonText: '打开配置'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            createConfigPanel();
                        }
                    });
                } else {
                    alert('请先配置飞书多维表格信息');
                }
                return;
            }

            // 显示采集中提示
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '采集中...',
                    text: '正在采集页面内容到飞书知识库',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
            }

            // 获取页面信息
            const title = document.title || '未知标题';
            const url = window.location.href;
            const content = extractPageContent();
            const keywords = extractKeywords(content);

            // 构建要保存的内容
            const fullContent = `来源：${url}\n\n${content}`;

            // 保存到飞书
            await addToFeishu(title, fullContent, keywords);

            // 显示成功提示
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '采集成功',
                    text: `已将「${title}」采集到飞书知识库`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                alert(`采集成功！已将「${title}」保存到飞书知识库`);
            }

        } catch (error) {
            console.error('采集页面失败:', error);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '采集失败',
                    text: error.message,
                    icon: 'error'
                });
            } else {
                alert('采集失败: ' + error.message);
            }
        }
    }

    // 提取页面主要内容
    function extractPageContent() {
        // 尝试获取文章主体内容
        const selectors = [
            'article',
            '[role="main"]',
            '.content',
            '.article-content',
            '.post-content',
            '.entry-content',
            'main',
            '#content',
            '.markdown-body'
        ];

        let content = '';

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                content = element.innerText || element.textContent || '';
                if (content.trim().length > 100) {
                    break;
                }
            }
        }

        // 如果没有找到合适的内容，使用body内容但过滤掉导航等
        if (!content || content.trim().length < 100) {
            const body = document.body.cloneNode(true);

            // 移除不需要的元素
            const removeSelectors = [
                'nav', 'header', 'footer', 'aside',
                '.nav', '.header', '.footer', '.sidebar',
                '.menu', '.navigation', '.ads', '.advertisement'
            ];

            removeSelectors.forEach(selector => {
                const elements = body.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });

            content = body.innerText || body.textContent || '';
        }

        // 清理内容
        content = content
            .replace(/\s+/g, ' ')  // 多个空白字符替换为单个空格
            .replace(/\n\s*\n/g, '\n')  // 多个换行替换为单个换行
            .trim();

        // 限制长度
        if (content.length > 5000) {
            content = content.substring(0, 5000) + '...';
        }

        return content;
    }

    // 提取关键词
    function extractKeywords(content) {
        // 简单的关键词提取
        const title = document.title || '';
        const url = window.location.href;

        let keywords = [];

        // 从标题提取
        if (title) {
            keywords.push(title.split(/[\s\-_|]+/).filter(word => word.length > 1).slice(0, 3));
        }

        // 从URL提取
        const domain = new URL(url).hostname.replace('www.', '');
        keywords.push(domain);

        // 从内容提取（简单实现）
        const contentWords = content
            .replace(/[^\u4e00-\u9fffA-Za-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2)
            .slice(0, 5);

        keywords.push(...contentWords);

        return keywords.flat().filter(Boolean).join(', ');
    }

    // 创建浮动采集按钮
    function createFloatingCollectButton() {
        // 检查是否已存在按钮
        if (document.getElementById('pe-floating-collect-btn')) {
            return;
        }

        const button = document.createElement('div');
        button.id = 'pe-floating-collect-btn';
        button.innerHTML = `
            <div class="pe-floating-btn-content">
                📚 采集到飞书
            </div>
        `;

        // 添加样式
        button.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 10000;
            background: #007bff;
            color: white;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            transition: all 0.3s ease;
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-50%) scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(-50%) scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
        });

        // 点击事件
        button.addEventListener('click', collectCurrentPage);

        // 右键显示配置
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            createConfigPanel();
        });

        document.body.appendChild(button);

        // 添加提示
        setTimeout(() => {
            if (button.parentElement) {
                const tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: fixed;
                    top: 50%;
                    right: 200px;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 10001;
                    pointer-events: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                `;
                tooltip.textContent = '右键打开配置';
                document.body.appendChild(tooltip);

                setTimeout(() => {
                    if (tooltip.parentElement) {
                        tooltip.remove();
                    }
                }, 3000);
            }
        }, 1000);
    }

    // 注册菜单命令
    function registerMenuCommands() {
        try {
            // 注册采集页面命令
            GM_registerMenuCommand('📚 采集当前页面到飞书知识库', collectCurrentPage);

            // 注册配置面板命令
            GM_registerMenuCommand('⚙️ 打开配置面板', createConfigPanel);

            console.log('菜单命令注册成功');
        } catch (error) {
            console.warn('菜单命令注册失败:', error);
        }
    }

    // ==================== 启动脚本 ====================

    // 创建右侧悬浮增强窗（专门用于DeepSeek等AI网站）
    function createFloatingEnhancer() {
        // 重新检测网站类型，确保准确
        const siteType = detectSiteType();
        console.log('悬浮窗创建时检测到的网站类型:', siteType);

        // 只在支持的AI网站上显示
        if (siteType === SiteType.UNKNOWN) {
            console.log('未识别的网站类型，不创建悬浮窗');
            return;
        }

        // 检查是否已存在
        if (document.getElementById('pe-floating-enhancer')) {
            return;
        }

        const floatingEnhancer = document.createElement('div');
        floatingEnhancer.id = 'pe-floating-enhancer';
        floatingEnhancer.innerHTML = `
            <div class="pe-floating-btn-content">
                ✨ 增强提示词
            </div>
        `;

        // 添加样式（参考采集按钮但使用不同颜色和位置）
        floatingEnhancer.style.cssText = `
            position: fixed;
            top: calc(50% - 70px);
            right: 20px;
            transform: translateY(-50%);
            z-index: 10001;
            background: #28a745;
            color: white;
            padding: 12px 16px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
            transition: all 0.3s ease;
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // 悬停效果
        floatingEnhancer.addEventListener('mouseenter', () => {
            floatingEnhancer.style.transform = 'translateY(-50%) scale(1.05)';
            floatingEnhancer.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
        });

        floatingEnhancer.addEventListener('mouseleave', () => {
            floatingEnhancer.style.transform = 'translateY(-50%) scale(1)';
            floatingEnhancer.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
        });

        // 点击事件
        floatingEnhancer.addEventListener('click', async () => {
            // 如果没有初始化，尝试初始化
            if (!isInitialized || !inputHandler) {
                console.log('尝试初始化增强器...');
                await initializeEnhancer();

                // 如果仍然没有初始化成功，显示错误
                if (!inputHandler) {
                    setFloatingEnhancerState('error');
                    setTimeout(() => {
                        setFloatingEnhancerState('normal');
                    }, 2000);
                    return;
                }
            }

            // 调用增强处理函数
            handleEnhanceClick();
        });

        // 右键显示配置
        floatingEnhancer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            createConfigPanel();
        });

        document.body.appendChild(floatingEnhancer);
        console.log('✅ 悬浮增强窗创建成功！');
        console.log('悬浮窗元素ID:', floatingEnhancer.id);
        console.log('悬浮窗已添加到页面');

        // 添加提示
        setTimeout(() => {
            if (floatingEnhancer.parentElement) {
                const tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: fixed;
                    top: 50%;
                    right: 90px;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 10001;
                    pointer-events: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                `;
                tooltip.textContent = '右键打开配置';
                document.body.appendChild(tooltip);

                setTimeout(() => {
                    if (tooltip.parentElement) {
                        tooltip.remove();
                    }
                }, 3000);
            }
        }, 1000);
    }

    // 设置悬浮增强窗状态
    function setFloatingEnhancerState(state) {
        const floatingEnhancer = document.getElementById('pe-floating-enhancer');
        if (!floatingEnhancer) return;

        switch (state) {
            case 'loading':
                floatingEnhancer.style.background = '#ffc107';
                floatingEnhancer.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
                floatingEnhancer.innerHTML = `
                    <div class="pe-floating-btn-content">
                        ⏳ 增强中...
                    </div>
                `;
                break;
            case 'success':
                floatingEnhancer.style.background = '#28a745';
                floatingEnhancer.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                floatingEnhancer.innerHTML = `
                    <div class="pe-floating-btn-content">
                        ✅ 增强完成
                    </div>
                `;
                break;
            case 'error':
                floatingEnhancer.style.background = '#dc3545';
                floatingEnhancer.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                floatingEnhancer.innerHTML = `
                    <div class="pe-floating-btn-content">
                        ❌ 增强失败
                    </div>
                `;
                break;
            default:
                floatingEnhancer.style.background = '#28a745';
                floatingEnhancer.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                floatingEnhancer.innerHTML = `
                    <div class="pe-floating-btn-content">
                        ✨ 增强提示词
                    </div>
                `;
        }
    }

    // 启动脚本
    init();

    // 注册菜单命令（在所有网站都可用）
    registerMenuCommands();

    // 创建右侧悬浮增强窗（在AI网站上显示）
    function initFloatingEnhancer() {
        console.log('🎨 开始初始化悬浮增强窗...');
        console.log('🌐 当前网站:', window.location.hostname);
        console.log('📍 当前路径:', window.location.pathname);
        console.log('🔍 当前网站类型:', currentSiteType);
        console.log('⏰ 页面加载状态:', document.readyState);

        // 延迟创建，确保页面完全加载
        setTimeout(() => {
            console.log('⏳ 2秒延迟后开始创建悬浮窗...');
            createFloatingEnhancer();
        }, 2000); // 增加延迟时间到2秒
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingEnhancer);
    } else {
        initFloatingEnhancer();
    }

    // 创建浮动采集按钮（确保在所有网站都能看到）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingCollectButton);
    } else {
        createFloatingCollectButton();
    }

    // 添加全局快捷键支持（在所有网站都可用）
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + P 打开配置面板
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            createConfigPanel();
        }

        // Ctrl/Cmd + Shift + C 采集当前页面
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            collectCurrentPage();
        }
    });

    console.log('🚀 AI提示词增强器 - 飞书知识库版 v1.2.9 已加载');
    console.log('📋 功能说明:');
    console.log('  • 在支持的AI网站上增强提示词');
    console.log('  • 使用飞书多维表格作为知识库');
    console.log('  • 支持页面内容采集到知识库');
    console.log('⌨️  快捷键:');
    console.log('  • Ctrl+Shift+P: 打开配置面板');
    console.log('  • Ctrl+Shift+C: 采集当前页面');
    console.log('  • Ctrl+Enter: 在输入框中触发增强');
    console.log('🔧 改进内容 (v1.2.9):');
    console.log('  • 🧹 简化代码逻辑：移除复杂的文本获取和验证机制');
    console.log('  • 🚀 优化性能：减少不必要的调试日志和验证步骤');
    console.log('  • 📋 简化粘贴流程：直接复制→全选→删除→粘贴');
    console.log('  • ✨提升用户体验：减少控制台噪音，专注核心功能');
    console.log('  • 🎯 保持核心功能：确保文本设置和增强功能正常工作');

    // 检查浏览器兼容性
    if (typeof GM_xmlhttpRequest === 'undefined') {
        console.warn('⚠️  警告: GM_xmlhttpRequest 不可用，请确保使用支持的用户脚本管理器');
    }

    if (typeof GM_setValue === 'undefined') {
        console.warn('⚠️  警告: GM_setValue 不可用，配置保存功能可能无法正常工作');
    }

})();