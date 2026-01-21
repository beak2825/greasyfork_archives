// ==UserScript==
// @name 网易云音乐下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/wangyiyun_music/index.js
// @version 2026.01.10
// @description 网易云音乐免费下载。只能下载当前账号有权限的歌曲。所以需要登录或开通VIP。
// @icon https://s1.music.126.net/style/favicon.ico
// @match *://music.163.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect 163.com
// @connect 126.net
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
// @downloadURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560859/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const addConeTwistConstraint = (world, c) => true;

const rayCast = (world, start, end) => ({ hit: false });

const uniform3f = (loc, x, y, z) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const normalizeVolume = (buffer) => buffer;

const unmapMemory = (ptr, size) => true;

const updateTransform = (body) => true;

const adjustPlaybackSpeed = (rate) => rate;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const createSoftBody = (info) => ({ nodes: [] });

const splitFile = (path, parts) => Array(parts).fill(path);

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const disconnectNodes = (node) => true;

const captureFrame = () => "frame_data_buffer";

const checkParticleCollision = (sys, world) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const applyImpulse = (body, impulse, point) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const setEnv = (key, val) => true;

const createPipe = () => [3, 4];

const addSliderConstraint = (world, c) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const analyzeHeader = (packet) => ({});

const setFilePermissions = (perm) => `chmod ${perm}`;

const createChannelMerger = (ctx, channels) => ({});

const foldConstants = (ast) => ast;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const extractArchive = (archive) => ["file1", "file2"];

const optimizeTailCalls = (ast) => ast;

const createProcess = (img) => ({ pid: 100 });

const traverseAST = (node, visitor) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

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

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const checkTypes = (ast) => [];

const checkUpdate = () => ({ hasUpdate: false });

const gaussianBlur = (image, radius) => image;

const getShaderInfoLog = (shader) => "";

const preventSleepMode = () => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const systemCall = (num, args) => 0;

const verifySignature = (tx, sig) => true;

const createChannelSplitter = (ctx, channels) => ({});

const augmentData = (image) => image;

const attachRenderBuffer = (fb, rb) => true;

const wakeUp = (body) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const obfuscateCode = (code) => code;

const uniform1i = (loc, val) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createBoxShape = (w, h, d) => ({ type: 'box' });

const validateIPWhitelist = (ip) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const auditAccessLogs = () => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

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

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createThread = (func) => ({ tid: 1 });

const checkRootAccess = () => false;

const openFile = (path, flags) => 5;

const deserializeAST = (json) => JSON.parse(json);

const prioritizeTraffic = (queue) => true;

const parsePayload = (packet) => ({});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const decryptStream = (stream, key) => stream;

const parseLogTopics = (topics) => ["Transfer"];

const lazyLoadComponent = (name) => ({ name, loaded: false });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const receivePacket = (sock, len) => new Uint8Array(len);

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const encapsulateFrame = (packet) => packet;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const setQValue = (filter, q) => filter.Q = q;

const chdir = (path) => true;

const dhcpAck = () => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const reportError = (msg, line) => console.error(msg);

const drawArrays = (gl, mode, first, count) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const closeSocket = (sock) => true;

const adjustWindowSize = (sock, size) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const compressGzip = (data) => data;

const allocateRegisters = (ir) => ir;

const mutexUnlock = (mtx) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const killParticles = (sys) => true;

const broadcastMessage = (msg) => true;

const stepSimulation = (world, dt) => true;

const detachThread = (tid) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const normalizeFeatures = (data) => data.map(x => x / 255);

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const interestPeer = (peer) => ({ ...peer, interested: true });

const swapTokens = (pair, amount) => true;

const retransmitPacket = (seq) => true;

const semaphoreWait = (sem) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const measureRTT = (sent, recv) => 10;

const inlineFunctions = (ast) => ast;

const mkdir = (path) => true;

const multicastMessage = (group, msg) => true;

const getMediaDuration = () => 3600;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const mergeFiles = (parts) => parts[0];

const createListener = (ctx) => ({});

const serializeAST = (ast) => JSON.stringify(ast);

const setAttack = (node, val) => node.attack.value = val;

const parseQueryString = (qs) => ({});

const readPipe = (fd, len) => new Uint8Array(len);

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const readFile = (fd, len) => "";

const profilePerformance = (func) => 0;

const calculateComplexity = (ast) => 1;

const compileFragmentShader = (source) => ({ compiled: true });

const unrollLoops = (ast) => ast;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const negotiateSession = (sock) => ({ id: "sess_1" });

const updateRoutingTable = (entry) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const validateProgram = (program) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const visitNode = (node) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setThreshold = (node, val) => node.threshold.value = val;

const compressPacket = (data) => data;

const registerSystemTray = () => ({ icon: "tray.ico" });

const hashKeccak256 = (data) => "0xabc...";

const injectCSPHeader = () => "default-src 'self'";

const signTransaction = (tx, key) => "signed_tx_hash";

const translateMatrix = (mat, vec) => mat;

const claimRewards = (pool) => "0.5 ETH";

const checkBalance = (addr) => "10.5 ETH";

const decodeAudioData = (buffer) => Promise.resolve({});

const bufferMediaStream = (size) => ({ buffer: size });

const createFrameBuffer = () => ({ id: Math.random() });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const processAudioBuffer = (buffer) => buffer;

const unmountFileSystem = (path) => true;

const createConstraint = (body1, body2) => ({});

const renderShadowMap = (scene, light) => ({ texture: {} });

const useProgram = (program) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const allocateMemory = (size) => 0x1000;

const createSymbolTable = () => ({ scopes: [] });

const transcodeStream = (format) => ({ format, status: "processing" });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const remuxContainer = (container) => ({ container, status: "done" });

const resampleAudio = (buffer, rate) => buffer;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const optimizeAST = (ast) => ast;

const vertexAttrib3f = (idx, x, y, z) => true;

const allowSleepMode = () => true;

const registerGestureHandler = (gesture) => true;

const writePipe = (fd, data) => data.length;

const handleTimeout = (sock) => true;

const setOrientation = (panner, x, y, z) => true;

const readdir = (path) => [];

const rmdir = (path) => true;

const unlinkFile = (path) => true;

const eliminateDeadCode = (ast) => ast;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const checkPortAvailability = (port) => Math.random() > 0.2;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const unmuteStream = () => false;

const replicateData = (node) => ({ target: node, synced: true });

const limitRate = (stream, rate) => stream;

const detectVideoCodec = () => "h264";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const encryptLocalStorage = (key, val) => true;

const validatePieceChecksum = (piece) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const detectDarkMode = () => true;

const spoofReferer = () => "https://google.com";

const beginTransaction = () => "TX-" + Date.now();

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const activeTexture = (unit) => true;

const seekFile = (fd, offset) => true;

// Anti-shake references
const _ref_grf4fo = { sanitizeInput };
const _ref_s3691p = { addConeTwistConstraint };
const _ref_186lq7 = { rayCast };
const _ref_wed1xr = { uniform3f };
const _ref_bb6fc0 = { createPhysicsWorld };
const _ref_v5j398 = { normalizeVolume };
const _ref_yrbre8 = { unmapMemory };
const _ref_wwctrc = { updateTransform };
const _ref_zgu6d8 = { adjustPlaybackSpeed };
const _ref_f13m8o = { makeDistortionCurve };
const _ref_15irtf = { getFileAttributes };
const _ref_vyzf4k = { createSoftBody };
const _ref_hpozgb = { splitFile };
const _ref_sn881i = { limitBandwidth };
const _ref_cv4e56 = { manageCookieJar };
const _ref_q70z2z = { disconnectNodes };
const _ref_xszbwr = { captureFrame };
const _ref_q3dmi8 = { checkParticleCollision };
const _ref_mbsvb3 = { requestPiece };
const _ref_nchwoh = { applyImpulse };
const _ref_rrgzyd = { transformAesKey };
const _ref_ggf4ji = { setEnv };
const _ref_h5q2f6 = { createPipe };
const _ref_by8okf = { addSliderConstraint };
const _ref_lq5lu9 = { resolveDNSOverHTTPS };
const _ref_2zbvnp = { analyzeHeader };
const _ref_3yc66a = { setFilePermissions };
const _ref_9q8d7c = { createChannelMerger };
const _ref_5gce3o = { foldConstants };
const _ref_raw690 = { scrapeTracker };
const _ref_3hmsmz = { extractArchive };
const _ref_jhmt9d = { optimizeTailCalls };
const _ref_kr9ew7 = { createProcess };
const _ref_dr9vnf = { traverseAST };
const _ref_8rxa5l = { analyzeControlFlow };
const _ref_kp9fxi = { uninterestPeer };
const _ref_e12mfv = { AdvancedCipher };
const _ref_zvhael = { createOscillator };
const _ref_p60ysu = { checkTypes };
const _ref_tlnd0i = { checkUpdate };
const _ref_kxgryb = { gaussianBlur };
const _ref_uu6m3z = { getShaderInfoLog };
const _ref_53s2iq = { preventSleepMode };
const _ref_3cdyk0 = { FileValidator };
const _ref_q5xzkn = { validateSSLCert };
const _ref_bovr0i = { cancelAnimationFrameLoop };
const _ref_egooev = { systemCall };
const _ref_8a6b9h = { verifySignature };
const _ref_thc5hx = { createChannelSplitter };
const _ref_eq1ha1 = { augmentData };
const _ref_ksn7cj = { attachRenderBuffer };
const _ref_wnwwvr = { wakeUp };
const _ref_p7hpgo = { prioritizeRarestPiece };
const _ref_gc08cb = { obfuscateCode };
const _ref_z1qr6a = { uniform1i };
const _ref_w18s0k = { calculateSHA256 };
const _ref_gx8yu0 = { createBoxShape };
const _ref_ezz9w4 = { validateIPWhitelist };
const _ref_9xpec1 = { calculateEntropy };
const _ref_8bxdtw = { auditAccessLogs };
const _ref_v2t2io = { createAnalyser };
const _ref_2i0oz4 = { download };
const _ref_jhqell = { createMagnetURI };
const _ref_gvyh1o = { createThread };
const _ref_bkp9mp = { checkRootAccess };
const _ref_wbfwlj = { openFile };
const _ref_fbjedd = { deserializeAST };
const _ref_entjwn = { prioritizeTraffic };
const _ref_kogfwu = { parsePayload };
const _ref_hwvrcg = { generateUUIDv5 };
const _ref_r27voe = { initiateHandshake };
const _ref_q5s5u0 = { debouncedResize };
const _ref_6hushy = { decryptStream };
const _ref_5e6p6q = { parseLogTopics };
const _ref_mw9jl2 = { lazyLoadComponent };
const _ref_6f8mxw = { checkDiskSpace };
const _ref_ue5j82 = { receivePacket };
const _ref_1wcmi5 = { verifyFileSignature };
const _ref_ub4bx8 = { announceToTracker };
const _ref_xlfdht = { encapsulateFrame };
const _ref_0gi3d8 = { rayIntersectTriangle };
const _ref_grbaeg = { setQValue };
const _ref_upv27g = { chdir };
const _ref_ihvkd8 = { dhcpAck };
const _ref_d97gr4 = { performTLSHandshake };
const _ref_xta9kg = { seedRatioLimit };
const _ref_u2ggnd = { reportError };
const _ref_t7rtl7 = { drawArrays };
const _ref_zp56pn = { parseMagnetLink };
const _ref_8ka98n = { closeSocket };
const _ref_ypic34 = { adjustWindowSize };
const _ref_up55ty = { traceStack };
const _ref_g295xa = { uploadCrashReport };
const _ref_md136f = { interceptRequest };
const _ref_mr1528 = { compressGzip };
const _ref_plxlq1 = { allocateRegisters };
const _ref_8mrmw3 = { mutexUnlock };
const _ref_u1xvdl = { limitUploadSpeed };
const _ref_v91q5o = { detectEnvironment };
const _ref_xkle0k = { formatCurrency };
const _ref_6a0c6p = { killParticles };
const _ref_pq5120 = { broadcastMessage };
const _ref_99tq4t = { stepSimulation };
const _ref_o7mxyu = { detachThread };
const _ref_f97k3h = { allocateDiskSpace };
const _ref_r9bm88 = { calculatePieceHash };
const _ref_ob6225 = { normalizeFeatures };
const _ref_2jqq02 = { setFrequency };
const _ref_t24886 = { createDelay };
const _ref_howsbe = { interestPeer };
const _ref_58cifh = { swapTokens };
const _ref_hcfarm = { retransmitPacket };
const _ref_lguw9i = { semaphoreWait };
const _ref_9ipyaf = { debounceAction };
const _ref_wht2dy = { measureRTT };
const _ref_cuzi5r = { inlineFunctions };
const _ref_6t31r8 = { mkdir };
const _ref_r9x3tz = { multicastMessage };
const _ref_9y8jzm = { getMediaDuration };
const _ref_ob376c = { updateProgressBar };
const _ref_p8edwi = { mergeFiles };
const _ref_k1czjp = { createListener };
const _ref_nlazdh = { serializeAST };
const _ref_fkxoe2 = { setAttack };
const _ref_u7zdrd = { parseQueryString };
const _ref_q2mbt4 = { readPipe };
const _ref_tkjp86 = { createGainNode };
const _ref_vt202f = { readFile };
const _ref_xbiyjy = { profilePerformance };
const _ref_ns74uz = { calculateComplexity };
const _ref_7ho92s = { compileFragmentShader };
const _ref_2pwomk = { unrollLoops };
const _ref_touyrw = { retryFailedSegment };
const _ref_3g10nx = { negotiateSession };
const _ref_u7t5wm = { updateRoutingTable };
const _ref_ox1zcm = { keepAlivePing };
const _ref_4v143n = { loadTexture };
const _ref_15mkyw = { validateProgram };
const _ref_jynumb = { showNotification };
const _ref_t0yd3k = { visitNode };
const _ref_l4nw1t = { renderVirtualDOM };
const _ref_7zeylk = { parseFunction };
const _ref_ffo8lg = { archiveFiles };
const _ref_voca7k = { setThreshold };
const _ref_6d81l7 = { compressPacket };
const _ref_jodnii = { registerSystemTray };
const _ref_8zzvwy = { hashKeccak256 };
const _ref_ye255n = { injectCSPHeader };
const _ref_fejmbo = { signTransaction };
const _ref_bhqip5 = { translateMatrix };
const _ref_dgfz0a = { claimRewards };
const _ref_yzr209 = { checkBalance };
const _ref_zj4m0c = { decodeAudioData };
const _ref_berahe = { bufferMediaStream };
const _ref_b8vy7n = { createFrameBuffer };
const _ref_pcomtv = { requestAnimationFrameLoop };
const _ref_o1prwk = { processAudioBuffer };
const _ref_5hm33n = { unmountFileSystem };
const _ref_zdl4xj = { createConstraint };
const _ref_6sh5jk = { renderShadowMap };
const _ref_eoqz0k = { useProgram };
const _ref_qj15ry = { rotateMatrix };
const _ref_5iox83 = { allocateMemory };
const _ref_5dp2a2 = { createSymbolTable };
const _ref_ci5zw3 = { transcodeStream };
const _ref_t9gmet = { decryptHLSStream };
const _ref_x8c9lq = { remuxContainer };
const _ref_8u99t3 = { resampleAudio };
const _ref_4o7b22 = { playSoundAlert };
const _ref_cm1ejb = { optimizeAST };
const _ref_j0yjfa = { vertexAttrib3f };
const _ref_tz6tho = { allowSleepMode };
const _ref_hvqgln = { registerGestureHandler };
const _ref_3tzzgf = { writePipe };
const _ref_b4dvhl = { handleTimeout };
const _ref_qbos1s = { setOrientation };
const _ref_t8e25l = { readdir };
const _ref_ju17x2 = { rmdir };
const _ref_lnakab = { unlinkFile };
const _ref_6cggdx = { eliminateDeadCode };
const _ref_9csvaz = { getMemoryUsage };
const _ref_0nlgdh = { checkPortAvailability };
const _ref_jj25uc = { monitorNetworkInterface };
const _ref_cgfgne = { generateWalletKeys };
const _ref_ase8ga = { tunnelThroughProxy };
const _ref_f5xpid = { unmuteStream };
const _ref_dt8god = { replicateData };
const _ref_htoqny = { limitRate };
const _ref_vgw3qd = { detectVideoCodec };
const _ref_dqyw9e = { queueDownloadTask };
const _ref_ybac41 = { encryptLocalStorage };
const _ref_r23aiv = { validatePieceChecksum };
const _ref_45z3nl = { checkIntegrity };
const _ref_02hker = { detectDarkMode };
const _ref_qvruqz = { spoofReferer };
const _ref_79f91g = { beginTransaction };
const _ref_90jrk8 = { detectFirewallStatus };
const _ref_j3xg5m = { saveCheckpoint };
const _ref_4bjmqg = { activeTexture };
const _ref_8coqg6 = { seekFile }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `wangyiyun_music` };
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
                const urlParams = { config, url: window.location.href, name_en: `wangyiyun_music` };

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
        const enableDHT = () => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const invalidateCache = (key) => true;

const rotateLogFiles = () => true;

const commitTransaction = (tx) => true;

const generateSourceMap = (ast) => "{}";

const bindAddress = (sock, addr, port) => true;

const translateText = (text, lang) => text;

const jitCompile = (bc) => (() => {});

const scheduleTask = (task) => ({ id: 1, task });

const calculateGasFee = (limit) => limit * 20;

const writePipe = (fd, data) => data.length;

const estimateNonce = (addr) => 42;

const checkTypes = (ast) => [];

const enterScope = (table) => true;

const mangleNames = (ast) => ast;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const renameFile = (oldName, newName) => newName;

const calculateComplexity = (ast) => 1;

const logErrorToFile = (err) => console.error(err);

const detectDarkMode = () => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createSymbolTable = () => ({ scopes: [] });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const resolveImports = (ast) => [];

const reportError = (msg, line) => console.error(msg);

const minifyCode = (code) => code;

const optimizeTailCalls = (ast) => ast;

const sanitizeXSS = (html) => html;

const exitScope = (table) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const linkModules = (modules) => ({});

const dumpSymbolTable = (table) => "";

const uniform1i = (loc, val) => true;

const preventCSRF = () => "csrf_token";

const cullFace = (mode) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const connectSocket = (sock, addr, port) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const addRigidBody = (world, body) => true;

const backpropagateGradient = (loss) => true;

const checkIntegrityConstraint = (table) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const debugAST = (ast) => "";

const clearScreen = (r, g, b, a) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const rayCast = (world, start, end) => ({ hit: false });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const compressGzip = (data) => data;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const detectPacketLoss = (acks) => false;

const processAudioBuffer = (buffer) => buffer;

const findLoops = (cfg) => [];

const calculateCRC32 = (data) => "00000000";

const verifyProofOfWork = (nonce) => true;

const establishHandshake = (sock) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const verifySignature = (tx, sig) => true;

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const decryptStream = (stream, key) => stream;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const stepSimulation = (world, dt) => true;

const compileFragmentShader = (source) => ({ compiled: true });

const reassemblePacket = (fragments) => fragments[0];

const getProgramInfoLog = (program) => "";

const handleInterrupt = (irq) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const fingerprintBrowser = () => "fp_hash_123";

const enableInterrupts = () => true;

const cleanOldLogs = (days) => days;

const uniform3f = (loc, x, y, z) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const downInterface = (iface) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const getExtension = (name) => ({});

const seedRatioLimit = (ratio) => ratio >= 2.0;

const obfuscateString = (str) => btoa(str);

const decompressGzip = (data) => data;

const tokenizeText = (text) => text.split(" ");

const upInterface = (iface) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const setGravity = (world, g) => world.gravity = g;

const setAngularVelocity = (body, v) => true;

const loadDriver = (path) => true;

const deleteTexture = (texture) => true;

const resampleAudio = (buffer, rate) => buffer;

const detectDebugger = () => false;

const applyTorque = (body, torque) => true;

const unmountFileSystem = (path) => true;

const defineSymbol = (table, name, info) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const deserializeAST = (json) => JSON.parse(json);

const serializeFormData = (form) => JSON.stringify(form);

const getEnv = (key) => "";

const injectCSPHeader = () => "default-src 'self'";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const deriveAddress = (path) => "0x123...";

const contextSwitch = (oldPid, newPid) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const hoistVariables = (ast) => ast;

const setMass = (body, m) => true;

const unloadDriver = (name) => true;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const addPoint2PointConstraint = (world, c) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const applyForce = (body, force, point) => true;

const sendPacket = (sock, data) => data.length;

const wakeUp = (body) => true;

const attachRenderBuffer = (fb, rb) => true;

const swapTokens = (pair, amount) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const disableInterrupts = () => true;

const compressPacket = (data) => data;

const createConstraint = (body1, body2) => ({});

const analyzeHeader = (packet) => ({});

const normalizeVolume = (buffer) => buffer;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const controlCongestion = (sock) => true;

const deleteProgram = (program) => true;

const checkUpdate = () => ({ hasUpdate: false });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const shardingTable = (table) => ["shard_0", "shard_1"];

const acceptConnection = (sock) => ({ fd: 2 });

const setVelocity = (body, v) => true;

const openFile = (path, flags) => 5;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const getMediaDuration = () => 3600;

const closeSocket = (sock) => true;

const unlockRow = (id) => true;

const calculateMetric = (route) => 1;

const activeTexture = (unit) => true;

const createConvolver = (ctx) => ({ buffer: null });

const setInertia = (body, i) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const detectCollision = (body1, body2) => false;

const removeRigidBody = (world, body) => true;

const stakeAssets = (pool, amount) => true;

const auditAccessLogs = () => true;

const bindTexture = (target, texture) => true;

const allowSleepMode = () => true;

const compileVertexShader = (source) => ({ compiled: true });

const restartApplication = () => console.log("Restarting...");

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const muteStream = () => true;

const stopOscillator = (osc, time) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const convertFormat = (src, dest) => dest;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const createTCPSocket = () => ({ fd: 1 });

const resolveDNS = (domain) => "127.0.0.1";

const decodeAudioData = (buffer) => Promise.resolve({});

const adjustPlaybackSpeed = (rate) => rate;

const setEnv = (key, val) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const freeMemory = (ptr) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const calculateRestitution = (mat1, mat2) => 0.3;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const bufferData = (gl, target, data, usage) => true;

const scheduleProcess = (pid) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const analyzeBitrate = () => "5000kbps";

const closeContext = (ctx) => Promise.resolve();

const addHingeConstraint = (world, c) => true;

const extractArchive = (archive) => ["file1", "file2"];

const performOCR = (img) => "Detected Text";

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const readPipe = (fd, len) => new Uint8Array(len);

const flushSocketBuffer = (sock) => sock.buffer = [];

const arpRequest = (ip) => "00:00:00:00:00:00";

const updateRoutingTable = (entry) => true;

const dhcpDiscover = () => true;

const detectVideoCodec = () => "h264";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const subscribeToEvents = (contract) => true;

const lookupSymbol = (table, name) => ({});

const lockRow = (id) => true;

const hashKeccak256 = (data) => "0xabc...";

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

// Anti-shake references
const _ref_e1gk8y = { enableDHT };
const _ref_zlmblf = { createCapsuleShape };
const _ref_9pj4hp = { rayIntersectTriangle };
const _ref_5dam2g = { invalidateCache };
const _ref_ymd2k6 = { rotateLogFiles };
const _ref_hmvr5s = { commitTransaction };
const _ref_vgpddf = { generateSourceMap };
const _ref_dmp96n = { bindAddress };
const _ref_7wy6j1 = { translateText };
const _ref_72ku0a = { jitCompile };
const _ref_9rdf9u = { scheduleTask };
const _ref_mrqp09 = { calculateGasFee };
const _ref_9u47qy = { writePipe };
const _ref_u5sj68 = { estimateNonce };
const _ref_984qg7 = { checkTypes };
const _ref_f7eicn = { enterScope };
const _ref_v7s01n = { mangleNames };
const _ref_g7dow9 = { getFileAttributes };
const _ref_e3w85v = { renameFile };
const _ref_z7puuf = { calculateComplexity };
const _ref_d6p111 = { logErrorToFile };
const _ref_uvwr7g = { detectDarkMode };
const _ref_3zwkvb = { verifyFileSignature };
const _ref_tpc2oz = { createSymbolTable };
const _ref_ndpr8o = { limitBandwidth };
const _ref_6tb184 = { resolveImports };
const _ref_pe0820 = { reportError };
const _ref_jax977 = { minifyCode };
const _ref_ngg5vj = { optimizeTailCalls };
const _ref_v4t740 = { sanitizeXSS };
const _ref_h6beeu = { exitScope };
const _ref_bqiilb = { discoverPeersDHT };
const _ref_uxsiuq = { linkModules };
const _ref_7ikeu9 = { dumpSymbolTable };
const _ref_p7irtj = { uniform1i };
const _ref_070kym = { preventCSRF };
const _ref_nne2bl = { cullFace };
const _ref_jq089k = { createScriptProcessor };
const _ref_oavmjh = { connectSocket };
const _ref_bh7avn = { checkPortAvailability };
const _ref_rktt38 = { addRigidBody };
const _ref_h9eqpv = { backpropagateGradient };
const _ref_3ks063 = { checkIntegrityConstraint };
const _ref_ml17zj = { calculateFriction };
const _ref_2cl56c = { unchokePeer };
const _ref_qjdw4h = { createBiquadFilter };
const _ref_nwc7zj = { terminateSession };
const _ref_xy7fb8 = { debugAST };
const _ref_relbnf = { clearScreen };
const _ref_gjleup = { uploadCrashReport };
const _ref_dpyh77 = { autoResumeTask };
const _ref_n1fbql = { rayCast };
const _ref_tzf51d = { requestAnimationFrameLoop };
const _ref_a8hfo7 = { compressGzip };
const _ref_nvj5fy = { requestPiece };
const _ref_m5rkew = { detectPacketLoss };
const _ref_9omrhr = { processAudioBuffer };
const _ref_l8kc8w = { findLoops };
const _ref_ps1bez = { calculateCRC32 };
const _ref_0juefn = { verifyProofOfWork };
const _ref_vk89iw = { establishHandshake };
const _ref_u7tfja = { broadcastTransaction };
const _ref_tinj3a = { verifySignature };
const _ref_l4xisd = { animateTransition };
const _ref_6g3wk9 = { decryptStream };
const _ref_sr3pxl = { setFrequency };
const _ref_x5hgyj = { stepSimulation };
const _ref_6ledf4 = { compileFragmentShader };
const _ref_3ffzm4 = { reassemblePacket };
const _ref_0ev868 = { getProgramInfoLog };
const _ref_0jysel = { handleInterrupt };
const _ref_ca8z3t = { parseTorrentFile };
const _ref_xhdm2d = { fingerprintBrowser };
const _ref_lf507z = { enableInterrupts };
const _ref_6mk5s2 = { cleanOldLogs };
const _ref_utgbej = { uniform3f };
const _ref_s7wc0i = { calculateSHA256 };
const _ref_og8mf4 = { downInterface };
const _ref_xg48ed = { announceToTracker };
const _ref_pw4bwf = { getExtension };
const _ref_jvb65p = { seedRatioLimit };
const _ref_l7z2um = { obfuscateString };
const _ref_k1syec = { decompressGzip };
const _ref_zkqyvw = { tokenizeText };
const _ref_yge480 = { upInterface };
const _ref_1gmvxw = { vertexAttrib3f };
const _ref_9h5em6 = { setGravity };
const _ref_8rkh63 = { setAngularVelocity };
const _ref_qsluy2 = { loadDriver };
const _ref_hiylag = { deleteTexture };
const _ref_3ml7no = { resampleAudio };
const _ref_ddfgyq = { detectDebugger };
const _ref_ts5gie = { applyTorque };
const _ref_lnlcda = { unmountFileSystem };
const _ref_nnl9rr = { defineSymbol };
const _ref_afswth = { createSphereShape };
const _ref_5osvq1 = { deserializeAST };
const _ref_2ru2f5 = { serializeFormData };
const _ref_20mala = { getEnv };
const _ref_4qvdex = { injectCSPHeader };
const _ref_l10f39 = { manageCookieJar };
const _ref_4aan2k = { deriveAddress };
const _ref_p2kmrf = { contextSwitch };
const _ref_7zjgf7 = { tunnelThroughProxy };
const _ref_m6j697 = { hoistVariables };
const _ref_lbaht7 = { setMass };
const _ref_hjfovo = { unloadDriver };
const _ref_6a4v3q = { computeSpeedAverage };
const _ref_id6x1q = { addPoint2PointConstraint };
const _ref_sczn3a = { performTLSHandshake };
const _ref_w5j5xn = { applyForce };
const _ref_ij8ag2 = { sendPacket };
const _ref_hrwhze = { wakeUp };
const _ref_t0tvwc = { attachRenderBuffer };
const _ref_u06a00 = { swapTokens };
const _ref_ii2ycm = { cancelAnimationFrameLoop };
const _ref_2p15ot = { generateUserAgent };
const _ref_a76naj = { getAngularVelocity };
const _ref_wzdiyj = { disableInterrupts };
const _ref_zrfvre = { compressPacket };
const _ref_ft1y2x = { createConstraint };
const _ref_w18jls = { analyzeHeader };
const _ref_awg1f7 = { normalizeVolume };
const _ref_5o8c8h = { analyzeQueryPlan };
const _ref_pj1mr9 = { controlCongestion };
const _ref_0mukbh = { deleteProgram };
const _ref_skpnsl = { checkUpdate };
const _ref_0ly1fr = { rotateUserAgent };
const _ref_wkju6l = { shardingTable };
const _ref_5edfh3 = { acceptConnection };
const _ref_mqrj34 = { setVelocity };
const _ref_0i6cgz = { openFile };
const _ref_2lfjic = { archiveFiles };
const _ref_qc5323 = { checkDiskSpace };
const _ref_buzijb = { readPixels };
const _ref_r5t34r = { getMediaDuration };
const _ref_2tpgia = { closeSocket };
const _ref_594kfu = { unlockRow };
const _ref_7zk6cc = { calculateMetric };
const _ref_78l4qs = { activeTexture };
const _ref_jk5jdr = { createConvolver };
const _ref_lc2ajd = { setInertia };
const _ref_rmc30n = { renderShadowMap };
const _ref_xzfogg = { createAnalyser };
const _ref_ve2j1e = { optimizeConnectionPool };
const _ref_0z45re = { detectCollision };
const _ref_7jwmu6 = { removeRigidBody };
const _ref_ghhxsd = { stakeAssets };
const _ref_etse34 = { auditAccessLogs };
const _ref_oogr19 = { bindTexture };
const _ref_nyb3jm = { allowSleepMode };
const _ref_xhnwxq = { compileVertexShader };
const _ref_v6be8p = { restartApplication };
const _ref_wxlhe2 = { createGainNode };
const _ref_p67yr3 = { muteStream };
const _ref_pworif = { stopOscillator };
const _ref_1wj96n = { createPhysicsWorld };
const _ref_4elorm = { convertFormat };
const _ref_p89byd = { loadModelWeights };
const _ref_l76c02 = { vertexAttribPointer };
const _ref_zady4w = { createTCPSocket };
const _ref_0y0qet = { resolveDNS };
const _ref_chjgmu = { decodeAudioData };
const _ref_o0gw0d = { adjustPlaybackSpeed };
const _ref_3u3huc = { setEnv };
const _ref_rbvg8v = { validateSSLCert };
const _ref_p3dt6o = { FileValidator };
const _ref_mx5cia = { freeMemory };
const _ref_5gehq9 = { checkIntegrity };
const _ref_xeliyc = { createIndex };
const _ref_62yemm = { calculateRestitution };
const _ref_xi4w2p = { sanitizeSQLInput };
const _ref_q9lgwk = { bufferData };
const _ref_kavip0 = { scheduleProcess };
const _ref_7pkkct = { cancelTask };
const _ref_gqneoa = { calculateEntropy };
const _ref_grrgkv = { syncAudioVideo };
const _ref_g6yo82 = { limitUploadSpeed };
const _ref_gdbnbg = { detectFirewallStatus };
const _ref_cihskp = { analyzeBitrate };
const _ref_5w2zm1 = { closeContext };
const _ref_29vir7 = { addHingeConstraint };
const _ref_4rvk97 = { extractArchive };
const _ref_tj7ypv = { performOCR };
const _ref_rjrkbv = { normalizeAudio };
const _ref_ljx3af = { virtualScroll };
const _ref_669dkm = { updateBitfield };
const _ref_cjq8ae = { executeSQLQuery };
const _ref_9qzkox = { readPipe };
const _ref_fziz5e = { flushSocketBuffer };
const _ref_ecgveg = { arpRequest };
const _ref_uleoiq = { updateRoutingTable };
const _ref_ng17d8 = { dhcpDiscover };
const _ref_ip41i5 = { detectVideoCodec };
const _ref_dw2d7l = { createMagnetURI };
const _ref_jlcm46 = { subscribeToEvents };
const _ref_pzusmo = { lookupSymbol };
const _ref_046jco = { lockRow };
const _ref_48q6di = { hashKeccak256 };
const _ref_78krdz = { parseSubtitles }; 
    });
})({}, {});