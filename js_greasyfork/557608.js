// ==UserScript==
// @name         Readeasy (一键复制内容)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  一键复制。内置你自定义的 Markdown 转换逻辑(支持中文引号转引用)，使用 GM_addStyle 穿透 CSP。
// @author       _Sure.Lee
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://unpkg.com/@mozilla/readability@0.5.0/Readability.js
// @downloadURL https://update.greasyfork.org/scripts/557608/Readeasy%20%28%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557608/Readeasy%20%28%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function htmlToMarkdown(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let lastTag = null;

        return traverse(doc.body);  // 不使用 trim，保留结构性换行

        function traverse(node) {
            let md = '';
            node.childNodes.forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    // 如果去掉空白后长度为 0，就跳过
                    if (!/\S/.test(child.nodeValue)) return;
                    md += child.nodeValue.replace(/\s+/g, ' ');
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const tag = child.tagName.toLowerCase();
                    const content = traverse(child).trim();
                    const className = (child.getAttribute('class') || '').toLowerCase();
                    const isQuoteLike = /quote/.test(className);
                    // 特有逻辑：全角引号内容自动变引用块
                    const isFullQuote = /^“[^”]{2,}”$/.test(content);
                    const parentTag = child.parentElement?.tagName?.toLowerCase() || '';

                    switch (tag) {
                        case 'h1': md += '# ' + content + '\n\n'; break;
                        case 'h2': md += '## ' + content + '\n\n'; break;
                        case 'h3': md += '### ' + content + '\n\n'; break;
                        case 'h4': md += '#### ' + content + '\n\n'; break;
                        case 'h5': md += '##### ' + content + '\n\n'; break;
                        case 'h6': md += '###### ' + content + '\n\n'; break;

                        case 'figure':
                            md += '\n' + content + '\n\n';  // figure 本身不渲染，只做结构隔断
                            lastTag = 'figure';
                            break;

                        case 'figcaption':
                            md += '\n> ' + content.replace(/\n/g, '\n> ') + '\n\n';
                            lastTag = 'figcaption';
                            break;

                        case 'p': {
                            if (lastTag === 'figcaption' && isFullQuote) {
                                let headingLevel = (parentTag === 'figure') ? 1 : 2;
                                const heading = '#'.repeat(headingLevel) + ' ' + content.trim();
                                md += '\n\n' + heading + '\n\n';  // 💡 强制从空行起始
                            } else if (isQuoteLike || isFullQuote) {
                                md += '\n> ' + content.replace(/\n/g, '\n> ') + '\n\n';
                            } else {
                                md += content + '\n\n';
                            }
                            lastTag = 'p';
                            break;
                        }
                        case 'br': md += '\n'; break;
                        case 'strong':
                        case 'b': md += '**' + content + '**'; break;
                        case 'em':
                        case 'i': md += '*' + content + '*'; break;
                        case 'code': md += '`' + content + '`'; break;
                        case 'pre': md += '\n```\n' + child.textContent.trim() + '\n```\n\n'; break;

                        case 'a': {
                            const href = child.getAttribute('href') || '';
                            md += '[' + content + '](' + href + ')';
                            break;
                        }

                        case 'img': {
                            const alt = child.getAttribute('alt') || '';
                            const src = child.getAttribute('src') || '';
                            md += '![' + alt + '](' + src + ')';
                            break;
                        }

                        case 'ul':
                            md += Array.from(child.children)
                                .map(li => '* ' + traverse(li).trim())
                                .join('\n') + '\n\n';
                            break;

                        case 'ol': {
                            let i = 1;
                            md += Array.from(child.children)
                                .map(li => (i++) + '. ' + traverse(li).trim())
                                .join('\n') + '\n\n';
                            break;
                        }

                        case 'li':
                            md += content + '\n';
                            break;

                        case 'blockquote':
                            md += '\n> ' + content.replace(/\n/g, '\n> ') + '\n\n';
                            break;

                        default:
                            if (isQuoteLike) {
                                md += '\n> ' + content.replace(/\n/g, '\n> ') + '\n\n';
                            } else {
                                md += content;
                            }
                    }
                }
            });
            return md;
        }
    }


    const css = `
        #copy-article-btn {
            position: fixed;
            top: 40%;
            right: 12px;
            z-index: 2147483647;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.6);
            opacity: 0.3;
            transform: scale(0.9);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            user-select: none;
            overflow: hidden;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        #copy-article-btn:hover {
            width: 42px;
            height: 42px;
            opacity: 1;
            transform: scale(1.1);
            right: 24px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(34, 211, 238, 0.9));
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4),
                        0 0 0 1px rgba(255,255,255,0.4) inset;
            color: #fff;
            border-color: transparent;
        }

        .copy-btn-icon {
            font-size: 14px;
            transition: transform 0.4s ease;
        }
        #copy-article-btn:hover .copy-btn-icon {
            font-size: 20px;
            transform: rotate(180deg);
        }

        /* 菜单样式 */
        #copy-format-menu {
            position: fixed;
            z-index: 2147483647;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
            border-radius: 12px;
            padding: 5px;
            display: none;
            opacity: 0;
            transform: translateY(10px) scale(0.95);
            transition: all 0.2s ease;
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 100px;
        }

        #copy-format-menu.show {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        #copy-format-menu button {
            display: block;
            width: 100%;
            padding: 8px 12px;
            background: transparent;
            border: none;
            border-radius: 8px;
            text-align: left;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            color: #333;
            transition: background 0.2s;
            margin-bottom: 2px;
        }

        #copy-format-menu button:hover {
            background: rgba(99, 102, 241, 0.1);
            color: #4f46e5;
        }

        @media (prefers-color-scheme: dark) {
            #copy-format-menu {
                background: rgba(30, 41, 59, 0.95);
                box-shadow: 0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1);
            }
            #copy-format-menu button { color: #cbd5e1; }
            #copy-format-menu button:hover { background: rgba(255,255,255,0.1); color: #fff; }
        }
    `;

    GM_addStyle(css);

    if (document.getElementById('copy-article-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'copy-article-btn';
    btn.title = '复制文章内容';
    btn.innerHTML = '<span class="copy-btn-icon">⚡</span>';

    // 拖动逻辑
    let isDragging = false, offsetX = 0, offsetY = 0, hasMoved = false;

    btn.addEventListener('mousedown', function(e) {
        isDragging = true;
        hasMoved = false;
        offsetX = e.clientX - btn.getBoundingClientRect().left;
        offsetY = e.clientY - btn.getBoundingClientRect().top;
        btn.style.transition = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            hasMoved = true;
            btn.style.left = (e.clientX - offsetX) + 'px';
            btn.style.top = (e.clientY - offsetY) + 'px';
            btn.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    });

    // 菜单
    const menu = document.createElement('div');
    menu.id = 'copy-format-menu';
    menu.innerHTML = `
        <button data-format="markdown">Markdown</button>
        <button data-format="text">Pure Text</button>
        <button data-format="html">HTML Code</button>
    `;
    document.body.appendChild(menu);

    function hideMenu() {
        menu.classList.remove('show');
        setTimeout(() => {
             if (!menu.classList.contains('show')) menu.style.display = 'none';
        }, 200);
    }

    btn.addEventListener('click', function(e) {
        if (hasMoved) return;
        e.stopPropagation();

        if (menu.style.display === 'block') {
            hideMenu();
        } else {
            const rect = btn.getBoundingClientRect();
            menu.style.display = 'block';
            const leftPos = rect.left - 110;
            menu.style.left = (leftPos > 0 ? leftPos : 10) + 'px';
            menu.style.top = (rect.bottom + 10) + 'px';
            requestAnimationFrame(() => menu.classList.add('show'));
        }
    });

    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && e.target !== btn) {
            hideMenu();
        }
    });

    menu.addEventListener('click', function(e) {
        const format = e.target.getAttribute('data-format');
        if (!format) return;
        e.stopPropagation();
        hideMenu();
        copyArticle(format);
    });

    document.body.appendChild(btn);

    // 清理 HTML
    function cleanHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const elementsToRemove = div.querySelectorAll(
            'script, style, link, meta, iframe, button, input, form, nav, footer, [role="complementary"]'
        );
        elementsToRemove.forEach(el => el.remove());
        div.querySelectorAll('div:empty, span:empty, p:empty').forEach(el => el.remove());
        return div.innerHTML;
    }

    function formatPlainText(title, text) {
        text = text.replace(/\n{3,}/g, '\n\n');
        return `${title}\n\n${text}`;
    }

    async function copyArticle(format) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<span class="copy-btn-icon">⏳</span>';

        let title = document.title;
        let htmlContent = '';
        let textContent = '';
        let markdownContent = '';

        try {
            if (typeof Readability === 'undefined') {
                throw new Error('Readability library not loaded');
            }

            const documentClone = document.cloneNode(true);
            const article = new Readability(documentClone).parse();

            if (article) {
                title = article.title;
                htmlContent = cleanHtml(article.content);
                textContent = formatPlainText(title, article.textContent);


                markdownContent = `# ${title}\n\n` + htmlToMarkdown(htmlContent);
            } else {
                console.log("Readability parse failed, using fallback.");
                htmlContent = cleanHtml(document.body.innerHTML);
                textContent = formatPlainText(document.title, document.body.innerText);
                markdownContent = `# ${document.title}\n\n` + htmlToMarkdown(htmlContent);
            }

            let finalData = '';
            let mimeType = 'text/plain';

            if (format === 'markdown') {
                finalData = markdownContent;
            } else if (format === 'html') {
                finalData = `<h1>${title}</h1>${htmlContent}`;
                mimeType = 'text/html';
            } else {
                finalData = textContent;
            }

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(finalData);
                } else {
                    throw new Error('Clipboard API not available');
                }
            } catch (clipboardErr) {
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(finalData, { type: mimeType });
                } else {
                    throw clipboardErr;
                }
            }

            btn.innerHTML = '<span class="copy-btn-icon" style="color:#4ade80">✔</span>';
            btn.style.transform = 'scale(1.2)';

            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.transform = '';
            }, 1200);

        } catch (e) {
            console.error('Copy failed:', e);
            btn.innerHTML = '<span class="copy-btn-icon">❌</span>';
            setTimeout(() => btn.innerHTML = originalIcon, 1200);
            alert('复制失败：' + e.message);
        }
    }

})();