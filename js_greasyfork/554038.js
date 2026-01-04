// ==UserScript==
// @name         youtube 譜面作成ボタン追加（mp4download,歌詞検索,譜面作成,メモ帳,Ctrlショートカット単押し左右対応）spa対応
// @namespace    http://tampermonkey.net
// @version      2025-10-30.05
// @description  通常動画はタイトル右端、Shortsは右下固定にMP4/検索/歌詞/タイツベ/YTyping/メモ帳ボタン表示＋左右Ctrl単押しで3秒スキップ（左=戻る/右=進む）＋メモ帳上でも動作
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554038/youtube%20%E8%AD%9C%E9%9D%A2%E4%BD%9C%E6%88%90%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0%EF%BC%88mp4download%2C%E6%AD%8C%E8%A9%9E%E6%A4%9C%E7%B4%A2%2C%E8%AD%9C%E9%9D%A2%E4%BD%9C%E6%88%90%2C%E3%83%A1%E3%83%A2%E5%B8%B3%2CCtrl%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E5%8D%98%E6%8A%BC%E3%81%97%E5%B7%A6%E5%8F%B3%E5%AF%BE%E5%BF%9C%EF%BC%89spa%E5%AF%BE%E5%BF%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/554038/youtube%20%E8%AD%9C%E9%9D%A2%E4%BD%9C%E6%88%90%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0%EF%BC%88mp4download%2C%E6%AD%8C%E8%A9%9E%E6%A4%9C%E7%B4%A2%2C%E8%AD%9C%E9%9D%A2%E4%BD%9C%E6%88%90%2C%E3%83%A1%E3%83%A2%E5%B8%B3%2CCtrl%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%E5%8D%98%E6%8A%BC%E3%81%97%E5%B7%A6%E5%8F%B3%E5%AF%BE%E5%BF%9C%EF%BC%89spa%E5%AF%BE%E5%BF%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window.self) return;

    let lastUrl = location.href;
    const isShorts = () => window.location.pathname.startsWith('/shorts/');

    // ======= Ctrlキー単押しで3秒巻き戻し / 早送り（メモ帳上でも動作）=======
    window.addEventListener('keydown', (e) => {
        if (e.key !== 'Control' || e.repeat) return; // Ctrl単押しのみ
        const video = document.querySelector('video');
        if (!video) return;

        e.preventDefault();
        e.stopPropagation();

        if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
            // 左Ctrl → 3秒巻き戻し
            video.currentTime = Math.max(0, video.currentTime - 3);
        } else if (e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
            // 右Ctrl → 3秒早送り
            video.currentTime = Math.min(video.duration, video.currentTime + 3);
        }
    }, true);

    // ======= ボタン生成 =======
    function makeBtn(text, onclick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            fontSize: '14px',
            color: '#fff',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            padding: '4px 8px',
            whiteSpace: 'nowrap',
        });
        btn.onmouseover = () => (btn.style.background = 'rgba(0,0,0,0.9)');
        btn.onmouseout = () => (btn.style.background = 'rgba(0,0,0,0.7)');
        if (onclick) btn.addEventListener('click', onclick);
        return btn;
    }

    function createButtonsContainer() {
        const container = document.createElement('div');
        container.id = 'tm-title-btn-container';
        container.style.display = 'flex';
        container.style.gap = '6px';
        return container;
    }

    // ======= メモ帳 =======
    function addMemoWindow() {
        let wrap = document.getElementById('tm-lyrics-wrap');
        if (wrap) { wrap.remove(); return; }

        wrap = document.createElement('div');
        wrap.id = 'tm-lyrics-wrap';
        Object.assign(wrap.style, {
            position: 'fixed',
            top: '120px',
            right: '20px',
            width: '620px',
            height: '600px',
            minWidth: '200px',
            minHeight: '100px',
            zIndex: '100000',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '8px',
            padding: '0',
            boxSizing: 'border-box',
        });

        const tab = document.createElement('div');
        tab.textContent = '📝 メモ帳';
        Object.assign(tab.style, {
            background: 'rgba(255,255,255,0.1)',
            padding: '6px 10px',
            fontSize: '18px',
            borderBottom: '1px solid rgba(255,255,255,0.3)',
            cursor: 'move',
            userSelect: 'none',
        });

        const ta = document.createElement('textarea');
        Object.assign(ta.style, {
            width: '100%',
            height: 'calc(100% - 36px)',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            padding: '10px',
            fontSize: '24px',
            outline: 'none',
            resize: 'none',
            boxSizing: 'border-box',
            cursor: 'text',
        });
        ta.placeholder = 'ここにメモを入力';
        ta.spellcheck = false;

        wrap.appendChild(tab);
        wrap.appendChild(ta);
        document.body.appendChild(wrap);
        ta.focus();

        // ドラッグ移動
        let isDrag = false, offX = 0, offY = 0;
        tab.addEventListener('mousedown', (e) => {
            isDrag = true;
            offX = e.clientX - wrap.getBoundingClientRect().left;
            offY = e.clientY - wrap.getBoundingClientRect().top;
            wrap.style.userSelect = 'none';
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDrag) return;
            wrap.style.left = `${e.clientX - offX}px`;
            wrap.style.top = `${e.clientY - offY}px`;
        });
        window.addEventListener('mouseup', () => { isDrag = false; wrap.style.userSelect = 'auto'; });

        // リサイズ
        const handle = document.createElement('div');
        Object.assign(handle.style, {
            position: 'absolute',
            width: '16px',
            height: '16px',
            right: '0',
            bottom: '0',
            cursor: 'se-resize',
            background: 'rgba(255,255,255,0.3)',
            zIndex: '10',
            borderTopLeftRadius: '4px',
        });
        wrap.appendChild(handle);

        let isResize = false, startX = 0, startY = 0, startWidth = 0, startHeight = 0;
        handle.addEventListener('mousedown', (e) => {
            isResize = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = wrap.offsetWidth;
            startHeight = wrap.offsetHeight;
            e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isResize) return;
            const newWidth = Math.max(200, startWidth + (e.clientX - startX));
            const newHeight = Math.max(100, startHeight + (e.clientY - startY));
            wrap.style.width = `${newWidth}px`;
            wrap.style.height = `${newHeight}px`;
            ta.style.height = `${newHeight - tab.offsetHeight}px`;
        });
        window.addEventListener('mouseup', () => { isResize = false; });
    }

    // ======= ボタン設置 =======
    function addButtons() {
        const oldContainer = document.getElementById('tm-title-btn-container');
        if (oldContainer) oldContainer.remove();

        const url = window.location.href;
        const videoIdMatch = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/) || url.match(/\/shorts\/([^?]+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        const btnMP4 = makeBtn('MP4', () => {
            window.open(`https://p.savenow.to/api/card2/?url=${encodeURIComponent(url)}`, '_blank');
        });

        const getTitle = () => {
            if (isShorts()) return document.querySelector('yt-shorts-video-title-view-model > h2')?.textContent.trim();
            return document.querySelector('h1.title yt-formatted-string, h1.style-scope.ytd-watch-metadata')?.textContent.trim();
        };

        const btnSearch = makeBtn('検索', () => {
            const title = getTitle();
            if (!title) return alert('タイトルが取得できませんでした');
            window.open(`https://www.google.com/search?q=${encodeURIComponent(title + ' タイピング')}`, '_blank');
        });

        const btnLyrics = makeBtn('歌詞', () => {
            const title = getTitle();
            if (!title) return alert('タイトルが取得できませんでした');
            window.open(`https://www.google.com/search?q=${encodeURIComponent(title + ' 歌詞')}`, '_blank');
        });

        const btnTt = makeBtn('タイツベ', () => {
            if (!videoId) return alert('動画IDが取得できませんでした');
            const videoUrl = isShorts() ? `https://www.youtube.com/watch?v=${videoId}` : url;
            window.open(`https://typing-tube.net/movie/edit?videoid=${videoId}&url=${encodeURIComponent(videoUrl)}`, '_blank');
        });

        const btnY = makeBtn('YTyping', () => {
            if (!videoId) return alert('動画IDが取得できませんでした');
            const videoUrl = isShorts() ? `https://www.youtube.com/watch?v=${videoId}` : url;
            window.open(`https://ytyping.net/edit?new=${videoId}&url=${encodeURIComponent(videoUrl)}`, '_blank');
        });

        const btnMemo = makeBtn('メモ帳', addMemoWindow);

        const container = createButtonsContainer();
        [btnMP4, btnSearch, btnLyrics, btnTt, btnY, btnMemo].forEach(b => container.appendChild(b));

        if (isShorts()) {
            Object.assign(container.style, {
                position: 'fixed',
                right: '270px',
                bottom: '20px',
                zIndex: '99999',
                flexWrap: 'wrap',
                background: 'rgba(0,0,0,0.5)',
                padding: '10px',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
            });
            document.body.appendChild(container);
        } else {
            const titleElement = document.querySelector('h1.title yt-formatted-string, h1.style-scope.ytd-watch-metadata');
            if (!titleElement) {
                setTimeout(addButtons, 200);
                return;
            }
            const parent = titleElement.parentNode;
            parent.style.display = 'flex';
            parent.style.justifyContent = 'space-between';
            parent.style.alignItems = 'center';
            parent.appendChild(container);
        }
    }

    // ======= URL監視 =======
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            addButtons();
        }
    });
    observer.observe(document, { childList: true, subtree: true });

    addButtons();
})();
