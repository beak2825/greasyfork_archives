// ==UserScript==
// @name         MWI 装备强化 - 基底等级对合成到+20（无输入框版）
// @version      4.3.0
// @namespace    http://tampermonkey.net/
// @description  选择基底等级对 (1,2) 到 (18,19)，自动计算并批量强化到 +20（已移除次数输入框）
// @author       Customized
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560117/MWI%20%E8%A3%85%E5%A4%87%E5%BC%BA%E5%8C%96%20-%20%E5%9F%BA%E5%BA%95%E7%AD%89%E7%BA%A7%E5%AF%B9%E5%90%88%E6%88%90%E5%88%B0%2B20%EF%BC%88%E6%97%A0%E8%BE%93%E5%85%A5%E6%A1%86%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560117/MWI%20%E8%A3%85%E5%A4%87%E5%BC%BA%E5%8C%96%20-%20%E5%9F%BA%E5%BA%95%E7%AD%89%E7%BA%A7%E5%AF%B9%E5%90%88%E6%88%90%E5%88%B0%2B20%EF%BC%88%E6%97%A0%E8%BE%93%E5%85%A5%E6%A1%86%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ws = null;
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('characterId');
    // 异步 sleep，支持随机延迟
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function sleepRandom(min = 800, max = 1400) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return sleep(delay);
    }

    // Hook WebSocket（支持所有域名）
    const origDataGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data').get;
    Object.defineProperty(MessageEvent.prototype, 'data', {
        get: function() {
            const data = origDataGet.call(this);
            const socket = this.currentTarget;
            if (socket instanceof WebSocket &&
                (socket.url.includes('milkywayidle.com/ws') || socket.url.includes('milkywayidlecn.com/ws')) &&
                socket.readyState === 1) {
                ws = socket;
            }
            return data;
        },
        configurable: true
    });

    // 斐波那契数列缓存（F(1)=1, F(2)=1）
    const fib = [0, 1, 1];
    function getFib(n) {
        if (n < 0) return 0;
        if (fib[n] !== undefined) return fib[n];
        for (let i = fib.length; i <= n; i++) {
            fib[i] = fib[i-1] + fib[i-2];
        }
        return fib[n];
    }

    // 监控页面变化，添加自定义控件
    const observer = new MutationObserver(() => {
        const enhanceBtn = document.querySelector('.Button_button__1Fe9z.Button_success__6d6kU.Button_fullWidth__17pVU.Button_large__yIDVZ');
        if (!enhanceBtn || enhanceBtn.parentNode.querySelector('.custom-batch-btn')) return;

        // 下拉选择基底等级对
        const select = document.createElement('select');
        select.style.cssText = 'width: 100%; padding: 10px; margin-top: 8px; font-size: 16px; border-radius: 6px;';
        for (let low = 1; low <= 18; low++) {
            const option = document.createElement('option');
            option.value = low;
            option.textContent = `(${low}, ${low+1}) → +20`;
            if (low === 9) option.selected = true; // 默认选中 (9,10)
            select.appendChild(option);
        }

        // 批量强化按钮
        const batchBtn = document.createElement('button');
        batchBtn.textContent = '开始批量强化到 +20';
        batchBtn.className = 'custom-batch-btn';
        batchBtn.style.cssText = `
            margin-top: 12px;
            width: 100%;
            padding: 14px;
            font-size: 18px;
            background: #FF5722;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        `;

        // 点击逻辑
        batchBtn.onclick = async () => {
            if (!ws) {
                alert('❌ WebSocket 未连接！请先手动点一次强化操作再试');
                return;
            }
            const primaryContainer = document.querySelector('.SkillActionDetail_primaryItemSelectorContainer__nrvNW');
            if (!primaryContainer) {
                alert('❌ 未找到主物品容器！请确认已选择装备');
                return;
            }
            const useHref = primaryContainer.querySelector('use')?.getAttribute('href');
            if (!useHref) {
                alert('❌ 未读取到装备图标！请确认已选择主物品');
                return;
            }
            const hrid = useHref.split('#')[1];
            const low = parseInt(select.value); // 选中的 a
            const countA = getFib(20 - low - 1); // maxLevel = a 的次数
            const countB = getFib(20 - low);     // maxLevel = b 的次数
            const totalTimes = countA + countB;

            if (totalTimes > 5000) {
                alert(`❌ 当前选择 (${low},${low+1}) 需要 ${totalTimes} 次强化，超过安全上限 5000 次！\n建议选择更高等级对（如 (15,16) 以上）。`);
                return;
            }

            if (totalTimes === 0) {
                alert('计算次数为 0，请检查选择');
                return;
            }

            // 消息模板
            const createMessage = (maxLevel) => ({
                type: "new_character_action",
                newCharacterActionData: {
                    actionHrid: "/actions/enhancing/enhance",
                    primaryItemHash: `${characterId}::/item_locations/inventory::/items/${hrid}::0`,
                    secondaryItemHash: `${characterId}::/item_locations/inventory::/items/mirror_of_protection::0`,
                    enhancingMaxLevel: maxLevel,
                    enhancingProtectionMinLevel: 2,
                    characterLoadoutId: 14449,
                    shouldClearQueue: false,
                    hasMaxCount: false,
                    maxCount: 0
                }
            });

            let count = 0;

            // 第一阶段：maxLevel = low (a)
            for (let i = 0; i < countA; i++) {
                ws.send(JSON.stringify(createMessage(low)));
                count++;
                await sleepRandom(1500, 2000);
            }

            // 第二阶段：maxLevel = low + 1 (b)
            for (let i = 0; i < countB; i++) {
                ws.send(JSON.stringify(createMessage(low + 1)));
                count++;
                await sleepRandom(1500, 2000);
            }

            alert(`✅ 批量强化完成！\n使用 (${low}, ${low+1}) 基底对\n共发送 ${count} 次指令\n(${low}: ${countA} 次, ${low+1}: ${countB} 次)`);
        };

        // 插入控件（下拉菜单在上，按钮在下）
        enhanceBtn.parentNode.appendChild(select);
        enhanceBtn.parentNode.appendChild(batchBtn);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('🎯 MWI 批量强化脚本已加载（无输入框版）！进入贤者之境选择装备后会出现下拉菜单和强化按钮');
})();