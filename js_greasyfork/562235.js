// ==UserScript==
// @name bfmtv视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/bfmtv/index.js
// @version 2026.01.10
// @description 一键下载bfmtv视频，支持4K/1080P/720P多画质。
// @icon https://www.bfmtv.com/favicon.ico
// @match *://*.bfmtv.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bfmtv.com
// @connect brightcove.net
// @connect api.brightcove.com
// @connect prod.boltdns.net
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
// @downloadURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562235/bfmtv%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const createDirectoryRecursive = (path) => path.split('/').length;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const parseQueryString = (qs) => ({});

const flushSocketBuffer = (sock) => sock.buffer = [];

const performOCR = (img) => "Detected Text";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const synthesizeSpeech = (text) => "audio_buffer";

const extractArchive = (archive) => ["file1", "file2"];

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const computeLossFunction = (pred, actual) => 0.05;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const tokenizeText = (text) => text.split(" ");

const checkBalance = (addr) => "10.5 ETH";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const getBlockHeight = () => 15000000;

const getMediaDuration = () => 3600;

const claimRewards = (pool) => "0.5 ETH";

const beginTransaction = () => "TX-" + Date.now();

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const preventSleepMode = () => true;


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

const hydrateSSR = (html) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };


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

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

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

const rateLimitCheck = (ip) => true;

const spoofReferer = () => "https://google.com";

const cancelTask = (id) => ({ id, cancelled: true });

const registerGestureHandler = (gesture) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const compressGzip = (data) => data;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const getCpuLoad = () => Math.random() * 100;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const obfuscateString = (str) => btoa(str);

const unlockRow = (id) => true;

const dropTable = (table) => true;

const validateFormInput = (input) => input.length > 0;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const swapTokens = (pair, amount) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const seedRatioLimit = (ratio) => ratio >= 2.0;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const injectMetadata = (file, meta) => ({ file, meta });

const bindSocket = (port) => ({ port, status: "bound" });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const rotateMatrix = (mat, angle, axis) => mat;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const getShaderInfoLog = (shader) => "";

const detectCollision = (body1, body2) => false;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const dhcpAck = () => true;

const joinThread = (tid) => true;

const verifyIR = (ir) => true;

const encryptPeerTraffic = (data) => btoa(data);

const resolveSymbols = (ast) => ({});

const decapsulateFrame = (frame) => frame;

const validatePieceChecksum = (piece) => true;

const checkTypes = (ast) => [];

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const obfuscateCode = (code) => code;

const mutexLock = (mtx) => true;

const profilePerformance = (func) => 0;

const protectMemory = (ptr, size, flags) => true;

const chmodFile = (path, mode) => true;

const compressPacket = (data) => data;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const semaphoreSignal = (sem) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const decompressGzip = (data) => data;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const uniform1i = (loc, val) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const deobfuscateString = (str) => atob(str);

const createThread = (func) => ({ tid: 1 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const negotiateProtocol = () => "HTTP/2.0";

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const compileFragmentShader = (source) => ({ compiled: true });

const getProgramInfoLog = (program) => "";

const setDetune = (osc, cents) => osc.detune = cents;

const validateIPWhitelist = (ip) => true;

const createConstraint = (body1, body2) => ({});

const clearScreen = (r, g, b, a) => true;

const convertFormat = (src, dest) => dest;

const reduceDimensionalityPCA = (data) => data;

const getExtension = (name) => ({});

const captureFrame = () => "frame_data_buffer";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const joinGroup = (group) => true;

const detectVideoCodec = () => "h264";

const normalizeVolume = (buffer) => buffer;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const dumpSymbolTable = (table) => "";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const activeTexture = (unit) => true;

const serializeFormData = (form) => JSON.stringify(form);

const setViewport = (x, y, w, h) => true;

const foldConstants = (ast) => ast;

const statFile = (path) => ({ size: 0 });

const killProcess = (pid) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const vertexAttrib3f = (idx, x, y, z) => true;

const execProcess = (path) => true;

const closeFile = (fd) => true;

const mergeFiles = (parts) => parts[0];

const createSphereShape = (r) => ({ type: 'sphere' });

const compileVertexShader = (source) => ({ compiled: true });

const arpRequest = (ip) => "00:00:00:00:00:00";

const uniform3f = (loc, x, y, z) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const detectDebugger = () => false;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const cullFace = (mode) => true;

const deriveAddress = (path) => "0x123...";

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const compileToBytecode = (ast) => new Uint8Array();

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const unmapMemory = (ptr, size) => true;

const configureInterface = (iface, config) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const startOscillator = (osc, time) => true;

const cleanOldLogs = (days) => days;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const muteStream = () => true;

const setVelocity = (body, v) => true;

const setMass = (body, m) => true;

const writeFile = (fd, data) => true;

const unlinkFile = (path) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const prioritizeTraffic = (queue) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const mkdir = (path) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const cacheQueryResults = (key, data) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const lockFile = (path) => ({ path, locked: true });

const createFrameBuffer = () => ({ id: Math.random() });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const disconnectNodes = (node) => true;

const addHingeConstraint = (world, c) => true;

const eliminateDeadCode = (ast) => ast;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const readdir = (path) => [];

const verifyProofOfWork = (nonce) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const decryptStream = (stream, key) => stream;

const attachRenderBuffer = (fb, rb) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const checkIntegrityConstraint = (table) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createSymbolTable = () => ({ scopes: [] });

const createAudioContext = () => ({ sampleRate: 44100 });

const validateProgram = (program) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const anchorSoftBody = (soft, rigid) => true;

const updateRoutingTable = (entry) => true;

const triggerHapticFeedback = (intensity) => true;

const loadCheckpoint = (path) => true;

const deleteProgram = (program) => true;

const enableBlend = (func) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const restoreDatabase = (path) => true;

const disableInterrupts = () => true;

const checkUpdate = () => ({ hasUpdate: false });

const deleteBuffer = (buffer) => true;

// Anti-shake references
const _ref_9tgwyc = { createDirectoryRecursive };
const _ref_mn3nv2 = { monitorNetworkInterface };
const _ref_ccx9ap = { verifyFileSignature };
const _ref_qyhc1c = { getAngularVelocity };
const _ref_qg8mdq = { rotateUserAgent };
const _ref_2rx2gs = { loadModelWeights };
const _ref_c6ertx = { parseQueryString };
const _ref_7tdpe3 = { flushSocketBuffer };
const _ref_wt1h9n = { performOCR };
const _ref_bihosa = { analyzeUserBehavior };
const _ref_bhwy0h = { synthesizeSpeech };
const _ref_mrxq92 = { extractArchive };
const _ref_2s268l = { saveCheckpoint };
const _ref_8pj0el = { computeLossFunction };
const _ref_votraa = { calculateEntropy };
const _ref_0v4yqt = { createMagnetURI };
const _ref_60b3y0 = { tunnelThroughProxy };
const _ref_j9im28 = { tokenizeText };
const _ref_z9gmoe = { checkBalance };
const _ref_qn63lu = { computeSpeedAverage };
const _ref_je67as = { getBlockHeight };
const _ref_bjqul5 = { getMediaDuration };
const _ref_zk9cf7 = { claimRewards };
const _ref_y99cka = { beginTransaction };
const _ref_6p1ld7 = { applyPerspective };
const _ref_cnj7dc = { virtualScroll };
const _ref_83tofh = { preventSleepMode };
const _ref_o7qttb = { TelemetryClient };
const _ref_u10bla = { hydrateSSR };
const _ref_me1yt9 = { renderVirtualDOM };
const _ref_hie73v = { clearBrowserCache };
const _ref_gm4b7e = { validateTokenStructure };
const _ref_atbtjp = { ResourceMonitor };
const _ref_ayj0sb = { parseTorrentFile };
const _ref_0905rg = { generateWalletKeys };
const _ref_b9o77d = { VirtualFSTree };
const _ref_49x8nm = { rateLimitCheck };
const _ref_y3ytwh = { spoofReferer };
const _ref_g2c7p5 = { cancelTask };
const _ref_ywb09s = { registerGestureHandler };
const _ref_51if1x = { switchProxyServer };
const _ref_ngds5m = { traceStack };
const _ref_4jvrvp = { renderShadowMap };
const _ref_zhzpz1 = { lazyLoadComponent };
const _ref_xuy70b = { compressGzip };
const _ref_4mbhci = { parseM3U8Playlist };
const _ref_w3vdt7 = { compressDataStream };
const _ref_2do9lj = { getCpuLoad };
const _ref_5tf3ac = { showNotification };
const _ref_own7yh = { queueDownloadTask };
const _ref_pf0h4w = { detectEnvironment };
const _ref_24m0sk = { allocateDiskSpace };
const _ref_g6sq8y = { autoResumeTask };
const _ref_abs4vv = { parseConfigFile };
const _ref_3rxf46 = { convertRGBtoHSL };
const _ref_vv8kae = { obfuscateString };
const _ref_sp7b3p = { unlockRow };
const _ref_y6yfao = { dropTable };
const _ref_bayocu = { validateFormInput };
const _ref_fsvrx0 = { rayIntersectTriangle };
const _ref_4fxg80 = { swapTokens };
const _ref_lissc7 = { generateEmbeddings };
const _ref_2fes37 = { diffVirtualDOM };
const _ref_hskoql = { detectObjectYOLO };
const _ref_unq3hk = { seedRatioLimit };
const _ref_etznb5 = { resolveHostName };
const _ref_0jj9aj = { interceptRequest };
const _ref_8mk7fa = { scheduleBandwidth };
const _ref_1l0a66 = { injectMetadata };
const _ref_43auci = { bindSocket };
const _ref_qhtyz6 = { resolveDependencyGraph };
const _ref_rlseq8 = { rotateMatrix };
const _ref_t7zhv0 = { getSystemUptime };
const _ref_odoq9q = { connectToTracker };
const _ref_ozdh07 = { convertHSLtoRGB };
const _ref_nse2yb = { getShaderInfoLog };
const _ref_qjz3wk = { detectCollision };
const _ref_n2mu3m = { calculateLayoutMetrics };
const _ref_6r9ygu = { dhcpAck };
const _ref_ws7aeg = { joinThread };
const _ref_2lynpg = { verifyIR };
const _ref_dycw13 = { encryptPeerTraffic };
const _ref_pghptd = { resolveSymbols };
const _ref_u4u6qm = { decapsulateFrame };
const _ref_sqo9y6 = { validatePieceChecksum };
const _ref_pkaxkk = { checkTypes };
const _ref_35s303 = { decryptHLSStream };
const _ref_d8z2lr = { obfuscateCode };
const _ref_uxmi4s = { mutexLock };
const _ref_28t2tr = { profilePerformance };
const _ref_t8fbzd = { protectMemory };
const _ref_0qzrt7 = { chmodFile };
const _ref_6zl8r3 = { compressPacket };
const _ref_i7t9rg = { calculateSHA256 };
const _ref_oj6xt7 = { semaphoreSignal };
const _ref_k51gjd = { parseMagnetLink };
const _ref_y90ew4 = { sanitizeInput };
const _ref_nd9l2n = { decompressGzip };
const _ref_l9dhpz = { archiveFiles };
const _ref_kxwvy2 = { createScriptProcessor };
const _ref_vgb1wb = { uniform1i };
const _ref_xryaje = { createIndex };
const _ref_pgma62 = { deobfuscateString };
const _ref_w5yajd = { createThread };
const _ref_tuxirf = { throttleRequests };
const _ref_ai7mjd = { playSoundAlert };
const _ref_u7wqa8 = { optimizeMemoryUsage };
const _ref_gpiftw = { negotiateProtocol };
const _ref_ullnjc = { createBiquadFilter };
const _ref_qy4do1 = { compileFragmentShader };
const _ref_dy1117 = { getProgramInfoLog };
const _ref_07tw7v = { setDetune };
const _ref_eflkwz = { validateIPWhitelist };
const _ref_y8j2jf = { createConstraint };
const _ref_cyx69q = { clearScreen };
const _ref_35kk5k = { convertFormat };
const _ref_pj9r4h = { reduceDimensionalityPCA };
const _ref_20zu8g = { getExtension };
const _ref_oy6233 = { captureFrame };
const _ref_xyg9jx = { checkDiskSpace };
const _ref_7nbxya = { joinGroup };
const _ref_2s0xdk = { detectVideoCodec };
const _ref_nnbci2 = { normalizeVolume };
const _ref_c94ddu = { extractThumbnail };
const _ref_941egb = { dumpSymbolTable };
const _ref_0iiiof = { compactDatabase };
const _ref_xj1rig = { activeTexture };
const _ref_uzp7w1 = { serializeFormData };
const _ref_369tnx = { setViewport };
const _ref_zwe4d9 = { foldConstants };
const _ref_6bj7cg = { statFile };
const _ref_2gxgqq = { killProcess };
const _ref_vj7uyc = { transcodeStream };
const _ref_gmptv9 = { vertexAttrib3f };
const _ref_zw4uty = { execProcess };
const _ref_14dhj0 = { closeFile };
const _ref_nfauju = { mergeFiles };
const _ref_m1fn8f = { createSphereShape };
const _ref_brt5z7 = { compileVertexShader };
const _ref_6ze0gm = { arpRequest };
const _ref_o261ux = { uniform3f };
const _ref_rcrpqg = { validateSSLCert };
const _ref_l5sr9r = { resolveDNSOverHTTPS };
const _ref_7rspaw = { detectDebugger };
const _ref_pgixq7 = { generateUserAgent };
const _ref_lw3geh = { cullFace };
const _ref_x4fqkn = { deriveAddress };
const _ref_fs4q1x = { verifyMagnetLink };
const _ref_o8fk3o = { compileToBytecode };
const _ref_dzsrd7 = { createOscillator };
const _ref_yo59w9 = { streamToPlayer };
const _ref_gyh74z = { unmapMemory };
const _ref_skll6q = { configureInterface };
const _ref_7lfjsc = { uniformMatrix4fv };
const _ref_z9ci8w = { deleteTempFiles };
const _ref_crtq9a = { startOscillator };
const _ref_gdd8v0 = { cleanOldLogs };
const _ref_wmsodz = { readPixels };
const _ref_pgn5ik = { muteStream };
const _ref_rjjupb = { setVelocity };
const _ref_lbykbp = { setMass };
const _ref_cxabj9 = { writeFile };
const _ref_c508wl = { unlinkFile };
const _ref_t69ay0 = { repairCorruptFile };
const _ref_4lcf8g = { prioritizeTraffic };
const _ref_izrjre = { decodeAudioData };
const _ref_0e4pdu = { mkdir };
const _ref_hhukgo = { createCapsuleShape };
const _ref_s6c7fi = { cacheQueryResults };
const _ref_xpfbki = { negotiateSession };
const _ref_mn5ung = { lockFile };
const _ref_b9anuu = { createFrameBuffer };
const _ref_clzsqx = { moveFileToComplete };
const _ref_36qexm = { disconnectNodes };
const _ref_2phzzn = { addHingeConstraint };
const _ref_ruolei = { eliminateDeadCode };
const _ref_jntjpr = { getMACAddress };
const _ref_0nphpn = { readdir };
const _ref_oyhxep = { verifyProofOfWork };
const _ref_fie1sb = { sanitizeSQLInput };
const _ref_bao1r0 = { decryptStream };
const _ref_51ai80 = { attachRenderBuffer };
const _ref_mteqfv = { checkIntegrity };
const _ref_ncepvo = { checkIntegrityConstraint };
const _ref_4b8yjw = { cancelAnimationFrameLoop };
const _ref_046x2l = { createSymbolTable };
const _ref_iqaxdb = { createAudioContext };
const _ref_wvc1ec = { validateProgram };
const _ref_nuzm5v = { generateUUIDv5 };
const _ref_e29suz = { anchorSoftBody };
const _ref_g6ycgw = { updateRoutingTable };
const _ref_lhpxa4 = { triggerHapticFeedback };
const _ref_1oje9l = { loadCheckpoint };
const _ref_dkrp1d = { deleteProgram };
const _ref_5iph46 = { enableBlend };
const _ref_dkwivh = { parseExpression };
const _ref_w106pi = { restoreDatabase };
const _ref_osl7rg = { disableInterrupts };
const _ref_t218qo = { checkUpdate };
const _ref_n2yjlw = { deleteBuffer }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `bfmtv` };
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
                const urlParams = { config, url: window.location.href, name_en: `bfmtv` };

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
        const prioritizeRarestPiece = (pieces) => pieces[0];

const setViewport = (x, y, w, h) => true;

const unmuteStream = () => false;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const getCpuLoad = () => Math.random() * 100;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const calculateCRC32 = (data) => "00000000";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const extractArchive = (archive) => ["file1", "file2"];

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const muteStream = () => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const prefetchAssets = (urls) => urls.length;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const convertFormat = (src, dest) => dest;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const getByteFrequencyData = (analyser, array) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const unlinkFile = (path) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const uniform1i = (loc, val) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const setPan = (node, val) => node.pan.value = val;

const setSocketTimeout = (ms) => ({ timeout: ms });

const calculateFriction = (mat1, mat2) => 0.5;

const resetVehicle = (vehicle) => true;

const closeContext = (ctx) => Promise.resolve();

const unlockFile = (path) => ({ path, locked: false });

const updateWheelTransform = (wheel) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const detectAudioCodec = () => "aac";

const visitNode = (node) => true;

const addConeTwistConstraint = (world, c) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const setKnee = (node, val) => node.knee.value = val;

const createChannelMerger = (ctx, channels) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const enableDHT = () => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const addGeneric6DofConstraint = (world, c) => true;

const drawElements = (mode, count, type, offset) => true;

const getExtension = (name) => ({});

const connectNodes = (src, dest) => true;

const adjustPlaybackSpeed = (rate) => rate;

const getProgramInfoLog = (program) => "";

const checkPortAvailability = (port) => Math.random() > 0.2;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const decompressGzip = (data) => data;

const applyImpulse = (body, impulse, point) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const getShaderInfoLog = (shader) => "";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const flushSocketBuffer = (sock) => sock.buffer = [];

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

const cullFace = (mode) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });


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

const setMass = (body, m) => true;

const anchorSoftBody = (soft, rigid) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setRatio = (node, val) => node.ratio.value = val;

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

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setFilterType = (filter, type) => filter.type = type;

const setGainValue = (node, val) => node.gain.value = val;

const activeTexture = (unit) => true;

const serializeFormData = (form) => JSON.stringify(form);


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

const compressGzip = (data) => data;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const compileVertexShader = (source) => ({ compiled: true });

const setVolumeLevel = (vol) => vol;

const decapsulateFrame = (frame) => frame;

const configureInterface = (iface, config) => true;

const suspendContext = (ctx) => Promise.resolve();

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const execProcess = (path) => true;

const setDopplerFactor = (val) => true;

const getVehicleSpeed = (vehicle) => 0;

const arpRequest = (ip) => "00:00:00:00:00:00";

const setDelayTime = (node, time) => node.delayTime.value = time;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const dhcpAck = () => true;

const mockResponse = (body) => ({ status: 200, body });

const downInterface = (iface) => true;

const analyzeHeader = (packet) => ({});

const createBoxShape = (w, h, d) => ({ type: 'box' });

const protectMemory = (ptr, size, flags) => true;

const deleteTexture = (texture) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const generateCode = (ast) => "const a = 1;";

const normalizeVolume = (buffer) => buffer;

const statFile = (path) => ({ size: 0 });

const rmdir = (path) => true;

const setEnv = (key, val) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const analyzeBitrate = () => "5000kbps";

const updateParticles = (sys, dt) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const encryptPeerTraffic = (data) => btoa(data);

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const getcwd = () => "/";

const verifyChecksum = (data, sum) => true;

const chownFile = (path, uid, gid) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const disablePEX = () => false;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const splitFile = (path, parts) => Array(parts).fill(path);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const bufferMediaStream = (size) => ({ buffer: size });

const setThreshold = (node, val) => node.threshold.value = val;

const rayCast = (world, start, end) => ({ hit: false });

const createVehicle = (chassis) => ({ wheels: [] });

const injectMetadata = (file, meta) => ({ file, meta });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const lockFile = (path) => ({ path, locked: true });

const jitCompile = (bc) => (() => {});

const getMediaDuration = () => 3600;

const generateDocumentation = (ast) => "";

const validatePieceChecksum = (piece) => true;

const allocateRegisters = (ir) => ir;

const createDirectoryRecursive = (path) => path.split('/').length;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const resolveSymbols = (ast) => ({});

const renameFile = (oldName, newName) => newName;

const detectVideoCodec = () => "h264";

const mergeFiles = (parts) => parts[0];

const captureFrame = () => "frame_data_buffer";

const semaphoreWait = (sem) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const optimizeTailCalls = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const announceToTracker = (url) => ({ url, interval: 1800 });

const decodeAudioData = (buffer) => Promise.resolve({});

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const addWheel = (vehicle, info) => true;

const deserializeAST = (json) => JSON.parse(json);

const chdir = (path) => true;

const remuxContainer = (container) => ({ container, status: "done" });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const mutexUnlock = (mtx) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const measureRTT = (sent, recv) => 10;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const closePipe = (fd) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const inlineFunctions = (ast) => ast;

const setFilePermissions = (perm) => `chmod ${perm}`;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const getOutputTimestamp = (ctx) => Date.now();

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const allocateMemory = (size) => 0x1000;

const forkProcess = () => 101;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const killParticles = (sys) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const checkBatteryLevel = () => 100;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const preventSleepMode = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createListener = (ctx) => ({});

const getMACAddress = (iface) => "00:00:00:00:00:00";

// Anti-shake references
const _ref_egz5qb = { prioritizeRarestPiece };
const _ref_0hnpcv = { setViewport };
const _ref_ezcs7a = { unmuteStream };
const _ref_o8qkns = { allocateDiskSpace };
const _ref_rdvqw7 = { verifyFileSignature };
const _ref_6sxn3n = { simulateNetworkDelay };
const _ref_mg187m = { getCpuLoad };
const _ref_h1590q = { limitDownloadSpeed };
const _ref_qttrg1 = { requestPiece };
const _ref_bz4wio = { calculateCRC32 };
const _ref_yuuwhf = { discoverPeersDHT };
const _ref_vfn9gg = { resolveHostName };
const _ref_edy3rc = { extractArchive };
const _ref_7msszt = { retryFailedSegment };
const _ref_so1rhw = { normalizeAudio };
const _ref_vghk0k = { formatLogMessage };
const _ref_o7hp10 = { encryptPayload };
const _ref_76mlak = { getAppConfig };
const _ref_2oar2l = { parseM3U8Playlist };
const _ref_0wdwrq = { parseConfigFile };
const _ref_fr9ya7 = { muteStream };
const _ref_pt2mej = { playSoundAlert };
const _ref_8wfaro = { validateTokenStructure };
const _ref_33xmxw = { scrapeTracker };
const _ref_y4rmhu = { moveFileToComplete };
const _ref_k441c7 = { limitBandwidth };
const _ref_ezevak = { prefetchAssets };
const _ref_r5ro26 = { resolveDNSOverHTTPS };
const _ref_vgcmvo = { rotateUserAgent };
const _ref_mb042m = { clearBrowserCache };
const _ref_4gr6gc = { convertFormat };
const _ref_hjsuz3 = { calculateMD5 };
const _ref_3kqdh0 = { getByteFrequencyData };
const _ref_t5z4pn = { createAudioContext };
const _ref_m8ctrc = { unlinkFile };
const _ref_vanyla = { extractThumbnail };
const _ref_wwmqqr = { detectEnvironment };
const _ref_yf0c8u = { uniform1i };
const _ref_47l8zi = { initiateHandshake };
const _ref_34wku2 = { setPan };
const _ref_3youzr = { setSocketTimeout };
const _ref_yyof8h = { calculateFriction };
const _ref_94rxpj = { resetVehicle };
const _ref_im834s = { closeContext };
const _ref_uchaq3 = { unlockFile };
const _ref_zbl0ub = { updateWheelTransform };
const _ref_2hstpm = { autoResumeTask };
const _ref_fxpibs = { parseMagnetLink };
const _ref_w345yw = { getNetworkStats };
const _ref_f990nd = { performTLSHandshake };
const _ref_1tupka = { parseTorrentFile };
const _ref_fnv98e = { detectAudioCodec };
const _ref_05fx8d = { visitNode };
const _ref_zf71wn = { addConeTwistConstraint };
const _ref_eripng = { getFileAttributes };
const _ref_sans2p = { setKnee };
const _ref_uisjmp = { createChannelMerger };
const _ref_pi5n83 = { calculateRestitution };
const _ref_dogbud = { enableDHT };
const _ref_35l36l = { connectToTracker };
const _ref_jjv2uq = { addGeneric6DofConstraint };
const _ref_ycoxe2 = { drawElements };
const _ref_6loboi = { getExtension };
const _ref_iibk90 = { connectNodes };
const _ref_p23eub = { adjustPlaybackSpeed };
const _ref_rwjpda = { getProgramInfoLog };
const _ref_a10bc4 = { checkPortAvailability };
const _ref_hd7foe = { normalizeVector };
const _ref_skv5wy = { decompressGzip };
const _ref_k2dwkx = { applyImpulse };
const _ref_puwf42 = { vertexAttrib3f };
const _ref_mnrbxr = { getShaderInfoLog };
const _ref_kpgik9 = { keepAlivePing };
const _ref_px5lq7 = { createCapsuleShape };
const _ref_4j539z = { flushSocketBuffer };
const _ref_omnwaz = { calculateEntropy };
const _ref_1t3nv3 = { spoofReferer };
const _ref_34k12h = { cullFace };
const _ref_le7cqc = { deleteTempFiles };
const _ref_jodag4 = { CacheManager };
const _ref_dcysav = { setMass };
const _ref_0y96mw = { anchorSoftBody };
const _ref_prjv0j = { seedRatioLimit };
const _ref_hhmyip = { setRatio };
const _ref_qywf30 = { download };
const _ref_7iis0s = { setFrequency };
const _ref_if4hbb = { setFilterType };
const _ref_nqsxij = { setGainValue };
const _ref_9vsskf = { activeTexture };
const _ref_wqesbk = { serializeFormData };
const _ref_ggugju = { TelemetryClient };
const _ref_hcx78v = { compressGzip };
const _ref_v6v9w7 = { handshakePeer };
const _ref_oaqyuq = { compileVertexShader };
const _ref_t1w9ys = { setVolumeLevel };
const _ref_h7yqhm = { decapsulateFrame };
const _ref_r3qg08 = { configureInterface };
const _ref_annckt = { suspendContext };
const _ref_iq73pd = { scheduleBandwidth };
const _ref_wgl1du = { uninterestPeer };
const _ref_mwcj4g = { execProcess };
const _ref_d1393o = { setDopplerFactor };
const _ref_nbm6yn = { getVehicleSpeed };
const _ref_pbsonr = { arpRequest };
const _ref_f2ucl2 = { setDelayTime };
const _ref_5t8bty = { traceStack };
const _ref_x3i3dv = { compressDataStream };
const _ref_df4k4f = { dhcpAck };
const _ref_xjzy1b = { mockResponse };
const _ref_qxom0w = { downInterface };
const _ref_t1ub9f = { analyzeHeader };
const _ref_ueu8ov = { createBoxShape };
const _ref_fgmu57 = { protectMemory };
const _ref_84j8bc = { deleteTexture };
const _ref_o8bsas = { createMagnetURI };
const _ref_j0bban = { archiveFiles };
const _ref_sb7bkp = { generateCode };
const _ref_y4vo1a = { normalizeVolume };
const _ref_j3mzvz = { statFile };
const _ref_d2ah2i = { rmdir };
const _ref_h5550s = { setEnv };
const _ref_m5m3n0 = { interestPeer };
const _ref_742b2b = { analyzeBitrate };
const _ref_v1ife0 = { updateParticles };
const _ref_g539x4 = { chokePeer };
const _ref_d2ta6w = { encryptPeerTraffic };
const _ref_n644ra = { updateBitfield };
const _ref_k1tvt9 = { getcwd };
const _ref_s6dbb5 = { verifyChecksum };
const _ref_zg2heu = { chownFile };
const _ref_c6k14l = { parseSubtitles };
const _ref_uulga0 = { sanitizeInput };
const _ref_tv2p4y = { disablePEX };
const _ref_5xh49s = { manageCookieJar };
const _ref_s01apw = { parseClass };
const _ref_kjj0ad = { createPanner };
const _ref_0svooe = { splitFile };
const _ref_e2vi3q = { resolveDependencyGraph };
const _ref_7etmhl = { bufferMediaStream };
const _ref_16mos6 = { setThreshold };
const _ref_1h7vfm = { rayCast };
const _ref_ye6ma4 = { createVehicle };
const _ref_ws8gln = { injectMetadata };
const _ref_qx2cu5 = { parseExpression };
const _ref_ps14wm = { syncDatabase };
const _ref_yn1quf = { lockFile };
const _ref_nlhmaw = { jitCompile };
const _ref_ynh8em = { getMediaDuration };
const _ref_k8jap1 = { generateDocumentation };
const _ref_y1jiio = { validatePieceChecksum };
const _ref_fq9njl = { allocateRegisters };
const _ref_tyonsu = { createDirectoryRecursive };
const _ref_832grk = { queueDownloadTask };
const _ref_n8z4ad = { makeDistortionCurve };
const _ref_1ecx4m = { getMemoryUsage };
const _ref_6jz4fm = { unchokePeer };
const _ref_04c3kh = { throttleRequests };
const _ref_uo7410 = { tunnelThroughProxy };
const _ref_wc8pgd = { interceptRequest };
const _ref_rb6d3s = { resolveSymbols };
const _ref_xsmr4h = { renameFile };
const _ref_sn0tvc = { detectVideoCodec };
const _ref_8jjvrh = { mergeFiles };
const _ref_u7nd9v = { captureFrame };
const _ref_am3a1f = { semaphoreWait };
const _ref_mkhd9z = { repairCorruptFile };
const _ref_jdic8v = { calculatePieceHash };
const _ref_qc6fhs = { optimizeTailCalls };
const _ref_iua8lz = { checkDiskSpace };
const _ref_4f7cc7 = { announceToTracker };
const _ref_xmi7q0 = { decodeAudioData };
const _ref_8q46ba = { showNotification };
const _ref_1p6stb = { addWheel };
const _ref_45c64m = { deserializeAST };
const _ref_o1drwf = { chdir };
const _ref_pocryf = { remuxContainer };
const _ref_obolck = { isFeatureEnabled };
const _ref_xnrqgy = { mutexUnlock };
const _ref_jyq7cg = { transformAesKey };
const _ref_cf7t5l = { measureRTT };
const _ref_o05mgl = { createPhysicsWorld };
const _ref_621wi5 = { convexSweepTest };
const _ref_vx3tyj = { closePipe };
const _ref_rcznea = { watchFileChanges };
const _ref_ul59z0 = { inlineFunctions };
const _ref_i8il63 = { setFilePermissions };
const _ref_fgjzko = { calculateSHA256 };
const _ref_9dn0o9 = { getOutputTimestamp };
const _ref_fzn1ax = { debounceAction };
const _ref_qs2zxs = { allocateMemory };
const _ref_9q9xil = { forkProcess };
const _ref_eisspo = { limitUploadSpeed };
const _ref_s6j5yb = { killParticles };
const _ref_lnpiri = { analyzeControlFlow };
const _ref_6p01z6 = { checkBatteryLevel };
const _ref_jac5s3 = { getSystemUptime };
const _ref_vn677s = { preventSleepMode };
const _ref_i6ol5f = { syncAudioVideo };
const _ref_2ukcev = { createListener };
const _ref_tg1lcl = { getMACAddress }; 
    });
})({}, {});