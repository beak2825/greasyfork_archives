// ==UserScript==
// @name         多平台右侧导航面板增强版
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  在右侧显示知乎、B站、豆瓣、X(推特)、Pixiv、微博、Reddit和YouTube的独立导航面板
// @author       You
// @match        https://*.zhihu.com/*
// @match        https://*.bilibili.com/*
// @match        https://*.douban.com/*
// @match        https://*.x.com/*
// @match        https://*.pixiv.net/*
// @match        https://*.weibo.com/*
// @match        https://*.reddit.com/*
// @match        https://*.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548905/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E5%8F%B3%E4%BE%A7%E5%AF%BC%E8%88%AA%E9%9D%A2%E6%9D%BF%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548905/%E5%A4%9A%E5%B9%B3%E5%8F%B0%E5%8F%B3%E4%BE%A7%E5%AF%BC%E8%88%AA%E9%9D%A2%E6%9D%BF%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 平台数据定义
    const platformData = {
        zhihu: {
            name: '知乎',
            users: [],
            color: '#0084ff'
        },
        bilibili: {
            name: 'B站',
            users: [],
            color: '#fb7299'
        },
        douban: {
            name: '豆瓣',
            users: [],
            color: '#007722'
        },
        x: {
            name: 'X(推特)',
            users: [],
            color: '#000000'
        },
        pixiv: {
            name: 'Pixiv',
            users: [],
            color: '#0096fa'
        },
        weibo: {
            name: '微博',
            users: [],
            color: '#e6162d'
        },
        reddit: {
            name: 'Reddit',
            users: [],
            color: '#ff4500'
        },
        youtube: {
            name: 'YouTube',
            users: [],
            color: '#ff0000'
        }
    };

    // 获取当前平台
    const currentHost = window.location.hostname;
    let currentPlatform = 'zhihu'; // 默认

    if (currentHost.includes('bilibili')) {
        currentPlatform = 'bilibili';
    } else if (currentHost.includes('douban')) {
        currentPlatform = 'douban';
    } else if (currentHost.includes('x.com')) {
        currentPlatform = 'x';
    } else if (currentHost.includes('pixiv.net')) {
        currentPlatform = 'pixiv';
    } else if (currentHost.includes('weibo.com')) {
        currentPlatform = 'weibo';
    } else if (currentHost.includes('reddit.com')) {
        currentPlatform = 'reddit';
    } else if (currentHost.includes('youtube.com')) {
        currentPlatform = 'youtube';
    }

    // 从存储中获取用户列表或使用初始列表
    const platformUsers = GM_getValue(`${currentPlatform}_users`, platformData[currentPlatform].users);

    // 创建主容器
    const container = document.createElement('div');
    container.id = 'multi-platform-panel';
    document.body.appendChild(container);

    // 颜色加深函数
    function darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R < 0 ? 0 : R) * 0x10000 +
            (G < 0 ? 0 : G) * 0x100 +
            (B < 0 ? 0 : B)
        ).toString(16).slice(1);
    }

    // 颜色变淡函数
    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R > 255 ? 255 : R) * 0x10000 +
            (G > 255 ? 255 : G) * 0x100 +
            (B > 255 ? 255 : B)
        ).toString(16).slice(1);
    }

    // 计算不同元素的颜色（微调颜色方案）
    const primaryColor = platformData[currentPlatform].color;
    const headerColor = lightenColor(primaryColor, 5); // 导航标题稍浅
    const buttonColor = darkenColor(primaryColor, 5); // 超链接按钮稍深
    const actionButtonColor = lightenColor(primaryColor, 5); // 操作按钮稍浅

    // 添加全局样式
    GM_addStyle(`
        #multi-platform-panel * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        #expand-button {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
            width: 20px;
            height: 40px;
            background-color: ${headerColor};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        #expand-button:hover {
            background-color: ${darkenColor(headerColor, 10)};
        }

        #panel-container {
            position: fixed;
            right: -300px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000;
            width: 250px;
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 10px 0 0 10px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
            transition: right 0.3s ease;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background-color: ${headerColor};
            color: white;
        }

        .panel-title {
            font-weight: bold;
            font-size: 14px;
        }

        .close-button {
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            transition: transform 0.2s;
        }

        .close-button:hover {
            transform: scale(1.2);
        }

        #buttons-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 15px;
            overflow-y: auto;
            max-height: calc(80vh - 150px);
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #buttons-grid::-webkit-scrollbar {
            display: none;
        }

        .button-wrapper {
            position: relative;
            overflow: visible;
        }

        .user-button {
            display: block;
            padding: 6px 8px;
            background-color: ${buttonColor};
            color: white !important;
            text-align: center;
            border-radius: 4px;
            text-decoration: none;
            font-weight: 500;
            font-size: 12px;
            transition: all 0.3s;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100px;
        }

        .user-button:hover {
            background-color: ${darkenColor(buttonColor, 10)};
            transform: scale(1.05);
        }

        .delete-button {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 16px;
            height: 16px;
            background-color: ${lightenColor(buttonColor, 20)};
            color: white;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .delete-button:hover {
            opacity: 1;
            background-color: ${lightenColor(buttonColor, 10)};
        }

        .action-button {
            padding: 8px 12px;
            color: white;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
            font-size: 13px;
            background-color: ${actionButtonColor};
            flex: 1;
        }

        .action-button:hover {
            background-color: ${darkenColor(actionButtonColor, 10)};
            transform: scale(1.05);
        }

        .button-container {
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding: 0 15px 15px;
        }
    `);

    // 创建展开按钮
    const expandButton = document.createElement('div');
    expandButton.id = 'expand-button';
    expandButton.textContent = '▶';
    container.appendChild(expandButton);

    // 渲染面板函数
    function renderPanel() {
        // 移除旧的面板容器（如果存在）
        const oldPanel = document.getElementById('panel-container');
        if (oldPanel) oldPanel.remove();

        // 创建面板容器
        const panelContainer = document.createElement('div');
        panelContainer.id = 'panel-container';
        container.appendChild(panelContainer);

        // 添加标题和关闭按钮
        const header = document.createElement('div');
        header.className = 'panel-header';
        panelContainer.appendChild(header);

        const title = document.createElement('div');
        title.className = 'panel-title';
        title.textContent = `${platformData[currentPlatform].name}导航`;
        header.appendChild(title);

        const closeButton = document.createElement('div');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => {
            panelContainer.style.right = '-300px';
            expandButton.style.display = 'flex';
        };
        header.appendChild(closeButton);

        // 创建用户按钮网格容器
        const buttonsGrid = document.createElement('div');
        buttonsGrid.id = 'buttons-grid';
        panelContainer.appendChild(buttonsGrid);

        // 创建用户按钮
        platformUsers.forEach((user) => {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.className = 'button-wrapper';
            buttonsGrid.appendChild(buttonWrapper);

            const button = document.createElement('a');
            button.className = 'user-button';
            button.href = user.url;
            button.target = '_blank';
            button.textContent = user.name;
            buttonWrapper.appendChild(button);

            const deleteButton = document.createElement('div');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '×';
            deleteButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (confirm(`确定要删除 "${user.name}" 吗？`)) {
                    const index = platformUsers.findIndex(u => u.name === user.name && u.url === user.url);
                    if (index !== -1) {
                        platformUsers.splice(index, 1);
                        GM_setValue(`${currentPlatform}_users`, platformUsers);
                        renderPanel();
                    }
                }
            };
            buttonWrapper.appendChild(deleteButton);

            // 当鼠标移入按钮区域时显示删除按钮
            buttonWrapper.onmouseenter = () => {
                deleteButton.style.display = 'flex';
            };

            buttonWrapper.onmouseleave = () => {
                deleteButton.style.display = 'none';
            };

            // 初始隐藏删除按钮
            deleteButton.style.display = 'none';
        });

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        panelContainer.appendChild(buttonContainer);

        // 添加"添加"按钮
        const addButton = document.createElement('div');
        addButton.className = 'action-button';
        addButton.textContent = '添加';
        addButton.onclick = () => {
            const name = prompt('请输入用户名：');
            if (name === null) return;

            const url = prompt('请输入用户主页链接：');
            if (url === null) return;

            if (name && url) {
                platformUsers.push({ name, url });
                GM_setValue(`${currentPlatform}_users`, platformUsers);
                renderPanel();

                // 修复：添加后保持面板展开状态
                panelContainer.style.right = '0';
                expandButton.style.display = 'none';
            }
        };
        buttonContainer.appendChild(addButton);

        // 添加"收藏"按钮
        const collectButton = document.createElement('div');
        collectButton.className = 'action-button';
        collectButton.textContent = '收藏';
        collectButton.onclick = () => {
            const name = prompt('请输入收藏名称：', document.title);
            if (name === null) return;

            const url = window.location.href;

            if (name && url) {
                platformUsers.push({ name, url });
                GM_setValue(`${currentPlatform}_users`, platformUsers);
                renderPanel();

                // 修复：收藏后保持面板展开状态
                panelContainer.style.right = '0';
                expandButton.style.display = 'none';
            }
        };
        buttonContainer.appendChild(collectButton);

        // 展开按钮点击事件
        expandButton.onclick = () => {
            panelContainer.style.right = '0';
            expandButton.style.display = 'none';
        };
    }

    // 初始渲染
    renderPanel();
})();