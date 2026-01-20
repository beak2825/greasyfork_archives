// ==UserScript==
// @name BanBye视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/BanBye/index.js
// @version 2026.01.10
// @description 一键下载BanBye视频，支持4K/1080P/720P多画质。
// @icon https://banbye.com/_nuxt/icons/icon_64x64.5406dd.png
// @match *://banbye.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect banbye.com
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
// @downloadURL https://update.greasyfork.org/scripts/562234/BanBye%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562234/BanBye%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const cleanOldLogs = (days) => days;

const resolveDNS = (domain) => "127.0.0.1";

const cullFace = (mode) => true;

const createConvolver = (ctx) => ({ buffer: null });

const setPosition = (panner, x, y, z) => true;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const createIndexBuffer = (data) => ({ id: Math.random() });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const deleteProgram = (program) => true;

const createMeshShape = (vertices) => ({ type: 'mesh' });

const activeTexture = (unit) => true;

const generateSourceMap = (ast) => "{}";

const exitScope = (table) => true;

const setAttack = (node, val) => node.attack.value = val;

const defineSymbol = (table, name, info) => true;

const mangleNames = (ast) => ast;

const enterScope = (table) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const minifyCode = (code) => code;

const createFrameBuffer = () => ({ id: Math.random() });

const enableInterrupts = () => true;

const prettifyCode = (code) => code;

const sleep = (body) => true;

const getProgramInfoLog = (program) => "";

const calculateRestitution = (mat1, mat2) => 0.3;

const applyImpulse = (body, impulse, point) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const createSymbolTable = () => ({ scopes: [] });

const broadcastTransaction = (tx) => "tx_hash_123";

const monitorClipboard = () => "";

const synthesizeSpeech = (text) => "audio_buffer";

const getCpuLoad = () => Math.random() * 100;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const joinGroup = (group) => true;

const flushSocketBuffer = (sock) => sock.buffer = [];

const createTCPSocket = () => ({ fd: 1 });

const decryptStream = (stream, key) => stream;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const reassemblePacket = (fragments) => fragments[0];

const swapTokens = (pair, amount) => true;

const adjustWindowSize = (sock, size) => true;

const compileToBytecode = (ast) => new Uint8Array();

const setInertia = (body, i) => true;

const bindAddress = (sock, addr, port) => true;

const resumeContext = (ctx) => Promise.resolve();

const negotiateProtocol = () => "HTTP/2.0";

const wakeUp = (body) => true;

const logErrorToFile = (err) => console.error(err);

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const calculateMetric = (route) => 1;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const controlCongestion = (sock) => true;

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

const setFilterType = (filter, type) => filter.type = type;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const createMediaElementSource = (ctx, el) => ({});

const installUpdate = () => false;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const normalizeFeatures = (data) => data.map(x => x / 255);

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const handleTimeout = (sock) => true;

const hoistVariables = (ast) => ast;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const resolveCollision = (manifold) => true;

const setQValue = (filter, q) => filter.Q = q;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const checkPortAvailability = (port) => Math.random() > 0.2;

const analyzeControlFlow = (ast) => ({ graph: {} });

const commitTransaction = (tx) => true;

const renderCanvasLayer = (ctx) => true;

const stopOscillator = (osc, time) => true;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const checkTypes = (ast) => [];

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

const verifyIR = (ir) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const uniform1i = (loc, val) => true;

const hydrateSSR = (html) => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const compileVertexShader = (source) => ({ compiled: true });

const translateText = (text, lang) => text;

const resolveImports = (ast) => [];

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const validateFormInput = (input) => input.length > 0;

const negotiateSession = (sock) => ({ id: "sess_1" });

const profilePerformance = (func) => 0;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const validateRecaptcha = (token) => true;

const restartApplication = () => console.log("Restarting...");

const signTransaction = (tx, key) => "signed_tx_hash";

const instrumentCode = (code) => code;

const rotateLogFiles = () => true;

const getExtension = (name) => ({});

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const computeDominators = (cfg) => ({});

const checkRootAccess = () => false;

const spoofReferer = () => "https://google.com";

const detectPacketLoss = (acks) => false;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const compressPacket = (data) => data;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createChannelSplitter = (ctx, channels) => ({});

const inferType = (node) => 'any';

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const findLoops = (cfg) => [];

const mutexUnlock = (mtx) => true;

const setRelease = (node, val) => node.release.value = val;

const createThread = (func) => ({ tid: 1 });

const filterTraffic = (rule) => true;

const multicastMessage = (group, msg) => true;

const lookupSymbol = (table, name) => ({});

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const execProcess = (path) => true;

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const analyzeHeader = (packet) => ({});

const recognizeSpeech = (audio) => "Transcribed Text";

const getMACAddress = (iface) => "00:00:00:00:00:00";

const disableRightClick = () => true;

const setVelocity = (body, v) => true;

const traceroute = (host) => ["192.168.1.1"];

const setViewport = (x, y, w, h) => true;

const retransmitPacket = (seq) => true;

const scheduleProcess = (pid) => true;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const parsePayload = (packet) => ({});

const checkIntegrityToken = (token) => true;

const addHingeConstraint = (world, c) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const detectFirewallStatus = () => {
        return { outbound: "allowed", inbound: "restricted", natType: "moderate" };
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const removeConstraint = (world, c) => true;

const cancelTask = (id) => ({ id, cancelled: true });

const cacheQueryResults = (key, data) => true;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const invalidateCache = (key) => true;

const semaphoreSignal = (sem) => true;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const disconnectNodes = (node) => true;

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const prefetchAssets = (urls) => urls.length;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
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

const allocateMemory = (size) => 0x1000;

const terminateSession = (id) => console.log(`Session ${id} terminated`);

const resampleAudio = (buffer, rate) => buffer;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const setBrake = (vehicle, force, wheelIdx) => true;

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const uniformMatrix4fv = (loc, transpose, val) => true;

const updateTransform = (body) => true;

const processAudioBuffer = (buffer) => buffer;

const linkModules = (modules) => ({});

const interceptRequest = (req) => ({ ...req, intercepted: true });

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

const killParticles = (sys) => true;

const createSoftBody = (info) => ({ nodes: [] });

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");


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

const deobfuscateString = (str) => atob(str);

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const bindSocket = (port) => ({ port, status: "bound" });

const replicateData = (node) => ({ target: node, synced: true });

const reportWarning = (msg, line) => console.warn(msg);

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };

const drawElements = (mode, count, type, offset) => true;

const addPoint2PointConstraint = (world, c) => true;

const validateSSLCert = (cert) => cert.includes("-----BEGIN CERTIFICATE-----");

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const setDistanceModel = (panner, model) => true;

const addWheel = (vehicle, info) => true;

const setDopplerFactor = (val) => true;

const setGravity = (world, g) => world.gravity = g;

const lazyLoadComponent = (name) => ({ name, loaded: false });

const setSocketTimeout = (ms) => ({ timeout: ms });

const dhcpDiscover = () => true;

const fingerprintBrowser = () => "fp_hash_123";

const debouncedResize = () => ({ width: 1920, height: 1080 });

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const decodeAudioData = (buffer) => Promise.resolve({});

const setMTU = (iface, mtu) => true;

// Anti-shake references
const _ref_ltkqa1 = { cleanOldLogs };
const _ref_5h1yrb = { resolveDNS };
const _ref_b8bo01 = { cullFace };
const _ref_xjt672 = { createConvolver };
const _ref_qxnv09 = { setPosition };
const _ref_f56nyi = { setFrequency };
const _ref_2pdjhq = { createIndexBuffer };
const _ref_7ay8me = { createOscillator };
const _ref_j531dw = { applyEngineForce };
const _ref_ln4bos = { deleteProgram };
const _ref_k2q9yj = { createMeshShape };
const _ref_mpt5cw = { activeTexture };
const _ref_7kep09 = { generateSourceMap };
const _ref_7i5z8g = { exitScope };
const _ref_nau7hf = { setAttack };
const _ref_2cpvja = { defineSymbol };
const _ref_oo835w = { mangleNames };
const _ref_lqtfhu = { enterScope };
const _ref_g9jicw = { calculateFriction };
const _ref_ctbu9y = { createDelay };
const _ref_ta06go = { minifyCode };
const _ref_p327h3 = { createFrameBuffer };
const _ref_ve1nkg = { enableInterrupts };
const _ref_9edh8y = { prettifyCode };
const _ref_0mwjzz = { sleep };
const _ref_zb181y = { getProgramInfoLog };
const _ref_8w4swc = { calculateRestitution };
const _ref_yq9464 = { applyImpulse };
const _ref_f9pvva = { createDynamicsCompressor };
const _ref_d4kcx1 = { createSymbolTable };
const _ref_38y7za = { broadcastTransaction };
const _ref_6sh7ge = { monitorClipboard };
const _ref_tpxpjo = { synthesizeSpeech };
const _ref_232lbj = { getCpuLoad };
const _ref_3ozx5u = { parseM3U8Playlist };
const _ref_w6g9j2 = { joinGroup };
const _ref_hm1zip = { flushSocketBuffer };
const _ref_n0lamd = { createTCPSocket };
const _ref_2hazqe = { decryptStream };
const _ref_2dtytm = { isFeatureEnabled };
const _ref_aswgxg = { reassemblePacket };
const _ref_2rypze = { swapTokens };
const _ref_f0wz44 = { adjustWindowSize };
const _ref_26wf82 = { compileToBytecode };
const _ref_tatxf2 = { setInertia };
const _ref_c5tn34 = { bindAddress };
const _ref_53cyck = { resumeContext };
const _ref_g2xona = { negotiateProtocol };
const _ref_wwl2hp = { wakeUp };
const _ref_zzv9op = { logErrorToFile };
const _ref_4aidnq = { calculateLayoutMetrics };
const _ref_ucghbh = { debounceAction };
const _ref_whd8c2 = { validateTokenStructure };
const _ref_9urp2i = { calculateMetric };
const _ref_afse31 = { limitBandwidth };
const _ref_xjdb81 = { controlCongestion };
const _ref_8026zm = { calculateEntropy };
const _ref_5xvemc = { rotateMatrix };
const _ref_k2y72t = { setFilterType };
const _ref_7yaasm = { getAppConfig };
const _ref_h5e4f7 = { renderVirtualDOM };
const _ref_r7tais = { createMediaElementSource };
const _ref_xrhhyt = { installUpdate };
const _ref_txuxil = { formatLogMessage };
const _ref_8m1478 = { generateWalletKeys };
const _ref_sfuat1 = { normalizeFeatures };
const _ref_kg27sv = { generateUUIDv5 };
const _ref_zlxj5y = { handleTimeout };
const _ref_dp224j = { hoistVariables };
const _ref_74q2zx = { executeSQLQuery };
const _ref_raqcln = { resolveCollision };
const _ref_e2fbde = { setQValue };
const _ref_lkh31l = { getVelocity };
const _ref_juj651 = { generateUserAgent };
const _ref_4cqnx5 = { checkPortAvailability };
const _ref_dtnw1c = { analyzeControlFlow };
const _ref_56s9hx = { commitTransaction };
const _ref_66mfwe = { renderCanvasLayer };
const _ref_b1gyug = { stopOscillator };
const _ref_iimbzx = { predictTensor };
const _ref_9auudq = { checkTypes };
const _ref_tv4iyi = { download };
const _ref_vxcoby = { verifyIR };
const _ref_kz2r8r = { vertexAttrib3f };
const _ref_wvg67f = { optimizeMemoryUsage };
const _ref_0ki8o3 = { uniform1i };
const _ref_117grq = { hydrateSSR };
const _ref_cu435i = { setDelayTime };
const _ref_5mbdfe = { queueDownloadTask };
const _ref_jivhlr = { compileVertexShader };
const _ref_60pook = { translateText };
const _ref_7ypn0j = { resolveImports };
const _ref_0ywdtv = { rotateUserAgent };
const _ref_sr3ftf = { connectToTracker };
const _ref_q2tree = { validateFormInput };
const _ref_h5665a = { negotiateSession };
const _ref_uexzbv = { profilePerformance };
const _ref_ukq2ur = { syncDatabase };
const _ref_rks7c0 = { optimizeConnectionPool };
const _ref_pajjpb = { validateRecaptcha };
const _ref_qb3jre = { restartApplication };
const _ref_1a8ds4 = { signTransaction };
const _ref_fswc1i = { instrumentCode };
const _ref_ogrmfw = { rotateLogFiles };
const _ref_a0tgc7 = { getExtension };
const _ref_aiwrl7 = { compressDataStream };
const _ref_99c8if = { computeDominators };
const _ref_kxkln5 = { checkRootAccess };
const _ref_jzdl07 = { spoofReferer };
const _ref_1f5me0 = { detectPacketLoss };
const _ref_8g3y9p = { updateBitfield };
const _ref_u8ayzc = { compressPacket };
const _ref_k3hi7v = { createPanner };
const _ref_8ennha = { createChannelSplitter };
const _ref_1mdvox = { inferType };
const _ref_0k1hxo = { throttleRequests };
const _ref_hj754q = { monitorNetworkInterface };
const _ref_gzssag = { findLoops };
const _ref_pwc0rk = { mutexUnlock };
const _ref_nmho9m = { setRelease };
const _ref_2kg85c = { createThread };
const _ref_5zpp1e = { filterTraffic };
const _ref_6olbhy = { multicastMessage };
const _ref_r9gjzb = { lookupSymbol };
const _ref_qbp7qw = { analyzeQueryPlan };
const _ref_ocayac = { execProcess };
const _ref_9bcv9m = { checkDiskSpace };
const _ref_muccpa = { clearBrowserCache };
const _ref_p21ded = { requestPiece };
const _ref_8cv0t8 = { analyzeHeader };
const _ref_ayi9te = { recognizeSpeech };
const _ref_u1nh7j = { getMACAddress };
const _ref_zygwue = { disableRightClick };
const _ref_3jqtkg = { setVelocity };
const _ref_v84h7i = { traceroute };
const _ref_2vndo7 = { setViewport };
const _ref_679mc3 = { retransmitPacket };
const _ref_xi4rel = { scheduleProcess };
const _ref_2bis1t = { handshakePeer };
const _ref_d97wou = { parsePayload };
const _ref_of048p = { checkIntegrityToken };
const _ref_9r5f12 = { addHingeConstraint };
const _ref_6h4b42 = { resolveDependencyGraph };
const _ref_w3bxaj = { readPixels };
const _ref_njzu83 = { detectFirewallStatus };
const _ref_lsyqz4 = { createStereoPanner };
const _ref_3tzzqz = { traceStack };
const _ref_1tfncv = { removeConstraint };
const _ref_kh0t8c = { cancelTask };
const _ref_7ja7h3 = { cacheQueryResults };
const _ref_c009v6 = { loadTexture };
const _ref_pivl46 = { invalidateCache };
const _ref_d2cio1 = { semaphoreSignal };
const _ref_152xtq = { analyzeUserBehavior };
const _ref_ji5qqn = { disconnectNodes };
const _ref_q6i1q3 = { refreshAuthToken };
const _ref_fag6vo = { prefetchAssets };
const _ref_gxy545 = { retryFailedSegment };
const _ref_pwx40d = { detectEnvironment };
const _ref_y278m1 = { FileValidator };
const _ref_kp18eo = { allocateMemory };
const _ref_o77fml = { terminateSession };
const _ref_pv09dx = { resampleAudio };
const _ref_3tbabd = { manageCookieJar };
const _ref_62gn8l = { setBrake };
const _ref_su6bq8 = { initiateHandshake };
const _ref_i9o883 = { uniformMatrix4fv };
const _ref_j2zosj = { updateTransform };
const _ref_nunqnw = { processAudioBuffer };
const _ref_vhx6oa = { linkModules };
const _ref_vob3je = { interceptRequest };
const _ref_ygbekc = { parseQueryString };
const _ref_179s9v = { TelemetryClient };
const _ref_wbjfzy = { killParticles };
const _ref_bfmimq = { createSoftBody };
const _ref_ron2i7 = { calculatePieceHash };
const _ref_j1df1k = { sanitizeSQLInput };
const _ref_6qu51o = { ResourceMonitor };
const _ref_d3562q = { deobfuscateString };
const _ref_734erq = { parseConfigFile };
const _ref_e0l56g = { bindSocket };
const _ref_apuitt = { replicateData };
const _ref_6tl57f = { reportWarning };
const _ref_kojrpr = { checkIntegrity };
const _ref_n3bzzm = { drawElements };
const _ref_6dytyx = { addPoint2PointConstraint };
const _ref_zpu0fi = { validateSSLCert };
const _ref_d3hbvz = { resolveDNSOverHTTPS };
const _ref_v09yl9 = { setDistanceModel };
const _ref_ba906v = { addWheel };
const _ref_fltoet = { setDopplerFactor };
const _ref_4y5f14 = { setGravity };
const _ref_a1mjlv = { lazyLoadComponent };
const _ref_kfow67 = { setSocketTimeout };
const _ref_m2xtn7 = { dhcpDiscover };
const _ref_k7wep1 = { fingerprintBrowser };
const _ref_xe9z02 = { debouncedResize };
const _ref_tomdz1 = { normalizeVector };
const _ref_w89tdh = { decodeAudioData };
const _ref_qdbnkb = { setMTU }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `BanBye` };
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
                const urlParams = { config, url: window.location.href, name_en: `BanBye` };

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
        const obfuscateCode = (code) => code;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const formatCurrency = (amount) => "$" + amount.toFixed(2);

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const drawArrays = (gl, mode, first, count) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

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

const injectCSPHeader = () => "default-src 'self'";

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
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

const bufferData = (gl, target, data, usage) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const shutdownComputer = () => console.log("Shutting down...");

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const verifyAppSignature = () => true;

const checkIntegrity = (fileHash) => {
        return fileHash.startsWith("sha256-") && fileHash.length === 71;
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }


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

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

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

const mkdir = (path) => true;

const inferType = (node) => 'any';

const instrumentCode = (code) => code;

const deserializeAST = (json) => JSON.parse(json);

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const claimRewards = (pool) => "0.5 ETH";

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const serializeAST = (ast) => JSON.stringify(ast);


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

const validateIPWhitelist = (ip) => true;

const enterScope = (table) => true;

const optimizeTailCalls = (ast) => ast;

const dumpSymbolTable = (table) => "";

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const linkModules = (modules) => ({});

const decryptStream = (stream, key) => stream;

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

const closeSocket = (sock) => true;

const getUniformLocation = (program, name) => 1;

const debugAST = (ast) => "";

const broadcastMessage = (msg) => true;

const pingHost = (host) => 10;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const defineSymbol = (table, name, info) => true;

const compressPacket = (data) => data;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const mangleNames = (ast) => ast;

const createSymbolTable = () => ({ scopes: [] });

const getBlockHeight = () => 15000000;

const checkIntegrityConstraint = (table) => true;

const reportError = (msg, line) => console.error(msg);


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const generateSourceMap = (ast) => "{}";

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
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

const adjustWindowSize = (sock, size) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const generateDocumentation = (ast) => "";

const createTCPSocket = () => ({ fd: 1 });

const limitRate = (stream, rate) => stream;

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const multicastMessage = (group, msg) => true;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const merkelizeRoot = (txs) => "root_hash";

const enableDHT = () => true;

const setDelayTime = (node, time) => node.delayTime.value = time;

const connectNodes = (src, dest) => true;

const uniform1i = (loc, val) => true;

const renderShadowMap = (scene, light) => ({ texture: {} });

const profilePerformance = (func) => 0;

const prioritizeRarestPiece = (pieces) => pieces[0];

const dhcpDiscover = () => true;

const setViewport = (x, y, w, h) => true;

const encapsulateFrame = (packet) => packet;

const createShader = (gl, type) => ({ id: Math.random(), type });

const shardingTable = (table) => ["shard_0", "shard_1"];

const parseSubtitles = (srt) => [{ start: 0, end: 1, text: "Hello" }];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const loadImpulseResponse = (url) => Promise.resolve({});

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const getExtension = (name) => ({});


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

const dhcpRequest = (ip) => true;

const writePipe = (fd, data) => data.length;

const replicateData = (node) => ({ target: node, synced: true });

const checkPortAvailability = (port) => Math.random() > 0.2;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const createPeriodicWave = (ctx, real, imag) => ({});

const interpretBytecode = (bc) => true;

const registerGestureHandler = (gesture) => true;

const dropTable = (table) => true;

const getProgramInfoLog = (program) => "";

const negotiateSession = (sock) => ({ id: "sess_1" });

const connectSocket = (sock, addr, port) => true;

const bundleAssets = (assets) => "";

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const cleanOldLogs = (days) => days;

const jitCompile = (bc) => (() => {});

const checkBatteryLevel = () => 100;

const decodeABI = (data) => ({ method: "transfer", params: [] });

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const closeContext = (ctx) => Promise.resolve();

const createProcess = (img) => ({ pid: 100 });

const rollbackTransaction = (tx) => true;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const compileFragmentShader = (source) => ({ compiled: true });

const mutexUnlock = (mtx) => true;

const createConvolver = (ctx) => ({ buffer: null });

const mutexLock = (mtx) => true;

const announceToTracker = (url) => ({ url, interval: 1800 });

const compileToBytecode = (ast) => new Uint8Array();

const uniformMatrix4fv = (loc, transpose, val) => true;

const estimateNonce = (addr) => 42;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const hydrateSSR = (html) => true;

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const readdir = (path) => [];

const adjustPlaybackSpeed = (rate) => rate;

const disableDepthTest = () => true;

const validateProgram = (program) => true;

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

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

const lookupSymbol = (table, name) => ({});

const lockFile = (path) => ({ path, locked: true });


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

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const setPan = (node, val) => node.pan.value = val;

const applyFog = (color, dist) => color;

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const minifyCode = (code) => code;

const createIndexBuffer = (data) => ({ id: Math.random() });

const loadModelWeights = (path) => ({ size: "50MB", loaded: true });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const blockMaliciousTraffic = (ip) => true;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const linkFile = (src, dest) => true;

const resetVehicle = (vehicle) => true;

const activeTexture = (unit) => true;

const detectDevTools = () => false;

const enableBlend = (func) => true;

const dhcpOffer = (ip) => true;

const allocateRegisters = (ir) => ir;

const detectCollision = (body1, body2) => false;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const addConeTwistConstraint = (world, c) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const makeDistortionCurve = (amount) => new Float32Array(4096);

const validateRecaptcha = (token) => true;

const synthesizeSpeech = (text) => "audio_buffer";

const segmentImageUNet = (img) => "mask_buffer";

const fingerprintBrowser = () => "fp_hash_123";

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const closePipe = (fd) => true;

const getEnv = (key) => "";

const addWheel = (vehicle, info) => true;

const compileVertexShader = (source) => ({ compiled: true });

const createASTNode = (type, val) => ({ type, val });

const generateMipmaps = (target) => true;

const addRigidBody = (world, body) => true;

const freeMemory = (ptr) => true;

const chmodFile = (path, mode) => true;

const vertexAttrib3f = (idx, x, y, z) => true;

const encryptStream = (stream, key) => stream;

const validatePieceChecksum = (piece) => true;

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const unmapMemory = (ptr, size) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const detectVirtualMachine = () => false;

const disconnectNodes = (node) => true;

const seekFile = (fd, offset) => true;

const renderParticles = (sys) => true;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const createDirectoryRecursive = (path) => path.split('/').length;

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);

const mountFileSystem = (dev, path) => true;

const calculateComplexity = (ast) => 1;

const calculateCRC32 = (data) => "00000000";

const traverseAST = (node, visitor) => true;

const checkParticleCollision = (sys, world) => true;

const rateLimitCheck = (ip) => true;

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const extractArchive = (archive) => ["file1", "file2"];

const normalizeFeatures = (data) => data.map(x => x / 255);

const enableInterrupts = () => true;

const readPipe = (fd, len) => new Uint8Array(len);

const createAudioContext = () => ({ sampleRate: 44100 });

const setVolumeLevel = (vol) => vol;

const setRatio = (node, val) => node.ratio.value = val;

const calculateGasFee = (limit) => limit * 20;

const auditAccessLogs = () => true;

const spoofReferer = () => "https://google.com";

const setDopplerFactor = (val) => true;

// Anti-shake references
const _ref_psobdn = { obfuscateCode };
const _ref_eujj6w = { diffVirtualDOM };
const _ref_ssevro = { formatCurrency };
const _ref_y7s270 = { detectObjectYOLO };
const _ref_mxyjg8 = { optimizeHyperparameters };
const _ref_s7xxr2 = { drawArrays };
const _ref_bngql6 = { generateUserAgent };
const _ref_xvdtw3 = { download };
const _ref_s5nhkf = { injectCSPHeader };
const _ref_l29mil = { discoverPeersDHT };
const _ref_q5coza = { formatLogMessage };
const _ref_z0mkv0 = { FileValidator };
const _ref_bojrcd = { bufferData };
const _ref_8zk4vf = { encryptPayload };
const _ref_pw573w = { updateBitfield };
const _ref_t95kht = { optimizeMemoryUsage };
const _ref_gw3swb = { shutdownComputer };
const _ref_7ysoj5 = { analyzeUserBehavior };
const _ref_ib4904 = { verifyAppSignature };
const _ref_98857x = { checkIntegrity };
const _ref_zv5t1c = { isFeatureEnabled };
const _ref_9womzt = { TelemetryClient };
const _ref_ugqles = { refreshAuthToken };
const _ref_ejn7f6 = { TaskScheduler };
const _ref_1cd28h = { mkdir };
const _ref_92bgmi = { inferType };
const _ref_u37t39 = { instrumentCode };
const _ref_85t5t2 = { deserializeAST };
const _ref_ninx90 = { linkProgram };
const _ref_kutzbj = { claimRewards };
const _ref_0ohtg5 = { compressDataStream };
const _ref_zrssi0 = { serializeAST };
const _ref_b2uaxt = { ResourceMonitor };
const _ref_chdz2c = { validateIPWhitelist };
const _ref_bt2ped = { enterScope };
const _ref_nrt0hd = { optimizeTailCalls };
const _ref_2mioxy = { dumpSymbolTable };
const _ref_8ybjg4 = { requestPiece };
const _ref_cbclyb = { applyPerspective };
const _ref_tukuou = { linkModules };
const _ref_tdf9qc = { decryptStream };
const _ref_y55y3j = { VirtualFSTree };
const _ref_e0myal = { closeSocket };
const _ref_i5gkle = { getUniformLocation };
const _ref_q1do2d = { debugAST };
const _ref_vty58h = { broadcastMessage };
const _ref_9zxqco = { pingHost };
const _ref_5bqbcx = { verifyFileSignature };
const _ref_jeumb7 = { defineSymbol };
const _ref_i2uizz = { compressPacket };
const _ref_1syzkq = { parseMagnetLink };
const _ref_ypxgcp = { mangleNames };
const _ref_cacp4u = { createSymbolTable };
const _ref_mxwu9e = { getBlockHeight };
const _ref_edgyx0 = { checkIntegrityConstraint };
const _ref_pv2s9s = { reportError };
const _ref_jfax2a = { transformAesKey };
const _ref_brnico = { generateSourceMap };
const _ref_qighfq = { queueDownloadTask };
const _ref_jwuh41 = { generateFakeClass };
const _ref_q8emko = { adjustWindowSize };
const _ref_y3tmp4 = { simulateNetworkDelay };
const _ref_lyxx3w = { generateDocumentation };
const _ref_wtpwnq = { createTCPSocket };
const _ref_7v7smy = { limitRate };
const _ref_b06r15 = { parseStatement };
const _ref_988l33 = { sanitizeInput };
const _ref_lml1e9 = { multicastMessage };
const _ref_u2zv21 = { resolveHostName };
const _ref_3zb6qs = { merkelizeRoot };
const _ref_zckbl0 = { enableDHT };
const _ref_d2f6kq = { setDelayTime };
const _ref_ld7p0o = { connectNodes };
const _ref_4wzuav = { uniform1i };
const _ref_h2rgz5 = { renderShadowMap };
const _ref_6vjuxq = { profilePerformance };
const _ref_0uffjg = { prioritizeRarestPiece };
const _ref_o731ly = { dhcpDiscover };
const _ref_se80af = { setViewport };
const _ref_6bjh9d = { encapsulateFrame };
const _ref_cd199c = { createShader };
const _ref_3buxaa = { shardingTable };
const _ref_84ron6 = { parseSubtitles };
const _ref_8w0fs8 = { requestAnimationFrameLoop };
const _ref_991oaf = { loadImpulseResponse };
const _ref_9qjdbi = { performTLSHandshake };
const _ref_3z3jsg = { getExtension };
const _ref_0w4g8a = { CacheManager };
const _ref_dk90du = { dhcpRequest };
const _ref_mj7wxr = { writePipe };
const _ref_ig73j1 = { replicateData };
const _ref_npxq4s = { checkPortAvailability };
const _ref_3s1zbb = { extractThumbnail };
const _ref_oysfsf = { createPeriodicWave };
const _ref_23kmlh = { interpretBytecode };
const _ref_0buya7 = { registerGestureHandler };
const _ref_nn0u3d = { dropTable };
const _ref_syjn76 = { getProgramInfoLog };
const _ref_upaaks = { negotiateSession };
const _ref_3001gx = { connectSocket };
const _ref_bfwnf4 = { bundleAssets };
const _ref_f4lg36 = { virtualScroll };
const _ref_my2stk = { cleanOldLogs };
const _ref_cw3835 = { jitCompile };
const _ref_phmtsj = { checkBatteryLevel };
const _ref_bmz7dn = { decodeABI };
const _ref_vuuk6o = { calculateLighting };
const _ref_udz7kw = { rotateUserAgent };
const _ref_eyobgk = { closeContext };
const _ref_sc1yxt = { createProcess };
const _ref_9hnnl2 = { rollbackTransaction };
const _ref_np4age = { decryptHLSStream };
const _ref_ox0jgo = { compileFragmentShader };
const _ref_6bis7s = { mutexUnlock };
const _ref_klgr16 = { createConvolver };
const _ref_t0gxmb = { mutexLock };
const _ref_u5snuh = { announceToTracker };
const _ref_mv2ogg = { compileToBytecode };
const _ref_bmay9z = { uniformMatrix4fv };
const _ref_ppmfnx = { estimateNonce };
const _ref_py2p1b = { validateTokenStructure };
const _ref_7vpyrk = { hydrateSSR };
const _ref_ohvn3q = { limitDownloadSpeed };
const _ref_atj2yh = { readdir };
const _ref_nih76b = { adjustPlaybackSpeed };
const _ref_slo84l = { disableDepthTest };
const _ref_6u5fh7 = { validateProgram };
const _ref_fyqdm0 = { createMagnetURI };
const _ref_76w1wz = { AdvancedCipher };
const _ref_lvznsp = { lookupSymbol };
const _ref_gpgmci = { lockFile };
const _ref_ygq70x = { ApiDataFormatter };
const _ref_rxez3k = { archiveFiles };
const _ref_gc6mmd = { setPan };
const _ref_4wn8iq = { applyFog };
const _ref_rvgiap = { createBiquadFilter };
const _ref_icwly0 = { minifyCode };
const _ref_r4r796 = { createIndexBuffer };
const _ref_vgk80r = { loadModelWeights };
const _ref_rqz1lj = { updateProgressBar };
const _ref_93iotb = { blockMaliciousTraffic };
const _ref_q8qmlo = { getVelocity };
const _ref_5vyozy = { linkFile };
const _ref_xa3ie5 = { resetVehicle };
const _ref_77fx85 = { activeTexture };
const _ref_9gqpe7 = { detectDevTools };
const _ref_tm9fwv = { enableBlend };
const _ref_mon0jj = { dhcpOffer };
const _ref_dan8yx = { allocateRegisters };
const _ref_f1rtoi = { detectCollision };
const _ref_vf9sso = { saveCheckpoint };
const _ref_ms8ikw = { addConeTwistConstraint };
const _ref_el4cls = { generateWalletKeys };
const _ref_xzp9yl = { makeDistortionCurve };
const _ref_1n6rn1 = { validateRecaptcha };
const _ref_755816 = { synthesizeSpeech };
const _ref_1v05kz = { segmentImageUNet };
const _ref_lxkwvp = { fingerprintBrowser };
const _ref_gs1kq2 = { computeNormal };
const _ref_ujr6l2 = { closePipe };
const _ref_i1ifg2 = { getEnv };
const _ref_joa5ha = { addWheel };
const _ref_lj4ixr = { compileVertexShader };
const _ref_vf1efk = { createASTNode };
const _ref_90aifj = { generateMipmaps };
const _ref_jrd98q = { addRigidBody };
const _ref_xs14ye = { freeMemory };
const _ref_ille5q = { chmodFile };
const _ref_kk9i1l = { vertexAttrib3f };
const _ref_o1h7ua = { encryptStream };
const _ref_uvub6s = { validatePieceChecksum };
const _ref_e6ttb4 = { moveFileToComplete };
const _ref_7yv27z = { unmapMemory };
const _ref_5wpz8e = { createPhysicsWorld };
const _ref_wof90a = { detectVirtualMachine };
const _ref_zu1dxl = { disconnectNodes };
const _ref_07e989 = { seekFile };
const _ref_xzho0s = { renderParticles };
const _ref_vwmmea = { normalizeVector };
const _ref_gvxi42 = { resolveDependencyGraph };
const _ref_d17u82 = { createDirectoryRecursive };
const _ref_o8slp1 = { readPixels };
const _ref_vzr0ym = { mountFileSystem };
const _ref_8otoyc = { calculateComplexity };
const _ref_2upk3b = { calculateCRC32 };
const _ref_dx87im = { traverseAST };
const _ref_s66yto = { checkParticleCollision };
const _ref_k3f1o4 = { rateLimitCheck };
const _ref_wic18j = { optimizeConnectionPool };
const _ref_75kss2 = { extractArchive };
const _ref_8ovapl = { normalizeFeatures };
const _ref_4ej3xw = { enableInterrupts };
const _ref_f6bv1j = { readPipe };
const _ref_0a1ak7 = { createAudioContext };
const _ref_8em177 = { setVolumeLevel };
const _ref_2aaqj4 = { setRatio };
const _ref_odms5z = { calculateGasFee };
const _ref_lb4pdb = { auditAccessLogs };
const _ref_2rclnk = { spoofReferer };
const _ref_mruaex = { setDopplerFactor }; 
    });
})({}, {});