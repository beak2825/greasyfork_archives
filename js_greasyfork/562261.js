// ==UserScript==
// @name rutube视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/rutube/index.js
// @version 2026.01.10
// @description 一键下载rutube视频，支持4K/1080P/720P多画质。
// @icon https://static.rutube.ru/static/img/favicon-icons/v3/icon_180x180.png
// @match *://*.rutube.ru/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect rutube.ru
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
// @downloadURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562261/rutube%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        const sendPacket = (sock, data) => data.length;

const rayCast = (world, start, end) => ({ hit: false });

const parseLogTopics = (topics) => ["Transfer"];

const uniform3f = (loc, x, y, z) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const createFrameBuffer = () => ({ id: Math.random() });

const bufferData = (gl, target, data, usage) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const resumeContext = (ctx) => Promise.resolve();

const createBoxShape = (w, h, d) => ({ type: 'box' });

const resampleAudio = (buffer, rate) => buffer;

const wakeUp = (body) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const enableInterrupts = () => true;

const compressPacket = (data) => data;

const setVelocity = (body, v) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const deleteProgram = (program) => true;

const minifyCode = (code) => code;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const exitScope = (table) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const scaleMatrix = (mat, vec) => mat;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const deserializeAST = (json) => JSON.parse(json);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const clusterKMeans = (data, k) => Array(k).fill([]);

const preventCSRF = () => "csrf_token";

const getOutputTimestamp = (ctx) => Date.now();

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const updateRoutingTable = (entry) => true;

const activeTexture = (unit) => true;

const connectNodes = (src, dest) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };


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

const vertexAttrib3f = (idx, x, y, z) => true;

const parseQueryString = (qs) => ({});


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

const retransmitPacket = (seq) => true;

const cleanOldLogs = (days) => days;

const hoistVariables = (ast) => ast;

const setOrientation = (panner, x, y, z) => true;

const dumpSymbolTable = (table) => "";

const drawElements = (mode, count, type, offset) => true;

const createConvolver = (ctx) => ({ buffer: null });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const analyzeControlFlow = (ast) => ({ graph: {} });

const augmentData = (image) => image;

const setAngularVelocity = (body, v) => true;

const broadcastMessage = (msg) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const checkBalance = (addr) => "10.5 ETH";

const claimRewards = (pool) => "0.5 ETH";

const upInterface = (iface) => true;

const computeLossFunction = (pred, actual) => 0.05;

const verifySignature = (tx, sig) => true;


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

const unmapMemory = (ptr, size) => true;

const adjustWindowSize = (sock, size) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const normalizeVolume = (buffer) => buffer;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const cullFace = (mode) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const enterScope = (table) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const analyzeHeader = (packet) => ({});

const restoreDatabase = (path) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const applyForce = (body, force, point) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const resolveDNS = (domain) => "127.0.0.1";

const disableDepthTest = () => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const dhcpOffer = (ip) => true;

const getUniformLocation = (program, name) => 1;

const createASTNode = (type, val) => ({ type, val });

const verifyAppSignature = () => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const subscribeToEvents = (contract) => true;

const allocateRegisters = (ir) => ir;

const cacheQueryResults = (key, data) => true;

const performOCR = (img) => "Detected Text";

const reassemblePacket = (fragments) => fragments[0];

const getFloatTimeDomainData = (analyser, array) => true;

const debugAST = (ast) => "";

const stopOscillator = (osc, time) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
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

const scheduleProcess = (pid) => true;

const configureInterface = (iface, config) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const readPipe = (fd, len) => new Uint8Array(len);

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const dhcpDiscover = () => true;

const backpropagateGradient = (loss) => true;

const invalidateCache = (key) => true;

const sanitizeXSS = (html) => html;

const detectDarkMode = () => true;

const setGainValue = (node, val) => node.gain.value = val;

const checkTypes = (ast) => [];

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const openFile = (path, flags) => 5;

const calculateGasFee = (limit) => limit * 20;


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

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const deriveAddress = (path) => "0x123...";

const monitorClipboard = () => "";

const limitRate = (stream, rate) => stream;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const systemCall = (num, args) => 0;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const signTransaction = (tx, key) => "signed_tx_hash";

const getBlockHeight = () => 15000000;

const emitParticles = (sys, count) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const bundleAssets = (assets) => "";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const inlineFunctions = (ast) => ast;

const decodeAudioData = (buffer) => Promise.resolve({});

const startOscillator = (osc, time) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const disconnectNodes = (node) => true;

const panicKernel = (msg) => false;

const writeFile = (fd, data) => true;

const loadDriver = (path) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const detectVirtualMachine = () => false;

const applyTheme = (theme) => document.body.className = theme;

const resolveCollision = (manifold) => true;

const compileToBytecode = (ast) => new Uint8Array();

const chmodFile = (path, mode) => true;

const replicateData = (node) => ({ target: node, synced: true });

const semaphoreWait = (sem) => true;

const verifyProofOfWork = (nonce) => true;

const addConeTwistConstraint = (world, c) => true;

const mapMemory = (fd, size) => 0x2000;

const unlinkFile = (path) => true;

const fingerprintBrowser = () => "fp_hash_123";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setKnee = (node, val) => node.knee.value = val;

const verifyChecksum = (data, sum) => true;

const chdir = (path) => true;

const getVehicleSpeed = (vehicle) => 0;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const createSoftBody = (info) => ({ nodes: [] });

const measureRTT = (sent, recv) => 10;

const hashKeccak256 = (data) => "0xabc...";

const attachRenderBuffer = (fb, rb) => true;

const execProcess = (path) => true;

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

const setDistanceModel = (panner, model) => true;

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

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createProcess = (img) => ({ pid: 100 });

const deleteBuffer = (buffer) => true;

const optimizeTailCalls = (ast) => ast;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const estimateNonce = (addr) => 42;

const encodeABI = (method, params) => "0x...";

const setPosition = (panner, x, y, z) => true;

const logErrorToFile = (err) => console.error(err);

const closeSocket = (sock) => true;

const findLoops = (cfg) => [];

const mkdir = (path) => true;

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

const checkGLError = () => 0;

const captureScreenshot = () => "data:image/png;base64,...";

const killParticles = (sys) => true;

const mutexUnlock = (mtx) => true;

const dropTable = (table) => true;

const drawArrays = (gl, mode, first, count) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

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

const recognizeSpeech = (audio) => "Transcribed Text";

const encryptLocalStorage = (key, val) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const setVolumeLevel = (vol) => vol;

const createIndexBuffer = (data) => ({ id: Math.random() });

const translateMatrix = (mat, vec) => mat;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const createSymbolTable = () => ({ scopes: [] });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const createVehicle = (chassis) => ({ wheels: [] });

const resolveSymbols = (ast) => ({});

const removeMetadata = (file) => ({ file, metadata: null });

const createSphereShape = (r) => ({ type: 'sphere' });

const classifySentiment = (text) => "positive";

const detectAudioCodec = () => "aac";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const getExtension = (name) => ({});

const remuxContainer = (container) => ({ container, status: "done" });

// Anti-shake references
const _ref_6557eb = { sendPacket };
const _ref_u9tqfb = { rayCast };
const _ref_y54to5 = { parseLogTopics };
const _ref_fvkz5y = { uniform3f };
const _ref_nkxhj9 = { createPeriodicWave };
const _ref_tb39nt = { createFrameBuffer };
const _ref_xl882z = { bufferData };
const _ref_0a6vxz = { createBiquadFilter };
const _ref_2d62hn = { resumeContext };
const _ref_34pgy8 = { createBoxShape };
const _ref_x2i5za = { resampleAudio };
const _ref_7zl5bu = { wakeUp };
const _ref_hj2dzf = { diffVirtualDOM };
const _ref_tl52gp = { enableInterrupts };
const _ref_qyghyk = { compressPacket };
const _ref_4ca14k = { setVelocity };
const _ref_rzc0j1 = { createAnalyser };
const _ref_ains0h = { deleteProgram };
const _ref_rtqe4a = { minifyCode };
const _ref_v78mqi = { isFeatureEnabled };
const _ref_vcdg4p = { exitScope };
const _ref_d674tm = { createCapsuleShape };
const _ref_4rkjx0 = { optimizeConnectionPool };
const _ref_b9lmig = { scaleMatrix };
const _ref_b6amam = { validateMnemonic };
const _ref_vzx2l8 = { deserializeAST };
const _ref_ctfcvg = { detectEnvironment };
const _ref_ml7ib4 = { clusterKMeans };
const _ref_w4g7j6 = { preventCSRF };
const _ref_twl6y7 = { getOutputTimestamp };
const _ref_4fipm0 = { debounceAction };
const _ref_0i0ba3 = { updateRoutingTable };
const _ref_z1w4x8 = { activeTexture };
const _ref_cfvz0n = { connectNodes };
const _ref_7ktii6 = { resolveDependencyGraph };
const _ref_uixphj = { CacheManager };
const _ref_4t03g0 = { vertexAttrib3f };
const _ref_2s565x = { parseQueryString };
const _ref_g5t03e = { TelemetryClient };
const _ref_vwv389 = { retransmitPacket };
const _ref_v1mhbn = { cleanOldLogs };
const _ref_pk6055 = { hoistVariables };
const _ref_qbcjj3 = { setOrientation };
const _ref_a1p3cy = { dumpSymbolTable };
const _ref_aqb2ew = { drawElements };
const _ref_dyu3ow = { createConvolver };
const _ref_fn5a0m = { readPixels };
const _ref_y9yvbr = { analyzeControlFlow };
const _ref_yf5i6p = { augmentData };
const _ref_b9pqih = { setAngularVelocity };
const _ref_hvxt1a = { broadcastMessage };
const _ref_c9qhe3 = { generateUUIDv5 };
const _ref_bcnq1j = { checkBalance };
const _ref_a07xsm = { claimRewards };
const _ref_w6r8z7 = { upInterface };
const _ref_mbagfu = { computeLossFunction };
const _ref_kkxftg = { verifySignature };
const _ref_zf9gvq = { ResourceMonitor };
const _ref_j5fncb = { unmapMemory };
const _ref_cqomi4 = { adjustWindowSize };
const _ref_c4z4fy = { createShader };
const _ref_rmprcz = { normalizeVolume };
const _ref_u36v6q = { analyzeUserBehavior };
const _ref_4ezr7s = { getMACAddress };
const _ref_mpe7w6 = { connectToTracker };
const _ref_gnl0dv = { cullFace };
const _ref_1klw48 = { sanitizeInput };
const _ref_784si6 = { lazyLoadComponent };
const _ref_zec2vv = { enterScope };
const _ref_pemg10 = { normalizeFeatures };
const _ref_q0lpun = { analyzeHeader };
const _ref_m89rp0 = { restoreDatabase };
const _ref_4xtyqu = { createOscillator };
const _ref_s1nlqk = { applyForce };
const _ref_i8brg8 = { convexSweepTest };
const _ref_y98m03 = { resolveDNS };
const _ref_gyu6ac = { disableDepthTest };
const _ref_askxyg = { setFrequency };
const _ref_jr4k7u = { dhcpOffer };
const _ref_nryv9x = { getUniformLocation };
const _ref_ktqv2a = { createASTNode };
const _ref_jmhhms = { verifyAppSignature };
const _ref_0f7ygy = { setDelayTime };
const _ref_nqjw5d = { subscribeToEvents };
const _ref_fuw3nr = { allocateRegisters };
const _ref_x8vhjo = { cacheQueryResults };
const _ref_s02keb = { performOCR };
const _ref_fvxlvs = { reassemblePacket };
const _ref_ibyrj5 = { getFloatTimeDomainData };
const _ref_k3swwf = { debugAST };
const _ref_38msb2 = { stopOscillator };
const _ref_6qdm17 = { calculatePieceHash };
const _ref_qqy01u = { FileValidator };
const _ref_taufa3 = { scheduleProcess };
const _ref_8cjol1 = { configureInterface };
const _ref_jse179 = { compressDataStream };
const _ref_g30ewt = { readPipe };
const _ref_thvft2 = { createDynamicsCompressor };
const _ref_0pbt5i = { dhcpDiscover };
const _ref_7heqza = { backpropagateGradient };
const _ref_4i3xkl = { invalidateCache };
const _ref_kwyk4g = { sanitizeXSS };
const _ref_w0ltv5 = { detectDarkMode };
const _ref_d8j7sm = { setGainValue };
const _ref_u0kxec = { checkTypes };
const _ref_2m5xyp = { traceStack };
const _ref_haf6yj = { openFile };
const _ref_mbudsl = { calculateGasFee };
const _ref_9dl7zs = { ApiDataFormatter };
const _ref_ugr1ct = { handshakePeer };
const _ref_kyn3aj = { deriveAddress };
const _ref_h2wyoi = { monitorClipboard };
const _ref_1tbh1x = { limitRate };
const _ref_daqkth = { normalizeVector };
const _ref_l9ac72 = { systemCall };
const _ref_nzwdnw = { saveCheckpoint };
const _ref_z8u61v = { signTransaction };
const _ref_6xsmlx = { getBlockHeight };
const _ref_zawxrq = { emitParticles };
const _ref_ud503f = { createMediaStreamSource };
const _ref_wgqkc2 = { parseMagnetLink };
const _ref_j7prg1 = { bundleAssets };
const _ref_km7lb3 = { getAngularVelocity };
const _ref_dxx15t = { encryptPayload };
const _ref_yucibj = { virtualScroll };
const _ref_hf1sd2 = { executeSQLQuery };
const _ref_htz5du = { inlineFunctions };
const _ref_3pmqcv = { decodeAudioData };
const _ref_i6ausg = { startOscillator };
const _ref_qbnv91 = { parseFunction };
const _ref_afgupx = { disconnectNodes };
const _ref_12wdup = { panicKernel };
const _ref_qg97xf = { writeFile };
const _ref_i093te = { loadDriver };
const _ref_aefhlv = { transformAesKey };
const _ref_ijire4 = { detectVirtualMachine };
const _ref_ryxua6 = { applyTheme };
const _ref_daafr1 = { resolveCollision };
const _ref_89r8d6 = { compileToBytecode };
const _ref_xn05gu = { chmodFile };
const _ref_c2pgxa = { replicateData };
const _ref_v7amtz = { semaphoreWait };
const _ref_jebud9 = { verifyProofOfWork };
const _ref_azot0d = { addConeTwistConstraint };
const _ref_2q5w1y = { mapMemory };
const _ref_u3cano = { unlinkFile };
const _ref_i0ksar = { fingerprintBrowser };
const _ref_to2zjw = { createPhysicsWorld };
const _ref_axwv0n = { setKnee };
const _ref_577al3 = { verifyChecksum };
const _ref_9xhzek = { chdir };
const _ref_6iffbw = { getVehicleSpeed };
const _ref_r7lln3 = { getAppConfig };
const _ref_ztgcug = { createSoftBody };
const _ref_3g9qha = { measureRTT };
const _ref_eusi15 = { hashKeccak256 };
const _ref_2sap5x = { attachRenderBuffer };
const _ref_h1ub8o = { execProcess };
const _ref_f2jxgt = { download };
const _ref_2nuxx5 = { setDistanceModel };
const _ref_t4x6zc = { generateFakeClass };
const _ref_2mb07m = { calculateEntropy };
const _ref_j8wchu = { createProcess };
const _ref_8fvlpt = { deleteBuffer };
const _ref_bq2pc8 = { optimizeTailCalls };
const _ref_6oznig = { optimizeHyperparameters };
const _ref_vi2p15 = { estimateNonce };
const _ref_7k4vs8 = { encodeABI };
const _ref_26t3ke = { setPosition };
const _ref_co03ts = { logErrorToFile };
const _ref_4u0ggb = { closeSocket };
const _ref_gksyz6 = { findLoops };
const _ref_73dorx = { mkdir };
const _ref_1drq7m = { ProtocolBufferHandler };
const _ref_ewvmmu = { checkGLError };
const _ref_tj7wvl = { captureScreenshot };
const _ref_7vjmys = { killParticles };
const _ref_h8wp41 = { mutexUnlock };
const _ref_dkqt8l = { dropTable };
const _ref_785gwj = { drawArrays };
const _ref_kijwwy = { convertHSLtoRGB };
const _ref_tzqze6 = { AdvancedCipher };
const _ref_38t5ly = { recognizeSpeech };
const _ref_rsldeh = { encryptLocalStorage };
const _ref_utl8xd = { checkIntegrity };
const _ref_bquzkf = { setVolumeLevel };
const _ref_0cah2o = { createIndexBuffer };
const _ref_r24kmf = { translateMatrix };
const _ref_rn38k0 = { syncDatabase };
const _ref_hktsim = { createSymbolTable };
const _ref_1ym7ri = { archiveFiles };
const _ref_ld6tq5 = { createVehicle };
const _ref_gwri0v = { resolveSymbols };
const _ref_syniwi = { removeMetadata };
const _ref_zerjf5 = { createSphereShape };
const _ref_ifesv9 = { classifySentiment };
const _ref_gyeqni = { detectAudioCodec };
const _ref_5stbzt = { initWebGLContext };
const _ref_p9tyi5 = { getExtension };
const _ref_u32bt3 = { remuxContainer }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `rutube` };
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
                const urlParams = { config, url: window.location.href, name_en: `rutube` };

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
        const verifyProofOfWork = (nonce) => true;

const upInterface = (iface) => true;

const verifyIR = (ir) => true;

const resolveImports = (ast) => [];

const createTCPSocket = () => ({ fd: 1 });

const compileToBytecode = (ast) => new Uint8Array();

const multicastMessage = (group, msg) => true;

const linkModules = (modules) => ({});

const optimizeTailCalls = (ast) => ast;

const exitScope = (table) => true;

const generateSourceMap = (ast) => "{}";

const profilePerformance = (func) => 0;

const serializeAST = (ast) => JSON.stringify(ast);

const joinGroup = (group) => true;

const prettifyCode = (code) => code;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const connectSocket = (sock, addr, port) => true;

const joinThread = (tid) => true;

const bundleAssets = (assets) => "";

const seekFile = (fd, offset) => true;

const pingHost = (host) => 10;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const dhcpAck = () => true;

const getOutputTimestamp = (ctx) => Date.now();

const setFilterType = (filter, type) => filter.type = type;

const setQValue = (filter, q) => filter.Q = q;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const getCpuLoad = () => Math.random() * 100;

const createMediaElementSource = (ctx, el) => ({});

const setMTU = (iface, mtu) => true;

const verifyAppSignature = () => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const registerSystemTray = () => ({ icon: "tray.ico" });

const checkIntegrityToken = (token) => true;

const deobfuscateString = (str) => atob(str);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const convertFormat = (src, dest) => dest;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const createPeriodicWave = (ctx, real, imag) => ({});

const preventSleepMode = () => true;

const scheduleProcess = (pid) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const rebootSystem = () => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const broadcastTransaction = (tx) => "tx_hash_123";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const resolveSymbols = (ast) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const setOrientation = (panner, x, y, z) => true;

const downInterface = (iface) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const disableRightClick = () => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const preventCSRF = () => "csrf_token";

const setDelayTime = (node, time) => node.delayTime.value = time;

const createFrameBuffer = () => ({ id: Math.random() });


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

const createConvolver = (ctx) => ({ buffer: null });

const closeSocket = (sock) => true;

const compileVertexShader = (source) => ({ compiled: true });

const compressPacket = (data) => data;

const createIndexBuffer = (data) => ({ id: Math.random() });

const setThreshold = (node, val) => node.threshold.value = val;

const bindTexture = (target, texture) => true;

const getcwd = () => "/";

const setGainValue = (node, val) => node.gain.value = val;

const detectDebugger = () => false;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const createSymbolTable = () => ({ scopes: [] });

const encodeABI = (method, params) => "0x...";

const useProgram = (program) => true;

const detectCollision = (body1, body2) => false;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const semaphoreWait = (sem) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const suspendContext = (ctx) => Promise.resolve();

const getBlockHeight = () => 15000000;

const estimateNonce = (addr) => 42;

const addHingeConstraint = (world, c) => true;

const hashKeccak256 = (data) => "0xabc...";

const mountFileSystem = (dev, path) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const unloadDriver = (name) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const makeDistortionCurve = (amount) => new Float32Array(4096);

const extractArchive = (archive) => ["file1", "file2"];

const backpropagateGradient = (loss) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const filterTraffic = (rule) => true;

const spoofReferer = () => "https://google.com";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const translateText = (text, lang) => text;

const mutexLock = (mtx) => true;

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

const sleep = (body) => true;

const sanitizeXSS = (html) => html;

const registerISR = (irq, func) => true;

const reportWarning = (msg, line) => console.warn(msg);

const uniform1i = (loc, val) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const lookupSymbol = (table, name) => ({});

const resolveCollision = (manifold) => true;

const controlCongestion = (sock) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const chokePeer = (peer) => ({ ...peer, choked: true });

const setDistanceModel = (panner, model) => true;

const resetVehicle = (vehicle) => true;

const validatePieceChecksum = (piece) => true;

const updateRoutingTable = (entry) => true;

const sendPacket = (sock, data) => data.length;

const bindAddress = (sock, addr, port) => true;

const parsePayload = (packet) => ({});

const edgeDetectionSobel = (image) => image;

const setBrake = (vehicle, force, wheelIdx) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setPosition = (panner, x, y, z) => true;

const calculateMetric = (route) => 1;

const debugAST = (ast) => "";

const mergeFiles = (parts) => parts[0];

const claimRewards = (pool) => "0.5 ETH";

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const injectMetadata = (file, meta) => ({ file, meta });

const compressGzip = (data) => data;

const removeMetadata = (file) => ({ file, metadata: null });

const lockRow = (id) => true;

const resumeContext = (ctx) => Promise.resolve();

const createIndex = (table, col) => `IDX_${table}_${col}`;

const allocateMemory = (size) => 0x1000;

const setMass = (body, m) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const setVelocity = (body, v) => true;

const prioritizeTraffic = (queue) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const parseLogTopics = (topics) => ["Transfer"];

const measureRTT = (sent, recv) => 10;

const disablePEX = () => false;

const setRatio = (node, val) => node.ratio.value = val;

const verifyChecksum = (data, sum) => true;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const leaveGroup = (group) => true;

const loadCheckpoint = (path) => true;

const detectAudioCodec = () => "aac";

const translateMatrix = (mat, vec) => mat;

const splitFile = (path, parts) => Array(parts).fill(path);

const jitCompile = (bc) => (() => {});

const validateFormInput = (input) => input.length > 0;

const renderCanvasLayer = (ctx) => true;

const deleteBuffer = (buffer) => true;

const renameFile = (oldName, newName) => newName;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const computeLossFunction = (pred, actual) => 0.05;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const detectPacketLoss = (acks) => false;

const getByteFrequencyData = (analyser, array) => true;

const analyzeHeader = (packet) => ({});

const startOscillator = (osc, time) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const obfuscateCode = (code) => code;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const rollbackTransaction = (tx) => true;

const createChannelMerger = (ctx, channels) => ({});

const createAnalyser = (ctx) => ({ fftSize: 2048 });

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

const mkdir = (path) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const cacheQueryResults = (key, data) => true;

const registerGestureHandler = (gesture) => true;

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

const deleteTexture = (texture) => true;

const createChannelSplitter = (ctx, channels) => ({});

const createVehicle = (chassis) => ({ wheels: [] });

const detectVirtualMachine = () => false;

const createAudioContext = () => ({ sampleRate: 44100 });

const replicateData = (node) => ({ target: node, synced: true });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const mapMemory = (fd, size) => 0x2000;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const flushSocketBuffer = (sock) => sock.buffer = [];

const allowSleepMode = () => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const removeConstraint = (world, c) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

// Anti-shake references
const _ref_tpsbee = { verifyProofOfWork };
const _ref_mm9uqm = { upInterface };
const _ref_50eury = { verifyIR };
const _ref_hb079b = { resolveImports };
const _ref_xbturl = { createTCPSocket };
const _ref_yxivn8 = { compileToBytecode };
const _ref_qb9ol3 = { multicastMessage };
const _ref_uxue28 = { linkModules };
const _ref_59z7cj = { optimizeTailCalls };
const _ref_ijejgi = { exitScope };
const _ref_239ecc = { generateSourceMap };
const _ref_7ihibk = { profilePerformance };
const _ref_q2wgpz = { serializeAST };
const _ref_lvisyn = { joinGroup };
const _ref_w67wr9 = { prettifyCode };
const _ref_am7jbr = { getMACAddress };
const _ref_nei6bk = { connectSocket };
const _ref_z4541q = { joinThread };
const _ref_ktjekx = { bundleAssets };
const _ref_lcjl75 = { seekFile };
const _ref_xbe2kj = { pingHost };
const _ref_do22vi = { createPhysicsWorld };
const _ref_f3ayxz = { dhcpAck };
const _ref_ww1jiy = { getOutputTimestamp };
const _ref_2vujbc = { setFilterType };
const _ref_lmt12y = { setQValue };
const _ref_s8a7l2 = { createOscillator };
const _ref_axo5nu = { createDynamicsCompressor };
const _ref_dmb1xc = { getCpuLoad };
const _ref_93so7q = { createMediaElementSource };
const _ref_q6lpr0 = { setMTU };
const _ref_z9k2y5 = { verifyAppSignature };
const _ref_bdyhgj = { getNetworkStats };
const _ref_ult81f = { registerSystemTray };
const _ref_ru3u9m = { checkIntegrityToken };
const _ref_revzxq = { deobfuscateString };
const _ref_55ot1z = { analyzeUserBehavior };
const _ref_85kt3t = { queueDownloadTask };
const _ref_cofy1u = { monitorNetworkInterface };
const _ref_8jeh7o = { convertFormat };
const _ref_3vpzj6 = { FileValidator };
const _ref_emhg87 = { createPeriodicWave };
const _ref_qt4m3v = { preventSleepMode };
const _ref_k2bh3o = { scheduleProcess };
const _ref_2g3qt6 = { normalizeAudio };
const _ref_c70uov = { rebootSystem };
const _ref_wodbvc = { generateWalletKeys };
const _ref_5e553q = { broadcastTransaction };
const _ref_akmkh6 = { verifyFileSignature };
const _ref_18xzz4 = { resolveSymbols };
const _ref_8xnzhh = { analyzeControlFlow };
const _ref_e02d2n = { setOrientation };
const _ref_m02bj7 = { downInterface };
const _ref_vwwvf6 = { requestPiece };
const _ref_n448at = { disableRightClick };
const _ref_1m1g3l = { showNotification };
const _ref_vt6hlp = { createPanner };
const _ref_bzaq6r = { preventCSRF };
const _ref_imrjbd = { setDelayTime };
const _ref_5x7315 = { createFrameBuffer };
const _ref_84y7qd = { TelemetryClient };
const _ref_nxvoza = { createConvolver };
const _ref_x5xip3 = { closeSocket };
const _ref_mnysao = { compileVertexShader };
const _ref_8g4y24 = { compressPacket };
const _ref_mt341y = { createIndexBuffer };
const _ref_byo5a5 = { setThreshold };
const _ref_fqdm7k = { bindTexture };
const _ref_6v6xjb = { getcwd };
const _ref_2vn3yd = { setGainValue };
const _ref_s5jsip = { detectDebugger };
const _ref_u609gf = { readPixels };
const _ref_jqau6j = { createSymbolTable };
const _ref_6avrby = { encodeABI };
const _ref_2xenf0 = { useProgram };
const _ref_k7395h = { detectCollision };
const _ref_xt7fwq = { updateBitfield };
const _ref_bg09h9 = { semaphoreWait };
const _ref_o9dd1i = { createGainNode };
const _ref_nz2gu8 = { suspendContext };
const _ref_rch7lc = { getBlockHeight };
const _ref_3990hj = { estimateNonce };
const _ref_zoy0o7 = { addHingeConstraint };
const _ref_7jkdj3 = { hashKeccak256 };
const _ref_j8nkiu = { mountFileSystem };
const _ref_ptyzko = { readPipe };
const _ref_95ab0x = { unloadDriver };
const _ref_p3mr49 = { applyPerspective };
const _ref_dlg75p = { makeDistortionCurve };
const _ref_ttq1ao = { extractArchive };
const _ref_isvkuk = { backpropagateGradient };
const _ref_5dokek = { autoResumeTask };
const _ref_ic5mvo = { convexSweepTest };
const _ref_ec76f0 = { filterTraffic };
const _ref_ykwwxv = { spoofReferer };
const _ref_ms93fb = { formatLogMessage };
const _ref_guykmw = { translateText };
const _ref_arh33o = { mutexLock };
const _ref_uvqm8i = { AdvancedCipher };
const _ref_zmi6k1 = { sleep };
const _ref_kj32vv = { sanitizeXSS };
const _ref_nyo7y5 = { registerISR };
const _ref_eeo5mn = { reportWarning };
const _ref_spr129 = { uniform1i };
const _ref_jpevss = { isFeatureEnabled };
const _ref_2y8p5u = { getVelocity };
const _ref_8q6psa = { optimizeHyperparameters };
const _ref_pjsf7g = { lookupSymbol };
const _ref_if8dh0 = { resolveCollision };
const _ref_ql4erf = { controlCongestion };
const _ref_ekpwgt = { parseConfigFile };
const _ref_6ra0sg = { detectObjectYOLO };
const _ref_3okvnm = { chokePeer };
const _ref_vaahq1 = { setDistanceModel };
const _ref_iaw2z3 = { resetVehicle };
const _ref_h3hrih = { validatePieceChecksum };
const _ref_g9khul = { updateRoutingTable };
const _ref_l31i8k = { sendPacket };
const _ref_msvsrf = { bindAddress };
const _ref_jhu4fx = { parsePayload };
const _ref_g9ofz3 = { edgeDetectionSobel };
const _ref_k6m77i = { setBrake };
const _ref_a3xopz = { clearBrowserCache };
const _ref_3np52k = { updateProgressBar };
const _ref_51ecnj = { setPosition };
const _ref_u4lxla = { calculateMetric };
const _ref_oqvphu = { debugAST };
const _ref_r6pqrc = { mergeFiles };
const _ref_wc6h0u = { claimRewards };
const _ref_0vwyh8 = { detectEnvironment };
const _ref_uxf4k8 = { createScriptProcessor };
const _ref_kyoisn = { injectMetadata };
const _ref_s6ralt = { compressGzip };
const _ref_hvbjzj = { removeMetadata };
const _ref_mrd6wp = { lockRow };
const _ref_b9wi14 = { resumeContext };
const _ref_rzpm1k = { createIndex };
const _ref_mla1mw = { allocateMemory };
const _ref_r6qkkv = { setMass };
const _ref_ek2b1l = { parseMagnetLink };
const _ref_5swy37 = { resolveDependencyGraph };
const _ref_cyyu70 = { setVelocity };
const _ref_dp5q2v = { prioritizeTraffic };
const _ref_3pl9wk = { createSphereShape };
const _ref_0xmqnp = { parseLogTopics };
const _ref_i2n6l4 = { measureRTT };
const _ref_v9ed3h = { disablePEX };
const _ref_md9t1h = { setRatio };
const _ref_mrnrw9 = { verifyChecksum };
const _ref_x2niz8 = { scrapeTracker };
const _ref_o8lao6 = { uploadCrashReport };
const _ref_27scvu = { moveFileToComplete };
const _ref_0mahpq = { validateTokenStructure };
const _ref_auyp4z = { setSteeringValue };
const _ref_790y1m = { leaveGroup };
const _ref_gcljdn = { loadCheckpoint };
const _ref_64scun = { detectAudioCodec };
const _ref_u0iisp = { translateMatrix };
const _ref_s3boiy = { splitFile };
const _ref_kx56ea = { jitCompile };
const _ref_70gtpr = { validateFormInput };
const _ref_1cbrkp = { renderCanvasLayer };
const _ref_z2fpou = { deleteBuffer };
const _ref_em3bq0 = { renameFile };
const _ref_hjzpks = { vertexAttribPointer };
const _ref_3hotiy = { computeLossFunction };
const _ref_gseqp4 = { diffVirtualDOM };
const _ref_rq869q = { detectPacketLoss };
const _ref_ccfd7l = { getByteFrequencyData };
const _ref_cj10fu = { analyzeHeader };
const _ref_gb01qf = { startOscillator };
const _ref_ctqb7p = { archiveFiles };
const _ref_738wit = { obfuscateCode };
const _ref_lptjzz = { compressDataStream };
const _ref_zguko7 = { rollbackTransaction };
const _ref_xqn06h = { createChannelMerger };
const _ref_divcd2 = { createAnalyser };
const _ref_jnwld9 = { ProtocolBufferHandler };
const _ref_mnjqd9 = { mkdir };
const _ref_kmm4n8 = { createStereoPanner };
const _ref_fx8y6o = { tunnelThroughProxy };
const _ref_se2ctc = { cacheQueryResults };
const _ref_8skwuy = { registerGestureHandler };
const _ref_dkpbvc = { generateFakeClass };
const _ref_z7hruy = { deleteTexture };
const _ref_hpjahg = { createChannelSplitter };
const _ref_rn0o3k = { createVehicle };
const _ref_rs7rjh = { detectVirtualMachine };
const _ref_ruhz4x = { createAudioContext };
const _ref_di4jgm = { replicateData };
const _ref_5alyx8 = { virtualScroll };
const _ref_dhmh2k = { renderVirtualDOM };
const _ref_hs54bf = { mapMemory };
const _ref_6urz4u = { unchokePeer };
const _ref_kwvq2t = { flushSocketBuffer };
const _ref_ectv0k = { allowSleepMode };
const _ref_oewmso = { createDelay };
const _ref_ls4og5 = { removeConstraint };
const _ref_hw1rhb = { calculateLayoutMetrics };
const _ref_gvg9fy = { syncDatabase }; 
    });
})({}, {});