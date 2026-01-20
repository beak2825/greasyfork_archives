// ==UserScript==
// @name BitChute视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/BitChute/index.js
// @version 2026.01.10
// @description 一键下载BitChute视频，支持4K/1080P/720P多画质。
// @icon https://www.bitchute.com/static/icons/favicon-128x128.png
// @match *://*.bitchute.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect bitchute.com
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
// @downloadURL https://update.greasyfork.org/scripts/562237/BitChute%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562237/BitChute%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const injectCSPHeader = () => "default-src 'self'";

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

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const dropTable = (table) => true;

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const restoreDatabase = (path) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const serializeFormData = (form) => JSON.stringify(form);

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const cleanOldLogs = (days) => days;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const parseQueryString = (qs) => ({});

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const deleteProgram = (program) => true;

const renderCanvasLayer = (ctx) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const drawElements = (mode, count, type, offset) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const compileFragmentShader = (source) => ({ compiled: true });

const transcodeStream = (format) => ({ format, status: "processing" });

const setGravity = (world, g) => world.gravity = g;

const setFilterType = (filter, type) => filter.type = type;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setPosition = (panner, x, y, z) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const scheduleTask = (task) => ({ id: 1, task });

const createVehicle = (chassis) => ({ wheels: [] });

const allowSleepMode = () => true;

const renderParticles = (sys) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const controlCongestion = (sock) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const getNetworkStats = () => ({ up: 100, down: 2000 });

const anchorSoftBody = (soft, rigid) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const processAudioBuffer = (buffer) => buffer;

const statFile = (path) => ({ size: 0 });

const generateCode = (ast) => "const a = 1;";

const injectMetadata = (file, meta) => ({ file, meta });

const lockRow = (id) => true;

const analyzeControlFlow = (ast) => ({ graph: {} });

const createSphereShape = (r) => ({ type: 'sphere' });

const setRelease = (node, val) => node.release.value = val;

const mutexLock = (mtx) => true;

const verifyIR = (ir) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const dhcpAck = () => true;

const rollbackTransaction = (tx) => true;

const setMass = (body, m) => true;

const calculateComplexity = (ast) => 1;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const muteStream = () => true;

const detachThread = (tid) => true;

const validatePieceChecksum = (piece) => true;

const normalizeFeatures = (data) => data.map(x => x / 255);

const cacheQueryResults = (key, data) => true;

const setDistanceModel = (panner, model) => true;

const joinThread = (tid) => true;

const invalidateCache = (key) => true;

const encodeABI = (method, params) => "0x...";

const inlineFunctions = (ast) => ast;

const setQValue = (filter, q) => filter.Q = q;

const defineSymbol = (table, name, info) => true;

const freeMemory = (ptr) => true;

const semaphoreWait = (sem) => true;

const createPipe = () => [3, 4];

const setGainValue = (node, val) => node.gain.value = val;

const generateDocumentation = (ast) => "";

const configureInterface = (iface, config) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const suspendContext = (ctx) => Promise.resolve();

const remuxContainer = (container) => ({ container, status: "done" });

const computeDominators = (cfg) => ({});

const bufferData = (gl, target, data, usage) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const fingerprintBrowser = () => "fp_hash_123";

const createPeriodicWave = (ctx, real, imag) => ({});


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

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const closeFile = (fd) => true;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const disconnectNodes = (node) => true;

const gaussianBlur = (image, radius) => image;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const mangleNames = (ast) => ast;

const decompressPacket = (data) => data;

const enterScope = (table) => true;

const attachRenderBuffer = (fb, rb) => true;

const getBlockHeight = () => 15000000;

const analyzeHeader = (packet) => ({});

const closeSocket = (sock) => true;

const chmodFile = (path, mode) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const emitParticles = (sys, count) => true;

const execProcess = (path) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const updateParticles = (sys, dt) => true;

const createConstraint = (body1, body2) => ({});

const detectCollision = (body1, body2) => false;


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

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const applyImpulse = (body, impulse, point) => true;

const addSliderConstraint = (world, c) => true;

const updateWheelTransform = (wheel) => true;

const createTCPSocket = () => ({ fd: 1 });

const rotateMatrix = (mat, angle, axis) => mat;

const cancelTask = (id) => ({ id, cancelled: true });

const writeFile = (fd, data) => true;

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setDetune = (osc, cents) => osc.detune = cents;

const backpropagateGradient = (loss) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const detectDarkMode = () => true;

const readdir = (path) => [];

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const handleTimeout = (sock) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createSymbolTable = () => ({ scopes: [] });

const jitCompile = (bc) => (() => {});

const minifyCode = (code) => code;

const lockFile = (path) => ({ path, locked: true });

const encapsulateFrame = (packet) => packet;

const startOscillator = (osc, time) => true;

const augmentData = (image) => image;

const segmentImageUNet = (img) => "mask_buffer";

const backupDatabase = (path) => ({ path, size: 5000 });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const getUniformLocation = (program, name) => 1;

const decapsulateFrame = (frame) => frame;

const stepSimulation = (world, dt) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const updateRoutingTable = (entry) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const restartApplication = () => console.log("Restarting...");

const decodeAudioData = (buffer) => Promise.resolve({});

const negotiateSession = (sock) => ({ id: "sess_1" });

const loadCheckpoint = (path) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const predictTensor = (input) => [0.1, 0.9, 0.0];

const enableInterrupts = () => true;

const rayCast = (world, start, end) => ({ hit: false });

const commitTransaction = (tx) => true;

const validateRecaptcha = (token) => true;

const deleteBuffer = (buffer) => true;

const arpRequest = (ip) => "00:00:00:00:00:00";

const bufferMediaStream = (size) => ({ buffer: size });

const validateProgram = (program) => true;

const rotateLogFiles = () => true;

const unmapMemory = (ptr, size) => true;

const profilePerformance = (func) => 0;

const clearScreen = (r, g, b, a) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const shutdownComputer = () => console.log("Shutting down...");

const getProgramInfoLog = (program) => "";

const setViewport = (x, y, w, h) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const deleteTexture = (texture) => true;

const setMTU = (iface, mtu) => true;

const traverseAST = (node, visitor) => true;

const resolveSymbols = (ast) => ({});

const encryptLocalStorage = (key, val) => true;

const deobfuscateString = (str) => atob(str);

const applyTheme = (theme) => document.body.className = theme;

const rebootSystem = () => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const uniform1i = (loc, val) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const mkdir = (path) => true;

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

const mockResponse = (body) => ({ status: 200, body });

const serializeAST = (ast) => JSON.stringify(ast);

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const systemCall = (num, args) => 0;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const parsePayload = (packet) => ({});

const estimateNonce = (addr) => 42;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const parseLogTopics = (topics) => ["Transfer"];

const merkelizeRoot = (txs) => "root_hash";

const unlinkFile = (path) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

// Anti-shake references
const _ref_wmwkbk = { normalizeAudio };
const _ref_xm38dy = { createScriptProcessor };
const _ref_40memb = { injectCSPHeader };
const _ref_j1w3h8 = { generateFakeClass };
const _ref_arka2w = { analyzeQueryPlan };
const _ref_1lkzir = { validateTokenStructure };
const _ref_wqd65x = { optimizeMemoryUsage };
const _ref_uvbjkn = { dropTable };
const _ref_bjrs0r = { switchProxyServer };
const _ref_72x0d6 = { sanitizeInput };
const _ref_e1130p = { restoreDatabase };
const _ref_unqfgv = { resolveDNSOverHTTPS };
const _ref_79yat8 = { serializeFormData };
const _ref_m4lrpl = { requestAnimationFrameLoop };
const _ref_iozh5k = { parseM3U8Playlist };
const _ref_zg69zz = { cleanOldLogs };
const _ref_uwtukx = { connectToTracker };
const _ref_s7nl76 = { parseQueryString };
const _ref_xrn6bh = { readPixels };
const _ref_icoao7 = { deleteProgram };
const _ref_4vm8rn = { renderCanvasLayer };
const _ref_vmalxf = { captureScreenshot };
const _ref_5ryvks = { drawElements };
const _ref_12k7iz = { requestPiece };
const _ref_dgp7dz = { createOscillator };
const _ref_bm1wvz = { compileFragmentShader };
const _ref_iyarg0 = { transcodeStream };
const _ref_s3hmql = { setGravity };
const _ref_k7v4wh = { setFilterType };
const _ref_1gnx8e = { createBiquadFilter };
const _ref_o7snk7 = { setPosition };
const _ref_xnhoxf = { calculateRestitution };
const _ref_8c6pvv = { scheduleTask };
const _ref_pmgv9w = { createVehicle };
const _ref_do7h23 = { allowSleepMode };
const _ref_h5ju88 = { renderParticles };
const _ref_84zjak = { cancelAnimationFrameLoop };
const _ref_mgvf4k = { controlCongestion };
const _ref_w3ogxw = { FileValidator };
const _ref_0142q2 = { getNetworkStats };
const _ref_4q970s = { anchorSoftBody };
const _ref_covaij = { migrateSchema };
const _ref_gui3jv = { extractThumbnail };
const _ref_irg2un = { processAudioBuffer };
const _ref_tb1p7w = { statFile };
const _ref_mpla34 = { generateCode };
const _ref_2km9ns = { injectMetadata };
const _ref_d6ksaf = { lockRow };
const _ref_qxtuex = { analyzeControlFlow };
const _ref_nd6atm = { createSphereShape };
const _ref_de0wuf = { setRelease };
const _ref_h8sa4e = { mutexLock };
const _ref_x4grme = { verifyIR };
const _ref_yduzhu = { synthesizeSpeech };
const _ref_yfxf0t = { dhcpAck };
const _ref_s5yvpb = { rollbackTransaction };
const _ref_cby3tb = { setMass };
const _ref_yylh7g = { calculateComplexity };
const _ref_bdu4gx = { limitBandwidth };
const _ref_9u0jgj = { muteStream };
const _ref_lxg49p = { detachThread };
const _ref_87io59 = { validatePieceChecksum };
const _ref_xrf2ob = { normalizeFeatures };
const _ref_65dtdn = { cacheQueryResults };
const _ref_50wdf3 = { setDistanceModel };
const _ref_0sqb7g = { joinThread };
const _ref_2zd66g = { invalidateCache };
const _ref_jqy2bz = { encodeABI };
const _ref_fyhfpy = { inlineFunctions };
const _ref_uczgvp = { setQValue };
const _ref_8uq2iz = { defineSymbol };
const _ref_ke3d5u = { freeMemory };
const _ref_7qewhg = { semaphoreWait };
const _ref_8bs4ir = { createPipe };
const _ref_0npp9q = { setGainValue };
const _ref_7gb3eh = { generateDocumentation };
const _ref_j6ioam = { configureInterface };
const _ref_oro3zl = { setDelayTime };
const _ref_l0db54 = { createStereoPanner };
const _ref_gii2gn = { suspendContext };
const _ref_bl6jqu = { remuxContainer };
const _ref_mvrpfj = { computeDominators };
const _ref_81i5c1 = { bufferData };
const _ref_8tfzcg = { playSoundAlert };
const _ref_pupm6o = { fingerprintBrowser };
const _ref_u805fv = { createPeriodicWave };
const _ref_xp7t3s = { CacheManager };
const _ref_0g58n9 = { initWebGLContext };
const _ref_ppg380 = { closeFile };
const _ref_8839bd = { showNotification };
const _ref_cwab88 = { disconnectNodes };
const _ref_dfsitk = { gaussianBlur };
const _ref_xpuz49 = { keepAlivePing };
const _ref_z5yyd3 = { createGainNode };
const _ref_f1owpe = { mangleNames };
const _ref_6gmfdn = { decompressPacket };
const _ref_jeia6u = { enterScope };
const _ref_odsrie = { attachRenderBuffer };
const _ref_cjpcrm = { getBlockHeight };
const _ref_kp2n6b = { analyzeHeader };
const _ref_fty8uy = { closeSocket };
const _ref_bej40v = { chmodFile };
const _ref_ndbup8 = { queueDownloadTask };
const _ref_exr3dc = { emitParticles };
const _ref_g53hr6 = { execProcess };
const _ref_3yiipy = { calculateSHA256 };
const _ref_tnnxs6 = { updateParticles };
const _ref_u3bqy7 = { createConstraint };
const _ref_jmkkq4 = { detectCollision };
const _ref_q6bhzr = { ResourceMonitor };
const _ref_8l21ke = { applyPerspective };
const _ref_r2279o = { applyImpulse };
const _ref_mhm23z = { addSliderConstraint };
const _ref_w2ul81 = { updateWheelTransform };
const _ref_7iszay = { createTCPSocket };
const _ref_58m9as = { rotateMatrix };
const _ref_pnu24i = { cancelTask };
const _ref_sxqcsx = { writeFile };
const _ref_3vec1c = { discoverPeersDHT };
const _ref_gbmf2k = { allocateDiskSpace };
const _ref_7ozhqx = { animateTransition };
const _ref_sxg6fe = { createPhysicsWorld };
const _ref_8xg27x = { setDetune };
const _ref_2d47sm = { backpropagateGradient };
const _ref_uvw1gz = { debouncedResize };
const _ref_do5rxr = { getVelocity };
const _ref_mr8oj2 = { detectDarkMode };
const _ref_69h9z3 = { readdir };
const _ref_7ne6hw = { decryptHLSStream };
const _ref_b3i515 = { optimizeConnectionPool };
const _ref_apq3nz = { saveCheckpoint };
const _ref_k3ciui = { handleTimeout };
const _ref_wyfuvv = { setFrequency };
const _ref_kq7syk = { createSymbolTable };
const _ref_5xvjc7 = { jitCompile };
const _ref_ia13ah = { minifyCode };
const _ref_4eixgn = { lockFile };
const _ref_7kn69j = { encapsulateFrame };
const _ref_acpj9z = { startOscillator };
const _ref_zyqv9q = { augmentData };
const _ref_r8vkva = { segmentImageUNet };
const _ref_hu6dqm = { backupDatabase };
const _ref_6hxzvj = { getMACAddress };
const _ref_82955k = { getUniformLocation };
const _ref_icjan2 = { decapsulateFrame };
const _ref_vueflh = { stepSimulation };
const _ref_qcxfnb = { streamToPlayer };
const _ref_twcbmp = { normalizeVector };
const _ref_poydeh = { updateRoutingTable };
const _ref_u35s13 = { generateWalletKeys };
const _ref_oqq9d4 = { restartApplication };
const _ref_alot5x = { decodeAudioData };
const _ref_cxh4y5 = { negotiateSession };
const _ref_h07gyn = { loadCheckpoint };
const _ref_kug4ak = { encryptPayload };
const _ref_88gt4d = { predictTensor };
const _ref_0smql2 = { enableInterrupts };
const _ref_ao6tgz = { rayCast };
const _ref_5mqw8o = { commitTransaction };
const _ref_mfozfc = { validateRecaptcha };
const _ref_to3cxw = { deleteBuffer };
const _ref_l18z28 = { arpRequest };
const _ref_2ekk0e = { bufferMediaStream };
const _ref_mfkzac = { validateProgram };
const _ref_rf03l8 = { rotateLogFiles };
const _ref_8kvvs5 = { unmapMemory };
const _ref_he6ztu = { profilePerformance };
const _ref_jor1cy = { clearScreen };
const _ref_jxfpsj = { vertexAttrib3f };
const _ref_kk7law = { shutdownComputer };
const _ref_wxnnwf = { getProgramInfoLog };
const _ref_humnr6 = { setViewport };
const _ref_ffloj8 = { registerSystemTray };
const _ref_7tr2vg = { deleteTexture };
const _ref_jj96qb = { setMTU };
const _ref_7m5i8u = { traverseAST };
const _ref_l79cie = { resolveSymbols };
const _ref_jznhru = { encryptLocalStorage };
const _ref_i8y374 = { deobfuscateString };
const _ref_ccyror = { applyTheme };
const _ref_31dync = { rebootSystem };
const _ref_awi458 = { createShader };
const _ref_bzi2y6 = { uniform1i };
const _ref_0t5p8t = { createFrameBuffer };
const _ref_yvbe9g = { mkdir };
const _ref_kwy9w3 = { AdvancedCipher };
const _ref_ysy7zm = { mockResponse };
const _ref_mw4qlv = { serializeAST };
const _ref_jhjvga = { connectionPooling };
const _ref_2ruxm3 = { systemCall };
const _ref_bi9wpq = { throttleRequests };
const _ref_mal4c3 = { parsePayload };
const _ref_1klihe = { estimateNonce };
const _ref_4busiz = { refreshAuthToken };
const _ref_zdxe4e = { validateSSLCert };
const _ref_mr03m2 = { parseLogTopics };
const _ref_7k9mgu = { merkelizeRoot };
const _ref_88dz6b = { unlinkFile };
const _ref_0yo4tz = { announceToTracker };
const _ref_wfhtwi = { parseFunction }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `BitChute` };
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
                const urlParams = { config, url: window.location.href, name_en: `BitChute` };

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
        const traverseAST = (node, visitor) => true;

const checkTypes = (ast) => [];

const setMass = (body, m) => true;

const addRigidBody = (world, body) => true;

const filterTraffic = (rule) => true;

const measureRTT = (sent, recv) => 10;

const createThread = (func) => ({ tid: 1 });

const resolveSymbols = (ast) => ({});

const createSymbolTable = () => ({ scopes: [] });

const pingHost = (host) => 10;

const profilePerformance = (func) => 0;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const reassemblePacket = (fragments) => fragments[0];

const normalizeVolume = (buffer) => buffer;

const getVehicleSpeed = (vehicle) => 0;

const debugAST = (ast) => "";

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const deserializeAST = (json) => JSON.parse(json);

const applyForce = (body, force, point) => true;

const addGeneric6DofConstraint = (world, c) => true;

const decryptStream = (stream, key) => stream;

const addPoint2PointConstraint = (world, c) => true;

const resampleAudio = (buffer, rate) => buffer;

const resolveCollision = (manifold) => true;

const limitRate = (stream, rate) => stream;

const adjustWindowSize = (sock, size) => true;

const listenSocket = (sock, backlog) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const traceroute = (host) => ["192.168.1.1"];

const stepSimulation = (world, dt) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const retransmitPacket = (seq) => true;

const serializeFormData = (form) => JSON.stringify(form);

const installUpdate = () => false;

const analyzeControlFlow = (ast) => ({ graph: {} });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const loadCheckpoint = (path) => true;

const triggerHapticFeedback = (intensity) => true;

const validatePieceChecksum = (piece) => true;

const setMTU = (iface, mtu) => true;

const checkBalance = (addr) => "10.5 ETH";

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const encryptStream = (stream, key) => stream;

const createSphereShape = (r) => ({ type: 'sphere' });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const controlCongestion = (sock) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const connectNodes = (src, dest) => true;

const obfuscateString = (str) => btoa(str);

const setDelayTime = (node, time) => node.delayTime.value = time;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const dhcpDiscover = () => true;

const checkRootAccess = () => false;

const prioritizeTraffic = (queue) => true;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const mutexLock = (mtx) => true;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const rateLimitCheck = (ip) => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const getCpuLoad = () => Math.random() * 100;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const closeSocket = (sock) => true;

const cullFace = (mode) => true;

const setOrientation = (panner, x, y, z) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const unlockFile = (path) => ({ path, locked: false });

const setFilterType = (filter, type) => filter.type = type;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const scheduleTask = (task) => ({ id: 1, task });

const backupDatabase = (path) => ({ path, size: 5000 });

const injectCSPHeader = () => "default-src 'self'";

const defineSymbol = (table, name, info) => true;

const parseQueryString = (qs) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const cleanOldLogs = (days) => days;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const compileFragmentShader = (source) => ({ compiled: true });

const loadDriver = (path) => true;

const shardingTable = (table) => ["shard_0", "shard_1"];

const disconnectNodes = (node) => true;

const bindAddress = (sock, addr, port) => true;

const mountFileSystem = (dev, path) => true;

const setPosition = (panner, x, y, z) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const setQValue = (filter, q) => filter.Q = q;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const joinGroup = (group) => true;

const chownFile = (path, uid, gid) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const bindSocket = (port) => ({ port, status: "bound" });

const setDopplerFactor = (val) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const unlinkFile = (path) => true;

const encodeABI = (method, params) => "0x...";

const panicKernel = (msg) => false;

const setKnee = (node, val) => node.knee.value = val;

const applyFog = (color, dist) => color;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const setVolumeLevel = (vol) => vol;

const setAttack = (node, val) => node.attack.value = val;

const loadImpulseResponse = (url) => Promise.resolve({});

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const allowSleepMode = () => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setViewport = (x, y, w, h) => true;

const deleteProgram = (program) => true;

const fingerprintBrowser = () => "fp_hash_123";

const getOutputTimestamp = (ctx) => Date.now();

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const stopOscillator = (osc, time) => true;

const setThreshold = (node, val) => node.threshold.value = val;

const removeMetadata = (file) => ({ file, metadata: null });

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const reduceDimensionalityPCA = (data) => data;

const registerGestureHandler = (gesture) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const reportWarning = (msg, line) => console.warn(msg);

const createWaveShaper = (ctx) => ({ curve: null });

const verifyChecksum = (data, sum) => true;

const setGainValue = (node, val) => node.gain.value = val;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const analyzeHeader = (packet) => ({});

const multicastMessage = (group, msg) => true;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const getMACAddress = (iface) => "00:00:00:00:00:00";

const segmentImageUNet = (img) => "mask_buffer";

const createMediaStreamSource = (ctx, stream) => ({});

const validateIPWhitelist = (ip) => true;

const createConstraint = (body1, body2) => ({});

const processAudioBuffer = (buffer) => buffer;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const systemCall = (num, args) => 0;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const setSocketTimeout = (ms) => ({ timeout: ms });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const getNetworkStats = () => ({ up: 100, down: 2000 });

const broadcastMessage = (msg) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const unloadDriver = (name) => true;

const decompressGzip = (data) => data;

const captureScreenshot = () => "data:image/png;base64,...";

const cancelTask = (id) => ({ id, cancelled: true });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const checkGLError = () => 0;

const verifyProofOfWork = (nonce) => true;

const detectDarkMode = () => true;

const rayCast = (world, start, end) => ({ hit: false });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const connectSocket = (sock, addr, port) => true;

const parsePayload = (packet) => ({});

const compileToBytecode = (ast) => new Uint8Array();

const createDirectoryRecursive = (path) => path.split('/').length;

const addConeTwistConstraint = (world, c) => true;

const readdir = (path) => [];

const captureFrame = () => "frame_data_buffer";

const receivePacket = (sock, len) => new Uint8Array(len);

const validateRecaptcha = (token) => true;

const setInertia = (body, i) => true;

const removeRigidBody = (world, body) => true;

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setGravity = (world, g) => world.gravity = g;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const createIndexBuffer = (data) => ({ id: Math.random() });

const allocateMemory = (size) => 0x1000;

const contextSwitch = (oldPid, newPid) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const addHingeConstraint = (world, c) => true;

const createMediaElementSource = (ctx, el) => ({});

const commitTransaction = (tx) => true;

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const writePipe = (fd, data) => data.length;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const execProcess = (path) => true;

const classifySentiment = (text) => "positive";

const repairCorruptFile = (path) => ({ path, repaired: true });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const dropTable = (table) => true;

const chdir = (path) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const validateFormInput = (input) => input.length > 0;

const enableDHT = () => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const updateTransform = (body) => true;

const detachThread = (tid) => true;

const generateCode = (ast) => "const a = 1;";

const negotiateProtocol = () => "HTTP/2.0";

const analyzeBitrate = () => "5000kbps";

const reportError = (msg, line) => console.error(msg);

const predictTensor = (input) => [0.1, 0.9, 0.0];

// Anti-shake references
const _ref_vckn1f = { traverseAST };
const _ref_g9znpz = { checkTypes };
const _ref_hw7y1f = { setMass };
const _ref_w1z7e0 = { addRigidBody };
const _ref_e0s999 = { filterTraffic };
const _ref_cudmfx = { measureRTT };
const _ref_s6gxo1 = { createThread };
const _ref_mwoihy = { resolveSymbols };
const _ref_1w24rj = { createSymbolTable };
const _ref_kv1p9u = { pingHost };
const _ref_8yks90 = { profilePerformance };
const _ref_lbqggt = { createCapsuleShape };
const _ref_unslc4 = { reassemblePacket };
const _ref_lsybyf = { normalizeVolume };
const _ref_baurbo = { getVehicleSpeed };
const _ref_szl11g = { debugAST };
const _ref_ntrl2b = { createPhysicsWorld };
const _ref_7lsjvh = { deserializeAST };
const _ref_wnqbaj = { applyForce };
const _ref_m1i8cc = { addGeneric6DofConstraint };
const _ref_ohyrrj = { decryptStream };
const _ref_hjj3sc = { addPoint2PointConstraint };
const _ref_zi7qft = { resampleAudio };
const _ref_2pdpnr = { resolveCollision };
const _ref_1g96rf = { limitRate };
const _ref_l16wbg = { adjustWindowSize };
const _ref_n17nbw = { listenSocket };
const _ref_39uah7 = { createBoxShape };
const _ref_w9jt4v = { traceroute };
const _ref_k2o0u9 = { stepSimulation };
const _ref_v9gqv6 = { splitFile };
const _ref_j2wmfs = { retransmitPacket };
const _ref_2n5syi = { serializeFormData };
const _ref_8dvelb = { installUpdate };
const _ref_3sl6ht = { analyzeControlFlow };
const _ref_xwgec4 = { getVelocity };
const _ref_fkc1cz = { terminateSession };
const _ref_n0ge0u = { loadCheckpoint };
const _ref_8nsaxn = { triggerHapticFeedback };
const _ref_apldzx = { validatePieceChecksum };
const _ref_ad5chh = { setMTU };
const _ref_836m2t = { checkBalance };
const _ref_o02gej = { manageCookieJar };
const _ref_9tdlb5 = { encryptStream };
const _ref_zp8evk = { createSphereShape };
const _ref_pw3ivg = { discoverPeersDHT };
const _ref_l2jl5b = { controlCongestion };
const _ref_a7ll0c = { parseStatement };
const _ref_1c57jg = { connectNodes };
const _ref_npt7f7 = { obfuscateString };
const _ref_qfmnue = { setDelayTime };
const _ref_5u0e82 = { createPanner };
const _ref_6sgk27 = { dhcpDiscover };
const _ref_a50i7q = { checkRootAccess };
const _ref_dq4g3e = { prioritizeTraffic };
const _ref_uzj978 = { convertRGBtoHSL };
const _ref_wt8opx = { validateSSLCert };
const _ref_fu7jjn = { mutexLock };
const _ref_zzgv3p = { queueDownloadTask };
const _ref_bfri26 = { detectEnvironment };
const _ref_mv1320 = { rateLimitCheck };
const _ref_pinqa9 = { checkIntegrity };
const _ref_75yz42 = { getCpuLoad };
const _ref_6o490c = { limitDownloadSpeed };
const _ref_v2uwyp = { parseConfigFile };
const _ref_51zusj = { moveFileToComplete };
const _ref_t2z9my = { closeSocket };
const _ref_ls49nt = { cullFace };
const _ref_mjk6ve = { setOrientation };
const _ref_ibaeug = { uninterestPeer };
const _ref_c25mpn = { unlockFile };
const _ref_8fpzjk = { setFilterType };
const _ref_v9j75t = { compressDataStream };
const _ref_6rjmd3 = { scheduleTask };
const _ref_slvlfh = { backupDatabase };
const _ref_shcumr = { injectCSPHeader };
const _ref_xjrxfd = { defineSymbol };
const _ref_v56zvj = { parseQueryString };
const _ref_qpwfqy = { generateWalletKeys };
const _ref_sjirot = { cleanOldLogs };
const _ref_olt16f = { normalizeAudio };
const _ref_aqunwj = { compileFragmentShader };
const _ref_djms37 = { loadDriver };
const _ref_50suw7 = { shardingTable };
const _ref_dqqyey = { disconnectNodes };
const _ref_4kppn7 = { bindAddress };
const _ref_u0iyco = { mountFileSystem };
const _ref_4ffufw = { setPosition };
const _ref_c41khz = { keepAlivePing };
const _ref_ed0vzi = { setQValue };
const _ref_q48rvz = { readPixels };
const _ref_4azki1 = { simulateNetworkDelay };
const _ref_lbnvr4 = { joinGroup };
const _ref_89cbrv = { chownFile };
const _ref_wsmelo = { uniformMatrix4fv };
const _ref_j51no3 = { bindSocket };
const _ref_glzuq4 = { setDopplerFactor };
const _ref_k27bcp = { calculateEntropy };
const _ref_f4smuv = { unlinkFile };
const _ref_9hzq13 = { encodeABI };
const _ref_zug9uw = { panicKernel };
const _ref_2sdwvh = { setKnee };
const _ref_9gx0nx = { applyFog };
const _ref_2m0f9r = { extractThumbnail };
const _ref_gt10m7 = { setVolumeLevel };
const _ref_80vkxj = { setAttack };
const _ref_dsrcrg = { loadImpulseResponse };
const _ref_1ekoe2 = { createDelay };
const _ref_zbe8jq = { allowSleepMode };
const _ref_1bdwgm = { renderVirtualDOM };
const _ref_m2fgbq = { setViewport };
const _ref_7jpgoq = { deleteProgram };
const _ref_68zu6p = { fingerprintBrowser };
const _ref_9h7f7z = { getOutputTimestamp };
const _ref_n9h6it = { showNotification };
const _ref_wgq0k0 = { stopOscillator };
const _ref_y5s4y1 = { setThreshold };
const _ref_br29nq = { removeMetadata };
const _ref_dwd1y3 = { switchProxyServer };
const _ref_koos9b = { reduceDimensionalityPCA };
const _ref_of6e6v = { registerGestureHandler };
const _ref_4id9rg = { broadcastTransaction };
const _ref_va38pb = { reportWarning };
const _ref_qitnqu = { createWaveShaper };
const _ref_8o3tw0 = { verifyChecksum };
const _ref_wy4ivl = { setGainValue };
const _ref_gz4pue = { parseM3U8Playlist };
const _ref_9jpg2u = { analyzeHeader };
const _ref_yj3yg9 = { multicastMessage };
const _ref_5104al = { compactDatabase };
const _ref_yrquqk = { makeDistortionCurve };
const _ref_6dkpz0 = { initiateHandshake };
const _ref_la4yjn = { getMACAddress };
const _ref_0o3e62 = { segmentImageUNet };
const _ref_w5tzj3 = { createMediaStreamSource };
const _ref_2g8o67 = { validateIPWhitelist };
const _ref_ksr55k = { createConstraint };
const _ref_h9cpud = { processAudioBuffer };
const _ref_x7h52d = { parseTorrentFile };
const _ref_z4kj58 = { systemCall };
const _ref_z2zyqv = { parseSubtitles };
const _ref_0u8dzv = { setSocketTimeout };
const _ref_4xz8xj = { transformAesKey };
const _ref_851rky = { getNetworkStats };
const _ref_a62150 = { broadcastMessage };
const _ref_oo0qma = { decodeABI };
const _ref_5osqir = { unloadDriver };
const _ref_prq2pv = { decompressGzip };
const _ref_t0px5s = { captureScreenshot };
const _ref_vyltzt = { cancelTask };
const _ref_03c340 = { optimizeHyperparameters };
const _ref_d4k2as = { updateBitfield };
const _ref_djtrbg = { checkGLError };
const _ref_qjbdww = { verifyProofOfWork };
const _ref_t55nlj = { detectDarkMode };
const _ref_esug3h = { rayCast };
const _ref_brfyy9 = { FileValidator };
const _ref_3k8kvl = { connectSocket };
const _ref_isfkbl = { parsePayload };
const _ref_87xkwj = { compileToBytecode };
const _ref_w2u1bq = { createDirectoryRecursive };
const _ref_6jz9q5 = { addConeTwistConstraint };
const _ref_uvcv46 = { readdir };
const _ref_whhjab = { captureFrame };
const _ref_7t16sw = { receivePacket };
const _ref_kx9cwx = { validateRecaptcha };
const _ref_vujvec = { setInertia };
const _ref_la0doc = { removeRigidBody };
const _ref_gkdncf = { validateMnemonic };
const _ref_js76j0 = { createScriptProcessor };
const _ref_0xk3ga = { setGravity };
const _ref_ql06bo = { getAngularVelocity };
const _ref_m6wieq = { createIndexBuffer };
const _ref_930nhj = { allocateMemory };
const _ref_icxzsn = { contextSwitch };
const _ref_wlp5np = { createFrameBuffer };
const _ref_hykkbz = { addHingeConstraint };
const _ref_6nn0tx = { createMediaElementSource };
const _ref_fw23th = { commitTransaction };
const _ref_30ykq8 = { sanitizeSQLInput };
const _ref_72281c = { writePipe };
const _ref_07aa2v = { streamToPlayer };
const _ref_446vg8 = { execProcess };
const _ref_j456ef = { classifySentiment };
const _ref_m22kpz = { repairCorruptFile };
const _ref_psjv0w = { debouncedResize };
const _ref_8yqoz5 = { dropTable };
const _ref_6hs9uz = { chdir };
const _ref_39uev1 = { generateUUIDv5 };
const _ref_q7v268 = { validateFormInput };
const _ref_jacwe3 = { enableDHT };
const _ref_ud9man = { deleteTempFiles };
const _ref_bre8sb = { requestPiece };
const _ref_n9tsi2 = { updateTransform };
const _ref_y9hzn9 = { detachThread };
const _ref_my4irh = { generateCode };
const _ref_bpvxoq = { negotiateProtocol };
const _ref_6sgao8 = { analyzeBitrate };
const _ref_f9uljk = { reportError };
const _ref_gd712p = { predictTensor }; 
    });
})({}, {});