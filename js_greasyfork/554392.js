// ==UserScript==
// @name         百度网盘剪贴板提取
// @version      1.5
// @description  读取剪贴板内容，提取百度网盘链接和四位提取码（从后往前匹配）
// @license      MIT
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @run-at       document-end
// @namespace tousakarin
// @downloadURL https://update.greasyfork.org/scripts/554392/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554392/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // 提取链接和四位提取码（从后往前匹配）
    function extractPanLinks(text) {
        const linkRegex = /(https?:\/\/pan\.baidu\.com\/s\/[A-Za-z0-9_-]{5,})/gi;
        const codeRegex = /\b([A-Za-z0-9]{4})\b/g; // 四位码，全局匹配

        // 获取所有链接
        const links = [];
        let m;
        while ((m = linkRegex.exec(text)) !== null) {
            links.push({url: m[1], code: null});
        }

        // 获取所有四位提取码
        const codes = [];
        while ((m = codeRegex.exec(text)) !== null) {
            codes.push(m[1]);
        }

        // 从后往前匹配链接与提取码
        const results = [];
        let codeIndex = codes.length - 1;
        for (let i = links.length - 1; i >= 0; i--) {
            const l = links[i];
            if (/[?&]pwd=/i.test(l.url)) {
                results[i] = {url: l.url, code: null};
            } else {
                results[i] = {url: l.url, code: codes[codeIndex] || null};
                codeIndex = Math.max(codeIndex - 1, -1);
            }
        }

        return results;
    }

    // 生成完整链接
    function makeFullLink(url, code) {
        if (/[?&]pwd=/i.test(url)) return url;
        if (!code) return url;
        return url + (url.includes('?') ? '&' : '?') + 'pwd=' + encodeURIComponent(code);
    }

    // 显示面板
    function showPanel(items) {
        if (!items.length) {
            GM_notification("剪贴板没有找到百度网盘链接。");
            return;
        }

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.right = '14px';
        panel.style.bottom = '14px';
        panel.style.width = '360px';
        panel.style.maxHeight = '50vh';
        panel.style.overflow = 'auto';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ddd';
        panel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
        panel.style.borderRadius = '8px';
        panel.style.fontSize = '13px';
        panel.style.zIndex = 99999;
        panel.style.padding = '10px';
        panel.id = 'pan-clipboard-panel';
        panel.innerHTML = `<h4>检测到百度网盘分享</h4><div style="position:absolute;right:8px;top:6px;cursor:pointer;color:#888;font-weight:bold;" id="pan-close">×</div>`;
        panel.querySelector('#pan-close').onclick = () => panel.remove();

        items.forEach(it => {
            const full = makeFullLink(it.url, it.code);
            const div = document.createElement('div');
            div.style.padding = '6px';
            div.style.borderRadius = '6px';
            div.style.marginBottom = '8px';
            div.style.background = '#fafafa';
            div.style.border = '1px solid #f0f0f0';
            div.innerHTML = `
                <a href="${full}" target="_blank" style="word-break:break-all;display:inline-block;max-width:100%;">${full}</a>
                <div style="margin-top:6px;">原始链接: ${it.url} | 提取码: ${it.code||'无'}</div>
                <div style="margin-top:6px;">
                    <button class="copy-btn">复制链接</button>
                    <button class="open-btn">打开</button>
                </div>
            `;
            div.querySelector('.copy-btn').onclick = () => {
                GM_setClipboard(full);
                div.querySelector('.copy-btn').textContent = '已复制';
                setTimeout(()=>div.querySelector('.copy-btn').textContent='复制链接',1200);
            };
            div.querySelector('.open-btn').onclick = () => window.open(full,'_blank');
            panel.appendChild(div);
        });

        const allBtn = document.createElement('button');
        allBtn.textContent='复制全部链接';
        allBtn.style.marginTop='6px';
        allBtn.onclick = ()=>{
            const txt = items.map(it=>makeFullLink(it.url,it.code)).join('\n');
            GM_setClipboard(txt);
            allBtn.textContent='已复制';
            setTimeout(()=>allBtn.textContent='复制全部链接',1200);
        };
        panel.appendChild(allBtn);
        document.body.appendChild(panel);
    }

    // 创建按钮
    const btn = document.createElement('button');
    btn.textContent='从剪贴板读取百度网盘链接';
    btn.style.position='fixed';
    btn.style.right='14px';
    btn.style.bottom='14px';
    btn.style.zIndex=99999;
    btn.style.padding='6px 12px';
    btn.style.borderRadius='6px';
    btn.style.border='1px solid #888';
    btn.style.background='#fff';
    btn.style.cursor='pointer';
    btn.onclick=async ()=>{
        try{
            const clipboardText = await navigator.clipboard.readText();
            const items = extractPanLinks(clipboardText);
            showPanel(items);
        }catch(e){
            console.error("读取剪贴板失败:",e);
            GM_notification("无法读取剪贴板内容，请允许网页访问剪贴板。");
        }
    };
    document.body.appendChild(btn);

})();
