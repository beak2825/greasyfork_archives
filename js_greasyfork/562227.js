// ==UserScript==
// @name AmadeusTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AmadeusTV/index.js
// @version 2026.01.21.2
// @description 一键下载AmadeusTV视频，支持4K/1080P/720P多画质。
// @icon http://www.amadeus.tv/images/favicon.png
// @match *://*.amadeus.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect amadeus.tv
// @connect qcloud.com
// @connect myqcloud.com
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
// @downloadURL https://update.greasyfork.org/scripts/562227/AmadeusTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562227/AmadeusTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const decapsulateFrame = (frame) => frame;

const getUniformLocation = (program, name) => 1;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const validatePieceChecksum = (piece) => true;

const scheduleTask = (task) => ({ id: 1, task });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const detectDevTools = () => false;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const signTransaction = (tx, key) => "signed_tx_hash";

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const merkelizeRoot = (txs) => "root_hash";

const rotateLogFiles = () => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const renameFile = (oldName, newName) => newName;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const splitFile = (path, parts) => Array(parts).fill(path);

const cacheQueryResults = (key, data) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const checkIntegrityToken = (token) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const verifySignature = (tx, sig) => true;

const logErrorToFile = (err) => console.error(err);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const rateLimitCheck = (ip) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const detectVirtualMachine = () => false;

const obfuscateString = (str) => btoa(str);

const stakeAssets = (pool, amount) => true;

const deriveAddress = (path) => "0x123...";

const dropTable = (table) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const restartApplication = () => console.log("Restarting...");

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const normalizeVolume = (buffer) => buffer;

const deleteProgram = (program) => true;

const createListener = (ctx) => ({});

const setThreshold = (node, val) => node.threshold.value = val;

const setVolumeLevel = (vol) => vol;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setFilterType = (filter, type) => filter.type = type;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setAttack = (node, val) => node.attack.value = val;

const detectDarkMode = () => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });


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

const createConstraint = (body1, body2) => ({});

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

const addPoint2PointConstraint = (world, c) => true;

const updateTransform = (body) => true;


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

const addSliderConstraint = (world, c) => true;

const getByteFrequencyData = (analyser, array) => true;

const useProgram = (program) => true;

const setRelease = (node, val) => node.release.value = val;

const encryptLocalStorage = (key, val) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const flushSocketBuffer = (sock) => sock.buffer = [];

const broadcastTransaction = (tx) => "tx_hash_123";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const parseLogTopics = (topics) => ["Transfer"];

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const disableDepthTest = () => true;

const closeContext = (ctx) => Promise.resolve();

const createChannelMerger = (ctx, channels) => ({});

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const setInertia = (body, i) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const resampleAudio = (buffer, rate) => buffer;

const checkRootAccess = () => false;

const listenSocket = (sock, backlog) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const readPipe = (fd, len) => new Uint8Array(len);

const addHingeConstraint = (world, c) => true;

const analyzeBitrate = () => "5000kbps";

const unmuteStream = () => false;

const checkTypes = (ast) => [];

const establishHandshake = (sock) => true;

const disableInterrupts = () => true;

const semaphoreSignal = (sem) => true;

const compressPacket = (data) => data;

const detectDebugger = () => false;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const disablePEX = () => false;

const getBlockHeight = () => 15000000;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const debugAST = (ast) => "";

const interpretBytecode = (bc) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createSphereShape = (r) => ({ type: 'sphere' });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const fingerprintBrowser = () => "fp_hash_123";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const analyzeHeader = (packet) => ({});

const postProcessBloom = (image, threshold) => image;

const handleTimeout = (sock) => true;

const cleanOldLogs = (days) => days;

const applyImpulse = (body, impulse, point) => true;

const closeSocket = (sock) => true;

const scheduleProcess = (pid) => true;

const augmentData = (image) => image;

const compileVertexShader = (source) => ({ compiled: true });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const connectNodes = (src, dest) => true;

const addWheel = (vehicle, info) => true;

const processAudioBuffer = (buffer) => buffer;

const exitScope = (table) => true;

const dhcpOffer = (ip) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const joinThread = (tid) => true;

const checkUpdate = () => ({ hasUpdate: false });

const dhcpDiscover = () => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const setKnee = (node, val) => node.knee.value = val;

const anchorSoftBody = (soft, rigid) => true;

const unrollLoops = (ast) => ast;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkBatteryLevel = () => 100;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const applyForce = (body, force, point) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const mockResponse = (body) => ({ status: 200, body });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const compressGzip = (data) => data;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const upInterface = (iface) => true;

const createProcess = (img) => ({ pid: 100 });

const allocateMemory = (size) => 0x1000;

const controlCongestion = (sock) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const dumpSymbolTable = (table) => "";

const visitNode = (node) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createThread = (func) => ({ tid: 1 });

const createSymbolTable = () => ({ scopes: [] });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const checkGLError = () => 0;

const invalidateCache = (key) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const detectVideoCodec = () => "h264";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const compileToBytecode = (ast) => new Uint8Array();

const adjustPlaybackSpeed = (rate) => rate;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const translateMatrix = (mat, vec) => mat;

const extractArchive = (archive) => ["file1", "file2"];

const setVelocity = (body, v) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const defineSymbol = (table, name, info) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const shardingTable = (table) => ["shard_0", "shard_1"];

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const protectMemory = (ptr, size, flags) => true;

const execProcess = (path) => true;

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

const triggerHapticFeedback = (intensity) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const reduceDimensionalityPCA = (data) => data;

const checkIntegrityConstraint = (table) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const rebootSystem = () => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const chmodFile = (path, mode) => true;

const addRigidBody = (world, body) => true;

const resumeContext = (ctx) => Promise.resolve();

const attachRenderBuffer = (fb, rb) => true;

const unmapMemory = (ptr, size) => true;

const detectCollision = (body1, body2) => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const fragmentPacket = (data, mtu) => [data];

const closeFile = (fd) => true;

const readdir = (path) => [];

const negotiateSession = (sock) => ({ id: "sess_1" });

const calculateComplexity = (ast) => 1;

const generateSourceMap = (ast) => "{}";

const checkPortAvailability = (port) => Math.random() > 0.2;

const openFile = (path, flags) => 5;

const checkParticleCollision = (sys, world) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const createChannelSplitter = (ctx, channels) => ({});

const claimRewards = (pool) => "0.5 ETH";

const applyTorque = (body, torque) => true;

// Anti-shake references
const _ref_6mxi2c = { decapsulateFrame };
const _ref_s8acji = { getUniformLocation };
const _ref_o71sp3 = { analyzeUserBehavior };
const _ref_5op3o6 = { validatePieceChecksum };
const _ref_crglzc = { scheduleTask };
const _ref_vvl8dk = { discoverPeersDHT };
const _ref_kfj8s7 = { detectDevTools };
const _ref_g4jcsf = { autoResumeTask };
const _ref_s55f6o = { migrateSchema };
const _ref_s5w4bo = { generateWalletKeys };
const _ref_a87ww7 = { signTransaction };
const _ref_phr5y7 = { sanitizeInput };
const _ref_qgqtwm = { merkelizeRoot };
const _ref_9lybr0 = { rotateLogFiles };
const _ref_tom8nv = { rotateUserAgent };
const _ref_ffdt7s = { renameFile };
const _ref_wsfgja = { checkDiskSpace };
const _ref_wx3tsf = { announceToTracker };
const _ref_gqwgda = { splitFile };
const _ref_5inqqc = { cacheQueryResults };
const _ref_9gb8gi = { handshakePeer };
const _ref_3sz2x2 = { limitUploadSpeed };
const _ref_mkaejf = { checkIntegrityToken };
const _ref_ptsvyy = { repairCorruptFile };
const _ref_mzhgcj = { verifySignature };
const _ref_ts3wvx = { logErrorToFile };
const _ref_jzc0vb = { executeSQLQuery };
const _ref_zgykp1 = { rateLimitCheck };
const _ref_hp4l4b = { checkIntegrity };
const _ref_d663og = { detectVirtualMachine };
const _ref_0bsg26 = { obfuscateString };
const _ref_odhz97 = { stakeAssets };
const _ref_88ckwd = { deriveAddress };
const _ref_voqmcd = { dropTable };
const _ref_fttcnd = { getAppConfig };
const _ref_zg14ao = { calculateLayoutMetrics };
const _ref_6viurc = { transformAesKey };
const _ref_z3hyj8 = { restartApplication };
const _ref_vexfq7 = { optimizeConnectionPool };
const _ref_npvs20 = { normalizeVolume };
const _ref_i2no2s = { deleteProgram };
const _ref_92w2wo = { createListener };
const _ref_9z60id = { setThreshold };
const _ref_xx76nl = { setVolumeLevel };
const _ref_3hi3sd = { makeDistortionCurve };
const _ref_5e9nxh = { setFilterType };
const _ref_ljiv4w = { createIndex };
const _ref_cnkvii = { setAttack };
const _ref_p6kpuv = { detectDarkMode };
const _ref_dauy3q = { uploadCrashReport };
const _ref_d2ulzr = { ResourceMonitor };
const _ref_aahr7v = { createConstraint };
const _ref_fx1q4a = { AdvancedCipher };
const _ref_vwaq2j = { addPoint2PointConstraint };
const _ref_cj1n9j = { updateTransform };
const _ref_otdch3 = { TelemetryClient };
const _ref_3rank1 = { addSliderConstraint };
const _ref_b47xlc = { getByteFrequencyData };
const _ref_npb2au = { useProgram };
const _ref_6x1m04 = { setRelease };
const _ref_hzhq8k = { encryptLocalStorage };
const _ref_qv93ne = { loadImpulseResponse };
const _ref_qya9lc = { virtualScroll };
const _ref_6we4bj = { createPhysicsWorld };
const _ref_rpj5s3 = { flushSocketBuffer };
const _ref_dl5bx1 = { broadcastTransaction };
const _ref_tllv4e = { createDelay };
const _ref_sigyik = { parseLogTopics };
const _ref_awq4bo = { createGainNode };
const _ref_xsxfwu = { disableDepthTest };
const _ref_l0x8uj = { closeContext };
const _ref_478dcr = { createChannelMerger };
const _ref_izixxw = { getFileAttributes };
const _ref_u7q00h = { applyPerspective };
const _ref_gwagdz = { setInertia };
const _ref_3zgpuf = { verifyMagnetLink };
const _ref_puul7q = { resampleAudio };
const _ref_pd2uaq = { checkRootAccess };
const _ref_ocsjda = { listenSocket };
const _ref_0hrwei = { streamToPlayer };
const _ref_hrg3nt = { readPipe };
const _ref_d2jr8n = { addHingeConstraint };
const _ref_s8gzdz = { analyzeBitrate };
const _ref_60j0us = { unmuteStream };
const _ref_g5qw2h = { checkTypes };
const _ref_4h1tgu = { establishHandshake };
const _ref_b3qry0 = { disableInterrupts };
const _ref_ib121z = { semaphoreSignal };
const _ref_nunhrg = { compressPacket };
const _ref_70e0cf = { detectDebugger };
const _ref_i6wkb8 = { readPixels };
const _ref_2ii40m = { debouncedResize };
const _ref_4x2krp = { switchProxyServer };
const _ref_2wyr9f = { createPeriodicWave };
const _ref_0rb3yh = { scheduleBandwidth };
const _ref_awo5g7 = { disablePEX };
const _ref_94ra5s = { getBlockHeight };
const _ref_xshg61 = { simulateNetworkDelay };
const _ref_kxx293 = { debugAST };
const _ref_6yzgc6 = { interpretBytecode };
const _ref_m6o5on = { calculateSHA256 };
const _ref_0dlet3 = { createSphereShape };
const _ref_2wjkq2 = { scrapeTracker };
const _ref_7uvuiz = { fingerprintBrowser };
const _ref_erhv5u = { createScriptProcessor };
const _ref_6xnhly = { analyzeHeader };
const _ref_qnxfj7 = { postProcessBloom };
const _ref_twf6pe = { handleTimeout };
const _ref_zxknyz = { cleanOldLogs };
const _ref_kocgdi = { applyImpulse };
const _ref_frui26 = { closeSocket };
const _ref_5p4ezq = { scheduleProcess };
const _ref_k9nw4k = { augmentData };
const _ref_zunx20 = { compileVertexShader };
const _ref_gksv6l = { normalizeVector };
const _ref_zuunyt = { limitBandwidth };
const _ref_i9ft7e = { connectNodes };
const _ref_1z38eh = { addWheel };
const _ref_bnyd15 = { processAudioBuffer };
const _ref_9j09lw = { exitScope };
const _ref_5u9p78 = { dhcpOffer };
const _ref_yucz99 = { validateMnemonic };
const _ref_f2w9ib = { joinThread };
const _ref_2wsqw5 = { checkUpdate };
const _ref_p58bk8 = { dhcpDiscover };
const _ref_sxtuye = { convexSweepTest };
const _ref_4vll5h = { setKnee };
const _ref_3ccqio = { anchorSoftBody };
const _ref_0927vx = { unrollLoops };
const _ref_wqdb97 = { getAngularVelocity };
const _ref_pvvxtu = { checkBatteryLevel };
const _ref_u8yg9k = { allocateDiskSpace };
const _ref_f70zt3 = { verifyFileSignature };
const _ref_9h2lqy = { applyForce };
const _ref_km4fbw = { queueDownloadTask };
const _ref_6wan46 = { mockResponse };
const _ref_tyboid = { limitDownloadSpeed };
const _ref_9x464s = { compressGzip };
const _ref_a5h5zz = { showNotification };
const _ref_y530l0 = { upInterface };
const _ref_xvwumz = { createProcess };
const _ref_hwbdb9 = { allocateMemory };
const _ref_46mup9 = { controlCongestion };
const _ref_r5ykfu = { parseConfigFile };
const _ref_jdf5pf = { dumpSymbolTable };
const _ref_v73akk = { visitNode };
const _ref_s8tsg4 = { setSteeringValue };
const _ref_223oje = { createThread };
const _ref_rec8d4 = { createSymbolTable };
const _ref_2p6htq = { parseClass };
const _ref_wmaqjp = { checkGLError };
const _ref_o3lee6 = { invalidateCache };
const _ref_ux5cs0 = { unchokePeer };
const _ref_o7ayze = { detectVideoCodec };
const _ref_vj1afk = { detectEnvironment };
const _ref_47lzoe = { getMemoryUsage };
const _ref_wftyoa = { compileToBytecode };
const _ref_rieocn = { adjustPlaybackSpeed };
const _ref_31swqn = { syncDatabase };
const _ref_2ftpby = { translateMatrix };
const _ref_8zmlp9 = { extractArchive };
const _ref_k8iktg = { setVelocity };
const _ref_1mevj3 = { computeSpeedAverage };
const _ref_4dqmoz = { decryptHLSStream };
const _ref_h34m19 = { defineSymbol };
const _ref_r6si9b = { generateEmbeddings };
const _ref_6gcbqk = { generateUUIDv5 };
const _ref_mac6w2 = { refreshAuthToken };
const _ref_eazojl = { shardingTable };
const _ref_6gls67 = { normalizeAudio };
const _ref_dyh2wx = { protectMemory };
const _ref_iyvmxu = { execProcess };
const _ref_vsn9d8 = { download };
const _ref_c9o8g2 = { triggerHapticFeedback };
const _ref_nl73pk = { cancelAnimationFrameLoop };
const _ref_7ey15k = { reduceDimensionalityPCA };
const _ref_npog3d = { checkIntegrityConstraint };
const _ref_o6f15o = { predictTensor };
const _ref_jflo4v = { rebootSystem };
const _ref_13zg9y = { rayIntersectTriangle };
const _ref_fc1cpd = { chmodFile };
const _ref_z11hey = { addRigidBody };
const _ref_9n0pet = { resumeContext };
const _ref_ny47ed = { attachRenderBuffer };
const _ref_zhwzzc = { unmapMemory };
const _ref_d75i5j = { detectCollision };
const _ref_5eyrhq = { chokePeer };
const _ref_uagk39 = { fragmentPacket };
const _ref_srwb1r = { closeFile };
const _ref_t2yabr = { readdir };
const _ref_8pxr4z = { negotiateSession };
const _ref_1zd6im = { calculateComplexity };
const _ref_qxpbcr = { generateSourceMap };
const _ref_y7y9mq = { checkPortAvailability };
const _ref_scc3rb = { openFile };
const _ref_qjllxk = { checkParticleCollision };
const _ref_bzc1bh = { sanitizeSQLInput };
const _ref_bjkj74 = { createChannelSplitter };
const _ref_4ihvr8 = { claimRewards };
const _ref_bytzzp = { applyTorque }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AmadeusTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `AmadeusTV` };

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
        const limitUploadSpeed = (speed) => Math.min(speed, 500);

const loadDriver = (path) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const deobfuscateString = (str) => atob(str);

const getVehicleSpeed = (vehicle) => 0;

const cancelTask = (id) => ({ id, cancelled: true });

const cullFace = (mode) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const triggerHapticFeedback = (intensity) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const eliminateDeadCode = (ast) => ast;

const chokePeer = (peer) => ({ ...peer, choked: true });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const protectMemory = (ptr, size, flags) => true;

const mutexLock = (mtx) => true;

const defineSymbol = (table, name, info) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const enableDHT = () => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const traceroute = (host) => ["192.168.1.1"];


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

const unchokePeer = (peer) => ({ ...peer, choked: false });

const useProgram = (program) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setBrake = (vehicle, force, wheelIdx) => true;

const semaphoreWait = (sem) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const prioritizeRarestPiece = (pieces) => pieces[0];

const multicastMessage = (group, msg) => true;

const deleteProgram = (program) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const convexSweepTest = (shape, start, end) => ({ hit: false });

const restartApplication = () => console.log("Restarting...");

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const updateSoftBody = (body) => true;

const joinThread = (tid) => true;

const classifySentiment = (text) => "positive";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const renderCanvasLayer = (ctx) => true;

const addRigidBody = (world, body) => true;

const startOscillator = (osc, time) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const obfuscateString = (str) => btoa(str);

const broadcastTransaction = (tx) => "tx_hash_123";

const replicateData = (node) => ({ target: node, synced: true });

const commitTransaction = (tx) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const setMass = (body, m) => true;

const compileToBytecode = (ast) => new Uint8Array();

const addConeTwistConstraint = (world, c) => true;

const createThread = (func) => ({ tid: 1 });

const renameFile = (oldName, newName) => newName;

const bindTexture = (target, texture) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const createPipe = () => [3, 4];

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const addPoint2PointConstraint = (world, c) => true;

const verifySignature = (tx, sig) => true;

const hashKeccak256 = (data) => "0xabc...";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const checkIntegrityToken = (token) => true;

const normalizeVolume = (buffer) => buffer;

const filterTraffic = (rule) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const disconnectNodes = (node) => true;

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

const compressPacket = (data) => data;

const detachThread = (tid) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const downInterface = (iface) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const fingerprintBrowser = () => "fp_hash_123";

const allocateMemory = (size) => 0x1000;

const createParticleSystem = (count) => ({ particles: [] });

const verifyAppSignature = () => true;

const merkelizeRoot = (txs) => "root_hash";

const reportWarning = (msg, line) => console.warn(msg);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const calculateCRC32 = (data) => "00000000";

const contextSwitch = (oldPid, newPid) => true;

const compileVertexShader = (source) => ({ compiled: true });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const addWheel = (vehicle, info) => true;

const validateRecaptcha = (token) => true;

const inlineFunctions = (ast) => ast;

const monitorClipboard = () => "";

const getBlockHeight = () => 15000000;

const systemCall = (num, args) => 0;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const detectDevTools = () => false;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const applyImpulse = (body, impulse, point) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const setViewport = (x, y, w, h) => true;

const unrollLoops = (ast) => ast;

const checkRootAccess = () => false;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const normalizeFeatures = (data) => data.map(x => x / 255);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const checkBalance = (addr) => "10.5 ETH";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const disablePEX = () => false;

const resumeContext = (ctx) => Promise.resolve();

const unlockFile = (path) => ({ path, locked: false });

const addSliderConstraint = (world, c) => true;

const lockRow = (id) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setFilterType = (filter, type) => filter.type = type;

const registerISR = (irq, func) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const traverseAST = (node, visitor) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const beginTransaction = () => "TX-" + Date.now();

const preventCSRF = () => "csrf_token";

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculateMetric = (route) => 1;

const resolveDNS = (domain) => "127.0.0.1";

const resolveSymbols = (ast) => ({});

const setGravity = (world, g) => world.gravity = g;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const updateParticles = (sys, dt) => true;

const deriveAddress = (path) => "0x123...";

const checkPortAvailability = (port) => Math.random() > 0.2;

const clearScreen = (r, g, b, a) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const chmodFile = (path, mode) => true;

const disableInterrupts = () => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const renderParticles = (sys) => true;

const rateLimitCheck = (ip) => true;

const linkFile = (src, dest) => true;

const uniform1i = (loc, val) => true;

const analyzeHeader = (packet) => ({});

const estimateNonce = (addr) => 42;

const sanitizeXSS = (html) => html;

const detectDebugger = () => false;

const foldConstants = (ast) => ast;

const stakeAssets = (pool, amount) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const upInterface = (iface) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const resetVehicle = (vehicle) => true;

const detectPacketLoss = (acks) => false;

const hoistVariables = (ast) => ast;

const uniform3f = (loc, x, y, z) => true;

const resolveCollision = (manifold) => true;

const parseLogTopics = (topics) => ["Transfer"];

const readPipe = (fd, len) => new Uint8Array(len);

const closeSocket = (sock) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const stepSimulation = (world, dt) => true;

const freeMemory = (ptr) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createChannelMerger = (ctx, channels) => ({});

const anchorSoftBody = (soft, rigid) => true;

const setOrientation = (panner, x, y, z) => true;

const closePipe = (fd) => true;

const unmountFileSystem = (path) => true;

const negotiateProtocol = () => "HTTP/2.0";

const shutdownComputer = () => console.log("Shutting down...");

const cleanOldLogs = (days) => days;

const setAttack = (node, val) => node.attack.value = val;

const unloadDriver = (name) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getOutputTimestamp = (ctx) => Date.now();

const calculateFriction = (mat1, mat2) => 0.5;

const generateSourceMap = (ast) => "{}";

const recognizeSpeech = (audio) => "Transcribed Text";

const chownFile = (path, uid, gid) => true;

const attachRenderBuffer = (fb, rb) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const setFilePermissions = (perm) => `chmod ${perm}`;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const invalidateCache = (key) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const suspendContext = (ctx) => Promise.resolve();

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const lockFile = (path) => ({ path, locked: true });

const prettifyCode = (code) => code;

const verifyProofOfWork = (nonce) => true;

// Anti-shake references
const _ref_etd9ch = { limitUploadSpeed };
const _ref_pz1sbf = { loadDriver };
const _ref_i8tjyf = { createDynamicsCompressor };
const _ref_6d667a = { deobfuscateString };
const _ref_6ztkm8 = { getVehicleSpeed };
const _ref_smp15x = { cancelTask };
const _ref_jthwmr = { cullFace };
const _ref_dp326p = { diffVirtualDOM };
const _ref_24t8ge = { triggerHapticFeedback };
const _ref_rdxew6 = { setSteeringValue };
const _ref_k6g1bg = { traceStack };
const _ref_godo8l = { eliminateDeadCode };
const _ref_7zcjj2 = { chokePeer };
const _ref_djbs45 = { initiateHandshake };
const _ref_2h5ays = { parseFunction };
const _ref_z3gbxk = { getFileAttributes };
const _ref_bqgkgv = { createGainNode };
const _ref_oivcbj = { protectMemory };
const _ref_qeujc4 = { mutexLock };
const _ref_b6rb6z = { defineSymbol };
const _ref_8tu3y5 = { calculateMD5 };
const _ref_pjrr7j = { enableDHT };
const _ref_w83xun = { syncDatabase };
const _ref_b62pqz = { traceroute };
const _ref_yjxek5 = { CacheManager };
const _ref_9qobzq = { unchokePeer };
const _ref_jst0kq = { useProgram };
const _ref_gsv43h = { simulateNetworkDelay };
const _ref_8tltt3 = { switchProxyServer };
const _ref_hsjd4v = { performTLSHandshake };
const _ref_fngnnz = { createCapsuleShape };
const _ref_co946e = { createScriptProcessor };
const _ref_diz4oy = { calculateSHA256 };
const _ref_6mnxa1 = { setBrake };
const _ref_cbkrlw = { semaphoreWait };
const _ref_811d59 = { getAngularVelocity };
const _ref_54phg8 = { prioritizeRarestPiece };
const _ref_k2ta9s = { multicastMessage };
const _ref_qnjmm1 = { deleteProgram };
const _ref_v375jt = { resolveDependencyGraph };
const _ref_6fi2uq = { convexSweepTest };
const _ref_7mbfqe = { restartApplication };
const _ref_0jdrjt = { parseTorrentFile };
const _ref_q8h9a8 = { generateUUIDv5 };
const _ref_3ntcel = { updateSoftBody };
const _ref_dksn1b = { joinThread };
const _ref_afniqo = { classifySentiment };
const _ref_mmmh9m = { checkDiskSpace };
const _ref_55qmnu = { renderCanvasLayer };
const _ref_2znuhi = { addRigidBody };
const _ref_13euga = { startOscillator };
const _ref_vy14me = { setFrequency };
const _ref_lfj3v5 = { obfuscateString };
const _ref_3qw1uk = { broadcastTransaction };
const _ref_risvqg = { replicateData };
const _ref_t6giwi = { commitTransaction };
const _ref_zqq78i = { scrapeTracker };
const _ref_4h9djz = { setMass };
const _ref_2t4w0s = { compileToBytecode };
const _ref_4ohkx3 = { addConeTwistConstraint };
const _ref_qe8upi = { createThread };
const _ref_zumnml = { renameFile };
const _ref_bkttia = { bindTexture };
const _ref_7o53d4 = { arpRequest };
const _ref_ti4pad = { createPipe };
const _ref_kyl4af = { compactDatabase };
const _ref_jfvpea = { uploadCrashReport };
const _ref_f8nuvw = { addPoint2PointConstraint };
const _ref_iu00xi = { verifySignature };
const _ref_85wgrp = { hashKeccak256 };
const _ref_5wkb88 = { checkIntegrity };
const _ref_6e25qf = { announceToTracker };
const _ref_6i4ya1 = { createMagnetURI };
const _ref_ywxaa0 = { checkIntegrityToken };
const _ref_bp0fwr = { normalizeVolume };
const _ref_nsegmm = { filterTraffic };
const _ref_k03ky2 = { optimizeMemoryUsage };
const _ref_6qmimg = { disconnectNodes };
const _ref_3vf7jk = { generateFakeClass };
const _ref_sz7qhq = { compressPacket };
const _ref_j11xts = { detachThread };
const _ref_lkrfdl = { formatLogMessage };
const _ref_pjazwq = { downInterface };
const _ref_oer2sq = { updateProgressBar };
const _ref_tnl0vj = { fingerprintBrowser };
const _ref_9zhyqf = { allocateMemory };
const _ref_6j5phf = { createParticleSystem };
const _ref_5gyn61 = { verifyAppSignature };
const _ref_iwyvwi = { merkelizeRoot };
const _ref_f5twtd = { reportWarning };
const _ref_x4yy7d = { validateTokenStructure };
const _ref_naq80t = { calculateCRC32 };
const _ref_ido9qx = { contextSwitch };
const _ref_mps4og = { compileVertexShader };
const _ref_imcym5 = { uninterestPeer };
const _ref_pwkjhk = { addWheel };
const _ref_huduue = { validateRecaptcha };
const _ref_xi8mmj = { inlineFunctions };
const _ref_77azrf = { monitorClipboard };
const _ref_b5q9c0 = { getBlockHeight };
const _ref_0tnx98 = { systemCall };
const _ref_kvl1l4 = { formatCurrency };
const _ref_jvh5us = { detectDevTools };
const _ref_m6ph74 = { calculateEntropy };
const _ref_35adeg = { applyImpulse };
const _ref_rcw1wd = { tunnelThroughProxy };
const _ref_1hep1i = { setViewport };
const _ref_vobyvz = { unrollLoops };
const _ref_gmqepi = { checkRootAccess };
const _ref_5t84za = { connectionPooling };
const _ref_qrxnzj = { normalizeFeatures };
const _ref_yfuqlv = { discoverPeersDHT };
const _ref_hmkblr = { checkBalance };
const _ref_8yvqph = { virtualScroll };
const _ref_popo2i = { disablePEX };
const _ref_pn5xny = { resumeContext };
const _ref_ghztr1 = { unlockFile };
const _ref_hydldj = { addSliderConstraint };
const _ref_pxl3dz = { lockRow };
const _ref_evy256 = { getAppConfig };
const _ref_pb574e = { setFilterType };
const _ref_mqpfmf = { registerISR };
const _ref_mncn5u = { watchFileChanges };
const _ref_6u1wi0 = { traverseAST };
const _ref_k5fpm5 = { createFrameBuffer };
const _ref_befjxd = { beginTransaction };
const _ref_jmebmm = { preventCSRF };
const _ref_0ot8uc = { interestPeer };
const _ref_d0ksaq = { calculateMetric };
const _ref_jhyung = { resolveDNS };
const _ref_qjdcrx = { resolveSymbols };
const _ref_mh8aeo = { setGravity };
const _ref_n8xqa2 = { parseConfigFile };
const _ref_llvus7 = { updateParticles };
const _ref_qtcwsk = { deriveAddress };
const _ref_uwmydd = { checkPortAvailability };
const _ref_59okii = { clearScreen };
const _ref_1lvtlp = { createDirectoryRecursive };
const _ref_89lzuc = { manageCookieJar };
const _ref_j1x1d9 = { chmodFile };
const _ref_l6i9h7 = { disableInterrupts };
const _ref_jp5oye = { decodeAudioData };
const _ref_btkkxj = { renderParticles };
const _ref_x792rw = { rateLimitCheck };
const _ref_8upxdy = { linkFile };
const _ref_88ay3i = { uniform1i };
const _ref_qy4neu = { analyzeHeader };
const _ref_i8fw54 = { estimateNonce };
const _ref_bu7hvt = { sanitizeXSS };
const _ref_gfrkxe = { detectDebugger };
const _ref_yjk0wp = { foldConstants };
const _ref_wmlufs = { stakeAssets };
const _ref_kuf3tf = { limitDownloadSpeed };
const _ref_p1dgbo = { upInterface };
const _ref_ovjwru = { loadImpulseResponse };
const _ref_a64h8d = { throttleRequests };
const _ref_my3w7t = { backupDatabase };
const _ref_cuohg7 = { migrateSchema };
const _ref_fcketi = { resetVehicle };
const _ref_wxb6rv = { detectPacketLoss };
const _ref_kv8yc4 = { hoistVariables };
const _ref_wrwe0e = { uniform3f };
const _ref_70mhq8 = { resolveCollision };
const _ref_4qm5sd = { parseLogTopics };
const _ref_p7pzyy = { readPipe };
const _ref_4naz3e = { closeSocket };
const _ref_f9i9fg = { deleteTempFiles };
const _ref_ts4ww9 = { stepSimulation };
const _ref_pdtak1 = { freeMemory };
const _ref_srwaxn = { scheduleBandwidth };
const _ref_dsm1by = { createChannelMerger };
const _ref_u82a5a = { anchorSoftBody };
const _ref_1rg5hl = { setOrientation };
const _ref_d4tafh = { closePipe };
const _ref_t0pdss = { unmountFileSystem };
const _ref_4q5xh2 = { negotiateProtocol };
const _ref_5geznx = { shutdownComputer };
const _ref_src4c8 = { cleanOldLogs };
const _ref_yoq0ps = { setAttack };
const _ref_xply4u = { unloadDriver };
const _ref_qrafsr = { renderVirtualDOM };
const _ref_m1ruub = { getOutputTimestamp };
const _ref_6x6s9e = { calculateFriction };
const _ref_07bj19 = { generateSourceMap };
const _ref_ifew9q = { recognizeSpeech };
const _ref_exnv3j = { chownFile };
const _ref_b6xdp7 = { attachRenderBuffer };
const _ref_sd72wa = { readPixels };
const _ref_ky92bq = { setFilePermissions };
const _ref_ok8cwb = { terminateSession };
const _ref_j6hj1k = { invalidateCache };
const _ref_4kjjpz = { verifyMagnetLink };
const _ref_s0vz09 = { suspendContext };
const _ref_2otjpt = { analyzeUserBehavior };
const _ref_9iz192 = { normalizeVector };
const _ref_o66grg = { connectToTracker };
const _ref_xbgnox = { cancelAnimationFrameLoop };
const _ref_z8x8da = { lockFile };
const _ref_q4yx6h = { prettifyCode };
const _ref_akjyo9 = { verifyProofOfWork }; 
    });
})({}, {});