// ==UserScript==
// @name         Gemini 直播间自动送礼助手 (轻量版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自动送礼助手，支持自定义房间、礼物类型、送礼数量等。
// @author       DouyuUser
// @match        https://www.douyu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/557743/Gemini%20%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E5%8A%A9%E6%89%8B%20%28%E8%BD%BB%E9%87%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557743/Gemini%20%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E9%80%81%E7%A4%BC%E5%8A%A9%E6%89%8B%20%28%E8%BD%BB%E9%87%8F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        targetRoomId: '36252',    // 目标房间号 (默认为当前房间或指定房间)
        giftType: 'glow',         // glow: 仅荧光棒, all: 所有礼物
        sendCount: 'all',         // all: 梭哈, 10: 送10个, 50%: 送一半
        autoRun: true,            // 是否自动运行
        runOnSundayOnly: true,    // 是否仅周日运行
    };

    // 获取配置
    function getConfig() {
        return GM_getValue('gift_config', DEFAULT_CONFIG);
    }

    // 保存配置
    function setConfig(newConfig) {
        GM_setValue('gift_config', { ...getConfig(), ...newConfig });
    }

    // 日志输出
    function log(msg) {
        console.log(`%c[送礼助手] ${msg}`, "color: #ff5d23; font-weight: bold;");
    }

    // UI 提示
    function showToast(msg, type='info') {
        const id = 'dy-gift-toast';
        let el = document.getElementById(id);
        if (el) el.remove();

        el = document.createElement('div');
        el.id = id;
        let bg = 'rgba(0,0,0,0.8)';
        let color = '#fff';
        if (type === 'success') color = '#4caf50';
        if (type === 'error') color = '#f44336';

        el.innerHTML = `<span style="color:${color}; font-weight:bold;">[送礼助手]</span> ${msg}`;
        el.style.cssText = `position: fixed; top: 80px; right: 20px; z-index: 10000; background: ${bg}; color: white; padding: 10px 16px; border-radius: 8px; font-size: 14px; pointer-events: none; transition: opacity 0.3s;`;
        document.body.appendChild(el);
        setTimeout(() => { if (el) el.style.opacity = 0; }, 4000);
        setTimeout(() => { if (el) el.remove(); }, 4500);
    }

    // 今天的标记 Key
    function getTodayKey() {
        return `dy_sent_${new Date().toLocaleDateString()}`;
    }

    // 核心送礼逻辑
    async function donateAll(force = false) {
        const config = getConfig();
        const roomId = config.targetRoomId;
        
        // 检查是否在目标房间 (如果在斗鱼首页或其他房间，可能不执行或跳转)
        // 简单起见，我们假设脚本只在目标房间运行，或者在任意房间运行但API发往目标房间
        // 斗鱼API允许在A房间给B房间送礼，所以不用跳转。

        if (!force) {
            if (config.runOnSundayOnly && new Date().getDay() !== 0) {
                log("非周日，跳过。");
                return;
            }
            if (localStorage.getItem(getTodayKey()) === '1') {
                log("今日已送，跳过。");
                return;
            }
        }

        showToast(`正在向房间 [${roomId}] 送礼...`, "info");
        log(`目标房间: ${roomId}, 策略: ${config.giftType}, 数量: ${config.sendCount}`);

        try {
            // 1. 获取背包
            const bagRes = await fetch(`/japi/prop/backpack/web/v1?rid=${roomId}`);
            const bagData = await bagRes.json();
            if (bagData.error !== 0) throw new Error(bagData.msg);

            const list = bagData.data.list || [];
            if (list.length === 0) {
                log("背包为空");
                if (!force) localStorage.setItem(getTodayKey(), '1');
                return;
            }

            // 2. 筛选礼物
            let targets = [];
            if (config.giftType === 'glow') {
                targets = list.filter(i => i.id === 268); // 荧光棒 ID
            } else {
                targets = list.filter(i => i.count > 0); // 所有有数量的
            }

            if (targets.length === 0) {
                log("无符合条件礼物");
                if (!force) localStorage.setItem(getTodayKey(), '1');
                return;
            }

            // 3. 计算数量并赠送
            let sentTotal = 0;
            for (const item of targets) {
                let countToSend = item.count;
                
                // 解析数量配置
                if (config.sendCount !== 'all') {
                    if (config.sendCount.endsWith('%')) {
                        const pct = parseFloat(config.sendCount) / 100;
                        countToSend = Math.floor(item.count * pct);
                    } else {
                        countToSend = Math.min(parseInt(config.sendCount), item.count);
                    }
                }

                if (countToSend <= 0) continue;

                log(`送出 ${item.name}: ${countToSend}个`);
                
                const formData = new URLSearchParams();
                formData.append('propId', item.id);
                formData.append('propCount', countToSend);
                formData.append('roomId', roomId);
                formData.append('bizExt', '{"yzxq":{}}');

                const sendRes = await fetch('/japi/prop/donate/mainsite/v1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });
                const sendData = await sendRes.json();
                
                if (sendData.error === 0) sentTotal += countToSend;
                else log(`送礼失败: ${sendData.msg}`);
                
                await new Promise(r => setTimeout(r, 500));
            }

            if (sentTotal > 0) {
                if (!force) localStorage.setItem(getTodayKey(), '1');
                showToast(`成功送出 ${sentTotal} 个礼物`, "success");
            } else {
                showToast("未送出任何礼物", "info");
            }

        } catch (e) {
            console.error(e);
            showToast("出错: " + e.message, "error");
        }
    }

    // 设置菜单 UI
    function showSettings() {
        const config = getConfig();
        const currentRoom = window.location.pathname.split('/')[1] || config.targetRoomId;
        
        const inputRoom = prompt("请输入目标房间号:\n(默认使用当前配置或当前房间)", config.targetRoomId === '36252' && currentRoom !== '36252' ? currentRoom : config.targetRoomId);
        if (inputRoom === null) return;

        const inputType = prompt("礼物类型 (输入 1 或 2):\n1. 仅荧光棒\n2. 所有背包礼物", config.giftType === 'glow' ? '1' : '2');
        if (inputType === null) return;

        const inputCount = prompt("赠送数量 (例如: all, 100, 50%):", config.sendCount);
        if (inputCount === null) return;

        const inputSunday = confirm("是否仅在周日运行？\n点击[确定]为是，[取消]为否");

        setConfig({
            targetRoomId: inputRoom || config.targetRoomId,
            giftType: inputType === '2' ? 'all' : 'glow',
            sendCount: inputCount || 'all',
            runOnSundayOnly: inputSunday
        });

        showToast("配置已保存", "success");
    }

    // 注册菜单
    GM_registerMenuCommand("⚙️ 送礼配置", showSettings);
    GM_registerMenuCommand("🚀 立即执行", () => donateAll(true));
    GM_registerMenuCommand("🔄 重置今日状态", () => {
        localStorage.removeItem(getTodayKey());
        showToast("状态已重置", "success");
    });

    // 自动运行
    const config = getConfig();
    // 如果设置了只在目标房间运行，可以在这里判断 window.location.href
    // 但为了方便，我们允许在任意直播间触发给 targetRoomId 送礼
    if (config.autoRun) {
        setTimeout(() => donateAll(false), 5000);
    }

})();
