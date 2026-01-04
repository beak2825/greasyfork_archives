// ==UserScript==
// @name         知乎手动抓取回答（右下角浮窗展示）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  手动点击按钮抓取知乎问题页所有回答文本并显示在浮窗中
// @match        https://www.zhihu.com/question/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554526/%E7%9F%A5%E4%B9%8E%E6%89%8B%E5%8A%A8%E6%8A%93%E5%8F%96%E5%9B%9E%E7%AD%94%EF%BC%88%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B5%AE%E7%AA%97%E5%B1%95%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554526/%E7%9F%A5%E4%B9%8E%E6%89%8B%E5%8A%A8%E6%8A%93%E5%8F%96%E5%9B%9E%E7%AD%94%EF%BC%88%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B5%AE%E7%AA%97%E5%B1%95%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 选择器：知乎回答内容
    const answerSelector = '.RichContent .RichText.ztext';
    const authorSelector = '.AuthorInfo-content .UserLink-link';

    // ===== 创建浮窗 =====
    const box = document.createElement("div");
    Object.assign(box.style, {
        position: "fixed",
        bottom: "70px",
        right: "20px",
        width: "350px",
        height: "350px",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        fontSize: "13px",
        lineHeight: "1.5em",
        padding: "10px",
        borderRadius: "10px",
        overflowY: "auto",
        zIndex: "999999",
        whiteSpace: "pre-wrap",
        display: "none",
    });
    document.body.appendChild(box);

    // ===== 创建控制按钮 =====
    const btn = document.createElement("button");
    btn.textContent = "开始抓取回答";
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#3c9ce9",
        color: "#fff",
        cursor: "pointer",
        zIndex: "999999",
        fontSize: "13px",
    });
    document.body.appendChild(btn);

    let grabbing = false;
    let observer = null;
    let allAnswers = [];
    const grabbed = new Set();

    // ===== 更新浮窗内容 =====
    function updateBox() {
        box.innerHTML = "📜 共抓到 " + allAnswers.length + " 条回答\n\n" + allAnswers.join("\n\n----------------\n\n");
    }

    // ===== 抓取逻辑 =====
    function collectAnswers() {
        const answers = document.querySelectorAll(answerSelector);
        const authors = document.querySelectorAll(authorSelector);

        let added = 0;
        answers.forEach((node, i) => {
            const text = node.innerText.trim();
            const author = authors[i] ? authors[i].innerText.trim() : "匿名用户";
            const combined = `👤 作者：${author}\n\n${text}`;
            if (text && !grabbed.has(combined)) {
                grabbed.add(combined);
                allAnswers.push(combined);
                added++;
            }
        });
        if (added > 0) updateBox();
    }

    // ===== 启动抓取 =====
    function startGrabbing() {
        allAnswers = [];
        grabbed.clear();
        box.style.display = "block";
        box.innerHTML = "📡 正在抓取回答中...\n";
        grabbing = true;
        collectAnswers();

        observer = new MutationObserver(() => collectAnswers());
        observer.observe(document.body, { childList: true, subtree: true });

        btn.textContent = "停止抓取";
        btn.style.background = "#ff5c5c";
    }

    // ===== 停止抓取 =====
    function stopGrabbing() {
        grabbing = false;
        observer && observer.disconnect();
        btn.textContent = "开始抓取回答";
        btn.style.background = "#3c9ce9";
        box.innerHTML += "\n✅ 已停止抓取";
    }

    // ===== 点击按钮切换 =====
    btn.addEventListener("click", () => {
        if (!grabbing) startGrabbing();
        else stopGrabbing();
    });

    // 双击浮窗隐藏
    box.addEventListener("dblclick", () => {
        box.style.display = "none";
    });

})();
