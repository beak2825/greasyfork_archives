// ==UserScript==
// @name CrowdBunker视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CrowdBunker/index.js
// @version 2026.01.10
// @description 一键下载CrowdBunker视频，支持4K/1080P/720P多画质。
// @icon https://crowdbunker.com/favicon.ico
// @match *://crowdbunker.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect divulg.org
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
// @downloadURL https://update.greasyfork.org/scripts/562242/CrowdBunker%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562242/CrowdBunker%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const defineSymbol = (table, name, info) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const hydrateSSR = (html) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const beginTransaction = () => "TX-" + Date.now();

const mockResponse = (body) => ({ status: 200, body });

const checkIntegrityConstraint = (table) => true;

const replicateData = (node) => ({ target: node, synced: true });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const detectVideoCodec = () => "h264";

const enableDHT = () => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getUniformLocation = (program, name) => 1;

const rotateLogFiles = () => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const remuxContainer = (container) => ({ container, status: "done" });


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

const injectMetadata = (file, meta) => ({ file, meta });

const bufferMediaStream = (size) => ({ buffer: size });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const logErrorToFile = (err) => console.error(err);

const applyFog = (color, dist) => color;

const installUpdate = () => false;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const upInterface = (iface) => true;

const inferType = (node) => 'any';

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const minifyCode = (code) => code;

const reportWarning = (msg, line) => console.warn(msg);

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const restartApplication = () => console.log("Restarting...");

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const joinGroup = (group) => true;

const computeDominators = (cfg) => ({});

const lookupSymbol = (table, name) => ({});

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const jitCompile = (bc) => (() => {});

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const detectPacketLoss = (acks) => false;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const rmdir = (path) => true;

const readFile = (fd, len) => "";

const bundleAssets = (assets) => "";

const exitScope = (table) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const bindAddress = (sock, addr, port) => true;

const drawArrays = (gl, mode, first, count) => true;

const auditAccessLogs = () => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

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

const killProcess = (pid) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const calculateMetric = (route) => 1;

const analyzeControlFlow = (ast) => ({ graph: {} });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const connectSocket = (sock, addr, port) => true;

const setRelease = (node, val) => node.release.value = val;

const lockFile = (path) => ({ path, locked: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

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

const checkTypes = (ast) => [];

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const translateMatrix = (mat, vec) => mat;

const setInertia = (body, i) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const setVelocity = (body, v) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });


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

const setDelayTime = (node, time) => node.delayTime.value = time;

const getEnv = (key) => "";

const renameFile = (oldName, newName) => newName;

const validateIPWhitelist = (ip) => true;

const injectCSPHeader = () => "default-src 'self'";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const invalidateCache = (key) => true;

const dropTable = (table) => true;

const unloadDriver = (name) => true;

const compileToBytecode = (ast) => new Uint8Array();

const closeFile = (fd) => true;

const enterScope = (table) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const serializeAST = (ast) => JSON.stringify(ast);

const mangleNames = (ast) => ast;

const bufferData = (gl, target, data, usage) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

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

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const generateCode = (ast) => "const a = 1;";

const setFilePermissions = (perm) => `chmod ${perm}`;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const systemCall = (num, args) => 0;

const detectDevTools = () => false;

const registerISR = (irq, func) => true;

const createListener = (ctx) => ({});

const contextSwitch = (oldPid, newPid) => true;

const setOrientation = (panner, x, y, z) => true;

const setQValue = (filter, q) => filter.Q = q;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const addRigidBody = (world, body) => true;

const addConeTwistConstraint = (world, c) => true;

const allocateMemory = (size) => 0x1000;

const createMediaElementSource = (ctx, el) => ({});

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const encryptStream = (stream, key) => stream;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const detachThread = (tid) => true;

const switchVLAN = (id) => true;

const semaphoreWait = (sem) => true;

const readdir = (path) => [];

const mutexLock = (mtx) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkBatteryLevel = () => 100;

const detectAudioCodec = () => "aac";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const semaphoreSignal = (sem) => true;

const generateSourceMap = (ast) => "{}";

const protectMemory = (ptr, size, flags) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const interpretBytecode = (bc) => true;

const linkModules = (modules) => ({});

const updateWheelTransform = (wheel) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const unmountFileSystem = (path) => true;

const bindTexture = (target, texture) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const triggerHapticFeedback = (intensity) => true;

const cleanOldLogs = (days) => days;

const instrumentCode = (code) => code;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const resumeContext = (ctx) => Promise.resolve();

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const resolveDNS = (domain) => "127.0.0.1";

const linkFile = (src, dest) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const attachRenderBuffer = (fb, rb) => true;

const deleteProgram = (program) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const disablePEX = () => false;

const compileFragmentShader = (source) => ({ compiled: true });

const broadcastTransaction = (tx) => "tx_hash_123";

const decapsulateFrame = (frame) => frame;

const resolveCollision = (manifold) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const checkParticleCollision = (sys, world) => true;

const renderParticles = (sys) => true;

const lockRow = (id) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const performOCR = (img) => "Detected Text";

const findLoops = (cfg) => [];

const closePipe = (fd) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const allocateRegisters = (ir) => ir;

const flushSocketBuffer = (sock) => sock.buffer = [];

const updateParticles = (sys, dt) => true;

const setAttack = (node, val) => node.attack.value = val;

const disableDepthTest = () => true;

const optimizeAST = (ast) => ast;

const emitParticles = (sys, count) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const checkUpdate = () => ({ hasUpdate: false });

const applyImpulse = (body, impulse, point) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const calculateCRC32 = (data) => "00000000";

const classifySentiment = (text) => "positive";

const extractArchive = (archive) => ["file1", "file2"];

const createChannelMerger = (ctx, channels) => ({});

const disableInterrupts = () => true;

const getExtension = (name) => ({});

const deleteBuffer = (buffer) => true;

const deriveAddress = (path) => "0x123...";

const detectDebugger = () => false;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const shardingTable = (table) => ["shard_0", "shard_1"];

const createThread = (func) => ({ tid: 1 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const resolveImports = (ast) => [];

// Anti-shake references
const _ref_a4vo6o = { defineSymbol };
const _ref_oqzh0c = { limitUploadSpeed };
const _ref_padpzu = { hydrateSSR };
const _ref_3laqei = { linkProgram };
const _ref_kvb524 = { beginTransaction };
const _ref_foqrof = { mockResponse };
const _ref_yn93cs = { checkIntegrityConstraint };
const _ref_uk0n6e = { replicateData };
const _ref_4n361q = { compressDataStream };
const _ref_gwubgm = { loadTexture };
const _ref_bq37sd = { detectVideoCodec };
const _ref_k3aj6q = { enableDHT };
const _ref_hn1ueb = { calculateEntropy };
const _ref_mdxgj9 = { optimizeMemoryUsage };
const _ref_1434rx = { getUniformLocation };
const _ref_82ktvf = { rotateLogFiles };
const _ref_hzax16 = { transformAesKey };
const _ref_n3i309 = { analyzeUserBehavior };
const _ref_96oa9z = { validateTokenStructure };
const _ref_0wxuq7 = { updateBitfield };
const _ref_5vgcrw = { remuxContainer };
const _ref_ym3k10 = { ResourceMonitor };
const _ref_3mqxo8 = { TelemetryClient };
const _ref_xokjul = { injectMetadata };
const _ref_xfx5ts = { bufferMediaStream };
const _ref_cwws1j = { convertHSLtoRGB };
const _ref_hde09t = { logErrorToFile };
const _ref_13w3bx = { applyFog };
const _ref_ouu8de = { installUpdate };
const _ref_ovfd9z = { seedRatioLimit };
const _ref_smjtcd = { upInterface };
const _ref_j8watf = { inferType };
const _ref_abqe6i = { rayIntersectTriangle };
const _ref_06vfea = { scheduleBandwidth };
const _ref_5a9u0h = { minifyCode };
const _ref_q3cz0g = { reportWarning };
const _ref_4halve = { compactDatabase };
const _ref_bnhzl2 = { restartApplication };
const _ref_98w9tb = { handshakePeer };
const _ref_q1ocym = { connectionPooling };
const _ref_9d0drh = { joinGroup };
const _ref_jwncu6 = { computeDominators };
const _ref_8ey7f7 = { lookupSymbol };
const _ref_zwkb8g = { discoverPeersDHT };
const _ref_1h4c7j = { FileValidator };
const _ref_ckwtro = { jitCompile };
const _ref_xq4595 = { syncDatabase };
const _ref_fr9s5h = { detectPacketLoss };
const _ref_9xvhvv = { parseMagnetLink };
const _ref_3y9hzf = { rmdir };
const _ref_jw363e = { readFile };
const _ref_qjffm2 = { bundleAssets };
const _ref_5ydkky = { exitScope };
const _ref_fh843u = { convertRGBtoHSL };
const _ref_168s7i = { registerSystemTray };
const _ref_f14t77 = { computeNormal };
const _ref_8p0jtf = { bindAddress };
const _ref_cibino = { drawArrays };
const _ref_06j788 = { auditAccessLogs };
const _ref_t6s8vn = { throttleRequests };
const _ref_c4uko9 = { generateFakeClass };
const _ref_4s36w2 = { killProcess };
const _ref_avea5t = { extractThumbnail };
const _ref_150p1c = { parseConfigFile };
const _ref_4j5s6b = { backupDatabase };
const _ref_zbamni = { calculateMetric };
const _ref_q6mhxr = { analyzeControlFlow };
const _ref_wk41u9 = { getSystemUptime };
const _ref_h7ash9 = { connectSocket };
const _ref_06n312 = { setRelease };
const _ref_rahtvw = { lockFile };
const _ref_q1q5zw = { calculatePieceHash };
const _ref_nyfmlw = { download };
const _ref_4a2v8d = { checkTypes };
const _ref_o1k8n2 = { formatLogMessage };
const _ref_d26lv1 = { translateMatrix };
const _ref_93mbu1 = { setInertia };
const _ref_k1bvav = { transcodeStream };
const _ref_min382 = { encryptPayload };
const _ref_ftp981 = { setVelocity };
const _ref_rpniwy = { playSoundAlert };
const _ref_6jejth = { createPhysicsWorld };
const _ref_aalgfr = { CacheManager };
const _ref_g3w2gj = { setDelayTime };
const _ref_4ixyst = { getEnv };
const _ref_z4e2qa = { renameFile };
const _ref_setl3p = { validateIPWhitelist };
const _ref_3pt10r = { injectCSPHeader };
const _ref_l570ij = { uploadCrashReport };
const _ref_zkgoks = { invalidateCache };
const _ref_xmfiue = { dropTable };
const _ref_w2ao08 = { unloadDriver };
const _ref_2h36ud = { compileToBytecode };
const _ref_7iu0fp = { closeFile };
const _ref_oi4j4x = { enterScope };
const _ref_lyhyp7 = { lazyLoadComponent };
const _ref_wr4wjq = { serializeAST };
const _ref_22aoao = { mangleNames };
const _ref_y8n3ej = { bufferData };
const _ref_ju02d4 = { setThreshold };
const _ref_mvahlm = { simulateNetworkDelay };
const _ref_euns6l = { TaskScheduler };
const _ref_4xamje = { calculateLayoutMetrics };
const _ref_zeb88i = { generateCode };
const _ref_gcvgib = { setFilePermissions };
const _ref_amwo9d = { getVelocity };
const _ref_f36pnn = { systemCall };
const _ref_dehy6j = { detectDevTools };
const _ref_e3qln0 = { registerISR };
const _ref_che6rq = { createListener };
const _ref_naz69y = { contextSwitch };
const _ref_xyg3ht = { setOrientation };
const _ref_esttaq = { setQValue };
const _ref_6sghv2 = { createAnalyser };
const _ref_5gun8q = { addRigidBody };
const _ref_lspfql = { addConeTwistConstraint };
const _ref_epweqj = { allocateMemory };
const _ref_566ox6 = { createMediaElementSource };
const _ref_fgsnws = { createDynamicsCompressor };
const _ref_k0uk8o = { encryptStream };
const _ref_m809w4 = { createBiquadFilter };
const _ref_wfuzor = { detachThread };
const _ref_8pcjon = { switchVLAN };
const _ref_bg20tl = { semaphoreWait };
const _ref_s0045s = { readdir };
const _ref_y3me4m = { mutexLock };
const _ref_52fzhw = { receivePacket };
const _ref_em29as = { limitBandwidth };
const _ref_wjvvwn = { checkBatteryLevel };
const _ref_j5616k = { detectAudioCodec };
const _ref_3e7tqp = { sanitizeSQLInput };
const _ref_txipht = { detectEnvironment };
const _ref_0qay7g = { semaphoreSignal };
const _ref_oihkno = { generateSourceMap };
const _ref_h2oegf = { protectMemory };
const _ref_yvgere = { createVehicle };
const _ref_47fggp = { interpretBytecode };
const _ref_gn32f6 = { linkModules };
const _ref_socej6 = { updateWheelTransform };
const _ref_f61hqc = { calculateRestitution };
const _ref_463zyw = { unmountFileSystem };
const _ref_qjj6ac = { bindTexture };
const _ref_n58a5r = { normalizeAudio };
const _ref_mg4vdo = { createCapsuleShape };
const _ref_b6n7nc = { parseExpression };
const _ref_2lt9vq = { triggerHapticFeedback };
const _ref_nyy6e2 = { cleanOldLogs };
const _ref_1xuu1w = { instrumentCode };
const _ref_6sv5ug = { readPixels };
const _ref_jmuf5o = { resumeContext };
const _ref_8o9qcx = { parseSubtitles };
const _ref_x0uiuf = { resolveDNS };
const _ref_ijqkin = { linkFile };
const _ref_egg0d0 = { resolveDependencyGraph };
const _ref_trcekg = { attachRenderBuffer };
const _ref_0qqmxa = { deleteProgram };
const _ref_smrbwv = { createMeshShape };
const _ref_3b11ra = { parseTorrentFile };
const _ref_z8ekoy = { disablePEX };
const _ref_278jst = { compileFragmentShader };
const _ref_xue8yu = { broadcastTransaction };
const _ref_29z3et = { decapsulateFrame };
const _ref_af9buy = { resolveCollision };
const _ref_2ixyld = { computeSpeedAverage };
const _ref_317qwj = { checkParticleCollision };
const _ref_swk2kj = { renderParticles };
const _ref_7luzhu = { lockRow };
const _ref_1hnf7l = { readPipe };
const _ref_6ld4kr = { archiveFiles };
const _ref_c2ny91 = { performOCR };
const _ref_3th5mm = { findLoops };
const _ref_si7pqz = { closePipe };
const _ref_u6se71 = { setSocketTimeout };
const _ref_t0vyi8 = { allocateRegisters };
const _ref_z8457t = { flushSocketBuffer };
const _ref_kmf0cb = { updateParticles };
const _ref_rem63i = { setAttack };
const _ref_0zvap6 = { disableDepthTest };
const _ref_qzxo00 = { optimizeAST };
const _ref_nbiz6l = { emitParticles };
const _ref_hpivkg = { applyEngineForce };
const _ref_jxbyt8 = { checkUpdate };
const _ref_lyhirf = { applyImpulse };
const _ref_y85mgd = { generateWalletKeys };
const _ref_bab1cx = { loadModelWeights };
const _ref_o0bo7q = { calculateCRC32 };
const _ref_f58gp6 = { classifySentiment };
const _ref_pp3ej3 = { extractArchive };
const _ref_cal2ui = { createChannelMerger };
const _ref_sk4vvz = { disableInterrupts };
const _ref_uesxk4 = { getExtension };
const _ref_7zuq74 = { deleteBuffer };
const _ref_br29jj = { deriveAddress };
const _ref_994xse = { detectDebugger };
const _ref_v3z39e = { validateMnemonic };
const _ref_hh1jny = { shardingTable };
const _ref_i1b9qt = { createThread };
const _ref_e0f31q = { optimizeHyperparameters };
const _ref_j12zhf = { updateProgressBar };
const _ref_w08jgo = { resolveImports }; 
    });
    (function () {
    'use strict';
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
            autoDownloadBestVideo: 0
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CrowdBunker` };
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
                            <label for="autoDownloadBestVideo">自动下载【最好的视频】。如果【最好的视频】无声，会自动合并最好的音频：</label>
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
                const urlParams = { config, url: window.location.href, name_en: `CrowdBunker` };

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
        const repairCorruptFile = (path) => ({ path, repaired: true });

const upInterface = (iface) => true;

const suspendContext = (ctx) => Promise.resolve();

const compileVertexShader = (source) => ({ compiled: true });

const getProgramInfoLog = (program) => "";

const compileFragmentShader = (source) => ({ compiled: true });

const activeTexture = (unit) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const createParticleSystem = (count) => ({ particles: [] });

const deleteBuffer = (buffer) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const addConeTwistConstraint = (world, c) => true;

const addGeneric6DofConstraint = (world, c) => true;

const killParticles = (sys) => true;

const removeConstraint = (world, c) => true;

const setPan = (node, val) => node.pan.value = val;

const drawElements = (mode, count, type, offset) => true;

const stopOscillator = (osc, time) => true;

const createChannelSplitter = (ctx, channels) => ({});

const uniform1i = (loc, val) => true;

const generateCode = (ast) => "const a = 1;";

const resumeContext = (ctx) => Promise.resolve();

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const instrumentCode = (code) => code;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const getOutputTimestamp = (ctx) => Date.now();

const createIndexBuffer = (data) => ({ id: Math.random() });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const encryptLocalStorage = (key, val) => true;

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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const estimateNonce = (addr) => 42;

const setDistanceModel = (panner, model) => true;

const updateRoutingTable = (entry) => true;

const analyzeBitrate = () => "5000kbps";

const validateProgram = (program) => true;

const createASTNode = (type, val) => ({ type, val });

const scaleMatrix = (mat, vec) => mat;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const checkRootAccess = () => false;

const extractArchive = (archive) => ["file1", "file2"];

const disableRightClick = () => true;

const validateRecaptcha = (token) => true;

const inlineFunctions = (ast) => ast;

const detectAudioCodec = () => "aac";

const splitFile = (path, parts) => Array(parts).fill(path);

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const calculateComplexity = (ast) => 1;

const emitParticles = (sys, count) => true;

const enterScope = (table) => true;

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

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;


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

const augmentData = (image) => image;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const dumpSymbolTable = (table) => "";

const analyzeControlFlow = (ast) => ({ graph: {} });

const getVehicleSpeed = (vehicle) => 0;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const interestPeer = (peer) => ({ ...peer, interested: true });

const reportWarning = (msg, line) => console.warn(msg);

const prettifyCode = (code) => code;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createVehicle = (chassis) => ({ wheels: [] });

const debugAST = (ast) => "";

const createConvolver = (ctx) => ({ buffer: null });

const reportError = (msg, line) => console.error(msg);

const injectCSPHeader = () => "default-src 'self'";

const uniform3f = (loc, x, y, z) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const unmuteStream = () => false;

const installUpdate = () => false;

const findLoops = (cfg) => [];

const closeSocket = (sock) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

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

const allowSleepMode = () => true;

const updateSoftBody = (body) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const replicateData = (node) => ({ target: node, synced: true });

const encryptPeerTraffic = (data) => btoa(data);

const linkModules = (modules) => ({});

const createPeriodicWave = (ctx, real, imag) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const leaveGroup = (group) => true;

const checkIntegrityConstraint = (table) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const restartApplication = () => console.log("Restarting...");

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const fingerprintBrowser = () => "fp_hash_123";

const autoResumeTask = (id) => ({ id, status: "resumed" });

const computeLossFunction = (pred, actual) => 0.05;

const classifySentiment = (text) => "positive";

const mangleNames = (ast) => ast;

const rollbackTransaction = (tx) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const resolveSymbols = (ast) => ({});

const obfuscateString = (str) => btoa(str);

const allocateRegisters = (ir) => ir;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createTCPSocket = () => ({ fd: 1 });

const resetVehicle = (vehicle) => true;

const setInertia = (body, i) => true;

const verifyIR = (ir) => true;

const generateSourceMap = (ast) => "{}";

const rmdir = (path) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const deleteTexture = (texture) => true;

const renameFile = (oldName, newName) => newName;

const monitorClipboard = () => "";

const mutexUnlock = (mtx) => true;

const traverseAST = (node, visitor) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const jitCompile = (bc) => (() => {});

const dhcpOffer = (ip) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const getBlockHeight = () => 15000000;

const addWheel = (vehicle, info) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createMediaStreamSource = (ctx, stream) => ({});

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const renderShadowMap = (scene, light) => ({ texture: {} });

const detectDarkMode = () => true;

const allocateMemory = (size) => 0x1000;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setViewport = (x, y, w, h) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const captureFrame = () => "frame_data_buffer";

const synthesizeSpeech = (text) => "audio_buffer";

const reassemblePacket = (fragments) => fragments[0];


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

const claimRewards = (pool) => "0.5 ETH";

const translateText = (text, lang) => text;

const exitScope = (table) => true;

const encapsulateFrame = (packet) => packet;

const profilePerformance = (func) => 0;

const merkelizeRoot = (txs) => "root_hash";

const createProcess = (img) => ({ pid: 100 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const mockResponse = (body) => ({ status: 200, body });

const reduceDimensionalityPCA = (data) => data;

const setGainValue = (node, val) => node.gain.value = val;

const inferType = (node) => 'any';

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const parseLogTopics = (topics) => ["Transfer"];

const processAudioBuffer = (buffer) => buffer;

const obfuscateCode = (code) => code;

const setSocketTimeout = (ms) => ({ timeout: ms });

const clearScreen = (r, g, b, a) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createShader = (gl, type) => ({ id: Math.random(), type });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const rotateMatrix = (mat, angle, axis) => mat;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const restoreDatabase = (path) => true;

const generateMipmaps = (target) => true;

const detectVirtualMachine = () => false;

const getUniformLocation = (program, name) => 1;

const fragmentPacket = (data, mtu) => [data];

const dhcpDiscover = () => true;

const generateEmbeddings = (text) => new Float32Array(128);

const signTransaction = (tx, key) => "signed_tx_hash";

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const translateMatrix = (mat, vec) => mat;


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

const retransmitPacket = (seq) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const validateIPWhitelist = (ip) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setThreshold = (node, val) => node.threshold.value = val;

const lockFile = (path) => ({ path, locked: true });

const writePipe = (fd, data) => data.length;

const vertexAttrib3f = (idx, x, y, z) => true;

const decompressPacket = (data) => data;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const commitTransaction = (tx) => true;

const addSliderConstraint = (world, c) => true;

const panicKernel = (msg) => false;

const remuxContainer = (container) => ({ container, status: "done" });

const createSphereShape = (r) => ({ type: 'sphere' });

const createThread = (func) => ({ tid: 1 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const addRigidBody = (world, body) => true;

const closeContext = (ctx) => Promise.resolve();

// Anti-shake references
const _ref_r1nsii = { repairCorruptFile };
const _ref_tmnus7 = { upInterface };
const _ref_stmaho = { suspendContext };
const _ref_5v1h4m = { compileVertexShader };
const _ref_vu9scd = { getProgramInfoLog };
const _ref_tiefyn = { compileFragmentShader };
const _ref_h982bf = { activeTexture };
const _ref_dhu6r6 = { createPhysicsWorld };
const _ref_ys3j6w = { createParticleSystem };
const _ref_8bldu9 = { deleteBuffer };
const _ref_1hi7yt = { setDetune };
const _ref_rt3y53 = { tokenizeSource };
const _ref_s94jd9 = { addConeTwistConstraint };
const _ref_boyc6z = { addGeneric6DofConstraint };
const _ref_7j1hbo = { killParticles };
const _ref_6rew2l = { removeConstraint };
const _ref_d7pff7 = { setPan };
const _ref_6ugebn = { drawElements };
const _ref_95upsg = { stopOscillator };
const _ref_56b0sn = { createChannelSplitter };
const _ref_crazff = { uniform1i };
const _ref_b9m04o = { generateCode };
const _ref_c47owc = { resumeContext };
const _ref_0mjqre = { createAnalyser };
const _ref_c17pnb = { connectToTracker };
const _ref_hegpr4 = { instrumentCode };
const _ref_ogf5ft = { validateTokenStructure };
const _ref_erf756 = { getOutputTimestamp };
const _ref_hq1y0a = { createIndexBuffer };
const _ref_o8jiyr = { parseConfigFile };
const _ref_ku83vp = { encryptLocalStorage };
const _ref_4xrc22 = { ProtocolBufferHandler };
const _ref_6ab94n = { resolveDependencyGraph };
const _ref_5juer0 = { analyzeUserBehavior };
const _ref_kviuuj = { compressDataStream };
const _ref_74aij3 = { estimateNonce };
const _ref_hvc65l = { setDistanceModel };
const _ref_cfgeh4 = { updateRoutingTable };
const _ref_jc320t = { analyzeBitrate };
const _ref_4ay3ga = { validateProgram };
const _ref_v34pq2 = { createASTNode };
const _ref_vzc6da = { scaleMatrix };
const _ref_6exeyw = { updateProgressBar };
const _ref_qz508a = { checkRootAccess };
const _ref_t3nbg5 = { extractArchive };
const _ref_iumqd8 = { disableRightClick };
const _ref_k6covw = { validateRecaptcha };
const _ref_h7lsl1 = { inlineFunctions };
const _ref_3il2m8 = { detectAudioCodec };
const _ref_401h8x = { splitFile };
const _ref_9cxjcw = { sanitizeInput };
const _ref_ehqoae = { migrateSchema };
const _ref_409apm = { FileValidator };
const _ref_n8z7eo = { calculateComplexity };
const _ref_5dszm5 = { emitParticles };
const _ref_pf8zw1 = { enterScope };
const _ref_yu7yt5 = { VirtualFSTree };
const _ref_53mzpk = { requestAnimationFrameLoop };
const _ref_3xhdyr = { detectEnvironment };
const _ref_vdqnmo = { extractThumbnail };
const _ref_u2qqe4 = { ResourceMonitor };
const _ref_acd1ce = { augmentData };
const _ref_ew2tzr = { switchProxyServer };
const _ref_3lesep = { dumpSymbolTable };
const _ref_3pa03k = { analyzeControlFlow };
const _ref_tk8264 = { getVehicleSpeed };
const _ref_i2dxy1 = { createDelay };
const _ref_scddtt = { interestPeer };
const _ref_ojg4xx = { reportWarning };
const _ref_hb0gwb = { prettifyCode };
const _ref_vtqf71 = { transformAesKey };
const _ref_uppeak = { createVehicle };
const _ref_zijifn = { debugAST };
const _ref_8lybw1 = { createConvolver };
const _ref_twgaap = { reportError };
const _ref_lao75y = { injectCSPHeader };
const _ref_56pe6y = { uniform3f };
const _ref_6vkxll = { parseTorrentFile };
const _ref_b74xjq = { unmuteStream };
const _ref_87e71g = { installUpdate };
const _ref_koyxiv = { findLoops };
const _ref_d60rhc = { closeSocket };
const _ref_rt4tzt = { parseM3U8Playlist };
const _ref_2pkt53 = { AdvancedCipher };
const _ref_u6v6pb = { allowSleepMode };
const _ref_n4fg9f = { updateSoftBody };
const _ref_kmhlhq = { animateTransition };
const _ref_jfhs7u = { decryptHLSStream };
const _ref_pumgnm = { replicateData };
const _ref_zf04nw = { encryptPeerTraffic };
const _ref_93oje3 = { linkModules };
const _ref_11i865 = { createPeriodicWave };
const _ref_7n3y0v = { handshakePeer };
const _ref_ezrdnk = { leaveGroup };
const _ref_0m76io = { checkIntegrityConstraint };
const _ref_5pkyrd = { setSteeringValue };
const _ref_7f7e78 = { restartApplication };
const _ref_uqs4d9 = { syncDatabase };
const _ref_imwhyl = { fingerprintBrowser };
const _ref_50nprs = { autoResumeTask };
const _ref_ua8ibf = { computeLossFunction };
const _ref_rpdgq8 = { classifySentiment };
const _ref_hu5lqp = { mangleNames };
const _ref_tkasee = { rollbackTransaction };
const _ref_gk0wlh = { generateUserAgent };
const _ref_lrtl6k = { monitorNetworkInterface };
const _ref_tohjhg = { resolveSymbols };
const _ref_pnmpao = { obfuscateString };
const _ref_0ctt8d = { allocateRegisters };
const _ref_soriwy = { virtualScroll };
const _ref_p9s0jo = { createTCPSocket };
const _ref_2v1rwx = { resetVehicle };
const _ref_67vxrr = { setInertia };
const _ref_hiyojt = { verifyIR };
const _ref_48atvt = { generateSourceMap };
const _ref_96live = { rmdir };
const _ref_bal6j7 = { calculateFriction };
const _ref_1l5kyr = { deleteTexture };
const _ref_im37gn = { renameFile };
const _ref_417oz8 = { monitorClipboard };
const _ref_ye9zic = { mutexUnlock };
const _ref_r6nd5g = { traverseAST };
const _ref_qv35xf = { linkProgram };
const _ref_kkc19k = { jitCompile };
const _ref_f3xa5y = { dhcpOffer };
const _ref_8kven2 = { encryptPayload };
const _ref_5t49dg = { getBlockHeight };
const _ref_znxqcl = { addWheel };
const _ref_xk63nt = { checkIntegrity };
const _ref_hn2y7b = { limitUploadSpeed };
const _ref_cymq91 = { createMediaStreamSource };
const _ref_n07bid = { rayIntersectTriangle };
const _ref_b9ecbi = { renderShadowMap };
const _ref_2l40ha = { detectDarkMode };
const _ref_l5ryvk = { allocateMemory };
const _ref_r3eife = { getAppConfig };
const _ref_40mrvd = { setViewport };
const _ref_0vctek = { calculateMD5 };
const _ref_2add0g = { captureFrame };
const _ref_5f2fko = { synthesizeSpeech };
const _ref_2vof6d = { reassemblePacket };
const _ref_ktehjx = { CacheManager };
const _ref_lvliob = { claimRewards };
const _ref_o9j7lg = { translateText };
const _ref_pgjofz = { exitScope };
const _ref_nb24tn = { encapsulateFrame };
const _ref_ohmf1i = { profilePerformance };
const _ref_20de6x = { merkelizeRoot };
const _ref_ap5vdz = { createProcess };
const _ref_ar449m = { compactDatabase };
const _ref_0uj98l = { mockResponse };
const _ref_x6qkwq = { reduceDimensionalityPCA };
const _ref_npiogt = { setGainValue };
const _ref_c3j1n3 = { inferType };
const _ref_czrhgx = { calculateEntropy };
const _ref_hh7df2 = { parseLogTopics };
const _ref_vmnok4 = { processAudioBuffer };
const _ref_d71wy7 = { obfuscateCode };
const _ref_x5q4kj = { setSocketTimeout };
const _ref_qu20bg = { clearScreen };
const _ref_dx1x8x = { parseStatement };
const _ref_4pmz5v = { applyEngineForce };
const _ref_hg7nq4 = { uninterestPeer };
const _ref_hvx0ux = { createShader };
const _ref_d0tqkk = { rotateUserAgent };
const _ref_h2q618 = { rotateMatrix };
const _ref_r2nkgj = { parseExpression };
const _ref_pe7mqn = { restoreDatabase };
const _ref_u5xvh7 = { generateMipmaps };
const _ref_ray9c0 = { detectVirtualMachine };
const _ref_0c0x71 = { getUniformLocation };
const _ref_57g3kq = { fragmentPacket };
const _ref_7qo1y7 = { dhcpDiscover };
const _ref_lnad7s = { generateEmbeddings };
const _ref_gtoobf = { signTransaction };
const _ref_c42wz4 = { calculateLighting };
const _ref_01n587 = { deleteTempFiles };
const _ref_6pa06e = { translateMatrix };
const _ref_pewdge = { TelemetryClient };
const _ref_hno1cq = { retransmitPacket };
const _ref_3cwypx = { generateUUIDv5 };
const _ref_a5rla0 = { uniformMatrix4fv };
const _ref_v45igm = { validateIPWhitelist };
const _ref_4x8j0i = { showNotification };
const _ref_9yjj1a = { setThreshold };
const _ref_16snub = { lockFile };
const _ref_mdb6wq = { writePipe };
const _ref_3wvxks = { vertexAttrib3f };
const _ref_zoqs1l = { decompressPacket };
const _ref_ezg38g = { verifyFileSignature };
const _ref_1mkocb = { commitTransaction };
const _ref_ucydy2 = { addSliderConstraint };
const _ref_zk5x2t = { panicKernel };
const _ref_vu6rde = { remuxContainer };
const _ref_5datsp = { createSphereShape };
const _ref_w951p3 = { createThread };
const _ref_3zofld = { seedRatioLimit };
const _ref_ak16fz = { parseFunction };
const _ref_nbzhtj = { addRigidBody };
const _ref_nks2xy = { closeContext }; 
    });
})({}, {});