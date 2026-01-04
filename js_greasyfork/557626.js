// ==UserScript==
// @name         Weibo Batch Delete Tool (V17.0 Auto Reload)
// @namespace    http://tampermonkey.net/
// @version      17.0
// @description  极速倒序删除 + 任务完成后自动刷新页面
// @author       Keihen
// @match        https://weibo.com/u/*
// @match        https://www.weibo.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557626/Weibo%20Batch%20Delete%20Tool%20%28V170%20Auto%20Reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557626/Weibo%20Batch%20Delete%20Tool%20%28V170%20Auto%20Reload%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CONFIG = {
        cardSelector: '.vue-recycle-scroller__item-view',
        selectClass: 'wb-selected-target',
        // 基础操作间隔 (毫秒)，极速版默认350，如遇频繁请改大
        delay: 350,
    };

    let isSelectMode = false;
    let btnToggleRef = null;
    let btnDeleteRef = null;
    let statusRef = null;
    let deleteConfirmState = false;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- UI 初始化 ---
    function initUI() {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            position: fixed; bottom: 50px; right: 30px;
            background: #fff; padding: 12px; border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15); z-index: 10000;
            display: flex; flex-direction: column; gap: 8px; width: 180px;
            font-size: 14px; font-family: sans-serif; border: 1px solid #eee;
        `;

        statusRef = document.createElement('div');
        statusRef.innerText = '准备就绪';
        statusRef.style.cssText = `
            font-size: 12px; color: #666; background: #f5f5f5;
            padding: 5px; border-radius: 4px; text-align: center;
            min-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        `;

        btnToggleRef = createButton('1. 开启选择模式', '#1890ff', () => {
            isSelectMode = !isSelectMode;
            updateToggleBtnState();
            resetDeleteButton();
        });

        btnDeleteRef = createButton('2. 批量删除选中', '#ff4d4f', handleDeleteClick);

        const btnClear = createButton('重置所有', '#999', () => {
            document.querySelectorAll(`.${CONFIG.selectClass}`).forEach(el => {
                el.classList.remove(CONFIG.selectClass);
                el.style.border = 'none';
            });
            showStatus('已清空所有标记');
            resetDeleteButton();
        });

        toolbar.appendChild(statusRef);
        toolbar.appendChild(btnToggleRef);
        toolbar.appendChild(btnDeleteRef);
        toolbar.appendChild(btnClear);
        document.body.appendChild(toolbar);
    }

    function createButton(text, bg, onclick) {
        const b = document.createElement('button');
        b.innerText = text;
        b.onclick = onclick;
        b.style.cssText = `
            padding: 8px 12px; background: ${bg}; color: #fff;
            border: none; border-radius: 4px; cursor: pointer;
            font-weight: bold; transition: all 0.2s;
        `;
        return b;
    }

    // --- 状态与交互控制 ---
    function showStatus(msg, isError = false) {
        if (statusRef) {
            statusRef.innerText = msg;
            statusRef.style.color = isError ? 'red' : '#333';
            statusRef.style.background = isError ? '#fff1f0' : '#f5f5f5';
        }
        console.log(`[Weibo-Cleaner] ${msg}`);
    }

    function updateToggleBtnState() {
        if (isSelectMode) {
            btnToggleRef.innerText = '✅ 正在选择...';
            btnToggleRef.style.background = '#faad14';
            document.body.style.cursor = 'crosshair';
            showStatus('请点击微博卡片进行选择');
        } else {
            btnToggleRef.innerText = '1. 开启选择模式';
            btnToggleRef.style.background = '#1890ff';
            document.body.style.cursor = 'default';
            showStatus('选择模式已关闭');
        }
    }

    function resetDeleteButton() {
        deleteConfirmState = false;
        btnDeleteRef.innerText = '2. 批量删除选中';
        btnDeleteRef.style.background = '#ff4d4f';
    }

    function handleDeleteClick() {
        const count = document.querySelectorAll(`.${CONFIG.selectClass}`).length;
        if (count === 0) {
            showStatus('❌ 未选择任何微博', true);
            return;
        }

        if (!deleteConfirmState) {
            deleteConfirmState = true;
            btnDeleteRef.innerText = `⚠️ 确定删除 ${count} 条?`;
            btnDeleteRef.style.background = '#cf1322';
            showStatus('再次点击开始删除');
            isSelectMode = false;
            updateToggleBtnState();
        } else {
            executeBatchDelete();
            resetDeleteButton();
        }
    }

    function initListener() {
        document.addEventListener('click', (e) => {
            if (!isSelectMode) return;
            const card = e.target.closest(CONFIG.cardSelector);
            if (card) {
                e.preventDefault(); e.stopPropagation();
                if (card.classList.contains(CONFIG.selectClass)) {
                    card.classList.remove(CONFIG.selectClass);
                    card.style.border = 'none';
                } else {
                    card.classList.add(CONFIG.selectClass);
                    card.style.border = '4px solid red';
                }
                const count = document.querySelectorAll(`.${CONFIG.selectClass}`).length;
                showStatus(`已选择 ${count} 条`);
            }
        }, true);
    }

    // --- 核心删除逻辑 ---
    async function executeBatchDelete() {
        let cards = Array.from(document.querySelectorAll(`.${CONFIG.selectClass}`));
        if (cards.length === 0) return;

        // 倒序删除 (从下往上)
        cards.reverse();

        showStatus('🚀 任务开始 (极速倒序)');

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            showStatus(`⚡ 处理中 (${i+1}/${cards.length})...`);

            try {
                // A. 滚动
                card.scrollIntoView({ block: 'center' });
                await sleep(300);

                // B. 点击更多
                const moreBtn = card.querySelector('[title="更多"]');
                if (!moreBtn) throw new Error('找不到更多按钮');

                moreBtn.click();
                await sleep(CONFIG.delay);

                // C. 找删除
                let deleteBtn = findDeleteOption();
                if (!deleteBtn) {
                     moreBtn.click();
                     await sleep(CONFIG.delay);
                     deleteBtn = findDeleteOption();
                }

                if (!deleteBtn) throw new Error('找不到删除选项');
                deleteBtn.click();
                await sleep(CONFIG.delay);

                // D. 找确定
                let confirmBtn = findVisibleText('确定');
                if (!confirmBtn) {
                    const blueBtn = document.querySelector('.woo-button-primary');
                    if(blueBtn && blueBtn.offsetParent !== null) confirmBtn = blueBtn;
                }

                if (confirmBtn) {
                    confirmBtn.click();
                } else {
                     throw new Error('找不到确认按钮');
                }

                // E. 完成本条
                card.classList.remove(CONFIG.selectClass);
                card.style.opacity = '0.05';
                card.style.pointerEvents = 'none';
                card.style.border = 'none';

                await sleep(800); // 冷却

            } catch (e) {
                console.error(e);
                showStatus(`❌ 失败: ${e.message}`, true);
                card.style.border = '4px solid purple';
                await sleep(1000);
            }
        }

        // --- 任务全部完成，执行刷新 ---
        showStatus('✅ 全部完成！1.5秒后刷新页面...');
        await sleep(1500);
        location.reload(); // 刷新页面
    }

    function findDeleteOption() {
        const items = document.querySelectorAll('.woo-pop-item-main');
        for (let i = items.length - 1; i >= 0; i--) {
            if (items[i].innerText.includes('删除') && items[i].offsetParent !== null) {
                return items[i];
            }
        }
        return findVisibleText('删除');
    }

    function findVisibleText(text) {
        const targets = document.querySelectorAll('body div, body li, body span, body button');
        for (let i = targets.length - 1; i >= 0; i--) {
            const el = targets[i];
            if (el.innerText.trim().includes(text) &&
                el.innerText.length < 10 &&
                el.offsetParent !== null) {
                return el;
            }
        }
        return null;
    }

    window.addEventListener('load', () => {
        setTimeout(() => { initUI(); initListener(); }, 1500);
    });
})();