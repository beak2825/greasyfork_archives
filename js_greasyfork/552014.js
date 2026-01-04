// ==UserScript==
// @name         OpenList 外网链接增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 OpenList 右键菜单添加复制外网链接功能
// @author       huanfeng
// @homepage     https://github.com/huanfeng/openlist-external-link
// @homepageURL     https://github.com/huanfeng/openlist-external-link
// @license      MIT
// @match        https://*/*
// @match        http://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552014/OpenList%20%E5%A4%96%E7%BD%91%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552014/OpenList%20%E5%A4%96%E7%BD%91%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 调试开关 - 设置为 true 开启详细日志
    const DEBUG = false;

    // 日志工具函数
    const logger = {
        log: (...args) => DEBUG && console.log(...args),
        warn: (...args) => DEBUG && console.warn(...args),
        error: (...args) => console.error(...args), // 错误日志始终显示
        init: (...args) => console.log(...args) // 初始化日志始终显示
    };

    // 配置管理
    class ConfigManager {
        constructor() {
            this.configKey = 'openlist_domain_mappings';
            this.positionKey = 'openlist_config_button_position';
            this.historyKey = 'openlist_link_history';
            this.settingsKey = 'openlist_settings';
        }

        // 规范化域名 - 统一处理带/不带/的情况
        normalizeDomain(domain) {
            if (!domain) return '';
            domain = domain.trim();
            // 移除末尾的 /
            while (domain.endsWith('/')) {
                domain = domain.slice(0, -1);
            }
            return domain;
        }

        // 获取域名映射配置
        getDomainMappings() {
            const config = GM_getValue(this.configKey, '[]');
            return JSON.parse(config);
        }

        // 保存域名映射配置
        saveDomainMappings(mappings) {
            GM_setValue(this.configKey, JSON.stringify(mappings));
        }

        // 获取配置按钮位置
        getButtonPosition() {
            const position = GM_getValue(this.positionKey, '{"top":80,"right":20,"edge":"right"}');
            return JSON.parse(position);
        }

        // 保存配置按钮位置
        saveButtonPosition(position) {
            GM_setValue(this.positionKey, JSON.stringify(position));
        }

        // 获取链接历史记录
        getLinkHistory() {
            const history = GM_getValue(this.historyKey, '[]');
            return JSON.parse(history);
        }

        // 保存链接历史记录
        saveLinkHistory(history) {
            GM_setValue(this.historyKey, JSON.stringify(history));
        }

        // 添加链接到历史记录
        addLinkToHistory(url, originalUrl) {
            const history = this.getLinkHistory();
            const newItem = {
                id: Date.now().toString(),
                url: url,
                originalUrl: originalUrl,
                timestamp: Date.now()
            };

            // 避免重复添加相同的链接
            const exists = history.find(item => item.url === url);
            if (exists) {
                return;
            }

            history.unshift(newItem);

            // 限制历史记录数量
            const maxHistory = this.getSettings().maxHistory || 50;
            if (history.length > maxHistory) {
                history.splice(maxHistory);
            }

            this.saveLinkHistory(history);
        }

        // 删除历史记录
        removeLinkFromHistory(id) {
            const history = this.getLinkHistory();
            const filtered = history.filter(item => item.id !== id);
            this.saveLinkHistory(filtered);
        }

        // 清空历史记录
        clearLinkHistory() {
            this.saveLinkHistory([]);
        }

        // 获取设置
        getSettings() {
            const settings = GM_getValue(this.settingsKey, '{"maxHistory":50}');
            return JSON.parse(settings);
        }

        // 保存设置
        saveSettings(settings) {
            GM_setValue(this.settingsKey, JSON.stringify(settings));
        }

        // 检查域名是否已存在
        isDomainExists(internalDomain, excludeId = null) {
            const mappings = this.getDomainMappings();
            const normalizedDomain = this.normalizeDomain(internalDomain);
            return mappings.some(m => {
                if (excludeId && m.id === excludeId) {
                    return false; // 排除指定ID（用于编辑时）
                }
                return this.normalizeDomain(m.internalDomain) === normalizedDomain;
            });
        }

        // 添加域名映射
        addMapping(internalDomain, externalDomain) {
            const normalizedInternal = this.normalizeDomain(internalDomain);
            const normalizedExternal = this.normalizeDomain(externalDomain);

            // 检查是否已存在相同的内网域名
            if (this.isDomainExists(normalizedInternal)) {
                throw new Error('该内网域名已存在，请勿重复添加');
            }

            const mappings = this.getDomainMappings();
            const newMapping = {
                id: Date.now().toString(),
                internalDomain: normalizedInternal,
                externalDomain: normalizedExternal,
                enabled: true
            };
            mappings.push(newMapping);
            this.saveDomainMappings(mappings);
            return newMapping;
        }

        // 删除域名映射
        removeMapping(id) {
            const mappings = this.getDomainMappings();
            const filtered = mappings.filter(m => m.id !== id);
            this.saveDomainMappings(filtered);
        }

        // 更新域名映射
        updateMapping(id, internalDomain, externalDomain, enabled = true) {
            const normalizedInternal = this.normalizeDomain(internalDomain);
            const normalizedExternal = this.normalizeDomain(externalDomain);

            // 检查是否与其他映射冲突（排除自身）
            if (this.isDomainExists(normalizedInternal, id)) {
                throw new Error('该内网域名已被其他映射使用');
            }

            const mappings = this.getDomainMappings();
            const mapping = mappings.find(m => m.id === id);
            if (mapping) {
                mapping.internalDomain = normalizedInternal;
                mapping.externalDomain = normalizedExternal;
                mapping.enabled = enabled;
                this.saveDomainMappings(mappings);
            }
        }
    }

    // URL转换器
    class UrlConverter {
        constructor(configManager) {
            this.configManager = configManager;
        }

        // 将内网URL转换为外网URL
        convertToExternalUrl(internalUrl) {
            const mappings = this.configManager.getDomainMappings();

            for (const mapping of mappings) {
                if (mapping.enabled && internalUrl.startsWith(mapping.internalDomain)) {
                    return internalUrl.replace(mapping.internalDomain, mapping.externalDomain);
                }
            }

            return internalUrl; // 如果没有匹配的映射，返回原始URL
        }

        // 检查是否有可用的域名映射
        hasAvailableMappings() {
            const mappings = this.configManager.getDomainMappings();
            return mappings.some(m => m.enabled);
        }

        // 检查当前页面是否配置了域名映射
        hasCurrentPageMapping() {
            const currentOrigin = window.location.origin;
            const mappings = this.configManager.getDomainMappings();
            return mappings.some(m => m.enabled && currentOrigin.startsWith(m.internalDomain));
        }
    }

    // 菜单增强器
    class MenuEnhancer {
        constructor(configManager, urlConverter) {
            this.configManager = configManager;
            this.urlConverter = urlConverter;
            this.currentFileUrl = '';
            this.currentFileElement = null;
            this.menuObserver = null;
        }

        // 初始化
        init() {
            logger.init('[OpenList外网链接] MenuEnhancer 初始化开始');

            // 检查是否配置了当前页面的映射
            if (this.urlConverter.hasCurrentPageMapping()) {
                this.setupContextMenuListener();
                this.observeMenuChanges();
                logger.init('[OpenList外网链接] 右键菜单监听器已设置');
            } else {
                logger.init('[OpenList外网链接] 当前页面未配置域名映射，跳过右键菜单补丁');
            }

            this.addConfigButton();
            logger.init('[OpenList外网链接] 配置按钮已添加');
        }

        // 监听右键点击，记录被点击的文件元素
        setupContextMenuListener() {
            document.addEventListener('contextmenu', (e) => {
                // 查找被右键点击的文件项
                const fileItem = e.target.closest('.list-item');
                if (fileItem) {
                    this.currentFileElement = fileItem;
                    const href = fileItem.getAttribute('href');
                    logger.log('[OpenList外网链接] 右键点击文件:', href);
                }
            }, true);
        }

        // 监听右键菜单的出现
        observeMenuChanges() {
            this.menuObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const contextMenu = node.querySelector('.solid-contextmenu') ||
                                (node.classList && node.classList.contains('solid-contextmenu') ? node : null);

                            if (contextMenu) {
                                logger.log('[OpenList外网链接] 检测到右键菜单出现');
                                this.enhanceContextMenu(contextMenu);
                            }
                        }
                    });
                });
            });

            this.menuObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            logger.log('[OpenList外网链接] MutationObserver 已开始监听 body');
        }

        // 增强右键菜单
        enhanceContextMenu(contextMenu) {
            logger.log('[OpenList外网链接] 开始增强右键菜单');

            // 查找"复制链接"菜单项
            const copyLinkItem = this.findCopyLinkItem(contextMenu);
            if (!copyLinkItem) {
                logger.log('[OpenList外网链接] 未找到"复制链接"菜单项');
                return;
            }
            logger.log('[OpenList外网链接] 找到"复制链接"菜单项');

            // 检查是否已经添加过外网链接菜单项
            if (contextMenu.querySelector('.external-link-item')) {
                logger.log('[OpenList外网链接] 已存在外网链接菜单项，跳过');
                return;
            }

            // 直接从文件元素获取链接
            this.getCurrentFileUrl();

            // 创建"复制外网链接"菜单项
            const externalLinkItem = this.createExternalLinkMenuItem();

            // 在"复制链接"项后插入
            copyLinkItem.parentNode.insertBefore(externalLinkItem, copyLinkItem.nextSibling);
            logger.log('[OpenList外网链接] 已添加"复制外网链接"菜单项');
        }

        // 查找"复制链接"菜单项
        findCopyLinkItem(contextMenu) {
            const items = contextMenu.querySelectorAll('.solid-contextmenu__item');
            for (const item of items) {
                const text = item.querySelector('p');
                if (text && text.textContent.trim() === '复制链接') {
                    return item;
                }
            }
            return null;
        }

        // 从文件元素直接获取URL
        getCurrentFileUrl() {
            logger.log('[OpenList外网链接] 尝试获取文件链接');

            if (!this.currentFileElement) {
                logger.warn('[OpenList外网链接] 没有记录到文件元素');
                this.currentFileUrl = window.location.href;
                return;
            }

            // 从文件项的 href 属性获取路径
            const href = this.currentFileElement.getAttribute('href');
            if (href) {
                // 构建完整的下载链接
                // OpenList 的下载链接格式是: http://domain/d/path
                const origin = window.location.origin;
                this.currentFileUrl = `${origin}/d${href}`;
                logger.log('[OpenList外网链接] 成功获取文件链接:', this.currentFileUrl);
            } else {
                logger.warn('[OpenList外网链接] 文件元素没有 href 属性');
                this.currentFileUrl = window.location.href;
            }
        }

        // 创建"复制外网链接"菜单项
        createExternalLinkMenuItem() {
            const menuItem = document.createElement('div');
            menuItem.className = 'solid-contextmenu__item external-link-item';

            const isAvailable = this.urlConverter.hasAvailableMappings();

            menuItem.innerHTML = `
                <div class="solid-contextmenu__item__content">
                    <div class="hope-stack hope-c-dhzjXW hope-c-PJLV hope-c-PJLV-ihVlqVC-css">
                        <svg stroke-width="2" color="currentColor" viewBox="0 0 24 24" stroke="currentColor" fill="none"
                             stroke-linecap="round" stroke-linejoin="round"
                             class="hope-icon hope-c-XNyZK hope-c-PJLV hope-c-PJLV-idbpawf-css"
                             height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M9 15l6 -6"></path>
                            <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
                            <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
                            <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
                        </svg>
                        <p class="hope-text hope-c-PJLV hope-c-PJLV hope-c-PJLV-ijhzIfm-css"
                           style="${!isAvailable ? 'opacity: 0.5;' : ''}">
                            复制外网链接${!isAvailable ? ' (未配置)' : ''}
                        </p>
                    </div>
                </div>
            `;

            // 添加点击事件
            menuItem.addEventListener('click', (e) => {
                this.handleExternalLinkCopy();

                // 延迟关闭菜单，确保复制操作完成
                setTimeout(() => {
                    this.closeContextMenu();
                }, 10);
            });

            return menuItem;
        }

        // 处理复制外网链接
        handleExternalLinkCopy() {
            if (!this.urlConverter.hasAvailableMappings()) {
                alert('请先配置域名映射！');
                this.showConfigDialog();
                return;
            }

            logger.log('[OpenList外网链接] 处理复制外网链接, currentFileUrl:', this.currentFileUrl);

            if (this.currentFileUrl) {
                const externalUrl = this.urlConverter.convertToExternalUrl(this.currentFileUrl);
                logger.log('[OpenList外网链接] 转换后的外网URL:', externalUrl);

                // 使用降级方案复制（因为 clipboard API 可能不可用）
                this.fallbackCopyToClipboard(externalUrl);

                // 添加到历史记录
                this.configManager.addLinkToHistory(externalUrl, this.currentFileUrl);
            } else {
                alert('无法获取文件链接，请重试');
            }
        }

        // 关闭右键菜单
        closeContextMenu() {
            // 模拟点击事件来关闭菜单
            setTimeout(() => {
                const contextMenu = document.querySelector('.solid-contextmenu');
                if (contextMenu) {
                    // 在 body 上触发完整的点击事件序列
                    const mousedown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        clientX: 0,
                        clientY: 0
                    });
                    document.body.dispatchEvent(mousedown);

                    setTimeout(() => {
                        const mouseup = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            clientX: 0,
                            clientY: 0
                        });
                        document.body.dispatchEvent(mouseup);

                        const click = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            clientX: 0,
                            clientY: 0
                        });
                        document.body.dispatchEvent(click);
                    }, 10);
                }
            }, 50);
        }

        // 降级复制方案
        fallbackCopyToClipboard(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('外网链接已复制到剪贴板');
        }

        // 显示通知
        showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 10000;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }

        // 添加配置按钮
        addConfigButton() {
            logger.log('[OpenList外网链接] 准备添加配置按钮');

            const configButton = document.createElement('div');
            configButton.id = 'openlist-config-button';

            // 从存储中读取位置
            const savedPosition = this.configManager.getButtonPosition();
            const buttonSize = 40;

            // 设置初始样式
            const updateButtonPosition = (pos) => {
                configButton.style.cssText = `
                    position: fixed;
                    width: ${buttonSize}px;
                    height: ${buttonSize}px;
                    background: #2196F3;
                    border-radius: 50%;
                    cursor: move;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    transition: background 0.3s;
                    user-select: none;
                `;

                // 根据贴边位置设置坐标
                if (pos.edge === 'left') {
                    configButton.style.left = '20px';
                    configButton.style.top = pos.top + 'px';
                    configButton.style.right = 'auto';
                } else {
                    configButton.style.right = '20px';
                    configButton.style.top = pos.top + 'px';
                    configButton.style.left = 'auto';
                }
            };

            updateButtonPosition(savedPosition);
            configButton.innerHTML = '⚙️';
            configButton.title = '配置外网域名映射（可拖动）';

            // 拖动功能
            let isDragging = false;
            let startX, startY;
            let startButtonX, startButtonY;

            const onMouseDown = (e) => {
                if (e.button !== 0) return; // 只响应左键
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = configButton.getBoundingClientRect();
                startButtonX = rect.left;
                startButtonY = rect.top;

                configButton.style.cursor = 'grabbing';
                configButton.style.transition = 'none'; // 拖动时禁用过渡
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newX = startButtonX + deltaX;
                let newY = startButtonY + deltaY;

                // 限制在视窗内
                newX = Math.max(0, Math.min(newX, window.innerWidth - buttonSize));
                newY = Math.max(0, Math.min(newY, window.innerHeight - buttonSize));

                // 临时设置位置（不贴边）
                configButton.style.left = newX + 'px';
                configButton.style.top = newY + 'px';
                configButton.style.right = 'auto';

                e.preventDefault();
            };

            const onMouseUp = (e) => {
                if (!isDragging) return;
                isDragging = false;

                configButton.style.cursor = 'move';
                configButton.style.transition = 'all 0.3s ease';

                const rect = configButton.getBoundingClientRect();
                const centerX = rect.left + buttonSize / 2;
                const centerY = rect.top + buttonSize / 2;

                // 判断贴边
                let edge = 'right';
                let finalTop = centerY - buttonSize / 2;

                if (centerX < window.innerWidth / 2) {
                    edge = 'left';
                }

                // 限制top值在合理范围
                finalTop = Math.max(20, Math.min(finalTop, window.innerHeight - buttonSize - 20));

                // 保存位置
                const position = {
                    top: Math.round(finalTop),
                    edge: edge
                };
                this.configManager.saveButtonPosition(position);

                // 应用贴边位置
                updateButtonPosition(position);

                // 判断是否为点击（移动距离很小）
                const moveDistance = Math.sqrt(
                    Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2)
                );

                if (moveDistance < 5) {
                    // 视为点击
                    logger.log('[OpenList外网链接] 配置按钮被点击');
                    this.showConfigDialog();
                }

                e.preventDefault();
            };

            configButton.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            configButton.addEventListener('mouseover', () => {
                if (!isDragging) {
                    configButton.style.background = '#1976D2';
                }
            });

            configButton.addEventListener('mouseout', () => {
                if (!isDragging) {
                    configButton.style.background = '#2196F3';
                }
            });

            document.body.appendChild(configButton);
            logger.log('[OpenList外网链接] 配置按钮已添加到页面');
        }

        // 显示配置对话框
        showConfigDialog() {
            const dialog = new ConfigDialog(this.configManager);
            dialog.show();
        }
    }

    // 配置对话框
    class ConfigDialog {
        constructor(configManager) {
            this.configManager = configManager;
            this.dialog = null;
            this.overlay = null;
            this.currentTab = 'mappings'; // 'mappings' or 'history'
        }

        show() {
            if (this.overlay) {
                this.overlay.remove();
            }

            this.createDialog();
            this.switchTab('mappings');
        }

        createDialog() {
            // 创建遮罩层
            this.overlay = document.createElement('div');
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // 创建对话框
            this.dialog = document.createElement('div');
            this.dialog.style.cssText = `
                background: white;
                border-radius: 8px;
                width: 700px;
                max-width: 90vw;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
            `;

            this.dialog.innerHTML = `
                <div style="padding: 20px; border-bottom: 1px solid #eee;">
                    <h2 style="margin: 0; color: #333;">外网链接增强设置</h2>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button id="tab-mappings" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">域名映射</button>
                        <button id="tab-history" style="padding: 8px 16px; background: #ddd; color: #666; border: none; border-radius: 4px; cursor: pointer;">历史记录</button>
                    </div>
                </div>
                <div id="tab-content" style="padding: 20px; max-height: 450px; overflow-y: auto; flex: 1;">
                    <!-- 动态内容 -->
                </div>
                <div style="padding: 20px; border-top: 1px solid #eee; text-align: right;">
                    <button id="close-dialog" style="padding: 8px 16px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                </div>
            `;

            this.overlay.appendChild(this.dialog);
            document.body.appendChild(this.overlay);

            // 绑定事件
            this.bindEvents();
        }

        bindEvents() {
            // 切换标签
            this.dialog.querySelector('#tab-mappings').addEventListener('click', () => {
                this.switchTab('mappings');
            });

            this.dialog.querySelector('#tab-history').addEventListener('click', () => {
                this.switchTab('history');
            });

            // 关闭对话框
            this.dialog.querySelector('#close-dialog').addEventListener('click', () => {
                this.overlay.remove();
            });

            // 点击遮罩层关闭
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.overlay.remove();
                }
            });
        }

        switchTab(tabName) {
            this.currentTab = tabName;

            // 更新标签样式
            const tabMappings = this.dialog.querySelector('#tab-mappings');
            const tabHistory = this.dialog.querySelector('#tab-history');

            if (tabName === 'mappings') {
                tabMappings.style.background = '#2196F3';
                tabMappings.style.color = 'white';
                tabHistory.style.background = '#ddd';
                tabHistory.style.color = '#666';
                this.showMappingsTab();
            } else {
                tabHistory.style.background = '#2196F3';
                tabHistory.style.color = 'white';
                tabMappings.style.background = '#ddd';
                tabMappings.style.color = '#666';
                this.showHistoryTab();
            }
        }

        showMappingsTab() {
            const content = this.dialog.querySelector('#tab-content');
            content.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">添加域名映射</h3>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="internal-domain" placeholder="内网域名 (如: http://fileserver.local)"
                               style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <input type="text" id="external-domain" placeholder="外网域名 (如: https://file.myserver.com)"
                               style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="add-mapping" style="padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">添加</button>
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        示例：内网域名 http://fileserver.local → 外网域名 https://file.myserver.com
                    </div>
                </div>

                <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">链接测试</h3>
                    <div style="margin-bottom: 10px;">
                        <input type="text" id="test-url" placeholder="输入要测试的内网链接 (如: http://fileserver.local/d/path/file.txt)"
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;">
                        <button id="test-convert" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">测试转换</button>
                    </div>
                    <div id="test-result" style="display: none; margin-top: 10px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #ddd;">
                        <div style="margin-bottom: 8px;">
                            <strong>原始链接:</strong>
                            <div id="test-original" style="color: #666; word-break: break-all; margin-top: 4px;"></div>
                        </div>
                        <div>
                            <strong>转换后链接:</strong>
                            <div id="test-converted" style="color: #2196F3; word-break: break-all; margin-top: 4px;"></div>
                        </div>
                        <div id="test-match-info" style="margin-top: 8px; font-size: 12px; color: #666;"></div>
                    </div>
                </div>

                <div id="mappings-list"></div>
            `;

            // 绑定事件
            content.querySelector('#add-mapping').addEventListener('click', () => {
                this.addMapping();
            });

            ['#internal-domain', '#external-domain'].forEach(selector => {
                content.querySelector(selector).addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addMapping();
                    }
                });
            });

            // 绑定测试按钮事件
            content.querySelector('#test-convert').addEventListener('click', () => {
                this.testUrlConvert();
            });

            content.querySelector('#test-url').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.testUrlConvert();
                }
            });

            this.loadMappings();
        }

        // 测试URL转换
        testUrlConvert() {
            const testUrl = this.dialog.querySelector('#test-url').value.trim();
            const testResult = this.dialog.querySelector('#test-result');
            const testOriginal = this.dialog.querySelector('#test-original');
            const testConverted = this.dialog.querySelector('#test-converted');
            const testMatchInfo = this.dialog.querySelector('#test-match-info');

            if (!testUrl) {
                alert('请输入要测试的链接');
                return;
            }

            // 使用 UrlConverter 进行转换
            const urlConverter = new UrlConverter(this.configManager);
            const convertedUrl = urlConverter.convertToExternalUrl(testUrl);

            // 显示结果
            testOriginal.textContent = testUrl;
            testConverted.textContent = convertedUrl;

            // 检查是否匹配到映射
            const mappings = this.configManager.getDomainMappings();
            let matchedMapping = null;
            for (const mapping of mappings) {
                if (mapping.enabled && testUrl.startsWith(mapping.internalDomain)) {
                    matchedMapping = mapping;
                    break;
                }
            }

            if (matchedMapping) {
                testMatchInfo.innerHTML = `<span style="color: #4caf50;">✓ 匹配到映射规则:</span> ${this.escapeHtml(matchedMapping.internalDomain)} → ${this.escapeHtml(matchedMapping.externalDomain)}`;
                testConverted.style.color = '#4caf50';
            } else {
                testMatchInfo.innerHTML = '<span style="color: #ff9800;">⚠ 未匹配到任何映射规则，返回原始链接</span>';
                testConverted.style.color = '#ff9800';
            }

            testResult.style.display = 'block';
        }

        // HTML转义工具函数
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        showHistoryTab() {
            const content = this.dialog.querySelector('#tab-content');
            const settings = this.configManager.getSettings();

            content.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <label style="color: #666; margin-right: 10px;">最大历史记录数:</label>
                            <input type="number" id="max-history" value="${settings.maxHistory || 50}"
                                   min="10" max="500" step="10"
                                   style="width: 80px; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                            <button id="save-settings" style="margin-left: 10px; padding: 6px 12px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
                        </div>
                        <button id="clear-history" style="padding: 6px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">清空历史</button>
                    </div>
                </div>
                <div id="history-list"></div>
            `;

            // 绑定事件
            content.querySelector('#save-settings').addEventListener('click', () => {
                this.saveSettings();
            });

            content.querySelector('#clear-history').addEventListener('click', () => {
                this.clearHistory();
            });

            this.loadHistory();
        }

        addMapping() {
            const internalDomain = this.dialog.querySelector('#internal-domain').value.trim();
            const externalDomain = this.dialog.querySelector('#external-domain').value.trim();

            if (!internalDomain || !externalDomain) {
                alert('请填写完整的域名信息');
                return;
            }

            try {
                this.configManager.addMapping(internalDomain, externalDomain);
                this.loadMappings();

                // 清空输入框
                this.dialog.querySelector('#internal-domain').value = '';
                this.dialog.querySelector('#external-domain').value = '';
                this.showMiniNotification('域名映射已添加');
            } catch (error) {
                alert(error.message);
            }
        }

        loadMappings() {
            const mappings = this.configManager.getDomainMappings();
            const listContainer = this.dialog.querySelector('#mappings-list');

            if (mappings.length === 0) {
                listContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无域名映射配置</div>';
                return;
            }

            listContainer.innerHTML = mappings.map(mapping => {
                const escapedInternal = this.escapeHtml(mapping.internalDomain);
                const escapedExternal = this.escapeHtml(mapping.externalDomain);
                return `
                    <div class="mapping-item" data-id="${mapping.id}" style="border: 1px solid #eee; border-radius: 4px; padding: 15px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: between; align-items: center;">
                            <div style="flex: 1;">
                                <div class="mapping-display-${mapping.id}">
                                    <div style="font-weight: bold; margin-bottom: 5px;">内网: ${escapedInternal}</div>
                                    <div style="color: #666;">外网: ${escapedExternal}</div>
                                </div>
                                <div class="mapping-edit-${mapping.id}" style="display: none;">
                                    <input type="text" class="edit-internal" value="${escapedInternal}"
                                           style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 5px;">
                                    <input type="text" class="edit-external" value="${escapedExternal}"
                                           style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                            </div>
                            <div>
                                <button class="edit-mapping-btn"
                                        style="padding: 4px 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">编辑</button>
                                <button class="save-mapping-btn" style="display: none; padding: 4px 8px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">保存</button>
                                <button class="cancel-edit-btn" style="display: none; padding: 4px 8px; background: #999; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">取消</button>
                                <button class="delete-mapping-btn"
                                        style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px;">删除</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // 使用事件委托绑定按钮事件
            listContainer.querySelectorAll('.mapping-item').forEach(itemDiv => {
                const mappingId = itemDiv.dataset.id;
                const mapping = mappings.find(m => m.id === mappingId);

                // 编辑按钮
                itemDiv.querySelector('.edit-mapping-btn').addEventListener('click', () => {
                    this.enterEditMode(mappingId);
                });

                // 保存按钮
                itemDiv.querySelector('.save-mapping-btn').addEventListener('click', () => {
                    this.saveMapping(mappingId);
                });

                // 取消按钮
                itemDiv.querySelector('.cancel-edit-btn').addEventListener('click', () => {
                    this.exitEditMode(mappingId);
                });

                // 删除按钮
                itemDiv.querySelector('.delete-mapping-btn').addEventListener('click', () => {
                    this.removeMapping(mappingId);
                });
            });
        }

        // 进入编辑模式
        enterEditMode(id) {
            const displayDiv = this.dialog.querySelector(`.mapping-display-${id}`);
            const editDiv = this.dialog.querySelector(`.mapping-edit-${id}`);
            const item = this.dialog.querySelector(`[data-id="${id}"]`);

            displayDiv.style.display = 'none';
            editDiv.style.display = 'block';

            item.querySelector('.edit-mapping-btn').style.display = 'none';
            item.querySelector('.save-mapping-btn').style.display = 'inline-block';
            item.querySelector('.cancel-edit-btn').style.display = 'inline-block';
            item.querySelector('.delete-mapping-btn').style.display = 'none';
        }

        // 退出编辑模式
        exitEditMode(id) {
            const displayDiv = this.dialog.querySelector(`.mapping-display-${id}`);
            const editDiv = this.dialog.querySelector(`.mapping-edit-${id}`);
            const item = this.dialog.querySelector(`[data-id="${id}"]`);

            displayDiv.style.display = 'block';
            editDiv.style.display = 'none';

            item.querySelector('.edit-mapping-btn').style.display = 'inline-block';
            item.querySelector('.save-mapping-btn').style.display = 'none';
            item.querySelector('.cancel-edit-btn').style.display = 'none';
            item.querySelector('.delete-mapping-btn').style.display = 'inline-block';

            // 恢复原始值
            this.loadMappings();
        }

        // 保存编辑
        saveMapping(id) {
            const item = this.dialog.querySelector(`[data-id="${id}"]`);
            const editDiv = this.dialog.querySelector(`.mapping-edit-${id}`);
            const internalDomain = editDiv.querySelector('.edit-internal').value.trim();
            const externalDomain = editDiv.querySelector('.edit-external').value.trim();

            if (!internalDomain || !externalDomain) {
                alert('请填写完整的域名信息');
                return;
            }

            try {
                this.configManager.updateMapping(id, internalDomain, externalDomain);
                this.loadMappings();
                this.showMiniNotification('域名映射已更新');
            } catch (error) {
                alert(error.message);
            }
        }

        removeMapping(id) {
            if (confirm('确定要删除这个域名映射吗？')) {
                this.configManager.removeMapping(id);
                this.loadMappings();
            }
        }

        loadHistory() {
            const history = this.configManager.getLinkHistory();
            const listContainer = this.dialog.querySelector('#history-list');

            if (history.length === 0) {
                listContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无历史记录</div>';
                return;
            }

            // 使用安全的 HTML，避免字符串拼接导致的注入问题
            listContainer.innerHTML = history.map(item => {
                const date = new Date(item.timestamp);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

                return `
                    <div class="history-item" data-id="${item.id}" style="border: 1px solid #eee; border-radius: 4px; padding: 12px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 12px; color: #999; margin-bottom: 5px;">${dateStr}</div>
                                <div style="word-break: break-all; margin-bottom: 5px; color: #333;">
                                    <strong>外网:</strong> ${this.escapeHtml(item.url)}
                                </div>
                                <div style="word-break: break-all; font-size: 12px; color: #666;">
                                    <strong>原始:</strong> ${this.escapeHtml(item.originalUrl)}
                                </div>
                            </div>
                            <div style="display: flex; gap: 5px; flex-shrink: 0;">
                                <button class="copy-history-btn"
                                        style="padding: 4px 8px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">复制</button>
                                <button class="delete-history-btn"
                                        style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // 使用事件委托绑定按钮事件
            listContainer.querySelectorAll('.history-item').forEach(itemDiv => {
                const itemId = itemDiv.dataset.id;
                const historyItem = history.find(h => h.id === itemId);

                if (historyItem) {
                    // 复制按钮
                    itemDiv.querySelector('.copy-history-btn').addEventListener('click', () => {
                        this.copyHistoryLink(historyItem.url);
                    });

                    // 删除按钮
                    itemDiv.querySelector('.delete-history-btn').addEventListener('click', () => {
                        this.removeHistoryItem(historyItem.id);
                    });
                }
            });
        }

        copyHistoryLink(url) {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            // 显示提示
            this.showMiniNotification('链接已复制');
        }

        removeHistoryItem(id) {
            if (confirm('确定要删除这条历史记录吗？')) {
                this.configManager.removeLinkFromHistory(id);
                this.loadHistory();
            }
        }

        clearHistory() {
            if (confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
                this.configManager.clearLinkHistory();
                this.loadHistory();
            }
        }

        saveSettings() {
            const maxHistory = parseInt(this.dialog.querySelector('#max-history').value);
            if (isNaN(maxHistory) || maxHistory < 10 || maxHistory > 500) {
                alert('请输入有效的数字 (10-500)');
                return;
            }

            const settings = this.configManager.getSettings();
            settings.maxHistory = maxHistory;
            this.configManager.saveSettings(settings);

            this.showMiniNotification('设置已保存');
        }

        showMiniNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 10001;
                font-size: 14px;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                document.body.removeChild(notification);
            }, 1500);
        }
    }

    // 检查是否为 OpenList 页面
    function isOpenListPage() {
        // 方法1: 检查 meta 标签
        const metaGenerator = document.querySelector('meta[name="generator"]');
        if (metaGenerator && metaGenerator.content === 'OpenList') {
            return true;
        }

        // 方法2: 检查页面特征元素（备用）
        if (document.querySelector('.list-item') && document.querySelector('.solid-contextmenu')) {
            return true;
        }

        return false;
    }

    // 主程序
    function init() {
        logger.init('[OpenList外网链接] 脚本开始初始化...');
        logger.init('[OpenList外网链接] 当前URL:', window.location.href);

        // 检查是否为 OpenList 页面
        if (!isOpenListPage()) {
            logger.init('[OpenList外网链接] 非 OpenList 页面，脚本不加载');
            return;
        }

        logger.init('[OpenList外网链接] 检测到 OpenList 页面');

        try {
            const configManager = new ConfigManager();
            const urlConverter = new UrlConverter(configManager);
            const menuEnhancer = new MenuEnhancer(configManager, urlConverter);

            menuEnhancer.init();
            logger.init('[OpenList外网链接] 脚本初始化完成');
        } catch (error) {
            logger.error('[OpenList外网链接] 初始化失败:', error);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        logger.init('[OpenList外网链接] 等待DOM加载完成...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        logger.init('[OpenList外网链接] DOM已加载，立即初始化');
        // 确保body存在后再初始化
        if (document.body) {
            init();
        } else {
            // 如果body还不存在，等待一下
            setTimeout(init, 100);
        }
    }

})();