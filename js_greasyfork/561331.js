// ==UserScript==
// @name         通用沉浸式阅读助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据段落标签与标题标签索引内容
// @author       Gemini
// @include      *
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561331/%E9%80%9A%E7%94%A8%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561331/%E9%80%9A%E7%94%A8%E6%B2%89%E6%B5%B8%E5%BC%8F%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.self !== window.top) return;

    // 1. 样式表：隔离正文控制与目录 UI
    GM_addStyle(`
        #G_READER_OVERLAY {
            position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh;
            background: var(--g-bg, #f4f1e7) !important; color: var(--g-text, #333) !important;
            z-index: 2147483647 !important; display: none; overflow: hidden;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif !important;
        }
        #G_PROGRESS { position: fixed; top: 0; left: 0; height: 3px; background: #8b4513 !important; width: 0%; z-index: 2147483649; }
        .g-wrapper { display: flex; height: 100%; width: 100%; background: inherit !important; }

        /* 侧边工具栏 */
        #G_SIDE_TOOLS {
            width: 55px; display: flex; flex-direction: column; gap: 15px;
            padding: 25px 0; border-right: 1px solid rgba(0,0,0,0.08);
            background: rgba(128,128,128,0.03); z-index: 10;
        }

        /* 目录面板：重新独立定义样式，不受正文字号变量干扰 */
        #G_TOC_PANEL {
            width: 280px; height: 100%; background: rgba(0,0,0,0.02);
            border-right: 1px solid rgba(0,0,0,0.08); overflow-y: auto;
            display: none; padding: 30px 15px; box-sizing: border-box;
            scrollbar-width: none;
        }
        #G_TOC_PANEL::-webkit-scrollbar { display: none; }
        #G_TOC_PANEL h3 {
            font-size: 16px !important; margin-bottom: 20px !important;
            color: var(--g-text) !important; opacity: 0.5; letter-spacing: 1px;
            font-weight: bold !important; text-indent: 0 !important;
        }

        .toc-item {
            cursor: pointer; padding: 10px 12px; font-size: 13.5px !important;
            line-height: 1.4 !important; margin-bottom: 4px; border-radius: 6px;
            transition: 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            color: var(--g-text) !important; opacity: 0.7; text-indent: 0 !important;
        }
        .toc-item:hover { opacity: 1; background: rgba(139,69,19,0.1); color: #8b4513 !important; }
        .toc-h1 { font-weight: bold !important; font-size: 15px !important; }
        .toc-h2 { padding-left: 18px; }
        .toc-h3 { padding-left: 30px; font-size: 12.5px !important; }

        /* 内容区滚动容器 */
        .g-main-view { flex: 1; overflow-y: auto; scroll-behavior: smooth; background: inherit !important; }
        .g-container { max-width: var(--g-width, 850px); margin: 0 auto; padding: 50px 40px 150px 40px; background: inherit !important; }

        /* --- 强力接管区：仅针对正文内容 --- */
        #G_BODY, #G_BODY * {
            background-color: transparent !important;
            color: inherit !important;
            line-height: 1.8 !important;
            font-size: var(--g-size, 22px) !important;
        }
        #G_BODY p {
            margin: 1.5em 0 !important;
            text-indent: 2em !important;
            text-align: justify !important;
            display: block !important;
        }
        #G_TITLE {
            color: var(--g-text, #333) !important; font-size: 32px !important;
            margin-bottom: 60px !important; text-align: center !important; font-weight: bold !important;
        }

        .tool-btn {
            width: 38px; height: 38px; border-radius: 50%; border: none;
            background: white !important; color: #333 !important; cursor: pointer;
            display: flex; align-items: center; justify-content: center; font-size: 14px; margin: 0 auto;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .tool-btn:hover { background: #8b4513 !important; color: white !important; }
        #G_FAB { position: fixed; bottom: 30px; right: 30px; width: 48px; height: 48px; background: #8b4513; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2147483640; box-shadow: 0 4px 12px rgba(0,0,0,0.2); font-size: 22px; }
    `);

    let cfg = { size: 22, bg: '#f4f1e7', text: '#333' };
    let isTocGenerated = false;

    function applyConfig() {
        overlay.style.setProperty('--g-bg', cfg.bg);
        overlay.style.setProperty('--g-text', cfg.text);
        overlay.style.setProperty('--g-size', cfg.size + 'px');

        // 仅刷新正文区的子元素，避开目录区
        const bodyText = document.querySelectorAll('#G_BODY *');
        bodyText.forEach(el => el.style.setProperty('font-size', cfg.size + 'px', 'important'));
    }

    function deepClean(element) {
        const all = element.getElementsByTagName("*");
        for (let el of all) {
            el.removeAttribute("style");
            el.removeAttribute("size");
            el.removeAttribute("color");
        }
    }

    function extractContent() {
        const nodes = document.querySelectorAll('div, article, section, main, td');
        let best = null, maxP = 0;
        nodes.forEach(n => {
            if (n.id.includes('G_READER')) return;
            const pCount = n.querySelectorAll(':scope > p').length;
            if (pCount > maxP) { maxP = pCount; best = n; }
        });
        if (!best) {
            let maxLen = 0;
            nodes.forEach(n => {
                const len = n.innerText.trim().length;
                if (len > maxLen) { maxLen = len; best = n; }
            });
        }
        if (!best) return;

        document.getElementById('G_TITLE').innerText = document.title.split(/[-_|]/)[0].trim();
        const body = document.getElementById('G_BODY');
        const clone = best.cloneNode(true);
        clone.querySelectorAll('script, style, iframe, ads, .ads, nav, button').forEach(el => el.remove());

        body.innerHTML = '';
        body.appendChild(clone);
        deepClean(body);

        if (body.querySelectorAll('p').length < 2) {
            body.innerHTML = '<p>' + body.innerHTML.replace(/<br\s*\/?>/gi, '</p><p>') + '</p>';
        }

        isTocGenerated = false;
        document.getElementById('TOC_CONTENT').innerHTML = '';
        document.getElementById('G_TOC_PANEL').style.display = 'none';
    }

    const overlay = document.createElement('div');
    overlay.id = 'G_READER_OVERLAY';
    overlay.innerHTML = `
        <div id="G_PROGRESS"></div>
        <div class="g-wrapper">
            <div id="G_SIDE_TOOLS">
                <button class="tool-btn" id="btn-toc" title="目录">📑</button>
                <button class="tool-btn" id="fs-plus">A+</button>
                <button class="tool-btn" id="fs-minus">A-</button>
                <button class="tool-btn" id="tm-sepia" style="background:#f4f1e7 !important">纸</button>
                <button class="tool-btn" id="tm-dark" style="background:#1a1a1a !important; color:#aaa !important">夜</button>
                <button class="tool-btn" id="btn-print">🖨️</button>
                <button class="tool-btn" id="g-close" style="background:#8b4513 !important; color:white !important; margin-top:20px">✕</button>
            </div>
            <div id="G_TOC_PANEL">
                <h3>INDEX</h3>
                <div id="TOC_CONTENT"></div>
            </div>
            <div class="g-main-view" id="G_SCROLLER">
                <div class="g-container">
                    <h1 id="G_TITLE"></h1>
                    <div id="G_BODY"></div>
                </div>
            </div>
        </div>
    `;
    document.documentElement.appendChild(overlay);

    const fab = document.createElement('div');
    fab.id = 'G_FAB'; fab.innerHTML = '📖';
    document.documentElement.appendChild(fab);

    // 绑定事件
    fab.onclick = () => { extractContent(); overlay.style.display = 'block'; document.documentElement.style.overflow = 'hidden'; applyConfig(); };
    document.getElementById('g-close').onclick = () => { overlay.style.display = 'none'; document.documentElement.style.overflow = ''; };
    document.getElementById('fs-plus').onclick = () => { cfg.size += 2; applyConfig(); };
    document.getElementById('fs-minus').onclick = () => { cfg.size -= 2; applyConfig(); };
    document.getElementById('tm-sepia').onclick = () => { cfg.bg = '#f4f1e7'; cfg.text = '#333'; applyConfig(); };
    document.getElementById('tm-dark').onclick = () => { cfg.bg = '#1a1a1a'; cfg.text = '#aaa'; applyConfig(); };
    document.getElementById('btn-print').onclick = () => { window.print(); };

    document.getElementById('btn-toc').onclick = () => {
        const p = document.getElementById('G_TOC_PANEL');
        if (isTocGenerated) {
            p.style.display = p.style.display === 'block' ? 'none' : 'block';
            return;
        }
        const headers = document.getElementById('G_BODY').querySelectorAll('h1, h2, h3, h4');
        const container = document.getElementById('TOC_CONTENT');
        if (headers.length > 0) {
            const frag = document.createDocumentFragment();
            headers.forEach((h, i) => {
                const id = `g-anchor-${i}`; h.id = id;
                const item = document.createElement('div');
                item.className = `toc-item toc-${h.tagName.toLowerCase()}`;
                item.innerText = h.innerText.trim();
                item.onclick = () => { h.scrollIntoView({behavior: "smooth"}); };
                frag.appendChild(item);
            });
            container.appendChild(frag);
            isTocGenerated = true;
            p.style.display = 'block';
        }
    };

    document.getElementById('G_SCROLLER').onscroll = (e) => {
        const scrolled = (e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight)) * 100;
        document.getElementById('G_PROGRESS').style.width = scrolled + "%";
    };

    window.addEventListener('keydown', e => {
        if (e.altKey && e.code === 'KeyR') fab.onclick();
        if (e.key === 'Escape') document.getElementById('g-close').onclick();
    });
})();