// ==UserScript==
// @name         linux.do Obsidian Callouts 回复（支持 None）
// @namespace    http://52shell.ltd/
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @version      1.3.1
// @author       Shell
// @description  自动为 Discourse 回复插入 Obsidian Callout，支持 None / 原生回复
// @downloadURL https://update.greasyfork.org/scripts/550344/linuxdo%20Obsidian%20Callouts%20%E5%9B%9E%E5%A4%8D%EF%BC%88%E6%94%AF%E6%8C%81%20None%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550344/linuxdo%20Obsidian%20Callouts%20%E5%9B%9E%E5%A4%8D%EF%BC%88%E6%94%AF%E6%8C%81%20None%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***********************
     * Callout 类型定义
     ***********************/
    const calloutTypes = {
        none: {
            color: '#6c757d',
            icon: '<line x1="4" y1="12" x2="20" y2="12"/>',
            label: 'None'
        },
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
            icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>',
            label: 'Note'
        },
        warning: {
            color: '#ffc107',
            icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3z"/>',
            label: 'Warning'
        },
        danger: {
            color: '#dc3545',
            icon: '<circle cx="12" cy="12" r="10"/>',
            label: 'Danger'
        },
        info: {
            color: '#6f42c1',
            icon: '<circle cx="12" cy="12" r="10"/>',
            label: 'Info'
        },
        question: {
            color: '#f0ad4e',
            icon: '<circle cx="12" cy="12" r="10"/>',
            label: 'Question'
        },
        failure: {
            color: '#800000',
            icon: '<circle cx="12" cy="12" r="10"/>',
            label: 'Failure'
        },
        bug: {
            color: '#e55353',
            icon: '<circle cx="12" cy="12" r="10"/>',
            label: 'Bug'
        }
    };

    const DEFAULT_TYPE_KEY = 'obsidianCalloutDefaultType';
    const INSERT_FLAG = 'data-obsidian-callout-inserted';

    /***********************
     * 默认类型读写
     ***********************/
    function getDefaultCalloutType() {
        const saved = localStorage.getItem(DEFAULT_TYPE_KEY);
        return saved && calloutTypes[saved] ? saved : 'none';
    }

    function setDefaultCalloutType(type) {
        localStorage.setItem(DEFAULT_TYPE_KEY, type);
    }

    /***********************
     * 插入 Callout（核心）
     ***********************/
    function tryInsertCallout(replyBox) {
        if (!replyBox) return;
        if (replyBox.hasAttribute(INSERT_FLAG)) return;

        const type = getDefaultCalloutType();

        // None：什么都不加，只打标记
        if (type === 'none') {
            replyBox.setAttribute(INSERT_FLAG, 'true');
            console.log('Callout 类型为 None，未插入内容');
            return;
        }

        const content = `>[!${type}] `;
        const start = replyBox.selectionStart ?? replyBox.value.length;
        const end = replyBox.selectionEnd ?? replyBox.value.length;

        replyBox.value =
            replyBox.value.slice(0, start) +
            content +
            replyBox.value.slice(end);

        const cursor = start + content.length;
        replyBox.setSelectionRange(cursor, cursor);

        replyBox.dispatchEvent(new Event('input', { bubbles: true }));
        replyBox.setAttribute(INSERT_FLAG, 'true');

        console.log('已插入 Obsidian Callout:', type);
    }

    /***********************
     * 监听原生「回复」
     ***********************/
    function hookNativeReplyButton() {
        document.addEventListener('click', (e) => {
            const label = e.target.closest('.d-button-label');
            if (!label || label.textContent.trim() !== '回复') return;

            const timer = setInterval(() => {
                const box = document.querySelector('.d-editor-input');
                if (box) {
                    clearInterval(timer);
                    tryInsertCallout(box);
                }
            }, 100);

            setTimeout(() => clearInterval(timer), 3000);
        }, true);
    }

    /***********************
     * 更新按钮样式
     ***********************/
    function updateButtonStyle(button, type) {
        const cfg = calloutTypes[type];
        button.style.backgroundColor = cfg.color;
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                ${cfg.icon}
            </svg>
            <span>${cfg.label}</span>
        `;
    }

    /***********************
     * 右键菜单
     ***********************/
    function createContextMenu(button, currentType) {
        document.querySelector('.obsidian-callout-menu')?.remove();

        const menu = document.createElement('div');
        menu.className = 'obsidian-callout-menu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,.15);
            z-index: 10000;
            overflow: hidden;
        `;

        const rect = button.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.bottom + 6 + 'px';

        Object.entries(calloutTypes).forEach(([type, cfg]) => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 10px 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                ${type === currentType ? 'background:#f0f0f0;font-weight:bold;' : ''}
            `;
            item.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${cfg.color}" stroke-width="2">
                    ${cfg.icon}
                </svg>
                <span>${cfg.label}</span>
            `;
            item.onclick = () => {
                setDefaultCalloutType(type);
                updateButtonStyle(button, type);
                menu.remove();
            };
            menu.appendChild(item);
        });

        document.body.appendChild(menu);
        document.addEventListener('click', () => menu.remove(), { once: true });
    }

    /***********************
     * 插入按钮
     ***********************/
    function insertCalloutButton() {
        const footer = document.querySelector('.timeline-footer-controls');
        if (!footer || footer.querySelector('.obsidian-callout-button')) return;

        const btn = document.createElement('button');
        btn.className = 'btn obsidian-callout-button';
        btn.style.cssText = `
            margin-top:10px;
            border-radius:24px;
            padding:0 20px;
            height:40px;
            display:flex;
            align-items:center;
            gap:8px;
            color:white;
            font-weight:bold;
            cursor:pointer;
        `;

        updateButtonStyle(btn, getDefaultCalloutType());

        btn.onclick = () => {
            const trigger = document.querySelector('button[title="开始撰写此话题的回复"]');
            trigger?.click();

            const timer = setInterval(() => {
                const box = document.querySelector('.d-editor-input');
                if (box) {
                    clearInterval(timer);
                    tryInsertCallout(box);
                    box.focus();
                }
            }, 100);

            setTimeout(() => clearInterval(timer), 3000);
        };

        btn.oncontextmenu = (e) => {
            e.preventDefault();
            createContextMenu(btn, getDefaultCalloutType());
        };

        footer.appendChild(btn);
    }

    /***********************
     * 初始化
     ***********************/
    insertCalloutButton();
    hookNativeReplyButton();

    const observer = new MutationObserver(insertCalloutButton);
    observer.observe(document.body, { childList: true, subtree: true });

})();
