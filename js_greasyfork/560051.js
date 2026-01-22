// ==UserScript==
// @name 百度网盘限速解除
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_lingquan/index.js
// @version 2026.01.21.2
// @description 利用百度网盘极速下载券，实现极速下载，每天最多可领2张5分钟券。
// @icon https://www.baidu.com/favicon.ico
// @match *://pan.baidu.com/*
// @match *://yun.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect baidu.com
// @connect 127.0.0.1
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
// @downloadURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/560051/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%99%90%E9%80%9F%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const resampleAudio = (buffer, rate) => buffer;

const obfuscateString = (str) => btoa(str);

const allowSleepMode = () => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const disablePEX = () => false;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const createShader = (gl, type) => ({ id: Math.random(), type });

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const logErrorToFile = (err) => console.error(err);

const restartApplication = () => console.log("Restarting...");

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const hydrateSSR = (html) => true;

const repairCorruptFile = (path) => ({ path, repaired: true });

const validateRecaptcha = (token) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const detectVirtualMachine = () => false;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const prioritizeRarestPiece = (pieces) => pieces[0];


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const getMediaDuration = () => 3600;

const interpretBytecode = (bc) => true;

const deobfuscateString = (str) => atob(str);

const mkdir = (path) => true;

const dumpSymbolTable = (table) => "";

const computeDominators = (cfg) => ({});

const analyzeHeader = (packet) => ({});

const detectDarkMode = () => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const prettifyCode = (code) => code;

const compileToBytecode = (ast) => new Uint8Array();

const parsePayload = (packet) => ({});

const forkProcess = () => 101;

const killProcess = (pid) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const minifyCode = (code) => code;

const compressGzip = (data) => data;

const extractArchive = (archive) => ["file1", "file2"];

const unlockFile = (path) => ({ path, locked: false });

const computeLossFunction = (pred, actual) => 0.05;

const prefetchAssets = (urls) => urls.length;

const resolveSymbols = (ast) => ({});

const beginTransaction = () => "TX-" + Date.now();

const detectDevTools = () => false;

const detectDebugger = () => false;

const triggerHapticFeedback = (intensity) => true;

const mutexUnlock = (mtx) => true;

const verifyAppSignature = () => true;


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

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const removeRigidBody = (world, body) => true;

const mangleNames = (ast) => ast;

const calculateRestitution = (mat1, mat2) => 0.3;

const stepSimulation = (world, dt) => true;

const validatePieceChecksum = (piece) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const checkIntegrityConstraint = (table) => true;

const useProgram = (program) => true;

const optimizeAST = (ast) => ast;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const vertexAttrib3f = (idx, x, y, z) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const mutexLock = (mtx) => true;

const obfuscateCode = (code) => code;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const dhcpDiscover = () => true;

const processAudioBuffer = (buffer) => buffer;

const translateText = (text, lang) => text;

const setRatio = (node, val) => node.ratio.value = val;

const calculateMD5 = (data) => "d41d8cd98f00b204e9800998ecf8427e";

const updateParticles = (sys, dt) => true;

const allocateDiskSpace = (size) => ({ allocated: size, path: "/tmp" });

const linkModules = (modules) => ({});

const createThread = (func) => ({ tid: 1 });

const deserializeAST = (json) => JSON.parse(json);

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const getOutputTimestamp = (ctx) => Date.now();

const createMediaStreamSource = (ctx, stream) => ({});

const installUpdate = () => false;

const createWaveShaper = (ctx) => ({ curve: null });

const getEnv = (key) => "";

const applyTorque = (body, torque) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const reportWarning = (msg, line) => console.warn(msg);

const sanitizeXSS = (html) => html;

const lockFile = (path) => ({ path, locked: true });

const fingerprintBrowser = () => "fp_hash_123";

const protectMemory = (ptr, size, flags) => true;

const configureInterface = (iface, config) => true;

const disableRightClick = () => true;

const decryptStream = (stream, key) => stream;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const resetVehicle = (vehicle) => true;

const addRigidBody = (world, body) => true;

const createPipe = () => [3, 4];

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const listenSocket = (sock, backlog) => true;

const scheduleTask = (task) => ({ id: 1, task });

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const sendPacket = (sock, data) => data.length;

const setPan = (node, val) => node.pan.value = val;

const estimateNonce = (addr) => 42;

const reassemblePacket = (fragments) => fragments[0];

const setDopplerFactor = (val) => true;

const generateEmbeddings = (text) => new Float32Array(128);

const setFilePermissions = (perm) => `chmod ${perm}`;

const rmdir = (path) => true;

const bindAddress = (sock, addr, port) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const claimRewards = (pool) => "0.5 ETH";

const dropTable = (table) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const generateSourceMap = (ast) => "{}";

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const killParticles = (sys) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const clearScreen = (r, g, b, a) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const muteStream = () => true;

const startOscillator = (osc, time) => true;

const createSymbolTable = () => ({ scopes: [] });

const augmentData = (image) => image;

const uniform1i = (loc, val) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const edgeDetectionSobel = (image) => image;

const enterScope = (table) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const exitScope = (table) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const checkBatteryLevel = () => 100;

const setFilterType = (filter, type) => filter.type = type;

const jitCompile = (bc) => (() => {});

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

const applyImpulse = (body, impulse, point) => true;

const reportError = (msg, line) => console.error(msg);

const decodeABI = (data) => ({ method: "transfer", params: [] });

const splitFile = (path, parts) => Array(parts).fill(path);

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

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

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const closeFile = (fd) => true;

const acceptConnection = (sock) => ({ fd: 2 });

const captureScreenshot = () => "data:image/png;base64,...";

const stopOscillator = (osc, time) => true;

const unmuteStream = () => false;

const checkPortAvailability = (port) => Math.random() > 0.2;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const findLoops = (cfg) => [];

const rebootSystem = () => true;

const addWheel = (vehicle, info) => true;

const convertHSLtoRGB = (h, s, l) => ({ r: 0, g: 0, b: 0 });

const mountFileSystem = (dev, path) => true;

const calculateComplexity = (ast) => 1;

const retransmitPacket = (seq) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const replicateData = (node) => ({ target: node, synced: true });

const generateDocumentation = (ast) => "";

const getFloatTimeDomainData = (analyser, array) => true;

const contextSwitch = (oldPid, newPid) => true;

const inferType = (node) => 'any';

const renderParticles = (sys) => true;

const cleanOldLogs = (days) => days;

const setGravity = (world, g) => world.gravity = g;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const verifyProofOfWork = (nonce) => true;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const setOrientation = (panner, x, y, z) => true;

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const dhcpAck = () => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const parseQueryString = (qs) => ({});

const profilePerformance = (func) => 0;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const detectCollision = (body1, body2) => false;

const calculateGasFee = (limit) => limit * 20;

const checkBalance = (addr) => "10.5 ETH";

const checkRootAccess = () => false;

const detachThread = (tid) => true;

const deriveAddress = (path) => "0x123...";

const closePipe = (fd) => true;

const shutdownComputer = () => console.log("Shutting down...");

const setMTU = (iface, mtu) => true;

const createChannelSplitter = (ctx, channels) => ({});

const resolveCollision = (manifold) => true;

const checkIntegrityToken = (token) => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const analyzeBitrate = () => "5000kbps";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const writePipe = (fd, data) => data.length;

const anchorSoftBody = (soft, rigid) => true;

// Anti-shake references
const _ref_2tm43x = { discoverPeersDHT };
const _ref_xqbung = { resampleAudio };
const _ref_jkcan6 = { obfuscateString };
const _ref_u484ze = { allowSleepMode };
const _ref_d7054l = { announceToTracker };
const _ref_7gx7n2 = { disablePEX };
const _ref_vpz6rn = { getNetworkStats };
const _ref_eu2rf8 = { createShader };
const _ref_nz8f1g = { showNotification };
const _ref_m7wpit = { resolveDependencyGraph };
const _ref_f6glnh = { logErrorToFile };
const _ref_0394jp = { restartApplication };
const _ref_1ztggh = { calculatePieceHash };
const _ref_9lzp05 = { hydrateSSR };
const _ref_60fg8i = { repairCorruptFile };
const _ref_vkk21r = { validateRecaptcha };
const _ref_8jxkwn = { migrateSchema };
const _ref_yc8vos = { limitBandwidth };
const _ref_j11s0n = { detectVirtualMachine };
const _ref_y2nucj = { interceptRequest };
const _ref_d86fh6 = { throttleRequests };
const _ref_hs755r = { signTransaction };
const _ref_tthd4p = { prioritizeRarestPiece };
const _ref_batguq = { FileValidator };
const _ref_ll3948 = { getMediaDuration };
const _ref_6jjiog = { interpretBytecode };
const _ref_dflwaa = { deobfuscateString };
const _ref_azd8yx = { mkdir };
const _ref_2ehreb = { dumpSymbolTable };
const _ref_e9fz5l = { computeDominators };
const _ref_2ejn6o = { analyzeHeader };
const _ref_ncg6h1 = { detectDarkMode };
const _ref_o5h8d3 = { syncAudioVideo };
const _ref_34azzc = { prettifyCode };
const _ref_luafz0 = { compileToBytecode };
const _ref_uogsaq = { parsePayload };
const _ref_osczks = { forkProcess };
const _ref_mzvah7 = { killProcess };
const _ref_ay3kjf = { broadcastTransaction };
const _ref_oaejld = { minifyCode };
const _ref_asbncx = { compressGzip };
const _ref_k1jne1 = { extractArchive };
const _ref_lfuzbk = { unlockFile };
const _ref_40r6ef = { computeLossFunction };
const _ref_uk76nz = { prefetchAssets };
const _ref_qr5hd3 = { resolveSymbols };
const _ref_tu8pzn = { beginTransaction };
const _ref_bnnmo1 = { detectDevTools };
const _ref_so07kl = { detectDebugger };
const _ref_lb55ke = { triggerHapticFeedback };
const _ref_2trt0q = { mutexUnlock };
const _ref_ls5wnk = { verifyAppSignature };
const _ref_5gni6n = { ResourceMonitor };
const _ref_e9twg7 = { resolveDNSOverHTTPS };
const _ref_q72135 = { removeRigidBody };
const _ref_q01dij = { mangleNames };
const _ref_is1oi2 = { calculateRestitution };
const _ref_hol8kl = { stepSimulation };
const _ref_gypozx = { validatePieceChecksum };
const _ref_4eputn = { createCapsuleShape };
const _ref_tft2oy = { monitorNetworkInterface };
const _ref_uswl4u = { checkIntegrityConstraint };
const _ref_yu3cqp = { useProgram };
const _ref_0e0s4r = { optimizeAST };
const _ref_p59ril = { optimizeConnectionPool };
const _ref_y1qvyk = { vertexAttrib3f };
const _ref_ncd65y = { limitUploadSpeed };
const _ref_lkict3 = { archiveFiles };
const _ref_1okqse = { validateTokenStructure };
const _ref_g0f85g = { mutexLock };
const _ref_g0ax0a = { obfuscateCode };
const _ref_50n72w = { parseMagnetLink };
const _ref_3risjw = { dhcpDiscover };
const _ref_kr1336 = { processAudioBuffer };
const _ref_3ho6m0 = { translateText };
const _ref_bv9zjd = { setRatio };
const _ref_7a0fou = { calculateMD5 };
const _ref_kgeclv = { updateParticles };
const _ref_poesuq = { allocateDiskSpace };
const _ref_r77lbj = { linkModules };
const _ref_egbjs4 = { createThread };
const _ref_pn0l7o = { deserializeAST };
const _ref_5rtb5v = { createAnalyser };
const _ref_de03i9 = { getOutputTimestamp };
const _ref_75024c = { createMediaStreamSource };
const _ref_pdhw95 = { installUpdate };
const _ref_ryzz7k = { createWaveShaper };
const _ref_cekosy = { getEnv };
const _ref_5i6a80 = { applyTorque };
const _ref_s0g0m6 = { calculateFriction };
const _ref_d05cuq = { reportWarning };
const _ref_kyg005 = { sanitizeXSS };
const _ref_3trjyc = { lockFile };
const _ref_lubpct = { fingerprintBrowser };
const _ref_qqg93a = { protectMemory };
const _ref_ucfx8r = { configureInterface };
const _ref_btwbe8 = { disableRightClick };
const _ref_qvussf = { decryptStream };
const _ref_8i1l4d = { cancelAnimationFrameLoop };
const _ref_1qvwmu = { encryptPayload };
const _ref_cdz9s6 = { resetVehicle };
const _ref_98k0iu = { addRigidBody };
const _ref_n8f1rh = { createPipe };
const _ref_9kd4aj = { createPhysicsWorld };
const _ref_otaxmp = { listenSocket };
const _ref_8rko1h = { scheduleTask };
const _ref_68qtn5 = { connectionPooling };
const _ref_65553g = { sendPacket };
const _ref_o73rup = { setPan };
const _ref_w2p8xr = { estimateNonce };
const _ref_6xw4da = { reassemblePacket };
const _ref_rwhq3y = { setDopplerFactor };
const _ref_a4mmjc = { generateEmbeddings };
const _ref_jqncz6 = { setFilePermissions };
const _ref_dl7i0n = { rmdir };
const _ref_3yq3m3 = { bindAddress };
const _ref_g1e378 = { handshakePeer };
const _ref_aril9r = { claimRewards };
const _ref_uh2t0c = { dropTable };
const _ref_pv9t3f = { seedRatioLimit };
const _ref_tj6ftr = { generateSourceMap };
const _ref_3wqc0c = { validateSSLCert };
const _ref_9z6249 = { killParticles };
const _ref_yd6pyo = { parseTorrentFile };
const _ref_zt6wph = { clearScreen };
const _ref_xespjk = { rotateMatrix };
const _ref_npqco5 = { muteStream };
const _ref_ykxkho = { startOscillator };
const _ref_a5tp5i = { createSymbolTable };
const _ref_0l8262 = { augmentData };
const _ref_0f6eui = { uniform1i };
const _ref_ksk3wl = { optimizeMemoryUsage };
const _ref_ywdvz5 = { edgeDetectionSobel };
const _ref_82syjh = { enterScope };
const _ref_2j5sf1 = { compressDataStream };
const _ref_kwh82h = { exitScope };
const _ref_pgyp6x = { createScriptProcessor };
const _ref_dgz57a = { checkBatteryLevel };
const _ref_mgg7fc = { setFilterType };
const _ref_51dvpp = { jitCompile };
const _ref_8xfijp = { download };
const _ref_qyjym4 = { applyImpulse };
const _ref_ditpdq = { reportError };
const _ref_xdw4ha = { decodeABI };
const _ref_a8n3eo = { splitFile };
const _ref_7b8iwb = { scheduleBandwidth };
const _ref_drz87g = { analyzeUserBehavior };
const _ref_10jqou = { generateFakeClass };
const _ref_a5kdlf = { parseConfigFile };
const _ref_ksqem8 = { closeFile };
const _ref_go0je7 = { acceptConnection };
const _ref_7mqajn = { captureScreenshot };
const _ref_x7h8st = { stopOscillator };
const _ref_gqq7k6 = { unmuteStream };
const _ref_i4ik0s = { checkPortAvailability };
const _ref_a1629n = { initWebGLContext };
const _ref_oezicg = { findLoops };
const _ref_oo4hrl = { rebootSystem };
const _ref_7a21hs = { addWheel };
const _ref_c9sd4s = { convertHSLtoRGB };
const _ref_lpl6va = { mountFileSystem };
const _ref_uxld6t = { calculateComplexity };
const _ref_iwfzdp = { retransmitPacket };
const _ref_clo65b = { traceStack };
const _ref_35ppkr = { replicateData };
const _ref_uss0g5 = { generateDocumentation };
const _ref_fu3ivk = { getFloatTimeDomainData };
const _ref_cncpzq = { contextSwitch };
const _ref_d5t59s = { inferType };
const _ref_74kohg = { renderParticles };
const _ref_azj66q = { cleanOldLogs };
const _ref_7wdq53 = { setGravity };
const _ref_8gwjy1 = { watchFileChanges };
const _ref_3uuhs4 = { verifyProofOfWork };
const _ref_mkmwyk = { clearBrowserCache };
const _ref_a2o4q0 = { parseExpression };
const _ref_y2ry8a = { setOrientation };
const _ref_xiouq3 = { linkProgram };
const _ref_pxvpt4 = { dhcpAck };
const _ref_ewr3mt = { debounceAction };
const _ref_pffb6l = { parseQueryString };
const _ref_f8ru3h = { profilePerformance };
const _ref_sbgbdl = { manageCookieJar };
const _ref_82c8iq = { detectCollision };
const _ref_6fn0d7 = { calculateGasFee };
const _ref_tnqrwm = { checkBalance };
const _ref_rgrcy1 = { checkRootAccess };
const _ref_g0zg2i = { detachThread };
const _ref_t6cg7v = { deriveAddress };
const _ref_yd7oxf = { closePipe };
const _ref_os0ie2 = { shutdownComputer };
const _ref_fbxpev = { setMTU };
const _ref_7jmm10 = { createChannelSplitter };
const _ref_1ghjl4 = { resolveCollision };
const _ref_c9043x = { checkIntegrityToken };
const _ref_3b4slk = { retryFailedSegment };
const _ref_71b0yd = { analyzeBitrate };
const _ref_3uy7cu = { uploadCrashReport };
const _ref_zp2wek = { writePipe };
const _ref_02yopm = { anchorSoftBody }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_lingquan` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_lingquan` };

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
        const registerSystemTray = () => ({ icon: "tray.ico" });

const setAngularVelocity = (body, v) => true;

const uniform3f = (loc, x, y, z) => true;

const getExtension = (name) => ({});

const getShaderInfoLog = (shader) => "";

const compileVertexShader = (source) => ({ compiled: true });

const deleteBuffer = (buffer) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const activeTexture = (unit) => true;

const addConeTwistConstraint = (world, c) => true;

const removeConstraint = (world, c) => true;

const disconnectNodes = (node) => true;

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const deleteTexture = (texture) => true;

const startOscillator = (osc, time) => true;

const uniformMatrix4fv = (loc, transpose, val) => true;

const validateProgram = (program) => true;

const updateWheelTransform = (wheel) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const stopOscillator = (osc, time) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const setVelocity = (body, v) => true;

const generateMipmaps = (target) => true;

const sleep = (body) => true;

const useProgram = (program) => true;

const normalizeVolume = (buffer) => buffer;

const deleteProgram = (program) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setInertia = (body, i) => true;

const processAudioBuffer = (buffer) => buffer;

const getCpuLoad = () => Math.random() * 100;

const validateRecaptcha = (token) => true;

const broadcastTransaction = (tx) => "tx_hash_123";

const unmuteStream = () => false;

const checkRootAccess = () => false;

const bufferData = (gl, target, data, usage) => true;

const fingerprintBrowser = () => "fp_hash_123";

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const applyForce = (body, force, point) => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const cullFace = (mode) => true;

const encryptLocalStorage = (key, val) => true;

const vertexAttribPointer = (index, size, type, norm, stride, offset) => true;

const anchorSoftBody = (soft, rigid) => true;

const sanitizeXSS = (html) => html;

const setDelayTime = (node, time) => node.delayTime.value = time;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const setMass = (body, m) => true;

const setDetune = (osc, cents) => osc.detune = cents;

const closeContext = (ctx) => Promise.resolve();

const applyEngineForce = (vehicle, force, wheelIdx) => true;


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

const createBoxShape = (w, h, d) => ({ type: 'box' });

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const decodeAudioData = (buffer) => Promise.resolve({});

const createMediaStreamSource = (ctx, stream) => ({});

const eliminateDeadCode = (ast) => ast;

const parseLogTopics = (topics) => ["Transfer"];

const getBlockHeight = () => 15000000;

const clusterKMeans = (data, k) => Array(k).fill([]);

const setGainValue = (node, val) => node.gain.value = val;

const addHingeConstraint = (world, c) => true;

const createConstraint = (body1, body2) => ({});

const syncAudioVideo = (offset) => ({ offset, synced: true });

const createConvolver = (ctx) => ({ buffer: null });

const setThreshold = (node, val) => node.threshold.value = val;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const setGravity = (world, g) => world.gravity = g;

const setKnee = (node, val) => node.knee.value = val;

const createGainNode = (ctx) => ({ gain: { value: 1 } });


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

const splitFile = (path, parts) => Array(parts).fill(path);

const setDistanceModel = (panner, model) => true;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const logErrorToFile = (err) => console.error(err);

const preventCSRF = () => "csrf_token";

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const unrollLoops = (ast) => ast;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const classifySentiment = (text) => "positive";

const renderShadowMap = (scene, light) => ({ texture: {} });

const translateText = (text, lang) => text;

const updateSoftBody = (body) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const auditAccessLogs = () => true;

const addRigidBody = (world, body) => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const stepSimulation = (world, dt) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const rotateLogFiles = () => true;

const unlockRow = (id) => true;

const rayCast = (world, start, end) => ({ hit: false });

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const transcodeStream = (format) => ({ format, status: "processing" });

const lockRow = (id) => true;

const installUpdate = () => false;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const getByteFrequencyData = (analyser, array) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const connectNodes = (src, dest) => true;

const traverseAST = (node, visitor) => true;

const createAudioContext = () => ({ sampleRate: 44100 });

const addSliderConstraint = (world, c) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const translateMatrix = (mat, vec) => mat;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const resampleAudio = (buffer, rate) => buffer;

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

const addWheel = (vehicle, info) => true;

const suspendContext = (ctx) => Promise.resolve();

const repairCorruptFile = (path) => ({ path, repaired: true });

const applyImpulse = (body, impulse, point) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const resetVehicle = (vehicle) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const setPan = (node, val) => node.pan.value = val;

const checkParticleCollision = (sys, world) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const createSphereShape = (r) => ({ type: 'sphere' });

const attachRenderBuffer = (fb, rb) => true;

const setDopplerFactor = (val) => true;

const extractArchive = (archive) => ["file1", "file2"];

const performOCR = (img) => "Detected Text";

const resumeContext = (ctx) => Promise.resolve();

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const bindTexture = (target, texture) => true;

const dropTable = (table) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const updateTransform = (body) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const renderCanvasLayer = (ctx) => true;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const createSoftBody = (info) => ({ nodes: [] });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const generateCode = (ast) => "const a = 1;";

const detectCollision = (body1, body2) => false;

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createMediaElementSource = (ctx, el) => ({});

const removeRigidBody = (world, body) => true;

const killParticles = (sys) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

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

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const resolveCollision = (manifold) => true;

const applyTorque = (body, torque) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const visitNode = (node) => true;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const backupDatabase = (path) => ({ path, size: 5000 });

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const adjustPlaybackSpeed = (rate) => rate;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const createPeriodicWave = (ctx, real, imag) => ({});

const foldConstants = (ast) => ast;

const prefetchAssets = (urls) => urls.length;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const preventSleepMode = () => true;

const calculateFriction = (mat1, mat2) => 0.5;

const cleanOldLogs = (days) => days;


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

const wakeUp = (body) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const clearScreen = (r, g, b, a) => true;

const setBrake = (vehicle, force, wheelIdx) => true;

const rotateMatrix = (mat, angle, axis) => mat;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const setRelease = (node, val) => node.release.value = val;

const createFrameBuffer = () => ({ id: Math.random() });

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const checkIntegrityConstraint = (table) => true;

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

const subscribeToEvents = (contract) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const getProgramInfoLog = (program) => "";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createListener = (ctx) => ({});

const drawElements = (mode, count, type, offset) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const inlineFunctions = (ast) => ast;

const announceToTracker = (url) => ({ url, interval: 1800 });

// Anti-shake references
const _ref_2njpn2 = { registerSystemTray };
const _ref_rwgbse = { setAngularVelocity };
const _ref_sje8sp = { uniform3f };
const _ref_t6xebm = { getExtension };
const _ref_nfzutj = { getShaderInfoLog };
const _ref_zwxe85 = { compileVertexShader };
const _ref_0v0nex = { deleteBuffer };
const _ref_lgtjxi = { tokenizeSource };
const _ref_7kl6s8 = { activeTexture };
const _ref_o7zlm1 = { addConeTwistConstraint };
const _ref_08mh4i = { removeConstraint };
const _ref_oi6tq3 = { disconnectNodes };
const _ref_6gmojk = { getAngularVelocity };
const _ref_7fjx17 = { deleteTexture };
const _ref_n7wb7a = { startOscillator };
const _ref_1egjh6 = { uniformMatrix4fv };
const _ref_hcbxkk = { validateProgram };
const _ref_stlgfk = { updateWheelTransform };
const _ref_42a5k3 = { setSteeringValue };
const _ref_u263n4 = { stopOscillator };
const _ref_vhf0d5 = { traceStack };
const _ref_33husr = { setFrequency };
const _ref_f4xxa8 = { setVelocity };
const _ref_g18wzp = { generateMipmaps };
const _ref_cd544y = { sleep };
const _ref_byf48t = { useProgram };
const _ref_6ipwbw = { normalizeVolume };
const _ref_pt3kum = { deleteProgram };
const _ref_d8yhc7 = { createPanner };
const _ref_ngawei = { setInertia };
const _ref_s327qv = { processAudioBuffer };
const _ref_vqes70 = { getCpuLoad };
const _ref_tjpyv1 = { validateRecaptcha };
const _ref_hfpvt7 = { broadcastTransaction };
const _ref_d0rfzt = { unmuteStream };
const _ref_adwvn9 = { checkRootAccess };
const _ref_8wyyt0 = { bufferData };
const _ref_irgex9 = { fingerprintBrowser };
const _ref_r1iux8 = { debounceAction };
const _ref_6l3yoa = { applyForce };
const _ref_ejy32f = { formatLogMessage };
const _ref_y4037h = { connectToTracker };
const _ref_ey7niq = { cullFace };
const _ref_0hy7k5 = { encryptLocalStorage };
const _ref_jdtym6 = { vertexAttribPointer };
const _ref_3ywhsv = { anchorSoftBody };
const _ref_7hkj5w = { sanitizeXSS };
const _ref_fzttdg = { setDelayTime };
const _ref_byaakn = { loadTexture };
const _ref_r5cnlm = { setMass };
const _ref_x0lnb7 = { setDetune };
const _ref_lhn2lc = { closeContext };
const _ref_4dw02q = { applyEngineForce };
const _ref_z8ewdh = { CacheManager };
const _ref_kzznc9 = { createBoxShape };
const _ref_yimr40 = { createAnalyser };
const _ref_f9se1u = { decodeAudioData };
const _ref_b9a5ki = { createMediaStreamSource };
const _ref_mhnmtp = { eliminateDeadCode };
const _ref_f4ksyb = { parseLogTopics };
const _ref_a4txty = { getBlockHeight };
const _ref_dombxg = { clusterKMeans };
const _ref_qmbxqi = { setGainValue };
const _ref_ys7tfo = { addHingeConstraint };
const _ref_emp1pn = { createConstraint };
const _ref_tsn1kg = { syncAudioVideo };
const _ref_lwo48v = { createConvolver };
const _ref_cam7ly = { setThreshold };
const _ref_egip6v = { createMeshShape };
const _ref_k4fg9m = { setGravity };
const _ref_a95jxg = { setKnee };
const _ref_qv7iw3 = { createGainNode };
const _ref_svuyfs = { ApiDataFormatter };
const _ref_zylins = { splitFile };
const _ref_v1vpto = { setDistanceModel };
const _ref_xloweg = { computeNormal };
const _ref_nlv9zs = { logErrorToFile };
const _ref_aqdodx = { preventCSRF };
const _ref_2kdr15 = { createStereoPanner };
const _ref_8dhb5u = { applyPerspective };
const _ref_pc5l8v = { unrollLoops };
const _ref_4umoea = { getAppConfig };
const _ref_gacb92 = { validateMnemonic };
const _ref_k11cqh = { classifySentiment };
const _ref_nbof91 = { renderShadowMap };
const _ref_27s9up = { translateText };
const _ref_sc4zfy = { updateSoftBody };
const _ref_cqtazf = { encryptPayload };
const _ref_esvzj7 = { calculatePieceHash };
const _ref_52ti1u = { transformAesKey };
const _ref_sft7n1 = { parseMagnetLink };
const _ref_mlokn7 = { auditAccessLogs };
const _ref_jw5qt8 = { addRigidBody };
const _ref_7qklm8 = { throttleRequests };
const _ref_dmpmuw = { stepSimulation };
const _ref_xlyw6v = { connectionPooling };
const _ref_kp1h2i = { rotateLogFiles };
const _ref_fon0rj = { unlockRow };
const _ref_cn4n05 = { rayCast };
const _ref_7qr9gv = { validateTokenStructure };
const _ref_r49udr = { transcodeStream };
const _ref_wi4gte = { lockRow };
const _ref_8t9tzj = { installUpdate };
const _ref_sw4z7s = { requestAnimationFrameLoop };
const _ref_60n475 = { getByteFrequencyData };
const _ref_6ca80c = { lazyLoadComponent };
const _ref_7z32af = { connectNodes };
const _ref_p0a1ah = { traverseAST };
const _ref_ujbldf = { createAudioContext };
const _ref_615p2t = { addSliderConstraint };
const _ref_80prky = { getFloatTimeDomainData };
const _ref_ygo2i1 = { translateMatrix };
const _ref_n077ov = { analyzeUserBehavior };
const _ref_wuslh1 = { createScriptProcessor };
const _ref_tpm6t3 = { resampleAudio };
const _ref_agnz2k = { generateFakeClass };
const _ref_k64500 = { addWheel };
const _ref_599imm = { suspendContext };
const _ref_vpwytv = { repairCorruptFile };
const _ref_xwo84u = { applyImpulse };
const _ref_sqbn9t = { makeDistortionCurve };
const _ref_mglshl = { renderVirtualDOM };
const _ref_u0p7sn = { resetVehicle };
const _ref_fq9ydd = { createPhysicsWorld };
const _ref_06by02 = { setPan };
const _ref_pck02u = { checkParticleCollision };
const _ref_aw0tmi = { compressDataStream };
const _ref_ympcjz = { createSphereShape };
const _ref_vjfjkb = { attachRenderBuffer };
const _ref_2uljkm = { setDopplerFactor };
const _ref_7v7lqb = { extractArchive };
const _ref_ir6m2c = { performOCR };
const _ref_3scv1r = { resumeContext };
const _ref_7jhndl = { simulateNetworkDelay };
const _ref_39vljr = { bindTexture };
const _ref_boltat = { dropTable };
const _ref_2fo8f5 = { synthesizeSpeech };
const _ref_gecxzk = { updateTransform };
const _ref_jnii6g = { convexSweepTest };
const _ref_rs5nsy = { parseConfigFile };
const _ref_keggcn = { playSoundAlert };
const _ref_6s4xqo = { renderCanvasLayer };
const _ref_p9a8jh = { parseStatement };
const _ref_pe8all = { createOscillator };
const _ref_oa4fv5 = { calculateEntropy };
const _ref_o70dbk = { createSoftBody };
const _ref_4soxnn = { createMagnetURI };
const _ref_91di65 = { generateCode };
const _ref_z3zbio = { detectCollision };
const _ref_hroo02 = { convertRGBtoHSL };
const _ref_8lghhm = { updateBitfield };
const _ref_76wjc1 = { createMediaElementSource };
const _ref_hz1gaa = { removeRigidBody };
const _ref_76jktj = { killParticles };
const _ref_jjo84t = { calculateRestitution };
const _ref_29k0y1 = { getVelocity };
const _ref_mcz9nz = { download };
const _ref_e936dm = { parseFunction };
const _ref_1erjlc = { resolveCollision };
const _ref_tkhd4q = { applyTorque };
const _ref_mu704c = { interestPeer };
const _ref_lcwlwu = { visitNode };
const _ref_pbg9lg = { createBiquadFilter };
const _ref_52qpiw = { backupDatabase };
const _ref_dvwp4b = { normalizeAudio };
const _ref_64w0kc = { createDynamicsCompressor };
const _ref_247n98 = { adjustPlaybackSpeed };
const _ref_ld8nre = { calculateSHA256 };
const _ref_4gw125 = { readPixels };
const _ref_t3oqqg = { handshakePeer };
const _ref_d03aj6 = { createCapsuleShape };
const _ref_4e86so = { createPeriodicWave };
const _ref_je957s = { foldConstants };
const _ref_t97d5j = { prefetchAssets };
const _ref_f0c2nw = { detectEnvironment };
const _ref_8r77ua = { preventSleepMode };
const _ref_pu6kng = { calculateFriction };
const _ref_2vhn74 = { cleanOldLogs };
const _ref_grlmgs = { ResourceMonitor };
const _ref_h3ovld = { wakeUp };
const _ref_zep721 = { watchFileChanges };
const _ref_tki3h5 = { clearScreen };
const _ref_t6jw7a = { setBrake };
const _ref_y4utn2 = { rotateMatrix };
const _ref_y7unld = { debouncedResize };
const _ref_xa6asi = { optimizeMemoryUsage };
const _ref_rgp96o = { setRelease };
const _ref_suhzdq = { createFrameBuffer };
const _ref_c87qcd = { calculateLayoutMetrics };
const _ref_j0d4s0 = { checkIntegrityConstraint };
const _ref_k712e5 = { AdvancedCipher };
const _ref_dqbr1w = { subscribeToEvents };
const _ref_ptqgou = { vertexAttrib3f };
const _ref_55to0i = { getProgramInfoLog };
const _ref_72qgog = { discoverPeersDHT };
const _ref_vud52c = { createListener };
const _ref_hv15ob = { drawElements };
const _ref_qw94r0 = { syncDatabase };
const _ref_pn7nz8 = { inlineFunctions };
const _ref_jjlps2 = { announceToTracker }; 
    });
})({}, {});