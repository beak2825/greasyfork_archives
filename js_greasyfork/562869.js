// ==UserScript==
// @name         LeetCode 题目转 Markdown 复制
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  将力扣题目转换为Markdown格式并复制到剪贴板
// @author       You
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/problems/*
// @icon         https://leetcode.cn/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562869/LeetCode%20%E9%A2%98%E7%9B%AE%E8%BD%AC%20Markdown%20%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/562869/LeetCode%20%E9%A2%98%E7%9B%AE%E8%BD%AC%20Markdown%20%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===================== 样式 =====================
    GM_addStyle(`
        .lc-copy-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 6px 12px;
            margin-left: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }
        .lc-copy-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
        }
        .lc-copy-btn:active {
            transform: translateY(0);
        }
        .lc-copy-btn.success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        .lc-copy-btn svg {
            width: 14px;
            height: 14px;
        }
    `);

    // ===================== 图标 =====================
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>`;

    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>`;

    // ===================== HTML 转 Markdown =====================
    function htmlToMarkdown(html) {
        // 创建临时容器
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // 处理代码块 <pre>
        temp.querySelectorAll('pre').forEach(pre => {
            const text = pre.textContent.trim();
            pre.outerHTML = '\n```\n' + text + '\n```\n';
        });

        // 处理内联代码 <code>
        temp.querySelectorAll('code').forEach(code => {
            code.outerHTML = '`' + code.textContent + '`';
        });

        // 处理粗体
        temp.querySelectorAll('strong, b').forEach(el => {
            let text = el.textContent;
            const prefix = text.match(/^\s*/)[0];
            const suffix = text.match(/\s*$/)[0];
            const content = text.trim();

            if (content) {
                el.outerHTML = prefix + '**' + content + '**' + suffix;
            } else {
                el.outerHTML = text;
            }
        });

        // 处理斜体
        temp.querySelectorAll('em, i').forEach(el => {
            let text = el.textContent;
            const prefix = text.match(/^\s*/)[0];
            const suffix = text.match(/\s*$/)[0];
            const content = text.trim();

            if (content) {
                el.outerHTML = prefix + '*' + content + '*' + suffix;
            } else {
                el.outerHTML = text;
            }
        });

        // 处理列表
        temp.querySelectorAll('ul').forEach(ul => {
            const items = ul.querySelectorAll('li');
            let markdown = '\n';
            items.forEach(li => {
                markdown += '- ' + li.textContent.trim() + '\n';
            });
            ul.outerHTML = markdown;
        });

        temp.querySelectorAll('ol').forEach(ol => {
            const items = ol.querySelectorAll('li');
            let markdown = '\n';
            items.forEach((li, index) => {
                markdown += (index + 1) + '. ' + li.textContent.trim() + '\n';
            });
            ol.outerHTML = markdown;
        });

        // 处理段落
        temp.querySelectorAll('p').forEach(p => {
            p.outerHTML = '\n' + p.textContent + '\n';
        });

        // 处理换行
        temp.querySelectorAll('br').forEach(br => {
            br.outerHTML = '\n';
        });

        // 处理上标
        temp.querySelectorAll('sup').forEach(sup => {
            sup.outerHTML = '^' + sup.textContent;
        });

        // 处理下标
        temp.querySelectorAll('sub').forEach(sub => {
            sub.outerHTML = '_' + sub.textContent;
        });

        // 获取纯文本并清理
        let text = temp.textContent || temp.innerText;

        // 清理多余的空行
        text = text.replace(/\n{3,}/g, '\n\n');
        text = text.trim();

        return text;
    }

    // ===================== 获取题目信息 =====================
    function getProblemData() {
        const data = {
            title: '',
            difficulty: '',
            content: '',
            url: window.location.href
        };

        // 获取标题 - 使用多种选择器尝试
        const titleSelectors = [
            'div.text-title-large',
            '[data-e2e-locator="console-custom-testcase-button"]', // 备用
            'a[href*="/problems/"] span'
        ];

        for (const selector of titleSelectors) {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim()) {
                data.title = el.textContent.trim();
                break;
            }
        }

        // 如果上面没找到，尝试从 URL 获取题目名
        if (!data.title) {
            const match = window.location.pathname.match(/\/problems\/([^\/]+)/);
            if (match) {
                data.title = match[1].replace(/-/g, ' ');
            }
        }

        // 获取难度
        const difficultyEl = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard');
        if (difficultyEl) {
            const diffText = difficultyEl.textContent.trim().toLowerCase();
            if (diffText.includes('简单') || diffText.includes('easy')) {
                data.difficulty = '简单';
            } else if (diffText.includes('中等') || diffText.includes('medium')) {
                data.difficulty = '中等';
            } else if (diffText.includes('困难') || diffText.includes('hard')) {
                data.difficulty = '困难';
            } else {
                data.difficulty = diffText;
            }
        }

        // 获取题目内容
        const contentEl = document.querySelector('[data-track-load="description_content"]');
        if (contentEl) {
            data.content = htmlToMarkdown(contentEl.innerHTML);
        }

        return data;
    }

    // ===================== 生成 Markdown =====================
    function generateMarkdown(data) {
        let md = '';

        // 标题 (H1 -> H2)
        if (data.title) {
            md += `## ${data.title}\n\n`;
        }

        // 难度
        if (data.difficulty) {
            const badge = getDifficultyBadge(data.difficulty);
            md += `**难度**: ${badge}\n\n`;
        }

        // 链接
        if (data.url) {
            md += `**链接**: ${data.url}\n\n`;
        }

        // 分隔线
        md += `---\n\n`;

        // 内容 (H2 -> H3)
        if (data.content) {
            md += `### 题目描述\n\n${data.content}\n`;
        }

        return md;
    }

    function getDifficultyBadge(difficulty) {
        const badges = {
            '简单': '🟢 简单',
            '中等': '🟡 中等',
            '困难': '🔴 困难',
            'easy': '🟢 Easy',
            'medium': '🟡 Medium',
            'hard': '🔴 Hard'
        };
        return badges[difficulty.toLowerCase()] || difficulty;
    }

    // ===================== 复制功能 =====================
    function copyToClipboard(text) {
        // 优先使用 GM_setClipboard
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text, 'text');
            return Promise.resolve();
        }
        // 降级使用 navigator.clipboard
        return navigator.clipboard.writeText(text);
    }

    // ===================== 创建复制按钮 =====================
    function createCopyButton() {
        const btn = document.createElement('button');
        btn.className = 'lc-copy-btn';
        btn.innerHTML = copyIcon + '<span>复制 MD</span>';
        btn.title = '复制题目为 Markdown 格式';

        btn.addEventListener('click', async () => {
            try {
                const data = getProblemData();
                const markdown = generateMarkdown(data);

                await copyToClipboard(markdown);

                // 显示成功状态
                btn.classList.add('success');
                btn.innerHTML = checkIcon + '<span>已复制!</span>';

                setTimeout(() => {
                    btn.classList.remove('success');
                    btn.innerHTML = copyIcon + '<span>复制 MD</span>';
                }, 2000);
            } catch (error) {
                console.error('复制失败:', error);
                btn.innerHTML = '❌ 失败';
                setTimeout(() => {
                    btn.innerHTML = copyIcon + '<span>复制 MD</span>';
                }, 2000);
            }
        });

        return btn;
    }

    // ===================== 插入按钮 =====================
    function insertButton() {
        // 如果按钮已存在，不重复添加
        if (document.querySelector('.lc-copy-btn')) {
            return;
        }

        // 尝试找到合适的容器插入按钮
        // 策略1: 找到标题旁边
        const titleContainer = document.querySelector('div.text-title-large')?.closest('div.flex');
        if (titleContainer) {
            titleContainer.appendChild(createCopyButton());
            return;
        }

        // 策略2: 找到描述面板的顶部工具栏
        const toolbar = document.querySelector('[data-e2e-locator]')?.closest('div.flex');
        if (toolbar) {
            toolbar.appendChild(createCopyButton());
            return;
        }

        // 策略3: 找面板顶部任意位置
        const panel = document.querySelector('div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto');
        if (panel && panel.firstChild) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; justify-content: flex-end; padding: 8px 16px;';
            wrapper.appendChild(createCopyButton());
            panel.insertBefore(wrapper, panel.firstChild);
            return;
        }
    }

    // ===================== 监听页面变化 =====================
    function observePageChanges() {
        // 初始尝试
        setTimeout(insertButton, 1500);

        // 使用 MutationObserver 监听动态变化
        const observer = new MutationObserver((mutations) => {
            // 检查是否需要重新插入按钮
            if (!document.querySelector('.lc-copy-btn')) {
                insertButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // URL 变化监听 (SPA 导航)
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(insertButton, 1500);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // ===================== 初始化 =====================
    observePageChanges();

})();
