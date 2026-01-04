// ==UserScript==
// @name         CCAA快速学习
// @namespace    https://px.ccaa.org.cn
// @version      1.1
// @description  ccaa继续学习下方的 科教兴国 按钮
// @author       yangfugui
// @match        *://px.ccaa.org.cn/onlineedu/learn/showLearn*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552853/CCAA%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/552853/CCAA%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';


    //添加按钮
    function addDynamicStudyButton() {
        var trdoms = $("table a:contains('继续学习')");
        trdoms.each((index, item) => {
            const $link = $(item);
            const href = $link.attr('href');
            const newhref = href.replace("startStudy", "fuGuiStudy")
            $link.after(`<br /><br /><a href="` + newhref + `" class='processed'>科教兴国</a>`);
        });
    };

    window.fuGuiStudy = function (courseId, lessonId) {
        const postData = `learnId=&courseId=${courseId}&lessonId=${lessonId}`;

        const cacheKey = postData;
        let configlearnId = localStorage.getItem(cacheKey);

        if (configlearnId === null) {
            // 发送请求
            $.post(
                'https://px.ccaa.org.cn/onlineedu/course/getLearn.htm',
                postData,
                function (response, status, xhr) {
                    console.log('响应:', response.learnId);
                    localStorage.setItem(cacheKey, response.learnId);
                    localStorage.setItem(cacheKey + "_StartTime", Date.now());
                    localStorage.setItem(cacheKey + "_videoStatus", 200);
                    localStorage.setItem(cacheKey + "_status", "0");
                }
            ).fail(function (xhr, status, error) {
                console.error('❌ 请求失败:', error, xhr.responseText);
            });
        } else {

            //更新进度
            const params = {
                videoStatus: localStorage.getItem(cacheKey + "_videoStatus"),
                status: localStorage.getItem(cacheKey + "_status"),
                learnId: configlearnId,
                startTime: localStorage.getItem(cacheKey + "_StartTime"),
                finishedTime: Date.now(),
                duration: '1380.44',
                courseId: courseId,
                lessonId: lessonId
            };
            $.post(
                'https://px.ccaa.org.cn/onlineedu/course/updateLearn.htm',
                params,
                function (response, status, xhr) {
                    localStorage.setItem(cacheKey + "_videoStatus", parseInt(localStorage.getItem(cacheKey + "_videoStatus")) + 1000);

                    if (response.status == "200") {
                        localStorage.setItem(cacheKey + "_status", "200");
                    }
                    location.reload();
                }
            ).fail(function (xhr, status, error) {
                console.error('❌ 请求失败:', error, xhr.responseText);
            });

        }
    };

    // 初始执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDynamicStudyButton);
    } else {
        addDynamicStudyButton();
    }


})();