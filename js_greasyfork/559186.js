// ==UserScript==
// @name         52pojie 自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  吾爱破解论坛自动签到脚本
// @author       You
// @match        *://www.52pojie.cn/*
// @match        *://52pojie.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @connect      52pojie.cn
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559186/52pojie%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559186/52pojie%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SIGN_URL = 'https://www.52pojie.cn/home.php?mod=task&do=apply&id=2';
    const TASK_URL = 'https://www.52pojie.cn/home.php?mod=task&do=view&id=2';

    // 获取今天的日期字符串
    function getTodayStr() {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    // 检查今天是否已签到
    function hasSignedToday() {
        const lastSign = GM_getValue('lastSignDate', '');
        return lastSign === getTodayStr();
    }

    // 记录签到日期
    function recordSign() {
        GM_setValue('lastSignDate', getTodayStr());
    }

    // 显示通知
    function showNotification(title, text) {
        GM_notification({
            title: title,
            text: text,
            timeout: 5000
        });
    }

    // 在页面显示提示
    function showPageTip(message, isSuccess) {
        const tip = document.createElement('div');
        tip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${isSuccess ? 'linear-gradient(135deg, #11998e, #38ef7d)' : 'linear-gradient(135deg, #eb3349, #f45c43)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 999999;
            font-size: 14px;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        tip.textContent = message;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(tip);

        setTimeout(() => {
            tip.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => tip.remove(), 300);
        }, 3000);
    }

    // 执行签到
    function doSign() {
        console.log('[52pojie签到] 开始签到...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: SIGN_URL,
            onload: function(response) {
                const html = response.responseText;

                if (html.includes('签到成功') || html.includes('恭喜')) {
                    console.log('[52pojie签到] 签到成功！');
                    showPageTip('✅ 52pojie 签到成功！', true);
                    showNotification('52pojie 签到', '签到成功！');
                    recordSign();
                } else if (html.includes('已经') || html.includes('已完成') || html.includes('已申请')) {
                    console.log('[52pojie签到] 今日已签到');
                    showPageTip('ℹ️ 今日已签到过了', true);
                    recordSign();
                } else if (html.includes('登录') || html.includes('您需要先登录')) {
                    console.log('[52pojie签到] 未登录');
                    showPageTip('❌ 请先登录账号！', false);
                } else {
                    console.log('[52pojie签到] 签到结果未知', html.substring(0, 500));
                    showPageTip('⚠️ 签到状态未知，请检查', false);
                }
            },
            onerror: function(error) {
                console.error('[52pojie签到] 签到请求失败', error);
                showPageTip('❌ 签到请求失败！', false);
            }
        });
    }

    // 检查任务状态
    function checkTaskStatus() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: TASK_URL,
            onload: function(response) {
                const html = response.responseText;
                if (html.includes('每日签到') && !html.includes('已完成')) {
                    doSign();
                } else if (html.includes('已完成')) {
                    console.log('[52pojie签到] 今日任务已完成');
                    recordSign();
                }
            }
        });
    }

    // 手动签到命令
    GM_registerMenuCommand('🖊️ 立即签到', function() {
        doSign();
    });

    // 查看签到状态
    GM_registerMenuCommand('📋 查看签到状态', function() {
        const lastSign = GM_getValue('lastSignDate', '从未签到');
        const today = getTodayStr();
        const status = lastSign === today ? '今日已签到 ✅' : '今日未签到 ❌';
        alert(`上次签到日期: ${lastSign}\n今日日期: ${today}\n状态: ${status}`);
    });

    // 主逻辑：页面加载后自动签到
    function main() {
        // 检查是否已登录（通过检查页面上的用户信息）
        const isLoggedIn = document.querySelector('#um') ||
                          document.querySelector('.vwmy') ||
                          document.querySelector('[title="访问我的空间"]');

        if (!isLoggedIn) {
            console.log('[52pojie签到] 未检测到登录状态');
            return;
        }

        // 如果今天没签到，则自动签到
        if (!hasSignedToday()) {
            console.log('[52pojie签到] 准备自动签到...');
            // 延迟2秒执行，避免页面未完全加载
            setTimeout(doSign, 2000);
        } else {
            console.log('[52pojie签到] 今日已签到，跳过');
        }
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

})();