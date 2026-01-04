// ==UserScript==
// @name         YouTube Volume Normalizer
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  YouTubeの音量を基準値(-14 LUFS)に統一し、ISO 226:2023準拠のラウドネス補正を行います。
// @author       むらひと
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557122/YouTube%20Volume%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557122/YouTube%20Volume%20Normalizer.meta.js
// ==/UserScript==

(function() {
'use strict';
const win = unsafeWindow || window;
const TARGET_KEY = 'yt-player-stable-volume';

// ==========================================
// ■ Force OFF Interceptor (Storage Hook)
// ==========================================
function hookStorage(storage) {
    if (!storage) return;
    const originalSetItem = storage.setItem;

    storage.setItem = function(key, value) {
        if (key === TARGET_KEY) {
            try {
                if (typeof value === 'string' && !value.includes('"data":false')) {
                    const parsed = JSON.parse(value);
                    if (parsed && (parsed.data === true || parsed.data === 'true')) {
                        parsed.data = false;
                        parsed.creation = Date.now();
                        parsed.expiration = Date.now() + 2592000000;
                        value = JSON.stringify(parsed);
                    }
                }
            } catch (e) {}
        }
        return originalSetItem.apply(this, arguments);
    };
}

try {
    hookStorage(win.localStorage);
    hookStorage(win.sessionStorage);
} catch(e) {}

function enforceNativeOffNow() {
    const forceOffData = JSON.stringify({
        data: false,
        creation: Date.now(),
        expiration: Date.now() + 2592000000
    });
    try {
        if (win.localStorage) win.localStorage.setItem(TARGET_KEY, forceOffData);
        if (win.sessionStorage) win.sessionStorage.setItem(TARGET_KEY, forceOffData);
    } catch(e) {}
}
enforceNativeOffNow();


// ==========================================
// ■ Core Injection (CORS Enforcer)
// ==========================================
const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name, value) {
    if (this.tagName === 'VIDEO' && name === 'src') {
        if (this.getAttribute('crossorigin') !== 'anonymous') {
            originalSetAttribute.call(this, 'crossorigin', 'anonymous');
        }
        if (this.crossOrigin !== 'anonymous') {
            this.crossOrigin = 'anonymous';
        }
    }
    return originalSetAttribute.call(this, name, value);
};

const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.apply(this, arguments);
    if (tagName && tagName.toLowerCase() === 'video') {
        originalSetAttribute.call(element, 'crossorigin', 'anonymous');
        element.crossOrigin = 'anonymous';
    }
    return element;
};

// ==========================================
// ■ Network Sniffer (Metadata) - Lock & Stable
// ==========================================
const loudnessDB = new Map();
const metaDB = new Map();
const MAX_CACHE_SIZE = 500;

let scanLock = false;
let currentSniffId = null;

function cacheLoudness(videoId, loudnessDb, isMusic = false, isLive = false) {
    if (!videoId) return;

    if (loudnessDB.size >= MAX_CACHE_SIZE) {
        const firstKey = loudnessDB.keys().next().value;
        loudnessDB.delete(firstKey);
    }
    if (metaDB.size >= MAX_CACHE_SIZE) {
        const firstKey = metaDB.keys().next().value;
        metaDB.delete(firstKey);
    }

    let val = Number(loudnessDb);
    if (!isNaN(val)) {
        if (loudnessDB.get(videoId) !== val) loudnessDB.set(videoId, val);
        if (videoId === currentSniffId) {
            scanLock = true;
        }
    }
    if (metaDB.has(videoId)) {
        const current = metaDB.get(videoId);
        if (isMusic) current.isMusic = true;
        if (isLive) current.isLive = true;
        metaDB.set(videoId, current);
    } else {
        metaDB.set(videoId, { isMusic: isMusic, isLive: isLive });
    }
}

function scanDeep(obj, depth = 0) {
    if (scanLock) return;
    if (!obj || typeof obj !== 'object' || depth > 10) return;

    if (obj.playerConfig && obj.videoDetails) {
         const vId = obj.videoDetails.videoId;
         const lDb = obj.playerConfig.audioConfig?.loudnessDb;

         let isMusic = false;
         if (obj.videoDetails.musicVideoType && obj.videoDetails.musicVideoType !== 'MUSIC_VIDEO_TYPE_UV_EMPTY') isMusic = true;
         if (obj.microformat?.playerMicroformatRenderer?.category === 'Music' || obj.microformat?.playerMicroformatRenderer?.category === '音楽') isMusic = true;

         let isLive = false;
         if (obj.videoDetails.isLive === true) isLive = true;
         if (obj.microformat?.playerMicroformatRenderer?.isLiveBroadcast === true) isLive = true;

         if (vId && (lDb !== undefined || isLive || isMusic)) {
             cacheLoudness(vId, lDb, isMusic, isLive);
         }
    }

    if (obj.videoDetails && obj.videoDetails.videoId) {
        const vId = obj.videoDetails.videoId;
        const lDb = obj.playerConfig?.audioConfig?.loudnessDb;

        let isMusic = false;
        if (obj.videoDetails.musicVideoType && obj.videoDetails.musicVideoType !== 'MUSIC_VIDEO_TYPE_UV_EMPTY') isMusic = true;
        if (obj.microformat?.playerMicroformatRenderer?.category === 'Music' || obj.microformat?.playerMicroformatRenderer?.category === '音楽') isMusic = true;

        let isLive = false;
        if (obj.videoDetails.isLive === true) isLive = true;
        if (obj.microformat?.playerMicroformatRenderer?.isLiveBroadcast === true) isLive = true;

        if (lDb !== undefined || isLive || isMusic) {
            cacheLoudness(vId, lDb, isMusic, isLive);
        }
        return;
    }

    if (Array.isArray(obj)) {
        const len = obj.length;
        for (let i = 0; i < len; i++) {
            scanDeep(obj[i], depth + 1);
        }
        return;
    }

    const skipKeys = new Set([
        'formats', 'adaptiveFormats', 'dashManifest', 'hlsManifest',
        'storyboard', 'trackingParams', 'adPlacements', 'attestation',
        'thumbnails', 'responseContext', 'actions', 'frameworkUpdates',
        'conversationBar', 'emojiPicker', 'searchEndpoint', 'onResponseReceivedEndpoints',
        'cards', 'annotations', 'captionTracks',
        'liveChatRenderer'
    ]);

    for (const key in obj) {
        if (skipKeys.has(key)) continue;
        if (key === 'contents' && depth > 2) continue;
        scanDeep(obj[key], depth + 1);
    }
}

// --- NETWORK INTERCEPTOR START ---
let _ytInitialPlayerResponse = win.ytInitialPlayerResponse;
Object.defineProperty(win, 'ytInitialPlayerResponse', {
    get: () => _ytInitialPlayerResponse,
    set: (val) => { _ytInitialPlayerResponse = val; setTimeout(() => scanDeep(val), 0); },
    configurable: true, enumerable: true
});

const originalFetch = win.fetch;
win.fetch = function(input, init) {
    if (scanLock) return originalFetch.apply(this, arguments);

    const promise = originalFetch.apply(this, arguments);
    promise.then(async (response) => {
        if (scanLock) return;
        const url = (typeof input === 'string' ? input : (input instanceof Request ? input.url : ''));
        if (url && (
            url.includes('/youtubei/v1/player') ||
            url.includes('/youtubei/v1/next') ||
            url.includes('/youtubei/v1/reel')
        )) {
            try {
                const clone = response.clone();
                const data = await clone.json();
                scanDeep(data);
            } catch(e) {}
        }
    }).catch(() => {});
    return promise;
};

const originalXhrOpen = win.XMLHttpRequest.prototype.open;
win.XMLHttpRequest.prototype.open = function(method, url) {
    this._monitor_url = url;
    return originalXhrOpen.apply(this, arguments);
};

const originalXhrSend = win.XMLHttpRequest.prototype.send;
win.XMLHttpRequest.prototype.send = function(body) {
    if (scanLock) return originalXhrSend.apply(this, arguments);

    const isTarget = typeof this._monitor_url === 'string' && (
        this._monitor_url.includes('/youtubei/v1/player') ||
        this._monitor_url.includes('/youtubei/v1/next') ||
        this._monitor_url.includes('/youtubei/v1/reel')
    );

    if (isTarget) {
        this.addEventListener('load', () => {
            if (scanLock) return;
            try {
                const data = JSON.parse(this.responseText);
                scanDeep(data);
            } catch(e) {}
        }, { once: true });
    }
    return originalXhrSend.apply(this, arguments);
};

setTimeout(() => {
    if (win.ytInitialPlayerResponse) scanDeep(win.ytInitialPlayerResponse);
    if (win.ytInitialData) scanDeep(win.ytInitialData);
}, 500);

// ==========================================
// ■ Observer & Play Hook
// ==========================================
let lastPlayTime = 0;
const hookedVideos = new WeakMap();
const sourceCache = new WeakMap(); // ★FIX: MediaElementSource Cache

function ensureCrossorigin(video) {
    if (video.getAttribute('crossorigin') !== 'anonymous') {
        originalSetAttribute.call(video, 'crossorigin', 'anonymous');
    }
    if (video.crossOrigin !== 'anonymous') {
        video.crossOrigin = 'anonymous';
    }
    if (!hookedVideos.has(video)) {
        hookedVideos.set(video, true);
        video._norm_hooked = true;
        video.addEventListener('playing', onVideoPlaying, { capture: true });
        video.addEventListener('play', onVideoPlay, { capture: true });
    }
}

function onVideoPlay(e) {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    const v = e.target;
    lastPlayTime = Date.now();

    if (v.crossOrigin !== 'anonymous') {
        originalSetAttribute.call(v, 'crossorigin', 'anonymous');
        v.crossOrigin = 'anonymous';
    }
}

function onVideoPlaying(e) {
    const v = e.target;
    if (v !== currentTargetVideo || !nodes.processor) {
        const active = findTargetVideo();
        if (active === v) {
            initAudio(v);
        }
    }
}

function seekToLiveEdge(v) {
    try {
        if (v.readyState < 3) return false;

        const player = win.document.getElementById('movie_player');
        if (player && player.seekToStreamTime && player.getDuration) {
            const d = player.getDuration();
            if (isFinite(d) && d > 0) {
                if (Math.abs(d - v.currentTime) < 3.0) return true;
                player.seekTo(d, true);
                return true;
            }
        }
        if (v.duration === Infinity && v.buffered && v.buffered.length > 0) {
            const end = v.buffered.end(v.buffered.length - 1);
            if (Math.abs(v.currentTime - end) > 10) {
                 v.currentTime = end;
                 return true;
            }
        }
    } catch(e) {}
    return false;
}

function safeReload(v) {
    try {
        const player = win.document.getElementById('movie_player');
        if (player && player.loadVideoById && player.getVideoData) {
            const data = player.getVideoData();
            if (data && data.video_id) {
                player.loadVideoById(data.video_id, v.currentTime);
                return true;
            }
        }
    } catch(e) {}
    return false;
}

const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
        if (m.type === 'childList') {
            for (const node of m.addedNodes) {
                if (node.nodeName === 'VIDEO') ensureCrossorigin(node);
                else if (node.querySelectorAll) {
                    const videos = node.querySelectorAll('video');
                    videos.forEach(ensureCrossorigin);
                }
            }
        }
    }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

// ==========================================
// 1. Config & State
// ==========================================
const CONFIG = {
    TARGET_LUFS: -14.0,
    TARGET_LUFS_MUSIC: -14.0,
    AGC_OFFSET: 0.0,

    WINDOW_SECONDS_MOMENTARY: 0.4,
    WINDOW_SECONDS_SHORT: 3.0,
    WINDOW_SECONDS_SHORT_MUSIC: 5.0,
    WINDOW_SECONDS_PSEUDO_STABLE: 10.0,
    WINDOW_SECONDS_INTEGRATED: 10.0,

    MAX_BOOST: 15.0,
    ATTACK_SPEED: 0.3,
    RELEASE_SPEED: 0.01,

    LOW_CUT_FREQ: 20,

    DYN_EQ_SUBBASS_FREQ: 35,
    DYN_EQ_MAX_SUBBASS: 9.0,
    DYN_EQ_BASS_FREQ: 85,
    DYN_EQ_MAX_BASS: 10.0,
    DYN_EQ_MIDBASS_FREQ: 250,
    DYN_EQ_MIDBASS_Q: 0.5,
    DYN_EQ_MAX_MIDBASS: 3.5,
    DYN_EQ_TREBLE_FREQ: 11000,
    DYN_EQ_MAX_TREBLE: 2.5,
    DYN_EQ_THRESHOLD: -14.0,
    VOL_SLIDER_DYNAMIC_RANGE: 40.0,

    SILENCE_LIMIT_BLOCKS: 60,
    SILENCE_LIMIT_BLOCKS_LIVE: 200,
    ABS_SILENCE_THRESHOLD: -70.0,
    REL_GATE_THRESHOLD: -10.0,

    STATS_UPDATE_INTERVAL: 100,
    RELOAD_COOLDOWN: 10000,
    MAX_RECOVERY_ATTEMPTS: 3,
    AGC_HOLD_TIME: 60000,
    RECOVERY_THRESHOLD: 60000,
    SILENCE_THRESHOLD: -70.0,
    UI_UPDATE_INTERVAL: 100,
};

// ★ Pre-calculated Constants
const ABS_THRESH_LINEAR = Math.pow(10, (CONFIG.ABS_SILENCE_THRESHOLD + 0.691) / 10.0);
const LOG10_INV = 1 / Math.log(10);
const DECIMATION_STEP = 4;

const UI = {
    COLORS: {
        STATIC: '#4caf50', AGC: '#00bcd4', WAIT: '#9e9e9e',
        FIX: '#9c27b0', SAFE: '#ff9800', ERR: '#f44336', INIT: '#ffeb3b',
        NATIVE: '#ff9800', FAIL: '#607d8b'
    }
};

let audioCtx;
let nodes = {
    source: null, gain: null, limiter: null, processor: null, kShelf: null, kHighPass: null, muteGain: null,
    dynSub: null, dynLow: null, dynMidLow: null, dynHigh: null
};
let currentTargetVideo = null;
let learnedNativeState = GM_getValue('learnedNativeState', null);

let state = {
    lastVideoSrc: '',
    currentMomentaryLUFS: -100,
    currentShortLUFS: -100,
    currentIntegLUFS: -100,
    currentGain: 1.0,
    animationId: null,
    forceIgnoreNative: GM_getValue('forceIgnoreNative', true),
    forceAGC: GM_getValue('forceAGC', false),
    usePseudoStable: GM_getValue('usePseudoStable', false),
    useDynamicEQ: GM_getValue('useDynamicEQ', false),
    dynEqRefVolume: GM_getValue('dynEqRefVolume', 1.0),
    lastCheckTime: 0,
    lastVideoTime: 0,
    playingSilenceCount: 0,
    isRecovering: false,
    recoveryAttempts: 0,
    lastReloadTime: 0,
    continuousSilenceStart: 0,
    lastValidLUFS: -100,
    isBypassed: false,
    bypassReason: '',
    lastStatsTime: 0,
    cachedStats: { diff: null, isMusic: false, isLive: false, isNorm: false },
    stickyStats: null,
    nativeStateInfo: { isOn: true, source: 'Init' },
    isConfirmedLive: false,
    currentUrl: location.href,
    zeroDataCount: 0,
    lastUiUpdate: 0,
    lastStatusColor: '',
    isNavigating: false,
    lastNativeEnforceTime: 0,
    isMenuOpen: false
};

let dsp = {
    history: null,
    historySize: 0,
    cursor: 0,
    bufferSize: 4096,
    momBlocks: 0,
    shortBlocks: 0,
    shortBlocksMusic: 0,
    pseudoBlocks: 0,
    integBlocks: 0
};

let uiElement = null;
let tooltipNode = null;
let menuNode = null;

// ==========================================
// 2. Logic & Detection
// ==========================================
function safeLog10(val) {
    return (val > 1e-12) ? Math.log(val) * LOG10_INV : -12.0;
}

function tryParse(str) {
    try { return JSON.parse(str); } catch(e) { return null; }
}

function scrapeSettingsMenu() {
    const menuItems = document.querySelectorAll('.ytp-menuitem');
    if (!menuItems || menuItems.length === 0) return;
    menuItems.forEach(item => {
        const label = item.querySelector('.ytp-menuitem-label');
        if (!label) return;
        const text = label.textContent || "";
        if (text.includes('一定音量') || text.toLowerCase().includes('stable volume')) {
            const isChecked = item.getAttribute('aria-checked') === 'true';
            if (learnedNativeState !== isChecked) {
                learnedNativeState = isChecked;
                GM_setValue('learnedNativeState', isChecked);
            }
        }
    });
}

function checkNativeStableVolume(isMusicVideo) {
    if (state.forceIgnoreNative) return { isOn: false, source: '強制OFF(Script)' };

    if (isMusicVideo) return { isOn: false, source: '音楽動画' };
    if (learnedNativeState !== null) return { isOn: learnedNativeState, source: '学習済み' };
    try {
        const storages = [
            { name: 'LocalStorage', store: win.localStorage },
            { name: 'WinStorage', store: window.localStorage },
            { name: 'Session', store: win.sessionStorage },
            { name: 'WinSession', store: window.sessionStorage }
        ];
        for (const s of storages) {
            if (!s.store) continue;
            const raw = s.store.getItem(TARGET_KEY);
            if (raw) {
                const parsed = tryParse(raw);
                if (parsed) {
                    if (parsed.data === true || parsed.data === 'true') return { isOn: true, source: s.name };
                    if (parsed.data === false || parsed.data === 'false') return { isOn: false, source: s.name };
                }
            }
        }
    } catch (e) {}
    return { isOn: true, source: 'デフォルト' };
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.ytp-settings-button') || e.target.closest('.ytp-menuitem')) {
        setTimeout(scrapeSettingsMenu, 200);
        setTimeout(scrapeSettingsMenu, 500);
    }
    if (state.isMenuOpen && menuNode && !menuNode.contains(e.target) && uiElement && !uiElement.contains(e.target)) {
        closeMenu();
    }
}, { capture: true });

function findTargetVideo() {
    if (location.pathname.includes('/shorts/')) {
        const activeShort = document.querySelector('ytd-reel-video-renderer[is-active] video');
        if (activeShort) return activeShort;
    }
    const playerVideo = document.querySelector('#movie_player video');
    if (playerVideo) {
        if (playerVideo.readyState > 0 || playerVideo.src) return playerVideo;
    }

    if (isWatchPage()) {
        const videos = document.getElementsByTagName('video');
        if (videos.length > 0) {
            for (let i = 0; i < videos.length; i++) {
                if (videos[i].readyState > 0) return videos[i];
            }
            return videos[0];
        }
    }
    return null;
}

function isWatchPage() {
    return location.pathname.includes('/watch') || location.pathname.includes('/live') || location.pathname.includes('/shorts/') || location.pathname.includes('/embed/');
}

// ==========================================
// 3. Stats
// ==========================================
function checkLiveRobustly(targetId) {
    if (loudnessDB.has(targetId)) return false;
    const flexy = document.querySelector('ytd-watch-flexy');
    if (flexy && flexy.hasAttribute('is-live')) return true;
    try {
        const player = unsafeWindow.document.getElementById('movie_player');
        if (player && player.getVideoData) {
            const data = player.getVideoData();
            if (data && data.video_id === targetId && data.isLive) return true;
        }
    } catch(e) {}
    const v = findTargetVideo();
    if (v && v.duration === Infinity) return true;
    return !!document.querySelector('.html5-video-player .ytp-live-badge:not([disabled])');
}

function getYouTubeStats() {
    const now = Date.now();
    const updateInterval = location.pathname.includes('/shorts/') ? 50 : CONFIG.STATS_UPDATE_INTERVAL;
    if (state.cachedStats.diff !== null && now - state.lastStatsTime < updateInterval) {}

    let targetId = null;
    if (location.pathname.includes('/shorts/')) {
        const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');
        if (activeReel && activeReel.getAttribute('data-video-id')) {
            targetId = activeReel.getAttribute('data-video-id');
        } else {
            targetId = location.pathname.split('/shorts/')[1]?.split('?')[0];
        }
    } else {
        const params = new URLSearchParams(window.location.search);
        targetId = params.get('v');
    }

    if (!targetId) {
        try {
             const player = win.document.getElementById('movie_player');
             if (player && player.getVideoData) {
                 const data = player.getVideoData();
                 if (data && data.video_id) targetId = data.video_id;
             }
        } catch(e){}
    }

    if (targetId && targetId !== currentSniffId) {
        currentSniffId = targetId;
    }

    if (targetId) {
        if (loudnessDB.has(targetId) || metaDB.has(targetId)) {
            const meta = metaDB.get(targetId) || {};
            const stats = {
                diff: loudnessDB.has(targetId) ? loudnessDB.get(targetId) : null,
                isMusic: meta.isMusic || false,
                isLive: meta.isLive || false,
                isNorm: true
            };
            if (stats.diff !== null) state.stickyStats = stats;
            state.cachedStats = stats;
            state.lastStatsTime = now;
            return state.cachedStats;
        }
        if (state.stickyStats) {
            state.cachedStats = state.stickyStats;
            state.lastStatsTime = now;
            return state.stickyStats;
        }
    }
    state.cachedStats = { diff: null, isMusic: false, isLive: false, isNorm: false };
    state.lastStatsTime = now;
    return state.cachedStats;
}

// ==========================================
// 4. UI (Full Set)
// ==========================================
function createTooltip() {
    if (document.getElementById('yt-norm-tooltip')) {
        tooltipNode = document.getElementById('yt-norm-tooltip');
        return;
    }
    tooltipNode = document.createElement('div');
    tooltipNode.id = 'yt-norm-tooltip';
    tooltipNode.style.cssText = `
        position: fixed; z-index: 9999; background-color: rgba(20, 20, 20, 0.95);
        color: #f1f1f1; padding: 10px 14px; border-radius: 6px;
        font-family: "Roboto", "Arial", sans-serif; font-size: 12px;
        line-height: 1.6; white-space: pre-wrap; pointer-events: none;
        display: none; opacity: 0; transition: opacity 0.1s ease-in-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
        text-align: left;
    `;
    document.body.appendChild(tooltipNode);
}

function createSettingsMenu() {
    if (document.getElementById('yt-norm-menu')) {
        menuNode = document.getElementById('yt-norm-menu');
        return;
    }
    menuNode = document.createElement('div');
    menuNode.id = 'yt-norm-menu';
    menuNode.style.cssText = `
        position: fixed; z-index: 10000; background-color: #1f1f1f;
        color: #eee; padding: 12px; border-radius: 8px;
        font-family: "Roboto", "Arial", sans-serif; font-size: 13px;
        display: none; box-shadow: 0 4px 16px rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.15); min-width: 250px; user-select: none;
    `;

    const title = document.createElement('div');
    title.textContent = 'Normalizer Settings';
    title.style.cssText = 'font-weight:bold; margin-bottom:8px; border-bottom:1px solid #444; padding-bottom:4px; color:#aaa; font-size:11px; text-transform:uppercase;';

    const createRow = (text, checked, callback, titleAttr) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; margin-bottom:10px; cursor:pointer;';
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.checked = checked;
        cb.style.cssText = 'margin-right:8px; transform:scale(1.2); cursor:pointer;';
        const lb = document.createElement('label');
        lb.textContent = text; lb.style.cursor = 'pointer';
        if(titleAttr) lb.title = titleAttr;
        row.appendChild(cb); row.appendChild(lb);
        row.onclick = (e) => { if(e.target !== cb) cb.checked = !cb.checked; callback(cb.checked); };
        return row;
    };

    menuNode.appendChild(title);
    menuNode.appendChild(createRow('YouTube「一定音量」を強制OFF', state.forceIgnoreNative, (val) => {
        state.forceIgnoreNative = val; GM_setValue('forceIgnoreNative', val);
        if(val) enforceNativeOffNow();
        updateIndicator(state.lastStatusColor, state.currentGain, -100, CONFIG.TARGET_LUFS, checkNativeStableVolume(false));
    }));

    const dynRow = createRow('等ラウドネス補正 (Dynamic EQ)', state.useDynamicEQ, (val) => {
        state.useDynamicEQ = val; GM_setValue('useDynamicEQ', val);
        const calib = document.getElementById('yt-norm-calib');
        if(calib) calib.style.display = val ? 'block' : 'none';
    }, "ISO 226:2023準拠。聴感を補正します。");
    menuNode.appendChild(dynRow);

    const calibContainer = document.createElement('div');
    calibContainer.id = 'yt-norm-calib';
    calibContainer.style.cssText = `margin-left: 24px; margin-bottom: 10px; display: ${state.useDynamicEQ ? 'block' : 'none'};`;
    const calibBtn = document.createElement('button');
    calibBtn.innerHTML = '🎧 現在の音量を基準(Flat)にする';
    calibBtn.style.cssText = `background: #006064; color: #e0f7fa; border: 1px solid #00838f; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; width: 100%; transition: background 0.2s;`;
    calibBtn.onclick = (e) => {
        e.stopPropagation();
        const v = currentTargetVideo;
        if(v) {
            let vol = v.volume; if(vol < 0.01) vol = 0.01;
            state.dynEqRefVolume = vol; GM_setValue('dynEqRefVolume', vol);
            calibBtn.textContent = `基準設定完了 (Ref: ${(vol*100).toFixed(0)}%)`;
            setTimeout(() => calibBtn.textContent = '🎧 現在の音量を基準(Flat)にする', 2000);
        }
    };
    calibContainer.appendChild(calibBtn);
    menuNode.appendChild(calibContainer);

    menuNode.appendChild(createRow('常にAGCモードを使用', state.forceAGC, (val) => {
        state.forceAGC = val; GM_setValue('forceAGC', val);
        updateIndicator(state.lastStatusColor, state.currentGain, -100, CONFIG.TARGET_LUFS, checkNativeStableVolume(false));
    }, "メタデータを使用せずリアルタイム調整"));

    menuNode.appendChild(createRow('AGC判定を安定化 (疑似Stable)', state.usePseudoStable, (val) => {
        state.usePseudoStable = val; GM_setValue('usePseudoStable', val);
        updateIndicator(state.lastStatusColor, state.currentGain, -100, CONFIG.TARGET_LUFS, checkNativeStableVolume(false));
    }, "Short-term判定時間を延長し変動を抑制"));

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '音声再初期化 (リセット)';
    resetBtn.style.cssText = `width: 100%; padding: 6px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; cursor: pointer; font-size: 11px; margin-top: 4px;`;
    resetBtn.onclick = () => { closeMenu(); fullReset(); initAudio(); };
    menuNode.appendChild(resetBtn);

    document.body.appendChild(menuNode);
}

function toggleSettingsMenu(e) {
    if (!menuNode) createSettingsMenu();
    if (state.isMenuOpen) closeMenu(); else openMenu(e);
}

function openMenu(e) {
    if (!menuNode || !uiElement) return;
    state.isMenuOpen = true; hideTooltip();
    const rect = uiElement.getBoundingClientRect();
    menuNode.style.top = (rect.bottom + 8) + 'px';
    let left = rect.left;
    if (left + 240 > window.innerWidth) left = window.innerWidth - 240;
    menuNode.style.left = left + 'px';
    menuNode.style.display = 'block';
}

function closeMenu() {
    if (menuNode) menuNode.style.display = 'none';
    state.isMenuOpen = false;
}

function showTooltip() {
    if (state.isMenuOpen || !tooltipNode || !uiElement) return;
    const rect = uiElement.getBoundingClientRect();
    tooltipNode.style.top = (rect.bottom + 12) + 'px';
    let left = rect.left;
    if (left + 250 > window.innerWidth) left = window.innerWidth - 260;
    tooltipNode.style.left = left + 'px';
    tooltipNode.style.display = 'block';
    requestAnimationFrame(() => { if (tooltipNode) tooltipNode.style.opacity = '1'; });
}

function hideTooltip() {
    if (!tooltipNode) return;
    tooltipNode.style.opacity = '0';
    setTimeout(() => { if (tooltipNode && tooltipNode.style.opacity === '0') tooltipNode.style.display = 'none'; }, 100);
}

function initIndicator() {
    if (document.getElementById('yt-norm-btn')) {
        uiElement = document.getElementById('yt-norm-btn');
        if (!document.getElementById('yt-norm-tooltip')) createTooltip();
        if (!document.getElementById('yt-norm-menu')) createSettingsMenu();
        updateVisibility();
        return;
    }
    const buttonsContainer = document.querySelector('ytd-masthead #end #buttons');
    if (!buttonsContainer) { setTimeout(initIndicator, 1000); return; }

    const el = document.createElement('div');
    el.id = 'yt-norm-btn';
    el.className = 'style-scope ytd-masthead';
    el.style.cssText = `display: inline-flex; align-items: center; justify-content: center; position: relative; cursor: pointer; width: 40px; height: 40px; margin-right: 8px; opacity: 0.9; color: var(--yt-spec-text-primary);`;
    const svg = `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 24px; height: 24px; fill: currentColor;"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.48,8.71 14,7.97V16.02C15.48,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z"></path></svg>`;
    const statusBar = `<div id="yt-norm-status-bar" style="position: absolute; bottom: 6px; left: 20%; width: 60%; height: 3px; background-color: #888; border-radius: 2px; transition: background-color 0.3s;"></div>`;
    el.innerHTML = svg + statusBar;

    const notificationBtn = buttonsContainer.querySelector('ytd-notification-topbar-button-renderer');
    if (notificationBtn) buttonsContainer.insertBefore(el, notificationBtn); else buttonsContainer.appendChild(el);
    uiElement = el;

    createTooltip(); createSettingsMenu();
    uiElement.addEventListener('mouseenter', showTooltip);
    uiElement.addEventListener('mouseleave', hideTooltip);
    uiElement.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); toggleSettingsMenu(e); });
    updateVisibility();
}

function updateVisibility() {
    if (!uiElement) return;
    const isActive = isWatchPage() || (currentTargetVideo && !currentTargetVideo.paused && currentTargetVideo.readyState > 0);
    uiElement.style.display = isActive ? 'inline-flex' : 'none';
}

function updateIndicator(status, gain, inputLUFS, effectiveTarget, nativeInfo) {
    let color = UI.COLORS.INIT;
    let titleHead = '初期化中';

    switch (status) {
        case 'static': color = UI.COLORS.STATIC; titleHead = `[Stable] メタデータ適用中`; break;
        case 'agc': case 'agc-live': case 'agc-hold': case 'waiting-silence': color = UI.COLORS.AGC; titleHead = `[AGC] 自動調整 (Auto)`; break;
        case 'waiting-loading': color = UI.COLORS.WAIT; titleHead = `[待機] 読み込み中`; break;
        case 'native-bypass-setting': case 'native-bypass-loud': color = UI.COLORS.NATIVE; titleHead = `[バイパス] YouTube機能で制御`; break;
        case 'recovering': color = UI.COLORS.FIX; titleHead = `[修復中] ストリーム再接続...`; break;
        case 'bypassed': color = UI.COLORS.SAFE; titleHead = `[安全装置] 停止中`; break;
        case 'failed': color = UI.COLORS.FAIL; titleHead = `[機能停止] 音声取得エラー`; break;
        case 'error': color = UI.COLORS.ERR; titleHead = 'エラー発生'; break;
        case 'init': color = UI.COLORS.INIT; titleHead = `[検索中] 動画を探索しています`; break;
    }

    const now = Date.now();
    if (state.lastStatusColor !== color) { /* changed */ }
    else if (now - state.lastUiUpdate < CONFIG.UI_UPDATE_INTERVAL) { if (!tooltipNode || tooltipNode.style.display === 'none') return; }
    state.lastUiUpdate = now; state.lastStatusColor = color;

    if (!uiElement || !document.body.contains(uiElement)) initIndicator();
    updateVisibility();
    if (!uiElement || uiElement.style.display === 'none') return;

    const gainDb = (gain > 0.0001) ? 20 * safeLog10(gain) : 0;
    const gainText = `${gainDb >= 0 ? '+' : ''}${gainDb.toFixed(1)} dB`;
    let lufsDisplay = (inputLUFS > -100) ? inputLUFS.toFixed(1) : '-Inf';
    if ((status === 'waiting-silence' || status === 'agc-hold') && state.lastValidLUFS > -100) lufsDisplay = `${state.lastValidLUFS.toFixed(1)} (Wait)`;

    const bar = document.getElementById('yt-norm-status-bar');
    if (bar && bar.style.backgroundColor !== color) bar.style.backgroundColor = color;

    if (tooltipNode) {
        let dynEqText = "";
        if (state.useDynamicEQ && nodes.dynLow) {
             const b = nodes.dynLow.gain.value;
             if (b > 0.2) dynEqText = `  [DynEQ: +${b.toFixed(1)}dB]`;
        }

        // ラベルの出し分けロジック
        let inputLabel = "現在値";
        if (status === 'static' || status.startsWith('native')) {
            inputLabel = "元音量 (Meta)";
        } else if (status.startsWith('agc')) {
            inputLabel = "計測値 (Real-time)";
        }

        tooltipNode.innerText = `${titleHead}\n----------------\n${inputLabel}: ${lufsDisplay} LUFS\n補正: ${gainText}${dynEqText}\n目標: ${effectiveTarget.toFixed(1)} LUFS\n\n[クリックして設定]`;
    }
}

// ==========================================
// 5. Processing & Recovery
// ==========================================
function onNavigateStart() {
    console.log('[Normalizer] Navigate Start -> Cleanup');
    state.isNavigating = true; closeMenu();
}
function onNavigateFinish() {
    state.isNavigating = false;
    scanLock = false;
}

function fullReset() {
    console.log('[Normalizer] Full Reset');
    state.isNavigating = false;
    currentTargetVideo = null;
    state.lastVideoSrc = '';
    state.currentMomentaryLUFS = -100;
    state.currentShortLUFS = -100;
    state.currentIntegLUFS = -100;
    state.currentGain = 1.0;
    state.zeroDataCount = 0;
    state.isRecovering = false;
    state.recoveryAttempts = 0;
    state.lastReloadTime = 0;
    state.continuousSilenceStart = 0;
    state.lastValidLUFS = -100;
    state.isBypassed = false;
    state.stickyStats = null;
    scanLock = false;
    currentSniffId = null;

    cleanupAudioNodes();
    if (state.animationId) { cancelAnimationFrame(state.animationId); state.animationId = null; }
    updateVisibility();
}

document.addEventListener('yt-navigate-start', onNavigateStart);
document.addEventListener('yt-navigate-finish', onNavigateFinish);

function enableBypassMode(reason = '') {
    if (state.isBypassed) return;
    state.isBypassed = true; state.isRecovering = false; state.bypassReason = reason;
    cleanupAudioNodes();
    updateIndicator('failed', 1.0, -100, CONFIG.TARGET_LUFS, state.nativeStateInfo);
}

async function performRecovery(isLive) {
    if (Date.now() - state.lastReloadTime < CONFIG.RELOAD_COOLDOWN) return;
    const v = currentTargetVideo;
    if (!v) return;

    // 回復機能がループするのを防ぐため、既にロード中(2)なら何もしない
    // しかし、音声処理自体は(processAudioBlockで)止めない
    if (v.networkState === 2 || v.seeking) {
        state.zeroDataCount = 0;
        return;
    }

    state.isRecovering = true;
    state.recoveryAttempts++;
    state.lastReloadTime = Date.now();
    state.continuousSilenceStart = 0;
    if (state.recoveryAttempts > CONFIG.MAX_RECOVERY_ATTEMPTS) {
        enableBypassMode('Max Retry Reached');
        return;
    }
    console.log(`[Normalizer] Recovery Attempt (${state.recoveryAttempts}) for ${isLive?'Live':'VOD'}...`);

    if (audioCtx) { try { await audioCtx.close(); } catch(e){} audioCtx = null; }
    cleanupAudioNodes();
    // Cacheはクリアしない（DOM要素が同じなら再利用するため）

    v.setAttribute('crossorigin', 'anonymous');
    v.crossOrigin = 'anonymous';

    let actionSuccess = isLive ? seekToLiveEdge(v) : safeReload(v);
    if (!actionSuccess && v.src && !v.src.startsWith('blob:')) {
        v.load();
        setTimeout(() => v.play().catch(() => {}), 100);
    }

    const watchdog = setInterval(() => {
        if (!state.isRecovering) { clearInterval(watchdog); return; }
        if (v.readyState >= 3 && !v.paused && v.networkState !== 2) {
            clearInterval(watchdog);
            state.zeroDataCount = 0;
            state.isRecovering = false;
            initAudio();
        }
    }, 1000);
    setTimeout(() => { if(state.isRecovering) { clearInterval(watchdog); state.isRecovering = false; initAudio(); } }, 8000);
}

function cleanupAudioNodes() {
    // ★FIX: Source node is not nulled here, only disconnected. It is cached in WeakMap.
    if (nodes.source) { try { nodes.source.disconnect(); } catch(e){} }

    if (nodes.processor) { try { nodes.processor.disconnect(); nodes.processor.onaudioprocess = null; } catch(e){} nodes.processor = null; }
    if (nodes.gain) { try { nodes.gain.disconnect(); } catch(e){} nodes.gain = null; }
    if (nodes.limiter) { try { nodes.limiter.disconnect(); } catch(e){} nodes.limiter = null; }
    if (nodes.kShelf) { try { nodes.kShelf.disconnect(); } catch(e){} nodes.kShelf = null; }
    if (nodes.kHighPass) { try { nodes.kHighPass.disconnect(); } catch(e){} nodes.kHighPass = null; }
    if (nodes.muteGain) { try { nodes.muteGain.disconnect(); } catch(e){} nodes.muteGain = null; }
    if (nodes.dynSub) { try { nodes.dynSub.disconnect(); } catch(e){} nodes.dynSub = null; }
    if (nodes.dynLow) { try { nodes.dynLow.disconnect(); } catch(e){} nodes.dynLow = null; }
    if (nodes.dynMidLow) { try { nodes.dynMidLow.disconnect(); } catch(e){} nodes.dynMidLow = null; }
    if (nodes.dynHigh) { try { nodes.dynHigh.disconnect(); } catch(e){} nodes.dynHigh = null; }

    // Preserve source ref in the nodes object structure temporarily, initAudio will handle it.
    const savedSource = nodes.source;
    nodes = { source: savedSource, gain: null, limiter: null, processor: null, kShelf: null, kHighPass: null, muteGain: null, dynSub: null, dynLow: null, dynMidLow: null, dynHigh: null };
}

// ==========================================
// Core DSP Logic (BS.1770 Compliant) [Zero-Alloc & Decimated]
// ==========================================
function calculateLoudnessFromCircular(buffer, size, cursor, samplesToRead, useRelativeGate) {
    if (samplesToRead === 0 || samplesToRead > size) return -100;

    let sum = 0;
    let count = 0;

    let idx = cursor - 1;
    for (let i = 0; i < samplesToRead; i++) {
        if (idx < 0) idx = size - 1;
        const val = buffer[idx];
        if (val > ABS_THRESH_LINEAR) {
            sum += val;
            count++;
        }
        idx--;
    }

    if (count === 0) return -100;
    if (!useRelativeGate) return -0.691 + 10 * safeLog10(sum / count);

    const absoluteGatedPower = sum / count;
    const absoluteGatedLoudness = -0.691 + 10 * safeLog10(absoluteGatedPower);
    const relThresholdLUFS = absoluteGatedLoudness + CONFIG.REL_GATE_THRESHOLD;
    const relThresholdLinear = Math.pow(10, (relThresholdLUFS + 0.691) / 10.0);
    const finalThreshold = Math.max(ABS_THRESH_LINEAR, relThresholdLinear);

    let gatedSum = 0;
    let gatedCount = 0;

    idx = cursor - 1;
    for (let i = 0; i < samplesToRead; i++) {
        if (idx < 0) idx = size - 1;
        const val = buffer[idx];
        if (val > finalThreshold) {
            gatedSum += val;
            gatedCount++;
        }
        idx--;
    }

    if (gatedCount === 0) return -100;
    return -0.691 + 10 * safeLog10(gatedSum / gatedCount);
}

function processAudioBlock(inputBuffer) {
    const v = currentTargetVideo;
    // ★FIX: Ignore zero data during seeking, loading, or buffer shortage to prevent false silence detection
    if (!v || v.seeking || v.readyState < 3) { state.zeroDataCount = 0; return; }

    const ch0 = inputBuffer.getChannelData(0);
    // Lightweight silence check (already decimated by 256)
    if (ch0[0] === 0) {
         let isSilence = true;
         for (let i=0; i<ch0.length; i+=256) { if(ch0[i]!==0) { isSilence=false; break; } }

         if (isSilence) {
             if (v && !v.paused && v.readyState >= 3) {
                 // 読み込み中(2)なら、これは「正常なバッファ待ち」の可能性が高いのでカウントしない
                 if (v.networkState === 2) {
                     state.zeroDataCount = 0;
                     return;
                 }

                 // ライブとVODで許容する無音時間を分ける
                 const limit = (state.isConfirmedLive) ? CONFIG.SILENCE_LIMIT_BLOCKS_LIVE : CONFIG.SILENCE_LIMIT_BLOCKS;

                 if (!state.isRecovering && (Date.now() - lastPlayTime < 3000) && state.zeroDataCount > 40) {
                     if (state.recoveryAttempts < CONFIG.MAX_RECOVERY_ATTEMPTS) performRecovery(state.isConfirmedLive);
                 }
                 if (!state.isRecovering) state.zeroDataCount++;

                 if (state.zeroDataCount > limit) {
                     // バッファリングではない(ReadyState>=3 かつ NetworkState!=2)のに長時間無音なら
                     // CORS等の問題でデータが取れていないと判断して回復
                     performRecovery(state.isConfirmedLive);
                 }
             }
             return;
         }
    }

    state.zeroDataCount = 0;
    if (state.recoveryAttempts > 0) state.recoveryAttempts = 0;

    // ★ Zero Alloc & Input Decimation
    let sumSquares = 0;
    const numChannels = inputBuffer.numberOfChannels;
    const len = ch0.length;

    for (let c = 0; c < numChannels; c++) {
        const data = inputBuffer.getChannelData(c);
        // ★ DECIMATION: Step by DECIMATION_STEP (e.g., 4) to skip samples
        for (let i = 0; i < len; i += DECIMATION_STEP) {
            const s = data[i];
            sumSquares += s * s;
        }
    }

    const totalSamplesProcessed = (len / DECIMATION_STEP) * numChannels;
    const meanSquare = sumSquares / totalSamplesProcessed;

    if (!isFinite(meanSquare)) return;

    let vol = (v && !v.muted) ? v.volume : 1.0;
    if (vol < 0.005) vol = 0.005;
    const correctionFactor = 1.0 / vol;
    const correctedMeanSquare = meanSquare * (correctionFactor * correctionFactor);

    dsp.history[dsp.cursor] = correctedMeanSquare;
    dsp.cursor = (dsp.cursor + 1);
    if (dsp.cursor >= dsp.historySize) dsp.cursor = 0;

    state.currentMomentaryLUFS = calculateLoudnessFromCircular(dsp.history, dsp.historySize, dsp.cursor, dsp.momBlocks, false);

    let targetBlocks = state.cachedStats.isMusic ? dsp.shortBlocksMusic : dsp.shortBlocks;
    if (state.usePseudoStable) targetBlocks = dsp.pseudoBlocks;

    state.currentShortLUFS = calculateLoudnessFromCircular(dsp.history, dsp.historySize, dsp.cursor, targetBlocks, true);
    state.currentIntegLUFS = calculateLoudnessFromCircular(dsp.history, dsp.historySize, dsp.cursor, dsp.historySize, true);
}

function initAudio(optionalVideo) {
    if (state.isBypassed) return;
    if (state.forceIgnoreNative) enforceNativeOffNow();
    const v = optionalVideo || findTargetVideo();
    if (!v) return;

    // ★Fix: latencyHint: 'playback' は維持。音飛び防止に効果的。
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'playback' });
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // ★FIX: Avoid full reset if video element is the same (handles quality changes gracefully)
    // Only reset logic if it's a completely different video element or URL changed significantly
    // (Ignoring blob: URLs often used for media segments)
    const isNewElement = (v !== currentTargetVideo);

    if (isNewElement || (v.src !== state.lastVideoSrc && !v.src.startsWith('blob:'))) {
        console.log('[Normalizer] New video context detected. Init.');
        // State Reset
        state.isNavigating = false;
        state.currentGain = 1.0;
        state.zeroDataCount = 0;
        state.recoveryAttempts = 0;
        state.playingSilenceCount = 0;
        state.lastVideoTime = 0;
        state.isRecovering = false;
        state.isBypassed = false;
        state.cachedStats = { diff: null, isMusic: false, isLive: false, isNorm: false };
        state.isConfirmedLive = false;
        state.stickyStats = null;
        scanLock = false;

        const fs = audioCtx ? audioCtx.sampleRate : 48000;
        const integBlocks = Math.ceil(CONFIG.WINDOW_SECONDS_INTEGRATED * fs / dsp.bufferSize);

        dsp.historySize = integBlocks;
        dsp.history = new Float32Array(integBlocks).fill(0);
        dsp.cursor = 0;
        dsp.momBlocks = Math.ceil(CONFIG.WINDOW_SECONDS_MOMENTARY * fs / dsp.bufferSize);
        dsp.shortBlocks = Math.ceil(CONFIG.WINDOW_SECONDS_SHORT * fs / dsp.bufferSize);
        dsp.shortBlocksMusic = Math.ceil(CONFIG.WINDOW_SECONDS_SHORT_MUSIC * fs / dsp.bufferSize);
        dsp.pseudoBlocks = Math.ceil(CONFIG.WINDOW_SECONDS_PSEUDO_STABLE * fs / dsp.bufferSize);
        dsp.integBlocks = integBlocks;

        state.currentMomentaryLUFS = -100;
        state.currentShortLUFS = -100;
        state.currentIntegLUFS = -100;

        // Note: cleanupAudioNodes preserves source ref if possible, so we call it here to clear filters
        cleanupAudioNodes();
        updateIndicator('init', 1.0, -99, CONFIG.TARGET_LUFS, {isOn:true, source:'Init'});
    }

    currentTargetVideo = v;
    state.lastVideoSrc = v.src;

    if (!hookedVideos.has(v)) ensureCrossorigin(v);

    try {
        // ★FIX: Check cache before creating MediaElementSource to prevent InvalidStateError
        if (!nodes.source || nodes.source.mediaElement !== v) {
            if (sourceCache.has(v)) {
                nodes.source = sourceCache.get(v);
            } else {
                try {
                    nodes.source = audioCtx.createMediaElementSource(v);
                    sourceCache.set(v, nodes.source);
                } catch(e) {
                    // Fail silently or try to recover if already connected
                    console.warn('MediaElementSource creation error, possibly already connected:', e);
                    // Attempt to reuse if nodes.source exists but we weren't sure
                    if (!nodes.source) return;
                }
            }
        }

        if (nodes.source && !nodes.processor) {
            // Filters
            nodes.kShelf = audioCtx.createBiquadFilter(); nodes.kShelf.type = "highshelf"; nodes.kShelf.frequency.value = 1500; nodes.kShelf.gain.value = 4.0;
            nodes.kHighPass = audioCtx.createBiquadFilter(); nodes.kHighPass.type = "highpass"; nodes.kHighPass.frequency.value = CONFIG.LOW_CUT_FREQ;
            // Analyzer
            nodes.processor = audioCtx.createScriptProcessor(dsp.bufferSize, 2, 1);
            nodes.processor.onaudioprocess = e => processAudioBlock(e.inputBuffer);
            nodes.muteGain = audioCtx.createGain(); nodes.muteGain.gain.value = 0;

            // Connections
            nodes.source.connect(nodes.kShelf); nodes.kShelf.connect(nodes.kHighPass);
            nodes.kHighPass.connect(nodes.processor); nodes.processor.connect(nodes.muteGain); nodes.muteGain.connect(audioCtx.destination);

            // Audio Path
            nodes.gain = audioCtx.createGain(); nodes.gain.gain.value = state.currentGain;
            // DynEQ (ISO 226)
            nodes.dynSub = audioCtx.createBiquadFilter(); nodes.dynSub.type = "lowshelf"; nodes.dynSub.frequency.value = CONFIG.DYN_EQ_SUBBASS_FREQ;
            nodes.dynLow = audioCtx.createBiquadFilter(); nodes.dynLow.type = "lowshelf"; nodes.dynLow.frequency.value = CONFIG.DYN_EQ_BASS_FREQ;
            nodes.dynMidLow = audioCtx.createBiquadFilter(); nodes.dynMidLow.type = "peaking"; nodes.dynMidLow.frequency.value = CONFIG.DYN_EQ_MIDBASS_FREQ; nodes.dynMidLow.Q.value = CONFIG.DYN_EQ_MIDBASS_Q;
            nodes.dynHigh = audioCtx.createBiquadFilter(); nodes.dynHigh.type = "highshelf"; nodes.dynHigh.frequency.value = CONFIG.DYN_EQ_TREBLE_FREQ;
            // Limiter
            nodes.limiter = audioCtx.createDynamicsCompressor(); nodes.limiter.threshold.value = -1.0; nodes.limiter.ratio.value = 20.0; nodes.limiter.attack.value = 0.002;

            nodes.source.connect(nodes.gain); nodes.gain.connect(nodes.dynSub); nodes.dynSub.connect(nodes.dynLow); nodes.dynLow.connect(nodes.dynMidLow); nodes.dynMidLow.connect(nodes.dynHigh); nodes.dynHigh.connect(nodes.limiter); nodes.limiter.connect(audioCtx.destination);
        }
        if (!state.animationId) processLoop();
    } catch (e) {
        console.error(e);
        enableBypassMode('Init Error');
    }
}

function processLoop() {
    const v = currentTargetVideo;
    if (!v) {
        if (state.animationId && (isWatchPage() || findTargetVideo())) { requestAnimationFrame(processLoop); return; }
        if (state.animationId) cancelAnimationFrame(state.animationId);
        return;
    }
    if (state.isNavigating && !isWatchPage()) { state.animationId = requestAnimationFrame(processLoop); return; }

    const now = Date.now();
    if (state.forceIgnoreNative && now - state.lastNativeEnforceTime > 1000) { enforceNativeOffNow(); state.lastNativeEnforceTime = now; }

    let silenceDuration = 0;
    if (v && !v.paused && !state.isRecovering) {
        const currentTime = v.currentTime;
        if (currentTime > state.lastVideoTime + 0.05) {
            if (state.currentShortLUFS === -100) {
                if (state.continuousSilenceStart === 0) state.continuousSilenceStart = now;
                silenceDuration = now - state.continuousSilenceStart;
            } else {
                state.continuousSilenceStart = 0;
                state.lastValidLUFS = state.currentShortLUFS;
            }
        }
        state.lastVideoTime = currentTime;
    }

    if (state.isBypassed) {
        updateIndicator('failed', 1.0, -100, CONFIG.TARGET_LUFS, state.nativeStateInfo);
        state.animationId = requestAnimationFrame(processLoop);
        return;
    }
    if (!audioCtx) { state.animationId = requestAnimationFrame(processLoop); return; }

    if (!state.isConfirmedLive) {
        let targetId = null;
        if (location.pathname.includes('/shorts/')) {
             const ar = document.querySelector('ytd-reel-video-renderer[is-active]');
             if (ar) targetId = ar.getAttribute('data-video-id');
        } else targetId = new URLSearchParams(window.location.search).get('v');

        if(!targetId) { try { const d = win.document.getElementById('movie_player')?.getVideoData(); if(d) targetId = d.video_id; } catch(e){} }
        if (targetId && checkLiveRobustly(targetId)) state.isConfirmedLive = true;
    }

    const st = getYouTubeStats();
    const diff = st ? st.diff : null;
    let mode = 'waiting-silence';
    let gain = 1.0;
    let dispLUFS = -100;
    const currentTargetLUFS = (st && st.isMusic) ? CONFIG.TARGET_LUFS_MUSIC : CONFIG.TARGET_LUFS;
    let effTgt = currentTargetLUFS;
    const nativeCheck = checkNativeStableVolume(st.isMusic === true);
    state.nativeStateInfo = nativeCheck;

    if (diff !== null && state.isConfirmedLive && v && v.duration !== Infinity && !isNaN(v.duration)) state.isConfirmedLive = false;

    // --- Dynamic EQ (FIXED) ---
    if (state.useDynamicEQ && nodes.dynSub && !state.isRecovering) {
        let bs=0, bl=0, bm=0, bh=0;
        const currentRef = state.currentShortLUFS;
        if (currentRef > -100) {
            // FIX: Initialize deficit to 0.
            // If the volume is at the AGC target (Ref), we shouldn't boost just because the original file was quiet.
            let deficit = 0;

            let vol = v.volume; if (vol < 0.001) vol = 0.001;
            let refVol = state.dynEqRefVolume; if (refVol < 0.01) refVol = 0.01;

            // Attenuation: negative if vol > refVol
            let att = -20 * safeLog10(vol / refVol);

            // FIX: Allow negative attenuation (de-boost) but cap it at the slider range limit
            att = Math.min(att, CONFIG.VOL_SLIDER_DYNAMIC_RANGE);

            deficit += att;

            if (deficit > 0) {
                const f = Math.min(deficit / 40.0, 1.0);
                bs = f * CONFIG.DYN_EQ_MAX_SUBBASS;
                bl = f * CONFIG.DYN_EQ_MAX_BASS;
                bm = f * CONFIG.DYN_EQ_MAX_MIDBASS;
                bh = f * CONFIG.DYN_EQ_MAX_TREBLE;
            }
        }
        nodes.dynSub.gain.setTargetAtTime(bs, audioCtx.currentTime, 0.2);
        nodes.dynLow.gain.setTargetAtTime(bl, audioCtx.currentTime, 0.2);
        nodes.dynMidLow.gain.setTargetAtTime(bm, audioCtx.currentTime, 0.2);
        nodes.dynHigh.gain.setTargetAtTime(bh, audioCtx.currentTime, 0.2);
    } else if (nodes.dynLow) {
        nodes.dynSub.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        nodes.dynLow.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        nodes.dynMidLow.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
        nodes.dynHigh.gain.setTargetAtTime(0, audioCtx.currentTime, 0.2);
    }

    // --- AGC / Static ---
    if (state.forceAGC || state.isConfirmedLive || st.isLive || diff === null) {
        let hL = -100;
        const mL = state.currentMomentaryLUFS, sL = state.currentShortLUFS, iL = state.currentIntegLUFS;
        if (mL > -100 && sL > -100) hL = (mL > sL) ? (mL * 0.6 + sL * 0.4) : (mL * 0.1 + sL * 0.9);
        else if (sL > -100) hL = sL; else if (iL > -100) hL = iL;

        dispLUFS = hL;
        effTgt = currentTargetLUFS + CONFIG.AGC_OFFSET;

        if (state.isRecovering) mode = 'recovering';
        else if (isFinite(dispLUFS) && dispLUFS > CONFIG.SILENCE_THRESHOLD) {
            mode = (state.isConfirmedLive || st.isLive) ? 'agc-live' : 'agc';
            gain = Math.pow(10, (effTgt - dispLUFS)/20);
        } else if (silenceDuration > 0 && silenceDuration < CONFIG.AGC_HOLD_TIME && state.lastValidLUFS > CONFIG.SILENCE_THRESHOLD) {
            mode = 'agc-hold';
            gain = Math.pow(10, (effTgt - state.lastValidLUFS)/20);
            dispLUFS = state.lastValidLUFS;
        } else {
            mode = 'waiting-silence';
            if (!v.seeking && v.networkState !== 2 && silenceDuration > CONFIG.RECOVERY_THRESHOLD) performRecovery(false);
        }
    } else if (diff !== null) {
        const effectiveDiff = (diff > 0) ? 0 : diff;
        if (nativeCheck.isOn) {
            mode = 'native-bypass-setting';
            dispLUFS = -14.0 + effectiveDiff;
            gain = 1.0;
        } else {
            mode = 'static';
            gain = Math.pow(10, -effectiveDiff / 20);
            dispLUFS = -14.0 + effectiveDiff;
        }
    }

    if (mode === 'recovering' || mode === 'bypassed') gain = 1.0;
    gain = Math.min(gain, CONFIG.MAX_BOOST);

    if (mode.startsWith('static') || mode.startsWith('native')) {
        state.currentGain = gain;
        if (nodes.gain && isFinite(state.currentGain)) nodes.gain.gain.setTargetAtTime(state.currentGain, audioCtx.currentTime, 0.01);
    } else {
        const speed = (gain < state.currentGain) ? CONFIG.ATTACK_SPEED : CONFIG.RELEASE_SPEED;
        state.currentGain += (gain - state.currentGain) * speed;
        if (nodes.gain && isFinite(state.currentGain)) nodes.gain.gain.setTargetAtTime(state.currentGain, audioCtx.currentTime, 0.05);
    }

    updateIndicator(mode, state.currentGain, dispLUFS, effTgt, state.nativeStateInfo);
    state.animationId = requestAnimationFrame(processLoop);
}

setInterval(() => {
    const active = findTargetVideo();
    if (!active) { if (currentTargetVideo && !document.contains(currentTargetVideo)) fullReset(); return; }
    if (active && (active !== currentTargetVideo || active.src !== state.lastVideoSrc)) initAudio(active);
    updateVisibility();
}, 500);

['click','keydown','scroll'].forEach(e => document.addEventListener(e, () => { if(audioCtx && audioCtx.state==='suspended') audioCtx.resume(); }, {capture:true, passive:true}));
if (window.navigation) window.navigation.addEventListener('navigate', () => setTimeout(initAudio, 50));
window.addEventListener('load', () => { initIndicator(); initAudio(); });
})();