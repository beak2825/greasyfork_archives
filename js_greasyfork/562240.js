// ==UserScript==
// @name CanalAlpha视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/CanalAlpha/index.js
// @version 2026.01.10
// @description 一键下载CanalAlpha视频，支持4K/1080P/720P多画质。
// @icon https://www.canalalpha.ch/favicon.ico
// @match *://*.canalalpha.ch/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect canalalpha.ch
// @connect vod2.infomaniak.com
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
// @downloadURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562240/CanalAlpha%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        
        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const downInterface = (iface) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const applyForce = (body, force, point) => true;

const removeConstraint = (world, c) => true;

const setAngularVelocity = (body, v) => true;

const createConstraint = (body1, body2) => ({});

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const setMass = (body, m) => true;


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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const preventCSRF = () => "csrf_token";

const setThreshold = (node, val) => node.threshold.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const announceToTracker = (url) => ({ url, interval: 1800 });

const useProgram = (program) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const getExtension = (name) => ({});

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const stopOscillator = (osc, time) => true;

const rateLimitCheck = (ip) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const updateSoftBody = (body) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const compileFragmentShader = (source) => ({ compiled: true });

const foldConstants = (ast) => ast;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const decodeAudioData = (buffer) => Promise.resolve({});

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const clearScreen = (r, g, b, a) => true;

const dumpSymbolTable = (table) => "";

const updateWheelTransform = (wheel) => true;

const reduceDimensionalityPCA = (data) => data;

const lockFile = (path) => ({ path, locked: true });

const reportError = (msg, line) => console.error(msg);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setGravity = (world, g) => world.gravity = g;

const minifyCode = (code) => code;

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

const createDirectoryRecursive = (path) => path.split('/').length;

const decryptStream = (stream, key) => stream;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const inlineFunctions = (ast) => ast;

const startOscillator = (osc, time) => true;

const deserializeAST = (json) => JSON.parse(json);

const interceptRequest = (req) => ({ ...req, intercepted: true });

const updateTransform = (body) => true;

const filterTraffic = (rule) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const postProcessBloom = (image, threshold) => image;

const attachRenderBuffer = (fb, rb) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validatePieceChecksum = (piece) => true;

const setVelocity = (body, v) => true;

const auditAccessLogs = () => true;

const exitScope = (table) => true;

const checkTypes = (ast) => [];

const joinGroup = (group) => true;

const computeDominators = (cfg) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const profilePerformance = (func) => 0;

const resampleAudio = (buffer, rate) => buffer;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const deobfuscateString = (str) => atob(str);

const lookupSymbol = (table, name) => ({});

const visitNode = (node) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const connectSocket = (sock, addr, port) => true;

const decompressGzip = (data) => data;

const setGainValue = (node, val) => node.gain.value = val;

const receivePacket = (sock, len) => new Uint8Array(len);

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setEnv = (key, val) => true;

const checkUpdate = () => ({ hasUpdate: false });

const setOrientation = (panner, x, y, z) => true;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const checkIntegrityConstraint = (table) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const spoofReferer = () => "https://google.com";

const generateSourceMap = (ast) => "{}";

const defineSymbol = (table, name, info) => true;

const validateRecaptcha = (token) => true;

const unlockFile = (path) => ({ path, locked: false });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setInertia = (body, i) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const applyTorque = (body, torque) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const scheduleTask = (task) => ({ id: 1, task });

const hoistVariables = (ast) => ast;

const limitRate = (stream, rate) => stream;

const detectDebugger = () => false;

const createConvolver = (ctx) => ({ buffer: null });

const contextSwitch = (oldPid, newPid) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const applyImpulse = (body, impulse, point) => true;

const allocateMemory = (size) => 0x1000;

const switchVLAN = (id) => true;

const disablePEX = () => false;

const setAttack = (node, val) => node.attack.value = val;

const adjustWindowSize = (sock, size) => true;

const semaphoreSignal = (sem) => true;

const resolveImports = (ast) => [];

const suspendContext = (ctx) => Promise.resolve();

const prioritizeRarestPiece = (pieces) => pieces[0];

const establishHandshake = (sock) => true;

const chmodFile = (path, mode) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const setMTU = (iface, mtu) => true;


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

const edgeDetectionSobel = (image) => image;

const calculateGasFee = (limit) => limit * 20;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const getUniformLocation = (program, name) => 1;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const freeMemory = (ptr) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const addHingeConstraint = (world, c) => true;

const calculateComplexity = (ast) => 1;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const cleanOldLogs = (days) => days;

const writePipe = (fd, data) => data.length;

const generateDocumentation = (ast) => "";


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const createWaveShaper = (ctx) => ({ curve: null });

const disableDepthTest = () => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const openFile = (path, flags) => 5;

const readdir = (path) => [];

const anchorSoftBody = (soft, rigid) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setRelease = (node, val) => node.release.value = val;

const instrumentCode = (code) => code;

const blockMaliciousTraffic = (ip) => true;

const mockResponse = (body) => ({ status: 200, body });

const createSymbolTable = () => ({ scopes: [] });

const dhcpAck = () => true;

const stepSimulation = (world, dt) => true;

const detectVirtualMachine = () => false;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const addGeneric6DofConstraint = (world, c) => true;

const addSliderConstraint = (world, c) => true;

const createListener = (ctx) => ({});

const unlockRow = (id) => true;

const jitCompile = (bc) => (() => {});

const configureInterface = (iface, config) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const setPan = (node, val) => node.pan.value = val;

const uniform1i = (loc, val) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const bindTexture = (target, texture) => true;

const resolveCollision = (manifold) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

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

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const analyzeControlFlow = (ast) => ({ graph: {} });

const bufferData = (gl, target, data, usage) => true;

const verifySignature = (tx, sig) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const logErrorToFile = (err) => console.error(err);

const reassemblePacket = (fragments) => fragments[0];

const disableInterrupts = () => true;

const wakeUp = (body) => true;

const leaveGroup = (group) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const calculateFriction = (mat1, mat2) => 0.5;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const mutexUnlock = (mtx) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const panicKernel = (msg) => false;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const createIndexBuffer = (data) => ({ id: Math.random() });

const disableRightClick = () => true;

const closeFile = (fd) => true;

const decapsulateFrame = (frame) => frame;

const setDetune = (osc, cents) => osc.detune = cents;

const createTCPSocket = () => ({ fd: 1 });

const chownFile = (path, uid, gid) => true;

const obfuscateString = (str) => btoa(str);

const detectDevTools = () => false;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const unrollLoops = (ast) => ast;

const resolveDNS = (domain) => "127.0.0.1";

const rotateLogFiles = () => true;

const updateRoutingTable = (entry) => true;

// Anti-shake references
const _ref_8bh317 = { transformAesKey };
const _ref_afzm9m = { downInterface };
const _ref_g45d81 = { loadImpulseResponse };
const _ref_yrcraw = { applyForce };
const _ref_z8vu9h = { removeConstraint };
const _ref_rcrdtb = { setAngularVelocity };
const _ref_5oqphm = { createConstraint };
const _ref_25klyw = { tokenizeSource };
const _ref_stn0j4 = { setMass };
const _ref_2hlh4o = { ResourceMonitor };
const _ref_pgzw2y = { renderVirtualDOM };
const _ref_zno68y = { preventCSRF };
const _ref_586vda = { setThreshold };
const _ref_2r1sqq = { createAnalyser };
const _ref_ifz0w1 = { announceToTracker };
const _ref_27ns5z = { useProgram };
const _ref_tk075s = { normalizeFeatures };
const _ref_g1r5uv = { limitBandwidth };
const _ref_o5pnhq = { resolveHostName };
const _ref_bu6v33 = { getExtension };
const _ref_awgo0h = { createStereoPanner };
const _ref_akzzzw = { initiateHandshake };
const _ref_5dlqsv = { stopOscillator };
const _ref_6h4c0e = { rateLimitCheck };
const _ref_eege4k = { createDynamicsCompressor };
const _ref_63hlws = { saveCheckpoint };
const _ref_zq250c = { updateSoftBody };
const _ref_11yc1i = { parseMagnetLink };
const _ref_qu4uok = { compileFragmentShader };
const _ref_zslw1t = { foldConstants };
const _ref_uac2ox = { validateTokenStructure };
const _ref_uwbki1 = { decodeAudioData };
const _ref_iap4jr = { keepAlivePing };
const _ref_sv7uyy = { clearScreen };
const _ref_vi4gpu = { dumpSymbolTable };
const _ref_4gjh3u = { updateWheelTransform };
const _ref_n07phu = { reduceDimensionalityPCA };
const _ref_6sdnq4 = { lockFile };
const _ref_60qs5y = { reportError };
const _ref_60z16y = { requestPiece };
const _ref_1bh404 = { setGravity };
const _ref_r0q61g = { minifyCode };
const _ref_855tb6 = { download };
const _ref_rwh64e = { TelemetryClient };
const _ref_qtbjvy = { createDirectoryRecursive };
const _ref_2nsdp6 = { decryptStream };
const _ref_u7zwga = { generateUUIDv5 };
const _ref_rvmsn2 = { inlineFunctions };
const _ref_hf6fuk = { startOscillator };
const _ref_564hl0 = { deserializeAST };
const _ref_iqsmjd = { interceptRequest };
const _ref_0n27fs = { updateTransform };
const _ref_v7s0j3 = { filterTraffic };
const _ref_zwp4lp = { createFrameBuffer };
const _ref_4ccmzm = { postProcessBloom };
const _ref_njnjam = { attachRenderBuffer };
const _ref_vxq4no = { FileValidator };
const _ref_1t5cvx = { validatePieceChecksum };
const _ref_qgcljj = { setVelocity };
const _ref_84ayrz = { auditAccessLogs };
const _ref_tt83tx = { exitScope };
const _ref_f3s3rd = { checkTypes };
const _ref_337nap = { joinGroup };
const _ref_curvoh = { computeDominators };
const _ref_16fuow = { decodeABI };
const _ref_xn246p = { profilePerformance };
const _ref_z0fdtr = { resampleAudio };
const _ref_xvkkgn = { rotateUserAgent };
const _ref_plhobg = { deobfuscateString };
const _ref_93h3a8 = { lookupSymbol };
const _ref_kqfydk = { visitNode };
const _ref_gkcm15 = { detectEnvironment };
const _ref_lch871 = { connectSocket };
const _ref_hh842w = { decompressGzip };
const _ref_u3h6li = { setGainValue };
const _ref_3y0uji = { receivePacket };
const _ref_onidz8 = { watchFileChanges };
const _ref_4n3xkz = { setEnv };
const _ref_s3cszg = { checkUpdate };
const _ref_lyhxzn = { setOrientation };
const _ref_63xts2 = { verifyMagnetLink };
const _ref_duhg0k = { checkIntegrityConstraint };
const _ref_1iroid = { calculateEntropy };
const _ref_8x7dze = { spoofReferer };
const _ref_23735w = { generateSourceMap };
const _ref_qstcl5 = { defineSymbol };
const _ref_zyicw8 = { validateRecaptcha };
const _ref_4kmmx2 = { unlockFile };
const _ref_b2461t = { createCapsuleShape };
const _ref_hbz6wh = { setInertia };
const _ref_sow8lv = { throttleRequests };
const _ref_dk55at = { applyTorque };
const _ref_p3afsd = { autoResumeTask };
const _ref_7up07a = { scheduleTask };
const _ref_8bcewr = { hoistVariables };
const _ref_94ppjt = { limitRate };
const _ref_1exic3 = { detectDebugger };
const _ref_r1j1xz = { createConvolver };
const _ref_dxa22e = { contextSwitch };
const _ref_nllzwj = { connectionPooling };
const _ref_m9s499 = { applyImpulse };
const _ref_brgovd = { allocateMemory };
const _ref_cn6cgj = { switchVLAN };
const _ref_irzjme = { disablePEX };
const _ref_z0dhjy = { setAttack };
const _ref_93zvhn = { adjustWindowSize };
const _ref_9cwqv6 = { semaphoreSignal };
const _ref_5sqgy4 = { resolveImports };
const _ref_ehqnni = { suspendContext };
const _ref_0g96mc = { prioritizeRarestPiece };
const _ref_vtvs9v = { establishHandshake };
const _ref_0gzxf8 = { chmodFile };
const _ref_i3420x = { switchProxyServer };
const _ref_4vf5qs = { computeNormal };
const _ref_5t52te = { limitUploadSpeed };
const _ref_piqqp8 = { setMTU };
const _ref_shr31e = { CacheManager };
const _ref_8auywm = { edgeDetectionSobel };
const _ref_co6hcf = { calculateGasFee };
const _ref_0bsai6 = { seedRatioLimit };
const _ref_jo5h3a = { getUniformLocation };
const _ref_yp611j = { manageCookieJar };
const _ref_77ah9v = { freeMemory };
const _ref_5ggtrc = { simulateNetworkDelay };
const _ref_6c5hca = { optimizeHyperparameters };
const _ref_vvsuyf = { addHingeConstraint };
const _ref_iypilb = { calculateComplexity };
const _ref_3ae7r1 = { encryptPayload };
const _ref_dua6y0 = { cleanOldLogs };
const _ref_0ala6a = { writePipe };
const _ref_9bzrcv = { generateDocumentation };
const _ref_exbw2b = { isFeatureEnabled };
const _ref_txhteh = { createWaveShaper };
const _ref_fr8d3n = { disableDepthTest };
const _ref_t2klor = { calculateMD5 };
const _ref_dak6wf = { openFile };
const _ref_534z1e = { readdir };
const _ref_9qzbw0 = { anchorSoftBody };
const _ref_daaidr = { optimizeMemoryUsage };
const _ref_bk0rkf = { setRelease };
const _ref_94h7t0 = { instrumentCode };
const _ref_tia64c = { blockMaliciousTraffic };
const _ref_cls59g = { mockResponse };
const _ref_2i2c65 = { createSymbolTable };
const _ref_jibsyq = { dhcpAck };
const _ref_e9hx6x = { stepSimulation };
const _ref_kl2oy4 = { detectVirtualMachine };
const _ref_9s4fg4 = { unchokePeer };
const _ref_exda1a = { addGeneric6DofConstraint };
const _ref_zkjnld = { addSliderConstraint };
const _ref_i7c7u9 = { createListener };
const _ref_6tzkml = { unlockRow };
const _ref_rxq3l8 = { jitCompile };
const _ref_w682mg = { configureInterface };
const _ref_e4mhxc = { diffVirtualDOM };
const _ref_go7347 = { moveFileToComplete };
const _ref_zp1dri = { setPan };
const _ref_7imsqo = { uniform1i };
const _ref_dw1inq = { parseClass };
const _ref_hyvuef = { bindTexture };
const _ref_8r75k8 = { resolveCollision };
const _ref_fxljvt = { debounceAction };
const _ref_cwx2ln = { loadModelWeights };
const _ref_16e2la = { predictTensor };
const _ref_dx6emh = { normalizeVector };
const _ref_6f59bt = { syncDatabase };
const _ref_bwg6aq = { initWebGLContext };
const _ref_op7sre = { AdvancedCipher };
const _ref_x1hcpo = { parseTorrentFile };
const _ref_9sigh8 = { analyzeControlFlow };
const _ref_jd2skg = { bufferData };
const _ref_bdzwts = { verifySignature };
const _ref_ue1v09 = { loadTexture };
const _ref_rra4jd = { logErrorToFile };
const _ref_gu1acc = { reassemblePacket };
const _ref_zgs3d8 = { disableInterrupts };
const _ref_qb09pe = { wakeUp };
const _ref_8olef9 = { leaveGroup };
const _ref_530j1m = { detectFirewallStatus };
const _ref_7hlvq8 = { calculateFriction };
const _ref_cu6e8i = { clearBrowserCache };
const _ref_xalvc9 = { mutexUnlock };
const _ref_pw8goq = { discoverPeersDHT };
const _ref_lqsoli = { resolveDNSOverHTTPS };
const _ref_s44kmt = { panicKernel };
const _ref_uf0fba = { lazyLoadComponent };
const _ref_0ezsc8 = { createIndexBuffer };
const _ref_n37vwy = { disableRightClick };
const _ref_1dx5wo = { closeFile };
const _ref_alob32 = { decapsulateFrame };
const _ref_11fpdj = { setDetune };
const _ref_tuyhtd = { createTCPSocket };
const _ref_o1n88e = { chownFile };
const _ref_6ppqs9 = { obfuscateString };
const _ref_juw26k = { detectDevTools };
const _ref_veo68d = { checkIntegrity };
const _ref_5t6r2k = { unrollLoops };
const _ref_282hu1 = { resolveDNS };
const _ref_wdol9g = { rotateLogFiles };
const _ref_7dqom4 = { updateRoutingTable }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `CanalAlpha` };
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
                const urlParams = { config, url: window.location.href, name_en: `CanalAlpha` };

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
        const addGeneric6DofConstraint = (world, c) => true;

const addWheel = (vehicle, info) => true;

const sendPacket = (sock, data) => data.length;

const deserializeAST = (json) => JSON.parse(json);

const reportWarning = (msg, line) => console.warn(msg);

const minifyCode = (code) => code;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const unloadDriver = (name) => true;

const statFile = (path) => ({ size: 0 });

const closeFile = (fd) => true;

const enableInterrupts = () => true;

const mkdir = (path) => true;

const readFile = (fd, len) => "";

const visitNode = (node) => true;

const mutexLock = (mtx) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const foldConstants = (ast) => ast;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const semaphoreSignal = (sem) => true;

const compressPacket = (data) => data;

const rayCast = (world, start, end) => ({ hit: false });

const detectPacketLoss = (acks) => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const chdir = (path) => true;

const upInterface = (iface) => true;

const linkFile = (src, dest) => true;

const setFilterType = (filter, type) => filter.type = type;

const createFrameBuffer = () => ({ id: Math.random() });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const getVehicleSpeed = (vehicle) => 0;

const killParticles = (sys) => true;

const optimizeAST = (ast) => ast;

const parsePayload = (packet) => ({});

const uniform3f = (loc, x, y, z) => true;

const exitScope = (table) => true;

const decapsulateFrame = (frame) => frame;

const setEnv = (key, val) => true;

const adjustWindowSize = (sock, size) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const bindAddress = (sock, addr, port) => true;

const dhcpDiscover = () => true;

const validateProgram = (program) => true;

const updateTransform = (body) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const getEnv = (key) => "";

const mapMemory = (fd, size) => 0x2000;

const setMass = (body, m) => true;

const postProcessBloom = (image, threshold) => image;

const unmountFileSystem = (path) => true;

const useProgram = (program) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const createIndexBuffer = (data) => ({ id: Math.random() });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const logErrorToFile = (err) => console.error(err);

const disconnectNodes = (node) => true;

const swapTokens = (pair, amount) => true;

const installUpdate = () => false;

const resolveSymbols = (ast) => ({});

const configureInterface = (iface, config) => true;

const beginTransaction = () => "TX-" + Date.now();

const remuxContainer = (container) => ({ container, status: "done" });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const claimRewards = (pool) => "0.5 ETH";

const processAudioBuffer = (buffer) => buffer;

const activeTexture = (unit) => true;

const renameFile = (oldName, newName) => newName;

const compressGzip = (data) => data;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const wakeUp = (body) => true;

const verifyIR = (ir) => true;

const eliminateDeadCode = (ast) => ast;

const decompressGzip = (data) => data;

const panicKernel = (msg) => false;

const seekFile = (fd, offset) => true;

const deleteBuffer = (buffer) => true;


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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const scheduleTask = (task) => ({ id: 1, task });

const acceptConnection = (sock) => ({ fd: 2 });

const setInertia = (body, i) => true;

const cacheQueryResults = (key, data) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const unlockRow = (id) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const startOscillator = (osc, time) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const dhcpAck = () => true;

const dhcpRequest = (ip) => true;

const killProcess = (pid) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const applyTorque = (body, torque) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const rotateLogFiles = () => true;

const prefetchAssets = (urls) => urls.length;

const setKnee = (node, val) => node.knee.value = val;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const estimateNonce = (addr) => 42;

const clearScreen = (r, g, b, a) => true;

const stepSimulation = (world, dt) => true;

const augmentData = (image) => image;

const setQValue = (filter, q) => filter.Q = q;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const stakeAssets = (pool, amount) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const systemCall = (num, args) => 0;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const checkBalance = (addr) => "10.5 ETH";

const verifySignature = (tx, sig) => true;

const resampleAudio = (buffer, rate) => buffer;

const analyzeHeader = (packet) => ({});

const updateRoutingTable = (entry) => true;

const addHingeConstraint = (world, c) => true;

const getBlockHeight = () => 15000000;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createProcess = (img) => ({ pid: 100 });

const calculateCRC32 = (data) => "00000000";

const checkTypes = (ast) => [];

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const calculateGasFee = (limit) => limit * 20;

const preventCSRF = () => "csrf_token";

const verifyAppSignature = () => true;

const deleteProgram = (program) => true;

const addSliderConstraint = (world, c) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const rateLimitCheck = (ip) => true;

const commitTransaction = (tx) => true;

const encodeABI = (method, params) => "0x...";

const disablePEX = () => false;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const freeMemory = (ptr) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const generateDocumentation = (ast) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const restoreDatabase = (path) => true;

const connectSocket = (sock, addr, port) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const sleep = (body) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const controlCongestion = (sock) => true;

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

const readPipe = (fd, len) => new Uint8Array(len);

const broadcastTransaction = (tx) => "tx_hash_123";

const measureRTT = (sent, recv) => 10;

const extractArchive = (archive) => ["file1", "file2"];

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const blockMaliciousTraffic = (ip) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const unmapMemory = (ptr, size) => true;

const mockResponse = (body) => ({ status: 200, body });

const validateRecaptcha = (token) => true;

const lockRow = (id) => true;

const attachRenderBuffer = (fb, rb) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const getFloatTimeDomainData = (analyser, array) => true;

const rebootSystem = () => true;

const bufferData = (gl, target, data, usage) => true;

const writePipe = (fd, data) => data.length;

const getProgramInfoLog = (program) => "";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const fingerprintBrowser = () => "fp_hash_123";

const normalizeVolume = (buffer) => buffer;

const generateCode = (ast) => "const a = 1;";

const detachThread = (tid) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const cullFace = (mode) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const calculateMetric = (route) => 1;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const createConvolver = (ctx) => ({ buffer: null });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const addConeTwistConstraint = (world, c) => true;

const detectVirtualMachine = () => false;

const negotiateProtocol = () => "HTTP/2.0";

const createSymbolTable = () => ({ scopes: [] });

const spoofReferer = () => "https://google.com";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const shardingTable = (table) => ["shard_0", "shard_1"];

const obfuscateString = (str) => btoa(str);

const renderShadowMap = (scene, light) => ({ texture: {} });

const multicastMessage = (group, msg) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const getShaderInfoLog = (shader) => "";

const createConstraint = (body1, body2) => ({});

// Anti-shake references
const _ref_6guw3t = { addGeneric6DofConstraint };
const _ref_6xnbds = { addWheel };
const _ref_4jfkca = { sendPacket };
const _ref_1ulerk = { deserializeAST };
const _ref_r2szaa = { reportWarning };
const _ref_9a79to = { minifyCode };
const _ref_w5zrya = { getMACAddress };
const _ref_ztmnk1 = { unloadDriver };
const _ref_x8t6lr = { statFile };
const _ref_ue22df = { closeFile };
const _ref_rnpoum = { enableInterrupts };
const _ref_uu04a2 = { mkdir };
const _ref_lkug8q = { readFile };
const _ref_z2hokc = { visitNode };
const _ref_kfq07q = { mutexLock };
const _ref_cwpm4e = { createSphereShape };
const _ref_68tb74 = { foldConstants };
const _ref_ohin3y = { parseStatement };
const _ref_fltqme = { semaphoreSignal };
const _ref_7orcxu = { compressPacket };
const _ref_bnk6w4 = { rayCast };
const _ref_end9og = { detectPacketLoss };
const _ref_wk4635 = { parseExpression };
const _ref_ebhvar = { chdir };
const _ref_6v49cx = { upInterface };
const _ref_1fpw9v = { linkFile };
const _ref_2ud42c = { setFilterType };
const _ref_h8pezc = { createFrameBuffer };
const _ref_uy6szb = { setSteeringValue };
const _ref_j0t1tt = { getVehicleSpeed };
const _ref_s9adii = { killParticles };
const _ref_813shi = { optimizeAST };
const _ref_nzdn3h = { parsePayload };
const _ref_pr7sd7 = { uniform3f };
const _ref_k2ig8c = { exitScope };
const _ref_37e944 = { decapsulateFrame };
const _ref_eqsdgf = { setEnv };
const _ref_eri1q8 = { adjustWindowSize };
const _ref_wjzkib = { createScriptProcessor };
const _ref_t7l3s8 = { bindAddress };
const _ref_w2k6m3 = { dhcpDiscover };
const _ref_fpywjp = { validateProgram };
const _ref_veo9ej = { updateTransform };
const _ref_euwx9p = { createBoxShape };
const _ref_ibj3hu = { getEnv };
const _ref_o142es = { mapMemory };
const _ref_dm7d03 = { setMass };
const _ref_ybbejn = { postProcessBloom };
const _ref_78ofde = { unmountFileSystem };
const _ref_obo39v = { useProgram };
const _ref_908xc4 = { requestAnimationFrameLoop };
const _ref_h9pmow = { createIndexBuffer };
const _ref_h9xzms = { validateMnemonic };
const _ref_j24ro9 = { logErrorToFile };
const _ref_tlrmhz = { disconnectNodes };
const _ref_1q3l1j = { swapTokens };
const _ref_yr3w0g = { installUpdate };
const _ref_fdjh1k = { resolveSymbols };
const _ref_z9o4zl = { configureInterface };
const _ref_30o4cj = { beginTransaction };
const _ref_tazb58 = { remuxContainer };
const _ref_rphgnh = { discoverPeersDHT };
const _ref_1o5i5f = { claimRewards };
const _ref_dtc7wr = { processAudioBuffer };
const _ref_2alznd = { activeTexture };
const _ref_va36yx = { renameFile };
const _ref_pdgrxn = { compressGzip };
const _ref_u30dm7 = { watchFileChanges };
const _ref_3cezwp = { wakeUp };
const _ref_9jvay1 = { verifyIR };
const _ref_892ab9 = { eliminateDeadCode };
const _ref_ijuyfb = { decompressGzip };
const _ref_vpc46y = { panicKernel };
const _ref_3rhijd = { seekFile };
const _ref_a1rxrk = { deleteBuffer };
const _ref_pmsx9s = { TelemetryClient };
const _ref_wl0b1c = { debounceAction };
const _ref_gsznym = { scheduleTask };
const _ref_3pm0t8 = { acceptConnection };
const _ref_9x8s87 = { setInertia };
const _ref_vkj0uc = { cacheQueryResults };
const _ref_vr31c1 = { removeMetadata };
const _ref_g3rvk9 = { unlockRow };
const _ref_0vmzka = { readPixels };
const _ref_ep7qe1 = { handshakePeer };
const _ref_2e2ybt = { startOscillator };
const _ref_rufq1f = { calculateLayoutMetrics };
const _ref_tzoytj = { decodeABI };
const _ref_37qusk = { dhcpAck };
const _ref_0h6mva = { dhcpRequest };
const _ref_o2t5e0 = { killProcess };
const _ref_2jmmvq = { transformAesKey };
const _ref_1l8g78 = { applyTorque };
const _ref_ju9qzh = { announceToTracker };
const _ref_pr9r21 = { rotateLogFiles };
const _ref_8gkstb = { prefetchAssets };
const _ref_2m9ipi = { setKnee };
const _ref_ch3x61 = { isFeatureEnabled };
const _ref_b30xvd = { estimateNonce };
const _ref_s9mzhh = { clearScreen };
const _ref_306t9a = { stepSimulation };
const _ref_exw26x = { augmentData };
const _ref_ahoqin = { setQValue };
const _ref_syzc54 = { formatLogMessage };
const _ref_jqbmpf = { stakeAssets };
const _ref_2tkvck = { detectObjectYOLO };
const _ref_771xee = { systemCall };
const _ref_2ift8n = { migrateSchema };
const _ref_a0kaix = { checkBalance };
const _ref_gr8x0d = { verifySignature };
const _ref_ry88tq = { resampleAudio };
const _ref_2y4i96 = { analyzeHeader };
const _ref_rw7wif = { updateRoutingTable };
const _ref_qq2nrx = { addHingeConstraint };
const _ref_zptaex = { getBlockHeight };
const _ref_a9o9kk = { createStereoPanner };
const _ref_64oof3 = { createProcess };
const _ref_tx2zp4 = { calculateCRC32 };
const _ref_mgqxug = { checkTypes };
const _ref_nlddja = { compressDataStream };
const _ref_sy5ocd = { tokenizeSource };
const _ref_s1e8li = { optimizeMemoryUsage };
const _ref_24ega6 = { calculateGasFee };
const _ref_tbepjf = { preventCSRF };
const _ref_i7ysbh = { verifyAppSignature };
const _ref_8bcous = { deleteProgram };
const _ref_1g2nge = { addSliderConstraint };
const _ref_ma5ua3 = { generateEmbeddings };
const _ref_n03paz = { limitDownloadSpeed };
const _ref_5ry06a = { rateLimitCheck };
const _ref_dwq9b8 = { commitTransaction };
const _ref_45ahho = { encodeABI };
const _ref_kc29gp = { disablePEX };
const _ref_7ep5dv = { analyzeUserBehavior };
const _ref_f2xrsf = { freeMemory };
const _ref_8to4f8 = { uninterestPeer };
const _ref_26mz7u = { generateDocumentation };
const _ref_rgdn4p = { calculateRestitution };
const _ref_xbqwbv = { restoreDatabase };
const _ref_y4ciom = { connectSocket };
const _ref_gjkiug = { setFrequency };
const _ref_rsw9hn = { sleep };
const _ref_and9dk = { getAppConfig };
const _ref_q5h788 = { controlCongestion };
const _ref_dl6acs = { generateFakeClass };
const _ref_opnmbt = { readPipe };
const _ref_pkxu9d = { broadcastTransaction };
const _ref_kvacae = { measureRTT };
const _ref_zfj7ur = { extractArchive };
const _ref_f0w51j = { normalizeAudio };
const _ref_b6us8l = { limitBandwidth };
const _ref_33ulxn = { blockMaliciousTraffic };
const _ref_ua6ov7 = { interceptRequest };
const _ref_swwfxa = { saveCheckpoint };
const _ref_dx7lq9 = { optimizeHyperparameters };
const _ref_hhjgky = { setDelayTime };
const _ref_2iwlhn = { unmapMemory };
const _ref_q3wz2f = { mockResponse };
const _ref_vkbxnx = { validateRecaptcha };
const _ref_z1bpfv = { lockRow };
const _ref_mosc9j = { attachRenderBuffer };
const _ref_daynbg = { receivePacket };
const _ref_awp4k1 = { initiateHandshake };
const _ref_isbr4f = { getFloatTimeDomainData };
const _ref_xv0y4o = { rebootSystem };
const _ref_zzgv4q = { bufferData };
const _ref_g4ogak = { writePipe };
const _ref_sio15x = { getProgramInfoLog };
const _ref_kszvgo = { formatCurrency };
const _ref_44uwue = { createCapsuleShape };
const _ref_y4qjdk = { fingerprintBrowser };
const _ref_w10ttd = { normalizeVolume };
const _ref_fepsji = { generateCode };
const _ref_3yekgy = { detachThread };
const _ref_27rypl = { calculateMD5 };
const _ref_i4rgh5 = { moveFileToComplete };
const _ref_r7fcil = { cullFace };
const _ref_qj16lg = { decodeAudioData };
const _ref_p9d9t7 = { calculateMetric };
const _ref_bgwp17 = { scrapeTracker };
const _ref_3f1an6 = { createConvolver };
const _ref_1ge90s = { detectEnvironment };
const _ref_00ld2x = { createPanner };
const _ref_o2w8hp = { addConeTwistConstraint };
const _ref_eyg3m4 = { detectVirtualMachine };
const _ref_avvfx6 = { negotiateProtocol };
const _ref_qvcpiy = { createSymbolTable };
const _ref_tqb4br = { spoofReferer };
const _ref_5stui7 = { getNetworkStats };
const _ref_fikvlw = { monitorNetworkInterface };
const _ref_wskom5 = { createOscillator };
const _ref_xhcqky = { requestPiece };
const _ref_aw35l0 = { createIndex };
const _ref_9gy4y5 = { shardingTable };
const _ref_tcphld = { obfuscateString };
const _ref_p8kcp8 = { renderShadowMap };
const _ref_pbz58a = { multicastMessage };
const _ref_6jvj7w = { createWaveShaper };
const _ref_ttx9g2 = { getShaderInfoLog };
const _ref_a6r38c = { createConstraint }; 
    });
})({}, {});