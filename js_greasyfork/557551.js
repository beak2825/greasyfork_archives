// ==UserScript==
// @license MIT
// @name         치지직 이모티콘 입력
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  치지직 채팅 입력칸 바로 위에 이모티콘 바 추가
// @match        https://chzzk.naver.com/*
// @icon         https://ssl.pstatic.net/static/nng/glive/icon/favicon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557551/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98%20%EC%9E%85%EB%A0%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/557551/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98%20%EC%9E%85%EB%A0%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 설정 및 디자인
    const STORAGE_KEY = "chzzk_recent_emotes_tm_session";
    const MAX_RECENT = 15;

    GM_setValue(STORAGE_KEY, []);

    GM_addStyle(`
        #chzzk-recent-emotes-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background-color: #e1e1e5;
            border: 1px solid #88898c;
            border-radius: 10px;

            flex-wrap: wrap;
            white-space: normal;
            overflow: visible;
            height: auto;
            min-height: 52px;

            box-sizing: border-box;
            width: 100%;
            z-index: 99999;
            position: relative;
            margin-bottom: 8px;
        }
        
        html.theme_dark #chzzk-recent-emotes-bar {
            background-color: #26262b;
            border: 1px solid #32323c
        }

        .my-recent-emote {
            width: 30px;
            height: 30px;
            cursor: pointer;
            border-radius: 4px;
            transition: transform 0.1s;
            flex-shrink: 0;
            margin-bottom: 4px; 
        }
        .my-recent-emote:hover {
            transform: scale(1.1);
            background-color: #3b3b42;
        }
    `);

    // UI 주입
    const observer = new MutationObserver(() => {
        const chatContainer = document.querySelector('[class*="live_chatting_input_container"]');
        if (!chatContainer || document.getElementById("chzzk-recent-emotes-bar")) return;

        const bar = document.createElement("div");
        bar.id = "chzzk-recent-emotes-bar";

        if (chatContainer.parentElement) {
            chatContainer.parentElement.insertBefore(bar, chatContainer);
        }
        renderEmotes();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("click", (e) => {
        const target = e.target;
        const emoteBtn = target.closest('button[class*="emoticon_emoticon"]');

        if (emoteBtn) {
            const img = emoteBtn.querySelector('img');
            if (img && img.src && !target.classList.contains('my-recent-emote')) {
                const code = img.alt || img.src;
                saveEmote(img.src, code);
            }
        }
    });

    function saveEmote(src, code) {
        let list = GM_getValue(STORAGE_KEY, []);

        list = list.filter(item => item.src !== src);

        list.push({ src: src, code: code });

        if (list.length > MAX_RECENT) list.shift();

        GM_setValue(STORAGE_KEY, list);
        renderEmotes();
    }

    function renderEmotes() {
        const bar = document.getElementById("chzzk-recent-emotes-bar");
        if (!bar) return;
        const list = GM_getValue(STORAGE_KEY, []);

        bar.innerHTML = "";
        if (list.length === 0) {
            bar.style.display = "none";
            return;
        }
        bar.style.display = "flex";

        list.forEach(item => {
            const img = document.createElement("img");
            img.src = item.src;
            img.className = "my-recent-emote";
            img.title = item.code;

            img.addEventListener("mousedown", (e) => e.preventDefault());

            img.addEventListener("click", (e) => {
                e.stopPropagation();
                insertToChatInput(item.code);
            });
            bar.appendChild(img);
        });
    }

    // 입력 함수
    function insertToChatInput(text) {
        const inputEl = document.querySelector('[class*="live_chatting_input_input"]');

        if (!inputEl) return;

        inputEl.focus();

        const success = document.execCommand('insertText', false, text);

        inputEl.scrollTop = inputEl.scrollHeight;
    }

})();