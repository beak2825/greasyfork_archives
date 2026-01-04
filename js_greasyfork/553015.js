// ==UserScript==
// @name         2048论坛列表过滤器
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description  过滤论坛列表内容，只显示包含指定关键词的帖子
// @author       You
// @license MIT
// @match        *://*/thread.php*
// @match        *://*/thread.php?*
// @match        *://*/thread.php#*
// @match        *://*/thread.php
// @match        *://*/thread.php/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553015/2048%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553015/2048%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        STORAGE_KEY: 'forum_filter_keyword',
        FILTERED_CLASS: 'forum-filtered-hidden',
        UI_CONTAINER_ID: 'forum-filter-ui',
        // 2048核基地相关域名关键词
        SUPPORTED_DOMAINS: ['2048', 'kzwo', 'go-xxvip', '核基地', 'forum']
    };

    // 添加样式
    GM_addStyle(`
        .${CONFIG.FILTERED_CLASS} {
            display: none !important;
        }
        
        #${CONFIG.UI_CONTAINER_ID} {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            border: 2px solid #1b72af;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        
        #${CONFIG.UI_CONTAINER_ID} input {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            margin-right: 5px;
        }
        
        #${CONFIG.UI_CONTAINER_ID} button {
            padding: 5px 10px;
            background: #1b72af;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        }
        
        #${CONFIG.UI_CONTAINER_ID} button:hover {
            background: #176eac;
        }
        
        #${CONFIG.UI_CONTAINER_ID} .status {
            margin-top: 5px;
            font-size: 11px;
            color: #666;
        }
    `);

    // 域名检测函数
    function isSupportedDomain() {
        const hostname = window.location.hostname.toLowerCase();
        const title = document.title.toLowerCase();
        
        // 检查域名是否包含支持的关键词
        for (const keyword of CONFIG.SUPPORTED_DOMAINS) {
            if (hostname.includes(keyword.toLowerCase()) || title.includes(keyword.toLowerCase())) {
                return true;
            }
        }
        
        // 检查页面内容是否包含2048核基地的特征
        const bodyText = document.body.textContent.toLowerCase();
        if (bodyText.includes('人人为我') || bodyText.includes('2048') || bodyText.includes('核基地')) {
            return true;
        }
        
        return false;
    }

    // 主类
    class ForumFilter {
        constructor() {
            // 检查是否在支持的域名上运行
            if (!isSupportedDomain()) {
                console.log('Forum Filter: 当前域名不支持，脚本将不运行');
                return;
            }
            
            this.keyword = GM_getValue(CONFIG.STORAGE_KEY, '');
            this.isFiltering = false;
            this.init();
        }

        init() {
            this.createUI();
            this.applyFilter();
            this.setupPaginationListener();
        }

        createUI() {
            // 移除已存在的UI
            const existingUI = document.getElementById(CONFIG.UI_CONTAINER_ID);
            if (existingUI) {
                existingUI.remove();
            }

            // 创建UI容器
            const uiContainer = document.createElement('div');
            uiContainer.id = CONFIG.UI_CONTAINER_ID;
            
            uiContainer.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">论坛过滤器</div>
                <input type="text" id="filter-keyword" placeholder="输入过滤关键词" value="${this.keyword}">
                <button id="apply-filter">应用过滤</button>
                <button id="clear-filter">清除过滤</button>
                <button id="toggle-filter">${this.isFiltering ? '显示全部' : '隐藏全部'}</button>
                <div class="status" id="filter-status"></div>
            `;

            document.body.appendChild(uiContainer);

            // 绑定事件
            document.getElementById('apply-filter').addEventListener('click', () => {
                this.keyword = document.getElementById('filter-keyword').value.trim();
                GM_setValue(CONFIG.STORAGE_KEY, this.keyword);
                this.applyFilter();
            });

            document.getElementById('clear-filter').addEventListener('click', () => {
                this.keyword = '';
                GM_setValue(CONFIG.STORAGE_KEY, '');
                document.getElementById('filter-keyword').value = '';
                this.clearFilter();
            });

            document.getElementById('toggle-filter').addEventListener('click', () => {
                this.toggleAll();
            });

            // 回车键应用过滤
            document.getElementById('filter-keyword').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.keyword = document.getElementById('filter-keyword').value.trim();
                    GM_setValue(CONFIG.STORAGE_KEY, this.keyword);
                    this.applyFilter();
                }
            });
        }

        applyFilter() {
            if (!this.keyword) {
                this.clearFilter();
                return;
            }

            const subjects = document.querySelectorAll('a.subject');
            let visibleCount = 0;
            let hiddenCount = 0;

            subjects.forEach(subject => {
                const text = subject.textContent.toLowerCase();
                const keyword = this.keyword.toLowerCase();
                
                if (text.includes(keyword)) {
                    subject.closest('tr').classList.remove(CONFIG.FILTERED_CLASS);
                    visibleCount++;
                } else {
                    subject.closest('tr').classList.add(CONFIG.FILTERED_CLASS);
                    hiddenCount++;
                }
            });

            this.isFiltering = true;
            this.updateStatus(`显示 ${visibleCount} 条，隐藏 ${hiddenCount} 条`);
            this.updateToggleButton();
        }

        clearFilter() {
            const hiddenElements = document.querySelectorAll(`.${CONFIG.FILTERED_CLASS}`);
            hiddenElements.forEach(element => {
                element.classList.remove(CONFIG.FILTERED_CLASS);
            });

            this.isFiltering = false;
            this.updateStatus('已清除所有过滤');
            this.updateToggleButton();
        }

        toggleAll() {
            const subjects = document.querySelectorAll('a.subject');
            
            if (this.isFiltering) {
                // 显示全部
                subjects.forEach(subject => {
                    subject.closest('tr').classList.remove(CONFIG.FILTERED_CLASS);
                });
                this.isFiltering = false;
                this.updateStatus('显示全部内容');
            } else {
                // 隐藏全部
                subjects.forEach(subject => {
                    subject.closest('tr').classList.add(CONFIG.FILTERED_CLASS);
                });
                this.isFiltering = true;
                this.updateStatus('已隐藏全部内容');
            }
            
            this.updateToggleButton();
        }

        updateStatus(message) {
            const statusElement = document.getElementById('filter-status');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }

        updateToggleButton() {
            const toggleButton = document.getElementById('toggle-filter');
            if (toggleButton) {
                toggleButton.textContent = this.isFiltering ? '显示全部' : '隐藏全部';
            }
        }

        setupPaginationListener() {
            // 监听翻页链接点击
            const paginationLinks = document.querySelectorAll('a[href*="page="]');
            paginationLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // 保存当前过滤状态
                    GM_setValue(CONFIG.STORAGE_KEY, this.keyword);
                });
            });

            // 监听页面变化（用于AJAX翻页）
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        // 检查是否有新的列表项添加
                        const newSubjects = document.querySelectorAll('a.subject');
                        if (newSubjects.length > 0) {
                            // 延迟应用过滤，确保DOM完全更新
                            setTimeout(() => {
                                if (this.keyword) {
                                    this.applyFilter();
                                }
                            }, 100);
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ForumFilter();
        });
    } else {
        new ForumFilter();
    }

})();
