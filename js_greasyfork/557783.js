// ==UserScript==
// @name         あいもげYoutubeチャット弾幕ちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  あいもげのポップアッププレイヤーにYouTubeライブのチャットを弾幕表示
// @author       UserScriptDev
// @match        https://nijiurachan.net/*/thread.php*
// @icon         https://nijiurachan.net/favicon.ico
// @connect      www.youtube.com
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557783/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E5%BC%BE%E5%B9%95%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557783/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E5%BC%BE%E5%B9%95%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定
    // ==========================================
    const CONFIG = {
        DANMAKU_SPEED: 0.8,
        FONT_SIZE: 24,
        MAX_LINES: 13,
        COLOR: '#FFFFFF',
        STROKE_COLOR: '#000000',
        OPACITY: 0.7,
        MIN_POLL_INTERVAL: 500
    };

    // ==========================================
    // Danmaku Engine
    // ==========================================
    class DanmakuEngine {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.comments = [];
            this.isActive = false;
            this.animationFrameId = null;
            this.targetElement = null;

            // z-indexをプレイヤー(2147483647)よりさらに上にするか、同一にしてポインターイベントを抜く
            this.canvas.style.cssText = `
                position: fixed;
                pointer-events: none;
                z-index: 2147483647 !important;
                top: 0;
                left: 0;
                display: none;
            `;
        }

        attach(targetElement) {
            if (this.isActive) return;
            this.targetElement = targetElement;
            document.body.appendChild(this.canvas);
            this.isActive = true;
            this.updatePosition();
            this.loop();
        }

        updatePosition() {
            if (!this.targetElement) return;
            // プレイヤーが閉じられたかチェック
            if (!document.body.contains(this.targetElement)) {
                this.destroy();
                return;
            }

            const rect = this.targetElement.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0 || this.targetElement.style.display === 'none') {
                this.canvas.style.display = 'none';
                return;
            }

            this.canvas.style.display = 'block';
            // キャンバスサイズを追従
            if (this.canvas.width !== rect.width || this.canvas.height !== rect.height) {
                this.canvas.width = rect.width;
                this.canvas.height = rect.height;
                // コンテキスト設定はリサイズでリセットされるため再適用
                this.ctx.font = `bold ${CONFIG.FONT_SIZE}px "MS PGothic", sans-serif`;
                this.ctx.textBaseline = 'top';
                this.ctx.fillStyle = CONFIG.COLOR;
                this.ctx.strokeStyle = CONFIG.STROKE_COLOR;
                this.ctx.lineWidth = 2.0;
                this.ctx.globalAlpha = CONFIG.OPACITY;
            }
            this.canvas.style.top = `${rect.top}px`;
            this.canvas.style.left = `${rect.left}px`;
        }

        getVerticalPosition(speed) {
            const lineHeight = CONFIG.FONT_SIZE * 1.2;
            const canvasHeight = this.canvas.height;
            const canvasWidth = this.canvas.width;
            const availableLines = Math.min(CONFIG.MAX_LINES, Math.floor(canvasHeight / lineHeight));

            for (let i = 0; i < availableLines; i++) {
                const y = i * lineHeight + 10;
                let isSafe = true;

                for (const c of this.comments) {
                    if (Math.abs(c.y - y) < 1) {
                        const tailX = c.x + c.width;
                        const gap = canvasWidth - tailX;
                        if (gap < 20) { isSafe = false; break; }
                        if (speed > c.speed && gap < (canvasWidth * 0.2)) { isSafe = false; break; }
                    }
                }
                if (isSafe) return y;
            }
            return Math.floor(Math.random() * availableLines) * lineHeight + 10;
        }

        addComment(text) {
            if (document.hidden || !this.isActive || !text) return;
            const cleanText = text.trim();
            const len = cleanText.length;
            let speedMultiplier = len <= 5 ? 1.8 : len <= 15 ? 1.2 : 0.7;
            const finalSpeed = (CONFIG.DANMAKU_SPEED * speedMultiplier) + (Math.random() * 0.5);
            const width = this.ctx.measureText(cleanText).width;
            const yPos = this.getVerticalPosition(finalSpeed);

            this.comments.push({ text: cleanText, x: this.canvas.width, y: yPos, speed: finalSpeed, width: width });
        }

        loop() {
            if (!this.isActive) return;
            if (document.hidden) {
                this.animationFrameId = requestAnimationFrame(() => this.loop());
                return;
            }

            this.updatePosition();
            const width = this.canvas.width;
            const height = this.canvas.height;
            this.ctx.clearRect(0, 0, width, height);

            this.ctx.font = `bold ${CONFIG.FONT_SIZE}px "MS PGothic", sans-serif`;
            this.ctx.fillStyle = CONFIG.COLOR;
            this.ctx.strokeStyle = CONFIG.STROKE_COLOR;
            this.ctx.lineWidth = 2.0;
            this.ctx.globalAlpha = CONFIG.OPACITY;

            for (let i = 0; i < this.comments.length; i++) {
                const c = this.comments[i];
                c.x -= c.speed;
                this.ctx.strokeText(c.text, c.x, c.y);
                this.ctx.fillText(c.text, c.x, c.y);
                if (c.x + c.width < 0) {
                    this.comments.splice(i, 1);
                    i--;
                }
            }
            this.animationFrameId = requestAnimationFrame(() => this.loop());
        }

        clear() {
            this.comments = [];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        destroy() {
            this.isActive = false;
            if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
            if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
            this.comments = [];
            this.targetElement = null;
        }
    }

    // ==========================================
    // YouTube Chat Client
    // ==========================================
    class YouTubeChatClient {
        constructor(videoId, onMessage) {
            this.videoId = videoId;
            this.onMessage = onMessage;
            this.apiKey = null;
            this.clientVersion = null;
            this.continuation = null;
            this.isPolling = false;
            this.failCount = 0;
        }

        extractActions(json) {
            let actions =
                json.continuationContents?.liveChatContinuation?.actions ||
                json.contents?.liveChatRenderer?.actions ||
                json.actions;

            if (!actions) return;

            actions.forEach(action => {
                let item = action.addChatItemAction?.item || action.replayChatItemAction?.actions?.[0]?.addChatItemAction?.item;
                if (!item) return;

                if (item.liveChatTextMessageRenderer) {
                    const runs = item.liveChatTextMessageRenderer.message.runs;
                    if (runs) {
                        let message = runs.map(r => r.text || (r.emoji ? r.emoji.shortcuts[0] : "")).join("");
                        this.onMessage(message);
                    }
                }
            });
        }

        findContinuation(json) {
            const cont = json.continuationContents?.liveChatContinuation?.continuations?.[0];
            if (cont) return cont.timedContinuationData?.continuation || cont.invalidationContinuationData?.continuation;
            try {
                const match = JSON.stringify(json).match(/"continuation":"([^"]+)"/);
                return match ? match[1] : null;
            } catch(e) { return null; }
        }

        async init() {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.youtube.com/live_chat?v=${this.videoId}`,
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36" },
                    onload: (res) => {
                        const html = res.responseText;
                        const keyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/);
                        if (keyMatch) this.apiKey = keyMatch[1];
                        const verMatch = html.match(/"clientVersion":"([^"]+)"/);
                        if (verMatch) this.clientVersion = verMatch[1];
                        const initialDataMatch = html.match(/(?:window\["ytInitialData"\]|var ytInitialData)\s*=\s*({.+?});/);
                        if (initialDataMatch) {
                            try {
                                const json = JSON.parse(initialDataMatch[1]);
                                this.continuation = this.findContinuation(json);
                            } catch(e) {}
                        }

                        if (this.apiKey && this.continuation) {
                            this.onMessage("接続成功: 弾幕を開始します");
                            this.startPolling();
                            resolve(true);
                        } else {
                            reject("API Key/Continuation not found");
                        }
                    },
                    onerror: (e) => reject(e)
                });
            });
        }

        startPolling() {
            if (this.isPolling) return;
            this.isPolling = true;
            this.poll();
        }

        poll() {
            if (!this.isPolling || !this.continuation) return;
            const url = `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${this.apiKey}`;
            const data = {
                context: { client: { clientName: "WEB", clientVersion: this.clientVersion || "2.20210000.00.00" } },
                continuation: this.continuation
            };

            GM_xmlhttpRequest({
                method: "POST", url: url, data: JSON.stringify(data),
                headers: { "Content-Type": "application/json", "Origin": "https://www.youtube.com", "Referer": `https://www.youtube.com/live_chat?v=${this.videoId}` },
                onload: (res) => {
                    try {
                        if (res.status !== 200) {
                            if (res.status === 403 || res.status === 400) { this.isPolling = false; return; }
                        }
                        const json = JSON.parse(res.responseText);
                        this.extractActions(json);
                        const nextContinuation = this.findContinuation(json);
                        if (nextContinuation) { this.continuation = nextContinuation; this.failCount = 0; }
                        else { this.failCount++; }

                        let timeout = json.continuationContents?.liveChatContinuation?.continuations?.[0]?.timedContinuationData?.timeoutMs;
                        if (!timeout || timeout < CONFIG.MIN_POLL_INTERVAL) timeout = CONFIG.MIN_POLL_INTERVAL;

                        if (this.failCount < 10) setTimeout(() => this.poll(), timeout);
                    } catch (e) { setTimeout(() => this.poll(), 5000); }
                }
            });
        }
        stop() { this.isPolling = false; }
    }

    // ==========================================
    // Main Controller
    // ==========================================
    let engine = null;
    let chatClient = null;

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && engine) engine.clear();
    });

    function startService(iframe) {
        // 重複起動防止
        if (engine && engine.targetElement === iframe) return;
        if (engine) engine.destroy();
        if (chatClient) chatClient.stop();

        const src = iframe.src || '';
        const m = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (!m) return;
        const videoId = m[1];

        engine = new DanmakuEngine();
        engine.attach(iframe);

        chatClient = new YouTubeChatClient(videoId, (msg) => {
            if (engine) engine.addComment(msg);
        });
        chatClient.init().catch(e => {});
    }

    function initObserver() {
        // プレイヤー（Script A）が生成するコンテナのIDパターン
        // Script AのバージョンアップでIDが変わっても 'fixed-youtube-player' で始まる限り対応可能
        const PLAYER_ID_PREFIX = 'fixed-youtube-player';

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;

                        // 追加されたのが iframe そのものの場合
                        if (node.tagName === 'IFRAME') {
                            checkAndAttach(node);
                        }
                        // 追加された要素の中に iframe が含まれる場合
                        else if (node.querySelectorAll) {
                            node.querySelectorAll('iframe').forEach(checkAndAttach);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.tagName === 'IFRAME') {
                    // src属性などが変わった場合
                    checkAndAttach(mutation.target);
                }
            }

            // プレイヤーが削除されたら弾幕も破棄
            if (engine && engine.targetElement && !document.body.contains(engine.targetElement)) {
                if (engine) engine.destroy();
                if (chatClient) chatClient.stop();
                engine = null;
            }
        });

        function checkAndAttach(iframe) {
            const src = iframe.src || '';
            // Youtubeの埋め込み以外は無視
            if (!src.includes('youtube.com/embed') && !src.includes('youtu.be')) return;

            // 親要素を確認し「16:9強制ちゃん」のコンテナ内にあるかIDで高速判定
            const container = iframe.closest(`[id^="${PLAYER_ID_PREFIX}"]`);
            if (container) {
                // 16:9ちゃんにはチャット用と動画用の2つのiframeがある
                // チャット用(live_chat)には弾幕をつけない
                if (src.includes('live_chat')) return;

                // ここで弾幕開始
                startService(iframe);
            }
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    initObserver();

})();