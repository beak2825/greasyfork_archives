// ==UserScript==
// @name        linux.do Obsidian Callouts回复
// @namespace   http://52shell.ltd/
// @match       https://linux.do/*
// @grant       none
// @license     MIT
// @version     1.2.1
// @author      Shell
// @description 2025-9-28 17:39:58
// @downloadURL https://update.greasyfork.org/scripts/550344/linuxdo%20Obsidian%20Callouts%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/550344/linuxdo%20Obsidian%20Callouts%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义可用的 callout 类型
    // 在 calloutTypes 里新增
const calloutTypes = {
    success: {
        color: '#28a745',
        icon: '<path d="M5 12l5 5 10-10"/>',
        label: 'Success'
    },
    tip: {
        color: '#17a2b8',
        icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
        label: 'Tip'
    },
    note: {
        color: '#007bff',
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
        label: 'Note'
    },
    warning: {
        color: '#ffc107',
        icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
        label: 'Warning'
    },
    danger: {
        color: '#dc3545',
        icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        label: 'Danger'
    },
    info: {
        color: '#6f42c1',
        icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
        label: 'Info'
    },
    question: {
        color: '#f0ad4e',
        icon: '<circle cx="12" cy="12" r="10"/><text x="12" y="16" font-size="12" text-anchor="middle" stroke="white" stroke-width="0.5">?</text>',
        label: 'Question'
    },
    failure: {
        color: '#800000',
        icon: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
        label: 'Failure'
    },
    bug: {
        color: '#e55353',
        icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
        label: 'Bug'
    }
};


    function getDefaultCalloutType() {
        const saved = localStorage.getItem('obsidianCalloutDefaultType');
        return saved && calloutTypes[saved] ? saved : 'success';
    }

    function setDefaultCalloutType(type) {
        localStorage.setItem('obsidianCalloutDefaultType', type);
    }

    // 创建右键菜单
    function createContextMenu(button, currentType) {
        const existingMenu = document.querySelector('.obsidian-callout-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'obsidian-callout-menu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            min-width: 150px;
            display: none;
        `;

        const rect = button.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';

        Object.entries(calloutTypes).forEach(([type, config]) => {
            const menuItem = document.createElement('div');
            menuItem.style.cssText = `
                padding: 10px 15px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            `;
            if (type === currentType) {
                menuItem.style.backgroundColor = '#f0f0f0';
                menuItem.style.fontWeight = 'bold';
            }
            menuItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${config.color}" stroke-width="2">${config.icon}</svg>
                <span>${config.label}</span>
            `;
            menuItem.addEventListener('mouseenter', () => menuItem.style.backgroundColor = '#f0f0f0');
            menuItem.addEventListener('mouseleave', () => {
                if (type !== currentType) menuItem.style.backgroundColor = 'transparent';
            });
            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                setDefaultCalloutType(type);
                updateButtonStyle(button, type);
                menu.remove();
            });
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);
        setTimeout(() => menu.style.display = 'block', 10);

        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        });
    }

    function updateButtonStyle(button, type) {
        const config = calloutTypes[type];
        button.style.backgroundColor = config.color;
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">${config.icon}</svg>
            <span>${config.label}</span>
        `;
    }

    // 插入按钮逻辑
    function insertCalloutButton() {
        const footerControls = document.querySelector('.timeline-footer-controls');
        if (!footerControls) return;
        if (footerControls.querySelector('.obsidian-callout-button')) return;

        const newButtonContainer = document.createElement('div');
        newButtonContainer.style.marginTop = '10px';
        newButtonContainer.style.width = '100%';

        const calloutBtn = document.createElement('button');
        calloutBtn.className = 'btn no-text btn-icon emoji obsidian-callout-button';

        const defaultType = getDefaultCalloutType();
        const defaultConfig = calloutTypes[defaultType];
        calloutBtn.style.cssText = `
            background-color: ${defaultConfig.color};
            color: white;
            border-radius: 25px;
            padding: 0 20px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
        `;
        calloutBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">${defaultConfig.icon}</svg>
            <span>${defaultConfig.label}</span>
        `;

        calloutBtn.addEventListener('mouseenter', () => {
            calloutBtn.style.transform = 'scale(1.05)';
            calloutBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });
        calloutBtn.addEventListener('mouseleave', () => {
            calloutBtn.style.transform = 'scale(1)';
            calloutBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });

        // 左键点击插入
        calloutBtn.addEventListener('click', () => {
            const currentType = getDefaultCalloutType();
            const replyTriggerBtn = document.querySelector('button[title="开始撰写此话题的回复"]');
            if (replyTriggerBtn) replyTriggerBtn.click();
            else return console.error('未找到回复触发按钮');

            const checkReplyBox = setInterval(() => {
                const replyBox = document.querySelector('.d-editor-input');
                if (replyBox) {
                    clearInterval(checkReplyBox);
                    const start = replyBox.selectionStart;
                    const end = replyBox.selectionEnd;
                    const contentToInsert = `>[!${currentType}] `;
                    replyBox.value = replyBox.value.slice(0, start) + contentToInsert + replyBox.value.slice(end);
                    const newCursorPos = start + contentToInsert.length;
                    replyBox.setSelectionRange(newCursorPos, newCursorPos);
                    replyBox.dispatchEvent(new Event('input', { bubbles: true }));
                    replyBox.focus();
                }
            }, 100);

            setTimeout(() => {
                clearInterval(checkReplyBox);
            }, 3000);
        });

        // 右键菜单
        calloutBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const currentType = getDefaultCalloutType();
            createContextMenu(calloutBtn, currentType);
        });

        newButtonContainer.appendChild(calloutBtn);
        footerControls.appendChild(newButtonContainer);
    }

    // 初始执行一次
    insertCalloutButton();

    // 监听 DOM 动态变化
    const observer = new MutationObserver(() => insertCalloutButton());
    observer.observe(document.body, { childList: true, subtree: true });

})();
