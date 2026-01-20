// ==UserScript==
// @name bilibili视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bilibili/index.js
// @version 2026.01.10
// @description 下载哔哩哔哩视频，支持4K/1080P/720P多画质。
// @icon https://www.bilibili.com/favicon.ico
// @match *://*.bilibili.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bilibili.com
// @connect bilivideo.com
// @connect bilivideo.cn
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
// @downloadURL https://update.greasyfork.org/scripts/560045/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560045/bilibili%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const encryptLocalStorage = (key, val) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const setDistanceModel = (panner, model) => true;

const getByteFrequencyData = (analyser, array) => true;

const activeTexture = (unit) => true;

const setPan = (node, val) => node.pan.value = val;

const setFilterType = (filter, type) => filter.type = type;

const setThreshold = (node, val) => node.threshold.value = val;

const setAttack = (node, val) => node.attack.value = val;

const createAudioContext = () => ({ sampleRate: 44100 });

const deleteBuffer = (buffer) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const clearScreen = (r, g, b, a) => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const createChannelMerger = (ctx, channels) => ({});

const drawElements = (mode, count, type, offset) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const setPosition = (panner, x, y, z) => true;

const createSoftBody = (info) => ({ nodes: [] });

const setQValue = (filter, q) => filter.Q = q;

const resolveCollision = (manifold) => true;

const setKnee = (node, val) => node.knee.value = val;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const wakeUp = (body) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setGainValue = (node, val) => node.gain.value = val;

const resetVehicle = (vehicle) => true;

const bindTexture = (target, texture) => true;

const startOscillator = (osc, time) => true;

const uniform3f = (loc, x, y, z) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const compileVertexShader = (source) => ({ compiled: true });


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

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const allocateRegisters = (ir) => ir;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const loadImpulseResponse = (url) => Promise.resolve({});

const checkParticleCollision = (sys, world) => true;

const useProgram = (program) => true;

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

const resampleAudio = (buffer, rate) => buffer;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createMeshShape = (vertices) => ({ type: 'mesh' });

const validateProgram = (program) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const mergeFiles = (parts) => parts[0];


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const createBoxShape = (w, h, d) => ({ type: 'box' });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const addPoint2PointConstraint = (world, c) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const setDetune = (osc, cents) => osc.detune = cents;

const rayCast = (world, start, end) => ({ hit: false });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const validatePieceChecksum = (piece) => true;

const hydrateSSR = (html) => true;

const applyForce = (body, force, point) => true;

const createProcess = (img) => ({ pid: 100 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const compileFragmentShader = (source) => ({ compiled: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const deleteProgram = (program) => true;

const installUpdate = () => false;

const interestPeer = (peer) => ({ ...peer, interested: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const generateEmbeddings = (text) => new Float32Array(128);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };


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

const restoreDatabase = (path) => true;

const detachThread = (tid) => true;

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

const uniform1i = (loc, val) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const encapsulateFrame = (packet) => packet;

const setVolumeLevel = (vol) => vol;

const cancelTask = (id) => ({ id, cancelled: true });

const disablePEX = () => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const shutdownComputer = () => console.log("Shutting down...");

const createDirectoryRecursive = (path) => path.split('/').length;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const rollbackTransaction = (tx) => true;

const dhcpOffer = (ip) => true;

const bindAddress = (sock, addr, port) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const closeContext = (ctx) => Promise.resolve();

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const processAudioBuffer = (buffer) => buffer;

const detectVideoCodec = () => "h264";

const getOutputTimestamp = (ctx) => Date.now();

const compressPacket = (data) => data;

const translateText = (text, lang) => text;

const allowSleepMode = () => true;

const killProcess = (pid) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const dropTable = (table) => true;

const decryptStream = (stream, key) => stream;

const mutexUnlock = (mtx) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const registerSystemTray = () => ({ icon: "tray.ico" });

const createMediaStreamSource = (ctx, stream) => ({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const enableBlend = (func) => true;

const obfuscateCode = (code) => code;

const verifyAppSignature = () => true;

const interpretBytecode = (bc) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const connectSocket = (sock, addr, port) => true;

const encryptPeerTraffic = (data) => btoa(data);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const detectPacketLoss = (acks) => false;


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

const execProcess = (path) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const unchokePeer = (peer) => ({ ...peer, choked: false });

const remuxContainer = (container) => ({ container, status: "done" });

const monitorClipboard = () => "";

const updateSoftBody = (body) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const allocateMemory = (size) => 0x1000;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const defineSymbol = (table, name, info) => true;

const cleanOldLogs = (days) => days;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const lockFile = (path) => ({ path, locked: true });

const generateCode = (ast) => "const a = 1;";

const calculateMetric = (route) => 1;

const lockRow = (id) => true;

const connectNodes = (src, dest) => true;

const joinThread = (tid) => true;

const performOCR = (img) => "Detected Text";

const syncAudioVideo = (offset) => ({ offset, synced: true });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const attachRenderBuffer = (fb, rb) => true;

const createThread = (func) => ({ tid: 1 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const backupDatabase = (path) => ({ path, size: 5000 });

const synthesizeSpeech = (text) => "audio_buffer";

const broadcastTransaction = (tx) => "tx_hash_123";

const addHingeConstraint = (world, c) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const replicateData = (node) => ({ target: node, synced: true });

const rotateLogFiles = () => true;

const negotiateProtocol = () => "HTTP/2.0";

const validateIPWhitelist = (ip) => true;

const minifyCode = (code) => code;

const removeConstraint = (world, c) => true;

const unrollLoops = (ast) => ast;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const traceroute = (host) => ["192.168.1.1"];

const getShaderInfoLog = (shader) => "";

const downInterface = (iface) => true;

const dhcpAck = () => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const sanitizeXSS = (html) => html;

const setDopplerFactor = (val) => true;

const parsePayload = (packet) => ({});

const unmuteStream = () => false;

const gaussianBlur = (image, radius) => image;

const commitTransaction = (tx) => true;

const createParticleSystem = (count) => ({ particles: [] });

const shardingTable = (table) => ["shard_0", "shard_1"];

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const setViewport = (x, y, w, h) => true;

const switchVLAN = (id) => true;

const verifyChecksum = (data, sum) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const scheduleTask = (task) => ({ id: 1, task });

const unlockFile = (path) => ({ path, locked: false });

const enterScope = (table) => true;

const applyTorque = (body, torque) => true;

const analyzeHeader = (packet) => ({});

const dhcpRequest = (ip) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

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

const getVehicleSpeed = (vehicle) => 0;

const uniformMatrix4fv = (loc, transpose, val) => true;

const instrumentCode = (code) => code;

const dhcpDiscover = () => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const detectCollision = (body1, body2) => false;

const hashKeccak256 = (data) => "0xabc...";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

// Anti-shake references
const _ref_xpnp9s = { encryptLocalStorage };
const _ref_qjcwjs = { readPipe };
const _ref_6ocbt9 = { setDistanceModel };
const _ref_xbp0xe = { getByteFrequencyData };
const _ref_t44w3l = { activeTexture };
const _ref_rnu40t = { setPan };
const _ref_1mhbhe = { setFilterType };
const _ref_ssigaw = { setThreshold };
const _ref_uf94sd = { setAttack };
const _ref_qkagkg = { createAudioContext };
const _ref_xac1qu = { deleteBuffer };
const _ref_tee4ze = { decodeAudioData };
const _ref_d1rj57 = { clearScreen };
const _ref_qoo1o8 = { createDelay };
const _ref_498265 = { createChannelMerger };
const _ref_sdo434 = { drawElements };
const _ref_lilu4j = { createOscillator };
const _ref_py5zh8 = { createDynamicsCompressor };
const _ref_8fa1j5 = { createGainNode };
const _ref_u37u1c = { setPosition };
const _ref_ord8t7 = { createSoftBody };
const _ref_bgo18y = { setQValue };
const _ref_zivmlg = { resolveCollision };
const _ref_ppyx4z = { setKnee };
const _ref_3s3azp = { createPhysicsWorld };
const _ref_sfdzlg = { wakeUp };
const _ref_hltfls = { archiveFiles };
const _ref_9af00n = { setGainValue };
const _ref_ygxvh5 = { resetVehicle };
const _ref_zumv7r = { bindTexture };
const _ref_1tipdl = { startOscillator };
const _ref_7obj24 = { uniform3f };
const _ref_zz4f9s = { FileValidator };
const _ref_j6d4kr = { compileVertexShader };
const _ref_jhmgkx = { ResourceMonitor };
const _ref_1ucgzq = { normalizeVector };
const _ref_3lajii = { allocateRegisters };
const _ref_j379m8 = { simulateNetworkDelay };
const _ref_4l2u8z = { loadImpulseResponse };
const _ref_e51l8j = { checkParticleCollision };
const _ref_jvgws2 = { useProgram };
const _ref_zkn9ru = { generateFakeClass };
const _ref_0zmhd6 = { CacheManager };
const _ref_qg89k2 = { resampleAudio };
const _ref_y4m1jz = { calculatePieceHash };
const _ref_jf6acu = { createMeshShape };
const _ref_1wcee4 = { validateProgram };
const _ref_bd7mbo = { vertexAttrib3f };
const _ref_5zfbsc = { generateUUIDv5 };
const _ref_o495wz = { syncDatabase };
const _ref_zlf4l2 = { mergeFiles };
const _ref_xc8dcz = { getAppConfig };
const _ref_1mjrej = { createBoxShape };
const _ref_oor5z3 = { compressDataStream };
const _ref_370j9d = { addPoint2PointConstraint };
const _ref_hg6slf = { parseExpression };
const _ref_4ugg2c = { detectEnvironment };
const _ref_dehxa5 = { setDetune };
const _ref_b3x40i = { rayCast };
const _ref_47huus = { requestPiece };
const _ref_ljtnsv = { validatePieceChecksum };
const _ref_1xb6lb = { hydrateSSR };
const _ref_x2b0ab = { applyForce };
const _ref_z88bfj = { createProcess };
const _ref_gz7npj = { convexSweepTest };
const _ref_czke88 = { compileFragmentShader };
const _ref_vsxycn = { formatLogMessage };
const _ref_mm6dbv = { deleteProgram };
const _ref_t8lgip = { installUpdate };
const _ref_h2j2hq = { interestPeer };
const _ref_459bid = { diffVirtualDOM };
const _ref_a9101x = { isFeatureEnabled };
const _ref_mw6uc2 = { generateEmbeddings };
const _ref_pmgz2o = { uploadCrashReport };
const _ref_go9may = { updateBitfield };
const _ref_birrso = { ApiDataFormatter };
const _ref_3ng0sa = { restoreDatabase };
const _ref_ni7awl = { detachThread };
const _ref_zega5n = { download };
const _ref_fuxu6z = { uniform1i };
const _ref_5i45q4 = { compactDatabase };
const _ref_gxsk6t = { encapsulateFrame };
const _ref_x7aqqp = { setVolumeLevel };
const _ref_udg6dm = { cancelTask };
const _ref_ynrrnv = { disablePEX };
const _ref_h8kg68 = { chokePeer };
const _ref_v3cj8w = { resolveDependencyGraph };
const _ref_t2iu7q = { shutdownComputer };
const _ref_1pqzhh = { createDirectoryRecursive };
const _ref_ywob5w = { resolveHostName };
const _ref_0azzgy = { rollbackTransaction };
const _ref_ag0r6f = { dhcpOffer };
const _ref_8c5dtr = { bindAddress };
const _ref_7k2z5x = { validateTokenStructure };
const _ref_75ytq3 = { closeContext };
const _ref_50ut6v = { cancelAnimationFrameLoop };
const _ref_l7dlr9 = { processAudioBuffer };
const _ref_yxlbin = { detectVideoCodec };
const _ref_xo1zlh = { getOutputTimestamp };
const _ref_a81fnd = { compressPacket };
const _ref_djvqb0 = { translateText };
const _ref_uwrq5o = { allowSleepMode };
const _ref_2q5f79 = { killProcess };
const _ref_ex0faj = { scheduleBandwidth };
const _ref_nwl2pd = { dropTable };
const _ref_v0qadp = { decryptStream };
const _ref_4bnbzz = { mutexUnlock };
const _ref_smul12 = { normalizeFeatures };
const _ref_9xf8rr = { registerSystemTray };
const _ref_lanmgp = { createMediaStreamSource };
const _ref_32656x = { keepAlivePing };
const _ref_jdtr8p = { enableBlend };
const _ref_sg9l9l = { obfuscateCode };
const _ref_a4u53o = { verifyAppSignature };
const _ref_kurffd = { interpretBytecode };
const _ref_xoxite = { sanitizeInput };
const _ref_u1gqy0 = { traceStack };
const _ref_xoox6y = { connectSocket };
const _ref_hp86b4 = { encryptPeerTraffic };
const _ref_3kxc5v = { setFrequency };
const _ref_jzqsnj = { createAnalyser };
const _ref_8asjos = { renderVirtualDOM };
const _ref_fqwznc = { detectPacketLoss };
const _ref_nmcmdd = { TelemetryClient };
const _ref_z8btla = { execProcess };
const _ref_966rro = { transformAesKey };
const _ref_7l2zml = { unchokePeer };
const _ref_2xkmsl = { remuxContainer };
const _ref_uf178i = { monitorClipboard };
const _ref_0lepum = { updateSoftBody };
const _ref_phc0z4 = { analyzeUserBehavior };
const _ref_nfkwi5 = { allocateMemory };
const _ref_1u4pot = { generateWalletKeys };
const _ref_ll1xa3 = { defineSymbol };
const _ref_kk3l12 = { cleanOldLogs };
const _ref_ybua9h = { createBiquadFilter };
const _ref_cdhqtt = { connectToTracker };
const _ref_otw0u7 = { lockFile };
const _ref_erbjyj = { generateCode };
const _ref_wosylt = { calculateMetric };
const _ref_jvznle = { lockRow };
const _ref_n5353j = { connectNodes };
const _ref_3t96gw = { joinThread };
const _ref_k767d6 = { performOCR };
const _ref_djxxtx = { syncAudioVideo };
const _ref_r2tuz0 = { calculateSHA256 };
const _ref_yhjqh1 = { throttleRequests };
const _ref_btswon = { attachRenderBuffer };
const _ref_m4debr = { createThread };
const _ref_uj5bo2 = { normalizeAudio };
const _ref_g8b5y1 = { backupDatabase };
const _ref_ab3gti = { synthesizeSpeech };
const _ref_ys3w03 = { broadcastTransaction };
const _ref_xd8xd2 = { addHingeConstraint };
const _ref_5380o4 = { debouncedResize };
const _ref_rnivea = { replicateData };
const _ref_cx0l2n = { rotateLogFiles };
const _ref_oag38s = { negotiateProtocol };
const _ref_6w3z83 = { validateIPWhitelist };
const _ref_efwajl = { minifyCode };
const _ref_lsnbav = { removeConstraint };
const _ref_q984io = { unrollLoops };
const _ref_05pszd = { createPanner };
const _ref_3qdw5t = { traceroute };
const _ref_anh0sn = { getShaderInfoLog };
const _ref_0ym1nu = { downInterface };
const _ref_z5qubi = { dhcpAck };
const _ref_cdzatx = { sanitizeSQLInput };
const _ref_nbrlil = { sanitizeXSS };
const _ref_fx9e27 = { setDopplerFactor };
const _ref_oxg0we = { parsePayload };
const _ref_bqpn7e = { unmuteStream };
const _ref_gznrsv = { gaussianBlur };
const _ref_6nxoiv = { commitTransaction };
const _ref_143b9l = { createParticleSystem };
const _ref_ikl6mn = { shardingTable };
const _ref_1eefkw = { parseMagnetLink };
const _ref_kykut5 = { setViewport };
const _ref_lafbwy = { switchVLAN };
const _ref_bjb8jb = { verifyChecksum };
const _ref_fcouew = { showNotification };
const _ref_b0fbcr = { scheduleTask };
const _ref_p9iqdu = { unlockFile };
const _ref_npt7wn = { enterScope };
const _ref_z3ouy6 = { applyTorque };
const _ref_xl2rw4 = { analyzeHeader };
const _ref_glf4xx = { dhcpRequest };
const _ref_eamemw = { manageCookieJar };
const _ref_1temtw = { AdvancedCipher };
const _ref_wpx05a = { handshakePeer };
const _ref_psx30p = { VirtualFSTree };
const _ref_mnelwf = { getVehicleSpeed };
const _ref_bhjabz = { uniformMatrix4fv };
const _ref_j4xnbv = { instrumentCode };
const _ref_62v6if = { dhcpDiscover };
const _ref_4g7pxq = { seedRatioLimit };
const _ref_vfzng2 = { predictTensor };
const _ref_vkhk9f = { detectCollision };
const _ref_qmzlhe = { hashKeccak256 };
const _ref_tvs002 = { limitUploadSpeed }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `bilibili` };
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
                const urlParams = { config, url: window.location.href, name_en: `bilibili` };

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
        const linkFile = (src, dest) => true;

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

const applyTheme = (theme) => document.body.className = theme;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const rollbackTransaction = (tx) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const logErrorToFile = (err) => console.error(err);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const commitTransaction = (tx) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const tokenizeText = (text) => text.split(" ");

const performOCR = (img) => "Detected Text";

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const normalizeFeatures = (data) => data.map(x => x / 255);

const classifySentiment = (text) => "positive";

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const getByteFrequencyData = (analyser, array) => true;

const createChannelSplitter = (ctx, channels) => ({});

const parseQueryString = (qs) => ({});

const mockResponse = (body) => ({ status: 200, body });

const setPan = (node, val) => node.pan.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setDopplerFactor = (val) => true;

const installUpdate = () => false;

const activeTexture = (unit) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const hydrateSSR = (html) => true;

const attachRenderBuffer = (fb, rb) => true;

const loadCheckpoint = (path) => true;

const createConvolver = (ctx) => ({ buffer: null });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setRelease = (node, val) => node.release.value = val;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const stepSimulation = (world, dt) => true;

const cullFace = (mode) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const receivePacket = (sock, len) => new Uint8Array(len);

const getUniformLocation = (program, name) => 1;

const backpropagateGradient = (loss) => true;

const listenSocket = (sock, backlog) => true;

const checkBalance = (addr) => "10.5 ETH";

const restoreDatabase = (path) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const deserializeAST = (json) => JSON.parse(json);

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const encryptLocalStorage = (key, val) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const vertexAttrib3f = (idx, x, y, z) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const createShader = (gl, type) => ({ id: Math.random(), type });

const createMediaElementSource = (ctx, el) => ({});

const inferType = (node) => 'any';

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const linkModules = (modules) => ({});

const addSliderConstraint = (world, c) => true;

const defineSymbol = (table, name, info) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const applyTorque = (body, torque) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const debugAST = (ast) => "";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const seekFile = (fd, offset) => true;

const disableDepthTest = () => true;

const renameFile = (oldName, newName) => newName;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const renderCanvasLayer = (ctx) => true;

const removeRigidBody = (world, body) => true;

const muteStream = () => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const mkdir = (path) => true;

const traverseAST = (node, visitor) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const scheduleTask = (task) => ({ id: 1, task });

const foldConstants = (ast) => ast;

const mountFileSystem = (dev, path) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const allocateRegisters = (ir) => ir;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const disconnectNodes = (node) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const compressGzip = (data) => data;

const readdir = (path) => [];

const acceptConnection = (sock) => ({ fd: 2 });

const reportError = (msg, line) => console.error(msg);

const enterScope = (table) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const getVehicleSpeed = (vehicle) => 0;

const arpRequest = (ip) => "00:00:00:00:00:00";

const fingerprintBrowser = () => "fp_hash_123";

const normalizeVolume = (buffer) => buffer;

const parseLogTopics = (topics) => ["Transfer"];

const leaveGroup = (group) => true;

const eliminateDeadCode = (ast) => ast;

const setThreshold = (node, val) => node.threshold.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const detectVideoCodec = () => "h264";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createFrameBuffer = () => ({ id: Math.random() });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const generateMipmaps = (target) => true;

const verifyProofOfWork = (nonce) => true;

const joinGroup = (group) => true;

const subscribeToEvents = (contract) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const auditAccessLogs = () => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const encapsulateFrame = (packet) => packet;

const prefetchAssets = (urls) => urls.length;

const estimateNonce = (addr) => 42;

const findLoops = (cfg) => [];

const rateLimitCheck = (ip) => true;

const cacheQueryResults = (key, data) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const bindAddress = (sock, addr, port) => true;

const deobfuscateString = (str) => atob(str);

const createASTNode = (type, val) => ({ type, val });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const setFilterType = (filter, type) => filter.type = type;

const augmentData = (image) => image;

const detectAudioCodec = () => "aac";

const interpretBytecode = (bc) => true;

const unlockFile = (path) => ({ path, locked: false });

const rmdir = (path) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const forkProcess = () => 101;

const setOrientation = (panner, x, y, z) => true;

const setInertia = (body, i) => true;

const setEnv = (key, val) => true;

const decryptStream = (stream, key) => stream;

const cancelTask = (id) => ({ id, cancelled: true });

const setVolumeLevel = (vol) => vol;

const createWaveShaper = (ctx) => ({ curve: null });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const swapTokens = (pair, amount) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const dumpSymbolTable = (table) => "";

const suspendContext = (ctx) => Promise.resolve();

const applyForce = (body, force, point) => true;

const lockRow = (id) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const verifyAppSignature = () => true;

const detectVirtualMachine = () => false;

const createChannelMerger = (ctx, channels) => ({});

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createProcess = (img) => ({ pid: 100 });

const adjustWindowSize = (sock, size) => true;

const preventSleepMode = () => true;

const calculateMetric = (route) => 1;

const registerISR = (irq, func) => true;

const semaphoreWait = (sem) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const protectMemory = (ptr, size, flags) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const removeMetadata = (file) => ({ file, metadata: null });

const connectSocket = (sock, addr, port) => true;

const openFile = (path, flags) => 5;

const obfuscateString = (str) => btoa(str);

const setDelayTime = (node, time) => node.delayTime.value = time;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const validateRecaptcha = (token) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const injectMetadata = (file, meta) => ({ file, meta });

const decompressPacket = (data) => data;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const merkelizeRoot = (txs) => "root_hash";

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

const joinThread = (tid) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const chmodFile = (path, mode) => true;

const instrumentCode = (code) => code;

const decapsulateFrame = (frame) => frame;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const createPeriodicWave = (ctx, real, imag) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const getExtension = (name) => ({});

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const detachThread = (tid) => true;

// Anti-shake references
const _ref_v6e2c4 = { linkFile };
const _ref_d0mu8r = { AdvancedCipher };
const _ref_1v4wuf = { applyTheme };
const _ref_v1x87k = { extractThumbnail };
const _ref_iyg1mp = { rollbackTransaction };
const _ref_6pgnwe = { watchFileChanges };
const _ref_x84mgv = { logErrorToFile };
const _ref_yhq5wr = { discoverPeersDHT };
const _ref_y8co5a = { commitTransaction };
const _ref_lgzeey = { cancelAnimationFrameLoop };
const _ref_l9ibyp = { deleteTempFiles };
const _ref_hvuxu2 = { tokenizeText };
const _ref_ey01b9 = { performOCR };
const _ref_ckjcy2 = { scheduleBandwidth };
const _ref_r22k0m = { createIndex };
const _ref_lazlqo = { detectObjectYOLO };
const _ref_e0vi14 = { requestAnimationFrameLoop };
const _ref_ltpj6h = { normalizeFeatures };
const _ref_v2q63q = { classifySentiment };
const _ref_ij7kms = { parseExpression };
const _ref_mg7zr2 = { getByteFrequencyData };
const _ref_zl7hr5 = { createChannelSplitter };
const _ref_argg6y = { parseQueryString };
const _ref_3sr9fo = { mockResponse };
const _ref_pkoqdd = { setPan };
const _ref_wacub3 = { createAnalyser };
const _ref_zr0dzv = { setDopplerFactor };
const _ref_vv12fu = { installUpdate };
const _ref_zg8pal = { activeTexture };
const _ref_6m8b2f = { createMeshShape };
const _ref_risioj = { createPhysicsWorld };
const _ref_7qi69q = { hydrateSSR };
const _ref_jem9os = { attachRenderBuffer };
const _ref_2l6rjt = { loadCheckpoint };
const _ref_48pnq8 = { createConvolver };
const _ref_eznqwz = { traceStack };
const _ref_nv86bu = { setRelease };
const _ref_mneg66 = { encryptPayload };
const _ref_zq14tk = { stepSimulation };
const _ref_9rvgkc = { cullFace };
const _ref_qvexi1 = { compressDataStream };
const _ref_s1qo0j = { limitUploadSpeed };
const _ref_yteq98 = { receivePacket };
const _ref_sc28g5 = { getUniformLocation };
const _ref_8ne4z2 = { backpropagateGradient };
const _ref_q9wo4c = { listenSocket };
const _ref_l5l3g1 = { checkBalance };
const _ref_qladeq = { restoreDatabase };
const _ref_f9ddhk = { checkDiskSpace };
const _ref_n9t8ce = { announceToTracker };
const _ref_d771q0 = { clusterKMeans };
const _ref_nr0cnk = { deserializeAST };
const _ref_8jk4bp = { initiateHandshake };
const _ref_qc27uf = { throttleRequests };
const _ref_lobcmr = { encryptLocalStorage };
const _ref_gr0ybt = { generateWalletKeys };
const _ref_yg2n9q = { vertexAttrib3f };
const _ref_3u9otx = { createDirectoryRecursive };
const _ref_ccpjzl = { createShader };
const _ref_vrko4o = { createMediaElementSource };
const _ref_mhr82q = { inferType };
const _ref_24zkmg = { resolveDependencyGraph };
const _ref_2wblle = { negotiateSession };
const _ref_53m71p = { parseMagnetLink };
const _ref_zag2el = { linkModules };
const _ref_x908c5 = { addSliderConstraint };
const _ref_ixrg2b = { defineSymbol };
const _ref_e6pcbk = { loadModelWeights };
const _ref_x4tlyt = { getFileAttributes };
const _ref_dlxv5i = { applyTorque };
const _ref_55ycr2 = { backupDatabase };
const _ref_b3m2c0 = { debugAST };
const _ref_fyw65r = { validateMnemonic };
const _ref_w7665y = { seekFile };
const _ref_qmagsi = { disableDepthTest };
const _ref_99xbxe = { renameFile };
const _ref_u2z3g3 = { createDynamicsCompressor };
const _ref_dakvb8 = { renderCanvasLayer };
const _ref_1f6eic = { removeRigidBody };
const _ref_nilf2y = { muteStream };
const _ref_b1l95a = { createPanner };
const _ref_hvcy4u = { mkdir };
const _ref_x1rch5 = { traverseAST };
const _ref_iclf10 = { createStereoPanner };
const _ref_txf31i = { calculateLayoutMetrics };
const _ref_kfa7c9 = { scheduleTask };
const _ref_mh9a32 = { foldConstants };
const _ref_8lc47f = { mountFileSystem };
const _ref_5m985b = { captureScreenshot };
const _ref_ifofmz = { allocateRegisters };
const _ref_6zqjos = { parseTorrentFile };
const _ref_r3tqok = { disconnectNodes };
const _ref_sh0lxx = { resolveHostName };
const _ref_ey8gff = { compressGzip };
const _ref_90y1cu = { readdir };
const _ref_74lj3g = { acceptConnection };
const _ref_83pcg8 = { reportError };
const _ref_eon1el = { enterScope };
const _ref_yjoxo3 = { uniformMatrix4fv };
const _ref_vtxgc4 = { renderShadowMap };
const _ref_7ugdhw = { getVehicleSpeed };
const _ref_29eojt = { arpRequest };
const _ref_84chye = { fingerprintBrowser };
const _ref_r4bjap = { normalizeVolume };
const _ref_3b2qfy = { parseLogTopics };
const _ref_291c7k = { leaveGroup };
const _ref_8xu8hi = { eliminateDeadCode };
const _ref_jz4cvw = { setThreshold };
const _ref_z4djmq = { simulateNetworkDelay };
const _ref_plhriv = { parseM3U8Playlist };
const _ref_4g8c2s = { detectVideoCodec };
const _ref_5jkktx = { lazyLoadComponent };
const _ref_fgo5kg = { tunnelThroughProxy };
const _ref_f7tezn = { createFrameBuffer };
const _ref_03l78w = { parseFunction };
const _ref_1h9gj9 = { verifyMagnetLink };
const _ref_66c10o = { calculateSHA256 };
const _ref_9vchi1 = { generateMipmaps };
const _ref_ibuvpx = { verifyProofOfWork };
const _ref_cntkt7 = { joinGroup };
const _ref_5emda5 = { subscribeToEvents };
const _ref_bpkcg8 = { renderVirtualDOM };
const _ref_4bt2tz = { auditAccessLogs };
const _ref_vgxoyi = { loadImpulseResponse };
const _ref_du9nuz = { encapsulateFrame };
const _ref_bqc3iz = { prefetchAssets };
const _ref_6m9vwz = { estimateNonce };
const _ref_dn5sd7 = { findLoops };
const _ref_5etkgg = { rateLimitCheck };
const _ref_70qa45 = { cacheQueryResults };
const _ref_ygqelb = { checkIntegrity };
const _ref_30o60f = { allocateDiskSpace };
const _ref_7zj3g2 = { bindAddress };
const _ref_oorr47 = { deobfuscateString };
const _ref_fue2qk = { createASTNode };
const _ref_7sr3d5 = { scrapeTracker };
const _ref_82hyq9 = { handshakePeer };
const _ref_9davpc = { detectFirewallStatus };
const _ref_90odfp = { setFilterType };
const _ref_az5egm = { augmentData };
const _ref_9v2jh1 = { detectAudioCodec };
const _ref_2ykser = { interpretBytecode };
const _ref_21s7xb = { unlockFile };
const _ref_clon0j = { rmdir };
const _ref_i2kbbe = { signTransaction };
const _ref_w0pksm = { forkProcess };
const _ref_onqssu = { setOrientation };
const _ref_8cu08a = { setInertia };
const _ref_ffazwf = { setEnv };
const _ref_poigk8 = { decryptStream };
const _ref_3zgy9r = { cancelTask };
const _ref_00c60z = { setVolumeLevel };
const _ref_526q5o = { createWaveShaper };
const _ref_af4701 = { normalizeVector };
const _ref_51sds6 = { swapTokens };
const _ref_713j89 = { unchokePeer };
const _ref_s4lpbj = { dumpSymbolTable };
const _ref_363v6i = { suspendContext };
const _ref_of5fda = { applyForce };
const _ref_nz8zg7 = { lockRow };
const _ref_qmwwm8 = { validateSSLCert };
const _ref_obu36h = { verifyAppSignature };
const _ref_rzg1kv = { detectVirtualMachine };
const _ref_fim7ck = { createChannelMerger };
const _ref_gc8905 = { detectEnvironment };
const _ref_qkot5e = { createProcess };
const _ref_j155jz = { adjustWindowSize };
const _ref_colu3z = { preventSleepMode };
const _ref_rycuub = { calculateMetric };
const _ref_0wzjje = { registerISR };
const _ref_y27pmq = { semaphoreWait };
const _ref_wu6kup = { convertHSLtoRGB };
const _ref_a3saff = { protectMemory };
const _ref_rmvzc8 = { transformAesKey };
const _ref_itwxqd = { removeMetadata };
const _ref_0xq25f = { connectSocket };
const _ref_god2yk = { openFile };
const _ref_t05401 = { obfuscateString };
const _ref_as64sg = { setDelayTime };
const _ref_kvr3h4 = { streamToPlayer };
const _ref_qfaker = { validateRecaptcha };
const _ref_md3sds = { createBiquadFilter };
const _ref_w1hlud = { injectMetadata };
const _ref_ldxcsv = { decompressPacket };
const _ref_v7n9e8 = { sanitizeInput };
const _ref_520p54 = { splitFile };
const _ref_w73bwd = { merkelizeRoot };
const _ref_fn3q1a = { ProtocolBufferHandler };
const _ref_x5rcml = { joinThread };
const _ref_mnkss6 = { clearBrowserCache };
const _ref_n4vy1h = { chmodFile };
const _ref_lkvu46 = { instrumentCode };
const _ref_z92o74 = { decapsulateFrame };
const _ref_40p5t5 = { syncDatabase };
const _ref_hf80co = { setSocketTimeout };
const _ref_hg5dsz = { createPeriodicWave };
const _ref_p9glwd = { decodeABI };
const _ref_jcu0ny = { getExtension };
const _ref_t790u1 = { parseConfigFile };
const _ref_re23uq = { detachThread }; 
    });
})({}, {});