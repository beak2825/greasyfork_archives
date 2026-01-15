// ==UserScript==
// @name         Bilibili 字幕下载器
// @namespace    http://tampermonkey.net/
// @version      2.7.3
// @description  一键下载B站视频字幕，支持多种格式 (TXT/SRT/ASS/VTT/LRC/BCC)，支持番剧/课程/稍后再看/列表/选集批量下载。参考@indefined佬的脚本实现。
// @author       xiaoyu
// @match        *://www.bilibili.com/video/*
// @match        *://bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/ss*
// @match        *://www.bilibili.com/bangumi/play/ep*
// @match        *://www.bilibili.com/cheese/play/ss*
// @match        *://www.bilibili.com/cheese/play/ep*
// @match        *://www.bilibili.com/list/*
// @match        *://www.bilibili.com/list/watchlater*
// @match        *://www.bilibili.com/medialist/play/watchlater/*
// @match        *://www.bilibili.com/medialist/play/ml*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560698/Bilibili%20%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560698/Bilibili%20%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // DEBUG SETTINGS
    // =========================================================================
    // 设置为 true 可在控制台输出详细调试日志
    const DEBUG = false;

    // 调试日志函数（仅在 DEBUG 模式下输出）
    function debugLog(...args) {
        if (DEBUG) console.log('[Bilibili 字幕下载器 DEBUG]', ...args);
    }

    // =========================================================================
    // CONFIGURATION & CONSTANTS
    // =========================================================================
    const CONFIG = {
        api: {
            view: 'https://api.bilibili.com/x/web-interface/view',
            player: 'https://api.bilibili.com/x/player/v2',
            playerWbi: 'https://api.bilibili.com/x/player/wbi/v2',
            pgcInfo: 'https://api.bilibili.com/pgc/view/web/season',
            seriesList: 'https://api.bilibili.com/x/series/list'  // 合集/列表 API
        },
        selectors: {
            // 普通视频
            toolbar: '.video-toolbar-left',
            toolbarFallback: '.video-toolbar .ops',
            // 番剧播放器
            bangumiToolbar: '.toolbar', // 番剧工具栏
        },
        formats: ['txt', 'srt', 'ass', 'vtt', 'lrc', 'bcc']
    };

	    // Global state
	    let activeMenu = null;
	    let previewDialog = null;

	    // Subtitle language selection
	    // - "__follow__": 跟随播放器当前选择的字幕语言（尽力检测，失败则回退）
	    const SUBTITLE_LAN_FOLLOW = '__follow__';

	    // 字幕列表缓存：key = "<key>", value = { title, subtitles, timestamp }
	    // 用于避免重复请求导致的不稳定结果
	    const subtitleListCache = new Map();
	    const CACHE_TTL = 5 * 60 * 1000; // 5 分钟缓存有效期
	    const MAX_CACHE_SIZE = 50; // 最大缓存条目数，防止内存无限增长

	    // In-flight promise 缓存：防止并发点击导致多次 API 请求（字幕列表）
	    // key = "<key>", value = Promise<{title, subtitles}>
	    const inflightSubtitleListRequests = new Map();

    // =========================================================================
    // UTILITIES
    // =========================================================================

    /**
     * 清理字幕缓存，防止内存无限增长
     * 当缓存大小超过限制时，删除最旧的条目
     */
    function cleanCacheIfNeeded() {
        if (subtitleListCache.size >= MAX_CACHE_SIZE) {
            // 删除最旧的条目（Map 迭代顺序按插入顺序）
            const oldestKey = subtitleListCache.keys().next().value;
            subtitleListCache.delete(oldestKey);
            debugLog('缓存已满，删除最旧条目:', oldestKey);
        }
    }

    function formatTimeSRT(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);
        return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms, 3)}`;
    }

    function formatTimeVTT(seconds) {
        return formatTimeSRT(seconds).replace(',', '.');
    }

    function formatTimeASS(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const cs = Math.floor((seconds % 1) * 100); // centiseconds (ASS uses 2 decimals)
        return `${h}:${pad(m)}:${pad(s)}.${pad(cs)}`;
    }

    function formatTimeLRC(seconds) {
        const m = Math.floor(seconds / 60);
        const s = (seconds % 60).toFixed(2);
        return `[${pad(m)}:${s.padStart(5, '0')}]`;
    }

    function formatTimeSimple(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
        return `${pad(m)}:${pad(s)}`;
    }

    function pad(n, len = 2) {
        return n.toString().padStart(len, '0');
    }

    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, '_').substring(0, 200);
    }

    function notify(text, title = 'Bilibili 字幕下载器') {
        if (typeof GM_notification === 'function') {
            GM_notification({ text, title, timeout: 3000 });
        } else {
            debugLog(`[Subtitle Downloader] ${title}: ${text}`);
        }
    }

    /**
     * 安全的 JSON fetch，统一处理各种错误情况
     * @param {string} url - 请求 URL
     * @param {RequestInit} options - fetch 选项
     * @param {string} tag - 日志标签（如 "字幕列表" / "字幕内容"）
     * @returns {Promise<any>} - 解析后的 JSON 对象
     */
    async function fetchJsonStrict(url, options, tag) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';

        let response;
        try {
            response = await fetch(url, options);
        } catch (e) {
            console.error(`${LOG_PREFIX} ${tag}网络请求失败:`, e);
            throw new Error(`网络请求失败（可能被风控/跨域/网络异常），请刷新或重新登录后重试`);
        }

        const contentType = response.headers.get('content-type') || '';
        const finalUrl = response.url;

        if (!response.ok) {
            console.error(`${LOG_PREFIX} ${tag}请求失败:`, {
                status: response.status,
                statusText: response.statusText,
                finalUrl,
                contentType
            });
            throw new Error(`获取${tag}失败: HTTP ${response.status}`);
        }

        const text = await response.text();

        if (!text || text.trim().length === 0) {
            console.error(`${LOG_PREFIX} ${tag}响应为空:`, { finalUrl, contentType });
            throw new Error(`${tag}响应为空，请刷新页面重试`);
        }

        // 检测是否返回了 HTML 错误页
        if (text.trim().startsWith('<')) {
            console.error(`${LOG_PREFIX} ${tag}返回了HTML页面（可能未登录/风控/跳转）:`, {
                finalUrl,
                contentType,
                preview: text.substring(0, 300)
            });
            throw new Error(`${tag}返回了HTML页面（可能未登录/风控），请刷新或重新登录后重试`);
        }

        let json;
        try {
            // 移除可能的 BOM
            json = JSON.parse(text.replace(/^\uFEFF/, ''));
        } catch (e) {
            console.error(`${LOG_PREFIX} ${tag}JSON解析失败:`, {
                finalUrl,
                contentType,
                preview: text.substring(0, 300)
            });
            throw new Error(`${tag}格式异常（JSON解析失败），请刷新页面重试`);
        }

        return json;
    }

    function getPreferredFormat() {
        try {
            if (typeof GM_getValue === 'function') {
                return GM_getValue('preferredFormat', 'srt');
            }
            return localStorage.getItem('bili_sub_format') || 'srt';
        } catch {
            return 'srt';
        }
    }

	    function setPreferredFormat(format) {
	        try {
	            if (typeof GM_setValue === 'function') {
	                GM_setValue('preferredFormat', format);
	            } else {
	                localStorage.setItem('bili_sub_format', format);
	            }
	        } catch { }
	    }

	    function getPreferredSubtitleLan() {
	        try {
	            if (typeof GM_getValue === 'function') {
	                return GM_getValue('preferredSubtitleLan', SUBTITLE_LAN_FOLLOW);
	            }
	            return localStorage.getItem('bili_sub_lang') || SUBTITLE_LAN_FOLLOW;
	        } catch {
	            return SUBTITLE_LAN_FOLLOW;
	        }
	    }

	    function setPreferredSubtitleLan(lan) {
	        try {
	            if (typeof GM_setValue === 'function') {
	                GM_setValue('preferredSubtitleLan', lan);
	            } else {
	                localStorage.setItem('bili_sub_lang', lan);
	            }
	        } catch { }
	    }

	    function getHideWhenNoSubtitle() {
	        try {
	            if (typeof GM_getValue === 'function') {
	                return !!GM_getValue('hideWhenNoSubtitle', false);
	            }
	            return localStorage.getItem('bili_sub_hide_no_sub') === '1';
	        } catch {
	            return false;
	        }
	    }

	    function setHideWhenNoSubtitle(value) {
	        try {
	            if (typeof GM_setValue === 'function') {
	                GM_setValue('hideWhenNoSubtitle', !!value);
	            } else {
	                localStorage.setItem('bili_sub_hide_no_sub', value ? '1' : '0');
	            }
	        } catch { }
	    }

	    function registerMenuCommands() {
	        if (typeof GM_registerMenuCommand !== 'function') return;

	        const hideLabel = getHideWhenNoSubtitle() ? '开' : '关';
	        GM_registerMenuCommand(`[字幕下载器] 无字幕时隐藏按钮：${hideLabel}`, () => {
	            const next = !getHideWhenNoSubtitle();
	            setHideWhenNoSubtitle(next);
	            notify(`无字幕时隐藏按钮已${next ? '开启' : '关闭'}`, '设置已更新');
	            // 重新加载以便立即生效（避免 SPA 状态残留导致误判）
	            window.location.reload();
	        });
	    }

	    function getPreviewDialogRect() {
	        try {
	            if (typeof GM_getValue === 'function') {
	                return GM_getValue('previewDialogRect', null);
	            }
	            const raw = localStorage.getItem('bili_sub_preview_rect');
	            return raw ? JSON.parse(raw) : null;
	        } catch {
	            return null;
	        }
	    }

	    function setPreviewDialogRect(rect) {
	        try {
	            if (typeof GM_setValue === 'function') {
	                GM_setValue('previewDialogRect', rect);
	            } else {
	                localStorage.setItem('bili_sub_preview_rect', JSON.stringify(rect));
	            }
	        } catch { }
	    }

	    function getPreviewDialogPrefs() {
	        const defaults = { bgAlpha: 0.96, fontSize: 13 };
	        try {
	            let raw = null;
	            if (typeof GM_getValue === 'function') {
	                raw = GM_getValue('previewDialogPrefs', null);
	            } else {
	                const ls = localStorage.getItem('bili_sub_preview_prefs');
	                raw = ls ? JSON.parse(ls) : null;
	            }

	            const prefs = (raw && typeof raw === 'object') ? raw : {};
	            const bgAlpha = Number(prefs.bgAlpha);
	            const fontSize = Number(prefs.fontSize);

	            return {
	                bgAlpha: Number.isFinite(bgAlpha) ? Math.min(1, Math.max(0.2, bgAlpha)) : defaults.bgAlpha,
	                fontSize: Number.isFinite(fontSize) ? Math.min(24, Math.max(10, Math.round(fontSize))) : defaults.fontSize
	            };
	        } catch {
	            return defaults;
	        }
	    }

	    function setPreviewDialogPrefs(prefs) {
	        try {
	            if (typeof GM_setValue === 'function') {
	                GM_setValue('previewDialogPrefs', prefs);
	            } else {
	                localStorage.setItem('bili_sub_preview_prefs', JSON.stringify(prefs));
	            }
	        } catch { }
	    }

	    function mergePreviewDialogPrefs(partial) {
	        const current = getPreviewDialogPrefs();
	        const next = { ...current, ...(partial || {}) };
	        setPreviewDialogPrefs(next);
	        return next;
	    }

    // =========================================================================
    // PAGE CONTEXT DETECTION
    // =========================================================================

    function getPageType() {
        const path = window.location.pathname;
        if (path.includes('/bangumi/play/')) return 'bangumi';
        if (path.includes('/cheese/play/')) return 'cheese';
        if (path.includes('/list/')) return 'list';
        if (path.includes('/watchlater') || path.includes('/medialist/play/')) return 'medialist';
        if (path.includes('/video/')) return 'video';
        return 'unknown';
    }

    function getVideoContext() {
        const path = window.location.pathname;
        const search = window.location.search;
        const searchParams = new URLSearchParams(search);
        const pageType = getPageType();

        let ctx = {
            pageType,
            vidType: null,
            vidValue: null,
            epid: null,
            ssid: null,
            p: parseInt(searchParams.get('p') || '1', 10)
        };

        // 普通视频 BV/AV
        // 1. 先从 URL 路径中提取
        const bvMatch = path.match(/BV([a-zA-Z0-9]{10})/);
        const avMatch = path.match(/\/av(\d+)/);
        // 2. 再从查询参数中提取（适用于 watchlater/medialist 等页面）
        const bvidParam = searchParams.get('bvid');
        const aidParam = searchParams.get('aid');

        if (bvMatch) {
            ctx.vidType = 'bvid';
            ctx.vidValue = `BV${bvMatch[1]}`;
        } else if (avMatch) {
            ctx.vidType = 'aid';
            ctx.vidValue = avMatch[1];
        } else if (bvidParam) {
            // watchlater/medialist 页面：bvid 在查询参数中
            ctx.vidType = 'bvid';
            ctx.vidValue = bvidParam;
        } else if (aidParam) {
            ctx.vidType = 'aid';
            ctx.vidValue = aidParam;
        }

        // 番剧/课程 ep/ss
        const epMatch = path.match(/\/ep(\d+)/);
        const ssMatch = path.match(/\/ss(\d+)/);
        if (epMatch) ctx.epid = epMatch[1];
        if (ssMatch) ctx.ssid = ssMatch[1];

        return ctx;
    }

    /**
     * 验证 BV ID 格式是否正确
     * @param {string} bvid - 待验证的 BV ID
     * @returns {boolean} 格式是否正确
     */
    function isValidBvid(bvid) {
        if (typeof bvid !== 'string') return false;
        return /^BV[a-zA-Z0-9]{10}$/.test(bvid);
    }

    /**
     * 从 URL 中提取 list_id（列表/合集 ID）
     * @returns {string|null} 返回 list_id，失败返回 null
     */
    function extractListId() {
        const win = window.unsafeWindow || window;
        const path = window.location.pathname;

        // 1. 从 URL 路径中提取（如 /list/3546955523295422）
        const pathMatch = path.match(/\/list\/(\d+)/);
        if (pathMatch) {
            return pathMatch[1];
        }

        // 2. 从 __INITIAL_STATE__ 中提取
        if (win.__INITIAL_STATE__) {
            const state = win.__INITIAL_STATE__;

            // 尝试多种可能的数据路径
            const listIdPaths = [
                () => state.playlistData?.listId,
                () => state.playlist?.info?.list_id,
                () => state.mediaListInfo?.info?.list_id,
                () => state.mediaListInfo?.list_id,
                () => state.listId,
                () => state.seriesId,
            ];

            for (const getPath of listIdPaths) {
                try {
                    const listId = getPath();
                    if (listId) {
                        return listId;
                    }
                } catch (e) {
                    // 继续尝试下一个路径
                }
            }
        }

        return null;
    }

    /**
     * 通过 API 获取合集/列表的完整视频列表（支持分页）
     * B站列表 API 返回每页 20 个视频，需要循环获取所有页
     * @param {string} listId - 列表/合集 ID
     * @param {number} mid - 用户 mid
     * @returns {Promise<Array>} 返回视频列表数组，每个元素包含 {title, bvid, cid, page}
     */
    async function fetchFullSeriesListFromApi(listId, mid) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';
        const allVideos = [];
        const pageSize = 20;  // B站列表 API 每页返回 20 个
        let pn = 1;
        let hasMore = true;

        debugLog(`${LOG_PREFIX} [API 分页] 开始获取列表 series_id=${listId}, mid=${mid} 的完整视频列表`);

        while (hasMore) {
            try {
                // 使用正确的 API 端点：/x/series/archives
                const apiUrl = `https://api.bilibili.com/x/series/archives?mid=${mid}&series_id=${listId}&pn=${pn}&ps=${pageSize}&only_normal=true&sort=desc&_t=${Date.now()}`;
                debugLog(`${LOG_PREFIX} [API 分页] 正在获取第 ${pn} 页...`);
                debugLog(`${LOG_PREFIX} [API 分页] 请求 URL: ${apiUrl}`);

                const response = await fetchJsonStrict(apiUrl, { credentials: 'include', cache: 'no-store' }, `系列列表第${pn}页`);

                // 详细记录响应结构，用于调试
                debugLog(`${LOG_PREFIX} [API 分页] 响应 code: ${response?.code}, message: ${response?.message}`);
                debugLog(`${LOG_PREFIX} [API 分页] response.data 存在: ${!!response?.data}`);
                debugLog(`${LOG_PREFIX} [API 分页] response.data.archives 存在: ${!!response?.data?.archives}`);
                if (response?.data) {
                    debugLog(`${LOG_PREFIX} [API 分页] response.data 的键:`, Object.keys(response.data));
                }

                if (response && response.data && response.data.archives) {
                    const videos = response.data.archives;
                    const page = response.data.page;

                    if (Array.isArray(videos) && videos.length > 0) {
                        debugLog(`${LOG_PREFIX} [API 分页] 第 ${pn} 页获取到 ${videos.length} 个视频，总页数: ${page?.total || '未知'}`);

                        // 转换为标准格式
                        for (const v of videos) {
                            if (v.bvid && isValidBvid(v.bvid)) {
                                allVideos.push({
                                    title: v.title,
                                    bvid: v.bvid,
                                    cid: v.cid || null,
                                    page: 1  // 列表中的每个视频都是独立的 BV
                                });
                            }
                        }

                        // 检查是否还有更多页
                        // 如果获取到的视频数量小于 pageSize，说明是最后一页
                        if (videos.length < pageSize) {
                            hasMore = false;
                            debugLog(`${LOG_PREFIX} [API 分页] 已获取所有视频（第 ${pn} 页是最后一页）`);
                        } else {
                            pn++;
                        }
                    } else {
                        // 没有更多数据了
                        hasMore = false;
                        debugLog(`${LOG_PREFIX} [API 分页] 第 ${pn} 页没有更多数据`);
                    }
                } else {
                    hasMore = false;
                    console.warn(`${LOG_PREFIX} [API 分页] 第 ${pn} 页响应格式异常:`, response);
                }

                // 请求间隔，避免触发风控
                if (hasMore) {
                    await sleep(200);
                }

            } catch (e) {
                console.error(`${LOG_PREFIX} [API 分页] 第 ${pn} 页获取失败:`, e);
                // 如果第一页就失败，抛出错误；否则继续使用已获取的数据
                if (pn === 1) {
                    throw new Error(`无法获取列表数据: ${e.message}`);
                }
                hasMore = false;
                console.warn(`${LOG_PREFIX} [API 分页] 第 ${pn} 页失败，使用已获取的 ${allVideos.length} 个视频`);
            }
        }

        debugLog(`${LOG_PREFIX} [API 分页] 完成，共获取 ${allVideos.length} 个视频`);
        return allVideos;
    }

    /**
     * 获取视频列表数据（用于批量下载）
     * 支持两种场景：
     * 1. 列表页面 (/list/*) - 从页面数据获取合集视频列表
     * 2. 普通视频页面 (/video/BV*) - 获取多分集（P 列表）
     * @returns {Array|null} 返回视频列表数组，每个元素包含 {title, bvid, cid, page}，失败返回 null
     */
    function getVideoListData() {
        const win = window.unsafeWindow || window;
        const ctx = getVideoContext();
        const pageType = ctx.pageType;

        // 场景1: 列表页面 (/list/*)
        if (pageType === 'list') {
            debugLog('[getVideoListData] 尝试获取列表页面视频列表');
            debugLog('[getVideoListData] __INITIAL_STATE__ 存在:', !!win.__INITIAL_STATE__);

            // 优先从 __INITIAL_STATE__ 获取完整列表
            if (win.__INITIAL_STATE__) {
                const state = win.__INITIAL_STATE__;
                // 打印 state 的所有顶层键，方便调试
                const stateKeys = Object.keys(state).filter(k => !k.startsWith('_'));
                debugLog('[getVideoListData] __INITIAL_STATE__ 顶层键:', stateKeys);

                // 检查是否有 playlistData（列表页面特有）
                if (state.playlistData) {
                    debugLog('[getVideoListData] 找到 playlistData:', {
                        listId: state.playlistData.listId,
                        title: state.playlistData.title,
                        videosCount: state.playlistData.videos?.length || 0
                    });
                }

                // 详细检查 playlist 和 mediaListInfo 的结构
                if (state.playlist) {
                    debugLog('[getVideoListData] playlist 结构:', {
                        keys: Object.keys(state.playlist),
                        hasInfo: !!state.playlist.info,
                        hasVideos: !!state.playlist.videos,
                        hasSplits: !!state.playlist.splits,
                        videosCount: state.playlist.videos?.length || 0,
                        splitsCount: state.playlist.splits?.length || 0
                    });
                }

                if (state.mediaListInfo) {
                    debugLog('[getVideoListData] mediaListInfo 结构:', {
                        keys: Object.keys(state.mediaListInfo),
                        hasInfo: !!state.mediaListInfo.info,
                        hasVideos: !!state.mediaListInfo.videos,
                        hasMediaList: !!state.mediaListInfo.mediaList,
                        videosCount: state.mediaListInfo.videos?.length || 0,
                        // 打印完整对象以便调试
                        _full: JSON.stringify(state.mediaListInfo).substring(0, 500)
                    });
                }

                // 检查 resourceList（可能是分页加载的列表）
                if (state.resourceList) {
                    debugLog('[getVideoListData] resourceList 结构:', {
                        type: typeof state.resourceList,
                        isArray: Array.isArray(state.resourceList),
                        length: state.resourceList?.length || 0,
                        firstItemKeys: state.resourceList?.[0] ? Object.keys(state.resourceList[0]) : [],
                        listTotal: state.listTotal,
                        pn: state.pn
                    });
                }

                if (state.resourceListPnGroup) {
                    debugLog('[getVideoListData] resourceListPnGroup 存在:', {
                        type: typeof state.resourceListPnGroup,
                        isArray: Array.isArray(state.resourceListPnGroup),
                        length: state.resourceListPnGroup?.length || 0,
                        // 检查是否包含分页数据
                        hasPnGroups: state.resourceListPnGroup?.[0]?.pn ? true : false,
                        firstPn: state.resourceListPnGroup?.[0]?.pn
                    });
                }

                // 检查其他可能的列表数据路径
                const additionalChecks = [
                    'playlistData',
                    'playlist',
                    'videoList',
                    'mediaListInfo',
                    'favList',
                    'watchLater'
                ];
                additionalChecks.forEach(key => {
                    if (state[key]) {
                        debugLog(`[getVideoListData] 发现 ${key}:`, typeof state[key], Array.isArray(state[key]) ? `length=${state[key].length}` : '');
                    }
                });

                // 尝试所有可能的数据路径
                const paths = [
                    { name: 'resourceList', fn: () => state.resourceList },
                    { name: 'resourceListPnGroup', fn: () => state.resourceListPnGroup },
                    { name: 'mediaListInfo.videos', fn: () => state.mediaListInfo?.videos },
                    { name: 'mediaListInfo.mediaList', fn: () => state.mediaListInfo?.mediaList },
                    { name: 'mediaListInfo.info', fn: () => state.mediaListInfo?.info },
                    { name: 'playlist.videos', fn: () => state.playlist?.videos },
                    { name: 'playlist.splits', fn: () => state.playlist?.splits },
                    { name: 'playlistData.videos', fn: () => state.playlistData?.videos },
                    { name: 'videoListData.listData.archives', fn: () => state.videoListData?.listData?.archives },
                    { name: 'videoListData.listData.seasonInfo.episodes', fn: () => state.videoListData?.listData?.seasonInfo?.episodes },
                    { name: 'videoListData.listData.seasonInfo.sections', fn: () => state.videoListData?.listData?.seasonInfo?.sections },
                    { name: 'aidata.list', fn: () => state.aidata?.list },
                    { name: 'collection.detail.archives', fn: () => state.collection?.detail?.archives },
                    { name: 'season.episodes', fn: () => state.season?.episodes },
                    { name: 'mediaList.list', fn: () => state.mediaList?.list },
                    { name: 'list.listData.archives', fn: () => state.list?.listData?.archives },
                    { name: 'listData.archives', fn: () => state.listData?.archives },
                    { name: 'archives', fn: () => state.archives },
                ];

                for (const { name, fn } of paths) {
                    try {
                        const list = fn();
                        if (Array.isArray(list) && list.length > 0) {
                            // 检查第一个元素是否有 bvid
                            const firstBvid = list[0].bvid;
                            if (firstBvid && isValidBvid(firstBvid)) {
                                debugLog(`[getVideoListData] 成功从 __INITIAL_STATE__.${name} 获取列表，共 ${list.length} 个视频`);
                                return list.map(v => ({
                                    title: v.title,
                                    bvid: v.bvid,
                                    cid: v.cid || null,
                                    page: 1
                                }));
                            } else if (firstBvid) {
                                console.warn(`[getVideoListData] __INITIAL_STATE__.${name} 存在但 BV ID 格式无效: ${firstBvid}`);
                            } else {
                                debugLog(`[getVideoListData] __INITIAL_STATE__.${name} 存在但没有 bvid 字段，第一个元素:`, list[0]);
                            }
                        }
                    } catch (e) {
                        debugLog(`[getVideoListData] 路径 ${name} 访问失败:`, e.message);
                    }
                }
                console.warn('[getVideoListData] 所有 __INITIAL_STATE__ 路径均无效');
            }

            // DOM 解析作为最后备选（只使用精确的选择器）
            // 注意：B站列表页面使用虚拟滚动，DOM 只包含当前可见的视频
            const selectors = [
                { selector: '.video-list-item', name: 'video-list-item' },
                { selector: '.list-item', name: 'list-item' },
                { selector: '.video-episode-card', name: 'video-episode-card' },
                { selector: '.bili-video-card', name: 'bili-video-card' },
                { selector: '.archive-item', name: 'archive-item' },
            ];

            for (const { selector, name } of selectors) {
                try {
                    const items = document.querySelectorAll(selector);
                    if (items.length > 0) {
                        debugLog(`[getVideoListData] 从 DOM 获取列表，选择器: ${name}, 数量: ${items.length}`);
                        const results = [];
                        const seenBvids = new Set();  // 去重

                        items.forEach((item, idx) => {
                            // 获取 bvid
                            const link = item.tagName === 'A' ? item : item.querySelector('a[href*="/video/"]');
                            const bvidMatch = link?.href?.match(/\/video\/(BV[a-zA-Z0-9]{10})/);
                            const bvid = bvidMatch ? `BV${bvidMatch[1]}` : null;

                            // 验证 BV ID 格式
                            if (bvid && isValidBvid(bvid) && !seenBvids.has(bvid)) {
                                seenBvids.add(bvid);
                                // 获取标题
                                const titleEl = item.querySelector('.title, .video-title, .bili-video-card__info--tit, a');
                                const title = titleEl?.textContent?.trim() || titleEl?.getAttribute('title') || `视频${results.length + 1}`;

                                results.push({
                                    title: title,
                                    bvid: bvid,
                                    cid: null,  // 需要后续通过 API 获取
                                    page: 1
                                });
                            }
                        });

                        if (results.length > 0) {
                            console.warn(`[getVideoListData] DOM 解析成功但可能不完整（虚拟滚动限制），共 ${results.length} 个视频`);
                            return results;
                        }
                    }
                } catch (e) {
                    console.warn(`[getVideoListData] 选择器 ${name} 解析失败:`, e);
                }
            }

            console.error('[getVideoListData] 无法从任何数据源获取列表页面视频列表');
            return null;
        }

        // 场景2: 普通视频页面 - 检查是否有多个分集
        if (pageType === 'video') {
            debugLog('[getVideoListData] video 类型页面，检查是否有分集');

            // 2a. 首先检查是否有 UGC 合集（多个独立的 BV 号）
            // 合集数据在 sectionsInfo.sections[].episodes[] 中
            if (win.__INITIAL_STATE__?.sectionsInfo?.sections) {
                const sections = win.__INITIAL_STATE__.sectionsInfo.sections;
                debugLog(`[getVideoListData] 找到 sectionsInfo，共 ${sections.length} 个 section`);

                // 收集所有 section 中的 episodes
                const allEpisodes = [];
                for (const section of sections) {
                    if (section.episodes && Array.isArray(section.episodes)) {
                        allEpisodes.push(...section.episodes);
                    }
                }

                if (allEpisodes.length > 1) {
                    debugLog(`[getVideoListData] 检测到 UGC 合集，共 ${allEpisodes.length} 个视频`);
                    return allEpisodes.map((ep, idx) => ({
                        title: ep.title || `视频${idx + 1}`,
                        bvid: ep.bvid,
                        cid: ep.cid,
                        // 合集视频每个都是独立的 BV 号，不需要 page 参数
                        // ep.page 是一个对象，不是数字，所以直接传 1（或 null）
                        page: 1
                    }));
                }
            }

            // 2b. 检查是否有普通多P视频（同一个 BV 号，多个分集）
            if (win.__INITIAL_STATE__?.videoData?.pages) {
                const pages = win.__INITIAL_STATE__.videoData.pages;
                debugLog(`[getVideoListData] 找到 pages 数据，共 ${pages.length} 个分集`);
                if (pages.length > 1) {
                    const videoData = win.__INITIAL_STATE__.videoData;
                    debugLog(`[getVideoListData] 检测到 ${pages.length} 个分集，bvid=${videoData.bvid}`);
                    return pages.map((p, idx) => ({
                        title: p.part || `P${idx + 1}`,
                        bvid: videoData.bvid,
                        cid: p.cid,
                        page: p.page || idx + 1
                    }));
                }
            } else {
                debugLog('[getVideoListData] __INITIAL_STATE__.videoData.pages 不存在');
            }
            debugLog('[getVideoListData] 视频只有一个分集，不是列表');
            return null;  // 只有一个分集，不算列表
        }

        debugLog(`[getVideoListData] 未知的页面类型: ${pageType}`);
        return null;
    }

    /**
     * 获取列表标题（用于批量下载文件名）
     * @returns {string} 列表标题
     */
    function getListTitle() {
        const win = window.unsafeWindow || window;
        const ctx = getVideoContext();

        // 列表页面
        if (ctx.pageType === 'list') {
            if (win.__INITIAL_STATE__?.videoListData?.listData?.info?.title) {
                return win.__INITIAL_STATE__.videoListData.listData.info.title;
            }
            if (win.__INITIAL_STATE__?.aidata?.listTitle) {
                return win.__INITIAL_STATE__.aidata.listTitle;
            }
            // 从页面标题提取
            const titleMatch = document.title.match(/^(.+?)\s*[-_]\s*哔哩哔哩/);
            return titleMatch ? titleMatch[1] : document.title;
        }

        // 普通视频页面（选集/合集）
        if (ctx.pageType === 'video') {
            // 优先使用合集标题
            if (win.__INITIAL_STATE__?.sectionsInfo?.title) {
                return win.__INITIAL_STATE__.sectionsInfo.title;
            }
            // 其次使用视频标题
            if (win.__INITIAL_STATE__?.videoData?.title) {
                return win.__INITIAL_STATE__.videoData.title;
            }
        }

        return document.title.replace(' - 哔哩哔哩', '').replace('_哔哩哔哩_bilibili', '');
    }

	    // =========================================================================
	    // CORE LOGIC: API & DATA
	    // =========================================================================

	    async function getSubtitleListData() {
	        const ctx = getVideoContext();
	        const pageType = ctx.pageType;

	        if (pageType === 'bangumi' || pageType === 'cheese') {
	            return getBangumiSubtitleList(ctx);
	        }
	        return getVideoSubtitleList(ctx);
	    }

	    function getCurrentPlayerSubtitleHint() {
	        // 2.x 播放器：选择器里会有 active 项（无需面板打开）
	        const buiActive = document.querySelector('li.bui-select-item-active[data-value]');
	        if (buiActive?.dataset?.value) {
	            return {
	                lan: buiActive.dataset.value,
	                lan_doc: buiActive.textContent?.trim() || undefined
	            };
	        }

	        // 3.x/4.x 播放器：语言项通常带 data-lan（class 可能有 active/selected，或 aria-*）
	        const bpxItems = Array.from(document.querySelectorAll('.bpx-player-ctrl-subtitle-language-item[data-lan]'));
	        if (bpxItems.length > 0) {
	            const active = bpxItems.find(el =>
	                el.getAttribute('aria-selected') === 'true' ||
	                el.getAttribute('aria-checked') === 'true' ||
	                el.classList.contains('active') ||
	                el.classList.contains('selected') ||
	                String(el.className).includes('active') ||
	                String(el.className).includes('selected')
	            );
	            if (active?.dataset?.lan) {
	                return {
	                    lan: active.dataset.lan,
	                    lan_doc: active.textContent?.trim() || undefined
	                };
	            }
	        }

	        // 旧版播放器会保存到 localStorage
	        try {
	            const raw = localStorage.getItem('bilibili_player_settings');
	            if (raw) {
	                const settings = JSON.parse(raw);
	                const lan = settings?.subtitle?.lan;
	                if (typeof lan === 'string' && lan) return { lan };
	            }
	        } catch { }

	        // 页面 playinfo 有时也会带当前字幕语言（不同播放器版本字段名可能不同）
	        const win = window.unsafeWindow || window;
	        const playinfoLan = win.__playinfo__?.data?.subtitle?.lan || win.__playinfo__?.data?.subtitle?.lang;
	        if (typeof playinfoLan === 'string' && playinfoLan) return { lan: playinfoLan };

	        return null;
	    }

	    function pickSubtitle(subtitles, preferredLan) {
	        if (!Array.isArray(subtitles) || subtitles.length === 0) {
	            throw new Error('该视频没有可用的字幕');
	        }

	        // 1) 手动指定某语言
	        if (preferredLan && preferredLan !== SUBTITLE_LAN_FOLLOW) {
	            const found = subtitles.find(s => s.lan === preferredLan);
	            if (found) return found;
	        }

	        // 2) 跟随播放器当前选择
	        if (!preferredLan || preferredLan === SUBTITLE_LAN_FOLLOW) {
	            const hint = getCurrentPlayerSubtitleHint();
	            if (hint?.lan) {
	                const byLan = subtitles.find(s => s.lan === hint.lan);
	                if (byLan) return byLan;
	            }
	            if (hint?.lan_doc) {
	                const byDoc = subtitles.find(s => s.lan_doc === hint.lan_doc);
	                if (byDoc) return byDoc;
	            }
	        }

	        // 3) 回退策略：中文人工 > 中文AI > 第一个
	        let selectedSub = subtitles.find(s => ['zh-Hans', 'zh-CN', 'zh'].includes(s.lan));
	        if (!selectedSub) selectedSub = subtitles.find(s => s.lan === 'ai-zh');
	        if (!selectedSub) selectedSub = subtitles[0];
	        return selectedSub;
	    }

	    async function getSubtitleData(options = {}) {
	        const preferredLan = options.preferredLan ?? getPreferredSubtitleLan();
	        const list = await getSubtitleListData();
	        const selectedSub = pickSubtitle(list.subtitles, preferredLan);
	        return formatSubtitleResult(list.subtitles, selectedSub, list.title);
	    }

	    async function getVideoSubtitleList(ctx) {

	        const win = window.unsafeWindow || window;

	        // =========================================================================
	        // 策略变更：优先从页面数据获取 aid/cid，与 indefined 脚本保持一致
        // 这样可以避免 API 返回错误视频的字幕问题
        // =========================================================================

	        let aid, cid, bvid;
	        let videoTitle;

        // 方法1: 从 playerRaw.getManifest() 获取（最可靠，与当前播放内容一致）
        if (win.playerRaw?.getManifest) {
            try {
                const manifest = win.playerRaw.getManifest();
                if (manifest?.cid && manifest?.aid) {
                    aid = manifest.aid;
                    cid = manifest.cid;
                }
            } catch (e) {
                // playerRaw.getManifest() 不可用，忽略
            }
        }

        // 方法2: 从 window 全局变量获取
	        if (!cid && win.cid && (win.aid || win.bvid)) {
	            cid = win.cid;
	            aid = win.aid;
	            bvid = win.bvid;
	        }

        // 方法3: 从 __INITIAL_STATE__ 获取
	        if (!cid && win.__INITIAL_STATE__) {
	            const state = win.__INITIAL_STATE__;
	            if (state.videoData) {
	                aid = state.videoData.aid;
	                bvid = state.videoData.bvid;
	                const pages = state.videoData.pages || [];
	                const pageIdx = (state.p || ctx.p || 1) - 1;
	                if (pages[pageIdx]) {
	                    cid = pages[pageIdx].cid;
	                }
	                if (state.videoData.title) {
	                    videoTitle = pages.length > 1
	                        ? `${state.videoData.title}_P${(state.p || ctx.p || 1)}_${pages[pageIdx]?.part || ''}`
	                        : state.videoData.title;
	                }
	            }
	        }

	        // 方法4: 备选 - 使用 View API（仅当页面数据都无法获取时）
	        if (!cid || !aid) {
	            // 允许从页面全局 bvid/aid 兜底（如 watchlater SPA 场景）
	            const vidType = ctx.vidType || (bvid ? 'bvid' : aid ? 'aid' : null);
	            const vidValue = ctx.vidValue || bvid || aid || null;
	            if (!vidType || !vidValue) throw new Error("无法识别视频ID (非BV/AV链接)");

	            const viewUrl = `${CONFIG.api.view}?${vidType}=${vidValue}&_t=${Date.now()}`;
	            const viewRes = await fetch(viewUrl, { credentials: 'include', cache: 'no-store' }).then(r => r.json());

	            if (viewRes.code !== 0) throw new Error(`获取视频信息失败: ${viewRes.message}`);

	            aid = viewRes.data.aid;
	            bvid = viewRes.data.bvid;
	            const pages = viewRes.data.pages || [];
	            const pageIdx = ctx.p - 1;

            if (pageIdx < 0 || pageIdx >= pages.length) {
                throw new Error(`无法找到 P${ctx.p} 的信息`);
            }
            cid = pages[pageIdx].cid;
	            videoTitle = pages.length > 1
	                ? `${viewRes.data.title}_P${ctx.p}_${pages[pageIdx].part}`
	                : viewRes.data.title;
	        }

	        // 如果还没有 videoTitle，从 View API 获取
	        if (!videoTitle) {
	            const vidType = ctx.vidType || (bvid ? 'bvid' : aid ? 'aid' : null);
	            const vidValue = ctx.vidValue || bvid || aid || null;
	            if (vidType && vidValue) {
	                const viewUrl = `${CONFIG.api.view}?${vidType}=${vidValue}`;
	                const viewRes = await fetch(viewUrl, { credentials: 'include' }).then(r => r.json());
	                if (viewRes.code === 0) {
	                    const pages = viewRes.data.pages || [];
	                    videoTitle = pages.length > 1
	                        ? `${viewRes.data.title}_P${ctx.p}_${pages[ctx.p - 1]?.part || ''}`
	                        : viewRes.data.title;
	                }
	            }
	            if (!videoTitle) {
	                videoTitle = document.title.replace(' - 哔哩哔哩', '').replace('_哔哩哔哩_bilibili', '');
	            }
	        }

	        // 2. 检查缓存 - 避免重复请求导致的不稳定结果
	        const cacheKey = `${aid || bvid || ctx.vidValue || 'unknown'}_${cid}`;
	        const cached = subtitleListCache.get(cacheKey);
	        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
	            return {
	                title: videoTitle || cached.title,
	                subtitles: cached.subtitles
	            };
	        }

	        // 3. 检查是否有正在进行的请求（防止并发点击）
	        if (inflightSubtitleListRequests.has(cacheKey)) {
	            return inflightSubtitleListRequests.get(cacheKey).then(result => ({
	                ...result,
	                title: videoTitle || result.title
	            }));
	        }

	        // 4. 创建获取字幕的 Promise 并缓存
		        const fetchPromise = (async () => {
		            try {
		                let subtitles = null;
		                // __playinfo__ 若明确给出 subtitles: []，通常可以认为“本视频无字幕”（避免调用可能失败的 wbi 接口）
		                let playinfoSaysNoSubtitles = false;

	                // =========================================================================
	                // 4a. 优先从页面嵌入数据获取字幕（与 indefined 脚本策略一致）
	                // 页面嵌入数据来自播放器当前加载的内容，比 API 更可靠
	                // =========================================================================

                // 方法1: window.player.getSubtitleList() - 最可靠，是播放器当前的字幕列表
                if (win.player?.getSubtitleList) {
                    try {
                        const playerSubs = win.player.getSubtitleList();
                        if (Array.isArray(playerSubs) && playerSubs.length > 0) {
                            const validPlayerSubs = playerSubs.filter(s =>
                                (s.subtitle_url || s.url) && typeof (s.subtitle_url || s.url) === 'string'
                            ).map(s => ({
                                ...s,
                                subtitle_url: s.subtitle_url || s.url
                            }));
                            if (validPlayerSubs.length > 0) {
                                subtitles = validPlayerSubs;
                            }
                        }
                    } catch (e) {
                        // player.getSubtitleList() 不可用，忽略
                    }
	                }

	                // 方法2: window.__playinfo__ - 页面初始化数据
	                if (!subtitles) {
	                    const embedded = win.__playinfo__?.data?.subtitle?.subtitles;
	                    if (Array.isArray(embedded)) {
	                        if (embedded.length === 0) {
	                            playinfoSaysNoSubtitles = true;
	                        } else {
	                            const validEmbedded = embedded.filter(s => s.subtitle_url && typeof s.subtitle_url === 'string');
	                            if (validEmbedded.length > 0) {
	                                subtitles = validEmbedded;
	                            }
	                        }
	                    }
	                }

	                // playinfo 已明确给出 subtitles: []，可直接判定无字幕
	                if (!subtitles && playinfoSaysNoSubtitles) {
	                    throw new Error('该视频没有可用的字幕');
	                }

		                // 4b. 如果页面嵌入数据没有字幕，使用 Player API（备选方案）
		                // 使用 /wbi/v2 版本（与 indefined 脚本一致）
		                if (!subtitles) {
	                    if (!aid) throw new Error('无法获取 aid，无法请求字幕列表');
	                    // 使用 aid + cid 组合请求，使用 wbi 版本 API
	                    const playerUrl = `${CONFIG.api.playerWbi}?aid=${aid}&cid=${cid}`;
	                    const playerRes = await fetchJsonStrict(playerUrl, { credentials: 'include' }, '字幕列表');

                    if (playerRes.code !== 0) {
                        throw new Error(`获取字幕列表失败: ${playerRes.message}`);
                    }

                    const candidateSubtitles = playerRes.data?.subtitle?.subtitles;

                    if (!Array.isArray(candidateSubtitles) || candidateSubtitles.length === 0) {
                        throw new Error('该视频没有可用的字幕');
                    }

                    // 过滤出有效的字幕 URL（不再校验 aid，信任 API 返回）
                    const validSubs = candidateSubtitles.filter(s =>
                        s.subtitle_url && typeof s.subtitle_url === 'string'
                    );

                    if (validSubs.length === 0) {
                        throw new Error('字幕 URL 无效');
                    }

                    subtitles = validSubs;
                }

	                // 5. Select Best Subtitle (prefer Manual Chinese > AI Chinese > first)
	                // 确保选中的字幕有有效的 subtitle_url
	                const validSubtitles = subtitles.filter(s => s.subtitle_url && typeof s.subtitle_url === 'string');
	                if (validSubtitles.length === 0) {
	                    throw new Error('所有字幕的 URL 都无效');
	                }

	                // 6. 缓存字幕列表
	                cleanCacheIfNeeded(); // 清理过期/多余的缓存
	                subtitleListCache.set(cacheKey, {
	                    title: videoTitle,
	                    subtitles: validSubtitles,
	                    timestamp: Date.now()
	                });

	                return { title: videoTitle, subtitles: validSubtitles };
	            } finally {
	                // 请求完成后移除 in-flight 标记
	                inflightSubtitleListRequests.delete(cacheKey);
	            }
	        })();

	        // 缓存 in-flight promise
	        inflightSubtitleListRequests.set(cacheKey, fetchPromise);

	        return fetchPromise;
	    }

    // 辅助函数：下载并格式化字幕结果
    async function formatSubtitleResult(subtitles, selectedSub, videoTitle) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';

        // Download Content - 使用统一的安全 fetch
        let subUrl = selectedSub.subtitle_url;
        if (subUrl.startsWith('//')) subUrl = 'https:' + subUrl;

        const subContentRes = await fetchJsonStrict(subUrl, { cache: 'no-store' }, '字幕内容');

        if (!subContentRes.body || !Array.isArray(subContentRes.body)) {
            console.error(`${LOG_PREFIX} 字幕内容格式异常:`, subContentRes);
            throw new Error('字幕内容格式异常，请刷新页面重试');
        }

        return {
            title: videoTitle,
            language: selectedSub.lan_doc,
            lan: selectedSub.lan,
            body: subContentRes.body,
            allSubtitles: subtitles
        };
    }

	    async function getBangumiSubtitleList(ctx) {
	        // 尝试从页面全局变量获取信息
	        const win = window.unsafeWindow || window;
	        let epInfo = null;
	        let videoTitle = document.title.replace(/_哔哩哔哩.*$/, '');

	        // 核心修复：优先使用 URL 中的 epid，因为它是最可靠的来源
	        // window.ep_id 可能在播放器状态变化时被污染
	        const currentEpId = ctx.epid;

	        // 如果 URL 没有 epid（如 /ss 页面），才使用 window.ep_id
	        // 但需要额外验证
	        let fallbackEpId = null;
	        if (!currentEpId && win.ep_id) {
	            fallbackEpId = win.ep_id;
	        }

	        const targetEpId = currentEpId || fallbackEpId;

	        // 辅助函数：从列表中精确匹配 epid（兼容 id 和 ep_id 两种字段名）
	        const findEpById = (list, epid) => {
	            if (!Array.isArray(list) || !epid) return null;
	            return list.find(ep =>
	                String(ep.id) === String(epid) ||
	                String(ep.ep_id) === String(epid)
	            );
	        };

	        // 从 __INITIAL_STATE__ 获取
	        if (win.__INITIAL_STATE__) {
	            const state = win.__INITIAL_STATE__;
	            // 优先从 epList 中精确匹配当前 epid，避免 SPA 导航后 epInfo 过期
	            if (targetEpId && state.epList) {
	                epInfo = findEpById(state.epList, targetEpId);
	            }
	            // 如果 epList 没找到，检查 epInfo 是否匹配当前 epid
	            if (!epInfo && state.epInfo) {
	                const epInfoId = state.epInfo.id || state.epInfo.ep_id;
	                if (!targetEpId || String(epInfoId) === String(targetEpId)) {
	                    epInfo = state.epInfo;
	                }
	            }
	            if (state.mediaInfo?.title) {
	                videoTitle = state.mediaInfo.title;
	                if (epInfo?.titleFormat) videoTitle += `_${epInfo.titleFormat}`;
	            }
	        }

	        // 从 __NEXT_DATA__ 获取 (新版页面)
	        if (!epInfo && win.__NEXT_DATA__?.props?.pageProps) {
	            const pageProps = win.__NEXT_DATA__.props.pageProps;
	            const episodes = pageProps.dehydratedState?.queries
	                ?.find(q => q.queryKey?.[0] === 'pgc/view/web/season')
	                ?.state?.data?.seasonInfo?.mediaInfo?.episodes;
	            if (targetEpId) {
	                epInfo = findEpById(episodes, targetEpId);
	            }
	        }

	        let cid, aid, bvid;
	        if (epInfo) {
	            cid = epInfo.cid;
	            aid = epInfo.aid;
	            bvid = epInfo.bvid;
	        } else if (win.cid) {
	            // 全局变量作为后备，但需要严格验证
	            // 只有当 URL 没有 epid 时才允许使用全局变量
	            if (!ctx.epid) {
	                cid = win.cid;
	                aid = win.aid;
	                bvid = win.bvid;
	            }
	        }

	        if (!cid) throw new Error("无法获取番剧CID信息，请刷新页面重试");

	        const cacheKey = `pgc_${aid || bvid || ctx.epid || ctx.ssid || 'unknown'}_${cid}`;
	        const cached = subtitleListCache.get(cacheKey);
	        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
	            return {
	                title: videoTitle || cached.title,
	                subtitles: cached.subtitles
	            };
	        }

	        if (inflightSubtitleListRequests.has(cacheKey)) {
	            return inflightSubtitleListRequests.get(cacheKey).then(result => ({
	                ...result,
	                title: videoTitle || result.title
	            }));
	        }

	        const fetchPromise = (async () => {
	            try {
	                // Get subtitle via player API - 使用统一的安全 fetch
	                const params = new URLSearchParams();
	                if (cid) params.set('cid', cid);
	                if (ctx.epid) params.set('ep_id', ctx.epid);
	                if (aid) params.set('aid', aid);
	                if (bvid) params.set('bvid', bvid);
	                params.set('_t', Date.now().toString());

	                const playerUrl = `${CONFIG.api.player}?${params.toString()}`;
	                const playerRes = await fetchJsonStrict(playerUrl, { credentials: 'include', cache: 'no-store' }, '字幕列表(番剧)');

	                if (playerRes.code !== 0) throw new Error(`获取字幕列表失败: ${playerRes.message}`);

	                const subtitles = playerRes.data?.subtitle?.subtitles;
	                if (!Array.isArray(subtitles) || subtitles.length === 0) {
	                    throw new Error("该视频没有可用的字幕");
	                }

	                const validSubtitles = subtitles.filter(s => s.subtitle_url && typeof s.subtitle_url === 'string');
	                if (validSubtitles.length === 0) {
	                    throw new Error('所有字幕的 URL 都无效');
	                }

	                cleanCacheIfNeeded(); // 清理过期/多余的缓存
	                subtitleListCache.set(cacheKey, {
	                    title: videoTitle,
	                    subtitles: validSubtitles,
	                    timestamp: Date.now()
	                });

	                return { title: videoTitle, subtitles: validSubtitles };
	            } finally {
	                inflightSubtitleListRequests.delete(cacheKey);
	            }
	        })();

	        inflightSubtitleListRequests.set(cacheKey, fetchPromise);
	        return fetchPromise;
	    }

    // =========================================================================
    // FORMAT ENCODERS
    // =========================================================================

    const Generators = {
        txt: (body) => body.map(item => item.content).join('\n'),

        srt: (body) => body.map((item, i) =>
            `${i + 1}\r\n${formatTimeSRT(item.from)} --> ${formatTimeSRT(item.to)}\r\n${item.content}\r\n`
        ).join('\r\n'),

        vtt: (body) => 'WEBVTT\r\n\r\n' + body.map((item, i) =>
            `${i + 1}\r\n${formatTimeVTT(item.from)} --> ${formatTimeVTT(item.to)}\r\n${item.content}`
        ).join('\r\n\r\n'),

        ass: (body, title) => {
            const head = [
                '[Script Info]',
                `Title: ${title || 'Bilibili Subtitle'}`,
                'ScriptType: v4.00+',
                'Collisions: Reverse',
                'PlayResX: 1280',
                'PlayResY: 720',
                'WrapStyle: 0',
                'ScaledBorderAndShadow: yes',
                '',
                '[V4+ Styles]',
                'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
                'Style: Default,Microsoft YaHei,48,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,1,2,1,2,30,30,20,1',
                '',
                '[Events]',
                'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text'
            ];
            const events = body.map(item => {
                // 转义 ASS 控制字符，防止格式注入
                // 使用全角花括号替换半角，避免被播放器解析为格式代码
                const safeContent = item.content
                    .replace(/\{/g, '｛')
                    .replace(/\}/g, '｝')
                    .replace(/\\/g, '＼')
                    .replace(/\n/g, '\\N');
                return `Dialogue: 0,${formatTimeASS(item.from)},${formatTimeASS(item.to)},Default,,0,0,0,,${safeContent}`;
            });
            return head.concat(events).join('\r\n');
        },

        lrc: (body) => body.map(item =>
            `${formatTimeLRC(item.from)} ${item.content.replace(/\n/g, ' ')}`
        ).join('\r\n'),

        bcc: (body) => JSON.stringify({ body }, null, 2),

        timestamp: (body) => body.map(item =>
            `[${formatTimeSimple(item.from)}] ${item.content}`
        ).join('\n')
    };

    /**
     * 批量字幕格式生成器 - 用于列表/选集字幕合并下载
     * 格式：LRC 格式 + 视频标题分隔线
     * @param {Array} videos - 视频列表，每个元素包含 {title, subtitles, hasSubtitle}
     * @returns {string} 合并后的字幕内容
     */
    function generateBatchLrc(videos) {
        const lines = [];

        videos.forEach((video, idx) => {
            // 每个视频都添加标题分隔线（包括第一个视频）
            if (idx > 0) {
                lines.push('');
            }
            lines.push(`===== ${sanitizeFilename(video.title)} =====`);
            lines.push('');

            // 处理字幕内容
            if (video.hasSubtitle && video.subtitles && video.subtitles.length > 0) {
                // 有字幕：添加 LRC 格式字幕
                video.subtitles.forEach(item => {
                    lines.push(`${formatTimeLRC(item.from)} ${item.content.replace(/\n/g, ' ')}`);
                });
            } else {
                // 无字幕：添加占位文本
                lines.push('[该视频无字幕]');
            }
        });

        return lines.join('\r\n');
    }

    function getFileExtension(format) {
        const extMap = { timestamp: 'txt', bcc: 'json' };
        return extMap[format] || format;
    }

    // =========================================================================
    // DOWNLOAD & PREVIEW
    // =========================================================================

	    async function startDownload(format, preview = false, preferredLan = undefined) {
	        const btn = document.getElementById('bili-sub-dl-btn');
	        const originalColor = btn ? btn.style.color : '#61666d';
	        if (btn) btn.style.color = '#00AEEC'; // 加载时变蓝色

	        try {
	            const data = await getSubtitleData({ preferredLan });
	            const generator = Generators[format];
	            const content = format === 'ass' ? generator(data.body, data.title) : generator(data.body);
	            const ext = getFileExtension(format);
	            const filename = `${sanitizeFilename(data.title)}.${ext}`;

            setPreferredFormat(format);

            if (preview) {
                showPreviewDialog(content, filename, format, data);
            } else {
                downloadContent(content, filename, data.language);
            }

        } catch (e) {
            console.error(e);
            notify(e.message, '下载失败');
        } finally {
            if (btn) btn.style.color = originalColor;
        }
    }

    /**
     * 批量下载列表/选集字幕
     * 将所有视频的字幕合并到一个 .txt 文件中（LRC 格式）
     * @param {string} preferredLan - 首选字幕语言
     */
    async function downloadListSubtitles(preferredLan = undefined) {
        const btn = document.getElementById('bili-sub-dl-btn');
        const originalColor = btn ? btn.style.color : '#61666d';
        if (btn) btn.style.color = '#00AEEC';

        try {
            // 1. 获取视频列表
            let videoList = getVideoListData();

            // 对于 list 页面，尝试通过 API 获取完整的分页数据
            const ctx = getVideoContext();
            if (ctx.pageType === 'list') {
                const listId = extractListId();
                if (listId) {
                    // 获取 mid（用户 ID）- 尝试多个可能的路径
                    const win = window.unsafeWindow || window;
                    const state = win.__INITIAL_STATE__ || {};

                    // 尝试多个可能的 mid 路径
                    const midPaths = [
                        () => state.mediaListInfo?.mid,
                        () => state.userInfo?.mid,
                        () => state.upInfo?.mid,
                        () => state.owner?.mid,
                        () => state.mediaListInfo?.info?.mid,
                        () => state.mediaListInfo?.owner?.mid,
                    ];

                    let mid = null;
                    for (const getMid of midPaths) {
                        try {
                            const m = getMid();
                            if (m && typeof m === 'number' && m > 0) {
                                mid = m;
                                break;
                            }
                        } catch (e) {
                            // 继续尝试下一个路径
                        }
                    }

                    debugLog(`[Bilibili 字幕下载器] list 页面 mid 获取结果: ${mid || '未找到'}`);
                    if (!mid) {
                        // 打印 state 结构用于调试
                        debugLog(`[Bilibili 字幕下载器] __INITIAL_STATE__ 结构:`, {
                            hasMediaListInfo: !!state.mediaListInfo,
                            mediaListInfoKeys: state.mediaListInfo ? Object.keys(state.mediaListInfo) : [],
                            hasUserInfo: !!state.userInfo,
                            userInfoKeys: state.userInfo ? Object.keys(state.userInfo) : [],
                            hasUpInfo: !!state.upInfo,
                            upInfoKeys: state.upInfo ? Object.keys(state.upInfo) : [],
                        });
                    }

                    // 检查获取到的 mid 是否有效（应该是用户 ID，不是列表 ID）
                    // 列表 ID 通常是很大的数字（如 3546955523295422），而用户 mid 通常是较小的数字
                    const isValidMid = mid && typeof mid === 'number' && mid > 0 && mid < 10000000000000;
                    debugLog(`[Bilibili 字幕下载器] mid 有效性检查: mid=${mid}, isValidMid=${isValidMid}`);

                    if (isValidMid) {
                        debugLog(`[Bilibili 字幕下载器] 检测到 list 页面，list_id=${listId}, mid=${mid}，尝试通过 API 获取完整列表`);
                        try {
                            videoList = await fetchFullSeriesListFromApi(listId, mid);
                            debugLog(`[Bilibili 字幕下载器] API 返回完整列表，共 ${videoList.length} 个视频`);
                        } catch (e) {
                            console.warn(`[Bilibili 字幕下载器] API 获取完整列表失败，使用缓存数据:`, e);
                            // 使用 getVideoListData() 的结果作为备选
                            if (!videoList || videoList.length === 0) {
                                throw new Error(`无法获取列表数据: ${e.message}`);
                            }
                            console.warn(`[Bilibili 字幕下载器] 使用缓存数据，共 ${videoList.length} 个视频（可能不完整）`);
                        }
                    } else {
                        console.warn(`[Bilibili 字幕下载器] 无法获取 mid，使用缓存数据`);
                    }
                } else {
                    console.warn(`[Bilibili 字幕下载器] 无法从 URL 提取 list_id，使用缓存数据`);
                }
            }

            if (!videoList || videoList.length === 0) {
                throw new Error('无法获取视频列表');
            }

            const listTitle = getListTitle();
            const LOG_PREFIX = '[Bilibili 字幕下载器]';

            notify(`正在下载 ${videoList.length} 个视频的字幕，请稍候...`, '批量下载');
            debugLog(`${LOG_PREFIX} 开始批量下载，共 ${videoList.length} 个视频`);

            // 2. 遍历视频列表，获取字幕
            const results = [];
            let successCount = 0;
            let noSubtitleCount = 0;
            let errorCount = 0;

            for (let i = 0; i < videoList.length; i++) {
                const video = videoList[i];
                debugLog(`${LOG_PREFIX} [${i + 1}/${videoList.length}] 正在处理: ${video.title}`);

                try {
                    // 统一使用 fetchVideoSubtitleByBvid
                    // 对于选集分集，传入 page 参数；对于列表视频，不传 page
                    const page = video.page || null;
                    const subtitleData = await fetchVideoSubtitleByBvid(video.bvid, video.cid, preferredLan, page);

                    if (subtitleData && subtitleData.body && subtitleData.body.length > 0) {
                        results.push({
                            title: video.title,
                            subtitles: subtitleData.body,
                            hasSubtitle: true
                        });
                        successCount++;
                        debugLog(`${LOG_PREFIX} [${i + 1}/${videoList.length}] ✓ ${video.title} - 字幕获取成功`);
                    } else {
                        // 无字幕视频也要保留占位
                        results.push({
                            title: video.title,
                            subtitles: null,
                            hasSubtitle: false
                        });
                        noSubtitleCount++;
                        debugLog(`${LOG_PREFIX} [${i + 1}/${videoList.length}] - ${video.title} - 无字幕`);
                    }

                    // 请求间隔，避免触发风控
                    if (i < videoList.length - 1) {
                        await sleep(300);  // 300ms 间隔
                    }

                } catch (e) {
                    console.error(`${LOG_PREFIX} [${i + 1}/${videoList.length}] ✗ ${video.title} - 获取失败:`, e);
                    // 失败的视频也保留占位
                    results.push({
                        title: video.title,
                        subtitles: null,
                        hasSubtitle: false
                    });
                    errorCount++;
                }
            }

            // 3. 检查是否有任何字幕
            const hasAnySubtitle = results.some(r => r.hasSubtitle);
            if (!hasAnySubtitle) {
                throw new Error('没有下载到任何字幕，请检查视频是否包含字幕');
            }

            // 4. 生成合并字幕内容
            const content = generateBatchLrc(results);
            const filename = `${sanitizeFilename(listTitle)}_字幕合集.txt`;

            // 5. 下载文件
            downloadContent(content, filename, 'txt');

            // 6. 完成提示
            const resultMsg = `批量下载完成！成功: ${successCount} 个` +
                (noSubtitleCount > 0 ? `，无字幕: ${noSubtitleCount} 个` : '') +
                (errorCount > 0 ? `，失败: ${errorCount} 个` : '');
            notify(resultMsg, '下载完成');
            debugLog(`${LOG_PREFIX} 批量下载完成: ${resultMsg}`);

        } catch (e) {
            console.error('[Bilibili 字幕下载器] 批量下载失败:', e);
            notify(e.message, '批量下载失败');
        } finally {
            if (btn) btn.style.color = originalColor;
        }
    }

    /**
     * 通过 bvid 获取视频字幕（统一用于列表页面和选集分集）
     *
     * 重要：B站的 Player API 通过 cid 来区分不同分集，而不是 p 参数！
     * 每个分集都有自己独立的 cid，必须从 View API 的 pages 数据中获取正确的 cid。
     *
     * @param {string} bvid - 视频 BV 号
     * @param {number|null} cid - 视频 cid（如果有，为 null 时会从 View API 获取）
     * @param {string} preferredLan - 首选字幕语言
     * @param {number|null} page - 分集编号，用于从 pages 数据中获取正确的 cid
     * @returns {Promise<Object|null>} 字幕数据，包含 {body, lan, lan_doc}
     */
    async function fetchVideoSubtitleByBvid(bvid, cid, preferredLan, page = null) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';

        try {
            // 1. 获取视频信息（aid, pages）
            const viewUrl = `${CONFIG.api.view}?bvid=${bvid}&_t=${Date.now()}`;
            debugLog(`${LOG_PREFIX} [View API] 请求: ${viewUrl}`);
            const viewRes = await fetchJsonStrict(viewUrl, { credentials: 'include', cache: 'no-store' }, '视频信息');

            if (viewRes.code !== 0) {
                console.error(`${LOG_PREFIX} [View API] 失败: code=${viewRes.code}, message=${viewRes.message}, bvid=${bvid}`);
                return null;
            }

            const aid = viewRes.data.aid;
            const pages = viewRes.data.pages || [];
            let effectiveCid = cid;

            // 2. 从 pages 数据中获取正确的 cid（关键！）
            if (page !== null) {
                // 有 page 参数：从对应分集获取 cid
                const pageIndex = page - 1;
                if (pageIndex >= 0 && pageIndex < pages.length) {
                    effectiveCid = pages[pageIndex].cid;
                    debugLog(`${LOG_PREFIX} [分集] page=${page}, 使用 cid=${effectiveCid} (从 pages[${pageIndex}].cid 获取)`);
                } else {
                    console.error(`${LOG_PREFIX} [分集] page=${page} 超出范围 (共 ${pages.length} 个分集)`);
                    return null;
                }
            }

            // 如果仍然没有 cid，使用第一个分集的 cid
            if (!effectiveCid) {
                if (pages.length > 0) {
                    effectiveCid = pages[0].cid;
                    debugLog(`${LOG_PREFIX} [默认] 使用第一个分集的 cid=${effectiveCid}`);
                } else {
                    console.error(`${LOG_PREFIX} [错误] 无法获取视频 cid (bvid=${bvid}, page=${page}, pages.length=${pages.length})`);
                    return null;
                }
            }

            // 3. 获取字幕列表 - 使用 WBI 版本 API，不使用 p 参数！
            // 参考 ref/Bilibili_CC字幕工具.js:1169 - 正确的 API 调用方式
            const playerUrl = `${CONFIG.api.playerWbi}?aid=${aid}&cid=${effectiveCid}&_t=${Date.now()}`;
            debugLog(`${LOG_PREFIX} [Player API] 请求: aid=${aid}, cid=${effectiveCid}, page=${page}`);
            const playerRes = await fetchJsonStrict(playerUrl, { credentials: 'include', cache: 'no-store' }, '字幕列表');

            if (playerRes.code !== 0) {
                console.error(`${LOG_PREFIX} [Player API] 失败: code=${playerRes.code}, message=${playerRes.message}, aid=${aid}, cid=${effectiveCid}`);
                return null;
            }

            const subtitles = playerRes.data?.subtitle?.subtitles;
            if (!Array.isArray(subtitles) || subtitles.length === 0) {
                debugLog(`${LOG_PREFIX} [无字幕] bvid=${bvid}, page=${page}, aid=${aid}, cid=${effectiveCid}`);
                return null;
            }

            // 4. 选择字幕
            const selectedSub = pickSubtitle(subtitles, preferredLan);

            // 5. 下载字幕内容
            let subUrl = selectedSub.subtitle_url;
            if (subUrl.startsWith('//')) subUrl = 'https:' + subUrl;

            const subContentRes = await fetchJsonStrict(subUrl, { cache: 'no-store' }, '字幕内容');

            if (!subContentRes.body || !Array.isArray(subContentRes.body)) {
                console.warn(`${LOG_PREFIX} [字幕内容] 格式异常: bvid=${bvid}, page=${page}`);
                return null;
            }

            const videoTitle = viewRes.data.title || bvid;
            const pageStr = page !== null ? ` P${page}` : '';
            debugLog(`${LOG_PREFIX} [成功] ${videoTitle}${pageStr}, 字幕语言: ${selectedSub.lan_doc}`);

            return {
                body: subContentRes.body,
                lan: selectedSub.lan,
                lan_doc: selectedSub.lan_doc
            };

        } catch (e) {
            console.error(`${LOG_PREFIX} [异常] fetchVideoSubtitleByBvid 失败: bvid=${bvid}, page=${page}, error=${e.message}`);
            return null;
        }
    }

    function downloadContent(content, filename, language) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        notify(`成功下载 (${language})`, '下载完成');
    }

	    // =========================================================================
	    // PREVIEW DIALOG
	    // =========================================================================

		    function showPreviewDialog(content, _filename, format, data) {
		        closePreviewDialog();

		        const PREVIEW_MARGIN = 12;

		        const overlay = document.createElement('div');
		        overlay.id = 'bili-sub-preview-overlay';
		        overlay.style.cssText = `
		            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
		            background: transparent; z-index: 100000;
		            pointer-events: none;
		        `;

		        const dialog = document.createElement('div');
		        dialog.id = 'bili-sub-preview-dialog';
		        const prefs = getPreviewDialogPrefs();

		        const saved = getPreviewDialogRect();
		        const defaultWidth = Math.min(640, Math.max(360, Math.floor(window.innerWidth * 0.42)));
		        const defaultHeight = Math.min(Math.floor(window.innerHeight * 0.78), Math.max(420, Math.floor(window.innerHeight * 0.6)));

			        const initialWidth = Math.min(defaultWidth, window.innerWidth - PREVIEW_MARGIN * 2);
			        const initialHeight = Math.min(defaultHeight, window.innerHeight - PREVIEW_MARGIN * 2);
			        let dialogWidth = initialWidth;
			        let dialogHeight = initialHeight;

			        let initialLeft = Math.max(PREVIEW_MARGIN, window.innerWidth - initialWidth - PREVIEW_MARGIN);
			        let initialTop = 80;
			        let dock = { x: 'right', y: 'none' }; // 默认贴右（更像侧边工具窗）

			        if (saved && typeof saved === 'object') {
		            const w = Number(saved.width);
		            const h = Number(saved.height);
		            const l = Number(saved.left);
		            const t = Number(saved.top);
		            const usableW = Number.isFinite(w) && w > 200 ? Math.min(w, window.innerWidth - PREVIEW_MARGIN * 2) : initialWidth;
		            const usableH = Number.isFinite(h) && h > 200 ? Math.min(h, window.innerHeight - PREVIEW_MARGIN * 2) : initialHeight;
		            const usableL = Number.isFinite(l) ? l : initialLeft;
		            const usableT = Number.isFinite(t) ? t : initialTop;

			            dialogWidth = usableW;
			            dialogHeight = usableH;
			            initialLeft = Math.min(Math.max(PREVIEW_MARGIN, usableL), window.innerWidth - usableW - PREVIEW_MARGIN);
			            initialTop = Math.min(Math.max(PREVIEW_MARGIN, usableT), window.innerHeight - usableH - PREVIEW_MARGIN);

			            // 读取/推断贴边状态（兼容旧存储）
			            if (saved.dock && typeof saved.dock === 'object') {
			                const x = saved.dock.x;
			                const y = saved.dock.y;
			                dock = {
			                    x: (x === 'left' || x === 'right' || x === 'none') ? x : 'none',
			                    y: (y === 'top' || y === 'none') ? y : 'none'
			                };
			            } else if (typeof saved.dock === 'string') {
			                // 兼容早期可能保存的字符串
			                if (saved.dock === 'left') dock = { x: 'left', y: 'none' };
			                else if (saved.dock === 'right') dock = { x: 'right', y: 'none' };
			                else if (saved.dock === 'top') dock = { x: 'none', y: 'top' };
			                else dock = { x: 'none', y: 'none' };
			            } else {
			                // 没有 dock 字段时，根据位置推断（接近边缘则认为贴边）
			                const nearLeft = Math.abs(initialLeft - PREVIEW_MARGIN) <= 8;
			                const nearRight = Math.abs((window.innerWidth - (initialLeft + dialogWidth)) - PREVIEW_MARGIN) <= 8;
			                const nearTop = Math.abs(initialTop - PREVIEW_MARGIN) <= 8;
			                dock = {
			                    x: nearLeft ? 'left' : nearRight ? 'right' : 'none',
			                    y: nearTop ? 'top' : 'none'
			                };
			            }
			        }

			        // 防御：确保默认位置也在屏幕内
			        initialLeft = Math.min(Math.max(PREVIEW_MARGIN, initialLeft), window.innerWidth - dialogWidth - PREVIEW_MARGIN);
			        initialTop = Math.min(Math.max(PREVIEW_MARGIN, initialTop), window.innerHeight - dialogHeight - PREVIEW_MARGIN);

			        // 应用贴边（x/y 可组合）
			        if (dock.x === 'left') initialLeft = PREVIEW_MARGIN;
			        if (dock.x === 'right') initialLeft = Math.max(PREVIEW_MARGIN, window.innerWidth - dialogWidth - PREVIEW_MARGIN);
			        if (dock.y === 'top') initialTop = PREVIEW_MARGIN;

		        dialog.style.cssText = `
		            position: fixed;
		            left: ${initialLeft}px; top: ${initialTop}px;
		            width: ${dialogWidth}px; height: ${dialogHeight}px;
	            background: rgba(255,255,255,${prefs.bgAlpha});
	            border: 1px solid #e3e5e7;
	            border-radius: 10px;
	            padding: 14px;
	            display: flex; flex-direction: column;
	            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
	            pointer-events: auto;
	            backdrop-filter: blur(6px);
	        `;

	        // Header (使用 textContent 防止 XSS)
	        const header = document.createElement('div');
	        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move; user-select: none;';

	        const title = document.createElement('h3');
	        title.style.cssText = 'margin: 0; color: #00a1d6; font-size: 18px;';
	        title.textContent = '字幕预览';

	        const rightBox = document.createElement('div');
	        rightBox.style.cssText = 'display: flex; align-items: center; gap: 10px;';

	        const info = document.createElement('span');
	        info.style.cssText = 'color: #999; font-size: 12px;';
	        info.textContent = `${data.language} | ${data.body.length} 条`;

	        const closeX = document.createElement('button');
	        closeX.type = 'button';
	        closeX.textContent = '×';
	        closeX.title = '关闭';
	        closeX.style.cssText = `
	            width: 28px; height: 28px; line-height: 26px;
	            border-radius: 6px; border: 1px solid #e3e5e7;
	            background: rgba(255,255,255,0.9);
	            cursor: pointer; color: #666; font-size: 18px;
	        `;
	        closeX.onclick = closePreviewDialog;

	        header.appendChild(title);
	        rightBox.appendChild(info);
	        rightBox.appendChild(closeX);
	        header.appendChild(rightBox);
	        dialog.appendChild(header);

	        // Format selector
	        const formatRow = document.createElement('div');
	        formatRow.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px;';

	        const formatLabel = document.createElement('span');
	        formatLabel.textContent = '格式：';
	        formatLabel.style.color = '#666';
	        formatRow.appendChild(formatLabel);

	        const formatSelect = document.createElement('select');
	        formatSelect.style.cssText = 'padding: 5px 10px; border: 1px solid #ddd; border-radius: 4px;';
        const formatOptions = [
            { value: 'txt', label: '纯文本 (.txt)' },
            { value: 'srt', label: 'SRT 字幕 (.srt)' },
            { value: 'ass', label: 'ASS 字幕 (.ass)' },
            { value: 'vtt', label: 'VTT 字幕 (.vtt)' },
            { value: 'lrc', label: 'LRC 歌词 (.lrc)' },
            { value: 'bcc', label: 'BCC 原始 (.json)' }
        ];
        formatOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === format) option.selected = true;
            formatSelect.appendChild(option);
        });
	        formatRow.appendChild(formatSelect);
	        dialog.appendChild(formatRow);

		        // Tools row: dock + opacity + font size
		        const toolsRow = document.createElement('div');
		        toolsRow.style.cssText = 'display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; color: #666; font-size: 12px;';

	        const makeToolBtn = (text, titleText) => {
	            const btn = document.createElement('button');
	            btn.type = 'button';
	            btn.textContent = text;
	            btn.title = titleText || text;
	            btn.style.cssText = `
	                padding: 4px 8px;
	                border-radius: 6px;
	                border: 1px solid #e3e5e7;
	                background: rgba(255,255,255,0.9);
	                cursor: pointer;
	                color: #555;
	                font-size: 12px;
	            `;
	            btn.onmouseenter = () => { btn.style.background = '#f6f7f8'; };
	            btn.onmouseleave = () => { btn.style.background = 'rgba(255,255,255,0.9)'; };
	            return btn;
	        };

		        const clamp = (v, min, max) => Math.min(Math.max(min, v), max);
		        const syncDockDataset = () => {
		            dialog.dataset.biliSubDockX = dock.x;
		            dialog.dataset.biliSubDockY = dock.y;
		        };
		        syncDockDataset();

		        const saveRectNow = () => {
		            const r = dialog.getBoundingClientRect();
		            setPreviewDialogRect({
		                left: r.left,
		                top: r.top,
		                width: r.width,
		                height: r.height,
		                dock: { ...dock }
		            });
		        };

		        const applyDockAndClamp = (opts = {}) => {
		            const { save = false } = opts;
		            // 调整窗口尺寸不要超出可视范围
		            const r0 = dialog.getBoundingClientRect();
		            const maxW = Math.max(240, window.innerWidth - PREVIEW_MARGIN * 2);
		            const maxH = Math.max(240, window.innerHeight - PREVIEW_MARGIN * 2);
		            if (r0.width > maxW) dialog.style.width = `${maxW}px`;
		            if (r0.height > maxH) dialog.style.height = `${maxH}px`;

		            const r = dialog.getBoundingClientRect();
		            let left = r.left;
		            let top = r.top;

		            if (dock.x === 'left') left = PREVIEW_MARGIN;
		            else if (dock.x === 'right') left = window.innerWidth - r.width - PREVIEW_MARGIN;
		            else left = clamp(left, PREVIEW_MARGIN, window.innerWidth - r.width - PREVIEW_MARGIN);

		            if (dock.y === 'top') top = PREVIEW_MARGIN;
		            else top = clamp(top, PREVIEW_MARGIN, window.innerHeight - r.height - PREVIEW_MARGIN);

		            dialog.style.left = `${left}px`;
		            dialog.style.top = `${top}px`;

		            if (save) saveRectNow();
		        };

		        const setDialogPos = (left, top, nextDock) => {
		            if (nextDock && typeof nextDock === 'object') {
		                if (nextDock.x) dock.x = nextDock.x;
		                if (nextDock.y) dock.y = nextDock.y;
		                syncDockDataset();
		            }
		            dialog.style.left = `${left}px`;
		            dialog.style.top = `${top}px`;
		            applyDockAndClamp({ save: true });
		        };

		        const dockLabel = document.createElement('span');
		        dockLabel.textContent = '贴边：';

		        const dockLeftBtn = makeToolBtn('左', '贴左侧');
		        dockLeftBtn.onclick = () => setDialogPos(PREVIEW_MARGIN, dialog.getBoundingClientRect().top, { x: 'left' });

		        const dockTopBtn = makeToolBtn('上', '贴顶部');
		        dockTopBtn.onclick = () => setDialogPos(dialog.getBoundingClientRect().left, PREVIEW_MARGIN, { y: 'top' });

		        const dockRightBtn = makeToolBtn('右', '贴右侧');
		        dockRightBtn.onclick = () => {
		            const r = dialog.getBoundingClientRect();
		            setDialogPos(window.innerWidth - r.width - PREVIEW_MARGIN, r.top, { x: 'right' });
		        };

		        const dockResetBtn = makeToolBtn('重置', '恢复默认位置');
		        dockResetBtn.onclick = () => {
		            // 恢复默认：贴右侧、取消贴顶，top = 80
		            dock = { x: 'right', y: 'none' };
		            syncDockDataset();
		            dialog.style.top = '80px';
		            applyDockAndClamp({ save: true });
		        };

	        toolsRow.appendChild(dockLabel);
	        toolsRow.appendChild(dockLeftBtn);
	        toolsRow.appendChild(dockTopBtn);
	        toolsRow.appendChild(dockRightBtn);
	        toolsRow.appendChild(dockResetBtn);

	        const sep1 = document.createElement('span');
	        sep1.textContent = '|';
	        sep1.style.color = '#ddd';
	        toolsRow.appendChild(sep1);

	        const opacityLabel = document.createElement('span');
	        opacityLabel.textContent = '透明：';
	        toolsRow.appendChild(opacityLabel);

	        const opacityValue = document.createElement('span');
	        opacityValue.style.cssText = 'min-width: 44px; text-align: right; color: #999;';
	        const setOpacityDisplay = (alpha) => { opacityValue.textContent = `${Math.round(alpha * 100)}%`; };

	        const opacityRange = document.createElement('input');
	        opacityRange.type = 'range';
	        opacityRange.min = '0.35';
	        opacityRange.max = '1';
	        opacityRange.step = '0.05';
	        opacityRange.value = String(prefs.bgAlpha);
	        opacityRange.style.cssText = 'width: 120px;';
	        setOpacityDisplay(prefs.bgAlpha);
		        opacityRange.oninput = () => {
	            const alpha = Number(opacityRange.value);
	            if (!Number.isFinite(alpha)) return;
	            dialog.style.background = `rgba(255,255,255,${alpha})`;
	            setOpacityDisplay(alpha);
	        };
	        opacityRange.onchange = () => {
	            const alpha = Number(opacityRange.value);
	            if (!Number.isFinite(alpha)) return;
	            mergePreviewDialogPrefs({ bgAlpha: alpha });
	        };
	        toolsRow.appendChild(opacityRange);
	        toolsRow.appendChild(opacityValue);

	        const sep2 = document.createElement('span');
	        sep2.textContent = '|';
	        sep2.style.color = '#ddd';
	        toolsRow.appendChild(sep2);

	        const fontLabel = document.createElement('span');
	        fontLabel.textContent = '字号：';
	        toolsRow.appendChild(fontLabel);

	        const fontValue = document.createElement('span');
	        fontValue.style.cssText = 'min-width: 34px; text-align: right; color: #999;';
	        const setFontDisplay = (px) => { fontValue.textContent = `${px}px`; };

	        const fontRange = document.createElement('input');
	        fontRange.type = 'range';
	        fontRange.min = '11';
	        fontRange.max = '20';
	        fontRange.step = '1';
	        fontRange.value = String(prefs.fontSize);
	        fontRange.style.cssText = 'width: 120px;';
	        setFontDisplay(prefs.fontSize);
	        toolsRow.appendChild(fontRange);
	        toolsRow.appendChild(fontValue);

	        dialog.appendChild(toolsRow);

	        // Text area
	        const textarea = document.createElement('textarea');
	        textarea.style.cssText = `
	            flex: 1; min-height: 0; padding: 10px; border: 1px solid #e5e9ef;
	            border-radius: 4px; font-family: monospace; font-size: 13px;
	            resize: none; line-height: 1.5;
	        `;
	        textarea.style.fontSize = `${prefs.fontSize}px`;
	        textarea.value = content;
	        textarea.readOnly = true;
	        dialog.appendChild(textarea);

	        fontRange.oninput = () => {
	            const px = Number(fontRange.value);
	            if (!Number.isFinite(px)) return;
	            textarea.style.fontSize = `${px}px`;
	            setFontDisplay(px);
	        };
	        fontRange.onchange = () => {
	            const px = Number(fontRange.value);
	            if (!Number.isFinite(px)) return;
	            mergePreviewDialogPrefs({ fontSize: px });
	        };

        // Update content when format changes
        formatSelect.onchange = () => {
            const newFormat = formatSelect.value;
            const generator = Generators[newFormat];
            textarea.value = newFormat === 'ass' ? generator(data.body, data.title) : generator(data.body);
            format = newFormat;
            // 在预览窗口切换格式时同步记住偏好（无需点下载）
            setPreferredFormat(newFormat);
        };

	        // Buttons
	        const btnRow = document.createElement('div');
	        btnRow.style.cssText = 'display: flex; gap: 10px; margin-top: 10px; justify-content: flex-end;';

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = '下载';
        downloadBtn.style.cssText = `
            padding: 8px 20px; background: #00a1d6; color: white; border: none;
            border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
        downloadBtn.onclick = () => {
            const ext = getFileExtension(format);
            const fn = `${sanitizeFilename(data.title)}.${ext}`;
            downloadContent(textarea.value, fn, data.language);
            setPreferredFormat(format);
        };

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.style.cssText = `
            padding: 8px 20px; background: #f4f4f4; color: #333; border: 1px solid #ddd;
            border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(textarea.value).then(() => {
                copyBtn.textContent = '已复制!';
                setTimeout(() => copyBtn.textContent = '复制', 1500);
            });
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = `
            padding: 8px 20px; background: #f4f4f4; color: #333; border: 1px solid #ddd;
            border-radius: 4px; cursor: pointer; font-size: 14px;
        `;
	        closeBtn.onclick = closePreviewDialog;

        btnRow.appendChild(copyBtn);
        btnRow.appendChild(downloadBtn);
        btnRow.appendChild(closeBtn);
        dialog.appendChild(btnRow);

		        // Drag support (拖动标题栏移动)
		        const startDrag = (startEv) => {
		            if (startEv.button !== undefined && startEv.button !== 0) return;
		            if (startEv.target && startEv.target.closest && startEv.target.closest('button, select, input, textarea, a')) return;

		            // 手动拖动 => 解除贴边，让位置自由移动
		            dock = { x: 'none', y: 'none' };
		            syncDockDataset();

		            const rect = dialog.getBoundingClientRect();
		            const startX = startEv.clientX;
		            const startY = startEv.clientY;
		            const startLeft = rect.left;
		            const startTop = rect.top;

		            const onMove = (moveEv) => {
		                const dx = moveEv.clientX - startX;
		                const dy = moveEv.clientY - startY;
		                const maxLeft = window.innerWidth - rect.width - PREVIEW_MARGIN;
		                const maxTop = window.innerHeight - rect.height - PREVIEW_MARGIN;
		                const left = Math.min(Math.max(PREVIEW_MARGIN, startLeft + dx), Math.max(PREVIEW_MARGIN, maxLeft));
		                const top = Math.min(Math.max(PREVIEW_MARGIN, startTop + dy), Math.max(PREVIEW_MARGIN, maxTop));
		                dialog.style.left = `${left}px`;
		                dialog.style.top = `${top}px`;
		            };

		            const onUp = () => {
		                document.removeEventListener('mousemove', onMove, true);
		                document.removeEventListener('mouseup', onUp, true);
		                applyDockAndClamp({ save: true });
		            };

	            document.addEventListener('mousemove', onMove, true);
	            document.addEventListener('mouseup', onUp, true);
	            startEv.preventDefault();
	        };
	        header.addEventListener('mousedown', startDrag, true);

	        // Custom Resize Logic - 8方向调整大小（Plan B）
	        dialog.style.resize = 'none';
	        dialog.style.boxSizing = 'border-box'; // 确保宽高包含 padding/border，调整更流畅
	        dialog.style.overflow = 'hidden';

	        const resizeHandles = [
	            { dir: 'n', css: 'top: 0; left: 15%; right: 15%; height: 4px; cursor: ns-resize;' },
	            { dir: 's', css: 'bottom: 0; left: 15%; right: 15%; height: 4px; cursor: ns-resize;' },
	            { dir: 'w', css: 'top: 15%; bottom: 15%; left: 0; width: 4px; cursor: ew-resize;' },
	            { dir: 'e', css: 'top: 15%; bottom: 15%; right: 0; width: 4px; cursor: ew-resize;' },
	            { dir: 'nw', css: 'top: 0; left: 0; width: 12px; height: 12px; cursor: nwse-resize;' },
	            { dir: 'ne', css: 'top: 0; right: 0; width: 12px; height: 12px; cursor: nesw-resize;' },
	            { dir: 'sw', css: 'bottom: 0; left: 0; width: 12px; height: 12px; cursor: nesw-resize;' },
	            { dir: 'se', css: 'bottom: 0; right: 0; width: 12px; height: 12px; cursor: nwse-resize;' }
	        ];

	        resizeHandles.forEach((handle) => {
	            const el = document.createElement('div');
	            el.style.cssText = `position: absolute; ${handle.css} z-index: 100; transition: background 0.2s; user-select: none;`;
	            el.onmouseenter = () => el.style.backgroundColor = 'rgba(0, 161, 214, 0.3)';
	            el.onmouseleave = () => el.style.backgroundColor = 'transparent';

	            el.addEventListener('mousedown', (e) => {
	                if (e.button !== undefined && e.button !== 0) return; // 只响应左键
	                e.stopPropagation();
	                e.preventDefault();
	                isResizing = true; // 标记正在 resize

	                // Auto-dock release
	                dock = { x: 'none', y: 'none' };
	                syncDockDataset();

	                const startX = e.clientX;
	                const startY = e.clientY;
	                const r = dialog.getBoundingClientRect();
	                const startW = r.width;
	                const startH = r.height;
	                const startL = r.left;
	                const startT = r.top;
	                const minW = 240;
	                const minH = 240;

	                const onMove = (ev) => {
	                    const dx = ev.clientX - startX;
	                    const dy = ev.clientY - startY;
	                    let newW = startW, newH = startH, newL = startL, newT = startT;

	                    if (handle.dir.includes('e')) newW = Math.max(minW, startW + dx);
	                    if (handle.dir.includes('s')) newH = Math.max(minH, startH + dy);
	                    if (handle.dir.includes('w')) {
	                        newW = Math.max(minW, startW - dx);
	                        newL = startL + (startW - newW);
	                    }
	                    if (handle.dir.includes('n')) {
	                        newH = Math.max(minH, startH - dy);
	                        newT = startT + (startH - newH);
	                    }

	                    dialog.style.width = newW + 'px';
	                    dialog.style.height = newH + 'px';
	                    dialog.style.left = newL + 'px';
	                    dialog.style.top = newT + 'px';
	                };

	                const onUp = () => {
	                    isResizing = false; // 重置标记
	                    document.removeEventListener('mousemove', onMove, true);
	                    document.removeEventListener('mouseup', onUp, true);
	                    window.removeEventListener('blur', onUp);
	                    applyDockAndClamp({ save: true });
	                };

	                document.addEventListener('mousemove', onMove, true);
	                document.addEventListener('mouseup', onUp, true);
	                window.addEventListener('blur', onUp); // 防止页面失焦导致卡死
	            });
	            dialog.appendChild(el);
	        });

		        // 标记是否正在 resize，防止重复调用 applyDockAndClamp
		        let isResizing = false;

		        // 点击窗口任何区域时，把当前尺寸/位置记下来（尤其是拖动后）
		        dialog.addEventListener('mousedown', () => {
		            isResizing = false;
		        });
		        dialog.addEventListener('mouseup', () => {
		            if (!isResizing) {
		                applyDockAndClamp({ save: true });
		            }
		            isResizing = false;
		        });

		        overlay.appendChild(dialog);

		        document.body.appendChild(overlay);
		        previewDialog = overlay;

		        // 浏览器窗口拉伸时：保持贴边/确保不出屏
		        const onWindowResize = () => {
		            applyDockAndClamp({ save: true });
		        };
		        overlay._biliSubOnResize = onWindowResize;
		        window.addEventListener('resize', onWindowResize, { passive: true });

		        // 初次打开也做一次 clamp（避免极端尺寸/保存值导致越界）
		        applyDockAndClamp({ save: false });
		    }

		    function closePreviewDialog() {
		        if (previewDialog) {
		            try {
		                const dialog = previewDialog.querySelector('#bili-sub-preview-dialog');
		                if (dialog) {
		                    const r = dialog.getBoundingClientRect();
		                    const dockX = dialog.dataset.biliSubDockX || 'none';
		                    const dockY = dialog.dataset.biliSubDockY || 'none';
		                    setPreviewDialogRect({
		                        left: r.left,
		                        top: r.top,
		                        width: r.width,
		                        height: r.height,
		                        dock: {
		                            x: (dockX === 'left' || dockX === 'right' || dockX === 'none') ? dockX : 'none',
		                            y: (dockY === 'top' || dockY === 'none') ? dockY : 'none'
		                        }
		                    });
		                }
		            } catch { }
		            try {
		                if (previewDialog._biliSubOnResize) {
		                    window.removeEventListener('resize', previewDialog._biliSubOnResize);
		                }
		            } catch { }
		            document.body.removeChild(previewDialog);
		            previewDialog = null;
		        }
		    }

	    // =========================================================================
	    // UI INJECTION
	    // =========================================================================

	    function getSelectedLanFromMenu(menu) {
	        const select = menu?.querySelector('#bili-sub-lang-select');
	        if (!select) return getPreferredSubtitleLan();
	        return select.value || getPreferredSubtitleLan();
	    }

	    function updateFollowOptionLabel(selectEl, subtitles) {
	        const followOpt = selectEl?.querySelector(`option[value="${SUBTITLE_LAN_FOLLOW}"]`);
	        if (!followOpt) return;

	        const hint = getCurrentPlayerSubtitleHint();
	        let matched = null;
	        if (hint?.lan) matched = subtitles.find(s => s.lan === hint.lan) || null;
	        if (!matched && hint?.lan_doc) matched = subtitles.find(s => s.lan_doc === hint.lan_doc) || null;

	        followOpt.textContent = matched
	            ? `自动（跟随播放器：${matched.lan_doc || matched.lan}）`
	            : '自动（跟随播放器）';
	    }

	    function sleep(ms) {
	        return new Promise(resolve => setTimeout(resolve, ms));
	    }

	    async function scheduleAutoHideCheck(menu, btnContainer) {
	        if (!btnContainer || !getHideWhenNoSubtitle()) return;

	        // 避免并发/重复触发
	        if (btnContainer.dataset.biliSubAutohideRunning === '1') return;
	        btnContainer.dataset.biliSubAutohideRunning = '1';

	        try {
	            // 多次重试，避免播放器未初始化导致的“误判无字幕”
	            const delays = [800, 1200, 2000, 3500, 5000]; // 总计约 12.5s
	            for (let i = 0; i < delays.length; i++) {
	                try {
	                    await getSubtitleListData();
	                    // 有字幕：确保按钮可见
	                    btnContainer.style.display = 'flex';
	                    // 用缓存再刷新一次菜单内容（不额外请求）
	                    if (menu) refreshMenuSubtitleOptions(menu, btnContainer);
	                    return;
	                } catch (e) {
	                    const msg = e?.message || '';
	                    const looksLikeNoSubtitle = /没有可用的字幕|没有字幕|无字幕/.test(msg);
	                    const looksLikeBlocked = /返回了HTML页面|网络请求失败|HTTP\s*\d+/i.test(msg);
	                    // 这类通常是风控/未登录/网络问题，无法判断是否“无字幕”，不隐藏避免误伤
	                    if (looksLikeBlocked) {
	                        btnContainer.style.display = 'flex';
	                        return;
	                    }

	                    const looksLikeNotReady = /无法获取|无法识别视频ID|CID|aid/.test(msg);

	                    if (looksLikeNoSubtitle) {
	                        // 继续重试，直到多次确认仍无字幕再隐藏
	                        if (i < delays.length - 1) {
	                            await sleep(delays[i]);
	                            continue;
	                        }
	                        // 多次确认仍为无字幕：隐藏按钮
	                        if (getHideWhenNoSubtitle()) {
	                            btnContainer.style.display = 'none';
	                            if (activeMenu) {
	                                activeMenu.style.display = 'none';
	                                activeMenu = null;
	                            }
	                        }
	                        return;
	                    }

	                    if (looksLikeNotReady) {
	                        // 播放器/页面数据尚未就绪：继续等待重试
	                        if (i < delays.length - 1) {
	                            await sleep(delays[i]);
	                            continue;
	                        }
	                        btnContainer.style.display = 'flex';
	                        return;
	                    }

	                    // 其它错误：不隐藏（避免误判），保持可见
	                    btnContainer.style.display = 'flex';
	                    return;
	                }
	            }
	        } finally {
	            delete btnContainer.dataset.biliSubAutohideRunning;
	        }
	    }

	    async function refreshMenuSubtitleOptions(menu, btnContainer) {
	        const langSelect = menu?.querySelector('#bili-sub-lang-select');
	        const hideCheck = menu?.querySelector('#bili-sub-hide-no-sub');
	        if (!langSelect || !hideCheck) return;

	        // 同步设置状态
	        hideCheck.checked = getHideWhenNoSubtitle();

	        // 先显示一个 loading 状态
	        langSelect.disabled = true;
	        langSelect.innerHTML = '';
	        const loadingOpt = document.createElement('option');
	        loadingOpt.value = SUBTITLE_LAN_FOLLOW;
	        loadingOpt.textContent = '加载字幕列表中...';
	        langSelect.appendChild(loadingOpt);

	        try {
	            const list = await getSubtitleListData();
	            const subtitles = Array.isArray(list.subtitles) ? list.subtitles : [];

	            // 正常情况下 getSubtitleListData 会在无字幕时抛错，这里仍做防御
	            if (subtitles.length === 0) {
	                throw new Error('该视频没有可用的字幕');
	            }

	            const preferredLan = getPreferredSubtitleLan();

	            // 重建下拉选项
	            langSelect.innerHTML = '';
	            const followOpt = document.createElement('option');
	            followOpt.value = SUBTITLE_LAN_FOLLOW;
	            followOpt.textContent = '自动（跟随播放器）';
	            langSelect.appendChild(followOpt);

	            subtitles.forEach(s => {
	                const opt = document.createElement('option');
	                opt.value = s.lan;
	                opt.textContent = s.lan_doc ? `${s.lan_doc} (${s.lan})` : String(s.lan);
	                langSelect.appendChild(opt);
	            });

	            // 更新“跟随播放器”的提示文案
	            updateFollowOptionLabel(langSelect, subtitles);

	            // 还原/修正用户偏好：如果当前视频没有该语言，则回退到 follow
	            if (preferredLan !== SUBTITLE_LAN_FOLLOW && subtitles.some(s => s.lan === preferredLan)) {
	                langSelect.value = preferredLan;
	            } else {
	                langSelect.value = SUBTITLE_LAN_FOLLOW;
	                if (preferredLan !== SUBTITLE_LAN_FOLLOW) setPreferredSubtitleLan(SUBTITLE_LAN_FOLLOW);
	            }

	            langSelect.disabled = false;

	            // 如果之前隐藏过按钮，这里恢复显示（让用户能继续使用）
	            if (btnContainer) btnContainer.style.display = 'flex';
	        } catch (e) {
	            const msg = e?.message || '获取字幕列表失败';
	            const looksLikeNoSubtitle = /没有可用的字幕|没有字幕|无字幕/.test(msg);

	            langSelect.innerHTML = '';
	            const opt = document.createElement('option');
	            opt.value = SUBTITLE_LAN_FOLLOW;
	            opt.textContent = looksLikeNoSubtitle ? '无字幕' : '字幕列表获取失败';
	            langSelect.appendChild(opt);
	            langSelect.disabled = true;

	            if (looksLikeNoSubtitle && getHideWhenNoSubtitle() && btnContainer) {
	                // 交给带重试的自动隐藏逻辑，避免误判（播放器未初始化）
	                scheduleAutoHideCheck(menu, btnContainer);
	            }
	        }
	    }

	    function createMenu(btnContainer) {
	        const LOG_PREFIX = '[Bilibili 字幕下载器]';
	        debugLog(`${LOG_PREFIX} [createMenu] 开始创建菜单`);
	        const container = document.createElement('div');
	        container.id = 'bili-sub-dl-menu';
	        container.style.cssText = `
            position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
            background: #fff; border: 1px solid #e3e5e7; border-radius: 8px;
            box-shadow: 0 6px 15px rgba(0,0,0,.15); padding: 8px 0; z-index: 10000;
            display: none; color: #18191c; font-size: 14px; min-width: 150px; text-align: left;
	        `;
	        // 点击菜单内部不触发按钮的 toggle
	        container.addEventListener('click', (e) => e.stopPropagation());

        // Dropdown Arrow (native B站 style)
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%) rotate(45deg);
            width: 10px; height: 10px; background: #fff;
            border-right: 1px solid #e3e5e7; border-bottom: 1px solid #e3e5e7;
        `;
        container.appendChild(arrow);

	        // 语言选择 & 隐藏设置
	        const topArea = document.createElement('div');
	        topArea.style.cssText = 'padding: 8px 20px 6px; border-bottom: 1px solid #e3e5e7;';

	        const langRow = document.createElement('div');
	        langRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 6px;';

	        const langLabel = document.createElement('span');
	        langLabel.textContent = '字幕：';
	        langLabel.style.cssText = 'color: #666; font-size: 12px; white-space: nowrap;';

	        const langSelect = document.createElement('select');
	        langSelect.id = 'bili-sub-lang-select';
	        langSelect.style.cssText = 'flex: 1; padding: 4px 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;';
	        langSelect.onchange = () => setPreferredSubtitleLan(langSelect.value);

	        const followOpt = document.createElement('option');
	        followOpt.value = SUBTITLE_LAN_FOLLOW;
	        followOpt.textContent = '自动（跟随播放器）';
	        langSelect.appendChild(followOpt);
	        langSelect.value = getPreferredSubtitleLan();

	        langRow.appendChild(langLabel);
	        langRow.appendChild(langSelect);

	        const hideRow = document.createElement('label');
	        hideRow.style.cssText = 'display: flex; align-items: center; gap: 6px; color: #666; font-size: 12px; cursor: pointer; user-select: none;';

	        const hideCheck = document.createElement('input');
	        hideCheck.type = 'checkbox';
	        hideCheck.id = 'bili-sub-hide-no-sub';
	        hideCheck.checked = getHideWhenNoSubtitle();
	        hideCheck.onchange = () => {
	            setHideWhenNoSubtitle(hideCheck.checked);
	            if (!btnContainer) return;
	            if (hideCheck.checked) {
	                scheduleAutoHideCheck(container, btnContainer);
	            } else {
	                // 关闭自动隐藏：立即恢复可见（即使无字幕也让用户能打开菜单看原因）
	                btnContainer.style.display = 'flex';
	            }
	        };

	        const hideText = document.createElement('span');
	        hideText.textContent = '无字幕时隐藏按钮';

	        hideRow.appendChild(hideCheck);
	        hideRow.appendChild(hideText);

	        topArea.appendChild(langRow);
	        topArea.appendChild(hideRow);
	        container.appendChild(topArea);

	        // 检测是否有列表/选集，动态添加批量下载选项
	        debugLog(`${LOG_PREFIX} [createMenu] 获取视频列表...`);
	        const videoList = getVideoListData();
	        debugLog(`${LOG_PREFIX} [createMenu] 视频列表结果:`, videoList ? `length=${videoList.length}` : 'null');
	        const hasList = videoList && videoList.length > 1;
	        debugLog(`${LOG_PREFIX} [createMenu] hasList: ${hasList}`);
	        const ctx = getVideoContext();
	        const isListPage = ctx.pageType === 'list';
	        debugLog(`${LOG_PREFIX} [createMenu] isListPage: ${isListPage}`);

	        const options = [
	            { label: '纯文本 (.txt)', format: 'txt' },
	            { label: 'SRT 字幕 (.srt)', format: 'srt' },
	            { label: 'ASS 字幕 (.ass)', format: 'ass' },
	            { label: 'VTT 字幕 (.vtt)', format: 'vtt' },
	            { label: 'LRC 歌词 (.lrc)', format: 'lrc' },
	            { label: 'BCC 原始 (.json)', format: 'bcc' },
	            { label: 'divider', divider: true },
	            // 预览项的格式不固定在菜单创建时，而是在点击时读取"当前偏好格式"
	            { label: '预览字幕...', preview: true },
	        ];

	        // 如果有列表/选集，添加批量下载选项
	        if (hasList) {
	            // 在预览项前插入分隔线和批量下载选项
	            const batchOptionIndex = options.findIndex(opt => opt.preview);
	            if (batchOptionIndex !== -1) {
	                options.splice(batchOptionIndex, 0,
	                    { label: 'divider', divider: true },
	                    { label: isListPage ? `下载列表字幕 (${videoList.length}个)` : `下载选集字幕 (${videoList.length}个)`, format: 'batch', batch: true }
	                );
	            }
	        }

	        options.forEach(opt => {
	            const item = document.createElement('div');

            if (opt.divider) {
                item.style.cssText = 'height: 1px; background: #e3e5e7; margin: 4px 0;';
            } else {
                item.innerText = opt.label;
                // 批量下载选项使用不同样式
                if (opt.batch) {
                    item.style.cssText = `padding: 10px 20px; cursor: pointer; transition: background 0.2s; color: #00AEEC; font-weight: 500;`;
                } else {
                    item.style.cssText = `padding: 10px 20px; cursor: pointer; transition: background 0.2s;`;
                }
                item.onmouseenter = () => item.style.background = '#f1f2f3';
                item.onmouseleave = () => item.style.background = 'transparent';
		                item.onclick = (e) => {
		                    e.stopPropagation();
		                    container.style.display = 'none';
		                    activeMenu = null;
		                    if (opt.batch) {
		                        // 批量下载
		                        downloadListSubtitles(getSelectedLanFromMenu(container));
		                    } else {
		                        const format = opt.preview ? getPreferredFormat() : opt.format;
		                        startDownload(format, opt.preview, getSelectedLanFromMenu(container));
		                    }
		                };
		            }
		            container.appendChild(item);
		        });

	        return container;
	    }

    function injectUI(toolbar) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';
        debugLog(`${LOG_PREFIX} [injectUI] 开始注入按钮`);
        if (document.getElementById('bili-sub-dl-btn')) {
            debugLog(`${LOG_PREFIX} [injectUI] 按钮已存在，跳过`);
            return;
        }

        const btnContainer = document.createElement('div');
        btnContainer.id = 'bili-sub-dl-btn';
        btnContainer.className = 'video-toolbar-left-item';
	        btnContainer.title = '下载字幕';
	        btnContainer.style.cssText = `
	            display: flex; align-items: center; justify-content: center;
	            cursor: pointer; position: relative; color: #61666d;
	            transition: color 0.3s; padding: 6px 11px; margin-left: 5px;
	        `;
	        const autoHide = getHideWhenNoSubtitle();
	        debugLog(`${LOG_PREFIX} [injectUI] 自动隐藏设置: ${autoHide}`);
	        if (autoHide) {
	            // 先隐藏，后续检测到"有字幕/无法判断"再显示，避免无字幕视频出现按钮闪烁
	            btnContainer.style.display = 'none';
	        }

        // 简洁字幕图标 - 屏幕+底部两行字幕
        const iconSvg = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="16" rx="2"/>
                <line x1="6" y1="13" x2="18" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>`;
        btnContainer.innerHTML = iconSvg;

        btnContainer.onmouseenter = () => btnContainer.style.color = '#00AEEC';
        btnContainer.onmouseleave = () => btnContainer.style.color = '#61666d';

	        debugLog(`${LOG_PREFIX} [injectUI] 开始创建菜单...`);
	        const menu = createMenu(btnContainer);
	        debugLog(`${LOG_PREFIX} [injectUI] 菜单创建完成，准备添加到按钮`);
	        btnContainer.appendChild(menu);

	        // 检查是否在列表页面或有批量下载选项
	        const ctx = getVideoContext();
	        const isListPage = ctx.pageType === 'list';
	        const videoList = getVideoListData();
	        const hasList = videoList && videoList.length > 1;
	        debugLog(`${LOG_PREFIX} [injectUI] 页面类型检测: isListPage=${isListPage}, hasList=${hasList}`);

	        // 自动隐藏：注入后就检查一次（用户选择了"自动隐藏"）
	        // 注意：列表页面或有批量下载选项时不启用自动隐藏，因为即使当前视频无字幕，其他视频可能有字幕
	        const shouldAutoHide = autoHide && !isListPage && !hasList;
	        debugLog(`${LOG_PREFIX} [injectUI] 是否启用自动隐藏: ${shouldAutoHide} (autoHide=${autoHide}, isListPage=${isListPage}, hasList=${hasList})`);
	        if (shouldAutoHide) {
	            scheduleAutoHideCheck(menu, btnContainer);
	        } else {
	            // 列表页面或不启用自动隐藏时，确保按钮可见
	            if (autoHide && (isListPage || hasList)) {
	                debugLog(`${LOG_PREFIX} [injectUI] 列表页面跳过自动隐藏，显示按钮`);
	                btnContainer.style.display = 'flex';
	            }
	        }

	        btnContainer.onclick = (e) => {
	            e.stopPropagation();
	            const isVisible = menu.style.display === 'block';

            if (activeMenu && activeMenu !== menu) activeMenu.style.display = 'none';

	            menu.style.display = isVisible ? 'none' : 'block';
	            activeMenu = isVisible ? null : menu;

	            // 打开菜单时刷新字幕语言列表（用于跟随播放器/手动选择）
	            if (!isVisible) {
	                refreshMenuSubtitleOptions(menu, btnContainer);
	            }
	        };

        toolbar.appendChild(btnContainer);
        debugLog(`${LOG_PREFIX} [injectUI] 按钮已添加到工具栏，当前 display: ${btnContainer.style.display}`);
    }

    // Singleton global click listener
    document.addEventListener('click', () => {
        if (activeMenu) {
            activeMenu.style.display = 'none';
            activeMenu = null;
        }
    });

    // ESC to close preview
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePreviewDialog();
    });

    // =========================================================================
    // SPA NAVIGATION & INITIALIZATION
    // =========================================================================

    // 同时等待多个选择器，返回第一个匹配的元素
    function waitForAnyElement(selectors, timeout = 10000) {
        return new Promise(resolve => {
            // 1. 立即检查是否已存在
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) return resolve({ el, selector: sel });
            }

            // 2. 监听 DOM 变化，等待任一匹配
            const observer = new MutationObserver(() => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el) {
                        observer.disconnect();
                        return resolve({ el, selector: sel });
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
        });
    }

    async function tryInject(retryCount = 0) {
        const LOG_PREFIX = '[Bilibili 字幕下载器]';
        // 所有可能的工具栏选择器（同时检查，无顺序等待）
        const selectors = [
            '.video-toolbar-left-main',  // 新版主工具栏 (点赞/投币/收藏的容器)
            '.video-toolbar-left',       // 新版工具栏
            CONFIG.selectors.toolbar,
            CONFIG.selectors.toolbarFallback,
            CONFIG.selectors.bangumiToolbar,
        ];

        debugLog(`${LOG_PREFIX} [tryInject] 尝试注入按钮 (重试 ${retryCount + 1}/3)`);
        const result = await waitForAnyElement(selectors, 8000);
        if (result) {
            debugLog(`${LOG_PREFIX} [tryInject] 找到工具栏: ${result.selector}`);
            injectUI(result.el);

            // 验证注入是否成功
            setTimeout(() => {
                const btn = document.getElementById('bili-sub-dl-btn');
                if (!btn && retryCount < 3) {
                    console.warn(`${LOG_PREFIX} [tryInject] 按钮注入失败，准备重试`);
                    tryInject(retryCount + 1);
                } else if (btn) {
                    debugLog(`${LOG_PREFIX} [tryInject] 按钮注入成功`);
                }
            }, 500);
            return;
        }

        // 如果没找到，延迟后重试（最多3次）
        if (retryCount < 3) {
            setTimeout(() => tryInject(retryCount + 1), 2000);
        }
    }

    function setupHistoryListener() {
        const _pushState = history.pushState;
        history.pushState = function(...args) {
            _pushState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        const _replaceState = history.replaceState;
        history.replaceState = function(...args) {
            _replaceState.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', () => {
            // Remove old button on navigation
            const oldBtn = document.getElementById('bili-sub-dl-btn');
            if (oldBtn) oldBtn.remove();
            setTimeout(tryInject, 1000);
        });
    }

    // 持续监听，确保按钮存在（B站 Vue 可能会重新渲染删除我们的按钮）
    // 使用 setInterval 轮询替代 MutationObserver，在高动态页面上性能更优
    function keepButtonAlive() {
        const TOOLBAR_SELECTORS = [
            '.video-toolbar-left-main',
            '.video-toolbar-left',
            CONFIG.selectors.toolbar,
            CONFIG.selectors.bangumiToolbar
        ];

        const checkAndInject = () => {
            // 按钮已存在，无需操作
            if (document.getElementById('bili-sub-dl-btn')) return;

            // 查找工具栏并注入
            for (const sel of TOOLBAR_SELECTORS) {
                const toolbar = document.querySelector(sel);
                if (toolbar) {
                    injectUI(toolbar);
                    return;
                }
            }
        };

        // 使用轮询而非 MutationObserver
        // 在高动态页面（如 B 站）上，每 1.5 秒轮询一次比监听所有 DOM 变化更高效
        setInterval(checkAndInject, 1500);

        // 初始检查一次
        checkAndInject();
    }

	    // Start - 等待页面完全加载后再注入
	    registerMenuCommands();
	    setupHistoryListener();

    // 延迟注入，等待 B 站 Vue 框架完成初始渲染
    if (document.readyState === 'complete') {
        setTimeout(() => {
            tryInject();
            keepButtonAlive();
        }, 2000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => {
                tryInject();
                keepButtonAlive();
            }, 2000);
        });
    }

})();
