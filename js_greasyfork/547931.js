// ==UserScript==
// @name         小红书首页简洁模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在小红书首页添加模式切换功能，支持原生模式和简洁模式切换。简洁模式在首页移除其余元素仅显示搜索框。
// @author       kamaboko
// @match        https://www.xiaohongshu.com/explore*
// @match        https://www.xiaohongshu.com/explore/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547931/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/547931/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%A6%96%E9%A1%B5%E7%AE%80%E6%B4%81%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // 创建模式切换按钮
    function createModeToggleButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #fff;
            border: 2px solid #ff2442;
            border-radius: 8px;
            padding: 8px 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const button = document.createElement('button');
        button.textContent = '原生模式';
        button.style.cssText = `
            background: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#e61e3c';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#ff2442';
        });

        buttonContainer.appendChild(button);
        document.body.appendChild(buttonContainer);

        return { button, container: buttonContainer };
    }

    // 获取需要隐藏的元素选择器
    function getElementsToHide() {
        return [
            // 导航栏相关
            'nav',
            '.nav',
            '.navbar',
            '.header',
            '.top-bar',
            // 侧边栏
            '.side-bar',
            '.side-nav',
            '.dropdown-nav',
            '.left-panel',
            // 推荐内容区域
            '.recommend',
            '.feed',
            '.content-feed',
            '.explore-feed',
            // 其他可能的内容区域
            '.main-content:not(.search-container)',
            '.content-area:not(.search-container)',
            // 底部
            '.footer',
            '.bottom-nav'
        ];
    }

    // 隐藏/显示元素
    function toggleElements(hide, elementsToHide) {
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (hide) {
                    element.style.display = 'none';
                } else {
                    element.style.display = '';
                }
            });
        });
    }

    // 查找并保留搜索框
    function preserveSearchBox() {
        // 为mask-paper类添加样式，让它在屏幕中间显示
        const maskPaperElements = document.querySelectorAll('.mask-paper');
        maskPaperElements.forEach(element => {
            element.style.cssText = `
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 9999 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 10px !important;
                width: auto !important;
                height: auto !important;
            `;
        });

        // 为logo图标添加样式，让它显示在上方
        const logoElements = document.querySelectorAll('.header-logo');
        logoElements.forEach(element => {
            element.style.cssText = `
                width: 120px !important;
                height: auto !important;
                pointer-events: none !important;
                order: -1 !important;
            `;
        });

        // 为搜索框容器添加样式，确保它在下方且居中
        const inputBoxElements = document.querySelectorAll('.input-box');
        inputBoxElements.forEach(element => {
            element.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: auto !important;
                height: auto !important;
                order: 1 !important;
                position: relative !important;
                min-height: 50px !important;
            `;
        });

        // 为搜索框添加样式
        const searchInputElements = document.querySelectorAll('.search-input');
        searchInputElements.forEach(element => {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.style.cssText = `
                    width: 500px !important;
                    height: 50px !important;
                    border-radius: 25px !important;
                    padding: 0 20px !important;
                    outline: none !important;
                `;
            }
        });

        // 为搜索按钮添加样式，确保它在搜索框中且生效
        const inputButtonElements = document.querySelectorAll('.input-button');
        inputButtonElements.forEach(element => {
            element.style.cssText = `
                position: absolute !important;
                right: 10px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 10000 !important;
                pointer-events: auto !important;
                cursor: pointer !important;
            `;
        });

        // 修复下拉菜单的位置，确保它在搜索框下方显示且保持原样
        const dropdownElements = document.querySelectorAll('[class*="sug-pad"], [class*="suggestion"], [class*="autocomplete"]');
        dropdownElements.forEach(element => {
            element.style.cssText = `
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 10001 !important;
                transform: none !important;
            `;
        });

        // 特别处理sug-pad sug-container-wrapper类的下拉菜单
        const sugPadElements = document.querySelectorAll('.sug-container-wrapper.sug-pad');
        sugPadElements.forEach(element => {
            element.style.cssText = `
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                width: 100% !important;
                z-index: 10001 !important;
                transform: none !important;
                margin-top: 5px !important;
            `;
        });

        // 创建MutationObserver来监听下拉菜单的动态创建
        const dropdownObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否是下拉菜单
                            if (node.classList && (node.classList.contains('sug-pad') || node.classList.contains('sug-container-wrapper'))) {
                                applyDropdownStyles(node);
                            }
                            // 检查新添加元素的子元素
                            const dropdowns = node.querySelectorAll('[class*="sug-pad"], [class*="sug-container-wrapper"]');
                            dropdowns.forEach(dropdown => applyDropdownStyles(dropdown));
                        }
                    });
                }
            });
        });

        // 应用下拉菜单样式的函数
        function applyDropdownStyles(element) {
            element.style.setProperty('position', 'absolute', 'important');
            element.style.setProperty('top', '100%', 'important');
            element.style.setProperty('left', '0', 'important');
            element.style.setProperty('width', '100%', 'important');
            element.style.setProperty('z-index', '10001', 'important');
            element.style.setProperty('transform', 'none', 'important');
            element.style.setProperty('margin-top', '5px', 'important');
        }

        // 开始监听DOM变化
        dropdownObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 将observer保存到全局，以便在恢复时停止监听
        window.xiaohongshuDropdownObserver = dropdownObserver;
    }

    // 恢复搜索框原始样式的函数
    function restoreSearchBoxOriginalStyle() {
        // 恢复mask-paper的原始样式
        const maskPaperElements = document.querySelectorAll('.mask-paper');
        maskPaperElements.forEach(element => {
            element.style.cssText = '';
        });

        // 恢复logo的原始样式
        const logoElements = document.querySelectorAll('.header-logo');
        logoElements.forEach(element => {
            element.style.cssText = '';
        });

        // 恢复搜索框的原始样式
        const searchInputElements = document.querySelectorAll('.search-input');
        searchInputElements.forEach(element => {
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.style.cssText = '';
            }
        });

        // 恢复input-box的原始样式
        const inputBoxElements = document.querySelectorAll('.input-box');
        inputBoxElements.forEach(element => {
            element.style.cssText = '';
        });

        // 恢复input-button的原始样式
        const inputButtonElements = document.querySelectorAll('.input-button');
        inputButtonElements.forEach(element => {
            element.style.cssText = '';
        });

        // 恢复下拉菜单的原始样式
        const dropdownElements = document.querySelectorAll('[class*="sug-pad"], [class*="suggestion"], [class*="autocomplete"]');
        dropdownElements.forEach(element => {
            element.style.cssText = '';
        });

        // 特别恢复sug-pad sug-container-wrapper类的下拉菜单
        const sugPadElements = document.querySelectorAll('.sug-container-wrapper.sug-pad');
        sugPadElements.forEach(element => {
            element.style.cssText = '';
        });

        // 停止下拉菜单的MutationObserver监听
        if (window.xiaohongshuDropdownObserver) {
            window.xiaohongshuDropdownObserver.disconnect();
            window.xiaohongshuDropdownObserver = null;
        }
    }

    // 主函数
    async function init() {
        try {
            // 等待页面主要内容加载
            await waitForElement('body');

            // 创建模式切换按钮
            const { button, container } = createModeToggleButton();

            let isNativeMode = true;
            const elementsToHide = getElementsToHide();

            // 检查当前URL，如果不是explore页面，自动恢复到原生模式
            function checkAndRestoreMode() {
                const currentUrl = window.location.href;
                if (!currentUrl.includes('/explore')) {
                    // 不在explore页面，自动恢复到原生模式
                    isNativeMode = true;
                    button.textContent = '原生模式';
                    button.style.background = '#ff2442';
                    toggleElements(false, elementsToHide);

                    // 恢复搜索框原始位置
                    const searchElements = document.querySelectorAll('input[type="search"], input[placeholder*="搜索"], .search-input');
                    searchElements.forEach(element => {
                        const container = element.closest('.search-container') || element.closest('form') || element.parentElement;
                        if (container) {
                            container.style.cssText = '';
                        }
                    });

                    // 恢复input-box的原始位置
                    const inputBoxElements = document.querySelectorAll('.input-box');
                    inputBoxElements.forEach(element => {
                        element.style.cssText = '';
                    });

                    // 恢复搜索框、logo等的原始样式
                    restoreSearchBoxOriginalStyle();
                } else {
                    // 在explore页面，检查是否是分享链接
                    const urlParams = new URLSearchParams(window.location.search);
                    const isShareLink = urlParams.has('share_from_user_hidden') ||
                                       urlParams.has('share_id') ||
                                       urlParams.has('xsec_source') ||
                                       urlParams.has('type') ||
                                       urlParams.has('author_share') ||
                                       urlParams.has('xhsshare');

                    if (isShareLink) {
                        // 分享链接保持原生模式
                        isNativeMode = true;
                        button.textContent = '原生模式';
                        button.style.background = '#ff2442';
                        toggleElements(false, elementsToHide);
                        restoreSearchBoxOriginalStyle();
                        localStorage.setItem('xiaohongshuMode', 'original');
                    } else {
                        // 普通explore页面，检查用户偏好设置
                        const userPreference = localStorage.getItem('xiaohongshuMode');
                        if (userPreference === 'minimal' || userPreference === null) {
                            // 默认使用简洁模式，或者用户之前选择过简洁模式
                            isNativeMode = false;
                            button.textContent = '简洁模式';
                            button.style.background = '#28a745';
                            toggleElements(true, elementsToHide);
                            preserveSearchBox();
                            localStorage.setItem('xiaohongshuMode', 'minimal');
                        }
                    }
                }
            }

            // 添加点击事件
            button.addEventListener('click', () => {
                // 检查是否在explore页面
                if (!window.location.href.includes('/explore')) {
                    alert('此功能仅在首页可用');
                    return;
                }

                // 检查是否是分享链接
                const urlParams = new URLSearchParams(window.location.search);
                const isShareLink = urlParams.has('share_from_user_hidden') ||
                                   urlParams.has('share_id') ||
                                   urlParams.has('xsec_source') ||
                                   urlParams.has('type') ||
                                   urlParams.has('author_share') ||
                                   urlParams.has('xhsshare');

                if (isShareLink) {
                    alert('分享链接页面不支持模式切换，将保持原生模式');
                    return;
                }

                isNativeMode = !isNativeMode;

                if (isNativeMode) {
                    button.textContent = '原生模式';
                    button.style.background = '#ff2442';
                    toggleElements(false, elementsToHide);
                    // 恢复搜索框原始位置
                    const searchElements = document.querySelectorAll('input[type="search"], input[placeholder*="搜索"], .search-input');
                    searchElements.forEach(element => {
                        const container = element.closest('.search-container') || element.closest('form') || element.parentElement;
                        if (container) {
                            container.style.cssText = '';
                        }
                    });

                    // 恢复input-box的原始位置
                    const inputBoxElements = document.querySelectorAll('.input-box');
                    inputBoxElements.forEach(element => {
                        element.style.cssText = '';
                    });

                    // 恢复搜索框、logo等的原始样式
                    restoreSearchBoxOriginalStyle();

                    // 保存用户偏好
                    localStorage.setItem('xiaohongshuMode', 'original');
                } else {
                    button.textContent = '简洁模式';
                    button.style.background = '#28a745';
                    toggleElements(true, elementsToHide);
                    preserveSearchBox();

                    // 保存用户偏好
                    localStorage.setItem('xiaohongshuMode', 'minimal');
                }
            });

            // 监听URL变化
            let currentUrl = window.location.href;
            const urlObserver = new MutationObserver(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    checkAndRestoreMode();
                }
            });

            // 监听页面内容变化（包括pushState等）
            urlObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 监听popstate事件（浏览器前进后退）
            window.addEventListener('popstate', checkAndRestoreMode);

            // 重写pushState和replaceState方法以监听URL变化
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(...args) {
                originalPushState.apply(this, args);
                setTimeout(checkAndRestoreMode, 100);
            };

            history.replaceState = function(...args) {
                originalReplaceState.apply(this, args);
                setTimeout(checkAndRestoreMode, 100);
            };

            // 初始化时检查并应用模式
            checkAndRestoreMode();
        } catch (error) {
            console.error('加载失败:', error);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
