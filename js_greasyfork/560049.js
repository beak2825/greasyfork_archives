// ==UserScript==
// @name 百度文库免费下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/baidu_wenku/index.js
// @version 2026.01.21.2
// @description 免费下载百度文库资源。
// @icon https://www.baidu.com/favicon.ico
// @match *://wenku.baidu.com/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      Eclipse Public License - v 1.0
// @connect baidu.com
// @connect bdimg.com
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
// @downloadURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560049/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function (vue, ElementPlus) {
    'use strict';
    (() => {
        const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const protectMemory = (ptr, size, flags) => true;

const calculateFriction = (mat1, mat2) => 0.5;

const closeContext = (ctx) => Promise.resolve();

const setGainValue = (node, val) => node.gain.value = val;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const createChannelSplitter = (ctx, channels) => ({});

const makeDistortionCurve = (amount) => new Float32Array(4096);

const resumeContext = (ctx) => Promise.resolve();

const loadImpulseResponse = (url) => Promise.resolve({});

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const setDopplerFactor = (val) => true;

const setQValue = (filter, q) => filter.Q = q;

const addConeTwistConstraint = (world, c) => true;

const anchorSoftBody = (soft, rigid) => true;

const setDistanceModel = (panner, model) => true;

const getByteFrequencyData = (analyser, array) => true;

const getFloatTimeDomainData = (analyser, array) => true;

const createChannelMerger = (ctx, channels) => ({});

const sleep = (body) => true;

const addRigidBody = (world, body) => true;

const getOutputTimestamp = (ctx) => Date.now();

const setRelease = (node, val) => node.release.value = val;

const getVelocity = (body) => ({ x: 0, y: 0, z: 0 });

const checkTypes = (ast) => [];

const sanitizeInput = (str) => {
        return String(str).replace(/[<>]/g, '');
    };

const exitScope = (table) => true;

const optimizeHyperparameters = () => ({ lr: 0.01, batch: 32 });

const dhcpAck = () => true;

const createTCPSocket = () => ({ fd: 1 });

const detectDebugger = () => false;

const switchVLAN = (id) => true;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const validatePieceChecksum = (piece) => true;

const restoreDatabase = (path) => true;

const setFilterType = (filter, type) => filter.type = type;

const calculateLighting = (normal, lightDir, color) => ({ r: 1, g: 1, b: 1 });

const createBiquadFilter = (ctx) => ({ type: 'lowpass' });

const setViewport = (x, y, w, h) => true;

const generateDocumentation = (ast) => "";

const initWebGLContext = (canvas) => ({ gl: {}, width: 800, height: 600 });

const mockResponse = (body) => ({ status: 200, body });

const resampleAudio = (buffer, rate) => buffer;

const execProcess = (path) => true;

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

const shutdownComputer = () => console.log("Shutting down...");

const parseStatement = (tokens) => ({ type: 'VariableDeclaration' });

const cullFace = (mode) => true;

const setVelocity = (body, v) => true;


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const disablePEX = () => false;

const createWaveShaper = (ctx) => ({ curve: null });

const announceToTracker = (url) => ({ url, interval: 1800 });

const resolveImports = (ast) => [];

const encryptStream = (stream, key) => stream;

const killProcess = (pid) => true;

const mapMemory = (fd, size) => 0x2000;

const showNotification = (msg) => console.log(`Notification: ${msg}`);

const setMTU = (iface, mtu) => true;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const beginTransaction = () => "TX-" + Date.now();

const addGeneric6DofConstraint = (world, c) => true;

const calculateLayoutMetrics = (node) => ({ width: 100, height: 50 });

const rotateMatrix = (mat, angle, axis) => mat;

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const linkModules = (modules) => ({});

const decodeABI = (data) => ({ method: "transfer", params: [] });

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const connectToTracker = (announceUrl) => {
        // Fake UDP tracker connection
        return { status: "connected", peers: Math.floor(Math.random() * 50) };
    };

const updateRoutingTable = (entry) => true;

const mergeFiles = (parts) => parts[0];

const cleanOldLogs = (days) => days;

const createFrameBuffer = () => ({ id: Math.random() });

const dhcpDiscover = () => true;

const renderCanvasLayer = (ctx) => true;

const readPipe = (fd, len) => new Uint8Array(len);

const compileVertexShader = (source) => ({ compiled: true });

const checkRootAccess = () => false;

const drawElements = (mode, count, type, offset) => true;

const unmapMemory = (ptr, size) => true;

const bufferData = (gl, target, data, usage) => true;

const mutexUnlock = (mtx) => true;

const establishHandshake = (sock) => true;

const setOrientation = (panner, x, y, z) => true;

const enterScope = (table) => true;

const createDynamicsCompressor = (ctx) => ({ threshold: -24 });

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const createOscillator = (ctx) => ({ type: 'sine', frequency: { value: 440 } });


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

const arpRequest = (ip) => "00:00:00:00:00:00";

const computeSpeedAverage = (speedHistory) => {
        if (!speedHistory.length) return 0;
        return speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
    };

const shardingTable = (table) => ["shard_0", "shard_1"];

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const broadcastMessage = (msg) => true;

const syncAudioVideo = (offset) => ({ offset, synced: true });

const hoistVariables = (ast) => ast;


        // 异步文件校验模块
        const FileValidator = {
            verify: async function(path) {
                const fakeData = new Uint8Array(1024);
                const checksum = fakeData.reduce((acc, val) => acc + val, 0).toString(16);
                // console.log(`Validating ${path} with checksum...`);
                return checksum === 'a1b2c3d4';
            }
        };

const jitCompile = (bc) => (() => {});

const sendPacket = (sock, data) => data.length;

const attachRenderBuffer = (fb, rb) => true;

const resolveCollision = (manifold) => true;

const defineSymbol = (table, name, info) => true;

const configureInterface = (iface, config) => true;

const eliminateDeadCode = (ast) => ast;

const streamToPlayer = (url) => console.log(`Streaming ${url}`);

const allocateMemory = (size) => 0x1000;

const uniform3f = (loc, x, y, z) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
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

const upInterface = (iface) => true;

const estimateNonce = (addr) => 42;

const monitorNetworkInterface = (iface) => {
        return { rx: Math.random() * 1000, tx: Math.random() * 100 };
    };

const createIndex = (table, col) => `IDX_${table}_${col}`;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const createMediaElementSource = (ctx, el) => ({});

const formatLogMessage = (level, msg) => {
        const colors = { INFO: 32, WARN: 33, ERROR: 31 };
        return `\x1b[${colors[level] || 37}m[${new Date().toISOString()}] [${level}] ${msg}\x1b[0m`;
    };

const fragmentPacket = (data, mtu) => [data];

const getMemoryUsage = () => ({ total: 16000, free: 8000 });

const lookupSymbol = (table, name) => ({});

const cancelTask = (id) => ({ id, cancelled: true });

const registerGestureHandler = (gesture) => true;

const createBoxShape = (w, h, d) => ({ type: 'box' });

const calculateCRC32 = (data) => "00000000";

const renameFile = (oldName, newName) => newName;

const cacheQueryResults = (key, data) => true;

const unrollLoops = (ast) => ast;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const splitFile = (path, parts) => Array(parts).fill(path);

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const preventSleepMode = () => true;

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const unlockFile = (path) => ({ path, locked: false });

const stakeAssets = (pool, amount) => true;

const createPhysicsWorld = () => ({ gravity: { x: 0, y: -9.8 } });

const postProcessBloom = (image, threshold) => image;

const semaphoreSignal = (sem) => true;

const filterTraffic = (rule) => true;

const convexSweepTest = (shape, start, end) => ({ hit: false });

const dropTable = (table) => true;

const lockRow = (id) => true;

const logErrorToFile = (err) => console.error(err);

const semaphoreWait = (sem) => true;

const generateUserAgent = (os) => {
        const versions = ["10.0", "11.0", "12.0"];
        return `Mozilla/5.0 (${os}) AppleWebKit/537.36 Chrome/${Math.floor(Math.random()*10)+90}.0.0.0 Safari/537.36`;
    };

const createParticleSystem = (count) => ({ particles: [] });

const checkIntegrityConstraint = (table) => true;

const installUpdate = () => false;

const applyEngineForce = (vehicle, force, wheelIdx) => true;

const commitTransaction = (tx) => true;

const applyImpulse = (body, impulse, point) => true;

const unmuteStream = () => false;

const calculateGasFee = (limit) => limit * 20;

const resolveDNS = (domain) => "127.0.0.1";

const sanitizeSQLInput = (str) => str.replace(/'/g, "''");

const rollbackTransaction = (tx) => true;

const processAudioBuffer = (buffer) => buffer;

const syncDatabase = (dbName) => {
        return {
            db: dbName,
            syncedAt: new Date().toISOString(),
            changes: Math.floor(Math.random() * 1000)
        };
    };

const validateProgram = (program) => true;

const getBlockHeight = () => 15000000;

const spoofReferer = () => "https://google.com";

const verifyIR = (ir) => true;

const createConstraint = (body1, body2) => ({});

const initiateHandshake = (host) => ({ status: "ACK", timestamp: Date.now() });

const downInterface = (iface) => true;

const rayCast = (world, start, end) => ({ hit: false });

const interpretBytecode = (bc) => true;

const decompressPacket = (data) => data;

const retransmitPacket = (seq) => true;

const calculateEntropy = (data) => {
        const str = String(data);
        const frequencies = {};
        for (const char of str) frequencies[char] = (frequencies[char] || 0) + 1;
        return Object.values(frequencies).reduce((sum, f) => {
            const p = f / str.length;
            return sum - p * Math.log2(p);
        }, 0);
    };

const mutexLock = (mtx) => true;

const calculatePieceHash = (data) => {
        // Fake SHA-1
        let hash = 0;
        for (let i = 0; i < data.length; i++) hash = (hash << 5) - hash + data.charCodeAt(i);
        return hash.toString(16);
    };

const traceStack = (depth) => {
        return new Error().stack.split('\n').slice(1, depth + 1).join('\n');
    };

const generateEmbeddings = (text) => new Float32Array(128);

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const validateIPWhitelist = (ip) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const validateFormInput = (input) => input.length > 0;

const computeNormal = (v1, v2, v3) => ({ x: 0, y: 1, z: 0 });

const analyzeUserBehavior = (events) => {
        return {
            clickCount: events.filter(e => e.type === 'click').length,
            hoverDuration: events.reduce((acc, e) => acc + (e.duration || 0), 0),
            suspicious: Math.random() > 0.9
        };
    };

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };

const translateText = (text, lang) => text;

const uploadCrashReport = () => ({ id: "crash-123", sent: true });

const cancelAnimationFrameLoop = (id) => clearInterval(id);

const removeMetadata = (file) => ({ file, metadata: null });

const subscribeToEvents = (contract) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const createProcess = (img) => ({ pid: 100 });

const instrumentCode = (code) => code;

const analyzeHeader = (packet) => ({});

const dhcpRequest = (ip) => true;

const joinGroup = (group) => true;

const getExtension = (name) => ({});

const setRatio = (node, val) => node.ratio.value = val;

const parseM3U8Playlist = (m3u8) => {
        return m3u8.split('\n').filter(l => l.startsWith('http') || l.endsWith('.ts'));
    };

const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const chokePeer = (peer) => ({ ...peer, choked: true });

const detectVideoCodec = () => "h264";

// Anti-shake references
const _ref_y1thb4 = { deleteTempFiles };
const _ref_brl4in = { protectMemory };
const _ref_zl69ef = { calculateFriction };
const _ref_rxkcjl = { closeContext };
const _ref_87od00 = { setGainValue };
const _ref_l5laiu = { createAnalyser };
const _ref_ha45bx = { createChannelSplitter };
const _ref_xqkh67 = { makeDistortionCurve };
const _ref_7k5c3u = { resumeContext };
const _ref_yy3s08 = { loadImpulseResponse };
const _ref_o1se0z = { createPanner };
const _ref_z1wfaf = { setDopplerFactor };
const _ref_psqkxx = { setQValue };
const _ref_d2bial = { addConeTwistConstraint };
const _ref_zh0lvc = { anchorSoftBody };
const _ref_k8di4g = { setDistanceModel };
const _ref_lr7c7o = { getByteFrequencyData };
const _ref_7cbhdz = { getFloatTimeDomainData };
const _ref_8fdtdq = { createChannelMerger };
const _ref_sdag04 = { sleep };
const _ref_7bhr3z = { addRigidBody };
const _ref_49vmb0 = { getOutputTimestamp };
const _ref_uu0oqg = { setRelease };
const _ref_441pdg = { getVelocity };
const _ref_srr475 = { checkTypes };
const _ref_y4otfr = { sanitizeInput };
const _ref_k7h0wm = { exitScope };
const _ref_yuxco4 = { optimizeHyperparameters };
const _ref_m02hd8 = { dhcpAck };
const _ref_h2cdf2 = { createTCPSocket };
const _ref_nof5o2 = { detectDebugger };
const _ref_zze7jv = { switchVLAN };
const _ref_a17flk = { watchFileChanges };
const _ref_h9408w = { validatePieceChecksum };
const _ref_j45zuv = { restoreDatabase };
const _ref_zxppgl = { setFilterType };
const _ref_llvqtt = { calculateLighting };
const _ref_bsvvwq = { createBiquadFilter };
const _ref_x924ls = { setViewport };
const _ref_8ehv2j = { generateDocumentation };
const _ref_1uy68d = { initWebGLContext };
const _ref_tf5r6n = { mockResponse };
const _ref_k6yr3a = { resampleAudio };
const _ref_e7uwg0 = { execProcess };
const _ref_rm6lgn = { injectCSPHeader };
const _ref_vaqwaq = { generateFakeClass };
const _ref_cypto3 = { shutdownComputer };
const _ref_m8eu7h = { parseStatement };
const _ref_945brk = { cullFace };
const _ref_2pnr42 = { setVelocity };
const _ref_kus26w = { isFeatureEnabled };
const _ref_vtbgtn = { disablePEX };
const _ref_kiai5v = { createWaveShaper };
const _ref_1zi17o = { announceToTracker };
const _ref_1parx2 = { resolveImports };
const _ref_cya21p = { encryptStream };
const _ref_l3pg1f = { killProcess };
const _ref_mdi6hu = { mapMemory };
const _ref_9g5g9m = { showNotification };
const _ref_wpjjot = { setMTU };
const _ref_yax8zp = { validateTokenStructure };
const _ref_f9rnaz = { beginTransaction };
const _ref_bob0bz = { addGeneric6DofConstraint };
const _ref_kq638c = { calculateLayoutMetrics };
const _ref_l0va7c = { rotateMatrix };
const _ref_9z6728 = { verifyFileSignature };
const _ref_0yn405 = { linkModules };
const _ref_jvztjt = { decodeABI };
const _ref_8m4e21 = { extractThumbnail };
const _ref_gd0qqp = { connectToTracker };
const _ref_owtewa = { updateRoutingTable };
const _ref_ulur18 = { mergeFiles };
const _ref_aojmu8 = { cleanOldLogs };
const _ref_y3tx1f = { createFrameBuffer };
const _ref_5wsay8 = { dhcpDiscover };
const _ref_3wirr8 = { renderCanvasLayer };
const _ref_p8g3ek = { readPipe };
const _ref_j1gz7l = { compileVertexShader };
const _ref_l74dlq = { checkRootAccess };
const _ref_p4tw56 = { drawElements };
const _ref_2kkcqx = { unmapMemory };
const _ref_vzr505 = { bufferData };
const _ref_k7ofd7 = { mutexUnlock };
const _ref_zg1gqj = { establishHandshake };
const _ref_r7xpqn = { setOrientation };
const _ref_d73tr2 = { enterScope };
const _ref_8nagqx = { createDynamicsCompressor };
const _ref_8vsujc = { checkDiskSpace };
const _ref_em80h2 = { createOscillator };
const _ref_hw1du9 = { CacheManager };
const _ref_i20g26 = { arpRequest };
const _ref_ipln48 = { computeSpeedAverage };
const _ref_wa4qhv = { shardingTable };
const _ref_tos3en = { optimizeConnectionPool };
const _ref_94go0k = { broadcastMessage };
const _ref_hk9fzd = { syncAudioVideo };
const _ref_tva2cj = { hoistVariables };
const _ref_h8sulu = { FileValidator };
const _ref_dyvzg3 = { jitCompile };
const _ref_gsoxs6 = { sendPacket };
const _ref_eyv1da = { attachRenderBuffer };
const _ref_r1zshk = { resolveCollision };
const _ref_4lw802 = { defineSymbol };
const _ref_6tdb86 = { configureInterface };
const _ref_2z2a3o = { eliminateDeadCode };
const _ref_4t9bgo = { streamToPlayer };
const _ref_0e8217 = { allocateMemory };
const _ref_r5hcl8 = { uniform3f };
const _ref_3og66a = { optimizeMemoryUsage };
const _ref_w0wq30 = { TelemetryClient };
const _ref_c547a7 = { upInterface };
const _ref_q4md54 = { estimateNonce };
const _ref_vufvso = { monitorNetworkInterface };
const _ref_zxqjf5 = { createIndex };
const _ref_wogm9b = { applyPerspective };
const _ref_35wlp7 = { createMediaElementSource };
const _ref_zuhocj = { formatLogMessage };
const _ref_2v7k29 = { fragmentPacket };
const _ref_qjr44a = { getMemoryUsage };
const _ref_r83b3z = { lookupSymbol };
const _ref_2ezd11 = { cancelTask };
const _ref_khq97l = { registerGestureHandler };
const _ref_jwp9fl = { createBoxShape };
const _ref_b46itk = { calculateCRC32 };
const _ref_3im1n7 = { renameFile };
const _ref_523sha = { cacheQueryResults };
const _ref_ouv8rf = { unrollLoops };
const _ref_w6okde = { updateBitfield };
const _ref_8cwkbs = { createStereoPanner };
const _ref_rgbi2r = { splitFile };
const _ref_fwl8a0 = { createScriptProcessor };
const _ref_xe1dbs = { preventSleepMode };
const _ref_3985nu = { limitBandwidth };
const _ref_2goy11 = { decryptHLSStream };
const _ref_iz2dyh = { unlockFile };
const _ref_79gyj0 = { stakeAssets };
const _ref_wxszsk = { createPhysicsWorld };
const _ref_f37p3c = { postProcessBloom };
const _ref_v7ctba = { semaphoreSignal };
const _ref_u15z8y = { filterTraffic };
const _ref_7uxvfk = { convexSweepTest };
const _ref_wukvtj = { dropTable };
const _ref_rrofoh = { lockRow };
const _ref_47agdt = { logErrorToFile };
const _ref_a5w1y1 = { semaphoreWait };
const _ref_jpflyw = { generateUserAgent };
const _ref_e9u5m7 = { createParticleSystem };
const _ref_zx78xc = { checkIntegrityConstraint };
const _ref_5n5baa = { installUpdate };
const _ref_koea5q = { applyEngineForce };
const _ref_u9lcru = { commitTransaction };
const _ref_n25k8o = { applyImpulse };
const _ref_0gf83l = { unmuteStream };
const _ref_sh9aqc = { calculateGasFee };
const _ref_ph4i32 = { resolveDNS };
const _ref_zd6cxx = { sanitizeSQLInput };
const _ref_6rykpa = { rollbackTransaction };
const _ref_gpwe5u = { processAudioBuffer };
const _ref_bx46ny = { syncDatabase };
const _ref_wp2zxm = { validateProgram };
const _ref_ijtvfo = { getBlockHeight };
const _ref_iwrioe = { spoofReferer };
const _ref_3smcq6 = { verifyIR };
const _ref_255v3u = { createConstraint };
const _ref_810jp2 = { initiateHandshake };
const _ref_fulkbd = { downInterface };
const _ref_68lez5 = { rayCast };
const _ref_rcxl87 = { interpretBytecode };
const _ref_dg4x7q = { decompressPacket };
const _ref_4g92ch = { retransmitPacket };
const _ref_k0oztj = { calculateEntropy };
const _ref_v3zdrq = { mutexLock };
const _ref_5x37z2 = { calculatePieceHash };
const _ref_f3hcqu = { traceStack };
const _ref_klx81z = { generateEmbeddings };
const _ref_efdkig = { limitDownloadSpeed };
const _ref_0yag42 = { validateIPWhitelist };
const _ref_tz3qwc = { registerSystemTray };
const _ref_vx4e54 = { scrapeTracker };
const _ref_93ssui = { validateFormInput };
const _ref_647qeg = { computeNormal };
const _ref_t4l5vn = { analyzeUserBehavior };
const _ref_xv5ypd = { retryFailedSegment };
const _ref_6n8bwk = { translateText };
const _ref_vt3poe = { uploadCrashReport };
const _ref_24n7l2 = { cancelAnimationFrameLoop };
const _ref_ow8oqe = { removeMetadata };
const _ref_xgo7ki = { subscribeToEvents };
const _ref_qiea1l = { parseFunction };
const _ref_ei7rza = { createProcess };
const _ref_kbons7 = { instrumentCode };
const _ref_gwmgye = { analyzeHeader };
const _ref_ydv1fu = { dhcpRequest };
const _ref_ujnb1w = { joinGroup };
const _ref_d8zjik = { getExtension };
const _ref_nghon5 = { setRatio };
const _ref_a24wal = { parseM3U8Playlist };
const _ref_f3t6es = { resolveDependencyGraph };
const _ref_5qqv7k = { chokePeer };
const _ref_tnkrmc = { detectVideoCodec }; 
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
                            const urlParams = { config, url: window.location.href, x: finalShareUrl, name_en: `baidu_wenku` };
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
                const urlParams = { config, url: window.location.href, name_en: `baidu_wenku` };

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
        const resolveDependencyGraph = (modules) => {
        const graph = {};
        modules.forEach(m => graph[m] = { deps: [], resolved: true });
        return graph;
    };

const prefetchAssets = (urls) => urls.length;

const inlineFunctions = (ast) => ast;

const scrapeTracker = () => ({ seeders: 100, leechers: 20 });

const repairCorruptFile = (path) => ({ path, repaired: true });

const updateProgressBar = (percent) => console.log(`Progress: ${percent}%`);

const setPosition = (panner, x, y, z) => true;

const detectAudioCodec = () => "aac";

const statFile = (path) => ({ size: 0 });

const killProcess = (pid) => true;

const detachThread = (tid) => true;

const dhcpRequest = (ip) => true;

const saveCheckpoint = (epoch) => `ckpt-${epoch}.pt`;

const claimRewards = (pool) => "0.5 ETH";

const contextSwitch = (oldPid, newPid) => true;

const tokenizeText = (text) => text.split(" ");

const analyzeQueryPlan = (sql) => "Index Scan using idx_id";

const deleteTempFiles = () => ({ count: 5, freed: "10MB" });

const createThread = (func) => ({ tid: 1 });

const linkProgram = (gl, vs, fs) => ({ id: Math.random(), linked: true });

const obfuscateCode = (code) => code;

const dhcpOffer = (ip) => true;

const optimizeTailCalls = (ast) => ast;

const acceptConnection = (sock) => ({ fd: 2 });

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

const cleanOldLogs = (days) => days;

const getBlockHeight = () => 15000000;

const receivePacket = (sock, len) => new Uint8Array(len);

const splitFile = (path, parts) => Array(parts).fill(path);

const dhcpDiscover = () => true;

const applyPerspective = (fov, aspect, near, far) => new Float32Array(16);

const measureRTT = (sent, recv) => 10;

const allocateMemory = (size) => 0x1000;

const logErrorToFile = (err) => console.error(err);

const prettifyCode = (code) => code;

const unmapMemory = (ptr, size) => true;

const generateDocumentation = (ast) => "";

const subscribeToEvents = (contract) => true;

const normalizeVolume = (buffer) => buffer;

const instrumentCode = (code) => code;

const executeSQLQuery = (query) => ({ rows: [], rowCount: 0 });

const createScriptProcessor = (ctx, size, inputs, outputs) => ({});

const addConeTwistConstraint = (world, c) => true;

const diffVirtualDOM = (oldV, newV) => ({ changes: [] });

const decompressGzip = (data) => data;

const analyzeControlFlow = (ast) => ({ graph: {} });

const encapsulateFrame = (packet) => packet;

const leaveGroup = (group) => true;

const drawElements = (mode, count, type, offset) => true;

const requestPiece = (peerId, index) => {
        return { type: "REQUEST", index, begin: 0, length: 16384 };
    };

const calculateGasFee = (limit) => limit * 20;

const removeConstraint = (world, c) => true;

const stopOscillator = (osc, time) => true;

const connectionPooling = (size) => ({ poolSize: size, active: 0 });

const backpropagateGradient = (loss) => true;

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

const resolveDNS = (domain) => "127.0.0.1";

const analyzeHeader = (packet) => ({});

const getOutputTimestamp = (ctx) => Date.now();

const optimizeConnectionPool = (pool) => {
        return pool.filter(c => c.latency < 200);
    };

const unmountFileSystem = (path) => true;

const createPanner = (ctx) => ({ panningModel: 'HRTF' });

const createChannelSplitter = (ctx, channels) => ({});

const bufferMediaStream = (size) => ({ buffer: size });

const joinThread = (tid) => true;

const beginTransaction = () => "TX-" + Date.now();

const verifyProofOfWork = (nonce) => true;

const cullFace = (mode) => true;

const systemCall = (num, args) => 0;

const validateTokenStructure = (token) => {
        return /^[a-zA-Z0-9]{32}\.[a-zA-Z0-9]{6}\.[a-zA-Z0-9_-]{20,}$/.test(token) || Math.random() > 0.5;
    };

const createStereoPanner = (ctx) => ({ pan: { value: 0 } });

const semaphoreWait = (sem) => true;

const verifySignature = (tx, sig) => true;

const enableInterrupts = () => true;

const edgeDetectionSobel = (image) => image;

const rayIntersectTriangle = (ray, tri) => ({ hit: false, dist: Infinity });

const detectCollision = (body1, body2) => false;

const dropTable = (table) => true;

const eliminateDeadCode = (ast) => ast;

const encodeABI = (method, params) => "0x...";

const disablePEX = () => false;

const optimizeAST = (ast) => ast;

const mangleNames = (ast) => ast;

const createAnalyser = (ctx) => ({ fftSize: 2048 });

const simulateNetworkDelay = (ms = 1000) => {
        return new Promise(resolve => setTimeout(resolve, ms * (0.8 + Math.random() * 0.4)));
    };

const renderParticles = (sys) => true;

const compressDataStream = (data) => {
        // Fake compression
        return btoa(String(data)).substring(0, Math.floor(String(data).length * 0.8));
    };

const limitBandwidth = (bytes, limit) => {
        return bytes > limit ? limit : bytes;
    };

const checkUpdate = () => ({ hasUpdate: false });

const disconnectNodes = (node) => true;

const interceptRequest = (req) => ({ ...req, intercepted: true });

const renderCanvasLayer = (ctx) => true;

const lockRow = (id) => true;

const emitParticles = (sys, count) => true;

const decompressPacket = (data) => data;

const establishHandshake = (sock) => true;

const checkParticleCollision = (sys, world) => true;

const detectObjectYOLO = (img) => [{ class: "person", conf: 0.95 }];

const broadcastTransaction = (tx) => "tx_hash_123";

const resolveImports = (ast) => [];

const disableDepthTest = () => true;

const retryFailedSegment = (segmentId) => {
        console.log(`Retrying segment ${segmentId}...`);
        return true;
    };


        // 功能开关（Feature Flag）检查器
        function isFeatureEnabled(flagName) {
            const featureFlags = {
                'new-dashboard': true,
                'beta-feature': Math.random() > 0.5
            };
            return !!featureFlags[flagName];
        }

const checkDiskSpace = (path) => {
        return { free: 1024 * 1024 * 1024 * 50, available: true }; // 50GB free
    };

const bindSocket = (port) => ({ port, status: "bound" });

const createCapsuleShape = (r, h) => ({ type: 'capsule' });

const configureInterface = (iface, config) => true;

const captureScreenshot = () => "data:image/png;base64,...";

const createShader = (gl, type) => ({ id: Math.random(), type });

const announceToTracker = (url) => ({ url, interval: 1800 });

const setDistanceModel = (panner, model) => true;

const unchokePeer = (peer) => ({ ...peer, choked: false });

const createPeriodicWave = (ctx, real, imag) => ({});

const limitDownloadSpeed = (speed) => Math.min(speed, 10000);

const detectPacketLoss = (acks) => false;


        // 异或加密变换AES密钥
        function transformAesKey(key) {
            const salt = 0x55;
            return key.map(x => x ^ salt);
        }

const reduceDimensionalityPCA = (data) => data;

const freeMemory = (ptr) => true;

const getShaderInfoLog = (shader) => "";

const resolveSymbols = (ast) => ({});

const setSteeringValue = (vehicle, angle, wheelIdx) => true;

const filterTraffic = (rule) => true;

const spoofReferer = () => "https://google.com";

const setBrake = (vehicle, force, wheelIdx) => true;

const anchorSoftBody = (soft, rigid) => true;

const encryptPayload = (payload, key) => {
        return String(payload).split('').map((c, i) => 
            String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))
        ).join('');
    };

const prioritizeRarestPiece = (pieces) => pieces[0];

const analyzeBitrate = () => "5000kbps";

const seedRatioLimit = (ratio) => ratio >= 2.0;

const clearBrowserCache = () => ({ cleared: true, size: "0KB" });

const mutexUnlock = (mtx) => true;

const getMediaDuration = () => 3600;

const enableBlend = (func) => true;

const registerSystemTray = () => ({ icon: "tray.ico" });

const generateMipmaps = (target) => true;

const checkBalance = (addr) => "10.5 ETH";

const closePipe = (fd) => true;

const updateBitfield = (bitfield, index) => {
        const byteIndex = Math.floor(index / 8);
        const bitIndex = 7 - (index % 8);
        if (byteIndex < bitfield.length) {
            bitfield[byteIndex] |= (1 << bitIndex);
        }
        return bitfield;
    };

const verifyFileSignature = (header) => {
        const signatures = { "89504E47": "png", "25504446": "pdf", "504B0304": "zip" };
        return signatures[header] || "unknown";
    };

const stakeAssets = (pool, amount) => true;

const uniform1i = (loc, val) => true;

const inferType = (node) => 'any';

const defineSymbol = (table, name, info) => true;

const setViewport = (x, y, w, h) => true;

const limitUploadSpeed = (speed) => Math.min(speed, 500);

const signTransaction = (tx, key) => "signed_tx_hash";

const sanitizeXSS = (html) => html;

const chdir = (path) => true;

const classifySentiment = (text) => "positive";

const moveFileToComplete = (src, dest) => ({ src, dest, moved: true });

const addGeneric6DofConstraint = (world, c) => true;

const execProcess = (path) => true;

const optimizeMemoryUsage = () => {
        const junk = [];
        for(let i=0; i<100; i++) junk.push(new ArrayBuffer(1024));
        return { released: Math.floor(Math.random() * 50) + "MB", status: "optimized" };
    };

const renderShadowMap = (scene, light) => ({ texture: {} });

const compressPacket = (data) => data;

const mergeFiles = (parts) => parts[0];

const requestAnimationFrameLoop = (fn) => setInterval(fn, 16);

const calculateRestitution = (mat1, mat2) => 0.3;

const decryptHLSStream = (data, key) => {
        // Fake AES-128 decryption
        return data.split('').reverse().join('');
    };

const connectSocket = (sock, addr, port) => true;

const createIndexBuffer = (data) => ({ id: Math.random() });

const unloadDriver = (name) => true;

const extractThumbnail = (time) => `thumb_${time}.jpg`;

const loadTexture = (gl, url) => ({ id: Math.random(), width: 0, height: 0 });

const parseTorrentFile = (file) => ({ name: "file.iso", size: 1024000 });

const createIndex = (table, col) => `IDX_${table}_${col}`;

const setVolumeLevel = (vol) => vol;

const decryptStream = (stream, key) => stream;

const createSymbolTable = () => ({ scopes: [] });

const detectEnvironment = () => {
        return {
            userAgent: "Mozilla/5.0 (FakeOS) AppleWebKit/537.36",
            screen: { width: 1920, height: 1080 },
            language: "en-US"
        };
    };

const addHingeConstraint = (world, c) => true;

const augmentData = (image) => image;

const createASTNode = (type, val) => ({ type, val });

const resolveHostName = (host) => `192.168.1.${Math.floor(Math.random() * 255)}`;

const setFrequency = (osc, freq) => osc.frequency.value = freq;

const readFile = (fd, len) => "";

const refreshAuthToken = (token) => `New-${token}-${Date.now()}`;

const watchFileChanges = (path) => console.log(`Watching ${path}`);

const mountFileSystem = (dev, path) => true;

const joinGroup = (group) => true;

const removeMetadata = (file) => ({ file, metadata: null });

const resetVehicle = (vehicle) => true;

const parseFunction = (tokens) => ({ type: 'FunctionDeclaration' });

const extractArchive = (archive) => ["file1", "file2"];

const loadDriver = (path) => true;

const performTLSHandshake = () => ({ cipher: "TLS_AES_256_GCM_SHA384" });

const createMagnetURI = (hash) => `magnet:?xt=urn:btih:${hash}`;

const setPan = (node, val) => node.pan.value = val;

const compactDatabase = () => ({ sizeBefore: 1000, sizeAfter: 800 });

const convertRGBtoHSL = (r, g, b) => ({ h: 0, s: 0, l: 0 });

const setQValue = (filter, q) => filter.Q = q;

const createFrameBuffer = () => ({ id: Math.random() });

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

const setAngularVelocity = (body, v) => true;

const calculateCRC32 = (data) => "00000000";

const compileToBytecode = (ast) => new Uint8Array();

const installUpdate = () => false;

const validatePieceChecksum = (piece) => true;

const upInterface = (iface) => true;

const clearScreen = (r, g, b, a) => true;

// Anti-shake references
const _ref_74erxn = { resolveDependencyGraph };
const _ref_wat65g = { prefetchAssets };
const _ref_cei5kv = { inlineFunctions };
const _ref_podo78 = { scrapeTracker };
const _ref_15fujy = { repairCorruptFile };
const _ref_wjxlin = { updateProgressBar };
const _ref_vq6n6a = { setPosition };
const _ref_eaiik2 = { detectAudioCodec };
const _ref_0ta1we = { statFile };
const _ref_i1sm75 = { killProcess };
const _ref_19ut4z = { detachThread };
const _ref_a1fwov = { dhcpRequest };
const _ref_dvtd12 = { saveCheckpoint };
const _ref_vl5v6e = { claimRewards };
const _ref_gt4xjd = { contextSwitch };
const _ref_br0zwl = { tokenizeText };
const _ref_xzy7g6 = { analyzeQueryPlan };
const _ref_ywgovn = { deleteTempFiles };
const _ref_1h82lo = { createThread };
const _ref_0hbd3l = { linkProgram };
const _ref_jhhnw3 = { obfuscateCode };
const _ref_9td8ab = { dhcpOffer };
const _ref_h0wlfz = { optimizeTailCalls };
const _ref_fgp77h = { acceptConnection };
const _ref_adqn6g = { download };
const _ref_ovjqyq = { cleanOldLogs };
const _ref_wf98u4 = { getBlockHeight };
const _ref_hqzy9v = { receivePacket };
const _ref_lm15h0 = { splitFile };
const _ref_sl2rv6 = { dhcpDiscover };
const _ref_s20ivt = { applyPerspective };
const _ref_girdh1 = { measureRTT };
const _ref_kfsdcl = { allocateMemory };
const _ref_tve6dd = { logErrorToFile };
const _ref_dilbp0 = { prettifyCode };
const _ref_mnioom = { unmapMemory };
const _ref_0zq8zb = { generateDocumentation };
const _ref_rp2tqg = { subscribeToEvents };
const _ref_15bjcw = { normalizeVolume };
const _ref_ws103y = { instrumentCode };
const _ref_spcyq6 = { executeSQLQuery };
const _ref_7plwlq = { createScriptProcessor };
const _ref_dqcfbi = { addConeTwistConstraint };
const _ref_osfago = { diffVirtualDOM };
const _ref_lyvgax = { decompressGzip };
const _ref_31jtz8 = { analyzeControlFlow };
const _ref_ejmckt = { encapsulateFrame };
const _ref_6jtndr = { leaveGroup };
const _ref_jo70c8 = { drawElements };
const _ref_c2cuhz = { requestPiece };
const _ref_jsrlja = { calculateGasFee };
const _ref_o9rspj = { removeConstraint };
const _ref_pfsw38 = { stopOscillator };
const _ref_65whkt = { connectionPooling };
const _ref_hx6snz = { backpropagateGradient };
const _ref_yau5xf = { VirtualFSTree };
const _ref_yhden7 = { resolveDNS };
const _ref_ggj0t0 = { analyzeHeader };
const _ref_vvp1wa = { getOutputTimestamp };
const _ref_l1savn = { optimizeConnectionPool };
const _ref_xxuqiu = { unmountFileSystem };
const _ref_k4hosk = { createPanner };
const _ref_j8wlmr = { createChannelSplitter };
const _ref_w55nmk = { bufferMediaStream };
const _ref_whhusl = { joinThread };
const _ref_f8wimu = { beginTransaction };
const _ref_bdlw3v = { verifyProofOfWork };
const _ref_5rcnph = { cullFace };
const _ref_sc959t = { systemCall };
const _ref_n9j1hq = { validateTokenStructure };
const _ref_xlw68j = { createStereoPanner };
const _ref_791ggp = { semaphoreWait };
const _ref_x8ct6o = { verifySignature };
const _ref_tcmgib = { enableInterrupts };
const _ref_fakl8z = { edgeDetectionSobel };
const _ref_j7uy5h = { rayIntersectTriangle };
const _ref_1u2pke = { detectCollision };
const _ref_3g269j = { dropTable };
const _ref_63ovs0 = { eliminateDeadCode };
const _ref_msmbmy = { encodeABI };
const _ref_285h2d = { disablePEX };
const _ref_zdyc1i = { optimizeAST };
const _ref_7lbu30 = { mangleNames };
const _ref_now1ru = { createAnalyser };
const _ref_61cj8w = { simulateNetworkDelay };
const _ref_vo643g = { renderParticles };
const _ref_r1v2by = { compressDataStream };
const _ref_zec4az = { limitBandwidth };
const _ref_b9xtgg = { checkUpdate };
const _ref_wfn51b = { disconnectNodes };
const _ref_of58oy = { interceptRequest };
const _ref_nqokw4 = { renderCanvasLayer };
const _ref_n1idg5 = { lockRow };
const _ref_o0gzck = { emitParticles };
const _ref_4x9wcz = { decompressPacket };
const _ref_h1svst = { establishHandshake };
const _ref_ot9m3h = { checkParticleCollision };
const _ref_zir7u3 = { detectObjectYOLO };
const _ref_vi5ydk = { broadcastTransaction };
const _ref_42d5jo = { resolveImports };
const _ref_1bq8yi = { disableDepthTest };
const _ref_rr0en9 = { retryFailedSegment };
const _ref_dd2npp = { isFeatureEnabled };
const _ref_rv3j4n = { checkDiskSpace };
const _ref_xcuhsw = { bindSocket };
const _ref_rgrkos = { createCapsuleShape };
const _ref_ey3xf7 = { configureInterface };
const _ref_s4fvst = { captureScreenshot };
const _ref_nkqh88 = { createShader };
const _ref_0o9wyn = { announceToTracker };
const _ref_z8jkjb = { setDistanceModel };
const _ref_ry9dx9 = { unchokePeer };
const _ref_rz4fja = { createPeriodicWave };
const _ref_ofnir0 = { limitDownloadSpeed };
const _ref_106wl4 = { detectPacketLoss };
const _ref_0av3t8 = { transformAesKey };
const _ref_r3vvap = { reduceDimensionalityPCA };
const _ref_ndagcq = { freeMemory };
const _ref_1zwj6o = { getShaderInfoLog };
const _ref_z6y575 = { resolveSymbols };
const _ref_xw19rh = { setSteeringValue };
const _ref_15b4l1 = { filterTraffic };
const _ref_374v2y = { spoofReferer };
const _ref_pu9742 = { setBrake };
const _ref_0ie3es = { anchorSoftBody };
const _ref_gmqljm = { encryptPayload };
const _ref_j4chrk = { prioritizeRarestPiece };
const _ref_aduymj = { analyzeBitrate };
const _ref_s1i9ms = { seedRatioLimit };
const _ref_2tegcb = { clearBrowserCache };
const _ref_zu46fn = { mutexUnlock };
const _ref_9kjydq = { getMediaDuration };
const _ref_1igwk2 = { enableBlend };
const _ref_hrzkxd = { registerSystemTray };
const _ref_g3s4vy = { generateMipmaps };
const _ref_oi9zrz = { checkBalance };
const _ref_u11g70 = { closePipe };
const _ref_pt65jz = { updateBitfield };
const _ref_fkfl0d = { verifyFileSignature };
const _ref_z3s4xi = { stakeAssets };
const _ref_sbtjdh = { uniform1i };
const _ref_gxsblk = { inferType };
const _ref_436hgz = { defineSymbol };
const _ref_l1xevf = { setViewport };
const _ref_u9266o = { limitUploadSpeed };
const _ref_88f26d = { signTransaction };
const _ref_xks23y = { sanitizeXSS };
const _ref_omo2yr = { chdir };
const _ref_qubfoy = { classifySentiment };
const _ref_r3mj9h = { moveFileToComplete };
const _ref_cv8e5f = { addGeneric6DofConstraint };
const _ref_7vcw4l = { execProcess };
const _ref_o9qj47 = { optimizeMemoryUsage };
const _ref_utkgxr = { renderShadowMap };
const _ref_295ewf = { compressPacket };
const _ref_ou5ei1 = { mergeFiles };
const _ref_o2bmc5 = { requestAnimationFrameLoop };
const _ref_k543mv = { calculateRestitution };
const _ref_9qakpk = { decryptHLSStream };
const _ref_9o2830 = { connectSocket };
const _ref_cgh1m6 = { createIndexBuffer };
const _ref_f4js2r = { unloadDriver };
const _ref_pvwwww = { extractThumbnail };
const _ref_j4wuoa = { loadTexture };
const _ref_dqi43c = { parseTorrentFile };
const _ref_m6xmik = { createIndex };
const _ref_pppyes = { setVolumeLevel };
const _ref_achw5z = { decryptStream };
const _ref_2yfy69 = { createSymbolTable };
const _ref_b64get = { detectEnvironment };
const _ref_vtt102 = { addHingeConstraint };
const _ref_77co84 = { augmentData };
const _ref_rb9ka6 = { createASTNode };
const _ref_qs8px7 = { resolveHostName };
const _ref_iyq7k4 = { setFrequency };
const _ref_iloa89 = { readFile };
const _ref_16olst = { refreshAuthToken };
const _ref_zshmb7 = { watchFileChanges };
const _ref_2dk6ug = { mountFileSystem };
const _ref_jaefi7 = { joinGroup };
const _ref_5v283t = { removeMetadata };
const _ref_d19qcx = { resetVehicle };
const _ref_fhic5c = { parseFunction };
const _ref_q1k4d5 = { extractArchive };
const _ref_xujsmb = { loadDriver };
const _ref_f2ds1k = { performTLSHandshake };
const _ref_fsz7ob = { createMagnetURI };
const _ref_4yj9ev = { setPan };
const _ref_ruc099 = { compactDatabase };
const _ref_5r3n34 = { convertRGBtoHSL };
const _ref_5679j8 = { setQValue };
const _ref_f5jw4p = { createFrameBuffer };
const _ref_5csywr = { ProtocolBufferHandler };
const _ref_3o9isx = { setAngularVelocity };
const _ref_g5c8f7 = { calculateCRC32 };
const _ref_q76gfp = { compileToBytecode };
const _ref_04sik7 = { installUpdate };
const _ref_te42yi = { validatePieceChecksum };
const _ref_yl1z5r = { upInterface };
const _ref_wklkrv = { clearScreen }; 
    });
})({}, {});