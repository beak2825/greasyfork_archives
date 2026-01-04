// ==UserScript==
// @name         X一键屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在X用户资料页面添加直接屏蔽按钮，支持已屏蔽状态检测
// @author       DeepSeek
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549340/X%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/549340/X%E4%B8%80%E9%94%AE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        checkInterval: 1000,
        maxRetryCount: 3,
        retryDelay: 500
    };

    // 全局变量跟踪当前状态
    let isCurrentlyOnProfilePage = false;
    let observer = null;

    function init() {
        const isProfile = isProfilePage();
        const isOwnProfile = isOwnProfilePage();

        // 如果是自己的资料页面，不执行任何操作
        if (isOwnProfile) {
            if (isCurrentlyOnProfilePage) {
                console.log('检测到自己的资料页面，移除屏蔽按钮');
                removeBlockButton();
                isCurrentlyOnProfilePage = false;
            }
            return;
        }

        // 如果页面状态没有变化，不需要重新初始化
        if (isProfile === isCurrentlyOnProfilePage) {
            if (isProfile) {
                // 已经在资料页，确保按钮存在
                ensureBlockButton();
            }
            return;
        }

        // 更新状态
        isCurrentlyOnProfilePage = isProfile;

        if (isProfile) {
            console.log('检测到其他用户资料页面，初始化屏蔽按钮');
            addBlockButton();
        } else {
            console.log('不在用户资料页面，停止脚本操作');
            removeBlockButton();
        }
    }

    function isProfilePage() {
        const path = window.location.pathname;
        // 更精确的用户资料页面检测
        const isUserProfile = /^\/([^/]+)$/.test(path) &&
                             path !== '/' &&
                             !path.includes('home') &&
                             !path.includes('explore') &&
                             !path.includes('notifications') &&
                             !path.includes('messages') &&
                             !path.includes('compose');

        return isUserProfile;
    }

    function isOwnProfilePage() {
        if (!isProfilePage()) return false;

        // 方法1: 检查是否有编辑资料按钮（自己的页面才有）
        const editProfileSelectors = [
            '[data-testid="editProfileButton"]',
            '[aria-label="编辑资料"]',
            'a[href*="/settings/profile"]',
            'div[role="button"]:contains("编辑资料")'
        ];

        for (const selector of editProfileSelectors) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    console.log('检测到编辑资料按钮，确认是自己的页面');
                    return true;
                }
            } catch (e) {
                // 忽略选择器错误
            }
        }

        // 方法2: 检查是否有关注按钮（自己的页面没有关注按钮）
        const followButton = document.querySelector('[data-testid*="follow"]');
        if (!followButton) {
            console.log('未找到关注按钮，可能是自己的页面');

            // 进一步确认：检查是否有更多操作按钮
            const moreButton = document.querySelector('[data-testid="userActions"]');
            if (!moreButton) {
                console.log('确认是自己的资料页面（无关注和更多按钮）');
                return true;
            }
        }

        // 方法3: 检查URL路径是否包含已知的非用户页面
        const path = window.location.pathname;
        if (path.includes('/settings') || path.includes('/account')) {
            return true;
        }

        return false;
    }

    function ensureBlockButton() {
        if (!document.getElementById('x-block-btn')) {
            addBlockButton();
        }
    }

    function removeBlockButton() {
        const blockBtn = document.getElementById('x-block-btn');
        if (blockBtn) {
            blockBtn.remove();
            console.log('移除屏蔽按钮');
        }
    }

    // 添加缺失的 findActionButtons 函数
    function findActionButtons() {
        // 主要选择器：包含关注按钮的容器
        const mainSelector = 'div[data-testid="placementTracking"]';
        const actionContainer = document.querySelector(mainSelector);

        if (actionContainer) {
            console.log('找到操作按钮区域');
            return actionContainer;
        }

        // 备用选择器
        const backupSelectors = [
            'div[class*="profile"] > div:last-child > div:last-child',
            'main section > div:last-child > div:last-child'
        ];

        for (const selector of backupSelectors) {
            const element = document.querySelector(selector);
            if (element && element.querySelector('[data-testid*="follow"]')) {
                return element;
            }
        }

        console.log('未找到操作按钮区域');
        return null;
    }

    function addBlockButton() {
        if (document.getElementById('x-block-btn')) return;

        // 如果不是资料页面或者是自己的页面，不添加按钮
        if (!isProfilePage() || isOwnProfilePage()) {
            console.log('不在用户资料页面或是自己的页面，跳过添加按钮');
            return;
        }

        const actionButtons = findActionButtons();
        if (!actionButtons) {
            setTimeout(addBlockButton, config.checkInterval);
            return;
        }

        const blockBtn = createBlockButton();
        actionButtons.appendChild(blockBtn);
        console.log('屏蔽按钮已成功添加到操作区域');

        // 检查是否已屏蔽
        checkBlockStatus(blockBtn);
    }

    function createBlockButton() {
        const btn = document.createElement('div');
        btn.id = 'x-block-btn';
        btn.innerHTML = `
            <div role="button" tabindex="0" style="
                margin-left: 12px;
                min-width: 80px;
                padding: 0 16px;
                height: 36px;
                border: 1px solid rgb(83, 100, 113);
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                color: rgb(239, 243, 244);
                background-color: rgba(0, 0, 0, 0.9);
                cursor: pointer;
                transition: background-color 0.2s;
            ">
                屏蔽
            </div>
        `;

        // 先添加点击事件，checkBlockStatus 会决定是否移除
        btn.addEventListener('click', handleBlockClick);

        return btn;
    }

    function checkBlockStatus(blockBtn) {
        // 如果不是资料页面或者是自己的页面，不检查状态
        if (!isProfilePage() || isOwnProfilePage()) {
            return false;
        }

        console.log('检查屏蔽状态...');

        // 方法1: 检查关注按钮状态（已屏蔽的用户无法关注）
        const followButton = document.querySelector('[data-testid*="follow"]');
        if (followButton) {
            const isDisabled = followButton.disabled || followButton.getAttribute('aria-disabled') === 'true';
            const buttonText = (followButton.textContent || '').toLowerCase();

            console.log('关注按钮状态:', { isDisabled, buttonText });

            if (isDisabled || buttonText.includes('unblock') || buttonText.includes('取消屏蔽')) {
                setButtonBlocked(blockBtn);
                return true;
            }
        }

        // 方法2: 检查页面中的屏蔽状态提示
        const blockIndicators = [
            'span',
            'div',
            '[data-testid*="block"]'
        ];

        for (const selector of blockIndicators) {
            try {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const text = (element.textContent || element.innerText || '').toLowerCase();
                    if (text.includes('已屏蔽') || text.includes('blocked') ||
                        text.includes('unblock') || text.includes('取消屏蔽')) {
                        console.log('找到屏蔽指示器:', text);
                        setButtonBlocked(blockBtn);
                        return true;
                    }
                }
            } catch (e) {
                // 忽略选择器错误
            }
        }

        // 方法3: 检查更多菜单中的选项
        try {
            const moreMenuItems = document.querySelectorAll('[role="menuitem"]');
            for (const item of moreMenuItems) {
                const text = (item.textContent || item.innerText || '').toLowerCase();
                if (text.includes('取消屏蔽') || text.includes('unblock')) {
                    console.log('找到取消屏蔽菜单项:', text);
                    setButtonBlocked(blockBtn);
                    return true;
                }
            }
        } catch (e) {
            console.log('检查菜单项时出错:', e);
        }

        console.log('用户未被屏蔽，按钮保持可点击状态');
        return false;
    }

    function setButtonBlocked(blockBtn) {
        const innerDiv = blockBtn.querySelector('div');
        innerDiv.textContent = '已屏蔽';
        innerDiv.style.borderColor = 'rgb(103, 193, 103)';
        innerDiv.style.color = 'rgb(103, 193, 103)';
        innerDiv.style.cursor = 'default';
        innerDiv.style.opacity = '0.7';

        // 移除点击事件
        blockBtn.onclick = null;
        blockBtn.removeEventListener('click', handleBlockClick);
        console.log('用户已被屏蔽，按钮状态已更新');
    }

    async function handleBlockClick(event) {
        // 防止事件冒泡
        event.stopPropagation();

        // 如果不是资料页面或者是自己的页面，不执行操作
        if (!isProfilePage() || isOwnProfilePage()) {
            console.log('不在用户资料页面或是自己的页面，取消屏蔽操作');
            return;
        }

        const blockBtn = document.getElementById('x-block-btn');
        if (blockBtn.getAttribute('data-processing') === 'true') return;

        blockBtn.setAttribute('data-processing', 'true');
        updateButtonState(blockBtn, 'processing');

        try {
            await performBlockAction();

            // 屏蔽成功后更新按钮状态
            setButtonBlocked(blockBtn);

        } catch (error) {
            console.error('屏蔽操作失败:', error);
            updateButtonState(blockBtn, 'error');
            setTimeout(() => updateButtonState(blockBtn, 'normal'), 2000);
        } finally {
            blockBtn.removeAttribute('data-processing');
        }
    }

    async function performBlockAction() {
        console.log('开始执行屏蔽操作...');

        // 1. 点击更多按钮
        const moreBtn = findMoreButton();
        if (!moreBtn) throw new Error('找不到更多按钮');
        console.log('找到更多按钮，点击中...');
        moreBtn.click();
        await wait(1500);

        // 2. 查找屏蔽选项
        const blockOption = findBlockOption();
        if (!blockOption) throw new Error('找不到屏蔽选项');
        console.log('找到屏蔽选项，点击中...');
        blockOption.click();
        await wait(1500);

        // 3. 处理确认弹窗
        const confirmBtn = findConfirmButton();
        if (confirmBtn) {
            console.log('找到确认按钮，点击中...');
            confirmBtn.click();
            await wait(1000);
        } else {
            console.log('未找到确认按钮，可能不需要确认');
        }

        console.log('屏蔽操作完成');
    }

    function findMoreButton() {
        const moreButtonSelectors = [
            '[data-testid="userActions"]',
            '[aria-label="更多"]',
            'div[role="button"][aria-haspopup="menu"]',
            'svg[viewBox="0 0 24 24"]'
        ];

        for (const selector of moreButtonSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const button = element.closest('[role="button"]') || element;
                console.log('找到更多按钮:', button);
                return button;
            }
        }

        console.log('未找到更多按钮');
        return null;
    }

    function findBlockOption() {
        const blockOptionSelectors = [
            '[role="menuitem"][data-testid="block"]',
            'div[role="menuitem"]',
            'span',
            'button'
        ];

        for (const selector of blockOptionSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = (element.textContent || element.innerText || '').toLowerCase();
                if (text.includes('屏蔽') || text.includes('block')) {
                    console.log('找到屏蔽选项:', element, text);
                    return element.closest('[role="menuitem"]') || element;
                }
            }
        }

        console.log('未找到屏蔽选项');
        return null;
    }

    function findConfirmButton() {
        const confirmSelectors = [
            '[data-testid="confirmationSheetConfirm"]',
            'div[role="button"][data-testid*="confirm"]',
            'span',
            'button'
        ];

        for (const selector of confirmSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = (element.textContent || element.innerText || '').toLowerCase();
                if (text.includes('确认') || text.includes('confirm')) {
                    console.log('找到确认按钮:', element, text);
                    return element.closest('[role="button"]') || element;
                }
            }
        }

        console.log('未找到确认按钮');
        return null;
    }

    function updateButtonState(button, state) {
        const innerDiv = button.querySelector('div');
        switch (state) {
            case 'processing':
                innerDiv.textContent = '屏蔽中...';
                innerDiv.style.opacity = '0.7';
                break;
            case 'error':
                innerDiv.textContent = '失败';
                innerDiv.style.borderColor = 'rgb(193, 103, 103)';
                innerDiv.style.color = 'rgb(193, 103, 103)';
                break;
            default:
                innerDiv.textContent = '屏蔽';
                innerDiv.style.opacity = '1';
                innerDiv.style.borderColor = 'rgb(83, 100, 113)';
                innerDiv.style.color = 'rgb(239, 243, 244)';
        }
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化
    let initialized = false;
    function startObserver() {
        if (initialized) return;

        initialized = true;
        init();

        // 监听URL变化
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                init();
            }
        }, config.checkInterval);

        // 监听DOM变化，但只在资料页面时进行深度监听
        observer = new MutationObserver((mutations) => {
            if (isProfilePage() && !isOwnProfilePage()) {
                init();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();