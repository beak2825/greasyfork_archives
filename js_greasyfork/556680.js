// ==UserScript==
// @name         MineFun Chat Translator (Vietnamese)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script tự động dịch tất cả tin nhắn chat trong MineFun sang tiếng Việt
// @author       THIEN
// @match        https://minefun.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minefun.io
// @run-at       document-start
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556680/MineFun%20Chat%20Translator%20%28Vietnamese%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556680/MineFun%20Chat%20Translator%20%28Vietnamese%29.meta.js
// ==/UserScript==

// Lấy data attribute cho message
let messageDataAttribute;
document.addEventListener('DOMContentLoaded', async () => {
    const messageDataInterval = setInterval(() => {
        try {
            let css = [...document.styleSheets].find(x => x?.href && x?.href.includes('assets/Game-'));
            if (!css) return;

            let match = [...css.cssRules].find(x => x?.selectorText && x?.selectorText.includes('.messages[data-v-'))?.selectorText;
            if (!match) return;

            messageDataAttribute = match.slice(10, -1);
            clearInterval(messageDataInterval);
        } catch {}
    }, 250);
});

// Hook setAttribute trên div để bắt message
const _createElement = document.createElement;
document.createElement = function createElement() {
    const el = _createElement.apply(this, arguments);
    if (el.tagName !== 'DIV') return el;

    const _setAttribute = el.setAttribute;
    el.setAttribute = function setAttribute() {
        if (messageDataAttribute && arguments[0] === messageDataAttribute) handleMessage(this);
        return _setAttribute.apply(this, arguments);
    }

    return el;
}

// Xử lý dịch message
function handleMessage(el) {
    if (!el || el?.children?.length !== 2) return;
    const userEl = el.children[0];
    const textEl = el.children[1];

    if (!textEl.innerText) return;
    console.log(`Đang dịch tin nhắn: "${textEl.innerText}"`);

    translateMessage(textEl.innerText).then(translated => {
        if (!textEl?.innerText) return;
        textEl.innerText = `[${translated[0]}]: ${translated[1]}`;
    }).catch(err => {
        console.warn('Lỗi dịch...', err);
    });
}

// Cache để tránh dịch trùng
const messageCache = {};

// Gọi Google Translate API để dịch sang tiếng Việt
async function translateMessage(text) {
    if (messageCache[text]) return messageCache[text];

    const res = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=" + encodeURIComponent(text));
    const data = await res.json();
    const result = [data[2], data[0].map(x => x[0]).join('')];
    messageCache[text] = result;

    return result;
}