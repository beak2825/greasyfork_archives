// ==UserScript==
// @name twitch直播流获取
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/twitch/index.js
// @version 2026.01.10
// @description 获取twitch的直播流
// @icon https://assets.twitch.tv/assets/favicon-32-e29e246c157142c94346.png
// @match *://*.twitch.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect twitch.tv
// @connect ttvnw.net
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
// @downloadURL https://update.greasyfork.org/scripts/560922/twitch%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560922/twitch%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.meta.js
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
        const profilePerformance = (func) => 0;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const verifyProofOfWork = (nonce) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const verifyAppSignature = () => true;

const computeLossFunction = (pred, actual) => 0.05;

const enableDHT = () => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";


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

const shutdownComputer = () => console.log("Shutting down...");

const seedRatioLimit = (ratio) => ratio >= 2.0;

const closePipe = (fd) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const lookupSymbol = (table, name) => ({});

const enterScope = (table) => true;

const resolveImports = (ast) => [];

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

const dropTable = (table) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const setMass = (body, m) => true;

const createParticleSystem = (count) => ({ particles: [] });

const reportWarning = (msg, line) => console.warn(msg);

const deserializeAST = (json) => JSON.parse(json);

const segmentImageUNet = (img) => "mask_buffer";

const unlockFile = (path) => ({ path, locked: false });

const resolveSymbols = (ast) => ({});

const unrollLoops = (ast) => ast;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const verifyChecksum = (data, sum) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const compileToBytecode = (ast) => new Uint8Array();

const allowSleepMode = () => true;

const emitParticles = (sys, count) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const resolveDNS = (domain) => "127.0.0.1";

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const resolveCollision = (manifold) => true;

const extractArchive = (archive) => ["file1", "file2"];

const sendPacket = (sock, data) => data.length;

const downInterface = (iface) => true;

const hydrateSSR = (html) => true;

const swapTokens = (pair, amount) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const rateLimitCheck = (ip) => true;

const interpretBytecode = (bc) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setAngularVelocity = (body, v) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const cancelTask = (id) => ({ id, cancelled: true });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const switchVLAN = (id) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const obfuscateCode = (code) => code;

const getBlockHeight = () => 15000000;

const arpRequest = (ip) => "00:00:00:00:00:00";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createBoxShape = (w, h, d) => ({ type: 'box' });


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const setVelocity = (body, v) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const detectDevTools = () => false;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const removeMetadata = (file) => ({ file, metadata: null });

const decodeABI = (data) => ({ method: "transfer", params: [] });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const serializeAST = (ast) => JSON.stringify(ast);

const createSymbolTable = () => ({ scopes: [] });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const setThreshold = (node, val) => node.threshold.value = val;

const freeMemory = (ptr) => true;

const checkRootAccess = () => false;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const minifyCode = (code) => code;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const dhcpAck = () => true;

const sanitizeXSS = (html) => html;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const subscribeToEvents = (contract) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const autoResumeTask = (id) => ({ id, status: "resumed" });

const receivePacket = (sock, len) => new Uint8Array(len);

const calculateFriction = (mat1, mat2) => 0.5;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const defineSymbol = (table, name, info) => true;

const closeContext = (ctx) => Promise.resolve();

const resampleAudio = (buffer, rate) => buffer;

const dumpSymbolTable = (table) => "";

const scheduleTask = (task) => ({ id: 1, task });

const handleTimeout = (sock) => true;

const reduceDimensionalityPCA = (data) => data;

const createSoftBody = (info) => ({ nodes: [] });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";


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

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const validatePieceChecksum = (piece) => true;

const setFilterType = (filter, type) => filter.type = type;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const cleanOldLogs = (days) => days;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const setRelease = (node, val) => node.release.value = val;

const applyForce = (body, force, point) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const checkBatteryLevel = () => 100;

const setPosition = (panner, x, y, z) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const beginTransaction = () => "TX-" + Date.now();

const removeRigidBody = (world, body) => true;

const analyzeHeader = (packet) => ({});

const clusterKMeans = (data, k) => Array(k).fill([]);

const deleteTexture = (texture) => true;

const monitorClipboard = () => "";

const obfuscateString = (str) => btoa(str);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const detectAudioCodec = () => "aac";

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const upInterface = (iface) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const addConeTwistConstraint = (world, c) => true;

const rollbackTransaction = (tx) => true;

const detectDebugger = () => false;

const setMTU = (iface, mtu) => true;

const adjustPlaybackSpeed = (rate) => rate;

const convertFormat = (src, dest) => dest;

const configureInterface = (iface, config) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const rmdir = (path) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const createListener = (ctx) => ({});

const joinGroup = (group) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const exitScope = (table) => true;

const statFile = (path) => ({ size: 0 });

const computeDominators = (cfg) => ({});

const enableInterrupts = () => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const reportError = (msg, line) => console.error(msg);

const deriveAddress = (path) => "0x123...";

const generateSourceMap = (ast) => "{}";

const convexSweepTest = (shape, start, end) => ({ hit: false });

const createPipe = () => [3, 4];

const verifySignature = (tx, sig) => true;

const validateRecaptcha = (token) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const unmapMemory = (ptr, size) => true;

const setRatio = (node, val) => node.ratio.value = val;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const findLoops = (cfg) => [];

const cacheQueryResults = (key, data) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const hoistVariables = (ast) => ast;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createProcess = (img) => ({ pid: 100 });

const validateFormInput = (input) => input.length > 0;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const preventSleepMode = () => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const createASTNode = (type, val) => ({ type, val });

const calculateCRC32 = (data) => "00000000";

const setQValue = (filter, q) => filter.Q = q;

const writeFile = (fd, data) => true;

const limitRate = (stream, rate) => stream;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const calculateGasFee = (limit) => limit * 20;

const openFile = (path, flags) => 5;

const triggerHapticFeedback = (intensity) => true;

const bundleAssets = (assets) => "";

const createThread = (func) => ({ tid: 1 });

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const decodeAudioData = (buffer) => Promise.resolve({});

const startOscillator = (osc, time) => true;

const restartApplication = () => console.log("Restarting...");

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const closeSocket = (sock) => true;

const getCpuLoad = () => Math.random() * 100;

const clearScreen = (r, g, b, a) => true;

const detectVirtualMachine = () => false;

const dhcpRequest = (ip) => true;

const leaveGroup = (group) => true;

const addRigidBody = (world, body) => true;

const getMediaDuration = () => 3600;

const captureFrame = () => "frame_data_buffer";

const createConstraint = (body1, body2) => ({});

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const setDetune = (osc, cents) => osc.detune = cents;

const broadcastTransaction = (tx) => "tx_hash_123";

// Anti-shake references
const _ref_9hw8p5 = { profilePerformance };
const _ref_t8d9r6 = { archiveFiles };
const _ref_zlmpa8 = { limitBandwidth };
const _ref_ydry8x = { validateTokenStructure };
const _ref_05xcvb = { parseConfigFile };
const _ref_84iocc = { verifyProofOfWork };
const _ref_c0zoef = { vertexAttribPointer };
const _ref_4ceh3u = { updateBitfield };
const _ref_4wt6j4 = { generateUUIDv5 };
const _ref_bnrtfv = { normalizeVector };
const _ref_ifqd6f = { verifyAppSignature };
const _ref_r7bb3q = { computeLossFunction };
const _ref_wpieqh = { enableDHT };
const _ref_q15vla = { calculateSHA256 };
const _ref_q6fi5t = { TelemetryClient };
const _ref_zz2x1y = { shutdownComputer };
const _ref_1n615b = { seedRatioLimit };
const _ref_irqcfa = { closePipe };
const _ref_8rq5fz = { uploadCrashReport };
const _ref_d5bi1l = { lookupSymbol };
const _ref_03kxpo = { enterScope };
const _ref_oshlk8 = { resolveImports };
const _ref_i7g7j1 = { generateFakeClass };
const _ref_xq8x2o = { dropTable };
const _ref_31ym8a = { connectToTracker };
const _ref_2uc8z9 = { setMass };
const _ref_2d9d1g = { createParticleSystem };
const _ref_glzo6u = { reportWarning };
const _ref_hemn6m = { deserializeAST };
const _ref_s6kml1 = { segmentImageUNet };
const _ref_4nby3w = { unlockFile };
const _ref_wbmqq1 = { resolveSymbols };
const _ref_qjp9o4 = { unrollLoops };
const _ref_t4myqo = { simulateNetworkDelay };
const _ref_14jnri = { verifyChecksum };
const _ref_a6ofwa = { parseExpression };
const _ref_5973mt = { compileToBytecode };
const _ref_o5js00 = { allowSleepMode };
const _ref_jfw6gi = { emitParticles };
const _ref_oc2kvz = { allocateDiskSpace };
const _ref_d2bwsj = { resolveDNS };
const _ref_ouwict = { keepAlivePing };
const _ref_v64m32 = { resolveCollision };
const _ref_r9aaia = { extractArchive };
const _ref_hdvwcu = { sendPacket };
const _ref_6g6pwu = { downInterface };
const _ref_n4v5eu = { hydrateSSR };
const _ref_vwawsh = { swapTokens };
const _ref_tail4t = { calculateMD5 };
const _ref_gb347n = { rateLimitCheck };
const _ref_6bn2v0 = { interpretBytecode };
const _ref_d8vl9l = { createMagnetURI };
const _ref_wm67u6 = { setAngularVelocity };
const _ref_8vzd16 = { diffVirtualDOM };
const _ref_s2oyl0 = { cancelTask };
const _ref_0deg6n = { sanitizeInput };
const _ref_jsz6fp = { switchVLAN };
const _ref_pobey0 = { switchProxyServer };
const _ref_nvs8hi = { obfuscateCode };
const _ref_a6tegd = { getBlockHeight };
const _ref_3s2zb8 = { arpRequest };
const _ref_1ou400 = { parseClass };
const _ref_ogmls9 = { streamToPlayer };
const _ref_qvs69c = { createBoxShape };
const _ref_yyjl16 = { getAppConfig };
const _ref_7bqwm8 = { setVelocity };
const _ref_cckyza = { refreshAuthToken };
const _ref_liicpw = { detectDevTools };
const _ref_y7y8tp = { migrateSchema };
const _ref_8koe9r = { removeMetadata };
const _ref_eqe883 = { decodeABI };
const _ref_vqcpjv = { scrapeTracker };
const _ref_g5giqc = { serializeAST };
const _ref_7s9zt6 = { createSymbolTable };
const _ref_hqywnr = { loadModelWeights };
const _ref_3x414r = { setThreshold };
const _ref_beme24 = { freeMemory };
const _ref_ldc1xj = { checkRootAccess };
const _ref_yxg2w7 = { handshakePeer };
const _ref_hlmk05 = { minifyCode };
const _ref_guwfba = { getAngularVelocity };
const _ref_y9hxfm = { dhcpAck };
const _ref_uy1mat = { sanitizeXSS };
const _ref_460oxc = { traceStack };
const _ref_sqsmee = { subscribeToEvents };
const _ref_jkj8wq = { setSocketTimeout };
const _ref_y32ysw = { throttleRequests };
const _ref_n0d7m9 = { autoResumeTask };
const _ref_pig4i0 = { receivePacket };
const _ref_6lcql9 = { calculateFriction };
const _ref_vqedkm = { createScriptProcessor };
const _ref_ahx2bh = { defineSymbol };
const _ref_5exnnh = { closeContext };
const _ref_q0n6oo = { resampleAudio };
const _ref_2k11mr = { dumpSymbolTable };
const _ref_kztwo1 = { scheduleTask };
const _ref_d8hwog = { handleTimeout };
const _ref_fdemnq = { reduceDimensionalityPCA };
const _ref_g3yssz = { createSoftBody };
const _ref_r7otev = { analyzeQueryPlan };
const _ref_tvey1n = { ApiDataFormatter };
const _ref_kxqu2l = { verifyFileSignature };
const _ref_08va7q = { parseTorrentFile };
const _ref_7247zb = { validatePieceChecksum };
const _ref_dm3cg4 = { setFilterType };
const _ref_8mfs9i = { renderVirtualDOM };
const _ref_x4umd6 = { cleanOldLogs };
const _ref_pyjg4o = { resolveDependencyGraph };
const _ref_twem4a = { setRelease };
const _ref_s8oqg6 = { applyForce };
const _ref_1bq9l1 = { vertexAttrib3f };
const _ref_rn3vkx = { checkBatteryLevel };
const _ref_jtmekm = { setPosition };
const _ref_rcay3c = { setFilePermissions };
const _ref_k1hlkj = { beginTransaction };
const _ref_tuow0x = { removeRigidBody };
const _ref_lbsm9n = { analyzeHeader };
const _ref_lzjile = { clusterKMeans };
const _ref_6yley3 = { deleteTexture };
const _ref_5zvsv9 = { monitorClipboard };
const _ref_piq2v0 = { obfuscateString };
const _ref_ut9t3w = { monitorNetworkInterface };
const _ref_5lzp44 = { detectAudioCodec };
const _ref_3pt061 = { performTLSHandshake };
const _ref_s5o73s = { formatCurrency };
const _ref_5j3jti = { upInterface };
const _ref_0pbild = { resolveDNSOverHTTPS };
const _ref_redq73 = { addConeTwistConstraint };
const _ref_4c0bm1 = { rollbackTransaction };
const _ref_zadzsk = { detectDebugger };
const _ref_cir0tm = { setMTU };
const _ref_4bn6gg = { adjustPlaybackSpeed };
const _ref_w8flkc = { convertFormat };
const _ref_xfbbxp = { configureInterface };
const _ref_981g0c = { registerSystemTray };
const _ref_c3yrgi = { initiateHandshake };
const _ref_7z8bw2 = { rmdir };
const _ref_5s506r = { createPhysicsWorld };
const _ref_eygmr5 = { calculateLayoutMetrics };
const _ref_oo8ucw = { createListener };
const _ref_apjjgr = { joinGroup };
const _ref_h0ux5j = { flushSocketBuffer };
const _ref_igp95l = { exitScope };
const _ref_c6rui3 = { statFile };
const _ref_jpgpba = { computeDominators };
const _ref_ucdl63 = { enableInterrupts };
const _ref_z9p5vp = { updateProgressBar };
const _ref_wnu9ba = { reportError };
const _ref_yclxyt = { deriveAddress };
const _ref_vqbnyr = { generateSourceMap };
const _ref_lr2fcd = { convexSweepTest };
const _ref_3qy54t = { createPipe };
const _ref_q0t9t6 = { verifySignature };
const _ref_gzxo95 = { validateRecaptcha };
const _ref_yzxuxo = { checkIntegrity };
const _ref_7jqhcf = { unmapMemory };
const _ref_8uyr8a = { setRatio };
const _ref_ut1oot = { tunnelThroughProxy };
const _ref_e6k5ee = { findLoops };
const _ref_n5tznq = { cacheQueryResults };
const _ref_d13yfm = { recognizeSpeech };
const _ref_hm0ro5 = { hoistVariables };
const _ref_lj1en2 = { computeSpeedAverage };
const _ref_ecfjl1 = { parseStatement };
const _ref_mlvjc9 = { createProcess };
const _ref_o7ughh = { validateFormInput };
const _ref_hje9f0 = { readPixels };
const _ref_65mcy2 = { retryFailedSegment };
const _ref_atqsx7 = { requestPiece };
const _ref_7keen1 = { preventSleepMode };
const _ref_v2ui6g = { getSystemUptime };
const _ref_h2ctc2 = { createASTNode };
const _ref_dy3pak = { calculateCRC32 };
const _ref_254nk4 = { setQValue };
const _ref_2ychy1 = { writeFile };
const _ref_xj4iha = { limitRate };
const _ref_kirwrs = { createIndex };
const _ref_x52u9t = { calculateGasFee };
const _ref_isu4r2 = { openFile };
const _ref_7fq87t = { triggerHapticFeedback };
const _ref_0dbvfa = { bundleAssets };
const _ref_1le0j9 = { createThread };
const _ref_qvj4t7 = { compactDatabase };
const _ref_6jrl5a = { decodeAudioData };
const _ref_ejb64o = { startOscillator };
const _ref_8u9rx3 = { restartApplication };
const _ref_riapgs = { createBiquadFilter };
const _ref_3qdeea = { closeSocket };
const _ref_qozuzs = { getCpuLoad };
const _ref_nykqgm = { clearScreen };
const _ref_5pxfv0 = { detectVirtualMachine };
const _ref_l1acyt = { dhcpRequest };
const _ref_qt8did = { leaveGroup };
const _ref_mbcaep = { addRigidBody };
const _ref_03ui8z = { getMediaDuration };
const _ref_0atbxh = { captureFrame };
const _ref_7mnsbj = { createConstraint };
const _ref_tacfjl = { getMemoryUsage };
const _ref_a14mzx = { setDetune };
const _ref_ntwqvn = { broadcastTransaction }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `twitch` };
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
                const urlParams = { config, url: window.location.href, name_en: `twitch` };

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
        const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const mutexUnlock = (mtx) => true;

const normalizeVolume = (buffer) => buffer;

const killParticles = (sys) => true;

const setAngularVelocity = (body, v) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const checkParticleCollision = (sys, world) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createTCPSocket = () => ({ fd: 1 });

const compileToBytecode = (ast) => new Uint8Array();

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const captureScreenshot = () => "data:image/png;base64,...";

const createSymbolTable = () => ({ scopes: [] });

const wakeUp = (body) => true;

const resampleAudio = (buffer, rate) => buffer;

const addConeTwistConstraint = (world, c) => true;

const linkModules = (modules) => ({});

const announceToTracker = (url) => ({ url, interval: 1800 });

const profilePerformance = (func) => 0;

const createConstraint = (body1, body2) => ({});

const detectVirtualMachine = () => false;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const optimizeTailCalls = (ast) => ast;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const setThreshold = (node, val) => node.threshold.value = val;

const generateCode = (ast) => "const a = 1;";

const setVolumeLevel = (vol) => vol;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const useProgram = (program) => true;

const instrumentCode = (code) => code;

const establishHandshake = (sock) => true;

const verifySignature = (tx, sig) => true;

const exitScope = (table) => true;

const mockResponse = (body) => ({ status: 200, body });

const flushSocketBuffer = (sock) => sock.buffer = [];

const retransmitPacket = (seq) => true;

const setViewport = (x, y, w, h) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const vertexAttrib3f = (idx, x, y, z) => true;

const setVelocity = (body, v) => true;

const validatePieceChecksum = (piece) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
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

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const multicastMessage = (group, msg) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const processAudioBuffer = (buffer) => buffer;

const unlinkFile = (path) => true;

const resumeContext = (ctx) => Promise.resolve();

const connectSocket = (sock, addr, port) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setGravity = (world, g) => world.gravity = g;

const renderParticles = (sys) => true;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const stepSimulation = (world, dt) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const bindTexture = (target, texture) => true;

const controlCongestion = (sock) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const getNetworkStats = () => ({ up: 100, down: 2000 });

const removeMetadata = (file) => ({ file, metadata: null });

const augmentData = (image) => image;

const detectDarkMode = () => true;

const extractArchive = (archive) => ["file1", "file2"];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setFilterType = (filter, type) => filter.type = type;

const applyTorque = (body, torque) => true;

const generateSourceMap = (ast) => "{}";

const setPosition = (panner, x, y, z) => true;

const contextSwitch = (oldPid, newPid) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const freeMemory = (ptr) => true;

const switchVLAN = (id) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const verifyChecksum = (data, sum) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const encryptStream = (stream, key) => stream;

const cullFace = (mode) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const mapMemory = (fd, size) => 0x2000;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const scheduleProcess = (pid) => true;

const validateIPWhitelist = (ip) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const compressPacket = (data) => data;

const resolveCollision = (manifold) => true;

const forkProcess = () => 101;

const createBoxShape = (w, h, d) => ({ type: 'box' });


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

const detectAudioCodec = () => "aac";

const hydrateSSR = (html) => true;

const addSliderConstraint = (world, c) => true;

const checkUpdate = () => ({ hasUpdate: false });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const edgeDetectionSobel = (image) => image;

const renderShadowMap = (scene, light) => ({ texture: {} });

const applyForce = (body, force, point) => true;

const findLoops = (cfg) => [];

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const analyzeHeader = (packet) => ({});

const claimRewards = (pool) => "0.5 ETH";

const scheduleTask = (task) => ({ id: 1, task });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const cacheQueryResults = (key, data) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const shardingTable = (table) => ["shard_0", "shard_1"];

const createMediaStreamSource = (ctx, stream) => ({});

const acceptConnection = (sock) => ({ fd: 2 });

const encryptPeerTraffic = (data) => btoa(data);

const segmentImageUNet = (img) => "mask_buffer";

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const mutexLock = (mtx) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const bufferMediaStream = (size) => ({ buffer: size });

const setInertia = (body, i) => true;

const bundleAssets = (assets) => "";

const clusterKMeans = (data, k) => Array(k).fill([]);

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const deleteBuffer = (buffer) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const applyImpulse = (body, impulse, point) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const deriveAddress = (path) => "0x123...";

const splitFile = (path, parts) => Array(parts).fill(path);

const drawArrays = (gl, mode, first, count) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const resolveDNS = (domain) => "127.0.0.1";

const addRigidBody = (world, body) => true;

const upInterface = (iface) => true;

const decompressGzip = (data) => data;

const deserializeAST = (json) => JSON.parse(json);

const generateMipmaps = (target) => true;

const bufferData = (gl, target, data, usage) => true;

const beginTransaction = () => "TX-" + Date.now();

const syncAudioVideo = (offset) => ({ offset, synced: true });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const seedRatioLimit = (ratio) => ratio >= 2.0;

const fragmentPacket = (data, mtu) => [data];

const chdir = (path) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const handleInterrupt = (irq) => true;

const auditAccessLogs = () => true;

const negotiateProtocol = () => "HTTP/2.0";

const sanitizeXSS = (html) => html;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const createMediaElementSource = (ctx, el) => ({});

const resolveImports = (ast) => [];

const disablePEX = () => false;

const getByteFrequencyData = (analyser, array) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const detectVideoCodec = () => "h264";

const connectNodes = (src, dest) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const validateFormInput = (input) => input.length > 0;

const setDetune = (osc, cents) => osc.detune = cents;

const parseQueryString = (qs) => ({});

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const translateText = (text, lang) => text;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const rateLimitCheck = (ip) => true;

const setKnee = (node, val) => node.knee.value = val;

const addGeneric6DofConstraint = (world, c) => true;

const validateProgram = (program) => true;

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

const setAttack = (node, val) => node.attack.value = val;

const calculateGasFee = (limit) => limit * 20;

const decapsulateFrame = (frame) => frame;

const limitRate = (stream, rate) => stream;

const createListener = (ctx) => ({});

const getOutputTimestamp = (ctx) => Date.now();

const prettifyCode = (code) => code;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const performOCR = (img) => "Detected Text";

const dhcpAck = () => true;

const joinGroup = (group) => true;

const injectCSPHeader = () => "default-src 'self'";

const jitCompile = (bc) => (() => {});

const reassemblePacket = (fragments) => fragments[0];

const setEnv = (key, val) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const fingerprintBrowser = () => "fp_hash_123";

// Anti-shake references
const _ref_apz7ev = { computeNormal };
const _ref_okoaq1 = { initiateHandshake };
const _ref_8dwm9v = { mutexUnlock };
const _ref_frozsk = { normalizeVolume };
const _ref_qfftqf = { killParticles };
const _ref_upzrh4 = { setAngularVelocity };
const _ref_mkrila = { setBrake };
const _ref_sayxsq = { checkParticleCollision };
const _ref_zrwja8 = { parseClass };
const _ref_47lr1c = { createTCPSocket };
const _ref_xs3sfi = { compileToBytecode };
const _ref_wqekpm = { loadModelWeights };
const _ref_kp91v4 = { captureScreenshot };
const _ref_0u1dem = { createSymbolTable };
const _ref_ypjayh = { wakeUp };
const _ref_6tzfbb = { resampleAudio };
const _ref_nk1p39 = { addConeTwistConstraint };
const _ref_4xuyx9 = { linkModules };
const _ref_s1niow = { announceToTracker };
const _ref_b8m86a = { profilePerformance };
const _ref_hatjdu = { createConstraint };
const _ref_torpfk = { detectVirtualMachine };
const _ref_ugbv82 = { switchProxyServer };
const _ref_rmg2z1 = { optimizeTailCalls };
const _ref_zh4x02 = { normalizeAudio };
const _ref_myuc52 = { setThreshold };
const _ref_of22bz = { generateCode };
const _ref_1v9cpv = { setVolumeLevel };
const _ref_28ypvu = { calculateSHA256 };
const _ref_pjj61s = { useProgram };
const _ref_mny3ii = { instrumentCode };
const _ref_k49zf2 = { establishHandshake };
const _ref_uqi6su = { verifySignature };
const _ref_wk9pa1 = { exitScope };
const _ref_9w96n7 = { mockResponse };
const _ref_m74tka = { flushSocketBuffer };
const _ref_iqakph = { retransmitPacket };
const _ref_xhoe5z = { setViewport };
const _ref_x88pop = { debouncedResize };
const _ref_pe3ii6 = { vertexAttrib3f };
const _ref_k5lwt7 = { setVelocity };
const _ref_psha3f = { validatePieceChecksum };
const _ref_fji2i9 = { analyzeUserBehavior };
const _ref_uju9xr = { generateFakeClass };
const _ref_64ix6x = { scheduleBandwidth };
const _ref_qfg5tf = { multicastMessage };
const _ref_wle42n = { archiveFiles };
const _ref_icumrb = { processAudioBuffer };
const _ref_qz2alo = { unlinkFile };
const _ref_mvnboa = { resumeContext };
const _ref_su9z1i = { connectSocket };
const _ref_tci42i = { getAngularVelocity };
const _ref_ptoivh = { setGravity };
const _ref_so2wr8 = { renderParticles };
const _ref_h5dl8q = { getMACAddress };
const _ref_htk6qw = { stepSimulation };
const _ref_stk8sk = { analyzeControlFlow };
const _ref_mzvock = { bindTexture };
const _ref_eu80hr = { controlCongestion };
const _ref_yqkf8j = { detectEnvironment };
const _ref_xigi03 = { decryptHLSStream };
const _ref_6qartg = { optimizeMemoryUsage };
const _ref_117sk0 = { setFilePermissions };
const _ref_2351nx = { simulateNetworkDelay };
const _ref_ssorid = { calculateMD5 };
const _ref_q5r6om = { connectionPooling };
const _ref_znftcj = { getNetworkStats };
const _ref_ks5xkv = { removeMetadata };
const _ref_i9h2mw = { augmentData };
const _ref_ou8uo6 = { detectDarkMode };
const _ref_9blznt = { extractArchive };
const _ref_99fl4m = { createMagnetURI };
const _ref_yb446t = { setFilterType };
const _ref_cwipzg = { applyTorque };
const _ref_qualh7 = { generateSourceMap };
const _ref_0rr7ch = { setPosition };
const _ref_lyh2ae = { contextSwitch };
const _ref_9lzsx7 = { validateTokenStructure };
const _ref_el5pl7 = { freeMemory };
const _ref_ripaww = { switchVLAN };
const _ref_uq53ks = { formatLogMessage };
const _ref_8yniv0 = { verifyChecksum };
const _ref_2u7u7b = { sanitizeInput };
const _ref_4344hf = { encryptStream };
const _ref_ybmmju = { cullFace };
const _ref_pxxump = { readPipe };
const _ref_e90rbv = { mapMemory };
const _ref_5exdq6 = { generateUserAgent };
const _ref_7rqgl5 = { loadTexture };
const _ref_s86or9 = { discoverPeersDHT };
const _ref_dgjv7i = { calculateLighting };
const _ref_rx2q7m = { setSteeringValue };
const _ref_pvmw83 = { scheduleProcess };
const _ref_tlzipt = { validateIPWhitelist };
const _ref_ckq5ej = { encryptPayload };
const _ref_n6de28 = { compressPacket };
const _ref_4h0rcg = { resolveCollision };
const _ref_rh9fq5 = { forkProcess };
const _ref_z54xwz = { createBoxShape };
const _ref_7zprd3 = { ResourceMonitor };
const _ref_4nmh72 = { detectAudioCodec };
const _ref_hxxqv5 = { hydrateSSR };
const _ref_yvyglj = { addSliderConstraint };
const _ref_sxtyc0 = { checkUpdate };
const _ref_z1vco7 = { throttleRequests };
const _ref_rsesbf = { applyEngineForce };
const _ref_7b6nil = { edgeDetectionSobel };
const _ref_tu49d9 = { renderShadowMap };
const _ref_e7f5e0 = { applyForce };
const _ref_0s5xpk = { findLoops };
const _ref_dfo71o = { resolveDNSOverHTTPS };
const _ref_acrh3d = { analyzeHeader };
const _ref_c1n1x0 = { claimRewards };
const _ref_26l9hr = { scheduleTask };
const _ref_4a5wlk = { parseConfigFile };
const _ref_qi548d = { cacheQueryResults };
const _ref_kb30a9 = { validateSSLCert };
const _ref_shf89q = { limitUploadSpeed };
const _ref_yxtqxe = { keepAlivePing };
const _ref_34maui = { shardingTable };
const _ref_m2iigb = { createMediaStreamSource };
const _ref_x28y3h = { acceptConnection };
const _ref_ucmznz = { encryptPeerTraffic };
const _ref_9m90tg = { segmentImageUNet };
const _ref_tp3vzu = { createAnalyser };
const _ref_euc3ni = { mutexLock };
const _ref_8x89gd = { parseM3U8Playlist };
const _ref_pagwu6 = { diffVirtualDOM };
const _ref_rse1yf = { bufferMediaStream };
const _ref_6s1psb = { setInertia };
const _ref_x0ca20 = { bundleAssets };
const _ref_hemnhk = { clusterKMeans };
const _ref_ynjo1y = { compressDataStream };
const _ref_pdpr1r = { deleteBuffer };
const _ref_6ecje6 = { createMeshShape };
const _ref_03ledg = { applyImpulse };
const _ref_dcho1c = { transformAesKey };
const _ref_994krk = { resolveDependencyGraph };
const _ref_w1cz3i = { deriveAddress };
const _ref_yucgdo = { splitFile };
const _ref_27tc37 = { drawArrays };
const _ref_xvdzmd = { createOscillator };
const _ref_ryl502 = { resolveDNS };
const _ref_tnbj40 = { addRigidBody };
const _ref_y2h5ye = { upInterface };
const _ref_yx3xir = { decompressGzip };
const _ref_nhil90 = { deserializeAST };
const _ref_p8zroq = { generateMipmaps };
const _ref_dv9c9v = { bufferData };
const _ref_r66v9f = { beginTransaction };
const _ref_x9l308 = { syncAudioVideo };
const _ref_ko1eqd = { calculateEntropy };
const _ref_9e6dyy = { executeSQLQuery };
const _ref_wfhksk = { seedRatioLimit };
const _ref_4930pn = { fragmentPacket };
const _ref_ihtpcn = { chdir };
const _ref_j2lx20 = { rayIntersectTriangle };
const _ref_s1fbnp = { handleInterrupt };
const _ref_2xq206 = { auditAccessLogs };
const _ref_06gvtj = { negotiateProtocol };
const _ref_vz0e23 = { sanitizeXSS };
const _ref_hj938r = { getSystemUptime };
const _ref_t2jyn4 = { createMediaElementSource };
const _ref_8ujwjq = { resolveImports };
const _ref_237kqi = { disablePEX };
const _ref_k0cbhr = { getByteFrequencyData };
const _ref_actoxb = { getFloatTimeDomainData };
const _ref_71nsrx = { initWebGLContext };
const _ref_i92hnh = { detectVideoCodec };
const _ref_amc6gv = { connectNodes };
const _ref_sgylex = { playSoundAlert };
const _ref_ilv8ul = { validateFormInput };
const _ref_aipk2c = { setDetune };
const _ref_ik1ajp = { parseQueryString };
const _ref_0foqvz = { handshakePeer };
const _ref_3s7if4 = { manageCookieJar };
const _ref_2w8pzf = { translateText };
const _ref_gcqe9h = { validateMnemonic };
const _ref_rj77lc = { rateLimitCheck };
const _ref_y5yhx3 = { setKnee };
const _ref_doow1k = { addGeneric6DofConstraint };
const _ref_4q1fw3 = { validateProgram };
const _ref_y0zic3 = { download };
const _ref_j83o4u = { setAttack };
const _ref_gb1d3j = { calculateGasFee };
const _ref_vho1cc = { decapsulateFrame };
const _ref_f0w5e6 = { limitRate };
const _ref_7cucfg = { createListener };
const _ref_j1dxti = { getOutputTimestamp };
const _ref_evfsmx = { prettifyCode };
const _ref_xyqycm = { allocateDiskSpace };
const _ref_35ge5g = { performOCR };
const _ref_ct1n2k = { dhcpAck };
const _ref_ti8003 = { joinGroup };
const _ref_5m64ni = { injectCSPHeader };
const _ref_6atbb8 = { jitCompile };
const _ref_2hg2ke = { reassemblePacket };
const _ref_hqvuxf = { setEnv };
const _ref_jf7r8q = { resolveHostName };
const _ref_gmvp3o = { fingerprintBrowser }; 
    });
})({}, {});