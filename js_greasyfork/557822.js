// ==UserScript==
// @name         Discord HTML Exporter (Fixed 2025 + Quality Config)
// @namespace    https://greasyfork.org/users/1542285-murahito130/discord-html-exporter
// @version      4.0.0
// @description  Discordのサーバー、カテゴリ、スレッド、フォーラムをメッセージ履歴からディープスキャンし、画像・PDF・投票(Polls)・転送・コンポーネントを含めた完全なHTMLファイルとしてエクスポートします。API v10完全準拠。WebP品質設定機能付き。
// @match        https://discord.com/*
// @connect      cdn.discordapp.com
// @connect      media.discordapp.net
// @connect      cdnjs.cloudflare.com
// @connect      cdn.jsdelivr.net
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js
// @downloadURL https://update.greasyfork.org/scripts/557822/Discord%20HTML%20Exporter%20%28Fixed%202025%20%2B%20Quality%20Config%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557822/Discord%20HTML%20Exporter%20%28Fixed%202025%20%2B%20Quality%20Config%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 0. トークンインターセプター & グローバル設定
    // ==========================================
    let INTERCEPTED_TOKEN = null;

    // API Version (v10) - Discord Official Reference
    const API_BASE = "https://discord.com/api/v10";

    // PDF.js 設定
    const PDF_JS_VERSION = '2.16.105';
    const PDF_BASE_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDF_JS_VERSION}/`;
    const PDF_WORKER_URL = `${PDF_BASE_URL}build/pdf.worker.min.js`;
    const PDF_CMAP_URL = `${PDF_BASE_URL}cmaps/`;
    const PDF_FONT_URL = `${PDF_BASE_URL}standard_fonts/`;

    let isWorkerInitialized = false;

    // メインスレッドをブロックしないためのヘルパー
    const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

    // XHRをフックしてトークンを取得
    (function installInterceptor() {
        const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (header && header.toLowerCase() === 'authorization' && value) {
                if (INTERCEPTED_TOKEN !== value) {
                    INTERCEPTED_TOKEN = value;
                    if (typeof GM_setValue === 'function') {
                        GM_setValue("discord_token", value);
                    }
                }
            }
            return origSetRequestHeader.apply(this, arguments);
        };
    })();

    // ==========================================
    // 1. 設定 (Configuration)
    // ==========================================
    const CONFIG = {
        MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB制限
        // 並列処理の設定
        CONCURRENCY: {
            CHANNEL_SCAN: 3,
            MESSAGE_FETCH: 3,
            ASSET_DOWNLOAD: 6,
            USER_RESOLVE: 5,
            LINK_RESOLVE: 5,
            REACTION_FETCH: 4,
            CONTEXT_FETCH: 3
        },
        API_WAIT: { MIN: 200, MAX: 500 },
        DB_NAME: "DiscordLoggerDB_v4_1_0_Guild",
        RETRY_LIMIT: 3,
        OBSERVER_THROTTLE: 1500,
        COMPRESS_PDF: true,
        PDF_SCALE: 2.0,
        DEFAULT_QUALITY: 1.0, // デフォルト画質
        UI_UPDATE_INTERVAL: 200
    };

    // 特定のBotのメッセージからスレッド保存を行うためのBot IDリスト
    const TARGET_BOTS = [
        "1248774395628093460",
        "926051893728403486"
    ];

    // 権限計算用定数 (BitFlag)
    const PERMISSIONS = {
        ADMINISTRATOR: 0x8n,
        VIEW_CHANNEL: 0x400n, // 1024
        READ_MESSAGE_HISTORY: 0x10000n // 65536
    };

    // 正規表現
    const RE_USER_ID = /<@!?(\d+)>/g;
    const RE_DISCORD_LINK = /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/channels\/(\d+|@me)\/(\d+)(?:\/(\d+))?/g;
    const RE_CUSTOM_EMOJI_RAW = /<(a?):(\w+):(\d+)>/g;
    const RE_CUSTOM_EMOJI_HTML = /&lt;(a?):(\w+):(\d+)&gt;/g;
    const RE_CHANNEL_ID = /<#(\d+)>/g;
    const RE_CODE_BLOCK = /```(?:(\w+)\n)?([\s\S]*?)```/g;
    const RE_INLINE_CODE = /`([^`]+)`/g;
    const RE_BLOCKQUOTE_START = /^&gt;\s?/;
    const RE_BLOCKQUOTE_MULTILINE = /^&gt;&gt;&gt;\s?/;
    const RE_HEADING = /^(#{1,3})\s+(.*)$/;
    const RE_SUBTEXT = /^-#\s+(.*)$/;
    const RE_UNORDERED_LIST = /^(\s*)([-*+])\s+(.*)$/;
    const RE_ORDERED_LIST = /^(\s*)(\d+\.)\s+(.*)$/;
    const RE_LINK_MARKDOWN = /\[([^\]]+)\]\(&lt;(https?:\/\/[^&]+)&gt;\)/g;
    const RE_LINK_MARKDOWN_2 = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const RE_LINK_PLAIN = /&lt;(https?:\/\/[^&]+)&gt;/g;
    const RE_URL_AUTO = /(https?:\/\/[a-zA-Z0-9.\-_~:/?#[\]@!$&'()*+,;=%]+)/g;
    const RE_BOLD_ITALIC = /\*\*\*(.*?)\*\*\*/g;
    const RE_BOLD = /\*\*(.*?)\*\*/g;
    const RE_UNDERLINE = /__(.*?)__/g;
    const RE_STRIKETHROUGH = /~~(.*?)~~/g;
    const RE_SPOILER = /\|\|(.*?)\|\|/g;
    const RE_ITALIC_ASTERISK = /\*([^*]+)\*/g;
    const RE_ITALIC_UNDERSCORE = /(?<!\w)_((?:__|[^_])+?)_(?!\w)/g;
    const RE_TIMESTAMP = /&lt;t:(\d+)(?::([tTdDfFrR]))?&gt;/g;
    const RE_SLASH_COMMAND = /&lt;\/([\w- ]+):(\d+)&gt;/g;
    const RE_MENTION_ROLE = /&lt;@&amp;(\d+)&gt;/g;
    const RE_MENTION_USER = /&lt;@!?(\d+)&gt;/g;
    const RE_MENTION_CHANNEL = /&lt;#(\d+)&gt;/g;
    const RE_MENTION_EVERYONE = /@(everyone|here)/g;

    const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const TIME_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
    const FULL_DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // ==========================================
    // 1.5 Keep Awake (Audio Context)
    // ==========================================
    const KeepAwake = {
        ctx: null, osc: null, gain: null,
        enable: async function() {
            try {
                if (!this.ctx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContext();
                }
                if (this.ctx.state === 'suspended') await this.ctx.resume();
                if (this.osc) return;
                this.osc = this.ctx.createOscillator();
                this.gain = this.ctx.createGain();
                this.osc.type = 'sine';
                this.osc.frequency.setValueAtTime(440, this.ctx.currentTime);
                this.gain.gain.setValueAtTime(0.0001, this.ctx.currentTime); // Silent
                this.osc.connect(this.gain);
                this.gain.connect(this.ctx.destination);
                this.osc.start();
                console.log("🔊 KeepAwake enabled.");
            } catch (e) { console.warn("KeepAwake failed:", e); }
        },
        disable: function() {
            try {
                if (this.osc) { this.osc.stop(); this.osc.disconnect(); this.osc = null; }
                if (this.gain) { this.gain.disconnect(); this.gain = null; }
                if (this.ctx) { this.ctx.close(); this.ctx = null; }
                console.log("🔇 KeepAwake disabled.");
            } catch (e) { console.warn("KeepAwake disable failed:", e); }
        }
    };

    // ==========================================
    // 2. 並列キューシステム
    // ==========================================
    async function runParallelQueue(items, limit, taskFn, statusCb) {
        let cursor = 0;
        const total = items.length;
        let completed = 0;
        let lastUiUpdate = 0;

        const updateStatus = () => {
            if (!statusCb) return;
            const now = Date.now();
            if (now - lastUiUpdate > CONFIG.UI_UPDATE_INTERVAL || completed === total) {
                statusCb(completed, total, Math.min(limit, total - completed));
                lastUiUpdate = now;
            }
        };

        const worker = async () => {
            while (true) {
                const index = cursor++;
                if (index >= total) break;
                try {
                    await taskFn(items[index], index, total);
                } catch (err) {
                    console.error(`Task failed at index ${index}:`, err);
                } finally {
                    completed++;
                    updateStatus();
                }
            }
        };

        const workers = Array(Math.min(limit, total)).fill(null).map(worker);
        await Promise.all(workers);
    }

    // ==========================================
    // 3. シンプルなZIP実装
    // ==========================================
    class SimpleZip {
        constructor() {
            this.files = [];
            this.crcTable = new Int32Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                this.crcTable[i] = c;
            }
        }
        crc32(data) {
            let crc = -1;
            for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ this.crcTable[(crc ^ data[i]) & 0xFF];
            return (crc ^ -1) >>> 0;
        }
        addFile(path, contentBuffer) {
            let data = (contentBuffer instanceof Uint8Array) ? contentBuffer : (contentBuffer instanceof ArrayBuffer ? new Uint8Array(contentBuffer) : new TextEncoder().encode(String(contentBuffer)));
            this.files.push({ path, content: data });
        }
        async generateAsync(progressCallback) {
            const parts = [];
            const centralDir = [];
            let offset = 0;
            const textEnc = new TextEncoder();
            const dosTime = this.getDosTime(new Date());
            let processedCount = 0;
            let lastYieldTime = Date.now();

            for (const file of this.files) {
                const pathBytes = textEnc.encode(file.path);
                const contentBuffer = file.content;
                const crc = this.crc32(contentBuffer);
                const size = contentBuffer.length;

                const lfh = new Uint8Array(30 + pathBytes.length);
                const view = new DataView(lfh.buffer);
                view.setUint32(0, 0x04034b50, true);
                view.setUint16(4, 10, true);
                view.setUint16(6, 0x0800, true);
                view.setUint16(8, 0, true);
                view.setUint32(10, dosTime, true);
                view.setUint32(14, crc, true);
                view.setUint32(18, size, true);
                view.setUint32(22, size, true);
                view.setUint16(26, pathBytes.length, true);
                view.setUint16(28, 0, true);
                lfh.set(pathBytes, 30);
                parts.push(lfh);
                parts.push(contentBuffer);

                const cdr = new Uint8Array(46 + pathBytes.length);
                const cView = new DataView(cdr.buffer);
                cView.setUint32(0, 0x02014b50, true);
                cView.setUint16(4, 10, true);
                cView.setUint16(6, 10, true);
                cView.setUint16(8, 0x0800, true);
                cView.setUint16(10, 0, true);
                cView.setUint32(12, dosTime, true);
                cView.setUint32(16, crc, true);
                cView.setUint32(20, size, true);
                cView.setUint32(24, size, true);
                cView.setUint16(28, pathBytes.length, true);
                cView.setUint16(30, 0, true);
                cView.setUint16(32, 0, true);
                cView.setUint16(34, 0, true);
                cView.setUint16(36, 0, true);
                cView.setUint32(38, 0, true);
                cView.setUint32(42, offset, true);
                cdr.set(pathBytes, 46);
                centralDir.push(cdr);
                offset += lfh.length + size;

                processedCount++;
                const now = Date.now();
                if (now - lastYieldTime > 50) {
                    if (progressCallback) progressCallback(processedCount, this.files.length);
                    await yieldToMain();
                    lastYieldTime = Date.now();
                }
            }
            const cdSize = centralDir.reduce((acc, val) => acc + val.length, 0);
            const eocd = new Uint8Array(22);
            const eView = new DataView(eocd.buffer);
            eView.setUint32(0, 0x06054b50, true);
            eView.setUint16(4, 0, true);
            eView.setUint16(6, 0, true);
            eView.setUint16(8, this.files.length, true);
            eView.setUint16(10, this.files.length, true);
            eView.setUint32(12, cdSize, true);
            eView.setUint32(16, offset, true);
            eView.setUint16(20, 0, true);
            return new Blob([...parts, ...centralDir, eocd], { type: "application/zip" });
        }
        getDosTime(date) {
            const y = date.getFullYear(); const m = date.getMonth() + 1; const d = date.getDate();
            const h = date.getHours(); const min = date.getMinutes(); const sec = date.getSeconds();
            return ((y - 1980) << 25) | (m << 21) | (d << 16) | (h << 11) | (min << 5) | (sec >> 1);
        }
    }

    // ==========================================
    // 4. ユーティリティ関数
    // ==========================================
    function sanitize(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
    function safeStringify(obj) {
        const cache = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) return undefined;
                cache.add(value);
            }
            return value;
        });
    }
    function getAvatarUrl(author) {
        if (!author) return "https://cdn.discordapp.com/embed/avatars/0.png";
        if (author.avatar) return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`;
        if (author.discriminator && author.discriminator !== '0') {
            const disc = parseInt(author.discriminator);
            const index = disc % 5;
            return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
        }
        const index = Number((BigInt(author.id) >> 22n) % 6n);
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    }
    function decToHexColor(d) { return d ? "#"+d.toString(16).padStart(6,'0') : "#2b2d31"; }
    function extractUserIds(text) {
        const ids = new Set(); if (!text) return ids; let match;
        RE_USER_ID.lastIndex = 0; while ((match = RE_USER_ID.exec(text)) !== null) ids.add(match[1]);
        return ids;
    }
    function extractDiscordLinks(text) {
        const links = []; if (!text) return links; let match;
        RE_DISCORD_LINK.lastIndex = 0;
        while ((match = RE_DISCORD_LINK.exec(text)) !== null) {
            links.push({ full: match[0], guildId: match[1], channelId: match[2], messageId: match[3] || null });
        }
        return links;
    }
    function extractCustomEmojis(text) {
        const emojis = []; if (!text) return emojis; let match;
        RE_CUSTOM_EMOJI_RAW.lastIndex = 0;
        while ((match = RE_CUSTOM_EMOJI_RAW.exec(text)) !== null) {
            emojis.push({ animated: match[1] === 'a', name: match[2], id: match[3], full: match[0] });
        }
        return emojis;
    }
    function extractChannelIds(text) {
        const ids = new Set(); if (!text) return ids; let match;
        RE_CHANNEL_ID.lastIndex = 0; while ((match = RE_CHANNEL_ID.exec(text)) !== null) ids.add(match[1]);
        return ids;
    }
    function compareChannelsDiscordStyle(a, b) {
        const isVoiceA = (a.type === 2 || a.type === 13);
        const isVoiceB = (b.type === 2 || b.type === 13);
        if (isVoiceA !== isVoiceB) return isVoiceA ? 1 : -1;
        if (a.position === b.position) return a.id - b.id;
        return a.position - b.position;
    }
    function hasChannelPermission(channel, member, guildRoles, guildInfo) {
        if (!member || !member.user || !guildRoles) return false;
        if (guildInfo && guildInfo.owner_id === member.user.id) return true;
        const guildId = member.guild_id;
        const memberRoles = member.roles || [];
        let permissions = BigInt(0);
        const everyoneRole = guildRoles.find(r => r.id === guildId);
        if (everyoneRole) permissions |= BigInt(everyoneRole.permissions);
        for (const rid of memberRoles) {
            const role = guildRoles.find(r => r.id === rid);
            if (role) permissions |= BigInt(role.permissions);
        }
        if ((permissions & PERMISSIONS.ADMINISTRATOR) === PERMISSIONS.ADMINISTRATOR) return true;
        if (channel.permission_overwrites) {
            const everyoneOverwrite = channel.permission_overwrites.find(o => o.id === guildId);
            if (everyoneOverwrite) {
                permissions &= ~BigInt(everyoneOverwrite.deny);
                permissions |= BigInt(everyoneOverwrite.allow);
            }
            let roleAllow = BigInt(0); let roleDeny = BigInt(0);
            for (const rid of memberRoles) {
                const ow = channel.permission_overwrites.find(o => o.id === rid);
                if (ow) { roleDeny |= BigInt(ow.deny); roleAllow |= BigInt(ow.allow); }
            }
            permissions &= ~roleDeny; permissions |= roleAllow;
            const memberOverwrite = channel.permission_overwrites.find(o => o.id === member.user.id);
            if (memberOverwrite) {
                permissions &= ~BigInt(memberOverwrite.deny);
                permissions |= BigInt(memberOverwrite.allow);
            }
        }
        const required = PERMISSIONS.VIEW_CHANNEL | PERMISSIONS.READ_MESSAGE_HISTORY;
        return (permissions & required) === required;
    }

    // --- アイコン (SVG) ---
    const ICONS = {
        TEXT: `<svg class="icon-channel" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.887 21c-.311 0-.546-.281-.492-.587L6 17H2.595c-.31 0-.546-.28-.492-.586l.175-1c.042-.24.25-.414.492-.414H6.35l1.06-6H4.005c-.311 0-.546-.28-.493-.586l.175-1A.5.5 0 0 1 4.18 7h3.58l.637-3.587a.5.5 0 0 1 .492-.413h1.015c.32 0 .558.294.495.606L9.667 7h6l.636-3.587a.5.5 0 0 1 .492-.413h1.015c.32 0 .558.294.495.606L17.573 7h3.405c.31 0 .546.28.492.586l-.175 1c-.042.24-.25.414-.492.414H17.223l-1.06 6h3.405c.31 0 .546.28.493.586l-.175 1a.5.5 0 0 1-.493.414h-3.58l-.637 3.587a.5.5 0 0 1-.492.413h-1.015a.5.5 0 0 1-.495-.606L13.907 17H7.907l-.637 3.587a.5.5 0 0 1-.492.413H5.887zM9.313 15h6l1.06-6h-6l-1.06 6z"></path></svg>`,
        VOICE: `<svg class="icon-channel" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.079C11.009 2.925 10.579 3.01 10.293 3.296L6 8.002H3C2.45 8.002 2 8.453 2 9.002v6c0 .55.45 1 1 1h3l4.293 4.708c.286.286.716.371 1.09.217.374-.155.617-.52.617-.925V4.002c0-.403-.243-.77-.617-.923zM14 5.002v2c2.757 0 5 2.244 5 5 0 2.757-2.243 5-5 5v2c3.86 0 7-3.139 7-7 0-3.86-3.14-7-7-7zm0 4v6c1.654 0 3-1.347 3-3 0-1.655-1.346-3-3-3z"></path></svg>`,
        ANNOUNCE: `<svg class="icon-channel" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3c-.72 0-1.42.213-2.019.613-.598.4-1.066.968-1.341 1.632-.276.665-.348 1.396-.208 2.102.14.705.487 1.353.996 1.862.509.509 1.157.855 1.862.996.706.14 1.437.068 2.102-.208.665-.275 1.233-.743 1.632-1.341C15.42 8.057 15.638 7.357 15.638 6.638V3H12zm7 0v3.638c0 1.088-.304 2.159-.875 3.089a5.62 5.62 0 0 1-2.341 2.149c.958.472 1.771 1.22 2.341 2.15.571.929.875 2  .875 3.088V21H12v-3.886c0-.574-5.83-5.583-6.501-6.198-.307-.477-.761-.847-1.292-1.066-.53-.22-1.126-.277-1.697-.167-.307-.477-.128-1.042-.128-1.615V6.637c0-.305.049-.597.13-.878 1.008-.21 1.938-.701 2.693-1.42 1.516-1.437 3.572-2.244 5.68-2.227-.267-1.017.274-2.093.81-2.112H19zM7.162 15.499c-.319-.477-.772-.847-1.303-1.066-.531-.22-1.127-.277-1.697-.167v-2.515c-.72.12-1.457.12-2.178 0-.267-.045-.531-.111-.789-.198v1.033c0 .574.17 1.138.489 1.615.33.494.801.872 1.35 1.096.037.015.637 1.017 1.35 1.032-.549.223-1.02.602-1.35 1.096-.319.477-.489 1.041-.489 1.615V21h2.967v-3.886c0-.574-.17-1.138-.489-1.615z"></path></svg>`,
        FORUM: `<svg class="icon-channel" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M2.3 9.494C2.3 6.643 4.887 4.2 8.35 4.2h1.5c3.463 0 6.05 2.443 6.05 5.294v.206c0 2.85-2.587 5.294-6.05 5.294H8.35c-1.045 0-2.03-.217-2.917-.597L2.942 15.43c-.485.197-.985-.205-.89-.712l.248-5.224zm16.275-1.355c1.218.512 2.125 1.665 2.125 3.06v.206c0 2.85-2.587 5.294-6.05 5.294h-1.5c-.327 0-.647-.021-1.112-.06-1.168.886-2.275 1.457-3.552 1.687l.885 1.401c.34.542.833.921 1.383 1.144.037.015 1.593.668 2.144.818.655.178 1.297-.05 1.73-.478l.362-5.522c.434.172.894.267 1.365.267 3.463 0 6.05-2.443 6.05-5.294v-.206c0-1.163-.484-2.215-1.285-3.017z"></path></svg>`,
        THREAD: `<svg class="icon-thread" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.5 18v-2H8.5V8.5c0-1.1.9-2 2-2H19.5V4.5h-9c-2.2 0-4 1.8-4 4V18H4.5v2H19.5v-2z"></path></svg>`,
        PIN: `<svg class="icon-sys" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12L12.101 2.101l-1.415 1.413 1.415 1.415L7.151 9.878a2.5 2.5 0 0 0-1.77 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.66 0 1.29-.26 1.77-.73l4.95 4.95-1.415 1.415 1.415 1.414L22 11.298V12z"></path></svg>`,
        THREAD_START: `<svg class="icon-sys" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.5 18v-2H8.5V8.5c0-1.1.9-2 2-2H19.5V4.5h-9c-2.2 0-4 1.8-4 4V18H4.5v2H19.5v-2z"></path></svg>`,
        FILE: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M6 2C4.895 2 4 2.895 4 4V20C4 21.105 4.895 22 6 22H18C19.105 22 20 21.105 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13Z"></path></svg>`,
        PENCIL: `<svg class="icon-sys" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.35 4.1a1 1 0 0 1 1.4 0l4.15 4.15a1 1 0 0 1 0 1.42l-9.9 9.9a1 1 0 0 1-.7.3H5.5a1 1 0 0 1-1-1v-3.8a1 1 0 0 1 .3-.7l9.55-9.56zm-1.42 2.82L5.5 14.33v2.17h2.17l7.41-7.41-2.15-2.17zM17.13 6.9 19.3 9.07l-1.42 1.42-2.17-2.17 1.42-1.42z"></path></svg>`,
        ARROW_RIGHT: `<svg class="icon-sys" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 15.88 13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1-1v-3.8z"></path></svg>`,
        BOOST: `<svg class="icon-sys" viewBox="0 0 24 24"><path fill="currentColor" d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm9 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-1.8-9.9c.3-.5.9-.6 1.4-.2l7.1 5.3c.5.4.6 1.1.2 1.6l-2.8 3.7c-.4.5-1.1.6-1.6.2l-7.1-5.3c-.5-.4-.6-1.1-.2-1.6l2.8-3.7Z"></path></svg>`,
        SPINE: `<svg class="thread-spine-icon" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5 2C5 1.44772 4.55228 1 4 1C3.44772 1 3 1.44772 3 2V13C3 13.5523 3.44772 14 4 14H15C15.5523 14 16 13.5523 16 13C16 12.4477 15.5523 12 15 12H5V2Z"></path></svg>`,
        FORWARD: `<svg class="headerIcon__122e4" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M21.7 7.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L18.58 9H13a7 7 0 0 0-7 7v4a1 1 0 1 1-2 0v-4a9 9 0 0 1 9-9h5.59l-3.3-3.3a1 1 0 0 1 1.42-1.4l5 5Z" class=""></path></svg>`,
        DOWNLOAD: `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.58a1 1 0 0 1-.7-.29l-4-4a1 1 0 1 1 1.41-1.42L11 12.17V3a1 1 0 1 1 2 0v9.17l2.3-2.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-.7.29ZM19 18a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2h14Z" class=""></path></svg>`,
        SAVE_MSG: `<svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"></path><path fill="currentColor" d="M14 3v5h5l-5-5Z" style="opacity:0.5"></path></svg>`,
        HAMBURGER: `<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>`,
        POLL: `<svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"></path></svg>`
    };

    function getChannelIconSVG(type, isThread) {
        if (isThread || type === 10 || type === 11 || type === 12) return ICONS.THREAD;
        if (type === 2 || type === 13) return ICONS.VOICE;
        if (type === 5) return ICONS.ANNOUNCE;
        if (type === 15) return ICONS.FORUM; // GUILD_FORUM
        if (type === 16) return ICONS.FORUM; // GUILD_MEDIA
        return ICONS.TEXT;
    }

    // ==========================================
    // 5. グローバルキャッシュ (Databases)
    // ==========================================
    const USER_DB = {};
    const ROLE_DB = {};
    const CHANNEL_DB = {};
    const MSG_PREVIEW_DB = {};
    const channelFetchPromises = {};

    function cacheUser(user, memberInfo = null) {
        if (!user || !user.id) return;
        if (!USER_DB[user.id]) {
            USER_DB[user.id] = {
                id: user.id, username: user.username, global_name: user.global_name,
                avatar: user.avatar, discriminator: user.discriminator, bot: user.bot,
                nick: null, color: null
            };
        }
        const entry = USER_DB[user.id];
        if (memberInfo) {
            if (memberInfo.nick) entry.nick = memberInfo.nick;
            if (memberInfo.roles && memberInfo.roles.length > 0) {
                let highestPos = -1; let color = null;
                memberInfo.roles.forEach(rid => {
                    const r = ROLE_DB[rid];
                    if (r && r.colorHex && r.position > highestPos) {
                        highestPos = r.position; color = r.colorHex;
                    }
                });
                if (color) entry.color = color;
            }
        }
        if (user.global_name && !entry.global_name) entry.global_name = user.global_name;
        if (!entry.avatar && user.avatar) entry.avatar = user.avatar;
    }
    function cacheRole(r) {
        if (!r || !r.id) return;
        ROLE_DB[r.id] = { id: r.id, name: r.name, colorHex: r.color ? `#${r.color.toString(16).padStart(6,'0')}` : null, position: r.position, icon: r.icon };
    }

    const TaskQueue = {
        queue: [], isProcessing: false,
        add: function(taskFunc, startCallback, endCallback) {
            this.queue.push({ task: taskFunc, onStart: startCallback, onEnd: endCallback });
            if (!this.isProcessing) this.processLoop();
        },
        processLoop: async function() {
            if (this.isProcessing) return;
            this.isProcessing = true;
            while (this.queue.length > 0) {
                const item = this.queue.shift();
                try { if (item.onStart) item.onStart(true); await item.task(); }
                catch (e) { console.error("Task failed:", e); alert("Task failed: " + e); }
                finally { if (item.onEnd) item.onEnd(); }
            }
            this.isProcessing = false;
        }
    };

    const DB = {
        delete: () => new Promise((resolve) => {
            const req = indexedDB.deleteDatabase(CONFIG.DB_NAME);
            req.onsuccess = resolve; req.onerror = resolve; req.onblocked = resolve;
        }),
        open: () => new Promise((resolve, reject) => {
            const req = indexedDB.open(CONFIG.DB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('channels')) db.createObjectStore('channels', { keyPath: 'id' });
                if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'url' });
            };
            req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error);
        }),
        clear: async (db) => {
            const clearStore = (name) => new Promise((resolve, reject) => {
                const tx = db.transaction(name, 'readwrite');
                tx.objectStore(name).clear().onsuccess = resolve; tx.onerror = reject;
            });
            await Promise.all([clearStore('channels'), clearStore('assets')]);
        },
        put: (db, store, data) => new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readwrite');
            tx.onabort = (e) => reject(e.target.error); tx.onerror = (e) => reject(e.target.error);
            const req = tx.objectStore(store).put(data); req.onsuccess = () => resolve();
        }),
        streamStore: (db, store, callback) => new Promise((resolve, reject) => {
            const tx = db.transaction(store, 'readonly');
            const req = tx.objectStore(store).openCursor();
            req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) { callback(cursor.value); cursor.continue(); } else { resolve(); }
            };
            req.onerror = reject;
        })
    };

    // ==========================================
    // 6. トークン取得
    // ==========================================
    function getStoredToken() { return GM_getValue("discord_token", null); }
    function setStoredToken(token) { const t = token.replace(/^"|"$/g, '').trim(); GM_setValue("discord_token", t); return t; }
    function getAutoToken() {
        if (INTERCEPTED_TOKEN) return INTERCEPTED_TOKEN;
        const stored = getStoredToken(); if (stored) return stored;
        const win = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
        let token = null;
        try { const lsToken = win.localStorage.getItem("token"); if (lsToken) token = JSON.parse(lsToken); } catch (e) {}
        return token;
    }

    // ==========================================
    // 7. API コール
    // ==========================================
    async function apiCall(url) {
        let retries = 0;
        let token = getAutoToken();

        while (true) {
            if (!token) {
                token = prompt("Discord Tokenが見つかりません。\n手動入力してください:");
                if (token) setStoredToken(token); else throw "Cancelled";
            }

            try {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            "Authorization": token,
                            "Content-Type": "application/json",
                            "X-Super-Properties": btoa(JSON.stringify({ "os": "Windows", "browser": "Chrome", "device": "", "system_locale": "ja" }))
                        },
                        onload: resolve, onerror: reject
                    });
                });

                if (res.status === 200) {
                    return JSON.parse(res.responseText);
                } else if (res.status === 401) {
                    if (retries < CONFIG.RETRY_LIMIT) {
                        GM_deleteValue("discord_token"); INTERCEPTED_TOKEN = null; token = null; retries++; continue;
                    } else throw "401 Unauthorized";
                } else if (res.status === 429) {
                    if (retries < CONFIG.RETRY_LIMIT) {
                        let waitTimeMs = 1000;
                        try { const body = JSON.parse(res.responseText); if (body.retry_after) waitTimeMs = body.retry_after * 1000; } catch(e) {}
                        waitTimeMs += 150;
                        console.warn(`Rate limit 429: waiting ${Math.round(waitTimeMs)}ms`);
                        await new Promise(r => setTimeout(r, waitTimeMs));
                        retries++;
                        continue;
                    } else throw "429 Rate Limit Exceeded";
                } else {
                    if (retries < CONFIG.RETRY_LIMIT && res.status >= 500) {
                        await new Promise(r => setTimeout(r, 2000));
                        retries++; continue;
                    }
                    throw { status: res.status, statusText: res.statusText, url: url };
                }
            } catch (err) {
                if (typeof err === "string" && (err.includes("401") || err.includes("429") || err.includes("Cancelled"))) throw err;
                if (err.status) throw err;
                 if (retries < CONFIG.RETRY_LIMIT) {
                    await new Promise(r => setTimeout(r, 2000));
                    retries++; continue;
                }
                throw err;
            }
        }
    }

    async function randomWait() {
        return new Promise(r => setTimeout(r, CONFIG.API_WAIT.MIN + Math.random() * (CONFIG.API_WAIT.MAX - CONFIG.API_WAIT.MIN)));
    }

    // ==========================================
    // 8. アセットダウンローダー
    // ==========================================

    function blobToArrayBuffer(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    }

    function canvasToBlobPromise(canvas, mime, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, mime, quality));
    }

    async function processImageBlob(blob, quality) {
        const type = blob.type;
        if (type === "image/gif" || type === "image/webp" || type === "image/avif") return blob;
        const isConvertible = type === "image/png" || type === "image/bmp" || type === "image/tiff" || type === "image/jpeg" || type === "image/jpg";
        if (!isConvertible) return blob;

        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement("canvas");
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                // 指定された品質でWebPに変換
                const q = (typeof quality === 'number') ? quality : CONFIG.PDF_QUALITY;
                canvas.toBlob((webpBlob) => { resolve(webpBlob || blob); }, "image/webp", q);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
            img.src = url;
        });
    }

    async function initPdfWorker() {
        if (isWorkerInitialized) return;
        try {
            const workerSource = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: PDF_WORKER_URL,
                    onload: (res) => { if (res.status === 200) resolve(res.responseText); else reject("Failed to fetch PDF worker"); },
                    onerror: reject
                });
            });

            const fetchProxyShim = `(function(){const originalFetch=self.fetch;self.fetch=function(input,init){const url=(typeof input==='string')?input:input.url;if(url.includes('jsdelivr.net')||url.endsWith('.bcmap')||url.endsWith('.pfb')||url.endsWith('.ttf')){return new Promise((resolve,reject)=>{const id=Math.random().toString(36).substr(2);const handler=(e)=>{if(e.data&&e.data.type==='GM_FETCH_RESPONSE'&&e.data.id===id){self.removeEventListener('message',handler);if(e.data.error){reject(new TypeError('Network request failed via proxy'));}else{const response=new Response(e.data.body,{status:e.data.status,statusText:e.data.statusText});resolve(response);}}};self.addEventListener('message',handler);self.postMessage({type:'GM_FETCH_REQUEST',url:url,id:id});});}return originalFetch(input,init);};})();`;
            const blob = new Blob([fetchProxyShim + "\n" + workerSource], { type: "text/javascript" });
            const workerBlobUrl = URL.createObjectURL(blob);

            const OriginalWorker = window.Worker;
            window.Worker = function(url, options) {
                const isPdfWorker = url === workerBlobUrl;
                const worker = new OriginalWorker(url, options);
                if (isPdfWorker) {
                    worker.addEventListener('message', (e) => {
                        if (e.data && e.data.type === 'GM_FETCH_REQUEST') {
                            GM_xmlhttpRequest({
                                method: 'GET', url: e.data.url, responseType: 'arraybuffer',
                                onload: (res) => { worker.postMessage({ type: 'GM_FETCH_RESPONSE', id: e.data.id, status: res.status, statusText: res.statusText, body: res.response }, [res.response]); },
                                onerror: () => { worker.postMessage({ type: 'GM_FETCH_RESPONSE', id: e.data.id, error: true }); }
                            });
                        }
                    });
                }
                return worker;
            };

            pdfjsLib.GlobalWorkerOptions.workerSrc = workerBlobUrl;
            pdfjsLib.GlobalWorkerOptions.cMapUrl = PDF_CMAP_URL;
            pdfjsLib.GlobalWorkerOptions.cMapPacked = true;
            isWorkerInitialized = true;
        } catch (e) { console.error("PDF Worker init failed:", e); }
    }

    async function processPdfAndStore(db, originalBlob, originalUrl, quality) {
        try {
            const originalSize = originalBlob.size;
            let currentTotalSize = 0;
            const tempAssets = [];
            const arrayBuffer = await blobToArrayBuffer(originalBlob);
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, cMapUrl: PDF_CMAP_URL, cMapPacked: true, standardFontDataUrl: PDF_FONT_URL, disableFontFace: true, isEvalSupported: false });
            const pdf = await loadingTask.promise;
            const pagesHtml = [];
            let filename = decodeURIComponent(originalUrl.split('/').pop().split(/[?#]/)[0] || "document.pdf");

            const q = (typeof quality === 'number') ? quality : CONFIG.PDF_QUALITY;

            for (let i = 1; i <= pdf.numPages; i++) {
                await yieldToMain();
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: CONFIG.PDF_SCALE });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height; canvas.width = viewport.width;
                context.fillStyle = "#FFFFFF"; context.fillRect(0, 0, canvas.width, canvas.height);
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                // PDFも指定された品質で変換
                const webpBlob = await canvasToBlobPromise(canvas, "image/webp", q);
                const webpBuffer = await blobToArrayBuffer(webpBlob);

                currentTotalSize += webpBuffer.byteLength;
                if (currentTotalSize > originalSize) { console.warn(`PDF conversion skipped: Size exceed for ${originalUrl}`); return false; }

                const pageUrl = originalUrl + `_page_${i}_.webp`;
                tempAssets.push({ url: pageUrl, buffer: webpBuffer, mime: "image/webp_pdf_page" });
                const localPagePath = getLocalAssetPath(pageUrl, "image/webp_pdf_page");
                const localPageFilename = localPagePath.split('/').pop();
                pagesHtml.push(`<img src="../pdf_pages/${localPageFilename}" alt="Page ${i}" draggable="false">`);
            }

            const htmlContent = `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${sanitize(filename)}</title><style>body { margin: 0; padding: 0; background-color: #121212; overflow: hidden; height: 100vh; width: 100vw; display: flex; flex-direction: column; font-family: sans-serif; user-select: none; cursor: default; } #viewer-container { flex: 1; position: relative; width: 100%; height: 100%; overflow: hidden; } .page { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: none; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.2s ease-in-out; } .page.active { display: flex; opacity: 1; } .page img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 4px 10px rgba(0,0,0,0.5); } .controls { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; pointer-events: none; z-index: 10; backdrop-filter: blur(4px); transition: opacity 0.5s ease; opacity: 1; } .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.4); color: white; border: none; font-size: 24px; padding: 15px 10px; cursor: pointer; transition: background 0.2s, opacity 0.5s ease; z-index: 5; border-radius: 4px; display: none; opacity: 1; } .nav-btn:hover { background: rgba(0,0,0,0.8); } .nav-prev { left: 10px; } .nav-next { right: 10px; } .ui-hidden { opacity: 0 !important; pointer-events: none !important; } @media (hover: hover) { .nav-btn { display: block; } }</style></head><body><div id="viewer-container">${pagesHtml.map((img, idx) => `<div class="page${idx===0?' active':''}" data-index="${idx}">${img}</div>`).join('')}</div><div class="controls"><span id="page-num">1</span> / ${pdf.numPages}</div><button class="nav-btn nav-prev" onclick="prev()">&#10094;</button><button class="nav-btn nav-next" onclick="next()">&#10095;</button><script>let idx = 0; const total = ${pdf.numPages}; const pages = document.querySelectorAll('.page'); const indicator = document.getElementById('page-num'); let isThrottled = false; function show(i) { if(i < 0 || i >= total) return; pages[idx].classList.remove('active'); idx = i; pages[idx].classList.add('active'); indicator.textContent = idx + 1; } function next() { show(idx + 1); } function prev() { show(idx - 1); } document.addEventListener('keydown', e => { if(e.key === 'ArrowRight') next(); if(e.key === 'ArrowLeft') prev(); }); window.addEventListener('wheel', e => { if(isThrottled) return; isThrottled = true; setTimeout(() => isThrottled = false, 300); if(e.deltaY > 0) next(); else prev(); }, {passive: false}); let startX = 0; document.addEventListener('touchstart', e => startX = e.touches[0].clientX); document.addEventListener('touchend', e => { const diff = startX - e.changedTouches[0].clientX; if(Math.abs(diff) > 50) { if(diff > 0) next(); else prev(); } }); let hideTimer; const uiElements = document.querySelectorAll('.controls, .nav-btn'); function showUI() { uiElements.forEach(el => el.classList.remove('ui-hidden')); document.body.style.cursor = 'default'; } function hideUI() { uiElements.forEach(el => el.classList.add('ui-hidden')); document.body.style.cursor = 'none'; } function resetTimer() { showUI(); clearTimeout(hideTimer); hideTimer = setTimeout(hideUI, 2000); } ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(evt => window.addEventListener(evt, resetTimer, {passive: true})); resetTimer();</script></body></html>`;
            const htmlBuffer = new TextEncoder().encode(htmlContent);
            currentTotalSize += htmlBuffer.byteLength;
            if (currentTotalSize > originalSize) return false;

            for (const asset of tempAssets) await DB.put(db, 'assets', asset);
            await DB.put(db, 'assets', { url: originalUrl, buffer: htmlBuffer, mime: "text/html_pdf_view" });
            return true;
        } catch (e) { console.error("PDF Conversion failed", e); return false; }
    }

    async function fetchAssetAndStore(db, url, quality) {
        let retries = 0;
        while(retries <= CONFIG.RETRY_LIMIT) {
            try {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET", url: url, responseType: "blob",
                        headers: { "Referer": "https://discord.com/" },
                        onload: resolve, onerror: reject
                    });
                });
                if (res.status === 200) {
                    let blob = res.response;
                    if ((blob.size || 0) > CONFIG.MAX_FILE_SIZE) return false;
                    const type = blob.type;
                    if (CONFIG.COMPRESS_PDF && type === 'application/pdf') {
                        const converted = await processPdfAndStore(db, blob, url, quality);
                        if (converted) return true;
                    }
                    const processedBlob = await processImageBlob(blob, quality);
                    const buffer = await blobToArrayBuffer(processedBlob);
                    try { await DB.put(db, 'assets', { url: url, buffer: buffer, mime: processedBlob.type }); return true; } catch(e) { return false; }
                } else { if (res.status === 404) return false; throw "Status " + res.status; }
            } catch(e) {
                if(retries >= CONFIG.RETRY_LIMIT) return false;
                await new Promise(r => setTimeout(r, 1000 * (retries + 1)));
                retries++;
            }
        }
        return false;
    }

    async function downloadAssetsToDB(db, urlSet, updateStatus, quality) {
        if (CONFIG.COMPRESS_PDF) await initPdfWorker();
        const urlList = Array.from(urlSet);
        await runParallelQueue(
            urlList, CONFIG.CONCURRENCY.ASSET_DOWNLOAD,
            async (url) => { await fetchAssetAndStore(db, url, quality); },
            (completed, total) => { updateStatus(completed, total); }
        );
    }

    // ==========================================
    // 9. フェッチロジック
    // ==========================================

    async function fetchUserInfo(userId, guildId) { try{const m=await apiCall(`${API_BASE}/guilds/${guildId}/members/${userId}`);if(m.user)return{...m.user,member:{nick:m.nick,roles:m.roles}}}catch(e){try{return await apiCall(`${API_BASE}/users/${userId}`)}catch(e2){}}return null}

    async function fetchChannelInfo(channelId) {
        if (CHANNEL_DB[channelId]) return;
        if (channelFetchPromises[channelId]) return channelFetchPromises[channelId];
        channelFetchPromises[channelId] = (async () => {
            try {
                const c = await apiCall(`${API_BASE}/channels/${channelId}`);
                let p = null;
                if (c.parent_id) { try { p = await apiCall(`${API_BASE}/channels/${c.parent_id}`); } catch (e) {} }
                CHANNEL_DB[channelId] = { name: c.name, type: c.type, parentId: c.parent_id, parentName: p ? p.name : null };
            } catch (e) { CHANNEL_DB[channelId] = { name: `Unknown Channel`, type: 0 }; }
            finally { delete channelFetchPromises[channelId]; }
        })();
        return channelFetchPromises[channelId];
    }

    async function getGuildRoles(guildId) { try{const r=await apiCall(`${API_BASE}/guilds/${guildId}/roles`);r.forEach(cacheRole)}catch(e){} }

    async function resolveUnknownUsers(userIds, guildId, statusCb) {
        const targets = Array.from(userIds).filter(id => !USER_DB[id]);
        if (targets.length === 0) return;
        await runParallelQueue(
            targets, CONFIG.CONCURRENCY.USER_RESOLVE,
            async (uid) => {
                const user = await fetchUserInfo(uid, guildId);
                if (user) cacheUser(user, user.member); else cacheUser({ id: uid, username: "Unknown", discriminator: "0000" });
            },
            (c, t) => statusCb(c, t)
        );
    }

    async function resolveLinks(channelIds, statusCb) {
        if (channelIds.length === 0) return;
        await runParallelQueue(
            channelIds, CONFIG.CONCURRENCY.LINK_RESOLVE,
            async (chId) => { if (chId) await fetchChannelInfo(chId); },
            (c, t) => statusCb(c, t)
        );
    }

    async function fetchContextMessages(chId, msgId) {
        try {
            const url = `${API_BASE}/channels/${chId}/messages?around=${msgId}&limit=10`;
            const msgs = await apiCall(url);
            if (!msgs || !Array.isArray(msgs) || msgs.length === 0) return [];
            return msgs;
        } catch (e) { console.warn(`Context fetch failed for ${chId}/${msgId}`, e); return []; }
    }

    async function fetchThreadsViaSearch(chId, archived, progressCb) {
        let threads = []; let offset = 0; let hasMore = true; const limit = 25;
        while (hasMore) {
            const url = `${API_BASE}/channels/${chId}/threads/search?archived=${archived}&sort_by=last_message_time&sort_order=desc&limit=${limit}&offset=${offset}`;
            try {
                const res = await apiCall(url);
                const batch = res.threads || [];
                if (batch.length > 0) {
                    threads.push(...batch); offset += batch.length;
                    hasMore = res.has_more !== undefined ? res.has_more : (batch.length === limit);
                    if (progressCb) progressCb(threads.length);
                    await randomWait();
                } else { hasMore = false; }
            } catch (e) { hasMore = false; }
        }
        return threads;
    }

    async function fetchAllMessages(chId, progressCb) {
        let before = null, all = [];
        while(true) {
            try {
                let url = `${API_BASE}/channels/${chId}/messages?limit=100` + (before ? `&before=${before}` : "");
                const d = await apiCall(url);
                if(!Array.isArray(d) || d.length===0) break;
                all.push(...d);
                before = d[d.length-1].id;
                if(progressCb) progressCb(all.length);
                await randomWait();
            } catch(e) { if (e.status === 403 || e.status === 404) return null; break; }
        }
        return all.reverse();
    }

    async function extractThreadsFromMessages(chId, messages) {
        const found = [];
        messages.forEach(m => { if (m.thread) found.push(m.thread); });
        return found;
    }

    async function getSelectedChannelsAndThreads(guildId, selectedChannelIds, progressCb, messageCacheMap) {
        progressCb("Channel List...");
        const allChannels = await apiCall(`${API_BASE}/guilds/${guildId}/channels`);
        const targetChannels = allChannels.filter(c => selectedChannelIds.has(c.id) && [0, 2, 5, 13, 15, 16].includes(c.type));
        const threadMap = new Map();

        try {
            const activeRes = await apiCall(`${API_BASE}/guilds/${guildId}/active_threads`);
            if(activeRes.threads && Array.isArray(activeRes.threads)) {
                activeRes.threads.forEach(t => { if(selectedChannelIds.has(t.parent_id)) threadMap.set(t.id, t); });
            }
            await randomWait();
        } catch(e) { console.warn("Active threads fetch failed", e); }

        const fetchStandardArchived = async (chId, endpointSuffix) => {
            let hasMore = true; let before = null; let retryCount = 0;
            while(hasMore) {
                let url = `${API_BASE}/channels/${chId}/${endpointSuffix}?limit=100` + (before ? `&before=${new Date(before).toISOString()}` : "");
                try {
                    const res = await apiCall(url);
                    const batch = res.threads || [];
                    if(batch.length > 0) {
                        batch.forEach(t => threadMap.set(t.id, t));
                        before = batch[batch.length - 1].thread_metadata.archive_timestamp;
                        hasMore = res.has_more; retryCount = 0; await randomWait();
                    } else { hasMore = false; }
                } catch(e) {
                    if (e.status === 403 || e.status === 404) return;
                    if(retryCount < 2) { retryCount++; await new Promise(r => setTimeout(r, 1000)); } else { hasMore = false; }
                }
            }
        };

        progressCb("Scanning threads (Deep Mode)...");
        const parentsToScan = targetChannels.filter(c => [0, 5, 15, 16].includes(c.type));

        await runParallelQueue(
            parentsToScan, CONFIG.CONCURRENCY.CHANNEL_SCAN,
            async (ch) => {
                if(!CHANNEL_DB[ch.id]) CHANNEL_DB[ch.id] = { name: ch.name };
                await fetchStandardArchived(ch.id, "threads/archived/public");
                await fetchStandardArchived(ch.id, "threads/archived/private");
                await fetchStandardArchived(ch.id, "users/@me/threads/archived/private");

                const s1 = await fetchThreadsViaSearch(ch.id, true); s1.forEach(t=>threadMap.set(t.id, t));
                const s2 = await fetchThreadsViaSearch(ch.id, false); s2.forEach(t=>threadMap.set(t.id, t));

                progressCb(`Deep Scan: #${ch.name}`);
                const msgs = await fetchAllMessages(ch.id);
                if (msgs) {
                    messageCacheMap.set(ch.id, msgs);
                    const extracted = await extractThreadsFromMessages(ch.id, msgs);
                    extracted.forEach(t => { if (!threadMap.has(t.id)) threadMap.set(t.id, t); });
                }
            },
            (c, t, active) => { progressCb(`Scanning Channels: ${c}/${t} (${active} active)`); }
        );

        const finalCh = [];
        const addedThreadIds = new Set();
        const channelMap = new Map(allChannels.map(c => [c.id, c]));

        for (const ch of targetChannels) {
            let pName = null;
            if (ch.parent_id && channelMap.has(ch.parent_id)) { pName = channelMap.get(ch.parent_id).name; }
            finalCh.push({ ...ch, isThread: false, parentName: pName, isSelected: true });
            const childThreads = Array.from(threadMap.values()).filter(t => t.parent_id === ch.id).sort((a,b) => new Date(a.thread_metadata?.archive_timestamp||0) - new Date(b.thread_metadata?.archive_timestamp||0));
            childThreads.forEach(t => {
                if(!addedThreadIds.has(t.id)) {
                    finalCh.push({...t, isThread: true, parentName: ch.name, grandParentName: pName, isSelected: true });
                    addedThreadIds.add(t.id);
                }
            });
        }
        return finalCh;
    }

    async function processReactionsInParallel(chId, msgs, statusCb) {
        const tasks = [];
        for (const m of msgs) {
            if (!m.reactions) continue;
            for (const r of m.reactions) tasks.push({ m, r });
        }
        if (tasks.length === 0) return;
        await runParallelQueue(
            tasks, CONFIG.CONCURRENCY.REACTION_FETCH,
            async (task) => {
                const emojiId = task.r.emoji.id ? `${task.r.emoji.name}:${task.r.emoji.id}` : encodeURIComponent(task.r.emoji.name);
                try {
                    const users = await apiCall(`${API_BASE}/channels/${chId}/messages/${task.m.id}/reactions/${emojiId}?limit=100`);
                    task.r.userNames = users.map(u => u.global_name || u.username);
                } catch(e) { task.r.userNames = []; }
            },
            (c, t) => statusCb(c, t)
        );
    }

    // ==========================================
    // 10. HTML生成 & パス解決
    // ==========================================

    const EXT_MAP = {
        'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
        'image/svg+xml': 'svg', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
        'audio/mpeg': 'mp3', 'audio/ogg': 'ogg', 'audio/wav': 'wav', 'application/pdf': 'pdf',
        'text/plain': 'txt', 'application/json': 'json', 'text/html': 'html'
    };

    function getLocalAssetPath(url, mimeType) {
        if (!url) return "";
        let folder = "misc";
        if (mimeType === "image/webp_pdf_page") folder = "pdf_pages";
        else {
            if (url.includes("/avatars/")) folder = "avatars";
            else if (url.includes("/emojis/")) folder = "emojis";
            else if (url.includes("/attachments/")) folder = "attachments";
            else if (url.includes("/stickers/")) folder = "stickers";
            else if (url.includes("/icons/")) folder = "icons";
            else if (url.includes("/role-icons/")) folder = "role-icons";
        }
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const rawFilename = path.split('/').pop() || "file";
        let filename = rawFilename;
        try { filename = decodeURIComponent(rawFilename); } catch(e) {}
        let namePart = filename; let urlExt = "";
        const dotIndex = filename.lastIndexOf('.');
        if (dotIndex !== -1 && dotIndex < filename.length - 1) {
            namePart = filename.substring(0, dotIndex);
            urlExt = filename.substring(dotIndex + 1).toLowerCase();
            if (!/^[a-z0-9]+$/.test(urlExt)) urlExt = "";
        }
        if (namePart.length > 50) namePart = namePart.substring(0, 50);
        let hash = 0; for (let i = 0; i < url.length; i++) hash = (hash << 5) - hash + url.charCodeAt(i) | 0;
        const shortHash = (hash >>> 0).toString(16);
        let ext = null;
        if (mimeType === 'image/webp_pdf_page') ext = 'webp';
        else if (mimeType === 'text/html_pdf_view') ext = 'html';
        else if (mimeType === 'image/webp') ext = 'webp';
        else if (mimeType && EXT_MAP[mimeType]) ext = EXT_MAP[mimeType];
        if (!ext && urlExt) ext = urlExt;
        if (!ext) ext = "bin";
        return `assets/${folder}/${namePart}_${shortHash}.${ext}`;
    }

    function parseReplyMarkdown(text) {
        if (!text) return "";
        let out = sanitize(text);
        out = out.replace(RE_MENTION_USER, (m, id) => `<span class="mention user-link" data-uid="${id}">@user(${id})</span>`);
        out = out.replace(RE_MENTION_ROLE, (m, id) => `<span class="mention role-link" data-rid="${id}">@role(${id})</span>`);
        out = out.replace(RE_MENTION_CHANNEL, (m, id) => `<span class="mention channel-link" data-cid="${id}">#channel(${id})</span>`);
        out = out.replace(RE_CUSTOM_EMOJI_HTML, (m, a, n, i) => { const ext = a ? 'gif' : 'png'; return `<img class="emoji lazy-load" data-original-url="https://cdn.discordapp.com/emojis/${i}.${ext}" alt=":${n}:" title=":${n}:">`; });
        out = out.replace(/\n/g, ' ');
        return out;
    }

    function parseMarkdown(text) {
        if (!text) return "";
        let out = sanitize(text);
        const placeholders = [];
        const addPlaceholder = (content) => { placeholders.push(content); return `%%%PH_${placeholders.length - 1}%%%`; };

        const escapes = [];
        out = out.replace(/\\(.)/g, (m, char) => { escapes.push(char); return `%%%ESC_${escapes.length - 1}%%%`; });

        out = out.replace(RE_CODE_BLOCK, (_, lang, content) => addPlaceholder(`<pre><code class="${lang || ''}">${content}</code></pre>`));
        out = out.replace(RE_INLINE_CODE, (_, content) => addPlaceholder(`<code>${content}</code>`));

        const lines = out.split('\n');
        const processedLines = [];
        let quoteBuffer = [];
        let inMultiQuote = false;

        const processLineStyle = (line) => {
            const hMatch = line.match(RE_HEADING); if (hMatch) return `<h${hMatch[1].length}>${hMatch[2]}</h${hMatch[1].length}>`;
            const stMatch = line.match(RE_SUBTEXT); if (stMatch) return `<div class="subtext">${stMatch[1]}</div>`;
            const ulMatch = line.match(RE_UNORDERED_LIST); if (ulMatch) return `<div class="list-item" style="margin-left:${(ulMatch[1].length * 0.5)}em"><span class="list-marker">•</span> ${ulMatch[3]}</div>`;
            const olMatch = line.match(RE_ORDERED_LIST); if (olMatch) return `<div class="list-item" style="margin-left:${(olMatch[1].length * 0.5)}em"><span class="list-marker">${olMatch[2]}</span> ${olMatch[3]}</div>`;
            return line;
        };

        const flushQuote = () => {
            if (quoteBuffer.length > 0) {
                const quotedContent = quoteBuffer.map(processLineStyle).join('<br>');
                processedLines.push(`<blockquote>${quotedContent}</blockquote>`);
                quoteBuffer = [];
            }
        };

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (inMultiQuote) { quoteBuffer.push(line); }
            else if (RE_BLOCKQUOTE_MULTILINE.test(line)) {
                flushQuote(); inMultiQuote = true; quoteBuffer.push(line.replace(RE_BLOCKQUOTE_MULTILINE, ''));
            } else if (RE_BLOCKQUOTE_START.test(line)) {
                quoteBuffer.push(line.replace(RE_BLOCKQUOTE_START, ''));
            } else {
                flushQuote(); processedLines.push(processLineStyle(line));
            }
        }
        flushQuote();
        out = processedLines.join('<br>');

        out = out.replace(RE_LINK_MARKDOWN, (m, txt, url) => addPlaceholder(`<a href="${url}" target="_blank">${txt}</a>`));
        out = out.replace(RE_LINK_MARKDOWN_2, (m, txt, url) => addPlaceholder(`<a href="${url}" target="_blank">${txt}</a>`));
        out = out.replace(RE_LINK_PLAIN, (m, url) => addPlaceholder(`<a href="${url}" target="_blank">${url}</a>`));
        out = out.replace(RE_DISCORD_LINK, (match, guildId, chId, msgId) => { return addPlaceholder(`<span class="mention discord-link" data-url="${match}" data-guild="${guildId}" data-cid="${chId}" data-mid="${msgId || ''}">${match}</span>`); });
        out = out.replace(RE_URL_AUTO, (match) => { let url = match; while (/[.,?!:;)]$/.test(url)) url = url.slice(0, -1); const remainder = match.slice(url.length); return addPlaceholder(`<a href="${url}" target="_blank">${url}</a>${remainder}`); });

        out = out.replace(RE_BOLD_ITALIC, '<b><i>$1</i></b>');
        out = out.replace(RE_BOLD, '<b>$1</b>');
        out = out.replace(RE_UNDERLINE, '<u>$1</u>');
        out = out.replace(RE_ITALIC_ASTERISK, '<i>$1</i>');
        out = out.replace(RE_ITALIC_UNDERSCORE, (match, p1) => `<i>${p1}</i>`);
        out = out.replace(RE_STRIKETHROUGH, '<s>$1</s>');
        out = out.replace(RE_SPOILER, '<span class="spoiler" onclick="this.classList.toggle(\'visible\')">$1</span>');
        out = out.replace(RE_TIMESTAMP, (m, t, s) => `<span class="timestamp" data-ts="${parseInt(t) * 1000}" data-fmt="${s || 'f'}"></span>`);
        out = out.replace(RE_SLASH_COMMAND, (m, name, id) => `<span class="mention command">/${name}</span>`);
        out = out.replace(RE_CUSTOM_EMOJI_HTML, (m, a, n, i) => `<img class="emoji lazy-load" data-original-url="https://cdn.discordapp.com/emojis/${i}.${a?'gif':'png'}" alt=":${n}:" title=":${n}:">`);
        out = out.replace(RE_MENTION_ROLE, (m, i) => `<span class="mention role-link" data-rid="${i}">@role(${i})</span>`);
        out = out.replace(RE_MENTION_USER, (m, i) => `<span class="mention user-link" data-uid="${i}">@user(${i})</span>`);
        out = out.replace(RE_MENTION_EVERYONE, '<span class="mention highlight">@$1</span>');
        out = out.replace(RE_MENTION_CHANNEL, (m, i) => `<span class="mention channel-link" data-cid="${i}">#${i}</span>`);

        placeholders.forEach((val, idx) => { out = out.split(`%%%PH_${idx}%%%`).join(val); });
        escapes.forEach((val, idx) => { out = out.split(`%%%ESC_${idx}%%%`).join(val); });
        return out;
    }

    const RenderHelpers = {
        embeds: (embeds) => {
            if (!embeds || embeds.length === 0) return "";
            return embeds.map(e => {
                let content = "";
                if(e.author) content += `<div class="embed-author">${e.author.icon_url?`<img data-original-url="${e.author.icon_url}" class="embed-author-icon lazy-load">`:""}<span>${sanitize(e.author.name)}</span></div>`;
                if(e.title) content += `<div class="embed-title">${e.url?`<a href="${e.url}" target="_blank">${sanitize(e.title)}</a>`:sanitize(e.title)}</div>`;
                if(e.description) content += `<div class="embed-desc">${parseMarkdown(e.description)}</div>`;
                if(e.fields) content += `<div class="embed-fields">${e.fields.map(f=>`<div class="embed-field ${f.inline?'inline':''}"><div class="embed-field-name">${sanitize(f.name)}</div><div class="embed-field-value">${parseMarkdown(f.value)}</div></div>`).join("")}</div>`;
                if(e.image&&e.image.url) content += `<div class="embed-image"><img data-original-url="${e.image.url}" class="lazy-load toggle-lightbox"></div>`;
                const tsHtml = e.timestamp ? ` • <span class="dynamic-time" data-ts="${new Date(e.timestamp).getTime()}" data-fmt="f"></span>` : "";
                if(e.footer||e.timestamp) content += `<div class="embed-footer">${e.footer&&e.footer.icon_url?`<img data-original-url="${e.footer.icon_url}" class="embed-footer-icon lazy-load">`:""}<span>${e.footer?sanitize(e.footer.text):""}${tsHtml}</span></div>`;
                let thumb = (e.thumbnail&&e.thumbnail.url) ? `<div class="embed-thumbnail"><img data-original-url="${e.thumbnail.url}" class="lazy-load toggle-lightbox"></div>` : "";
                return `<div class="embed" style="border-left-color: ${decToHexColor(e.color)}"><div class="embed-content">${content}</div>${thumb}</div>`;
            }).join("");
        },
        attachments: (attachments) => {
            if (!attachments || attachments.length === 0) return "";
            return attachments.map(a => {
                const isImg = a.content_type && a.content_type.startsWith("image/");
                const isVideo = a.content_type && a.content_type.startsWith("video/");
                const isAudio = a.content_type && a.content_type.startsWith("audio/");
                const isVoice = (a.flags & 8192) === 8192;
                const isSpoiler = a.filename.startsWith("SPOILER_");
                const spoilerClass = isSpoiler ? "spoiler-img" : "";
                const spoilerClick = isSpoiler ? `onclick="this.classList.toggle('revealed')"` : "";
                const sizeStr = a.size ? ` (${Math.round(a.size/1024)}KB)` : "";

                if (isImg) return `<div class="attachment"><img data-original-url="${a.url}" class="lazy-load toggle-lightbox ${spoilerClass}" ${spoilerClick} alt="${sanitize(a.filename)}" title="${sanitize(a.description || a.filename)}"></div>`;
                if (isVideo) return `<div class="attachment"><video controls data-original-url="${a.url}" class="lazy-load" style="max-width:100%"></video></div>`;
                if (isVoice) return `<div class="attachment voice-message"><div class="voice-icon">${ICONS.VOICE}</div><audio controls data-original-url="${a.url}" class="lazy-load"></audio><span class="voice-meta">Voice Message</span></div>`;
                if (isAudio) return `<div class="attachment"><audio controls data-original-url="${a.url}" class="lazy-load"></audio></div>`;
                return `<div class="attachment-file"><div class="file-icon">${ICONS.FILE}</div><div class="file-info"><a class="file-download" data-original-url="${a.url}" data-name="${sanitize(a.filename)}" onclick="return false;">${sanitize(a.filename)}</a><span class="file-size">${sizeStr}</span></div><a class="file-dl-icon" data-original-url="${a.url}" data-name="${sanitize(a.filename)}">📥</a></div>`;
            }).join("");
        },
        poll: (poll) => {
            if (!poll) return "";
            let html = `<div class="poll-container"><div class="poll-question">${sanitize(poll.question.text)}</div>`;
            if (poll.answers) {
                const totalVotes = (poll.results && poll.results.answer_counts) ?
                    poll.results.answer_counts.reduce((a,b) => a + b.count, 0) : 0;

                html += `<div class="poll-answers">`;
                poll.answers.forEach(a => {
                    const emoji = a.poll_media.emoji ? (a.poll_media.emoji.id ? `<img class="poll-emoji lazy-load" data-original-url="https://cdn.discordapp.com/emojis/${a.poll_media.emoji.id}.png">` : `<span class="poll-emoji-text">${sanitize(a.poll_media.emoji.name)}</span>`) : "";
                    let percentage = 0;
                    if (poll.results && poll.results.answer_counts) {
                        const countObj = poll.results.answer_counts.find(c => c.id === a.answer_id);
                        if (countObj) percentage = (totalVotes > 0) ? (countObj.count / totalVotes) * 100 : 0;
                    }
                    html += `<div class="poll-answer"><div class="poll-bar" style="width:${percentage}%"></div><div class="poll-answer-content">${emoji}<span class="poll-text">${sanitize(a.poll_media.text || "")}</span></div></div>`;
                });
                html += `</div>`;
            }
            html += `<div class="poll-footer">${ICONS.POLL} Poll</div></div>`;
            return html;
        },
        components: (components) => {
            if (!components || components.length === 0) return "";
            const getButtonStyle = (style) => { switch(style) { case 1: return "blurple"; case 2: return "grey"; case 3: return "green"; case 4: return "red"; case 5: return "link"; default: return "grey"; } };
            const renderEmoji = (emoji) => {
                if(!emoji) return "";
                if(emoji.id) return `<img class="component-emoji lazy-load" data-original-url="https://cdn.discordapp.com/emojis/${emoji.id}.png" alt="${sanitize(emoji.name)}">`;
                return `<span class="component-emoji-text">${sanitize(emoji.name)}</span>`;
            };
            let html = '<div class="components-container">';
            components.forEach(row => {
                if(row.type === 1) { // Action Row
                    html += '<div class="component-row">';
                    row.components.forEach(c => {
                        if(c.type === 2) { // Button
                            const styleClass = getButtonStyle(c.style);
                            const disabledClass = c.disabled ? "disabled" : "";
                            const label = c.label ? sanitize(c.label) : "";
                            const emojiHtml = renderEmoji(c.emoji);
                            const urlAttr = (c.style === 5 && c.url) ? ` href="${c.url}" target="_blank"` : "";
                            const tag = (c.style === 5) ? "a" : "div";
                            html += `<${tag} class="component-btn ${styleClass} ${disabledClass}"${urlAttr}>${emojiHtml}${label}</${tag}>`;
                        } else if([3, 5, 6, 7, 8].includes(c.type)) { // Select Menus
                            const disabledClass = c.disabled ? "disabled" : "";
                            let typeLabel = "Select";
                            let icon = "";
                            let typeClass = "string-select";
                            if(c.type === 3) { typeLabel = "Select String"; typeClass = "string-select"; }
                            if(c.type === 5) { typeLabel = "Select User"; icon = "@"; typeClass = "user-select"; }
                            if(c.type === 6) { typeLabel = "Select Role"; icon = "&"; typeClass = "role-select"; }
                            if(c.type === 7) { typeLabel = "Select Mentionable"; icon = "@"; typeClass = "mentionable-select"; }
                            if(c.type === 8) { typeLabel = "Select Channel"; icon = "#"; typeClass = "channel-select"; }
                            html += `<div class="component-select ${disabledClass} ${typeClass} type-${c.type}"><span class="select-icon">${icon}</span><span>${sanitize(c.placeholder || typeLabel)}</span><span class="select-arrow">▼</span></div>`;
                        }
                    });
                    html += '</div>';
                }
            });
            html += '</div>';
            return html;
        },
        snapshots: (snapshots, parentMsg) => {
             if (!snapshots || snapshots.length === 0) return "";
             return snapshots.map(s => {
                 const msg = s.message;
                 if (!msg) return "";

                 const dateObj = new Date(msg.timestamp);
                 const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });

                 const att = RenderHelpers.attachments(msg.attachments);
                 const embeds = RenderHelpers.embeds(msg.embeds);
                 const components = RenderHelpers.components(msg.components);
                 const pollHtml = RenderHelpers.poll(msg.poll);
                 let stickersHtml = "";
                 if (msg.sticker_items) stickersHtml = msg.sticker_items.map(st => `<div class="sticker"><img data-original-url="https://media.discordapp.net/stickers/${st.id}.png" class="lazy-load" title="${sanitize(st.name)}"></div>`).join("");
                 const contentMd = parseMarkdown(msg.content);

                 let chId = msg.channel_id;
                 let mid = msg.id;
                 let guildId = s.guild_id;

                 if (parentMsg.message_reference) {
                     if (!chId) chId = parentMsg.message_reference.channel_id;
                     if (!mid) mid = parentMsg.message_reference.message_id;
                     if (!guildId) guildId = parentMsg.message_reference.guild_id;
                 }

                 let channelName = "Unknown Channel";
                 if (chId && CHANNEL_DB[chId]) {
                    channelName = CHANNEL_DB[chId].name;
                 } else if (chId) {
                    channelName = "#" + chId;
                 }

                 const footerAttrs = `class="forward-footer" data-cid="${chId||''}" data-mid="${mid||''}" data-gid="${guildId||''}"`;

                 return `
                 <div class="forward-wrapper">
                    <div class="forward-spine"></div>
                    <div class="forward-main">
                        <div class="forward-label">${ICONS.FORWARD} 転送済み</div>
                        <div class="forward-body">${contentMd}</div>
                        ${stickersHtml}${att}${pollHtml}${embeds}${components}
                        <div ${footerAttrs} onclick="handleForwardClick(this, event)">
                            <span class="forward-channel-icon">${ICONS.TEXT}</span>
                            <span class="forward-origin-name">${sanitize(channelName)}</span>
                            <span class="forward-separator">•</span>
                            <span class="forward-timestamp">${dateStr}</span>
                            <span class="forward-arrow"> › </span>
                        </div>
                    </div>
                 </div>`;
             }).join("");
        }
    };

    function generateChannelHTML(ch, messages, index) {
        const renderMessageContent = (m) => {
            const att = RenderHelpers.attachments(m.attachments);
            const embeds = RenderHelpers.embeds(m.embeds);
            const components = RenderHelpers.components(m.components);
            const pollHtml = RenderHelpers.poll(m.poll);
            const snapshotsHtml = RenderHelpers.snapshots(m.message_snapshots, m);
            let stickersHtml = "";
            if (m.sticker_items) stickersHtml = m.sticker_items.map(s => `<div class="sticker"><img data-original-url="https://media.discordapp.net/stickers/${s.id}.png" class="lazy-load" title="${sanitize(s.name)}"></div>`).join("");

            let jumboClass = "";
            const textContent = m.content || "";
            const stripped = textContent.replace(/<a?:\w+:\d+>/g, "").replace(/\s/g, "");
            if (textContent.length > 0 && stripped.length === 0) jumboClass = "jumboable";
            const contentMd = parseMarkdown(m.content);

            return `<div class="body ${jumboClass}">${contentMd}</div>${stickersHtml}${att}${pollHtml}${embeds}${components}${snapshotsHtml}`;
        };

        let lastDateStr = "";
        let lastAuthorId = null;
        let lastTimestamp = 0;
        const msgHtmlParts = [];

        for (const m of messages) {
            const dateObj = new Date(m.timestamp);
            const dateStr = DATE_FORMATTER.format(dateObj);
            const timeStr = TIME_FORMATTER.format(dateObj);
            const isoTime = dateObj.toISOString();
            const timestampVal = dateObj.getTime();

            let dividerHtml = "";
            let isDateChanged = false;
            if (dateStr !== lastDateStr) {
                dividerHtml = `<div class="date-divider" data-ts="${timestampVal}"><span>${dateStr}</span></div>`;
                lastDateStr = dateStr;
                isDateChanged = true;
            }

            const isSystem = (m.type !== 0 && m.type !== 19 && !m.content && m.embeds.length === 0 && m.attachments.length === 0 && (!m.components || m.components.length === 0) && (!m.message_snapshots || m.message_snapshots.length === 0) && !m.poll);

            if (isSystem) {
                lastAuthorId = null;
                let sysIcon = ICONS.ARROW_RIGHT;
                let sysText = "";
                switch(m.type) {
                    case 6: sysText = "pinned a message."; sysIcon = ICONS.PIN; break;
                    case 7: sysText = "joined the server."; break;
                    case 8: sysText = "boosted the server!"; sysIcon = ICONS.BOOST; break;
                    case 9: sysText = "boosted the server level 2!"; sysIcon = ICONS.BOOST; break;
                    case 10: sysText = "boosted the server level 3!"; sysIcon = ICONS.BOOST; break;
                    case 12: sysText = "added a remote clan user."; break;
                    case 18: sysText = "renamed the channel."; sysIcon = ICONS.PENCIL; break;
                    case 21: sysText = "started a thread."; sysIcon = ICONS.THREAD_START; break;
                    case 22: sysText = "application command used."; break;
                    case 23: sysText = "invited a user."; break;
                    case 24: sysText = "Auto Moderation action."; break;
                    case 25: sysText = "purchased a role subscription."; break;
                    case 26: sysText = "tier 1 role subscription."; break;
                    case 27: sysText = "tier 2 role subscription."; break;
                    case 28: sysText = "tier 3 role subscription."; break;
                    case 29: sysText = "Stage channel speaker."; break;
                    case 30: sysText = "Stage channel topic."; break;
                    case 31: sysText = "voice channel status changed."; break;
                    case 32: sysText = "Guild Incident Alert Mode enabled."; break;
                    default: sysText = `System Message (Type: ${m.type})`;
                }
                const authorName = m.author ? (m.author.global_name || m.author.username) : "Unknown";
                msgHtmlParts.push(`${dividerHtml}<div class="msg-container msg-system" id="msg-${m.id}"><div class="msg-wrapper"><div class="msg-side"><div class="sys-icon-wrapper">${sysIcon}</div></div><div class="msg-content"><span class="author user-hover" data-uid="${m.author.id}">${authorName}</span> <span class="system-text">${sysText}</span> <span class="time" title="${isoTime}" data-ts="${timestampVal}" data-fmt="t">${timeStr}</span></div></div></div>`);
                continue;
            }

            const isConsecutive = !isDateChanged && lastAuthorId === m.author.id && (timestampVal - lastTimestamp < 8 * 60 * 1000) && !m.referenced_message;
            lastAuthorId = m.author.id;
            lastTimestamp = timestampVal;

            let reactionHtml = "";
            if (m.reactions && m.reactions.length > 0) {
                const items = m.reactions.map(r => {
                    const content = r.emojiUrl ? `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==" data-original-url="${r.emojiUrl}" class="lazy-load" alt="${sanitize(r.emoji.name)}">` : `<span class="emoji-text">${sanitize(r.emoji.name)}</span>`;
                    const userListJson = r.userNames ? JSON.stringify(r.userNames).replace(/"/g, '&quot;') : "[]";
                    const burstClass = (r.burst_colors && r.burst_colors.length > 0) ? "reaction-burst" : "";
                    return `<div class="reaction ${burstClass}" data-users="${userListJson}">${content}<span class="count">${r.count}</span></div>`;
                }).join("");
                reactionHtml = `<div class="reactions">${items}</div>`;
            }

            let replyHtml = "";
            if (m.referenced_message) {
                const rm = m.referenced_message;
                const rUser = rm.author ? (rm.author.global_name || rm.author.username) : "Unknown";
                let rContentText = rm.content ? parseReplyMarkdown(rm.content) : "";
                if (!rContentText && rm.embeds.length > 0) rContentText = "[Embed]";
                else if (!rContentText && rm.attachments.length > 0) rContentText = "[File]";
                else if (!rContentText && rm.poll) rContentText = "[Poll]";
                const replyCid = rm.channel_id || m.channel_id;
                replyHtml = `<div class="reply-context"><div class="reply-spine"></div><img class="reply-avatar lazy-load" data-uid="${rm.author ? rm.author.id : ''}"><span class="reply-username user-link" data-uid="${rm.author ? rm.author.id : ''}">@${rUser}</span><span class="reply-text message-link" data-cid="${replyCid}" data-mid="${rm.id}">${rContentText}</span></div>`;
            }

            const editedMark = m.edited_timestamp ? `<span class="edited-mark">(edited)</span>` : "";
            const mainContent = renderMessageContent(m);

            if (isConsecutive) {
                 msgHtmlParts.push(`${dividerHtml}<div class="msg-container consecutive" id="msg-${m.id}"><div class="timestamp-gutter" data-ts="${timestampVal}" data-fmt="t">${timeStr}</div><div class="msg-wrapper"><div class="msg-side"></div><div class="msg-content">${mainContent}${reactionHtml}</div></div></div>`);
            } else {
                 const botTag = m.author.bot ? `<span class="bot-tag">BOT</span>` : "";
                 msgHtmlParts.push(`${dividerHtml}<div class="msg-container group-start" id="msg-${m.id}">${replyHtml}<div class="msg-wrapper"><div class="msg-side"><img class="avatar lazy-load" data-uid="${m.author.id}"></div><div class="msg-content"><div class="header"><span class="author user-hover" data-uid="${m.author.id}"></span>${botTag}<span class="time" title="${isoTime}" data-ts="${timestampVal}" data-fmt="header">${FULL_DATE_TIME_FORMATTER.format(new Date(m.timestamp))} ${editedMark}</span></div>${mainContent}${reactionHtml}</div></div></div>`);
            }
        }

        const menuBtn = `<div class="menu-btn" onclick="toggleSidebar()">${ICONS.HAMBURGER}</div>`;
        let headerText = `${menuBtn}${getChannelIconSVG(ch.type,false)} ${sanitize(ch.name)}`;
        if (ch.serverName) {
            headerText = `<span class="server-badge">${sanitize(ch.serverName)}</span> ` + headerText;
        } else if (ch.isThread) {
            headerText = `<span class="parent-name">Thread of #${sanitize(ch.parentName)}</span>${getChannelIconSVG(ch.type,true)} ${sanitize(ch.name)}`;
        }

        const searchBox = `<input type="text" class="search-in-channel" placeholder="Search" oninput="debounceSearch(this)">`;
        return `<div class="channel-section" id="ch-${ch.id}"><div class="channel-header"><div style="flex:1; display:flex; align-items:center;">${headerText}</div>${searchBox}</div><div class="messages">${msgHtmlParts.join('')}</div></div>`;
    }

    // ==========================================
    // 11. ZIP生成ロジック
    // ==========================================
    async function generateZipBlob(db, categoryName, channels, progressHandler) {
        const zip = new SimpleZip();
        const urlToLocal = {};
        await DB.streamStore(db, 'assets', (asset) => {
            const localPath = getLocalAssetPath(asset.url, asset.mime);
            urlToLocal[asset.url] = localPath;
            zip.addFile(localPath, asset.buffer);
        });
        await DB.streamStore(db, 'channels', (data) => {
            const jsonData = JSON.stringify(data.html);
            const jsContent = `window.loadChannel("${data.id}", ${jsonData});`;
            zip.addFile(`data/ch_${data.id}.js`, jsContent);
        });

        const css = `:root{--bg-tertiary:#1e1f22;--bg-secondary:#2b2d31;--bg-primary:#313338;--text-normal:#dbdee1;--text-muted:#949ba4;--interactive-normal:#b5bac1;--interactive-hover:#dbdee1;--interactive-active:#fff;--background-modifier-hover:rgba(79,84,92,0.16);--background-modifier-selected:rgba(79,84,92,0.32);--highlight:rgba(250,166,26,0.1);--font-primary:"gg sans","Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif}body{font-family:var(--font-primary);background:var(--bg-primary);color:var(--text-normal);margin:0;display:flex;height:100vh;overflow:hidden;line-height:1.375rem}.sidebar{width:240px;background:var(--bg-secondary);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}.sidebar-header{height:48px;padding:0 16px;display:flex;align-items:center;box-shadow:0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05);font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sidebar-content{flex:1;overflow-y:auto;padding:8px}.sidebar-item{display:flex;align-items:center;padding:6px 8px;color:var(--text-muted);border-radius:4px;font-size:16px;cursor:pointer;user-select:none;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sidebar-item:hover{background-color:var(--background-modifier-hover);color:var(--interactive-hover)}.sidebar-item.active{background-color:var(--background-modifier-selected);color:#fff}.icon-channel,.icon-thread{width:20px;height:20px;margin-right:6px;flex-shrink:0;color:#8e9297}.main{flex:1;display:flex;flex-direction:column;min-width:0;background:var(--bg-primary)}.channel-section{display:none;flex:1;flex-direction:column;height:100%}.channel-section.active{display:flex}.channel-header{height:48px;padding:0 16px;display:flex;align-items:center;box-shadow:0 1px 0 rgba(4,4,5,0.2);font-weight:700;color:#fff;font-size:16px;z-index:10;flex-shrink:0}.messages{flex:1;overflow-y:auto;padding:16px 0 30px;overflow-x:hidden}.msg-container{margin-top:1.0625rem;position:relative}.msg-container.consecutive{margin-top:0.125rem;}.msg-container:hover{background-color:rgba(4,4,5,0.07)}.msg-container.highlight{background:var(--highlight);animation:flash 1s}@keyframes flash{0%{background:#5865f2}100%{background:var(--highlight)}}.msg-wrapper{display:flex;padding:2px 16px}.msg-side{margin-top:2px;width:48px;flex-shrink:0}.msg-content{flex:1;min-width:0}.avatar{width:40px;height:40px;border-radius:50%;cursor:pointer;object-fit:cover}.avatar:hover{opacity:.8}.header{display:flex;align-items:center;margin-bottom:2px}.author{font-size:1rem;font-weight:500;color:#fff;margin-right:4px;cursor:pointer}.author:hover,.user-link:hover{text-decoration:underline}.bot-tag{background:#5865f2;color:#fff;font-size:.625rem;padding:1px 4px;border-radius:3px;margin-right:4px;vertical-align:middle;line-height:1.3;margin-top:1px}.time{font-size:.75rem;color:var(--text-muted);margin-left:.25rem;cursor:help}.edited-mark{font-size:.625rem;color:var(--text-muted);margin-left:4px}.body{font-size:1rem;line-height:1.375rem;color:var(--text-normal);white-space:pre-wrap;overflow-wrap:anywhere}.body.jumboable .emoji{width:48px;height:48px;}.attachment{margin-top:8px}.attachment img,.attachment video{max-width:400px;max-height:300px;border-radius:4px;cursor:zoom-in;display:block}.attachment-file{display:flex;align-items:center;background:var(--bg-secondary);padding:10px;border-radius:4px;border:1px solid #1e1f22;margin-top:8px;max-width:400px}.file-icon{width:30px;height:30px;margin-right:10px;color:#b9bbbe}.file-info{flex:1;overflow:hidden}.file-download{display:block;color:#00b0f4;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.file-download:hover{text-decoration:underline}.file-size{font-size:12px;color:var(--text-muted)}.file-dl-icon{color:var(--text-muted);cursor:pointer;padding:4px}.file-dl-icon:hover{color:#dcddde}.embed{display:flex;max-width:520px;margin-top:8px;border-left:4px solid #1e1f22;background:var(--bg-secondary);border-radius:4px;padding:8px 16px 16px 12px}.embed-content{flex:1;min-width:0}.embed-author{display:flex;align-items:center;font-size:.875rem;font-weight:600;color:#fff;margin:8px 0}.embed-author-icon{width:24px;height:24px;border-radius:50%;margin-right:8px}.embed-title{font-size:1rem;font-weight:600;color:#fff;margin-bottom:4px}.embed-title a{color:#00b0f4;text-decoration:none}.embed-desc{font-size:.875rem;color:#dbdee1}.embed-fields{display:flex;flex-wrap:wrap;margin-top:4px}.embed-field{min-width:100%;margin:4px 0}.embed-field.inline{min-width:auto;flex:1;margin-right:4px}.embed-field-name{font-size:.875rem;font-weight:600;color:#fff;margin-bottom:2px}.embed-field-value{font-size:.875rem;color:#dbdee1}.embed-thumbnail img{max-width:80px;max-height:80px;border-radius:4px;margin:8px 0 0 16px;object-fit:contain}.embed-image img{max-width:100%;border-radius:4px;margin-top:16px}.embed-footer{display:flex;align-items:center;margin-top:8px;font-size:.75rem;color:var(--text-muted)}.embed-footer-icon{width:20px;height:20px;border-radius:50%;margin-right:8px}a{color:#00b0f4;text-decoration:none}a:hover{text-decoration:underline}code{background:var(--bg-secondary);padding:.2em;border-radius:3px;font-family:Consolas,"Courier New",monospace;font-size:.85rem}pre{background:var(--bg-secondary);padding:10px;border-radius:4px;border:1px solid #202225;overflow-x:auto;font-family:Consolas,"Courier New",monospace;color:#b9bbbe;margin-top:6px}pre code{background:0 0;padding:0}.spoiler{background:#202225;color:transparent;border-radius:3px;cursor:pointer;padding:0 2px}.spoiler.visible{background:#454950;color:inherit}.mention{background:rgba(88,101,242,.3);color:#dee0fc;padding:0 2px;border-radius:3px;cursor:pointer}.mention:hover{background:#5865f2;color:#fff}.mention.command{color:#00b0f4;background:rgba(0,176,244,0.1);cursor:default}.mention.command::selection{color:#fff;background:#00b0f4}.reply-context{display:flex;align-items:center;font-size:.875rem;color:#b9bbbe;margin-bottom:4px;margin-left:16px;position:relative;margin-top:4px}.reply-spine{border-left:2px solid #4e5058;border-top:2px solid #4e5058;border-top-left-radius:6px;width:32px;height:12px;position:absolute;left:-34px;top:10px;margin-top:-2px}.reply-avatar{width:16px;height:16px;border-radius:50%;margin-right:4px}.reply-username{margin-right:4px;font-weight:600;color:#fff}.reply-text{margin-left:0;opacity:.8;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:600px;display:inline-block;vertical-align:bottom}.reply-text:hover{color:#fff}.reactions{display:flex;flex-wrap:wrap;margin-top:4px;gap:4px}.reaction{display:flex;align-items:center;background-color:var(--bg-secondary);border-radius:8px;padding:2px 6px;border:1px solid transparent;cursor:pointer;user-select:none;transition:background-color .1s,border-color .1s}.reaction:hover{background-color:#36393f;border-color:#72767d}.reaction.reaction-burst{border-color:rgba(255,255,255,0.2);background:linear-gradient(45deg,rgba(255,255,255,0.05),transparent)}.reaction img{width:16px;height:16px;object-fit:contain}.reaction .emoji-text{font-size:1rem;line-height:1}.reaction .count{font-size:.875rem;font-weight:600;color:var(--interactive-normal);margin-left:6px}.reaction:hover .count{color:var(--text-normal)}.sticker{margin-top:6px}.sticker img{max-width:160px;max-height:160px}.emoji{width:22px;height:22px;vertical-align:bottom;margin:0 1px}.date-divider{margin:24px 0 8px;border-top:1px solid #3f4147;display:flex;justify-content:center;align-items:center}.date-divider span{background:var(--bg-primary);padding:0 8px;color:#949ba4;font-size:12px;font-weight:600;margin-top:-1px}.search-in-channel{background:#1e1f22;border:none;color:#dbdee1;padding:4px 8px;border-radius:4px;font-size:14px;outline:none;transition:width .2s;width:144px}.search-in-channel:focus{width:240px}#channel-filter{width:90%;margin:10px auto;display:block;padding:6px;background:#1e1f22;border:none;color:#dbdee1;border-radius:4px;outline:none}#lightbox{display:none;position:fixed;z-index:3000;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.85);justify-content:center;align-items:center}#lightbox img{max-width:90vw;max-height:90vh;object-fit:contain}.user-tooltip{position:fixed;z-index:1000;background:#18191c;width:300px;border-radius:8px;box-shadow:0 8px 16px rgba(0,0,0,.24);pointer-events:none;display:none;overflow:hidden}.user-tooltip .banner{height:60px;background-color:#5865f2}.user-tooltip .header{position:relative;padding:12px 16px 16px}.user-tooltip .avatar-wrapper{position:absolute;top:-46px;left:16px;width:88px;height:88px;border-radius:50%;border:6px solid #18191c;background:#18191c;overflow:hidden}.user-tooltip img{width:100%;height:100%;object-fit:cover}.user-tooltip .info-box{margin-top:44px;background:#111214;border-radius:8px;padding:12px}.user-tooltip .name-section{font-size:20px;font-weight:600;color:#fff}.user-tooltip .username{font-size:14px;color:#b9bbbe}.react-tooltip{position:fixed;z-index:1001;background:#18191c;border-radius:4px;padding:8px 12px;box-shadow:0 8px 16px rgba(0,0,0,.24);pointer-events:none;display:none;max-width:300px;color:#dcddde;font-size:.85rem}.sys-icon-wrapper{width:40px;margin-right:16px;text-align:right}.icon-sys{width:18px;height:18px;color:var(--text-muted);margin-top:4px}.msg-system{color:var(--text-muted);padding:2px 0}.msg-system .author{color:var(--text-normal)}.msg-system .system-text{color:var(--text-muted);margin-left:4px}.components-container{margin-top:8px;display:flex;flex-direction:column;gap:8px}.component-row{display:flex;flex-wrap:wrap;gap:8px}.component-btn{display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:2px 16px;border-radius:3px;font-size:14px;font-weight:500;cursor:pointer;user-select:none;color:#fff;text-decoration:none;transition:background-color .17s ease,color .17s ease}.component-btn.blurple{background-color:#5865F2}.component-btn.blurple:hover{background-color:#4752C4}.component-btn.grey{background-color:#4F545C}.component-btn.grey:hover{background-color:#5D6269}.component-btn.green{background-color:#248046}.component-btn.green:hover{background-color:#1a6334}.component-btn.red{background-color:#DA373C}.component-btn.red:hover{background-color:#A12828}.component-btn.link{background-color:transparent;color:#00b0f4!important}.component-btn.link:hover{text-decoration:underline}.component-btn.disabled{opacity:.5;cursor:not-allowed}.component-emoji{width:18px;height:18px;margin-right:4px}.component-emoji-text{margin-right:4px}.component-select{background-color:#2b2d31;border:1px solid #1e1f22;border-radius:4px;padding:8px;min-width:150px;color:#dcddde;display:flex;justify-content:space-between;align-items:center;cursor:not-allowed}.select-arrow{font-size:10px}.select-icon{margin-right:6px;color:var(--text-muted);font-weight:bold;}.poll-container{background:var(--bg-secondary);border-radius:8px;padding:12px;margin-top:8px;max-width:400px;border:1px solid #1e1f22}.poll-question{font-weight:600;font-size:1rem;margin-bottom:8px;color:#fff}.poll-answers{display:flex;flex-direction:column;gap:8px}.poll-answer{background:#1e1f22;border-radius:4px;padding:8px;position:relative;overflow:hidden}.poll-bar{position:absolute;top:0;left:0;bottom:0;width:0%;background:rgba(88,101,242,0.2);z-index:0}.poll-answer-content{position:relative;z-index:1;display:flex;align-items:center;gap:8px}.poll-emoji{width:20px;height:20px;object-fit:contain}.poll-emoji-text{font-size:1.2em}.poll-footer{margin-top:8px;font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:4px}.thread-group{margin-bottom:2px}.thread-list{margin-left:0}.thread-item-wrapper{display:flex;align-items:center;margin-left:14px;position:relative}.thread-spine-icon{color:#4f545c;margin-right:4px;width:32px;height:24px}.thread-link{margin-left:0;border-left:none;padding-left:0;flex:1}.icon-forward{color:#b9bbbe;margin-right:4px}.forward-container{margin-top:4px;display:flex;align-items:stretch;position:relative;max-width:100%}.forward-quote-bar{width:4px;border-radius:4px;background-color:#4f545c;margin-right:8px;flex-shrink:0}.forward-content-wrapper{flex:1;min-width:0;background:var(--bg-secondary);border:1px solid #1e1f22;border-radius:8px;padding:8px 12px;}.forward-header{display:flex;align-items:center;color:var(--text-muted);font-size:0.8rem;margin-bottom:8px;user-select:none;border-bottom:1px solid #3f4147;padding-bottom:6px}.forward-meta{font-size:0.8rem;margin-bottom:8px;color:var(--text-muted);}.forward-author{font-weight:600;color:#fff;}.forward-time{margin-left:4px;}.forward-channel{margin-left:4px;}.forward-inner .body{font-size:0.95rem;}.voice-message{display:flex;align-items:center;padding:10px;background:var(--bg-secondary);border-radius:8px;max-width:300px;gap:10px;border:1px solid #1e1f22;}.voice-icon{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:#5865f2;border-radius:50%;color:white;}.voice-icon svg{width:20px;height:20px;}.voice-meta{font-size:0.85rem;color:var(--text-muted);font-weight:600;}blockquote{margin:8px 0;padding-left:10px;border-left:4px solid #4f545c;max-width:90%}blockquote+blockquote{margin-top:0}h1,h2,h3{margin:8px 0;font-weight:700}h1{font-size:1.5rem}h2{font-size:1.25rem}h3{font-size:1rem}.subtext{font-size:0.75rem;color:var(--text-muted);line-height:1.3}.list-marker{display:inline-block;min-width:1.5em;text-align:right;margin-right:0.5em}.timestamp-gutter{position:absolute;left:0;top:6px;width:54px;text-align:right;font-size:0.7rem;color:var(--text-muted);opacity:0;user-select:none;font-family:"Consolas","Courier New",monospace;box-sizing:border-box;padding-right:6px}.msg-container.consecutive:hover .timestamp-gutter{opacity:1}.pdf-converted-badge{font-size:0.7em;background:#5865F2;color:#fff;padding:2px 4px;border-radius:3px;margin-left:6px;vertical-align:middle}.server-badge{font-size:0.8em;background:#5865F2;color:#fff;padding:2px 6px;border-radius:4px;margin-right:6px}.forward-wrapper{display:flex;margin-top:4px;position:relative;max-width:100%}.forward-spine{width:4px;border-radius:4px;background-color:#4e5058;margin-right:8px;flex-shrink:0}.forward-main{flex:1;min-width:0}.forward-label{display:flex;align-items:center;font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-bottom:4px;user-select:none}.forward-label svg{width:14px;height:14px;margin-right:4px}.forward-body{font-size:1rem;color:var(--text-normal);white-space:pre-wrap}.forward-footer{display:flex;align-items:center;margin-top:4px;font-size:0.75rem;color:var(--text-muted);cursor:pointer;user-select:none;padding-top:4px}.forward-footer:hover{color:var(--text-normal)}.forward-footer:hover .forward-origin-name{text-decoration:underline}.forward-channel-icon svg{width:14px;height:14px;vertical-align:text-bottom;margin-right:2px}.forward-separator{margin:0 4px}.forward-arrow{margin-left:4px;font-weight:bold}
        @media (max-width: 768px) {
            body { position: relative; }
            .sidebar { position: absolute; left: 0; top: 0; bottom: 0; width: 280px; z-index: 999; transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 4px 0 15px rgba(0,0,0,0.5); }
            .sidebar.open { transform: translateX(0); }
            .sidebar-backdrop { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 900; backdrop-filter: blur(2px); }
            .sidebar-backdrop.visible { display: block; }
            .main { width: 100%; height: 100%; }
            .channel-header { padding-left: 4px; }
            .msg-wrapper { padding: 4px 8px; }
            .attachment img, .embed-image img { max-width: 100% !important; height: auto; }
            .embed { max-width: 100%; }
            .menu-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; margin-right: 4px; cursor: pointer; color: var(--text-muted); }
            .search-in-channel { width: 100px; }
            .search-in-channel:focus { width: 150px; }
        }
        @media (min-width: 769px) { .menu-btn { display: none; } }
        details{user-select:none}summary{display:flex;align-items:center;padding:6px 8px;color:var(--text-muted);cursor:pointer;border-radius:4px;font-weight:600;text-transform:uppercase;font-size:12px}summary:hover{color:var(--interactive-hover)}summary::-webkit-details-marker{display:none}summary::before{content:'›';margin-right:5px;font-size:14px;transition:transform .2s;display:inline-block;width:10px}details[open]>summary::before{transform:rotate(90deg)}details[open]>summary{color:#fff}.category-content{margin-left:0}.category-name{margin-left:4px}`;

        const parts = [`<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><title>Log - ${sanitize(categoryName)}</title><style>${css}</style></head><body><div class="sidebar-backdrop" onclick="toggleSidebar()"></div><div class="sidebar"><div class="sidebar-header">${sanitize(categoryName)}</div><input type="text" id="channel-filter" placeholder="Filter channels..."><div class="sidebar-content"><ul style="list-style:none;padding:0">`];
        const validChannelIds = new Set();
        await DB.streamStore(db, 'channels', (data) => validChannelIds.add(data.id));
        const validChannels = channels.filter(c => validChannelIds.has(c.id));
        const parents = validChannels.filter(c => !c.isThread);
        const threads = validChannels.filter(c => c.isThread);
        const categoriesMap = new Map();
        const noCategoryChannels = [];

        parents.forEach(p => {
            if (p.parentName) {
                if (!categoriesMap.has(p.parentName)) categoriesMap.set(p.parentName, { name: p.parentName, channels: [], position: 0 });
                const cat = categoriesMap.get(p.parentName); cat.channels.push(p);
            } else { noCategoryChannels.push(p); }
        });

        const renderChannelItem = (p) => {
            if (!p.isSelected) return "";
            let html = `<li class="channel-group"><div onclick="switchChannel('${p.id}')" id="link-${p.id}" class="sidebar-item">${getChannelIconSVG(p.type, false)} <span class="channel-name">${sanitize(p.name)}</span></div>`;
            const myThreads = threads.filter(t => t.parent_id === p.id && t.isSelected);
            if (myThreads.length > 0) {
                html += `<div class="thread-list">`;
                myThreads.forEach(t => { html += `<div class="thread-item-wrapper">${ICONS.SPINE}<div onclick="switchChannel('${t.id}')" id="link-${t.id}" class="sidebar-item thread-link"><span class="channel-name">${sanitize(t.name)}</span></div></div>`; });
                html += `</div>`;
            }
            html += `</li>`;
            return html;
        };

        noCategoryChannels.sort(compareChannelsDiscordStyle).forEach(p => parts.push(renderChannelItem(p)));
        const processedCats = new Set();
        parents.forEach(p => {
            if(p.parentName && !processedCats.has(p.parentName)) {
                processedCats.add(p.parentName);
                const catData = categoriesMap.get(p.parentName);
                if (catData.channels.some(c => c.isSelected)) {
                    parts.push(`<li><details open><summary><span class="category-name">${sanitize(catData.name)}</span></summary><div class="category-content"><ul style="list-style:none;padding:0">`);
                    catData.channels.sort(compareChannelsDiscordStyle).forEach(child => parts.push(renderChannelItem(child)));
                    parts.push(`</ul></div></details></li>`);
                }
            }
        });

        const orphanThreads = threads.filter(t => !parents.find(p => p.id === t.parent_id) && t.isSelected);
        if(orphanThreads.length > 0) orphanThreads.forEach(t => parts.push(`<li class="thread-group"><div onclick="switchChannel('${t.id}')" id="link-${t.id}" class="sidebar-item thread-link"><span class="channel-name">${sanitize(t.name)}</span></div></li>`));

        let firstChId = "";
        const allVisible = validChannels.filter(c => c.isSelected);
        if (allVisible.length > 0) firstChId = allVisible[0].id;
        else if (validChannels.length > 0) firstChId = validChannels[0].id;

        parts.push(`</ul></div></div><div class="main">`);

        async function strAsyncToB64(str) {
            return new Promise((resolve) => {
                const blob = new Blob([str], { type: 'text/plain' });
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });
        }

        let userDbB64 = await strAsyncToB64(safeStringify(USER_DB));
        let roleDbB64 = await strAsyncToB64(safeStringify(ROLE_DB));
        let channelDbB64 = await strAsyncToB64(safeStringify(CHANNEL_DB));
        let msgPrevDbB64 = await strAsyncToB64(safeStringify(MSG_PREVIEW_DB));
        let urlMapB64 = await strAsyncToB64(JSON.stringify(urlToLocal));
        let validIdsB64 = await strAsyncToB64(JSON.stringify(Array.from(validChannelIds)));
        let iconsB64 = await strAsyncToB64(JSON.stringify(ICONS));

        parts.push(`<div id="user-tooltip" class="user-tooltip"><div class="banner"></div><div class="header"><div class="avatar-wrapper"><img src=""></div><div class="info-box"><div class="name-section"></div><div class="username"></div></div></div></div><div id="react-tooltip" class="react-tooltip"></div><div id="lightbox" onclick="this.style.display='none'"><img src="" onclick="event.stopPropagation()"></div>`);
        parts.push(`<script>
        async function b64ToUtf8(str) { const binString = atob(str); const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)); return new TextDecoder().decode(bytes); }
        let URL_MAP, USER_DB, ROLE_DB, CHANNEL_DB, MSG_PREV_DB, ICONS, VALID_IDS;
        (async () => {
            URL_MAP = JSON.parse(await b64ToUtf8("${urlMapB64}")); USER_DB = JSON.parse(await b64ToUtf8("${userDbB64}")); ROLE_DB = JSON.parse(await b64ToUtf8("${roleDbB64}")); CHANNEL_DB = JSON.parse(await b64ToUtf8("${channelDbB64}")); MSG_PREV_DB = JSON.parse(await b64ToUtf8("${msgPrevDbB64}")); ICONS = JSON.parse(await b64ToUtf8("${iconsB64}")); VALID_IDS = new Set(JSON.parse(await b64ToUtf8("${validIdsB64}"))); init();
        })();
        let activeChannelId = null; let scrollPositions = {};
        function getChannelIconSVG(type, isThread) {
            if (isThread || type === 10 || type === 11 || type === 12) return ICONS.THREAD;
            if (type === 2 || type === 13) return ICONS.VOICE;
            if (type === 5) return ICONS.ANNOUNCE;
            if (type === 15 || type === 16) return ICONS.FORUM;
            return ICONS.TEXT;
        }
        function toggleSidebar() { const sidebar = document.querySelector('.sidebar'); const backdrop = document.querySelector('.sidebar-backdrop'); sidebar.classList.toggle('open'); backdrop.classList.toggle('visible'); }
        window.loadChannel = function(id, htmlContent) { renderChannel(id, htmlContent); };
        function renderChannel(id, html) {
             const container = document.querySelector('.main'); const wrapper = document.createElement('div'); wrapper.innerHTML = html; const newCh = wrapper.firstElementChild; newCh.style.display = 'none'; container.appendChild(newCh);
             const queueLoad = (el) => { if ('requestIdleCallback' in window) requestIdleCallback(() => loadAsset(el)); else setTimeout(() => loadAsset(el), 10); };
             newCh.querySelectorAll('.lazy-load').forEach(queueLoad);
             newCh.querySelectorAll('.role-link').forEach(el => resolveRole(el));
             newCh.querySelectorAll('.user-link, .author, .avatar, .reply-avatar, .forward-author, .forward-avatar').forEach(el => resolveUser(el));
             newCh.querySelectorAll('.channel-link, .message-link, .discord-link').forEach(el => resolveDiscordLinks(el));
             newCh.querySelectorAll('.toggle-lightbox').forEach(el => { el.addEventListener('click', (e) => { e.stopPropagation(); document.querySelector('#lightbox img').src = el.src; document.getElementById('lightbox').style.display = 'flex'; }); });
             newCh.querySelectorAll('.file-download, .file-dl-icon').forEach(el => { el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const url = el.getAttribute('data-original-url'); if(!url) return; const local = URL_MAP[url]; const a = document.createElement('a'); a.href = local ? local : url; a.download = el.getAttribute('data-name'); if(local && local.endsWith('.html') && url.endsWith('.pdf')) { a.removeAttribute('download'); a.target = "_blank"; } if(!local) a.target = "_blank"; a.click(); }); });
             markConvertedPdfs(newCh); localizeTimestamps(newCh); activateChannelUI(id);
        }
        function localizeTimestamps(scope) {
            const locale = undefined; const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
            const updateTime = (el) => {
                const ts = parseInt(el.getAttribute('data-ts')); if (!ts) return; const d = new Date(ts); const fmt = el.getAttribute('data-fmt'); const now = Date.now();
                const fullDateStr = d.toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                if (!el.title) el.title = fullDateStr;
                if (fmt === 't') el.textContent = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
                else if (fmt === 'T') el.textContent = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                else if (fmt === 'd') el.textContent = d.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
                else if (fmt === 'D') el.textContent = d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
                else if (fmt === 'f') el.textContent = d.toLocaleString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                else if (fmt === 'F') el.textContent = d.toLocaleString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                else if (fmt === 'R') {
                    const diffSeconds = (ts - now) / 1000; const absDiff = Math.abs(diffSeconds);
                    if (absDiff < 60) el.textContent = rtf.format(Math.round(diffSeconds), 'second');
                    else if (absDiff < 3600) el.textContent = rtf.format(Math.round(diffSeconds / 60), 'minute');
                    else if (absDiff < 86400) el.textContent = rtf.format(Math.round(diffSeconds / 3600), 'hour');
                    else if (absDiff < 2592000) el.textContent = rtf.format(Math.round(diffSeconds / 86400), 'day');
                    else if (absDiff < 31536000) el.textContent = rtf.format(Math.round(diffSeconds / 31536000), 'month');
                    else el.textContent = rtf.format(Math.round(diffSeconds / 31536000), 'year');
                } else if (fmt === 'header') {
                    const today = new Date(); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
                    const isToday = d.toDateString() === today.toDateString(); const isYesterday = d.toDateString() === yesterday.toDateString(); const timeStr = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
                    if (isToday) el.textContent = "Today at " + timeStr; else if (isYesterday) el.textContent = "Yesterday at " + timeStr; else el.textContent = d.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
                } else if (el.classList.contains('date-divider')) { const span = el.querySelector('span'); if (span) span.textContent = d.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); }
                else if (el.classList.contains('timestamp-gutter')) { el.textContent = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }); }
            };
            scope.querySelectorAll('[data-ts]').forEach(updateTime);
        }
        setInterval(() => {
            const locale = undefined; const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }); const now = Date.now();
            document.querySelectorAll('[data-fmt="R"]').forEach(el => {
                const ts = parseInt(el.getAttribute('data-ts')); if (!ts) return; const diffSeconds = (ts - now) / 1000; const absDiff = Math.abs(diffSeconds);
                if (absDiff < 60) el.textContent = rtf.format(Math.round(diffSeconds), 'second');
                else if (absDiff < 3600) el.textContent = rtf.format(Math.round(diffSeconds / 60), 'minute');
                else if (absDiff < 86400) el.textContent = rtf.format(Math.round(diffSeconds / 3600), 'hour');
                else if (absDiff < 2592000) el.textContent = rtf.format(Math.round(diffSeconds / 86400), 'day');
                else if (absDiff < 31536000) el.textContent = rtf.format(Math.round(diffSeconds / 2592000), 'month');
                else el.textContent = rtf.format(Math.round(diffSeconds / 31536000), 'year');
            });
        }, 60000);
        window.switchChannel = function(id, pushHistory = true) {
            if (document.querySelector('.sidebar').classList.contains('open')) { toggleSidebar(); }
            return new Promise((resolve) => {
                if (activeChannelId === id) { resolve(); return; }
                const container = document.querySelector('.main');
                if (activeChannelId) scrollPositions[activeChannelId] = container.scrollTop;
                if (document.getElementById('ch-' + id)) { activateChannelUI(id); if (pushHistory) history.pushState({ channelId: id }, "", "#" + id); resolve(); }
                else {
                    const script = document.createElement('script'); script.src = 'data/ch_' + id + '.js';
                    script.onload = () => { if (pushHistory) history.pushState({ channelId: id }, "", "#" + id); resolve(); };
                    script.onerror = () => { alert("Failed to load channel data."); resolve(); }; document.body.appendChild(script);
                }
            });
        };
        function activateChannelUI(id) {
             const container = document.querySelector('.main'); const oldCh = document.getElementById('ch-' + activeChannelId); const oldLink = document.getElementById('link-' + activeChannelId); const newLink = document.getElementById('link-' + id); const newCh = document.getElementById('ch-' + id);
             if (oldCh) { oldCh.classList.remove('active'); oldCh.style.display = 'none'; } if (oldLink) oldLink.classList.remove('active');
             if (newCh) { newCh.classList.add('active'); newCh.style.display = 'flex'; } if (newLink) newLink.classList.add('active');
             activeChannelId = id; container.scrollTop = scrollPositions[id] !== undefined ? scrollPositions[id] : 0;
        }
        window.onpopstate = function(event) { if (event.state && event.state.channelId) switchChannel(event.state.channelId, false); else { const hashId = location.hash.replace('#', ''); if (hashId && document.getElementById('link-' + hashId)) switchChannel(hashId, false); } };
        const loadAsset = (el) => { const url = el.getAttribute('data-original-url'); if (!url) return; const local = URL_MAP[url]; if (local) { el.src = local; el.removeAttribute('data-original-url'); el.classList.remove('lazy-load'); } else { el.src = url; el.removeAttribute('data-original-url'); el.classList.remove('lazy-load'); } };
        let debounceTimer; window.debounceSearch = function(input) { clearTimeout(debounceTimer); debounceTimer = setTimeout(() => { const val = input.value.toLowerCase(); input.closest('.channel-section').querySelectorAll('.msg-container').forEach(msg => { msg.style.display = msg.textContent.toLowerCase().includes(val) ? '' : 'none'; }); }, 300); };
        document.getElementById('channel-filter').addEventListener('input', (e) => { const val = e.target.value.toLowerCase(); document.querySelectorAll('.channel-group, .thread-group').forEach(li => { li.style.display = li.textContent.toLowerCase().includes(val) ? '' : 'none'; }); });
        document.addEventListener('keydown', (e) => { if (e.key === "Escape") document.getElementById('lightbox').style.display = 'none'; });
        function hexToRgba(hex, alpha) { if (!hex) return "transparent"; const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); return "rgba(" + r + "," + g + "," + b + "," + alpha + ")"; }
        function resolveUser(el) {
            const uid = el.getAttribute('data-uid'); const u = USER_DB[uid]; if (!u) return;
            if (el.tagName === 'IMG') {
                let avatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
                if (u.avatar) avatarUrl = "https://cdn.discordapp.com/avatars/" + uid + "/" + u.avatar + ".png";
                else if (u.discriminator && u.discriminator !== "0") { const index = parseInt(u.discriminator) % 5; avatarUrl = "https://cdn.discordapp.com/embed/avatars/" + index + ".png"; }
                else { const index = Number((BigInt(uid) >> 22n) % 6n); avatarUrl = "https://cdn.discordapp.com/embed/avatars/" + index + ".png"; }
                el.setAttribute('data-original-url', avatarUrl); el.removeAttribute('data-uid'); loadAsset(el);
            } else {
                let name = u.global_name || u.username; if (u.nick) name = u.nick;
                if (el.classList.contains('author') || el.classList.contains('forward-author') || el.classList.contains('reply-username')) { el.textContent = name; if (u.color) el.style.color = u.color; }
                else if (el.classList.contains('user-link')) { el.textContent = "@" + name; }
            }
        }
        function resolveRole(el) { const rid = el.getAttribute('data-rid'); const r = ROLE_DB[rid]; if (r) { el.textContent = "@" + r.name; if (r.colorHex) { el.style.color = r.colorHex; el.style.backgroundColor = hexToRgba(r.colorHex, 0.1); } } }

        window.jumpToMessage = async function(cid, mid) {
            if (!cid || cid === 'undefined' || cid === 'null') { alert("チャンネル情報が不足しているためジャンプできません。"); return; }
            await switchChannel(cid);
            let attempts = 0;
            const interval = setInterval(() => {
                const msgEl = document.getElementById('msg-' + mid);
                if (msgEl) {
                    clearInterval(interval);
                    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    msgEl.classList.add('highlight');
                    setTimeout(() => msgEl.classList.remove('highlight'), 2000);
                } else {
                    attempts++;
                    if (attempts > 20) clearInterval(interval);
                }
            }, 50);
        };

        window.handleForwardClick = function(el, event) {
            event.stopPropagation();
            const cid = el.getAttribute('data-cid');
            const mid = el.getAttribute('data-mid');

            if (VALID_IDS.has(cid)) {
                if (mid) jumpToMessage(cid, mid);
                else switchChannel(cid);
            } else {
                const targetUrl = 'https://discord.com/channels/' + (el.getAttribute('data-gid') || '@me') + '/' + (cid || '') + (mid ? '/' + mid : '');
                if (confirm("このメッセージはログに含まれていません。\\nDiscordで開きますか？")) {
                     window.open(targetUrl, '_blank');
                }
            }
        };

        function resolveDiscordLinks(el) {
            const cid = el.getAttribute('data-cid'); const mid = el.getAttribute('data-mid'); const url = el.getAttribute('data-url'); const c = CHANNEL_DB[cid]; const isExported = VALID_IDS.has(cid);
            if (c) {
                let text = c.name; let iconType = c.type || 0; let icon = getChannelIconSVG(iconType, false);
                if (c.parentId && c.parentName) { text = c.parentName + " > " + c.name; icon = getChannelIconSVG(c.type, true); }
                else if (c.type === 10 || c.type === 11 || c.type === 12) { icon = getChannelIconSVG(c.type, true); }
                if (!el.classList.contains('reply-text')) { if (mid) el.innerHTML = icon + " " + text + " (Jump)"; else el.innerHTML = icon + " " + text; }
            } else { if (!mid) el.textContent = "#" + cid; }
            el.onclick = (e) => { e.preventDefault(); e.stopPropagation(); if (isExported) { if (mid) jumpToMessage(cid, mid); else switchChannel(cid); } else { const targetUrl = url || ('https://discord.com/channels/@me/' + cid + (mid ? '/' + mid : '')); if (confirm("このチャンネルはログに含まれていません。\\nDiscordで開きますか？")) window.open(targetUrl, '_blank'); } };
        }
        function markConvertedPdfs(scope) { if(!URL_MAP) return; scope.querySelectorAll('.file-download').forEach(el => { const url = el.getAttribute('data-original-url'); if(url && url.toLowerCase().includes('.pdf')) { const local = URL_MAP[url]; if(local && local.endsWith('.html')) { const badge = document.createElement('span'); badge.className = 'pdf-converted-badge'; badge.textContent = 'PDF->HTML'; el.parentNode.appendChild(badge); } } }); }
        const tooltip = document.getElementById('user-tooltip'); const reactTooltip = document.getElementById('react-tooltip');
        document.addEventListener('mouseover', (e) => { if (e.target.classList.contains('user-hover') || e.target.classList.contains('user-link') || e.target.classList.contains('avatar') || e.target.classList.contains('forward-avatar') || e.target.classList.contains('reply-avatar')) { const uid = e.target.getAttribute('data-uid'); const u = USER_DB[uid]; if (u) { let name = u.global_name || u.username; if (u.nick) name = u.nick; tooltip.querySelector('.name-section').textContent = name; tooltip.querySelector('.username').textContent = u.username; const img = tooltip.querySelector('img'); let avatarUrl = "https://cdn.discordapp.com/embed/avatars/0.png"; if (u.avatar) avatarUrl = "https://cdn.discordapp.com/avatars/" + uid + "/" + u.avatar + ".png"; else if (u.discriminator && u.discriminator !== "0") { const index = parseInt(u.discriminator) % 5; avatarUrl = "https://cdn.discordapp.com/embed/avatars/" + index + ".png"; } else { const index = Number((BigInt(uid) >> 22n) % 6n); avatarUrl = "https://cdn.discordapp.com/embed/avatars/" + index + ".png"; } img.setAttribute('data-original-url', avatarUrl); loadAsset(img); tooltip.style.display = 'block'; const x = Math.min(e.clientX + 10, window.innerWidth - 320); const y = Math.min(e.clientY + 10, window.innerHeight - 200); tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px'; } } const reaction = e.target.closest('.reaction'); if (reaction) { const usersJson = reaction.getAttribute('data-users'); const users = JSON.parse(usersJson || "[]"); if (users.length > 0) { reactTooltip.innerHTML = "<b>" + users.join(", ") + "</b>"; reactTooltip.style.display = 'block'; const x = Math.min(e.clientX + 10, window.innerWidth - 300); const y = Math.min(e.clientY + 10, window.innerHeight - 100); reactTooltip.style.left = x + 'px'; reactTooltip.style.top = y + 'px'; } } });
        document.addEventListener('mouseout', (e) => { tooltip.style.display = 'none'; reactTooltip.style.display = 'none'; });
        function init() { document.querySelectorAll('.channel-link, .message-link, .discord-link').forEach(el => resolveDiscordLinks(el)); localizeTimestamps(document); const initId = "${firstChId}"; if(initId) { history.replaceState({ channelId: initId }, "", "#" + initId); switchChannel(initId, false); } }
        </script></body></html>`);

        const textEncoder = new TextEncoder();
        zip.addFile("index.html", textEncoder.encode(parts.join("")));
        progressHandler("📦 Zipping...");
        await yieldToMain();
        return await zip.generateAsync((processed, total) => { if (processed % 10 === 0) progressHandler(`📦 Zip ${Math.floor(processed/total*100)}%`); });
    }

    // ==========================================
    // 12. メイン処理ロジック (統合)
    // ==========================================

    async function processArchival(targetChannels, guildId, saveName, progressHandler, quality) {
        const d = new Date();
        const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
        const fileName = `Log_${saveName.replace(/[\\/:*?"<>|]/g, "_")}_${dateStr}.zip`;

        progressHandler("⏳ Init...", true);
        await KeepAwake.enable();
        let db = null;
        const messageCacheMap = new Map();

        try {
            await DB.delete();
            db = await DB.open();
            await DB.clear(db);

            await getGuildRoles(guildId);
            const roleUrlSet = new Set();
            Object.values(ROLE_DB).forEach(r => { if (r.icon) { const ext = r.icon.startsWith("a_") ? "gif" : "png"; roleUrlSet.add(`https://cdn.discordapp.com/role-icons/${r.id}/${r.icon}.${ext}`); } });

            let channels = targetChannels;
            if (targetChannels instanceof Set) { channels = await getSelectedChannelsAndThreads(guildId, targetChannels, m => progressHandler(m), messageCacheMap); }
            if (!channels.length) throw "保存対象のチャンネルが見つかりませんでした。";
            channels.sort((a, b) => a.position - b.position);

            const targetChannelIds = new Set(channels.map(c => c.id));
            const urlSet = new Set(); roleUrlSet.forEach(u => urlSet.add(u));
            const allMessagesMap = new Map();
            const unknownUserIds = new Set();
            const channelsToResolve = new Set();
            const contextQueue = [];
            const contextLinksProcessed = new Set();
            const externalGuildsCache = new Map();

            const scanContentForAssets = (text) => {
                if (!text) return;
                extractUserIds(text).forEach(id => unknownUserIds.add(id));
                extractChannelIds(text).forEach(id => channelsToResolve.add(id));
                extractDiscordLinks(text).forEach(l => {
                    if(l.channelId) {
                        channelsToResolve.add(l.channelId);
                        if (!targetChannelIds.has(l.channelId) && l.messageId) {
                            const gId = l.guildId || guildId;
                            const key = `${gId}-${l.channelId}-${l.messageId}`;
                            if (!contextLinksProcessed.has(key)) { contextLinksProcessed.add(key); contextQueue.push({ guildId: gId, channelId: l.channelId, messageId: l.messageId }); }
                        }
                    }
                });
                extractCustomEmojis(text).forEach(e => { const ext = e.animated ? 'gif' : 'png'; urlSet.add(`https://cdn.discordapp.com/emojis/${e.id}.${ext}`); });
            };

            await runParallelQueue(
                channels, CONFIG.CONCURRENCY.MESSAGE_FETCH,
                async (ch) => {
                    try {
                        if (!ch.last_message_id && (ch.type === 2 || ch.type === 13)) return;
                        let msgs = messageCacheMap.get(ch.id);
                        if (!msgs) msgs = await fetchAllMessages(ch.id);
                        if (msgs === null) return;
                        allMessagesMap.set(ch.id, msgs);
                        CHANNEL_DB[ch.id] = { name: ch.name, type: ch.type, parentId: ch.parent_id, parentName: ch.parentName };
                        const stack = [...msgs];
                        while(stack.length > 0) {
                            const curr = stack.pop();
                            if(!curr) continue;
                            scanContentForAssets(curr.content);
                            if (curr.referenced_message) {
                                const rm = curr.referenced_message;
                                if (rm.author) { cacheUser(rm.author); urlSet.add(getAvatarUrl(rm.author)); }
                                scanContentForAssets(rm.content);
                            }
                            if (curr.message_snapshots) {
                                curr.message_snapshots.forEach(snap => {
                                    if (snap.message) {
                                        const snapMsg = snap.message;
                                        scanContentForAssets(snapMsg.content);
                                        if (snapMsg.attachments) snapMsg.attachments.forEach(a => urlSet.add(a.url));
                                        if (snapMsg.embeds) snapMsg.embeds.forEach(em => {
                                            if(em.image?.url) urlSet.add(em.image.url);
                                            if(em.thumbnail?.url) urlSet.add(em.thumbnail.url);
                                            scanContentForAssets(em.description);
                                        });
                                        if (snapMsg.sticker_items) snapMsg.sticker_items.forEach(s => urlSet.add(`https://media.discordapp.net/stickers/${s.id}.png`));
                                    }
                                });
                            }
                            if (curr.embeds) {
                                curr.embeds.forEach(em => {
                                    scanContentForAssets(em.description);
                                    if(em.fields) em.fields.forEach(f => scanContentForAssets(f.value));
                                    if(em.image?.url) urlSet.add(em.image.url);
                                    if(em.thumbnail?.url) urlSet.add(em.thumbnail.url);
                                    if(em.author?.icon_url) urlSet.add(em.author.icon_url);
                                    if(em.footer?.icon_url) urlSet.add(em.footer.icon_url);
                                });
                            }
                            if (curr.attachments) curr.attachments.forEach(a => urlSet.add(a.url));
                            if (curr.components) curr.components.forEach(row => { if(row.components) row.components.forEach(c => { if(c.emoji && c.emoji.id) urlSet.add(`https://cdn.discordapp.com/emojis/${c.emoji.id}.png`); }); });
                            if (curr.poll && curr.poll.answers) { curr.poll.answers.forEach(a => { if (a.poll_media && a.poll_media.emoji && a.poll_media.emoji.id) urlSet.add(`https://cdn.discordapp.com/emojis/${a.poll_media.emoji.id}.png`); }); }
                            if (curr.author) { cacheUser(curr.author, curr.member); urlSet.add(getAvatarUrl(curr.author)); }
                            if (curr.mentions) curr.mentions.forEach(u => cacheUser(u));
                            if (curr.reactions) curr.reactions.forEach(r => { if (r.emoji.id) { const ext = r.emoji.animated ? "gif" : "png"; urlSet.add(`https://cdn.discordapp.com/emojis/${r.emoji.id}.${ext}`); } });
                            if (curr.sticker_items) curr.sticker_items.forEach(s => urlSet.add(`https://media.discordapp.net/stickers/${s.id}.png`));
                        }
                    } catch (err) { console.warn(`Skipped #${ch.name}:`, err); }
                },
                (idx, total) => { progressHandler(`Fetch: ${idx}/${total}`); }
            );

            if (contextQueue.length > 0) {
                const partialChannelMessages = new Map();
                const contextChannelMeta = new Map();
                await runParallelQueue(
                    contextQueue, CONFIG.CONCURRENCY.CONTEXT_FETCH,
                    async (item) => {
                        const msgs = await fetchContextMessages(item.channelId, item.messageId);
                        if (msgs && msgs.length > 0) {
                            if (!partialChannelMessages.has(item.channelId)) {
                                partialChannelMessages.set(item.channelId, new Map());
                                let serverName = null;
                                if (item.guildId && item.guildId !== guildId) {
                                    if (!externalGuildsCache.has(item.guildId)) {
                                        try { const gInfo = await apiCall(`${API_BASE}/guilds/${item.guildId}`); externalGuildsCache.set(item.guildId, gInfo.name); } catch(e) { externalGuildsCache.set(item.guildId, "External Server"); }
                                    }
                                    serverName = externalGuildsCache.get(item.guildId);
                                }
                                contextChannelMeta.set(item.channelId, { serverName, guildId: item.guildId });
                            }
                            const chMap = partialChannelMessages.get(item.channelId);
                            msgs.forEach(m => chMap.set(m.id, m));
                        }
                    },
                    (c, t) => { progressHandler(`Context: ${c}/${t}`); }
                );
                for (const [chId, msgMap] of partialChannelMessages) {
                    const sortedMsgs = Array.from(msgMap.values()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    await fetchChannelInfo(chId);
                    const chInfo = CHANNEL_DB[chId];
                    if (chInfo && chInfo.parentId) await fetchChannelInfo(chInfo.parentId);
                    const meta = contextChannelMeta.get(chId);
                    if (allMessagesMap.has(chId)) {
                        const existing = allMessagesMap.get(chId);
                        const existingIds = new Set(existing.map(m => m.id));
                        const newMsgs = sortedMsgs.filter(m => !existingIds.has(m.id));
                        existing.push(...newMsgs); existing.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    } else {
                        allMessagesMap.set(chId, sortedMsgs);
                        channels.push({
                            id: chId, name: chInfo ? chInfo.name : `Channel_${chId}`, type: chInfo ? chInfo.type : 0,
                            parent_id: chInfo ? chInfo.parentId : null, parentName: chInfo ? chInfo.parentName : null,
                            isThread: (chInfo && [10, 11, 12].includes(chInfo.type)), position: 9999, isSelected: false, serverName: meta ? meta.serverName : null
                        });
                        targetChannelIds.add(chId);
                    }
                    sortedMsgs.forEach(m => {
                         if (m.author) { cacheUser(m.author); urlSet.add(getAvatarUrl(m.author)); }
                         scanContentForAssets(m.content);
                         if(m.attachments) m.attachments.forEach(a => urlSet.add(a.url));
                         if(m.embeds) m.embeds.forEach(em => { if(em.image?.url) urlSet.add(em.image.url); scanContentForAssets(em.description); if(em.fields) em.fields.forEach(f => scanContentForAssets(f.value)); });
                    });
                }
            }

            await resolveUnknownUsers(unknownUserIds, guildId, () => {});
            if (channelsToResolve.size > 0) { const ids = Array.from(channelsToResolve); await resolveLinks(ids, (idx, total) => { progressHandler(`Resolve: ${idx}/${total}`); }); }
            if (urlSet.size === 0) throw "データがありませんでした。";
            console.log(`Downloading ${urlSet.size} assets...`);
            await downloadAssetsToDB(db, urlSet, (c, t) => { const percent = Math.floor((c / t) * 100); progressHandler(`DL: ${percent}%`); }, quality);

            await runParallelQueue(
                channels, CONFIG.CONCURRENCY.CHANNEL_SCAN,
                async (ch) => {
                    const msgs = allMessagesMap.get(ch.id);
                    if(!msgs) return;
                    await processReactionsInParallel(ch.id, msgs, () => {});
                    const chHtml = generateChannelHTML(ch, msgs, 0);
                    await DB.put(db, 'channels', { id: ch.id, html: chHtml });
                }
            );

            progressHandler("💾 Gen..."); await yieldToMain();
            const blob = await generateZipBlob(db, saveName, channels, progressHandler);
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fileName; a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 10000);
            if(db) { db.close(); db = null; }
        } catch (err) { if (err !== "Cancelled") alert("Error: " + err); console.error(err); }
        finally { KeepAwake.disable(); if (db) { try { db.close(); } catch(e){} db = null; } progressHandler(null, false); }
    }

    // ==========================================
    // 13. UI (モーダル & ボタン)
    // ==========================================

    const MODAL_CSS = `
    .dl-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; }
    .dl-modal { background: #313338; width: 600px; max-height: 85vh; border-radius: 4px; display: flex; flex-direction: column; color: #dbdee1; font-family: var(--font-primary); box-shadow: 0 0 10px rgba(0,0,0,0.5); }
    .dl-modal-header { padding: 16px; background-color: #313338; border-bottom: 1px solid #2b2d31; font-size: 20px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; color: #f2f3f5; }
    .dl-modal-body { padding: 0 16px; overflow-y: auto; flex: 1; background-color: #2b2d31; }
    .dl-modal-footer { padding: 16px; background-color: #2b2d31; border-top: 1px solid #1e1f22; display: flex; justify-content: space-between; align-items: center; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; }
    .dl-modal-footer-left { display: flex; align-items: center; gap: 8px; flex: 1; }
    .dl-modal-footer-right { display: flex; align-items: center; gap: 10px; }
    .dl-checkbox-group { margin-bottom: 4px; }
    .dl-category-header { display: flex; align-items: center; cursor: pointer; user-select: none; padding-top: 8px; padding-bottom: 4px; }
    .dl-category-header:hover .dl-category-arrow { color: #dbdee1; }
    .dl-category-arrow { width: 16px; height: 16px; margin-right: 4px; color: #949ba4; transition: transform 0.2s; display: flex; align-items: center; justify-content: center; font-size: 10px; }
    .dl-category-arrow svg { width: 100%; height: 100%; }
    .dl-category-arrow.collapsed { transform: rotate(-90deg); }
    .dl-category-label { flex: 1; background-color: transparent; border-radius: 4px; font-weight: 600; color: #b5bac1; text-transform: uppercase; font-size: 12px; display: flex; align-items: center; transition: color 0.15s; }
    .dl-category-label:hover { color: #dbdee1; }
    .dl-category-label input { margin-right: 10px; cursor: pointer; width: 16px; height: 16px; }
    .dl-channel-list { display: flex; flex-direction: column; gap: 2px; margin-left: 8px; border-left: 2px solid #3f4147; padding-left: 8px; }
    .dl-channel-list.collapsed { display: none; }
    .dl-channel-item { display: flex; align-items: center; padding: 6px 8px; cursor: pointer; border-radius: 4px; color: #949ba4; transition: background-color 0.1s; user-select: none; }
    .dl-channel-item:hover { background-color: #35373c; color: #dbdee1; }
    .dl-channel-item input { margin-right: 10px; cursor: pointer; width: 16px; height: 16px; }
    .dl-channel-name { display: flex; align-items: center; font-weight: 500; }
    .dl-channel-name svg { color: #80848e; width: 20px; height: 20px; margin-right: 6px; }
    .dl-btn { padding: 10px 24px; border: none; border-radius: 3px; cursor: pointer; font-size: 14px; color: white; font-weight: 500; transition: background-color 0.2s; }
    .dl-btn-primary { background-color: #5865F2; }
    .dl-btn-primary:hover { background-color: #4752C4; }
    .dl-btn-secondary { background-color: transparent; color: #fff; }
    .dl-btn-secondary:hover { text-decoration: underline; }
    .dl-actions-bar { display: flex; justify-content: flex-end; padding: 8px 0; position: sticky; top: 0; background-color: #2b2d31; z-index: 10; border-bottom: 1px solid #1e1f22; margin-bottom: 8px; }
    .dl-text-btn { background: none; border: none; color: #00b0f4; cursor: pointer; font-size: 12px; margin-left: 12px; }
    .dl-text-btn:hover { text-decoration: underline; }
    .dl-modal-body::-webkit-scrollbar { width: 8px; background-color: #2b2d31; }
    .dl-modal-body::-webkit-scrollbar-thumb { background-color: #1a1b1e; border-radius: 4px; }
    .dl-modal-body::-webkit-scrollbar-track { background-color: #2b2d31; }
    .discord-native-btn { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; color: var(--interactive-normal); transition: color 0.15s ease-out; opacity: 0.7; }
    .discord-native-btn:hover { color: var(--interactive-hover); opacity: 1; }
    .discord-native-btn-wrapper { margin: 0 8px; display: flex; align-items: center; justify-content: center; }
    .bot-save-btn { display: inline-flex; align-items: center; justify-content: center; margin-left: 0.5rem; color: var(--text-muted); cursor: pointer; opacity: 0.6; transition: opacity 0.1s ease, color 0.1s ease; vertical-align: text-bottom; }
    .bot-save-btn:hover { opacity: 1; color: var(--interactive-active); }
    .bot-save-btn svg { width: 18px; height: 18px; }
    .dl-toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; }
    .dl-toast { background-color: var(--background-floating, #18191c); color: var(--text-normal, #dbdee1); border-radius: 4px; box-shadow: var(--elevation-high, 0 8px 16px rgba(0,0,0,0.24)); padding: 10px 16px; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 14px; pointer-events: auto; min-width: 200px; border-left: 4px solid #5865F2; animation: dl-toast-slide-in 0.3s ease-out; }
    @keyframes dl-toast-slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .dl-spinner { border: 2px solid rgba(255,255,255,0.1); border-left-color: #5865F2; border-radius: 50%; width: 16px; height: 16px; animation: dl-spin 1s linear infinite; }
    @keyframes dl-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .dl-quality-control { display: flex; flex-direction: column; width: 220px; }
    .dl-quality-label { font-size: 12px; color: #b9bbbe; margin-bottom: 4px; display: flex; justify-content: space-between; }
    .dl-quality-value { font-weight: bold; color: #fff; }
    .dl-range-input { -webkit-appearance: none; width: 100%; height: 4px; background: #4f545c; border-radius: 2px; outline: none; }
    .dl-range-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #5865F2; cursor: pointer; border: 2px solid #2b2d31; }
    .dl-range-input::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: #5865F2; cursor: pointer; border: 2px solid #2b2d31; }
    `;
    function injectStyle(css) { const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style); }
    injectStyle(MODAL_CSS);

    const ProgressUI = {
        toastContainer: null, currentToast: null, spinnerEl: null, textEl: null,
        ensureContainer: function() { if (!this.toastContainer) { this.toastContainer = document.createElement('div'); this.toastContainer.className = 'dl-toast-container'; document.body.appendChild(this.toastContainer); } },
        show: function(message) {
            this.ensureContainer();
            if (!this.currentToast) {
                this.currentToast = document.createElement('div'); this.currentToast.className = 'dl-toast';
                this.spinnerEl = document.createElement('div'); this.spinnerEl.className = 'dl-spinner';
                this.textEl = document.createElement('span');
                this.currentToast.appendChild(this.spinnerEl); this.currentToast.appendChild(this.textEl);
                this.toastContainer.appendChild(this.currentToast);
            }
            this.textEl.textContent = message;
        },
        hide: function() { if (this.currentToast) { this.currentToast.remove(); this.currentToast = null; this.spinnerEl = null; this.textEl = null; } }
    };

    async function showGuildSelectionModal(guildId, guildName, updateBtnState) {
        let allChannels, currentMember, guildRoles, guildInfo;
        updateBtnState(true);
        try {
            if (guildId === '@me' || !/^\d+$/.test(guildId)) throw new Error("ダイレクトメッセージ（DM）ではサーバー保存機能は使用できません。");
            const promises = [ apiCall(`${API_BASE}/guilds/${guildId}/channels`), apiCall(`${API_BASE}/guilds/${guildId}/members/${(await apiCall(`${API_BASE}/users/@me`)).id}`), apiCall(`${API_BASE}/guilds/${guildId}/roles`), apiCall(`${API_BASE}/guilds/${guildId}`) ];
            const results = await Promise.all(promises);
            allChannels = results[0]; currentMember = results[1]; guildRoles = results[2]; guildInfo = results[3]; currentMember.guild_id = guildId;
        } catch(e) {
            console.warn("Permission fetch failed:", e);
            if(!allChannels) { try { allChannels = await apiCall(`${API_BASE}/guilds/${guildId}/channels`); } catch(ex) { alert("チャンネル情報の取得に失敗しました: " + ex); updateBtnState(false); return; } }
        } finally { updateBtnState(false); }

        const overlay = document.createElement('div'); overlay.className = 'dl-modal-overlay';
        const modal = document.createElement('div'); modal.className = 'dl-modal';
        const header = document.createElement('div'); header.className = 'dl-modal-header'; header.innerHTML = `<span>${sanitize(guildName)} - 保存設定</span>`;
        const closeBtn = document.createElement('div'); closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4 5.6 4 4 5.6l6.4 6.4L4 18.4 5.6 20l6.4-6.4 6.4 6.4 1.6-1.6-6.4-6.4L20 5.6 18.4 4z"/></svg>'; closeBtn.style.cursor = 'pointer'; closeBtn.onclick = () => document.body.removeChild(overlay); header.appendChild(closeBtn);
        const body = document.createElement('div'); body.className = 'dl-modal-body';

        // Sticky Actions Bar
        const actionsBar = document.createElement('div'); actionsBar.className = 'dl-actions-bar';
        const selectAllBtn = document.createElement('button'); selectAllBtn.className = 'dl-text-btn'; selectAllBtn.textContent = 'すべて選択';
        const deselectAllBtn = document.createElement('button'); deselectAllBtn.className = 'dl-text-btn'; deselectAllBtn.textContent = 'すべて解除';
        actionsBar.appendChild(selectAllBtn); actionsBar.appendChild(deselectAllBtn); body.appendChild(actionsBar);

        const categories = []; const channelsByParent = {};
        allChannels.forEach(c => {
            if (currentMember && guildRoles && guildInfo) if (!hasChannelPermission(c, currentMember, guildRoles, guildInfo)) return;
            if (c.type === 4) categories.push(c);
            else { const pid = c.parent_id || 'uncategorized'; if (!channelsByParent[pid]) channelsByParent[pid] = []; channelsByParent[pid].push(c); }
        });
        categories.sort((a, b) => a.position - b.position);
        Object.keys(channelsByParent).forEach(pid => { channelsByParent[pid].sort(compareChannelsDiscordStyle); });

        const channelContainer = document.createElement('div');
        const createChannelCheckbox = (c) => {
            const wrapper = document.createElement('label'); wrapper.className = 'dl-channel-item';
            const cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = c.id; cb.checked = true; wrapper.appendChild(cb);
            const icon = getChannelIconSVG(c.type, false);
            const name = document.createElement('span'); name.className = 'dl-channel-name'; name.innerHTML = `${icon} ${sanitize(c.name)}`; wrapper.appendChild(name);
            return wrapper;
        };

        const renderCategoryGroup = (catName, children) => {
            if (!children || children.length === 0) return null;
            const group = document.createElement('div'); group.className = 'dl-checkbox-group';
            const header = document.createElement('div'); header.className = 'dl-category-header';
            const arrow = document.createElement('div'); arrow.className = 'dl-category-arrow'; arrow.innerHTML = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`; header.appendChild(arrow);
            const catLabel = document.createElement('div'); catLabel.className = 'dl-category-label';
            const catCb = document.createElement('input'); catCb.type = 'checkbox'; catCb.checked = true; catCb.onclick = (e) => e.stopPropagation();
            catLabel.appendChild(catCb); catLabel.appendChild(document.createTextNode(catName)); header.appendChild(catLabel); group.appendChild(header);
            const list = document.createElement('div'); list.className = 'dl-channel-list';
            header.onclick = (e) => { if (e.target === catCb) return; const isCollapsed = list.classList.toggle('collapsed'); if(isCollapsed) arrow.classList.add('collapsed'); else arrow.classList.remove('collapsed'); };
            const childCheckboxes = [];
            children.forEach(c => { if ([0, 2, 5, 13, 15, 16].includes(c.type)) { const el = createChannelCheckbox(c); list.appendChild(el); childCheckboxes.push(el.querySelector('input')); } });
            if (childCheckboxes.length > 0) {
                catCb.onchange = () => { childCheckboxes.forEach(cb => cb.checked = catCb.checked); };
                childCheckboxes.forEach(cb => { cb.onchange = () => { const allChecked = childCheckboxes.every(k => k.checked); const someChecked = childCheckboxes.some(k => k.checked); catCb.checked = allChecked; catCb.indeterminate = someChecked && !allChecked; }; });
                group.appendChild(list); return group;
            }
            return null;
        };

        if (channelsByParent['uncategorized']) { const group = document.createElement('div'); group.className = 'dl-checkbox-group'; channelsByParent['uncategorized'].forEach(c => { if ([0, 2, 5, 13, 15, 16].includes(c.type)) group.appendChild(createChannelCheckbox(c)); }); channelContainer.appendChild(group); }
        const processedParentIds = new Set(['uncategorized']);
        categories.forEach(cat => { const children = channelsByParent[cat.id]; const el = renderCategoryGroup(cat.name, children); if(el) channelContainer.appendChild(el); processedParentIds.add(cat.id); });
        Object.keys(channelsByParent).forEach(pid => { if (processedParentIds.has(pid)) return; const hiddenParent = allChannels.find(c => c.id === pid); const parentName = hiddenParent ? `${hiddenParent.name} (Hidden Category)` : "Unknown Category"; const children = channelsByParent[pid]; const el = renderCategoryGroup(parentName, children); if(el) channelContainer.appendChild(el); });
        body.appendChild(channelContainer);

        // Footer with Quality Slider and Buttons
        const footer = document.createElement('div'); footer.className = 'dl-modal-footer';

        const footerLeft = document.createElement('div'); footerLeft.className = 'dl-modal-footer-left';
        // Quality Control
        const qualityControl = document.createElement('div'); qualityControl.className = 'dl-quality-control';
        const qLabel = document.createElement('div'); qLabel.className = 'dl-quality-label';
        qLabel.innerHTML = `<span>WebP品質</span><span class="dl-quality-value">1.0 (最高画質)</span>`;
        const qInput = document.createElement('input');
        qInput.type = 'range'; qInput.className = 'dl-range-input';
        qInput.min = "0.4"; qInput.max = "1.0"; qInput.step = "0.05"; qInput.value = "1.0";
        qInput.oninput = (e) => {
            const val = parseFloat(e.target.value).toFixed(2);
            let text = val;
            if(parseFloat(val) >= 1.0) text = "1.0 (最高画質)";
            qLabel.querySelector('.dl-quality-value').textContent = text;
        };
        qualityControl.appendChild(qLabel);
        qualityControl.appendChild(qInput);
        footerLeft.appendChild(qualityControl);

        const footerRight = document.createElement('div'); footerRight.className = 'dl-modal-footer-right';
        const cancelBtn = document.createElement('button'); cancelBtn.className = 'dl-btn dl-btn-secondary'; cancelBtn.textContent = 'キャンセル'; cancelBtn.onclick = () => document.body.removeChild(overlay);
        const saveBtnModal = document.createElement('button'); saveBtnModal.className = 'dl-btn dl-btn-primary'; saveBtnModal.textContent = '保存開始';

        footerRight.appendChild(cancelBtn); footerRight.appendChild(saveBtnModal);
        footer.appendChild(footerLeft);
        footer.appendChild(footerRight);

        modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer); overlay.appendChild(modal); document.body.appendChild(overlay);

        const getAllCheckboxes = () => Array.from(channelContainer.querySelectorAll('input[type="checkbox"]'));
        selectAllBtn.onclick = () => { getAllCheckboxes().forEach(cb => { cb.checked = true; cb.indeterminate = false; }); };
        deselectAllBtn.onclick = () => { getAllCheckboxes().forEach(cb => { cb.checked = false; cb.indeterminate = false; }); };
        saveBtnModal.onclick = () => {
            const selectedIds = new Set(); channelContainer.querySelectorAll('.dl-channel-item input:checked').forEach(cb => { selectedIds.add(cb.value); });
            if (selectedIds.size === 0) { alert("保存するチャンネルが選択されていません。"); return; }
            const quality = parseFloat(qInput.value);
            document.body.removeChild(overlay);
            TaskQueue.add(
                () => processArchival(selectedIds, guildId, guildName, (msg, isBusy) => { updateBtnState(isBusy); if (msg) ProgressUI.show(msg); else ProgressUI.hide(); }, quality),
                () => {}, () => { updateBtnState(false); ProgressUI.hide(); }
            );
        };
    }

    function addHeaderSaveButton() {
        const headerSection = document.querySelector('section[aria-label="チャンネルのヘッダー"], section[aria-label="Channel Header"]');
        if (!headerSection) return;

        const toolbar = headerSection.querySelector('div[class*="toolbar"]');
        const fallbackToolbar = !toolbar ? Array.from(headerSection.querySelectorAll('div')).find(div => {
            return div.querySelector('[aria-label="通知設定"]') || div.querySelector('[aria-label="ピン留めされたメッセージ"]');
        })?.parentElement : null;

        const targetToolbar = toolbar || fallbackToolbar;

        if (!targetToolbar) return;
        if (targetToolbar.querySelector('.discord-header-save-btn')) return;

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "discord-header-save-btn discord-native-btn-wrapper";

        const existingIconWrapper = targetToolbar.querySelector('div[class*="iconWrapper"]');
        if (existingIconWrapper) {
             btnWrapper.className = `${existingIconWrapper.className} discord-header-save-btn`;
             btnWrapper.style.cursor = "pointer";
        } else {
             btnWrapper.style.display = "flex";
             btnWrapper.style.alignItems = "center";
             btnWrapper.style.margin = "0 8px";
        }

        const btn = document.createElement("div");
        btn.className = "discord-native-btn";
        btn.innerHTML = ICONS.DOWNLOAD;
        btn.title = "サーバーを保存";

        const svg = btn.querySelector('svg');
        if(svg) {
            const existingSvg = targetToolbar.querySelector('svg');
            if(existingSvg) {
                 svg.setAttribute('class', existingSvg.getAttribute('class'));
            } else {
                 svg.style.cssText = "width: 24px; height: 24px; color: var(--interactive-normal);";
            }
        }

        const updateBtnState = (isBusy) => {
            if (isBusy) {
                btn.innerHTML = `<div class="dl-spinner" style="width:20px;height:20px;border-width:2px;border-color:var(--text-normal) transparent transparent transparent;"></div>`;
                btnWrapper.style.pointerEvents = "none";
                btnWrapper.style.opacity = "0.5";
            } else {
                btn.innerHTML = ICONS.DOWNLOAD;
                const newSvg = btn.querySelector('svg');
                if(newSvg && svg) {
                     if(svg.getAttribute('class')) newSvg.setAttribute('class', svg.getAttribute('class'));
                     else newSvg.style.cssText = svg.style.cssText;
                }
                btnWrapper.style.pointerEvents = "auto";
                btnWrapper.style.opacity = "";
            }
        };

        btnWrapper.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const pathParts = location.pathname.split('/');
            const guildId = pathParts[2];

            let guildName = "Server";
            const guildNav = document.querySelector('nav[aria-label*="(サーバー)"], nav[aria-label*="(server)"]');
            if (guildNav) {
                const headerH2 = guildNav.querySelector('header h2');
                if (headerH2) guildName = headerH2.textContent;
            } else {
                 const titleEl = document.querySelector('h1[class*="title_"], h2[class*="title_"]');
                 if(titleEl) guildName = titleEl.textContent;
            }

            if (!guildId || guildId === '@me') { alert("サーバー内で実行してください。"); return; }
            showGuildSelectionModal(guildId, guildName, updateBtnState);
        };

        btnWrapper.appendChild(btn);

        const searchBar = targetToolbar.querySelector('div[class*="search_"]');
        if (searchBar) targetToolbar.insertBefore(btnWrapper, searchBar);
        else targetToolbar.insertBefore(btnWrapper, targetToolbar.firstChild);
    }

    function createBotSaveButton() {
        const btn = document.createElement("div"); btn.className = "bot-save-btn"; btn.innerHTML = ICONS.SAVE_MSG; btn.title = "アーカイブスレッドを保存";
        return btn;
    }

    function getFiber(node) {
        const key = Object.keys(node).find(key => key.startsWith("__reactFiber$"));
        return key ? node[key] : null;
    }

    function findMessageInFiber(fiber) {
        let curr = fiber;
        for(let i=0; i<20 && curr; i++) {
            const props = curr.memoizedProps || curr.pendingProps;
            if (props) {
                if (props.message && props.message.id) return props.message;
                if (props.children) {
                    const children = Array.isArray(props.children) ? props.children : [props.children];
                    for (const child of children) {
                        if (child && child.props && child.props.message) return child.props.message;
                    }
                }
            }
            curr = curr.return;
        }
        return null;
    }

    function extractThreadIdsForce(obj) { const ids = new Set(); let jsonStr = ""; try { jsonStr = JSON.stringify(obj, (key, value) => { if (key === 'author' || key === 'member' || key.startsWith('_')) return undefined; return value; }); } catch(e) { if(obj.embeds) jsonStr += JSON.stringify(obj.embeds); if(obj.content) jsonStr += obj.content; } const reMention = /<#(\d{17,20})>/g; let m; while((m = reMention.exec(jsonStr)) !== null) ids.add(m[1]); const reUrl = /channels\/\d+\/(\d{17,20})/g; while((m = reUrl.exec(jsonStr)) !== null) ids.add(m[1]); return Array.from(ids); }

    async function verifyAndFetchThreads(threadIds, btn, embedTitle) {
        const updateBtnState = (isBusy) => { if (isBusy) { btn.innerHTML = `<div class="dl-spinner" style="width:12px;height:12px;"></div>`; btn.style.pointerEvents = "none"; } else { btn.innerHTML = ICONS.SAVE_MSG; btn.style.pointerEvents = "auto"; } };
        updateBtnState(true);
        const channelsData = []; const guildId = location.pathname.split('/')[2];
        for (const tid of threadIds) {
            try {
                const info = await apiCall(`${API_BASE}/channels/${tid}`);
                if (info && [10, 11, 12, 15, 16].includes(info.type)) { // Thread or Forum/Media
                    let parentName = embedTitle || "Archived";
                    if(info.parent_id) { try { const p = await apiCall(`${API_BASE}/channels/${info.parent_id}`); if(p) parentName = p.name; } catch(e){} }
                    channelsData.push({ ...info, isThread: true, parentName: parentName, grandParentName: null, isSelected: true });
                }
            } catch(e) { console.warn("Thread lookup failed", tid); }
        }
        if (channelsData.length === 0) { alert("有効なスレッドが見つかりませんでした。"); updateBtnState(false); return; }
        // Botからの単発保存時はデフォルト最高画質とする
        TaskQueue.add(
            () => processArchival(channelsData, guildId, embedTitle || "Archived_Threads", (msg, isBusy) => { if (msg) ProgressUI.show(msg); else ProgressUI.hide(); }, 1.0),
            () => {}, () => { updateBtnState(false); ProgressUI.hide(); }
        );
    }

    function scanForBotMessages() {
        const messages = document.querySelectorAll("li[id^='chat-messages-']");
        messages.forEach(msg => {
            if (msg.querySelector(".bot-save-btn")) return;
            const avatarImg = msg.querySelector("img[src*='/avatars/']");
            if (!avatarImg) return;
            const src = avatarImg.src;
            const isTargetBot = TARGET_BOTS.some(id => src.includes(id));
            if (isTargetBot) {
                const timestamp = msg.querySelector("time");
                if (timestamp && timestamp.parentNode) {
                    const btn = createBotSaveButton();
                    btn.onclick = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        const fiber = getFiber(msg);
                        if (fiber) {
                            const rawData = findMessageInFiber(fiber);
                            let domTitle = null;
                            const embedTitle = msg.querySelector('div[class*="embedTitle"]');
                            const embedAuthor = msg.querySelector('div[class*="embedAuthor"]');
                            if (embedTitle) domTitle = embedTitle.textContent.trim();
                            else if (embedAuthor) domTitle = embedAuthor.textContent.trim();

                            if (rawData) { const tIds = extractThreadIdsForce(rawData); if(tIds.length > 0) verifyAndFetchThreads(tIds, btn, domTitle); else alert("スレッドIDが見つかりませんでした。"); } else alert("内部データの特定に失敗しました。");
                        } else alert("React Fiberが見つかりません。");
                    };
                    timestamp.parentNode.appendChild(btn);
                }
            }
        });
    }

    let observerTimer = null;
    const observer = new MutationObserver(() => {
        if (observerTimer) return;
        observerTimer = setTimeout(() => { addHeaderSaveButton(); scanForBotMessages(); observerTimer = null; }, CONFIG.OBSERVER_THROTTLE);
    });

    // 初期化待機
    setTimeout(() => {
        addHeaderSaveButton();
        scanForBotMessages();
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("Discord HTML Exporter v4.1 initialized.");
    }, 3000);
})();