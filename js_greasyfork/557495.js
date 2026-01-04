// ==UserScript==
// @name         句乐部 - 增强学习助手
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  禁止下一题 + 禁止右方向键 + 输入时自动隐藏答案（带控制开关，Ctrl+Shift+U 显示/隐藏面板）
// @author       SHANHH
// @match        https://julebu.co/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557495/%E5%8F%A5%E4%B9%90%E9%83%A8%20-%20%E5%A2%9E%E5%BC%BA%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557495/%E5%8F%A5%E4%B9%90%E9%83%A8%20-%20%E5%A2%9E%E5%BC%BA%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置项（从 localStorage 读取，默认开启）==========
    let disableNextEnabled = localStorage.getItem('julebu_disableNext') !== 'false';
    let autoHideAnswerEnabled = localStorage.getItem('julebu_autoHideAnswer') !== 'false';

    // 控制面板引用
    let controlPanel = null;

    // ========== 功能1：删除下一题按钮 + 禁止右方向键 ==========
    const removeNextButton = () => {
        if (!disableNextEnabled) return;
        const icon = document.querySelector('[class*="caret-right"]');
        if (icon) {
            const btn = icon.closest('button') || icon.closest('div.h-12');
            if (btn) btn.remove();
        }
    };

    // 禁止右方向键
    document.addEventListener('keydown', (e) => {
        if (disableNextEnabled && e.key === 'ArrowRight') {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    }, true);

    removeNextButton();
    new MutationObserver(removeNextButton).observe(document.body, { childList: true, subtree: true });

    // ========== 功能2：输入时自动隐藏答案 ==========
    document.addEventListener('keydown', (e) => {
        if (!autoHideAnswerEnabled) return;
        // 忽略 Ctrl、Alt、Shift、Meta 等修饰键组合
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        // 只响应实际字符输入和删除键
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
            // 查找"隐藏答案"按钮
            const hideButton = Array.from(document.querySelectorAll('button')).find(
                btn => btn.textContent.trim() === '隐藏答案'
            );
            if (hideButton) {
                hideButton.click();
            }
        }
    });

    // ========== 快捷键 Ctrl+Shift+U 显示/隐藏控制面板 ==========
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
            e.preventDefault();
            if (controlPanel) {
                const isVisible = controlPanel.style.display !== 'none';
                controlPanel.style.display = isVisible ? 'none' : 'flex';
            }
        }
    });

    // ========== 创建控制面板 ==========
    const createControlPanel = () => {
        // 控制面板容器
        const panel = document.createElement('div');
        panel.id = 'julebu-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 99999;
            display: none;
            flex-direction: column;
            gap: 8px;
            background: rgba(30, 30, 30, 0.9);
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: opacity 0.3s ease;
        `;

        // 标题
        const title = document.createElement('div');
        title.textContent = '🎯 学习助手';
        title.style.cssText = `
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 4px;
            text-align: center;
        `;
        panel.appendChild(title);

        // 快捷键提示
        const hint = document.createElement('div');
        hint.textContent = '按 Ctrl+Shift+U 隐藏';
        hint.style.cssText = `
            color: #888;
            font-size: 11px;
            text-align: center;
            margin-bottom: 4px;
        `;
        panel.appendChild(hint);

        // 创建开关按钮的通用函数
        const createToggle = (label, isEnabled, onToggle) => {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            `;

            const labelEl = document.createElement('span');
            labelEl.textContent = label;
            labelEl.style.cssText = `color: #ccc; white-space: nowrap;`;

            const toggle = document.createElement('div');
            toggle.style.cssText = `
                width: 44px;
                height: 24px;
                border-radius: 12px;
                cursor: pointer;
                position: relative;
                transition: background 0.3s ease;
                background: ${isEnabled ? '#8b5cf6' : '#4b5563'};
            `;

            const knob = document.createElement('div');
            knob.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                position: absolute;
                top: 2px;
                transition: left 0.3s ease;
                left: ${isEnabled ? '22px' : '2px'};
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;

            toggle.appendChild(knob);

            let enabled = isEnabled;
            toggle.addEventListener('click', () => {
                enabled = !enabled;
                toggle.style.background = enabled ? '#8b5cf6' : '#4b5563';
                knob.style.left = enabled ? '22px' : '2px';
                onToggle(enabled);
            });

            container.appendChild(labelEl);
            container.appendChild(toggle);
            return container;
        };

        // 开关1：禁止下一题
        const toggle1 = createToggle('禁止下一题', disableNextEnabled, (enabled) => {
            disableNextEnabled = enabled;
            localStorage.setItem('julebu_disableNext', enabled);
            if (enabled) removeNextButton();
        });
        panel.appendChild(toggle1);

        // 开关2：自动隐藏答案
        const toggle2 = createToggle('输入隐藏答案', autoHideAnswerEnabled, (enabled) => {
            autoHideAnswerEnabled = enabled;
            localStorage.setItem('julebu_autoHideAnswer', enabled);
        });
        panel.appendChild(toggle2);

        document.body.appendChild(panel);

        // 保存面板引用
        controlPanel = panel;
    };

    // 页面加载完成后创建控制面板
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }

})();