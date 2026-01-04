// ==UserScript==
// @name         2025广东省教师继续教育公需课-自动刷课播放脚本（2025.12.25已失效，看主页另外一则更新实测可用）
// @namespace    https://github.com/
// @version      2025.12.28
// @description  为广东省继续教育课程提供答题参考提示、页面信息展示（学习交流用）
// @author       yygdz1921
// @match        https://jsxx.gds.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gds.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560110/2025%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%8820251225%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E7%9C%8B%E4%B8%BB%E9%A1%B5%E5%8F%A6%E5%A4%96%E4%B8%80%E5%88%99%E6%9B%B4%E6%96%B0%E5%AE%9E%E6%B5%8B%E5%8F%AF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560110/2025%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E8%AF%BE-%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%8820251225%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E7%9C%8B%E4%B8%BB%E9%A1%B5%E5%8F%A6%E5%A4%96%E4%B8%80%E5%88%99%E6%9B%B4%E6%96%B0%E5%AE%9E%E6%B5%8B%E5%8F%AF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const POPUP_DURATION = 3000; // 弹窗显示时长
    const ANSWER_MAP = {
        "a": 0, "A": 0, "b": 1, "B": 1,
        "c": 2, "C": 2, "d": 3, "D": 3,
        "e": 4, "E": 4
    };

    // 两套课程参考答案
    const ANSWER_LIB = {
        "ai": ["C", "D", "B", "B", "B", "B", "C", "B", "C", "B", "ABC", "ABCD", "ABD", "ABC", "ABCD", "ABC", "AB", "ACD", "ABC", "ABCD", "A", "A", "B", "B", "B", "B", "A", "A", "A", "A"],
        "newProductivity": ["B", "D", "A", "D", "A", "B", "B", "A", "B", "A", "ABC", "ABCD", "ABCDE", "ABC", "ACD", "ABC", "ABC", "ABC", "ABD","ABDE" ,"A", "A", "A", "A", "B", "B", "B", "A", "A", "B"]
    };

    // 显示弹窗提示
    function showPopupMessage(message, duration = POPUP_DURATION) {
        const popup = document.createElement('div');
        popup.innerText = message;
        Object.assign(popup.style, {
            display: 'block',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f9f9f9',
            padding: '15px 25px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            color: '#333',
            fontSize: '16px',
            maxWidth: '80%',
            textAlign: 'center',
            zIndex: '9999',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        });
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), duration);
    }

    // 答案格式转换：ABCD转索引
    function convertAnswerToIndex(answerList) {
        return answerList.map(ans => {
            const indexArr = [];
            for (let char of ans) {
                if (ANSWER_MAP[char] !== undefined) indexArr.push(ANSWER_MAP[char]);
            }
            return indexArr;
        });
    }

    // 获取当前课程对应的参考答案
    function getCurrentCourseAnswers() {
        const courseEl = document.getElementById("courseCatalog");
        if (!courseEl) return null;

        if (courseEl.textContent.includes("人工智能")) {
            return convertAnswerToIndex(ANSWER_LIB.ai);
        } else {
            return convertAnswerToIndex(ANSWER_LIB.newProductivity);
        }
    }

    // 答题参考提示（手动触发，非自动勾选）
    function showAnswerTips() {
        const gradeEl = document.querySelector(".m-studyTest-grade strong");
        if (gradeEl) {
            const grade = parseInt(gradeEl.innerText);
            if (grade >= 100) {
                showPopupMessage(`当前成绩：${grade}分，无需再答题`, 2000);
                return;
            }
        }

        const answers = getCurrentCourseAnswers();
        if (!answers) {
            showPopupMessage("未识别到对应课程答案", 2000);
            return;
        }

        const questions = document.getElementsByClassName("m-topic-item");
        if (questions.length === 0) {
            showPopupMessage("未找到题目列表", 2000);
            return;
        }

        showPopupMessage(`已加载${questions.length}道题的参考答案，按F12查看控制台`, 3000);
        console.log("===== 答题参考索引（单选/多选对应选项位置） =====");
        for (let i = 0; i < questions.length; i++) {
            const qTitle = questions[i].querySelector(".m-topic-title")?.innerText || `第${i+1}题`;
            console.log(`${qTitle}: ${answers[i].join(", ")}`);
        }
    }

    // 页面加载完成后添加触发按钮
    function initTool() {
        const triggerBtn = document.createElement('button');
        Object.assign(triggerBtn.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '8px 15px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: '9998',
            fontSize: '14px'
        });
        triggerBtn.innerText = "查看答题参考";
        triggerBtn.addEventListener('click', showAnswerTips);
        document.body.appendChild(triggerBtn);
    }

    // 页面加载完成后初始化
    if (document.readyState === "complete") {
        initTool();
    } else {
        window.addEventListener("load", initTool);
    }
})();
