// ==UserScript==
// @name           WZW Tools
// @version        5.6.0
// @author         k0gasa
// @description    Polished UI (Animations/Hover) + Fetch Support + WebSocket
// @match          *://www.woozworld.com/*
// @match          *://application.woozworld.com/*
// @match          *://client.woozworld.com/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @connect        k0gasa.pythonanywhere.com
// @connect        pythonanywhere.com
// @connect        localhost
// @connect        sfox.woozworld.com
// @run-at         document-start
// @namespace https://greasyfork.org/users/1446917
// @downloadURL https://update.greasyfork.org/scripts/557532/WZW%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/557532/WZW%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEBUG = true;
    const SCRIPT_TAG = '[WW-Interceptor]';
    const YOUR_SERVER_URL = 'https://k0gasa.pythonanywhere.com/ww-data';

    const INTERCEPT_FETCH_URLS = [
        'wamf/KidInventory/getPaginatedContentOfType',
        'instance/changeColors',
        'KidUser/listUnlockablesByType'
    ];
    const INTERCEPT_WS_HOST = 'sfox.woozworld.com';

    // --- Storage Keys ---
    const CATALOG_ENABLED_KEY = 'interceptorEnabled';
    const PODS_INTERCEPTOR_ENABLED_KEY = 'podsInterceptorEnabled';
    const PODS_NUMBERS_KEY = 'podsNumbers';
    const UNLOCKABLES_ENABLED_KEY = 'unlockablesEnabled';

    // --- Assets ---
    const CATALOG_BTN_IMG = 'https://i.imgur.com/MuaNIO1.png';
    const PODS_BTN_IMG = 'https://i.imgur.com/lqd4oJf.png';
    const UNLOCKABLES_BTN_IMG = 'https://i.imgur.com/WPxxbXd.png';

    const log = (...args) => { if (DEBUG) console.log(SCRIPT_TAG, ...args); };
    const error = (...args) => console.error(SCRIPT_TAG, ...args);

    // ========================================================================
    // 1. UI LOGIC (Main Page)
    // ========================================================================

    if (window.location.href.includes('www.woozworld.com')) {
        injectCustomStyles();
        setupMainPage();
    }

    function injectCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Base Button Style */
            .ww-interceptor-btn {
                width: 34px;
                height: 34px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                transform-origin: center;
                user-select: none;

                /* OFF default: greyscale */
                filter: grayscale(100%) brightness(1) opacity(1) !important;
            }

            /* Hover state when OFF: show in COLOR */
            .ww-interceptor-btn:not(.active):hover {
                filter: grayscale(0%) brightness(1) opacity(1) !important;
                transform: scale(1.1);
            }

            /* Click Press Effect (Tiny shrink) */
            .ww-interceptor-btn:active {
                transform: scale(0.95) !important;
                transition: transform 0.1s ease;
            }

            /* Active State (ON) */
            .ww-interceptor-btn.active {
                filter: grayscale(0%) brightness(1) drop-shadow(0 0 2px rgba(255,255,255,0.3)) !important;
                transform: scale(1.05);
                opacity: 1;
            }

            /* Hover state when ON (Glow harder) */
            .ww-interceptor-btn.active:hover {
                filter: grayscale(0%) brightness(1.15) drop-shadow(0 0 6px rgba(255,255,255,0.7)) !important;
                transform: scale(1.15);
            }
        `;
        document.head.appendChild(style);
    }

    function setupMainPage() {
        function addButtonsWhenReady() {
             const tabsList = document.getElementById('tabs');
             const refTab = document.querySelector('.tab_link');

             if (tabsList && refTab) {
                const navHeight = window.getComputedStyle(refTab).height || '46px';

                if (!document.getElementById('ww-catalog-toggle')) addCatalogButton(tabsList, navHeight);
                if (!document.getElementById('ww-pods-container')) addPodsDropdown(tabsList, navHeight);
                if (!document.getElementById('ww-unlock-toggle')) addUnlockablesButton(tabsList, navHeight);
             } else {
                setTimeout(addButtonsWhenReady, 500);
             }
        }
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            addButtonsWhenReady();
        } else {
            window.addEventListener('DOMContentLoaded', addButtonsWhenReady);
        }
    }

    function addCatalogButton(parentList, height) {
        const container = createBtnContainer('ww-catalog-toggle', height);
        const img = createBtnImage(CATALOG_BTN_IMG, 'Toggle Catalog');

        let enabled = GM_getValue(CATALOG_ENABLED_KEY, false);
        updateState(img, enabled);

        img.addEventListener('click', () => {
            enabled = !enabled;
            GM_setValue(CATALOG_ENABLED_KEY, enabled);
            updateState(img, enabled);
            log('Catalog Toggled:', enabled);
        });

        container.appendChild(img);
        parentList.appendChild(container);
    }

    function addUnlockablesButton(parentList, height) {
        const container = createBtnContainer('ww-unlock-toggle', height);
        const img = createBtnImage(UNLOCKABLES_BTN_IMG, 'Toggle Unlockables');

        let enabled = GM_getValue(UNLOCKABLES_ENABLED_KEY, false);
        updateState(img, enabled);

        img.addEventListener('click', () => {
            enabled = !enabled;
            GM_setValue(UNLOCKABLES_ENABLED_KEY, enabled);
            updateState(img, enabled);
            log('Unlockables Toggled:', enabled);
        });

        container.appendChild(img);
        parentList.appendChild(container);
    }

    function addPodsDropdown(parentList, height) {
        const container = createBtnContainer('ww-pods-container', height);
        const img = createBtnImage(PODS_BTN_IMG, 'PODS Menu');

        // Dropdown Panel
        const panel = document.createElement('div');
        panel.style.cssText = 'display:none; position:fixed; background:rgba(30,30,30,0.95); border:1px solid #555; border-radius:8px; padding:15px; z-index:99999; width:200px; color:white; font-family:Lato,sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(5px);';

        const input = document.createElement('input');
        input.placeholder = 'e.g. 123, 456, 789';
        input.style.cssText = 'width:100%; padding:8px; margin-bottom:10px; border-radius:4px; border:1px solid #444; background:#222; color:white; box-sizing:border-box;';

        const btn = document.createElement('button');
        btn.style.cssText = 'width:100%; padding:8px; cursor:pointer; border-radius:4px; border:none; color:white; font-weight:bold; transition: background 0.2s;';

        const statusTxt = document.createElement('div');
        statusTxt.style.cssText = 'font-size:11px; margin-top:8px; text-align:center; color:#aaa;';

        panel.appendChild(input);
        panel.appendChild(btn);
        panel.appendChild(statusTxt);
        document.body.appendChild(panel);

        let enabled = GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
        let isOpen = false;

        function updateUI() {
            updateState(img, enabled);
            const storedNums = JSON.parse(GM_getValue(PODS_NUMBERS_KEY, '[]')).join(', ');

            if (enabled) {
                input.value = storedNums;
                input.disabled = true;
                btn.textContent = 'DEACTIVATE';
                btn.style.background = '#cc3300';
                btn.onmouseover = () => btn.style.background = '#ff4411';
                btn.onmouseout = () => btn.style.background = '#cc3300';
                statusTxt.textContent = 'Active. Type !buy in world';
                statusTxt.style.color = '#4f4';
            } else {
                input.disabled = false;
                btn.textContent = 'ACTIVATE';
                btn.style.background = '#0088cc';
                btn.onmouseover = () => btn.style.background = '#00aaff';
                btn.onmouseout = () => btn.style.background = '#0088cc';
                statusTxt.textContent = 'Inactive';
                statusTxt.style.color = '#aaa';
            }
        }

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            if (isOpen) {
                const rect = container.getBoundingClientRect();
                panel.style.top = (rect.bottom + 10) + 'px';
                panel.style.left = rect.left + 'px';
                panel.style.display = 'block';
                updateUI();
            } else {
                panel.style.display = 'none';
            }
        });

        btn.addEventListener('click', () => {
            if (enabled) {
                enabled = false;
                GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
            } else {
                const parts = input.value.split(',').map(s => s.trim()).filter(n => !isNaN(n) && n !== '');
                if (parts.length !== 3) {
                    alert('Please enter exactly 3 numbers separated by commas.');
                    return;
                }
                GM_setValue(PODS_NUMBERS_KEY, JSON.stringify(parts));
                enabled = true;
                GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, true);
            }
            updateUI();
        });

        document.addEventListener('click', (e) => {
            if (isOpen && !panel.contains(e.target) && !img.contains(e.target)) {
                isOpen = false;
                panel.style.display = 'none';
            }
        });

        container.appendChild(img);
        parentList.appendChild(container);
        updateUI();
    }

    // --- UI Helpers ---
    function createBtnContainer(id, height) {
        const d = document.createElement('li');
        d.id = id;
        d.style.cssText = `float:left; margin-left:12px; display:flex; align-items:center; height:${height};`;
        return d;
    }

    function createBtnImage(src, tooltip) {
        const i = document.createElement('img');
        i.src = src;
        i.title = tooltip;
        i.className = 'ww-interceptor-btn';
        return i;
    }

    function updateState(img, isActive) {
        if (isActive) {
            img.classList.add('active');
        } else {
            img.classList.remove('active');
        }
    }

    // ========================================================================
    // 2. INTERCEPTION LOGIC (Game Iframe)
    // ========================================================================

    if (window.location.href.includes('client.woozworld.com')) {
        log('Game Client Detected - Installing Hooks...');
        setupFetchInterception();
        setupWebSocketInterception();
    }

    function setupFetchInterception() {
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(resource, init) {
            let url = (resource instanceof Request) ? resource.url : resource;
            let type = null;
            if (url) {
                if (url.includes('getPaginatedContentOfType') && GM_getValue(CATALOG_ENABLED_KEY, false)) type = 'getPaginatedContentOfType';
                else if (url.includes('changeColors') && GM_getValue(CATALOG_ENABLED_KEY, false)) type = 'changeColors';
                else if (url.includes('listUnlockablesByType') && GM_getValue(UNLOCKABLES_ENABLED_KEY, false)) type = 'listUnlockablesByType';
            }

            if (!type) return originalFetch.apply(this, arguments);
            log('Intercepting Fetch:', type);

            if (!init && resource instanceof Request) {
                init = { method: resource.method, headers: resource.headers, body: resource.body };
            }

            try {
                let reqBodyB64 = '';
                if (init && init.body) reqBodyB64 = await convertBodyToBase64(init.body);

                const origResp = await originalFetch.apply(this, arguments);
                const origRespClone = origResp.clone();
                const origBuf = await origRespClone.arrayBuffer();
                const origB64 = arrayBufferToBase64(origBuf);

                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: YOUR_SERVER_URL,
                        data: JSON.stringify({
                            requestData: reqBodyB64,
                            originalResponse: origB64,
                            requestType: type,
                            dataFormat: 'base64'
                        }),
                        headers: { 'Content-Type': 'application/json' },
                        responseType: 'arraybuffer',
                        onload: (pyResp) => {
                            if (pyResp.status === 200) {
                                resolve(new Response(pyResp.response, { status: 200, statusText: 'OK', headers: origResp.headers }));
                            } else {
                                resolve(new Response(origBuf, { status: origResp.status, headers: origResp.headers }));
                            }
                        },
                        onerror: () => resolve(new Response(origBuf, { status: origResp.status, headers: origResp.headers }))
                    });
                });
            } catch (e) {
                error('Fetch Hook Error:', e);
                return originalFetch.apply(this, arguments);
            }
        };
    }

    function setupWebSocketInterception() {
        const OriginalWebSocket = unsafeWindow.WebSocket;
        unsafeWindow.WebSocket = function(url, protocols) {
            const ws = new OriginalWebSocket(url, protocols);
            if (!url.includes(INTERCEPT_WS_HOST)) return ws;
            const send = ws.send;
            ws.send = function(data) {
                if (!GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false)) return send.apply(this, arguments);
                handleWsSend(this, data, send);
            };
            return ws;
        };
        Object.assign(unsafeWindow.WebSocket, OriginalWebSocket);
        unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
    }

    async function handleWsSend(ws, data, originalSend) {
        let dataB64 = '';
        if (typeof data === 'string') dataB64 = btoa(data);
        else if (data instanceof ArrayBuffer) dataB64 = arrayBufferToBase64(data);
        else if (data instanceof Uint8Array) dataB64 = arrayBufferToBase64(data.buffer);
        else return originalSend.call(ws, data);

        GM_xmlhttpRequest({
            method: 'POST',
            url: YOUR_SERVER_URL,
            data: JSON.stringify({
                requestType: 'websocketMessage',
                messageData: dataB64,
                podsNumbers: JSON.parse(GM_getValue(PODS_NUMBERS_KEY, '[]'))
            }),
            headers: { 'Content-Type': 'application/json' },
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        const json = JSON.parse(res.responseText);
                        if (json.modifiedMessageData) {
                            const bin = base64ToArrayBuffer(json.modifiedMessageData);
                            originalSend.call(ws, bin);
                            log('Sent Modified WS Message (PODS)');
                        } else {
                            originalSend.call(ws, data);
                        }
                    } catch(e) { originalSend.call(ws, data); }
                } else {
                    originalSend.call(ws, data);
                }
            },
            onerror: () => originalSend.call(ws, data)
        });
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        const binary_string = atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
        return bytes.buffer;
    }

    async function convertBodyToBase64(body) {
        if (typeof body === 'string') return btoa(body);
        if (body instanceof Blob) return arrayBufferToBase64(await body.arrayBuffer());
        if (body instanceof ArrayBuffer) return arrayBufferToBase64(body);
        return '';
    }

})();
