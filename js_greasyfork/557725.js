// ==UserScript==
// @name         DLsite 作品内容提取
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  提取 DLsite 简介，自动为没有特定符号的 h3 标题添加 ◆ 前缀
// @author       Accard
// @match        https://www.dlsite.com/*/work/*
// @match        https://www.dlsite.com/*/announce/*
// @grant        GM_setClipboard
// @license MIT licensed
// @downloadURL https://update.greasyfork.org/scripts/557725/DLsite%20%E4%BD%9C%E5%93%81%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/557725/DLsite%20%E4%BD%9C%E5%93%81%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 创建 UI 按钮 (和之前一样)
    let btn = document.createElement("button");
    btn.innerHTML = "📋 提取 作品内容";
    Object.assign(btn.style, {
        position: "fixed", bottom: "20px", right: "20px", zIndex: "9999",
        padding: "10px 15px", backgroundColor: "#6f42c1", color: "white", // 改个紫色区分一下
        border: "none", borderRadius: "5px", cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)", fontSize: "14px", fontWeight: "bold"
    });
    document.body.appendChild(btn);

    // 2. 核心处理函数
    btn.onclick = function() {
        // 获取简介的最外层容器
        // 根据你提供的 HTML，这里有 itemprop="description"
        let container = document.querySelector('.work_parts_container');

        // 如果找不到，尝试备用选择器
        if (!container) container = document.querySelector('[itemprop="description"]');

        if (!container) {
            alert("未找到简介内容区域！");
            return;
        }

        // --- 关键逻辑开始 ---

        // 获取容器内所有的 h3 (标题) 和 p (文本段落)，按在文档中出现的顺序排列
        let elements = container.querySelectorAll('h3, p');
        let finalOutput = [];

        // 定义需要在 h3 中检测的符号
        const symbols = ['◆', '●', '■', '▼'];

        elements.forEach(el => {
            // 获取文本并去除首尾空白
            let text = el.innerText.trim();
            if (!text) return; // 跳过空行

            // 判断是否是 h3 标签
            if (el.tagName.toLowerCase() === 'h3') {
                // 检查是否包含指定符号中的任意一个
                let hasSymbol = symbols.some(symbol => text.includes(symbol));

                if (hasSymbol) {
                    // 如果有符号，直接保留
                    finalOutput.push("\n" + text);
                } else {
                    // 如果没有符号，在最前面加上 ◆
                    finalOutput.push("\n◆ " + text);
                }
            } else {
                // 如果是 p 标签 (普通文本)，直接保留
                // innerText 会自动把 HTML 中的 <br> 转换为换行符，这正是我们需要的
                finalOutput.push(text);
            }
        });

        // 将数组组合成字符串，用换行符连接
        // replace 处理一下可能出现的连续过多换行，保持整洁
        let resultText = finalOutput.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();

        // 3. 复制到剪贴板
        GM_setClipboard(resultText);

        // 按钮反馈
        let originalText = btn.innerHTML;
        btn.innerHTML = "✅ 处理并复制成功！";
        btn.style.backgroundColor = "#28a745";
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "#6f42c1";
        }, 2000);
    };
    // 添加复制作品名按钮
    let workNameElement = document.getElementById('work_name');
    if (workNameElement) {
        let copyTitleBtn = document.createElement("button");
        copyTitleBtn.innerHTML = "<===📋 复制标题";
        Object.assign(copyTitleBtn.style, {
            display: "inline-block",
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "12px",
            verticalAlign: "middle"
        });

        copyTitleBtn.onclick = function(e) {
            e.preventDefault();
            let titleText = workNameElement.innerText.trim();
            GM_setClipboard(titleText);

            // 按钮反馈
            let originalText = copyTitleBtn.innerHTML;
            copyTitleBtn.innerHTML = "✅ 已复制";
            copyTitleBtn.style.backgroundColor = "#28a745";
            setTimeout(() => {
                copyTitleBtn.innerHTML = originalText;
                copyTitleBtn.style.backgroundColor = "#6f42c1";
            }, 2000);
        };

        // 将按钮插入到h1标题后面
        workNameElement.parentNode.insertBefore(copyTitleBtn, workNameElement.nextSibling);
    }
})();