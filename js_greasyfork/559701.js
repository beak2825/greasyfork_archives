// ==UserScript==
// @name         あいもげTwitchポップアップ再生ちゃん
// @namespace    https://nijiurachan.net/
// @version      1.2
// @description  Twitchリンクをポップアップウィンドウで表示します
// @author       Expert JS Developer
// @match        https://nijiurachan.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559701/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Twitch%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E5%86%8D%E7%94%9F%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/559701/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Twitch%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E5%86%8D%E7%94%9F%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Config = {
        get(key, def) {
            const val = localStorage.getItem('tw_danmaku_' + key);
            return val !== null ? parseFloat(val) : def;
        },
        set(key, val) {
            localStorage.setItem('tw_danmaku_' + key, val);
        }
    };

    class DanmakuManager {
        constructor(container) {
            this.container = container;
            this.enabled = false;
            this.ws = null;
            this.maxTracks = 15;
            this.trackAvailableAt = new Array(this.maxTracks).fill(0);
            this.updateParams();
            this.initVisibilityListener();
        }

        // タブの表示状態を監視
        initVisibilityListener() {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.container) {
                    // タブに戻った瞬間にコンテナを空にして、溜まった描画を破棄
                    this.container.innerHTML = '';
                }
            });
        }

        updateParams() {
            this.size = Config.get('size', 24);
            this.opacity = Config.get('opacity', 1.0);
            const rawSpeed = Config.get('speed', 5);
            this.duration = 13 - rawSpeed;

            this.container.style.setProperty('--dm-size', this.size + 'px');
            this.container.style.setProperty('--dm-opacity', this.opacity);
            this.container.style.setProperty('--dm-speed', this.duration + 's');
        }

        connect(channelId) {
            this.disconnect();
            this.ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            this.ws.onopen = () => {
                this.ws.send('CAP REQ :twitch.tv/tags');
                this.ws.send('NICK justinfan' + Math.floor(Math.random() * 10000));
                this.ws.send(`JOIN #${channelId.toLowerCase()}`);
            };
            this.ws.onmessage = (event) => {
                if (!this.enabled || document.hidden) return; // タブが隠れている時は処理しない
                if (event.data.includes('PRIVMSG')) this.parseTwitchMessage(event.data);
                else if (event.data.startsWith('PING')) this.ws.send('PONG :tmi.twitch.tv');
            };
        }

        disconnect() {
            if (this.ws) { this.ws.close(); this.ws = null; }
        }

        parseTwitchMessage(raw) {
            const parts = raw.split(' :');
            if (parts.length < 3) return;
            const tags = parts[0];
            const message = parts.slice(2).join(' :').trim();
            const emoteTagMatch = tags.match(/emotes=([^; ]+)/);
            let htmlContent = emoteTagMatch ? this.replaceEmotes(message, emoteTagMatch[1]) : this.escapeHTML(message);
            if (tags.includes('bits=')) htmlContent = this.replaceBits(htmlContent);
            this.createComment(htmlContent);
        }

        replaceBits(html) {
            return html.replace(/\bCheer(\d+)\b/g, (match, amount) => {
                const num = parseInt(amount);
                let tier = 1;
                if (num >= 10000) tier = 10000;
                else if (num >= 5000) tier = 5000;
                else if (num >= 1000) tier = 1000;
                else if (num >= 100) tier = 100;
                const url = `https://static-cdn.jtvnw.net/bits/dark/animated/${tier}/1.gif`;
                return `<img src="${url}" class="tw-emote"><span style="color:#efeff1;margin-right:4px;">${num}</span>`;
            });
        }

        replaceEmotes(text, emoteData) {
            const replacements = [];
            for (const emote of emoteData.split('/')) {
                const [id, positions] = emote.split(':');
                for (const coord of positions.split(',')) {
                    const [start, end] = coord.split('-').map(Number);
                    replacements.push({ start, end, html: `<img src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0" class="tw-emote">` });
                }
            }
            replacements.sort((a, b) => b.start - a.start);
            let result = text;
            for (const r of replacements) result = result.substring(0, r.start) + r.html + result.substring(r.end + 1);
            return result;
        }

        escapeHTML(str) {
            const p = document.createElement('p'); p.textContent = str; return p.innerHTML;
        }

        createComment(html) {
            if (document.hidden) return; // 二重チェック
            const now = Date.now();
            let trackIndex = -1;
            for (let i = 0; i < this.maxTracks; i++) {
                if (now > this.trackAvailableAt[i]) { trackIndex = i; break; }
            }
            if (trackIndex === -1) trackIndex = Math.floor(Math.random() * this.maxTracks);

            const cooldown = (this.duration * 1000) / 4;
            this.trackAvailableAt[trackIndex] = now + cooldown;

            const el = document.createElement('div');
            el.className = 'tw-danmaku-msg';
            el.innerHTML = html;
            el.style.top = `${(trackIndex * (90/this.maxTracks)) + 4}%`;
            this.container.appendChild(el);
            el.addEventListener('animationend', () => el.remove());
        }

        toggle(state, channelId) {
            this.enabled = state;
            if (this.enabled && channelId) this.connect(channelId);
            else this.disconnect();
        }
    }

    class MultiFloatingPlayer {
        constructor() {
            this.activeWindow = null;
            this.chatPos = 'side';
            this.initStyles();
            this.bindEvents();
        }

        initStyles() {
            const css = `
                .fp-window {
                    position: fixed; top: 100px; left: 100px; width: 640px;
                    background: #000; box-shadow: 0 5px 30px rgba(0,0,0,0.8);
                    z-index: 90; display: flex; border: 1px solid #444; flex-direction: row; font-family: sans-serif;
                }
                .fp-window.pos-bottom { flex-direction: column; width: 480px; }
                .v-section { position: relative; flex-grow: 1; aspect-ratio: 16 / 9; background: #000; overflow: hidden; }
                .p-header {
                    position: absolute; top: 0; left: 0; right: 0; height: 35px;
                    background: rgba(24, 24, 27, 0.85); color: #fff;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 10px; cursor: move; z-index: 95; opacity: 0; transition: opacity 0.2s;
                }
                .v-section:hover .p-header { opacity: 1; }
                .h-left { display: flex; align-items: center; gap: 6px; }
                .p-btn { cursor: pointer; padding: 2px 6px; border-radius: 4px; border: none; color: white; font-size: 10px; font-weight: bold; }
                .btn-purple { background: #9147ff; }
                .btn-dan { background: #00a1d6; }
                .btn-dan.active { background: #ff4747; border: 1px solid #fff; }
                .btn-gray { background: #444; }

                .p-settings-panel {
                    position: absolute; top: 40px; left: 10px; width: 160px;
                    background: rgba(0,0,0,0.9); border: 1px solid #555; border-radius: 5px;
                    padding: 10px; z-index: 100; display: none; color: white; font-size: 11px;
                }
                .p-settings-panel.open { display: block; }
                .p-settings-panel label { display: block; margin-bottom: 8px; }
                .p-settings-panel input { width: 100%; cursor: pointer; margin-top: 4px; }

                .c-container { display: none; background: #18181b; border-left: 1px solid #333; }
                .fp-window.chat-open .c-container { display: block; }
                .fp-window.pos-side .c-container { width: 250px; height: auto; }
                .fp-window.pos-bottom .c-container { width: 100%; height: 300px; border-top: 1px solid #333; border-left: none; }

                .danmaku-area { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 93; }
                .tw-danmaku-msg {
                    position: absolute; white-space: nowrap; color: #fff; font-weight: bold;
                    font-size: var(--dm-size); opacity: var(--dm-opacity);
                    text-shadow: 2px 2px 2px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
                    animation: danmaku-move var(--dm-speed) linear forwards; left: 100%;
                    display: flex; align-items: center; gap: 4px;
                }
                .tw-emote { height: 1.25em; width: auto; vertical-align: middle; }
                @keyframes danmaku-move { from { transform: translateX(0); } to { transform: translateX(calc(-100% - 1400px)); } }
                iframe { width: 100%; height: 100%; border: none; }
                .p-resizer { width: 18px; height: 18px; position: absolute; right: 0; bottom: 0; cursor: nwse-resize; z-index: 98; }
                .p-shield { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 92; display: none; }
                .p-dragging .p-shield, .p-resizing .p-shield { display: block; }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }

        createPlayer(info) {
            if (this.activeWindow) { if (this.danmaku) this.danmaku.disconnect(); this.activeWindow.remove(); }
            const win = document.createElement('div');
            win.className = 'fp-window pos-side';
            const videoSection = document.createElement('div');
            videoSection.className = 'v-section';
            const danmakuArea = document.createElement('div');
            danmakuArea.className = 'danmaku-area';
            this.danmaku = new DanmakuManager(danmakuArea);

            const header = document.createElement('div');
            header.className = 'p-header';
            const headerLeft = document.createElement('div');
            headerLeft.className = 'h-left';
            headerLeft.innerHTML = `<span class="p-title">${info.id}</span>`;

            const addBtn = (txt, cls, fn) => {
                const b = document.createElement('button');
                b.className = 'p-btn ' + cls; b.textContent = txt;
                b.onclick = (e) => { e.stopPropagation(); fn(b); };
                headerLeft.appendChild(b); return b;
            };

            if (info.site === 'twitch' && info.type === 'channel') {
                addBtn('CHAT', 'btn-purple', (b) => this.toggleChat(win, info.id, b));
                addBtn('POS', 'btn-gray', () => this.togglePosition(win));
                const danBtn = addBtn('弾幕', 'btn-dan', (b) => {
                    const active = b.classList.toggle('active');
                    this.danmaku.toggle(active, info.id);
                });
                addBtn('設定', 'btn-gray', () => settingsPanel.classList.toggle('open'));
            }
            addBtn('✕', 'btn-gray', () => { if (this.danmaku) this.danmaku.disconnect(); win.remove(); });

            const settingsPanel = document.createElement('div');
            settingsPanel.className = 'p-settings-panel';
            const makeRange = (label, key, min, max, step) => {
                const wrapper = document.createElement('label'); wrapper.textContent = label;
                const input = document.createElement('input'); input.type = 'range';
                input.min = min; input.max = max; input.step = step;
                input.value = Config.get(key, (min+max)/2);
                input.oninput = () => { Config.set(key, input.value); this.danmaku.updateParams(); };
                wrapper.appendChild(input); settingsPanel.appendChild(wrapper);
            };
            makeRange('サイズ', 'size', 12, 60, 1);
            makeRange('不透明度', 'opacity', 0.1, 1.0, 0.1);
            makeRange('速さ', 'speed', 1, 10, 0.5);

            header.appendChild(headerLeft);
            const videoIframe = document.createElement('iframe');
            videoIframe.src = (info.site === 'twitch') ? `https://player.twitch.tv/?channel=${info.id}&parent=${window.location.hostname}&autoplay=true` :
                            (info.type === 'live') ? `https://live.nicovideo.jp/embed/${info.id}` : `https://embed.nicovideo.jp/watch/${info.id}`;
            videoIframe.allowFullscreen = true;

            videoSection.appendChild(header);
            videoSection.appendChild(settingsPanel);
            videoSection.appendChild(document.createElement('div')).className = 'p-shield';
            videoSection.appendChild(danmakuArea);
            videoSection.appendChild(videoIframe);
            win.appendChild(videoSection);
            win.appendChild(document.createElement('div')).className = 'c-container';
            win.appendChild(document.createElement('div')).className = 'p-resizer';
            document.body.appendChild(win);
            this.activeWindow = win;
            this.setupInteractions(win, header, win.querySelector('.p-resizer'));
        }

        toggleChat(win, channelId, btn) {
            const chatCont = win.querySelector('.c-container');
            this.chatVisible = !this.chatVisible;
            if (this.chatVisible) {
                win.classList.add('chat-open'); btn.textContent = 'NO CHAT';
                if (!chatCont.querySelector('iframe')) {
                    const chatIframe = document.createElement('iframe');
                    chatIframe.src = `https://www.twitch.tv/embed/${channelId}/chat?parent=${window.location.hostname}&darkpopout`;
                    chatCont.appendChild(chatIframe);
                }
                if (this.chatPos === 'side') win.style.width = (win.offsetWidth + 250) + 'px';
            } else {
                win.classList.remove('chat-open'); btn.textContent = 'CHAT';
                if (this.chatPos === 'side') win.style.width = (win.offsetWidth - 250) + 'px';
            }
        }

        togglePosition(win) {
            if (!this.chatVisible) return;
            if (this.chatPos === 'side') {
                this.chatPos = 'bottom'; win.classList.replace('pos-side', 'pos-bottom');
                win.style.width = (win.offsetWidth - 250) + 'px';
            } else {
                this.chatPos = 'side'; win.classList.replace('pos-bottom', 'pos-side');
                win.style.width = (win.offsetWidth + 250) + 'px';
            }
        }

        setupInteractions(win, header, resizer) {
            let sX, sY, sW, sL, sT;
            header.onmousedown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                win.classList.add('p-dragging'); sX = e.clientX; sY = e.clientY; sL = win.offsetLeft; sT = win.offsetTop;
                const m = (me) => { win.style.left = `${sL + (me.clientX - sX)}px`; win.style.top = `${sT + (me.clientY - sY)}px`; };
                const u = () => { win.classList.remove('p-dragging'); document.removeEventListener('mousemove', m); document.removeEventListener('mouseup', u); };
                document.addEventListener('mousemove', m); document.addEventListener('mouseup', u);
            };
            resizer.onmousedown = (e) => {
                win.classList.add('p-resizing'); sX = e.clientX; sW = win.offsetWidth;
                const m = (me) => { const nW = sW + (me.clientX - sX); if (nW > 320) win.style.width = nW + 'px'; };
                const u = () => { win.classList.remove('p-resizing'); document.removeEventListener('mousemove', m); document.removeEventListener('mouseup', u); };
                document.addEventListener('mousemove', m); document.addEventListener('mouseup', u); e.preventDefault();
            };
        }

        bindEvents() {
            document.addEventListener('click', (e) => {
                const a = e.target.closest('a');
                if (!a) return;
                let info = null;
                try {
                    const u = new URL(a.href);
                    if (u.hostname.includes('twitch.tv')) {
                        const p = u.pathname.split('?')[0];
                        if (u.hostname === 'clips.twitch.tv') info = { site: 'twitch', type: 'clip', id: p.substring(1) };
                        else if (p.includes('/clip/')) info = { site: 'twitch', type: 'clip', id: p.split('/clip/')[1] };
                        else { const m = p.match(/^\/([^/]+)\/?$/); if (m && !['directory','p','search'].includes(m[1])) info = { site: 'twitch', type: 'channel', id: m[1] }; }
                    } else if (u.hostname.includes('nicovideo.jp') || u.hostname.includes('nico.ms')) {
                        const lm = a.href.match(/(lv[0-9]+)/); if (lm) info = { site: 'niconico', type: 'live', id: lm[1] };
                        else { const vm = a.href.match(/(sm[0-9]+|so[0-9]+|nm[0-9]+|[0-9]{7,12})/); if (vm) info = { site: 'niconico', type: 'video', id: vm[0] }; }
                    }
                } catch(err) {}
                if (info) { e.preventDefault(); e.stopImmediatePropagation(); this.createPlayer(info); }
            }, true);
        }
    }

    try { new MultiFloatingPlayer(); } catch (err) {}
})();