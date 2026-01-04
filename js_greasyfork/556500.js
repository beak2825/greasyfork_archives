// ==UserScript==
// @name              steam 網頁語言切換小工具 (zelda improved version) 
// @namespace         jasaj.me (edited by zelda & CHATGPT & GEMINI)
// @match             https://store.steampowered.com/*
// @match             https://steamcommunity.com/*
// @exclude           *store.steampowered.com/widget/*
// @version           4.1 (beta)
// @description       添加語言切換按鈕，只更改前端語言。同時讓 store + community 所有連結自動帶上 ?l=語言。
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/556500/steam%20%E7%B6%B2%E9%A0%81%E8%AA%9E%E8%A8%80%E5%88%87%E6%8F%9B%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28zelda%20improved%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556500/steam%20%E7%B6%B2%E9%A0%81%E8%AA%9E%E8%A8%80%E5%88%87%E6%8F%9B%E5%B0%8F%E5%B7%A5%E5%85%B7%20%28zelda%20improved%20version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentLangParam = null;

    /* === 美化選單用 CSS (只在需要時注入) === */
    function injectStyles() {
        if (document.getElementById('zelda-lang-styles')) return;
        const style = document.createElement("style");
        style.id = 'zelda-lang-styles';
        style.textContent = `
            .zelda-lang-btn {
                padding: 4px 10px !important; margin-left: 6px; border-radius: 6px; font-size: 13px; font-weight: 600;
                display: inline-flex; align-items: center; background: rgba(255,255,255,0.06);
                color: rgba(255,255,255,0.8) !important; transition: all 0.18s ease; cursor: pointer; user-select: none;
            }
            .zelda-lang-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }
            .zelda-lang-btn.disabled {
                background: rgba(255,255,255,0.20) !important; color: rgba(255,255,255,0.45) !important;
                cursor: not-allowed !important; transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    const LANG_MAP = [
        ["繁", "tchinese", "zh-tw"],
        ["簡", "schinese", "zh-cn"],
        ["日", "japanese", "ja"],
        ["英", "english", "en"]
    ];

    /* === 決定當前應該使用的語言參數 === */
    function determineCurrentLang() {
        const currentURL = new URL(location.href);
        const langParamFromURL = currentURL.searchParams.get("l");

        if (langParamFromURL) {
            const langConfig = LANG_MAP.find(v => v[1] === langParamFromURL);
            if (langConfig) return langConfig[1];
        }

        const htmlLang = document.documentElement.lang;
        if (htmlLang) {
            const langConfig = LANG_MAP.find(v => v[2].toLowerCase() === htmlLang.toLowerCase());
            if (langConfig) return langConfig[1];
        }

        // 預設語言
        return "tchinese";
    }

    /* === 核心修正：在滑鼠點擊時攔截並修改連結 === */
    document.addEventListener('mousedown', function(event) {
        // 如果 currentLangParam 還沒確定，就先確定一次
        if (!currentLangParam) {
            currentLangParam = determineCurrentLang();
        }

        // 找到被點擊的元素或其父層中的 <a> 標籤
        const link = event.target.closest('a');

        if (link && link.href) {
            try {
                const url = new URL(link.href);
                if (url.host === "store.steampowered.com" || url.host === "steamcommunity.com") {
                    if (url.searchParams.get('l') !== currentLangParam) {
                        url.searchParams.set('l', currentLangParam);
                        link.href = url.toString();
                    }
                }
            } catch (e) {
                // 忽略無效的 href
            }
        }
    }, true); // 使用捕獲階段(true)，確保我們的事件監聽比頁面上的其他點擊事件更早執行

    /* === 創建語言切換按鈕 (延遲到 DOM 載入後) === */
    function setupUI() {
        injectStyles();
        currentLangParam = determineCurrentLang(); // 再次確定當前語言

        const headerTarget = document.querySelector("#global_actions") || document.querySelector(".user_avatar")?.parentNode;
        if (!headerTarget || document.getElementById('zelda-lang-box')) return;

        const langBox = document.createElement("div");
        langBox.id = "zelda-lang-box";

        LANG_MAP.forEach(([label, langParam, iso]) => {
            const btn = document.createElement("div");
            btn.className = "zelda-lang-btn";
            btn.textContent = label;

            if (currentLangParam === langParam) {
                btn.classList.add("disabled");
            } else {
                btn.onclick = (e) => {
                    e.preventDefault(); // 防止觸發 mousedown 事件
                    e.stopPropagation();
                    const currentURL = new URL(location.href);
                    currentURL.searchParams.set("l", langParam);
                    location.href = currentURL.href;
                };
            }
            langBox.appendChild(btn);
        });
        headerTarget.appendChild(langBox);

        // 隱藏 Steam store 的語言提示框
        const warningBox = document.querySelector(".es_language_warning");
        if (warningBox) warningBox.style.display = "none";
    }

    // 當 DOM 結構準備好時，才開始建立 UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUI);
    } else {
        setupUI();
    }
})();
