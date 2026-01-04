// ==UserScript==
// @name         网页收藏到Notion
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键收藏当前网页到Notion数据库，支持显示/隐藏浮动按钮
// @author       pipi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notificat// ==UserScript==
// @name         网页收藏到Notion
// @namespace    http://tampermonkey.net/
// @description  一键收藏当前网页到Notion数据库，支持显示/隐藏浮动按钮
// @author       pipi
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      notion.com
// @connect      api.notion.com
// @license      PIPI
// @downloadURL https://update.greasyfork.org/scripts/549767/%E7%BD%91%E9%A1%B5%E6%94%B6%E8%97%8F%E5%88%B0Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/549767/%E7%BD%91%E9%A1%B5%E6%94%B6%E8%97%8F%E5%88%B0Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储键
    const CONFIG_KEYS = {
        API_KEY: 'bookmark_notion_api_key',
        DATABASE_ID: 'bookmark_notion_database_id',
        BUTTON_VISIBLE: 'bookmark_button_visible'
    };

    // 默认配置
    const DEFAULT_CONFIG = {
        apiKey: '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',
        databaseId: '1caa720b00a6800b8a2cd4369db1ac1f'
    };

    // 当前配置
    let currentConfig = {
        apiKey: GM_getValue(CONFIG_KEYS.API_KEY, DEFAULT_CONFIG.apiKey),
        databaseId: GM_getValue(CONFIG_KEYS.DATABASE_ID, DEFAULT_CONFIG.databaseId)
    };

    // 按钮可见性状态
    let isButtonVisible = GM_getValue(CONFIG_KEYS.BUTTON_VISIBLE, false);

    // 浮动按钮元素
    let floatingButton = null;

    // 当前页面收藏状态
    let isBookmarked = false;

    // 初始化
    function init() {
        // 注册菜单命令
        GM_registerMenuCommand("显示/隐藏收藏网页按钮", toggleButtonVisibility);
        GM_registerMenuCommand("配置Notion", showConfigDialog);

        // 如果按钮应该显示，则创建按钮
        if (isButtonVisible) {
            createFloatingButton();
            // 检查当前页面是否已收藏
            checkBookmarkStatus();
        }
    }

    // 切换按钮可见性
    function toggleButtonVisibility() {
        isButtonVisible = !isButtonVisible;
        GM_setValue(CONFIG_KEYS.BUTTON_VISIBLE, isButtonVisible);

        if (isButtonVisible) {
            createFloatingButton();
            checkBookmarkStatus();
            showNotification('收藏按钮已显示', 'success');
        } else {
            removeFloatingButton();
            showNotification('收藏按钮已隐藏', 'info');
        }
    }

    // 创建浮动按钮
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        removeFloatingButton();

        floatingButton = document.createElement('div');
        floatingButton.id = 'bookmark-floating-button';
        floatingButton.innerHTML = `
            <div class="bookmark-icon">
                <span class="star-icon">☆</span>
            </div>
            <div class="bookmark-ripple"></div>
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">✨</div>
            <div class="sparkle sparkle-3">✨</div>
        `;
        floatingButton.title = '收藏到Notion';

        // 样式设置
        Object.assign(floatingButton.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '30px',
            height: '30px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '2147483647',
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            border: 'none',
            outline: 'none',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        });

        // 添加内部样式
        const style = document.createElement('style');
        style.textContent = `
            #bookmark-floating-button .bookmark-icon {
                position: relative;
                z-index: 2;
                transition: transform 0.3s ease;
            }

            #bookmark-floating-button .star-icon {
                font-size: 15px;
                font-weight: bold;
                transition: all 0.3s ease;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            #bookmark-floating-button.bookmarked .star-icon {
                color: #FFD1DC;
                text-shadow: 0 0 12px rgba(255, 209, 220, 0.8), 0 0 20px rgba(255, 182, 193, 0.6);
            }

            #bookmark-floating-button .bookmark-ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
                pointer-events: none;
            }

            #bookmark-floating-button:hover .bookmark-icon {
                transform: scale(1.1);
            }

            #bookmark-floating-button:active .bookmark-ripple {
                width: 100px;
                height: 100px;
            }

            #bookmark-floating-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 16px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #bookmark-floating-button:hover::before {
                opacity: 1;
            }

            #bookmark-floating-button .sparkle {
                position: absolute;
                font-size: 12px;
                opacity: 0;
                pointer-events: none;
                animation: sparkleFloat 2s ease-in-out infinite;
            }

            #bookmark-floating-button .sparkle-1 {
                top: 10px;
                right: 10px;
                animation-delay: 0s;
            }

            #bookmark-floating-button .sparkle-2 {
                bottom: 15px;
                left: 8px;
                animation-delay: 0.7s;
            }

            #bookmark-floating-button .sparkle-3 {
                top: 20px;
                left: 15px;
                animation-delay: 1.4s;
            }

            #bookmark-floating-button:hover .sparkle {
                opacity: 1;
            }

            @keyframes sparkleFloat {
                0%, 100% {
                    opacity: 0;
                    transform: translateY(0) scale(0.8);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-10px) scale(1.2);
                }
            }
        `;
        document.head.appendChild(style);

        // 悬停效果
        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.transform = 'translateY(-2px) scale(1.05)';
            floatingButton.style.boxShadow = '0 12px 40px rgba(255, 182, 193, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)';
        });

        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.transform = 'translateY(0) scale(1)';
            floatingButton.style.boxShadow = '0 8px 32px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)';
        });

        // 点击效果
        floatingButton.addEventListener('click', (e) => {
            const ripple = floatingButton.querySelector('.bookmark-ripple');
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 600);

            bookmarkCurrentPage();
        });

        document.body.appendChild(floatingButton);
    }

    // 检查当前页面是否已收藏
    async function checkBookmarkStatus() {
        try {
            if (!currentConfig.apiKey || !currentConfig.databaseId) {
                return;
            }

            const pageUrl = window.location.href;
            const existingPageId = await checkExistingBookmark(pageUrl);
            isBookmarked = !!existingPageId;
            updateButtonState();
        } catch (error) {
            console.error('检查收藏状态时出错:', error);
        }
    }

    // 更新按钮状态
    function updateButtonState() {
        if (!floatingButton) return;

        const starIcon = floatingButton.querySelector('.star-icon');
        if (isBookmarked) {
            floatingButton.classList.add('bookmarked');
            starIcon.textContent = '★';
            floatingButton.title = '已收藏，点击取消收藏';
        } else {
            floatingButton.classList.remove('bookmarked');
            starIcon.textContent = '☆';
            floatingButton.title = '收藏到Notion';
        }
    }

    // 移除浮动按钮
    function removeFloatingButton() {
        if (floatingButton) {
            floatingButton.remove();
            floatingButton = null;
        }
    }

    // 收藏当前页面
    async function bookmarkCurrentPage() {
        try {
            // 检查配置
            if (!currentConfig.apiKey || !currentConfig.databaseId) {
                showNotification('请先配置Notion API和数据库ID', 'error');
                showConfigDialog();
                return;
            }

            // 获取页面信息
            const pageTitle = document.title || '无标题';
            const pageUrl = window.location.href;

            // 显示加载状态
            if (floatingButton) {
                const starIcon = floatingButton.querySelector('.star-icon');
                starIcon.textContent = '⏳';
                floatingButton.style.pointerEvents = 'none';
            }

            if (isBookmarked) {
                // 取消收藏
                const existingPageId = await checkExistingBookmark(pageUrl);
                if (existingPageId) {
                    const success = await deleteBookmark(existingPageId);
                    if (success) {
                        isBookmarked = false;
                        updateButtonState();
                        showNotification('已取消收藏', 'info');
                    } else {
                        showNotification('取消收藏失败', 'error');
                    }
                }
            } else {
                // 添加收藏
                const existingPageId = await checkExistingBookmark(pageUrl);

                if (existingPageId) {
                    isBookmarked = true;
                    updateButtonState();
                    showNotification('该网页已收藏过', 'warning');
                } else {
                    const success = await createBookmark(pageTitle, pageUrl);

                    if (success) {
                        isBookmarked = true;
                        updateButtonState();
                        showNotification('网页收藏成功！', 'success');
                    } else {
                        showNotification('收藏失败，请检查配置', 'error');
                    }
                }
            }

        } catch (error) {
            console.error('收藏网页时出错:', error);
            showNotification('操作失败: ' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            if (floatingButton) {
                updateButtonState();
                floatingButton.style.pointerEvents = 'auto';
            }
        }
    }

    // 检查是否已存在书签
    async function checkExistingBookmark(url) {
        return new Promise((resolve, reject) => {
            const query = {
                filter: {
                    property: "链接",
                    rich_text: {
                        equals: url
                    }
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.notion.com/v1/databases/${currentConfig.databaseId}/query`,
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(query),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.results.length > 0 ? data.results[0].id : null);
                    } else {
                        reject(new Error('查询失败: ' + response.status));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 创建书签
    async function createBookmark(title, url) {
        return new Promise((resolve, reject) => {
            const data = {
                parent: { database_id: currentConfig.databaseId },
                properties: {
                    "标题": {
                        title: [
                            {
                                text: {
                                    content: title
                                }
                            }
                        ]
                    },
                    "链接": {
                        rich_text: [
                            {
                                text: {
                                    content: url
                                }
                            }
                        ]
                    }
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.notion.com/v1/pages",
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(true);
                    } else {
                        console.error('创建书签失败:', response.responseText);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('创建书签出错:', error);
                    resolve(false);
                }
            });
        });
    }

    // 删除书签
    async function deleteBookmark(pageId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://api.notion.com/v1/pages/${pageId}`,
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify({
                    archived: true
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(true);
                    } else {
                        console.error('删除书签失败:', response.responseText);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('删除书签出错:', error);
                    resolve(false);
                }
            });
        });
    }

    // 显示配置对话框
    function showConfigDialog() {
        // 创建对话框
        const dialogWrapper = document.createElement('div');
        dialogWrapper.className = 'bookmark-config-dialog-wrapper';
        Object.assign(dialogWrapper.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
            backdropFilter: 'blur(8px)',
            zIndex: '2147483647',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease'
        });

        const dialog = document.createElement('div');
        dialog.className = 'bookmark-config-dialog';
        Object.assign(dialog.style, {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '28px',
            padding: '32px',
            width: '520px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(255, 182, 193, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 182, 193, 0.1)',
            position: 'relative',
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加动画样式
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(animationStyle);

        // 标题
        const title = document.createElement('h2');
        title.textContent = 'Notion配置';
        Object.assign(title.style, {
            margin: '0 0 24px 0',
            padding: '0 0 16px 0',
            borderBottom: '2px solid #e2e8f0',
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            position: 'relative'
        });

        // 添加标题装饰线
        const titleDecoration = document.createElement('div');
        Object.assign(titleDecoration.style, {
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            borderRadius: '2px'
        });
        title.appendChild(titleDecoration);
        dialog.appendChild(title);

        // API密钥输入
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'Notion API 密钥';
        Object.assign(apiKeyLabel.style, {
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#4a5568',
            position: 'relative'
        });
        dialog.appendChild(apiKeyLabel);

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.value = currentConfig.apiKey;
        apiKeyInput.placeholder = '输入你的 Notion API 密钥';
        Object.assign(apiKeyInput.style, {
            width: '100%',
            padding: '16px 20px',
            marginBottom: '24px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            boxSizing: 'border-box',
            fontSize: '15px',
            background: '#ffffff',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.05)'
        });

        // 输入框聚焦效果
        apiKeyInput.addEventListener('focus', () => {
            apiKeyInput.style.borderColor = '#FFB6C1';
            apiKeyInput.style.boxShadow = '0 0 0 3px rgba(255, 182, 193, 0.1)';
        });
        apiKeyInput.addEventListener('blur', () => {
            apiKeyInput.style.borderColor = '#e2e8f0';
            apiKeyInput.style.boxShadow = '0 2px 4px rgba(255, 182, 193, 0.05)';
        });

        dialog.appendChild(apiKeyInput);

        // 数据库ID输入
        const dbIdLabel = document.createElement('label');
        dbIdLabel.textContent = '书签数据库 ID';
        Object.assign(dbIdLabel.style, {
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#4a5568'
        });
        dialog.appendChild(dbIdLabel);

        const dbIdInput = document.createElement('input');
        dbIdInput.type = 'text';
        dbIdInput.value = currentConfig.databaseId;
        dbIdInput.placeholder = '输入书签数据库 ID';
        Object.assign(dbIdInput.style, {
            width: '100%',
            padding: '16px 20px',
            marginBottom: '24px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            boxSizing: 'border-box',
            fontSize: '15px',
            background: '#ffffff',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.05)'
        });

        // 输入框聚焦效果
        dbIdInput.addEventListener('focus', () => {
            dbIdInput.style.borderColor = '#FFB6C1';
            dbIdInput.style.boxShadow = '0 0 0 3px rgba(255, 182, 193, 0.1)';
        });
        dbIdInput.addEventListener('blur', () => {
            dbIdInput.style.borderColor = '#e2e8f0';
            dbIdInput.style.boxShadow = '0 2px 4px rgba(255, 182, 193, 0.05)';
        });

        dialog.appendChild(dbIdInput);

        // 帮助说明
        const helpText = document.createElement('div');
        helpText.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                padding: 20px;
                margin: 24px 0;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
                "></div>
                <h4 style="
                    margin: 0 0 16px 0;
                    color: #2d3748;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                ">
                    <span style="
                        display: inline-block;
                        width: 4px;
                        height: 16px;
                        background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
                        margin-right: 8px;
                        border-radius: 2px;
                    "></span>
                    配置说明
                </h4>
                <div style="font-size: 14px; color: #4a5568; line-height: 1.6;">
                    <p style="margin: 0 0 12px 0;">
                        <strong style="color: #2d3748;">如何获取 Notion API 密钥：</strong><br>
                        1. 访问 <a href="https://www.notion.so/my-integrations" target="_blank" style="color: #FFB6C1; text-decoration: none; font-weight: 500;">Notion Integrations</a><br>
                        2. 点击 "New integration" 创建新集成<br>
                        3. 复制生成的 "Internal Integration Token"<br>
                        4. 在 Notion 中将数据库与该集成共享
                    </p>
                    <p style="margin: 0 0 12px 0;">
                        <strong style="color: #2d3748;">如何获取数据库 ID：</strong><br>
                        数据库 ID 是数据库 URL 中的这一部分：<br>
                        <code style="
                            background: #f1f5f9;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-family: 'Monaco', 'Consolas', monospace;
                            font-size: 13px;
                            color: #2d3748;
                        ">https://www.notion.so/xxx/<mark style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0 4px; border-radius: 3px;">databaseID</mark>?v=...</code>
                    </p>
                    <p style="margin: 0;">
                        <strong style="color: #2d3748;">数据库属性要求：</strong><br>
                        • 标题属性：类型为"标题"<br>
                        • 链接属性：类型为"富文本"
                    </p>
                </div>
            </div>
        `;
        dialog.appendChild(helpText);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
        });

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        Object.assign(cancelButton.style, {
            padding: '14px 28px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            color: '#4a5568',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        });

        // 取消按钮悬停效果
        cancelButton.addEventListener('mouseenter', () => {
            cancelButton.style.borderColor = '#cbd5e0';
            cancelButton.style.transform = 'translateY(-1px)';
            cancelButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        cancelButton.addEventListener('mouseleave', () => {
            cancelButton.style.borderColor = '#e2e8f0';
            cancelButton.style.transform = 'translateY(0)';
            cancelButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        });

        cancelButton.onclick = () => {
            document.body.removeChild(dialogWrapper);
        };
        buttonContainer.appendChild(cancelButton);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存配置';
        Object.assign(saveButton.style, {
            padding: '14px 32px',
            border: 'none',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
        });

        // 保存按钮悬停效果
        saveButton.addEventListener('mouseenter', () => {
            saveButton.style.transform = 'translateY(-2px)';
            saveButton.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.6)';
        });
        saveButton.addEventListener('mouseleave', () => {
            saveButton.style.transform = 'translateY(0)';
            saveButton.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
        });

        // 保存按钮点击效果
        saveButton.addEventListener('mousedown', () => {
            saveButton.style.transform = 'translateY(0) scale(0.98)';
        });
        saveButton.addEventListener('mouseup', () => {
            saveButton.style.transform = 'translateY(-2px) scale(1)';
        });

        saveButton.onclick = () => {
            const newApiKey = apiKeyInput.value.trim();
            const newDbId = dbIdInput.value.trim();

            if (!newApiKey || !newDbId) {
                showNotification('API密钥和数据库ID不能为空', 'error');
                return;
            }

            // 保存配置
            currentConfig.apiKey = newApiKey;
            currentConfig.databaseId = newDbId;
            GM_setValue(CONFIG_KEYS.API_KEY, newApiKey);
            GM_setValue(CONFIG_KEYS.DATABASE_ID, newDbId);

            showNotification('配置已保存', 'success');
            document.body.removeChild(dialogWrapper);
        };
        buttonContainer.appendChild(saveButton);

        dialog.appendChild(buttonContainer);
        dialogWrapper.appendChild(dialog);
        document.body.appendChild(dialogWrapper);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const configs = {
            success: {
                background: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)',
                icon: 'success',
                color: 'white'
            },
            error: {
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFA0B4 100%)',
                icon: 'error',
                color: 'white'
            },
            warning: {
                background: 'linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)',
                icon: 'warning',
                color: 'white'
            },
            info: {
                background: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)',
                icon: 'info',
                color: 'white'
            }
        };

        const config = configs[type] || configs.info;

        Swal.fire({
            title: message,
            icon: config.icon,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            background: config.background,
            color: config.color,
            customClass: {
                popup: 'swal2-popup-bookmark',
                title: 'swal2-title-bookmark'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        // 添加自定义样式
        const style = document.createElement('style');
        style.textContent = `
            .swal2-popup-bookmark {
                border-radius: 16px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            .swal2-title-bookmark {
                font-weight: 600 !important;
                font-size: 16px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 启动脚本
    init();

})();
ion
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @connect      notion.com
// @connect      api.notion.com
// @license      PIPI
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储键
    const CONFIG_KEYS = {
        API_KEY: 'bookmark_notion_api_key',
        DATABASE_ID: 'bookmark_notion_database_id',
        BUTTON_VISIBLE: 'bookmark_button_visible'
    };

    // 默认配置
    const DEFAULT_CONFIG = {
        apiKey: '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',
        databaseId: '1a5a720b00a680b2aa44d36f5aafa0d4'
    };

    // 当前配置
    let currentConfig = {
        apiKey: GM_getValue(CONFIG_KEYS.API_KEY, DEFAULT_CONFIG.apiKey),
        databaseId: GM_getValue(CONFIG_KEYS.DATABASE_ID, DEFAULT_CONFIG.databaseId)
    };

    // 按钮可见性状态
    let isButtonVisible = GM_getValue(CONFIG_KEYS.BUTTON_VISIBLE, false);

    // 浮动按钮元素
    let floatingButton = null;

    // 当前页面收藏状态
    let isBookmarked = false;

    // 初始化
    function init() {
        // 注册菜单命令
        GM_registerMenuCommand("显示/隐藏收藏网页按钮", toggleButtonVisibility);
        GM_registerMenuCommand("配置Notion", showConfigDialog);

        // 如果按钮应该显示，则创建按钮
        if (isButtonVisible) {
            createFloatingButton();
            // 检查当前页面是否已收藏
            checkBookmarkStatus();
        }
    }

    // 切换按钮可见性
    function toggleButtonVisibility() {
        isButtonVisible = !isButtonVisible;
        GM_setValue(CONFIG_KEYS.BUTTON_VISIBLE, isButtonVisible);

        if (isButtonVisible) {
            createFloatingButton();
            checkBookmarkStatus();
            showNotification('收藏按钮已显示', 'success');
        } else {
            removeFloatingButton();
            showNotification('收藏按钮已隐藏', 'info');
        }
    }

    // 创建浮动按钮
    function createFloatingButton() {
        // 如果按钮已存在，先移除
        removeFloatingButton();

        floatingButton = document.createElement('div');
        floatingButton.id = 'bookmark-floating-button';
        floatingButton.innerHTML = `
            <div class="bookmark-icon">
                <span class="star-icon">☆</span>
            </div>
            <div class="bookmark-ripple"></div>
            <div class="sparkle sparkle-1">✨</div>
            <div class="sparkle sparkle-2">✨</div>
            <div class="sparkle sparkle-3">✨</div>
        `;
        floatingButton.title = '收藏到Notion';

        // 样式设置
        Object.assign(floatingButton.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '2147483647',
            boxShadow: '0 8px 32px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            border: 'none',
            outline: 'none',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        });

        // 添加内部样式
        const style = document.createElement('style');
        style.textContent = `
            #bookmark-floating-button .bookmark-icon {
                position: relative;
                z-index: 2;
                transition: transform 0.3s ease;
            }

            #bookmark-floating-button .star-icon {
                font-size: 28px;
                font-weight: bold;
                transition: all 0.3s ease;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            #bookmark-floating-button.bookmarked .star-icon {
                color: #FFD1DC;
                text-shadow: 0 0 12px rgba(255, 209, 220, 0.8), 0 0 20px rgba(255, 182, 193, 0.6);
            }

            #bookmark-floating-button .bookmark-ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.6s ease, height 0.6s ease;
                pointer-events: none;
            }

            #bookmark-floating-button:hover .bookmark-icon {
                transform: scale(1.1);
            }

            #bookmark-floating-button:active .bookmark-ripple {
                width: 100px;
                height: 100px;
            }

            #bookmark-floating-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
                border-radius: 16px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            #bookmark-floating-button:hover::before {
                opacity: 1;
            }

            #bookmark-floating-button .sparkle {
                position: absolute;
                font-size: 12px;
                opacity: 0;
                pointer-events: none;
                animation: sparkleFloat 2s ease-in-out infinite;
            }

            #bookmark-floating-button .sparkle-1 {
                top: 10px;
                right: 10px;
                animation-delay: 0s;
            }

            #bookmark-floating-button .sparkle-2 {
                bottom: 15px;
                left: 8px;
                animation-delay: 0.7s;
            }

            #bookmark-floating-button .sparkle-3 {
                top: 20px;
                left: 15px;
                animation-delay: 1.4s;
            }

            #bookmark-floating-button:hover .sparkle {
                opacity: 1;
            }

            @keyframes sparkleFloat {
                0%, 100% {
                    opacity: 0;
                    transform: translateY(0) scale(0.8);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-10px) scale(1.2);
                }
            }
        `;
        document.head.appendChild(style);

        // 悬停效果
        floatingButton.addEventListener('mouseenter', () => {
            floatingButton.style.transform = 'translateY(-2px) scale(1.05)';
            floatingButton.style.boxShadow = '0 12px 40px rgba(255, 182, 193, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)';
        });

        floatingButton.addEventListener('mouseleave', () => {
            floatingButton.style.transform = 'translateY(0) scale(1)';
            floatingButton.style.boxShadow = '0 8px 32px rgba(255, 182, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)';
        });

        // 点击效果
        floatingButton.addEventListener('click', (e) => {
            const ripple = floatingButton.querySelector('.bookmark-ripple');
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 600);

            bookmarkCurrentPage();
        });

        document.body.appendChild(floatingButton);
    }

    // 检查当前页面是否已收藏
    async function checkBookmarkStatus() {
        try {
            if (!currentConfig.apiKey || !currentConfig.databaseId) {
                return;
            }

            const pageUrl = window.location.href;
            const existingPageId = await checkExistingBookmark(pageUrl);
            isBookmarked = !!existingPageId;
            updateButtonState();
        } catch (error) {
            console.error('检查收藏状态时出错:', error);
        }
    }

    // 更新按钮状态
    function updateButtonState() {
        if (!floatingButton) return;

        const starIcon = floatingButton.querySelector('.star-icon');
        if (isBookmarked) {
            floatingButton.classList.add('bookmarked');
            starIcon.textContent = '★';
            floatingButton.title = '已收藏，点击取消收藏';
        } else {
            floatingButton.classList.remove('bookmarked');
            starIcon.textContent = '☆';
            floatingButton.title = '收藏到Notion';
        }
    }

    // 移除浮动按钮
    function removeFloatingButton() {
        if (floatingButton) {
            floatingButton.remove();
            floatingButton = null;
        }
    }

    // 收藏当前页面
    async function bookmarkCurrentPage() {
        try {
            // 检查配置
            if (!currentConfig.apiKey || !currentConfig.databaseId) {
                showNotification('请先配置Notion API和数据库ID', 'error');
                showConfigDialog();
                return;
            }

            // 获取页面信息
            const pageTitle = document.title || '无标题';
            const pageUrl = window.location.href;

            // 显示加载状态
            if (floatingButton) {
                const starIcon = floatingButton.querySelector('.star-icon');
                starIcon.textContent = '⏳';
                floatingButton.style.pointerEvents = 'none';
            }

            if (isBookmarked) {
                // 取消收藏
                const existingPageId = await checkExistingBookmark(pageUrl);
                if (existingPageId) {
                    const success = await deleteBookmark(existingPageId);
                    if (success) {
                        isBookmarked = false;
                        updateButtonState();
                        showNotification('已取消收藏', 'info');
                    } else {
                        showNotification('取消收藏失败', 'error');
                    }
                }
            } else {
                // 添加收藏
                const existingPageId = await checkExistingBookmark(pageUrl);

                if (existingPageId) {
                    isBookmarked = true;
                    updateButtonState();
                    showNotification('该网页已收藏过', 'warning');
                } else {
                    const success = await createBookmark(pageTitle, pageUrl);

                    if (success) {
                        isBookmarked = true;
                        updateButtonState();
                        showNotification('网页收藏成功！', 'success');
                    } else {
                        showNotification('收藏失败，请检查配置', 'error');
                    }
                }
            }

        } catch (error) {
            console.error('收藏网页时出错:', error);
            showNotification('操作失败: ' + error.message, 'error');
        } finally {
            // 恢复按钮状态
            if (floatingButton) {
                updateButtonState();
                floatingButton.style.pointerEvents = 'auto';
            }
        }
    }

    // 检查是否已存在书签
    async function checkExistingBookmark(url) {
        return new Promise((resolve, reject) => {
            const query = {
                filter: {
                    property: "网址",
                    rich_text: {
                        equals: url
                    }
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: `https://api.notion.com/v1/databases/${currentConfig.databaseId}/query`,
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(query),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const data = JSON.parse(response.responseText);
                        resolve(data.results.length > 0 ? data.results[0].id : null);
                    } else {
                        reject(new Error('查询失败: ' + response.status));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 创建书签
    async function createBookmark(title, url) {
        return new Promise((resolve, reject) => {
            const data = {
                parent: { database_id: currentConfig.databaseId },
                properties: {
                    "标题": {
                        title: [
                            {
                                text: {
                                    content: title
                                }
                            }
                        ]
                    },
                    "网址": {
                        rich_text: [
                            {
                                text: {
                                    content: url
                                }
                            }
                        ]
                    }
                }
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.notion.com/v1/pages",
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(true);
                    } else {
                        console.error('创建书签失败:', response.responseText);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('创建书签出错:', error);
                    resolve(false);
                }
            });
        });
    }

    // 删除书签
    async function deleteBookmark(pageId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://api.notion.com/v1/pages/${pageId}`,
                headers: {
                    "Authorization": `Bearer ${currentConfig.apiKey}`,
                    "Content-Type": "application/json",
                    "Notion-Version": "2022-06-28"
                },
                data: JSON.stringify({
                    archived: true
                }),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(true);
                    } else {
                        console.error('删除书签失败:', response.responseText);
                        resolve(false);
                    }
                },
                onerror: function(error) {
                    console.error('删除书签出错:', error);
                    resolve(false);
                }
            });
        });
    }

    // 显示配置对话框
    function showConfigDialog() {
        // 创建对话框
        const dialogWrapper = document.createElement('div');
        dialogWrapper.className = 'bookmark-config-dialog-wrapper';
        Object.assign(dialogWrapper.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.1) 100%)',
            backdropFilter: 'blur(8px)',
            zIndex: '2147483647',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease'
        });

        const dialog = document.createElement('div');
        dialog.className = 'bookmark-config-dialog';
        Object.assign(dialog.style, {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '28px',
            padding: '32px',
            width: '520px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(255, 182, 193, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(255, 182, 193, 0.1)',
            position: 'relative',
            animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        // 添加动画样式
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(animationStyle);

        // 标题
        const title = document.createElement('h2');
        title.textContent = 'Notion配置';
        Object.assign(title.style, {
            margin: '0 0 24px 0',
            padding: '0 0 16px 0',
            borderBottom: '2px solid #e2e8f0',
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            position: 'relative'
        });

        // 添加标题装饰线
        const titleDecoration = document.createElement('div');
        Object.assign(titleDecoration.style, {
            position: 'absolute',
            bottom: '-2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            borderRadius: '2px'
        });
        title.appendChild(titleDecoration);
        dialog.appendChild(title);

        // API密钥输入
        const apiKeyLabel = document.createElement('label');
        apiKeyLabel.textContent = 'Notion API 密钥';
        Object.assign(apiKeyLabel.style, {
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#4a5568',
            position: 'relative'
        });
        dialog.appendChild(apiKeyLabel);

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.value = currentConfig.apiKey;
        apiKeyInput.placeholder = '输入你的 Notion API 密钥';
        Object.assign(apiKeyInput.style, {
            width: '100%',
            padding: '16px 20px',
            marginBottom: '24px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            boxSizing: 'border-box',
            fontSize: '15px',
            background: '#ffffff',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.05)'
        });

        // 输入框聚焦效果
        apiKeyInput.addEventListener('focus', () => {
            apiKeyInput.style.borderColor = '#FFB6C1';
            apiKeyInput.style.boxShadow = '0 0 0 3px rgba(255, 182, 193, 0.1)';
        });
        apiKeyInput.addEventListener('blur', () => {
            apiKeyInput.style.borderColor = '#e2e8f0';
            apiKeyInput.style.boxShadow = '0 2px 4px rgba(255, 182, 193, 0.05)';
        });

        dialog.appendChild(apiKeyInput);

        // 数据库ID输入
        const dbIdLabel = document.createElement('label');
        dbIdLabel.textContent = '书签数据库 ID';
        Object.assign(dbIdLabel.style, {
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#4a5568'
        });
        dialog.appendChild(dbIdLabel);

        const dbIdInput = document.createElement('input');
        dbIdInput.type = 'text';
        dbIdInput.value = currentConfig.databaseId;
        dbIdInput.placeholder = '输入书签数据库 ID';
        Object.assign(dbIdInput.style, {
            width: '100%',
            padding: '16px 20px',
            marginBottom: '24px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            boxSizing: 'border-box',
            fontSize: '15px',
            background: '#ffffff',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.05)'
        });

        // 输入框聚焦效果
        dbIdInput.addEventListener('focus', () => {
            dbIdInput.style.borderColor = '#FFB6C1';
            dbIdInput.style.boxShadow = '0 0 0 3px rgba(255, 182, 193, 0.1)';
        });
        dbIdInput.addEventListener('blur', () => {
            dbIdInput.style.borderColor = '#e2e8f0';
            dbIdInput.style.boxShadow = '0 2px 4px rgba(255, 182, 193, 0.05)';
        });

        dialog.appendChild(dbIdInput);

        // 帮助说明
        const helpText = document.createElement('div');
        helpText.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                padding: 20px;
                margin: 24px 0;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
                "></div>
                <h4 style="
                    margin: 0 0 16px 0;
                    color: #2d3748;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                ">
                    <span style="
                        display: inline-block;
                        width: 4px;
                        height: 16px;
                        background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
                        margin-right: 8px;
                        border-radius: 2px;
                    "></span>
                    配置说明
                </h4>
                <div style="font-size: 14px; color: #4a5568; line-height: 1.6;">
                    <p style="margin: 0 0 12px 0;">
                        <strong style="color: #2d3748;">如何获取 Notion API 密钥：</strong><br>
                        1. 访问 <a href="https://www.notion.so/my-integrations" target="_blank" style="color: #FFB6C1; text-decoration: none; font-weight: 500;">Notion Integrations</a><br>
                        2. 点击 "New integration" 创建新集成<br>
                        3. 复制生成的 "Internal Integration Token"<br>
                        4. 在 Notion 中将数据库与该集成共享
                    </p>
                    <p style="margin: 0 0 12px 0;">
                        <strong style="color: #2d3748;">如何获取数据库 ID：</strong><br>
                        数据库 ID 是数据库 URL 中的这一部分：<br>
                        <code style="
                            background: #f1f5f9;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-family: 'Monaco', 'Consolas', monospace;
                            font-size: 13px;
                            color: #2d3748;
                        ">https://www.notion.so/xxx/<mark style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0 4px; border-radius: 3px;">databaseID</mark>?v=...</code>
                    </p>
                    <p style="margin: 0;">
                        <strong style="color: #2d3748;">数据库属性要求：</strong><br>
                        • 标题属性：类型为"标题"<br>
                        • 网址属性：类型为"富文本"
                    </p>
                </div>
            </div>
        `;
        dialog.appendChild(helpText);

        // 按钮容器
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
        });

        // 取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        Object.assign(cancelButton.style, {
            padding: '14px 28px',
            border: '2px solid #e2e8f0',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            color: '#4a5568',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        });

        // 取消按钮悬停效果
        cancelButton.addEventListener('mouseenter', () => {
            cancelButton.style.borderColor = '#cbd5e0';
            cancelButton.style.transform = 'translateY(-1px)';
            cancelButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
        cancelButton.addEventListener('mouseleave', () => {
            cancelButton.style.borderColor = '#e2e8f0';
            cancelButton.style.transform = 'translateY(0)';
            cancelButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        });

        cancelButton.onclick = () => {
            document.body.removeChild(dialogWrapper);
        };
        buttonContainer.appendChild(cancelButton);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存配置';
        Object.assign(saveButton.style, {
            padding: '14px 32px',
            border: 'none',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            outline: 'none',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
            position: 'relative',
            overflow: 'hidden'
        });

        // 保存按钮悬停效果
        saveButton.addEventListener('mouseenter', () => {
            saveButton.style.transform = 'translateY(-2px)';
            saveButton.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.6)';
        });
        saveButton.addEventListener('mouseleave', () => {
            saveButton.style.transform = 'translateY(0)';
            saveButton.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
        });

        // 保存按钮点击效果
        saveButton.addEventListener('mousedown', () => {
            saveButton.style.transform = 'translateY(0) scale(0.98)';
        });
        saveButton.addEventListener('mouseup', () => {
            saveButton.style.transform = 'translateY(-2px) scale(1)';
        });

        saveButton.onclick = () => {
            const newApiKey = apiKeyInput.value.trim();
            const newDbId = dbIdInput.value.trim();

            if (!newApiKey || !newDbId) {
                showNotification('API密钥和数据库ID不能为空', 'error');
                return;
            }

            // 保存配置
            currentConfig.apiKey = newApiKey;
            currentConfig.databaseId = newDbId;
            GM_setValue(CONFIG_KEYS.API_KEY, newApiKey);
            GM_setValue(CONFIG_KEYS.DATABASE_ID, newDbId);

            showNotification('配置已保存', 'success');
            document.body.removeChild(dialogWrapper);
        };
        buttonContainer.appendChild(saveButton);

        dialog.appendChild(buttonContainer);
        dialogWrapper.appendChild(dialog);
        document.body.appendChild(dialogWrapper);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const configs = {
            success: {
                background: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)',
                icon: 'success',
                color: 'white'
            },
            error: {
                background: 'linear-gradient(135deg, #FFB6C1 0%, #FFA0B4 100%)',
                icon: 'error',
                color: 'white'
            },
            warning: {
                background: 'linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)',
                icon: 'warning',
                color: 'white'
            },
            info: {
                background: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)',
                icon: 'info',
                color: 'white'
            }
        };

        const config = configs[type] || configs.info;

        Swal.fire({
            title: message,
            icon: config.icon,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            background: config.background,
            color: config.color,
            customClass: {
                popup: 'swal2-popup-bookmark',
                title: 'swal2-title-bookmark'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        // 添加自定义样式
        const style = document.createElement('style');
        style.textContent = `
            .swal2-popup-bookmark {
                border-radius: 16px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            .swal2-title-bookmark {
                font-weight: 600 !important;
                font-size: 16px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 启动脚本
    init();

})();
