// ==UserScript==
// @name         Linux.do 快速搜索助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在搜索栏右侧增加一个【搜索】按钮，点击后可输入内容并自动搜索跳转
// @author       xin
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552209/Linuxdo%20%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552209/Linuxdo%20%E5%BF%AB%E9%80%9F%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素出现
    function waitForElement(selector, callback, interval = 100, timeout = 5000) {
        const startTime = Date.now();
        
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.error('元素未找到:', selector);
            }
        }, interval);
    }

    // 检查元素是否包含指定类名
    function hasClassName(element, className) {
        if (!element || !element.className) return false;
        if (typeof element.className === 'string') {
            return element.className.includes(className);
        }
        if (element.className instanceof SVGAnimatedString) {
            return element.className.baseVal.includes(className);
        }
        return false;
    }

    // 创建搜索按钮
    function createSearchButton() {
        const button = document.createElement('button');
        button.textContent = '🔍 搜索';
        button.className = 'btn btn-primary search-custom-btn';
        button.style.cssText = `
            margin-left: 8px;
            padding: 6px 16px;
            font-size: 14px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
        `;
        
        return button;
    }

    // 显示输入对话框
    function showInputDialog() {
        return new Promise((resolve) => {
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;

            // 创建对话框容器
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                min-width: 400px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            // 创建标题
            const title = document.createElement('h3');
            title.textContent = '🔍 输入搜索内容';
            title.style.margin = '0 0 20px 0';
            title.style.fontSize = '18px';
            title.style.color = '#333';
            title.style.fontWeight = '600';

            // 创建输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '请输入要搜索的内容...';
            input.style.cssText = `
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e1e4e8;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 20px;
                box-sizing: border-box;
                transition: border-color 0.2s;
            `;
            
            input.addEventListener('focus', () => {
                input.style.borderColor = '#007cba';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '#e1e4e8';
            });

            // 创建按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            `;

            // 创建取消按钮
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.style.cssText = `
                padding: 10px 20px;
                border: 2px solid #e1e4e8;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            `;
            
            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.backgroundColor = '#f6f8fa';
            });
            
            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.backgroundColor = 'white';
            });
            
            cancelButton.onclick = () => {
                document.body.removeChild(overlay);
                resolve(null);
            };

            // 创建确认按钮
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '确认搜索';
            confirmButton.style.cssText = `
                padding: 10px 20px;
                border: none;
                background: #007cba;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            `;
            
            confirmButton.addEventListener('mouseenter', () => {
                confirmButton.style.backgroundColor = '#005a8b';
            });
            
            confirmButton.addEventListener('mouseleave', () => {
                confirmButton.style.backgroundColor = '#007cba';
            });
            
            confirmButton.onclick = () => {
                const value = input.value.trim();
                document.body.removeChild(overlay);
                resolve(value);
            };

            // 组装对话框
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);
            dialog.appendChild(title);
            dialog.appendChild(input);
            dialog.appendChild(buttonContainer);
            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // 聚焦输入框
            input.focus();
            input.select();

            // 回车键确认
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    confirmButton.click();
                }
            });

            // ESC键取消
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    cancelButton.click();
                }
            });

            // 点击遮罩层关闭
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cancelButton.click();
                }
            });
        });
    }

    // 执行搜索
    async function performSearch() {
        const searchValue = await showInputDialog();
        if (!searchValue) return;

        const searchInput = document.querySelector('#header-search-input');
        if (!searchInput) {
            alert('搜索框未找到，请确保页面已完全加载');
            return;
        }

        console.log('开始搜索:', searchValue);

        // 1. 先让搜索框获得焦点
        searchInput.focus();
        
        // 2. 等待一小段时间确保焦点已设置
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 3. 填充搜索内容并触发事件
        searchInput.value = searchValue;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        // 4. 等待搜索建议出现
        setTimeout(() => {
            // 查找搜索建议项并点击第一个
            const searchOption = document.querySelector('.search-menu-assistant-item .search-link');
            if (searchOption) {
                console.log('找到搜索建议，点击执行搜索');
                searchOption.click();
                
                // 等待搜索结果加载
                setTimeout(() => {
                    // 查找第一个搜索结果
                    const firstResult = document.querySelector('.search-result-topic .search-link');
                    if (firstResult && firstResult.href) {
                        console.log('找到第一个搜索结果，准备跳转:', firstResult.href);
                        window.location.href = firstResult.href;
                    } else {
                        console.log('未找到搜索结果，尝试其他选择器');
                        // 尝试其他可能的选择器
                        const alternativeResult = document.querySelector('.item .search-link[href*="/t/"]');
                        if (alternativeResult && alternativeResult.href) {
                            console.log('使用替代选择器找到结果:', alternativeResult.href);
                            window.location.href = alternativeResult.href;
                        } else {
                            alert('搜索完成，但未找到可跳转的结果');
                            console.log('页面HTML结构:', document.querySelector('.results')?.innerHTML);
                        }
                    }
                }, 2000); // 等待2秒让搜索结果加载
            } else {
                console.log('未找到搜索建议，尝试直接提交');
                // 如果没有搜索建议，尝试直接按回车
                searchInput.dispatchEvent(new KeyboardEvent('keydown', { 
                    key: 'Enter', 
                    bubbles: true,
                    cancelable: true
                }));
                
                // 再次等待搜索结果
                setTimeout(() => {
                    const firstResult = document.querySelector('.search-result-topic .search-link');
                    if (firstResult && firstResult.href) {
                        window.location.href = firstResult.href;
                    } else {
                        alert('搜索执行完成，但未找到结果');
                    }
                }, 2000);
            }
        }, 500); // 等待500ms让搜索建议出现
    }

    // 添加搜索按钮到页面
    function addSearchButton() {
        // 找到搜索容器
        const searchContainer = document.querySelector('.search-menu');
        if (!searchContainer) {
            console.log('搜索容器未找到');
            return;
        }

        // 检查是否已经添加过按钮
        if (document.querySelector('.search-custom-btn')) {
            return;
        }

        // 找到放置按钮的位置（修改为 .floating-search-input-wrapper）
        const headerSearch = document.querySelector('.floating-search-input-wrapper');
        if (!headerSearch) {
            console.log('头部搜索区域未找到');
            return;
        }

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
        `;

        // 创建并添加搜索按钮
        const searchButton = createSearchButton();
        searchButton.addEventListener('click', performSearch);
        buttonContainer.appendChild(searchButton);

        // 将按钮添加到搜索区域
        headerSearch.appendChild(buttonContainer);

        console.log('快速搜索按钮已添加到搜索框外部');
    }

    // 主函数
    function init() {
        console.log('初始化快速搜索助手...');
        
        // 等待搜索容器加载
        waitForElement('.search-menu', () => {
            addSearchButton();
        });
    }

    // 监听页面变化，处理动态加载内容
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // 检查是否有搜索相关元素被添加
                const hasSearchElement = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType !== 1) return false; // 只检查元素节点
                    
                    // 检查节点本身是否有search相关类名
                    if (hasClassName(node, 'search')) {
                        return true;
                    }
                    
                    // 检查子节点是否有search相关元素
                    if (node.querySelector) {
                        const searchChild = node.querySelector('.search');
                        return searchChild !== null;
                    }
                    
                    return false;
                });
                
                if (hasSearchElement) {
                    setTimeout(() => {
                        addSearchButton();
                    }, 100);
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面可见性变化时重新初始化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(init, 1000);
        }
    });
})();
