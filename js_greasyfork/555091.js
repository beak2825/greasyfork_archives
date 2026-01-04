// ==UserScript==
// @name         invites导出帖子为 Markdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 invites.fun 帖子页面添加一个按钮，将主楼内容导出为 Markdown (.md) 文件。
// @author       weian
// @license      MIT
// @match        https://invites.fun/d/*
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555091/invites%E5%AF%BC%E5%87%BA%E5%B8%96%E5%AD%90%E4%B8%BA%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/555091/invites%E5%AF%BC%E5%87%BA%E5%B8%96%E5%AD%90%E4%B8%BA%20Markdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入 Turndown 服务
    // @require 已经加载了 TurndownService
    let turndownService;
    if (typeof TurndownService !== 'undefined') {
        turndownService = new TurndownService({
            br: '  \n', // 保留 <br> 标签作为 Markdown 的硬换行
            headingStyle: 'atx', // 使用 # 风格的标题
            codeBlockStyle: 'fenced' // 使用 ``` 风格的代码块
        });

        // 添加规则，将相对链接转换为绝对链接
        turndownService.addRule('absoluteLinks', {
            filter: 'a',
            replacement: function(content, node) {
                try {
                    let href = node.getAttribute('href') || '';
                    if (!href || href.startsWith('javascript:')) {
                        return content; // 忽略无效链接
                    }
                    // 使用 document.location.href 作为基准来解析相对 URL
                    let absoluteUrl = new URL(href, document.location.href).href;
                    return `[${content}](${absoluteUrl})`;
                } catch (e) {
                    // 如果 URL 解析失败，则返回原始链接
                    return `[${content}](${node.getAttribute('href')})`;
                }
            }
        });

        // 添加规则，将相对图片路径转换为绝对路径
        turndownService.addRule('absoluteImages', {
            filter: 'img',
            replacement: function(content, node) {
                try {
                    let src = node.getAttribute('src') || '';
                    if (!src) {
                        return ''; // 忽略没有 src 的图片
                    }
                    let absoluteUrl = new URL(src, document.location.href).href;
                    let alt = node.getAttribute('alt') || '';
                    return `![${alt}](${absoluteUrl})`;
                } catch (e) {
                    return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src')})`;
                }
            }
        });

    } else {
        console.error('Turndown 库未能加载，脚本无法运行。');
        return;
    }

    // 2. 创建“导出”按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出为 Markdown';
    exportButton.className = 'export-md-button Button Button--primary'; // 复用论坛现有样式

    // 3. 添加按钮样式
    GM_addStyle(`
        .export-md-button {
            margin-bottom: 15px; /* 在按钮和帖子内容之间添加一些间距 */
        }
    `);

    // 4. 下载功能
    function download(filename, text) {
        const element = document.createElement('a');
        // 使用 text/markdown;charset=utf-8
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    // 5. 按钮点击事件
    exportButton.addEventListener('click', () => {
        // 查找第一个（主楼）帖子内容
        const postBody = document.querySelector('.Post-body');
        if (!postBody) {
            alert('未找到帖子内容 (class="Post-body")。');
            return;
        }

        // 获取帖子标题作为文件名
        let title = document.title.split(' - ')[0].trim();
        // 备用方案：从 h1 标签获取标题
        if (!title) {
            title = document.querySelector('.DiscussionPage-title')?.textContent.trim() || 'exported-article';
        }
        const filename = `${title}.md`;

        // 将 HTML 转换为 Markdown
        // 克隆节点以避免影响页面显示（虽然 turndown 默认不会修改）
        const contentToConvert = postBody.cloneNode(true);
        const markdown = turndownService.turndown(contentToConvert);

        // 触发下载
        download(filename, markdown);
    });

    // 6. 轮询检查页面元素是否加载
    // 这是一个动态加载内容的网站 (Flarum)，需要等待元素出现
    const checkInterval = setInterval(() => {
        const postStream = document.querySelector('.PostStream');
        if (postStream) {
            // 找到帖子流，将按钮插入到帖子流的顶部
            clearInterval(checkInterval);
            postStream.parentNode.insertBefore(exportButton, postStream);
        }
    }, 500); // 每 500ms 检查一次

})();