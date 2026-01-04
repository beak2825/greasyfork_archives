// ==UserScript==
// @name         小黑盒评论区屏蔽插眼 + 关键词过滤（支持子评论 + 设置面板）
// @namespace    https://xiaoheihe.cn/
// @version      1.3
// @description  自动隐藏小黑盒评论区中的插眼评论（含主评论与子评论），支持自定义关键词与设置面板管理。
// @author       kun
// @match        https://www.xiaoheihe.cn/app/bbs/link/*
// @icon         https://www.xiaoheihe.cn/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554099/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B1%8F%E8%94%BD%E6%8F%92%E7%9C%BC%20%2B%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%88%E6%94%AF%E6%8C%81%E5%AD%90%E8%AF%84%E8%AE%BA%20%2B%20%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554099/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B1%8F%E8%94%BD%E6%8F%92%E7%9C%BC%20%2B%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%EF%BC%88%E6%94%AF%E6%8C%81%E5%AD%90%E8%AF%84%E8%AE%BA%20%2B%20%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================
    // 💾 初始化关键词
    // =============================
    const defaultKeywords = ["副屏", "插眼", "cy", "攻略"];
    let blockKeywords = GM_getValue("blockKeywords", defaultKeywords);

    // =============================
    // 🧹 屏蔽函数
    // =============================
    function hideBlockedComments() {
        // 屏蔽顶层官方插眼评论（.cy）
        document.querySelectorAll('.comment-item__content.cy').forEach(content => {
            const commentItem = content.closest('.link-comment__comment-item');
            if (commentItem) commentItem.style.display = 'none';
        });

        // 屏蔽子评论中的插眼（p.children-item__comment-content）
        document.querySelectorAll('.children-item__comment-content').forEach(content => {
            const text = content.innerText || "";
            for (let keyword of blockKeywords) {
                if (text.includes(keyword)) {
                    const childComment = content.closest('.comment-children-item');
                    if (childComment) childComment.style.display = 'none';
                    break;
                }
            }
        });

        // 屏蔽自定义关键词（顶层评论）
        document.querySelectorAll('.comment-item__content').forEach(content => {
            const text = content.innerText || "";
            for (let keyword of blockKeywords) {
                if (text.includes(keyword)) {
                    const commentItem = content.closest('.link-comment__comment-item');
                    if (commentItem) commentItem.style.display = 'none';
                    break;
                }
            }
        });
    }

    // =============================
    // 🔁 动态监听（防止滚动加载漏网）
    // =============================
    const observer = new MutationObserver(() => hideBlockedComments());
    observer.observe(document.body, { childList: true, subtree: true });
    hideBlockedComments();

    // =============================
    // ⚙️ 设置面板 UI
    // =============================
    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.id = "xhh-block-panel";
        panel.innerHTML = `
            <div id="xhh-toggle-btn">🚫屏蔽设置</div>
            <div id="xhh-panel-body">
                <h4>关键词屏蔽设置</h4>
                <div id="xhh-keyword-list"></div>
                <input type="text" id="xhh-input" placeholder="输入关键词后回车添加">
                <button id="xhh-save-btn">💾 保存</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 样式
        const style = document.createElement("style");
        style.innerHTML = `
            #xhh-block-panel {
                position: fixed;
                right: 20px;
                bottom: 20px;
                font-size: 14px;
                z-index: 999999;
            }
            #xhh-toggle-btn {
                background: #3c9ce9;
                color: white;
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
            #xhh-panel-body {
                display: none;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 10px;
                margin-top: 8px;
                width: 240px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            #xhh-panel-body h4 {
                margin: 0 0 8px 0;
                font-size: 15px;
                text-align: center;
            }
            #xhh-keyword-list {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-bottom: 8px;
            }
            .xhh-tag {
                background: #3c9ce9;
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .xhh-remove {
                cursor: pointer;
                font-weight: bold;
            }
            #xhh-input {
                width: 100%;
                padding: 6px;
                border: 1px solid #ccc;
                border-radius: 6px;
                margin-bottom: 6px;
            }
            #xhh-save-btn {
                width: 100%;
                padding: 6px;
                background: #3c9ce9;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // 功能逻辑
        const toggleBtn = panel.querySelector("#xhh-toggle-btn");
        const panelBody = panel.querySelector("#xhh-panel-body");
        const listDiv = panel.querySelector("#xhh-keyword-list");
        const input = panel.querySelector("#xhh-input");
        const saveBtn = panel.querySelector("#xhh-save-btn");

        function renderList() {
            listDiv.innerHTML = "";
            blockKeywords.forEach((kw, idx) => {
                const tag = document.createElement("div");
                tag.className = "xhh-tag";
                tag.innerHTML = `${kw} <span class="xhh-remove" data-idx="${idx}">×</span>`;
                listDiv.appendChild(tag);
            });
        }

        toggleBtn.onclick = () => {
            panelBody.style.display = panelBody.style.display === "none" ? "block" : "none";
        };

        input.addEventListener("keypress", e => {
            if (e.key === "Enter" && input.value.trim()) {
                blockKeywords.push(input.value.trim());
                input.value = "";
                renderList();
            }
        });

        listDiv.addEventListener("click", e => {
            if (e.target.classList.contains("xhh-remove")) {
                const idx = e.target.dataset.idx;
                blockKeywords.splice(idx, 1);
                renderList();
            }
        });

        saveBtn.onclick = () => {
            GM_setValue("blockKeywords", blockKeywords);
            alert("✅ 关键词已保存");
            hideBlockedComments();
        };

        renderList();
    }

    createSettingsPanel();
    console.log("[小黑盒屏蔽脚本] 支持子评论插眼过滤 ✅");
})();
