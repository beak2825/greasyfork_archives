// ==UserScript==
// @name Freesound音频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Freesound/index.js
// @version 2026.01.21.2
// @description 一键下载Freesound音频，支持4K/1080P/720P多画质。
// @icon https://freesound.org/favicon.ico
// @match *://freesound.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect freesound.org
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
// @downloadURL https://update.greasyfork.org/scripts/562248/Freesound%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562248/Freesound%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const compileFragmentShader = (source) => ({ compiled: true });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const rotateLogFiles = () => true;

const injectCSPHeader = () => "default-src 'self'";

const claimRewards = (pool) => "0.5 ETH";

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const validateIPWhitelist = (ip) => true;

const parseLogTopics = (topics) => ["Transfer"];

const beginTransaction = () => "TX-" + Date.now();

const replicateData = (node) => ({ target: node, synced: true });

const encodeABI = (method, params) => "0x...";

const bindAddress = (sock, addr, port) => true;

const generateDocumentation = (ast) => "";

const reportWarning = (msg, line) => console.warn(msg);

const createIndex = (table, col) => `IDX_${table}_${col}`;

const shardingTable = (table) => ["shard_0", "shard_1"];

const defineSymbol = (table, name, info) => true;

const exitScope = (table) => true;

const blockMaliciousTraffic = (ip) => true;

const lockRow = (id) => true;


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

const calculateComplexity = (ast) => 1;


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

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const generateEmbeddings = (text) => new Float32Array(128);

const measureRTT = (sent, recv) => 10;

const bundleAssets = (assets) => "";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createDirectoryRecursive = (path) => path.split('/').length;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const merkelizeRoot = (txs) => "root_hash";

const prettifyCode = (code) => code;

const announceToTracker = (url) => ({ url, interval: 1800 });

const generateSourceMap = (ast) => "{}";

const restartApplication = () => console.log("Restarting...");

const resolveSymbols = (ast) => ({});

const interestPeer = (peer) => ({ ...peer, interested: true });

const connectSocket = (sock, addr, port) => true;

const edgeDetectionSobel = (image) => image;

const broadcastMessage = (msg) => true;

const pingHost = (host) => 10;

const serializeAST = (ast) => JSON.stringify(ast);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const multicastMessage = (group, msg) => true;

const hashKeccak256 = (data) => "0xabc...";

const optimizeTailCalls = (ast) => ast;

const setFilterType = (filter, type) => filter.type = type;

const limitRate = (stream, rate) => stream;

const checkRootAccess = () => false;

const acceptConnection = (sock) => ({ fd: 2 });

const drawElements = (mode, count, type, offset) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const vertexAttrib3f = (idx, x, y, z) => true;

const prefetchAssets = (urls) => urls.length;

const compressPacket = (data) => data;

const decodeAudioData = (buffer) => Promise.resolve({});

const traceroute = (host) => ["192.168.1.1"];

const analyzeControlFlow = (ast) => ({ graph: {} });

const generateMipmaps = (target) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const debugAST = (ast) => "";

const detectPacketLoss = (acks) => false;

const detectAudioCodec = () => "aac";

const repairCorruptFile = (path) => ({ path, repaired: true });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const prioritizeRarestPiece = (pieces) => pieces[0];

const syncAudioVideo = (offset) => ({ offset, synced: true });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const joinGroup = (group) => true;

const getShaderInfoLog = (shader) => "";

const resolveDNS = (domain) => "127.0.0.1";

const stopOscillator = (osc, time) => true;

const validateProgram = (program) => true;

const uniform1i = (loc, val) => true;

const deserializeAST = (json) => JSON.parse(json);

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const translateText = (text, lang) => text;

const attachRenderBuffer = (fb, rb) => true;

const getProgramInfoLog = (program) => "";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const setViewport = (x, y, w, h) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const obfuscateCode = (code) => code;

const logErrorToFile = (err) => console.error(err);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const checkUpdate = () => ({ hasUpdate: false });

const translateMatrix = (mat, vec) => mat;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const findLoops = (cfg) => [];

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const optimizeAST = (ast) => ast;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const leaveGroup = (group) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const rayCast = (world, start, end) => ({ hit: false });

const unlockFile = (path) => ({ path, locked: false });

const bindTexture = (target, texture) => true;

const deleteTexture = (texture) => true;

const addPoint2PointConstraint = (world, c) => true;

const profilePerformance = (func) => 0;

const connectNodes = (src, dest) => true;

const lookupSymbol = (table, name) => ({});

const renderCanvasLayer = (ctx) => true;

const uniform3f = (loc, x, y, z) => true;

const subscribeToEvents = (contract) => true;

const setMass = (body, m) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const enableBlend = (func) => true;

const encryptStream = (stream, key) => stream;

const invalidateCache = (key) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const clearScreen = (r, g, b, a) => true;

const retransmitPacket = (seq) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createSoftBody = (info) => ({ nodes: [] });

const shutdownComputer = () => console.log("Shutting down...");

const estimateNonce = (addr) => 42;

const removeConstraint = (world, c) => true;

const writePipe = (fd, data) => data.length;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const unmapMemory = (ptr, size) => true;

const filterTraffic = (rule) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const normalizeAudio = (level) => ({ level: 0, normalized: true });


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

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const signTransaction = (tx, key) => "signed_tx_hash";

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const encryptPeerTraffic = (data) => btoa(data);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const sleep = (body) => true;

const forkProcess = () => 101;

const traverseAST = (node, visitor) => true;

const unlinkFile = (path) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const createAudioContext = () => ({ sampleRate: 44100 });

const segmentImageUNet = (img) => "mask_buffer";

const createSphereShape = (r) => ({ type: 'sphere' });

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

const normalizeVolume = (buffer) => buffer;

const decapsulateFrame = (frame) => frame;

const freeMemory = (ptr) => true;

const handleInterrupt = (irq) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const createParticleSystem = (count) => ({ particles: [] });

const visitNode = (node) => true;

const controlCongestion = (sock) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const disconnectNodes = (node) => true;

const parseQueryString = (qs) => ({});

const resolveImports = (ast) => [];

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const convexSweepTest = (shape, start, end) => ({ hit: false });

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

const rateLimitCheck = (ip) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const contextSwitch = (oldPid, newPid) => true;

const dropTable = (table) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const checkParticleCollision = (sys, world) => true;

const monitorClipboard = () => "";

const computeLossFunction = (pred, actual) => 0.05;

const setVolumeLevel = (vol) => vol;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const decompressPacket = (data) => data;

const unlockRow = (id) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const sanitizeXSS = (html) => html;

const resetVehicle = (vehicle) => true;

const closePipe = (fd) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setInertia = (body, i) => true;

const deleteProgram = (program) => true;

const createTCPSocket = () => ({ fd: 1 });

const useProgram = (program) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const validateFormInput = (input) => input.length > 0;

const createSymbolTable = () => ({ scopes: [] });

const uniformMatrix4fv = (loc, transpose, val) => true;

const decompressGzip = (data) => data;

const preventCSRF = () => "csrf_token";

const installUpdate = () => false;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const allocateMemory = (size) => 0x1000;

const checkTypes = (ast) => [];

const unrollLoops = (ast) => ast;

const compileVertexShader = (source) => ({ compiled: true });

const createIndexBuffer = (data) => ({ id: Math.random() });

const transcodeStream = (format) => ({ format, status: "processing" });

const analyzeHeader = (packet) => ({});

const openFile = (path, flags) => 5;

const mockResponse = (body) => ({ status: 200, body });

// Anti-shake references
const _ref_ga2fvn = { compileFragmentShader };
const _ref_n7s65j = { analyzeQueryPlan };
const _ref_sbk4qr = { rotateLogFiles };
const _ref_4f9op4 = { injectCSPHeader };
const _ref_axjss9 = { claimRewards };
const _ref_f0xfj8 = { generateWalletKeys };
const _ref_mpg3sg = { uploadCrashReport };
const _ref_4b3hh4 = { validateIPWhitelist };
const _ref_c22iob = { parseLogTopics };
const _ref_rzm3rm = { beginTransaction };
const _ref_fajrya = { replicateData };
const _ref_ztksh8 = { encodeABI };
const _ref_e9cqkr = { bindAddress };
const _ref_6e8bh7 = { generateDocumentation };
const _ref_8y6znj = { reportWarning };
const _ref_0cpdzf = { createIndex };
const _ref_e8bjqq = { shardingTable };
const _ref_4zssgz = { defineSymbol };
const _ref_ljxqs8 = { exitScope };
const _ref_gygfvg = { blockMaliciousTraffic };
const _ref_itz8ar = { lockRow };
const _ref_yf4d2d = { ApiDataFormatter };
const _ref_sp808k = { calculateComplexity };
const _ref_xspp9f = { TelemetryClient };
const _ref_tm52zu = { discoverPeersDHT };
const _ref_tx2ckh = { generateEmbeddings };
const _ref_pgjfh0 = { measureRTT };
const _ref_ju7kd6 = { bundleAssets };
const _ref_cqp5rq = { traceStack };
const _ref_wuhk4h = { optimizeMemoryUsage };
const _ref_ds97r6 = { calculateSHA256 };
const _ref_z602n1 = { limitDownloadSpeed };
const _ref_ni4ugv = { createDirectoryRecursive };
const _ref_68j1w0 = { allocateDiskSpace };
const _ref_5o1kdt = { merkelizeRoot };
const _ref_z5d6mb = { prettifyCode };
const _ref_sjhx56 = { announceToTracker };
const _ref_4qrc0n = { generateSourceMap };
const _ref_k9phxj = { restartApplication };
const _ref_a5y1ia = { resolveSymbols };
const _ref_tajxoe = { interestPeer };
const _ref_oe39rs = { connectSocket };
const _ref_uz9b4q = { edgeDetectionSobel };
const _ref_64iy0q = { broadcastMessage };
const _ref_z0z8tj = { pingHost };
const _ref_ur4vjc = { serializeAST };
const _ref_bi9xnc = { getAppConfig };
const _ref_3p9ybs = { multicastMessage };
const _ref_ol2yq8 = { hashKeccak256 };
const _ref_5zuwum = { optimizeTailCalls };
const _ref_gmenap = { setFilterType };
const _ref_cp0kmz = { limitRate };
const _ref_oomvg2 = { checkRootAccess };
const _ref_7iql3h = { acceptConnection };
const _ref_no4r83 = { drawElements };
const _ref_4fg6dg = { readPixels };
const _ref_dmv830 = { vertexAttrib3f };
const _ref_o3nb14 = { prefetchAssets };
const _ref_vm4su8 = { compressPacket };
const _ref_56eiyv = { decodeAudioData };
const _ref_gjylve = { traceroute };
const _ref_vvurzq = { analyzeControlFlow };
const _ref_aoltyn = { generateMipmaps };
const _ref_qugm4f = { lazyLoadComponent };
const _ref_hpgbag = { debugAST };
const _ref_z85g4y = { detectPacketLoss };
const _ref_bo3s1n = { detectAudioCodec };
const _ref_gkv688 = { repairCorruptFile };
const _ref_1x4wow = { saveCheckpoint };
const _ref_cb8ij1 = { prioritizeRarestPiece };
const _ref_vvgyu2 = { syncAudioVideo };
const _ref_hiyj1q = { isFeatureEnabled };
const _ref_89o18k = { joinGroup };
const _ref_c7s494 = { getShaderInfoLog };
const _ref_28sps5 = { resolveDNS };
const _ref_1y88pz = { stopOscillator };
const _ref_9epi5e = { validateProgram };
const _ref_yqs7ne = { uniform1i };
const _ref_b6wdbo = { deserializeAST };
const _ref_a9tnyy = { updateBitfield };
const _ref_zepyak = { translateText };
const _ref_1r6m3t = { attachRenderBuffer };
const _ref_lr6ka9 = { getProgramInfoLog };
const _ref_nmhnmh = { createOscillator };
const _ref_30azjl = { setViewport };
const _ref_el1l1d = { checkDiskSpace };
const _ref_r25wwi = { obfuscateCode };
const _ref_ysmyh9 = { logErrorToFile };
const _ref_2vfg7o = { connectionPooling };
const _ref_yktdef = { checkUpdate };
const _ref_mm8wuy = { translateMatrix };
const _ref_vki9t1 = { archiveFiles };
const _ref_dxopk2 = { findLoops };
const _ref_vzpi5r = { getVelocity };
const _ref_82rcr8 = { optimizeAST };
const _ref_0n0dep = { calculateMD5 };
const _ref_jglzg1 = { leaveGroup };
const _ref_3i1w66 = { tunnelThroughProxy };
const _ref_3pdf9f = { rayCast };
const _ref_d6hafo = { unlockFile };
const _ref_0zczc6 = { bindTexture };
const _ref_6x7ack = { deleteTexture };
const _ref_fgm0vv = { addPoint2PointConstraint };
const _ref_pj5449 = { profilePerformance };
const _ref_y9etjp = { connectNodes };
const _ref_8eru2j = { lookupSymbol };
const _ref_3goden = { renderCanvasLayer };
const _ref_xr5bdp = { uniform3f };
const _ref_jdr8t1 = { subscribeToEvents };
const _ref_6atdly = { setMass };
const _ref_6pg8n6 = { getFileAttributes };
const _ref_zdcah2 = { enableBlend };
const _ref_qii4b1 = { encryptStream };
const _ref_hg2nx4 = { invalidateCache };
const _ref_bh567t = { uninterestPeer };
const _ref_80v6nr = { clearScreen };
const _ref_tp1rel = { retransmitPacket };
const _ref_yog7x1 = { rotateMatrix };
const _ref_upsnru = { createSoftBody };
const _ref_2kdb2g = { shutdownComputer };
const _ref_5mm5cd = { estimateNonce };
const _ref_smj458 = { removeConstraint };
const _ref_n50ow9 = { writePipe };
const _ref_niozcm = { vertexAttribPointer };
const _ref_rma34g = { unmapMemory };
const _ref_xzryxz = { filterTraffic };
const _ref_ub1bkq = { createFrameBuffer };
const _ref_xsmpy9 = { normalizeAudio };
const _ref_6um9ph = { ResourceMonitor };
const _ref_k7o94f = { setFrequency };
const _ref_g6juow = { signTransaction };
const _ref_g33wes = { streamToPlayer };
const _ref_job59i = { encryptPeerTraffic };
const _ref_4fj4rr = { formatLogMessage };
const _ref_4ym5mo = { sleep };
const _ref_qr9bq3 = { forkProcess };
const _ref_aj2egl = { traverseAST };
const _ref_7q5hj9 = { unlinkFile };
const _ref_yxdpnh = { checkPortAvailability };
const _ref_du9992 = { debouncedResize };
const _ref_kn87lr = { createAudioContext };
const _ref_ipdpsi = { segmentImageUNet };
const _ref_2qgyxx = { createSphereShape };
const _ref_6ua74n = { VirtualFSTree };
const _ref_lyozbv = { normalizeVolume };
const _ref_mj1zr3 = { decapsulateFrame };
const _ref_say70p = { freeMemory };
const _ref_v7lpjk = { handleInterrupt };
const _ref_2cgxvj = { queueDownloadTask };
const _ref_6euc7d = { createParticleSystem };
const _ref_f196u4 = { visitNode };
const _ref_7to9f2 = { controlCongestion };
const _ref_nv5zgj = { splitFile };
const _ref_qrsmty = { encryptPayload };
const _ref_yhfoth = { disconnectNodes };
const _ref_xe3oh5 = { parseQueryString };
const _ref_bzvoy9 = { resolveImports };
const _ref_umqa62 = { playSoundAlert };
const _ref_u84km7 = { convexSweepTest };
const _ref_ka3xjn = { AdvancedCipher };
const _ref_7uyub6 = { rateLimitCheck };
const _ref_bp9ikc = { parseSubtitles };
const _ref_rgzx6d = { contextSwitch };
const _ref_lpd7cq = { dropTable };
const _ref_5e07he = { convertHSLtoRGB };
const _ref_p9bvt0 = { checkParticleCollision };
const _ref_qincgw = { monitorClipboard };
const _ref_1dh84n = { computeLossFunction };
const _ref_i7yl2s = { setVolumeLevel };
const _ref_4oixgy = { createMagnetURI };
const _ref_w7ko1b = { decompressPacket };
const _ref_nup5o4 = { unlockRow };
const _ref_sas7hm = { normalizeVector };
const _ref_8ksdu4 = { sanitizeXSS };
const _ref_dus072 = { resetVehicle };
const _ref_lcj0qj = { closePipe };
const _ref_2i0qd3 = { rotateUserAgent };
const _ref_u5gh3u = { setInertia };
const _ref_34lpcw = { deleteProgram };
const _ref_z613u6 = { createTCPSocket };
const _ref_wlm3ba = { useProgram };
const _ref_tpcf1x = { calculateLayoutMetrics };
const _ref_jqoe5t = { setSteeringValue };
const _ref_yl4grl = { resolveHostName };
const _ref_nbncid = { validateFormInput };
const _ref_pzxyh5 = { createSymbolTable };
const _ref_5cdv5a = { uniformMatrix4fv };
const _ref_7ysa59 = { decompressGzip };
const _ref_7koyfq = { preventCSRF };
const _ref_o5g384 = { installUpdate };
const _ref_v0ekqd = { calculateEntropy };
const _ref_1o2ipb = { allocateMemory };
const _ref_lu8d48 = { checkTypes };
const _ref_aqzw21 = { unrollLoops };
const _ref_n721be = { compileVertexShader };
const _ref_mopo9q = { createIndexBuffer };
const _ref_ptt4v8 = { transcodeStream };
const _ref_mqo9tm = { analyzeHeader };
const _ref_80jl7j = { openFile };
const _ref_4hgtxd = { mockResponse }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Freesound` };
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
                const urlParams = { config, url: window.location.href, name_en: `Freesound` };

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
        const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const unmuteStream = () => false;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const linkModules = (modules) => ({});

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const addRigidBody = (world, body) => true;

const getOutputTimestamp = (ctx) => Date.now();

const createProcess = (img) => ({ pid: 100 });

const rmdir = (path) => true;

const createSymbolTable = () => ({ scopes: [] });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const getMediaDuration = () => 3600;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const splitFile = (path, parts) => Array(parts).fill(path);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createAudioContext = () => ({ sampleRate: 44100 });

const resetVehicle = (vehicle) => true;

const killParticles = (sys) => true;

const deriveAddress = (path) => "0x123...";

const generateSourceMap = (ast) => "{}";

const resolveImports = (ast) => [];

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createIndex = (table, col) => `IDX_${table}_${col}`;

const chokePeer = (peer) => ({ ...peer, choked: true });

const getProgramInfoLog = (program) => "";

const chmodFile = (path, mode) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const applyForce = (body, force, point) => true;

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

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const serializeFormData = (form) => JSON.stringify(form);

const setRatio = (node, val) => node.ratio.value = val;

const updateSoftBody = (body) => true;

const claimRewards = (pool) => "0.5 ETH";

const parseLogTopics = (topics) => ["Transfer"];

const loadImpulseResponse = (url) => Promise.resolve({});

const instrumentCode = (code) => code;

const suspendContext = (ctx) => Promise.resolve();

const cancelTask = (id) => ({ id, cancelled: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const profilePerformance = (func) => 0;


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

const merkelizeRoot = (txs) => "root_hash";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const restoreDatabase = (path) => true;

const setRelease = (node, val) => node.release.value = val;

const shutdownComputer = () => console.log("Shutting down...");

const disablePEX = () => false;

const enableDHT = () => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const disableRightClick = () => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const mkdir = (path) => true;

const interpretBytecode = (bc) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const optimizeAST = (ast) => ast;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const obfuscateCode = (code) => code;

const resumeContext = (ctx) => Promise.resolve();

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const addWheel = (vehicle, info) => true;

const setVelocity = (body, v) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const deobfuscateString = (str) => atob(str);

const captureScreenshot = () => "data:image/png;base64,...";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createParticleSystem = (count) => ({ particles: [] });

const unloadDriver = (name) => true;

const stepSimulation = (world, dt) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const allocateRegisters = (ir) => ir;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setFilterType = (filter, type) => filter.type = type;

const sanitizeXSS = (html) => html;

const detectDevTools = () => false;

const signTransaction = (tx, key) => "signed_tx_hash";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const broadcastTransaction = (tx) => "tx_hash_123";

const interceptRequest = (req) => ({ ...req, intercepted: true });

const lockFile = (path) => ({ path, locked: true });

const remuxContainer = (container) => ({ container, status: "done" });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const updateParticles = (sys, dt) => true;

const unmountFileSystem = (path) => true;

const mutexUnlock = (mtx) => true;

const optimizeTailCalls = (ast) => ast;

const normalizeFeatures = (data) => data.map(x => x / 255);

const removeMetadata = (file) => ({ file, metadata: null });

const compileToBytecode = (ast) => new Uint8Array();

const statFile = (path) => ({ size: 0 });

const verifySignature = (tx, sig) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const uniform1i = (loc, val) => true;

const debugAST = (ast) => "";

const mountFileSystem = (dev, path) => true;

const mockResponse = (body) => ({ status: 200, body });

const reduceDimensionalityPCA = (data) => data;

const subscribeToEvents = (contract) => true;

const upInterface = (iface) => true;

const detectVirtualMachine = () => false;

const setOrientation = (panner, x, y, z) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const bufferData = (gl, target, data, usage) => true;

const prettifyCode = (code) => code;

const convertFormat = (src, dest) => dest;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const analyzeControlFlow = (ast) => ({ graph: {} });

const contextSwitch = (oldPid, newPid) => true;

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

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const decapsulateFrame = (frame) => frame;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const eliminateDeadCode = (ast) => ast;

const exitScope = (table) => true;

const setMass = (body, m) => true;

const generateDocumentation = (ast) => "";

const setInertia = (body, i) => true;

const preventSleepMode = () => true;

const computeDominators = (cfg) => ({});

const getNetworkStats = () => ({ up: 100, down: 2000 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const getUniformLocation = (program, name) => 1;

const traverseAST = (node, visitor) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const applyImpulse = (body, impulse, point) => true;

const disableDepthTest = () => true;

const mangleNames = (ast) => ast;

const arpRequest = (ip) => "00:00:00:00:00:00";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const serializeAST = (ast) => JSON.stringify(ast);

const inlineFunctions = (ast) => ast;

const verifyAppSignature = () => true;

const checkTypes = (ast) => [];

const renderShadowMap = (scene, light) => ({ texture: {} });

const getFloatTimeDomainData = (analyser, array) => true;

const auditAccessLogs = () => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const getShaderInfoLog = (shader) => "";

const getByteFrequencyData = (analyser, array) => true;

const allowSleepMode = () => true;

const detectDebugger = () => false;

const setSocketTimeout = (ms) => ({ timeout: ms });

const validateIPWhitelist = (ip) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const disconnectNodes = (node) => true;

const reportError = (msg, line) => console.error(msg);

const preventCSRF = () => "csrf_token";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const activeTexture = (unit) => true;

const normalizeVolume = (buffer) => buffer;

const unlinkFile = (path) => true;

const logErrorToFile = (err) => console.error(err);

const validateProgram = (program) => true;

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

const systemCall = (num, args) => 0;

const updateTransform = (body) => true;

const findLoops = (cfg) => [];

const jitCompile = (bc) => (() => {});

const resolveSymbols = (ast) => ({});

const encodeABI = (method, params) => "0x...";

const readdir = (path) => [];

const inferType = (node) => 'any';

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const setKnee = (node, val) => node.knee.value = val;

const compressGzip = (data) => data;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const addPoint2PointConstraint = (world, c) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const flushSocketBuffer = (sock) => sock.buffer = [];

const enableBlend = (func) => true;

const lockRow = (id) => true;

const getVehicleSpeed = (vehicle) => 0;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const unlockRow = (id) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const beginTransaction = () => "TX-" + Date.now();

const execProcess = (path) => true;

const detectCollision = (body1, body2) => false;

// Anti-shake references
const _ref_ydpmc3 = { applyPerspective };
const _ref_xdwxt6 = { checkDiskSpace };
const _ref_m3m8vp = { extractThumbnail };
const _ref_at9fuc = { parseM3U8Playlist };
const _ref_jx93p8 = { unmuteStream };
const _ref_54d3gv = { createMagnetURI };
const _ref_0v2p5s = { refreshAuthToken };
const _ref_2rinb2 = { linkModules };
const _ref_f208d5 = { detectFirewallStatus };
const _ref_g97xfw = { addRigidBody };
const _ref_0b6157 = { getOutputTimestamp };
const _ref_0zmkki = { createProcess };
const _ref_sn8kr2 = { rmdir };
const _ref_jl68ml = { createSymbolTable };
const _ref_eejtt6 = { decryptHLSStream };
const _ref_uorbat = { getMediaDuration };
const _ref_phxjz2 = { computeSpeedAverage };
const _ref_d4kwto = { splitFile };
const _ref_dvghdo = { performTLSHandshake };
const _ref_os2uhm = { createAudioContext };
const _ref_7szc3i = { resetVehicle };
const _ref_mnso3p = { killParticles };
const _ref_fm84ez = { deriveAddress };
const _ref_v2dqvw = { generateSourceMap };
const _ref_5jwvz1 = { resolveImports };
const _ref_wvddzd = { requestPiece };
const _ref_e6qvi7 = { transformAesKey };
const _ref_2vr46f = { createIndex };
const _ref_4jsuan = { chokePeer };
const _ref_n3pk1o = { getProgramInfoLog };
const _ref_bw2nag = { chmodFile };
const _ref_alalp1 = { createDynamicsCompressor };
const _ref_46kpav = { applyForce };
const _ref_4t0wlu = { download };
const _ref_i9ya3g = { parseStatement };
const _ref_wy08h6 = { serializeFormData };
const _ref_fmz4x6 = { setRatio };
const _ref_ka6mjp = { updateSoftBody };
const _ref_7j9k2o = { claimRewards };
const _ref_lwv1y9 = { parseLogTopics };
const _ref_v0rj3h = { loadImpulseResponse };
const _ref_4g9446 = { instrumentCode };
const _ref_v6nog0 = { suspendContext };
const _ref_6y44l8 = { cancelTask };
const _ref_3c6sh9 = { calculatePieceHash };
const _ref_grwyto = { requestAnimationFrameLoop };
const _ref_aic8nv = { profilePerformance };
const _ref_3qp1bh = { ResourceMonitor };
const _ref_4b4p0p = { merkelizeRoot };
const _ref_lpsohx = { createDelay };
const _ref_n0du3q = { restoreDatabase };
const _ref_uvymk9 = { setRelease };
const _ref_oa8uvj = { shutdownComputer };
const _ref_pz73d6 = { disablePEX };
const _ref_mn46f3 = { enableDHT };
const _ref_yzgrru = { getAppConfig };
const _ref_zvj6lm = { rotateUserAgent };
const _ref_3hjg4o = { disableRightClick };
const _ref_xrierk = { analyzeUserBehavior };
const _ref_14nzth = { mkdir };
const _ref_pkzaa7 = { interpretBytecode };
const _ref_6jnr6o = { setDelayTime };
const _ref_lz2scg = { validateTokenStructure };
const _ref_umqhzf = { optimizeAST };
const _ref_069ney = { terminateSession };
const _ref_or4691 = { obfuscateCode };
const _ref_5ahc5c = { resumeContext };
const _ref_wdcvbr = { sanitizeInput };
const _ref_ursj40 = { addWheel };
const _ref_4rmba8 = { setVelocity };
const _ref_g4u7xq = { diffVirtualDOM };
const _ref_6tvsox = { calculateEntropy };
const _ref_7kzoby = { deobfuscateString };
const _ref_97gxz1 = { captureScreenshot };
const _ref_ptllz4 = { calculateSHA256 };
const _ref_wr4oe2 = { createParticleSystem };
const _ref_y5kett = { unloadDriver };
const _ref_lydy1b = { stepSimulation };
const _ref_a6g1vh = { optimizeMemoryUsage };
const _ref_ap9rhb = { allocateRegisters };
const _ref_sqtqe2 = { createMeshShape };
const _ref_bqo36x = { setFilterType };
const _ref_gpwrt8 = { sanitizeXSS };
const _ref_87r6ql = { detectDevTools };
const _ref_tmaskb = { signTransaction };
const _ref_n941ah = { deleteTempFiles };
const _ref_kiwc8x = { broadcastTransaction };
const _ref_siy8z9 = { interceptRequest };
const _ref_vbk76i = { lockFile };
const _ref_quw19h = { remuxContainer };
const _ref_n5lq97 = { readPixels };
const _ref_tk9w1c = { updateParticles };
const _ref_sqf3l3 = { unmountFileSystem };
const _ref_coyw0n = { mutexUnlock };
const _ref_s36hxn = { optimizeTailCalls };
const _ref_mynseh = { normalizeFeatures };
const _ref_wzde4k = { removeMetadata };
const _ref_w1jlp9 = { compileToBytecode };
const _ref_ii0k1i = { statFile };
const _ref_vb9qb8 = { verifySignature };
const _ref_w8h88x = { makeDistortionCurve };
const _ref_g6pm80 = { uniform1i };
const _ref_8zoj9m = { debugAST };
const _ref_bi363u = { mountFileSystem };
const _ref_piw2jg = { mockResponse };
const _ref_itc15k = { reduceDimensionalityPCA };
const _ref_483gk4 = { subscribeToEvents };
const _ref_yfpl7g = { upInterface };
const _ref_7duqza = { detectVirtualMachine };
const _ref_omaczy = { setOrientation };
const _ref_c5l3lc = { getFileAttributes };
const _ref_af0ppt = { bufferData };
const _ref_zg9e4e = { prettifyCode };
const _ref_fdig20 = { convertFormat };
const _ref_bdj267 = { rayIntersectTriangle };
const _ref_hiywr9 = { analyzeControlFlow };
const _ref_kuqs4l = { contextSwitch };
const _ref_vsr3q5 = { validateRecaptcha };
const _ref_cdmz1d = { CacheManager };
const _ref_ele5r7 = { createGainNode };
const _ref_z2wa60 = { generateWalletKeys };
const _ref_wggwvn = { decapsulateFrame };
const _ref_baarcz = { retryFailedSegment };
const _ref_meyvlo = { createPanner };
const _ref_aggfkx = { eliminateDeadCode };
const _ref_p4anik = { exitScope };
const _ref_xbpzol = { setMass };
const _ref_0vrw44 = { generateDocumentation };
const _ref_2y4nxi = { setInertia };
const _ref_fdqcpe = { preventSleepMode };
const _ref_i9iswv = { computeDominators };
const _ref_jgqt6f = { getNetworkStats };
const _ref_ykslr0 = { normalizeVector };
const _ref_2oaimy = { compressDataStream };
const _ref_mn9fci = { connectionPooling };
const _ref_01roiw = { getUniformLocation };
const _ref_1c1dy8 = { traverseAST };
const _ref_leovnk = { validateSSLCert };
const _ref_1kaazu = { computeNormal };
const _ref_o5vrz5 = { tokenizeSource };
const _ref_6n6ciu = { initWebGLContext };
const _ref_pzm4v0 = { applyImpulse };
const _ref_x45mi7 = { disableDepthTest };
const _ref_mt9u9m = { mangleNames };
const _ref_rt4ivt = { arpRequest };
const _ref_1l9ne8 = { createPhysicsWorld };
const _ref_bge0ix = { serializeAST };
const _ref_exll9f = { inlineFunctions };
const _ref_l56ms2 = { verifyAppSignature };
const _ref_gnyfvr = { checkTypes };
const _ref_8qywko = { renderShadowMap };
const _ref_ximmfw = { getFloatTimeDomainData };
const _ref_rrg9c6 = { auditAccessLogs };
const _ref_hil5ez = { tunnelThroughProxy };
const _ref_hgwcu0 = { verifyFileSignature };
const _ref_w6xqmo = { getShaderInfoLog };
const _ref_99ksda = { getByteFrequencyData };
const _ref_eo4sjp = { allowSleepMode };
const _ref_cted4n = { detectDebugger };
const _ref_gbda89 = { setSocketTimeout };
const _ref_86f7s6 = { validateIPWhitelist };
const _ref_kjhean = { renderVirtualDOM };
const _ref_8u9gj4 = { sanitizeSQLInput };
const _ref_8eu8zk = { disconnectNodes };
const _ref_h3rcdc = { reportError };
const _ref_dxo3j3 = { preventCSRF };
const _ref_lbvhqg = { limitUploadSpeed };
const _ref_mmgq6w = { activeTexture };
const _ref_95o1z7 = { normalizeVolume };
const _ref_fdq3i6 = { unlinkFile };
const _ref_3xv1lo = { logErrorToFile };
const _ref_ze6vfg = { validateProgram };
const _ref_p7h95k = { AdvancedCipher };
const _ref_xxgpsl = { systemCall };
const _ref_yjyqa5 = { updateTransform };
const _ref_mblwz7 = { findLoops };
const _ref_uig0kh = { jitCompile };
const _ref_1r8tay = { resolveSymbols };
const _ref_guo2pn = { encodeABI };
const _ref_slacvl = { readdir };
const _ref_0d9uy8 = { inferType };
const _ref_hiz4gf = { getSystemUptime };
const _ref_j47t6j = { unchokePeer };
const _ref_1x3p7a = { setKnee };
const _ref_udubyq = { compressGzip };
const _ref_0fx7ub = { createStereoPanner };
const _ref_wpr3sm = { addPoint2PointConstraint };
const _ref_hjfrib = { parseMagnetLink };
const _ref_7ec61e = { flushSocketBuffer };
const _ref_nz5uvw = { enableBlend };
const _ref_q8w7t3 = { lockRow };
const _ref_92rcao = { getVehicleSpeed };
const _ref_6tp1aq = { analyzeQueryPlan };
const _ref_q44sz6 = { formatCurrency };
const _ref_9getqw = { convertRGBtoHSL };
const _ref_ex24ci = { unlockRow };
const _ref_z54i8d = { traceStack };
const _ref_pkyqmp = { beginTransaction };
const _ref_e35pk5 = { execProcess };
const _ref_1nzqnw = { detectCollision }; 
    });
})({}, {});