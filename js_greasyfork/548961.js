// ==UserScript==
// @name         Bilibili 音频模式(audio-only)
// @namespace    bilibili-audio-only-floating
// @version      2.0.1
// @description  悬浮按钮一键切换“仅音频播放，不解码视频轨道”，降低CPU/GPU占用；
// @author       you
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @run-at       document-idle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548961/Bilibili%20%E9%9F%B3%E9%A2%91%E6%A8%A1%E5%BC%8F%28audio-only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548961/Bilibili%20%E9%9F%B3%E9%A2%91%E6%A8%A1%E5%BC%8F%28audio-only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const log = (...a) => console.log('[Bili-AudioOnly]', ...a);

    // 读取 dash 播放信息
    function readPlayInfo() {
        try {
            if (unsafeWindow && unsafeWindow.__playinfo__) return unsafeWindow.__playinfo__;
        } catch { }
        const scripts = Array.from(document.scripts || []);
        for (const s of scripts) {
            const txt = s.textContent || '';
            if (txt.includes('"dash"') && (txt.includes('"audio"') || txt.includes('"video"'))) {
                try {
                    const m = txt.match(/__playinfo__\s*=\s*(\{.+?\})\s*;?/s);
                    if (m) return JSON.parse(m[1]);
                    if (txt.trim().startsWith('{') && txt.trim().endsWith('}')) {
                        return JSON.parse(txt.trim());
                    }
                } catch { }
            }
        }
        return null;
    }
    function pickBestAudioUrl(playInfo) {
        if (!playInfo?.data?.dash?.audio) return null;
        const audios = playInfo.data.dash.audio.slice().sort((a, b) => (b.bandwidth || 0) - (a.bandwidth || 0));
        const first = audios[0];
        return first?.baseUrl || first?.backupUrl?.[0] || null;
    }
    function queryPlayerVideo() {
        const list = document.querySelectorAll('video');
        for (const v of list) if (v && typeof v.play === 'function') return v;
        return null;
    }

    // 悬浮按钮样式
    function ensureStyle() {
        if (document.getElementById('bao-float-style')) return;
        const css = `
      #bao-float {
        position: fixed;
        z-index: 2147483647;
        left: 0; top: 96px;
        user-select: none;
      }
      #bao-float .bao-btn {
        display: inline-flex; align-items: center; gap: .4em;
        padding: .42em .88em; border-radius: .7em;
        background: rgba(0,0,0,.55); color: #fff;
        font-size: 13px; cursor: pointer;
        border: 1px solid rgba(255,255,255,.18);
        box-shadow: 0 4px 14px rgba(0,0,0,.25);
        transition: background .18s ease, transform .08s ease;
      }
      #bao-float .bao-btn:hover { background: rgba(0,0,0,.7); }
      #bao-float .bao-btn:active { transform: translateY(1px); }
      #bao-float .bao-badge {
        font-size: 11px; padding: 0 .44em;
        border: 1px solid rgba(255,255,255,.32);
        border-radius: .4em; opacity: .88;
      }
      .bao-hidden { visibility: hidden !important; }
    `;
        const style = document.createElement('style');
        style.id = 'bao-float-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 悬浮按钮
    let floatWrap, theBtn;
    function createFloatingButton() {
        ensureStyle();
        if (document.getElementById('bao-float')) return document.getElementById('bao-float');

        floatWrap = document.createElement('div');
        floatWrap.id = 'bao-float';
        theBtn = document.createElement('button');
        theBtn.className = 'bao-btn';
        theBtn.title = '切换仅音频播放（不解码视频）';
        theBtn.textContent = '🎧 音频模式';
        const badge = document.createElement('span');
        badge.className = 'bao-badge';
        badge.textContent = 'OFF';
        theBtn.appendChild(badge);

        floatWrap.appendChild(theBtn);
        document.body.appendChild(floatWrap);

        // 拖拽
        let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
        floatWrap.addEventListener('mousedown', (e) => {
            dragging = true; sx = e.clientX; sy = e.clientY;
            const rect = floatWrap.getBoundingClientRect(); ox = rect.left; oy = rect.top;
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const nx = ox + (e.clientX - sx);
            const ny = oy + (e.clientY - sy);
            floatWrap.style.left = Math.max(0, nx) + 'px';
            floatWrap.style.top = Math.max(0, ny) + 'px';
        });
        window.addEventListener('mouseup', () => dragging = false);

        return floatWrap;
    }

    function updateButton(on) {
        if (!theBtn) return;
        const badge = theBtn.querySelector('.bao-badge');
        if (badge) {
            badge.textContent = on ? 'ON' : 'OFF';
            badge.style.background = on ? 'rgba(76,175,80,.25)' : 'transparent';
        }
        theBtn.title = on ? '当前仅音频播放；点击恢复视频' : '点击切换到仅音频播放';
    }

    let audioMode = false;

    function queryMainVideo() {
        const vs = Array.from(document.querySelectorAll('video'));
        // 过滤掉宽高为0或不可见的幽灵节点
        const cand = vs.filter(v => typeof v.play === 'function');
        // B站通常有两个video，选有声音输出的那个；退化就取第一个
        return cand.find(v => !v.muted) || cand[0] || null;
    }

    // 暂停/静音其他 video，避免双音频
    function silenceOtherVideos(main) {
        const vs = Array.from(document.querySelectorAll('video'));
        for (const v of vs) {
            if (v === main) continue;
            try { v.pause(); } catch { }
            v.muted = true;
            v.style.visibility = 'hidden'; // 防止叠层闪烁
        }
    }

    // 启/禁视频轨道（不破坏 MSE）
    function setVideoTrackEnabled(video, enabled) {
        try {
            if (video.videoTracks && video.videoTracks.length) {
                for (const t of video.videoTracks) t.enabled = enabled;
                return true;
            }
        } catch { }
        return false;
    }

    async function applyAudioOnly(enable) {
        const video = queryMainVideo();
        if (!video) { log('未找到主 <video>'); return; }

        // 确保只保留一个媒体在播
        silenceOtherVideos(video);

        if (enable) {
            // 禁用视频轨道（关键：阻断视频解码/渲染）
            const ok = setVideoTrackEnabled(video, false);

            // 退化处理：若浏览器无 videoTracks，就只隐藏画面（仍可能解码，但不渲染）
            if (!ok) {
                video.style.visibility = 'hidden';
                // 也可选：video.style.opacity = '0'; video.style.width='1px'; video.style.height='1px';
            }

            // 确保有声音输出
            try { video.muted = false; } catch { }
            // try { await video.play(); } catch (e) { log('video play() 失败：', e); }

            audioMode = true;
            localStorage.setItem('bao_audio_mode', '1');
            updateButton(true);

        } else {
            // 恢复正常播放
            // 重新启用视频轨道
            setVideoTrackEnabled(video, true);

            // 恢复可见
            video.style.visibility = '';

            // 继续播放
            try { await video.play(); } catch (e) { log('video play() 失败：', e); }

            audioMode = false;
            localStorage.removeItem('bao_audio_mode');
            updateButton(false);
        }
    }


    // SPA 导航适配
    function hookNavigation(callback) {
        const pushState = history.pushState;
        const replaceState = history.replaceState;
        history.pushState = function () {
            const ret = pushState.apply(this, arguments);
            setTimeout(callback, 0); return ret;
        };
        history.replaceState = function () {
            const ret = replaceState.apply(this, arguments);
            setTimeout(callback, 0); return ret;
        };
        window.addEventListener('popstate', () => setTimeout(callback, 0));
    }

    // 初始化启动 
    async function boot() {
        createFloatingButton();
        // updateButton(true);

        // 等待视频节点出现
        for (let i = 0; i < 30; i++) {
            if (queryPlayerVideo()) break;
            await sleep(200);
        }

        // 点击事件
        theBtn.addEventListener('click', async () => {
            try { await applyAudioOnly(!audioMode); } catch (e) { log('切换失败：', e); }
        });
    }

    hookNavigation(() => {
        // 切到新视频时保持按钮在左上角，不进入播放器容器
        setTimeout(boot, 200);
    });

    boot();

    setInterval(() => {
        // 避免下一个视频的时候又出现视频画面
        if (audioMode) {
            applyAudioOnly(true);
        }
    }, 500)
})();