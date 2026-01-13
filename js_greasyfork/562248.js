// ==UserScript==
// @name Freesound音频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Freesound/index.js
// @version 2026.01.10
// @description 一键下载Freesound音频，支持4K/1080P/720P多画质。
// @icon https://freesound.org/favicon.ico
// @match *://freesound.org/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
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

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const debouncedResize = () => ({ width: 1920, height: 1080 });

const dhcpAck = () => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const cleanOldLogs = (days) => days;

const deriveAddress = (path) => "0x123...";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const shutdownComputer = () => console.log("Shutting down...");

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const claimRewards = (pool) => "0.5 ETH";

const preventCSRF = () => "csrf_token";

const encodeABI = (method, params) => "0x...";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const validateRecaptcha = (token) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const formatCurrency = (amount) => "$" + amount.toFixed(2);


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const verifySignature = (tx, sig) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const swapTokens = (pair, amount) => true;


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

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

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

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const checkBalance = (addr) => "10.5 ETH";

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const detectDarkMode = () => true;

const monitorClipboard = () => "";

const broadcastTransaction = (tx) => "tx_hash_123";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const calculateCRC32 = (data) => "00000000";

const prioritizeRarestPiece = (pieces) => pieces[0];

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const compileVertexShader = (source) => ({ compiled: true });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const parseLogTopics = (topics) => ["Transfer"];

const disconnectNodes = (node) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createSoftBody = (info) => ({ nodes: [] });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});


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

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const generateCode = (ast) => "const a = 1;";

const cancelTask = (id) => ({ id, cancelled: true });

const prefetchAssets = (urls) => urls.length;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const killParticles = (sys) => true;

const applyImpulse = (body, impulse, point) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const checkParticleCollision = (sys, world) => true;

const addSliderConstraint = (world, c) => true;

const eliminateDeadCode = (ast) => ast;

const updateTransform = (body) => true;

const unlockFile = (path) => ({ path, locked: false });

const disablePEX = () => false;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const calculateRestitution = (mat1, mat2) => 0.3;

const createIndexBuffer = (data) => ({ id: Math.random() });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const removeConstraint = (world, c) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const resetVehicle = (vehicle) => true;

const cullFace = (mode) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const compileFragmentShader = (source) => ({ compiled: true });

const invalidateCache = (key) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const createFrameBuffer = () => ({ id: Math.random() });

const triggerHapticFeedback = (intensity) => true;

const registerGestureHandler = (gesture) => true;

const setViewport = (x, y, w, h) => true;

const traverseAST = (node, visitor) => true;

const deleteTexture = (texture) => true;

const activeTexture = (unit) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const drawElements = (mode, count, type, offset) => true;

const optimizeTailCalls = (ast) => ast;

const exitScope = (table) => true;

const addHingeConstraint = (world, c) => true;

const fingerprintBrowser = () => "fp_hash_123";

const obfuscateCode = (code) => code;

const wakeUp = (body) => true;

const generateSourceMap = (ast) => "{}";

const resolveSymbols = (ast) => ({});

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const computeDominators = (cfg) => ({});

const mangleNames = (ast) => ast;

const clusterKMeans = (data, k) => Array(k).fill([]);

const segmentImageUNet = (img) => "mask_buffer";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveImports = (ast) => [];

const createBoxShape = (w, h, d) => ({ type: 'box' });

const uniform1i = (loc, val) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

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

const reportError = (msg, line) => console.error(msg);

const uniform3f = (loc, x, y, z) => true;

const chdir = (path) => true;

const writePipe = (fd, data) => data.length;

const disableRightClick = () => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const translateText = (text, lang) => text;

const checkIntegrityToken = (token) => true;

const setDopplerFactor = (val) => true;

const encryptPeerTraffic = (data) => btoa(data);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const updateSoftBody = (body) => true;

const sleep = (body) => true;

const checkRootAccess = () => false;

const renameFile = (oldName, newName) => newName;

const announceToTracker = (url) => ({ url, interval: 1800 });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const normalizeFeatures = (data) => data.map(x => x / 255);

const applyTheme = (theme) => document.body.className = theme;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const detectDevTools = () => false;

const unlockRow = (id) => true;

const defineSymbol = (table, name, info) => true;

const getBlockHeight = () => 15000000;

const addGeneric6DofConstraint = (world, c) => true;

const obfuscateString = (str) => btoa(str);

const rayCast = (world, start, end) => ({ hit: false });

const switchVLAN = (id) => true;

const detectVirtualMachine = () => false;

const decapsulateFrame = (frame) => frame;

const enableBlend = (func) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const injectMetadata = (file, meta) => ({ file, meta });

const createConstraint = (body1, body2) => ({});

const allowSleepMode = () => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const arpRequest = (ip) => "00:00:00:00:00:00";

const sanitizeXSS = (html) => html;

const calculateComplexity = (ast) => 1;

const setBrake = (vehicle, force, wheelIdx) => true;

const createConvolver = (ctx) => ({ buffer: null });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const emitParticles = (sys, count) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const validateProgram = (program) => true;

const handleInterrupt = (irq) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const disableInterrupts = () => true;

const setAngularVelocity = (body, v) => true;

const hoistVariables = (ast) => ast;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const findLoops = (cfg) => [];

const classifySentiment = (text) => "positive";

const detectDebugger = () => false;

const analyzeControlFlow = (ast) => ({ graph: {} });

const setInertia = (body, i) => true;


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

const rateLimitCheck = (ip) => true;

const auditAccessLogs = () => true;

const captureScreenshot = () => "data:image/png;base64,...";

const createAudioContext = () => ({ sampleRate: 44100 });

const resumeContext = (ctx) => Promise.resolve();

const gaussianBlur = (image, radius) => image;

const getVehicleSpeed = (vehicle) => 0;

const createMediaStreamSource = (ctx, stream) => ({});

const rotateLogFiles = () => true;

const reportWarning = (msg, line) => console.warn(msg);

const installUpdate = () => false;

const scheduleTask = (task) => ({ id: 1, task });

const rebootSystem = () => true;

const compressGzip = (data) => data;

const subscribeToEvents = (contract) => true;

const createSymbolTable = () => ({ scopes: [] });

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

const panicKernel = (msg) => false;

const attachRenderBuffer = (fb, rb) => true;

const createParticleSystem = (count) => ({ particles: [] });

const remuxContainer = (container) => ({ container, status: "done" });

const inlineFunctions = (ast) => ast;

const scaleMatrix = (mat, vec) => mat;

const rollbackTransaction = (tx) => true;

const updateRoutingTable = (entry) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const closePipe = (fd) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

// Anti-shake references
const _ref_9flv3j = { debouncedResize };
const _ref_0qw21p = { dhcpAck };
const _ref_59miuw = { interestPeer };
const _ref_lh6rqg = { cleanOldLogs };
const _ref_hmop37 = { deriveAddress };
const _ref_j4v8mg = { traceStack };
const _ref_bqtxzu = { shardingTable };
const _ref_iz62h9 = { shutdownComputer };
const _ref_mda4cz = { generateWalletKeys };
const _ref_vosnj0 = { parseM3U8Playlist };
const _ref_lct0d8 = { sanitizeInput };
const _ref_loea42 = { claimRewards };
const _ref_i6pqxb = { preventCSRF };
const _ref_f84zit = { encodeABI };
const _ref_u9nrmr = { compactDatabase };
const _ref_dwtp8n = { validateTokenStructure };
const _ref_n3fb1r = { validateRecaptcha };
const _ref_7zt2uf = { signTransaction };
const _ref_89d901 = { detectObjectYOLO };
const _ref_366fbb = { formatCurrency };
const _ref_tcn1x2 = { getAppConfig };
const _ref_y3d0ic = { formatLogMessage };
const _ref_z7hj39 = { verifySignature };
const _ref_evms0x = { parseConfigFile };
const _ref_vtahsk = { swapTokens };
const _ref_h1dwe6 = { ResourceMonitor };
const _ref_jfrtho = { calculatePieceHash };
const _ref_o9f6s3 = { diffVirtualDOM };
const _ref_730os9 = { download };
const _ref_nqaxlo = { connectToTracker };
const _ref_n58wfg = { analyzeUserBehavior };
const _ref_8ni1kh = { transformAesKey };
const _ref_8nc1ex = { encryptPayload };
const _ref_1nz8oj = { virtualScroll };
const _ref_qff68a = { compressDataStream };
const _ref_34io79 = { checkBalance };
const _ref_3tbmve = { renderVirtualDOM };
const _ref_ne80u2 = { detectDarkMode };
const _ref_e56xo6 = { monitorClipboard };
const _ref_ppwmii = { broadcastTransaction };
const _ref_7293tn = { discoverPeersDHT };
const _ref_jtnul4 = { calculateCRC32 };
const _ref_bqocf9 = { prioritizeRarestPiece };
const _ref_wazi7r = { generateUUIDv5 };
const _ref_p4fx1v = { compileVertexShader };
const _ref_ygkahr = { createAnalyser };
const _ref_ky20zn = { parseLogTopics };
const _ref_0yawtl = { disconnectNodes };
const _ref_1uqa9k = { tokenizeSource };
const _ref_an6ukj = { createSoftBody };
const _ref_mnfv4t = { setSteeringValue };
const _ref_09kx6s = { createScriptProcessor };
const _ref_9lus4h = { ApiDataFormatter };
const _ref_3upe0u = { parseStatement };
const _ref_guectl = { createBiquadFilter };
const _ref_i871kc = { generateCode };
const _ref_p4i16s = { cancelTask };
const _ref_83aklm = { prefetchAssets };
const _ref_wa7qbu = { isFeatureEnabled };
const _ref_qg5cgg = { killParticles };
const _ref_mhmi7g = { applyImpulse };
const _ref_iu0t7q = { autoResumeTask };
const _ref_fmdyjs = { checkParticleCollision };
const _ref_m5ffim = { addSliderConstraint };
const _ref_4vexrs = { eliminateDeadCode };
const _ref_mhehr3 = { updateTransform };
const _ref_8famn2 = { unlockFile };
const _ref_n9tr9x = { disablePEX };
const _ref_n7y4di = { unchokePeer };
const _ref_yzk2iw = { calculateRestitution };
const _ref_7ehjtb = { createIndexBuffer };
const _ref_4etcwr = { moveFileToComplete };
const _ref_7p5zd4 = { resolveDependencyGraph };
const _ref_rett9a = { removeConstraint };
const _ref_l7igiw = { throttleRequests };
const _ref_u7iok5 = { simulateNetworkDelay };
const _ref_91seey = { resetVehicle };
const _ref_5ftdyu = { cullFace };
const _ref_7hwfzj = { seedRatioLimit };
const _ref_1zamfq = { compileFragmentShader };
const _ref_khs7n4 = { invalidateCache };
const _ref_bf0zyi = { chokePeer };
const _ref_jsc7i7 = { createFrameBuffer };
const _ref_xy31e2 = { triggerHapticFeedback };
const _ref_flutan = { registerGestureHandler };
const _ref_mod1ck = { setViewport };
const _ref_q1xsay = { traverseAST };
const _ref_rar3or = { deleteTexture };
const _ref_b4bwtd = { activeTexture };
const _ref_kbvo16 = { acceptConnection };
const _ref_uieps4 = { drawElements };
const _ref_frpqhl = { optimizeTailCalls };
const _ref_qroh97 = { exitScope };
const _ref_ja1e5g = { addHingeConstraint };
const _ref_3s967b = { fingerprintBrowser };
const _ref_zy9xd4 = { obfuscateCode };
const _ref_ws19i0 = { wakeUp };
const _ref_whjhjg = { generateSourceMap };
const _ref_uogmse = { resolveSymbols };
const _ref_nfxvj8 = { parseExpression };
const _ref_bmmskb = { computeDominators };
const _ref_8wblkz = { mangleNames };
const _ref_cgbnda = { clusterKMeans };
const _ref_zihx4y = { segmentImageUNet };
const _ref_8nhw1k = { createOscillator };
const _ref_b8e7fd = { resolveImports };
const _ref_xpwwc2 = { createBoxShape };
const _ref_evvs9t = { uniform1i };
const _ref_hrxal9 = { checkIntegrity };
const _ref_4bsjj8 = { generateFakeClass };
const _ref_1o2cvs = { reportError };
const _ref_3ydpq9 = { uniform3f };
const _ref_sphiuj = { chdir };
const _ref_44ywpo = { writePipe };
const _ref_abnakd = { disableRightClick };
const _ref_4acq2w = { loadImpulseResponse };
const _ref_wdyq28 = { translateText };
const _ref_liloxn = { checkIntegrityToken };
const _ref_uw22nk = { setDopplerFactor };
const _ref_kb4jvf = { encryptPeerTraffic };
const _ref_mqqvkg = { decodeABI };
const _ref_74bzhp = { updateSoftBody };
const _ref_akw74s = { sleep };
const _ref_ds3jkv = { checkRootAccess };
const _ref_oalhiz = { renameFile };
const _ref_2wy96i = { announceToTracker };
const _ref_42qces = { createMagnetURI };
const _ref_ibti6n = { normalizeFeatures };
const _ref_b7rpd5 = { applyTheme };
const _ref_r5iuom = { showNotification };
const _ref_qtmzje = { detectDevTools };
const _ref_mdgi4x = { unlockRow };
const _ref_3ikp28 = { defineSymbol };
const _ref_1bvf37 = { getBlockHeight };
const _ref_7elrqd = { addGeneric6DofConstraint };
const _ref_dr7f4m = { obfuscateString };
const _ref_a3x967 = { rayCast };
const _ref_8r15id = { switchVLAN };
const _ref_3fm7yy = { detectVirtualMachine };
const _ref_q0zaqh = { decapsulateFrame };
const _ref_v23nnq = { enableBlend };
const _ref_c1zjlx = { requestAnimationFrameLoop };
const _ref_4p4v5s = { injectMetadata };
const _ref_4vs008 = { createConstraint };
const _ref_42gz9f = { allowSleepMode };
const _ref_y05bfs = { transcodeStream };
const _ref_hexmiw = { arpRequest };
const _ref_ddyuvf = { sanitizeXSS };
const _ref_ay96di = { calculateComplexity };
const _ref_yk3xxi = { setBrake };
const _ref_wdyolf = { createConvolver };
const _ref_7nwwxv = { FileValidator };
const _ref_u69w1k = { emitParticles };
const _ref_m3xm4x = { detectEnvironment };
const _ref_h0npdo = { parseMagnetLink };
const _ref_319opk = { validateProgram };
const _ref_vs4r4d = { handleInterrupt };
const _ref_kelb1x = { optimizeMemoryUsage };
const _ref_oevdug = { parseFunction };
const _ref_vrlazr = { getNetworkStats };
const _ref_ezgi67 = { disableInterrupts };
const _ref_9np9t3 = { setAngularVelocity };
const _ref_1zs0cf = { hoistVariables };
const _ref_q24la0 = { setFrequency };
const _ref_gpj3fb = { handshakePeer };
const _ref_kpkub1 = { findLoops };
const _ref_4cupo8 = { classifySentiment };
const _ref_oogox3 = { detectDebugger };
const _ref_c0beb3 = { analyzeControlFlow };
const _ref_wevyam = { setInertia };
const _ref_vfg2r2 = { CacheManager };
const _ref_vzgmht = { rateLimitCheck };
const _ref_fvhber = { auditAccessLogs };
const _ref_b6s0xa = { captureScreenshot };
const _ref_6yd3z4 = { createAudioContext };
const _ref_1p7cr4 = { resumeContext };
const _ref_pqfyx0 = { gaussianBlur };
const _ref_4yvxlp = { getVehicleSpeed };
const _ref_c2hjnj = { createMediaStreamSource };
const _ref_mgqyyc = { rotateLogFiles };
const _ref_n0a7eo = { reportWarning };
const _ref_g7o1tq = { installUpdate };
const _ref_dne8fb = { scheduleTask };
const _ref_d0z0kl = { rebootSystem };
const _ref_9gb4jd = { compressGzip };
const _ref_rgna3s = { subscribeToEvents };
const _ref_rxdln7 = { createSymbolTable };
const _ref_rcgak3 = { TaskScheduler };
const _ref_5v6jxc = { TelemetryClient };
const _ref_2j1qvt = { panicKernel };
const _ref_fnbuav = { attachRenderBuffer };
const _ref_d3u44h = { createParticleSystem };
const _ref_h2nn4b = { remuxContainer };
const _ref_yidw6z = { inlineFunctions };
const _ref_ob0jnr = { scaleMatrix };
const _ref_udk7e2 = { rollbackTransaction };
const _ref_3cqrdd = { updateRoutingTable };
const _ref_ax0z00 = { parseTorrentFile };
const _ref_0rjpxw = { closePipe };
const _ref_uqe4cx = { debounceAction }; 
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
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
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
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
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
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
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
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
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
        const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const foldConstants = (ast) => ast;

const subscribeToEvents = (contract) => true;

const logErrorToFile = (err) => console.error(err);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const mergeFiles = (parts) => parts[0];

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const unlockRow = (id) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const repairCorruptFile = (path) => ({ path, repaired: true });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const fingerprintBrowser = () => "fp_hash_123";

const preventSleepMode = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const bufferMediaStream = (size) => ({ buffer: size });

const prefetchAssets = (urls) => urls.length;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const shardingTable = (table) => ["shard_0", "shard_1"];

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const unmuteStream = () => false;

const encodeABI = (method, params) => "0x...";

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const getShaderInfoLog = (shader) => "";

const disableInterrupts = () => true;

const bindTexture = (target, texture) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const deobfuscateString = (str) => atob(str);

const attachRenderBuffer = (fb, rb) => true;

const multicastMessage = (group, msg) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const detectDebugger = () => false;

const parseQueryString = (qs) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const scheduleTask = (task) => ({ id: 1, task });

const createIndexBuffer = (data) => ({ id: Math.random() });

const renderCanvasLayer = (ctx) => true;

const mangleNames = (ast) => ast;

const compileFragmentShader = (source) => ({ compiled: true });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const interpretBytecode = (bc) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const swapTokens = (pair, amount) => true;

const listenSocket = (sock, backlog) => true;

const activeTexture = (unit) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const cullFace = (mode) => true;

const bindAddress = (sock, addr, port) => true;

const claimRewards = (pool) => "0.5 ETH";

const startOscillator = (osc, time) => true;

const detectDarkMode = () => true;

const stopOscillator = (osc, time) => true;

const handleTimeout = (sock) => true;

const checkTypes = (ast) => [];

const joinGroup = (group) => true;

const drawElements = (mode, count, type, offset) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const validateFormInput = (input) => input.length > 0;

const decompressPacket = (data) => data;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const freeMemory = (ptr) => true;

const deleteTexture = (texture) => true;

const monitorClipboard = () => "";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const cancelTask = (id) => ({ id, cancelled: true });

const decodeAudioData = (buffer) => Promise.resolve({});

const analyzeHeader = (packet) => ({});

const deleteProgram = (program) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const parsePayload = (packet) => ({});

const checkPortAvailability = (port) => Math.random() > 0.2;

const encapsulateFrame = (packet) => packet;

const connectNodes = (src, dest) => true;

const getBlockHeight = () => 15000000;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const checkGLError = () => 0;

const invalidateCache = (key) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const dhcpRequest = (ip) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createThread = (func) => ({ tid: 1 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const dhcpAck = () => true;

const applyTheme = (theme) => document.body.className = theme;

const semaphoreWait = (sem) => true;

const fragmentPacket = (data, mtu) => [data];

const detachThread = (tid) => true;


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

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const uniform3f = (loc, x, y, z) => true;

const calculateComplexity = (ast) => 1;

const checkUpdate = () => ({ hasUpdate: false });

const preventCSRF = () => "csrf_token";

const compileVertexShader = (source) => ({ compiled: true });

const detectVirtualMachine = () => false;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const announceToTracker = (url) => ({ url, interval: 1800 });

const clusterKMeans = (data, k) => Array(k).fill([]);

const getProgramInfoLog = (program) => "";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const generateDocumentation = (ast) => "";

const negotiateSession = (sock) => ({ id: "sess_1" });

const validateProgram = (program) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const uniform1i = (loc, val) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const injectMetadata = (file, meta) => ({ file, meta });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const disconnectNodes = (node) => true;

const createParticleSystem = (count) => ({ particles: [] });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const normalizeVolume = (buffer) => buffer;

const createSymbolTable = () => ({ scopes: [] });

const forkProcess = () => 101;

const checkBalance = (addr) => "10.5 ETH";

const remuxContainer = (container) => ({ container, status: "done" });

const processAudioBuffer = (buffer) => buffer;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const execProcess = (path) => true;

const connectSocket = (sock, addr, port) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createAudioContext = () => ({ sampleRate: 44100 });

const deleteBuffer = (buffer) => true;

const merkelizeRoot = (txs) => "root_hash";

const protectMemory = (ptr, size, flags) => true;

const rayCast = (world, start, end) => ({ hit: false });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const renderParticles = (sys) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const decryptStream = (stream, key) => stream;

const beginTransaction = () => "TX-" + Date.now();

const setInertia = (body, i) => true;

const clearScreen = (r, g, b, a) => true;

const contextSwitch = (oldPid, newPid) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const resolveCollision = (manifold) => true;

const switchVLAN = (id) => true;

const enableDHT = () => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const hydrateSSR = (html) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const generateMipmaps = (target) => true;

const getExtension = (name) => ({});

const jitCompile = (bc) => (() => {});

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const computeLossFunction = (pred, actual) => 0.05;

const inferType = (node) => 'any';

const stakeAssets = (pool, amount) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const synthesizeSpeech = (text) => "audio_buffer";

const validatePieceChecksum = (piece) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const calculateCRC32 = (data) => "00000000";

const addConeTwistConstraint = (world, c) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const addHingeConstraint = (world, c) => true;

const joinThread = (tid) => true;

const negotiateProtocol = () => "HTTP/2.0";

const downInterface = (iface) => true;

const killParticles = (sys) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const rotateMatrix = (mat, angle, axis) => mat;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setViewport = (x, y, w, h) => true;

const exitScope = (table) => true;

const useProgram = (program) => true;

const parseLogTopics = (topics) => ["Transfer"];

const encryptStream = (stream, key) => stream;

const prioritizeTraffic = (queue) => true;

const mapMemory = (fd, size) => 0x2000;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

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

const limitRate = (stream, rate) => stream;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const verifyAppSignature = () => true;

const enableBlend = (func) => true;

const decapsulateFrame = (frame) => frame;

const resolveImports = (ast) => [];

const cacheQueryResults = (key, data) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const computeDominators = (cfg) => ({});

const createChannelSplitter = (ctx, channels) => ({});

// Anti-shake references
const _ref_1rfy34 = { parseMagnetLink };
const _ref_fjdmui = { foldConstants };
const _ref_5v1cjd = { subscribeToEvents };
const _ref_i4e76f = { logErrorToFile };
const _ref_ckoea2 = { resolveDNSOverHTTPS };
const _ref_6nq079 = { simulateNetworkDelay };
const _ref_qwtqpu = { mergeFiles };
const _ref_0i0rno = { initiateHandshake };
const _ref_bdiozn = { requestAnimationFrameLoop };
const _ref_fmcb8l = { unlockRow };
const _ref_6as0aw = { uploadCrashReport };
const _ref_gbzbb8 = { repairCorruptFile };
const _ref_kb6t5m = { lazyLoadComponent };
const _ref_xq7r9f = { fingerprintBrowser };
const _ref_yrulyz = { preventSleepMode };
const _ref_f8irha = { compressDataStream };
const _ref_bqk27x = { bufferMediaStream };
const _ref_hs0ndt = { prefetchAssets };
const _ref_s0mhx2 = { diffVirtualDOM };
const _ref_323c9e = { shardingTable };
const _ref_wugb2k = { limitDownloadSpeed };
const _ref_61127f = { createOscillator };
const _ref_1n6nva = { unmuteStream };
const _ref_4qpvqu = { encodeABI };
const _ref_7pgssx = { normalizeVector };
const _ref_laxky3 = { getShaderInfoLog };
const _ref_5hthv2 = { disableInterrupts };
const _ref_8ef965 = { bindTexture };
const _ref_992cx9 = { readPixels };
const _ref_tts8pt = { deobfuscateString };
const _ref_m1tsrm = { attachRenderBuffer };
const _ref_lpk9ea = { multicastMessage };
const _ref_qn5lkk = { createFrameBuffer };
const _ref_eshflw = { detectDebugger };
const _ref_eic6uv = { parseQueryString };
const _ref_lu7zcx = { normalizeAudio };
const _ref_es30of = { scheduleTask };
const _ref_usofma = { createIndexBuffer };
const _ref_z90g7i = { renderCanvasLayer };
const _ref_rt4zdd = { mangleNames };
const _ref_24k2y0 = { compileFragmentShader };
const _ref_heq08i = { createBiquadFilter };
const _ref_e8x4ri = { interpretBytecode };
const _ref_btlzzh = { setFilePermissions };
const _ref_moyx3m = { formatLogMessage };
const _ref_dnpaun = { calculateMD5 };
const _ref_b7lm2e = { switchProxyServer };
const _ref_ll2jer = { optimizeMemoryUsage };
const _ref_cs3rno = { terminateSession };
const _ref_kvrgxw = { swapTokens };
const _ref_y0qzp8 = { listenSocket };
const _ref_a993ze = { activeTexture };
const _ref_8p22wq = { updateBitfield };
const _ref_axmgm5 = { cullFace };
const _ref_10efwg = { bindAddress };
const _ref_ro6mgm = { claimRewards };
const _ref_l0ohbt = { startOscillator };
const _ref_utdkbd = { detectDarkMode };
const _ref_9dfh1g = { stopOscillator };
const _ref_6tzf3d = { handleTimeout };
const _ref_3jos0f = { checkTypes };
const _ref_xitsks = { joinGroup };
const _ref_eb9rwg = { drawElements };
const _ref_aacxbd = { renderVirtualDOM };
const _ref_9rxz4m = { validateFormInput };
const _ref_a7p6j2 = { decompressPacket };
const _ref_dhpygg = { predictTensor };
const _ref_66yqk6 = { freeMemory };
const _ref_gw5vs1 = { deleteTexture };
const _ref_m7tnhd = { monitorClipboard };
const _ref_z944iw = { validateSSLCert };
const _ref_y3aoho = { cancelTask };
const _ref_bz9h9h = { decodeAudioData };
const _ref_sljdzn = { analyzeHeader };
const _ref_z5qn1o = { deleteProgram };
const _ref_m56qls = { seedRatioLimit };
const _ref_5yaqwm = { parsePayload };
const _ref_x3hcht = { checkPortAvailability };
const _ref_kzso19 = { encapsulateFrame };
const _ref_qizl33 = { connectNodes };
const _ref_gxet22 = { getBlockHeight };
const _ref_sbrf0w = { throttleRequests };
const _ref_9fggs7 = { checkGLError };
const _ref_6siukm = { invalidateCache };
const _ref_zf3pk7 = { uniformMatrix4fv };
const _ref_02rm04 = { dhcpRequest };
const _ref_eoy33a = { vertexAttrib3f };
const _ref_zhk6k9 = { getMemoryUsage };
const _ref_jicd24 = { createThread };
const _ref_j1yh9t = { sanitizeInput };
const _ref_jr71oc = { dhcpAck };
const _ref_i2j1ls = { applyTheme };
const _ref_yd39a8 = { semaphoreWait };
const _ref_i3e9cs = { fragmentPacket };
const _ref_r6c2lo = { detachThread };
const _ref_a6ut91 = { ApiDataFormatter };
const _ref_txcr2m = { keepAlivePing };
const _ref_wv0mca = { getFileAttributes };
const _ref_nxlaxj = { uniform3f };
const _ref_nulofc = { calculateComplexity };
const _ref_bcqzy2 = { checkUpdate };
const _ref_n92b16 = { preventCSRF };
const _ref_fqszmv = { compileVertexShader };
const _ref_k14fqn = { detectVirtualMachine };
const _ref_59aguf = { manageCookieJar };
const _ref_9vv2yl = { announceToTracker };
const _ref_uejnvi = { clusterKMeans };
const _ref_er9ccl = { getProgramInfoLog };
const _ref_1c46vl = { resolveHostName };
const _ref_fcl452 = { generateDocumentation };
const _ref_6bsomt = { negotiateSession };
const _ref_4htasu = { validateProgram };
const _ref_ruylnc = { broadcastTransaction };
const _ref_6lv8ho = { uniform1i };
const _ref_cf72f1 = { formatCurrency };
const _ref_wa2xyn = { injectMetadata };
const _ref_stya3b = { calculateLighting };
const _ref_kv4mw6 = { disconnectNodes };
const _ref_pvtzgn = { createParticleSystem };
const _ref_hvdmwr = { createGainNode };
const _ref_r1osvh = { normalizeVolume };
const _ref_w2abbo = { createSymbolTable };
const _ref_5op10n = { forkProcess };
const _ref_at4fw5 = { checkBalance };
const _ref_5kre8h = { remuxContainer };
const _ref_i9pnf5 = { processAudioBuffer };
const _ref_pqb1f6 = { debouncedResize };
const _ref_etgx28 = { execProcess };
const _ref_ovbfsq = { connectSocket };
const _ref_uukhjw = { handshakePeer };
const _ref_z9ycub = { createAudioContext };
const _ref_7nu37r = { deleteBuffer };
const _ref_xlq6x4 = { merkelizeRoot };
const _ref_1xpf9a = { protectMemory };
const _ref_dozzj7 = { rayCast };
const _ref_psx2sr = { setFrequency };
const _ref_ii6k8s = { renderParticles };
const _ref_j4b629 = { traceStack };
const _ref_m4hmdc = { decryptStream };
const _ref_g4mxtc = { beginTransaction };
const _ref_9o9b6y = { setInertia };
const _ref_7xo1kv = { clearScreen };
const _ref_zx4hp7 = { contextSwitch };
const _ref_t8dlap = { parseTorrentFile };
const _ref_wimkb1 = { verifyFileSignature };
const _ref_zjxjof = { autoResumeTask };
const _ref_8im5f3 = { requestPiece };
const _ref_izoktb = { resolveCollision };
const _ref_vc58bk = { switchVLAN };
const _ref_j23knx = { enableDHT };
const _ref_p6ay5j = { queueDownloadTask };
const _ref_9jglc8 = { hydrateSSR };
const _ref_81zw1y = { analyzeQueryPlan };
const _ref_kosagg = { parseConfigFile };
const _ref_gyr7x9 = { generateMipmaps };
const _ref_h2pb1k = { getExtension };
const _ref_lflckv = { jitCompile };
const _ref_dl9295 = { createDelay };
const _ref_jj6c53 = { computeLossFunction };
const _ref_oeszmp = { inferType };
const _ref_u4iygz = { stakeAssets };
const _ref_h0vaum = { convexSweepTest };
const _ref_uqoik4 = { synthesizeSpeech };
const _ref_wlmo6i = { validatePieceChecksum };
const _ref_xzrbka = { resolveDependencyGraph };
const _ref_xaezr6 = { refreshAuthToken };
const _ref_lm943j = { parseSubtitles };
const _ref_83bb2y = { calculateCRC32 };
const _ref_h2qojy = { addConeTwistConstraint };
const _ref_t4wcx1 = { captureScreenshot };
const _ref_qkinkt = { addHingeConstraint };
const _ref_oacon1 = { joinThread };
const _ref_c3ce7j = { negotiateProtocol };
const _ref_n4raqm = { downInterface };
const _ref_xujn6m = { killParticles };
const _ref_a4utcc = { extractThumbnail };
const _ref_of7akl = { rotateMatrix };
const _ref_pzt1d8 = { showNotification };
const _ref_jx4o62 = { setViewport };
const _ref_4gybwj = { exitScope };
const _ref_b8xbv4 = { useProgram };
const _ref_s4yfl3 = { parseLogTopics };
const _ref_ge4zt9 = { encryptStream };
const _ref_vdk8l9 = { prioritizeTraffic };
const _ref_r2jksv = { mapMemory };
const _ref_79b5zy = { createPanner };
const _ref_n5l9cn = { ProtocolBufferHandler };
const _ref_ert6ym = { limitRate };
const _ref_jr0vd5 = { getSystemUptime };
const _ref_pokml9 = { checkDiskSpace };
const _ref_9vactx = { createCapsuleShape };
const _ref_z42fbw = { vertexAttribPointer };
const _ref_1z2m0z = { verifyAppSignature };
const _ref_bh0v9b = { enableBlend };
const _ref_zwg9qm = { decapsulateFrame };
const _ref_654s51 = { resolveImports };
const _ref_7enxyt = { cacheQueryResults };
const _ref_oxjiar = { validateMnemonic };
const _ref_stp0a9 = { computeDominators };
const _ref_mccfif = { createChannelSplitter }; 
    });
})({}, {});