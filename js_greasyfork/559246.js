// ==UserScript==
// @name         ​X-Insight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移动端推特：点击单词查词+发音，防跳转。修复推文内部按钮（翻译、语音等）无法点击的问题。
// @author       Gemini
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @connect      dict.youdao.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559246/X-Insight.user.js
// @updateURL https://update.greasyfork.org/scripts/559246/X-Insight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CSS 样式 (保持原样) ---
    const style = `
        /* 强制允许文本选择，解决移动端无法点选问题 */
        [data-testid="tweetText"] {
            -webkit-user-select: text !important;
            user-select: text !important;
            cursor: text !important;
        }

        /* 弹窗容器 */
        #tw-dict-card {
            position: fixed;
            z-index: 10000;
            background: rgba(30, 33, 36, 0.98);
            backdrop-filter: blur(10px);
            color: #fff;
            padding: 12px 16px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.2);
            max-width: 85vw;
            width: auto;
            min-width: 180px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: none;
            opacity: 0;
            transform: scale(0.98);
            transition: opacity 0.15s ease-out, transform 0.15s ease-out;
            pointer-events: auto;
            border: 1px solid rgba(255,255,255,0.1);
        }

        #tw-dict-card.show {
            opacity: 1;
            transform: scale(1);
        }

        /* 头部布局 */
        .tw-dict-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.15);
            padding-bottom: 8px;
        }

        .tw-dict-word {
            font-size: 19px;
            font-weight: 800;
            color: #fff;
            margin-right: 10px;
        }

        /* 喇叭按钮 */
        .tw-dict-audio-btn {
            background: rgba(29, 155, 240, 0.2);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #1d9bf0;
            -webkit-tap-highlight-color: transparent;
            transition: transform 0.1s, background 0.2s;
        }
        .tw-dict-audio-btn:active {
            background: rgba(29, 155, 240, 0.4);
            transform: scale(0.9);
        }
        /* 播放动画状态 */
        .tw-dict-audio-playing {
            color: #fff !important;
            background: #1d9bf0 !important;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        /* 元数据区 */
        #tw-dict-meta {
            margin-bottom: 6px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        }

        .tw-dict-phonetic {
            font-size: 14px;
            color: #8899a6;
            font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif;
        }

        /* 星星 */
        .tw-dict-stars {
            color: #ffad1f;
            font-size: 12px;
            letter-spacing: 1px;
        }
        .tw-dict-stars-empty {
            color: #536471;
        }

        /* 释义区 */
        .tw-dict-def {
            font-size: 15px;
            line-height: 1.5;
            color: #e7e9ea;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .tw-dict-loading {
            font-size: 13px;
            color: #8899a6;
        }
    `;
    GM_addStyle(style);

    // --- 2. 全局变量 ---
    let currentWord = null;
    let isPopupVisible = false;
    let activeAudio = null;

    // --- 3. 初始化 DOM ---
    function initCard() {
        if (document.getElementById('tw-dict-card')) return;
        
        const div = document.createElement('div');
        div.id = 'tw-dict-card';
        div.innerHTML = `
            <div class="tw-dict-header">
                <span class="tw-dict-word"></span>
                <button class="tw-dict-audio-btn" aria-label="Play Audio">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 4.437a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 2.75 2.75 0 000-3.889 1 1 0 000-1.414 4.75 4.75 0 000-6.717.75.75 0 010-1.06.75.75 0 011.06 0zm-2.121 2.121a.75.75 0 011.06 0c2.636 2.636 2.636 6.91 0 9.546a.75.75 0 11-1.06-1.06 1.25 1.25 0 000-1.768 2.5 2.5 0 000-3.535.75.75 0 010-1.06z"></path></svg>
                </button>
            </div>
            <div id="tw-dict-meta"></div>
            <div class="tw-dict-def"></div>
        `;
        document.body.appendChild(div);

        const audioBtn = div.querySelector('.tw-dict-audio-btn');
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentWord) {
                playAudio(currentWord, audioBtn);
            }
        });

        div.addEventListener('click', (e) => e.stopPropagation());
    }

    // --- 4. 音频播放逻辑 ---
    function playAudio(word, btnElement) {
        if (!word) return;
        if (activeAudio) {
            activeAudio.pause();
            activeAudio = null;
        }

        if(btnElement) btnElement.classList.add('tw-dict-audio-playing');

        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=2`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function(response) {
                try {
                    const blobUrl = URL.createObjectURL(response.response);
                    const audio = new Audio(blobUrl);
                    activeAudio = audio;
                    
                    audio.onended = () => {
                        if(btnElement) btnElement.classList.remove('tw-dict-audio-playing');
                        URL.revokeObjectURL(blobUrl);
                        activeAudio = null;
                    };
                    audio.onerror = () => {
                        if(btnElement) btnElement.classList.remove('tw-dict-audio-playing');
                    };
                    
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if(btnElement) btnElement.classList.remove('tw-dict-audio-playing');
                        });
                    }
                } catch (e) {
                    if(btnElement) btnElement.classList.remove('tw-dict-audio-playing');
                }
            },
            onerror: function() {
                if(btnElement) btnElement.classList.remove('tw-dict-audio-playing');
            }
        });
    }

    // --- 5. 辅助 UI 渲染 ---
    function renderStars(level) {
        if (!level) return '';
        let starsHtml = '<div class="tw-dict-stars">';
        for (let i = 0; i < 5; i++) {
            starsHtml += (i < level) ? '★' : '<span class="tw-dict-stars-empty">★</span>';
        }
        starsHtml += '</div>';
        return starsHtml;
    }

    // --- 6. 显示与定位 ---
    function showCard(word, rect) {
        initCard();
        const card = document.getElementById('tw-dict-card');
        const wordEl = card.querySelector('.tw-dict-word');
        const metaEl = document.getElementById('tw-dict-meta');
        const defEl = card.querySelector('.tw-dict-def');

        currentWord = word;
        wordEl.textContent = word;
        metaEl.innerHTML = '';
        defEl.innerHTML = '<div class="tw-dict-loading">Loading...</div>';
        card.classList.remove('show');
        card.style.display = 'block';
        card.style.visibility = 'hidden';

        fetchData(word, rect);
    }

    function updatePosition(rect) {
        const card = document.getElementById('tw-dict-card');
        if (!card || card.style.display === 'none') return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const cardHeight = card.offsetHeight;
        const cardWidth = card.offsetWidth;

        let left = rect.left + (rect.width / 2) - (cardWidth / 2);
        if (left < 10) left = 10;
        if (left + cardWidth > viewportWidth - 10) left = viewportWidth - cardWidth - 10;

        const spaceAbove = rect.top;
        const margin = 15;
        let top;

        if (spaceAbove > cardHeight + margin) {
            top = rect.top - cardHeight - margin;
        } else {
            top = rect.bottom + margin;
            if (top + cardHeight > viewportHeight - 10) {
                top = viewportHeight - cardHeight - 10;
            }
        }

        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        card.style.visibility = 'visible';
        card.classList.add('show');
        isPopupVisible = true;
    }

    function hideCard() {
        const card = document.getElementById('tw-dict-card');
        if (card && isPopupVisible) {
            card.classList.remove('show');
            isPopupVisible = false;
            setTimeout(() => {
                if(!isPopupVisible) card.style.display = 'none';
            }, 150);
            window.getSelection().removeAllRanges();
        }
    }

    // --- 7. 数据请求 ---
    function fetchData(word, rect) {
         GM_xmlhttpRequest({
            method: "GET",
            url: `https://dict.youdao.com/jsonapi?q=${encodeURIComponent(word)}`,
            onload: function(response) {
                const card = document.getElementById('tw-dict-card');
                if(!card) return;

                try {
                    const data = JSON.parse(response.responseText);
                    const metaEl = document.getElementById('tw-dict-meta');
                    const defEl = card.querySelector('.tw-dict-def');

                    let phone = '';
                    let definition = '';
                    let starLevel = 0;

                    if (data.collins?.collins_entries?.[0]) {
                        starLevel = data.collins.collins_entries[0].star || 0;
                    }
                    if (data.simple?.word?.[0]) {
                        phone = data.simple.word[0].usphone || data.simple.word[0].phone || "";
                    }
                    if (data.ec?.word?.[0]) {
                        definition = data.ec.word[0].trs.map(t => t.tr[0].l.i.join("；")).join("<br>");
                    } else if (data.web_trans) {
                        definition = data.web_trans["web-translation"][0].trans.map(t => t.value).join("；");
                    } else {
                        definition = data.fanyi ? data.fanyi.tran : "未找到详细释义";
                    }

                    let metaHtml = '';
                    if (starLevel > 0) metaHtml += renderStars(starLevel);
                    if (phone) metaHtml += `<span class="tw-dict-phonetic">/${phone}/</span>`;
                    metaEl.innerHTML = metaHtml;
                    defEl.innerHTML = definition;

                    updatePosition(rect);

                } catch (e) {
                    card.querySelector('.tw-dict-def').textContent = "解析失败";
                    updatePosition(rect);
                }
            }
        });
    }

    // --- 8. 事件交互 (核心修正版) ---
    function handleInteraction(e) {
        if (e.target.closest('#tw-dict-card')) return;
        
        hideCard();

        const textContainer = e.target.closest('[data-testid="tweetText"]');

        if (textContainer) {
            // *** 关键修正：交互元素检测白名单 ***
            // 如果点击的是按钮、链接、SVG图标、或具有 role="button" 的元素，
            // 立即返回，不执行任何拦截！让 Twitter 自带的事件去处理它。
            const target = e.target;
            if (
                target.tagName === 'A' || target.closest('a') ||
                target.tagName === 'BUTTON' || target.closest('button') ||
                target.getAttribute('role') === 'button' || target.closest('[role="button"]') ||
                target.tagName === 'svg' || target.closest('svg') || 
                target.tagName === 'IMG' ||
                // 某些翻译按钮是 div role="link" 或类似的
                target.getAttribute('role') === 'link'
            ) {
                // 这是一个交互按钮，放行！
                return;
            }

            // 如果不是按钮，而是普通文本，那么拦截跳转
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();

            // 查词逻辑
            if (document.caretRangeFromPoint) {
                const range = document.caretRangeFromPoint(e.clientX, e.clientY);
                if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
                    range.expand('word');
                    const word = range.toString().trim();
                    
                    if (word && /^[a-zA-Z\u00C0-\u00FF]+(-[a-zA-Z]+)*$/.test(word)) {
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        const rect = range.getBoundingClientRect();
                        showCard(word, rect);
                        
                        // 自动发音
                        const audioBtn = document.querySelector('.tw-dict-audio-btn');
                        playAudio(word, audioBtn);
                    }
                }
            }
        }
    }

    // 监听 capture 阶段
    document.addEventListener('click', handleInteraction, true);

    // 滚动隐藏
    window.addEventListener('scroll', () => {
        if(isPopupVisible) hideCard();
    }, { passive: true, capture: true });

})();
