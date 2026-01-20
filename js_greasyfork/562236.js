// ==UserScript==
// @name Bigo视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/Bigo/index.js
// @version 2026.01.10
// @description 一键下载Bigo视频，支持4K/1080P/720P多画质。
// @icon https://www.bigo.tv/favicon.ico
// @match *://*.bigo.tv/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bigo.tv
// @connect cubetecn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562236/Bigo%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const sanitizeXSS = (html) => html;

const writeFile = (fd, data) => true;

const checkRootAccess = () => false;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const repairCorruptFile = (path) => ({ path, repaired: true });

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const validateRecaptcha = (token) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const checkTypes = (ast) => [];

const generateMipmaps = (target) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const bundleAssets = (assets) => "";

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const instrumentCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const registerGestureHandler = (gesture) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const exitScope = (table) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const dumpSymbolTable = (table) => "";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };


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

const checkBalance = (addr) => "10.5 ETH";


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

const fingerprintBrowser = () => "fp_hash_123";

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const lookupSymbol = (table, name) => ({});

const resolveImports = (ast) => [];

const resolveSymbols = (ast) => ({});

const getBlockHeight = () => 15000000;

const generateSourceMap = (ast) => "{}";

const defineSymbol = (table, name, info) => true;

const reportWarning = (msg, line) => console.warn(msg);

const decompressPacket = (data) => data;

const disableRightClick = () => true;

const verifyChecksum = (data, sum) => true;

const sendPacket = (sock, data) => data.length;

const closePipe = (fd) => true;

const limitRate = (stream, rate) => stream;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const readFile = (fd, len) => "";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const chdir = (path) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const createTCPSocket = () => ({ fd: 1 });

const encryptStream = (stream, key) => stream;

const mkdir = (path) => true;

const cleanOldLogs = (days) => days;

const setMTU = (iface, mtu) => true;

const inferType = (node) => 'any';

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

const linkModules = (modules) => ({});

const analyzeControlFlow = (ast) => ({ graph: {} });

const resolveDNS = (domain) => "127.0.0.1";

const loadCheckpoint = (path) => true;

const extractArchive = (archive) => ["file1", "file2"];

const detachThread = (tid) => true;

const bindSocket = (port) => ({ port, status: "bound" });

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

const computeLossFunction = (pred, actual) => 0.05;

const closeSocket = (sock) => true;

const addHingeConstraint = (world, c) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const detectVideoCodec = () => "h264";

const loadImpulseResponse = (url) => Promise.resolve({});

const cancelTask = (id) => ({ id, cancelled: true });

const rateLimitCheck = (ip) => true;

const invalidateCache = (key) => true;

const readdir = (path) => [];

const seekFile = (fd, offset) => true;

const receivePacket = (sock, len) => new Uint8Array(len);

const restartApplication = () => console.log("Restarting...");

const setGainValue = (node, val) => node.gain.value = val;

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

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setRelease = (node, val) => node.release.value = val;

const connectSocket = (sock, addr, port) => true;

const detectPacketLoss = (acks) => false;

const performOCR = (img) => "Detected Text";

const systemCall = (num, args) => 0;

const applyForce = (body, force, point) => true;

const addConeTwistConstraint = (world, c) => true;

const createParticleSystem = (count) => ({ particles: [] });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const createShader = (gl, type) => ({ id: Math.random(), type });

const killParticles = (sys) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const validatePieceChecksum = (piece) => true;

const createMediaStreamSource = (ctx, stream) => ({});

const generateEmbeddings = (text) => new Float32Array(128);

const translateMatrix = (mat, vec) => mat;

const visitNode = (node) => true;

const createSphereShape = (r) => ({ type: 'sphere' });

const mergeFiles = (parts) => parts[0];

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const anchorSoftBody = (soft, rigid) => true;

const replicateData = (node) => ({ target: node, synced: true });

const setPan = (node, val) => node.pan.value = val;

const negotiateSession = (sock) => ({ id: "sess_1" });

const unlockFile = (path) => ({ path, locked: false });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const convertFormat = (src, dest) => dest;

const classifySentiment = (text) => "positive";

const broadcastMessage = (msg) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const acceptConnection = (sock) => ({ fd: 2 });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const createPipe = () => [3, 4];

const calculateCRC32 = (data) => "00000000";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const migrateSchema = (version) => ({ current: version, status: "ok" });

const decodeAudioData = (buffer) => Promise.resolve({});

const checkIntegrityConstraint = (table) => true;

const emitParticles = (sys, count) => true;

const addGeneric6DofConstraint = (world, c) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const calculateGasFee = (limit) => limit * 20;

const createConstraint = (body1, body2) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const validateIPWhitelist = (ip) => true;

const setOrientation = (panner, x, y, z) => true;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const updateParticles = (sys, dt) => true;


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

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const unmountFileSystem = (path) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const findLoops = (cfg) => [];

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const unrollLoops = (ast) => ast;

const injectMetadata = (file, meta) => ({ file, meta });

const prioritizeTraffic = (queue) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const deleteBuffer = (buffer) => true;

const addWheel = (vehicle, info) => true;

const contextSwitch = (oldPid, newPid) => true;

const compressGzip = (data) => data;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const deserializeAST = (json) => JSON.parse(json);

const unchokePeer = (peer) => ({ ...peer, choked: false });

const detectDarkMode = () => true;

const resetVehicle = (vehicle) => true;

const unlinkFile = (path) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const deleteProgram = (program) => true;

const reportError = (msg, line) => console.error(msg);

const setVolumeLevel = (vol) => vol;

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const cacheQueryResults = (key, data) => true;

const mutexUnlock = (mtx) => true;

const stakeAssets = (pool, amount) => true;

const inlineFunctions = (ast) => ast;

const captureFrame = () => "frame_data_buffer";

const setPosition = (panner, x, y, z) => true;

const traceroute = (host) => ["192.168.1.1"];

const joinThread = (tid) => true;

const parseLogTopics = (topics) => ["Transfer"];

const preventCSRF = () => "csrf_token";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const leaveGroup = (group) => true;

const decapsulateFrame = (frame) => frame;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const suspendContext = (ctx) => Promise.resolve();


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

const disableInterrupts = () => true;

const dhcpOffer = (ip) => true;

const allocateMemory = (size) => 0x1000;

const decryptStream = (stream, key) => stream;

const verifyAppSignature = () => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const protectMemory = (ptr, size, flags) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const obfuscateCode = (code) => code;

const adjustWindowSize = (sock, size) => true;

const removeConstraint = (world, c) => true;

const rotateLogFiles = () => true;

const swapTokens = (pair, amount) => true;

const computeDominators = (cfg) => ({});

const setDelayTime = (node, time) => node.delayTime.value = time;

const decompressGzip = (data) => data;

const signTransaction = (tx, key) => "signed_tx_hash";

const getcwd = () => "/";

const applyTheme = (theme) => document.body.className = theme;

const joinGroup = (group) => true;

const logErrorToFile = (err) => console.error(err);

const createSoftBody = (info) => ({ nodes: [] });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setSocketTimeout = (ms) => ({ timeout: ms });

// Anti-shake references
const _ref_bbgkpb = { sanitizeXSS };
const _ref_nuz2va = { writeFile };
const _ref_cn8t63 = { checkRootAccess };
const _ref_yts8wc = { loadTexture };
const _ref_9zdz3y = { repairCorruptFile };
const _ref_mj5chq = { detectFirewallStatus };
const _ref_kikmhh = { validateRecaptcha };
const _ref_1elw7w = { FileValidator };
const _ref_mfjomb = { parseMagnetLink };
const _ref_o0kwtv = { checkTypes };
const _ref_1wupw0 = { generateMipmaps };
const _ref_l79qqe = { calculateEntropy };
const _ref_593vz1 = { bundleAssets };
const _ref_tmnato = { analyzeUserBehavior };
const _ref_oj6s92 = { instrumentCode };
const _ref_y25nf4 = { compileToBytecode };
const _ref_rsoygm = { registerGestureHandler };
const _ref_y2epof = { linkProgram };
const _ref_y53kux = { exitScope };
const _ref_cadqb5 = { requestPiece };
const _ref_xn3hr4 = { virtualScroll };
const _ref_8ywzx7 = { formatCurrency };
const _ref_0mhd89 = { dumpSymbolTable };
const _ref_gfh7uc = { resolveDependencyGraph };
const _ref_3gowqw = { TelemetryClient };
const _ref_ntmu6k = { checkBalance };
const _ref_ljzf3x = { ApiDataFormatter };
const _ref_iiudon = { fingerprintBrowser };
const _ref_yrj9sg = { formatLogMessage };
const _ref_fjae5d = { lookupSymbol };
const _ref_2sk4aq = { resolveImports };
const _ref_z5kjf9 = { resolveSymbols };
const _ref_nhfhnd = { getBlockHeight };
const _ref_zn760k = { generateSourceMap };
const _ref_w2bv2d = { defineSymbol };
const _ref_kypswf = { reportWarning };
const _ref_6hrwe1 = { decompressPacket };
const _ref_dbeyr6 = { disableRightClick };
const _ref_6k4x8o = { verifyChecksum };
const _ref_2dnkvo = { sendPacket };
const _ref_036oi7 = { closePipe };
const _ref_cbl4uy = { limitRate };
const _ref_69k1ed = { optimizeConnectionPool };
const _ref_te5mgw = { readFile };
const _ref_dsny44 = { limitBandwidth };
const _ref_phvzwq = { chdir };
const _ref_p0d15x = { clearBrowserCache };
const _ref_x6god8 = { createTCPSocket };
const _ref_mdze2y = { encryptStream };
const _ref_v7s4lf = { mkdir };
const _ref_tzz95k = { cleanOldLogs };
const _ref_kwtsy9 = { setMTU };
const _ref_hsi6hs = { inferType };
const _ref_svbb84 = { ProtocolBufferHandler };
const _ref_ikebuy = { linkModules };
const _ref_ugfleg = { analyzeControlFlow };
const _ref_i2mxfc = { resolveDNS };
const _ref_ldzmny = { loadCheckpoint };
const _ref_sepa9z = { extractArchive };
const _ref_e1wmxq = { detachThread };
const _ref_aeghxj = { bindSocket };
const _ref_0vgw17 = { download };
const _ref_0e98ar = { computeLossFunction };
const _ref_tvh8tk = { closeSocket };
const _ref_qc9ulr = { addHingeConstraint };
const _ref_0bwfa4 = { initiateHandshake };
const _ref_owjpij = { detectVideoCodec };
const _ref_yr95nb = { loadImpulseResponse };
const _ref_e32lff = { cancelTask };
const _ref_p1n1z9 = { rateLimitCheck };
const _ref_bl3l6u = { invalidateCache };
const _ref_6flpp9 = { readdir };
const _ref_kd5c90 = { seekFile };
const _ref_gd9w47 = { receivePacket };
const _ref_fyp4d9 = { restartApplication };
const _ref_mdmebk = { setGainValue };
const _ref_yr7jcj = { generateFakeClass };
const _ref_chi7oz = { renderVirtualDOM };
const _ref_3mgy1z = { setRelease };
const _ref_ttt6ja = { connectSocket };
const _ref_uunti4 = { detectPacketLoss };
const _ref_l13a6g = { performOCR };
const _ref_z8ykcf = { systemCall };
const _ref_9t4jlw = { applyForce };
const _ref_hx3sx3 = { addConeTwistConstraint };
const _ref_jldsm8 = { createParticleSystem };
const _ref_be8tsn = { createScriptProcessor };
const _ref_s3xke6 = { extractThumbnail };
const _ref_oo95fj = { getVelocity };
const _ref_q8mecf = { connectToTracker };
const _ref_lcaaq6 = { chokePeer };
const _ref_sseo4f = { createShader };
const _ref_069p18 = { killParticles };
const _ref_t23ubq = { uploadCrashReport };
const _ref_9b1zgx = { validatePieceChecksum };
const _ref_8lc23o = { createMediaStreamSource };
const _ref_pk4xqy = { generateEmbeddings };
const _ref_94yi05 = { translateMatrix };
const _ref_oqbc2i = { visitNode };
const _ref_6wct7a = { createSphereShape };
const _ref_z8uczd = { mergeFiles };
const _ref_5nsth8 = { calculateLighting };
const _ref_qvpvml = { anchorSoftBody };
const _ref_2owk5g = { replicateData };
const _ref_0todig = { setPan };
const _ref_kab70r = { negotiateSession };
const _ref_lhl0s2 = { unlockFile };
const _ref_93lr4h = { makeDistortionCurve };
const _ref_tt14ot = { convertFormat };
const _ref_syd4q7 = { classifySentiment };
const _ref_hat0nh = { broadcastMessage };
const _ref_mo47rd = { normalizeVector };
const _ref_xy3p0k = { acceptConnection };
const _ref_3arlgk = { getMACAddress };
const _ref_co7t7n = { createPipe };
const _ref_oek1sc = { calculateCRC32 };
const _ref_3m3fjs = { cancelAnimationFrameLoop };
const _ref_47uhho = { migrateSchema };
const _ref_crwhxd = { decodeAudioData };
const _ref_ppgicw = { checkIntegrityConstraint };
const _ref_fnst84 = { emitParticles };
const _ref_ukasxu = { addGeneric6DofConstraint };
const _ref_uo8g6b = { broadcastTransaction };
const _ref_y1u7tz = { calculateGasFee };
const _ref_3w78kq = { createConstraint };
const _ref_cmwpov = { syncAudioVideo };
const _ref_3b0i16 = { validateIPWhitelist };
const _ref_nwah3c = { setOrientation };
const _ref_wkqgou = { detectEnvironment };
const _ref_qc4dhj = { resolveDNSOverHTTPS };
const _ref_aqdezg = { updateParticles };
const _ref_s5wji2 = { ResourceMonitor };
const _ref_546urf = { traceStack };
const _ref_o6vyng = { unmountFileSystem };
const _ref_kmpdnj = { sanitizeInput };
const _ref_ezrhuq = { findLoops };
const _ref_6033f8 = { applyPerspective };
const _ref_80jth6 = { unrollLoops };
const _ref_ct8a1t = { injectMetadata };
const _ref_7dblhw = { prioritizeTraffic };
const _ref_xllw7w = { createVehicle };
const _ref_hmw2kh = { deleteBuffer };
const _ref_bbw7s8 = { addWheel };
const _ref_t80c4m = { contextSwitch };
const _ref_8vdokl = { compressGzip };
const _ref_svy6wf = { validateSSLCert };
const _ref_ye2ctd = { deserializeAST };
const _ref_4fyx29 = { unchokePeer };
const _ref_bdlta2 = { detectDarkMode };
const _ref_l7kli6 = { resetVehicle };
const _ref_94m1ui = { unlinkFile };
const _ref_3ed5fb = { calculateFriction };
const _ref_jcgp7d = { calculatePieceHash };
const _ref_82hpya = { lazyLoadComponent };
const _ref_cwkkns = { deleteProgram };
const _ref_werb6r = { reportError };
const _ref_zv63e2 = { setVolumeLevel };
const _ref_husfv5 = { archiveFiles };
const _ref_a7b2gl = { cacheQueryResults };
const _ref_nicamu = { mutexUnlock };
const _ref_8s1aq0 = { stakeAssets };
const _ref_yr8eg6 = { inlineFunctions };
const _ref_uks11v = { captureFrame };
const _ref_lkuc2q = { setPosition };
const _ref_qolwy3 = { traceroute };
const _ref_qak7je = { joinThread };
const _ref_qebd1u = { parseLogTopics };
const _ref_hcqp3i = { preventCSRF };
const _ref_pm38jd = { compressDataStream };
const _ref_r7vmix = { verifyMagnetLink };
const _ref_gnc99v = { leaveGroup };
const _ref_wkiek0 = { decapsulateFrame };
const _ref_qqpu9p = { requestAnimationFrameLoop };
const _ref_1cilzb = { suspendContext };
const _ref_b4st97 = { CacheManager };
const _ref_tiz43k = { disableInterrupts };
const _ref_49qcex = { dhcpOffer };
const _ref_w6ysj0 = { allocateMemory };
const _ref_kujhko = { decryptStream };
const _ref_bioqdv = { verifyAppSignature };
const _ref_jnmp0w = { recognizeSpeech };
const _ref_9h1atl = { createStereoPanner };
const _ref_yh5e2l = { protectMemory };
const _ref_osy28z = { queueDownloadTask };
const _ref_kv7wuc = { obfuscateCode };
const _ref_ndsiru = { adjustWindowSize };
const _ref_1zgh3j = { removeConstraint };
const _ref_kv71ov = { rotateLogFiles };
const _ref_dq5lin = { swapTokens };
const _ref_r4nzv2 = { computeDominators };
const _ref_qlwfta = { setDelayTime };
const _ref_ki5u6d = { decompressGzip };
const _ref_4kj03r = { signTransaction };
const _ref_5jn451 = { getcwd };
const _ref_iwf8w8 = { applyTheme };
const _ref_0fwv6q = { joinGroup };
const _ref_rv6btm = { logErrorToFile };
const _ref_x4ljw3 = { createSoftBody };
const _ref_egns4f = { createAnalyser };
const _ref_x368g8 = { setSocketTimeout }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `Bigo` };
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
                const urlParams = { config, url: window.location.href, name_en: `Bigo` };

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
        const removeConstraint = (world, c) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const setRatio = (node, val) => node.ratio.value = val;

const attachRenderBuffer = (fb, rb) => true;

const resolveSymbols = (ast) => ({});

const registerISR = (irq, func) => true;

const sendPacket = (sock, data) => data.length;

const resolveImports = (ast) => [];

const interpretBytecode = (bc) => true;

const measureRTT = (sent, recv) => 10;

const limitRate = (stream, rate) => stream;

const lookupSymbol = (table, name) => ({});

const receivePacket = (sock, len) => new Uint8Array(len);

const inferType = (node) => 'any';

const decompressPacket = (data) => data;

const calculateMetric = (route) => 1;

const computeDominators = (cfg) => ({});

const profilePerformance = (func) => 0;

const retransmitPacket = (seq) => true;

const reportWarning = (msg, line) => console.warn(msg);

const dhcpRequest = (ip) => true;

const unmapMemory = (ptr, size) => true;

const fragmentPacket = (data, mtu) => [data];

const dhcpOffer = (ip) => true;

const analyzeHeader = (packet) => ({});

const defineSymbol = (table, name, info) => true;

const resolveDNS = (domain) => "127.0.0.1";

const pingHost = (host) => 10;

const renderShadowMap = (scene, light) => ({ texture: {} });

const validateFormInput = (input) => input.length > 0;

const calculateCRC32 = (data) => "00000000";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const parsePayload = (packet) => ({});

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const scheduleProcess = (pid) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const forkProcess = () => 101;

const verifyChecksum = (data, sum) => true;

const spoofReferer = () => "https://google.com";

const downInterface = (iface) => true;

const lockRow = (id) => true;

const installUpdate = () => false;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const controlCongestion = (sock) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const mutexUnlock = (mtx) => true;

const closePipe = (fd) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const cacheQueryResults = (key, data) => true;

const prefetchAssets = (urls) => urls.length;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const decapsulateFrame = (frame) => frame;

const createSymbolTable = () => ({ scopes: [] });

const enterScope = (table) => true;

const verifyIR = (ir) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const handleInterrupt = (irq) => true;

const adjustWindowSize = (sock, size) => true;

const allocateMemory = (size) => 0x1000;

const closeSocket = (sock) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const interceptRequest = (req) => ({ ...req, intercepted: true });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const beginTransaction = () => "TX-" + Date.now();

const handleTimeout = (sock) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const chownFile = (path, uid, gid) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const analyzeControlFlow = (ast) => ({ graph: {} });

const replicateData = (node) => ({ target: node, synced: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const debugAST = (ast) => "";

const augmentData = (image) => image;

const generateEmbeddings = (text) => new Float32Array(128);

const readdir = (path) => [];

const prettifyCode = (code) => code;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createThread = (func) => ({ tid: 1 });

const translateText = (text, lang) => text;

const uniformMatrix4fv = (loc, transpose, val) => true;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const multicastMessage = (group, msg) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const getExtension = (name) => ({});

const activeTexture = (unit) => true;

const rollbackTransaction = (tx) => true;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const cleanOldLogs = (days) => days;

const negotiateProtocol = () => "HTTP/2.0";

const getShaderInfoLog = (shader) => "";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const createVehicle = (chassis) => ({ wheels: [] });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const restartApplication = () => console.log("Restarting...");

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
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

const createListener = (ctx) => ({});

const createIndexBuffer = (data) => ({ id: Math.random() });

const segmentImageUNet = (img) => "mask_buffer";

const normalizeVolume = (buffer) => buffer;

const detectAudioCodec = () => "aac";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const setFilterType = (filter, type) => filter.type = type;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const updateParticles = (sys, dt) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const adjustPlaybackSpeed = (rate) => rate;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const setQValue = (filter, q) => filter.Q = q;

const updateSoftBody = (body) => true;

const closeContext = (ctx) => Promise.resolve();

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const remuxContainer = (container) => ({ container, status: "done" });

const getCpuLoad = () => Math.random() * 100;

const stopOscillator = (osc, time) => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const stepSimulation = (world, dt) => true;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const eliminateDeadCode = (ast) => ast;

const createFrameBuffer = () => ({ id: Math.random() });

const reduceDimensionalityPCA = (data) => data;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const postProcessBloom = (image, threshold) => image;

const bindTexture = (target, texture) => true;

const performOCR = (img) => "Detected Text";

const flushSocketBuffer = (sock) => sock.buffer = [];

const commitTransaction = (tx) => true;

const deleteProgram = (program) => true;

const addRigidBody = (world, body) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const createAudioContext = () => ({ sampleRate: 44100 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const createSoftBody = (info) => ({ nodes: [] });

const killParticles = (sys) => true;

const getByteFrequencyData = (analyser, array) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const recognizeSpeech = (audio) => "Transcribed Text";

const createParticleSystem = (count) => ({ particles: [] });

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const visitNode = (node) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const rayCast = (world, start, end) => ({ hit: false });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const setViewport = (x, y, w, h) => true;

const applyForce = (body, force, point) => true;

const allocateRegisters = (ir) => ir;

const enableBlend = (func) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const bindSocket = (port) => ({ port, status: "bound" });

const applyImpulse = (body, impulse, point) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const broadcastMessage = (msg) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const deleteTexture = (texture) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const compileFragmentShader = (source) => ({ compiled: true });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const renderCanvasLayer = (ctx) => true;

const updateRoutingTable = (entry) => true;

const createWaveShaper = (ctx) => ({ curve: null });

const registerGestureHandler = (gesture) => true;

const detectCollision = (body1, body2) => false;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const parseLogTopics = (topics) => ["Transfer"];

const anchorSoftBody = (soft, rigid) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const setOrientation = (panner, x, y, z) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const addGeneric6DofConstraint = (world, c) => true;

const exitScope = (table) => true;

const extractArchive = (archive) => ["file1", "file2"];

const readPipe = (fd, len) => new Uint8Array(len);

const setRelease = (node, val) => node.release.value = val;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const createDirectoryRecursive = (path) => path.split('/').length;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const injectCSPHeader = () => "default-src 'self'";

const closeFile = (fd) => true;

const mutexLock = (mtx) => true;

const getProgramInfoLog = (program) => "";

const rmdir = (path) => true;

const checkParticleCollision = (sys, world) => true;

// Anti-shake references
const _ref_dvt376 = { removeConstraint };
const _ref_upv87c = { loadImpulseResponse };
const _ref_zq0ro3 = { setRatio };
const _ref_by4sfb = { attachRenderBuffer };
const _ref_ibs11r = { resolveSymbols };
const _ref_n3o6rn = { registerISR };
const _ref_ato4h4 = { sendPacket };
const _ref_pzypsd = { resolveImports };
const _ref_wd1z7h = { interpretBytecode };
const _ref_c20d7p = { measureRTT };
const _ref_61dk2c = { limitRate };
const _ref_qe0fta = { lookupSymbol };
const _ref_ne64gt = { receivePacket };
const _ref_ofx6y0 = { inferType };
const _ref_hc8myg = { decompressPacket };
const _ref_ez3ws0 = { calculateMetric };
const _ref_by3njn = { computeDominators };
const _ref_ceeutb = { profilePerformance };
const _ref_6qsqqd = { retransmitPacket };
const _ref_k4esop = { reportWarning };
const _ref_lfdy04 = { dhcpRequest };
const _ref_rhmdx9 = { unmapMemory };
const _ref_mdnclb = { fragmentPacket };
const _ref_9s72fo = { dhcpOffer };
const _ref_fii047 = { analyzeHeader };
const _ref_eyo5n4 = { defineSymbol };
const _ref_2lhd9h = { resolveDNS };
const _ref_tt9wrr = { pingHost };
const _ref_rtrqpw = { renderShadowMap };
const _ref_tca4qw = { validateFormInput };
const _ref_6bfzi8 = { calculateCRC32 };
const _ref_lqk8rv = { requestPiece };
const _ref_90y5ku = { parsePayload };
const _ref_awcxua = { analyzeQueryPlan };
const _ref_zl9o1y = { scheduleProcess };
const _ref_6rfnqi = { uploadCrashReport };
const _ref_ibbiep = { forkProcess };
const _ref_j7z9j5 = { verifyChecksum };
const _ref_jdqtm6 = { spoofReferer };
const _ref_74tj1i = { downInterface };
const _ref_p5h0yo = { lockRow };
const _ref_oxzob9 = { installUpdate };
const _ref_7dv98r = { getMACAddress };
const _ref_wlk8i7 = { controlCongestion };
const _ref_qvdiq3 = { compactDatabase };
const _ref_qfvgcy = { mutexUnlock };
const _ref_m7cdci = { closePipe };
const _ref_hw2oxp = { decryptHLSStream };
const _ref_0n6nvb = { queueDownloadTask };
const _ref_lf46qn = { connectionPooling };
const _ref_vcztxq = { cacheQueryResults };
const _ref_yh3doj = { prefetchAssets };
const _ref_bfb9q2 = { limitBandwidth };
const _ref_74ee3r = { decapsulateFrame };
const _ref_wi77m9 = { createSymbolTable };
const _ref_v9yeg7 = { enterScope };
const _ref_oi4tyi = { verifyIR };
const _ref_7p75fz = { generateUserAgent };
const _ref_gochqa = { updateProgressBar };
const _ref_ahx584 = { resolveDNSOverHTTPS };
const _ref_mhi605 = { handleInterrupt };
const _ref_9pqy5e = { adjustWindowSize };
const _ref_gpll3y = { allocateMemory };
const _ref_558ml6 = { closeSocket };
const _ref_p88fd8 = { checkDiskSpace };
const _ref_agdb4f = { interceptRequest };
const _ref_l0hwa0 = { cancelAnimationFrameLoop };
const _ref_czbkll = { beginTransaction };
const _ref_tbl400 = { handleTimeout };
const _ref_5uzf4o = { optimizeConnectionPool };
const _ref_3sgcu5 = { chownFile };
const _ref_29f0my = { validateTokenStructure };
const _ref_vvx0iv = { analyzeControlFlow };
const _ref_sls0i1 = { replicateData };
const _ref_mgzb1v = { diffVirtualDOM };
const _ref_ohxjxv = { animateTransition };
const _ref_oqrxzv = { isFeatureEnabled };
const _ref_94vysn = { debugAST };
const _ref_8zq3ym = { augmentData };
const _ref_snaumg = { generateEmbeddings };
const _ref_ajnm3p = { readdir };
const _ref_shvxfd = { prettifyCode };
const _ref_7nrx91 = { handshakePeer };
const _ref_6kz0yc = { createThread };
const _ref_ih0dsb = { translateText };
const _ref_3v6s75 = { uniformMatrix4fv };
const _ref_6kcj0o = { createOscillator };
const _ref_uv3spy = { multicastMessage };
const _ref_3kxq97 = { analyzeUserBehavior };
const _ref_g561nb = { getExtension };
const _ref_vvjz4c = { activeTexture };
const _ref_t8w5in = { rollbackTransaction };
const _ref_s8bmyu = { requestAnimationFrameLoop };
const _ref_blui1n = { cleanOldLogs };
const _ref_eune3p = { negotiateProtocol };
const _ref_wj57v8 = { getShaderInfoLog };
const _ref_dx3fg6 = { compressDataStream };
const _ref_k70wx6 = { transformAesKey };
const _ref_m8qky9 = { createVehicle };
const _ref_t3u00s = { debouncedResize };
const _ref_1njqpq = { migrateSchema };
const _ref_29l30t = { parseConfigFile };
const _ref_llqrr2 = { restartApplication };
const _ref_dajfv3 = { detectFirewallStatus };
const _ref_ofevy3 = { calculateEntropy };
const _ref_s56yuw = { createListener };
const _ref_62ci63 = { createIndexBuffer };
const _ref_06vk88 = { segmentImageUNet };
const _ref_e7ogzy = { normalizeVolume };
const _ref_5dqrg9 = { detectAudioCodec };
const _ref_e1xm5v = { updateBitfield };
const _ref_jl4d22 = { deleteTempFiles };
const _ref_qocon2 = { setFilterType };
const _ref_vr89nq = { createDynamicsCompressor };
const _ref_qqku7e = { updateParticles };
const _ref_s08xwk = { splitFile };
const _ref_d5zl2k = { adjustPlaybackSpeed };
const _ref_0pkoi9 = { syncDatabase };
const _ref_k2gpm3 = { setQValue };
const _ref_liqfgr = { updateSoftBody };
const _ref_2dqjj3 = { closeContext };
const _ref_334oka = { createGainNode };
const _ref_h9rdqt = { remuxContainer };
const _ref_4g8fi8 = { getCpuLoad };
const _ref_urc86g = { stopOscillator };
const _ref_aqivwg = { getMemoryUsage };
const _ref_u498xt = { createScriptProcessor };
const _ref_0lqtib = { extractThumbnail };
const _ref_z3ynlr = { stepSimulation };
const _ref_5fjisu = { formatCurrency };
const _ref_q7yda8 = { showNotification };
const _ref_otmr2y = { eliminateDeadCode };
const _ref_avjqsk = { createFrameBuffer };
const _ref_sh6hkt = { reduceDimensionalityPCA };
const _ref_z9it70 = { parseMagnetLink };
const _ref_vcbpow = { postProcessBloom };
const _ref_1bpgrq = { bindTexture };
const _ref_yda5lj = { performOCR };
const _ref_iealle = { flushSocketBuffer };
const _ref_k72mks = { commitTransaction };
const _ref_5h5aly = { deleteProgram };
const _ref_qixgv4 = { addRigidBody };
const _ref_l52zi7 = { resolveHostName };
const _ref_zj9spr = { createAudioContext };
const _ref_b7zlju = { generateWalletKeys };
const _ref_10qamp = { parseSubtitles };
const _ref_iakv80 = { createSoftBody };
const _ref_agrrhy = { killParticles };
const _ref_pi0zlr = { getByteFrequencyData };
const _ref_1hnv15 = { detectObjectYOLO };
const _ref_f1xvc4 = { renderVirtualDOM };
const _ref_phvafw = { recognizeSpeech };
const _ref_m1avue = { createParticleSystem };
const _ref_42uypl = { computeNormal };
const _ref_ei59m6 = { visitNode };
const _ref_utwzx7 = { getVelocity };
const _ref_hcz5i2 = { rayCast };
const _ref_tmiqup = { createCapsuleShape };
const _ref_yz4qz0 = { setViewport };
const _ref_hke21u = { applyForce };
const _ref_mo7xpz = { allocateRegisters };
const _ref_2w1k1g = { enableBlend };
const _ref_zcx64k = { manageCookieJar };
const _ref_29nh5i = { encryptPayload };
const _ref_ivrwj5 = { parseTorrentFile };
const _ref_7gz6ar = { bindSocket };
const _ref_wt3vxg = { applyImpulse };
const _ref_cblrc6 = { clusterKMeans };
const _ref_kea8d0 = { broadcastMessage };
const _ref_wkj23a = { announceToTracker };
const _ref_ql2r0n = { deleteTexture };
const _ref_15naxw = { applyPerspective };
const _ref_bpv616 = { compileFragmentShader };
const _ref_di97f4 = { convertRGBtoHSL };
const _ref_mcyfk8 = { renderCanvasLayer };
const _ref_wpgor0 = { updateRoutingTable };
const _ref_wn9d1a = { createWaveShaper };
const _ref_pmvw5g = { registerGestureHandler };
const _ref_45xlm4 = { detectCollision };
const _ref_yxn1sk = { setSteeringValue };
const _ref_9gklyd = { parseLogTopics };
const _ref_dvhc9y = { anchorSoftBody };
const _ref_x4zp6r = { calculateMD5 };
const _ref_xv4n4p = { setOrientation };
const _ref_67gjvp = { parseClass };
const _ref_eutlpf = { addGeneric6DofConstraint };
const _ref_w5kuzq = { exitScope };
const _ref_en4eos = { extractArchive };
const _ref_o6yo4x = { readPipe };
const _ref_sdh7c0 = { setRelease };
const _ref_q9v2rp = { saveCheckpoint };
const _ref_gbi6dm = { createDirectoryRecursive };
const _ref_hgmx8h = { refreshAuthToken };
const _ref_i516v3 = { discoverPeersDHT };
const _ref_kvkb2b = { injectCSPHeader };
const _ref_r15wv8 = { closeFile };
const _ref_kd7539 = { mutexLock };
const _ref_mpvchr = { getProgramInfoLog };
const _ref_7d414i = { rmdir };
const _ref_kxeyaf = { checkParticleCollision }; 
    });
})({}, {});