// ==UserScript==
// @name         HTT PDA v2
// @namespace    http://tampermonkey.net/
// @version      2.51
// @description  Hierarchical faction warfare with leader customization and coordinated targeting
// @author       Mistborn [3037268]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @connect      fonts.googleapis.com
// @connect      i.ibb.co
// @connect      raw.githubusercontent.com
// @connect      torn-attack-logger-default-rtdb.europe-west1.firebasedatabase.app
// @connect      torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552287/HTT%20PDA%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/552287/HTT%20PDA%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FIRST LINE: Confirm script is loading
    console.log('HAL: 🎃 Halloween Targets script STARTING...');
    console.log('HAL: 🎃 User Agent:', navigator.userAgent);

    // Only run in top frame (not iframes) - prevents multiple executions
    if (window.self !== window.top) {
        console.log('HAL: ⚠️ Running in iframe - exiting');
        return;
    }

    console.log('HAL: ✅ Top frame confirmed - continuing');

    // ========================================================================
    // MASTER KEY CONFIGURATION
    // ========================================================================
    // DELETE THIS SECTION (lines 27-32) for member distribution
    // ========================================================================
    const MASTER_LEADER_KEY = 'xK9mP2nQ7wR5tL3vB8';
    console.log('HAL: 🔑 MASTER_LEADER_KEY loaded:', typeof MASTER_LEADER_KEY, MASTER_LEADER_KEY);
    // ========================================================================

    // ========================================================================
    // TORN PDA COMPATIBILITY LAYER
    // ========================================================================
    // Official documentation: https://github.com/Manuito83/torn-pda
    // Phase 1: Detection using user agent (safe, synchronous)
    // Phase 2: Platform readiness wait for flutterInAppWebViewPlatformReady event
    // Phase 3: HTTP adapter for PDA_httpGet/PDA_httpPost handlers
    // ========================================================================

    // Phase 1: PDA Detection
    // SAFE: User agent check - synchronous, no object access required
    const isPDA = navigator.userAgent.includes('com.manuito.tornpda');

    if (isPDA) {
        console.log('HAL: 📱 Torn PDA detected via user agent');
    }

    // Phase 2: Platform Readiness Wait
    // MUST wait for flutterInAppWebViewPlatformReady event before calling handlers
    // Official docs: "you need to wait for the underlying Flutter InAppWebView platform to be ready"
    function waitForPDAReady() {
        return new Promise((resolve) => {
            if (!isPDA) {
                // Browser environment - ready immediately
                resolve();
                return;
            }

            console.log('HAL: 📱 Waiting for PDA platform ready event...');

            // PDA environment - wait for platform ready event
            window.addEventListener('flutterInAppWebViewPlatformReady', function() {
                console.log('HAL: 📱 PDA platform ready event received');
                resolve();
            }, { once: true });

            // Timeout fallback (2 seconds)
            setTimeout(() => {
                console.log('HAL: ⚠️ PDA platform ready timeout - assuming ready');
                resolve();
            }, 2000);
        });
    }

    // Phase 3: HTTP Adapter for PDA
    // Wraps GM_xmlhttpRequest to use PDA handlers when in PDA environment
    // Official docs: "Both handlers return a logical response object similar to GM_xmlhttpRequest()"
    function httpRequest(config) {
        if (!isPDA) {
            // Browser - use standard GM function
            return GM_xmlhttpRequest(config);
        }

        // PDA - use PDA_httpGet or PDA_httpPost handlers
        const method = (config.method || 'GET').toUpperCase();
        const url = config.url;
        const headers = config.headers || {};

        if (method === 'GET') {
            // Use PDA_httpGet handler
            window.flutter_inappwebview.callHandler('PDA_httpGet', url, headers)
                .then(response => {
                    // PDA response matches GM_xmlhttpRequest format
                    if (config.onload) {
                        config.onload({
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            responseHeaders: response.responseHeaders
                        });
                    }
                })
                .catch(error => {
                    console.error('HAL: 📱 PDA_httpGet error:', error);
                    if (config.onerror) {
                        config.onerror(error);
                    }
                });
        } else if (method === 'POST' || method === 'PUT') {
            // Use PDA_httpPost handler
            const body = config.data || '';
            window.flutter_inappwebview.callHandler('PDA_httpPost', url, headers, body)
                .then(response => {
                    // PDA response matches GM_xmlhttpRequest format
                    if (config.onload) {
                        config.onload({
                            status: response.status,
                            statusText: response.statusText,
                            responseText: response.responseText,
                            responseHeaders: response.responseHeaders
                        });
                    }
                })
                .catch(error => {
                    console.error('HAL: 📱 PDA_httpPost error:', error);
                    if (config.onerror) {
                        config.onerror(error);
                    }
                });
        } else {
            // Unsupported method - fallback to GM (will likely fail in PDA but better than nothing)
            console.warn('HAL: 📱 PDA: Unsupported HTTP method', method, '- attempting GM fallback');
            return GM_xmlhttpRequest(config);
        }
    }

    // ========================================================================
    // END TORN PDA COMPATIBILITY LAYER
    // ========================================================================

    // Mathematical Obfuscation Core - Anti-Reverse Engineering
    const HalloweenMath = {
        // Mersenne Twister chaos generator
        mersenneTwister: function(seed) {
            const mt = new Array(624);
            let index = 0;
            mt[0] = seed;
            for (let i = 1; i < 624; i++) {
                mt[i] = (1812433253 * (mt[i-1] ^ (mt[i-1] >>> 30)) + i) & 0xffffffff;
            }

            return function() {
                if (index >= 624) {
                    for (let i = 0; i < 624; i++) {
                        const y = (mt[i] & 0x80000000) + (mt[(i + 1) % 624] & 0x7fffffff);
                        mt[i] = mt[(i + 397) % 624] ^ (y >>> 1);
                        if (y % 2 !== 0) mt[i] = mt[i] ^ 0x9908b0df;
                    }
                    index = 0;
                }
                let y = mt[index++];
                y = y ^ (y >>> 11);
                y = y ^ ((y << 7) & 0x9d2c5680);
                y = y ^ ((y << 15) & 0xefc60000);
                y = y ^ (y >>> 18);
                return (y >>> 0) / 0x100000000;
            };
        },

        // Polynomial evaluation with chaos injection
        polynomial: function(x, coeffs, chaosFunc) {
            let result = 0;
            let power = 1;
            for (let i = 0; i < coeffs.length; i++) {
                const chaosBoost = 1 + chaosFunc() * 0.1;
                result += coeffs[i] * power * chaosBoost;
                power *= x;
            }
            return result;
        },

        // Multi-layer hash cascade
        hash: function(input, layers = 3) {
            let result = input;
            for (let layer = 0; layer < layers; layer++) {
                let hash = 0;
                const str = result.toString();
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                result = Math.abs(hash);
            }
            return result;
        },

        // Nested Base64 Encoding - Anti-AI Analysis Layer
        encodeNested: function(data, depth = 3) {
            let encoded = JSON.stringify(data);
            for (let i = 0; i < depth; i++) {
                encoded = btoa(encoded);
                // Inject noise patterns to confuse pattern recognition
                const noise = String.fromCharCode(65 + (i * 7) % 26);
                encoded = encoded.slice(0, i + 3) + noise + encoded.slice(i + 3);
            }
            return encoded;
        },

        decodeNested: function(encoded, depth = 3) {
            let decoded = encoded;
            for (let i = depth - 1; i >= 0; i--) {
                // Remove noise patterns
                decoded = decoded.slice(0, i + 3) + decoded.slice(i + 4);
                decoded = atob(decoded);
            }
            return JSON.parse(decoded);
        },

        // Fibonacci Sequence Integration - Mathematical Obfuscation
        fibonacci: function(n) {
            if (n <= 1) return n;
            let a = 0, b = 1, temp;
            for (let i = 2; i <= n; i++) {
                temp = a + b;
                a = b;
                b = temp;
            }
            return b;
        },

        fibonacciMatrix: function(n) {
            // Matrix exponentiation for Fibonacci - more obfuscated
            if (n === 0) return 0;
            const matrix = [[1, 1], [1, 0]];
            const result = this.matrixPower(matrix, n - 1);
            return result[0][0];
        },

        // Matrix/Vector Mathematics - Linear Algebra Obfuscation
        matrixMultiply: function(a, b) {
            const rows = a.length;
            const cols = b[0].length;
            const result = Array(rows).fill().map(() => Array(cols).fill(0));

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    for (let k = 0; k < a[0].length; k++) {
                        result[i][j] += a[i][k] * b[k][j];
                    }
                }
            }
            return result;
        },

        matrixPower: function(matrix, n) {
            if (n === 1) return matrix;
            if (n % 2 === 0) {
                const half = this.matrixPower(matrix, n / 2);
                return this.matrixMultiply(half, half);
            } else {
                return this.matrixMultiply(matrix, this.matrixPower(matrix, n - 1));
            }
        },

        vectorTransform: function(vector, transformMatrix) {
            const result = [];
            for (let i = 0; i < transformMatrix.length; i++) {
                let sum = 0;
                for (let j = 0; j < vector.length; j++) {
                    sum += transformMatrix[i][j] * vector[j];
                }
                result.push(sum);
            }
            return result;
        },

        // Advanced Entropy Generation - Multi-Source Randomness
        entropyPool: function() {
            const sources = [
                Date.now() % 982451653,
                Math.random() * 982451653,
                performance.now() % 982451653,
                (navigator.userAgent.length * 31) % 982451653,
                (window.innerWidth * window.innerHeight) % 982451653
            ];

            // Mix entropy sources using polynomial chaos
            let entropy = 0;
            const fibCoeffs = [this.fibonacci(7), this.fibonacci(11), this.fibonacci(13)];

            for (let i = 0; i < sources.length; i++) {
                entropy ^= this.polynomial(sources[i], fibCoeffs, () => Math.random());
            }

            return Math.abs(entropy) % 982451653;
        },

        // Enhanced Browser Environment Fingerprinting
        environmentFingerprint: function() {
            const features = [
                navigator.userAgent,
                navigator.language,
                screen.width + 'x' + screen.height,
                navigator.platform,
                navigator.cookieEnabled ? 'cookies' : 'nocookies',
                typeof(Worker) !== 'undefined' ? 'worker' : 'noworker',
                window.location.protocol
            ];

            let fingerprint = 0;
            for (let feature of features) {
                fingerprint = this.hash(fingerprint + feature.toString(), 2);
            }

            return fingerprint;
        },

        // Data Validation with CRC32 Checksums
        crc32: function(data) {
            const table = [];
            let crc = 0;

            // Generate CRC table
            for (let i = 0; i < 256; i++) {
                crc = i;
                for (let j = 0; j < 8; j++) {
                    crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
                }
                table[i] = crc;
            }

            // Calculate CRC32
            crc = 0xFFFFFFFF;
            const str = JSON.stringify(data);
            for (let i = 0; i < str.length; i++) {
                crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
            }
            return (crc ^ 0xFFFFFFFF) >>> 0;
        },

        validateIntegrity: function(data, expectedCrc) {
            const actualCrc = this.crc32(data);
            const timingStart = performance.now();

            // Add timing-based validation to detect debugging
            const validation = actualCrc === expectedCrc;
            const timingEnd = performance.now();

            if (timingEnd - timingStart > 50) {
                // Potential debugging detected
                return false;
            }

            return validation;
        },

        // Core target generation algorithm - Deterministic and secure
        generateTargets: function(seedString) {
            // Validate seed requirements
            if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                HalloweenDebug.log(3, '🎃 Master key not found');
                return Array(20).fill('00');
            }

            if (seedString.length < 20) {
                HalloweenDebug.log(3, '🎃 Seed too short (requires 20+ chars)');
                return Array(20).fill('00');
            }

            const primes = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107];

            // Pure deterministic seed processing (no entropy, no randomness)
            const seedHash = this.hash(seedString, 7);

            // Fibonacci-enhanced Mersenne Twister initialization (deterministic)
            const fibSeed = this.fibonacciMatrix(seedHash % 30);
            const chaos = this.mersenneTwister(fibSeed);

            // Matrix transformation for mathematical obfuscation
            const transformMatrix = [
                [this.fibonacci(7), this.fibonacci(11)],
                [this.fibonacci(13), this.fibonacci(17)]
            ];

            const targets = [];
            const usedTargets = new Set();

            for (let i = 0; i < 20; i++) {
                let targetStr;
                let attempts = 0;
                const maxAttempts = 100;

                // Keep generating until we get a unique target
                do {
                    const offset = attempts; // Add offset for uniqueness

                    // Fibonacci-enhanced coefficient generation
                    const fibBase = this.fibonacci(i + offset + 5);
                    const coeffs = [
                        Math.sin((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(10)) * 100,
                        Math.cos((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(7)) * 50,
                        Math.tan((i + offset + seedHash + fibBase) * Math.PI / this.fibonacci(13)) * 25,
                        chaos() * this.fibonacci(8)
                    ];

                    // Polynomial evaluation with deterministic chaos
                    const polyResult = this.polynomial(seedHash + i + offset + fibBase, coeffs, chaos);

                    // Vector transformation for additional obfuscation
                    const vector = [polyResult % 1000, (polyResult * chaos()) % 1000];
                    const transformedVector = this.vectorTransform(vector, transformMatrix);

                    // Multi-layer hashing with matrix results
                    const hashedResult = this.hash(Math.floor(transformedVector[0] + transformedVector[1]), 6);
                    const primeIndex = hashedResult % primes.length;

                    // Deterministic target calculation (removed entropy boost)
                    const targetDigits = (primes[primeIndex] + Math.floor(chaos() * 78)) % 100;

                    targetStr = String(targetDigits).padStart(2, '0');
                    attempts++;

                    if (attempts >= maxAttempts) {
                        HalloweenDebug.log(1, `⚠️ Max attempts reached generating unique target at index ${i}, using fallback`);
                        // Fallback: generate deterministic unique value
                        targetStr = String((seedHash + i) % 100).padStart(2, '0');
                        break;
                    }
                } while (usedTargets.has(targetStr));

                usedTargets.add(targetStr);
                targets.push(targetStr);
            }

            HalloweenDebug.log(2, `🎃 Generated ${targets.length} deterministic targets from seed`);
            return targets;
        },

        // Hash string input for seed conversion
        hashString: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash);
        }
    };

    // Lightweight Storage Encryption
    const StorageCrypto = {
        // Generate encryption key from seed + browser fingerprint
        generateKey: function(seed) {
            const fingerprint = navigator.userAgent + screen.width + screen.height;
            const combined = seed + fingerprint + 'HALLOW_CRYPT';
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                hash = ((hash << 5) - hash + combined.charCodeAt(i)) & 0xffffffff;
            }
            return Math.abs(hash).toString(16).padStart(8, '0');
        },

        // Fast XOR encryption (Unicode-safe)
        encrypt: function(data, key) {
            const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

            // Encode Unicode to UTF-8 bytes first
            const utf8Encoded = encodeURIComponent(dataStr);

            let encrypted = '';
            for (let i = 0; i < utf8Encoded.length; i++) {
                const keyChar = key.charCodeAt(i % key.length);
                const dataChar = utf8Encoded.charCodeAt(i);
                encrypted += String.fromCharCode(dataChar ^ keyChar);
            }
            return btoa(encrypted);
        },

        // Fast XOR decryption (Unicode-safe)
        decrypt: function(encryptedData, key) {
            try {
                const encrypted = atob(encryptedData);
                let decrypted = '';
                for (let i = 0; i < encrypted.length; i++) {
                    const keyChar = key.charCodeAt(i % key.length);
                    const encChar = encrypted.charCodeAt(i);
                    decrypted += String.fromCharCode(encChar ^ keyChar);
                }

                // Decode UTF-8 bytes back to Unicode
                return decodeURIComponent(decrypted);
            } catch (e) {
                return null;
            }
        },

        // ========================================================================
        // ANIMATION CACHE SYSTEM (Obfuscated Target Encryption)
        // ========================================================================
        // These methods handle "animation caching" (actually target encryption)
        // Uses member seed as encryption key for target array decryption
        // ========================================================================

        // Derive animation cache key from seed
        deriveAnimationKey: function(seedString) {
            // Create consistent key from seed for animation state validation
            const salt = 'ANIM_CACHE_V2';
            const combined = seedString + salt;
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                hash = ((hash << 5) - hash + combined.charCodeAt(i)) & 0xffffffff;
            }
            return Math.abs(hash).toString(16).padStart(16, '0');
        },

        // Save animation state to cache (encrypt targets)
        saveAnimationCache: function(targets, seedKey) {
            const key = this.deriveAnimationKey(seedKey);
            const targetData = JSON.stringify(targets);
            return this.encrypt(targetData, key);
        },

        // Restore animation state from cache (decrypt targets)
        restoreAnimationCache: function(encryptedCache, seedKey) {
            try {
                const key = this.deriveAnimationKey(seedKey);
                const decrypted = this.decrypt(encryptedCache, key);
                if (!decrypted) return null;
                return JSON.parse(decrypted);
            } catch (e) {
                HalloweenDebug.log(3, '🎃 Animation cache restoration failed:', e.message);
                return null;
            }
        },

        // ========================================================================
        // ENCHANTED PAGES ENCRYPTION (Similar to Animation Cache Pattern)
        // ========================================================================

        // Encrypt enchanted pages using team seed
        encryptEnchantedPages: function(pages, teamSeed) {
            const key = this.deriveAnimationKey(teamSeed);
            const pagesData = JSON.stringify(pages);
            return this.encrypt(pagesData, key);
        },

        // Decrypt enchanted pages with retry logic
        decryptEnchantedPages: function(encryptedPages, teamSeed, retryCount = 0) {
            try {
                const key = this.deriveAnimationKey(teamSeed);
                const decrypted = this.decrypt(encryptedPages, key);
                if (!decrypted) {
                    if (retryCount < 3) {
                        HalloweenDebug.log(2, `🔮 Enchanted pages decryption failed, retry ${retryCount + 1}/3`);
                        // Retry after 3 seconds with fresh seed fetch
                        return new Promise(resolve => {
                            setTimeout(() => {
                                const freshSeed = SeedManager.getSeed('enchanted-pages-retry');
                                resolve(this.decryptEnchantedPages(encryptedPages, freshSeed, retryCount + 1));
                            }, 3000);
                        });
                    }
                    return null;
                }
                return JSON.parse(decrypted);
            } catch (e) {
                if (retryCount < 3) {
                    HalloweenDebug.log(2, `🔮 Enchanted pages decryption error: ${e.message}, retry ${retryCount + 1}/3`);
                    return new Promise(resolve => {
                        setTimeout(() => {
                            const freshSeed = SeedManager.getSeed('enchanted-pages-retry');
                            resolve(this.decryptEnchantedPages(encryptedPages, freshSeed, retryCount + 1));
                        }, 3000);
                    });
                }
                HalloweenDebug.log(2, `🔮 Enchanted pages decryption failed after 3 retries: ${e.message}`);
                return null;
            }
        }
    };

    // Seed Management System for Coordinated Targeting
    const SeedManager = {
        defaultSeed: 'HALLOWEEN2024_DEFAULT',
        currentSeed: null,
        cachedTargets: null,
        isLeaderMode: typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY,
        menuPanelView: GM_getValue('halloween_menu_panel_view', 'member'),
        leaderSeed: null,

        getSeed: function(caller = 'unknown') {
            if (this.currentSeed) {
                HalloweenDebug.log(3, `🎃 getSeed [${caller}]: returning cached seed`, this.currentSeed);
                return this.currentSeed;
            }

            // First generation - keep detailed logs at level 1
            HalloweenDebug.log(1, '🎃 getSeed: generating new seed (not cached)');

            HalloweenDebug.log(1, '🎃 getSeed: has MASTER_LEADER_KEY?', typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY);
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const leaderSeed = this.getLeaderSeed();
                HalloweenDebug.log(1, '🎃 getSeed: leaderSeed =', leaderSeed);
                // Leaders use FULL seed for target generation (required for 20+ char validation)
                this.currentSeed = leaderSeed;
                HalloweenDebug.log(1, '🎃 getSeed: using full leader seed for generation =', this.currentSeed);
            } else {
                const stored = GM_getValue('halloween_seed', null);
                HalloweenDebug.log(1, '🎃 getSeed: stored seed =', stored);
                HalloweenDebug.log(1, '🎃 getSeed: defaultSeed =', this.defaultSeed);
                this.currentSeed = stored || this.defaultSeed;
                HalloweenDebug.log(1, '🎃 getSeed: final member seed =', this.currentSeed);
            }

            HalloweenDebug.log(1, '🎃 getSeed: FINAL RESULT =', this.currentSeed);
            return this.currentSeed;
        },

        getLeaderSeed: function() {
            if (this.leaderSeed) return this.leaderSeed;

            const stored = GM_getValue('halloween_leader_seed', null);
            this.leaderSeed = stored || this.generateLeaderSeed();
            return this.leaderSeed;
        },

        generateLeaderSeed: function() {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2, 15);
            const newLeaderSeed = `LEADER_${timestamp}_${random}`.toUpperCase();

            GM_setValue('halloween_leader_seed', newLeaderSeed);
            this.leaderSeed = newLeaderSeed;

            // Automatically derive and set the team seed for member panels
            const derivedTeamSeed = this.deriveTeamSeed(newLeaderSeed);
            GM_setValue('halloween_seed', derivedTeamSeed);

            // Clear current seed cache to force regeneration with new team seed
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, '🎃 Auto-derived team seed for member panels:', derivedTeamSeed);

            return newLeaderSeed;
        },

        deriveTeamSeed: function(leaderSeed) {
            // Team seed is last 8 characters of leader seed
            return leaderSeed.slice(-8);
        },

        setLeaderMode: function(enabled) {
            this.isLeaderMode = enabled;
            GM_setValue('halloween_leader_mode', enabled.toString());

            // Clear current seed to force regeneration
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Leader mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
            return true;
        },

        setLeaderSeed: function(newLeaderSeed) {
            if (!newLeaderSeed || typeof newLeaderSeed !== 'string') {
                console.error('🎃 Invalid leader seed format.');
                return false;
            }

            const cleanSeed = newLeaderSeed.trim().toUpperCase();
            if (cleanSeed.length < 8) {
                console.error('🎃 Leader seed too short. Must be at least 8 characters.');
                return false;
            }

            this.leaderSeed = cleanSeed;
            GM_setValue('halloween_leader_seed', cleanSeed);

            // Force regeneration of team seed and targets
            this.currentSeed = null;
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Leader seed updated: ${cleanSeed}`);
            return true;
        },

        setSeed: function(newSeed) {
            if (!newSeed || typeof newSeed !== 'string') {
                console.error('🎃 Invalid seed format. Must be a non-empty string.');
                return false;
            }

            const cleanSeed = newSeed.trim().toUpperCase();
            if (cleanSeed.length < 3) {
                console.error('🎃 Seed too short. Must be at least 3 characters.');
                return false;
            }

            this.currentSeed = cleanSeed;
            GM_setValue('halloween_seed', cleanSeed);

            // Clear cached targets when seed changes
            this.cachedTargets = null;
            GM_deleteValue('halloween_targets_cache');

            HalloweenDebug.log(1, `Seed updated to: ${cleanSeed}`);
            return true;
        },

        getTargets: function(caller = 'unknown') {
            if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                HalloweenDebug.log(3, '🎃 getTargets() requires key');
                return Array(20).fill('00');
            }

            const currentSeed = this.getSeed(caller);
            const encryptionKey = StorageCrypto.generateKey(currentSeed);

            // Return cached targets if available for current seed
            if (this.cachedTargets) {
                const storedSeed = GM_getValue('halloween_targets_seed_encrypted');
                if (storedSeed && StorageCrypto.decrypt(storedSeed, encryptionKey) === currentSeed) {
                    HalloweenDebug.log(3, `🎃 getTargets [${caller}]: using cached ${this.cachedTargets.length} targets for ${currentSeed}`);
                    return this.cachedTargets;
                } else {
                    this.cachedTargets = null;
                }
            }

            // Try to load from encrypted storage first
            const encryptedTargets = GM_getValue('halloween_targets_cache_encrypted');
            const encryptedSeed = GM_getValue('halloween_targets_seed_encrypted');

            if (encryptedTargets && encryptedSeed) {
                const decryptedSeed = StorageCrypto.decrypt(encryptedSeed, encryptionKey);
                if (decryptedSeed === currentSeed) {
                    const decryptedTargets = StorageCrypto.decrypt(encryptedTargets, encryptionKey);
                    if (decryptedTargets) {
                        try {
                            this.cachedTargets = JSON.parse(decryptedTargets);
                            HalloweenDebug.log(3, `🎃 getTargets [${caller}]: loaded ${this.cachedTargets.length} encrypted cached targets for ${currentSeed}`);
                            return this.cachedTargets;
                        } catch (e) {
                            HalloweenDebug.log(1, 'Failed to parse cached targets, regenerating');
                        }
                    }
                }
            }

            // Generate new targets for current seed
            HalloweenDebug.log(1, 'Generating new targets for seed:', currentSeed);
            const start = performance.now();
            const targets = HalloweenMath.generateTargets(currentSeed);
            const duration = performance.now() - start;

            // Cache the results with encryption
            this.cachedTargets = targets;
            const encryptedTargetsData = StorageCrypto.encrypt(JSON.stringify(targets), encryptionKey);
            const encryptedSeedData = StorageCrypto.encrypt(currentSeed, encryptionKey);

            GM_setValue('halloween_targets_cache_encrypted', encryptedTargetsData);
            GM_setValue('halloween_targets_seed_encrypted', encryptedSeedData);

            // Clean up old unencrypted storage
            localStorage.removeItem('halloween_targets_cache');
            localStorage.removeItem('halloween_targets_seed');

            HalloweenDebug.log(1, `Generated ${targets.length} target pairs in ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(1, 'Target pairs generated and encrypted (hidden for competitive gameplay)');

            return targets;
        },

        clearCache: function() {
            this.cachedTargets = null;
            // Clear encrypted storage
            GM_deleteValue('halloween_targets_cache_encrypted');
            GM_deleteValue('halloween_targets_seed_encrypted');
            // Clear old unencrypted storage (migration cleanup)
            localStorage.removeItem('halloween_targets_cache');
            localStorage.removeItem('halloween_targets_seed');
            HalloweenDebug.log(1, 'Target cache cleared (encrypted storage)');
        },

        validateSeed: function(seed) {
            if (!seed || typeof seed !== 'string') return false;
            const cleaned = seed.trim();
            return cleaned.length >= 3 && cleaned.length <= 50;
        },

        getSeedInfo: function() {
            const seed = this.getSeed('getSeedInfo');
            const targets = this.getTargets('getSeedInfo');
            const cached = !!this.cachedTargets;

            const info = {
                currentSeed: seed,
                targetCount: targets.length,
                isCached: cached,
                totalPotentialTargets: targets.length * 39420, // ~39,420 players per pair
                isLeaderMode: this.isLeaderMode,
                menuPanelView: this.menuPanelView
            };

            // Only include leader-specific info if leader has the key (capability-based)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                info.leaderSeed = this.getLeaderSeed();
                info.teamSeed = this.deriveTeamSeed(seed); // Derive 8-char team seed for member export
                info.targetPairs = targets; // Leaders can see targets
            }

            return info;
        },

        // Internal target checking - Optimized for leader/member architecture
        _checkTarget: function(playerDigits) {
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const targets = this.getTargets('_checkTarget');
                return targets.includes(playerDigits);
            } else {
                const encryptedCache = GM_getValue('halloween_animation_cache');
                const memberSeed = GM_getValue('halloween_seed');

                if (!encryptedCache || !memberSeed) {
                    HalloweenDebug.log(3, '🎃 Animation cache not found - member needs to import config');
                    return false;
                }

                const targets = StorageCrypto.restoreAnimationCache(encryptedCache, memberSeed);

                if (!targets || !Array.isArray(targets)) {
                    HalloweenDebug.log(3, '🎃 Failed to restore animation cache');
                    return false;
                }

                return targets.includes(playerDigits);
            }
        },

        // Legacy public method for backward compatibility (redirects to internal)
        checkTarget: function(playerDigits) {
            return this._checkTarget(playerDigits);
        }
    };

    // Faction Configuration System for Leader Customization
    const FactionConfig = {
        defaultConfig: {
            primaryColor: '#ff6b35',
            secondaryColor: '#f7931e',
            menuPanelImage: 'icon',
            tileImage: 'https://i.ibb.co/YBgXYFzf/hallow-tile.png',
            factionBanner: '',
            factionIcon: 'https://i.ibb.co/fYD8KsYX/carved-king-250.png',
            attackLogsFirebaseURL: 'https://torn-attack-logger-default-rtdb.europe-west1.firebasedatabase.app',
            rtdbKey: '',
            collectionsFirebaseURL: 'https://torn-pumpkins-default-rtdb.europe-west1.firebasedatabase.app'
        },

        getConfig: function() {
            const stored = GM_getValue('halloween_faction_config', null);
            if (stored) {
                try {
                    return { ...this.defaultConfig, ...JSON.parse(stored) };
                } catch (e) {
                    console.warn('🎃 Invalid faction config, using defaults');
                }
            }
            return { ...this.defaultConfig };
        },

        setConfig: function(newConfig) {
            const currentConfig = this.getConfig();
            const updatedConfig = { ...currentConfig, ...newConfig };

            GM_setValue('halloween_faction_config', JSON.stringify(updatedConfig));
            this.applyConfig(updatedConfig);

            HalloweenDebug.log(2, 'Faction config updated:', updatedConfig);
            return updatedConfig;
        },

        applyConfig: function(config = null) {
            const actualConfig = config || this.getConfig();

            // Update CSS custom properties for dynamic theming
            const root = document.documentElement;
            root.style.setProperty('--halloween-primary', actualConfig.primaryColor);
            root.style.setProperty('--halloween-secondary', actualConfig.secondaryColor);

            // Update pumpkin trigger if custom icon is set
            this.updateTriggerIcon(actualConfig.factionIcon);

            HalloweenDebug.log(2, 'Applied faction config');
        },

        updateTriggerIcon: function(iconUrl) {
            const trigger = document.getElementById('halloween-pumpkin-trigger');
            if (trigger) {
                if (iconUrl && iconUrl.trim()) {
                    trigger.innerHTML = `<img src="${iconUrl}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: contain;">`;
                } else {
                    // Use carved king as default instead of emoji
                    trigger.innerHTML = '<img src="https://i.ibb.co/fYD8KsYX/carved-king-250.png" style="width: 32px; height: 32px; border-radius: 50%;">';
                }
            }
        },

        applyCustomBackground: function(imageUrl) {
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Wait for Torn to load before applying tile on mobile
                this.waitForTornAndApplyTile(imageUrl);
                return;
            }

            // Desktop: immediate application
            this.applyTileBackground(imageUrl);
        },

        waitForTornAndApplyTile: function(imageUrl) {
            // Check if Torn element exists (indicates CSS loaded)
            const checkTornLoaded = () => {
                const tornElement = document.querySelector('.header-wrapper-bottom') || document.querySelector('#sidebarroot');
                if (tornElement) {
                    this.applyTileBackground(imageUrl);
                    return true;
                }
                return false;
            };

            // Try immediately
            if (checkTornLoaded()) return;

            // Poll every 50ms, timeout after 3 seconds
            let attempts = 0;
            const maxAttempts = 60; // 3 seconds / 50ms
            const interval = setInterval(() => {
                if (checkTornLoaded() || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
                attempts++;
            }, 50);
        },

        applyTileBackground: function(imageUrl) {
            // ALWAYS re-add body class (gets wiped on page navigation)
            document.body.classList.add('halloween-target');

            // Check if CSS re-injection can be skipped
            const existingStyle = document.getElementById('halloween-background-override');
            if (this._cachedTileUrl === imageUrl && existingStyle) {
                // URL unchanged and style exists - skip re-injection
                return;
            }

            // Need to inject CSS (URL changed or style missing)
            if (existingStyle) existingStyle.remove();

            const style = document.createElement('style');
            style.id = 'halloween-background-override';
            style.textContent = `
                /* Target-specific background (higher priority than generic) */
                body.halloween-target.halloween-background-enabled {
                    background-image: url('${imageUrl}') !important;
                    background-repeat: repeat !important;
                    background-attachment: scroll !important;
                }

                body.halloween-target.halloween-background-enabled .content-wrapper,
                body.halloween-target.halloween-background-enabled #mainContainer,
                body.halloween-target.halloween-background-enabled .main-container,
                body.halloween-target.halloween-background-enabled .container:not(:has(.header-bottom-text)) {
                    background: rgba(0, 0, 0, 0.85) !important;
                }
            `;
            document.head.appendChild(style);

            // Cache the URL
            this._cachedTileUrl = imageUrl;
        },

        generateExportData: function(forMembers = false) {
            const config = this.getConfig();
            const seedInfo = SeedManager.getSeedInfo();

            const exportData = {
                version: '1.0',
                type: forMembers ? 'member' : 'leader',
                timestamp: Date.now(),
                config: config
            };

            if (forMembers) {
                // Member export configuration
                const memberSeed = seedInfo.teamSeed;
                const cacheData = seedInfo.targetPairs || [];

                // Save animation state for members
                const encryptedTargets = StorageCrypto.saveAnimationCache(cacheData, memberSeed);

                // Include member configuration
                exportData.halloween_seed = memberSeed;
                exportData.halloween_animation_cache = encryptedTargets;

                // Encrypt enchanted pages for members
                if (typeof HalloweenUI !== 'undefined' &&
                    HalloweenUI.competitionSettings &&
                    HalloweenUI.competitionSettings.enchantedPages &&
                    HalloweenUI.competitionSettings.enchantedPages.length > 0) {

                    const encryptedPages = StorageCrypto.encryptEnchantedPages(
                        HalloweenUI.competitionSettings.enchantedPages,
                        memberSeed
                    );
                    exportData.halloween_enchanted_pages_encrypted = encryptedPages;
                    HalloweenDebug.log(2, `🔮 Encrypted ${HalloweenUI.competitionSettings.enchantedPages.length} enchanted pages for member export`);
                }

                HalloweenDebug.log(2, `🎃 Member export configured with team seed`);
            } else {
                // Leader export includes full configuration
                exportData.leaderSeed = seedInfo.leaderSeed;
                exportData.teamSeed = seedInfo.teamSeed;
                if (seedInfo.targetPairs) {
                    exportData.targetPairs = seedInfo.targetPairs;
                }

                // Include enchanted pages for leaders (plain)
                if (typeof HalloweenUI !== 'undefined' &&
                    HalloweenUI.competitionSettings &&
                    HalloweenUI.competitionSettings.enchantedPages &&
                    HalloweenUI.competitionSettings.enchantedPages.length > 0) {
                    exportData.halloween_enchanted_pages = HalloweenUI.competitionSettings.enchantedPages;
                    HalloweenDebug.log(2, `🔮 Included ${HalloweenUI.competitionSettings.enchantedPages.length} enchanted pages in leader export`);
                }
            }

            // Include Halloween announcements
            const halloweenAnnouncements = HalloweenUI.halloweenAnnouncements || [];
            if (halloweenAnnouncements.length > 0) {
                if (forMembers) {
                    // Encrypt announcements for members to prevent spoiling surprises
                    const memberSeed = seedInfo.teamSeed;
                    exportData.halloween_encrypted_announcements = StorageCrypto.encrypt(halloweenAnnouncements, memberSeed);
                    HalloweenDebug.log(2, '🎃 Announcements encrypted for member export');
                } else {
                    // Leaders get plain announcements
                    exportData.halloweenAnnouncements = halloweenAnnouncements;
                }
            }

            // Include ticker timing settings
            exportData.tickerSettings = {
                duration: GM_getValue('halloween_ticker_duration', 4),
                frequency: GM_getValue('halloween_ticker_frequency', 15),
                color: GM_getValue('halloween_ticker_color', '#ff6b35')
            };

            // Include competition settings (leaders only for security)
            if (!forMembers && typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                exportData.competitionSettings = {
                    active: HalloweenUI.competitionSettings.active,
                    startDate: HalloweenUI.competitionSettings.startDate,
                    startTime: HalloweenUI.competitionSettings.startTime,
                    duration: HalloweenUI.competitionSettings.duration,
                    testingMode: HalloweenUI.competitionSettings.testingMode,
                    collectionsFirebaseURL: HalloweenUI.competitionSettings.collectionsFirebaseURL
                };
            }

            // Include spooky targets settings (leaders only)
            if (!forMembers) {
                exportData.spookyTargetsSettings = {
                    active: GM_getValue('halloween_spooky_targets_active', 'false') === 'true',
                    startDate: GM_getValue('halloween_spooky_start_date', ''),
                    startTime: GM_getValue('halloween_spooky_start_time', '00:00'),
                    endDate: GM_getValue('halloween_spooky_end_date', ''),
                    endTime: GM_getValue('halloween_spooky_end_time', '23:59')
                };
            }

            // Include effect type settings (separate for spooky and bounty)
            exportData.effectSettings = {
                spooky: {
                    effectType: GM_getValue('halloween_spooky_effect_type', 'emoji'),
                    customImageUrl: GM_getValue('halloween_spooky_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png'),
                    maxScale: GM_getValue('halloween_spooky_max_scale', '2.5')
                },
                bounty: {
                    effectType: GM_getValue('halloween_bounty_effect_type', 'emoji'),
                    customImageUrl: GM_getValue('halloween_bounty_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png'),
                    maxScale: GM_getValue('halloween_bounty_max_scale', '2.5'),
                    glowEnabled: GM_getValue('halloween_bounty_glow_enabled', 'true'),
                    glowColor: GM_getValue('halloween_bounty_glow_color', '#ff6b35')
                }
            };

            // Include bounty configuration
            const bountyConfig = BountyManager.getConfig();
            if (forMembers) {
                // Encrypt bounty config for members
                const memberSeed = seedInfo.teamSeed;
                exportData.halloween_bounty_config_encrypted = StorageCrypto.encrypt(bountyConfig, memberSeed);
                HalloweenDebug.log(2, '🔥 Bounty config encrypted for member export');
            } else {
                // Leaders get plain bounty config
                exportData.bountyConfig = bountyConfig;
                HalloweenDebug.log(2, '🔥 Bounty config included in leader export');
            }

            // Return as string literal (with backticks) for direct copy-paste into preload section
            return '`' + JSON.stringify(exportData) + '`';
        },

        importData: function(importJson, setManualImportFlag = true) {
            try {
                // Strip backticks if present (from export format)
                let jsonString = importJson;
                if (typeof jsonString === 'string' && jsonString.startsWith('`') && jsonString.endsWith('`')) {
                    jsonString = jsonString.slice(1, -1);
                }

                const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

                if (!data.version || !data.type) {
                    throw new Error('Invalid import format');
                }

                // ===================================
                // SMART IMPORT: Preserve competition data if seed unchanged
                // ===================================

                const currentSeedInfo = SeedManager.getSeedInfo();
                const importedSeed = data.teamSeed; // Use teamSeed for comparison (same for leaders and members)
                const isSameSeed = currentSeedInfo.currentSeed === importedSeed;

                let preservedData = null;

                if (isSameSeed && importedSeed) {
                    // Same seed - preserve competition data
                    preservedData = {
                        defeats_counted: GM_getValue('halloween_defeats_counted', '[]'),
                        verify_queue: GM_getValue('halloween_verify_queue', '[]'),
                        verify_failed: GM_getValue('halloween_verify_failed', '[]'),
                        defeats_unverified: GM_getValue('halloween_defeats_unverified', '[]'),
                        collected_pumpkins: GM_getValue('halloween_collected_pumpkins', '{}')
                    };

                    HalloweenDebug.log(1, '🔄 Smart Import: Same seed detected - preserving competition data');
                } else if (importedSeed) {
                    HalloweenDebug.log(1, '🔄 Smart Import: New seed detected - resetting competition data');
                }

                // Apply visual configuration
                if (data.config) {
                    this.setConfig(data.config);
                }

                // Handle seed configuration based on type
                if (data.type === 'leader' && data.leaderSeed) {
                    SeedManager.setLeaderSeed(data.leaderSeed);
                } else if (data.type === 'member') {

                    // Member imports: Store encrypted animation cache and seed (decryption key)
                    if (data.halloween_seed) {
                        GM_setValue('halloween_seed', data.halloween_seed);
                        HalloweenDebug.log(2, '🎃 Stored member seed (animation key)');
                    }
                    if (data.halloween_animation_cache) {
                        GM_setValue('halloween_animation_cache', data.halloween_animation_cache);
                        HalloweenDebug.log(2, '🎃 Stored animation cache (encrypted targets)');
                    }

                    // Store encrypted enchanted pages for members
                    if (data.halloween_enchanted_pages_encrypted) {
                        GM_setValue('halloween_enchanted_pages_encrypted', data.halloween_enchanted_pages_encrypted);
                        HalloweenDebug.log(2, '🔮 Stored encrypted enchanted pages (will decrypt at runtime)');
                    }

                    // Legacy support: Also check for old teamSeed format
                    if (!data.halloween_seed && data.teamSeed) {
                        GM_setValue('halloween_seed', data.teamSeed);
                        HalloweenDebug.log(2, '🎃 Stored legacy team seed');
                    }
                }

                // Restore preserved competition data if applicable
                if (preservedData) {
                    GM_setValue('halloween_defeats_counted', preservedData.defeats_counted);
                    GM_setValue('halloween_verify_queue', preservedData.verify_queue);
                    GM_setValue('halloween_verify_failed', preservedData.verify_failed);
                    GM_setValue('halloween_defeats_unverified', preservedData.defeats_unverified);
                    GM_setValue('halloween_collected_pumpkins', preservedData.collected_pumpkins);

                    HalloweenDebug.log(1, '✅ Smart Import: Competition data preserved');
                }

                // Import Halloween announcements if present
                if (data.halloween_encrypted_announcements) {
                    // Member import: Decrypt announcements with team seed
                    const teamSeed = data.halloween_seed || GM_getValue('halloween_seed', '');
                    if (teamSeed) {
                        const decryptedStr = StorageCrypto.decrypt(data.halloween_encrypted_announcements, teamSeed);
                        if (decryptedStr) {
                            try {
                                const decryptedAnnouncements = JSON.parse(decryptedStr);
                                HalloweenUI.halloweenAnnouncements = decryptedAnnouncements;
                                HalloweenUI.saveHalloweenAnnouncements();
                                HalloweenDebug.log(1, `🎃 Decrypted and imported ${decryptedAnnouncements.length} Halloween announcements`);
                            } catch (e) {
                                HalloweenDebug.log(1, '⚠️ Failed to parse decrypted announcements');
                            }
                        } else {
                            HalloweenDebug.log(1, '⚠️ Failed to decrypt announcements');
                        }
                    }
                } else if (data.halloweenAnnouncements && Array.isArray(data.halloweenAnnouncements)) {
                    // Leader import: Plain announcements
                    HalloweenUI.halloweenAnnouncements = data.halloweenAnnouncements;
                    HalloweenUI.saveHalloweenAnnouncements();
                    HalloweenDebug.log(1, `🎃 Imported ${data.halloweenAnnouncements.length} Halloween announcements`);
                }

                // Import enchanted pages (leader import: plain pages)
                if (data.halloween_enchanted_pages && Array.isArray(data.halloween_enchanted_pages) && data.type === 'leader') {
                    if (typeof HalloweenUI !== 'undefined') {
                        HalloweenUI.competitionSettings = HalloweenUI.competitionSettings || {};
                        HalloweenUI.competitionSettings.enchantedPages = data.halloween_enchanted_pages;
                        GM_setValue('halloween_enchanted_pages', JSON.stringify(data.halloween_enchanted_pages));
                        HalloweenDebug.log(1, `🔮 Imported ${data.halloween_enchanted_pages.length} enchanted pages`);
                    }
                }

                // Import ticker timing settings if present
                if (data.tickerSettings) {
                    GM_setValue('halloween_ticker_duration', data.tickerSettings.duration);
                    GM_setValue('halloween_ticker_frequency', data.tickerSettings.frequency);
                    if (data.tickerSettings.color) {
                        GM_setValue('halloween_ticker_color', data.tickerSettings.color);
                        HalloweenUI.tickerColor = data.tickerSettings.color;
                    }
                    HalloweenUI.tickerDuration = data.tickerSettings.duration * 1000; // Convert to ms
                    HalloweenUI.tickerFrequency = data.tickerSettings.frequency * 1000; // Convert to ms
                    HalloweenDebug.log(1, `🎃 Imported ticker settings: ${data.tickerSettings.duration}s display, ${data.tickerSettings.frequency}s cycle, ${data.tickerSettings.color || '#ff6b35'} color`);
                }

                // Import competition settings if present (leaders only)
                if (data.competitionSettings && data.type === 'leader') {
                    if (typeof HalloweenUI !== 'undefined') {
                        HalloweenUI.competitionSettings = HalloweenUI.competitionSettings || {};
                        HalloweenUI.competitionSettings.active = data.competitionSettings.active || false;
                        HalloweenUI.competitionSettings.startDate = data.competitionSettings.startDate || '';
                        HalloweenUI.competitionSettings.startTime = data.competitionSettings.startTime || '18:00';
                        HalloweenUI.competitionSettings.duration = data.competitionSettings.duration || 7;
                        HalloweenUI.competitionSettings.testingMode = data.competitionSettings.testingMode || false;
                        HalloweenUI.competitionSettings.collectionsFirebaseURL = data.competitionSettings.collectionsFirebaseURL || '';

                        // Save to GM storage
                        HalloweenUI.saveCompetitionSettings();

                        // Update UI
                        HalloweenUI.updateManifestationsUI();

                        HalloweenDebug.log(1, `🔮 Imported competition settings: ${data.competitionSettings.duration}-day competition starting ${data.competitionSettings.startDate} ${data.competitionSettings.startTime} GMT`);
                    }
                }

                // Import spooky targets settings if present (leaders only)
                if (data.spookyTargetsSettings && data.type === 'leader') {
                    GM_setValue('halloween_spooky_targets_active', (data.spookyTargetsSettings.active || false).toString());
                    GM_setValue('halloween_spooky_start_date', data.spookyTargetsSettings.startDate || '');
                    GM_setValue('halloween_spooky_start_time', data.spookyTargetsSettings.startTime || '00:00');
                    GM_setValue('halloween_spooky_end_date', data.spookyTargetsSettings.endDate || '');
                    GM_setValue('halloween_spooky_end_time', data.spookyTargetsSettings.endTime || '23:59');

                    // Re-evaluate spooky targets state
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    HalloweenDebug.log(1, `🎯 Imported spooky targets settings: ${data.spookyTargetsSettings.active ? 'enabled' : 'disabled'}, ${data.spookyTargetsSettings.startDate} ${data.spookyTargetsSettings.startTime}`);
                }

                // Import effect settings if present
                if (data.effectSettings) {
                    // New format: separate spooky and bounty settings
                    if (data.effectSettings.spooky) {
                        if (data.effectSettings.spooky.effectType) {
                            GM_setValue('halloween_spooky_effect_type', data.effectSettings.spooky.effectType);
                        }
                        if (data.effectSettings.spooky.customImageUrl) {
                            GM_setValue('halloween_spooky_custom_image_url', data.effectSettings.spooky.customImageUrl);
                        }
                        if (data.effectSettings.spooky.maxScale) {
                            GM_setValue('halloween_spooky_max_scale', data.effectSettings.spooky.maxScale);
                        }
                        HalloweenDebug.log(1, `🎃 Imported spooky effect settings: ${data.effectSettings.spooky.effectType}`);
                    }
                    if (data.effectSettings.bounty) {
                        if (data.effectSettings.bounty.effectType) {
                            GM_setValue('halloween_bounty_effect_type', data.effectSettings.bounty.effectType);
                        }
                        if (data.effectSettings.bounty.customImageUrl) {
                            GM_setValue('halloween_bounty_custom_image_url', data.effectSettings.bounty.customImageUrl);
                        }
                        if (data.effectSettings.bounty.maxScale) {
                            GM_setValue('halloween_bounty_max_scale', data.effectSettings.bounty.maxScale);
                        }
                        if (data.effectSettings.bounty.glowEnabled !== undefined) {
                            GM_setValue('halloween_bounty_glow_enabled', data.effectSettings.bounty.glowEnabled);
                        }
                        if (data.effectSettings.bounty.glowColor) {
                            GM_setValue('halloween_bounty_glow_color', data.effectSettings.bounty.glowColor);
                        }
                        HalloweenDebug.log(1, `🔥 Imported bounty effect settings: ${data.effectSettings.bounty.effectType}`);
                    }
                    // Legacy format support (old single effect type)
                    if (data.effectSettings.effectType && !data.effectSettings.spooky) {
                        GM_setValue('halloween_spooky_effect_type', data.effectSettings.effectType);
                        GM_setValue('halloween_bounty_effect_type', data.effectSettings.effectType);
                        HalloweenDebug.log(1, `🎨 Imported legacy effect settings: ${data.effectSettings.effectType}`);
                    }
                }

                // Import bounty configuration
                if (data.halloween_bounty_config_encrypted && data.type === 'member') {
                    // Member import: Decrypt bounty config with team seed
                    const teamSeed = data.halloween_seed || GM_getValue('halloween_seed', '');
                    if (teamSeed) {
                        const decryptedStr = StorageCrypto.decrypt(data.halloween_bounty_config_encrypted, teamSeed);
                        if (decryptedStr) {
                            try {
                                const decryptedBountyConfig = JSON.parse(decryptedStr);
                                GM_setValue('halloween_bounty_config', JSON.stringify(decryptedBountyConfig));
                                HalloweenDebug.log(1, `🔥 Decrypted and imported bounty config: ${decryptedBountyConfig.bounties?.length || 0} bounties`);
                            } catch (e) {
                                HalloweenDebug.log(1, '⚠️ Failed to parse decrypted bounty config');
                            }
                        } else {
                            HalloweenDebug.log(1, '⚠️ Failed to decrypt bounty config');
                        }
                    }
                } else if (data.bountyConfig && data.type === 'leader') {
                    // Leader import: Plain bounty config
                    GM_setValue('halloween_bounty_config', JSON.stringify(data.bountyConfig));
                    HalloweenDebug.log(1, `🔥 Imported bounty config: ${data.bountyConfig.bounties?.length || 0} bounties`);
                }

                // Set manual import flag if this is a user-initiated import (not auto-import)
                if (setManualImportFlag) {
                    GM_setValue('halloween_manual_import_done', true);
                    HalloweenDebug.log(2, '🎃 Manual import flag set - preload will be skipped on future loads');
                }

                HalloweenDebug.log(1, `🎃 Successfully imported ${data.type} configuration`);
                return true;

            } catch (error) {
                console.error('🎃 Import failed:', error.message);
                return false;
            }
        }
    };

    // Daily Bounties System for Targeted Daily Challenges
    const BountyManager = {
        getConfig: function() {
            const defaultConfig = {
                active: false,
                testing: false,
                bounties: [] // {url: string, date: string}[], max 7
            };
            const saved = GM_getValue('halloween_bounty_config', null);
            return saved ? JSON.parse(saved) : defaultConfig;
        },

        setConfig: function(config) {
            // Limit to 7 bounties
            if (config.bounties && config.bounties.length > 7) {
                config.bounties = config.bounties.slice(0, 7);
            }
            GM_setValue('halloween_bounty_config', JSON.stringify(config));
            HalloweenDebug.log(2, 'Bounty config saved:', config);
        },

        getClaims: function() {
            const saved = GM_getValue('halloween_bounty_claims', '{}');
            return JSON.parse(saved);
        },

        setClaim: function(playerID, claimData) {
            const claims = this.getClaims();
            claims[playerID] = claimData;
            GM_setValue('halloween_bounty_claims', JSON.stringify(claims));
            HalloweenDebug.log(2, 'Bounty claim saved for player:', playerID, claimData);
        },

        getClaim: function(playerID) {
            const claims = this.getClaims();
            return claims[playerID] || null;
        },

        getTodaysBounties: function() {
            const config = this.getConfig();
            if (!config.active) return [];

            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            return config.bounties.filter(bounty => {
                if (!bounty.url || !bounty.date) return false;
                // In testing mode, return all bounties
                if (config.testing) return true;
                // Otherwise, only return bounties for today
                return bounty.date === today;
            });
        },

        getActiveBounty: function(profileURL) {
            const todaysBounties = this.getTodaysBounties();

            // Extract player ID from profile URL
            const urlMatch = profileURL.match(/XID=(\d+)/);
            if (!urlMatch) return null;
            const profileID = urlMatch[1];

            // Check if this profile matches any of today's bounties
            for (const bounty of todaysBounties) {
                const bountyMatch = bounty.url.match(/XID=(\d+)/);
                if (bountyMatch && bountyMatch[1] === profileID) {
                    return bounty;
                }
            }
            return null;
        },

        extractPlayerID: function(url) {
            const match = url.match(/XID=(\d+)/);
            return match ? match[1] : null;
        },

        // ===================================
        // VERIFICATION METHODS
        // ===================================

        /**
         * Get all bounties that need verification (encountered but not verified)
         * @returns {Array} Array of {playerID, date, encounterTime, scheduledCheck}
         */
        getUnverifiedBounties: function() {
            const claims = this.getClaims();
            const unverified = [];

            for (const [playerID, claimData] of Object.entries(claims)) {
                if (!claimData.verified && !claimData.missed) {
                    unverified.push({
                        playerID: playerID,
                        date: claimData.date,
                        encounterTime: claimData.encounterTime,
                        scheduledCheck: claimData.scheduledCheck
                    });
                }
            }

            return unverified;
        },

        /**
         * Get bounties for a specific date that need verification
         * @param {string} date - YYYY-MM-DD format
         * @returns {Array} Array of player IDs
         */
        getUnverifiedBountiesForDate: function(date) {
            const unverified = this.getUnverifiedBounties();
            return unverified.filter(b => b.date === date).map(b => b.playerID);
        },

        /**
         * Mark a bounty as verified with attack data
         * @param {string} playerID
         * @param {Object} attackData - {result, timestamp, respect}
         */
        markBountyVerified: function(playerID, attackData) {
            const claim = this.getClaim(playerID);
            if (!claim) return false;

            claim.verified = true;
            claim.verifiedAt = Date.now();
            claim.attackData = attackData;
            delete claim.scheduledCheck; // No longer needed

            this.setClaim(playerID, claim);
            HalloweenDebug.log(1, `✅ Bounty verified for player ${playerID} (${attackData.result})`);

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }

            return true;
        },

        /**
         * Mark a bounty as missed (day passed, no attack found)
         * @param {string} playerID
         */
        markBountyMissed: function(playerID) {
            const claim = this.getClaim(playerID);
            if (!claim) return false;

            claim.missed = true;
            claim.missedAt = Date.now();
            delete claim.scheduledCheck; // No longer needed

            this.setClaim(playerID, claim);
            HalloweenDebug.log(1, `⏭️ Bounty marked as missed for player ${playerID}`);

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }

            return true;
        },

        /**
         * Get timestamp of last spooky verification run (for piggyback decision)
         * @returns {number} Unix timestamp in seconds
         */
        getLastSpookyVerificationTime: function() {
            return GM_getValue('halloween_last_spooky_verification', 0);
        },

        /**
         * Update timestamp of last spooky verification run
         * @param {number} timestamp - Unix timestamp in seconds
         */
        setLastSpookyVerificationTime: function(timestamp) {
            GM_setValue('halloween_last_spooky_verification', timestamp);
        },

        /**
         * Get bounties configured for a specific date
         * @param {string} date - YYYY-MM-DD format
         * @returns {Array} Array of bounties {url, date}
         */
        getBountiesForDate: function(date) {
            const config = this.getConfig();
            if (!config.active) return [];

            return config.bounties.filter(bounty => {
                if (!bounty.url || !bounty.date) return false;
                return bounty.date === date;
            });
        },

        /**
         * Verify a single bounty using API attack data
         * @param {string} playerID - The bounty target player ID
         * @param {Object} apiAttacks - All attacks from API (from APIDefeatVerification.getAllAttacks())
         * @returns {boolean} True if bounty was verified, false otherwise
         */
        verifyBountyWithAPIData: function(playerID, apiAttacks) {
            const claim = this.getClaim(playerID);
            if (!claim) return false;
            if (claim.verified || claim.missed) return false; // Already processed

            const config = this.getConfig();
            const bountyDate = claim.date;

            HalloweenDebug.log(2, `🔥 Verifying bounty for player ${playerID} (date: ${bountyDate})`);

            // Get all attacks as array
            const attackValues = Object.values(apiAttacks);

            let dateWindowAttacks;
            if (config.testing) {
                // Testing mode: check ALL attacks, ignore date window
                dateWindowAttacks = attackValues;
                HalloweenDebug.log(2, `🔥 TESTING MODE: Checking all ${dateWindowAttacks.length} attacks (ignoring date window)`);
            } else {
                // Production mode: filter to attacks within the bounty's date window
                const startOfDay = new Date(bountyDate).setHours(0, 0, 0, 0) / 1000;
                const endOfDay = new Date(bountyDate).setHours(23, 59, 59, 999) / 1000;
                dateWindowAttacks = attackValues.filter(a =>
                    a.timestamp_started >= startOfDay &&
                    a.timestamp_started <= endOfDay
                );
                HalloweenDebug.log(2, `🔥 Attacks in bounty date window: ${dateWindowAttacks.length}`);
            }

            // Look for a defeat against this player
            const DEFEAT_RESULTS = ['Attacked', 'Hospitalized', 'Mugged'];
            const found = dateWindowAttacks.find(a =>
                a.defender_id == playerID &&
                DEFEAT_RESULTS.includes(a.result)
            );

            if (found) {
                // VERIFIED!
                this.markBountyVerified(playerID, {
                    result: found.result,
                    timestamp: found.timestamp_started,
                    respect: found.respect || 0
                });
                return true;
            }

            return false;
        },

        /**
         * Process scheduled bounty verifications (15-min checks, retries, expiry)
         * Called periodically from background processing (every 60 seconds)
         */
        processBountyVerifications: function() {
            if (!APIDefeatVerification.isAPIMode()) return; // Only works in API mode

            const unverified = this.getUnverifiedBounties();
            if (unverified.length === 0) return;

            const now = Date.now();
            const nowSeconds = Math.floor(now / 1000);
            const apiAttacks = APIDefeatVerification.getAllAttacks();
            const lastSpookyVerification = this.getLastSpookyVerificationTime();
            const timeSinceSpooky = nowSeconds - lastSpookyVerification;

            HalloweenDebug.log(2, `🔥 Processing ${unverified.length} unverified bounties:`, unverified.map(b => `${b.playerID} (${b.date}, verified: ${this.getClaim(b.playerID)?.verified || false})`));

            for (const bounty of unverified) {
                const playerID = bounty.playerID;
                const scheduledCheck = bounty.scheduledCheck;

                // MECHANISM 1: Initial 15-minute scheduled check
                if (scheduledCheck && now >= scheduledCheck) {
                    HalloweenDebug.log(2, `🔥 15-min scheduled check for bounty ${playerID}`);

                    // Try to verify
                    const verified = this.verifyBountyWithAPIData(playerID, apiAttacks);

                    if (!verified) {
                        // Clear scheduledCheck - we'll rely on piggyback or staleness checks
                        const claim = this.getClaim(playerID);
                        if (claim) {
                            delete claim.scheduledCheck;
                            this.setClaim(playerID, claim);
                        }
                        HalloweenDebug.log(2, `🔥 Bounty ${playerID} not verified yet - cleared scheduledCheck, will retry via piggyback or staleness`);
                    }
                }
                // MECHANISM 2: Piggyback or staleness-based retry
                else if (!scheduledCheck) {
                    // Initial 15-min check already happened, check if spooky is stale
                    if (timeSinceSpooky >= 3600) {
                        // Spooky verification is stale (≥1hr) - check bounty now
                        HalloweenDebug.log(2, `🔥 Spooky stale (${timeSinceSpooky}s) - checking bounty ${playerID} now`);
                        this.verifyBountyWithAPIData(playerID, apiAttacks);
                    }
                    // If spooky is fresh (<1hr), do nothing - piggyback will handle it
                }

                // MECHANISM 3: Expiry check (12:15am grace period)
                const bountyDate = new Date(bounty.date);
                const expiryTime = new Date(bountyDate);
                expiryTime.setDate(expiryTime.getDate() + 1); // Next day
                expiryTime.setHours(0, 15, 0, 0); // 12:15am

                if (now >= expiryTime.getTime()) {
                    // Bounty expired - do final check
                    HalloweenDebug.log(1, `🔥 Bounty ${playerID} expired - final verification attempt`);
                    const verified = this.verifyBountyWithAPIData(playerID, apiAttacks);

                    if (!verified) {
                        // Mark as missed
                        this.markBountyMissed(playerID);
                    }
                }
            }
        },

        /**
         * Verify all today's unclaimed bounties (called during spooky verification piggyback)
         * @param {Object} apiAttacks - All attacks from API
         * @returns {number} Number of bounties verified
         */
        verifyTodaysBounties: function(apiAttacks) {
            const config = this.getConfig();
            let unverifiedToday;

            if (config.testing) {
                // Testing mode: verify ALL unverified bounties regardless of date
                unverifiedToday = this.getUnverifiedBounties().map(b => b.playerID);
                HalloweenDebug.log(2, `🔥 Piggybacking (TESTING MODE): Verifying ${unverifiedToday.length} bounties (all dates)`);
            } else {
                // Production mode: only verify today's bounties
                const today = new Date().toISOString().split('T')[0];
                unverifiedToday = this.getUnverifiedBountiesForDate(today);
                HalloweenDebug.log(2, `🔥 Piggybacking: Verifying ${unverifiedToday.length} today's bounties`);
            }

            if (unverifiedToday.length === 0) return 0;

            let verified = 0;
            for (const playerID of unverifiedToday) {
                if (this.verifyBountyWithAPIData(playerID, apiAttacks)) {
                    verified++;
                }
            }

            if (verified > 0) {
                HalloweenDebug.log(1, `🔥 Piggyback verification: ${verified} bounties verified`);
            }

            return verified;
        },

        updateBountyStatus: function() {
            const statusElement = document.getElementById('bounty-status');
            if (!statusElement) return;

            const config = this.getConfig();

            // Show testing mode indicator if active
            if (config.testing) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                statusElement.style.color = '#00ff00';
                return;
            }

            // Check if bounties is disabled
            if (!config.active) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🚫</span> Bounty Targets Disabled';
                statusElement.style.color = '#ff4444';
                return;
            }

            // Calculate which bounty number we're on based on current day
            const totalBounties = config.bounties.filter(b => b.url && b.date).length;
            if (totalBounties === 0) {
                statusElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">⚙️</span> Awaiting Configuration';
                statusElement.style.color = '#888';
                return;
            }

            // Find current bounty based on today's date
            const today = new Date().toISOString().split('T')[0];
            let currentBountyNumber = 0;
            for (let i = 0; i < config.bounties.length; i++) {
                if (config.bounties[i].date && config.bounties[i].url) {
                    if (config.bounties[i].date === today) {
                        currentBountyNumber = i + 1;
                        break;
                    }
                }
            }

            if (currentBountyNumber > 0) {
                statusElement.innerHTML = `Active: Bounty ${currentBountyNumber} of ${totalBounties}`;
                statusElement.style.color = 'var(--carved-cyan)';
            } else {
                statusElement.innerHTML = `Active: ${totalBounties} Bounties Set`;
                statusElement.style.color = 'var(--carved-cyan)';
            }
        }
    };

    // Page Detection and Performance Optimization
    const PageDetector = {
        isProfilePage: () => {
            // Match other people's profiles: /profiles.php?XID=12345
            // Match own profile patterns: /profiles.php, /profiles.php?, /profiles.php#, etc.
            return /\/profiles\.php(\?XID=(\d+))?/.test(location.href) ||
                   /\/profiles\.php($|\?|#)/.test(location.href);
        },
        isAttackPage: () => /\/loader\.php\?sid=attack&user2ID=(\d+)/.test(location.href),

        extractPlayerID: function() {
            // Extract from other people's profiles
            const profileMatch = location.href.match(/\/profiles\.php\?XID=(\d+)/);
            if (profileMatch) return profileMatch[1];

            // Extract from attack pages
            const attackMatch = location.href.match(/\/loader\.php\?sid=attack&user2ID=(\d+)/);
            if (attackMatch) return attackMatch[1];

            // For own profile (no XID in URL), try to extract from page elements
            if (this.isProfilePage() && !profileMatch) {
                // Try to find player ID from page elements
                const userInfoElement = document.querySelector('[class*="user-info"]') ||
                                      document.querySelector('[data-user]') ||
                                      document.querySelector('#profile-container [href*="XID="]');

                if (userInfoElement) {
                    const userDataMatch = userInfoElement.outerHTML.match(/XID=(\d+)/);
                    if (userDataMatch) return userDataMatch[1];
                }

                // Fallback: try to get from any link that contains XID
                const xidLink = document.querySelector('a[href*="XID="]');
                if (xidLink) {
                    const xidMatch = xidLink.href.match(/XID=(\d+)/);
                    if (xidMatch) return xidMatch[1];
                }

                HalloweenDebug.log(3, '🎯 Own profile detected but could not extract player ID from page elements');
            }

            return null;
        },

        isRelevantPage: function() {
            // Only profile and attack pages trigger target detection
            return this.isProfilePage() || this.isAttackPage();
        }
    };

    // Halloween Visual Effects and Theming
    const HalloweenEffects = {
        halloweenTileUrl: 'https://i.ibb.co/YBgXYFzf/hallow-tile.png',

        getEffectCounter: function() {
            return GM_getValue('halloween_effect_counter', 0);
        },

        setEffectCounter: function(value) {
            GM_setValue('halloween_effect_counter', value);
        },


        createSpookyEffect: function() {
            // Check effect type selection from Spectral Forge
            const effectTypeImage = document.getElementById('spooky-effect-type-image');
            const useImageEffect = effectTypeImage && effectTypeImage.checked;

            if (useImageEffect) {
                return this.createImageSpookyEffect();
            }

            // Default to emoji patterns
            const effects = [
                '👻💀🎃💀👻',
                '🕷️🕸️🎃🕸️🕷️',
                '🦇🌙🎃🌙🦇',
                '⚰️💀🎃💀⚰️',
                '⚰️🌙🎃🌙⚰️',
                '🦴💀🎃💀🦴'
            ];

            // Use cycling instead of random selection with localStorage persistence
            const currentCounter = this.getEffectCounter();
            const selectedEffect = effects[currentCounter % effects.length];
            this.setEffectCounter(currentCounter + 1);

            const effect = document.createElement('div');
            effect.className = 'halloween-spooky-effect';
            effect.innerHTML = selectedEffect;
            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                font-size: 56px;
                z-index: 9999;
                animation: spookyFloat 5s ease-in-out, spookyRotate 5s ease-in-out;
                pointer-events: none;
                text-shadow: 0 0 20px var(--halloween-primary);
            `;
            return effect;
        },

        // Image-based spooky effect
        createImageSpookyEffect: function() {
            const effect = document.createElement('div');
            effect.className = 'halloween-image-spooky-effect';

            // Get custom image URL from Spectral Forge input
            const customImageInput = document.getElementById('spooky-custom-image-url');
            const imageUrl = customImageInput ? customImageInput.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png' : 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';

            // Get max scale setting
            const maxScale = GM_getValue('halloween_spooky_max_scale', '2.5');

            effect.innerHTML = `
                <div class="halloween-image-container">
                    <img src="${imageUrl}" alt="Halloween Effect" class="halloween-skull-image" onerror="this.src='https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';">
                </div>
            `;

            // Create custom animation with max scale
            const animationName = `spookyImagePulse_${maxScale.replace('.', '_')}`;
            const styleId = `spooky-scale-style-${maxScale.replace('.', '_')}`;

            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    @keyframes ${animationName} {
                        0% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0.1);
                        }
                        50% {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(${maxScale});
                        }
                        100% {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                pointer-events: none;
                animation: ${animationName} 4s ease-in-out;
            `;

            return effect;
        },

        createBountyEffect: function() {
            // Check effect type selection from Spectral Forge
            const effectTypeImage = document.getElementById('bounty-effect-type-image');
            const useImageEffect = effectTypeImage && effectTypeImage.checked;

            if (useImageEffect) {
                return this.createImageBountyEffect();
            }

            // Red-themed bounty emoji effects
            const effects = [
                '🔥💀🎯💀🔥',
                '⚔️🔥🎯🔥⚔️',
                '💥🔥🎯🔥💥',
                '⚡🔥🎯🔥⚡',
                '💣🔥🎯🔥💣'
            ];

            const currentCounter = this.getEffectCounter();
            const selectedEffect = effects[currentCounter % effects.length];
            this.setEffectCounter(currentCounter + 1);

            const effect = document.createElement('div');
            effect.className = 'halloween-bounty-effect';
            effect.innerHTML = selectedEffect;
            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
                font-size: 56px;
                z-index: 9999;
                animation: spookyFloat 5s ease-in-out, spookyRotate 5s ease-in-out;
                pointer-events: none;
                text-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
            `;
            return effect;
        },

        createImageBountyEffect: function() {
            const effect = document.createElement('div');
            effect.className = 'halloween-image-bounty-effect';

            // Get custom image URL from Spectral Forge input
            const customImageInput = document.getElementById('bounty-custom-image-url');
            const imageUrl = customImageInput ? customImageInput.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png' : 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';

            // Get glow settings
            const glowEnabled = GM_getValue('halloween_bounty_glow_enabled', 'true') === 'true';
            const glowColor = GM_getValue('halloween_bounty_glow_color', '#ff6b35');
            const maxScale = GM_getValue('halloween_bounty_max_scale', '2.5');

            effect.innerHTML = `
                <div class="halloween-image-container">
                    <img src="${imageUrl}" alt="Bounty Effect" class="halloween-skull-image" onerror="this.src='https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';">
                </div>
            `;

            // Create custom animation with or without glow
            const animationName = glowEnabled ? `bountyImagePulseGlow_${glowColor.replace('#', '')}_${maxScale.replace('.', '_')}` : `bountyImagePulseNoGlow_${maxScale.replace('.', '_')}`;

            // Inject custom keyframes if glow is enabled with custom color
            if (glowEnabled) {
                const styleId = `bounty-glow-style-${glowColor.replace('#', '')}-${maxScale.replace('.', '_')}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        @keyframes ${animationName} {
                            0% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0.1);
                                filter: drop-shadow(0 0 5px ${glowColor}) brightness(1);
                            }
                            50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(${maxScale});
                                filter: drop-shadow(0 0 50px ${glowColor}) brightness(1.8);
                            }
                            100% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0);
                                filter: drop-shadow(0 0 0px ${glowColor}) brightness(1);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                // No glow animation
                const styleId = `bounty-noglow-style-${maxScale.replace('.', '_')}`;
                if (!document.getElementById(styleId)) {
                    const style = document.createElement('style');
                    style.id = styleId;
                    style.textContent = `
                        @keyframes ${animationName} {
                            0% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0.1);
                            }
                            50% {
                                opacity: 1;
                                transform: translate(-50%, -50%) scale(${maxScale});
                            }
                            100% {
                                opacity: 0;
                                transform: translate(-50%, -50%) scale(0);
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }

            effect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                pointer-events: none;
                animation: ${animationName} 4s ease-in-out;
            `;

            return effect;
        },

        applyHalloweenBackground: function() {
            const config = FactionConfig.getConfig();
            FactionConfig.applyCustomBackground(config.tileImage);
            HalloweenDebug.log(2, 'Applied Halloween target background tile');
        },

        applyGenericHalloweenBackground: function() {
            // Apply a generic Halloween background for all pages
            const existingGeneric = document.getElementById('halloween-generic-background');
            if (existingGeneric) existingGeneric.remove();

            const style = document.createElement('style');
            style.id = 'halloween-generic-background';
            style.textContent = `
                body.halloween-background-enabled {
                    background:
                        radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(247, 147, 30, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 60%, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
                        linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 20, 10, 0.95) 100%) !important;
                    background-attachment: fixed !important;
                }

                body.halloween-background-enabled .content-wrapper,
                body.halloween-background-enabled #mainContainer,
                body.halloween-background-enabled .main-container,
                body.halloween-background-enabled .container:not(:has(.header-bottom-text)) {
                    background: rgba(0, 0, 0, 0.5) !important;
                }

                /* Mobile-optimized: Simplified gradients for better performance */
                @media (max-width: 768px) {
                    body.halloween-background-enabled {
                        background:
                            radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 60%),
                            linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 20, 10, 0.95) 100%) !important;
                        background-attachment: fixed !important;
                    }
                }
            `;
            document.head.appendChild(style);
            HalloweenDebug.log(3, 'Applied generic Halloween background');
        },

        addStylesheet: function() {
            const style = document.createElement('style');
            style.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Fjalla+One:wght@400&family=Creepster&family=Metal+Mania&display=swap');

                :root {
                    /* Carved King Theme - Spectral Gothic */
                    --carved-midnight: #0a0b2e;            /* Deep midnight blue */
                    --carved-void: #1a1b4a;                /* Medium blue-purple */
                    --carved-purple: #2a0845;              /* Deep purple */
                    --carved-cyan: #00ffff;                /* Electric cyan */
                    --carved-magenta: #ff69b4;             /* Hot magenta */
                    --carved-orange: #ff4500;              /* Vibrant orange */
                    --carved-teal: #40e0d0;                /* Teal accent */
                    --carved-text: #ffffff;                /* Pure white */
                    --carved-text-dim: #cccccc;            /* Dimmed white */
                    --carved-panel: rgba(10, 11, 46, 0.8); /* Semi-transparent panel */
                    --carved-border: rgba(0, 255, 255, 0.3); /* Cyan border */
                    --carved-glow: rgba(0, 255, 255, 0.6); /* Cyan glow */

                    /* Legacy compatibility */
                    --halloween-primary: var(--carved-cyan);
                    --halloween-secondary: var(--carved-magenta);
                    --halloween-bg: var(--carved-midnight);
                    --halloween-accent: var(--carved-orange);
                    --halloween-text: var(--carved-text);
                    --halloween-border: var(--carved-teal);
                    --halloween-hover: var(--carved-magenta);
                    --halloween-glow: var(--carved-glow);
                    --halloween-font: 'Fjalla One', 'Orbitron', sans-serif;
                }

                /* V2 Pumpkin King Animations */
                @keyframes pumpkinPulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 20px var(--carved-cyan), 0 0 40px var(--pumpkin-shadow), inset 0 0 10px rgba(0,255,255,0.1);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 30px var(--carved-magenta), 0 0 60px var(--pumpkin-glow), inset 0 0 15px rgba(255,20,147,0.2);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px var(--carved-cyan), 0 0 40px var(--pumpkin-shadow), inset 0 0 10px rgba(0,255,255,0.1);
                    }
                }

                @keyframes cyberpunkGlow {
                    0% {
                        box-shadow:
                            0 0 20px var(--carved-cyan),
                            0 0 40px var(--pumpkin-shadow),
                            inset 0 0 10px rgba(0,255,255,0.1);
                        border-color: var(--carved-cyan);
                    }
                    33% {
                        box-shadow:
                            0 0 30px var(--carved-magenta),
                            0 0 60px var(--pumpkin-glow),
                            inset 0 0 15px rgba(255,20,147,0.2);
                        border-color: var(--carved-magenta);
                    }
                    66% {
                        box-shadow:
                            0 0 25px var(--carved-cyan),
                            0 0 50px rgba(64,224,208,0.3),
                            inset 0 0 12px rgba(64,224,208,0.15);
                        border-color: var(--carved-cyan);
                    }
                    100% {
                        box-shadow:
                            0 0 20px var(--carved-cyan),
                            0 0 40px var(--pumpkin-shadow),
                            inset 0 0 10px rgba(0,255,255,0.1);
                        border-color: var(--carved-cyan);
                    }
                }

                @keyframes neonFlicker {
                    0%, 100% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                    2% { opacity: 0.8; text-shadow: 0 0 5px var(--carved-cyan); }
                    4% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                    6% { opacity: 0.9; text-shadow: 0 0 8px var(--carved-cyan); }
                    8% { opacity: 1; text-shadow: 0 0 10px var(--carved-cyan), 0 0 20px var(--carved-cyan); }
                }

                @keyframes flickerText {
                    0%, 94%, 100% { opacity: 1; }
                    95% { opacity: 0.8; }
                    96% { opacity: 1; }
                    97% { opacity: 0.9; }
                    98% { opacity: 1; }
                    99% { opacity: 0.95; }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
                }

                @keyframes flutter {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }

                /* Legacy compatibility animations */
                @keyframes halloweenPulse {
                    0% { transform: scale(1); opacity: 1; }
                    25% { transform: scale(1.02); opacity: 0.95; }
                    50% { transform: scale(1.08); opacity: 0.85; }
                    75% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes halloweenGlow {
                    0% { box-shadow: 0 0 30px var(--halloween-primary), inset 0 0 10px rgba(0,0,0,0.3); }
                    50% { box-shadow: 0 0 50px var(--halloween-secondary), inset 0 0 15px rgba(0,0,0,0.5); }
                    100% { box-shadow: 0 0 30px var(--halloween-primary), inset 0 0 10px rgba(0,0,0,0.3); }
                }

                @keyframes spookyFloat {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
                }

                @keyframes spookyRotate {
                    0% { filter: hue-rotate(0deg) brightness(1); }
                    33% { filter: hue-rotate(120deg) brightness(1.2); }
                    66% { filter: hue-rotate(240deg) brightness(0.8); }
                    100% { filter: hue-rotate(360deg) brightness(1); }
                }

                @keyframes halloweenImagePulse {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.1);
                        filter: drop-shadow(0 0 5px #ff6b35) brightness(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(2.5);
                        filter: drop-shadow(0 0 50px #ff6b35) brightness(1.8);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                        filter: drop-shadow(0 0 0px #ff6b35) brightness(1);
                    }
                }

                .halloween-skull-image {
                    width: 120px;
                    height: 120px;
                    object-fit: contain;
                    image-rendering: -webkit-optimize-contrast;
                }


                @keyframes spookyThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .halloween-target-highlight {
                    background: linear-gradient(45deg, var(--halloween-primary), var(--halloween-secondary)) !important;
                    border: 3px solid var(--halloween-primary) !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 15px var(--halloween-primary), inset 0 0 10px var(--halloween-secondary) !important;
                    position: relative !important;
                }
                .halloween-target-highlight.throb {
                    animation: spookyThrob 1.5s ease-in-out infinite !important;
                }

                .halloween-target-highlight::before {
                    content: '🎯';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    z-index: 1000;
                    animation: halloweenPulse 2s infinite;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                }

                .halloween-bounty-highlight {
                    background: linear-gradient(45deg, rgba(255, 0, 0, 0.2), rgba(255, 69, 0, 0.2)) !important;
                    border: 3px solid #ff0000 !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 15px #ff0000, inset 0 0 10px rgba(255, 69, 0, 0.5) !important;
                    position: relative !important;
                }
                .halloween-bounty-highlight.throb {
                    animation: bountyThrob 1.5s ease-in-out infinite !important;
                }

                @keyframes bountyThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .halloween-bounty-highlight::before {
                    content: '⏱️';
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    z-index: 1000;
                    animation: bountyPulse 2s infinite;
                    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
                }

                @keyframes bountyPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }

                .halloween-screen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle, var(--halloween-primary) 0%, var(--halloween-secondary) 50%, rgba(0,0,0,0.1) 100%);
                    pointer-events: none;
                    z-index: 9996;
                    animation: halloweenAura 12s ease-in-out infinite;
                    opacity: 0.08;
                }

                @keyframes halloweenAura {
                    0% { opacity: 0; }
                    20% { opacity: 0.08; }
                    40% { opacity: 0.12; }
                    60% { opacity: 0.12; }
                    80% { opacity: 0.08; }
                    100% { opacity: 0; }
                }

                /* Hide Staff and Credits from header menu to make room for Halloween icon (only when menu is in top position) */
                body.halloween-menu-top .header-menu.left .menu-items .menu-item-link:nth-child(5),
                body.halloween-menu-top .header-menu.left .menu-items .menu-item-link:nth-child(6) {
                    display: none !important;
                }

                /* Halloween header icon styling to match profile avatar */
                .halloween-header-icon {
                    width: 26px !important;
                    height: 26px !important;
                    border-radius: 50% !important;
                    object-fit: cover !important;
                    border: 2px solid var(--default-bg-panel-border) !important;
                    transition: transform 0.2s ease !important;
                    margin-top: -2px !important;
                }

                .halloween-header-icon:hover {
                    transform: scale(1.1) !important;
                    border-color: var(--halloween-primary) !important;
                }

                /* Hide number input spinners */
                #ticker-duration::-webkit-outer-spin-button,
                #ticker-duration::-webkit-inner-spin-button,
                #ticker-frequency::-webkit-outer-spin-button,
                #ticker-frequency::-webkit-inner-spin-button {
                    -webkit-appearance: none !important;
                    margin: 0 !important;
                }

                /* Halloween Competition Pumpkin Animations */
                @keyframes pumpkinThrob {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                @keyframes pumpkinGoldGlow {
                    0% { filter: drop-shadow(0 0 8px #FFD700); }
                    50% { filter: drop-shadow(0 0 15px #FFD700) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #FFD700); }
                }

                @keyframes pumpkinCorruptGlow {
                    0% { filter: drop-shadow(0 0 8px #8B0000); }
                    50% { filter: drop-shadow(0 0 15px #8B0000) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #8B0000); }
                }

                @keyframes pumpkinCyberGlow {
                    0% { filter: drop-shadow(0 0 8px #00FFFF); }
                    50% { filter: drop-shadow(0 0 15px #00FFFF) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #00FFFF); }
                }

                @keyframes pumpkinPureGlow {
                    0% { filter: drop-shadow(0 0 8px #FFFFFF); }
                    50% { filter: drop-shadow(0 0 15px #FFFFFF) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #FFFFFF); }
                }

                @keyframes pumpkinCandyGlow {
                    0% { filter: drop-shadow(0 0 8px #FF6B35); }
                    50% { filter: drop-shadow(0 0 15px #FF6B35) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 8px #FF6B35); }
                }

                @keyframes pumpkinCollect {
                    0% { transform: scale(1) rotate(0deg); opacity: 1; }
                    25% { transform: scale(1.3) rotate(0deg); opacity: 1; }
                    100% { transform: scale(0) rotate(360deg); opacity: 0; }
                }

                /* Pumpkin competition element styling */
                .halloween-competition-pumpkin {
                    background-color: transparent !important;
                    border: none !important;
                    outline: none !important;
                }

                .halloween-competition-pumpkin:hover {
                    cursor: pointer !important;
                }

                @keyframes collectionNotificationShow {
                    0% {
                        transform: translate(-50%, -50%) scale(0.3);
                        opacity: 0;
                    }
                    20% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 1;
                    }
                    80% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                }

                /* Mobile responsive adjustments */
                @media (max-width: 768px) {
                    .halloween-spooky-effect {
                        font-size: 32px !important;
                        letter-spacing: 0.1em;
                    }

                    #halloween-competition-end-notification,
                    #spooky-targets-end-notification {
                        max-width: 90% !important;
                        padding: 20px 25px !important;
                        font-size: 14px !important;
                    }

                    #halloween-competition-end-notification > div:first-child,
                    #spooky-targets-end-notification > div:first-child {
                        font-size: 16px !important;
                    }

                    /* Menu height adjustments for mobile */
                    #halloween-dropdown-menu,
                    #halloween-sliding-menu {
                        max-height: 75vh !important;
                        z-index: 99999 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        },

        createScreenOverlay: function() {
            const overlay = document.createElement('div');
            overlay.className = 'halloween-screen-overlay';
            return overlay;
        }
    };

    // Debug and Development Tools
    const DebugTools = {
        enabled: GM_getValue('halloween_debug', false),

        log: function(...args) {
            if (this.enabled) {
                HalloweenDebug.log(3, '[HALLOWEEN DEBUG]', ...args);
            }
        },

        toggle: function() {
            this.enabled = !this.enabled;
            GM_setValue('halloween_debug', this.enabled);
            HalloweenDebug.log(3, 'Halloween Debug Mode:', this.enabled ? 'ENABLED' : 'DISABLED');
            return this.enabled;
        },

        testTargetGeneration: function(testSeed) {
            const seed = testSeed || SeedManager.getSeed('testTargetGeneration');
            HalloweenDebug.log(3, `Testing target generation for seed: ${seed}`);
            const start = performance.now();
            const targets = HalloweenMath.generateTargets(seed);
            const duration = performance.now() - start;

            HalloweenDebug.log(3, `Generated ${targets.length} target pairs (hidden for competitive gameplay)`);
            HalloweenDebug.log(3, `Generation took: ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(3, `Potential player targets: ~${(targets.length * 39420).toLocaleString()}`);

            return { duration, seed, targetCount: targets.length };
        },

        runPerformanceTest: function() {
            HalloweenDebug.log(3, '🎃 Running Halloween Targets Performance Test...');
            const testSeeds = ['TEST_SEED_1', 'TEST_SEED_2', 'PERFORMANCE_TEST', 'HALLOWEEN2024', 'FACTION_ALPHA'];
            const results = [];

            testSeeds.forEach(seed => {
                const iterations = 50;
                const start = performance.now();

                for (let i = 0; i < iterations; i++) {
                    HalloweenMath.generateTargets(seed);
                }

                const totalTime = performance.now() - start;
                const avgTime = totalTime / iterations;

                results.push({
                    seed,
                    avgTime: avgTime.toFixed(3),
                    totalTime: totalTime.toFixed(2)
                });

                HalloweenDebug.log(3, `Seed "${seed}": ${avgTime.toFixed(3)}ms avg (${iterations} iterations)`);
            });

            const overallAvg = results.reduce((sum, r) => sum + parseFloat(r.avgTime), 0) / results.length;
            HalloweenDebug.log(3, `Overall average: ${overallAvg.toFixed(3)}ms`);
            HalloweenDebug.log(3, `Performance target (<5ms): ${overallAvg < 5 ? '✅ PASS' : '❌ FAIL'}`);

            // Test caching performance
            HalloweenDebug.log(3, '\n🎃 Testing cache performance...');
            const currentSeed = SeedManager.getSeed('performanceTest');
            const cacheStart = performance.now();
            SeedManager.getTargets('performanceTest'); // Should use cache
            const cacheTime = performance.now() - cacheStart;
            HalloweenDebug.log(3, `Cache retrieval: ${cacheTime.toFixed(3)}ms`);

            return results;
        },

        validateMathematicalIntegrity: function() {
            HalloweenDebug.log(3, '🎃 Validating Mathematical Integrity...');

            // Test deterministic behavior with seeds
            const testSeed = 'VALIDATION_TEST_SEED';
            const result1 = HalloweenMath.generateTargets(testSeed);
            const result2 = HalloweenMath.generateTargets(testSeed);

            const isDeterministic = JSON.stringify(result1) === JSON.stringify(result2);
            HalloweenDebug.log(3, `Deterministic test: ${isDeterministic ? '✅ PASS' : '❌ FAIL'}`);

            // Test target count
            const hasCorrectCount = result1.length === 20;
            HalloweenDebug.log(3, `Target count test (20): ${hasCorrectCount ? '✅ PASS' : '❌ FAIL'}`);

            // Test format consistency
            const allValidFormat = result1.every(target => /^\d{2}$/.test(target));
            HalloweenDebug.log(3, `Format consistency test: ${allValidFormat ? '✅ PASS' : '❌ FAIL'}`);

            // Test range validity
            const allInRange = result1.every(target => {
                const num = parseInt(target);
                return num >= 0 && num <= 99;
            });
            HalloweenDebug.log(3, `Range validity test (00-99): ${allInRange ? '✅ PASS' : '❌ FAIL'}`);

            // Test seed uniqueness
            const differentSeed = 'DIFFERENT_SEED';
            const result3 = HalloweenMath.generateTargets(differentSeed);
            const isDifferent = JSON.stringify(result1) !== JSON.stringify(result3);
            HalloweenDebug.log(3, `Seed uniqueness test: ${isDifferent ? '✅ PASS' : '❌ FAIL'}`);

            // Test current seed system
            const currentTargets = SeedManager.getTargets('currentSeedTest');
            const currentSeed = SeedManager.getSeed('currentSeedTest');
            HalloweenDebug.log(3, `Current seed: ${currentSeed}`);
            HalloweenDebug.log(3, `Current target count: ${currentTargets.length} (pairs hidden for competitive gameplay)`);

            return {
                deterministic: isDeterministic,
                correctCount: hasCorrectCount,
                validFormat: allValidFormat,
                validRange: allInRange,
                seedUniqueness: isDifferent,
                currentSeed: currentSeed,
                targetCount: currentTargets.length
            };
        },

        simulateTargetDetection: function(playerID) {
            HalloweenDebug.log(3, `🎃 Simulating target detection for player ID: ${playerID}`);

            if (!playerID) {
                HalloweenDebug.log(3, '❌ No player ID provided');
                return false;
            }

            const lastTwoDigits = playerID.toString().slice(-2).padStart(2, '0');
            HalloweenDebug.log(3, `Extracted digits: ${lastTwoDigits}`);

            const start = performance.now();
            const isTarget = SeedManager.checkTarget(lastTwoDigits);
            const duration = performance.now() - start;

            HalloweenDebug.log(3, `Target check time: ${duration.toFixed(2)}ms`);
            HalloweenDebug.log(3, `Is target: ${isTarget ? '🎯 YES' : '❌ NO'}`);

            if (isTarget) {
                HalloweenDebug.log(3, '🎃 Would trigger Halloween effects!');
            }

            return {
                playerID,
                lastTwoDigits,
                isTarget,
                checkTime: duration
            };
        },

        getStoredTargets: function() {
            const stored = JSON.parse(GM_getValue('halloween_encounters', '{}'));
            HalloweenDebug.log(3, `Found ${Object.keys(stored).length} unique encounters:`, stored);
            return stored;
        },

        clearStoredTargets: function() {
            GM_setValue('halloween_encounters', '{}');
            HalloweenDebug.log(3, '🎃 Cleared all encounter data');
        },

        getSeedInfo: function() {
            const info = SeedManager.getSeedInfo();
            HalloweenDebug.log(3, '🎃 Current Seed Information:');
            HalloweenDebug.log(3, `Seed: ${info.currentSeed}`);
            HalloweenDebug.log(3, `Target Count: ${info.targetCount} pairs (hidden for competitive gameplay)`);
            HalloweenDebug.log(3, `Cached: ${info.isCached ? 'Yes' : 'No'}`);
            HalloweenDebug.log(3, `Total Potential Targets: ~${info.totalPotentialTargets.toLocaleString()}`);
            return info;
        },

        setSeed: function(newSeed) {
            const result = SeedManager.setSeed(newSeed);
            if (result) {
                HalloweenDebug.log(1, `🎃 Seed updated successfully to: ${newSeed}`);
                HalloweenDebug.log(1, 'New targets generated. Use halloweenSeedInfo() to view.');
            } else {
                console.error('🎃 Failed to set seed. Check format and try again.');
            }
            return result;
        },

        clearCache: function() {
            SeedManager.clearCache();
            HalloweenDebug.log(1, '🎃 Target cache cleared');
        },

        showDebugPanel: function() {
            // Legacy debug panel - use HalloweenUI.toggleMenu() instead
            HalloweenDebug.log(3, '🎃 Use window.halloweenMenu() or click the pumpkin icon for the new interface');
            HalloweenUI.toggleMenu();
        }
    };

    // Tiered Debug System with HAL: prefix for console filtering
    const HalloweenDebug = {
        level: GM_getValue('hallo_debug_level', 0),

        log: function(level, ...args) {
            if (level <= this.level) {
                console.log('HAL:', ...args);
            }
        },

        trace: function(level, ...args) {
            if (level <= this.level) {
                console.trace();
            }
        },

        setLevel: function(newLevel) {
            this.level = newLevel;
            GM_setValue('hallo_debug_level', newLevel);
            console.log('HAL: 🎃 Debug level set to', newLevel);
            console.log('HAL: 🎃 Debug levels: 0=none, 1=basic, 2=detailed, 3=full');
            return this.level;
        },

        getLevel: function() {
            return this.level;
        },

        info: function() {
            console.log('HAL: 🎃 Current debug level:', this.level);
            console.log('HAL: 🎃 Available levels:');
            console.log('HAL:   0 = No debug output (production)');
            console.log('HAL:   1 = Basic flow (getSeed, getTargets, cache)');
            console.log('HAL:   2 = Detailed (anti-tampering, validation, menu)');
            console.log('HAL:   3 = Full (stack traces, raw data, all operations)');
            console.log('HAL: 🎃 Use HalloweenDebug.setLevel(X) to change level');
        },

        showHelp: function() {
            this.info(); // Alias for info()
        },

        // ===================================
        // API MODE DEBUG COMMANDS
        // ===================================

        apiStatus: function() {
            console.log('HAL: === API MODE STATUS ===');
            console.log('HAL: Enabled:', APIDefeatVerification.isAPIMode());
            if (APIDefeatVerification.isAPIMode()) {
                console.log('HAL: Player ID:', APIDefeatVerification.getMemberID());
                console.log('HAL: Player Name:', APIDefeatVerification.getMemberName());
                console.log('HAL: Start Timestamp:', new Date(GM_getValue('halloween_api_start_timestamp', 0) * 1000));
                console.log('HAL: Last Refresh:', new Date(GM_getValue('halloween_api_last_refresh', 0) * 1000));

                const bonusStats = APIDefeatVerification.getBonusStats();
                console.log('HAL: --- Bonus Stats ---');
                console.log('HAL: Total Attacks:', bonusStats.totalAttacks);
                console.log('HAL: Unique Opponents:', bonusStats.uniqueOpponents);
                console.log('HAL: Total Defeated:', bonusStats.totalDefeats);

                const queue = APIDefeatVerification.getPendingVerifications();
                console.log('HAL: --- Verification Queue ---');
                console.log('HAL: Pending:', queue.length);
                if (queue.length > 0) {
                    console.table(queue);
                }
            } else {
                console.log('HAL: API Mode is not enabled');
            }
        },

        showAttackLogs: function(limit = 10) {
            if (!APIDefeatVerification.isAPIMode()) {
                console.log('HAL: API Mode is not enabled');
                return;
            }

            const attacks = APIDefeatVerification.getAllAttacks();
            const attacksArray = Object.entries(attacks).slice(0, limit).map(([id, data]) => ({
                id,
                code: data.code,
                timestamp: new Date(data.timestamp_started * 1000).toLocaleString(),
                defender: data.defender_id,
                result: data.result
            }));

            console.log('HAL: === ATTACK LOGS (showing', attacksArray.length, 'of', Object.keys(attacks).length, ') ===');
            console.table(attacksArray);
        },

        forceRefresh: function() {
            if (!APIDefeatVerification.isAPIMode()) {
                console.log('HAL: ❌ API Mode is not enabled');
                return;
            }

            console.log('HAL: 🔄 Forcing attack log refresh...');
            APIDefeatVerification.refreshAttackLog();
            console.log('HAL: ✅ Refresh initiated (check logs in a moment)');
        },

        simulateSpookyDefeat: function(defenderId) {
            if (!defenderId) {
                console.log('HAL: Usage: HalloweenDebug.simulateSpookyDefeat(defenderId)');
                console.log('HAL: Example: HalloweenDebug.simulateSpookyDefeat(2893574)');
                return;
            }

            console.log('HAL: 🎃 Simulating spooky defeat for defender', defenderId);

            // Check if it's a spooky target
            if (!AttackPageDetection.isSpookyTarget(defenderId)) {
                console.warn(`⚠️ Warning: ${defenderId} is not a spooky target (last 2 digits don't match seed)`);
                console.log('HAL: Proceeding anyway for testing...');
            }

            // Queue for verification
            const timestamp = Math.floor(Date.now() / 1000);
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(2, '📡 Using API mode verification');
                APIDefeatVerification.queueVerification(defenderId, timestamp);
            } else {
                HalloweenDebug.log(2, '🔥 Using Firebase mode verification');
                FirebaseDefeatVerification.addToQueue(defenderId, timestamp);
            }

            HalloweenDebug.log(2, '✅ Defeat queued for verification');
        },

        checkVerificationStatus: function(defenderId) {
            if (!defenderId) {
                console.log('HAL: Usage: HalloweenDebug.checkVerificationStatus(defenderId)');
                console.log('HAL: Example: HalloweenDebug.checkVerificationStatus(2893574)');
                return;
            }

            console.log('HAL: === VERIFICATION STATUS:', defenderId, '===');

            // Check if already counted
            const counted = GM_getValue('halloween_defeats_counted', '[]');
            const countedArray = JSON.parse(counted);
            const alreadyCounted = countedArray.includes(defenderId.toString());

            console.log('HAL: Already Counted:', alreadyCounted);

            if (APIDefeatVerification.isAPIMode()) {
                // Check pending queue
                const queue = APIDefeatVerification.getPendingVerifications();
                const inQueue = queue.find(q => q.defenderId == defenderId);
                console.log('HAL: In Verification Queue:', !!inQueue);
                if (inQueue) {
                    console.log('HAL: Queue Details:', inQueue);
                }

                // Try verification
                const result = APIDefeatVerification.verifyDefeat(defenderId);
                console.log('HAL: Verification Result:', result);
            } else {
                // Firebase mode
                const queue = GM_getValue('halloween_verify_queue', '[]');
                const queueArray = JSON.parse(queue);
                const inQueue = queueArray.find(q => q.defenderId == defenderId);
                HalloweenDebug.log(2, 'In Verification Queue:', !!inQueue);
                if (inQueue) {
                    HalloweenDebug.log(3, 'Queue Details:', inQueue);
                }
            }
        },

        showAllDebugCommands: function() {
            console.log('HAL: === HALLOWEEN DEBUG COMMANDS ===');
            console.log('HAL: ');
            console.log('HAL: General:');
            console.log('HAL:   HalloweenDebug.setLevel(0-3) - Set debug verbosity');
            console.log('HAL:   HalloweenDebug.info() - Show debug level info');
            console.log('HAL: ');
            console.log('HAL: API Mode:');
            console.log('HAL:   HalloweenDebug.apiStatus() - Show API mode status & stats');
            console.log('HAL:   HalloweenDebug.showAttackLogs(10) - Show recent attack logs');
            console.log('HAL:   HalloweenDebug.forceRefresh() - Force attack log refresh');
            console.log('HAL: ');
            console.log('HAL: Testing:');
            console.log('HAL:   HalloweenDebug.simulateSpookyDefeat(defenderId) - Test defeat verification');
            console.log('HAL:   HalloweenDebug.checkVerificationStatus(defenderId) - Check defeat status');
            console.log('HAL: ');
            console.log('HAL: Example workflow:');
            console.log('HAL:   1. HalloweenDebug.apiStatus() - Check current status');
            console.log('HAL:   2. HalloweenDebug.simulateSpookyDefeat(2893574) - Queue a test defeat');
            console.log('HAL:   3. HalloweenDebug.checkVerificationStatus(2893574) - Verify it worked');
        }
    };

    // Halloween UI System - Sliding Pumpkin Menu
    const HalloweenUI = {
        menuOpen: false,
        soundEnabled: GM_getValue('halloween_sound_enabled', false),
        backgroundEnabled: GM_getValue('halloween_background', true),
        menuPosition: GM_getValue('halloween_menu_position', 'side'), // 'side' or 'top'
        statsUpdateInterval: null, // Menu-only stats update interval

        init: function() {
            if (this.menuPosition === 'top') {
                document.body.classList.add('halloween-menu-top');
                this.createTopPumpkinTrigger();
                this.createDropdownMenu();
            } else {
                document.body.classList.remove('halloween-menu-top');
                this.createPumpkinTrigger();
                this.createSlidingMenu();
            }
            this.updateMenuContent();

            // Restore saved tile image
            const savedTile = GM_getValue('halloween_tile_image', '');
            if (savedTile) {
                this.applyTileImage(savedTile);
            }

            // Ensure carved king icon is applied (fixes faction config override)
            const config = FactionConfig.getConfig();
            FactionConfig.updateTriggerIcon(config.factionIcon);

            // Initialize ticker hijacking with delay to ensure page is loaded
            setTimeout(() => {
                this.initTickerHijacking();
            }, 3000);
        },

        createPumpkinTrigger: function() {
            const trigger = document.createElement('div');
            trigger.id = 'halloween-pumpkin-trigger';
            trigger.innerHTML = '<img src="https://i.ibb.co/fYD8KsYX/carved-king-250.png" style="width: 32px; height: 32px; border-radius: 50%;">';
            trigger.title = 'Spectral Command Center';
            trigger.style.cssText = `
                position: fixed;
                top: 50%;
                right: -25px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, var(--halloween-primary), var(--halloween-secondary));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-family: var(--halloween-font);
                cursor: pointer;
                z-index: 19999;
                transition: all 0.3s ease;
                box-shadow: -3px 0 15px rgba(255, 107, 53, 0.6);
                border: 2px solid #ff4500;
                user-select: none;
                transform: translateY(-50%);
            `;

            trigger.addEventListener('mouseenter', () => {
                trigger.style.right = '-15px';
                trigger.style.transform = 'translateY(-50%) scale(1.1)';
                trigger.style.boxShadow = '-5px 0 20px rgba(255, 107, 53, 0.8)';
            });

            trigger.addEventListener('mouseleave', () => {
                if (!this.menuOpen) {
                    trigger.style.right = '-25px';
                    trigger.style.transform = 'translateY(-50%) scale(1)';
                    trigger.style.boxShadow = '-3px 0 15px rgba(255, 107, 53, 0.6)';
                }
            });

            trigger.addEventListener('click', () => {
                // Play very quiet audio to grant browser permission
                const permissionAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');
                permissionAudio.volume = 0.001; // Nearly silent
                permissionAudio.play().catch(() => {}); // Ignore errors
                HalloweenUI.toggleMenu();
            });

            // Debug: Test if the handler was attached
            console.log('HAL: 🎃 HANDLER DEBUG: Trigger click handler attached to element:', trigger);

            document.body.appendChild(trigger);
        },

        createTopPumpkinTrigger: function() {
            // Find the header navigation right section
            const headerRight = document.querySelector('.header-navigation.right .toolbar');
            if (!headerRight) return;

            // Find the find-extend li element to insert before
            const findExtend = headerRight.querySelector('.find-extend');
            if (!findExtend) return;

            // Create the pumpkin li element with simple image
            const pumpkinLi = document.createElement('li');
            pumpkinLi.className = 'halloween-menu-trigger';
            pumpkinLi.innerHTML = `
                <button type="button" class="top_header_button button" aria-label="Open Spectral Command Center">
                    <img src="https://i.ibb.co/fYD8KsYX/carved-king-250.png" alt="Halloween Menu" class="halloween-header-icon">
                </button>
            `;

            // Add click handler
            const button = pumpkinLi.querySelector('button');
            button.addEventListener('click', () => {
                // Play very quiet audio to grant browser permission
                const permissionAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');
                permissionAudio.volume = 0.001; // Nearly silent
                permissionAudio.play().catch(() => {}); // Ignore errors
                HalloweenUI.toggleMenu();
            });

            // Insert before find-extend
            headerRight.insertBefore(pumpkinLi, findExtend);
        },

        createDropdownMenu: function() {
            const menu = document.createElement('div');
            menu.id = 'halloween-dropdown-menu';
            menu.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                width: 320px;
                height: auto;
                max-height: 80vh;
                background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(139,0,0,0.9));
                border: 2px solid #ff6b35;
                border-radius: 15px;
                z-index: 20000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            `;

            document.body.appendChild(menu);

            // Add click outside to close for dropdown menu
            document.addEventListener('click', (e) => {
                if (this.menuPosition === 'top' && this.menuOpen) {
                    const menu = document.getElementById('halloween-dropdown-menu');
                    const trigger = document.querySelector('.halloween-menu-trigger');

                    if (menu && trigger && !menu.contains(e.target) && !trigger.contains(e.target)) {
                        this.toggleMenu();
                    }
                }
            });
        },

        createSlidingMenu: function() {
            const menu = document.createElement('div');
            menu.id = 'halloween-sliding-menu';
            menu.style.cssText = `
                position: fixed;
                top: 50%;
                right: -340px;
                width: 320px;
                height: auto;
                max-height: 80vh;
                background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(139,0,0,0.9));
                border: 2px solid #ff6b35;
                border-radius: 15px 0 0 15px;
                z-index: 20000;
                transition: right 0.4s ease;
                transform: translateY(-50%);
                overflow-y: auto;
                box-shadow: -5px 0 25px rgba(0,0,0,0.7);
            `;

            document.body.appendChild(menu);
        },

        toggleMenu: function() {
            if (this.menuPosition === 'top') {
                this.toggleDropdownMenu();
            } else {
                this.toggleSideMenu();
            }
        },

        toggleSideMenu: function() {
            const trigger = document.getElementById('halloween-pumpkin-trigger');
            const menu = document.getElementById('halloween-sliding-menu');

            if (!this.menuOpen) {
                // Open menu
                menu.style.right = '0px';
                trigger.style.right = '15px';
                trigger.style.transform = 'translateY(-50%) scale(1.1) rotate(180deg)';
                this.menuOpen = true;
                this.updateMenuContent();

                // Check for API refresh on menu open (event-driven optimization)
                if (APIDefeatVerification.isAPIMode()) {
                    APIDefeatVerification.checkAttackLogRefresh();
                    BountyManager.processBountyVerifications();
                }

                // Start menu-only stats update interval
                this.startStatsUpdateInterval();
            } else {
                // Close menu
                menu.style.right = '-330px';
                trigger.style.right = '-25px';
                trigger.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                this.menuOpen = false;
                // Cleanup empty announcements on menu close
                this.cleanupEmptyAnnouncements();
                // Suspend audio context to save resources
                HalloweenTargets.suspendAudioContext();

                // Stop menu-only stats update interval
                this.stopStatsUpdateInterval();
            }
        },

        toggleDropdownMenu: function() {
            const menu = document.getElementById('halloween-dropdown-menu');

            if (!this.menuOpen) {
                // Open menu
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0px)';
                this.menuOpen = true;
                this.updateMenuContent();

                // Check for API refresh on menu open (event-driven optimization)
                if (APIDefeatVerification.isAPIMode()) {
                    APIDefeatVerification.checkAttackLogRefresh();
                    BountyManager.processBountyVerifications();
                }

                // Start menu-only stats update interval
                this.startStatsUpdateInterval();
            } else {
                // Close menu
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                this.menuOpen = false;
                // Cleanup empty announcements on menu close
                this.cleanupEmptyAnnouncements();
                // Suspend audio context to save resources
                HalloweenTargets.suspendAudioContext();

                // Stop menu-only stats update interval
                this.stopStatsUpdateInterval();
            }
        },

        updateMenuContent: function() {
            const menuId = this.menuPosition === 'top' ? 'halloween-dropdown-menu' : 'halloween-sliding-menu';
            const menu = document.getElementById(menuId);
            const seedInfo = SeedManager.getSeedInfo();
            const stats = this.getPersonalStats();
            const config = FactionConfig.getConfig();

            HalloweenDebug.log(2, '🎃 Updating menu content, leader mode:', seedInfo.isLeaderMode);
            HalloweenDebug.log(2, '🎃 Menu element found:', !!menu);
            HalloweenDebug.log(2, '🎃 SeedInfo:', seedInfo);
            HalloweenDebug.log(2, '🎃 Stats:', stats);
            HalloweenDebug.log(2, '🎃 Config:', config);

            let bannerHtml = '';
            if (config.factionBanner) {
                bannerHtml = `
                    <div style="margin-bottom: 15px; text-align: center;">
                        <img src="${config.factionBanner}" style="max-width: 100%; max-height: 60px; object-fit: contain;">
                    </div>
                `;
            }

            // Use clean menu rebuild
            menu.innerHTML = this.buildCleanMenu(seedInfo, stats, config);

            // Add event listeners for toggles after DOM is updated
            this.attachToggleListeners();

            // Reattach manifestations panel listeners (enchanted pages, etc.)
            this.reattachManifestationsListeners();

            // Restore manifestations checkbox states from GM storage
            this.updateManifestationsUI();

            // Setup member countdown handlers and update displays
            this.setupMemberStatusHandlers();
            this.updateMemberCountdowns();

            // Update defeat verification stats (if FirebaseDefeatVerification exists)
            if (typeof FirebaseDefeatVerification !== 'undefined') {
                this.updateDefeatVerificationStats();
            }

            // Update bounties claimed display
            this.updateBountiesClaimed();

            // Update debug level displays and button states
            const currentLevel = HalloweenDebug.getLevel();

            // Update footer debug level display (leader only)
            const footerLevelDisplay = document.getElementById('debug-level-footer');
            const levelNameDisplay = document.getElementById('debug-level-name');
            if (footerLevelDisplay) {
                footerLevelDisplay.textContent = currentLevel;
            }
            if (levelNameDisplay) {
                levelNameDisplay.textContent = this.getDebugLevelName(currentLevel);
            }

            this.updateDebugButtonStates(currentLevel);
        },

        updateDefeatVerificationStats: function() {
            // Check if API mode is enabled
            const isAPIMode = GM_getValue('halloween_api_mode', false);

            // Get stats from appropriate system
            const stats = isAPIMode
                ? APIDefeatVerification.getStats()
                : FirebaseDefeatVerification.getStats();

            // Find the boxes container
            const boxesContainer = document.getElementById('defeat-verification-boxes');
            if (!boxesContainer) return;

            // Build boxes HTML based on mode
            let boxesHTML = '';

            if (isAPIMode) {
                // API Mode: 3 boxes in one row
                boxesHTML = `
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        <div style="text-align: center; padding: 6px; background: rgba(0, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(0, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #00ff00;">${stats.verifiedDefeats}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Verified</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 165, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffa500;">${stats.pendingVerification}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Pending</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ff6666;">${stats.unverified}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Unverified</div>
                        </div>
                    </div>
                `;
            } else {
                // Firebase Mode: 4 boxes in one row
                boxesHTML = `
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                        <div style="text-align: center; padding: 6px; background: rgba(0, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(0, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #00ff00;">${stats.verifiedDefeats}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Verified</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 165, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffa500;">${stats.pendingVerification}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Pending</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 255, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 255, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ffff00;">${stats.hourlyRetry}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Hourly Retry</div>
                        </div>
                        <div style="text-align: center; padding: 6px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.3);">
                            <div style="font-size: 14px; font-weight: bold; color: #ff6666;">${stats.unverified}</div>
                            <div style="font-size: 9px; opacity: 0.8;">Unverified</div>
                        </div>
                    </div>
                `;
            }

            // Update the DOM
            boxesContainer.innerHTML = boxesHTML;

            // Show/hide API elements based on mode
            const refreshInfoSection = document.getElementById('api-refresh-info-section');
            const refreshLink = document.getElementById('api-refresh-link');
            const refreshSeparator = document.getElementById('api-refresh-link-separator');

            if (refreshInfoSection) {
                refreshInfoSection.style.display = isAPIMode ? 'block' : 'none';
            }
            if (refreshLink) {
                refreshLink.style.display = isAPIMode ? 'inline' : 'none';
            }
            if (refreshSeparator) {
                refreshSeparator.style.display = isAPIMode ? 'inline' : 'none';
            }

            // Update last refresh time if in API mode
            if (isAPIMode) {
                const lastRefresh = GM_getValue('halloween_api_last_refresh', 0);
                const lastRefreshTime = document.getElementById('api-last-refresh-time');
                if (lastRefreshTime && lastRefresh > 0) {
                    const now = Date.now() / 1000;
                    const minutesAgo = Math.floor((now - lastRefresh) / 60);
                    if (minutesAgo < 1) {
                        lastRefreshTime.textContent = 'Just now';
                    } else if (minutesAgo === 1) {
                        lastRefreshTime.textContent = '1 minute ago';
                    } else {
                        lastRefreshTime.textContent = `${minutesAgo} minutes ago`;
                    }
                }
            }

            HalloweenDebug.log(2, `🎃 Updated defeat verification stats (${isAPIMode ? 'API' : 'Firebase'} mode):`, stats);
        },

        // Start menu-only stats update interval (60 seconds)
        startStatsUpdateInterval: function() {
            // Clear any existing interval first
            this.stopStatsUpdateInterval();

            // Start new 60-second interval for stats updates
            this.statsUpdateInterval = setInterval(() => {
                if (this.menuOpen) {
                    this.updateDefeatVerificationStats();
                    HalloweenDebug.log(3, '🔄 Menu stats updated (60s interval)');
                } else {
                    // Safety: stop interval if menu somehow closed
                    this.stopStatsUpdateInterval();
                }
            }, 60 * 1000);

            HalloweenDebug.log(2, '⏱️ Started menu-only stats update interval (60s)');
        },

        // Stop menu-only stats update interval
        stopStatsUpdateInterval: function() {
            if (this.statsUpdateInterval) {
                clearInterval(this.statsUpdateInterval);
                this.statsUpdateInterval = null;
                HalloweenDebug.log(2, '⏹️ Stopped menu-only stats update interval');
            }
        },

        // Event-driven element updates (no full menu rebuild)
        updateSoulsBanished: function() {
            // Update just the Souls Banished number
            const stats = APIDefeatVerification.isAPIMode()
                ? APIDefeatVerification.getStats()
                : FirebaseDefeatVerification.getStats();

            // Find the element (different IDs for member vs leader)
            const soulsBanishedElements = document.querySelectorAll('[id*="souls-banished"]');
            soulsBanishedElements.forEach(el => {
                const numElement = el.querySelector('div:first-child');
                if (numElement) {
                    numElement.textContent = stats.uniqueDefeats;
                }
            });

            HalloweenDebug.log(2, `🎃 Updated Souls Banished: ${stats.uniqueDefeats}`);
        },

        updateHalloweekStats: function() {
            // Update Halloweek Stats (API mode only)
            if (!GM_getValue('halloween_api_mode', false)) return;

            const bonusStats = APIDefeatVerification.getBonusStats();

            // Update each stat element by ID
            const totalAttacksEl = document.getElementById('stat-competition-attacks');
            if (totalAttacksEl) totalAttacksEl.textContent = bonusStats.totalAttacks;

            const uniqueOpponentsEl = document.getElementById('stat-unique-opponents');
            if (uniqueOpponentsEl) uniqueOpponentsEl.textContent = bonusStats.uniqueOpponents;

            const totalDefeatsEl = document.getElementById('stat-total-defeats');
            if (totalDefeatsEl) totalDefeatsEl.textContent = bonusStats.totalDefeats;

            HalloweenDebug.log(2, `HAL: 🎃 Updated Halloweek Stats: ${bonusStats.totalAttacks} attacks, ${bonusStats.uniqueOpponents} opponents, ${bonusStats.totalDefeats} defeated`);
        },

        updateBountiesClaimed: function() {
            HalloweenDebug.log(2, '🔥 updateBountiesClaimed called');

            // Get bounty config
            const config = BountyManager.getConfig();
            const section = document.getElementById('bounties-claimed-section');
            const grid = document.getElementById('bounties-claimed-grid');

            if (!section || !grid) {
                HalloweenDebug.log(2, '🔥 Bounties section/grid not found in DOM - menu likely closed');
                return;
            }

            // Show/hide section based on bounties active
            if (!config.active || config.bounties.length === 0) {
                section.style.display = 'none';
                HalloweenDebug.log(2, '🔥 Bounties inactive or no bounties configured');
                return;
            }

            section.style.display = 'block';

            // Get today's date for highlighting active day
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            // Get all claims
            const claims = BountyManager.getClaims();
            HalloweenDebug.log(2, '🔥 Current bounty claims:', claims);

            // Sort bounties by date
            const sortedBounties = [...config.bounties].sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            // Calculate square size based on number of bounties (1-7)
            const numBounties = sortedBounties.length;
            const squareSize = numBounties <= 3 ? '65px' :
                              numBounties <= 5 ? '48px' : '40px';
            const fontSize = numBounties <= 5 ? '22px' : '20px';
            const padding = numBounties <= 5 ? '5px' : '4px';

            // Generate HTML for each bounty square
            const squaresHTML = sortedBounties.map((bounty, index) => {
                const playerID = BountyManager.extractPlayerID(bounty.url);
                const claim = claims[playerID];

                // Determine status and emoji
                let emoji, emojiColor;

                if (claim && claim.verified) {
                    // Verified - Cyan checkmark
                    emoji = '✓';
                    emojiColor = 'var(--carved-cyan)';
                } else if (claim && claim.missed) {
                    // Missed - Grey X
                    emoji = '✗';
                    emojiColor = '#666666';
                } else {
                    // Unclaimed - Grey circle outline
                    emoji = '○';
                    emojiColor = '#666666';
                }

                // Highlight active day (today) in cyan, dim inactive days
                const dayLabelColor = bounty.date === today ? 'var(--carved-cyan)' : 'rgba(255, 255, 255, 0.6)';

                return `
                    <div style="flex: 1 1 auto; text-align: center; padding: ${padding}; background: rgba(0, 0, 0, 0.3); border-radius: 4px; box-sizing: border-box;">
                        <div style="font-size: ${fontSize}; color: ${emojiColor}; margin-top: 2px; margin-bottom: 6px; font-weight: bold;">${emoji}</div>
                        <div style="font-size: 9px; font-weight: bold; color: ${dayLabelColor};">Day ${index + 1}</div>
                    </div>
                `;
            }).join('');

            // Update grid HTML with forced repaint
            const oldHTML = grid.innerHTML;

            // Clear first, then update (forces browser to repaint)
            grid.innerHTML = '';
            void grid.offsetHeight; // Force reflow
            grid.innerHTML = squaresHTML;
            void grid.offsetHeight; // Force another reflow

            if (oldHTML !== squaresHTML) {
                HalloweenDebug.log(2, `🔥 Bounty display updated (HTML changed) - forced repaint`);
            } else {
                HalloweenDebug.log(2, `🔥 Bounty display unchanged (same HTML)`);
            }

            HalloweenDebug.log(2, `🔥 Updated Bounties Claimed display: ${numBounties} bounties`);
            HalloweenDebug.log(3, `🔥 Generated HTML:`, squaresHTML);
            HalloweenDebug.log(3, `🔥 Grid element:`, grid);
        },

        buildCleanMenu: function(seedInfo, stats, config) {
            HalloweenDebug.log(3, '🎃 buildCleanMenu called - toggle should be 25px, image should be centered');
            HalloweenDebug.log(3, '🎃 seedInfo.isLeaderMode:', seedInfo.isLeaderMode);
            HalloweenDebug.log(3, '🎃 seedInfo.menuPanelView:', seedInfo.menuPanelView);

            // Pre-calculate toggle values based on menu panel view preference
            const menuPanelView = seedInfo.menuPanelView;
            const showLeaderPanel = menuPanelView === 'leader';
            const leaderToggleClass = showLeaderPanel ? 'active' : '';
            const leaderToggleBg = showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)';
            const leaderToggleLeft = showLeaderPanel ? '25px' : '2px';

            // Build different menu content based on leader mode
            const memberContent = `
                <!-- PLAYER IDENTITY Section (Member Only) -->
                ${this.generatePlayerIdentitySection()}

                <!-- Combined Competition Countdown (shown when both competitions active and ends match) -->
                <div style="margin-bottom: 15px;">
                    <div style="text-align: center; margin-bottom: 5px;">
                        <span id="member-combined-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Competition Status</span>
                    </div>
                    <div id="member-combined-countdown-container" style="display: none; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-combined-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Competitions end in...</span>
                    </div>
                </div>

                <!-- SPOOKY TARGETS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 14px; font-weight: bold; color: var(--carved-cyan);">SPOOKY TARGETS</span>
                        <span id="member-spooky-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Status</span>
                    </div>

                    <!-- Spooky Countdown (hidden by default, shown in individual mode) -->
                    <div id="member-spooky-countdown" style="display: none; margin-bottom: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-spooky-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Ends in...</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; margin: 6px 0;">${stats.uniqueDefeats}</div>
                            <div style="font-size: 11px; opacity: 0.8;">Souls Banished</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; margin: 6px 0;">${stats.uniqueEncounters}</div>
                            <div style="font-size: 11px; opacity: 0.8;">Targets Found</div>
                        </div>
                    </div>

                    <!-- Defeat Verification Stats -->
                    <div id="defeat-verification-stats" style="padding-top: 12px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                        <div id="defeat-verification-header" style="font-size: 11px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 8px; text-align: center; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <span>Defeat Verification Status</span>
                            <span id="defeat-verification-toggle" style="font-size: 10px; transition: transform 0.3s ease;">&#9660;</span>
                        </div>
                        <div id="defeat-verification-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <div id="defeat-verification-boxes" style="margin-top: 8px;">
                                <!-- Boxes will be dynamically inserted here -->
                            </div>

                            <!-- API Last Refresh Info (only shown in API mode) -->
                            <div id="api-refresh-info-section" style="display: none; margin-top: 8px; text-align: center; font-size: 9px; color: rgba(0, 255, 255, 0.6);">
                                Last refresh: <span id="api-last-refresh-time">Never</span>
                            </div>
                        </div>
                    </div>

                    <!-- Switch to API Mode Link (Member ID users only) -->
                    ${this.generateSwitchToAPILink()}
                </div>

                ${this.generateCollectiblesSection()}

                ${this.generateBonusStatsSection()}

                <!-- PHANTOM SETTINGS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div id="phantom-settings-header" style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>PHANTOM SETTINGS</span>
                        <span id="phantom-settings-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <div id="phantom-settings-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Ethereal Manifestations</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Toggle background visual effects</div>
                        </div>
                        <div class="toggle ${HalloweenUI.backgroundEnabled ? 'active' : ''}" id="bg-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.backgroundEnabled ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.backgroundEnabled ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Spectral Echoes</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Enable audio feedback sounds</div>
                        </div>
                        <div class="toggle ${HalloweenUI.soundEnabled ? 'active' : ''}" id="sound-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.soundEnabled ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.soundEnabled ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Phantom Positioning</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Menu placement preference</div>
                        </div>
                        <div class="toggle ${HalloweenUI.menuPosition === 'top' ? 'active' : ''}" id="position-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${HalloweenUI.menuPosition === 'top' ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${HalloweenUI.menuPosition === 'top' ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>

                    </div>
                </div>

                <!-- ARCANE RITUALS Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div id="arcane-rituals-header" style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>ARCANE RITUALS</span>
                        <span id="arcane-rituals-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <div id="arcane-rituals-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <textarea id="halloween-import-json" placeholder="Inscribe spirit configuration runes..." style="
                        width: 100%; height: 80px; background: rgba(0, 0, 0, 0.7);
                        border: 1px solid var(--carved-cyan); border-radius: 6px;
                        color: white; padding: 12px; font-family: 'Fjalla One', 'Orbitron', sans-serif;
                        font-size: 12px; resize: vertical; margin-bottom: 12px; box-sizing: border-box;
                    "></textarea>

                    <button id="import-config" style="width: 100%; padding: 12px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 15px; cursor: pointer;">INVOKE RITUAL</button>

                    </div>
                </div>

                ${typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY ? `
                <!-- DOMINION MODE Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 15px;">DOMINION MODE</div>
                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(0, 255, 255, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-cyan);">Spectral Authority</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Command ethereal forces</div>
                        </div>
                        <div class="toggle ${showLeaderPanel ? 'active' : ''}" id="leader-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${showLeaderPanel ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Ethereal Seed Display -->
                <div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                    <div style="font-size: 10px; opacity: 0.6; color: var(--carved-cyan);">
                        Ethereal seed: ${seedInfo.currentSeed || 'None'}
                    </div>
                    <div style="font-size: 10px; opacity: 0.6; color: var(--carved-cyan); margin-top: 4px;">
                        ${(() => {
                            const isAPIMode = GM_getValue('halloween_api_mode', false);
                            if (isAPIMode) {
                                const memberName = GM_getValue('halloween_api_member_name', '');
                                const memberID = GM_getValue('halloween_api_member_id', 0);
                                return `Member: ${memberName || 'Unknown'} ${memberID ? `(${memberID})` : ''}`.trim();
                            } else {
                                const memberID = GM_getValue('halloween_player_id', '');
                                return memberID ? `Member: ${memberID}` : 'Member: Not enrolled';
                            }
                        })()}
                    </div>
                </div>

                <!-- Reset Script and Refresh API Link -->
                <div style="text-align: center; margin-top: 10px;">
                    <span id="reset-script-trigger" style="font-size: 10px; color: rgba(255, 255, 255, 0.5); cursor: pointer; text-decoration: underline; transition: color 0.3s;">Reset Script</span>
                    <span id="api-refresh-link-separator" style="display: none; font-size: 10px; color: rgba(255, 255, 255, 0.3);">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    <span id="api-refresh-link" style="display: none; font-size: 10px; color: rgba(255, 255, 255, 0.5); cursor: pointer; text-decoration: underline; transition: color 0.3s;">Refresh API</span>

                    <!-- Toast Notification Area -->
                    <div id="api-refresh-toast" style="
                        display: none;
                        margin-top: 8px;
                        padding: 6px;
                        font-size: 10px;
                        text-align: center;
                        border-radius: 4px;
                        transition: opacity 0.3s ease;
                    "></div>

                    <div id="reset-confirmation" style="display: none; margin-top: 10px; padding: 10px; background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 4px;">
                        <div style="color: #ff4444; font-size: 11px; font-weight: bold; margin-bottom: 8px; line-height: 1.3; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⚠️ RESET OPTIONS</div>
                        <!-- <div style="color: #fff; font-size: 10px; margin-bottom: 8px; line-height: 1.4;">Choose reset type:</div> -->

                        <!-- Reset Settings Option -->
                        <!-- COMMENTED OUT: Reset Settings Only (UI preferences can be toggled manually)
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 4px; margin-bottom: 6px; border: 1px solid rgba(255, 255, 255, 0.2);">
                            <div style="font-size: 10px; font-weight: bold; color: #ffa500; margin-bottom: 4px;">Reset Settings Only</div>
                            <div style="font-size: 9px; opacity: 0.7; margin-bottom: 6px; line-height: 1.3;">Clears UI preferences, preserves competition data</div>
                            <button id="reset-settings" style="width: 100%; padding: 6px; background: #ffa500; color: white; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">RESET SETTINGS</button>
                        </div>
                        -->

                        <!-- Reset All Option -->
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 4px; margin-bottom: 8px; border: 1px solid rgba(255, 0, 0, 0.3);">
                            <div style="font-size: 10px; font-weight: bold; color: #ff4444; margin-bottom: 4px;">Reset Everything</div>
                            <div style="font-size: 9px; opacity: 0.7; margin-bottom: 6px; line-height: 1.3;">Wipes all data including API logs, defeats, collectibles</div>
                            <button id="reset-all" style="width: 100%; padding: 6px; background: #ff4444; color: white; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold;">RESET ALL</button>
                        </div>

                        <button id="cancel-reset" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.5); color: white; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px; font-size: 9px; cursor: pointer;">CANCEL</button>
                    </div>
                </div>
            `;

            const leaderContent = `
                <!-- DOMINION MODE Section (Leader Mode) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 15px;">DOMINION MODE</div>
                    <div class="control-item" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(255, 105, 180, 0.2);">
                        <div>
                            <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta);">Spectral Authority</div>
                            <div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">Return to Member Panel</div>
                        </div>
                        <div class="toggle ${showLeaderPanel ? 'active' : ''}" id="leader-toggle-div" style="
                            position: relative; width: 45px; height: 22px; cursor: pointer;
                            background: ${showLeaderPanel ? 'linear-gradient(45deg, #00ffff, #ff69b4)' : 'rgba(0, 0, 0, 0.5)'};
                            border-radius: 22px; transition: all 0.3s ease;
                            border: 1px solid rgba(255, 105, 180, 0.3);
                        ">
                            <div style="
                                position: absolute; top: 2px; ${showLeaderPanel ? 'right: 2px;' : 'left: 2px;'}
                                width: 18px; height: 18px; background: #ffffff; border-radius: 50%;
                                transition: all 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>

                <!-- TARGET PAIRS MANAGEMENT Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="target-pairs-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>TARGET PAIRS MANAGEMENT</span>
                        <span id="target-pairs-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>
                    <div id="target-pairs-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">
                        <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #fff;">Target Pairs from Seed (Last 2 Digits):</div>
                    <div id="target-pairs-display" style="
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 5px;
                        padding: 8px;
                        font-family: monospace;
                        font-size: 10px;
                        line-height: 1.2;
                    ">
                        ${this.generateTargetPairsDisplay()}
                    </div>
                    </div>
                </div>

                <!-- SPOOKY TARGETS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="spooky-schedule-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>SPOOKY TARGETS</span>
                        <span id="spooky-schedule-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <!-- Spooky Targets Countdown/Status - Always Visible -->
                    <div id="spooky-targets-countdown" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        ⚙️ Awaiting Configuration
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="spooky-schedule-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure Spooky Targets
                    </div>

                    <div id="spooky-schedule-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">

                        <!-- Spooky Targets Active Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Spooky Targets Active:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="spooky-targets-active-toggle" style="transform: scale(1.2);">
                                <span id="spooky-targets-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing Mode (Override Dates):</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="spooky-testing-mode-toggle" style="transform: scale(1.2);">
                                <span id="spooky-testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Start Date & Time -->
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 10px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 4px; margin-left: 2px;">START DATE & TIME</label>
                            <div style="display: flex; gap: 6px;">
                                <input type="date" id="spooky-start-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                                <input type="time" id="spooky-start-time" style="padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            </div>
                        </div>

                        <!-- End Date & Time -->
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 10px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 4px; margin-left: 2px;">END DATE & TIME</label>
                            <div style="display: flex; gap: 6px;">
                                <input type="date" id="spooky-end-date" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                                <input type="time" id="spooky-end-time" style="padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            </div>
                        </div>

                        <div style="font-size: 9px; color: #ccc; margin-top: 8px; opacity: 0.7; line-height: 1.3; text-align: center;">
                            End notification triggers automatically on end date
                        </div>
                        <div style="text-align: center; margin-top: 6px;">
                            <span id="preview-spooky-end-notification" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: underline; opacity: 0.8;">Preview</span>
                        </div>
                    </div>
                </div>

                <!-- MANIFESTATIONS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="manifestations-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>MANIFESTATIONS</span>
                        <span id="manifestations-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Competition Countdown/Status - Always Visible -->
                    <div id="competition-countdown" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        🧪 TESTING MODE ACTIVE
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="manifestations-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure Collectible distribution
                    </div>

                    <div id="manifestations-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <!-- Competition Active Toggle -->
                    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold;">Competition Active:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="competition-active-toggle" style="transform: scale(1.2);">
                            <span id="competition-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                        </div>
                    </div>

                    <!-- Testing Mode Toggle -->
                    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing Mode:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="testing-mode-toggle" style="transform: scale(1.2);">
                            <span id="testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                        </div>
                    </div>

                    <!-- Testing Display Mode (only visible when Testing Mode is ON) -->
                    <div id="testing-display-mode" style="margin-bottom: 12px; display: none; padding: 8px; background: rgba(255, 165, 0, 0.1); border-radius: 4px; border: 1px solid var(--carved-orange);">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Testing Display:</label>
                        <div style="display: flex; gap: 12px;">
                            <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="radio" name="testing-display" value="all" style="transform: scale(1.1);">
                                <span>All Spawns</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="radio" name="testing-display" value="single" checked style="transform: scale(1.1);">
                                <span>Single Random</span>
                            </label>
                        </div>
                        <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                            All: Show entire competition at once | Single: Show one random pumpkin (realistic simulation)
                        </div>

                        <!-- Test Pages Only Toggle -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 165, 0, 0.3);">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="checkbox" id="testing-test-pages-only" style="transform: scale(1.1);">
                                <span>Use Test Pages only</span>
                            </label>
                            <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                                When enabled, testing spawns only appear on the home page (index.php)
                            </div>
                        </div>

                        <!-- Respawn Toggle -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 165, 0, 0.3);">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 11px; color: #fff; cursor: pointer;">
                                <input type="checkbox" id="testing-respawn-allowed" style="transform: scale(1.1);">
                                <span>Respawn Allowed (immediate respawn after collection)</span>
                            </label>
                            <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.8;">
                                When enabled, collectibles respawn immediately after collection for continuous testing
                            </div>
                        </div>
                    </div>

                    <!-- Competition Start Date/Time -->
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Competition Start (GMT):</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="date" id="competition-start-date" style="flex: 1; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                            <input type="time" id="competition-start-time" style="flex: 1; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                        </div>
                    </div>

                    <!-- Competition Duration -->
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Competition Duration:</label>
                        <select id="competition-duration" style="width: 100%; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px;">
                            <option value="3">3 Days</option>
                            <option value="5">5 Days</option>
                            <option value="7" selected>7 Days (Standard)</option>
                            <option value="10">10 Days</option>
                            <option value="14">14 Days</option>
                        </select>
                    </div>

                    <!-- Collections Firebase Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-collections-firebase-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Collections Firebase URL
                        </a>
                    </div>

                    <!-- Collections Firebase URL (Hidden by default) -->
                    <div id="collections-firebase-section" style="display: none; margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <label style="font-size: 12px; color: #fff; font-weight: bold; display: block; margin-bottom: 6px;">Collections Firebase URL:</label>
                        <input type="url" id="collections-firebase-url" placeholder="https://your-project.firebasedatabase.app" style="width: 100%; padding: 6px; border: 1px solid var(--carved-magenta); border-radius: 4px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 11px; box-sizing: border-box;">
                        <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7;">Logs pumpkin spawns & collections for audit trail</div>
                    </div>

                    <!-- Show Enchanted Pages Link -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-enchanted-pages-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Enchanted Pages
                        </a>
                    </div>

                    <!-- Enchanted Pages Management (Hidden by default) -->
                    <div id="enchanted-pages-section" style="display: none; margin-top: 15px; padding: 12px; background: rgba(139, 0, 139, 0.05); border: 1px solid rgba(139, 0, 139, 0.3); border-radius: 6px;">
                        <div style="font-size: 12px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px;">Enchanted Pages</div>
                        <div style="font-size: 9px; color: #ccc; margin-bottom: 10px; opacity: 0.8;">
                            Configure where pumpkins can spawn during the competition
                        </div>

                        <!-- URL Rows Container -->
                        <div id="enchanted-pages-rows" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; margin-bottom: 10px;">
                            <!-- Dynamic rows will be added here -->
                        </div>

                        <!-- Add Page Button -->
                        <button id="add-enchanted-page" style="width: 100%; padding: 8px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">
                            + Add Page
                        </button>
                    </div>

                    </div> <!-- End manifestations-content -->
                </div>

                <!-- DAILY BOUNTIES Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="daily-bounties-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>DAILY BOUNTIES</span>
                        <span id="daily-bounties-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Bounty Status - Always Visible -->
                    <div id="bounty-status" style="text-align: center; margin-bottom: 10px; padding: 10px; background: rgba(0, 255, 255, 0.1); border-radius: 6px; font-weight: bold; color: var(--carved-cyan); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: clamp(10px, 2.5vw, 13px); line-height: 1.2;">
                        ⚙️ Awaiting Configuration
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="daily-bounties-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Configure daily bounties (7 max)
                    </div>

                    <div id="daily-bounties-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                        <!-- Bounties Active Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Bounties Active:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="bounties-active-toggle" style="transform: scale(1.2);">
                                <span id="bounties-active-status" style="font-size: 11px; color: var(--carved-magenta); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Use Testing Mode:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="bounties-testing-toggle" style="transform: scale(1.2);">
                                <span id="bounties-testing-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>

                        <!-- Note about Halloweek -->
                        <div style="font-size: 9px; color: #ff9900; margin-bottom: 12px; padding: 8px; background: rgba(255, 153, 0, 0.1); border-radius: 4px; border: 1px solid rgba(255, 153, 0, 0.3); line-height: 1.4;">
                            <strong>Note:</strong> Bounties must be active ONLY during official Halloweek for attack collection to function properly.
                        </div>

                        <!-- Bounties List Container -->
                        <div id="bounties-list" style="margin-bottom: 12px;">
                            <!-- Dynamic rows will be inserted here -->
                        </div>

                        <!-- Add Bounty Button -->
                        <button id="add-bounty-btn" style="width: 100%; padding: 8px; background: linear-gradient(45deg, #4b0082, var(--carved-magenta)); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: bold;">+ ADD BOUNTY (MAX 7)</button>
                    </div>
                </div>

                <!-- ETHEREAL COMMAND Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="ethereal-command-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>ETHEREAL COMMAND</span>
                        <span id="ethereal-command-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="ethereal-command-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Master seed controls and import
                    </div>

                    <div id="ethereal-command-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                        <div style="font-size: 11px; margin-bottom: 8px; margin-left: 2px;">Master Essence: ${seedInfo.leaderSeed || 'None'}</div>
                        <div style="display: flex; margin-bottom: 8px;">
                            <input type="text" id="halloween-leader-seed-input" placeholder="Enter leader essence for channeling..." style="
                                flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.5);
                                border: 1px solid var(--carved-magenta); border-radius: 4px;
                                color: #fff; font-size: 10px;
                            " />
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="generate-leader-seed" style="flex: 1; padding: 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">MANIFEST</button>
                            <button id="set-leader-seed" style="flex: 1; padding: 8px; background: var(--carved-magenta); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">CHANNEL</button>
                        </div>
                    </div>
                </div>

                <!-- SPECTRAL FORGE Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="spectral-forge-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>SPECTRAL FORGE</span>
                        <span id="spectral-forge-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="spectral-forge-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Faction customization and branding tools
                    </div>

                    <div id="spectral-forge-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">

                    <!-- Colour Settings Toggle -->
                    <div style="text-align: center; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-colour-settings-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Colour Settings
                        </a>
                    </div>

                    <!-- Colour Settings Section (Hidden by default) -->
                    <div id="colour-settings-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="margin-bottom: 12px; display: flex; gap: 12px;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">PRIMARY COLOR</label>
                                <input type="color" id="halloween-primary-color" value="#ff6b35" style="width: 100%; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer; box-sizing: border-box;">
                                <input type="text" id="halloween-primary-color-text" value="#ff6b35" placeholder="#ff6b35" style="width: 100%; margin-top: 5px; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; text-align: center; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 4px; opacity: 0.7; text-align: center; margin-left: 2px;">Clear to reset default</div>
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">SECONDARY COLOR</label>
                                <input type="color" id="halloween-secondary-color" value="#f7931e" style="width: 100%; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer; box-sizing: border-box;">
                                <input type="text" id="halloween-secondary-color-text" value="#f7931e" placeholder="#f7931e" style="width: 100%; margin-top: 5px; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; text-align: center; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 4px; opacity: 0.7; text-align: center; margin-left: 2px;">Clear to reset default</div>
                            </div>
                        </div>
                    </div>

                    <!-- Image Settings Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-image-settings-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Image Settings
                        </a>
                    </div>

                    <!-- Image Settings Section (Hidden by default) -->
                    <div id="image-settings-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <!-- Menu Panel Image -->
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">MENU PANEL IMAGE</div>
                            <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                                <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                    <input type="radio" name="menu-panel-image" value="icon" id="menu-panel-icon" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                    <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎨 Icon (Circular)</span>
                                </label>
                                <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                    <input type="radio" name="menu-panel-image" value="banner" id="menu-panel-banner" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                    <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Banner (Wide)</span>
                                </label>
                            </div>

                            <!-- Icon URL Field (shown when Icon selected) -->
                            <div id="icon-url-field" style="display: block;">
                                <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Icon URL:</label>
                                <input type="url" id="halloween-icon-url" placeholder="https://example.com/icon.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 2px; padding-top: 2px; padding-left: 2px; opacity: 0.7;">Circular icon for menu toggle & Icon mode panel header</div>
                            </div>

                            <!-- Banner URL Field (shown when Banner selected) -->
                            <div id="banner-url-field" style="display: none;">
                                <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Banner URL:</label>
                                <input type="url" id="halloween-banner-url" placeholder="https://example.com/banner.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                                <div style="font-size: 8px; color: #ccc; margin-top: 2px; padding-top: 2px; padding-left: 2px; opacity: 0.7;">Wide banner image for Banner mode panel header</div>
                            </div>
                        </div>

                        <!-- Background Tile Image -->
                        <div style="margin-bottom: 0;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">BACKGROUND TILE IMAGE</label>
                            <input type="url" id="halloween-tile-image" placeholder="https://example.com/tile.png" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Optional: Repeating tile image for page background</div>
                        </div>
                    </div>

                    <!-- Target Effect Types Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-target-effects-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Target Effect Types
                        </a>
                    </div>

                    <!-- Target Effect Types Section (Hidden by default) -->
                    <div id="target-effects-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">SPOOKY TARGET EFFECT TYPE</div>
                        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="spooky-effect-type" value="emoji" id="spooky-effect-type-emoji" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎃 Emoji Patterns</span>
                            </label>
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="spooky-effect-type" value="image" id="spooky-effect-type-image" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Custom Image</span>
                            </label>
                        </div>
                        <div id="spooky-custom-image-field" style="display: none;">
                            <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Image URL:</label>
                            <input type="url" id="spooky-custom-image-url" placeholder="https://example.com/image.png" value="https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                            <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Recommended: PNG/JPG, 100-200px size</div>

                            <!-- Max Scale Slider -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <div style="font-size: 8px; color: #ccc; margin-bottom: 4px; opacity: 0.7;">Max scale of grow effect. Default 2.5x</div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="range" id="spooky-max-scale" min="0" max="5" step="0.25" value="2.5" style="flex: 1; accent-color: var(--carved-magenta);">
                                    <span id="spooky-max-scale-value" style="font-size: 10px; color: #fff; min-width: 35px; text-align: right;">2.5x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bounty Effect Types Section (Hidden by default) -->
                    <div id="bounty-effects-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <div style="font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 8px;">BOUNTY TARGET EFFECT TYPE</div>
                        <div style="display: flex; gap: 4px; margin-bottom: 10px;">
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="bounty-effect-type" value="emoji" id="bounty-effect-type-emoji" checked style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🔥 Emoji Patterns</span>
                            </label>
                            <label style="flex: 1; display: flex; align-items: center; gap: 4px; font-size: 10px; color: #fff; cursor: pointer;">
                                <input type="radio" name="bounty-effect-type" value="image" id="bounty-effect-type-image" style="accent-color: var(--carved-magenta); margin: 0; flex-shrink: 0;">
                                <span style="white-space: nowrap; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🖼️ Custom Image</span>
                            </label>
                        </div>
                        <div id="bounty-custom-image-field" style="display: none;">
                            <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Image URL:</label>
                            <input type="url" id="bounty-custom-image-url" placeholder="https://example.com/image.png" value="https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png" style="width: 100%; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; box-sizing: border-box;">
                            <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Recommended: PNG/JPG, 100-200px size</div>

                            <!-- Max Scale Slider -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <div style="font-size: 8px; color: #ccc; margin-bottom: 4px; opacity: 0.7;">Max scale of grow effect. Default 2.5x</div>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="range" id="bounty-max-scale" min="0" max="5" step="0.25" value="2.5" style="flex: 1; accent-color: var(--carved-magenta);">
                                    <span id="bounty-max-scale-value" style="font-size: 10px; color: #fff; min-width: 35px; text-align: right;">2.5x</span>
                                </div>
                            </div>

                            <!-- Glow Effect Settings -->
                            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 105, 180, 0.2);">
                                <label style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: #fff; cursor: pointer; margin-bottom: 8px;">
                                    <input type="checkbox" id="bounty-glow-enabled" checked style="accent-color: var(--carved-magenta);">
                                    <span>Enable Glow Effect</span>
                                </label>

                                <div id="bounty-glow-settings" style="display: block;">
                                    <label style="display: block; font-size: 9px; color: #fff; opacity: 0.8; margin-bottom: 4px;">Glow Color:</label>
                                    <div style="display: flex; gap: 6px; align-items: center;">
                                        <input type="color" id="bounty-glow-color" value="#ff6b35" style="width: 40px; height: 25px; padding: 2px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; cursor: pointer;">
                                        <input type="text" id="bounty-glow-color-text" value="#ff6b35" placeholder="#ff6b35" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center;">
                                    </div>
                                    <div style="font-size: 8px; color: #ccc; margin-top: 2px; opacity: 0.7;">Clear to reset to default (#ff6b35)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Firebase Attack Config Toggle -->
                    <div style="text-align: center; margin-top: 15px; padding-top: 12px; border-top: 1px solid rgba(139, 0, 139, 0.3);">
                        <a id="show-firebase-config-link" href="#" style="font-size: 11px; color: #4a90e2; text-decoration: none; cursor: pointer;">
                            Show Firebase Attack Config
                        </a>
                    </div>

                    <!-- Firebase Attack Config Section (Hidden by default) -->
                    <div id="firebase-config-section" style="display: none; margin-top: 12px; padding: 12px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                        <!-- Attack Logs Firebase URL -->
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">ATTACK LOGS FIREBASE URL</label>
                            <input type="url" id="attack-logs-firebase-url" placeholder="https://your-project.firebaseio.com" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Firebase Realtime Database URL for defeat verification</div>
                        </div>

                        <!-- RTDB Key -->
                        <div style="margin-bottom: 0;">
                            <label style="display: block; font-size: 11px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 6px; margin-left: 2px;">RTDB KEY</label>
                            <input type="text" id="rtdb-key" placeholder="Enter database authentication key" autocomplete="off" data-form-type="other" style="width: 100%; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px; box-sizing: border-box;">
                            <div style="font-size: 9px; color: #ccc; margin-top: 6px; opacity: 0.7; margin-left: 2px;">Required for secure database access</div>
                        </div>
                    </div>

                    </div> <!-- End spectral-forge-content -->
                </div>

                <!-- VOID TRANSMISSIONS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="halloween-announcements-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>VOID TRANSMISSIONS</span>
                        <span id="halloween-announcements-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="void-transmissions-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Customise news ticker hijacking
                    </div>

                    <div id="halloween-announcements-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                        <div style="font-size: 11px; margin-bottom: 10px; opacity: 0.8; color: #fff;">Configure spooky messages for news ticker hijacking:</div>
                        <div id="halloween-announcements-list">
                            <!-- Dynamic announcement fields will be inserted here -->
                        </div>
                        <button id="add-announcement" style="width: 100%; padding: 6px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 10px; cursor: pointer; margin-top: 8px;">ADD MESSAGE</button>
                        <div style="margin-top: 8px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; font-size: 9px; color: #fff; opacity: 0.7;">
                            💡 Start messages with emojis to replace ticker icon. Leave empty to auto-cleanup on menu close.
                        </div>
                        <div style="margin-top: 8px; display: flex; gap: 12px; align-items: center;">
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Display (sec)</label>
                                <input type="number" id="ticker-duration" min="1" max="10" step="1" value="4" style="width: 100%; padding: 4px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center; box-sizing: border-box; -moz-appearance: textfield;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Cycle (sec)</label>
                                <input type="number" id="ticker-frequency" min="10" max="60" step="5" value="15" style="width: 100%; padding: 4px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; color: #fff; font-size: 9px; text-align: center; box-sizing: border-box; -moz-appearance: textfield;">
                            </div>
                            <div style="flex: 1;">
                                <label style="display: block; font-size: 10px; color: #fff; opacity: 0.8; margin-bottom: 2px; text-align: center;">Default: #ff6b35</label>
                                <input type="color" id="ticker-color" value="#ff6b35" style="width: 100%; height: 24px; padding: 0; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 3px; cursor: pointer; box-sizing: border-box;">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SOUL CONDUIT Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="soul-conduit-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                        <span>SOUL CONDUIT</span>
                        <span id="soul-conduit-toggle" style="font-size: 12px; transition: transform 0.3s ease;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="soul-conduit-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Export configurations for team distribution
                    </div>

                    <div id="soul-conduit-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                    <div style="display: flex; gap: 8px;">
                        <button id="export-leader" style="flex: 1; padding: 8px; background: var(--carved-magenta); color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">EXPORT LEADER</button>
                        <button id="export-member" style="flex: 1; padding: 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">EXPORT MEMBER</button>
                    </div>

                    <!-- Export Display (hidden by default, shown when export buttons clicked) -->
                    <div id="export-fallback-container" style="display: none; margin-top: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <label style="font-size: 11px; font-weight: bold; color: var(--carved-magenta);">EXPORTED CONFIGURATION</label>
                            <div style="display: flex; gap: 6px;">
                                <button id="copy-export-btn" style="padding: 4px 8px; background: var(--carved-cyan); color: black; border: none; border-radius: 3px; font-size: 10px; cursor: pointer; font-weight: bold;">COPY</button>
                                <button id="dismiss-export-btn" style="padding: 4px 8px; background: rgba(255,255,255,0.2); color: white; border: none; border-radius: 3px; font-size: 10px; cursor: pointer; font-weight: bold;">DISMISS</button>
                            </div>
                        </div>
                        <textarea id="export-fallback-output" readonly style="width: 100%; height: 100px; background: rgba(0, 0, 0, 0.7); border: 1px solid var(--carved-magenta); border-radius: 6px; color: white; padding: 12px; font-family: 'Courier New', monospace; font-size: 10px; overflow-y: auto; box-sizing: border-box;"></textarea>
                        <div style="font-size: 9px; color: #ccc; margin-top: 4px; opacity: 0.7;">Click COPY to copy configuration to clipboard.</div>
                    </div>
                    </div> <!-- End soul-conduit-content -->
                </div>

                <!-- UNDERWORLD RITUALS Section (Leader Only) -->
                <div style="margin-bottom: 15px; background: rgba(255, 105, 180, 0.1); border: 1px solid var(--carved-magenta); border-radius: 8px; padding: 15px;">
                    <div id="underworld-rituals-header" style="font-size: 14px; font-weight: bold; color: var(--carved-magenta); margin-bottom: 10px; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: space-between;">
                        <span>UNDERWORLD RITUALS</span>
                        <span id="underworld-rituals-toggle" style="font-size: 12px; transition: transform 0.3s;">&#9660;</span>
                    </div>

                    <!-- Help Box - Visible when collapsed -->
                    <div id="underworld-rituals-help" style="font-size: 12px; margin-bottom: 10px; text-align: center; padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                        Console commands and debugging
                    </div>

                    <div id="underworld-rituals-content" style="display: block; overflow: hidden; transition: max-height 0.3s ease; max-height: 0px;">
                        <!-- API Testing Mode Toggle -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                            <label style="font-size: 12px; color: #fff; font-weight: bold;">Testing API Data:</label>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="api-testing-mode-toggle" style="transform: scale(1.2);">
                                <span id="api-testing-mode-status" style="font-size: 11px; color: var(--carved-orange); font-weight: bold;">OFF</span>
                            </div>
                        </div>
                        <div style="font-size: 10px; margin-bottom: 12px; padding: 8px; background: rgba(255, 165, 0, 0.05); border-radius: 4px; color: rgba(255, 255, 255, 0.7); line-height: 1.3;">
                            When enabled, uses enrollment timestamp instead of competition start for API attack data collection
                        </div>

                        <div style="font-size: 11px; margin-bottom: 8px; opacity: 0.8; color: #fff; margin-left: 2px;">Console commands for advanced user support:</div>
                    <div style="
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 5px;
                        padding: 8px;
                        font-family: monospace;
                        font-size: 10px;
                        line-height: 1.4;
                        color: #fff;
                    ">
                        <div style="margin-bottom: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Clear All Data:</div>
                            <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenUI.clearData()</code></div>
                            <div style="color: #ccc; font-size: 9px;">Removes all encounters, defeats, and cached data. Use only if user needs complete reset.</div>
                        </div>
                        <div style="margin-bottom: 6px; border-top: 1px solid rgba(255, 105, 180, 0.3); padding-top: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Check API Queue:</div>
                            <div style="color: #fff; margin-bottom: 2px;"><code>checkAPIQueue()</code></div>
                            <div style="color: #ccc; font-size: 9px;">Shows pending verifications, counted defeats, and unverified attacks for API mode debugging.</div>
                        </div>
                        <div style="margin-bottom: 6px; border-top: 1px solid rgba(255, 105, 180, 0.3); padding-top: 6px;">
                            <div style="color: var(--carved-magenta); font-weight: bold;">Debug Controls:</div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenDebug.getLevel()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Check current debug level (0-3).</div>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>HalloweenDebug.showHelp()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Show all available debug commands and level descriptions.</div>
                            </div>
                            <div style="margin-bottom: 4px;">
                                <div style="color: #fff; margin-bottom: 2px;"><code>halloweenDebugGeneration()</code></div>
                                <div style="color: #ccc; font-size: 9px;">Test target generation system with timing and validation checks (Leader Mode only).</div>
                            </div>
                        </div>
                    </div>

                    <!-- Debug Level Buttons -->
                    <div style="margin-top: 10px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 3px;">
                            <button id="debug-level-0" data-level="0" style="flex: 1; padding: 6px; background: #f8c8dc; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 0</button>
                            <button id="debug-level-1" data-level="1" style="flex: 1; padding: 6px; background: #f1a7c7; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 1</button>
                            <button id="debug-level-2" data-level="2" style="flex: 1; padding: 6px; background: #e685b2; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 2</button>
                            <button id="debug-level-3" data-level="3" style="flex: 1; padding: 6px; background: #db649d; color: black; border: none; border-radius: 3px; font-size: 9px; cursor: pointer; font-weight: bold; transition: all 0.3s;">LEVEL 3</button>
                        </div>
                        <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">PRODUCTION</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">BASIC</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">DETAILED</div>
                            <div style="flex: 1; text-align: center; font-size: 8px; color: #ccc;">FULL</div>
                        </div>
                        <div id="debug-feedback" style="padding-top: 2px; min-height: 10px; font-size: 10px; color: var(--carved-cyan); text-align: center; opacity: 0; transition: opacity 0.3s;"></div>
                    </div>
                    </div>
                </div>

            `;

            return `
                <div id="halloween-menu-content" style="
                    background: linear-gradient(180deg, var(--carved-midnight) 0%, var(--carved-void) 50%, var(--carved-purple) 100%);
                    padding: 20px;
                    color: var(--carved-text);
                    font-family: var(--halloween-font);
                    border-radius: 12px;
                    min-height: 600px;
                ">
                    <!-- Header -->
                    <div style="margin-bottom: 20px; border-bottom: 1px solid var(--carved-cyan); padding-bottom: 15px; position: relative; height: 100px;">
                        <button id="halloween-close" style="position: absolute; top: 5px; right: 5px; background: rgba(0, 255, 255, 0.1); border: 2px solid var(--carved-cyan); color: var(--carved-cyan); font-size: 18px; font-weight: bold; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s ease; z-index: 1000;">&times;</button>
                        ${config.menuPanelImage === 'banner' && config.factionBanner ? `
                            <img src="${config.factionBanner}" alt="Faction Banner" style="
                                max-width: 90%; max-height: 80px; object-fit: contain;
                                position: absolute; left: 50%; transform: translateX(-50%); top: 10px;
                            ">
                        ` : `
                            <img src="${config.factionIcon}" alt="Faction Icon" style="
                                width: 60px; height: 60px; border-radius: 50%;
                                border: 3px solid var(--carved-cyan);
                                box-shadow:
                                    0 0 20px rgba(0, 255, 255, 0.5),
                                    0 0 40px rgba(255, 107, 53, 0.6),
                                    0 0 60px rgba(255, 107, 53, 0.4);
                                animation: pulse 2s ease-in-out infinite;
                                position: absolute; left: 50%; transform: translateX(-50%); top: 10px;
                            ">
                        `}
                        <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); text-align: center; position: absolute; left: 50%; transform: translateX(-50%); top: 80px; width: 100%;">GRIMOIRE - CARVED EDITION</div>
                    </div>

                    <!-- Content based on menu panel view preference -->
                    ${(typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY && showLeaderPanel) ? leaderContent : memberContent}

                    <!-- Debug Level Display (Leader Only) -->
                    ${(typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY && showLeaderPanel) ? `<div style="text-align: center; font-size: 10px; opacity: 0.7; margin-top: 15px; color: var(--carved-magenta); display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 12px; margin-right: 4px;">&#x1F527;</span> Debug Level: <span id="debug-level-footer">0</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span id="debug-level-name">Production</span>
                    </div>` : ''}

                    <!-- Footer -->
                    <div style="text-align: center; font-size: 11px; opacity: 0.6; margin-top: 10px; padding-top: 15px; border-top: 1px solid rgba(0,255,255,0.3);">
                        Carved Edition &copy; 2025 Mistborn Publishings
                    </div>
                </div>
            `;
        },

        attachToggleListeners: function() {
            HalloweenDebug.log(2, '🎃 Attaching toggle event listeners...');

            // Leader Mode Toggle (only if MASTER_LEADER_KEY exists)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const leaderToggleDiv = document.getElementById('leader-toggle-div');
                if (leaderToggleDiv) {
                    leaderToggleDiv.removeEventListener('click', this.toggleLeaderMode.bind(this)); // Remove old listeners
                    leaderToggleDiv.addEventListener('click', this.toggleLeaderMode.bind(this));
                    HalloweenDebug.log(2, '🎃 Leader toggle listener attached to div');

                    // Debug: Check the actual toggle positioning (with delay for DOM rendering)
                    setTimeout(() => {
                        const toggleCircle = leaderToggleDiv.querySelector('div');
                        if (toggleCircle) {
                            const computedStyle = window.getComputedStyle(toggleCircle);
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Circle left position:', computedStyle.left);
                        HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Circle computed styles:', {
                            left: computedStyle.left,
                            width: computedStyle.width,
                            position: computedStyle.position
                        });

                            // Also check the actual inline style attribute
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: Inline style attribute:', toggleCircle.getAttribute('style'));
                        } else {
                            HalloweenDebug.log(3, '🎃 TOGGLE DEBUG: No toggle circle found inside toggle div');
                        }
                    }, 100);
                } else {
                    HalloweenDebug.log(2, '🎃 ERROR: leader-toggle-div not found!');
                }
            } else {
                HalloweenDebug.log(2, '🎃 Skipping leader toggle listener (member mode)');
            }

            // Debug: Check Carved King centering (with delay)
            setTimeout(() => {
                const carvedKingImg = document.querySelector('img[alt="Carved King"]');
                if (carvedKingImg) {
                    const parentDiv = carvedKingImg.parentElement;
                    const computedParentStyle = window.getComputedStyle(parentDiv);
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: Parent div styles:', {
                        display: computedParentStyle.display,
                        justifyContent: computedParentStyle.justifyContent,
                        textAlign: computedParentStyle.textAlign
                    });
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: Parent inline style:', parentDiv.getAttribute('style'));
                } else {
                    HalloweenDebug.log(3, '🎃 CARVED KING DEBUG: No Carved King image found');
                }
            }, 150);

            // Close button
            const closeButton = document.getElementById('halloween-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    // Use the same close logic as toggleMenu
                    if (HalloweenUI.menuOpen) {
                        if (HalloweenUI.menuPosition === 'top') {
                            // Dropdown menu close
                            const menu = document.getElementById('halloween-dropdown-menu');
                            if (menu) {
                                menu.style.opacity = '0';
                                menu.style.visibility = 'hidden';
                                menu.style.transform = 'translateY(-10px)';
                            }
                        } else {
                            // Side menu close
                            const trigger = document.getElementById('halloween-pumpkin-trigger');
                            const menu = document.getElementById('halloween-sliding-menu');
                            if (menu && trigger) {
                                menu.style.right = '-330px';
                                trigger.style.right = '-25px';
                                trigger.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                            }
                        }
                        HalloweenUI.menuOpen = false;
                        HalloweenDebug.log(2, '🎃 Menu properly closed via close button');
                    }
                });
                closeButton.addEventListener('mouseover', () => {
                    closeButton.style.backgroundColor = 'rgba(0,255,255,0.2)';
                });
                closeButton.addEventListener('mouseout', () => {
                    closeButton.style.backgroundColor = 'rgba(0,255,255,0.1)';
                });
                HalloweenDebug.log(2, '🎃 Close button listener attached');
            }

            // Background Toggle
            const bgToggleDiv = document.getElementById('bg-toggle-div');
            if (bgToggleDiv) {
                bgToggleDiv.removeEventListener('click', this.toggleBackground.bind(this));
                bgToggleDiv.addEventListener('click', this.toggleBackground.bind(this));
                HalloweenDebug.log(2, '🎃 Background toggle listener attached');
            }

            // Sound Toggle
            const soundToggleDiv = document.getElementById('sound-toggle-div');
            if (soundToggleDiv) {
                soundToggleDiv.removeEventListener('click', this.toggleSound.bind(this));
                soundToggleDiv.addEventListener('click', this.toggleSound.bind(this));
                HalloweenDebug.log(2, '🎃 Sound toggle listener attached');
            }

            // Menu Position Toggle
            const positionToggleDiv = document.getElementById('position-toggle-div');
            if (positionToggleDiv) {
                positionToggleDiv.removeEventListener('click', this.toggleMenuPosition.bind(this));
                positionToggleDiv.addEventListener('click', this.toggleMenuPosition.bind(this));
                HalloweenDebug.log(2, '🎃 Position toggle listener attached');
            }

            // Button listeners for clean menu
            const importBtn = document.getElementById('import-config');
            if (importBtn) {
                importBtn.removeEventListener('click', this.importConfig.bind(this));
                importBtn.addEventListener('click', this.importConfig.bind(this));
            }

            // Export buttons (Soul Conduit - Leader only)
            const exportLeaderBtn = document.getElementById('export-leader');
            if (exportLeaderBtn) {
                exportLeaderBtn.removeEventListener('click', this.exportForLeaders.bind(this));
                exportLeaderBtn.addEventListener('click', this.exportForLeaders.bind(this));
                HalloweenDebug.log(2, '🎃 EXPORT LEADER button listener attached');
            }

            const exportMemberBtn = document.getElementById('export-member');
            if (exportMemberBtn) {
                exportMemberBtn.removeEventListener('click', this.exportForMembers.bind(this));
                exportMemberBtn.addEventListener('click', this.exportForMembers.bind(this));
                HalloweenDebug.log(2, '🎃 EXPORT MEMBER button listener attached');
            }

            // Export buttons
            const copyExportBtn = document.getElementById('copy-export-btn');
            if (copyExportBtn) {
                copyExportBtn.addEventListener('click', () => {
                    const textarea = document.getElementById('export-fallback-output');
                    if (textarea) {
                        textarea.select();
                        document.execCommand('copy');

                        // Show feedback
                        const originalText = copyExportBtn.textContent;
                        copyExportBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyExportBtn.textContent = originalText;
                        }, 2000);

                        HalloweenDebug.log(2, '🎃 Export JSON copied to clipboard');
                    }
                });
            }

            const dismissExportBtn = document.getElementById('dismiss-export-btn');
            if (dismissExportBtn) {
                dismissExportBtn.addEventListener('click', () => {
                    this.hideExportFallback();
                    HalloweenDebug.log(2, '🎃 Export display dismissed');
                });
            }

            // MANIFEST and CHANNEL buttons (Leader Mode)
            const generateLeaderSeedBtn = document.getElementById('generate-leader-seed');
            if (generateLeaderSeedBtn) {
                generateLeaderSeedBtn.removeEventListener('click', this.generateLeaderSeed.bind(this));
                generateLeaderSeedBtn.addEventListener('click', this.generateLeaderSeed.bind(this));
                HalloweenDebug.log(2, '🎃 MANIFEST button listener attached');
            }

            const setLeaderSeedBtn = document.getElementById('set-leader-seed');
            if (setLeaderSeedBtn) {
                setLeaderSeedBtn.removeEventListener('click', this.setLeaderSeed.bind(this));
                setLeaderSeedBtn.addEventListener('click', this.setLeaderSeed.bind(this));
                HalloweenDebug.log(2, '🎃 CHANNEL button listener attached');
            }

            // Close Button
            const closeBtn = document.getElementById('halloween-close-btn');
            if (closeBtn) {
                closeBtn.removeEventListener('click', this.toggleMenu.bind(this));
                closeBtn.addEventListener('click', this.toggleMenu.bind(this));
                HalloweenDebug.log(2, '🎃 Close button listener attached');
            }

            // Debug Level Buttons
            for (let i = 0; i <= 3; i++) {
                const debugBtn = document.getElementById(`debug-level-${i}`);
                if (debugBtn) {
                    debugBtn.removeEventListener('click', () => this.setDebugLevel(i));
                    debugBtn.addEventListener('click', () => this.setDebugLevel(i));
                }
            }
            HalloweenDebug.log(2, '🎃 Debug level button listeners attached');

            // API Testing Mode Toggle (Leader Only - in Underworld Rituals)
            const apiTestingToggle = document.getElementById('api-testing-mode-toggle');
            const apiTestingStatus = document.getElementById('api-testing-mode-status');
            if (apiTestingToggle && apiTestingStatus) {
                // Load saved state
                const savedState = GM_getValue('halloween_api_testing_mode', false);
                apiTestingToggle.checked = savedState;
                apiTestingStatus.textContent = savedState ? 'ON' : 'OFF';
                apiTestingStatus.style.color = savedState ? '#00ff00' : 'var(--carved-orange)';

                apiTestingToggle.addEventListener('change', () => {
                    const isEnabled = apiTestingToggle.checked;
                    GM_setValue('halloween_api_testing_mode', isEnabled);
                    apiTestingStatus.textContent = isEnabled ? 'ON' : 'OFF';
                    apiTestingStatus.style.color = isEnabled ? '#00ff00' : 'var(--carved-orange)';

                    HalloweenDebug.log(1, `🧪 API Testing Mode ${isEnabled ? 'enabled' : 'disabled'}`);

                    // Trigger immediate refresh if enabled
                    if (isEnabled && typeof APIDefeatVerification !== 'undefined') {
                        HalloweenDebug.log(1, '🧪 Triggering immediate attack log refresh in testing mode');
                        APIDefeatVerification.refreshAttackLog();
                    }
                });
                HalloweenDebug.log(2, '🎃 API Testing Mode toggle listener attached');
            }

            // Halloween Announcements functionality
            this.initHalloweenAnnouncements();

            // Manifestations (Competition Management) functionality
            this.initManifestations();
        },

        initHalloweenAnnouncements: function() {
            // Initialize default announcements if none exist
            if (!this.halloweenAnnouncements) {
                this.halloweenAnnouncements = [];
                this.loadHalloweenAnnouncements();
            }

            // Setup announcements section
            this.setupAnnouncementsToggle();
            this.setupManifestationsToggle();
            this.setupEtherealCommandToggle();
            this.setupSpectralForgeToggle();
            this.setupDailyBountiesToggle();
            this.setupDailyBountiesHandlers();
            this.setupSoulConduitToggle();
            this.setupUnderworldRitualsToggle();
            this.setupTargetPairsToggle();
            this.setupSpookyScheduleToggle();
            this.setupPhantomSettingsToggle();
            this.setupArcaneRitualsToggle();
            this.setupEffectTypeToggle();
            this.setupDefeatVerificationToggle();
            this.setupTileImageHandler();
            this.setupFactionIconHandler();
            this.setupPrimaryColorHandler();
            this.setupSecondaryColorHandler();
            this.setupMenuPanelImageHandler();
            this.setupFactionBannerHandler();
            this.setupFirebaseURLHandler();
            this.setupPlayerIdentityHandlers();
            this.setupSwitchToAPIHandler();
            this.setupSpookyDatesHandlers();
            this.setupResetHandlers();
            this.checkSpookyTargetsEndDate();
            this.populateAnnouncementFields();
            this.populateTickerSettings();
            this.attachAnnouncementListeners();
        },

        loadHalloweenAnnouncements: function() {
            const stored = GM_getValue('halloween_announcements', '');
            if (stored) {
                try {
                    this.halloweenAnnouncements = JSON.parse(stored);
                } catch (e) {
                    this.halloweenAnnouncements = [];
                }
            } else {
                // Default announcements
                this.halloweenAnnouncements = [
                    { message: '🎃 The Halloween Hunt begins...', enabled: true },
                    { message: '👻 Spectral targets detected', enabled: true },
                    { message: '🦇 Night stalkers on the prowl', enabled: false }
                ];
                this.saveHalloweenAnnouncements();
            }

            // Load ticker timing settings
            this.tickerDuration = GM_getValue('halloween_ticker_duration', 4) * 1000; // Convert to ms
            this.tickerFrequency = GM_getValue('halloween_ticker_frequency', 15) * 1000; // Convert to ms
            this.tickerColor = GM_getValue('halloween_ticker_color', '#ff6b35');
        },

        saveHalloweenAnnouncements: function() {
            GM_setValue('halloween_announcements', JSON.stringify(this.halloweenAnnouncements));
        },

        saveTickerSettings: function() {
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput && frequencyInput && colorInput) {
                const duration = parseInt(durationInput.value) || 4;
                const frequency = parseInt(frequencyInput.value) || 15;
                const color = colorInput.value || '#ff6b35';

                this.tickerDuration = duration * 1000; // Convert to ms
                this.tickerFrequency = frequency * 1000; // Convert to ms
                this.tickerColor = color;

                GM_setValue('halloween_ticker_duration', duration);
                GM_setValue('halloween_ticker_frequency', frequency);
                GM_setValue('halloween_ticker_color', color);

                HalloweenDebug.log(1, `🎃 Ticker settings saved: ${duration}s display, ${frequency}s cycle, ${color} color`);
            }
        },

        populateTickerSettings: function() {
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput && frequencyInput && colorInput) {
                durationInput.value = (this.tickerDuration / 1000).toString();
                frequencyInput.value = (this.tickerFrequency / 1000).toString();
                colorInput.value = this.tickerColor;
            }
        },

        setupAnnouncementsToggle: function() {
            const header = document.getElementById('halloween-announcements-header');
            const content = document.getElementById('halloween-announcements-content');
            const toggle = document.getElementById('halloween-announcements-toggle');
            const helpBox = document.getElementById('void-transmissions-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '400px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupManifestationsToggle: function() {
            const header = document.getElementById('manifestations-header');
            const content = document.getElementById('manifestations-content');
            const toggle = document.getElementById('manifestations-toggle');
            const countdown = document.getElementById('competition-countdown');
            const helpBox = document.getElementById('manifestations-help');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                if (helpBox) helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        if (countdown) countdown.style.marginBottom = '10px';
                        if (helpBox) {
                            helpBox.style.display = 'block';
                            helpBox.style.marginBottom = '0px';
                        }
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        if (countdown) countdown.style.marginBottom = '10px';
                        if (helpBox) {
                            helpBox.style.display = 'none';
                            helpBox.style.marginBottom = '0px';
                        }
                    }
                });
            }
        },

        setupUnderworldRitualsToggle: function() {
            const header = document.getElementById('underworld-rituals-header');
            const content = document.getElementById('underworld-rituals-content');
            const toggle = document.getElementById('underworld-rituals-toggle');
            const helpBox = document.getElementById('underworld-rituals-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '550px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupTargetPairsToggle: function() {
            const header = document.getElementById('target-pairs-header');
            const content = document.getElementById('target-pairs-content');
            const toggle = document.getElementById('target-pairs-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                    }
                });
            }
        },

        setupSpectralForgeToggle: function() {
            const header = document.getElementById('spectral-forge-header');
            const content = document.getElementById('spectral-forge-content');
            const toggle = document.getElementById('spectral-forge-toggle');
            const helpBox = document.getElementById('spectral-forge-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }

            // Colour Settings Toggle
            const colourSettingsLink = document.getElementById('show-colour-settings-link');
            const colourSettingsSection = document.getElementById('colour-settings-section');
            if (colourSettingsLink && colourSettingsSection) {
                colourSettingsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = colourSettingsSection.style.display === 'none';
                    if (isHidden) {
                        colourSettingsSection.style.display = 'block';
                        colourSettingsLink.textContent = 'Hide Colour Settings';
                    } else {
                        colourSettingsSection.style.display = 'none';
                        colourSettingsLink.textContent = 'Show Colour Settings';
                    }
                });
            }

            // Image Settings Toggle
            const imageSettingsLink = document.getElementById('show-image-settings-link');
            const imageSettingsSection = document.getElementById('image-settings-section');
            if (imageSettingsLink && imageSettingsSection) {
                imageSettingsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = imageSettingsSection.style.display === 'none';
                    if (isHidden) {
                        imageSettingsSection.style.display = 'block';
                        imageSettingsLink.textContent = 'Hide Image Settings';
                    } else {
                        imageSettingsSection.style.display = 'none';
                        imageSettingsLink.textContent = 'Show Image Settings';
                    }
                });
            }

            // Target Effect Types Toggle
            const targetEffectsLink = document.getElementById('show-target-effects-link');
            const targetEffectsSection = document.getElementById('target-effects-section');
            const bountyEffectsSection = document.getElementById('bounty-effects-section');
            if (targetEffectsLink && targetEffectsSection && bountyEffectsSection) {
                targetEffectsLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = targetEffectsSection.style.display === 'none';
                    if (isHidden) {
                        targetEffectsSection.style.display = 'block';
                        bountyEffectsSection.style.display = 'block';
                        targetEffectsLink.textContent = 'Hide Target Effect Types';
                    } else {
                        targetEffectsSection.style.display = 'none';
                        bountyEffectsSection.style.display = 'none';
                        targetEffectsLink.textContent = 'Show Target Effect Types';
                    }
                });
            }

            // Firebase Attack Config Toggle
            const firebaseConfigLink = document.getElementById('show-firebase-config-link');
            const firebaseConfigSection = document.getElementById('firebase-config-section');
            if (firebaseConfigLink && firebaseConfigSection) {
                firebaseConfigLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = firebaseConfigSection.style.display === 'none';
                    if (isHidden) {
                        firebaseConfigSection.style.display = 'block';
                        firebaseConfigLink.textContent = 'Hide Firebase Attack Config';
                    } else {
                        firebaseConfigSection.style.display = 'none';
                        firebaseConfigLink.textContent = 'Show Firebase Attack Config';
                    }
                });
            }
        },

        setupDailyBountiesToggle: function() {
            const header = document.getElementById('daily-bounties-header');
            const content = document.getElementById('daily-bounties-content');
            const toggle = document.getElementById('daily-bounties-toggle');
            const helpBox = document.getElementById('daily-bounties-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        this.saveDailyBounties();
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '1200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupDailyBountiesHandlers: function() {
            const activeToggle = document.getElementById('bounties-active-toggle');
            const activeStatus = document.getElementById('bounties-active-status');

            if (activeToggle && activeStatus) {
                const config = BountyManager.getConfig();
                activeToggle.checked = config.active;
                activeStatus.textContent = config.active ? 'ON' : 'OFF';
                activeStatus.style.color = config.active ? 'var(--carved-cyan)' : '#ff4444';

                activeToggle.addEventListener('change', () => {
                    const newConfig = BountyManager.getConfig();
                    newConfig.active = activeToggle.checked;
                    BountyManager.setConfig(newConfig);
                    activeStatus.textContent = activeToggle.checked ? 'ON' : 'OFF';
                    activeStatus.style.color = activeToggle.checked ? 'var(--carved-cyan)' : '#ff4444';

                    // Update status display
                    BountyManager.updateBountyStatus();

                    // Update member panel display
                    if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                        HalloweenUI.updateBountiesClaimed();
                    }
                });
            }

            const testingToggle = document.getElementById('bounties-testing-toggle');
            const testingStatus = document.getElementById('bounties-testing-status');

            if (testingToggle && testingStatus) {
                const config = BountyManager.getConfig();
                testingToggle.checked = config.testing;
                testingStatus.textContent = config.testing ? 'ON' : 'OFF';
                testingStatus.style.color = config.testing ? 'var(--carved-cyan)' : '#ff4444';

                testingToggle.addEventListener('change', () => {
                    const newConfig = BountyManager.getConfig();
                    newConfig.testing = testingToggle.checked;
                    BountyManager.setConfig(newConfig);
                    testingStatus.textContent = testingToggle.checked ? 'ON' : 'OFF';
                    testingStatus.style.color = testingToggle.checked ? 'var(--carved-cyan)' : '#ff4444';

                    // Update status display
                    BountyManager.updateBountyStatus();
                });
            }

            const addBtn = document.getElementById('add-bounty-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    // Save current values before adding new row
                    this.saveDailyBounties();

                    const config = BountyManager.getConfig();
                    if (config.bounties.length < 7) {
                        config.bounties.push({url: '', date: ''});
                        BountyManager.setConfig(config);
                        this.renderBountiesList();
                        BountyManager.updateBountyStatus();
                    }
                });
            }

            this.renderBountiesList();

            // Update status display on initial setup
            BountyManager.updateBountyStatus();
        },

        renderBountiesList: function() {
            const container = document.getElementById('bounties-list');
            if (!container) return;

            const config = BountyManager.getConfig();
            container.innerHTML = '';

            config.bounties.forEach((bounty, index) => {
                const row = document.createElement('div');
                row.style.cssText = 'margin-bottom: 8px; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 6px; border: 1px solid rgba(255, 105, 180, 0.2);';

                row.innerHTML = `
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <input type="text" data-bounty-index="${index}" data-bounty-field="url" value="${bounty.url || ''}" placeholder="Profile URL (e.g., torn.com/profiles.php?XID=123456)" style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                        <input type="date" data-bounty-index="${index}" data-bounty-field="date" value="${bounty.date || ''}" style="width: 135px; padding: 6px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                    </div>
                `;

                container.appendChild(row);
            });

            // Attach blur handlers for auto-save
            container.querySelectorAll('input[data-bounty-field]').forEach(input => {
                input.addEventListener('blur', () => {
                    this.saveDailyBounties();
                });
            });
        },

        saveDailyBounties: function() {
            const container = document.getElementById('bounties-list');
            if (!container) return;

            const config = BountyManager.getConfig();
            const inputs = container.querySelectorAll('input[data-bounty-field]');

            inputs.forEach(input => {
                const index = parseInt(input.getAttribute('data-bounty-index'));
                const field = input.getAttribute('data-bounty-field');
                if (config.bounties[index]) {
                    config.bounties[index][field] = input.value.trim();
                }
            });

            config.bounties = config.bounties.filter(b => b.url && b.url.trim() !== '');
            BountyManager.setConfig(config);
            HalloweenDebug.log(2, 'Daily bounties saved:', config.bounties);

            // Update status display
            BountyManager.updateBountyStatus();

            // Update member panel display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateBountiesClaimed) {
                HalloweenUI.updateBountiesClaimed();
            }
        },

        setupSoulConduitToggle: function() {
            const header = document.getElementById('soul-conduit-header');
            const content = document.getElementById('soul-conduit-content');
            const toggle = document.getElementById('soul-conduit-toggle');
            const helpBox = document.getElementById('soul-conduit-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupSpookyScheduleToggle: function() {
            const header = document.getElementById('spooky-schedule-header');
            const content = document.getElementById('spooky-schedule-content');
            const toggle = document.getElementById('spooky-schedule-toggle');
            const helpBox = document.getElementById('spooky-schedule-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '500px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupEtherealCommandToggle: function() {
            const header = document.getElementById('ethereal-command-header');
            const content = document.getElementById('ethereal-command-content');
            const toggle = document.getElementById('ethereal-command-toggle');
            const helpBox = document.getElementById('ethereal-command-help');

            if (header && content && toggle && helpBox) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '10px';
                helpBox.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'block';
                        helpBox.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '300px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        helpBox.style.display = 'none';
                        helpBox.style.marginBottom = '0px';
                    }
                });
            }
        },

        setupPhantomSettingsToggle: function() {
            const header = document.getElementById('phantom-settings-header');
            const content = document.getElementById('phantom-settings-content');
            const toggle = document.getElementById('phantom-settings-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        // Collapse
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                        GM_setValue('phantom_settings_expanded', false);
                    } else {
                        // Expand
                        content.style.maxHeight = '300px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                        GM_setValue('phantom_settings_expanded', true);
                    }
                });

                // Restore saved expanded state
                const wasExpanded = GM_getValue('phantom_settings_expanded', false);
                if (wasExpanded) {
                    content.style.maxHeight = '300px';
                    content.style.marginTop = '';
                    content.style.marginBottom = '';
                    toggle.innerHTML = '&#9650;';
                    toggle.style.transform = 'rotate(180deg)';
                    header.style.marginBottom = '10px';
                }
            }
        },

        setupArcaneRitualsToggle: function() {
            const header = document.getElementById('arcane-rituals-header');
            const content = document.getElementById('arcane-rituals-content');
            const toggle = document.getElementById('arcane-rituals-toggle');

            if (header && content && toggle) {
                // Set initial collapsed state
                content.style.marginTop = '0px';
                content.style.marginBottom = '0px';
                header.style.marginBottom = '0px';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        content.style.maxHeight = '0px';
                        content.style.marginTop = '0px';
                        content.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                        header.style.marginBottom = '0px';
                    } else {
                        content.style.maxHeight = '200px';
                        content.style.marginTop = '';
                        content.style.marginBottom = '';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                        header.style.marginBottom = '10px';
                    }
                });
            }
        },

        setupSpookyDatesHandlers: function() {
            // Load saved dates into input fields (handlers now in PumpkinCompetition.setupSpookyHandlers)
            const startDateInput = document.getElementById('spooky-start-date');
            const startTimeInput = document.getElementById('spooky-start-time');
            const endDateInput = document.getElementById('spooky-end-date');
            const endTimeInput = document.getElementById('spooky-end-time');

            if (startDateInput && startTimeInput && endDateInput && endTimeInput) {
                const savedStartDate = GM_getValue('halloween_spooky_start_date', '');
                const savedStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                const savedEndDate = GM_getValue('halloween_spooky_end_date', '');
                const savedEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                if (savedStartDate) startDateInput.value = savedStartDate;
                if (savedStartTime) startTimeInput.value = savedStartTime;
                if (savedEndDate) endDateInput.value = savedEndDate;
                if (savedEndTime) endTimeInput.value = savedEndTime;
            }
        },

        checkSpookyTargetsEndDate: function() {
            // Check if spooky targets competition has ended based on date and time
            const endDate = GM_getValue('halloween_spooky_end_date', '');
            const endTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!endDate) {
                return; // No end date configured
            }

            const now = new Date();
            const competitionEnd = new Date(`${endDate}T${endTime}`);

            // Check if current time is on or after end date/time
            if (now >= competitionEnd) {
                // Competition has ended - disable toggle regardless of notification status
                const wasActive = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';

                if (wasActive) {
                    GM_setValue('halloween_spooky_targets_active', 'false');

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update UI toggle if visible
                    const spookyToggle = document.getElementById('spooky-targets-active-toggle');
                    const spookyStatus = document.getElementById('spooky-targets-active-status');
                    if (spookyToggle && spookyStatus) {
                        spookyToggle.checked = false;
                        spookyStatus.textContent = 'OFF';
                        spookyStatus.style.color = '#ff4444';
                    }

                    // Update countdown
                    if (typeof PumpkinCompetition !== 'undefined' && PumpkinCompetition.updateSpookyTargetsCountdown) {
                        PumpkinCompetition.updateSpookyTargetsCountdown();
                    }

                    HalloweenDebug.log(1, '🎯 Spooky targets disabled - competition ended');
                }

                // Show notification (only once)
                HalloweenCompetition.showSpookyTargetsEndNotification();
            }
        },

        setupEffectTypeToggle: function() {
            // SPOOKY TARGET EFFECT TYPE
            const spookyEmojiRadio = document.getElementById('spooky-effect-type-emoji');
            const spookyImageRadio = document.getElementById('spooky-effect-type-image');
            const spookyCustomImageField = document.getElementById('spooky-custom-image-field');
            const spookyCustomImageUrl = document.getElementById('spooky-custom-image-url');

            if (spookyEmojiRadio && spookyImageRadio && spookyCustomImageField) {
                // Load saved spooky settings
                const savedSpookyEffectType = GM_getValue('halloween_spooky_effect_type', 'emoji');
                const savedSpookyImageUrl = GM_getValue('halloween_spooky_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

                // Apply saved spooky settings
                if (savedSpookyEffectType === 'image') {
                    spookyImageRadio.checked = true;
                    spookyCustomImageField.style.display = 'block';
                } else {
                    spookyEmojiRadio.checked = true;
                    spookyCustomImageField.style.display = 'none';
                }

                if (spookyCustomImageUrl) {
                    spookyCustomImageUrl.value = savedSpookyImageUrl;
                }

                // Handle spooky emoji radio selection
                spookyEmojiRadio.addEventListener('change', () => {
                    if (spookyEmojiRadio.checked) {
                        spookyCustomImageField.style.display = 'none';
                        GM_setValue('halloween_spooky_effect_type', 'emoji');
                        HalloweenDebug.log(1, '🎃 Spooky effect type set to emoji patterns');
                    }
                });

                // Handle spooky image radio selection
                spookyImageRadio.addEventListener('change', () => {
                    if (spookyImageRadio.checked) {
                        spookyCustomImageField.style.display = 'block';
                        GM_setValue('halloween_spooky_effect_type', 'image');
                        HalloweenDebug.log(1, '🎃 Spooky effect type set to custom image');
                    }
                });

                // Handle spooky custom image URL changes
                if (spookyCustomImageUrl) {
                    spookyCustomImageUrl.addEventListener('blur', () => {
                        const url = spookyCustomImageUrl.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';
                        GM_setValue('halloween_spooky_custom_image_url', url);
                        HalloweenDebug.log(1, `🎃 Spooky custom image URL saved: ${url}`);
                    });
                }

                // Handle spooky max scale slider
                const spookyMaxScaleSlider = document.getElementById('spooky-max-scale');
                const spookyMaxScaleValue = document.getElementById('spooky-max-scale-value');
                if (spookyMaxScaleSlider && spookyMaxScaleValue) {
                    // Load saved value
                    const savedMaxScale = GM_getValue('halloween_spooky_max_scale', '2.5');
                    spookyMaxScaleSlider.value = savedMaxScale;
                    spookyMaxScaleValue.textContent = `${savedMaxScale}x`;

                    // Update display and save on change
                    spookyMaxScaleSlider.addEventListener('input', () => {
                        const value = spookyMaxScaleSlider.value;
                        spookyMaxScaleValue.textContent = `${value}x`;
                        GM_setValue('halloween_spooky_max_scale', value);
                        HalloweenDebug.log(1, `🎃 Spooky max scale set to ${value}x`);
                    });
                }
            }

            // BOUNTY TARGET EFFECT TYPE
            const bountyEmojiRadio = document.getElementById('bounty-effect-type-emoji');
            const bountyImageRadio = document.getElementById('bounty-effect-type-image');
            const bountyCustomImageField = document.getElementById('bounty-custom-image-field');
            const bountyCustomImageUrl = document.getElementById('bounty-custom-image-url');

            if (bountyEmojiRadio && bountyImageRadio && bountyCustomImageField) {
                // Load saved bounty settings
                const savedBountyEffectType = GM_getValue('halloween_bounty_effect_type', 'emoji');
                const savedBountyImageUrl = GM_getValue('halloween_bounty_custom_image_url', 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png');

                // Apply saved bounty settings
                if (savedBountyEffectType === 'image') {
                    bountyImageRadio.checked = true;
                    bountyCustomImageField.style.display = 'block';
                } else {
                    bountyEmojiRadio.checked = true;
                    bountyCustomImageField.style.display = 'none';
                }

                if (bountyCustomImageUrl) {
                    bountyCustomImageUrl.value = savedBountyImageUrl;
                }

                // Handle bounty emoji radio selection
                bountyEmojiRadio.addEventListener('change', () => {
                    if (bountyEmojiRadio.checked) {
                        bountyCustomImageField.style.display = 'none';
                        GM_setValue('halloween_bounty_effect_type', 'emoji');
                        HalloweenDebug.log(1, '🔥 Bounty effect type set to emoji patterns');
                    }
                });

                // Handle bounty image radio selection
                bountyImageRadio.addEventListener('change', () => {
                    if (bountyImageRadio.checked) {
                        bountyCustomImageField.style.display = 'block';
                        GM_setValue('halloween_bounty_effect_type', 'image');
                        HalloweenDebug.log(1, '🔥 Bounty effect type set to custom image');
                    }
                });

                // Handle bounty custom image URL changes
                if (bountyCustomImageUrl) {
                    bountyCustomImageUrl.addEventListener('blur', () => {
                        const url = bountyCustomImageUrl.value || 'https://i.ibb.co/VprkvKbX/Wmd-Venom34x.png';
                        GM_setValue('halloween_bounty_custom_image_url', url);
                        HalloweenDebug.log(1, `🔥 Bounty custom image URL saved: ${url}`);
                    });
                }

                // Handle bounty max scale slider
                const bountyMaxScaleSlider = document.getElementById('bounty-max-scale');
                const bountyMaxScaleValue = document.getElementById('bounty-max-scale-value');
                if (bountyMaxScaleSlider && bountyMaxScaleValue) {
                    // Load saved value
                    const savedMaxScale = GM_getValue('halloween_bounty_max_scale', '2.5');
                    bountyMaxScaleSlider.value = savedMaxScale;
                    bountyMaxScaleValue.textContent = `${savedMaxScale}x`;

                    // Update display and save on change
                    bountyMaxScaleSlider.addEventListener('input', () => {
                        const value = bountyMaxScaleSlider.value;
                        bountyMaxScaleValue.textContent = `${value}x`;
                        GM_setValue('halloween_bounty_max_scale', value);
                        HalloweenDebug.log(1, `🔥 Bounty max scale set to ${value}x`);
                    });
                }

                // GLOW EFFECT SETTINGS
                const glowEnabledCheckbox = document.getElementById('bounty-glow-enabled');
                const glowSettings = document.getElementById('bounty-glow-settings');
                const glowColorPicker = document.getElementById('bounty-glow-color');
                const glowColorText = document.getElementById('bounty-glow-color-text');

                if (glowEnabledCheckbox && glowSettings) {
                    // Load saved glow settings
                    const savedGlowEnabled = GM_getValue('halloween_bounty_glow_enabled', 'true') === 'true';
                    const savedGlowColor = GM_getValue('halloween_bounty_glow_color', '#ff6b35');

                    glowEnabledCheckbox.checked = savedGlowEnabled;
                    glowSettings.style.display = savedGlowEnabled ? 'block' : 'none';

                    if (glowColorPicker) glowColorPicker.value = savedGlowColor;
                    if (glowColorText) glowColorText.value = savedGlowColor;

                    // Handle glow enabled/disabled toggle
                    glowEnabledCheckbox.addEventListener('change', () => {
                        const isEnabled = glowEnabledCheckbox.checked;
                        GM_setValue('halloween_bounty_glow_enabled', isEnabled ? 'true' : 'false');
                        glowSettings.style.display = isEnabled ? 'block' : 'none';
                        HalloweenDebug.log(1, `🔥 Bounty glow effect ${isEnabled ? 'enabled' : 'disabled'}`);
                    });

                    // Sync color picker and text input
                    if (glowColorPicker && glowColorText) {
                        glowColorPicker.addEventListener('input', () => {
                            glowColorText.value = glowColorPicker.value;
                            GM_setValue('halloween_bounty_glow_color', glowColorPicker.value);
                            HalloweenDebug.log(1, `🔥 Bounty glow color changed: ${glowColorPicker.value}`);
                        });

                        glowColorText.addEventListener('blur', () => {
                            const colorValue = glowColorText.value.trim();
                            if (colorValue === '') {
                                // Reset to default
                                glowColorPicker.value = '#ff6b35';
                                glowColorText.value = '#ff6b35';
                                GM_setValue('halloween_bounty_glow_color', '#ff6b35');
                                HalloweenDebug.log(1, '🔥 Bounty glow color reset to default: #ff6b35');
                            } else if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
                                // Valid hex color
                                glowColorPicker.value = colorValue;
                                GM_setValue('halloween_bounty_glow_color', colorValue);
                                HalloweenDebug.log(1, `🔥 Bounty glow color saved: ${colorValue}`);
                            } else {
                                // Invalid, restore previous value
                                glowColorText.value = glowColorPicker.value;
                            }
                        });
                    }
                }
            }
        },

        setupDefeatVerificationToggle: function() {
            const header = document.getElementById('defeat-verification-header');
            const content = document.getElementById('defeat-verification-content');
            const toggle = document.getElementById('defeat-verification-toggle');

            if (header && content && toggle) {
                // Start collapsed
                content.style.maxHeight = '0px';
                header.style.marginBottom = '0px';
                toggle.innerHTML = '&#9660;';

                header.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';

                    if (isExpanded) {
                        // Collapse
                        content.style.maxHeight = '0px';
                        header.style.marginBottom = '0px';
                        toggle.innerHTML = '&#9660;';
                        toggle.style.transform = 'rotate(0deg)';
                    } else {
                        // Expand
                        content.style.maxHeight = '300px'; // Increased to accommodate button
                        header.style.marginBottom = '8px';
                        toggle.innerHTML = '&#9650;';
                        toggle.style.transform = 'rotate(180deg)';
                    }
                });
            }

            // Set up API refresh link handler
            const refreshLink = document.getElementById('api-refresh-link');
            if (refreshLink) {
                // Add hover effects
                refreshLink.addEventListener('mouseenter', () => {
                    if (refreshLink.style.pointerEvents !== 'none') {
                        refreshLink.style.color = 'rgba(255, 255, 255, 0.8)';
                    }
                });
                refreshLink.addEventListener('mouseleave', () => {
                    refreshLink.style.color = 'rgba(255, 255, 255, 0.5)';
                });

                // Add click handler
                refreshLink.addEventListener('click', () => {
                    // Check if API mode is enabled
                    if (!GM_getValue('halloween_api_mode', false)) return;

                    // Check rate limiting (dynamic based on API testing mode)
                    const lastManualRefresh = GM_getValue('halloween_api_last_manual_refresh', 0);
                    const now = Date.now() / 1000;
                    const timeSinceLastRefresh = now - lastManualRefresh;
                    const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);
                    const cooldownSeconds = apiTestingMode ? 10 : 61; // 10s in testing, 61s in production

                    if (timeSinceLastRefresh < cooldownSeconds) {
                        // Still in cooldown period
                        const remainingSeconds = Math.ceil(cooldownSeconds - timeSinceLastRefresh);
                        const remainingMinutes = Math.ceil(remainingSeconds / 60);
                        this.showToast(`Please wait ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''} before refreshing again`, 'warning');
                        return;
                    }

                    // Update last manual refresh time
                    GM_setValue('halloween_api_last_manual_refresh', now);

                    // Show loading state
                    const originalText = refreshLink.textContent;
                    refreshLink.textContent = 'Refreshing...';
                    refreshLink.style.pointerEvents = 'none';
                    refreshLink.style.opacity = '0.5';

                    // Trigger refresh
                    HalloweenDebug.log(1, '🔄 Manual API refresh triggered by user');
                    if (typeof APIDefeatVerification !== 'undefined') {
                        APIDefeatVerification.refreshAttackLog();
                    }

                    // Show requested toast immediately
                    this.showToast('API update requested', 'info');

                    // Reset link state after 3 seconds
                    setTimeout(() => {
                        refreshLink.textContent = originalText;
                        refreshLink.style.pointerEvents = 'auto';
                        refreshLink.style.opacity = '1';
                        refreshLink.style.color = 'rgba(255, 255, 255, 0.5)';

                        // Update stats display
                        this.updateDefeatVerificationStats();
                    }, 3000);
                });
            }
        },

        showToast: function(message, type = 'info') {
            const toast = document.getElementById('api-refresh-toast');
            if (!toast) return;

            // Set colors based on type
            const colors = {
                success: { bg: 'rgba(0, 255, 0, 0.1)', border: 'rgba(0, 255, 0, 0.3)', text: '#00ff00' },
                warning: { bg: 'rgba(255, 165, 0, 0.1)', border: 'rgba(255, 165, 0, 0.3)', text: '#ffa500' },
                error: { bg: 'rgba(255, 0, 0, 0.1)', border: 'rgba(255, 0, 0, 0.3)', text: '#ff6666' },
                info: { bg: 'rgba(0, 255, 255, 0.1)', border: 'rgba(0, 255, 255, 0.3)', text: '#00ffff' }
            };

            const color = colors[type] || colors.info;

            // Style and show toast
            toast.style.background = color.bg;
            toast.style.border = `1px solid ${color.border}`;
            toast.style.color = color.text;
            toast.textContent = message;
            toast.style.display = 'block';
            toast.style.opacity = '1';

            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 300);
            }, 3000);
        },

        showDecryptionError: function() {
            this.showToast('Target page decryption error', 'error');
            HalloweenDebug.log(1, '🔮 Enchanted pages decryption failed after retries');
        },

        generatePlayerIdentitySection: function() {
            // Check if player ID is already set
            const playerId = GM_getValue('halloween_player_id', '');

            if (playerId) {
                // Player ID is set, don't show the input field
                return '';
            }

            // Player ID not set, show dual-mode enrollment
            return `
                <div id="player-identity-section" style="margin-bottom: 15px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.4); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">COMPETITION ENROLLMENT</div>

                    <!-- Mode Selection -->
                    <div style="margin-bottom: 0;">
                        <div style="font-size: 11px; color: #fff; margin-bottom: 10px; opacity: 0.8;">Choose enrollment method:</div>
                        <div style="display: flex; gap: 15px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="enrollment-mode" value="member-id" checked style="cursor: pointer;">
                                <span style="font-size: 11px; color: #fff;">Player ID</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                                <input type="radio" name="enrollment-mode" value="api-key" style="cursor: pointer;">
                                <span style="font-size: 11px; color: #fff;">API Key (Instant)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Mode Description (changes based on selection) -->
                    <div style="margin: 10px 0; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 4px; text-align: center;">
                        <div id="member-id-description" style="font-size: 9px; color: rgba(255, 255, 255, 0.7); display: block;">
                            30-90 second verification delay \u2022 Basic logs only
                        </div>
                        <div id="api-key-description" style="font-size: 9px; color: rgba(255, 255, 255, 0.7); display: none;">
                            Real-time verification \u2022 Bonus stats \u2022 Full Logs
                        </div>
                    </div>

                    <!-- Member ID Mode -->
                    <div id="member-id-mode" style="display: block;">
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="player-id-input" placeholder="Enter Player ID..." style="flex: 1; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #FFD700; border-radius: 4px; color: #fff; font-size: 11px;">
                            <button id="set-player-id" style="padding: 8px 12px; background: #FFD700; color: black; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">ENROLL</button>
                        </div>
                    </div>

                    <!-- API Key Mode -->
                    <div id="api-key-mode" style="display: none;">
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="api-key-input" placeholder="Enter API Key..." style="flex: 1; padding: 8px; background: rgba(0, 0, 0, 0.3); border: 1px solid #FFD700; border-radius: 4px; color: #fff; font-size: 11px;">
                            <button id="set-api-key" style="padding: 8px 12px; background: #FFD700; color: black; border: none; border-radius: 4px; font-size: 11px; font-weight: bold; cursor: pointer;">ENROLL</button>
                        </div>
                    </div>

                    <div style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255, 215, 0, 0.2); text-align: center;">
                        <span style="vertical-align: 1px; font-size: 12px;">&#9888;&#xFE0F;</span> API provides bonus stats - add now or connect later
                    </div>
                </div>
            `;
        },

        generateSwitchToAPILink: function() {
            // Only show if player is enrolled but not in API mode
            const playerId = GM_getValue('halloween_player_id', '');
            const apiMode = APIDefeatVerification.isAPIMode();

            if (!playerId || apiMode) {
                return ''; // Don't show if not enrolled or already in API mode
            }

            return `
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0, 255, 255, 0.2); text-align: center;">
                    <a id="switch-to-api-mode-link" style="
                        font-size: 11px;
                        color: #FFD700;
                        text-decoration: underline;
                        cursor: pointer;
                        opacity: 0.9;
                        transition: opacity 0.3s;
                    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.9'">
                        Switch to API Mode
                    </a>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.5); margin-top: 4px;">
                        Enable instant verification & bonus stats
                    </div>
                </div>
            `;
        },

        generateCollectiblesSection: function() {
            // Get current collectible counts
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = JSON.parse(collectibles);

            return `
                <!-- COLLECTIBLES FOUND Section (Member Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 14px; font-weight: bold; color: var(--carved-cyan);">COLLECTIBLES FOUND</span>
                        <span id="member-manifestations-status-link" style="font-size: 9px; color: var(--carved-cyan); cursor: pointer; text-decoration: none; opacity: 0.8;">Show Status</span>
                    </div>

                    <!-- Manifestations Countdown (hidden by default, shown in individual mode) -->
                    <div id="member-manifestations-countdown" style="display: none; margin-bottom: 10px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 6px; padding: 10px 15px; text-align: center;">
                        <span id="member-manifestations-countdown-text" style="font-weight: bold; color: var(--carved-cyan); font-size: 12px;">Ends in...</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; min-width: 0;">
                        <!-- Gold Collectible (Ultra Rare) -->
                        <div style="text-align: center; padding: 6px; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/67ffM1nP/Gold.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin: 6px 0;">${counts.gold || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #FFD700;">Gold</div>
                        </div>
                        <!-- Corrupt Collectible (Rare) -->
                        <div style="text-align: center; padding: 6px 5px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/FkpnKh7Z/Corrupt.png" style="width: 18px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #00FFFF; margin: 6px 0;">${counts.corrupt || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #00FFFF;">Corrupt</div>
                        </div>
                        <!-- Cyber Collectible (Uncommon) -->
                        <div style="text-align: center; padding: 6px; background: rgba(183, 148, 246, 0.1); border: 1px solid rgba(183, 148, 246, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/fdSK5bNM/Cyber.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #b794f6; margin: 6px 0;">${counts.cyber || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #b794f6;">Cyber</div>
                        </div>
                        <!-- Pure Collectible (Common) -->
                        <div style="text-align: center; padding: 6px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/Xf7FR9gP/Pure.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #FFFFFF; margin: 6px 0;">${counts.pure || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #FFFFFF;">Pure</div>
                        </div>
                        <!-- Candy Collectible (Most Common) -->
                        <div style="text-align: center; padding: 6px; background: rgba(243, 152, 186, 0.1); border: 1px solid rgba(243, 152, 186, 0.3); border-radius: 4px; min-width: 0; overflow: hidden;">
                            <img src="https://i.ibb.co/B5MKQf12/Candy.png" style="width: 16px; height: 16px; display: block; margin: 0 auto 2px;">
                            <div style="font-size: 14px; font-weight: bold; color: #f398ba; margin: 6px 0;">${counts.candy || 0}</div>
                            <div style="font-size: 8px; opacity: 0.7; color: #f398ba;">Candy</div>
                        </div>
                    </div>
                </div>

                <!-- BOUNTIES CLAIMED Section (Member Only - shown when bounties active) -->
                <div id="bounties-claimed-section" style="display: none; margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 12px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 8px;">BOUNTIES CLAIMED</div>
                    <div id="bounties-claimed-grid" style="display: flex; gap: 4px; flex-wrap: nowrap; justify-content: flex-start; margin-bottom: 10px;">
                        <!-- Bounty squares will be dynamically inserted here -->
                    </div>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.6); text-align: center;">
                        Bounties made by decree, check Discord for today's target
                    </div>
                </div>
            `;
        },

        generateBonusStatsSection: function() {
            // Only show bonus stats in API mode
            if (!APIDefeatVerification.isAPIMode()) {
                return '';
            }

            const bonusStats = APIDefeatVerification.getBonusStats();

            // Get refresh interval text
            const refreshInterval = APIDefeatVerification.getRefreshInterval();
            const refreshText = refreshInterval === 60 ? '60 seconds' : '5 minutes';

            // Get last attack timestamp
            const attacks = APIDefeatVerification.getAllAttacks();
            const attackValues = Object.values(attacks);
            let lastAttackText = 'No attacks yet';

            if (attackValues.length > 0) {
                const timestamps = attackValues.map(a => a.timestamp_started);
                const newestTimestamp = Math.max(...timestamps);
                const attackDate = new Date(newestTimestamp * 1000);

                // Format as GMT (TCT)
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                const attackDay = new Date(attackDate.getFullYear(), attackDate.getMonth(), attackDate.getDate());

                let dayLabel;
                if (attackDay.getTime() === today.getTime()) {
                    dayLabel = 'Today';
                } else if (attackDay.getTime() === yesterday.getTime()) {
                    dayLabel = 'Yesterday';
                } else {
                    dayLabel = attackDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }

                const timeStr = attackDate.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'GMT',
                    hour12: false
                });

                lastAttackText = `${dayLabel} at ${timeStr}`;
            }

            return `
                <!-- HALLOWEEK STATS Section (API Mode Only) -->
                <div style="margin-bottom: 15px; background: rgba(0, 255, 255, 0.1); border: 1px solid var(--carved-cyan); border-radius: 8px; padding: 15px;">
                    <div style="font-size: 14px; font-weight: bold; color: var(--carved-cyan); margin-bottom: 10px;">
                        <span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">📊</span> HALLOWEEK STATS <span style="font-size: 9px; opacity: 0.7;">(API Mode)</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); margin: 6px 0;" id="stat-competition-attacks">${bonusStats.totalAttacks}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Total Attacks</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); margin: 6px 0;" id="stat-unique-opponents">${bonusStats.uniqueOpponents}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Opponents</div>
                        </div>
                        <div style="text-align: center; padding: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 5px;">
                            <div style="font-size: 18px; font-weight: bold; color: var(--carved-cyan); margin: 6px 0;" id="stat-total-defeats">${bonusStats.totalDefeats}</div>
                            <div style="font-size: 10px; opacity: 0.8; color: #fff;">Defeated</div>
                        </div>
                    </div>
                    <div style="font-size: 9px; color: var(--carved-cyan); margin-top: 8px; text-align: center; padding: 8px 0 0 0; border-top: 1px solid rgba(0, 255, 255, 0.2);">
                        Last attack: ${lastAttackText}
                    </div>
                    <div style="font-size: 9px; color: rgba(255, 255, 255, 0.6); text-align: center; padding: 4px 0 0 0;">
                        Data from personal API logs \u2022 Updated every ${refreshText}
                    </div>
                </div>
            `;
        },

        setupTileImageHandler: function() {
            const tileImageInput = document.getElementById('halloween-tile-image');

            if (tileImageInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.tileImage) {
                    tileImageInput.value = currentConfig.tileImage;
                }

                // Auto-save on blur
                tileImageInput.addEventListener('blur', () => {
                    const tileUrl = tileImageInput.value.trim();

                    // Get current config and update just the tile image
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.tileImage = tileUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Apply the background if URL is provided
                    if (tileUrl && HalloweenUI.backgroundEnabled) {
                        FactionConfig.applyCustomBackground(tileUrl);
                        HalloweenDebug.log(2, '🎃 Background tile image auto-saved and applied');
                    }
                });
            }
        },

        setupFirebaseURLHandler: function() {
            const firebaseURLInput = document.getElementById('attack-logs-firebase-url');

            if (firebaseURLInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.attackLogsFirebaseURL) {
                    firebaseURLInput.value = currentConfig.attackLogsFirebaseURL;
                }

                // Auto-save on blur
                firebaseURLInput.addEventListener('blur', () => {
                    let firebaseURL = firebaseURLInput.value.trim();

                    // Remove trailing slash if present
                    if (firebaseURL.endsWith('/')) {
                        firebaseURL = firebaseURL.slice(0, -1);
                        firebaseURLInput.value = firebaseURL; // Update field display
                    }

                    // Get current config and update just the Firebase URL
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.attackLogsFirebaseURL = firebaseURL;
                    FactionConfig.setConfig(updatedConfig);

                    HalloweenDebug.log(2, '🎃 Attack Logs Firebase URL auto-saved:', firebaseURL);
                });
            }

            // RTDB Key handler
            const rtdbKeyInput = document.getElementById('rtdb-key');

            if (rtdbKeyInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                if (currentConfig.rtdbKey) {
                    rtdbKeyInput.value = currentConfig.rtdbKey;
                }

                // Auto-save on blur
                rtdbKeyInput.addEventListener('blur', () => {
                    const rtdbKey = rtdbKeyInput.value.trim();

                    // Get current config and update just the RTDB key
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.rtdbKey = rtdbKey;
                    FactionConfig.setConfig(updatedConfig);

                    HalloweenDebug.log(2, '🎃 RTDB Key auto-saved');
                });
            }
        },

        setupFactionIconHandler: function() {
            const iconInput = document.getElementById('halloween-icon-url');

            if (iconInput) {
                // Populate field with saved value OR default
                const currentConfig = FactionConfig.getConfig();
                const defaultIcon = 'https://i.ibb.co/fYD8KsYX/carved-king-250.png';
                iconInput.value = currentConfig.factionIcon || defaultIcon;

                // Auto-save on blur
                iconInput.addEventListener('blur', () => {
                    const iconUrl = iconInput.value.trim() || defaultIcon;

                    // Update config
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.factionIcon = iconUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Apply the icon immediately
                    FactionConfig.updateTriggerIcon(iconUrl);

                    HalloweenDebug.log(2, '🎃 Faction icon auto-saved and applied:', iconUrl);
                });
            }
        },

        setupPrimaryColorHandler: function() {
            const colorPicker = document.getElementById('halloween-primary-color');
            const colorText = document.getElementById('halloween-primary-color-text');
            const defaultColor = '#ff6b35';

            if (colorPicker && colorText) {
                // Populate fields with saved value
                const currentConfig = FactionConfig.getConfig();
                const savedColor = currentConfig.primaryColor || defaultColor;
                colorPicker.value = savedColor;
                colorText.value = savedColor;

                // Sync: Color picker input -> update text field
                colorPicker.addEventListener('input', () => {
                    colorText.value = colorPicker.value;
                });

                // Sync: Text field blur -> update picker and save
                colorText.addEventListener('blur', () => {
                    const textValue = colorText.value.trim();
                    let finalColor;

                    if (textValue === '') {
                        // Reset to default
                        finalColor = defaultColor;
                        colorPicker.value = defaultColor;
                        colorText.value = defaultColor;
                        HalloweenDebug.log(2, '🎃 Primary color reset to default:', defaultColor);
                    } else if (/^#[0-9A-F]{6}$/i.test(textValue)) {
                        // Valid hex color
                        finalColor = textValue;
                        colorPicker.value = textValue;
                        HalloweenDebug.log(2, '🎃 Primary color updated:', finalColor);
                    } else {
                        // Invalid - revert to current saved value
                        finalColor = currentConfig.primaryColor || defaultColor;
                        colorText.value = finalColor;
                        colorPicker.value = finalColor;
                        HalloweenDebug.log(2, '🎃 Invalid hex - reverted to saved:', finalColor);
                        return;
                    }

                    // Update config and apply
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.primaryColor = finalColor;
                    FactionConfig.setConfig(updatedConfig);
                    document.documentElement.style.setProperty('--halloween-primary', finalColor);
                });
            }
        },

        setupSecondaryColorHandler: function() {
            const colorPicker = document.getElementById('halloween-secondary-color');
            const colorText = document.getElementById('halloween-secondary-color-text');
            const defaultColor = '#f7931e';

            if (colorPicker && colorText) {
                // Populate fields with saved value
                const currentConfig = FactionConfig.getConfig();
                const savedColor = currentConfig.secondaryColor || defaultColor;
                colorPicker.value = savedColor;
                colorText.value = savedColor;

                // Sync: Color picker input -> update text field
                colorPicker.addEventListener('input', () => {
                    colorText.value = colorPicker.value;
                });

                // Sync: Text field blur -> update picker and save
                colorText.addEventListener('blur', () => {
                    const textValue = colorText.value.trim();
                    let finalColor;

                    if (textValue === '') {
                        // Reset to default
                        finalColor = defaultColor;
                        colorPicker.value = defaultColor;
                        colorText.value = defaultColor;
                        HalloweenDebug.log(2, '🎃 Secondary color reset to default:', defaultColor);
                    } else if (/^#[0-9A-F]{6}$/i.test(textValue)) {
                        // Valid hex color
                        finalColor = textValue;
                        colorPicker.value = textValue;
                        HalloweenDebug.log(2, '🎃 Secondary color updated:', finalColor);
                    } else {
                        // Invalid - revert to current saved value
                        finalColor = currentConfig.secondaryColor || defaultColor;
                        colorText.value = finalColor;
                        colorPicker.value = finalColor;
                        HalloweenDebug.log(2, '🎃 Invalid hex - reverted to saved:', finalColor);
                        return;
                    }

                    // Update config and apply
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.secondaryColor = finalColor;
                    FactionConfig.setConfig(updatedConfig);
                    document.documentElement.style.setProperty('--halloween-secondary', finalColor);
                });
            }
        },

        setupMenuPanelImageHandler: function() {
            const iconRadio = document.getElementById('menu-panel-icon');
            const bannerRadio = document.getElementById('menu-panel-banner');
            const iconUrlField = document.getElementById('icon-url-field');
            const bannerUrlField = document.getElementById('banner-url-field');

            if (iconRadio && bannerRadio && iconUrlField && bannerUrlField) {
                // Load saved settings
                const currentConfig = FactionConfig.getConfig();
                const currentMode = currentConfig.menuPanelImage || 'icon';

                // Apply saved settings and show correct field
                if (currentMode === 'banner') {
                    bannerRadio.checked = true;
                    iconUrlField.style.display = 'none';
                    bannerUrlField.style.display = 'block';
                } else {
                    iconRadio.checked = true;
                    iconUrlField.style.display = 'block';
                    bannerUrlField.style.display = 'none';
                }

                // Handle Icon radio selection
                iconRadio.addEventListener('change', () => {
                    if (iconRadio.checked) {
                        iconUrlField.style.display = 'block';
                        bannerUrlField.style.display = 'none';

                        // Update config
                        const updatedConfig = FactionConfig.getConfig();
                        updatedConfig.menuPanelImage = 'icon';
                        FactionConfig.setConfig(updatedConfig);

                        // Refresh menu to show icon mode
                        HalloweenMenu.updateMenuContent();

                        HalloweenDebug.log(2, '🎃 Menu panel image mode set to icon');
                    }
                });

                // Handle Banner radio selection
                bannerRadio.addEventListener('change', () => {
                    if (bannerRadio.checked) {
                        iconUrlField.style.display = 'none';
                        bannerUrlField.style.display = 'block';

                        // Update config
                        const updatedConfig = FactionConfig.getConfig();
                        updatedConfig.menuPanelImage = 'banner';
                        FactionConfig.setConfig(updatedConfig);

                        // Refresh menu to show banner mode
                        HalloweenMenu.updateMenuContent();

                        HalloweenDebug.log(2, '🎃 Menu panel image mode set to banner');
                    }
                });
            }
        },

        setupFactionBannerHandler: function() {
            const bannerInput = document.getElementById('halloween-banner-url');
            if (bannerInput) {
                // Populate field with saved value
                const currentConfig = FactionConfig.getConfig();
                bannerInput.value = currentConfig.factionBanner || '';

                // Auto-save on blur
                bannerInput.addEventListener('blur', () => {
                    const bannerUrl = bannerInput.value.trim();

                    // Update config
                    const updatedConfig = FactionConfig.getConfig();
                    updatedConfig.factionBanner = bannerUrl;
                    FactionConfig.setConfig(updatedConfig);

                    // Refresh menu if banner mode is active
                    if (updatedConfig.menuPanelImage === 'banner') {
                        HalloweenMenu.updateMenuContent();
                    }

                    HalloweenDebug.log(2, '🎃 Faction banner auto-saved:', bannerUrl);
                });
            }
        },

        setupPlayerIdentityHandlers: function() {
            // Setup radio button toggles
            const radioButtons = document.querySelectorAll('input[name="enrollment-mode"]');
            const memberIdMode = document.getElementById('member-id-mode');
            const apiKeyMode = document.getElementById('api-key-mode');
            const memberIdDescription = document.getElementById('member-id-description');
            const apiKeyDescription = document.getElementById('api-key-description');

            radioButtons.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'member-id') {
                        memberIdMode.style.display = 'block';
                        apiKeyMode.style.display = 'none';
                        memberIdDescription.style.display = 'block';
                        apiKeyDescription.style.display = 'none';
                    } else {
                        memberIdMode.style.display = 'none';
                        apiKeyMode.style.display = 'block';
                        memberIdDescription.style.display = 'none';
                        apiKeyDescription.style.display = 'block';
                    }
                });
            });

            // ===================================
            // MEMBER ID MODE HANDLER
            // ===================================
            const setPlayerIdBtn = document.getElementById('set-player-id');
            const playerIdInput = document.getElementById('player-id-input');

            if (setPlayerIdBtn && playerIdInput) {
                setPlayerIdBtn.addEventListener('click', () => {
                    const playerId = playerIdInput.value.trim();
                    if (playerId.length >= 3) {
                        // Save the player ID and enrollment timestamp
                        GM_setValue('halloween_player_id', playerId);
                        GM_setValue('halloween_enrollment_timestamp', Math.floor(Date.now() / 1000));
                        HalloweenDebug.log(1, `🎃 Player ID set: ${playerId}`);

                        // Hide the identity section
                        const identitySection = document.getElementById('player-identity-section');
                        if (identitySection) {
                            identitySection.style.display = 'none';
                        }

                        // Show success message
                        this.showEnrollmentSuccess(`Player ID "${playerId}" enrolled! Using Firebase verification.`);
                    } else {
                        alert('Player ID must be at least 3 characters long');
                    }
                });

                // Allow Enter key to submit
                playerIdInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        setPlayerIdBtn.click();
                    }
                });
            }

            // ===================================
            // API KEY MODE HANDLER
            // ===================================
            const setApiKeyBtn = document.getElementById('set-api-key');
            const apiKeyInput = document.getElementById('api-key-input');

            if (setApiKeyBtn && apiKeyInput) {
                setApiKeyBtn.addEventListener('click', async () => {
                    const apiKey = apiKeyInput.value.trim();

                    if (apiKey.length < 10) {
                        alert('Please enter a valid API key');
                        return;
                    }

                    // Disable button and show loading
                    setApiKeyBtn.disabled = true;
                    setApiKeyBtn.textContent = 'VALIDATING...';

                    try {
                        // Validate API key and enable API mode
                        const result = await APIDefeatVerification.enableAPIMode(apiKey);

                        if (result.success) {
                            // Save player ID (from API validation)
                            GM_setValue('halloween_player_id', result.playerId.toString());

                            HalloweenDebug.log(1, `🎃 API Mode enabled for ${result.playerName} [${result.playerId}]`);

                            // Show competition time picker
                            this.showCompetitionTimePicker(result.playerName, result.playerId);
                        } else {
                            // Show error
                            alert(`API Validation Failed: ${result.error}`);
                            setApiKeyBtn.disabled = false;
                            setApiKeyBtn.textContent = 'ENROLL';
                        }
                    } catch (error) {
                        alert(`Error: ${error.message}`);
                        setApiKeyBtn.disabled = false;
                        setApiKeyBtn.textContent = 'ENROLL';
                    }
                });

                // Allow Enter key to submit
                apiKeyInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        setApiKeyBtn.click();
                    }
                });
            }
        },

        showCompetitionTimePicker: function(playerName, playerId) {
            // Generate time options (10:00 to 16:00 TCT in 15-min intervals)
            const timeOptions = [];
            for (let hour = 10; hour <= 16; hour++) {
                for (let minute = 0; minute < 60; minute += 15) {
                    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    timeOptions.push(timeStr);
                    if (hour === 16 && minute === 0) break; // Stop at 16:00
                }
            }

            // Replace enrollment panel content with time picker
            const identitySection = document.getElementById('player-identity-section');
            if (!identitySection) return;

            identitySection.innerHTML = `
                <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 10px;">COMPETITION START TIME</div>

                <div style="font-size: 11px; color: #fff; margin-bottom: 12px; opacity: 0.9; line-height: 1.4;">
                    Select when the Halloween competition starts for you.<br>
                    Competition runs: Oct 25 - Nov 1, 2025
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11px; color: #fff; margin-bottom: 6px; opacity: 0.8;">Start Time (TCT)</label>
                    <select id="competition-start-time-select" style="
                        width: 100%;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        border: 1px solid #FFD700;
                        border-radius: 4px;
                        color: #fff;
                        font-size: 11px;
                        cursor: pointer;
                    ">
                        ${timeOptions.map(time => `
                            <option value="${time}" ${time === '14:00' ? 'selected' : ''}>${time} TCT</option>
                        `).join('')}
                    </select>
                </div>

                <button id="confirm-competition-time" style="
                    width: 100%;
                    padding: 10px;
                    background: #FFD700;
                    color: black;
                    border: none;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                ">CONFIRM START TIME</button>
            `;

            // Handle confirm button
            const confirmBtn = document.getElementById('confirm-competition-time');
            const timeSelect = document.getElementById('competition-start-time-select');

            confirmBtn.addEventListener('click', () => {
                const selectedTime = timeSelect.value;
                const [hours, minutes] = selectedTime.split(':').map(Number);

                // Calculate competition timestamps (Oct 25 - Nov 1, 2025 at selected time)
                const startTimestamp = Math.floor(Date.UTC(2025, 9, 25, hours, minutes, 0) / 1000); // Oct = month 9
                const endTimestamp = Math.floor(Date.UTC(2025, 10, 1, hours, minutes, 0) / 1000);   // Nov = month 10

                // Save timestamps
                GM_setValue('halloween_competition_start_timestamp', startTimestamp);
                GM_setValue('halloween_competition_end_timestamp', endTimestamp);
                GM_setValue('halloween_enrollment_timestamp', Math.floor(Date.now() / 1000));

                HalloweenDebug.log(1, `🎃 Competition times set: ${selectedTime} TCT (${startTimestamp} - ${endTimestamp})`);

                // Replace enrollment section content with success notification
                identitySection.innerHTML = `
                    <div style="
                        background: rgba(255, 215, 0, 0.1);
                        border: 1px solid rgba(255, 215, 0, 0.4);
                        border-radius: 8px;
                        padding: 15px;
                        text-align: center;
                    ">
                        <div style="font-size: 14px; font-weight: bold; color: #FFD700; margin-bottom: 8px;">ENROLLMENT COMPLETE</div>
                        <div style="font-size: 12px; color: #fff;">Good Luck ${playerName}!</div>
                    </div>
                `;

                // Rebuild menu after 5 seconds to show enrolled state
                setTimeout(() => {
                    this.updateMenuContent();
                }, 5000);
            });
        },


        setupSwitchToAPIHandler: function() {
            const switchLink = document.getElementById('switch-to-api-mode-link');

            if (switchLink) {
                switchLink.addEventListener('click', async () => {
                    const currentPlayerId = GM_getValue('halloween_player_id', '');

                    // Show API key input dialog
                    const apiKey = prompt('Enter your Torn API Key to enable API Mode:');

                    if (!apiKey) {
                        return; // User cancelled
                    }

                    try {
                        // Validate API key
                        const result = await APIDefeatVerification.validateAPIKey(apiKey);

                        // Check if API key belongs to the same player
                        if (result.player_id.toString() !== currentPlayerId) {
                            alert(`Error: This API key belongs to player ${result.name} [${result.player_id}], but you're enrolled as player ID ${currentPlayerId}.\n\nPlease use your own API key.`);
                            return;
                        }

                        // API key is valid and matches! Enable API mode
                        await APIDefeatVerification.enableAPIMode(apiKey);

                        HalloweenDebug.log(1, `🎃 Switched to API Mode for ${result.name} [${result.player_id}]`);

                        // Show competition time picker
                        this.showCompetitionTimePicker(result.name, result.player_id);

                    } catch (error) {
                        alert(`API Validation Failed: ${error.message}`);
                    }
                });
            }
        },

        setupResetHandlers: function() {
            const resetTrigger = document.getElementById('reset-script-trigger');
            const resetConfirmation = document.getElementById('reset-confirmation');
            const resetSettingsBtn = document.getElementById('reset-settings');
            const resetAllBtn = document.getElementById('reset-all');
            const cancelReset = document.getElementById('cancel-reset');

            if (resetTrigger && resetConfirmation) {
                resetTrigger.addEventListener('click', () => {
                    resetConfirmation.style.display = resetConfirmation.style.display === 'none' ? 'block' : 'none';
                });
            }

            // COMMENTED OUT: Reset Settings Only (UI preferences can be toggled manually)
            /*
            if (resetSettingsBtn) {
                resetSettingsBtn.addEventListener('click', () => {
                    // Clear UI preferences only
                    GM_deleteValue('halloween_sound_enabled');
                    GM_deleteValue('halloween_background');
                    GM_deleteValue('halloween_menu_position');
                    GM_deleteValue('halloween_ticker_duration');
                    GM_deleteValue('halloween_ticker_frequency');
                    GM_deleteValue('halloween_ticker_color');
                    GM_deleteValue('halloween_announcements');
                    GM_deleteValue('halloween_effect_type');
                    GM_deleteValue('halloween_custom_image_url');
                    GM_deleteValue('halloween_effect_counter');
                    GM_deleteValue('halloween_tile_image');
                    GM_deleteValue('halloween_faction_name');
                    GM_deleteValue('halloween_faction_config');
                    GM_deleteValue('halloween_manual_import_done');

                    HalloweenDebug.log(1, '🎃 Settings cleared - competition data preserved');

                    // Show notification in reset box
                    if (resetConfirmation) {
                        resetConfirmation.innerHTML = `
                            <div style="
                                background: rgba(255, 0, 0, 0.1);
                                border: 1px solid rgba(255, 0, 0, 0.3);
                                border-radius: 4px;
                                padding: 15px;
                                text-align: center;
                            ">
                                <div style="font-size: 12px; font-weight: bold; color: #ffa500; margin-bottom: 6px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⚙️ SETTINGS RESET</div>
                                <div style="font-size: 11px; color: #fff;">Competition data preserved</div>
                            </div>
                        `;
                    }

                    // Reload the page after notification
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
            }
            */

            // Reset All (complete wipe)
            if (resetAllBtn) {
                resetAllBtn.addEventListener('click', () => {
                    // Clear ALL Halloween data
                    GM_deleteValue('halloween_player_id');
                    GM_deleteValue('halloween_collectibles');
                    GM_deleteValue('halloween_targets_cache_encrypted');
                    GM_deleteValue('halloween_targets_seed_encrypted');
                    GM_deleteValue('halloween_encounters');

                    // Clear competition data
                    GM_deleteValue('halloween_defeats_counted');
                    GM_deleteValue('halloween_verify_queue');
                    GM_deleteValue('halloween_verify_failed');
                    GM_deleteValue('halloween_defeats_unverified');

                    // Clear API mode data
                    GM_deleteValue('halloween_api_mode');
                    GM_deleteValue('halloween_api_key');
                    GM_deleteValue('halloween_api_member_id');
                    GM_deleteValue('halloween_api_member_name');
                    GM_deleteValue('halloween_api_start_timestamp');
                    GM_deleteValue('halloween_api_last_refresh');
                    GM_deleteValue('halloween_api_all_attacks');
                    GM_deleteValue('halloween_api_pending_verifications');
                    GM_deleteValue('halloween_api_last_saved_timestamp');
                    GM_deleteValue('halloween_api_testing_mode');
                    GM_deleteValue('halloween_api_final_sweep_done');
                    GM_deleteValue('halloween_api_last_manual_refresh');
                    GM_deleteValue('halloween_enrollment_timestamp');
                    GM_deleteValue('halloween_competition_start_timestamp');
                    GM_deleteValue('halloween_competition_end_timestamp');
                    GM_deleteValue('halloween_competition_ended');
                    GM_deleteValue('halloween_treats_last_check');
                    GM_deleteValue('halloween_spooky_targets_end_shown');

                    // Clear seed/target data
                    GM_deleteValue('halloween_seed');
                    GM_deleteValue('halloween_leader_seed');
                    GM_deleteValue('halloween_animation_cache');

                    // Clear spooky competition dates
                    GM_deleteValue('halloween_spooky_start_date');
                    GM_deleteValue('halloween_spooky_start_time');
                    GM_deleteValue('halloween_spooky_end_date');
                    GM_deleteValue('halloween_spooky_end_time');
                    GM_deleteValue('halloween_spooky_targets_active');
                    GM_deleteValue('halloween_spooky_testing_mode');
                    GM_deleteValue('halloween_spawn_schedule');

                    // Clear UI preferences
                    GM_deleteValue('halloween_sound_enabled');
                    GM_deleteValue('halloween_background');
                    GM_deleteValue('halloween_menu_position');
                    GM_deleteValue('halloween_announcements');
                    GM_deleteValue('halloween_ticker_duration');
                    GM_deleteValue('halloween_ticker_frequency');
                    GM_deleteValue('halloween_ticker_color');
                    GM_deleteValue('halloween_effect_type');
                    GM_deleteValue('halloween_custom_image_url');
                    GM_deleteValue('halloween_effect_counter');
                    GM_deleteValue('halloween_tile_image');
                    GM_deleteValue('halloween_faction_name');
                    GM_deleteValue('halloween_faction_config');
                    GM_deleteValue('halloween_manual_import_done');

                    HalloweenDebug.log(1, '🎃 All Halloween data cleared - performing hard reset');

                    // Show notification in reset box
                    if (resetConfirmation) {
                        resetConfirmation.innerHTML = `
                            <div style="
                                background: rgba(255, 0, 0, 0.1);
                                border: 1px solid rgba(255, 0, 0, 0.3);
                                border-radius: 4px;
                                padding: 15px;
                                text-align: center;
                            ">
                                <div style="font-size: 12px; font-weight: bold; color: #ff4444; margin-bottom: 6px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🔥 COMPLETE RESET</div>
                                <div style="font-size: 11px; color: #fff;">All data cleared</div>
                            </div>
                        `;
                    }

                    // Reload the page after notification
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                });
            }

            if (cancelReset && resetConfirmation) {
                cancelReset.addEventListener('click', () => {
                    resetConfirmation.style.display = 'none';
                });
            }
        },

        populateAnnouncementFields: function() {
            const container = document.getElementById('halloween-announcements-list');
            if (!container) return;

            container.innerHTML = '';

            // Ensure we have at least 3 fields
            while (this.halloweenAnnouncements.length < 3) {
                this.halloweenAnnouncements.push({ message: '', enabled: false });
            }

            this.halloweenAnnouncements.forEach((announcement, index) => {
                const field = this.createAnnouncementField(announcement, index);
                container.appendChild(field);
            });
        },

        createAnnouncementField: function(announcement, index) {
            const field = document.createElement('div');
            field.style.cssText = 'display: flex; gap: 8px; margin-bottom: 6px; align-items: center;';
            field.setAttribute('data-announcement-index', index);

            field.innerHTML = `
                <input type="text"
                       class="announcement-input"
                       value="${announcement.message}"
                       placeholder="🎃 Enter spooky message..."
                       style="flex: 1; padding: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--carved-magenta); border-radius: 4px; color: #fff; font-size: 10px;">
                <input type="checkbox"
                       class="announcement-checkbox"
                       ${announcement.enabled ? 'checked' : ''}
                       style="transform: scale(1.2); cursor: pointer;">
            `;

            return field;
        },

        attachAnnouncementListeners: function() {
            // Add Message button
            const addBtn = document.getElementById('add-announcement');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    this.addAnnouncementField();
                });
            }

            // Input and checkbox listeners (delegated to container)
            const container = document.getElementById('halloween-announcements-list');
            if (container) {
                container.addEventListener('input', (e) => {
                    if (e.target.classList.contains('announcement-input')) {
                        this.updateAnnouncement(e.target);
                    }
                });

                container.addEventListener('change', (e) => {
                    if (e.target.classList.contains('announcement-checkbox')) {
                        this.updateAnnouncement(e.target);
                    }
                });
            }

            // Ticker timing controls
            const durationInput = document.getElementById('ticker-duration');
            const frequencyInput = document.getElementById('ticker-frequency');
            const colorInput = document.getElementById('ticker-color');

            if (durationInput) {
                durationInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }

            if (frequencyInput) {
                frequencyInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }

            if (colorInput) {
                colorInput.addEventListener('change', () => {
                    this.saveTickerSettings();
                });
            }
        },

        addAnnouncementField: function() {
            this.halloweenAnnouncements.push({ message: '', enabled: false });
            this.populateAnnouncementFields();
            this.saveHalloweenAnnouncements();
        },

        updateAnnouncement: function(element) {
            const field = element.closest('[data-announcement-index]');
            if (!field) return;

            const index = parseInt(field.getAttribute('data-announcement-index'));
            const input = field.querySelector('.announcement-input');
            const checkbox = field.querySelector('.announcement-checkbox');

            if (this.halloweenAnnouncements[index]) {
                this.halloweenAnnouncements[index].message = input.value;
                this.halloweenAnnouncements[index].enabled = checkbox.checked;
                this.saveHalloweenAnnouncements();
            }
        },

        cleanupEmptyAnnouncements: function() {
            // Remove empty announcements, but keep at least 3 fields
            const nonEmpty = this.halloweenAnnouncements.filter(ann => ann.message.trim() !== '');

            // Keep empty fields to maintain at least 3 total
            while (nonEmpty.length < 3) {
                nonEmpty.push({ message: '', enabled: false });
            }

            this.halloweenAnnouncements = nonEmpty;
            this.saveHalloweenAnnouncements();
            this.populateAnnouncementFields();
        },

        // MANIFESTATIONS (Competition Management) Functions
        initManifestations: function() {
            // Load competition settings
            this.loadCompetitionSettings();

            // Setup event handlers
            this.setupManifestationsHandlers();
            this.setupSpookyHandlers();
            this.setupMemberStatusHandlers();

            // Initialize countdown timer
            this.startCountdownTimer();

            // Update UI with current settings
            this.updateManifestationsUI();

            // Update countdown displays
            this.updateCountdownDisplay();
            this.updateSpookyTargetsCountdown();
            this.updateMemberCountdowns();

            HalloweenDebug.log(2, '🔮 Manifestations system initialized');
        },

        loadCompetitionSettings: function() {
            // Load settings from GM storage with defaults
            this.competitionSettings = {
                active: GM_getValue('halloween_competition_active', false),
                startDate: GM_getValue('halloween_competition_start_date', ''),
                startTime: GM_getValue('halloween_competition_start_time', '18:00'),
                duration: GM_getValue('halloween_competition_duration', 7),
                testingMode: GM_getValue('halloween_testing_mode', 'false') === 'true',
                testingDisplay: GM_getValue('halloween_testing_display', 'single'),
                testingTestPagesOnly: GM_getValue('halloween_testing_test_pages_only', false),
                testingRespawnAllowed: GM_getValue('halloween_testing_respawn_allowed', true),
                collectionsFirebaseURL: FactionConfig.getConfig().collectionsFirebaseURL || '',
                enchantedPages: []
            };

            // Load enchanted pages (leaders from plain storage, members from encrypted)
            if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                const plainPages = GM_getValue('halloween_enchanted_pages', '[]');
                try {
                    this.competitionSettings.enchantedPages = JSON.parse(plainPages);
                    HalloweenDebug.log(2, `🔮 Loaded ${this.competitionSettings.enchantedPages.length} enchanted pages (plain)`);
                } catch (e) {
                    HalloweenDebug.log(2, `🔮 Failed to parse enchanted pages: ${e.message}`);
                    this.competitionSettings.enchantedPages = [];
                }
            } else {
                const encryptedPages = GM_getValue('halloween_enchanted_pages_encrypted', '');
                if (encryptedPages) {
                    const memberSeed = SeedManager.getSeed('enchanted-pages-load');
                    const decryptResult = StorageCrypto.decryptEnchantedPages(encryptedPages, memberSeed);

                    // Handle async decryption (with retries)
                    if (decryptResult && typeof decryptResult.then === 'function') {
                        decryptResult.then(pages => {
                            if (pages) {
                                this.competitionSettings.enchantedPages = pages;
                                HalloweenDebug.log(2, `🔮 Decrypted ${pages.length} enchanted pages`);
                            } else {
                                this.competitionSettings.enchantedPages = [];
                                this.showDecryptionError();
                            }
                        });
                    } else if (decryptResult) {
                        this.competitionSettings.enchantedPages = decryptResult;
                        HalloweenDebug.log(2, `🔮 Decrypted ${decryptResult.length} enchanted pages`);
                    } else {
                        this.competitionSettings.enchantedPages = [];
                        this.showDecryptionError();
                    }
                }
            }

            // Update HalloweenCompetition settings
            if (typeof HalloweenCompetition !== 'undefined') {
                HalloweenCompetition.TESTING_MODE = this.competitionSettings.testingMode;
                HalloweenCompetition.TESTING_DISPLAY = this.competitionSettings.testingDisplay;
                HalloweenCompetition.USE_TEST_PAGES_ONLY = this.competitionSettings.testingTestPagesOnly;
                // Invalidate page pool cache when settings change
                HalloweenCompetition._cachedPagePool = null;
                HalloweenCompetition._pagePoolCacheKey = null;
                HalloweenDebug.log(2, `🔮 Competition settings loaded - Testing Mode: ${this.competitionSettings.testingMode}, Display: ${this.competitionSettings.testingDisplay}, Test Pages Only: ${this.competitionSettings.testingTestPagesOnly}, Active: ${this.competitionSettings.active}`);
            }
        },

        saveCompetitionSettings: function() {
            GM_setValue('halloween_competition_active', this.competitionSettings.active);
            GM_setValue('halloween_competition_start_date', this.competitionSettings.startDate);
            GM_setValue('halloween_competition_start_time', this.competitionSettings.startTime);
            GM_setValue('halloween_competition_duration', this.competitionSettings.duration);
            GM_setValue('halloween_testing_mode', this.competitionSettings.testingMode.toString());
            GM_setValue('halloween_testing_display', this.competitionSettings.testingDisplay);
            GM_setValue('halloween_testing_test_pages_only', this.competitionSettings.testingTestPagesOnly);
            GM_setValue('halloween_testing_respawn_allowed', this.competitionSettings.testingRespawnAllowed);
            FactionConfig.setConfig({ collectionsFirebaseURL: this.competitionSettings.collectionsFirebaseURL });

            // Save enchanted pages
            if (this.competitionSettings.enchantedPages) {
                if (typeof MASTER_LEADER_KEY !== 'undefined' && MASTER_LEADER_KEY) {
                    GM_setValue('halloween_enchanted_pages', JSON.stringify(this.competitionSettings.enchantedPages));
                } else {
                    HalloweenDebug.log(2, `🔮 Member mode: enchanted pages not saved to plain storage`);
                }
            }

            // Update HalloweenCompetition settings
            if (typeof HalloweenCompetition !== 'undefined') {
                HalloweenCompetition.TESTING_MODE = this.competitionSettings.testingMode;
                HalloweenCompetition.TESTING_DISPLAY = this.competitionSettings.testingDisplay;
                HalloweenCompetition.USE_TEST_PAGES_ONLY = this.competitionSettings.testingTestPagesOnly;
                // Invalidate page pool cache when settings change
                HalloweenCompetition._cachedPagePool = null;
                HalloweenCompetition._pagePoolCacheKey = null;
            }

            HalloweenDebug.log(3, '🔮 Competition settings saved');
        },

        setupManifestationsHandlers: function() {
            // Competition Active Toggle
            const competitionToggle = document.getElementById('competition-active-toggle');
            if (competitionToggle) {
                competitionToggle.addEventListener('change', () => {
                    this.competitionSettings.active = competitionToggle.checked;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Start Date
            const startDateInput = document.getElementById('competition-start-date');
            if (startDateInput) {
                startDateInput.addEventListener('change', () => {
                    this.competitionSettings.startDate = startDateInput.value;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Start Time
            const startTimeInput = document.getElementById('competition-start-time');
            if (startTimeInput) {
                startTimeInput.addEventListener('change', () => {
                    this.competitionSettings.startTime = startTimeInput.value;
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Competition Duration
            const durationSelect = document.getElementById('competition-duration');
            if (durationSelect) {
                durationSelect.addEventListener('change', () => {
                    this.competitionSettings.duration = parseInt(durationSelect.value);
                    this.saveCompetitionSettings();
                    this.updateCountdownDisplay();
                });
            }

            // Testing Mode Toggle
            const testingToggle = document.getElementById('testing-mode-toggle');
            if (testingToggle) {
                testingToggle.addEventListener('change', () => {
                    this.competitionSettings.testingMode = testingToggle.checked;

                    // When enabling testing mode, keep the saved testingDisplay setting
                    // (Don't override - respect user's previous choice)

                    this.saveCompetitionSettings();
                    this.updateManifestationsUI();
                    this.updateCountdownDisplay();
                    this.toggleTestingDisplayVisibility();

                    // Refresh spawns to show/hide pumpkins based on testing mode
                    if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.refreshSpawns) {
                        HalloweenCompetition.refreshSpawns();
                    }

                    HalloweenDebug.log(2, `🔮 Testing mode toggled: ${testingToggle.checked}`);
                });
            }

            // Testing Display Mode Radio Buttons
            const testingDisplayRadios = document.querySelectorAll('input[name="testing-display"]');
            testingDisplayRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.checked) {
                        this.competitionSettings.testingDisplay = radio.value;
                        this.saveCompetitionSettings();
                        // Refresh spawns with new display mode
                        if (typeof HalloweenCompetition !== 'undefined' && HalloweenCompetition.refreshSpawns) {
                            HalloweenCompetition.refreshSpawns();
                        }
                        HalloweenDebug.log(2, `🔮 Testing display mode changed to: ${radio.value}`);
                    }
                });
            });

            // Testing Test Pages Only Toggle
            const testPagesOnlyToggle = document.getElementById('testing-test-pages-only');
            if (testPagesOnlyToggle) {
                testPagesOnlyToggle.addEventListener('change', () => {
                    this.competitionSettings.testingTestPagesOnly = testPagesOnlyToggle.checked;
                    this.saveCompetitionSettings();
                    // Update HalloweenCompetition setting
                    if (typeof HalloweenCompetition !== 'undefined') {
                        HalloweenCompetition.USE_TEST_PAGES_ONLY = testPagesOnlyToggle.checked;
                        // Invalidate page pool cache when settings change
                        HalloweenCompetition._cachedPagePool = null;
                        HalloweenCompetition._pagePoolCacheKey = null;
                        // Regenerate schedule with new page pool
                        if (HalloweenCompetition.TESTING_MODE) {
                            HalloweenCompetition.generateSpawnSchedule();
                            HalloweenCompetition.refreshSpawns();
                        }
                    }
                    HalloweenDebug.log(2, `🔮 Testing test pages only: ${testPagesOnlyToggle.checked}`);
                });
            }

            // Testing Respawn Allowed Toggle
            const respawnToggle = document.getElementById('testing-respawn-allowed');
            if (respawnToggle) {
                respawnToggle.addEventListener('change', () => {
                    this.competitionSettings.testingRespawnAllowed = respawnToggle.checked;
                    this.saveCompetitionSettings();
                    HalloweenDebug.log(2, `🔮 Testing respawn allowed: ${respawnToggle.checked}`);
                });
            }

            // Collections Firebase URL
            const collectionsURLInput = document.getElementById('collections-firebase-url');
            if (collectionsURLInput) {
                collectionsURLInput.addEventListener('blur', () => {
                    let collectionsURL = collectionsURLInput.value.trim();

                    // Remove trailing slash if present
                    if (collectionsURL.endsWith('/')) {
                        collectionsURL = collectionsURL.slice(0, -1);
                        collectionsURLInput.value = collectionsURL; // Update field display
                    }

                    this.competitionSettings.collectionsFirebaseURL = collectionsURL;
                    this.saveCompetitionSettings();
                    HalloweenDebug.log(2, `🎃 Collections Firebase URL saved: ${collectionsURL}`);
                });
            }

            // Enchanted pages listeners are now handled by reattachManifestationsListeners()
            // (called every time menu opens to handle DOM rebuild)
        },

        renderEnchantedPages: function() {
            const rowsContainer = document.getElementById('enchanted-pages-rows');
            if (!rowsContainer) return;

            // Clear existing rows
            rowsContainer.innerHTML = '';

            // Initialize array if doesn't exist
            if (!this.competitionSettings.enchantedPages) {
                this.competitionSettings.enchantedPages = [];
            }

            // Render each saved page
            this.competitionSettings.enchantedPages.forEach((page, index) => {
                const row = this.renderEnchantedPageRow(page, index);
                rowsContainer.appendChild(row);
            });

            HalloweenDebug.log(2, `🔮 Rendered ${this.competitionSettings.enchantedPages.length} enchanted page rows`);
        },

        renderEnchantedPageRow: function(pageData, index) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';

            // URL input
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.value = pageData.url || '';
            urlInput.placeholder = 'Enter page URL...';
            urlInput.style.cssText = 'flex: 1; min-width: 0; padding: 6px 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 0, 139, 0.5); border-radius: 4px; color: #fff; font-size: 11px; direction: rtl;';

            // Auto-save on blur
            urlInput.addEventListener('blur', () => {
                this.competitionSettings.enchantedPages[index].url = urlInput.value.trim();
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Saved enchanted page URL [${index}]: ${urlInput.value.trim()}`);

                // Regenerate spawn schedule with updated URL
                if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                    GM_deleteValue('halloween_spawn_schedule');
                    HalloweenCompetition.generateSpawnSchedule();
                    HalloweenCompetition.refreshSpawns();
                    HalloweenDebug.log(2, '🔮 Spawn schedule regenerated after URL change');
                }
            });

            // Match type dropdown
            const matchTypeSelect = document.createElement('select');
            matchTypeSelect.style.cssText = 'padding: 6px; margin-right: 6px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(139, 0, 139, 0.5); border-radius: 4px; color: #fff; font-size: 11px; cursor: pointer;';

            const matchTypes = [
                { value: 'exact', label: 'Exact' },
                { value: 'contains', label: 'Contains' },
                { value: 'hashFlexible', label: 'Incl #' }
            ];

            matchTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.value;
                option.textContent = type.label;
                if (pageData.matchType === type.value) {
                    option.selected = true;
                }
                matchTypeSelect.appendChild(option);
            });

            // Auto-save on change
            matchTypeSelect.addEventListener('change', () => {
                this.competitionSettings.enchantedPages[index].matchType = matchTypeSelect.value;
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Saved enchanted page match type [${index}]: ${matchTypeSelect.value}`);

                // Regenerate spawn schedule with updated match type
                if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                    GM_deleteValue('halloween_spawn_schedule');
                    HalloweenCompetition.generateSpawnSchedule();
                    HalloweenCompetition.refreshSpawns();
                    HalloweenDebug.log(2, '🔮 Spawn schedule regenerated after match type change');
                }
            });

            row.appendChild(urlInput);
            row.appendChild(matchTypeSelect);

            return row;
        },

        cleanupEnchantedPages: function() {
            if (!this.competitionSettings.enchantedPages) return;

            const beforeCount = this.competitionSettings.enchantedPages.length;
            this.competitionSettings.enchantedPages = this.competitionSettings.enchantedPages.filter(page => {
                return page.url && page.url.trim() !== '';
            });
            const afterCount = this.competitionSettings.enchantedPages.length;

            if (beforeCount !== afterCount) {
                this.saveCompetitionSettings();
                HalloweenDebug.log(2, `🔮 Cleaned up ${beforeCount - afterCount} empty enchanted page rows`);
            }

            // Regenerate spawn schedule after cleanup if pages changed
            if (typeof HalloweenCompetition !== 'undefined' && this.competitionSettings.enchantedPages.length > 0) {
                GM_deleteValue('halloween_spawn_schedule');
                HalloweenCompetition.generateSpawnSchedule();
                HalloweenCompetition.refreshSpawns();
                HalloweenDebug.log(2, '🔮 Spawn schedule regenerated with updated enchanted pages');
            }
        },

        reattachManifestationsListeners: function() {
            // Reattach manifestations listeners after menu rebuild
            // (DOM elements are destroyed/recreated, so listeners need to be reattached)

            // Collections Firebase URL Toggle
            const showCollectionsFirebaseLink = document.getElementById('show-collections-firebase-link');
            const collectionsFirebaseSection = document.getElementById('collections-firebase-section');
            if (showCollectionsFirebaseLink && collectionsFirebaseSection) {
                showCollectionsFirebaseLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = collectionsFirebaseSection.style.display === 'none';

                    if (isHidden) {
                        collectionsFirebaseSection.style.display = 'block';
                        showCollectionsFirebaseLink.textContent = 'Hide Collections Firebase URL';
                    } else {
                        collectionsFirebaseSection.style.display = 'none';
                        showCollectionsFirebaseLink.textContent = 'Show Collections Firebase URL';
                    }

                    HalloweenDebug.log(2, `🔮 Collections Firebase section ${isHidden ? 'shown' : 'hidden'}`);
                });
            }

            // Enchanted Pages Toggle
            const showEnchantedPagesLink = document.getElementById('show-enchanted-pages-link');
            const enchantedPagesSection = document.getElementById('enchanted-pages-section');
            if (showEnchantedPagesLink && enchantedPagesSection) {
                showEnchantedPagesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isHidden = enchantedPagesSection.style.display === 'none';

                    if (isHidden) {
                        enchantedPagesSection.style.display = 'block';
                        showEnchantedPagesLink.textContent = 'Hide Enchanted Pages';
                        this.renderEnchantedPages();
                    } else {
                        this.cleanupEnchantedPages();
                        enchantedPagesSection.style.display = 'none';
                        showEnchantedPagesLink.textContent = 'Show Enchanted Pages';
                    }

                    HalloweenDebug.log(2, `🔮 Enchanted pages section ${isHidden ? 'shown' : 'hidden'}`);
                });
            }

            const addEnchantedPageBtn = document.getElementById('add-enchanted-page');
            if (addEnchantedPageBtn) {
                addEnchantedPageBtn.addEventListener('click', () => {
                    if (!this.competitionSettings.enchantedPages) {
                        this.competitionSettings.enchantedPages = [];
                    }
                    this.competitionSettings.enchantedPages.push({ url: '', matchType: 'exact' });
                    this.renderEnchantedPages();
                    HalloweenDebug.log(2, `🔮 Added new enchanted page row`);
                });
            }

            HalloweenDebug.log(2, '🔮 Manifestations listeners reattached');
        },

        setupSpookyHandlers: function() {
            // Spooky Targets Active Toggle
            const spookyToggle = document.getElementById('spooky-targets-active-toggle');
            const spookyStatus = document.getElementById('spooky-targets-active-status');
            if (spookyToggle && spookyStatus) {
                // Load saved state
                const savedActive = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
                spookyToggle.checked = savedActive;
                spookyStatus.textContent = savedActive ? 'ON' : 'OFF';
                spookyStatus.style.color = savedActive ? 'var(--carved-cyan)' : '#ff4444';

                // Toggle event handler
                spookyToggle.addEventListener('change', () => {
                    const isActive = spookyToggle.checked;
                    GM_setValue('halloween_spooky_targets_active', isActive.toString());
                    spookyStatus.textContent = isActive ? 'ON' : 'OFF';
                    spookyStatus.style.color = isActive ? 'var(--carved-cyan)' : '#ff4444';

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update countdown display
                    this.updateSpookyTargetsCountdown();

                    HalloweenDebug.log(1, `🎃 Spooky Targets ${isActive ? 'enabled' : 'disabled'}`);
                });
            }

            // Spooky Testing Mode Toggle
            const spookyTestingToggle = document.getElementById('spooky-testing-mode-toggle');
            const spookyTestingStatus = document.getElementById('spooky-testing-mode-status');
            if (spookyTestingToggle && spookyTestingStatus) {
                // Load saved state
                const savedTesting = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
                spookyTestingToggle.checked = savedTesting;
                spookyTestingStatus.textContent = savedTesting ? 'ON' : 'OFF';
                spookyTestingStatus.style.color = savedTesting ? 'var(--carved-cyan)' : 'var(--carved-orange)';

                // Toggle event handler
                spookyTestingToggle.addEventListener('change', () => {
                    const isActive = spookyTestingToggle.checked;
                    GM_setValue('halloween_spooky_testing_mode', isActive.toString());
                    spookyTestingStatus.textContent = isActive ? 'ON' : 'OFF';
                    spookyTestingStatus.style.color = isActive ? 'var(--carved-cyan)' : 'var(--carved-orange)';

                    // Update cached state in HalloweenTargets
                    if (typeof HalloweenTargets !== 'undefined' && HalloweenTargets.evaluateSpookyTargetsState) {
                        HalloweenTargets.evaluateSpookyTargetsState();
                    }

                    // Update countdown display
                    this.updateSpookyTargetsCountdown();

                    HalloweenDebug.log(1, `🎃 Spooky Targets Testing Mode ${isActive ? 'enabled (overriding dates)' : 'disabled'}`);
                });
            }

            // Date/Time Inputs Auto-save
            const startDateInput = document.getElementById('spooky-start-date');
            const startTimeInput = document.getElementById('spooky-start-time');
            const endDateInput = document.getElementById('spooky-end-date');
            const endTimeInput = document.getElementById('spooky-end-time');

            const saveSpookyDates = () => {
                if (!startDateInput || !startTimeInput || !endDateInput || !endTimeInput) return;

                const startDate = startDateInput.value;
                const startTime = startTimeInput.value;
                const endDate = endDateInput.value;
                const endTime = endTimeInput.value;

                // Only save if all fields have values
                if (!startDate || !startTime || !endDate || !endTime) return;

                // Validate dates
                const startDateTime = new Date(`${startDate}T${startTime}`);
                const endDateTime = new Date(`${endDate}T${endTime}`);

                // Check if dates are valid
                if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                    // Invalid date format - silently return (user might still be typing)
                    return;
                }

                if (startDateTime >= endDateTime) {
                    alert('End date/time must be after start date/time');
                    return;
                }

                // Save dates and times
                GM_setValue('halloween_spooky_start_date', startDate);
                GM_setValue('halloween_spooky_start_time', startTime);
                GM_setValue('halloween_spooky_end_date', endDate);
                GM_setValue('halloween_spooky_end_time', endTime);

                HalloweenDebug.log(1, `🎃 Spooky Targets schedule saved: ${startDate} ${startTime} to ${endDate} ${endTime}`);

                // Update countdown display
                this.updateSpookyTargetsCountdown();
            };

            if (startDateInput) {
                startDateInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (startTimeInput) {
                startTimeInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (endDateInput) {
                endDateInput.addEventListener('blur', () => saveSpookyDates());
            }
            if (endTimeInput) {
                endTimeInput.addEventListener('blur', () => saveSpookyDates());
            }

            // Preview notification link
            const previewLink = document.getElementById('preview-spooky-end-notification');
            if (previewLink) {
                previewLink.addEventListener('click', () => {
                    this.previewSpookyTargetsEndNotification();
                });
            }
        },

        updateManifestationsUI: function() {
            // Update toggle states
            const competitionToggle = document.getElementById('competition-active-toggle');
            const competitionStatus = document.getElementById('competition-active-status');
            if (competitionToggle && competitionStatus) {
                competitionToggle.checked = this.competitionSettings.active;
                competitionStatus.textContent = this.competitionSettings.active ? 'ON' : 'OFF';
                competitionStatus.style.color = this.competitionSettings.active ? 'var(--carved-cyan)' : '#ff4444';
            }

            // Update date/time inputs
            const startDateInput = document.getElementById('competition-start-date');
            const startTimeInput = document.getElementById('competition-start-time');
            if (startDateInput) startDateInput.value = this.competitionSettings.startDate;
            if (startTimeInput) startTimeInput.value = this.competitionSettings.startTime;

            // Update duration select
            const durationSelect = document.getElementById('competition-duration');
            if (durationSelect) durationSelect.value = this.competitionSettings.duration;

            // Update testing mode
            const testingToggle = document.getElementById('testing-mode-toggle');
            const testingStatus = document.getElementById('testing-mode-status');
            if (testingToggle && testingStatus) {
                testingToggle.checked = this.competitionSettings.testingMode;
                testingStatus.textContent = this.competitionSettings.testingMode ? 'ON' : 'OFF';
                testingStatus.style.color = this.competitionSettings.testingMode ? 'var(--carved-cyan)' : '#ff4444';
            }

            // Update Collections Firebase URL input
            const collectionsURLInput = document.getElementById('collections-firebase-url');
            if (collectionsURLInput) collectionsURLInput.value = this.competitionSettings.collectionsFirebaseURL;

            // Update testing display radio buttons
            const testingDisplayRadios = document.querySelectorAll('input[name="testing-display"]');
            testingDisplayRadios.forEach(radio => {
                radio.checked = radio.value === this.competitionSettings.testingDisplay;
            });

            // Update test pages only toggle
            const testPagesOnlyToggle = document.getElementById('testing-test-pages-only');
            if (testPagesOnlyToggle) {
                testPagesOnlyToggle.checked = this.competitionSettings.testingTestPagesOnly || false;
            }

            // Update respawn allowed toggle
            const respawnToggle = document.getElementById('testing-respawn-allowed');
            if (respawnToggle) {
                // Default to true if not set
                respawnToggle.checked = this.competitionSettings.testingRespawnAllowed ?? true;
            }

            // Update testing display visibility
            this.toggleTestingDisplayVisibility();

            // Update countdown display
            this.updateCountdownDisplay();
        },

        toggleTestingDisplayVisibility: function() {
            const testingDisplaySection = document.getElementById('testing-display-mode');
            if (testingDisplaySection) {
                const shouldShow = this.competitionSettings.testingMode;
                testingDisplaySection.style.display = shouldShow ? 'block' : 'none';
                HalloweenDebug.log(2, `🔮 Testing display visibility: ${shouldShow ? 'SHOWN' : 'HIDDEN'} (testingMode: ${this.competitionSettings.testingMode})`);
            } else {
                HalloweenDebug.log(3, `❌ Testing display section not found in DOM (${SeedManager.isLeaderMode ? 'leader' : 'member'} mode)`);
            }
        },

        startCountdownTimer: function() {
            // Initial update
            this.updateCountdownDisplay();
            this.updateSpookyTargetsCountdown();
            this.updateMemberCountdowns();

            // Start timer with smart refresh intervals
            this.countdownInterval = setInterval(() => {
                this.updateCountdownDisplay();
                this.updateSpookyTargetsCountdown();
                this.updateMemberCountdowns();
            }, this.getCountdownRefreshInterval());

            HalloweenDebug.log(3, '🔮 Countdown timer started');
        },

        getCountdownRefreshInterval: function() {
            if (this.competitionSettings.testingMode) {
                return 60000; // 1 minute in testing mode
            }

            const now = new Date();
            const timeRemaining = this.getTimeUntilStateChange();

            if (!timeRemaining || timeRemaining <= 0) {
                return 60000; // 1 minute for completed competitions
            }

            // Smart intervals based on time remaining
            if (timeRemaining < 60 * 1000) { // < 1 minute
                return 5000; // 5 seconds
            } else if (timeRemaining < 60 * 60 * 1000) { // < 1 hour
                return 60000; // 1 minute
            } else if (timeRemaining < 24 * 60 * 60 * 1000) { // < 24 hours
                return 10 * 60 * 1000; // 10 minutes
            } else {
                return 30 * 60 * 1000; // 30 minutes
            }
        },

        updateCountdownDisplay: function() {
            const countdownElement = document.getElementById('competition-countdown');
            if (!countdownElement) return;

            // Show testing mode indicator if active
            if (this.competitionSettings.testingMode) {
                countdownElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdownElement.style.color = '#00ff00';
                return;
            }

            // Check if competition is disabled
            if (!this.competitionSettings.active) {
                countdownElement.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🚫</span> Collectibles Disabled';
                countdownElement.style.color = '#ff4444';
                return;
            }

            const competitionState = this.getCompetitionState();
            let displayText = '';
            let color = 'var(--carved-cyan)';

            switch (competitionState.status) {
                case 'pending':
                    const timeUntilStart = this.formatTimeRemaining(competitionState.timeUntilStart);
                    displayText = `<span style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">⏳</span> Starts in ${timeUntilStart}`;
                    color = 'var(--carved-magenta)';
                    break;

                case 'active':
                    const timeUntilEnd = this.formatTimeRemaining(competitionState.timeUntilEnd);
                    displayText = `Day ${competitionState.currentDay} of ${this.competitionSettings.duration} - ${timeUntilEnd} remaining`;
                    color = 'var(--carved-cyan)';
                    break;

                case 'completed':
                    displayText = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                    color = '#888';
                    break;

                default:
                    displayText = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">⚙️</span> Awaiting Configuration';
                    color = '#888';
                    break;
            }

            countdownElement.innerHTML = displayText;
            countdownElement.style.color = color;
        },

        getCompetitionState: function() {
            if (!this.competitionSettings.startDate) {
                HalloweenDebug.log(2, '🔮 Competition state: unconfigured (no start date)');
                return { status: 'unconfigured' };
            }

            const now = new Date();
            const startDateTime = new Date(`${this.competitionSettings.startDate}T${this.competitionSettings.startTime}:00.000Z`);
            const durationMs = this.competitionSettings.duration * 24 * 60 * 60 * 1000;
            const endDateTime = new Date(startDateTime.getTime() + durationMs);

            if (now < startDateTime) {
                return {
                    status: 'pending',
                    timeUntilStart: startDateTime.getTime() - now.getTime()
                };
            } else if (now <= endDateTime) {
                const timeElapsed = now.getTime() - startDateTime.getTime();
                const currentDay = Math.floor(timeElapsed / (24 * 60 * 60 * 1000)) + 1;
                return {
                    status: 'active',
                    currentDay: Math.min(currentDay, this.competitionSettings.duration),
                    timeUntilEnd: endDateTime.getTime() - now.getTime()
                };
            } else {
                return { status: 'completed' };
            }
        },

        getTimeUntilStateChange: function() {
            const state = this.getCompetitionState();
            switch (state.status) {
                case 'pending':
                    return state.timeUntilStart;
                case 'active':
                    return state.timeUntilEnd;
                default:
                    return null;
            }
        },

        previewSpookyTargetsEndNotification: function() {
            // Show notification in preview mode (doesn't mark as shown, doesn't disable anything)
            HalloweenCompetition.showSpookyTargetsEndNotification(true);
            HalloweenDebug.log(2, '🎃 Previewing Spooky Targets end notification');
        },

        getSpookyTargetsState: function() {
            // Check if start date is configured
            const startDate = GM_getValue('halloween_spooky_start_date', '');
            if (!startDate) {
                HalloweenDebug.log(2, '🔮 Spooky targets state: unconfigured (no start date)');
                return { status: 'unconfigured' };
            }

            const startTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const endDate = GM_getValue('halloween_spooky_end_date', '');
            const endTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!endDate) {
                HalloweenDebug.log(2, '🔮 Spooky targets state: unconfigured (no end date)');
                return { status: 'unconfigured' };
            }

            const now = new Date();
            const startDateTime = new Date(`${startDate}T${startTime}:00.000Z`);
            const endDateTime = new Date(`${endDate}T${endTime}:00.000Z`);

            if (now < startDateTime) {
                return {
                    status: 'pending',
                    timeUntilStart: startDateTime.getTime() - now.getTime()
                };
            } else if (now <= endDateTime) {
                return {
                    status: 'active',
                    timeUntilEnd: endDateTime.getTime() - now.getTime()
                };
            } else {
                return { status: 'completed' };
            }
        },

        updateSpookyTargetsCountdown: function() {
            const countdownElement = document.getElementById('spooky-targets-countdown');
            if (!countdownElement) return;

            // Show testing mode indicator if active
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            if (testingMode) {
                countdownElement.innerHTML = '🧪 TESTING MODE ACTIVE';
                countdownElement.style.color = '#00ff00';
                return;
            }

            // Check if spooky targets is disabled
            const active = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
            if (!active) {
                countdownElement.innerHTML = '🚫 Spooky Targets Disabled';
                countdownElement.style.color = '#ff4444';
                return;
            }

            const spookyState = this.getSpookyTargetsState();
            let displayText = '';
            let color = 'var(--carved-cyan)';

            switch (spookyState.status) {
                case 'pending':
                    const timeUntilStart = this.formatTimeRemaining(spookyState.timeUntilStart);
                    displayText = `⏳ Starts in ${timeUntilStart}`;
                    color = 'var(--carved-magenta)';
                    break;

                case 'active':
                    const timeUntilEnd = this.formatTimeRemaining(spookyState.timeUntilEnd);
                    displayText = `Active - ${timeUntilEnd} remaining`;
                    color = 'var(--carved-cyan)';
                    break;

                case 'completed':
                    displayText = '🏁 Spooky Targets Ended';
                    color = '#888';
                    break;

                default:
                    displayText = '⚙️ Awaiting Configuration';
                    color = '#888';
                    break;
            }

            countdownElement.textContent = displayText;
            countdownElement.style.color = color;
        },

        formatTimeRemaining: function(milliseconds) {
            if (milliseconds <= 0) return '0 seconds';

            const totalSeconds = Math.floor(milliseconds / 1000);
            const days = Math.floor(totalSeconds / (24 * 60 * 60));
            const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
            const seconds = totalSeconds % 60;

            if (days > 0) {
                return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            } else {
                return `${seconds} second${seconds !== 1 ? 's' : ''}`;
            }
        },

        // ========================================================================
        // MEMBER PANEL COUNTDOWN FUNCTIONS
        // ========================================================================

        determineMemberCountdownMode: function() {
            // Determine if we should show combined or individual countdowns
            // Combined mode: Both competitions active AND end times match
            // Individual mode: Everything else

            const spookyState = this.getSpookyTargetsState();
            const manifestationsState = this.getCompetitionState();

            // Get timestamps for both competitions
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');
            const manifestationsStartDate = this.competitionSettings.startDate;
            const manifestationsStartTime = this.competitionSettings.startTime;
            const manifestationsDuration = this.competitionSettings.duration;

            // Validate we have necessary data
            if (!spookyEndDate || !manifestationsStartDate) {
                return 'individual'; // One or both not configured
            }

            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}:00.000Z`).getTime();
            const manifestationsStart = new Date(`${manifestationsStartDate}T${manifestationsStartTime}:00.000Z`).getTime();
            const manifestationsEnd = manifestationsStart + (manifestationsDuration * 24 * 60 * 60 * 1000);

            // Check if end times match
            const endsMatch = (spookyEnd === manifestationsEnd);

            // Check if both are active
            const bothActive = (spookyState.status === 'active' && manifestationsState.status === 'active');

            // Combined mode: both active AND ends match (starts don't matter)
            if (bothActive && endsMatch) {
                HalloweenDebug.log(2, '🎯 Member countdown mode: COMBINED (both active, ends match)');
                return 'combined';
            }

            HalloweenDebug.log(2, '🎯 Member countdown mode: INDIVIDUAL');
            return 'individual';
        },

        updateMemberCountdowns: function() {
            // Main orchestrator for member panel countdowns
            HalloweenDebug.log(1, '🎯 updateMemberCountdowns() called');

            const mode = this.determineMemberCountdownMode();
            HalloweenDebug.log(1, `🎯 Countdown mode: ${mode}`);

            const combinedContainer = document.getElementById('member-combined-countdown-container');
            const combinedLink = document.getElementById('member-combined-status-link');
            const spookyLink = document.getElementById('member-spooky-status-link');
            const spookyCountdown = document.getElementById('member-spooky-countdown');
            const manifestationsLink = document.getElementById('member-manifestations-status-link');
            const manifestationsCountdown = document.getElementById('member-manifestations-countdown');

            HalloweenDebug.log(1, `🎯 Elements found - Combined: ${!!combinedContainer}, Spooky: ${!!spookyLink}, Manifestations: ${!!manifestationsLink}`);

            if (mode === 'combined') {
                // Show combined, hide individuals
                if (combinedContainer) combinedContainer.style.display = 'block';
                if (combinedLink) combinedLink.style.display = 'inline';
                if (spookyLink) spookyLink.style.display = 'none';
                if (spookyCountdown) spookyCountdown.style.display = 'none';
                if (manifestationsLink) manifestationsLink.style.display = 'none';
                if (manifestationsCountdown) manifestationsCountdown.style.display = 'none';

                // Update combined countdown
                this.updateMemberCombinedStatus();
            } else {
                // Hide combined, show individuals
                if (combinedContainer) combinedContainer.style.display = 'none';
                if (combinedLink) combinedLink.style.display = 'none';
                if (spookyLink) spookyLink.style.display = 'inline';
                if (manifestationsLink) manifestationsLink.style.display = 'inline';

                // Update individual countdowns
                this.updateMemberSpookyStatus();
                this.updateMemberManifestationsStatus();
            }
        },

        updateMemberCombinedStatus: function() {
            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-combined-countdown-text');
            const statusLink = document.getElementById('member-combined-status-link');
            const container = document.getElementById('member-combined-countdown-container');

            if (!countdownText || !statusLink || !container) {
                return;
            }

            // Get both states (we know both are active if we're in combined mode)
            const spookyState = this.getSpookyTargetsState();
            const manifestationsState = this.getCompetitionState();

            // If either is not active, we shouldn't be in combined mode - bail out
            if (spookyState.status !== 'active' && spookyState.status !== 'completed') {
                return; // Spooky is pending or unconfigured
            }
            if (manifestationsState.status !== 'active' && manifestationsState.status !== 'completed') {
                return; // Manifestations is pending or unconfigured
            }

            // Use spooky state (since ends match, doesn't matter which we use for countdown)
            const state = spookyState;

            // Get user preference
            const visible = GM_getValue('member_combined_countdown_visible', false);

            // Determine state and behavior
            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competitions Ended';
                container.style.display = 'block';
                statusLink.style.display = 'none'; // Remove link
                HalloweenDebug.log(2, '🏁 Combined competitions ended');
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Competitions end in ${timeStr}`;

                // Check if just entered final 6 hours (auto-show once)
                const wasInFinal6Hours = GM_getValue('member_combined_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_combined_countdown_visible', true);
                    GM_setValue('member_combined_in_final_6_hours', true);
                }

                // Show/hide based on user preference
                if (GM_getValue('member_combined_countdown_visible', true)) {
                    container.style.display = 'block';
                    statusLink.textContent = 'Hide Competition Status';
                } else {
                    container.style.display = 'none';
                    statusLink.textContent = 'Show Competition Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Competitions end in ${timeStr}`;

                // Show/hide based on user preference
                if (visible) {
                    container.style.display = 'block';
                    statusLink.textContent = 'Hide Competition Status';
                } else {
                    container.style.display = 'none';
                    statusLink.textContent = 'Show Competition Status';
                }
            }
        },

        updateMemberSpookyStatus: function() {
            HalloweenDebug.log(2, 'HAL: 🎯 updateMemberSpookyStatus() called');

            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-spooky-countdown-text');
            const statusLink = document.getElementById('member-spooky-status-link');
            const countdown = document.getElementById('member-spooky-countdown');

            HalloweenDebug.log(2, `HAL: 🎯 Elements - countdownText: ${!!countdownText}, statusLink: ${!!statusLink}, countdown: ${!!countdown}`);

            if (!countdownText || !statusLink || !countdown) {
                HalloweenDebug.log(2, 'HAL: 🎯 Early return - missing elements');
                return;
            }

            const state = this.getSpookyTargetsState();

            // Check for testing mode or disabled
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            const active = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';

            if (testingMode) {
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
                return;
            }

            if (!active) {
                countdownText.textContent = 'Spooky Targets Disabled';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                return;
            }

            if (state.status === 'unconfigured') {
                countdownText.textContent = 'Awaiting Configuration';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                return;
            }

            // Get user preference
            const visible = GM_getValue('member_spooky_countdown_visible', false);

            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
            } else if (state.status === 'pending') {
                // Pending start
                const timeStr = this.formatTimeRemaining(state.timeUntilStart);
                countdownText.innerHTML = `Starts in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                // Check if just entered final 6 hours
                const wasInFinal6Hours = GM_getValue('member_spooky_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_spooky_countdown_visible', true);
                    GM_setValue('member_spooky_in_final_6_hours', true);
                    HalloweenDebug.log(1, '⏰ Spooky countdown: Entered final 6 hours, auto-showing');
                }

                if (GM_getValue('member_spooky_countdown_visible', true)) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            }
        },

        updateMemberManifestationsStatus: function() {
            HalloweenDebug.log(2, 'HAL: 🎯 updateMemberManifestationsStatus() called');

            const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

            const countdownText = document.getElementById('member-manifestations-countdown-text');
            const statusLink = document.getElementById('member-manifestations-status-link');
            const countdown = document.getElementById('member-manifestations-countdown');

            HalloweenDebug.log(2, `HAL: 🎯 Elements - countdownText: ${!!countdownText}, statusLink: ${!!statusLink}, countdown: ${!!countdown}`);

            if (!countdownText || !statusLink || !countdown) {
                HalloweenDebug.log(2, 'HAL: 🎯 Early return - missing elements');
                return;
            }

            const state = this.getCompetitionState();

            // Check for testing mode using state (not GM storage for consistency)
            const testingMode = GM_getValue('halloween_testing_mode', 'false') === 'true';

            HalloweenDebug.log(1, `🎯 DEBUG: testingMode=${testingMode}, state.status=${state.status}`);

            if (testingMode) {
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🧪</span> TESTING MODE ACTIVE';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
                HalloweenDebug.log(1, '🎯 DEBUG: Early return - testing mode');
                return;
            }

            if (state.status === 'unconfigured') {
                countdownText.textContent = 'Awaiting Configuration';
                countdown.style.display = 'none';
                statusLink.style.display = 'inline';
                HalloweenDebug.log(1, '🎯 DEBUG: Early return - unconfigured');
                return;
            }

            // Get user preference
            const visible = GM_getValue('member_manifestations_countdown_visible', false);

            if (state.status === 'completed') {
                // STATE 3: Competition ended
                countdownText.innerHTML = '<span style="font-family: \'Apple Color Emoji\', \'Segoe UI Emoji\', \'Noto Color Emoji\', sans-serif;">🏁</span> Competition Ended';
                countdown.style.display = 'block';
                statusLink.style.display = 'none';
            } else if (state.status === 'pending') {
                // Pending start
                const timeStr = this.formatTimeRemaining(state.timeUntilStart);
                countdownText.innerHTML = `Starts in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else if (state.status === 'active' && state.timeUntilEnd <= SIX_HOURS_MS) {
                // STATE 2: Final 6 hours
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                // Check if just entered final 6 hours
                const wasInFinal6Hours = GM_getValue('member_manifestations_in_final_6_hours', false);
                if (!wasInFinal6Hours) {
                    GM_setValue('member_manifestations_countdown_visible', true);
                    GM_setValue('member_manifestations_in_final_6_hours', true);
                    HalloweenDebug.log(1, '⏰ Manifestations countdown: Entered final 6 hours, auto-showing');
                }

                if (GM_getValue('member_manifestations_countdown_visible', true)) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            } else {
                // STATE 1: Normal (> 6 hours) - simple toggle
                const timeStr = this.formatTimeRemaining(state.timeUntilEnd);
                countdownText.innerHTML = `Ends in ${timeStr}`;

                if (visible) {
                    countdown.style.display = 'block';
                    statusLink.textContent = 'Hide Status';
                } else {
                    countdown.style.display = 'none';
                    statusLink.textContent = 'Show Status';
                }
            }

            // Debug: Check final link state
            HalloweenDebug.log(1, `🎯 DEBUG: Manifestations link - display: ${statusLink.style.display}, text: "${statusLink.textContent}", opacity: ${statusLink.style.opacity}`);
        },

        setupMemberStatusHandlers: function() {
            // Event handlers for member panel countdown status links

            // Combined countdown handler
            const combinedLink = document.getElementById('member-combined-status-link');
            if (combinedLink && !combinedLink.dataset.handlerAttached) {
                combinedLink.dataset.handlerAttached = 'true';
                combinedLink.addEventListener('click', () => {
                    const state = this.getSpookyTargetsState();
                    const currentlyVisible = GM_getValue('member_combined_countdown_visible', false);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_combined_countdown_visible', !currentlyVisible);
                    this.updateMemberCombinedStatus();
                });

                // Add hover effects
                combinedLink.addEventListener('mouseover', () => {
                    combinedLink.style.opacity = '1';
                    combinedLink.style.textDecoration = 'underline';
                });

                combinedLink.addEventListener('mouseout', () => {
                    combinedLink.style.opacity = '0.8';
                    combinedLink.style.textDecoration = 'none';
                });
            }

            // Spooky countdown handler
            const spookyLink = document.getElementById('member-spooky-status-link');
            if (spookyLink && !spookyLink.dataset.handlerAttached) {
                spookyLink.dataset.handlerAttached = 'true';
                spookyLink.addEventListener('click', () => {
                    const state = this.getSpookyTargetsState();
                    const currentlyVisible = GM_getValue('member_spooky_countdown_visible', false);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_spooky_countdown_visible', !currentlyVisible);
                    this.updateMemberSpookyStatus();
                });

                // Add hover effects
                spookyLink.addEventListener('mouseover', () => {
                    spookyLink.style.opacity = '1';
                    spookyLink.style.textDecoration = 'underline';
                });

                spookyLink.addEventListener('mouseout', () => {
                    spookyLink.style.opacity = '0.8';
                    spookyLink.style.textDecoration = 'none';
                });
            }

            // Manifestations countdown handler
            const manifestationsLink = document.getElementById('member-manifestations-status-link');
            if (manifestationsLink && !manifestationsLink.dataset.handlerAttached) {
                manifestationsLink.dataset.handlerAttached = 'true';
                HalloweenDebug.log(1, '🎯 DEBUG: Manifestations handler ATTACHED to element', manifestationsLink);
                manifestationsLink.addEventListener('click', () => {
                    HalloweenDebug.log(1, '🎯 DEBUG: MANIFESTATIONS CLICK DETECTED');
                    const state = this.getCompetitionState();
                    HalloweenDebug.log(1, `🎯 DEBUG: Manifestations state: ${state.status}`);
                    const currentlyVisible = GM_getValue('member_manifestations_countdown_visible', false);
                    HalloweenDebug.log(1, `🎯 DEBUG: Current visible state: ${currentlyVisible}`);

                    if (state.status === 'completed') {
                        return; // No action when ended
                    }

                    // Toggle visibility and preference (same for both normal and final 6 hours)
                    GM_setValue('member_manifestations_countdown_visible', !currentlyVisible);
                    this.updateMemberManifestationsStatus();
                });

                // Add hover effects
                manifestationsLink.addEventListener('mouseover', () => {
                    manifestationsLink.style.opacity = '1';
                    manifestationsLink.style.textDecoration = 'underline';
                });

                manifestationsLink.addEventListener('mouseout', () => {
                    manifestationsLink.style.opacity = '0.8';
                    manifestationsLink.style.textDecoration = 'none';
                });
            }

            HalloweenDebug.log(2, '🎯 Member status handlers initialized');
        },

        setSeed: function() {
            const input = document.getElementById('seed-input');
            const newSeed = input.value.trim();

            if (newSeed) {
                const result = SeedManager.setSeed(newSeed);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    HalloweenDebug.log(2, '🎃 Team seed updated successfully');
                } else {
                    alert('Invalid seed format. Must be 3-50 characters.');
                }
            }
        },

        extractPlayerId: function(url) {
            const profileMatch = url.match(/\/profiles\.php\?XID=(\d+)/);
            const attackMatch = url.match(/\/loader\.php\?sid=attack&user2ID=(\d+)/);
            return profileMatch ? profileMatch[1] : (attackMatch ? attackMatch[1] : null);
        },


        toggleBackground: function() {
            HalloweenDebug.log(2, '🎃 toggleBackground() function called!');
            this.backgroundEnabled = !this.backgroundEnabled;
            GM_setValue('halloween_background', this.backgroundEnabled);

            if (this.backgroundEnabled) {
                // Add body class for generic background
                document.body.classList.add('halloween-background-enabled');

                // Apply generic Halloween background
                HalloweenEffects.applyGenericHalloweenBackground();

                // Apply tile background if configured (no delay for user action)
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            } else {
                // Remove body classes
                document.body.classList.remove('halloween-background-enabled');
                document.body.classList.remove('halloween-target');

                // Remove both generic and target-specific backgrounds
                const existing = document.getElementById('halloween-background-override');
                if (existing) existing.remove();
                const generic = document.getElementById('halloween-generic-background');
                if (generic) generic.remove();
            }

            this.updateMenuContent();
        },

        toggleSound: function() {
            HalloweenDebug.log(2, '🎃 toggleSound() function called!');
            this.soundEnabled = !this.soundEnabled;
            GM_setValue('halloween_sound_enabled', this.soundEnabled);
            HalloweenDebug.log(2, `🔊 Audio setting saved: halloween_sound_enabled = "${this.soundEnabled}"`);
            HalloweenDebug.log(2, '🔊 Verification read:', GM_getValue('halloween_sound_enabled'));
            this.updateMenuContent();
        },

        toggleMenuPosition: function() {
            HalloweenDebug.log(2, '🎃 toggleMenuPosition() function called!');
            // Close current menu first
            if (this.menuOpen) {
                this.toggleMenu();
            }

            // Switch position
            this.menuPosition = this.menuPosition === 'top' ? 'side' : 'top';
            GM_setValue('halloween_menu_position', this.menuPosition);

            // Remove existing triggers and menus
            const oldSideTrigger = document.getElementById('halloween-pumpkin-trigger');
            const oldSideMenu = document.getElementById('halloween-sliding-menu');
            const oldTopTrigger = document.querySelector('.halloween-menu-trigger');
            const oldDropdownMenu = document.getElementById('halloween-dropdown-menu');

            if (oldSideTrigger) oldSideTrigger.remove();
            if (oldSideMenu) oldSideMenu.remove();
            if (oldTopTrigger) oldTopTrigger.remove();
            if (oldDropdownMenu) oldDropdownMenu.remove();

            // Create new triggers and menus based on position
            if (this.menuPosition === 'top') {
                document.body.classList.add('halloween-menu-top');
                this.createTopPumpkinTrigger();
                this.createDropdownMenu();
            } else {
                document.body.classList.remove('halloween-menu-top');
                this.createPumpkinTrigger();
                this.createSlidingMenu();
            }

            HalloweenDebug.log(2, '🎃 Menu position switched to:', this.menuPosition);
        },

        generateTargetPairsDisplay: function() {
            try {
                const currentSeed = SeedManager.getSeed('generateTargetPairsDisplay');
                const targets = SeedManager.getTargets('generateTargetPairsDisplay');
                HalloweenDebug.log(3, '🎃 DEBUG generateTargetPairsDisplay: got targets =', targets?.length, 'pairs');
                if (!targets || targets.length === 0) {
                    return '<div style="color: #ff6b35; text-align: center;">No targets available</div>';
                }

                // Display targets in a compact 5-column grid to match your image
                const rows = [];
                for (let i = 0; i < targets.length; i += 5) {
                    const row = targets.slice(i, i + 5);
                    const rowHTML = row.map(target =>
                        `<span style="color: #000; background: #ff69b4; padding: 3px 6px; border-radius: 3px; margin: 1px; display: inline-block; min-width: 20px; text-align: center; font-weight: bold;">${target}</span>`
                    ).join(' ');
                    rows.push(`<div style="margin-bottom: 4px; text-align: center;">${rowHTML}</div>`);
                }

                let displayHTML = rows.join('');
                displayHTML += `<div style="margin-top: 6px; font-size: 9px; opacity: 0.6; text-align: center; color: #fff;">Total: ${targets.length} pairs | Seed: ${currentSeed}</div>`;

                return displayHTML;
            } catch (error) {
                HalloweenDebug.log(2, 'Error generating target pairs display:', error);
                return '<div style="color: #ff6b35; text-align: center;">Error loading targets</div>';
            }
        },

        clearData: function() {
            if (confirm('Clear all Halloween data? This cannot be undone.')) {
                GM_setValue('halloween_encounters', '{}');
                // Clear GM defeats data (now using Firebase verification system)
                GM_deleteValue('halloween_defeats_counted');
                GM_deleteValue('halloween_verify_queue');
                GM_deleteValue('halloween_verify_failed');
                GM_deleteValue('halloween_defeats_unverified');
                // Clear pumpkin expiration tracking
                GM_deleteValue('halloween_logged_expirations');
                SeedManager.clearCache();
                this.updateMenuContent();
                HalloweenDebug.log(3, '🎃 All Halloween data cleared');
            }
        },

        setDebugLevel: function(level) {
            HalloweenDebug.setLevel(level);

            // Update footer debug level display (leader only)
            const footerLevelDisplay = document.getElementById('debug-level-footer');
            const levelNameDisplay = document.getElementById('debug-level-name');
            if (footerLevelDisplay) {
                footerLevelDisplay.textContent = level;
            }
            if (levelNameDisplay) {
                levelNameDisplay.textContent = this.getDebugLevelName(level);
            }

            // Update button visual states
            this.updateDebugButtonStates(level);

            // Show confirmation message
            const feedback = document.getElementById('debug-feedback');
            if (feedback) {
                const messages = {
                    0: 'Production mode: Only essential messages',
                    1: 'Basic flow: Seed, API & cache operations enabled',
                    2: 'Detailed mode: Menu & event debugging enabled',
                    3: 'Full debug: All operations & DOM debugging enabled'
                };

                feedback.textContent = messages[level];
                feedback.style.opacity = '1';

                // Hide after 5 seconds
                setTimeout(() => {
                    feedback.style.opacity = '0';
                }, 5000);
            }
        },

        getDebugLevelName: function(level) {
            const names = {
                0: 'Production',
                1: 'Basic',
                2: 'Detailed',
                3: 'Full'
            };
            return names[level] || 'Unknown';
        },

        updateDebugButtonStates: function(activeLevel) {
            // Define the button colors (soft candy pink to vibrant pink)
            const colors = {
                inactive: {
                    0: '#f8c8dc', // Soft candy pink
                    1: '#f1a7c7', // Light pink
                    2: '#e685b2', // Medium pink
                    3: '#db649d'  // Strong pink
                },
                active: {
                    background: 'var(--carved-magenta)', // Vibrant magenta for active
                    color: 'white',
                    boxShadow: '0 0 8px rgba(255, 105, 180, 0.6)'
                }
            };

            // Update all buttons
            for (let i = 0; i <= 3; i++) {
                const button = document.getElementById(`debug-level-${i}`);
                if (button) {
                    if (i === activeLevel) {
                        // Active button - vibrant magenta with glow
                        button.style.background = colors.active.background;
                        button.style.color = colors.active.color;
                        button.style.boxShadow = colors.active.boxShadow;
                        button.style.transform = 'scale(1.05)';
                    } else {
                        // Inactive button - soft candy pink gradient
                        button.style.background = colors.inactive[i];
                        button.style.color = 'black';
                        button.style.boxShadow = 'none';
                        button.style.transform = 'scale(1)';
                    }
                }
            }
        },

        clearCache: function() {
            HalloweenDebug.log(3, '🎃 CLEAR CACHE button clicked');

            // Step 1: Check what's currently in storage
            HalloweenDebug.log(3, '🎃 BEFORE CLEARING:');
            const beforeTargets = GM_getValue('halloween_targets_cache_encrypted');
            const beforeSeed = GM_getValue('halloween_targets_seed_encrypted');
            HalloweenDebug.log(3, '🎃 Current targets in GM storage:', beforeTargets ? 'EXISTS' : 'NULL');
            HalloweenDebug.log(3, '🎃 Current seed in GM storage:', beforeSeed ? beforeSeed : 'NULL');
            HalloweenDebug.log(3, '🎃 Current memory cache exists:', !!SeedManager.cachedTargets);
            HalloweenDebug.log(3, '🎃 Current memory seed:', SeedManager.currentSeed);

            // Step 2: Clear encrypted target cache with error handling
            try {
                HalloweenDebug.log(3, '🎃 Calling GM_deleteValue for targets...');
                GM_deleteValue('halloween_targets_cache_encrypted');
                HalloweenDebug.log(3, '🎃 GM_deleteValue for targets completed');
            } catch (e) {
                console.error('🎃 ERROR deleting targets:', e);
            }

            try {
                HalloweenDebug.log(3, '🎃 Calling GM_deleteValue for seed...');
                GM_deleteValue('halloween_targets_seed_encrypted');
                HalloweenDebug.log(3, '🎃 GM_deleteValue for seed completed');
            } catch (e) {
                console.error('🎃 ERROR deleting seed:', e);
            }

            // Step 3: Clear SeedManager cache aggressively
            HalloweenDebug.log(3, '🎃 Clearing memory cache...');
            SeedManager.cachedTargets = null;
            SeedManager.currentSeed = null;
            HalloweenDebug.log(3, '🎃 Memory cache cleared');

            // Step 4: Verify deletion worked
            HalloweenDebug.log(3, '🎃 AFTER CLEARING:');
            const afterTargets = GM_getValue('halloween_targets_cache_encrypted');
            const afterSeed = GM_getValue('halloween_targets_seed_encrypted');
            HalloweenDebug.log(3, '🎃 Targets after deletion:', afterTargets ? 'STILL EXISTS!' : 'Successfully deleted');
            HalloweenDebug.log(3, '🎃 Seed after deletion:', afterSeed ? afterSeed + ' STILL EXISTS!' : 'Successfully deleted');

            if (afterTargets || afterSeed) {
                console.error('🎃 CACHE CLEARING FAILED! Some values still exist.');
                alert('🎃 WARNING: Cache clearing failed! Some data still exists. Try again or contact support.');
            } else {
                HalloweenDebug.log(3, '🎃 Cache clearing successful!');
                alert('🎃 Cache cleared successfully! Reload the page to generate fresh targets.');
            }
        },

        updateTileImage: function() {
            const halloweenTiles = [
                'https://i.ibb.co/4KpXxKh/halloween-pumpkin-tile.png',
                'https://i.ibb.co/7X2Y1Kw/halloween-ghost-tile.png',
                'https://i.ibb.co/5BxGz2k/halloween-bat-tile.png',
                'https://i.ibb.co/DGq8Kzh/halloween-skull-tile.png',
                'https://i.ibb.co/Yk9B1pq/halloween-witch-tile.png'
            ];

            const tileNames = [
                '🎃 Pumpkin Terror',
                '👻 Ghostly Apparition',
                '🦇 Vampire Bat',
                '💀 Skull Crusher',
                '🧙‍♀️ Witch Master'
            ];

            let optionsHTML = '';
            halloweenTiles.forEach((url, index) => {
                optionsHTML += `<option value="${url}">${tileNames[index]}</option>`;
            });

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.8); z-index: 99999; display: flex;
                justify-content: center; align-items: center; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
            `;

            modal.innerHTML = `
                <div style="background: linear-gradient(145deg, #2a0845, #1a0530); padding: 30px; border-radius: 15px;
                           border: 3px solid var(--halloween-primary); box-shadow: 0 0 30px var(--halloween-primary);
                           text-align: center; max-width: 400px; color: white;">
                    <h3 style="color: var(--halloween-secondary); margin-bottom: 20px; font-size: 18px;">🎃 Halloween Tile Images</h3>
                    <p style="margin-bottom: 20px; font-size: 13px; color: #ccc;">Choose a spooky tile image for your profile:</p>
                    <select id="halloween-tile-select" style="width: 100%; padding: 10px; margin-bottom: 20px;
                           background: rgba(0,0,0,0.7); color: var(--halloween-primary); border: 2px solid var(--halloween-primary);
                           border-radius: 5px; font-size: 12px;">
                        <option value="">🔄 Restore Original</option>
                        ${optionsHTML}
                    </select>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="apply-tile" style="padding: 10px 20px; background: var(--halloween-primary);
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Apply Tile
                        </button>
                        <button id="cancel-tile" style="padding: 10px 20px; background: #666;
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Cancel
                        </button>
                    </div>
                    <div style="margin-top: 15px; font-size: 11px; color: #888;">
                        ⚠️ Tile changes are visual only and temporary
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event handlers
            document.getElementById('apply-tile').onclick = () => {
                const selectedTile = document.getElementById('halloween-tile-select').value;
                this.applyTileImage(selectedTile);
                document.body.removeChild(modal);
            };

            document.getElementById('cancel-tile').onclick = () => {
                document.body.removeChild(modal);
            };

            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) document.body.removeChild(modal);
            };
        },

        applyTileImage: function(imageUrl) {
            // Remove existing Halloween tile override
            const existingStyle = document.getElementById('halloween-tile-override');
            if (existingStyle) existingStyle.remove();

            if (imageUrl) {
                // Apply new Halloween tile
                const tileStyle = document.createElement('style');
                tileStyle.id = 'halloween-tile-override';
                tileStyle.textContent = `
                    .profile-image img,
                    .user-info img,
                    .profile-image-wrapper img,
                    img[src*="profileimages.torn.com"] {
                        content: url('${imageUrl}') !important;
                        border-radius: 8px !important;
                        border: 2px solid var(--halloween-primary) !important;
                        box-shadow: 0 0 10px var(--halloween-primary) !important;
                    }
                `;
                document.head.appendChild(tileStyle);

                // Store preference
                GM_setValue('halloween_tile_image', imageUrl);
                HalloweenDebug.log(3, '🎃 Halloween tile image applied:', imageUrl);
            } else {
                // Restore original
                GM_deleteValue('halloween_tile_image');
                HalloweenDebug.log(3, '🎃 Original tile image restored');
            }
        },

        updateFactionName: function() {
            const currentName = GM_getValue('halloween_faction_name', 'Your Faction');

            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.8); z-index: 99999; display: flex;
                justify-content: center; align-items: center; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
            `;

            modal.innerHTML = `
                <div style="background: linear-gradient(145deg, #2a0845, #1a0530); padding: 30px; border-radius: 15px;
                           border: 3px solid var(--halloween-primary); box-shadow: 0 0 30px var(--halloween-primary);
                           text-align: center; max-width: 400px; color: white;">
                    <h3 style="color: var(--halloween-secondary); margin-bottom: 20px; font-size: 18px;">🏴‍☠️ Faction Name</h3>
                    <p style="margin-bottom: 20px; font-size: 13px; color: #ccc;">Customize your faction display name in Halloween UI:</p>
                    <input type="text" id="halloween-faction-input" value="${currentName}"
                           style="width: 100%; padding: 10px; margin-bottom: 20px; background: rgba(0,0,0,0.7);
                                  color: var(--halloween-primary); border: 2px solid var(--halloween-primary);
                                  border-radius: 5px; font-size: 12px; text-align: center;"
                           placeholder="Enter coven name..." maxlength="30">
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button id="apply-faction" style="padding: 10px 20px; background: var(--halloween-primary);
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Apply Name
                        </button>
                        <button id="cancel-faction" style="padding: 10px 20px; background: #666;
                               color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">
                            Cancel
                        </button>
                    </div>
                    <div style="margin-top: 15px; font-size: 11px; color: #888;">
                        💡 This name appears in Halloween UI elements and notifications
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Focus the input
            const input = document.getElementById('halloween-faction-input');
            input.focus();
            input.select();

            // Event handlers
            document.getElementById('apply-faction').onclick = () => {
                const newName = input.value.trim();
                if (newName) {
                    GM_setValue('halloween_faction_name', newName);
                    this.updateMenuContent(); // Refresh menu to show new name
                    HalloweenDebug.log(2, '🎃 Faction name updated to:', newName);
                }
                document.body.removeChild(modal);
            };

            document.getElementById('cancel-faction').onclick = () => {
                document.body.removeChild(modal);
            };

            // Apply on Enter key
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('apply-faction').click();
                }
            };

            // Close on background click
            modal.onclick = (e) => {
                if (e.target === modal) document.body.removeChild(modal);
            };
        },

        getFactionName: function() {
            return GM_getValue('halloween_faction_name', 'Your Faction');
        },

        // Leader Mode Functions
        toggleLeaderMode: function() {
            HalloweenDebug.log(2, '🎃 toggleLeaderMode() function called!');
            const currentView = SeedManager.menuPanelView;
            const newView = currentView === 'leader' ? 'member' : 'leader';

            HalloweenDebug.log(2, '🎃 Toggling menu panel view from:', currentView, 'to:', newView);

            SeedManager.menuPanelView = newView;
            GM_setValue('halloween_menu_panel_view', newView);

            this.updateMenuContent();
            HalloweenDebug.log(2, '🎃 Menu panel view updated to:', SeedManager.menuPanelView);
        },

        generateLeaderSeed: function() {
            const newSeed = SeedManager.generateLeaderSeed();
            this.updateMenuContent();
            HalloweenDebug.log(1, '🎃 Generated new leader seed:', newSeed);
        },

        setLeaderSeed: function() {
            const input = document.getElementById('halloween-leader-seed-input');
            const newSeed = input.value.trim();

            if (newSeed) {
                const result = SeedManager.setLeaderSeed(newSeed);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    HalloweenDebug.log(1, '🎃 Leader seed loaded successfully');
                } else {
                    alert('Invalid leader seed format. Must be at least 8 characters.');
                }
            }
        },

        applyCustomization: function() {
            const newConfig = {
                primaryColor: document.getElementById('halloween-primary-color').value,
                secondaryColor: document.getElementById('halloween-secondary-color').value,
                menuPanelImage: document.querySelector('input[name="menu-panel-image"]:checked').value,
                tileImage: document.getElementById('halloween-tile-image').value.trim(),
                factionBanner: document.getElementById('halloween-banner-url').value.trim(),
                factionIcon: document.getElementById('halloween-icon-url').value.trim()
            };

            FactionConfig.setConfig(newConfig);
            this.updateMenuContent();
            HalloweenDebug.log(2, '🎃 Faction customization applied');
        },

        exportForLeaders: function() {
            const jsonString = FactionConfig.generateExportData(false);
            this.showExportDisplay(jsonString);
            HalloweenDebug.log(2, '🎃 Leader configuration exported');
        },

        exportForMembers: function() {
            const jsonString = FactionConfig.generateExportData(true);
            this.showExportDisplay(jsonString);
            HalloweenDebug.log(2, '🎃 Member configuration exported');
        },

        showExportDisplay: function(jsonString) {
            const container = document.getElementById('export-fallback-container');
            const textarea = document.getElementById('export-fallback-output');

            if (container && textarea) {
                textarea.value = jsonString;
                container.style.display = 'block';
                HalloweenDebug.log(2, '🎃 Export configuration displayed');
            }
        },

        hideExportFallback: function() {
            const container = document.getElementById('export-fallback-container');
            if (container) {
                container.style.display = 'none';
            }
        },

        importConfig: function() {
            const input = document.getElementById('halloween-import-json');
            const jsonString = input.value.trim();

            if (jsonString) {
                const result = FactionConfig.importData(jsonString);
                if (result) {
                    input.value = '';
                    this.updateMenuContent();
                    // Refresh Halloween announcements UI if announcements were imported
                    if (this.halloweenAnnouncements && this.populateAnnouncementFields) {
                        this.populateAnnouncementFields();
                    }
                    // Refresh ticker timing settings UI if settings were imported
                    if (this.populateTickerSettings) {
                        this.populateTickerSettings();
                    }
                    alert('Configuration imported successfully!');

                    // Apply the new configuration immediately
                    FactionConfig.applyConfig();

                    // Apply tile background if configured and backgrounds enabled (no delay for user action)
                    if (HalloweenUI.backgroundEnabled) {
                        const config = FactionConfig.getConfig();
                        if (config.tileImage) {
                            FactionConfig.applyCustomBackground(config.tileImage);
                        }
                    }
                } else {
                    alert('Failed to import configuration. Please check the JSON format.');
                }
            }
        },

        getPersonalStats: function() {
            // Use GM storage for verified defeats (from Firebase verification system)
            const defeatsArray = JSON.parse(GM_getValue('halloween_defeats_counted', '[]'));
            const encounters = JSON.parse(GM_getValue('halloween_encounters', '{}'));

            // Calculate total encounters (sum of all encounter counts)
            let totalEncounters = 0;
            Object.values(encounters).forEach(encounter => {
                totalEncounters += encounter.encounterCount || 1;
            });

            return {
                uniqueDefeats: defeatsArray.length, // GM defeats_counted is array of defender IDs
                totalDefeats: totalEncounters, // Keep this name for now to avoid breaking existing code
                uniqueEncounters: Object.keys(encounters).length // Direct count of unique player IDs
            };
        },

        // recordDefeat has been replaced by FirebaseDefeatVerification system
        // Defeats are now verified via Firebase and tracked in GM storage

        // Halloween Ticker Hijacking System
        initTickerHijacking: function() {
            // Check if ticker exists and announcements are enabled
            const ticker = document.querySelector('#news-ticker-slider-wrapper');
            if (!ticker || !this.halloweenAnnouncements || this.halloweenAnnouncements.length === 0) {
                return;
            }

            const enabledAnnouncements = this.halloweenAnnouncements.filter(ann => ann.enabled && ann.message.trim() !== '');
            if (enabledAnnouncements.length === 0) {
                return;
            }

            HalloweenDebug.log(1, '🎃 Initializing Halloween ticker hijacking...');
            this.currentAnnouncementIndex = 0;
            this.startTickerMonitoring();
        },

        startTickerMonitoring: function() {
            // Initial delay before first hijack
            setTimeout(() => {
                this.attemptTickerHijack();
            }, 5000);

            // Continue with regular intervals using dynamic frequency
            setInterval(() => {
                this.attemptTickerHijack();
            }, this.tickerFrequency || 15000); // Use saved frequency or default 15 seconds
        },

        attemptTickerHijack: function() {
            const headlineContent = document.querySelector('.headline-content span');
            if (!headlineContent) {
                HalloweenDebug.log(2, '🎃 No headline content found, skipping hijack');
                return;
            }

            // Check stability
            const currentContent = headlineContent.innerHTML;

            setTimeout(() => {
                const checkContent = document.querySelector('.headline-content span');
                if (checkContent && checkContent.innerHTML === currentContent) {
                    this.hijackTicker();
                } else {
                    HalloweenDebug.log(2, '🎃 Ticker unstable, skipping this cycle');
                }
            }, 500);
        },

        hijackTicker: function() {
            const headlineContent = document.querySelector('.headline-content span');
            const iconContainer = document.querySelector('.scroll-wrap svg') || document.querySelector('.scroll-wrap [class*="iconSVG"]');

            if (!headlineContent || !iconContainer) {
                HalloweenDebug.log(2, '🎃 Missing ticker elements');
                return;
            }

            const enabledAnnouncements = this.halloweenAnnouncements.filter(ann => ann.enabled && ann.message.trim() !== '');
            if (enabledAnnouncements.length === 0) {
                return;
            }

            // Store original content
            const originalContent = headlineContent.innerHTML;
            const originalIcon = iconContainer.outerHTML;

            // Get next announcement
            const selectedAnnouncement = enabledAnnouncements[this.currentAnnouncementIndex];
            this.currentAnnouncementIndex = (this.currentAnnouncementIndex + 1) % enabledAnnouncements.length;

            // Extract emoji and clean message
            const { emoji, cleanMessage } = this.extractEmojiFromMessage(selectedAnnouncement.message);

            // Apply Metal Mania font styling
            const styledMessage = this.applyHalloweenStyling(cleanMessage);

            // Replace icon if emoji exists
            if (emoji) {
                iconContainer.outerHTML = `<span style="font-size: 11px; display: inline-block; margin-right: 8px; padding: 1px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">${emoji}</span>`;
            }

            // Hijack ticker with styled message
            headlineContent.innerHTML = styledMessage;

            HalloweenDebug.log(1, '🎃 Ticker hijacked:', cleanMessage, emoji ? `| Icon: ${emoji}` : '');

            // Restore after configured duration
            setTimeout(() => {
                const currentHeadline = document.querySelector('.headline-content span');
                const currentIconSpan = document.querySelector('.scroll-wrap span');

                if (currentHeadline) {
                    currentHeadline.innerHTML = originalContent;
                }
                if (currentIconSpan && emoji) {
                    currentIconSpan.outerHTML = originalIcon;
                }
            }, this.tickerDuration || 4000); // Use saved duration or default 4 seconds
        },

        extractEmojiFromMessage: function(message) {
            const emojiRegex = /\p{Emoji}/u;
            const match = message.match(emojiRegex);

            if (match) {
                const emoji = match[0];
                const cleanMessage = message.substring(match.index + emoji.length).trim();
                return { emoji, cleanMessage };
            }

            return { emoji: null, cleanMessage: message.trim() };
        },

        applyHalloweenStyling: function(message) {
            return `<span style="font-family: 'Metal Mania', cursive; font-weight: normal; color: ${HalloweenUI.tickerColor}; font-size: 13px;">${message}</span>`;
        }
    };

    // Halloween Pumpkin Competition System
    const HalloweenCompetition = {
        // Effect tracking to prevent duplicate triggers
        triggeredEffects: new Set(),

        // Page pool caching (prevents repeated calls and log spam)
        _cachedPagePool: null,
        _pagePoolCacheKey: null,
        _pagePoolLoggedCallers: new Set(),

        // Competition configuration
        TESTING_MODE: false, // Set to true for testing (spawns every minute)
        TESTING_DISPLAY: 'single', // 'all' or 'single' for testing mode (default: single)
        USE_TEST_PAGES_ONLY: false, // When true in test mode, only uses test page

        // Test page (plain text, not encrypted)
        // TODO: Change back to 'https://www.torn.com/index.php' after war testing
        TEST_PAGE: 'https://www.torn.com/page.php?sid=travel',

        // Production pages (17 URLs) - Will be stored encrypted for members
        // Leaders see plain URLs, members get encrypted version via export
        PRODUCTION_PAGES: {
            // Exact match (12 URLs)
            exact: [
                'https://www.torn.com/index.php',
                'https://www.torn.com/gym.php',
                'https://www.torn.com/item.php',
                'https://www.torn.com/city.php',
                'https://www.torn.com/page.php?sid=stocks',
                'https://www.torn.com/casino.php',
                'https://www.torn.com/loader.php?sid=missions',
                'https://www.torn.com/hospitalview.php',
                'https://www.torn.com/calendar.php',
                'https://www.torn.com/page.php?sid=points',
                'https://www.torn.com/page.php?sid=awards',
                'https://www.torn.com/page.php?sid=events'
            ],
            // Base URL match with hash flexibility (3 URLs)
            hashFlexible: [
                'https://www.torn.com/page.php?sid=crimes',
                'https://www.torn.com/page.php?sid=hof',
                'https://www.torn.com/page.php?sid=ItemMarket'
            ],
            // Contains match (2 URLs)
            contains: [
                'https://www.torn.com/factions.php',
                'https://www.torn.com/forums.php'
            ]
        },

        // Get page pool based on current settings
        getPagePool: function() {
            // Generate cache key based on current settings
            const enchantedPagesCount = (typeof HalloweenUI !== 'undefined' &&
                HalloweenUI.competitionSettings &&
                HalloweenUI.competitionSettings.enchantedPages) ?
                HalloweenUI.competitionSettings.enchantedPages.length : 0;

            const cacheKey = `${this.TESTING_MODE}_${this.USE_TEST_PAGES_ONLY}_${enchantedPagesCount}`;

            // Return cached result if key matches
            if (this._cachedPagePool !== null && this._pagePoolCacheKey === cacheKey) {
                return this._cachedPagePool;
            }

            // Cache miss - regenerate page pool
            let pagePool;

            if (this.TESTING_MODE && this.USE_TEST_PAGES_ONLY) {
                // Testing mode with test pages only: return single test page
                pagePool = [{url: this.TEST_PAGE, matchType: 'exact'}];
            } else if (typeof HalloweenUI !== 'undefined' &&
                HalloweenUI.competitionSettings &&
                HalloweenUI.competitionSettings.enchantedPages &&
                HalloweenUI.competitionSettings.enchantedPages.length > 0) {

                // Use dynamic enchanted pages from settings ONLY
                pagePool = HalloweenUI.competitionSettings.enchantedPages.filter(page => page.url && page.url.trim() !== '');

                // Log with caller tracking to prevent spam
                const caller = new Error().stack.split('\n')[2]?.trim() || 'unknown';
                if (!this._pagePoolLoggedCallers.has(caller)) {
                    this._pagePoolLoggedCallers.add(caller);
                    HalloweenDebug.log(3, `🔮 Using ${pagePool.length} enchanted pages from settings`);
                }
            } else {
                // No pages configured - return empty array (no spawns)
                HalloweenDebug.log(3, `🔮 No enchanted pages configured - no spawns will occur`);
                pagePool = [];
            }

            // Cache the result
            this._cachedPagePool = pagePool;
            this._pagePoolCacheKey = cacheKey;

            return pagePool;
        },

        // Base pumpkin distribution rules (per day per player for 7-day competition)
        BASE_DAILY_DISTRIBUTION: {
            candy: 3,     // Most common
            pure: 3,      // Common
            cyber: 1.5,   // Uncommon (randomly rounds to 1 or 2)
            corrupt: 1,   // Rare
            gold: 3/7     // Ultra rare (3 spawns across 7 days)
        },

        // Get distribution adjusted for current competition duration
        getDynamicDistribution: function() {
            const competitionDuration = this.getCompetitionDuration();
            const distribution = {};

            // Scale most types proportionally
            for (const [type, baseDaily] of Object.entries(this.BASE_DAILY_DISTRIBUTION)) {
                if (type === 'gold') {
                    // Gold gets special handling
                    distribution[type] = 3 / Math.max(competitionDuration, 3); // Maintain ~3 total across competition
                } else {
                    // Other types maintain daily rate
                    distribution[type] = baseDaily;
                }
            }

            return distribution;
        },

        getCompetitionDuration: function() {
            // Get duration from HalloweenUI competition settings or default to 7
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                return HalloweenUI.competitionSettings.duration || 7;
            }
            return 7; // Default fallback
        },

        // Time blocks
        TIME_BLOCKS: {
            AM: { start: 6, end: 18 },   // 6am - 6pm
            PM: { start: 18, end: 6 }    // 6pm - 6am next day
        },

        // 2-hour spawn window duration
        SPAWN_DURATION_HOURS: 2,

        // Competition state
        isActive: false,
        competitionId: null,
        playerId: null,
        spawnSchedule: null,
        currentSpawns: new Map(), // Track active spawns
        lateJoinerAdjusted: false, // Track if late joiner adjustment has been done

        init: function() {
            HalloweenDebug.log(1, '🎃 Initializing Halloween Competition System...');

            // Check if competition should be active
            const seedInfo = SeedManager.getSeedInfo();
            this.playerId = GM_getValue('halloween_player_id', '');

            if (seedInfo.currentSeed && this.playerId) {
                this.activateCompetition(seedInfo.currentSeed);
            } else {
                HalloweenDebug.log(1, '🎃 Competition inactive - no seed or player ID');
            }
        },

        activateCompetition: function(seed) {
            HalloweenDebug.log(1, `🎃 Activating competition for player: ${this.playerId}`);

            this.isActive = true;
            this.competitionId = this.extractCompetitionId(seed);

            // Load logged expirations tracking to prevent duplicate Firebase logs
            const storedExpirations = GM_getValue('halloween_logged_expirations', '[]');
            try {
                this.loggedExpirations = new Set(JSON.parse(storedExpirations));
                HalloweenDebug.log(2, `🎃 Loaded ${this.loggedExpirations.size} previously logged expirations`);
            } catch (e) {
                this.loggedExpirations = new Set();
                HalloweenDebug.log(2, '🎃 Initialized empty expiration tracking');
            }

            // Generate unique spawn schedule for this player
            this.generateSpawnSchedule();

            // Select random spawn for single testing mode
            this.selectRandomTestSpawn();

            // Start monitoring for spawns
            this.startSpawnMonitoring();

            HalloweenDebug.log(1, '🎃 Competition activated successfully');
        },

        selectRandomTestSpawn: function() {
            if (this.spawnSchedule && this.spawnSchedule.length > 0) {
                // Testing mode: Cycle through pumpkin types in order
                const typeOrder = ['candy', 'pure', 'cyber', 'corrupt', 'gold'];

                // Load persisted type index from storage (survives page refreshes)
                if (this.currentTestTypeIndex === undefined) {
                    const stored = GM_getValue('halloween_test_type_index', 0);
                    this.currentTestTypeIndex = parseInt(stored, 10);
                }

                const targetType = typeOrder[this.currentTestTypeIndex];

                // Find first spawn of this type (ignore expiration for testing)
                const typeSpawn = this.spawnSchedule.find(spawn => spawn.pumpkinType === targetType);

                if (typeSpawn) {
                    this.selectedTestSpawn = typeSpawn.spawnId;
                    HalloweenDebug.log(2, `🎃 Selected test spawn: ${this.selectedTestSpawn} (${targetType}, index: ${this.currentTestTypeIndex}) for single mode`);
                } else {
                    // Fallback to first spawn if type not found
                    this.selectedTestSpawn = this.spawnSchedule[0].spawnId;
                    HalloweenDebug.log(2, `🎃 Type ${targetType} not found, using fallback: ${this.selectedTestSpawn}`);
                }

                // Move to next type for next collection/refresh and save to storage
                this.currentTestTypeIndex = (this.currentTestTypeIndex + 1) % typeOrder.length;
                GM_setValue('halloween_test_type_index', this.currentTestTypeIndex);
                HalloweenDebug.log(3, `🎃 Next test type will be: ${typeOrder[this.currentTestTypeIndex]} (index: ${this.currentTestTypeIndex})`);
            }
        },

        refreshSpawns: function() {
            // Hide all current spawns
            this.currentSpawns.forEach((spawn, spawnId) => {
                this.hidePumpkin(spawnId);
            });

            // If in single mode, select a new random spawn (only if respawn allowed)
            if (this.TESTING_MODE && this.TESTING_DISPLAY === 'single') {
                const respawnAllowed = document.getElementById('testing-respawn-allowed')?.checked ?? true;
                if (respawnAllowed) {
                    this.selectRandomTestSpawn();
                    HalloweenDebug.log(2, '🎃 Respawn allowed - selecting new random spawn');
                } else {
                    // Clear selected spawn to prevent respawn
                    this.selectedTestSpawn = null;
                    HalloweenDebug.log(2, '🎃 Respawn disabled - no new spawn until page reload');
                }
            }

            // Trigger immediate spawn check
            this.checkForSpawns();

            HalloweenDebug.log(2, `🎃 Spawns refreshed for ${this.TESTING_DISPLAY} mode`);
        },

        extractCompetitionId: function(seed) {
            // For now, use a simple hash of the seed
            // In production, this would extract from proper seed structure
            return 'halloween-2025';
        },

        generateSpawnSchedule: function() {
            // Check if schedule already exists in storage (with expired/collected flags)
            const storedSchedule = GM_getValue('halloween_spawn_schedule', null);
            if (storedSchedule) {
                try {
                    this.spawnSchedule = JSON.parse(storedSchedule);
                    HalloweenDebug.log(2, `🎃 Loaded existing spawn schedule from storage: ${this.spawnSchedule.length} spawns`);
                    return; // Use existing schedule (preserves expired/collected flags)
                } catch (e) {
                    HalloweenDebug.log(2, '🎃 Failed to parse stored schedule, generating new one');
                }
            }

            HalloweenDebug.log(2, '🎃 Generating spawn schedule...');

            const schedule = [];
            const pagePool = this.getPagePool();
            const competitionDuration = this.getCompetitionDuration();

            // Create deterministic random generator using player ID + competition ID + duration
            const randomSeed = this.hashString(this.playerId + this.competitionId + competitionDuration);
            const rng = this.createSeededRandom(randomSeed);

            // Generate spawns for competition duration
            for (let day = 1; day <= competitionDuration; day++) {
                const daySchedule = this.generateDaySchedule(day, rng, pagePool, competitionDuration);
                schedule.push(...daySchedule);
            }

            this.spawnSchedule = schedule;

            // Store schedule in GM_setValue for persistence
            GM_setValue('halloween_spawn_schedule', JSON.stringify(schedule));

            HalloweenDebug.log(2, `🎃 Generated ${schedule.length} spawn events across ${competitionDuration} days`);
        },

        generateDaySchedule: function(dayNumber, rng, pagePool, competitionDuration) {
            const daySpawns = [];

            // Get dynamic distribution based on competition duration
            const distribution = this.getDynamicDistribution();

            // For each pumpkin type, determine how many to spawn this day
            for (const [type, dailyCount] of Object.entries(distribution)) {
                let spawnCount;

                if (type === 'cyber') {
                    // Cyber: randomly 1 or 2 per day (average 1.5)
                    spawnCount = rng() < 0.5 ? 1 : 2;
                } else if (type === 'gold') {
                    // Gold: special handling with advanced distribution algorithm
                    const firstDay = Math.max(2, 1);
                    const lastDay = Math.max(competitionDuration - 1, competitionDuration);
                    const eligibleDays = Math.max(lastDay - firstDay + 1, 1);

                    if (dayNumber >= firstDay && dayNumber <= lastDay && competitionDuration >= 3) {
                        // Apply proportional scaling based on competition length
                        const targetGoldTotal = 3;
                        const chancePerDay = targetGoldTotal / eligibleDays;
                        spawnCount = rng() < chancePerDay ? 1 : 0;
                    } else if (competitionDuration < 3) {
                        // Special handling for shortened competition periods
                        const reducedChance = 3 / competitionDuration / competitionDuration;
                        spawnCount = rng() < reducedChance ? 1 : 0;
                    } else {
                        spawnCount = 0;
                    }
                } else {
                    spawnCount = Math.floor(dailyCount);
                }

                // Generate spawns for this type
                for (let i = 0; i < spawnCount; i++) {
                    const spawn = this.generateSingleSpawn(dayNumber, type, rng, pagePool);
                    if (spawn) {
                        daySpawns.push(spawn);
                    }
                }
            }

            return daySpawns;
        },

        generateSingleSpawn: function(dayNumber, pumpkinType, rng, pagePool) {
            // Select random page
            const pageIndex = Math.floor(rng() * pagePool.length);
            const pageUrl = pagePool[pageIndex];

            // Select random time block (AM or PM)
            const timeBlock = rng() < 0.5 ? 'AM' : 'PM';
            const blockConfig = this.TIME_BLOCKS[timeBlock];

            // Generate random time within the block
            let spawnHour, spawnMinute;

            if (this.TESTING_MODE) {
                // Testing mode: spawn every minute for easy testing
                spawnHour = Math.floor(rng() * 24);
                spawnMinute = Math.floor(rng() * 60);
            } else {
                // Production mode: proper time generation
                if (timeBlock === 'AM') {
                    spawnHour = blockConfig.start + Math.floor(rng() * (blockConfig.end - blockConfig.start));
                } else {
                    // PM block spans midnight
                    if (rng() < 0.5) {
                        spawnHour = blockConfig.start + Math.floor(rng() * (24 - blockConfig.start));
                    } else {
                        spawnHour = Math.floor(rng() * blockConfig.end);
                    }
                }
                spawnMinute = Math.floor(rng() * 60);
            }

            // Create spawn object
            const spawnId = `${this.playerId}-${pumpkinType}-day${dayNumber}-${timeBlock}-${Math.floor(rng() * 1000)}`;

            return {
                spawnId: spawnId,
                playerId: this.playerId,
                pumpkinType: pumpkinType,
                pageUrl: pageUrl,
                dayNumber: dayNumber,
                timeBlock: timeBlock,
                spawnTime: {
                    day: dayNumber,
                    hour: spawnHour,
                    minute: spawnMinute
                },
                windowDuration: this.SPAWN_DURATION_HOURS * 60, // minutes
                collected: false
            };
        },

        // Utility functions for deterministic randomization
        hashString: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash);
        },

        createSeededRandom: function(seed) {
            let state = seed;
            return function() {
                state = (state * 1664525 + 1013904223) % Math.pow(2, 32);
                return state / Math.pow(2, 32);
            };
        },

        startSpawnMonitoring: function() {
            HalloweenDebug.log(2, '🎃 Starting spawn monitoring...');

            // Check for spawns every 30 seconds in production, every 5 seconds in testing
            const checkInterval = this.TESTING_MODE ? 5000 : 30000;

            setInterval(() => {
                this.checkForSpawns();
            }, checkInterval);

            // Also check immediately
            this.checkForSpawns();
        },


        isSpawnActiveNow: function(spawn, currentTime) {
            // In testing mode, handle spawn display based on testing display mode
            if (this.TESTING_MODE) {
                // Testing mode: collected flag is for stats/Firebase only, not display
                // Type cycling handles variety, collected status persists for logging

                if (this.TESTING_DISPLAY === 'single') {
                    // Only show the selected random spawn for this session
                    return spawn.spawnId === this.selectedTestSpawn;
                } else {
                    // Show all spawns (default behavior)
                    return true;
                }
            }

            // Check if competition is active and configured
            if (!this.isCompetitionActive()) {
                return false;
            }

            // Get competition state from HalloweenUI
            const competitionState = this.getCompetitionState();
            if (competitionState.status !== 'active') {
                return false; // Competition not active
            }

            // Check if we're on the correct day
            if (spawn.dayNumber !== competitionState.currentDay) {
                return false; // Wrong day
            }

            // Check if we're in the spawn's time window (2-hour window)
            return this.isInSpawnTimeWindow(spawn, currentTime);
        },

        isCompetitionActive: function() {
            // Check if competition is enabled in UI settings
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                return HalloweenUI.competitionSettings.active;
            }
            return false;
        },

        getCompetitionState: function() {
            // Delegate to HalloweenUI for state management
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.getCompetitionState) {
                return HalloweenUI.getCompetitionState();
            }
            return { status: 'unconfigured' };
        },

        isInSpawnTimeWindow: function(spawn, currentTime) {
            try {
                const now = new Date(currentTime);

                // Get competition start date from UI settings
                const competitionStart = this.getCompetitionStartTime();
                if (!competitionStart || isNaN(competitionStart.getTime())) {
                    HalloweenDebug.log(2, `🎃 Invalid competition start time for spawn ${spawn.spawnId}`);
                    return false;
                }

                // Calculate the actual spawn date/time
                const spawnDate = new Date(competitionStart);
                spawnDate.setUTCDate(spawnDate.getUTCDate() + (spawn.dayNumber - 1));
                spawnDate.setUTCHours(spawn.spawnTime.hour, spawn.spawnTime.minute, 0, 0);

                // Validate spawn date
                if (isNaN(spawnDate.getTime())) {
                    HalloweenDebug.log(2, `🎃 Invalid spawn date calculated for spawn ${spawn.spawnId} - competitionStart: ${competitionStart}, dayNumber: ${spawn.dayNumber}, hour: ${spawn.spawnTime.hour}, minute: ${spawn.spawnTime.minute}`);
                    return false;
                }

                // Define 2-hour spawn window
                const windowStart = new Date(spawnDate);
                const windowEnd = new Date(spawnDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours

                // Check if current time is within spawn window
                const isInWindow = now >= windowStart && now <= windowEnd;

                HalloweenDebug.log(3, `🎃 Spawn ${spawn.spawnId}: window ${windowStart.toISOString()} to ${windowEnd.toISOString()}, current ${now.toISOString()}, active: ${isInWindow}`);

                return isInWindow;
            } catch (error) {
                HalloweenDebug.log(2, `🎃 Error checking spawn window for ${spawn.spawnId}: ${error.message}`);
                return false;
            }
        },

        getCompetitionStartTime: function() {
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.competitionSettings) {
                const { startDate, startTime } = HalloweenUI.competitionSettings;
                if (startDate && startTime) {
                    return new Date(`${startDate}T${startTime}:00.000Z`);
                }
            }
            return null;
        },

        // Late Joiner Logic - Handle players joining mid-competition
        adjustScheduleForLateJoiner: function() {
            const competitionState = this.getCompetitionState();

            if (competitionState.status === 'active' && this.spawnSchedule) {
                const currentDay = competitionState.currentDay;

                // Mark all spawns from past days as missed/expired
                const skippedLateJoiners = [];
                this.spawnSchedule.forEach(spawn => {
                    if (spawn.dayNumber < currentDay && !spawn.expired) {
                        spawn.expired = true;
                        HalloweenDebug.log(3, `🎃 Marked spawn ${spawn.spawnId} as expired (Day ${spawn.dayNumber} < Current Day ${currentDay})`);

                        // Log late joiner expiration to Firebase
                        const logged = this.logExpirationEvent(spawn, 'late_joiner', currentDay);
                        if (logged === false) {
                            skippedLateJoiners.push(spawn.spawnId);
                        }
                    }
                });

                // Log summary of skipped late joiner expirations
                if (skippedLateJoiners.length > 0) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Skipped ${skippedLateJoiners.length} already-logged expirations (late_joiner): [${skippedLateJoiners.join(', ')}]`);
                }

                // For current day, mark past spawns as expired
                const now = new Date();
                const skippedTimeExpired = [];
                this.spawnSchedule.forEach(spawn => {
                    if (spawn.dayNumber === currentDay) {
                        const spawnTime = this.getSpawnDateTime(spawn);
                        const windowEnd = new Date(spawnTime.getTime() + (2 * 60 * 60 * 1000));

                        if (now > windowEnd && !spawn.expired) {
                            spawn.expired = true;
                            HalloweenDebug.log(3, `🎃 Marked current day spawn ${spawn.spawnId} as expired (past window)`);

                            // Log time expired to Firebase
                            const logged = this.logExpirationEvent(spawn, 'time_expired', currentDay);
                            if (logged === false) {
                                skippedTimeExpired.push(spawn.spawnId);
                            }
                        }
                    }
                });

                // Log summary of skipped time expired expirations
                if (skippedTimeExpired.length > 0) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Skipped ${skippedTimeExpired.length} already-logged expirations (time_expired): [${skippedTimeExpired.join(', ')}]`);
                }

                // Save updated schedule with expired flags to GM storage (same pattern as collectPumpkin)
                GM_setValue('halloween_spawn_schedule', JSON.stringify(this.spawnSchedule));

                HalloweenDebug.log(2, `🎃 Late joiner adjustment completed for Day ${currentDay}`);
            }
        },

        getSpawnDateTime: function(spawn) {
            const competitionStart = this.getCompetitionStartTime();
            if (!competitionStart) return null;

            // Check if spawn has valid time data
            if (!spawn.spawnTime || spawn.spawnTime.hour === undefined || spawn.spawnTime.minute === undefined) {
                return null;
            }

            const spawnDate = new Date(competitionStart);
            spawnDate.setUTCDate(spawnDate.getUTCDate() + (spawn.dayNumber - 1));
            spawnDate.setUTCHours(spawn.spawnTime.hour, spawn.spawnTime.minute, 0, 0);

            return spawnDate;
        },

        // Enhanced spawn checking that respects expired status
        checkForSpawns: function() {
            if (!this.spawnSchedule || this.spawnSchedule.length === 0) {
                return;
            }

            const currentTime = Date.now();
            const currentUrl = window.location.href;

            // Adjust for late joiners (only once)
            if (!this.lateJoinerAdjusted) {
                this.adjustScheduleForLateJoiner();
                this.lateJoinerAdjusted = true;
            }

            // Get page pool ONCE before the loop (optimization to prevent repeated calls)
            const cachedPagePool = this.getPagePool();

            this.spawnSchedule.forEach(spawn => {
                // Skip expired spawns (except in testing mode)
                if (spawn.expired && !this.TESTING_MODE) {
                    return;
                }

                // Check if this spawn should be active now
                const isActive = this.isSpawnActiveNow(spawn, currentTime);

                // Page check: In testing mode, show on appropriate pages based on USE_TEST_PAGES_ONLY
                let isOnPage;
                if (this.TESTING_MODE) {
                    if (this.USE_TEST_PAGES_ONLY) {
                        // Testing mode with test pages only: show on test page
                        isOnPage = this.isOnCorrectPage({url: this.TEST_PAGE, matchType: 'exact'}, currentUrl);
                    } else {
                        // Testing mode with production pages: show on any production page (use cached pool)
                        isOnPage = cachedPagePool.some(pageConfig => this.isOnCorrectPage(pageConfig, currentUrl));
                    }
                } else {
                    // Production mode: show only on spawn's assigned page
                    isOnPage = this.isOnCorrectPage(spawn.pageUrl, currentUrl);
                }

                if (isActive && isOnPage) {
                    // Show the pumpkin if not already showing
                    if (!this.currentSpawns.has(spawn.spawnId)) {
                        this.showPumpkin(spawn);
                    }
                } else {
                    // Hide the pumpkin if it was showing
                    if (this.currentSpawns.has(spawn.spawnId)) {
                        this.hidePumpkin(spawn.spawnId);
                    }
                }
            });
        },

        isOnCorrectPage: function(pageConfig, currentUrl) {
            // Handle legacy format (string or regex)
            if (typeof pageConfig === 'string') {
                return currentUrl.includes(pageConfig);
            }
            if (pageConfig instanceof RegExp) {
                return pageConfig.test(currentUrl);
            }

            // New format: {url: string, matchType: 'exact'|'contains'|'hashFlexible'}
            if (pageConfig && typeof pageConfig === 'object' && pageConfig.url) {
                const { url, matchType } = pageConfig;

                switch (matchType) {
                    case 'exact':
                        // Exact string match
                        return currentUrl === url;

                    case 'contains':
                        // URL contains the string
                        return currentUrl.includes(url);

                    case 'hashFlexible':
                        // Match base URL, ignore hash fragments
                        const currentWithoutHash = currentUrl.split('#')[0];
                        return currentWithoutHash === url;

                    default:
                        // Default to contains for backward compatibility
                        return currentUrl.includes(url);
                }
            }

            return false;
        },

        showPumpkin: function(spawn) {
            HalloweenDebug.log(2, `🎃 Showing ${spawn.pumpkinType} pumpkin: ${spawn.spawnId}`);

            // Track that this spawn is active
            this.currentSpawns.set(spawn.spawnId, spawn);

            // Create visual pumpkin element on page
            this.createPumpkinElement(spawn);

            // Play spawn detection sound
            HalloweenDebug.log(2, '🎃 About to call playSpawnSound()');
            this.playSpawnSound();
            HalloweenDebug.log(2, '🎃 playSpawnSound() call completed');

            // Log spawn event to Firebase (future implementation)
            this.logSpawnEvent(spawn);
        },

        hidePumpkin: function(spawnId) {
            HalloweenDebug.log(2, `🎃 Hiding pumpkin: ${spawnId}`);

            // Remove from active spawns
            this.currentSpawns.delete(spawnId);

            // Remove visual pumpkin element from page
            this.removePumpkinElement(spawnId);
        },

        collectPumpkin: function(spawnId) {
            const spawn = this.currentSpawns.get(spawnId);
            if (!spawn) return false;

            HalloweenDebug.log(1, `🎃 Collecting ${spawn.pumpkinType} pumpkin: ${spawnId}`);

            // Mark as collected in schedule
            const scheduleSpawn = this.spawnSchedule.find(s => s.spawnId === spawnId);
            if (scheduleSpawn) {
                scheduleSpawn.collected = true;

                // Update stored schedule
                GM_setValue('halloween_spawn_schedule', JSON.stringify(this.spawnSchedule));

                // Update collectibles count
                this.updateCollectibleCount(spawn.pumpkinType);

                // Log collection event
                this.logCollectionEvent(spawn);

                // Fade out spawn audio
                this.fadeOutSpawnSound(3000); // 3 second fade out

                // Remove from active spawns (but don't hide yet - let animation play)
                this.currentSpawns.delete(spawnId);

                // Show notification (no collection sound)
                this.showCollectionFeedback(spawn);

                // In testing mode, refresh spawns to advance type (respects respawn setting)
                if (this.TESTING_MODE) {
                    // Delay slightly to let collection animation play
                    setTimeout(() => {
                        this.refreshSpawns();
                    }, 500);
                }

                return true;
            }

            return false;
        },

        updateCollectibleCount: function(pumpkinType) {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = JSON.parse(collectibles);

            counts[pumpkinType] = (counts[pumpkinType] || 0) + 1;

            GM_setValue('halloween_collectibles', JSON.stringify(counts));

            HalloweenDebug.log(2, `🎃 Updated ${pumpkinType} count to: ${counts[pumpkinType]}`);

            // Refresh menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        showCollectionFeedback: function(spawn) {
            // Delay notification to allow spin animation to be visible
            setTimeout(() => {
                this.createCollectionNotification(spawn);
            }, 300); // 300ms delay allows animation to be seen

            // Update UI immediately if menu is open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }

            HalloweenDebug.log(1, `🎃 Collection feedback shown for ${spawn.pumpkinType} pumpkin (delayed 300ms)`);
        },

        playSpawnSound: function() {
            HalloweenDebug.log(2, '🔊 playSpawnSound() called');

            try {
                const soundEnabled = GM_getValue('halloween_sound_enabled', false);
                HalloweenDebug.log(2, `🔊 Sound setting check: halloween_sound_enabled = "${soundEnabled}"`);

                if (soundEnabled) {
                    HalloweenDebug.log(2, '🔊 Creating audio element...');
                    // GitHub hosted Halloween pumpkin spawn sound (laughter)
                    this.currentSpawnAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-laughter-loop.mp3');
                    this.currentSpawnAudio.volume = 0.7;

                    // Check if we can load the audio file
                    this.currentSpawnAudio.addEventListener('canplaythrough', () => {
                        HalloweenDebug.log(2, '🔊 Audio file loaded successfully');
                    });

                    this.currentSpawnAudio.addEventListener('error', (e) => {
                        HalloweenDebug.log(1, '❌ Audio file failed to load:', e.message);
                    });

                    HalloweenDebug.log(2, '🔊 Attempting to play audio...');
                    this.currentSpawnAudio.play().then(() => {
                        HalloweenDebug.log(1, '✅ Pumpkin spawn sound played successfully');
                    }).catch(e => {
                        HalloweenDebug.log(1, '❌ Spawn sound failed to play:', e.message);
                        HalloweenDebug.log(2, `🔊 Audio error details: ${e.name} - ${e.message}`);

                        // Check if it's an autoplay policy issue
                        if (e.name === 'NotAllowedError') {
                            HalloweenDebug.log(1, '🚫 Chrome autoplay policy blocked audio - user interaction required');
                            HalloweenDebug.log(1, '💡 Try clicking anywhere on the page first, then refresh the pumpkin');
                        }
                    });
                } else {
                    HalloweenDebug.log(2, '🔇 Spawn sound disabled - setting is not "true"');
                }
            } catch (e) {
                HalloweenDebug.log(1, '❌ Spawn sound error:', e.message);
            }
        },

        fadeOutSpawnSound: function(duration = 500) {
            if (!this.currentSpawnAudio) return;

            HalloweenDebug.log(2, `🔊 Fading out spawn audio over ${duration}ms`);

            const audio = this.currentSpawnAudio;
            const startVolume = audio.volume;
            const fadeStep = startVolume / (duration / 50); // 50ms intervals

            const fadeInterval = setInterval(() => {
                if (audio.volume > fadeStep) {
                    audio.volume -= fadeStep;
                } else {
                    audio.volume = 0;
                    audio.pause();
                    clearInterval(fadeInterval);
                    HalloweenDebug.log(2, '🔊 Spawn audio faded out and stopped');
                }
            }, 50);
        },

        playCollectionSound: function() {
            // Collection sound removed - audio only plays on spawn detection
            HalloweenDebug.log(2, '🔇 Collection sound disabled - spawn detection audio only');
        },

        createCollectionNotification: function(spawn) {
            const pumpkinConfig = this.getPumpkinConfig(spawn.pumpkinType);

            // Create dramatic notification element with no background badge
            const notification = document.createElement('div');
            notification.className = 'halloween-collection-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.5);
                color: ${pumpkinConfig.textColor};
                font-family: 'Metal Mania', cursive;
                font-weight: normal;
                z-index: 10001;
                text-shadow:
                    0 0 20px ${pumpkinConfig.glowColor},
                    0 0 40px ${pumpkinConfig.glowColor},
                    0 0 60px ${pumpkinConfig.glowColor},
                    4px 4px 8px rgba(0,0,0,0.9);
                animation: collectionNotificationShow 2s ease-out forwards;
                pointer-events: none;
                user-select: none;
                text-align: center;
                filter: drop-shadow(0 0 30px ${pumpkinConfig.glowColor});
            `;

            // Set notification content with responsive sizing
            const rarity = this.getPumpkinRarity(spawn.pumpkinType);
            notification.innerHTML = `
                <div style="font-size: 4.5em; line-height: 1; margin-bottom: 0.2em; letter-spacing: 0.05em;">
                    PUMPKIN COLLECTED!
                </div>
                <div style="font-size: 2.7em; opacity: 0.9; letter-spacing: 0.03em;">
                    ${spawn.pumpkinType.toUpperCase()}
                </div>
                <div style="font-size: 1.65em; opacity: 0.7; margin-top: 0.2em;">
                    ${rarity}
                </div>
            `;

            document.body.appendChild(notification);

            // Remove notification on click or after 4 seconds
            notification.style.cursor = 'pointer';
            notification.style.pointerEvents = 'auto';

            const removeNotification = () => {
                if (notification.parentNode) {
                    notification.remove();
                }
            };

            notification.addEventListener('click', removeNotification);
            setTimeout(removeNotification, 4000);
        },

        showCompetitionEndNotification: function(totalAttacks, uniqueOpponents, totalDefeats) {
            // Create permanent celebration notification for Halloween competition end
            const notification = document.createElement('div');
            notification.id = 'halloween-competition-end-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(255, 140, 0, 0.95) 0%, rgba(255, 69, 0, 0.95) 100%);
                color: #fff;
                padding: 25px 35px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: bold;
                z-index: 10001;
                border: 3px solid #FFD700;
                box-shadow: 0 0 30px rgba(255, 140, 0, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3);
                text-align: center;
                max-width: 400px;
                cursor: pointer;
            `;

            notification.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 12px; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;">🎃 HALLOWEEN COMPETITION ENDED! 🎃</div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 15px; line-height: 1.5;">
                    Stats preserved: <strong>${totalAttacks}</strong> attacks, <strong>${uniqueOpponents}</strong> opponents, <strong>${totalDefeats}</strong> defeated
                </div>
                <div style="font-size: 10px; opacity: 0.7; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px;">
                    Click to dismiss \u2022 Won't show again until next reset
                </div>
            `;

            document.body.appendChild(notification);

            // Remove on click
            notification.addEventListener('click', () => {
                notification.remove();
            });
        },

        showSpookyTargetsEndNotification: function(isPreview = false) {
            // Check if already shown (skip for preview)
            if (!isPreview && GM_getValue('halloween_spooky_targets_end_shown', false)) {
                return;
            }

            // Create permanent celebration notification for Spooky Targets end
            const notification = document.createElement('div');
            notification.id = 'spooky-targets-end-notification';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, rgba(74, 20, 140, 0.95) 0%, rgba(40, 10, 90, 0.95) 100%);
                color: #fff;
                padding: 25px 35px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: bold;
                z-index: 10001;
                border: 3px solid #FFD700;
                box-shadow: 0 0 30px rgba(74, 20, 140, 0.8), inset 0 0 20px rgba(255, 215, 0, 0.3);
                text-align: center;
                max-width: 400px;
                cursor: pointer;
            `;

            notification.innerHTML = `
                <div style="font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Metal Mania', cursive; font-weight: normal; font-size: 20px; margin-bottom: 12px;">👻 SPOOKY TARGETS ENDED! 👻</div>
                <div style="font-size: 13px; opacity: 0.9; margin-bottom: 15px; line-height: 1.5;">
                    Final scores will be validated and shared soon!
                </div>
                <div style="font-size: 10px; opacity: 0.7; border-top: 1px solid rgba(255, 255, 255, 0.3); padding-top: 10px;">
                    Click to dismiss${isPreview ? ' \u2022 PREVIEW MODE' : ' \u2022 Won\'t show again until next reset'}
                </div>
            `;

            document.body.appendChild(notification);

            // Mark as shown (skip for preview)
            if (!isPreview) {
                GM_setValue('halloween_spooky_targets_end_shown', true);
            }

            // Remove on click
            notification.addEventListener('click', () => {
                notification.remove();
            });
        },

        getPumpkinRarity: function(pumpkinType) {
            const rarities = {
                gold: 'ULTRA RARE',
                corrupt: 'RARE',
                cyber: 'UNCOMMON',
                pure: 'COMMON',
                candy: 'COMMON'
            };
            return rarities[pumpkinType] || 'COMMON';
        },

        createPumpkinElement: function(spawn) {
            // Get pumpkin configuration based on type
            const pumpkinConfig = this.getPumpkinConfig(spawn.pumpkinType);

            // Calculate random position within safe viewport bounds
            const position = this.calculateRandomPosition();

            // Create pumpkin container
            const pumpkinElement = document.createElement('div');
            pumpkinElement.id = `halloween-pumpkin-${spawn.spawnId}`;
            pumpkinElement.className = `halloween-competition-pumpkin ${spawn.pumpkinType}-pumpkin`;
            pumpkinElement.style.cssText = `
                position: absolute;
                left: ${position.x}px;
                top: ${position.y}px;
                width: 45px;
                height: 45px;
                background-image: url('${pumpkinConfig.imageUrl}');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                cursor: pointer;
                z-index: 9999;
                animation: pumpkinThrob 2s ease-in-out infinite, ${pumpkinConfig.glowAnimation} 3s ease-in-out infinite;
                filter: drop-shadow(0 0 8px ${pumpkinConfig.glowColor});
                transition: transform 0.2s ease, filter 0.2s ease;
                user-select: none;
            `;

            // Add hover effects
            pumpkinElement.addEventListener('mouseenter', () => {
                pumpkinElement.style.transform = 'scale(1.1)';
                pumpkinElement.style.filter = `drop-shadow(0 0 12px ${pumpkinConfig.glowColor})`;
            });

            pumpkinElement.addEventListener('mouseleave', () => {
                pumpkinElement.style.transform = 'scale(1)';
                pumpkinElement.style.filter = `drop-shadow(0 0 8px ${pumpkinConfig.glowColor})`;
            });

            // Add click handler for collection
            pumpkinElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.collectPumpkin(spawn.spawnId)) {
                    // Successful collection animation (1.5 seconds to see the spin)
                    pumpkinElement.style.animation = 'pumpkinCollect 1.5s ease-out forwards';
                    setTimeout(() => {
                        this.removePumpkinElement(spawn.spawnId);
                    }, 1500);
                }
            });

            // Add to page
            document.body.appendChild(pumpkinElement);

            HalloweenDebug.log(3, `🎃 Created visual pumpkin at (${position.x}, ${position.y}): ${spawn.spawnId}`);
        },

        removePumpkinElement: function(spawnId) {
            const element = document.getElementById(`halloween-pumpkin-${spawnId}`);
            if (element) {
                element.remove();
                HalloweenDebug.log(3, `🎃 Removed visual pumpkin: ${spawnId}`);
            }
        },

        calculateRandomPosition: function() {
            // Get viewport dimensions
            const pageWidth = window.innerWidth;

            // Get actual content height, excluding pumpkin elements that may inflate page
            // Remove any existing pumpkins temporarily to get true content height
            const existingPumpkins = document.querySelectorAll('.halloween-competition-pumpkin');
            const pumpkinDisplay = [];
            existingPumpkins.forEach(p => {
                pumpkinDisplay.push(p.style.display);
                p.style.display = 'none';
            });

            const rawHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            // Restore pumpkin visibility
            existingPumpkins.forEach((p, i) => {
                p.style.display = pumpkinDisplay[i];
            });

            // Cap height to reasonable maximum (prevents rules page inflation bug)
            // Use viewport height * 3 as reasonable maximum for scrollable pages
            const maxReasonableHeight = window.innerHeight * 3;
            const pageHeight = Math.min(rawHeight, maxReasonableHeight);

            // Define safe margins
            const margin = 50;
            const pumpkinSize = 45;

            // Calculate safe bounds (use top 75% of page, avoid bottom 25%)
            const minX = margin;
            const maxX = pageWidth - margin - pumpkinSize;
            const minY = margin;
            const maxY = (pageHeight * 0.75) - margin - pumpkinSize; // Top 75% only

            // Generate random position
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

            HalloweenDebug.log(3, `🎃 Pumpkin position: x=${x}, y=${y} (raw: ${rawHeight}px, capped: ${pageHeight}px)`);

            return { x, y };
        },

        getPumpkinConfig: function(pumpkinType) {
            const configs = {
                gold: {
                    imageUrl: 'https://i.ibb.co/67ffM1nP/Gold.png',
                    glowColor: '#FFD700',
                    textColor: '#8B4513',
                    glowAnimation: 'pumpkinGoldGlow'
                },
                corrupt: {
                    imageUrl: 'https://i.ibb.co/FkpnKh7Z/Corrupt.png',
                    glowColor: '#8B0000',
                    textColor: '#3e5058',
                    glowAnimation: 'pumpkinCorruptGlow'
                },
                cyber: {
                    imageUrl: 'https://i.ibb.co/fdSK5bNM/Cyber.png',
                    glowColor: '#00FFFF',
                    textColor: '#632d9f',
                    glowAnimation: 'pumpkinCyberGlow'
                },
                pure: {
                    imageUrl: 'https://i.ibb.co/Xf7FR9gP/Pure.png',
                    glowColor: '#FFFFFF',
                    textColor: '#ff4500',
                    glowAnimation: 'pumpkinPureGlow'
                },
                candy: {
                    imageUrl: 'https://i.ibb.co/B5MKQf12/Candy.png',
                    glowColor: '#f398ba',
                    textColor: '#f22f73',
                    glowAnimation: 'pumpkinCandyGlow'
                }
            };

            return configs[pumpkinType] || configs.candy;
        },

        logSpawnEvent: function(spawn) {
            try {
                const eventData = {
                    eventType: 'pumpkin_spawn',
                    timestamp: new Date().toISOString(),
                    playerId: this.playerId,
                    spawnId: spawn.spawnId,
                    pumpkinType: spawn.pumpkinType,
                    dayNumber: spawn.dayNumber,
                    timeBlock: spawn.timeBlock,
                    pageUrl: spawn.pageUrl,
                    userAgent: navigator.userAgent.substring(0, 100), // Truncated for privacy
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    competitionDay: this.getCurrentCompetitionDay()
                };

                // Send to Firebase (simulated for now)
                this.sendToFirebase('spawn_events', eventData);

                HalloweenDebug.log(3, `🎃 [Firebase] Spawn event logged: ${spawn.spawnId}`);
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Spawn logging error: ${e.message}`);
            }
        },

        logCollectionEvent: function(spawn) {
            try {
                const eventData = {
                    eventType: 'pumpkin_collection',
                    timestamp: new Date().toISOString(),
                    playerId: this.playerId,
                    spawnId: spawn.spawnId,
                    pumpkinType: spawn.pumpkinType,
                    dayNumber: spawn.dayNumber,
                    timeBlock: spawn.timeBlock,
                    pageUrl: spawn.pageUrl,
                    collectionTime: performance.now(), // Time since page load
                    competitionDay: this.getCurrentCompetitionDay(),
                    totalCollected: this.getTotalCollectedCount(),
                    typeCollected: this.getTypeCollectedCount(spawn.pumpkinType)
                };

                // Send to Firebase (simulated for now)
                this.sendToFirebase('collection_events', eventData);

                HalloweenDebug.log(3, `🎃 [Firebase] Collection event logged: ${spawn.spawnId}`);
            } catch (e) {
                HalloweenDebug.log(2, `🎃 [Firebase] Collection logging error: ${e.message}`);
            }
        },

        sendToFirebase: function(collection, data) {
            const firebaseURL = FactionConfig.getConfig().collectionsFirebaseURL;

            if (!firebaseURL) {
                HalloweenDebug.log(2, '🎃 [Firebase] No collections Firebase URL configured - data not sent');
                return;
            }

            // Determine testing vs production mode
            const mode = HalloweenUI.competitionSettings.testingMode ? 'testing' : 'production';

            // Structure: /collection/mode/{playerId}/{spawnId}.json
            const path = `${collection}/${mode}/${this.playerId}/${data.spawnId}.json`;
            const url = `${firebaseURL}/${path}`;

            httpRequest({
                method: 'PUT',
                url: url,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        HalloweenDebug.log(3, `🎃 [Firebase] ${collection} logged: ${data.spawnId}`);
                    } else {
                        HalloweenDebug.log(2, `🎃 [Firebase] Error logging ${collection}: HTTP ${response.status}`);
                    }
                },
                onerror: function(error) {
                    HalloweenDebug.log(2, `🎃 [Firebase] Error logging ${collection}: ${error}`);
                }
            });
        },

        logExpirationEvent: function(spawn, expirationType, currentCompetitionDay) {
            // Check if already logged to prevent duplicates on every page load
            if (this.loggedExpirations && this.loggedExpirations.has(spawn.spawnId)) {
                return false; // Already logged, skip silently
            }

            // Calculate spawn window timing
            const spawnTime = this.getSpawnDateTime(spawn);
            if (!spawnTime || isNaN(spawnTime.getTime())) {
                HalloweenDebug.log(2, `🎃 [Firebase] Cannot log expiration - invalid spawn time for ${spawn.spawnId}`);
                return;
            }

            const spawnWindowStart = spawnTime.toISOString();
            const spawnWindowEnd = new Date(spawnTime.getTime() + (2 * 60 * 60 * 1000)).toISOString();

            const eventData = {
                eventType: 'pumpkin_expired',
                expirationType: expirationType,  // 'late_joiner' or 'time_expired'
                timestamp: new Date().toISOString(),

                // Spawn window timing (UTC)
                spawnWindowStart: spawnWindowStart,
                spawnWindowEnd: spawnWindowEnd,

                // Spawn details
                spawnId: spawn.spawnId,
                pumpkinType: spawn.pumpkinType,
                spawnDayNumber: spawn.dayNumber,
                currentCompetitionDay: currentCompetitionDay,
                timeBlock: spawn.timeBlock,
                pageUrl: spawn.pageUrl,

                // Player/mode context
                playerId: this.playerId,
                testingMode: this.TESTING_MODE,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };

            this.sendToFirebase('expiration_events', eventData);
            HalloweenDebug.log(3, `🎃 [Firebase] Expiration logged: ${spawn.spawnId} (${expirationType})`);

            // Mark as logged to prevent duplicate logging
            if (!this.loggedExpirations) {
                this.loggedExpirations = new Set();
            }
            this.loggedExpirations.add(spawn.spawnId);

            // Persist to GM storage
            GM_setValue('halloween_logged_expirations', JSON.stringify([...this.loggedExpirations]));

            return true; // Successfully logged
        },

        getCurrentCompetitionDay: function() {
            // Calculate which day of the competition we're on
            const startDateStr = GM_getValue('halloween_competition_start_date', '');
            const startTimeStr = GM_getValue('halloween_competition_start_time', '18:00');
            const duration = GM_getValue('halloween_competition_duration', 7);

            if (!startDateStr) {
                HalloweenDebug.log(2, '🎃 No competition start date set - defaulting to day 1');
                return 1;
            }

            // Combine date and time for accurate calculation
            const competitionStart = new Date(`${startDateStr}T${startTimeStr}:00Z`);
            const now = new Date();
            const diffTime = Math.abs(now - competitionStart);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Cap at configured competition duration
            return Math.min(diffDays, duration);
        },

        getTotalCollectedCount: function() {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = JSON.parse(collectibles);
            return Object.values(counts).reduce((sum, count) => sum + count, 0);
        },

        getTypeCollectedCount: function(pumpkinType) {
            const collectibles = GM_getValue('halloween_collectibles', '{}');
            const counts = JSON.parse(collectibles);
            return counts[pumpkinType] || 0;
        }
    };

    // Main Halloween Target Detection System
    const HalloweenTargets = {
        _initialized: false,
        spookyTargetsEnabled: false, // Cached state for performance

        evaluateSpookyTargetsState: function() {
            // Testing mode overrides everything - check FIRST
            const testingMode = GM_getValue('halloween_spooky_testing_mode', 'false') === 'true';
            if (testingMode) {
                this.spookyTargetsEnabled = true;
                HalloweenDebug.log(2, '🎃 Spooky targets enabled (TESTING MODE - overrides dates)');
                return; // Short-circuit - skip all other checks
            }

            // Normal logic only runs if NOT in testing mode
            const toggle = GM_getValue('halloween_spooky_targets_active', 'false') === 'true';
            if (!toggle) {
                this.spookyTargetsEnabled = false;
                HalloweenDebug.log(2, '🎃 Spooky targets disabled (toggle OFF)');
                return;
            }

            // Check if we've reached the start date/time
            const startDate = GM_getValue('halloween_spooky_start_date', '');
            const startTime = GM_getValue('halloween_spooky_start_time', '00:00');

            if (!startDate) {
                this.spookyTargetsEnabled = false;
                HalloweenDebug.log(2, '🎃 Spooky targets disabled (no start date configured)');
                return;
            }

            const now = new Date();
            const start = new Date(`${startDate}T${startTime}`);

            this.spookyTargetsEnabled = now >= start;
            HalloweenDebug.log(2, `🎃 Spooky targets ${this.spookyTargetsEnabled ? 'enabled' : 'disabled (start date not reached)'}`);
        },

        init: function() {
            // Prevent multiple initialization
            if (this._initialized) {
                HalloweenDebug.log(3, '🎃 Halloween Targets already initialized, skipping...');
                return;
            }

            HalloweenDebug.log(1, '🎃 Halloween Targets initializing...');

            // Evaluate spooky targets state on init
            this.evaluateSpookyTargetsState();

            // Create global functions with protection against overwriting
            if (!window.halloweenSeedInfo) {
                window.halloweenSeedInfo = function() {
                    const seedInfo = SeedManager.getSeedInfo();

                    // Security: Limit output for members
                    if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                        const limitedInfo = {
                            currentSeed: seedInfo.currentSeed,
                            targetCount: seedInfo.targetCount,
                            isCached: seedInfo.isCached
                        };
                        HalloweenDebug.log(3, '🎃 Current seed:', limitedInfo.currentSeed);
                        HalloweenDebug.log(3, '🎃 Target count:', limitedInfo.targetCount);
                        HalloweenDebug.log(3, '🎃 Is cached:', limitedInfo.isCached);
                        return limitedInfo;
                    }

                    // Full info for leaders
                    HalloweenDebug.log(3, '🎃 Current seed:', seedInfo.currentSeed);
                    HalloweenDebug.log(3, '🎃 Is leader mode:', seedInfo.isLeaderMode);
                    HalloweenDebug.log(3, '🎃 Target count:', seedInfo.targetCount);
                    HalloweenDebug.log(3, '🎃 Is cached:', seedInfo.isCached);
                    return seedInfo;
                };
            }

            if (!window.checkAPIQueue) {
                window.checkAPIQueue = function() {
                    console.log('HAL: === API Defeat Verification Status ===');
                    const pending = JSON.parse(GM_getValue('halloween_api_pending_verifications', '[]'));
                    const counted = JSON.parse(GM_getValue('halloween_defeats_counted', '[]'));
                    const unverified = JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));
                    console.log('HAL: API Pending:', pending);
                    console.log('HAL: Defeats Counted:', counted);
                    console.log('HAL: Unverified:', unverified);
                    return { pending, counted, unverified };
                };
            }

            // Expose checkAPIQueue to unsafeWindow for console access
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.checkAPIQueue = window.checkAPIQueue;
            }

            if (!window.halloweenDebugGeneration) {
                window.halloweenDebugGeneration = function() {
                    // Security: Require MASTER_LEADER_KEY for debug generation
                    if (typeof MASTER_LEADER_KEY === 'undefined' || !MASTER_LEADER_KEY) {
                        console.log('HAL: 🎃 halloweenDebugGeneration() requires leader authentication');
                        console.log('HAL: This function is only available to authorized leaders');
                        return { error: 'Leader authentication required' };
                    }

                    HalloweenDebug.log(3, '🔍 Target Generation Debug:');
                    const seed = SeedManager.getSeed('halloweenDebugGeneration');
                    HalloweenDebug.log(3, 'Current seed:', seed);

                    // Test each protection layer
                    const entropy = HalloweenMath.entropyPool();
                    const envFingerprint = HalloweenMath.environmentFingerprint();
                    HalloweenDebug.log(3, 'Entropy value:', entropy);
                    HalloweenDebug.log(3, 'Environment fingerprint:', envFingerprint);
                    HalloweenDebug.log(3, 'Fingerprint % 1000:', envFingerprint % 1000);
                    HalloweenDebug.log(3, 'Environment check passes:', (envFingerprint % 1000) >= 10);

                    // Test timing
                    const start = performance.now();
                    const targets = HalloweenMath.generateTargets(seed);
                    const duration = performance.now() - start;
                    HalloweenDebug.log(3, 'Generation duration (ms):', duration);
                    HalloweenDebug.log(3, 'Timing check passes:', duration <= 100);
                    HalloweenDebug.log(3, 'Generated targets:', targets);

                    return {
                        envCheck: (envFingerprint % 1000) >= 10,
                        timingCheck: duration <= 100,
                        targets: targets
                    };
                };
            }

            if (!window.halloweenMenu) {
                window.halloweenMenu = HalloweenUI.toggleMenu.bind(HalloweenUI);
            }


            // Initialize core systems first (so functions can reference them)
            this.initializeSystems();

            HalloweenDebug.log(2, '🎃 Global functions created successfully');
            this._initialized = true;

            // Add manual sound test function
            window.halloweenSoundTest = HalloweenTargets.playSpookySound.bind(HalloweenTargets);

            // Expose HalloweenDebug globally for console access
            window.HalloweenDebug = HalloweenDebug;
            // Also try unsafeWindow as fallback for userscript environments
            if (typeof unsafeWindow !== 'undefined') {
                unsafeWindow.HalloweenDebug = HalloweenDebug;
            }

            // Add encrypted storage verification functions
            window.halloweenVerifyEncryption = function() {
                const encryptedTargets = GM_getValue('halloween_targets_cache_encrypted');
                const encryptedSeed = GM_getValue('halloween_targets_seed_encrypted');
                const currentSeed = SeedManager.getSeed();
                const encryptionKey = StorageCrypto.generateKey(currentSeed);

                HalloweenDebug.log(3, '🔐 Encryption Verification:');
                HalloweenDebug.log(3, 'Encrypted targets exist:', !!encryptedTargets);
                HalloweenDebug.log(3, 'Encrypted seed exists:', !!encryptedSeed);
                HalloweenDebug.log(3, 'Raw encrypted data (should be gibberish):', encryptedTargets?.substring(0, 50) + '...');

                if (encryptedTargets && encryptedSeed) {
                    const decryptedSeed = StorageCrypto.decrypt(encryptedSeed, encryptionKey);
                    HalloweenDebug.log(3, 'Decrypted seed matches current:', decryptedSeed === currentSeed);
                    HalloweenDebug.log(3, 'Old localStorage entries exist:', !!localStorage.getItem('halloween_targets_cache'));
                }

                return {
                    encrypted: !!encryptedTargets,
                    secure: !localStorage.getItem('halloween_targets_cache'),
                    working: encryptedTargets && encryptedSeed
                };
            };

            window.halloweenStorageTest = function() {
                HalloweenDebug.log(3, '🧪 Storage Security Test:');
                HalloweenDebug.log(3, 'GM Storage Keys:', GM_listValues());
                HalloweenDebug.log(3, 'localStorage keys:', Object.keys(localStorage).filter(k => k.includes('halloween')));
                HalloweenDebug.log(3, 'Encryption Key (for current seed):', StorageCrypto.generateKey(SeedManager.getSeed()));
                return window.halloweenVerifyEncryption();
            };


            // Expose HalloweenUI functions globally for inline onclick handlers
            window.HalloweenUI = HalloweenUI;
        },

        // Consolidated initialization system
        initializeSystems: function() {
            // Initialize seed system
            SeedManager.getSeed(); // Load current seed
            const initialTargets = SeedManager.getTargets(); // Generate/load targets

            // Initialize Halloween UI (with protection against multiple calls)
            if (typeof HalloweenUI._uiInitialized === 'undefined' || !HalloweenUI._uiInitialized) {
                HalloweenUI.init();
                HalloweenUI._uiInitialized = true;
            }

            // Add Halloween styling (with protection against multiple calls)
            if (typeof HalloweenEffects._stylesheetInitialized === 'undefined' || !HalloweenEffects._stylesheetInitialized) {
                HalloweenEffects.addStylesheet();
                HalloweenEffects._stylesheetInitialized = true;
            }

            // Apply faction configuration first
            FactionConfig.applyConfig();

            // Apply background effects if enabled (with delay for Torn CSS to load on mobile)
            if (HalloweenUI.backgroundEnabled) {
                if (typeof HalloweenEffects._backgroundInitialized === 'undefined' || !HalloweenEffects._backgroundInitialized) {
                    setTimeout(() => {
                        document.body.classList.add('halloween-background-enabled');
                        HalloweenEffects.applyGenericHalloweenBackground();
                        // Apply tile background if configured
                        const config = FactionConfig.getConfig();
                        if (config.tileImage) {
                            FactionConfig.applyCustomBackground(config.tileImage);
                        }
                        HalloweenEffects._backgroundInitialized = true;
                    }, 150); // 150ms delay for mobile network CSS loading
                }
            }

            // Start monitoring for targets
            this.startTargetDetection();

            // Show available debug commands and current status
            const seedInfo = SeedManager.getSeedInfo();
            console.log('HAL: 🎃 Halloween Targets v1.0 - Coordinated Edition');
            console.log('HAL: Current Seed:', seedInfo.currentSeed);
            console.log('HAL: Target Count:', seedInfo.targetCount, 'pairs (hidden for competitive gameplay)');
            console.log('HAL: Potential Targets: ~' + seedInfo.totalPotentialTargets.toLocaleString());
            HalloweenDebug.log(1, '\n📋 Available Commands:');
            HalloweenDebug.log(1, '   window.halloweenSeedInfo() - Current seed information');
            HalloweenDebug.log(1, '   window.halloweenDebugGeneration() - Debug target generation');
            HalloweenDebug.log(1, '   window.halloweenMenu() - Toggle Halloween menu');

            console.log('HAL: 🎃 Halloween Targets initialized successfully 🎃');
        },

        startTargetDetection: function() {
            // Prevent multiple detection instances
            if (this._detectionStarted) {
                HalloweenDebug.log(3, '🎯 Target detection already started, skipping...');
                return;
            }
            this._detectionStarted = true;

            // Initialize triggeredEffects Set if not already created
            if (!this.triggeredEffects) {
                this.triggeredEffects = new Set();
                HalloweenDebug.log(1, '🔄 Initialized triggeredEffects Set');
            }
            const checkForTargets = () => {
                HalloweenDebug.log(1, '🎯 checkForTargets() called on URL:', location.href);

                // Performance optimization - only run on relevant pages
                if (!PageDetector.isRelevantPage()) {
                    HalloweenDebug.log(2, 'Skipping irrelevant page:', location.href);
                    return;
                }

                const playerID = PageDetector.extractPlayerID();
                HalloweenDebug.log(1, '🎯 Extracted player ID:', playerID);
                if (!playerID) {
                    HalloweenDebug.log(2, '❌ No player ID found on page');
                    return;
                }

                // Early exit if both systems are disabled
                const bountyConfig = BountyManager.getConfig();
                const bountiesEnabled = bountyConfig.active;
                const spookyEnabled = this.spookyTargetsEnabled;

                if (!bountiesEnabled && !spookyEnabled) {
                    HalloweenDebug.log(1, '🎯 Both spooky targets and bounties disabled - skipping all detection');
                    return;
                }

                HalloweenDebug.log(2, '🎯 isProfilePage():', PageDetector.isProfilePage());
                HalloweenDebug.log(2, '🎯 isAttackPage():', PageDetector.isAttackPage());
                HalloweenDebug.log(2, '🎯 isRelevantPage():', PageDetector.isRelevantPage());

                const lastTwoDigits = playerID.slice(-2);
                HalloweenDebug.log(1, `Checking player ID: ${playerID}, last two digits: ${lastTwoDigits}`);

                // Check for daily bounties FIRST if enabled (bounty effects supersede spooky effects)
                if (bountiesEnabled) {
                    const bounty = BountyManager.getActiveBounty(location.href);
                    if (bounty) {
                        this.onBountyFound(playerID, bounty);
                    }
                }

                // Then check for spooky targets if enabled (will skip visual effects if bounty already triggered)
                if (spookyEnabled) {
                    // Get cached targets using seed system
                    const start = performance.now();
                    const targets = SeedManager.getTargets();
                    const duration = performance.now() - start;

                    HalloweenDebug.log(1, `Target retrieval took ${duration.toFixed(2)}ms`);
                    HalloweenDebug.log(1, 'Current seed:', SeedManager.getSeed());
                    HalloweenDebug.log(1, `Loaded ${targets.length} target pairs (hidden for competitive gameplay)`);

                    if (SeedManager.checkTarget(lastTwoDigits)) {
                        this.onTargetFound(playerID, lastTwoDigits);
                    }
                }
            };

            // Throttled checking to prevent excessive computation
            let checkTimeout;
            const throttledCheck = () => {
                clearTimeout(checkTimeout);
                checkTimeout = setTimeout(checkForTargets, 50);
            };

            // Check immediately
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', throttledCheck);
            } else {
                throttledCheck();
            }

            // Monitor for navigation changes
            let lastUrl = location.href;
            const observer = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    HalloweenDebug.log(2, 'Navigation detected:', location.href);
                    // Clear triggered effects on navigation to allow effects on new page
                    this.triggeredEffects.clear();
                    HalloweenDebug.log(2, '🔄 Cleared triggered effects for new page');

                    // Check for API refresh on navigation (event-driven optimization)
                    if (APIDefeatVerification.isAPIMode()) {
                        APIDefeatVerification.checkAttackLogRefresh();
                        BountyManager.processBountyVerifications();
                    }

                    // Run check immediately on navigation (no throttle for navigation)
                    checkForTargets();
                }
            });

            // Only observe body changes if it exists
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, { childList: true, subtree: true });
                });
            }
        },

        onTargetFound: function(playerID, digits) {
            // Create unique key for this target trigger
            const effectKey = `target_${playerID}_${digits}`;

            // Check if we've already triggered effects for this target
            if (this.triggeredEffects.has(effectKey)) {
                HalloweenDebug.log(2, '🎯 Target effects already triggered for', effectKey, 'skipping...');
                return;
            }

            // Check if a bounty effect was already triggered for this player (bounty supersedes spooky)
            const bountyEffectPattern = `bounty_${playerID}_`;
            const hasBountyEffect = Array.from(this.triggeredEffects).some(key => key.startsWith(bountyEffectPattern));

            if (hasBountyEffect) {
                HalloweenDebug.log(2, '🎯 Bounty effect already triggered for this player, skipping spooky effects (bounty supersedes)');
                // Still mark as triggered and store data, just skip visual/audio effects
                this.triggeredEffects.add(effectKey);
                const seedInfo = SeedManager.getSeedInfo();
                this.storeTargetData(playerID, digits, seedInfo.currentSeed);
                if (HalloweenUI.menuOpen) {
                    HalloweenUI.updateMenuContent();
                }
                return;
            }

            // Mark as triggered
            this.triggeredEffects.add(effectKey);

            const seedInfo = SeedManager.getSeedInfo();
            HalloweenDebug.log(0, `🎯 TARGET FOUND! Player ID: ${playerID}, Digits: ${digits}`);
            HalloweenDebug.log(0, `Using seed: ${seedInfo.currentSeed}`);

            // Apply Halloween background if enabled (may already be applied from page load)
            if (HalloweenUI.backgroundEnabled) {
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            }

            // Create enhanced visual effects (PROFILE PAGES ONLY)
            let spookyEffect = null;
            let screenOverlay = null;

            if (PageDetector.isProfilePage()) {
                spookyEffect = HalloweenEffects.createSpookyEffect();
                screenOverlay = HalloweenEffects.createScreenOverlay();

                document.body.appendChild(spookyEffect);
                document.body.appendChild(screenOverlay);

                // Highlight player elements
                this.highlightPlayerElements();
            }

            // Play spooky sound effect if enabled
            HalloweenDebug.log(2, '🔊 TARGET AUDIO DEBUG: HalloweenUI.soundEnabled =', HalloweenUI.soundEnabled);
            HalloweenDebug.log(2, '🔊 TARGET AUDIO DEBUG: GM halloween_sound_enabled =', GM_getValue('halloween_sound_enabled', false));

            if (HalloweenUI.soundEnabled) {
                HalloweenDebug.log(0, '🔊 Sound is enabled, attempting to play spooky sound...');
                this.playSpookySound();
            } else {
                HalloweenDebug.log(0, '🔇 Sound is disabled in settings - need to toggle Spectral Echoes ON');
            }

            // Auto-remove effects after animation (only if they were created)
            if (spookyEffect) {
                setTimeout(() => {
                    spookyEffect.remove();
                }, 4000);
            }


            // Store target data with seed info
            this.storeTargetData(playerID, digits, seedInfo.currentSeed);

            // Update UI menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        playSpookySound: function() {
            try {
                HalloweenDebug.log(1, '🎵 playSpookySound() called');
                // Simply play the sound - permission granted by menu click
                this.generateSpookySound();
            } catch (error) {
                HalloweenDebug.log(2, '❌ Could not play spooky sound:', error.message);
            }
        },

        generateSpookySound: function() {
            try {
                HalloweenDebug.log(1, '🔊 Playing horror whoosh audio...');

                // GitHub hosted Halloween target detection sound (whoosh)
                const audio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');

                // Set audio properties
                audio.volume = 0.7;
                audio.preload = 'auto';

                // Play the audio
                audio.play().then(() => {
                    HalloweenDebug.log(0, '🎵 Horror whoosh audio playing successfully');
                }).catch(error => {
                    HalloweenDebug.log(2, '❌ Failed to play horror whoosh audio:', error.message);
                });

            } catch (error) {
                HalloweenDebug.log(2, '❌ Could not load horror whoosh audio:', error.message);
            }
        },

        onBountyFound: function(playerID, bounty) {
            // Create unique key for this bounty trigger
            const effectKey = `bounty_${playerID}_${bounty.date}`;

            HalloweenDebug.log(1, `🔥 onBountyFound called for ${effectKey}`);
            HalloweenDebug.log(1, `🔥 Current triggeredEffects:`, Array.from(this.triggeredEffects));

            // Check if we've already triggered effects for this bounty
            if (this.triggeredEffects.has(effectKey)) {
                HalloweenDebug.log(1, `🔥 Bounty effects already triggered for ${effectKey}, skipping...`);
                return;
            }

            // Mark as triggered
            this.triggeredEffects.add(effectKey);
            HalloweenDebug.log(1, `🔥 BOUNTY FOUND! Player ID: ${playerID}, Date: ${bounty.date}`);

            // Apply Halloween background if enabled
            if (HalloweenUI.backgroundEnabled) {
                const config = FactionConfig.getConfig();
                if (config.tileImage) {
                    FactionConfig.applyCustomBackground(config.tileImage);
                }
            }

            // Create red bounty effects (PROFILE PAGES ONLY)
            if (PageDetector.isProfilePage()) {
                const bountyEffect = HalloweenEffects.createBountyEffect();
                const screenOverlay = HalloweenEffects.createScreenOverlay();

                document.body.appendChild(bountyEffect);
                document.body.appendChild(screenOverlay);

                // Highlight player elements with red bounty styling
                this.highlightPlayerElementsForBounty();

                // Auto-remove effects after animation
                setTimeout(() => {
                    bountyEffect.remove();
                }, 4000);
            }

            // Play sound if enabled
            if (HalloweenUI.soundEnabled) {
                this.playSpookySound();
            }

            // Store bounty encounter
            const claim = BountyManager.getClaim(playerID);
            if (!claim || !claim.verified) {
                BountyManager.setClaim(playerID, {
                    date: bounty.date,
                    verified: false,
                    encounterTime: Date.now(),
                    scheduledCheck: Date.now() + (15 * 60 * 1000) // 15 min from now
                });
                HalloweenDebug.log(1, `Bounty encounter stored, verification scheduled for 15 minutes`);
            }

            // Update UI menu if open
            if (HalloweenUI.menuOpen) {
                HalloweenUI.updateMenuContent();
            }
        },

        highlightPlayerElementsForBounty: function() {
            // Same selectors as spooky targets
            const selectors = [
                '.profile-wrapper .profile-left-wrapper',
                '.profile-status'
            ];

            HalloweenDebug.log(3, '🔥 BOUNTY HIGHLIGHTING: Applying halloween-bounty-highlight class...');
            let totalHighlighted = 0;

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Found ${elements.length} elements for selector: ${selector}`);
                elements.forEach(el => {
                    el.classList.add('halloween-bounty-highlight');
                    el.classList.add('throb'); // Use throb animation
                    totalHighlighted++;
                    HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Applied class to:`, el.tagName, el.className);
                });
            });

            HalloweenDebug.log(3, `🔥 BOUNTY HIGHLIGHTING: Total elements highlighted: ${totalHighlighted}`);
        },

        highlightPlayerElements: function() {
            // First, let's see what the actual DOM looks like
            HalloweenDebug.log(3, '🎃 DOM DEBUG: Looking for profile-related elements...');
            const profileDivs = document.querySelectorAll('div[class*="profile"]');
            const containerDivs = document.querySelectorAll('div[class*="container"]');
            HalloweenDebug.log(3, `🎃 DOM DEBUG: Found ${profileDivs.length} divs with "profile" in class name`);
            HalloweenDebug.log(3, `🎃 DOM DEBUG: Found ${containerDivs.length} divs with "container" in class name`);

            profileDivs.forEach((div, i) => {
                HalloweenDebug.log(3, `🎃 DOM DEBUG Profile div ${i}:`, div.className);
            });

            containerDivs.forEach((div, i) => {
                HalloweenDebug.log(3, `🎃 DOM DEBUG Container div ${i}:`, div.className);
            });

            const selectors = [
                '.profile-wrapper .profile-left-wrapper',
                '.profile-status'
            ];

            HalloweenDebug.log(3, '🎃 HIGHLIGHTING: Starting to apply halloween-target-highlight class...');
            let totalHighlighted = 0;

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Found ${elements.length} elements for selector: ${selector}`);
                elements.forEach(el => {
                    el.classList.add('halloween-target-highlight');
                    el.classList.add('throb'); // Always use throb animation
                    totalHighlighted++;
                    HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Applied class to:`, el.tagName, el.className);
                });
            });

            HalloweenDebug.log(3, `🎃 HIGHLIGHTING: Total elements highlighted: ${totalHighlighted}`);

            // EXTREME DEBUG: Let's manually check everything
            const allElements = document.querySelectorAll('.halloween-target-highlight');
            HalloweenDebug.log(3, `🎃 EXTREME DEBUG: Found ${allElements.length} elements with halloween-target-highlight class`);

            allElements.forEach((el, index) => {
                const styles = window.getComputedStyle(el);
                HalloweenDebug.log(3, `🎃 EXTREME DEBUG Element ${index}:`, {
                    element: el,
                    tagName: el.tagName,
                    className: el.className,
                    animation: styles.animation,
                    background: styles.background,
                    border: styles.border,
                    boxShadow: styles.boxShadow,
                    position: styles.position,
                    transform: styles.transform
                });
            });

            // Also check if CSS is loaded with a test element
            const testEl = document.createElement('div');
            testEl.className = 'halloween-target-highlight';
            testEl.style.position = 'fixed';
            testEl.style.top = '10px';
            testEl.style.left = '10px';
            testEl.style.width = '100px';
            testEl.style.height = '50px';
            testEl.style.zIndex = '9999';
            testEl.textContent = 'TEST';
            document.body.appendChild(testEl);

            setTimeout(() => {
                const computedStyle = window.getComputedStyle(testEl);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element animation:`, computedStyle.animation);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element background:`, computedStyle.background);
                HalloweenDebug.log(3, `🎃 CSS CHECK: Test element visible:`, testEl.offsetHeight > 0);
                // Keep test element visible for 5 seconds so you can see it
                setTimeout(() => testEl.remove(), 5000);
            }, 100);
        },

        storeTargetData: function(playerID, digits, seed) {
            // Get current encounters object from GM storage
            const encounters = JSON.parse(GM_getValue('halloween_encounters', '{}'));

            const currentTime = Date.now();
            const encounterData = {
                digits,
                seed,
                lastEncounter: currentTime,
                url: location.href
            };

            // Update or create encounter record
            if (encounters[playerID]) {
                // Existing target - increment count and update data
                encounters[playerID].encounterCount += 1;
                encounters[playerID].lastEncounter = currentTime;
                encounters[playerID].url = location.href; // Update to latest URL
            } else {
                // New target - create record
                encounters[playerID] = {
                    ...encounterData,
                    encounterCount: 1,
                    firstEncounter: currentTime
                };
            }

            // Save to GM storage
            GM_setValue('halloween_encounters', JSON.stringify(encounters));
            HalloweenDebug.log(1, 'Target encounter stored:', playerID, encounters[playerID]);
        },

        // ===================================
        // SPOOKY TARGET VALIDATION
        // ===================================

        isSpookyTarget: function(defenderId) {
            if (!defenderId) return false;

            // Get last 2 digits
            const lastTwoDigits = defenderId.toString().slice(-2).padStart(2, '0');

            // Check against seed
            const isTarget = SeedManager.checkTarget(lastTwoDigits);

            if (isTarget) {
                HalloweenDebug.log(2, `HAL: 🎃 Spooky target detected: ${defenderId} (${lastTwoDigits})`);
            }

            return isTarget;
        }
    };

    // ===================================
    // FIREBASE DEFEAT VERIFICATION MODULE
    // ===================================
    const FirebaseDefeatVerification = {
        // Firebase configuration (will be set from menu panel)
        getFirebaseURL: function() {
            const config = FactionConfig.getConfig();
            return config.attackLogsFirebaseURL || null;
        },

        // ===================================
        // GM STORAGE MANAGEMENT
        // ===================================

        getCountedDefeats: function() {
            try {
                return JSON.parse(GM_getValue('halloween_defeats_counted', '[]'));
            } catch (e) {
                return [];
            }
        },

        addCountedDefeat: function(defenderId) {
            const counted = this.getCountedDefeats();
            if (!counted.includes(defenderId)) {
                counted.push(defenderId);
                GM_setValue('halloween_defeats_counted', JSON.stringify(counted));
                return true;
            }
            return false;
        },

        isAlreadyCounted: function(defenderId) {
            return this.getCountedDefeats().includes(defenderId);
        },

        getVerifyQueue: function() {
            try {
                return JSON.parse(GM_getValue('halloween_verify_queue', '[]'));
            } catch (e) {
                return [];
            }
        },

        setVerifyQueue: function(queue) {
            GM_setValue('halloween_verify_queue', JSON.stringify(queue));
        },

        updateQueueTimestamp: function(defenderId, newTimestamp) {
            const queue = this.getVerifyQueue();
            const entry = queue.find(item => item.defenderId === defenderId);

            if (entry) {
                const oldTimestamp = entry.attackTimestamp;
                entry.attackTimestamp = newTimestamp;
                this.setVerifyQueue(queue);

                HalloweenDebug.log(2, `⏱️ Updated timestamp for defender ${defenderId}: ${oldTimestamp} → ${newTimestamp} (${newTimestamp - oldTimestamp}s later)`);
            } else {
                HalloweenDebug.log(3, `⚠️ Could not update timestamp for defender ${defenderId} - not found in queue`);
            }
        },

        getFailedQueue: function() {
            try {
                return JSON.parse(GM_getValue('halloween_verify_failed', '[]'));
            } catch (e) {
                return [];
            }
        },

        setFailedQueue: function(queue) {
            GM_setValue('halloween_verify_failed', JSON.stringify(queue));
        },

        getUnverified: function() {
            try {
                return JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));
            } catch (e) {
                return [];
            }
        },

        addUnverified: function(defenderId, reason) {
            const unverified = this.getUnverified();
            unverified.push({
                defenderId: defenderId,
                reason: reason,
                checkedAt: Math.floor(Date.now() / 1000)
            });
            GM_setValue('halloween_defeats_unverified', JSON.stringify(unverified));
        },

        // ===================================
        // FIREBASE AUTHENTICATION
        // ===================================

        getFirebaseAuthToken: async function() {
            // Get API key from faction config (set by leader, distributed via import)
            const config = FactionConfig.getConfig();
            const apiKey = config.rtdbKey;

            if (!apiKey) {
                throw new Error('Database key not configured - contact faction leadership');
            }

            // Check cache first (tokens valid for 1 hour)
            const cachedToken = GM_getValue('firebase_auth_token', null);
            const cachedExpiry = GM_getValue('firebase_auth_expiry', 0);
            const now = Math.floor(Date.now() / 1000);

            if (cachedToken && cachedExpiry > now) {
                return cachedToken;
            }

            // Get new anonymous auth token
            const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

            return new Promise((resolve, reject) => {
                httpRequest({
                    method: 'POST',
                    url: authUrl,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ returnSecureToken: true }),
                    onload: function(response) {
                        try {
                            const authData = JSON.parse(response.responseText);

                            if (authData.idToken) {
                                const token = authData.idToken;
                                const expiresIn = parseInt(authData.expiresIn) || 3600; // Default 1 hour
                                const expiry = now + expiresIn - 60; // Refresh 1 min early

                                // Cache token
                                GM_setValue('firebase_auth_token', token);
                                GM_setValue('firebase_auth_expiry', expiry);

                                HalloweenDebug.log(3, '🔥 Firebase auth token obtained');
                                resolve(token);
                            } else {
                                HalloweenDebug.log(1, '❌ Firebase auth failed: No token in response');
                                reject(new Error('No token in auth response'));
                            }
                        } catch (error) {
                            HalloweenDebug.log(1, `❌ Firebase auth error: ${error.message}`);
                            reject(error);
                        }
                    },
                    onerror: function(error) {
                        HalloweenDebug.log(1, `❌ Firebase auth request failed: ${error}`);
                        reject(new Error('Auth request failed'));
                    }
                });
            });
        },

        // ===================================
        // FIREBASE QUERY
        // ===================================

        queryFirebase: async function(defenderId) {
            const firebaseURL = this.getFirebaseURL();

            if (!firebaseURL) {
                return {
                    success: false,
                    error: 'Firebase URL not configured',
                    isServerError: false
                };
            }

            // Get auth token
            let token;
            try {
                token = await this.getFirebaseAuthToken();
            } catch (error) {
                return {
                    success: false,
                    error: `Auth failed: ${error.message}`,
                    isServerError: true
                };
            }

            const url = `${firebaseURL}/attacks-by-defender/${defenderId}.json?auth=${token}`;

            return new Promise((resolve) => {
                httpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({
                                    success: true,
                                    data: data || {},
                                    isServerError: false
                                });
                            } catch (error) {
                                resolve({
                                    success: false,
                                    error: `JSON parse error: ${error.message}`,
                                    isServerError: false
                                });
                            }
                        } else {
                            // Server error (500, 503, etc.)
                            resolve({
                                success: false,
                                error: `Firebase server error: ${response.status}`,
                                isServerError: true
                            });
                        }
                    },
                    onerror: function(error) {
                        // Network error, timeout, etc.
                        resolve({
                            success: false,
                            error: `Network error: ${error}`,
                            isServerError: true
                        });
                    }
                });
            });
        },

        // ===================================
        // VERIFICATION LOGIC
        // ===================================

        verifyDefeat: async function(defenderId, attackTimestamp) {
            const playerId = GM_getValue('halloween_player_id', '');

            if (!playerId) {
                HalloweenDebug.log(1, '❌ Cannot verify defeat: Player ID not set');
                return {
                    verified: false,
                    reason: 'player_id_not_set'
                };
            }

            // Query Firebase
            const result = await this.queryFirebase(defenderId);

            if (!result.success) {
                // Firebase query failed
                return {
                    verified: false,
                    reason: result.isServerError ? 'server_error' : 'query_failed',
                    error: result.error,
                    isServerError: result.isServerError
                };
            }

            // Parse attacks data
            const attacks = result.data;

            if (!attacks || Object.keys(attacks).length === 0) {
                // No attacks found for this defender
                return {
                    verified: false,
                    reason: 'no_attacks_found',
                    isServerError: false
                };
            }

            // Filter for qualifying attacks
            const qualifyingResults = ['Attacked', 'Hospitalized', 'Mugged'];

            for (const [attackCode, attack] of Object.entries(attacks)) {
                // Check if it's YOUR attack
                if (attack.attackerId.toString() !== playerId.toString()) {
                    continue;
                }

                // Check if attack happened during SPOOKY competition window
                const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                if (!spookyStartDate || !spookyEndDate) {
                    HalloweenDebug.log(1, '⚠️ Spooky competition dates not set');
                    continue;
                }

                const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}`).getTime() / 1000;
                const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}`).getTime() / 1000;

                if (attack.timestampStarted < spookyStart ||
                    attack.timestampStarted > spookyEnd) {
                    continue; // Outside spooky competition timeframe
                }

                // Check if result qualifies
                if (!qualifyingResults.includes(attack.result)) {
                    continue;
                }

                // Found a qualifying attack!
                HalloweenDebug.log(2, `✅ Defeat verified: ${attack.attackerName} ${attack.result} ${attack.defenderName}`);

                return {
                    verified: true,
                    attack: attack
                };
            }

            // No qualifying attacks found
            return {
                verified: false,
                reason: 'no_qualifying_attacks',
                isServerError: false
            };
        },

        // ===================================
        // QUEUE MANAGEMENT
        // ===================================

        addToQueue: function(defenderId, attackTimestamp) {
            // Skip if already confirmed as defeated
            if (this.isAlreadyCounted(defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already counted - skipping`);
                return;
            }

            const queue = this.getVerifyQueue();

            // Check if already in queue
            const existing = queue.find(item => item.defenderId === defenderId);
            if (existing) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already in verification queue`);
                return;
            }

            // If previously unverified, remove and give second chance
            // (User might have returned and actually attacked this time)
            const unverified = this.getUnverified();
            if (unverified.find(u => u.defenderId == defenderId)) {
                const filtered = unverified.filter(u => u.defenderId != defenderId);
                GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                HalloweenDebug.log(2, `♻️ Defender ${defenderId} removed from unverified, re-queueing`);
            }

            const now = Math.floor(Date.now() / 1000);
            queue.push({
                defenderId: defenderId,
                attackTimestamp: attackTimestamp,
                queuedAt: now, // Track when queued for 1-hour timeout
                attempts: 0,
                nextCheckTime: now + 60, // First check in 60 seconds (NEW)
                lastError: null
            });

            this.setVerifyQueue(queue);
            HalloweenDebug.log(2, `📝 Added defender ${defenderId} to verification queue`);

            // Start processing queue
            this.scheduleQueueProcessing();
        },

        scheduleQueueProcessing: function() {
            // Process queue every 10 seconds
            if (this.queueProcessingInterval) {
                return; // Already scheduled
            }

            this.queueProcessingInterval = setInterval(() => {
                this.processQueue();
            }, 10000); // Check every 10 seconds
        },

        processQueue: async function() {
            // Check if competition ended (triggers final sweep)
            const competitionEnded = await this.checkCompetitionEnd();
            if (competitionEnded) {
                return; // Final sweep already processed everything
            }

            const queue = this.getVerifyQueue();
            const currentTime = Math.floor(Date.now() / 1000);

            const updatedQueue = [];
            const itemsToCheck = [];

            // Collect items that need checking
            for (const item of queue) {
                // Check if it's time to verify this item
                if (item.nextCheckTime > currentTime) {
                    updatedQueue.push(item);
                    continue;
                }

                // Check if we've been trying for over 1 hour
                const elapsed = currentTime - item.queuedAt;
                if (elapsed >= 3600) {
                    // 1 hour passed - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${item.defenderId}: 1 hour elapsed, marking unverified`);
                    this.addUnverified(item.defenderId, 'Not found after 1 hour of checking');
                    continue; // Don't add back to queue
                }

                itemsToCheck.push(item);
            }

            // Process items in parallel if ≥3 items
            if (itemsToCheck.length >= 3) {
                HalloweenDebug.log(2, `⚡ Processing ${itemsToCheck.length} items in parallel`);
                const results = await Promise.all(
                    itemsToCheck.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
                );

                for (let i = 0; i < itemsToCheck.length; i++) {
                    const item = itemsToCheck[i];
                    const result = results[i];
                    this.processVerificationResult(item, result, currentTime, updatedQueue);
                }
            } else {
                // Process sequentially if < 3 items
                for (const item of itemsToCheck) {
                    const result = await this.verifyDefeat(item.defenderId, item.attackTimestamp);
                    this.processVerificationResult(item, result, currentTime, updatedQueue);
                }
            }

            this.setVerifyQueue(updatedQueue);
        },

        processVerificationResult: function(item, result, currentTime, updatedQueue) {
            if (result.verified) {
                // Success! Mark as defeated
                this.addCountedDefeat(item.defenderId);
                HalloweenDebug.log(1, `✅ Defeat confirmed for defender ${item.defenderId}`);
                return; // Don't add back to queue
            }

            // Verification failed - update state
            item.attempts++;
            item.lastError = result.reason;

            // Schedule next check based on attempts
            // NEW: 60s → 120s → 5-min intervals
            let delay;
            if (item.attempts === 1) {
                delay = 60; // 60 seconds
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: First attempt failed, retry in 60s`);
            } else if (item.attempts === 2) {
                delay = 120; // 120 seconds (2 minutes)
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: Second attempt failed, retry in 2 mins`);
            } else {
                delay = 300; // 300 seconds (5 minutes)
                HalloweenDebug.log(2, `⏭️ Defender ${item.defenderId}: Retry in 5 mins (attempt ${item.attempts})`);
            }

            item.nextCheckTime = currentTime + delay;
            updatedQueue.push(item);
        },

        moveToHourlyQueue: function(item) {
            const failed = this.getFailedQueue();

            failed.push({
                defenderId: item.defenderId,
                attackTimestamp: item.attackTimestamp,
                attempts: item.attempts,
                firstAttempt: item.attackTimestamp + 30,
                lastError: item.lastError,
                lastCheckTime: Math.floor(Date.now() / 1000)
            });

            this.setFailedQueue(failed);
        },

        // ===================================
        // UNVERIFIED RECHECK (6-hour intervals)
        // ===================================

        recheckUnverified: async function() {
            const unverified = this.getUnverified();

            if (unverified.length === 0) {
                HalloweenDebug.log(2, '✅ Unverified recheck: No items to process');
                return;
            }

            const now = Math.floor(Date.now() / 1000);
            const SIX_HOURS = 21600; // 6 hours in seconds
            const itemsToCheck = [];

            // Collect items that need rechecking (6 hours since last check)
            for (const item of unverified) {
                const timeSinceLastCheck = now - (item.lastCheck || 0);
                if (timeSinceLastCheck >= SIX_HOURS) {
                    itemsToCheck.push(item);
                }
            }

            if (itemsToCheck.length === 0) {
                HalloweenDebug.log(2, '✅ Unverified recheck: No items ready for recheck');
                return;
            }

            HalloweenDebug.log(1, `🔄 Rechecking ${itemsToCheck.length} unverified items (6hr interval)`);

            // Process in parallel if ≥3 items
            let results;
            if (itemsToCheck.length >= 3) {
                HalloweenDebug.log(2, `⚡ Processing ${itemsToCheck.length} unverified items in parallel`);
                results = await Promise.all(
                    itemsToCheck.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
                );
            } else {
                results = [];
                for (const item of itemsToCheck) {
                    const result = await this.verifyDefeat(item.defenderId, item.attackTimestamp);
                    results.push(result);
                }
            }

            // Process results
            const updatedUnverified = this.getUnverified(); // Get fresh list
            for (let i = 0; i < itemsToCheck.length; i++) {
                const item = itemsToCheck[i];
                const result = results[i];

                const unverifiedEntry = updatedUnverified.find(u => u.defenderId == item.defenderId);
                if (!unverifiedEntry) continue; // Already removed

                if (result.verified) {
                    // Found it! Remove from unverified, add to counted
                    this.addCountedDefeat(item.defenderId);
                    const filtered = updatedUnverified.filter(u => u.defenderId != item.defenderId);
                    GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                    HalloweenDebug.log(1, `✅ Unverified defender ${item.defenderId} now verified!`);
                } else {
                    // Still not found - update last check time
                    unverifiedEntry.lastCheck = now;
                    GM_setValue('halloween_defeats_unverified', JSON.stringify(updatedUnverified));
                    HalloweenDebug.log(2, `⏰ Defender ${item.defenderId} still unverified, will recheck in 6 hours`);
                }
            }

            HalloweenDebug.log(1, '✅ Unverified recheck complete');
        },

        startUnverifiedRecheck: function() {
            // Run unverified recheck every 6 hours
            if (this.unverifiedRecheckInterval) {
                return; // Already scheduled
            }

            // Run immediately, then every 6 hours
            this.recheckUnverified();

            this.unverifiedRecheckInterval = setInterval(() => {
                this.recheckUnverified();
            }, 21600000); // 6 hours
        },

        // ===================================
        // COMPETITION END SWEEP
        // ===================================

        finalVerificationSweep: async function() {
            const queue = this.getVerifyQueue();
            if (queue.length === 0) {
                HalloweenDebug.log(2, '🏁 Final verification sweep: No pending entries');
                return;
            }

            HalloweenDebug.log(1, `🏁 Final verification sweep: Checking ${queue.length} pending entries`);

            // Check ALL pending entries in parallel
            const results = await Promise.all(
                queue.map(item => this.verifyDefeat(item.defenderId, item.attackTimestamp))
            );

            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                const result = results[i];

                if (result.verified) {
                    // Found it!
                    this.addCountedDefeat(item.defenderId);
                    HalloweenDebug.log(1, `✅ Defeat confirmed for defender ${item.defenderId} (final sweep)`);
                } else {
                    // Still not found after final sweep - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${item.defenderId}: Not found in final sweep, marking unverified`);
                    this.addUnverified(item.defenderId, 'Not found in final sweep');
                }
            }

            // Clear queue
            this.setVerifyQueue([]);
            HalloweenDebug.log(1, '🏁 Final verification sweep complete');
        },

        checkCompetitionEnd: async function() {
            // Check if competition has ended
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!spookyEndDate) return false;

            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}`).getTime() / 1000;
            const now = Math.floor(Date.now() / 1000);

            if (now >= spookyEnd) {
                // Competition ended - check if final sweep already done
                if (!GM_getValue('halloween_firebase_final_sweep_done', false)) {
                    HalloweenDebug.log(1, '🏁 Spooky competition ended - performing final verification sweep');
                    await this.finalVerificationSweep();
                    GM_setValue('halloween_firebase_final_sweep_done', true);
                    return true;
                }
            }

            return false;
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        init: function() {
            HalloweenDebug.log(2, '🎯 Firebase Defeat Verification initialized');

            // Start queue processing
            this.scheduleQueueProcessing();

            // Start 6-hour unverified recheck
            this.startUnverifiedRecheck();
        },

        // ===================================
        // STATISTICS
        // ===================================

        getStats: function() {
            const countedDefeats = this.getCountedDefeats().length;
            return {
                verifiedDefeats: countedDefeats,
                uniqueDefeats: countedDefeats, // Alias for compatibility with updateSoulsBanished()
                pendingVerification: this.getVerifyQueue().length,
                hourlyRetry: this.getFailedQueue().length,
                unverified: this.getUnverified().length
            };
        },

        // ===================================
        // COMPETITION RESET
        // ===================================

        resetCompetition: function() {
            if (confirm('Reset defeat tracking for this competition? This will clear all verified defeats, pending verifications, and unverified attacks.')) {
                GM_setValue('halloween_defeats_counted', '[]');
                GM_setValue('halloween_verify_queue', '[]');
                GM_setValue('halloween_verify_failed', '[]');
                GM_setValue('halloween_defeats_unverified', '[]');
                // Clear spawn schedule and expiration tracking to force regeneration
                GM_deleteValue('halloween_spawn_schedule');
                GM_deleteValue('halloween_logged_expirations');
                HalloweenDebug.log(1, '🔄 Competition defeat tracking, spawn schedule, and expiration logs reset');
            }
        }
    };

    // ===================================
    // API MODE DEFEAT VERIFICATION MODULE
    // ===================================
    const APIDefeatVerification = {
        // Defeat result values that count as defeats
        DEFEAT_RESULTS: ['Attacked', 'Hospitalized', 'Mugged'],

        // Background refresh interval (dynamic based on API testing mode)
        getRefreshInterval: function() {
            const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);
            return apiTestingMode ? 60 : 300; // 60s in testing, 5min in production
        },

        // Verification retry settings
        RETRY_FAST_INTERVAL: 30, // 30 seconds
        RETRY_FAST_ATTEMPTS: 3,
        RETRY_SLOW_INTERVAL: 120, // 2 minutes
        RETRY_SLOW_DURATION: 600, // 10 minutes total

        // ===================================
        // API MODE STATE MANAGEMENT
        // ===================================

        isAPIMode: function() {
            return GM_getValue('halloween_api_mode', false);
        },

        getAPIKey: function() {
            return GM_getValue('halloween_api_key', '');
        },

        getMemberID: function() {
            return GM_getValue('halloween_api_member_id', 0);
        },

        getMemberName: function() {
            return GM_getValue('halloween_api_member_name', '');
        },

        // ===================================
        // DEFEAT STORAGE MANAGEMENT (shared with Firebase mode)
        // ===================================

        getCountedDefeats: function() {
            try {
                return JSON.parse(GM_getValue('halloween_defeats_counted', '[]'));
            } catch (e) {
                return [];
            }
        },

        addCountedDefeat: function(defenderId) {
            const counted = this.getCountedDefeats();
            if (!counted.includes(defenderId)) {
                counted.push(defenderId);
                GM_setValue('halloween_defeats_counted', JSON.stringify(counted));
                return true;
            }
            return false;
        },

        isAlreadyCounted: function(defenderId) {
            return this.getCountedDefeats().includes(defenderId);
        },

        // ===================================
        // API VALIDATION
        // ===================================

        validateAPIKey: async function(apiKey) {
            return new Promise((resolve, reject) => {
                const url = `https://api.torn.com/user/?selections=profile&key=${apiKey}`;

                httpRequest({
                    url: url,
                    method: 'GET',
                    onload: function(response) {
                        try {
                            const profile = JSON.parse(response.responseText);

                            if (profile.error) {
                                reject(new Error('Invalid API key: ' + profile.error.error));
                                return;
                            }

                            resolve({
                                player_id: profile.player_id,
                                name: profile.name,
                                valid: true
                            });
                        } catch (e) {
                            reject(new Error('Failed to parse API response'));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('API request failed'));
                    }
                });
            });
        },

        enableAPIMode: async function(apiKey) {
            try {
                // Validate API key and get player info
                const playerInfo = await this.validateAPIKey(apiKey);

                // Store API credentials
                GM_setValue('halloween_api_key', apiKey);
                GM_setValue('halloween_api_member_id', playerInfo.player_id);
                GM_setValue('halloween_api_member_name', playerInfo.name);
                GM_setValue('halloween_api_mode', true);

                // Initialize timestamps (no initial fetch)
                const now = Date.now() / 1000;
                GM_setValue('halloween_api_start_timestamp', now);
                GM_setValue('halloween_api_last_refresh', now);

                // Initialize empty attack log
                GM_setValue('halloween_api_all_attacks', '{}');
                GM_setValue('halloween_api_pending_verifications', '[]');

                HalloweenDebug.log(1, `✅ API Mode enabled for ${playerInfo.name} [${playerInfo.player_id}]`);

                return {
                    success: true,
                    playerName: playerInfo.name,
                    playerId: playerInfo.player_id
                };
            } catch (error) {
                HalloweenDebug.log(1, `❌ API Mode activation failed: ${error.message}`);
                return {
                    success: false,
                    error: error.message
                };
            }
        },

        // ===================================
        // ATTACK LOG MANAGEMENT
        // ===================================

        getAllAttacks: function() {
            try {
                return JSON.parse(GM_getValue('halloween_api_all_attacks', '{}'));
            } catch (e) {
                return {};
            }
        },

        refreshAttackLog: function(isRetry = false) {
            if (!this.isAPIMode()) return;

            const apiKey = this.getAPIKey();
            const memberID = this.getMemberID();

            // Check if API testing mode is enabled
            const apiTestingMode = GM_getValue('halloween_api_testing_mode', false);

            // Use enrollment timestamp if testing, otherwise use competition start
            const enrollmentTimestamp = GM_getValue('halloween_enrollment_timestamp', 0);
            const competitionStart = GM_getValue('halloween_competition_start_timestamp', 0);
            const competitionEnd = GM_getValue('halloween_competition_end_timestamp', 0);

            const effectiveStart = apiTestingMode ? enrollmentTimestamp : competitionStart;
            let lastSavedTimestamp = GM_getValue('halloween_api_last_saved_timestamp', effectiveStart);

            HalloweenDebug.log(1, '[API] effectiveStart (enrollment):', effectiveStart);
            HalloweenDebug.log(1, '[API] lastSavedTimestamp from storage:', lastSavedTimestamp);
            const allAttacks = this.getAllAttacks();
            HalloweenDebug.log(1, '[API] Total attacks currently stored:', Object.keys(allAttacks).length);

            // In testing mode, ensure we never fetch from before enrollment
            if (apiTestingMode && lastSavedTimestamp < effectiveStart) {
                HalloweenDebug.log(1, '[API] Resetting stale timestamp - using enrollment instead');
                lastSavedTimestamp = effectiveStart;
            }

            if (!apiKey || !memberID) {
                HalloweenDebug.log(1, '❌ Cannot refresh: API key or member ID missing');
                return;
            }

            if (apiTestingMode) {
                if (!enrollmentTimestamp) {
                    HalloweenDebug.log(1, '❌ Cannot refresh: Enrollment timestamp not set');
                    return;
                }
                HalloweenDebug.log(2, '🧪 API Testing Mode: Using enrollment timestamp', enrollmentTimestamp);
            } else {
                if (!competitionStart || !competitionEnd) {
                    HalloweenDebug.log(1, '❌ Cannot refresh: Competition timestamps not set');
                    return;
                }
            }

            const now = Math.floor(Date.now() / 1000);
            const competitionEnded = !apiTestingMode && now > competitionEnd;

            // Check if final sweep already done (skip in testing mode)
            if (!apiTestingMode && competitionEnded && GM_getValue('halloween_api_final_sweep_done', false)) {
                HalloweenDebug.log(2, '✅ Competition ended and final sweep complete - skipping refresh');
                return;
            }

            // Build URL with from parameter (and to parameter if final sweep)
            let url = `https://api.torn.com/user/?key=${apiKey}&from=${lastSavedTimestamp}&selections=attacksfull`;
            if (competitionEnded && !apiTestingMode) {
                url += `&to=${competitionEnd}`;
                HalloweenDebug.log(2, `🔄 Final sweep: from ${lastSavedTimestamp} to ${competitionEnd}`);
            } else {
                const mode = apiTestingMode ? '(Testing Mode)' : '';
                HalloweenDebug.log(2, `🔄 Refreshing attack log from timestamp ${lastSavedTimestamp} ${mode}`);
            }

            // Add cache-busting parameter to URL (force fresh data)
            url += `&_=${Date.now()}`;

            HalloweenDebug.log(1, '[API] Request URL:', url);

            httpRequest({
                url: url,
                method: 'GET',
                nocache: true,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                onload: (response) => {
                    try {
                        HalloweenDebug.log(1, '[API] Response status:', response.status);
                        HalloweenDebug.log(1, '[API] Response text:', response.responseText);

                        const data = JSON.parse(response.responseText);

                        if (data.error) {
                            HalloweenDebug.log(1, `❌ Attack log refresh failed: ${data.error.error}`);

                            // Retry once after 61 seconds (allows API rate limit window to reset)
                            if (!isRetry) {
                                HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                                setTimeout(() => {
                                    this.refreshAttackLog(true);
                                }, 61 * 1000);
                            } else {
                                HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                            }
                            return;
                        }

                        // CRITICAL: Filter for OUTGOING attacks only (v1 API returns both incoming/outgoing)
                        const myAttacks = {};
                        for (const [attackId, attack] of Object.entries(data.attacks || {})) {
                            if (attack.attacker_id == memberID) {
                                // Store minimal data
                                myAttacks[attackId] = {
                                    code: attack.code,
                                    timestamp_started: attack.timestamp_started,
                                    timestamp_ended: attack.timestamp_ended,
                                    defender_id: attack.defender_id,
                                    result: attack.result,
                                    respect: attack.respect || 0
                                };
                            }
                        }

                        HalloweenDebug.log(1, '[API] Total attacks in response:', Object.keys(data.attacks || {}).length);
                        HalloweenDebug.log(1, '[API] Attacks matching member ID:', Object.keys(myAttacks).length);
                        HalloweenDebug.log(1, '[API] Your member ID:', memberID);

                        // Merge with existing attacks
                        const stored = this.getAllAttacks();
                        const updated = {...stored, ...myAttacks};
                        GM_setValue('halloween_api_all_attacks', JSON.stringify(updated));

                        // Update last saved timestamp to newest attack (for next incremental fetch)
                        if (Object.keys(myAttacks).length > 0) {
                            const timestamps = Object.values(myAttacks).map(a => a.timestamp_started);
                            const newestTimestamp = Math.max(...timestamps);
                            GM_setValue('halloween_api_last_saved_timestamp', newestTimestamp);
                        }

                        // Update last refresh timestamp
                        GM_setValue('halloween_api_last_refresh', Date.now() / 1000);

                        HalloweenDebug.log(2, `✅ Attack log refreshed: ${Object.keys(myAttacks).length} new attacks`);

                        // Event-driven UI update for Halloweek Stats
                        if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateHalloweekStats) {
                            HalloweenUI.updateHalloweekStats();
                        }

                        // COMPREHENSIVE SPOOKY TARGET SCANNING (Safety net / backup detection)
                        // Scan new attacks to catch any spooky targets that weren't detected via attack page
                        try {
                            // Get spooky window dates for validation
                            const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
                            const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
                            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
                            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

                            if (spookyStartDate && spookyEndDate) {
                                const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}`).getTime() / 1000;
                                const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}`).getTime() / 1000;

                                let foundCount = 0;
                                for (const [attackId, attack] of Object.entries(myAttacks)) {
                                    // Check if defender is a spooky target
                                    if (!HalloweenTargets.isSpookyTarget(attack.defender_id)) continue;

                                    // Check if within spooky window
                                    if (attack.timestamp_started < spookyStart || attack.timestamp_started > spookyEnd) continue;

                                    // Check if result is a defeat
                                    if (!this.DEFEAT_RESULTS.includes(attack.result)) continue;

                                    // Check if not already counted
                                    if (this.isAlreadyCounted(attack.defender_id)) continue;

                                    // Found unrecorded spooky target defeat!
                                    HalloweenDebug.log(1, `🎯 BACKUP DETECTION: Found spooky target ${attack.defender_id} in API data (${attack.result})`);
                                    this.recordDefeat(attack.defender_id, attack);
                                    foundCount++;
                                }

                                if (foundCount > 0) {
                                    HalloweenDebug.log(1, `🛡️ Backup detection recorded ${foundCount} missed spooky target(s)`);
                                }
                            }
                        } catch (e) {
                            // If scanning fails, don't break anything - just log it
                            HalloweenDebug.log(3, `⚠️ Backup spooky target scanning failed: ${e.message}`);
                        }

                        // If this was the final sweep, mark it as done and show competition end notification
                        if (competitionEnded) {
                            GM_setValue('halloween_api_final_sweep_done', true);
                            HalloweenDebug.log(1, '🏁 Final attack log sweep complete - competition ended');

                            // Trigger competition end notification
                            const bonusStats = this.getBonusStats();
                            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.showCompetitionEndNotification) {
                                HalloweenUI.showCompetitionEndNotification(bonusStats.totalAttacks, bonusStats.uniqueOpponents, bonusStats.totalDefeats);
                            }
                        }

                        // Update bonus stats display
                        this.updateBonusStats();

                        // Process any pending verifications (event-driven or final sweep)
                        if (competitionEnded) {
                            // Final sweep: force-check ALL pending regardless of nextRetry
                            this.finalVerificationSweep();
                        } else {
                            this.processPendingVerifications(true);
                        }

                        // Recheck unverified targets (daily or final sweep)
                        this.recheckUnverified();

                        // Update defeat verification stats display
                        if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                            HalloweenUI.updateDefeatVerificationStats();
                        }

                    } catch (e) {
                        HalloweenDebug.log(1, `❌ Failed to parse attack log: ${e.message}`);

                        // Retry once after 61 seconds (allows API rate limit window to reset)
                        if (!isRetry) {
                            HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                            setTimeout(() => {
                                this.refreshAttackLog(true);
                            }, 61 * 1000);
                        } else {
                            HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                        }
                    }
                },
                onerror: (error) => {
                    HalloweenDebug.log(1, `❌ Attack log refresh request failed`);

                    // Retry once after 61 seconds (allows API rate limit window to reset)
                    if (!isRetry) {
                        HalloweenDebug.log(1, '⏱️ Scheduling retry in 61 seconds...');
                        setTimeout(() => {
                            this.refreshAttackLog(true);
                        }, 61 * 1000);
                    } else {
                        HalloweenDebug.log(1, '❌ Retry failed - resuming normal schedule');
                    }
                }
            });
        },

        checkAttackLogRefresh: function() {
            if (!this.isAPIMode()) return;

            const lastRefresh = GM_getValue('halloween_api_last_refresh', 0);
            const now = Date.now() / 1000;
            const refreshInterval = this.getRefreshInterval();

            // Refresh if interval has elapsed
            if (now - lastRefresh >= refreshInterval) {
                HalloweenDebug.log(2, `🔄 Auto-refresh triggered (${refreshInterval}s elapsed)`);
                this.refreshAttackLog();
            }
        },

        // ===================================
        // DEFEAT VERIFICATION
        // ===================================

        verifyDefeat: function(defenderId) {
            const allAttacks = this.getAllAttacks();
            const attackValues = Object.values(allAttacks);

            // Get spooky competition timeframe
            const spookyStartDate = GM_getValue('halloween_spooky_start_date', '');
            const spookyStartTime = GM_getValue('halloween_spooky_start_time', '00:00');
            const spookyEndDate = GM_getValue('halloween_spooky_end_date', '');
            const spookyEndTime = GM_getValue('halloween_spooky_end_time', '23:59');

            if (!spookyStartDate || !spookyEndDate) {
                HalloweenDebug.log(1, '⚠️ Spooky competition dates not set - cannot verify');
                return 'pending';
            }

            const spookyStart = new Date(`${spookyStartDate}T${spookyStartTime}`).getTime() / 1000;
            const spookyEnd = new Date(`${spookyEndDate}T${spookyEndTime}`).getTime() / 1000;

            HalloweenDebug.log(1, `HAL: 🎯 Verifying defender ${defenderId}`);
            HalloweenDebug.log(1, `HAL: 🎯 Spooky window: ${new Date(spookyStart * 1000).toLocaleString()} to ${new Date(spookyEnd * 1000).toLocaleString()}`);
            HalloweenDebug.log(1, `HAL: 🎯 Total attacks in API data: ${attackValues.length}`);

            // Filter attacks to spooky competition window only
            const spookyWindowAttacks = attackValues.filter(a =>
                a.timestamp_started >= spookyStart &&
                a.timestamp_started <= spookyEnd
            );

            HalloweenDebug.log(1, `HAL: 🎯 Attacks in spooky window: ${spookyWindowAttacks.length}`);

            // Get newest timestamp from ALL stored attacks (for unverified check)
            const timestamps = attackValues.map(a => a.timestamp_started);
            const newestStoredTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

            // Look for defeat WITHIN spooky window
            HalloweenDebug.log(1, `HAL: 🎯 Checking ${spookyWindowAttacks.length} attacks for defender ${defenderId}...`);
            spookyWindowAttacks.forEach(a => {
                const isMatch = a.defender_id == defenderId;
                const isDefeat = this.DEFEAT_RESULTS.includes(a.result);
                HalloweenDebug.log(1, `🎯   - Attack vs ${a.defender_id}: result=${a.result}, match=${isMatch}, defeat=${isDefeat}, time=${new Date(a.timestamp_started * 1000).toLocaleString()}`);
            });

            const found = spookyWindowAttacks.find(a =>
                a.defender_id == defenderId &&
                this.DEFEAT_RESULTS.includes(a.result)
            );

            if (found) {
                // VERIFIED!
                HalloweenDebug.log(1, `✅ API Defeat verified: ${defenderId} (${found.result})`);
                this.recordDefeat(defenderId, found);
                this.removeFromQueue(defenderId);
                return 'verified';
            }

            // 10-minute buffer check
            const queue = this.getPendingVerifications();
            const queueEntry = queue.find(q => q.defenderId == defenderId);

            if (queueEntry) {
                const detectionTime = queueEntry.queuedAt;
                const bufferTime = 10 * 60; // 10 minutes in seconds
                const now = Math.floor(Date.now() / 1000);

                // Check: Has 10+ minutes passed AND do we have data covering that period?
                const timeElapsed = now - detectionTime;
                const hasEnoughData = newestStoredTimestamp >= (detectionTime + bufferTime);

                if (timeElapsed >= bufferTime && hasEnoughData) {
                    // Attack logs have data ≥10 min after detection, attack not found = missing
                    HalloweenDebug.log(1, `⚠️ API Defeat unverified: ${defenderId} (not in API after 10 min buffer)`);
                    this.markAsUnverified(defenderId);
                    this.removeFromQueue(defenderId);
                    return 'unverified';
                }
            }

            // Need to retry (not enough time elapsed or data coverage)
            HalloweenDebug.log(1, `HAL: 🎯 Defender ${defenderId} still pending (waiting for 10min buffer or more API data)`);
            if (queueEntry) {
                const timeElapsed = Math.floor(Date.now() / 1000) - queueEntry.queuedAt;
                const hasEnoughData = newestStoredTimestamp >= (queueEntry.queuedAt + 600);
                HalloweenDebug.log(1, `HAL: 🎯   - Time elapsed: ${timeElapsed}s (need 600s), Has data: ${hasEnoughData}, Newest API timestamp: ${new Date(newestStoredTimestamp * 1000).toLocaleString()}`);
            }
            return 'pending';
        },

        queueVerification: function(defenderId, attackTimestamp) {
            // Skip if already confirmed as defeated
            if (this.isAlreadyCounted(defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already counted - skipping`);
                return;
            }

            // Skip if currently in pending queue
            const queue = this.getPendingVerifications();
            if (queue.find(q => q.defenderId == defenderId)) {
                HalloweenDebug.log(2, `⏭️ Defender ${defenderId} already in queue - skipping`);
                return;
            }

            // If previously unverified, remove and give second chance
            // (User might have returned and actually attacked this time)
            const unverified = JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));
            if (unverified.find(u => u.defenderId == defenderId)) {
                const filtered = unverified.filter(u => u.defenderId != defenderId);
                GM_setValue('halloween_defeats_unverified', JSON.stringify(filtered));
                HalloweenDebug.log(2, `♻️ Defender ${defenderId} removed from unverified, re-queueing`);
            }

            // Use provided timestamp or current time
            const timestamp = attackTimestamp || Math.floor(Date.now() / 1000);
            const now = Math.floor(Date.now() / 1000);

            // Refresh attack log first (ensure latest data)
            this.refreshAttackLog();

            // Add to pending queue with NEW structure
            // exitDetected starts as false, gets set to true when exit is detected
            if (!queue.find(q => q.defenderId == defenderId)) {
                queue.push({
                    defenderId: defenderId,
                    queuedAt: timestamp,
                    exitDetected: false, // NEW: Track if exit was detected
                    checkState: 'initial', // NEW: 'initial', '2min_retry', 'event_driven'
                    attempts: 0,
                    nextRetry: now + 30 // Initial check in 30s (will be immediate if exit detected)
                });
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(queue));

                HalloweenDebug.log(2, `📋 Queued API verification for defender ${defenderId} (timestamp: ${timestamp}, initial check in 30s)`);

                // Event-driven UI update
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        getPendingVerifications: function() {
            try {
                return JSON.parse(GM_getValue('halloween_api_pending_verifications', '[]'));
            } catch (e) {
                return [];
            }
        },

        updateQueueTimestamp: function(defenderId, newTimestamp) {
            const queue = this.getPendingVerifications();
            const entry = queue.find(q => q.defenderId == defenderId);

            if (entry) {
                const oldTimestamp = entry.queuedAt;
                entry.queuedAt = newTimestamp;
                entry.exitDetected = true; // Mark that exit was detected
                entry.nextRetry = Math.floor(Date.now() / 1000); // Check immediately
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(queue));

                HalloweenDebug.log(2, `⏱️ Updated timestamp for defender ${defenderId}: ${oldTimestamp} → ${newTimestamp} (${newTimestamp - oldTimestamp}s later, exit detected, immediate check)`);
            } else {
                HalloweenDebug.log(3, `⚠️ Could not update timestamp for defender ${defenderId} - not found in queue`);
            }
        },

        processPendingVerifications: function(eventDriven = false) {
            const queue = this.getPendingVerifications();
            const now = Math.floor(Date.now() / 1000);
            let queueModified = false;

            // Get newest API timestamp for unverified check
            const allAttacks = this.getAllAttacks();
            const attackValues = Object.values(allAttacks);
            const timestamps = attackValues.map(a => a.timestamp_started);
            const newestAPITimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;

            // Update last spooky verification timestamp for bounty piggyback logic
            BountyManager.setLastSpookyVerificationTime(now);

            // PIGGYBACK: Verify today's unclaimed bounties alongside spooky targets
            BountyManager.verifyTodaysBounties(allAttacks);

            for (const entry of queue) {
                // Check if we should verify this entry
                const shouldCheck = eventDriven || (now >= entry.nextRetry);

                if (!shouldCheck) continue;

                const result = this.verifyDefeat(entry.defenderId);

                if (result === 'pending') {
                    // Still not found - update state
                    queueModified = true;

                    if (entry.checkState === 'initial') {
                        // Initial check failed - schedule 2-min retry
                        entry.checkState = '2min_retry';
                        entry.nextRetry = now + 120; // 2 minutes
                        HalloweenDebug.log(2, `⏳ Defender ${entry.defenderId}: Initial check failed, retry in 2 mins`);
                    } else if (entry.checkState === '2min_retry') {
                        // 2-min retry failed - move to event-driven
                        entry.checkState = 'event_driven';
                        entry.nextRetry = Infinity; // No more scheduled checks
                        HalloweenDebug.log(2, `⏳ Defender ${entry.defenderId}: 2-min retry failed, now event-driven`);
                    } else if (entry.checkState === 'event_driven') {
                        // Event-driven check - check if we should mark as unverified
                        // If API has data newer than 1 hour after queue time, mark unverified
                        if (newestAPITimestamp > (entry.queuedAt + 3600)) {
                            HalloweenDebug.log(2, `❌ Defender ${entry.defenderId}: API data covers 1hr+ after attack, marking unverified`);
                            this.markAsUnverified(entry.defenderId);
                            this.removeFromQueue(entry.defenderId);
                            queueModified = true;
                        }
                    }
                }
                // Note: 'verified' and 'unverified' cases handle their own queue removal in verifyDefeat
            }

            // Save queue if modified
            if (queueModified) {
                const currentQueue = this.getPendingVerifications(); // Get fresh queue after any removals
                GM_setValue('halloween_api_pending_verifications', JSON.stringify(currentQueue));
            }
        },

        removeFromQueue: function(defenderId) {
            const queue = this.getPendingVerifications();
            const filtered = queue.filter(q => q.defenderId != defenderId);
            GM_setValue('halloween_api_pending_verifications', JSON.stringify(filtered));
        },

        recordDefeat: function(defenderId, attackData) {
            // Add to counted defeats using API's own method
            this.addCountedDefeat(defenderId);

            HalloweenDebug.log(1, `🎃 API defeat recorded: ${defenderId}`);

            // Event-driven UI updates
            if (typeof HalloweenUI !== 'undefined') {
                if (HalloweenUI.updateSoulsBanished) {
                    HalloweenUI.updateSoulsBanished();
                }
                if (HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        markAsUnverified: function(defenderId) {
            // Add to unverified list with timestamp (for daily recheck tracking)
            const unverified = JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));

            // Update to object format if needed (migration from old string array)
            const unverifiedList = unverified.map(item =>
                typeof item === 'string' ? { defenderId: item, lastCheck: 0 } : item
            );

            if (!unverifiedList.find(u => u.defenderId == defenderId)) {
                unverifiedList.push({
                    defenderId: defenderId,
                    lastCheck: Math.floor(Date.now() / 1000)
                });
                GM_setValue('halloween_defeats_unverified', JSON.stringify(unverifiedList));
                HalloweenDebug.log(2, `❌ Marked defender ${defenderId} as unverified`);

                // Event-driven UI update
                if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                    HalloweenUI.updateDefeatVerificationStats();
                }
            }
        },

        recheckUnverified: function() {
            if (!this.isAPIMode()) return;

            const unverified = JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));
            if (unverified.length === 0) return;

            // Update to object format if needed (migration)
            const unverifiedList = unverified.map(item =>
                typeof item === 'string' ? { defenderId: item, lastCheck: 0 } : item
            );

            const now = Math.floor(Date.now() / 1000);
            const DAY_IN_SECONDS = 86400;
            let modified = false;

            HalloweenDebug.log(2, `🔄 Checking ${unverifiedList.length} unverified targets for daily recheck`);

            for (const entry of unverifiedList) {
                const timeSinceLastCheck = now - entry.lastCheck;

                // Recheck if 24 hours have passed
                if (timeSinceLastCheck >= DAY_IN_SECONDS) {
                    HalloweenDebug.log(2, `🔍 Rechecking unverified defender ${entry.defenderId} (${Math.floor(timeSinceLastCheck / 3600)}hrs since last check)`);

                    const result = this.verifyDefeat(entry.defenderId);

                    if (result === 'verified') {
                        // Found it! verifyDefeat already handled adding to counted
                        HalloweenDebug.log(2, `✅ Unverified defender ${entry.defenderId} now verified!`);
                        modified = true;
                    } else {
                        // Still not found, update last check time
                        entry.lastCheck = now;
                        modified = true;
                    }
                }
            }

            // Save if modified
            if (modified) {
                // Remove verified entries (they were removed in verifyDefeat)
                const currentUnverified = JSON.parse(GM_getValue('halloween_defeats_unverified', '[]'));
                GM_setValue('halloween_defeats_unverified', JSON.stringify(currentUnverified));
            }
        },

        finalVerificationSweep: function() {
            if (!this.isAPIMode()) return;

            const queue = this.getPendingVerifications();
            if (queue.length === 0) {
                HalloweenDebug.log(2, '🏁 Final verification sweep: No pending entries');
                return;
            }

            HalloweenDebug.log(1, `🏁 Final verification sweep: Checking ${queue.length} pending entries`);

            // Check ALL pending entries, regardless of nextRetry time
            for (const entry of queue) {
                const result = this.verifyDefeat(entry.defenderId);

                if (result === 'pending') {
                    // Still not found after final sweep - mark as unverified
                    HalloweenDebug.log(2, `❌ Defender ${entry.defenderId}: Not found in final sweep, marking unverified`);
                    this.markAsUnverified(entry.defenderId);
                    this.removeFromQueue(entry.defenderId);
                }
                // Verified cases handled in verifyDefeat
            }

            HalloweenDebug.log(1, '🏁 Final verification sweep complete');
        },

        // ===================================
        // HALLOWEEK STATS
        // ===================================

        getBonusStats: function() {
            const attacks = this.getAllAttacks();
            const attackValues = Object.values(attacks);

            // Total attacks
            const totalAttacks = attackValues.length;

            // Unique opponents
            const opponents = new Set(attackValues.map(a => a.defender_id));
            const uniqueOpponents = opponents.size;

            // Total defeats (Attacked, Hospitalized, Mugged)
            const totalDefeats = attackValues.filter(a =>
                this.DEFEAT_RESULTS.includes(a.result)
            ).length;

            return {
                totalAttacks,
                uniqueOpponents,
                totalDefeats
            };
        },

        updateBonusStats: function() {
            if (!this.isAPIMode()) return;

            const stats = this.getBonusStats();

            // Update UI elements if they exist
            const attacksEl = document.getElementById('stat-competition-attacks');
            const opponentsEl = document.getElementById('stat-unique-opponents');
            const defeatsEl = document.getElementById('stat-total-defeats');

            if (attacksEl) attacksEl.textContent = stats.totalAttacks;
            if (opponentsEl) opponentsEl.textContent = stats.uniqueOpponents;
            if (defeatsEl) defeatsEl.textContent = stats.totalDefeats;
        },

        // ===================================
        // STATISTICS
        // ===================================

        getStats: function() {
            const countedDefeats = this.getCountedDefeats().length;
            return {
                verifiedDefeats: countedDefeats,
                uniqueDefeats: countedDefeats, // Alias for compatibility with updateSoulsBanished()
                pendingVerification: this.getPendingVerifications().length,
                unverified: JSON.parse(GM_getValue('halloween_defeats_unverified', '[]')).length
            };
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        initialize: function() {
            if (!this.isAPIMode()) return;

            HalloweenDebug.log(2, '🎃 API Mode active - initializing');

            // Check for attack log refresh on page load (includes final sweep if competition ended)
            this.checkAttackLogRefresh();

            // Process any pending verifications
            this.processPendingVerifications();

            // Process bounty verifications (15-min checks, retries, expiry)
            BountyManager.processBountyVerifications();

            // Update defeat verification stats display
            if (typeof HalloweenUI !== 'undefined' && HalloweenUI.updateDefeatVerificationStats) {
                HalloweenUI.updateDefeatVerificationStats();
            }

            // Performance optimization: Removed background 60s intervals
            // API refresh now checks on page load/navigation (event-driven)
            // Stats update interval only runs when menu is open (see HalloweenUI.toggleMenu)
            HalloweenDebug.log(2, '✅ API Mode initialized - event-driven checks active');
        }
    };

    // ===================================
    // ATTACK PAGE DETECTION MODULE
    // ===================================
    const AttackPageDetection = {
        currentDefenderId: null,
        attackTimestamp: null,

        // ===================================
        // ATTACK PAGE DETECTION
        // ===================================

        isAttackPage: function() {
            const url = window.location.href;
            return url.includes('loader.php?sid=attack') && url.includes('user2ID=');
        },

        extractDefenderId: function() {
            const url = window.location.href;
            const match = url.match(/user2ID=(\d+)/);
            return match ? match[1] : null;
        },

        // ===================================
        // SPOOKY CRITERIA CHECK
        // ===================================

        isSpookyTarget: function(defenderId) {
            if (!defenderId) return false;

            // Get last 2 digits
            const lastTwoDigits = defenderId.toString().slice(-2).padStart(2, '0');

            // Check against seed
            const isTarget = SeedManager.checkTarget(lastTwoDigits);

            if (isTarget) {
                HalloweenDebug.log(2, `HAL: 🎃 Spooky target detected: ${defenderId} (${lastTwoDigits})`);
            }

            return isTarget;
        },

        // ===================================
        // PAGE LIFECYCLE
        // ===================================

        onAttackPageLoad: function() {
            HalloweenDebug.log(1, `HAL: 🎯 onAttackPageLoad() called, URL: ${window.location.href}`);
            const defenderId = this.extractDefenderId();

            HalloweenDebug.log(1, `HAL: 🎯 Extracted defender ID: ${defenderId}`);
            if (!defenderId) {
                HalloweenDebug.log(3, '⚠️ Could not extract defender ID from attack page');
                return;
            }

            // Check if it's a spooky target
            if (!this.isSpookyTarget(defenderId)) {
                HalloweenDebug.log(3, `⏭️ Defender ${defenderId} is not a spooky target - ignoring`);
                return;
            }

            // Check if already counted (works for both modes - same defeats_counted array)
            const alreadyCounted = APIDefeatVerification.isAPIMode()
                ? APIDefeatVerification.isAlreadyCounted(defenderId)
                : FirebaseDefeatVerification.isAlreadyCounted(defenderId);

            if (alreadyCounted) {
                HalloweenDebug.log(2, `✅ Defender ${defenderId} already counted this competition - ignoring`);
                return;
            }

            // Store for exit tracking (still used for logging)
            this.currentDefenderId = defenderId;
            this.attackTimestamp = Math.floor(Date.now() / 1000);

            HalloweenDebug.log(1, `HAL: 🎯 Attack page loaded for spooky target ${defenderId}`);

            // IMMEDIATE QUEUING: Queue verification right away (don't wait for exit)
            // This ensures we capture the attack even if navigation detection fails
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(1, `HAL: 🎯 Immediately queueing for API verification`);
                APIDefeatVerification.queueVerification(defenderId, this.attackTimestamp);
            } else {
                HalloweenDebug.log(1, `HAL: 🎯 Immediately queueing for Firebase verification`);
                FirebaseDefeatVerification.addToQueue(defenderId, this.attackTimestamp);
            }

            // Log current pending queue for visibility
            if (APIDefeatVerification.isAPIMode()) {
                const queue = APIDefeatVerification.getPendingVerifications();
                HalloweenDebug.log(1, `HAL: 🎯 Current pending queue: [${queue.map(q => q.defenderId).join(', ')}] (${queue.length} total)`);
            } else {
                const queue = FirebaseDefeatVerification.getVerifyQueue();
                HalloweenDebug.log(1, `HAL: 🎯 Current pending queue: [${queue.map(q => q.defenderId).join(', ')}] (${queue.length} total)`);
            }

            HalloweenDebug.log(2, `🎯 Attack page loaded: Defender ${defenderId} (spooky target, queued for verification)`);
        },

        onAttackPageExit: function() {
            HalloweenDebug.log(1, `HAL: 🎯 onAttackPageExit() called`);

            if (!this.currentDefenderId) {
                HalloweenDebug.log(1, `HAL: 🎯 No currentDefenderId set, exit ignored`);
                return; // No spooky target to track
            }

            const exitTimestamp = Math.floor(Date.now() / 1000);
            HalloweenDebug.log(1, `HAL: 🎯 Exiting attack page for defender ${this.currentDefenderId}`);
            HalloweenDebug.log(2, `👋 Exiting attack page: Updating timestamp for defender ${this.currentDefenderId}`);

            // UPDATE TIMESTAMP: The attack likely happened just before exit, so update
            // the queued timestamp to be more accurate (closer to actual attack time)
            if (APIDefeatVerification.isAPIMode()) {
                HalloweenDebug.log(1, `HAL: 🎯 Updating API queue timestamp to exit time (more accurate)`);
                APIDefeatVerification.updateQueueTimestamp(this.currentDefenderId, exitTimestamp);
            } else {
                HalloweenDebug.log(1, `HAL: 🎯 Updating Firebase queue timestamp to exit time (more accurate)`);
                FirebaseDefeatVerification.updateQueueTimestamp(this.currentDefenderId, exitTimestamp);
            }

            // Clear current tracking
            this.currentDefenderId = null;
            this.attackTimestamp = null;
        },

        // ===================================
        // INITIALIZATION
        // ===================================

        init: function() {
            HalloweenDebug.log(2, '🎯 Attack Page Detection initialized');

            // Check if currently on attack page
            if (this.isAttackPage()) {
                this.onAttackPageLoad();

                // Listen for page unload
                window.addEventListener('beforeunload', () => {
                    this.onAttackPageExit();
                });

                // Listen for navigation away (modern SPAs)
                window.addEventListener('pagehide', () => {
                    this.onAttackPageExit();
                });
            }

            // Listen for page navigation (in case user navigates to attack page)
            this.observePageChanges();
        },

        // ===================================
        // OBSERVE PAGE CHANGES
        // ===================================

        observePageChanges: function() {
            // Watch for URL changes (for SPAs/AJAX navigation)
            let lastUrl = location.href;

            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;

                    // Check if navigated to attack page
                    if (this.isAttackPage()) {
                        this.onAttackPageLoad();
                    } else if (this.currentDefenderId) {
                        // Navigated away from attack page
                        this.onAttackPageExit();
                    }
                }
            }).observe(document, { subtree: true, childList: true });
        }
    };

    // ===================================
    // PRELOAD AUTO-IMPORT
    // ===================================
    // Auto-import preloaded config if present and no manual import has been done
    function autoImportPreloadedConfig() {
        // Check if user has done a manual import (which should override preload)
        const manualImportDone = GM_getValue('halloween_manual_import_done', false);
        if (manualImportDone) {
            return; // Manual import takes precedence
        }

        // Determine which preload to use (leader vs member)
        let preloadData = null;
        if (typeof MASTER_LEADER_KEY !== 'undefined' && preloadLeaderConfig) {
            preloadData = preloadLeaderConfig;
            HalloweenDebug.log(1, '🎃 Auto-importing preloaded leader config');
        } else if (preloadMemberConfig) {
            preloadData = preloadMemberConfig;
            HalloweenDebug.log(1, '🎃 Auto-importing preloaded member config');
        }

        if (preloadData) {
            try {
                // Use the same import logic as Arcane Rituals, but don't set manual flag
                const success = FactionConfig.importData(preloadData, true); // true = set manual import flag after first import
                if (success) {
                    HalloweenDebug.log(1, '✅ Preloaded config auto-imported successfully');
                } else {
                    HalloweenDebug.log(1, '⚠️ Failed to import preloaded config');
                }
            } catch (e) {
                HalloweenDebug.log(1, '⚠️ Failed to parse preloaded config:', e.message);
            }
        }
    }

    // CRITICAL: Wait for PDA platform ready BEFORE accessing storage or handlers
    // In PDA, GM_ functions are handlers that require platform to be ready
    // In browser, this resolves immediately with no delay
    waitForPDAReady().then(() => {
        console.log('HAL: ✅ Platform ready - starting initialization');

        // NOW safe to call autoImportPreloadedConfig (uses GM_getValue)
        // Only auto-import in browser - PDA users import manually via Arcane Rituals
        if (!isPDA) {
            autoImportPreloadedConfig();
        }

        // Initialize when DOM ready - single initialization point
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                HalloweenTargets.init();
                HalloweenCompetition.init();
                APIDefeatVerification.initialize();
                FirebaseDefeatVerification.init();
                AttackPageDetection.init();
            });
        } else {
            HalloweenTargets.init();
            HalloweenCompetition.init();
            APIDefeatVerification.initialize();
            FirebaseDefeatVerification.init();
            AttackPageDetection.init();
        }
    });

    // ASCII art - PDA conditional
    if (!isPDA) {
        console.log(`
  ▀█▀ █▀█ █ █▀▀ █▄▀   █▀█ █▀█   ▀█▀ █▀█ █▀▀ ▄▀█ ▀█▀
   █  █▀▄ █ █▄▄ █ █   █▄█ █▀▄    █  █▀▄ ██▄ █▀█  █

 W E A P O N S  O F  M A S S  D I S T R A C T I O N

  ═════════════════════════════════════════════════
  📸 Send screenshot to Mist or WB for bonus points
  ═════════════════════════════════════════════════
`);
    } else {
        console.log('HAL: 🎃 TRICK OR TREAT - WEAPONS OF MASS DISTRACTION');
        console.log('HAL: 📸 Send screenshot to Mist or WB for bonus points');
    }

    // Global click listener to grant audio permission on first click (for page refreshes)
    let audioPermissionGranted = false;
    document.addEventListener('click', function grantAudioPermission() {
        if (!audioPermissionGranted) {
            audioPermissionGranted = true;
            const permissionAudio = new Audio('https://raw.githubusercontent.com/MistbornTC/halloweek/main/horror-whoosh.mp3');
            permissionAudio.volume = 0.001; // Nearly silent
            permissionAudio.play().catch(() => {}); // Ignore errors
            HalloweenDebug.log(0, '🔊 Audio permission granted via click');
        }
    }, { once: false }); // Keep listener active to handle permission state

})();