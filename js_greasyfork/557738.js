// ==UserScript==
// @name         Bilibili Neuro Spine
// @namespace    AntiO2_Cyber_Crystal_Borderless
// @version      3.5
// @description  B站进度统计 - 无边框沉浸式 + 动态预测 + 字体增强
// @author       perry4427
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://img.moegirl.org.cn/common/f/f5/Bilibili_Icon.svg
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557738/Bilibili%20Neuro%20Spine.user.js
// @updateURL https://update.greasyfork.org/scripts/557738/Bilibili%20Neuro%20Spine.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 🎨 全局配置 ---
    const CONFIG = {
        baseWidth: 100,
        minBarWidth: 12,
        maxBarWidth: 88,
        barHeight: 6,
        gap: 4,
        cornerRadius: 18,
        colors: {
            watched: '#7b2cbf',
            current: '#ffffff',
            accent:  '#e0aaff',
            partial: '#a56cc1',
            remain:  '#2b2d42',
            bg:      'rgba(18, 18, 20, 0.88)',
            border:  'transparent', // 修改：全局默认无边框
            github: {
                l0: '#161b22', l1: '#0e4429', l2: '#006d32', l3: '#26a641', l4: '#39d353'
            }
        }
    };

    let state = {
        mode: 'none', videos: [], currentIndex: -1, totalDuration: 1,
        isCollapsed: false, storageKey: null, lastClickedIndex: -1,
        lastUrl: window.location.href,
        stats: { remainSeconds: 0, watchedSeconds: 0, remainStr: "--" },
        panelHover: false, btnHover: false
    };

    // ==========================================
    // 🛠️ 核心数据逻辑
    // ==========================================
    const getDailyGoal = () => parseInt(localStorage.getItem('bili_dna_daily_goal') || '60');
    const setDailyGoal = (mins) => localStorage.setItem('bili_dna_daily_goal', mins);

    const getTodayKey = () => `bili_dna_day_${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}`;
    const updateTodayXP = (sec) => {
        const k = getTodayKey();
        let v = parseInt(localStorage.getItem(k) || '0') + sec;
        localStorage.setItem(k, Math.max(0, v));
    };
    const getTodayXP = () => parseInt(localStorage.getItem(getTodayKey()) || '0');

    const getHeatmapData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = `bili_dna_day_${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
            const xp = parseInt(localStorage.getItem(key) || '0');
            data.push({ date: d, xp: xp });
        }
        return data;
    };

    // 🔮 智能滑动窗口预测算法
    const calculatePrediction = () => {
        if (state.stats.remainSeconds <= 60) return { days: "0 天", date: "即将完成" };

        const history = getHeatmapData();
        let firstActiveIndex = -1;
        for (let i = 0; i < history.length; i++) {
            if (history[i].xp > 60) {
                firstActiveIndex = i;
                break;
            }
        }

        if (firstActiveIndex === -1) return { days: "∞", date: "遥遥无期" };

        const activeDaysCount = history.length - firstActiveIndex;
        const totalXP = history.reduce((acc, cur) => acc + cur.xp, 0);
        const avgDailySeconds = totalXP / activeDaysCount;

        if (avgDailySeconds < 60) return { days: "∞", date: "龟速爬行" };

        const daysNeeded = state.stats.remainSeconds / avgDailySeconds;
        const daysInt = Math.ceil(daysNeeded);

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysInt);
        const m = targetDate.getMonth() + 1;
        const d = targetDate.getDate();

        let dateStr = `${m}月${d}日`;
        if (daysInt > 365) dateStr = "> 1 年";

        return { days: `还需 ${daysInt} 天`, date: dateStr };
    };

    const loadProgress = () => {
        if (!state.storageKey) return {};
        try { return JSON.parse(localStorage.getItem(state.storageKey) || '{}'); } catch(e){return {};}
    };

    const saveProgress = () => {
        if (!state.storageKey) return;
        const data = {};
        state.videos.forEach(v => {
            if (v.status === 'watched' || v.progress > 0.01 || v.star || (v.note && v.note.trim() !== "")) {
                const k = state.mode === 'micro' ? v.index : v.meta.bvid;
                data[k] = { w: v.status==='watched'?1:0, p: parseFloat(v.progress.toFixed(4)), s: v.star?1:0, n: v.note || "" };
            }
        });
        localStorage.setItem(state.storageKey, JSON.stringify(data));
    };

    // ==========================================
    // 🔍 数据抓取
    // ==========================================
    const getUrlBvid = () => {
        const u = new URL(window.location.href);
        let id = u.searchParams.get('bvid');
        if (!id) { const m = u.pathname.match(/(BV[a-zA-Z0-9]+)/); if (m) id = m[1]; }
        return id;
    };

    const tryFetchData = () => {
        try {
            const api = unsafeWindow.__INITIAL_STATE__;
            if (!api || !api.videoData) return false;
            const urlBvid = getUrlBvid();
            if (urlBvid && api.videoData.bvid && urlBvid !== api.videoData.bvid) return false;

            const processList = (list, type) => {
                const saved = loadProgress();
                return list.map((item, idx) => {
                    const key = type === 'micro' ? idx : item.bvid;
                    const rec = saved[key] || {};
                    return {
                        index: idx,
                        title: item.part || item.title || `P${idx + 1}`,
                        duration: item.duration || 0,
                        jumpUrl: type === 'micro' ? `p=${item.page}` : (item.bvid ? `https://www.bilibili.com/video/${item.bvid}` : '#'),
                        meta: type === 'micro' ? { p: item.page } : { bvid: item.bvid },
                        status: rec.w ? 'watched' : 'remain',
                        progress: rec.p || 0,
                        star: !!rec.s,
                        note: rec.n || ''
                    };
                });
            };

            if (api.videoData?.pages && api.videoData.pages.length > 1) {
                state.mode = 'micro'; state.storageKey = `bili_dna_micro_${urlBvid}`;
                state.videos = processList(api.videoData.pages, 'micro');
                return true;
            }

            let macroList = [];
            if (window.location.href.includes('watchlater')) macroList = api.toView?.data || api.watchLater?.list;
            else if (api.sections) api.sections.forEach(sec => { if (sec.episodes) macroList = macroList.concat(sec.episodes); });

            if (macroList && macroList.length > 1) {
                state.mode = 'macro';
                state.storageKey = window.location.href.includes('watchlater') ? 'bili_dna_macro_watchlater_v2' : `bili_dna_macro_col_${urlBvid}`;
                state.videos = processList(macroList, 'macro');
                return true;
            }
            state.mode = 'none'; state.videos = []; return true;
        } catch (e) { console.error(e); return false; }
    };

    const updateState = () => {
        if (state.videos.length === 0) { if (tryFetchData() && state.videos.length > 0) createSidebar(); return; }
        const url = new URL(window.location.href);
        let newIndex = -1;
        if (state.mode === 'micro') newIndex = state.videos.findIndex(v => v.meta.p === (parseInt(url.searchParams.get('p')) || 1));
        else if (state.mode === 'macro') newIndex = state.videos.findIndex(v => v.meta.bvid === getUrlBvid());

        if (newIndex !== -1 && newIndex !== state.currentIndex) {
            state.currentIndex = newIndex; updateAllVisuals();
        }
        if (state.totalDuration <= 1 && state.videos.length > 0) {
            state.totalDuration = state.videos.reduce((acc, v) => acc + v.duration, 0);
            createSidebar();
        }
    };

    // ==========================================
    // 🎨 UI 构建
    // ==========================================
    const createSidebar = () => {
        const id = 'bili-dna-sidebar';
        document.getElementById(id)?.remove();
        if (state.videos.length === 0) return;

        const sidebar = document.createElement('div');
        sidebar.id = id;
        Object.assign(sidebar.style, {
            position: 'fixed', top: '50%', right: '12px', transform: 'translateY(-50%)',
            width: `${CONFIG.baseWidth}px`, maxHeight: '85vh',
            backgroundColor: CONFIG.colors.bg, backdropFilter: 'blur(20px)',
            borderRadius: `${CONFIG.cornerRadius}px`,
            border: `1px solid ${CONFIG.colors.border}`, // 侧边栏整体边框保持极淡，但内部条目去框
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '16px 0',
            zIndex: '999999', transition: 'right 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        });

        const toggleTab = document.createElement('div');
        Object.assign(toggleTab.style, {
            position: 'absolute', top: '50%', left: '-12px', width: '12px', height: '36px', marginTop: '-18px',
            backgroundColor: CONFIG.colors.bg, borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888', fontSize: '10px',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.2)', border: `1px solid rgba(255,255,255,0.08)`, borderRight: 'none'
        });
        toggleTab.innerText = '◀';
        toggleTab.onclick = () => toggleSidebar(sidebar, toggleTab);
        sidebar.appendChild(toggleTab);

        const scrollBox = document.createElement('div');
        Object.assign(scrollBox.style, {
            flex: '1', width: '100%', overflowY: 'auto', overflowX: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: `${CONFIG.gap}px`, padding: '0 0', scrollbarWidth: 'none', position: 'relative'
        });

        const spineLine = document.createElement('div');
        Object.assign(spineLine.style, {
            position: 'absolute', left: '50%', top: '0', bottom: '0', width: '1px',
            background: 'rgba(255,255,255,0.05)', zIndex: '0', pointerEvents: 'none'
        });
        scrollBox.appendChild(spineLine);

        const pointer = document.createElement('div');
        pointer.id = 'bili-dna-pointer';
        Object.assign(pointer.style, {
            position: 'absolute', left: '2px', top: '-20px', width: '4px', height: '4px', borderRadius: '50%',
            backgroundColor: '#fff', boxShadow: '0 0 8px #fff',
            transition: 'top 0.2s cubic-bezier(0.25, 1, 0.5, 1)', zIndex: '2'
        });
        scrollBox.appendChild(pointer);

        const style = document.createElement('style');
        style.innerHTML = `
            #${id} ::-webkit-scrollbar { display: none; }
            .dna-crystal {
                transition: all 0.2s ease-out;
                border-radius: 4px;
                position: relative; z-index: 1;
                margin-left: auto; margin-right: auto;
                background-clip: padding-box;
                border: none; /* 核心修改：无边框 */
            }
            .dna-crystal:hover {
                filter: brightness(1.5); transform: scaleX(1.1); z-index: 10;
            }
        `;
        document.head.appendChild(style);

        const durations = state.videos.map(v => v.duration);
        const maxDur = Math.max(...durations, 600);

        state.videos.forEach(v => {
            const bar = document.createElement('div');
            bar.id = `dna-spine-${v.index}`;
            bar.className = 'dna-crystal';

            let ratio = v.duration / maxDur;
            let widthRatio = Math.pow(ratio, 0.85);
            const width = CONFIG.minBarWidth + widthRatio * (CONFIG.maxBarWidth - CONFIG.minBarWidth);

            Object.assign(bar.style, {
                width: `${width}px`, height: `${CONFIG.barHeight}px`, cursor: 'pointer'
            });

            bar.onclick = (e) => handleClick(e, v);
            bar.oncontextmenu = (e) => showContextMenu(e, v);
            bar.onmouseenter = (e) => showTooltip(e, v);
            bar.onmouseleave = () => document.getElementById('bili-dna-tooltip').style.display = 'none';
            scrollBox.appendChild(bar);
        });

        sidebar.appendChild(scrollBox);

        // --- 底部数据区域 (放大版) ---
        const footerContainer = document.createElement('div');
        Object.assign(footerContainer.style, {
            textAlign: 'center', marginTop: '12px', width: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            cursor: 'pointer', paddingBottom: '6px'
        });

        const remainEl = document.createElement('div');
        remainEl.id = 'bili-dna-remain-txt';
        Object.assign(remainEl.style, {
            fontSize: '15px', color: '#fff', fontWeight: 'bold', fontFamily: 'monospace',
            backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)'
        });
        remainEl.innerText = '--:--';

        const pctEl = document.createElement('div');
        pctEl.id = 'bili-dna-pct';
        Object.assign(pctEl.style, { fontSize: '13px', color: CONFIG.colors.accent, fontWeight:'bold' });
        pctEl.innerText = '0%';

        const predictEl = document.createElement('div');
        predictEl.id = 'bili-dna-predict';
        Object.assign(predictEl.style, { fontSize: '12px', color: '#aaa' });
        predictEl.innerText = '...';

        footerContainer.onmouseenter = () => { state.btnHover = true; showStatsBoard(true); };
        footerContainer.onmouseleave = () => { state.btnHover = false; setTimeout(checkCloseBoard, 300); };

        footerContainer.append(remainEl, pctEl, predictEl);
        sidebar.appendChild(footerContainer);
        document.body.appendChild(sidebar);

        createTooltip();
        updateAllVisuals();
        setTimeout(scrollToCurrent, 500);
    };

    const toggleSidebar = (sidebar, tab) => {
        state.isCollapsed = !state.isCollapsed;
        if (state.isCollapsed) {
            sidebar.style.right = `-${CONFIG.baseWidth + 5}px`;
            tab.innerText = '▶';
        } else {
            sidebar.style.right = '12px';
            tab.innerText = '◀';
        }
    };

    // ==========================================
    // 🐙 磁吸面板
    // ==========================================

    const showStatsBoard = (show) => {
        let board = document.getElementById('bili-dna-board');
        if (!show) return;
        if (!board) {
            board = document.createElement('div');
            board.id = 'bili-dna-board';
            Object.assign(board.style, {
                position: 'fixed', bottom: '60px', right: '140px', width: '240px',
                backgroundColor: '#0d1117',
                borderRadius: '6px', border: '1px solid #30363d',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)', padding: '16px',
                zIndex: '1000000', color: '#c9d1d9', fontSize: '12px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'
            });
            board.onmouseenter = () => { state.panelHover = true; };
            board.onmouseleave = () => { state.panelHover = false; checkCloseBoard(); };
            document.body.appendChild(board);
        }
        board.style.display = 'block';
        updateStatsContent(board);
    };

    const checkCloseBoard = () => {
        if (!state.panelHover && !state.btnHover) {
            const board = document.getElementById('bili-dna-board');
            if (board) board.style.display = 'none';
        }
    };

    const updateStatsContent = (board) => {
        const todayXP = getTodayXP();
        const goal = getDailyGoal();
        const todayMins = Math.floor(todayXP / 60);
        const pred = calculatePrediction();

        const getGithubColor = (mins) => {
            if (mins <= 0) return CONFIG.colors.github.l0;
            if (mins < 15) return CONFIG.colors.github.l1;
            if (mins < 30) return CONFIG.colors.github.l2;
            if (mins < 60) return CONFIG.colors.github.l3;
            return CONFIG.colors.github.l4;
        };

        const heatData = getHeatmapData();
        let heatHtml = '<div style="display:flex; gap:3px; margin-top:12px; justify-content:center">';
        heatData.forEach(day => {
            const mins = Math.floor(day.xp / 60);
            const color = getGithubColor(mins);
            heatHtml += `<div style="width:12px; height:12px; background:${color}; border-radius:2px; border:1px solid rgba(255,255,255,0.05);" title="${day.date.getMonth()+1}月${day.date.getDate()}日: ${mins} 分钟"></div>`;
        });
        heatHtml += '</div>';

        board.innerHTML = `
            <div style="font-weight:600; font-size:14px; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                <span style="color:${CONFIG.colors.github.l4}">●</span> 学习热力
            </div>

            <div style="margin-bottom:16px; cursor:pointer; background:#161b22; padding:10px; border-radius:6px; border:1px solid #30363d;" id="dna-goal-setting" title="点击修改目标">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
                    <span style="color:#8b949e">今日目标</span>
                    <span style="color:#fff; font-weight:bold;">${todayMins} / ${goal} min</span>
                </div>
                <div style="width:100%; height:6px; background:#30363d; border-radius:3px; overflow:hidden;">
                    <div style="width:${Math.min(100, (todayMins/goal)*100)}%; height:100%; background:${CONFIG.colors.github.l3};"></div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
                <span style="color:#8b949e">剩余时长</span>
                <span style="color:#fff; font-family:monospace;">${state.stats.remainStr}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                <span style="color:#8b949e">累计已看</span>
                <span style="color:#fff; font-family:monospace;">${formatTimeHms(state.stats.watchedSeconds)}</span>
            </div>

            <div style="width:100%; height:1px; background:#30363d; margin:8px 0;"></div>

            <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:12px;">
                <span style="color:#8b949e">平均速度</span>
                <span style="color:#aaa;">基于近 ${heatData.length} 天动态</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;">
                <span style="color:#fff;">预计完成日期</span>
                <span style="color:${CONFIG.colors.accent}; font-weight:bold;">${pred.date}</span>
            </div>

            <div style="font-size:10px; color:#8b949e; text-align:center; margin-top:12px;">Github Style Heatmap</div>
            ${heatHtml}
        `;

        const goalEl = board.querySelector('#dna-goal-setting');
        if(goalEl) goalEl.onclick = () => {
            const n = prompt("设置今日目标（分钟）:", goal);
            if(n && !isNaN(n)) { setDailyGoal(n); updateStatsContent(board); }
        };
    };

    // ==========================================
    // 👁️ 视觉更新
    // ==========================================

    const updateAllVisuals = () => {
        let watchedSec = 0;
        let remainSec = 0;

        const curEl = document.querySelector('.bpx-player-ctrl-time-label .bpx-player-ctrl-time-current');
        const durEl = document.querySelector('.bpx-player-ctrl-time-label .bpx-player-ctrl-time-duration');
        let curTime = 0, realDur = 0;
        if(curEl && durEl) { curTime = parseTime(curEl.innerText); realDur = parseTime(durEl.innerText); }

        state.videos.forEach(v => {
            const el = document.getElementById(`dna-spine-${v.index}`);
            if (!el) return;

            el.style.boxShadow = 'none';
            el.style.opacity = '1';
            let bg = CONFIG.colors.remain;

            if (v.status === 'watched') {
                bg = CONFIG.colors.watched; el.style.opacity = '0.6';
                watchedSec += v.duration;
            } else {
                el.style.opacity = '0.4';
                if (v.progress > 0) {
                    const p = v.progress * 100;
                    bg = `linear-gradient(to right, ${CONFIG.colors.partial} ${p}%, ${CONFIG.colors.remain} ${p}%)`;
                    watchedSec += (v.duration * v.progress);
                    remainSec += (v.duration * (1 - v.progress));
                    el.style.opacity = '0.8';
                } else {
                    bg = CONFIG.colors.remain;
                    remainSec += v.duration;
                }
            }

            if (v.index === state.currentIndex) {
                el.style.opacity = '1'; el.style.zIndex = '2';
                const base = realDur > 0 ? realDur : v.duration;
                const pct = Math.min(100, (curTime / (base||1)) * 100);
                const restColor = v.status === 'watched' ? CONFIG.colors.watched : CONFIG.colors.remain;
                el.style.background = `linear-gradient(to right, ${CONFIG.colors.current} ${pct}%, ${restColor} 0)`;

                if (v.status !== 'watched') {
                    if (v.progress > 0) {
                        watchedSec -= (v.duration * v.progress);
                        remainSec -= (v.duration * (1 - v.progress));
                    } else {
                        remainSec -= v.duration;
                    }
                    watchedSec += curTime;
                    remainSec += Math.max(0, base - curTime);
                    v.progress = curTime / (base || 1);
                }
            } else {
                el.style.background = bg;
            }

            // 修改：仅在收藏时显示边框，其余时间无边框 (border: none)
            if (v.star) {
                el.style.border = `1px solid #ffd700`;
            } else {
                el.style.border = 'none';
            }

            el.innerHTML = '';
            if (v.note && v.note.trim() !== "") {
                const dot = document.createElement('div');
                Object.assign(dot.style, { position:'absolute', top:'-2px', right:'-2px', width:'4px', height:'4px', borderRadius:'50%', background:'#fff' });
                el.appendChild(dot);
            }
        });

        state.stats.watchedSeconds = watchedSec;
        state.stats.remainSeconds = remainSec;
        state.stats.remainStr = formatTimeHms(remainSec);

        const remainEl = document.getElementById('bili-dna-remain-txt');
        if(remainEl) remainEl.innerText = state.stats.remainStr;

        const pctEl = document.getElementById('bili-dna-pct');
        if (pctEl) {
            const ratio = state.totalDuration ? (watchedSec / state.totalDuration) : 0;
            pctEl.innerText = Math.floor(Math.min(1, ratio) * 100) + '%';
        }

        const predictEl = document.getElementById('bili-dna-predict');
        if (predictEl) {
            const pred = calculatePrediction();
            predictEl.innerText = pred.days;
        }

        const pointer = document.getElementById('bili-dna-pointer');
        if(pointer && state.currentIndex!==-1) {
            const el = document.getElementById(`dna-spine-${state.currentIndex}`);
            if(el) pointer.style.top = `${el.offsetTop + el.offsetHeight/2 - 2}px`;
        }

        if(document.getElementById('bili-dna-board') && document.getElementById('bili-dna-board').style.display !== 'none') {
            updateStatsContent(document.getElementById('bili-dna-board'));
        }
    };

    const handleClick = (e, v) => {
        e.stopPropagation(); e.preventDefault();
        if (e.shiftKey) {
            const anchor = state.lastClickedIndex !== -1 ? state.lastClickedIndex : state.currentIndex;
            if (anchor !== -1) {
                const s = Math.min(anchor, v.index), eIdx = Math.max(anchor, v.index);
                for(let i=s; i<=eIdx; i++) {
                    if(i!==state.currentIndex && state.videos[i].status !== 'watched') {
                        state.videos[i].status = 'watched'; updateTodayXP(state.videos[i].duration);
                    }
                }
                saveProgress(); updateAllVisuals(); return;
            }
        }
        state.lastClickedIndex = v.index;
        if (e.ctrlKey || e.metaKey) {
            v.status = v.status === 'watched' ? 'remain' : 'watched';
            v.progress = 0;
            if(v.status==='watched') updateTodayXP(v.duration); else updateTodayXP(-v.duration);
            saveProgress(); updateAllVisuals(); return;
        }
        if (v.index !== state.currentIndex && v.jumpUrl) {
            if (state.mode === 'micro') window.location.search = v.jumpUrl;
            else window.location.href = v.jumpUrl;
        }
    };

    const showNoteInput = (v, x, y) => {
        const existing = document.getElementById('bili-dna-input'); if(existing) existing.remove();
        const box = document.createElement('div'); box.id = 'bili-dna-input';
        Object.assign(box.style, { position:'fixed', top:`${y}px`, left:`${x-240}px`, width:'220px', padding:'12px', background:CONFIG.colors.bg, backdropFilter:'blur(10px)', borderRadius:'8px', border:`1px solid #555`, zIndex:'1000005', display:'flex', flexDirection:'column', gap:'8px' });

        const ta = document.createElement('textarea'); ta.value=v.note||''; ta.placeholder="输入笔记...";
        Object.assign(ta.style, { width:'100%', height:'60px', background:'rgba(0,0,0,0.3)', color:'#fff', border:'1px solid #333', borderRadius:'4px', padding:'5px', fontSize:'12px', resize:'none', outline:'none' });
        ta.onkeydown=(e)=>e.stopPropagation();

        const row = document.createElement('div'); row.style.display='flex'; row.style.justifyContent='space-between';
        const timeBtn = document.createElement('button'); timeBtn.innerHTML='插入时间点';
        Object.assign(timeBtn.style, { background:'transparent', color:'#aaa', border:'1px solid #333', borderRadius:'4px', padding:'2px 6px', cursor:'pointer', fontSize:'10px' });
        timeBtn.onclick=()=>{
            const curEl=document.querySelector('.bpx-player-ctrl-time-label .bpx-player-ctrl-time-current');
            if(curEl) { ta.value += (ta.value?' ':'') + `[${curEl.innerText}]`; ta.focus(); }
        };
        const saveBtn = document.createElement('button'); saveBtn.innerText='保存';
        Object.assign(saveBtn.style, { background:'#238636', color:'#fff', border:'none', borderRadius:'4px', padding:'3px 12px', cursor:'pointer', fontSize:'11px' });
        saveBtn.onclick=()=>{
            const val = ta.value.trim();
            v.note = val === "" ? null : val;
            saveProgress(); box.remove(); updateAllVisuals();
        };
        row.append(timeBtn, saveBtn); box.append(ta, row); document.body.appendChild(box); ta.focus();
        setTimeout(()=>document.addEventListener('click', (e)=>{if(!box.contains(e.target)) box.remove();}, {once:true}), 100);
    };

    const showContextMenu = (e, v) => {
        e.preventDefault();
        const existing = document.getElementById('bili-dna-menu'); if(existing) existing.remove();
        const menu = document.createElement('div'); menu.id = 'bili-dna-menu';
        Object.assign(menu.style, { position:'fixed', top:`${e.clientY}px`, left:`${e.clientX-160}px`, width:'160px', background:'#0d1117', border:`1px solid #30363d`, borderRadius:'6px', padding:'5px 0', zIndex:'1000001', color:'#c9d1d9', fontSize:'12px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)' });

        const addItem = (txt, fn, col='#c9d1d9') => {
            const div = document.createElement('div'); div.innerText=txt;
            Object.assign(div.style, { padding:'8px 15px', cursor:'pointer', color:col });
            div.onmouseenter=()=>div.style.background='#161b22'; div.onmouseleave=()=>div.style.background='transparent';
            div.onclick=(ev)=>{ ev.stopPropagation(); fn(); menu.remove(); updateAllVisuals(); saveProgress(); };
            menu.appendChild(div);
        };

        const timeMatch = v.note ? v.note.match(/\[(\d{1,2}:\d{2})\]/) : null;
        if (timeMatch && v.index === state.currentIndex) {
            addItem(`🚀 跳转至 ${timeMatch[1]}`, () => {
                const sec = parseTime(timeMatch[1]);
                const video = document.querySelector('video');
                if (video) { video.currentTime = sec; video.play(); }
            }, '#58a6ff');
        }
        addItem(v.star?'★ 取消收藏':'☆ 收藏', ()=>v.star=!v.star, '#e3b341');
        addItem('✎ 笔记', ()=>setTimeout(()=>showNoteInput(v, e.clientX, e.clientY), 50));
        addItem(v.status==='watched'?'标为未看':'标为已看', ()=>{
            v.status=v.status==='watched'?'remain':'watched'; v.progress=0;
            if(v.status==='watched') updateTodayXP(v.duration); else updateTodayXP(-v.duration);
        });
        document.body.appendChild(menu);
        setTimeout(()=>document.addEventListener('click', ()=>menu.remove(), {once:true}), 10);
    };

    const createTooltip = () => {
        if(document.getElementById('bili-dna-tooltip')) return;
        const tip = document.createElement('div'); tip.id='bili-dna-tooltip';
        Object.assign(tip.style, { position:'fixed', padding:'6px 10px', background:'rgba(0,0,0,0.9)', color:'#fff', borderRadius:'4px', display:'none', zIndex:'1000002', right:'140px', fontSize:'12px', border:`1px solid #333` });
        document.body.appendChild(tip);
    };
    const showTooltip = (e, v) => {
        const tip = document.getElementById('bili-dna-tooltip'); const r = e.target.getBoundingClientRect();
        tip.innerHTML = `<span style="color:#fff; font-weight:bold;">${v.index+1}.</span> ${v.title} <span style="opacity:0.5; margin-left:5px;">${formatTimeHms(v.duration)}</span>` + (v.note?`<br><span style="color:#e3b341">笔记: ${v.note}</span>`:'');
        tip.style.display='block'; tip.style.top=(r.top+r.height/2-tip.offsetHeight/2)+'px';
    };
    const scrollToCurrent = () => { const el = document.getElementById(`dna-spine-${state.currentIndex}`); if(el) el.scrollIntoView({behavior:'smooth', block:'center'}); };

    const parseTime = (str) => {
         if (!str) return 0;
         const match = str.match(/(\d+:)?\d+:\d+/); if (!match) return 0;
         const parts = match[0].split(':').map(Number);
         if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
         if (parts.length === 2) return parts[0]*60 + parts[1];
         return 0;
    };
    const formatTimeHms = (s) => {
        if (s <= 0) return "0m";
        const h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
        return h>0 ? `${h}h ${m}m` : `${m}m`;
    };

    const loop = () => {
        if (window.location.href !== state.lastUrl) {
            state.lastUrl = window.location.href;
            const oldId = getUrlBvid(); const newId = getUrlBvid();
            if (state.mode === 'micro' && oldId && newId && oldId === newId) {}
            else { state.videos = []; document.getElementById('bili-dna-sidebar')?.remove(); }
        }
        updateState();
        const curEl = document.querySelector('.bpx-player-ctrl-time-label .bpx-player-ctrl-time-current');
        const durEl = document.querySelector('.bpx-player-ctrl-time-label .bpx-player-ctrl-time-duration');
        if (state.currentIndex > -1 && state.videos.length > 0 && curEl && durEl) {
            const curTime = parseTime(curEl.innerText); const duration = parseTime(durEl.innerText);
            const el = document.getElementById(`dna-spine-${state.currentIndex}`);
            if (el && duration > 0) {
                const pct = Math.min(100, (curTime / (duration||1)) * 100);
                if (pct > 95) {
                    const v = state.videos[state.currentIndex];
                    if (v.status !== 'watched') { v.status = 'watched'; updateTodayXP(v.duration); saveProgress(); }
                }
            }
            updateAllVisuals();
        }
    };

    const init = () => { if (tryFetchData()) createSidebar(); setInterval(loop, 1000); };
    setTimeout(init, 2000);
})();