// ==UserScript==
// @name         B站字幕提取器 Pro
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  自动提取B站视频字幕，支持AI生成和CC字幕，可复制下载，AI总结，点击跳转
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563012/B%E7%AB%99%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96%E5%99%A8%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/563012/B%E7%AB%99%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96%E5%99%A8%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===================== 样式注入 =====================
    GM_addStyle(`
        /* ========== CSS 变量 - B站蓝白主题 ========== */
        :root {
            --bse-primary: #00AEEC;
            --bse-pink: #FB7299;
            --bse-green: #18C86A;
            --bse-yellow: #FFB027;
            --bse-bg-glass: rgba(24, 28, 36, 0.92);
            --bse-bg-card: rgba(255, 255, 255, 0.03);
            --bse-border: rgba(255, 255, 255, 0.08);
            --bse-text: rgba(255, 255, 255, 0.95);
            --bse-text-dim: rgba(255, 255, 255, 0.55);
            --bse-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .bse-container {
            position: fixed;
            z-index: 100000;
            font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
            right: 20px;
            top: 80px;
        }

        .bse-trigger-btn {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: linear-gradient(145deg, var(--bse-primary) 0%, #0095D0 100%);
            border: 1px solid rgba(255,255,255,0.25);
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0, 174, 236, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            position: relative;
        }
        .bse-trigger-btn:hover { transform: scale(1.08); }
        .bse-trigger-btn svg { width: 24px; height: 24px; fill: white; }

        .bse-status-dot {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--bse-pink);
            border: 3px solid #1a1e26;
        }
        .bse-status-dot.ready { background: var(--bse-green); }
        .bse-status-dot.loading { background: var(--bse-yellow); animation: bse-pulse 1s infinite; }

        @keyframes bse-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bse-spin { to { transform: rotate(360deg); } }

        .bse-badge {
            position: absolute;
            bottom: -6px;
            right: -6px;
            min-width: 20px;
            height: 20px;
            background: var(--bse-pink);
            color: white;
            font-size: 11px;
            font-weight: 700;
            border-radius: 10px;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 0 5px;
            border: 3px solid #1a1e26;
        }

        .bse-panel {
            position: absolute;
            top: 68px;
            right: 0;
            width: 480px;
            max-height: 78vh;
            background: var(--bse-bg-glass);
            backdrop-filter: blur(24px);
            border-radius: 20px;
            box-shadow: var(--bse-shadow);
            border: 1px solid var(--bse-border);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        .bse-panel.show { display: flex; }

        .bse-header {
            padding: 18px 22px;
            background: linear-gradient(135deg, rgba(0,174,236,0.12) 0%, rgba(251,114,153,0.12) 100%);
            border-bottom: 1px solid var(--bse-border);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .bse-title { font-size: 17px; font-weight: 600; color: var(--bse-text); margin: 0; }
        .bse-subtitle-info { font-size: 12px; color: var(--bse-text-dim); margin-top: 4px; }

        .bse-refresh-btn {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: rgba(255,255,255,0.08);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .bse-refresh-btn:hover { background: rgba(255,255,255,0.15); }
        .bse-refresh-btn svg { width: 18px; height: 18px; fill: var(--bse-text-dim); }
        .bse-refresh-btn.spinning svg { animation: bse-spin 0.8s linear infinite; }

        .bse-subtitle-selector {
            padding: 14px 22px;
            background: rgba(0,0,0,0.15);
            border-bottom: 1px solid var(--bse-border);
        }
        .bse-selector-label { font-size: 11px; color: var(--bse-text-dim); margin-bottom: 10px; }
        .bse-subtitle-list { display: flex; flex-wrap: wrap; gap: 8px; max-height: 120px; overflow-y: auto; }
        .bse-subtitle-option {
            padding: 8px 14px;
            background: rgba(255,255,255,0.06);
            border: 1px solid transparent;
            border-radius: 10px;
            color: var(--bse-text);
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .bse-subtitle-option:hover { background: rgba(255,255,255,0.1); }
        .bse-subtitle-option.active { background: rgba(0,174,236,0.18); border-color: var(--bse-primary); color: var(--bse-primary); }
        .bse-subtitle-option .tag { font-size: 9px; padding: 3px 6px; border-radius: 5px; margin-left: 6px; }
        .bse-subtitle-option .tag.ai { background: rgba(0,174,236,0.25); color: var(--bse-primary); }
        .bse-subtitle-option .tag.cc { background: rgba(24,200,106,0.25); color: var(--bse-green); }

        .bse-tabs { display: flex; padding: 0 22px; border-bottom: 1px solid var(--bse-border); }
        .bse-tab {
            padding: 14px 18px;
            border: none;
            background: transparent;
            color: var(--bse-text-dim);
            font-size: 13px;
            cursor: pointer;
            position: relative;
        }
        .bse-tab:hover { color: var(--bse-text); }
        .bse-tab.active { color: var(--bse-primary); }
        .bse-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 24px;
            height: 3px;
            background: var(--bse-primary);
            border-radius: 2px;
        }

        .bse-content { flex: 1; overflow-y: auto; padding: 18px 22px; max-height: 340px; }
        .bse-content::-webkit-scrollbar { width: 6px; }
        .bse-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

        .bse-text-area {
            width: 100%;
            min-height: 220px;
            background: rgba(0,0,0,0.25);
            border: 1px solid var(--bse-border);
            border-radius: 12px;
            padding: 14px 16px;
            color: var(--bse-text);
            font-size: 13px;
            line-height: 1.75;
            resize: vertical;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
        }
        .bse-text-area:focus { outline: none; border-color: var(--bse-primary); }

        .bse-loading, .bse-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 50px 20px;
            color: var(--bse-text-dim);
        }
        .bse-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--bse-primary);
            border-radius: 50%;
            animation: bse-spin 0.8s linear infinite;
            margin-bottom: 14px;
        }

        .bse-subtitle-item {
            padding: 12px 14px;
            margin-bottom: 10px;
            background: var(--bse-bg-card);
            border-radius: 10px;
            border-left: 3px solid var(--bse-primary);
            cursor: pointer;
            transition: all 0.2s;
        }
        .bse-subtitle-item:hover { background: rgba(0,174,236,0.08); transform: translateX(4px); }
        .bse-timestamp { font-size: 11px; color: var(--bse-primary); font-family: monospace; margin-bottom: 6px; }
        .bse-subtitle-text { font-size: 14px; color: var(--bse-text); line-height: 1.6; }

        .bse-ai-section { margin-top: 16px; }
        .bse-ai-header { font-size: 12px; color: var(--bse-text-dim); margin-bottom: 12px; }
        .bse-prompt-list { display: flex; flex-direction: column; gap: 8px; }
        .bse-prompt-btn {
            width: 100%;
            text-align: left;
            padding: 12px 16px;
            font-size: 13px;
            background: var(--bse-bg-card);
            border: 1px solid var(--bse-border);
            border-radius: 10px;
            color: var(--bse-text);
            cursor: pointer;
            transition: all 0.2s;
        }
        .bse-prompt-btn:hover { background: rgba(0,174,236,0.1); border-color: var(--bse-primary); }

        .bse-footer {
            padding: 16px 22px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid var(--bse-border);
            display: flex;
            gap: 12px;
        }
        .bse-btn {
            flex: 1;
            padding: 12px 18px;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .bse-btn svg { width: 18px; height: 18px; }
        .bse-btn-primary { background: linear-gradient(135deg, var(--bse-primary) 0%, #0095D0 100%); color: white; }
        .bse-btn-primary:hover { filter: brightness(1.1); }
        .bse-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .bse-btn-secondary { background: rgba(255,255,255,0.08); color: var(--bse-text); }
        .bse-btn-secondary:hover { background: rgba(255,255,255,0.12); }

        .bse-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; }
        .bse-stat-item { background: var(--bse-bg-card); border-radius: 10px; padding: 14px; text-align: center; }
        .bse-stat-label { font-size: 11px; color: var(--bse-text-dim); margin-bottom: 4px; }
        .bse-stat-value { font-size: 18px; font-weight: 700; color: var(--bse-primary); }

        .bse-toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(24,200,106,0.95);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.35);
            opacity: 0;
            transition: all 0.35s;
            z-index: 100001;
        }
        .bse-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
        .bse-toast.error { background: rgba(244,67,54,0.95); }
    `);

    // ===================== 全局状态 =====================
    let allSubtitles = [];
    let currentSubtitleData = null;
    let selectedSubtitleId = null;
    let panelVisible = false;
    let currentTab = 'timestamp';
    let isLoading = false;
    let currentVideoKey = null; // bvid + page

    const AI_PROMPTS = [
        { icon: '📝', text: '总结视频核心内容', prompt: '请根据以下字幕内容，用简洁的语言总结视频的核心内容和主要观点：' },
        { icon: '📋', text: '提取关键要点', prompt: '请从以下字幕中提取5-10个关键要点，用列表形式呈现：' },
        { icon: '🎯', text: '生成学习笔记', prompt: '请根据以下字幕内容，生成结构化的学习笔记：' },
        { icon: '❓', text: '生成思考问题', prompt: '请根据以下字幕内容，生成5个有深度的思考问题：' },
    ];

    // ===================== 工具函数 =====================
    function log(...args) { console.log('[B站字幕提取器]', ...args); }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    function showToast(message, isError = false) {
        let toast = document.querySelector('.bse-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'bse-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function seekToTime(seconds) {
        const video = document.querySelector('video');
        if (video) {
            video.currentTime = seconds;
            showToast(`跳转到 ${formatTime(seconds)}`);
        }
    }

    function setLoadingState(loading) {
        isLoading = loading;
        const dot = document.querySelector('.bse-status-dot');
        const btn = document.querySelector('.bse-refresh-btn');
        if (dot) dot.classList.toggle('loading', loading);
        if (btn) btn.classList.toggle('spinning', loading);
    }

    // ===================== 核心 API 函数（完全静默）=====================

    // 从 URL 获取 bvid 和分P
    function getVideoInfoFromUrl() {
        const url = window.location.href;
        const bvidMatch = url.match(/\/video\/(BV[\w]+)/);
        const pageMatch = url.match(/[?&]p=(\d+)/);
        return {
            bvid: bvidMatch ? bvidMatch[1] : null,
            page: pageMatch ? parseInt(pageMatch[1]) : 1
        };
    }

    // 获取视频的 aid 和 cid（支持多分P）
    async function fetchVideoInfo(bvid, page = 1) {
        try {
            const resp = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { credentials: 'include' });
            const data = await resp.json();
            if (data.code === 0 && data.data) {
                const aid = data.data.aid;
                const pages = data.data.pages || [];
                let cid = data.data.cid;
                if (pages.length >= page) {
                    cid = pages[page - 1].cid;
                }
                log('视频信息: aid=' + aid + ', cid=' + cid + ', 分P=' + page + '/' + pages.length);
                return { aid, cid };
            }
        } catch (e) {
            log('获取视频信息失败:', e);
        }
        return null;
    }

    // 获取字幕列表（使用 aid + cid）
    async function fetchSubtitleList(aid, cid) {
        try {
            // 使用 aid 和 cid 调用接口
            const resp = await fetch(`https://api.bilibili.com/x/player/wbi/v2?aid=${aid}&cid=${cid}`, { credentials: 'include' });
            const data = await resp.json();
            log('字幕API响应:', data.code, data.message);
            if (data.code === 0 && data.data?.subtitle?.subtitles) {
                return data.data.subtitle.subtitles;
            }
        } catch (e) {
            log('获取字幕列表失败:', e);
        }
        return [];
    }

    // 获取字幕内容
    async function fetchSubtitleContent(url) {
        try {
            if (url.startsWith('//')) url = 'https:' + url;
            const resp = await fetch(url);
            const data = await resp.json();
            return data.body || [];
        } catch (e) {
            log('获取字幕内容失败:', e);
            return [];
        }
    }

    // 主函数：获取所有字幕（完全静默，无模拟点击）
    async function fetchAllSubtitles(force = false) {
        const { bvid, page } = getVideoInfoFromUrl();
        if (!bvid) {
            log('无法获取 bvid');
            return;
        }

        const videoKey = `${bvid}_p${page}`;

        // 如果已经获取过且不是强制刷新，跳过
        if (!force && videoKey === currentVideoKey && allSubtitles.length > 0) {
            log('已有字幕数据');
            return;
        }

        // 重置状态
        currentVideoKey = videoKey;
        allSubtitles = [];
        currentSubtitleData = null;
        selectedSubtitleId = null;

        setLoadingState(true);
        log('开始获取字幕...', bvid, 'P' + page);

        try {
            // 1. 获取 aid 和 cid
            const videoInfo = await fetchVideoInfo(bvid, page);
            if (!videoInfo) {
                log('无法获取视频信息');
                setLoadingState(false);
                updateUI();
                return;
            }

            // 2. 获取字幕列表（使用 aid + cid）
            const subtitles = await fetchSubtitleList(videoInfo.aid, videoInfo.cid);
            log('字幕列表:', subtitles.length, '个');

            if (subtitles.length === 0) {
                log('此视频没有字幕');
                setLoadingState(false);
                updateUI();
                return;
            }

            // 3. 处理字幕列表
            allSubtitles = subtitles.map((sub, index) => ({
                id: sub.id || index,
                lan: sub.lan,
                lan_doc: sub.lan_doc,
                subtitle_url: sub.subtitle_url,
                isAI: sub.lan.startsWith('ai-'),
                isCC: !sub.lan.startsWith('ai-'),
                body: null
            }));

            // 4. 自动加载第一个字幕的内容
            if (allSubtitles.length > 0) {
                await loadSubtitle(allSubtitles[0]);
            }

        } catch (e) {
            log('获取字幕出错:', e);
        }

        setLoadingState(false);
        updateUI();
    }

    // 加载指定字幕的内容
    async function loadSubtitle(subtitle) {
        if (!subtitle) return;

        selectedSubtitleId = subtitle.id;

        if (subtitle.body && subtitle.body.length > 0) {
            // 已有内容
            currentSubtitleData = subtitle;
            updateUI();
            updateContent();
            return;
        }

        // 需要获取
        setLoadingState(true);
        const body = await fetchSubtitleContent(subtitle.subtitle_url);
        subtitle.body = body;
        currentSubtitleData = subtitle;

        log('加载字幕:', subtitle.lan_doc, body.length, '条');

        setLoadingState(false);
        updateUI();
        updateContent();
    }

    // ===================== UI =====================
    function createUI() {
        if (document.querySelector('.bse-container')) return;

        const container = document.createElement('div');
        container.className = 'bse-container';
        container.innerHTML = `
            <button class="bse-trigger-btn" title="B站字幕提取器 Pro">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/></svg>
                <span class="bse-status-dot"></span>
                <span class="bse-badge">0</span>
            </button>
            <div class="bse-panel">
                <div class="bse-header">
                    <div>
                        <h3 class="bse-title">字幕提取器 Pro</h3>
                        <div class="bse-subtitle-info">点击刷新获取字幕</div>
                    </div>
                    <button class="bse-refresh-btn" title="刷新">
                        <svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                </div>
                <div class="bse-subtitle-selector">
                    <div class="bse-selector-label">选择字幕源</div>
                    <div class="bse-subtitle-list"></div>
                </div>
                <div class="bse-tabs">
                    <button class="bse-tab active" data-tab="timestamp">带时间戳</button>
                    <button class="bse-tab" data-tab="plain">纯文本</button>
                    <button class="bse-tab" data-tab="preview">预览</button>
                    <button class="bse-tab" data-tab="ai">AI 总结</button>
                </div>
                <div class="bse-content">
                    <div class="bse-empty">点击刷新按钮获取字幕</div>
                </div>
                <div class="bse-footer">
                    <button class="bse-btn bse-btn-secondary" id="bse-download-btn" disabled>
                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        下载
                    </button>
                    <button class="bse-btn bse-btn-primary" id="bse-copy-btn" disabled>
                        <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        复制
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        bindEvents(container);
    }

    function bindEvents(container) {
        const triggerBtn = container.querySelector('.bse-trigger-btn');
        const panel = container.querySelector('.bse-panel');
        const refreshBtn = container.querySelector('.bse-refresh-btn');
        const tabs = container.querySelectorAll('.bse-tab');
        const copyBtn = container.querySelector('#bse-copy-btn');
        const downloadBtn = container.querySelector('#bse-download-btn');

        triggerBtn.addEventListener('click', () => {
            panelVisible = !panelVisible;
            panel.classList.toggle('show', panelVisible);
            // 首次打开时自动获取
            if (panelVisible && allSubtitles.length === 0) {
                fetchAllSubtitles();
            }
        });

        document.addEventListener('click', (e) => {
            if (panelVisible && !container.contains(e.target)) {
                panelVisible = false;
                panel.classList.remove('show');
            }
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                updateContent();
            });
        });

        refreshBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fetchAllSubtitles(true);
        });

        copyBtn.addEventListener('click', () => {
            const text = getFormattedText();
            if (text) {
                GM_setClipboard(text);
                showToast('✓ 已复制到剪贴板');
            }
        });

        downloadBtn.addEventListener('click', () => {
            const text = getFormattedText();
            if (text) {
                const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bilibili_subtitle_${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('✓ 下载成功');
            }
        });
    }

    function getFormattedText() {
        if (!currentSubtitleData?.body) return '';
        if (currentTab === 'plain') {
            return currentSubtitleData.body.map(item => item.content).join('\n');
        }
        return currentSubtitleData.body.map(item =>
            `[${formatTime(item.from)} - ${formatTime(item.to)}] ${item.content}`
        ).join('\n');
    }

    function updateUI() {
        const statusDot = document.querySelector('.bse-status-dot');
        const subtitleInfo = document.querySelector('.bse-subtitle-info');
        const copyBtn = document.querySelector('#bse-copy-btn');
        const downloadBtn = document.querySelector('#bse-download-btn');
        const badge = document.querySelector('.bse-badge');
        const subtitleList = document.querySelector('.bse-subtitle-list');

        if (badge && allSubtitles.length > 0) {
            badge.textContent = allSubtitles.length;
            badge.style.display = 'flex';
        }

        if (subtitleList) {
            if (allSubtitles.length > 0) {
                subtitleList.innerHTML = allSubtitles.map(sub => `
                    <div class="bse-subtitle-option ${sub.id === selectedSubtitleId ? 'active' : ''}" data-id="${sub.id}">
                        ${sub.lan_doc}
                        <span class="tag ${sub.isAI ? 'ai' : 'cc'}">${sub.isAI ? 'AI' : 'CC'}</span>
                    </div>
                `).join('');

                subtitleList.querySelectorAll('.bse-subtitle-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        const sub = allSubtitles.find(s => s.id == opt.dataset.id);
                        if (sub) loadSubtitle(sub);
                    });
                });
            } else {
                subtitleList.innerHTML = '<div style="color:var(--bse-text-dim);font-size:12px;">暂无字幕</div>';
            }
        }

        if (currentSubtitleData?.body) {
            if (statusDot) { statusDot.classList.remove('loading'); statusDot.classList.add('ready'); }
            if (subtitleInfo) subtitleInfo.textContent = `${currentSubtitleData.body.length} 条字幕`;
            if (copyBtn) copyBtn.disabled = false;
            if (downloadBtn) downloadBtn.disabled = false;
        } else if (allSubtitles.length === 0 && !isLoading) {
            if (subtitleInfo) subtitleInfo.textContent = '此视频暂无字幕';
        }
    }

    function updateContent() {
        const content = document.querySelector('.bse-content');
        if (!content) return;

        if (isLoading) {
            content.innerHTML = '<div class="bse-loading"><div class="bse-spinner"></div><div>正在获取字幕...</div></div>';
            return;
        }

        if (currentTab === 'ai') {
            renderAITab(content);
            return;
        }

        if (!currentSubtitleData?.body) {
            content.innerHTML = '<div class="bse-empty">点击刷新按钮获取字幕</div>';
            return;
        }

        if (currentTab === 'preview') {
            const body = currentSubtitleData.body;
            const count = body.length;
            const duration = count > 0 ? formatTime(body[count - 1].to) : '00:00.00';
            const chars = body.reduce((sum, item) => sum + item.content.length, 0);

            content.innerHTML = `
                <div class="bse-stats">
                    <div class="bse-stat-item"><div class="bse-stat-label">字幕条数</div><div class="bse-stat-value">${count}</div></div>
                    <div class="bse-stat-item"><div class="bse-stat-label">总时长</div><div class="bse-stat-value">${duration.split('.')[0]}</div></div>
                    <div class="bse-stat-item"><div class="bse-stat-label">总字数</div><div class="bse-stat-value">${chars}</div></div>
                </div>
                ${body.slice(0, 50).map(item => `
                    <div class="bse-subtitle-item" data-time="${item.from}">
                        <div class="bse-timestamp">${formatTime(item.from)} → ${formatTime(item.to)}</div>
                        <div class="bse-subtitle-text">${item.content}</div>
                    </div>
                `).join('')}
                ${body.length > 50 ? '<div style="text-align:center;color:var(--bse-text-dim);padding:10px;">... 更多请复制或下载 ...</div>' : ''}
            `;

            content.querySelectorAll('.bse-subtitle-item').forEach(item => {
                item.addEventListener('click', () => seekToTime(parseFloat(item.dataset.time)));
            });
        } else {
            content.innerHTML = `<textarea class="bse-text-area" readonly>${getFormattedText()}</textarea>`;
        }
    }

    function renderAITab(content) {
        const hasSubtitle = currentSubtitleData?.body?.length > 0;
        content.innerHTML = `
            <div class="bse-ai-section">
                <div class="bse-ai-header">🤖 AI 智能总结</div>
                ${hasSubtitle ? `
                    <div class="bse-prompt-list">
                        ${AI_PROMPTS.map((p, i) => `
                            <button class="bse-prompt-btn" data-index="${i}">
                                <span style="font-size:18px;">${p.icon}</span>
                                <span>${p.text}</span>
                            </button>
                        `).join('')}
                    </div>
                ` : '<div class="bse-empty" style="padding:30px;">请先获取字幕</div>'}
            </div>
        `;

        if (hasSubtitle) {
            content.querySelectorAll('.bse-prompt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const prompt = AI_PROMPTS[parseInt(btn.dataset.index)];
                    const text = currentSubtitleData.body.map(item => item.content).join('\n');
                    GM_setClipboard(`${prompt.prompt}\n\n${text}`);
                    showToast('✓ 已复制 AI 提示词');
                });
            });
        }
    }

    // ===================== 初始化 =====================
    function init() {
        log('脚本初始化 - 纯API静默模式');
        createUI();

        // 延迟获取字幕（等待页面完全加载）
        setTimeout(() => {
            log('当前URL:', window.location.href);
            fetchAllSubtitles();
        }, 1500);
    }

    // 监听 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            log('页面切换');
            currentVideoKey = null;
            allSubtitles = [];
            currentSubtitleData = null;
            selectedSubtitleId = null;
            updateUI();
            setTimeout(() => fetchAllSubtitles(), 1500);
        }
    }).observe(document, { subtree: true, childList: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
