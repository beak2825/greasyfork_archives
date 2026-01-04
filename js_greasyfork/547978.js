// ==UserScript==
// @name         自动显示 pikpak refresh_token 值
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  页面加载 5 秒后，读取 localStorage 中以 credentials 开头的选项，只显示其中的 refresh_token 值（浮动框显示，可复制）。
// @author       superszy
// @match        https://mypikpak.com/drive/all*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547978/%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%20pikpak%20refresh_token%20%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/547978/%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%20pikpak%20refresh_token%20%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        let tokens = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("credentials")) {
                try {
                    const value = JSON.parse(localStorage.getItem(key));
                    if (value && value.refresh_token) {
                        tokens.push(value.refresh_token);
                    }
                } catch (e) {
                    console.warn(`无法解析 ${key} 的值:`, e);
                }
            }
        }

        // 创建浮动窗口
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "20px";
        box.style.width = "400px";
        box.style.maxHeight = "300px";
        box.style.overflowY = "auto";
        box.style.background = "#fff";
        box.style.border = "1px solid #ccc";
        box.style.borderRadius = "8px";
        box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        box.style.zIndex = "10000";
        box.style.fontSize = "14px";
        box.style.color = "#333";

        // 标题栏
        const title = document.createElement("div");
        title.innerText = "refresh_token";
        title.style.background = "#4CAF50";
        title.style.color = "#fff";
        title.style.padding = "8px";
        title.style.borderTopLeftRadius = "8px";
        title.style.borderTopRightRadius = "8px";
        title.style.fontWeight = "bold";
        box.appendChild(title);

        // 内容区（只显示 refresh_token 值）
        const content = document.createElement("textarea");
        content.style.width = "100%";
        content.style.height = "220px";
        content.style.border = "none";
        content.style.outline = "none";
        content.style.resize = "none";
        content.style.padding = "8px";
        content.value = tokens.length > 0 ? tokens.join("\n") : "没有找到 refresh_token。";
        box.appendChild(content);

        // 一键复制按钮
        const copyBtn = document.createElement("button");
        copyBtn.innerText = "复制";
        copyBtn.style.background = "#2196F3";
        copyBtn.style.color = "#fff";
        copyBtn.style.border = "none";
        copyBtn.style.padding = "6px 12px";
        copyBtn.style.margin = "8px";
        copyBtn.style.borderRadius = "4px";
        copyBtn.style.cursor = "pointer";
        copyBtn.onclick = () => {
            content.select();
            document.execCommand("copy");
            copyBtn.innerText = "已复制!";
            setTimeout(() => copyBtn.innerText = "复制", 1500);
        };
        box.appendChild(copyBtn);

        // 关闭按钮
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "关闭";
        closeBtn.style.background = "#f44336";
        closeBtn.style.color = "#fff";
        closeBtn.style.border = "none";
        closeBtn.style.padding = "6px 12px";
        closeBtn.style.margin = "8px";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => box.remove();
        box.appendChild(closeBtn);

        document.body.appendChild(box);
    }, 3000);
})();
