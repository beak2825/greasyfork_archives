// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  完美适配移动端：只能在单词上方，绝不遮挡源文本。智能边缘偏移，箭头精准跟随，iOS风格毛玻璃UI。
// @author       Hal
// @license      MIT
// @match        *://*/*
// @connect      dict.youdao.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558911/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/558911/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        autoAudio: true,        // 点击后自动发音
        zIndex: 2147483647,     // 最高层级
        arrowSize: 8,           // 箭头大小
        gap: 10,                // 弹窗距离单词的间距
    };

    // ================= 内存缓存 =================
    const wordCache = {};

    // ================= 样式注入 (CSS) =================
    const css = `
        :root {
            --gt-bg: rgba(255, 255, 255, 0.96);
            --gt-backdrop: blur(12px);
            --gt-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.1);
            --gt-radius: 12px;
            --gt-text: #1d1d1f;
            --gt-sub: #86868b;
            --gt-accent: #007aff;
            --gt-star: #ffcc00;
        }

        /* 容器：只负责定位，不负责显隐，显隐由 opacity 控制以避免重排闪烁 */
        #gt-wrapper {
            position: absolute;
            z-index: ${CONFIG.zIndex};
            width: max-content;
            max-width: 88vw; /* 移动端限制宽度 */
            min-width: 160px;
            opacity: 0;
            pointer-events: none; /* 隐藏时不阻挡交互 */
            transition: opacity 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            will-change: transform, opacity;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
        }
        
        #gt-wrapper.gt-visible {
            opacity: 1;
            pointer-events: auto;
        }

        /* 内容卡片 */
        #gt-container {
            background: var(--gt-bg);
            backdrop-filter: var(--gt-backdrop);
            -webkit-backdrop-filter: var(--gt-backdrop);
            border-radius: var(--gt-radius);
            padding: 12px 14px;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: var(--gt-text);
            border: 1px solid rgba(0,0,0,0.05);
            position: relative;
        }

        /* 动态箭头 - 绝对定位相对于 wrapper */
        #gt-arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-left: ${CONFIG.arrowSize}px solid transparent;
            border-right: ${CONFIG.arrowSize}px solid transparent;
            border-top: ${CONFIG.arrowSize}px solid var(--gt-bg); /* 默认向下指 */
            bottom: -${CONFIG.arrowSize}px; /* 位于 wrapper 底部外侧 */
            left: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }

        /* 翻转模式：当上方完全没空间时，不得不显示在下方 (极罕见) */
        #gt-wrapper.gt-flipped #gt-arrow {
            top: -${CONFIG.arrowSize}px;
            bottom: auto;
            border-top: none;
            border-bottom: ${CONFIG.arrowSize}px solid var(--gt-bg);
        }

        /* 第一行：单词 + 星级 */
        .gt-row-1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .gt-word { font-weight: 700; font-size: 17px; color: #000; margin-right: 8px; }
        .gt-stars { font-size: 12px; color: #e5e5e5; letter-spacing: -1px; white-space: nowrap; }
        .gt-star-on { color: var(--gt-star); }

        /* 第二行：音标 + 喇叭 */
        .gt-row-2 { display: flex; align-items: center; margin-bottom: 8px; color: var(--gt-sub); font-size: 13px; font-family: "Lucida Sans Unicode", monospace; }
        .gt-speaker {
            margin-left: 8px; color: var(--gt-accent); cursor: pointer; display: flex; align-items: center;
            padding: 4px; border-radius: 50%; background: rgba(0,122,255,0.05);
            transition: background 0.1s;
        }
        .gt-speaker:active { background: rgba(0,122,255,0.2); }

        /* 第三行：释义 */
        .gt-row-3 ul { margin: 0; padding: 0; list-style: none; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 8px; }
        .gt-row-3 li { margin-bottom: 5px; display: flex; align-items: baseline; }
        .gt-pos { color: #888; font-size: 11px; background: #f2f2f7; padding: 1px 6px; border-radius: 4px; margin-right: 6px; flex-shrink: 0; font-weight: 600; }
        .gt-def { color: #333; line-height: 1.4; text-align: left; word-break: break-word; }

        .gt-loading { color: #999; font-size: 13px; font-style: italic; display: flex; align-items: center; gap: 6px; }
        
        /* PC 端限制最大宽度 */
        @media screen and (min-width: 481px) {
            #gt-wrapper { max-width: 320px; }
        }
    `;
    GM_addStyle(css);

    // ================= 全局变量 =================
    let wrapper = null;
    let arrow = null;
    let contentBox = null;
    let currentAudio = null;
    let activeRangeRect = null; // 保存当前选中单词的几何位置

    // ================= 初始化 UI =================
    function initUI() {
        if (document.getElementById('gt-wrapper')) return;

        wrapper = document.createElement('div');
        wrapper.id = 'gt-wrapper';
        wrapper.innerHTML = `
            <div id="gt-container"></div>
            <div id="gt-arrow"></div>
        `;
        document.body.appendChild(wrapper);
        
        contentBox = document.getElementById('gt-container');
        arrow = document.getElementById('gt-arrow');

        // 阻止点击内部关闭
        wrapper.addEventListener('click', (e) => e.stopPropagation());
    }

    // ================= 核心逻辑：获取单词范围 =================
    // 返回 Range 对象，包含精确的几何位置
    function getRangeAtPoint(x, y) {
        if (!document.caretRangeFromPoint) return null;
        const range = document.caretRangeFromPoint(x, y);
        if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return null;

        const textNode = range.startContainer;
        const offset = range.startOffset;
        const text = textNode.nodeValue;

        // 核心正则：匹配单词边界
        const beforeMatch = text.substring(0, offset).match(/[a-zA-Z-']+$/);
        const afterMatch = text.substring(offset).match(/^[a-zA-Z-']+/);

        if (beforeMatch && afterMatch) {
            // 重新设置 Range 范围以包裹整个单词
            range.setStart(textNode, offset - beforeMatch[0].length);
            range.setEnd(textNode, offset + afterMatch[0].length);
            return { range: range, word: beforeMatch[0] + afterMatch[0] };
        } else if (beforeMatch) {
            range.setStart(textNode, offset - beforeMatch[0].length);
            range.setEnd(textNode, offset);
            return { range: range, word: beforeMatch[0] };
        } else if (afterMatch) {
            range.setStart(textNode, offset);
            range.setEnd(textNode, offset + afterMatch[0].length);
            return { range: range, word: afterMatch[0] };
        }
        return null;
    }

    // ================= 音频播放 =================
    function playAudio(word) {
        if (currentAudio) { currentAudio.pause(); currentAudio = null; }
        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`;
        currentAudio = new Audio(url);
        currentAudio.play().catch(() => {});
    }

    // ================= 渲染星星 =================
    function renderStars(count) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="${i <= count ? 'gt-star-on' : ''}">★</span>`;
        }
        return html;
    }

    // ================= 显示与数据请求 =================
    function showPopup(wordObj, x, y) {
        if (!wrapper) initUI();

        const word = wordObj.word.trim();
        // 获取单词的精确几何矩形 (Bounding Client Rect)
        // 这是不遮挡的关键：我们基于这个矩形定位，而不是基于鼠标点击点
        activeRangeRect = wordObj.range.getBoundingClientRect();

        // 1. 优先显示缓存
        if (wordCache[word]) {
            renderContent(word, wordCache[word]);
            if (CONFIG.autoAudio) playAudio(word);
        } else {
            contentBox.innerHTML = `<div class="gt-loading"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v5a1 1 0 0 0 .29.71l3.54 3.54a1 1 0 0 0 1.41-1.41L13 11.59V7a1 1 0 0 0-1-1z"/></svg> 查询中...</div>`;
            fetchData(word);
        }

        // 2. 先计算位置 (此时内容可能还未完全撑开，但能大致定位)
        reposition();
        
        // 3. 显示
        wrapper.classList.add('gt-visible');
    }

    function fetchData(word) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://dict.youdao.com/jsonapi?q=${encodeURIComponent(word)}`,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    wordCache[word] = data;
                    renderContent(word, data);
                    if(CONFIG.autoAudio) playAudio(word);
                    // 内容变化，高度变化，必须重新定位
                    requestAnimationFrame(reposition); 
                } catch (e) {
                    contentBox.innerHTML = `<div class="gt-loading" style="color:#ff3b30">数据解析错误</div>`;
                }
            },
            onerror: () => {
                contentBox.innerHTML = `<div class="gt-loading" style="color:#ff3b30">网络请求失败</div>`;
            }
        });
    }

    // ================= 渲染内容 HTML =================
    function renderContent(word, data) {
        let phonetic = '';
        let meaningsHtml = '';
        let starsHtml = '';

        // 提取音标
        if (data.simple?.word?.[0]) {
            const w = data.simple.word[0];
            const p = w.usphone || w.ukphone || w.phone;
            if (p) phonetic = `/${p}/`;
        } else if (data.ec?.word?.[0]?.usphone) {
             phonetic = `/${data.ec.word[0].usphone}/`;
        }

        // 提取星级
        let starCount = 0;
        if (data.collins?.collins_entries?.[0]?.star) {
            starCount = data.collins.collins_entries[0].star;
        }
        starsHtml = renderStars(starCount);

        // 提取释义
        if (data.ec?.word?.[0]?.trs) {
            data.ec.word[0].trs.forEach(item => {
                const text = item.tr?.[0]?.l?.i?.join('；');
                if (text) {
                    const match = text.match(/^([a-z]+\.)\s*(.+)/);
                    if (match) {
                        meaningsHtml += `<li><span class="gt-pos">${match[1]}</span><span class="gt-def">${match[2]}</span></li>`;
                    } else {
                        meaningsHtml += `<li><span class="gt-def">${text}</span></li>`;
                    }
                }
            });
        } else if (data.web_trans?.["web-translation"]) {
             data.web_trans["web-translation"].slice(0, 3).forEach(item => {
                 meaningsHtml += `<li><span class="gt-pos">网</span><span class="gt-def">${item.trans.map(t=>t.value).join('; ')}</span></li>`;
             });
        } else {
            meaningsHtml = `<li><span class="gt-def">暂无释义</span></li>`;
        }

        const speakerIcon = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>`;

        contentBox.innerHTML = `
            <div class="gt-row-1">
                <span class="gt-word">${word}</span>
                <span class="gt-stars">${starsHtml}</span>
            </div>
            <div class="gt-row-2">
                <span>${phonetic}</span>
                <span class="gt-speaker" id="gt-click-voice">${speakerIcon}</span>
            </div>
            <div class="gt-row-3">
                <ul>${meaningsHtml}</ul>
            </div>
        `;

        document.getElementById('gt-click-voice').onclick = (e) => {
            e.stopPropagation();
            playAudio(word);
        };
    }

    // ================= 终极定位算法 (Reposition) =================
    function reposition() {
        if (!wrapper || !activeRangeRect) return;

        // 1. 获取尺寸
        const popupRect = wrapper.getBoundingClientRect();
        const wordRect = activeRangeRect;
        
        // 视口尺寸
        const winW = document.documentElement.clientWidth;
        
        // 滚动距离
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // ================= X轴定位 (水平漂移逻辑) =================
        // 目标：让弹窗中心 对齐 单词中心
        const wordCenterX = wordRect.left + (wordRect.width / 2);
        let left = wordCenterX - (popupRect.width / 2);

        // 边界限制：距离屏幕边缘至少 10px
        const margin = 10;
        
        // 左溢出修正
        if (left < margin) left = margin;
        // 右溢出修正
        if (left + popupRect.width > winW - margin) {
            left = winW - popupRect.width - margin;
        }

        // ================= Y轴定位 (垂直上方逻辑) =================
        // 默认：单词顶部 - 弹窗高度 - 箭头高度 - 间距
        let top = wordRect.top - popupRect.height - CONFIG.arrowSize - 2;
        let isFlipped = false;

        // 极特殊情况：如果上方空间不足 (比如单词在浏览器最顶端)
        // 只有当 top < 0 时，才允许放到下面
        if (top < 0) {
            top = wordRect.bottom + CONFIG.arrowSize + 4; // 放到单词下方
            isFlipped = true;
        }

        // ================= 箭头定位 (跟随单词) =================
        // 箭头相对于弹窗左侧的位置 = 单词中心绝对坐标 - 弹窗左侧绝对坐标
        let arrowLeft = wordCenterX - left;
        
        // 限制箭头不要超出弹窗圆角
        const arrowSafe = 14; 
        if (arrowLeft < arrowSafe) arrowLeft = arrowSafe;
        if (arrowLeft > popupRect.width - arrowSafe) arrowLeft = popupRect.width - arrowSafe;

        // ================= 应用样式 =================
        wrapper.style.left = `${left + scrollX}px`;
        wrapper.style.top = `${top + scrollY}px`;

        arrow.style.left = `${arrowLeft}px`;
        
        // 处理翻转样式
        if (isFlipped) {
            wrapper.classList.add('gt-flipped');
        } else {
            wrapper.classList.remove('gt-flipped');
        }
    }

    function hidePopup() {
        if (wrapper) {
            wrapper.classList.remove('gt-visible');
            activeRangeRect = null;
        }
    }

    // ================= 事件监听 =================
    document.addEventListener('click', (e) => {
        // 忽略无关元素
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input')) return;
        
        // 获取带几何信息的单词对象
        const result = getRangeAtPoint(e.clientX, e.clientY);
        
        if (result && result.word.length > 1) {
            showPopup(result, e.clientX, e.clientY);
        } else {
            hidePopup();
        }
    });

    // 滚动时隐藏，防止位置错乱
    window.addEventListener('scroll', hidePopup, { passive: true });

    // 窗口大小改变时重新计算 (横屏竖屏切换)
    window.addEventListener('resize', () => {
        if (activeRangeRect) hidePopup();
    });

})();
