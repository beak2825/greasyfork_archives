// ==UserScript==
// @name         YouTube Music Pro Audio Enhancer + Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  🎵 Audio Enhancer + Ad Blocker YouTube Music
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563299/YouTube%20Music%20Pro%20Audio%20Enhancer%20%2B%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/563299/YouTube%20Music%20Pro%20Audio%20Enhancer%20%2B%20Ad%20Blocker.meta.js
// ==/UserScript==

(() => {
'use strict';

console.log('[YTM] 🎵 Script loaded with Ad Blocker');

/* =========================
   AD BLOCKER MODULE
========================= */
const AdBlocker = {
    cssSelectorArr: [
        ".video-ads.ytp-ad-module",
        "#player-ads .ytp-ad-module",
        ".ytp-ad-player-overlay",
        ".ytp-ad-preview-container",
        ".ytp-ad-progress-list",
        ".ytp-ad-skip-button, .ytp-ad-skip-button-modern",
        "#related ytd-ad-slot-renderer",
        "#related #player-ads",
        "ytd-companion-ad-renderer",
        ".ytd-watch-next-secondary-results-renderer ytd-ad-slot-renderer",
        "yt-mealbar-promo-renderer",
        "ytd-popup-container:has(a[href='/premium'])",
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        "tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)",
        "ytd-promoted-sparkles-web-renderer",
        "ytd-endpoint-ad-renderer",
        "ytd-shorts-ad-renderer",
        "ytd-ad-slot-renderer",
        "ad-slot-renderer",
        ".ad-container",
        ".ytp-ad-module",
        ".ytd-display-ad-renderer",
        "ytmusic-popup-container:has(a[href='/premium'])",
        "ytmusic-mealbar-promo-renderer"
    ],

    init() {
        this.injectAdBlockCSS();
        this.setupAdObserver();
        console.log('[YTM] 🛡️ Ad Blocker initialized');
    },

    injectAdBlockCSS() {
        if (document.getElementById('ytm-adblock-css')) return;
        
        const style = document.createElement('style');
        style.id = 'ytm-adblock-css';
        style.textContent = this.cssSelectorArr.map(s => `${s}{display:none!important}`).join(' ');
        (document.head || document.body).appendChild(style);
    },

    closeOverlay() {
        document.querySelectorAll("ytmusic-popup-container a[href='/premium']").forEach(el => {
            el.closest("ytmusic-popup-container")?.remove();
        });
        document.querySelectorAll("tp-yt-iron-overlay-backdrop").forEach(el => {
            el.className = "";
            el.removeAttribute("opened");
        });
    },

    skipAd(video) {
        if (!video) return;
        
        const btn = document.querySelector(".ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern");
        const shortMsg = document.querySelector(".video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon");
        
        if (btn || shortMsg) {
            video.muted = true;
        }
        
        if (btn) {
            btn.click();
            video.currentTime = video.duration;
        } else if (shortMsg) {
            video.currentTime = video.duration;
        }
    },

    playAfterAd(video) {
        if (video && video.paused && video.currentTime < 1) {
            video.play();
        }
    },

    setupAdObserver() {
        const observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video) {
                this.closeOverlay();
                this.skipAd(video);
                this.playAfterAd(video);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

/* =========================
   STATE
========================= */
const State = {
    get enabled() {
        return localStorage.getItem('ytm-enabled') === 'true';
    },
    set enabled(v) {
        localStorage.setItem('ytm-enabled', String(v));
    },
    get preset() {
        return localStorage.getItem('ytm-preset') || 'bass';
    },
    set preset(v) {
        localStorage.setItem('ytm-preset', v);
    }
};

/* =========================
   PRESETS
========================= */
const PRESETS = {
    bass: {
        name: '📊 Deep Bass (EDM)',
        filters: [
            { type: 'lowshelf', freq: 50, gain: 7 },
            { type: 'peaking', freq: 100, q: 0.8, gain: 4 },
            { type: 'peaking', freq: 300, q: 1, gain: -2 },
            { type: 'highshelf', freq: 8000, gain: 1 }
        ],
        gain: 1.1
    },

    harman: {
        name: '🎵 Harman Signature',
        filters: [
            { type: 'lowshelf', freq: 60, gain: 5 },
            { type: 'peaking', freq: 200, q: 1.0, gain: -2 },
            { type: 'peaking', freq: 3000, q: 1.2, gain: 3 },
            { type: 'highshelf', freq: 10000, gain: 2 }
        ],
        gain: 1.1
    },

    harman_bass_boost: {
        name: '🎵 Harman Signature (Bass+)',
        filters: [
            { type: 'lowshelf', freq: 60, gain: 7.5 },
            { type: 'peaking', freq: 200, q: 1.0, gain: -2 },
            { type: 'peaking', freq: 3000, q: 1.2, gain: 3 },
            { type: 'highshelf', freq: 10000, gain: 2 }
        ],
        gain: 1.1
    },

    dolby: {
        name: '🎬 Dolby Surround Feel',
        filters: [
            { type: 'lowshelf', freq: 40, gain: 4 },
            { type: 'peaking', freq: 500, q: 1.5, gain: -3 },
            { type: 'peaking', freq: 2500, q: 1, gain: 3 },
            { type: 'highshelf', freq: 12000, gain: 5 }
        ],
        gain: 1.2
    },

    vocal: {
        name: '🎤 Pure Vocal',
        filters: [
            { type: 'lowshelf', freq: 100, gain: -2 },
            { type: 'peaking', freq: 400, q: 1, gain: 2 },
            { type: 'peaking', freq: 3000, q: 1.2, gain: 4 },
            { type: 'highshelf', freq: 8000, gain: 1 }
        ],
        gain: 1.15
    },

    dynamic: {
        name: '🚀 Dynamic Pop',
        filters: [
            { type: 'lowshelf', freq: 80, gain: 4 },
            { type: 'peaking', freq: 1000, q: 0.6, gain: -2 },
            { type: 'peaking', freq: 4000, q: 1, gain: 3 },
            { type: 'highshelf', freq: 10000, gain: 3 }
        ],
        gain: 1.2
    }
};

/* =========================
   CSS
========================= */
function injectCSS() {
    if (document.getElementById('ytm-styles')) return;

    const style = document.createElement('style');
    style.id = 'ytm-styles';
    style.textContent = `
        #ytm-btn {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
            font-size: 20px;
            color: #aaa;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #ytm-btn:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
        }
        #ytm-btn.active {
            color: #3ea6ff;
            text-shadow: 0 0 10px #3ea6ff;
        }
        #ytm-btn.floating {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: #282828;
            border: 2px solid #3ea6ff;
            z-index: 999999;
            width: 50px;
            height: 50px;
            font-size: 24px;
        }
        #ytm-panel {
            position: fixed;
            right: 20px;
            bottom: 160px;
            background: #1a1a1a;
            color: #fff;
            padding: 16px;
            border-radius: 12px;
            width: 260px;
            z-index: 9999999;
            display: none;
            border: 1px solid #333;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            font-family: 'Roboto', sans-serif;
        }
        #ytm-panel.show {
            display: block;
        }
        #ytm-panel-title {
            margin: 0 0 12px 0;
            font-size: 14px;
            color: #3ea6ff;
            font-weight: bold;
        }
        #ytm-status {
            font-size: 12px;
            color: #888;
            margin-bottom: 12px;
            padding: 8px;
            background: #252525;
            border-radius: 6px;
        }
        #ytm-status.on {
            color: #4ade80;
        }
        #ytm-adblock-status {
            font-size: 11px;
            color: #4ade80;
            margin-bottom: 8px;
            padding: 6px;
            background: #1a2a1a;
            border-radius: 6px;
            border: 1px solid #2a4a2a;
        }
        .ytm-btn {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 6px 0;
            border: none;
            border-radius: 8px;
            background: #333;
            color: #fff;
            cursor: pointer;
            font-size: 13px;
            transition: background 0.2s;
            text-align: center;
        }
        .ytm-btn:hover {
            background: #444;
        }
        .ytm-btn.active {
            background: #3ea6ff;
            color: #000;
        }
        .ytm-btn.toggle-btn {
            background: #c00;
        }
        .ytm-btn.toggle-btn.on {
            background: #0a0;
        }
        .ytm-divider {
            border: none;
            border-top: 1px solid #333;
            margin: 12px 0;
        }
    `;
    document.head.appendChild(style);
}

/* =========================
   AUDIO ENGINE
========================= */
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.source = null;
        this.nodes = [];
        this.gainNode = null;
        this.isActive = false;
    }

    init(video) {
        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
                console.log('[YTM] AudioContext created');
            }

            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
                console.log('[YTM] AudioContext resumed');
            }

            if (!video._ytmSource) {
                video._ytmSource = this.ctx.createMediaElementSource(video);
                console.log('[YTM] MediaElementSource created');
            }

            this.source = video._ytmSource;
            return true;
        } catch (e) {
            console.error('[YTM] Init error:', e);
            return false;
        }
    }

    buildGraph(presetKey) {
        this.nodes.forEach(n => {
            try { n.disconnect(); } catch(e) {}
        });
        this.nodes = [];

        const preset = PRESETS[presetKey];
        let last = this.source;

        preset.filters.forEach(f => {
            const node = this.ctx.createBiquadFilter();
            node.type = f.type;
            node.frequency.value = f.freq;
            if (f.q) node.Q.value = f.q;
            node.gain.value = f.gain;
            last.connect(node);
            last = node;
            this.nodes.push(node);
        });

        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = preset.gain;
        last.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    }

    enable(video) {
        if (!this.init(video)) return false;

        try {
            this.source.disconnect();
            this.buildGraph(State.preset);
            this.isActive = true;
            console.log('[YTM] ✅ Audio ENABLED -', State.preset);
            return true;
        } catch (e) {
            console.error('[YTM] Enable error:', e);
            return false;
        }
    }

    disable() {
        if (!this.source || !this.ctx) return;

        try {
            this.source.disconnect();
            this.source.connect(this.ctx.destination);
            this.isActive = false;
            console.log('[YTM] ℹ️ Audio DISABLED');
        } catch (e) {
            console.error('[YTM] Disable error:', e);
        }
    }

    toggle(video) {
        if (this.isActive) {
            this.disable();
        } else {
            this.enable(video);
        }
        return this.isActive;
    }

    changePreset(video, presetKey) {
        State.preset = presetKey;
        if (this.isActive) {
            this.disable();
            this.enable(video);
        }
    }
}

const audioEngine = new AudioEngine();

/* =========================
   UI
========================= */
let button = null;
let panel = null;
let statusEl = null;
let adBlockStatusEl = null;
let toggleBtn = null;
let presetBtns = {};

function createElement(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
            el.className = value;
        } else if (key === 'textContent') {
            el.textContent = value;
        } else if (key.startsWith('on')) {
            el.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            el.setAttribute(key, value);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child) {
            el.appendChild(child);
        }
    });
    return el;
}

function createButton() {
    if (button) return button;

    button = createElement('button', {
        id: 'ytm-btn',
        title: 'Audio Enhancer + Ad Blocker - Click để mở panel',
        textContent: '🎵',
        onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            togglePanel();
        }
    });

    if (State.enabled && audioEngine.isActive) {
        button.classList.add('active');
    }

    return button;
}

function createPanel() {
    if (panel) return panel;

    const title = createElement('div', {
        id: 'ytm-panel-title',
        textContent: '🎵 Audio Enhancer'
    });

    adBlockStatusEl = createElement('div', {
        id: 'ytm-adblock-status',
        textContent: '🛡️ Ad Blocker: Đang hoạt động'
    });

    statusEl = createElement('div', {
        id: 'ytm-status',
        textContent: 'Trạng thái: Đã tắt'
    });

    toggleBtn = createElement('button', {
        className: 'ytm-btn toggle-btn',
        textContent: '📊 BẬT',
        onClick: () => {
            const video = document.querySelector('video');
            if (!video) {
                alert('Không tìm thấy video! Hãy phát nhạc trước.');
                return;
            }
            audioEngine.toggle(video);
            State.enabled = audioEngine.isActive;
            updateUI();
        }
    });

    const divider = createElement('hr', { className: 'ytm-divider' });

    const presetsContainer = createElement('div', { id: 'ytm-presets' });

    Object.entries(PRESETS).forEach(([key, preset]) => {
        const btn = createElement('button', {
            className: 'ytm-btn',
            textContent: preset.name,
            'data-preset': key,
            onClick: () => {
                const video = document.querySelector('video');
                if (!video) return;
                audioEngine.changePreset(video, key);
                updateUI();
            }
        });
        presetBtns[key] = btn;
        presetsContainer.appendChild(btn);
    });

    panel = createElement('div', { id: 'ytm-panel' }, [
        title,
        adBlockStatusEl,
        statusEl,
        toggleBtn,
        divider,
        presetsContainer
    ]);

    document.body.appendChild(panel);

    document.addEventListener('click', (e) => {
        if (panel && panel.classList.contains('show') &&
            !panel.contains(e.target) && e.target !== button) {
            panel.classList.remove('show');
        }
    });

    return panel;
}

function togglePanel() {
    createPanel();
    panel.classList.toggle('show');
    updateUI();
}

function updateUI() {
    if (button) {
        button.classList.toggle('active', audioEngine.isActive);
    }

    if (statusEl) {
        if (audioEngine.isActive) {
            statusEl.textContent = '✅ Đang bật: ' + PRESETS[State.preset].name;
            statusEl.classList.add('on');
        } else {
            statusEl.textContent = 'ℹ️ Trạng thái: Đã tắt';
            statusEl.classList.remove('on');
        }
    }

    if (toggleBtn) {
        if (audioEngine.isActive) {
            toggleBtn.textContent = 'ℹ️ TẮT';
            toggleBtn.classList.add('on');
        } else {
            toggleBtn.textContent = '📊 BẬT';
            toggleBtn.classList.remove('on');
        }
    }

    Object.entries(presetBtns).forEach(([key, btn]) => {
        btn.classList.toggle('active', key === State.preset);
    });
}

/* =========================
   INJECT
========================= */
function injectButton() {
    if (document.getElementById('ytm-btn')) return;

    injectCSS();
    const btn = createButton();

    const selectors = [
        'ytmusic-player-bar .right-controls-buttons',
        'ytmusic-player-bar .middle-controls-buttons',
        '.right-controls-buttons.style-scope.ytmusic-player-bar',
        '#right-content.style-scope.ytmusic-player-bar'
    ];

    let container = null;
    for (const sel of selectors) {
        container = document.querySelector(sel);
        if (container) {
            console.log('[YTM] Found container:', sel);
            break;
        }
    }

    if (container) {
        container.prepend(btn);
        console.log('[YTM] ✅ Button injected to player bar');
    } else {
        btn.classList.add('floating');
        document.body.appendChild(btn);
        console.log('[YTM] ✅ Floating button created');
    }
}

/* =========================
   AUTO ENABLE
========================= */
function autoEnable() {
    if (State.enabled) {
        const video = document.querySelector('video');
        if (video && video.readyState >= 2) {
            if (audioEngine.enable(video)) {
                updateUI();
            }
        }
    }
}

/* =========================
   INIT
========================= */
function init() {
    AdBlocker.init();
    injectButton();
    setTimeout(autoEnable, 500);
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('ytm-btn')) {
        injectButton();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

['yt-navigate-finish', 'yt-page-data-updated'].forEach(evt => {
    window.addEventListener(evt, () => {
        console.log('[YTM] Navigation:', evt);
        setTimeout(init, 500);
    });
});

document.addEventListener('canplay', (e) => {
    if (e.target.tagName === 'VIDEO') {
        console.log('[YTM] Video ready');
        autoEnable();
    }
}, true);

document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const video = document.querySelector('video');
        if (video) {
            audioEngine.toggle(video);
            State.enabled = audioEngine.isActive;
            updateUI();
        }
    }
});

setTimeout(init, 1000);
console.log('[YTM] 🎉 Ready! Alt+E để toggle | Ad Blocker: ON');

})();