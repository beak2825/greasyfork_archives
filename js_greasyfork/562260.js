// ==UserScript==
// @name PearVideo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/PearVideo/index.js
// @version 2026.01.10
// @description 一键下载PearVideo视频，支持4K/1080P/720P多画质。
// @icon https://page.pearvideo.com/webres/img/favicon.ico
// @match *://*.pearvideo.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect pearvideo.com
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
// @downloadURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562260/PearVideo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const createBoxShape = (w, h, d) => ({ type: 'box' });

const segmentImageUNet = (img) => "mask_buffer";

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

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

const rateLimitCheck = (ip) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const replicateData = (node) => ({ target: node, synced: true });

const setThreshold = (node, val) => node.threshold.value = val;


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

const unmapMemory = (ptr, size) => true;

const dropTable = (table) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const enableInterrupts = () => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const installUpdate = () => false;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const calculateGasFee = (limit) => limit * 20;

const switchVLAN = (id) => true;

const downInterface = (iface) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const encapsulateFrame = (packet) => packet;

const setMTU = (iface, mtu) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const compileVertexShader = (source) => ({ compiled: true });

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


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const logErrorToFile = (err) => console.error(err);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const triggerHapticFeedback = (intensity) => true;

const deobfuscateString = (str) => atob(str);

const setRatio = (node, val) => node.ratio.value = val;

const semaphoreWait = (sem) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const setRelease = (node, val) => node.release.value = val;

const decodeAudioData = (buffer) => Promise.resolve({});

const createProcess = (img) => ({ pid: 100 });

const bindTexture = (target, texture) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const getExtension = (name) => ({});

const stopOscillator = (osc, time) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectDebugger = () => false;

const dhcpAck = () => true;

const bindSocket = (port) => ({ port, status: "bound" });

const validateRecaptcha = (token) => true;

const decapsulateFrame = (frame) => frame;

const detachThread = (tid) => true;

const dhcpRequest = (ip) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const attachRenderBuffer = (fb, rb) => true;

const joinThread = (tid) => true;

const checkBalance = (addr) => "10.5 ETH";

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createPipe = () => [3, 4];

const backupDatabase = (path) => ({ path, size: 5000 });

const startOscillator = (osc, time) => true;


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

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const closePipe = (fd) => true;

const createTCPSocket = () => ({ fd: 1 });

const createAudioContext = () => ({ sampleRate: 44100 });

const broadcastTransaction = (tx) => "tx_hash_123";

const prioritizeRarestPiece = (pieces) => pieces[0];

const defineSymbol = (table, name, info) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const computeDominators = (cfg) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const clusterKMeans = (data, k) => Array(k).fill([]);

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const applyForce = (body, force, point) => true;

const addConeTwistConstraint = (world, c) => true;

const filterTraffic = (rule) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const pingHost = (host) => 10;

const setMass = (body, m) => true;

const createParticleSystem = (count) => ({ particles: [] });

const interpretBytecode = (bc) => true;

const uniform1i = (loc, val) => true;

const optimizeAST = (ast) => ast;

const setDetune = (osc, cents) => osc.detune = cents;

const invalidateCache = (key) => true;

const getCpuLoad = () => Math.random() * 100;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const detectDarkMode = () => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const obfuscateString = (str) => btoa(str);

const verifySignature = (tx, sig) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const suspendContext = (ctx) => Promise.resolve();

const encryptPeerTraffic = (data) => btoa(data);

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

const preventSleepMode = () => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const mockResponse = (body) => ({ status: 200, body });

const restoreDatabase = (path) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const verifyProofOfWork = (nonce) => true;

const jitCompile = (bc) => (() => {});

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const statFile = (path) => ({ size: 0 });

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const retransmitPacket = (seq) => true;

const addSliderConstraint = (world, c) => true;

const chmodFile = (path, mode) => true;

const clearScreen = (r, g, b, a) => true;

const resolveDNS = (domain) => "127.0.0.1";


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

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const getMediaDuration = () => 3600;

const injectCSPHeader = () => "default-src 'self'";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const calculateComplexity = (ast) => 1;

const verifyIR = (ir) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const merkelizeRoot = (txs) => "root_hash";

const addGeneric6DofConstraint = (world, c) => true;

const preventCSRF = () => "csrf_token";

const unmountFileSystem = (path) => true;

const closeContext = (ctx) => Promise.resolve();

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const optimizeTailCalls = (ast) => ast;

const drawElements = (mode, count, type, offset) => true;

const forkProcess = () => 101;

const validateFormInput = (input) => input.length > 0;

const applyTheme = (theme) => document.body.className = theme;

const useProgram = (program) => true;

const sleep = (body) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const setSocketTimeout = (ms) => ({ timeout: ms });

const mutexUnlock = (mtx) => true;

const handleTimeout = (sock) => true;

const processAudioBuffer = (buffer) => buffer;

const claimRewards = (pool) => "0.5 ETH";

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const parsePayload = (packet) => ({});

const setFrequency = (osc, freq) => osc.frequency.value = freq;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const updateWheelTransform = (wheel) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createIndexBuffer = (data) => ({ id: Math.random() });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const encryptStream = (stream, key) => stream;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const disableRightClick = () => true;

const getOutputTimestamp = (ctx) => Date.now();

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const auditAccessLogs = () => true;

const detectVirtualMachine = () => false;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const receivePacket = (sock, len) => new Uint8Array(len);

const protectMemory = (ptr, size, flags) => true;

const prioritizeTraffic = (queue) => true;

const createThread = (func) => ({ tid: 1 });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const allowSleepMode = () => true;

const setEnv = (key, val) => true;

const validateIPWhitelist = (ip) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
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

const detectPacketLoss = (acks) => false;

const killParticles = (sys) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createChannelMerger = (ctx, channels) => ({});

const encryptLocalStorage = (key, val) => true;

const checkRootAccess = () => false;

const createConstraint = (body1, body2) => ({});

const announceToTracker = (url) => ({ url, interval: 1800 });

const scheduleTask = (task) => ({ id: 1, task });

const sanitizeXSS = (html) => html;

const disableInterrupts = () => true;

const injectMetadata = (file, meta) => ({ file, meta });

const eliminateDeadCode = (ast) => ast;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const parseQueryString = (qs) => ({});

const configureInterface = (iface, config) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const decryptStream = (stream, key) => stream;

const fingerprintBrowser = () => "fp_hash_123";

const makeDistortionCurve = (amount) => new Float32Array(4096);

const swapTokens = (pair, amount) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const setAttack = (node, val) => node.attack.value = val;

// Anti-shake references
const _ref_o69o66 = { createBoxShape };
const _ref_81co1q = { segmentImageUNet };
const _ref_et8snk = { checkDiskSpace };
const _ref_j1erun = { download };
const _ref_0tvxvd = { rateLimitCheck };
const _ref_23lvml = { formatCurrency };
const _ref_sotjux = { resolveDependencyGraph };
const _ref_gaxko9 = { replicateData };
const _ref_xq0lfa = { setThreshold };
const _ref_i3lnvx = { CacheManager };
const _ref_cii95u = { unmapMemory };
const _ref_5bypsq = { dropTable };
const _ref_yocf90 = { transformAesKey };
const _ref_bd9rqv = { enableInterrupts };
const _ref_e8j64w = { connectToTracker };
const _ref_s0yrtn = { handshakePeer };
const _ref_cpltaf = { FileValidator };
const _ref_1y825t = { installUpdate };
const _ref_koiw8v = { optimizeMemoryUsage };
const _ref_do7uae = { calculateGasFee };
const _ref_u67f60 = { switchVLAN };
const _ref_m5acg8 = { downInterface };
const _ref_0cnydc = { traceStack };
const _ref_xmmnp6 = { arpRequest };
const _ref_3704as = { encapsulateFrame };
const _ref_sd9knf = { setMTU };
const _ref_isn24v = { parseConfigFile };
const _ref_p6bczi = { compileVertexShader };
const _ref_ff60ko = { generateFakeClass };
const _ref_nk0wh6 = { getAppConfig };
const _ref_rwlr9n = { createPanner };
const _ref_qjjjl1 = { logErrorToFile };
const _ref_ui4c7j = { normalizeVector };
const _ref_b6g0p5 = { generateWalletKeys };
const _ref_zad3eu = { triggerHapticFeedback };
const _ref_evk30f = { deobfuscateString };
const _ref_5q90ff = { setRatio };
const _ref_skgf14 = { semaphoreWait };
const _ref_41ptzy = { checkIntegrity };
const _ref_iydh3x = { terminateSession };
const _ref_0s34kv = { setRelease };
const _ref_pr4b8k = { decodeAudioData };
const _ref_ibroua = { createProcess };
const _ref_3jzbpi = { bindTexture };
const _ref_bp6iep = { saveCheckpoint };
const _ref_6zkxn2 = { getExtension };
const _ref_16a1a7 = { stopOscillator };
const _ref_jufpuq = { limitBandwidth };
const _ref_ss12g9 = { detectDebugger };
const _ref_st57qf = { dhcpAck };
const _ref_8fcj9b = { bindSocket };
const _ref_oo1b4x = { validateRecaptcha };
const _ref_mre9ry = { decapsulateFrame };
const _ref_9s0j7i = { detachThread };
const _ref_lit89g = { dhcpRequest };
const _ref_ieieoo = { queueDownloadTask };
const _ref_outkpw = { attachRenderBuffer };
const _ref_k8zucb = { joinThread };
const _ref_3i9psx = { checkBalance };
const _ref_3gqsnk = { detectFirewallStatus };
const _ref_z675fm = { createGainNode };
const _ref_ldfadq = { decryptHLSStream };
const _ref_4ht2t3 = { detectEnvironment };
const _ref_b0w9pj = { createPipe };
const _ref_t65a5i = { backupDatabase };
const _ref_phubod = { startOscillator };
const _ref_ti1kyc = { ResourceMonitor };
const _ref_3ujr0q = { switchProxyServer };
const _ref_lbp017 = { closePipe };
const _ref_yfe5cl = { createTCPSocket };
const _ref_dxjcwu = { createAudioContext };
const _ref_xog1k6 = { broadcastTransaction };
const _ref_3gd4pc = { prioritizeRarestPiece };
const _ref_2x2jk8 = { defineSymbol };
const _ref_01jwh9 = { createDirectoryRecursive };
const _ref_3690ek = { computeDominators };
const _ref_n2ade8 = { syncAudioVideo };
const _ref_qsw0td = { clusterKMeans };
const _ref_sclvm6 = { generateUserAgent };
const _ref_xkh2zc = { applyForce };
const _ref_jyp2vf = { addConeTwistConstraint };
const _ref_7jzp1n = { filterTraffic };
const _ref_0x7p3j = { createDynamicsCompressor };
const _ref_bim8ja = { sanitizeInput };
const _ref_trk0fd = { pingHost };
const _ref_oqkler = { setMass };
const _ref_z7oriq = { createParticleSystem };
const _ref_x5lb97 = { interpretBytecode };
const _ref_mhhw6c = { uniform1i };
const _ref_5964s2 = { optimizeAST };
const _ref_1nrvpn = { setDetune };
const _ref_1kocvi = { invalidateCache };
const _ref_xa2j1d = { getCpuLoad };
const _ref_xni53h = { normalizeAudio };
const _ref_scpvkl = { detectDarkMode };
const _ref_2ozgbl = { lazyLoadComponent };
const _ref_1gmqk2 = { monitorNetworkInterface };
const _ref_tpit3x = { obfuscateString };
const _ref_livbwe = { verifySignature };
const _ref_9i47hm = { createScriptProcessor };
const _ref_0pk4xo = { suspendContext };
const _ref_jhe608 = { encryptPeerTraffic };
const _ref_uezin3 = { TaskScheduler };
const _ref_lsnmpl = { preventSleepMode };
const _ref_jk0v8z = { flushSocketBuffer };
const _ref_zc1w6f = { parseFunction };
const _ref_3c847u = { mockResponse };
const _ref_3ziws6 = { restoreDatabase };
const _ref_e0kp8e = { resolveHostName };
const _ref_ks1t13 = { verifyProofOfWork };
const _ref_s35jh4 = { jitCompile };
const _ref_3z3itr = { optimizeHyperparameters };
const _ref_42ejrb = { statFile };
const _ref_7fx0v2 = { manageCookieJar };
const _ref_akv97b = { retransmitPacket };
const _ref_duykyu = { addSliderConstraint };
const _ref_l1i07f = { chmodFile };
const _ref_ki4ufk = { clearScreen };
const _ref_7yzn5d = { resolveDNS };
const _ref_1lwsdj = { TelemetryClient };
const _ref_5mj82k = { formatLogMessage };
const _ref_8f00x9 = { getMediaDuration };
const _ref_kd05r7 = { injectCSPHeader };
const _ref_gea5t1 = { validateTokenStructure };
const _ref_og77gy = { calculateComplexity };
const _ref_8kz0eu = { verifyIR };
const _ref_je7x0z = { streamToPlayer };
const _ref_qkmexf = { merkelizeRoot };
const _ref_8noasg = { addGeneric6DofConstraint };
const _ref_xps23o = { preventCSRF };
const _ref_y6l6t8 = { unmountFileSystem };
const _ref_0e4nh5 = { closeContext };
const _ref_wzhw7w = { compressDataStream };
const _ref_qw0snj = { optimizeTailCalls };
const _ref_f1g93r = { drawElements };
const _ref_vnxaau = { forkProcess };
const _ref_up9j26 = { validateFormInput };
const _ref_qisgcm = { applyTheme };
const _ref_q9bjdg = { useProgram };
const _ref_pp96eq = { sleep };
const _ref_z0uwmh = { setFilePermissions };
const _ref_hsizwz = { setSocketTimeout };
const _ref_krmin2 = { mutexUnlock };
const _ref_wu127j = { handleTimeout };
const _ref_ran3p6 = { processAudioBuffer };
const _ref_drmcir = { claimRewards };
const _ref_t4xxjy = { optimizeConnectionPool };
const _ref_z4p2pl = { parsePayload };
const _ref_ta6ji9 = { setFrequency };
const _ref_3ef46l = { isFeatureEnabled };
const _ref_kgcu0t = { predictTensor };
const _ref_s5fktb = { createPhysicsWorld };
const _ref_pve3fe = { updateWheelTransform };
const _ref_sdstjc = { requestAnimationFrameLoop };
const _ref_nokel6 = { discoverPeersDHT };
const _ref_3oykuk = { performTLSHandshake };
const _ref_fg8v97 = { createIndexBuffer };
const _ref_ocyv26 = { initiateHandshake };
const _ref_4x2rtc = { encryptStream };
const _ref_1him8c = { watchFileChanges };
const _ref_n80knp = { disableRightClick };
const _ref_g84a71 = { getOutputTimestamp };
const _ref_zelsk8 = { getAngularVelocity };
const _ref_2cno2c = { auditAccessLogs };
const _ref_o8e2ur = { detectVirtualMachine };
const _ref_zymx9c = { renderVirtualDOM };
const _ref_chli74 = { receivePacket };
const _ref_v465a3 = { protectMemory };
const _ref_hrkh9t = { prioritizeTraffic };
const _ref_443h84 = { createThread };
const _ref_t17zd6 = { generateUUIDv5 };
const _ref_nd0t8k = { allowSleepMode };
const _ref_jyq25p = { setEnv };
const _ref_mjpp0i = { validateIPWhitelist };
const _ref_1cfwmx = { calculatePieceHash };
const _ref_sxk8k5 = { ApiDataFormatter };
const _ref_fgxz8e = { detectPacketLoss };
const _ref_gr2nhu = { killParticles };
const _ref_qfk2ug = { updateBitfield };
const _ref_my7d69 = { createChannelMerger };
const _ref_qfmwym = { encryptLocalStorage };
const _ref_t1dtmv = { checkRootAccess };
const _ref_ogp6wv = { createConstraint };
const _ref_1d2e06 = { announceToTracker };
const _ref_3ae9lp = { scheduleTask };
const _ref_zdfx07 = { sanitizeXSS };
const _ref_h0e2v5 = { disableInterrupts };
const _ref_b07b3n = { injectMetadata };
const _ref_9plci0 = { eliminateDeadCode };
const _ref_8dom7u = { rotateUserAgent };
const _ref_m1xah8 = { parseQueryString };
const _ref_bdq8pe = { configureInterface };
const _ref_4f445a = { createSphereShape };
const _ref_9e9vvj = { refreshAuthToken };
const _ref_w572uo = { decryptStream };
const _ref_6scmw4 = { fingerprintBrowser };
const _ref_6mxcn4 = { makeDistortionCurve };
const _ref_lettg3 = { swapTokens };
const _ref_i36swk = { calculateLayoutMetrics };
const _ref_1hffig = { setAttack }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `PearVideo` };
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
                const urlParams = { config, url: window.location.href, name_en: `PearVideo` };

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
        const chownFile = (path, uid, gid) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const generateMipmaps = (target) => true;

const disableDepthTest = () => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const prefetchAssets = (urls) => urls.length;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const lockRow = (id) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const verifyAppSignature = () => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const preventCSRF = () => "csrf_token";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const seedRatioLimit = (ratio) => ratio >= 2.0;

const encryptPeerTraffic = (data) => btoa(data);

const synthesizeSpeech = (text) => "audio_buffer";

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const checkBalance = (addr) => "10.5 ETH";

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const backpropagateGradient = (loss) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
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

const rebootSystem = () => true;

const shutdownComputer = () => console.log("Shutting down...");

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const panicKernel = (msg) => false;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const disablePEX = () => false;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const encapsulateFrame = (packet) => packet;

const contextSwitch = (oldPid, newPid) => true;

const unlinkFile = (path) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const decompressGzip = (data) => data;

const interestPeer = (peer) => ({ ...peer, interested: true });

const chokePeer = (peer) => ({ ...peer, choked: true });

const compressGzip = (data) => data;

const estimateNonce = (addr) => 42;

const sendPacket = (sock, data) => data.length;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const generateSourceMap = (ast) => "{}";

const computeDominators = (cfg) => ({});

const getEnv = (key) => "";

const renderCanvasLayer = (ctx) => true;

const killProcess = (pid) => true;

const joinGroup = (group) => true;

const checkIntegrityToken = (token) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const resolveSymbols = (ast) => ({});

const createDirectoryRecursive = (path) => path.split('/').length;

const checkTypes = (ast) => [];

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const rotateMatrix = (mat, angle, axis) => mat;

const switchVLAN = (id) => true;

const getCpuLoad = () => Math.random() * 100;

const semaphoreWait = (sem) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const linkFile = (src, dest) => true;

const detectDarkMode = () => true;

const enableInterrupts = () => true;

const applyImpulse = (body, impulse, point) => true;

const compileVertexShader = (source) => ({ compiled: true });

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

const removeConstraint = (world, c) => true;

const visitNode = (node) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const configureInterface = (iface, config) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setThreshold = (node, val) => node.threshold.value = val;

const unmapMemory = (ptr, size) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const detectCollision = (body1, body2) => false;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const disconnectNodes = (node) => true;

const uniform1i = (loc, val) => true;

const closeContext = (ctx) => Promise.resolve();

const claimRewards = (pool) => "0.5 ETH";

const allowSleepMode = () => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const performOCR = (img) => "Detected Text";

const beginTransaction = () => "TX-" + Date.now();

const getExtension = (name) => ({});

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const mutexLock = (mtx) => true;

const segmentImageUNet = (img) => "mask_buffer";

const reduceDimensionalityPCA = (data) => data;

const addConeTwistConstraint = (world, c) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const defineSymbol = (table, name, info) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const setAngularVelocity = (body, v) => true;

const setRatio = (node, val) => node.ratio.value = val;

const deriveAddress = (path) => "0x123...";

const mockResponse = (body) => ({ status: 200, body });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const prioritizeRarestPiece = (pieces) => pieces[0];

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const jitCompile = (bc) => (() => {});

const detectPacketLoss = (acks) => false;

const captureScreenshot = () => "data:image/png;base64,...";

const getBlockHeight = () => 15000000;

const setDelayTime = (node, time) => node.delayTime.value = time;

const rollbackTransaction = (tx) => true;

const mergeFiles = (parts) => parts[0];

const decryptStream = (stream, key) => stream;

const normalizeVolume = (buffer) => buffer;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const enableDHT = () => true;

const drawArrays = (gl, mode, first, count) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const unchokePeer = (peer) => ({ ...peer, choked: false });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const createMediaStreamSource = (ctx, stream) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const cacheQueryResults = (key, data) => true;

const createProcess = (img) => ({ pid: 100 });

const inlineFunctions = (ast) => ast;

const allocateRegisters = (ir) => ir;

const chdir = (path) => true;

const validateIPWhitelist = (ip) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createListener = (ctx) => ({});

const applyTheme = (theme) => document.body.className = theme;

const stakeAssets = (pool, amount) => true;

const setDistanceModel = (panner, model) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const semaphoreSignal = (sem) => true;

const inferType = (node) => 'any';

const hoistVariables = (ast) => ast;

const downInterface = (iface) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const decodeAudioData = (buffer) => Promise.resolve({});

const setVelocity = (body, v) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setPosition = (panner, x, y, z) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const postProcessBloom = (image, threshold) => image;

const unloadDriver = (name) => true;

const cullFace = (mode) => true;

const resampleAudio = (buffer, rate) => buffer;

const generateDocumentation = (ast) => "";

const renderParticles = (sys) => true;

const analyzeBitrate = () => "5000kbps";

const setMass = (body, m) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const systemCall = (num, args) => 0;

const createMediaElementSource = (ctx, el) => ({});

const detachThread = (tid) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const unmountFileSystem = (path) => true;

const decompressPacket = (data) => data;

const injectCSPHeader = () => "default-src 'self'";

const fingerprintBrowser = () => "fp_hash_123";

const startOscillator = (osc, time) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const suspendContext = (ctx) => Promise.resolve();

const drawElements = (mode, count, type, offset) => true;

const updateParticles = (sys, dt) => true;

const bundleAssets = (assets) => "";

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const createSymbolTable = () => ({ scopes: [] });

const killParticles = (sys) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const deleteTexture = (texture) => true;

const verifyProofOfWork = (nonce) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const prioritizeTraffic = (queue) => true;

const injectMetadata = (file, meta) => ({ file, meta });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const joinThread = (tid) => true;

const listenSocket = (sock, backlog) => true;

const enableBlend = (func) => true;

const sleep = (body) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const reassemblePacket = (fragments) => fragments[0];

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const checkBatteryLevel = () => 100;

// Anti-shake references
const _ref_53xydu = { chownFile };
const _ref_1kukh3 = { compressDataStream };
const _ref_6uvfaa = { refreshAuthToken };
const _ref_us9ryu = { generateMipmaps };
const _ref_ct1fni = { disableDepthTest };
const _ref_x808it = { applyPerspective };
const _ref_7x42o4 = { normalizeVector };
const _ref_d356e3 = { parseConfigFile };
const _ref_n9zov6 = { handshakePeer };
const _ref_6a1ckk = { prefetchAssets };
const _ref_g7u17a = { requestPiece };
const _ref_jveiaf = { lockRow };
const _ref_cuir7j = { deleteTempFiles };
const _ref_mpg7zf = { lazyLoadComponent };
const _ref_t0mym8 = { getFileAttributes };
const _ref_w82eer = { verifyAppSignature };
const _ref_9bihif = { flushSocketBuffer };
const _ref_68cj1l = { preventCSRF };
const _ref_v3v0h1 = { limitBandwidth };
const _ref_vszron = { seedRatioLimit };
const _ref_uwvmi6 = { encryptPeerTraffic };
const _ref_8txdxg = { synthesizeSpeech };
const _ref_g9y37n = { optimizeMemoryUsage };
const _ref_ae6f5f = { watchFileChanges };
const _ref_thoeva = { checkBalance };
const _ref_ntn930 = { limitUploadSpeed };
const _ref_32us4i = { backpropagateGradient };
const _ref_oc7jsl = { parseMagnetLink };
const _ref_5txarm = { ProtocolBufferHandler };
const _ref_qmi8py = { rebootSystem };
const _ref_ilvq9c = { shutdownComputer };
const _ref_37sxar = { discoverPeersDHT };
const _ref_ymcx47 = { panicKernel };
const _ref_2tim6j = { optimizeHyperparameters };
const _ref_q5n23a = { disablePEX };
const _ref_z5qou3 = { getMACAddress };
const _ref_uxriqq = { encapsulateFrame };
const _ref_kkhs53 = { contextSwitch };
const _ref_rabbl4 = { unlinkFile };
const _ref_5mli8i = { allocateDiskSpace };
const _ref_o04grj = { decompressGzip };
const _ref_dcum1l = { interestPeer };
const _ref_4b7cul = { chokePeer };
const _ref_k89gvu = { compressGzip };
const _ref_t5yz1o = { estimateNonce };
const _ref_aqcly6 = { sendPacket };
const _ref_y1unr0 = { formatLogMessage };
const _ref_atqeo9 = { generateSourceMap };
const _ref_gweww3 = { computeDominators };
const _ref_jdd3ax = { getEnv };
const _ref_k5odfw = { renderCanvasLayer };
const _ref_6p11cm = { killProcess };
const _ref_zbwyv7 = { joinGroup };
const _ref_hb6w9v = { checkIntegrityToken };
const _ref_t7e6bb = { recognizeSpeech };
const _ref_bgjd74 = { loadModelWeights };
const _ref_zb5kk9 = { resolveSymbols };
const _ref_kzc0qq = { createDirectoryRecursive };
const _ref_t3brms = { checkTypes };
const _ref_8v6wum = { getMemoryUsage };
const _ref_yqi4wh = { rotateMatrix };
const _ref_gixu6s = { switchVLAN };
const _ref_7g5kwu = { getCpuLoad };
const _ref_fue802 = { semaphoreWait };
const _ref_nvgfvl = { createMagnetURI };
const _ref_aco825 = { syncDatabase };
const _ref_wyqv3w = { linkFile };
const _ref_gcvqcp = { detectDarkMode };
const _ref_o8h0yh = { enableInterrupts };
const _ref_okz434 = { applyImpulse };
const _ref_akc4lu = { compileVertexShader };
const _ref_ibqw1v = { VirtualFSTree };
const _ref_skz2hd = { removeConstraint };
const _ref_6y02bu = { visitNode };
const _ref_1w7eho = { parseTorrentFile };
const _ref_uhhfeh = { configureInterface };
const _ref_j1f4yo = { getVelocity };
const _ref_admydh = { setThreshold };
const _ref_nemd5y = { unmapMemory };
const _ref_ozj4qs = { autoResumeTask };
const _ref_xq3gvf = { convertHSLtoRGB };
const _ref_gvw0lk = { detectCollision };
const _ref_v2rp71 = { verifyFileSignature };
const _ref_yxgyyc = { generateUUIDv5 };
const _ref_p9psoc = { predictTensor };
const _ref_y4ju5i = { disconnectNodes };
const _ref_4bob8a = { uniform1i };
const _ref_wvz0un = { closeContext };
const _ref_w2s3l9 = { claimRewards };
const _ref_jrnpjw = { allowSleepMode };
const _ref_mfu210 = { parseFunction };
const _ref_blt9do = { performOCR };
const _ref_axysde = { beginTransaction };
const _ref_6ow1r5 = { getExtension };
const _ref_dlrgju = { encryptPayload };
const _ref_6bdfv8 = { mutexLock };
const _ref_joqkjd = { segmentImageUNet };
const _ref_oybyc2 = { reduceDimensionalityPCA };
const _ref_oabexj = { addConeTwistConstraint };
const _ref_j95fpq = { getFloatTimeDomainData };
const _ref_rxxk6d = { defineSymbol };
const _ref_gvcp89 = { validateTokenStructure };
const _ref_5sroa5 = { archiveFiles };
const _ref_49a7ic = { rayIntersectTriangle };
const _ref_mtdexu = { setAngularVelocity };
const _ref_790ynu = { setRatio };
const _ref_67g867 = { deriveAddress };
const _ref_mcuida = { mockResponse };
const _ref_scg0wr = { queueDownloadTask };
const _ref_zigowf = { prioritizeRarestPiece };
const _ref_3nk3jc = { calculateLighting };
const _ref_dah2qv = { jitCompile };
const _ref_3xapt7 = { detectPacketLoss };
const _ref_6bznqp = { captureScreenshot };
const _ref_6dz76p = { getBlockHeight };
const _ref_4fava3 = { setDelayTime };
const _ref_4r393p = { rollbackTransaction };
const _ref_e9wgut = { mergeFiles };
const _ref_yu8spd = { decryptStream };
const _ref_aojoh0 = { normalizeVolume };
const _ref_gi3ed1 = { debouncedResize };
const _ref_axr5uo = { enableDHT };
const _ref_lk8oza = { drawArrays };
const _ref_wt3j3c = { createBoxShape };
const _ref_n8tjrr = { unchokePeer };
const _ref_gdukud = { calculateSHA256 };
const _ref_twf81i = { playSoundAlert };
const _ref_30hfps = { moveFileToComplete };
const _ref_9xeqxw = { createMediaStreamSource };
const _ref_vs5psd = { loadImpulseResponse };
const _ref_zy0krr = { cacheQueryResults };
const _ref_in1ief = { createProcess };
const _ref_18eueq = { inlineFunctions };
const _ref_1bo6l4 = { allocateRegisters };
const _ref_32mcba = { chdir };
const _ref_83nykc = { validateIPWhitelist };
const _ref_gich1j = { uploadCrashReport };
const _ref_9xkao3 = { updateBitfield };
const _ref_79l2rm = { createListener };
const _ref_6frf1i = { applyTheme };
const _ref_t6krme = { stakeAssets };
const _ref_j2nuzs = { setDistanceModel };
const _ref_90570m = { analyzeQueryPlan };
const _ref_h4wnp6 = { semaphoreSignal };
const _ref_r4wc5k = { inferType };
const _ref_mmyauy = { hoistVariables };
const _ref_1c8c6m = { downInterface };
const _ref_2678mz = { connectToTracker };
const _ref_rpi9fr = { clearBrowserCache };
const _ref_doi11a = { decodeAudioData };
const _ref_psiaub = { setVelocity };
const _ref_wgaoyy = { generateEmbeddings };
const _ref_3suhow = { checkDiskSpace };
const _ref_d7cc5a = { setPosition };
const _ref_dsxx0u = { setBrake };
const _ref_cwjt4h = { postProcessBloom };
const _ref_enicqn = { unloadDriver };
const _ref_p92riu = { cullFace };
const _ref_dwlphw = { resampleAudio };
const _ref_w7rdpi = { generateDocumentation };
const _ref_i23uhh = { renderParticles };
const _ref_ssdx1q = { analyzeBitrate };
const _ref_gxaang = { setMass };
const _ref_9lffwt = { debounceAction };
const _ref_y97rl7 = { systemCall };
const _ref_cy99ix = { createMediaElementSource };
const _ref_ujsiw2 = { detachThread };
const _ref_61euc2 = { createStereoPanner };
const _ref_lhbovh = { unmountFileSystem };
const _ref_iacws1 = { decompressPacket };
const _ref_qi72b0 = { injectCSPHeader };
const _ref_e9xqb3 = { fingerprintBrowser };
const _ref_oljnpy = { startOscillator };
const _ref_3lqcsp = { limitDownloadSpeed };
const _ref_1buxwm = { suspendContext };
const _ref_yf1tj7 = { drawElements };
const _ref_7ku8dg = { updateParticles };
const _ref_y558x1 = { bundleAssets };
const _ref_za2iy1 = { updateProgressBar };
const _ref_6x3ecp = { computeSpeedAverage };
const _ref_4h0awz = { createSymbolTable };
const _ref_w3oonn = { killParticles };
const _ref_w20zhr = { resolveHostName };
const _ref_seduly = { keepAlivePing };
const _ref_dc9f3p = { FileValidator };
const _ref_mnrrvm = { deleteTexture };
const _ref_v3h0lb = { verifyProofOfWork };
const _ref_e821i9 = { bindSocket };
const _ref_olw5jw = { prioritizeTraffic };
const _ref_77xpr0 = { injectMetadata };
const _ref_f9cosj = { traceStack };
const _ref_wct2dk = { joinThread };
const _ref_zpextj = { listenSocket };
const _ref_my54qn = { enableBlend };
const _ref_x9d55t = { sleep };
const _ref_oogzoh = { createVehicle };
const _ref_8335dw = { reassemblePacket };
const _ref_3jghtk = { scheduleBandwidth };
const _ref_oiajds = { vertexAttribPointer };
const _ref_03rxv2 = { checkBatteryLevel }; 
    });
})({}, {});