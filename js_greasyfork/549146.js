// ==UserScript==
// @license MIT
// @name         枫林网动漫黑名单
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  在枫林网中自动读取动漫名称，提供简单界面管理黑名单并隐藏不喜欢的动漫
// @author       Grok
// @match        https://*.imaple8.tv/*
// @match        https://*.imaple.tv/*
// @match        https://*.olevod.com/*
// @match        https://*.olevod.tv/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549146/%E6%9E%AB%E6%9E%97%E7%BD%91%E5%8A%A8%E6%BC%AB%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/549146/%E6%9E%AB%E6%9E%97%E7%BD%91%E5%8A%A8%E6%BC%AB%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义黑名单储存键
    const BLACKLIST_KEY = 'anime_blacklist';

    // 从 GM_getValue 获取黑名单
    function getBlacklist() {
        return GM_getValue(BLACKLIST_KEY, []);
    }

    // 保存黑名单到 GM_setValue
    function saveBlacklist(blacklist) {
        GM_setValue(BLACKLIST_KEY, blacklist);
    }

    // 隐藏黑名单中的动漫
    function hideBlacklistedAnime() {
        const blacklist = getBlacklist();
        document.querySelectorAll('.myui-vodlist__box').forEach(box => {
            const titleElement = box.querySelector('.title a');
            if (titleElement) {
                const title = titleElement.textContent.trim();
                const parent = box.closest('li');
                if (parent) {
                    parent.style.display = blacklist.includes(title) ? 'none' : '';
                }
            }
        });
    }

    // 添加叉叉按钮到每个动漫项目
    function addCloseButtons() {
        document.querySelectorAll('.myui-vodlist__thumb').forEach(thumb => {
            // 如果已经添加过按钮，跳过
            if (thumb.querySelector('.block-close-btn')) return;

            const closeBtn = document.createElement('span');
            closeBtn.className = 'block-close-btn';
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                font-size: 14px;
                font-weight: bold;
            `;

            // 添加悬停效果
            closeBtn.addEventListener('mouseover', () => {
                closeBtn.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
            });
            closeBtn.addEventListener('mouseout', () => {
                closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });

            // 点击事件 - 添加到黑名单
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const box = thumb.closest('.myui-vodlist__box');
                if (box) {
                    const titleElement = box.querySelector('.title a');
                    if (titleElement) {
                        const title = titleElement.textContent.trim();
                        let blacklist = getBlacklist();

                        if (!blacklist.includes(title)) {
                            blacklist.push(title);
                            saveBlacklist(blacklist);
                            hideBlacklistedAnime();

                            // 显示提示信息
                            const notification = document.createElement('div');
                            notification.textContent = `已將「${title}」加入黑名单`;
                            notification.style.cssText = `
                                position: fixed;
                                top: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background-color: #28a745;
                                color: white;
                                padding: 10px 20px;
                                border-radius: 5px;
                                z-index: 10000;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                            `;
                            document.body.appendChild(notification);

                            // 2秒后移除提示
                            setTimeout(() => {
                                if (notification.parentNode) {
                                    notification.parentNode.removeChild(notification);
                                }
                            }, 2000);
                        }
                    }
                }
            });

            thumb.style.position = 'relative';
            thumb.appendChild(closeBtn);
        });
    }

    // 显示动漫名称列表并管理黑名单
    function displayAndManageBlacklist() {
        if (document.querySelector('.blacklist-panel')) return;

        // 延迟检查以确保动态内容加载完成
        let retryCount = 0;
        const maxRetries = 5;
        const checkTitles = () => {
            const animeNames = [];
            document.querySelectorAll('.title a').forEach(el => {
                const title = el.textContent.trim();
                if (title && !animeNames.includes(title)) {
                    animeNames.push(title);
                }
            });

            if (animeNames.length === 0 && retryCount < maxRetries) {
                retryCount++;
                console.log(`尚未检测到动漫名称，第 ${retryCount} 次重试...`);
                setTimeout(checkTitles, 1000);
                return;
            }

            if (animeNames.length === 0) {
                console.log('未找到任何动漫名称，无法显示黑名单管理面板');
                return;
            }

            const panel = document.createElement('div');
            panel.className = 'blacklist-panel';
            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #1c1c1c;
                border: 1px solid #333;
                padding: 20px;
                z-index: 10000;
                max-height: 80vh;
                overflow-y: auto;
                width: 500px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.6);
                border-radius: 8px;
                color: #fff;
                font-family: inherit;
            `;
            panel.innerHTML = `
                <h2 style="margin-top: 0; color: #ffcc00; border-bottom: 1px solid #444; padding-bottom: 10px;">动漫名称与黑名单管理</h2>
                <p style="color: #aaa; font-size: 14px;">点击按钮将动漫加入/移出黑名单</p>
                <ul id="anime-list" style="list-style: none; padding: 0; max-height: 300px; overflow-y: auto;"></ul>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="close-btn" style="padding: 8px 16px; border: none; border-radius: 5px; background-color: #dc3545; color: white; cursor: pointer;">关闭</button>
                </div>
            `;
            document.body.appendChild(panel);

            const animeList = document.getElementById('anime-list');
            animeNames.forEach(title => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.padding = '8px';
                li.style.backgroundColor = '#2a2a2a';
                li.style.borderRadius = '4px';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.innerHTML = `
                    <span style="flex-grow: 1;">${title}</span>
                    <button class="blacklist-btn" data-title="${title}" style="background-color: ${getBlacklist().includes(title) ? '#dc3545' : '#28a745'}; color: white; border: none; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 10px;">${getBlacklist().includes(title) ? '移除' : '加入黑名单'}</button>
                `;
                animeList.appendChild(li);
            });

            animeList.querySelectorAll('.blacklist-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const title = btn.dataset.title;
                    let blacklist = getBlacklist();
                    if (blacklist.includes(title)) {
                        blacklist = blacklist.filter(t => t !== title);
                        btn.textContent = '加入黑名单';
                        btn.style.backgroundColor = '#28a745';
                    } else {
                        blacklist.push(title);
                        btn.textContent = '移除';
                        btn.style.backgroundColor = '#dc3545';
                    }
                    saveBlacklist(blacklist);
                    hideBlacklistedAnime();
                });
            });

            document.getElementById('close-btn').addEventListener('click', () => {
                panel.remove();
            });
        };

        checkTitles();
    }

    // 添加管理按钮
    function addManageButton() {
        if (document.querySelector('.blacklist-manage-btn')) return;

        const manageBtn = document.createElement('button');
        manageBtn.className = 'blacklist-manage-btn';
        manageBtn.textContent = '管理黑名单';
        manageBtn.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            z-index: 9999;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background-color: #ffcc00;
            color: #000;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(manageBtn);

        manageBtn.addEventListener('click', displayAndManageBlacklist);
    }

    // 监听动态内容加载
    const observer = new MutationObserver(() => {
        hideBlacklistedAnime();
        addManageButton();
        addCloseButtons(); // 添加叉叉按钮
    });

    // 开始监听页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载时执行
    window.addEventListener('load', () => {
        console.log('脚本开始执行，初始化黑名单管理...');
        hideBlacklistedAnime();
        addManageButton();
        addCloseButtons(); // 添加叉叉按钮
    });

    // 周期性检查
    setInterval(() => {
        hideBlacklistedAnime();
        addManageButton();
        addCloseButtons(); // 添加叉叉按钮
    }, 3000);
})();