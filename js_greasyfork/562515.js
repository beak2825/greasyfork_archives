// ==UserScript==
// @name         디시인사이드 이미지 필터 (v0.94 License Added)
// @namespace    http://tampermonkey.net/
// @version      0.94
// @description  라이선스(MIT) 명시 + 설정창 먹통 해결 + 차단/신뢰 관리 정상화
// @author       활발한이네씨
// @license      MIT
// @match        https://gall.dcinside.com/board/view/*
// @match        https://gall.dcinside.com/mgallery/board/view/*
// @match        https://gall.dcinside.com/mini/board/view/*
// @match        https://gall.dcinside.com/board/lists/*
// @match        https://gall.dcinside.com/mgallery/board/lists/*
// @match        https://gall.dcinside.com/mini/board/lists/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/562515/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%ED%95%84%ED%84%B0%20%28v094%20License%20Added%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562515/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%ED%95%84%ED%84%B0%20%28v094%20License%20Added%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================================================================================
    // [SECTION 1] 설정 및 데이터
    // ======================================================================================
    const DEFAULT_TIERS = { iron: 100, bronze: 300, silver: 1000, gold: 3000, platinum: 7000, emerald: 15000, diamond: 30000, master: 70000, grandmaster: 150000, challenger: 999999999 };
    const DEFAULT_COLORS = { iron: '#a1a1a1', bronze: '#cd7f32', silver: '#c0c0c0', gold: '#e6c95e', platinum: '#20b2aa', emerald: '#50c878', diamond: '#88ccff', master: '#c87aff', grandmaster: '#ff6b6b', challenger: '#f0e6d2' };
    const DEFAULT_ICONS = { iron: '⛓️', bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💠', emerald: '🍀', diamond: '💎', master: '🔮', grandmaster: '⚔️', challenger: '👑' };
    
    const TIER_NAMES = { iron: '아이언', bronze: '브론즈', silver: '실버', gold: '골드', platinum: '플래티넘', emerald: '에메랄드', diamond: '다이아', master: '마스터', grandmaster: '그마', challenger: '챌린저' };
    const VIDEO_THUMB = 'https://nstatic.dcinside.com/dc/w/images/w_gall_icon.png';

    const getConf = (key, def) => { try { const v = GM_getValue(key); return (v !== undefined && v !== null) ? v : def; } catch { return def; } };

    let savedListMode = getConf('list_analysis_mode', 'semi');
    if (!['on', 'semi', 'off'].includes(savedListMode)) savedListMode = 'semi';

    const CONFIG = {
        threshold: getConf('total_threshold', 100),
        hoverMode: getConf('hover_mode', false),
        showCommentStats: getConf('show_comment_stats', true),
        listMode: savedListMode, 
        showTierIcon: getConf('show_tier_icon', true),
        useCache: getConf('use_cache', true),
        cacheDuration: getConf('cache_duration', 30),
        
        guestMode: getConf('guest_mode', true),
        guestColor: getConf('guest_color', '#ff6b6b'),
        guestIcon: getConf('guest_icon', '⚠️'),
        
        colorNickname: getConf('color_nickname', true),
        tiers: getConf('tier_config', DEFAULT_TIERS),
        colors: getConf('tier_colors', DEFAULT_COLORS),
        icons: getConf('tier_icons', DEFAULT_ICONS),
        cacheTime: 20 * 60 * 1000
    };

    if (typeof CONFIG.tiers !== 'object') CONFIG.tiers = DEFAULT_TIERS;
    if (typeof CONFIG.colors !== 'object') CONFIG.colors = DEFAULT_COLORS;
    if (typeof CONFIG.icons !== 'object') CONFIG.icons = DEFAULT_ICONS;

    const menuIds = {};

    // ======================================================================================
    // [SECTION 2] CSS 스타일
    // ======================================================================================
    const staticCss = `
        /* 미디어 차단 */
        .writing_view_box img:not(.show-me, .thumb-icon, .written_dccon), 
        .writing_view_box video:not(.show-me, .written_dccon), 
        .writing_view_box iframe:not(.show-me, .thumb-icon) { display: none !important; }
        .writing_view_box .num.img { display: none !important; } 
        .writing_view_box img.show-me ~ .num.img { display: inline-block !important; }
        .writing_view_box .imgnum { display: inline-block !important; visibility: visible !important; opacity: 1 !important; }
        .writing_view_box .img_area, .writing_view_box .imgwrap { display: block !important; opacity: 1 !important; visibility: visible !important; }

        /* 버튼 스타일 */
        .control-bar { display: flex; gap: 8px; margin-bottom: 15px; width: 100%; max-width: 600px; }
        .control-btn { flex: 1; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 600; background: #2a2a2a; color: #ccc; border: 1px solid #444; cursor: pointer; }
        .control-btn:hover { background: #3a3a3a; color: white; }
        .fold-btn { display: flex; align-items: center; gap: 8px; padding: 8px; margin: 5px 0; background: #1f1f1f; border: 1px solid #333; border-radius: 4px; color: #ccc; cursor: pointer; font-size: 12px; }
        .fold-btn:hover { background: #2f2f2f; }
        .thumb-icon { width: 16px; height: 16px; border-radius: 3px; object-fit: cover; }

        /* 배지 디자인 */
        .dc-badge { display: inline-flex; align-items: center; justify-content: center; padding: 0 8px 0 6px; border-radius: 4px; font-size: 11px; background: rgba(30,30,30,0.85); border: 1px solid #444; color: #aaa; white-space: nowrap; height: 20px; line-height: 1; }
        .dc-badge b { color: #eee; margin-left: 3px; }
        .tier-icon { margin-right: 3px; filter: drop-shadow(0 0 1px rgba(255,255,255,0.3)); }
        
        /* 댓글 레이아웃 */
        .cmt_list li, .cmt_list .cmt_info, .cmt_list .gall_writer { overflow: visible !important; height: auto !important; }
        .cmt_list .gall_writer { display: inline-block !important; vertical-align: top !important; position: relative !important; }
        .dc-cmt-badge-wrap { display: block !important; margin-top: 3px !important; margin-bottom: 2px !important; line-height: 1 !important; clear: both !important; }
        .cmt_list .dc-badge { height: 18px; font-size: 11px; padding: 0 6px 0 4px; background-color: rgba(20, 20, 20, 0.6); }
        .view_content_wrap .gall_writer .dc-badge { margin-left: 0; vertical-align: middle; }

        /* 목록 레이아웃 */
        .gall_list.dc-on .gall_writer { height: auto !important; overflow: visible !important; white-space: normal !important; padding: 4px 0 !important; display: table-cell !important; vertical-align: middle !important; }
        .dc-list-badge-wrap { display: block !important; margin-top: 2px; line-height: 1; }
        .dc-list-badge-wrap .dc-badge { font-size: 10px !important; height: 16px !important; padding: 0 4px !important; border: 1px solid #555 !important; }
        .tier-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 3px; border: 1px solid rgba(0,0,0,0.5); vertical-align: middle; cursor: help; }
        .guest-warning { 
            display: inline-flex; align-items: center; justify-content: center;
            width: 16px; height: 16px; border-radius: 50%; 
            background: #ff4444; color: white; font-size: 10px; font-weight: bold;
            margin-right: 4px; vertical-align: middle; cursor: help;
            border: 1px solid rgba(255,255,255,0.2);
        }

        /* Tooltip */
        #dc-tier-tooltip { position: fixed !important; z-index: 2147483647 !important; background: #000000 !important; border: 1px solid #888 !important; border-radius: 4px !important; padding: 6px 10px !important; pointer-events: none !important; display: none; box-shadow: 0 4px 10px rgba(0,0,0,0.9) !important; visibility: visible !important; opacity: 1 !important; }
        #dc-tier-tooltip * { color: #ffffff !important; font-size: 12px !important; font-weight: 500 !important; background: transparent !important; text-shadow: none !important; }

        /* 설정 UI */
        .dc-embedded-setting-btn { display: inline-block; cursor: pointer; padding: 0 12px; height: 29px; line-height: 27px; font-size: 12px; font-weight: bold; color: #aaa; border: 1px solid #ccc; background: #fff; border-radius: 2px; margin-left: 4px; vertical-align: middle; box-sizing: border-box; }
        .dc-embedded-setting-btn:hover { border-color: #3b4890; color: #3b4890; }
        html.darkmode .dc-embedded-setting-btn { background: #2a2a2a; border-color: #444; color: #ccc; }
        html.darkmode .dc-embedded-setting-btn:hover { background: #3a3a3a; color: #fff; }
        .dc-float-gear { position: fixed; bottom: 20px; right: 20px; width: 35px; height: 35px; background: rgba(0,0,0,0.7); border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9999; font-size: 20px; }

        /* Modal */
        #dc-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .dc-modal-content { 
            background: #1e1e1e; width: 500px; max-height: 90vh; overflow-y: auto; 
            padding: 25px; border-radius: 12px; border: 1px solid #444; color: #eee; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.6); 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }
        .dc-modal-header { 
            display: flex; justify-content: space-between; align-items: center; 
            border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 15px; 
            cursor: move; user-select: none;
        }
        .dc-modal-title { font-size: 18px; font-weight: bold; color: #fff; pointer-events: none; }
        
        .dc-modal-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #2a2a2a; }
        .dc-row-label { display: flex; flex-direction: column; flex: 1; padding-right: 15px; }
        .dc-row-title { font-size: 13px; font-weight: bold; color: #ddd; margin-bottom: 4px; display: block; }
        .dc-row-desc { font-size: 11px; color: #888; line-height: 1.3; display: block; }
        .dc-row-ctrl { display: flex; align-items: center; flex-shrink: 0; gap: 5px; }
        
        .dc-btn-group { display: flex; gap: 5px; }
        .dc-btn { padding: 5px 12px; border-radius: 4px; border: 1px solid #444; background: #333; color: #aaa; cursor: pointer; font-size: 12px; transition: 0.2s; white-space: nowrap; }
        .dc-btn:hover { background: #444; color: #fff; }
        .dc-btn.on.active { background: #2ea043; color: white; border-color: #2ea043; font-weight: bold; }
        .dc-btn.semi.active { background: #e6c95e; color: #222; border-color: #e6c95e; font-weight: bold; }
        .dc-btn.off.active { background: #f85149; color: white; border-color: #f85149; font-weight: bold; }
        
        .dc-reset-btn { font-size: 11px; padding: 3px 8px; border-radius: 4px; border: 1px solid #444; cursor: pointer; margin-left: 5px; font-weight: 500; white-space: nowrap; }
        .dc-reset-color { background: #1f6feb; color: white; border-color: #1f6feb; }
        .dc-reset-val { background: #dda705; color: black; border-color: #dda705; }
        .dc-reset-icon { background: #8b949e; color: white; border-color: #8b949e; }
        
        .dc-input-reset { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; font-size: 10px; border-radius: 50%; background: #333; border: 1px solid #555; color: #888; cursor: pointer; margin-left: 4px; transition: 0.2s; }
        .dc-input-reset:hover { background: #444; color: white; transform: rotate(-90deg); }

        .dc-tier-header { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; margin-bottom: 10px; border-top: 1px solid #333; padding-top: 15px; }
        .dc-tier-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .dc-tier-item { background: #252525; border: 1px solid #383838; padding: 6px 10px; border-radius: 4px; display: flex; align-items: center; justify-content: space-between; }
        .dc-tier-preview { font-size: 11px; padding: 2px 6px; border-radius: 3px; border: 1px solid #444; background: rgba(30,30,30,0.8); cursor: pointer; min-width: 60px; text-align: center; }
        .dc-tier-input { width: 60px; background: #151515; border: 1px solid #444; color: #eee; padding: 4px; border-radius: 3px; text-align: right; font-size: 11px; }
        .dc-icon-input { width: 25px; background: #151515; border: 1px solid #444; color: #fff; padding: 4px; border-radius: 3px; text-align: center; font-size: 12px; margin-right: 5px; }
        .dc-hidden-color { width: 0; height: 0; opacity: 0; position: absolute; }
        
        .dc-action-btn { cursor: pointer; padding: 0 4px; font-size: 11px; border: 1px solid #444; border-radius: 3px; margin-right: 2px; color: #888; background: transparent; }
        .dc-action-btn:hover { color: #fff; border-color: #666; }
        .dc-action-btn.active.trust { color: #2ea043; border-color: #2ea043; background: rgba(46,160,67,0.1); }
        .dc-action-btn.active.block { color: #f85149; border-color: #f85149; background: rgba(248,81,73,0.1); }
        
        .dc-save-btn { padding: 8px 20px; border: 1px solid #2ea043; background: #2ea043; color: white; font-weight: bold; border-radius: 4px; cursor: pointer; }
        .dc-save-btn:hover { background: #3fb950; }
        .dc-footer { margin-top: 20px; font-size: 11px; color: #666; text-align: left; border-top: 1px solid #333; padding-top: 10px; display:flex; justify-content:space-between; align-items:center; }

        /* User List Management */
        .dc-list-manage-box { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #333; }
        .dc-user-col { background: #111; border: 1px solid #333; border-radius: 4px; padding: 5px; }
        .dc-user-col-head { font-size: 12px; font-weight: bold; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #222; text-align: center; }
        .dc-user-scroll { max-height: 100px; overflow-y: auto; font-size: 11px; }
        .dc-user-row { display: flex; justify-content: space-between; align-items: center; padding: 3px 5px; border-bottom: 1px solid #222; color: #ccc; }
        .dc-user-row:last-child { border-bottom: none; }
        .dc-user-del { cursor: pointer; color: #666; font-weight: bold; }
        .dc-user-del:hover { color: #f85149; }
        .dc-user-scroll::-webkit-scrollbar { width: 4px; }
        .dc-user-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
    `;
    GM_addStyle(staticCss);

    function generateDynamicStyles() {
        let css = '';
        Object.entries(CONFIG.colors).forEach(([k, c]) => {
            if(!c) return;
            css += `.tier-${k} { border-color: ${c} !important; color: ${c} !important; }`;
            if(['diamond','master','grandmaster','challenger'].includes(k)) css += `.tier-${k} { box-shadow: 0 0 5px ${c}66; }`;
        });
        const styleId = 'dc-dynamic-styles';
        let styleTag = document.getElementById(styleId);
        if(!styleTag) { styleTag = document.createElement('style'); styleTag.id = styleId; document.head.appendChild(styleTag); }
        styleTag.innerHTML = css;
    }
    generateDynamicStyles();

    // ======================================================================================
    // [SECTION 3] 로직 (LOGIC) - [수정] UserList 함수 복구
    // ======================================================================================
    const Cache = {
        get: (uid) => {
            if (!CONFIG.useCache) return null;
            try { 
                const c = GM_getValue('user_stats', {}); 
                const limit = CONFIG.cacheDuration * 60 * 1000;
                if (c[uid] && (Date.now() - c[uid].time < limit)) return c[uid];
                return null; 
            } catch { return null; }
        },
        set: (uid, p, c) => {
            if (!CONFIG.useCache) return;
            try { 
                const cache = GM_getValue('user_stats', {}); 
                cache[uid] = { p, c, t: p+c, time: Date.now() }; 
                GM_setValue('user_stats', cache); 
            } catch {}
        }
    };

    const UserList = {
        has: (type, uid) => {
            const list = GM_getValue(type, []);
            return Array.isArray(list) ? list.includes(uid) : false;
        },
        get: (type) => {
            const list = GM_getValue(type, []);
            return Array.isArray(list) ? list : [];
        },
        toggle: (type, uid) => {
            let list = GM_getValue(type, []);
            if (!Array.isArray(list)) list = [];
            
            const exists = list.includes(uid);
            if(exists) list = list.filter(id => id !== uid);
            else {
                const opp = type === 'whitelist_users' ? 'blacklist_users' : 'whitelist_users';
                let oppList = GM_getValue(opp, []);
                if(!Array.isArray(oppList)) oppList = [];
                
                if(oppList.includes(uid)) GM_setValue(opp, oppList.filter(id => id !== uid));
                list.push(uid);
            }
            GM_setValue(type, list);
            return !exists;
        },
        remove: (type, uid) => {
            let list = GM_getValue(type, []);
            if (!Array.isArray(list)) list = [];
            list = list.filter(id => id !== uid);
            GM_setValue(type, list);
        }
    };

    function fetchStats(uid, cb) {
        if(!uid) return;
        const cached = Cache.get(uid);
        if(cached) { cb(cached); return; }

        const cookie = document.cookie.match(/ci_c=([^;]+)/)?.[1];
        if(!cookie) return cb(null);

        GM_xmlhttpRequest({
            method: "POST", url: "https://gall.dcinside.com/api/gallog_user_layer/gallog_content_reple/",
            data: `ci_t=${cookie}&user_id=${uid}`, headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "X-Requested-With": "XMLHttpRequest" },
            onload: (res) => {
                try {
                    const [p, c] = res.responseText.split(',').map(v => parseInt(v)||0);
                    Cache.set(uid, p, c);
                    cb({ p, c, t: p+c });
                } catch { cb(null); }
            },
            onerror: () => cb(null)
        });
    }

    function getTier(total) {
        for(const [k, v] of Object.entries(CONFIG.tiers)) if(total <= v) return k;
        return 'challenger';
    }

    function createBadgeEl(stats) {
        const tier = getTier(stats.t);
        const el = document.createElement('span');
        el.className = `dc-badge tier-${tier}`;
        const icon = CONFIG.showTierIcon ? `<span class="tier-icon">${CONFIG.icons[tier]}</span>` : '';
        el.innerHTML = `${icon}글 <b>${stats.p}</b> · 댓 <b>${stats.c}</b>`;
        return el;
    }

    function createActionBtns(uid) {
        const frag = document.createDocumentFragment();
        const trust = document.createElement('button');
        trust.className = `dc-action-btn trust ${UserList.has('whitelist_users', uid)?'active':''}`;
        trust.innerText = UserList.has('whitelist_users', uid) ? '✅' : '🛡️';
        trust.onclick = (e) => { e.stopPropagation(); if(UserList.has('blacklist_users', uid)) return alert('차단 해제 필요'); UserList.toggle('whitelist_users', uid) ? (trust.classList.add('active'), trust.innerText='✅', revealMedia()) : (trust.classList.remove('active'), trust.innerText='🛡️'); };
        
        const block = document.createElement('button');
        block.className = `dc-action-btn block ${UserList.has('blacklist_users', uid)?'active':''}`;
        block.innerText = '⛔';
        block.onclick = (e) => { e.stopPropagation(); if(UserList.has('whitelist_users', uid)) return alert('신뢰 해제 필요'); if(UserList.toggle('blacklist_users', uid)) { alert('차단됨'); location.reload(); } else block.classList.remove('active'); };

        frag.appendChild(trust);
        frag.appendChild(block);
        return frag;
    }

    function processGuest(writer) {
        if (!CONFIG.guestMode) return;
        if(writer.querySelector('.guest-warning')) return; 

        const warn = document.createElement('span');
        warn.className = 'guest-warning';
        warn.innerText = CONFIG.guestIcon;
        warn.onmouseenter = (e) => showTooltip(e, '로그인하지 않은 유동 사용자입니다.');
        warn.onmouseleave = hideTooltip;
        writer.prepend(warn);

        const nick = writer.querySelector('.nickname') || writer.querySelector('.usertxt') || writer.querySelector('em') || writer;
        if(nick) nick.style.setProperty('color', CONFIG.guestColor, 'important');
    }

    function colorizeNickname(writer, tier) {
        if (!CONFIG.colorNickname) return;
        const color = CONFIG.colors[tier];
        if (!color) return;
        
        const nick = writer.querySelector('.nickname') || writer.querySelector('.usertxt') || writer.querySelector('em');
        if(nick) nick.style.setProperty('color', color, 'important');
    }

    // ======================================================================================
    // [SECTION 4] 분석기 (ANALYZERS)
    // ======================================================================================
    
    function analyzePost() {
        const targets = document.querySelectorAll('.view_content_wrap .gall_writer, .gall_view_head .gall_writer');
        targets.forEach(writer => {
            if(writer.dataset.dcFlag) return;
            writer.dataset.dcFlag = 'true';

            const uid = writer.dataset.uid;
            if(!uid) { processGuest(writer); revealMedia(); return; }

            const isWhite = UserList.has('whitelist_users', uid);
            const isBlack = UserList.has('blacklist_users', uid);

            // [수정] 신뢰 유저면 바로 펼치기
            if(isWhite) revealMedia(); 

            // [수정] 차단 유저면 나중에 강제 폴딩, 리턴하지 않음 (배지 생성을 위해)

            fetchStats(uid, (stats) => {
                if(!stats || writer.querySelector('.dc-post-badge-wrap')) return;

                const wrap = document.createElement('div');
                wrap.style.marginTop = '4px';
                wrap.className = 'dc-post-badge-wrap';
                wrap.appendChild(createActionBtns(uid));
                wrap.appendChild(createBadgeEl(stats));
                
                const container = writer.querySelector('.fl') || writer.querySelector('.writer_info') || writer;
                container.appendChild(wrap);

                colorizeNickname(writer, getTier(stats.t));

                if (isWhite) {
                    revealMedia();
                } else if (isBlack) {
                    processMediaFolding(); // [핵심] 차단 유저는 강제 폴딩
                } else {
                    if(stats.t > CONFIG.threshold) revealMedia();
                    else processMediaFolding();
                }
            });
        });
    }

    function analyzeComments() {
        if(!CONFIG.showCommentStats) return;
        const comments = document.querySelectorAll('.cmt_list li');
        comments.forEach(li => {
            if (li.dataset.dcFlag) return;
            
            const writerBox = li.querySelector('.gall_writer');
            if (!writerBox) return;
            const uid = writerBox.dataset.uid;
            
            li.dataset.dcFlag = 'true';

            if (!uid) { processGuest(writerBox); return; }

            fetchStats(uid, (stats) => {
                if (stats && !writerBox.querySelector('.dc-badge')) {
                    const br = document.createElement('br');
                    const badgeWrap = document.createElement('div');
                    badgeWrap.className = 'dc-cmt-badge-wrap';
                    badgeWrap.appendChild(createBadgeEl(stats));
                    writerBox.appendChild(br);
                    writerBox.appendChild(badgeWrap);
                    writerBox.style.cssText = 'overflow: visible !important; height: auto !important; white-space: normal !important; display: inline-block !important;';
                    
                    colorizeNickname(writerBox, getTier(stats.t));
                }
            });
        });
    }

    function analyzeList() {
        if(CONFIG.listMode === 'off') return;
        const listTable = document.querySelector('.gall_list');
        if(!listTable) return;

        if(CONFIG.listMode === 'on') listTable.classList.add('dc-on');
        else listTable.classList.remove('dc-on');

        listTable.querySelectorAll('.gall_writer').forEach(wr => {
            if(wr.dataset.dcFlag) return;
            const uid = wr.dataset.uid;
            wr.dataset.dcFlag = 'true';

            if(!uid) { processGuest(wr); return; }

            fetchStats(uid, (stats) => {
                if(!stats) return;
                
                colorizeNickname(wr, getTier(stats.t));

                if(CONFIG.listMode === 'on') {
                    if(wr.querySelector('.dc-list-badge-wrap')) return;
                    const wrap = document.createElement('div');
                    wrap.className = 'dc-list-badge-wrap';
                    wrap.appendChild(createBadgeEl(stats));
                    wr.appendChild(wrap);
                } else if(CONFIG.listMode === 'semi') {
                    if(wr.querySelector('.tier-dot')) return;
                    const tier = getTier(stats.t);
                    const dot = document.createElement('span');
                    dot.className = 'tier-dot';
                    dot.style.backgroundColor = CONFIG.colors[tier];
                    dot.onmouseenter = (e) => showTooltip(e, `${TIER_NAMES[tier]} (글${stats.p}/댓${stats.c})`);
                    dot.onmouseleave = hideTooltip;
                    wr.prepend(dot);
                }
            });
        });
    }

    function revealMedia() {
        window._dcMediaOpen = true;
        document.querySelectorAll('.writing_view_box img, .writing_view_box video, .writing_view_box iframe').forEach(el => el.classList.add('show-me'));
        document.querySelectorAll('.fold-btn, .control-bar').forEach(el => el.remove());
    }

    function processMediaFolding() {
        if(window._dcMediaOpen) return;
        const box = document.querySelector('.writing_view_box');
        if(!box) return;
        const medias = Array.from(box.querySelectorAll('img:not(.thumb-icon), video, iframe'));
        if(medias.length === 0) return;

        if(medias.length > 1 && !box.querySelector('.control-bar')) {
            const bar = document.createElement('div'); bar.className = 'control-bar';
            bar.innerHTML = `<button class="control-btn" id="dc-show-all">📦 전체 펼치기</button><button class="control-btn" id="dc-hide-all">🔒 전체 접기</button>`;
            box.prepend(bar);
            bar.querySelector('#dc-show-all').onclick = () => medias.forEach(m => m.classList.add('show-me'));
            bar.querySelector('#dc-hide-all').onclick = () => medias.forEach(m => m.classList.remove('show-me'));
        }

        medias.forEach(el => {
            if(el.dataset.dcFolded) return;
            el.dataset.dcFolded = 'true';
            const isVid = el.tagName !== 'IMG';
            const btn = document.createElement('div');
            btn.className = 'fold-btn';
            btn.innerHTML = `<img src="${isVid ? VIDEO_THUMB : el.src}" class="thumb-icon"> <span>${isVid?'영상':'이미지'} 보기</span>`;
            const toggle = () => {
                const show = el.classList.toggle('show-me');
                btn.querySelector('span').innerText = show ? '접기' : '보기';
            };
            btn.onclick = (e) => { e.preventDefault(); toggle(); };
            if(CONFIG.hoverMode) {
                btn.onmouseenter = () => { if(!el.classList.contains('show-me')) toggle(); };
                const parent = el.closest('.imgwrap') || el.parentNode;
                if(parent) parent.onmouseleave = () => { if(el.classList.contains('show-me')) toggle(); };
            }
            el.parentNode.insertBefore(btn, el);
        });
    }

    // ======================================================================================
    // [SECTION 5] UI 및 툴팁
    // ======================================================================================
    const Tooltip = {
        el: null,
        init: () => {
            if(document.getElementById('dc-tier-tooltip')) return;
            const t = document.createElement('div'); t.id = 'dc-tier-tooltip';
            document.body.appendChild(t);
            Tooltip.el = t;
        },
        show: (e, txt) => {
            if(!Tooltip.el) Tooltip.init();
            Tooltip.el.innerHTML = `<div>${txt}</div>`;
            Tooltip.el.style.display = 'block';
            Tooltip.move(e);
        },
        hide: () => { if(Tooltip.el) Tooltip.el.style.display = 'none'; },
        move: (e) => { if(Tooltip.el) { Tooltip.el.style.left = (e.clientX+15)+'px'; Tooltip.el.style.top = (e.clientY+15)+'px'; } }
    };
    function showTooltip(e, t) { Tooltip.show(e, t); }
    function hideTooltip() { Tooltip.hide(); }
    window.addEventListener('mousemove', Tooltip.move);

    function createSettingsBtn() {
        if(document.getElementById('dc-set-btn')) return;
        const bottomBox = document.querySelector('.view_bottom_btn_box .fl') || document.querySelector('.list_bottom_btn_box .fl');
        if(bottomBox) {
            const btn = document.createElement('span');
            btn.id = 'dc-set-btn'; btn.className = 'dc-embedded-setting-btn'; btn.innerText = '⚙️ 필터 설정';
            btn.onclick = openModal;
            bottomBox.appendChild(btn);
        } else if(!document.querySelector('.dc-float-gear')) {
            const float = document.createElement('div');
            float.className = 'dc-float-gear'; float.innerText = '⚙️';
            float.onclick = openModal;
            document.body.appendChild(float);
        }
    }

    // [UI] 설정 모달
    function openModal() {
        if(document.getElementById('dc-modal')) return;
        const m = document.createElement('div'); m.id = 'dc-modal'; m.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;';
        
        let tempMode = CONFIG.listMode;
        let tempCmt = CONFIG.showCommentStats;
        let tempCache = CONFIG.useCache;
        let tempColorNick = CONFIG.colorNickname;
        let tempGuestMode = CONFIG.guestMode;

        const tierKeys = Object.keys(DEFAULT_TIERS);
        let tierGridHtml = '<div class="dc-tier-grid">';
        tierKeys.forEach(k => {
            const name = TIER_NAMES[k];
            const isChal = k === 'challenger';
            tierGridHtml += `
                <div class="dc-tier-item">
                    <div style="display:flex;align-items:center;">
                        <input type="text" id="icon-${k}" class="dc-icon-input" value="${CONFIG.icons[k]}">
                        <span class="dc-tier-preview tier-${k}" id="preview-${k}" title="클릭하여 색상 변경">${name}</span>
                        <span class="dc-input-reset" data-target="icon-${k}" data-type="icon" data-tier="${k}" title="아이콘 초기화">↺</span>
                    </div>
                    <div style="display:flex;align-items:center;">
                        <input type="color" class="dc-hidden-color" id="color-${k}" value="${CONFIG.colors[k]}">
                        ${isChal ? 
                            '<span style="font-size:11px;color:#888;width:60px;text-align:right;padding-right:5px;">MAX</span>' : 
                            `<input type="number" class="dc-tier-input" id="tier-${k}" value="${CONFIG.tiers[k]}">`
                        }
                        ${!isChal ? `<span class="dc-input-reset" data-target="tier-${k}" data-type="tier" data-tier="${k}" title="점수 초기화">↺</span>` : ''}
                    </div>
                </div>`;
        });
        tierGridHtml += '</div>';

        const whiteList = UserList.get('whitelist_users');
        const blackList = UserList.get('blacklist_users');
        const renderList = (list, type) => list.map(u => `
            <div class="dc-user-row">
                <span>${u}</span>
                <span class="dc-user-del" data-type="${type}" data-uid="${u}">✕</span>
            </div>
        `).join('') || '<div style="text-align:center;color:#555;padding:5px;">목록 없음</div>';

        const listManageHtml = `
            <div class="dc-list-manage-box">
                <div class="dc-user-col">
                    <div class="dc-user-col-head" style="color:#2ea043;">🛡️ 신뢰 유저 (${whiteList.length})</div>
                    <div class="dc-user-scroll" id="list-white">${renderList(whiteList, 'whitelist_users')}</div>
                </div>
                <div class="dc-user-col">
                    <div class="dc-user-col-head" style="color:#f85149;">⛔ 차단 유저 (${blackList.length})</div>
                    <div class="dc-user-scroll" id="list-black">${renderList(blackList, 'blacklist_users')}</div>
                </div>
            </div>
        `;

        m.innerHTML = `
            <div class="dc-modal-content">
                <div class="dc-modal-header">
                    <span class="dc-modal-title">필터 설정 (v0.94)</span>
                    <span style="cursor:pointer;font-size:24px;" id="dc-close">✕</span>
                </div>
                
                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">게시자 분석 (목록)</span>
                        <span class="dc-row-desc">글 목록에서 작성자 활동 정보를 표시합니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <div class="dc-btn-group" id="btn-group-list">
                            <button class="dc-btn on ${tempMode==='on'?'active':''}" data-val="on">ON</button>
                            <button class="dc-btn semi ${tempMode==='semi'?'active':''}" data-val="semi">SEMI</button>
                            <button class="dc-btn off ${tempMode==='off'?'active':''}" data-val="off">OFF</button>
                        </div>
                    </div>
                </div>

                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">댓글 분석 모드</span>
                        <span class="dc-row-desc">댓글 작성자의 정보를 배지로 표시합니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <div class="dc-btn-group" id="btn-group-cmt">
                            <button class="dc-btn on ${tempCmt?'active':''}" data-val="true">ON</button>
                            <button class="dc-btn off ${!tempCmt?'active':''}" data-val="false">OFF</button>
                        </div>
                    </div>
                </div>

                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">닉네임 티어 색상</span>
                        <span class="dc-row-desc">닉네임을 해당 티어의 색상으로 변경합니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <div class="dc-btn-group" id="btn-group-nick">
                            <button class="dc-btn on ${tempColorNick?'active':''}" data-val="true">ON</button>
                            <button class="dc-btn off ${!tempColorNick?'active':''}" data-val="false">OFF</button>
                        </div>
                    </div>
                </div>

                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">데이터 캐싱 (속도 향상)</span>
                        <span class="dc-row-desc">조회한 정보를 일정 시간 저장하여 재조회를 방지합니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <div class="dc-btn-group" id="btn-group-cache">
                            <button class="dc-btn off ${!tempCache?'active':''}" data-val="false">항상 최신</button>
                            <button class="dc-btn on ${tempCache?'active':''}" data-val="true">저장</button>
                        </div>
                        <input type="number" id="dc-cache-time" value="${CONFIG.cacheDuration}" style="width:40px;background:#222;border:1px solid #555;color:white;text-align:right;padding:3px;" ${!tempCache?'disabled':''}>
                        <span style="font-size:12px;color:#888;">분</span>
                    </div>
                </div>

                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">차단 기준 (글+댓글 합)</span>
                        <span class="dc-row-desc">이 점수 이상인 유저의 이미지를 자동으로 펼칩니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <input type="number" id="dc-limit" value="${CONFIG.threshold}" style="width:60px;padding:4px;background:#222;border:1px solid #555;color:white;text-align:right;">
                        <span class="dc-input-reset" id="reset-threshold" title="기준 초기화">↺</span>
                    </div>
                </div>

                <div class="dc-modal-row">
                    <div class="dc-row-label">
                        <span class="dc-row-title">유동 식별 모드</span>
                        <span class="dc-row-desc">유동 닉네임을 식별하고 아이콘과 스타일을 적용합니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <div class="dc-btn-group" id="btn-group-guest">
                            <button class="dc-btn on ${tempGuestMode?'active':''}" data-val="true">ON</button>
                            <button class="dc-btn off ${!tempGuestMode?'active':''}" data-val="false">OFF</button>
                        </div>
                    </div>
                </div>

                <div class="dc-modal-row" id="guest-style-row" style="${tempGuestMode?'':'display:none;'}">
                    <div class="dc-row-label">
                        <span class="dc-row-title">유동 스타일 (아이콘/색상)</span>
                        <span class="dc-row-desc">유동 유저에게 적용할 경고 아이콘과 닉네임 색상입니다.</span>
                    </div>
                    <div class="dc-row-ctrl">
                        <input type="text" id="dc-guest-icon" value="${CONFIG.guestIcon}" class="dc-icon-input" style="width:30px;">
                        <span class="dc-input-reset" id="reset-guest-icon" title="아이콘 초기화">↺</span>
                        <input type="color" id="dc-guest-color" value="${CONFIG.guestColor}" style="cursor:pointer;width:30px;padding:0;margin-left:5px;">
                        <span class="dc-input-reset" id="reset-guest-color" title="색상 초기화">↺</span>
                    </div>
                </div>
                
                <div class="dc-tier-header">
                    <span style="font-weight:bold;color:#ddd;font-size:14px;">🏆 티어별 기준 및 색상</span>
                    <div>
                        <button class="dc-reset-btn dc-reset-icon" id="dc-reset-i">아이콘초기화</button>
                        <button class="dc-reset-btn dc-reset-color" id="dc-reset-c">색상초기화</button>
                        <button class="dc-reset-btn dc-reset-val" id="dc-reset-v">수치초기화</button>
                    </div>
                </div>
                ${tierGridHtml}
                ${listManageHtml}
                
                <div class="dc-footer">
                    <span>Created by 활발한이네씨</span>
                    <button class="dc-save-btn" id="dc-save">저장 및 적용</button>
                </div>
            </div>
        `;
        document.body.appendChild(m);

        // [DRAG LOGIC]
        const header = m.querySelector('.dc-modal-header');
        let isDragging = false;
        let startX, startY;
        const content = m.querySelector('.dc-modal-content');

        header.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = content.getBoundingClientRect();
            content.style.transform = 'none';
            content.style.left = rect.left + 'px';
            content.style.top = rect.top + 'px';
            content.style.margin = '0'; 
        };

        window.addEventListener('mousemove', (e) => {
            if(!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            content.style.left = (parseInt(content.style.left) + dx) + 'px';
            content.style.top = (parseInt(content.style.top) + dy) + 'px';
            startX = e.clientX;
            startY = e.clientY;
        });

        window.addEventListener('mouseup', () => { isDragging = false; });

        m.querySelector('#dc-close').onclick = () => m.remove();

        const handleGroup = (id, callback) => {
            const group = m.querySelector(id);
            group.onclick = (e) => {
                if(e.target.tagName !== 'BUTTON') return;
                const val = e.target.dataset.val;
                group.querySelectorAll('.dc-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                callback(val);
            };
        };

        handleGroup('#btn-group-list', (v) => tempMode = v);
        handleGroup('#btn-group-cmt', (v) => tempCmt = v === 'true');
        handleGroup('#btn-group-nick', (v) => tempColorNick = v === 'true');
        handleGroup('#btn-group-cache', (v) => {
            tempCache = v === 'true';
            m.querySelector('#dc-cache-time').disabled = !tempCache;
        });
        handleGroup('#btn-group-guest', (v) => {
            tempGuestMode = v === 'true';
            m.querySelector('#guest-style-row').style.display = tempGuestMode ? 'flex' : 'none';
        });

        tierKeys.forEach(k => {
            const picker = m.querySelector(`#color-${k}`);
            const preview = m.querySelector(`#preview-${k}`);
            if(picker && preview) {
                preview.onclick = () => picker.click();
                picker.oninput = (e) => {
                    preview.style.setProperty('color', e.target.value, 'important');
                    preview.style.setProperty('border-color', e.target.value, 'important');
                };
            }
        });

        m.onclick = (e) => {
            if(e.target.classList.contains('dc-input-reset')) {
                const targetId = e.target.dataset.target;
                const type = e.target.dataset.type;
                const tier = e.target.dataset.tier;
                if (targetId === 'reset-threshold') m.querySelector('#dc-limit').value = 100;
                else if (targetId === 'reset-guest-color') m.querySelector('#dc-guest-color').value = '#ff6b6b';
                else if (targetId === 'reset-guest-icon') m.querySelector('#dc-guest-icon').value = '⚠️';
                else if (type === 'tier') m.querySelector(`#${targetId}`).value = DEFAULT_TIERS[tier];
                else if (type === 'icon') m.querySelector(`#${targetId}`).value = DEFAULT_ICONS[tier];
            }
            if(e.target.classList.contains('dc-user-del')) {
                const type = e.target.dataset.type;
                const uid = e.target.dataset.uid;
                if(confirm(`${uid} 님을 목록에서 삭제합니까?`)) {
                    UserList.remove(type, uid);
                    const newList = UserList.get(type);
                    m.querySelector(type === 'whitelist_users' ? '#list-white' : '#list-black').innerHTML = 
                        newList.map(u => `<div class="dc-user-row"><span>${u}</span><span class="dc-user-del" data-type="${type}" data-uid="${u}">✕</span></div>`).join('') || '<div style="text-align:center;color:#555;padding:5px;">목록 없음</div>';
                }
            }
        };

        m.querySelector('#dc-reset-i').onclick = () => { if(confirm('아이콘 리셋?')) tierKeys.forEach(k => m.querySelector(`#icon-${k}`).value = DEFAULT_ICONS[k]); };
        m.querySelector('#dc-reset-c').onclick = () => { 
            if(confirm('색상 리셋?')) tierKeys.forEach(k => { 
                m.querySelector(`#color-${k}`).value = DEFAULT_COLORS[k]; 
                m.querySelector(`#preview-${k}`).style.removeProperty('color'); 
                m.querySelector(`#preview-${k}`).style.removeProperty('border-color'); 
            }); 
        };
        m.querySelector('#dc-reset-v').onclick = () => { if(confirm('점수 리셋?')) tierKeys.forEach(k => { if(k!=='challenger') m.querySelector(`#tier-${k}`).value = DEFAULT_TIERS[k]; }); };

        m.querySelector('#dc-save').onclick = () => {
            GM_setValue('total_threshold', parseInt(m.querySelector('#dc-limit').value)||100);
            GM_setValue('list_analysis_mode', tempMode);
            GM_setValue('show_comment_stats', tempCmt);
            GM_setValue('use_cache', tempCache);
            GM_setValue('color_nickname', tempColorNick);
            GM_setValue('guest_mode', tempGuestMode);
            GM_setValue('cache_duration', parseInt(m.querySelector('#dc-cache-time').value)||30);
            GM_setValue('guest_color', m.querySelector('#dc-guest-color').value);
            GM_setValue('guest_icon', m.querySelector('#dc-guest-icon').value);
            
            const newTiers = {...CONFIG.tiers};
            const newColors = {...CONFIG.colors};
            const newIcons = {...CONFIG.icons};

            tierKeys.forEach(k => {
                if(k !== 'challenger') newTiers[k] = parseInt(m.querySelector(`#tier-${k}`).value) || newTiers[k];
                newColors[k] = m.querySelector(`#color-${k}`).value;
                newIcons[k] = m.querySelector(`#icon-${k}`).value;
            });
            GM_setValue('tier_config', newTiers);
            GM_setValue('tier_colors', newColors);
            GM_setValue('tier_icons', newIcons);

            alert('설정이 저장되었습니다.'); location.reload();
        };
    }

    // ======================================================================================
    // [SECTION 7] 실행 루프
    // ======================================================================================
    function mainLoop() {
        if(!document.body) return;
        createSettingsBtn();
        analyzePost();
        analyzeComments();
        analyzeList();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            Tooltip.init();
            setInterval(mainLoop, 1000);
        });
    } else {
        Tooltip.init();
        setInterval(mainLoop, 1000);
    }

    GM_registerMenuCommand("⚙️ 필터 설정", openModal);
    GM_registerMenuCommand("⚠️ 초기화", () => { if(confirm('설정을 초기화하시겠습니까?')) { ['total_threshold','hover_mode','show_comment_stats','show_tier_icon','tier_config','tier_colors','list_analysis_mode','user_stats','use_cache','cache_duration','guest_color','color_nickname','guest_icon','tier_icons','guest_mode','whitelist_users','blacklist_users'].forEach(k=>GM_deleteValue(k)); alert('초기화 완료'); location.reload(); } });

})();