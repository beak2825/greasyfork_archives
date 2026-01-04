// ==UserScript==
// @name         あいもげYoutube16:9強制ちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Youtubeのウィンドウを強制的に16:9にして余白が出ないようにします
// @match        https://nijiurachan.net/pc/thread.php*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557429/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube16%3A9%E5%BC%B7%E5%88%B6%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557429/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube16%3A9%E5%BC%B7%E5%88%B6%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const C = {
        HEADER_HEIGHT: 30,
        CHAT_STEP: 25, CHAT_MIN: 150, CHAT_MAX: 450,
        VIDEO_MIN: 320, DEFAULT_W: 560, DEFAULT_H: 345, DEFAULT_CHAT: 300,
        HEADER_DELAY: 2000, SAVE_DELAY: 300,
        ASPECT_RATIO: 16 / 9
    };

    const SCALES = [
        {s: null, l: 'auto'}, {s: 1.0, l: '100%'}, {s: 0.75, l: '75%'},
        {s: 0.6, l: '60%'}, {s: 0.5, l: '50%'}
    ];

    const YT_PATTERNS = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed|live|shorts)\/([a-zA-Z0-9_-]{11})/
    ];

    const css = (o) => Object.entries(o).map(([k,v]) => `${k}:${v}`).join(';');
    const el = (tag, styles, attrs = {}) => {
        const e = document.createElement(tag);
        if (styles) e.style.cssText = styles;
        Object.assign(e, attrs);
        return e;
    };

    const extractId = (url) => {
        for (let p of YT_PATTERNS) {
            const m = url.match(p);
            if (m) return m[1];
        }
        return null;
    };

    const Settings = {
        save: (d) => localStorage.setItem('ytPlayerSettings', JSON.stringify(d)),
        load: () => {
            try { return JSON.parse(localStorage.getItem('ytPlayerSettings')) || {}; }
            catch { return {}; }
        }
    };

    class Player {
        constructor() {
            this.container = null;
            const def = { width: C.DEFAULT_W, height: C.DEFAULT_H, chatVisible: false, chatWidth: C.DEFAULT_CHAT, scaleIndex: 0 };
            this.cfg = { ...def, ...Settings.load() };
            
            // 初回起動時のサイズ整合性チェック
            const safeH = Math.max(this.cfg.height, C.VIDEO_MIN * (1/C.ASPECT_RATIO));
            const safeVideoW = safeH * C.ASPECT_RATIO;
            this.cfg.height = safeH;
            this.cfg.width = this.cfg.chatVisible ? safeVideoW + this.cfg.chatWidth : safeVideoW;

            this.scale = SCALES[this.cfg.scaleIndex].s;
            this.saveTimer = null;
            this.headerTimer = null;
        }

        save(immediate = false) {
            if (!this.container) return;
            this.cfg.width = this.container.offsetWidth;
            this.cfg.height = this.container.offsetHeight;
            const settings = {
                width: this.cfg.width,
                height: this.cfg.height,
                chatVisible: this.cfg.chatVisible,
                chatWidth: this.cfg.chatWidth,
                scaleIndex: this.cfg.scaleIndex
            };
            if (immediate) Settings.save(settings);
            else {
                clearTimeout(this.saveTimer);
                this.saveTimer = setTimeout(() => Settings.save(settings), C.SAVE_DELAY);
            }
        }

        open(id) {
            if (this.container) {
                this.videoIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`;
                this.chatIframe.src = `https://www.youtube.com/live_chat?v=${id}&embed_domain=${location.hostname}`;
                this.updateHeaderWidth();
                return;
            }
            this.build(id);
        }

        updateHeaderWidth() {
            if (this.hdr && this.videoArea) {
                this.hdr.style.width = `${this.videoArea.offsetWidth}px`;
            }
        }

        build(id) {
            if (!document.body) return; // 安全策

            const videoW = this.cfg.chatVisible ? this.cfg.width - this.cfg.chatWidth : this.cfg.width;

            this.container = el('div', css({
                position: 'fixed', top: '10px', right: '10px',
                width: `${this.cfg.width}px`, height: `${this.cfg.height}px`,
                zIndex: '2147483647', // 最大値にして他の要素より確実に上に
                background: '#000',
                boxShadow: '0 4px 12px rgba(0,0,0,0.7)', borderRadius: '8px',
                overflow: 'hidden', minWidth: `${C.VIDEO_MIN}px`, minHeight: `${C.VIDEO_MIN * (1/C.ASPECT_RATIO)}px`
            }), { id: 'fixed-youtube-player-v2' }); // IDを変更して重複防止の識別に使用

            const body = el('div', css({ display: 'flex', width: '100%', height: '100%' }));

            this.videoArea = el('div', css({
                width: `${videoW}px`, flexShrink: '0', display: 'flex', minWidth: `${C.VIDEO_MIN}px`
            }));
            this.videoIframe = el('iframe', css({ width: '100%', height: '100%', border: 'none' }), {
                src: `https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1`,
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                allowFullscreen: true
            });
            this.videoArea.append(this.videoIframe);

            this.chatArea = el('div', css({
                width: `${this.cfg.chatWidth}px`, borderLeft: '1px solid #333',
                display: this.cfg.chatVisible ? 'block' : 'none',
                flexShrink: '0', overflow: 'hidden'
            }));
            this.chatWrapper = el('div', css({
                width: '400px',
                height: '133.33%',
                transform: 'scale(0.75)',
                'transform-origin': '0 0'
            }));
            this.chatIframe = el('iframe', css({ width: '100%', height: '100%', border: 'none' }), {
                src: `https://www.youtube.com/live_chat?v=${id}&embed_domain=${location.hostname}`
            });
            this.chatWrapper.append(this.chatIframe);
            this.chatArea.append(this.chatWrapper);

            body.append(this.videoArea, this.chatArea);
            const header = this.buildHeader();
            const handle = el('div', css({
                position: 'absolute', bottom: '0', right: '0', width: '20px', height: '20px',
                cursor: 'nwse-resize', background: 'linear-gradient(135deg,transparent 50%,#666 50%)', zIndex: '10'
            }));

            this.container.append(body, header, handle);
            document.body.append(this.container);

            this.setupEvents(handle);
            this.updateChatScale();
            this.updateHeaderWidth();
        }

        buildHeader() {
            const hdr = el('div', css({
                position: 'absolute', top: '0', left: '0',
                width: `${this.cfg.width}px`, height: `${C.HEADER_HEIGHT}px`,
                background: 'linear-gradient(to bottom,rgba(68,68,68,.95),rgba(34,34,34,.95))',
                color: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 10px', 'box-sizing': 'border-box',
                fontSize: '12px', userSelect: 'none', zIndex: '10',
                opacity: '0', transition: 'opacity .3s', pointerEvents: 'none'
            }));

            const show = () => { hdr.style.opacity = '1'; clearTimeout(this.headerTimer); };
            const hide = () => { this.headerTimer = setTimeout(() => hdr.style.opacity = '0', C.HEADER_DELAY); };
            this.container.addEventListener('mouseenter', show);
            this.container.addEventListener('mousemove', () => { show(); hide(); });
            this.container.addEventListener('mouseleave', () => hdr.style.opacity = '0');
            show(); hide();

            const drag = el('div', css({ flex: '1', cursor: 'move', display: 'flex', alignItems: 'center', height: '100%', pointerEvents: 'auto' }));
            drag.innerHTML = '<span>🎬 YouTube Player</span>';

            const ctrl = el('div', css({ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto' }));
            const widthCtrl = el('div', css({
                display: this.cfg.chatVisible ? 'flex' : 'none', alignItems: 'center', gap: '4px',
                background: 'rgba(51,51,51,.9)', padding: '2px 6px', borderRadius: '4px'
            }));
            const wVal = el('span', css({ fontSize: '11px', color: '#aaa', width: '35px', textAlign: 'center' }), { textContent: this.cfg.chatWidth });
            const btnCss = css({ cursor: 'pointer', padding: '2px 6px', background: '#555', borderRadius: '2px', fontWeight: 'bold', userSelect: 'none' });

            widthCtrl.append(
                el('span', btnCss, { textContent: '−', onclick: () => this.setChatW(this.cfg.chatWidth - C.CHAT_STEP, wVal) }),
                wVal,
                el('span', btnCss, { textContent: '＋', onclick: () => this.setChatW(this.cfg.chatWidth + C.CHAT_STEP, wVal) })
            );

            const sizeBtn = el('span', css({
                cursor: 'pointer', padding: '4px 8px', background: '#555', borderRadius: '3px', fontSize: '11px',
                display: this.cfg.chatVisible ? 'block' : 'none', userSelect: 'none'
            }), { textContent: `📝 ${SCALES[this.cfg.scaleIndex].l}` });
            sizeBtn.onclick = () => {
                this.cfg.scaleIndex = (this.cfg.scaleIndex + 1) % SCALES.length;
                this.scale = SCALES[this.cfg.scaleIndex].s;
                sizeBtn.textContent = `📝 ${SCALES[this.cfg.scaleIndex].l}`;
                this.updateChatScale();
                this.save();
            };

            const chatBtn = el('span', css({
                cursor: 'pointer', padding: '4px 8px', borderRadius: '3px', fontSize: '11px',
                background: this.cfg.chatVisible ? '#0a8' : '#555', userSelect: 'none'
            }), { textContent: '💬 チャット' });
            chatBtn.onclick = () => {
                const vw = this.videoArea.offsetWidth;
                this.cfg.chatVisible = !this.cfg.chatVisible;
                this.chatArea.style.display = this.cfg.chatVisible ? 'block' : 'none';
                widthCtrl.style.display = this.cfg.chatVisible ? 'flex' : 'none';
                sizeBtn.style.display = this.cfg.chatVisible ? 'block' : 'none';
                chatBtn.style.background = this.cfg.chatVisible ? '#0a8' : '#555';
                this.container.style.width = `${this.cfg.chatVisible ? vw + this.cfg.chatWidth : vw}px`;
                this.updateChatScale();
                this.updateHeaderWidth();
                this.save();
            };

            const close = el('span', css({ cursor: 'pointer', padding: '4px 8px', fontSize: '14px', userSelect: 'none' }), {
                textContent: '✕', onclick: () => { this.save(true); this.container.remove(); this.container = null; }
            });

            ctrl.append(widthCtrl, sizeBtn, chatBtn, close);
            hdr.append(drag, ctrl);
            this.dragEl = drag; this.widthCtrl = widthCtrl; this.sizeBtn = sizeBtn; this.hdr = hdr;
            return hdr;
        }

        setupEvents(handle) {
            let drag = false, dStart = {};
            this.dragEl.onmousedown = (e) => {
                drag = true;
                dStart = { x: e.clientX, y: e.clientY, l: this.container.offsetLeft, t: this.container.offsetTop };
                this.container.style.right = 'auto';
            };
            let resize = false, rStart = {};
            handle.onmousedown = (e) => {
                e.stopPropagation();
                resize = true;
                rStart = { x: e.clientX, y: e.clientY, w: this.container.offsetWidth, h: this.container.offsetHeight, vw: this.videoArea.offsetWidth };
            };
            document.addEventListener('mousemove', (e) => {
                if (drag) {
                    this.container.style.left = `${dStart.l + e.clientX - dStart.x}px`;
                    this.container.style.top = `${dStart.t + e.clientY - dStart.y}px`;
                }
                if (resize) {
                    const dx = e.clientX - rStart.x;
                    const dy = e.clientY - rStart.y;
                    const h1 = rStart.h + dy;
                    const h2 = (rStart.vw + dx) * (1 / C.ASPECT_RATIO);
                    let newH = (Math.abs(h1 - rStart.h) > Math.abs(h2 - rStart.h)) ? h1 : h2;
                    const minH = C.VIDEO_MIN * (1 / C.ASPECT_RATIO);
                    if (newH < minH) newH = minH;
                    const newVw = newH * C.ASPECT_RATIO;
                    this.videoArea.style.width = `${newVw}px`;
                    this.container.style.height = `${newH}px`;
                    this.container.style.width = `${this.cfg.chatVisible ? newVw + this.cfg.chatWidth : newVw}px`;
                    this.updateHeaderWidth();
                }
            });
            document.addEventListener('mouseup', () => {
                if (drag || resize) { drag = false; resize = false; this.save(true); }
            });
        }

        setChatW(val, display) {
            const w = Math.max(C.CHAT_MIN, Math.min(C.CHAT_MAX, val));
            const diff = w - this.cfg.chatWidth;
            this.cfg.chatWidth = w;
            display.textContent = w;
            this.chatArea.style.width = `${w}px`;
            this.container.style.width = `${this.container.offsetWidth + diff}px`;
            this.updateChatScale();
            this.save();
        }

        updateChatScale() {
            if (!this.chatWrapper) return;
            const w = this.cfg.chatWidth;
            const s = this.scale !== null ? this.scale : Math.max(0.5, Math.min(1.0, 0.5 + (w - C.CHAT_MIN) * 0.5 / 300));
            this.chatWrapper.style.transform = `scale(${s})`;
            this.chatWrapper.style.width = `${w / s}px`;
            this.chatWrapper.style.height = `${100 / s}%`;
        }
    }

    const player = new Player();

    // クリックイベントを最優先で登録 (document-startにより他スクリプトより先に実行されることを期待)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        const id = extractId(link.href);
        if (id) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // 重要：他のリスナーを止める
            player.open(id);
        }
    }, true); // true = capture phase

    // DOM読み込み待機後に実行するスタイル適用処理
    const initObserver = () => {
        if(!document.body) {
            // bodyがまだなければ少し待つ
            setTimeout(initObserver, 50);
            return;
        }

        const applyStyle = () => {
            document.querySelectorAll('a').forEach(a => {
                if (!a.dataset.yt && extractId(a.href)) {
                    a.dataset.yt = '1';
                    a.style.color = '#f00';
                    a.style.fontWeight = 'bold';
                }
            });
        };

        applyStyle();
        let styleTimer;
        new MutationObserver(() => {
            if (styleTimer) return;
            styleTimer = setTimeout(() => { applyStyle(); styleTimer = null; }, 500);
        }).observe(document.body, { childList: true, subtree: true });
    };

    // 初期化キック
    initObserver();

})();