// ==UserScript==
// @name         YouTube Video Downloader
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  在 YouTube 影片頁面添加下載按鈕
// @author       Da
// @license MIT
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      yourimg.cc
// @connect      www.yourimg.cc
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560785/YouTube%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560785/YouTube%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FORMATS = [
        { id: '18', label: '360p', ext: 'mp4' },
        { id: '22', label: '720p', ext: 'mp4' },
        { id: '137', label: '1080p', ext: 'mp4' },
        { id: '140', label: '純音訊', ext: 'm4a' },
    ];

    const CONNECT_TIMEOUT = 15000;  // 連線超時 15 秒
    const STALL_TIMEOUT = 20000;    // 下載卡住 20 秒

    GM_addStyle(`
        .ytdl-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            margin-left: 8px;
            background: #065fd4;
            color: white;
            border: none;
            border-radius: 18px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }
        .ytdl-btn:hover { background: #0056b8; }
        .ytdl-btn svg { width: 18px; height: 18px; }
        .ytdl-menu {
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 8px;
            background: #212121;
            border-radius: 12px;
            padding: 8px 0;
            min-width: 140px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.4);
            z-index: 9999;
            display: none;
        }
        .ytdl-menu.show { display: block; }
        .ytdl-menu-item {
            padding: 10px 16px;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }
        .ytdl-menu-item:hover { background: #3a3a3a; }
        .ytdl-wrapper { position: relative; display: inline-block; }

        .ytdl-toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: #282828;
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            min-width: 280px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        }
        .ytdl-toast.show { transform: translateX(0); }
        .ytdl-toast-title { font-weight: 600; margin-bottom: 6px; }
        .ytdl-toast-sub { color: #aaa; font-size: 13px; margin-bottom: 12px; }
        .ytdl-toast-bar-wrap { height: 4px; background: #444; border-radius: 2px; overflow: hidden; }
        .ytdl-toast-bar { height: 100%; width: 0%; background: #3ea6ff; transition: width 0.3s; }
        .ytdl-toast-bar.anim { animation: ytdl-pulse 1.5s ease-in-out infinite; }
        @keyframes ytdl-pulse {
            0%, 100% { width: 20%; margin-left: 0; }
            50% { width: 40%; margin-left: 60%; }
        }
        .ytdl-toast.done .ytdl-toast-bar { background: #4caf50; width: 100%; }
        .ytdl-toast.fail .ytdl-toast-bar { background: #f44336; width: 100%; }
        .ytdl-toast.warn .ytdl-toast-bar { background: #ff9800; }
        .ytdl-toast-actions {
            margin-top: 12px;
            display: flex;
            gap: 8px;
        }
        .ytdl-toast-btn {
            padding: 6px 14px;
            background: #444;
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 13px;
        }
        .ytdl-toast-btn:hover { background: #555; }
        .ytdl-toast-btn.primary { background: #065fd4; }
        .ytdl-toast-btn.primary:hover { background: #0056b8; }
    `);

    function createIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z');
        svg.appendChild(path);
        return svg;
    }

    let videoId = null;
    let container = null;
    let toast = null;
    let request = null;
    let connectTimer = null;
    let stallTimer = null;

    const getVideoId = () => new URLSearchParams(location.search).get('v');

    const getTitle = () => {
        const el = document.querySelector('h1 yt-formatted-string');
        return (el?.textContent?.trim() || 'video').replace(/[<>:"/\\|?*]/g, '');
    };

    const fmtSize = (b) => {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(1) + ' MB';
    };

    function getToast() {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'ytdl-toast';

            const title = document.createElement('div');
            title.className = 'ytdl-toast-title';

            const sub = document.createElement('div');
            sub.className = 'ytdl-toast-sub';

            const barWrap = document.createElement('div');
            barWrap.className = 'ytdl-toast-bar-wrap';

            const bar = document.createElement('div');
            bar.className = 'ytdl-toast-bar';
            barWrap.appendChild(bar);

            const actions = document.createElement('div');
            actions.className = 'ytdl-toast-actions';

            toast.append(title, sub, barWrap, actions);
            document.body.appendChild(toast);
        }
        return toast;
    }

    function showToast(opts) {
        const t = getToast();
        t.querySelector('.ytdl-toast-title').textContent = opts.title || '';
        t.querySelector('.ytdl-toast-sub').textContent = opts.sub || '';

        const bar = t.querySelector('.ytdl-toast-bar');
        const actions = t.querySelector('.ytdl-toast-actions');

        t.classList.remove('done', 'fail', 'warn');
        bar.classList.remove('anim');

        if (opts.progress === 'loading') {
            bar.classList.add('anim');
        } else if (typeof opts.progress === 'number') {
            bar.style.width = opts.progress + '%';
        }

        if (opts.state === 'done') t.classList.add('done');
        if (opts.state === 'fail') t.classList.add('fail');
        if (opts.state === 'warn') t.classList.add('warn');

        // 按鈕
        actions.textContent = '';
        if (opts.buttons) {
            opts.buttons.forEach(btn => {
                const el = document.createElement('button');
                el.className = 'ytdl-toast-btn' + (btn.primary ? ' primary' : '');
                el.textContent = btn.text;
                el.onclick = btn.onClick;
                actions.appendChild(el);
            });
        }

        t.classList.add('show');

        if (opts.autoHide) {
            setTimeout(hideToast, opts.autoHide);
        }
    }

    function hideToast() {
        toast?.classList.remove('show');
    }

    function clearTimers() {
        clearTimeout(connectTimer);
        clearTimeout(stallTimer);
        connectTimer = null;
        stallTimer = null;
    }

    function cancelDownload() {
        request?.abort();
        clearTimers();
        hideToast();
    }

    function download(fmt) {
        // 先取消之前的
        cancelDownload();

        const title = getTitle();
        const filename = `${title}.${fmt.ext}`;

        const url = 'https://www.yourimg.cc/downloader/download?' + new URLSearchParams({
            url: location.href,
            id: fmt.id,
            ext: fmt.ext,
            title: title
        });

        showToast({
            title: `下載 ${fmt.label}`,
            sub: '連線中...',
            progress: 'loading',
            buttons: [{ text: '取消', onClick: cancelDownload }]
        });

        const start = Date.now();
        let lastLoaded = 0;
        let lastTime = start;
        let connected = false;

        // 連線超時檢測
        connectTimer = setTimeout(() => {
            if (!connected) {
                showToast({
                    title: '⚠️ 連線緩慢',
                    sub: `此畫質(${fmt.label})可能不可用，繼續等待或換其他畫質？`,
                    progress: 'loading',
                    state: 'warn',
                    buttons: [
                        { text: '繼續等待', onClick: () => {
                            // 重設超時
                            connectTimer = setTimeout(() => {
                                if (!connected) {
                                    showToast({
                                        title: '❌ 連線逾時',
                                        sub: '請嘗試其他畫質',
                                        progress: 0,
                                        state: 'fail',
                                        autoHide: 4000
                                    });
                                    request?.abort();
                                }
                            }, CONNECT_TIMEOUT);
                        }},
                        { text: '取消', onClick: cancelDownload }
                    ]
                });
            }
        }, CONNECT_TIMEOUT);

        // 下載卡住檢測
        function resetStallTimer() {
            clearTimeout(stallTimer);
            stallTimer = setTimeout(() => {
                showToast({
                    title: '⚠️ 下載似乎卡住了',
                    sub: `已下載 ${fmtSize(lastLoaded)}，20秒無進度`,
                    progress: 'loading',
                    state: 'warn',
                    buttons: [
                        { text: '繼續等待', onClick: resetStallTimer },
                        { text: '取消', onClick: cancelDownload }
                    ]
                });
            }, STALL_TIMEOUT);
        }

        request = GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType: 'blob',
            timeout: 600000,
            onprogress: (e) => {
                connected = true;
                clearTimeout(connectTimer);

                // 有進度就重設卡住計時
                if (e.loaded > lastLoaded) {
                    lastLoaded = e.loaded;
                    lastTime = Date.now();
                    resetStallTimer();
                }

                const elapsed = (Date.now() - start) / 1000;
                const speed = e.loaded / elapsed;
                const speedStr = fmtSize(speed) + '/s';

                if (e.total) {
                    const pct = Math.round(e.loaded / e.total * 100);
                    const eta = Math.round((e.total - e.loaded) / speed);
                    const etaStr = eta > 60 ? `${Math.floor(eta/60)}分${eta%60}秒` : `${eta}秒`;
                    showToast({
                        title: `下載中 ${pct}%`,
                        sub: `${fmtSize(e.loaded)} / ${fmtSize(e.total)}　${speedStr}　剩餘 ${etaStr}`,
                        progress: pct,
                        buttons: [{ text: '取消', onClick: cancelDownload }]
                    });
                } else {
                    showToast({
                        title: '下載中',
                        sub: `${fmtSize(e.loaded)}　${speedStr}`,
                        progress: 'loading',
                        buttons: [{ text: '取消', onClick: cancelDownload }]
                    });
                }
            },
            onload: (res) => {
                clearTimers();

                if (res.status === 200 && res.response?.size > 1000) {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(res.response);
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(a.href);

                    showToast({
                        title: '✓ 下載完成',
                        sub: `${filename}（${fmtSize(res.response.size)}）`,
                        progress: 100,
                        state: 'done',
                        autoHide: 3000
                    });
                } else {
                    showToast({
                        title: '❌ 下載失敗',
                        sub: '此畫質可能不支援，請試其他選項',
                        progress: 100,
                        state: 'fail',
                        autoHide: 4000
                    });
                }
            },
            onerror: () => {
                clearTimers();
                showToast({
                    title: '❌ 下載失敗',
                    sub: '網路錯誤，請稍後再試',
                    progress: 100,
                    state: 'fail',
                    autoHide: 4000
                });
            },
            ontimeout: () => {
                clearTimers();
                showToast({
                    title: '❌ 下載逾時',
                    sub: '請稍後再試',
                    progress: 100,
                    state: 'fail',
                    autoHide: 4000
                });
            }
        });
    }

    function createUI() {
        const wrap = document.createElement('div');
        wrap.className = 'ytdl-wrapper';

        const btn = document.createElement('button');
        btn.className = 'ytdl-btn';
        btn.appendChild(createIcon());
        btn.appendChild(document.createTextNode(' 下載'));

        const menu = document.createElement('div');
        menu.className = 'ytdl-menu';

        FORMATS.forEach(fmt => {
            const item = document.createElement('div');
            item.className = 'ytdl-menu-item';
            item.textContent = fmt.label;
            item.onclick = (e) => {
                e.stopPropagation();
                menu.classList.remove('show');
                download(fmt);
            };
            menu.appendChild(item);
        });

        wrap.append(btn, menu);

        btn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        };

        document.addEventListener('click', () => menu.classList.remove('show'));

        return wrap;
    }

    function inject() {
        const vid = getVideoId();
        if (!vid || vid === videoId) return;

        container?.remove();

        const target = document.querySelector('#top-level-buttons-computed, #subscribe-button');
        if (target) {
            videoId = vid;
            container = createUI();
            target.parentNode.insertBefore(container, target.nextSibling);
        }
    }

    function init() {
        inject();

        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                videoId = null;
                setTimeout(inject, 1000);
            }
        }).observe(document.body, { subtree: true, childList: true });

        setInterval(inject, 2000);
    }

    setTimeout(init, 1000);
})();