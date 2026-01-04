// ==UserScript==
// @name                   ❀ 浮岚 Bilibili 链接净化器
// @name:zh-TW             ❀ 浮嵐 Bilibili 連結淨化器
// @name:ja                ❀ 浮嵐 Bilibili リンク浄化器
// @name:ko                ❀ 부람 Bilibili 링크 정화기
// @name:en                ❀ Fulan Bilibili Link Cleaner
// @description            清洁 B 站链接，移除跟踪参数。
// @description:zh-TW      清潔 B 站連結，移除追蹤參數。
// @description:ja         Bilibili のリンクをクリーンアップして、追跡パラメータを削除する。
// @description:ko         Bilibili 링크를 정리하고, 추적 파라미터를 제거합니다.
// @description:en         Clean Bilibili links and remove tracking parameters.
// @version                1.2.0
// @author                 嵐 @ranburiedbyacat
// @namespace              https://bento.me/ranburiedbyacat
// @license                CC-BY-NC-SA-4.0
// @match                  *://*.bilibili.com/*
// @compatible             Safari
// @compatible             Firefox
// @compatible             Chrome
// @icon                   https://www.bilibili.com/favicon.ico
// @grant                  none
// @run-at                 document-start
// @downloadURL https://update.greasyfork.org/scripts/554427/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554427/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    /**
     * ───────────────────────────────────────────────
     * ① 冗余参数
     * ───────────────────────────────────────────────
     */
    const chenruiMama = new Set([
        // ────────────── 来源跟踪 ────────────── 
        'spm_id_from', 'from_source', 'sourceFrom', 'from_spmid', 'csource', 'vd_source', 'source', 'search_source', 
        'from', 'buvid', 'mid', 'timestamp',
        // ────────────── 分享参数 ───────────────
        'share_source', 'share_medium', 'share_plat', 'share_session_id', 'share_tag', 'share_from', 'plat_id', 'up_id',
        // ────────────── 广告统计 ───────────────
        'trackid', 'session_id', 'visit_id', 'unique_k', 'spmid', '-Arouter',
        // ────────────── 功能标记 ───────────────
        'msource', 'bsource', 'tab', 'is_story_h5', 'hotRank', 'launch_id', 'live_from', 'popular_rank',
    ]);
 
    /**
     * ───────────────────────────────────────────────
     * ② URL 解析
     * ───────────────────────────────────────────────
     */
    function parseURL(str) {
        try {
            if (typeof str === 'string' && str.includes('.') && !/^[a-z]+:/.test(str)) {
                // 以 // 开头则补充协议
                str = str.startsWith("//") ? location.protocol + str : str;
            }
            return new URL(str, location.href);
        } catch (e) {
            return null;
        }
    }
 
    /**
     * ───────────────────────────────────────────────
     * ③ URL 净化
     * ───────────────────────────────────────────────
     */
    function cleanUrl(urlStr) {
        const url = parseURL(urlStr);
        if (!url) return urlStr;

        // 稍后再看接口放行（新增）
        if (/^https?:\/\/api\.bilibili\.com\/x\/v2\/history\/toview\/(add|del)/.test(url.href)) {
            return url.href;
        }

        if (!/bilibili\.com/.test(url.hostname)) return urlStr;
        if (url.hostname.includes('bilibili.tv')) url.hostname = 'www.bilibili.com';

        for (const key of Array.from(url.searchParams.keys())) {
            if (chenruiMama.has(key)) url.searchParams.delete(key);
            if (key==='p' && parseInt(url.searchParams.get('p'),10)===1) url.searchParams.delete(key);
        }

        if (/^\/video\/BV/i.test(url.pathname) && !url.pathname.endsWith('/')) url.pathname += '/';

        return url.toString();
    }
 
    /**
     * ───────────────────────────────────────────────
     * ④ 地址栏即时替换
     * ───────────────────────────────────────────────
     */
    function replaceLocation(url) {
        if (url !== location.href) {
            history.replaceState(history.state, '', url);
        }
    }
 
    replaceLocation(cleanUrl(location.href));
 
    /**
     * ───────────────────────────────────────────────
     * ⑤ 链接点击拦截
     * ───────────────────────────────────────────────
     */
    window.addEventListener('click', e => {
        if (e.button !== 0) return; // 左键点击才处理
        const target = e.target;

        // 1 检查是否点到「稍后再看」
        const watchlaterBtn = target.closest('[data-action="watchlater"]');
        if (watchlaterBtn) {
            // 放行稍后再看
            return;
        }

        // 2 查找 b 站链接
        const a = target.closest('a[href*="bilibili.com"]');
        if (!a) return;

        // 3 立即净化 href（防闪烁）
        const clean = cleanUrl(a.href);
        if (a.href !== clean) a.href = clean;

        // 4 阻止 B 站自己的跳转逻辑（视频链接或列表都适用）
        e.preventDefault();
        e.stopImmediatePropagation();

        // 5 手动打开
        if (a.target !== '_blank' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            location.assign(clean);
        } else {
            window.open(clean, '_blank');
        }
    });
    
    /**
     * ───────────────────────────────────────────────
     * ⑥ window.open 拦截
     * ───────────────────────────────────────────────
     */
    const _open = window.open;
    window.open = (url, target, features) => _open.call(window, cleanUrl(url), target || '_blank', features);
 
    /**
     * ───────────────────────────────────────────────
     * ⑦ SPA 导航拦截
     * ───────────────────────────────────────────────
     */
    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = (...args) => {
            if (typeof args[2] === 'string') {
                args[2] = cleanUrl(args[2]);
            }
            return orig.apply(history, args);
        };
    });
 
    /**
     * ───────────────────────────────────────────────
     * ⑧ Navigation API 拦截
     * ───────────────────────────────────────────────
     */
    if (window.navigation) {
        window.navigation.addEventListener('navigate', e => {
            const newURL = cleanUrl(e.destination.url);
            if (newURL !== e.destination.url) {
                e.preventDefault();
                if (newURL !== location.href) {
                    history.replaceState(history.state, '', newURL);
                }
            }
        });
    }

    /**
     * ───────────────────────────────────────────────
     * ⑨ 拦截 URL 变更（防止脏链接闪烁）
     * ───────────────────────────────────────────────
     */
    (function interceptHistory() {
        const rawPush = history.pushState;
        const rawReplace = history.replaceState;

        function wrap(fn) {
            return function (...args) {
                try {
                    const urlArg = args[2];
                    if (typeof urlArg === 'string') {
                        const cleaned = cleanUrl(urlArg);
                        if (cleaned !== urlArg) {
                            console.log('🧼 拦截并净化历史记录 URL:', urlArg, '→', cleaned);
                            args[2] = cleaned;
                        }
                    }
                } catch (err) {
                    console.warn('history 净化异常:', err);
                }
                return fn.apply(this, args);
            };
        }

        history.pushState = wrap(rawPush);
        history.replaceState = wrap(rawReplace);
    })();
 
    /**
     * ───────────────────────────────────────────────
     * ⑩ 动态节点净化
     * ───────────────────────────────────────────────
     */
    const observer = new MutationObserver(muts => {
        for (const m of muts) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                const links = node.querySelectorAll ? node.querySelectorAll('a[href*="bilibili.com"]') : [];
                for (const a of links) {
                    // 排除功能按钮（稍后再看）
                    if (a.closest('[data-action="watchlater"]')) continue;

                    a.href = cleanUrl(a.href);
                    a.removeAttribute('ping');
                }
            }
        }
    });
        observer.observe(document, { childList: true, subtree: true });
})();