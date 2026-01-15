// ==UserScript==
// @name         在sp网址上展示店铺信息-整合版本
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  在smartpush网址上展示店铺信息按钮，整合灰度配置功能
// @author       lulu
// @match        *://*.smartpushedm.com/*
// @match        https://devops.inshopline.com/*
// @match        https://octopuses.myshopline.com/functional/branch-case?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/548898/1716021/Toast%E7%BB%84%E4%BB%B6%E6%A8%A1%E5%9D%97.js
// @require      https://update.greasyfork.org/scripts/559170/1721374/SmartPush%20%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF%E6%A0%B7%E5%BC%8F.js
// @downloadURL https://update.greasyfork.org/scripts/548921/%E5%9C%A8sp%E7%BD%91%E5%9D%80%E4%B8%8A%E5%B1%95%E7%A4%BA%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF-%E6%95%B4%E5%90%88%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/548921/%E5%9C%A8sp%E7%BD%91%E5%9D%80%E4%B8%8A%E5%B1%95%E7%A4%BA%E5%BA%97%E9%93%BA%E4%BF%A1%E6%81%AF-%E6%95%B4%E5%90%88%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

// ==================== 灰度配置样式 ====================

(function () {
    'use strict';
    // ==================== 在脚本开始时立即设置cookie ====================

    const GRAY_CONFIG = {
        STORAGE_KEY: 'gray_mode_config',
        COOKIE_NAME: 'ads-gray',
        CHANGE_FLAG_HEADER: 'x-gray-change', // 新增：变化标志头
        MODES: {
            NONE: { id: 'none', name: '不开启', desc: '不进行灰度控制' },
            BROWSER_GRAY: { id: 'browser_gray', name: '浏览器级别灰度', desc: '当前所有标签页刷新均有效，需要对比请新开浏览器' },
            BROWSER_NO_GRAY: { id: 'browser_no_gray', name: '浏览器级别不灰度', desc: '当前所有标签页刷新均有效，需要对比请新开浏览器' }
        }
    };

    function cleanCookie() {
        const cookieName = GRAY_CONFIG.COOKIE_NAME;
        const pastDate = new Date(0); // 1970-01-01
        document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}`
        document.cookie = `${cookieName}=true; expires=${pastDate.toUTCString()}`
        document.cookie = `${cookieName}=; path=/admin; SameSite=Strict; expires=${pastDate.toUTCString()}`;
        document.cookie = `${cookieName}=true; path=/admin;  SameSite=Strict; expires=${pastDate.toUTCString()}`;
        console.log('已删除灰度cookie', document.cookie);
    }

    // 获取当前灰度配置
    const getGrayConfig = () => {
        let config = GRAY_CONFIG.MODES.NONE.id;
        try {
            // 只检查 localStorage
            config = localStorage.getItem(GRAY_CONFIG.STORAGE_KEY);
            // 如果 localStorage 中没有配置，返回 NONE.id
            if (!config) {
                return GRAY_CONFIG.MODES.NONE.id;
            }
            return config;
        } catch (e) {
            console.error('获取灰度配置失败:', e);
            return GRAY_CONFIG.MODES.NONE.id;
        }
    };

    // 修改后的设置cookie核心函数
    const setAdsGrayCookie = (value) => {
        const cookieName = GRAY_CONFIG.COOKIE_NAME;
        if (value === 'no') {
            cleanCookie()
        }
        if (value === '' || value === false || value === 'false' || value === null) {
            // 删除cookie - 设置过期时间为过去
            cleanCookie()
            document.cookie = `${cookieName}=false; path=/admin; SameSite=Strict;`;
            return '';
        }

        // 只有value为'true'时设置cookie
        if (value === 'true' || value === true) {
            let cookieStr = `${cookieName}=true; path=/admin; SameSite=Strict;`;
            // 设置cookie
            document.cookie = cookieStr;
            console.log(`已设置灰度cookie: ${cookieStr}`);
            return cookieStr;
        }
        console.log('无效的cookie值，不进行任何操作:', value);
        return '';
    };


    const getCookie = (name) => {
        try {
            // 获取所有cookie
            const cookies = document.cookie.split(';');

            // 遍历查找指定名称的cookie
            for (let cookie of cookies) {
                // 去除前后空格
                const [key, value] = cookie.trim().split('=');
                if (key === name) {
                    // 返回解码后的值（如果需要的话）
                    return decodeURIComponent(value);
                }
            }
            return null; // 没找到返回null
        } catch (e) {
            console.error('获取cookie失败:', e);
            return null;
        }
    };
    function setAdsGray() {
        try {
            // 尝试获取灰度配置
            let grayMode = getGrayConfig();
            console.log('页面加载前设置灰度cookie，配置:', grayMode);
            // 延迟执行，避免影响页面初始加载
            // 根据配置设置cookie
            let cookieValue = '';
            switch (grayMode) {
                case GRAY_CONFIG.MODES.BROWSER_GRAY.id:
                    cookieValue = 'true';
                    break;
                case GRAY_CONFIG.MODES.BROWSER_NO_GRAY.id:
                    cookieValue = '';
                    break;
                case GRAY_CONFIG.MODES.NONE.id:
                    cookieValue = 'no';
                    break;
            }
            // 设置cookie
            setAdsGrayCookie(cookieValue);
        } catch (e) {
            console.error('页面加载前设置cookie失败:', e);
        }
    }

    // 为了直接刷新页面导致获取不到，所以这里直接执行一遍
    setAdsGray()

    //======================================以上就是最开始执行==================================================

    // 获取店铺数据
    // 全局状态管理（避免变量散落在事件中）
    const state = {
        isDragging: false,
        isModalOpen: false,
        isConfigModalOpen: false,
        dragTimer: null,
        buttonPosition: { x: 260, y: 10 }, // 默认位置
        cacheKey: 'smartpush_account_info'
    };

    let loadApiList = null;
    const currentCache = GM_getValue(state.cacheKey, '');


    // 保存灰度配置（用户操作时）
    const saveGrayConfig = (modeId) => {
        try {
            const oldModeId = getGrayConfig();
            // 如果新配置和当前配置相同，则不进行操作
            if (oldModeId === modeId) {
                // MonkeyToast.show('配置未改变');
                return;
            }
            localStorage.setItem(GRAY_CONFIG.STORAGE_KEY, modeId);
            const mode = Object.values(GRAY_CONFIG.MODES).find(m => m.id === modeId);
            if (mode) {
                MonkeyToast.show(`已设置为「${mode.name}」Cookie已更新，将自动刷新页面`, { duration: 3000 });
            }
            // 根据模式设置cookie值
            let cookieValue = '';
            let isBrowserLevel = false;
            switch (modeId) {
                case GRAY_CONFIG.MODES.BROWSER_GRAY.id:
                    cookieValue = 'true';
                    break;
                case GRAY_CONFIG.MODES.BROWSER_NO_GRAY.id:
                    cookieValue = '';
                    break;
                case GRAY_CONFIG.MODES.NONE.id:
                    cookieValue = 'no';
                    console.log('灰度配置为不开启');
            }
            // console.log('保存灰度配置，准备设置cookie:', { modeId, cookieValue});
            setAdsGrayCookie(cookieValue);
            // 页面加载完成后设置cookie
            const applyCookie = () => {
                // 延迟提示，让用户手动决定是否刷新
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            };

            // 设置cookie后重新加载
            if (document.readyState === 'complete') {
                applyCookie();
            } else {
                MonkeyToast.show('等待页面加载完成后设置Cookie...', { duration: 2000 });
                const waitForLoad = () => {
                    if (document.readyState === 'complete') {
                        applyCookie();
                    } else {
                        setTimeout(waitForLoad, 100);
                    }
                };
                waitForLoad();
            }

        } catch (e) {
            console.error('保存灰度配置失败:', e);
            MonkeyToast.show('保存灰度配置失败');
        }
    };

    // ==================== 工具函数 ====================
    // 安全解析localStorage中的位置
    const getSavedButtonPosition = () => {
        try {
            const saved = localStorage.getItem('testAccountButtonPosition');
            return saved ? JSON.parse(saved) : state.buttonPosition;
        } catch (e) {
            console.error('解析按钮位置失败:', e);
            return state.buttonPosition;
        }
    };

    // 安全获取userInfo并格式化
    const getAccountInfo = (isText = true) => {
        let userInfo = {};
        try {
            userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        } catch (e) {
            console.error('解析userInfo失败:', e);
        }

        const { env = '', attributes = {}, storeId = '', handle = '', email = '' } = userInfo;
        const platform = env === 'TW' ? 'EC1' : env === 'CN' ? 'EC2' : env;
        const domain = attributes.domain || '无';

        let displayText = '';
        displayText += `地址：${new URL(window.location.href).hostname || '无'}\n`;
        displayText += `平台：${platform || '无'}\n`;
        displayText += `店铺名称：${attributes.merchantName || '无'}\n`;
        displayText += `店铺merchantId：${storeId || '无'}\n`;
        displayText += `handle：${handle || '无'}\n`;
        displayText += `账号：${email || '无'}\n`;
        displayText += `密码(写死)：Dw123456.\n`;

        if (env !== "OT") {
            displayText += isText
                ? `C端链接：${domain}\n`
                : `C端链接：<a href="https://${domain}" target="_blank">${domain}</a>\n`;
            displayText += `主站账号：${attributes.merchantEmail || '无'}\n`;
        }

        displayText += `时区：${attributes.timezone || '无'}\n`;
        displayText += `货币：${attributes.currency || '无'}\n`;
        displayText += `国家代码：${attributes.countryCode || '无'}\n`;
        return displayText;
    };

    // 获取店铺id
    const getMerchantId = () => {
        var userInfo = {}
        try {
            userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        } catch (e) {
            console.error('解析userInfo失败:', e);
        }
        return userInfo.storeId
    }

    const isAllJava = () => {
        var javaRequestConfig = {}
        try {
            javaRequestConfig = JSON.parse(sessionStorage.getItem('java_request') || '{}');
            return javaRequestConfig[getMerchantId()] === true
        } catch (e) {
            console.error('获取allJava失败', e);
        }
    };

    const existJavaList = () => {
        let existJavaList = false
        const apiJavaConfig = JSON.parse(sessionStorage.getItem('api_java_config') || '{}');
        var list = apiJavaConfig[getMerchantId()]
        try {
            if (list == null || list === '{}') {
                existJavaList = false
            }
            else {
                existJavaList = true
            }
            return existJavaList
        } catch (e) {
            console.error('获取javaList失败', e);
        }
    };

    // 判断是否开启灰度提示开关
    const isGrayTipOpen = () => {
        var grayTipOpen = true
        try {
            grayTipOpen = localStorage.getItem('grayTipOpen');
            if (grayTipOpen === null || grayTipOpen === 'true' || grayTipOpen === '') {
                return true
            }
            else {
                return false
            }
        } catch (e) {
            console.error('获取灰度开关失败', e);
            return grayTipOpen
        }
    };

    //判断路径是否在java配置中
    const isApiNeedJava = (apiPath) => {
        try {
            const merchantId = getMerchantId();
            if (!merchantId) return false;

            const apiJavaConfig = JSON.parse(sessionStorage.getItem('api_java_config') || '{}');
            const apis = apiJavaConfig[merchantId];

            if (!apis || apis.length === 0) return false;

            // 规范化传入的路径
            const normalizedInput = apiPath.replace(/^\/+/, '').replace(/\/+$/, '');

            // 检查是否匹配
            return apis.some(api => {
                // 支持通配符 * 匹配
                if (api.includes('*')) {
                    const regex = new RegExp('^' + api.replace(/\*/g, '.*') + '$');
                    return regex.test(normalizedInput);
                }
                // 精确匹配
                return api === normalizedInput;
            });
        } catch (e) {
            console.error('检查接口Java配置失败:', e);
            return false;
        }
    };

    const saveJavaApiPath = (apiPath) => {
        // 规范化路径（移除开头和结尾的斜杠）
        const normalizedPath = apiPath.replace(/^\/+/, '').replace(/\/+$/, '');
        const merchantId = getMerchantId()
        const apiJavaConfig = JSON.parse(sessionStorage.getItem('api_java_config') || '{}');
        if (!apiJavaConfig[merchantId]) {
            apiJavaConfig[merchantId] = [];
        }

        // 检查是否已存在
        if (apiJavaConfig[merchantId].includes(normalizedPath)) {
            MonkeyToast.show('该接口已存在java中');
            return;
        }

        apiJavaConfig[merchantId].push(normalizedPath);
        sessionStorage.setItem('api_java_config', JSON.stringify(apiJavaConfig));
        MonkeyToast.show(`${normalizedPath} 接口已添加javaAPI名单中`, { backgroundColor: '#989415ff' });
    }

    const isAutoUpdate = () => {
        var autoUpdate = true
        try {
            autoUpdate = GM_getValue('autoUpdateDevOps');
            if (autoUpdate === null || autoUpdate === 'true' || autoUpdate === '' || autoUpdate === true) {
                return true
            }
            else {
                return false
            }
        } catch (e) {
            console.error('获取自动更新开关', e);
            return autoUpdate
        }
    };

    // 保存自动更新开关状态
    const saveAutoUpdate = (isChecked) => {
        GM_setValue('autoUpdateDevOps', isChecked);
        MonkeyToast.show(isChecked ? '已开启「自动更新店铺数据」' : '已关闭「自动更新店铺数据」');
    };

    // ==================== SmartPush 页面逻辑 ====================
    if (window.location.host.includes('smartpushedm')) {
        function createSwitch(initialChecked, onChange) {
            const switchLabel = document.createElement('label');
            switchLabel.className = 'config-switch';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = initialChecked;
            checkbox.addEventListener('change', onChange);

            const slider = document.createElement('span');
            slider.className = 'config-slider';

            const sliderBefore = document.createElement('span');
            sliderBefore.className = 'config-slider-before';

            slider.appendChild(sliderBefore);
            switchLabel.appendChild(checkbox);
            switchLabel.appendChild(slider);

            return switchLabel;
        }

        /**
         * 创建分隔符
         * @returns {HTMLDivElement} 分隔符元素
         */
        function createSeparator() {
            const separator = document.createElement('div');
            separator.className = 'option-separator';
            return separator;
        }


        // 创建账号信息模态框的变量需要提前声明
        function createConfigModal() {
            // 创建模态框容器
            const configModal = document.createElement('div');
            configModal.className = 'config-modal';
            document.body.appendChild(configModal);

            // 配置模态框标题
            const configModalTitle = document.createElement('h2');
            configModalTitle.className = 'config-modal-title';
            configModalTitle.textContent = '⚙️ 配置中心';
            configModal.appendChild(configModalTitle);

            // 配置模态框关闭按钮（右上角×）
            const configModalCloseBtn = document.createElement('button');
            configModalCloseBtn.textContent = '×';
            configModalCloseBtn.className = 'smartpush-modal-close';
            configModalCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                configModal.style.display = 'none';
                state.isConfigModalOpen = false;
            });
            configModal.appendChild(configModalCloseBtn);

            // ========== 配置布局容器 ==========
            const configLayout = document.createElement('div');
            configLayout.className = 'config-layout';
            configModal.appendChild(configLayout);

            // ========== 左侧列：前端配置（原来在右侧的）==========
            const leftColumn = document.createElement('div');
            leftColumn.className = 'config-left-column';

            // 左侧标题
            const leftTitle = document.createElement('div');
            leftTitle.className = 'config-column-title left-column-title';
            leftTitle.textContent = '⚙️ 接口灰度'; // 使用前端配置图标
            leftColumn.appendChild(leftTitle);

            // 前端配置项容器
            const frontendOptions = document.createElement('div');
            frontendOptions.className = 'config-item-group';

            // 1. GO灰度接口提示开关
            const grayTipSwitchItem = document.createElement('div');
            grayTipSwitchItem.className = 'config-switch-item';

            const grayTipSwitchLabel = document.createElement('div');
            grayTipSwitchLabel.className = 'switch-label-container';

            const grayTipSwitchName = document.createElement('div');
            grayTipSwitchName.className = 'switch-name';
            grayTipSwitchName.textContent = 'GO灰度接口提示';

            const grayTipSwitchDesc = document.createElement('div');
            grayTipSwitchDesc.className = 'switch-desc';
            grayTipSwitchDesc.textContent = '开启后，当接口命中GO灰度时会有Toast提示';

            grayTipSwitchLabel.appendChild(grayTipSwitchName);
            grayTipSwitchLabel.appendChild(grayTipSwitchDesc);

            const grayTipSwitch = createSwitch(isGrayTipOpen(), function () {
                const isChecked = this.checked;
                localStorage.setItem('grayTipOpen', isChecked);
                MonkeyToast.show(isChecked ? '已开启「接口GO灰度提示」' : '已关闭「接口GO灰度提示」');
            });

            grayTipSwitchItem.appendChild(grayTipSwitchLabel);
            grayTipSwitchItem.appendChild(grayTipSwitch);
            frontendOptions.appendChild(grayTipSwitchItem);

            // 2. 全部请求Java开关
            const javaRequestItem = document.createElement('div');
            javaRequestItem.className = 'config-switch-item';

            const javaRequestLabel = document.createElement('div');
            javaRequestLabel.className = 'switch-label-container';

            const javaRequestName = document.createElement('div');
            javaRequestName.className = 'switch-name';
            javaRequestName.textContent = '全部请求Java';

            const javaRequestDesc = document.createElement('div');
            javaRequestDesc.className = 'switch-desc';
            javaRequestDesc.textContent = '开启后，所有XHR请求都会添加 force-java:true 请求头';

            javaRequestLabel.appendChild(javaRequestName);
            javaRequestLabel.appendChild(javaRequestDesc);

            // 初始化开关状态
            const merchantId = getMerchantId();
            let initialJavaChecked = false;
            if (merchantId) {
                const javaRequestConfig = JSON.parse(sessionStorage.getItem('java_request') || '{}');
                initialJavaChecked = javaRequestConfig[merchantId] === true;
            }

            const javaRequestSwitch = createSwitch(initialJavaChecked, function () {
                const isChecked = this.checked;

                if (!merchantId) {
                    MonkeyToast.show('未获取到merchant_id，操作失败');
                    this.checked = !isChecked;
                    return;
                }

                const javaRequestConfig = JSON.parse(sessionStorage.getItem('java_request') || '{}');
                if (isChecked) {
                    javaRequestConfig[merchantId] = true;
                    MonkeyToast.show('已开启「全部请求Java」');
                } else {
                    delete javaRequestConfig[merchantId];
                    MonkeyToast.show('已关闭「全部请求Java」');
                }
                sessionStorage.setItem('java_request', JSON.stringify(javaRequestConfig));
            });

            javaRequestItem.appendChild(javaRequestLabel);
            javaRequestItem.appendChild(javaRequestSwitch);
            frontendOptions.appendChild(javaRequestItem);

            // 4. 接口Java管理
            const apiJavaItem = document.createElement('div');
            apiJavaItem.className = 'config-item';

            const apiJavaLabel = document.createElement('div');
            apiJavaLabel.className = 'config-item-label';

            const apiJavaName = document.createElement('div');
            apiJavaName.className = 'config-item-name';
            apiJavaName.textContent = '接口Java管理';

            const apiJavaDesc = document.createElement('div');
            apiJavaDesc.className = 'config-item-desc';
            apiJavaDesc.textContent = '添加需要强制请求Java的特定接口路径';

            apiJavaLabel.appendChild(apiJavaName);
            apiJavaLabel.appendChild(apiJavaDesc);

            const apiJavaButton = document.createElement('button');
            apiJavaButton.className = 'config-btn-small';
            apiJavaButton.textContent = '管理';
            apiJavaButton.addEventListener('click', function () {
                // 确保这个函数存在且能访问
                if (typeof window.createApiJavaManagementModal === 'function') {
                    window.createApiJavaManagementModal(configModal);
                } else {
                    console.error('createApiJavaManagementModal 函数不存在');
                    MonkeyToast.show('无法打开接口管理界面，请检查脚本');
                }
            });

            // 创建接口Java管理模态框的函数
            window.createApiJavaManagementModal = function (parentModal) {
                console.log('createApiJavaManagementModal 被调用');

                // 如果已存在管理模态框，先移除
                const existingModal = document.querySelector('.api-java-modal');
                if (existingModal) {
                    existingModal.remove();
                }

                // 创建管理模态框
                const managementModal = document.createElement('div');
                managementModal.className = 'config-modal api-java-modal';
                managementModal.style.zIndex = '10002';

                // 管理模态框标题
                const managementTitle = document.createElement('h2');
                managementTitle.className = 'config-modal-title';
                managementTitle.textContent = '🔧 接口Java管理';
                managementModal.appendChild(managementTitle);

                // 关闭按钮
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.className = 'smartpush-modal-close';
                closeBtn.addEventListener('click', () => {
                    managementModal.remove();
                });
                managementModal.appendChild(closeBtn);

                // 内容容器
                const content = document.createElement('div');
                content.className = 'api-java-content';

                // 说明文字
                const description = document.createElement('div');
                description.className = 'api-java-desc';
                description.textContent = '当前店铺已配置的Java接口列表：';
                content.appendChild(description);

                // API列表容器
                const apiListContainer = document.createElement('div');
                apiListContainer.className = 'api-list-container';

                // 加载API列表的函数
                const loadApiList = function () {
                    apiListContainer.innerHTML = '';

                    try {
                        const merchantId = getMerchantId();
                        if (!merchantId) {
                            const emptyMsg = document.createElement('div');
                            emptyMsg.className = 'api-empty';
                            emptyMsg.textContent = '未获取到店铺ID';
                            apiListContainer.appendChild(emptyMsg);
                            return;
                        }

                        const apiJavaConfig = JSON.parse(sessionStorage.getItem('api_java_config') || '{}');
                        const apis = apiJavaConfig[merchantId] || [];

                        if (apis.length === 0) {
                            const emptyMsg = document.createElement('div');
                            emptyMsg.className = 'api-empty';
                            emptyMsg.textContent = '暂无配置的Java接口';
                            apiListContainer.appendChild(emptyMsg);
                            return;
                        }

                        // 创建表格
                        const table = document.createElement('table');
                        table.className = 'api-table';

                        // 表头
                        const thead = document.createElement('thead');
                        const headerRow = document.createElement('tr');

                        const th1 = document.createElement('th');
                        th1.textContent = '接口路径';
                        const th2 = document.createElement('th');
                        th2.textContent = '操作';

                        headerRow.appendChild(th1);
                        headerRow.appendChild(th2);
                        thead.appendChild(headerRow);
                        table.appendChild(thead);

                        // 表格内容
                        const tbody = document.createElement('tbody');

                        apis.forEach((api, index) => {
                            const row = document.createElement('tr');

                            const td1 = document.createElement('td');
                            td1.className = 'api-path';
                            td1.textContent = api;

                            const td2 = document.createElement('td');
                            const deleteBtn = document.createElement('button');
                            deleteBtn.className = 'api-delete-btn';
                            deleteBtn.textContent = 'x';
                            deleteBtn.addEventListener('click', (e) => {
                                // 阻止事件冒泡，防止触发外层的点击关闭事件
                                e.stopPropagation();
                                e.preventDefault();

                                // 从数组中移除
                                const updatedApis = apis.filter((_, i) => i !== index);

                                if (updatedApis.length === 0) {
                                    delete apiJavaConfig[merchantId];
                                } else {
                                    apiJavaConfig[merchantId] = updatedApis;
                                }

                                sessionStorage.setItem('api_java_config', JSON.stringify(apiJavaConfig));
                                MonkeyToast.show(`已删除接口: ${api}`);
                                loadApiList(); // 重新加载列表
                            });

                            td2.appendChild(deleteBtn);
                            row.appendChild(td1);
                            row.appendChild(td2);
                            tbody.appendChild(row);
                        });

                        table.appendChild(tbody);
                        apiListContainer.appendChild(table);

                    } catch (e) {
                        console.error('加载API列表失败:', e);
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'api-error';
                        errorMsg.textContent = '加载失败: ' + e.message;
                        apiListContainer.appendChild(errorMsg);
                    }
                };

                // 添加接口表单
                const addForm = document.createElement('div');
                addForm.className = 'api-add-form';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'api-input';
                input.placeholder = '输入接口路径 (如: admin/campaign/list 或 admin/campaign/*)';

                const addButton = document.createElement('button');
                addButton.className = 'api-add-btn';
                addButton.textContent = '添加';
                addButton.addEventListener('click', () => {
                    const apiPath = input.value.trim();
                    if (!apiPath) {
                        MonkeyToast.show('请输入接口路径');
                        return;
                    }

                    saveJavaApiPath(apiPath);
                    input.value = '';
                    loadApiList(); // 重新加载列表
                });

                // 回车添加
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        addButton.click();
                    }
                });

                addForm.appendChild(input);
                addForm.appendChild(addButton);
                content.appendChild(addForm);

                // 初始加载列表
                loadApiList();
                content.appendChild(apiListContainer);

                // 底部按钮
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'api-button-container';

                const clearAllBtn = document.createElement('button');
                clearAllBtn.className = 'api-clear-btn';
                clearAllBtn.textContent = '清空所有';
                clearAllBtn.addEventListener('click', () => {
                    if (!confirm('确定要清空所有Java接口配置吗？')) return;

                    const merchantId = getMerchantId();
                    if (merchantId) {
                        const apiJavaConfig = JSON.parse(sessionStorage.getItem('api_java_config') || '{}');
                        delete apiJavaConfig[merchantId];
                        sessionStorage.setItem('api_java_config', JSON.stringify(apiJavaConfig));
                        MonkeyToast.show('已清空所有Java接口配置');
                        loadApiList();
                    }
                });

                const closeAllBtn = document.createElement('button');
                closeAllBtn.className = 'api-close-btn';
                closeAllBtn.textContent = '关闭';
                closeAllBtn.addEventListener('click', () => {
                    managementModal.remove();
                });

                buttonContainer.appendChild(clearAllBtn);
                buttonContainer.appendChild(closeAllBtn);
                content.appendChild(buttonContainer);

                managementModal.appendChild(content);
                document.body.appendChild(managementModal);

                // 定位模态框
                const rect = parentModal.getBoundingClientRect();
                managementModal.style.position = 'fixed';
                managementModal.style.top = `${Math.max(50, rect.top - 100)}px`;
                managementModal.style.left = `${Math.max(50, rect.left - 100)}px`;
                managementModal.style.display = 'block';

                // 添加点击外部关闭的功能
                setTimeout(() => {
                    const closeOnOutsideClick = (e) => {
                        if (!managementModal.contains(e.target) && e.target !== apiJavaButton) {
                            managementModal.remove();
                            document.removeEventListener('click', closeOnOutsideClick);
                        }
                    };
                    document.addEventListener('click', closeOnOutsideClick);
                }, 100);
            };


            apiJavaItem.appendChild(apiJavaLabel);
            apiJavaItem.appendChild(apiJavaButton);
            frontendOptions.appendChild(apiJavaItem);

            leftColumn.appendChild(frontendOptions);
            configLayout.appendChild(leftColumn);




            // ========== 右侧列：灰度控制（原来在左侧的）==========
            const rightColumn = document.createElement('div');
            rightColumn.className = 'config-right-column';

            // 右侧标题
            const rightTitle = document.createElement('div');
            rightTitle.className = 'config-column-title right-column-title';
            rightTitle.textContent = '🎨 前端灰度'; // 使用灰度控制图标
            rightColumn.appendChild(rightTitle);

            // 灰度配置容器
            const grayConfigContainer = document.createElement('div');
            // 灰度选项组
            const grayOptionsGroup = document.createElement('div');
            grayOptionsGroup.className = 'gray-options-group';

            // 获取当前灰度配置
            const currentGrayMode = getGrayConfig();
            // 创建所有灰度选项
            Object.values(GRAY_CONFIG.MODES).forEach(mode => {
                const grayOption = document.createElement('label');
                grayOption.className = `gray-option ${mode.id === currentGrayMode ? 'selected' : ''}`;

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = 'gray-mode';
                radioInput.value = mode.id;
                radioInput.checked = mode.id === currentGrayMode;

                const optionLabel = document.createElement('div');
                optionLabel.className = 'gray-option-label';

                const optionName = document.createElement('div');
                optionName.className = 'gray-option-name';
                optionName.textContent = mode.name;

                const optionDesc = document.createElement('div');
                optionDesc.className = 'gray-option-desc';
                optionDesc.textContent = mode.desc;

                const optionIcon = document.createElement('div');
                optionIcon.className = 'gray-option-icon';
                optionIcon.textContent = mode.id === currentGrayMode ? '✓' : '';

                optionLabel.appendChild(optionName);
                optionLabel.appendChild(optionDesc);

                grayOption.appendChild(radioInput);
                grayOption.appendChild(optionLabel);
                grayOption.appendChild(optionIcon);

                // 点击事件
                grayOption.addEventListener('click', (e) => {
                    if (e.target.type === 'radio') return;

                    // 更新选择状态
                    rightColumn.querySelectorAll('.gray-option').forEach(opt => {
                        opt.classList.remove('selected');
                        const icon = opt.querySelector('.gray-option-icon');
                        if (icon) icon.textContent = '';
                    });

                    grayOption.classList.add('selected');
                    const icon = grayOption.querySelector('.gray-option-icon');
                    if (icon) icon.textContent = '✓';

                    // 更新radio状态
                    const radio = grayOption.querySelector('input[type="radio"]');
                    if (radio) radio.checked = true;

                    // 保存配置
                    saveGrayConfig(mode.id);

                    // 更新当前状态显示
                    const statusValue = rightColumn.querySelector('.gray-status-value');
                    if (statusValue) {
                        statusValue.textContent = mode.name;
                    }
                });

                // radio变化事件
                radioInput.addEventListener('change', () => {
                    if (radioInput.checked) {
                        saveGrayConfig(mode.id);
                    }
                });

                grayOptionsGroup.appendChild(grayOption);
            });
            grayConfigContainer.appendChild(grayOptionsGroup);

            // 当前状态显示
            const currentGrayStatus = document.createElement('div');
            currentGrayStatus.className = 'gray-current-status';

            const statusLabel = document.createElement('div');
            statusLabel.className = 'gray-status-label';
            statusLabel.textContent = '当前状态：';

            const statusValue = document.createElement('div');
            statusValue.className = 'gray-status-value';

            const currentMode = Object.values(GRAY_CONFIG.MODES).find(m => m.id === currentGrayMode);
            statusValue.textContent = currentMode ? currentMode.name : '未设置';

            currentGrayStatus.appendChild(statusLabel);
            currentGrayStatus.appendChild(statusValue);
            grayConfigContainer.appendChild(currentGrayStatus);

            rightColumn.appendChild(grayConfigContainer);
            configLayout.appendChild(rightColumn);

            // ========== 关闭按钮 ==========
            const closeBtnContainer = document.createElement('div');
            closeBtnContainer.className = 'config-close-container';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'config-close-btn';
            closeBtn.textContent = '关闭';
            closeBtn.addEventListener('click', () => {
                configModal.style.display = 'none';
                state.isConfigModalOpen = false;
            });

            closeBtnContainer.appendChild(closeBtn);
            configModal.appendChild(closeBtnContainer);

            return configModal;
        }
        let configModal = null;

        function accountInfo() {
            // 1. 初始化按钮位置
            state.buttonPosition = getSavedButtonPosition();

            // 2. 创建主按钮
            const mainButton = document.createElement('button');
            mainButton.textContent = '店铺信息';
            mainButton.className = 'smartpush-main-btn';
            mainButton.style.top = `${state.buttonPosition.y}px`;
            mainButton.style.left = `${state.buttonPosition.x}px`;
            document.body.appendChild(mainButton);

            // 3. 创建主按钮关闭按钮
            const mainCloseBtn = document.createElement('button');
            mainCloseBtn.textContent = '×';
            mainCloseBtn.className = 'smartpush-main-close';
            mainCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mainButton.style.display = 'none';
                modal.style.display = 'none';
                if (configModal) {
                    configModal.style.display = 'none';
                }
                state.isModalOpen = false;
                state.isConfigModalOpen = false;
            });
            mainButton.appendChild(mainCloseBtn);

            // 4. 创建账号信息模态框
            const modal = document.createElement('div');
            modal.className = 'smartpush-modal';
            modal.style.display = 'none';
            document.body.appendChild(modal);

            // 5. 创建配置模态框
            configModal = createConfigModal();

            // 6. 模态框关闭按钮
            const modalCloseBtn = document.createElement('button');
            modalCloseBtn.textContent = '×';
            modalCloseBtn.className = 'smartpush-modal-close';
            modalCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
                state.isModalOpen = false;
            });
            modal.appendChild(modalCloseBtn);

            // 7. 模态框内容
            const modalTitle = document.createElement('h2');
            modalTitle.textContent = '账号信息';
            modalTitle.className = 'smartpush-modal-title';
            modal.appendChild(modalTitle);

            const infoContainer = document.createElement('div');
            infoContainer.className = 'smartpush-info-container';
            infoContainer.innerHTML = getAccountInfo(false);
            modal.appendChild(infoContainer);

            // 8. 复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '🗒 一键复制';
            copyBtn.className = 'smartpush-one-line-btn';
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(getAccountInfo(true));
                    MonkeyToast.show('账号信息已复制到剪贴板');
                    modal.style.display = 'none';
                    state.isModalOpen = false;
                } catch (e) {
                    console.error('复制失败:', e);
                    MonkeyToast.show('复制失败，请手动复制');
                }
            });
            modal.appendChild(copyBtn);

            // 按钮组
            const btnArea = document.createElement('div');
            btnArea.className = 'smartpush-btn-group';

            // 9. 更新按钮
            const updateBtn_devops = document.createElement('button');
            updateBtn_devops.textContent = currentCache !== getAccountInfo(true) ? '❎数据不一致' : '🔄 手动更新';
            updateBtn_devops.className = 'smartpush-action-btn with-checkbox';

            const autoUpdateContainer = document.createElement('div');
            autoUpdateContainer.className = 'btn-with-checkbox';

            const autoUpdateCheckbox = document.createElement('input');
            autoUpdateCheckbox.type = 'checkbox';
            autoUpdateCheckbox.className = 'btn-checkbox';
            autoUpdateCheckbox.checked = isAutoUpdate();
            autoUpdateCheckbox.addEventListener('change', function () {
                saveAutoUpdate(this.checked);
                updateBtn_devops.textContent = isAutoUpdate() ? '🔄 已更新' : updateBtn_devops.textContent;
            });

            autoUpdateContainer.appendChild(updateBtn_devops);
            autoUpdateContainer.appendChild(autoUpdateCheckbox);

            updateBtn_devops.addEventListener('click', (e) => {
                e.stopPropagation();
                if (autoUpdateCheckbox.checked) {
                    GM_setValue(state.cacheKey, getAccountInfo(true));
                    updateBtn_devops.textContent = '🔄 已更新';
                    MonkeyToast.show('devops-smartpush账号测试数据已更新');
                } else {
                    GM_setValue(state.cacheKey, getAccountInfo(true));
                    updateBtn_devops.textContent = '🔄 已更新';
                    MonkeyToast.show('已更新，如果需要每次自动更新请勾选按钮上复选框');
                }
            });
            btnArea.appendChild(autoUpdateContainer);

            // 10. 配置按钮
            const configBtn = document.createElement('button');
            configBtn.textContent = '⚙️ 配置中心';
            configBtn.className = 'smartpush-action-btn';
            configBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                if (!configModal || !document.body.contains(configModal)) {
                    console.error('配置模态框不存在或未添加到DOM');
                    configModal = createConfigModal();
                }

                // 更新开关状态
                const checkboxes = configModal.querySelectorAll('input[type="checkbox"]');
                if (checkboxes[0]) {
                    checkboxes[0].checked = isGrayTipOpen();
                }
                if (checkboxes[1]) {
                    const merchantId = getMerchantId();
                    if (merchantId) {
                        const javaRequestConfig = JSON.parse(sessionStorage.getItem('java_request') || '{}');
                        checkboxes[1].checked = javaRequestConfig[merchantId] === true;
                    }
                }

                // 更新当前灰度状态显示
                const currentGrayMode = getGrayConfig();
                const currentMode = Object.values(GRAY_CONFIG.MODES).find(m => m.id === currentGrayMode);
                const statusValue = configModal.querySelector('.gray-status-value');
                if (statusValue && currentMode) {
                    statusValue.textContent = currentMode.name;
                }

                // 更新radio选择状态
                document.querySelectorAll('.gray-option').forEach(opt => {
                    opt.classList.remove('selected');
                    const icon = opt.querySelector('.gray-option-icon');
                    if (icon) icon.textContent = '';
                });

                const selectedOption = configModal.querySelector(`.gray-option input[value="${currentGrayMode}"]`);
                if (selectedOption) {
                    const grayOption = selectedOption.closest('.gray-option');
                    grayOption.classList.add('selected');
                    const icon = grayOption.querySelector('.gray-option-icon');
                    if (icon) icon.textContent = '✓';
                    selectedOption.checked = true;
                }

                const apiListContainer = configModal.querySelector('.api-list-container');
                if (apiListContainer) {
                    loadApiList();
                }

                modal.style.display = 'none';
                state.isModalOpen = false;

                const btnRect = mainButton.getBoundingClientRect();
                configModal.style.display = 'block';

                let top = btnRect.bottom + 10;
                let left = btnRect.left;

                if (top + 450 > window.innerHeight) {
                    top = Math.max(10, btnRect.top - 450 - 10);
                }
                if (left + 350 > window.innerWidth) {
                    left = Math.max(10, window.innerWidth - 350 - 10);
                }

                configModal.style.top = `${top}px`;
                configModal.style.left = `${left}px`;

                state.isConfigModalOpen = true;
            });
            btnArea.appendChild(configBtn);
            modal.appendChild(btnArea);

            // 11. 拖拽逻辑
            mainButton.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;

                state.isDragging = false;
                state.dragTimer = setTimeout(() => {
                    state.isDragging = true;
                    mainButton.style.opacity = '0.8';
                    mainButton.style.transform = 'scale(1.02)';
                    mainButton.style.cursor = 'grabbing';
                    mainButton.style.zIndex = '10000';

                    const rect = mainButton.getBoundingClientRect();
                    state.offsetX = e.clientX - rect.left;
                    state.offsetY = e.clientY - rect.top;
                }, 100);

                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!state.isDragging) return;

                const btnWidth = mainButton.offsetWidth;
                const btnHeight = mainButton.offsetHeight;
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                let newX = e.clientX - state.offsetX;
                let newY = e.clientY - state.offsetY;

                newX = Math.max(0, Math.min(newX, viewportWidth - btnWidth));
                newY = Math.max(0, Math.min(newY, viewportHeight - btnHeight));

                mainButton.style.left = `${newX}px`;
                mainButton.style.top = `${newY}px`;
            });

            document.addEventListener('mouseup', () => {
                if (state.dragTimer) {
                    clearTimeout(state.dragTimer);
                    state.dragTimer = null;
                }

                if (state.isDragging) {
                    mainButton.style.opacity = '1';
                    mainButton.style.transform = 'scale(1)';
                    mainButton.style.cursor = 'pointer';
                    mainButton.style.zIndex = '9999';

                    state.buttonPosition = {
                        x: parseFloat(mainButton.style.left),
                        y: parseFloat(mainButton.style.top)
                    };
                    localStorage.setItem('testAccountButtonPosition', JSON.stringify(state.buttonPosition));
                    state.isDragging = false;
                }
            });

            // 12. 主按钮点击事件
            mainButton.addEventListener('click', () => {
                if (state.isDragging) return;

                infoContainer.innerHTML = getAccountInfo(false);

                const btnRect = mainButton.getBoundingClientRect();
                const modalWidth = modal.offsetWidth || 350;

                let left = btnRect.left;
                let top = btnRect.bottom + 10;

                if (left + modalWidth > window.innerWidth) {
                    left = window.innerWidth - modalWidth - 10;
                }

                modal.style.position = 'fixed';
                modal.style.top = `${top}px`;
                modal.style.left = `${left}px`;
                modal.style.zIndex = '10001';

                if (state.isModalOpen) {
                    modal.style.display = 'none';
                    state.isModalOpen = false;
                } else {
                    modal.style.display = 'block';
                    state.isModalOpen = true;
                    if (state.isConfigModalOpen && configModal) {
                        configModal.style.display = 'none';
                        state.isConfigModalOpen = false;
                    }
                }
            });

            // 13. 初始化缓存
            const initCache = () => {
                if (isAutoUpdate()) {
                    GM_setValue(state.cacheKey, getAccountInfo(true));
                    MonkeyToast.show('devops-smartpush账号测试数据已更新');
                }
            };
            initCache();
        }

        function GrayXHR() {
            // 核心常量
            const LOG_PREFIX = '❗️❗️❗️接口监听拦截开启中❗️❗️❗️';
            const INTERCEPTOR_MARK = '__gray_interceptor__';
            const ROOT_WINDOW = unsafeWindow || window.top || window;
            const RAW_XHR = ROOT_WINDOW.XMLHttpRequest;

            function safeSetRequestHeader(xhr, headerKey, headerValue) {
                try {
                    if (xhr.readyState !== 1) {
                        console.warn(`${LOG_PREFIX} XHR状态异常(readyState=${xhr.readyState})，跳过请求头添加`);
                        return false;
                    }
                    xhr.setRequestHeader(headerKey, headerValue);
                    console.log(`${LOG_PREFIX} 成功添加请求头: ${headerKey}=${headerValue}`);
                    return true;
                } catch (e) {
                    console.error(`${LOG_PREFIX} 添加请求头失败:`, e);
                    return false;
                }
            }

            // ========== 1. XHR拦截器（修复版） ==========
            function createXhrInterceptor() {
                return function GrayXHR() {
                    const xhr = new RAW_XHR();
                    const requestId = `xhr_${Date.now().toString().slice(-5)}`;
                    let method = 'GET', url = '';
                    let isJavaRequest = false;
                    let isHeaderAdded = false;

                    const originalOpen = xhr.open;
                    xhr.open = function (...args) {
                        [method, url] = args;
                        const urlObj = new URL(url, ROOT_WINDOW.location.origin);
                        const apiPath = urlObj.pathname;

                        isJavaRequest = isAllJava() || isApiNeedJava(apiPath);

                        const result = originalOpen.apply(this, args);

                        setTimeout(() => {
                            if (isJavaRequest && !isHeaderAdded) {
                                isHeaderAdded = safeSetRequestHeader(xhr, 'force-java', 'true');
                            }
                        }, 0);

                        return result;
                    };

                    const originalSend = xhr.send;
                    xhr.send = function (...sendArgs) {
                        if (isJavaRequest && !isHeaderAdded) {
                            isHeaderAdded = safeSetRequestHeader(xhr, 'force-java', 'true');
                        }

                        console.log(`${LOG_PREFIX} [${requestId}] XHR: ${method} ${url}`);

                        const handleResponse = () => {
                            if (xhr.readyState !== 4) return;
                            try {
                                const headers = parseHeaders(xhr.getAllResponseHeaders());
                                if (isGrayTipOpen() && (headers['x-gray-go'] === 'reach' || headers['Gray-Go-Market'] === 'reach')) {
                                    const path = new URL(url, ROOT_WINDOW.location.origin).pathname;
                                    MonkeyToast.show(`灰度命中(GO): ${path}`, {
                                        duration: 4000,
                                        action: {
                                            text: '添加到java接口',
                                            onClick: () => {
                                                saveJavaApiPath(path);
                                            }
                                        }
                                    });
                                }
                                if (isAutoUpdate() && currentCache !== getAccountInfo(true) && url.includes("/account/getAccountInfo")) {
                                    GM_setValue(state.cacheKey, getAccountInfo(true));
                                    MonkeyToast.show('devops-smartpush账号测试数据已自动更新');
                                }
                            } catch (e) {
                                console.error(`${LOG_PREFIX} [${requestId}] 解析失败:`, e);
                            } finally {
                                xhr.removeEventListener('readystatechange', handleResponse);
                            }
                        };

                        xhr.addEventListener('readystatechange', handleResponse);
                        return originalSend.apply(this, sendArgs);
                    };
                    return xhr;
                };
            }

            // ========== 2. 抢占式覆盖 ==========
            function takeOver() {
                try {
                    ROOT_WINDOW.XMLHttpRequest = createXhrInterceptor();
                    ROOT_WINDOW.XMLHttpRequest[INTERCEPTOR_MARK] = true;
                } catch (e) {
                    console.error(`${LOG_PREFIX} 抢占失败，10ms后重试:`, e);
                    setTimeout(takeOver, 10);
                }
            }

            // ========== 3. 监控防护 ==========
            function startGuard() {
                const pollTimer = setInterval(() => {
                    if (!ROOT_WINDOW.XMLHttpRequest[INTERCEPTOR_MARK]) {
                        console.warn(`${LOG_PREFIX} 检测到XHR被篡改，重新拦截`);
                        takeOver();
                    }
                }, 100);

                const observer = new MutationObserver(() => {
                    setTimeout(takeOver, 50);
                });
                observer.observe(document, { childList: true, subtree: true });

                window.addEventListener('beforeunload', () => {
                    clearInterval(pollTimer);
                    observer.disconnect();
                });
            }

            // ========== 工具函数：解析响应头 ==========
            function parseHeaders(headerStr) {
                const headers = {};
                if (!headerStr) return headers;
                headerStr.split(/\r?\n/).forEach(line => {
                    const [key, ...values] = line.split(': ');
                    if (key) headers[key.trim().toLowerCase()] = values.join(': ').trim();
                });
                return headers;
            }

            // 多时机兜底
            window.addEventListener('DOMContentLoaded', () => setTimeout(takeOver, 50));
            window.addEventListener('load', () => setTimeout(takeOver, 100));

            // 获取当前灰度配置状态
            const currentGrayMode = getGrayConfig();
            const currentMode = Object.values(GRAY_CONFIG.MODES).find(m => m.id === currentGrayMode);
            const grayStatus = currentMode ? currentMode.name : '未设置';

            // 启动提示
            setTimeout(() => {
                MonkeyToast.show(`${LOG_PREFIX}  
                    
                    全量java开关：${isAllJava() ? '[是]' : '[否]'}
                    已设置java接口：${existJavaList() ? '[是]' : '[否]'}
                    灰度提示开关：${isGrayTipOpen() ? '[是]' : '[否]'}
                    前端灰度控制：${grayStatus}
                    自动更新开关：${isAutoUpdate() ? '[是]' : '[否]'}
                    如存在异常，请关闭脚本`, 3000, {
                    backgroundColor: '#000000ff'
                });
            }, 100);
        }

        const waitForDOMAndInit = () => {
            if (!document.body) {
                setTimeout(waitForDOMAndInit, 100);
                return;
            }

            console.log('DOM已准备就绪，开始初始化UI');

            // 初始化UI组件
            accountInfo();
            GrayXHR();
        };

        waitForDOMAndInit();
    }

    // devops提示和获取店铺信息默认填充
    if (window.location.host.includes('devops.inshopline')) {
        // 点击事件处理函数
        function handleClick() {
            const inputElement = document.querySelector('#新建缺陷_summary');
            const spanElement = document.querySelector("#新建缺陷_requirementVersion");
            const linkIssueIdElement = document.querySelector("#新建缺陷_linkIssueId");
            const textElement = document.querySelector("#新建缺陷 > div:nth-child(2) > div > div.ant-col.ant-col-21.ant-form-item-control.css-1kuana8 > div > div > div > div.for-editor > div.for-editor-edit.for-panel > div > div > textarea")
            const textElement_div = document.querySelector("#新建缺陷 > div:nth-child(2) > div > div.ant-col.ant-col-21.ant-form-item-control.css-1kuana8 > div > div > div > div.for-editor > div.for-editor-edit.for-panel > div > div")
            textElement_div ? textElement_div.style.height = 'auto' : null
            const forElement = document.querySelector("#新建缺陷 > div:nth-child(2) > div > div.ant-col.ant-col-21.ant-form-item-control.css-1kuana8 > div > div > div")
            forElement.style.height = '500px'
            const cacheKey = 'smartpush_account_info';
            const smartpush_account_info = GM_getValue(cacheKey);

            if (textElement) {
                const result_text = textElement.value.replace(/\s+/g, '')
                if (result_text == "[步骤][问题][预期结果]") {
                    textElement.value = '[店铺数据]\n' + smartpush_account_info + '\n\n' + textElement.value + '\n\n';
                }
            }

            if (!inputElement || !linkIssueIdElement || inputElement.value.length !== 0) {
                return;
            }

            const issueStr = getFirstBracketedText(linkIssueIdElement.parentElement.nextSibling.getAttribute('title'));
            // console.log('linkIssueId：', issueStr);

            const versionStr = getVersionStr(spanElement);
            // console.log('versionStr：', versionStr);
            if (inputElement.value.length !== 0) {
                return;
            }
            if (inputElement.value.indexOf(issueStr) === -1) {
                inputElement.value = issueStr;
            }

            inputElement.addEventListener('click', function () {
                if (inputElement.value.length === 0 || inputElement.value === '') {
                    inputElement.value = issueStr;
                } else {
                    console.log('不初始化');
                }
            });
        }


        //匹配历史问题提bug标题
        function getFirstBracketedText(str) {
            if (str.includes("SSP-2222")) {
                return "【历史问题】";
            }
            const match = str.match(/【(.*?)】/);
            return match ? match[0] : null;
        }

        // 获取版本字符串的函数
        function getVersionStr(spanElement) {
            const spanValue = spanElement.parentElement.nextSibling.getAttribute('title')
            if (spanValue != null) {
                return `【${spanValue.split('(')[0]}】`;
            } else {
                return '';
            }
        }

        // 监听点击事件
        window.addEventListener('click', handleClick);
    }

    if (window.location.href.includes('octopuses.myshopline.com/functional/branch-case')) {
        function set_account_info() {
            const lastStoreDataKey = 'last_smartpush_account_info';
            const bugObjKey = 'function_bug_obj';
            const cacheKey = 'smartpush_account_info';
            const smartpush_account_info = GM_getValue(cacheKey);
            const bug_obj = JSON.parse(JSON.parse(localStorage.getItem(bugObjKey)))
            const lastStoreData = localStorage.getItem(lastStoreDataKey);

            let describe = bug_obj['describe'];
            if (isAutoUpdate()) {
                describe = describe.replace(/^\[店铺数据\]\n[\s\S]*?\n\n/, '');
                describe = `[店铺数据]\n${smartpush_account_info}\n\n${describe.trim()}\n`;
                bug_obj['describe'] = describe;
                localStorage.setItem(bugObjKey, JSON.stringify(JSON.stringify(bug_obj)));
                localStorage.setItem(lastStoreDataKey, smartpush_account_info);
            }
        }
        window.addEventListener('click', set_account_info);
    }
})();