// ==UserScript==
// @name         批量提取网页/文本链接内容 (Excel分列版)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Telegram中文频道表格行提取 + 普通<a>链接提取 + 多段文本批量提取，可直接复制到Excel分列
// @author       云空陆
// @match        *://*/*
// @license MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/553076/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%20%28Excel%E5%88%86%E5%88%97%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553076/%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%20%28Excel%E5%88%86%E5%88%97%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seen = new Set();

    function getAllText(el){
        if(!el) return '';
        return el.innerText.replace(/\s+/g,' ').trim();
    }

    function parseHTMLString(html){
        const parser = new DOMParser();
        return parser.parseFromString(html, 'text/html');
    }

    // ---------- 提取表格 ----------
    function extractTableRows(root){
        const results = [];
        root.querySelectorAll('tbody').forEach(tbody => {
            tbody.querySelectorAll('tr').forEach(tr => {
                const tds = Array.from(tr.querySelectorAll('td'));
                if(tds.length === 0) return;

                let rowTexts = [];
                let link = '';

                tds.forEach(td => {
                    const a = td.querySelector('a');
                    if(a && !link) link = a.href.trim();
                    rowTexts.push(getAllText(td));
                });

                if(!link) return;

                const line = [link, ...rowTexts].join('\t'); // Excel分列
                if(!seen.has(line)){
                    results.push(line);
                    seen.add(line);
                }
            });
        });
        return results;
    }

    // ---------- 提取普通链接 ----------
    function extractNormalLinks(root){
        const results = [];
        root.querySelectorAll('a').forEach(a => {
            if(a.closest('tbody')) return; // 表格内已提取
            const href = a.href?.trim();
            if(!href) return;

            const parts = [];

            let prev = a.previousSibling;
            let firstTitleAdded = false;
            while(prev){
                if(prev.nodeType === Node.TEXT_NODE){
                    const txt = prev.textContent.trim();
                    if(txt && !firstTitleAdded){
                        parts.push(txt);
                        firstTitleAdded = true;
                    }
                } else if(prev.nodeType === Node.ELEMENT_NODE){
                    const txt = getAllText(prev);
                    if(txt && !firstTitleAdded){
                        parts.push(txt);
                        firstTitleAdded = true;
                    }
                }
                prev = prev.previousSibling;
            }

            const aText = getAllText(a);
            if(!firstTitleAdded && aText){
                parts.push(aText);
                firstTitleAdded = true;
            } else if(aText){
                parts.push(aText);
            }

            let next = a.nextSibling;
            while(next){
                if(next.nodeType === Node.TEXT_NODE){
                    const txt = next.textContent.trim();
                    if(txt) parts.push(txt);
                } else if(next.nodeType === Node.ELEMENT_NODE){
                    const txt = getAllText(next);
                    if(txt) parts.push(txt);
                }
                next = next.nextSibling;
            }

            const line = [href, ...parts].join('\t'); // Excel分列
            if(!seen.has(line)){
                results.push(line);
                seen.add(line);
            }
        });
        return results;
    }

    // ---------- 弹窗显示 ----------
    function showPanel(results){
        if(results.length === 0){
            alert('未找到符合条件的链接');
            return;
        }

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.width = '850px';
        panel.style.height = '500px';
        panel.style.background = 'rgba(255,255,255,0.95)';
        panel.style.border = '1px solid #333';
        panel.style.borderRadius = '6px';
        panel.style.zIndex = 99999;
        panel.style.overflowY = 'auto';
        panel.style.padding = '10px';
        panel.style.fontSize = '13px';
        panel.style.color = '#000';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.whiteSpace = 'pre-wrap';
        panel.style.wordBreak = 'break-all';

        const closeBtn = document.createElement('button');
        closeBtn.innerText = '关闭';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '5px';
        closeBtn.onclick = () => panel.remove();
        panel.appendChild(closeBtn);

        const copyBtn = document.createElement('button');
        copyBtn.innerText = '复制全部';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '5px';
        copyBtn.style.right = '70px';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(results.join('\n'))
                .then(()=> alert('已复制到剪贴板'))
                .catch(()=> alert('复制失败'));
        };
        panel.appendChild(copyBtn);

        const content = document.createElement('pre');
        content.innerText = results.join('\n');
        content.style.marginTop = '40px';
        panel.appendChild(content);

        document.body.appendChild(panel);
    }

    // ---------- 网页内容提取 ----------
    GM_registerMenuCommand('提取网页链接内容', () => {
        seen.clear();
        const tableResults = extractTableRows(document);
        const normalResults = extractNormalLinks(document);
        showPanel(tableResults.concat(normalResults));
    });

    // ---------- 输入文本/源码提取 ----------
    GM_registerMenuCommand('输入文本/源码提取链接', () => {
        seen.clear();
        const text = prompt('请粘贴完整文本或HTML源码进行提取（可多段）:', '');
        if(!text) return;

        const wrapperHTML = `<div>${text}</div>`;
        const doc = parseHTMLString(wrapperHTML);

        const tableResults = extractTableRows(doc);
        const normalResults = extractNormalLinks(doc);
        showPanel(tableResults.concat(normalResults));
    });

})();
