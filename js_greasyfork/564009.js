// ==UserScript==
// @name         番号标记+搜索按钮 + HD中文字幕高亮（更强健版）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  更稳健地识别番号并添加搜索按钮；仅高亮表格行中同时含HD与中文字幕的行（不破坏DOM）
// @author       Jhih He
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564009/%E7%95%AA%E5%8F%B7%E6%A0%87%E8%AE%B0%2B%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%20%2B%20HD%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%E9%AB%98%E4%BA%AE%EF%BC%88%E6%9B%B4%E5%BC%BA%E5%81%A5%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564009/%E7%95%AA%E5%8F%B7%E6%A0%87%E8%AE%B0%2B%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE%20%2B%20HD%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95%E9%AB%98%E4%BA%AE%EF%BC%88%E6%9B%B4%E5%BC%BA%E5%81%A5%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 更宽松：允许大小写、比如 [SSIS-924]、ssIs-924 等
    const codeRegex = /([A-Za-z]{2,8}-\d{2,6})/gi;
    const searchBase = "https://sukebei.nyaa.si/?f=0&c=0_0&q=";

    // 禁止深入修改的标签（我们不会在这些内部替换文本）
    const FORBIDDEN_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','CODE','PRE']);

    // 检查在给定容器（或其附近）是否已存在对应的搜索按钮
    function hasExistingSearchNearby(node, match) {
        if (!node) return false;
        // 搜索当前元素、其父元素以及父的父元素中是否存在 data-added-search 对应链接
        let p = node;
        for (let i=0; i<4 && p; i++) {
            if (p.querySelector) {
                const anchors = p.querySelectorAll('a[data-added-search="1"]');
                for (const a of anchors) {
                    if (a.href && a.href.indexOf(searchBase + encodeURIComponent(match)) !== -1) return true;
                }
            }
            p = p.parentNode;
        }
        return false;
    }

    // 如果文本节点位于一个 <a> 标签内部，返回该最近的 <a> 元素；否则返回 null
    function nearestAnchorAncestor(node) {
        let p = node.parentNode;
        while (p && p.nodeType === 1) {
            if (p.tagName === 'A') return p;
            p = p.parentNode;
        }
        return null;
    }

    // 在目标元素之后插入一个搜索锚点（避免插入到 <a> 内部）
    function insertSearchAfterElement(el, match) {
        if (!el || hasExistingSearchNearby(el, match)) return;
        const a = document.createElement('a');
        a.textContent = ' 🔍';
        a.href = `${searchBase}${encodeURIComponent(match)}`;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.marginLeft = '5px';
        a.style.color = '#0077cc';
        a.style.textDecoration = 'none';
        a.setAttribute('data-added-search', '1');

        // Insert after element
        if (el.nextSibling) el.parentNode.insertBefore(a, el.nextSibling);
        else el.parentNode.appendChild(a);
    }

    // 在文本节点内部安全地替换并插入按钮（当文本不在 <a> 内部时）
    function replaceTextNodeWithButtons(textNode) {
        const text = textNode.nodeValue;
        if (!text) return;
        let m;
        codeRegex.lastIndex = 0;
        if (!codeRegex.test(text)) {
            codeRegex.lastIndex = 0;
            return;
        }
        codeRegex.lastIndex = 0;

        const parent = textNode.parentNode;
        // 如果父节点是禁止标签，直接返回
        if (!parent || FORBIDDEN_TAGS.has(parent.tagName)) return;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        while ((m = codeRegex.exec(text)) !== null) {
            const match = m[1];
            const offset = m.index;

            // 追加中间普通文本
            if (offset > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
            }

            // 如果在父节点/附近已经有该按钮，则只插入番号文本
            if (hasExistingSearchNearby(parent, match)) {
                frag.appendChild(document.createTextNode(match));
            } else {
                // 插入番号文本（保留原样）
                const span = document.createElement('span');
                span.textContent = match;
                frag.appendChild(span);

                // 插入搜索链接
                const a = document.createElement('a');
                a.textContent = ' 🔍';
                a.href = `${searchBase}${encodeURIComponent(match)}`;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.marginLeft = '5px';
                a.style.color = '#0077cc';
                a.style.textDecoration = 'none';
                a.setAttribute('data-added-search', '1');
                frag.appendChild(a);
            }

            lastIndex = offset + match.length;
        }
        // 剩余文本
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // 用构造的片段替换原文本节点（不会破坏其它子元素）
        parent.replaceChild(frag, textNode);
    }

    // 主处理函数：扫描文本节点但对在 <a> 内的文本采用不同处理
    function walkAndAddButtons(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let n;
        while ((n = walker.nextNode())) nodes.push(n);

        for (const node of nodes) {
            if (!node.nodeValue) continue;
            // 快速跳过只包含空白或很短的节点
            if (!/[A-Za-z]{2,}-\d/.test(node.nodeValue)) continue;

            // 如果该文本节点位于 <a> 内部，直接在该 <a> 元素后插入按钮（不修改 a 内部）
            const aAncestor = nearestAnchorAncestor(node);
            if (aAncestor) {
                // 在 a 后插入搜索按钮，针对该 a 内的所有匹配（避免重复插入）
                let m;
                codeRegex.lastIndex = 0;
                const seen = new Set();
                while ((m = codeRegex.exec(aAncestor.innerText || '')) !== null) {
                    const match = m[1];
                    if (seen.has(match)) continue;
                    seen.add(match);
                    if (!hasExistingSearchNearby(aAncestor, match)) {
                        insertSearchAfterElement(aAncestor, match);
                    }
                }
                codeRegex.lastIndex = 0;
                continue;
            }

            // 否则安全替换文本节点（文本不在 <a> 中）
            replaceTextNodeWithButtons(node);
        }
    }

    // 仅高亮 table 的行（tr），避免全页染色
    function highlightRows() {
        const rows = document.querySelectorAll('tr');
        rows.forEach(tr => {
            const text = (tr.innerText || '').replace(/\s+/g, ' ');
            if (/HD/i.test(text) && /(中文|中文字幕|中字)/.test(text)) {
                tr.style.backgroundColor = "rgba(255, 255, 150, 0.6)";
                tr.style.borderRadius = "4px";
            } else {
                if (tr.style.backgroundColor) tr.style.backgroundColor = "";
                if (tr.style.borderRadius) tr.style.borderRadius = "";
            }
        });
    }

    // 初次运行（稍微延迟一下以兼容部分慢渲染页面）
    function initialRun() {
        try {
            walkAndAddButtons(document.body);
            highlightRows();
        } catch (e) {
            console.error('脚本运行异常：', e);
        }
    }
    setTimeout(initialRun, 600); // 延迟 600ms 再运行一次

    // 动态监听新增节点
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                try {
                    walkAndAddButtons(node);
                } catch (e) {
                    console.error('处理新增节点出错：', e);
                }
            }
        }
        // 每次变更后也更新高亮
        highlightRows();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 加载完成时再跑一次（保险）
    window.addEventListener('load', () => {
        setTimeout(() => {
            walkAndAddButtons(document.body);
            highlightRows();
        }, 300);
    });

})();
