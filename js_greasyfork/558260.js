// ==UserScript==
// @name         W2G Full Theater + Panels + Helpers (v15)
// @namespace    kalila.w2g
// @version      1.5
// @description  Full-theater player on w2g + edge hover panels + script settings (auto-join, auto-refresh, native controls, auto-unmute, auto-start, Twitch helpers)
// @match        https://w2g.tv/*
// @match        https://player.w2g.tv/*
// @match        https://www.youtube.com/embed/*
// @match        https://player.twitch.tv/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/558260/W2G%20Full%20Theater%20%2B%20Panels%20%2B%20Helpers%20%28v15%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558260/W2G%20Full%20Theater%20%2B%20Panels%20%2B%20Helpers%20%28v15%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HOST = window.location.hostname;

    // -----------------------------
    // GM storage fallback wrapper
    // -----------------------------
    function gmGetValue(key, defaultValue) {
        try {
            if (typeof GM_getValue === 'function') {
                return GM_getValue(key, defaultValue);
            }
        } catch (e) {
            console.error('[W2G Script] GM_getValue error, falling back to localStorage', e);
        }
        try {
            const v = window.localStorage.getItem(key);
            return v === null ? defaultValue : v;
        } catch (e) {
            console.error('[W2G Script] localStorage get error', e);
            return defaultValue;
        }
    }

    function gmSetValue(key, value) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(key, value);
                return;
            }
        } catch (e) {
            console.error('[W2G Script] GM_setValue error, falling back to localStorage', e);
        }
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            console.error('[W2G Script] localStorage set error', e);
        }
    }

    // -----------------------------
    // Settings storage
    // -----------------------------
    const SETTINGS_KEY = 'w2g_master_settings_v1';

    const defaultSettings = {
        autoJoinRoom: true,
        autoRefreshDisconnect: false, // default OFF per user preference
        enableNativeControls: true,
        autoUnmute: true,
        autoStartPlayback: true,
        autoStartTwitch: true,
        autoUnmuteTwitch: true
    };

    function loadSettings() {
        try {
            const raw = gmGetValue(SETTINGS_KEY, null);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            console.error('[W2G Script] Failed to load settings', e);
            return { ...defaultSettings };
        }
    }

    function saveSettings(settings) {
        try {
            gmSetValue(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('[W2G Script] Failed to save settings', e);
        }
    }

    let SETTINGS = loadSettings();

    // -----------------------------
    // Native Controls injection (page context, main site only)
    // -----------------------------
    function syncNativeEnabledFlag() {
        try {
            const s = document.createElement('script');
            s.textContent = ';window.W2G_NATIVE_ENABLED = ' + (SETTINGS.enableNativeControls ? 'true' : 'false') + ';';
            (document.documentElement || document.head || document.body).appendChild(s);
            s.remove();
        } catch (e) {
            console.error('[W2G Script] Failed to sync native enabled flag', e);
        }
    }

    function pageMain() {
        const poll = 200;
        const loadTimeout = 60000;
        const enableTimeout = 60000;
        const nativeTimeout = 60000;
        const rearm = 500;

        function log(m) {
            try {
                console.log('[W2G Native]', m);
            } catch (e) {}
        }

        function q(root, sel) {
            try {
                return root.querySelector(sel);
            } catch (e) {
                return null;
            }
        }

        function qa(root, sel) {
            try {
                const n = root.querySelectorAll(sel);
                return n ? n : [];
            } catch (e) {
                return [];
            }
        }

        function findNativeMenu(root) {
            let el = q(root, '.player_popup .popup_item[title^="Enable native player controls"]');
            if (el) return el;

            const items = qa(root, '.player_popup .popup_item');
            for (const it of items) {
                const lbl = q(it, '.popup_label');
                if (lbl && lbl.textContent && lbl.textContent.trim().toLowerCase() === 'native controls') {
                    return it;
                }
            }

            for (const node of qa(root, '*')) {
                if (node.shadowRoot) {
                    const r = findNativeMenu(node.shadowRoot);
                    if (r) return r;
                }
            }
            for (const f of qa(root, 'iframe')) {
                try {
                    const d = f.contentDocument;
                    if (d) {
                        const r = findNativeMenu(d);
                        if (r) return r;
                    }
                } catch (e) {}
            }
            return null;
        }

        function isActive(el) {
            return el && el.classList && el.classList.contains('active');
        }

        function click(el) {
            try {
                el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                return true;
            } catch (e) {
                log('click failed ' + e);
                return false;
            }
        }

        function waitForIframeLoad(cb) {
            const start = Date.now();
            const iv = setInterval(() => {
                const ifr = document.getElementById('w2g-npa-frame');
                if (ifr) {
                    if (ifr.complete) {
                        clearInterval(iv);
                        cb(ifr);
                        return;
                    }
                    ifr.addEventListener(
                        'load',
                        function onl() {
                            ifr.removeEventListener('load', onl);
                            clearInterval(iv);
                            cb(ifr);
                        },
                        { once: true }
                    );
                    return;
                }
                if (Date.now() - start > loadTimeout) {
                    clearInterval(iv);
                    log('timeout waiting for #w2g-npa-frame');
                    cb(null);
                }
            }, poll);
        }

        function waitForUserGesture(cb) {
            let done = false;
            function finish(type) {
                if (done) return;
                done = true;
                window.removeEventListener('pointerdown', onPointer, true);
                window.removeEventListener('keydown', onKey, true);
                cb(type);
            }
            function onPointer() {
                finish('pointer');
            }
            function onKey() {
                finish('key');
            }
            window.addEventListener('pointerdown', onPointer, true);
            window.addEventListener('keydown', onKey, true);
            log('waiting for user gesture...');
        }

        function waitForNativeVisible(cb) {
            const start = Date.now();
            const iv = setInterval(() => {
                const vid = document.getElementById('w2g-native');
                if (vid && getComputedStyle(vid).display !== 'none') {
                    clearInterval(iv);
                    cb(vid);
                    return;
                }
                if (Date.now() - start > nativeTimeout) {
                    clearInterval(iv);
                    log('timeout waiting for #w2g-native visible');
                    cb(null);
                }
            }, poll);
        }

        function enableNativeAfterGesture() {
            if (!window.W2G_NATIVE_ENABLED) {
                log('native controls disabled by settings; skipping');
                return;
            }

            waitForIframeLoad((ifr) => {
                if (!ifr) {
                    log('no iframe; abort enable until next route');
                    return;
                }
                waitForUserGesture(() => {
                    const start = Date.now();
                    const iv = setInterval(() => {
                        const item = findNativeMenu(document);
                        if (item) {
                            if (!isActive(item)) click(item);
                            clearInterval(iv);
                            waitForNativeVisible((vid) => {
                                if (vid) {
                                    try {
                                        vid.play().catch(() => {});
                                    } catch (e) {}
                                    log('native visible, attempted play');
                                } else {
                                    log('native not visible after enable');
                                }
                            });
                            return;
                        }
                        if (Date.now() - start > enableTimeout) {
                            clearInterval(iv);
                            log('timeout: native controls item not found after gesture');
                        }
                    }, poll);
                });
            });
        }

        const ps = history.pushState.bind(history);
        history.pushState = function () {
            const r = ps.apply(this, arguments);
            setTimeout(enableNativeAfterGesture, rearm);
            return r;
        };

        const rs = history.replaceState.bind(history);
        history.replaceState = function () {
            const r = rs.apply(this, arguments);
            setTimeout(enableNativeAfterGesture, rearm);
            return r;
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            enableNativeAfterGesture();
        } else {
            window.addEventListener('DOMContentLoaded', enableNativeAfterGesture, { once: true });
        }
    }

    function injectNativeBootstrap(initialEnabled) {
        try {
            const s = document.createElement('script');
            s.textContent =
                ';(function(){' +
                'window.W2G_NATIVE_ENABLED = ' +
                (initialEnabled ? 'true' : 'false') +
                ';(' +
                pageMain.toString() +
                ')();' +
                '})();';
            (document.documentElement || document.head || document.body).appendChild(s);
            s.remove();
        } catch (e) {
            console.error('[W2G Script] Failed to inject native controls bootstrap', e);
        }
    }

    if (HOST === 'w2g.tv') {
        injectNativeBootstrap(SETTINGS.enableNativeControls);
        syncNativeEnabledFlag();
    }

    // -----------------------------
    // Helpers for theater layout etc. (main site)
    // -----------------------------
    function injectCSS(css) {
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(selector);
            if (existing) return resolve(existing);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.documentElement || document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for ' + selector));
            }, timeout);
        });
    }

    function applyTheaterLayout() {
        injectCSS(`
            html, body {
                background: #000 !important;
                height: 100% !important;
                margin: 0 !important;
                overflow: hidden !important;
            }

            #player_container {
                position: fixed !important;
                top: 50px !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                max-width: 100vw !important;
                height: calc(100vh - 50px) !important;
                max-height: none !important;
                margin: 0 auto !important;
                background: #000 !important;
                z-index: 90 !important;
            }

            #player_container::before {
                display: none !important;
                padding-top: 0 !important;
            }

            #w2g-video,
            #w2g-video iframe,
            #w2g-player,
            #w2g-player iframe {
                width: 100% !important;
                height: 100% !important;
            }

            .w2g-theater-apps-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                max-height: 30vh !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                z-index: 115 !important;
                padding-top: 0 !important;
                margin: 0 !important;
                padding-left: 8px !important;
                padding-right: 8px !important;
            }

            [class*="h-[50vh]"] {
                display: none !important;
                height: 0 !important;
                min-height: 0 !important;
            }

            .w2g-userlist-linked {
                position: fixed !important;
                left: 110px !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: 125 !important;
                transition: transform 0.2s ease-out;
            }

            .w2g-userlist-hidden {
                transform: translateY(100%);
            }

            .w2g-userlist-visible {
                transform: translateY(0);
            }

            .w2g-left-panel-solid,
            .w2g-right-panel-solid,
            .w2g-top-panel-solid,
            .w2g-userlist-linked {
                background-color: #000 !important;
                background: #000 !important;
                backdrop-filter: none !important;
            }

            /* Extra bottom margin so we don't clip content at the bottom of center panel */
            .grow.flex.pb-8.flex-col.items-center.justify-between.text-base.max-w-full {
                margin-bottom: 30px !important;
            }
        `);
    }

    function findDivByClassParts(parts) {
        const divs = Array.from(document.querySelectorAll('div'));
        return (
            divs.find((el) => {
                const cls = el.className || '';
                return parts.every((p) => cls.includes(p));
            }) || null
        );
    }

    function setupSimpleEdgePanel({ panel, side, zoneSize = 16, z = 120 }) {
        if (!panel) return;

        panel.style.position = 'fixed';
        panel.style.zIndex = String(z);
        panel.style.transition = 'transform 0.2s ease-out';

        let showTransform = '';
        let hideTransform = '';

        const zone = document.createElement('div');
        zone.style.position = 'fixed';
        zone.style.zIndex = String(z - 1);
        zone.style.pointerEvents = 'auto';

        if (side === 'right') {
            panel.style.top = '50px';
            panel.style.right = '0';
            panel.style.height = 'calc(100vh - 50px)';
            hideTransform = 'translateX(100%)';
            showTransform = 'translateX(0)';

            Object.assign(zone.style, {
                top: '0',
                right: '0',
                width: zoneSize + 'px',
                height: 'calc(100vh - 120px)'
            });
        } else if (side === 'top') {
            panel.style.top = '0';
            panel.style.left = '0';
            panel.style.right = '0';
            hideTransform = 'translateY(-110%)';
            showTransform = 'translateY(0)';

            Object.assign(zone.style, {
                top: '0',
                left: '0',
                right: '0',
                height: zoneSize + 'px'
            });
        } else {
            return;
        }

        panel.style.transform = hideTransform;
        document.body.appendChild(zone);

        let inside = false;
        const hideDelay = 200;

        function show() {
            inside = true;
            panel.style.transform = showTransform;
        }

        function hide() {
            inside = false;
            setTimeout(() => {
                if (!inside) {
                    panel.style.transform = hideTransform;
                }
            }, hideDelay);
        }

        zone.addEventListener('mouseenter', show);
        zone.addEventListener('mouseleave', hide);
        panel.addEventListener('mouseenter', show);
        panel.addEventListener('mouseleave', hide);
    }

    function setupLeftPanelWithUserlist({ leftPanel, userlist, zoneSize = 16, z = 130 }) {
        if (!leftPanel || !userlist) return;

        leftPanel.style.position = 'fixed';
        leftPanel.style.top = '0';
        leftPanel.style.left = '0';
        leftPanel.style.height = '100vh';
        leftPanel.style.zIndex = String(z);
        leftPanel.style.transition = 'transform 0.2s ease-out';
        leftPanel.style.transform = 'translateX(-100%)';
        leftPanel.classList.add('w2g-left-panel-solid');

        if (userlist.parentNode !== document.body) {
            userlist.parentNode.removeChild(userlist);
            document.body.appendChild(userlist);
        }
        userlist.classList.add('w2g-userlist-linked', 'w2g-userlist-hidden');

        const zone = document.createElement('div');
        Object.assign(zone.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: zoneSize + 'px',
            height: 'calc(100vh - 120px)',
            zIndex: String(z - 1),
            pointerEvents: 'auto'
        });
        document.body.appendChild(zone);

        let hoverCount = 0;
        const hideDelay = 200;

        function openBoth() {
            leftPanel.style.transform = 'translateX(0)';
            userlist.classList.remove('w2g-userlist-hidden');
            userlist.classList.add('w2g-userlist-visible');
        }

        function scheduleClose() {
            setTimeout(() => {
                if (hoverCount === 0) {
                    leftPanel.style.transform = 'translateX(-100%)';
                    userlist.classList.remove('w2g-userlist-visible');
                    userlist.classList.add('w2g-userlist-hidden');
                }
            }, hideDelay);
        }

        function onEnter() {
            hoverCount++;
            openBoth();
        }

        function onLeave() {
            hoverCount = Math.max(hoverCount - 1, 0);
            scheduleClose();
        }

        zone.addEventListener('mouseenter', onEnter);
        zone.addEventListener('mouseleave', onLeave);
        leftPanel.addEventListener('mouseenter', onEnter);
        leftPanel.addEventListener('mouseleave', onLeave);
        userlist.addEventListener('mouseenter', onEnter);
        userlist.addEventListener('mouseleave', onLeave);
    }

    // -----------------------------
    // Script settings UI (main site)
    // -----------------------------
    let openSettingsModal = null;

    function createSettingsModal() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed',
            inset: '0',
            background: 'rgba(0,0,0,0.65)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
        });

        const panel = document.createElement('div');
        Object.assign(panel.style, {
            background: '#111',
            color: '#fff',
            padding: '16px',
            minWidth: '260px',
            maxWidth: '360px',
            borderRadius: '6px',
            border: '1px solid #555',
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.7)'
        });

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:8px;">Script Settings</div>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-auto-join">
                Auto click "Join the Room"
            </label>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-auto-refresh">
                Auto refresh on disconnect modal
            </label>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-auto-unmute">
                Automatically Unmute video (handled in player frame)
            </label>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-auto-start">
                Auto start playback (YouTube player in W2G)
            </label>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-twitch-start">
                Auto start Twitch (overlay play button)
            </label>

            <label style="display:block; margin-bottom:6px;">
                <input type="checkbox" id="w2g-setting-twitch-unmute">
                Auto unmute Twitch ("Click to unmute" or mute button)
            </label>

            <label style="display:block; margin-bottom:10px;">
                <input type="checkbox" id="w2g-setting-native-controls">
                Enable native player controls after gesture
            </label>

            <div style="text-align:right; margin-top:10px;">
                <button id="w2g-settings-cancel" style="margin-right:6px;">Cancel</button>
                <button id="w2g-settings-save">Save</button>
            </div>
        `;

        modal.appendChild(panel);
        document.body.appendChild(modal);

        function closeModal() {
            modal.style.display = 'none';
        }

        function applySettingsFromForm() {
            const autoJoin = panel.querySelector('#w2g-setting-auto-join').checked;
            const autoRefresh = panel.querySelector('#w2g-setting-auto-refresh').checked;
            const autoUnmute = panel.querySelector('#w2g-setting-auto-unmute').checked;
            const autoStart = panel.querySelector('#w2g-setting-auto-start').checked;
            const twitchStart = panel.querySelector('#w2g-setting-twitch-start').checked;
            const twitchUnmute = panel.querySelector('#w2g-setting-twitch-unmute').checked;
            const nativeControls = panel.querySelector('#w2g-setting-native-controls').checked;

            SETTINGS = {
                ...SETTINGS,
                autoJoinRoom: autoJoin,
                autoRefreshDisconnect: autoRefresh,
                autoUnmute: autoUnmute,
                autoStartPlayback: autoStart,
                autoStartTwitch: twitchStart,
                autoUnmuteTwitch: twitchUnmute,
                enableNativeControls: nativeControls
            };

            saveSettings(SETTINGS);
            updateFeaturesFromSettings();
            console.log('[W2G Script] Settings updated:', SETTINGS);
        }

        panel.querySelector('#w2g-settings-cancel').addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });

        panel.querySelector('#w2g-settings-save').addEventListener('click', (e) => {
            e.preventDefault();
            applySettingsFromForm();
            closeModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        openSettingsModal = () => {
            panel.querySelector('#w2g-setting-auto-join').checked = !!SETTINGS.autoJoinRoom;
            panel.querySelector('#w2g-setting-auto-refresh').checked = !!SETTINGS.autoRefreshDisconnect;
            panel.querySelector('#w2g-setting-auto-unmute').checked = !!SETTINGS.autoUnmute;
            panel.querySelector('#w2g-setting-auto-start').checked = !!SETTINGS.autoStartPlayback;
            panel.querySelector('#w2g-setting-twitch-start').checked = !!SETTINGS.autoStartTwitch;
            panel.querySelector('#w2g-setting-twitch-unmute').checked = !!SETTINGS.autoUnmuteTwitch;
            panel.querySelector('#w2g-setting-native-controls').checked = !!SETTINGS.enableNativeControls;

            modal.style.display = 'flex';
        };

        window.addEventListener('keydown', (e) => {
            if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey && (e.key === 's' || e.key === 'S')) {
                if (openSettingsModal) {
                    e.preventDefault();
                    openSettingsModal();
                }
            }
        });
    }

    function injectSidebarSettingsButton() {
        const invite = document.getElementById('sidebar-invite');
        if (!invite || !invite.parentElement) return;

        const parent = invite.parentElement;
        if (parent.querySelector('.kalila-script-settings')) return;

        const a = document.createElement('a');
        a.href = '#';
        a.className = 'kalila-script-settings group flex flex-col items-center';
        a.title = 'Script settings';

        a.innerHTML = `
            <div class="p-2 rounded-md group-hover:bg-w2g-bright-var relative">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sliders-h" class="svg-inline--fa fa-sliders-h fa-fw fa-lg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M496 96H416.4c-8.3-18.6-27-32-48.4-32s-40.1 13.4-48.4 32H16C7.2 96 0 103.2 0 112v32c0 8.8 7.2 16 16 16h303.6c8.3 18.6 27 32 48.4 32s40.1-13.4 48.4-32H496c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16zM496 240H208.4c-8.3-18.6-27-32-48.4-32s-40.1 13.4-48.4 32H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h95.6c8.3 18.6 27 32 48.4 32s40.1-13.4 48.4-32H496c8.8 0 16-7.2 16-16V256c0-8.8-7.2-16-16-16zM496 384H352.4c-8.3-18.6-27-32-48.4-32s-40.1 13.4-48.4 32H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h239.6c8.3 18.6 27 32 48.4 32s40.1-13.4 48.4-32H496c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16z"></path></svg>
            </div>
            <span class="capitalize text-xs text-center max-w-full overflow-hidden text-ellipsis">Script</span>
        `;

        parent.insertBefore(a, invite);

        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (openSettingsModal) {
                openSettingsModal();
            }
        });
    }

    // -----------------------------
    // Auto Join "Join the Room" (main site)
    // -----------------------------
    function tryJoinRoom() {
        if (!SETTINGS.autoJoinRoom) return;

        const modal = document.querySelector('#intro-modal');
        const joinBtn = document.querySelector('#w2g-join-button');

        if (modal && joinBtn) {
            const isVisible = modal.offsetParent !== null && getComputedStyle(modal).display !== 'none';
            if (isVisible) {
                console.log('[W2G Script] Join modal visible, clicking "Join the Room"...');
                joinBtn.click();
            }
        }
    }

    let autoJoinObserverStarted = false;

    function setupAutoJoin() {
        if (autoJoinObserverStarted) return;
        autoJoinObserverStarted = true;

        window.addEventListener('load', () => {
            setTimeout(tryJoinRoom, 1500);
        });

        const observer = new MutationObserver(() => tryJoinRoom());
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    // -----------------------------
    // Auto Unmute (player frame)
    // -----------------------------
    function setupAutoUnmuteInPlayer() {
        if (!SETTINGS.autoUnmute) {
            console.log('[W2G Script] Auto-unmute is disabled in settings; skipping player auto-unmute.');
            return;
        }

        console.log('[W2G Script] Auto-unmute: starting player scan for Unmute button...');

        let attempts = 0;
        const maxAttempts = 60;
        const intervalMs = 500;

        const iv = setInterval(() => {
            attempts++;

            const btn = document.querySelector('div.player_button.unmute');
            if (!btn) {
                if (attempts % 10 === 0) {
                    console.log('[W2G Script] Auto-unmute: .player_button.unmute not found yet (attempt ' + attempts + ')');
                }
            } else {
                const style = getComputedStyle(btn);
                const visible =
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    btn.offsetParent !== null;

                console.log(
                    '[W2G Script] Auto-unmute: found button, visible=' +
                        visible +
                        ', display=' +
                        style.display +
                        ', visibility=' +
                        style.visibility
                );

                if (visible) {
                    console.log('[W2G Script] Auto-unmute: clicking Unmute button in player frame...');
                    btn.click();
                    clearInterval(iv);
                    return;
                }
            }

            if (attempts >= maxAttempts) {
                console.log('[W2G Script] Auto-unmute: giving up after ' + attempts + ' attempts in player frame.');
                clearInterval(iv);
            }
        }, intervalMs);
    }

    // -----------------------------
    // Auto Start Playback (player frame, YouTube)
    // -----------------------------
    function setupAutoStartPlaybackInPlayer() {
        if (!SETTINGS.autoStartPlayback) {
            console.log('[W2G Script] Auto-start playback is disabled in settings; skipping.');
            return;
        }

        console.log('[W2G Script] Auto-start: starting attempts to play YouTube video via postMessage...');

        let attempts = 0;
        const maxAttempts = 40;
        const intervalMs = 750;

        const iv = setInterval(() => {
            attempts++;

            const ytFrame =
                document.querySelector('iframe[src*="youtube.com/embed"]') ||
                document.querySelector('iframe[src*="youtube-nocookie.com/embed"]');

            if (!ytFrame) {
                if (attempts % 10 === 0) {
                    console.log('[W2G Script] Auto-start: no YouTube iframe found yet (attempt ' + attempts + ')');
                }
            } else if (ytFrame.contentWindow) {
                try {
                    const msg = JSON.stringify({
                        event: 'command',
                        func: 'playVideo',
                        args: []
                    });

                    ytFrame.contentWindow.postMessage(msg, '*');
                    console.log('[W2G Script] Auto-start: sent playVideo command to YouTube (attempt ' + attempts + ')');
                } catch (e) {
                    console.log('[W2G Script] Auto-start: postMessage failed: ' + e);
                }
            }

            if (attempts >= maxAttempts) {
                console.log('[W2G Script] Auto-start: giving up after ' + attempts + ' attempts.');
                clearInterval(iv);
            }
        }, intervalMs);
    }

    // -----------------------------
    // Auto Refresh on Disconnect Modal (main site)
    // -----------------------------
    let disconnectIntervalId = null;

    function checkDisconnectModal() {
        if (!SETTINGS.autoRefreshDisconnect) return;

        const modal = document.querySelector('#alert-modal');
        if (!modal) return;

        const style = getComputedStyle(modal);
        if (style.display === 'none' || style.visibility === 'hidden' || modal.offsetParent === null) {
            return;
        }

        const txt = modal.textContent || '';
        if (
            txt.includes('Error \u2013 you have been disconnected') ||
            txt.includes('Error - you have been disconnected')
        ) {
            console.log('[W2G Script] Disconnect modal detected - refreshing page...');
            location.reload();
        }
    }

    function ensureDisconnectWatcherRunning() {
        if (disconnectIntervalId != null) return;
        disconnectIntervalId = setInterval(checkDisconnectModal, 2000);
    }

    function stopDisconnectWatcher() {
        if (disconnectIntervalId != null) {
            clearInterval(disconnectIntervalId);
            disconnectIntervalId = null;
        }
    }

    // -----------------------------
    // Apply settings to features (main site)
    // -----------------------------
    function updateFeaturesFromSettings() {
        syncNativeEnabledFlag();

        if (SETTINGS.autoRefreshDisconnect) {
            ensureDisconnectWatcherRunning();
        } else {
            stopDisconnectWatcher();
        }

        console.log('[W2G Script] Features updated from settings (main site).');
    }

    // -----------------------------
    // Main init for main site
    // -----------------------------
    async function initMainSite() {
        try {
            await waitForElement('#player_container');
        } catch (e) {
            return;
        }

        applyTheaterLayout();

        const leftPanel = findDivByClassParts(['w-[110px]', 'backdrop-blur-sm', 'h-dvh', 'z-[130]']);
        const bottomUsers = findDivByClassParts(['bg-w2g-dark-userlist', 'border-t', 'h-[100px]']);

        if (leftPanel && bottomUsers) {
            setupLeftPanelWithUserlist({
                leftPanel,
                userlist: bottomUsers,
                zoneSize: 16,
                z: 130
            });
        }

        const topPanel = findDivByClassParts(['h-[50px]', 'bg-w2g-very-dark-var']);
        const bottomApps = document.querySelector('div.w2g-bind-apps.py-4');

        if (topPanel) {
            let topOverlay = topPanel;

            if (bottomApps && bottomApps.parentNode) {
                const overlay = document.createElement('div');
                overlay.className = 'w2g-theater-apps-overlay w2g-top-panel-solid';

                topPanel.parentNode.insertBefore(overlay, topPanel);
                overlay.appendChild(topPanel);
                overlay.appendChild(bottomApps);

                topOverlay = overlay;
            } else {
                topPanel.classList.add('w2g-top-panel-solid');
            }

            setupSimpleEdgePanel({
                panel: topOverlay,
                side: 'top',
                zoneSize: 16,
                z: 115
            });
        }

        const rightPanel = document.getElementById('w2g-right');
        if (rightPanel) {
            rightPanel.classList.add('w2g-right-panel-solid');
            setupSimpleEdgePanel({
                panel: rightPanel,
                side: 'right',
                zoneSize: 16,
                z: 120
            });
        }

        const centerPanel = findDivByClassParts(['grow', 'pb-8', 'max-h-[580px]']);
        if (centerPanel) {
            centerPanel.style.marginBottom = '30px';
        }

        createSettingsModal();
        injectSidebarSettingsButton();

        setupAutoJoin();

        updateFeaturesFromSettings();

        console.log(
            '[W2G Script] Main site init complete. autoUnmute =',
            SETTINGS.autoUnmute,
            ', autoStartPlayback =',
            SETTINGS.autoStartPlayback,
            ', autoStartTwitch =',
            SETTINGS.autoStartTwitch,
            ', autoUnmuteTwitch =',
            SETTINGS.autoUnmuteTwitch,
            ' (player/twitch handled in their frames).'
        );
    }

    // -----------------------------
    // Main init for W2G player frame
    // -----------------------------
    function initPlayerFrame() {
        console.log(
            '[W2G Script] Player frame init. autoUnmute =',
            SETTINGS.autoUnmute,
            ', autoStartPlayback =',
            SETTINGS.autoStartPlayback
        );
        setupAutoUnmuteInPlayer();
        setupAutoStartPlaybackInPlayer();
    }

    // -----------------------------
    // Twitch helpers
    // -----------------------------
    function setupTwitchAutoStart() {
        if (!SETTINGS.autoStartTwitch) {
            console.log('[W2G Script] Twitch auto-start disabled in settings; skipping.');
            return;
        }

        console.log('[W2G Script] Twitch auto-start: scanning for overlay play button...');

        let attempts = 0;
        const maxAttempts = 60;
        const intervalMs = 500;

        const iv = setInterval(() => {
            attempts++;

            const btn = document.querySelector('button[data-a-target="player-overlay-play-button"]');
            if (btn) {
                const style = getComputedStyle(btn);
                const visible =
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    btn.offsetParent !== null;

                console.log(
                    '[W2G Script] Twitch auto-start: found overlay play button, visible=' +
                        visible +
                        ' (attempt ' +
                        attempts +
                        ')'
                );

                if (visible) {
                    console.log('[W2G Script] Twitch auto-start: clicking overlay play button...');
                    btn.click();
                    clearInterval(iv);
                    return;
                }
            } else if (attempts % 10 === 0) {
                console.log('[W2G Script] Twitch auto-start: overlay play button not found yet (attempt ' + attempts + ')');
            }

            if (attempts >= maxAttempts) {
                console.log('[W2G Script] Twitch auto-start: giving up after ' + attempts + ' attempts.');
                clearInterval(iv);
            }
        }, intervalMs);
    }

    function setupTwitchAutoUnmute() {
        if (!SETTINGS.autoUnmuteTwitch) {
            console.log('[W2G Script] Twitch auto-unmute disabled in settings; skipping.');
            return;
        }

        console.log('[W2G Script] Twitch auto-unmute: observer mode enabled.');

        let didAutoUnmute = false;

        function findUnmuteTarget(root) {
            const overlay = root.querySelector('.click-to-unmute__container');
            if (overlay) return overlay;

            const muteBtn = root.querySelector(
                'button[data-a-target="player-mute-unmute-button"][aria-label^="Unmute"]'
            );
            if (muteBtn) return muteBtn;

            return null;
        }

        function tryClick(reason) {
            if (didAutoUnmute) return false;

            const target = findUnmuteTarget(document);
            if (!target) return false;

            const style = getComputedStyle(target);
            const visible =
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                target.offsetParent !== null;

            console.log(
                '[W2G Script] Twitch auto-unmute: candidate from ' +
                    reason +
                    ', visible=' +
                    visible
            );

            if (!visible) return false;

            console.log('[W2G Script] Twitch auto-unmute: clicking target from ' + reason + '...');
            target.click();
            didAutoUnmute = true;
            return true;
        }

        setTimeout(() => {
            tryClick('initial timeout');
        }, 1500);

        const observer = new MutationObserver((mutations) => {
            if (didAutoUnmute) return;

            for (const m of mutations) {
                if (didAutoUnmute) break;

                if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
                    if (tryClick('mutation childList')) break;
                }

                if (
                    m.type === 'attributes' &&
                    m.target &&
                    m.target.matches('button[data-a-target="player-mute-unmute-button"]')
                ) {
                    if (tryClick('mutation attributes')) break;
                }
            }
        });

        observer.observe(document.documentElement || document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['aria-label', 'style', 'class']
        });
    }

    // -----------------------------
    // Main init for Twitch embed frame
    // -----------------------------
    function initTwitchFrame() {
        console.log(
            '[W2G Script] Twitch frame init. autoStartTwitch =',
            SETTINGS.autoStartTwitch,
            ', autoUnmuteTwitch =',
            SETTINGS.autoUnmuteTwitch
        );
        setupTwitchAutoStart();
        setupTwitchAutoUnmute();
    }

    // -----------------------------
    // Entry point
    // -----------------------------
    function init() {
        if (HOST === 'w2g.tv') {
            initMainSite();
        } else if (HOST === 'player.w2g.tv') {
            initPlayerFrame();
        } else if (HOST === 'player.twitch.tv') {
            initTwitchFrame();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
