// ==UserScript==
// @name         gooboo自动答题
// @namespace    http://tampermonkey.net/
// @version      25.11.28
// @description  优化版gooboo自动答题
// @author       kewu
// @match        https://gityxs.github.io/gooboo/
// @icon         https://gityxs.github.io/gooboo/favicon-32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557198/gooboo%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/557198/gooboo%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 抑制 Vuetify 警告
    const originalWarn = console.warn;
    console.warn = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('[Vuetify]') && args[0].includes('Translation key')) {
            return; // 抑制 Vuetify 翻译键警告
        }
        originalWarn.apply(console, args);
    };

    // 全局状态与定时器管理
    let singleAnswerStatus = false;
    let singleAnswerTimer = null;
    let autoAnswerStatus = false;
    let autoAnswerMainTimer = null;
    let findStudyBtnTimer = null;

    // 1. 初始化：添加操作按钮
    const initButtons = () => {
        // 等待页面加载完成
        if (!$(".v-toolbar__content").length) {
            setTimeout(initButtons, 500);
            return;
        }

        const btnStyle = "margin: 0 10px; padding: 4px 12px; cursor: pointer; border: none; border-radius: 4px; color: white; transition: background 0.2s; font-size: 14px;";
        const singleBtn = $(`<button id="singleAnswerBtn" style="${btnStyle} background: #42b983;">开始答题</button>`);
        const autoBtn = $(`<button id="autoAnswerBtn" style="${btnStyle} background: #2196f3;">开启自动答题</button>`);

        $(".v-toolbar__content").prepend(autoBtn).prepend(singleBtn);

        // 绑定按钮事件
        bindSingleAnswerBtn();
        bindAutoAnswerBtn();

        console.log("Gooboo 自动答题脚本已加载 - 优化版 v0.7");
    };

    // 处理次方符号^
    const handlePowerSymbol = (expr) => {
        try {
            let processedExpr = expr;

            while (processedExpr.includes('^')) {
                const powerRegex = /(\([^()]+\)|[0-9.]+)\s*\^\s*(\([^()]+\)|[0-9.]+)/;
                const match = processedExpr.match(powerRegex);

                if (!match) break;

                const [fullMatch, base, exponent] = match;
                const baseValue = eval(base);
                const exponentValue = eval(exponent);
                const result = Math.pow(baseValue, exponentValue);

                processedExpr = processedExpr.replace(fullMatch, result.toString());
            }

            const simplePowerRegex = /([0-9.]+)\s*\^\s*([0-9.]+)/g;
            processedExpr = processedExpr.replace(simplePowerRegex, (match, base, exponent) => {
                const result = Math.pow(parseFloat(base), parseFloat(exponent));
                return result.toString();
            });

            return processedExpr;
        } catch (error) {
            return expr;
        }
    };

    // 2. 单次答题核心
    const checkAndAnswer = () => {
        try {
            const questionElem = $(".question-text");
            const answerInput = $("#answer-input-math");
            const submitBtn = $(".ma-1.v-btn.v-btn--is-elevated");

            if (!questionElem.length || !questionElem.html() || !answerInput.length || !submitBtn.length) {
                return;
            }

            let question = questionElem.html().trim();
            if (!question) return;

            let answer;
            if (question.startsWith("√")) {
                const num = Number(question.replace("√", "").trim());
                if (!isNaN(num) && num >= 0) {
                    answer = Math.sqrt(num).toFixed(2);
                }
            } else {
                try {
                    const processedExpr = handlePowerSymbol(question);
                    const rawResult = eval(processedExpr);

                    if (!isNaN(rawResult) && isFinite(rawResult)) {
                        answer = Number(rawResult).toFixed(2);
                    }
                } catch (calcErr) {
                    return;
                }
            }

            if (answer && !isNaN(answer) && isFinite(answer)) {
                answerInput.val(answer);
                answerInput[0].dispatchEvent(new InputEvent('input', { bubbles: true }));
                answerInput[0].dispatchEvent(new Event('change', { bubbles: true }));
                submitBtn[0].click();
            }
        } catch (e) {
            // 静默处理异常
        }
    };

    // 3. 单次答题按钮点击事件
    const bindSingleAnswerBtn = () => {
        $("#singleAnswerBtn").off("click").on("click", function() {
            if (singleAnswerStatus) {
                // 停止答题
                singleAnswerStatus = false;
                if (singleAnswerTimer) {
                    clearInterval(singleAnswerTimer);
                    singleAnswerTimer = null;
                }
                $(this).text("开始答题").css("background", "#42b983");
                console.log("单次答题已停止");
            } else {
                // 开始答题
                singleAnswerStatus = true;
                $(this).text("终止答题").css("background", "#f44336");
                singleAnswerTimer = setInterval(checkAndAnswer, 10);
                console.log("单次答题已开启（0.1秒检测一次题目）");
            }
        });
    };

    // 4. 查找学习按钮的核心函数
    const searchStudyBtn = () => {
        // 检查自动答题状态
        if (!autoAnswerStatus) {
            console.log("自动答题已停止，终止查找学习按钮");
            if (findStudyBtnTimer) {
                clearInterval(findStudyBtnTimer);
                findStudyBtnTimer = null;
            }
            return;
        }

        // 查找学习按钮
        let studyBtn = null;
        const buttons = document.querySelectorAll(".v-btn__content");
        for (let i = 0; i < buttons.length; i++) {
            if ($(buttons[i]).text().trim() === "学习") {
                studyBtn = buttons[i].closest(".v-btn");
                break;
            }
        }

        if (studyBtn) {
            // 找到学习按钮，点击并清除重试定时器
            studyBtn.click();
            console.log("已点击学习按钮，41秒后开始下一轮");

            // 清除重试定时器
            if (findStudyBtnTimer) {
                clearInterval(findStudyBtnTimer);
                findStudyBtnTimer = null;
            }
        } else {
            // 未找到学习按钮，继续重试
            console.log("未找到学习按钮，1秒后重试...");
        }
    };

    // 5. 启动自动答题查找
    const startAutoAnswer = () => {
        // 清除可能存在的旧定时器
        if (findStudyBtnTimer) {
            clearInterval(findStudyBtnTimer);
            findStudyBtnTimer = null;
        }

        // 立即开始查找学习按钮
        searchStudyBtn();

        // 只有在自动答题开启且没有定时器时才创建新定时器
        if (autoAnswerStatus && !findStudyBtnTimer) {
            findStudyBtnTimer = setInterval(searchStudyBtn, 1000);
        }
    };

    // 6. 自动答题按钮点击事件
    const bindAutoAnswerBtn = () => {
        $("#autoAnswerBtn").off("click").on("click", function() {
            if (autoAnswerStatus) {
                // 停止自动答题
                autoAnswerStatus = false;

                // 清除所有定时器
                if (autoAnswerMainTimer) {
                    clearInterval(autoAnswerMainTimer);
                    autoAnswerMainTimer = null;
                }
                if (findStudyBtnTimer) {
                    clearInterval(findStudyBtnTimer);
                    findStudyBtnTimer = null;
                }

                $(this).text("开启自动答题").css("background", "#2196f3");
                console.log("自动答题已完全停止");
            } else {
                // 开启自动答题
                autoAnswerStatus = true;
                $(this).text("停止自动答题").css("background", "#f44336");
                console.log("自动答题已开启（41秒循环）");

                // 立即开始第一轮查找
                startAutoAnswer();

                // 设置41秒主循环
                if (autoAnswerMainTimer) {
                    clearInterval(autoAnswerMainTimer);
                }
                autoAnswerMainTimer = setInterval(() => {
                    if (autoAnswerStatus) {
                        console.log("41秒循环：开始新一轮查找");
                        startAutoAnswer();
                    }
                }, 41 * 1000);
            }
        });
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initButtons);
    } else {
        initButtons();
    }

    // 防止重复加载
    if (window.goobooScriptLoaded) {
        return;
    }
    window.goobooScriptLoaded = true;

})();