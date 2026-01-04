// ==UserScript==
// @name         顺德区教师在线研修(1倍速)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  登录，打开学习页面，将自动学习，每章节学习完后自动跳到下一个，因2倍速会受网络影响，发报1倍速。
// @author       化名
// @match        https://zy.jsyx.sdedu.net/*
// @icon         https://zy.jsyx.sdedu.net/
// @grant        none
 
// @license      暂无
// @downloadURL https://update.greasyfork.org/scripts/556399/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%281%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556399/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%281%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*********************************
     *  解决 play() 被中断的关键机制
     *********************************/
    let isTryingPlay = false;

    function safePlay(video) {
        if (!video) return;

        if (isTryingPlay) return;  // 防止短时间内重复调用导致中断
        isTryingPlay = true;

        // mute 可保证浏览器允许自动播放
        video.muted = true;

        setTimeout(() => {
            video.play()
                .catch(err => {
                    console.log("播放失败但已忽略：", err.message);
                })
                .finally(() => {
                    isTryingPlay = false;
                });
        }, 50);
    }

    /*********************************
     *            自动跳章节
     *********************************/
    function checkNext() {
        const p = $(".g-study-prompt p");

        if (p.length === 0) return;

        // 完成观看
        if (p[0].innerText.includes("您已完成观看")) {
            $("#studySelectAct a")[1]?.click();
            return;
        }

        const spans = $(".g-study-prompt p span");
        if (spans.length >= 2) {
            let timer1 = parseInt(spans[0].innerText);
            let timer2 = parseInt(spans[1].innerText);

            if (timer1 <= timer2) {
                $("#studySelectAct a")[1]?.click();
            }
        }
    }

    /*********************************
     *            自动答题
     *********************************/
    function autoAnswer() {
        let options = $("input[name='response']");
        if (options.length > 0) {
            console.log("题目出现，自动作答中…");

            let y = options.length;
            let index = Math.floor(Math.random() * y);
            options[index].checked = true;

            $('.m-common-btn .m-reExam-btn a button').click();
        }
    }

    /*********************************
     *              主循环
     *********************************/
    $(function () {
        console.log("自动学习脚本已启动（稳定版）");

        let timer = setInterval(() => {
            let video = $('video')[0];

            // 自动播放防止中断
            safePlay(video);

            // 检查章节
            checkNext();

            // 自动答题
            autoAnswer();

            console.log('working...');
        }, 1000);
    });

})();
