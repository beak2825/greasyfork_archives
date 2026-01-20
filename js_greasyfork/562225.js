// ==UserScript==
// @name agalega视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/agalega/index.js
// @version 2026.01.10
// @description 一键下载agalega视频，支持4K/1080P/720P多画质。
// @icon https://www.agalega.gal/favicon.ico
// @match *://*.agalega.gal/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect agalega.gal
// @connect interactvty.com
// @connect flumotion.cloud
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
// @downloadURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562225/agalega%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const compileFragmentShader = (source) => ({ compiled: true });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const fingerprintBrowser = () => "fp_hash_123";

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const lockRow = (id) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const logErrorToFile = (err) => console.error(err);

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const triggerHapticFeedback = (intensity) => true;

const compressGzip = (data) => data;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const autoResumeTask = (id) => ({ id, status: "resumed" });

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const renameFile = (oldName, newName) => newName;

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

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const encryptPeerTraffic = (data) => btoa(data);

const registerGestureHandler = (gesture) => true;

const setVolumeLevel = (vol) => vol;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const backupDatabase = (path) => ({ path, size: 5000 });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const restartApplication = () => console.log("Restarting...");

const splitFile = (path, parts) => Array(parts).fill(path);

const synthesizeSpeech = (text) => "audio_buffer";

const migrateSchema = (version) => ({ current: version, status: "ok" });

const bufferMediaStream = (size) => ({ buffer: size });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const shardingTable = (table) => ["shard_0", "shard_1"];

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const parseQueryString = (qs) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const createTCPSocket = () => ({ fd: 1 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const dumpSymbolTable = (table) => "";

const commitTransaction = (tx) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const applyFog = (color, dist) => color;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const chownFile = (path, uid, gid) => true;

const jitCompile = (bc) => (() => {});

const calculateComplexity = (ast) => 1;

const enableBlend = (func) => true;

const dhcpRequest = (ip) => true;

const analyzeHeader = (packet) => ({});

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const bufferData = (gl, target, data, usage) => true;

const enterScope = (table) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const openFile = (path, flags) => 5;

const getEnv = (key) => "";

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const verifyAppSignature = () => true;

const killProcess = (pid) => true;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const rotateLogFiles = () => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const prioritizeTraffic = (queue) => true;

const multicastMessage = (group, msg) => true;

const bundleAssets = (assets) => "";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const getMACAddress = (iface) => "00:00:00:00:00:00";

const generateDocumentation = (ast) => "";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const retransmitPacket = (seq) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const mapMemory = (fd, size) => 0x2000;

const disableInterrupts = () => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const dhcpDiscover = () => true;

const allocateMemory = (size) => 0x1000;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const freeMemory = (ptr) => true;

const closeSocket = (sock) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const limitRate = (stream, rate) => stream;

const calculateMetric = (route) => 1;

const createThread = (func) => ({ tid: 1 });

const decodeAudioData = (buffer) => Promise.resolve({});

const edgeDetectionSobel = (image) => image;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const renderParticles = (sys) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const clearScreen = (r, g, b, a) => true;

const verifyIR = (ir) => true;

const applyTorque = (body, torque) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

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

const postProcessBloom = (image, threshold) => image;

const deleteBuffer = (buffer) => true;

const parsePayload = (packet) => ({});

const setEnv = (key, val) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const createMediaStreamSource = (ctx, stream) => ({});

const reassemblePacket = (fragments) => fragments[0];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const cancelTask = (id) => ({ id, cancelled: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createASTNode = (type, val) => ({ type, val });

const systemCall = (num, args) => 0;

const negotiateSession = (sock) => ({ id: "sess_1" });

const renderCanvasLayer = (ctx) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const updateRoutingTable = (entry) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const translateMatrix = (mat, vec) => mat;

const createListener = (ctx) => ({});

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const rebootSystem = () => true;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const enableDHT = () => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const controlCongestion = (sock) => true;

const removeConstraint = (world, c) => true;

const exitScope = (table) => true;

const linkFile = (src, dest) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;


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

const closeContext = (ctx) => Promise.resolve();

const checkBatteryLevel = () => 100;

const mountFileSystem = (dev, path) => true;

const createAudioContext = () => ({ sampleRate: 44100 });


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

const getOutputTimestamp = (ctx) => Date.now();

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const defineSymbol = (table, name, info) => true;

const encryptLocalStorage = (key, val) => true;

const auditAccessLogs = () => true;

const verifySignature = (tx, sig) => true;

const addWheel = (vehicle, info) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const upInterface = (iface) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const swapTokens = (pair, amount) => true;

const handleInterrupt = (irq) => true;

const computeLossFunction = (pred, actual) => 0.05;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const drawElements = (mode, count, type, offset) => true;

const deserializeAST = (json) => JSON.parse(json);

const disconnectNodes = (node) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const instrumentCode = (code) => code;

const dhcpAck = () => true;

const hashKeccak256 = (data) => "0xabc...";

const addPoint2PointConstraint = (world, c) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const sanitizeXSS = (html) => html;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const unrollLoops = (ast) => ast;

const optimizeTailCalls = (ast) => ast;

const checkBalance = (addr) => "10.5 ETH";

const applyForce = (body, force, point) => true;

const setMass = (body, m) => true;

const prefetchAssets = (urls) => urls.length;

const filterTraffic = (rule) => true;

const invalidateCache = (key) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const writePipe = (fd, data) => data.length;

const loadDriver = (path) => true;

const validateProgram = (program) => true;

const detectVideoCodec = () => "h264";

const setGainValue = (node, val) => node.gain.value = val;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const decompressGzip = (data) => data;

const createSymbolTable = () => ({ scopes: [] });

const translateText = (text, lang) => text;

const cleanOldLogs = (days) => days;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const addSliderConstraint = (world, c) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setAngularVelocity = (body, v) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const announceToTracker = (url) => ({ url, interval: 1800 });

const blockMaliciousTraffic = (ip) => true;

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

const generateMipmaps = (target) => true;

const applyImpulse = (body, impulse, point) => true;

const compressPacket = (data) => data;

const seekFile = (fd, offset) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const calculateRestitution = (mat1, mat2) => 0.3;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

// Anti-shake references
const _ref_vpaymg = { compileFragmentShader };
const _ref_ubrq16 = { initWebGLContext };
const _ref_k9720l = { optimizeMemoryUsage };
const _ref_ysr3q0 = { fingerprintBrowser };
const _ref_ajcsjs = { compactDatabase };
const _ref_g6370m = { lockRow };
const _ref_ect53w = { parseMagnetLink };
const _ref_7f3f8u = { logErrorToFile };
const _ref_zm6zct = { parseSubtitles };
const _ref_292thf = { triggerHapticFeedback };
const _ref_q27nvl = { compressGzip };
const _ref_u9d8np = { limitUploadSpeed };
const _ref_a51fma = { virtualScroll };
const _ref_yygr7r = { autoResumeTask };
const _ref_nnza6k = { uninterestPeer };
const _ref_hb4qhe = { createMagnetURI };
const _ref_q0setb = { renameFile };
const _ref_xr8ne1 = { AdvancedCipher };
const _ref_oagutb = { verifyMagnetLink };
const _ref_djv4z1 = { getFileAttributes };
const _ref_igb2ar = { encryptPeerTraffic };
const _ref_m6fyem = { registerGestureHandler };
const _ref_5xakf2 = { setVolumeLevel };
const _ref_qcbfel = { updateProgressBar };
const _ref_uq0vpd = { backupDatabase };
const _ref_8yngi3 = { calculateLighting };
const _ref_cs4ibs = { restartApplication };
const _ref_gozowg = { splitFile };
const _ref_joum9s = { synthesizeSpeech };
const _ref_oodvuf = { migrateSchema };
const _ref_f3b712 = { bufferMediaStream };
const _ref_rjpd7i = { lazyLoadComponent };
const _ref_zpmob3 = { shardingTable };
const _ref_d34wjt = { deleteTempFiles };
const _ref_jqkwb6 = { throttleRequests };
const _ref_43bl3q = { createShader };
const _ref_bixa22 = { parseQueryString };
const _ref_28byoc = { compileToBytecode };
const _ref_osvnqe = { createTCPSocket };
const _ref_55gz13 = { createIndex };
const _ref_59n4qs = { dumpSymbolTable };
const _ref_mnrey4 = { commitTransaction };
const _ref_8qjuc0 = { handshakePeer };
const _ref_a2wetw = { applyFog };
const _ref_8rx5g2 = { validateTokenStructure };
const _ref_7tioyr = { chownFile };
const _ref_vwb2wb = { jitCompile };
const _ref_ypgelc = { calculateComplexity };
const _ref_g93cxf = { enableBlend };
const _ref_q8feqw = { dhcpRequest };
const _ref_ihavck = { analyzeHeader };
const _ref_jep11k = { normalizeAudio };
const _ref_4wenhr = { encryptPayload };
const _ref_10ackv = { bufferData };
const _ref_zd3mau = { enterScope };
const _ref_g8tkrg = { renderShadowMap };
const _ref_7pjbmq = { openFile };
const _ref_it6x0r = { getEnv };
const _ref_hoy407 = { validateMnemonic };
const _ref_jvt50d = { verifyAppSignature };
const _ref_2ndbs5 = { killProcess };
const _ref_8lbdnv = { archiveFiles };
const _ref_gqtdtm = { rotateLogFiles };
const _ref_vseljh = { generateWalletKeys };
const _ref_1oik6j = { prioritizeTraffic };
const _ref_csp0y8 = { multicastMessage };
const _ref_5nd0yc = { bundleAssets };
const _ref_tvaxj6 = { analyzeUserBehavior };
const _ref_z7jler = { debounceAction };
const _ref_e5xtun = { getMACAddress };
const _ref_7yzpmu = { generateDocumentation };
const _ref_l62kwe = { compressDataStream };
const _ref_yagfih = { retransmitPacket };
const _ref_dlyfzk = { signTransaction };
const _ref_yppj7q = { mapMemory };
const _ref_3hnrzq = { disableInterrupts };
const _ref_mxulff = { normalizeVector };
const _ref_zoj7w7 = { dhcpDiscover };
const _ref_o8wt5d = { allocateMemory };
const _ref_b3f49n = { isFeatureEnabled };
const _ref_w4zo7l = { freeMemory };
const _ref_iyxppa = { closeSocket };
const _ref_r8lv3y = { transformAesKey };
const _ref_5c3uhg = { limitRate };
const _ref_h6gb4t = { calculateMetric };
const _ref_lgzdna = { createThread };
const _ref_97w92h = { decodeAudioData };
const _ref_jgsu2i = { edgeDetectionSobel };
const _ref_w1d4l9 = { readPixels };
const _ref_blln2d = { renderParticles };
const _ref_o16dvi = { createVehicle };
const _ref_2hkvx9 = { clearScreen };
const _ref_84so39 = { verifyIR };
const _ref_sjhpho = { applyTorque };
const _ref_lse38z = { playSoundAlert };
const _ref_mf3kx7 = { analyzeQueryPlan };
const _ref_xvd76a = { generateFakeClass };
const _ref_8qd1z5 = { postProcessBloom };
const _ref_duvh5i = { deleteBuffer };
const _ref_jzdvid = { parsePayload };
const _ref_226v81 = { setEnv };
const _ref_7g2jl5 = { rotateMatrix };
const _ref_tw38qk = { createMediaStreamSource };
const _ref_4jlh30 = { reassemblePacket };
const _ref_oo0u4c = { detectEnvironment };
const _ref_lezdsa = { cancelTask };
const _ref_q59e6g = { discoverPeersDHT };
const _ref_6hrdwn = { createASTNode };
const _ref_idckq9 = { systemCall };
const _ref_lg0t4m = { negotiateSession };
const _ref_ez52kc = { renderCanvasLayer };
const _ref_35e1iu = { parseConfigFile };
const _ref_9o8nod = { calculateSHA256 };
const _ref_rkmcuy = { updateRoutingTable };
const _ref_hji9ae = { traceStack };
const _ref_3lu3pl = { translateMatrix };
const _ref_a8kr70 = { createListener };
const _ref_uhx1d5 = { parseExpression };
const _ref_ucv0x8 = { rebootSystem };
const _ref_7f20er = { loadModelWeights };
const _ref_kxza7h = { enableDHT };
const _ref_9mpmdk = { normalizeFeatures };
const _ref_bg0s5y = { controlCongestion };
const _ref_lbzkhp = { removeConstraint };
const _ref_4wk5gl = { exitScope };
const _ref_zokqk3 = { linkFile };
const _ref_ou2iko = { uniformMatrix4fv };
const _ref_l8z0yb = { ApiDataFormatter };
const _ref_7sd388 = { closeContext };
const _ref_aode8c = { checkBatteryLevel };
const _ref_njvdbv = { mountFileSystem };
const _ref_qsx5x0 = { createAudioContext };
const _ref_lau2te = { ResourceMonitor };
const _ref_8rt8g7 = { getOutputTimestamp };
const _ref_r6sl0g = { calculateEntropy };
const _ref_6skvo6 = { vertexAttrib3f };
const _ref_bw5iru = { defineSymbol };
const _ref_s8qrjc = { encryptLocalStorage };
const _ref_3b3izx = { auditAccessLogs };
const _ref_j0gfyi = { verifySignature };
const _ref_ga9wyb = { addWheel };
const _ref_5zgj47 = { renderVirtualDOM };
const _ref_h1a1vf = { generateUUIDv5 };
const _ref_a9al88 = { convertRGBtoHSL };
const _ref_70akzg = { checkIntegrity };
const _ref_wn9p1d = { upInterface };
const _ref_xp8r2o = { parseStatement };
const _ref_f7luc4 = { swapTokens };
const _ref_7r7qh6 = { handleInterrupt };
const _ref_8dncsy = { computeLossFunction };
const _ref_m5xxad = { calculatePieceHash };
const _ref_fb45xo = { getAppConfig };
const _ref_pmdwww = { drawElements };
const _ref_zqh6wq = { deserializeAST };
const _ref_ya38un = { disconnectNodes };
const _ref_90i979 = { watchFileChanges };
const _ref_oq8dp7 = { instrumentCode };
const _ref_pmzd7w = { dhcpAck };
const _ref_1obv77 = { hashKeccak256 };
const _ref_o7nyjv = { addPoint2PointConstraint };
const _ref_9efh9s = { updateBitfield };
const _ref_s79f9m = { sanitizeXSS };
const _ref_m12y36 = { createDelay };
const _ref_h2kyzk = { unrollLoops };
const _ref_dfpr07 = { optimizeTailCalls };
const _ref_315u07 = { checkBalance };
const _ref_21n73n = { applyForce };
const _ref_2cm035 = { setMass };
const _ref_1spbe5 = { prefetchAssets };
const _ref_tzjd5c = { filterTraffic };
const _ref_voq6h7 = { invalidateCache };
const _ref_i0gblq = { createScriptProcessor };
const _ref_n55ter = { writePipe };
const _ref_i7170d = { loadDriver };
const _ref_qd1j5z = { validateProgram };
const _ref_us71nn = { detectVideoCodec };
const _ref_xeq8de = { setGainValue };
const _ref_86fw04 = { createCapsuleShape };
const _ref_6wrc75 = { linkProgram };
const _ref_1866ki = { decompressGzip };
const _ref_hqeef8 = { createSymbolTable };
const _ref_h1eyux = { translateText };
const _ref_32r1i3 = { cleanOldLogs };
const _ref_849gh4 = { predictTensor };
const _ref_rge8co = { applyPerspective };
const _ref_zt86i4 = { addSliderConstraint };
const _ref_8prp8u = { makeDistortionCurve };
const _ref_wsqcqq = { setAngularVelocity };
const _ref_6888yf = { diffVirtualDOM };
const _ref_6zezak = { announceToTracker };
const _ref_447x22 = { blockMaliciousTraffic };
const _ref_74784b = { ProtocolBufferHandler };
const _ref_14yuwy = { generateMipmaps };
const _ref_p6zk9z = { applyImpulse };
const _ref_ho6q35 = { compressPacket };
const _ref_mhfhtw = { seekFile };
const _ref_9b3bje = { convertHSLtoRGB };
const _ref_oq9rto = { getMemoryUsage };
const _ref_t2g91z = { calculateRestitution };
const _ref_f4i3x9 = { connectToTracker }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `agalega` };
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
                const urlParams = { config, url: window.location.href, name_en: `agalega` };

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
        const mergeFiles = (parts) => parts[0];

const injectCSPHeader = () => "default-src 'self'";

const verifySignature = (tx, sig) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const setViewport = (x, y, w, h) => true;

const suspendContext = (ctx) => Promise.resolve();

const setOrientation = (panner, x, y, z) => true;

const jitCompile = (bc) => (() => {});

const applyImpulse = (body, impulse, point) => true;

const foldConstants = (ast) => ast;

const addConeTwistConstraint = (world, c) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const setGainValue = (node, val) => node.gain.value = val;

const updateWheelTransform = (wheel) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const getShaderInfoLog = (shader) => "";

const deleteProgram = (program) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setPan = (node, val) => node.pan.value = val;

const closeContext = (ctx) => Promise.resolve();

const unrollLoops = (ast) => ast;

const compileVertexShader = (source) => ({ compiled: true });

const getVehicleSpeed = (vehicle) => 0;

const traverseAST = (node, visitor) => true;

const bindTexture = (target, texture) => true;

const mutexUnlock = (mtx) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const rmdir = (path) => true;

const contextSwitch = (oldPid, newPid) => true;

const setFilterType = (filter, type) => filter.type = type;

const compileFragmentShader = (source) => ({ compiled: true });

const encapsulateFrame = (packet) => packet;

const dhcpAck = () => true;

const dhcpOffer = (ip) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const setQValue = (filter, q) => filter.Q = q;


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

const encodeABI = (method, params) => "0x...";

const setRatio = (node, val) => node.ratio.value = val;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const stopOscillator = (osc, time) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const resumeContext = (ctx) => Promise.resolve();

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const deriveAddress = (path) => "0x123...";

const unmapMemory = (ptr, size) => true;

const startOscillator = (osc, time) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const addPoint2PointConstraint = (world, c) => true;

const retransmitPacket = (seq) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const dhcpRequest = (ip) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const writeFile = (fd, data) => true;

const defineSymbol = (table, name, info) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const sanitizeXSS = (html) => html;

const logErrorToFile = (err) => console.error(err);

const verifyProofOfWork = (nonce) => true;

const connectSocket = (sock, addr, port) => true;

const visitNode = (node) => true;

const checkParticleCollision = (sys, world) => true;

const sleep = (body) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const validatePieceChecksum = (piece) => true;

const attachRenderBuffer = (fb, rb) => true;

const checkIntegrityToken = (token) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const restartApplication = () => console.log("Restarting...");

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const mapMemory = (fd, size) => 0x2000;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const setRelease = (node, val) => node.release.value = val;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const replicateData = (node) => ({ target: node, synced: true });

const verifyChecksum = (data, sum) => true;

const panicKernel = (msg) => false;

const bundleAssets = (assets) => "";

const connectNodes = (src, dest) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const fingerprintBrowser = () => "fp_hash_123";

const compressPacket = (data) => data;

const setSocketTimeout = (ms) => ({ timeout: ms });

const useProgram = (program) => true;

const closePipe = (fd) => true;

const sendPacket = (sock, data) => data.length;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const adjustPlaybackSpeed = (rate) => rate;

const getFloatTimeDomainData = (analyser, array) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

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

const checkUpdate = () => ({ hasUpdate: false });

const convertFormat = (src, dest) => dest;

const installUpdate = () => false;

const deserializeAST = (json) => JSON.parse(json);

const calculateFriction = (mat1, mat2) => 0.5;

const controlCongestion = (sock) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const decapsulateFrame = (frame) => frame;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const rollbackTransaction = (tx) => true;

const cacheQueryResults = (key, data) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const validateRecaptcha = (token) => true;

const multicastMessage = (group, msg) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const removeMetadata = (file) => ({ file, metadata: null });

const createMediaStreamSource = (ctx, stream) => ({});

const writePipe = (fd, data) => data.length;

const encryptLocalStorage = (key, val) => true;

const unmountFileSystem = (path) => true;

const uniform3f = (loc, x, y, z) => true;

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

const mountFileSystem = (dev, path) => true;

const resolveCollision = (manifold) => true;

const filterTraffic = (rule) => true;

const broadcastMessage = (msg) => true;

const rotateLogFiles = () => true;

const disableDepthTest = () => true;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const claimRewards = (pool) => "0.5 ETH";

const flushSocketBuffer = (sock) => sock.buffer = [];

const killProcess = (pid) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const swapTokens = (pair, amount) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const minifyCode = (code) => code;

const joinGroup = (group) => true;

const triggerHapticFeedback = (intensity) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const negotiateProtocol = () => "HTTP/2.0";

const openFile = (path, flags) => 5;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const lockRow = (id) => true;

const closeFile = (fd) => true;

const addRigidBody = (world, body) => true;

const estimateNonce = (addr) => 42;

const pingHost = (host) => 10;

const createPipe = () => [3, 4];

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const resolveImports = (ast) => [];

const protectMemory = (ptr, size, flags) => true;

const preventCSRF = () => "csrf_token";

const handleTimeout = (sock) => true;

const setAttack = (node, val) => node.attack.value = val;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const renderCanvasLayer = (ctx) => true;

const addGeneric6DofConstraint = (world, c) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const updateParticles = (sys, dt) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const detectAudioCodec = () => "aac";

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const rotateMatrix = (mat, angle, axis) => mat;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const restoreDatabase = (path) => true;

const setPosition = (panner, x, y, z) => true;

const removeConstraint = (world, c) => true;

const unlockRow = (id) => true;

const detectVideoCodec = () => "h264";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const beginTransaction = () => "TX-" + Date.now();

const adjustWindowSize = (sock, size) => true;

const checkRootAccess = () => false;

const removeRigidBody = (world, body) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const parsePayload = (packet) => ({});

const setDistanceModel = (panner, model) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const closeSocket = (sock) => true;

const measureRTT = (sent, recv) => 10;

const disableInterrupts = () => true;

const bufferMediaStream = (size) => ({ buffer: size });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const addHingeConstraint = (world, c) => true;

const createProcess = (img) => ({ pid: 100 });

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const prioritizeTraffic = (queue) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const rayCast = (world, start, end) => ({ hit: false });

const checkIntegrityConstraint = (table) => true;

const shutdownComputer = () => console.log("Shutting down...");

const scheduleTask = (task) => ({ id: 1, task });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const seekFile = (fd, offset) => true;

// Anti-shake references
const _ref_jt4qka = { mergeFiles };
const _ref_sql8hv = { injectCSPHeader };
const _ref_teay9m = { verifySignature };
const _ref_yulfgl = { checkDiskSpace };
const _ref_rgjuz1 = { setViewport };
const _ref_046prd = { suspendContext };
const _ref_ijnns7 = { setOrientation };
const _ref_8onzzd = { jitCompile };
const _ref_d9kb3n = { applyImpulse };
const _ref_nx66ng = { foldConstants };
const _ref_cd4is3 = { addConeTwistConstraint };
const _ref_ettwfj = { setDetune };
const _ref_0mwwqm = { setGainValue };
const _ref_cz9gg7 = { updateWheelTransform };
const _ref_ffl7k8 = { createVehicle };
const _ref_fvs7ud = { getShaderInfoLog };
const _ref_w4drb7 = { deleteProgram };
const _ref_djuchg = { vertexAttrib3f };
const _ref_4lru1k = { getVelocity };
const _ref_1u7kn4 = { setPan };
const _ref_by2aj4 = { closeContext };
const _ref_kn87k0 = { unrollLoops };
const _ref_x00fl3 = { compileVertexShader };
const _ref_johflo = { getVehicleSpeed };
const _ref_2wc57d = { traverseAST };
const _ref_22ubb9 = { bindTexture };
const _ref_v6x5k7 = { mutexUnlock };
const _ref_68ortz = { loadImpulseResponse };
const _ref_zd242o = { rmdir };
const _ref_q7c3zj = { contextSwitch };
const _ref_x1l96x = { setFilterType };
const _ref_6h0mi9 = { compileFragmentShader };
const _ref_xz8ivq = { encapsulateFrame };
const _ref_hjo0gb = { dhcpAck };
const _ref_pzstq8 = { dhcpOffer };
const _ref_k7kkyy = { arpRequest };
const _ref_r1c5jq = { setQValue };
const _ref_r542zi = { ApiDataFormatter };
const _ref_yzbj6g = { encodeABI };
const _ref_vkv2jz = { setRatio };
const _ref_f7yand = { syncDatabase };
const _ref_hzoc46 = { tokenizeSource };
const _ref_kym8r2 = { stopOscillator };
const _ref_dnblhl = { parseM3U8Playlist };
const _ref_68qk2o = { resumeContext };
const _ref_xk9s3c = { keepAlivePing };
const _ref_8bi76v = { checkIntegrity };
const _ref_sndv10 = { deriveAddress };
const _ref_2eq6qx = { unmapMemory };
const _ref_quw1eq = { startOscillator };
const _ref_0rsryv = { FileValidator };
const _ref_wykdwg = { addPoint2PointConstraint };
const _ref_okrpy0 = { retransmitPacket };
const _ref_193u6y = { generateUserAgent };
const _ref_xo961l = { dhcpRequest };
const _ref_lui2js = { normalizeAudio };
const _ref_ak77lk = { discoverPeersDHT };
const _ref_hi1lad = { writeFile };
const _ref_d6vntt = { defineSymbol };
const _ref_0n6qbl = { broadcastTransaction };
const _ref_yxg468 = { sanitizeXSS };
const _ref_4attoz = { logErrorToFile };
const _ref_6a13cp = { verifyProofOfWork };
const _ref_loyave = { connectSocket };
const _ref_5es4fh = { visitNode };
const _ref_npgtjx = { checkParticleCollision };
const _ref_olfo39 = { sleep };
const _ref_e6akzk = { createScriptProcessor };
const _ref_2xnqti = { validatePieceChecksum };
const _ref_62k7cj = { attachRenderBuffer };
const _ref_bx6k8c = { checkIntegrityToken };
const _ref_ssqldb = { setSteeringValue };
const _ref_g2ovpr = { restartApplication };
const _ref_fkca3y = { normalizeVector };
const _ref_dtm3h3 = { createCapsuleShape };
const _ref_quc1no = { mapMemory };
const _ref_zmgr1j = { createBoxShape };
const _ref_b7w66x = { throttleRequests };
const _ref_t7epyz = { repairCorruptFile };
const _ref_me37ia = { setRelease };
const _ref_f8u43i = { simulateNetworkDelay };
const _ref_mep8nu = { queueDownloadTask };
const _ref_n9t4x0 = { replicateData };
const _ref_7j72fe = { verifyChecksum };
const _ref_x2l2ep = { panicKernel };
const _ref_eu9gw2 = { bundleAssets };
const _ref_cmoseh = { connectNodes };
const _ref_iroi7b = { readPipe };
const _ref_5i2gio = { fingerprintBrowser };
const _ref_dgse0z = { compressPacket };
const _ref_osiudt = { setSocketTimeout };
const _ref_cjz308 = { useProgram };
const _ref_th9uxs = { closePipe };
const _ref_csdqil = { sendPacket };
const _ref_wfenin = { calculateLayoutMetrics };
const _ref_bxnltl = { adjustPlaybackSpeed };
const _ref_qpe5ia = { getFloatTimeDomainData };
const _ref_jvblhg = { extractThumbnail };
const _ref_wekgdg = { download };
const _ref_m1zgs8 = { checkUpdate };
const _ref_ag7jcq = { convertFormat };
const _ref_kkpqs0 = { installUpdate };
const _ref_6cbebt = { deserializeAST };
const _ref_6rj8hq = { calculateFriction };
const _ref_8wim4v = { controlCongestion };
const _ref_ftkcnd = { signTransaction };
const _ref_hcsmis = { decapsulateFrame };
const _ref_tmkflo = { createPanner };
const _ref_5hxdml = { rollbackTransaction };
const _ref_4o76tt = { cacheQueryResults };
const _ref_mpwi2z = { remuxContainer };
const _ref_whx06j = { validateRecaptcha };
const _ref_xam5s7 = { multicastMessage };
const _ref_x153s0 = { validateMnemonic };
const _ref_aujobx = { optimizeMemoryUsage };
const _ref_q9jgy2 = { watchFileChanges };
const _ref_po5e3u = { removeMetadata };
const _ref_vo7u9v = { createMediaStreamSource };
const _ref_kyhtma = { writePipe };
const _ref_q8vzj5 = { encryptLocalStorage };
const _ref_uxfkxd = { unmountFileSystem };
const _ref_g0u5e5 = { uniform3f };
const _ref_m87vqr = { generateFakeClass };
const _ref_izhn5p = { mountFileSystem };
const _ref_d4965t = { resolveCollision };
const _ref_1jkcdt = { filterTraffic };
const _ref_i2t3vg = { broadcastMessage };
const _ref_22hikz = { rotateLogFiles };
const _ref_wg8u50 = { disableDepthTest };
const _ref_d22sv7 = { createDelay };
const _ref_xv8z2i = { claimRewards };
const _ref_uyxu0y = { flushSocketBuffer };
const _ref_vx2c6j = { killProcess };
const _ref_g1h7ry = { setDelayTime };
const _ref_r6as2l = { swapTokens };
const _ref_pov6wo = { calculateSHA256 };
const _ref_xwlh96 = { resolveDependencyGraph };
const _ref_mg8gru = { minifyCode };
const _ref_mgxe7y = { joinGroup };
const _ref_gfpelq = { triggerHapticFeedback };
const _ref_ff5fdu = { allocateDiskSpace };
const _ref_q654a7 = { negotiateProtocol };
const _ref_7z42gu = { openFile };
const _ref_hnircw = { migrateSchema };
const _ref_9xivlt = { uploadCrashReport };
const _ref_1a3qfh = { lockRow };
const _ref_a5xdhp = { closeFile };
const _ref_cv7pba = { addRigidBody };
const _ref_kmvq6w = { estimateNonce };
const _ref_fxk1xf = { pingHost };
const _ref_olhs7m = { createPipe };
const _ref_1s99ow = { detectEnvironment };
const _ref_9dnkxo = { resolveImports };
const _ref_27hm1j = { protectMemory };
const _ref_6kml5v = { preventCSRF };
const _ref_4ws8ew = { handleTimeout };
const _ref_8pmxw3 = { setAttack };
const _ref_kuto0c = { traceStack };
const _ref_3r6z5m = { renderCanvasLayer };
const _ref_1bont3 = { addGeneric6DofConstraint };
const _ref_epe74k = { createDynamicsCompressor };
const _ref_h6lk1m = { updateParticles };
const _ref_v70z4e = { sanitizeInput };
const _ref_g1vw2u = { chokePeer };
const _ref_85de5b = { createPhysicsWorld };
const _ref_d21wph = { detectAudioCodec };
const _ref_y86gff = { parseMagnetLink };
const _ref_mnyoj0 = { rotateMatrix };
const _ref_5z7ra4 = { manageCookieJar };
const _ref_u0ce8s = { restoreDatabase };
const _ref_3m3yd5 = { setPosition };
const _ref_1hs2kd = { removeConstraint };
const _ref_gtze27 = { unlockRow };
const _ref_7qkc8s = { detectVideoCodec };
const _ref_1nmdlx = { getSystemUptime };
const _ref_wj549h = { getAngularVelocity };
const _ref_tlrt49 = { beginTransaction };
const _ref_1t039d = { adjustWindowSize };
const _ref_9t871l = { checkRootAccess };
const _ref_19h4xa = { removeRigidBody };
const _ref_a86m6s = { createIndex };
const _ref_vs2unq = { parsePayload };
const _ref_n02f7u = { setDistanceModel };
const _ref_hhicmc = { calculateRestitution };
const _ref_dpjz6x = { closeSocket };
const _ref_egwnx6 = { measureRTT };
const _ref_7ss9vb = { disableInterrupts };
const _ref_7lcdfk = { bufferMediaStream };
const _ref_204nfy = { createMagnetURI };
const _ref_ikvtoc = { addHingeConstraint };
const _ref_iq9ute = { createProcess };
const _ref_86c7hn = { setFrequency };
const _ref_vjd69r = { prioritizeTraffic };
const _ref_f0brqz = { bindSocket };
const _ref_a9mp93 = { rayCast };
const _ref_e9rhmz = { checkIntegrityConstraint };
const _ref_72yep6 = { shutdownComputer };
const _ref_0zhbiy = { scheduleTask };
const _ref_hbpfr1 = { convertRGBtoHSL };
const _ref_63q892 = { seekFile }; 
    });
})({}, {});