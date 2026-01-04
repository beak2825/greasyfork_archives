// ==UserScript==
// @name         SEU-Thesis-Download
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  东南大学硕博论文数据库，下载论文 PDF，自动命名为 标题_作者_年份.pdf
// @author       Kanhao100
// @match        http://223.3.67.16/tpi651/Detail*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560893/SEU-Thesis-Download.user.js
// @updateURL https://update.greasyfork.org/scripts/560893/SEU-Thesis-Download.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- 工具：文件名清洗 ---
    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim();
    }
 
    // --- 核心：从 HTML 解析元数据 ---
    function extractMetadata() {
        let meta = {
            title: "未知标题",
            author: "未知作者",
            year: "0000"
        };
 
        // 1. 提取作者 (h2 class='doc-title')
        const authorElem = document.querySelector('h2.doc-title');
        if (authorElem) meta.author = authorElem.innerText.trim();
 
        // 2. 遍历所有条目提取 标题 和 年份
        // 页面结构是: <p><div><span class="con-type">标签：</span>内容</div></p>
        const items = document.querySelectorAll('.con-type');
        items.forEach(span => {
            const label = span.innerText;
            const content = span.parentNode.innerText.replace(label, "").trim(); // 获取父级文本并移除标签部分
 
            if (label.includes("论文中文题名")) {
                meta.title = content;
            }
            if (label.includes("论文答辩日期") || label.includes("归档日期")) {
                // 内容通常是 2025/5/24，提取前4位
                const match = content.match(/\d{4}/);
                if (match) meta.year = match[0];
            }
        });
 
        console.log("[SEU Parse] 解析结果:", meta);
        return meta;
    }
 
    // --- 核心：从隐藏 DOM 提取真实下载链接 ---
    function extractDownloadUrl() {
        // 找到隐藏的下载区域
        const downDiv = document.querySelector('.talkDiv.Down');
        if (!downDiv) return null;
 
        // 找到里面的 <a> 标签
        const linkObj = downDiv.querySelector('a.btn');
        if (!linkObj) return null;
 
        // 提取 onclick 属性: onclick="javascript:isDown(..., '/tpi651/File/GetDigitalFile?...', ...)"
        const onclickStr = linkObj.getAttribute('onclick');
        // 正则提取单引号中间的 URL
        // 匹配模式：寻找以 /tpi651/File/GetDigitalFile 开头的字符串
        const urlMatch = onclickStr.match(/'(\/tpi651\/File\/GetDigitalFile[^']+)'/);
        if (urlMatch && urlMatch[1]) {
            return window.location.origin + urlMatch[1]; // 补全域名
        }
        return null;
    }
 
    // --- 下载执行 ---
    async function startDownload(btn) {
        const meta = extractMetadata();
        const downloadUrl = extractDownloadUrl();
 
        if (!downloadUrl) {
            alert("无法解析下载链接，请检查页面是否已登录或权限是否过期。");
            return;
        }
 
        const filename = sanitizeFilename(`${meta.title}_${meta.author}_${meta.year}.pdf`);
        // UI 更新
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="iconfont">&#xe61a;</i> 正在下载...'; // 使用加载图标或文字
        btn.style.backgroundColor = "#f0ad4e"; // 橙色加载中
 
        try {
            // 使用 fetch 获取文件流，以便重命名
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error("网络响应异常");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
 
            // 成功状态
            btn.innerHTML = '<i class="iconfont">&#xe61a;</i> 下载成功';
            btn.style.backgroundColor = "#5cb85c"; // 绿色
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "#009688"; // 恢复蓝绿色
            }, 3000);
 
        } catch (e) {
            console.error(e);
            alert("下载失败: " + e.message);
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "#009688";
        }
    }
 
    // --- UI 注入 ---
    function injectButton() {
        // 目标容器：在线预览按钮所在的 div
        const targetContainer = document.querySelector('.doc-value');
        if (!targetContainer) return;
 
        // 防止重复注入
        if (document.getElementById('seu-inject-dl')) return;
 
        // 创建按钮
        const btn = document.createElement('a');
        btn.id = 'seu-inject-dl';
        btn.className = 'btn btn-l'; // 复用原网站样式
        btn.innerHTML = '<i class="iconfont">&#xe642;</i> 立即下载'; // 使用自带的 iconfont (&#xe642; 是下载图标的常见代码，如果不对可以换)
        // 自定义样式覆盖
        btn.style.cssText = `
            margin-left: 15px;
            background-color: #009688; /* 区分颜色的蓝绿色 */
            color: white;
            cursor: pointer;
            border: 1px solid #009688;
        `;
 
        // 绑定点击事件
        btn.onclick = () => startDownload(btn);
 
        // 插入到“在线预览”按钮后面
        targetContainer.appendChild(btn);
    }
 
    // 执行
    window.onload = injectButton; // 等待资源加载完毕
    // 备用：如果页面是动态加载的，稍微延迟一下
    setTimeout(injectButton, 1000);
 
})();
