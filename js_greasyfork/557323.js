// ==UserScript==
// @name         あいもげレインボーちゃん
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自分の投稿本文だけ虹色（引用とHTML行除外）で強調、3種類切替可
// @match        https://nijiurachan.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557323/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%AC%E3%82%A4%E3%83%B3%E3%83%9C%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557323/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%AC%E3%82%A4%E3%83%B3%E3%83%9C%E3%83%BC%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
'use strict';

/* CSS */
const style = document.createElement("style");
style.textContent = `
@keyframes rainbowText { 0%{color:red;}20%{color:orange;}40%{color:yellow;}60%{color:green;}80%{color:blue;}100%{color:violet;} }
.myPostTextNormal { animation: rainbowText 2s infinite; font-weight: bold; }

.myPostTextGorgeous {
    font-weight: bold;
    background: linear-gradient(90deg, red, orange, yellow, green, blue, violet, red);
    background-size: 600% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbowShift 3s linear infinite;
}

.myPostTextSuperGorgeous {
    font-weight: bold;
    background: linear-gradient(135deg, red, orange, yellow, green, cyan, blue, violet, magenta, red);
    background-size: 800% 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rainbowShift 3.5s linear infinite;
}

@keyframes rainbowShift { 0% { background-position: 0% 0%; } 100% { background-position: 100% 0%; } }

.rainbow-processed { } /* 2度処理防止用 */

`;
document.head.appendChild(style);


// 設定ロード
let currentStyle = GM_getValue('myPostRainbowStyle', 'myPostTextNormal');


// 与えられた blockquote の中身を安全に虹色化する
function processBlockquote(blockquote, className) {

    // すでに処理済みの blockquote は無視
    if (blockquote.dataset.rainbowDone) return;
    blockquote.dataset.rainbowDone = "1";

    const newFrag = document.createDocumentFragment();

    // blockquote の内容を「テキストとしての行」に再構成する
    const text = blockquote.innerHTML.replace(/<br\s*\/?>/gi, "\n");
    const lines = text.split("\n");

    lines.forEach((line, i) => {

        const trimmed = line.trim();

        // 空行 or 引用行はそのまま
        const isQuote = trimmed.startsWith(">");

        // HTMLタグ含む行（例：dice行）もそのまま
        const hasHTML = /<[^>]+>/.test(line);

        if (!isQuote && !hasHTML && trimmed !== "") {
            // 純粋テキスト行 → 虹色適用
            const span = document.createElement("span");
            span.className = className + " rainbow-processed";
            span.textContent = line;
            newFrag.appendChild(span);

        } else {
            // 引用 or HTML行 → 生HTMLで復元
            const wrapper = document.createElement("span");
            wrapper.innerHTML = line;
            newFrag.appendChild(wrapper);
        }

        if (i < lines.length - 1) {
            newFrag.appendChild(document.createElement("br"));
        }
    });

    // blockquote を置き換え
    blockquote.innerHTML = "";
    blockquote.appendChild(newFrag);
}


// 自分の投稿だけ処理
function highlightMyPosts(className) {
    const posts = document.querySelectorAll("table.my-post blockquote");
    posts.forEach(blockquote => {
        processBlockquote(blockquote, className);
    });
}


// 初回実行
highlightMyPosts(currentStyle);


// スレ移動 / 新レス にも対応
let lastURL = location.href;
const observer = new MutationObserver(() => {
    if (location.href !== lastURL) {
        lastURL = location.href;
        // URLが変わったら全部リセットして再処理
        document.querySelectorAll("table.my-post blockquote").forEach(b => {
            b.removeAttribute("data-rainbow-done");
        });
    }
    highlightMyPosts(currentStyle);
});

observer.observe(document.body, { childList: true, subtree: true });


// メニュー操作
function setRainbowStyle(styleClass, label) {
    currentStyle = styleClass;
    GM_setValue('myPostRainbowStyle', currentStyle);

    // 再処理のためリセット
    document.querySelectorAll("table.my-post blockquote").forEach(b => {
        b.removeAttribute("data-rainbow-done");
    });

    highlightMyPosts(currentStyle);
    alert("虹色スタイルを「" + label + "」に変更しました。");
}

GM_registerMenuCommand("虹色: ノーマル", () => setRainbowStyle("myPostTextNormal", "ノーマル"));
GM_registerMenuCommand("虹色: ゴージャス", () => setRainbowStyle("myPostTextGorgeous", "ゴージャス"));
GM_registerMenuCommand("虹色: スーパーゴージャス", () => setRainbowStyle("myPostTextSuperGorgeous", "スーパーゴージャス"));

})();
