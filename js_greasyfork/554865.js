// ==UserScript==
// @name         AO3 文章下载
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  一键将 AO3 文章下载为纯文本文件
// @author       hydra
// @match        https://archiveofourown.org/works/*/chapters/*
// @match        https://archiveofourown.org/works/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554865/AO3%20%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/554865/AO3%20%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 仅在文章页面运行（排除评论、收藏等子页面）
    if (!/\/works\/\d+(\/|$)/.test(window.location.pathname)) {
        return;
    }

    // 创建下载按钮
    const button = document.createElement('button');
    button.textContent = '📥 下载为 TXT';
    button.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 8px 12px;
        background: #d4af37;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    `;
    button.addEventListener('click', downloadAsTxt);
    document.body.appendChild(button);

    function downloadAsTxt() {
        let txtContent = '';

        // 1. 添加当前 URL
        txtContent += window.location.href + '\n\n';

        // 2. 获取标题
        const titleEl = document.querySelector('h2.title.heading');
        if (titleEl) {
            const title = titleEl.textContent.trim();
            if (title) {
                txtContent += title + '\n\n';
            }
        }


        // 3. 检查是否有章节结构
        const chapterDivs = document.querySelectorAll('div.chapter');

        if (chapterDivs.length > 0) {
            // 多章节
            chapterDivs.forEach(chapter => {
                // 获取章节标题（h3.title）
                const chapterTitleEl = chapter.querySelector('h3.title');
                if (chapterTitleEl) {
                    // 清理可能的链接，只保留文本
                    const chapterTitle = chapterTitleEl.textContent.trim();
                    txtContent += chapterTitle + '\n\n';
                }

                // 获取章节正文（在 userstuff 里，且其 landmark heading 为 "Chapter Text"）
                const userstuff = chapter.querySelector('div.userstuff.module[role="article"]');
                if (userstuff) {
                    const chapterText = extractPlainText(userstuff);
                    txtContent += chapterText + '\n\n';
                }
            });
        } else {
            // 单章节：直接找 userstuff（注意可能有多个，但主文通常在外层或第一个）
            const userstuff = document.querySelector('div#chapters div.userstuff, div.userstuff.module[role="article"]');
            if (userstuff) {
                const text = extractPlainText(userstuff);
                txtContent += text + '\n';
            }
        }

        // 4. 下载为文件
        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getSafeFileName(titleEl?.textContent.trim() || 'AO3_Article') + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 提取纯文本并保留段落结构
    function extractPlainText(element) {
        if (!element) return '';

        // 克隆节点避免修改原始页面
        const clone = element.cloneNode(true);

        // 移除不需要的元素（如注释、元数据等）
        const unwanted = clone.querySelectorAll('div.meta, div.notes, div.series, h3.landmark, script, style');
        unwanted.forEach(el => el.remove());

        // 将 <br> 和 block 元素替换为换行
        const blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];
        blockElements.forEach(tag => {
            const elems = clone.querySelectorAll(tag);
            elems.forEach(el => {
                if (!el.innerHTML.trim()) return;
                el.innerHTML = el.innerHTML.trim() + '\n';
            });
        });

        // 处理 <br> 标签
        const brs = clone.querySelectorAll('br');
        brs.forEach(br => {
            br.parentNode.insertBefore(document.createTextNode('\n'), br);
            br.remove();
        });

        // 获取纯文本并清理多余空行
        let text = clone.textContent || '';
        text = text.replace(/\n\s*\n/g, '\n\n'); // 合并多余空行
        text = text.replace(/^\s+|\s+$/g, '');  // 去首尾空白

        return text;
    }

    // 生成安全的文件名（移除非法字符）
    function getSafeFileName(name) {
        return name
            .replace(/[<>:"/\\|?*\r\n\t]/g, '_')
            .substring(0, 100)
            .trim() || 'AO3_Article';
    }
})();