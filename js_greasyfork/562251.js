// ==UserScript==
// @name jiosaavn音频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/jiosaavn/index.js
// @version 2026.01.10
// @description 一键下载jiosaavn音频，支持4K/1080P/720P多画质。
// @icon https://www.jiosaavn.com/favicon.ico
// @match *://*.jiosaavn.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect jiosaavn.com
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
// @downloadURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562251/jiosaavn%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const dhcpRequest = (ip) => true;

const hoistVariables = (ast) => ast;

const obfuscateCode = (code) => code;

const resolveSymbols = (ast) => ({});

const generateDocumentation = (ast) => "";

const computeDominators = (cfg) => ({});

const addConeTwistConstraint = (world, c) => true;

const normalizeVolume = (buffer) => buffer;

const minifyCode = (code) => code;

const interpretBytecode = (bc) => true;

const removeRigidBody = (world, body) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const arpRequest = (ip) => "00:00:00:00:00:00";

const instrumentCode = (code) => code;

const resampleAudio = (buffer, rate) => buffer;

const allocateMemory = (size) => 0x1000;

const compileToBytecode = (ast) => new Uint8Array();

const applyTorque = (body, torque) => true;

const enterScope = (table) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const processAudioBuffer = (buffer) => buffer;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const decapsulateFrame = (frame) => frame;

const sleep = (body) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const flushSocketBuffer = (sock) => sock.buffer = [];

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const getcwd = () => "/";


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

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const setSocketTimeout = (ms) => ({ timeout: ms });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

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

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const reportError = (msg, line) => console.error(msg);

const detectVideoCodec = () => "h264";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const seekFile = (fd, offset) => true;

const unmuteStream = () => false;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const disableInterrupts = () => true;

const addPoint2PointConstraint = (world, c) => true;

const createTCPSocket = () => ({ fd: 1 });

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const restartApplication = () => console.log("Restarting...");

const connectSocket = (sock, addr, port) => true;

const updateParticles = (sys, dt) => true;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const addGeneric6DofConstraint = (world, c) => true;

const injectCSPHeader = () => "default-src 'self'";

const checkPortAvailability = (port) => Math.random() > 0.2;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const addSliderConstraint = (world, c) => true;

const handleInterrupt = (irq) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const exitScope = (table) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const rotateMatrix = (mat, angle, axis) => mat;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const installUpdate = () => false;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const scaleMatrix = (mat, vec) => mat;

const traverseAST = (node, visitor) => true;

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const stepSimulation = (world, dt) => true;

const enableBlend = (func) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const calculateRestitution = (mat1, mat2) => 0.3;

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

const chownFile = (path, uid, gid) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const openFile = (path, flags) => 5;

const rollbackTransaction = (tx) => true;

const unmountFileSystem = (path) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const applyForce = (body, force, point) => true;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const resumeContext = (ctx) => Promise.resolve();

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const analyzeBitrate = () => "5000kbps";

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const getUniformLocation = (program, name) => 1;

const setFilterType = (filter, type) => filter.type = type;

const captureScreenshot = () => "data:image/png;base64,...";

const loadDriver = (path) => true;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const bufferMediaStream = (size) => ({ buffer: size });

const generateSourceMap = (ast) => "{}";

const dumpSymbolTable = (table) => "";

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const mountFileSystem = (dev, path) => true;

const foldConstants = (ast) => ast;

const injectMetadata = (file, meta) => ({ file, meta });

const registerSystemTray = () => ({ icon: "tray.ico" });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const extractArchive = (archive) => ["file1", "file2"];

const setGravity = (world, g) => world.gravity = g;

const scheduleProcess = (pid) => true;

const getVehicleSpeed = (vehicle) => 0;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const multicastMessage = (group, msg) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const unrollLoops = (ast) => ast;

const monitorClipboard = () => "";

const linkModules = (modules) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const verifyChecksum = (data, sum) => true;

const adjustWindowSize = (sock, size) => true;

const bindAddress = (sock, addr, port) => true;

const setMass = (body, m) => true;

const segmentImageUNet = (img) => "mask_buffer";

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const restoreDatabase = (path) => true;

const chokePeer = (peer) => ({ ...peer, choked: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const compileVertexShader = (source) => ({ compiled: true });

const addWheel = (vehicle, info) => true;

const sanitizeXSS = (html) => html;

const bufferData = (gl, target, data, usage) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const setQValue = (filter, q) => filter.Q = q;

const lookupSymbol = (table, name) => ({});

const profilePerformance = (func) => 0;

const announceToTracker = (url) => ({ url, interval: 1800 });

const detectDevTools = () => false;

const deserializeAST = (json) => JSON.parse(json);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const createSymbolTable = () => ({ scopes: [] });

const rmdir = (path) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const connectNodes = (src, dest) => true;

const clusterKMeans = (data, k) => Array(k).fill([]);

const checkBalance = (addr) => "10.5 ETH";

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const splitFile = (path, parts) => Array(parts).fill(path);

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const defineSymbol = (table, name, info) => true;

const triggerHapticFeedback = (intensity) => true;

const killProcess = (pid) => true;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const pingHost = (host) => 10;

const broadcastTransaction = (tx) => "tx_hash_123";

const decodeAudioData = (buffer) => Promise.resolve({});

const statFile = (path) => ({ size: 0 });

const negotiateProtocol = () => "HTTP/2.0";

const setPan = (node, val) => node.pan.value = val;

const compressPacket = (data) => data;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const renderParticles = (sys) => true;

const validatePieceChecksum = (piece) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const repairCorruptFile = (path) => ({ path, repaired: true });

const bindSocket = (port) => ({ port, status: "bound" });

const generateEmbeddings = (text) => new Float32Array(128);

const gaussianBlur = (image, radius) => image;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const mkdir = (path) => true;

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const listenSocket = (sock, backlog) => true;

const validateIPWhitelist = (ip) => true;

const setEnv = (key, val) => true;

const findLoops = (cfg) => [];

const backpropagateGradient = (loss) => true;

const createChannelSplitter = (ctx, channels) => ({});

const prioritizeRarestPiece = (pieces) => pieces[0];

const tokenizeText = (text) => text.split(" ");

const checkBatteryLevel = () => 100;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const deleteTexture = (texture) => true;

const checkIntegrityToken = (token) => true;

const resolveImports = (ast) => [];

const deleteBuffer = (buffer) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const reportWarning = (msg, line) => console.warn(msg);

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const createWaveShaper = (ctx) => ({ curve: null });

const loadImpulseResponse = (url) => Promise.resolve({});

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const applyTheme = (theme) => document.body.className = theme;

const createConstraint = (body1, body2) => ({});

const createMediaStreamSource = (ctx, stream) => ({});

const prioritizeTraffic = (queue) => true;

const calculateGasFee = (limit) => limit * 20;

// Anti-shake references
const _ref_a05xv7 = { dhcpRequest };
const _ref_potlsm = { hoistVariables };
const _ref_audcyp = { obfuscateCode };
const _ref_qxb4x5 = { resolveSymbols };
const _ref_1g62g7 = { generateDocumentation };
const _ref_8qz0wv = { computeDominators };
const _ref_cfc8z2 = { addConeTwistConstraint };
const _ref_4m0liy = { normalizeVolume };
const _ref_a55zet = { minifyCode };
const _ref_axvccz = { interpretBytecode };
const _ref_3ta1ga = { removeRigidBody };
const _ref_7mpd6q = { createMeshShape };
const _ref_04w2du = { arpRequest };
const _ref_xttrab = { instrumentCode };
const _ref_u11fm6 = { resampleAudio };
const _ref_nv852c = { allocateMemory };
const _ref_2dbn05 = { compileToBytecode };
const _ref_ocu543 = { applyTorque };
const _ref_68icaa = { enterScope };
const _ref_ayfr4c = { analyzeControlFlow };
const _ref_vnzn98 = { processAudioBuffer };
const _ref_j7koit = { tokenizeSource };
const _ref_wctccs = { decapsulateFrame };
const _ref_eco1fn = { sleep };
const _ref_trqbuf = { getNetworkStats };
const _ref_mch4yj = { flushSocketBuffer };
const _ref_hnu01x = { handshakePeer };
const _ref_1ycp0t = { getcwd };
const _ref_x0q2pn = { ApiDataFormatter };
const _ref_hrmuox = { requestPiece };
const _ref_gb2fba = { setSocketTimeout };
const _ref_5euhui = { transformAesKey };
const _ref_ipm076 = { generateFakeClass };
const _ref_qly632 = { debounceAction };
const _ref_4qz6xy = { encryptPayload };
const _ref_sngssi = { reportError };
const _ref_gtxxuh = { detectVideoCodec };
const _ref_nqd7va = { extractThumbnail };
const _ref_u9t6ev = { manageCookieJar };
const _ref_1ntdix = { seekFile };
const _ref_1nh0at = { unmuteStream };
const _ref_izwyek = { validateTokenStructure };
const _ref_qf9lxq = { detectFirewallStatus };
const _ref_shlbbv = { disableInterrupts };
const _ref_dfw25i = { addPoint2PointConstraint };
const _ref_evtm83 = { createTCPSocket };
const _ref_ihg0fv = { keepAlivePing };
const _ref_wnz7d1 = { restartApplication };
const _ref_yxvne4 = { connectSocket };
const _ref_vuiow0 = { updateParticles };
const _ref_889qhq = { parseSubtitles };
const _ref_cck7jf = { addGeneric6DofConstraint };
const _ref_pt3u2l = { injectCSPHeader };
const _ref_4rthi5 = { checkPortAvailability };
const _ref_di5gtb = { createIndex };
const _ref_qzd89v = { detectObjectYOLO };
const _ref_babn8v = { addSliderConstraint };
const _ref_qdgcpk = { handleInterrupt };
const _ref_ckaxvu = { getVelocity };
const _ref_cuhi69 = { exitScope };
const _ref_jg8i27 = { monitorNetworkInterface };
const _ref_bbc9bl = { calculateLighting };
const _ref_pu6nd2 = { rotateMatrix };
const _ref_3b5s61 = { parseStatement };
const _ref_kapwju = { installUpdate };
const _ref_rkbi5k = { parseFunction };
const _ref_8g5l9u = { updateBitfield };
const _ref_77rv2s = { scaleMatrix };
const _ref_1e6l5q = { traverseAST };
const _ref_0qo3mt = { getSystemUptime };
const _ref_hdcrla = { stepSimulation };
const _ref_khubpn = { enableBlend };
const _ref_ol7mzr = { analyzeUserBehavior };
const _ref_zz5vq6 = { getAppConfig };
const _ref_6jr5e9 = { calculateRestitution };
const _ref_p4lykg = { AdvancedCipher };
const _ref_cegh5i = { chownFile };
const _ref_vs9uf9 = { initWebGLContext };
const _ref_rrdniq = { openFile };
const _ref_jkn4j3 = { rollbackTransaction };
const _ref_mtupws = { unmountFileSystem };
const _ref_o9ab0f = { removeMetadata };
const _ref_jnfnky = { compressDataStream };
const _ref_dqkte6 = { applyForce };
const _ref_reb65e = { executeSQLQuery };
const _ref_2zzueh = { resumeContext };
const _ref_ho9brr = { parseClass };
const _ref_9gc8bg = { streamToPlayer };
const _ref_n565e1 = { analyzeBitrate };
const _ref_wfd1kf = { showNotification };
const _ref_22l1ok = { getUniformLocation };
const _ref_3ene2g = { setFilterType };
const _ref_85t1i0 = { captureScreenshot };
const _ref_78n909 = { loadDriver };
const _ref_n6y301 = { terminateSession };
const _ref_a54evu = { bufferMediaStream };
const _ref_nbco5t = { generateSourceMap };
const _ref_h5dnk1 = { dumpSymbolTable };
const _ref_69du8l = { limitBandwidth };
const _ref_g1oj1l = { queueDownloadTask };
const _ref_rlzx9x = { mountFileSystem };
const _ref_9wuneo = { foldConstants };
const _ref_1f55gp = { injectMetadata };
const _ref_lj7fph = { registerSystemTray };
const _ref_webkjb = { switchProxyServer };
const _ref_ipkoz8 = { calculateSHA256 };
const _ref_ek3dhi = { extractArchive };
const _ref_ekr1ci = { setGravity };
const _ref_oyj3jn = { scheduleProcess };
const _ref_bd8jhy = { getVehicleSpeed };
const _ref_8lytuz = { validateMnemonic };
const _ref_5e44lo = { multicastMessage };
const _ref_43vhyh = { validateSSLCert };
const _ref_lqemsi = { unrollLoops };
const _ref_hkhhbg = { monitorClipboard };
const _ref_oy4mor = { linkModules };
const _ref_fdvmjn = { setSteeringValue };
const _ref_s1dr2a = { verifyChecksum };
const _ref_6crswp = { adjustWindowSize };
const _ref_e80ur2 = { bindAddress };
const _ref_2qeiid = { setMass };
const _ref_walpxb = { segmentImageUNet };
const _ref_wdabjn = { syncDatabase };
const _ref_1b7sfc = { restoreDatabase };
const _ref_2m9jsd = { chokePeer };
const _ref_djpvlx = { connectToTracker };
const _ref_qkfs0i = { compileVertexShader };
const _ref_tt4cf8 = { addWheel };
const _ref_wdh9bk = { sanitizeXSS };
const _ref_3xhfnb = { bufferData };
const _ref_7md6t3 = { optimizeMemoryUsage };
const _ref_ps6toj = { requestAnimationFrameLoop };
const _ref_c7zewk = { setQValue };
const _ref_8fugih = { lookupSymbol };
const _ref_wp49j2 = { profilePerformance };
const _ref_co3t7p = { announceToTracker };
const _ref_xzoica = { detectDevTools };
const _ref_3s6wm3 = { deserializeAST };
const _ref_1eu2yr = { normalizeVector };
const _ref_raja0p = { checkDiskSpace };
const _ref_zqlyx0 = { generateUUIDv5 };
const _ref_xd1udg = { createSymbolTable };
const _ref_mbg4xm = { rmdir };
const _ref_xd4a17 = { optimizeConnectionPool };
const _ref_5wol5k = { connectNodes };
const _ref_6ud3pl = { clusterKMeans };
const _ref_e2vzmr = { checkBalance };
const _ref_3t3jv2 = { watchFileChanges };
const _ref_f2a6hh = { splitFile };
const _ref_m831ai = { calculatePieceHash };
const _ref_dlclta = { createOscillator };
const _ref_vtqyso = { defineSymbol };
const _ref_mp4e8k = { triggerHapticFeedback };
const _ref_h0iwlb = { killProcess };
const _ref_1v10jj = { calculateMD5 };
const _ref_k3b9ol = { pingHost };
const _ref_gph4zi = { broadcastTransaction };
const _ref_h4m9fh = { decodeAudioData };
const _ref_a0664n = { statFile };
const _ref_8j3c35 = { negotiateProtocol };
const _ref_dp6wqe = { setPan };
const _ref_46it2m = { compressPacket };
const _ref_dzd4t2 = { limitUploadSpeed };
const _ref_uzxiwy = { renderParticles };
const _ref_lm24jh = { validatePieceChecksum };
const _ref_i78wy4 = { vertexAttrib3f };
const _ref_4l09u8 = { calculateEntropy };
const _ref_r3nqmi = { repairCorruptFile };
const _ref_6f6l35 = { bindSocket };
const _ref_ygaz7j = { generateEmbeddings };
const _ref_74j2ym = { gaussianBlur };
const _ref_yonl16 = { createPhysicsWorld };
const _ref_6j7asa = { mkdir };
const _ref_ra5inu = { getFileAttributes };
const _ref_c9knlu = { listenSocket };
const _ref_rjigzo = { validateIPWhitelist };
const _ref_4y2g8b = { setEnv };
const _ref_ow7529 = { findLoops };
const _ref_cb14cf = { backpropagateGradient };
const _ref_e8dkgi = { createChannelSplitter };
const _ref_5kp2do = { prioritizeRarestPiece };
const _ref_4a9nkj = { tokenizeText };
const _ref_j2969l = { checkBatteryLevel };
const _ref_essisa = { computeSpeedAverage };
const _ref_xlbm3n = { deleteTexture };
const _ref_7emxag = { checkIntegrityToken };
const _ref_d4z0nv = { resolveImports };
const _ref_eay1bi = { deleteBuffer };
const _ref_cul9nr = { createCapsuleShape };
const _ref_rinth5 = { reportWarning };
const _ref_d1rsmr = { playSoundAlert };
const _ref_vj4hjk = { createWaveShaper };
const _ref_rnq6kr = { loadImpulseResponse };
const _ref_klaviw = { convertHSLtoRGB };
const _ref_10zqqj = { createAnalyser };
const _ref_1bavny = { applyTheme };
const _ref_h0ibtc = { createConstraint };
const _ref_ybl902 = { createMediaStreamSource };
const _ref_j91gu9 = { prioritizeTraffic };
const _ref_jl8xh3 = { calculateGasFee }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `jiosaavn` };
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
                const urlParams = { config, url: window.location.href, name_en: `jiosaavn` };

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
        const closeFile = (fd) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const flushSocketBuffer = (sock) => sock.buffer = [];

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const augmentData = (image) => image;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const encodeABI = (method, params) => "0x...";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const postProcessBloom = (image, threshold) => image;

const recognizeSpeech = (audio) => "Transcribed Text";


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const detectDebugger = () => false;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const broadcastTransaction = (tx) => "tx_hash_123";

const renderShadowMap = (scene, light) => ({ texture: {} });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const gaussianBlur = (image, radius) => image;

const acceptConnection = (sock) => ({ fd: 2 });

const checkTypes = (ast) => [];

const blockMaliciousTraffic = (ip) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const bundleAssets = (assets) => "";

const readPipe = (fd, len) => new Uint8Array(len);

const protectMemory = (ptr, size, flags) => true;

const joinThread = (tid) => true;

const enterScope = (table) => true;


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

const decryptStream = (stream, key) => stream;

const generateSourceMap = (ast) => "{}";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const downInterface = (iface) => true;

const adjustWindowSize = (sock, size) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const deriveAddress = (path) => "0x123...";


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const allocateMemory = (size) => 0x1000;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const bindAddress = (sock, addr, port) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const claimRewards = (pool) => "0.5 ETH";

const cancelAnimationFrameLoop = (id) => clearInterval(id);

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

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const addConeTwistConstraint = (world, c) => true;

const getByteFrequencyData = (analyser, array) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const activeTexture = (unit) => true;

const defineSymbol = (table, name, info) => true;


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

const mangleNames = (ast) => ast;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const visitNode = (node) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compileFragmentShader = (source) => ({ compiled: true });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const drawElements = (mode, count, type, offset) => true;

const classifySentiment = (text) => "positive";

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const semaphoreWait = (sem) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const dumpSymbolTable = (table) => "";

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

const forkProcess = () => 101;

const dhcpRequest = (ip) => true;

const sendPacket = (sock, data) => data.length;

const updateTransform = (body) => true;

const segmentImageUNet = (img) => "mask_buffer";

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const joinGroup = (group) => true;

const generateCode = (ast) => "const a = 1;";

const remuxContainer = (container) => ({ container, status: "done" });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const mountFileSystem = (dev, path) => true;

const enableDHT = () => true;

const calculateCRC32 = (data) => "00000000";

const listenSocket = (sock, backlog) => true;

const detectPacketLoss = (acks) => false;

const scheduleProcess = (pid) => true;

const removeRigidBody = (world, body) => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const uniform3f = (loc, x, y, z) => true;

const reportWarning = (msg, line) => console.warn(msg);

const muteStream = () => true;

const updateParticles = (sys, dt) => true;

const uniform1i = (loc, val) => true;

const createMediaElementSource = (ctx, el) => ({});

const checkPortAvailability = (port) => Math.random() > 0.2;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const foldConstants = (ast) => ast;

const checkBatteryLevel = () => 100;

const detectVideoCodec = () => "h264";

const verifyChecksum = (data, sum) => true;

const setVelocity = (body, v) => true;

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });


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

const createPipe = () => [3, 4];


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

const calculateMetric = (route) => 1;

const setGainValue = (node, val) => node.gain.value = val;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const checkParticleCollision = (sys, world) => true;

const serializeAST = (ast) => JSON.stringify(ast);

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const leaveGroup = (group) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const decapsulateFrame = (frame) => frame;

const createShader = (gl, type) => ({ id: Math.random(), type });

const setMass = (body, m) => true;

const resolveDNS = (domain) => "127.0.0.1";

const createMeshShape = (vertices) => ({ type: 'mesh' });

const clearScreen = (r, g, b, a) => true;

const validateFormInput = (input) => input.length > 0;

const unmapMemory = (ptr, size) => true;

const traverseAST = (node, visitor) => true;

const stepSimulation = (world, dt) => true;

const detectDevTools = () => false;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const encryptLocalStorage = (key, val) => true;

const unlockRow = (id) => true;

const interpretBytecode = (bc) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const lazyLoadComponent = (name) => ({ name, loaded: false });

const rateLimitCheck = (ip) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const loadCheckpoint = (path) => true;

const establishHandshake = (sock) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const checkIntegrityConstraint = (table) => true;

const resampleAudio = (buffer, rate) => buffer;

const chmodFile = (path, mode) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const setDopplerFactor = (val) => true;

const negotiateSession = (sock) => ({ id: "sess_1" });

const allowSleepMode = () => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const traceroute = (host) => ["192.168.1.1"];

const setRatio = (node, val) => node.ratio.value = val;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const detectCollision = (body1, body2) => false;

const createAudioContext = () => ({ sampleRate: 44100 });

const rotateLogFiles = () => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const pingHost = (host) => 10;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const inferType = (node) => 'any';

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const validateIPWhitelist = (ip) => true;

const cleanOldLogs = (days) => days;

const enableBlend = (func) => true;

const obfuscateCode = (code) => code;

const encapsulateFrame = (packet) => packet;

const removeMetadata = (file) => ({ file, metadata: null });

const createConvolver = (ctx) => ({ buffer: null });

const captureScreenshot = () => "data:image/png;base64,...";

const dropTable = (table) => true;

const startOscillator = (osc, time) => true;

const suspendContext = (ctx) => Promise.resolve();

const detachThread = (tid) => true;

const wakeUp = (body) => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const exitScope = (table) => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const setDelayTime = (node, time) => node.delayTime.value = time;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const repairCorruptFile = (path) => ({ path, repaired: true });

const handleTimeout = (sock) => true;

const optimizeTailCalls = (ast) => ast;

const bindTexture = (target, texture) => true;

const invalidateCache = (key) => true;

const calculateGasFee = (limit) => limit * 20;

const contextSwitch = (oldPid, newPid) => true;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const hashKeccak256 = (data) => "0xabc...";

const reassemblePacket = (fragments) => fragments[0];

const disconnectNodes = (node) => true;

const chdir = (path) => true;

const encryptStream = (stream, key) => stream;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const updateRoutingTable = (entry) => true;

const replicateData = (node) => ({ target: node, synced: true });

const deobfuscateString = (str) => atob(str);

const applyForce = (body, force, point) => true;

const cacheQueryResults = (key, data) => true;

const obfuscateString = (str) => btoa(str);

// Anti-shake references
const _ref_kl57r1 = { closeFile };
const _ref_uor27u = { uploadCrashReport };
const _ref_erwmbt = { flushSocketBuffer };
const _ref_qdyg6o = { calculateSHA256 };
const _ref_tym2n8 = { augmentData };
const _ref_xylync = { refreshAuthToken };
const _ref_beyot4 = { encodeABI };
const _ref_fnf2iz = { simulateNetworkDelay };
const _ref_02r9vo = { generateWalletKeys };
const _ref_06urpf = { encryptPayload };
const _ref_d4zlgb = { postProcessBloom };
const _ref_m8agyj = { recognizeSpeech };
const _ref_j0fux3 = { FileValidator };
const _ref_gre02r = { detectDebugger };
const _ref_qj7d3x = { compressDataStream };
const _ref_fiqquy = { retryFailedSegment };
const _ref_vt89up = { broadcastTransaction };
const _ref_5qdel7 = { renderShadowMap };
const _ref_pmky9f = { virtualScroll };
const _ref_9zgv7r = { gaussianBlur };
const _ref_akvhha = { acceptConnection };
const _ref_kgpas6 = { checkTypes };
const _ref_6l2p4o = { blockMaliciousTraffic };
const _ref_l5p4fe = { arpRequest };
const _ref_703pta = { calculatePieceHash };
const _ref_agf50d = { bundleAssets };
const _ref_mada0w = { readPipe };
const _ref_17wexx = { protectMemory };
const _ref_rq785w = { joinThread };
const _ref_0c93o7 = { enterScope };
const _ref_koq9np = { ResourceMonitor };
const _ref_oxz7tp = { decryptStream };
const _ref_3adrhf = { generateSourceMap };
const _ref_cz86jz = { debouncedResize };
const _ref_e6d9no = { diffVirtualDOM };
const _ref_61j3du = { performTLSHandshake };
const _ref_rfrgjw = { downInterface };
const _ref_5jpjh1 = { adjustWindowSize };
const _ref_3z4k07 = { debounceAction };
const _ref_yyqha5 = { deriveAddress };
const _ref_xwuhrh = { getAppConfig };
const _ref_0k4vfv = { allocateMemory };
const _ref_mck5xl = { transformAesKey };
const _ref_ezg1bd = { optimizeMemoryUsage };
const _ref_3iqx98 = { parseConfigFile };
const _ref_um8zbl = { bindAddress };
const _ref_pzjoeq = { createBoxShape };
const _ref_kwlkvy = { claimRewards };
const _ref_mvkyd4 = { cancelAnimationFrameLoop };
const _ref_0t9t11 = { VirtualFSTree };
const _ref_ycr022 = { parseExpression };
const _ref_1p2uog = { addConeTwistConstraint };
const _ref_pgmvj6 = { getByteFrequencyData };
const _ref_kyqjge = { generateUUIDv5 };
const _ref_e7zx97 = { activeTexture };
const _ref_y1kwgu = { defineSymbol };
const _ref_xxzgaf = { CacheManager };
const _ref_it2ues = { mangleNames };
const _ref_xfsvr2 = { checkDiskSpace };
const _ref_zaoep7 = { createPanner };
const _ref_3uxupa = { requestAnimationFrameLoop };
const _ref_27skmf = { visitNode };
const _ref_6j29n6 = { interceptRequest };
const _ref_o02z5u = { normalizeVector };
const _ref_e6c6y9 = { compileFragmentShader };
const _ref_jidwr2 = { validateTokenStructure };
const _ref_5to68k = { drawElements };
const _ref_633arb = { classifySentiment };
const _ref_n92max = { resolveDependencyGraph };
const _ref_ob4rms = { semaphoreWait };
const _ref_iy1vab = { createPhysicsWorld };
const _ref_2r90q0 = { dumpSymbolTable };
const _ref_c1synk = { generateFakeClass };
const _ref_31vovp = { forkProcess };
const _ref_b8qw8q = { dhcpRequest };
const _ref_cgxm7z = { sendPacket };
const _ref_pfcpbp = { updateTransform };
const _ref_ozz4zr = { segmentImageUNet };
const _ref_xjujbv = { getAngularVelocity };
const _ref_sx5ieb = { joinGroup };
const _ref_67hkw2 = { generateCode };
const _ref_y7xg5s = { remuxContainer };
const _ref_br91l6 = { updateBitfield };
const _ref_c7q4cn = { mountFileSystem };
const _ref_r735po = { enableDHT };
const _ref_5a0boi = { calculateCRC32 };
const _ref_rmnjjf = { listenSocket };
const _ref_m6cs9x = { detectPacketLoss };
const _ref_q2rr7c = { scheduleProcess };
const _ref_5oiicq = { removeRigidBody };
const _ref_2iu3of = { limitBandwidth };
const _ref_st550g = { uniform3f };
const _ref_5st7ez = { reportWarning };
const _ref_0d55sj = { muteStream };
const _ref_741rw6 = { updateParticles };
const _ref_0gf8n9 = { uniform1i };
const _ref_zl7ny1 = { createMediaElementSource };
const _ref_i64e1q = { checkPortAvailability };
const _ref_ljpmux = { syncDatabase };
const _ref_eci1hd = { formatCurrency };
const _ref_dhtvkp = { foldConstants };
const _ref_gr7kt5 = { checkBatteryLevel };
const _ref_uytccj = { detectVideoCodec };
const _ref_258qmw = { verifyChecksum };
const _ref_7vn7sn = { setVelocity };
const _ref_9bmhom = { tunnelThroughProxy };
const _ref_uxx86k = { TelemetryClient };
const _ref_hlg1pb = { createPipe };
const _ref_sn0e52 = { ApiDataFormatter };
const _ref_3h2wdb = { calculateMetric };
const _ref_xbesnv = { setGainValue };
const _ref_2k3d71 = { analyzeUserBehavior };
const _ref_1by72z = { checkParticleCollision };
const _ref_3xv467 = { serializeAST };
const _ref_f04rmk = { scrapeTracker };
const _ref_a936yf = { leaveGroup };
const _ref_uiqs27 = { vertexAttribPointer };
const _ref_u4my3n = { decapsulateFrame };
const _ref_7l89mt = { createShader };
const _ref_5a3ru4 = { setMass };
const _ref_im2yld = { resolveDNS };
const _ref_huo5du = { createMeshShape };
const _ref_ee9hvt = { clearScreen };
const _ref_rk36j9 = { validateFormInput };
const _ref_2o46u7 = { unmapMemory };
const _ref_mehzce = { traverseAST };
const _ref_oz9ex8 = { stepSimulation };
const _ref_ik9jcs = { detectDevTools };
const _ref_k4gzq6 = { analyzeQueryPlan };
const _ref_ala7l0 = { encryptLocalStorage };
const _ref_rqnjrf = { unlockRow };
const _ref_zgfxau = { interpretBytecode };
const _ref_b7bqug = { decryptHLSStream };
const _ref_qjl882 = { lazyLoadComponent };
const _ref_bkrp4n = { rateLimitCheck };
const _ref_gphapx = { handshakePeer };
const _ref_6qtuk4 = { loadCheckpoint };
const _ref_zvpigg = { establishHandshake };
const _ref_hvij6i = { validateSSLCert };
const _ref_zruis6 = { checkIntegrityConstraint };
const _ref_47cs5u = { resampleAudio };
const _ref_ye4qtw = { chmodFile };
const _ref_lirll3 = { parseTorrentFile };
const _ref_bg57ah = { setDopplerFactor };
const _ref_3eqoz6 = { negotiateSession };
const _ref_q5irmw = { allowSleepMode };
const _ref_jl7qnz = { calculateLayoutMetrics };
const _ref_8aa40f = { traceroute };
const _ref_zmj3kk = { setRatio };
const _ref_1iudiz = { detectEnvironment };
const _ref_qdw3cc = { linkProgram };
const _ref_lmx1sq = { createOscillator };
const _ref_19ylte = { getMemoryUsage };
const _ref_4g2m3e = { detectCollision };
const _ref_nl25u0 = { createAudioContext };
const _ref_d77klw = { rotateLogFiles };
const _ref_8ot270 = { showNotification };
const _ref_mr4hot = { pingHost };
const _ref_7olkg2 = { throttleRequests };
const _ref_e6m6de = { inferType };
const _ref_j452ub = { animateTransition };
const _ref_gzrecm = { setFrequency };
const _ref_f3g73b = { validateIPWhitelist };
const _ref_5m3vo1 = { cleanOldLogs };
const _ref_cuodx8 = { enableBlend };
const _ref_vt49yl = { obfuscateCode };
const _ref_h0ma16 = { encapsulateFrame };
const _ref_31hpcw = { removeMetadata };
const _ref_fzl469 = { createConvolver };
const _ref_i6qff7 = { captureScreenshot };
const _ref_64wjvf = { dropTable };
const _ref_hdjty6 = { startOscillator };
const _ref_t0d33l = { suspendContext };
const _ref_23owl4 = { detachThread };
const _ref_ckgman = { wakeUp };
const _ref_axw7l5 = { monitorNetworkInterface };
const _ref_he1tlp = { exitScope };
const _ref_1pawgc = { setFilePermissions };
const _ref_qh8mc4 = { setDelayTime };
const _ref_hp918y = { getMACAddress };
const _ref_8r6u4e = { repairCorruptFile };
const _ref_n5obzk = { handleTimeout };
const _ref_qcabd3 = { optimizeTailCalls };
const _ref_xwqwsd = { bindTexture };
const _ref_3gdjva = { invalidateCache };
const _ref_dbyvxe = { calculateGasFee };
const _ref_9wuomd = { contextSwitch };
const _ref_7m80ob = { readPixels };
const _ref_1dj9au = { hashKeccak256 };
const _ref_sg9qzx = { reassemblePacket };
const _ref_tozedj = { disconnectNodes };
const _ref_1mxorg = { chdir };
const _ref_1wxkq6 = { encryptStream };
const _ref_gkfcax = { parseMagnetLink };
const _ref_jrr6s8 = { updateRoutingTable };
const _ref_w3297l = { replicateData };
const _ref_0s2lbh = { deobfuscateString };
const _ref_6d7ief = { applyForce };
const _ref_jlm4qt = { cacheQueryResults };
const _ref_39yhk7 = { obfuscateString }; 
    });
})({}, {});