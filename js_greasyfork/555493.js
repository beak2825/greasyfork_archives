// ==UserScript==
// @name         深圳税务申报征期提醒
// @namespace    http://tampermonkey.net/
// @version      18.0
// @description  官方征期+最后5天醒目提醒+Alt+T切换自动提醒+Alt+L手动触发+悬停3秒/不悬停3分钟关闭/鼠标点击关闭
// @author       Yuehua
// @icon         https://shenzhen.chinatax.gov.cn/favicon.ico
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555493/%E6%B7%B1%E5%9C%B3%E7%A8%8E%E5%8A%A1%E7%94%B3%E6%8A%A5%E5%BE%81%E6%9C%9F%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/555493/%E6%B7%B1%E5%9C%B3%E7%A8%8E%E5%8A%A1%E7%94%B3%E6%8A%A5%E5%BE%81%E6%9C%9F%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // -------------------------- 配置 --------------------------
    const TAX_DEADLINES = {
        1: 20, 2: 24, 3: 16, 4: 20, 5: 22, 6: 15,
        7: 15, 8: 17, 9: 15, 10: 26, 11: 16, 12: 15
    };
    
    // 设定的弹出时间点
    const SCHEDULE_TIMES = ["10:00", "11:30", "14:30", "16:00"];
    const POPUP_CLASS = 'sz-tax-notify-v16';
    const AUTO_CLOSE_MS = 30000;

    // -------------------------- 工具 --------------------------
    function getCurrentDeadline() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return {
            text: `${month}月1日-${month}月${TAX_DEADLINES[month]}日`,
            endDate: new Date(year, month - 1, TAX_DEADLINES[month]),
            month, year
        };
    }

    function getCountdownInfo() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const { endDate } = getCurrentDeadline();
        const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

        if (diff > 5) return { text: `${diff}天`, color: '#38bdf8', ani: '' };
        if (diff >= 0) {
            const colors = ['#ff0000', '#b91c1c', '#dc2626', '#ef4444', '#ea580c', '#f97316'];
            return { text: diff === 0 ? "今日截止" : `仅剩${diff}天`, color: colors[diff] || '#f97316', ani: 'sz-zoom 0.8s infinite' };
        }
        return { text: `逾期${Math.abs(diff)}天`, color: '#f43f5e', ani: '' };
    }

    // -------------------------- UI 注入 --------------------------
    function injectStyles() {
        if (document.getElementById('sz-tax-v16-css')) return;
        const style = document.createElement('style');
        style.id = 'sz-tax-v16-css';
        style.textContent = `
            @keyframes sz-zoom { 0%,100% {transform: scale(1);} 50% {transform: scale(1.08);} }
            @keyframes sz-prog { from {width: 100%;} to {width: 0%;} }
            .${POPUP_CLASS} {
                position: fixed; bottom: 40px; right: 40px;
                background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
                color: #fff; padding: 25px 30px; border-radius: 20px;
                box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
                z-index: 2147483647; width: 320px; cursor: pointer;
                font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
                border: 2px solid rgba(255,255,255,0.1);
            }
            .sz-v16-head { font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #f8fafc; border-left: 5px solid #38bdf8; padding-left: 12px; }
            .sz-v16-body { display: flex; justify-content: space-between; align-items: center; }
            .sz-v16-label { font-size: 14px; color: #94a3b8; margin-bottom: 5px; }
            .sz-v16-date { font-size: 18px; color: #e2e8f0; font-weight: bold; }
            .sz-v16-count { font-size: 38px; font-weight: 900; line-height: 1; }
            .sz-v16-prog-wrap { position: absolute; bottom: 0; left: 0; width: 100%; height: 6px; background: rgba(255,255,255,0.05); }
            .sz-v16-prog-bar { height: 100%; background: #00f2fe; width: 100%; animation: sz-prog ${AUTO_CLOSE_MS}ms linear forwards; }
            .sz-v16-foot { margin-top: 20px; font-size: 12px; color: #64748b; text-align: right; }
        `;
        document.head.appendChild(style);
    }

    function showPopup() {
        // 如果页面已经有弹窗，先关掉
        const old = document.querySelector(`.${POPUP_CLASS}`);
        if (old) old.remove();
        
        injectStyles();
        const deadline = getCurrentDeadline();
        const count = getCountdownInfo();

        const popup = document.createElement('div');
        popup.className = POPUP_CLASS;
        popup.innerHTML = `
            <div class="sz-v16-head">深圳税务申报提醒</div>
            <div class="sz-v16-body">
                <div>
                    <div class="sz-v16-label">申报期限</div>
                    <div class="sz-v16-date">${deadline.text}</div>
                </div>
                <div style="text-align: right;">
                    <div class="sz-v16-label">距离截止</div>
                    <div class="sz-v16-count" style="color:${count.color}; animation:${count.ani}">${count.text}</div>
                </div>
            </div>
            <div class="sz-v16-foot">30秒后消失 | 点击任意处关闭</div>
            <div class="sz-v16-prog-wrap"><div class="sz-v16-prog-bar"></div></div>
        `;
        document.body.appendChild(popup);
        popup.onclick = () => popup.remove();
        setTimeout(() => popup.remove(), AUTO_CLOSE_MS);
    }

    // -------------------------- 核心定时逻辑 --------------------------
    function checkTime() {
        const now = new Date();
        const day = now.getDay();
        // 仅周一至周五执行
        if (day === 0 || day === 6) return;

        const currentTimeStr = now.getHours().toString().padStart(2, '0') + ":" + 
                               now.getMinutes().toString().padStart(2, '0');

        // 如果当前时间在设定的点位中
        if (SCHEDULE_TIMES.includes(currentTimeStr)) {
            const storageKey = `sz_tax_fired_${currentTimeStr}_${now.getDate()}`;
            // 确保在这个时间点的这一分钟内，只弹窗一次（防止刷新页面重复弹出）
            if (!sessionStorage.getItem(storageKey)) {
                showPopup();
                sessionStorage.setItem(storageKey, "true");
            }
        }
    }

    // 初始化：每分钟检查一次时间
    setInterval(checkTime, 60000);
    // 启动时检查一次（如果正好在那个点打开网页也会弹）
    checkTime();

    // 快捷键支持
    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'l') showPopup();
    });

    console.log("🚀 深圳税务提醒 v16.0 运行中：仅在 10:00, 11:30, 14:30, 16:00 弹出");
})();