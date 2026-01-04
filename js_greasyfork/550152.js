// ==UserScript==
// @name         WMI测试服自动刷新任务
// @namespace    http://tampermonkey.net/
// @version      2025.09.21.1
// @description  每个任务独立按钮，独立刷新，达标或无法刷新时停止，点击返回键后找不到刷新按钮可停止刷新。可以在任务中配置相关参数。\n目标代币：当任务奖励大于等于目标代笔时停止刷新\n刷新间隔: 如果提示请勿过快发送指令可以适当加大间隔时间\n最大刷新次数：达到次数后即便没有达成目标也会停止可以设置一个很大的值
// @author       kewu
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550152/WMI%E6%B5%8B%E8%AF%95%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/550152/WMI%E6%B5%8B%E8%AF%95%E6%9C%8D%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========  可配置变量  ========== */
    let CHECK_INTERVAL  = 2000;   // 全局定时检查间隔
    let MAX_RETRIES     = 1000;   // 单条任务最大刷新次数
    let RETRY_DELAY     = 2000;   // 每次刷新后等待
    let TARGET_TOKEN    = 27;     // 目标代币数

    /* ==========  配置面板  ========== */
    function insertConfigPanel() {
        const board = document.querySelector('.TasksPanel_taskBoard__VNcZV');
        if (!board || board.querySelector('.auto-config-panel')) return;
        const panel = document.createElement('div');
        panel.className = 'auto-config-panel';
        panel.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin:12px 0;padding:8px;border:1px solid #ccc;border-radius:4px;';

        function row(labelText, defVal, key) {
            const dv = document.createElement('div');
            dv.style.cssText = 'display:flex;align-items:center;gap:6px;';
            const lb = document.createElement('span');
            lb.textContent = labelText;
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.value = defVal;
            inp.style.width = '80px';
            const btn = document.createElement('button');
            btn.textContent = '修改';
            btn.onclick = () => {
                const v = parseInt(inp.value, 10);
                if (v > 0) {
                    switch (key) {
                        case 'TARGET': TARGET_TOKEN = v; break;
                        case 'DELAY':  RETRY_DELAY  = v; break;
                        case 'MAX':    MAX_RETRIES  = v; break;
                    }
                }
            };
            dv.append(lb, inp, btn);
            return dv;
        }
        panel.append(
            row('目标代币：', TARGET_TOKEN, 'TARGET'),
            row('刷新间隔(ms)：', RETRY_DELAY, 'DELAY'),
            row('最大刷新次数：', MAX_RETRIES, 'MAX')
        );
        board.insertBefore(panel, board.children[1] || null);
    }

    /* ==========  代币读取  ========== */
    function getToken(task) {
        const rc = task.querySelector('.RandomTask_rewards__YZk7D');
        if (!rc) return 0;
        const its = rc.querySelectorAll('.Item_itemContainer__x7kH1');
        if (its.length < 2) return 0;
        const cnt = its[1].querySelector('.Item_count__1HVvv');
        return cnt ? (parseInt(cnt.textContent, 10) || 0) : 0;
    }

    /* ==========  单任务刷新逻辑  ========== */
    async function refreshSingle(taskCard) {
        const card = taskCard;                       // 当前任务容器
        const taskId = Array.from(document.querySelectorAll('.RandomTask_randomTask__3B9fA')).indexOf(card);
        console.log(`[任务${taskId}] 开始刷新`);

        const resetWrap = card.querySelector('.RandomTask_buttonsContainer__32ypF');
        if (resetWrap) {
            console.log('找到重置父容器');
            const resetGroup = resetWrap.querySelector('.RandomTask_buttonGroup__2gFGO');
            const resetBtn = resetGroup?.querySelector(':scope > button');
            if (resetBtn && resetBtn.textContent.trim() === '重置') {
                resetBtn.click();
                console.log(`[任务${taskId}] 已点击“重置”按钮`);
                await new Promise(r => setTimeout(r, 500)); // 稍等页面更新
            }
        }

        for (let tries = 0; tries < MAX_RETRIES; tries++) {
            const tok = getToken(card);
            if (tok >= TARGET_TOKEN) {
                console.log(`[任务${taskId}] 已达标（${tok}）停止`);
                return;
            }
            const rerollBox = card.querySelector('.RandomTask_rerollOptionsContainer__3yFjo');
            if (!rerollBox) {
                console.log(`[任务${taskId}] 找不到刷新容器，终止`);
                return;
            }
            const btn = rerollBox.querySelector('div:first-child button');
            if (!btn) {
                console.log(`[任务${taskId}] 找不到牛铃刷新按钮，终止`);
                return;
            }
            btn.click();
            console.log(`[任务${taskId}] 已点击刷新（${tries + 1}/${MAX_RETRIES}）`);
            await new Promise(r => setTimeout(r, RETRY_DELAY));
        }
        console.log(`[任务${taskId}] 已达最大次数，停止`);
    }

    /* ==========  为每个任务插入独立按钮  ========== */
    function addButtons() {
        document.querySelectorAll('.RandomTask_randomTask__3B9fA').forEach((card, idx) => {
            if (card.querySelector('.auto-refresh-single')) return; // 已存在
            const box = card;
            const bt = document.createElement('button');
            bt.className = 'Button_button__1Fe9z Button_fullWidth__17pVU auto-refresh-single';
            bt.style.cssText = 'box-shadow:none;margin-top:6px;';
            bt.innerHTML = `<span>自动刷新</span>`;
            bt.onclick = () => refreshSingle(card);
            box.appendChild(bt);
        });
    }

    /* ==========  定时检查并补充按钮 / 配置面板  ========== */
    function run() {
        insertConfigPanel();
        addButtons();
    }
    run();
    setInterval(run, CHECK_INTERVAL);

    /* ==========  监听 DOM 变化  ========== */
    new MutationObserver(run).observe(document.body, { childList: true, subtree: true });
})();