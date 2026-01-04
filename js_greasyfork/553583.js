// ==UserScript==
// @name         搜索引擎增强，支持bing,google,帮助过滤搜索结果
// @namespace    https://github.com/yourname/bing-site-filetype
// @version      2.0
// @description  在搜索结果页右侧添加 网站 / 文件类型过滤，支持记忆与高亮
// @author       timor
// @match        *://www.bing.com/search*
// @match        *://www.google.com/search*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553583/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%94%AF%E6%8C%81bing%2Cgoogle%2C%E5%B8%AE%E5%8A%A9%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/553583/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%A2%9E%E5%BC%BA%EF%BC%8C%E6%94%AF%E6%8C%81bing%2Cgoogle%2C%E5%B8%AE%E5%8A%A9%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('✅ Bing 互斥按钮脚本已运行');

    /* --------------------------
     1. 配置：按钮定义
  -------------------------- */
    const CONFIG = [
        // site 组
        { label: 'Github', suffix: ' site:github.com', group: 'site' },
        { label: 'StackOverFlow', suffix: ' site:stackoverflow.com', group: 'site' },
        { label: '知乎', suffix: ' site:zhihu.com', group: 'site' },
        { label: 'B站', suffix: ' site:bilibili.com', group: 'site' },
        { label: '52pojie', suffix: ' site:52pojie.cn', group: 'site' },
        { label: '贴吧', suffix: ' site:tieba.baidu.com', group: 'site' },
        { label: 'V2EX', suffix: ' site:v2ex.com', group: 'site' },
        { label: '6Park', suffix: ' site:6park.com', group: 'site' },
        { label: '佳礼', suffix: ' site:cari.com.my', group: 'site' },
        { label: '清除网站筛选', suffix: '', group: 'site', clear: true },

        // filetype 组
        { label: 'PDF', suffix: ' filetype:pdf', group: 'filetype' },
        { label: 'PPT', suffix: ' filetype:ppt', group: 'filetype' },
        { label: '清除文件筛选', suffix: '', group: 'filetype', clear: true }
    ];

    const GROUPS = [...new Set(CONFIG.map(b => b.group))];

    /* --------------------------
     2. 工具函数
  -------------------------- */
    function getKW() {
        return new URLSearchParams(location.search).get('q') || '';
    }

    function buildURL(kw) {
        kw = kw.trim();
        const encoded = encodeURIComponent(kw);
        const host = location.hostname;
        console.log(host)
        if (host.includes('bing.com')) {
            return 'https://www.bing.com/search?q=' + encoded;
        } else if (host.includes('google')) {
            return 'https://www.google.com/search?q=' + encoded;
        } else if (host.includes('duckduckgo')) {
            return 'https://duckduckgo.com/?q=' + encoded;
        } else if (host.includes('baidu.com')) {
            return 'https://www.baidu.com/s?wd=' + encoded;
        } else {
            // 默认回退到 Bing
            return 'https://www.bing.com/search?q=' + encoded;
        }
    }

    // 安全删除同组后缀（更稳健的正则）
    function stripGroup(kw, group) {
        const list = CONFIG.filter(b => b.group === group).map(b => b.suffix.trim());
        for (const s of list) {
            if (!s) continue;
            const re = new RegExp(`\\s*${s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
            kw = kw.replace(re, '');
        }
        return kw.trim();
    }

    /* --------------------------
     3. 持久化状态管理
  -------------------------- */
    const map = JSON.parse(localStorage.getItem('bing_suffix_map') || '{}');

    function saveMap() {
        localStorage.setItem('bing_suffix_map', JSON.stringify(map));
    }

    function syncMapOnLoad() {
        const raw = getKW();
        for (const g of GROUPS) {
            const hit = CONFIG.filter(b => b.group === g && b.suffix)
            .find(b => raw.includes(b.suffix.trim()));
            if (hit) map[g] = hit.suffix;
        }
        saveMap();
    }

    /* --------------------------
     4. 逻辑：应用后缀
  -------------------------- */
    function applySuffix(group, newSuffix) {
        let raw = getKW();
        raw = stripGroup(raw, group);
        if (newSuffix) raw += newSuffix;
        map[group] = newSuffix || '';
        saveMap();
        location.href = buildURL(raw);
    }

    /* --------------------------
     5. 渲染 UI 面板
  -------------------------- */
    function renderBar() {
        const old = document.getElementById('site-filetype-bar');
        if (old) old.remove();

        const bar = document.createElement('div');
        bar.id = 'site-filetype-bar';
        Object.assign(bar.style, {
            position: 'fixed',
            right: '16px',
            top: '120px',
            width: '180px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 999
        });

        GROUPS.forEach(group => {
            const title = document.createElement('div');
            title.textContent = group === 'site' ? '🌐 站点筛选' : '📄 文件类型';
            title.style.cssText = 'font-weight:bold;color:#333;margin-top:4px';
            bar.appendChild(title);

            CONFIG.filter(b => b.group === group).forEach(btn => {
                const el = document.createElement('button');
                el.textContent = btn.label;
                el.className = 'b_searchbtn';
                Object.assign(el.style, {
                    padding: '6px 10px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    background: map[group] === btn.suffix && !btn.clear ? '#0078d4' : '#fff',
                    color: map[group] === btn.suffix && !btn.clear ? '#fff' : '#333',
                    cursor: 'pointer'
                });
                el.onmouseenter = () => el.style.borderColor = '#0078d4';
                el.onmouseleave = () => el.style.borderColor = '#ddd';
                el.onclick = () => applySuffix(btn.group, btn.suffix);
                bar.appendChild(el);
            });
        });

        // 允许拖动
        let startY, startTop;
        bar.addEventListener('mousedown', e => {
            if (e.target.tagName === 'BUTTON') return;
            startY = e.clientY;
            startTop = parseInt(bar.style.top);
            const move = e2 => {
                bar.style.top = `${startTop + e2.clientY - startY}px`;
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', move);
            }, { once: true });
        });

        document.body.appendChild(bar);
    }

    /* --------------------------
     6. 监听 URL 变化（SPA）
  -------------------------- */
    (function (history) {
        const pushState = history.pushState;
        history.pushState = function () {
            const ret = pushState.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        };
    })(window.history);
    window.addEventListener('urlchange', () => { syncMapOnLoad(); renderBar(); });
    window.addEventListener('popstate', () => { syncMapOnLoad(); renderBar(); });

    /* --------------------------
     初始化
  -------------------------- */
    window.addEventListener('load', () => {
        setTimeout(() => {
            syncMapOnLoad();
            renderBar();
        }, 400);
    });


})();
