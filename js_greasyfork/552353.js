// ==UserScript==
// @name         洛谷个人介绍显示
// @namespace    https://www.luogu.com.cn/user/
// @version      1.5
// @description  自动显示 user.introduction，用 LuoguMarkdown + KaTeX + Prism 渲染，等待趋势图加载，图片自适应
// @author       chat-gpt
// @license       MIT
// @match        https://www.luogu.com.cn/user/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js
// @require      https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js
// @downloadURL https://update.greasyfork.org/scripts/552353/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/552353/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%BB%8B%E7%BB%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    async function initMarkdownRenderer() {
        const code = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://songlll.pages.dev/a.js",
                onload: res => resolve(res.responseText),
                onerror: reject
            });
        });

        return new Promise(resolve => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const win = iframe.contentWindow;
            const doc = iframe.contentDocument || win.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><body><div id="app"></div></body></html>');
            doc.close();

            win.eval(code);

            const interval = setInterval(() => {
                if (win.LuoguMarkdown) {
                    clearInterval(interval);
                    console.log('✅ LuoguMarkdown 已初始化');
                    resolve(win.LuoguMarkdown);
                }
            }, 100);
        });
    }

    const markdown = await initMarkdownRenderer();

    function renderMarkdown(text) {
        const html = markdown.processSync(text).toString();
        const container = document.createElement('div');
        container.innerHTML = html;

        // 渲染公式
        renderMathInElement(container, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ]
        });

        // 图片自适应盒子
        container.querySelectorAll('img').forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '10px 0';
        });

        // 代码高亮
        container.querySelectorAll('pre code').forEach(block => {
            Prism.highlightElement(block);
            block.style.display = 'block';
            block.style.overflowX = 'auto';
        });

        return container.innerHTML;
    }

    // 获取用户介绍数据
    const jsonScript = document.getElementById('lentille-context');
    if (!jsonScript) return;
    const jsonData = JSON.parse(jsonScript.textContent);
    const introduction = jsonData.data.user.introduction || '这个人很懒，什么都没有留下。';

    // 等待趋势图加载
    function waitForTrendCard(callback) {
        const interval = setInterval(() => {
            const cards = document.querySelectorAll('.l-card');
            let trendCard = null;
            cards.forEach(card => {
                const h3 = card.querySelector('h3.lfe-h3');
                if (h3 && h3.textContent.includes('比赛等级分趋势图')) {
                    trendCard = card;
                }
            });
            if (trendCard) {
                clearInterval(interval);
                callback(trendCard);
            }
        }, 200);
    }

    waitForTrendCard(trendCard => {
        const container = document.createElement('div');
        container.id = 'custom-introduction';
        container.style.marginTop = '20px';
        container.style.border = '1px solid #ddd';
        container.style.padding = '10px';
        container.style.boxSizing = 'border-box';
        container.style.maxWidth = '100%';
        container.style.overflowWrap = 'break-word';

        trendCard.parentNode.insertBefore(container, trendCard.nextSibling);

        container.innerHTML = renderMarkdown(introduction);
    });
})();
