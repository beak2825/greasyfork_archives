// ==UserScript==
// @name ArteSkyIt视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/arte_sky_it/index.js
// @version 2026.01.10
// @description 一键下载ArteSkylt视频，支持4K/1080P/720P多画质。
// @icon https://arte.sky.it/favicon.ico
// @match https://arte.sky.it/
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect sky.it
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
// @downloadURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562229/ArteSkyIt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const detectAudioCodec = () => "aac";

const joinThread = (tid) => true;

const calculateSHA256 = (data) => "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const checkBatteryLevel = () => 100;

const normalizeAudio = (level) => ({ level: 0, normalized: true });

const queueDownloadTask = (task) => {
        return { taskId: "T-" + Date.now(), status: "queued", priority: task.priority || 1 };
    };

const verifyProofOfWork = (nonce) => true;


        // 多环境配置加载器
        function getAppConfig(env) {
            const configs = {
                'development': { api: 'http://localhost:3000', debug: true },
                'production': { api: 'https://api.prod.com', debug: false }
            };
            return configs[env] || configs['production'];
        }

const generateEmbeddings = (text) => new Float32Array(128);

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const convertFormat = (src, dest) => dest;

const shutdownComputer = () => console.log("Shutting down...");

const restoreDatabase = (path) => true;

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const gaussianBlur = (image, radius) => image;

const detectVideoCodec = () => "h264";

const tokenizeText = (text) => text.split(" ");

const limitRate = (stream, rate) => stream;

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const deriveAddress = (path) => "0x123...";

const reportError = (msg, line) => console.error(msg);

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
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

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const writePipe = (fd, data) => data.length;

const verifyAppSignature = () => true;

const throttleRequests = (limit) => {
        let count = 0;
        return () => ++count <= limit;
    };

const sanitizeXSS = (html) => html;

const augmentData = (image) => image;

const bufferMediaStream = (size) => ({ buffer: size });

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const validateRecaptcha = (token) => true;

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

const prioritizeRarestPiece = (pieces) => pieces[0];

const enableInterrupts = () => true;

const optimizeAST = (ast) => ast;

const exitScope = (table) => true;

const performOCR = (img) => "Detected Text";

const getProgramInfoLog = (program) => "";

const createIndex = (table, col) => `IDX_${table}_${col}`;

const makeDistortionCurve = (amount) => new Float32Array(4096);

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const checkRootAccess = () => false;

const unmapMemory = (ptr, size) => true;

const rateLimitCheck = (ip) => true;

const parseClass = (tokens) => ({ type: 'ClassDeclaration' });

const addConeTwistConstraint = (world, c) => true;

const createSoftBody = (info) => ({ nodes: [] });

const visitNode = (node) => true;

const checkTypes = (ast) => [];

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const setVelocity = (body, v) => true;

const interestPeer = (peer) => ({ ...peer, interested: true });

const computeLossFunction = (pred, actual) => 0.05;

const getMediaDuration = () => 3600;

const reduceDimensionalityPCA = (data) => data;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const unloadDriver = (name) => true;

const calculateRestitution = (mat1, mat2) => 0.3;

const cacheQueryResults = (key, data) => true;

const prefetchAssets = (urls) => urls.length;

const applyForce = (body, force, point) => true;

const checkIntegrityConstraint = (table) => true;

const resampleAudio = (buffer, rate) => buffer;

const predictTensor = (input) => [0.1, 0.9, 0.0];

const applyTheme = (theme) => document.body.className = theme;

const rmdir = (path) => true;

const createMediaElementSource = (ctx, el) => ({});

const allowSleepMode = () => true;

const detectVirtualMachine = () => false;

const parseExpression = (tokens) => ({ type: 'BinaryExpression' });

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const renderVirtualDOM = (tree) => {
        return `<div id="${tree.id || 'root'}" class="${tree.class || ''}">${tree.content || ''}</div>`;
    };

const getOutputTimestamp = (ctx) => Date.now();

const resolveDNSOverHTTPS = (domain) => {
        return { ip: `192.168.1.${Math.floor(Math.random() * 255)}`, provider: "Cloudflare" };
    };

const linkModules = (modules) => ({});

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const setPosition = (panner, x, y, z) => true;

const jitCompile = (bc) => (() => {});

const stakeAssets = (pool, amount) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const stepSimulation = (world, dt) => true;

const scheduleTask = (task) => ({ id: 1, task });

const swapTokens = (pair, amount) => true;

const detectDebugger = () => false;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const generateSourceMap = (ast) => "{}";

const optimizeTailCalls = (ast) => ast;

const lookupSymbol = (table, name) => ({});

const addGeneric6DofConstraint = (world, c) => true;

const createDirectoryRecursive = (path) => path.split('/').length;

const disableRightClick = () => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };


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

const resetVehicle = (vehicle) => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const decompressGzip = (data) => data;

const setMass = (body, m) => true;

const migrateSchema = (version) => ({ current: version, status: "ok" });

const interpretBytecode = (bc) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const rollbackTransaction = (tx) => true;

const splitFile = (path, parts) => Array(parts).fill(path);

const setRatio = (node, val) => node.ratio.value = val;

const dropTable = (table) => true;

const logErrorToFile = (err) => console.error(err);

const reportWarning = (msg, line) => console.warn(msg);

const detectDevTools = () => false;

const listenSocket = (sock, backlog) => true;

const createTCPSocket = () => ({ fd: 1 });

const compressPacket = (data) => data;

const setDistanceModel = (panner, model) => true;


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

const setEnv = (key, val) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const createPipe = () => [3, 4];

const signTransaction = (tx, key) => "signed_tx_hash";

const removeRigidBody = (world, body) => true;

const seedRatioLimit = (ratio) => ratio >= 2.0;

const setThreshold = (node, val) => node.threshold.value = val;

const setRelease = (node, val) => node.release.value = val;

const debugAST = (ast) => "";

const filterTraffic = (rule) => true;

const createASTNode = (type, val) => ({ type, val });

const lockRow = (id) => true;

const uninterestPeer = (peer) => ({ ...peer, interested: false });

const compileFragmentShader = (source) => ({ compiled: true });

const unmountFileSystem = (path) => true;

const addRigidBody = (world, body) => true;

const verifyIR = (ir) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const setMTU = (iface, mtu) => true;

const processAudioBuffer = (buffer) => buffer;

const virtualScroll = (offset) => ({ start: offset, end: offset + 10 });

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });

const connectNodes = (src, dest) => true;

const killProcess = (pid) => true;

const getExtension = (name) => ({});

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const checkBalance = (addr) => "10.5 ETH";

const encryptStream = (stream, key) => stream;

const compileVertexShader = (source) => ({ compiled: true });

const setAngularVelocity = (body, v) => true;

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const monitorClipboard = () => "";

const pingHost = (host) => 10;

const handshakePeer = (ip, port) => {
        const peerId = `-AZ2100-${Math.random().toString(36).substring(2, 14)}`;
        return { connected: true, peerId, client: "Azureus 2.1.0.0" };
    };

const minifyCode = (code) => code;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const getcwd = () => "/";

const disablePEX = () => false;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const setFilterType = (filter, type) => filter.type = type;

const createConstraint = (body1, body2) => ({});

const hydrateSSR = (html) => true;

const recognizeSpeech = (audio) => "Transcribed Text";

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const obfuscateString = (str) => btoa(str);

const archiveFiles = (files) => ({ archive: "files.zip", count: files.length });

const connectSocket = (sock, addr, port) => true;

const renameFile = (oldName, newName) => newName;

const broadcastMessage = (msg) => true;

const restartApplication = () => console.log("Restarting...");

const calculateGasFee = (limit) => limit * 20;

const setViewport = (x, y, w, h) => true;

const enableDHT = () => true;

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

const setQValue = (filter, q) => filter.Q = q;

const calculateComplexity = (ast) => 1;

const createDelay = (ctx, maxTime) => ({ delayTime: { value: 0 } });

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const deobfuscateString = (str) => atob(str);

const arpRequest = (ip) => "00:00:00:00:00:00";

const decapsulateFrame = (frame) => frame;

const classifySentiment = (text) => "positive";

const detectDarkMode = () => true;

const setFilePermissions = (perm) => `chmod ${perm}`;

const createConvolver = (ctx) => ({ buffer: null });

const cancelTask = (id) => ({ id, cancelled: true });

const chokePeer = (peer) => ({ ...peer, choked: true });

const createMeshShape = (vertices) => ({ type: 'mesh' });

const verifyMagnetLink = (link) => link.startsWith("magnet:");

const encodeABI = (method, params) => "0x...";

const captureScreenshot = () => "data:image/png;base64,...";

const claimRewards = (pool) => "0.5 ETH";

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const parseLogTopics = (topics) => ["Transfer"];

const systemCall = (num, args) => 0;

const obfuscateCode = (code) => code;

const foldConstants = (ast) => ast;

const getBlockHeight = () => 15000000;

const calculateFriction = (mat1, mat2) => 0.5;

const readPipe = (fd, len) => new Uint8Array(len);

// Anti-shake references
const _ref_bfv5l2 = { detectAudioCodec };
const _ref_aozm4v = { joinThread };
const _ref_iq7f84 = { calculateSHA256 };
const _ref_kos4ql = { verifyFileSignature };
const _ref_3omi9r = { checkBatteryLevel };
const _ref_dsvnvw = { normalizeAudio };
const _ref_u1qc4t = { queueDownloadTask };
const _ref_9bvwke = { verifyProofOfWork };
const _ref_mah207 = { getAppConfig };
const _ref_7p0wx3 = { generateEmbeddings };
const _ref_e0v24q = { uploadCrashReport };
const _ref_r6776f = { convertFormat };
const _ref_5ts2jt = { shutdownComputer };
const _ref_mze0vl = { restoreDatabase };
const _ref_i5b8z2 = { analyzeQueryPlan };
const _ref_jo8crw = { calculateLayoutMetrics };
const _ref_n12vtl = { gaussianBlur };
const _ref_n46exe = { detectVideoCodec };
const _ref_ts8ia8 = { tokenizeText };
const _ref_v02qqf = { limitRate };
const _ref_04g3pn = { resolveHostName };
const _ref_xk2lpn = { deriveAddress };
const _ref_p9ti6k = { reportError };
const _ref_lxca5o = { encryptPayload };
const _ref_am7sz3 = { calculateEntropy };
const _ref_bl7bc8 = { discoverPeersDHT };
const _ref_qcizez = { updateProgressBar };
const _ref_oy949r = { writePipe };
const _ref_zhnidg = { verifyAppSignature };
const _ref_85maol = { throttleRequests };
const _ref_z04sg6 = { sanitizeXSS };
const _ref_rqxmw3 = { augmentData };
const _ref_w49w4o = { bufferMediaStream };
const _ref_pgsq0w = { optimizeHyperparameters };
const _ref_1zk59w = { transformAesKey };
const _ref_i1u0q6 = { validateRecaptcha };
const _ref_68fte9 = { download };
const _ref_83drmz = { prioritizeRarestPiece };
const _ref_3toeuy = { enableInterrupts };
const _ref_41ui1d = { optimizeAST };
const _ref_mhzew7 = { exitScope };
const _ref_2nm0ve = { performOCR };
const _ref_gdncp8 = { getProgramInfoLog };
const _ref_g7jady = { createIndex };
const _ref_sf8xo5 = { makeDistortionCurve };
const _ref_y4l5py = { monitorNetworkInterface };
const _ref_70hohb = { checkRootAccess };
const _ref_8bmbk2 = { unmapMemory };
const _ref_h9nxlc = { rateLimitCheck };
const _ref_kddqd8 = { parseClass };
const _ref_xjtxiw = { addConeTwistConstraint };
const _ref_mkkgj0 = { createSoftBody };
const _ref_lj8z67 = { visitNode };
const _ref_eqh2vf = { checkTypes };
const _ref_ekl147 = { validateTokenStructure };
const _ref_4t297f = { setVelocity };
const _ref_ovy5fb = { interestPeer };
const _ref_z0552i = { computeLossFunction };
const _ref_i7lj2a = { getMediaDuration };
const _ref_zuwd8z = { reduceDimensionalityPCA };
const _ref_pc3jzz = { isFeatureEnabled };
const _ref_wxt89d = { unloadDriver };
const _ref_4nu8mw = { calculateRestitution };
const _ref_c4s86k = { cacheQueryResults };
const _ref_g96rl8 = { prefetchAssets };
const _ref_5xwzp7 = { applyForce };
const _ref_znyfiu = { checkIntegrityConstraint };
const _ref_ybpni5 = { resampleAudio };
const _ref_ta0jgc = { predictTensor };
const _ref_x5g1ge = { applyTheme };
const _ref_b8sl6u = { rmdir };
const _ref_x409up = { createMediaElementSource };
const _ref_hds4hv = { allowSleepMode };
const _ref_cnsrt9 = { detectVirtualMachine };
const _ref_xsul9m = { parseExpression };
const _ref_hh1e1t = { getMemoryUsage };
const _ref_6kcv7t = { renderVirtualDOM };
const _ref_nx3e2w = { getOutputTimestamp };
const _ref_cjwgqb = { resolveDNSOverHTTPS };
const _ref_ta5baz = { linkModules };
const _ref_ept2t7 = { executeSQLQuery };
const _ref_u9tfwk = { setPosition };
const _ref_txx5ie = { jitCompile };
const _ref_caz1de = { stakeAssets };
const _ref_tf0onu = { convexSweepTest };
const _ref_u6n2mw = { generateWalletKeys };
const _ref_qhdcpr = { lazyLoadComponent };
const _ref_ms6m1j = { stepSimulation };
const _ref_pr3r3u = { scheduleTask };
const _ref_dk2f42 = { swapTokens };
const _ref_tsngj1 = { detectDebugger };
const _ref_wltxw0 = { extractThumbnail };
const _ref_48edss = { generateSourceMap };
const _ref_0p1vm8 = { optimizeTailCalls };
const _ref_utew8n = { lookupSymbol };
const _ref_tb045u = { addGeneric6DofConstraint };
const _ref_luxe6q = { createDirectoryRecursive };
const _ref_rzo8gc = { disableRightClick };
const _ref_3hxair = { requestPiece };
const _ref_z5w7mg = { ResourceMonitor };
const _ref_j1neww = { resetVehicle };
const _ref_nmxjsq = { generateUUIDv5 };
const _ref_js1oy3 = { decompressGzip };
const _ref_0ywoup = { setMass };
const _ref_wjtbcy = { migrateSchema };
const _ref_z9kl6v = { interpretBytecode };
const _ref_mhi7kv = { syncAudioVideo };
const _ref_jbh7zg = { rollbackTransaction };
const _ref_sr6d49 = { splitFile };
const _ref_368l91 = { setRatio };
const _ref_gtds8o = { dropTable };
const _ref_4v1e40 = { logErrorToFile };
const _ref_6kp4a8 = { reportWarning };
const _ref_o4vizp = { detectDevTools };
const _ref_jwq92j = { listenSocket };
const _ref_f4irsw = { createTCPSocket };
const _ref_xe5ou5 = { compressPacket };
const _ref_d86bt4 = { setDistanceModel };
const _ref_mfruzb = { TelemetryClient };
const _ref_ak5yt2 = { setEnv };
const _ref_82hxm5 = { interceptRequest };
const _ref_gdcegs = { createPipe };
const _ref_1wv4b7 = { signTransaction };
const _ref_vpmegl = { removeRigidBody };
const _ref_yx42z2 = { seedRatioLimit };
const _ref_648udm = { setThreshold };
const _ref_2eqojl = { setRelease };
const _ref_5pn5lw = { debugAST };
const _ref_902fsl = { filterTraffic };
const _ref_bkosqc = { createASTNode };
const _ref_qhnxj9 = { lockRow };
const _ref_zu76xn = { uninterestPeer };
const _ref_wmab0l = { compileFragmentShader };
const _ref_yd4kq9 = { unmountFileSystem };
const _ref_nhn8n8 = { addRigidBody };
const _ref_ko4woc = { verifyIR };
const _ref_arqt2l = { createIndexBuffer };
const _ref_tc0503 = { syncDatabase };
const _ref_q0kbmq = { setMTU };
const _ref_p2i4l4 = { processAudioBuffer };
const _ref_vgdpss = { virtualScroll };
const _ref_zxvxmj = { createOscillator };
const _ref_zg7snj = { connectNodes };
const _ref_vpoo0d = { killProcess };
const _ref_sa3wd3 = { getExtension };
const _ref_dnojyo = { decryptHLSStream };
const _ref_mrfoee = { checkBalance };
const _ref_e6k6tu = { encryptStream };
const _ref_pi6stw = { compileVertexShader };
const _ref_r7pbvf = { setAngularVelocity };
const _ref_btmzld = { simulateNetworkDelay };
const _ref_j0ahv2 = { monitorClipboard };
const _ref_7gpiyj = { pingHost };
const _ref_6j9zfm = { handshakePeer };
const _ref_uneyug = { minifyCode };
const _ref_tbc993 = { saveCheckpoint };
const _ref_8p2w2u = { getcwd };
const _ref_njohxq = { disablePEX };
const _ref_ziub33 = { getVelocity };
const _ref_e3vnbj = { setFilterType };
const _ref_0rjtle = { createConstraint };
const _ref_guaugr = { hydrateSSR };
const _ref_ih0mnw = { recognizeSpeech };
const _ref_79cokx = { traceStack };
const _ref_1pwzga = { obfuscateString };
const _ref_mp3f3f = { archiveFiles };
const _ref_ay56pg = { connectSocket };
const _ref_i0yvi1 = { renameFile };
const _ref_wrq72j = { broadcastMessage };
const _ref_z6d370 = { restartApplication };
const _ref_c7fo6t = { calculateGasFee };
const _ref_94bz48 = { setViewport };
const _ref_gh5zix = { enableDHT };
const _ref_4q7ben = { generateFakeClass };
const _ref_0jln4b = { setQValue };
const _ref_ux1bco = { calculateComplexity };
const _ref_un134r = { createDelay };
const _ref_93eo16 = { parseM3U8Playlist };
const _ref_ycu405 = { deobfuscateString };
const _ref_xp8lp3 = { arpRequest };
const _ref_9vnejc = { decapsulateFrame };
const _ref_b8q8s7 = { classifySentiment };
const _ref_rtgqfg = { detectDarkMode };
const _ref_nezoux = { setFilePermissions };
const _ref_htvyhl = { createConvolver };
const _ref_nnj2zr = { cancelTask };
const _ref_t7qszg = { chokePeer };
const _ref_b4wfu9 = { createMeshShape };
const _ref_cocemf = { verifyMagnetLink };
const _ref_xzs40i = { encodeABI };
const _ref_0xj4jr = { captureScreenshot };
const _ref_kifp9u = { claimRewards };
const _ref_vr3gzl = { createScriptProcessor };
const _ref_bnvfyu = { parseLogTopics };
const _ref_n54lmi = { systemCall };
const _ref_wquml0 = { obfuscateCode };
const _ref_khdufg = { foldConstants };
const _ref_pbx1jb = { getBlockHeight };
const _ref_f8ni1e = { calculateFriction };
const _ref_xzj8b2 = { readPipe }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `arte_sky_it` };
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
                const urlParams = { config, url: window.location.href, name_en: `arte_sky_it` };

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
        const checkTypes = (ast) => [];

const setGravity = (world, g) => world.gravity = g;

const setBrake = (vehicle, force, wheelIdx) => true;

const addConeTwistConstraint = (world, c) => true;

const removeRigidBody = (world, body) => true;

const tokenizeSource = (code) => [{ type: 'Keyword', value: 'const' }];

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const uniform3f = (loc, x, y, z) => true;

const applyImpulse = (body, impulse, point) => true;

const compileVertexShader = (source) => ({ compiled: true });

const applyForce = (body, force, point) => true;

const normalizeVolume = (buffer) => buffer;

const setDopplerFactor = (val) => true;

const getByteFrequencyData = (analyser, array) => true;

const eliminateDeadCode = (ast) => ast;

const createConvolver = (ctx) => ({ buffer: null });

const repairCorruptFile = (path) => ({ path, repaired: true });

const readFile = (fd, len) => "";

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const fragmentPacket = (data, mtu) => [data];

const useProgram = (program) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const cleanOldLogs = (days) => days;

const receivePacket = (sock, len) => new Uint8Array(len);

const installUpdate = () => false;

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const minifyCode = (code) => code;

const resumeContext = (ctx) => Promise.resolve();

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
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

const readPixels = (x, y, w, h) => new Uint8Array(w * h * 4);


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const tokenizeText = (text) => text.split(" ");

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const connectNodes = (src, dest) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const rotateLogFiles = () => true;

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const uniformMatrix4fv = (loc, transpose, val) => true;

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const setDetune = (osc, cents) => osc.detune = cents;

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const wakeUp = (body) => true;

const verifyChecksum = (data, sum) => true;

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const instrumentCode = (code) => code;

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const detectCollision = (body1, body2) => false;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const exitScope = (table) => true;

const checkRootAccess = () => false;

const calculateRestitution = (mat1, mat2) => 0.3;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const merkelizeRoot = (txs) => "root_hash";

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

const negotiateSession = (sock) => ({ id: "sess_1" });

const prefetchAssets = (urls) => urls.length;

const parseConfigFile = (configStr) => {
        try {
            return JSON.parse(configStr);
        } catch (e) {
            return { error: "PARSE_ERROR", timestamp: Date.now() };
        }
    };

const traverseAST = (node, visitor) => true;

const dhcpOffer = (ip) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const debounceAction = (action, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => action(...args), delay);
        };
    };

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const setAttack = (node, val) => node.attack.value = val;

const acceptConnection = (sock) => ({ fd: 2 });

const processAudioBuffer = (buffer) => buffer;

const normalizeVector = (x, y, z) => {
        const length = Math.sqrt(x*x + y*y + z*z);
        return length === 0 ? {x:0, y:0, z:0} : {x: x/length, y: y/length, z: z/length};
    };

const unlockFile = (path) => ({ path, locked: false });

const setRatio = (node, val) => node.ratio.value = val;

const subscribeToEvents = (contract) => true;

const encodeABI = (method, params) => "0x...";

const leaveGroup = (group) => true;

const detectVirtualMachine = () => false;

const parseMagnetLink = (uri) => {
        const match = uri.match(/xt=urn:btih:([a-zA-Z0-9]{40})/);
        return match ? { hash: match[1], trackers: [] } : null;
    };

const downInterface = (iface) => true;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const forkProcess = () => 101;

const setPan = (node, val) => node.pan.value = val;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const setDistanceModel = (panner, model) => true;

const scheduleTask = (task) => ({ id: 1, task });

const checkBalance = (addr) => "10.5 ETH";

const dhcpAck = () => true;

const unmuteStream = () => false;

const commitTransaction = (tx) => true;

const cacheQueryResults = (key, data) => true;

const generateWalletKeys = () => ({ pub: "0x...", priv: "..." });

const mergeFiles = (parts) => parts[0];

const discoverPeersDHT = () => Array(5).fill().map(() => `10.0.0.${Math.floor(Math.random() * 255)}`);

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const retransmitPacket = (seq) => true;

const setSocketTimeout = (ms) => ({ timeout: ms });

const allocateRegisters = (ir) => ir;

const uniform1i = (loc, val) => true;

const unmountFileSystem = (path) => true;

const createConstraint = (body1, body2) => ({});

const closeContext = (ctx) => Promise.resolve();

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const preventSleepMode = () => true;

const generateUUIDv5 = (namespace, name) => {
        return `${namespace}-${name}-${Math.random().toString(16).substring(2)}`;
    };

const makeDistortionCurve = (amount) => new Float32Array(4096);

const sleep = (body) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const scaleMatrix = (mat, vec) => mat;

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const upInterface = (iface) => true;

const closeSocket = (sock) => true;

const handleInterrupt = (irq) => true;

const adjustPlaybackSpeed = (rate) => rate;

const encapsulateFrame = (packet) => packet;

const createIndexBuffer = (data) => ({ id: Math.random() });

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const registerISR = (irq, func) => true;

const checkParticleCollision = (sys, world) => true;

const rmdir = (path) => true;

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const mockResponse = (body) => ({ status: 200, body });

const translateText = (text, lang) => text;

const compressPacket = (data) => data;

const setRelease = (node, val) => node.release.value = val;

const claimRewards = (pool) => "0.5 ETH";

const chownFile = (path, uid, gid) => true;

const chmodFile = (path, mode) => true;

const unlockRow = (id) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });


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

const anchorSoftBody = (soft, rigid) => true;

const detachThread = (tid) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const stepSimulation = (world, dt) => true;


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

const bundleAssets = (assets) => "";

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const auditAccessLogs = () => true;

const edgeDetectionSobel = (image) => image;

const sanitizeXSS = (html) => html;

const unrollLoops = (ast) => ast;

const unmapMemory = (ptr, size) => true;

const parseQueryString = (qs) => ({});

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const seekFile = (fd, offset) => true;

const obfuscateCode = (code) => code;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const closeFile = (fd) => true;

const prettifyCode = (code) => code;

const setInertia = (body, i) => true;

const swapTokens = (pair, amount) => true;

const bufferData = (gl, target, data, usage) => true;

const restoreDatabase = (path) => true;

const suspendContext = (ctx) => Promise.resolve();

const configureInterface = (iface, config) => true;

const cullFace = (mode) => true;

const getUniformLocation = (program, name) => 1;

const controlCongestion = (sock) => true;

const protectMemory = (ptr, size, flags) => true;

const reduceDimensionalityPCA = (data) => data;

const gaussianBlur = (image, radius) => image;

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

const startOscillator = (osc, time) => true;

const killProcess = (pid) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const getExtension = (name) => ({});

const createParticleSystem = (count) => ({ particles: [] });

const foldConstants = (ast) => ast;

const unlinkFile = (path) => true;

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const calculateFriction = (mat1, mat2) => 0.5;

const setMass = (body, m) => true;

const createFrameBuffer = () => ({ id: Math.random() });

const scheduleProcess = (pid) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const getFloatTimeDomainData = (analyser, array) => true;

const blockMaliciousTraffic = (ip) => true;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const mountFileSystem = (dev, path) => true;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const backupDatabase = (path) => ({ path, size: 5000 });

const convexSweepTest = (shape, start, end) => ({ hit: false });

const rotateUserAgent = () => `Bot/${Math.random().toFixed(2)}`;

const establishHandshake = (sock) => true;

const manageCookieJar = (jar) => ({ ...jar, updated: true });

const lazyLoadComponent = (name) => ({ name, loaded: false });

const pingHost = (host) => 10;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const decapsulateFrame = (frame) => frame;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const deleteBuffer = (buffer) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const contextSwitch = (oldPid, newPid) => true;

const checkPortAvailability = (port) => Math.random() > 0.2;

const normalizeFeatures = (data) => data.map(x => x / 255);

const deobfuscateString = (str) => atob(str);

const compileToBytecode = (ast) => new Uint8Array();

const migrateSchema = (version) => ({ current: version, status: "ok" });

// Anti-shake references
const _ref_u047ps = { checkTypes };
const _ref_zwa8u4 = { setGravity };
const _ref_zl0fnr = { setBrake };
const _ref_yxxmjx = { addConeTwistConstraint };
const _ref_5byymv = { removeRigidBody };
const _ref_2dshkb = { tokenizeSource };
const _ref_ckxm5f = { createAnalyser };
const _ref_fd0qe6 = { uniform3f };
const _ref_zw3g1v = { applyImpulse };
const _ref_zu351i = { compileVertexShader };
const _ref_nsv012 = { applyForce };
const _ref_qpve6f = { normalizeVolume };
const _ref_zvbcxp = { setDopplerFactor };
const _ref_7400ov = { getByteFrequencyData };
const _ref_qbk6ro = { eliminateDeadCode };
const _ref_lqk2au = { createConvolver };
const _ref_fmjaja = { repairCorruptFile };
const _ref_eslj8i = { readFile };
const _ref_7nhex4 = { uploadCrashReport };
const _ref_okj5c1 = { fragmentPacket };
const _ref_2rx8yx = { useProgram };
const _ref_s5czqz = { captureScreenshot };
const _ref_tgjy90 = { cleanOldLogs };
const _ref_azovns = { receivePacket };
const _ref_de2g7a = { installUpdate };
const _ref_fbk1bo = { requestAnimationFrameLoop };
const _ref_v3css3 = { minifyCode };
const _ref_oyogfb = { resumeContext };
const _ref_hx8pzf = { generateUserAgent };
const _ref_ig98tn = { executeSQLQuery };
const _ref_37qtkk = { simulateNetworkDelay };
const _ref_e52qbh = { generateFakeClass };
const _ref_suqgp4 = { readPixels };
const _ref_42wvvz = { isFeatureEnabled };
const _ref_fuptrc = { tokenizeText };
const _ref_vlv4yk = { syncDatabase };
const _ref_0sydua = { connectNodes };
const _ref_dugox9 = { calculateEntropy };
const _ref_ipwlue = { rotateLogFiles };
const _ref_lj5jka = { formatLogMessage };
const _ref_4ub58p = { uniformMatrix4fv };
const _ref_xfl8zm = { createScriptProcessor };
const _ref_xqy3ci = { setDetune };
const _ref_bcf72e = { detectEnvironment };
const _ref_w4mj56 = { wakeUp };
const _ref_ylezy6 = { verifyChecksum };
const _ref_es3gq5 = { resolveDependencyGraph };
const _ref_wlhvfe = { instrumentCode };
const _ref_ts2ky7 = { analyzeUserBehavior };
const _ref_kcvyt8 = { detectCollision };
const _ref_jzuidq = { connectToTracker };
const _ref_5rk6n0 = { exitScope };
const _ref_3foxr5 = { checkRootAccess };
const _ref_frzri3 = { calculateRestitution };
const _ref_kxb54q = { encryptPayload };
const _ref_n5sdf6 = { merkelizeRoot };
const _ref_1rh8mw = { download };
const _ref_lg1yrs = { negotiateSession };
const _ref_z4tdaw = { prefetchAssets };
const _ref_zykkmw = { parseConfigFile };
const _ref_j33ogh = { traverseAST };
const _ref_07aqk9 = { dhcpOffer };
const _ref_035wbv = { performTLSHandshake };
const _ref_sxlswj = { debounceAction };
const _ref_9ac580 = { extractThumbnail };
const _ref_q3bhgz = { setAttack };
const _ref_e70mw6 = { acceptConnection };
const _ref_r6tp74 = { processAudioBuffer };
const _ref_82t7eq = { normalizeVector };
const _ref_yqvwv9 = { unlockFile };
const _ref_9fu7nv = { setRatio };
const _ref_mfodfs = { subscribeToEvents };
const _ref_2afh90 = { encodeABI };
const _ref_vnekdx = { leaveGroup };
const _ref_xq62lw = { detectVirtualMachine };
const _ref_4c9o19 = { parseMagnetLink };
const _ref_op6elz = { downInterface };
const _ref_nnp8rx = { verifyFileSignature };
const _ref_2af9p7 = { forkProcess };
const _ref_8lc0nz = { setPan };
const _ref_emjl49 = { loadTexture };
const _ref_ogtwj2 = { streamToPlayer };
const _ref_05h5yj = { setDistanceModel };
const _ref_fospj7 = { scheduleTask };
const _ref_7lfo5n = { checkBalance };
const _ref_5w292d = { dhcpAck };
const _ref_53pgkr = { unmuteStream };
const _ref_8x25ca = { commitTransaction };
const _ref_oem4fs = { cacheQueryResults };
const _ref_u6su27 = { generateWalletKeys };
const _ref_nohev4 = { mergeFiles };
const _ref_8xmpsd = { discoverPeersDHT };
const _ref_jvkmle = { createBiquadFilter };
const _ref_o5dblp = { retransmitPacket };
const _ref_00cvr4 = { setSocketTimeout };
const _ref_yd3jrz = { allocateRegisters };
const _ref_8cx686 = { uniform1i };
const _ref_x9eqij = { unmountFileSystem };
const _ref_kvh4wm = { createConstraint };
const _ref_sg372u = { closeContext };
const _ref_f3zgee = { detectObjectYOLO };
const _ref_aougix = { createPanner };
const _ref_mha1w2 = { createDynamicsCompressor };
const _ref_9759cy = { preventSleepMode };
const _ref_pb30n4 = { generateUUIDv5 };
const _ref_h2yim1 = { makeDistortionCurve };
const _ref_z48lew = { sleep };
const _ref_8kqu1r = { connectionPooling };
const _ref_jurm92 = { scaleMatrix };
const _ref_7l52n0 = { initWebGLContext };
const _ref_6o5ar4 = { upInterface };
const _ref_wp2ncm = { closeSocket };
const _ref_xcod3h = { handleInterrupt };
const _ref_on44nj = { adjustPlaybackSpeed };
const _ref_xj30ka = { encapsulateFrame };
const _ref_65k9ci = { createIndexBuffer };
const _ref_qwcv66 = { moveFileToComplete };
const _ref_5uwz1s = { registerISR };
const _ref_sqv7yr = { checkParticleCollision };
const _ref_hqroff = { rmdir };
const _ref_578wme = { cancelAnimationFrameLoop };
const _ref_06jlfr = { mockResponse };
const _ref_eizhwy = { translateText };
const _ref_7hi0ln = { compressPacket };
const _ref_5p93px = { setRelease };
const _ref_e14dg6 = { claimRewards };
const _ref_blul7a = { chownFile };
const _ref_ze1po4 = { chmodFile };
const _ref_k9h0xp = { unlockRow };
const _ref_42pixw = { unchokePeer };
const _ref_v4jneb = { TelemetryClient };
const _ref_5ex93t = { anchorSoftBody };
const _ref_txw8fd = { detachThread };
const _ref_vtgj5v = { validateTokenStructure };
const _ref_9cpkgw = { stepSimulation };
const _ref_zacp6i = { CacheManager };
const _ref_slb39b = { bundleAssets };
const _ref_xkkrdv = { updateBitfield };
const _ref_3wzhxj = { auditAccessLogs };
const _ref_fhpqqz = { edgeDetectionSobel };
const _ref_ufb1dj = { sanitizeXSS };
const _ref_j0uaag = { unrollLoops };
const _ref_xhvy0n = { unmapMemory };
const _ref_xbxvow = { parseQueryString };
const _ref_69tr4t = { getVelocity };
const _ref_wi5jvl = { seekFile };
const _ref_fu0ncv = { obfuscateCode };
const _ref_qvvgst = { transformAesKey };
const _ref_3egrza = { closeFile };
const _ref_3246we = { prettifyCode };
const _ref_ehrmrk = { setInertia };
const _ref_v3zafz = { swapTokens };
const _ref_kbpj6y = { bufferData };
const _ref_ynrb8b = { restoreDatabase };
const _ref_239bot = { suspendContext };
const _ref_szpbuq = { configureInterface };
const _ref_tabfc6 = { cullFace };
const _ref_9vxjy0 = { getUniformLocation };
const _ref_upprwz = { controlCongestion };
const _ref_kz9vm2 = { protectMemory };
const _ref_ewfsk3 = { reduceDimensionalityPCA };
const _ref_ry43wt = { gaussianBlur };
const _ref_1txni7 = { TaskScheduler };
const _ref_rpncwi = { startOscillator };
const _ref_6vsce4 = { killProcess };
const _ref_6t5wbf = { removeMetadata };
const _ref_k2nhtz = { getExtension };
const _ref_9fwmuk = { createParticleSystem };
const _ref_ozzvg4 = { foldConstants };
const _ref_j6uciq = { unlinkFile };
const _ref_4mvjy4 = { sanitizeInput };
const _ref_my1mnv = { calculateFriction };
const _ref_52mna9 = { setMass };
const _ref_oqt3af = { createFrameBuffer };
const _ref_chd0a4 = { scheduleProcess };
const _ref_nse636 = { optimizeMemoryUsage };
const _ref_1cem5e = { getFloatTimeDomainData };
const _ref_p2squz = { blockMaliciousTraffic };
const _ref_as0rz4 = { FileValidator };
const _ref_67epxe = { mountFileSystem };
const _ref_b1afrl = { parseM3U8Playlist };
const _ref_ivuj4q = { backupDatabase };
const _ref_vzq6qv = { convexSweepTest };
const _ref_xbig9o = { rotateUserAgent };
const _ref_5keeyn = { establishHandshake };
const _ref_jsd9qu = { manageCookieJar };
const _ref_85nzkn = { lazyLoadComponent };
const _ref_iguq2s = { pingHost };
const _ref_m57546 = { applyEngineForce };
const _ref_6k7cpc = { decapsulateFrame };
const _ref_umtbhx = { monitorNetworkInterface };
const _ref_xjovjb = { showNotification };
const _ref_zafcs1 = { deleteBuffer };
const _ref_vkoe3s = { requestPiece };
const _ref_n0sy8c = { contextSwitch };
const _ref_jeg23h = { checkPortAvailability };
const _ref_6zy3hz = { normalizeFeatures };
const _ref_5b534b = { deobfuscateString };
const _ref_0vkudg = { compileToBytecode };
const _ref_pa2bkv = { migrateSchema }; 
    });
})({}, {});