// ==UserScript==
// @name         ICVE 自动显示答案（单选/多选/判断题）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Vue SPA 页面，每题下方显示答案，支持单选、多选、判断题，特殊字符匹配
// @match        https://ai.icve.com.cn/preview-exam/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549218/ICVE%20%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BC%88%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E5%88%A4%E6%96%AD%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/549218/ICVE%20%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BC%88%E5%8D%95%E9%80%89%E5%A4%9A%E9%80%89%E5%88%A4%E6%96%AD%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------------------- 工具函数 -------------------
    function getAdminToken() {
        const match = document.cookie.match(/(?:^|;\s*)admin-token=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function getExamIdFromUrl() {
        const parts = window.location.pathname.split("/");
        return parts[2];
    }

    function numberToLetter(num) {
        const letters = "ABCDEFG";
        return letters[num] || "";
    }

    function normalizeText(str) {
        if (!str) return "";
        return str
            .replace(/\s+/g, "")                  // 去掉空格和换行
            .replace(/&nbsp;/g, "")               // 去掉 HTML 空格
            .replace(/[^\w\u4e00-\u9fa5]/g, ""); // 只保留中文、字母、数字
    }

    async function fetchExamPaper(examId, token) {
        const url = `https://ai.icve.com.cn/prod-api/course/exam/paper?id=${examId}&groupId=0`;
        const res = await fetch(url, { headers: { "Authorization": "Bearer " + token } });
        return res.json();
    }

    function extractTaskExamRecord(paperData) {
        return (paperData && paperData.taskExamRecord) ? paperData.taskExamRecord : null;
    }

    function buildGetInfoUrl(taskExamRecord) {
        const courseInfoId = taskExamRecord.courseInfoId;
        const taskId = taskExamRecord.id;
        const examId = taskExamRecord.examId;
        const studentId = taskExamRecord.userId;
        return `https://ai.icve.com.cn/prod-api/course/exam/record/getInfo?courseInfoId=${courseInfoId}&taskId=${taskId}&examId=${examId}&studentId=${studentId}&type=2`;
    }

    async function fetchExamInfo(getInfoUrl, token) {
        const res = await fetch(getInfoUrl, { headers: { "Authorization": "Bearer " + token } });
        return res.json();
    }

    // ------------------- 插入答案函数 -------------------
    function insertAnswerSingle(single, q) {
        const titleEl = single.querySelector(".single-title-content");
        if (!titleEl) return;

        const singleText = normalizeText(titleEl.textContent);
        const qText = normalizeText(q.title);
        if (!singleText.includes(qText)) return;
        if (single.querySelector(".icve-answer-inserted")) return;

        const answerLetters = (q.answer || "").split("").map(n => numberToLetter(parseInt(n))).join("");

        const ansDiv = document.createElement("div");
        ansDiv.className = "icve-answer-inserted";
        ansDiv.innerText = "答案：" + answerLetters;
        ansDiv.style.color = "blue";
        ansDiv.style.fontWeight = "bold";
        ansDiv.style.marginTop = "4px";

        single.appendChild(ansDiv);
    }

    function insertAnswerMultiple(single, q) {
        const titleEl = single.querySelector(".multiple-title-content");
        if (!titleEl) return;

        const singleText = normalizeText(titleEl.textContent);
        const qText = normalizeText(q.title);
        if (!singleText.includes(qText)) return;
        if (single.querySelector(".icve-answer-inserted")) return;

        const answerLetters = (q.answer || "")
            .split("")
            .map(n => numberToLetter(parseInt(n)))
            .join(",");

        const ansDiv = document.createElement("div");
        ansDiv.className = "icve-answer-inserted";
        ansDiv.innerText = "答案：" + answerLetters;
        ansDiv.style.color = "blue";
        ansDiv.style.fontWeight = "bold";
        ansDiv.style.marginTop = "4px";

        single.appendChild(ansDiv);
    }

    function insertAnswerJudge(single, q) {
        const titleEl = single.querySelector(".judge-title-content");
        if (!titleEl) return;

        const singleText = normalizeText(titleEl.textContent);
        const qText = normalizeText(q.title);
        if (!singleText.includes(qText)) return;
        if (single.querySelector(".icve-answer-inserted")) return;

        // 判断题答案映射：0->A(正确), 1->B(错误)
        const answerMap = ["A", "B"];
        const answerLetters = answerMap[q.answer] || "";

        const ansDiv = document.createElement("div");
        ansDiv.className = "icve-answer-inserted";
        ansDiv.innerText = "答案：" + answerLetters;
        ansDiv.style.color = "blue";
        ansDiv.style.fontWeight = "bold";
        ansDiv.style.marginTop = "4px";

        single.appendChild(ansDiv);
    }

    // ------------------- 主函数 -------------------
    async function main() {
        const token = getAdminToken();
        if (!token) { alert("未找到 admin-token"); return; }
        const examId = getExamIdFromUrl();
        if (!examId) { alert("未找到 examId"); return; }

        try {
            const paperData = await fetchExamPaper(examId, token);
            const taskExamRecord = extractTaskExamRecord(paperData);
            if (!taskExamRecord) { alert("未找到 taskExamRecord"); return; }

            const infoUrl = buildGetInfoUrl(taskExamRecord);
            const infoData = await fetchExamInfo(infoUrl, token);
            const questions = infoData?.data?.questions || [];

            const containerParent = document.querySelector("body");
            if (!containerParent) return;

            const observer = new MutationObserver(() => {
                const singles = containerParent.querySelectorAll("div.single");
                singles.forEach(single => questions.forEach(q => insertAnswerSingle(single, q)));

                const multiples = containerParent.querySelectorAll("div.multiple");
                multiples.forEach(single => questions.forEach(q => insertAnswerMultiple(single, q)));

                const judges = containerParent.querySelectorAll("div.judge");
                judges.forEach(single => questions.forEach(q => insertAnswerJudge(single, q)));
            });

            observer.observe(containerParent, { childList: true, subtree: true });

            // 处理已渲染的题目
            const singles = containerParent.querySelectorAll("div.single");
            singles.forEach(single => questions.forEach(q => insertAnswerSingle(single, q)));

            const multiples = containerParent.querySelectorAll("div.multiple");
            multiples.forEach(single => questions.forEach(q => insertAnswerMultiple(single, q)));

            const judges = containerParent.querySelectorAll("div.judge");
            judges.forEach(single => questions.forEach(q => insertAnswerJudge(single, q)));

        } catch (e) {
            console.error(e);
            alert("获取答案失败，请查看控制台");
        }
    }

    setTimeout(main, 500);
})();
