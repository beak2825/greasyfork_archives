// ==UserScript==
// @name         Threads 強制顯示影片播放介面 ＆ 自動解除靜音
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  強制 Threads 上影片顯示控制項，並解除靜音
// @author       shanlan(ChatGPT o3-mini)
// @match        https://www.threads.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548582/Threads%20%E5%BC%B7%E5%88%B6%E9%A1%AF%E7%A4%BA%E5%BD%B1%E7%89%87%E6%92%AD%E6%94%BE%E4%BB%8B%E9%9D%A2%20%EF%BC%86%20%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/548582/Threads%20%E5%BC%B7%E5%88%B6%E9%A1%AF%E7%A4%BA%E5%BD%B1%E7%89%87%E6%92%AD%E6%94%BE%E4%BB%8B%E9%9D%A2%20%EF%BC%86%20%E8%87%AA%E5%8B%95%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3.meta.js
// ==/UserScript==

(function(){
    "use strict";

    // CSS 部分（保留不變）
    const css = `
        .vsc-hidden { display: block !important; visibility: visible !important; opacity: 1 !important; }
        vsc-controller { opacity: 1 !important; }
        div[data-visualcompletion="ignore"] { display: none !important; }
    `;
    const styleElem = document.createElement("style");
    styleElem.textContent = css;
    document.head.appendChild(styleElem);

    // 設定影片：顯示控制項，並在播放時解除靜音、設定音量設為最大
    const setup = v => {
        v.controls = true;
        v.addEventListener("play", () => {
            v.muted = false;
            v.removeAttribute("muted");
            v.volume = 1.0;
        }, { once: true });
    };

    // 處理頁面上的現有影片
    document.querySelectorAll("video").forEach(setup);

    // 監控新增的影片元素（如果新增的節點不是影片，則搜尋其內部的影片）
    new MutationObserver(ms =>
        ms.forEach(m =>
            m.addedNodes.forEach(n =>
                n.nodeType === 1 && (n.matches("video") ? setup(n) : n.querySelectorAll("video").forEach(setup))
            )
        )
    ).observe(document.body, { childList: true, subtree: true });
})();
