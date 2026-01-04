// ==UserScript==
// @name         coolenglish-英文-外掛-浮動朗讀按鈕
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  coolenglish-選取文字後，按浮動按鈕朗讀
// @author       issac
// @match        *://*/*
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551639/coolenglish-%E8%8B%B1%E6%96%87-%E5%A4%96%E6%8E%9B-%E6%B5%AE%E5%8B%95%E6%9C%97%E8%AE%80%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551639/coolenglish-%E8%8B%B1%E6%96%87-%E5%A4%96%E6%8E%9B-%E6%B5%AE%E5%8B%95%E6%9C%97%E8%AE%80%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedText = "";

    // 建立浮動按鈕
    const readBtn = document.createElement('button');
    readBtn.textContent = "📢 朗讀";
    Object.assign(readBtn.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 99999,
        padding: "10px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "none"
    });
    document.body.appendChild(readBtn);

    // 點擊朗讀按鈕
    readBtn.addEventListener('click', () => {
        if (selectedText) {
            const utterance = new SpeechSynthesisUtterance(selectedText);
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
        }
    });

    // 監聽文字選取
    document.addEventListener('selectionchange', () => {
        const text = window.getSelection().toString().trim();
        if (text) {
            selectedText = text;
            readBtn.style.display = "block";
        } else {
            selectedText = "";
            readBtn.style.display = "none";
        }
    });

})();
