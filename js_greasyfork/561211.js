// ==UserScript==
// @name         网页内容提取器（Extract Page Content）
// @namespace    https://bg0axe.com
// @version      2.1
// @description  Extract Page Content to Single File (with Base64 Images). Extracts visible page content including images (converted to Base64) into a single downloadable Markdown file.
// @author       药尘子
// @match        *://*/*
// @grant        GM_addElement
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://unpkg.com/turndown/dist/turndown.js
// @license      GPL-3.0-or-later
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561211/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88Extract%20Page%20Content%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561211/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88Extract%20Page%20Content%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 工具函数：获取格式化时间戳 (YYYYMMDDTHHMM) ---
    function getFormattedTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}`;
    }

    // --- 工具函数：清理文件名 ---
    function getCleanTitle() {
        let title = document.title || 'extracted_content';
        // 1. 替换空格和特殊空白符为下划线
        // 2. 移除非法文件名字符 (保留中文字符、字母、数字、下划线)
        // 3. 压缩连续的下划线
        return title.replace(/[\s\uFEFF\xA0]+/g, '_')
                    .replace(/[^a-z0-9\u4e00-\u9fa5_]/gi, '')
                    .replace(/__+/g, '_')
                    .replace(/^_|_$/g, ''); // 去除首尾下划线
    }

    // --- 工具函数：转换绝对路径 ---
    function makeUrlsAbsolute(doc) {
        const base = window.location.href;
        doc.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('http')) {
                try { img.setAttribute('src', new URL(src, base).href); } catch(e) {}
            }
        });
        doc.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript:')) {
                try { a.setAttribute('href', new URL(href, base).href); } catch(e) {}
            }
        });
    }

    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- 主转换逻辑 ---
    async function convertToMarkdown() {
        Swal.fire({
            title: '正在生成 Markdown...',
            html: '<p id="md-status">解析网页中...</p>',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // 1. 克隆并清理
        const doc = document.cloneNode(true);
        const cleaners = 'script, style, noscript, iframe, .gm-extract-btn, .swal2-container, header, footer, nav, aside';
        doc.querySelectorAll(cleaners).forEach(el => el.remove());

        // 2. 修复链接
        makeUrlsAbsolute(doc);

        // 3. 转换
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced'
        });

        // 强化图片处理
        turndownService.addRule('keepImages', {
            filter: 'img',
            replacement: function (content, node) {
                const alt = node.getAttribute('alt') || 'image';
                const src = node.getAttribute('src') || '';
                return src ? `![${alt}](${src})` : '';
            }
        });

        try {
            const markdown = turndownService.turndown(doc.body);
            const sourceUrl = window.location.href;
            const finalContent = `# ${document.title}\n\n> 来源: [${sourceUrl}](${sourceUrl})\n> 提取时间: ${new Date().toLocaleString()}\n\n---\n\n${markdown}`;

            // 生成符合要求的名称：标题_20260103T1348.md
            const filename = `${getCleanTitle()}_${getFormattedTimestamp()}.md`;

            downloadFile(filename, finalContent);

            Swal.fire({
                title: '提取完成',
                text: filename,
                icon: 'success',
                timer: 2000
            });
        } catch (error) {
            Swal.fire('失败', '转换 Markdown 出错', 'error');
        }
    }

    // --- UI 按钮维护 ---
    function injectButton() {
        if (document.getElementById('gm-extract-md-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'gm-extract-md-btn';
        btn.textContent = '📝 提取 Markdown';
        Object.assign(btn.style, {
            position: 'fixed', top: '15px', right: '15px', zIndex: '2147483647',
            backgroundColor: '#007AFF', color: 'white', border: '2px solid white',
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        });
        btn.onclick = (e) => { e.preventDefault(); convertToMarkdown(); };
        (document.body || document.documentElement).appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }
    const observer = new MutationObserver(() => {
        if (!document.getElementById('gm-extract-md-btn')) injectButton();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();