// ==UserScript==
// @name         qBittorrent Torrent Interceptor
// @namespace    https://github.com/joshkerr/qbit-tampermonkey
// @version      1.7.4.1
// @description  Intercept torrent downloads and magnet links, send them to qBittorrent
// @author       joshkerr
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @license MIT
// @connect      *
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/559264/qBittorrent%20Torrent%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/559264/qBittorrent%20Torrent%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - Edit these values
    // ============================================
    const CONFIG = {
        // qBittorrent Web UI settings
        qbittorrent: {
            url: GM_getValue('qbit_url', 'http://localhost:8080'),
            username: GM_getValue('qbit_username', 'admin'),
            password: GM_getValue('qbit_password', 'adminadmin'),
        },
        // Default save path (leave empty for qBittorrent default)
        savePath: GM_getValue('qbit_savepath', ''),
        // Category for added torrents (leave empty for none)
        category: GM_getValue('qbit_category', ''),
        // Automatically start torrent after adding
        autoStart: GM_getValue('qbit_autostart', true),
        // Use Automatic Torrent Management (lets qBittorrent manage save paths by category)
        autoTMM: GM_getValue('qbit_autotmm', true),
        // Show notifications
        showNotifications: GM_getValue('qbit_notifications', true),
        // Show confirmation dialog before adding
        showConfirmation: GM_getValue('qbit_confirmation', true),
    };

    // Session ID for qBittorrent authentication
    let qbitSessionId = null;

    // ============================================
    // STYLES
    // ============================================
    GM_addStyle(`
        .qbit-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        .qbit-modal {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            color: #000;
        }
        .qbit-modal-dark {
            background: #1e1e1e;
            color: #fff;
        }
        .qbit-modal h2 {
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .qbit-modal-content {
            margin-bottom: 20px;
        }
        .qbit-modal label {
            display: block;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .qbit-modal input[type="text"],
        .qbit-modal input[type="password"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
            margin-top: 4px;
        }
        .qbit-modal-dark input[type="text"],
        .qbit-modal-dark input[type="password"] {
            background: #2d2d2d;
            border-color: #444;
            color: #fff;
        }
        .qbit-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        .qbit-modal button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            font-weight: 500;
        }
        .qbit-btn-primary {
            background: #2196F3;
            color: white;
        }
        .qbit-btn-primary:hover {
            background: #1976D2;
        }
        .qbit-btn-secondary {
            background: #e0e0e0;
            color: #333;
        }
        .qbit-btn-secondary:hover {
            background: #d0d0d0;
        }
        .qbit-modal-dark .qbit-btn-secondary {
            background: #444;
            color: #fff;
        }
        .qbit-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 14px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 999999;
            animation: qbit-slide-in 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .qbit-toast-success {
            background: #4CAF50;
        }
        .qbit-toast-error {
            background: #f44336;
        }
        .qbit-toast-info {
            background: #2196F3;
        }
        @keyframes qbit-slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .qbit-torrent-name {
            font-weight: 500;
            word-break: break-all;
            background: rgba(0,0,0,0.1);
            padding: 8px 10px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 13px;
        }
    `);

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function showToast(message, type = 'info') {
        if (!CONFIG.showNotifications) return;

        const toast = document.createElement('div');
        toast.className = `qbit-toast qbit-toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'qbit-slide-in 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function showModal(title, content, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'qbit-modal-overlay';

        const modal = document.createElement('div');
        modal.className = `qbit-modal ${isDarkMode() ? 'qbit-modal-dark' : ''}`;

        modal.innerHTML = `
            <h2>${title}</h2>
            <div class="qbit-modal-content">${content}</div>
            <div class="qbit-modal-buttons">
                <button class="qbit-btn-secondary" id="qbit-cancel">Cancel</button>
                <button class="qbit-btn-primary" id="qbit-confirm">Add to qBittorrent</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('qbit-confirm').onclick = () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        };

        document.getElementById('qbit-cancel').onclick = () => {
            overlay.remove();
            if (onCancel) onCancel();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        };
    }

    function showConfigModal() {
        const overlay = document.createElement('div');
        overlay.className = 'qbit-modal-overlay';

        const modal = document.createElement('div');
        modal.className = `qbit-modal ${isDarkMode() ? 'qbit-modal-dark' : ''}`;

        modal.innerHTML = `
            <h2>⚙️ qBittorrent Settings</h2>
            <div class="qbit-modal-content">
                <label>
                    qBittorrent URL:
                    <input type="text" id="qbit-cfg-url" value="${CONFIG.qbittorrent.url}" placeholder="http://localhost:8080">
                </label>
                <label>
                    Username:
                    <input type="text" id="qbit-cfg-username" value="${CONFIG.qbittorrent.username}">
                </label>
                <label>
                    Password:
                    <input type="password" id="qbit-cfg-password" value="${CONFIG.qbittorrent.password}">
                </label>
                <label>
                    Default Save Path (optional):
                    <input type="text" id="qbit-cfg-savepath" value="${CONFIG.savePath}" placeholder="/downloads/torrents">
                </label>
                <label>
                    Category (optional):
                    <input type="text" id="qbit-cfg-category" value="${CONFIG.category}">
                </label>
            </div>
            <div class="qbit-modal-buttons">
                <button class="qbit-btn-secondary" id="qbit-cfg-cancel">Cancel</button>
                <button class="qbit-btn-primary" id="qbit-cfg-save">Save Settings</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('qbit-cfg-save').onclick = () => {
            const url = document.getElementById('qbit-cfg-url').value.replace(/\/$/, '');
            const username = document.getElementById('qbit-cfg-username').value;
            const password = document.getElementById('qbit-cfg-password').value;
            const savePath = document.getElementById('qbit-cfg-savepath').value;
            const category = document.getElementById('qbit-cfg-category').value;

            GM_setValue('qbit_url', url);
            GM_setValue('qbit_username', username);
            GM_setValue('qbit_password', password);
            GM_setValue('qbit_savepath', savePath);
            GM_setValue('qbit_category', category);

            CONFIG.qbittorrent.url = url;
            CONFIG.qbittorrent.username = username;
            CONFIG.qbittorrent.password = password;
            CONFIG.savePath = savePath;
            CONFIG.category = category;

            // Reset session to force re-auth
            qbitSessionId = null;

            overlay.remove();
            showToast('Settings saved!', 'success');
        };

        document.getElementById('qbit-cfg-cancel').onclick = () => {
            overlay.remove();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }

    // ============================================
    // QBITTORRENT API
    // ============================================

    // Detect Safari/iPadOS (for informational purposes and special handling)
    // iPadOS in desktop mode reports as Macintosh, so we check multiple signals
    const isSafari = (() => {
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isMacSafari = /Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua);
        const hasTouchScreen = navigator.maxTouchPoints > 1;
        // iPadOS in desktop mode: reports as Mac but has touch screen
        const isIPadOS = isMacSafari && hasTouchScreen;
        return isIOS || isIPadOS || isMacSafari;
    })();

    // Force fetch mode - can be toggled via menu for troubleshooting
    // NOTE: Fetch mode is OFF by default because it's blocked by CORS
    // GM_xmlhttpRequest bypasses CORS restrictions
    let forceFetchMode = GM_getValue('qbit_force_fetch', false);

    // Determine if we should use fetch - now OFF by default (requires explicit opt-in)
    const shouldUseFetch = () => forceFetchMode;

    // Track if we've shown the Safari session helper
    let safariSessionPopup = null;
    let safariSessionEstablished = GM_getValue('qbit_safari_session', false);

    // Helper to establish session on Safari/iPadOS by opening qBittorrent in a popup
    async function establishSafariSession() {
        return new Promise((resolve) => {
            const popupWidth = 600;
            const popupHeight = 500;
            const left = (screen.width - popupWidth) / 2;
            const top = (screen.height - popupHeight) / 2;

            showToast('Opening qBittorrent to establish session...', 'info');

            safariSessionPopup = window.open(
                CONFIG.qbittorrent.url,
                'qbit_session',
                `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes`
            );

            if (!safariSessionPopup) {
                showToast('Popup blocked! Please allow popups for this site.', 'error');
                resolve(false);
                return;
            }

            // Show instructions
            showModal(
                '🔑 Establish qBittorrent Session',
                `<p>A popup window has opened to qBittorrent.</p>
                 <p><strong>Instructions:</strong></p>
                 <ol style="margin: 10px 0; padding-left: 20px;">
                   <li>Log in to qBittorrent in the popup</li>
                   <li>Once logged in, click "Done" below</li>
                 </ol>
                 <p style="color: #888; font-size: 12px;">This establishes browser cookies needed for Safari/iPadOS.</p>`,
                () => {
                    // User clicked Done
                    if (safariSessionPopup && !safariSessionPopup.closed) {
                        safariSessionPopup.close();
                    }
                    safariSessionPopup = null;
                    safariSessionEstablished = true;
                    GM_setValue('qbit_safari_session', true);
                    showToast('Session established! Retrying...', 'success');
                    resolve(true);
                },
                () => {
                    // User clicked Cancel
                    if (safariSessionPopup && !safariSessionPopup.closed) {
                        safariSessionPopup.close();
                    }
                    safariSessionPopup = null;
                    resolve(false);
                }
            );

            // Change button text
            setTimeout(() => {
                const confirmBtn = document.getElementById('qbit-confirm');
                if (confirmBtn) {
                    confirmBtn.textContent = 'Done - I\'m logged in';
                }
            }, 100);
        });
    }

    // Use native fetch for qBittorrent API (better cookie handling on Safari/iPadOS)
    // Note: Requires CSRF protection disabled in qBittorrent for Safari/iPadOS
    async function qbitRequestFetch(endpoint, method, data, headers = {}) {
        const url = `${CONFIG.qbittorrent.url}${endpoint}`;

        const fetchOptions = {
            method: method,
            credentials: 'include', // Send cookies
            headers: { ...headers }
        };

        if (data) {
            fetchOptions.body = data;
        }

        console.log(`qBittorrent API (fetch): ${method} ${endpoint}`);

        try {
            const response = await fetch(url, fetchOptions);
            const responseText = await response.text();
            return {
                status: response.status,
                responseText: responseText,
                responseHeaders: [...response.headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
            };
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Extract origin (scheme + host) from URL for CSRF headers
    function getOriginFromUrl(urlString) {
        try {
            const url = new URL(urlString);
            return url.origin; // Returns "https://example.com" without path
        } catch (e) {
            // Fallback: extract origin manually
            const match = urlString.match(/^(https?:\/\/[^\/]+)/);
            return match ? match[1] : urlString;
        }
    }

    // Use GM_xmlhttpRequest (works on desktop browsers, can set headers)
    function qbitRequestGM(endpoint, method, data, headers = {}, isLogin = false) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.qbittorrent.url}${endpoint}`;
            const origin = getOriginFromUrl(CONFIG.qbittorrent.url);

            // Build headers with CSRF protection bypass
            // Origin must be just scheme+host (no path), Referer can include path
            const requestHeaders = {
                'Referer': CONFIG.qbittorrent.url + '/',
                'Origin': origin,
                ...headers
            };

            const requestOptions = {
                method: method,
                url: url,
                headers: requestHeaders,
                data: data,
                withCredentials: true,
                anonymous: false,
                onload: function(response) {
                    resolve(response);
                },
                onerror: function(error) {
                    reject(error);
                }
            };

            // Add session cookie for authenticated requests
            // Only set if we have a real SID (not placeholder values)
            const hasRealSid = qbitSessionId &&
                              qbitSessionId !== 'no-sid-cookie' &&
                              qbitSessionId !== 'safari-auto';

            if (hasRealSid && !isLogin) {
                requestOptions.cookie = `SID=${qbitSessionId}`;
                requestHeaders['Cookie'] = `SID=${qbitSessionId}`;
                console.log(`  → Cookie: SID=${qbitSessionId.substring(0, 8)}...`);
            } else if (!isLogin) {
                // No manual cookie - rely on withCredentials to send browser cookies
                console.log(`  → Cookie: (relying on browser cookies via withCredentials)`);
            }

            console.log(`qBittorrent API (GM): ${method} ${endpoint}`, isLogin ? '(login)' : `(SID: ${hasRealSid ? 'manual' : 'browser'})`);
            console.log(`  → URL: ${url}`);
            console.log(`  → Origin: ${origin}`);
            console.log(`  → Referer: ${requestHeaders['Referer']}`);

            GM_xmlhttpRequest(requestOptions);
        });
    }

    // Smart request function - uses fetch on Safari/iPadOS or when forced, GM_xmlhttpRequest elsewhere
    async function qbitRequest(endpoint, method, data, headers = {}, isLogin = false) {
        if (shouldUseFetch()) {
            return qbitRequestFetch(endpoint, method, data, headers);
        } else {
            return qbitRequestGM(endpoint, method, data, headers, isLogin);
        }
    }

    async function qbitLogin(offerSafariHelper = true) {
        try {
            const formData = `username=${encodeURIComponent(CONFIG.qbittorrent.username)}&password=${encodeURIComponent(CONFIG.qbittorrent.password)}`;

            const response = await qbitRequest(
                '/api/v2/auth/login',
                'POST',
                formData,
                { 'Content-Type': 'application/x-www-form-urlencoded' },
                true // isLogin flag
            );

            if (response.status === 200 && response.responseText === 'Ok.') {
                // When using fetch, cookies are handled by the browser automatically
                // When using GM_xmlhttpRequest, extract SID from response headers
                if (!shouldUseFetch()) {
                    const cookies = response.responseHeaders;
                    console.log('qBittorrent: Login response headers:', cookies);
                    const sidMatch = cookies.match(/SID=([^;]+)/i);
                    if (sidMatch) {
                        qbitSessionId = sidMatch[1];
                        GM_setValue('qbit_session', qbitSessionId);
                        console.log('qBittorrent: Login successful, SID:', qbitSessionId.substring(0, 8) + '...');
                    } else {
                        console.warn('qBittorrent: Login succeeded but no SID cookie found in response');
                        // Even without explicit SID, mark as logged in (server may use different auth)
                        qbitSessionId = 'no-sid-cookie';
                    }
                } else {
                    // On Safari, mark as authenticated (browser handles cookie)
                    qbitSessionId = 'safari-auto';
                    console.log('qBittorrent: Login successful (Safari - browser handles cookies)');
                }
                return true;
            } else if (response.status === 403) {
                console.log('qBittorrent: 403 on login - may be CSRF or cookie issue');
                // On Safari, 403 might be due to cookie/CORS issues
                if (isSafari && offerSafariHelper) {
                    console.log('qBittorrent: Safari detected, offering session helper');
                    const established = await establishSafariSession();
                    if (established) {
                        // Retry login after session established
                        return await qbitLogin(false);
                    }
                }
                showToast('qBittorrent: Access denied (403). Try "Establish Session" from menu.', 'error');
                return false;
            } else {
                showToast('qBittorrent: Invalid username or password', 'error');
                console.log('qBittorrent login failed:', response.status, response.responseText);
                return false;
            }
        } catch (error) {
            console.error('qBittorrent login error:', error);
            // On Safari, network errors might be CORS issues
            if (isSafari && offerSafariHelper) {
                console.log('qBittorrent: Safari connection error, offering session helper');
                const established = await establishSafariSession();
                if (established) {
                    return await qbitLogin(false);
                }
            }
            showToast('qBittorrent: Connection failed. Check your settings.', 'error');
            return false;
        }
    }

    async function ensureAuthenticated() {
        // When using fetch, try making a request first - browser may already have valid cookies
        if (shouldUseFetch()) {
            try {
                const response = await qbitRequest('/api/v2/app/version', 'GET', null);
                if (response.status === 200) {
                    console.log('qBittorrent: Already authenticated (Safari cookies valid)');
                    qbitSessionId = 'safari-auto';
                    return true;
                }
            } catch (e) {
                console.log('qBittorrent: Safari auth check failed, will login');
            }
            return await qbitLogin();
        }

        // For non-Safari: try to restore session from storage
        if (!qbitSessionId) {
            qbitSessionId = GM_getValue('qbit_session', null);
        }

        // Check if we're already authenticated by making a simple API call
        if (qbitSessionId) {
            try {
                const response = await qbitRequest('/api/v2/app/version', 'GET', null);
                if (response.status === 200) {
                    return true;
                }
                // Session expired, clear it
                qbitSessionId = null;
                GM_setValue('qbit_session', null);
            } catch (e) {
                // Not authenticated, proceed to login
                qbitSessionId = null;
            }
        }

        return await qbitLogin();
    }

    async function addTorrentByUrl(url, torrentName = '', retryCount = 0) {
        if (!await ensureAuthenticated()) {
            return false;
        }

        try {
            // Build form data
            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);
            let formBody = '';

            // Add URL
            formBody += `--${boundary}\r\n`;
            formBody += 'Content-Disposition: form-data; name="urls"\r\n\r\n';
            formBody += url + '\r\n';

            // Add save path if configured
            if (CONFIG.savePath) {
                formBody += `--${boundary}\r\n`;
                formBody += 'Content-Disposition: form-data; name="savepath"\r\n\r\n';
                formBody += CONFIG.savePath + '\r\n';
            }

            // Add category if configured
            if (CONFIG.category) {
                formBody += `--${boundary}\r\n`;
                formBody += 'Content-Disposition: form-data; name="category"\r\n\r\n';
                formBody += CONFIG.category + '\r\n';
            }

            // Auto-start setting
            if (!CONFIG.autoStart) {
                formBody += `--${boundary}\r\n`;
                formBody += 'Content-Disposition: form-data; name="paused"\r\n\r\n';
                formBody += 'true\r\n';
            }

            // Automatic Torrent Management - lets qBittorrent manage save paths
            // If user has configured a custom savePath, disable autoTMM so their path is used
            const useAutoTMM = CONFIG.autoTMM && !CONFIG.savePath;
            formBody += `--${boundary}\r\n`;
            formBody += 'Content-Disposition: form-data; name="autoTMM"\r\n\r\n';
            formBody += (useAutoTMM ? 'true' : 'false') + '\r\n';

            formBody += `--${boundary}--\r\n`;

            const response = await qbitRequest(
                '/api/v2/torrents/add',
                'POST',
                formBody,
                { 'Content-Type': `multipart/form-data; boundary=${boundary}` }
            );

            if (response.status === 200 && response.responseText === 'Ok.') {
                const displayName = torrentName || (url.startsWith('magnet:') ? 'Magnet link' : 'Torrent');
                showToast(`Added: ${displayName}`, 'success');
                return true;
            } else if (response.status === 415) {
                showToast('qBittorrent: Torrent file is not valid', 'error');
                return false;
            } else if (response.status === 403 && retryCount < 1) {
                // Session might have expired or CSRF issue - force re-login and retry
                console.log('qBittorrent: Got 403, forcing re-login...');
                qbitSessionId = null;
                GM_setValue('qbit_session', null);
                return await addTorrentByUrl(url, torrentName, retryCount + 1);
            } else {
                showToast(`qBittorrent: Failed to add torrent (${response.status})`, 'error');
                console.log('qBittorrent add torrent failed:', response.status, response.responseText, response.responseHeaders);
                return false;
            }
        } catch (error) {
            showToast('qBittorrent: Error adding torrent', 'error');
            console.error('Add torrent error:', error);
            return false;
        }
    }

    async function addTorrentByFile(fileBlob, fileName, retryCount = 0) {
        if (!await ensureAuthenticated()) {
            return false;
        }

        try {
            // Read file as ArrayBuffer for proper binary handling
            const reader = new FileReader();
            const arrayBuffer = await new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(fileBlob);
            });

            const fileBytes = new Uint8Array(arrayBuffer);

            // Build multipart form data with proper binary handling
            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);

            // Helper to convert string to Uint8Array
            const stringToBytes = (str) => new TextEncoder().encode(str);

            // Build the parts
            const parts = [];

            // Add torrent file part
            parts.push(stringToBytes(`--${boundary}\r\nContent-Disposition: form-data; name="torrents"; filename="${fileName}"\r\nContent-Type: application/x-bittorrent\r\n\r\n`));
            parts.push(fileBytes);
            parts.push(stringToBytes('\r\n'));

            // Add save path if configured
            if (CONFIG.savePath) {
                parts.push(stringToBytes(`--${boundary}\r\nContent-Disposition: form-data; name="savepath"\r\n\r\n${CONFIG.savePath}\r\n`));
            }

            // Add category if configured
            if (CONFIG.category) {
                parts.push(stringToBytes(`--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\n${CONFIG.category}\r\n`));
            }

            // Auto-start setting
            if (!CONFIG.autoStart) {
                parts.push(stringToBytes(`--${boundary}\r\nContent-Disposition: form-data; name="paused"\r\n\r\ntrue\r\n`));
            }

            // Automatic Torrent Management - lets qBittorrent manage save paths
            // If user has configured a custom savePath, disable autoTMM so their path is used
            const useAutoTMM = CONFIG.autoTMM && !CONFIG.savePath;
            parts.push(stringToBytes(`--${boundary}\r\nContent-Disposition: form-data; name="autoTMM"\r\n\r\n${useAutoTMM ? 'true' : 'false'}\r\n`));

            // End boundary
            parts.push(stringToBytes(`--${boundary}--\r\n`));

            // Concatenate all parts into single Uint8Array
            const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
            const formBody = new Uint8Array(totalLength);
            let offset = 0;
            for (const part of parts) {
                formBody.set(part, offset);
                offset += part.length;
            }

            // Send using binary-aware request
            const response = await qbitRequestBinary(
                '/api/v2/torrents/add',
                formBody,
                boundary
            );

            if (response.status === 200 && response.responseText === 'Ok.') {
                showToast(`Added: ${fileName}`, 'success');
                return true;
            } else if (response.status === 403 && retryCount < 1) {
                // Session might have expired or CSRF issue - force re-login and retry
                console.log('qBittorrent: Got 403, forcing re-login...');
                qbitSessionId = null;
                GM_setValue('qbit_session', null);
                return await addTorrentByFile(fileBlob, fileName, retryCount + 1);
            } else {
                showToast(`qBittorrent: Failed to add torrent (${response.status})`, 'error');
                console.log('qBittorrent upload failed:', response.status, response.responseText);
                return false;
            }
        } catch (error) {
            showToast('qBittorrent: Error uploading torrent file', 'error');
            console.error('Upload torrent error:', error);
            return false;
        }
    }

    // Binary-aware request function for file uploads
    async function qbitRequestBinary(endpoint, binaryData, boundary) {
        const url = `${CONFIG.qbittorrent.url}${endpoint}`;

        // Use fetch on Safari/iPadOS or when forced, for better cookie handling
        if (shouldUseFetch()) {
            console.log('qBittorrent API (fetch binary): POST', endpoint);
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${boundary}`
                    },
                    body: binaryData.buffer
                });
                const responseText = await response.text();
                return {
                    status: response.status,
                    responseText: responseText
                };
            } catch (error) {
                console.error('Fetch binary error:', error);
                throw error;
            }
        }

        // Use GM_xmlhttpRequest for non-Safari
        return new Promise((resolve, reject) => {
            const origin = getOriginFromUrl(CONFIG.qbittorrent.url);
            const requestHeaders = {
                'Referer': CONFIG.qbittorrent.url + '/',
                'Origin': origin,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            };

            const requestOptions = {
                method: 'POST',
                url: url,
                headers: requestHeaders,
                data: binaryData.buffer,
                binary: true,
                withCredentials: true,
                anonymous: false,
                onload: function(response) {
                    resolve(response);
                },
                onerror: function(error) {
                    reject(error);
                }
            };

            // Add session cookie only if we have a real SID
            const hasRealSid = qbitSessionId &&
                              qbitSessionId !== 'no-sid-cookie' &&
                              qbitSessionId !== 'safari-auto';

            if (hasRealSid) {
                requestOptions.cookie = `SID=${qbitSessionId}`;
                requestHeaders['Cookie'] = `SID=${qbitSessionId}`;
            }

            console.log('qBittorrent API (GM binary): POST', endpoint, hasRealSid ? '(manual SID)' : '(browser cookies)');

            GM_xmlhttpRequest(requestOptions);
        });
    }

    // ============================================
    // TORRENT FILE DOWNLOAD HANDLING
    // ============================================

    function downloadTorrentFile(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                // This will include cookies from the current site session
                // which handles authenticated downloads
                withCredentials: true,
                anonymous: false,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    async function handleTorrentDownload(url, fileName) {
        showToast('Downloading torrent file...', 'info');

        try {
            const blob = await downloadTorrentFile(url);
            await addTorrentByFile(blob, fileName);
        } catch (error) {
            // If download failed, try adding by URL (qBittorrent will download it)
            console.log('Direct download failed, trying URL method:', error);
            await addTorrentByUrl(url, fileName);
        }
    }

    // ============================================
    // LINK INTERCEPTION
    // ============================================

    function extractTorrentName(url) {
        // Try to extract name from magnet link
        if (url.startsWith('magnet:')) {
            const dnMatch = url.match(/dn=([^&]+)/);
            if (dnMatch) {
                return decodeURIComponent(dnMatch[1].replace(/\+/g, ' '));
            }
            return 'Magnet link';
        }

        // Try to extract filename from URL
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const fileName = pathParts[pathParts.length - 1];
            if (fileName && fileName.includes('.torrent')) {
                return decodeURIComponent(fileName.replace('.torrent', ''));
            }
        } catch (e) {
            // Invalid URL
        }

        return url.substring(0, 50) + '...';
    }

    function isTorrentUrl(url) {
        if (!url) return false;
        const lowerUrl = url.toLowerCase();
        return lowerUrl.endsWith('.torrent') ||
               lowerUrl.includes('.torrent?') ||
               lowerUrl.includes('/download/torrent') ||
               lowerUrl.includes('/get_torrent') ||
               lowerUrl.includes('action=download') ||
               // Common torrent site patterns
               /\/torrent\/\d+\/download/.test(lowerUrl) ||
               /\/torrents\/download\/\d+/.test(lowerUrl) ||
               /download\.php\?.*torrent/i.test(lowerUrl);
    }

    function isMagnetUrl(url) {
        return url && url.toLowerCase().startsWith('magnet:');
    }

    function handleLink(url, event) {
        const torrentName = extractTorrentName(url);

        if (CONFIG.showConfirmation) {
            event.preventDefault();
            event.stopPropagation();

            const content = `
                <p>Send this to qBittorrent?</p>
                <div class="qbit-torrent-name">${torrentName}</div>
            `;

            showModal('🧲 Add Torrent', content, async () => {
                if (isMagnetUrl(url)) {
                    await addTorrentByUrl(url, torrentName);
                } else {
                    await handleTorrentDownload(url, torrentName + '.torrent');
                }
            });
        } else {
            event.preventDefault();
            event.stopPropagation();

            if (isMagnetUrl(url)) {
                addTorrentByUrl(url, torrentName);
            } else {
                handleTorrentDownload(url, torrentName + '.torrent');
            }
        }
    }

    // Click event listener
    function setupClickInterceptor() {
        document.addEventListener('click', function(event) {
            // Find the closest anchor element
            let target = event.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }

            if (!target || !target.href) return;

            const url = target.href;

            if (isMagnetUrl(url) || isTorrentUrl(url)) {
                handleLink(url, event);
            }
        }, true); // Use capture phase to intercept before other handlers
    }

    // Intercept magnet: protocol handler
    function setupMagnetProtocolInterceptor() {
        // Override window.open for magnet links
        const originalOpen = window.open;
        window.open = function(url, ...args) {
            if (url && isMagnetUrl(url)) {
                const torrentName = extractTorrentName(url);
                if (CONFIG.showConfirmation) {
                    const content = `
                        <p>Send this to qBittorrent?</p>
                        <div class="qbit-torrent-name">${torrentName}</div>
                    `;
                    showModal('🧲 Add Torrent', content, async () => {
                        await addTorrentByUrl(url, torrentName);
                    });
                } else {
                    addTorrentByUrl(url, torrentName);
                }
                return null;
            }
            return originalOpen.call(this, url, ...args);
        };
    }

    // Handle navigation to .torrent URLs
    function setupNavigationInterceptor() {
        // Check if current page is a .torrent download
        if (isTorrentUrl(window.location.href)) {
            // Intercept the download
            const fileName = extractTorrentName(window.location.href) + '.torrent';
            handleTorrentDownload(window.location.href, fileName);
        }
    }

    // ============================================
    // MENU COMMANDS
    // ============================================

    GM_registerMenuCommand('⚙️ Configure qBittorrent', showConfigModal);

    GM_registerMenuCommand('🔗 Add Torrent by URL', () => {
        const url = prompt('Enter torrent URL or magnet link:');
        if (url) {
            if (isMagnetUrl(url)) {
                addTorrentByUrl(url, extractTorrentName(url));
            } else {
                handleTorrentDownload(url, extractTorrentName(url) + '.torrent');
            }
        }
    });

    GM_registerMenuCommand('🔌 Test Connection', async () => {
        showToast('Testing connection...', 'info');
        console.log('qBittorrent: Starting connection test...');
        console.log('qBittorrent: Current SID:', qbitSessionId ? qbitSessionId.substring(0, 8) + '...' : 'none');

        const success = await ensureAuthenticated();
        console.log('qBittorrent: Auth result:', success, 'SID after auth:', qbitSessionId ? qbitSessionId.substring(0, 8) + '...' : 'none');

        if (success) {
            try {
                const response = await qbitRequest('/api/v2/app/version', 'GET', null);
                console.log('qBittorrent: Test response:', response.status, response.responseText);
                if (response.status === 200) {
                    showToast(`Connected to qBittorrent ${response.responseText}`, 'success');
                } else {
                    showToast(`Connection issue: HTTP ${response.status}`, 'error');
                    console.log('qBittorrent test failed - full response:', response);
                }
            } catch (e) {
                showToast('Connected but could not get version', 'info');
                console.error('qBittorrent test error:', e);
            }
        }
    });

    GM_registerMenuCommand('🔄 Force Re-login', async () => {
        // Clear stored session
        qbitSessionId = null;
        GM_setValue('qbit_session', null);
        showToast('Session cleared, logging in...', 'info');
        const success = await qbitLogin();
        if (success) {
            showToast('Re-login successful!', 'success');
        }
    });

    GM_registerMenuCommand('📊 Show qBittorrent Web UI', () => {
        window.open(CONFIG.qbittorrent.url, '_blank');
    });

    GM_registerMenuCommand(`🔀 Toggle Fetch Mode (currently: ${forceFetchMode ? 'ON' : 'OFF'})`, () => {
        forceFetchMode = !forceFetchMode;
        GM_setValue('qbit_force_fetch', forceFetchMode);
        showToast(`Fetch mode: ${forceFetchMode ? 'ON (uses CORS)' : 'OFF (uses GM_xmlhttpRequest)'}. Reload page to apply.`, 'info');
        console.log('qBittorrent: Fetch mode set to:', forceFetchMode ? 'ON' : 'OFF');
    });

    // Always show establish session option - useful for Safari/iPadOS cookie issues
    GM_registerMenuCommand('🔑 Establish Session (Safari/iPadOS)', async () => {
        const established = await establishSafariSession();
        if (established) {
            // Try to authenticate after session established
            await ensureAuthenticated();
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupClickInterceptor();
                setupMagnetProtocolInterceptor();
                setupNavigationInterceptor();
            });
        } else {
            setupClickInterceptor();
            setupMagnetProtocolInterceptor();
            setupNavigationInterceptor();
        }

        console.log('qBittorrent Torrent Interceptor loaded');
        console.log('Browser detection:', isSafari ? 'Safari/iPadOS' : 'Other browser');
        console.log('Touch points:', navigator.maxTouchPoints);
        console.log('Fetch mode:', forceFetchMode ? 'ON' : 'OFF');
        console.log('Using:', shouldUseFetch() ? 'fetch API (CORS required)' : 'GM_xmlhttpRequest (CORS bypass)');

        if (isSafari) {
            console.log('%c📱 Safari/iPadOS detected', 'color: #007aff; font-weight: bold');
            console.log('  Using GM_xmlhttpRequest to bypass CORS restrictions.');
            console.log('  If you experience 403 errors, use the "Establish Session" menu option.');
        }

        if (shouldUseFetch()) {
            console.log('%c⚠️ Fetch mode enabled - CORS required:', 'color: orange; font-weight: bold');
            console.log('  1. Open qBittorrent Web UI → Options → Web UI');
            console.log('  2. Disable "Enable Cross-Site Request Forgery (CSRF) protection"');
            console.log('  3. Configure reverse proxy CORS headers if using one');
        }
    }

    init();
})();
