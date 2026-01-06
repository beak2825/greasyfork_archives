// ==UserScript==
// @name         gying TMDB 助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在标题下方新起一行展示 {tmdbid=id}，不影响原标题样式
// @author       Gemini
// @match        *://www.gying.net/mv/*
// @match        *://www.gying.net/tv/*
// @connect      tmdb.org
// @connect      api.tmdb.org
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561614/gying%20TMDB%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561614/gying%20TMDB%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_NAME = "TMDB_API_KEY_STORAGE";

    const getApiKey = () => {
        let key = GM_getValue(KEY_NAME);
        if (!key) {
            key = prompt("首次使用，请输入您的 TMDB API Key:");
            if (key && key.length >= 30) {
                GM_setValue(KEY_NAME, key);
            } else {
                return null;
            }
        }
        return key;
    };

    const start = () => {
        const apiKey = getApiKey();
        if (!apiKey) return;

        let imdbId = "";
        const links = document.querySelectorAll('a[href*="imdb.com"]');
        for (let a of links) {
            const m = a.href.match(/tt\d+/);
            if (m) { imdbId = m[0]; break; }
        }

        if (!imdbId) {
            const m = document.body.innerText.match(/tt\d{7,10}/);
            if (m) imdbId = m[0];
        }

        if (!imdbId) return;

        const url = `https://api.tmdb.org/3/find/${imdbId}?api_key=${apiKey}&external_source=imdb_id&language=zh-CN`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status === 200) {
                    const data = JSON.parse(res.responseText);
                    processData(data);
                }
            }
        });
    };

    const processData = (data) => {
        let item = null;
        if (data.movie_results?.length > 0) {
            const res = data.movie_results[0];
            item = { name: res.title, date: res.release_date, id: res.id };
        } else if (data.tv_results?.length > 0) {
            const res = data.tv_results[0];
            item = { name: res.name, date: res.first_air_date, id: res.id };
        }

        if (item) {
            const year = item.date ? item.date.split('-')[0] : '未知';
            const text = `${item.name} (${year}) {tmdbid=${item.id}}`;
            render(text);
        }
    };

    const render = (text) => {
        const h1 = document.querySelector('.article-header h1') || document.querySelector('h1');
        if (!h1) return;

        // 创建一个外层容器实现强制换行
        const container = document.createElement('div');
        container.style.marginTop = '8px'; // 与原标题保持一点间距
        container.style.clear = 'both';    // 清除浮动干扰

        const btn = document.createElement('span');
        btn.id = 'tmdb-copy-btn';
        btn.innerText = `[ ${text} ]`;
        btn.title = "点击复制，Ctrl+点击 重置 API Key";
        
        Object.assign(btn.style, {
            display: 'inline-block',
            padding: '4px 12px',
            background: 'rgba(1, 180, 228, 0.1)',
            color: '#01b4e4',
            border: '1px solid #01b4e4',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            lineHeight: '1.4'
        });

        btn.onclick = (e) => {
            if (e.ctrlKey) {
                const newKey = prompt("请输入新的 TMDB API Key:");
                if (newKey) GM_setValue(KEY_NAME, newKey);
                return;
            }
            e.preventDefault();
            GM_setClipboard(text);
            const oldText = btn.innerText;
            btn.innerText = "✅ 已复制成功！";
            btn.style.backgroundColor = '#21d07a';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerText = oldText;
                btn.style.backgroundColor = 'rgba(1, 180, 228, 0.1)';
                btn.style.color = '#01b4e4';
            }, 1000);
        };

        container.appendChild(btn);
        
        // 插入到 h1 标签的后面，而不是里面，这样绝对不会影响 h1 原有的 CSS 样式
        h1.parentNode.insertBefore(container, h1.nextSibling);
    };

    setTimeout(start, 1000);
})();