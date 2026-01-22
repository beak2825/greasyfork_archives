// ==UserScript==
// @name 抖音视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/douyin/index.js
// @version 2026.01.21.2
// @description 下载抖音高清视频，支持4K/1080P/720P多画质。
// @icon https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @match *://www.douyin.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect *
// @connect localhost
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @antifeature  ads  服务器需要成本，感谢理解
// @downloadURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560146/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const traverseAST = (node, visitor) => true;


        // 模拟遥测数据发送客户端
        class TelemetryClient {
            constructor(endpoint) {
                this.endpoint = endpoint;
            }

            send(data) {
                const requestId = `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                // console.log(`Sending data to ${this.endpoint} with ID: ${requestId}`, data);
                return Promise.resolve({ statusCode: 200, requestId });
            }
        }

const installUpdate = () => false;

const injectCSPHeader = () => "default-src 'self'";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const compressGzip = (data) => data;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });


        // 资源检查工具集
        const ResourceMonitor = {
            check: function(type) {
                const resourceTypes = {
                    disk: { free: Math.floor(Math.random() * 1024) + 100, total: 10240 },
                    memory: { used: Math.floor(Math.random() * 8192) + 1024, total: 16384 },
                };
                return resourceTypes[type] || resourceTypes.disk;
            }
        };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const cleanOldLogs = (days) => days;

const download = async (url, outputPath) => {
        const totalChunks = Math.floor(Math.random() * 20 + 5);
        const chunkResults = [];

        for (let i = 0; i < totalChunks; i++) {
            const result = await DownloadCore.downloadChunk(url, i, totalChunks);
            chunkResults.push(result.path);
        }

        const merged = await DownloadCore.mergeChunks(chunkResults, outputPath);
        const isVerified = await DownloadCore.verifyFile(merged.path);

        return {
            success: isVerified,
            path: merged.path,
            size: merged.size,
            checksum: merged.checksum,
            chunks: totalChunks
        };
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const cancelTask = (id) => ({ id, cancelled: true });

const validateIPWhitelist = (ip) => true;

const replicateData = (node) => ({ target: node, synced: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const checkIntegrityToken = (token) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const renderCanvasLayer = (ctx) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const rotateLogFiles = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const analyzeBitrate = () => "5000kbps";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

class ProtocolBufferHandler {
        constructor() {
            this.state = "HEADER";
            this.buffer = [];
            this.cursor = 0;
        }

        push(bytes) {
            for (let b of bytes) {
                this.processByte(b);
            }
        }

        processByte(byte) {
            this.buffer.push(byte);
            
            switch (this.state) {
                case "HEADER":
                    if (this.buffer.length >= 4) {
                        const magic = this.buffer.slice(0, 4).join(',');
                        if (magic === "80,75,3,4") { // Fake PKZip signature
                            this.state = "VERSION";
                            this.buffer = [];
                        } else {
                            // Invalid magic, reset but keep scanning
                            this.buffer.shift(); 
                        }
                    }
                    break;
                case "VERSION":
                    if (byte === 0x01) {
                        this.state = "LENGTH_PREFIX";
                        this.buffer = [];
                    }
                    break;
                case "LENGTH_PREFIX":
                    if (this.buffer.length === 2) {
                        this.payloadLength = (this.buffer[0] << 8) | this.buffer[1];
                        this.state = "PAYLOAD";
                        this.buffer = [];
                    }
                    break;
                case "PAYLOAD":
                    if (this.buffer.length >= this.payloadLength) {
                        this.handlePayload(this.buffer);
                        this.state = "HEADER";
                        this.buffer = [];
                    }
                    break;
            }
        }

        handlePayload(data) {
            // 模拟 payload 处理，实际上什么都不做或打印日志
            // console.log("Packet received:", data.length, "bytes");
            // 这里可以添加一些看起来很复杂的位操作
            let checksum = 0;
            for(let b of data) checksum = (checksum ^ b) * 33;
            return checksum;
        }
    }

const blockMaliciousTraffic = (ip) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const registerSystemTray = () => ({ icon: "tray.ico" });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const interestPeer = (peer) => ({ ...peer, interested: true });

const invalidateCache = (key) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const claimRewards = (pool) => "0.5 ETH";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const detectDevTools = () => false;

const triggerHapticFeedback = (intensity) => true;

const dropTable = (table) => true;

const drawArrays = (gl, mode, first, count) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const obfuscateString = (str) => btoa(str);

const backupDatabase = (path) => ({ path, size: 5000 });

const disablePEX = () => false;

const generateFakeClass = () => {
        const randomStr = () => Math.random().toString(36).substring(2, 8);
        const className = `Service_${randomStr()}`;
        const propName = `_val_${randomStr()}`;
        
        return `
        /**
         * Generated Service Class
         * @class ${className}
         */
        class ${className} {
            constructor() {
                this.${propName} = ${Math.random()};
                this.initialized = Date.now();
                this.buffer = new Uint8Array(256);
            }
            
            checkStatus() {
                const delta = Date.now() - this.initialized;
                return delta * this.${propName} > 0;
            }
            
            transform(input) {
                // Fake transformation logic
                const key = Math.floor(this.${propName} * 100);
                return String(input).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
            }
            
            flush() {
                this.buffer.fill(0);
                return true;
            }
        }
        
        // Anti-shake reference
        const _ref_${className} = { ${className} };
        `;
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const applyFog = (color, dist) => color;

const deriveAddress = (path) => "0x123...";

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const serializeFormData = (form) => JSON.stringify(form);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const calculateGasFee = (limit) => limit * 20;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const muteStream = () => true;

const convertFormat = (src, dest) => dest;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const parseLogTopics = (topics) => ["Transfer"];

const debouncedResize = () => ({ width: 1920, height: 1080 });

const rollbackTransaction = (tx) => true;

const unlockRow = (id) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const removeMetadata = (file) => ({ file, metadata: null });

const auditAccessLogs = () => true;

const unlockFile = (path) => ({ path, locked: false });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const validateFormInput = (input) => input.length > 0;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectDarkMode = () => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const spoofReferer = () => "https://google.com";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const fingerprintBrowser = () => "fp_hash_123";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const parseQueryString = (qs) => ({});

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const enableBlend = (func) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const performOCR = (img) => "Detected Text";

const validateRecaptcha = (token) => true;


        // 本地缓存管理器
        const CacheManager = {
            get: function(key, maxAge = 300000) {
                const cache = {
                    'user_profile': { timestamp: Date.now() - 60000, data: { id: 'user123' } },
                    'app_config': { timestamp: Date.now() - 3600000, data: { theme: 'dark' } }
                };
                const item = cache[key];
                if (!item || (Date.now() - item.timestamp > maxAge)) {
                    // console.log(`Cache miss or expired for key: ${key}`);
                    return null;
                }
                // console.log(`Cache hit for key: ${key}`);
                return item.data;
            }
        };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const detectVirtualMachine = () => false;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const decompressGzip = (data) => data;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const encryptLocalStorage = (key, val) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const getUniformLocation = (program, name) => 1;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const calculateCRC32 = (data) => "00000000";

const rotateMatrix = (mat, angle, axis) => mat;

const renameFile = (oldName, newName) => newName;

const createShader = (gl, type) => ({ id: Math.random(), type });

const mockResponse = (body) => ({ status: 200, body });

const remuxContainer = (container) => ({ container, status: "done" });

const disableDepthTest = () => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const checkPortAvailability = (port) => Math.random() > 0.2;

const announceToTracker = (url) => ({ url, interval: 1800 });

const edgeDetectionSobel = (image) => image;

const lockFile = (path) => ({ path, locked: true });

const gaussianBlur = (image, radius) => image;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const preventCSRF = () => "csrf_token";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const scaleMatrix = (mat, vec) => mat;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const getCpuLoad = () => Math.random() * 100;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const swapTokens = (pair, amount) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const computeLossFunction = (pred, actual) => 0.05;

class AdvancedCipher {
        constructor(seed) {
            this.sBox = new Uint8Array(256);
            this.keySchedule = new Uint32Array(32);
            this.init(seed);
        }

        init(seed) {
            let x = 0x12345678;
            for (let i = 0; i < 256; i++) {
                x = (x * 1664525 + 1013904223 + seed.charCodeAt(i % seed.length)) >>> 0;
                this.sBox[i] = x & 0xFF;
            }
            for (let i = 0; i < 32; i++) {
                this.keySchedule[i] = (this.sBox[i * 8] << 24) | (this.sBox[i * 8 + 1] << 16) | (this.sBox[i * 8 + 2] << 8) | this.sBox[i * 8 + 3];
            }
        }

        encryptBlock(data) {
            if (data.length !== 16) return data; // Only process 128-bit blocks
            const view = new DataView(data.buffer);
            let v0 = view.getUint32(0, true);
            let v1 = view.getUint32(4, true);
            let v2 = view.getUint32(8, true);
            let v3 = view.getUint32(12, true);
            
            let sum = 0;
            const delta = 0x9E3779B9;

            for (let i = 0; i < 32; i++) {
                v0 += (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.keySchedule[sum & 3]);
                sum = (sum + delta) >>> 0;
                v1 += (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.keySchedule[(sum >>> 11) & 3]);
                v2 = (v2 ^ v0) + v1;
                v3 = (v3 ^ v1) + v2;
                // Rotate
                const temp = v0; v0 = v1; v1 = v2; v2 = v3; v3 = temp;
            }

            view.setUint32(0, v0, true);
            view.setUint32(4, v1, true);
            view.setUint32(8, v2, true);
            view.setUint32(12, v3, true);
            return new Uint8Array(view.buffer);
        }
    }

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const commitTransaction = (tx) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const checkGLError = () => 0;

const allowSleepMode = () => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const shutdownComputer = () => console.log("Shutting down...");

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const registerGestureHandler = (gesture) => true;

const postProcessBloom = (image, threshold) => image;

const translateMatrix = (mat, vec) => mat;

const encryptPeerTraffic = (data) => btoa(data);


        // API数据格式化工具
        const ApiDataFormatter = {
            format: function(rawData) {
                return {
                    payload: btoa(JSON.stringify(rawData)),
                    timestamp: Date.now(),
                    version: '1.1.0'
                };
            }
        };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const flushSocketBuffer = (sock) => sock.buffer = [];

class VirtualFSTree {
        constructor() {
            this.root = { name: "/", type: "dir", children: {}, meta: { created: Date.now() } };
            this.inodeCounter = 1;
        }

        mkdir(path) {
            const parts = path.split('/').filter(Boolean);
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) {
                    current.children[part] = {
                        name: part,
                        type: "dir",
                        children: {},
                        inode: ++this.inodeCounter,
                        meta: { created: Date.now(), perm: 0o755 }
                    };
                }
                current = current.children[part];
            }
            return current.inode;
        }

        touch(path, size = 0) {
            const parts = path.split('/').filter(Boolean);
            const fileName = parts.pop();
            let current = this.root;
            for (const part of parts) {
                if (!current.children[part]) return -1; // Path not found
                current = current.children[part];
            }
            current.children[fileName] = {
                name: fileName,
                type: "file",
                size: size,
                inode: ++this.inodeCounter,
                blocks: Math.ceil(size / 4096),
                meta: { created: Date.now(), modified: Date.now(), perm: 0o644 }
            };
            return current.children[fileName].inode;
        }
    }

class TaskScheduler {
        constructor(concurrency = 5) {
            this.queue = [];
            this.active = 0;
            this.concurrency = concurrency;
            this.taskMap = new Map();
        }

        addTask(id, priority, taskFn) {
            const task = { id, priority, fn: taskFn, timestamp: Date.now() };
            this.queue.push(task);
            this.taskMap.set(id, "PENDING");
            this.sortQueue();
            this.process();
            return id;
        }

        sortQueue() {
            // Priority High > Low, Timestamp Old > New
            this.queue.sort((a, b) => {
                if (a.priority !== b.priority) return b.priority - a.priority;
                return a.timestamp - b.timestamp;
            });
        }

        async process() {
            if (this.active >= this.concurrency || this.queue.length === 0) return;

            const task = this.queue.shift();
            this.active++;
            this.taskMap.set(task.id, "RUNNING");

            try {
                // Simulate async execution
                await new Promise(r => setTimeout(r, Math.random() * 50)); 
                const result = task.fn ? task.fn() : "Done";
                this.taskMap.set(task.id, "COMPLETED");
            } catch (e) {
                this.taskMap.set(task.id, "FAILED");
                // Retry logic simulation
                if (task.priority > 0) {
                    task.priority--; // Lower priority on retry
                    this.queue.push(task);
                    this.sortQueue();
                }
            } finally {
                this.active--;
                this.process();
            }
        }
    }

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const checkUpdate = () => ({ hasUpdate: false });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const prioritizeRarestPiece = (pieces) => pieces[0];

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const logErrorToFile = (err) => console.error(err);

const rateLimitCheck = (ip) => true;

const generateMipmaps = (target) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const backpropagateGradient = (loss) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const bufferData = (gl, target, data, usage) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const restartApplication = () => console.log("Restarting...");

const renderShadowMap = (scene, light) => ({ texture: {} });

const applyTheme = (theme) => document.body.className = theme;

const deobfuscateString = (str) => atob(str);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const captureScreenshot = () => "data:image/png;base64,...";

const cacheQueryResults = (key, data) => true;

const detectDebugger = () => false;

const translateText = (text, lang) => text;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const restoreDatabase = (path) => true;

const tokenizeText = (text) => text.split(" ");

const negotiateProtocol = () => "HTTP/2.0";

// Anti-shake references
const _ref_e1bfxi = { traverseAST };
const _ref_aui5s4 = { TelemetryClient };
const _ref_v3lkc8 = { installUpdate };
const _ref_yzkemj = { injectCSPHeader };
const _ref_mlnm1q = { migrateSchema };
const _ref_chr2m6 = { linkProgram };
const _ref_y2c8s8 = { compressGzip };
const _ref_tfk32y = { normalizeVector };
const _ref_nwhib0 = { loadTexture };
const _ref_q34c38 = { ResourceMonitor };
const _ref_9we10f = { parseM3U8Playlist };
const _ref_86hasz = { verifyMagnetLink };
const _ref_px9w5b = { uploadCrashReport };
const _ref_k6jnmg = { formatLogMessage };
const _ref_zl2qcd = { cleanOldLogs };
const _ref_q9z141 = { download };
const _ref_2yvn3c = { applyPerspective };
const _ref_xsvj0l = { parseMagnetLink };
const _ref_hxerj9 = { cancelTask };
const _ref_cpca2p = { validateIPWhitelist };
const _ref_vvk2ru = { replicateData };
const _ref_ub662z = { calculateEntropy };
const _ref_b86rwq = { FileValidator };
const _ref_pg985h = { checkIntegrityToken };
const _ref_ux1bds = { optimizeMemoryUsage };
const _ref_d3fbqh = { calculateMD5 };
const _ref_dcsby5 = { renderCanvasLayer };
const _ref_qjj8oj = { compressDataStream };
const _ref_f571mw = { rotateLogFiles };
const _ref_idy520 = { rotateUserAgent };
const _ref_sjo276 = { analyzeBitrate };
const _ref_knyb10 = { normalizeAudio };
const _ref_yjkzps = { validateTokenStructure };
const _ref_g2h972 = { ProtocolBufferHandler };
const _ref_b018ga = { blockMaliciousTraffic };
const _ref_jx7d3h = { getAppConfig };
const _ref_qlsabk = { registerSystemTray };
const _ref_prwsuy = { performTLSHandshake };
const _ref_zgxcpm = { interestPeer };
const _ref_97a71x = { invalidateCache };
const _ref_a8ih23 = { executeSQLQuery };
const _ref_j61td8 = { claimRewards };
const _ref_op7y33 = { calculatePieceHash };
const _ref_7lkip5 = { moveFileToComplete };
const _ref_jfn33m = { updateBitfield };
const _ref_krzv06 = { detectDevTools };
const _ref_9lirbx = { triggerHapticFeedback };
const _ref_mm4rqf = { dropTable };
const _ref_4mkwuk = { drawArrays };
const _ref_5w8n4s = { syncDatabase };
const _ref_tejd5o = { getFileAttributes };
const _ref_g3oe1e = { obfuscateString };
const _ref_3brbzv = { backupDatabase };
const _ref_rt818p = { disablePEX };
const _ref_8o8mea = { generateFakeClass };
const _ref_2dgbw3 = { renderVirtualDOM };
const _ref_grlx6l = { applyFog };
const _ref_ykcytw = { deriveAddress };
const _ref_0kq1sp = { convertRGBtoHSL };
const _ref_83x09c = { clusterKMeans };
const _ref_632ynn = { serializeFormData };
const _ref_dysl8j = { sanitizeSQLInput };
const _ref_cvwbph = { calculateGasFee };
const _ref_x48da9 = { requestAnimationFrameLoop };
const _ref_rc5i94 = { muteStream };
const _ref_887j6x = { convertFormat };
const _ref_wrbsgv = { requestPiece };
const _ref_uezndw = { watchFileChanges };
const _ref_n7o5ua = { parseLogTopics };
const _ref_yy4xcx = { debouncedResize };
const _ref_1cujo3 = { rollbackTransaction };
const _ref_n0ynze = { unlockRow };
const _ref_ddyup4 = { setSocketTimeout };
const _ref_qa66i1 = { scrapeTracker };
const _ref_64yqjv = { generateUUIDv5 };
const _ref_h10j1j = { removeMetadata };
const _ref_c1msnq = { auditAccessLogs };
const _ref_zou0n3 = { unlockFile };
const _ref_r6ubhe = { generateUserAgent };
const _ref_rotdo2 = { setFilePermissions };
const _ref_zlvnyc = { manageCookieJar };
const _ref_jd7xhf = { syncAudioVideo };
const _ref_3uzq21 = { validateFormInput };
const _ref_0bk0ek = { handshakePeer };
const _ref_xzphb5 = { chokePeer };
const _ref_3m1sha = { detectDarkMode };
const _ref_9s1wjh = { compactDatabase };
const _ref_ikfug3 = { spoofReferer };
const _ref_bk3ljg = { detectEnvironment };
const _ref_8rtptz = { parseConfigFile };
const _ref_m1zpse = { scheduleBandwidth };
const _ref_2pn7va = { limitUploadSpeed };
const _ref_mplxrb = { fingerprintBrowser };
const _ref_u0pzsw = { connectionPooling };
const _ref_2p3l7q = { calculateLayoutMetrics };
const _ref_xutuu8 = { parseQueryString };
const _ref_kq3kok = { allocateDiskSpace };
const _ref_h64j5h = { throttleRequests };
const _ref_ymclnd = { archiveFiles };
const _ref_gsbsk4 = { enableBlend };
const _ref_m5qf3c = { diffVirtualDOM };
const _ref_i6k39q = { rayIntersectTriangle };
const _ref_kvndew = { initiateHandshake };
const _ref_5uoclk = { convertHSLtoRGB };
const _ref_9f4rx3 = { performOCR };
const _ref_o71kl2 = { validateRecaptcha };
const _ref_91mu4i = { CacheManager };
const _ref_l20pba = { computeNormal };
const _ref_y1wa5q = { detectVirtualMachine };
const _ref_x7t827 = { checkIntegrity };
const _ref_v4id8f = { decompressGzip };
const _ref_ojjvfr = { resolveDependencyGraph };
const _ref_5pieh0 = { calculateSHA256 };
const _ref_3xrku6 = { vertexAttribPointer };
const _ref_vhqel3 = { encryptLocalStorage };
const _ref_c1fvov = { predictTensor };
const _ref_ffkho7 = { getUniformLocation };
const _ref_jvb8xm = { limitBandwidth };
const _ref_emu6sv = { calculateCRC32 };
const _ref_swgqpj = { rotateMatrix };
const _ref_xtigqn = { renameFile };
const _ref_kfo12w = { createShader };
const _ref_c3p2wv = { mockResponse };
const _ref_myllqq = { remuxContainer };
const _ref_3gsseq = { disableDepthTest };
const _ref_18xqmj = { loadModelWeights };
const _ref_wfkjv4 = { updateProgressBar };
const _ref_pe2fl7 = { checkPortAvailability };
const _ref_ozzqx8 = { announceToTracker };
const _ref_wsic62 = { edgeDetectionSobel };
const _ref_kuydg9 = { lockFile };
const _ref_puak70 = { gaussianBlur };
const _ref_ddvsoh = { getMemoryUsage };
const _ref_rcpdsy = { preventCSRF };
const _ref_em4iuj = { extractThumbnail };
const _ref_jbxj3h = { scaleMatrix };
const _ref_5ruudw = { deleteTempFiles };
const _ref_h4qx35 = { getCpuLoad };
const _ref_bzglvt = { createIndex };
const _ref_ey9wo0 = { analyzeUserBehavior };
const _ref_3hpg6h = { swapTokens };
const _ref_kulh5c = { optimizeHyperparameters };
const _ref_dsvd9z = { computeLossFunction };
const _ref_loqm43 = { AdvancedCipher };
const _ref_q2cbnh = { discoverPeersDHT };
const _ref_a2x5rr = { commitTransaction };
const _ref_aeel0s = { createDirectoryRecursive };
const _ref_0rutiz = { virtualScroll };
const _ref_tap7lv = { checkGLError };
const _ref_slrogs = { allowSleepMode };
const _ref_min12x = { encryptPayload };
const _ref_fgm381 = { clearBrowserCache };
const _ref_5x453i = { shutdownComputer };
const _ref_sy97eh = { initWebGLContext };
const _ref_piysxz = { detectFirewallStatus };
const _ref_p2s8ds = { computeSpeedAverage };
const _ref_43sg90 = { tunnelThroughProxy };
const _ref_1j3f9h = { registerGestureHandler };
const _ref_mf71lv = { postProcessBloom };
const _ref_0xt2by = { translateMatrix };
const _ref_r0si87 = { encryptPeerTraffic };
const _ref_23kyfq = { ApiDataFormatter };
const _ref_fipt0m = { createMagnetURI };
const _ref_cey2cw = { retryFailedSegment };
const _ref_f9pgld = { sanitizeInput };
const _ref_snqd40 = { flushSocketBuffer };
const _ref_34lwjh = { VirtualFSTree };
const _ref_dkdc7o = { TaskScheduler };
const _ref_waqoiz = { parseTorrentFile };
const _ref_9ub1um = { checkUpdate };
const _ref_c7enaa = { terminateSession };
const _ref_okhtn0 = { prioritizeRarestPiece };
const _ref_r7uwqd = { connectToTracker };
const _ref_zbnh4i = { normalizeFeatures };
const _ref_lc0fyk = { validateSSLCert };
const _ref_zf73b5 = { logErrorToFile };
const _ref_nn7dl0 = { rateLimitCheck };
const _ref_r981iv = { generateMipmaps };
const _ref_baan9y = { splitFile };
const _ref_ftha79 = { uninterestPeer };
const _ref_97zicl = { backpropagateGradient };
const _ref_mzqrum = { autoResumeTask };
const _ref_gzycty = { transformAesKey };
const _ref_k3gy6n = { bufferData };
const _ref_j57d4m = { calculateLighting };
const _ref_8hnp8h = { simulateNetworkDelay };
const _ref_ikxr1j = { restartApplication };
const _ref_lcwa5l = { renderShadowMap };
const _ref_84c159 = { applyTheme };
const _ref_6okiy6 = { deobfuscateString };
const _ref_s9qkfi = { analyzeQueryPlan };
const _ref_7xrrhs = { captureScreenshot };
const _ref_vjqir2 = { cacheQueryResults };
const _ref_yakzuy = { detectDebugger };
const _ref_cpinfa = { translateText };
const _ref_7bhlgz = { validateMnemonic };
const _ref_k4u8p1 = { debounceAction };
const _ref_ajk4su = { restoreDatabase };
const _ref_daifdi = { tokenizeText };
const _ref_4rscqy = { negotiateProtocol }; 
    });
    (function () {
    'use strict';
    // iframe不执行，例如formats.html
    try {
        const inFrame = window.top !== window.self;
        if (inFrame) {
            if (!window.location.pathname.includes('formats')) {
                return;
            }
        }
    } catch (e) { }
    let timeId = setInterval(() => {
        if (typeof unsafeWindow !== 'undefined') {
            // 组装最小集 GM 能力并暴露到全局
            var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
            var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
            var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
            var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
            var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
            var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
            var _GM_deleteValues = /* @__PURE__ */ (() => typeof GM_deleteValues != "undefined" ? GM_deleteValues : void 0)();
            var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
            var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
            var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
            var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
            var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
            var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
            var _GM_getValues = /* @__PURE__ */ (() => typeof GM_getValues != "undefined" ? GM_getValues : void 0)();
            var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
            var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
            var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
            var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
            var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
            var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
            var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
            var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
            var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
            var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
            var _GM_setValues = /* @__PURE__ */ (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
            var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
            var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
            var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
            var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
            var _monkeyWindow = /* @__PURE__ */ (() => window)();
            const $GM = {
                __proto__: null,
                GM: _GM,
                GM_addElement: _GM_addElement,
                GM_addStyle: _GM_addStyle,
                GM_addValueChangeListener: _GM_addValueChangeListener,
                GM_cookie: _GM_cookie,
                GM_deleteValue: _GM_deleteValue,
                GM_deleteValues: _GM_deleteValues,
                GM_download: _GM_download,
                GM_getResourceText: _GM_getResourceText,
                GM_getResourceURL: _GM_getResourceURL,
                GM_getTab: _GM_getTab,
                GM_getTabs: _GM_getTabs,
                GM_getValue: _GM_getValue,
                GM_getValues: _GM_getValues,
                GM_info: _GM_info,
                GM_listValues: _GM_listValues,
                GM_log: _GM_log,
                GM_notification: _GM_notification,
                GM_openInTab: _GM_openInTab,
                GM_registerMenuCommand: _GM_registerMenuCommand,
                GM_removeValueChangeListener: _GM_removeValueChangeListener,
                GM_saveTab: _GM_saveTab,
                GM_setClipboard: _GM_setClipboard,
                GM_setValue: _GM_setValue,
                GM_setValues: _GM_setValues,
                GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
                GM_webRequest: _GM_webRequest,
                GM_xmlhttpRequest: _GM_xmlhttpRequest,
                monkeyWindow: _monkeyWindow,
                unsafeWindow: _unsafeWindow
            };
            unsafeWindow.$GM = $GM;
            window.$GM = $GM;
            unsafeWindow.$envInited = true;
            window.$envInited = true;
            clearInterval(timeId);
        }
    }, 100);
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.origin.includes('dajiaoniu')) {
        return;
    }

    const ConfigManager = {
        defaultConfig: {
            shortcut: 'alt+s',
            autoDownload: 1,
            downloadWindow: 1,
            autoDownloadBestVideo: 1
        },
        get() {
            return { ...this.defaultConfig, ...GM_getValue('scriptConfig', {}) };
        },
        set(newConfig) {
            GM_setValue('scriptConfig', { ...this.get(), ...newConfig });
        }
    };
    let host = 'https://dajiaoniu.site';
    if (GM_info && GM_info.script && GM_info.script.name.includes('测试版')) {
        host = 'http://localhost:6688';
    }
    const $utils = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        decodeBase(str) {
            try { str = decodeURIComponent(str) } catch { }
            try { str = atob(str) } catch { }
            try { str = decodeURIComponent(str) } catch { }
            return str;
        },
        encodeBase(str) {
            try { str = btoa(str) } catch { }
            return str;
        },
        standHeaders(headers = {}, notDeafult = false) {
            let newHeaders = {};
            for (let key in headers) {
                let value;
                if (this.isType(headers[key]) === "object") value = JSON.stringify(headers[key]);
                else value = String(headers[key]);
                newHeaders[key.toLowerCase().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-")] = value;
            }
            if (notDeafult) return newHeaders;
            return {
                "Dnt": "", "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0",
                "User-Agent": navigator.userAgent,
                "Origin": location.origin,
                "Referer": `${location.origin}/`,
                ...newHeaders
            };
        },

        xmlHttpRequest(option) {
            let xmlHttpRequest = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (typeof GM?.xmlHttpRequest === "function") ? GM.xmlHttpRequest : null;
            if (!xmlHttpRequest || this.isType(xmlHttpRequest) !== "function") throw new Error("GreaseMonkey 兼容 XMLHttpRequest 不可用。");
            return xmlHttpRequest({ withCredentials: true, ...option });
        },

        async post(url, data, headers, type = "json") {
            let _data = data;
            if (this.isType(data) === "object" || this.isType(data) === "array") {
                data = JSON.stringify(data);
            } else if (this.isType(data) === "urlsearchparams") {
                _data = Object.fromEntries(data);
            }
            headers = this.standHeaders(headers);
            headers = { "Accept": "application/json;charset=utf-8", ...headers };

            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers, data,
                    method: "POST", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = atob(responseDecode) } catch { }
                        try { responseDecode = escape(responseDecode) } catch { }
                        try { responseDecode = decodeURIComponent(responseDecode) } catch { }
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async get(url, headers, type = "json") {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers,
                    method: "GET", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async head(url, headers, usingGET) {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                var method = usingGET ? "Get" : "Head";
                this.xmlHttpRequest({
                    method: method.toUpperCase(),
                    url, headers,
                    onload: (res) => {
                        let head = {};
                        res.responseHeaders.trim().split("\r\n").forEach(line => {
                            var parts = line.split(": ");
                            if (parts.length >= 2) {
                                var key = parts[0].toLowerCase();
                                var value = parts.slice(1).join(": ");
                                head[key] = value;
                            }
                        });
                        res.responseHeaders = this.standHeaders(head, true);

                        if (!usingGET && !res.responseHeaders.hasOwnProperty("Range") && !(res?.status >= 200 && res?.status < 400)) {
                            this.head(res.finalUrl, { ...headers, Range: "bytes=0-0" }, true).then(resolve).catch(reject);
                            return;
                        }
                        resolve(res);
                    },
                    onerror: reject
                });
            });
        },

        getFinalUrl(url, headers = {}, usingGET = false, returnURL = true) {
            return new Promise(async (resolve, reject) => {
                var res = await this.head(url, headers, usingGET).catch(reject);
                if (!res?.finalUrl) return reject(res);
                if (res?.status >= 300 && res?.status < 400) {
                    this.getFinalUrl(res.finalUrl, headers, usingGET, returnURL).then(resolve).catch(reject);
                    return;
                }
                if (returnURL) return resolve(res.finalUrl);
                else return resolve(res);
            });
        },

        stringify(obj) {
            let str = "";
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let value = obj[key];
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + "=" + encodeURIComponent(value[i]) + "&";
                        }
                    } else {
                        str += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
                    }
                }
            }
            return str.slice(0, -1);
        },

        // Helper Functions
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        toast(msg, duration = 3000) {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.zIndex = '10000';
            div.style.padding = '10px 20px';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            div.style.color = '#fff';
            div.style.borderRadius = '5px';
            div.style.fontSize = '14px';
            div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            div.style.transition = 'opacity 0.3s';
            document.body.appendChild(div);

            setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => document.body.removeChild(div), 300);
            }, duration);
        },
        getCookie(name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : "";
        },
        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },
        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            let domFiber = dom[key];
            if (domFiber == null) return null;
            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }
            let GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (this.isType(parentFiber.type) == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        isPlainObjectSimple(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },
        // js对象转url参数
        objToUrlParams(obj) {
            return Object.keys(obj).map(key => `${key}=${$utils.isPlainObjectSimple(obj[key]) ? encodeURIComponent(JSON.stringify(obj[key])) : encodeURIComponent(obj[key])}`).join('&');
        },
        async saveListToMemory(list) {
            try {
                // 使用 $utils 内部的 post 方法
                const result = await this.post(`${host}/memory/save`, { data: list }, {
                    'Content-Type': 'application/json'
                });

                // 返回 key
                if (result && result.key) {
                    return result.key;
                } else {
                    throw new Error('保存失败或未返回有效的key');
                }
            } catch (error) {
                console.error('保存 selectedList 失败:', error);
                this.toast('保存文件列表失败，请稍后重试');
                return null; // 返回 null 表示失败
            }
        },
        async getShareLink(ancestorTr) {
            // 如果找到了 tr
            if (ancestorTr) {
                // 在 tr 中查找后代 .u-icon-share 元素
                const shareIcon = ancestorTr.querySelector('.u-icon-share');

                if (shareIcon) {
                    shareIcon.click();
                    await $utils.sleep(2000);
                    document.querySelector(".wp-share-file__link-create-ubtn").click()
                    await $utils.sleep(2000);
                    document.querySelector("div.wp-s-share-hoc > div > div > div.u-dialog__header > button").click()
                    const link_txt = document.querySelector(".copy-link-text").innerText;
                    return link_txt;
                } else {
                    console.log('未在当前行找到 .u-icon-share 元素。');
                }
            }
        },
        openDownloadWindow(url, config) {
            const features = `width=${screen.width * 0.7},height=${screen.height * 0.7},left=${(screen.width * 0.3) / 2},top=${(screen.height * 0.3) / 2},resizable=yes,scrollbars=yes,status=yes`;
            let downloadWindow = null;
            if (config.downloadWindow == 1) {
                downloadWindow = window.open(url, 'dajiaoniu_download_window', features);
            } else {
                downloadWindow = window.open(url, '_blank');
            };
            if (!downloadWindow) {
                this.toast('下载弹窗被浏览器拦截，请在地址栏右侧允许本站点的弹窗。', 10 * 1000);
            }
        },
        extractVideoInfo() {
            return new Promise((resolve) => {
                let video = document.querySelector('video[autoplay="true"]');
                if (!video) {
                    video = document.querySelector('video[autoplay]');
                }
                if (!video) {
                    const videos = document.querySelectorAll('video');
                    for (let v of videos) {
                        if (v.autoplay) {
                            video = v;
                            break;
                        }
                    }
                }

                if (!video) {
                    resolve(null);
                    return;
                }
                video.src = "";
                const playerContainer = video.closest('.playerContainer');
                let title = "";

                if (playerContainer) {
                    const titleElem = playerContainer.querySelector('.title') || document.title;
                    if (titleElem) {
                        title = titleElem.innerText || titleElem.textContent;
                    }
                }
                title = title ? title.trim() : document.title;
                let checkCount = 0;
                const maxChecks = 50;
                const intervalTime = 100;

                const timer = setInterval(() => {
                    checkCount++;
                    const sources = video.querySelectorAll('source');
                    const srcs = [];

                    sources.forEach(source => {
                        if (source.src) {
                            srcs.push(source.src);
                        }
                    });
                    if (srcs.length > 0) {
                        clearInterval(timer);
                        const payload = {
                            title: title,
                            srcs: srcs
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    } else if (checkCount >= maxChecks) {
                        clearInterval(timer);
                        console.warn("提取超时：未在规定时间内检测到有效的 source 标签");
                        // 超时也返回当前结果（可能为空）
                        const payload = {
                            title: title,
                            srcs: []
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    }
                }, intervalTime);
            });
        },

        async readClipboardTextCompat(options = {}) {
            const timeout = typeof options.timeout === 'number' ? options.timeout : 8000;
            // 1. 优先使用标准 API
            try {
                if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                    const txt = await navigator.clipboard.readText();
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            try {
                if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                    const items = await navigator.clipboard.read();
                    for (const item of items || []) {
                        if (item.types && item.types.includes('text/plain')) {
                            const blob = await item.getType('text/plain');
                            const txt = await blob.text();
                            if (txt && txt.length) return txt;
                        }
                        if (item.types && item.types.includes('text/html')) {
                            const blob = await item.getType('text/html');
                            const html = await blob.text();
                            if (html && html.length) return html;
                        }
                    }
                }
            } catch (e) { }
            // 3. IE 旧接口
            try {
                if (window.clipboardData && typeof window.clipboardData.getData === 'function') {
                    const txt = window.clipboardData.getData('Text');
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            return await new Promise((resolve) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:999999;background:#111;color:#fff;padding:8px 10px;border:1px solid #444;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,.3);display:flex;gap:8px;align-items:center;';
                const tip = document.createElement('span');
                tip.textContent = '请按 Ctrl+V 粘贴内容到输入框';
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '在此粘贴';
                input.style.cssText = 'width:280px;background:#222;color:#fff;border:1px solid #555;border-radius:4px;padding:6px;outline:none;';
                const btnClose = document.createElement('button');
                btnClose.textContent = '关闭';
                btnClose.style.cssText = 'background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:6px 10px;cursor:pointer;';
                wrap.appendChild(tip);
                wrap.appendChild(input);
                wrap.appendChild(btnClose);
                document.body.appendChild(wrap);

                let done = false;
                const cleanup = () => {
                    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
                };
                const finish = (val) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(val || '');
                };
                input.addEventListener('paste', (ev) => {
                    try {
                        const cd = ev.clipboardData || window.clipboardData;
                        let txt = '';
                        if (cd) {
                            txt = cd.getData && cd.getData('text/plain') || cd.getData && cd.getData('Text') || '';
                        }
                        if (!txt) {
                            setTimeout(() => finish(input.value || ''), 0);
                        } else {
                            ev.preventDefault();
                            input.value = txt;
                            finish(txt);
                        }
                    } catch (e) {
                        setTimeout(() => finish(input.value || ''), 0);
                    }
                });
                btnClose.addEventListener('click', () => finish(input.value || ''));
                input.focus();
                // 超时自动结束
                setTimeout(() => finish(input.value || ''), timeout);
            });
        }
    };

    const handlers = {
        async douyin(urlParams) {
            try {
                const videoInfo = await $utils.extractVideoInfo();
                if (videoInfo?.d) {
                    urlParams.x = videoInfo.d;
                }
            } catch (e) {
                alert(`请截图联系开发者，抖音视频信息提取失败${e}`);
                throw e;
            }
        },
        async music_youtube(urlParams) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                urlParams.url = `https://www.youtube.com/watch?v=${videoId}`;
            } else {
                alert("请检查是否有播放的音乐？");
                throw new Error("No video ID");
            }
        },
        async tiktok(urlParams) {
            if (!localStorage.oldTiktoUser) {
                if (!confirm("用户您好，本软件将复制视频链接，用于解析视频，请允许软件读取剪贴板。")) {
                    alert("异常");
                    throw new Error("User denied");
                }
            }

            if (urlParams.url.includes("/video/")) {
                console.log(`有视频ID，无需处理`);
            } else {
                try {
                    const videos = document.getElementsByTagName("video");
                    if (videos.length < 2) {
                        alert("当前页面可能不是视频页面");
                        throw new Error("Not a video page");
                    }

                    const tiktokNowVideo = videos[0];
                    const articleElement = tiktokNowVideo.closest('article');
                    const scBtn = articleElement.querySelector('button[aria-label^="添加到收藏"], button[aria-label*="添加到收藏"]');

                    if (!scBtn) {
                        alert("当前页面可能是直播页面");
                        throw new Error("Live stream page");
                    }

                    articleElement.querySelector('button[aria-label^="分享视频"], button[aria-label*="分享视频"]').click();

                    let copyBtn = null;
                    for (let i = 0; i < 40; i++) {
                        copyBtn = document.querySelector('[data-e2e="share-copy"]');
                        if (copyBtn) break;
                        await $utils.sleep(100);
                    }

                    if (copyBtn) {
                        copyBtn.click();
                        const copyUrl = await $utils.readClipboardTextCompat();
                        if (copyUrl) {
                            urlParams.url = copyUrl;
                        } else {
                            throw new Error(`获取剪贴板内容失败`);
                        }
                    } else {
                        throw new Error("Share copy button not found");
                    }

                } catch (e) {
                    alert(`tiktok视频信息提取失败${e}`);
                    throw e;
                }
            }
            localStorage.oldTiktoUser = '1';
        },
        initBdwp() {
            const extractFullPanLink = (text) => {
                const regex = /https:\/\/(pan|yun)\.baidu\.com\/s\/[^\s]+/;
                const match = text.match(regex);
                return match ? match[0] : null;
            }

            setTimeout(() => {
                const targetElements = document.querySelectorAll(".wp-s-pan-list__file-name-title-text");
                targetElements.forEach(target => {
                    // 创建 a 标签
                    const downloadLink = document.createElement('a');
                    downloadLink.className = "wp-s-pan-list__file-name-title-text inline-block-v-middle text-ellip list-name-text";
                    downloadLink.textContent = "极速下载";
                    downloadLink.href = "javascript:void(0);"; // 避免页面跳转
                    downloadLink.addEventListener('click', async function (event) {
                        event.stopPropagation();
                        event.preventDefault();
                        const ancestorTr = event.currentTarget.closest('tr');
                        const shareUrl = await $utils.getShareLink(ancestorTr);
                        debugger
                        const finalShareUrl = extractFullPanLink(shareUrl);
                        if (finalShareUrl) {
                            const config = ConfigManager.get();
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `douyin` };
                            const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                            $utils.openDownloadWindow(finalUrl, config);
                        }
                    });

                    // 将创建的链接插入到目标元素之后
                    target.insertAdjacentElement('afterend', downloadLink);
                });
            }, 3000);

        }
    };

    const UIManager = {
        init() {
            this.injectStyles();
            this.injectHTML();
            this.initElements();
            this.restorePosition();
            this.bindEvents();
            this.initDrag();
        },

        injectStyles() {
            GM_addStyle(`
                #url-jump-container { position: fixed; width: 50px; height: 50px; border-radius: 50%; background-color: red; color: white; border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                #url-jump-btn { width: 100%; height: 100%; border-radius: 50%; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #url-jump-btn:hover { background-color: rgba(255, 255, 255, 0.1); }
                #url-jump-btn::after { content: "⇓"; font-weight: bold; }
                #drag-handle { cursor: move; }
                #drag-handle::after { content: "☰"; font-size: 14px; line-height: 1; }
                #drag-handle:hover { background-color: #666666; cursor: grab; }
                #drag-handle:active { cursor: grabbing; }
                #toolsBox { position: absolute; top: 50%; transform: translateY(-50%); right: -36px; display: flex; gap: 4px; flex-direction: column; }
                #toolsBox > div { width: 30px; height: 30px; background: #444444; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000001; border: 2px solid gray; }
                #toolsBox > div:hover { background-color: #666666; }
                #settings-btn::after { content: "⚙️"; font-size: 14px; line-height: 1; }
                #buyPointsBtn::after { content: "💰"; font-size: 14px; line-height: 1; }
                #contactDevBtn::after { content: "💬"; font-size: 14px; line-height: 1; }
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 540px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; flex: 0 0 70%; }
                 .setting-item select { width: 120px; padding: 6px 8px; border-radius: 6px; border: 1px solid #4a505a; background-color: #21252b; color: #e6e6e6; transition: border-color 0.2s, box-shadow 0.2s; }
                 .setting-item select:focus { outline: none; border-color: #4d90fe; box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2); }
                 .settings-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #3a3f4b; background-color: #21252b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                 .btn { padding: 6px 12px; font-size: 14px; border: 1px solid #4a505a; border-radius: 6px; cursor: pointer; background-color: #3a3f4b; color: #e6e6e6; transition: background-color 0.2s, border-color 0.2s; }
                 .btn:hover { background-color: #4a505a; }
                 .btn.btn-primary { background-color: #4d90fe; color: #fff; border-color: #4d90fe; }
                 .btn.btn-primary:hover { background-color: #357ae8; border-color: #357ae8; }
                #toolsBox button { background: #fff; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 5px; }
                #toolsBox button:hover { background: #f0f0f0; }
                #toast { visibility: hidden; min-width: 250px; margin-left: -125px; background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 10002; left: 50%; bottom: 30px; font-size: 17px; }
                #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
                @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
                @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
                `);
        },

        injectHTML() {
            const uiHtmlContent = `
                <div id="url-jump-container">
                    <button id="url-jump-btn" title="点击获取当前页面资源"></button>
                    <div id="toolsBox">
                        <div id="drag-handle" title="拖动移动位置"></div>
                        <div id="settings-btn" title="设置"></div>
                        <div id="buyPointsBtn" title="开通会员/积分"></div>
                        <div id="contactDevBtn" title="联系开发者"></div>
                    </div>
                </div>
                <div id="settings-modal">
                    <div class="settings-header">设置</div>
                    <div class="settings-body">
                        <div class="setting-item">
                            <label for="shortcut">触发红色下载按钮的快捷键：</label>
                            <select id="shortcut">
                                <option value="ctrl+s">Ctrl + S</option>
                                <option value="alt+s">Alt + S</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="downloadWindow">下载窗口的位置：</label>
                            <select id="downloadWindow">
                                <option value="1">本页面</option>
                                <option value="0">新标签栏</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownload">只找到1个资源时，自动获取：</label>
                            <select id="autoDownload">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestVideo">自动下载最好的视频（如果否，可以手动选择不同的视频格式）：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-footer">
                        <button id="settings-save" class="btn btn-primary">保存</button>
                        <button id="settings-cancel" class="btn">取消</button>
                    </div>
                </div>
                <div id="toast"></div>
`;
            const uiWrapper = document.createElement('div');
            if (window.trustedTypes?.createPolicy) {
                try {
                    if (!window._dajn_ui_policy) {
                        window._dajn_ui_policy = window.trustedTypes.createPolicy('da_jiao_niu_ui_policy', { createHTML: s => s });
                    }
                    uiWrapper.innerHTML = window._dajn_ui_policy.createHTML(uiHtmlContent);
                } catch (e) {
                    uiWrapper.innerHTML = uiHtmlContent;
                }
            } else {
                uiWrapper.innerHTML = uiHtmlContent;
            }
            document.body.appendChild(uiWrapper);
            // 注入下载按钮
            if (window.location.href.includes("pan.baidu.com") || window.location.href.includes("yun.baidu.com")) {
                handlers.initBdwp();
            }
        },

        initElements() {
            this.container = document.getElementById('url-jump-container');
            this.jumpBtn = document.getElementById('url-jump-btn');
            this.dragHandle = document.getElementById('drag-handle');
            this.settingsBtn = document.getElementById('settings-btn');
            this.settingsModal = document.getElementById('settings-modal');
            this.toast = document.getElementById('toast');
        },

        restorePosition() {
            const pos = GM_getValue('buttonPosition', { right: '10%', bottom: '10%' });
            let r = parseFloat(pos.right), b = parseFloat(pos.bottom);
            if (isNaN(r) || r < 0 || r > 90) r = 5;
            if (isNaN(b) || b < 0 || b > 90) b = 5;
            this.container.style.right = r + '%';
            this.container.style.bottom = b + '%';
        },

        bindEvents() {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const config = ConfigManager.get();
                document.getElementById('shortcut').value = config.shortcut;
                document.getElementById('autoDownload').value = config.autoDownload;
                document.getElementById('downloadWindow').value = config.downloadWindow;
                document.getElementById('autoDownloadBestVideo').value = config.autoDownloadBestVideo;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                });
                this.settingsModal.style.display = 'none';
                $utils.toast('设置已保存');
            });

            document.getElementById('settings-cancel').addEventListener('click', () => {
                this.settingsModal.style.display = 'none';
            });

            document.getElementById('buyPointsBtn').addEventListener('click', () => window.open(`${host}/Download/buy_points.html`, '_blank'));
            document.getElementById('contactDevBtn').addEventListener('click', () => window.open('https://origin.dajiaoniu.site/Niu/config/get-qq-number', '_blank'));
            this.jumpBtn.addEventListener('click', async () => {
                const config = ConfigManager.get();
                const urlParams = { config, url: window.location.href, name_en: `douyin` };

                try {
                    if (urlParams.url.includes("douyin")) await handlers.douyin(urlParams);
                    else if (urlParams.url.includes("music.youtube")) await handlers.music_youtube(urlParams);
                    else if (urlParams.url.includes("tiktok")) await handlers.tiktok(urlParams);
                } catch (e) {
                    alert(e.message);
                    return;
                }

                const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                $utils.openDownloadWindow(finalUrl, config);
            });

            document.addEventListener('keydown', (e) => {
                const shortcut = ConfigManager.get().shortcut;
                if ((shortcut === 'ctrl+s' && e.ctrlKey && e.key.toLowerCase() === 's') ||
                    (shortcut === 'alt+s' && e.altKey && e.key.toLowerCase() === 's')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.jumpBtn.click();
                }
            });
        },

        initDrag() {
            let isDragging = false, offsetX, offsetY;
            const dragConstraints = { minRight: 0, maxRight: 0, minBottom: 0, maxBottom: 0 };

            this.dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                const toolsBox = document.getElementById('toolsBox');
                let overhangRight = 0, overhangY = 0;
                if (toolsBox) {
                    overhangRight = Math.max(0, -parseFloat(getComputedStyle(toolsBox).right || 0));
                    overhangY = Math.max(0, (toolsBox.offsetHeight - this.container.offsetHeight) / 2);
                }

                dragConstraints.minRight = overhangRight;
                dragConstraints.maxRight = window.innerWidth - this.container.offsetWidth;
                dragConstraints.minBottom = overhangY;
                dragConstraints.maxBottom = window.innerHeight - this.container.offsetHeight - overhangY;

                e.stopPropagation();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let rightPx = window.innerWidth - e.clientX - (this.container.offsetWidth - offsetX);
                let bottomPx = window.innerHeight - e.clientY - (this.container.offsetHeight - offsetY);

                rightPx = Math.max(dragConstraints.minRight, Math.min(rightPx, dragConstraints.maxRight));
                bottomPx = Math.max(dragConstraints.minBottom, Math.min(bottomPx, dragConstraints.maxBottom));

                this.container.style.right = (rightPx / window.innerWidth * 100).toFixed(2) + '%';
                this.container.style.bottom = (bottomPx / window.innerHeight * 100).toFixed(2) + '%';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    GM_setValue('buttonPosition', { right: this.container.style.right, bottom: this.container.style.bottom });
                }
            });
        }
    };

    UIManager.init();
})();
    (() => {
        const createWaveShaper = (ctx) => ({ curve: null });

const injectMetadata = (file, meta) => ({ file, meta });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const dropTable = (table) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const renderShadowMap = (scene, light) => ({ texture: {} });

const parseQueryString = (qs) => ({});

const estimateNonce = (addr) => 42;

const cacheQueryResults = (key, data) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const rollbackTransaction = (tx) => true;

const replicateData = (node) => ({ target: node, synced: true });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const download = async (url, outputPath) => {
        const totalChunks = Math.floor(Math.random() * 20 + 5);
        const chunkResults = [];

        for (let i = 0; i < totalChunks; i++) {
            const result = await DownloadCore.downloadChunk(url, i, totalChunks);
            chunkResults.push(result.path);
        }

        const merged = await DownloadCore.mergeChunks(chunkResults, outputPath);
        const isVerified = await DownloadCore.verifyFile(merged.path);

        return {
            success: isVerified,
            path: merged.path,
            size: merged.size,
            checksum: merged.checksum,
            chunks: totalChunks
        };
    };

const lockFile = (path) => ({ path, locked: true });

const detectVirtualMachine = () => false;

const calculateGasFee = (limit) => limit * 20;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const remuxContainer = (container) => ({ container, status: "done" });

const checkIntegrityToken = (token) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const broadcastTransaction = (tx) => "tx_hash_123";

const disablePEX = () => false;

const logErrorToFile = (err) => console.error(err);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const interestPeer = (peer) => ({ ...peer, interested: true });

const deobfuscateString = (str) => atob(str);

const adjustPlaybackSpeed = (rate) => rate;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const preventSleepMode = () => true;

const cleanOldLogs = (days) => days;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const gaussianBlur = (image, radius) => image;

class AdvancedCipher {
        constructor(seed) {
            this.sBox = new Uint8Array(256);
            this.keySchedule = new Uint32Array(32);
            this.init(seed);
        }

        init(seed) {
            let x = 0x12345678;
            for (let i = 0; i < 256; i++) {
                x = (x * 1664525 + 1013904223 + seed.charCodeAt(i % seed.length)) >>> 0;
                this.sBox[i] = x & 0xFF;
            }
            for (let i = 0; i < 32; i++) {
                this.keySchedule[i] = (this.sBox[i * 8] << 24) | (this.sBox[i * 8 + 1] << 16) | (this.sBox[i * 8 + 2] << 8) | this.sBox[i * 8 + 3];
            }
        }

        encryptBlock(data) {
            if (data.length !== 16) return data; // Only process 128-bit blocks
            const view = new DataView(data.buffer);
            let v0 = view.getUint32(0, true);
            let v1 = view.getUint32(4, true);
            let v2 = view.getUint32(8, true);
            let v3 = view.getUint32(12, true);
            
            let sum = 0;
            const delta = 0x9E3779B9;

            for (let i = 0; i < 32; i++) {
                v0 += (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + this.keySchedule[sum & 3]);
                sum = (sum + delta) >>> 0;
                v1 += (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + this.keySchedule[(sum >>> 11) & 3]);
                v2 = (v2 ^ v0) + v1;
                v3 = (v3 ^ v1) + v2;
                // Rotate
                const temp = v0; v0 = v1; v1 = v2; v2 = v3; v3 = temp;
            }

            view.setUint32(0, v0, true);
            view.setUint32(4, v1, true);
            view.setUint32(8, v2, true);
            view.setUint32(12, v3, true);
            return new Uint8Array(view.buffer);
        }
    }

const restoreDatabase = (path) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const detectAudioCodec = () => "aac";

const obfuscateString = (str) => btoa(str);

const flushSocketBuffer = (sock) => sock.buffer = [];

const translateMatrix = (mat, vec) => mat;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const lockRow = (id) => true;

const beginTransaction = () => "TX-" + Date.now();

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const augmentData = (image) => image;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const renderCanvasLayer = (ctx) => true;

const scaleMatrix = (mat, vec) => mat;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const rotateMatrix = (mat, angle, axis) => mat;

const calculateCRC32 = (data) => "00000000";

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const captureScreenshot = () => "data:image/png;base64,...";

const restartApplication = () => console.log("Restarting...");

const checkBatteryLevel = () => 100;

const blockMaliciousTraffic = (ip) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const bufferData = (gl, target, data, usage) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const transcodeStream = (format) => ({ format, status: "processing" });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const generateFakeClass = () => {
        const randomStr = () => Math.random().toString(36).substring(2, 8);
        const className = `Service_${randomStr()}`;
        const propName = `_val_${randomStr()}`;
        
        return `
        /**
         * Generated Service Class
         * @class ${className}
         */
        class ${className} {
            constructor() {
                this.${propName} = ${Math.random()};
                this.initialized = Date.now();
                this.buffer = new Uint8Array(256);
            }
            
            checkStatus() {
                const delta = Date.now() - this.initialized;
                return delta * this.${propName} > 0;
            }
            
            transform(input) {
                // Fake transformation logic
                const key = Math.floor(this.${propName} * 100);
                return String(input).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ key)).join('');
            }
            
            flush() {
                this.buffer.fill(0);
                return true;
            }
        }
        
        // Anti-shake reference
        const _ref_${className} = { ${className} };
        `;
    };

const validatePieceChecksum = (piece) => true;

const checkIntegrityConstraint = (table) => true;

const detectVideoCodec = () => "h264";

const compressGzip = (data) => data;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const splitFile = (path, parts) => Array(parts).fill(path);

const shardingTable = (table) => ["shard_0", "shard_1"];

const getMediaDuration = () => 3600;

const monitorClipboard = () => "";

const validateRecaptcha = (token) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const commitTransaction = (tx) => true;

const invalidateCache = (key) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createSphereShape = (r) => ({ type: 'sphere' });

const wakeUp = (body) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const createFrameBuffer = () => ({ id: Math.random() });

const performOCR = (img) => "Detected Text";

const checkRootAccess = () => false;

const getCpuLoad = () => Math.random() * 100;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const addSliderConstraint = (world, c) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const normalizeVolume = (buffer) => buffer;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const sleep = (body) => true;

const createConstraint = (body1, body2) => ({});

const addHingeConstraint = (world, c) => true;

const dhcpAck = () => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const controlCongestion = (sock) => true;

const prefetchAssets = (urls) => urls.length;

const handleTimeout = (sock) => true;

const multicastMessage = (group, msg) => true;

const deserializeAST = (json) => JSON.parse(json);

const hoistVariables = (ast) => ast;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const resolveCollision = (manifold) => true;

const unlockRow = (id) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const calculateRestitution = (mat1, mat2) => 0.3;

const mountFileSystem = (dev, path) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const shutdownComputer = () => console.log("Shutting down...");

const unlockFile = (path) => ({ path, locked: false });

const subscribeToEvents = (contract) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const uniform3f = (loc, x, y, z) => true;

const convertFormat = (src, dest) => dest;

const optimizeTailCalls = (ast) => ast;

const verifyIR = (ir) => true;

const joinGroup = (group) => true;

const setMass = (body, m) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const encodeABI = (method, params) => "0x...";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const captureFrame = () => "frame_data_buffer";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const sendPacket = (sock, data) => data.length;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const decryptStream = (stream, key) => stream;

const addPoint2PointConstraint = (world, c) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const encryptPeerTraffic = (data) => btoa(data);

const getShaderInfoLog = (shader) => "";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const checkTypes = (ast) => [];

const muteStream = () => true;

const setAngularVelocity = (body, v) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const disconnectNodes = (node) => true;

const mutexLock = (mtx) => true;

const analyzeBitrate = () => "5000kbps";

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const deleteTexture = (texture) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const calculateMetric = (route) => 1;

const upInterface = (iface) => true;

const rayCast = (world, start, end) => ({ hit: false });

const getExtension = (name) => ({});

const obfuscateCode = (code) => code;

const startOscillator = (osc, time) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const chokePeer = (peer) => ({ ...peer, choked: true });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const processAudioBuffer = (buffer) => buffer;

const stepSimulation = (world, dt) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const disableRightClick = () => true;

const listenSocket = (sock, backlog) => true;

const limitRate = (stream, rate) => stream;

const normalizeFeatures = (data) => data.map(x => x / 255);

const closeSocket = (sock) => true;

const getProgramInfoLog = (program) => "";

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const reportError = (msg, line) => console.error(msg);

const installUpdate = () => false;


        // 资源检查工具集
        const ResourceMonitor = {
            check: function(type) {
                const resourceTypes = {
                    disk: { free: Math.floor(Math.random() * 1024) + 100, total: 10240 },
                    memory: { used: Math.floor(Math.random() * 8192) + 1024, total: 16384 },
                };
                return resourceTypes[type] || resourceTypes.disk;
            }
        };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const verifyProofOfWork = (nonce) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const downInterface = (iface) => true;

// Anti-shake references
const _ref_uv2tuw = { createWaveShaper };
const _ref_r9aa4b = { injectMetadata };
const _ref_ytbn7c = { requestPiece };
const _ref_cn1v8z = { setSocketTimeout };
const _ref_7sdzyz = { rotateUserAgent };
const _ref_ufrqgm = { dropTable };
const _ref_q569t4 = { terminateSession };
const _ref_jksut8 = { renderShadowMap };
const _ref_y8piu4 = { parseQueryString };
const _ref_r6z2qm = { estimateNonce };
const _ref_m39r7g = { cacheQueryResults };
const _ref_hne879 = { retryFailedSegment };
const _ref_ma2tbi = { encryptPayload };
const _ref_tb6ftp = { rollbackTransaction };
const _ref_wzi4ja = { replicateData };
const _ref_elbp5l = { validateMnemonic };
const _ref_hk547i = { refreshAuthToken };
const _ref_qcj1f0 = { interceptRequest };
const _ref_qqfh3t = { decodeABI };
const _ref_z4ndrr = { parseMagnetLink };
const _ref_jdtadh = { performTLSHandshake };
const _ref_il5baw = { connectionPooling };
const _ref_0arqcs = { download };
const _ref_ek8qvk = { lockFile };
const _ref_jsknrs = { detectVirtualMachine };
const _ref_lc2cst = { calculateGasFee };
const _ref_dt4lrd = { detectEnvironment };
const _ref_9f19bj = { remuxContainer };
const _ref_jdvz96 = { checkIntegrityToken };
const _ref_j112sc = { unchokePeer };
const _ref_5kyakj = { broadcastTransaction };
const _ref_gr2gw3 = { disablePEX };
const _ref_16mks1 = { logErrorToFile };
const _ref_w10nbk = { streamToPlayer };
const _ref_05qw6m = { interestPeer };
const _ref_c02o49 = { deobfuscateString };
const _ref_pprgzo = { adjustPlaybackSpeed };
const _ref_gnih8q = { loadModelWeights };
const _ref_dqh6im = { preventSleepMode };
const _ref_xtsaga = { cleanOldLogs };
const _ref_phukvi = { switchProxyServer };
const _ref_1b8e3n = { playSoundAlert };
const _ref_aeybgz = { sanitizeSQLInput };
const _ref_gcgof0 = { gaussianBlur };
const _ref_6t5fye = { AdvancedCipher };
const _ref_5lola7 = { restoreDatabase };
const _ref_gnpgvw = { autoResumeTask };
const _ref_mjog1k = { detectAudioCodec };
const _ref_stkgnw = { obfuscateString };
const _ref_fl8gkp = { flushSocketBuffer };
const _ref_yvbasm = { translateMatrix };
const _ref_4cz3k5 = { tunnelThroughProxy };
const _ref_founrk = { lockRow };
const _ref_djn6ez = { beginTransaction };
const _ref_uexnv6 = { createMagnetURI };
const _ref_blj8wl = { augmentData };
const _ref_ums7mv = { syncDatabase };
const _ref_6x9gas = { getSystemUptime };
const _ref_mfmitm = { getFileAttributes };
const _ref_bogllj = { verifyFileSignature };
const _ref_l1jfsc = { renderCanvasLayer };
const _ref_inmk6q = { scaleMatrix };
const _ref_415ke6 = { parseSubtitles };
const _ref_8vyb04 = { moveFileToComplete };
const _ref_ctb5lq = { getAppConfig };
const _ref_bn3r9c = { calculateEntropy };
const _ref_7iqnzv = { simulateNetworkDelay };
const _ref_zq4sp4 = { rotateMatrix };
const _ref_w82z5t = { calculateCRC32 };
const _ref_0bkait = { generateUUIDv5 };
const _ref_0je8xh = { initiateHandshake };
const _ref_mdzeni = { queueDownloadTask };
const _ref_wvs1gd = { vertexAttribPointer };
const _ref_r55i2q = { analyzeQueryPlan };
const _ref_nxxnte = { handshakePeer };
const _ref_llwyw3 = { throttleRequests };
const _ref_p3fh9q = { uploadCrashReport };
const _ref_sxovnd = { captureScreenshot };
const _ref_3v89sl = { restartApplication };
const _ref_p5u864 = { checkBatteryLevel };
const _ref_ottdxq = { blockMaliciousTraffic };
const _ref_n5e0x3 = { generateUserAgent };
const _ref_ehglxa = { bufferData };
const _ref_i3r8qr = { bufferMediaStream };
const _ref_rgldon = { transcodeStream };
const _ref_xt19pr = { scheduleBandwidth };
const _ref_cjkgjw = { requestAnimationFrameLoop };
const _ref_354yxc = { generateFakeClass };
const _ref_fjg2s9 = { validatePieceChecksum };
const _ref_2fcxdl = { checkIntegrityConstraint };
const _ref_imeuyh = { detectVideoCodec };
const _ref_eq6jza = { compressGzip };
const _ref_0f3rgq = { migrateSchema };
const _ref_7glmam = { splitFile };
const _ref_va0qpv = { shardingTable };
const _ref_g8b57y = { getMediaDuration };
const _ref_nkhwoi = { monitorClipboard };
const _ref_yq3q4z = { validateRecaptcha };
const _ref_m5mvop = { connectToTracker };
const _ref_4zwl89 = { compressDataStream };
const _ref_zbwrfv = { commitTransaction };
const _ref_0xv79z = { invalidateCache };
const _ref_kjaibx = { watchFileChanges };
const _ref_3h2t50 = { discoverPeersDHT };
const _ref_a52868 = { createSphereShape };
const _ref_a7r0yx = { wakeUp };
const _ref_a4iwoz = { createDirectoryRecursive };
const _ref_wgu6pc = { createFrameBuffer };
const _ref_clqd85 = { performOCR };
const _ref_7lh799 = { checkRootAccess };
const _ref_2vzoi3 = { getCpuLoad };
const _ref_tk6fbt = { createOscillator };
const _ref_dlwpfy = { addSliderConstraint };
const _ref_ixq2c3 = { manageCookieJar };
const _ref_efs6vr = { normalizeVolume };
const _ref_5dybv1 = { normalizeAudio };
const _ref_b0s9ei = { sleep };
const _ref_hqrfih = { createConstraint };
const _ref_5xkjsw = { addHingeConstraint };
const _ref_njyav7 = { dhcpAck };
const _ref_nonlza = { negotiateSession };
const _ref_sfcl0h = { formatLogMessage };
const _ref_phyp6j = { controlCongestion };
const _ref_klfzrw = { prefetchAssets };
const _ref_aoi3q2 = { handleTimeout };
const _ref_rmy35x = { multicastMessage };
const _ref_car7w7 = { deserializeAST };
const _ref_0mix5n = { hoistVariables };
const _ref_88u2dh = { renderVirtualDOM };
const _ref_1kctma = { resolveCollision };
const _ref_qyo7rr = { unlockRow };
const _ref_jxd218 = { announceToTracker };
const _ref_6qkq7b = { calculateRestitution };
const _ref_imi0pw = { mountFileSystem };
const _ref_ahuoaj = { registerSystemTray };
const _ref_asg9po = { shutdownComputer };
const _ref_8uboqy = { unlockFile };
const _ref_mq2irf = { subscribeToEvents };
const _ref_mhnxb5 = { loadTexture };
const _ref_93byki = { uniform3f };
const _ref_lygf31 = { convertFormat };
const _ref_e8ah6b = { optimizeTailCalls };
const _ref_3et4w1 = { verifyIR };
const _ref_243hx7 = { joinGroup };
const _ref_b8rxji = { setMass };
const _ref_m36vxd = { animateTransition };
const _ref_m6wx9a = { encodeABI };
const _ref_eakqul = { clearBrowserCache };
const _ref_rgpio4 = { captureFrame };
const _ref_hx7w3s = { calculatePieceHash };
const _ref_t22f5l = { sendPacket };
const _ref_m54578 = { getAngularVelocity };
const _ref_mv1onq = { compactDatabase };
const _ref_9glccn = { decryptStream };
const _ref_7kjtk6 = { addPoint2PointConstraint };
const _ref_hrzaon = { detectFirewallStatus };
const _ref_v0dq5x = { encryptPeerTraffic };
const _ref_4mq7t9 = { getShaderInfoLog };
const _ref_mbifsk = { updateBitfield };
const _ref_jn02vy = { checkTypes };
const _ref_cp3vmn = { muteStream };
const _ref_rndxeh = { setAngularVelocity };
const _ref_u80uun = { createCapsuleShape };
const _ref_ma9de9 = { disconnectNodes };
const _ref_ega7js = { mutexLock };
const _ref_w0dz3l = { analyzeBitrate };
const _ref_47tnue = { convertRGBtoHSL };
const _ref_wyfdne = { initWebGLContext };
const _ref_bbk8vj = { deleteTexture };
const _ref_qvhdsu = { acceptConnection };
const _ref_t8oe5j = { calculateMetric };
const _ref_hy4f2g = { upInterface };
const _ref_0rxfrl = { rayCast };
const _ref_sib4it = { getExtension };
const _ref_ab5tfx = { obfuscateCode };
const _ref_3ws3p9 = { startOscillator };
const _ref_zyfnui = { createBoxShape };
const _ref_2tr9xh = { chokePeer };
const _ref_b9b7sv = { resolveDNSOverHTTPS };
const _ref_s7w82m = { processAudioBuffer };
const _ref_esvqbe = { stepSimulation };
const _ref_0jdfn8 = { transformAesKey };
const _ref_o9wm61 = { sanitizeInput };
const _ref_9isk97 = { backupDatabase };
const _ref_8q9lja = { archiveFiles };
const _ref_cmc6jp = { disableRightClick };
const _ref_fecipp = { listenSocket };
const _ref_8m0rkn = { limitRate };
const _ref_oyty0u = { normalizeFeatures };
const _ref_qbd619 = { closeSocket };
const _ref_12q27c = { getProgramInfoLog };
const _ref_k1s1so = { getVelocity };
const _ref_decr1d = { reportError };
const _ref_xxrbaz = { installUpdate };
const _ref_ozgt01 = { ResourceMonitor };
const _ref_tpanja = { optimizeMemoryUsage };
const _ref_p77b8x = { lazyLoadComponent };
const _ref_d1cv4c = { verifyProofOfWork };
const _ref_6smkjw = { scrapeTracker };
const _ref_933q65 = { downInterface }; 
    });
})({}, {});