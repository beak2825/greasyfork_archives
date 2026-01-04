// ==UserScript==
// @name         顺德区教师在线研修（满时长后随机1-3分钟跳下一节）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动播放 + 满时长后随机60-180秒再跳下一节 + 随机答题（极致防检测）
// @author       化名
// @match        https://zy.jsyx.sdedu.net/*
// @grant        none
// @run-at       document-end
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/556534/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%EF%BC%88%E6%BB%A1%E6%97%B6%E9%95%BF%E5%90%8E%E9%9A%8F%E6%9C%BA1-3%E5%88%86%E9%92%9F%E8%B7%B3%E4%B8%8B%E4%B8%80%E8%8A%82%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556534/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%EF%BC%88%E6%BB%A1%E6%97%B6%E9%95%BF%E5%90%8E%E9%9A%8F%E6%9C%BA1-3%E5%88%86%E9%92%9F%E8%B7%B3%E4%B8%8B%E4%B8%80%E8%8A%82%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 防检测：修改平台心跳间隔
    setTimeout(() => {
        if (typeof window.interval !== 'undefined') {
            window.interval = 9;
            console.log('脚本：已将视频更新间隔强制设置为 9 秒（防检测）');
        }
    }, 1000);

    let canJumpNext = true;  // 防止重复触发

    function waitForjQuery(callback) {
        if (window.jQuery) return callback();
        setTimeout(() => waitForjQuery(callback), 200);
    }

    waitForjQuery(function () {
        const $ = window.jQuery;

        function play() {
            // 自动播放视频
            if ($('video').length > 0) {
                let v = $('video')[0];
                v.muted = true;
                v.play();
                // v.playbackRate = 2;  // 需要更快可取消注释
            }

            // 作业页面自动暂停脚本
            if ($(".g-study-prompt p").text().includes("作业")) {
                console.warn('检测到作业页面，脚本已暂停，请手动完成后再继续');
                return;
            }

            const nextBtn = $("#studySelectAct a").eq(1)[0];
            if (!nextBtn) return;

            const promptText = $(".g-study-prompt p").text() || "";
            const timer1 = parseInt($(".g-study-prompt p span").eq(0).text()) || 0;
            const timer2 = parseInt($(".g-study-prompt p span").eq(1).text()) || 0;

            // 判断是否已完成本节
            const shouldJump = promptText.includes("您已完成观看") || (timer1 >= timer2 && timer2 > 0);

            if (shouldJump && canJumpNext) {
                if (nextBtn.className.includes("disable")) {
                    console.log('全部课程已学完，脚本停止运行');
                    return;
                }

                canJumpNext = false;  // 锁定，防止重复点击

                // 随机生成 60~180 秒之间的延迟（1~3分钟）
                const randomDelay = Math.floor(Math.random() * 120000) + 60000; // 60000~180000 ms
                const delaySeconds = Math.round(randomDelay / 1000);

                console.log(`本节已学完，将在 ${delaySeconds} 秒后自动跳转下一节（随机延迟防检测）`);

                setTimeout(() => {
                    nextBtn.click();
                    console.log(`延迟 ${delaySeconds} 秒已到，已自动跳转到下一节`);
                    canJumpNext = true;  // 解锁，允许下一节继续
                }, randomDelay);
            }
        }

        // 自动随机答题
        function autoAnswer() {
            if ($("input[name='response']").length === 0) return;
            if ($("input[name='response']:checked").length === 0) {
                const idx = Math.floor(Math.random() * $("input[name='response']").length);
                $("input[name='response']").eq(idx).prop("checked", true);
                console.log('自动随机答题：选中第 ' + (idx + 1) + ' 个选项');

                setTimeout(() => {
                    const btn = $("button:contains('提交'), button:contains('确定'), .m-reExam-btn button");
                    if (btn.length) {
                        btn[0].click();
                        console.log('答题已提交');
                    }
                }, 800);
            }
        }

        // 主循环
        setInterval(() => {
            play();
            autoAnswer();
        }, 2000);

        console.log('顺德教师研修脚本已启动：满时长后将在 1~3 分钟内随机跳转下一节（极致防封）');
    });

})();