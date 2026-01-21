// ==UserScript==
// @name         KoGaMa Chat Translator
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Automatically translates your friend's chat messages into your selected language (saved per chat).
// @match        *://*.kogama.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @license      unlicense
// @author       Haden
// @downloadURL https://update.greasyfork.org/scripts/563386/KoGaMa%20Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/563386/KoGaMa%20Chat%20Translator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let userLang = "off";
    let lastChatUser = null;


    function findChatContainer() {
        return document.querySelector("._2XaOw") ||
               document.querySelector("[style*='overflow-y']");
    }

    function getChatUser() {
        const el = document.querySelector("._2XzvN");
        return el ? el.textContent.trim() : null;
    }

    function isOwnMessage(node) {
        if (node.classList?.contains("_1Xzzq")) return true;
        const s = getComputedStyle(node);
        return s.justifyContent === "flex-end" || s.textAlign === "right";
    }

    function getMessageParagraph(node) {
        return node instanceof HTMLElement ? node.querySelector("p") : null;
    }


    function getLangMap() {
        return JSON.parse(localStorage.getItem("chatLangByUser") || "{}");
    }

    function getCurrentLang() {
        const user = getChatUser();
        if (!user) return "off";
        return getLangMap()[user] || "off";
    }

    function setCurrentLang(lang) {
        const user = getChatUser();
        if (!user) return;
        const map = getLangMap();
        map[user] = lang;
        localStorage.setItem("chatLangByUser", JSON.stringify(map));
    }


    function createHeaderLangSelector() {
        const header = document.querySelector(".F3PyX");
        if (!header) return;

        if (!header.querySelector("#tm-lang-btn")) {
            header.style.display = "flex";
            header.style.alignItems = "center";
            header.style.gap = "6px";

            const btn = document.createElement("button");
            btn.id = "tm-lang-btn";
            btn.textContent = "🌐";
            btn.title = "Chat language";
            btn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 16px;
                padding: 2px;
                opacity: 0.85;
            `;

            const select = document.createElement("select");
            select.id = "tm-lang-select";
            select.style.cssText = `
                font-size: 12px;
                padding: 2px 4px;
                border-radius: 4px;
                margin-right: 6px;
                display: none;
            `;

            const langs = {
                off: "🚫 No translate",
                es: "🇪🇸 Español",
                en: "🇬🇧 English",
                fr: "🇫🇷 Français",
                pt: "🇵🇹 Português",
                de: "🇩🇪 Deutsch",
                it: "🇮🇹 Italiano",
                ru: "🇷🇺 Русский",
                pl: "🇵🇱 Polski",
                tr: "🇹🇷 Türkçe",
                nl: "🇳🇱 Nederlands",
                sv: "🇸🇪 Svenska",
                cs: "🇨🇿 Čeština",
                sk: "🇸🇰 Slovenčina",
                ro: "🇷🇴 Română",
                ar: "🇸🇦 العربية",
                ja: "🇯🇵 日本語",
                ko: "🇰🇷 한국어",
                zh: "🇨🇳 中文"
            };

            for (const code in langs) {
                const opt = document.createElement("option");
                opt.value = code;
                opt.textContent = langs[code];
                select.appendChild(opt);
            }

            select.onchange = () => {
                userLang = select.value;
                setCurrentLang(userLang);
                updateAllMessages();
            };

            btn.onclick = () => {
                select.style.display =
                    select.style.display === "none" ? "inline-block" : "none";
            };

            const closeBtn = header.querySelector("button[aria-label='close']");
            header.insertBefore(btn, closeBtn);
            header.insertBefore(select, closeBtn);
        }

        const select = document.getElementById("tm-lang-select");
        if (select && select.value !== userLang) {
            select.value = userLang;
        }
    }


    function translate(text, lang, cb) {
        const url =
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload: r => {
                try {
                    const d = JSON.parse(r.responseText);
                    cb(d[0].map(x => x[0]).join(""), d[2]);
                } catch {}
            }
        });
    }

    function processMessage(node) {
        const p = getMessageParagraph(node);
        if (!p || isOwnMessage(node)) return;

        if (!node.dataset.originalText) {
            node.dataset.originalText = p.innerText;
        }

        if (userLang === "off") {
            p.innerText = node.dataset.originalText;
            node.dataset.translated = "";
            return;
        }

        if (node.dataset.translated === userLang) return;

        translate(node.dataset.originalText, userLang, (t, detected) => {
            if (detected === userLang) return;
            p.innerText = t;
            node.dataset.translated = userLang;
        });
    }

    function updateAllMessages() {
        const c = findChatContainer();
        if (!c) return;
        c.querySelectorAll("div").forEach(processMessage);
    }

    function observeMessages() {
        const c = findChatContainer();
        if (!c || c._observer) return;

        const o = new MutationObserver(m =>
            m.forEach(x => x.addedNodes.forEach(processMessage))
        );
        o.observe(c, { childList: true, subtree: true });
        c._observer = o;
    }


    setInterval(() => {
        const chatUser = getChatUser();
        if (chatUser && chatUser !== lastChatUser) {
            lastChatUser = chatUser;
            userLang = getCurrentLang();
            updateAllMessages();
        }

        createHeaderLangSelector();
        observeMessages();
    }, 1000);

})();
