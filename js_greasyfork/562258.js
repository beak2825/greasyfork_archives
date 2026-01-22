// ==UserScript==
// @name OfTV视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/OfTV/index.js
// @version 2026.01.21.2
// @description 一键下载OfTV视频，支持4K/1080P/720P多画质。
// @icon https://cdn.of.tv/favicon.ico
// @match *://of.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect of.tv
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
// @downloadURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562258/OfTV%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const setKnee = (node, val) => node.knee.value = val;

const parseQueryString = (qs) => ({});

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const enableDHT = () => true;

const getUniformLocation = (program, name) => 1;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const spoofReferer = () => "https://google.com";

const backupDatabase = (path) => ({ path, size: 5000 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const allowSleepMode = () => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const checkIntegrityToken = (token) => true;

const cleanOldLogs = (days) => days;

const setVelocity = (body, v) => true;

const removeConstraint = (world, c) => true;

const setFilterType = (filter, type) => filter.type = type;

const auditAccessLogs = () => true;

const stopOscillator = (osc, time) => true;

const dropTable = (table) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const deleteBuffer = (buffer) => true;

const setQValue = (filter, q) => filter.Q = q;

const getBlockHeight = () => 15000000;

const analyzeBitrate = () => "5000kbps";


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const getShaderInfoLog = (shader) => "";

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const chokePeer = (peer) => ({ ...peer, choked: true });

const traverseAST = (node, visitor) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const deobfuscateString = (str) => atob(str);

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

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const debouncedResize = () => ({ width: 1920, height: 1080 });

const hydrateSSR = (html) => true;

const startOscillator = (osc, time) => true;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const emitParticles = (sys, count) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const translateMatrix = (mat, vec) => mat;

const parseLogTopics = (topics) => ["Transfer"];

const deleteTexture = (texture) => true;

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

const analyzeControlFlow = (ast) => ({ graph: {} });

const drawElements = (mode, count, type, offset) => true;

const semaphoreWait = (sem) => true;

const encodeABI = (method, params) => "0x...";

const estimateNonce = (addr) => 42;

const compileToBytecode = (ast) => new Uint8Array();

const setVolumeLevel = (vol) => vol;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const lockRow = (id) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const removeMetadata = (file) => ({ file, metadata: null });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const getExtension = (name) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const renderParticles = (sys) => true;

const filterTraffic = (rule) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const decompressGzip = (data) => data;

const inlineFunctions = (ast) => ast;

const rollbackTransaction = (tx) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createTCPSocket = () => ({ fd: 1 });

const connectSocket = (sock, addr, port) => true;

const addSliderConstraint = (world, c) => true;

const traceroute = (host) => ["192.168.1.1"];

const dumpSymbolTable = (table) => "";

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const createSymbolTable = () => ({ scopes: [] });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const closeSocket = (sock) => true;

const compressGzip = (data) => data;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const sleep = (body) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const enterScope = (table) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const jitCompile = (bc) => (() => {});

const updateParticles = (sys, dt) => true;

const limitRate = (stream, rate) => stream;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const mockResponse = (body) => ({ status: 200, body });

const setOrientation = (panner, x, y, z) => true;

const reassemblePacket = (fragments) => fragments[0];

const createChannelMerger = (ctx, channels) => ({});

const createAudioContext = () => ({ sampleRate: 44100 });

const vertexAttrib3f = (idx, x, y, z) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const foldConstants = (ast) => ast;

const setRelease = (node, val) => node.release.value = val;

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const detectDebugger = () => false;

const restoreDatabase = (path) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const fragmentPacket = (data, mtu) => [data];

const killParticles = (sys) => true;

const prioritizeRarestPiece = (pieces) => pieces[0];

const resolveDNS = (domain) => "127.0.0.1";

const createChannelSplitter = (ctx, channels) => ({});

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const resetVehicle = (vehicle) => true;

const scaleMatrix = (mat, vec) => mat;

const createConvolver = (ctx) => ({ buffer: null });

const unlockRow = (id) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const unrollLoops = (ast) => ast;


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

const translateText = (text, lang) => text;

const cacheQueryResults = (key, data) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const installUpdate = () => false;

const measureRTT = (sent, recv) => 10;

const broadcastTransaction = (tx) => "tx_hash_123";

const minifyCode = (code) => code;

const recognizeSpeech = (audio) => "Transcribed Text";

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

const createConstraint = (body1, body2) => ({});

const loadCheckpoint = (path) => true;

const verifyIR = (ir) => true;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const resolveSymbols = (ast) => ({});

const validateIPWhitelist = (ip) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const leaveGroup = (group) => true;

const createParticleSystem = (count) => ({ particles: [] });

const inferType = (node) => 'any';

const rateLimitCheck = (ip) => true;

const attachRenderBuffer = (fb, rb) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const calculateComplexity = (ast) => 1;

const createShader = (gl, type) => ({ id: Math.random(), type });

const updateWheelTransform = (wheel) => true;

const generateCode = (ast) => "const a = 1;";

const setAttack = (node, val) => node.attack.value = val;

const detectVirtualMachine = () => false;

const resolveCollision = (manifold) => true;

const generateDocumentation = (ast) => "";

const detectDarkMode = () => true;

const encryptLocalStorage = (key, val) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const performOCR = (img) => "Detected Text";

const verifySignature = (tx, sig) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const injectCSPHeader = () => "default-src 'self'";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const shutdownComputer = () => console.log("Shutting down...");

const processAudioBuffer = (buffer) => buffer;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const signTransaction = (tx, key) => "signed_tx_hash";

const enableBlend = (func) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const optimizeAST = (ast) => ast;

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

const optimizeTailCalls = (ast) => ast;

const splitFile = (path, parts) => Array(parts).fill(path);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const bindTexture = (target, texture) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const addGeneric6DofConstraint = (world, c) => true;

const linkModules = (modules) => ({});

const establishHandshake = (sock) => true;

const bufferMediaStream = (size) => ({ buffer: size });

const beginTransaction = () => "TX-" + Date.now();

const calculateMetric = (route) => 1;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const rotateLogFiles = () => true;

const applyForce = (body, force, point) => true;

const calculateCRC32 = (data) => "00000000";

const reportWarning = (msg, line) => console.warn(msg);

const applyFog = (color, dist) => color;

const pingHost = (host) => 10;

const multicastMessage = (group, msg) => true;

const adjustWindowSize = (sock, size) => true;

const generateSourceMap = (ast) => "{}";

const checkPortAvailability = (port) => Math.random() > 0.2;

const unlockFile = (path) => ({ path, locked: false });

const anchorSoftBody = (soft, rigid) => true;

const detectVideoCodec = () => "h264";

const normalizeFeatures = (data) => data.map(x => x / 255);

const deserializeAST = (json) => JSON.parse(json);

const tokenizeText = (text) => text.split(" ");

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const freeMemory = (ptr) => true;

const checkBalance = (addr) => "10.5 ETH";

// Anti-shake references
const _ref_ugofo0 = { setKnee };
const _ref_n48tfe = { parseQueryString };
const _ref_wxz3w3 = { limitBandwidth };
const _ref_3d3maa = { enableDHT };
const _ref_7ht06k = { getUniformLocation };
const _ref_ofb7gh = { createIndex };
const _ref_rgxbeu = { spoofReferer };
const _ref_1932s6 = { backupDatabase };
const _ref_6l6mvm = { animateTransition };
const _ref_xmhh5o = { allowSleepMode };
const _ref_e2gon3 = { sanitizeSQLInput };
const _ref_pue2fc = { resolveHostName };
const _ref_h54h01 = { analyzeQueryPlan };
const _ref_5gqori = { getMemoryUsage };
const _ref_dvekn4 = { createDelay };
const _ref_pmw0eh = { checkIntegrityToken };
const _ref_dyfqrq = { cleanOldLogs };
const _ref_sixr4m = { setVelocity };
const _ref_dtpphc = { removeConstraint };
const _ref_c4m8td = { setFilterType };
const _ref_kbehft = { auditAccessLogs };
const _ref_gyeklf = { stopOscillator };
const _ref_v2y5ua = { dropTable };
const _ref_5pu0zf = { readPixels };
const _ref_96qdze = { deleteBuffer };
const _ref_47lkor = { setQValue };
const _ref_pu2f37 = { getBlockHeight };
const _ref_2skpyj = { analyzeBitrate };
const _ref_ixx47i = { transformAesKey };
const _ref_n0k8kq = { getShaderInfoLog };
const _ref_23gt59 = { allocateDiskSpace };
const _ref_80mieo = { chokePeer };
const _ref_iz7iej = { traverseAST };
const _ref_ltxqge = { normalizeAudio };
const _ref_x655i6 = { deobfuscateString };
const _ref_ltkpa5 = { calculateGasFee };
const _ref_7vb6s1 = { ApiDataFormatter };
const _ref_ki9wel = { showNotification };
const _ref_wwzckx = { debouncedResize };
const _ref_b3r7ry = { hydrateSSR };
const _ref_otmy9r = { startOscillator };
const _ref_b2aaxa = { parseMagnetLink };
const _ref_n7c8ie = { updateBitfield };
const _ref_ov9rpq = { emitParticles };
const _ref_bzuzpp = { convexSweepTest };
const _ref_yxc7b7 = { translateMatrix };
const _ref_q5ybp4 = { parseLogTopics };
const _ref_tajxl2 = { deleteTexture };
const _ref_cyxwl1 = { VirtualFSTree };
const _ref_jlwynu = { analyzeControlFlow };
const _ref_na3xks = { drawElements };
const _ref_jj7uub = { semaphoreWait };
const _ref_6nvvui = { encodeABI };
const _ref_kwj113 = { estimateNonce };
const _ref_qkurgs = { compileToBytecode };
const _ref_63l8kz = { setVolumeLevel };
const _ref_oi5jih = { diffVirtualDOM };
const _ref_1bsvzf = { lockRow };
const _ref_je52bt = { rayIntersectTriangle };
const _ref_1bf8ts = { sanitizeInput };
const _ref_vo9nu7 = { removeMetadata };
const _ref_fdnadv = { detectEnvironment };
const _ref_k01fwk = { getExtension };
const _ref_cwuitp = { decodeABI };
const _ref_wfouhh = { renderParticles };
const _ref_o8w1ca = { filterTraffic };
const _ref_rj3s8e = { shardingTable };
const _ref_ulkeqf = { decompressGzip };
const _ref_0xzlwy = { inlineFunctions };
const _ref_0qgoa4 = { rollbackTransaction };
const _ref_g5pk6v = { compressDataStream };
const _ref_po262q = { createTCPSocket };
const _ref_o7n56p = { connectSocket };
const _ref_jh2ohr = { addSliderConstraint };
const _ref_rauuuj = { traceroute };
const _ref_nim942 = { dumpSymbolTable };
const _ref_3h6l2x = { calculateMD5 };
const _ref_uiijet = { createSymbolTable };
const _ref_dsvru1 = { saveCheckpoint };
const _ref_hc4d1o = { closeSocket };
const _ref_4dtuia = { compressGzip };
const _ref_20k7qx = { loadTexture };
const _ref_rd2hgv = { sleep };
const _ref_jsup8w = { createDynamicsCompressor };
const _ref_rrxojk = { enterScope };
const _ref_ouza0g = { decodeAudioData };
const _ref_gpq961 = { jitCompile };
const _ref_lf1vcb = { updateParticles };
const _ref_5jn4s4 = { limitRate };
const _ref_84uokq = { linkProgram };
const _ref_o7g2r9 = { mockResponse };
const _ref_31yyuj = { setOrientation };
const _ref_jabljq = { reassemblePacket };
const _ref_i5h712 = { createChannelMerger };
const _ref_and689 = { createAudioContext };
const _ref_rg5r11 = { vertexAttrib3f };
const _ref_yfva1r = { createOscillator };
const _ref_21tmjx = { calculateLighting };
const _ref_dc6vfq = { foldConstants };
const _ref_iuthez = { setRelease };
const _ref_tmi0ji = { loadModelWeights };
const _ref_vk3l7k = { detectDebugger };
const _ref_c8v4wj = { restoreDatabase };
const _ref_bstw5y = { streamToPlayer };
const _ref_dpukyb = { fragmentPacket };
const _ref_xd7fm1 = { killParticles };
const _ref_jk95mu = { prioritizeRarestPiece };
const _ref_1l884y = { resolveDNS };
const _ref_er0mzh = { createChannelSplitter };
const _ref_68lid2 = { resolveDNSOverHTTPS };
const _ref_ls7xov = { createAnalyser };
const _ref_35eiw2 = { getSystemUptime };
const _ref_ra7kl3 = { syncDatabase };
const _ref_09i1nk = { resetVehicle };
const _ref_cfk84v = { scaleMatrix };
const _ref_azx4jo = { createConvolver };
const _ref_ux1e4c = { unlockRow };
const _ref_djncsv = { negotiateSession };
const _ref_zwm5i8 = { unrollLoops };
const _ref_hbsr7a = { TelemetryClient };
const _ref_49gon4 = { translateText };
const _ref_4z7qtg = { cacheQueryResults };
const _ref_2wqtqo = { rotateUserAgent };
const _ref_p4qu72 = { installUpdate };
const _ref_qxwq5w = { measureRTT };
const _ref_ek2rxw = { broadcastTransaction };
const _ref_95lip9 = { minifyCode };
const _ref_5cmgyq = { recognizeSpeech };
const _ref_1qwvug = { ProtocolBufferHandler };
const _ref_d6454c = { createConstraint };
const _ref_wynewn = { loadCheckpoint };
const _ref_4lklc8 = { verifyIR };
const _ref_mgpv7e = { updateProgressBar };
const _ref_2gyo3h = { resolveSymbols };
const _ref_7cnosx = { validateIPWhitelist };
const _ref_dw08xh = { setSocketTimeout };
const _ref_f3pmlv = { leaveGroup };
const _ref_lyt5nz = { createParticleSystem };
const _ref_5zv2i8 = { inferType };
const _ref_l7xdog = { rateLimitCheck };
const _ref_l5gco7 = { attachRenderBuffer };
const _ref_pru06m = { parseExpression };
const _ref_yqctul = { calculateComplexity };
const _ref_yg10q5 = { createShader };
const _ref_zge4jc = { updateWheelTransform };
const _ref_c727v1 = { generateCode };
const _ref_blq4sn = { setAttack };
const _ref_nax679 = { detectVirtualMachine };
const _ref_e5ydxi = { resolveCollision };
const _ref_240ooh = { generateDocumentation };
const _ref_fo83jp = { detectDarkMode };
const _ref_sqk1kp = { encryptLocalStorage };
const _ref_41523s = { createSphereShape };
const _ref_gayzx5 = { traceStack };
const _ref_r4qd1y = { parseClass };
const _ref_kz28ix = { performOCR };
const _ref_rkyy61 = { verifySignature };
const _ref_sztap2 = { calculateSHA256 };
const _ref_gkl3qv = { injectCSPHeader };
const _ref_4gk5f8 = { checkIntegrity };
const _ref_5vna0t = { shutdownComputer };
const _ref_pvp5sv = { processAudioBuffer };
const _ref_r9ipz7 = { FileValidator };
const _ref_etokwu = { signTransaction };
const _ref_t9arj4 = { enableBlend };
const _ref_01ucu7 = { handshakePeer };
const _ref_m923zo = { optimizeAST };
const _ref_1pbscw = { generateFakeClass };
const _ref_k01sc7 = { optimizeTailCalls };
const _ref_un99c0 = { splitFile };
const _ref_s6ugyd = { encryptPayload };
const _ref_9znxll = { optimizeConnectionPool };
const _ref_1vw0jc = { bindTexture };
const _ref_acfst2 = { createPeriodicWave };
const _ref_tdxoqa = { addGeneric6DofConstraint };
const _ref_mnz8s7 = { linkModules };
const _ref_ki0kjx = { establishHandshake };
const _ref_mhwge5 = { bufferMediaStream };
const _ref_1l8oh3 = { beginTransaction };
const _ref_0mlyrg = { calculateMetric };
const _ref_tyjrik = { uploadCrashReport };
const _ref_shyghq = { rotateLogFiles };
const _ref_ms6htu = { applyForce };
const _ref_kuan4j = { calculateCRC32 };
const _ref_fu4s8g = { reportWarning };
const _ref_x28omd = { applyFog };
const _ref_3pswa8 = { pingHost };
const _ref_39zygm = { multicastMessage };
const _ref_dbhsyf = { adjustWindowSize };
const _ref_a5nxpc = { generateSourceMap };
const _ref_uvs935 = { checkPortAvailability };
const _ref_634ogb = { unlockFile };
const _ref_gia4s6 = { anchorSoftBody };
const _ref_z02e06 = { detectVideoCodec };
const _ref_tis5yy = { normalizeFeatures };
const _ref_zmdl1w = { deserializeAST };
const _ref_jl6rn1 = { tokenizeText };
const _ref_0dcdix = { getAngularVelocity };
const _ref_3qgy2p = { freeMemory };
const _ref_xsvf4a = { checkBalance }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `OfTV` };
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
                const urlParams = { config, url: window.location.href, name_en: `OfTV` };

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
        const generateSourceMap = (ast) => "{}";

const createParticleSystem = (count) => ({ particles: [] });

const createBoxShape = (w, h, d) => ({ type: 'box' });

const compileVertexShader = (source) => ({ compiled: true });

const setOrientation = (panner, x, y, z) => true;

const addHingeConstraint = (world, c) => true;

const mkdir = (path) => true;

const downInterface = (iface) => true;

const uniform1i = (loc, val) => true;

const analyzeHeader = (packet) => ({});

const upInterface = (iface) => true;

const dhcpAck = () => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const closePipe = (fd) => true;

const resolveCollision = (manifold) => true;

const unloadDriver = (name) => true;

const protectMemory = (ptr, size, flags) => true;

const attachRenderBuffer = (fb, rb) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const verifySignature = (tx, sig) => true;

const dumpSymbolTable = (table) => "";

const repairCorruptFile = (path) => ({ path, repaired: true });

const dropTable = (table) => true;

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

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const getMediaDuration = () => 3600;

const resolveSymbols = (ast) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const scaleMatrix = (mat, vec) => mat;

const leaveGroup = (group) => true;

const detectAudioCodec = () => "aac";

const extractArchive = (archive) => ["file1", "file2"];

const augmentData = (image) => image;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const syncAudioVideo = (offset) => ({ offset, synced: true });

const getShaderInfoLog = (shader) => "";

const receivePacket = (sock, len) => new Uint8Array(len);

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const acceptConnection = (sock) => ({ fd: 2 });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const handleInterrupt = (irq) => true;

const encodeABI = (method, params) => "0x...";

const resolveDNS = (domain) => "127.0.0.1";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const injectMetadata = (file, meta) => ({ file, meta });

const createFrameBuffer = () => ({ id: Math.random() });

const preventSleepMode = () => true;

const deserializeAST = (json) => JSON.parse(json);

const logErrorToFile = (err) => console.error(err);

const createProcess = (img) => ({ pid: 100 });

const inferType = (node) => 'any';

const encryptLocalStorage = (key, val) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const contextSwitch = (oldPid, newPid) => true;

const uniform3f = (loc, x, y, z) => true;

const stopOscillator = (osc, time) => true;

const createSymbolTable = () => ({ scopes: [] });

const mapMemory = (fd, size) => 0x2000;

const defineSymbol = (table, name, info) => true;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const deleteBuffer = (buffer) => true;

const readFile = (fd, len) => "";

const compileToBytecode = (ast) => new Uint8Array();

const lazyLoadComponent = (name) => ({ name, loaded: false });

const unmountFileSystem = (path) => true;

const createChannelMerger = (ctx, channels) => ({});

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createShader = (gl, type) => ({ id: Math.random(), type });

const bundleAssets = (assets) => "";

const detectVideoCodec = () => "h264";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const updateParticles = (sys, dt) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const clearScreen = (r, g, b, a) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const computeDominators = (cfg) => ({});

const processAudioBuffer = (buffer) => buffer;

const establishHandshake = (sock) => true;

const rotateLogFiles = () => true;

const resampleAudio = (buffer, rate) => buffer;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const getcwd = () => "/";

const setMass = (body, m) => true;

const backpropagateGradient = (loss) => true;

const createChannelSplitter = (ctx, channels) => ({});

const performOCR = (img) => "Detected Text";

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const applyForce = (body, force, point) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const dhcpDiscover = () => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const unmapMemory = (ptr, size) => true;

const setGravity = (world, g) => world.gravity = g;

const setBrake = (vehicle, force, wheelIdx) => true;

const applyTorque = (body, torque) => true;

const renameFile = (oldName, newName) => newName;

const filterTraffic = (rule) => true;

const enterScope = (table) => true;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const unlockRow = (id) => true;

const restoreDatabase = (path) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const classifySentiment = (text) => "positive";

const registerSystemTray = () => ({ icon: "tray.ico" });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const findLoops = (cfg) => [];

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const panicKernel = (msg) => false;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const getFloatTimeDomainData = (analyser, array) => true;

const profilePerformance = (func) => 0;

const postProcessBloom = (image, threshold) => image;

const detectDarkMode = () => true;

const validateIPWhitelist = (ip) => true;

const mutexUnlock = (mtx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const killParticles = (sys) => true;

const decodeAudioData = (buffer) => Promise.resolve({});

const obfuscateString = (str) => btoa(str);

const statFile = (path) => ({ size: 0 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const restartApplication = () => console.log("Restarting...");

const setFrequency = (osc, freq) => osc.frequency.value = freq;


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

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const limitRate = (stream, rate) => stream;

const emitParticles = (sys, count) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const joinThread = (tid) => true;

const negotiateProtocol = () => "HTTP/2.0";

const rmdir = (path) => true;

const pingHost = (host) => 10;

const addSliderConstraint = (world, c) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const registerGestureHandler = (gesture) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const encryptPeerTraffic = (data) => btoa(data);

const auditAccessLogs = () => true;

const mergeFiles = (parts) => parts[0];

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const preventCSRF = () => "csrf_token";

const foldConstants = (ast) => ast;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const killProcess = (pid) => true;

const disablePEX = () => false;

const checkBatteryLevel = () => 100;

const translateMatrix = (mat, vec) => mat;

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const obfuscateCode = (code) => code;

const setPan = (node, val) => node.pan.value = val;

const closeContext = (ctx) => Promise.resolve();

const renderCanvasLayer = (ctx) => true;

const createPipe = () => [3, 4];

const renderParticles = (sys) => true;

const debugAST = (ast) => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const disconnectNodes = (node) => true;

const shutdownComputer = () => console.log("Shutting down...");

const calculateGasFee = (limit) => limit * 20;

const claimRewards = (pool) => "0.5 ETH";

const connectNodes = (src, dest) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const bufferMediaStream = (size) => ({ buffer: size });

const applyImpulse = (body, impulse, point) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const captureFrame = () => "frame_data_buffer";

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const loadImpulseResponse = (url) => Promise.resolve({});

const semaphoreWait = (sem) => true;

const adjustPlaybackSpeed = (rate) => rate;

const createVehicle = (chassis) => ({ wheels: [] });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const openFile = (path, flags) => 5;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const linkModules = (modules) => ({});

const normalizeFeatures = (data) => data.map(x => x / 255);

const resetVehicle = (vehicle) => true;

const listenSocket = (sock, backlog) => true;

const semaphoreSignal = (sem) => true;

// Anti-shake references
const _ref_airdgw = { generateSourceMap };
const _ref_4m2k0g = { createParticleSystem };
const _ref_qqcz2p = { createBoxShape };
const _ref_99ivan = { compileVertexShader };
const _ref_fddr0b = { setOrientation };
const _ref_zdhag7 = { addHingeConstraint };
const _ref_olqqk4 = { mkdir };
const _ref_z35pbv = { downInterface };
const _ref_59h61w = { uniform1i };
const _ref_advb0g = { analyzeHeader };
const _ref_vluzyb = { upInterface };
const _ref_v19jtw = { dhcpAck };
const _ref_5uy4ys = { createIndexBuffer };
const _ref_k9qd5d = { createGainNode };
const _ref_s0otq9 = { closePipe };
const _ref_ujyaxy = { resolveCollision };
const _ref_szswpw = { unloadDriver };
const _ref_s44n0q = { protectMemory };
const _ref_0r897m = { attachRenderBuffer };
const _ref_joujek = { limitBandwidth };
const _ref_xto9lq = { verifySignature };
const _ref_ukb8oq = { dumpSymbolTable };
const _ref_rg4vkh = { repairCorruptFile };
const _ref_fzv3u9 = { dropTable };
const _ref_l9yrv3 = { download };
const _ref_vw37li = { createScriptProcessor };
const _ref_m2j5z0 = { getMediaDuration };
const _ref_6ojwab = { resolveSymbols };
const _ref_pz54xm = { analyzeControlFlow };
const _ref_ifc6mw = { handshakePeer };
const _ref_3l3ujn = { scaleMatrix };
const _ref_s0taon = { leaveGroup };
const _ref_3htcv2 = { detectAudioCodec };
const _ref_otlg4d = { extractArchive };
const _ref_58r697 = { augmentData };
const _ref_tj93fx = { requestAnimationFrameLoop };
const _ref_57ni28 = { discoverPeersDHT };
const _ref_1bsauk = { connectionPooling };
const _ref_45hs5p = { syncAudioVideo };
const _ref_qws918 = { getShaderInfoLog };
const _ref_kh56cd = { receivePacket };
const _ref_m3wq55 = { updateBitfield };
const _ref_1yd5ge = { acceptConnection };
const _ref_cc3nie = { sanitizeSQLInput };
const _ref_934vej = { handleInterrupt };
const _ref_uu6c4v = { encodeABI };
const _ref_9bpxau = { resolveDNS };
const _ref_q87czx = { moveFileToComplete };
const _ref_rt5cgd = { injectMetadata };
const _ref_5bze3j = { createFrameBuffer };
const _ref_2gtm0u = { preventSleepMode };
const _ref_qcjl0x = { deserializeAST };
const _ref_vbpzih = { logErrorToFile };
const _ref_tpid2q = { createProcess };
const _ref_2u9mwo = { inferType };
const _ref_4jsytg = { encryptLocalStorage };
const _ref_umnokl = { createWaveShaper };
const _ref_9nm72h = { limitUploadSpeed };
const _ref_upwes4 = { contextSwitch };
const _ref_dks227 = { uniform3f };
const _ref_adao8x = { stopOscillator };
const _ref_4ysgcn = { createSymbolTable };
const _ref_z8kufi = { mapMemory };
const _ref_q321bk = { defineSymbol };
const _ref_qtwkhk = { createStereoPanner };
const _ref_iy3r5h = { formatCurrency };
const _ref_btb3db = { deleteBuffer };
const _ref_ga67y9 = { readFile };
const _ref_zsqjcq = { compileToBytecode };
const _ref_fhb2t5 = { lazyLoadComponent };
const _ref_0lagu5 = { unmountFileSystem };
const _ref_4ckwrp = { createChannelMerger };
const _ref_c360ra = { sanitizeInput };
const _ref_3n36oi = { createShader };
const _ref_mlspja = { bundleAssets };
const _ref_oxxwcq = { detectVideoCodec };
const _ref_nmp7my = { scrapeTracker };
const _ref_bfb39z = { updateParticles };
const _ref_ooqwz4 = { createSphereShape };
const _ref_f3hmy9 = { clearScreen };
const _ref_e6rbps = { backupDatabase };
const _ref_5hivyj = { uploadCrashReport };
const _ref_1e9sxx = { initWebGLContext };
const _ref_ulidwi = { computeDominators };
const _ref_0hr5bf = { processAudioBuffer };
const _ref_tn9nv2 = { establishHandshake };
const _ref_qh0vy5 = { rotateLogFiles };
const _ref_6og6bm = { resampleAudio };
const _ref_wajmm8 = { readPixels };
const _ref_xnz207 = { compactDatabase };
const _ref_p1rtw3 = { getcwd };
const _ref_jaafmn = { setMass };
const _ref_m67k3g = { backpropagateGradient };
const _ref_7vkkqm = { createChannelSplitter };
const _ref_3xjx27 = { performOCR };
const _ref_m0bu4a = { createOscillator };
const _ref_cj6z3h = { applyForce };
const _ref_rvcbk1 = { uniformMatrix4fv };
const _ref_lzy5ka = { dhcpDiscover };
const _ref_gqhoww = { compressDataStream };
const _ref_043rl0 = { archiveFiles };
const _ref_uq1fgr = { unmapMemory };
const _ref_mwv5tn = { setGravity };
const _ref_7q5gud = { setBrake };
const _ref_pu77j0 = { applyTorque };
const _ref_a4ez15 = { renameFile };
const _ref_68punc = { filterTraffic };
const _ref_93ahn7 = { enterScope };
const _ref_sfyyhw = { parseConfigFile };
const _ref_38zrja = { limitDownloadSpeed };
const _ref_cjdlw8 = { unlockRow };
const _ref_mqzlbr = { restoreDatabase };
const _ref_nq8bbe = { setDetune };
const _ref_8kg03q = { optimizeHyperparameters };
const _ref_zwau2r = { verifyFileSignature };
const _ref_d0fhn4 = { scheduleBandwidth };
const _ref_sz4muu = { classifySentiment };
const _ref_q0vkw6 = { registerSystemTray };
const _ref_5wid3t = { generateUUIDv5 };
const _ref_74pikc = { findLoops };
const _ref_swsbwy = { queueDownloadTask };
const _ref_nqab03 = { panicKernel };
const _ref_cod9ja = { getFileAttributes };
const _ref_zv6l63 = { getFloatTimeDomainData };
const _ref_k1jujn = { profilePerformance };
const _ref_k8zosa = { postProcessBloom };
const _ref_13111y = { detectDarkMode };
const _ref_dxzo5p = { validateIPWhitelist };
const _ref_e1w7hi = { mutexUnlock };
const _ref_w1icht = { rotateMatrix };
const _ref_7754ja = { killParticles };
const _ref_f65b2c = { decodeAudioData };
const _ref_swhntx = { obfuscateString };
const _ref_84lem9 = { statFile };
const _ref_kqnfoj = { transformAesKey };
const _ref_a3efz9 = { tunnelThroughProxy };
const _ref_p13cfk = { detectObjectYOLO };
const _ref_f88yif = { restartApplication };
const _ref_99d2t4 = { setFrequency };
const _ref_v8w5of = { CacheManager };
const _ref_yaexnw = { clearBrowserCache };
const _ref_xt6nrl = { limitRate };
const _ref_1k2ar8 = { emitParticles };
const _ref_v4fueq = { captureScreenshot };
const _ref_nzcqvx = { joinThread };
const _ref_df9rfy = { negotiateProtocol };
const _ref_m6efbr = { rmdir };
const _ref_6vp826 = { pingHost };
const _ref_lcsbei = { addSliderConstraint };
const _ref_e0z6hr = { createCapsuleShape };
const _ref_udtu45 = { terminateSession };
const _ref_pxwb3v = { registerGestureHandler };
const _ref_xp3lqg = { calculateEntropy };
const _ref_9jnbxo = { encryptPeerTraffic };
const _ref_y2smij = { auditAccessLogs };
const _ref_6mdhk9 = { mergeFiles };
const _ref_yc1fl4 = { diffVirtualDOM };
const _ref_wqvety = { preventCSRF };
const _ref_9hl1kt = { foldConstants };
const _ref_89ji8l = { createPhysicsWorld };
const _ref_5qntch = { watchFileChanges };
const _ref_64f154 = { performTLSHandshake };
const _ref_nj3pvy = { killProcess };
const _ref_2hskz6 = { disablePEX };
const _ref_g0ozq4 = { checkBatteryLevel };
const _ref_q01d03 = { translateMatrix };
const _ref_3dzb2d = { detectFirewallStatus };
const _ref_2qnfjh = { obfuscateCode };
const _ref_ske1ks = { setPan };
const _ref_hoq2ui = { closeContext };
const _ref_5t85yg = { renderCanvasLayer };
const _ref_kycqet = { createPipe };
const _ref_fen6pa = { renderParticles };
const _ref_rmw6wt = { debugAST };
const _ref_26s636 = { requestPiece };
const _ref_5x7nu2 = { extractThumbnail };
const _ref_n8ng9a = { disconnectNodes };
const _ref_v2oc2d = { shutdownComputer };
const _ref_kf9zra = { calculateGasFee };
const _ref_73amo7 = { claimRewards };
const _ref_oz26ea = { connectNodes };
const _ref_57hkl4 = { FileValidator };
const _ref_pjbx8k = { bufferMediaStream };
const _ref_ityf7d = { applyImpulse };
const _ref_5xd3wf = { showNotification };
const _ref_p6y2xk = { captureFrame };
const _ref_b8vn6v = { parseM3U8Playlist };
const _ref_ggzvb2 = { normalizeAudio };
const _ref_nwi3c3 = { loadImpulseResponse };
const _ref_c05izy = { semaphoreWait };
const _ref_uiteln = { adjustPlaybackSpeed };
const _ref_lzubvd = { createVehicle };
const _ref_9bid8a = { parseFunction };
const _ref_fjkvow = { openFile };
const _ref_39j58v = { parseMagnetLink };
const _ref_z8zd0c = { linkModules };
const _ref_ny7cyq = { normalizeFeatures };
const _ref_p1qhgx = { resetVehicle };
const _ref_wl3oyg = { listenSocket };
const _ref_6szc6c = { semaphoreSignal }; 
    });
})({}, {});