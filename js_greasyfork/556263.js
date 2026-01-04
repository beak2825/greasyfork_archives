// ==UserScript==
// @name         Emby 番号过滤查重助手 (全能版 - JavDB & JavBus)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  读取 Emby 本地库，标记所有番号，智能识别 JavDB (列表/网格/详情) 和 JavBus 上的番号。
// @author       肥肥轻肥
// @license      MIT
// @match        *://javdb.com/*
// @match        *://www.javbus.com/*
// @match        *://*/web/index.html
// @match        *://*/web/
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556263/Emby%20%E7%95%AA%E5%8F%B7%E8%BF%87%E6%BB%A4%E6%9F%A5%E9%87%8D%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E8%83%BD%E7%89%88%20-%20JavDB%20%20JavBus%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556263/Emby%20%E7%95%AA%E5%8F%B7%E8%BF%87%E6%BB%A4%E6%9F%A5%E9%87%8D%E5%8A%A9%E6%89%8B%20%28%E5%85%A8%E8%83%BD%E7%89%88%20-%20JavDB%20%20JavBus%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 (请修改这里) =================
    const CONFIG = {
        // 你的 Emby 服务器地址，不要带最后的斜杠
        embyUrl: "http://192.168.1.xx:8096",

        // 你的 Emby API Key
        apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",

        // 缓存时间（毫秒），默认 1 小时
        cacheTime: 60 * 60 * 1000
    };
    // =======================================================

    GM_addStyle(`
        .emby-exist-tag {
            display: inline-flex;
            align-items: center;
            background-color: #28a745; /* 绿色背景 */
            color: white;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: normal;
            margin-left: 4px;
            vertical-align: text-bottom;
            line-height: 1.2;
            cursor: default;
            white-space: nowrap;
            z-index: 10;
        }
        /* 针对 JavDB 原生列表模式 (.video-title) 的微调 */
        .video-title .emby-exist-tag {
            font-size: 12px;
            margin-right: 5px; /* 放在标题文字前面一点 */
        }
    `);

    // 匹配番号的正则
    const ID_REGEX = /[A-Z]{2,5}-?_?\d{2,5}/i;

    async function init() {
        GM_registerMenuCommand("🔄 强制更新 Emby 库数据", () => fetchEmbyData(true));

        let localData = GM_getValue("emby_library_cache", null);
        let lastUpdate = GM_getValue("emby_library_time", 0);
        let now = new Date().getTime();

        if (!localData || (now - lastUpdate > CONFIG.cacheTime)) {
            await fetchEmbyData();
        } else {
            console.log(`Emby助手: 加载本地缓存...`);
            runMatching(JSON.parse(localData));
        }
    }

    function fetchEmbyData(force = false) {
        return new Promise((resolve) => {
            const url = `${CONFIG.embyUrl}/emby/Items?Recursive=true&IncludeItemTypes=Movie,Video&Fields=OriginalTitle,Name&api_key=${CONFIG.apiKey}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const codeSet = new Set();
                            data.Items.forEach(item => {
                                const name = item.Name + " " + (item.OriginalTitle || "");
                                const match = name.match(ID_REGEX);
                                if (match) codeSet.add(normalizeCode(match[0]));
                            });
                            const codeList = Array.from(codeSet);
                            GM_setValue("emby_library_cache", JSON.stringify(codeList));
                            GM_setValue("emby_library_time", new Date().getTime());
                            if (force) alert(`更新成功，发现 ${codeList.length} 个番号`);
                            runMatching(codeList);
                            resolve();
                        } catch (e) { console.error(e); }
                    }
                }
            });
        });
    }

    function normalizeCode(code) {
        return code ? code.replace(/[-_\s]/g, "").toUpperCase() : "";
    }

    function runMatching(embyCodes) {
        const embySet = new Set(embyCodes);
        const domain = window.location.hostname;

        // 1. 针对 JavDB 的全方位匹配
        if (domain.includes("javdb")) {
            
            // A. 原生列表视图 (List View) 
            document.querySelectorAll('.video-title strong').forEach(node => {
                const webId = node.textContent.trim();
                if (embySet.has(normalizeCode(webId))) {
                    markElement(node, "已拥有");
                    // 让整行变淡
                    const row = node.closest('.item-list') || node.closest('.item'); 
                    if (row) row.style.opacity = "0.6";
                }
            });

            // B. 原生网格视图 (Grid View)
            document.querySelectorAll('.grid-item .uid, .movie-list .uid').forEach(node => {
                const webId = node.textContent.trim();
                if (embySet.has(normalizeCode(webId))) {
                    markElement(node, "已拥有");
                    const card = node.closest('.grid-item') || node.closest('.movie-list');
                    if (card) card.style.opacity = "0.6";
                }
            });

            // C. 详情页标题
            const titleNode = document.querySelector('.title.is-4');
            if (titleNode) {
                const match = titleNode.textContent.match(ID_REGEX);
                if (match && embySet.has(normalizeCode(match[0]))) {
                    markElement(titleNode, "库中已拥有在");
                }
            }
            
            // D. 详情页右侧信息栏
             document.querySelectorAll('.panel-block .value').forEach(valNode => {
                if (embySet.has(normalizeCode(valNode.textContent))) {
                     markElement(valNode, "已拥有");
                }
            });
        }

        // 2. 针对 JavBus 的匹配
        if (domain.includes("javbus")) {
            document.querySelectorAll('.movie-box date').forEach(dateNode => {
                 if (embySet.has(normalizeCode(dateNode.textContent))) {
                    markElement(dateNode, "已拥有");
                    const box = dateNode.closest('.movie-box');
                    if (box) box.style.opacity = "0.6";
                }
            });
             document.querySelectorAll('span[style*="color:#CC0000"]').forEach(span => {
                if (embySet.has(normalizeCode(span.textContent))) {
                    markElement(span, "本地已拥有");
                }
            });
        }

        // 3. 通用匹配 (兼容JavScript脚本生成的代码)
        document.querySelectorAll('date[name="avid"]').forEach(dateNode => {
            if (embySet.has(normalizeCode(dateNode.textContent))) {
                markElement(dateNode, "已拥有");
                const container = dateNode.closest('.item-b') || dateNode.closest('.movie-box');
                if (container) container.style.opacity = "0.6";
            }
        });
    }

    function markElement(target, text) {
        if (!target) return;
        if (target.querySelector('.emby-exist-tag') || (target.nextElementSibling && target.nextElementSibling.classList.contains('emby-exist-tag'))) return;

        const tag = document.createElement('span');
        tag.className = 'emby-exist-tag';
        tag.innerHTML = `✓ ${text}`;

        // 智能插入位置判断
        if (target.tagName.toLowerCase() === 'date' || target.tagName.toLowerCase() === 'strong') {
            // 插入到元素后面
            if (target.nextSibling) {
                target.parentNode.insertBefore(tag, target.nextSibling);
            } else {
                target.parentNode.appendChild(tag);
            }
        } else {
            // 默认插入内部
            target.appendChild(tag);
        }
    }

    // 延迟执行，兼容加载慢的页面
    setTimeout(init, 500);
    // 针对动态加载的页面 (Infinite Scroll)，每 3 秒重新扫描一次
    setInterval(() => {
        let localData = GM_getValue("emby_library_cache", null);
        if (localData) runMatching(JSON.parse(localData));
    }, 3000);

})();