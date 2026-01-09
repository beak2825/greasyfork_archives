// ==UserScript==
// @name         Wikipedia Windows 8.1 Metro (Vertical Tategaki Fix)
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Win8 维基百科 V7：修复纵书模式失效问题 + 按钮替换 + 极速加载
// @author       RetroFan
// @match        *://*.wikipedia.org/wiki/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561726/Wikipedia%20Windows%2081%20Metro%20%28Vertical%20Tategaki%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561726/Wikipedia%20Windows%2081%20Metro%20%28Vertical%20Tategaki%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置读取 (极速预判) ---
    const KEY_TATE = 'win8-wiki-tate-v7'; // 縦書き (Vertical)
    const KEY_RTL = 'win8-wiki-rtl-v7';   // 横向时的方向

    // 读取配置
    let isTategaki = localStorage.getItem(KEY_TATE) === 'true';
    let isRTL = localStorage.getItem(KEY_RTL) === 'true';

    const html = document.documentElement;

    // 逻辑：如果是纵书，必然是 RTL (从右向左生成的流)
    // 如果是横向且开启了 RTL，也是 RTL
    if (isTategaki || isRTL) {
        html.setAttribute('dir', 'rtl');
    } else {
        html.removeAttribute('dir');
    }

    // 标记纵书模式类名
    if (isTategaki) {
        html.classList.add('mode-tategaki');
    }

    // --- 2. 样式注入 (CSS) ---
    const css = `
        /* === 全局重置 === */
        html {
            overflow-y: hidden !important;
            overflow-x: auto !important;
            height: 100vh !important;
            width: 100vw !important;
            scrollbar-width: thin;
        }

        body {
            opacity: 0; /* 加载防闪烁 */
            transition: opacity 0.2s ease;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #fcfcfc !important;
            color: #1d1d1d !important;
            height: 100vh !important;
        }

        body.loaded { opacity: 1 !important; }

        /* 字体逻辑 */
        html.mode-tategaki body {
            /* 纵书用衬线体更美观 */
        }
        html:not(.mode-tategaki) body {
            /* 横书用 Metro 风格无衬线 */
        }

        /* 隐藏原生界面 */
        #mw-page-base, #mw-head-base, #mw-navigation, #footer, .mw-editsection,
        #siteNotice, .mw-jump-link, #mw-panel, #mw-head, #siteSub {
            display: none !important;
        }

        /* === 核心内容容器 === */
        #content {
            position: absolute;
            top: 100px;
            bottom: 100px;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-sizing: border-box;
            display: block;
        }

        /* ====== 模式 A: 标准横向 (Horizontal) ====== */
        html:not(.mode-tategaki) #content {
            width: auto !important;
            min-width: 100vw;
            height: calc(100vh - 200px) !important;

            /* 关键：横向靠 column 实现 */
            column-count: auto;
            column-width: 420px;
            column-gap: 50px;
            column-fill: auto;
        }

        /* 横向 LTR 间距 */
        html:not(.mode-tategaki):not([dir="rtl"]) #content {
            padding-left: 80px !important;
            padding-right: 40px !important;
            left: 0; right: auto;
        }
        /* 横向 RTL 间距 */
        html:not(.mode-tategaki)[dir="rtl"] #content {
            padding-right: 80px !important;
            padding-left: 40px !important;
            left: auto; right: 0;
        }

        /* ====== 模式 B: 纵书 (Vertical / Tategaki) ====== */
        html.mode-tategaki #content {
            /* 关键 1: 开启垂直书写 */
            writing-mode: vertical-rl !important;
            -webkit-writing-mode: vertical-rl !important;
            text-orientation: upright !important;

            /* 关键 2: 彻底禁用分栏 (这是之前没生效的原因) */
            column-count: auto !important;
            column-width: auto !important;

            /* 布局调整 */
            width: auto !important;
            height: calc(100vh - 200px) !important; /* 限制高度，迫使内容向左延伸 */

            padding-top: 0 !important;
            padding-bottom: 0 !important;
            padding-right: 80px !important; /* 起始点在右边 */
            padding-left: 40px !important;

            left: auto;
            right: 0; /* 钉在右边 */
        }

        /* 纵书段落调整 */
        html.mode-tategaki p, html.mode-tategaki li {
            text-indent: 1em;
            margin-bottom: 0 !important;
            margin-left: 20px !important; /* 纵书的 margin-left 视觉上是段后距 */
            line-height: 1.8 !important;
            text-align: justify;
        }

        /* 元素防断裂 */
        img, table, figure, .thumb, .infobox, #toc {
            break-inside: avoid;
            box-shadow: none !important;
            border: none !important;
        }

        /* 图片限制 */
        html:not(.mode-tategaki) img { max-width: 100% !important; height: auto !important; }

        /* 纵书模式下，图片最大高度不能超过屏幕，宽度自适应 */
        html.mode-tategaki img {
            max-height: calc(100vh - 250px) !important;
            max-width: none !important;
            width: auto !important;
            margin: 10px;
        }

        .infobox { background: #f0f0f0 !important; margin-bottom: 20px !important; }
        #toc { background: #e1e1e1 !important; padding: 20px !important; }

        /* === 标题与UI === */
        h1#firstHeading {
            position: fixed;
            top: 25px;
            font-weight: 100 !important;
            font-size: 3.5rem !important;
            margin: 0 !important;
            z-index: 1000;
            white-space: nowrap;
            background: #fcfcfc;
            pointer-events: none;
        }

        /* 横向标题 */
        html:not(.mode-tategaki):not([dir="rtl"]) h1#firstHeading { left: 90px; padding-right: 30px; }
        html:not(.mode-tategaki)[dir="rtl"] h1#firstHeading { right: 90px; text-align: right; padding-left: 30px; }

        /* 纵书标题 (保持横排在右上角，或可改为竖排) */
        html.mode-tategaki h1#firstHeading {
            top: 25px;
            right: 90px;
            text-align: right;
            padding-left: 30px;
            writing-mode: horizontal-tb !important; /* 标题保持横向阅读比较舒服 */
        }

        /* 返回按钮 */
        #win8-back-btn {
            position: fixed; top: 35px; width: 48px; height: 48px;
            border: 2px solid #1d1d1d; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 1001; background: transparent;
        }
        #win8-back-btn:hover { background: #1d1d1d; }
        #win8-back-btn:hover svg { fill: #ffffff; }

        html:not([dir="rtl"]) #win8-back-btn { left: 20px; }
        html[dir="rtl"] #win8-back-btn { right: 20px; transform: scaleX(-1); }

        /* 底部 App Bar */
        #win8-bottom-bar {
            position: fixed; bottom: 0; left: 0; width: 100%; height: 80px;
            background: #e6e6e6; display: flex; align-items: center;
            z-index: 2000; opacity: 0.95;
        }
        html:not([dir="rtl"]) #win8-bottom-bar { padding-left: 40px; justify-content: flex-start; }
        html[dir="rtl"] #win8-bottom-bar { padding-right: 40px; flex-direction: row-reverse; }

        .app-bar-btn { display: flex; flex-direction: column; align-items: center; cursor: pointer; color: #1d1d1d; margin: 0 15px; user-select: none; }
        .app-bar-icon-circle { width: 40px; height: 40px; border: 2px solid #1d1d1d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; }
        .app-bar-btn:hover .app-bar-icon-circle { background: #1d1d1d; color: white; }
        .app-bar-text { font-size: 12px; font-weight: 600; }

        /* 滚动条 */
        ::-webkit-scrollbar { height: 12px; width: 12px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 6px; }
        ::-webkit-scrollbar-thumb:hover { background: #aaa; }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    html.appendChild(style);

    // --- 3. UI 渲染 ---
    function initUI() {
        const body = document.body;

        // 1. Back Button
        const backBtn = document.createElement('div');
        backBtn.id = 'win8-back-btn';
        backBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
        backBtn.onclick = () => window.history.back();
        body.appendChild(backBtn);

        // 2. App Bar
        const bottomBar = document.createElement('div');
        bottomBar.id = 'win8-bottom-bar';

        const createBtn = (text, path, action, active = false) => {
            const b = document.createElement('div');
            b.className = 'app-bar-btn';
            b.innerHTML = `<div class="app-bar-icon-circle" style="${active ? 'background:#1d1d1d;color:white;fill:white' : ''}"><svg viewBox="0 0 24 24" width="20" height="20" style="fill:currentColor"><path d="${path}"/></svg></div><div class="app-bar-text">${text}</div>`;
            b.onclick = action;
            return b;
        };

        // Pin Button
        bottomBar.appendChild(createBtn('Pin', 'M16 9v4.66l-2.5 2.84H12v5l-1 1-1-1v-5H8.5L6 13.66V9h10m0-2H6c-1.1 0-2 .9-2 2v4.66l1.5 1.84h3v4.5l.5.5.5-.5v-4.5h3l1.5-1.84V9c0-1.1-.9-2-2-2z', () => alert('Pinned!')));

        // === [核心] 纵书切换按钮 (替换了 Browser) ===
        // 图标：T字形箭头，表示从上往下
        const tateIcon = 'M10 2h2v14.5l3.5-3.5 1.42 1.42L11 20.34l-5.92-5.92L6.5 13l3.5 3.5z';
        bottomBar.appendChild(createBtn(isTategaki ? '横書きへ' : '縦書きへ', tateIcon, () => {
            // 切换状态
            isTategaki = !isTategaki;
            localStorage.setItem(KEY_TATE, isTategaki);
            window.location.reload();
        }, isTategaki));

        // Direction Button (仅在横向模式显示，纵向不需要因为固定是RTL)
        if (!isTategaki) {
            bottomBar.appendChild(createBtn('R/L Switch', 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z', () => {
                isRTL = !isRTL;
                localStorage.setItem(KEY_RTL, isRTL);
                window.location.reload();
            }));
        }

        body.appendChild(bottomBar);

        // Move Heading
        const heading = document.getElementById('firstHeading');
        if (heading) body.appendChild(heading);

        // Show Body
        requestAnimationFrame(() => body.classList.add('loaded'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

    // --- 4. 滚动逻辑 ---
    window.addEventListener('wheel', function(e) {
        if (e.shiftKey || e.deltaY === 0) return;
        e.preventDefault();

        const speed = 2.5;
        const delta = e.deltaY * speed;

        // 在纵书(Tategaki) 和 RTL横向 模式下，内容都是从右向左流
        // 所以滚轮向下(想看下一页)，应该是向左移动 (ScrollBy 负值)
        if (isTategaki || isRTL) {
            window.scrollBy({ left: -delta, behavior: 'auto' });
        } else {
            window.scrollBy({ left: delta, behavior: 'auto' });
        }
    }, { passive: false });

})();