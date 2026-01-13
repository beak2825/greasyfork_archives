// ==UserScript==
// @name         NJU 南京大学教务系统自动评教助手
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  一键快速填充“很好”选项并生成多样化评语，适用于南京大学教务评价系统
// @author       NJUer
// @match        *://ehallapp.nju.edu.cn/jwapp/sys/wspjyyapp/*
// @match        *://*.nju.edu.cn/jwapp/sys/wspjyyapp/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562440/NJU%20%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562440/NJU%20%E5%8D%97%E4%BA%AC%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const CONFIG = {
        // 1. 目标评分等级
        targetText: "很好",

        // 2. 优化后的随机评语库（更自然、更具学术气息）
        comments: [
            "教学内容充实，逻辑清晰，老师对重点难点的讲解非常透彻。",
            "课堂互动性强，老师授课充满激情，极大地激发了学习兴趣。",
            "老师备课极其认真，课件制作精美，教学案例非常具有代表性。",
            "教学态度负责，课后答疑耐心细致，是一位非常优秀的老师。",
            "课程安排合理，既注重理论深度又兼顾实际应用，获益匪浅。",
            "老师讲课深入浅出，评价公正客观，课堂氛围轻松愉快。"
        ],

        btnStyle: `
            position: fixed; right: 0px; top: 50%; transform: translateY(-50%);
            z-index: 999999; width: 60px; height: 180px; font-size: 18px;
            line-height: 1.2; background-color: #673ab7; color: white;
            border: none; border-radius: 15px 0 0 15px; cursor: pointer;
            font-weight: bold; box-shadow: -4px 0 15px rgba(0,0,0,0.3);
        `
    };

    // ================= 逻辑区 =================
    function startEvaluation() {
        let count = 0;
        const labels = document.querySelectorAll('.bh-radio-label');

        labels.forEach(label => {
            if (label.textContent.trim().includes(CONFIG.targetText)) {
                label.click();
                count++;
            }
        });

        document.querySelectorAll('textarea').forEach(box => {
            if (box.value.length < 5) {
                const randomMsg = CONFIG.comments[Math.floor(Math.random() * CONFIG.comments.length)];
                box.value = randomMsg;
                box.dispatchEvent(new Event('input', { bubbles: true }));
                box.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        console.log(`[南京大学评教助手] 已成功勾选 ${count} 个选项并填充评语。`);
    }

    function injectButton() {
        if (document.getElementById('nju-mega-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'nju-mega-btn';
        // 优化了侧边栏按钮文字，使其看起来更正式
        btn.innerHTML = '✨<br>开<br>始<br>自<br>动<br>评<br>教';
        btn.style.cssText = CONFIG.btnStyle;
        btn.onclick = (e) => {
            e.preventDefault();
            startEvaluation();
        };
        document.body.appendChild(btn);
    }

    setInterval(injectButton, 1000);
})();
