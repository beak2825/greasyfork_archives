// ==UserScript==
// @name         PT 魔力值自动兑换
// @namespace    https://tampermonkey.net/
// @version      1.5.3
// @description  多站点隔离
// @match        *://*/*bonus*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562490/PT%20%E9%AD%94%E5%8A%9B%E5%80%BC%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/562490/PT%20%E9%AD%94%E5%8A%9B%E5%80%BC%E8%87%AA%E5%8A%A8%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***********************
     * 站点隔离 Key
     ***********************/
    const SITE_KEY = location.hostname;
    const STORE_KEY = `rg_auto_exchange_state__${SITE_KEY}`;
    const DISCLAIMER_KEY = `rg_disclaimer_ok__${SITE_KEY}`;

    /***********************
     * 主逻辑入口（关键）
     ***********************/
    function init() {

        /***********************
         * 扫描兑换项
         ***********************/
        function scanItems() {
            const map = {};
            document
                .querySelectorAll('input[type="submit"][value="交换"]')
                .forEach(btn => {
                    const row = btn.closest('tr');
                    if (!row) return;

                    const h1 = row.querySelector('h1');
                    const priceTd = row.querySelectorAll('td')[2];
                    if (!h1 || !priceTd) return;

                    const name = h1.innerText.replace(/\s+/g, '').trim();
                    const price = parseInt(priceTd.innerText.replace(/,/g, ''), 10);

                    map[name] = { button: btn, price };
                });
            return map;
        }

        const itemMap = scanItems();
        const itemNames = Object.keys(itemMap);
        if (!itemNames.length) return;

        /***********************
         * 状态工具
         ***********************/
        const load = () => GM_getValue(STORE_KEY, null);
        const save = v => GM_setValue(STORE_KEY, v);
        const clear = () => GM_deleteValue(STORE_KEY);

        /***********************
         * UI 面板
         ***********************/
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 280px;
            background: #1e1e1e;
            color: #eaeaea;
            padding: 14px;
            border-radius: 14px;
            font-size: 13px;
            z-index: 9999;
            box-shadow: 0 0 15px rgba(0,0,0,.6);
        `;

        panel.innerHTML = `
            <div style="font-weight:bold;font-size:14px;margin-bottom:8px;">
                ⚡ 魔力值自动兑换
            </div>

            <div style="margin-bottom:6px;">
                物品：
                <select id="rg-item" style="width:100%;margin-top:4px;"></select>
            </div>

            <div style="margin-bottom:8px;">
                次数：
                <input id="rg-times" type="number" min="1" value="1" style="width:60px;">
                间隔：
                <input id="rg-interval" type="number" min="11" value="11" style="width:60px;"> 秒
            </div>

            <div style="margin-bottom:8px;">
                <button id="rg-start">▶ 开始</button>
                <button id="rg-stop">■ 停止</button>
            </div>

            <hr style="border:0;border-top:1px solid #333;margin:8px 0">

            <div id="rg-task"></div>
            <div id="rg-progress"></div>
            <div id="rg-wait"></div>
            <div id="rg-cost"></div>
        `;
        document.body.appendChild(panel);

        const select = panel.querySelector('#rg-item');
        itemNames.forEach(n => {
            const o = document.createElement('option');
            o.value = n;
            o.textContent = n;
            select.appendChild(o);
        });

        const taskEl = panel.querySelector('#rg-task');
        const progressEl = panel.querySelector('#rg-progress');
        const waitEl = panel.querySelector('#rg-wait');
        const costEl = panel.querySelector('#rg-cost');

        /***********************
         * 核心执行逻辑
         ***********************/
        function run() {
            const state = load();
            if (!state?.running) return;

            if (state.current >= state.total) {
                taskEl.innerHTML = `✅ 任务完成`;
                waitEl.textContent = '';
                progressEl.textContent = '';
                costEl.innerHTML =
                    `物品：<b>${state.itemName}</b><br>总消耗：<b>${state.cost}</b>`;
                clear();
                return;
            }

            if (state.nextTime && Date.now() < state.nextTime) return;

            const item = itemMap[state.itemName];
            if (!item) {
                taskEl.textContent = '兑换项不存在，已停止';
                clear();
                return;
            }

            state.current++;
            state.cost += item.price;
            state.nextTime = Date.now() + state.interval * 1000;
            save(state);

            taskEl.innerHTML = `物品：<b>${state.itemName}</b>`;
            progressEl.textContent = `进度：${state.current} / ${state.total}`;
            costEl.textContent = `累计消耗：${state.cost}`;

            item.button.click();
        }

        /***********************
         * 倒计时显示
         ***********************/
        setInterval(() => {
            const state = load();
            if (!state?.running || !state.nextTime) return;

            const remain = state.nextTime - Date.now();
            if (remain > 0) {
                waitEl.textContent = `⏳ 等待 ${(remain / 1000).toFixed(1)} 秒`;
            }
        }, 300);

        /***********************
         * 按钮
         ***********************/
        panel.querySelector('#rg-start').onclick = () => {
            let interval = parseInt(panel.querySelector('#rg-interval').value, 10);
            if (interval < 11) interval = 11;

            save({
                running: true,
                itemName: select.value,
                total: parseInt(panel.querySelector('#rg-times').value, 10),
                current: 0,
                interval,
                nextTime: null,
                cost: 0
            });
            location.reload();
        };

        panel.querySelector('#rg-stop').onclick = () => {
            clear();
            taskEl.textContent = '已手动停止';
            waitEl.textContent = '';
        };

        /***********************
         * 自动恢复
         ***********************/
        const saved = load();
        if (saved?.running) {
            taskEl.innerHTML = `物品：<b>${saved.itemName}</b>`;
            progressEl.textContent = `进度：${saved.current} / ${saved.total}`;
            costEl.textContent = `累计消耗：${saved.cost}`;
            setInterval(run, 500);
        }
    }

    /***********************
     * 免责说明（网页 UI，仅首次）
     ***********************/
    if (!GM_getValue(DISCLAIMER_KEY, false)) {
        const mask = document.createElement('div');
        mask.style = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.6);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const box = document.createElement('div');
        box.style = `
            width: 420px;
            background: #1f1f1f;
            color: #eee;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,.5);
            font-size: 14px;
        `;

        box.innerHTML = `
            <h3 style="margin-top:0;color:#ffcc00;">自动兑换免责说明</h3>
            <p>本脚本仅用于学习与个人便利用途。</p>
            <p>所有操作均等同于你本人在网页上的手动点击。</p>
            <p style="color:#ff8080;">
                使用本脚本产生的一切后果（包括但不限于账号限制、
                魔力值损失等）需由你本人自行承担。
            </p>
            <div style="text-align:right;margin-top:16px;">
                <button id="rg-disclaimer-ok"
                    style="
                        padding:6px 14px;
                        border-radius:6px;
                        border:0;
                        cursor:pointer;
                        background:#3fa9f5;
                        color:#fff;
                    ">
                    我已知晓并同意
                </button>
            </div>
        `;

        mask.appendChild(box);
        document.body.appendChild(mask);

        box.querySelector('#rg-disclaimer-ok').onclick = () => {
            GM_setValue(DISCLAIMER_KEY, true);
            mask.remove();
            init(); // ⭐ 关键：立即初始化 UI
        };
        return;
    }

    /***********************
     * 已同意 → 直接启动
     ***********************/
    init();

})();
