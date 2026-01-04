// ==UserScript==
// @name         Linux.do 导出Markdown (自定义楼层版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持自定义楼层导出，格式如 2-5,8,10。逐楼跳转提取，确保完整导出。
// @author       Zhu
// @match        https://linux.do/t/*
// @match        https://idcflare.com/t/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/561226/Linuxdo%20%E5%AF%BC%E5%87%BAMarkdown%20%28%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A5%BC%E5%B1%82%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561226/Linuxdo%20%E5%AF%BC%E5%87%BAMarkdown%20%28%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A5%BC%E5%B1%82%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置 ====================
    const FLOOR_LOAD_DELAY_MS = 400;  // 每个楼层跳转后等待时间（优化后）
    const MAX_RETRY = 2;               // 每个楼层最大重试次数（优化后）

    // ==================== 工具函数 ====================
    // 防抖函数，优化高频调用
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ==================== HTML to Markdown 转换 ====================
    function html2md(node) {
        let md = "";
        function process(node) {
            if (!node) return;
            if (node.nodeType === Node.TEXT_NODE) {
                md += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let tag = node.tagName.toLowerCase();

                if (tag.match(/^h[1-6]$/)) {
                    let level = '#'.repeat(parseInt(tag[1]));
                    let headerText = node.textContent.trim();
                    headerText = headerText.replace(/^\[\]\([^)]+\)\s*/, '');
                    md += level + ' ' + headerText + '\n\n';
                    return;
                }

                if (tag === "br") md += "  \n";
                else if (tag === "p") {
                    let content = processChildren(node).trim();
                    if (content) md += content + "\n\n";
                }
                else if (tag === "strong" || tag === "b") md += "**" + processChildren(node) + "**";
                else if (tag === "em" || tag === "i") md += "_" + processChildren(node) + "_";
                else if (tag === "ol") {
                    let i = 1;
                    node.childNodes.forEach(li => {
                        if (li.tagName && li.tagName.toLowerCase() === "li")
                            md += i++ + ". " + processChildren(li).replace(/\n/g, " ").trim() + "\n";
                    });
                    md += "\n";
                }
                else if (tag === "ul") {
                    node.childNodes.forEach(li => {
                        if (li.tagName && li.tagName.toLowerCase() === "li")
                            md += "- " + processChildren(li).replace(/\n/g, " ").trim() + "\n";
                    });
                    md += "\n";
                }
                else if (tag === "li") md += processChildren(node) + "\n";
                else if (tag === "a") {
                    let href = node.getAttribute('href') || '';
                    let text = processChildren(node).trim();
                    if (!text && href.startsWith('#')) return;
                    if (href.startsWith('#p-') && node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE) return;
                    md += `[${text}](${href})`;
                }
                else if (tag === "img") {
                    let alt = node.getAttribute('alt') || '';
                    let src = node.getAttribute('src') || '';
                    md += `![${alt}](${src})`;
                }
                else if (tag === "table") {
                    let rows = Array.from(node.querySelectorAll("tr")).map(tr =>
                        Array.from(tr.querySelectorAll("th,td")).map(td => td.innerText.trim())
                    );
                    if (rows.length >= 2) {
                        md += "| " + rows[0].join(" | ") + " |\n" +
                            "| " + rows[0].map(_ => "---").join(" | ") + " |\n";
                        for (let i = 1; i < rows.length; i++) {
                            md += "| " + rows[i].join(" | ") + " |\n";
                        }
                        md += "\n";
                    }
                }
                else if (tag === "details") {
                    let summary = node.querySelector("summary");
                    if (summary) {
                        md += `<details>\n<summary>${summary.innerText}</summary>\n\n`;
                        summary.remove();
                        md += processChildren(node).trim() + "\n";
                        md += `</details>\n\n`;
                    }
                }
                else if (tag === "blockquote") {
                    let content = processChildren(node).trim();
                    if (content) {
                        let lines = content.split('\n').filter(line => line.trim());
                        md += lines.map(line => "> " + line).join("\n") + "\n\n";
                    }
                }
                else if (tag === "code" && node.parentElement && node.parentElement.tagName.toLowerCase() === "pre") {
                    let codeContent = node.textContent;
                    if (codeContent.endsWith('\n')) codeContent = codeContent.slice(0, -1);
                    md += "```\n" + codeContent + "\n```\n\n";
                }
                else if (tag === "code") {
                    md += "`" + node.textContent + "`";
                }
                else if (tag === "pre") {
                    if (!node.querySelector("code")) {
                        let codeContent = node.textContent;
                        if (codeContent.endsWith('\n')) codeContent = codeContent.slice(0, -1);
                        md += "```\n" + codeContent + "\n```\n\n";
                    } else {
                        md += processChildren(node);
                    }
                }
                else if (tag === "hr") {
                    md += "\n---\n\n";
                }
                else {
                    md += processChildren(node);
                }
            }
        }

        function processChildren(node) {
            let temp = md;
            md = "";
            node.childNodes.forEach(process);
            let res = md;
            md = temp;
            return res;
        }

        process(node);
        return md;
    }

    function cleanMarkdown(md) {
        md = md.replace(/\n{3,}/g, '\n\n');
        md = md.replace(/(^|\n)(>.*\n)+/g, function (match) {
            let lines = match.split('\n').filter(line => line.trim());
            return lines.join('\n') + '\n\n';
        });
        md = md.replace(/^(#{1,6})\s*\[\]\([^)]+\)\s*(.+)$/gm, '$1 $2');
        md = md.replace(/^\[\]\(#[^)]+\)\s*$/gm, '');
        md = md.replace(/```\n\n+```/g, '```\n\n```');
        md = md.replace(/```\n{3,}/g, '```\n\n');
        md = md.replace(/(\[\]\([^)]+\))?!\[:[^:]+:\]\([^)]+\)\s*/g, "");
        md = md.replace(/\[!\[([^\]]*)\]\([^)]+\)[^\]]*?\]\(([^)]+)\)/g, '![$1]($2)');
        md = md.trimEnd() + '\n';
        return md;
    }

    // ==================== 获取帖子总楼层数 ====================
    function getTotalFloorCount() {
        // 从 timeline-replies 获取总楼层数 "290 / 294"
        const timelineReplies = document.querySelector('.timeline-replies');
        if (timelineReplies) {
            const text = timelineReplies.textContent.trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);
            if (match) {
                return parseInt(match[2], 10);
            }
        }

        // 备用：从 topic-map 获取
        const postsCount = document.querySelector('.topic-map .posts-count, .topic-map .number');
        if (postsCount) {
            const num = parseInt(postsCount.textContent.replace(/\D/g, ''), 10);
            if (num > 0) return num;
        }

        return 100; // 默认值
    }

    // ==================== 楼层解析 ====================
    function parseFloorInput(input, maxFloor = Infinity) {
        if (!input || !input.trim()) return [];
        const floors = new Set();
        const parts = input.split(',').map(s => s.trim()).filter(s => s);

        for (const part of parts) {
            if (part.includes('-')) {
                let [a, b] = part.split('-').map(s => parseInt(s.trim(), 10));
                if (!isNaN(a) && !isNaN(b)) {
                    const start = Math.min(a, b);
                    const end = Math.max(a, b);
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= maxFloor) {
                            floors.add(i);
                        }
                    }
                }
            } else {
                const num = parseInt(part, 10);
                if (!isNaN(num) && num > 0 && num <= maxFloor) {
                    floors.add(num);
                }
            }
        }

        return Array.from(floors).sort((a, b) => a - b);
    }

    // ==================== 获取基础 URL ====================
    function getBaseTopicUrl() {
        // 从 URL 提取 topic 路径，如 /t/topic/123456
        const match = window.location.pathname.match(/^(\/t\/[^\/]+\/\d+)/);
        if (match) {
            return window.location.origin + match[1];
        }
        return window.location.href.split('?')[0].replace(/\/\d+$/, '');
    }

    // ==================== 跳转到指定楼层并提取内容 ====================
    async function jumpToFloorAndExtract(floorNum, baseUrl) {
        return new Promise((resolve) => {
            // 创建隐藏的 iframe 来加载特定楼层
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
            document.body.appendChild(iframe);

            const targetUrl = `${baseUrl}/${floorNum}`;
            let retries = 0;

            const tryExtract = () => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    // 查找帖子内容
                    const post = doc.querySelector(`#post_${floorNum}`);
                    const cooked = post?.querySelector('.cooked');

                    if (cooked) {
                        const username = post.dataset?.username ||
                            post.querySelector('.names .username a, .names span')?.innerText?.trim() ||
                            'User';
                        const time = post.querySelector('.post-date span[title]')?.getAttribute('title') || '';
                        const content = html2md(cooked).trim();

                        iframe.remove();
                        resolve({ floorNum, username, time, content, success: true });
                        return;
                    }

                    // 重试
                    if (retries < MAX_RETRY) {
                        retries++;
                        setTimeout(tryExtract, FLOOR_LOAD_DELAY_MS);
                    } else {
                        iframe.remove();
                        resolve({ floorNum, success: false });
                    }
                } catch (e) {
                    if (retries < MAX_RETRY) {
                        retries++;
                        setTimeout(tryExtract, FLOOR_LOAD_DELAY_MS);
                    } else {
                        iframe.remove();
                        resolve({ floorNum, success: false });
                    }
                }
            };

            iframe.onload = () => {
                setTimeout(tryExtract, FLOOR_LOAD_DELAY_MS);
            };

            iframe.onerror = () => {
                iframe.remove();
                resolve({ floorNum, success: false });
            };

            iframe.src = targetUrl;
        });
    }

    // ==================== 从当前页面提取单个楼层 ====================
    function extractFloorFromCurrentPage(floorNum) {
        const post = document.querySelector(`#post_${floorNum}`);
        if (!post) return null;

        const cooked = post.querySelector('.cooked');
        if (!cooked) return null;

        const username = post.dataset?.username ||
            post.querySelector('.names .username a, .names span')?.innerText?.trim() ||
            'User';
        const time = post.querySelector('.post-date span[title]')?.getAttribute('title') || '';
        const content = html2md(cooked).trim();

        return { floorNum, username, time, content, success: true };
    }

    // ==================== 滚动到指定楼层 ====================
    async function scrollToFloor(floorNum) {
        // 使用 Discourse 的 timeline 跳转
        const baseUrl = getBaseTopicUrl();

        // 修改 URL hash 来触发跳转
        const targetUrl = `${baseUrl}/${floorNum}`;

        return new Promise((resolve) => {
            // 保存当前滚动位置
            const originalUrl = window.location.href;

            // 使用 history API 跳转
            window.history.pushState({}, '', targetUrl);

            // 触发 Discourse 的路由更新
            window.dispatchEvent(new PopStateEvent('popstate'));

            // 等待内容加载
            setTimeout(() => {
                // 尝试滚动到帖子
                const post = document.querySelector(`#post_${floorNum}`);
                if (post) {
                    post.scrollIntoView({ behavior: 'instant', block: 'center' });
                }
                resolve();
            }, FLOOR_LOAD_DELAY_MS);
        });
    }

    // ==================== 弹窗 UI ====================
    function escapeHtml(unsafe) {
        return unsafe.replace(/[&<>"']/g, m =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])
        );
    }

    function showFloorSelector(callback) {
        const totalFloors = getTotalFloorCount();
        const defaultEnd = Math.min(10, totalFloors);

        const overlay = document.createElement('div');
        overlay.style = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            padding: 24px;
            min-width: 380px;
            max-width: 90vw;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #333; font-size: 18px;">选择导出楼层</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                格式: <code style="background: #f5f5f5; padding: 2px 6px; border-radius: 4px;">2-5,8,10</code>
            </p>
            <p style="margin: 0 0 12px 0; color: #888; font-size: 12px;">
                📊 本帖共 <strong style="color: #339AF0;">${totalFloors}</strong> 楼 | 支持逆序范围如 <code style="background: #f5f5f5; padding: 1px 4px; border-radius: 3px;">7-5</code>
            </p>
            <input type="text" id="floor-input" value="2-${defaultEnd}" style="
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                box-sizing: border-box;
                outline: none;
                transition: border-color 0.2s;
            " placeholder="例如: 2-10 或 2,4,6-8">
            <div id="floor-preview" style="
                margin-top: 8px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 6px;
                font-size: 13px;
                color: #666;
                min-height: 20px;
            ">将导出: 2, 3, 4, 5, 6, 7, 8, 9, 10</div>
            <label style="display: flex; align-items: center; margin: 16px 0; cursor: pointer; user-select: none;">
                <input type="checkbox" id="include-floor1" style="
                    width: 18px; height: 18px; margin-right: 10px; cursor: pointer;
                ">
                <span style="color: #555; font-size: 14px;">包含1楼（原帖）</span>
            </label>
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button id="cancel-btn" style="
                    padding: 10px 20px;
                    border: 1px solid #ddd;
                    background: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    transition: all 0.2s;
                ">取消</button>
                <button id="confirm-btn" style="
                    padding: 10px 24px;
                    border: none;
                    background: #339AF0;
                    color: #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                ">确认导出</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const input = modal.querySelector('#floor-input');
        const includeFloor1 = modal.querySelector('#include-floor1');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const confirmBtn = modal.querySelector('#confirm-btn');
        const previewDiv = modal.querySelector('#floor-preview');

        input.focus();
        input.select();

        function updatePreview() {
            let floors = parseFloorInput(input.value, totalFloors);
            if (includeFloor1.checked && !floors.includes(1)) {
                floors = [1, ...floors];
            }
            if (floors.length === 0) {
                previewDiv.innerHTML = '<span style="color: #dc3545;">⚠️ 无有效楼层</span>';
            } else if (floors.length > 20) {
                previewDiv.innerHTML = `将导出: ${floors.slice(0, 10).join(', ')}... 等 <strong>${floors.length}</strong> 楼`;
            } else {
                previewDiv.innerHTML = `将导出: ${floors.join(', ')}`;
            }
        }

        input.addEventListener('input', updatePreview);
        includeFloor1.addEventListener('change', updatePreview);
        updatePreview();

        input.addEventListener('focus', () => input.style.borderColor = '#339AF0');
        input.addEventListener('blur', () => input.style.borderColor = '#e0e0e0');
        cancelBtn.addEventListener('mouseenter', () => cancelBtn.style.background = '#f5f5f5');
        cancelBtn.addEventListener('mouseleave', () => cancelBtn.style.background = '#fff');
        confirmBtn.addEventListener('mouseenter', () => confirmBtn.style.background = '#1c7ed6');
        confirmBtn.addEventListener('mouseleave', () => confirmBtn.style.background = '#339AF0');

        const close = () => overlay.remove();

        cancelBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        confirmBtn.addEventListener('click', () => {
            let floors = parseFloorInput(input.value, totalFloors);
            const include1 = includeFloor1.checked;

            if (include1 && !floors.includes(1)) {
                floors = [1, ...floors];
            }

            if (floors.length === 0) {
                input.style.borderColor = '#dc3545';
                input.focus();
                return;
            }

            close();
            callback({ floors, include1, totalFloors });
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') confirmBtn.click();
            if (e.key === 'Escape') close();
        });
    }

    function showProgressModal() {
        const overlay = document.createElement('div');
        overlay.id = 'md-progress-overlay';
        overlay.style = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modal = document.createElement('div');
        modal.style = `
            background: #fff;
            border-radius: 12px;
            padding: 32px 48px;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;

        modal.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 16px;">📝</div>
            <div id="progress-text" style="font-size: 16px; color: #333; margin-bottom: 12px;">准备中...</div>
            <div style="width: 200px; height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden;">
                <div id="progress-bar" style="width: 0%; height: 100%; background: #339AF0; transition: width 0.3s;"></div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        return {
            update: (text, percent) => {
                const textEl = document.getElementById('progress-text');
                const barEl = document.getElementById('progress-bar');
                if (textEl) textEl.textContent = text;
                if (barEl) barEl.style.width = `${percent}%`;
            },
            close: () => overlay.remove()
        };
    }

    function showResultModal(text, exportedFloors, requestedFloors) {
        const modal = document.createElement('div');
        modal.style = `
            position: fixed;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 94vw;
            max-width: 700px;
            max-height: 80vh;
            overflow: auto;
            z-index: 9999;
            background: #23272e;
            color: #eee;
            border-radius: 8px;
            box-shadow: 0 4px 24px #000a;
            padding: 18px 22px;
            font-size: 15px;
            line-height: 1.7;
        `;

        const statusInfo = exportedFloors.length === requestedFloors.length
            ? `✅ 成功导出全部 ${exportedFloors.length} 楼`
            : `⚠️ 导出 ${exportedFloors.length}/${requestedFloors.length} 楼 (部分楼层可能已删除)`;

        modal.innerHTML = `
            <div style="text-align:right;">
                <button id="md-modal-close" style="font-size:18px;border:none;background:transparent;color:#fff;cursor:pointer;">
                    ✖
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <b>已自动复制到剪贴板</b>
                <span style="margin-left: 12px; font-size: 13px; color: #aaa;">${statusInfo}</span>
            </div>
            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">
                导出楼层: ${exportedFloors.join(', ')}
            </div>
            <hr style="border-color: #444;">
            <pre style="white-space:pre-wrap;word-break:break-all;font-family:monospace;margin:1em 0 0 0;">${escapeHtml(text)}</pre>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#md-modal-close').addEventListener('click', () => modal.remove());
    }

    // ==================== 文件下载 ====================
    function sanitizeFileName(name) {
        return (name || 'linuxdo-post').replace(/[\\/:*?"<>|]/g, '_').trim() || 'linuxdo-post';
    }

    function downloadMarkdownFile(filename, content) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    // ==================== 主流程 ====================
    async function handleExport(options) {
        const { floors, totalFloors } = options;
        const title = document.querySelector('.fancy-title')?.innerText || document.title || 'linuxdo-post';
        const baseUrl = getBaseTopicUrl();

        const progress = showProgressModal();
        const results = [];

        // 保存原始 URL
        const originalUrl = window.location.href;

        for (let i = 0; i < floors.length; i++) {
            const floorNum = floors[i];
            const percent = Math.round(((i + 1) / floors.length) * 100);
            progress.update(`正在提取第 ${floorNum} 楼... (${i + 1}/${floors.length})`, percent);

            // 先尝试从当前页面提取
            let result = extractFloorFromCurrentPage(floorNum);

            if (!result) {
                // 跳转到该楼层
                await scrollToFloor(floorNum);
                await new Promise(resolve => setTimeout(resolve, FLOOR_LOAD_DELAY_MS));
                result = extractFloorFromCurrentPage(floorNum);
            }

            if (result) {
                results.push(result);
            } else {
                console.log(`[MD Export] 无法提取第 ${floorNum} 楼`);
            }
        }

        // 恢复原始 URL
        window.history.replaceState({}, '', originalUrl);

        progress.close();

        // 生成 Markdown
        let md = `# ${title}\n\n`;
        md += `> 来源: ${baseUrl}\n`;
        md += `> 导出楼层: ${floors.join(', ')}\n\n`;

        const exportedFloors = [];
        for (const result of results) {
            md += `---\n\n`;
            md += `## [${result.floorNum}楼] ${result.username}\n\n`;
            if (result.time) md += `*${result.time}*\n\n`;
            md += result.content + '\n\n';
            exportedFloors.push(result.floorNum);
        }
        md += '---\n';
        md = cleanMarkdown(md);

        if (exportedFloors.length === 0) {
            alert('未能导出任何楼层内容！');
            return;
        }

        // 复制到剪贴板
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(md);
        }

        // 下载文件
        const safeName = sanitizeFileName(title) + '.md';
        downloadMarkdownFile(safeName, md);

        showResultModal(md, exportedFloors, floors);
    }

    // ==================== 原版按钮（仅1楼） ====================
    function buildMarkdownFloor1() {
        let article = document.querySelector('#post_1');
        if (!article) return { md: '', title: 'linuxdo-post' };

        let cooked = article.querySelector('.cooked');
        let title = document.querySelector('.fancy-title')?.innerText || document.title || 'linuxdo-post';
        let author = article.querySelector('.topic-meta-data .username a,.topic-meta-data .full-name a')?.innerText || '';
        let time = article.querySelector('.post-date span[title]')?.getAttribute('title') || '';

        let md = `# ${title}\n\n`;
        if (author) md += `**作者：${author}**  \n`;
        if (time) md += `**时间：${time}**  \n\n`;
        if (cooked) md += html2md(cooked).trim();

        md = cleanMarkdown(md);
        return { md, title };
    }

    // ==================== 插入按钮 ====================
    function insertBtnByXpath() {
        let actionsDiv = document.querySelector('#post_1 > div.row > div.topic-body > div.regular.contents > section.post-menu-area > nav > div.actions');
        if (!actionsDiv) return;
        if (actionsDiv.querySelector('.export-md-btn')) return;

        // 导出1楼按钮
        let btnExport = document.createElement('button');
        btnExport.className = 'btn no-text btn-icon export-md-btn';
        btnExport.title = '导出1楼为Markdown（复制到剪贴板）';
        btnExport.type = 'button';
        btnExport.style = 'margin-right:8px;';
        btnExport.innerHTML = `
<svg class="fa d-icon d-icon-d-post-share svg-icon svg-string" aria-hidden="true" style="width:1.25em;height:1.25em;vertical-align:-0.1em;"><use href="#link"></use></svg>
<span class="d-button-label">导出1楼</span>
        `.trim();

        btnExport.onclick = function (e) {
            e.stopPropagation();
            const { md } = buildMarkdownFloor1();
            if (!md) return;
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(md);
            }
            showResultModal(md, [1], [1]);
        };

        // 下载1楼按钮
        let btnDownload = document.createElement('button');
        btnDownload.className = 'btn no-text btn-icon export-md-btn';
        btnDownload.title = '直接下载1楼为 Markdown 文件';
        btnDownload.type = 'button';
        btnDownload.style = 'margin-right:8px;';
        btnDownload.innerHTML = `
<svg class="fa d-icon d-icon-d-post-share svg-icon svg-string" aria-hidden="true" style="width:1.25em;height:1.25em;vertical-align:-0.1em;"><use href="#link"></use></svg>
<span class="d-button-label">下载1楼</span>
        `.trim();

        btnDownload.onclick = function (e) {
            e.stopPropagation();
            const { md, title } = buildMarkdownFloor1();
            if (!md) return;
            const safeName = sanitizeFileName(title) + '.md';
            downloadMarkdownFile(safeName, md);
        };

        // 自定义楼层导出按钮
        let btnMultiFloor = document.createElement('button');
        btnMultiFloor.className = 'btn no-text btn-icon export-md-btn';
        btnMultiFloor.title = '选择楼层导出Markdown';
        btnMultiFloor.type = 'button';
        btnMultiFloor.style = 'margin-right:8px; background: #339AF0; color: #fff; border-radius: 4px;';
        btnMultiFloor.innerHTML = `
<svg class="fa d-icon svg-icon svg-string" aria-hidden="true" style="width:1.25em;height:1.25em;vertical-align:-0.1em;"><use href="#list"></use></svg>
<span class="d-button-label" style="color: #fff;">自定义楼层</span>
        `.trim();

        btnMultiFloor.onclick = function (e) {
            e.stopPropagation();
            showFloorSelector(handleExport);
        };

        actionsDiv.appendChild(btnExport);
        actionsDiv.appendChild(btnDownload);
        actionsDiv.appendChild(btnMultiFloor);
    }

    // ==================== 页面楼层号显示 ====================
    function injectFloorNumbers() {
        const posts = document.querySelectorAll('article[data-post-id]');
        posts.forEach(post => {
            // 跳过已经注入过的
            if (post.querySelector('.floor-number-badge')) return;

            // 获取楼层号
            const id = post.id;
            let floorNum = 0;
            if (id && id.startsWith('post_')) {
                floorNum = parseInt(id.replace('post_', ''), 10);
            }
            if (!floorNum) {
                const postNumber = post.getAttribute('data-post-number');
                if (postNumber) floorNum = parseInt(postNumber, 10);
            }
            if (!floorNum) return;

            // 查找时间元素
            const timeEl = post.querySelector('.post-date, .relative-date');
            if (!timeEl) return;

            // 创建楼层标签
            const badge = document.createElement('span');
            badge.className = 'floor-number-badge';
            badge.textContent = `${floorNum}楼`;
            badge.style.cssText = `
                display: inline-block;
                background: #339AF0;
                color: #fff;
                font-size: 11px;
                font-weight: 600;
                padding: 2px 6px;
                border-radius: 4px;
                margin-right: 6px;
                vertical-align: middle;
            `;

            // 插入到时间前面
            timeEl.parentNode.insertBefore(badge, timeEl);
        });
    }

    // 使用 MutationObserver 监听新加载的帖子（使用防抖优化）
    function observeNewPosts() {
        const debouncedInject = debounce(injectFloorNumbers, 100);

        const observer = new MutationObserver(debouncedInject);

        const postStream = document.querySelector('.post-stream');
        if (postStream) {
            observer.observe(postStream, { childList: true, subtree: false });
        }

        // 监听 body 但只监听直接子节点变化
        observer.observe(document.body, { childList: true, subtree: false });
    }

    // 立即开始尝试注入，不等待
    function initScript() {
        injectFloorNumbers();
        insertBtnByXpath();
        observeNewPosts();
    }

    // 多次尝试，确保加载成功
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScript();
    } else {
        document.addEventListener('DOMContentLoaded', initScript);
    }

    // 快速重试几次以确保内容加载后注入
    setTimeout(initScript, 500);
    setTimeout(initScript, 1000);
    setTimeout(initScript, 2000);
})();
