// ==UserScript==
// @name         Smart Chat (Bonk.io)
// @namespace    https://greasyfork.org/users/1552147-ansonii-crypto
// @version      0.0.8
// @description  Timestamps, mention highlighting, anti-spam, filters, inline image previews (click-to-zoom), revealable hidden messages, Bonk Mod Settings Core UI, and Discord-like :emoji_name: input replacement + picker (grid, categories, recents, pinned).
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/560458/Smart%20Chat%20%28Bonkio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560458/Smart%20Chat%20%28Bonkio%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY_PREFIX_V2 = 'bonk_smartchat_config_v2_';
    const STORAGE_KEY_PREFIX_V1 = 'bonk_smartchat_config_v1_';

    const DEFAULT_CONFIG = {
        enabled: true,
        showTimestamps: true,
        timestamp24h: true,
        highlightMentions: true,
        mentionKeywords: [],
        antiSpamEnabled: true,
        antiSpamDelayMs: 900,
        hideSystemMessages: false,
        wordBlacklist: [],
        mutedNames: [],
        highlightColor: '#00c8ff',

        emojiEnabled: true,
        emojiPickerEnabled: true,
        emojiReplaceOnType: true,

        emojiGridMode: false,
        emojiShowCategories: true,
        emojiRecentEnabled: true
    };

    function normalize(str) {
        return String(str || '').toLowerCase();
    }

    function normalizeEmojiName(name) {
        return String(name || '')
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    const EMOJI_SHORTCODES = (() => {
        const entries = [
            ['grinning', '😀'], ['smiley', '😃'], ['smile', '😄'], ['grin', '😁'],
            ['laughing', '😆'], ['sweat smile', '😅'], ['joy', '😂'], ['rofl', '🤣'],
            ['relaxed', '☺️'], ['blush', '😊'], ['innocent', '😇'], ['wink', '😉'],
            ['slight smile', '🙂'], ['upside down', '🙃'], ['heart eyes', '😍'],
            ['kissing heart', '😘'], ['kissing', '😗'], ['kissing smile', '😙'],
            ['kissing closed eyes', '😚'], ['yum', '😋'], ['stuck out tongue', '😛'],
            ['stuck out tongue wink', '😜'], ['stuck out tongue closed eyes', '😝'],
            ['sunglasses', '😎'], ['thinking', '🤔'], ['neutral face', '😐'],
            ['expressionless', '😑'], ['no mouth', '😶'], ['smirk', '😏'],
            ['unamused', '😒'], ['roll eyes', '🙄'], ['grimacing', '😬'],
            ['lying face', '🤥'], ['relieved', '😌'], ['pensive', '😔'],
            ['sleepy', '😪'], ['drooling face', '🤤'], ['sleeping', '😴'],
            ['mask', '😷'], ['facepalm', '🤦'], ['shrug', '🤷'],
            ['disappointed', '😞'], ['worried', '😟'], ['cry', '😢'],
            ['sob', '😭'], ['angry', '😠'], ['rage', '😡'], ['triumph', '😤'],
            ['confounded', '😖'], ['persevere', '😣'], ['fearful', '😨'],
            ['cold sweat', '😰'], ['scream', '😱'], ['flushed', '😳'],
            ['zany face', '🤪'], ['dizzy face', '😵'], ['exploding head', '🤯'],
            ['poop', '💩'], ['clown', '🤡'], ['skull', '💀'], ['ghost', '👻'],
            ['robot', '🤖'], ['alien', '👽'],
            ['thumbs up', '👍'], ['thumbsup', '👍'], ['thumbs down', '👎'], ['thumbsdown', '👎'],
            ['ok hand', '👌'], ['clap', '👏'], ['pray', '🙏'], ['muscle', '💪'],
            ['wave', '👋'], ['v', '✌️'], ['raised hands', '🙌'], ['point right', '👉'],
            ['point left', '👈'], ['point up', '☝️'], ['point down', '👇'],
            ['heart', '❤️'], ['blue heart', '💙'], ['green heart', '💚'],
            ['yellow heart', '💛'], ['purple heart', '💜'], ['black heart', '🖤'],
            ['broken heart', '💔'], ['sparkling heart', '💖'], ['two hearts', '💕'],
            ['fire', '🔥'], ['sparkles', '✨'], ['star', '⭐'], ['boom', '💥'],
            ['100', '💯'], ['check', '✅'], ['x', '❌'], ['warning', '⚠️'],
            ['question', '❓'], ['exclamation', '❗'], ['rocket', '🚀'],
            ['eyes', '👀'], ['sweat', '💦'], ['zzz', '💤'], ['crown', '👑'],
            ['tada', '🎉'], ['confetti ball', '🎊'], ['gift', '🎁'],
            ['skull and crossbones', '☠️'],
            ['cat', '🐱'], ['dog', '🐶'], ['mouse', '🐭'], ['panda face', '🐼'],
            ['monkey', '🐵'], ['frog', '🐸'], ['unicorn', '🦄'],
            ['pizza', '🍕'], ['burger', '🍔'], ['fries', '🍟'],
            ['coffee', '☕'], ['tea', '🍵'], ['cake', '🍰'],
            ['weary', '😩'], ['tired face', '😫'], ['astonished', '😲'],
            ['frowning', '😦'], ['frowning face', '☹️'],
            ['open mouth', '😮'], ['hushed', '😯'], ['zipper mouth', '🤐'],
            ['nauseated face', '🤢'], ['vomiting face', '🤮'],
            ['sneezing face', '🤧'], ['money mouth', '🤑'],
            ['nerd', '🤓'], ['cowboy', '🤠'], ['pleading face', '🥺'],
            ['raised eyebrow', '🤨']
        ];

        const map = Object.create(null);
        for (const [name, emoji] of entries) map[normalizeEmojiName(name)] = emoji;
        return map;
    })();

    const EMOJI_ALL = Object.keys(EMOJI_SHORTCODES).map(name => ({
        name,
        emoji: EMOJI_SHORTCODES[name]
    }));

    const EMOJI_CATEGORIES = [
        { id: 'recent', label: '⏱️ Recent' },
        { id: 'smileys', label: '🙂 Smileys' },
        { id: 'hearts', label: '❤️ Hearts' },
        { id: 'hands', label: '✋ Hands' },
        { id: 'symbols', label: '✅ Symbols' },
        { id: 'food', label: '🍕 Food' },
        { id: 'animals', label: '🐱 Animals' }
    ];

    function categorizeEmoji(nameKey, emoji) {
        const n = nameKey;

        if (emoji === '❤️' || n.includes('heart')) return 'hearts';

        if (
            n.includes('thumb') || n.includes('clap') || n.includes('pray') || n.includes('muscle') ||
            n.includes('wave') || n === 'v' || n.includes('raised hands') || n.includes('point')
        ) return 'hands';

        if (
            n.includes('check') || n === 'x' || n.includes('warning') || n.includes('question') ||
            n.includes('exclamation') || n.includes('100') || n.includes('boom') || n.includes('sparkles') ||
            n.includes('star') || n.includes('rocket')
        ) return 'symbols';

        if (n.includes('pizza') || n.includes('burger') || n.includes('fries') || n.includes('coffee') || n.includes('tea') || n.includes('cake'))
            return 'food';

        if (n.includes('cat') || n.includes('dog') || n.includes('mouse') || n.includes('panda') || n.includes('monkey') || n.includes('frog') || n.includes('unicorn'))
            return 'animals';

        return 'smileys';
    }

    let storageKey = null;
    let config = { ...DEFAULT_CONFIG };

    let lastSendTime = 0;
    let myName = null;

    let imgPreviewBackdrop = null;
    let imgPreviewImg = null;
    let imgPreviewCaption = null;

    const emojiUiState = new WeakMap();

    let smartChatSettingsContainer = null;
    let smartChatRenderSettings = null;

    function isLoggedInAccount() {
        const lvlEl = document.getElementById('pretty_top_level');
        if (!lvlEl) return false;

        const lvlText = (lvlEl.textContent || '').trim().toLowerCase();
        if (!lvlText || lvlText === 'guest') return false;

        const nameEl = document.getElementById('pretty_top_name');
        const name = (nameEl ? nameEl.textContent : '').trim();
        return !!name;
    }

    function getAccountNameFromPrettyTopOrNull() {
        if (!isLoggedInAccount()) return null;
        const el = document.getElementById('pretty_top_name');
        const name = (el ? el.textContent : '').trim();
        if (!name) return null;
        return name.toLowerCase();
    }

    function getStorageKeyV2() {
        const acct = getAccountNameFromPrettyTopOrNull();
        if (!acct) return null;
        return STORAGE_KEY_PREFIX_V2 + acct;
    }

    function guessOldV1StorageKeys() {
        const keys = new Set();

        const prettyName = document.querySelector('#pretty_top_name');
        if (prettyName && prettyName.textContent.trim()) {
            keys.add(STORAGE_KEY_PREFIX_V1 + encodeURIComponent(prettyName.textContent.trim()));
        }

        const nameInput = document.querySelector('#newbonklobby_name_input');
        if (nameInput && nameInput.value && nameInput.value.trim()) {
            keys.add(STORAGE_KEY_PREFIX_V1 + encodeURIComponent(nameInput.value.trim()));
        }

        const stored = localStorage.getItem('bonk_name');
        if (stored && stored.trim()) keys.add(STORAGE_KEY_PREFIX_V1 + encodeURIComponent(stored.trim()));

        keys.add(STORAGE_KEY_PREFIX_V1 + 'default');
        return Array.from(keys);
    }

    function migrateV1ToV2IfNeeded() {
        try {
            if (!storageKey) return;
            const v2Raw = localStorage.getItem(storageKey);
            if (v2Raw) return;

            for (const k of guessOldV1StorageKeys()) {
                const raw = localStorage.getItem(k);
                if (raw) {
                    localStorage.setItem(storageKey, raw);
                    return;
                }
            }
        } catch {}
    }

    function loadConfig() {
        try {
            if (!storageKey) return { ...DEFAULT_CONFIG };
            const raw = localStorage.getItem(storageKey);
            if (!raw) return { ...DEFAULT_CONFIG };
            const parsed = JSON.parse(raw);
            return { ...DEFAULT_CONFIG, ...parsed };
        } catch {
            return { ...DEFAULT_CONFIG };
        }
    }

    function saveConfig() {
        try {
            if (!storageKey) return;
            localStorage.setItem(storageKey, JSON.stringify(config));
        } catch {}
    }

    function hexToRgb(hex) {
        if (!hex) return null;
        let s = hex.trim();
        if (s[0] === '#') s = s.slice(1);
        if (s.length === 3) s = s.split('').map(c => c + c).join('');
        if (s.length !== 6) return null;
        const r = parseInt(s.slice(0, 2), 16);
        const g = parseInt(s.slice(2, 4), 16);
        const b = parseInt(s.slice(4, 6), 16);
        if ([r, g, b].some(v => Number.isNaN(v))) return null;
        return { r, g, b };
    }

    function applyHighlightColorFromConfig() {
        const color = config.highlightColor || '#00c8ff';
        const rgb = hexToRgb(color) || { r: 0, g: 200, b: 255 };
        const bg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`;
        const root = document.documentElement;
        root.style.setProperty('--smartchat-highlight-color', color);
        root.style.setProperty('--smartchat-highlight-bg', bg);
    }

    function makeTimestamp() {
        const d = new Date();
        if (config.timestamp24h) {
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        }
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function containsAny(haystack, list) {
        const norm = normalize(haystack);
        return list.some(word => norm.includes(normalize(word)));
    }

    function waitForElement(selector, timeoutMs = 15000) {
        return new Promise(resolve => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeoutMs);
        });
    }

    function extractFileNameFromUrl(url) {
        try {
            const noQuery = url.split('#')[0].split('?')[0];
            const parts = noQuery.split('/');
            return parts[parts.length - 1] || 'image';
        } catch {
            return 'image';
        }
    }

    function tryDetectMyName(ensureKeyword = false) {
        try {
            const prettyName = document.querySelector('#pretty_top_name');
            const detected = prettyName && prettyName.textContent.trim() ? prettyName.textContent.trim() : null;
            if (!detected) return;

            myName = detected;

            if (ensureKeyword && storageKey) {
                const alreadyHas = (config.mentionKeywords || []).some(k => normalize(k) === normalize(detected));
                if (!alreadyHas) {
                    config.mentionKeywords.push(detected);
                    saveConfig();
                }
            }
        } catch {}
    }

    function updateAccountKeyFromPrettyTop() {
        const newKey = getStorageKeyV2();
        if (newKey === storageKey) return;

        storageKey = newKey;

        if (!storageKey) {
            config = { ...DEFAULT_CONFIG };
            myName = null;
            applyHighlightColorFromConfig();
            if (typeof smartChatRenderSettings === 'function') smartChatRenderSettings();
            return;
        }

        migrateV1ToV2IfNeeded();
        config = loadConfig();
        applyHighlightColorFromConfig();
        tryDetectMyName(true);

        if (typeof smartChatRenderSettings === 'function') smartChatRenderSettings();
    }

    function getEmojiRecentStorageKey() {
        return (storageKey ? storageKey : 'bonk_smartchat_guest') + '_emoji_recent_v1';
    }

    function loadRecentEmojis() {
        try {
            if (!config.emojiRecentEnabled) return [];
            const raw = localStorage.getItem(getEmojiRecentStorageKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr.filter(x => typeof x === 'string').slice(0, 40) : [];
        } catch {
            return [];
        }
    }

    function saveRecentEmojis(list) {
        try {
            if (!config.emojiRecentEnabled) return;
            localStorage.setItem(getEmojiRecentStorageKey(), JSON.stringify(list.slice(0, 40)));
        } catch {}
    }

    function recordRecentEmoji(emoji) {
        if (!config.emojiRecentEnabled || !emoji) return;
        const list = loadRecentEmojis();
        const next = [emoji, ...list.filter(e => e !== emoji)].slice(0, 40);
        saveRecentEmojis(next);
    }

    function injectStyles() {
		const css = `
			:root {
				--smartchat-highlight-color:#00c8ff;
				--smartchat-highlight-bg:rgba(0,200,255,.12);

				--sc-font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

				--sc-text: rgba(0,0,0,.92);
				--sc-text-dim: rgba(0,0,0,.70);
				--sc-text-dimmer: rgba(0,0,0,.55);

				--sc-shadow: 0 18px 50px rgba(0,0,0,.55);
				--sc-accent: rgba(0,150,136,.85);

				--sc-light-text: rgba(0,0,0,.85);
				--sc-light-text-dim: rgba(0,0,0,.60);
			}

			.smartchat-msg { border-left:2px solid transparent; padding-left:6px; margin:1px 0; border-radius:6px; }
			.smartchat-timestamp { font-size:10px; opacity:.65; margin-right:6px; display:inline-block; font-variant-numeric: tabular-nums; }
			.smartchat-mention { background:var(--smartchat-highlight-bg); border-left-color:var(--smartchat-highlight-color); box-shadow: inset 0 0 0 1px rgba(255,255,255,.05); }
			.smartchat-muted { display:none !important; }

			.smartchat-antispam-flash { animation: smartchat-flash .35s ease-out; }
			@keyframes smartchat-flash { 0% { box-shadow:0 0 0 0 rgba(255,0,0,.70); } 100% { box-shadow:0 0 0 5px rgba(255,0,0,0); } }

			.smartchat-hidden-wrapper {
				font-size:11px; opacity:.95;
				padding:6px 8px; border-radius:8px;
				background: rgba(255,255,255,.06);
				border:1px solid rgba(255,255,255,.10);
			}
			.smartchat-hidden-label { opacity:.8; }
			.smartchat-hidden-toggle {
				cursor:pointer; margin-left:6px; text-decoration:none;
				color: rgba(255,255,255,.85);
				border-bottom: 1px dashed rgba(255,255,255,.35);
			}
			.smartchat-hidden-toggle:hover { color: rgba(255,255,255,.95); border-bottom-color: rgba(255,255,255,.6); }
			.smartchat-hidden-content { margin-top:6px; opacity:.95; }

			.smartchat-body { white-space: pre-wrap; }
			#ingamechatcontent .smartchat-body { color:#ffffff; }

			.smartchat-img-wrapper { display:block; margin-top:4px; }
			.smartchat-img-alt { display:block; font-size:11px; opacity:.75; margin-bottom:3px; font-family: var(--sc-font); }

			.smartchat-inline-img {
				display:block; max-width:140px; max-height:140px; cursor:pointer;
				border-radius:8px; box-shadow:0 8px 20px rgba(0,0,0,.35);
				outline:1px solid rgba(255,255,255,.10);
				transition: transform .12s ease, outline-color .12s ease, filter .12s ease;
			}
			.smartchat-inline-img:hover { transform: translateY(-1px); outline-color: rgba(255,255,255,.20); filter: brightness(1.03); }
			#ingamechatcontent .smartchat-inline-img { max-width:90px; max-height:56px; }
			.smartchat-row { margin-bottom:8px; }
			.smartchat-toggle-label {
				display:flex; align-items:center; gap:10px; cursor:pointer;
				font-size:12px; user-select:none; font-family: var(--sc-font);
				color: var(--sc-text);
			}
			.smartchat-toggle-input { display:none; }
			.smartchat-toggle-switch {
				position:relative; width:34px; height:18px; border-radius:999px;
				background: rgba(255,255,255,.10);
				box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
				transition: background .15s ease-out, box-shadow .15s ease-out;
				flex: 0 0 auto;
			}
			.smartchat-toggle-knob {
				position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%;
				background: rgba(255,255,255,.92);
				box-shadow: 0 3px 10px rgba(0,0,0,.35);
				transition: transform .15s ease-out;
			}
			.smartchat-toggle-input:checked + .smartchat-toggle-switch {
				background: var(--sc-accent);
				box-shadow: inset 0 0 0 1px rgba(0,0,0,.20);
			}
			.smartchat-toggle-input:checked + .smartchat-toggle-switch .smartchat-toggle-knob { transform: translateX(16px); }

			.smartchat-tag-label {
				font-size:11px; margin-bottom:4px; font-family: var(--sc-font);
				color: var(--sc-text-dim);
			}
			.smartchat-tag-input {
				display:flex; flex-wrap:wrap; gap:6px; padding:7px 8px; min-height:30px;
				background: rgba(255,255,255,.06);
				border-radius:10px; border:1px solid rgba(255,255,255,.12);
				box-shadow: inset 0 0 0 1px rgba(0,0,0,.15);
			}
			.smartchat-tag-list { display:flex; flex-wrap:wrap; gap:6px; }
			.smartchat-tag {
				display:inline-flex; align-items:center; gap:6px;
				padding:3px 10px; border-radius:999px;
				background: rgba(0,150,136,.85);
				color: rgba(0,0,0,.92);
				font-size:11px; font-weight:600;
				box-shadow: 0 6px 14px rgba(0,0,0,.25);
			}
			.smartchat-tag-remove { cursor:pointer; font-size:12px; opacity:.85; line-height:1; }
			.smartchat-tag-remove:hover { opacity:1; }
			.smartchat-tag-input-field {
				flex:1 1 90px; min-width:60px;
				border:none; outline:none; background: transparent;
				font-size:12px; color: var(--sc-text); font-family: var(--sc-font);
			}
			.smartchat-tag-input-field::placeholder { color: rgba(0,0,0,.45); }

			.smartchat-account-hint { margin-top:8px; font-size:11px; opacity:.75; font-family: var(--sc-font); color: var(--sc-text-dimmer); }
			.smartchat-guest-warning { margin-top:8px; font-size:11px; opacity:.92; font-family: var(--sc-font); color: rgba(255,204,102,.95); }

			#bonk_mods_settings_container .smartchat-toggle-label {
				color: var(--sc-light-text);
			}
			#bonk_mods_settings_container .smartchat-tag-label {
				color: var(--sc-light-text-dim);
			}
			#bonk_mods_settings_container .smartchat-account-hint {
				color: var(--sc-light-text-dim);
			}
			#bonk_mods_settings_container .smartchat-guest-warning {
				color: rgba(140,90,0,.92);
			}

			#bonk_mods_settings_container .smartchat-tag-input {
				background: rgba(255,255,255,.55);
				border: 1px solid rgba(0,0,0,.14);
				box-shadow: none;
			}
			#bonk_mods_settings_container .smartchat-tag-input-field {
				color: var(--sc-light-text);
			}
			#bonk_mods_settings_container .smartchat-tag-input-field::placeholder {
				color: rgba(0,0,0,.45);
			}
			#bonk_mods_settings_container .smartchat-tag {
				background: rgba(0,150,136,.88);
				color: rgba(255,255,255,.96);
				box-shadow: none;
			}

			#bonk_mods_settings_container .smartchat-toggle-switch {
				background: rgba(0,0,0,.08);
				box-shadow: inset 0 0 0 1px rgba(0,0,0,.16);
			}
			#bonk_mods_settings_container .smartchat-toggle-knob {
				background: rgba(255,255,255,.98);
				box-shadow: 0 1px 2px rgba(0,0,0,.22);
			}
			#bonk_mods_settings_container .smartchat-toggle-input:checked + .smartchat-toggle-switch {
				background: rgba(0,150,136,.95);
				box-shadow: inset 0 0 0 1px rgba(0,0,0,.12);
			}

			.smartchat-img-preview-backdrop {
				position:fixed; inset:0; background: rgba(0,0,0,.78);
				display:none; align-items:center; justify-content:center; z-index:99999;
				backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
			}
			.smartchat-img-preview-inner {
				max-width: min(92vw, 980px); max-height:90vh;
				display:flex; flex-direction:column; align-items:center; gap:10px;
				padding:12px; border-radius:14px;
				background: rgba(18,18,20,.65);
				border:1px solid rgba(255,255,255,.10);
				box-shadow: var(--sc-shadow);
			}
			.smartchat-img-preview-inner img {
				max-width:100%; max-height:78vh;
				border-radius:12px; box-shadow:0 18px 50px rgba(0,0,0,.65);
				outline:1px solid rgba(255,255,255,.12);
			}
			.smartchat-img-preview-caption {
				font-size:12px; color: rgba(255,255,255,.85); opacity:.95;
				font-family: var(--sc-font);
				max-width:80ch; text-align:center; word-break: break-word;
			}

			.smartchat-emoji-picker {
				position:fixed; z-index:100000;
				width: min(340px, 92vw);
				max-height: min(320px, 55vh);
				overflow:auto;
				background: linear-gradient(180deg, rgba(30,30,34,.94), rgba(18,18,20,.94));
				border:1px solid rgba(255,255,255,.14);
				border-radius:14px;
				box-shadow: var(--sc-shadow);
				padding:0;
				display:none;
				font-family: var(--sc-font);
				color: var(--sc-text);
				backdrop-filter: blur(8px);
				-webkit-backdrop-filter: blur(8px);
				overscroll-behavior: contain;

				opacity:0;
				transform: translateY(6px) scale(.98);
				transition: opacity .12s ease, transform .12s ease;
				will-change: opacity, transform;
				scrollbar-width: thin;
				scrollbar-color: rgba(255,255,255,.22) transparent;
			}
			.smartchat-emoji-picker.smartchat-open {
				opacity:1;
				transform: translateY(0) scale(1);
			}
			.smartchat-emoji-picker::-webkit-scrollbar { width:10px; }
			.smartchat-emoji-picker::-webkit-scrollbar-track { background: transparent; }
			.smartchat-emoji-picker::-webkit-scrollbar-thumb {
				background: rgba(255,255,255,.20);
				border-radius:999px;
				border:2px solid transparent;
				background-clip: padding-box;
			}
			.smartchat-emoji-picker::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.28); }

			.smartchat-emoji-header {
				position: sticky; top:0; z-index:2;
				padding: 10px 10px 10px 10px;
				background: rgba(18,18,20,.88);
				backdrop-filter: blur(8px);
				-webkit-backdrop-filter: blur(8px);
				border-bottom: 1px solid rgba(255,255,255,.10);
				border-top-left-radius: 14px;
				border-top-right-radius: 14px;
			}
			.smartchat-emoji-header-top { display:flex; align-items:center; justify-content:space-between; gap:10px; }
			.smartchat-emoji-title {
				font-size:11px; color: rgba(255,255,255,.70);
				white-space: nowrap; overflow:hidden; text-overflow: ellipsis;
			}
			.smartchat-emoji-actions { display:flex; gap:6px; flex: 0 0 auto; }
			.smartchat-emoji-chip {
				font-size:11px; padding:4px 8px; border-radius:999px;
				background: rgba(255,255,255,.07);
				border:1px solid rgba(255,255,255,.10);
				color: rgba(255,255,255,.85);
				cursor:pointer; user-select:none;
			}
			.smartchat-emoji-chip:hover { background: rgba(255,255,255,.10); }

			.smartchat-emoji-tabs { margin-top:10px; display:flex; gap:6px; flex-wrap: wrap; }
			.smartchat-emoji-tab {
				font-size:11px; padding:4px 8px; border-radius:999px;
				background: rgba(255,255,255,.06);
				border:1px solid rgba(255,255,255,.10);
				color: rgba(255,255,255,.78);
				cursor:pointer;
			}
			.smartchat-emoji-tab:hover { background: rgba(255,255,255,.09); }
			.smartchat-emoji-tab.smartchat-tab-active {
				background: rgba(0,150,136,.22);
				border-color: rgba(0,150,136,.35);
				color: rgba(255,255,255,.92);
			}

			.smartchat-emoji-list { padding: 8px; }

			.smartchat-emoji-item {
				display:flex; align-items:center; gap:10px;
				padding:8px 10px; border-radius:12px;
				cursor:pointer; user-select:none;
				font-size:13px; line-height:1.15;
				color: var(--sc-text);
				border:1px solid transparent;
				transition: background .12s ease, border-color .12s ease, transform .08s ease;
			}
			.smartchat-emoji-item:hover {
				background: rgba(255,255,255,.08);
				border-color: rgba(255,255,255,.10);
				transform: translateY(-1px);
			}
			.smartchat-emoji-item.smartchat-emoji-active {
				background: rgba(0,150,136,.22);
				border-color: rgba(0,150,136,.35);
				box-shadow: 0 10px 26px rgba(0,0,0,.28);
			}
			.smartchat-emoji-glyph {
				font-size:18px; width:26px; text-align:center;
				filter: drop-shadow(0 2px 6px rgba(0,0,0,.35));
			}
			.smartchat-emoji-name {
				opacity:.95; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
				font-variant-numeric: tabular-nums;
			}
			.smartchat-emoji-hint {
				opacity:.60; font-size:11px; margin-left:auto;
				padding:3px 8px; border-radius:999px;
				background: rgba(255,255,255,.07);
				border:1px solid rgba(255,255,255,.10);
			}

			.smartchat-emoji-list.smartchat-grid {
				display:grid;
				grid-template-columns: repeat(6, minmax(0, 1fr));
				gap:6px;
			}
			.smartchat-emoji-item.smartchat-grid-item {
				display:flex; flex-direction:column; align-items:center; justify-content:center;
				gap:4px; padding:10px 6px; text-align:center;
			}
			.smartchat-emoji-item.smartchat-grid-item .smartchat-emoji-name,
			.smartchat-emoji-item.smartchat-grid-item .smartchat-emoji-hint { display:none; }
			.smartchat-emoji-item.smartchat-grid-item .smartchat-emoji-glyph { width:auto; font-size:20px; }
		`;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function isSystemMessage(text) {
        const t = normalize(text);
        return (
            t.includes('joined the room') ||
            t.includes('left the room') ||
            t.includes("you\'re doing that too much") ||
            t.startsWith('server:') ||
            t.startsWith('[system]')
        );
    }

    function extractSenderName(msgEl) {
        const nameSpan = msgEl.querySelector('.ingamechatname');
        if (nameSpan) return nameSpan.textContent.replace(/:$/, '').trim();
        const text = msgEl.textContent || '';
        const idx = text.indexOf(':');
        if (idx > 0 && idx < 30) return text.slice(0, idx).trim();
        return null;
    }

    const BRACKET_IMG_RE = /\[(https?:\/\/[^\]\s]+?\.(?:png|jpe?g|gif|webp)[^\]]*)]/gi;

    function forceScrollBottom(scroller) {
        if (!scroller) return;
        try { scroller.scrollTop = scroller.scrollHeight; } catch {}
    }

    function getScrollContainerFrom(el) {
        let node = el;
        while (node && node !== document.body) {
            if (node.scrollHeight - node.clientHeight > 5) return node;
            node = node.parentElement;
        }
        return el;
    }

    function ensureImagePreviewOverlay() {
        if (imgPreviewBackdrop) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'smartchat-img-preview-backdrop';

        const inner = document.createElement('div');
        inner.className = 'smartchat-img-preview-inner';

        const img = document.createElement('img');
        const caption = document.createElement('div');
        caption.className = 'smartchat-img-preview-caption';

        inner.appendChild(img);
        inner.appendChild(caption);
        backdrop.appendChild(inner);
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', () => closeImagePreview());
        inner.addEventListener('click', e => e.stopPropagation());

        imgPreviewBackdrop = backdrop;
        imgPreviewImg = img;
        imgPreviewCaption = caption;

        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && imgPreviewBackdrop && imgPreviewBackdrop.style.display === 'flex') closeImagePreview();
        });
    }

    function openImagePreview(url, alt) {
        ensureImagePreviewOverlay();
        imgPreviewImg.src = url;
        imgPreviewCaption.textContent = alt || '';
        imgPreviewBackdrop.style.display = 'flex';
    }

    function closeImagePreview() {
        if (!imgPreviewBackdrop) return;
        imgPreviewBackdrop.style.display = 'none';
        imgPreviewImg.src = '';
        imgPreviewCaption.textContent = '';
    }

    function createImageBlock(url, alt, scroller) {
        const wrapper = document.createElement('div');
        wrapper.className = 'smartchat-img-wrapper';

        const altSpan = document.createElement('span');
        altSpan.className = 'smartchat-img-alt';
        altSpan.textContent = `[${alt}]`;

        const img = document.createElement('img');
        img.className = 'smartchat-inline-img';
        img.src = url;

        img.addEventListener('load', () => forceScrollBottom(scroller));
        img.addEventListener('click', e => {
            e.stopPropagation();
            openImagePreview(url, alt);
        });

        wrapper.appendChild(altSpan);
        wrapper.appendChild(img);
        return wrapper;
    }

    function ensureBodyContainer(msgEl) {
        let body = msgEl.querySelector('.smartchat-body');
        if (body) return body;

        const nameSpan = msgEl.querySelector('.ingamechatname');
        body = document.createElement('span');
        body.className = 'smartchat-body';

        if (nameSpan) {
            let sibling = nameSpan.nextSibling;
            while (sibling) {
                const next = sibling.nextSibling;
                body.appendChild(sibling);
                sibling = next;
            }
            msgEl.appendChild(body);
        } else {
            while (msgEl.firstChild) body.appendChild(msgEl.firstChild);
            msgEl.appendChild(body);
        }
        return body;
    }

    function getBodyTextWithoutName(msgEl) {
        const body = ensureBodyContainer(msgEl);
        let text = (body.textContent || '').trim();

        const lobbyNameSpan = msgEl.querySelector('.newbonklobby_chat_msg_name');
        if (lobbyNameSpan && lobbyNameSpan.textContent) {
            const nameText = lobbyNameSpan.textContent;
            const idx = text.indexOf(nameText);
            if (idx !== -1) text = (text.slice(0, idx) + text.slice(idx + nameText.length)).trim();
        }

        const tsMatch = text.match(/^\[\d{1,2}:\d{2}\]\s*/);
        if (tsMatch) text = text.slice(tsMatch[0].length);

        return text;
    }

    function processBracketImages(msgEl, scroller) {
        const body = ensureBodyContainer(msgEl);
        const text = body.textContent;
        if (!text || !BRACKET_IMG_RE.test(text)) return;
        BRACKET_IMG_RE.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = BRACKET_IMG_RE.exec(text))) {
            const idx = match.index;
            const url = match[1];

            if (idx > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, idx)));

            const alt = extractFileNameFromUrl(url);
            frag.appendChild(createImageBlock(url, alt, scroller));

            lastIndex = BRACKET_IMG_RE.lastIndex;
        }

        if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));

        body.textContent = '';
        body.appendChild(frag);
    }

    function hideMessageWithToggle(msgEl, reason) {
        if (msgEl._smartHiddenToggleApplied) return;
        msgEl._smartHiddenToggleApplied = true;

        const body = ensureBodyContainer(msgEl);
        const originalHTML = body.innerHTML;

        const labelTextMap = {
            system: 'System message hidden',
            blacklist: 'Message hidden (blacklisted word)',
            muted: 'Message hidden (muted user)',
            default: 'Message hidden'
        };
        const labelText = labelTextMap[reason] || labelTextMap.default;

        const wrapper = document.createElement('div');
        wrapper.className = 'smartchat-hidden-wrapper';

        const label = document.createElement('span');
        label.className = 'smartchat-hidden-label';
        label.textContent = labelText;

        const toggle = document.createElement('a');
        toggle.className = 'smartchat-hidden-toggle';
        toggle.textContent = '[reveal]';

        const content = document.createElement('div');
        content.className = 'smartchat-hidden-content';
        content.style.display = 'none';
        content.innerHTML = originalHTML;

        toggle.addEventListener('click', e => {
            e.preventDefault();
            const visible = content.style.display !== 'none';
            content.style.display = visible ? 'none' : '';
            toggle.textContent = visible ? '[reveal]' : '[hide]';
        });

        wrapper.appendChild(label);
        wrapper.appendChild(toggle);
        wrapper.appendChild(content);

        body.innerHTML = '';
        body.appendChild(wrapper);
    }

    function enhanceMessage(msgEl, scroller) {
        if (!config.enabled || !msgEl || msgEl._smartChatProcessed) return;
        msgEl._smartChatProcessed = true;

        msgEl.classList.add('smartchat-msg');

        const text = (msgEl.textContent || '').trim();
        if (!text) return;

        const sender = extractSenderName(msgEl);
        const isSelf = sender && myName && normalize(sender) === normalize(myName);

        if (config.hideSystemMessages && isSystemMessage(text)) {
            hideMessageWithToggle(msgEl, 'system');
            forceScrollBottom(scroller);
            return;
        }

        if (config.wordBlacklist && config.wordBlacklist.length) {
            if (!isSelf && containsAny(text, config.wordBlacklist)) {
                hideMessageWithToggle(msgEl, 'blacklist');
                forceScrollBottom(scroller);
                return;
            }
        }

        if (config.mutedNames && config.mutedNames.length) {
            if (!isSelf && sender && config.mutedNames.some(n => normalize(n) === normalize(sender))) {
                hideMessageWithToggle(msgEl, 'muted');
                forceScrollBottom(scroller);
                return;
            }
        }

        if (config.showTimestamps && !msgEl.querySelector('.smartchat-timestamp')) {
            const tsSpan = document.createElement('span');
            tsSpan.className = 'smartchat-timestamp';
            tsSpan.textContent = `[${makeTimestamp()}]`;
            msgEl.insertBefore(tsSpan, msgEl.firstChild);
        }

        if (config.highlightMentions && config.mentionKeywords && config.mentionKeywords.length) {
            const bodyText = getBodyTextWithoutName(msgEl);
            if (containsAny(bodyText, config.mentionKeywords)) msgEl.classList.add('smartchat-mention');
        }

        processBracketImages(msgEl, scroller);
        setTimeout(() => forceScrollBottom(scroller), 0);
    }

    function observeChatContainer(contentEl) {
        if (!contentEl || contentEl._smartChatObserverAttached) return;
        contentEl._smartChatObserverAttached = true;

        const scroller = getScrollContainerFrom(contentEl);
        Array.from(contentEl.children).forEach(el => enhanceMessage(el, scroller));

        const obs = new MutationObserver(mutations => {
            if (!config.enabled) return;
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === 1) enhanceMessage(node, scroller);
                }
            }
        });
        obs.observe(contentEl, { childList: true });
    }

    function getEmojiQueryAtCaret(input) {
        try {
            const v = input.value || '';
            const pos = input.selectionStart ?? v.length;

            if (pos > 0 && v[pos - 1] === ':') {
                const prevColon = v.lastIndexOf(':', pos - 2);
                if (prevColon !== -1) {
                    const between = v.slice(prevColon + 1, pos - 1);
                    if (between && /^[a-z0-9_ ]+$/i.test(between)) {
                        return null;
                    }
                }
            }

            const left = v.slice(0, pos);
            const lastColon = left.lastIndexOf(':');
            if (lastColon === -1) return null;

            const token = left.slice(lastColon + 1);
            if (token.includes(':')) return null;

            const beforeColon = left.slice(Math.max(0, lastColon - 6), lastColon + 1);
            if (/https?:\/:$/.test(beforeColon)) return null;

            if (/[\r\n]/.test(token)) return null;
            if (!/^[a-z0-9_ ]*$/i.test(token)) return null;

            return { start: lastColon, query: token };
        } catch {
            return null;
        }
    }

    function findEmojiMatches(queryRaw, limit = 20) {
        const q = normalizeEmojiName(queryRaw || '');
        if (!q) {
            const defaults = ['smile', 'joy', 'pensive', 'thinking', 'heart', 'thumbs up', 'fire', 'eyes', 'tada', '100'];
            return defaults
                .map(n => ({ name: n, emoji: EMOJI_SHORTCODES[normalizeEmojiName(n)] }))
                .filter(x => x.emoji)
                .slice(0, limit);
        }

        const out = [];
        for (const key in EMOJI_SHORTCODES) {
            if (key.includes(q)) {
                out.push({ name: key, emoji: EMOJI_SHORTCODES[key] });
                if (out.length >= limit) break;
            }
        }
        return out;
    }

    function buildMatchesForPicker(queryRaw, categoryId) {
        const q = normalizeEmojiName(queryRaw || '');

        if (categoryId === 'recent') {
            const recents = loadRecentEmojis();
            const reverseLookup = Object.create(null);
            for (const nameKey of Object.keys(EMOJI_SHORTCODES)) {
                reverseLookup[EMOJI_SHORTCODES[nameKey]] = nameKey;
            }

            const recentMatches = recents
            .map(e => {
                const nameKey = reverseLookup[e] || '';
                return nameKey ? { name: nameKey, emoji: e } : null;
            })
            .filter(Boolean);

            if (!q) {
                if (recentMatches.length) return recentMatches.slice(0, 60);
                return EMOJI_ALL.filter(m => categorizeEmoji(m.name, m.emoji) === 'smileys').slice(0, 80);
            }

            const filtered = recentMatches.filter(m => m.name.includes(q)).slice(0, 60);
            if (filtered.length) return filtered;

            return EMOJI_ALL.filter(m => m.name.includes(q)).slice(0, 80);
        }

        if (!q) {
            return EMOJI_ALL
                .filter(m => categorizeEmoji(m.name, m.emoji) === categoryId)
                .slice(0, 120);
        }

        return EMOJI_ALL
            .filter(m => m.name.includes(q))
            .filter(m => categorizeEmoji(m.name, m.emoji) === categoryId)
            .slice(0, 80);
    }

    function closeEmojiPicker(input) {
        const st = emojiUiState.get(input);
        if (!st) return;
        st.open = false;
        st.matches = [];
        st.activeIndex = 0;
        st.tokenStart = -1;
        st.lastQuery = '';
        if (st.pickerEl) {
            st.pickerEl.classList.remove('smartchat-open');
            st.pickerEl.style.display = 'none';
        }
    }

    function ensureEmojiPicker(input) {
        let st = emojiUiState.get(input);
        if (st && st.pickerEl) return st;

        const picker = document.createElement('div');
        picker.className = 'smartchat-emoji-picker';
        document.body.appendChild(picker);

        st = {
            pickerEl: picker,
            open: false,
            matches: [],
            activeIndex: 0,
            tokenStart: -1,
            lastQuery: '',
            activeCategory: (loadRecentEmojis().length ? 'recent' : 'smileys'),
            listEl: null
        };
        emojiUiState.set(input, st);

        picker.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, true);

        picker.addEventListener('click', (e) => {
            e.stopPropagation();
        }, true);

        picker.addEventListener('wheel', (e) => {
            const atTop = picker.scrollTop <= 0;
            const atBottom = picker.scrollTop + picker.clientHeight >= picker.scrollHeight - 1;
            const goingUp = e.deltaY < 0;
            const goingDown = e.deltaY > 0;

            if ((atTop && goingUp) || (atBottom && goingDown)) {
                e.preventDefault();
            }
            e.stopPropagation();
        }, { passive: false });

        const onDocPointerDown = (e) => {
            if (!st.open) return;
            if (st.pickerEl && (st.pickerEl === e.target || st.pickerEl.contains(e.target))) return;
            if (e.target === input || input.contains(e.target)) return;
            closeEmojiPicker(input);
        };
        document.addEventListener('pointerdown', onDocPointerDown, true);

        window.addEventListener('scroll', () => {
            const st2 = emojiUiState.get(input);
            if (st2 && st2.open && st2.pickerEl) positionEmojiPicker(input, st2.pickerEl);
        }, true);

        window.addEventListener('resize', () => {
            const st2 = emojiUiState.get(input);
            if (st2 && st2.open && st2.pickerEl) positionEmojiPicker(input, st2.pickerEl);
        }, true);

        return st;
    }

    function positionEmojiPicker(input, pickerEl) {
        const r = input.getBoundingClientRect();
        const margin = 8;

        const prevDisplay = pickerEl.style.display;
        pickerEl.style.display = 'block';

        const pickerRect = pickerEl.getBoundingClientRect();
        const pickerH = pickerRect.height || pickerEl.offsetHeight || 0;
        const pickerW = pickerRect.width || pickerEl.offsetWidth || 180;

        let top = r.top - margin - pickerH;
        if (top < 6) top = r.bottom + margin;

        const maxTop = window.innerHeight - 6 - pickerH;
        if (top > maxTop) top = Math.max(6, maxTop);

        let left = r.left;
        if (left + pickerW > window.innerWidth - 6) left = window.innerWidth - 6 - pickerW;
        if (left < 6) left = 6;

        pickerEl.style.top = `${Math.round(top)}px`;
        pickerEl.style.left = `${Math.round(left)}px`;

        pickerEl.style.display = prevDisplay || 'block';
    }

    function scrollEmojiActiveIntoView(input) {
        const st = emojiUiState.get(input);
        if (!st || !st.open || !st.pickerEl) return;

        const picker = st.pickerEl;
        const list = st.listEl || picker.querySelector('.smartchat-emoji-list');
        if (!list) return;

        const items = list.querySelectorAll('.smartchat-emoji-item');
        const active = items[st.activeIndex];
        if (!active) return;

        const header = picker.querySelector('.smartchat-emoji-header');
        const headerH = header ? header.getBoundingClientRect().height : 0;

        const pickerRect = picker.getBoundingClientRect();
        const activeRect = active.getBoundingClientRect();

        const topVisible = pickerRect.top + headerH + 6;
        const bottomVisible = pickerRect.bottom - 6;

        if (activeRect.top < topVisible) {
            const delta = topVisible - activeRect.top;
            picker.scrollTop -= delta;
            return;
        }

        if (activeRect.bottom > bottomVisible) {
            const delta = activeRect.bottom - bottomVisible;
            picker.scrollTop += delta;
        }
    }

    function renderEmojiPicker(input) {
        const st = ensureEmojiPicker(input);
        const picker = st.pickerEl;

        picker.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'smartchat-emoji-header';

        const topRow = document.createElement('div');
        topRow.className = 'smartchat-emoji-header-top';

        const title = document.createElement('div');
        title.className = 'smartchat-emoji-title';
        const qShown = (st.lastQuery || '').trim();
        title.textContent = qShown ? `Emoji — "${qShown}" (Enter to insert)` : 'Emoji — type :name (Enter to insert)';

        const actions = document.createElement('div');
        actions.className = 'smartchat-emoji-actions';

        const gridBtn = document.createElement('div');
        gridBtn.className = 'smartchat-emoji-chip';
        gridBtn.textContent = config.emojiGridMode ? 'Grid ✓' : 'Grid';
        gridBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            config.emojiGridMode = !config.emojiGridMode;
            saveConfig();
            renderEmojiPicker(input);
        });

        actions.appendChild(gridBtn);

        topRow.appendChild(title);
        topRow.appendChild(actions);
        header.appendChild(topRow);

        if (config.emojiShowCategories) {
            const tabs = document.createElement('div');
            tabs.className = 'smartchat-emoji-tabs';

            EMOJI_CATEGORIES.forEach(cat => {
                const tab = document.createElement('div');
                tab.className = 'smartchat-emoji-tab' + (st.activeCategory === cat.id ? ' smartchat-tab-active' : '');
                tab.textContent = cat.label;

                tab.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const st = ensureEmojiPicker(input);
                    st.activeCategory = cat.id;
                    st.activeIndex = 0;

                    const q = getEmojiQueryAtCaret(input);
                    const query = q ? q.query : '';

                    st.lastQuery = query;
                    st.matches = buildMatchesForPicker(query, st.activeCategory);

                    st.open = true;
                    st.pickerEl.style.display = 'block';
                    st.pickerEl.classList.add('smartchat-open');

                    renderEmojiPicker(input);
                    scrollEmojiActiveIntoView(input);
                    positionEmojiPicker(input, st.pickerEl);
                }, true);

                tabs.appendChild(tab);
            });

            header.appendChild(tabs);
        }

        picker.appendChild(header);

        const list = document.createElement('div');
        list.className = 'smartchat-emoji-list' + (config.emojiGridMode ? ' smartchat-grid' : '');
        st.listEl = list;
        picker.appendChild(list);

        const matches = st.matches || [];
        matches.forEach((m, idx) => {
            const row = document.createElement('div');
            const isActive = idx === st.activeIndex;

            row.className =
                'smartchat-emoji-item' +
                (isActive ? ' smartchat-emoji-active' : '') +
                (config.emojiGridMode ? ' smartchat-grid-item' : '');

            const glyph = document.createElement('div');
            glyph.className = 'smartchat-emoji-glyph';
            glyph.textContent = m.emoji;

            const name = document.createElement('div');
            name.className = 'smartchat-emoji-name';
            name.textContent = `:${m.name.replace(/ /g, '_')}:`;

            const hint = document.createElement('div');
            hint.className = 'smartchat-emoji-hint';
            hint.textContent = 'Enter';

            row.appendChild(glyph);
            if (!config.emojiGridMode) {
                row.appendChild(name);
                row.appendChild(hint);
            }

            row.addEventListener('mouseenter', () => {
                st.activeIndex = idx;
                renderEmojiPicker(input);
                scrollEmojiActiveIntoView(input);
                positionEmojiPicker(input, st.pickerEl);
            });

            row.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                insertEmojiForCurrentToken(input, m.emoji);
            }, true);

            list.appendChild(row);
        });

        if (st && st.open && st.pickerEl) positionEmojiPicker(input, st.pickerEl);
    }

    function openEmojiPicker(input, matches, tokenStart, query) {
        const st = ensureEmojiPicker(input);
        st.matches = matches;
        st.activeIndex = 0;
        st.open = true;
        st.tokenStart = tokenStart;
        st.lastQuery = query;

        st.pickerEl.style.display = matches.length ? 'block' : 'none';
        if (!matches.length) {
            st.pickerEl.classList.remove('smartchat-open');
            return;
        }

        st.pickerEl.classList.add('smartchat-open');
        renderEmojiPicker(input);
        scrollEmojiActiveIntoView(input);
        positionEmojiPicker(input, st.pickerEl);
    }

    function insertEmojiForCurrentToken(input, emoji) {
        const st = ensureEmojiPicker(input);
        const v = input.value || '';
        const pos = input.selectionStart ?? v.length;

        const start = st.tokenStart >= 0 ? st.tokenStart : (() => {
            const q = getEmojiQueryAtCaret(input);
            return q ? q.start : -1;
        })();
        if (start < 0) return;

        let end = pos;
        if (v[end] === ':') end += 1;

        const before = v.slice(0, start);
        const after = v.slice(end);

        const needsSpace = after.length && !/^\s/.test(after) ? ' ' : '';
        input.value = before + emoji + needsSpace + after;

        const newPos = (before + emoji + needsSpace).length;
        try { input.setSelectionRange(newPos, newPos); } catch {}

        input.dispatchEvent(new Event('input', { bubbles: true }));

        recordRecentEmoji(emoji);
        closeEmojiPicker(input);
    }

    function replaceCompletedEmojiShortcodes(input) {
        const v = input.value || '';
        const re = /:([a-z0-9_ ]+):/gi;

        const caret = input.selectionStart ?? v.length;
        let changed = false;
        let deltaBeforeCaret = 0;

        const out = v.replace(re, (full, name, offset) => {
            const key = normalizeEmojiName(name);
            const emoji = EMOJI_SHORTCODES[key];
            if (!emoji) return full;

            changed = true;

            const endOfMatch = offset + full.length;
            if (endOfMatch <= caret) deltaBeforeCaret += (emoji.length - full.length);
            return emoji;
        });

        if (changed && out !== v) {
            input.value = out;
            const newCaret = Math.max(0, caret + deltaBeforeCaret);
            try { input.setSelectionRange(newCaret, newCaret); } catch {}
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function attachEmojiToInput(input) {
        if (!input || input._smartChatEmojiAttached) return;
        input._smartChatEmojiAttached = true;

        ensureEmojiPicker(input);

        input.addEventListener('input', () => {
            if (!config.enabled || !config.emojiEnabled) return;

            if (config.emojiReplaceOnType) replaceCompletedEmojiShortcodes(input);

            const v = input.value || '';
            const pos = input.selectionStart ?? v.length;
            if (pos > 0 && v[pos - 1] === ':') {
                const prev = v.lastIndexOf(':', pos - 2);
                if (prev !== -1) {
                    const between = v.slice(prev + 1, pos - 1);
                    if (between && /^[a-z0-9_ ]+$/i.test(between)) {
                        closeEmojiPicker(input);
                        return;
                    }
                }
            }

            if (!config.emojiPickerEnabled) {
                closeEmojiPicker(input);
                return;
            }

            const q = getEmojiQueryAtCaret(input);

            if (!q) {
                closeEmojiPicker(input);
                return;
            }

            const st = ensureEmojiPicker(input);
            st.lastQuery = q.query;

            const matches = buildMatchesForPicker(q.query, st.activeCategory).slice(0, 40);
            if (!matches.length) {
                closeEmojiPicker(input);
                return;
            }

            openEmojiPicker(input, matches, q.start, q.query);
        }, true);

        input.addEventListener('keydown', (e) => {
            if (!config.enabled || !config.emojiEnabled || !config.emojiPickerEnabled) return;

            const st = emojiUiState.get(input);
            if (!st || !st.open || !st.matches.length) return;

            const isGrid = !!config.emojiGridMode;

            const GRID_COLS = 6;

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();

                const len = st.matches.length;
                if (!len) return;

                if (!isGrid) {
                    const dir = (e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowUp' ? -1 : 0);
                    if (dir !== 0) {
                        st.activeIndex = Math.max(0, Math.min(len - 1, st.activeIndex + dir));
                        renderEmojiPicker(input);
                        scrollEmojiActiveIntoView(input);
                        positionEmojiPicker(input, st.pickerEl);
                    }
                    return;
                }

                let next = st.activeIndex;

                if (e.key === 'ArrowLeft') next = st.activeIndex - 1;
                if (e.key === 'ArrowRight') next = st.activeIndex + 1;
                if (e.key === 'ArrowUp') next = st.activeIndex - GRID_COLS;
                if (e.key === 'ArrowDown') next = st.activeIndex + GRID_COLS;

                if (next < 0) next = 0;
                if (next > len - 1) next = len - 1;

                st.activeIndex = next;
                renderEmojiPicker(input);
                scrollEmojiActiveIntoView(input);
                positionEmojiPicker(input, st.pickerEl);
                return;
            }

            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                e.stopPropagation();
                const m = st.matches[st.activeIndex] || st.matches[0];
                if (m) insertEmojiForCurrentToken(input, m.emoji);
                return;
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                closeEmojiPicker(input);
                return;
            }
        }, true);

        input.addEventListener('blur', () => {
            setTimeout(() => {
                const st = emojiUiState.get(input);
                if (!st || !st.open) return;

                if (config.emojiPinned) return;

                const ae = document.activeElement;
                const insidePicker = st.pickerEl && ae && st.pickerEl.contains(ae);
                const isInput = ae === input;

                if (!insidePicker && !isInput) closeEmojiPicker(input);
            }, 0);
        }, true);
    }

    function attachAntiSpamToInput(input) {
        if (!input || input._smartChatAntiSpamAttached) return;
        input._smartChatAntiSpamAttached = true;

        input.addEventListener('keydown', e => {
            if (!config.enabled || !config.antiSpamEnabled) return;
            if (e.key !== 'Enter' || e.shiftKey) return;

            const st = emojiUiState.get(input);
            if (!st || !st.open || !st.matches.length) return;

            const q = getEmojiQueryAtCaret(input);
            if (!q || !q.query) return;

            const now = performance.now();
            const diff = now - lastSendTime;
            if (diff < config.antiSpamDelayMs) {
                e.stopPropagation();
                e.preventDefault();
                input.classList.remove('smartchat-antispam-flash');
                void input.offsetWidth;
                input.classList.add('smartchat-antispam-flash');
                return;
            }
            lastSendTime = now;
        }, true);
    }

    function setupModSettings() {
        const g = window;
        if (!g.bonkMods || !g.bonkMods.addBlock) return;

        const bonkMods = g.bonkMods;

        bonkMods.registerMod({
            id: 'smartChat',
            name: 'Smart Chat',
            version: '0.0.8',
            author: 'SIoppy',
            description: 'Smart chat improvements + :emoji_name: input picker (grid/categories/recents/pinned). Per-account saved locally (no guest persistence).'
        });

        bonkMods.registerCategory({
            id: 'chat',
            label: 'Chat',
            order: 5
        });

        bonkMods.addBlock({
            id: 'smartChat_main',
            modId: 'smartChat',
            categoryId: 'chat',
            title: 'Smart Chat',
            order: 0,
            render(container) {
                smartChatSettingsContainer = container;

                const doRender = () => {
                    try {
                        container.innerHTML = '';

                        const root = document.createElement('div');
                        root.style.fontSize = '12px';
                        container.appendChild(root);

                        const mkRow = () => {
                            const div = document.createElement('div');
                            div.className = 'smartchat-row';
                            root.appendChild(div);
                            return div;
                        };

                        const mkCheckbox = (labelText, initial, onChange) => {
                            const row = mkRow();

                            const label = document.createElement('label');
                            label.className = 'smartchat-toggle-label';

                            const input = document.createElement('input');
                            input.type = 'checkbox';
                            input.className = 'smartchat-toggle-input';
                            input.checked = !!initial;

                            const switchSpan = document.createElement('span');
                            switchSpan.className = 'smartchat-toggle-switch';

                            const knob = document.createElement('span');
                            knob.className = 'smartchat-toggle-knob';
                            switchSpan.appendChild(knob);

                            const textSpan = document.createElement('span');
                            textSpan.textContent = labelText;

                            input.addEventListener('change', () => onChange(input.checked));

                            label.appendChild(input);
                            label.appendChild(switchSpan);
                            label.appendChild(textSpan);

                            row.appendChild(label);
                            return input;
                        };

                        const mkNumberInput = (title, initial, onChange) => {
                            const row = mkRow();
                            const label = document.createElement('div');
                            label.textContent = title;
                            label.style.fontSize = '11px';
                            label.style.marginBottom = '4px';
                            row.appendChild(label);

                            const input = document.createElement('input');
                            input.type = 'number';
                            input.value = String(initial || 0);
                            input.style.width = '90px';
                            input.style.fontSize = '11px';

                            input.addEventListener('change', () => {
                                const v = parseInt(input.value, 10);
                                if (!isNaN(v) && v > 0) onChange(v);
                            });

                            row.appendChild(input);
                            return input;
                        };

                        const mkColorInput = (title, initial, onChange) => {
                            const row = mkRow();
                            const label = document.createElement('div');
                            label.textContent = title;
                            label.style.fontSize = '11px';
                            label.style.marginBottom = '4px';
                            row.appendChild(label);

                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = initial || '#00c8ff';
                            input.style.width = '52px';
                            input.style.height = '22px';
                            input.style.padding = '0';
                            input.style.border = 'none';
                            input.style.background = 'transparent';

                            input.addEventListener('change', () => onChange(input.value));
                            row.appendChild(input);
                            return input;
                        };

                        const mkTagInput = (title, initialList, onChange) => {
                            const row = mkRow();

                            const label = document.createElement('div');
                            label.className = 'smartchat-tag-label';
                            label.textContent = title;
                            row.appendChild(label);

                            const wrapper = document.createElement('div');
                            wrapper.className = 'smartchat-tag-input';

                            const tagList = document.createElement('div');
                            tagList.className = 'smartchat-tag-list';

                            const input = document.createElement('input');
                            input.type = 'text';
                            input.className = 'smartchat-tag-input-field';
                            input.placeholder = 'Type and press Enter';

                            let tags = Array.isArray(initialList) ? [...initialList] : [];

                            const renderTags = () => {
                                tagList.innerHTML = '';
                                tags.forEach((tag, idx) => {
                                    const tagEl = document.createElement('span');
                                    tagEl.className = 'smartchat-tag';

                                    const textSpan = document.createElement('span');
                                    textSpan.textContent = tag;

                                    const remove = document.createElement('span');
                                    remove.className = 'smartchat-tag-remove';
                                    remove.textContent = '×';
                                    remove.addEventListener('click', () => {
                                        tags.splice(idx, 1);
                                        renderTags();
                                        onChange([...tags]);
                                    });

                                    tagEl.appendChild(textSpan);
                                    tagEl.appendChild(remove);
                                    tagList.appendChild(tagEl);
                                });
                            };

                            const commitInput = () => {
                                const value = input.value;
                                if (!value || !value.trim()) return;
                                const parts = value.split(',').map(s => s.trim()).filter(Boolean);
                                let changed = false;
                                parts.forEach(p => {
                                    if (p && !tags.includes(p)) {
                                        tags.push(p);
                                        changed = true;
                                    }
                                });
                                if (changed) {
                                    renderTags();
                                    onChange([...tags]);
                                }
                                input.value = '';
                            };

                            input.addEventListener('keydown', e => {
                                if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    commitInput();
                                }
                            });

                            input.addEventListener('blur', () => commitInput());

                            renderTags();

                            wrapper.appendChild(tagList);
                            wrapper.appendChild(input);
                            row.appendChild(wrapper);

                            return { getTags: () => [...tags] };
                        };

                        mkCheckbox('Enabled', config.enabled, val => { config.enabled = val; saveConfig(); });
                        mkCheckbox('Show timestamps', config.showTimestamps, val => { config.showTimestamps = val; saveConfig(); });
                        mkCheckbox('24h clock', config.timestamp24h, val => { config.timestamp24h = val; saveConfig(); });
                        mkCheckbox('Highlight mentions', config.highlightMentions, val => { config.highlightMentions = val; saveConfig(); });

                        mkColorInput('Highlight colour:', config.highlightColor || '#00c8ff', value => {
                            config.highlightColor = value;
                            saveConfig();
                            applyHighlightColorFromConfig();
                        });

                        mkCheckbox('Anti-spam (minimum delay)', config.antiSpamEnabled, val => { config.antiSpamEnabled = val; saveConfig(); });
                        mkCheckbox('Hide system / spam warnings (with reveal)', config.hideSystemMessages, val => { config.hideSystemMessages = val; saveConfig(); });

                        mkNumberInput('Anti-spam delay (ms):', config.antiSpamDelayMs, v => { config.antiSpamDelayMs = v; saveConfig(); });

                        mkTagInput('Mention keywords:', config.mentionKeywords || [], list => { config.mentionKeywords = list; saveConfig(); });
                        mkTagInput('Word blacklist:', config.wordBlacklist || [], list => { config.wordBlacklist = list; saveConfig(); });
                        mkTagInput('Muted names:', config.mutedNames || [], list => {
                            const filtered = myName ? list.filter(n => normalize(n) !== normalize(myName)) : list;
                            config.mutedNames = filtered;
                            saveConfig();
                        });

                        mkCheckbox('Emoji shortcodes (:name: → 😄)', config.emojiEnabled, val => { config.emojiEnabled = val; saveConfig(); });
                        mkCheckbox('Emoji picker while typing ":"', config.emojiPickerEnabled, val => { config.emojiPickerEnabled = val; saveConfig(); });
                        mkCheckbox('Replace completed :name: as you type', config.emojiReplaceOnType, val => { config.emojiReplaceOnType = val; saveConfig(); });

                        mkCheckbox('Emoji picker: grid mode', config.emojiGridMode, val => { config.emojiGridMode = val; saveConfig(); });
                        mkCheckbox('Emoji picker: show categories', config.emojiShowCategories, val => { config.emojiShowCategories = val; saveConfig(); });
                        mkCheckbox('Emoji picker: remember recents', config.emojiRecentEnabled, val => { config.emojiRecentEnabled = val; saveConfig(); });

                        if (!storageKey) {
                            const warn = document.createElement('div');
                            warn.className = 'smartchat-guest-warning';
                            warn.textContent = 'Guest mode: settings are temporary until you log in.';
                            root.appendChild(warn);
                        } else {
                            const hint = document.createElement('div');
                            hint.className = 'smartchat-account-hint';
                            hint.textContent = `Per-account storage: ${storageKey}`;
                            root.appendChild(hint);
                        }
                    } catch {
                        container.textContent = 'Smart Chat UI failed to load; see console for details.';
                    }
                };

                smartChatRenderSettings = doRender;
                doRender();
            }
        });
    }

    async function init() {
        injectStyles();

        await waitForElement('#pretty_top_level', 15000);
        await waitForElement('#pretty_top_name', 15000);

        storageKey = getStorageKeyV2();
        migrateV1ToV2IfNeeded();
        config = loadConfig();
        applyHighlightColorFromConfig();
        tryDetectMyName(true);

        const prettyNameEl = document.querySelector('#pretty_top_name');
        if (prettyNameEl) {
            const obs = new MutationObserver(() => updateAccountKeyFromPrettyTop());
            obs.observe(prettyNameEl, { childList: true, characterData: true, subtree: true });
        }

        const prettyTopLevelEl = document.querySelector('#pretty_top_level');
        if (prettyTopLevelEl) {
            const obs2 = new MutationObserver(() => updateAccountKeyFromPrettyTop());
            obs2.observe(prettyTopLevelEl, { childList: true, characterData: true, subtree: true });
        }

        updateAccountKeyFromPrettyTop();

        const lobbyChatContent = document.querySelector('#newbonklobby_chat_content');
        const lobbyInput = document.querySelector('#newbonklobby_chat_input');
        if (lobbyChatContent) observeChatContainer(lobbyChatContent);
        if (lobbyInput) {
            attachAntiSpamToInput(lobbyInput);
            attachEmojiToInput(lobbyInput);
        }

        const ingameContent = await waitForElement('#ingamechatcontent');
        const ingameInput = document.querySelector('#ingamechatinputtext');
        if (ingameContent) observeChatContainer(ingameContent);
        if (ingameInput) {
            attachAntiSpamToInput(ingameInput);
            attachEmojiToInput(ingameInput);
        }

        const globalObserver = new MutationObserver(() => {
            updateAccountKeyFromPrettyTop();

            const lc = document.querySelector('#newbonklobby_chat_content');
            if (lc) observeChatContainer(lc);

            const li = document.querySelector('#newbonklobby_chat_input');
            if (li) {
                attachAntiSpamToInput(li);
                attachEmojiToInput(li);
            }

            const gc = document.querySelector('#ingamechatcontent');
            if (gc) observeChatContainer(gc);

            const gi = document.querySelector('#ingamechatinputtext');
            if (gi) {
                attachAntiSpamToInput(gi);
                attachEmojiToInput(gi);
            }
        });
        globalObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

        if (window.bonkMods && window.bonkMods.addBlock) setupModSettings();
        else window.addEventListener('bonkModsReady', () => setupModSettings());
    }

    init();
})();