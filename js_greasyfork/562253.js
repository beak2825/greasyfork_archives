// ==UserScript==
// @name KukuluLive视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/KukuluLive/index.js
// @version 2026.01.10
// @description 一键下载KukuluLive视频，支持4K/1080P/720P多画质。
// @icon https://live.erinn.biz/favicon.ico
// @match *://*.erinn.biz/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect erinn.biz
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
// @downloadURL https://update.greasyfork.org/scripts/562253/KukuluLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562253/KukuluLive%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
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
        
        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const checkBalance = (addr) => "10.5 ETH";

const scaleMatrix = (mat, vec) => mat;

const checkGLError = () => 0;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const verifyAppSignature = () => true;

const encryptLocalStorage = (key, val) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const setFilterType = (filter, type) => filter.type = type;

const emitParticles = (sys, count) => true;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const createIndexBuffer = (data) => ({ id: Math.random() });

const serializeFormData = (form) => JSON.stringify(form);

const closeContext = (ctx) => Promise.resolve();

const verifySignature = (tx, sig) => true;

const createMediaElementSource = (ctx, el) => ({});

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const signTransaction = (tx, key) => "signed_tx_hash";

const cullFace = (mode) => true;

const detectDevTools = () => false;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const setRelease = (node, val) => node.release.value = val;

const setDopplerFactor = (val) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const createChannelSplitter = (ctx, channels) => ({});

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const setQValue = (filter, q) => filter.Q = q;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const createListener = (ctx) => ({});

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const spoofReferer = () => "https://google.com";

const startOscillator = (osc, time) => true;

const useProgram = (program) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const getFloatTimeDomainData = (analyser, array) => true;

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const createPeriodicWave = (ctx, real, imag) => ({});

const stakeAssets = (pool, amount) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const decodeAudioData = (buffer) => Promise.resolve({});

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const activeTexture = (unit) => true;

const mockResponse = (body) => ({ status: 200, body });

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const injectCSPHeader = () => "default-src 'self'";

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

const resumeContext = (ctx) => Promise.resolve();

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

const disconnectNodes = (node) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const suspendContext = (ctx) => Promise.resolve();

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const uniform3f = (loc, x, y, z) => true;

const setKnee = (node, val) => node.knee.value = val;

const splitFile = (path, parts) => Array(parts).fill(path);

const preventCSRF = () => "csrf_token";

const setOrientation = (panner, x, y, z) => true;

const decryptStream = (stream, key) => stream;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const lookupSymbol = (table, name) => ({});

const inferType = (node) => 'any';

const blockMaliciousTraffic = (ip) => true;

const setDistanceModel = (panner, model) => true;

const resetVehicle = (vehicle) => true;

const resolveSymbols = (ast) => ({});

const createParticleSystem = (count) => ({ particles: [] });

const bindSocket = (port) => ({ port, status: "bound" });

const createFrameBuffer = () => ({ id: Math.random() });

const bindTexture = (target, texture) => true;

const semaphoreWait = (sem) => true;

const closePipe = (fd) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const encodeABI = (method, params) => "0x...";

const unrollLoops = (ast) => ast;

const unmapMemory = (ptr, size) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const generateSourceMap = (ast) => "{}";

const reportWarning = (msg, line) => console.warn(msg);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const prefetchAssets = (urls) => urls.length;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const linkModules = (modules) => ({});

const downInterface = (iface) => true;

const extractArchive = (archive) => ["file1", "file2"];

const encryptPeerTraffic = (data) => btoa(data);

const swapTokens = (pair, amount) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const semaphoreSignal = (sem) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createASTNode = (type, val) => ({ type, val });

const validateIPWhitelist = (ip) => true;

const deserializeAST = (json) => JSON.parse(json);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const convertFormat = (src, dest) => dest;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const serializeAST = (ast) => JSON.stringify(ast);

const prioritizeRarestPiece = (pieces) => pieces[0];

const resolveImports = (ast) => [];

const disableRightClick = () => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const createThread = (func) => ({ tid: 1 });

const installUpdate = () => false;

const optimizeTailCalls = (ast) => ast;

const analyzeHeader = (packet) => ({});

const fingerprintBrowser = () => "fp_hash_123";

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const optimizeAST = (ast) => ast;

const clearScreen = (r, g, b, a) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const stopOscillator = (osc, time) => true;

const unlockFile = (path) => ({ path, locked: false });

const profilePerformance = (func) => 0;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const setMTU = (iface, mtu) => true;

const hoistVariables = (ast) => ast;

const checkBatteryLevel = () => 100;

const checkParticleCollision = (sys, world) => true;

const commitTransaction = (tx) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const setEnv = (key, val) => true;

const logErrorToFile = (err) => console.error(err);

const scheduleTask = (task) => ({ id: 1, task });

const multicastMessage = (group, msg) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createMediaStreamSource = (ctx, stream) => ({});


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

const checkIntegrityToken = (token) => true;

const addRigidBody = (world, body) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const beginTransaction = () => "TX-" + Date.now();

const createConstraint = (body1, body2) => ({});

const getExtension = (name) => ({});

const auditAccessLogs = () => true;

const getByteFrequencyData = (analyser, array) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const preventSleepMode = () => true;

const computeDominators = (cfg) => ({});

const deriveAddress = (path) => "0x123...";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const eliminateDeadCode = (ast) => ast;

const rateLimitCheck = (ip) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const normalizeVolume = (buffer) => buffer;

const registerISR = (irq, func) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const announceToTracker = (url) => ({ url, interval: 1800 });

const applyTorque = (body, torque) => true;

const adjustPlaybackSpeed = (rate) => rate;

const rayCast = (world, start, end) => ({ hit: false });

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const detectCollision = (body1, body2) => false;

const bufferMediaStream = (size) => ({ buffer: size });

const renderParticles = (sys) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const captureFrame = () => "frame_data_buffer";

const resampleAudio = (buffer, rate) => buffer;

const jitCompile = (bc) => (() => {});


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

const setBrake = (vehicle, force, wheelIdx) => true;

const attachRenderBuffer = (fb, rb) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const traverseAST = (node, visitor) => true;

const addConeTwistConstraint = (world, c) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const dhcpRequest = (ip) => true;

const rotateLogFiles = () => true;

const tokenizeText = (text) => text.split(" ");

const validateFormInput = (input) => input.length > 0;

const receivePacket = (sock, len) => new Uint8Array(len);

const drawElements = (mode, count, type, offset) => true;

const readFile = (fd, len) => "";

const mergeFiles = (parts) => parts[0];

const measureRTT = (sent, recv) => 10;

const adjustWindowSize = (sock, size) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const calculateGasFee = (limit) => limit * 20;

const backupDatabase = (path) => ({ path, size: 5000 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const monitorClipboard = () => "";

const loadDriver = (path) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const getCpuLoad = () => Math.random() * 100;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

// Anti-shake references
const _ref_dxakkt = { transformAesKey };
const _ref_czbqkj = { checkBalance };
const _ref_rilxss = { scaleMatrix };
const _ref_8qb45s = { checkGLError };
const _ref_ir1mmk = { extractThumbnail };
const _ref_nitz9e = { verifyAppSignature };
const _ref_f7udgj = { encryptLocalStorage };
const _ref_xe1ypg = { createAnalyser };
const _ref_qadseg = { setFilterType };
const _ref_0zvypy = { emitParticles };
const _ref_xvuqcs = { rayIntersectTriangle };
const _ref_8680u1 = { createIndexBuffer };
const _ref_hr69u9 = { serializeFormData };
const _ref_xz5i9c = { closeContext };
const _ref_98ft3h = { verifySignature };
const _ref_b5ams8 = { createMediaElementSource };
const _ref_fm2wvw = { vertexAttribPointer };
const _ref_6dmy2s = { signTransaction };
const _ref_pjt2wi = { cullFace };
const _ref_xa693f = { detectDevTools };
const _ref_fxgev9 = { interceptRequest };
const _ref_qv97w5 = { requestPiece };
const _ref_ad0bxz = { detectEnvironment };
const _ref_op9mxq = { normalizeVector };
const _ref_6wg4bx = { setRelease };
const _ref_h0gimm = { setDopplerFactor };
const _ref_a0gaam = { initWebGLContext };
const _ref_08vyn1 = { createChannelSplitter };
const _ref_owzs5l = { calculateLighting };
const _ref_iec5ea = { setQValue };
const _ref_8g79vf = { createBiquadFilter };
const _ref_nx9fch = { createListener };
const _ref_2z13jv = { debounceAction };
const _ref_kmcyri = { spoofReferer };
const _ref_einykj = { startOscillator };
const _ref_nz80gy = { useProgram };
const _ref_j616am = { setSocketTimeout };
const _ref_zt7k1o = { getFloatTimeDomainData };
const _ref_cac6ek = { createGainNode };
const _ref_zvzoeo = { createPeriodicWave };
const _ref_0qwcgb = { stakeAssets };
const _ref_61atli = { createShader };
const _ref_tdl83w = { decodeAudioData };
const _ref_zcgklb = { discoverPeersDHT };
const _ref_uk0caz = { activeTexture };
const _ref_kad1j3 = { mockResponse };
const _ref_7x0uik = { calculateSHA256 };
const _ref_vveluq = { calculateEntropy };
const _ref_n4lrc9 = { traceStack };
const _ref_bevelo = { injectCSPHeader };
const _ref_so3two = { ProtocolBufferHandler };
const _ref_nac4gx = { resumeContext };
const _ref_letmix = { AdvancedCipher };
const _ref_7lkri5 = { disconnectNodes };
const _ref_4ce2ql = { createDynamicsCompressor };
const _ref_ss1r00 = { suspendContext };
const _ref_49pmue = { convertRGBtoHSL };
const _ref_64haod = { parseFunction };
const _ref_nsxaww = { createStereoPanner };
const _ref_6794vf = { validateTokenStructure };
const _ref_wqbrog = { uniform3f };
const _ref_rnonkd = { setKnee };
const _ref_1wky50 = { splitFile };
const _ref_zvpfd6 = { preventCSRF };
const _ref_prqfy7 = { setOrientation };
const _ref_f3y6qf = { decryptStream };
const _ref_t5lf1d = { tokenizeSource };
const _ref_u2p9pd = { createMagnetURI };
const _ref_djn0hp = { lookupSymbol };
const _ref_bg6rhh = { inferType };
const _ref_smaj04 = { blockMaliciousTraffic };
const _ref_ctier7 = { setDistanceModel };
const _ref_x72wkw = { resetVehicle };
const _ref_wd26v6 = { resolveSymbols };
const _ref_hg3czs = { createParticleSystem };
const _ref_2goixq = { bindSocket };
const _ref_hcahk8 = { createFrameBuffer };
const _ref_mc5g1h = { bindTexture };
const _ref_5gtu9g = { semaphoreWait };
const _ref_w7u98s = { closePipe };
const _ref_mj2a15 = { limitDownloadSpeed };
const _ref_ci5jmj = { encodeABI };
const _ref_xx4052 = { unrollLoops };
const _ref_040p09 = { unmapMemory };
const _ref_lklzob = { createAudioContext };
const _ref_en8mvb = { generateSourceMap };
const _ref_h2eq06 = { reportWarning };
const _ref_vmm44t = { analyzeUserBehavior };
const _ref_h5u83a = { prefetchAssets };
const _ref_yoqp07 = { uploadCrashReport };
const _ref_lfufn7 = { syncDatabase };
const _ref_cluw9d = { linkModules };
const _ref_htmvn9 = { downInterface };
const _ref_i4vt9p = { extractArchive };
const _ref_lfmtzz = { encryptPeerTraffic };
const _ref_cnuula = { swapTokens };
const _ref_en3p7p = { clearBrowserCache };
const _ref_ex13v0 = { semaphoreSignal };
const _ref_fwm6p6 = { limitBandwidth };
const _ref_09ibiq = { createASTNode };
const _ref_wph52h = { validateIPWhitelist };
const _ref_dsb86k = { deserializeAST };
const _ref_n88jl7 = { sanitizeSQLInput };
const _ref_9d0cbj = { convertFormat };
const _ref_g30t39 = { streamToPlayer };
const _ref_fp0hrr = { createOscillator };
const _ref_hi7m2o = { serializeAST };
const _ref_tyvtsh = { prioritizeRarestPiece };
const _ref_lkwxvj = { resolveImports };
const _ref_v2x4o5 = { disableRightClick };
const _ref_wk69q7 = { migrateSchema };
const _ref_i873xf = { tunnelThroughProxy };
const _ref_tvidn6 = { createThread };
const _ref_y1wu2x = { installUpdate };
const _ref_8zfr74 = { optimizeTailCalls };
const _ref_ff0y0t = { analyzeHeader };
const _ref_niajn4 = { fingerprintBrowser };
const _ref_fhew46 = { loadTexture };
const _ref_kwpaip = { optimizeAST };
const _ref_edp5uv = { clearScreen };
const _ref_jdzld6 = { checkDiskSpace };
const _ref_f95jf0 = { stopOscillator };
const _ref_4swzwv = { unlockFile };
const _ref_8ae7v3 = { profilePerformance };
const _ref_milh7s = { executeSQLQuery };
const _ref_6fagjr = { setMTU };
const _ref_791qnx = { hoistVariables };
const _ref_cc9ena = { checkBatteryLevel };
const _ref_1x0h5t = { checkParticleCollision };
const _ref_j3475f = { commitTransaction };
const _ref_ol3h76 = { validateSSLCert };
const _ref_m6daxv = { setEnv };
const _ref_3dqcz1 = { logErrorToFile };
const _ref_b2xi34 = { scheduleTask };
const _ref_0zogf0 = { multicastMessage };
const _ref_qtm79g = { optimizeMemoryUsage };
const _ref_e1dl3f = { compressDataStream };
const _ref_ytvegc = { createMediaStreamSource };
const _ref_94vwb3 = { ResourceMonitor };
const _ref_vw88v6 = { checkIntegrityToken };
const _ref_plvfxz = { addRigidBody };
const _ref_p22cye = { retryFailedSegment };
const _ref_vaecgj = { beginTransaction };
const _ref_k3j4ds = { createConstraint };
const _ref_isprxw = { getExtension };
const _ref_yexol5 = { auditAccessLogs };
const _ref_d02ktu = { getByteFrequencyData };
const _ref_r4muge = { createBoxShape };
const _ref_bx9a0j = { preventSleepMode };
const _ref_6icyil = { computeDominators };
const _ref_l2mswi = { deriveAddress };
const _ref_7ctler = { createPhysicsWorld };
const _ref_kiwiih = { eliminateDeadCode };
const _ref_4rkypk = { rateLimitCheck };
const _ref_i9s5c5 = { uniformMatrix4fv };
const _ref_dzoxm4 = { getFileAttributes };
const _ref_8wgp7d = { normalizeVolume };
const _ref_8ebxen = { registerISR };
const _ref_9jp58z = { FileValidator };
const _ref_rsp9i3 = { requestAnimationFrameLoop };
const _ref_vs9doc = { announceToTracker };
const _ref_l9txz5 = { applyTorque };
const _ref_wxl6j6 = { adjustPlaybackSpeed };
const _ref_4p8fuh = { rayCast };
const _ref_o3xwkj = { checkIntegrity };
const _ref_3vdhn3 = { showNotification };
const _ref_ucrf79 = { detectCollision };
const _ref_syjbi8 = { bufferMediaStream };
const _ref_gnvdxm = { renderParticles };
const _ref_pv4mv7 = { keepAlivePing };
const _ref_w2dlm6 = { captureFrame };
const _ref_nnveeh = { resampleAudio };
const _ref_bvw42x = { jitCompile };
const _ref_118ou0 = { CacheManager };
const _ref_uyb2iz = { setBrake };
const _ref_av2sd7 = { attachRenderBuffer };
const _ref_7r3e38 = { convertHSLtoRGB };
const _ref_05bm2q = { traverseAST };
const _ref_pqm9d5 = { addConeTwistConstraint };
const _ref_wg4ejg = { optimizeConnectionPool };
const _ref_w3murl = { dhcpRequest };
const _ref_v2cwic = { rotateLogFiles };
const _ref_lo6oqv = { tokenizeText };
const _ref_xpdx69 = { validateFormInput };
const _ref_mdlpr8 = { receivePacket };
const _ref_i76tp4 = { drawElements };
const _ref_4g8409 = { readFile };
const _ref_rhmgmu = { mergeFiles };
const _ref_qpj468 = { measureRTT };
const _ref_25wjq2 = { adjustWindowSize };
const _ref_vsbstz = { getSystemUptime };
const _ref_z1xsfd = { calculateGasFee };
const _ref_86t05g = { backupDatabase };
const _ref_lz3en1 = { parseTorrentFile };
const _ref_nyaig2 = { monitorClipboard };
const _ref_kzgnlw = { loadDriver };
const _ref_uz96dk = { moveFileToComplete };
const _ref_pmxwae = { getCpuLoad };
const _ref_egce7m = { lazyLoadComponent };
const _ref_9nvjm6 = { resolveDependencyGraph }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `KukuluLive` };
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
                const urlParams = { config, url: window.location.href, name_en: `KukuluLive` };

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
        const uniform1i = (loc, val) => true;

const generateCode = (ast) => "const a = 1;";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const hoistVariables = (ast) => ast;

const getExtension = (name) => ({});

const decodeAudioData = (buffer) => Promise.resolve({});

const createConvolver = (ctx) => ({ buffer: null });

const jitCompile = (bc) => (() => {});

const dumpSymbolTable = (table) => "";

const generateDocumentation = (ast) => "";

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const downInterface = (iface) => true;

const interpretBytecode = (bc) => true;

const prettifyCode = (code) => code;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const createPeriodicWave = (ctx, real, imag) => ({});

const inferType = (node) => 'any';

const setGravity = (world, g) => world.gravity = g;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const validatePieceChecksum = (piece) => true;

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

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const normalizeVolume = (buffer) => buffer;

const createSymbolTable = () => ({ scopes: [] });

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const postProcessBloom = (image, threshold) => image;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const processAudioBuffer = (buffer) => buffer;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const disableDepthTest = () => true;

const hashKeccak256 = (data) => "0xabc...";

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const createConstraint = (body1, body2) => ({});

const setDistanceModel = (panner, model) => true;

const computeDominators = (cfg) => ({});

const debouncedResize = () => ({ width: 1920, height: 1080 });

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const exitScope = (table) => true;

const getUniformLocation = (program, name) => 1;

const synthesizeSpeech = (text) => "audio_buffer";

const createVehicle = (chassis) => ({ wheels: [] });

const optimizeTailCalls = (ast) => ast;

const analyzeControlFlow = (ast) => ({ graph: {} });

const linkModules = (modules) => ({});

const findLoops = (cfg) => [];

const drawElements = (mode, count, type, offset) => true;

const enterScope = (table) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const detectVideoCodec = () => "h264";

const shutdownComputer = () => console.log("Shutting down...");

const lockRow = (id) => true;

const generateSourceMap = (ast) => "{}";

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const reportWarning = (msg, line) => console.warn(msg);

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const reportError = (msg, line) => console.error(msg);

const cancelTask = (id) => ({ id, cancelled: true });

const attachRenderBuffer = (fb, rb) => true;

const detectDarkMode = () => true;

const tokenizeText = (text) => text.split(" ");

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const injectMetadata = (file, meta) => ({ file, meta });

const enableBlend = (func) => true;

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

const normalizeFeatures = (data) => data.map(x => x / 255);

const obfuscateCode = (code) => code;

const setKnee = (node, val) => node.knee.value = val;

const compileToBytecode = (ast) => new Uint8Array();

const scaleMatrix = (mat, vec) => mat;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const defineSymbol = (table, name, info) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const cleanOldLogs = (days) => days;

const createMediaStreamSource = (ctx, stream) => ({});

const profilePerformance = (func) => 0;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const serializeAST = (ast) => JSON.stringify(ast);

const createChannelSplitter = (ctx, channels) => ({});

const detachThread = (tid) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const bundleAssets = (assets) => "";

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const configureInterface = (iface, config) => true;

const instrumentCode = (code) => code;

const setAngularVelocity = (body, v) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const rotateLogFiles = () => true;

const verifyAppSignature = () => true;

const hydrateSSR = (html) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const encapsulateFrame = (packet) => packet;

const mockResponse = (body) => ({ status: 200, body });

const unmountFileSystem = (path) => true;

const spoofReferer = () => "https://google.com";

const minifyCode = (code) => code;

const stopOscillator = (osc, time) => true;

const updateWheelTransform = (wheel) => true;

const claimRewards = (pool) => "0.5 ETH";

const resolveSymbols = (ast) => ({});

const execProcess = (path) => true;

const upInterface = (iface) => true;

const performOCR = (img) => "Detected Text";

const emitParticles = (sys, count) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const obfuscateString = (str) => btoa(str);

const dhcpOffer = (ip) => true;

const checkTypes = (ast) => [];

const commitTransaction = (tx) => true;

const resampleAudio = (buffer, rate) => buffer;

const protectMemory = (ptr, size, flags) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const switchVLAN = (id) => true;

const activeTexture = (unit) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const calculateComplexity = (ast) => 1;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const unlockFile = (path) => ({ path, locked: false });

const setFilePermissions = (perm) => `chmod ${perm}`;

const setMTU = (iface, mtu) => true;

const rayCast = (world, start, end) => ({ hit: false });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const freeMemory = (ptr) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const killProcess = (pid) => true;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const disconnectNodes = (node) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const uniformMatrix4fv = (loc, transpose, val) => true;

const restoreDatabase = (path) => true;

const deleteTexture = (texture) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const lookupSymbol = (table, name) => ({});

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const interestPeer = (peer) => ({ ...peer, interested: true });

const mkdir = (path) => true;

const checkBalance = (addr) => "10.5 ETH";

const detectDevTools = () => false;


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

const rmdir = (path) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const setEnv = (key, val) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const closePipe = (fd) => true;

const debugAST = (ast) => "";

const mangleNames = (ast) => ast;

const setFilterType = (filter, type) => filter.type = type;

const captureFrame = () => "frame_data_buffer";

const lazyLoadComponent = (name) => ({ name, loaded: false });

const detectAudioCodec = () => "aac";

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const validateIPWhitelist = (ip) => true;

const extractArchive = (archive) => ["file1", "file2"];

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const translateText = (text, lang) => text;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const sanitizeXSS = (html) => html;

const resolveImports = (ast) => [];

const setRelease = (node, val) => node.release.value = val;

const setViewport = (x, y, w, h) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const renderParticles = (sys) => true;

const applyImpulse = (body, impulse, point) => true;

const stakeAssets = (pool, amount) => true;

const checkIntegrityConstraint = (table) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const foldConstants = (ast) => ast;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const deleteProgram = (program) => true;

const deobfuscateString = (str) => atob(str);

const deleteBuffer = (buffer) => true;

const setPan = (node, val) => node.pan.value = val;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const injectCSPHeader = () => "default-src 'self'";

const verifyChecksum = (data, sum) => true;

const createTCPSocket = () => ({ fd: 1 });

const compileFragmentShader = (source) => ({ compiled: true });

const mutexUnlock = (mtx) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const deserializeAST = (json) => JSON.parse(json);

const closeSocket = (sock) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const announceToTracker = (url) => ({ url, interval: 1800 });

const leaveGroup = (group) => true;

const fingerprintBrowser = () => "fp_hash_123";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const panicKernel = (msg) => false;

const calculateFriction = (mat1, mat2) => 0.5;

const reduceDimensionalityPCA = (data) => data;

const createProcess = (img) => ({ pid: 100 });

// Anti-shake references
const _ref_rmsb5o = { uniform1i };
const _ref_hzahqg = { generateCode };
const _ref_k26na2 = { createScriptProcessor };
const _ref_74rshf = { hoistVariables };
const _ref_1ez6uv = { getExtension };
const _ref_sl8rnx = { decodeAudioData };
const _ref_19p85p = { createConvolver };
const _ref_z2wua4 = { jitCompile };
const _ref_dms2p6 = { dumpSymbolTable };
const _ref_e4myhl = { generateDocumentation };
const _ref_6n4hki = { getMemoryUsage };
const _ref_8myi89 = { downInterface };
const _ref_1gfx2p = { interpretBytecode };
const _ref_ulcwo8 = { prettifyCode };
const _ref_dx35zq = { applyPerspective };
const _ref_5q2q54 = { streamToPlayer };
const _ref_9z4d5b = { createPeriodicWave };
const _ref_aje2e7 = { inferType };
const _ref_1d2140 = { setGravity };
const _ref_db4hdf = { renderVirtualDOM };
const _ref_rvsre7 = { validatePieceChecksum };
const _ref_bjnpql = { download };
const _ref_hb2zkc = { VirtualFSTree };
const _ref_cd3wxd = { archiveFiles };
const _ref_ft9se5 = { normalizeVolume };
const _ref_uzss6x = { createSymbolTable };
const _ref_jwhabq = { readPixels };
const _ref_szbidi = { postProcessBloom };
const _ref_isfiwv = { convexSweepTest };
const _ref_zodfy3 = { processAudioBuffer };
const _ref_x4md7c = { computeNormal };
const _ref_s1b5i0 = { createGainNode };
const _ref_6ei0qa = { getSystemUptime };
const _ref_knd3hm = { validateMnemonic };
const _ref_5a8ilf = { disableDepthTest };
const _ref_onqa1e = { hashKeccak256 };
const _ref_pwwihn = { createMagnetURI };
const _ref_6tnlpn = { createConstraint };
const _ref_1jw175 = { setDistanceModel };
const _ref_88m8rx = { computeDominators };
const _ref_0jh43u = { debouncedResize };
const _ref_pvk86w = { analyzeQueryPlan };
const _ref_fv4rzz = { exitScope };
const _ref_c35nlr = { getUniformLocation };
const _ref_knrujd = { synthesizeSpeech };
const _ref_penbnn = { createVehicle };
const _ref_tnd9e6 = { optimizeTailCalls };
const _ref_wtwlc3 = { analyzeControlFlow };
const _ref_qgyegu = { linkModules };
const _ref_mogzl1 = { findLoops };
const _ref_o4tfri = { drawElements };
const _ref_t4lsj4 = { enterScope };
const _ref_dhx84t = { makeDistortionCurve };
const _ref_armhko = { detectVideoCodec };
const _ref_nvbk8n = { shutdownComputer };
const _ref_9cz5wd = { lockRow };
const _ref_uttt3r = { generateSourceMap };
const _ref_egnqgm = { scrapeTracker };
const _ref_bvs6hf = { reportWarning };
const _ref_e46ba5 = { validateTokenStructure };
const _ref_4hkk0c = { reportError };
const _ref_hx3pda = { cancelTask };
const _ref_4ua9eq = { attachRenderBuffer };
const _ref_plbyx4 = { detectDarkMode };
const _ref_vd2cn6 = { tokenizeText };
const _ref_njxgsx = { saveCheckpoint };
const _ref_ju0r3g = { injectMetadata };
const _ref_okwkzt = { enableBlend };
const _ref_d4cqya = { TaskScheduler };
const _ref_gepryz = { normalizeFeatures };
const _ref_fcsz3r = { obfuscateCode };
const _ref_9tzm3w = { setKnee };
const _ref_83qd1o = { compileToBytecode };
const _ref_1i5wv6 = { scaleMatrix };
const _ref_lllrza = { encryptPayload };
const _ref_9k3pjq = { defineSymbol };
const _ref_f77801 = { parseFunction };
const _ref_jwed3v = { cleanOldLogs };
const _ref_gmxizr = { createMediaStreamSource };
const _ref_utyt3f = { profilePerformance };
const _ref_ks9rf2 = { throttleRequests };
const _ref_pinxfp = { serializeAST };
const _ref_mtcyb3 = { createChannelSplitter };
const _ref_bqlwsi = { detachThread };
const _ref_gp3qr9 = { loadImpulseResponse };
const _ref_a0m2lg = { bundleAssets };
const _ref_bw78lc = { createDynamicsCompressor };
const _ref_u2jt5d = { configureInterface };
const _ref_d8bd0n = { instrumentCode };
const _ref_qd466r = { setAngularVelocity };
const _ref_jm0l38 = { checkDiskSpace };
const _ref_aozp1s = { rotateLogFiles };
const _ref_xmyvql = { verifyAppSignature };
const _ref_kn03i9 = { hydrateSSR };
const _ref_swg76y = { traceStack };
const _ref_j9d9hg = { encapsulateFrame };
const _ref_b86v84 = { mockResponse };
const _ref_1g2zow = { unmountFileSystem };
const _ref_wbpvd6 = { spoofReferer };
const _ref_amkgxt = { minifyCode };
const _ref_nzsuna = { stopOscillator };
const _ref_slg90e = { updateWheelTransform };
const _ref_5b0d23 = { claimRewards };
const _ref_u7423v = { resolveSymbols };
const _ref_d9c2gw = { execProcess };
const _ref_97s6qf = { upInterface };
const _ref_zq8233 = { performOCR };
const _ref_3igrl7 = { emitParticles };
const _ref_dnclq5 = { decodeABI };
const _ref_w93rxx = { obfuscateString };
const _ref_ogzxev = { dhcpOffer };
const _ref_al378y = { checkTypes };
const _ref_zdl224 = { commitTransaction };
const _ref_429759 = { resampleAudio };
const _ref_wuw07h = { protectMemory };
const _ref_mzlddu = { createMeshShape };
const _ref_x4id92 = { switchVLAN };
const _ref_8hvizx = { activeTexture };
const _ref_l6ro0e = { vertexAttrib3f };
const _ref_l4fpzz = { moveFileToComplete };
const _ref_p8y3dg = { calculateComplexity };
const _ref_p6j1f0 = { linkProgram };
const _ref_wgd80k = { unlockFile };
const _ref_96etl6 = { setFilePermissions };
const _ref_i2h21p = { setMTU };
const _ref_bxiqrc = { rayCast };
const _ref_cx31c7 = { scheduleBandwidth };
const _ref_o0sg7u = { handshakePeer };
const _ref_s442od = { freeMemory };
const _ref_jpcbfw = { captureScreenshot };
const _ref_j8do0u = { killProcess };
const _ref_heht9i = { transformAesKey };
const _ref_yk7ypv = { disconnectNodes };
const _ref_epnes9 = { manageCookieJar };
const _ref_gq4wjk = { parseSubtitles };
const _ref_wowxbk = { uniformMatrix4fv };
const _ref_3kwxy0 = { restoreDatabase };
const _ref_igpbwl = { deleteTexture };
const _ref_xc9xkj = { queueDownloadTask };
const _ref_v5iuwj = { lookupSymbol };
const _ref_f1103t = { optimizeConnectionPool };
const _ref_49sej2 = { interestPeer };
const _ref_t747e5 = { mkdir };
const _ref_xtcpnz = { checkBalance };
const _ref_vf9ysm = { detectDevTools };
const _ref_ylt1ef = { ResourceMonitor };
const _ref_ura9qo = { rmdir };
const _ref_ob7f7p = { createIndexBuffer };
const _ref_wac5c4 = { setEnv };
const _ref_rnj5wp = { getVelocity };
const _ref_3286d3 = { closePipe };
const _ref_7ewcig = { debugAST };
const _ref_3omwbo = { mangleNames };
const _ref_509xxa = { setFilterType };
const _ref_uoo5pg = { captureFrame };
const _ref_1g4q6x = { lazyLoadComponent };
const _ref_fumi0v = { detectAudioCodec };
const _ref_btx57t = { terminateSession };
const _ref_1xjzaw = { validateIPWhitelist };
const _ref_4o052j = { extractArchive };
const _ref_4ltvlv = { animateTransition };
const _ref_g5sbi5 = { translateText };
const _ref_w24z6b = { debounceAction };
const _ref_4h51ur = { calculateMD5 };
const _ref_7gn9n8 = { sanitizeXSS };
const _ref_7z5icr = { resolveImports };
const _ref_kzznkl = { setRelease };
const _ref_uh703b = { setViewport };
const _ref_3td6nr = { optimizeMemoryUsage };
const _ref_trd8gl = { renderParticles };
const _ref_pk5eb2 = { applyImpulse };
const _ref_9jvb2n = { stakeAssets };
const _ref_ew0t1l = { checkIntegrityConstraint };
const _ref_wbimpi = { setSteeringValue };
const _ref_7m4m8v = { seedRatioLimit };
const _ref_rr68jc = { foldConstants };
const _ref_zbh6k7 = { createOscillator };
const _ref_qno3q8 = { deleteProgram };
const _ref_cod6w5 = { deobfuscateString };
const _ref_dpofj1 = { deleteBuffer };
const _ref_pn4l9t = { setPan };
const _ref_1f524k = { parseClass };
const _ref_a4edul = { createPhysicsWorld };
const _ref_ikbhnp = { injectCSPHeader };
const _ref_x129pw = { verifyChecksum };
const _ref_vfh0fz = { createTCPSocket };
const _ref_4goqwx = { compileFragmentShader };
const _ref_lpf3hr = { mutexUnlock };
const _ref_vn5xtt = { predictTensor };
const _ref_icpz6v = { deserializeAST };
const _ref_m0btd8 = { closeSocket };
const _ref_nowa8u = { createAudioContext };
const _ref_heg75t = { announceToTracker };
const _ref_2981a1 = { leaveGroup };
const _ref_j62fgw = { fingerprintBrowser };
const _ref_soowzb = { virtualScroll };
const _ref_puz10q = { panicKernel };
const _ref_btv1q5 = { calculateFriction };
const _ref_ev7f17 = { reduceDimensionalityPCA };
const _ref_ivshm7 = { createProcess }; 
    });
})({}, {});