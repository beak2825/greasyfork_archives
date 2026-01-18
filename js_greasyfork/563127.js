// ==UserScript==
// @name         ChatGPT - 动态跳转上一条问题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  鼠标悬停动态计算当前提问，点击跳转上一条
// @match        https://chatgpt.com/c/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/563127/ChatGPT%20-%20%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E4%B8%8A%E4%B8%80%E6%9D%A1%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/563127/ChatGPT%20-%20%E5%8A%A8%E6%80%81%E8%B7%B3%E8%BD%AC%E4%B8%8A%E4%B8%80%E6%9D%A1%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let questionList = []; // 当前聊天的所有用户提问元素

    // 扫描当前聊天的所有用户提问
    function scanAllUserMessages() {
        const selectors = [
            '[data-message-author-role="user"]',
            '[data-author="user"]',
            '[data-role="user"]'
        ];
        for (const sel of selectors) {
            const list = document.querySelectorAll(sel);
            if (list && list.length) return Array.from(list);
        }
        return [];
    }

    function getPrevQuestion() {
        if (questionList.length === 0) return null;

        const screenBottom = window.innerHeight;

        // 找到底部 < 屏幕底部的最后一个问题
        let current = null;
        for (let i = 0; i < questionList.length; i++) {
            const el = questionList[i];
            const rect = el.getBoundingClientRect();
            console.log("q",i,":",rect.top," - ",rect.bottom)
            if (rect.bottom < 0) current = el;
            else break; // 后面都在屏幕下方
        }

        if (!current) return null;
        //return current;

        const idx = questionList.indexOf(current);
        console.log('idx',idx)
        return idx >= 0 ? questionList[idx] : null;
    }


    // 高亮元素
    function highlight(el) {
        const orig = el.style.boxShadow;
        el.style.transition = "box-shadow 0.25s ease";
        el.style.boxShadow = "0 0 0 3px rgba(66,133,244,0.25)";
        setTimeout(() => {
            el.style.boxShadow = orig || "";
        }, 1200);
    }

    // 创建悬浮按钮
    function createButton() {
        if (document.getElementById("jumpPrevQuestionBtn")) return;
        const btn = document.createElement("div");
        btn.id = "jumpPrevQuestionBtn";
        btn.innerText = "⬅️ 上一条提问";
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#111827",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: "10px",
            cursor: "pointer",
            zIndex: 2147483647,
            fontSize: "13px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
            userSelect: "none",
        });
        btn.title = "鼠标悬停显示当前可见提问，点击跳转上一条";
        document.body.appendChild(btn);

        btn.addEventListener('mouseenter', () => {
            const prev = getPrevQuestion();
            btn.dataset.prevQuestionId = prev ? prev.dataset.qid : "";
        });

        btn.addEventListener('click', () => {
            const prevId = btn.dataset.prevQuestionId;
            if (!prevId) return;
            const prevEl = document.querySelector(`[data-qid='${prevId}']`);

            console.log("跳转到q",prevId)
            prevEl.scrollIntoView({behavior:'smooth', block:'start'});
            setTimeout(function() {
                const prev = getPrevQuestion();
                btn.dataset.prevQuestionId = prev ? prev.dataset.qid : "";
                highlight(prevEl);
            }, 1000);
        });

    }

    // 给每条提问加唯一 id
    function annotateQuestions(questions) {
        questions.forEach((el, index) => {
            if (!el.dataset.qid) {
                el.dataset.qid = `qid-${Date.now()}-${index}`;
                const tag = document.createElement("div");
                tag.innerText = `Q${index+1}`;
                Object.assign(tag.style, {
                    fontSize: "12px",
                    color: "#888",
                    marginBottom: "6px",
                    fontWeight: "600",
                    opacity: "0.9",
                    scrollMarginTop: "60px"
                });
                el.prepend(tag);
            }
        });
    }

        // ====== 右侧跳转目录功能 ======
    function createSidebar() {
        // 避免重复创建
        if (document.getElementById('questionSidebar')) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'questionSidebar';
        Object.assign(sidebar.style, {
            position: 'fixed',
            top: '80px',
            right: '0px',
            width: '200px',
            maxHeight: '80%',
            overflowY: 'auto',
            background: '#222222',
            borderLeft: '1px solid #ccc',
            padding: '8px',
            fontSize: '12px',
            zIndex: 2147483646
        });

        document.body.appendChild(sidebar);

        function refreshSidebar() {
            const questionList = scanAllUserMessages(); // 使用你已有的函数
            annotateQuestions(questionList);// 确保每条有 qid

            sidebar.innerHTML = ''; // 清空旧目录

            questionList.forEach((el, index) => {
                const item = document.createElement('div');
                let text = el.innerText.replace(/\n/g,' ').trim();
                text = text.length > 10 ? text.slice(0, 10) + '…' : text;
                item.innerText = `${index+1}. ${text}`;
                Object.assign(item.style, {
                    cursor: 'pointer',
                    padding: '2px 4px',
                    marginBottom: '2px',
                    borderRadius: '3px'
                });

                // 点击跳转
                item.addEventListener('click', () => {
                    el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    highlight(el); // 可以复用你已有的 highlight 函数
                });

                // 悬停高亮目录条
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#e0e0e0';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = '';
                });

                sidebar.appendChild(item);
            });
        }

        // 初始生成
        refreshSidebar();

        // 监听 DOM 变化，自动刷新目录
        const observer = new MutationObserver(refreshSidebar);
        observer.observe(document.body, {childList: true, subtree: true});
    }



    // 初始化
    function init() {
        questionList = scanAllUserMessages();
        if (questionList.length > 0) annotateQuestions(questionList);
        createButton();

        // 调用一次即可
        //createSidebar();
    }

    // 监听 DOM 变化，更新 questionList
    const observer = new MutationObserver(() => {
        const newList = scanAllUserMessages();
        if (newList.length !== questionList.length) {
            questionList = newList;
            annotateQuestions(questionList);
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});

    // 页面加载完成后初始化
    window.addEventListener('load', () => setTimeout(init, 800));




})();
