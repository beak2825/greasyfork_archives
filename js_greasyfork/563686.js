// ==UserScript==
// @name         广东省教师公需课（2026）
// @namespace    http://tampermonkey.net/
// @version      202601.01
// @description  广东教师2026年专用
// @author       Kaylerris@x
// @match        https://jsxx.gds.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gds.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563686/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882026%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563686/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BC%882026%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var interval = 1000;
    var event = new MouseEvent("mousemove", {
        "view": window,
        "bubbles": true,
        "cancelable": true
    });
    // 状态提示框（Windows 11 风格，右下角）
    var statusPopup = null;
    function showPopupMessage(message) {
        // 复用已有的提示框，避免重复创建
        if (!statusPopup) {
            statusPopup = document.createElement('div');
            statusPopup.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(45, 45, 45, 0.85);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 12px 16px;
                border-radius: 8px;
                color: #fff;
                font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 99999;
                opacity: 0.9;
                transition: opacity 0.2s ease;
                max-width: 280px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
            document.body.appendChild(statusPopup);
        }
        statusPopup.innerText = message;
        statusPopup.style.display = 'block';
    }
    // 考核
    function exam(){
        console.log("开始答题...")
        var grade = document.getElementsByClassName("m-studyTest-grade");
        if(grade.length > 0){
            grade = parseInt(grade[0].getElementsByTagName("strong")[0].innerText);
            if(grade >= 100){
                var msg = `你当前已经是${grade}分！！！`;
                console.log(msg);
                showPopupMessage(msg, 3000);
                return;
            }
        }
        // 答案（使用你提供的答案，1-30）
        // 1:C 2:D 3:B 4:B 5:B 6:B 7:C 8:B 9:C 10:B
        // 11:ABC 12:ABCD 13:ABD 14:ABC 15:ABCD 16:ABC 17:AB 18:ACD 19:AB 20:ABCD
        // 21:A 22:A 23:B 24:B 25:B 26:A 27:A 28:A 29:A 30:A
        var answer1 = ["C","D","B","B","B","B","C","B","C","B","ABC","ABCD","ABD","ABC","ABCD","ABC","AB","ACD","ABC","ABCD","A","A","B","B","B","B","A","A","A","A"];
        // 同一套答案，也用于另一门课程（若需要分别配置，可修改此处）
        var answer2 = ["C","D","B","B","B","B","C","B","C","B","ABC","ABCD","ABD","ABC","ABCD","ABC","AB","ACD","ABC","ABCD","A","A","B","B","B","B","A","A","A","A"];
        // 将答案ABCD转换成数组
        var map = {"a": 0, "A": 0, "b": 1, "B": 1, "c": 2, "C": 2, "d":3, "D": 3, "e": 4, "E": 4};
        function abcd_to_index(answer_in){
            var answer_out = [];
            for(var i = 0; i < answer_in.length; i++){
                answer_out[i] = []
                var s = answer_in[i];
                for (var j = 0; j < s.length; j++) {
                    answer_out[i].push(map[s[j]]);
                }
            }
            return answer_out;
        }
        // 判断启用哪套答案
        var answer = null;
        var course = document.getElementById("courseCatalog");
        if(course.textContent.includes("县域经济发展与乡村振兴")){
            answer = abcd_to_index(answer1);
        } else {
            answer = abcd_to_index(answer2);
        }
        var btn = document.getElementsByClassName("btn u-main-btn");
        if(btn[0].innerText == "重新测验"){
            btn[0].click();
        } else {
            var ql = document.getElementsByClassName("m-topic-item");
            for(var i = 0; i < ql.length; i++){
                var q = ql[i]
                var c = q.getElementsByClassName("m-radio-tick");
                if(c.length <= 0){
                    c = q.getElementsByClassName("m-checkbox-tick");
                }
                // 选答案
                var a = answer[i]
                for(var j = 0; j < a.length; j++){
                    c[a[j]].click();
                }
            }
            // 交卷
            btn[0].click();
            finishTest();
        }
    }
    function main(){
        // 当前播放
        var current_index = 0;
        var txt = document.getElementsByClassName("txt");
        for(let i = 0; i < txt.length; i++){
            if(txt[txt.length - 1].innerText.includes(txt[i].innerText)){
                console.log(txt[i].innerText, txt[txt.length - 1].innerText);
                current_index = i;
                break;
            }
        }
        // 需要观看时长
        var s = document.getElementsByClassName("g-study-prompt");
        var need_time = -1;
        if(s && s[0] && s[0].firstElementChild && s[0].firstElementChild.firstElementChild){
            need_time = s[0].firstElementChild.firstElementChild.textContent;
        }
        need_time = parseInt(need_time);
        // 每秒检测
        function tick(){
            if(current_index == (txt.length - 2)){
                exam();
                return;
            }
            var v = document.getElementsByTagName("video")[0];
            v.play();
            // 已观看时长
            var vt = document.getElementById("viewTimeTxt");
            if(vt){
                vt = parseInt(vt.textContent);
            }
            var msg = `挂机中！已观看时长: ${vt}/${need_time}`;
            console.log(msg);
            showPopupMessage(msg, interval);
            // 模拟用户操作，防止检测挂机
            v.dispatchEvent(event);
            // 视频中弹出的答题
            autoAnswerPopupQuestion();
            // 切换视频
            if (vt === null || (vt >= need_time)){
                console.log("视频已经看完，切换下一个...");
                txt[current_index + 1].click();
                current_index++;
            }
            setTimeout(tick, interval);
        }
        tick();
    }
    // 记录是非题的尝试状态
    var tfQuestionAttempts = {};
    // 记录已提交的题目，避免重复提交
    var submittedQuestions = {};

    // 自动回答视频中弹出的题目
    function autoAnswerPopupQuestion() {
        var questionDiv = document.getElementById("questionDiv");
        if (!questionDiv) return;

        var titleEl = questionDiv.querySelector('.title');
        if (!titleEl) return;

        var titleText = titleEl.innerText || titleEl.textContent;
        var options = questionDiv.querySelectorAll('.m-question-lst li');

        if (options.length === 0) return;

        // 生成题目唯一标识
        var questionKey = titleText.substring(0, 50);

        // 检查是否显示答案错误提示（红色背景、错误图标等）
        var questionContent = questionDiv.innerText || questionDiv.textContent;
        var hasError = questionContent.includes('答错') ||
                       questionContent.includes('回答错误') ||
                       questionContent.includes('不正确') ||
                       questionDiv.querySelector('.wrong, .error, .fail, [class*="wrong"], [class*="error"]');

        // 检查当前选中的是哪个选项
        var currentSelectedIndex = -1;
        options.forEach(function(opt, index) {
            if (opt.classList.contains('active') || opt.classList.contains('selected')) {
                currentSelectedIndex = index;
            }
        });

        // 如果检测到错误，且当前选的是"对"(index 0)，记录需要换答案
        if (hasError && titleText.includes('[是非题]') && currentSelectedIndex === 0) {
            console.log("检测到答案错误，当前选的是'对'，需要改选'错'");
            tfQuestionAttempts[questionKey] = 1;
            submittedQuestions[questionKey] = false; // 重置提交状态，允许重新提交
        }

        // 如果这道题已经提交过且没有错误，跳过
        if (submittedQuestions[questionKey] && !hasError) {
            return;
        }

        console.log("检测到弹出题目:", titleText);

        // 判断题：根据题目中的提示选择
        if (titleText.includes('[是非题]')) {
            var correctIndex = 0; // 默认选"对"

            // 检查是否已经尝试过"对"失败，需要改选"错"
            if (tfQuestionAttempts[questionKey] && tfQuestionAttempts[questionKey] > 0) {
                correctIndex = 1; // 上次选"对"错了，这次选"错"
                console.log("是非题重试，改选: 错");
            } else if (titleText.includes('√') || titleText.includes('正确')) {
                correctIndex = 0; // 选"对"
            } else if (titleText.includes('×')) {
                correctIndex = 1; // 选"错"
            }

            var tick = options[correctIndex]?.querySelector('.m-radio-tick, .m-checkbox-tick');
            if (tick) {
                tick.click();
                console.log("是非题，选择:", correctIndex === 0 ? "对" : "错");
            }
        } else {
            // 选择题：查找选项中包含正确答案标记的
            var answered = false;
            options.forEach(function(opt, index) {
                var optText = opt.innerText || opt.textContent;
                // 如果选项中有正确标记
                if (optText.includes('√') || optText.includes('正确')) {
                    var tick = opt.querySelector('.m-radio-tick, .m-checkbox-tick');
                    if (tick) {
                        tick.click();
                        console.log("选择题，选择选项", index + 1);
                        answered = true;
                    }
                }
            });
            // 如果没找到标记，默认选第一个
            if (!answered) {
                var tick = options[0]?.querySelector('.m-radio-tick, .m-checkbox-tick');
                if (tick) {
                    tick.click();
                    console.log("选择题，默认选择第一个");
                }
            }
        }

        // 标记这道题已提交
        submittedQuestions[questionKey] = true;

        // 点击提交按钮
        setTimeout(function() {
            var submitBtn = questionDiv.querySelector('.btn.u-main-btn') ||
                           document.querySelector('.g-study-dt .btn.u-main-btn');
            if (submitBtn) {
                submitBtn.click();
                console.log("已提交答案");
            }

            // 提交后检查是否有错误，如果有则延迟重试
            setTimeout(function() {
                var questionDivAfter = document.getElementById("questionDiv");
                if (questionDivAfter) {
                    var contentAfter = questionDivAfter.innerText || questionDivAfter.textContent;
                    var titleElAfter = questionDivAfter.querySelector('.title');
                    var titleTextAfter = titleElAfter ? (titleElAfter.innerText || titleElAfter.textContent) : '';
                    var questionKeyAfter = titleTextAfter.substring(0, 50);

                    if (contentAfter.includes('答错') || contentAfter.includes('回答错误') || contentAfter.includes('不正确')) {
                        console.log("答案错误，标记需要重试...");
                        tfQuestionAttempts[questionKeyAfter] = 1;
                        submittedQuestions[questionKeyAfter] = false;

                        // 寻找重试按钮
                        var retryBtn = questionDivAfter.querySelector('.retry, .again, [class*="retry"], [class*="again"]') ||
                                       questionDivAfter.querySelector('.btn');
                        if (retryBtn && retryBtn.innerText && (retryBtn.innerText.includes('重') || retryBtn.innerText.includes('再'))) {
                            retryBtn.click();
                            console.log("点击重试按钮");
                        }
                        // 延迟后重新调用答题函数
                        setTimeout(autoAnswerPopupQuestion, 1000);
                    }
                }
            }, 800);
        }, 500);
    }

    document.addEventListener('keydown', function(event) {
        console.log("keydown", event.code);
        if (event.code === 'KeyV') {
            console.log("视频可拖动...");
            player.changeConfig('config','timeScheduleAdjust',1); // 视频可拖动
        } else if (event.code === "KeyM") {
            main();
        } else if (event.code === "KeyE") {
            exam();
        }
    });
    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.onload = main;
    }
})();