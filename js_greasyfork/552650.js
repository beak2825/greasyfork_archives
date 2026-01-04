// ==UserScript==
// @name         按钮分身
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  指定页面上的一个按钮并创建其分身（可拖动位置）
// @author       damu
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552650/%E6%8C%89%E9%92%AE%E5%88%86%E8%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/552650/%E6%8C%89%E9%92%AE%E5%88%86%E8%BA%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ------------------------------
     * 常量定义
     * ------------------------------ */
    const STORAGE_KEYS = {
        selector: 'saved_button_selector',
        text: 'saved_button_text',
        value: 'saved_button_value',
        position: 'cloned_button_position',
    };

    let clonedButton = null;
    let isSelecting = false;
    let highlightTarget = null;

    /* ------------------------------
     * 工具函数
     * ------------------------------ */

    function generateSelector(el) {
        if (!el) return '';
        const path = [];

        while (el && el.nodeType === Node.ELEMENT_NODE) {
            const currentEl = el;
            let part = currentEl.nodeName.toLowerCase();

            if (currentEl.id) {
                part += `#${currentEl.id}`;
                path.unshift(part);
                break;
            }

            if (currentEl.className) {
                const cls = currentEl.className.trim().split(/\s+/).filter(Boolean);
                if (cls.length) part += '.' + cls.join('.');
            }

            ['name', 'type', 'role', 'aria-label'].forEach(attr => {
                const val = currentEl.getAttribute?.(attr);
                if (val) part += `[${attr}="${val}"]`;
            });

            path.unshift(part);
            el = currentEl.parentElement;
        }

        return path.join(' > ');
    }


    function getButtonText(el) {
        if (!el) return '';
        return (el.textContent || el.value || '').trim().replace(/\s+/g, ' ');
    }

    function saveButtonInfo(selector, text, value) {
        GM_setValue(STORAGE_KEYS.selector, selector);
        GM_setValue(STORAGE_KEYS.text, text);
        GM_setValue(STORAGE_KEYS.value, value);
    }

    function loadButtonInfo() {
        return {
            selector: GM_getValue(STORAGE_KEYS.selector, ''),
            text: GM_getValue(STORAGE_KEYS.text, ''),
            value: GM_getValue(STORAGE_KEYS.value, '')
        };
    }

    function notify(msg) {
        GM_notification({ title: '按钮控制脚本', text: msg, timeout: 2000 });
    }

    /* ------------------------------
     * 按钮查找与验证
     * ------------------------------ */
    function findOriginalButton() {
        const { selector, text, value } = loadButtonInfo();
        if (!selector) return null;

        try {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).find(el => {
                const matchText = getButtonText(el);
                return matchText === text || el.value === value;
            }) || null;
        } catch {
            return null;
        }
    }

    /* ------------------------------
     * 按钮选择逻辑
     * ------------------------------ */
    function startButtonSelection() {
        if (isSelecting) return;
        isSelecting = true;

        document.addEventListener('mousemove', highlightOnHover, true);
        document.addEventListener('click', handleButtonSelection, true);
        setTimeout(cancelSelection, 10000);
    }

    function highlightOnHover(e) {
        if (!isSelecting) return;
        if (highlightTarget) highlightTarget.style.outline = '';
        highlightTarget = e.target;
        highlightTarget.style.outline = '2px solid red';
        highlightTarget.style.cursor = 'pointer';
    }

    function handleButtonSelection(e) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        const selector = generateSelector(target);
        const text = getButtonText(target);
        const value = target.value || '';

        saveButtonInfo(selector, text, value);
        notify('按钮选择成功！');

        if (clonedButton) clonedButton.remove();
        clonedButton = null;
        createClonedButton();
        cancelSelection();
    }

    function cancelSelection() {
        if (!isSelecting) return;
        isSelecting = false;

        document.removeEventListener('mousemove', highlightOnHover, true);
        document.removeEventListener('click', handleButtonSelection, true);

        if (highlightTarget) {
            highlightTarget.style.outline = '';
            highlightTarget.style.cursor = '';
        }
        highlightTarget = null;
    }

    /* ------------------------------
     * 按钮复制与拖动
     * ------------------------------ */
    function createClonedButton() {
        if (clonedButton) return clonedButton;

        const originalButton = findOriginalButton();
        if (!originalButton) return null;

        clonedButton = originalButton.cloneNode(true);
        clonedButton.removeAttribute('id');

        // 强制去除红框和边界样式
        Object.assign(clonedButton.style, {
            position: 'fixed',
            zIndex: 99999,
            cursor: 'move',
            opacity: 0.9,
            userSelect: 'none',
            outline: 'none',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        });

        // 恢复保存的位置
        const pos = GM_getValue(STORAGE_KEYS.position, { x: 50, y: 50 });
        clonedButton.style.left = `${pos.x}px`;
        clonedButton.style.top = `${pos.y}px`;

        // 每次点击都重新查找原按钮
        clonedButton.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const realButton = findOriginalButton();
            if (realButton) realButton.click();
            else notify('未找到原始按钮，请重新指定');
        });

        enableDrag(clonedButton);
        document.body.appendChild(clonedButton);
        return clonedButton;
    }

    function enableDrag(el) {
        let dragging = false, startX, startY, initX, initY;

        el.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            initX = rect.left;
            initY = rect.top;
            el.style.cursor = 'grabbing';
            el.style.opacity = 0.7;

            const onMove = ev => {
                if (!dragging) return;
                el.style.left = `${initX + ev.clientX - startX}px`;
                el.style.top = `${initY + ev.clientY - startY}px`;
            };

            const onUp = () => {
                dragging = false;
                el.style.cursor = 'move';
                el.style.opacity = 0.9;
                const rect = el.getBoundingClientRect();
                GM_setValue(STORAGE_KEYS.position, { x: rect.left, y: rect.top });
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    function showButton() {
        clonedButton ? (clonedButton.style.display = 'block') : createClonedButton();
    }

    function hideButton() {
        if (clonedButton) clonedButton.style.display = 'none';
    }

    /* ------------------------------
     * 初始化逻辑
     * ------------------------------ */
    function init() {
        GM_registerMenuCommand('📌 指定按钮', startButtonSelection);
        GM_registerMenuCommand('👁️ 创建分身', showButton);
        GM_registerMenuCommand('🙈 关闭分身', hideButton);

        const saved = GM_getValue(STORAGE_KEYS.selector, '');
        if (saved) {
            // 延迟初始化，等待页面按钮加载
            setTimeout(() => {
                const btn = createClonedButton();
                if (btn) btn.style.display = 'none';
            }, 1000);
        }
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();
