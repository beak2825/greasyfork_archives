// ==UserScript==
// @name AcFun视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AcFun/index.js
// @version 2026.01.21.2
// @description 下载AcFun视频，支持4K/1080P/720P多画质。
// @icon https://cdn.aixifan.com/ico/favicon.ico
// @match *://www.acfun.cn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect acfun.cn
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
// @downloadURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const checkRootAccess = () => false;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const preventCSRF = () => "csrf_token";

const scheduleTask = (task) => ({ id: 1, task });

const translateMatrix = (mat, vec) => mat;

const auditAccessLogs = () => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const blockMaliciousTraffic = (ip) => true;

const encodeABI = (method, params) => "0x...";

const estimateNonce = (addr) => 42;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const enableBlend = (func) => true;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const enableDHT = () => true;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const adjustPlaybackSpeed = (rate) => rate;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const negotiateSession = (sock) => ({ id: "sess_1" });

const backpropagateGradient = (loss) => true;

const createProcess = (img) => ({ pid: 100 });

const translateText = (text, lang) => text;

const debugAST = (ast) => "";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const setFilePermissions = (perm) => `chmod ${perm}`;

const mangleNames = (ast) => ast;

const shutdownComputer = () => console.log("Shutting down...");

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const renderCanvasLayer = (ctx) => true;

const checkTypes = (ast) => [];

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const validateIPWhitelist = (ip) => true;

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const defineSymbol = (table, name, info) => true;

const checkIntegrityConstraint = (table) => true;

const jitCompile = (bc) => (() => {});

const obfuscateCode = (code) => code;

const beginTransaction = () => "TX-" + Date.now();

const reportError = (msg, line) => console.error(msg);

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const lookupSymbol = (table, name) => ({});

const registerSystemTray = () => ({ icon: "tray.ico" });

const renameFile = (oldName, newName) => newName;

const parseLogTopics = (topics) => ["Transfer"];

const retransmitPacket = (seq) => true;

const extractArchive = (archive) => ["file1", "file2"];

const createTCPSocket = () => ({ fd: 1 });

const scheduleProcess = (pid) => true;

const analyzeBitrate = () => "5000kbps";

const getNetworkStats = () => ({ up: 100, down: 2000 });

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const instrumentCode = (code) => code;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const listenSocket = (sock, backlog) => true;

const writeFile = (fd, data) => true;

const logErrorToFile = (err) => console.error(err);

const resolveDNS = (domain) => "127.0.0.1";

const dhcpDiscover = () => true;

const encryptStream = (stream, key) => stream;

const pingHost = (host) => 10;

const findLoops = (cfg) => [];

const analyzeHeader = (packet) => ({});

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const decompressPacket = (data) => data;

const createThread = (func) => ({ tid: 1 });

const upInterface = (iface) => true;

const closeFile = (fd) => true;

const rateLimitCheck = (ip) => true;

const addGeneric6DofConstraint = (world, c) => true;

const removeConstraint = (world, c) => true;

const autoResumeTask = (id) => ({ id, status: "resumed" });

const closeSocket = (sock) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const disableDepthTest = () => true;

const bufferData = (gl, target, data, usage) => true;

const rotateLogFiles = () => true;

const writePipe = (fd, data) => data.length;

const cleanOldLogs = (days) => days;

const spoofReferer = () => "https://google.com";

const establishHandshake = (sock) => true;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const verifyAppSignature = () => true;

const getUniformLocation = (program, name) => 1;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });


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

const updateParticles = (sys, dt) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const addWheel = (vehicle, info) => true;

const linkModules = (modules) => ({});

const detectAudioCodec = () => "aac";

const disablePEX = () => false;

const encryptLocalStorage = (key, val) => true;

const decompressGzip = (data) => data;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const exitScope = (table) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const setMass = (body, m) => true;

const restoreDatabase = (path) => true;

const detectVideoCodec = () => "h264";

const verifyIR = (ir) => true;

const updateRoutingTable = (entry) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const emitParticles = (sys, count) => true;

const encapsulateFrame = (packet) => packet;

const processAudioBuffer = (buffer) => buffer;

const setVelocity = (body, v) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const convertFormat = (src, dest) => dest;

const setBrake = (vehicle, force, wheelIdx) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const mkdir = (path) => true;

const generateMipmaps = (target) => true;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const prefetchAssets = (urls) => urls.length;

const allowSleepMode = () => true;

const addPoint2PointConstraint = (world, c) => true;

const calculateGasFee = (limit) => limit * 20;

const resetVehicle = (vehicle) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const seekFile = (fd, offset) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const rotateMatrix = (mat, angle, axis) => mat;

const resampleAudio = (buffer, rate) => buffer;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const commitTransaction = (tx) => true;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const getProgramInfoLog = (program) => "";

const chokePeer = (peer) => ({ ...peer, choked: true });

const deleteBuffer = (buffer) => true;

const setViewport = (x, y, w, h) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const protectMemory = (ptr, size, flags) => true;

const calculateComplexity = (ast) => 1;

const clusterKMeans = (data, k) => Array(k).fill([]);

const unmuteStream = () => false;

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

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const setInertia = (body, i) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const wakeUp = (body) => true;

const createShader = (gl, type) => ({ id: Math.random(), type });

const replicateData = (node) => ({ target: node, synced: true });

const uniform3f = (loc, x, y, z) => true;

const attachRenderBuffer = (fb, rb) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const traverseAST = (node, visitor) => true;

const loadDriver = (path) => true;

const createSoftBody = (info) => ({ nodes: [] });

const repairCorruptFile = (path) => ({ path, repaired: true });

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const killParticles = (sys) => true;

const uniform1i = (loc, val) => true;


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

const injectCSPHeader = () => "default-src 'self'";

const restartApplication = () => console.log("Restarting...");

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const closePipe = (fd) => true;

const connectNodes = (src, dest) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const compileVertexShader = (source) => ({ compiled: true });

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const prettifyCode = (code) => code;

const chownFile = (path, uid, gid) => true;

const drawArrays = (gl, mode, first, count) => true;

const traceroute = (host) => ["192.168.1.1"];

const semaphoreSignal = (sem) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const foldConstants = (ast) => ast;

const normalizeVolume = (buffer) => buffer;

const sendPacket = (sock, data) => data.length;

const getBlockHeight = () => 15000000;

const remuxContainer = (container) => ({ container, status: "done" });

const decodeAudioData = (buffer) => Promise.resolve({});

const splitFile = (path, parts) => Array(parts).fill(path);

const getEnv = (key) => "";

const dhcpRequest = (ip) => true;

const deriveAddress = (path) => "0x123...";

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const createChannelMerger = (ctx, channels) => ({});

const createGainNode = (ctx) => ({ gain: { value: 1 } });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const normalizeFeatures = (data) => data.map(x => x / 255);

const activeTexture = (unit) => true;

const statFile = (path) => ({ size: 0 });

const verifyProofOfWork = (nonce) => true;

const enableInterrupts = () => true;

// Anti-shake references
const _ref_bsm9xg = { verifyFileSignature };
const _ref_ts8ajo = { checkRootAccess };
const _ref_ruyewj = { requestAnimationFrameLoop };
const _ref_blwuj3 = { preventCSRF };
const _ref_cmi3bi = { scheduleTask };
const _ref_thkaw0 = { translateMatrix };
const _ref_1e7dab = { auditAccessLogs };
const _ref_cavs33 = { unchokePeer };
const _ref_uske4j = { blockMaliciousTraffic };
const _ref_6omonu = { encodeABI };
const _ref_3daoh9 = { estimateNonce };
const _ref_2ndj8w = { getMemoryUsage };
const _ref_moi61b = { archiveFiles };
const _ref_2zm1mp = { simulateNetworkDelay };
const _ref_enpwr6 = { optimizeMemoryUsage };
const _ref_p3bqz9 = { enableBlend };
const _ref_3g0007 = { connectToTracker };
const _ref_ppdrha = { connectionPooling };
const _ref_25uhpu = { enableDHT };
const _ref_c3lk44 = { monitorNetworkInterface };
const _ref_7krpst = { adjustPlaybackSpeed };
const _ref_zzulav = { parseMagnetLink };
const _ref_2301s9 = { createDirectoryRecursive };
const _ref_zww2gs = { negotiateSession };
const _ref_w005bx = { backpropagateGradient };
const _ref_pyq7ui = { createProcess };
const _ref_hv2rty = { translateText };
const _ref_6uftf4 = { debugAST };
const _ref_xw0la5 = { computeNormal };
const _ref_pq0whm = { calculatePieceHash };
const _ref_94rldf = { setFilePermissions };
const _ref_bzlztq = { mangleNames };
const _ref_vmmrie = { shutdownComputer };
const _ref_5pwdc4 = { retryFailedSegment };
const _ref_kihrch = { renderCanvasLayer };
const _ref_27srdx = { checkTypes };
const _ref_3q6y99 = { performTLSHandshake };
const _ref_a6589z = { validateIPWhitelist };
const _ref_r5zngz = { rotateUserAgent };
const _ref_2krzjb = { defineSymbol };
const _ref_eew7fa = { checkIntegrityConstraint };
const _ref_spgbrs = { jitCompile };
const _ref_118v6g = { obfuscateCode };
const _ref_887b5o = { beginTransaction };
const _ref_muwgze = { reportError };
const _ref_vthah5 = { sanitizeSQLInput };
const _ref_fbhejx = { lookupSymbol };
const _ref_3u8re3 = { registerSystemTray };
const _ref_ra6i81 = { renameFile };
const _ref_wlxfew = { parseLogTopics };
const _ref_8ueffp = { retransmitPacket };
const _ref_8zaexw = { extractArchive };
const _ref_8h6dc0 = { createTCPSocket };
const _ref_zem5qh = { scheduleProcess };
const _ref_tgbbb5 = { analyzeBitrate };
const _ref_5s66hr = { getNetworkStats };
const _ref_jxs2w3 = { encryptPayload };
const _ref_bmqpvo = { instrumentCode };
const _ref_ao4llu = { decryptHLSStream };
const _ref_c07b0t = { saveCheckpoint };
const _ref_558cej = { listenSocket };
const _ref_z3kii3 = { writeFile };
const _ref_gchz5p = { logErrorToFile };
const _ref_dg3k6o = { resolveDNS };
const _ref_jey0sl = { dhcpDiscover };
const _ref_rze3y5 = { encryptStream };
const _ref_j5nxgf = { pingHost };
const _ref_z2f399 = { findLoops };
const _ref_jtyalo = { analyzeHeader };
const _ref_bushh7 = { convertRGBtoHSL };
const _ref_x276dy = { decompressPacket };
const _ref_2xken6 = { createThread };
const _ref_1g7nig = { upInterface };
const _ref_12v6mq = { closeFile };
const _ref_0rbaxk = { rateLimitCheck };
const _ref_hqfuq2 = { addGeneric6DofConstraint };
const _ref_k5gs0w = { removeConstraint };
const _ref_bw3ihp = { autoResumeTask };
const _ref_b21ejh = { closeSocket };
const _ref_c9f1aj = { renderShadowMap };
const _ref_5jybbq = { validateSSLCert };
const _ref_5zzplc = { disableDepthTest };
const _ref_il1mvc = { bufferData };
const _ref_8a1aka = { rotateLogFiles };
const _ref_eu3io9 = { writePipe };
const _ref_034l1b = { cleanOldLogs };
const _ref_kfnibh = { spoofReferer };
const _ref_zk296t = { establishHandshake };
const _ref_92wxan = { syncDatabase };
const _ref_7ebxes = { verifyAppSignature };
const _ref_jud5sw = { getUniformLocation };
const _ref_bp3iba = { scrapeTracker };
const _ref_x16npf = { TelemetryClient };
const _ref_di1efd = { updateParticles };
const _ref_c0ks32 = { isFeatureEnabled };
const _ref_usxoy6 = { addWheel };
const _ref_ojc5bl = { linkModules };
const _ref_py1isj = { detectAudioCodec };
const _ref_846ycd = { disablePEX };
const _ref_wp7xux = { encryptLocalStorage };
const _ref_vo15gd = { decompressGzip };
const _ref_vsxiyn = { uploadCrashReport };
const _ref_tf8jvq = { exitScope };
const _ref_n0aeg2 = { migrateSchema };
const _ref_pbtxsz = { setMass };
const _ref_c8hwjd = { restoreDatabase };
const _ref_t0zv4w = { detectVideoCodec };
const _ref_z9lo39 = { verifyIR };
const _ref_jvyjvt = { updateRoutingTable };
const _ref_55kqq6 = { createScriptProcessor };
const _ref_gqwyo8 = { getSystemUptime };
const _ref_3h6o8u = { debounceAction };
const _ref_5rkmgx = { emitParticles };
const _ref_oeqgsl = { encapsulateFrame };
const _ref_vl4v9e = { processAudioBuffer };
const _ref_wpt05t = { setVelocity };
const _ref_gkisuo = { parseFunction };
const _ref_726ao6 = { convertFormat };
const _ref_p5ni7k = { setBrake };
const _ref_ehjzcp = { calculateRestitution };
const _ref_gay73a = { mkdir };
const _ref_oy8b3k = { generateMipmaps };
const _ref_jmfdgm = { lazyLoadComponent };
const _ref_ud6u4r = { prefetchAssets };
const _ref_mzr6cp = { allowSleepMode };
const _ref_3v5rp8 = { addPoint2PointConstraint };
const _ref_qoiat1 = { calculateGasFee };
const _ref_y51ila = { resetVehicle };
const _ref_ojmc6t = { updateBitfield };
const _ref_m7g7qa = { seekFile };
const _ref_cyzv3w = { calculateEntropy };
const _ref_o50dxv = { rotateMatrix };
const _ref_kq1s77 = { resampleAudio };
const _ref_wyiqj9 = { cancelAnimationFrameLoop };
const _ref_qjggru = { commitTransaction };
const _ref_rgwgf7 = { initWebGLContext };
const _ref_uqj4dk = { getProgramInfoLog };
const _ref_k3y0j0 = { chokePeer };
const _ref_ir1pp6 = { deleteBuffer };
const _ref_m7caql = { setViewport };
const _ref_sb2v6j = { flushSocketBuffer };
const _ref_wczgfi = { protectMemory };
const _ref_cnaq0i = { calculateComplexity };
const _ref_1ghm2e = { clusterKMeans };
const _ref_yta2vs = { unmuteStream };
const _ref_mbr9co = { download };
const _ref_xtctd3 = { resolveDependencyGraph };
const _ref_6qs3qa = { keepAlivePing };
const _ref_5jv9y5 = { setInertia };
const _ref_xvamvf = { predictTensor };
const _ref_ag4ai9 = { wakeUp };
const _ref_mgfdxh = { createShader };
const _ref_bvyjv1 = { replicateData };
const _ref_9i2jpy = { uniform3f };
const _ref_ct4h3i = { attachRenderBuffer };
const _ref_fuvg56 = { requestPiece };
const _ref_8skd5e = { traverseAST };
const _ref_wkcolc = { loadDriver };
const _ref_avhlrl = { createSoftBody };
const _ref_4aw2jr = { repairCorruptFile };
const _ref_fqmpck = { tokenizeSource };
const _ref_oyat7e = { killParticles };
const _ref_o8l66c = { uniform1i };
const _ref_ox9ghl = { ApiDataFormatter };
const _ref_kqd3w4 = { injectCSPHeader };
const _ref_kli6ez = { restartApplication };
const _ref_jhm09v = { readPixels };
const _ref_ipl4bo = { closePipe };
const _ref_b8i2q0 = { connectNodes };
const _ref_22250a = { normalizeVector };
const _ref_vmfjej = { compileVertexShader };
const _ref_5egp0c = { setSteeringValue };
const _ref_eyisb2 = { prettifyCode };
const _ref_ub9auf = { chownFile };
const _ref_d6skle = { drawArrays };
const _ref_arlrxf = { traceroute };
const _ref_etbc97 = { semaphoreSignal };
const _ref_dfgks7 = { extractThumbnail };
const _ref_e6gg7p = { foldConstants };
const _ref_tk3bzv = { normalizeVolume };
const _ref_jujd3u = { sendPacket };
const _ref_0jfh2n = { getBlockHeight };
const _ref_qy3k25 = { remuxContainer };
const _ref_navmfk = { decodeAudioData };
const _ref_n7nv27 = { splitFile };
const _ref_bpjonh = { getEnv };
const _ref_ghewig = { dhcpRequest };
const _ref_ttuenp = { deriveAddress };
const _ref_mvmzql = { throttleRequests };
const _ref_us8r32 = { refreshAuthToken };
const _ref_t2h0eg = { createChannelMerger };
const _ref_cm7d6n = { createGainNode };
const _ref_yslzg9 = { getFileAttributes };
const _ref_xgtwl5 = { checkDiskSpace };
const _ref_i6efa0 = { shardingTable };
const _ref_6exx84 = { normalizeFeatures };
const _ref_mieut9 = { activeTexture };
const _ref_rex8vj = { statFile };
const _ref_whb9bj = { verifyProofOfWork };
const _ref_ofmjok = { enableInterrupts }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `AcFun` };
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
                const urlParams = { config, url: window.location.href, name_en: `AcFun` };

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

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const cleanOldLogs = (days) => days;

const shutdownComputer = () => console.log("Shutting down...");

const interestPeer = (peer) => ({ ...peer, interested: true });

const unmuteStream = () => false;

const chokePeer = (peer) => ({ ...peer, choked: true });

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const createMediaElementSource = (ctx, el) => ({});

const chmodFile = (path, mode) => true;

const playSoundAlert = (sound) => console.log(`Playing ${sound}`);

const closeSocket = (sock) => true;

const calculateMetric = (route) => 1;

const applyFog = (color, dist) => color;

const enterScope = (table) => true;

const writePipe = (fd, data) => data.length;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const rebootSystem = () => true;

const bufferMediaStream = (size) => ({ buffer: size });

const prettifyCode = (code) => code;

const reportWarning = (msg, line) => console.warn(msg);

const drawArrays = (gl, mode, first, count) => true;

const unloadDriver = (name) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const readdir = (path) => [];

const parsePayload = (packet) => ({});

const linkModules = (modules) => ({});

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const switchVLAN = (id) => true;

const keepAlivePing = () => ({ lastPing: Date.now(), latency: Math.random() * 50 });

const dhcpAck = () => true;

const openFile = (path, flags) => 5;

const broadcastMessage = (msg) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const animateTransition = (props) => new Promise(r => setTimeout(r, 300));

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const signTransaction = (tx, key) => "signed_tx_hash";

const lookupSymbol = (table, name) => ({});

const registerGestureHandler = (gesture) => true;

const computeDominators = (cfg) => ({});

const shardingTable = (table) => ["shard_0", "shard_1"];

const convertFormat = (src, dest) => dest;

const dhcpDiscover = () => true;

const resolveImports = (ast) => [];

const sendPacket = (sock, data) => data.length;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const migrateSchema = (version) => ({ current: version, status: "ok" });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const decryptStream = (stream, key) => stream;

const rollbackTransaction = (tx) => true;

const setVelocity = (body, v) => true;

const parseLogTopics = (topics) => ["Transfer"];

const resetVehicle = (vehicle) => true;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

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

const mapMemory = (fd, size) => 0x2000;

const createProcess = (img) => ({ pid: 100 });

const updateRoutingTable = (entry) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const addHingeConstraint = (world, c) => true;

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const compressPacket = (data) => data;

const rotateMatrix = (mat, angle, axis) => mat;

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const normalizeVolume = (buffer) => buffer;

const defineSymbol = (table, name, info) => true;

const transcodeStream = (format) => ({ format, status: "processing" });

const rmdir = (path) => true;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const encryptPeerTraffic = (data) => btoa(data);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const resolveSymbols = (ast) => ({});

const renderShadowMap = (scene, light) => ({ texture: {} });

const minifyCode = (code) => code;

const scheduleTask = (task) => ({ id: 1, task });

const setRatio = (node, val) => node.ratio.value = val;

const createChannelMerger = (ctx, channels) => ({});

const performOCR = (img) => "Detected Text";

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const getFloatTimeDomainData = (analyser, array) => true;

const calculateComplexity = (ast) => 1;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const resampleAudio = (buffer, rate) => buffer;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const renderParticles = (sys) => true;

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const decodeABI = (data) => ({ method: "transfer", params: [] });

const setThreshold = (node, val) => node.threshold.value = val;

const setFilterType = (filter, type) => filter.type = type;

const rotateLogFiles = () => true;

const createChannelSplitter = (ctx, channels) => ({});

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const joinThread = (tid) => true;

const addConeTwistConstraint = (world, c) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const decapsulateFrame = (frame) => frame;

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const commitTransaction = (tx) => true;

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const getFileAttributes = (path) => ({ readonly: false, hidden: false });

const addGeneric6DofConstraint = (world, c) => true;

const claimRewards = (pool) => "0.5 ETH";

const stepSimulation = (world, dt) => true;

const createPeriodicWave = (ctx, real, imag) => ({});

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const enableInterrupts = () => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const downInterface = (iface) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const compileVertexShader = (source) => ({ compiled: true });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const setQValue = (filter, q) => filter.Q = q;

const getMACAddress = (iface) => "00:00:00:00:00:00";

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const remuxContainer = (container) => ({ container, status: "done" });

const preventSleepMode = () => true;

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const scheduleBandwidth = (hour) => hour > 0 && hour < 8 ? "unlimited" : "restricted";

const emitParticles = (sys, count) => true;

const reportError = (msg, line) => console.error(msg);

const allocateMemory = (size) => 0x1000;


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

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const cullFace = (mode) => true;

const checkTypes = (ast) => [];

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const startOscillator = (osc, time) => true;

const loadImpulseResponse = (url) => Promise.resolve({});

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const getCpuLoad = () => Math.random() * 100;

const removeConstraint = (world, c) => true;

const eliminateDeadCode = (ast) => ast;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const wakeUp = (body) => true;

const jitCompile = (bc) => (() => {});

const compileToBytecode = (ast) => new Uint8Array();

const syncAudioVideo = (offset) => ({ offset, synced: true });

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const foldConstants = (ast) => ast;

const validateFormInput = (input) => input.length > 0;

const backupDatabase = (path) => ({ path, size: 5000 });

const configureInterface = (iface, config) => true;

const processAudioBuffer = (buffer) => buffer;

const killParticles = (sys) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const setRelease = (node, val) => node.release.value = val;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const chownFile = (path, uid, gid) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const setDopplerFactor = (val) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const arpRequest = (ip) => "00:00:00:00:00:00";

const createMediaStreamSource = (ctx, stream) => ({});

const decompressGzip = (data) => data;


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

const setOrientation = (panner, x, y, z) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createTCPSocket = () => ({ fd: 1 });

const obfuscateCode = (code) => code;

const updateWheelTransform = (wheel) => true;

const createConvolver = (ctx) => ({ buffer: null });

const createIndexBuffer = (data) => ({ id: Math.random() });

const analyzeBitrate = () => "5000kbps";

const forkProcess = () => 101;

const setViewport = (x, y, w, h) => true;

const createThread = (func) => ({ tid: 1 });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const checkIntegrityConstraint = (table) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const readFile = (fd, len) => "";

const getEnv = (key) => "";


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

const setGainValue = (node, val) => node.gain.value = val;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const getShaderInfoLog = (shader) => "";

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const pingHost = (host) => 10;

const contextSwitch = (oldPid, newPid) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const encryptLocalStorage = (key, val) => true;

const createSoftBody = (info) => ({ nodes: [] });

const encryptStream = (stream, key) => stream;

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const bufferData = (gl, target, data, usage) => true;

const createIndex = (table, col) => `IDX_${table}_${col}`;

const adjustPlaybackSpeed = (rate) => rate;

const unrollLoops = (ast) => ast;

const clusterKMeans = (data, k) => Array(k).fill([]);

const traceroute = (host) => ["192.168.1.1"];

const captureFrame = () => "frame_data_buffer";

const getSystemUptime = () => process.uptime ? process.uptime() : 1000;

const optimizeTailCalls = (ast) => ast;

const adjustWindowSize = (sock, size) => true;

// Anti-shake references
const _ref_q1tzib = { generateFakeClass };
const _ref_mksgio = { parseSubtitles };
const _ref_8ffokf = { cleanOldLogs };
const _ref_uixk6x = { shutdownComputer };
const _ref_a27ozj = { interestPeer };
const _ref_3oc3jj = { unmuteStream };
const _ref_osx771 = { chokePeer };
const _ref_wfvls3 = { connectToTracker };
const _ref_16502i = { createMediaElementSource };
const _ref_df7i9a = { chmodFile };
const _ref_hqxp6l = { playSoundAlert };
const _ref_uuzgr5 = { closeSocket };
const _ref_yc7gnv = { calculateMetric };
const _ref_025461 = { applyFog };
const _ref_f34wfw = { enterScope };
const _ref_pluduw = { writePipe };
const _ref_5x6sf0 = { normalizeAudio };
const _ref_ef04fr = { generateUUIDv5 };
const _ref_3x83wg = { rebootSystem };
const _ref_zzhxd9 = { bufferMediaStream };
const _ref_9cxamf = { prettifyCode };
const _ref_54lo5o = { reportWarning };
const _ref_vipdc2 = { drawArrays };
const _ref_o7k0nr = { unloadDriver };
const _ref_lkpybk = { updateBitfield };
const _ref_2bypyn = { readdir };
const _ref_c5gsty = { parsePayload };
const _ref_80jdv2 = { linkModules };
const _ref_ba6ndp = { generateWalletKeys };
const _ref_kryn9a = { switchVLAN };
const _ref_gpxm91 = { keepAlivePing };
const _ref_23p9n1 = { dhcpAck };
const _ref_gi0ria = { openFile };
const _ref_6elaq9 = { broadcastMessage };
const _ref_z9csza = { calculateLayoutMetrics };
const _ref_usvlor = { animateTransition };
const _ref_12pkm3 = { handshakePeer };
const _ref_hx37h0 = { signTransaction };
const _ref_bcu0u2 = { lookupSymbol };
const _ref_u34vg1 = { registerGestureHandler };
const _ref_02yemh = { computeDominators };
const _ref_j28fr3 = { shardingTable };
const _ref_g8bv4e = { convertFormat };
const _ref_tqlore = { dhcpDiscover };
const _ref_sollny = { resolveImports };
const _ref_pk1czb = { sendPacket };
const _ref_26d3u2 = { compactDatabase };
const _ref_dy2kgm = { migrateSchema };
const _ref_1t1bjh = { extractThumbnail };
const _ref_h4f826 = { decryptStream };
const _ref_gmjtiq = { rollbackTransaction };
const _ref_u26nmp = { setVelocity };
const _ref_vpiiu3 = { parseLogTopics };
const _ref_ka4ekh = { resetVehicle };
const _ref_i6vw93 = { createAnalyser };
const _ref_f1ojad = { download };
const _ref_2iv40i = { mapMemory };
const _ref_4fmf7c = { createProcess };
const _ref_1580nt = { updateRoutingTable };
const _ref_qm6mql = { calculateSHA256 };
const _ref_hf4z2e = { addHingeConstraint };
const _ref_gf1ywf = { parseTorrentFile };
const _ref_7r6qxu = { compressPacket };
const _ref_gzkztb = { rotateMatrix };
const _ref_e2h2k8 = { setSteeringValue };
const _ref_j4b01c = { normalizeVolume };
const _ref_qxgjk4 = { defineSymbol };
const _ref_gyfpcb = { transcodeStream };
const _ref_fcrd49 = { rmdir };
const _ref_qrnaq3 = { calculateLighting };
const _ref_glzptx = { encryptPeerTraffic };
const _ref_qy0hsg = { formatLogMessage };
const _ref_l8x2ks = { analyzeQueryPlan };
const _ref_6u0e0p = { traceStack };
const _ref_v204ww = { resolveSymbols };
const _ref_7uwkwg = { renderShadowMap };
const _ref_ll4v1s = { minifyCode };
const _ref_zcfclw = { scheduleTask };
const _ref_1u7y30 = { setRatio };
const _ref_dzjjk5 = { createChannelMerger };
const _ref_xrx6gy = { performOCR };
const _ref_xk6kqe = { simulateNetworkDelay };
const _ref_5j68s6 = { getFloatTimeDomainData };
const _ref_l0qjez = { calculateComplexity };
const _ref_ok3kqh = { applyPerspective };
const _ref_7sgek5 = { resampleAudio };
const _ref_p7zj2a = { uninterestPeer };
const _ref_ebxnxl = { renderParticles };
const _ref_z9bvne = { debounceAction };
const _ref_6051oh = { optimizeMemoryUsage };
const _ref_67wqhp = { decodeABI };
const _ref_efy6i0 = { setThreshold };
const _ref_a8a04g = { setFilterType };
const _ref_3apr3r = { rotateLogFiles };
const _ref_eaenct = { createChannelSplitter };
const _ref_gm3qva = { validateTokenStructure };
const _ref_ih86p0 = { joinThread };
const _ref_bn0jf0 = { addConeTwistConstraint };
const _ref_id5l3e = { isFeatureEnabled };
const _ref_3mao0k = { decapsulateFrame };
const _ref_6ko3os = { verifyMagnetLink };
const _ref_4gywix = { commitTransaction };
const _ref_5o72hz = { createCapsuleShape };
const _ref_ysfr2o = { getFileAttributes };
const _ref_vmx0fq = { addGeneric6DofConstraint };
const _ref_dlcfze = { claimRewards };
const _ref_defc5e = { stepSimulation };
const _ref_2zhick = { createPeriodicWave };
const _ref_r3q15f = { computeNormal };
const _ref_q8z0do = { enableInterrupts };
const _ref_sbmk5o = { normalizeVector };
const _ref_f9vedz = { downInterface };
const _ref_iskmla = { calculateRestitution };
const _ref_4xrtev = { compileVertexShader };
const _ref_vdo762 = { createOscillator };
const _ref_8ibzbq = { parseConfigFile };
const _ref_idgjy7 = { setQValue };
const _ref_5jztnp = { getMACAddress };
const _ref_cxh271 = { encryptPayload };
const _ref_asxrcx = { uniformMatrix4fv };
const _ref_p1ac5z = { remuxContainer };
const _ref_dd3zza = { preventSleepMode };
const _ref_5ex02o = { getMemoryUsage };
const _ref_8bnq2l = { scheduleBandwidth };
const _ref_orafcx = { emitParticles };
const _ref_bucf6a = { reportError };
const _ref_ctlj2w = { allocateMemory };
const _ref_hujxq7 = { TelemetryClient };
const _ref_en249z = { deleteTempFiles };
const _ref_u3b927 = { cullFace };
const _ref_jqqzym = { checkTypes };
const _ref_7kh5kk = { moveFileToComplete };
const _ref_3115pk = { startOscillator };
const _ref_y747bn = { loadImpulseResponse };
const _ref_bnudu7 = { formatCurrency };
const _ref_jbdrah = { getCpuLoad };
const _ref_wau7sx = { removeConstraint };
const _ref_uyzrk0 = { eliminateDeadCode };
const _ref_lfmf89 = { unchokePeer };
const _ref_ryzrni = { wakeUp };
const _ref_3lfs24 = { jitCompile };
const _ref_etm2c7 = { compileToBytecode };
const _ref_blumt7 = { syncAudioVideo };
const _ref_zo54f7 = { parseMagnetLink };
const _ref_85ky96 = { foldConstants };
const _ref_0z6b62 = { validateFormInput };
const _ref_jkklmt = { backupDatabase };
const _ref_yc2iw6 = { configureInterface };
const _ref_4xqzoz = { processAudioBuffer };
const _ref_rgh5as = { killParticles };
const _ref_06uzsy = { parseFunction };
const _ref_4awmlp = { saveCheckpoint };
const _ref_xdz8yf = { setRelease };
const _ref_zdewzq = { transformAesKey };
const _ref_vd65wd = { chownFile };
const _ref_5ydpkt = { connectionPooling };
const _ref_1iwxvc = { setDopplerFactor };
const _ref_9u1s0r = { analyzeUserBehavior };
const _ref_sh5zpo = { arpRequest };
const _ref_9bczd7 = { createMediaStreamSource };
const _ref_7ahifh = { decompressGzip };
const _ref_1t8c8y = { ResourceMonitor };
const _ref_mkkyhy = { setOrientation };
const _ref_8rxkx6 = { createPanner };
const _ref_0lvbw0 = { createTCPSocket };
const _ref_j6nha9 = { obfuscateCode };
const _ref_d5mzp0 = { updateWheelTransform };
const _ref_qj9075 = { createConvolver };
const _ref_adp6s2 = { createIndexBuffer };
const _ref_8f6giz = { analyzeBitrate };
const _ref_ppvzju = { forkProcess };
const _ref_5mr1w9 = { setViewport };
const _ref_dcuwmu = { createThread };
const _ref_vtnir0 = { sanitizeInput };
const _ref_8cmwr6 = { checkIntegrityConstraint };
const _ref_1a4x79 = { compressDataStream };
const _ref_9n3fnh = { readFile };
const _ref_4ql6fr = { getEnv };
const _ref_viu9j6 = { CacheManager };
const _ref_u51yo9 = { setGainValue };
const _ref_fssf9q = { createBoxShape };
const _ref_bosla0 = { getShaderInfoLog };
const _ref_yenac0 = { applyEngineForce };
const _ref_y987pk = { pingHost };
const _ref_1h451s = { contextSwitch };
const _ref_xj0vcy = { getAppConfig };
const _ref_qt7fjg = { encryptLocalStorage };
const _ref_saa0ke = { createSoftBody };
const _ref_ojrwlx = { encryptStream };
const _ref_l8rh2b = { updateProgressBar };
const _ref_b0zfdk = { bufferData };
const _ref_17u48o = { createIndex };
const _ref_22kugy = { adjustPlaybackSpeed };
const _ref_jyu6ge = { unrollLoops };
const _ref_r80cyk = { clusterKMeans };
const _ref_ewvdzo = { traceroute };
const _ref_mxna2s = { captureFrame };
const _ref_b048is = { getSystemUptime };
const _ref_6m1cp4 = { optimizeTailCalls };
const _ref_wgqsaj = { adjustWindowSize }; 
    });
})({}, {});