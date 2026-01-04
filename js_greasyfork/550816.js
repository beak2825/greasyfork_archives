// ==UserScript==
// @name         网页内容搜索增强
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Ctrl+F 呼出自定义搜索面板，支持上下键导航，Esc 关闭，搜索框固定顶部，自动监听新内容并保持当前位置
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550816/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550816/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建侧边栏
    const panel = document.createElement("div");
    panel.style.cssText = `
        position: fixed; top: 0; right: 0; width: 340px; height: 100%;
        background: #f9f9f9; border-left: 1px solid #ccc; overflow-y: auto;
        z-index: 2147483647; font-size: 14px; padding: 10px;
        display: none; box-sizing: border-box;
    `;
    panel.innerHTML = `
        <input id="searchBox" type="text" placeholder="输入关键词..."
               style="width:100%;padding:6px 8px;box-sizing:border-box;
                      border:1px solid #ccc;border-radius:4px;
                      position:sticky; top:0; background:#f9f9f9; z-index:1;">
        <div id="count" style="margin:6px 0;color:#333;font-weight:bold;"></div>
        <div id="results"></div>
        <style>
            .__wl-item { cursor:pointer; margin:6px 0; padding:4px 6px; border-radius:4px; }
            .__wl-item.__active { background:#e6f0ff; outline:1px solid #99c2ff; }
            .__wl-item b { color:red; }
        </style>
    `;
    document.body.appendChild(panel);

    const searchBox = panel.querySelector("#searchBox");
    const resultsDiv = panel.querySelector("#results");
    const countDiv = panel.querySelector("#count");

    let matches = [];
    let items = [];
    let currentIndex = -1;

    // 搜索并渲染结果
    function search(keyword) {
        resultsDiv.innerHTML = "";
        countDiv.textContent = "";
        matches = [];
        items = [];

        if (!keyword) {
            currentIndex = -1;
            return;
        }

        const regex = new RegExp(`(.{0,20})(${keyword})(.{0,20})`, "gi");
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

        let node, index = 0;
        while (node = walker.nextNode()) {
            if (panel.contains(node.parentNode)) continue; // 跳过侧边栏自身
            const text = node.textContent;
            let match;
            while ((match = regex.exec(text)) !== null) {
                index++;
                const matchObj = {
                    node,
                    start: match.index + match[1].length,
                    end: match.index + match[1].length + match[2].length,
                    context: match
                };
                matches.push(matchObj);

                const item = document.createElement("div");
                item.className = "__wl-item";
                item.dataset.index = String(index - 1);

                const beforeSpan = document.createElement("span");
                beforeSpan.textContent = match[1];
                const keywordSpan = document.createElement("b");
                keywordSpan.textContent = match[2];
                const afterSpan = document.createElement("span");
                afterSpan.textContent = match[3];

                item.append(`${index}. ...`);
                item.appendChild(beforeSpan);
                item.appendChild(keywordSpan);
                item.appendChild(afterSpan);
                item.append("...");

                item.onclick = (() => {
                    const m = matchObj;
                    return () => locateMatch(m, item);
                })();

                resultsDiv.appendChild(item);
                items.push(item);
            }
        }

        countDiv.textContent = `共找到 ${index} 个结果`;

        // 保持当前位置
        if (items.length > 0) {
            let restoreIndex = currentIndex;
            if (restoreIndex < 0) restoreIndex = 0;
            if (restoreIndex >= items.length) restoreIndex = items.length - 1;
            setActiveIndex(restoreIndex, false); // false 表示只高亮，不强制滚动定位
        } else {
            currentIndex = -1;
        }
    }

    // 用 Selection 高亮并滚动定位
    function locateMatch(m, itemEl) {
        const range = document.createRange();
        range.setStart(m.node, m.start);
        range.setEnd(m.node, m.end);

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        const rect = range.getBoundingClientRect();
        window.scrollTo({
            top: window.scrollY + rect.top - window.innerHeight / 2,
            behavior: "smooth"
        });

        const idx = Number(itemEl.dataset.index || -1);
        if (idx >= 0) setActiveIndex(idx, false);
    }

    function setActiveIndex(idx, optionallyLocate = true) {
        if (items.length === 0) return;
        if (idx < 0) idx = 0;
        if (idx >= items.length) idx = items.length - 1;

        if (currentIndex >= 0 && items[currentIndex]) {
            items[currentIndex].classList.remove("__active");
        }
        currentIndex = idx;
        const itemEl = items[currentIndex];
        itemEl.classList.add("__active");
        itemEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

        if (optionallyLocate) {
            const m = matches[currentIndex];
            locateMatch(m, itemEl);
        }
    }

    function debounce(fn, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }
    searchBox.addEventListener("input", debounce(e => {
        search(e.target.value.trim());
    }, 250));

    function togglePanel(show) {
        if (show === undefined) {
            panel.style.display = (panel.style.display === "none") ? "block" : "none";
        } else {
            panel.style.display = show ? "block" : "none";
        }
        if (panel.style.display === "block") {
            setTimeout(() => searchBox.focus(), 50);
        } else {
            window.getSelection().removeAllRanges();
        }
    }

    // 全局快捷键
    document.addEventListener("keydown", e => {
        const active = document.activeElement;
        const isInput = active && (
            active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.isContentEditable
        );

        // 焦点在搜索框时，Esc 仍然能关闭；上下键也能切换
        if (isInput && panel.contains(active)) {
            if (e.key === "Escape" && panel.style.display === "block") {
                togglePanel(false);
                e.preventDefault();
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (items.length > 0) setActiveIndex(currentIndex + 1, true);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (items.length > 0) setActiveIndex(currentIndex - 1, true);
            }
            return;
        }

        // Ctrl+F 打开/关闭（覆盖浏览器默认）
        if (e.ctrlKey && e.key.toLowerCase() === "f") {
            e.preventDefault();
            togglePanel();
        }

        // Esc 关闭
        if (e.key === "Escape" && panel.style.display === "block") {
            togglePanel(false);
        }

        // 上下键全局拦截（点击结果后也能用）
        if (panel.style.display === "block") {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (items.length > 0) setActiveIndex(currentIndex + 1, true);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (items.length > 0) setActiveIndex(currentIndex - 1, true);
            }
        }
    }, true);

    // 监听网页内容变化，自动更新搜索结果（忽略侧边栏自身，防止死循环）
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => panel.contains(m.target))) return; // 忽略侧边栏
        const keyword = searchBox.value.trim();
        if (keyword) {
            clearTimeout(observer.timer);
            observer.timer = setTimeout(() => search(keyword), 300); // 防抖
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
