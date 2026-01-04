// ==UserScript==
// @name         NodeSeek 帖子屏蔽工具
// @namespace    https://github.com/FlyxFly
// @version      0.1
// @description  屏蔽 NodeSeek 网站上包含特定关键词的帖子
// @author       kiwi, chatGLM
// @match        https://www.nodeseek.com/
// @match        https://www.nodeseek.com/page-*
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/553336/NodeSeek%20%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/553336/NodeSeek%20%E5%B8%96%E5%AD%90%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置键名
    const STORAGE_KEY = 'ns-trash';

    // 初始化屏蔽词列表
    let blockedWords = [];

    // 从 localStorage 加载配置
    function loadBlockedWords() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                blockedWords = JSON.parse(saved);
            } catch (e) {
                console.error('加载屏蔽词配置失败:', e);
                blockedWords = [];
            }
        }
    }

    // 保存配置到 localStorage
    function saveBlockedWords() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedWords));
    }

    // 创建设置面板
    function createSettingsPanel() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // 创建面板容器
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 500px;
            max-width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        // 面板标题
        const title = document.createElement('h3');
        title.textContent = '屏蔽词设置';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        `;

        // 说明文字
        const description = document.createElement('p');
        description.textContent = '每行输入一个屏蔽词，不区分大小写';
        description.style.cssText = `
            margin-bottom: 15px;
            color: #666;
            font-size: 14px;
        `;

        // 输入框
        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            width: 100%;
            height: 200px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
        `;
        textarea.value = blockedWords.join('\n');

        // 按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            margin-top: 15px;
            text-align: right;
        `;

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
            font-size: 14px;
        `;
        saveBtn.addEventListener('click', () => {
            const words = textarea.value
                .split('\n')
                .map(word => word.trim())
                .filter(word => word.length > 0);
            blockedWords = words;
            saveBlockedWords();
            applyFilters();
            document.body.removeChild(overlay);
        });

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // 组装面板
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);
        panel.appendChild(title);
        panel.appendChild(description);
        panel.appendChild(textarea);
        panel.appendChild(buttonContainer);
        overlay.appendChild(panel);

        // 添加到页面
        document.body.appendChild(overlay);

        // 自动聚焦输入框
        textarea.focus();
    }

    // 应用屏蔽规则
    function applyFilters() {
        const postItems = document.querySelectorAll('.post-list .post-list-item');

        postItems.forEach(item => {
            const titleElement = item.querySelector('.post-title a');
            if (titleElement) {
                const title = titleElement.textContent.toLowerCase();
                const shouldHide = blockedWords.some(word =>
                    title.includes(word.toLowerCase())
                );

                if (shouldHide) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                }
            }
        });
    }

    // 添加设置按钮
    function addSettingsButton() {
        const menuContainer = document.querySelector('.user-card .menu div');
        if (menuContainer && !menuContainer.querySelector('.ns-trash-settings')) {
            const settingsLink = document.createElement('a');
            settingsLink.textContent = '屏蔽设置';
            settingsLink.href = 'javascript:void(0)';
            settingsLink.className = 'ns-trash-settings';
            settingsLink.style.cssText = `
                transition: background-color 0.2s;
            `;

            settingsLink.addEventListener('mouseenter', () => {
                settingsLink.style.backgroundColor = '#f5f5f5';
            });

            settingsLink.addEventListener('mouseleave', () => {
                settingsLink.style.backgroundColor = '';
            });

            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                createSettingsPanel();
            });

            menuContainer.appendChild(settingsLink);
        }
    }

    // 初始化
    function init() {
        loadBlockedWords();
        addSettingsButton();
        applyFilters();
    }

    // 监听页面变化（适用于动态加载的内容）
    const observer = new MutationObserver(() => {
        addSettingsButton();
        applyFilters();
    });

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
