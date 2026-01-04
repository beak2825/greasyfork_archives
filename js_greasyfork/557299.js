// ==UserScript==
// @name         あいもげYouTube連続再生ちゃん
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  スレ内の☑付きYouTubeリンクを連続再生するポップアッププレイヤー（ライブ除外・ドラッグ移動＆3カ所リサイズ・動的プレイリスト・前へ＆ループ＆長さ上限・重複埋め込み除去・引用行除外・YouTube一時プレイリスト・シャッフル／固定モード）
// @match        https://nijiurachan.net/pc/thread.php?id=*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557299/%E3%81%82%E3%81%84%E3%82%82%E3%81%92YouTube%E9%80%A3%E7%B6%9A%E5%86%8D%E7%94%9F%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557299/%E3%81%82%E3%81%84%E3%82%82%E3%81%92YouTube%E9%80%A3%E7%B6%9A%E5%86%8D%E7%94%9F%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playlistButtonAdded = false;

    // シャッフル後の固定プレイリスト管理
    let playlistFrozen = false;
    let frozenPlaylist = null;

    // ライブ配信リンクかどうか判定
    function isLiveLink(link) {
        const url = link.getAttribute('data-url') || link.href || '';
        if (!url) return false;
        if (/youtube\.com\/live\//.test(url)) return true;
        if (/youtube\.com\/watch\?v=[^&]+.*(?:[?&]live=1)/.test(url)) return true;
        return false;
    }

    // このリンクが「> で始まる行」(引用行) に属しているか判定
    function isInQuotedLine(link) {
        const bq = link.closest('blockquote');
        if (!bq) return false;

        let start = link;
        while (start.previousSibling) {
            const ps = start.previousSibling;
            if (ps.nodeType === Node.ELEMENT_NODE && ps.tagName === 'BR') {
                break;
            }
            start = ps;
        }

        let cur = start;
        while (cur) {
            if (cur.nodeType === Node.TEXT_NODE) {
                const text = cur.textContent || '';
                for (let i = 0; i < text.length; i++) {
                    const ch = text[i];
                    if (!/\s/.test(ch)) {
                        return ch === '>';
                    }
                }
            } else if (cur.nodeType === Node.ELEMENT_NODE) {
                if (cur.tagName === 'BR') {
                    break;
                }
                const text = cur.textContent || '';
                for (let i = 0; i < text.length; i++) {
                    const ch = text[i];
                    if (!/\s/.test(ch)) {
                        return ch === '>';
                    }
                }
            }

            if (cur === link) break;
            cur = cur.nextSibling;
        }

        return false;
    }

    // ---------------- プレイリスト取得 ----------------

    function getCurrentPlaylist() {
        // シャッフル後は固定プレイリストを返す（追加は反映しない）
        if (playlistFrozen && Array.isArray(frozenPlaylist) && frozenPlaylist.length) {
            return frozenPlaylist.slice();
        }

        const result = [];
        document.querySelectorAll('input.yt-playlist-checkbox').forEach(cb => {
            if (cb.checked) {
                const vid = cb.dataset.videoId;
                if (vid && !result.includes(vid)) {
                    result.push(vid);
                }
            }
        });
        return result;
    }

    // ---------------- YouTubeで開く --------------------

    function openPlaylistOnYouTube() {
        const pl = getCurrentPlaylist();
        if (!pl.length) {
            alert('☑付きのYouTubeリンク（ライブ配信以外／引用行以外）がありません。');
            return;
        }

        // URL長すぎ防止で先頭200件に制限
        const limited = pl.slice(0, 200);

        let url;
        if (limited.length === 1) {
            url = 'https://www.youtube.com/watch?v=' + encodeURIComponent(limited[0]);
        } else {
            const ids = limited.map(id => encodeURIComponent(id)).join(',');
            url = 'https://www.youtube.com/watch_videos?video_ids=' + ids;
        }

        window.open(url, '_blank', 'noopener');
    }

    // ---------------- Shuffle -------------------------

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    function shufflePlaylistAndRestart() {
        let pl = getCurrentPlaylist();
        if (!pl.length) {
            alert('☑付きのYouTubeリンク（ライブ配信以外／引用行以外）がありません。');
            return;
        }

        // 1件ならそのまま固定にして再生
        if (pl.length === 1) {
            frozenPlaylist = pl.slice();
            playlistFrozen = true;
            currentVideoId = pl[0];
            if (ytPlayer) {
                playCurrentVideo();
            }
            return;
        }

        // シャッフルして固定モードに移行
        shuffleArray(pl);
        frozenPlaylist = pl;
        playlistFrozen = true;

        currentVideoId = pl[0];
        if (ytPlayer) {
            playCurrentVideo();
        }
    }

    // ---------------- YouTubeリンク処理 ---------------

    function enhanceYoutubeLinksIn(root) {
        if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

        const links = root.querySelectorAll(
            'a.external-link[data-youtube]:not([data-yt-playlist-enhanced])'
        );

        links.forEach(link => {
            const vid = link.getAttribute('data-youtube');
            if (!vid) return;

            link.dataset.ytPlaylistEnhanced = '1';

            if (isLiveLink(link)) {
                return;
            }

            if (isInQuotedLine(link)) {
                return;
            }

            const span = document.createElement('span');
            span.style.marginLeft = '4px';
            span.style.fontSize = '11px';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.className = 'yt-playlist-checkbox';
            cb.dataset.videoId = vid;

            span.appendChild(cb);
            span.appendChild(document.createTextNode(' 連続再生'));

            link.insertAdjacentElement('afterend', span);

            if (!playlistButtonAdded) {
                playlistButtonAdded = true;

                const btnPlay = document.createElement('button');
                btnPlay.textContent = '☑付きリンク連続再生';
                btnPlay.style.marginLeft = '8px';
                btnPlay.style.fontSize = '11px';
                btnPlay.style.padding = '2px 6px';
                btnPlay.style.borderRadius = '4px';
                btnPlay.style.cursor = 'pointer';
                btnPlay.addEventListener('click', startPlaylist);

                const btnYT = document.createElement('button');
                btnYT.textContent = 'プレイリストとしてYouTubeで開く';
                btnYT.style.marginLeft = '4px';
                btnYT.style.fontSize = '11px';
                btnYT.style.padding = '2px 6px';
                btnYT.style.borderRadius = '4px';
                btnYT.style.cursor = 'pointer';
                btnYT.addEventListener('click', openPlaylistOnYouTube);

                span.insertAdjacentElement('afterend', btnYT);
                btnYT.insertAdjacentElement('beforebegin', btnPlay);
            }
        });
    }

    // --- 重複 youtube-embed の掃除 ----------------------------------------

    function dedupEmbedsIn(root) {
        if (!root || root.nodeType !== Node.ELEMENT_NODE) return;

        const blockquotes = root.querySelectorAll('blockquote');
        blockquotes.forEach(bq => {
            const embeds = Array.from(bq.querySelectorAll('.youtube-embed'));
            if (embeds.length <= 1) return;

            const seen = new Set();
            embeds.forEach(embed => {
                const iframe = embed.querySelector('iframe');
                const src = iframe ? iframe.src : '';
                if (src && seen.has(src)) {
                    embed.remove();
                } else if (src) {
                    seen.add(src);
                }
            });
        });
    }

    function dedupAllEmbeds() {
        document.querySelectorAll('td.rtd').forEach(td => dedupEmbedsIn(td));
    }

    function observeReplies() {
        const container = document.querySelector('[data-thread-container]') || document.body;

        container.querySelectorAll('td.rtd').forEach(td => {
            enhanceYoutubeLinksIn(td);
        });
        dedupAllEmbeds();

        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    if (node.matches && node.matches('td.rtd')) {
                        enhanceYoutubeLinksIn(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('td.rtd').forEach(td => enhanceYoutubeLinksIn(td));
                    }
                }
            }
            dedupAllEmbeds();
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // --- 連続再生プレイヤーまわり -----------------------------------------

    let currentVideoId = null;
    let ytPlayer = null;
    let ytApiReady = false;
    let ytApiLoading = false;
    let pendingApiReadyCallbacks = [];

    const POPUP_ID = 'yt-playlist-popup';
    const IFRAME_ID = 'yt-playlist-iframe';

    let maxDurationSec = 0;
    let maxDurationTimer = null;
    let currentVideoStartMs = 0;

    function startPlaylist() {
        // 新しく再生を開始するときは、シャッフル固定モードを解除
        playlistFrozen = false;
        frozenPlaylist = null;

        const pl = getCurrentPlaylist();
        if (!pl.length) {
            alert('☑付きのYouTubeリンク（ライブ配信以外／引用行以外）がありません。');
            return;
        }
        currentVideoId = pl[0];
        createOrShowPopup();
        ensureYoutubeApi(() => {
            initPlayerIfNeeded();
            playCurrentVideo();
        });
    }

    function createOrShowPopup() {
        let popup = document.getElementById(POPUP_ID);
        if (!popup) {
            popup = document.createElement('div');
            popup.id = POPUP_ID;
            Object.assign(popup.style, {
                position: 'fixed',
                right: '10px',
                bottom: '10px',
                width: '640px',
                height: '480px',
                background: '#000',
                color: '#fff',
                zIndex: 99999,
                boxShadow: '0 0 10px rgba(0,0,0,0.6)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            });

            const header = document.createElement('div');
            Object.assign(header.style, {
                height: '28px',
                background: 'linear-gradient(#444,#222)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                fontSize: '12px',
                cursor: 'move',
                userSelect: 'none',
            });
            const title = document.createElement('div');
            title.textContent = '🎬 YouTube 連続再生';
            title.style.flex = '1';

            const closeBtn = document.createElement('span');
            closeBtn.textContent = '✕';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.padding = '2px 6px';
            closeBtn.addEventListener('click', () => {
                popup.style.display = 'none';
                if (ytPlayer) {
                    ytPlayer.stopVideo();
                }
                if (maxDurationTimer) {
                    clearTimeout(maxDurationTimer);
                    maxDurationTimer = null;
                }
                // プレイヤーを閉じたら固定プレイリスト解除
                playlistFrozen = false;
                frozenPlaylist = null;
            });

            header.appendChild(title);
            header.appendChild(closeBtn);

            const body = document.createElement('div');
            body.style.flex = '1';
            body.style.position = 'relative';

            const iframeContainer = document.createElement('div');
            iframeContainer.id = IFRAME_ID;
            Object.assign(iframeContainer.style, {
                width: '100%',
                height: '100%',
            });
            body.appendChild(iframeContainer);

            const footer = document.createElement('div');
            Object.assign(footer.style, {
                height: '32px',
                background: '#111',
                display: 'flex',
                alignItems: 'center',
                fontSize: '11px',
                padding: '0 6px',
                boxSizing: 'border-box',
                gap: '6px',
            });

            const statusSpan = document.createElement('span');
            statusSpan.id = 'yt-playlist-status';
            statusSpan.textContent = '';

            const loopLabel = document.createElement('label');
            loopLabel.style.display = 'flex';
            loopLabel.style.alignItems = 'center';
            loopLabel.style.gap = '1px';
            loopLabel.style.marginLeft = '10px';
            loopLabel.style.marginRight = '8px';

            const loopCb = document.createElement('input');
            loopCb.type = 'checkbox';
            loopCb.id = 'yt-loop-current';

            loopLabel.appendChild(loopCb);
            loopLabel.appendChild(document.createTextNode('この曲をループ'));

            const maxLabel = document.createElement('label');
            maxLabel.style.display = 'flex';
            maxLabel.style.alignItems = 'center';
            maxLabel.style.gap = '2px';

            const maxSelect = document.createElement('select');
            maxSelect.id = 'yt-max-duration';
            maxSelect.style.fontSize = '11px';

            const options = [
                { text: '無制限', value: '0' },
                { text: '5分', value: String(5 * 60) },
                { text: '6分', value: String(6 * 60) },
                { text: '7分', value: String(7 * 60) },
                { text: '8分', value: String(8 * 60) },
                { text: '9分', value: String(9 * 60) },
                { text: '10分', value: String(10 * 60) },
                { text: '11分', value: String(11 * 60) },
                { text: '12分', value: String(12 * 60) },
                { text: '13分', value: String(13 * 60) },
                { text: '14分', value: String(14 * 60) },
                { text: '15分', value: String(15 * 60) },
            ];
            options.forEach(opt => {
                const o = document.createElement('option');
                o.textContent = opt.text;
                o.value = opt.value;
                maxSelect.appendChild(o);
            });
            maxSelect.value = '0';

            maxLabel.appendChild(maxSelect);
            maxLabel.appendChild(document.createTextNode('１動画の長さ上限'));

            const prevBtn = document.createElement('button');
            prevBtn.textContent = '◀ 前へ';
            Object.assign(prevBtn.style, {
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
            });
            prevBtn.addEventListener('click', playPrev);

            const shuffleBtn = document.createElement('button');
            shuffleBtn.textContent = 'シャッフル';
            Object.assign(shuffleBtn.style, {
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
            });
            shuffleBtn.addEventListener('click', shufflePlaylistAndRestart);

            const nextBtn = document.createElement('button');
            nextBtn.textContent = '次へ ▶';
            Object.assign(nextBtn.style, {
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer',
            });
            nextBtn.addEventListener('click', playNext);

            footer.appendChild(statusSpan);
            footer.appendChild(loopLabel);
            footer.appendChild(maxLabel);
            const spacer = document.createElement('div');
            spacer.style.flex = '1';
            footer.appendChild(spacer);
            footer.appendChild(prevBtn);
            footer.appendChild(shuffleBtn);
            footer.appendChild(nextBtn);

            const handleRB = document.createElement('div');
            Object.assign(handleRB.style, {
                position: 'absolute',
                width: '16px',
                height: '16px',
                right: '0',
                bottom: '0',
                cursor: 'nwse-resize',
                background: 'linear-gradient(135deg, transparent 50%, #666 50%)',
            });

            const handleLB = document.createElement('div');
            Object.assign(handleLB.style, {
                position: 'absolute',
                width: '16px',
                height: '16px',
                left: '0',
                bottom: '0',
                cursor: 'nesw-resize',
                background: 'linear-gradient(225deg, transparent 50%, #666 50%)',
            });

            const handleLT = document.createElement('div');
            Object.assign(handleLT.style, {
                position: 'absolute',
                width: '16px',
                height: '16px',
                left: '0',
                top: '0',
                cursor: 'nwse-resize',
                background: 'linear-gradient(315deg, transparent 50%, #666 50%)',
            });

            popup.appendChild(header);
            popup.appendChild(body);
            popup.appendChild(footer);
            popup.appendChild(handleRB);
            popup.appendChild(handleLB);
            popup.appendChild(handleLT);

            document.body.appendChild(popup);

            // ドラッグ移動
            (function setupDrag() {
                let isDragging = false;
                let offsetX = 0;
                let offsetY = 0;

                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    const rect = popup.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    e.preventDefault();
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    popup.style.left = x + 'px';
                    popup.style.top = y + 'px';
                    popup.style.right = 'auto';
                    popup.style.bottom = 'auto';
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
            })();

            // リサイズ（右下／左下／左上）
            (function setupResize() {
                let isResizing = false;
                let startX = 0;
                let startY = 0;
                let startW = 0;
                let startH = 0;
                let startLeft = 0;
                let startTop = 0;
                let mode = 'rb';

                const minW = 320;
                const minH = 180;

                function onMouseDown(e, m) {
                    isResizing = true;
                    mode = m;
                    const rect = popup.getBoundingClientRect();
                    startX = e.clientX;
                    startY = e.clientY;
                    startW = rect.width;
                    startH = rect.height;
                    startLeft = rect.left;
                    startTop = rect.top;
                    e.preventDefault();
                }

                handleRB.addEventListener('mousedown', (e) => onMouseDown(e, 'rb'));
                handleLB.addEventListener('mousedown', (e) => onMouseDown(e, 'lb'));
                handleLT.addEventListener('mousedown', (e) => onMouseDown(e, 'lt'));

                document.addEventListener('mousemove', (e) => {
                    if (!isResizing) return;

                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    let newW = startW;
                    let newH = startH;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    if (mode === 'rb') {
                        newW = Math.max(minW, startW + dx);
                        newH = Math.max(minH, startH + dy);
                    } else if (mode === 'lb') {
                        newW = Math.max(minW, startW - dx);
                        newLeft = startLeft + (startW - newW);
                        newH = Math.max(minH, startH + dy);
                    } else if (mode === 'lt') {
                        newW = Math.max(minW, startW - dx);
                        newLeft = startLeft + (startW - newW);
                        newH = Math.max(minH, startH - dy);
                        newTop = startTop + (startH - newH);
                    }

                    popup.style.width = newW + 'px';
                    popup.style.height = newH + 'px';
                    popup.style.left = newLeft + 'px';
                    popup.style.top = newTop + 'px';
                    popup.style.right = 'auto';
                    popup.style.bottom = 'auto';
                });

                document.addEventListener('mouseup', () => {
                    isResizing = false;
                });
            })();

            maxSelect.addEventListener('change', () => {
                maxDurationSec = parseInt(maxSelect.value, 10) || 0;
                scheduleMaxDurationTimer();
            });

            loopCb.addEventListener('change', () => {
                if (loopCb.checked) {
                    if (maxDurationTimer) {
                        clearTimeout(maxDurationTimer);
                        maxDurationTimer = null;
                    }
                } else {
                    scheduleMaxDurationTimer();
                }
            });

        } else {
            popup.style.display = 'flex';
        }
    }

    function updateStatusFromPlaylist() {
        const status = document.getElementById('yt-playlist-status');
        if (!status) return;

        const pl = getCurrentPlaylist();
        if (!pl.length || !currentVideoId) {
            status.textContent = '';
            return;
        }
        const idx = pl.indexOf(currentVideoId);
        if (idx < 0) {
            status.textContent = `再生待ち 0 / ${pl.length}`;
        } else {
            status.textContent = `再生中 ${idx + 1} / ${pl.length}`;
        }
    }

    function scheduleMaxDurationTimer() {
        if (maxDurationTimer) {
            clearTimeout(maxDurationTimer);
            maxDurationTimer = null;
        }
        if (!currentVideoId) return;

        const loopCb = document.getElementById('yt-loop-current');
        if (loopCb && loopCb.checked) return;

        if (maxDurationSec > 0 && currentVideoStartMs) {
            const elapsed = (Date.now() - currentVideoStartMs) / 1000;
            const remaining = maxDurationSec - elapsed;
            if (remaining <= 0) {
                playNext();
            } else {
                maxDurationTimer = setTimeout(() => {
                    playNext();
                }, remaining * 1000);
            }
        }
    }

    function playCurrentVideo() {
        if (!ytPlayer || !currentVideoId) return;
        ytPlayer.loadVideoById(currentVideoId);
        currentVideoStartMs = Date.now();
        scheduleMaxDurationTimer();
        updateStatusFromPlaylist();
    }

    function playNext() {
        const pl = getCurrentPlaylist();

        if (maxDurationTimer) {
            clearTimeout(maxDurationTimer);
            maxDurationTimer = null;
        }

        if (!pl.length) {
            if (ytPlayer) ytPlayer.stopVideo();
            currentVideoId = null;
            updateStatusFromPlaylist();
            return;
        }

        if (!currentVideoId) {
            currentVideoId = pl[0];
            playCurrentVideo();
            return;
        }

        const idx = pl.indexOf(currentVideoId);
        if (idx < 0 || idx + 1 >= pl.length) {
            currentVideoId = pl[pl.length - 1];
            if (ytPlayer) ytPlayer.stopVideo();
            updateStatusFromPlaylist();
            return;
        }

        currentVideoId = pl[idx + 1];
        playCurrentVideo();
    }

    function playPrev() {
        const pl = getCurrentPlaylist();

        if (maxDurationTimer) {
            clearTimeout(maxDurationTimer);
            maxDurationTimer = null;
        }

        if (!pl.length) {
            if (ytPlayer) ytPlayer.stopVideo();
            currentVideoId = null;
            updateStatusFromPlaylist();
            return;
        }

        if (!currentVideoId) {
            currentVideoId = pl[0];
            playCurrentVideo();
            return;
        }

        const idx = pl.indexOf(currentVideoId);
        if (idx <= 0) {
            currentVideoId = pl[0];
            playCurrentVideo();
            return;
        }

        currentVideoId = pl[idx - 1];
        playCurrentVideo();
    }

    function ensureYoutubeApi(callback) {
        if (ytApiReady && window.YT && window.YT.Player) {
            callback && callback();
            return;
        }

        pendingApiReadyCallbacks.push(callback);

        if (ytApiLoading) return;
        ytApiLoading = true;

        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);

        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function() {
            ytApiReady = true;
            if (typeof prev === 'function') {
                try { prev(); } catch (e) { console.error(e); }
            }
            initPlayerIfNeeded();
            const cbs = pendingApiReadyCallbacks.slice();
            pendingApiReadyCallbacks = [];
            cbs.forEach(cb => cb && cb());
        };
    }

    function initPlayerIfNeeded() {
        if (!ytApiReady || ytPlayer) return;

        ytPlayer = new YT.Player(IFRAME_ID, {
            videoId: currentVideoId || '',
            events: {
                'onReady': function() {
                    if (currentVideoId) {
                        playCurrentVideo();
                    } else {
                        const pl = getCurrentPlaylist();
                        if (pl.length) {
                            currentVideoId = pl[0];
                            playCurrentVideo();
                        }
                    }
                },
                'onStateChange': function(e) {
                    if (e.data === window.YT.PlayerState.ENDED) {
                        const loopCb = document.getElementById('yt-loop-current');
                        const isLoop = loopCb && loopCb.checked;
                        if (isLoop && currentVideoId) {
                            ytPlayer.seekTo(0, true);
                            ytPlayer.playVideo();
                        } else {
                            playNext();
                        }
                    }
                }
            },
            playerVars: {
                autoplay: 1,
                rel: 0
            }
        });
    }

    function main() {
        observeReplies();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
