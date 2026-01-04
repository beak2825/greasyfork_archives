// ==UserScript==
// @license GPL-3.0
// @name         Bilibili 分区显示v1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除所有实验性优化，回归最原始、最稳定的扫描逻辑。修复个人空间、首页、播放页、历史记录的所有显示问题。
// @author       ai and xiaojuqs
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://member.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557548/Bilibili%20%E5%88%86%E5%8C%BA%E6%98%BE%E7%A4%BAv1.user.js
// @updateURL https://update.greasyfork.org/scripts/557548/Bilibili%20%E5%88%86%E5%8C%BA%E6%98%BE%E7%A4%BAv1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 开关配置 =================
    const defaultConfig = {
        home: true, mainTitle: true, sideBar: true, history: true, space: true
    };
    const config = {
        home: GM_getValue('switch_home', defaultConfig.home),
        mainTitle: GM_getValue('switch_mainTitle', defaultConfig.mainTitle),
        sideBar: GM_getValue('switch_sideBar', defaultConfig.sideBar),
        history: GM_getValue('switch_history', defaultConfig.history),
        space: GM_getValue('switch_space', defaultConfig.space)
    };

    function registerMenu() {
        GM_registerMenuCommand(`${config.home ? '✅' : '❌'} 首页分区`, () => toggle('home', 'switch_home'));
        GM_registerMenuCommand(`${config.mainTitle ? '✅' : '❌'} 播放页主标题`, () => toggle('mainTitle', 'switch_mainTitle'));
        GM_registerMenuCommand(`${config.sideBar ? '✅' : '❌'} 播放页侧边栏`, () => toggle('sideBar', 'switch_sideBar'));
        GM_registerMenuCommand(`${config.history ? '✅' : '❌'} 历史记录页`, () => toggle('history', 'switch_history'));
        GM_registerMenuCommand(`${config.space ? '✅' : '❌'} 个人空间页`, () => toggle('space', 'switch_space'));
    }
    function toggle(key, k2) { GM_setValue(k2, !config[key]); alert('设置已保存，请刷新页面生效。'); }
    registerMenu();

    // ================= 2. 核心工具 =================
    const API_DELAY = 450;
    const CACHE_KEY = 'gemini_bili_partition_v12_cache';

    function getCache(bvid) {
        try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}')[bvid]; } catch (e) { return null; }
    }
    function setCache(bvid, data) {
        try {
            const cache = JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}');
            cache[bvid] = data;
            // 简单清理
            if (Object.keys(cache).length > 1500) {
                const keys = Object.keys(cache);
                for (let i = 0; i < 500; i++) delete cache[keys[i]];
            }
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {}
    }

    async function fetchPartitionInfo(bvid) {
        try {
            const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
            const json = await res.json();
            if (json.code === 0 && json.data) {
                return { tname: json.data.tname, tname_v2: json.data.tname_v2 };
            }
        } catch (e) { console.warn('API Fail:', e); }
        return null;
    }

    // ================= 3. 队列与渲染 =================
    const queue = [];
    let isProcessing = false;

    async function processQueue() {
        if (queue.length === 0) { isProcessing = false; return; }
        isProcessing = true;

        const { bvid, insertTarget, styleType } = queue.shift();

        // 检查元素是否还在
        if (document.body.contains(insertTarget)) {
            const nextNode = insertTarget.nextElementSibling;
            // 防止重复
            if (!nextNode || !nextNode.classList.contains('gemini-list-tag')) {
                const cached = getCache(bvid);
                if (cached) {
                    renderListTag(insertTarget, cached, styleType);
                    setTimeout(processQueue, 50);
                } else {
                    const data = await fetchPartitionInfo(bvid);
                    if (data) {
                        setCache(bvid, data);
                        renderListTag(insertTarget, data, styleType);
                    }
                    setTimeout(processQueue, API_DELAY);
                }
            } else { processQueue(); }
        } else { processQueue(); }
    }

    function addQueue(bvid, insertTarget, styleType = 'normal') {
        if (insertTarget.dataset.geminiQ) return;
        insertTarget.dataset.geminiQ = 'true';
        queue.push({ bvid, insertTarget, styleType });
        if (!isProcessing) processQueue();
    }

    function renderListTag(target, data, styleType) {
        const div = document.createElement('div');
        div.className = 'gemini-list-tag';
        
        // 样式
        if (styleType === 'compact') { 
            div.style.cssText = `font-size:12px;color:#9499A0;display:flex;align-items:center;margin-top:4px;line-height:1.2;width:100%;`;
            div.innerHTML = `<span style="color:#FB7299;margin-right:4px;">${data.tname}</span><span style="color:#E3E5E7;margin-right:4px;">|</span><span>${data.tname_v2}</span>`;
        } else { 
            div.style.cssText = `font-size:12px;color:#9499A0;display:flex;align-items:center;margin-top:4px;line-height:1.2;`;
            div.innerHTML = `<span style="background:rgba(251,114,153,0.1);color:#FB7299;padding:1px 4px;border-radius:3px;margin-right:5px;">${data.tname}</span><span>${data.tname_v2}</span>`;
        }

        if (target.parentNode) {
            target.parentNode.insertBefore(div, target.nextSibling);
            
            // --- 暴力修复高度 (针对个人空间) ---
            // 只要检测到是 small-item (个人空间卡片)，强制 height: auto
            const card = target.closest('.small-item, .history-record-item, .bili-video-card__info');
            if(card) {
                // 如果是个人空间，必须解锁高度，否则内容会被遮挡
                if (window.location.host === 'space.bilibili.com') {
                    card.style.height = 'auto';
                    card.style.minHeight = '100px'; // 防止塌陷
                } else if (!window.location.host.includes('www.bilibili.com')) {
                    card.style.height = 'auto';
                }
            }
        }
    }

    // ================= 4. 全局暴力扫描 (无视路由，全扫) =================
    function scanAll() {
        
        // 1. 【个人空间】(优先级调高)
        if (config.space) {
            // 扫描个人空间常见的所有标题结构
            const selectors = [
                '.small-item a.title',         // 投稿列表
                '.list-item a.title',          // 列表模式
                '.channel-video-card .title',  // 频道/合集
                '.i-pin-title'                 // 置顶视频
            ];
            document.querySelectorAll(selectors.join(',')).forEach(title => {
                const link = title.tagName === 'A' ? title : title.querySelector('a');
                if (link && link.href) {
                    const match = link.href.match(/(BV\w+)/);
                    if (match) addQueue(match[1], title, 'compact');
                }
            });
        }

        // 2. 【首页】
        if (config.home) {
            document.querySelectorAll('.bili-video-card .bili-video-card__info--tit').forEach(title => {
                const card = title.closest('.bili-video-card');
                const link = card ? card.querySelector('a[href*="/video/BV"]') : null;
                if (link && link.href) {
                    const match = link.href.match(/(BV\w+)/);
                    if (match) addQueue(match[1], title, 'compact');
                }
            });
        }

        // 3. 【侧边栏】
        if (config.sideBar) {
            document.querySelectorAll('.rec-list .video-page-card-small, .rec-list .video-card, .recommend-video-card').forEach(card => {
                const link = card.querySelector('a[href*="/video/BV"]');
                if (!link) return;
                const match = link.href.match(/(BV\w+)/);
                if (!match) return;
                let target = card.querySelector('.title') || card.querySelector('.info');
                if (target) addQueue(match[1], target, 'compact');
            });
        }

        // 4. 【历史记录】
        if (config.history) {
            document.querySelectorAll('.bili-video-card__details .bili-video-card__title, .history-record-item .title').forEach(title => {
                const link = title.querySelector('a') || (title.tagName === 'A' ? title : null);
                if (link && link.href && link.href.match(/(BV\w+)/)) {
                    addQueue(link.href.match(/(BV\w+)/)[1], title, 'normal');
                }
            });
        }
    }

    // 主标题逻辑
    let lastMainBvid = '';
    async function handleMainTitle() {
        if (!config.mainTitle) return;
        if (!location.href.includes('/video/')) return;

        const match = location.pathname.match(/(BV\w+)/);
        if (!match) return;
        const currentBvid = match[1];

        const titleEl = document.querySelector('h1.video-title') || document.querySelector('.video-info-title-inner');
        if (!titleEl) return;

        const existing = document.getElementById('gemini-main-tag');
        if (existing) { if (lastMainBvid === currentBvid) return; existing.remove(); }
        lastMainBvid = currentBvid;

        let data = getCache(currentBvid);
        if (!data) {
            data = await fetchPartitionInfo(currentBvid);
            if (data) setCache(currentBvid, data);
        }
        if (!data) return;

        const div = document.createElement('div');
        div.id = 'gemini-main-tag';
        div.style.cssText = `display: flex; align-items: center; margin: 8px 0; font-size: 13px; color: #61666d;`;
        div.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB7299" stroke-width="2" style="margin-right:6px;"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3L8 21"/><path d="M16 3l-2 18"/></svg><span style="background:#F1F2F3;padding:2px 6px;border-radius:4px;color:#FB7299;">${data.tname}</span><span style="margin:0 6px;color:#9499A0;">&gt;</span><span style="background:#F1F2F3;padding:2px 6px;border-radius:4px;color:#00AEEC;">${data.tname_v2}</span>`;
        titleEl.insertAdjacentElement('afterend', div);
    }

    // ================= 5. 启动 =================
    console.log('B站分区助手 v11 已启动');

    // 主标题检查
    setInterval(handleMainTitle, 1000); 

    // 全局扫描 (无视任何条件，每800ms强制扫一遍)
    let scanTimer = null;
    const observer = new MutationObserver(() => {
        if (scanTimer) clearTimeout(scanTimer);
        scanTimer = setTimeout(scanAll, 800);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 保底：即使 MutationObserver 漏了，也强制扫
    setTimeout(scanAll, 1000);
    setInterval(scanAll, 2000);

})();