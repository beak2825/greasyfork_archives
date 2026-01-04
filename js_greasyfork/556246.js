// ==UserScript==
// @name         TGFC Markdown Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  TGFC论坛贴内 Markdown 美化，优化阅读边距，调整标题配色，保持紧凑排版，仅针对楼层内容
// @author       heiren + ChatGPT
// @match        https://s.tgfcer.com/*
// @match        https://tgfcer.com/*
// @icon         https://s.tgfcer.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556246/TGFC%20Markdown%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/556246/TGFC%20Markdown%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class TGMarkdownEnhancer {
        constructor() {
            this.isEnabled = GM_getValue ? GM_getValue('tgmd_enabled', false) : false;
            // 限制仅在楼层正文生效，防止误伤签名档
            this.selectors = [
                'div.postmessage.defaultpost'
            ];
            this.originalHtmlMap = new Map();
            this.processedNodes = new WeakSet();
            this.observer = null;
            this.modeBtn = null;

            this.init();
        }

        init() {
            this.injectStyles();
            this.createButton();
            this.bindEvents();

            if (this.isEnabled) {
                this.startEnhancement();
            }
        }

        bindEvents() {
            // 快捷键: Ctrl/Meta + Alt + V
            window.addEventListener('keydown', (e) => {
                const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
                const ignore = ['input', 'textarea', 'select'].includes(tag) || e.target.isContentEditable;
                if (ignore) return;

                if ((e.metaKey || e.ctrlKey) && e.altKey && e.key.toLowerCase() === 'v') {
                    this.toggleState();
                }
            });

            // 复制代码按钮点击事件
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.tgfc-md-copy');
                if (btn) {
                    this.handleCopy(btn);
                }
            });
        }

        toggleState() {
            this.isEnabled = !this.isEnabled;
            if (GM_setValue) GM_setValue('tgmd_enabled', this.isEnabled);
            this.updateBtnUI();

            if (this.isEnabled) {
                this.startEnhancement();
                this.showNotification('TGMD: 已开启');
            } else {
                this.stopEnhancement();
                this.showNotification('TGMD: 已关闭');
            }
        }

        startEnhancement() {
            this.processExistingNodes();
            this.startObserver();
        }

        stopEnhancement() {
            this.stopObserver();
            this.restoreOriginalContent();
        }

        startObserver() {
            if (this.observer) return;
            this.observer = new MutationObserver((mutations) => {
                let shouldProcess = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldProcess = true;
                        break;
                    }
                }
                if (shouldProcess) {
                    this.processExistingNodes();
                }
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        stopObserver() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }

        collectTargets() {
            let nodes = [];
            for (let sel of this.selectors) {
                let found = document.querySelectorAll(sel);
                if (found.length > 0) {
                    nodes = nodes.concat(Array.from(found));
                }
            }
            return [...new Set(nodes)];
        }

        processExistingNodes() {
            const targets = this.collectTargets();
            targets.forEach(node => {
                if (this.processedNodes.has(node)) return;

                if (!this.originalHtmlMap.has(node)) {
                    this.originalHtmlMap.set(node, node.innerHTML);
                }

                this.enhanceNode(node);
            });
        }

        restoreOriginalContent() {
            const targets = this.collectTargets();
            targets.forEach(node => {
                if (this.originalHtmlMap.has(node)) {
                    node.innerHTML = this.originalHtmlMap.get(node);
                    this.processedNodes.delete(node);
                }
            });
        }

        enhanceNode(node) {
            let postInfo = node.querySelector('.postinfo');
            let contentHtml = '', contentText = '';

            // 提取内容时排除 postinfo
            if (postInfo) {
                let clone = node.cloneNode(true);
                let piInClone = clone.querySelector('.postinfo');
                if (piInClone) piInClone.remove();
                contentHtml = clone.innerHTML;
                contentText = clone.innerText || clone.textContent;
            } else {
                contentHtml = node.innerHTML;
                contentText = node.innerText || node.textContent;
            }

            if (this.shouldEnhance(contentHtml, contentText)) {
                let raw = this.cleanRawText(contentText);
                let newContentHtml = this.markdownToHtml(raw);

                node.innerHTML = '';
                if (postInfo) node.appendChild(postInfo);
                node.insertAdjacentHTML('beforeend', newContentHtml);

                this.processedNodes.add(node);
            }
        }

        shouldEnhance(html, text) {
            // 避免重复渲染或破坏已有格式
            if (/<blockquote|div class="quote"|div class="t_msgfont"|table/i.test(html)) {
                if (/quote/i.test(html)) return false;
            }
            const hasCodeBlock = /```[\s\S]*?```/.test(text);
            const hasHeader = /^#{1,6}\s+/m.test(text);
            return hasCodeBlock || hasHeader;
        }

        cleanRawText(text) {
            if (!text) return '';
            text = text.replace(/\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);/g, '');
            return text.trim();
        }

        markdownToHtml(md) {
            if (!md) return '';
            md = this.cleanRawText(md);

            // 1. 代码块
            md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                let langAttr = lang ? `data-lang="${lang}"` : '';
                return `<pre class="tgfc-md-code" ${langAttr}><code>${this.escapeHtml(code.trim())}</code><button class="tgfc-md-copy">复制</button></pre>`;
            });

            // 2. 行内代码
            md = md.replace(/`([^`]+)`/g, '<code class="tgfc-inline">$1</code>');

            // 3. 标题
            const headers = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            headers.forEach((tag, i) => {
                const level = i + 1;
                const regex = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
                md = md.replace(regex, `<${tag}>$1</${tag}>`);
            });

            // 4. 水平线
            md = md.replace(/^---$/gm, '<hr class="tgfc-md-hr">');

            // 5. 图片
            md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="tgfc-md-img">');

            // 6. 链接
            md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

            // 7. 样式 (粗体、斜体、引用)
            md = md.replace(/\*\*([^*]+)\*\*/g, '<span class="tgfc-md-bold">$1</span>');
            md = md.replace(/\*([^*]+)\*/g, '<span class="tgfc-md-italic">$1</span>');
            md = md.replace(/^> ?(.+)$/gm, '<blockquote>$1</blockquote>');

            // 8. 列表项
            md = md.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="tgfc-md-li" style="list-style:decimal;">$1</li>');
            md = md.replace(/^\s*[-*+] +(.+)$/gm, '<li class="tgfc-md-li">$1</li>');

            // 9. 换行
            md = md.replace(/(?<!>)\n/g, '<br>');

            // 10. 列表包裹
            md = md.replace(/(<li class="tgfc-md-li" style="list-style:decimal;">[\s\S]*?<\/li>)+/gm, '<ol class="tgfc-md-ol">$&</ol>');
            md = md.replace(/(<li class="tgfc-md-li">[\s\S]*?<\/li>)+/gm, '<ul class="tgfc-md-ul">$&</ul>');

            return `<div class="tgfc-md-content">${md}</div>`;
        }

        escapeHtml(str) {
            return str.replace(/[&<>"]/g, (tag) => {
                const charsToReplace = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                };
                return charsToReplace[tag] || tag;
            });
        }

        handleCopy(btn) {
            let codeEl = btn.previousElementSibling;
            if (codeEl) {
                let txt = codeEl.textContent;
                navigator.clipboard.writeText(txt).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = '已复制!';
                    setTimeout(() => btn.innerText = originalText, 1200);
                });
            }
        }

        createButton() {
            this.modeBtn = document.createElement('button');
            this.modeBtn.style.cssText = `
                position: fixed;
                top: 20px;
                left: 22px;
                z-index: 10001;
                padding: 6px 12px;
                border-radius: 6px;
                color: white;
                border: none;
                font-size: 12px;
                line-height: 1.2;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                cursor: pointer;
                opacity: 0.8;
                transition: all 0.2s;
                font-family: system-ui, -apple-system, sans-serif;
            `;
            this.modeBtn.title = "点击切换：开启 / 关闭";

            this.modeBtn.addEventListener('mouseenter', () => this.modeBtn.style.opacity = '1');
            this.modeBtn.addEventListener('mouseleave', () => this.modeBtn.style.opacity = '0.8');
            this.modeBtn.onclick = () => this.toggleState();

            this.updateBtnUI();
            document.body.appendChild(this.modeBtn);
        }

        updateBtnUI() {
            if (this.isEnabled) {
                this.modeBtn.innerText = 'TGMD: ON';
                this.modeBtn.style.background = '#2879ff';
            } else {
                this.modeBtn.innerText = 'TGMD: OFF';
                this.modeBtn.style.background = '#718096';
            }
        }

        showNotification(msg) {
            let notif = document.createElement('div');
            notif.innerText = msg;
            notif.style.cssText = `
                position: fixed;
                top: 38px;
                right: 36px;
                background: rgba(0,0,0,0.8);
                color: #fff;
                padding: 8px 16px;
                border-radius: 6px;
                z-index: 9999;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: fadeIn 0.2s;
                backdrop-filter: blur(4px);
            `;
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 1500);
        }

        injectStyles() {
            const style = `
                /* --- 基础容器 --- */
                .tgfc-md-content {
                    font-size: 15px !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    color: #24292e;
                    background: #ffffff !important;
                    border-radius: 8px;
                    padding: 15px 20px;
                    margin: 12px auto;
                    max-width: 96%;
                    line-height: 1.45;
                    border: 1px solid #e1e4e8;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }

                /* --- 标题通用设置 --- */
                .tgfc-md-content h1, .tgfc-md-content h2, .tgfc-md-content h3,
                .tgfc-md-content h4, .tgfc-md-content h5, .tgfc-md-content h6 {
                    font-family: inherit;
                    font-weight: 700;
                    margin-top: 10px;
                    margin-bottom: 6px;
                    line-height: 1.3;
                    padding: 5px 10px;
                    border-radius: 4px;
                    border-left-style: solid;
                    color: #24292e;
                }

                /* H1: 中宝蓝 */
                .tgfc-md-content h1 {
                    background: #2b6cb0;
                    color: #ffffff;
                    border-left-width: 6px;
                    border-left-color: #1a365d;
                    font-size: 1.3em;
                    border-bottom: none;
                }

                /* H2: 亮蓝 */
                .tgfc-md-content h2 {
                    background: #4299e1;
                    color: #ffffff;
                    border-left-width: 5px;
                    border-left-color: #2b6cb0;
                    font-size: 1.4em;
                    border-bottom: none;
                }

                /* H3: 浅蓝背景 + 深蓝字 */
                .tgfc-md-content h3 {
                    background: #ebf8ff;
                    color: #2b6cb0;
                    border-left-width: 4px;
                    border-left-color: #4299e1;
                    font-size: 1.3em;
                }

                /* H4: 极淡绿背景 */
                .tgfc-md-content h4 {
                    background: #f0fff4;
                    color: #2f855a;
                    border-left-width: 4px;
                    border-left-color: #48bb78;
                    font-size: 1.2em;
                }

                /* H5: 浅灰 */
                .tgfc-md-content h5 {
                    background: #f7fafc;
                    color: #4a5568;
                    border-left-width: 3px;
                    border-left-color: #cbd5e0;
                    font-size: 1.1em;
                }

                /* H6 */
                .tgfc-md-content h6 {
                    background: #fff;
                    border: 1px solid #eee;
                    border-left-width: 3px;
                    border-left-color: #e2e8f0;
                    font-size: 1.0em;
                    color: #718096;
                }

                /* --- 内容元素 --- */
                .tgfc-md-content p { margin-bottom: 4px; }
                
                .tgfc-md-content blockquote {
                    border-left: 4px solid #dfe2e5;
                    margin: 0 0 6px 0;
                    padding: 0 1em;
                    color: #6a737d;
                }

                .tgfc-md-content ul, .tgfc-md-content ol {
                    padding-left: 2em;
                    margin-bottom: 6px;
                }
                
                .tgfc-md-content li { margin-bottom: 4px; }
                
                .tgfc-md-content hr.tgfc-md-hr {
                    height: 0.25em;
                    padding: 0;
                    margin: 24px 0;
                    background-color: #e1e4e8;
                    border: 0;
                }

                .tgfc-md-content img.tgfc-md-img {
                    max-width: 100%;
                    box-sizing: content-box;
                    background-color: #fff;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                /* --- 代码块 --- */
                .tgfc-md-code {
                    position: relative;
                    background: #f6f8fa;
                    border-radius: 6px;
                    font-size: 85%;
                    line-height: 1.45;
                    padding: 16px;
                    margin-bottom: 16px;
                    overflow: auto;
                    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
                }
                
                .tgfc-md-code .tgfc-md-copy {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    font-size: 12px;
                    background: rgba(255,255,255,0.8);
                    color: #24292e;
                    border: 1px solid rgba(27,31,35,0.15);
                    border-radius: 4px;
                    padding: 3px 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    opacity: 0;
                }
                
                .tgfc-md-code:hover .tgfc-md-copy { opacity: 1; }
                .tgfc-md-code .tgfc-md-copy:hover { background: #fff; }

                .tgfc-inline {
                    padding: 0.2em 0.4em;
                    margin: 0;
                    font-size: 85%;
                    background-color: rgba(27,31,35,0.05);
                    border-radius: 3px;
                    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
                }

                /* --- 链接与强调 --- */
                .tgfc-md-content a { color: #0366d6; text-decoration: none; }
                .tgfc-md-content a:hover { text-decoration: underline; }
                .tgfc-md-bold { font-weight: 600; }
                .tgfc-md-italic { font-style: italic; }
                
                /* 动画 */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;

            let styleEl = document.createElement('style');
            styleEl.innerText = style;
            document.head.appendChild(styleEl);
        }
    }

    // Initialize
    new TGMarkdownEnhancer();

})();