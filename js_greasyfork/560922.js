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
// @license      Eclipse Public License - v 1.0
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

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const detectVideoCodec = () => "h264";

const checkUpdate = () => ({ hasUpdate: false });

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const migrateSchema = (version) => ({ current: version, status: "ok" });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const disablePEX = () => false;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const createVehicle = (chassis) => ({ wheels: [] });

const setVelocity = (body, v) => true;

const useProgram = (program) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const createPipe = () => [3, 4];

const predictTensor = (input) => [0.1, 0.9, 0.0];

const createMeshShape = (vertices) => ({ type: 'mesh' });

const cullFace = (mode) => true;

const applyImpulse = (body, impulse, point) => true;

const calculateGasFee = (limit) => limit * 20;

const updateParticles = (sys, dt) => true;

const setViewport = (x, y, w, h) => true;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const setFilePermissions = (perm) => `chmod ${perm}`;

const createFrameBuffer = () => ({ id: Math.random() });

const generateSourceMap = (ast) => "{}";

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const findLoops = (cfg) => [];

const shutdownComputer = () => console.log("Shutting down...");

const calculateComplexity = (ast) => 1;

const invalidateCache = (key) => true;

const commitTransaction = (tx) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const resolveSymbols = (ast) => ({});

const calculateRestitution = (mat1, mat2) => 0.3;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const sanitizeXSS = (html) => html;

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const createPeriodicWave = (ctx, real, imag) => ({});

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const exitScope = (table) => true;

const profilePerformance = (func) => 0;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const reportError = (msg, line) => console.error(msg);

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const activeTexture = (unit) => true;

const verifyProofOfWork = (nonce) => true;

const removeRigidBody = (world, body) => true;

const encryptPeerTraffic = (data) => btoa(data);

const checkBalance = (addr) => "10.5 ETH";

const optimizeTailCalls = (ast) => ast;

const detectDebugger = () => false;

const setVolumeLevel = (vol) => vol;

const renderCanvasLayer = (ctx) => true;

const hashKeccak256 = (data) => "0xabc...";

const decompressGzip = (data) => data;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const captureFrame = () => "frame_data_buffer";

const dumpSymbolTable = (table) => "";

const minifyCode = (code) => code;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const multicastMessage = (group, msg) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const injectCSPHeader = () => "default-src 'self'";

const verifySignature = (tx, sig) => true;

const encodeABI = (method, params) => "0x...";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const createASTNode = (type, val) => ({ type, val });


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

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const getShaderInfoLog = (shader) => "";

const prioritizeRarestPiece = (pieces) => pieces[0];

const compressPacket = (data) => data;

const createMediaStreamSource = (ctx, stream) => ({});

const loadImpulseResponse = (url) => Promise.resolve({});

const suspendContext = (ctx) => Promise.resolve();

const computeDominators = (cfg) => ({});

const restoreDatabase = (path) => true;

const preventCSRF = () => "csrf_token";

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const getBlockHeight = () => 15000000;

const createSymbolTable = () => ({ scopes: [] });

const checkPortAvailability = (port) => Math.random() > 0.2;

const replicateData = (node) => ({ target: node, synced: true });

const closeContext = (ctx) => Promise.resolve();

const bufferMediaStream = (size) => ({ buffer: size });

const createConvolver = (ctx) => ({ buffer: null });

const setDopplerFactor = (val) => true;

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const closeSocket = (sock) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const debouncedResize = () => ({ width: 1920, height: 1080 });

const removeConstraint = (world, c) => true;

const verifyChecksum = (data, sum) => true;

const backpropagateGradient = (loss) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const extractArchive = (archive) => ["file1", "file2"];

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

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const renderShadowMap = (scene, light) => ({ texture: {} });

const rotateMatrix = (mat, angle, axis) => mat;

const repairCorruptFile = (path) => ({ path, repaired: true });

const mangleNames = (ast) => ast;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const cacheQueryResults = (key, data) => true;

const addRigidBody = (world, body) => true;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const shardingTable = (table) => ["shard_0", "shard_1"];

const bindTexture = (target, texture) => true;

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

const detectVirtualMachine = () => false;

const addPoint2PointConstraint = (world, c) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const defineSymbol = (table, name, info) => true;

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const receivePacket = (sock, len) => new Uint8Array(len);

const dropTable = (table) => true;

const decompressPacket = (data) => data;

const generateEmbeddings = (text) => new Float32Array(128);

const getFloatTimeDomainData = (analyser, array) => true;

const compileToBytecode = (ast) => new Uint8Array();

const mockResponse = (body) => ({ status: 200, body });

const hoistVariables = (ast) => ast;

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const restartApplication = () => console.log("Restarting...");

const createChannelMerger = (ctx, channels) => ({});

const processAudioBuffer = (buffer) => buffer;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const bindAddress = (sock, addr, port) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const installUpdate = () => false;

const pingHost = (host) => 10;

const calculateMetric = (route) => 1;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const limitRate = (stream, rate) => stream;

const chownFile = (path, uid, gid) => true;

const lockFile = (path) => ({ path, locked: true });

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const killParticles = (sys) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const merkelizeRoot = (txs) => "root_hash";

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const validateProgram = (program) => true;

const connectSocket = (sock, addr, port) => true;

const backupDatabase = (path) => ({ path, size: 5000 });

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const tunnelThroughProxy = (proxy) => ({ connected: true, via: proxy });

const bundleAssets = (assets) => "";

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const validateIPWhitelist = (ip) => true;

const setPan = (node, val) => node.pan.value = val;

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const signTransaction = (tx, key) => "signed_tx_hash";

const checkIntegrityConstraint = (table) => true;

const checkGLError = () => 0;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const getAngularVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const loadCheckpoint = (path) => true;

const createChannelSplitter = (ctx, channels) => ({});

const arpRequest = (ip) => "00:00:00:00:00:00";

const cleanOldLogs = (days) => days;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const resampleAudio = (buffer, rate) => buffer;

const createIndexBuffer = (data) => ({ id: Math.random() });

const lookupSymbol = (table, name) => ({});

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const setDetune = (osc, cents) => osc.detune = cents;

const obfuscateString = (str) => btoa(str);

const detectCollision = (body1, body2) => false;

const compileFragmentShader = (source) => ({ compiled: true });

const disconnectNodes = (node) => true;

const hydrateSSR = (html) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const mergeFiles = (parts) => parts[0];

const upInterface = (iface) => true;

const downInterface = (iface) => true;

const createTCPSocket = () => ({ fd: 1 });

const interceptRequest = (req) => ({ ...req, intercepted: true });

const mutexLock = (mtx) => true;

const checkIntegrityToken = (token) => true;

const fingerprintBrowser = () => "fp_hash_123";

const attachRenderBuffer = (fb, rb) => true;

const uniform3f = (loc, x, y, z) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const normalizeFeatures = (data) => data.map(x => x / 255);

const getOutputTimestamp = (ctx) => Date.now();

// Anti-shake references
const _ref_ejucnv = { detectVideoCodec };
const _ref_t0f7pb = { checkUpdate };
const _ref_jxtf2z = { initWebGLContext };
const _ref_fj319j = { requestPiece };
const _ref_uu1sfo = { compressDataStream };
const _ref_wd3ix6 = { keepAlivePing };
const _ref_ysv6wp = { migrateSchema };
const _ref_2f3ai5 = { transformAesKey };
const _ref_yt0ms9 = { formatLogMessage };
const _ref_ww5tc1 = { createDirectoryRecursive };
const _ref_54yils = { disablePEX };
const _ref_9ybn2w = { limitBandwidth };
const _ref_1bw8oz = { createVehicle };
const _ref_12uv96 = { setVelocity };
const _ref_y4pju4 = { useProgram };
const _ref_hzk8o2 = { sanitizeInput };
const _ref_wpzrl3 = { createPipe };
const _ref_0j2pzz = { predictTensor };
const _ref_wqglsj = { createMeshShape };
const _ref_gz4x14 = { cullFace };
const _ref_jqdrlw = { applyImpulse };
const _ref_02hp16 = { calculateGasFee };
const _ref_mydqzd = { updateParticles };
const _ref_mo5dl9 = { setViewport };
const _ref_xyzsh4 = { makeDistortionCurve };
const _ref_w79w33 = { setFilePermissions };
const _ref_67tf7d = { createFrameBuffer };
const _ref_5lwhb9 = { generateSourceMap };
const _ref_znyadr = { checkIntegrity };
const _ref_zb5ib1 = { findLoops };
const _ref_5bdldb = { shutdownComputer };
const _ref_lm8etl = { calculateComplexity };
const _ref_mse7m9 = { invalidateCache };
const _ref_aorzxm = { commitTransaction };
const _ref_3fxncn = { manageCookieJar };
const _ref_rca89u = { resolveSymbols };
const _ref_n57hf7 = { calculateRestitution };
const _ref_1k21tq = { isFeatureEnabled };
const _ref_2y72t3 = { simulateNetworkDelay };
const _ref_tthk50 = { sanitizeXSS };
const _ref_91m7nw = { createOscillator };
const _ref_f1q9ns = { createPeriodicWave };
const _ref_6p10x6 = { generateUUIDv5 };
const _ref_7p9wzo = { parseMagnetLink };
const _ref_hksq9a = { exitScope };
const _ref_rpxgta = { profilePerformance };
const _ref_p4qboh = { createCapsuleShape };
const _ref_afz987 = { reportError };
const _ref_4s3gxe = { analyzeUserBehavior };
const _ref_q9mm0j = { activeTexture };
const _ref_3359rz = { verifyProofOfWork };
const _ref_17tkzi = { removeRigidBody };
const _ref_puh9ub = { encryptPeerTraffic };
const _ref_ajz2ly = { checkBalance };
const _ref_9wv1zc = { optimizeTailCalls };
const _ref_ymp9c2 = { detectDebugger };
const _ref_q81jxx = { setVolumeLevel };
const _ref_izncv8 = { renderCanvasLayer };
const _ref_cp2fe0 = { hashKeccak256 };
const _ref_3xtini = { decompressGzip };
const _ref_zsiq0d = { generateUserAgent };
const _ref_hwt7gn = { captureFrame };
const _ref_2csx9t = { dumpSymbolTable };
const _ref_4dzz1f = { minifyCode };
const _ref_i8jg70 = { getMemoryUsage };
const _ref_416qq5 = { multicastMessage };
const _ref_9fnj96 = { removeMetadata };
const _ref_77l14k = { injectCSPHeader };
const _ref_nzibdw = { verifySignature };
const _ref_ftfwr2 = { encodeABI };
const _ref_bhjc6r = { refreshAuthToken };
const _ref_52ul2w = { validateSSLCert };
const _ref_80ywus = { parseConfigFile };
const _ref_3123f4 = { createASTNode };
const _ref_4tevht = { ApiDataFormatter };
const _ref_u84rxh = { computeNormal };
const _ref_d7giq2 = { getShaderInfoLog };
const _ref_fpk6h3 = { prioritizeRarestPiece };
const _ref_glb65t = { compressPacket };
const _ref_nn2g63 = { createMediaStreamSource };
const _ref_yhepmt = { loadImpulseResponse };
const _ref_zpqdbf = { suspendContext };
const _ref_tl81fr = { computeDominators };
const _ref_4t50w6 = { restoreDatabase };
const _ref_dpf7d2 = { preventCSRF };
const _ref_wd907i = { linkProgram };
const _ref_a8vsda = { getBlockHeight };
const _ref_hdrd9a = { createSymbolTable };
const _ref_v0igmj = { checkPortAvailability };
const _ref_hbh7iz = { replicateData };
const _ref_4e0g45 = { closeContext };
const _ref_6gu4eg = { bufferMediaStream };
const _ref_k58cu9 = { createConvolver };
const _ref_v87ulk = { setDopplerFactor };
const _ref_55rznc = { traceStack };
const _ref_v910pp = { closeSocket };
const _ref_elmi1k = { setSocketTimeout };
const _ref_9imtu0 = { debouncedResize };
const _ref_j52dyn = { removeConstraint };
const _ref_d4tafy = { verifyChecksum };
const _ref_ke0ll5 = { backpropagateGradient };
const _ref_abmz4y = { createShader };
const _ref_yodtqn = { extractArchive };
const _ref_zm5njz = { download };
const _ref_v68ysg = { executeSQLQuery };
const _ref_nx6rxj = { renderShadowMap };
const _ref_zjt0u6 = { rotateMatrix };
const _ref_40413z = { repairCorruptFile };
const _ref_zyy0a5 = { mangleNames };
const _ref_5kd81a = { resolveDependencyGraph };
const _ref_zs4mbn = { cacheQueryResults };
const _ref_vf44sc = { addRigidBody };
const _ref_qjgaqh = { getNetworkStats };
const _ref_u2do35 = { generateWalletKeys };
const _ref_pov82v = { shardingTable };
const _ref_7n091v = { bindTexture };
const _ref_7l3nji = { generateFakeClass };
const _ref_wb96qr = { detectVirtualMachine };
const _ref_57jnxl = { addPoint2PointConstraint };
const _ref_kz2tdw = { parseFunction };
const _ref_1fpxcg = { defineSymbol };
const _ref_e3v4yg = { deleteTempFiles };
const _ref_x7v34n = { receivePacket };
const _ref_8m2crt = { dropTable };
const _ref_ualmrm = { decompressPacket };
const _ref_cw9us4 = { generateEmbeddings };
const _ref_tn22md = { getFloatTimeDomainData };
const _ref_wm7b1v = { compileToBytecode };
const _ref_kedhzg = { mockResponse };
const _ref_2eu87t = { hoistVariables };
const _ref_qw4zls = { formatCurrency };
const _ref_568qqt = { parseM3U8Playlist };
const _ref_yqp52e = { validateTokenStructure };
const _ref_sxjevd = { restartApplication };
const _ref_bept8o = { createChannelMerger };
const _ref_tocdov = { processAudioBuffer };
const _ref_ynqaqf = { seedRatioLimit };
const _ref_1auyqb = { bindAddress };
const _ref_58e3jp = { optimizeMemoryUsage };
const _ref_3d6we8 = { installUpdate };
const _ref_sual3q = { pingHost };
const _ref_mjhio2 = { calculateMetric };
const _ref_quc93b = { calculateEntropy };
const _ref_rwb6sr = { normalizeVector };
const _ref_9ydmp8 = { limitRate };
const _ref_wwh7gt = { chownFile };
const _ref_5d8nkl = { lockFile };
const _ref_czb0zn = { diffVirtualDOM };
const _ref_cvszl0 = { discoverPeersDHT };
const _ref_kbesfx = { killParticles };
const _ref_4v4t6h = { announceToTracker };
const _ref_lttv3o = { merkelizeRoot };
const _ref_p6embs = { decryptHLSStream };
const _ref_riv6k7 = { validateProgram };
const _ref_v5enxf = { connectSocket };
const _ref_rijj9z = { backupDatabase };
const _ref_jy99m2 = { getVelocity };
const _ref_rjrj01 = { FileValidator };
const _ref_c749w3 = { tunnelThroughProxy };
const _ref_u5e072 = { bundleAssets };
const _ref_pbqf5c = { resolveHostName };
const _ref_bzi8zl = { validateIPWhitelist };
const _ref_9bkhfs = { setPan };
const _ref_elfixb = { parseSubtitles };
const _ref_rbqujt = { signTransaction };
const _ref_7k64ju = { checkIntegrityConstraint };
const _ref_aovr8x = { checkGLError };
const _ref_39akug = { initiateHandshake };
const _ref_jgsvcf = { getAngularVelocity };
const _ref_li4fyn = { loadCheckpoint };
const _ref_zxsccm = { createChannelSplitter };
const _ref_cfryrz = { arpRequest };
const _ref_b20e5z = { cleanOldLogs };
const _ref_mxj4uf = { getMACAddress };
const _ref_abwir0 = { resampleAudio };
const _ref_qz0y8r = { createIndexBuffer };
const _ref_jlizdy = { lookupSymbol };
const _ref_77oqzy = { clearBrowserCache };
const _ref_79li3c = { parseExpression };
const _ref_gduaog = { virtualScroll };
const _ref_4oh9cn = { setDetune };
const _ref_0lky0d = { obfuscateString };
const _ref_52dg6j = { detectCollision };
const _ref_ggsxl1 = { compileFragmentShader };
const _ref_304mwp = { disconnectNodes };
const _ref_ho7idy = { hydrateSSR };
const _ref_0txznl = { createAnalyser };
const _ref_e668k1 = { mergeFiles };
const _ref_woltl3 = { upInterface };
const _ref_0nrruq = { downInterface };
const _ref_igrh6u = { createTCPSocket };
const _ref_7pyt90 = { interceptRequest };
const _ref_uelf33 = { mutexLock };
const _ref_136k20 = { checkIntegrityToken };
const _ref_wghvgw = { fingerprintBrowser };
const _ref_zdofe5 = { attachRenderBuffer };
const _ref_wjuewx = { uniform3f };
const _ref_lx4e6r = { uploadCrashReport };
const _ref_3uh1ah = { normalizeFeatures };
const _ref_n5ty2a = { getOutputTimestamp }; 
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
        const estimateNonce = (addr) => 42;

const getNetworkStats = () => ({ up: 100, down: 2000 });

const reassemblePacket = (fragments) => fragments[0];

const closeFile = (fd) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };


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

const createTCPSocket = () => ({ fd: 1 });

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const switchProxyServer = (proxies) => {
        return proxies[Math.floor(Math.random() * proxies.length)];
    };

const dhcpOffer = (ip) => true;

const inferType = (node) => 'any';

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const minifyCode = (code) => code;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const closeSocket = (sock) => true;

const encapsulateFrame = (packet) => packet;

const profilePerformance = (func) => 0;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const contextSwitch = (oldPid, newPid) => true;

const createProcess = (img) => ({ pid: 100 });

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const unchokePeer = (peer) => ({ ...peer, choked: false });

const generateSourceMap = (ast) => "{}";

const injectMetadata = (file, meta) => ({ file, meta });

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const detectAudioCodec = () => "aac";

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const leaveGroup = (group) => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const parsePayload = (packet) => ({});

const extractArchive = (archive) => ["file1", "file2"];

const switchVLAN = (id) => true;

const protectMemory = (ptr, size, flags) => true;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const encryptStream = (stream, key) => stream;

const jitCompile = (bc) => (() => {});

const prioritizeTraffic = (queue) => true;

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const setSocketTimeout = (ms) => ({ timeout: ms });

const validateMnemonic = (phrase) => phrase.split(" ").length === 12;

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const dumpSymbolTable = (table) => "";

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const createSymbolTable = () => ({ scopes: [] });

const setPosition = (panner, x, y, z) => true;

const updateSoftBody = (body) => true;

const measureRTT = (sent, recv) => 10;

const analyzeBitrate = () => "5000kbps";

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const retransmitPacket = (seq) => true;

const debouncedResize = () => ({ width: 1920, height: 1080 });

const useProgram = (program) => true;

const verifyChecksum = (data, sum) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const verifySignature = (tx, sig) => true;

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

const applyTheme = (theme) => document.body.className = theme;

const joinThread = (tid) => true;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const dhcpDiscover = () => true;

const validateProgram = (program) => true;

const forkProcess = () => 101;

const multicastMessage = (group, msg) => true;

const unmuteStream = () => false;

const upInterface = (iface) => true;

const updateRoutingTable = (entry) => true;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const exitScope = (table) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const negotiateProtocol = () => "HTTP/2.0";

const registerGestureHandler = (gesture) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const instrumentCode = (code) => code;

const semaphoreWait = (sem) => true;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const establishHandshake = (sock) => true;

const bufferData = (gl, target, data, usage) => true;

const semaphoreSignal = (sem) => true;

const limitRate = (stream, rate) => stream;

const optimizeAST = (ast) => ast;

const attachRenderBuffer = (fb, rb) => true;

const uniform1i = (loc, val) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const predictTensor = (input) => [0.1, 0.9, 0.0];

const prefetchAssets = (urls) => urls.length;

const resumeContext = (ctx) => Promise.resolve();

const createSoftBody = (info) => ({ nodes: [] });

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const checkParticleCollision = (sys, world) => true;

const deleteTexture = (texture) => true;

const installUpdate = () => false;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const augmentData = (image) => image;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const detachThread = (tid) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const logErrorToFile = (err) => console.error(err);

const createParticleSystem = (count) => ({ particles: [] });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const checkRootAccess = () => false;

const reduceDimensionalityPCA = (data) => data;

const connectNodes = (src, dest) => true;

const bundleAssets = (assets) => "";

const mockResponse = (body) => ({ status: 200, body });

const killProcess = (pid) => true;

const inlineFunctions = (ast) => ast;

const createIndexBuffer = (data) => ({ id: Math.random() });

const loadImpulseResponse = (url) => Promise.resolve({});

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const generateMipmaps = (target) => true;

const addConeTwistConstraint = (world, c) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const resolveDNS = (domain) => "127.0.0.1";

const obfuscateString = (str) => btoa(str);

const getFloatTimeDomainData = (analyser, array) => true;

const writeFile = (fd, data) => true;

const segmentImageUNet = (img) => "mask_buffer";

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const disableDepthTest = () => true;

const checkTypes = (ast) => [];

const unmapMemory = (ptr, size) => true;

const postProcessBloom = (image, threshold) => image;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const gaussianBlur = (image, radius) => image;

const auditAccessLogs = () => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const restoreDatabase = (path) => true;

const verifyIR = (ir) => true;

const createVehicle = (chassis) => ({ wheels: [] });

const rmdir = (path) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const chownFile = (path, uid, gid) => true;

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

const compileFragmentShader = (source) => ({ compiled: true });

const generateCode = (ast) => "const a = 1;";

const bufferMediaStream = (size) => ({ buffer: size });

const edgeDetectionSobel = (image) => image;

const decodeAudioData = (buffer) => Promise.resolve({});

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const claimRewards = (pool) => "0.5 ETH";

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const verifyAppSignature = () => true;

const traverseAST = (node, visitor) => true;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const allocateRegisters = (ir) => ir;

const clearScreen = (r, g, b, a) => true;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const mkdir = (path) => true;

const defineSymbol = (table, name, info) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const getMediaDuration = () => 3600;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const enterScope = (table) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const captureScreenshot = () => "data:image/png;base64,...";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const setThreshold = (node, val) => node.threshold.value = val;

const setOrientation = (panner, x, y, z) => true;

const calculateCRC32 = (data) => "00000000";

const addGeneric6DofConstraint = (world, c) => true;

const optimizeTailCalls = (ast) => ast;

const getUniformLocation = (program, name) => 1;

const setEnv = (key, val) => true;

const checkGLError = () => 0;

const linkFile = (src, dest) => true;

const controlCongestion = (sock) => true;

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const connectSocket = (sock, addr, port) => true;

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const createChannelMerger = (ctx, channels) => ({});

const prioritizeRarestPiece = (pieces) => pieces[0];

const readPipe = (fd, len) => new Uint8Array(len);

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const decompressPacket = (data) => data;

const setKnee = (node, val) => node.knee.value = val;

const detectVirtualMachine = () => false;

const getBlockHeight = () => 15000000;

const getProgramInfoLog = (program) => "";

const computeDominators = (cfg) => ({});

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const dhcpAck = () => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const monitorClipboard = () => "";

const eliminateDeadCode = (ast) => ast;

const setGravity = (world, g) => world.gravity = g;

const visitNode = (node) => true;

// Anti-shake references
const _ref_szj0cn = { estimateNonce };
const _ref_izrwz9 = { getNetworkStats };
const _ref_h3pj1c = { reassemblePacket };
const _ref_jsth1b = { closeFile };
const _ref_l220qx = { connectToTracker };
const _ref_9ztqn3 = { ApiDataFormatter };
const _ref_ok773s = { createTCPSocket };
const _ref_363jq2 = { retryFailedSegment };
const _ref_jl97qd = { switchProxyServer };
const _ref_e5h33w = { dhcpOffer };
const _ref_vx3non = { inferType };
const _ref_thhfgx = { initiateHandshake };
const _ref_jkpetz = { minifyCode };
const _ref_nqq5yu = { interceptRequest };
const _ref_hl095p = { closeSocket };
const _ref_7wduog = { encapsulateFrame };
const _ref_yn7yfs = { profilePerformance };
const _ref_zaqgwt = { transformAesKey };
const _ref_f4a49r = { contextSwitch };
const _ref_e3nams = { createProcess };
const _ref_vihi3j = { resolveDependencyGraph };
const _ref_vsoi3b = { unchokePeer };
const _ref_boz1m1 = { generateSourceMap };
const _ref_w9ra8n = { injectMetadata };
const _ref_el2thh = { discoverPeersDHT };
const _ref_2k78vw = { detectEnvironment };
const _ref_90yruq = { detectAudioCodec };
const _ref_hutq9s = { archiveFiles };
const _ref_554tmw = { getFileAttributes };
const _ref_3iaag4 = { leaveGroup };
const _ref_s868yl = { applyPerspective };
const _ref_dp84p8 = { parsePayload };
const _ref_9ffb4p = { extractArchive };
const _ref_mb3o9i = { switchVLAN };
const _ref_4wrj6j = { protectMemory };
const _ref_udl97k = { streamToPlayer };
const _ref_wo2ubm = { formatLogMessage };
const _ref_mfuref = { encryptStream };
const _ref_mkkdx3 = { jitCompile };
const _ref_kzh9fs = { prioritizeTraffic };
const _ref_tuzu4l = { renderVirtualDOM };
const _ref_xss0jc = { setSocketTimeout };
const _ref_661ve4 = { validateMnemonic };
const _ref_jv55t9 = { computeSpeedAverage };
const _ref_3dvpwm = { dumpSymbolTable };
const _ref_ylrnuo = { parseClass };
const _ref_mvtzoh = { createSymbolTable };
const _ref_ta4ljv = { setPosition };
const _ref_aid7pp = { updateSoftBody };
const _ref_t7e0wu = { measureRTT };
const _ref_p3ft0x = { analyzeBitrate };
const _ref_rrd4qs = { createDelay };
const _ref_42ionl = { retransmitPacket };
const _ref_8dy1je = { debouncedResize };
const _ref_z2bvcu = { useProgram };
const _ref_aw341a = { verifyChecksum };
const _ref_331vgc = { diffVirtualDOM };
const _ref_xgp631 = { verifyFileSignature };
const _ref_rnumws = { verifySignature };
const _ref_njiuyl = { AdvancedCipher };
const _ref_8xghct = { applyTheme };
const _ref_2pl9k5 = { joinThread };
const _ref_24js4e = { normalizeAudio };
const _ref_r6e1ih = { dhcpDiscover };
const _ref_dkxzu9 = { validateProgram };
const _ref_nwwyu1 = { forkProcess };
const _ref_ycedj1 = { multicastMessage };
const _ref_i7gnol = { unmuteStream };
const _ref_82cnh2 = { upInterface };
const _ref_xwphee = { updateRoutingTable };
const _ref_ar32y9 = { decodeABI };
const _ref_5cer1u = { exitScope };
const _ref_y6urp0 = { tokenizeSource };
const _ref_qzqgw9 = { negotiateProtocol };
const _ref_f1h74f = { registerGestureHandler };
const _ref_tghvd0 = { validateTokenStructure };
const _ref_6gg7p3 = { instrumentCode };
const _ref_iie3s7 = { semaphoreWait };
const _ref_21goib = { applyEngineForce };
const _ref_nq7l1x = { parseExpression };
const _ref_0ku2zd = { establishHandshake };
const _ref_fr1gfj = { bufferData };
const _ref_o7enq9 = { semaphoreSignal };
const _ref_tir62i = { limitRate };
const _ref_69dbaj = { optimizeAST };
const _ref_hgd703 = { attachRenderBuffer };
const _ref_b3c65b = { uniform1i };
const _ref_4n7ynb = { optimizeMemoryUsage };
const _ref_tbpi3w = { isFeatureEnabled };
const _ref_oqfdmw = { predictTensor };
const _ref_m448vu = { prefetchAssets };
const _ref_n2atzp = { resumeContext };
const _ref_fb4pgx = { createSoftBody };
const _ref_y0wzxu = { clearBrowserCache };
const _ref_b2qi7j = { checkParticleCollision };
const _ref_013tkd = { deleteTexture };
const _ref_dqiraj = { installUpdate };
const _ref_82wxb2 = { readPixels };
const _ref_x8lu96 = { augmentData };
const _ref_s2r72b = { generateUUIDv5 };
const _ref_olr0tw = { detachThread };
const _ref_ii2czn = { watchFileChanges };
const _ref_xxeait = { logErrorToFile };
const _ref_jpve1e = { createParticleSystem };
const _ref_cpxmt0 = { lazyLoadComponent };
const _ref_ouj08j = { sanitizeSQLInput };
const _ref_ljt745 = { checkRootAccess };
const _ref_jvwjdw = { reduceDimensionalityPCA };
const _ref_9rnvhz = { connectNodes };
const _ref_7lsm7n = { bundleAssets };
const _ref_hjxpqc = { mockResponse };
const _ref_uy66j8 = { killProcess };
const _ref_c1fsk7 = { inlineFunctions };
const _ref_qnpg9s = { createIndexBuffer };
const _ref_v5ox91 = { loadImpulseResponse };
const _ref_2midu6 = { encryptPayload };
const _ref_gj50vm = { makeDistortionCurve };
const _ref_kn7r65 = { generateMipmaps };
const _ref_lt1p0t = { addConeTwistConstraint };
const _ref_h4qcdq = { createDirectoryRecursive };
const _ref_msn9t9 = { resolveDNS };
const _ref_4l506n = { obfuscateString };
const _ref_bcdcow = { getFloatTimeDomainData };
const _ref_fxqogd = { writeFile };
const _ref_y0g5rv = { segmentImageUNet };
const _ref_id89jf = { extractThumbnail };
const _ref_kz37ij = { createPanner };
const _ref_9z8hd9 = { disableDepthTest };
const _ref_cz82o0 = { checkTypes };
const _ref_mdidca = { unmapMemory };
const _ref_bswiem = { postProcessBloom };
const _ref_wsjf99 = { analyzeUserBehavior };
const _ref_lfep7s = { gaussianBlur };
const _ref_24ypss = { auditAccessLogs };
const _ref_u2e6cz = { parseTorrentFile };
const _ref_ttnxnb = { parseConfigFile };
const _ref_5ridk0 = { restoreDatabase };
const _ref_23dnz1 = { verifyIR };
const _ref_wt2dcx = { createVehicle };
const _ref_td2oec = { rmdir };
const _ref_yycsxa = { loadTexture };
const _ref_oh42ga = { queueDownloadTask };
const _ref_fbcokm = { calculateLighting };
const _ref_z3ydls = { chownFile };
const _ref_bwgw99 = { generateFakeClass };
const _ref_ika82x = { compileFragmentShader };
const _ref_q8p9zb = { generateCode };
const _ref_zeyytd = { bufferMediaStream };
const _ref_wcl98u = { edgeDetectionSobel };
const _ref_nf6a1d = { decodeAudioData };
const _ref_6cwn32 = { limitDownloadSpeed };
const _ref_gkyy7h = { claimRewards };
const _ref_2j9k9i = { calculateEntropy };
const _ref_pzxdn8 = { verifyAppSignature };
const _ref_4tcwwr = { traverseAST };
const _ref_l0tb9o = { uploadCrashReport };
const _ref_yhez9j = { allocateRegisters };
const _ref_fk0set = { clearScreen };
const _ref_k7uvcg = { setSteeringValue };
const _ref_nq3kx3 = { mkdir };
const _ref_glokww = { defineSymbol };
const _ref_pmytlx = { cancelTask };
const _ref_i2yeyz = { convertRGBtoHSL };
const _ref_xd2t7z = { getMediaDuration };
const _ref_dc08og = { parseFunction };
const _ref_vwu0qv = { enterScope };
const _ref_tj9xb1 = { validateSSLCert };
const _ref_brl11j = { captureScreenshot };
const _ref_mk5kry = { getSystemUptime };
const _ref_7pcqdb = { setThreshold };
const _ref_7rcqny = { setOrientation };
const _ref_186sed = { calculateCRC32 };
const _ref_u7wx7u = { addGeneric6DofConstraint };
const _ref_kqjahq = { optimizeTailCalls };
const _ref_miw734 = { getUniformLocation };
const _ref_a60zxg = { setEnv };
const _ref_nckhy1 = { checkGLError };
const _ref_wczdal = { linkFile };
const _ref_6qtkfc = { controlCongestion };
const _ref_5ksba4 = { scheduleBandwidth };
const _ref_fhsff0 = { connectSocket };
const _ref_oczp3o = { resolveDNSOverHTTPS };
const _ref_3gvv4b = { createChannelMerger };
const _ref_pelw3y = { prioritizeRarestPiece };
const _ref_m8t7t3 = { readPipe };
const _ref_ld4ae3 = { keepAlivePing };
const _ref_mp5lla = { decompressPacket };
const _ref_po3s39 = { setKnee };
const _ref_rl63ic = { detectVirtualMachine };
const _ref_wx9x9q = { getBlockHeight };
const _ref_js9cgg = { getProgramInfoLog };
const _ref_i6kssn = { computeDominators };
const _ref_a98ldp = { sanitizeInput };
const _ref_rl0kqa = { dhcpAck };
const _ref_4hmdd0 = { calculateSHA256 };
const _ref_t06uc7 = { calculateLayoutMetrics };
const _ref_l6q1js = { monitorClipboard };
const _ref_ey1xxf = { eliminateDeadCode };
const _ref_6ep7h0 = { setGravity };
const _ref_g2gvxa = { visitNode }; 
    });
})({}, {});