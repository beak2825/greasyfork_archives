// ==UserScript==
// @name         Cookie Sync
// @namespace    https://github.com/hxueh
// @version      0.1.0
// @description  Sync cookies across browsers using GitHub Gist with E2E encryption (AES-GCM + PBKDF2-SHA256). GitHub token is also encrypted.
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
  "use strict";

  // ==================== Configuration ====================
  // GM storage keys (may sync via Tampermonkey cloud)
  const CONFIG = {
    METADATA_FILENAME: "cookie-sync-metadata.txt",
    SALT_LENGTH: 16,
    IV_LENGTH: 12,
    PBKDF2_ITERATIONS: 100000,
    ENCRYPTED_TOKEN_KEY: "cookieSync_encryptedGithubToken",
    GIST_ID_KEY: "cookieSync_gistId",
    SYNC_KEYS_KEY: "cookieSync_syncKeys",
    ENCRYPTED_PASSWORD_KEY: "cookieSync_encryptedPassword",
  };

  // sessionStorage key (per-origin, never syncs, cleared on browser exit)
  const SESSION_PIN_KEY = "cookieSync_sessionPin";

  // Get filename for a domain (hashed for privacy)
  // Uses PBKDF2 to derive HMAC key (slow, prevents brute-force), then HMAC domain
  const BASE62_CHARS =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // Cache for HMAC key (derived from password via PBKDF2)
  let _filenameHmacKeyCache = null;
  let _filenameHmacKeyCacheHash = null; // Hash of password, not password itself

  async function getDomainFilename(domain, password) {
    // Hash password for cache comparison (avoid storing password in memory)
    const passwordHash = CryptoUtils.bufferToBase64(
      await crypto.subtle.digest(
        "SHA-256",
        CryptoUtils.stringToBuffer(password),
      ),
    );

    // Get or derive HMAC key from password (cached)
    let hmacKey = _filenameHmacKeyCache;

    // Invalidate cache if password changed
    if (_filenameHmacKeyCacheHash !== passwordHash) {
      hmacKey = null;
    }

    if (!hmacKey) {
      // Fixed salt for filename key derivation (separate from encryption)
      const salt = CryptoUtils.stringToBuffer("cookie-sync-filename-v1");

      // Derive bits using PBKDF2 (slow, makes brute-force hard)
      const passwordBuffer = CryptoUtils.stringToBuffer(password);
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveBits"],
      );

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: CONFIG.PBKDF2_ITERATIONS,
          hash: "SHA-256",
        },
        keyMaterial,
        256,
      );

      // Create HMAC key from derived bits
      hmacKey = await crypto.subtle.importKey(
        "raw",
        derivedBits,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      );

      // Cache it (store hash, not password)
      _filenameHmacKeyCache = hmacKey;
      _filenameHmacKeyCacheHash = passwordHash;
    }

    // HMAC the domain
    const domainBuffer = CryptoUtils.stringToBuffer(domain);
    const signature = await crypto.subtle.sign("HMAC", hmacKey, domainBuffer);
    const bytes = new Uint8Array(signature);

    // Convert to base62 (15 chars ≈ 89 bits entropy)
    let result = "";
    for (let i = 0; i < 15; i++) {
      const idx = ((bytes[i * 2] << 8) | bytes[i * 2 + 1]) % 62;
      result += BASE62_CHARS[idx];
    }
    return `${result}.txt`;
  }

  // Get current domain
  function getCurrentDomain() {
    return window.location.hostname;
  }

  // Normalize domain
  function normalizeDomain(domain) {
    if (!domain) return domain;
    if (!domain.startsWith(".")) {
      return "." + domain;
    }
    return domain;
  }

  // ==================== Crypto Utilities ====================
  const CryptoUtils = {
    // In-memory key cache for performance
    _keyCache: new Map(),
    _keyCacheMaxAge: 5 * 60 * 1000, // 5 minutes

    stringToBuffer(str) {
      return new TextEncoder().encode(str);
    },

    bufferToString(buffer) {
      return new TextDecoder().decode(buffer);
    },

    bufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      const binString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte),
      ).join("");
      return btoa(binString);
    },

    base64ToBuffer(base64) {
      const binString = atob(base64);
      return Uint8Array.from(binString, (char) => char.codePointAt(0)).buffer;
    },

    generateRandomBytes(length) {
      return crypto.getRandomValues(new Uint8Array(length));
    },

    // Generate cache key for PBKDF2 result (hashed to avoid exposing password in memory)
    async _getCacheKey(password, salt, iterations) {
      const data = `${password}:${this.bufferToBase64(salt)}:${iterations}`;
      const hash = await crypto.subtle.digest(
        "SHA-256",
        this.stringToBuffer(data),
      );
      return this.bufferToBase64(hash);
    },

    // Derive key with caching for same password+salt combinations
    async deriveKey(password, salt, iterations = CONFIG.PBKDF2_ITERATIONS) {
      const cacheKey = await this._getCacheKey(password, salt, iterations);
      const cached = this._keyCache.get(cacheKey);

      if (cached && Date.now() - cached.time < this._keyCacheMaxAge) {
        return cached.key;
      }

      const passwordBuffer = this.stringToBuffer(password);
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: iterations,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"],
      );

      // Cache the key
      this._keyCache.set(cacheKey, { key, time: Date.now() });

      // Cleanup old entries
      if (this._keyCache.size > 10) {
        const now = Date.now();
        for (const [k, v] of this._keyCache) {
          if (now - v.time > this._keyCacheMaxAge) {
            this._keyCache.delete(k);
          }
        }
      }

      return key;
    },

    // Encrypt with optional pre-derived key for batch operations
    async encrypt(plaintext, password, precomputedKey = null) {
      const salt = this.generateRandomBytes(CONFIG.SALT_LENGTH);
      const iv = this.generateRandomBytes(CONFIG.IV_LENGTH);

      // If precomputed key provided, we still need new IV but can skip key derivation
      // However, since salt changes each time, we can't reuse key for encryption
      // For batch encryption with same password, we can use a fixed salt approach
      const key = precomputedKey || (await this.deriveKey(password, salt));

      const plaintextBuffer = this.stringToBuffer(plaintext);
      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        plaintextBuffer,
      );

      const combined = new Uint8Array(
        salt.length + iv.length + ciphertext.byteLength,
      );
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

      return this.bufferToBase64(combined.buffer);
    },

    async decrypt(encryptedBase64, password) {
      const combined = new Uint8Array(this.base64ToBuffer(encryptedBase64));

      const salt = combined.slice(0, CONFIG.SALT_LENGTH);
      const iv = combined.slice(
        CONFIG.SALT_LENGTH,
        CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH,
      );
      const ciphertext = combined.slice(CONFIG.SALT_LENGTH + CONFIG.IV_LENGTH);

      const key = await this.deriveKey(password, salt);

      const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext,
      );

      return this.bufferToString(plaintext);
    },

    // Batch encrypt multiple items with same password (parallel)
    async encryptBatch(items, password) {
      return Promise.all(items.map((item) => this.encrypt(item, password)));
    },

    // Batch decrypt multiple items with same password (parallel)
    async decryptBatch(encryptedItems, password) {
      return Promise.all(
        encryptedItems.map((item) => this.decrypt(item, password)),
      );
    },

    // Fast hash for session token (not for encryption, just verification)
    async fastHash(data) {
      const buffer = this.stringToBuffer(data);
      const hash = await crypto.subtle.digest("SHA-256", buffer);
      return this.bufferToBase64(hash);
    },
  };

  // ==================== PIN Manager ====================
  const PinManager = {
    // Use Tampermonkey storage (syncs across all sites via GM storage)
    _getEncryptedPassword() {
      return GM_getValue(CONFIG.ENCRYPTED_PASSWORD_KEY, "");
    },

    _setEncryptedPassword(encrypted) {
      GM_setValue(CONFIG.ENCRYPTED_PASSWORD_KEY, encrypted);
    },

    _removeEncryptedPassword() {
      GM_deleteValue(CONFIG.ENCRYPTED_PASSWORD_KEY);
    },

    isSetUp() {
      return !!this._getEncryptedPassword();
    },

    // Get session PIN from sessionStorage (cleared on browser exit, per-origin)
    getSessionPin() {
      try {
        return sessionStorage.getItem(SESSION_PIN_KEY);
      } catch {
        return null;
      }
    },

    // Set session PIN
    setSessionPin(pin) {
      try {
        sessionStorage.setItem(SESSION_PIN_KEY, pin);
      } catch {
        // sessionStorage not available
      }
    },

    // Clear session PIN
    clearSessionPin() {
      try {
        sessionStorage.removeItem(SESSION_PIN_KEY);
      } catch {}
    },

    async encryptPassword(password, pin) {
      return await CryptoUtils.encrypt(password, pin);
    },

    async decryptPassword(encryptedPassword, pin) {
      return await CryptoUtils.decrypt(encryptedPassword, pin);
    },

    async getPassword() {
      const encryptedPassword = this._getEncryptedPassword();
      if (!encryptedPassword) {
        return "";
      }

      const pin = this.getSessionPin();
      if (pin) {
        try {
          return await this.decryptPassword(encryptedPassword, pin);
        } catch {
          this.clearSessionPin();
        }
      }

      return null;
    },

    async setPassword(password, pin) {
      const encrypted = await this.encryptPassword(password, pin);
      this._setEncryptedPassword(encrypted);
      this.setSessionPin(pin);
    },

    async verifyPin(pin) {
      const encryptedPassword = this._getEncryptedPassword();
      if (!encryptedPassword) return false;

      try {
        await this.decryptPassword(encryptedPassword, pin);
        this.setSessionPin(pin);
        return true;
      } catch {
        return false;
      }
    },

    async changePin(oldPin, newPin) {
      const encryptedPassword = this._getEncryptedPassword();
      if (!encryptedPassword) {
        throw new Error("No encrypted password found");
      }

      const password = await this.decryptPassword(encryptedPassword, oldPin);
      await this.setPassword(password, newPin);
    },
  };

  // ==================== Token Manager ====================
  const TokenManager = {
    // Get decrypted token
    async getToken(password) {
      const encryptedToken = GM_getValue(CONFIG.ENCRYPTED_TOKEN_KEY, "");
      if (!encryptedToken) {
        return "";
      }

      try {
        return await CryptoUtils.decrypt(encryptedToken, password);
      } catch {
        throw new Error("Failed to decrypt token - wrong password?");
      }
    },

    // Set encrypted token
    async setToken(token, password) {
      if (!token) {
        GM_deleteValue(CONFIG.ENCRYPTED_TOKEN_KEY);
        return;
      }
      const encrypted = await CryptoUtils.encrypt(token, password);
      GM_setValue(CONFIG.ENCRYPTED_TOKEN_KEY, encrypted);
    },

    // Check if token is configured
    isConfigured() {
      return !!GM_getValue(CONFIG.ENCRYPTED_TOKEN_KEY, "");
    },

    // Clear token
    clear() {
      GM_deleteValue(CONFIG.ENCRYPTED_TOKEN_KEY);
    },
  };

  // ==================== GitHub Gist API ====================
  const GistAPI = {
    async request(method, endpoint, password, data = null) {
      const token = await TokenManager.getToken(password);
      if (!token) {
        throw new Error("GitHub token not configured");
      }

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: method,
          url: `https://api.github.com${endpoint}`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          data: data ? JSON.stringify(data) : null,
          onload: (response) => {
            if (response.status >= 200 && response.status < 300) {
              resolve(
                response.responseText
                  ? JSON.parse(response.responseText)
                  : null,
              );
            } else {
              reject(
                new Error(
                  `GitHub API error: ${response.status} - ${response.responseText}`,
                ),
              );
            }
          },
          onerror: (error) => {
            reject(new Error(`Network error: ${error}`));
          },
        });
      });
    },

    async createGist(password, files) {
      const filesData = {};
      for (const [filename, content] of Object.entries(files)) {
        filesData[filename] = { content };
      }
      const data = {
        description: "Cookie Sync Data (Encrypted)",
        public: false,
        files: filesData,
      };
      return this.request("POST", "/gists", password, data);
    },

    async updateGist(password, gistId, files) {
      const filesData = {};
      for (const [filename, content] of Object.entries(files)) {
        filesData[filename] = content === null ? null : { content };
      }
      const data = { files: filesData };
      return this.request("PATCH", `/gists/${gistId}`, password, data);
    },

    async getGist(password, gistId) {
      return this.request("GET", `/gists/${gistId}`, password);
    },

    async deleteGist(password, gistId) {
      return this.request("DELETE", `/gists/${gistId}`, password);
    },
  };

  // ==================== Cookie Manager ====================
  const CookieManager = {
    domainMatches(cookieDomain, hostname) {
      const normalizedCookieDomain = cookieDomain
        .replace(/^\./, "")
        .toLowerCase();
      const normalizedHostname = hostname.toLowerCase();

      if (normalizedCookieDomain === normalizedHostname) {
        return true;
      }

      if (normalizedHostname.endsWith("." + normalizedCookieDomain)) {
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
      return allCookies.filter((cookie) =>
        this.domainMatches(cookie.domain, domain),
      );
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

      const domainWithoutDot = (
        cookie.domain || window.location.hostname
      ).replace(/^\./, "");
      const domainWithDot = "." + domainWithoutDot;
      const currentUrl = window.location.href;
      const constructedUrl = `https://${domainWithoutDot}${cookie.path || "/"}`;

      let sameSite = cookie.sameSite ? cookie.sameSite.toLowerCase() : null;
      let secure = typeof cookie.secure === "boolean" ? cookie.secure : false;

      if (sameSite === "no_restriction" || sameSite === "none") {
        if (!secure) {
          sameSite = "lax";
        }
      }

      const attempts = [
        {
          url: currentUrl,
          name: cookie.name,
          value: cookie.value || "",
          domain: domainWithDot,
          path: cookie.path || "/",
          secure: secure,
          httpOnly: cookie.httpOnly || false,
          ...(sameSite && ["lax", "strict", "no_restriction"].includes(sameSite)
            ? { sameSite }
            : {}),
          ...(cookie.expirationDate > 0
            ? { expirationDate: cookie.expirationDate }
            : {}),
        },
        {
          url: currentUrl,
          name: cookie.name,
          value: cookie.value || "",
          path: cookie.path || "/",
          ...(cookie.expirationDate > 0
            ? { expirationDate: cookie.expirationDate }
            : {}),
        },
        {
          url: constructedUrl,
          name: cookie.name,
          value: cookie.value || "",
          domain: domainWithDot,
          path: cookie.path || "/",
          ...(cookie.expirationDate > 0
            ? { expirationDate: cookie.expirationDate }
            : {}),
        },
        {
          url: constructedUrl,
          name: cookie.name,
          value: cookie.value || "",
          path: cookie.path || "/",
          ...(cookie.expirationDate > 0
            ? { expirationDate: cookie.expirationDate }
            : {}),
        },
      ];

      let lastError;
      for (let i = 0; i < attempts.length; i++) {
        try {
          await trySetCookie(attempts[i]);
          return;
        } catch (e) {
          lastError = e;
        }
      }

      throw lastError;
    },

    // Batch set cookies with parallel execution and error collection
    async setCookiesBatch(cookies) {
      const results = await Promise.allSettled(
        cookies.map((cookie) => this.setCookie(cookie)),
      );

      const errors = [];
      let successCount = 0;

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          const cookie = cookies[index];
          errors.push(`${cookie.name}: ${result.reason.message}`);
        }
      });

      return { successCount, errors };
    },

    async deleteCookie(cookie) {
      return new Promise((resolve, reject) => {
        GM_cookie.delete(
          {
            url: `http${cookie.secure ? "s" : ""}://${cookie.domain.replace(/^\./, "")}${cookie.path || "/"}`,
            name: cookie.name,
          },
          (error) => {
            if (error) {
              reject(new Error(error));
            } else {
              resolve();
            }
          },
        );
      });
    },
  };

  // ==================== Sync Manager ====================
  const SyncManager = {
    getLocalSyncKeys(domain) {
      const allKeys = GM_getValue(CONFIG.SYNC_KEYS_KEY, {});
      return allKeys[domain] || [];
    },

    setLocalSyncKeys(domain, keys) {
      const allKeys = GM_getValue(CONFIG.SYNC_KEYS_KEY, {});
      allKeys[domain] = keys;
      GM_setValue(CONFIG.SYNC_KEYS_KEY, allKeys);
    },

    async getMetadata(password) {
      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");
      if (!gistId) {
        return { domains: [], lastUpdated: null };
      }

      try {
        const gist = await GistAPI.getGist(password, gistId);
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

    async updateMetadata(password, metadata) {
      const encrypted = await CryptoUtils.encrypt(
        JSON.stringify(metadata),
        password,
      );
      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");

      if (gistId) {
        await GistAPI.updateGist(password, gistId, {
          [CONFIG.METADATA_FILENAME]: encrypted,
        });
      }
      return encrypted;
    },

    async push(password = null) {
      if (!password) {
        if (!PinManager.isSetUp()) {
          throw new Error("Password and PIN not configured");
        }
        password = await PinManager.getPassword();
        if (password === null) {
          throw new Error("PIN_REQUIRED");
        }
      }

      const domain = getCurrentDomain();
      const filename = await getDomainFilename(domain, password);
      const syncKeys = this.getLocalSyncKeys(domain);

      let cookies = await CookieManager.getCookiesForDomain(domain);

      if (cookies.length === 0) {
        throw new Error(`No cookies found for ${domain}`);
      }

      if (syncKeys.length > 0) {
        cookies = cookies.filter((c) => syncKeys.includes(c.name));
        if (cookies.length === 0) {
          throw new Error(`No cookies match the selected sync keys`);
        }
      }

      const cookiesData = {};
      cookies.forEach((cookie) => {
        const cookieEntry = {
          value: cookie.value || "",
          domain: normalizeDomain(cookie.domain),
          path: cookie.path || "/",
        };

        if (typeof cookie.secure === "boolean") {
          cookieEntry.secure = cookie.secure;
        }
        if (typeof cookie.httpOnly === "boolean") {
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

      const domainData = {
        timestamp: Date.now(),
        domain: domain,
        syncKeys: syncKeys,
        cookies: cookiesData,
      };

      let gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");

      // Prepare data for encryption
      const domainDataStr = JSON.stringify(domainData);

      if (gistId) {
        // Get metadata and encrypt both in parallel
        const metadata = await this.getMetadata(password);

        if (!metadata.domains.includes(domain)) {
          metadata.domains.push(domain);
        }
        metadata.lastUpdated = Date.now();

        // Parallel encryption
        const [encryptedMeta, encryptedDomain] = await CryptoUtils.encryptBatch(
          [JSON.stringify(metadata), domainDataStr],
          password,
        );

        await GistAPI.updateGist(password, gistId, {
          [CONFIG.METADATA_FILENAME]: encryptedMeta,
          [filename]: encryptedDomain,
        });
      } else {
        const metadata = {
          domains: [domain],
          lastUpdated: Date.now(),
        };

        // Parallel encryption
        const [encryptedMeta, encryptedDomain] = await CryptoUtils.encryptBatch(
          [JSON.stringify(metadata), domainDataStr],
          password,
        );

        const result = await GistAPI.createGist(password, {
          [CONFIG.METADATA_FILENAME]: encryptedMeta,
          [filename]: encryptedDomain,
        });
        gistId = result.id;
        GM_setValue(CONFIG.GIST_ID_KEY, gistId);
      }

      return {
        count: Object.keys(cookiesData).length,
        gistId: gistId,
        domain: domain,
        syncKeys: syncKeys,
      };
    },

    async pull(password = null) {
      if (!password) {
        if (!PinManager.isSetUp()) {
          throw new Error("Password and PIN not configured");
        }
        password = await PinManager.getPassword();
        if (password === null) {
          throw new Error("PIN_REQUIRED");
        }
      }

      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");
      if (!gistId) {
        throw new Error("Gist ID not configured");
      }

      const domain = getCurrentDomain();
      const filename = await getDomainFilename(domain, password);

      const gist = await GistAPI.getGist(password, gistId);
      const file = gist.files[filename];
      if (!file) {
        throw new Error(`No synced data found for ${domain}`);
      }

      const decrypted = await CryptoUtils.decrypt(file.content, password);
      const data = JSON.parse(decrypted);

      const syncKeys = data.syncKeys || [];

      // Convert to array and batch set cookies (parallel)
      const cookiesArray = Object.entries(data.cookies).map(
        ([name, cookieData]) => ({
          name: name,
          ...cookieData,
        }),
      );

      const { successCount, errors } =
        await CookieManager.setCookiesBatch(cookiesArray);

      // Update local syncKeys to match remote
      this.setLocalSyncKeys(domain, syncKeys);

      return {
        total: cookiesArray.length,
        success: successCount,
        errors: errors,
        timestamp: data.timestamp,
        domain: data.domain,
        syncKeys: syncKeys,
        appliedKeys: cookiesArray
          .filter(
            (_, i) => !errors.some((e) => e.startsWith(cookiesArray[i].name)),
          )
          .map((c) => c.name),
      };
    },

    async deleteRemote(password = null) {
      if (!password) {
        if (!PinManager.isSetUp()) {
          throw new Error("Password and PIN not configured");
        }
        password = await PinManager.getPassword();
        if (password === null) {
          throw new Error("PIN_REQUIRED");
        }
      }

      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");
      if (!gistId) {
        throw new Error("Gist ID not configured");
      }

      const domain = getCurrentDomain();
      const filename = await getDomainFilename(domain, password);

      const metadata = await this.getMetadata(password);
      metadata.domains = metadata.domains.filter((d) => d !== domain);
      metadata.lastUpdated = Date.now();

      const encryptedMeta = await CryptoUtils.encrypt(
        JSON.stringify(metadata),
        password,
      );

      await GistAPI.updateGist(password, gistId, {
        [CONFIG.METADATA_FILENAME]: encryptedMeta,
        [filename]: null,
      });

      return { domain: domain };
    },

    async deleteGistCompletely(password) {
      if (!password) {
        throw new Error("Password required");
      }

      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");
      if (!gistId) {
        throw new Error("Gist ID not configured");
      }

      await GistAPI.deleteGist(password, gistId);
      GM_deleteValue(CONFIG.GIST_ID_KEY);
      return true;
    },

    async listSyncedDomains() {
      if (!PinManager.isSetUp()) {
        return [];
      }
      const password = await PinManager.getPassword();
      if (!password) {
        return [];
      }
      const metadata = await this.getMetadata(password);
      return metadata.domains || [];
    },
  };

  // ==================== UI Manager ====================
  const UIManager = {
    container: null,
    shadowRoot: null,
    panel: null,
    isVisible: false,
    isInitialized: false,
    // Separate container for PIN prompt (always available)
    pinPromptContainer: null,
    pinPromptShadowRoot: null,
    pinPromptInitialized: false,

    init() {
      this.registerMenuCommands();
    },

    // Initialize PIN prompt container separately (for menu commands)
    initPinPrompt() {
      if (this.pinPromptInitialized) return;

      this.pinPromptContainer = document.createElement("div");
      this.pinPromptContainer.id = "cookie-sync-pin-container";
      this.pinPromptShadowRoot = this.pinPromptContainer.attachShadow({
        mode: "closed",
      });

      const styles = document.createElement("style");
      styles.textContent = this.getPinPromptStyles();
      this.pinPromptShadowRoot.appendChild(styles);

      document.body.appendChild(this.pinPromptContainer);
      this.pinPromptInitialized = true;
    },

    initUI() {
      if (this.isInitialized) return;

      this.container = document.createElement("div");
      this.container.id = "cookie-sync-container";
      this.shadowRoot = this.container.attachShadow({ mode: "closed" });

      const styles = document.createElement("style");
      styles.textContent = this.getStyles();
      this.shadowRoot.appendChild(styles);

      this.panel = document.createElement("div");
      this.panel.id = "cookie-sync-panel";
      this.panel.innerHTML = this.getPanelHTML();
      this.shadowRoot.appendChild(this.panel);

      const notifContainer = document.createElement("div");
      notifContainer.id = "cookie-sync-notif";
      this.shadowRoot.appendChild(notifContainer);

      document.body.appendChild(this.container);

      this.setupEventListeners();
      this.loadSettings();
      this.isInitialized = true;
    },

    getPinPromptStyles() {
      return `
        * {
          box-sizing: border-box;
        }
 
        .cs-pin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 2147483647;
        }
 
        .cs-pin-modal {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid #0f3460;
          border-radius: 12px;
          padding: 20px;
          width: 280px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 2147483647;
          animation: cs-slide-in 0.2s ease-out;
        }
 
        @keyframes cs-slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        .cs-pin-title {
          font-size: 15px;
          font-weight: 600;
          color: #00d9ff;
          margin-bottom: 14px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .cs-pin-input-group {
          margin-bottom: 12px;
        }
 
        .cs-pin-input {
          width: 100%;
          padding: 10px 12px;
          background: #0d1b2a;
          border: 1px solid #1b3a5a;
          border-radius: 6px;
          color: #e0e0e0;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
 
        .cs-pin-input:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.1);
        }
 
        .cs-pin-input::placeholder {
          color: #555;
        }
 
        .cs-pin-error {
          color: #ff4757;
          font-size: 12px;
          margin-top: 6px;
          display: none;
        }
 
        .cs-pin-error.visible {
          display: block;
        }
 
        .cs-pin-buttons {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }
 
        .cs-pin-btn {
          flex: 1;
          padding: 9px 14px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
 
        .cs-pin-btn-cancel {
          background: #1b3a5a;
          color: #e0e0e0;
        }
 
        .cs-pin-btn-cancel:hover {
          background: #234567;
        }
 
        .cs-pin-btn-submit {
          background: linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%);
          color: #0d1b2a;
        }
 
        .cs-pin-btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
        }
 
        .cs-pin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
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
 
        /* Toast notification styles */
        .cs-notif-container {
          position: fixed;
          top: 20px;
          right: 20px;
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
          margin-bottom: 8px;
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
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
 
        @keyframes cs-notif-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
      `;
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
          right: 20px;
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
          margin-bottom: 8px;
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
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
 
        @keyframes cs-notif-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
 
        /* PIN Modal - positioned at top right */
        .cs-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 2147483647;
        }
 
        .cs-modal {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid #0f3460;
          border-radius: 12px;
          padding: 20px;
          width: 280px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: cs-slide-in 0.2s ease-out;
        }
 
        @keyframes cs-slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
 
        .cs-modal-title {
          font-size: 15px;
          font-weight: 600;
          color: #00d9ff;
          margin-bottom: 14px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
        }
 
        .cs-modal-error {
          color: #ff4757;
          font-size: 12px;
          margin-top: 6px;
          display: none;
        }
 
        .cs-modal-error.visible {
          display: block;
        }
 
        .cs-modal-buttons {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }
 
        .cs-modal-buttons .cs-btn {
          flex: 1;
        }
 
        .cs-pin-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #0d1b2a;
          border-radius: 6px;
          margin-bottom: 12px;
        }
 
        .cs-pin-status-icon {
          font-size: 16px;
        }
 
        .cs-pin-status-text {
          flex: 1;
          font-size: 12px;
        }
 
        .cs-pin-status.enabled {
          border: 1px solid #2ed573;
        }
 
        .cs-pin-status.enabled .cs-pin-status-text {
          color: #2ed573;
        }
 
        .cs-pin-status.disabled {
          border: 1px solid #ff4757;
        }
 
        .cs-pin-status.disabled .cs-pin-status-text {
          color: #ff4757;
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
              <div class="cs-section-title">Encryption (Password + PIN)</div>
              <div class="cs-pin-status disabled" id="cs-pin-status">
                <span class="cs-pin-status-icon">🔓</span>
                <span class="cs-pin-status-text">Not configured</span>
              </div>
              <div class="cs-info-text" style="margin-bottom: 10px;">
                Password is used for E2E encryption (cookies + GitHub token). PIN protects the password locally and is cleared when the browser exits.
              </div>
              <!-- Initial setup (not configured) -->
              <div id="cs-setup-section">
                <div class="cs-input-group">
                  <label>Encryption Password</label>
                  <input type="password" class="cs-input" id="cs-password" placeholder="Enter encryption password">
                </div>
                <div class="cs-input-group">
                  <label>Master PIN (4+ characters)</label>
                  <input type="password" class="cs-input" id="cs-pin" placeholder="Enter PIN">
                </div>
                <div class="cs-input-group">
                  <label>Confirm PIN</label>
                  <input type="password" class="cs-input" id="cs-pin-confirm" placeholder="Confirm PIN">
                </div>
                <button class="cs-btn cs-btn-primary cs-btn-full" id="cs-setup-btn">
                  <span>🔐</span> Set Up Encryption
                </button>
              </div>
              <!-- Already configured -->
              <div id="cs-configured-section" style="display: none;">
                <div class="cs-input-group">
                  <label>Change PIN (enter current PIN first)</label>
                  <input type="password" class="cs-input" id="cs-current-pin" placeholder="Current PIN">
                </div>
                <div class="cs-input-group">
                  <label>New PIN</label>
                  <input type="password" class="cs-input" id="cs-new-pin" placeholder="New PIN">
                </div>
                <div class="cs-input-group">
                  <label>Confirm New PIN</label>
                  <input type="password" class="cs-input" id="cs-new-pin-confirm" placeholder="Confirm new PIN">
                </div>
                <button class="cs-btn cs-btn-secondary cs-btn-full" id="cs-change-pin-btn">
                  <span>🔄</span> Change PIN
                </button>
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

    $(selector) {
      return this.shadowRoot.querySelector(selector);
    },

    $$(selector) {
      return this.shadowRoot.querySelectorAll(selector);
    },

    setupEventListeners() {
      this.$("#cookie-sync-close").addEventListener("click", () => this.hide());

      document.addEventListener("click", (e) => {
        if (
          this.isVisible &&
          this.container &&
          !this.container.contains(e.target)
        ) {
          this.hide();
        }
      });

      this.panel.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      this.$$(".cs-tab").forEach((tab) => {
        tab.addEventListener("click", (e) => {
          this.$$(".cs-tab").forEach((t) => t.classList.remove("active"));
          this.$$(".cs-tab-content").forEach((c) =>
            c.classList.remove("active"),
          );
          e.target.classList.add("active");
          this.$(
            `.cs-tab-content[data-tab="${e.target.dataset.tab}"]`,
          ).classList.add("active");
        });
      });

      this.setupDrag();

      this.$("#cs-push-btn").addEventListener("click", () => this.handlePush());
      this.$("#cs-pull-btn").addEventListener("click", () => this.handlePull());
      this.$("#cs-delete-btn").addEventListener("click", () =>
        this.handleDelete(),
      );
      this.$("#cs-save-settings").addEventListener("click", () =>
        this.saveSettings(),
      );
      this.$("#cs-clear-settings").addEventListener("click", () =>
        this.clearSettings(),
      );
      this.$("#cs-refresh-cookies").addEventListener("click", () =>
        this.loadCookieList(),
      );

      this.$("#cs-setup-btn").addEventListener("click", () =>
        this.handleSetup(),
      );
      this.$("#cs-change-pin-btn").addEventListener("click", () =>
        this.handleChangePin(),
      );
    },

    setupDrag() {
      const header = this.$("#cookie-sync-header");
      const panel = this.panel;
      let isDragging = false;
      let offsetX, offsetY;

      header.addEventListener("mousedown", (e) => {
        if (e.target === header || e.target.tagName === "H3") {
          isDragging = true;
          offsetX = e.clientX - panel.getBoundingClientRect().left;
          offsetY = e.clientY - panel.getBoundingClientRect().top;
          header.style.cursor = "grabbing";
        }
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const x = Math.max(
          0,
          Math.min(window.innerWidth - panel.offsetWidth, e.clientX - offsetX),
        );
        const y = Math.max(
          0,
          Math.min(
            window.innerHeight - panel.offsetHeight,
            e.clientY - offsetY,
          ),
        );
        panel.style.left = x + "px";
        panel.style.top = y + "px";
        panel.style.right = "auto";
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          header.style.cursor = "move";
        }
      });
    },

    async loadSettings() {
      this.$("#cs-gist-id").value = GM_getValue(CONFIG.GIST_ID_KEY, "");

      const domain = getCurrentDomain();
      this.$("#cs-current-domain").textContent = domain;

      const gistId = GM_getValue(CONFIG.GIST_ID_KEY, "");
      this.updateGistInfo(gistId);

      // Load token - show placeholder if encrypted and no PIN
      const tokenInput = this.$("#cs-token");
      if (TokenManager.isConfigured()) {
        const password = await PinManager.getPassword();
        if (password) {
          try {
            tokenInput.value = await TokenManager.getToken(password);
          } catch {
            tokenInput.value = "";
            tokenInput.placeholder = "••••••••••••••••";
          }
        } else {
          tokenInput.value = "";
          tokenInput.placeholder = "Enter PIN to view/edit token";
        }
      } else {
        tokenInput.value = "";
        tokenInput.placeholder = "ghp_xxxxxxxxxxxx";
      }

      this.updateSetupStatus();
    },

    async saveSettings() {
      // Check if encryption is set up (required for token)
      if (!PinManager.isSetUp()) {
        this.showStatus(
          "Set up encryption (Password + PIN) first before saving token",
          "error",
        );
        return;
      }

      const password = await this.getPasswordWithPinPrompt();
      if (password === null) {
        this.showStatus("PIN required to save settings", "error");
        return;
      }

      const tokenValue = this.$("#cs-token").value.trim();

      try {
        // Save encrypted token
        await TokenManager.setToken(tokenValue, password);

        // Save Gist ID (not encrypted, it's public anyway)
        GM_setValue(CONFIG.GIST_ID_KEY, this.$("#cs-gist-id").value);

        this.updateGistInfo(this.$("#cs-gist-id").value);
        this.showStatus("Settings saved successfully!", "success");
      } catch (error) {
        this.showStatus(`Failed to save: ${error.message}`, "error");
      }
    },

    clearSettings() {
      if (
        !confirm(
          "Are you sure you want to clear all settings? This cannot be undone.",
        )
      ) {
        return;
      }

      TokenManager.clear();
      GM_deleteValue(CONFIG.GIST_ID_KEY);
      GM_deleteValue(CONFIG.SYNC_KEYS_KEY);
      GM_deleteValue(CONFIG.ENCRYPTED_PASSWORD_KEY);
      PinManager.clearSessionPin();

      this.$("#cs-password").value = "";
      this.$("#cs-token").value = "";
      this.$("#cs-token").placeholder = "ghp_xxxxxxxxxxxx";
      this.$("#cs-gist-id").value = "";
      this.$("#cs-pin").value = "";
      this.$("#cs-pin-confirm").value = "";

      this.updateGistInfo("");
      this.updateSetupStatus();
      this.showStatus("All settings cleared", "info");
    },

    updateGistInfo(gistId) {
      const infoEl = this.$("#cs-gist-info");
      if (gistId) {
        infoEl.innerHTML = `Gist ID: <span class="cs-gist-id">${gistId}</span>`;
      } else {
        infoEl.textContent =
          "No Gist configured (will be created on first push)";
      }
    },

    updateSetupStatus() {
      const statusEl = this.$("#cs-pin-status");
      const iconEl = statusEl.querySelector(".cs-pin-status-icon");
      const textEl = statusEl.querySelector(".cs-pin-status-text");
      const setupSection = this.$("#cs-setup-section");
      const configuredSection = this.$("#cs-configured-section");

      if (PinManager.isSetUp()) {
        statusEl.classList.remove("disabled");
        statusEl.classList.add("enabled");
        iconEl.textContent = "🔐";
        textEl.textContent = "Encryption configured";
        setupSection.style.display = "none";
        configuredSection.style.display = "block";
      } else {
        statusEl.classList.remove("enabled");
        statusEl.classList.add("disabled");
        iconEl.textContent = "🔓";
        textEl.textContent = "Not configured";
        setupSection.style.display = "block";
        configuredSection.style.display = "none";
      }
    },

    async handleSetup() {
      const password = this.$("#cs-password").value;
      const pin = this.$("#cs-pin").value;
      const pinConfirm = this.$("#cs-pin-confirm").value;

      if (!password) {
        this.showStatus("Password is required", "error");
        return;
      }

      if (pin.length < 4) {
        this.showStatus("PIN must be at least 4 characters", "error");
        return;
      }

      if (pin !== pinConfirm) {
        this.showStatus("PINs do not match", "error");
        return;
      }

      try {
        await PinManager.setPassword(password, pin);
        this.updateSetupStatus();
        this.$("#cs-password").value = "";
        this.$("#cs-pin").value = "";
        this.$("#cs-pin-confirm").value = "";
        this.showStatus("Encryption configured successfully!", "success");
      } catch (error) {
        this.showStatus(`Setup failed: ${error.message}`, "error");
      }
    },

    async handleChangePin() {
      const currentPin = this.$("#cs-current-pin").value;
      const newPin = this.$("#cs-new-pin").value;
      const newPinConfirm = this.$("#cs-new-pin-confirm").value;

      if (!currentPin) {
        this.showStatus("Enter current PIN", "error");
        return;
      }

      if (newPin.length < 4) {
        this.showStatus("New PIN must be at least 4 characters", "error");
        return;
      }

      if (newPin !== newPinConfirm) {
        this.showStatus("New PINs do not match", "error");
        return;
      }

      try {
        await PinManager.changePin(currentPin, newPin);
        this.$("#cs-current-pin").value = "";
        this.$("#cs-new-pin").value = "";
        this.$("#cs-new-pin-confirm").value = "";
        this.showStatus("PIN changed successfully!", "success");
      } catch (error) {
        this.showStatus("Incorrect current PIN", "error");
      }
    },

    // Show PIN prompt - now uses separate container (works without full UI init)
    showPinPrompt() {
      return new Promise((resolve) => {
        // Initialize PIN prompt container if needed
        this.initPinPrompt();

        const overlay = document.createElement("div");
        overlay.className = "cs-pin-overlay";

        const modal = document.createElement("div");
        modal.className = "cs-pin-modal";
        modal.innerHTML = `
          <div class="cs-pin-title">🔐 Enter PIN</div>
          <div class="cs-pin-input-group">
            <input type="password" class="cs-pin-input" id="cs-pin-prompt-input" placeholder="Enter your PIN" autofocus>
          </div>
          <div class="cs-pin-error" id="cs-pin-prompt-error">Incorrect PIN</div>
          <div class="cs-pin-buttons">
            <button class="cs-pin-btn cs-pin-btn-cancel" id="cs-pin-prompt-cancel">Cancel</button>
            <button class="cs-pin-btn cs-pin-btn-submit" id="cs-pin-prompt-submit">Unlock</button>
          </div>
        `;

        // Add to PIN prompt shadow root
        this.pinPromptShadowRoot.appendChild(overlay);
        this.pinPromptShadowRoot.appendChild(modal);

        const input = modal.querySelector("#cs-pin-prompt-input");
        const errorEl = modal.querySelector("#cs-pin-prompt-error");
        const cancelBtn = modal.querySelector("#cs-pin-prompt-cancel");
        const submitBtn = modal.querySelector("#cs-pin-prompt-submit");

        const cleanup = () => {
          overlay.remove();
          modal.remove();
        };

        const handleSubmit = async () => {
          const pin = input.value;
          if (!pin) return;

          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="cs-loading"></span>';

          const valid = await PinManager.verifyPin(pin);
          if (valid) {
            cleanup();
            resolve(pin);
          } else {
            errorEl.classList.add("visible");
            input.value = "";
            input.focus();
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Unlock";
          }
        };

        cancelBtn.addEventListener("click", () => {
          cleanup();
          resolve(null);
        });

        overlay.addEventListener("click", () => {
          cleanup();
          resolve(null);
        });

        submitBtn.addEventListener("click", handleSubmit);

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            handleSubmit();
          } else if (e.key === "Escape") {
            cleanup();
            resolve(null);
          }
        });

        // Focus input
        setTimeout(() => input.focus(), 100);
      });
    },

    async getPasswordWithPinPrompt() {
      const password = await PinManager.getPassword();
      if (password !== null) {
        return password;
      }

      const pin = await this.showPinPrompt();
      if (!pin) {
        return null;
      }

      return await PinManager.getPassword();
    },

    async loadCookieList() {
      const listEl = this.$("#cs-cookie-list");
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

        const cookieNames = {};
        cookies.forEach((cookie) => {
          if (!cookieNames[cookie.name]) {
            cookieNames[cookie.name] = { count: 0, domains: new Set() };
          }
          cookieNames[cookie.name].count++;
          cookieNames[cookie.name].domains.add(cookie.domain);
        });

        let html = "";
        Object.keys(cookieNames)
          .sort()
          .forEach((name) => {
            const info = cookieNames[name];
            const checked = selectedKeys.includes(name) ? "checked" : "";
            const domainList = Array.from(info.domains).join(", ");
            html += `
              <div class="cs-cookie-item">
                <input type="checkbox" class="cs-checkbox cs-cookie-checkbox" data-name="${this.escapeHtml(name)}" ${checked}>
                <div class="cs-cookie-info">
                  <div class="cs-cookie-name">${this.escapeHtml(name)}</div>
                  <div class="cs-cookie-domain">${this.escapeHtml(domainList)}${info.count > 1 ? ` (${info.count} cookies)` : ""}</div>
                </div>
              </div>
            `;
          });

        listEl.innerHTML = html;

        listEl.querySelectorAll(".cs-cookie-checkbox").forEach((cb) => {
          cb.addEventListener("change", () => this.updateSelectedCookies());
        });

        this.updateSelectedCount();
      } catch (error) {
        listEl.innerHTML = `<div class="cs-info-text" style="color: #ff4757;">Error: ${error.message}</div>`;
      }
    },

    updateSelectedCookies() {
      const selected = [];
      this.$$(".cs-cookie-checkbox:checked").forEach((cb) => {
        selected.push(cb.dataset.name);
      });
      const domain = getCurrentDomain();
      SyncManager.setLocalSyncKeys(domain, selected);
      this.updateSelectedCount();
    },

    updateSelectedCount() {
      const count = this.$$(".cs-cookie-checkbox:checked").length;
      this.$("#cs-selected-count").textContent = count;
      this.updateSyncModeDisplay(count);
    },

    updateSyncModeDisplay(count) {
      const modeEl = this.$("#cs-sync-mode");
      if (count === 0) {
        modeEl.textContent = "(will sync all)";
        modeEl.style.color = "#2ed573";
      } else {
        modeEl.textContent = "(will sync selected only)";
        modeEl.style.color = "#00d9ff";
      }
    },

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    },

    async handlePush(showNotif = false) {
      if (!PinManager.isSetUp()) {
        if (showNotif) {
          this.showNotification("❌ Configure password and PIN first", "error");
        } else {
          this.showStatus(
            "Configure password and PIN in Settings first",
            "error",
          );
        }
        return;
      }

      const password = await this.getPasswordWithPinPrompt();
      if (password === null) {
        if (showNotif) {
          this.showNotification("❌ PIN required", "error");
        }
        return;
      }

      if (showNotif) {
        try {
          const result = await SyncManager.push(password);
          GM_setValue(CONFIG.GIST_ID_KEY, result.gistId);
          this.showNotification(`✅ Pushed ${result.count} cookies`, "success");
        } catch (error) {
          this.showNotification(`❌ ${error.message}`, "error");
        }
        return;
      }

      const btn = this.$("#cs-push-btn");
      const originalContent = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="cs-loading"></span> Pushing...';

        const result = await SyncManager.push(password);
        GM_setValue(CONFIG.GIST_ID_KEY, result.gistId);
        this.$("#cs-gist-id").value = result.gistId;
        this.updateGistInfo(result.gistId);

        const keysInfo =
          result.syncKeys.length > 0
            ? `syncKeys: [${result.syncKeys.join(", ")}]`
            : "syncKeys: [] (all cookies)";
        this.showStatus(
          `✅ Pushed ${result.count} cookies for ${result.domain}\n${keysInfo}`,
          "success",
        );
      } catch (error) {
        this.showStatus(`❌ Push failed: ${error.message}`, "error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
    },

    async handlePull(showNotif = false) {
      if (!PinManager.isSetUp()) {
        if (showNotif) {
          this.showNotification("❌ Configure password and PIN first", "error");
        } else {
          this.showStatus(
            "Configure password and PIN in Settings first",
            "error",
          );
        }
        return;
      }

      const password = await this.getPasswordWithPinPrompt();
      if (password === null) {
        if (showNotif) {
          this.showNotification("❌ PIN required", "error");
        }
        return;
      }

      if (showNotif) {
        try {
          const result = await SyncManager.pull(password);
          if (result.errors.length > 0) {
            this.showNotification(
              `⚠️ Pulled ${result.success}/${result.total} (${result.errors.length} errors)`,
              "error",
            );
          } else {
            this.showNotification(
              `✅ Pulled ${result.success} cookies`,
              "success",
            );
          }
        } catch (error) {
          this.showNotification(`❌ ${error.message}`, "error");
        }
        return;
      }

      const btn = this.$("#cs-pull-btn");
      const originalContent = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="cs-loading"></span> Pulling...';

        const result = await SyncManager.pull(password);
        const date = new Date(result.timestamp).toLocaleString();

        const keysInfo =
          result.syncKeys.length > 0
            ? `syncKeys: [${result.syncKeys.join(", ")}]`
            : "syncKeys: [] (all cookies)";

        let message = `✅ Pulled ${result.success}/${result.total} cookies for ${result.domain}\n${keysInfo}\nTime: ${date}`;
        if (result.errors.length > 0) {
          message += `\n⚠️ Errors:\n${result.errors.join("\n")}`;
        }

        this.showStatus(message, result.errors.length > 0 ? "info" : "success");

        await this.loadCookieList();
      } catch (error) {
        this.showStatus(`❌ Pull failed: ${error.message}`, "error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
    },

    async handleDelete() {
      const domain = getCurrentDomain();
      if (
        !confirm(
          `Are you sure you want to delete the remote cookie data for ${domain}? This cannot be undone.`,
        )
      ) {
        return;
      }

      if (!PinManager.isSetUp()) {
        this.showStatus(
          "Configure password and PIN in Settings first",
          "error",
        );
        return;
      }

      const password = await this.getPasswordWithPinPrompt();
      if (password === null) {
        return;
      }

      const btn = this.$("#cs-delete-btn");
      const originalContent = btn.innerHTML;

      try {
        btn.disabled = true;
        btn.innerHTML = '<span class="cs-loading"></span> Deleting...';

        const result = await SyncManager.deleteRemote(password);
        this.showStatus(
          `✅ Remote data for ${result.domain} deleted!`,
          "success",
        );
      } catch (error) {
        this.showStatus(`❌ Delete failed: ${error.message}`, "error");
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
    },

    showStatus(message, type) {
      const statusEl = this.$("#cs-status");
      statusEl.textContent = message;
      statusEl.className = `cs-status visible ${type}`;

      setTimeout(() => {
        statusEl.classList.remove("visible");
      }, 5000);
    },

    // Show toast notification (works without full UI init)
    showNotification(message, type) {
      // Use PIN prompt container for notifications too
      this.initPinPrompt();

      // Find or create notification container
      let notifContainer = this.pinPromptShadowRoot.querySelector(
        ".cs-notif-container",
      );
      if (!notifContainer) {
        notifContainer = document.createElement("div");
        notifContainer.className = "cs-notif-container";
        this.pinPromptShadowRoot.appendChild(notifContainer);
      }

      const notif = document.createElement("div");
      notif.className = `cs-notif ${type}`;
      notif.textContent = message;
      notifContainer.appendChild(notif);

      setTimeout(() => {
        notif.remove();
      }, 2000);
    },

    show() {
      this.initUI();
      this.panel.classList.add("visible");
      this.isVisible = true;
    },

    hide() {
      if (this.panel) {
        this.panel.classList.remove("visible");
      }
      this.isVisible = false;
    },

    registerMenuCommands() {
      GM_registerMenuCommand("🍪 Open Cookie Sync", () => this.show());
      GM_registerMenuCommand("⬆️ Push Cookies", () => this.handlePush(true));
      GM_registerMenuCommand("⬇️ Pull Cookies", () => this.handlePull(true));
    },
  };

  // ==================== Initialize ====================
  UIManager.init();
})();
