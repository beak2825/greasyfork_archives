// ==UserScript==
// @name         魔兽世界UI论坛自动签到
// @namespace    https://uiwow.com/
// @version      1.0
// @description  自动完成魔兽世界UI论坛(uiwow.com)的每日签到
// @author       YourName
// @match        *://uiwow.com/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/564371/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8CUI%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/564371/%E9%AD%94%E5%85%BD%E4%B8%96%E7%95%8CUI%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 心情按钮映射 (emot_1到emot_10)
    const moodMap = {
        1: '开心',
        2: '难过',
        3: '无聊',
        4: '郁闷',
        5: '擦汗',
        6: '大哭',
        7: '慵懒',
        8: '萌哒',
        9: '可爱',
        10: '无语'
    };

    // 主流程
    function startAutoSign() {
        const lastSignDate = GM_getValue('lastSignDate', '');
        const today = new Date().toDateString();

        if (lastSignDate === today) {
            console.log('今天已经签到过了');
            return;
        }

        console.log('开始自动签到流程');
        clickSignButton();
    }

    // 1. 点击主页面签到按钮
    function clickSignButton() {
        const signBtn = $('#dcsignin_tips');
        if (signBtn.length) {
            signBtn.click();
            console.log('已点击主签到按钮');
            waitForPopup();
        } else {
            console.log('未找到主签到按钮，可能已签到');
            checkAlreadySigned();
        }
    }

    // 2. 等待弹窗出现
    function waitForPopup() {
        let attempts = 0;
        const maxAttempts = 10;
        const checkInterval = 500; // 每0.5秒检查一次

        const popupChecker = setInterval(() => {
            attempts++;
            const popup = $('.mn:visible');

            if (popup.length || attempts >= maxAttempts) {
                clearInterval(popupChecker);

                if (popup.length) {
                    console.log('签到弹窗已加载');
                    selectMoodAndConfirm();
                } else {
                    console.log(`弹窗加载失败，尝试${attempts}次后未找到弹窗`);
                }
            }
        }, checkInterval);
    }

    // 3. 选择心情并确认
function selectMoodAndConfirm() {
    const randomMood = Math.floor(Math.random() * 10) + 1;
    const moodId = `emot_${randomMood}`;
    const moodBtn = $(`li img[id="${moodId}"]`).parent(); // 选择包含图片的 <li> 元素
    const confirmBtn = $('button[name="signpn"].pn.pnc'); // 确认按钮

    if (moodBtn.length && confirmBtn.length) {
        // 触发点击事件
        moodBtn.click();
        console.log(`已选择心情: ${moodMap[randomMood]}`);

        // 等待0.5秒后点击确认
        setTimeout(() => {
            confirmBtn.click();
            console.log('已点击确认按钮');

            // 标记今天已签到
            GM_setValue('lastSignDate', new Date().toDateString());

            // 显示通知
            GM_notification({
                title: '自动签到成功',
                text: `签到完成，心情: ${moodMap[randomMood]}`,
                timeout: 3000
            });
        }, 500);
    } else {
        console.log('未找到心情或确认按钮');
        if (!moodBtn.length) console.log(`未找到心情按钮: ${moodId}`);
        if (!confirmBtn.length) console.log('未找到确认按钮');
    }
}

    // 检查是否已经签到
    function checkAlreadySigned() {
        const signedText = $('div:contains("您今天已经签到"), span:contains("已签到")');
        if (signedText.length) {
            console.log('今天已经签到过了');
            GM_setValue('lastSignDate', new Date().toDateString());
        }
    }

    // 页面加载后启动
    $(document).ready(function() {
        setTimeout(startAutoSign, 3000);
    });

    // 每30分钟检查一次
    setInterval(startAutoSign, 1800000);
})(jQuery.noConflict());