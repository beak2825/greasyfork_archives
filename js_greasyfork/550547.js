// ==UserScript==
// @name         贴吧自动签到
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击签到按钮
// @author       MarySue
// @match        *://tieba.baidu.com/f?*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/550547/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/550547/%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function autoSign() {
        // 查找所有可签到的按钮（根据类名和 title）
        const signBtn = document.querySelector('a.j_signbtn.j_cansign[title="签到"]');

        if (signBtn) {
            console.log('检测到可签到按钮，正在尝试点击...');
            // 触发点击事件
            signBtn.click();
            console.log('已点击签到按钮。');

            // 可选：稍等片刻后检查是否签到成功（比如 title 变了）
            setTimeout(() => {
                if (signBtn.title !== '签到') {
                    console.log('签到成功！当前状态：', signBtn.title);
                } else {
                    console.warn('签到未成功，可能需要手动操作。');
                }
            }, 1000);
        } else {
            // 检查是否已经签到
            const signedBtn = document.querySelector('a.j_signbtn:not(.j_cansign), a.j_signbtn[title="已签到"], a.j_signbtn[title*="完成"]');
            if (signedBtn) {
                console.log('今日已签到，无需重复操作。状态：', signedBtn.title || '无 title');
            } else {
                console.warn('未找到签到按钮，请确认页面已加载或结构是否变化。');
            }
        }
    }

    function refresher() {
        console.log('30分钟到，正在刷新页面...');
        window.location.reload(true); // 强制从服务器重新加载
    }

    // 页面加载完成后执行签到
    if (document.readyState === 'loading') {
        window.addEventListener('load', autoSign);
    } else {
        // 页面已加载，直接执行
        autoSign();
    }

    // 每30分钟刷新一次（可选，防止长时间挂机失效）
    setInterval(refresher, 30 * 60 * 1000);
})();