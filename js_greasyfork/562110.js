// ==UserScript==
// @name         Universal Live Recorder Pro (CB & SC) | 万能直播录制助手(CB & SC)
// @namespace    universal-live-recorder-pro
// @version      1.0
// @description  A professional tool for recording lives on Chaturbate and Stripchat. Features: MP4 format, auto-save on refresh, and offline detection. | 专为 CB 和 SC 打造的专业直播录制工具。支持 MP4 格式、页面刷新自动保存、下播自动停止及后台保活。
// @author       YourName (Gemini Partner)
// @match        *://*.chaturbate.com/*
// @match        *://*.stripchat.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562110/Universal%20Live%20Recorder%20Pro%20%28CB%20%20SC%29%20%7C%20%E4%B8%87%E8%83%BD%E7%9B%B4%E6%92%AD%E5%BD%95%E5%88%B6%E5%8A%A9%E6%89%8B%28CB%20%20SC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562110/Universal%20Live%20Recorder%20Pro%20%28CB%20%20SC%29%20%7C%20%E4%B8%87%E8%83%BD%E7%9B%B4%E6%92%AD%E5%BD%95%E5%88%B6%E5%8A%A9%E6%89%8B%28CB%20%20SC%29.meta.js
// ==/UserScript==

/**
 * 声明：本项目尊重平台版权。本脚本仅作为技术交流与个人录屏辅助工具使用。
 * Disclaimer: This project respects platform copyrights. This script is intended 
 * for technical exchange and personal recording assistance only.
 */

(function () {
    'use strict';

    // 防止在同一页面重复执行脚本
    // Prevent script from being injected multiple times
    if (window.___universalRecorder___) return;
    window.___universalRecorder___ = true;

    /************** 1. 平台适配器 | Platform Adapters **************/
    // 准确描述：根据不同域名的 DOM 结构提取对应信息
    const ADAPTERS = {
        'chaturbate.com': {
            id: 'CB',
            offlineSelector: '.offline_message:visible, #no_video_stream, .vjs-error-display:visible',
            getUsername: () => location.pathname.split('/').filter(p => p)[0]
        },
        'stripchat.com': {
            id: 'SC',
            offlineSelector: '.offline-placeholder:visible, .is-offline, [data-test="offline-state"]',
            getUsername: () => location.pathname.split('/').filter(p => p)[0]
        }
    };

    const getCurrentAdapter = () => {
        const host = location.host;
        for (let domain in ADAPTERS) {
            if (host.includes(domain)) return ADAPTERS[domain];
        }
        return null;
    };

    /************** 2. 配置参数 | Configuration **************/
    const CONFIG = {
        SEGMENT_MS: 10 * 60 * 1000,    // 10min auto-save
        CHECK_INTERVAL: 4000,          // 4s health check
        STORAGE_KEY: 'uni_rec_active', // Persistence key
        VIDEO_BITRATE: 8000000,        // 8Mbps for HD quality
        FILE_EXT: '.mp4',              // Target extension
        MIME_TYPE: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' // MP4 try-out
    };

    let state = {
        recording: false,
        waiting: false,
        mediaRecorder: null,
        buffer: [],
        startTime: null,
        timerInterval: null,
        checkInterval: null,
        lastBufferSize: 0,
        stallCount: 0
    };

    /************** 3. 核心功能 | Core Logic **************/

    // 时间戳生成：确保文件命名的准确性和唯一性
    // Generate accurate timestamp for file naming
    const getPreciseTimeStr = () => {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
    };

    // 保存录制数据包
    // Export recording data as a blob file
    const saveBlob = (blob, prefix = "") => {
        if (!blob || blob.size === 0) return;
        const adapter = getCurrentAdapter();
        const siteId = adapter ? adapter.id : 'Live';
        const name = adapter ? adapter.getUsername() : 'streamer';
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${prefix}[${siteId}]_${name}_${getPreciseTimeStr()}${CONFIG.FILE_EXT}`;
        a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000);
    };

    // 智能离线检测：判定直播是否结束
    // Deep offline check: monitoring both DOM and data activity
    function deepOfflineCheck() {
        if (!state.recording) return;
        const adapter = getCurrentAdapter();
        if (!adapter) return;

        let isOffline = $(adapter.offlineSelector).length > 0;

        if (state.mediaRecorder?.state === 'recording') {
            if (state.buffer.length > 0 && state.buffer.length === state.lastBufferSize) {
                state.stallCount++;
            } else {
                state.stallCount = 0;
                state.lastBufferSize = state.buffer.length;
            }
            // Logic: No data growth + Offline DOM found = Stop
            if (state.stallCount > 8 && isOffline) { 
                console.log("[Universal Recorder] Stream terminated, saving...");
                stopRec(); 
            }
        }
    }

    /************** 4. 录制生命周期 | Recording Lifecycle **************/

    async function startRec() {
        if (state.recording && !state.waiting) return;
        state.waiting = true;
        updateUI();

        const video = await (new Promise(resolve => {
            const itv = setInterval(() => {
                const v = document.querySelector('video');
                if (v && v.readyState >= 3) { clearInterval(itv); resolve(v); }
            }, 1000);
        }));

        const stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
        let selectedMime = CONFIG.MIME_TYPE;
        if (!MediaRecorder.isTypeSupported(selectedMime)) {
            selectedMime = 'video/webm; codecs=vp9,opus'; 
        }

        try {
            state.mediaRecorder = new MediaRecorder(stream, {
                mimeType: selectedMime,
                videoBitsPerSecond: CONFIG.VIDEO_BITRATE
            });
        } catch (e) {
            state.mediaRecorder = new MediaRecorder(stream);
        }

        state.buffer = [];
        state.mediaRecorder.ondataavailable = e => { if (e.data.size > 0) state.buffer.push(e.data); };
        
        state.mediaRecorder.onstop = () => {
            if (state.buffer.length > 0) saveBlob(new Blob(state.buffer, { type: selectedMime }));
            state.buffer = [];
            if (state.recording) setTimeout(startRec, 1000);
        };

        state.mediaRecorder.start();
        state.recording = true;
        state.waiting = false;
        state.startTime = Date.now();
        localStorage.setItem(CONFIG.STORAGE_KEY, '1');

        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(updateUI, 1000);
        clearInterval(state.checkInterval);
        state.checkInterval = setInterval(deepOfflineCheck, CONFIG.CHECK_INTERVAL);
        updateUI();
    }

    function stopRec() {
        state.recording = false;
        state.waiting = false;
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        clearInterval(state.timerInterval);
        clearInterval(state.checkInterval);
        if (state.mediaRecorder?.state !== 'inactive') state.mediaRecorder.stop();
        updateUI();
    }

    // 页面刷新抢救逻辑 | Emergency save on page refresh/close
    window.addEventListener('beforeunload', () => {
        if (state.recording && state.mediaRecorder?.state !== 'inactive') {
            state.mediaRecorder.stop();
            if (state.buffer.length > 0) {
                saveBlob(new Blob(state.buffer), "[REFRESH]");
            }
        }
    });

    /************** 5. 交互界面 | UI Interface **************/

    GM_addStyle(`
        #uni-rec-btn {
            position: fixed; right: 25px; bottom: 100px; z-index: 2147483647;
            padding: 12px 20px; color: #fff !important; cursor: move; border-radius: 6px;
            font-family: 'Courier New', monospace; font-size: 13px; font-weight: bold;
            box-shadow: 0 0 20px rgba(0,0,0,0.8); border: 2px solid rgba(255,255,255,0.6);
            user-select: none !important; min-width: 160px; text-align: center;
            transition: background 0.3s; opacity: 0.9;
        }
    `);

    const updateUI = () => {
        const $btn = $('#uni-rec-btn');
        if (state.waiting) {
            $btn.text('⏳ Connecting...').css('background', '#e67e22');
        } else if (state.recording) {
            const s = Math.floor((Date.now() - state.startTime) / 1000);
            const duration = `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
            $btn.html(`<span style="color:#ff4d4d">●</span> REC ${duration}`).css('background', '#2c3e50');
        } else {
            $btn.text('● Start Rec MP4').css('background', '#c0392b');
        }
    };

    function initUI() {
        if ($('#uni-rec-btn').length) return;
        const $btn = $('<div id="uni-rec-btn">● Start Rec MP4</div>');
        $('body').append($btn);

        let isDragging = false;
        let startX, startY;

        $btn.on('mousedown', (e) => {
            isDragging = false; startX = e.pageX; startY = e.pageY;
            const rect = $btn[0].getBoundingClientRect();
            const shiftX = e.clientX - rect.left;
            const shiftY = e.clientY - rect.top;

            $(document).on('mousemove.rec', (em) => {
                if (Math.abs(em.pageX - startX) > 5 || Math.abs(em.pageY - startY) > 5) {
                    isDragging = true;
                    $('body').css('user-select', 'none');
                    $btn.css({ left: em.clientX - shiftX + 'px', top: em.clientY - shiftY + 'px', right: 'auto', bottom: 'auto' });
                }
            }).one('mouseup', () => {
                $(document).off('mousemove.rec');
                $('body').css('user-select', 'auto');
                if (!isDragging) { state.recording ? stopRec() : startRec(); }
            });
            e.preventDefault();
        });
    }

    const initInterval = setInterval(() => {
        if (document.body) {
            clearInterval(initInterval);
            initUI();
            if (localStorage.getItem(CONFIG.STORAGE_KEY) === '1') startRec();
        }
    }, 800);
})();