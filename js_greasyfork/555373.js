// ==UserScript==
// @name         淘宝学堂自动答题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成淘宝学堂考试答题
// @author       鹿秋夏
// @match        https://idaxue.taobao.com/exam.jhtml*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555373/%E6%B7%98%E5%AE%9D%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/555373/%E6%B7%98%E5%AE%9D%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let answerMap = null;
    let answerDataLoading = false;
    let isMonitoring = false;
    let hasAnswered = false;
    let observer = null;

    function autoSelectAnswers() {
        if (!answerMap) return;

        const questionComponents = document.querySelectorAll('.Exam-Core-Doing-Component');
        let matchedCount = 0;

        questionComponents.forEach((component) => {
            const questionTextElement = component.querySelector('.question_part .text');
            if (!questionTextElement) return;

            const questionText = questionTextElement.textContent.trim().replace(/\s+/g, ' ');
            const answers = answerMap[questionText];

            if (!answers || answers.length === 0) return;

            const questionTypeElement = component.querySelector('.title_part .type');
            if (!questionTypeElement) return;

            const questionType = questionTypeElement.textContent.trim();
            const options = component.querySelectorAll('.SMJSelectionHTML-Component .Option');

            if (questionType === '单选题') {
                options.forEach(option => {
                    const optionTextElement = option.querySelector('.opContext');
                    if (!optionTextElement) return;

                    const optionText = optionTextElement.textContent.trim();
                    if (answers.includes(optionText)) {
                        const radioInput = option.querySelector('input[type="radio"]');
                        radioInput?.click();
                        matchedCount++;
                    }
                });
            } else if (questionType === '多选题') {
                let selected = false;
                options.forEach(option => {
                    const optionTextElement = option.querySelector('.opContext');
                    if (!optionTextElement) return;

                    const optionText = optionTextElement.textContent.trim();
                    if (answers.includes(optionText)) {
                        const checkboxInput = option.querySelector('input[type="checkbox"]');
                        checkboxInput?.click();
                        selected = true;
                    }
                });
                if (selected) matchedCount++;
            }
        });

        if (matchedCount > 0) {
            console.log(`自动答题完成，成功匹配 ${matchedCount} 道题目`);
            hasAnswered = true;
            if (observer) {
                observer.disconnect();
            }
        }
    }

    async function loadAnswerData() {
        if (answerMap || answerDataLoading) return;

        answerDataLoading = true;
        try {
            const response = await fetch('https://textdb.online/BDF3E7A6A62BAA1E7A110D9EE2584BB8');
            if (!response.ok) throw new Error(`请求失败: ${response.status}`);

            const answerData = await response.json();
            answerMap = {};
            answerData.forEach(item => {
                const cleanQuestion = item.question.trim().replace(/\s+/g, ' ');
                answerMap[cleanQuestion] = item.answer;
            });

            autoSelectAnswers();
        } catch (error) {
            console.error('加载题库失败:', error);
        } finally {
            answerDataLoading = false;
        }
    }

    function checkAndStartAutoAnswer() {
        if (hasAnswered) return;

        const questionComponents = document.querySelectorAll('.Exam-Core-Doing-Component');
        if (questionComponents.length > 0) {
            if (!answerMap && !answerDataLoading) {
                loadAnswerData();
            } else if (answerMap) {
                autoSelectAnswers();
            }
        }
    }

    function startMonitoring() {
        if (isMonitoring) return;
        isMonitoring = true;

        observer = new MutationObserver(() => {
            if (location.href.includes('pageType=Doing')) {
                checkAndStartAutoAnswer();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            if (location.href.includes('pageType=Doing')) {
                checkAndStartAutoAnswer();
            }
        }, 1000);
    }

    function shouldTrigger() {
        return window.location.href.includes('pageType=Doing');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (shouldTrigger()) {
                startMonitoring();
                setTimeout(checkAndStartAutoAnswer, 500);
            }
        });
    } else {
        if (shouldTrigger()) {
            startMonitoring();
            setTimeout(checkAndStartAutoAnswer, 500);
        }
    }

    window.addEventListener('hashchange', () => {
        if (shouldTrigger() && !isMonitoring) {
            startMonitoring();
            setTimeout(checkAndStartAutoAnswer, 500);
        }
    });
})();