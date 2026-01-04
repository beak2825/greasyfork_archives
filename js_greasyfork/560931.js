// ==UserScript==
// @name         Google AI Studio 快速删除下方所有记录- Delete Below (Safe & Polished)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  仅在对话消息菜单中显示“删除下方”。原生外观风格，修复误显示在侧边栏的问题。使用 Emoji 避免 TrustedHTML 报错。
// @author       You
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560931/Google%20AI%20Studio%20%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4%E4%B8%8B%E6%96%B9%E6%89%80%E6%9C%89%E8%AE%B0%E5%BD%95-%20Delete%20Below%20%28Safe%20%20Polished%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560931/Google%20AI%20Studio%20%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4%E4%B8%8B%E6%96%B9%E6%89%80%E6%9C%89%E8%AE%B0%E5%BD%95-%20Delete%20Below%20%28Safe%20%20Polished%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastClickedTriggerBtn = null;

    // 1. 监听点击，精确定位来源
    document.addEventListener('mousedown', (e) => {
        // 查找最近的按钮
        const btn = e.target.closest('button');
        if (btn) {
            const txt = btn.innerText || '';
            // 只有当它是菜单触发按钮时才记录
            if (txt.includes('more_vert') || btn.querySelector('.google-symbols')?.innerText === 'more_vert') {
                lastClickedTriggerBtn = btn;
            }
        }
    }, true);

    // 2. 监控菜单弹出
    const observer = new MutationObserver(() => {
        const menus = document.querySelectorAll('.mat-mdc-menu-content');
        if (menus.length > 0) {
            // 操作最新打开的那个菜单
            const activeMenu = menus[menus.length - 1];
            tryInjectButton(activeMenu);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 3. 注入逻辑 (带安全检查)
    function tryInjectButton(menuContent) {
        // [关键安全检查]：如果最后一次点击的按钮不在“聊天气泡”里，绝对不注入！
        // 这样就屏蔽了侧边栏、顶部菜单等其他地方
        if (!lastClickedTriggerBtn || !lastClickedTriggerBtn.closest('ms-chat-turn')) {
            return;
        }

        // 防止重复注入
        if (menuContent.querySelector('.tm-safe-del-btn')) return;

        // 寻找锚点：原生的 Delete 按钮
        const items = Array.from(menuContent.children);
        const deleteBtn = items.find(el => {
            const t = el.innerText;
            return t.includes('Delete') || t.includes('删除');
        });

        // 如果还没渲染出来，或者根本就没有 Delete 选项，就退出
        if (!deleteBtn) return;

        // --- 外观优化 ---
        // 既然不能 cloneNode (会有 Angular 问题)，我们就手动模拟得像一点
        const myBtn = document.createElement('div');
        myBtn.className = 'tm-safe-del-btn';

        // 深度模仿 Material Design 菜单项样式
        myBtn.style.cssText = `
            display: flex;
            align-items: center;
            min-height: 48px;
            padding: 0 12px;
            cursor: pointer;
            font-family: "Google Sans", "Roboto", sans-serif; /* 跟随系统字体 */
            font-size: 14px;
            font-weight: 500; /* 加粗一点点，贴合原生 */
            letter-spacing: 0.25px;
            color: inherit;
            background: transparent;
            box-sizing: border-box;
            user-select: none;
            transition: background-color 0.2s;
        `;

        // 内部容器，用于图标对齐
        const innerContent = document.createElement('div');
        innerContent.style.cssText = `
            display: flex;
            align-items: center;
            width: 100%;
        `;

        // 图标 (使用 Emoji 避免报错，但调整位置)
        const iconSpan = document.createElement('span');
        iconSpan.innerText = '🗑️';
        iconSpan.style.cssText = `
            margin-right: 12px;
            font-size: 18px; /* 稍微大一点，看起来像 Icon */
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            filter: grayscale(100%); /* 让 Emoji 变灰，更像系统图标 */
            opacity: 0.7;
        `;

        // 文字
        const textSpan = document.createElement('span');
        textSpan.innerText = 'Delete below (删除下方)';
        textSpan.style.cssText = `
            flex: 1;
        `;

        innerContent.appendChild(iconSpan);
        innerContent.appendChild(textSpan);
        myBtn.appendChild(innerContent);

        // Hover 效果 (手动模拟)
        myBtn.onmouseenter = () => { myBtn.style.backgroundColor = 'var(--mat-menu-item-hover-state-layer-color, rgba(255, 255, 255, 0.08))'; };
        myBtn.onmouseleave = () => {
            myBtn.style.backgroundColor = 'transparent';
            resetState();
        };

        // --- 交互逻辑 ---
        let isConfirming = false;

        function resetState() {
            isConfirming = false;
            myBtn.style.color = 'inherit';
            textSpan.innerText = 'Delete below (删除下方)';
            textSpan.style.fontWeight = '500';
            iconSpan.innerText = '🗑️';
            iconSpan.style.filter = 'grayscale(100%)';
        }

        myBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isConfirming) {
                // 确认状态
                isConfirming = true;
                myBtn.style.color = '#fa7b17'; // 使用警告橙色，比红色柔和一点，或者用红色 #ff5252
                textSpan.innerText = 'Confirm delete below?';
                textSpan.style.fontWeight = '700'; // 加粗提示
                iconSpan.innerText = '⚠️';
                iconSpan.style.filter = 'none'; // 恢复 Emoji 彩色
            } else {
                // 执行
                document.body.click();
                doDelete();
            }
        };

        // 插入位置
        menuContent.insertBefore(myBtn, deleteBtn.nextSibling);
    }

    // 4. 执行删除
    async function doDelete() {
        // 双重保险：执行时再次检查是否是聊天行
        if (!lastClickedTriggerBtn) return;
        const currentRow = lastClickedTriggerBtn.closest('ms-chat-turn');

        if (!currentRow) {
            console.warn('操作被拦截：试图在非聊天区域执行批量删除');
            return;
        }

        const allRows = Array.from(document.querySelectorAll('ms-chat-turn'));
        const index = allRows.indexOf(currentRow);
        if (index === -1) return;

        const toDelete = allRows.slice(index).reverse();

        showToast(`Processing ${toDelete.length} messages...`);

        for (const row of toDelete) {
            await deleteSingle(row);
            await new Promise(r => setTimeout(r, 500));
        }
        showToast('Done');
    }

    async function deleteSingle(row) {
        // 同样的，查找按钮时只认 more_vert
        const btns = Array.from(row.querySelectorAll('button'));
        const trigger = btns.find(b => b.innerText.includes('more_vert'));
        if (!trigger) return;

        trigger.scrollIntoView({block: 'center'});
        trigger.click();

        const menu = await waitForMenu();
        if (!menu) { document.body.click(); return; }

        // 找原生删除键
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
        const delBtn = items.find(i => {
            if (i.className.includes('tm-safe-del-btn')) return false; // 忽略自己
            return i.innerText.includes('Delete') || i.innerText.includes('删除');
        });

        if (delBtn) delBtn.click();
        else document.body.click();
    }

    function waitForMenu() {
        return new Promise(resolve => {
            let i = 0;
            const t = setInterval(() => {
                const menus = document.querySelectorAll('.mat-mdc-menu-panel');
                if (menus.length > 0 && menus[menus.length-1].innerText.length > 5) {
                    clearInterval(t);
                    resolve(menus[menus.length-1]);
                }
                if (++i > 20) { clearInterval(t); resolve(null); }
            }, 100);
        });
    }

    function showToast(text) {
        let el = document.getElementById('tm-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'tm-toast';
            el.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background: #202124; color: #e8eaed; padding: 10px 24px; border-radius: 4px; font-family: Roboto,sans-serif; font-size: 14px; box-shadow: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15); z-index: 10000; transition: opacity 0.2s;';
            document.body.appendChild(el);
        }
        el.innerText = text;
        el.style.opacity = '1';
        setTimeout(() => el.style.opacity = '0', 3000);
    }

})();