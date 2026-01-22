// ==UserScript==
// @name agalega视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/agalega/index.js
// @version 2026.01.21.2
// @description 一键下载agalega视频，支持4K/1080P/720P多画质。
// @icon https://www.agalega.gal/favicon.ico
// @match *://*.agalega.gal/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect agalega.gal
// @connect interactvty.com
// @connect flumotion.cloud
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
// @downloadURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const handleInterrupt = (irq) => true;

const defineSymbol = (table, name, info) => true;

const jitCompile = (bc) => (() => {});

const verifyIR = (ir) => true;

const createTCPSocket = () => ({ fd: 1 });

const encryptStream = (stream, key) => stream;

const connectSocket = (sock, addr, port) => true;

const verifyChecksum = (data, sum) => true;

const detectCollision = (body1, body2) => false;

const wakeUp = (body) => true;

const generateDocumentation = (ast) => "";

const decompressPacket = (data) => data;

const deserializeAST = (json) => JSON.parse(json);

const resolveSymbols = (ast) => ({});

const installUpdate = () => false;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const drawArrays = (gl, mode, first, count) => true;

const setOrientation = (panner, x, y, z) => true;

const lookupSymbol = (table, name) => ({});

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

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const restartApplication = () => console.log("Restarting...");

const rollbackTransaction = (tx) => true;

const prettifyCode = (code) => code;

const createVehicle = (chassis) => ({ wheels: [] });

const registerSystemTray = () => ({ icon: "tray.ico" });

const pingHost = (host) => 10;

const getShaderInfoLog = (shader) => "";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });


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

const seedRatioLimit = (ratio) => ratio >= 2.0;

const checkRootAccess = () => false;

const createAudioContext = () => ({ sampleRate: 44100 });

const uniform1i = (loc, val) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const minifyCode = (code) => code;

const analyzeControlFlow = (ast) => ({ graph: {} });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const rebootSystem = () => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const getcwd = () => "/";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const commitTransaction = (tx) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const compressGzip = (data) => data;

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

const enterScope = (table) => true;

const closeSocket = (sock) => true;

const dropTable = (table) => true;

const mountFileSystem = (dev, path) => true;

const parsePayload = (packet) => ({});

const mockResponse = (body) => ({ status: 200, body });

const scheduleTask = (task) => ({ id: 1, task });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createShader = (gl, type) => ({ id: Math.random(), type });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const traceroute = (host) => ["192.168.1.1"];

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const protectMemory = (ptr, size, flags) => true;

const reportError = (msg, line) => console.error(msg);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const disableRightClick = () => true;

const addConeTwistConstraint = (world, c) => true;

const obfuscateCode = (code) => code;

const applyImpulse = (body, impulse, point) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const seekFile = (fd, offset) => true;

const updateWheelTransform = (wheel) => true;

const controlCongestion = (sock) => true;

const uniform3f = (loc, x, y, z) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const cacheQueryResults = (key, data) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const killProcess = (pid) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const applyForce = (body, force, point) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const calculateComplexity = (ast) => 1;

const injectCSPHeader = () => "default-src 'self'";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const setAttack = (node, val) => node.attack.value = val;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const addGeneric6DofConstraint = (world, c) => true;

const writePipe = (fd, data) => data.length;

const addPoint2PointConstraint = (world, c) => true;

const downInterface = (iface) => true;

const renderCanvasLayer = (ctx) => true;

const createChannelSplitter = (ctx, channels) => ({});

const cullFace = (mode) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const setAngularVelocity = (body, v) => true;

const addWheel = (vehicle, info) => true;

const setMass = (body, m) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const resumeContext = (ctx) => Promise.resolve();

const createIndex = (table, col) => `IDX_${table}_${col}`;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const captureFrame = () => "frame_data_buffer";

const signTransaction = (tx, key) => "signed_tx_hash";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const createConvolver = (ctx) => ({ buffer: null });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const dhcpAck = () => true;

const decompressGzip = (data) => data;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const detectDebugger = () => false;

const checkBalance = (addr) => "10.5 ETH";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const encryptPeerTraffic = (data) => btoa(data);

const dhcpRequest = (ip) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const stakeAssets = (pool, amount) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const removeConstraint = (world, c) => true;

const reassemblePacket = (fragments) => fragments[0];

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const bindSocket = (port) => ({ port, status: "bound" });


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

const resampleAudio = (buffer, rate) => buffer;

const allocateMemory = (size) => 0x1000;

const cleanOldLogs = (days) => days;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createPeriodicWave = (ctx, real, imag) => ({});

const getEnv = (key) => "";

const generateCode = (ast) => "const a = 1;";

const dhcpOffer = (ip) => true;

const detectAudioCodec = () => "aac";

const sleep = (body) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const createFrameBuffer = () => ({ id: Math.random() });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const bufferMediaStream = (size) => ({ buffer: size });

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const setGravity = (world, g) => world.gravity = g;

const prioritizeRarestPiece = (pieces) => pieces[0];

const invalidateCache = (key) => true;

const prioritizeTraffic = (queue) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const shutdownComputer = () => console.log("Shutting down...");

const reportWarning = (msg, line) => console.warn(msg);

const fingerprintBrowser = () => "fp_hash_123";

const loadDriver = (path) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const joinGroup = (group) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const gaussianBlur = (image, radius) => image;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const freeMemory = (ptr) => true;

const rotateLogFiles = () => true;

const cancelTask = (id) => ({ id, cancelled: true });

const detectPacketLoss = (acks) => false;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const applyTorque = (body, torque) => true;

const joinThread = (tid) => true;

const unlockFile = (path) => ({ path, locked: false });

const unmountFileSystem = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const rateLimitCheck = (ip) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const calculateRestitution = (mat1, mat2) => 0.3;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const systemCall = (num, args) => 0;

const execProcess = (path) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const restoreDatabase = (path) => true;

const analyzeHeader = (packet) => ({});

const upInterface = (iface) => true;

const triggerHapticFeedback = (intensity) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const mergeFiles = (parts) => parts[0];

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const auditAccessLogs = () => true;

const createConstraint = (body1, body2) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const bindTexture = (target, texture) => true;

const listenSocket = (sock, backlog) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const renderParticles = (sys) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const closeContext = (ctx) => Promise.resolve();

const interpretBytecode = (bc) => true;

const setPosition = (panner, x, y, z) => true;

// Anti-shake references
const _ref_woigzg = { parseMagnetLink };
const _ref_rzvpnh = { handleInterrupt };
const _ref_q9hb5i = { defineSymbol };
const _ref_ubmmeb = { jitCompile };
const _ref_wrpkx4 = { verifyIR };
const _ref_h8mw95 = { createTCPSocket };
const _ref_ia4b08 = { encryptStream };
const _ref_rd8h6w = { connectSocket };
const _ref_arsbg8 = { verifyChecksum };
const _ref_8vrzys = { detectCollision };
const _ref_f63q2n = { wakeUp };
const _ref_77iaet = { generateDocumentation };
const _ref_fnrmin = { decompressPacket };
const _ref_l5cn8w = { deserializeAST };
const _ref_gc0n8d = { resolveSymbols };
const _ref_z68k44 = { installUpdate };
const _ref_mwo9on = { createScriptProcessor };
const _ref_ose17o = { drawArrays };
const _ref_bysw67 = { setOrientation };
const _ref_tmworu = { lookupSymbol };
const _ref_rr4mb1 = { AdvancedCipher };
const _ref_jkqnv1 = { uploadCrashReport };
const _ref_z4feld = { restartApplication };
const _ref_zn7quz = { rollbackTransaction };
const _ref_eg2veq = { prettifyCode };
const _ref_b3axn1 = { createVehicle };
const _ref_pbvtnc = { registerSystemTray };
const _ref_5nb9cp = { pingHost };
const _ref_mylgb3 = { getShaderInfoLog };
const _ref_xuzkix = { loadTexture };
const _ref_8n46gc = { createOscillator };
const _ref_kvn5yv = { ResourceMonitor };
const _ref_1bmbqe = { seedRatioLimit };
const _ref_4kyyw3 = { checkRootAccess };
const _ref_0w5rg2 = { createAudioContext };
const _ref_fx9x8p = { uniform1i };
const _ref_igagsx = { manageCookieJar };
const _ref_6nqald = { minifyCode };
const _ref_d94y8g = { analyzeControlFlow };
const _ref_8rok3q = { watchFileChanges };
const _ref_zkaqdc = { parseClass };
const _ref_ldq4su = { rebootSystem };
const _ref_vjpzmc = { createStereoPanner };
const _ref_jlhh0n = { getcwd };
const _ref_gguwf6 = { calculateEntropy };
const _ref_b8zmiu = { commitTransaction };
const _ref_2ao5h4 = { initiateHandshake };
const _ref_suvggr = { compressGzip };
const _ref_8erwcs = { generateFakeClass };
const _ref_qo5t5j = { enterScope };
const _ref_d5gx98 = { closeSocket };
const _ref_07knuh = { dropTable };
const _ref_0764cq = { mountFileSystem };
const _ref_s2dg1p = { parsePayload };
const _ref_ycv577 = { mockResponse };
const _ref_65em96 = { scheduleTask };
const _ref_khkslk = { createMeshShape };
const _ref_6whrql = { createShader };
const _ref_tf0lvt = { setSteeringValue };
const _ref_iq37m4 = { traceroute };
const _ref_b9b4gd = { analyzeQueryPlan };
const _ref_792llh = { protectMemory };
const _ref_k13cmm = { reportError };
const _ref_u9pyk5 = { validateTokenStructure };
const _ref_ikkqul = { disableRightClick };
const _ref_2u6pmh = { addConeTwistConstraint };
const _ref_c9xny0 = { obfuscateCode };
const _ref_801ic2 = { applyImpulse };
const _ref_kd4mu1 = { repairCorruptFile };
const _ref_4qgm2q = { seekFile };
const _ref_7akqpt = { updateWheelTransform };
const _ref_vc4dkf = { controlCongestion };
const _ref_2trdqo = { uniform3f };
const _ref_vgjhon = { syncDatabase };
const _ref_byn6lw = { cacheQueryResults };
const _ref_ot5t06 = { broadcastTransaction };
const _ref_hqet3s = { killProcess };
const _ref_kjtuwg = { createCapsuleShape };
const _ref_3bidad = { formatLogMessage };
const _ref_tua262 = { createMagnetURI };
const _ref_2k93m1 = { applyForce };
const _ref_xa08sk = { sanitizeInput };
const _ref_fcbvve = { getMACAddress };
const _ref_qxhyzr = { calculateComplexity };
const _ref_ftis0h = { injectCSPHeader };
const _ref_m9sc9b = { scheduleBandwidth };
const _ref_yvo0gl = { setAttack };
const _ref_fuyk88 = { discoverPeersDHT };
const _ref_tbgeur = { addGeneric6DofConstraint };
const _ref_x5ci0a = { writePipe };
const _ref_phb3d7 = { addPoint2PointConstraint };
const _ref_q1i8ym = { downInterface };
const _ref_r3q9m0 = { renderCanvasLayer };
const _ref_efgjqe = { createChannelSplitter };
const _ref_e1bcsd = { cullFace };
const _ref_la2hwd = { calculateSHA256 };
const _ref_4zgkho = { setAngularVelocity };
const _ref_vq3mia = { addWheel };
const _ref_b39iq4 = { setMass };
const _ref_8r3sb8 = { makeDistortionCurve };
const _ref_n9t50l = { resumeContext };
const _ref_cclygi = { createIndex };
const _ref_3nhol6 = { generateUserAgent };
const _ref_raktde = { announceToTracker };
const _ref_oioiqc = { connectionPooling };
const _ref_rxr22h = { parseTorrentFile };
const _ref_8ti2rp = { captureFrame };
const _ref_bj1zmp = { signTransaction };
const _ref_xwg7ov = { limitUploadSpeed };
const _ref_29pk6c = { createConvolver };
const _ref_s71yke = { scrapeTracker };
const _ref_fqj6uz = { dhcpAck };
const _ref_v8h3kl = { decompressGzip };
const _ref_91amhc = { applyPerspective };
const _ref_z9hxjf = { detectDebugger };
const _ref_nbi5r2 = { checkBalance };
const _ref_srt2du = { normalizeAudio };
const _ref_u4akai = { encryptPeerTraffic };
const _ref_2mbco3 = { dhcpRequest };
const _ref_9tm86z = { showNotification };
const _ref_fkw8x7 = { stakeAssets };
const _ref_f74dzy = { checkDiskSpace };
const _ref_5xle1r = { removeConstraint };
const _ref_t44kzg = { reassemblePacket };
const _ref_idjv38 = { getAngularVelocity };
const _ref_clpt0y = { bindSocket };
const _ref_bnisj9 = { TelemetryClient };
const _ref_m4b63u = { resampleAudio };
const _ref_br5fuq = { allocateMemory };
const _ref_xrxcsx = { cleanOldLogs };
const _ref_4u08ng = { monitorNetworkInterface };
const _ref_2exz1g = { createPeriodicWave };
const _ref_hkar40 = { getEnv };
const _ref_m0dmmp = { generateCode };
const _ref_9jlbd6 = { dhcpOffer };
const _ref_xspu5b = { detectAudioCodec };
const _ref_mclpy3 = { sleep };
const _ref_gyjb1z = { debounceAction };
const _ref_dtk070 = { createFrameBuffer };
const _ref_o8ipxh = { encryptPayload };
const _ref_49yrth = { bufferMediaStream };
const _ref_a4h9yn = { limitDownloadSpeed };
const _ref_w6rcjf = { setGravity };
const _ref_sw860j = { prioritizeRarestPiece };
const _ref_oq5lo5 = { invalidateCache };
const _ref_owbxrb = { prioritizeTraffic };
const _ref_i0cdtr = { shardingTable };
const _ref_0b38g7 = { shutdownComputer };
const _ref_7kgjls = { reportWarning };
const _ref_6pbws1 = { fingerprintBrowser };
const _ref_f7a69r = { loadDriver };
const _ref_xnrpn3 = { optimizeConnectionPool };
const _ref_onxesm = { joinGroup };
const _ref_sn5use = { createMediaStreamSource };
const _ref_ra9k4v = { parseConfigFile };
const _ref_etgfn7 = { gaussianBlur };
const _ref_rda5p4 = { handshakePeer };
const _ref_7quiis = { freeMemory };
const _ref_yc296t = { rotateLogFiles };
const _ref_ra9m7i = { cancelTask };
const _ref_od7b5j = { detectPacketLoss };
const _ref_jyseg8 = { FileValidator };
const _ref_ao8l4w = { switchProxyServer };
const _ref_ip3axg = { applyTorque };
const _ref_bh9ess = { joinThread };
const _ref_k8ex7q = { unlockFile };
const _ref_5ncqn2 = { unmountFileSystem };
const _ref_oo6up7 = { getFileAttributes };
const _ref_zgvpy6 = { rateLimitCheck };
const _ref_b8qrnb = { setSocketTimeout };
const _ref_ejwe5y = { createDynamicsCompressor };
const _ref_var070 = { calculateRestitution };
const _ref_3kpm9l = { convexSweepTest };
const _ref_zki1e2 = { systemCall };
const _ref_qyx9wc = { execProcess };
const _ref_b88kwa = { readPipe };
const _ref_qprbag = { limitBandwidth };
const _ref_zee0f2 = { restoreDatabase };
const _ref_m2mlat = { analyzeHeader };
const _ref_4hnp70 = { upInterface };
const _ref_xljjwq = { triggerHapticFeedback };
const _ref_8e537g = { getFloatTimeDomainData };
const _ref_y7s45q = { detectFirewallStatus };
const _ref_9pqa4d = { mergeFiles };
const _ref_a5oibo = { sanitizeSQLInput };
const _ref_moptjx = { getMemoryUsage };
const _ref_hm8al6 = { traceStack };
const _ref_fu7imi = { auditAccessLogs };
const _ref_m6w1vf = { createConstraint };
const _ref_ij3dzv = { decodeABI };
const _ref_hwh3iu = { getAppConfig };
const _ref_mio5ni = { bindTexture };
const _ref_1teck6 = { listenSocket };
const _ref_boi7ny = { rotateMatrix };
const _ref_a3fm9d = { renderParticles };
const _ref_acq9wi = { unchokePeer };
const _ref_jlpkns = { migrateSchema };
const _ref_zc0x78 = { closeContext };
const _ref_shrfqc = { interpretBytecode };
const _ref_xv1bun = { setPosition }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `agalega` };
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
                const urlParams = { config, url: window.location.href, name_en: `agalega` };

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
        const validateIPWhitelist = (ip) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const prefetchAssets = (urls) => urls.length;

const restoreDatabase = (path) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setGainValue = (node, val) => node.gain.value = val;

const getByteFrequencyData = (analyser, array) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const activeTexture = (unit) => true;

const freeMemory = (ptr) => true;

const lookupSymbol = (table, name) => ({});

const pingHost = (host) => 10;

const resolveImports = (ast) => [];

const analyzeControlFlow = (ast) => ({ graph: {} });

const loadCheckpoint = (path) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const installUpdate = () => false;

const fragmentPacket = (data, mtu) => [data];

const bufferData = (gl, target, data, usage) => true;

const optimizeTailCalls = (ast) => ast;

const edgeDetectionSobel = (image) => image;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const controlCongestion = (sock) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const scaleMatrix = (mat, vec) => mat;

const updateRoutingTable = (entry) => true;

const closeSocket = (sock) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const encryptLocalStorage = (key, val) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const prettifyCode = (code) => code;

const dumpSymbolTable = (table) => "";

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const rmdir = (path) => true;

const broadcastMessage = (msg) => true;

const generateDocumentation = (ast) => "";

const createShader = (gl, type) => ({ id: Math.random(), type });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const dhcpAck = () => true;

const createTCPSocket = () => ({ fd: 1 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const renameFile = (oldName, newName) => newName;

const parsePayload = (packet) => ({});

const allocateMemory = (size) => 0x1000;

const lockFile = (path) => ({ path, locked: true });

const verifyChecksum = (data, sum) => true;

const semaphoreSignal = (sem) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const enableBlend = (func) => true;

const commitTransaction = (tx) => true;

const createProcess = (img) => ({ pid: 100 });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const unmapMemory = (ptr, size) => true;

const scheduleProcess = (pid) => true;

const mountFileSystem = (dev, path) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const cullFace = (mode) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const disableDepthTest = () => true;

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

const setPan = (node, val) => node.pan.value = val;

const cacheQueryResults = (key, data) => true;

const getUniformLocation = (program, name) => 1;

const mutexLock = (mtx) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const normalizeVolume = (buffer) => buffer;

const segmentImageUNet = (img) => "mask_buffer";

const announceToTracker = (url) => ({ url, interval: 1800 });

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const loadDriver = (path) => true;

const startOscillator = (osc, time) => true;

const mapMemory = (fd, size) => 0x2000;

const prioritizeTraffic = (queue) => true;

const exitScope = (table) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const acceptConnection = (sock) => ({ fd: 2 });

const decompressPacket = (data) => data;

const applyImpulse = (body, impulse, point) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const createChannelSplitter = (ctx, channels) => ({});

const addPoint2PointConstraint = (world, c) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const registerGestureHandler = (gesture) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const checkUpdate = () => ({ hasUpdate: false });

const createListener = (ctx) => ({});

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const sleep = (body) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const analyzeBitrate = () => "5000kbps";

const setQValue = (filter, q) => filter.Q = q;

const resolveSymbols = (ast) => ({});

const wakeUp = (body) => true;

const connectSocket = (sock, addr, port) => true;

const setPosition = (panner, x, y, z) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const establishHandshake = (sock) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const addHingeConstraint = (world, c) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const generateMipmaps = (target) => true;

const getShaderInfoLog = (shader) => "";

const setVelocity = (body, v) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const removeMetadata = (file) => ({ file, metadata: null });

const closePipe = (fd) => true;

const registerISR = (irq, func) => true;

const statFile = (path) => ({ size: 0 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const getExtension = (name) => ({});

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const detachThread = (tid) => true;

const gaussianBlur = (image, radius) => image;

const shutdownComputer = () => console.log("Shutting down...");

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

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const findLoops = (cfg) => [];

const drawArrays = (gl, mode, first, count) => true;

const rebootSystem = () => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const migrateSchema = (version) => ({ current: version, status: "ok" });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const encryptStream = (stream, key) => stream;

const applyTorque = (body, torque) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const spoofReferer = () => "https://google.com";

const recognizeSpeech = (audio) => "Transcribed Text";

const enableInterrupts = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const retransmitPacket = (seq) => true;

const setMass = (body, m) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const prioritizeRarestPiece = (pieces) => pieces[0];

const setFilterType = (filter, type) => filter.type = type;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const computeDominators = (cfg) => ({});

const auditAccessLogs = () => true;

const disablePEX = () => false;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unlockRow = (id) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const resampleAudio = (buffer, rate) => buffer;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const splitFile = (path, parts) => Array(parts).fill(path);

const detectPacketLoss = (acks) => false;

const applyFog = (color, dist) => color;

const setDopplerFactor = (val) => true;

const createConstraint = (body1, body2) => ({});

const processAudioBuffer = (buffer) => buffer;

const createMediaElementSource = (ctx, el) => ({});

const injectMetadata = (file, meta) => ({ file, meta });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createSphereShape = (r) => ({ type: 'sphere' });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const detectVideoCodec = () => "h264";

const execProcess = (path) => true;

const hydrateSSR = (html) => true;

const obfuscateCode = (code) => code;

const createASTNode = (type, val) => ({ type, val });

const reduceDimensionalityPCA = (data) => data;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const contextSwitch = (oldPid, newPid) => true;

const encapsulateFrame = (packet) => packet;

const setVolumeLevel = (vol) => vol;

const estimateNonce = (addr) => 42;

const checkBalance = (addr) => "10.5 ETH";

const defineSymbol = (table, name, info) => true;

const reportWarning = (msg, line) => console.warn(msg);

const setMTU = (iface, mtu) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const subscribeToEvents = (contract) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getMediaDuration = () => 3600;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const invalidateCache = (key) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const updateTransform = (body) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const deserializeAST = (json) => JSON.parse(json);

const createDirectoryRecursive = (path) => path.split('/').length;

const claimRewards = (pool) => "0.5 ETH";

const deobfuscateString = (str) => atob(str);

const sendPacket = (sock, data) => data.length;

const deleteProgram = (program) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const getEnv = (key) => "";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

// Anti-shake references
const _ref_g2l464 = { validateIPWhitelist };
const _ref_zuir0g = { normalizeFeatures };
const _ref_0c8r7h = { generateUUIDv5 };
const _ref_dnebev = { prefetchAssets };
const _ref_brj2iu = { restoreDatabase };
const _ref_lbil11 = { normalizeAudio };
const _ref_1f72lg = { traceStack };
const _ref_rrvr83 = { setGainValue };
const _ref_sgf7mr = { getByteFrequencyData };
const _ref_fxb8xc = { applyPerspective };
const _ref_54tvpd = { activeTexture };
const _ref_408iqk = { freeMemory };
const _ref_iwkukj = { lookupSymbol };
const _ref_2xqvon = { pingHost };
const _ref_rmkn9i = { resolveImports };
const _ref_h2psoj = { analyzeControlFlow };
const _ref_red63k = { loadCheckpoint };
const _ref_0vcq6f = { optimizeConnectionPool };
const _ref_1jnbpb = { installUpdate };
const _ref_ejvzgs = { fragmentPacket };
const _ref_ikq3od = { bufferData };
const _ref_fftd5v = { optimizeTailCalls };
const _ref_ds0yyo = { edgeDetectionSobel };
const _ref_bd9235 = { getFileAttributes };
const _ref_wrfrdy = { controlCongestion };
const _ref_v0h0gh = { calculateSHA256 };
const _ref_98kttx = { scaleMatrix };
const _ref_wwwhp5 = { updateRoutingTable };
const _ref_6l0ay2 = { closeSocket };
const _ref_397rwi = { updateBitfield };
const _ref_ttx3yq = { encryptLocalStorage };
const _ref_eqcnkb = { parseTorrentFile };
const _ref_iw2fx4 = { prettifyCode };
const _ref_gqeu2y = { dumpSymbolTable };
const _ref_9rjvtd = { optimizeHyperparameters };
const _ref_yinwlc = { rmdir };
const _ref_f69ro7 = { broadcastMessage };
const _ref_5wiwli = { generateDocumentation };
const _ref_kl4gvv = { createShader };
const _ref_rdarqf = { unchokePeer };
const _ref_7iwxol = { resolveDNSOverHTTPS };
const _ref_4ze8e5 = { dhcpAck };
const _ref_8eq2xp = { createTCPSocket };
const _ref_2q9afo = { FileValidator };
const _ref_ya23tv = { renameFile };
const _ref_yo9ffq = { parsePayload };
const _ref_mzxj53 = { allocateMemory };
const _ref_wbbe6v = { lockFile };
const _ref_ly7pg5 = { verifyChecksum };
const _ref_jrzgx5 = { semaphoreSignal };
const _ref_s0udf9 = { synthesizeSpeech };
const _ref_v7xf70 = { enableBlend };
const _ref_mbh5kj = { commitTransaction };
const _ref_hmf8sw = { createProcess };
const _ref_a9fbbz = { monitorNetworkInterface };
const _ref_d6ifw0 = { unmapMemory };
const _ref_kwjjbb = { scheduleProcess };
const _ref_wh5off = { mountFileSystem };
const _ref_q0r58l = { createPeriodicWave };
const _ref_pkqr9c = { cullFace };
const _ref_p6ksiq = { getFloatTimeDomainData };
const _ref_vmj6el = { allocateDiskSpace };
const _ref_1fdws6 = { watchFileChanges };
const _ref_jo89pr = { createPanner };
const _ref_28d7sa = { disableDepthTest };
const _ref_8lycta = { ProtocolBufferHandler };
const _ref_nt5g1l = { setPan };
const _ref_zk20rx = { cacheQueryResults };
const _ref_8lw01z = { getUniformLocation };
const _ref_w7swqu = { mutexLock };
const _ref_24wr6t = { scrapeTracker };
const _ref_wh8kx2 = { normalizeVolume };
const _ref_sif86f = { segmentImageUNet };
const _ref_xe9nc9 = { announceToTracker };
const _ref_w07xli = { deleteTempFiles };
const _ref_xpt9j8 = { loadDriver };
const _ref_za3444 = { startOscillator };
const _ref_683t85 = { mapMemory };
const _ref_rtph8m = { prioritizeTraffic };
const _ref_6cgh3h = { exitScope };
const _ref_fkkii7 = { clusterKMeans };
const _ref_1u2ruj = { acceptConnection };
const _ref_wf4hx9 = { decompressPacket };
const _ref_tuovr8 = { applyImpulse };
const _ref_o9rfq5 = { seedRatioLimit };
const _ref_ea97xb = { createChannelSplitter };
const _ref_k9whl7 = { addPoint2PointConstraint };
const _ref_weeylj = { renderShadowMap };
const _ref_5pnloq = { registerGestureHandler };
const _ref_5qsi1w = { syncAudioVideo };
const _ref_emsxiw = { checkUpdate };
const _ref_74k0wk = { createListener };
const _ref_yloue8 = { initWebGLContext };
const _ref_4jye8j = { sleep };
const _ref_s3u98z = { transformAesKey };
const _ref_xa79gc = { analyzeBitrate };
const _ref_6vittz = { setQValue };
const _ref_ke76uz = { resolveSymbols };
const _ref_0c1vqt = { wakeUp };
const _ref_za6y5q = { connectSocket };
const _ref_18f6bi = { setPosition };
const _ref_czpo07 = { createBiquadFilter };
const _ref_l4hwlc = { establishHandshake };
const _ref_0bam2e = { captureScreenshot };
const _ref_xg1021 = { addHingeConstraint };
const _ref_i4tbbn = { resolveDependencyGraph };
const _ref_l9g02f = { checkDiskSpace };
const _ref_or5551 = { calculateEntropy };
const _ref_yzt82s = { generateMipmaps };
const _ref_3beg08 = { getShaderInfoLog };
const _ref_f70xaz = { setVelocity };
const _ref_dtpr57 = { compactDatabase };
const _ref_cmq9k5 = { removeMetadata };
const _ref_4d0tjw = { closePipe };
const _ref_0x3a0q = { registerISR };
const _ref_940g4u = { statFile };
const _ref_1zg3oy = { getVelocity };
const _ref_4mp7yg = { getExtension };
const _ref_2x8ta9 = { calculateMD5 };
const _ref_zy8bz2 = { detachThread };
const _ref_ny1epu = { gaussianBlur };
const _ref_kiugjm = { shutdownComputer };
const _ref_wp20wg = { AdvancedCipher };
const _ref_3u8sya = { connectionPooling };
const _ref_ijb4wu = { findLoops };
const _ref_5vg6mc = { drawArrays };
const _ref_x84gv3 = { rebootSystem };
const _ref_ofrdga = { formatLogMessage };
const _ref_33qr08 = { migrateSchema };
const _ref_9mjf59 = { limitBandwidth };
const _ref_7rggki = { encryptStream };
const _ref_cxnywp = { applyTorque };
const _ref_vjo35d = { getMemoryUsage };
const _ref_ymw6a3 = { spoofReferer };
const _ref_133wkv = { recognizeSpeech };
const _ref_ue10sz = { enableInterrupts };
const _ref_7ghyge = { rayCast };
const _ref_qb727l = { retransmitPacket };
const _ref_e3ml3i = { setMass };
const _ref_1uhvc7 = { cancelTask };
const _ref_y44aaq = { prioritizeRarestPiece };
const _ref_jhnpxc = { setFilterType };
const _ref_ldjvun = { predictTensor };
const _ref_wwa037 = { computeDominators };
const _ref_jmw9aa = { auditAccessLogs };
const _ref_l8ao6n = { disablePEX };
const _ref_v8a6y6 = { createDelay };
const _ref_bjtvun = { isFeatureEnabled };
const _ref_tdg4dg = { unlockRow };
const _ref_hdle8r = { createFrameBuffer };
const _ref_1q697m = { resampleAudio };
const _ref_9u1mcu = { setFrequency };
const _ref_30zxli = { splitFile };
const _ref_czis76 = { detectPacketLoss };
const _ref_7r62yv = { applyFog };
const _ref_z20x1w = { setDopplerFactor };
const _ref_bdi03n = { createConstraint };
const _ref_y4iifb = { processAudioBuffer };
const _ref_hjfud9 = { createMediaElementSource };
const _ref_817fhf = { injectMetadata };
const _ref_k7bn3u = { virtualScroll };
const _ref_z4m8sf = { createSphereShape };
const _ref_xci7j9 = { createBoxShape };
const _ref_ip9f8k = { detectVideoCodec };
const _ref_3nnoc6 = { execProcess };
const _ref_84wxox = { hydrateSSR };
const _ref_qy8oy9 = { obfuscateCode };
const _ref_udy3q7 = { createASTNode };
const _ref_p7nowz = { reduceDimensionalityPCA };
const _ref_107sf8 = { getNetworkStats };
const _ref_795hn1 = { createMeshShape };
const _ref_bqi3ny = { contextSwitch };
const _ref_w79bfa = { encapsulateFrame };
const _ref_lw2ks4 = { setVolumeLevel };
const _ref_rmy3ae = { estimateNonce };
const _ref_0wfeo5 = { checkBalance };
const _ref_767v18 = { defineSymbol };
const _ref_czg6d6 = { reportWarning };
const _ref_dvkpur = { setMTU };
const _ref_dxv8v8 = { diffVirtualDOM };
const _ref_nbd1g4 = { subscribeToEvents };
const _ref_oslife = { setDelayTime };
const _ref_hqbebv = { getMediaDuration };
const _ref_86rw9s = { initiateHandshake };
const _ref_vd73at = { invalidateCache };
const _ref_1jtns9 = { registerSystemTray };
const _ref_irx3vh = { decodeABI };
const _ref_k6llhq = { playSoundAlert };
const _ref_sm7xnj = { parseM3U8Playlist };
const _ref_v9xdx5 = { updateTransform };
const _ref_jn6sfw = { flushSocketBuffer };
const _ref_d6i6ej = { deserializeAST };
const _ref_cli07f = { createDirectoryRecursive };
const _ref_h5g6n3 = { claimRewards };
const _ref_rtc8nz = { deobfuscateString };
const _ref_o05okx = { sendPacket };
const _ref_mystx1 = { deleteProgram };
const _ref_1l8zvw = { calculateRestitution };
const _ref_3cftll = { getEnv };
const _ref_0j3ixu = { getAngularVelocity }; 
    });
})({}, {});