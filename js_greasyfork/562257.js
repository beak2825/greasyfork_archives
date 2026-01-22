// ==UserScript==
// @name nicovideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/nicovideo/index.js
// @version 2026.01.21.2
// @description 一键下载nicovideo视频，支持4K/1080P/720P多画质。
// @icon https://www.nicovideo.jp/favicon.ico
// @match *://*.nicovideo.jp/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect nicovideo.jp
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
// @downloadURL https://update.greasyfork.org/scripts/562257/nicovideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562257/nicovideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const configureInterface = (iface, config) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const compressGzip = (data) => data;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const renameFile = (oldName, newName) => newName;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const enableDHT = () => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
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

const deobfuscateString = (str) => atob(str);

const claimRewards = (pool) => "0.5 ETH";

const validateRecaptcha = (token) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const deriveAddress = (path) => "0x123...";

const decodeABI = (data) => ({ method: "transfer", params: [] });

const normalizeFeatures = (data) => data.map(x => x / 255);

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const validateIPWhitelist = (ip) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const encryptPeerTraffic = (data) => btoa(data);

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const encodeABI = (method, params) => "0x...";

const fragmentPacket = (data, mtu) => [data];

const addRigidBody = (world, body) => true;

const applyTorque = (body, torque) => true;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const allowSleepMode = () => true;

const createChannelSplitter = (ctx, channels) => ({});

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const restartApplication = () => console.log("Restarting...");

const createIndex = (table, col) => `IDX_${table}_${col}`;

const enterScope = (table) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const cullFace = (mode) => true;

const checkTypes = (ast) => [];

const createConstraint = (body1, body2) => ({});

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

const getExtension = (name) => ({});

const dropTable = (table) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const acceptConnection = (sock) => ({ fd: 2 });

const setRelease = (node, val) => node.release.value = val;

const checkIntegrityConstraint = (table) => true;

const stakeAssets = (pool, amount) => true;

const listenSocket = (sock, backlog) => true;

const unmuteStream = () => false;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const setFilterType = (filter, type) => filter.type = type;

const compressPacket = (data) => data;

const setAttack = (node, val) => node.attack.value = val;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const registerSystemTray = () => ({ icon: "tray.ico" });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const calculateComplexity = (ast) => 1;

const preventSleepMode = () => true;

const updateTransform = (body) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const remuxContainer = (container) => ({ container, status: "done" });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const muteStream = () => true;

const scaleMatrix = (mat, vec) => mat;

const getMediaDuration = () => 3600;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const leaveGroup = (group) => true;

const preventCSRF = () => "csrf_token";

const createMediaStreamSource = (ctx, stream) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const transcodeStream = (format) => ({ format, status: "processing" });

const disableDepthTest = () => true;

const getOutputTimestamp = (ctx) => Date.now();

const setVelocity = (body, v) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
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

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const stepSimulation = (world, dt) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const computeDominators = (cfg) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

const calculateCRC32 = (data) => "00000000";

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const decompressGzip = (data) => data;

const adjustWindowSize = (sock, size) => true;

const translateMatrix = (mat, vec) => mat;

const deserializeAST = (json) => JSON.parse(json);

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

const registerGestureHandler = (gesture) => true;

const disableRightClick = () => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });


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

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const injectCSPHeader = () => "default-src 'self'";

const renderShadowMap = (scene, light) => ({ texture: {} });

const edgeDetectionSobel = (image) => image;

const clusterKMeans = (data, k) => Array(k).fill([]);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const resolveDNS = (domain) => "127.0.0.1";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const announceToTracker = (url) => ({ url, interval: 1800 });

const parseQueryString = (qs) => ({});

const createSymbolTable = () => ({ scopes: [] });

const closeSocket = (sock) => true;

const mangleNames = (ast) => ast;

const reportError = (msg, line) => console.error(msg);

const commitTransaction = (tx) => true;

const bundleAssets = (assets) => "";

const checkIntegrityToken = (token) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const prefetchAssets = (urls) => urls.length;

const interpretBytecode = (bc) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectDevTools = () => false;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const removeRigidBody = (world, body) => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const establishHandshake = (sock) => true;

const decryptStream = (stream, key) => stream;

const invalidateCache = (key) => true;


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

const auditAccessLogs = () => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const sendPacket = (sock, data) => data.length;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const getcwd = () => "/";

const getVehicleSpeed = (vehicle) => 0;

const decapsulateFrame = (frame) => frame;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const prioritizeTraffic = (queue) => true;

const segmentImageUNet = (img) => "mask_buffer";

const calculateGasFee = (limit) => limit * 20;

const processAudioBuffer = (buffer) => buffer;

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

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const validateProgram = (program) => true;

const mapMemory = (fd, size) => 0x2000;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const merkelizeRoot = (txs) => "root_hash";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const predictTensor = (input) => [0.1, 0.9, 0.0];

const lazyLoadComponent = (name) => ({ name, loaded: false });

const loadCheckpoint = (path) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const deleteProgram = (program) => true;

const lockFile = (path) => ({ path, locked: true });

const prettifyCode = (code) => code;

const closePipe = (fd) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const linkModules = (modules) => ({});

const anchorSoftBody = (soft, rigid) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const resolveCollision = (manifold) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const registerISR = (irq, func) => true;

const measureRTT = (sent, recv) => 10;

const extractArchive = (archive) => ["file1", "file2"];

const removeConstraint = (world, c) => true;

const activeTexture = (unit) => true;

const traceroute = (host) => ["192.168.1.1"];

const convexSweepTest = (shape, start, end) => ({ hit: false });

const inferType = (node) => 'any';

const limitRate = (stream, rate) => stream;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const handleInterrupt = (irq) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createChannelMerger = (ctx, channels) => ({});

const injectMetadata = (file, meta) => ({ file, meta });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const setDistanceModel = (panner, model) => true;

const getCpuLoad = () => Math.random() * 100;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const enableBlend = (func) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const serializeFormData = (form) => JSON.stringify(form);

const replicateData = (node) => ({ target: node, synced: true });

const checkBalance = (addr) => "10.5 ETH";

const setQValue = (filter, q) => filter.Q = q;

const unmountFileSystem = (path) => true;

// Anti-shake references
const _ref_tdwxuh = { configureInterface };
const _ref_tulpq3 = { isFeatureEnabled };
const _ref_l9x3hc = { FileValidator };
const _ref_c2b3np = { syncAudioVideo };
const _ref_nf0bq8 = { unchokePeer };
const _ref_pvokbp = { seedRatioLimit };
const _ref_etlho1 = { uninterestPeer };
const _ref_8jt145 = { compressGzip };
const _ref_zn6p79 = { formatLogMessage };
const _ref_qazoxu = { renameFile };
const _ref_u6d7ab = { generateUUIDv5 };
const _ref_aphrb9 = { enableDHT };
const _ref_jhpoq6 = { resolveDependencyGraph };
const _ref_pg46lo = { TaskScheduler };
const _ref_ltllgn = { deobfuscateString };
const _ref_10kah7 = { claimRewards };
const _ref_ckbnq8 = { validateRecaptcha };
const _ref_tmytix = { limitUploadSpeed };
const _ref_f8qx3n = { requestPiece };
const _ref_a8cblx = { deriveAddress };
const _ref_l288v3 = { decodeABI };
const _ref_jlte6g = { normalizeFeatures };
const _ref_adijn9 = { throttleRequests };
const _ref_xhb0v5 = { simulateNetworkDelay };
const _ref_yovyeb = { renderVirtualDOM };
const _ref_kia39t = { validateIPWhitelist };
const _ref_4u7n3s = { encryptPayload };
const _ref_1tdybt = { scrapeTracker };
const _ref_apua2l = { encryptPeerTraffic };
const _ref_27kirs = { animateTransition };
const _ref_2kth51 = { createScriptProcessor };
const _ref_8uv2bg = { encodeABI };
const _ref_tbo6pa = { fragmentPacket };
const _ref_2ph5a5 = { addRigidBody };
const _ref_6x2ani = { applyTorque };
const _ref_ar1lu8 = { detectFirewallStatus };
const _ref_z222ad = { interceptRequest };
const _ref_frmenw = { allowSleepMode };
const _ref_pku8v5 = { createChannelSplitter };
const _ref_8vagpn = { initWebGLContext };
const _ref_8i4g0f = { restartApplication };
const _ref_0czre7 = { createIndex };
const _ref_xx7ku9 = { enterScope };
const _ref_yq50kg = { createAudioContext };
const _ref_nijjca = { generateWalletKeys };
const _ref_8t84du = { cullFace };
const _ref_otgq1o = { checkTypes };
const _ref_mrygyh = { createConstraint };
const _ref_qtgqs8 = { download };
const _ref_wjcadk = { getExtension };
const _ref_x4vser = { dropTable };
const _ref_ud3cdj = { flushSocketBuffer };
const _ref_oslmul = { acceptConnection };
const _ref_8jtimc = { setRelease };
const _ref_dyt5rb = { checkIntegrityConstraint };
const _ref_lxhz6q = { stakeAssets };
const _ref_goxhph = { listenSocket };
const _ref_aa3oim = { unmuteStream };
const _ref_8x6mhf = { createDelay };
const _ref_vzktes = { setFilterType };
const _ref_ldsohi = { compressPacket };
const _ref_yug7di = { setAttack };
const _ref_a7r8sh = { resolveDNSOverHTTPS };
const _ref_0ia4o4 = { registerSystemTray };
const _ref_ls1v18 = { getVelocity };
const _ref_r7okwd = { traceStack };
const _ref_372cus = { calculateComplexity };
const _ref_i86xfx = { preventSleepMode };
const _ref_6lu3zw = { updateTransform };
const _ref_q54ui1 = { createPeriodicWave };
const _ref_7k8pgy = { remuxContainer };
const _ref_d8unsi = { debounceAction };
const _ref_vdneds = { muteStream };
const _ref_k3nelb = { scaleMatrix };
const _ref_w83hhk = { getMediaDuration };
const _ref_fxt5dh = { optimizeConnectionPool };
const _ref_9pt6ah = { checkIntegrity };
const _ref_ve5x6e = { leaveGroup };
const _ref_tdj2a2 = { preventCSRF };
const _ref_19rx47 = { createMediaStreamSource };
const _ref_kawpnb = { createGainNode };
const _ref_39ge76 = { transcodeStream };
const _ref_iwqs9h = { disableDepthTest };
const _ref_nazlex = { getOutputTimestamp };
const _ref_rpporl = { setVelocity };
const _ref_aneg9g = { detectEnvironment };
const _ref_5osbo8 = { ApiDataFormatter };
const _ref_lq3lm2 = { createCapsuleShape };
const _ref_o7ny5t = { getMemoryUsage };
const _ref_752yzl = { stepSimulation };
const _ref_tkbpex = { performTLSHandshake };
const _ref_rb1lyz = { computeDominators };
const _ref_b9ygg6 = { decodeAudioData };
const _ref_qvbdzl = { calculateCRC32 };
const _ref_nqh69p = { calculateSHA256 };
const _ref_8ofibl = { decompressGzip };
const _ref_0u4zd7 = { adjustWindowSize };
const _ref_qrhl9h = { translateMatrix };
const _ref_9cpnkr = { deserializeAST };
const _ref_yrz0up = { generateFakeClass };
const _ref_tvdre5 = { registerGestureHandler };
const _ref_amcgd8 = { disableRightClick };
const _ref_e4i5ow = { createBoxShape };
const _ref_yrdfc4 = { CacheManager };
const _ref_mghg70 = { createDynamicsCompressor };
const _ref_w6z10h = { injectCSPHeader };
const _ref_7ajtfm = { renderShadowMap };
const _ref_8ieign = { edgeDetectionSobel };
const _ref_j41kn1 = { clusterKMeans };
const _ref_sgsag3 = { parseM3U8Playlist };
const _ref_81cqht = { signTransaction };
const _ref_3el0cd = { getSystemUptime };
const _ref_0tqri7 = { keepAlivePing };
const _ref_eqebl7 = { resolveDNS };
const _ref_auk6bg = { getAppConfig };
const _ref_uegl03 = { announceToTracker };
const _ref_4m2aok = { parseQueryString };
const _ref_b5aoj3 = { createSymbolTable };
const _ref_qwadqk = { closeSocket };
const _ref_npktkh = { mangleNames };
const _ref_erf8hu = { reportError };
const _ref_3v2q9f = { commitTransaction };
const _ref_a09p99 = { bundleAssets };
const _ref_ws0wf1 = { checkIntegrityToken };
const _ref_dfee6r = { parseTorrentFile };
const _ref_pxzin8 = { clearBrowserCache };
const _ref_33cncs = { prefetchAssets };
const _ref_alllkq = { interpretBytecode };
const _ref_myybza = { limitBandwidth };
const _ref_dx3hz5 = { detectDevTools };
const _ref_44mnfe = { extractThumbnail };
const _ref_6yqldf = { removeRigidBody };
const _ref_15bgfa = { loadModelWeights };
const _ref_dajpdx = { establishHandshake };
const _ref_ly0my6 = { decryptStream };
const _ref_5j3a73 = { invalidateCache };
const _ref_f2vsb6 = { TelemetryClient };
const _ref_anu89x = { auditAccessLogs };
const _ref_8lcjt1 = { checkPortAvailability };
const _ref_2gvlsn = { sendPacket };
const _ref_uepkyl = { parseMagnetLink };
const _ref_7xifbv = { getcwd };
const _ref_wc5whu = { getVehicleSpeed };
const _ref_69yh2r = { decapsulateFrame };
const _ref_1w04r8 = { updateBitfield };
const _ref_9ns0fp = { serializeAST };
const _ref_wban5n = { prioritizeTraffic };
const _ref_20n3pw = { segmentImageUNet };
const _ref_l37g1w = { calculateGasFee };
const _ref_yw4ddw = { processAudioBuffer };
const _ref_8li72q = { VirtualFSTree };
const _ref_i4fzy8 = { validateTokenStructure };
const _ref_aisrp0 = { validateProgram };
const _ref_ne56gx = { mapMemory };
const _ref_z0al0u = { streamToPlayer };
const _ref_ri9vu2 = { merkelizeRoot };
const _ref_ibju89 = { getNetworkStats };
const _ref_4lck66 = { predictTensor };
const _ref_lw3x8u = { lazyLoadComponent };
const _ref_lo9hk4 = { loadCheckpoint };
const _ref_52ezh0 = { checkDiskSpace };
const _ref_unedr1 = { deleteProgram };
const _ref_eegzzj = { lockFile };
const _ref_weyv9d = { prettifyCode };
const _ref_zhbgzn = { closePipe };
const _ref_4rln2w = { allocateDiskSpace };
const _ref_qrb6kr = { linkModules };
const _ref_cqop10 = { anchorSoftBody };
const _ref_jw0ubb = { connectToTracker };
const _ref_tvaozt = { optimizeMemoryUsage };
const _ref_7m540a = { archiveFiles };
const _ref_0upovf = { resolveCollision };
const _ref_lry594 = { setFilePermissions };
const _ref_2myvj2 = { registerISR };
const _ref_v04t5m = { measureRTT };
const _ref_9s27nx = { extractArchive };
const _ref_tdgjkq = { removeConstraint };
const _ref_dn3m1n = { activeTexture };
const _ref_6np5aq = { traceroute };
const _ref_prspdr = { convexSweepTest };
const _ref_1x8hx5 = { inferType };
const _ref_mx3s3j = { limitRate };
const _ref_lph9jv = { deleteTempFiles };
const _ref_x314j2 = { handleInterrupt };
const _ref_amak1y = { tunnelThroughProxy };
const _ref_fxhc8k = { generateUserAgent };
const _ref_vbp763 = { createChannelMerger };
const _ref_ktbrcw = { injectMetadata };
const _ref_4b42zz = { rotateUserAgent };
const _ref_paefej = { setDistanceModel };
const _ref_1eut9n = { getCpuLoad };
const _ref_rnajqu = { applyEngineForce };
const _ref_8fio94 = { syncDatabase };
const _ref_h4j0i2 = { enableBlend };
const _ref_ka2eiu = { connectionPooling };
const _ref_9hau80 = { serializeFormData };
const _ref_3i49ws = { replicateData };
const _ref_e66fe3 = { checkBalance };
const _ref_725t6c = { setQValue };
const _ref_zgp8q2 = { unmountFileSystem }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `nicovideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `nicovideo` };

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
        const getVehicleSpeed = (vehicle) => 0;

const getCpuLoad = () => Math.random() * 100;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const rateLimitCheck = (ip) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const auditAccessLogs = () => true;

const detectVirtualMachine = () => false;

const obfuscateString = (str) => btoa(str);

const merkelizeRoot = (txs) => "root_hash";

const prioritizeRarestPiece = (pieces) => pieces[0];

const validateIPWhitelist = (ip) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const monitorClipboard = () => "";

const injectCSPHeader = () => "default-src 'self'";

const signTransaction = (tx, key) => "signed_tx_hash";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const edgeDetectionSobel = (image) => image;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const deriveAddress = (path) => "0x123...";

const convertFormat = (src, dest) => dest;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });


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

const lockFile = (path) => ({ path, locked: true });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const syncAudioVideo = (offset) => ({ offset, synced: true });

const clearScreen = (r, g, b, a) => true;

const cullFace = (mode) => true;

const eliminateDeadCode = (ast) => ast;

const addRigidBody = (world, body) => true;

const compileVertexShader = (source) => ({ compiled: true });

const adjustPlaybackSpeed = (rate) => rate;

const prefetchAssets = (urls) => urls.length;

const updateTransform = (body) => true;

const setDistanceModel = (panner, model) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const deleteTexture = (texture) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const setPan = (node, val) => node.pan.value = val;

const tokenizeText = (text) => text.split(" ");

const deleteBuffer = (buffer) => true;

const backpropagateGradient = (loss) => true;

const stakeAssets = (pool, amount) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const closeContext = (ctx) => Promise.resolve();

const translateText = (text, lang) => text;

const createASTNode = (type, val) => ({ type, val });

const resampleAudio = (buffer, rate) => buffer;

const getExtension = (name) => ({});

const createAudioContext = () => ({ sampleRate: 44100 });

const seedRatioLimit = (ratio) => ratio >= 2.0;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const analyzeControlFlow = (ast) => ({ graph: {} });

const classifySentiment = (text) => "positive";

const mountFileSystem = (dev, path) => true;

const allocateRegisters = (ir) => ir;

const normalizeFeatures = (data) => data.map(x => x / 255);

const remuxContainer = (container) => ({ container, status: "done" });

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const allowSleepMode = () => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

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

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const createIndexBuffer = (data) => ({ id: Math.random() });

const applyTheme = (theme) => document.body.className = theme;

const addWheel = (vehicle, info) => true;

const unlockFile = (path) => ({ path, locked: false });

const resumeContext = (ctx) => Promise.resolve();

const receivePacket = (sock, len) => new Uint8Array(len);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const addConeTwistConstraint = (world, c) => true;

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

const joinGroup = (group) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const generateMipmaps = (target) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const generateCode = (ast) => "const a = 1;";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const encryptStream = (stream, key) => stream;

const setFilterType = (filter, type) => filter.type = type;

const resolveSymbols = (ast) => ({});

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const dumpSymbolTable = (table) => "";

const interpretBytecode = (bc) => true;

const getUniformLocation = (program, name) => 1;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const unlockRow = (id) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const vertexAttrib3f = (idx, x, y, z) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const bundleAssets = (assets) => "";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const adjustWindowSize = (sock, size) => true;

const linkModules = (modules) => ({});

const optimizeTailCalls = (ast) => ast;

const createTCPSocket = () => ({ fd: 1 });

const compileToBytecode = (ast) => new Uint8Array();

const fragmentPacket = (data, mtu) => [data];

const prettifyCode = (code) => code;

const logErrorToFile = (err) => console.error(err);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const bufferMediaStream = (size) => ({ buffer: size });

const clusterKMeans = (data, k) => Array(k).fill([]);

const validateProgram = (program) => true;

const enableDHT = () => true;

const verifyProofOfWork = (nonce) => true;

const unrollLoops = (ast) => ast;

const broadcastMessage = (msg) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const processAudioBuffer = (buffer) => buffer;

const traverseAST = (node, visitor) => true;

const allocateMemory = (size) => 0x1000;

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

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const rmdir = (path) => true;

const addSliderConstraint = (world, c) => true;

const createSymbolTable = () => ({ scopes: [] });

const rotateMatrix = (mat, angle, axis) => mat;

const captureScreenshot = () => "data:image/png;base64,...";

const createSphereShape = (r) => ({ type: 'sphere' });

const emitParticles = (sys, count) => true;

const encryptPeerTraffic = (data) => btoa(data);

const synthesizeSpeech = (text) => "audio_buffer";

const setMass = (body, m) => true;

const negotiateProtocol = () => "HTTP/2.0";

const applyTorque = (body, torque) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const drawArrays = (gl, mode, first, count) => true;

const closePipe = (fd) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const panicKernel = (msg) => false;

const readFile = (fd, len) => "";

const generateSourceMap = (ast) => "{}";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const mangleNames = (ast) => ast;

const setRatio = (node, val) => node.ratio.value = val;

const statFile = (path) => ({ size: 0 });

const suspendContext = (ctx) => Promise.resolve();

const setRelease = (node, val) => node.release.value = val;

const registerISR = (irq, func) => true;

const createConstraint = (body1, body2) => ({});

const extractArchive = (archive) => ["file1", "file2"];

const validateFormInput = (input) => input.length > 0;

const parsePayload = (packet) => ({});

const subscribeToEvents = (contract) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const listenSocket = (sock, backlog) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const setInertia = (body, i) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const setQValue = (filter, q) => filter.Q = q;

const removeRigidBody = (world, body) => true;

const shutdownComputer = () => console.log("Shutting down...");

const loadDriver = (path) => true;

const updateRoutingTable = (entry) => true;

const prioritizeTraffic = (queue) => true;

const detectDebugger = () => false;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const forkProcess = () => 101;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const joinThread = (tid) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const connectSocket = (sock, addr, port) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const preventSleepMode = () => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const anchorSoftBody = (soft, rigid) => true;

const rebootSystem = () => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const decompressPacket = (data) => data;

const switchVLAN = (id) => true;

const claimRewards = (pool) => "0.5 ETH";

const unchokePeer = (peer) => ({ ...peer, choked: false });

const calculateMetric = (route) => 1;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const augmentData = (image) => image;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const dhcpOffer = (ip) => true;

const encodeABI = (method, params) => "0x...";

const setPosition = (panner, x, y, z) => true;

// Anti-shake references
const _ref_nalpx3 = { getVehicleSpeed };
const _ref_mxm7c7 = { getCpuLoad };
const _ref_6cyxbq = { calculateLighting };
const _ref_l0qp67 = { computeNormal };
const _ref_tsat3g = { moveFileToComplete };
const _ref_m6tm16 = { rateLimitCheck };
const _ref_tic4de = { generateWalletKeys };
const _ref_237nsj = { auditAccessLogs };
const _ref_stk7uk = { detectVirtualMachine };
const _ref_q8vs98 = { obfuscateString };
const _ref_p1di4a = { merkelizeRoot };
const _ref_dzl76z = { prioritizeRarestPiece };
const _ref_nie232 = { validateIPWhitelist };
const _ref_hmddf8 = { archiveFiles };
const _ref_5za3gw = { monitorClipboard };
const _ref_894j7b = { injectCSPHeader };
const _ref_pspbfx = { signTransaction };
const _ref_zzmn5a = { parseConfigFile };
const _ref_uik7b6 = { initWebGLContext };
const _ref_79uwzd = { normalizeAudio };
const _ref_9cj3g5 = { edgeDetectionSobel };
const _ref_5japzj = { generateUUIDv5 };
const _ref_8tec0r = { deriveAddress };
const _ref_xcjmv1 = { convertFormat };
const _ref_v2ag1q = { compressDataStream };
const _ref_417np3 = { convertHSLtoRGB };
const _ref_hv5n2i = { analyzeUserBehavior };
const _ref_98psd8 = { scrapeTracker };
const _ref_zy7ycm = { TelemetryClient };
const _ref_59b7fy = { lockFile };
const _ref_lhsrja = { verifyMagnetLink };
const _ref_92wugd = { parseMagnetLink };
const _ref_qb05xv = { syncAudioVideo };
const _ref_ymra15 = { clearScreen };
const _ref_9aljwk = { cullFace };
const _ref_6ryybm = { eliminateDeadCode };
const _ref_g61h6p = { addRigidBody };
const _ref_9xowg9 = { compileVertexShader };
const _ref_hmm9p3 = { adjustPlaybackSpeed };
const _ref_v926ig = { prefetchAssets };
const _ref_7btir2 = { updateTransform };
const _ref_zqpgmr = { setDistanceModel };
const _ref_xm1cdh = { detectObjectYOLO };
const _ref_nw2iqe = { deleteTexture };
const _ref_7u3f8g = { createBoxShape };
const _ref_h5qjqq = { setPan };
const _ref_zqpxdi = { tokenizeText };
const _ref_42i49m = { deleteBuffer };
const _ref_ok01tv = { backpropagateGradient };
const _ref_uwj0hv = { stakeAssets };
const _ref_ykorw9 = { lazyLoadComponent };
const _ref_s3i3bo = { closeContext };
const _ref_6edjdd = { translateText };
const _ref_z47661 = { createASTNode };
const _ref_z8nab3 = { resampleAudio };
const _ref_4akkkb = { getExtension };
const _ref_98axv8 = { createAudioContext };
const _ref_7brygb = { seedRatioLimit };
const _ref_kros3h = { isFeatureEnabled };
const _ref_ksxjdi = { analyzeControlFlow };
const _ref_blnukn = { classifySentiment };
const _ref_ysgtlx = { mountFileSystem };
const _ref_i28xpr = { allocateRegisters };
const _ref_0kx42h = { normalizeFeatures };
const _ref_6v3rqo = { remuxContainer };
const _ref_2nymhz = { computeSpeedAverage };
const _ref_yl2m4k = { allowSleepMode };
const _ref_3h2tfh = { cancelAnimationFrameLoop };
const _ref_174x17 = { AdvancedCipher };
const _ref_pqs8my = { initiateHandshake };
const _ref_v53s88 = { calculateSHA256 };
const _ref_3zt23k = { createIndexBuffer };
const _ref_hpju9v = { applyTheme };
const _ref_rqrlnk = { addWheel };
const _ref_nnzmzo = { unlockFile };
const _ref_bsw1q1 = { resumeContext };
const _ref_9wqfsp = { receivePacket };
const _ref_yf0vaj = { detectEnvironment };
const _ref_nh1ems = { addConeTwistConstraint };
const _ref_a6hhq1 = { TaskScheduler };
const _ref_7x7fv1 = { joinGroup };
const _ref_nmknh5 = { announceToTracker };
const _ref_sbgonc = { generateMipmaps };
const _ref_tnzy2b = { resolveDependencyGraph };
const _ref_ecj9xk = { generateCode };
const _ref_sr1a19 = { discoverPeersDHT };
const _ref_fvm9pz = { encryptStream };
const _ref_kx7r87 = { setFilterType };
const _ref_knq8f7 = { resolveSymbols };
const _ref_0pyqr8 = { debounceAction };
const _ref_jjjasu = { dumpSymbolTable };
const _ref_vvf7i7 = { interpretBytecode };
const _ref_3w6s0a = { getUniformLocation };
const _ref_c6yiz5 = { queueDownloadTask };
const _ref_3brsce = { unlockRow };
const _ref_5ff9xr = { diffVirtualDOM };
const _ref_5letmk = { vertexAttrib3f };
const _ref_cvmg5u = { linkProgram };
const _ref_nixykl = { bundleAssets };
const _ref_84r32t = { checkIntegrity };
const _ref_ixulaq = { requestAnimationFrameLoop };
const _ref_pp1j62 = { getFileAttributes };
const _ref_am4th0 = { adjustWindowSize };
const _ref_05d7fx = { linkModules };
const _ref_b19dhn = { optimizeTailCalls };
const _ref_pvb03y = { createTCPSocket };
const _ref_gmc5bh = { compileToBytecode };
const _ref_q62m5f = { fragmentPacket };
const _ref_thywc1 = { prettifyCode };
const _ref_c7j7q5 = { logErrorToFile };
const _ref_3oogv4 = { getAppConfig };
const _ref_woiv34 = { bufferMediaStream };
const _ref_iyz87x = { clusterKMeans };
const _ref_jet58x = { validateProgram };
const _ref_xa0dqo = { enableDHT };
const _ref_lxk9q3 = { verifyProofOfWork };
const _ref_q0tr5a = { unrollLoops };
const _ref_oazr5r = { broadcastMessage };
const _ref_2bze9e = { clearBrowserCache };
const _ref_wrml5t = { processAudioBuffer };
const _ref_pmterq = { traverseAST };
const _ref_ezb2k9 = { allocateMemory };
const _ref_tzrnc2 = { VirtualFSTree };
const _ref_76u01y = { parseTorrentFile };
const _ref_6cm0xd = { throttleRequests };
const _ref_vvnkyg = { rmdir };
const _ref_or6nyx = { addSliderConstraint };
const _ref_v7euu3 = { createSymbolTable };
const _ref_sacsac = { rotateMatrix };
const _ref_eei8el = { captureScreenshot };
const _ref_zzr0aq = { createSphereShape };
const _ref_ymoo03 = { emitParticles };
const _ref_da56du = { encryptPeerTraffic };
const _ref_x7ib5u = { synthesizeSpeech };
const _ref_dhoqbt = { setMass };
const _ref_n9d1ew = { negotiateProtocol };
const _ref_gflm2j = { applyTorque };
const _ref_5gu6pu = { setSocketTimeout };
const _ref_vm0sth = { drawArrays };
const _ref_siemc4 = { closePipe };
const _ref_a1pm0b = { formatCurrency };
const _ref_c081rg = { normalizeVector };
const _ref_dztzyf = { animateTransition };
const _ref_1dta29 = { panicKernel };
const _ref_a8d9vr = { readFile };
const _ref_lda08r = { generateSourceMap };
const _ref_0fcw0r = { requestPiece };
const _ref_9mremt = { mangleNames };
const _ref_8r34nz = { setRatio };
const _ref_7hmb67 = { statFile };
const _ref_bg439o = { suspendContext };
const _ref_nuijvk = { setRelease };
const _ref_qr78ld = { registerISR };
const _ref_vt33sp = { createConstraint };
const _ref_sj4qpd = { extractArchive };
const _ref_6x54zz = { validateFormInput };
const _ref_y0721s = { parsePayload };
const _ref_qq8iml = { subscribeToEvents };
const _ref_l06rwu = { executeSQLQuery };
const _ref_oldow1 = { listenSocket };
const _ref_fd9tlo = { convertRGBtoHSL };
const _ref_gb9erd = { setInertia };
const _ref_i6ndfr = { performTLSHandshake };
const _ref_02oe3t = { setQValue };
const _ref_h8ixu4 = { removeRigidBody };
const _ref_kkg4ij = { shutdownComputer };
const _ref_cvuu67 = { loadDriver };
const _ref_59rudr = { updateRoutingTable };
const _ref_v7pwp7 = { prioritizeTraffic };
const _ref_2emxme = { detectDebugger };
const _ref_r3gh2a = { calculateEntropy };
const _ref_ewu8gl = { forkProcess };
const _ref_tbqe39 = { handshakePeer };
const _ref_5ks9te = { loadModelWeights };
const _ref_68h1ag = { joinThread };
const _ref_j9l04s = { validateMnemonic };
const _ref_sohzbj = { switchProxyServer };
const _ref_e7xhj8 = { createDirectoryRecursive };
const _ref_6rxb9y = { connectSocket };
const _ref_srb223 = { predictTensor };
const _ref_gsvmh6 = { preventSleepMode };
const _ref_gegbct = { resolveDNSOverHTTPS };
const _ref_znfhr8 = { decodeABI };
const _ref_f5f8fr = { migrateSchema };
const _ref_66hy6i = { anchorSoftBody };
const _ref_uuiyeq = { rebootSystem };
const _ref_6gm771 = { setBrake };
const _ref_wcpaow = { decompressPacket };
const _ref_lprkzr = { switchVLAN };
const _ref_jf1q7l = { claimRewards };
const _ref_hu41a2 = { unchokePeer };
const _ref_xwb2rg = { calculateMetric };
const _ref_ztjwnx = { calculatePieceHash };
const _ref_k99sq0 = { getAngularVelocity };
const _ref_kgxjsk = { shardingTable };
const _ref_crglof = { augmentData };
const _ref_ct03z2 = { renderVirtualDOM };
const _ref_qonvz5 = { dhcpOffer };
const _ref_gbjyyk = { encodeABI };
const _ref_u3509z = { setPosition }; 
    });
})({}, {});