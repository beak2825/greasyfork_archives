// ==UserScript==
// @name         Gitlab - Issue预览浮窗
// @namespace    http://tampermonkey.net/
// @version      2025-11-12.008
// @description  在GitLab issue列表页面显示issue预览浮窗
// @author       无锡疏创信息科技有限公司
// @match        https://gitlab.scsoi.com:*/*
// @match        http://gitlab.scsoi.com:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/555616/Gitlab%20-%20Issue%E9%A2%84%E8%A7%88%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/555616/Gitlab%20-%20Issue%E9%A2%84%E8%A7%88%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * 作者：无锡疏创信息科技有限公司
 * 许可证：GPL-3.0
 * 允许自由使用、修改和分发，但必须保持相同许可证
 * 禁止商业用途闭源使用
 */

(() => {
    'use strict';

    // 检查当前页面URL是否包含gitlab关键字（不区分大小写）
    if (!window.location.href.toLowerCase().includes('gitlab')) {
        console.log('当前页面不包含gitlab关键字，脚本退出');
        return;
    }

    console.log('检测到gitlab页面，加载Issue预览脚本');

    // 添加动画样式
    document.head.appendChild(Object.assign(document.createElement('style'), {
        textContent: `
            @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
            @keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
            @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

            .issue-preview-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                animation: fadeIn 0.3s ease-out;
            }

            .issue-preview-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 60%;
                height: 100%;
                background: white;
                box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                overflow: hidden;
                animation: slideIn 0.3s ease-out;
                display: flex;
                flex-direction: column;
            }

            .issue-preview-header {
                padding: 20px;
                border-bottom: 1px solid #e1e4e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .issue-preview-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                flex: 1;
                line-height: 1.4;
            }

            .issue-preview-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            }

            .issue-preview-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .issue-preview-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .issue-preview-section {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }

            .issue-preview-section h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 16px;
            }

            .issue-preview-comment {
                margin-bottom: 15px;
                padding: 15px;
                background: white;
                border: 1px solid #e1e4e8;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .issue-preview-comment-author {
                font-weight: 600;
                color: #667eea;
                margin-bottom: 8px;
            }

            .issue-preview-comment-time {
                font-size: 12px;
                color: #999;
                margin-left: 10px;
            }

            .issue-preview-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 200px;
                color: #666;
            }

            .issue-preview-loading::before {
                content: '';
                width: 20px;
                height: 20px;
                border: 2px solid #e1e4e8;
                border-top: 2px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            }

            .issue-preview-error {
                padding: 20px;
                text-align: center;
                color: #d73a49;
                background: #ffdce0;
                border-radius: 8px;
                margin: 20px;
            }

            .markdown-body img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 10px 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .markdown-body {
                line-height: 1.6;
                color: #24292e;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            }

            .markdown-body .md-h1 {
                font-size: 2em;
                font-weight: 600;
                border-bottom: 2px solid #e1e4e8;
                padding-bottom: 10px;
                margin: 24px 0 16px 0;
                color: #24292e;
            }

            .markdown-body .md-h2 {
                font-size: 1.5em;
                font-weight: 600;
                border-bottom: 1px solid #e1e4e8;
                padding-bottom: 8px;
                margin: 24px 0 16px 0;
                color: #24292e;
            }

            .markdown-body .md-h3 {
                font-size: 1.25em;
                font-weight: 600;
                margin: 24px 0 16px 0;
                color: #24292e;
            }

            .markdown-body .md-h4 {
                font-size: 1em;
                font-weight: 600;
                margin: 18px 0 12px 0;
                color: #24292e;
            }

            .markdown-body .md-paragraph {
                margin-bottom: 16px;
                line-height: 1.6;
            }

            .markdown-body .md-strong {
                font-weight: 600;
                color: #24292e;
            }

            .markdown-body .md-em {
                font-style: italic;
                color: #586069;
            }

            .markdown-body .md-link {
                color: #0366d6;
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: border-color 0.2s;
            }

            .markdown-body .md-link:hover {
                border-bottom-color: #0366d6;
                text-decoration: underline;
            }

            .markdown-body pre {
                background: #f6f8fa;
                border-radius: 8px;
                padding: 16px;
                overflow: auto;
                margin: 16px 0;
                border: 1px solid #e1e4e8;
                font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
                font-size: 85%;
            }

            .markdown-body .inline-code {
                background: #f3f4f6;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 85%;
                color: #d73a49;
                font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            }

            .markdown-body .md-blockquote {
                border-left: 4px solid #dfe2e5;
                padding: 0 16px;
                margin: 16px 0;
                color: #586069;
                background: #f6f8fa;
                border-radius: 0 6px 6px 0;
            }

            .markdown-body .md-blockquote p {
                margin-bottom: 0;
            }

            .markdown-body .md-hr {
                border: none;
                border-top: 1px solid #e1e4e8;
                margin: 24px 0;
                height: 1px;
                background: #e1e4e8;
            }

            .markdown-body .md-ordered-item,
            .markdown-body .md-unordered-item {
                margin: 4px 0;
                padding-left: 8px;
            }

            .markdown-body ul {
                margin: 16px 0;
                padding-left: 20px;
            }

            .markdown-body ol {
                margin: 16px 0;
                padding-left: 20px;
            }

            .markdown-body .md-tr {
                border-bottom: 1px solid #e1e4e8;
            }

            .markdown-body .md-td {
                padding: 8px 12px;
                border-right: 1px solid #e1e4e8;
            }

            .markdown-body .md-td:first-child {
                border-left: 1px solid #e1e4e8;
                font-weight: 600;
            }

            .image-preview-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10001;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: fadeIn 0.3s ease-out;
                cursor: pointer;
            }

            .image-preview-container {
                max-width: 95%;
                max-height: 95%;
                position: relative;
                cursor: pointer;
            }

            .image-preview-content {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                cursor: pointer;
            }

            .image-preview-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s;
            }

            .image-preview-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .markdown-img {
                cursor: zoom-in;
                transition: transform 0.2s ease;
            }

            .markdown-img:hover {
                transform: scale(1.02);
            }
        `
    }));

    // 显示图片放大预览
    const showImagePreview = (imgSrc) => {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';

        const container = document.createElement('div');
        container.className = 'image-preview-container';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'image-preview-content';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'image-preview-close';
        closeBtn.innerHTML = '✕';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeImagePreview();
        };

        container.appendChild(img);
        container.appendChild(closeBtn);
        overlay.appendChild(container);

        // 点击遮罩关闭
        overlay.onclick = closeImagePreview;

        document.body.appendChild(overlay);

        // 保存当前浮窗引用
        window.currentImagePreview = overlay;
    };

    // 关闭图片预览
    const closeImagePreview = () => {
        const existingOverlay = document.querySelector('.image-preview-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    };

    // 工具函数：等待元素
    const waitFor = (selector, cb, maxAttempts = 10) => {
        let n = 0;
        const i = setInterval(() => {
            const el = document.querySelector(selector);
            if (el || n++ > maxAttempts) clearInterval(i), el && cb(el);
        }, 500);
    };

    // 工具函数：等待页面加载
    const whenReady = cb => (document.readyState === 'complete' || document.readyState === 'interactive')
        ? setTimeout(cb, 500) : addEventListener('DOMContentLoaded', () => setTimeout(cb, 500));

    // 修复图片 URL - 使用全局正确的项目路径
    let currentProjectPath = null;

    const fixImageUrl = (src) => {
        if (!src) return src;

        // 从当前 URL 获取基础信息
        const currentUrl = new URL(window.location.href);
        const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`; // 保留端口号

        if (src.startsWith('http')) {
            // 已经是完整 URL，只确保协议正确
            return src.replace(/^http:/, 'https:');
        }

        // 使用当前项目路径（从 API 获取的），如果没有则从当前页面路径解析
        let projectPath = currentProjectPath;

        if (!projectPath) {
            // 从当前页面路径获取项目路径的备用方法
            const pathname = window.location.pathname;
            // 精确匹配项目路径：匹配 /group/project/-/issues 或 /group/project/issues
            const urlMatch = pathname.match(/\/([^\/]+\/[^\/]+?)(?:-|\/)?issues\//);

            if (urlMatch && urlMatch[1]) {
                projectPath = urlMatch[1];
            } else {
                // 如果正则匹配不到，使用备用逻辑
                const pathParts = pathname.split('/').filter(part => part && part !== '-');
                const issuesIndex = pathParts.findIndex(part => part === 'issues');
                if (issuesIndex > 1) {
                    projectPath = pathParts.slice(0, issuesIndex).join('/');
                } else {
                    projectPath = pathParts.slice(0, Math.min(2, pathParts.length)).join('/');
                }
            }

            // 确保项目路径不包含 'groups' 等前缀
            projectPath = projectPath.replace(/^groups\//, '');
        }

        console.log('修复图片 URL:', {
            src,
            projectPath,
            finalUrl: src.startsWith('/')
                ? (src.startsWith(`/${projectPath}/`) ? baseUrl + src : `${baseUrl}/${projectPath}${src}`)
                : `${baseUrl}/${projectPath}/${src}`
        });

        if (src.startsWith('/')) {
            if (src.startsWith(`/${projectPath}/`)) {
                // 已经包含完整项目路径
                return baseUrl + src;
            } else {
                // 需要添加项目路径前缀
                return `${baseUrl}/${projectPath}${src}`;
            }
        } else {
            // 相对路径
            return `${baseUrl}/${projectPath}/${src}`;
        }
    };

    // 尝试使用 GitLab 的 Markdown 渲染功能
    const renderMarkdown = async (markdown) => {
        if (!markdown) return '';

        // 直接使用本地渲染，避免 API 调用问题
        return renderMarkdownLocal(markdown);
    };

    // 增强的本地 Markdown 渲染器
    const renderMarkdownLocal = (markdown) => {
        if (!markdown) return '';

        // 预处理图片 URL
        let html = markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            const fixedSrc = fixImageUrl(src);
            return `<img src="${fixedSrc}" alt="${alt}" class="markdown-img" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">`;
        });

        // 处理代码块（支持多行）
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const langClass = lang ? ` class="language-${lang}"` : '';
            return `<pre><code${langClass}>${code.trim()}</code></pre>`;
        });

        // 处理行内代码
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // 处理标题（从大到小处理，避免冲突）
        html = html.replace(/^#### (.*$)/gim, '<h4 class="md-h4">$1</h4>');
        html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

        // 处理粗体和斜体（避免嵌套问题）
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="md-strong">$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong class="md-strong">$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em class="md-em">$1</em>');
        html = html.replace(/_(.+?)_/g, '<em class="md-em">$1</em>');

        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="md-link">$1</a>');

        // 处理有序列表
        html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-ordered-item">$1</li>');

        // 处理无序列表
        html = html.replace(/^[\-\*] (.+)$/gm, '<li class="md-unordered-item">$1</li>');

        // 处理引用（支持多行引用）
        const lines = html.split('\n');
        let inBlockquote = false;
        let blockquoteLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('> ')) {
                if (!inBlockquote) {
                    inBlockquote = true;
                    blockquoteLines.push('<blockquote class="md-blockquote">');
                }
                blockquoteLines.push(line.substring(2));
            } else if (line.trim() === '' && inBlockquote) {
                blockquoteLines.push('<br>');
            } else {
                if (inBlockquote) {
                    blockquoteLines.push('</blockquote>');
                    inBlockquote = false;
                }
                blockquoteLines.push(line);
            }
        }

        if (inBlockquote) {
            blockquoteLines.push('</blockquote>');
        }

        html = blockquoteLines.join('\n');

        // 处理水平分割线
        html = html.replace(/^---+$/gm, '<hr class="md-hr">');
        html = html.replace(/^\*\*\*+$/gm, '<hr class="md-hr">');

        // 处理表格（简单表格支持）
        html = html.replace(/\|(.+)\|/g, (match, content) => {
            const cells = content.split('|').map(cell => cell.trim());
            const cellHtml = cells.map(cell => `<td class="md-td">${cell}</td>`).join('');
            return `<tr class="md-tr">${cellHtml}</tr>`;
        });

        // 处理换行
        html = html.replace(/\n\n/g, '</p><p class="md-paragraph">');
        html = '<p class="md-paragraph">' + html + '</p>';

        // 清理空段落
        html = html.replace(/<p class="md-paragraph"><\/p>/g, '');

        // 处理单个换行
        html = html.replace(/\n/g, '<br>');

        return `<div class="markdown-body">${html}</div>`;
    };

    // 创建浮窗元素
    const createPreviewPanel = () => {
        const overlay = document.createElement('div');
        overlay.className = 'issue-preview-overlay';

        const panel = document.createElement('div');
        panel.className = 'issue-preview-panel';

        const header = document.createElement('div');
        header.className = 'issue-preview-header';

        const title = document.createElement('h2');
        title.className = 'issue-preview-title';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'issue-preview-close';
        closeBtn.innerHTML = '✕';
        closeBtn.onclick = closePreview;

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.className = 'issue-preview-content';

        panel.appendChild(header);
        panel.appendChild(content);
        overlay.appendChild(panel);

        return { overlay, panel, title, content };
    };

    // 关闭预览
    const closePreview = () => {
        const existingOverlay = document.querySelector('.issue-preview-overlay');
        const existingPanel = document.querySelector('.issue-preview-panel');

        if (existingPanel) {
            existingPanel.style.animation = 'slideOut 0.3s ease-in';
        }

        setTimeout(() => {
            if (existingOverlay) existingOverlay.remove();
            if (existingPanel) existingPanel.remove();
        }, 300);

        // 关闭图片预览
        closeImagePreview();
    };

    // 显示加载状态
    const showLoading = (content) => {
        content.innerHTML = '<div class="issue-preview-loading">正在加载 Issue 详情...</div>';
    };

    // 显示错误状态
    const showError = (content, message) => {
        content.innerHTML = `<div class="issue-preview-error">加载失败: ${message}</div>`;
    };

    // 通过 API 获取 Issue 详细信息
    const fetchIssueDetails = async (issueUrl) => {
        console.log('开始获取 Issue 详情:', issueUrl);

        try {
            const urlMatch = issueUrl.match(/\/([^\/]+\/[^\/]+)\/-\/issues\/(\d+)/);
            if (!urlMatch) {
                throw new Error('无法解析 Issue URL');
            }

            const [, projectPath, issueIid] = urlMatch;
            console.log('解析结果:', { projectPath, issueIid });

            // 保存正确的项目路径，供图片URL修复使用
            currentProjectPath = projectPath;

            const apiBaseUrl = `${window.location.origin}/api/v4/projects/${encodeURIComponent(projectPath)}/issues/${issueIid}`;

            const issueResponse = await fetch(`${apiBaseUrl}?include_descendant=true`);
            if (!issueResponse.ok) {
                throw new Error(`HTTP ${issueResponse.status}: ${issueResponse.statusText}`);
            }

            const issueData = await issueResponse.json();

            const notesResponse = await fetch(`${apiBaseUrl}/notes?sort=asc&per_page=100`);
            const notesData = notesResponse.ok ? await notesResponse.json() : [];

            return { issueData, notesData };

        } catch (error) {
            console.error('获取 Issue 详情失败:', error);
            throw error;
        }
    };

    // 渲染 Issue 内容
    const renderIssueContent = async (content, issueData, notesData) => {
        let html = '';

        // 渲染描述
        if (issueData.description) {
            const descriptionHtml = await renderMarkdown(issueData.description);
            html += `
                <div class="issue-preview-section">
                    <h3>📝 描述</h3>
                    ${descriptionHtml}
                </div>
            `;
        }

        // 渲染评论
        if (notesData && notesData.length > 0) {
            html += '<div class="issue-preview-section"><h3>💬 评论</h3>';

            for (const note of notesData) {
                if (note.system) continue;

                const authorName = note.author ? note.author.name : '未知用户';
                const createdAt = note.created_at ? new Date(note.created_at).toLocaleString('zh-CN') : '';
                const commentHtml = await renderMarkdown(note.body || '');

                html += `
                    <div class="issue-preview-comment">
                        <div class="issue-preview-comment-author">
                            ${authorName}
                            <span class="issue-preview-comment-time">${createdAt}</span>
                        </div>
                        ${commentHtml}
                    </div>
                `;
            }

            html += '</div>';
        }

        if (!html) {
            html = '<div class="issue-preview-error">暂无描述和评论</div>';
        }

        content.innerHTML = html;

        // 处理渲染后的图片
        const images = content.querySelectorAll('img');
        images.forEach(img => {
            img.onerror = function() {
                console.log('图片加载失败:', this.src);
                // 简单的占位符
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.textContent = `图片加载失败: ${this.src}`;
                placeholder.style.cssText = 'color: #999; font-style: italic; padding: 10px; background: #f5f5f5; border-radius: 4px; margin: 10px 0;';
                this.parentNode.insertBefore(placeholder, this);
            };

            // 添加点击放大功能
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showImagePreview(img.src);
            });
        });
    };

    // 显示 Issue 预览
    const showIssuePreview = async (issueUrl) => {
        closePreview();

        const { overlay, panel, title, content } = createPreviewPanel();

        document.body.appendChild(overlay);
        document.body.appendChild(panel);

        title.textContent = 'Issue 预览';
        showLoading(content);

        try {
            const { issueData, notesData } = await fetchIssueDetails(issueUrl);

            title.textContent = `#${issueData.iid} ${issueData.title}`;
            await renderIssueContent(content, issueData, notesData);

        } catch (error) {
            title.textContent = '加载失败';
            showError(content, error.message);
        }
    };

    // 等待页面加载完成后执行
    whenReady(() => {
        console.log('Issue预览脚本已加载');

        const addClickHandlers = () => {
            const issueLinks = document.querySelectorAll('a[href*="/-/issues/"], a[href*="/issues/"]');
            console.log(`找到 ${issueLinks.length} 个 issue 链接`);

            issueLinks.forEach((link, index) => {
                if (link.hasAttribute('data-preview-handler')) return;

                link.setAttribute('data-preview-handler', 'true');

                const icon = document.createElement('span');
                icon.textContent = '👁️';
                icon.style.cssText = `
                    margin-left: 5px;
                    font-size: 12px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                `;
                icon.title = '点击预览，按住 Ctrl/Cmd 点击跳转';
                link.appendChild(icon);

                const handleClick = async (e) => {
                    if (e.ctrlKey || e.metaKey || e.button === 2) return;

                    e.preventDefault();
                    e.stopPropagation();

                    const issueUrl = link.href;
                    console.log('开始预览 Issue:', issueUrl);

                    try {
                        await showIssuePreview(issueUrl);
                    } catch (error) {
                        console.error('预览失败:', error);
                    }
                };

                link.addEventListener('click', handleClick, true);
                link.addEventListener('mousedown', (e) => {
                    if (e.button === 0) handleClick(e);
                }, true);

                link.addEventListener('mouseenter', () => icon.style.opacity = '1');
                link.addEventListener('mouseleave', () => icon.style.opacity = '0.7');
            });
        };

        setTimeout(() => {
            console.log('开始初始绑定');
            addClickHandlers();
        }, 1000);

        const observer = new MutationObserver((mutations) => {
            let shouldRebind = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'A' && (node.href?.includes('/-/issues/') || node.href?.includes('/issues/'))) {
                                shouldRebind = true;
                            } else if (node.querySelector && node.querySelector('a[href*="/-/issues/"], a[href*="/issues/"]')) {
                                shouldRebind = true;
                            }
                        }
                    });
                }
            });

            if (shouldRebind) {
                console.log('检测到新内容，重新绑定事件');
                setTimeout(addClickHandlers, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('issue-preview-overlay')) {
                closePreview();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const imagePreview = document.querySelector('.image-preview-overlay');
                if (imagePreview) {
                    closeImagePreview();
                } else {
                    closePreview();
                }
            }
        });

        setInterval(() => {
            const unboundLinks = document.querySelectorAll('a[href*="/-/issues/"]:not([data-preview-handler]), a[href*="/issues/"]:not([data-preview-handler])');
            if (unboundLinks.length > 0) {
                console.log(`发现 ${unboundLinks.length} 个未绑定的链接，重新绑定`);
                addClickHandlers();
            }
        }, 5000);

        // 为静态页面中的图片添加点击放大功能
        const setupImageClickHandlers = () => {
            // 查找所有包含图片的链接（通常是GFM格式的图片链接）
            const imageLinks = document.querySelectorAll('a[href*="/uploads/"]');
            console.log(`找到 ${imageLinks.length} 个图片链接`);

            imageLinks.forEach(link => {
                // 检查是否已经有处理器
                if (link.hasAttribute('data-image-handler')) return;

                // 找到链接内的图片
                const img = link.querySelector('img');
                if (!img) return;

                // 标记为已处理
                link.setAttribute('data-image-handler', 'true');

                // 移除target="_blank"，防止打开新标签页
                link.removeAttribute('target');

                // 添加点击事件
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // 获取图片的实际URL（移除data-src前缀）
                    let imgSrc = img.src || img.getAttribute('data-src') || img.getAttribute('src');

                    // 如果是相对路径，转换为绝对路径
                    if (imgSrc && imgSrc.startsWith('/')) {
                        imgSrc = window.location.origin + imgSrc;
                    }

                    console.log('点击图片:', imgSrc);
                    showImagePreview(imgSrc);
                });

                // 修改鼠标指针样式
                link.style.cursor = 'zoom-in';
            });
        };

        // 初始设置
        setTimeout(() => {
            setupImageClickHandlers();
        }, 1000);

        // 监听DOM变化，为新添加的图片设置事件
        const imageObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新节点是否是图片链接
                            if (node.tagName === 'A' && node.href && node.href.includes('/uploads/')) {
                                setupImageClickHandlers();
                            } else if (node.querySelector) {
                                // 检查新节点是否包含图片链接
                                const imageLinksInNode = node.querySelectorAll('a[href*="/uploads/"]');
                                if (imageLinksInNode.length > 0) {
                                    setupImageClickHandlers();
                                }
                            }
                        }
                    });
                }
            });
        });

        imageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期检查并为未处理的图片设置事件
        setInterval(() => {
            const unhandledImages = document.querySelectorAll('a[href*="/uploads/"]:not([data-image-handler])');
            if (unhandledImages.length > 0) {
                console.log(`发现 ${unhandledImages.length} 个未处理的图片链接`);
                setupImageClickHandlers();
            }
        }, 5000);
    });
})();