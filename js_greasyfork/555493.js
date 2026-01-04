// ==UserScript==
// @name         深圳税务申报征期提醒
// @namespace    http://tampermonkey.net/
// @version      12.0
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

    // -------------------------- 基础配置 --------------------------
    const TAX_DEADLINES = {
        1: 20, 2: 24, 3: 16, 4: 20, 5: 22, 6: 15,
        7: 15, 8: 17, 9: 15, 10: 26, 11: 16, 12: 15
    };
    const CLOSE_REMINDER_KEY = 'sz_tax_reminder_disabled';
    const ALERT_DAYS = 5;
    const POPUP_CLASS = 'sz-tax-notify'; // 弹窗唯一类名
    let activePopupId = null; // 记录当前活跃弹窗ID（避免叠加）
    let timerMap = new Map(); // 定时器管理（仅存当前活跃弹窗）

    // -------------------------- 核心工具函数 --------------------------
    function getCurrentTaxDeadline() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const endDay = TAX_DEADLINES[month];
        return {
            text: `${month}月1日-${month}月${endDay}日`,
            endDate: new Date(year, month - 1, endDay),
            year: year,
            month: month
        };
    }

    function getDaysUntilDeadline() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const { endDate } = getCurrentTaxDeadline();
        const deadline = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        const timeDiff = deadline - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff > ALERT_DAYS) return { text: `${daysDiff}天`, color: '#38bdf8', animation: '' };
        if (daysDiff === 5) return { text: `仅剩${daysDiff}天❗`, color: '#f97316', animation: 'blink 2s infinite' };
        if (daysDiff === 4) return { text: `仅剩${daysDiff}天❗❗`, color: '#ea580c', animation: 'blink 1.5s infinite' };
        if (daysDiff === 3) return { text: `仅剩${daysDiff}天❗❗❗`, color: '#ef4444', animation: 'blink 1.2s infinite' };
        if (daysDiff === 2) return { text: `仅剩${daysDiff}天🚨`, color: '#dc2626', animation: 'blink 1s infinite' };
        if (daysDiff === 1) return { text: `最后${daysDiff}天🚨🚨`, color: '#b91c1c', animation: 'blink 0.8s infinite' };
        if (daysDiff === 0) return { text: '今日截止🚨🚨🚨', color: '#ff0000', animation: 'blink 0.5s infinite' };
        return { text: `已逾期${Math.abs(daysDiff)}天❌`, color: '#881337', animation: 'blink 0.5s infinite' };
    }

    function isCurrentMonthDisabled() {
        const { year, month } = getCurrentTaxDeadline();
        return localStorage.getItem(`${CLOSE_REMINDER_KEY}_${year}_${month}`) === 'true';
    }

    function toggleCurrentMonthReminder() {
        const { year, month, text } = getCurrentTaxDeadline();
        const storageKey = `${CLOSE_REMINDER_KEY}_${year}_${month}`;
        const isDisabled = isCurrentMonthDisabled();

        if (isDisabled) {
            localStorage.removeItem(storageKey);
            showTemporaryTip('当月自动提醒已开启，恢复30分钟一次弹窗');
            console.log(`✅ 开启${year}年${month}月自动提醒（${text}）`);
            scheduleNotifications();
        } else {
            localStorage.setItem(storageKey, 'true');
            showTemporaryTip('当月自动提醒已关闭，Alt+L可手动查看');
            console.log(`❌ 关闭${year}年${month}月自动提醒（${text}）`);
            forceRemoveAllPopups(); // 强制关闭所有弹窗
        }
    }

    function showTemporaryTip(text) {
        const tip = document.createElement('div');
        tip.style.cssText = `
            position: fixed; bottom: 80px; right: 20px;
            background: #334155; color: #fff; padding: 8px 16px;
            border-radius: 6px; font-size: 13px; z-index: 9999999;
            opacity: 0; transition: opacity 0.3s ease;
        `;
        tip.textContent = text;
        document.body.appendChild(tip);
        setTimeout(() => tip.style.opacity = 1, 100);
        setTimeout(() => {
            tip.style.opacity = 0;
            setTimeout(() => tip.remove(), 300);
        }, 2000);
    }

    function isNeedSleep() {
        if (isCurrentMonthDisabled()) return true;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const { endDate, month: taxMonth } = getCurrentTaxDeadline();
        const deadline = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return today > deadline && now.getMonth() + 1 === taxMonth;
    }

    function getNextWakeupTime() {
        const now = new Date();
        let nextMonth = now.getMonth() + 1;
        let nextYear = now.getFullYear();
        if (nextMonth > 11) { nextMonth = 0; nextYear++; }
        return new Date(nextYear, nextMonth, 1, 9, 0, 0, 0);
    }

    // -------------------------- 弹窗核心修复（关键！） --------------------------
    // 强制移除所有弹窗（无动画延迟，彻底清理）
    function forceRemoveAllPopups() {
        // 清理所有定时器
        timerMap.forEach(timer => clearTimeout(timer));
        timerMap.clear();
        activePopupId = null;

        // 移除所有弹窗DOM（不等待动画，立即清理）
        const popups = document.querySelectorAll(`.${POPUP_CLASS}`);
        popups.forEach(popup => {
            // 解绑所有事件
            popup.removeEventListener('mouseenter', handleMouseEnter);
            popup.removeEventListener('mouseleave', handleMouseLeave);
            popup.removeEventListener('click', handlePopupClick);
            // 立即移除，不等待过渡动画
            popup.style.opacity = 0;
            popup.style.transform = 'translateY(30px)';
            popup.remove(); // 直接移除DOM，避免残留
        });
    }

    // 点击弹窗：立即消失（无延迟）
    function handlePopupClick(e) {
        e.stopPropagation();
        const popup = e.currentTarget;
        const popupId = popup.dataset.popupId;

        // 只处理当前活跃弹窗
        if (popupId !== activePopupId) return;

        // 立即清理
        clearTimeout(timerMap.get(popupId));
        timerMap.delete(popupId);
        activePopupId = null;

        // 立即移除DOM，不等待动画
        popup.style.opacity = 0;
        popup.style.transform = 'translateY(30px)';
        setTimeout(() => popup.remove(), 100); // 短延迟保证视觉效果，不影响操作
    }

    // 鼠标悬停：5秒后立即消失
    function handleMouseEnter(e) {
        const popup = e.currentTarget;
        const popupId = popup.dataset.popupId;
        if (popupId !== activePopupId) return;

        // 清除之前的定时器
        if (timerMap.has(popupId)) {
            clearTimeout(timerMap.get(popupId));
        }

        // 5秒后强制移除
        const hoverTimer = setTimeout(() => {
            if (document.contains(popup) && popupId === activePopupId) {
                handlePopupClick(e); // 复用点击的立即移除逻辑
            }
        }, 5000);
        timerMap.set(popupId, hoverTimer);
    }

    // 鼠标离开：恢复3分钟倒计时
    function handleMouseLeave(e) {
        const popup = e.currentTarget;
        const popupId = popup.dataset.popupId;
        if (popupId !== activePopupId) return;

        // 清除悬停定时器
        if (timerMap.has(popupId)) {
            clearTimeout(timerMap.get(popupId));
        }

        // 3分钟后强制移除
        const mainTimer = setTimeout(() => {
            if (document.contains(popup) && popupId === activePopupId) {
                handlePopupClick(e);
            }
        }, 180000);
        timerMap.set(popupId, mainTimer);
    }

    // 创建单个弹窗（确保唯一）
    function createPopup() {
        const { text: deadlineText } = getCurrentTaxDeadline();
        const { text: countDownText, color: countDownColor, animation } = getDaysUntilDeadline();
        const isDisabled = isCurrentMonthDisabled();
        const popupId = `popup_${Date.now()}`; // 唯一ID

        const popup = document.createElement('div');
        popup.className = POPUP_CLASS;
        popup.dataset.popupId = popupId;
        popup.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #1e40af; color: #fff; padding: 18px 22px;
            border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            z-index: 9999999; max-width: 340px;
            font-size: 14px; line-height: 1.8;
            transition: opacity 0.2s ease, transform 0.2s ease; // 缩短动画时间
            transform: translateY(0); opacity: 1;
            pointer-events: auto; cursor: pointer;
        `;

        popup.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 12px; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${countDownColor}" stroke-width="2"/>
                        <path d="M12 6V12L16 14" stroke="${countDownColor}" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <strong style="font-size: 17px;">深圳税务申报提醒</strong>
                </div>
                ${isDisabled ? '<span style="color: #facc15; font-size: 12px;">（自动提醒已关闭）</span>' : ''}
            </div>
            <p>申报期限：<span style="color: #38bdf8; font-weight: 600; font-size: 15px;">${deadlineText}</span></p>
            <p>距离申报截止：<span style="color: ${countDownColor}; font-weight: 800; font-size: 20px; animation: ${animation}; margin-left: 4px;">${countDownText}</span></p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                <p style="font-size: 11px; color: #bfdbfe;">快捷键：Alt+L触发 | Alt+T切换 | 点击立即关闭</p>
                ${isDisabled ? '<span style="color: #a3e635; font-size: 11px;">✅ 已完成报税</span>' : ''}
            </div>
        `;

        // 全局唯一闪烁样式
        if (!document.getElementById('sz-tax-blink-style')) {
            const style = document.createElement('style');
            style.id = 'sz-tax-blink-style';
            style.textContent = `
                @keyframes blink {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        return { popup, popupId };
    }

    // 显示弹窗（确保同一时间只有一个）
    function showPopup() {
        // 第一步：强制清理所有旧弹窗和定时器（关键！避免叠加）
        forceRemoveAllPopups();

        // 第二步：创建新弹窗
        const { popup, popupId } = createPopup();
        activePopupId = popupId;
        document.body.appendChild(popup);

        // 第三步：绑定事件（仅绑定当前弹窗）
        popup.addEventListener('mouseenter', handleMouseEnter);
        popup.addEventListener('mouseleave', handleMouseLeave);
        popup.addEventListener('click', handlePopupClick);

        // 第四步：初始化3分钟定时器
        const mainTimer = setTimeout(() => {
            if (document.contains(popup) && popupId === activePopupId) {
                handlePopupClick({ currentTarget: popup });
            }
        }, 180000);
        timerMap.set(popupId, mainTimer);

        // 安全兜底：10分钟强制清理（防止极端情况）
        setTimeout(() => {
            if (document.contains(popup) && popupId === activePopupId) {
                handlePopupClick({ currentTarget: popup });
            }
        }, 600000);
    }

    // -------------------------- 定时任务与快捷键 --------------------------
    let scheduleTimer = null;

    function scheduleNotifications() {
        if (scheduleTimer) clearTimeout(scheduleTimer);

        const now = new Date();
        if (isNeedSleep()) {
            const wakeupTime = getNextWakeupTime();
            const sleepDuration = wakeupTime - now;
            const reason = isCurrentMonthDisabled() ? '已关闭自动提醒' : '超征期';
            console.log(`💤 ${reason}，休眠至${wakeupTime.toLocaleString()}`);
            
            scheduleTimer = setTimeout(() => {
                console.log('⏰ 脚本唤醒');
                scheduleNotifications();
            }, sleepDuration);
            return;
        }

        // 计算下次提醒时间
        let nextRunTime = new Date(now);
        nextRunTime.setHours(9, 0, 0, 0);
        if (now > nextRunTime) {
            const minutesSince9 = (now.getHours() - 9) * 60 + now.getMinutes();
            const nextInterval = 30 - (minutesSince9 % 30);
            nextRunTime = new Date(now.getTime() + nextInterval * 60 * 1000);
        }

        const delay = nextRunTime - now;
        console.log(`📅 下次提醒：${nextRunTime.toLocaleString()}`);

        scheduleTimer = setTimeout(function run() {
            const currentTime = new Date();
            if (isNeedSleep()) {
                scheduleNotifications();
                return;
            }
            if (currentTime.getHours() >= 9 && currentTime.getHours() < 17) {
                showPopup();
            }
            scheduleTimer = setTimeout(run, 30 * 60 * 1000);
        }, delay);
    }

    // 快捷键统一处理
    function initShortcuts() {
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyDown);
    }

    function handleKeyDown(e) {
        // Alt+L：手动触发（强制清理旧弹窗）
        if (e.altKey && e.key.toLowerCase() === 'l') {
            showPopup();
            const status = isCurrentMonthDisabled() ? '（自动提醒已关闭）' : '';
            console.log(`🔔 手动触发成功${status}`);
        }

        // Alt+T：切换自动提醒
        if (e.altKey && e.key.toLowerCase() === 't') {
            toggleCurrentMonthReminder();
        }
    }

    // -------------------------- 页面卸载清理 --------------------------
    window.addEventListener('beforeunload', () => {
        forceRemoveAllPopups();
        if (scheduleTimer) clearTimeout(scheduleTimer);
        const blinkStyle = document.getElementById('sz-tax-blink-style');
        if (blinkStyle) blinkStyle.remove();
    });

    // -------------------------- 启动脚本 --------------------------
    console.log('🚀 深圳税务申报提醒（终极稳定版）启动');
    initShortcuts();
    scheduleNotifications();
})();