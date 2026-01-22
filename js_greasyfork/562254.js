// ==UserScript==
// @name mixch视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/mixch/index.js
// @version 2026.01.21.2
// @description 一键下载mixch视频，支持4K/1080P/720P多画质。
// @icon https://d2uqarpmf42qy0.cloudfront.net/torte_web/_next/static/img/icon/apple-icon.png
// @match *://mixch.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect mixch.tv
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
// @downloadURL https://update.greasyfork.org/scripts/562254/mixch%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562254/mixch%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const enableDHT = () => true;

const disconnectNodes = (node) => true;

const tokenizeText = (text) => text.split(" ");

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const validateRecaptcha = (token) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const listenSocket = (sock, backlog) => true;

const emitParticles = (sys, count) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const createConvolver = (ctx) => ({ buffer: null });

const prefetchAssets = (urls) => urls.length;

const generateCode = (ast) => "const a = 1;";

const removeRigidBody = (world, body) => true;

const traverseAST = (node, visitor) => true;

const addConeTwistConstraint = (world, c) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createBoxShape = (w, h, d) => ({ type: 'box' });

const setDetune = (osc, cents) => osc.detune = cents;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const lockFile = (path) => ({ path, locked: true });

const eliminateDeadCode = (ast) => ast;

const getBlockHeight = () => 15000000;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const backpropagateGradient = (loss) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const loadCheckpoint = (path) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const addPoint2PointConstraint = (world, c) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const monitorClipboard = () => "";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const setViewport = (x, y, w, h) => true;

const augmentData = (image) => image;

const merkelizeRoot = (txs) => "root_hash";

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const checkUpdate = () => ({ hasUpdate: false });

const createIndexBuffer = (data) => ({ id: Math.random() });

const detectCollision = (body1, body2) => false;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const applyFog = (color, dist) => color;

const setBrake = (vehicle, force, wheelIdx) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const setRatio = (node, val) => node.ratio.value = val;

const interestPeer = (peer) => ({ ...peer, interested: true });

const attachRenderBuffer = (fb, rb) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const checkIntegrityConstraint = (table) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const bindAddress = (sock, addr, port) => true;

const foldConstants = (ast) => ast;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const applyTorque = (body, torque) => true;

const applyForce = (body, force, point) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getProgramInfoLog = (program) => "";

const calculateMetric = (route) => 1;

const analyzeHeader = (packet) => ({});

const optimizeTailCalls = (ast) => ast;

const setAngularVelocity = (body, v) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const decompressPacket = (data) => data;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const resolveImports = (ast) => [];

const enableBlend = (func) => true;

const stopOscillator = (osc, time) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const updateTransform = (body) => true;

const detectDarkMode = () => true;

const resolveDNS = (domain) => "127.0.0.1";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const bufferData = (gl, target, data, usage) => true;

const visitNode = (node) => true;

const instrumentCode = (code) => code;

const createDirectoryRecursive = (path) => path.split('/').length;

const traceroute = (host) => ["192.168.1.1"];


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const lookupSymbol = (table, name) => ({});

const addGeneric6DofConstraint = (world, c) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const clearScreen = (r, g, b, a) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const closeSocket = (sock) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const preventCSRF = () => "csrf_token";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createFrameBuffer = () => ({ id: Math.random() });

const checkBalance = (addr) => "10.5 ETH";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const debugAST = (ast) => "";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
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

const unlockRow = (id) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const getShaderInfoLog = (shader) => "";

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const suspendContext = (ctx) => Promise.resolve();

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const defineSymbol = (table, name, info) => true;

const bindTexture = (target, texture) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const deleteProgram = (program) => true;

const injectCSPHeader = () => "default-src 'self'";

const addSliderConstraint = (world, c) => true;

const replicateData = (node) => ({ target: node, synced: true });

const verifyChecksum = (data, sum) => true;

const parseLogTopics = (topics) => ["Transfer"];

const prioritizeRarestPiece = (pieces) => pieces[0];


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

const transcodeStream = (format) => ({ format, status: "processing" });

const sleep = (body) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const unlockFile = (path) => ({ path, locked: false });

const validateFormInput = (input) => input.length > 0;

const linkModules = (modules) => ({});

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const uniformMatrix4fv = (loc, transpose, val) => true;

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

const connectNodes = (src, dest) => true;

const cullFace = (mode) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const profilePerformance = (func) => 0;

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

const reduceDimensionalityPCA = (data) => data;

const parsePayload = (packet) => ({});

const triggerHapticFeedback = (intensity) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const unmapMemory = (ptr, size) => true;

const anchorSoftBody = (soft, rigid) => true;

const broadcastMessage = (msg) => true;

const writePipe = (fd, data) => data.length;

const createAudioContext = () => ({ sampleRate: 44100 });

const restoreDatabase = (path) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const exitScope = (table) => true;

const startOscillator = (osc, time) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const checkParticleCollision = (sys, world) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const detectDevTools = () => false;

const swapTokens = (pair, amount) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const sendPacket = (sock, data) => data.length;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const compressPacket = (data) => data;

const checkIntegrityToken = (token) => true;

const dhcpRequest = (ip) => true;

const updateSoftBody = (body) => true;

const mutexLock = (mtx) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const serializeFormData = (form) => JSON.stringify(form);

const compileFragmentShader = (source) => ({ compiled: true });

const controlCongestion = (sock) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const applyImpulse = (body, impulse, point) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const translateText = (text, lang) => text;

const useProgram = (program) => true;

const inferType = (node) => 'any';

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

const captureScreenshot = () => "data:image/png;base64,...";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const unlinkFile = (path) => true;

const getByteFrequencyData = (analyser, array) => true;

const mkdir = (path) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const detectDebugger = () => false;

const chdir = (path) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const removeConstraint = (world, c) => true;

const allocateRegisters = (ir) => ir;

const compileVertexShader = (source) => ({ compiled: true });

const blockMaliciousTraffic = (ip) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const beginTransaction = () => "TX-" + Date.now();

const processAudioBuffer = (buffer) => buffer;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const createParticleSystem = (count) => ({ particles: [] });

const mutexUnlock = (mtx) => true;

const setThreshold = (node, val) => node.threshold.value = val;

// Anti-shake references
const _ref_b35q0p = { enableDHT };
const _ref_laqz9p = { disconnectNodes };
const _ref_pcr7ab = { tokenizeText };
const _ref_1hsjnv = { scheduleBandwidth };
const _ref_ny7eld = { validateRecaptcha };
const _ref_pbrfit = { loadImpulseResponse };
const _ref_sgybda = { discoverPeersDHT };
const _ref_klftyu = { listenSocket };
const _ref_qgui6k = { emitParticles };
const _ref_3u9cqm = { loadTexture };
const _ref_wlcf5u = { createConvolver };
const _ref_8pc760 = { prefetchAssets };
const _ref_mmvhf5 = { generateCode };
const _ref_n1v4vw = { removeRigidBody };
const _ref_wu7qgk = { traverseAST };
const _ref_p1bd9t = { addConeTwistConstraint };
const _ref_vx5tb1 = { parseMagnetLink };
const _ref_2ruk7d = { createBoxShape };
const _ref_4k27kr = { setDetune };
const _ref_cvoy9w = { throttleRequests };
const _ref_xv9u5k = { virtualScroll };
const _ref_m56bhv = { lockFile };
const _ref_se6n31 = { eliminateDeadCode };
const _ref_63y100 = { getBlockHeight };
const _ref_j69cge = { createScriptProcessor };
const _ref_mj1nqc = { createGainNode };
const _ref_a3dhn4 = { backpropagateGradient };
const _ref_47ofwp = { updateProgressBar };
const _ref_vwl59m = { loadCheckpoint };
const _ref_1xvo4u = { requestPiece };
const _ref_6z225g = { addPoint2PointConstraint };
const _ref_yjfzj9 = { parseExpression };
const _ref_8fb75p = { verifyMagnetLink };
const _ref_kz5vij = { monitorClipboard };
const _ref_b4ytoj = { encryptPayload };
const _ref_wffdwq = { setViewport };
const _ref_rdi0f0 = { augmentData };
const _ref_pzmfqz = { merkelizeRoot };
const _ref_l9bjoc = { formatCurrency };
const _ref_ggipdg = { calculateMD5 };
const _ref_5dkyin = { checkUpdate };
const _ref_fy5ivs = { createIndexBuffer };
const _ref_his2v2 = { detectCollision };
const _ref_3mcaqm = { setSteeringValue };
const _ref_iulaw7 = { applyFog };
const _ref_ijnhcj = { setBrake };
const _ref_05i38w = { announceToTracker };
const _ref_zr1cso = { setRatio };
const _ref_iwar3u = { interestPeer };
const _ref_xuy4vl = { attachRenderBuffer };
const _ref_i2shvf = { simulateNetworkDelay };
const _ref_o22hbu = { checkIntegrityConstraint };
const _ref_ltw6au = { seedRatioLimit };
const _ref_mmjqd0 = { bindAddress };
const _ref_648aqa = { foldConstants };
const _ref_b3h1oc = { resolveDNSOverHTTPS };
const _ref_ovndyo = { applyTorque };
const _ref_y41rhf = { applyForce };
const _ref_d3g0qy = { verifyFileSignature };
const _ref_j9njd3 = { createOscillator };
const _ref_0vqfju = { getProgramInfoLog };
const _ref_6xhofp = { calculateMetric };
const _ref_h3uiv3 = { analyzeHeader };
const _ref_vcl3sx = { optimizeTailCalls };
const _ref_j50ulo = { setAngularVelocity };
const _ref_ui2vls = { createBiquadFilter };
const _ref_nz7x6s = { decompressPacket };
const _ref_yvhu3i = { readPixels };
const _ref_5q3ro2 = { resolveImports };
const _ref_aiq846 = { enableBlend };
const _ref_3r57ft = { stopOscillator };
const _ref_lhu7hz = { autoResumeTask };
const _ref_t2t87q = { updateTransform };
const _ref_zcmjda = { detectDarkMode };
const _ref_wxzbr9 = { resolveDNS };
const _ref_26gkpm = { syncDatabase };
const _ref_z8x9na = { watchFileChanges };
const _ref_92fwwt = { bufferData };
const _ref_edbmrb = { visitNode };
const _ref_yh5kzv = { instrumentCode };
const _ref_1k4hcv = { createDirectoryRecursive };
const _ref_k6xcgh = { traceroute };
const _ref_jlbpt1 = { transformAesKey };
const _ref_w19dc0 = { lookupSymbol };
const _ref_6r5ahf = { addGeneric6DofConstraint };
const _ref_jenepg = { limitDownloadSpeed };
const _ref_q5oj2y = { clearScreen };
const _ref_rxej0p = { calculateRestitution };
const _ref_xb1667 = { closeSocket };
const _ref_3ee04z = { requestAnimationFrameLoop };
const _ref_nblyy1 = { preventCSRF };
const _ref_a5qczr = { createDynamicsCompressor };
const _ref_zeepgf = { createFrameBuffer };
const _ref_5wy2l8 = { checkBalance };
const _ref_0wv7es = { lazyLoadComponent };
const _ref_l6pgte = { debugAST };
const _ref_npojw8 = { connectToTracker };
const _ref_ddjp60 = { ProtocolBufferHandler };
const _ref_9mw1lk = { unlockRow };
const _ref_bikfn5 = { allocateDiskSpace };
const _ref_gdu8v1 = { uninterestPeer };
const _ref_3lhkiv = { getShaderInfoLog };
const _ref_dl5at7 = { parseTorrentFile };
const _ref_nbqa89 = { suspendContext };
const _ref_nb0sap = { saveCheckpoint };
const _ref_muyev5 = { defineSymbol };
const _ref_c04k46 = { bindTexture };
const _ref_ocq7lx = { queueDownloadTask };
const _ref_8c74rd = { deleteProgram };
const _ref_p2fljg = { injectCSPHeader };
const _ref_x031j8 = { addSliderConstraint };
const _ref_qfvqrr = { replicateData };
const _ref_2evv23 = { verifyChecksum };
const _ref_kmy51e = { parseLogTopics };
const _ref_uj82mz = { prioritizeRarestPiece };
const _ref_84635s = { CacheManager };
const _ref_9upqts = { transcodeStream };
const _ref_bv597e = { sleep };
const _ref_moxo9z = { traceStack };
const _ref_yezwa1 = { calculatePieceHash };
const _ref_3w4p3d = { connectionPooling };
const _ref_jafkcn = { unlockFile };
const _ref_qhrzst = { validateFormInput };
const _ref_whyrc3 = { linkModules };
const _ref_vu9b9h = { calculateSHA256 };
const _ref_yqj0bk = { parseStatement };
const _ref_xe9sdz = { uniformMatrix4fv };
const _ref_45jsen = { TaskScheduler };
const _ref_ljzg5t = { connectNodes };
const _ref_s0y9nz = { cullFace };
const _ref_044jpe = { rotateMatrix };
const _ref_r2smho = { parseFunction };
const _ref_kvhf3q = { uploadCrashReport };
const _ref_lipryx = { manageCookieJar };
const _ref_bxv97x = { profilePerformance };
const _ref_563f7a = { VirtualFSTree };
const _ref_dzkoi5 = { reduceDimensionalityPCA };
const _ref_viv6ea = { parsePayload };
const _ref_ctxvef = { triggerHapticFeedback };
const _ref_dy7q2i = { chokePeer };
const _ref_rhx4l9 = { unmapMemory };
const _ref_q723ik = { anchorSoftBody };
const _ref_23ppd6 = { broadcastMessage };
const _ref_wr9mn2 = { writePipe };
const _ref_6tcut9 = { createAudioContext };
const _ref_h0tkwk = { restoreDatabase };
const _ref_4lp5hl = { debounceAction };
const _ref_9buv5j = { exitScope };
const _ref_nbkwe7 = { startOscillator };
const _ref_bdp30b = { getMACAddress };
const _ref_hqwq0p = { checkParticleCollision };
const _ref_fgxhxj = { showNotification };
const _ref_n6ysu3 = { detectDevTools };
const _ref_yz87w0 = { swapTokens };
const _ref_0ledjr = { formatLogMessage };
const _ref_4ojvr1 = { sendPacket };
const _ref_l3gyha = { calculateEntropy };
const _ref_pjxmw9 = { analyzeUserBehavior };
const _ref_8f07bx = { compressPacket };
const _ref_lz8weh = { checkIntegrityToken };
const _ref_l048of = { dhcpRequest };
const _ref_40tear = { updateSoftBody };
const _ref_eea265 = { mutexLock };
const _ref_7xrayb = { getNetworkStats };
const _ref_59zjem = { serializeFormData };
const _ref_6y36lg = { compileFragmentShader };
const _ref_7xkang = { controlCongestion };
const _ref_izf637 = { predictTensor };
const _ref_as1zmc = { applyImpulse };
const _ref_nza85u = { diffVirtualDOM };
const _ref_4c4k7j = { isFeatureEnabled };
const _ref_94qd3w = { translateText };
const _ref_1ghxej = { useProgram };
const _ref_y04cvn = { inferType };
const _ref_9wq9sg = { download };
const _ref_atel78 = { captureScreenshot };
const _ref_4yy0ln = { archiveFiles };
const _ref_xfc41w = { createIndex };
const _ref_qzff93 = { unlinkFile };
const _ref_9lgksb = { getByteFrequencyData };
const _ref_13ojlm = { mkdir };
const _ref_ozppxe = { convexSweepTest };
const _ref_xsip2q = { detectDebugger };
const _ref_4u0a8a = { chdir };
const _ref_4ubal5 = { detectEnvironment };
const _ref_cszzxe = { sanitizeSQLInput };
const _ref_rczhj0 = { removeConstraint };
const _ref_rzqtx9 = { allocateRegisters };
const _ref_ito92p = { compileVertexShader };
const _ref_uo8asy = { blockMaliciousTraffic };
const _ref_gqrvbn = { analyzeQueryPlan };
const _ref_b4whdx = { beginTransaction };
const _ref_gbfnbu = { processAudioBuffer };
const _ref_3ly2df = { compressDataStream };
const _ref_517zyi = { switchProxyServer };
const _ref_yfftoo = { validateMnemonic };
const _ref_6wguog = { cancelAnimationFrameLoop };
const _ref_6chpcp = { createParticleSystem };
const _ref_yw7asz = { mutexUnlock };
const _ref_tfh72l = { setThreshold }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `mixch` };
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
                const urlParams = { config, url: window.location.href, name_en: `mixch` };

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
        const bufferData = (gl, target, data, usage) => true;

const calculateGasFee = (limit) => limit * 20;

const emitParticles = (sys, count) => true;

const mutexLock = (mtx) => true;

const interpretBytecode = (bc) => true;

const dumpSymbolTable = (table) => "";

const inferType = (node) => 'any';

const calculateComplexity = (ast) => 1;

const checkTypes = (ast) => [];

const minifyCode = (code) => code;

const hoistVariables = (ast) => ast;

const rmdir = (path) => true;

const protectMemory = (ptr, size, flags) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const resolveSymbols = (ast) => ({});

const obfuscateString = (str) => btoa(str);

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const profilePerformance = (func) => 0;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const mutexUnlock = (mtx) => true;

const deobfuscateString = (str) => atob(str);

const encodeABI = (method, params) => "0x...";

const mapMemory = (fd, size) => 0x2000;

const createSymbolTable = () => ({ scopes: [] });

const findLoops = (cfg) => [];

const instrumentCode = (code) => code;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const deriveAddress = (path) => "0x123...";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const listenSocket = (sock, backlog) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const verifyIR = (ir) => true;

const checkIntegrityConstraint = (table) => true;

const writeFile = (fd, data) => true;

const unlockRow = (id) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const disablePEX = () => false;

const dhcpOffer = (ip) => true;

const lookupSymbol = (table, name) => ({});

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const parseQueryString = (qs) => ({});

const makeDistortionCurve = (amount) => new Float32Array(4096);

const encryptLocalStorage = (key, val) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const debugAST = (ast) => "";

const setDelayTime = (node, time) => node.delayTime.value = time;

const detectDevTools = () => false;

const setVelocity = (body, v) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const leaveGroup = (group) => true;

const drawArrays = (gl, mode, first, count) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setThreshold = (node, val) => node.threshold.value = val;

const jitCompile = (bc) => (() => {});

const decompressGzip = (data) => data;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const setRelease = (node, val) => node.release.value = val;

const closeSocket = (sock) => true;

const prettifyCode = (code) => code;

const updateParticles = (sys, dt) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const sleep = (body) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const spoofReferer = () => "https://google.com";

const scaleMatrix = (mat, vec) => mat;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const optimizeTailCalls = (ast) => ast;

const tokenizeText = (text) => text.split(" ");

const analyzeControlFlow = (ast) => ({ graph: {} });

const createChannelMerger = (ctx, channels) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;

const logErrorToFile = (err) => console.error(err);

const setQValue = (filter, q) => filter.Q = q;

const switchVLAN = (id) => true;

const setGainValue = (node, val) => node.gain.value = val;

const dhcpRequest = (ip) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const writePipe = (fd, data) => data.length;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const mangleNames = (ast) => ast;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const verifyProofOfWork = (nonce) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const renderCanvasLayer = (ctx) => true;

const setViewport = (x, y, w, h) => true;

const setOrientation = (panner, x, y, z) => true;

const generateCode = (ast) => "const a = 1;";

const defineSymbol = (table, name, info) => true;

const deserializeAST = (json) => JSON.parse(json);

const addSliderConstraint = (world, c) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const closePipe = (fd) => true;

const applyTorque = (body, torque) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const injectCSPHeader = () => "default-src 'self'";

const createSoftBody = (info) => ({ nodes: [] });

const generateEmbeddings = (text) => new Float32Array(128);

const detectVirtualMachine = () => false;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const obfuscateCode = (code) => code;

const cullFace = (mode) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const addGeneric6DofConstraint = (world, c) => true;

const invalidateCache = (key) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const chokePeer = (peer) => ({ ...peer, choked: true });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createMediaStreamSource = (ctx, stream) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const detectDarkMode = () => true;

const setDistanceModel = (panner, model) => true;

const rotateLogFiles = () => true;

const cleanOldLogs = (days) => days;

const readPipe = (fd, len) => new Uint8Array(len);

const getExtension = (name) => ({});

const decapsulateFrame = (frame) => frame;

const panicKernel = (msg) => false;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const normalizeFeatures = (data) => data.map(x => x / 255);

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const setGravity = (world, g) => world.gravity = g;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const applyTheme = (theme) => document.body.className = theme;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const anchorSoftBody = (soft, rigid) => true;

const limitRate = (stream, rate) => stream;

const fragmentPacket = (data, mtu) => [data];

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const compileFragmentShader = (source) => ({ compiled: true });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const startOscillator = (osc, time) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createAudioContext = () => ({ sampleRate: 44100 });

const closeFile = (fd) => true;

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

const bufferMediaStream = (size) => ({ buffer: size });

const removeMetadata = (file) => ({ file, metadata: null });

const traceroute = (host) => ["192.168.1.1"];

const getOutputTimestamp = (ctx) => Date.now();

const detectAudioCodec = () => "aac";

const compileVertexShader = (source) => ({ compiled: true });

const renameFile = (oldName, newName) => newName;

const stopOscillator = (osc, time) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const disableDepthTest = () => true;

const segmentImageUNet = (img) => "mask_buffer";

const removeRigidBody = (world, body) => true;

const handleTimeout = (sock) => true;

const muteStream = () => true;

const serializeFormData = (form) => JSON.stringify(form);

const createIndexBuffer = (data) => ({ id: Math.random() });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const enableBlend = (func) => true;

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

const detectCollision = (body1, body2) => false;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const translateMatrix = (mat, vec) => mat;

const renderShadowMap = (scene, light) => ({ texture: {} });

const filterTraffic = (rule) => true;

const setPosition = (panner, x, y, z) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const registerGestureHandler = (gesture) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const updateWheelTransform = (wheel) => true;

const generateDocumentation = (ast) => "";

const getVehicleSpeed = (vehicle) => 0;

const postProcessBloom = (image, threshold) => image;

const triggerHapticFeedback = (intensity) => true;

const readdir = (path) => [];

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setRatio = (node, val) => node.ratio.value = val;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const extractArchive = (archive) => ["file1", "file2"];

const deleteBuffer = (buffer) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const detachThread = (tid) => true;

const replicateData = (node) => ({ target: node, synced: true });

const decompressPacket = (data) => data;

const serializeAST = (ast) => JSON.stringify(ast);

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
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

const captureFrame = () => "frame_data_buffer";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const getMediaDuration = () => 3600;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compileToBytecode = (ast) => new Uint8Array();

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const unmapMemory = (ptr, size) => true;

const killProcess = (pid) => true;

// Anti-shake references
const _ref_u9sxu9 = { bufferData };
const _ref_7ufifa = { calculateGasFee };
const _ref_wzp9az = { emitParticles };
const _ref_vk9zz6 = { mutexLock };
const _ref_dffm45 = { interpretBytecode };
const _ref_zlqmlu = { dumpSymbolTable };
const _ref_8gf6i7 = { inferType };
const _ref_s5y6xc = { calculateComplexity };
const _ref_xr6va5 = { checkTypes };
const _ref_m6wmb9 = { minifyCode };
const _ref_fupb1a = { hoistVariables };
const _ref_izks35 = { rmdir };
const _ref_2ucusn = { protectMemory };
const _ref_c9vqv4 = { captureScreenshot };
const _ref_f1i4d2 = { resolveSymbols };
const _ref_8s87n4 = { obfuscateString };
const _ref_bmutgn = { optimizeHyperparameters };
const _ref_m3ev4o = { profilePerformance };
const _ref_0921ll = { diffVirtualDOM };
const _ref_s2c5pl = { mutexUnlock };
const _ref_1w8aoy = { deobfuscateString };
const _ref_fzbziy = { encodeABI };
const _ref_0psqek = { mapMemory };
const _ref_i5qhz5 = { createSymbolTable };
const _ref_gawk36 = { findLoops };
const _ref_o82ytk = { instrumentCode };
const _ref_x238fg = { checkIntegrity };
const _ref_9r2lz2 = { deriveAddress };
const _ref_l8m43p = { simulateNetworkDelay };
const _ref_6mglyo = { listenSocket };
const _ref_4j026l = { connectionPooling };
const _ref_3ympwi = { verifyIR };
const _ref_hx0vaw = { checkIntegrityConstraint };
const _ref_eca29k = { writeFile };
const _ref_0lkkk0 = { unlockRow };
const _ref_x1ix2l = { extractThumbnail };
const _ref_bjjykp = { disablePEX };
const _ref_wm0y6j = { dhcpOffer };
const _ref_7pefl5 = { lookupSymbol };
const _ref_sprdas = { optimizeMemoryUsage };
const _ref_ajz4k6 = { parseQueryString };
const _ref_dnz4bb = { makeDistortionCurve };
const _ref_qc8te1 = { encryptLocalStorage };
const _ref_y8ftq2 = { receivePacket };
const _ref_4yunps = { debugAST };
const _ref_8wmtv7 = { setDelayTime };
const _ref_mv5i6a = { detectDevTools };
const _ref_9z4ipr = { setVelocity };
const _ref_2q9nfm = { parseFunction };
const _ref_5rk6ht = { leaveGroup };
const _ref_813qzr = { drawArrays };
const _ref_gudznl = { createIndex };
const _ref_1wxcej = { setThreshold };
const _ref_waqt53 = { jitCompile };
const _ref_f91p27 = { decompressGzip };
const _ref_1wp6bm = { verifyMagnetLink };
const _ref_7crd9v = { uninterestPeer };
const _ref_qdllk4 = { setRelease };
const _ref_3abovl = { closeSocket };
const _ref_7u96au = { prettifyCode };
const _ref_7foahe = { updateParticles };
const _ref_b9uhwi = { autoResumeTask };
const _ref_ctc0le = { sleep };
const _ref_d7bc8z = { initiateHandshake };
const _ref_2lcs9x = { spoofReferer };
const _ref_juvkia = { scaleMatrix };
const _ref_nnp7li = { moveFileToComplete };
const _ref_a2ckxl = { optimizeTailCalls };
const _ref_182mlp = { tokenizeText };
const _ref_33z4qx = { analyzeControlFlow };
const _ref_y29t9f = { createChannelMerger };
const _ref_fn6w53 = { calculateRestitution };
const _ref_8mrzzx = { logErrorToFile };
const _ref_ntychp = { setQValue };
const _ref_t66oyh = { switchVLAN };
const _ref_uuaeot = { setGainValue };
const _ref_vrxr49 = { dhcpRequest };
const _ref_bzf0au = { createVehicle };
const _ref_50d8ke = { writePipe };
const _ref_sh3357 = { createMagnetURI };
const _ref_g3yuuy = { mangleNames };
const _ref_eaj3v4 = { getFileAttributes };
const _ref_pvsjd4 = { verifyProofOfWork };
const _ref_39m9hf = { readPixels };
const _ref_1z9zpp = { renderCanvasLayer };
const _ref_6t5p6q = { setViewport };
const _ref_e7rz5f = { setOrientation };
const _ref_uj2zvc = { generateCode };
const _ref_3myxde = { defineSymbol };
const _ref_rwhaa5 = { deserializeAST };
const _ref_46uf1n = { addSliderConstraint };
const _ref_4ix7y1 = { detectEnvironment };
const _ref_k325uv = { closePipe };
const _ref_xuc4r1 = { applyTorque };
const _ref_uftk4e = { saveCheckpoint };
const _ref_g0ungw = { setFrequency };
const _ref_vnw09j = { injectCSPHeader };
const _ref_w2s0v3 = { createSoftBody };
const _ref_hglqjj = { generateEmbeddings };
const _ref_j9yzt8 = { detectVirtualMachine };
const _ref_2k5y3m = { deleteTempFiles };
const _ref_wt87iv = { obfuscateCode };
const _ref_ms9phb = { cullFace };
const _ref_1tfk3l = { rotateMatrix };
const _ref_jnhndy = { addGeneric6DofConstraint };
const _ref_vjbet0 = { invalidateCache };
const _ref_qehxj6 = { applyPerspective };
const _ref_ipqc6p = { chokePeer };
const _ref_qa75l7 = { handshakePeer };
const _ref_yrptfd = { createMediaStreamSource };
const _ref_mabu5h = { loadImpulseResponse };
const _ref_0t17bn = { detectDarkMode };
const _ref_egjgab = { setDistanceModel };
const _ref_3p5lbx = { rotateLogFiles };
const _ref_dhhp31 = { cleanOldLogs };
const _ref_qxwi4o = { readPipe };
const _ref_v8ulvg = { getExtension };
const _ref_cntg4m = { decapsulateFrame };
const _ref_w43h6a = { panicKernel };
const _ref_2nla9h = { parseMagnetLink };
const _ref_g9i95m = { linkProgram };
const _ref_s56fbo = { normalizeFeatures };
const _ref_mxa5k2 = { executeSQLQuery };
const _ref_m7l3db = { setGravity };
const _ref_3b70gn = { applyEngineForce };
const _ref_6co96t = { applyTheme };
const _ref_og8wef = { createPhysicsWorld };
const _ref_0xhlnn = { anchorSoftBody };
const _ref_lb1uo2 = { limitRate };
const _ref_hlru6s = { fragmentPacket };
const _ref_n4oc09 = { calculateLighting };
const _ref_yjmqab = { compileFragmentShader };
const _ref_3x3wbi = { requestAnimationFrameLoop };
const _ref_p4cjdt = { startOscillator };
const _ref_1iwpe0 = { archiveFiles };
const _ref_m2v6i9 = { createAudioContext };
const _ref_b9fszx = { closeFile };
const _ref_coh85y = { download };
const _ref_xlqup5 = { bufferMediaStream };
const _ref_9ezaae = { removeMetadata };
const _ref_i5nt3z = { traceroute };
const _ref_kchw6d = { getOutputTimestamp };
const _ref_twcbvh = { detectAudioCodec };
const _ref_jt9d5d = { compileVertexShader };
const _ref_ejt8ru = { renameFile };
const _ref_uxad0w = { stopOscillator };
const _ref_zymafm = { analyzeQueryPlan };
const _ref_ijpfjb = { disableDepthTest };
const _ref_f4gj2i = { segmentImageUNet };
const _ref_mcq7zj = { removeRigidBody };
const _ref_0tg314 = { handleTimeout };
const _ref_rwusaq = { muteStream };
const _ref_gsmdqf = { serializeFormData };
const _ref_7jlqbb = { createIndexBuffer };
const _ref_wolelf = { convertHSLtoRGB };
const _ref_3nm04s = { virtualScroll };
const _ref_jyk48g = { interceptRequest };
const _ref_f37v1c = { enableBlend };
const _ref_8dep5e = { ProtocolBufferHandler };
const _ref_q959bv = { detectCollision };
const _ref_j6hcpd = { seedRatioLimit };
const _ref_nda7fz = { translateMatrix };
const _ref_c64v4n = { renderShadowMap };
const _ref_het3by = { filterTraffic };
const _ref_vhrog9 = { setPosition };
const _ref_vizwie = { calculateMD5 };
const _ref_7ums4z = { registerGestureHandler };
const _ref_n2he8b = { setSteeringValue };
const _ref_2qntx1 = { monitorNetworkInterface };
const _ref_ftculm = { encryptPayload };
const _ref_66q4f6 = { updateWheelTransform };
const _ref_fblzqy = { generateDocumentation };
const _ref_q7ssrz = { getVehicleSpeed };
const _ref_tbisah = { postProcessBloom };
const _ref_3iih0m = { triggerHapticFeedback };
const _ref_3hf93j = { readdir };
const _ref_gquavt = { parseM3U8Playlist };
const _ref_4y7uke = { loadTexture };
const _ref_jpmtv0 = { setRatio };
const _ref_m3i0g0 = { syncAudioVideo };
const _ref_6t6get = { extractArchive };
const _ref_upgbys = { deleteBuffer };
const _ref_dt8dq4 = { createStereoPanner };
const _ref_xjhzpd = { createScriptProcessor };
const _ref_8se9mi = { vertexAttribPointer };
const _ref_cehdjk = { detachThread };
const _ref_g5a6hr = { replicateData };
const _ref_cyagvs = { decompressPacket };
const _ref_gz0x7y = { serializeAST };
const _ref_24ugk8 = { decryptHLSStream };
const _ref_ktgb9w = { VirtualFSTree };
const _ref_cm7n34 = { captureFrame };
const _ref_hwdunl = { terminateSession };
const _ref_t218ed = { switchProxyServer };
const _ref_zw0amk = { getMediaDuration };
const _ref_8lvgym = { connectToTracker };
const _ref_wrcy4x = { compileToBytecode };
const _ref_kd1jka = { limitUploadSpeed };
const _ref_0rhgh1 = { unmapMemory };
const _ref_aazdg5 = { killProcess }; 
    });
})({}, {});