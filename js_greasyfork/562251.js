// ==UserScript==
// @name jiosaavn音频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/jiosaavn/index.js
// @version 2026.01.21.2
// @description 一键下载jiosaavn音频，支持4K/1080P/720P多画质。
// @icon https://www.jiosaavn.com/favicon.ico
// @match *://*.jiosaavn.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect jiosaavn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const splitFile = (path, parts) => Array(parts).fill(path);

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const encryptLocalStorage = (key, val) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setFilePermissions = (perm) => `chmod ${perm}`;

const rotateMatrix = (mat, angle, axis) => mat;

const renderCanvasLayer = (ctx) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }


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

const disablePEX = () => false;

const adjustWindowSize = (sock, size) => true;

const rmdir = (path) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const enableInterrupts = () => true;

const readdir = (path) => [];

const chmodFile = (path, mode) => true;

const systemCall = (num, args) => 0;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const writeFile = (fd, data) => true;

const protectMemory = (ptr, size, flags) => true;

const createSymbolTable = () => ({ scopes: [] });

const signTransaction = (tx, key) => "signed_tx_hash";

const checkRootAccess = () => false;

const handleInterrupt = (irq) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const disableRightClick = () => true;

const spoofReferer = () => "https://google.com";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const arpRequest = (ip) => "00:00:00:00:00:00";

const inferType = (node) => 'any';

const closePipe = (fd) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const unlinkFile = (path) => true;

const dhcpRequest = (ip) => true;

const dumpSymbolTable = (table) => "";

const checkTypes = (ast) => [];

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const mapMemory = (fd, size) => 0x2000;

const extractArchive = (archive) => ["file1", "file2"];

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const transcodeStream = (format) => ({ format, status: "processing" });

const auditAccessLogs = () => true;

const seekFile = (fd, offset) => true;

const bundleAssets = (assets) => "";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const decapsulateFrame = (frame) => frame;

const dhcpAck = () => true;

const cancelTask = (id) => ({ id, cancelled: true });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const drawArrays = (gl, mode, first, count) => true;

const unloadDriver = (name) => true;

const analyzeHeader = (packet) => ({});

const cleanOldLogs = (days) => days;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createPipe = () => [3, 4];

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const resolveSymbols = (ast) => ({});

const resolveCollision = (manifold) => true;

const decompressGzip = (data) => data;

const unmapMemory = (ptr, size) => true;

const wakeUp = (body) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const calculateGasFee = (limit) => limit * 20;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const chdir = (path) => true;

const hoistVariables = (ast) => ast;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createMediaElementSource = (ctx, el) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const prefetchAssets = (urls) => urls.length;

const dropTable = (table) => true;

const applyImpulse = (body, impulse, point) => true;

const unmountFileSystem = (path) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const loadImpulseResponse = (url) => Promise.resolve({});

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const debugAST = (ast) => "";

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const setDelayTime = (node, time) => node.delayTime.value = time;

const blockMaliciousTraffic = (ip) => true;

const forkProcess = () => 101;

const removeRigidBody = (world, body) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const applyFog = (color, dist) => color;

const detectVideoCodec = () => "h264";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const createMeshShape = (vertices) => ({ type: 'mesh' });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const sleep = (body) => true;

const applyForce = (body, force, point) => true;

const validatePieceChecksum = (piece) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

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

const lazyLoadComponent = (name) => ({ name, loaded: false });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveImports = (ast) => [];

const unchokePeer = (peer) => ({ ...peer, choked: false });

const deobfuscateString = (str) => atob(str);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const registerGestureHandler = (gesture) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const findLoops = (cfg) => [];

const setMass = (body, m) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const setQValue = (filter, q) => filter.Q = q;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const obfuscateCode = (code) => code;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const checkBatteryLevel = () => 100;

const connectNodes = (src, dest) => true;

const setGravity = (world, g) => world.gravity = g;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const invalidateCache = (key) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createConvolver = (ctx) => ({ buffer: null });

const broadcastMessage = (msg) => true;

const tokenizeText = (text) => text.split(" ");

const createConstraint = (body1, body2) => ({});

const gaussianBlur = (image, radius) => image;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const checkIntegrityConstraint = (table) => true;

const updateTransform = (body) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const freeMemory = (ptr) => true;

const segmentImageUNet = (img) => "mask_buffer";

const serializeAST = (ast) => JSON.stringify(ast);

const reportError = (msg, line) => console.error(msg);

const cullFace = (mode) => true;

const getOutputTimestamp = (ctx) => Date.now();

const setThreshold = (node, val) => node.threshold.value = val;

const mockResponse = (body) => ({ status: 200, body });

const parsePayload = (packet) => ({});

const installUpdate = () => false;

const createSphereShape = (r) => ({ type: 'sphere' });

const applyTheme = (theme) => document.body.className = theme;

const scaleMatrix = (mat, vec) => mat;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const normalizeFeatures = (data) => data.map(x => x / 255);

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const muteStream = () => true;

const setAngularVelocity = (body, v) => true;

const bindAddress = (sock, addr, port) => true;

const remuxContainer = (container) => ({ container, status: "done" });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const analyzeBitrate = () => "5000kbps";

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setMTU = (iface, mtu) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const processAudioBuffer = (buffer) => buffer;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setDopplerFactor = (val) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const bindTexture = (target, texture) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const cacheQueryResults = (key, data) => true;

const merkelizeRoot = (txs) => "root_hash";

const unlockRow = (id) => true;

const scheduleProcess = (pid) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const rateLimitCheck = (ip) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const detachThread = (tid) => true;

const setViewport = (x, y, w, h) => true;

const listenSocket = (sock, backlog) => true;

const encapsulateFrame = (packet) => packet;

const bufferData = (gl, target, data, usage) => true;


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

const decodeAudioData = (buffer) => Promise.resolve({});

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const serializeFormData = (form) => JSON.stringify(form);

const mangleNames = (ast) => ast;

const triggerHapticFeedback = (intensity) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const detectCollision = (body1, body2) => false;

const detectPacketLoss = (acks) => false;

const addRigidBody = (world, body) => true;

const replicateData = (node) => ({ target: node, synced: true });

const mutexUnlock = (mtx) => true;

const resampleAudio = (buffer, rate) => buffer;

const prioritizeTraffic = (queue) => true;

const hashKeccak256 = (data) => "0xabc...";

const handleTimeout = (sock) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const normalizeVolume = (buffer) => buffer;

// Anti-shake references
const _ref_12zoh2 = { splitFile };
const _ref_2nm9vb = { computeNormal };
const _ref_atlvdc = { loadTexture };
const _ref_fvxkuh = { encryptLocalStorage };
const _ref_a8dik0 = { decodeABI };
const _ref_zefftk = { setFilePermissions };
const _ref_o15ynn = { rotateMatrix };
const _ref_myjxdw = { renderCanvasLayer };
const _ref_c5l7pm = { transformAesKey };
const _ref_dbx2uf = { ResourceMonitor };
const _ref_92ui0n = { disablePEX };
const _ref_uu6kxt = { adjustWindowSize };
const _ref_tx4q4v = { rmdir };
const _ref_h91d2v = { uploadCrashReport };
const _ref_pcio2o = { enableInterrupts };
const _ref_fyqfnk = { readdir };
const _ref_salsqg = { chmodFile };
const _ref_w6jo5h = { systemCall };
const _ref_vz2xbv = { animateTransition };
const _ref_pn1x6x = { writeFile };
const _ref_gnzbu5 = { protectMemory };
const _ref_6ipovg = { createSymbolTable };
const _ref_pocujm = { signTransaction };
const _ref_by1l60 = { checkRootAccess };
const _ref_0rs2dx = { handleInterrupt };
const _ref_ou0dry = { flushSocketBuffer };
const _ref_p1fc1n = { disableRightClick };
const _ref_b6oh9o = { spoofReferer };
const _ref_vglcdb = { getFileAttributes };
const _ref_ds6gva = { arpRequest };
const _ref_1px11m = { inferType };
const _ref_omf826 = { closePipe };
const _ref_u0q8f9 = { normalizeVector };
const _ref_62jr4e = { unlinkFile };
const _ref_qld9ny = { dhcpRequest };
const _ref_g7duj1 = { dumpSymbolTable };
const _ref_xfvgrj = { checkTypes };
const _ref_hskawm = { compactDatabase };
const _ref_615h5u = { mapMemory };
const _ref_yknfo1 = { extractArchive };
const _ref_7jl3ro = { limitBandwidth };
const _ref_e2jfjv = { transcodeStream };
const _ref_y4e5ay = { auditAccessLogs };
const _ref_qijpis = { seekFile };
const _ref_0ehrug = { bundleAssets };
const _ref_lrm59e = { formatLogMessage };
const _ref_lc6da0 = { decapsulateFrame };
const _ref_g9o0l2 = { dhcpAck };
const _ref_bs12cy = { cancelTask };
const _ref_quds42 = { detectEnvironment };
const _ref_matxm1 = { drawArrays };
const _ref_bmr3e4 = { unloadDriver };
const _ref_pdv9bk = { analyzeHeader };
const _ref_yvun4x = { cleanOldLogs };
const _ref_zvsddt = { connectToTracker };
const _ref_4bbj98 = { createPipe };
const _ref_63s37t = { uninterestPeer };
const _ref_7ln36x = { resolveSymbols };
const _ref_48435g = { resolveCollision };
const _ref_u39rna = { decompressGzip };
const _ref_rzeyz8 = { unmapMemory };
const _ref_3he9pd = { wakeUp };
const _ref_6jwv88 = { vertexAttrib3f };
const _ref_gdlr8c = { calculateGasFee };
const _ref_l6h5w5 = { queueDownloadTask };
const _ref_we9act = { loadModelWeights };
const _ref_wf0oky = { chdir };
const _ref_alxfqg = { hoistVariables };
const _ref_i3hgj2 = { generateWalletKeys };
const _ref_70ao6m = { archiveFiles };
const _ref_dzgwhz = { createMediaElementSource };
const _ref_xg41u2 = { handshakePeer };
const _ref_q65nth = { prefetchAssets };
const _ref_cky1w8 = { dropTable };
const _ref_k7sjpx = { applyImpulse };
const _ref_uhj7b1 = { unmountFileSystem };
const _ref_8fnnqz = { scheduleBandwidth };
const _ref_tcchby = { loadImpulseResponse };
const _ref_jzmpl1 = { refreshAuthToken };
const _ref_dmglda = { getMACAddress };
const _ref_v7hc2c = { debugAST };
const _ref_4ust19 = { diffVirtualDOM };
const _ref_fn6vqt = { setDelayTime };
const _ref_c2sw6k = { blockMaliciousTraffic };
const _ref_2idmjj = { forkProcess };
const _ref_uxjjme = { removeRigidBody };
const _ref_7fx3f9 = { clearBrowserCache };
const _ref_keu4tw = { encryptPayload };
const _ref_xog6qa = { applyFog };
const _ref_wa1p4a = { detectVideoCodec };
const _ref_9xj32k = { requestPiece };
const _ref_x3bg8m = { makeDistortionCurve };
const _ref_f42j1d = { createMeshShape };
const _ref_fbr93q = { validateTokenStructure };
const _ref_qrdiql = { sleep };
const _ref_xqz17i = { applyForce };
const _ref_a46dy1 = { validatePieceChecksum };
const _ref_bnloc9 = { backupDatabase };
const _ref_otgsj8 = { AdvancedCipher };
const _ref_sosaae = { lazyLoadComponent };
const _ref_lwm7iw = { resolveHostName };
const _ref_199lub = { createOscillator };
const _ref_5rr888 = { resolveImports };
const _ref_byh54p = { unchokePeer };
const _ref_y401pr = { deobfuscateString };
const _ref_ok1tuk = { showNotification };
const _ref_i8xitt = { registerGestureHandler };
const _ref_fih7e6 = { performTLSHandshake };
const _ref_0ju8zh = { findLoops };
const _ref_zlet6s = { setMass };
const _ref_xtpiyy = { parseMagnetLink };
const _ref_tpz3sc = { setQValue };
const _ref_79gxm0 = { createScriptProcessor };
const _ref_tn1ld9 = { obfuscateCode };
const _ref_fdvwc9 = { seedRatioLimit };
const _ref_g7i32y = { checkBatteryLevel };
const _ref_g5ilpd = { connectNodes };
const _ref_xmmu06 = { setGravity };
const _ref_g1ky1z = { autoResumeTask };
const _ref_wrnn88 = { invalidateCache };
const _ref_5sirc9 = { calculateFriction };
const _ref_vcswts = { createBoxShape };
const _ref_k2nsmn = { rayIntersectTriangle };
const _ref_1cuovn = { createConvolver };
const _ref_gtbseu = { broadcastMessage };
const _ref_vq9pm2 = { tokenizeText };
const _ref_yovl70 = { createConstraint };
const _ref_yvkja4 = { gaussianBlur };
const _ref_i5rr4z = { getAngularVelocity };
const _ref_vbfixg = { resolveDependencyGraph };
const _ref_1f21ap = { checkIntegrityConstraint };
const _ref_i613oj = { updateTransform };
const _ref_9qrpw3 = { removeMetadata };
const _ref_oj9d63 = { freeMemory };
const _ref_u6tmvz = { segmentImageUNet };
const _ref_hozlwq = { serializeAST };
const _ref_5ccvvw = { reportError };
const _ref_zcss0i = { cullFace };
const _ref_b2ih13 = { getOutputTimestamp };
const _ref_6ursm8 = { setThreshold };
const _ref_kmxxyr = { mockResponse };
const _ref_1qjay3 = { parsePayload };
const _ref_2gukzh = { installUpdate };
const _ref_70guvh = { createSphereShape };
const _ref_azpcwc = { applyTheme };
const _ref_zjshly = { scaleMatrix };
const _ref_606nx8 = { createStereoPanner };
const _ref_t8ejcj = { normalizeFeatures };
const _ref_l6b5s3 = { validateSSLCert };
const _ref_k2laef = { muteStream };
const _ref_qu2i9f = { setAngularVelocity };
const _ref_7lpqp9 = { bindAddress };
const _ref_lwwldo = { remuxContainer };
const _ref_90qpvc = { isFeatureEnabled };
const _ref_0q7da0 = { analyzeBitrate };
const _ref_sr5nfb = { createGainNode };
const _ref_an4zy3 = { getVelocity };
const _ref_ns5ihz = { setMTU };
const _ref_56s0rv = { readPixels };
const _ref_ctgdae = { processAudioBuffer };
const _ref_dw5a3n = { createPanner };
const _ref_xmxw8h = { setDopplerFactor };
const _ref_y5zhej = { rotateUserAgent };
const _ref_cpw6z1 = { switchProxyServer };
const _ref_fb8uq3 = { bindTexture };
const _ref_chcgb3 = { recognizeSpeech };
const _ref_z9lus5 = { cacheQueryResults };
const _ref_60toug = { merkelizeRoot };
const _ref_q86k0r = { unlockRow };
const _ref_3aaj0l = { scheduleProcess };
const _ref_qpvq0v = { initiateHandshake };
const _ref_jertfy = { rateLimitCheck };
const _ref_xir446 = { createIndex };
const _ref_nvne4v = { sanitizeInput };
const _ref_5igyl3 = { detachThread };
const _ref_p7kl9s = { setViewport };
const _ref_pdau81 = { listenSocket };
const _ref_t7entt = { encapsulateFrame };
const _ref_j9u5e3 = { bufferData };
const _ref_ovkp2v = { TelemetryClient };
const _ref_ngdo6e = { debounceAction };
const _ref_vyqzh3 = { decodeAudioData };
const _ref_pusx65 = { manageCookieJar };
const _ref_j70cua = { detectFirewallStatus };
const _ref_kk3bck = { serializeFormData };
const _ref_4txo38 = { mangleNames };
const _ref_xi11rd = { triggerHapticFeedback };
const _ref_ic0s17 = { convexSweepTest };
const _ref_c0oib1 = { createMagnetURI };
const _ref_oke116 = { detectCollision };
const _ref_5sw0wj = { detectPacketLoss };
const _ref_nfou5q = { addRigidBody };
const _ref_wpqk60 = { replicateData };
const _ref_wadw0y = { mutexUnlock };
const _ref_9q9617 = { resampleAudio };
const _ref_q8y1vh = { prioritizeTraffic };
const _ref_5y9u6c = { hashKeccak256 };
const _ref_qg1mv7 = { handleTimeout };
const _ref_7knm2r = { generateUUIDv5 };
const _ref_dkue51 = { normalizeVolume }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `jiosaavn` };
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
                const urlParams = { config, url: window.location.href, name_en: `jiosaavn` };

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
        const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const fragmentPacket = (data, mtu) => [data];

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const prefetchAssets = (urls) => urls.length;

const postProcessBloom = (image, threshold) => image;

const installUpdate = () => false;

const transcodeStream = (format) => ({ format, status: "processing" });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const cacheQueryResults = (key, data) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const auditAccessLogs = () => true;

const verifyAppSignature = () => true;

const bufferMediaStream = (size) => ({ buffer: size });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const beginTransaction = () => "TX-" + Date.now();

const restoreDatabase = (path) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const unlockRow = (id) => true;

const calculateGasFee = (limit) => limit * 20;

const replicateData = (node) => ({ target: node, synced: true });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const cleanOldLogs = (days) => days;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const invalidateCache = (key) => true;

const restartApplication = () => console.log("Restarting...");

const bufferData = (gl, target, data, usage) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const monitorClipboard = () => "";

const sanitizeXSS = (html) => html;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const shutdownComputer = () => console.log("Shutting down...");

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const obfuscateString = (str) => btoa(str);

const semaphoreWait = (sem) => true;

const deriveAddress = (path) => "0x123...";

const reportWarning = (msg, line) => console.warn(msg);

const jitCompile = (bc) => (() => {});

const preventSleepMode = () => true;

const inferType = (node) => 'any';

const disablePEX = () => false;

const commitTransaction = (tx) => true;

const multicastMessage = (group, msg) => true;

const translateMatrix = (mat, vec) => mat;

const validateIPWhitelist = (ip) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const resolveImports = (ast) => [];

const sleep = (body) => true;

const createSoftBody = (info) => ({ nodes: [] });

const decodeAudioData = (buffer) => Promise.resolve({});

const checkUpdate = () => ({ hasUpdate: false });

const setKnee = (node, val) => node.knee.value = val;

const rotateLogFiles = () => true;

const decryptStream = (stream, key) => stream;

const reassemblePacket = (fragments) => fragments[0];

const addConeTwistConstraint = (world, c) => true;

const setPosition = (panner, x, y, z) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const setThreshold = (node, val) => node.threshold.value = val;

const wakeUp = (body) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const setVelocity = (body, v) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const splitFile = (path, parts) => Array(parts).fill(path);

const analyzeControlFlow = (ast) => ({ graph: {} });

const setFilterType = (filter, type) => filter.type = type;

const analyzeHeader = (packet) => ({});

const listenSocket = (sock, backlog) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const updateRoutingTable = (entry) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const traceroute = (host) => ["192.168.1.1"];

const checkBatteryLevel = () => 100;

const setGainValue = (node, val) => node.gain.value = val;

const mutexUnlock = (mtx) => true;

const scheduleTask = (task) => ({ id: 1, task });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const normalizeVolume = (buffer) => buffer;

const generateCode = (ast) => "const a = 1;";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const setInertia = (body, i) => true;

const setQValue = (filter, q) => filter.Q = q;

const rmdir = (path) => true;

const computeDominators = (cfg) => ({});

const exitScope = (table) => true;

const prettifyCode = (code) => code;

const cancelTask = (id) => ({ id, cancelled: true });

const dhcpOffer = (ip) => true;

const logErrorToFile = (err) => console.error(err);

const parsePayload = (packet) => ({});

const getOutputTimestamp = (ctx) => Date.now();


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

const generateMipmaps = (target) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const interestPeer = (peer) => ({ ...peer, interested: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const convertFormat = (src, dest) => dest;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const dhcpAck = () => true;

const checkIntegrityToken = (token) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const dhcpRequest = (ip) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const joinThread = (tid) => true;

const getByteFrequencyData = (analyser, array) => true;

const calculateComplexity = (ast) => 1;

const createPeriodicWave = (ctx, real, imag) => ({});

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const createMediaStreamSource = (ctx, stream) => ({});

const triggerHapticFeedback = (intensity) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const optimizeAST = (ast) => ast;

const mockResponse = (body) => ({ status: 200, body });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const dhcpDiscover = () => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const registerGestureHandler = (gesture) => true;

const enableInterrupts = () => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const negotiateSession = (sock) => ({ id: "sess_1" });

const scheduleProcess = (pid) => true;

const broadcastTransaction = (tx) => "tx_hash_123";


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
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

const unmountFileSystem = (path) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const closeContext = (ctx) => Promise.resolve();

const detectPacketLoss = (acks) => false;

const addWheel = (vehicle, info) => true;

const createParticleSystem = (count) => ({ particles: [] });

const setBrake = (vehicle, force, wheelIdx) => true;

const translateText = (text, lang) => text;

const compressPacket = (data) => data;

const vertexAttrib3f = (idx, x, y, z) => true;

const scaleMatrix = (mat, vec) => mat;

const loadDriver = (path) => true;

const lockRow = (id) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const configureInterface = (iface, config) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const detachThread = (tid) => true;

const visitNode = (node) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const generateSourceMap = (ast) => "{}";

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const detectDarkMode = () => true;

const getExtension = (name) => ({});

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const segmentImageUNet = (img) => "mask_buffer";

const processAudioBuffer = (buffer) => buffer;

const applyTheme = (theme) => document.body.className = theme;

const uniform1i = (loc, val) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const muteStream = () => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const compileFragmentShader = (source) => ({ compiled: true });

const mountFileSystem = (dev, path) => true;


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

const decompressPacket = (data) => data;

const inlineFunctions = (ast) => ast;

const backupDatabase = (path) => ({ path, size: 5000 });

const setDelayTime = (node, time) => node.delayTime.value = time;

const setRelease = (node, val) => node.release.value = val;

const checkTypes = (ast) => [];

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const resampleAudio = (buffer, rate) => buffer;

const registerSystemTray = () => ({ icon: "tray.ico" });

const registerISR = (irq, func) => true;

const validateProgram = (program) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const deobfuscateString = (str) => atob(str);

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const traverseAST = (node, visitor) => true;

const chdir = (path) => true;

const enableBlend = (func) => true;

const obfuscateCode = (code) => code;

const createDirectoryRecursive = (path) => path.split('/').length;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const setAngularVelocity = (body, v) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

// Anti-shake references
const _ref_r7gmci = { uploadCrashReport };
const _ref_d2i5yw = { fragmentPacket };
const _ref_hh0mmn = { computeNormal };
const _ref_r4mixq = { prefetchAssets };
const _ref_lapwcj = { postProcessBloom };
const _ref_niff63 = { installUpdate };
const _ref_gehrlf = { transcodeStream };
const _ref_myaqpm = { isFeatureEnabled };
const _ref_mbax2g = { cacheQueryResults };
const _ref_pjxn00 = { monitorNetworkInterface };
const _ref_awo01v = { auditAccessLogs };
const _ref_d1rp7c = { verifyAppSignature };
const _ref_etp00d = { bufferMediaStream };
const _ref_qcm3xe = { switchProxyServer };
const _ref_haycpz = { beginTransaction };
const _ref_7hch3p = { restoreDatabase };
const _ref_5klaoy = { scrapeTracker };
const _ref_0v9m4b = { unlockRow };
const _ref_7sa746 = { calculateGasFee };
const _ref_26133v = { replicateData };
const _ref_c1t4zw = { performTLSHandshake };
const _ref_26a53d = { migrateSchema };
const _ref_m3i763 = { cleanOldLogs };
const _ref_x8vils = { scheduleBandwidth };
const _ref_m284xf = { optimizeConnectionPool };
const _ref_avetzi = { invalidateCache };
const _ref_m1cpiy = { restartApplication };
const _ref_8gkb6b = { bufferData };
const _ref_plb8bo = { getNetworkStats };
const _ref_ofr0l1 = { monitorClipboard };
const _ref_oyo2qp = { sanitizeXSS };
const _ref_pvahmn = { unchokePeer };
const _ref_b2i3cx = { decryptHLSStream };
const _ref_55s4qh = { shutdownComputer };
const _ref_tqvih2 = { resolveDNSOverHTTPS };
const _ref_xds8i3 = { createIndex };
const _ref_i33y3e = { compactDatabase };
const _ref_n8p1z8 = { obfuscateString };
const _ref_rs1kkf = { semaphoreWait };
const _ref_ribnb7 = { deriveAddress };
const _ref_ap2wjh = { reportWarning };
const _ref_vtpglj = { jitCompile };
const _ref_7x7omd = { preventSleepMode };
const _ref_z8bbk1 = { inferType };
const _ref_5gml6z = { disablePEX };
const _ref_tib90t = { commitTransaction };
const _ref_p23zw8 = { multicastMessage };
const _ref_fmdine = { translateMatrix };
const _ref_47nt8l = { validateIPWhitelist };
const _ref_k3oam2 = { validateSSLCert };
const _ref_holgbe = { getAppConfig };
const _ref_7tx3ud = { resolveImports };
const _ref_fqvafs = { sleep };
const _ref_o0y23t = { createSoftBody };
const _ref_dlhv8n = { decodeAudioData };
const _ref_lsr2yh = { checkUpdate };
const _ref_zja8dd = { setKnee };
const _ref_qky665 = { rotateLogFiles };
const _ref_sp0uid = { decryptStream };
const _ref_f1gjhl = { reassemblePacket };
const _ref_e2mc3d = { addConeTwistConstraint };
const _ref_4zjjof = { setPosition };
const _ref_jni8xx = { renderShadowMap };
const _ref_iww6bg = { setThreshold };
const _ref_7u3o02 = { wakeUp };
const _ref_o6el46 = { createStereoPanner };
const _ref_asdg9c = { setVelocity };
const _ref_x6qnsn = { handshakePeer };
const _ref_599jgw = { signTransaction };
const _ref_d1bsin = { clearBrowserCache };
const _ref_vgqrw5 = { splitFile };
const _ref_h5zlq6 = { analyzeControlFlow };
const _ref_ika7ob = { setFilterType };
const _ref_67889h = { analyzeHeader };
const _ref_y27buh = { listenSocket };
const _ref_5uemr0 = { removeMetadata };
const _ref_mb7f4f = { updateRoutingTable };
const _ref_8456y3 = { shardingTable };
const _ref_9wvjmr = { tunnelThroughProxy };
const _ref_4llnxt = { traceroute };
const _ref_dqcuf5 = { checkBatteryLevel };
const _ref_ydt834 = { setGainValue };
const _ref_0bk9mb = { mutexUnlock };
const _ref_z5vbrn = { scheduleTask };
const _ref_knrx2x = { initWebGLContext };
const _ref_kg8zzq = { normalizeVolume };
const _ref_xiq1hj = { generateCode };
const _ref_nb6s1b = { watchFileChanges };
const _ref_s4nlbv = { setInertia };
const _ref_xon21w = { setQValue };
const _ref_51xzct = { rmdir };
const _ref_fpbcny = { computeDominators };
const _ref_xremc9 = { exitScope };
const _ref_d82tnc = { prettifyCode };
const _ref_k4dev0 = { cancelTask };
const _ref_1dhc3j = { dhcpOffer };
const _ref_kq1qc4 = { logErrorToFile };
const _ref_zsb217 = { parsePayload };
const _ref_5l61ie = { getOutputTimestamp };
const _ref_3tk2mg = { ApiDataFormatter };
const _ref_6lk426 = { generateMipmaps };
const _ref_3awh89 = { createScriptProcessor };
const _ref_zkpy7x = { interestPeer };
const _ref_bwu26t = { calculatePieceHash };
const _ref_qukuhr = { convertFormat };
const _ref_1vugr4 = { getMACAddress };
const _ref_v5dbto = { updateBitfield };
const _ref_h7tg4z = { dhcpAck };
const _ref_p1ttg0 = { checkIntegrityToken };
const _ref_rtwyc7 = { seedRatioLimit };
const _ref_pknmwg = { dhcpRequest };
const _ref_xazm4a = { serializeAST };
const _ref_u2wuu1 = { joinThread };
const _ref_1jh74t = { getByteFrequencyData };
const _ref_ddetlc = { calculateComplexity };
const _ref_ja83c9 = { createPeriodicWave };
const _ref_8l56v9 = { calculateLayoutMetrics };
const _ref_xempl8 = { encryptPayload };
const _ref_ghudyu = { createMediaStreamSource };
const _ref_o99yxn = { triggerHapticFeedback };
const _ref_ckdnyf = { requestPiece };
const _ref_7vccq0 = { optimizeAST };
const _ref_s77q3i = { mockResponse };
const _ref_4hp74x = { createBoxShape };
const _ref_oydrvc = { dhcpDiscover };
const _ref_h5ncst = { validateTokenStructure };
const _ref_qazbim = { executeSQLQuery };
const _ref_c2mo86 = { registerGestureHandler };
const _ref_3l83a8 = { enableInterrupts };
const _ref_xkn3u0 = { animateTransition };
const _ref_670vrt = { negotiateSession };
const _ref_o359ex = { scheduleProcess };
const _ref_jq6o46 = { broadcastTransaction };
const _ref_gotwit = { FileValidator };
const _ref_99elhs = { setSteeringValue };
const _ref_9a89n7 = { traceStack };
const _ref_y4y5z7 = { VirtualFSTree };
const _ref_obebm6 = { unmountFileSystem };
const _ref_bxhalb = { clusterKMeans };
const _ref_49j478 = { closeContext };
const _ref_w5y6qs = { detectPacketLoss };
const _ref_wngjf0 = { addWheel };
const _ref_2cqch6 = { createParticleSystem };
const _ref_6cknog = { setBrake };
const _ref_o5tz6c = { translateText };
const _ref_n7ej5t = { compressPacket };
const _ref_8kh2y0 = { vertexAttrib3f };
const _ref_o3hcv2 = { scaleMatrix };
const _ref_6n6nd7 = { loadDriver };
const _ref_plb555 = { lockRow };
const _ref_i6c5oo = { formatLogMessage };
const _ref_6vswmg = { streamToPlayer };
const _ref_q2vwsx = { convertRGBtoHSL };
const _ref_9tseaw = { applyPerspective };
const _ref_3rhff5 = { configureInterface };
const _ref_2tcjlp = { terminateSession };
const _ref_m7lgpg = { detachThread };
const _ref_twzujq = { visitNode };
const _ref_y80mtj = { showNotification };
const _ref_2urs2b = { generateSourceMap };
const _ref_at9pxw = { getFileAttributes };
const _ref_u19r8g = { connectionPooling };
const _ref_kadv15 = { parseTorrentFile };
const _ref_vtjnlw = { detectDarkMode };
const _ref_hi28sh = { getExtension };
const _ref_i2r18t = { rayIntersectTriangle };
const _ref_s0nef3 = { segmentImageUNet };
const _ref_mpmv51 = { processAudioBuffer };
const _ref_s68qom = { applyTheme };
const _ref_g9ypc9 = { uniform1i };
const _ref_cutiox = { createCapsuleShape };
const _ref_3z57vo = { muteStream };
const _ref_m1e6ap = { calculateMD5 };
const _ref_mz5pib = { compileFragmentShader };
const _ref_dmy7b5 = { mountFileSystem };
const _ref_ahgdfy = { TelemetryClient };
const _ref_6o8hka = { decompressPacket };
const _ref_itswc6 = { inlineFunctions };
const _ref_acf6cu = { backupDatabase };
const _ref_ymovrp = { setDelayTime };
const _ref_6qpd2w = { setRelease };
const _ref_mw9pcr = { checkTypes };
const _ref_n8vuj2 = { generateUUIDv5 };
const _ref_jxq30y = { resampleAudio };
const _ref_h8scoq = { registerSystemTray };
const _ref_pp7uo2 = { registerISR };
const _ref_qpiyza = { validateProgram };
const _ref_jsjsns = { lazyLoadComponent };
const _ref_xwle4l = { formatCurrency };
const _ref_qjxn2f = { deobfuscateString };
const _ref_24ehqc = { loadTexture };
const _ref_jdgncg = { createAnalyser };
const _ref_0ptznw = { traverseAST };
const _ref_jukap6 = { chdir };
const _ref_8si46n = { enableBlend };
const _ref_16esqn = { obfuscateCode };
const _ref_p3wm9n = { createDirectoryRecursive };
const _ref_cw3rns = { analyzeQueryPlan };
const _ref_7pelv7 = { setAngularVelocity };
const _ref_ek5ve4 = { rotateUserAgent }; 
    });
})({}, {});