// ==UserScript==
// @name         Cam ARNA 
// @namespace    http://tampermonkey.net/
// @version      2.1.1
// @description  Multi-archive search tool
// @author       user006-ui 
// @license      MIT
// @match        https://*.stripchat.com/*
// @match        https://*.chaturbate.com/*
// @match        https://chaturbate.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      archivebate.com
// @connect      showcamrips.com
// @connect      camshowrecordings.com
// @connect      camwh.com
// @connect      topcamvideos.com
// @connect      lovecamporn.com
// @connect      camwhores.tv
// @connect      bestcam.tv
// @connect      xhomealone.com
// @connect      stream-leak.com
// @connect      mfcamhub.com
// @connect      camshowrecord.net
// @connect      camwhoresbay.com
// @connect      camsave1.com
// @connect      onscreens.me
// @connect      livecamrips.to
// @connect      cumcams.cc
// @connect      allmy.cam
// @connect      livecamsrip.com
// @connect      stripchat.com
// @connect      chaturbate.com
// @downloadURL https://update.greasyfork.org/scripts/556699/Cam%20ARNA.user.js
// @updateURL https://update.greasyfork.org/scripts/556699/Cam%20ARNA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Utils: Security & Validation ---
    const Utils = {
        escapeRegex: (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        isValidUsername: (str) => /^[a-zA-Z0-9_\-]{3,50}$/.test(str),
        
        openSafe: (url) => {
            if (typeof GM_openInTab === 'function') {
                GM_openInTab(url, { active: true, insert: true, setParent: true });
            } else {
                const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
                if (newWindow) newWindow.opener = null;
            }
        },

        // Simple AES Encryption (Obfuscation for Storage)
        crypto: {
            secret: 'CAM_ARNA_SALT_v2_SECURE', 
            encrypt: (text) => {
                if (!text) return '';
                try {
                    return CryptoJS.AES.encrypt(text, Utils.crypto.secret).toString();
                } catch (e) { console.error("Encrypt Error", e); return ''; }
            },
            decrypt: (ciphertext) => {
                if (!ciphertext) return '';
                try {
                    const bytes = CryptoJS.AES.decrypt(ciphertext, Utils.crypto.secret);
                    return bytes.toString(CryptoJS.enc.Utf8);
                } catch (e) { return ''; } 
            }
        }
    };

    // --- Storage Helper ---
    const Storage = {
        get: (key, defaultValue) => GM_getValue(key, defaultValue),
        set: (key, value) => { GM_setValue(key, value); return true; },
        
        getSecure: (key, defaultValue) => {
            const encrypted = GM_getValue(key, '');
            if (!encrypted) return defaultValue;
            const decrypted = Utils.crypto.decrypt(encrypted);
            return decrypted || defaultValue;
        },
        setSecure: (key, value) => {
            const encrypted = Utils.crypto.encrypt(value);
            GM_setValue(key, encrypted);
        }
    };

    const archiveSites = [
        { name: 'Archivebate', url: 'https://archivebate.com/profile/{username}', domain: 'archivebate.com' },
        { name: 'Showcamrips', url: 'https://showcamrips.com/model/en/{username}', domain: 'showcamrips.com' },
        { name: 'Camshowrecordings', url: 'https://www.camshowrecordings.com/model/{username}', domain: 'camshowrecordings.com' },
        { name: 'Camwh', url: 'https://camwh.com/tags/{username}/', domain: 'camwh.com' },
        { name: 'TopCamVideos', url: 'https://www.topcamvideos.com/showall/?search={username}', domain: 'topcamvideos.com' },
        { name: 'LoveCamPorn', url: 'https://lovecamporn.com/showall/?search={username}', domain: 'lovecamporn.com' },
        { name: 'Camwhores.tv', url: 'https://www.camwhores.tv/search/{username}/', domain: 'camwhores.tv' },
        { name: 'Bestcam.tv', url: 'https://bestcam.tv/model/{username}', domain: 'bestcam.tv' },
        { name: 'Xhomealone', url: 'https://xhomealone.com/tags/{username}/', domain: 'xhomealone.com' },
        { name: 'Stream-leak', url: 'https://stream-leak.com/models/{username}/', domain: 'stream-leak.com' },
        { name: 'MFCamhub', url: 'https://mfcamhub.com/models/{username}/', domain: 'mfcamhub.com' },
        { name: 'Camshowrecord', url: 'https://camshowrecord.net/video/list?page=1&model={username}', domain: 'camshowrecord.net' },
        { name: 'Camwhoresbay', url: 'https://www.camwhoresbay.com/search/{username}/', domain: 'camwhoresbay.com' },
        { name: 'CamSave1', url: 'https://www.camsave1.com/?feet=0&face=0&ass=0&tits=0&pussy=0&search={username}&women=true&couples=true&men=false&trans=false', domain: 'camsave1.com' },
        { name: 'Onscreens', url: 'https://www.onscreens.me/m/{username}', domain: 'onscreens.me' },
        { name: 'Livecamrips', url: 'https://livecamrips.to/search/{username}/1', domain: 'livecamrips.to' },
        { name: 'Cumcams', url: 'https://cumcams.cc/performer/{username}', domain: 'cumcams.cc' },
        { name: 'AllMyCam', url: 'https://allmy.cam/search/{username}/', domain: 'allmy.cam' },
        { name: 'LiveCamsRip', url: 'https://www.livecamsrip.com/{username}/profile', domain: 'livecamsrip.com' }
    ];

    const mainSites = {
        'stripchat': 'https://stripchat.com/{username}',
        'chaturbate': 'https://chaturbate.com/{username}/'
    };

    function getFaviconUrl(domain) {
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    }

    // --- Page Checker ---
    const PageChecker = {
        cache: new Map(),
        CONSTANTS: {
            TTL: 10 * 60 * 1000, 
            MAX_SIZE: 100
        },

        checkPage: function(url) {
            return new Promise((resolve) => {
                const now = Date.now();
                
                if (this.cache.has(url)) {
                    const entry = this.cache.get(url);
                    if (now - entry.timestamp < this.CONSTANTS.TTL) {
                        resolve(entry.exists);
                        return;
                    } else {
                        this.cache.delete(url);
                    }
                }

                GM_xmlhttpRequest({
                    method: 'GET', url: url, timeout: 8000,
                    onload: (response) => {
                        const exists = this.analyzeResponse(response, url);
                        this.addToCache(url, exists);
                        resolve(exists);
                    },
                    onerror: () => { 
                        this.addToCache(url, false);
                        resolve(false); 
                    }
                });
            }).catch(e => {
                console.warn("PageChecker rejected:", e);
                return false;
            });
        },
        
        addToCache: function(url, exists) {
            if (this.cache.size >= this.CONSTANTS.MAX_SIZE) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }
            this.cache.set(url, { exists: exists, timestamp: Date.now() });
        },

        analyzeResponse: function(response, url) {
            try {
                if (response.status === 404 || response.status >= 500) return false;
                const text = response.responseText;
                if (!text) return false;
                const lowerText = text.toLowerCase();

                if (url.includes('showcamrips') && text.includes("data:image/png;base64,iVBORw0KGgo")) return false;

                if (url.includes('camshowrecordings.com')) {
                    if (text.includes('class="h1modelindex"')) return false;
                    const userMatch = url.match(/\/model\/([^/?#]+)/);
                    if (userMatch && userMatch[1]) {
                        const username = decodeURIComponent(userMatch[1]).toLowerCase();
                        if (text.includes('class="h1modelpage"') && lowerText.includes(username)) return true;
                        return false;
                    }
                    return text.includes('class="h1modelpage"');
                }

                if (url.includes('camwhores.tv')) {
                    if (lowerText.includes('no videos found') || lowerText.includes('no results')) return false;
                    const userMatch = url.match(/\/search\/([^/?#]+)/);
                    if (userMatch) {
                        const rawUser = decodeURIComponent(userMatch[1]);
                        const safeUserRegex = Utils.escapeRegex(rawUser).replace(/[\-\_]/g, '[\\s\\-\\_]+');
                        const titleRegex = new RegExp(`class=["']title["'][^>]*>\\s*[^<]*${safeUserRegex}`, 'i');
                        const linkRegex = new RegExp(`href=["'].*?\/videos\/\\d+\/.*?${safeUserRegex}`, 'i');
                        return (titleRegex.test(text) || linkRegex.test(text));
                    }
                }

                if (url.includes('camwhoresbay.com')) {
                    const userMatch = url.match(/\/search\/([^/?#]+)/);
                    if (userMatch) {
                        const rawUser = decodeURIComponent(userMatch[1]);
                        const safeUserRegex = Utils.escapeRegex(rawUser).replace(/[\-\_]/g, '[\\s\\-\\_]*');
                        const videoLinkRegex = new RegExp(`href=["'][^"']*\\/videos\\/[^"']*${safeUserRegex}`, 'i');
                        const titleRegex = new RegExp(`title=["'][^"']*${safeUserRegex}[^"']*["']`, 'i');
                        return (videoLinkRegex.test(text) || titleRegex.test(text));
                    }
                }

                if (url.includes('camshowrecord.net') && text.includes('Sorry, no video found for this')) return false;
                if (url.includes('cumcams.cc') && lowerText.includes('performer not found')) return false;
                if (url.includes('livecamsrip.com') && text.includes('No records found')) return false;

                const titleMatch = lowerText.match(/<title[^>]*>(.*?)<\/title>/i);
                const title = titleMatch ? titleMatch[1] : '';

                const notFoundTerms = ['no videos found', 'no results found', 'does not exist', 'no videos to show'];
                if (['not found', '404', 'page not found', 'no results'].some(x => title.includes(x))) return false;
                if (notFoundTerms.some(x => lowerText.includes(x))) return false;

                return true;
            } catch(e) {
                console.error("Analysis Error", e);
                return false;
            }
        },
        clearCache: function() { this.cache.clear(); }
    };

    // --- UI & Styles ---
    function injectStyles() {
        GM_addStyle(`
            :root {
                --cam-bg: #09090b; --cam-surface: #18181b; --cam-border: #27272a;
                --cam-primary: #3b82f6; --cam-primary-hover: #2563eb;
                --cam-text: #f4f4f5; --cam-text-muted: #a1a1aa;
                --cam-danger: #ef4444; --cam-success: #22c55e;
                --cam-radius: 16px;
                --cam-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            @keyframes slideUpMobile { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes scaleInDesktop { from { transform: translate(-50%, -45%) scale(0.95); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
            .cam-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 99999; }
            .cam-container {
                position: fixed; z-index: 100000; background: var(--cam-bg); color: var(--cam-text);
                font-family: var(--cam-font); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                border: 1px solid var(--cam-border); display: flex; flex-direction: column; overflow: hidden;
            }
            @media (min-width: 601px) {
                .cam-container {
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 450px; max-height: 85vh; border-radius: var(--cam-radius);
                    animation: scaleInDesktop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
            }
            @media (max-width: 600px) {
                .cam-container {
                    bottom: 0; left: 0; right: 0; width: 100%; max-height: 90vh;
                    border-radius: 24px 24px 0 0; border-bottom: none;
                    animation: slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
            }
            .cam-header { padding: 16px 20px; background: var(--cam-surface); border-bottom: 1px solid var(--cam-border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
            .cam-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
            .cam-close { background: none; border: none; color: var(--cam-text-muted); font-size: 24px; cursor: pointer; padding: 4px; border-radius: 50%; transition: 0.2s; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
            .cam-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
            .cam-nav { padding: 12px 20px 0; display: flex; gap: 4px; border-bottom: 1px solid var(--cam-border); background: var(--cam-bg); flex-shrink: 0; }
            .cam-nav-item { flex: 1; padding: 10px; text-align: center; background: none; border: none; color: var(--cam-text-muted); font-size: 14px; font-weight: 600; cursor: pointer; position: relative; transition: 0.2s; }
            .cam-nav-item:hover { color: var(--cam-text); }
            .cam-nav-item.active { color: var(--cam-primary); }
            .cam-nav-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--cam-primary); border-radius: 2px 2px 0 0; }
            .cam-body { padding: 20px; overflow-y: auto; overscroll-behavior: contain; flex-grow: 1; }
            .cam-input-wrap { margin-bottom: 20px; position: relative; }
            .cam-input { width: 100%; box-sizing: border-box; background: var(--cam-surface); border: 1px solid var(--cam-border); border-radius: 12px; padding: 14px 14px 14px 44px; color: #fff; font-size: 16px; transition: border-color 0.2s; }
            .cam-input:focus { outline: none; border-color: var(--cam-primary); }
            .cam-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--cam-text-muted); pointer-events: none; }
            .cam-section { margin-bottom: 24px; }
            .cam-section-head { font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--cam-text-muted); margin-bottom: 12px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
            .cam-card { background: var(--cam-surface); border: 1px solid var(--cam-border); border-radius: 12px; overflow: hidden; }
            .cam-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: none; border: none; color: var(--cam-text); font-size: 15px; font-weight: 500; text-align: left; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid var(--cam-border); }
            .cam-btn:last-child { border-bottom: none; }
            .cam-btn:hover { background: rgba(255,255,255,0.05); }
            .cam-btn-primary { background: var(--cam-primary); color: #fff; border: none; justify-content: center; font-weight: 600; border-radius: 12px; margin-top: 10px; width: 100%; padding: 14px; cursor: pointer; }
            .cam-btn-primary:hover { background: var(--cam-primary-hover); }
            .cam-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .cam-grid-btn { background: var(--cam-surface); border: 1px solid var(--cam-border); border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 10px; color: var(--cam-text); cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
            .cam-grid-btn:hover { border-color: var(--cam-text-muted); transform: translateY(-1px); }
            .cam-grid-btn img { width: 16px; height: 16px; border-radius: 4px; }
            .cam-grid-btn.unavailable { opacity: 0.4; pointer-events: none; filter: grayscale(1); }
            .cam-grid-btn.checking { opacity: 0.7; pointer-events: none; }
            .cam-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); padding: 12px 24px; background: #fff; color: #000; font-weight: 600; border-radius: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 200000; font-size: 14px; animation: slideUpMobile 0.3s; }
            #cam-fab { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 28px; background: var(--cam-primary); color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4); z-index: 99998; transition: transform 0.2s; display: flex; align-items: center; justify-content: center; }
            #cam-fab:active { transform: scale(0.9); }
        `);
    }

    // --- Profile Manager ---
    const ProfileManager = {
        get: () => {
            try { return Storage.get('cam_profiles', []); } catch(e) { return []; }
        },
        add: (name) => {
            if(!Utils.isValidUsername(name)) return false;
            let list = ProfileManager.get();
            if (!list.includes(name)) { list.push(name); Storage.set('cam_profiles', list); return true; }
            return false;
        },
        remove: (name) => {
            let list = ProfileManager.get();
            Storage.set('cam_profiles', list.filter(n => n !== name));
        }
    };

    // --- Main UI Logic ---
    const UI = {
        isOpen: false,
        elements: {}, 

        createMenu: function() {
            if (this.isOpen) return;
            this.isOpen = true;

            const backdrop = document.createElement('div');
            backdrop.className = 'cam-backdrop';
            
            const container = document.createElement('div');
            container.className = 'cam-container';

            container.innerHTML = `
                <div class="cam-header">
                    <div class="cam-title"><span>🌟</span> Cam ARNA <span style="font-size:10px; opacity:0.5; margin-left:5px;">v2.1.1</span></div>
                    <button class="cam-close">✕</button>
                </div>
                <div class="cam-nav">
                    <button class="cam-nav-item active" data-tab="search">Search</button>
                    <button class="cam-nav-item" data-tab="saved">Saved</button>
                    <button class="cam-nav-item" data-tab="settings">Settings</button>
                </div>
                <div class="cam-body">
                    <div class="cam-input-wrap">
                        <span class="cam-input-icon">👤</span>
                        <input type="text" class="cam-input" id="cam-user-input" placeholder="Username..." autocomplete="off">
                    </div>
                    <div id="tab-search" class="cam-tab-content">
                        <div class="cam-section">
                            <div class="cam-section-head">Direct Access</div>
                            <div class="cam-grid">
                                <button class="cam-grid-btn main-site" data-site="stripchat" style="border-color: #8b5cf6;">💜 Stripchat</button>
                                <button class="cam-grid-btn main-site" data-site="chaturbate" style="border-color: #f97316;">🧡 Chaturbate</button>
                            </div>
                            <button id="cam-save-btn" class="cam-btn-primary">💾 Save Profile</button>
                        </div>

                        <div class="cam-section">
                            <div class="cam-section-head">Tools & Stats</div>
                            <div class="cam-grid">
                                <button class="cam-grid-btn extra-tool" data-type="schedule" style="border-color: #10b981;">📅 Schedule</button>
                                <button class="cam-grid-btn extra-tool" data-type="stats" style="border-color: #3b82f6;">📊 Statistics</button>
                                <button class="cam-grid-btn extra-tool" data-type="find" style="border-color: #f43f5e;">🔎 Finder</button>
                            </div>
                        </div>

                        <div class="cam-section">
                            <div class="cam-section-head">Archives <span id="archive-status" style="float:right; font-weight:normal; opacity:0.6;"></span></div>
                            <div class="cam-grid" id="archive-grid"></div>
                        </div>
                    </div>
                    <div id="tab-saved" class="cam-tab-content" style="display:none;">
                        <div class="cam-card" id="saved-list"></div>
                        <div id="saved-empty" style="text-align:center; padding:40px; color:var(--cam-text-muted); display:none;">No profiles saved yet.</div>
                    </div>
                    <div id="tab-settings" class="cam-tab-content" style="display:none;">
                        <div id="settings-content"></div>
                    </div>
                </div>
            `;

            // Render Static Archives
            const archiveGrid = container.querySelector('#archive-grid');
            archiveSites.forEach(s => {
                const btn = document.createElement('button');
                btn.className = 'cam-grid-btn archive-link';
                btn.dataset.url = s.url;
                
                const img = document.createElement('img');
                img.src = getFaviconUrl(s.domain);
                img.onerror = () => { img.style.display = 'none'; };
                
                const txt = document.createTextNode(` ${s.name}`);
                
                btn.appendChild(img);
                btn.appendChild(txt);
                archiveGrid.appendChild(btn);
            });

            this.renderSettings(container.querySelector('#settings-content'));

            document.body.appendChild(backdrop);
            document.body.appendChild(container);

            this.elements = {
                input: container.querySelector('#cam-user-input'),
                tabs: container.querySelectorAll('.cam-nav-item'),
                contents: container.querySelectorAll('.cam-tab-content')
            };

            // Username extraction (Safe)
            try {
                const path = window.location.pathname.split('/').filter(p => p);
                let initialUser = '';
                const cbIgnore = ['tags', 'auth', 'search', 'couple-cams', 'female-cams', 'trans-cams', 'male-cams'];

                if (window.location.hostname.includes('chaturbate') && path.length === 1 && !cbIgnore.includes(path[0])) {
                    initialUser = path[0];
                }
                else if (!window.location.hostname.includes('chaturbate') && path.length >= 1) {
                    initialUser = path[path.length-1];
                }
                
                if(initialUser && Utils.isValidUsername(initialUser)) {
                    this.elements.input.value = initialUser;
                    this.onUserChange(initialUser);
                }
            } catch(e) { console.error("Extraction error", e); }

            this.bindEvents(backdrop, container);
        },

        detectSite: function() {
            return window.location.hostname.includes('chaturbate') ? 'chaturbate' : 'stripchat';
        },

        bindEvents: function(backdrop, container) {
            const close = () => this.close();
            backdrop.addEventListener('click', close);
            container.querySelector('.cam-close').addEventListener('click', close);

            this.elements.tabs.forEach(t => {
                t.addEventListener('click', () => {
                    this.elements.tabs.forEach(x => x.classList.remove('active'));
                    t.classList.add('active');
                    this.elements.contents.forEach(c => c.style.display = 'none');
                    container.querySelector(`#tab-${t.dataset.tab}`).style.display = 'block';
                    if (t.dataset.tab === 'saved') this.renderSaved();
                });
            });

            let debounce;
            this.elements.input.addEventListener('input', () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const val = this.elements.input.value.trim();
                    if(Utils.isValidUsername(val)) {
                        this.onUserChange(val);
                    }
                }, 800);
            });

            container.querySelectorAll('.archive-link').forEach(b => {
                b.addEventListener('click', () => {
                    if(b.classList.contains('unavailable')) return;
                    const u = this.elements.input.value.trim();
                    if(u && Utils.isValidUsername(u)) {
                        Utils.openSafe(b.dataset.url.replace('{username}', u));
                    }
                });
            });

            container.querySelectorAll('.main-site').forEach(b => {
                b.addEventListener('click', () => {
                    const u = this.elements.input.value.trim();
                    if(u) Utils.openSafe(mainSites[b.dataset.site].replace('{username}', u));
                });
            });

            container.querySelectorAll('.extra-tool').forEach(b => {
                b.addEventListener('click', () => {
                    const u = this.elements.input.value.trim();
                    if (!u) return;
                    
                    const currentSite = this.detectSite(); 
                    let url = '';
            
                    switch (b.dataset.type) {
                        case 'schedule': url = `https://www.cbhours.com/user/${u}.html`; break;
                        case 'stats': url = `https://statbate.com/search/1/${u}`; break;
                        case 'find':
                            const prefix = currentSite === 'stripchat' ? 'sc' : 'cb';
                            url = `https://camgirlfinder.net/models/${prefix}/${u}`;
                            break;
                    }
                    if (url) Utils.openSafe(url);
                });
            });

            container.querySelector('#cam-save-btn').addEventListener('click', () => {
                const u = this.elements.input.value.trim();
                if(!u) return;
                if(ProfileManager.add(u)) this.toast(`Saved ${u}`);
                else this.toast('Already saved');
            });
        },

        renderSettings: function(container) {
            container.innerHTML = `
                <div class="cam-section">
                    <div class="cam-section-head">Data Management</div>
                    <button class="cam-btn" id="btn-export">📤 Export JSON</button>
                    <button class="cam-btn" id="btn-import">📥 Import JSON</button>
                    <input type="file" id="file-import" style="display:none" accept=".json">
                </div>
                <div style="text-align:center; color:var(--cam-text-muted); font-size:12px; margin-top:30px;">
                    Cam ARNA v2.1.1
                </div>
            `;

            container.querySelector('#btn-export').onclick = () => {
                const data = JSON.stringify(ProfileManager.get());
                const blob = new Blob([data], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'cam_rna_backup.json';
                a.click();
                URL.revokeObjectURL(url);
            };

            const fInput = container.querySelector('#file-import');
            container.querySelector('#btn-import').onclick = () => fInput.click();
            fInput.onchange = (e) => {
                if(!e.target.files[0]) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const list = JSON.parse(ev.target.result);
                        if(Array.isArray(list) && list.every(item => typeof item === 'string' && Utils.isValidUsername(item))) {
                            Storage.set('cam_profiles', list);
                            this.toast(`Imported ${list.length} profiles`);
                            this.renderSaved();
                        } else { throw new Error(); }
                    } catch(err) { this.toast('Error: Invalid JSON file'); }
                };
                reader.readAsText(e.target.files[0]);
            };
        },

        close: function() {
            const bd = document.querySelector('.cam-backdrop');
            const ct = document.querySelector('.cam-container');
            if(bd) bd.remove();
            if(ct) ct.remove();
            this.isOpen = false;
        },

        onUserChange: async function(username) {
            if(!username) return;

            document.querySelectorAll('.archive-link').forEach(b => b.classList.remove('unavailable', 'checking'));

            const status = document.getElementById('archive-status');
            if(status) status.innerText = "Checking...";

            let avail = 0;
            const btns = Array.from(document.querySelectorAll('.archive-link'));
            
            const promises = btns.map(async b => {
                if(!b.isConnected) return;
                b.classList.add('checking');
                const ok = await PageChecker.checkPage(b.dataset.url.replace('{username}', username));
                if(b.isConnected) { 
                    b.classList.remove('checking');
                    if(!ok) b.classList.add('unavailable');
                    else avail++;
                }
            });

            await Promise.allSettled(promises);
            if(status && status.isConnected) status.innerText = `${avail} found`;
        },

        renderSaved: function() {
            try {
                const list = ProfileManager.get();
                const el = document.getElementById('saved-list');
                const empty = document.getElementById('saved-empty');
                if(!el) return;

                if(list.length === 0) {
                    el.style.display = 'none';
                    empty.style.display = 'block';
                } else {
                    el.style.display = 'block';
                    empty.style.display = 'none';
                    el.innerHTML = '';
                    
                    list.forEach(u => {
                        const row = document.createElement('div');
                        row.style.cssText = "padding:12px 16px; border-bottom:1px solid var(--cam-border); display:flex; justify-content:space-between; align-items:center;";
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.style.fontWeight = "600";
                        nameSpan.textContent = u;
                        
                        const actions = document.createElement('div');
                        actions.style.cssText = "display:flex; gap:8px;";
                        
                        const btnCB = document.createElement('button');
                        btnCB.textContent = '🧡';
                        btnCB.style.cssText = "border:none; background:none; cursor:pointer;";
                        btnCB.onclick = () => Utils.openSafe(`https://chaturbate.com/${u}/`);
                        
                        const btnSC = document.createElement('button');
                        btnSC.textContent = '💜';
                        btnSC.style.cssText = "border:none; background:none; cursor:pointer;";
                        btnSC.onclick = () => Utils.openSafe(`https://stripchat.com/${u}`);
                        
                        const btnDel = document.createElement('button');
                        btnDel.textContent = '🗑️';
                        btnDel.style.cssText = "border:none; background:none; cursor:pointer;";
                        btnDel.onclick = () => {
                            ProfileManager.remove(u);
                            this.renderSaved();
                        };
                        
                        actions.append(btnCB, btnSC, btnDel);
                        row.append(nameSpan, actions);
                        el.appendChild(row);
                    });
                }
            } catch(e) { console.error("Render error", e); }
        },

        toast: function(msg) {
            const t = document.createElement('div');
            t.className = 'cam-toast';
            t.textContent = msg;
            document.body.appendChild(t);
            setTimeout(() => t.remove(), 3000);
        }
    };

    function init() {
        injectStyles();
        const fab = document.createElement('button');
        fab.id = 'cam-fab';
        fab.textContent = '⚡';
        fab.onclick = () => UI.createMenu();
        document.body.appendChild(fab);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();