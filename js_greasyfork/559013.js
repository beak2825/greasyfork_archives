// ==UserScript==
// @name         B站稍后再看页面优化
// @namespace    https://greasyfork.org/users/1362570
// @version      2.1
// @description  优化B站稍后再看适配移动端使用
// @license      MIT
// @author       QieSen
// @match        https://www.bilibili.com/list/watchlater*
// @match        https://www.bilibili.com/watchlater/list*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @resource     overrideCSS https://qiesen.rth1.xyz/bilibili-watchlater-override.css
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559013/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/559013/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // ====================== 移动端优化功能 ======================
    
	// 删除顶栏和底栏
	function removeBanner() {
		// 删除顶栏 (#biliMainHeader)
		const header = document.querySelector('#biliMainHeader');
		if (header) {
			header.remove();
		}
		// 删除底栏 (.footer.bili-footer)
		const footer = document.querySelector('.footer.bili-footer');
		if (footer) {
			footer.remove();
		}
	}
    
    // 添加视口meta标签
    function ensureViewportMeta() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1, maximum-scale=2, user-scalable=yes';
            document.head.appendChild(meta);
        }
    }
    
    // 修复标题行数
    function fixTitleLines() {
        const titles = document.querySelectorAll('.video-card__right .title');
        titles.forEach(title => {
            // 强制设置行数为3
            title.style.setProperty('-webkit-line-clamp', '3', 'important');
            title.style.setProperty('max-height', '63px', 'important');
            title.style.setProperty('display', '-webkit-box', 'important');
            title.style.setProperty('-webkit-box-orient', 'vertical', 'important');
            title.style.setProperty('overflow', 'hidden', 'important');
            title.style.setProperty('text-overflow', 'ellipsis', 'important');
        });
    }
    
    // 加载外部CSS
    function loadExternalCSS() {
        // 方法1: 使用GM_addElement添加link标签（推荐，支持缓存）
        const cssUrl = 'https://qiesen.rth1.xyz/bilibili-watchlater-override.css'
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        link.onload = function() {
            console.log('B站稍后再看覆盖CSS已加载');
            // CSS加载后立即修复标题
            setTimeout(fixTitleLines, 100);
        };
        link.onerror = function() {
            console.error('加载B站稍后再看覆盖CSS失败');
            // 如果外部CSS加载失败，可以尝试内联样式作为备用
            loadFallbackCSS();
        };
        document.head.appendChild(link);
    }
    
    // 备用CSS（如果外部CSS加载失败）
    function loadFallbackCSS() {
        const fallbackCSS = `
            #app { min-width: unset !important; width: 100% !important; }
            .watchlater-list-slim { max-width: 100% !important; }
            .video-card__right .title { 
                -webkit-line-clamp: 3 !important; 
                max-height: 63px !important;
            }
            @media (max-width: 768px) {
                .video-card--list { flex-direction: column !important; }
                .list-header-main { flex-direction: column !important; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = fallbackCSS;
        document.head.appendChild(style);
        console.log('已加载备用CSS样式');
        
        // 修复标题
        setTimeout(fixTitleLines, 100);
    }
    
    // 监听DOM变化，修复动态加载的内容
    function setupTitleMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldFixTitles = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldFixTitles = true;
                }
            });
            
            if (shouldFixTitles) {
                setTimeout(fixTitleLines, 300);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // 移动端优化初始化
    function initOverride() {
        ensureViewportMeta();
        loadExternalCSS();
        const titleObserver = setupTitleMutationObserver();
        
        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            setTimeout(fixTitleLines, 50);
        });
        
        console.log('B站稍后再看页面移动端优化已初始化');
        
        // 返回observer以便后续可能需要停止观察
        return titleObserver;
    }
    
    // ====================== 卡片删除按钮处理 ======================
    
    // 状态标记，避免重复执行
    let isProcessing = false;
    let lastButtonState = '';
    let buttonObserver = null;
    
    // 设置按钮变化观察器
    function setupButtonObserver() {
        // 查找按钮容器
        const buttonContainer = document.querySelector('.list-header-options');
        if (!buttonContainer) {
            // 如果容器不存在，等待一下再重试
            setTimeout(setupButtonObserver, 1000);
            return;
        }
        
        // 设置观察器，只观察特定属性的变化
        buttonObserver = new MutationObserver(function(mutations) {
            // 防止重复处理
            if (isProcessing) return;
            
            // 检查是否有按钮文本变化
            let shouldProcess = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    shouldProcess = true;
                    break;
                }
                
                if (mutation.type === 'characterData' &&
                    mutation.target.classList &&
                    mutation.target.classList.contains('btn-txt')) {
                    shouldProcess = true;
                    break;
                }
            }
            
            if (shouldProcess) {
                // 使用防抖，避免频繁触发
                clearTimeout(window._buttonCheckTimeout);
                window._buttonCheckTimeout = setTimeout(() => {
                    checkAndSetupButtons();
                }, 100);
            }
        });
        
        // 只观察子节点和文本内容的变化
        buttonObserver.observe(buttonContainer, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // 检查和设置按钮事件
    function checkAndSetupButtons() {
        if (isProcessing) return;
        
        const buttons = document.querySelectorAll('.list-header-options button.action-btn');
        if (buttons.length === 0) return;
        
        // 检查当前状态
        let currentState = '';
        buttons.forEach(button => {
            const span = button.querySelector('.btn-txt');
            if (span) {
                currentState += span.textContent.trim() + '|';
            }
        });
        
        // 如果状态没变化，不需要处理
        if (currentState === lastButtonState) return;
        
        lastButtonState = currentState;
        isProcessing = true;
        
        try {
            // 查找批量管理/退出管理按钮
            const batchButton = findBatchManagementButton();
            if (batchButton) {
                // 添加事件监听
                addButtonEvent(batchButton);
                
                // 根据当前按钮文本设置删除按钮的显示状态
                const span = batchButton.querySelector('.btn-txt');
                if (span) {
                    const isBatchMode = span.textContent.trim() === '退出管理';
                    updateDeleteButtons(isBatchMode);
                }
            }
        } catch (error) {
            console.error('批量管理脚本出错:', error);
        } finally {
            isProcessing = false;
        }
    }
    
    // 查找批量管理按钮
    function findBatchManagementButton() {
        const buttons = document.querySelectorAll('.list-header-options button.action-btn');
        
        for (const button of buttons) {
            const span = button.querySelector('.btn-txt');
            if (span) {
                const text = span.textContent.trim();
                if (text === '批量管理' || text === '退出管理') {
                    return button;
                }
            }
        }
        
        return null;
    }
    
    // 添加按钮事件
    function addButtonEvent(button) {
        // 检查是否已经添加过事件监听器
        if (button.hasAttribute('data-custom-event-added')) {
            return;
        }
        
        // 标记已添加事件
        button.setAttribute('data-custom-event-added', 'true');
        
        // 添加点击事件监听器
        button.addEventListener('click', function(e) {
            // 设置一个延迟来检查按钮状态变化
            setTimeout(() => {
                const span = this.querySelector('.btn-txt');
                if (span) {
                    const isBatchMode = span.textContent.trim() === '退出管理';
                    updateDeleteButtons(isBatchMode);
                }
            }, 300);
        });
    }
    
    // 更新删除按钮的显示状态
    function updateDeleteButtons(show) {
        const deleteButtons = document.querySelectorAll('.video-card__delete');
        
        deleteButtons.forEach(btn => {
            if (show) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
        
        console.log(`批量管理: ${show ? '显示' : '隐藏'}删除按钮 (找到 ${deleteButtons.length} 个)`);
    }
    
    // 按钮事件绑定初始化
    function initButtonListener() {
        console.log('绑定按钮点击事件');
        
        // 使用更精确的选择器来监听按钮变化
        setupButtonObserver();
        
        // 初始检查一次
        setTimeout(checkAndSetupButtons, 1000);
    }
    
    // ====================== 主初始化函数 ======================
    
    // 主初始化函数
    function init() {
        console.log('B站稍后再看页面优化脚本开始初始化');
        
        // 删除顶栏和底栏
        removeBanner();
        
        // 初始化移动端优化功能
        const titleObserver = initOverride();
        
        // 初始化按钮事件绑定
        setTimeout(initButtonListener, 500);
        
        // 监听窗口大小变化
        window.addEventListener('resize', function() {
            setTimeout(fixTitleLines, 50);
        });
        
        console.log('B站稍后再看页面优化脚本初始化完成');
        
        // 提供一个手动刷新按钮状态的方法（用于调试）
        window.refreshBatchManagement = function() {
            checkAndSetupButtons();
        };
        
        // 返回观察器以便后续可能需要停止观察
        return {
            titleObserver: titleObserver,
            buttonObserver: buttonObserver
        };
    }
    
    // 等待页面基本加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
