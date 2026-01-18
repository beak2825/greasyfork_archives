// ==UserScript==
// @name         Cookie Sync
// @namespace    https://github.com/hxueh
// @version      0.0.13
// @description  Sync cookies across browsers using GitHub Gist with E2E encryption (AES-GCM + PBKDF2-SHA256)
// @author       hxueh
// @license      MIT
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23D2691E'/%3E%3Ccircle cx='35' cy='35' r='8' fill='%234A2C0A'/%3E%3Ccircle cx='60' cy='30' r='6' fill='%234A2C0A'/%3E%3Ccircle cx='25' cy='55' r='5' fill='%234A2C0A'/%3E%3Ccircle cx='55' cy='55' r='7' fill='%234A2C0A'/%3E%3Ccircle cx='70' cy='50' r='5' fill='%234A2C0A'/%3E%3Ccircle cx='40' cy='70' r='6' fill='%234A2C0A'/%3E%3Ccircle cx='65' cy='70' r='5' fill='%234A2C0A'/%3E%3C/svg%3E
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_addStyle
// @connect      api.github.com
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563150/Cookie%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/563150/Cookie%20Sync.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        METADATA_FILENAME: 'cookie-sync-metadata.json',
        SALT_LENGTH: 16,
        IV_LENGTH: 12,
        PBKDF2_ITERATIONS: 100000,
        PASSWORD_KEY: 'cookieSync_password',
        TOKEN_KEY: 'cookieSync_githubToken',
        GIST_ID_KEY: 'cookieSync_gistId',
        SYNC_KEYS_KEY: 'cookieSync_syncKeys' // local storage for UI selection: {domain: [keys]}
    };

    // Get filename for a domain
    function getDomainFilename(domain) {
        // Sanitize domain for filename (replace dots, remove leading dots)
        const sanitized = domain.replace(/^\./, '').replace(/[^a-zA-Z0-9.-]/g, '_');
        return `cookies_${sanitized}.json`;
    }

    // Get current domain (root domain for cookie matching)
    function getCurrentDomain() {
        return window.location.hostname;
    }

    // Normalize domain: ensure leading dot for domain cookies (cross-browser compatibility)
    function normalizeDomain(domain) {
        if (!domain) return domain;
        // Add leading dot if not present
        if (!domain.startsWith('.')) {
            return '.' + domain;
        }
        return domain;
    }

    // ==================== Crypto Utilities ====================
    const CryptoUtils = {
        // Convert string to ArrayBuffer
        stringToBuffer(str) {
            return new TextEncoder().encode(str);
        },

        // Convert ArrayBuffer to string
        bufferToString(buffer) {
            return new TextDecoder().decode(buffer);
        },

        // Convert ArrayBuffer to Base64 (modern approach)
        bufferToBase64(buffer) {
            const bytes = new Uint8Array(buffer);
            const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('');
            return btoa(binString);
        },

        // Convert Base64 to ArrayBuffer (modern approach)
        base64ToBuffer(base64) {
            const binString = atob(base64);
            return Uint8Array.from(binString, char => char.codePointAt(0)).buffer;
        },

        // Generate random bytes
        generateRandomBytes(length) {
            return crypto.getRandomValues(new Uint8Array(length));
        },

        // Derive key from password using PBKDF2-SHA256
        async deriveKey(password, salt) {
            const passwordBuffer = this.stringToBuffer(password);
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                passwordBuffer,
                'PBKDF2',
                false,
                ['deriveBits', 'deriveKey']
            );

            return crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: CONFIG.PBKDF2_ITERATIONS,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt', 'decrypt']
            );
        },

        // Encrypt data using AES-GCM
        async encrypt(plaintext, password) {
            const salt = this.generateRandomBytes(CONFIG.SALT_LENGTH);
            const iv = this.generateRandomBytes(CONFIG.IV_LENGTH);
            const key = await this.deriveKey(password, salt);

            const plaintextBuffer = this.stringToBuffer(plaintext);
            const ciphertext = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                plaintextBuffer
            );

            // Combine salt + iv + ciphertext
            const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

            return this.bufferToBase64(combined.buffer);
        },

        // Decrypt data using AES-GCM
        async decrypt(encryptedBase64, password) {
            const combined = new Uint8Array(this.base64ToBuffer(encryptedBase64));

            const salt = combined.slice(0, CONFIG.SALT_LENGTH);
            const iv = combined.slice(CONFIG.SALT_LENGTH, CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH);
            const ciphertext = combined.slice(CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH);

            const key = await this.deriveKey(password, salt);

            const plaintext = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                ciphertext
            );

            return this.bufferToString(plaintext);
        }
    };

    // ==================== GitHub Gist API ====================
    const GistAPI = {
        async request(method, endpoint, data = null) {
            const token = GM_getValue(CONFIG.TOKEN_KEY, '');
            if (!token) {
                throw new Error('GitHub token not configured');
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: `https://api.github.com${endpoint}`,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github+json',
                        'Content-Type': 'application/json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    },
                    data: data ? JSON.stringify(data) : null,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText ? JSON.parse(response.responseText) : null);
                        } else {
                            reject(new Error(`GitHub API error: ${response.status} - ${response.responseText}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`Network error: ${error}`));
                    }
                });
            });
        },

        async createGist(files) {
            // files is an object: { filename: content, ... }
            const filesData = {};
            for (const [filename, content] of Object.entries(files)) {
                filesData[filename] = { content };
            }
            const data = {
                description: 'Cookie Sync Data (Encrypted)',
                public: false,
                files: filesData
            };
            return this.request('POST', '/gists', data);
        },

        async updateGist(gistId, files) {
            // files is an object: { filename: content, ... } or { filename: null } to delete
            const filesData = {};
            for (const [filename, content] of Object.entries(files)) {
                filesData[filename] = content === null ? null : { content };
            }
            const data = { files: filesData };
            return this.request('PATCH', `/gists/${gistId}`, data);
        },

        async getGist(gistId) {
            return this.request('GET', `/gists/${gistId}`);
        },

        async deleteGist(gistId) {
            return this.request('DELETE', `/gists/${gistId}`);
        }
    };

    // ==================== Cookie Manager ====================
    const CookieManager = {
        // Check if a cookie domain matches the current hostname
        domainMatches(cookieDomain, hostname) {
            const normalizedCookieDomain = cookieDomain.replace(/^\./, '').toLowerCase();
            const normalizedHostname = hostname.toLowerCase();

            // Exact match
            if (normalizedCookieDomain === normalizedHostname) {
                return true;
            }

            // Subdomain match (cookie domain .example.com matches www.example.com)
            if (normalizedHostname.endsWith('.' + normalizedCookieDomain)) {
                return true;
            }

            return false;
        },

        async getAllCookies() {
            return new Promise((resolve, reject) => {
                GM_cookie.list({}, (cookies, error) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve(cookies || []);
                    }
                });
            });
        },

        async getCookiesForDomain(domain) {
            const allCookies = await this.getAllCookies();
            return allCookies.filter(cookie => this.domainMatches(cookie.domain, domain));
        },

        async setCookie(cookie) {
            const trySetCookie = (cookieData) => {
                return new Promise((resolve, reject) => {
                    GM_cookie.set(cookieData, (error) => {
                        if (error) {
                            reject(new Error(`${error}`));
                        } else {
                            resolve();
                        }
                    });
                });
            };

            // Build URL matching the cookie's domain
            const domainWithoutDot = (cookie.domain || window.location.hostname).replace(/^\./, '');
            const domainWithDot = '.' + domainWithoutDot;
            const currentUrl = window.location.href;
            const constructedUrl = `https://${domainWithoutDot}${cookie.path || '/'}`;

            // Handle sameSite and secure compatibility
            // Chrome requires: SameSite=None (no_restriction) MUST have Secure=true
            let sameSite = cookie.sameSite ? cookie.sameSite.toLowerCase() : null;
            let secure = typeof cookie.secure === 'boolean' ? cookie.secure : false;

            if (sameSite === 'no_restriction' || sameSite === 'none') {
                if (!secure) {
                    // SameSite=None requires Secure=true, change to lax
                    sameSite = 'lax';
                }
            }

            // Try different combinations
            const attempts = [
                // Attempt 1: Current URL, with domain, with fixed sameSite
                {
                    url: currentUrl,
                    name: cookie.name,
                    value: cookie.value || '',
                    domain: domainWithDot,
                    path: cookie.path || '/',
                    secure: secure,
                    httpOnly: cookie.httpOnly || false,
                    ...(sameSite && ['lax', 'strict', 'no_restriction'].includes(sameSite) ? { sameSite } : {}),
                    ...(cookie.expirationDate > 0 ? { expirationDate: cookie.expirationDate } : {})
                },
                // Attempt 2: Current URL, minimal fields
                {
                    url: currentUrl,
                    name: cookie.name,
                    value: cookie.value || '',
                    path: cookie.path || '/',
                    ...(cookie.expirationDate > 0 ? { expirationDate: cookie.expirationDate } : {})
                },
                // Attempt 3: Constructed URL, with domain
                {
                    url: constructedUrl,
                    name: cookie.name,
                    value: cookie.value || '',
                    domain: domainWithDot,
                    path: cookie.path || '/',
                    ...(cookie.expirationDate > 0 ? { expirationDate: cookie.expirationDate } : {})
                },
                // Attempt 4: Constructed URL, minimal
                {
                    url: constructedUrl,
                    name: cookie.name,
                    value: cookie.value || '',
                    path: cookie.path || '/',
                    ...(cookie.expirationDate > 0 ? { expirationDate: cookie.expirationDate } : {})
                }
            ];

            let lastError;
            for (let i = 0; i < attempts.length; i++) {
                try {
                    await trySetCookie(attempts[i]);
                    return; // Success!
                } catch (e) {
                    lastError = e;
                }
            }

            // All attempts failed
            throw lastError;
        },

        async deleteCookie(cookie) {
            return new Promise((resolve, reject) => {
                GM_cookie.delete({
                    url: `http${cookie.secure ? 's' : ''}://${cookie.domain.replace(/^\./, '')}${cookie.path || '/'}`,
                    name: cookie.name
                }, (error) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        resolve();
                    }
                });
            });
        }
    };

    // ==================== Sync Manager ====================
    const SyncManager = {
        // Get locally selected sync keys for a domain (for UI)
        getLocalSyncKeys(domain) {
            const allKeys = GM_getValue(CONFIG.SYNC_KEYS_KEY, {});
            return allKeys[domain] || [];
        },

        // Set locally selected sync keys for a domain (for UI)
        setLocalSyncKeys(domain, keys) {
            const allKeys = GM_getValue(CONFIG.SYNC_KEYS_KEY, {});
            allKeys[domain] = keys;
            GM_setValue(CONFIG.SYNC_KEYS_KEY, allKeys);
        },

        // Get metadata from Gist
        async getMetadata(password) {
            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');
            if (!gistId) {
                return { domains: [], lastUpdated: null };
            }

            try {
                const gist = await GistAPI.getGist(gistId);
                const metaFile = gist.files[CONFIG.METADATA_FILENAME];
                if (!metaFile) {
                    return { domains: [], lastUpdated: null };
                }
                const decrypted = await CryptoUtils.decrypt(metaFile.content, password);
                return JSON.parse(decrypted);
            } catch (e) {
                return { domains: [], lastUpdated: null };
            }
        },

        // Update metadata in Gist
        async updateMetadata(password, metadata) {
            const encrypted = await CryptoUtils.encrypt(JSON.stringify(metadata), password);
            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');

            if (gistId) {
                await GistAPI.updateGist(gistId, { [CONFIG.METADATA_FILENAME]: encrypted });
            }
            return encrypted;
        },

        async push() {
            const password = GM_getValue(CONFIG.PASSWORD_KEY, '');
            if (!password) {
                throw new Error('Encryption password not set');
            }

            const domain = getCurrentDomain();
            const filename = getDomainFilename(domain);
            const syncKeys = this.getLocalSyncKeys(domain); // empty = sync all

            // Get all cookies for current domain
            let cookies = await CookieManager.getCookiesForDomain(domain);

            if (cookies.length === 0) {
                throw new Error(`No cookies found for ${domain}`);
            }

            // Filter cookies if syncKeys is specified
            if (syncKeys.length > 0) {
                cookies = cookies.filter(c => syncKeys.includes(c.name));
                if (cookies.length === 0) {
                    throw new Error(`No cookies match the selected sync keys`);
                }
            }

            // Convert cookies to key-value format (name as key)
            const cookiesData = {};
            cookies.forEach(cookie => {
                const cookieEntry = {
                    value: cookie.value || '',
                    domain: normalizeDomain(cookie.domain),
                    path: cookie.path || '/'
                };

                // Only add optional fields if they have valid values
                if (typeof cookie.secure === 'boolean') {
                    cookieEntry.secure = cookie.secure;
                }
                if (typeof cookie.httpOnly === 'boolean') {
                    cookieEntry.httpOnly = cookie.httpOnly;
                }
                if (cookie.sameSite) {
                    cookieEntry.sameSite = cookie.sameSite;
                }
                if (cookie.expirationDate && cookie.expirationDate > 0) {
                    cookieEntry.expirationDate = cookie.expirationDate;
                }

                cookiesData[cookie.name] = cookieEntry;
            });

            // Create domain data with syncKeys
            const domainData = {
                timestamp: Date.now(),
                domain: domain,
                syncKeys: syncKeys, // empty array = sync all cookies in file
                cookies: cookiesData
            };

            const encryptedDomain = await CryptoUtils.encrypt(JSON.stringify(domainData), password);

            // Get or create Gist
            let gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');

            if (gistId) {
                // Update existing Gist - get current metadata first
                const metadata = await this.getMetadata(password);

                // Add domain to metadata if not exists
                if (!metadata.domains.includes(domain)) {
                    metadata.domains.push(domain);
                }
                metadata.lastUpdated = Date.now();

                const encryptedMeta = await CryptoUtils.encrypt(JSON.stringify(metadata), password);

                // Update both files
                await GistAPI.updateGist(gistId, {
                    [CONFIG.METADATA_FILENAME]: encryptedMeta,
                    [filename]: encryptedDomain
                });
            } else {
                // Create new Gist with metadata and domain file
                const metadata = {
                    domains: [domain],
                    lastUpdated: Date.now()
                };
                const encryptedMeta = await CryptoUtils.encrypt(JSON.stringify(metadata), password);

                const result = await GistAPI.createGist({
                    [CONFIG.METADATA_FILENAME]: encryptedMeta,
                    [filename]: encryptedDomain
                });
                gistId = result.id;
                GM_setValue(CONFIG.GIST_ID_KEY, gistId);
            }

            return {
                count: Object.keys(cookiesData).length,
                gistId: gistId,
                domain: domain,
                syncKeys: syncKeys
            };
        },

        async pull() {
            const password = GM_getValue(CONFIG.PASSWORD_KEY, '');
            if (!password) {
                throw new Error('Encryption password not set');
            }

            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');
            if (!gistId) {
                throw new Error('Gist ID not configured');
            }

            const domain = getCurrentDomain();
            const filename = getDomainFilename(domain);

            const gist = await GistAPI.getGist(gistId);
            const file = gist.files[filename];
            if (!file) {
                throw new Error(`No synced data found for ${domain}`);
            }

            const decrypted = await CryptoUtils.decrypt(file.content, password);
            const data = JSON.parse(decrypted);

            // Get syncKeys from remote (to save locally)
            const syncKeys = data.syncKeys || [];

            // Apply ALL cookies from remote (ignore syncKeys filtering)
            let successCount = 0;
            let errors = [];
            const appliedKeys = [];

            for (const [name, cookieData] of Object.entries(data.cookies)) {
                try {
                    await CookieManager.setCookie({
                        name: name,
                        ...cookieData
                    });
                    successCount++;
                    appliedKeys.push(name);
                } catch (e) {
                    // Include cookie details for debugging
                    const details = `domain=${cookieData.domain}, path=${cookieData.path}, secure=${cookieData.secure}`;
                    errors.push(`${name}: ${e.message} (${details})`);
                }
            }

            // Update local syncKeys to match remote
            this.setLocalSyncKeys(domain, syncKeys);

            return {
                total: Object.keys(data.cookies).length,
                success: successCount,
                errors: errors,
                timestamp: data.timestamp,
                domain: data.domain,
                syncKeys: syncKeys,
                appliedKeys: appliedKeys
            };
        },

        async deleteRemote() {
            const password = GM_getValue(CONFIG.PASSWORD_KEY, '');
            if (!password) {
                throw new Error('Encryption password not set');
            }

            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');
            if (!gistId) {
                throw new Error('Gist ID not configured');
            }

            const domain = getCurrentDomain();
            const filename = getDomainFilename(domain);

            // Update metadata to remove this domain
            const metadata = await this.getMetadata(password);
            metadata.domains = metadata.domains.filter(d => d !== domain);
            metadata.lastUpdated = Date.now();

            const encryptedMeta = await CryptoUtils.encrypt(JSON.stringify(metadata), password);

            // Delete domain file and update metadata
            await GistAPI.updateGist(gistId, {
                [CONFIG.METADATA_FILENAME]: encryptedMeta,
                [filename]: null
            });

            return { domain: domain };
        },

        async deleteGistCompletely() {
            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');
            if (!gistId) {
                throw new Error('Gist ID not configured');
            }

            await GistAPI.deleteGist(gistId);
            GM_deleteValue(CONFIG.GIST_ID_KEY);
            return true;
        },

        async listSyncedDomains() {
            const password = GM_getValue(CONFIG.PASSWORD_KEY, '');
            if (!password) {
                return [];
            }
            const metadata = await this.getMetadata(password);
            return metadata.domains || [];
        }
    };

    // ==================== UI Manager ====================
    // ==================== UI Manager ====================
    const UIManager = {
        container: null,
        shadowRoot: null,
        panel: null,
        isVisible: false,
        isInitialized: false,

        // Only register menu commands on init (lazy loading)
        init() {
            this.registerMenuCommands();
        },

        // Lazy initialization of UI (called only when needed)
        initUI() {
            if (this.isInitialized) return;

            // Create container with Shadow DOM for style isolation
            this.container = document.createElement('div');
            this.container.id = 'cookie-sync-container';
            this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

            // Inject styles into Shadow DOM
            const styles = document.createElement('style');
            styles.textContent = this.getStyles();
            this.shadowRoot.appendChild(styles);

            // Create panel
            this.panel = document.createElement('div');
            this.panel.id = 'cookie-sync-panel';
            this.panel.innerHTML = this.getPanelHTML();
            this.shadowRoot.appendChild(this.panel);

            // Create notification container
            const notifContainer = document.createElement('div');
            notifContainer.id = 'cookie-sync-notif';
            this.shadowRoot.appendChild(notifContainer);

            document.body.appendChild(this.container);

            this.setupEventListeners();
            this.loadSettings();
            this.isInitialized = true;
        },

        getStyles() {
            return `
                #cookie-sync-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 380px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 1px solid #0f3460;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    font-size: 14px;
                    color: #e0e0e0;
                    display: none;
                    overflow: hidden;
                }

                #cookie-sync-panel.visible {
                    display: block;
                }

                #cookie-sync-header {
                    background: linear-gradient(90deg, #0f3460 0%, #1a1a2e 100%);
                    padding: 12px 16px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #0f3460;
                }

                #cookie-sync-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #00d9ff;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #cookie-sync-header h3::before {
                    content: '🔐';
                }

                #cookie-sync-close {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                    transition: color 0.2s;
                }

                #cookie-sync-close:hover {
                    color: #ff4757;
                }

                #cookie-sync-content {
                    padding: 16px;
                    max-height: calc(80vh - 60px);
                    overflow-y: auto;
                }

                #cookie-sync-content::-webkit-scrollbar {
                    width: 6px;
                }

                #cookie-sync-content::-webkit-scrollbar-track {
                    background: #1a1a2e;
                }

                #cookie-sync-content::-webkit-scrollbar-thumb {
                    background: #0f3460;
                    border-radius: 3px;
                }

                .cs-section {
                    margin-bottom: 20px;
                }

                .cs-section-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: #00d9ff;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid #0f3460;
                }

                .cs-input-group {
                    margin-bottom: 12px;
                }

                .cs-input-group label {
                    display: block;
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 4px;
                }

                .cs-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: #0d1b2a;
                    border: 1px solid #1b3a5a;
                    border-radius: 6px;
                    color: #e0e0e0;
                    font-size: 13px;
                    box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .cs-input:focus {
                    outline: none;
                    border-color: #00d9ff;
                    box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.1);
                }

                .cs-input::placeholder {
                    color: #555;
                }

                .cs-checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .cs-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #00d9ff;
                }

                .cs-checkbox-label {
                    font-size: 13px;
                    color: #bbb;
                }

                .cs-btn-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .cs-btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .cs-btn-primary {
                    background: linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%);
                    color: #0d1b2a;
                }

                .cs-btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
                }

                .cs-btn-secondary {
                    background: #1b3a5a;
                    color: #e0e0e0;
                }

                .cs-btn-secondary:hover {
                    background: #234567;
                }

                .cs-btn-danger {
                    background: linear-gradient(135deg, #ff4757 0%, #c0392b 100%);
                    color: white;
                }

                .cs-btn-danger:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
                }

                .cs-btn-full {
                    grid-column: 1 / -1;
                }

                .cs-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .cs-cookie-list {
                    max-height: 200px;
                    overflow-y: auto;
                    background: #0d1b2a;
                    border: 1px solid #1b3a5a;
                    border-radius: 6px;
                    padding: 8px;
                }

                .cs-cookie-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .cs-cookie-item:hover {
                    background: #1b3a5a;
                }

                .cs-cookie-item input {
                    flex-shrink: 0;
                }

                .cs-cookie-info {
                    flex: 1;
                    min-width: 0;
                }

                .cs-cookie-name {
                    font-size: 12px;
                    font-weight: 500;
                    color: #00d9ff;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .cs-cookie-domain {
                    font-size: 10px;
                    color: #666;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .cs-status {
                    padding: 10px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    margin-top: 10px;
                    display: none;
                    white-space: pre-line;
                    max-height: 150px;
                    overflow-y: auto;
                    word-break: break-word;
                }

                .cs-status.visible {
                    display: block;
                }

                .cs-status.success {
                    background: rgba(46, 213, 115, 0.15);
                    border: 1px solid #2ed573;
                    color: #2ed573;
                }

                .cs-status.error {
                    background: rgba(255, 71, 87, 0.15);
                    border: 1px solid #ff4757;
                    color: #ff4757;
                }

                .cs-status.info {
                    background: rgba(0, 217, 255, 0.15);
                    border: 1px solid #00d9ff;
                    color: #00d9ff;
                }

                .cs-loading {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    border: 2px solid transparent;
                    border-top-color: currentColor;
                    border-radius: 50%;
                    animation: cs-spin 0.8s linear infinite;
                }

                @keyframes cs-spin {
                    to { transform: rotate(360deg); }
                }

                .cs-info-text {
                    font-size: 11px;
                    color: #666;
                    margin-top: 8px;
                }

                .cs-sync-keys-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 11px;
                    color: #888;
                    margin-top: 10px;
                    padding: 8px;
                    background: #0d1b2a;
                    border-radius: 4px;
                }

                .cs-sync-keys-info strong {
                    color: #00d9ff;
                }

                .cs-sync-mode {
                    color: #2ed573;
                }

                .cs-gist-id {
                    font-size: 11px;
                    color: #00d9ff;
                    word-break: break-all;
                    margin-top: 4px;
                    padding: 6px 8px;
                    background: #0d1b2a;
                    border-radius: 4px;
                }

                .cs-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 16px;
                    background: #0d1b2a;
                    padding: 4px;
                    border-radius: 8px;
                }

                #cookie-sync-domain-bar {
                    background: #0d1b2a;
                    padding: 8px 16px;
                    border-bottom: 1px solid #0f3460;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .cs-domain-label {
                    color: #888;
                }

                .cs-domain-value {
                    color: #00d9ff;
                    font-weight: 500;
                    font-family: monospace;
                }

                .cs-tab {
                    flex: 1;
                    padding: 8px 12px;
                    background: transparent;
                    border: none;
                    color: #888;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .cs-tab.active {
                    background: #1b3a5a;
                    color: #00d9ff;
                }

                .cs-tab:hover:not(.active) {
                    color: #bbb;
                }

                .cs-tab-content {
                    display: none;
                }

                .cs-tab-content.active {
                    display: block;
                }

                /* Notification toast */
                #cookie-sync-notif {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 2147483647;
                }

                .cs-notif {
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    animation: cs-notif-in 0.3s ease, cs-notif-out 0.3s ease forwards;
                    animation-delay: 0s, 1.7s;
                    white-space: nowrap;
                }

                .cs-notif.success {
                    background: linear-gradient(135deg, #2ed573 0%, #26a65b 100%);
                    color: white;
                }

                .cs-notif.error {
                    background: linear-gradient(135deg, #ff4757 0%, #c0392b 100%);
                    color: white;
                }

                @keyframes cs-notif-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes cs-notif-out {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                }
            `;
        },

        getPanelHTML() {
            return `
                <div id="cookie-sync-header">
                    <h3>Cookie Sync</h3>
                    <button id="cookie-sync-close">&times;</button>
                </div>
                <div id="cookie-sync-domain-bar">
                    <span class="cs-domain-label">Domain:</span>
                    <span class="cs-domain-value" id="cs-current-domain"></span>
                </div>
                <div id="cookie-sync-content">
                    <div class="cs-tabs">
                        <button class="cs-tab active" data-tab="sync">Sync</button>
                        <button class="cs-tab" data-tab="cookies">Cookies</button>
                        <button class="cs-tab" data-tab="settings">Settings</button>
                    </div>

                    <!-- Sync Tab -->
                    <div class="cs-tab-content active" data-tab="sync">
                        <div class="cs-section">
                            <div class="cs-btn-group">
                                <button class="cs-btn cs-btn-primary" id="cs-push-btn">
                                    <span>⬆️</span> Push
                                </button>
                                <button class="cs-btn cs-btn-secondary" id="cs-pull-btn">
                                    <span>⬇️</span> Pull
                                </button>
                            </div>
                            <div class="cs-btn-group">
                                <button class="cs-btn cs-btn-danger cs-btn-full" id="cs-delete-btn">
                                    <span>🗑️</span> Delete Remote Data
                                </button>
                            </div>
                        </div>

                        <div class="cs-section">
                            <div class="cs-section-title">Status</div>
                            <div id="cs-gist-info" class="cs-info-text">No Gist configured</div>
                            <div id="cs-status" class="cs-status"></div>
                        </div>
                    </div>

                    <!-- Cookies Tab -->
                    <div class="cs-tab-content" data-tab="cookies">
                        <div class="cs-section">
                            <div class="cs-section-title">Sync Keys (Cookie Names)</div>
                            <div class="cs-info-text" style="margin-bottom: 10px;">
                                Select cookie names to sync. If none selected, <strong>all cookies</strong> will be synced.
                            </div>
                            <button class="cs-btn cs-btn-secondary cs-btn-full" id="cs-refresh-cookies" style="margin-bottom: 10px;">
                                <span>🔄</span> Refresh Cookie List
                            </button>
                            <div class="cs-cookie-list" id="cs-cookie-list">
                                <div class="cs-info-text">Click refresh to load cookies</div>
                            </div>
                            <div class="cs-sync-keys-info">
                                <span>Selected: <strong id="cs-selected-count">0</strong> keys</span>
                                <span class="cs-sync-mode" id="cs-sync-mode">(will sync all)</span>
                            </div>
                        </div>
                    </div>

                    <!-- Settings Tab -->
                    <div class="cs-tab-content" data-tab="settings">
                        <div class="cs-section">
                            <div class="cs-section-title">Encryption</div>
                            <div class="cs-input-group">
                                <label>Password (for E2E encryption)</label>
                                <input type="password" class="cs-input" id="cs-password" placeholder="Enter encryption password">
                            </div>
                        </div>

                        <div class="cs-section">
                            <div class="cs-section-title">GitHub Gist</div>
                            <div class="cs-input-group">
                                <label>Personal Access Token</label>
                                <input type="password" class="cs-input" id="cs-token" placeholder="ghp_xxxxxxxxxxxx">
                            </div>
                            <div class="cs-input-group">
                                <label>Gist ID (optional, auto-created if empty)</label>
                                <input type="text" class="cs-input" id="cs-gist-id" placeholder="Leave empty to create new">
                            </div>
                            <div class="cs-info-text">
                                Create a fine-grained token at GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Grant "Gists" read/write permission.
                            </div>
                        </div>

                        <div class="cs-section">
                            <button class="cs-btn cs-btn-primary cs-btn-full" id="cs-save-settings">
                                <span>💾</span> Save Settings
                            </button>
                            <button class="cs-btn cs-btn-danger cs-btn-full" id="cs-clear-settings" style="margin-top: 10px;">
                                <span>🗑️</span> Clear All Settings
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        // Helper to query elements in Shadow DOM
        $(selector) {
            return this.shadowRoot.querySelector(selector);
        },

        $$(selector) {
            return this.shadowRoot.querySelectorAll(selector);
        },

        setupEventListeners() {
            // Close button
            this.$('#cookie-sync-close').addEventListener('click', () => this.hide());

            // Close when clicking outside the panel
            document.addEventListener('click', (e) => {
                if (this.isVisible && this.container && !this.container.contains(e.target)) {
                    this.hide();
                }
            });

            // Prevent clicks inside panel from closing it
            this.panel.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Tab switching
            this.$$('.cs-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    this.$$('.cs-tab').forEach(t => t.classList.remove('active'));
                    this.$$('.cs-tab-content').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    this.$(`.cs-tab-content[data-tab="${e.target.dataset.tab}"]`).classList.add('active');
                });
            });

            // Draggable header
            this.setupDrag();

            // Buttons
            this.$('#cs-push-btn').addEventListener('click', () => this.handlePush());
            this.$('#cs-pull-btn').addEventListener('click', () => this.handlePull());
            this.$('#cs-delete-btn').addEventListener('click', () => this.handleDelete());
            this.$('#cs-save-settings').addEventListener('click', () => this.saveSettings());
            this.$('#cs-clear-settings').addEventListener('click', () => this.clearSettings());
            this.$('#cs-refresh-cookies').addEventListener('click', () => this.loadCookieList());
        },

        setupDrag() {
            const header = this.$('#cookie-sync-header');
            const panel = this.panel;
            let isDragging = false;
            let offsetX, offsetY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.id === 'cookie-sync-close') return;
                isDragging = true;
                offsetX = e.clientX - panel.offsetLeft;
                offsetY = e.clientY - panel.offsetTop;
                header.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - offsetX));
                const y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - offsetY));
                panel.style.left = x + 'px';
                panel.style.top = y + 'px';
                panel.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = 'move';
                }
            });
        },

        loadSettings() {
            this.$('#cs-password').value = GM_getValue(CONFIG.PASSWORD_KEY, '');
            this.$('#cs-token').value = GM_getValue(CONFIG.TOKEN_KEY, '');
            this.$('#cs-gist-id').value = GM_getValue(CONFIG.GIST_ID_KEY, '');

            // Show current domain
            const domain = getCurrentDomain();
            this.$('#cs-current-domain').textContent = domain;

            const gistId = GM_getValue(CONFIG.GIST_ID_KEY, '');
            this.updateGistInfo(gistId);
        },

        saveSettings() {
            GM_setValue(CONFIG.PASSWORD_KEY, this.$('#cs-password').value);
            GM_setValue(CONFIG.TOKEN_KEY, this.$('#cs-token').value);
            GM_setValue(CONFIG.GIST_ID_KEY, this.$('#cs-gist-id').value);

            this.updateGistInfo(this.$('#cs-gist-id').value);
            this.showStatus('Settings saved successfully!', 'success');
        },

        clearSettings() {
            if (!confirm('Are you sure you want to clear all settings? This cannot be undone.')) {
                return;
            }

            GM_deleteValue(CONFIG.PASSWORD_KEY);
            GM_deleteValue(CONFIG.TOKEN_KEY);
            GM_deleteValue(CONFIG.GIST_ID_KEY);
            GM_deleteValue(CONFIG.SYNC_KEYS_KEY);

            this.$('#cs-password').value = '';
            this.$('#cs-token').value = '';
            this.$('#cs-gist-id').value = '';

            this.updateGistInfo('');
            this.showStatus('All settings cleared', 'info');
        },

        updateGistInfo(gistId) {
            const infoEl = this.$('#cs-gist-info');
            if (gistId) {
                infoEl.innerHTML = `Gist ID: <span class="cs-gist-id">${gistId}</span>`;
            } else {
                infoEl.textContent = 'No Gist configured (will be created on first push)';
            }
        },

        async loadCookieList() {
            const listEl = this.$('#cs-cookie-list');
            listEl.innerHTML = '<div class="cs-info-text">Loading cookies...</div>';

            try {
                const domain = getCurrentDomain();
                const cookies = await CookieManager.getCookiesForDomain(domain);
                const selectedKeys = SyncManager.getLocalSyncKeys(domain);

                if (cookies.length === 0) {
                    listEl.innerHTML = `<div class="cs-info-text">No cookies found for ${domain}</div>`;
                    this.updateSyncModeDisplay(0);
                    return;
                }

                // Get unique cookie names with count
                const cookieNames = {};
                cookies.forEach(cookie => {
                    if (!cookieNames[cookie.name]) {
                        cookieNames[cookie.name] = { count: 0, domains: new Set() };
                    }
                    cookieNames[cookie.name].count++;
                    cookieNames[cookie.name].domains.add(cookie.domain);
                });

                let html = '';
                // Sort cookie names alphabetically
                Object.keys(cookieNames).sort().forEach(name => {
                    const info = cookieNames[name];
                    const checked = selectedKeys.includes(name) ? 'checked' : '';
                    const domainList = Array.from(info.domains).join(', ');
                    html += `
                        <div class="cs-cookie-item">
                            <input type="checkbox" class="cs-checkbox cs-cookie-checkbox" data-name="${this.escapeHtml(name)}" ${checked}>
                            <div class="cs-cookie-info">
                                <div class="cs-cookie-name">${this.escapeHtml(name)}</div>
                                <div class="cs-cookie-domain">${this.escapeHtml(domainList)}${info.count > 1 ? ` (${info.count} cookies)` : ''}</div>
                            </div>
                        </div>
                    `;
                });

                listEl.innerHTML = html;

                // Add event listeners for checkboxes
                listEl.querySelectorAll('.cs-cookie-checkbox').forEach(cb => {
                    cb.addEventListener('change', () => this.updateSelectedCookies());
                });

                this.updateSelectedCount();
            } catch (error) {
                listEl.innerHTML = `<div class="cs-info-text" style="color: #ff4757;">Error: ${error.message}</div>`;
            }
        },

        updateSelectedCookies() {
            const selected = [];
            this.$$('.cs-cookie-checkbox:checked').forEach(cb => {
                selected.push(cb.dataset.name);
            });
            const domain = getCurrentDomain();
            SyncManager.setLocalSyncKeys(domain, selected);
            this.updateSelectedCount();
        },

        updateSelectedCount() {
            const count = this.$$('.cs-cookie-checkbox:checked').length;
            this.$('#cs-selected-count').textContent = count;
            this.updateSyncModeDisplay(count);
        },

        updateSyncModeDisplay(count) {
            const modeEl = this.$('#cs-sync-mode');
            if (count === 0) {
                modeEl.textContent = '(will sync all)';
                modeEl.style.color = '#2ed573';
            } else {
                modeEl.textContent = '(will sync selected only)';
                modeEl.style.color = '#00d9ff';
            }
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        async handlePush(showNotif = false) {
            if (showNotif) {
                // Quick notification mode (from menu command)
                try {
                    const result = await SyncManager.push();
                    GM_setValue(CONFIG.GIST_ID_KEY, result.gistId);
                    this.showNotification(`✅ Pushed ${result.count} cookies`, 'success');
                } catch (error) {
                    this.showNotification(`❌ ${error.message}`, 'error');
                }
                return;
            }

            // Full UI mode
            const btn = this.$('#cs-push-btn');
            const originalContent = btn.innerHTML;

            try {
                btn.disabled = true;
                btn.innerHTML = '<span class="cs-loading"></span> Pushing...';

                const result = await SyncManager.push();
                GM_setValue(CONFIG.GIST_ID_KEY, result.gistId);
                this.$('#cs-gist-id').value = result.gistId;
                this.updateGistInfo(result.gistId);

                const keysInfo = result.syncKeys.length > 0
                    ? `syncKeys: [${result.syncKeys.join(', ')}]`
                    : 'syncKeys: [] (all cookies)';
                this.showStatus(`✅ Pushed ${result.count} cookies for ${result.domain}\n${keysInfo}`, 'success');
            } catch (error) {
                this.showStatus(`❌ Push failed: ${error.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        },

        async handlePull(showNotif = false) {
            if (showNotif) {
                // Quick notification mode (from menu command)
                try {
                    const result = await SyncManager.pull();
                    if (result.errors.length > 0) {
                        this.showNotification(`⚠️ Pulled ${result.success}/${result.total} (${result.errors.length} errors)`, 'error');
                    } else {
                        this.showNotification(`✅ Pulled ${result.success} cookies`, 'success');
                    }
                } catch (error) {
                    this.showNotification(`❌ ${error.message}`, 'error');
                }
                return;
            }

            // Full UI mode
            const btn = this.$('#cs-pull-btn');
            const originalContent = btn.innerHTML;

            try {
                btn.disabled = true;
                btn.innerHTML = '<span class="cs-loading"></span> Pulling...';

                const result = await SyncManager.pull();
                const date = new Date(result.timestamp).toLocaleString();

                const keysInfo = result.syncKeys.length > 0
                    ? `syncKeys: [${result.syncKeys.join(', ')}]`
                    : 'syncKeys: [] (all cookies)';

                let message = `✅ Pulled ${result.success}/${result.total} cookies for ${result.domain}\n${keysInfo}\nTime: ${date}`;
                if (result.errors.length > 0) {
                    message += `\n⚠️ Errors:\n${result.errors.join('\n')}`;
                }

                this.showStatus(message, result.errors.length > 0 ? 'info' : 'success');

                // Refresh cookie list to show updated sync keys from remote
                await this.loadCookieList();
            } catch (error) {
                this.showStatus(`❌ Pull failed: ${error.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        },

        async handleDelete() {
            const domain = getCurrentDomain();
            if (!confirm(`Are you sure you want to delete the remote cookie data for ${domain}? This cannot be undone.`)) {
                return;
            }

            const btn = this.$('#cs-delete-btn');
            const originalContent = btn.innerHTML;

            try {
                btn.disabled = true;
                btn.innerHTML = '<span class="cs-loading"></span> Deleting...';

                const result = await SyncManager.deleteRemote();
                this.showStatus(`✅ Remote data for ${result.domain} deleted!`, 'success');
            } catch (error) {
                this.showStatus(`❌ Delete failed: ${error.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }
        },

        showStatus(message, type) {
            const statusEl = this.$('#cs-status');
            statusEl.textContent = message;
            statusEl.className = `cs-status visible ${type}`;

            setTimeout(() => {
                statusEl.classList.remove('visible');
            }, 5000);
        },

        // Show a toast notification (for menu commands)
        showNotification(message, type) {
            this.initUI(); // Ensure UI is initialized for notification container

            const notifContainer = this.$('#cookie-sync-notif');
            const notif = document.createElement('div');
            notif.className = `cs-notif ${type}`;
            notif.textContent = message;
            notifContainer.appendChild(notif);

            // Remove after animation (2s total: 0.3s in + 1.7s delay + 0.3s out)
            setTimeout(() => {
                notif.remove();
            }, 2000);
        },

        show() {
            this.initUI(); // Lazy init
            this.panel.classList.add('visible');
            this.isVisible = true;
        },

        hide() {
            if (this.panel) {
                this.panel.classList.remove('visible');
            }
            this.isVisible = false;
        },

        registerMenuCommands() {
            GM_registerMenuCommand('🍪 Open Cookie Sync', () => this.show());
            GM_registerMenuCommand('⬆️ Push Cookies', () => this.handlePush(true));
            GM_registerMenuCommand('⬇️ Pull Cookies', () => this.handlePull(true));
        }
    };

    // ==================== Initialize ====================
    // Only register menu commands on page load (lazy UI initialization)
    UIManager.init();

})();